const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');
const http = require('http');

function startStaticServer(distDir, port) {
  const mimeTypes = {
    '.html': 'text/html',
    '.js': 'text/javascript',
    '.css': 'text/css',
    '.json': 'application/json',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.svg': 'image/svg+xml',
    '.ico': 'image/x-icon',
    '.woff': 'font/woff',
    '.woff2': 'font/woff2'
  };

  const server = http.createServer((req, res) => {
    let reqPath = req.url.split('?')[0];
    if (reqPath === '/' || reqPath === '') reqPath = '/index.html';
    
    if (reqPath.startsWith('/ai-chronicle-2026/')) {
      reqPath = reqPath.replace('/ai-chronicle-2026/', '/');
    }
    if (reqPath === '/' || reqPath === '') reqPath = '/index.html';

    const filePath = path.join(distDir, reqPath);
    fs.readFile(filePath, (err, data) => {
      if (err) {
        fs.readFile(path.join(distDir, 'index.html'), (err2, indexData) => {
          if (err2) {
            res.writeHead(404);
            res.end('Not found');
          } else {
            res.writeHead(200, { 'Content-Type': 'text/html' });
            res.end(indexData);
          }
        });
      } else {
        const ext = path.extname(filePath).toLowerCase();
        res.writeHead(200, { 'Content-Type': mimeTypes[ext] || 'application/octet-stream' });
        res.end(data);
      }
    });
  });

  return new Promise((resolve) => {
    server.listen(port, () => resolve(server));
  });
}

async function inspectNavbar() {
  const distDir = path.resolve(__dirname, '../dist');
  const artifactsDir = 'C:\\Users\\Amu\\.gemini\\antigravity-cli\\brain\\e5702866-950e-4fac-b708-574215ea9583';
  const port = 4215;

  const server = await startStaticServer(distDir, port);
  const browser = await chromium.launch({ channel: 'chrome', headless: true });

  const viewports = [
    { name: '1440_desktop', width: 1440, height: 800 },
    { name: '1200_laptop', width: 1200, height: 800 },
    { name: '1024_tablet_land', width: 1024, height: 800 },
    { name: '768_tablet_port', width: 768, height: 1024 },
    { name: '390_mobile', width: 390, height: 844 },
    { name: '360_mobile_small', width: 360, height: 740 },
  ];

  for (const vp of viewports) {
    const context = await browser.newContext({
      viewport: { width: vp.width, height: vp.height },
      locale: 'zh-CN',
    });
    const page = await context.newPage();
    await page.goto(`http://localhost:${port}/ai-chronicle-2026/`, { waitUntil: 'networkidle' });
    await page.waitForTimeout(500);

    // Capture top area
    const shotPath = path.join(artifactsDir, `navbar_inspect_${vp.name}.png`);
    await page.screenshot({
      path: shotPath,
      clip: { x: 0, y: 0, width: vp.width, height: 140 }
    });
    console.log(`[SNAPSHOT] Captured: navbar_inspect_${vp.name}.png`);

    if (vp.name === '390_mobile') {
      const mobileFull = path.join(artifactsDir, 'navbar_verify_mobile_full.png');
      await page.screenshot({ path: mobileFull });
      console.log(`[SNAPSHOT] Captured: navbar_verify_mobile_full.png`);
    }

    if (vp.name === '1200_laptop') {
      const desktopFull = path.join(artifactsDir, 'navbar_verify_desktop_full.png');
      await page.screenshot({ path: desktopFull });
      console.log(`[SNAPSHOT] Captured: navbar_verify_desktop_full.png`);
    }

    await context.close();
  }

  await browser.close();
  server.close();
}

inspectNavbar();
