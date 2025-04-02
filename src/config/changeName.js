const fs = require('fs');
const path = require('path');
// 示例数组
const emojiArray = require('./emoji.json');

/**
 * 根据 cn 字段匹配文件并重命名
 * @param {string} directory - 文件夹路径
 * @param {Array} emojiData - 表情数据数组
 */
function renameFiles(directory, emojiData) {
  // 读取目录中的所有文件
  fs.readdir(directory, (err, files) => {
    if (err) {
      console.error('无法读取目录:', err);
      return;
    }

    let map = {};

    // 遍历表情数据数组
    emojiData.forEach((emoji, index) => {
      const targetFileName = emoji.cn.replace(/\[(.*)\]/g, '$1'); // 去掉方括号，得到纯文本，如 "猪头"
      const newFileName = path.basename(emoji.src); // 提取新文件名，如 "PigHead.png"

      // 查找匹配的文件
      const matchedFile = files.find((file) => {
        const fileNameWithoutExt = path.parse(file).name; // 获取文件名（不带扩展名）
        const fileName = fileNameWithoutExt.replace(/\d+_(.*)/g, '$1');
        return fileName === targetFileName;
      });

      if (matchedFile) {
        const oldFilePath = path.join(directory, matchedFile); // 旧文件路径
        const newFilePath = path.join(directory, "../emojis/", newFileName); // 新文件路径

        if (!map[matchedFile]) {
          map[matchedFile] = newFileName;
        } else {
          console.warn(`重复文件: ${matchedFile}`);
        }

        // 重命名文件
        const contents = fs.readFileSync(oldFilePath);
        fs.writeFileSync(newFilePath, contents);

        // 重命名文件
        // fs.rename(oldFilePath, newFilePath, (renameErr) => {
        //   if (renameErr) {
        //     console.error(`重命名失败: ${oldFilePath} -> ${newFilePath}`, renameErr);
        //   } else {
        //     console.log(`重命名成功: ${oldFilePath} -> ${newFilePath}`);
        //   }
        // });
      } else {
        console.warn(`未找到匹配文件: ${targetFileName}`);
      }
    });
  });
}

// 调用方法
const directoryPath = './origin-emojis'; // 替换为实际的文件夹路径
renameFiles(directoryPath, emojiArray);
