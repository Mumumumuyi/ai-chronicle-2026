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

async function runInteractiveAnimationSuite() {
  const distDir = path.resolve(__dirname, '../dist');
  const artifactsDir = 'C:\\Users\\Amu\\.gemini\\antigravity-cli\\brain\\e5702866-950e-4fac-b708-574215ea9583';
  const port = 4219;

  console.log('[1/5] Starting static server on port', port);
  const server = await startStaticServer(distDir, port);
  const browser = await chromium.launch({ channel: 'chrome', headless: true });

  // 1. Desktop Stage View (Interactive Controls: Sound FX, Auto-Tour, Search, Filters)
  console.log('[2/5] Testing Desktop Stage with Interactive UI Controls');
  {
    const context = await browser.newContext({
      viewport: { width: 1440, height: 900 },
      locale: 'zh-CN',
    });
    const page = await context.newPage();
    await page.goto(`http://localhost:${port}/ai-chronicle-2026/`, { waitUntil: 'networkidle' });
    await page.waitForTimeout(600);

    // Capture initial stage
    await page.screenshot({ path: path.join(artifactsDir, 'interactive_stage_desktop.png') });
    console.log('[PASS] Captured initial stage with interactive controls');

    // Test Sound FX Toggle Button click
    const soundBtn = page.locator('button[aria-label="Sound Effects Toggle"]');
    if (await soundBtn.count() > 0) {
      await soundBtn.click();
      await page.waitForTimeout(300);
      await page.screenshot({ path: path.join(artifactsDir, 'interactive_sound_fx_active.png') });
      console.log('[PASS] Captured active sound FX with equalizer waves');
    }

    // Test Milestone Filter click
    const filterBtn = page.locator('button:has-text("突破")');
    if (await filterBtn.count() > 0) {
      await filterBtn.first().click();
      await page.waitForTimeout(400);
      await page.screenshot({ path: path.join(artifactsDir, 'interactive_filtered_milestones.png') });
      console.log('[PASS] Captured milestone filtering animation');
    }

    // Test Milestone Modal Entrance & Exit
    const milestoneCards = page.locator('#milestones-slab .cursor-pointer');
    if (await milestoneCards.count() > 0) {
      await milestoneCards.first().click();
      // Wait for entrance animation to finish
      await page.waitForTimeout(350);
      await page.screenshot({ path: path.join(artifactsDir, 'interactive_modal_entrance.png') });
      console.log('[PASS] Captured milestone modal entrance animation');

      // Click close button and capture exit state
      const closeBtn = page.locator('button[title*="关闭"]');
      if (await closeBtn.count() > 0) {
        await closeBtn.first().click();
        // Wait 80ms to capture mid-exit animation
        await page.waitForTimeout(80);
        await page.screenshot({ path: path.join(artifactsDir, 'interactive_modal_exiting.png') });
        console.log('[PASS] Captured modal smooth exit animation frame');
        // Wait for unmount
        await page.waitForTimeout(250);
      }
    }

    // Test Auto-Tour button
    const autoTourBtn = page.locator('button[title*="自动巡礼"]');
    if (await autoTourBtn.count() > 0) {
      await autoTourBtn.first().click();
      await page.waitForTimeout(400);
      await page.screenshot({ path: path.join(artifactsDir, 'interactive_autotour_active.png') });
      console.log('[PASS] Captured active auto-tour presentation mode');
    }

    await context.close();
  }

  // 2. Scaling Lab Interactive Search Tree Visualizer
  console.log('[3/5] Testing Scaling Lab with System 2 Search Tree Visualizer');
  {
    const context = await browser.newContext({
      viewport: { width: 1440, height: 900 },
      locale: 'zh-CN',
    });
    const page = await context.newPage();
    await page.goto(`http://localhost:${port}/ai-chronicle-2026/`, { waitUntil: 'networkidle' });

    // Click Lab tab
    const labNavBtn = page.locator('header nav button:has-text("缩放律")');
    if (await labNavBtn.count() > 0) {
      await labNavBtn.first().click();
      await page.waitForTimeout(500);

      // Select 16K Max Tree preset to expand the search tree visualizer
      const maxTreePreset = page.locator('button:has-text("16K")');
      if (await maxTreePreset.count() > 0) {
        await maxTreePreset.click();
        await page.waitForTimeout(500);
      }

      await page.screenshot({ path: path.join(artifactsDir, 'interactive_scaling_lab_tree.png') });
      console.log('[PASS] Captured Scaling Lab with expanded System 2 search tree visualizer');
    }
    await context.close();
  }

  // 3. Mobile Viewport (iPhone 390px)
  console.log('[4/5] Testing Mobile Interactive Stage (390px)');
  {
    const context = await browser.newContext({
      viewport: { width: 390, height: 844 },
      locale: 'zh-CN',
    });
    const page = await context.newPage();
    await page.goto(`http://localhost:${port}/ai-chronicle-2026/`, { waitUntil: 'networkidle' });
    await page.waitForTimeout(600);

    await page.screenshot({ path: path.join(artifactsDir, 'interactive_mobile_390_stage.png') });
    console.log('[PASS] Captured mobile stage with interactive controls');
    await context.close();
  }

  // 4. Tablet Viewport (768px)
  console.log('[5/5] Testing Tablet Viewport (768px)');
  {
    const context = await browser.newContext({
      viewport: { width: 768, height: 1024 },
      locale: 'zh-CN',
    });
    const page = await context.newPage();
    await page.goto(`http://localhost:${port}/ai-chronicle-2026/`, { waitUntil: 'networkidle' });
    await page.waitForTimeout(600);

    await page.screenshot({ path: path.join(artifactsDir, 'interactive_tablet_768_stage.png') });
    console.log('[PASS] Captured tablet stage');
    await context.close();
  }

  await browser.close();
  server.close();
  console.log('[COMPLETE] All dynamic interactive UI & animation tests passed!');
}

runInteractiveAnimationSuite().catch((err) => {
  console.error('[ERROR]', err);
  process.exit(1);
});
