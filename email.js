const util = require('util')
const nodemailer = require('nodemailer')
const config = require('./config/config')

const EMAIL_FROM = 'Kleinhafen <no-reply@kleinhafen.ch>'
const EMAIL_TO = 'ahoi@kleinhafen.ch, vlad@vladh.net'
const DEBUG_EMAIL_TO = 'vlad@vladh.net'

function makeEmailBodyForFormMessage(msg) {
  const grd = (d) => d.length > 0 ? d : 'Not known'

  const formTypeLine = {
    flexDesk: `<p>Someone is asking about a flex desk.</p>`,
    fixedDesk: '<p>Someone is asking about a fixed desk.</p>',
    meetingRoom: '<p>Someone is asking about a meeting room.</p>',
    storefront: '<p>Someone is asking about the storefront.</p>',
  }[msg.formType]

  const detailsLine = `
    <tr><td>Name</td><td>${grd(msg.name)}</td></tr>
    <tr><td>Email</td><td>${grd(msg.email)}</td></tr>
    <tr><td>Phone number</td><td>${grd(msg.phone)}</td></tr>
  `

  const companyLine = (msg.company.length == 0 ? '' : `
    <tr><td>Company</td><td>${msg.company}</td></tr>
  `)

  const peopleLine = (msg.nPeople.length == 0 ? '' : `
    <tr><td>Number of people</td><td>${msg.nPeople}</td></tr>
  `)

  const datesLine = (msg.dates.length == 0 ? '' : `
    <tr><td>Date(s) needed</td><td>${msg.dates}</td></tr>
  `)

  const tourDatesLine = (msg.tourDates.length == 0 ? '' : `
    <tr><td>Tour dates</td><td>${msg.tourDates}</td></tr>
  `)

  const descriptionLine = `<tr><td>Description</td><td>${msg.description}</td></tr>`

  return `
  <p>Ahoi!</p>

  ${formTypeLine}

  <table>
  ${detailsLine}
  ${companyLine}
  ${peopleLine}
  ${datesLine}
  ${tourDatesLine}
  ${descriptionLine}
  </table>

  <p>
    Best,<br>
    The Kleinhafen postman
  </p>
  `
}

function sendFormEmail(emailBody, done) {
  const transporter = nodemailer.createTransport({
    host: 'smtp.zoho.com',
    port: 465,
    secure: true,
    auth: {
      user: config.email.user,
      pass: config.email.password,
    }
  })

  const msg = {
    from: EMAIL_FROM,
    to: EMAIL_TO,
    subject: 'New message from the website',
    text: "There's a new message from the website! Please use an email client that supports HTML to see it.",
    html: emailBody,
  }

  transporter.sendMail(msg, (err, info) => {
    console.log('[email#sendFormEmail]', err, info)
    done(err, info)
  })
}

function sendDebugEmail(info, done) {
  const transporter = nodemailer.createTransport({
    host: 'smtp.zoho.com',
    port: 465,
    secure: true,
    auth: {
      user: config.email.user,
      pass: config.email.password,
    }
  })

  const msg = {
    from: EMAIL_FROM,
    to: DEBUG_EMAIL_TO,
    subject: 'kleinhafen.ch debug email',
    text: util.inspect(info, false, null),
  }

  transporter.sendMail(msg, (err, info) => {
    console.log('[email#sendDebugEmail]', err, info)
    if (done) {
      done(err, info)
    }
  })
}


module.exports = {
  makeEmailBodyForFormMessage,
  sendFormEmail,
  sendDebugEmail,
}
