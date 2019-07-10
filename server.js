const express = require('express')
const cors = require('cors')
let app = express()

const PORT = process.env.PORT || 9000

app.use(cors())
app.use(express.json())
app.use(express.urlencoded())

app.post('/interest-form-message', (req, res, next) => {
  console.log(req.body)
  res.json({status: 'ok'})
  res.end()
})

app.listen(PORT, () => {
  console.log('Listening on port ' + PORT)
})
