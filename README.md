# googleauth

**Create and load persistent Google authentication tokens for command-line apps**

[![NPM](https://nodei.co/npm/googleauth.png?mini=true)](https://nodei.co/npm/googleauth/)

This module is based on [ghauth](https://github.com/rvagg/ghauth) which does the same thing for GitHub tokens

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

Because the token is persisted, the next time you run it there will be no prompts:

```
$ node awesome.js
{ access_token: 'foo',
  token_type: 'Bearer',
  expires_in: 3600,
  refresh_token: 'bar' }
```
