import * as assert from 'assert';
import {before, suite, test} from 'mocha';
import * as vscode from 'vscode';

import {APP_COMPONENT} from '../test_constants';

import {activate} from './helper';

const DEFINITION_COMMAND = 'vscode.executeDefinitionProvider';
const APP_COMPONENT_URI = vscode.Uri.file(APP_COMPONENT);

suite('Angular Ivy LS definitions', () => {
  before(async () => {
    await activate(APP_COMPONENT_URI);
  });

  test(`returns definition for variable in template`, async () => {
    // vscode Position is zero-based
    //   template: `<h1>Hello {{name}}</h1>`,
    //                          ^-------- here
    const position = new vscode.Position(4, 25);
    // For a complete list of standard commands, see
    // https://code.visualstudio.com/api/references/commands
    const definitions = await vscode.commands.executeCommand<vscode.LocationLink[]>(
        DEFINITION_COMMAND, APP_COMPONENT_URI, position);
    assert.strictEqual(1, definitions?.length);
    const def = definitions![0];
    assert.strictEqual(APP_COMPONENT, def.targetUri.fsPath);  // in the same document
    const {start, end} = def.targetRange;
    // Should start and end on line 6
    assert.strictEqual(7, start.line);
    assert.strictEqual(7, end.line);
    assert.strictEqual(2, start.character);
    assert.strictEqual(start.character + `name`.length, end.character);
  });
});
