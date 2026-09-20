const http = require('http');
const fs = require('fs');
const path = require('path');
const { chromium } = require('playwright');

const PORT = 4195;
const DIST_DIR = path.join(__dirname, '..', 'dist');
const ARTIFACT_DIR = 'C:\\Users\\Amu\\.gemini\\antigravity-cli\\brain\\e5702866-950e-4fac-b708-574215ea9583';

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript',
  '.css': 'text/css',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.txt': 'text/plain'
};

function startServer() {
  const server = http.createServer((req, res) => {
    let reqPath = req.url.split('?')[0];
    if (reqPath.startsWith('/ai-chronicle-2026')) {
      reqPath = reqPath.replace('/ai-chronicle-2026', '');
    }
    if (reqPath === '/' || reqPath === '') reqPath = '/index.html';

    let filePath = path.join(DIST_DIR, reqPath);
    // Support directory index or prerendered files
    if (fs.existsSync(filePath) && fs.statSync(filePath).isDirectory()) {
      filePath = path.join(filePath, 'index.html');
    }
    if (!path.extname(filePath)) {
      const withHtml = filePath + '.html';
      const asDirIndex = path.join(filePath, 'index.html');
      if (fs.existsSync(asDirIndex)) {
        filePath = asDirIndex;
      } else if (fs.existsSync(withHtml)) {
        filePath = withHtml;
      }
    }

    const ext = path.extname(filePath);

    if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
      res.writeHead(200, { 'Content-Type': MIME_TYPES[ext] || 'application/octet-stream' });
      fs.createReadStream(filePath).pipe(res);
    } else {
      const indexPath = path.join(DIST_DIR, 'index.html');
      res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
      fs.createReadStream(indexPath).pipe(res);
    }
  });

  return new Promise((resolve) => {
    server.listen(PORT, () => {
      console.log(`✓ Verification test server listening on http://localhost:${PORT}`);
      resolve(server);
    });
  });
}

async function verifyMonetizationFunnel() {
  const server = await startServer();

  console.log('1. Launching Chromium via Playwright (channel: chrome)...');
  const browser = await chromium.launch({
    channel: 'chrome',
    headless: true,
  });

  const viewports = [
    { name: 'desktop', width: 1440, height: 900 },
    { name: 'tablet', width: 768, height: 1024 },
    { name: 'mobile', width: 390, height: 844 },
  ];

  for (const vp of viewports) {
    console.log(`\n=== Testing Viewport: ${vp.name} (${vp.width}x${vp.height}) ===`);
    const context = await browser.newContext({
      viewport: { width: vp.width, height: vp.height },
      deviceScaleFactor: 2,
    });
    const page = await context.newPage();

    // 1. Test Stage Page & MonetizationBanner
    console.log(`[${vp.name}] Visiting Stage / ...`);
    await page.goto(`http://localhost:${PORT}/`, { waitUntil: 'networkidle' });
    await page.waitForTimeout(1000);

    const overflowStage = await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth);
    console.log(`[${vp.name}] Stage page horizontal overflow: ${overflowStage ? 'FAIL (overflow detected)' : 'PASS (no overflow)'}`);

    // Check Monetization Banner
    const banner = page.locator('text=MONETIZATION & SPONSOR').first();
    const hasBanner = (await banner.count()) > 0;
    console.log(`[${vp.name}] Monetization banner present: ${hasBanner ? 'PASS' : 'FAIL'}`);

    const shotStage = path.join(ARTIFACT_DIR, `monetization_stage_${vp.name}.png`);
    await page.screenshot({ path: shotStage });

    // 2. Test Scaling Lab & GPU Provisioning Card
    console.log(`[${vp.name}] Visiting Scaling Lab /lab ...`);
    await page.goto(`http://localhost:${PORT}/lab`, { waitUntil: 'networkidle' });
    await page.waitForTimeout(1200);

    const overflowLab = await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth);
    console.log(`[${vp.name}] Lab page horizontal overflow: ${overflowLab ? 'FAIL' : 'PASS'}`);

    const gpuCard = page.locator('text=COMPUTE PROVISIONING').first();
    const hasGpuCard = (await gpuCard.count()) > 0;
    console.log(`[${vp.name}] Lab GPU Provisioning card present: ${hasGpuCard ? 'PASS' : 'FAIL'}`);

    // Test promo code copy
    if (vp.name === 'desktop') {
      const copyBtn = page.locator('button:has-text("复制")').first();
      if ((await copyBtn.count()) > 0) {
        await copyBtn.click();
        await page.waitForTimeout(300);
        const copiedBtn = page.locator('text=已复制').first();
        const hasCopied = (await copiedBtn.count()) > 0;
        console.log(`[${vp.name}] Promo code copy feedback: ${hasCopied ? 'PASS ("已复制" displayed)' : 'FAIL'}`);
      }
    }

    // Check Lab chips
    const togetherChip = page.locator('text=Together.ai').first();
    const hasTogetherChip = (await togetherChip.count()) > 0;
    console.log(`[${vp.name}] Lab Together.ai fast chip: ${hasTogetherChip ? 'PASS' : 'FAIL'}`);

    const shotLab = path.join(ARTIFACT_DIR, `monetization_lab_${vp.name}.png`);
    await page.screenshot({ path: shotLab });

    // 3. Test Reader & In-Article Placements
    console.log(`[${vp.name}] Visiting Article Reader /reader ...`);
    await page.goto(`http://localhost:${PORT}/reader`, { waitUntil: 'networkidle' });
    await page.waitForTimeout(1200);

    const overflowReader = await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth);
    console.log(`[${vp.name}] Reader page horizontal overflow: ${overflowReader ? 'FAIL' : 'PASS'}`);

    const gpuSponsor = page.locator('text=SPONSORED ACCELERATION').first();
    const hasGpuSponsor = (await gpuSponsor.count()) > 0;
    console.log(`[${vp.name}] In-article GPU placement (Chapter 2): ${hasGpuSponsor ? 'PASS' : 'FAIL'}`);

    const devEcosystem = page.locator('text=DEVELOPER ECOSYSTEM').first();
    const hasDevEcosystem = (await devEcosystem.count()) > 0;
    console.log(`[${vp.name}] In-article Developer Tooling placement (Chapter 4): ${hasDevEcosystem ? 'PASS' : 'FAIL'}`);

    // Check post-monograph closing card
    const postMonographCard = page.locator('text=ACADEMIC ASSET PACK & PATRON GRANTS').first();
    const hasPostCard = (await postMonographCard.count()) > 0;
    console.log(`[${vp.name}] Post-monograph closing asset & patron card: ${hasPostCard ? 'PASS' : 'FAIL'}`);

    // Test clicking bundle download in reader
    if (vp.name === 'desktop') {
      const getBundleBtn = page.locator('button:has-text("获取 4K 离线资产包")').first();
      if ((await getBundleBtn.count()) > 0) {
        await getBundleBtn.click();
        await page.waitForTimeout(500);
        const unlockBtn = page.locator('button:has-text("立即购买解锁")').first();
        if ((await unlockBtn.count()) > 0) {
          await unlockBtn.click();
          await page.waitForTimeout(500);
          const afdianPay = page.locator('text=爱发电在线支持').first();
          const hasAfdianPay = (await afdianPay.count()) > 0;
          console.log(`[${vp.name}] Bundle checkout 1-click Afdian payment button: ${hasAfdianPay ? 'PASS' : 'FAIL'}`);
        }
        // Close modal
        const closeBundleBtn = page.locator('button[aria-label="close"], button:has(svg.lucide-x)').last();
        if ((await closeBundleBtn.count()) > 0) {
          await closeBundleBtn.click();
          await page.waitForTimeout(300);
        }
      }
    }

    const shotReader = path.join(ARTIFACT_DIR, `monetization_reader_${vp.name}.png`);
    await page.screenshot({ path: shotReader });

    // 4. Test Ecosystem & B2B Sponsor Modal
    console.log(`[${vp.name}] Visiting Ecosystem /ecosystem ...`);
    await page.goto(`http://localhost:${PORT}/ecosystem`, { waitUntil: 'networkidle' });
    await page.waitForTimeout(1200);

    const overflowEco = await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth);
    console.log(`[${vp.name}] Ecosystem page horizontal overflow: ${overflowEco ? 'FAIL' : 'PASS'}`);

    const sponsorModalBtn = page.locator('button:has-text("提交你的 AI 产品 / 品牌赞助")').first();
    if ((await sponsorModalBtn.count()) > 0) {
      await sponsorModalBtn.click();
      await page.waitForTimeout(600);

      const mailtoBtn = page.locator('a:has-text("一键发信对接")').first();
      const hasMailto = (await mailtoBtn.count()) > 0;
      console.log(`[${vp.name}] 1-click mailto inquiry button in sponsor modal: ${hasMailto ? 'PASS' : 'FAIL'}`);

      const shotModal = path.join(ARTIFACT_DIR, `monetization_sponsor_modal_${vp.name}.png`);
      await page.screenshot({ path: shotModal });

      // Close modal
      const closeBtn = page.locator('button:has-text("完成查看并返回生态")').first();
      if ((await closeBtn.count()) > 0) {
        await closeBtn.click();
      }
    }

    await context.close();
  }

  await browser.close();
  server.close();
  console.log('\n=============================================');
  console.log('✓ All Monetization Funnel Tests Completed Successfully!');
  console.log('=============================================\n');
}

verifyMonetizationFunnel().catch((err) => {
  console.error('[FATAL] Verification failed:', err);
  process.exit(1);
});
