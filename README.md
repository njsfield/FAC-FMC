# FAC-FMC

[![Join the chat at https://gitter.im/ipcortex/FAC-FMC](https://badges.gitter.im/ipcortex/FAC-FMC.svg)](https://gitter.im/ipcortex/FAC-FMC?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)
FAC Find My Calls

[![Build Status](https://travis-ci.org/ipcortex/FAC-FMC.svg?branch=master)](https://travis-ci.org/ipcortex/FAC-FMC)

## Getting Started

* Make sure you have PostgreSQL installed.

* Start your Postgres server by entering the following or a similar command into your terminal:

```
$ pg_ctl -D /usr/local/var/postgres -l /usr/local/var/postgres/server.log start

```

* Install the npm modules:

```
$ npm i
```

* Authorise your localhost:

```
$ export NODE_TLS_REJECT_UNAUTHORIZED=0
```

* Finally, run either:

```
$ npm start
```
or

```
$ npm run startmon
```
