const puppeteer = require('puppeteer')
const { screenshot } = require('./config/default')

;(async () => {
  const brower = await puppeteer.launch()
  const page = await brower.newPage()
  await page.goto('https://unsplash.com/')
  await page.screenshot({
    path: `${screenshot}/unsplash.${Date.now()}.png`
  })
  await brower.close()
})()

