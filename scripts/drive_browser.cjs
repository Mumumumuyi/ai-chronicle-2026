const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

async function runAutomation() {
  const artifactDir = 'C:\\Users\\Amu\\.gemini\\antigravity-cli\\brain\\e5702866-950e-4fac-b708-574215ea9583';
  const outDir = path.join(__dirname, '..', 'screenshots');
  if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

  console.log('1. 正在启动自动化 Chromium 浏览器引擎...');
  const browser = await chromium.launch({
    channel: 'chrome',
    headless: true,
  });

  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    deviceScaleFactor: 2, // Retina resolution
  });

  const page = await context.newPage();

  // Test both the global live URL and local
  const liveUrl = 'https://mumumumuyi.github.io/ai-chronicle-2026/';
  console.log(`2. 正在导航至线上公网地址: ${liveUrl}`);
  
  try {
    await page.goto(liveUrl, { waitUntil: 'networkidle', timeout: 30000 });
  } catch (err) {
    console.log('公网加载超时，切换至本地预览服务 http://localhost:4173/');
    await page.goto('http://localhost:4173/', { waitUntil: 'networkidle', timeout: 10000 });
  }

  // Wait 1.5s for fonts & liquid glass caustics
  await page.waitForTimeout(1500);

  // Screenshot 1: Main Stage (2026 Epoch VI)
  const shot1 = path.join(outDir, '01_live_main_stage.png');
  await page.screenshot({ path: shot1 });
  console.log(`✓ 截图 1 已保存: ${shot1}`);

  // Interaction 2: Click on Epoch 4 ("爆发 2012-20") in the navbar
  console.log('3. 模拟用户点击顶栏导航切换至纪元 IV (2012-2020 深度学习爆发)...');
  const epoch4Btn = await page.locator('button:has-text("爆发")').first();
  if (await epoch4Btn.count() > 0) {
    await epoch4Btn.click();
    await page.waitForTimeout(1000);
  }

  const shot2 = path.join(outDir, '02_epoch_4_stage.png');
  await page.screenshot({ path: shot2 });
  console.log(`✓ 截图 2 已保存: ${shot2}`);

  // Interaction 3: Click Milestone "AlphaGo 战胜李世石" or first milestone card to pop dossier
  console.log('4. 模拟用户点击第一个里程碑卡片，呼出液态玻璃绝密档案浮层...');
  const milestoneCard = await page.locator('.liquid-glass.rounded-2xl').first();
  if (await milestoneCard.count() > 0) {
    await milestoneCard.click();
    await page.waitForTimeout(1000);
  }

  const shot3 = path.join(outDir, '03_dossier_modal.png');
  await page.screenshot({ path: shot3 });
  console.log(`✓ 截图 3 已保存: ${shot3}`);

  // Close modal
  console.log('5. 关闭档案浮层...');
  const closeBtn = await page.locator('button:has(svg)').first();
  await page.keyboard.press('Escape');
  await page.waitForTimeout(600);

  // Interaction 4: Click "入驻广告 / 赞助合作" button to test Monetization
  console.log('6. 模拟用户点击“入驻广告 / 赞助合作”商业化变现按钮...');
  const sponsorBtn = await page.locator('button:has-text("入驻广告")').first();
  if (await sponsorBtn.count() > 0) {
    await sponsorBtn.click();
    await page.waitForTimeout(1000);
  }

  const shot4 = path.join(outDir, '04_monetization_modal.png');
  await page.screenshot({ path: shot4 });
  console.log(`✓ 截图 4 已保存: ${shot4}`);

  // Close sponsor modal
  await page.keyboard.press('Escape');
  await page.waitForTimeout(600);

  // Interaction 5: Switch to Lab view (缩放律)
  console.log('7. 切换至“缩放律”实验室视窗...');
  const labBtn = await page.locator('button:has-text("缩放律")').first();
  if (await labBtn.count() > 0) {
    await labBtn.click();
    await page.waitForTimeout(1000);
  }

  const shot5 = path.join(outDir, '05_scaling_lab.png');
  await page.screenshot({ path: shot5 });
  console.log(`✓ 截图 5 已保存: ${shot5}`);

  // Interaction 6: Switch to Ecosystem view (生态特权)
  console.log('8. 切换至“生态特权”AI 算力与开发工具变现中心...');
  const ecoBtn = await page.locator('button:has-text("生态特权")').first();
  if (await ecoBtn.count() > 0) {
    await ecoBtn.click();
    await page.waitForTimeout(1000);
  }

  const shot7 = path.join(outDir, '07_affiliate_ecosystem.png');
  await page.screenshot({ path: shot7 });
  console.log(`✓ 截图 7 已保存: ${shot7}`);

  // Interaction 7: Switch to Reader view (长卷)
  console.log('9. 切换至“长卷”学术精读长文视窗...');
  const readerBtn = await page.locator('button:has-text("长卷")').first();
  if (await readerBtn.count() > 0) {
    await readerBtn.click();
    await page.waitForTimeout(1000);
  }

  const shot6 = path.join(outDir, '06_treatise_reader.png');
  await page.screenshot({ path: shot6 });
  console.log(`✓ 截图 6 已保存: ${shot6}`);

  // Interaction 8: Click BibTeX Citation button
  console.log('10. 呼出学术引用 BibTeX 弹窗...');
  const citeBtn = await page.locator('button:has-text("引用本论著")').first();
  if (await citeBtn.count() > 0) {
    await citeBtn.click();
    await page.waitForTimeout(800);
    const shot8 = path.join(outDir, '08_bibtex_modal.png');
    await page.screenshot({ path: shot8 });
    console.log(`✓ 截图 8 已保存: ${shot8}`);
    await page.keyboard.press('Escape');
    await page.waitForTimeout(400);
  }

  // Interaction 9: Multilingual Language Switcher Test
  console.log('11. 测试全球主流语种切换功能 (切换至 🇺🇸 English)...');
  const langBtn = await page.locator('button[title*="Language"]').first();
  if (await langBtn.count() > 0) {
    await langBtn.click();
    await page.waitForTimeout(500);

    const enOption = await page.locator('button:has-text("English")').first();
    if (await enOption.count() > 0) {
      await enOption.click();
      await page.waitForTimeout(1000);
      const shot9 = path.join(outDir, '09_multilingual_english.png');
      await page.screenshot({ path: shot9 });
      console.log(`✓ 截图 9 已保存 (English): ${shot9}`);
    }

    console.log('12. 测试切换至 🇯🇵 日本語...');
    await langBtn.click();
    await page.waitForTimeout(500);
    const jaOption = await page.locator('button:has-text("日本語")').first();
    if (await jaOption.count() > 0) {
      await jaOption.click();
      await page.waitForTimeout(1000);
      const shot10 = path.join(outDir, '10_multilingual_japanese.png');
      await page.screenshot({ path: shot10 });
      console.log(`✓ 截图 10 已保存 (日本語): ${shot10}`);
    }
  }

  // Copy all shots to artifact directory so Antigravity can link them
  if (fs.existsSync(artifactDir)) {
    for (const f of fs.readdirSync(outDir)) {
      if (f.endsWith('.png')) {
        fs.copyFileSync(path.join(outDir, f), path.join(artifactDir, f));
      }
    }
    console.log('✓ 已全量同步至 Artifact 目录！');
  }

  await browser.close();
  console.log('13. 全链路多语言与自动化巡检圆满完成！');
}

runAutomation().catch(err => {
  console.error('自动化执行出错:', err);
  process.exit(1);
});
