# FAC-FMC

[![Join the chat at https://gitter.im/ipcortex/FAC-FMC](https://badges.gitter.im/ipcortex/FAC-FMC.svg)](https://gitter.im/ipcortex/FAC-FMC?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)
FAC Find My Calls

[![Build Status](https://travis-ci.org/ipcortex/FAC-FMC.svg?branch=master)](https://travis-ci.org/ipcortex/FAC-FMC)

## INSTALLATION

* Make sure you have PostgreSQL installed and Node 6 onwards. 

* Install the npm modules:

```
$ npm i
```

## SETUP

* Create a config.env file in the root with 
```
API_KEY=abcd
JWT_KEY=abcd
PBX_URL=https://hostname.ipcortex.net
POSTGRES_URL=postgres://postgresusername:postgrespassword@hostname/databasename
POSTGRES_URL_TEST=postgres://postgresusername:postgrespassword@hostname/databasename
NODE_TLS_REJECT_UNAUTHORIZED=0
SAVE_AUDIO_PATH=../
```

* The API_KEY is to be obtained from IPCortex as your access token.
* JWT_KEY is a your auth strategy. See these [docs](https://github.com/dwyl/hapi-auth-jwt2) for details.
* PBX_URL is your IP cortex host name address
* POSTGRES_URL is needed to run queries to the database
* POSTGRES_URL_TEST is the url of your test database
* NODE_TLS_REJECT_UNAUTHORIZED=0 Turns off SSL authentication for development purposes.
* SAVE_AUDIO_PATH needs a trailing slash and is the place where you store all the .wav files. 


## RUNNING

* Start your Postgres server 

* Create a database called 'fmc'

* Connect to your fmc database

* Run the schema:

```
$ \i schema/schema.txt
```

* Then, in a separate tab, run either:

```
$ npm start
```
or if you have nodemon installed

```
$ npm run startmon 
```

* To run the tests, run the following in a separate terminal tab:
```
npm t
```

