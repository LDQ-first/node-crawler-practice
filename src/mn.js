const puppeteer = require('puppeteer')
const { mn } = require('./config/default')
const srcToImg = require('./helper/srcToImg')

;(async () => {
  const brower = await puppeteer.launch()
  const page = await brower.newPage()
  await page.goto('https://image.baidu.com/')
  console.log('go to https://image.baidu.com/\n')

  await page.setViewport({
    width: 1920,
    height: 1080
  })
  console.log('reset viewport\n')

  await page.focus('#kw')
  console.log('focus\n')
  await page.keyboard.sendCharacter('狗')
  console.log('set input value to 狗\n')
  await page.click('.s_search')
  console.log('click button\n')

  console.log('go to search list\n')

  page.on('load', async () => {
    console.log('page loading done, start fetch...\n')

    const srcs = await page.evaluate(() => {
      const images = document.querySelectorAll('img.main_img')
      return Array.from(images).map(img => img.src)
    })

    console.log(`get ${srcs.length} images, start download\n`)

    srcs.forEach(async (src) => {
      // sleep
      await page.waitFor(200)
      await srcToImg(src, mn)
    })

    await brower.close()
  })
})()