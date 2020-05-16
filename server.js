const express = require('express')
const cors = require('cors')
const email = require('./email')
const instagram = require('./instagram')

const PORT = process.env.PORT || 9000

let app = express()
app.use(cors())
app.use(express.json())
app.use(express.urlencoded())

app.get('/api/instagram-feed', (req, res, next) => {
  instagram.getInstagramFeed((err, images) => {
    if (err) {
      res.status(500)
    }
    res.json({err, images})
    res.end()
  })
})

app.post('/api/interest-form-message', (req, res, next) => {
  console.log('[/api/interest-form-message]', req.body)
  const emailBody = email.makeEmailBodyForFormMessage(req.body)
  email.sendFormEmail(emailBody, (err, info) => {
    if (err) {
      res.status(500)
    }
    res.json({err})
    res.end()
  })
})

app.listen(PORT, () => {
  console.log('Listening on port ' + PORT)
})
