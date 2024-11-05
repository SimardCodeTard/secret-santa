# Secret Santa
This web app built using NextJS helps with organizing secret santas with your friends. Create draw events and invite your friends.

This app uses [MongoDB atlas](https://cloud.mongodb.com/) for persistence.

## Setup
- Install a JS package manager and runtime such as *Node & npm* or *Bun*
- Clone this repository `git clone git@github.com:SimardCodeTard/secret-santa.git`
- Install dependencies `npm i` or `bun i`
- Setup the environment variables : 
    - `MONGO_DB_URI` your mongoDB atlas URI, containing your username and password
    - `DB_NAME` the name of the database to use in MongoDB atlas
    - `ENCRYPTION_SALT_ROUNDS` number of passes to do when encrypting passwords
- Use `npm run dev` or `bun dev` to run locally, deploy to *Vercel* or any other solution of your choosing (you'll probably be better off using Vercel this is a NextJS app)