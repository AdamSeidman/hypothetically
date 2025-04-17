const app = async () => {
    const title = 'Vlivoe Portal'
    console.log(`\r\n\r\n${
        require('figlet').textSync(title, { font: 'ANSI Shadow' }) || title
    }\n`)
    require('./monitor/stats')
    const db = require('./db/database')
    await db.create()
    require('./web/server')
}

app()
