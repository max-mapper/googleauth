#!/usr/bin/env node

var auth = require('./')
var args = require('minimist')(process.argv.slice(2))

auth({
  configName: 'googleauth',
  client_id: args.client_id || process.env['GOOGLEAUTH_CLIENT'],
  client_secret: args.client_secret || process.env['GOOGLEAUTH_SECRET'],
  refresh: true,
  scope: args.scope,
  redirect_uri: args.redirect_uri,
  config_path: args.config_path
}, function (err, authData) {
  if (err) return console.error(err)
  console.log(JSON.stringify(authData))
})