# FAC-FMC

[![Join the chat at https://gitter.im/ipcortex/FAC-FMC](https://badges.gitter.im/ipcortex/FAC-FMC.svg)](https://gitter.im/ipcortex/FAC-FMC?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)
FAC Find My Calls

[![Build Status](https://travis-ci.org/ipcortex/FAC-FMC.svg?branch=master)](https://travis-ci.org/ipcortex/FAC-FMC)

## Getting Started

* Make sure you have PostgreSQL installed.

* Install the npm modules:

```
$ npm i
```
* Start your Postgres server by entering the following or a similar command into your terminal:

```
$ pg_ctl -D /usr/local/var/postgres -l /usr/local/var/postgres/server.log start

```
* Login to psql as the Postgres user:

```
$ psql postgres
```
* Connect to the fmc database:

```
$ \c fmc
```
* Run the schema:

```
$ \i src/db/db_schema.txt
```

* Then, in a separate tab, run either:

```
$ npm start
```
or

```
$ npm run startmon
```

You'll need to configure the environment variables. Create a config.env file in the root folder and enter the following keys.

```
API_KEY= (string e.g. gdeh6e3bkewjd983hje8h9)
```
To be obtained from IPCortex.
```
JWT_KEY= (string e.g. hdeu998hjewhw97hfwefkjwf)
```
To be created in the src/server/server.js in the auth strategy object. See these [docs](https://github.com/dwyl/hapi-auth-jwt2) for details.
```
PBX_URL= (url e.g. https:// ...  .net)
```
To be obtained from IPCortex.
```
POSTGRES_URL= (url e.g. postgres:// ... )
```
To be obtained from Founders and Coders. Needed to run any queries to the database.
```
POSTGRES_URL_TEST= (url e.g. postgres:// ... )
```
To be obtained from Founders and Coders. Needed to run any queries to the database in the tests.
```
NODE_TLS_REJECT_UNAUTHORIZED=0
```

To run the tests, run the following in a separate terminal tab:
```
npm t
```


