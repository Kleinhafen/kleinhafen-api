const express = require('express')
const cors = require('cors')
const config = require('./config/config')
const sgMail = require('@sendgrid/mail')

const PORT = process.env.PORT || 9000

function makeEmailBodyForFormMessage(msg) {
  const grd = (d) => d.length > 0 ? d : 'not known'

  const keysToShow = ['dates', 'nPeople']

  const niceKeyDict = {
    name: 'Name',
    email: 'Email address',
    phone: 'Phone number',
    company: 'Company',
    dates: 'Event date',
    tourDates: 'Tour date',
    nPeople: 'Number of people',
    description: 'Description',
  }

  const formTypeLine = {
    flexDesk: `<p>Someone is asking about a flex desk.</p>`,
    fixedDesk: '<p>Someone is asking about a fixed desk.</p>',
    meetingRoom: '<p>Someone is asking about a meeting room.</p>',
    storefront: '<p>Someone is asking about the storefront.</p>',
  }[msg.formType]

  const detailsLine = `
    <p>
      Their name is ${grd(msg.name)}, their email is ${grd(msg.email)},
      and their phone number is ${grd(msg.phone)}.
    </p>
  `

  const companyLine = (msg.company.length == 0 ? '' : `
    <p>They work at ${msg.company}.</p>
  `)

  const peopleLine = (msg.nPeople.length == 0 ? '' : `
    <p>They expect this many people: ${msg.nPeople}.</p>
  `)

  const datesLine = (msg.dates.length == 0 ? '' : `
    <p>The date(s) they need the space for is: ${msg.dates}.</p>
  `)

  const tourDatesLine = (msg.tourDates.length == 0 ? '' : `
    <p>This is when they would like to have their tour: ${msg.tourDates}.</p>
  `)

  const descriptionLine = (msg.description.length == 0 ? `
    <p>They didn't put in a message! How silly.</p>
  ` : `
    <p>
      Here's what they said:<br>
      ${msg.description}
    </p>
  `)

  return `
  <p>Ahoi!</p>

  ${formTypeLine}
  ${detailsLine}
  ${companyLine}
  ${peopleLine}
  ${datesLine}
  ${tourDatesLine}
  ${descriptionLine}

  <p>
    Best,<br>
    The friendly Kleinhafen email bot person thing guy
  </p>
  `
}

function sendFormEmail(emailBody) {
  const msg = {
    to: 'ahoi@kleinhafen.ch',
    cc: 'vlad@vladh.net',
    from: 'no-reply@kleinhafen.ch',
    subject: 'New message from the website',
    text: "There's a new message from the website! Please use an email client that supports HTML to see it.",
    html: emailBody,
  }
  sgMail.send(msg, (err) => {
    if (err) {
      console.error(err)
    }
  })
}

sgMail.setApiKey(config.sendgridKey)

let app = express()
app.use(cors())
app.use(express.json())
app.use(express.urlencoded())

app.post('/api/interest-form-message', (req, res, next) => {
  console.log(req.body)
  const emailBody = makeEmailBodyForFormMessage(req.body)
  sendFormEmail(emailBody)
  res.json({status: 'ok'})
  res.end()
})

app.listen(PORT, () => {
  console.log('Listening on port ' + PORT)
})
