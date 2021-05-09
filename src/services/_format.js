const { DEFAULT_PICTURE, REG_FOR_AT_WHO } = require('../config/constant')
const { timeFormat } = require('../utils/dt')
function _formatUserPicture(obj) {
    if (obj.picture == null) {
        obj.picture = DEFAULT_PICTURE
    }
    return obj
}
function _formatDBTime(obj) {
    obj.createdAtFormat = timeFormat(obj.createdAt)
    obj.updatedAtFormat = timeFormat(obj.updatedAt)
    return obj
}
function _formatContent(obj) {
    obj.contentFormat = obj.content

    // 格式化 @
    // from '哈喽 @张三 - zhangsan 你好'
    // to '哈喽 <a href="/profile/zhangsan">张三</a> 你好'
    obj.contentFormat = obj.contentFormat.replace(
        REG_FOR_AT_WHO,
        (matchStr, nickName, userName) => {
            return `<a href="/profile/${userName}">@${nickName}</a>`
        }
    )

    return obj
}
// 接收对象数组
function formatUser(list) {
    if (list == null) {
        return list
    }

    if (list instanceof Array) {
        // 数组 用户列表
        return list.map(_formatUserPicture)
    }

    // 单个对象
    return _formatUserPicture(list)
}
function formatBlog(list) {
    if (list == null) {
        return list
    }

    if (list instanceof Array) {
        // 数组
        return list.map(_formatDBTime).map(_formatContent)
    }
    // 对象
    let result = list
    result = _formatDBTime(result)
    result = _formatContent(result)
    return result
}
function _formatContent(obj) {
    obj.contentFormat = obj.content

    // 格式化 @
    // from '哈喽 @张三 - zhangsan 你好'
    // to '哈喽 <a href="/profile/zhangsan">张三</a> 你好'
    obj.contentFormat = obj.contentFormat.replace(
        REG_FOR_AT_WHO,
        (matchStr, nickName, userName) => {
            return `<a href="/profile/${userName}">@${nickName}</a>`
        }
    )

    return obj
}
module.exports = {
    formatUser,
    formatBlog,
}

