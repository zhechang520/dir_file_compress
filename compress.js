const uglify = require("uglify-es");
const fs = require("fs");
const glob = require("glob");
const path = require("path");
const exec = require('child_process').exec;

const comoress = {
  gen: function(option) {
    let rootPath = option["rootPath"];
    let newRootPath = option["newRootPath"];
    let ignorePath = option['ignore'];
    let deletePath = option['deletePath'];

    console.log('=== 开始执行压缩 ===');
    console.log('=== 正在迁移目录 ===');
    console.log(`cp -rf ${rootPath} ${newRootPath}`);

    // 先将原路径copy过来
    const child = exec(`cp -rf ${rootPath} ${newRootPath}`, function(err, stdout, stderr) {
      if (err) {
        throw err;
      }
      console.log('=== 目录迁移成功 ===');
      fileDisplay(rootPath);
      console.log('=== 正在写入文件 ===');

      console.log('=== 请稍后等待执行结束... ===');

      setTimeout(function(){
        // 删除文件
        exec(`cd ${newRootPath} && find . -name ".git" | xargs rm -Rf`,function(err, stdout, stderr){
          console.log('=== 删除git信息 ===');
        });

        for(let i = 0;i<deletePath.length;i++){
          let deletePathItem = `${newRootPath}${deletePath[i]}`;
          exec(`rm -rf ${deletePathItem}`,function(err, stdout, stderr){
            console.log(`=== 删除目录 === ${deletePathItem}`);
          });
        }
      },15*1000);
    });

    function fileDisplay(filePath) {
      fs.readdir(filePath, function(err, files) {
        if (err) {
          console.warn(err);
        } else {
          //遍历读取到的文件列表
          files.forEach(function(filename) {
            //获取当前文件的绝对路径
            var filedir = path.join(filePath, filename);
            // 根据文件路径获取文件信息，返回一个fs.Stats对象
            fs.stat(filedir, function(eror, stats) {
              if (eror) {
                console.warn("获取文件stats失败");
              } else {
                var isFile = stats.isFile(); // 是文件
                var isDir = stats.isDirectory(); // 是文件夹
                if (isFile) {
                  // 读取到文件,处理压缩,copy等动作
                  // 读取文件内容
                  let fileData = fs.readFileSync(filedir, "utf-8");
                  let fileContent = fileData;
                  let filesuffix = filedir.substring(filedir.lastIndexOf('.')+1,filedir.length);
                  let isConfig = filedir.indexOf('config') > -1;

                  if (filesuffix === 'js' && !isConfig) {
                    // 是js.
                    fileContent = uglify.minify(fileData).code;
                    // 写文件
                    let writePath = filedir.replace(rootPath, newRootPath);
                    write(writePath, fileContent);

                    console.log(`=== 文件打包 === ${filedir}`);
                  }
                }
                if (isDir) {
                  let isIgnore =  false;
                  for(let i = 0 ;i<ignorePath.length;i++){
                    let ignoreItem = ignorePath[i];
                    if(filedir.indexOf(ignoreItem) > -1){
                      // 忽略
                      isIgnore = true;
                    }
                  }
                  if(!isIgnore){
                    fileDisplay(filedir); //递归，如果是文件夹，就继续遍历该文件夹下面的文件
                  }
                }
              }
            });
          });
        }
      });
    }

    // 递归创建目录
    function mkdirsSync(dirname) {
      if (!fs.existsSync(dirname)) {
        fs.mkdirSync(dirname);
      }
    }

    function write(path, content) {
      fs.open(path, "w", 0644, function (e, fd) {
        try {
          fs.writeSync(fd, content, 0, 'utf8'); 
          // function (e) {
          //   fs.closeSync(fd);
          // })
        }catch(err){
          console.log('write error:',err);
        }
      });
    }
  }
};

module.exports = comoress;
