/**
 * Table: tabs
 * 
 * Tabd and their data for the ten tabs game
 */

let client = undefined

const TABLE_NAME = 'tabs'
let tags = []

async function create(supabase) {
    client = supabase
    const { error, data } = await client.from(TABLE_NAME).select()
    if (error) {
        throw new Error(error)
    } else if (data) {
        tags = data.map(x => x.video_id)
    }
}

async function add(videoId, title, type, user) {
    if([videoId, title, type].find(x => typeof x !== 'string')) return
    if (!user || videoId.trim().length < 3) return

    const data = {
        submitted_by: user,
        title,
        type
    }
    if (tags.includes(videoId)) {
        const { error } = await client
            .from(TABLE_NAME)
            .update(data)
            .eq('video_id', videoId)
        if (error) return error
    } else {
        data.video_id = videoId
        const { error } = await client
            .from(TABLE_NAME)
            .insert(data)
        if (error) {
            return error
        } else {
            tags.push(videoId)
        }
    }
}

async function getAll() {
    const { error, data } = await client.from(TABLE_NAME).select()
    if (error || !Array.isArray(data) || data.length < 1) {
        console.error(error || '[bad data]')
        return
    }
    return data
}

module.exports = {
    create,
    queries: {
        add,
        getAll
    }
}
