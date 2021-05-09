const sequelize = require('../seq')
const { INTEGER, STRING, TEXT } = require('./types')
const UserRelation = sequelize.define('userRelation', {
    userId: {
        type: INTEGER,
        allowNull: false,
        comment: '用户 id'
    },
    followerId: {
        type: INTEGER,
        allowNull: false,
        comment: '被关注用户的 id'
    }
})

module.exports = UserRelation
