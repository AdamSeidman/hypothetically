/**
 * Table: categories
 * 
 * Items and their categories for the game
 */

const { randomArrayItem } = require('poop-sock')
const stats = require('../../monitor/stats')
const logger = require('../../monitor/log')

let client = undefined

const TABLE_NAME = 'categories'

async function create(supabase) {
    client = supabase
    const { error, data } = await client.from(TABLE_NAME).select()
    if (error) {
        throw new Error(error)
    } else if (Array.isArray(data)) {
        stats.setCategoryCount(data.length)
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
    stats.incrementCategoryCount()
}

async function getRandom() {
    const { error, data } = await client.from(TABLE_NAME).select()
    if (error || !Array.isArray(data) || data.length < 1) {
        logger.error('Could not get random category!', error || '[bad data]')
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
