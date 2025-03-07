/**
 * Table: sessions
 * 
 * Store user session tokens
 */

const crypto = require('crypto')

let sessions = []
let client = undefined

const TABLE_NAME = 'sessions'
const ERROR_CODE_NO_DATA = 'PGRST116'

async function create(supabase) {
    client = supabase
    const { data, error } = await client.from(TABLE_NAME).select()
    if (error) {
        throw new Error(error)
    } else {
        sessions = data
    }
}

async function get(sid, callback) {
    try {
        const { data, error } = await client
            .from(TABLE_NAME)
            .select('data')
            .eq('session_id', sid)
            .single()
        
        if (error && error.code !== ERROR_CODE_NO_DATA) {
            callback(error, null)
        } else {
            callback(null, data? JSON.parse(data.data) : null)
        }
    } catch (err) {
        callback(err, null)
    }
}

async function set(sid, sessionData, callback) {
    try {
        const session_id = sid || crypto.randomBytes(16).toString('hex')

        const { error } = await client
            .from(TABLE_NAME)
            .upsert({
                session_id,
                data: JSON.stringify(sessionData),
                updated_at: 'NOW()'
            })
        
        if (error) {
            callback(error)
        } else {
            callback(null)
        }
    } catch (err) {
        callback(err)
    }
}

async function destroy(sid, callback) {
    if (typeof callback !== 'function') {
        callback = () => {}
    }
    try {
        const { error } = await client
            .from(TABLE_NAME)
            .delete()
            .eq('session_id', sid)
        
        if (error) {
            callback(error)
        } else {
            callback(null)
        }
    } catch (err) {
        callback(err)
    }
}

module.exports = {
    create,
    queries: {
        get,
        set,
        destroy
    }
}
