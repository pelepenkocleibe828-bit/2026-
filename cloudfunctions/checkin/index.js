// cloudfunctions/checkin/index.js
const cloud = require('wx-server-sdk')
cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV })
const db = cloud.database()

exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  const openid = wxContext.OPENID
  
  const { taskId, password } = event
  
  try {
    // 1. 验证口令
    const taskRes = await db.collection('tasks').doc(taskId).get()
    const task = taskRes.data
    if (task.password !== password) {
      return { code: -1, msg: '口令不正确哦，再看看闪卡吧！' }
    }

    // 2. 防重复打卡
    const todayStart = new Date()
    todayStart.setHours(0, 0, 0, 0)
    const checkRes = await db.collection('checkins').where({
      _openid: openid,
      taskId: taskId,
      createTime: db.command.gte(todayStart)
    }).count()
    
    if (checkRes.total > 0) {
      return { code: -2, msg: '今天已经打过卡啦！' }
    }

    // 3. 记录打卡
    await db.collection('checkins').add({
      data: {
        _openid: openid,
        taskId: taskId,
        createTime: new Date()
      }
    })

    // 4. 统计天数并下发进阶徽章
    const countRes = await db.collection('checkins').where({
      _openid: openid
    }).count()
    const totalDays = countRes.total

    let newBadge = null

    // ★ 最新规则：第1个徽章默认送，这里只处理满3天和5天的徽章 ★
    if (totalDays === 3) {
      newBadge = { name: '坚持达人', emoji: '🔥' }
    } else if (totalDays === 5) {
      newBadge = { name: '科技之星', emoji: '🔭' }
    }

    if (newBadge) {
      await db.collection('userBadges').add({
        data: {
          _openid: openid,
          name: newBadge.name,
          emoji: newBadge.emoji,
          createTime: new Date()
        }
      })
    }

    return { code: 0, msg: '打卡成功！', newBadge: newBadge }

  } catch (err) {
    console.error(err)
    return { code: -500, msg: '服务器小差，请重试' }
  }
}