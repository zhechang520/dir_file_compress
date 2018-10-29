## 压缩整个目录下的所有js文件.

```
// 使用示例：
const compresser = require('./compress');
compresser.gen({
  // 需要压缩的目录地址
  rootPath: '/Users/ocean/Documents/workspace/yjiyun/git/ygroup',
  // 目录压缩后的地址
  newRootPath: '/Users/ocean/Documents/workspace/yjiyun/git/private_package/ygroup',
  // 忽略的目录
  ignore: ['/node_modules'],
  // 完成后需要删除的目录
  deletePath: [
    '/.idea',
    '/.vscode',
    '/node_modules',
    '/LICENSE',
    '/README.md'
  ]
});
```