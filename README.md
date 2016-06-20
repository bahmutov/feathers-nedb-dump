# feathers-nedb-dump

> Middleware for Feathers.js - dumps and restores NeDB database for a given service

[![NPM][npm-icon] ][npm-url]

[![Build status][ci-image] ][ci-url]
[![semantic-release][semantic-image] ][semantic-url]
[![js-standard-style][standard-image]][standard-url]

Read [Immutable deploys with data and testing](https://glebbahmutov.com/blog/immutable-deploys-with-data-and-testing/) blog post for explanation why this
project exists.

## Install and use

```
npm install --save feathers-nedb-dump
```

Then add as middleware to your [Feathers app](http://feathersjs.com/).
You need a `GET` route to return the service database and a `POST`
route to set new one. This module assumes the service uses
[NeDB](https://github.com/feathersjs/feathers-nedb) adapter.

```js
// src/middleware/index.js
const dbSet = require('feathers-nedb-dump').set;
const dbDump = require('feathers-nedb-dump').get;
module.exports = function() {
  // Add your custom middleware here. Remember, that
  // just like Express the order matters, so error
  // handling middleware should go last.
  const app = this;
  // GET and POST to return and receive service database
  app.get('/db-dump/:service', dbDump(app));
  app.post('/db-set', dbSet(app));
  // other routes
  app.use(notFound());
  app.use(logger(app));
  app.use(handler());
};
```

Then configure the token in `config/default.json` to only allow trusted
calls to receive and set the database. For value use long random string.

```json
{
  "nedb": "/tmp/",
  "dumb-db-secret": "ebd2d309-83d2-4857-8b02-b933c480c1a9"
}
```

## Receive database

To grab the current database, make a GET request with additional user
header `dumb-db-secret` equal to the secret token. For example using
[httpie](https://github.com/jkbrzt/httpie) save the file

```sh
HOST=localhost:3030
NAME=messages
TOKEN=ebd2d309-83d2-4857-8b02-b933c480c1a9
http $HOST/db-dump/$NAME dumb-db-secret:$TOKEN > $NAME.db
```

Make sure the production host uses HTTPS to avoid someone intercepting
the token. See file [get-messages.sh](get-messages.sh) for example.

## Set database

Once you have a database to upload, execute a POST request with
the name of the service and the new database content pases in the body.

```sh
HOST=localhost:3030
NAME=messages
TOKEN=ebd2d309-83d2-4857-8b02-b933c480c1a9
FILENAME=$NAME.db
http -f POST $HOST/db-set dumb-db-secret:$TOKEN service=$NAME db=@$FILENAME
```

See file [set-messages.sh](set-messages.sh) for example.

## Copy database

A combination of getting and setting calls, see [copy-data.sh](copy-data.sh).
Adjust the names of the services to copy and call the script. Note that
two tokens could be different for better security measure.

### Small print

Author: Gleb Bahmutov &lt;gleb.bahmutov@gmail.com&gt; &copy; 2016


* [@bahmutov](https://twitter.com/bahmutov)
* [glebbahmutov.com](http://glebbahmutov.com)
* [blog](http://glebbahmutov.com/blog)


License: MIT - do anything with the code, but don't blame me if it does not work.

Support: if you find any problems with this module, email / tweet /
[open issue](https://github.com/bahmutov/feathers-nedb-dump/issues) on Github

## MIT License

Copyright (c) 2016 Gleb Bahmutov &lt;gleb.bahmutov@gmail.com&gt;

Permission is hereby granted, free of charge, to any person
obtaining a copy of this software and associated documentation
files (the "Software"), to deal in the Software without
restriction, including without limitation the rights to use,
copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the
Software is furnished to do so, subject to the following
conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
OTHER DEALINGS IN THE SOFTWARE.

[npm-icon]: https://nodei.co/npm/feathers-nedb-dump.png?downloads=true
[npm-url]: https://npmjs.org/package/feathers-nedb-dump
[ci-image]: https://travis-ci.org/bahmutov/feathers-nedb-dump.png?branch=master
[ci-url]: https://travis-ci.org/bahmutov/feathers-nedb-dump
[semantic-image]: https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg
[semantic-url]: https://github.com/semantic-release/semantic-release
[standard-image]: https://img.shields.io/badge/code%20style-standard-brightgreen.svg
[standard-url]: http://standardjs.com/
