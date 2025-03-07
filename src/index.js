const app = async () => {
    const db = require('./db/database')
    await db.create()
    require('./web/server')
}

app()

// TODO
