const io = require('@pm2/io')

const statMap = {}

statMap.OpenGamesCount = io.metric({ name: 'Open Games Count' })
statMap.UserCount = io.metric({ name: 'User Count' })
statMap.OpenSocketCount = io.metric({ name: 'Open Socket Count' })
statMap.CategoryCount = io.metric({ name: 'Category Count' })
statMap.QuestionCount = io.metric({ name: 'Question Count' })
statMap.TabCount = io.metric({ name: 'Tab Count' })
statMap.ThingsCount = io.metric({ name: 'Things Count' })

Object.keys(statMap).forEach((key) => {
    module.exports[`increment${key}`] = () => {
        statMap[key].set(statMap[key].val() + 1)
    }
    module.exports[`decrement${key}`] = () => {
        statMap[key].set(statMap[key].val() - 1)
    }
    module.exports[`set${key}`] = (num) => {
        num = Number(num)
        if (!Number.isFinite(num)) return
        statMap[key].set(num)
    }
    statMap[key].set(0)
})
