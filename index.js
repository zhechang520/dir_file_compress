
const compresser = require('./compress');

compresser.gen({
  rootPath: '/Users/ocean/Documents/workspace/test',
  newRootPath: '/Users/ocean/Documents/workspace/dir_file_compress/dist/test',
  // 忽略的目录
  ignore: [
    '/.idea',
    '/.vscode',
    '/docs',
    '/logs',
    '/run',
    '/script',
    '/node_modules',
    '/locales'
  ],
  // 完成后需要删除的目录
  deletePath: [
    '/.idea',
    '/.vscode',
    '/docs',
    '/logs',
    '/run',
    '/script',
    '/LICENSE',
    '/README.md'
  ]
});