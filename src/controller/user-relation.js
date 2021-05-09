const {
    getUsersByFollower,
    getFollowersByUser,
    addFollower,
    deleteFollower
} = require('../services/user-relation')
const { SuccessModel, ErrorModel } = require('../model/ResModel')
const { addFollowerFailInfo, deleteFollowerFailInfo } = require('../model/ErrorInfo')


async function getFans(userId) {
    const { count, userList } = await getUsersByFollower(userId)

    // 返回
    return new SuccessModel({
        count,
        fansList: userList
    })
}
async function getFollowers(userId) {
    const { count, userList } = await getFollowersByUser(userId)

    return new SuccessModel({
        count,
        followersList: userList
    })
}

async function follow(myUserId, curUserId) {
    try {
        await addFollower(myUserId, curUserId)
        return new SuccessModel()
    } catch (ex) {
        console.error(ex)
        return new ErrorModel(addFollowerFailInfo)
    }
}
async function unFollow(myUserId, curUserId) {
    const result = await deleteFollower(myUserId, curUserId)
    if (result) {
        return new SuccessModel()
    }
    return new ErrorModel(deleteFollowerFailInfo)
}

module.exports = {
    getFans,
    getFollowers,
    follow,
    unFollow
}


