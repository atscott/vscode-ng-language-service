/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

import {expect} from 'chai';
import {isAbsolute, resolve} from 'path';

import {resolveNgLangSvc, resolveTsServer} from '../version_provider';

describe('Node Module Resolver', () => {
  const probeLocations = [__dirname];

  it('should be able to resolve tsserver', () => {
    const result = resolveTsServer(probeLocations);
    expect(result).not.to.be.undefined;
    expect(result.resolvedPath).to.match(/typescript\/lib\/tsserverlibrary.js$/);
  });

  it('should resolve tsserver from typescript.tsdk provided as fs path', () => {
    // Resolve relative to cwd.
    const absPath = resolve('node_modules/typescript/lib');
    expect(isAbsolute(absPath)).to.equal(true);
    const result = resolveTsServer([absPath]);
    expect(result.resolvedPath.endsWith('typescript/lib/tsserverlibrary.js')).to.equal(true);
  });

  it('should be able to resolve Angular language service', () => {
    const result = resolveNgLangSvc(probeLocations);
    expect(result.resolvedPath.endsWith('@angular/language-service/index.js')).to.equal(true);
  });
});
