// 引用模型
const { User } = require('../db/model/index')
const { formatUser } = require('./_format')
const { addFollower } = require('./user-relation')
async function getUserInfo(userName, password) {
    const whereOpt = {
        userName
    }
    if (password) {
        Object.assign(whereOpt, { password })
    }
    const result = await User.findOne({
        // 查询的那些列
        attributes: ['id', 'userName', 'nickName', 'picture', 'city'],
        where: whereOpt
    })
    if (result == null) {
        // 未找到
        return result
    }
    return formatUser(result.dataValues)
}
async function createUser({ userName, password, gender = 3, nickName }) {
    const result = await User.create({
        userName,
        password,
        nickName: nickName ? nickName : userName,
        gender
    })
    const data = result.dataValues

    //自己关注自己（为了方便首页获取数据）
    addFollower(data.id, data.id)

    return data
}
async function deleteUser(userName) {
    const result = await User.destroy({
        where: {
            userName
        }
    })
    // result 删除的行数
    return result > 0
}
async function updateUser(
    { newPassword, newNickName, newPicture, newCity },
    { userName, password }
) {
    // 拼接修改内容
    const updateData = {}
    if (newPassword) {
        updateData.password = newPassword
    }
    if (newNickName) {
        updateData.nickName = newNickName
    }
    if (newPicture) {
        updateData.picture = newPicture
    }
    if (newCity) {
        updateData.city = newCity
    }

    // 拼接查询条件
    const whereData = {
        userName
    }
    if (password) {
        whereData.password = password
    }

    // 执行修改
    const result = await User.update(updateData, {
        where: whereData
    })
    return result[0] > 0 // 修改的行数
}

module.exports = {
    getUserInfo,
    createUser,
    deleteUser,
    updateUser
}
