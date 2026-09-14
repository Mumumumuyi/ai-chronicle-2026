const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

async function testResponsiveDevices() {
  const artifactDir = 'C:\\Users\\Amu\\.gemini\\antigravity-cli\\brain\\e5702866-950e-4fac-b708-574215ea9583';
  const outDir = path.join(__dirname, '..', 'screenshots');
  if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

  console.log('1. 正在启动自动化 Chromium 进行全设备屏幕多端适配实机渲染测试...');
  const browser = await chromium.launch({
    channel: 'chrome',
    headless: true,
  });

  const devices = [
    {
      name: 'Mobile_iPhone14',
      viewport: { width: 390, height: 844 },
      isMobile: true,
      hasTouch: true,
      deviceScaleFactor: 3,
      shotName: 'device_01_mobile_iphone.png',
      desc: '移动端 iPhone 竖屏与原生悬浮底部导航',
    },
    {
      name: 'Tablet_iPad',
      viewport: { width: 820, height: 1180 },
      isMobile: true,
      hasTouch: true,
      deviceScaleFactor: 2,
      shotName: 'device_02_tablet_ipad.png',
      desc: '平板 iPad 竖屏自适应中屏展台',
    },
    {
      name: 'Desktop_MacBook',
      viewport: { width: 1440, height: 900 },
      isMobile: false,
      hasTouch: false,
      deviceScaleFactor: 2,
      shotName: 'device_03_desktop_macbook.png',
      desc: '桌面端高清宽屏全景流体玻璃体验',
    },
  ];

  const liveUrl = 'https://mumumumuyi.github.io/ai-chronicle-2026/';

  for (const dev of devices) {
    console.log(`2. 正在模拟【${dev.desc}】(${dev.viewport.width}x${dev.viewport.height})...`);
    const context = await browser.newContext({
      viewport: dev.viewport,
      isMobile: dev.isMobile,
      hasTouch: dev.hasTouch,
      deviceScaleFactor: dev.deviceScaleFactor,
    });

    const page = await context.newPage();
    try {
      await page.goto(liveUrl, { waitUntil: 'networkidle', timeout: 25000 });
    } catch (err) {
      console.log('线上加载稍慢，已继续抓取页面...');
    }

    await page.waitForTimeout(1500);

    const shotPath = path.join(outDir, dev.shotName);
    await page.screenshot({ path: shotPath });
    console.log(`✓ 截图已保存: ${shotPath}`);

    // If mobile, test opening reader to verify mobile TOC button
    if (dev.name === 'Mobile_iPhone14') {
      const readerTab = await page.locator('nav button:has-text("长卷")').last();
      if (await readerTab.count() > 0) {
        await readerTab.click();
        await page.waitForTimeout(1000);
        const mobileReaderShot = path.join(outDir, 'device_04_mobile_reader_toc.png');
        await page.screenshot({ path: mobileReaderShot });
        console.log(`✓ 截图已保存 (移动端长卷与快捷目录浮层): ${mobileReaderShot}`);
      }
    }

    await context.close();
  }

  // Copy to Artifact Directory
  if (fs.existsSync(artifactDir)) {
    for (const f of fs.readdirSync(outDir)) {
      if (f.startsWith('device_') && f.endsWith('.png')) {
        fs.copyFileSync(path.join(outDir, f), path.join(artifactDir, f));
      }
    }
    console.log('✓ 所有多设备实测截图已全量同步至 Artifact 目录！');
  }

  await browser.close();
  console.log('3. 多设备视口自动化适配实测圆满完成！');
}

testResponsiveDevices().catch(err => {
  console.error('测试出错:', err);
  process.exit(1);
});
