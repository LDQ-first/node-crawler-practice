const http = require('http')
const https = require('https')
const fs = require('fs')
const path = require('path')
const { promisify } = require('util')
const writeFile = promisify(fs.writeFile)

module.exports = async (src, dir) => {
  if (/\.(jpe?g|png|gif|svg|webp)$/.test(src)) {
    await urlToImg(src, dir)
  } else {
    await base64ToImg(src, dir)
  }
}

// url => image
const urlToImg = promisify((url, dir, callback) => {
  const mod = /^https:/.test(url) ? https : http
  const ext = path.extname(url)
  const random = parseInt(Math.random() * 100)
  const file = path.join(dir, `image.baidu.${Date.now()}.${random}${ext}`)
  mod.get(url, res => { 
    res.pipe(fs.createWriteStream(file))
      .on('finish', () => {
        callback()
        console.log(`${file} is created`)
      })
  })
})

// base64 => image

const base64ToImg = async (base64Str, dir) => {
  // data:image/jpeg;base64,/sgsdg……
  try {
    const matches = base64Str.match(/^data:(.+?);base64,(.+)$/)
    const ext = matches[1].split('/')[1]
                .replace('jpeg', 'jpg')
    const random = parseInt(Math.random() * 100)
    const file = path.join(dir, `image.baidu.${Date.now()}.${random}.${ext}`)
    await writeFile(file, matches[2], 'base64')
    console.log(file)
  } catch(err) {
    console.error(`base64ToImg is err\n${err}`)
  }
  
}
