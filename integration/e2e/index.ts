import {runTests} from '@vscode/test-electron';
import {join} from 'path';

import {PACKAGE_ROOT, PROJECT_PATH} from '../test_constants';

// https://code.visualstudio.com/api/working-with-extensions/testing-extension
async function main() {
  const EXT_DEVELOPMENT_PATH = join(PACKAGE_ROOT, 'dist', 'npm');
  const EXT_TESTS_PATH = join(PACKAGE_ROOT, 'dist', 'integration', 'e2e', 'mocha');

  try {
    await runTests({
      // Keep version in sync with vscode engine version in package.json
      version: '1.69.1',
      extensionDevelopmentPath: EXT_DEVELOPMENT_PATH,
      extensionTestsPath: EXT_TESTS_PATH,
      launchArgs: [
        PROJECT_PATH,
        // This disables all extensions except the one being tested
        '--disable-extensions',
      ],
    });
  } catch (err) {
    console.error('Failed to run tests', err);
    process.exit(1);
  }
}

main();
