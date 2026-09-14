const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');
const http = require('http');

// Simple static server for dist
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
    
    // Handle gh-pages subpath /ai-chronicle-2026/ if requested
    if (reqPath.startsWith('/ai-chronicle-2026/')) {
      reqPath = reqPath.replace('/ai-chronicle-2026/', '/');
    }
    if (reqPath === '/' || reqPath === '') reqPath = '/index.html';

    const filePath = path.join(distDir, reqPath);
    fs.readFile(filePath, (err, data) => {
      if (err) {
        // Fallback to index.html for SPA
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

async function runMobileLoopTest() {
  const distDir = path.join(__dirname, '..', 'dist');
  const artifactDir = 'C:\\Users\\Amu\\.gemini\\antigravity-cli\\brain\\e5702866-950e-4fac-b708-574215ea9583';
  const outDir = path.join(__dirname, '..', 'screenshots');
  if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

  const port = 4199;
  console.log(`[Step 1] Starting local server serving dist/ at http://localhost:${port}...`);
  const server = await startStaticServer(distDir, port);

  console.log('[Step 2] Launching Playwright Chromium in mobile emulation mode (iPhone 14 Pro: 390x844)...');
  const browser = await chromium.launch({
    channel: 'chrome',
    headless: true,
  });

  const context = await browser.newContext({
    viewport: { width: 390, height: 844 },
    isMobile: true,
    hasTouch: true,
    deviceScaleFactor: 3,
  });

  const page = await context.newPage();
  const localUrl = `http://localhost:${port}/`;

  try {
    console.log(`[Step 3] Loading mobile page in default Chinese mode: ${localUrl}`);
    await page.goto(localUrl, { waitUntil: 'networkidle', timeout: 15000 });
    await page.waitForTimeout(1000);

    // 1. Mobile Chinese View
    const shot1 = path.join(outDir, 'mobile_01_zh_stage.png');
    await page.screenshot({ path: shot1 });
    console.log(`✓ Shot 1 saved: ${shot1}`);

    // 2. Switch language to English
    console.log('[Step 4] Switching language to English via LanguageDropdown...');
    // Click language dropdown button
    const langBtn = page.locator('button[title*="Language"], button[title*="语言"]').first();
    await langBtn.click();
    await page.waitForTimeout(500);

    // Click English option
    const enOption = page.locator('button:has-text("English")');
    await enOption.click();
    await page.waitForTimeout(1000);

    // Take screenshot of English mobile stage
    const shot2 = path.join(outDir, 'mobile_02_en_stage.png');
    await page.screenshot({ path: shot2 });
    console.log(`✓ Shot 2 saved: ${shot2} (English Mobile Stage)`);

    // 3. Open Milestone Modal
    console.log('[Step 5] Clicking first milestone card to inspect modal layout on mobile...');
    const firstMilestoneCard = page.locator('#milestones-slab .group').first();
    await firstMilestoneCard.click();
    await page.waitForTimeout(800);

    const shot3 = path.join(outDir, 'mobile_03_en_milestone_modal.png');
    await page.screenshot({ path: shot3 });
    console.log(`✓ Shot 3 saved: ${shot3} (Mobile Milestone Dossier Modal)`);

    // Close modal
    const closeBtn = page.locator('.fixed.inset-0 button:has(svg)').first();
    await closeBtn.click();
    await page.waitForTimeout(600);

    // 4. Test Mobile Bottom Dock - Scaling Laws Lab
    console.log('[Step 6] Navigating to Lab tab via mobile bottom dock...');
    const labDockBtn = page.locator('.fixed.bottom-4 button').nth(1);
    await labDockBtn.click();
    await page.waitForTimeout(1000);

    const shot4 = path.join(outDir, 'mobile_04_en_lab.png');
    await page.screenshot({ path: shot4 });
    console.log(`✓ Shot 4 saved: ${shot4} (Mobile Scaling Laws Lab)`);

    // 5. Test Mobile Bottom Dock - Treatise Reader & TOC Drawer
    console.log('[Step 7] Navigating to Treatise Reader via mobile bottom dock...');
    const readerDockBtn = page.locator('.fixed.bottom-4 button').nth(2);
    await readerDockBtn.click();
    await page.waitForTimeout(1000);

    // Click floating TOC button
    console.log('[Step 8] Opening mobile floating Table of Contents drawer...');
    const tocFloatingBtn = page.locator('.fixed.bottom-20 button');
    await tocFloatingBtn.click();
    await page.waitForTimeout(800);

    const shot5 = path.join(outDir, 'mobile_05_en_reader_toc.png');
    await page.screenshot({ path: shot5 });
    console.log(`✓ Shot 5 saved: ${shot5} (Mobile Treatise TOC Drawer)`);

    // Copy to artifact directory
    if (fs.existsSync(artifactDir)) {
      const files = ['mobile_01_zh_stage.png', 'mobile_02_en_stage.png', 'mobile_03_en_milestone_modal.png', 'mobile_04_en_lab.png', 'mobile_05_en_reader_toc.png'];
      for (const f of files) {
        const src = path.join(outDir, f);
        if (fs.existsSync(src)) {
          fs.copyFileSync(src, path.join(artifactDir, f));
        }
      }
      console.log(`✓ All 5 mobile screenshots successfully synced to artifact directory: ${artifactDir}`);
    }

  } catch (err) {
    console.error('Mobile test failed with error:', err);
  } finally {
    await browser.close();
    server.close();
    console.log('[Done] Mobile Playwright verification finished.');
  }
}

runMobileLoopTest();
