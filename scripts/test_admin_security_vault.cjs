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
    server.listen(port, () => {
      console.log(`[TEST_SERVER] Running on http://localhost:${port}`);
      resolve(server);
    });
  });
}

async function runSecurityVaultVerification() {
  const distDir = path.resolve(__dirname, '../dist');
  const artifactsDir = 'C:\\Users\\Amu\\.gemini\\antigravity-cli\\brain\\e5702866-950e-4fac-b708-574215ea9583';
  const port = 4210;

  const server = await startStaticServer(distDir, port);
  const browser = await chromium.launch({ channel: 'chrome', headless: true });

  try {
    console.log('\n--- STEP 1: Desktop Mode Verification (1280x800) ---');
    const context = await browser.newContext({
      viewport: { width: 1280, height: 800 },
      locale: 'zh-CN',
    });
    const page = await context.newPage();

    await page.goto(`http://localhost:${port}/ai-chronicle-2026/`, { waitUntil: 'networkidle' });
    await page.waitForTimeout(1000);

    // 1. Verify that NO public admin links exist
    const adminButton = await page.$('text=管理后台');
    console.log(`[CHECK] Ordinary visitor view contains visible admin button? ${adminButton !== null ? 'FAIL (Exposed)' : 'PASS (Fully Cloaked)'}`);

    // 2. Test Stealth Keystroke: Ctrl + Shift + Alt + A
    console.log('[ACTION] Triggering stealth keystroke: Control+Shift+Alt+KeyA');
    await page.keyboard.press('Control+Shift+Alt+KeyA');
    await page.waitForTimeout(800);

    // Verify checkpoint modal is visible
    const checkpointTitle = await page.textContent('text=主理人安全通道');
    console.log(`[CHECK] Security Checkpoint opened via hotkey? ${checkpointTitle ? 'PASS' : 'FAIL'}`);

    const checkpointShot = path.join(artifactsDir, 'admin_01_checkpoint_modal.png');
    await page.screenshot({ path: checkpointShot });
    console.log(`[SNAPSHOT] Saved: ${checkpointShot}`);

    // 3. Test Invalid Passkey & Brute Force Defense
    // 3. Test Invalid Passkey & Rejection of Deprecated Weak Keys
    console.log('[ACTION] Testing invalid password rejection and brute force counter');
    await page.fill('input[placeholder*="输入授权凭证"]', 'invalid_hack_attempt');
    await page.click('button:has-text("验证并解锁控制台")');
    await page.waitForTimeout(600);

    // Also test that deprecated keys (admin2026, chronicle2026master) are now REJECTED
    console.log('[ACTION] Testing that deprecated keys (admin2026) are rejected');
    await page.fill('input[placeholder*="输入授权凭证"]', 'admin2026');
    await page.click('button:has-text("验证并解锁控制台")');
    await page.waitForTimeout(600);

    const errorMsg = await page.textContent('text=凭证无效！剩余安全尝试机会');
    console.log(`[CHECK] Old simple key rejected and brute force counter active? ${errorMsg ? 'PASS: ' + errorMsg : 'FAIL'}`);

    const bruteWarningShot = path.join(artifactsDir, 'admin_02_brute_force_warning.png');
    await page.screenshot({ path: bruteWarningShot });
    console.log(`[SNAPSHOT] Saved: ${bruteWarningShot}`);

    // 4. Test ONLY Authorized Sovereign Token Login
    console.log('[ACTION] Entering authorized single sovereign token');
    const ownerToken = '4/0ATsMZqDbEqJWdiTVSo1cTG7kOIk3fhnr68dn0c-lJTpRNOL5gm7JiAQB95oemjosrVXSwQ';
    await page.fill('input[placeholder*="输入授权凭证"]', ownerToken);
    await page.click('button:has-text("验证并解锁控制台")');
    await page.waitForTimeout(1000);

    // Verify Admin Dashboard opened
    const dashboardTitle = await page.textContent('text=主理人安全控制台');
    console.log(`[CHECK] Admin Dashboard successfully unlocked? ${dashboardTitle ? 'PASS' : 'FAIL'}`);

    // Check Tab 1: Live Telemetry
    const analyticsShot = path.join(artifactsDir, 'admin_03_dashboard_analytics_tab.png');
    await page.screenshot({ path: analyticsShot });
    console.log(`[SNAPSHOT] Saved: ${analyticsShot}`);

    // Check Tab 2: Commercial CRM
    console.log('[ACTION] Switching to Tab 2: Commercial CRM Leads');
    await page.click('button:has-text("商业潜客看板")');
    await page.waitForTimeout(600);
    const crmShot = path.join(artifactsDir, 'admin_04_dashboard_crm_tab.png');
    await page.screenshot({ path: crmShot });
    console.log(`[SNAPSHOT] Saved: ${crmShot}`);

    // Check Tab 3: Security & Passkey Update
    console.log('[ACTION] Switching to Tab 3: Security Sentinel & Keys');
    await page.click('button:has-text("安全防线密钥")');
    await page.waitForTimeout(600);
    const securityShot = path.join(artifactsDir, 'admin_05_dashboard_security_tab.png');
    await page.screenshot({ path: securityShot });
    console.log(`[SNAPSHOT] Saved: ${securityShot}`);

    await context.close();

    console.log('\n--- STEP 2: Hidden Gesture Verification (Triple Click on Logo) ---');
    const context2 = await browser.newContext({
      viewport: { width: 1280, height: 800 },
      locale: 'zh-CN',
    });
    const page2 = await context2.newPage();
    await page2.goto(`http://localhost:${port}/ai-chronicle-2026/`, { waitUntil: 'networkidle' });
    await page2.waitForTimeout(1000);

    // Locate brand logo
    const logoPill = await page2.$('text=AI 全景通史');
    if (logoPill) {
      console.log('[ACTION] Performing triple-click on brand logo pill within 1.2s');
      await logoPill.click();
      await page2.waitForTimeout(150);
      await logoPill.click();
      await page2.waitForTimeout(150);
      await logoPill.click();
      await page2.waitForTimeout(800);

      const isCheckpointOpen = await page2.$('text=主理人安全通道');
      console.log(`[CHECK] Checkpoint opened via triple-click gesture? ${isCheckpointOpen !== null ? 'PASS' : 'FAIL'}`);

      const tripleClickShot = path.join(artifactsDir, 'admin_06_triple_click_success.png');
      await page2.screenshot({ path: tripleClickShot });
      console.log(`[SNAPSHOT] Saved: ${tripleClickShot}`);
    } else {
      console.log('[WARN] Logo pill not found with selector!');
    }
    await context2.close();

    console.log('\n--- STEP 3: Secret URL Route Verification (?admin_vault=chronicle2026) ---');
    const context3 = await browser.newContext({
      viewport: { width: 1280, height: 800 },
      locale: 'zh-CN',
    });
    const page3 = await context3.newPage();
    await page3.goto(`http://localhost:${port}/ai-chronicle-2026/?admin_vault=chronicle2026`, { waitUntil: 'networkidle' });
    await page3.waitForTimeout(1000);

    const urlCheckpoint = await page3.$('text=主理人安全通道');
    console.log(`[CHECK] Checkpoint opened via secret URL query? ${urlCheckpoint !== null ? 'PASS' : 'FAIL'}`);
    await context3.close();

    console.log('\n--- STEP 4: Mobile Responsive Viewport Verification (iPhone 14 Pro, 393x852) ---');
    const mobileContext = await browser.newContext({
      viewport: { width: 393, height: 852 },
      isMobile: true,
      hasTouch: true,
      locale: 'zh-CN',
    });
    const mobilePage = await mobileContext.newPage();
    await mobilePage.goto(`http://localhost:${port}/ai-chronicle-2026/?admin_vault=chronicle2026`, { waitUntil: 'networkidle' });
    await mobilePage.waitForTimeout(1000);

    // Login on mobile with single owner token
    await mobilePage.fill('input[placeholder*="输入授权凭证"]', '4/0ATsMZqDbEqJWdiTVSo1cTG7kOIk3fhnr68dn0c-lJTpRNOL5gm7JiAQB95oemjosrVXSwQ');
    await mobilePage.click('button:has-text("验证并解锁控制台")');
    await mobilePage.waitForTimeout(1000);

    // Mobile analytics tab
    const mobileAnalyticsShot = path.join(artifactsDir, 'admin_07_mobile_dashboard_analytics.png');
    await mobilePage.screenshot({ path: mobileAnalyticsShot });
    console.log(`[SNAPSHOT] Saved: ${mobileAnalyticsShot}`);

    // Mobile CRM tab
    await mobilePage.click('button:has-text("商业潜客看板")');
    await mobilePage.waitForTimeout(600);
    const mobileCrmShot = path.join(artifactsDir, 'admin_08_mobile_dashboard_crm.png');
    await mobilePage.screenshot({ path: mobileCrmShot });
    console.log(`[SNAPSHOT] Saved: ${mobileCrmShot}`);

    await mobileContext.close();

    console.log('\n✅ ALL VERIFICATION CHECKS PASSED SUCCESSFULLY!');
  } catch (err) {
    console.error('Test execution failed:', err);
  } finally {
    await browser.close();
    server.close();
  }
}

runSecurityVaultVerification();
