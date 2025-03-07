const fs = require('fs')
const path = require('path')
const { createClient } = require('@supabase/supabase-js')
require('dotenv').config()

let client = undefined
let exportedFunctions = {}

async function create() {
    if (client === undefined) {
        client = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY)

        fs.readdirSync(path.join(__dirname, 'tables')).forEach(file => {
            if (path.extname(file) === '.js') {
                let tableName = file.slice(0, file.indexOf('.'))
                let table = require(`./tables/${tableName}`)
                if (table.create) {
                    table.create(client)
                    module.exports[tableName] = table.queries || {}
                }
            }
        })
    }
}

module.exports = {
    create
}
