// Automated Search Engine & IndexNow Push Utility
// Submits sitemaps and URLs to Google, Bing, IndexNow, Yandex, and Naver
const https = require('https');
const http = require('http');

const { getSegments } = require('./site_segments.cjs');

const HOST = 'mumumumuyi.github.io';
const SITEMAP_ROOT = `https://${HOST}/sitemap.xml`;
const KEY = 'c7a456e3f281483ea190105307b22108';
const KEY_LOCATION = `https://${HOST}/${KEY}.txt`;

// Canonical URLs only: the /ai-chronicle-2026/ mirror canonicalises to the
// root domain, so its URLs are deliberately not submitted.
const URL_LIST = [
  ...getSegments().map((s) => `https://${HOST}/${s ? s + '/' : ''}`),
  SITEMAP_ROOT,
];

async function pingUrl(targetUrl) {
  return new Promise((resolve) => {
    const client = targetUrl.startsWith('https') ? https : http;
    const req = client.get(targetUrl, (res) => {
      resolve({ url: targetUrl, status: res.statusCode, msg: res.statusMessage });
    });
    req.on('error', (err) => {
      resolve({ url: targetUrl, status: 0, msg: err.message });
    });
    req.setTimeout(8000, () => {
      req.destroy();
      resolve({ url: targetUrl, status: 408, msg: 'Timeout' });
    });
  });
}

async function submitIndexNow() {
  const payload = JSON.stringify({
    host: HOST,
    key: KEY,
    keyLocation: KEY_LOCATION,
    urlList: URL_LIST,
  });

  return new Promise((resolve) => {
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
      let data = '';
      res.on('data', (c) => (data += c));
      res.on('end', () => {
        resolve({ status: res.statusCode, msg: res.statusMessage, body: data });
      });
    });

    req.on('error', (e) => {
      resolve({ status: 0, msg: e.message });
    });

    req.write(payload);
    req.end();
  });
}

async function runPush() {
  console.log('====================================================');
  console.log('🚀 正在启动全自动搜索引擎推送与收录提速引擎...');
  console.log(`- 根域名 Sitemap: ${SITEMAP_ROOT}`);
  console.log(`- 推送深度路由数: ${URL_LIST.length}`);
  console.log('====================================================\n');

  // 1. IndexNow Push (Bing, Yandex, Seznam, Naver)
  console.log('1. 向 IndexNow API 批量推送全站深度路由...');
  const indexNowRes = await submitIndexNow();
  if (indexNowRes.status === 200 || indexNowRes.status === 202) {
    console.log(`   ✓ IndexNow 响应 [${indexNowRes.status}]：Bing、Yandex 搜索抓取队列已接收推送！`);
  } else {
    console.log(`   ! IndexNow 响应 [${indexNowRes.status}]: ${indexNowRes.msg}`);
  }

  // 2. Bing Sitemap Ping
  console.log('\n2. 向 Microsoft Bing 提交最新 Sitemap 变更通知...');
  const bingPingRoot = await pingUrl(`https://www.bing.com/ping?sitemap=${encodeURIComponent(SITEMAP_ROOT)}`);
  console.log(`   ✓ Bing Root Sitemap Ping [${bingPingRoot.status}]: ${bingPingRoot.msg}`);

  // 3. Google Sitemap Ping
  console.log('\n3. 向 Google 搜索引擎提交最新 Sitemap 变动通知...');
  const googlePing = await pingUrl(`https://www.google.com/ping?sitemap=${encodeURIComponent(SITEMAP_ROOT)}`);
  console.log(`   ✓ Google Ping 响应 [${googlePing.status}]: ${googlePing.msg} (注: Google 现已转为 Search Console API 驱动)`);

  console.log('\n====================================================');
  console.log('🎉 搜索引擎自动推送任务已全部执行完毕！');
  console.log('====================================================');
}

runPush();
