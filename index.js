var read = require('read')
var path = require('path')
var fs = require('fs')
var mkdirp = require('mkdirp')
var xtend = require('xtend')
var request = require('request')
var qs = require('querystring')

function printAuthURL(options) {
  var authURL = "https://accounts.google.com/o/oauth2/auth?" +
    "scope=" + options.scope + "&" + 
    "redirect_uri=" + options.redirect_uri + "&" +
    "response_type=" + (options.response_type || "code") + "&" +
    "client_id=" + options.client_id
  console.log("Open the following URL in your browser, then paste the resulting authorization code below:\n\n" + authURL + '\n\n')
}

function getToken(options, cb) {
  var reqOpts = {
    "method": "POST",
    "url": "https://accounts.google.com/o/oauth2/token",
    "body": qs.stringify(xtend(options, {grant_type: 'authorization_code'})),
    "headers": {
      "content-type": "application/x-www-form-urlencoded",
      "accept": "application/json"
    }
  }
  request(reqOpts, function(err, resp, json) {
    if (err || resp.statusCode > 299) return cb(err || resp.statusCode + typeof json !== 'undefined' ? json : '')
    var tokens = JSON.parse(json)
    cb(null, tokens)
  })
}


function prompt (callback) {
  read({ prompt: 'Google Authorization Code:' }, function (err, code) {
    if (err)
      return callback(err)

    if (code === '')
      return callback()

    callback(null, { code: code })
  })
}

function auth (options, callback) {
  var configPath = path.join(process.env.HOME || process.env.USERPROFILE, '.config', options.configName + '.json')
    , authData
    
  if (!options.client_id) return callback(new Error('client_id option is missing'))
  
  options.redirect_uri = options.redirect_uri || "urn:ietf:wg:oauth:2.0:oob"
  options.scope = options.scope || "https://www.googleapis.com/auth/drive"

  mkdirp.sync(path.dirname(configPath))

  try {
    authData = require(configPath)
  } catch (e) {}
  
  if (authData && authData.access_token && authData.refresh_token)
    return callback(null, authData)

  printAuthURL(options)
  
  prompt(function (err, code) {
    if (err)
      return callback(err)
    
    getToken(xtend(options, code), function (err, token) {
      if (err)
        return callback(err)

      fs.writeFile(configPath, JSON.stringify(token), 'utf8', function (err) {
        if (err)
          return callback(err)

        callback(null, token)
      })
    })
  })
}

module.exports = auth
