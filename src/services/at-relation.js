const { AtRelation, Blog, User } = require('../db/model/index')
const { formatBlog, formatUser } = require('./_format')

async function createAtRelation(blogId, userId) {
    const result = await AtRelation.create({
        blogId,
        userId
    })
    return result.dataValues
}

async function getAtRelationCount(userId) {
    const result = await AtRelation.findAndCountAll({
        where: {
            userId,
            isRead: false
        }
    })
    return result.count
    // result.rows
}

async function getAtUserBlogList({ userId, pageIndex, pageSize = 10 }) {
    const result = await Blog.findAndCountAll({
        limit: pageSize,
        offset: pageSize * pageIndex,
        order: [
            ['id', 'desc']
        ],
        include: [
            // @ 关系
            {
                model: AtRelation,
                attributes: ['userId', 'blogId'],
                where: { userId }
            },
            // User
            {
                model: User,
                attributes: ['userName', 'nickName', 'picture']
            }
        ]
    })
    // result.rows
    // result.count

    // 格式化
    let blogList = result.rows.map(row => row.dataValues)
    blogList = formatBlog(blogList)
    blogList = blogList.map(blogItem => {
        blogItem.user = formatUser(blogItem.user.dataValues)
        return blogItem
    })

    return {
        count: result.count,
        blogList
    }
}

async function updateAtRelation(
    { newIsRead }, // 要更新的内容
    { userId, isRead } // 条件
) {
    // 拼接更新内容
    const updateData = {}
    if (newIsRead) {
        updateData.isRead = newIsRead
    }

    // 拼接查询条件
    const whereData = {}
    if (userId) {
        whereData.userId = userId
    }
    if (isRead) {
        whereData.isRead = isRead
    }

    // 执行更新
    const result = await AtRelation.update(updateData, {
        where: whereData
    })
    return result[0] > 0
}

module.exports = {
    createAtRelation,
    getAtRelationCount,
    getAtUserBlogList,
    updateAtRelation
}

