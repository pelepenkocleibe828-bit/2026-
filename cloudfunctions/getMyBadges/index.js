// cloudfunctions/getMyBadges/index.js
const cloud = require('wx-server-sdk')
cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV })
const db = cloud.database()

exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  const openid = wxContext.OPENID

  try {
    // 恢复原有逻辑：只要打开小程序，默认就拥有“初见AI”
    let badges = [
      { _id: 'default', name: '初见AI', emoji: '🌟' }
    ]

    // 去云端查询用户打卡满 3 天和 5 天后解锁的进阶徽章
    const res = await db.collection('userBadges').where({
      _openid: openid
    }).get()

    if (res.data.length > 0) {
      badges = badges.concat(res.data)
    }

    return { code: 0, data: badges }
  } catch (err) {
    return { code: -500, data: [] }
  }
}