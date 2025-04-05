const app = async () => {
    const db = require('./db/database')
    await db.create()
    require('./web/server')
}

app()

/* TODO: Things- Extra ways to end the game?        */
/* TODO: Add default avatar options to profile?     */
