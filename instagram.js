const request = require('request')
const config = require('./config/config')

let images_cache = {
  mtime: 0,
  data: [],
}

function getUnixTime() {
  return Math.floor(new Date() / 1000)
}

function shouldInvalidateImagesCache() {
  const currentTime = getUnixTime()
  const invalidationTimespan = 60 * 60 * 6 // 6 hours in seconds
  return currentTime > images_cache.mtime + invalidationTimespan
}

function makeInstagramApiUrl(params) {
  const INSTAGRAM_API_URL = 'https://graph.instagram.com/'
  return INSTAGRAM_API_URL + params +
    '&access_token=' + config.instagram.access_token
}

function refreshImagesCache(done) {
  const url = makeInstagramApiUrl('/me/media?fields=media_url,permalink')
  console.log('[instagram#refreshImagesCache] GET ' + url)
  request({url, json: true}, (err, res, body) => {
    if (err) {
      return done(err)
    }
    const images = body.data
    images_cache.data = images
    images_cache.mtime = getUnixTime()
    done(null)
  })
}

function getInstagramFeed(done) {
  if (shouldInvalidateImagesCache()) {
    console.log('[instagram#getInstagramFeed] Refreshing cache')
    refreshImagesCache((err) => {
      if (err) {
        return done(err)
      }
      done(null, images_cache.data)
    })
  } else {
    console.log('[instagram#getInstagramFeed] Getting from cache')
    done(null, images_cache.data)
  }
}

module.exports = {
  getInstagramFeed,
}
