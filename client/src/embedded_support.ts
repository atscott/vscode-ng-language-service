/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

/** Determines if the position is inside an inline template. */
export function isInsideTemplateRegion(documentText: string, offset: number): boolean {
  const regex = new RegExp(
      /((?<=(template|templateUrl)\s*?:\s*)`.*?(?<!\\)`\s*?(?=(,|})))|((?<=(template|templateUrl)\s*?:\s*)'.*?(?<!\\)'\s*?(?=(,|})))/gims);
  return isPositionInAMatch(documentText, regex, offset)
}

export function isInsideStyleUrlsArray(documentText: string, offset: number) {
  const regex = new RegExp(/((?<=(styleurls)\s*?:\s*)\[.*\](?=(,|})))/gims);
  return isPositionInAMatch(documentText, regex, offset)
}

function isPositionInAMatch(text: string, regex: RegExp, position: number) {
  let regExpArray: RegExpExecArray|null;
  while ((regExpArray = regex.exec(text)) !== null) {
    const match = regExpArray[0];

    if ((regex.lastIndex - match.length) <= position && regex.lastIndex > position) {
      return true;
    } else if (regex.lastIndex > position) {
      return false;
    }
  }

  return false;
}

/** Determines if the position is inside an inline template, templateUrl, or string in styleUrls. */
export function isInsideAngularContext(documentText: string, offset: number): boolean {
  return isInsideTemplateRegion(documentText, offset) ||
      isInsideStyleUrlsArray(documentText, offset);
}