# How to setup the API #

### First run these commands in a new terminal with admin privileges: ###

`(sudo) npm install -g yarn`

`(sudo) npm install -g Typescript`

----

### Then open a terminal in this folder and run: ###
`
(sudo) yarn
`

----

### Next create a .env file and copy and pase the format below adding your own data: ###
```
DATABASE_URI=<insert database uri here>
AWS_REGION=us-east-1
AWS_ACCESS_KEY=<insert aws access key here>
AWS_SECRET_KEY=<insert aws secret key here>
BOT_ID=<insert bot id here>
BOT_ALIAS_ID=<insert bot alias id here>
LOCALE_ID=en_GB
```

----

### Finally start the server by running: ###
`
yarn start
`

----
----

## Any time you pull from the master branch to update ensure you use: ##
` yarn `
### to update all packages and install any not currently installed ###
