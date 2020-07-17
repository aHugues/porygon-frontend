# Porygon Web interface

[![Version](https://img.shields.io/github/package-json/v/ahugues/porygon-frontend)](https://github.com/aHugues/porygon-frontend)
[![Build Status](https://travis-ci.org/aHugues/porygon-frontend.svg?branch=master)](https://travis-ci.org/aHugues/porygon-frontend)
[![codecov](https://codecov.io/gh/aHugues/porygon-frontend/branch/master/graph/badge.svg)](https://codecov.io/gh/aHugues/porygon-frontend)
![GitHub](https://img.shields.io/github/license/ahugues/porygon-frontend)

VueJS web interface to manage a movies and series collection, along with categories, locations, and sorting.


## Installation

### Prerequisites

You need **Node.JS** (version 10 or later) to install the application, as well as the VueCLI package

The Porygon API must also be installed and be accessible, further instructions are available [here](https://github.com/ahugues/porygon-backend)

### Install procedure

Install the VueCLI using `npm` (a global install is recommanded if you might have several Vue projects)

```shell
npm install -g @vue/cli
```

Then install the project using `npm`

```shell
npm install
```


## Configuration

### Application configuration

Most of the project configuration is ran using a single configuration file located in `/src/config.js`. It has the following structure:

```javascript
export default {
  all: {
    porygonApiMinVersion: '0.4.1',
  },
  development: {
    porygonApiBaseUrl: 'http://localhost:4000/api/v1',
    porygonApiAuthentication: false,
  },
  production: {
    porygonApiBaseUrl: 'https://api.porygon.example.com',
    porygonApiAuthentication: true,
  },
};
```

The option `porygonApiMinVersion` allows to restrict the version of the Porygon API. You should not touch this value as it is automatically changed during development.

The options `porygonApiVaseUrl` and `porygonApiAuthentication` are both set for a production environment (using `npm run serve --production` or `npm run build --production`) or a dev environment (`npm run serve`.)
- `porygonApiBaseUrl` should be the root path of your API (as defined during its configuration)
- `porygonApiAuthentication` should be put to `true` if your API enforces authentication. Currently, only [keycloak](https://www.keycloak.org/) is supported

Typically, your dev environment is set to `localhost` without authentication, while your production environment should have an actual host with authentication enabled.

### Authentication

> Only consider this if you are using Keycloak as an authentication backend, and have set `porygonApiAuthentication` to `true`

`Keycloak` is configured using a `keycloak.json` file put in the `src` directory `src/keycloak.json`

It should have a structure similar to this:

```json
{
  "realm": "your-realm",
  "url": "https://keycloak.example.com/auth",
  "public-client": true,
  "confidential-port": 0,
  "clientId": "porygon-public",
  "onLoad": "login-required"
}
```

To get the correct values, please refer to the [keycloak](https://www.keycloak.org/) documentation.


## Running the project

### Dev mode

To run the project in development mode, configure it and run it using `npm`

```shell
npm run serve
```

By default, it should be accessible using `http://localhost:8080`

This behavior can be configured with `vue.config.js`, please refer to the official [VueCLI documentation](https://cli.vuejs.org/guide/) for further information

### Production mode

To run in production mode, you can run it using `npm`.

```shell
npm run serve --production
```

However, this will still using a development server, and is not recommended for actual production use.

Build the production dist using `npm`

```shell
npm run build --production
```

You will have a `dist` directory that you should then serve using a web server, for instance `nginxx`

Here is a sample of an `nginx` configuration file adapted to this application. This configuration redirects all traffic through HTTPS: 

```nginx
server {
    listen 80;
    server_name porygon.example.com www.porygon.example.com;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    listen [::]:443 ssl http2;
    server_name porygon.example.com www.porygon.example.com;

    # include secured SSL config
    # this allows to reuse SSL configuration among several servers
    include /etc/nginx/snippets/ssl.conf;

    # include security_headers
    # some headers can be reused, but Content-Security-Policy must be adapted to your server
    include /etc/nginx/snippets/security_headers.conf;
    add_header Content-Security-Policy "default-src 'self'; style-src 'self' 'unsafe-inline' https://maxcdn.bootstrapcdn.com https://fonts.googleapis.com; font-src https://maxcdn.bootstrapcdn.com https://fonts.gstatic.com; script-src 'self'; connect-src https://api.porygon.example.com https://keycloak.example.com; frame-src https://keycloak.example.com 'self'";

    # add custom config
    location / {
        root /var/www/sites/porygon-frontend/;
        try_files $uri $uri/ /index.html =404;
    }

    ssl_trusted_certificate /etc/letsencrypt/live/porygon.example.com/fullchain.pem;
    ssl_certificate /etc/letsencrypt/live/porygon.example.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/porygon.example.com/privkey.pem;

}
```

This is just an example, and you should refer to the various documents available to ensure you have a corect configuration. 

#### Docker

A docker image is available with a preconfigured server. It can be ran using 
```shell
docker run -p 4000:80 --name porygon_frontend -v /var/log/porygon-frontend/:/var/log/nginx ahugues/porygon-frontend:latest
```

This will bind the logs directory to `/var/log/porygon-frontend` and listen on port `4000`. However this does not prevent from using the full nginx proxy as this version is not protected.

### Run the tests

If you want to run the unit and e2e tests, use `npm`:

```shell
npm run test:unit
npm run test:e2e
```

## Contributing

Contributions are closed at the moment.