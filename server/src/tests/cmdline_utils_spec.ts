/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

import {expect} from 'chai';
import {parseCommandLine} from '../cmdline_utils';

describe('parseCommandLine', () => {
  it('should parse "help"', () => {
    const options = parseCommandLine(['--help']);
    expect(options.help).to.eql(true);
  });

  it('should parse "logFile"', () => {
    const options = parseCommandLine(['--logFile', 'foo.log']);
    expect(options.logFile).to.eql('foo.log');
  });

  it('should parse "logVerbosity"', () => {
    const options = parseCommandLine(['--logVerbosity', 'normal']);
    expect(options.logVerbosity).to.eql('normal');
  });

  it('should parse "ngProbeLocations"', () => {
    const options = parseCommandLine(['--ngProbeLocations', '/foo,/bar']);
    expect(options.ngProbeLocations).to.eql(['/foo', '/bar']);
  });

  it('should parse "tsProbeLocations"', () => {
    const options = parseCommandLine(['--tsProbeLocations', '/baz,/qux']);
    expect(options.tsProbeLocations).to.eql(['/baz', '/qux']);
  });
});
