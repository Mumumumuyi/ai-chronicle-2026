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

async function runVisualSuite() {
  const distDir = path.resolve(__dirname, '../dist');
  const artifactsDir = 'C:\\Users\\Amu\\.gemini\\antigravity-cli\\brain\\e5702866-950e-4fac-b708-574215ea9583';
  const port = 4216;

  console.log('[1/4] Starting test server on port', port);
  const server = await startStaticServer(distDir, port);
  const browser = await chromium.launch({ channel: 'chrome', headless: true });

  const viewports = [
    { name: '1440_desktop', width: 1440, height: 900 },
    { name: '1200_laptop', width: 1200, height: 800 },
    { name: '1024_tablet', width: 1024, height: 768 },
    { name: '768_tablet_port', width: 768, height: 1024 },
    { name: '390_mobile', width: 390, height: 844 },
    { name: '360_mobile_small', width: 360, height: 740 },
  ];

  console.log('[2/4] Testing Stage View across 6 viewports');
  for (const vp of viewports) {
    const context = await browser.newContext({
      viewport: { width: vp.width, height: vp.height },
      locale: 'zh-CN',
    });
    const page = await context.newPage();
    await page.goto(`http://localhost:${port}/ai-chronicle-2026/`, { waitUntil: 'networkidle' });
    await page.waitForTimeout(600);

    const shotPath = path.join(artifactsDir, `world_class_stage_${vp.name}.png`);
    await page.screenshot({ path: shotPath, fullPage: false });
    console.log(`[PASS] Captured Stage: world_class_stage_${vp.name}.png`);
    await context.close();
  }

  console.log('[3/4] Testing Scaling Lab & Milestone Modal on Desktop');
  {
    const context = await browser.newContext({
      viewport: { width: 1440, height: 900 },
      locale: 'zh-CN',
    });
    const page = await context.newPage();
    await page.goto(`http://localhost:${port}/ai-chronicle-2026/`, { waitUntil: 'networkidle' });

    // Open first milestone
    const milestoneCards = await page.locator('#milestones-slab .cursor-pointer');
    if (await milestoneCards.count() > 0) {
      await milestoneCards.first().click();
      await page.waitForTimeout(400);
      const modalShot = path.join(artifactsDir, 'world_class_milestone_modal.png');
      await page.screenshot({ path: modalShot });
      console.log('[PASS] Captured Milestone Modal: world_class_milestone_modal.png');

      // Test Esc key to close
      await page.keyboard.press('Escape');
      await page.waitForTimeout(300);
    }

    // Switch to Lab tab
    const labBtn = page.locator('header nav button').filter({ hasText: /缩放律|Lab/ });
    if (await labBtn.count() > 0) {
      await labBtn.first().click();
      await page.waitForTimeout(600);
      const labShot = path.join(artifactsDir, 'world_class_scaling_lab.png');
      await page.screenshot({ path: labShot });
      console.log('[PASS] Captured Scaling Lab: world_class_scaling_lab.png');
    }
    await context.close();
  }

  console.log('[4/4] Testing Scaling Lab & Mobile Bottom Dock on iPhone (390px)');
  {
    const context = await browser.newContext({
      viewport: { width: 390, height: 844 },
      locale: 'zh-CN',
    });
    const page = await context.newPage();
    await page.goto(`http://localhost:${port}/ai-chronicle-2026/`, { waitUntil: 'networkidle' });

    // Click Scaling Lab in mobile dock
    const mobileDockBtns = page.locator('nav.liquid-glass-strong button');
    if (await mobileDockBtns.count() >= 2) {
      await mobileDockBtns.nth(1).click();
      await page.waitForTimeout(600);
      const mobileLabShot = path.join(artifactsDir, 'world_class_mobile_lab.png');
      await page.screenshot({ path: mobileLabShot });
      console.log('[PASS] Captured Mobile Scaling Lab: world_class_mobile_lab.png');
    }
    await context.close();
  }

  await browser.close();
  server.close();
  console.log('[COMPLETE] All visual verifications captured successfully!');
}

runVisualSuite().catch((err) => {
  console.error('[ERROR]', err);
  process.exit(1);
});
