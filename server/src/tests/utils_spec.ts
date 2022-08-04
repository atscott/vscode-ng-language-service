/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

import {expect} from 'chai';
import {filePathToUri, MruTracker, uriToFilePath} from '../utils';

describe('filePathToUri', () => {
  it('should return URI with File scheme', () => {
    const uri = filePathToUri('/project/main.ts');
    expect(uri).to.match(/^file/);
  });

  it('should handle network path', () => {
    const uri = filePathToUri('//project/main.ts');
    expect(uri).to.eql('file://project/main.ts');
  });

  if (process.platform === 'win32') {
    it('should handle windows path', () => {
      const uri = filePathToUri('C:\\project\\main.ts');
      expect(uri).to.eql('file:///c%3A/project/main.ts');
    });
  }
});

describe('uriToFilePath', () => {
  if (process.platform === 'win32') {
    it('should return valid fsPath for windows', () => {
      const filePath = uriToFilePath('file:///c%3A/project/main.ts');
      expect(filePath).to.eql('c:\\project\\main.ts');
    });

    it('should return valid fsPath for network file uri', () => {
      const filePath = uriToFilePath('file://project/main.ts');
      expect(filePath).to.eql('\\\\project\\main.ts');
    });
  }

  if (process.platform !== 'win32') {
    it('should return valid fsPath for unix', () => {
      const filePath = uriToFilePath('file:///project/main.ts');
      expect(filePath).to.eql('/project/main.ts');
    });

    it('should return valid fsPath for network file uri', () => {
      const filePath = uriToFilePath('file://project/main.ts');
      expect(filePath).to.eql('//project/main.ts');
    });
  }
});


describe('MruTracker', () => {
  it('should track new items', () => {
    const tracker = new MruTracker();
    tracker.update('a');
    expect(tracker.getAll()).to.eql(['a']);
  });

  it('should delete existing items', () => {
    const tracker = new MruTracker();
    tracker.update('a');
    tracker.delete('a');
    expect(tracker.getAll()).to.eql([]);
  });

  it('should allow deletion of item that does not exist', () => {
    const tracker = new MruTracker();
    tracker.delete('a');
    expect(tracker.getAll()).to.eql([]);
  });

  it('should return items in most recently used order', () => {
    const tracker = new MruTracker();
    tracker.update('a');
    tracker.update('b');
    expect(tracker.getAll()).to.eql(['b', 'a']);
  });

  it('should update existing item', () => {
    const tracker = new MruTracker();
    tracker.update('a');
    tracker.update('b');
    tracker.update('a');
    expect(tracker.getAll()).to.eql(['a', 'b']);
  });
});