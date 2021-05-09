const sequelize = require('./seq')
require('./model')

// 测试连接
sequelize.authenticate().then(() => {
    console.log('auth ok')
}).catch(() => {
    console.log('auth err')
})

// 执行同步
sequelize.sync({ force: true }).then(() => {
    console.log('sync ok')
    process.exit()
})
