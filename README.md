# googleauth

**Create and refresh a Google OAuth 2.0 authentication token for command-line apps**

[![NPM](https://nodei.co/npm/googleauth.png?mini=true)](https://nodei.co/npm/googleauth/)

This module is based on [ghauth](https://github.com/rvagg/ghauth) which does the same thing for GitHub tokens

You can learn about Google tokens here https://developers.google.com/accounts/docs/OAuth2WebServer

To use this you will need to:

- have a google account
- create a new application at the [google developers console](https://console.developers.google.com/project)
- enable an API on your new application (e.g. the gmail API)
- create a new client ID for an "Installed application"
- store the client ID and client secret in a secure location (you will need them to use `googleauth`)
- for the API you want to access locate the scope URL. e.g. gmail's scope url for read-only is: `https://www.googleapis.com/auth/gmail.readonly`

## Example usage

```
$ npm install googleauth -g
$ googleauth --scope="https://www.googleapis.com/auth/drive" --client_id="foobar" --client_secret="mysecret"
Open the following URL in your browser, then paste the resulting authorization code below:

https://accounts.google.com/o/oauth2/auth?scope=https://www.googleapis.com/auth/drive&redirect_uri=urn:ietf:wg:oauth:2.0:oob&response_type=code&client_id=foobar

Google Authorization Code: weeeeeeeeee
{ access_token: 'foo', token_type: 'Bearer', expires_in: 3600, refresh_token: 'bar' }
```

Because the refresh token is persisted, the next time you run it there will be no prompts, and a fresh google token will be requested from google every time:

```
$ googleauth
{ access_token: 'freshtokenhere', token_type: 'Bearer', expires_in: 3600, refresh_token: 'bar' }
```

## Resetting your token

A JSON file will be created when you first get a token at this location:

```js
path.join(process.env.HOME || process.env.USERPROFILE, '.config', 'googleauth.json')
```

You can simply delete that file to make `googleauth` forget about you.

If you change token settings e.g. add/remove scopes you will have to delete this file first so that `googleauth` will prompt you for the authentication flow again.

## Options

Pass in args using this CLI syntax: `googleauth --foo=bar`. You can pass in multiple scope arguments.

- **client_id** (required)
- **client_secret** (required)
- **scope** (required) - authentication scope, googles are usually full URIs
- **redirect_uri** (default `urn:ietf:wg:oauth:2.0:oob`) - you shouldnt need to change this, the default is what makes google use the CLI login flow
- **config_path** (default `~/.config/googleauth.json`)

Options are only required for authentication. You don't need to pass them in to refresh a token.
