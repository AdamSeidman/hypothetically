const app = async () => {
    require('./monitor/log').init()
    require('./monitor/stats')
    const db = require('./db/database')
    await db.create()
    require('./web/server')
}

app()
