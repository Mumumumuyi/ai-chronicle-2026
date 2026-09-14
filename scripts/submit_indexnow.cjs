// IndexNow & Search Engine Automatic Indexing Push Script
// Pushes all URLs in sitemap to Bing & IndexNow API endpoints for near-instant indexing

const https = require('https');

const HOST = 'mumumumuyi.github.io';
const KEY = 'c7a456e3f281483ea190105307b22108'; // Example 32-char key for IndexNow
const KEY_LOCATION = `https://${HOST}/ai-chronicle-2026/${KEY}.txt`;

const URL_LIST = [
  `https://${HOST}/ai-chronicle-2026/`,
  `https://${HOST}/ai-chronicle-2026/index.html`,
  `https://${HOST}/ai-chronicle-2026/sitemap.xml`,
];

const payload = JSON.stringify({
  host: HOST,
  key: KEY,
  keyLocation: KEY_LOCATION,
  urlList: URL_LIST,
});

console.log('1. 准备向 IndexNow API 提交站点 URL 集合以加速搜索与 GEO 引擎抓取...');
console.log(`- 目标 Host: ${HOST}`);
console.log(`- 提交 URL 数: ${URL_LIST.length}`);

const options = {
  hostname: 'api.indexnow.org',
  port: 443,
  path: '/IndexNow',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json; charset=utf-8',
    'Content-Length': Buffer.byteLength(payload),
  },
};

const req = https.request(options, (res) => {
  console.log(`2. IndexNow API 响应状态码: ${res.statusCode} (${res.statusMessage})`);
  let data = '';
  res.on('data', (chunk) => (data += chunk));
  res.on('end', () => {
    if (res.statusCode === 200 || res.statusCode === 202) {
      console.log('✓ 成功！搜索引擎（Bing、Yandex、Naver、Seznam）已接收 URL 推送并在抓取队列中生效。');
    } else {
      console.log(`IndexNow 状态通知: ${res.statusCode} (通常 202 为异步排队中，200 为即时确认)`);
    }
  });
});

req.on('error', (e) => {
  console.error(`提交出错: ${e.message}`);
});

req.write(payload);
req.end();
