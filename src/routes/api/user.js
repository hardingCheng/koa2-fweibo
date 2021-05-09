const router = require('koa-router')()
const {
    isExist,
    register,
    login,
    deleteCurUser,
    changeInfo,
    changePassword,
    logout,
} = require('../../controller/user')
const { userValidata } = require('../../validator/user')
const { genValidator } = require('../../middlewares/validator')
const { loginCheck } = require('../../middlewares/loginChecks')
const { isTest } = require('../../utils/env')
const { getFollowers } = require('../../controller/user-relation')
router.prefix('/api/user')

router.post('/register',genValidator(userValidata),async (ctx,next) => {
    const { userName,password,gender } = ctx.request.body
    ctx.body = await register({userName,password,gender})
})

router.post('/isExist', async (ctx,next) => {
    const { userName } = ctx.request.body
    ctx.body = await isExist(userName)
})

router.post('/login', async (ctx, next) => {
    const { userName, password } = ctx.request.body
    ctx.body = await login(ctx, userName, password)
})

router.post('/delete', loginCheck, async (ctx, next) => {s
    if (isTest) {
        // 测试环境下，测试账号登录之后，删除自己
        const { userName } = ctx.session.userInfo
        ctx.body = await deleteCurUser(userName)
    }
})

router.patch('/changeInfo', loginCheck, genValidator(userValidata), async (ctx, next) => {
    const { nickName, city, picture } = ctx.request.body
    ctx.body = await changeInfo(ctx, { nickName, city, picture })
})

router.patch('/changePassword', loginCheck, genValidator(userValidata), async (ctx, next) => {
    const { password, newPassword } = ctx.request.body
    const { userName } = ctx.session.userInfo
    ctx.body = await changePassword(userName, password, newPassword)
})

router.post('/logout', loginCheck, async (ctx, next) => {
    ctx.body = await logout(ctx)
})


// 获取 at 列表，即关注人列表
router.get('/getAtList', loginCheck, async (ctx, next) => {
    const { id: userId } = ctx.session.userInfo
    const result = await getFollowers(userId)
    const { followersList } = result.data
    const list = followersList.map(user => {
        return `${user.nickName} - ${user.userName}`
    })
    // 格式如 ['张三 - zhangsan', '李四 - lisi', '昵称 - userName']
    ctx.body = list
})
module.exports = router