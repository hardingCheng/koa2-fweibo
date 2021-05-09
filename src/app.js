const Koa = require('koa')
const app = new Koa()
const path = require('path')
const views = require('koa-views')
const json = require('koa-json')
const onerror = require('koa-onerror')
const bodyparser = require('koa-bodyparser')
const logger = require('koa-logger')
const session = require('koa-generic-session')
const redisStore = require('koa-redis')
const jwt = require('koa-jwt');

const userViewRouters = require('./routes/view/user')
const userApiRouters = require('./routes/api/user')
const utilsApiRouters = require('./routes/api/utils')
const blogViewRouters = require('./routes/view/blog')
const blogSquareApiRouters = require('./routes/api/blog-square')
const blogProfileApiRouters = require('./routes/api/blog-profile')
const blogHomeApiRouters = require('./routes/api/blog-home')
const errorViewRouters = require('./routes/view/error')
const atAPIRouters = require('./routes/api/blog-at')
const { REDIS_CONF } = require('./config/db')
const { SESSION_SECRET_KEY } = require('./config/secretKeys')
// error handler
onerror(app)
// app.use(jwt({ secret: 'shared-secret' }).unless({ path: [/^\/public\/users\/login/] }));
// middlewares
app.use(bodyparser({
  enableTypes:['json', 'form', 'text']
}))
app.use(json())
app.use(logger())
app.use(require('koa-static')(__dirname + '/public'))
app.use(require('koa-static')(path.join(__dirname, '..', 'uploadFiles')))
app.use(views(__dirname + '/views', {
  extension: 'ejs'
}))
// session 配置
app.keys = [SESSION_SECRET_KEY]
app.use(session({
  key: 'weibo.sid', // cookie name 默认是 `koa.sid`
  prefix: 'weibo:sess:', // redis key 的前缀，默认是 `koa:sess:`
  cookie: {
    path: '/',
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000  // 单位 ms
  },
  store: redisStore({
    all: `${REDIS_CONF.host}:${REDIS_CONF.port}`
  })
}))

// logger
// app.use(async (ctx, next) => {
//   const start = new Date()
//   await next()
//   const ms = new Date() - start
//   console.log(`${ctx.method} ${ctx.url} - ${ms}ms`)
// })

// routes
app.use(atAPIRouters.routes(), atAPIRouters.allowedMethods())
app.use(userViewRouters.routes(), userViewRouters.allowedMethods())
app.use(userApiRouters.routes(), userApiRouters.allowedMethods())
app.use(utilsApiRouters.routes(), utilsApiRouters.allowedMethods())
app.use(blogViewRouters.routes(), blogViewRouters.allowedMethods())
app.use(blogSquareApiRouters.routes(), blogSquareApiRouters.allowedMethods())
app.use(blogProfileApiRouters.routes(), blogProfileApiRouters.allowedMethods())
app.use(blogHomeApiRouters.routes(), blogHomeApiRouters.allowedMethods())
app.use(errorViewRouters.routes(), errorViewRouters.allowedMethods())

// error-handling
app.on('error', (err, ctx) => {
  console.error('server error', err, ctx)
});

module.exports = app
