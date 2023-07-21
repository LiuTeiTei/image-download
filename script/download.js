const https = require('https');
const fs = require('fs');
const path = require('path');

const dirName = '漫画'
const baseUrl = 'https://img.acgn.cc/img/24800/24714/';
const startHash = 1;
const imageFormat = '.jpg'
const totalImages = 10; // 假设有 10 张图片需要下载

const downloadImage = (imageUrl, filePath) => {
  return new Promise((resolve, reject) => {
    https.get(imageUrl, (response) => {
      if (response.statusCode !== 200) {
        reject(new Error(`Failed to download image. Status: ${response.statusCode} - ${response.statusMessage}`));
        return;
      }

      const fileStream = fs.createWriteStream(filePath);
      response.pipe(fileStream);
      fileStream.on('finish', () => {
        fileStream.close();
        console.log(`Image downloaded successfully: ${filePath}`);
        resolve();
      });
    }).on('error', (error) => {
      reject(error);
    });
  });
};

const downloadAllImages = async () => {
  try {
    for (let i = startHash; i <= totalImages; i++) {
      const imageUrl = `${baseUrl}${i}${imageFormat}`;
      const fileName = `${i}${imageFormat}`;
      const downloadPath = path.join(__dirname, dirName, fileName);

      await downloadImage(imageUrl, downloadPath);
    }
  } catch (error) {
    console.error('Error downloading images:', error);
  }
};

// 创建存储漫画的目录
const imagesDirectory = path.join(__dirname, dirName);
if (!fs.existsSync(imagesDirectory)) {
  fs.mkdirSync(imagesDirectory);
}
// 开始下载漫画
downloadAllImages();
