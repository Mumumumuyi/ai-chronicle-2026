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

async function runMonetizationMobileTest() {
  const distDir = path.join(__dirname, '..', 'dist');
  const artifactDir = 'C:\\Users\\Amu\\.gemini\\antigravity-cli\\brain\\e5702866-950e-4fac-b708-574215ea9583';
  const outDir = path.join(__dirname, '..', 'screenshots');
  if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

  const port = 4199;
  console.log(`[Step 1] Starting server at http://localhost:${port}...`);
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
    console.log(`[Step 3] Loading mobile page: ${localUrl}`);
    await page.goto(localUrl, { waitUntil: 'networkidle', timeout: 15000 });
    await page.waitForTimeout(1000);

    // 1. Open Coffee Modal
    console.log('[Step 4] Opening Sponsor Coffee modal...');
    const coffeeBtn = page.locator('button:has-text("赞助打赏"), button:has-text("Tip Coffee")').first();
    await coffeeBtn.scrollIntoViewIfNeeded();
    await coffeeBtn.click();
    await page.waitForTimeout(600);

    const shot1 = path.join(outDir, 'monetization_mobile_01_coffee_modal.png');
    await page.screenshot({ path: shot1 });
    console.log(`✓ Shot 1 saved: ${shot1}`);

    // Click global tab
    console.log('[Step 5] Clicking Global tab in Coffee modal...');
    const globalTab = page.locator('.fixed.inset-0 button:has-text("国际"), .fixed.inset-0 button:has-text("Cards")').first();
    await globalTab.click();
    await page.waitForTimeout(400);

    const shot2 = path.join(outDir, 'monetization_mobile_02_coffee_global.png');
    await page.screenshot({ path: shot2 });
    console.log(`✓ Shot 2 saved: ${shot2}`);

    // Close Coffee Modal
    const closeBtn1 = page.locator('.fixed.inset-0 button:has(svg)').first();
    await closeBtn1.click();
    await page.waitForTimeout(400);

    // 2. Open Premium Bundle Modal
    console.log('[Step 6] Opening Premium Bundle modal...');
    const bundleBtn = page.locator('button:has-text("4K 离线资产包"), button:has-text("4K Asset")').first();
    await bundleBtn.click();
    await page.waitForTimeout(600);

    const shot3 = path.join(outDir, 'monetization_mobile_03_bundle_details.png');
    await page.screenshot({ path: shot3 });
    console.log(`✓ Shot 3 saved: ${shot3}`);

    // Click Unlock / Checkout button
    console.log('[Step 7] Clicking Unlock Full Bundle...');
    const unlockBtn = page.locator('.fixed.inset-0 button:has-text("立即购买解锁"), .fixed.inset-0 button:has-text("Unlock")').first();
    await unlockBtn.click();
    await page.waitForTimeout(500);

    const shot4 = path.join(outDir, 'monetization_mobile_04_bundle_checkout.png');
    await page.screenshot({ path: shot4 });
    console.log(`✓ Shot 4 saved: ${shot4}`);

    // Close Bundle Modal
    const closeBtn2 = page.locator('.fixed.inset-0 button:has(svg)').first();
    await closeBtn2.click();
    await page.waitForTimeout(400);

    // 3. Open Sponsor Calculator Modal
    console.log('[Step 8] Opening Sponsor Calculator modal...');
    const sponsorBtn = page.locator('button:has-text("商业入驻"), button:has-text("B2B Placement")').first();
    await sponsorBtn.click();
    await page.waitForTimeout(600);

    const shot5 = path.join(outDir, 'monetization_mobile_05_sponsor_calc_zh.png');
    await page.screenshot({ path: shot5 });
    console.log(`✓ Shot 5 saved: ${shot5}`);

    // Switch currency to USD
    console.log('[Step 9] Switching currency to USD...');
    const usdBtn = page.locator('.fixed.inset-0 button:has-text("USD")').first();
    await usdBtn.click();
    await page.waitForTimeout(400);

    const shot6 = path.join(outDir, 'monetization_mobile_06_sponsor_calc_usd.png');
    await page.screenshot({ path: shot6 });
    console.log(`✓ Shot 6 saved: ${shot6}`);

    // Close Sponsor Calculator
    const closeBtn3 = page.locator('.fixed.inset-0 button:has(svg)').first();
    await closeBtn3.click();
    await page.waitForTimeout(400);

    // 4. Navigate to Ecosystem Tab via bottom dock
    console.log('[Step 10] Navigating to Ecosystem Tab...');
    const ecosystemDockBtn = page.locator('.fixed.bottom-4 button').nth(3);
    await ecosystemDockBtn.click();
    await page.waitForTimeout(800);

    const shot7 = path.join(outDir, 'monetization_mobile_07_ecosystem_page.png');
    await page.screenshot({ path: shot7 });
    console.log(`✓ Shot 7 saved: ${shot7}`);

    // Click Submit AI Tool button
    console.log('[Step 11] Opening Submit Tool modal...');
    const submitToolBtn = page.locator('button:has-text("提交你的 AI 产品"), button:has-text("Submit AI Tool")').first();
    await submitToolBtn.click();
    await page.waitForTimeout(500);

    const shot8 = path.join(outDir, 'monetization_mobile_08_ecosystem_submit_modal.png');
    await page.screenshot({ path: shot8 });
    console.log(`✓ Shot 8 saved: ${shot8}`);

    // Close Submit Modal
    const closeBtn4 = page.locator('.fixed.inset-0 button:has-text("关闭窗口"), .fixed.inset-0 button:has-text("Close")').first();
    await closeBtn4.click();
    await page.waitForTimeout(400);

    // 5. Test English Mode for Sponsor Calculator
    console.log('[Step 12] Switching language to English...');
    const langBtn = page.locator('button[title*="Language"], button[title*="语言"]').first();
    await langBtn.click();
    await page.waitForTimeout(400);
    const enOption = page.locator('button:has-text("English")');
    await enOption.click();
    await page.waitForTimeout(800);

    // Switch back to stage tab via dock
    const stageDockBtn = page.locator('.fixed.bottom-4 button').first();
    await stageDockBtn.click();
    await page.waitForTimeout(600);

    // Open Sponsor Calculator in English
    const sponsorBtnEn = page.locator('button:has-text("B2B Placement")').first();
    await sponsorBtnEn.scrollIntoViewIfNeeded();
    await sponsorBtnEn.click();
    await page.waitForTimeout(600);

    const shot9 = path.join(outDir, 'monetization_mobile_09_sponsor_calc_en.png');
    await page.screenshot({ path: shot9 });
    console.log(`✓ Shot 9 saved: ${shot9}`);

    // Copy to artifact directory
    if (fs.existsSync(artifactDir)) {
      const allShots = [
        'monetization_mobile_01_coffee_modal.png',
        'monetization_mobile_02_coffee_global.png',
        'monetization_mobile_03_bundle_details.png',
        'monetization_mobile_04_bundle_checkout.png',
        'monetization_mobile_05_sponsor_calc_zh.png',
        'monetization_mobile_06_sponsor_calc_usd.png',
        'monetization_mobile_07_ecosystem_page.png',
        'monetization_mobile_08_ecosystem_submit_modal.png',
        'monetization_mobile_09_sponsor_calc_en.png'
      ];
      for (const f of allShots) {
        const src = path.join(outDir, f);
        if (fs.existsSync(src)) {
          fs.copyFileSync(src, path.join(artifactDir, f));
        }
      }
      console.log('✓ All 9 mobile screenshots copied to artifact directory!');
    }

  } catch (err) {
    console.error('Test execution failed:', err);
  } finally {
    await browser.close();
    server.close();
    console.log('Finished mobile verification run.');
  }
}

runMonetizationMobileTest();
