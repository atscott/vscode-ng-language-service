/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import {isInsideAngularContext, isInsideTemplateRegion} from '../embedded_support';

describe('embedded language support', () => {
  describe('isInsideInlineTemplateRegion', () => {
    it('empty file', () => {
      test('¦', isInsideTemplateRegion, false);
    });

    it('just after template', () => {
      test(`{template: '<div></div>'¦}`, isInsideTemplateRegion, false);
    });

    it('just before template', () => {
      test(`{template:¦ '<div></div>'}`, isInsideTemplateRegion, false);
    });

    it('at beginning of template', () => {
      test(`{template: '¦<div></div>'}`, isInsideTemplateRegion, true);
    });

    it('at end of template', () => {
      test(`{template: '<div></div>¦'}`, isInsideTemplateRegion, true);
    });

    it('multiline template', () => {
      test(
          `
      {
        selector: 'abc',
        template: \`
                <div></div>
                <div></div>
                <div></div>¦
                <div></div>
                \`
      }`,
          isInsideTemplateRegion, true);
    });
  });

  describe('isInsideAngularContext', () => {
    it('empty file', () => {
      test('¦', isInsideAngularContext, false);
    });

    it('just after template', () => {
      test(`{template: '<div></div>'¦}`, isInsideAngularContext, false);
    });

    it('inside template', () => {
      test(`{template: '<div>¦</div>'}`, isInsideAngularContext, true);
    });

    it('just after templateUrl', () => {
      test(`{templateUrl: './abc.html'¦}`, isInsideAngularContext, false);
    });

    it('inside templateUrl', () => {
      test(`{templateUrl: './abc¦.html'}`, isInsideAngularContext, true);
    });

    it('just after styleUrls', () => {
      test(`{styleUrls: ['./abc.css']¦}`, isInsideAngularContext, false);
    });

    it('inside first item of styleUrls', () => {
      test(`{styleUrls: ['./abc.c¦ss', 'def.css']}`, isInsideAngularContext, true);
    });

    it('inside second item of styleUrls', () => {
      test(`{styleUrls: ['./abc.css', 'def¦.css']}`, isInsideAngularContext, true);
    });

    it('inside second item of styleUrls, when first is complicated function', () => {
      test(
          `{styleUrls: [getCss({strict: true, dirs: ['apple', 'banana']}), 'def¦.css']}`,
          isInsideAngularContext, true);
    });

    it('inside non-string item of styleUrls', () => {
      test(
          `{styleUrls: [getCss({strict: true¦, dirs: ['apple', 'banana']}), 'def.css']}`,
          isInsideAngularContext, true);
    });
  });
});

function test(
    fileWithCursor: string, testFn: (doc: string, position: number) => boolean,
    expectation: boolean): void {
  const {cursor, text} = extractCursorInfo(fileWithCursor);
  const actual = testFn(text, cursor);
  expect(actual).toBe(expectation);
}

/**
 * Given a text snippet which contains exactly one cursor symbol ('¦'), extract both the offset of
 * that cursor within the text as well as the text snippet without the cursor.
 */
function extractCursorInfo(textWithCursor: string): {cursor: number, text: string} {
  const cursor = textWithCursor.indexOf('¦');
  if (cursor === -1 || textWithCursor.indexOf('¦', cursor + 1) !== -1) {
    throw new Error(`Expected to find exactly one cursor symbol '¦'`);
  }

  return {
    cursor,
    text: textWithCursor.substr(0, cursor) + textWithCursor.substr(cursor + 1),
  };
}