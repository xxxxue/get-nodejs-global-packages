const { exec } = require("child_process");

/**
 * node ./main.js
 * 输出 : 
 * npm install -g bun pnpm tsx yarn
 */

/**
 * 指定版本号
 * node ./main.js -v
 * 输出 : 
 * npm install -g bun@1.1.5 pnpm@8.15.3 tsx@4.7.3 yarn@1.22.21
 */


/**
// 举例 

// 先执行脚本
node ./main.js -v

// 开始操作 nvm
nvm list available
nvm install 22.1.0
nvm use 22.1.0
nvm list
nvm uninstall 21.6.2

// 执行脚本输出的 install 命令
npm install -g bun@1.1.5 pnpm@8.15.3 tsx@4.7.3 yarn@1.22.21

// 等待安装完成....
 */


let args = process.argv;
// "-v" 限制安装的版本号
let hasVersionTag = args.findIndex((v) => v == "-v") > 0;

exec("npm list -g -json", (err, stdout, stderr) => {
  if (err) {
    console.log(err);
    return;
  }

  let data = JSON.parse(stdout);

  let dependencies = data["dependencies"];
  if (dependencies == undefined) {
    console.error("dependencies 为空");
    return;
  }

  let packageNameList = [];

  for (const keyName in dependencies) {
    if (["npm", "corepack"].includes(keyName)) {
      continue;
    }

    let version = dependencies[keyName].version;

    let packageName = hasVersionTag ? `${keyName}@${version}` : keyName;

    packageNameList.push(packageName);
  }

  let commandStr = `npm install -g ${packageNameList.join(" ")}`;

  console.log("---------------");
  console.log(commandStr);
  console.log("---------------");
});
