/**
 * Table: categories
 * 
 * Items and their categories for the game
 */

const { randomArrayItem } = require('poop-sock')

let client = undefined

const TABLE_NAME = 'categories'

async function create(supabase) {
    client = supabase
    const { error } = await client.from(TABLE_NAME).select()
    if (error) {
        throw new Error(error)
    }
}

async function add(things, user) {
    if (!things) return
    let items = []
    Object.entries(things).forEach(([key, val]) => {
        if (key.includes('item')) {
            items.push(val)
        }
    })
    things = {
        submitted_by: user,
        category: things.category,
        items
    }
    const { error } = await client
        .from(TABLE_NAME)
        .insert(things)
    if (error) {
        return error
    }
}

async function getRandom() {
    const { error, data } = await client.from(TABLE_NAME).select()
    if (error || !Array.isArray(data) || data.length < 1) {
        console.error(error || '[bad data]')
        return
    }
    return randomArrayItem(data)
}

module.exports = {
    create,
    queries: {
        add,
        getRandom
    }
}
