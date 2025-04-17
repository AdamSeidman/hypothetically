/**
 * Table: things
 * 
 * Items and their categories for the game
 */

const { randomArrayItem } = require('poop-sock')
const stats = require('../../monitor/stats')

let client = undefined

const TABLE_NAME = 'things'

async function create(supabase) {
    client = supabase
    const { error, data } = await client.from(TABLE_NAME).select()
    if (error) {
        throw new Error(error)
    } else if (Array.isArray(data)) {
        stats.setThingsCount(data.length)
    }
}

async function add(thing, user) {
    if (typeof thing !== 'string') return
    let item = {
        thing,
        submitted_by: user
    }
    const { error } = await client
        .from(TABLE_NAME)
        .insert(item)
    if (error) {
        console.error('Add thing error', error)
        return error
    } else {
        console.log('Added Thing:', thing)
        stats.incrementThingsCount()
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

async function getAllThings() {
    const { error, data } = await client.from(TABLE_NAME).select()
    if (error || !Array.isArray(data) || data.length < 1) {
        console.error(error || '[bad data]')
        return
    }
    return data.map(x => x.thing)
}

module.exports = {
    create,
    queries: {
        add,
        getRandom,
        getAllThings
    }
}
