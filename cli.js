#!/usr/bin/env node

var auth = require('./')

auth({
  configName: 'googleauth',
  client_id: process.env['GOOGLE_CLIENT'] || process.env[2],
  client_secret: process.env['GOOGLE_SECRET'] || process.env[3],
  refresh: true
}, function (err, authData) {
  if (err) return console.error(err)
  console.log(authData)
})