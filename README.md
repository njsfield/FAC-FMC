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

You'll need to configure the environment variables - these will need to be shared privately.
