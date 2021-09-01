import * as ts from 'typescript';

/** Takes a TS file and strips out all non-inline template content */
export function getHTMLVirtualContent(documentText: string): string {
  const sf =
      ts.createSourceFile('test', documentText, ts.ScriptTarget.ESNext, true /* setParentNodes */);
  const inlineTemplateNodes: ts.Node[] = findAllMatchingNodes(sf, isInlineTemplateNode);

  // blank document with same text length
  let content = documentText.split('\n')
                    .map(line => {
                      return ' '.repeat(line.length);
                    })
                    .join('\n');

  // add back all the inline template regions in-place
  inlineTemplateNodes.forEach(r => {
    content = content.slice(0, r.getStart(sf) + 1) +
        documentText.slice(r.getStart(sf) + 1, r.getEnd() - 1) + content.slice(r.getEnd() - 1);
  });
  return content;
}

function isInlineTemplateNode(node: ts.Node) {
  const asgn = getPropertyAssignmentFromValue(node, 'template');
  return ts.isStringLiteralLike(node) && asgn !== null &&
      getClassDeclFromDecoratorProp(asgn) !== null;
}

/**
 * Returns a property assignment from the assignment value if the property name
 * matches the specified `key`, or `null` if there is no match.
 */
export function getPropertyAssignmentFromValue(value: ts.Node, key: string): ts.PropertyAssignment|
    null {
  const propAssignment = value.parent;
  if (!propAssignment || !ts.isPropertyAssignment(propAssignment) ||
      propAssignment.name.getText() !== key) {
    return null;
  }
  return propAssignment;
}

/**
 * Given a decorator property assignment, return the ClassDeclaration node that corresponds to the
 * directive class the property applies to.
 * If the property assignment is not on a class decorator, no declaration is returned.
 *
 * For example,
 *
 * @Component({
 *   template: '<div></div>'
 *   ^^^^^^^^^^^^^^^^^^^^^^^---- property assignment
 * })
 * class AppComponent {}
 *           ^---- class declaration node
 *
 * @param propAsgnNode property assignment
 */
export function getClassDeclFromDecoratorProp(propAsgnNode: ts.PropertyAssignment):
    ts.ClassDeclaration|undefined {
  if (!propAsgnNode.parent || !ts.isObjectLiteralExpression(propAsgnNode.parent)) {
    return;
  }
  const objLitExprNode = propAsgnNode.parent;
  if (!objLitExprNode.parent || !ts.isCallExpression(objLitExprNode.parent)) {
    return;
  }
  const callExprNode = objLitExprNode.parent;
  if (!callExprNode.parent || !ts.isDecorator(callExprNode.parent)) {
    return;
  }
  const decorator = callExprNode.parent;
  if (!decorator.parent || !ts.isClassDeclaration(decorator.parent)) {
    return;
  }
  const classDeclNode = decorator.parent;
  return classDeclNode;
}

export function findAllMatchingNodes(
    sf: ts.SourceFile, filter: (node: ts.Node) => boolean): ts.Node[] {
  const results: ts.Node[] = [];
  const stack: ts.Node[] = [sf];

  while (stack.length > 0) {
    const node = stack.pop()!;

    if (filter(node)) {
      results.push(node);
    } else {
      stack.push(...node.getChildren());
    }
  }

  return results;
}