const app = async () => {
    const db = require('./db/database')
    await db.create()
    require('./web/server')
}

app()

/* TODO: Flag emojis don't send properly            */
/* TODO: Things- Highlight current reader/guesser?  */
/* TODO: Things- Way(s) to end the game             */
