# googleauth

**Create and refresh a Google OAuth 2.0 authentication token for command-line apps**

[![NPM](https://nodei.co/npm/googleauth.png?mini=true)](https://nodei.co/npm/googleauth/)

This module is based on [ghauth](https://github.com/rvagg/ghauth) which does the same thing for GitHub tokens

You can learn about Google tokens here https://developers.google.com/accounts/docs/OAuth2WebServer

## Example usage

```
$ npm install googleauth -g
$ googleauth
Open the following URL in your browser, then paste the resulting authorization code below:

https://accounts.google.com/o/oauth2/auth?scope=https://www.googleapis.com/auth/drive&redirect_uri=urn:ietf:wg:oauth:2.0:oob&response_type=code&client_id=foobar

Google Authorization Code: weeeeeeeeee
{ access_token: 'foo',
  token_type: 'Bearer',
  expires_in: 3600,
  refresh_token: 'bar' }
```

Because the refresh token is persisted, the next time you run it there will be no prompts, and a fresh google token will be requested from google every time:

```
$ googleauth
{ access_token: 'fresh_token',
  token_type: 'Bearer',
  expires_in: 3600,
  refresh_token: 'bar' }
```
