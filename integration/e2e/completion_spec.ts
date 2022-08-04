
import * as assert from 'assert';
import {before, suite, test} from 'mocha';
import * as vscode from 'vscode';

// You can import and use all API from the 'vscode' module
// as well as import your extension to test it
// import * as myExtension from '../extension';
import {activate, COMPLETION_COMMAND, FOO_TEMPLATE_URI} from './helper';

suite('Angular Ivy LS completions', () => {
  before(async () => {
    await activate(FOO_TEMPLATE_URI);
  });

  test('does not duplicate HTML completions in external templates', async () => {
    const position = new vscode.Position(0, 0);
    const completionItem = await vscode.commands.executeCommand<vscode.CompletionList>(
        COMPLETION_COMMAND, FOO_TEMPLATE_URI, position);
    const regionCompletions = (completionItem?.items?.filter(i => i.label === '#region') ?? []);
    assert.strictEqual(1, regionCompletions.length);
  });
});
