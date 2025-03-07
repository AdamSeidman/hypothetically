/**
 * Table: users
 * 
 * Website users and data
 */

let users = []
let client = undefined

const TABLE_NAME = 'users'

async function create(supabase) {
    client = supabase
    const { data, error } = await client.from(TABLE_NAME).select()
    if (error) {
        throw new Error(error)
    }
    else {
        users = data
    }
}

async function login(googleData) {
    if (!googleData) return
    let user = users.find(x => x.google_id == googleData.id)
    if (user) {
        console.log(`Logging in ${user.email}`)
        const { error } = await client
            .from(TABLE_NAME)
            .update({ last_login: 'NOW()' })
            .eq('google_id', googleData.id)
        if (error) {
            console.error('Error logging in user!', error)
        } else {
            return user
        }
    } else {
        user = {
            google_id: googleData.id,
            email: googleData.email,
            profile_picture: googleData.photo,
            name: googleData.displayName
        }
        console.log(`Registering new user (${user.name}): ${user.email}`)
        const { data, error } = await client
            .from(TABLE_NAME)
            .insert(user)
            .select()
        if (error || data.length !== 1) {
            console.error('Error registering user!', error || '[no return data]')
        }
        else {
            user = data[0]
            users.push(user)
            return user
        }
    }
}

function isAdmin(googleId) {
    if (!googleId) return
    let user = users.find(x => x.google_id == googleId)
    if (user) {
        return user.is_admin
    }
}

module.exports = {
    create,
    isAdmin,
    queries: {
        login
    }
}
