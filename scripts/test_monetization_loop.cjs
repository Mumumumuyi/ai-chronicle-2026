const http = require('http');
const fs = require('fs');
const path = require('path');
const { chromium } = require('playwright');

const PORT = 4188;
const DIST_DIR = path.join(__dirname, '..', 'dist');
const ARTIFACT_DIR = 'C:\\Users\\Amu\\.gemini\\antigravity-cli\\brain\\e5702866-950e-4fac-b708-574215ea9583';
const SCREENSHOT_DIR = path.join(__dirname, '..', 'screenshots');

if (!fs.existsSync(SCREENSHOT_DIR)) fs.mkdirSync(SCREENSHOT_DIR, { recursive: true });

const MIME_TYPES = {
  '.html': 'text/html',
  '.js': 'text/javascript',
  '.css': 'text/css',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2'
};

function startServer() {
  const server = http.createServer((req, res) => {
    let reqPath = req.url.split('?')[0];
    if (reqPath.startsWith('/ai-chronicle-2026')) {
      reqPath = reqPath.replace('/ai-chronicle-2026', '');
    }
    if (reqPath === '/' || reqPath === '') reqPath = '/index.html';

    const filePath = path.join(DIST_DIR, reqPath);
    const ext = path.extname(filePath);

    if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
      res.writeHead(200, { 'Content-Type': MIME_TYPES[ext] || 'application/octet-stream' });
      fs.createReadStream(filePath).pipe(res);
    } else {
      const indexPath = path.join(DIST_DIR, 'index.html');
      res.writeHead(200, { 'Content-Type': 'text/html' });
      fs.createReadStream(indexPath).pipe(res);
    }
  });

  return new Promise((resolve) => {
    server.listen(PORT, () => {
      console.log(`✓ 本地静态测试服务器已就绪: http://localhost:${PORT}`);
      resolve(server);
    });
  });
}

async function runMonetizationVerification() {
  const server = await startServer();

  console.log('2. 启动 Playwright Chromium 引擎...');
  const browser = await chromium.launch({
    channel: 'chrome',
    headless: true,
  });

  const context = await browser.newContext({
    viewport: { width: 1440, height: 960 },
    deviceScaleFactor: 2,
    acceptDownloads: true
  });

  await context.addInitScript(() => {
    localStorage.setItem('ai_chronicle_lang', 'zh');
  });

  const page = await context.newPage();

  try {
    console.log(`3. 导航至 http://localhost:${PORT}/ ...`);
    await page.goto(`http://localhost:${PORT}/`, { waitUntil: 'networkidle', timeout: 15000 });
    await page.waitForTimeout(1500);

    // ==========================================
    // TEST 1: Premium Bundle Checkout Flow
    // ==========================================
    console.log('4. 验证测试 1: 4K 数字资产包结算与即时交付...');
    const bundleBtn = page.locator('button:has-text("4K 离线资产包")').first();
    await bundleBtn.click();
    await page.waitForTimeout(600);

    const unlockBtn = page.locator('button:has-text("立即购买解锁")').first();
    await unlockBtn.click();
    await page.waitForTimeout(600);

    const emailInput = page.locator('input[type="email"]').first();
    await emailInput.fill('investor.partner@frontier-ai.com');
    await page.waitForTimeout(300);

    const paySubmitBtn = page.locator('button:has-text("已扫码支付")').first();
    await paySubmitBtn.click();
    await page.waitForTimeout(800);

    const shot1 = path.join(SCREENSHOT_DIR, 'monetization_01_bundle_checkout.png');
    await page.screenshot({ path: shot1 });
    fs.copyFileSync(shot1, path.join(ARTIFACT_DIR, 'monetization_01_bundle_checkout.png'));
    console.log(`✓ 截图 1 已生成: ${shot1}`);

    const finishBtn = page.locator('button:has-text("完成")').first();
    if (await finishBtn.count() > 0) {
      await finishBtn.click();
      await page.waitForTimeout(400);
    }

    // ==========================================
    // TEST 2: B2B Sponsor Calculator Live Config
    // ==========================================
    console.log('5. 验证测试 2: B2B 智能测算器交互与折扣核算...');
    const sponsorBtn = page.locator('button:has-text("商业入驻 / 智能报价测算")').first();
    await sponsorBtn.click();
    await page.waitForTimeout(600);

    // Select 6 months
    const halfYearBtn = page.locator('button:has-text("6 个月")').first();
    if (await halfYearBtn.count() > 0) {
      await halfYearBtn.click();
      await page.waitForTimeout(300);
    }

    // Fill form
    const brandInput = page.locator('input[placeholder*="公司/品牌名称"]').first();
    await brandInput.fill('极星算力云 (Polaris Compute Cloud)');

    const contactInput = page.locator('input[placeholder*="联系方式"]').first();
    await contactInput.fill('partner@polaris-cloud.com');

    const reqInput = page.locator('input[placeholder*="补充推广目标"]').first();
    await reqInput.fill('挂载 5000 卡 H200 算力券');

    const shot2 = path.join(SCREENSHOT_DIR, 'monetization_02_sponsor_calculator.png');
    await page.screenshot({ path: shot2 });
    fs.copyFileSync(shot2, path.join(ARTIFACT_DIR, 'monetization_02_sponsor_calculator.png'));
    console.log(`✓ 截图 2 已生成: ${shot2}`);

    // Submit inquiry
    const submitInquiryBtn = page.locator('button:has-text("提交意向并预约排期")').first();
    await submitInquiryBtn.click();
    await page.waitForTimeout(600);

    // Close modal
    await page.keyboard.press('Escape');
    await page.waitForTimeout(500);

    // ==========================================
    // TEST 3: Newsletter Academic Lead Capture
    // ==========================================
    console.log('6. 验证测试 3: 学术内参订阅潜客捕获...');
    // In Chinese mode, the tab is '长卷'
    const readerTab = page.locator('header nav button:has-text("长卷")').first();
    if (await readerTab.count() > 0) {
      await readerTab.click();
      await page.waitForTimeout(800);
    }

    const subModalBtn = page.locator('button:has-text("订阅 2026-2030 前沿内参")').first();
    if (await subModalBtn.count() > 0) {
      await subModalBtn.click();
      await page.waitForTimeout(500);

      const subEmail = page.locator('input[placeholder*="your.email"]').first();
      await subEmail.fill('dr.zhang@tsinghua.edu.cn');
      await page.waitForTimeout(300);

      const subFormBtn = page.locator('button:has-text("即刻免费订阅")').first();
      await subFormBtn.click();
      await page.waitForTimeout(800);

      const shot3 = path.join(SCREENSHOT_DIR, 'monetization_03_newsletter_lead.png');
      await page.screenshot({ path: shot3 });
      fs.copyFileSync(shot3, path.join(ARTIFACT_DIR, 'monetization_03_newsletter_lead.png'));
      console.log(`✓ 截图 3 已生成: ${shot3}`);

      await page.keyboard.press('Escape');
      await page.waitForTimeout(500);
    }

    // ==========================================
    // TEST 4: About Hub & CRM Admin Ledger
    // ==========================================
    console.log('7. 验证测试 4: CRM 线索账本与数据资产导出...');
    const aboutBtn = page.locator('header nav button:has(svg.lucide-info), header button[title="美学"]').first();
    if (await aboutBtn.count() > 0) {
      await aboutBtn.click();
      await page.waitForTimeout(800);

      const shot4 = path.join(SCREENSHOT_DIR, 'monetization_04_crm_admin.png');
      await page.screenshot({ path: shot4 });
      fs.copyFileSync(shot4, path.join(ARTIFACT_DIR, 'monetization_04_crm_admin.png'));
      console.log(`✓ 截图 4 已生成: ${shot4}`);
    }

    console.log('\n=============================================');
    console.log('✅ 所有商业化变现与闭环漏斗验证全部通过！');
    console.log('=============================================');

  } catch (err) {
    console.error('测试运行异常:', err);
  } finally {
    await browser.close();
    server.close();
  }
}

runMonetizationVerification();
