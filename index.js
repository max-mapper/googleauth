var fs = require('fs')
var path = require('path')
var qs = require('querystring')

var read = require('read')
var mkdirp = require('mkdirp')
var xtend = require('xtend')
var request = require('request')

module.exports = auth

function auth (options, callback) {
  var defaultPath = path.join(process.env.HOME || process.env.USERPROFILE, '.config', options.configName + '.json')
  var configPath = options.config_path || defaultPath
  var authData
  
  options.redirect_uri = options.redirect_uri || "urn:ietf:wg:oauth:2.0:oob"
  
  // multiple scopes should be space delimited
  if (Array.isArray(options.scope)) options.scope = options.scope.join(' ')
  
  mkdirp.sync(path.dirname(configPath))
  
  try {
    authData = require(configPath)
  } catch (e) {}
  
  if (authData && authData.access_token && authData.refresh_token) {
    if (options.refresh) return checkAndUpdateToken(authData.refresh_token, options, function(err, updated) {
      if (err) return callback(err)
      updated.refresh_token = authData.refresh_token
      save(configPath, updated, callback)
    })
    return callback(null, authData)
  }
  
  if (!options.client_id) return callback(new Error('client_id option is missing'))
  if (!options.scope) return callback(new Error('scope is missing'))

  printAuthURL(options)
  
  prompt(function (err, code) {
    if (err)
      return callback(err)
    
    getToken(xtend(options, code), function (err, token) {
      if (err)
        return callback(err)
      save(configPath, token, callback)
    })
  })
}

function printAuthURL(options) {
  var authURL = "https://accounts.google.com/o/oauth2/auth?" +
    "scope=" + options.scope + "&" + 
    "redirect_uri=" + options.redirect_uri + "&" +
    "response_type=" + (options.response_type || "code") + "&" +
    "client_id=" + options.client_id
  var message = "Open the following URL in your browser, then paste the resulting authorization code below:"
  console.log(message + "\n\n" + encodeURI(authURL) + '\n\n')
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

function checkAndUpdateToken(token, options, cb) {
  refreshGoogleToken(token, options.client_id, options.client_secret, function (err, res, json) {
    if (err) return cb(err);
    if (json.error) return cb(new Error(res.statusCode + ': ' + json.error));
    if (!json.access_token) {
      console.log(json)
      return cb(new Error(res.statusCode + ': refreshToken error'));
    }
    cb(null, json)
  })
}

function save(configPath, data, callback) {
  fs.writeFile(configPath, JSON.stringify(data), 'utf8', function (err) {
    if (err) return callback(err)
    callback(null, data)
  })
}



function refreshGoogleToken (refreshToken, clientId, clientSecret, cb) {
  request.post('https://accounts.google.com/o/oauth2/token', {
    form: {
      refresh_token: refreshToken
    , client_id: clientId
    , client_secret: clientSecret
    , grant_type: 'refresh_token'
    }
  , json: true
  }, function (err, res, body) {
    // `body` should look like:
    // {
    //   "access_token":"1/fFBGRNJru1FQd44AzqT3Zg",
    //   "expires_in":3920,
    //   "token_type":"Bearer",
    // }
    if (err) return cb(err, res, body);
    if (parseInt(res.statusCode / 100, 10) !== 2) {
      if (body.error) {
        return cb(new Error(res.statusCode + ': ' + (body.error.message || body.error)), res, body);
      }
      if (!body.access_token) {
        return cb(new Error(res.statusCode + ': refreshToken error'), res, body);
      }
      return cb(null, res, body);
    }
    cb(null, res, body);
  });
}

function checkTokenValidity(accessToken, refreshToken, clientId, clientSecret, cb) {
  request({
    url: 'https://www.googleapis.com/oauth2/v1/userinfo'
  , qs: {alt: 'json'}
  , json: true
  , headers: { Authorization: 'Bearer ' + accessToken }
  }, function (err, res, json) {
    if (err) return cb(err, res, json);
    cb(null, !json.error)
  });
};
