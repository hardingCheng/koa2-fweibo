const { isProd } = require('../utils/env')

let REDIS_CONF = {
    port: 6379,
    host: '127.0.0.1'
}

let MYSQL_CONF = {
    host: 'localhost',
    user: 'xwc',
    password: '123456',
    port: '3306',
    database: 'weibo'
}

if (isProd) {
    REDIS_CONF = {
        // 线上的 redis 配置
        port: 6379,
        host: '127.0.0.1'
    }

    MYSQL_CONF = {
        host: 'localhost',
        user: 'xwc',
        password: '123456',
        port: '3306',
        database: 'weibo'
    }

}

module.exports = {
    REDIS_CONF,
    MYSQL_CONF
}
