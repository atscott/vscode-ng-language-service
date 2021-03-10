const esbuild = require('esbuild');
const fs = require('fs');

const defaultOptions = {
  bundle: true,
  minify: true,
  platform: 'node',
  logLevel: 'info',
};

/** @type esbuild.BuildOptions */
const clientConfig = {
  ...defaultOptions,
  entryPoints: ['dist/client/extension.js'],
  outfile: 'dist/npm/index.js',
  external: [
    'fs',
    'path',
    'vscode',
    'vscode-languageclient/node',
    'vscode-languageserver-protocol',
    'vscode-jsonrpc',
  ],
  format: 'cjs',
};

/** @type esbuild.BuildOptions */
const bannerConfig = {
  ...defaultOptions,
  minify: false,
  entryPoints: ['dist/banner/banner.js'],
  outfile: 'dist/banner/banner.esbuild.js',
  external: [
    'path',
  ],
  format: 'cjs',
};

/** @type esbuild.BuildOptions */
const serverConfig = {
  ...defaultOptions,
  entryPoints: ['dist/server/server.js'],
  outfile: 'dist/npm/server/index.js',
  external: [
    'fs',
    'path',
    'typescript/lib/tsserverlibrary',
    'vscode-languageserver',
    'vscode-uri',
    'vscode-jsonrpc',
  ],
  format: 'iife',
};

async function build() {
  try {
    await esbuild.build(clientConfig);
    await esbuild.build(bannerConfig);
    await esbuild.build({
      ...serverConfig,
      banner: {js: fs.readFileSync('dist/banner/banner.esbuild.js', 'utf8')},
    });
  } catch (e) {
    process.exit(1);
  }
}

build();