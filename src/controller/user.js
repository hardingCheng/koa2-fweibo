const {
    getUserInfo,
    createUser,
    deleteUser,
    updateUser
} = require('../services/user')
const { SuccessModel, ErrorModel } = require('../model/ResModel')
const doCrypto = require('../utils/cryp')
const {
    registerUserNameNotExistInfo,
    registerUserNameExistInfo,
    registerFailInfo,
    loginFailInfo,
    deleteUserFailInfo,
    changeInfoFailInfo,
    changePasswordFailInfo
} = require('../model/ErrorInfo')
async function isExist(userName) {
    const userInfo = await getUserInfo(userName)
    if (userInfo) {
        // { errno: 0, data: {....} }
        return new SuccessModel(userInfo)
    } else {
        // { errno: 10003, message: '用户名未存在' }
        return new ErrorModel(registerUserNameNotExistInfo)
    }
}
async function register({ userName, password, gender }) {
    const userInfo = await getUserInfo(userName)
    if (userInfo) {
        // 用户名已存在
        return new ErrorModel(registerUserNameExistInfo)
    }

    try {
        await createUser({
            userName,
            password: doCrypto(password),
            gender
        })
        return new SuccessModel()
    } catch (ex) {
        console.error(ex.message, ex.stack)
        return new ErrorModel(registerFailInfo)
    }
}
async function login(ctx, userName, password) {
    // 获取用户信息
    const userInfo = await getUserInfo(userName, doCrypto(password))
    if (!userInfo) {
        // 登录失败
        return new ErrorModel(loginFailInfo)
    }

    // 登录成功
    if (ctx.session.userInfo == null) {
        ctx.session.userInfo = userInfo
    }
    return new SuccessModel()
}

async function deleteCurUser(userName) {
    const result = await deleteUser(userName)
    if (result) {
        // 成功
        return new SuccessModel()
    }
    // 失败
    return new ErrorModel(deleteUserFailInfo)
}
async function changeInfo(ctx, { nickName, city, picture }) {
    const { userName } = ctx.session.userInfo
    if (!nickName) {
        nickName = userName
    }

    const result = await updateUser(
        {
            newNickName: nickName,
            newCity: city,
            newPicture: picture
        },
        { userName }
    )
    if (result) {
        // 执行成功
        Object.assign(ctx.session.userInfo, {
            nickName,
            city,
            picture
        })
        // 返回
        return new SuccessModel()
    }
    // 失败
    return new ErrorModel(changeInfoFailInfo)
}
async function changePassword(userName, password, newPassword) {
    const result = await updateUser(
        {
            newPassword: doCrypto(newPassword)
        },
        {
            userName,
            password: doCrypto(password)
        }
    )
    if (result) {
        // 成功
        return new SuccessModel()
    }
    // 失败
    return new ErrorModel(changePasswordFailInfo)
}

async function logout(ctx) {
    delete ctx.session.userInfo
    return new SuccessModel()
}

module.exports = {
    isExist,
    register,
    login,
    deleteCurUser,
    changeInfo,
    changePassword,
    logout
}
