Page({
  data: {
    urgentNotice: null,
    todaySchedule: [],
    eventTargetTime: new Date('2026-08-15 09:00:00').getTime(),
    countdownText: '',
    
    // 完整的课表数据，包含助教
    allSchedules: [
      { weekday: 1, time: '08:30', course: '班会', teacher: '全部', assistant: '' },
      { weekday: 1, time: '09:30', course: '自主学习', teacher: '', assistant: '' },
      { weekday: 1, time: '10:45', course: '生活技能', teacher: '何之星', assistant: '施伶俐' },
      { weekday: 1, time: '14:00', course: '趣味数学', teacher: '何之星', assistant: '高程陈' },
      { weekday: 1, time: '15:00', course: '外国经典鉴赏', teacher: '施伶俐 / 何之星', assistant: '' },
      { weekday: 1, time: '16:15', course: '外国经典鉴赏', teacher: '武辰昊', assistant: '方天颖' },

      { weekday: 2, time: '08:30', course: '数独', teacher: '彭建豪', assistant: '施伶俐' },
      { weekday: 2, time: '09:30', course: '自主学习', teacher: '', assistant: '' },
      { weekday: 2, time: '10:45', course: '诗朗诵', teacher: '武辰昊', assistant: '彭建豪' },
      { weekday: 2, time: '14:00', course: '趣味英语', teacher: '施伶俐', assistant: '方天颖' },
      { weekday: 2, time: '15:00', course: '自主学习', teacher: '', assistant: '' },
      { weekday: 2, time: '16:15', course: '阅读分析', teacher: '何之星', assistant: '施伶俐' },

      { weekday: 3, time: '08:30', course: '诗歌鉴赏', teacher: '高程陈', assistant: '方天颖' },
      { weekday: 3, time: '09:30', course: '自主学习', teacher: '', assistant: '' },
      { weekday: 3, time: '10:45', course: '心理健康', teacher: '武辰昊', assistant: '施伶俐' },
      { weekday: 3, time: '14:00', course: '自主学习', teacher: '', assistant: '' },
      { weekday: 3, time: '15:00', course: '作业辅导', teacher: '武辰昊 / 施伶俐', assistant: '' },
      { weekday: 3, time: '16:15', course: '英语练字', teacher: '施伶俐', assistant: '' },

      { weekday: 4, time: '08:30', course: '趣味数学', teacher: '彭建豪', assistant: '施伶俐' },
      { weekday: 4, time: '09:30', course: '自主学习', teacher: '', assistant: '' },
      { weekday: 4, time: '10:45', course: '诗朗诵', teacher: '武昊辰', assistant: '方天颖' },
      { weekday: 4, time: '14:00', course: '体育锻炼', teacher: '施伶俐', assistant: '' },
      { weekday: 4, time: '15:00', course: '自主学习', teacher: '', assistant: '' },
      { weekday: 4, time: '16:15', course: 'AI趣味课堂', teacher: '方天颖', assistant: '施伶俐' },

      { weekday: 5, time: '08:30', course: 'AI趣味课堂', teacher: '何之星', assistant: '高程陈' },
      { weekday: 5, time: '09:30', course: '自主学习', teacher: '', assistant: '' },
      { weekday: 5, time: '10:45', course: '数独', teacher: '方天颖', assistant: '武辰昊' },
      { weekday: 5, time: '15:00', course: '作业辅导', teacher: '高程陈 / 何之星', assistant: '' },
      { weekday: 5, time: '16:15', course: '自主学习', teacher: '施伶俐', assistant: '' }
    ]
  },

  onLoad() {
    this.loadUrgentNotice();
    this.loadTodaySchedule();
    this.startCountdown();
  },

  onShow() {
    this.loadUrgentNotice(); 
  },

  loadUrgentNotice() {
    if(!wx.cloud) return;
    const db = wx.cloud.database();
    db.collection('notices')
      .where({ isUrgent: true })
      .orderBy('createTime', 'desc')
      .limit(1)
      .get()
      .then(res => {
        if (res.data.length > 0) {
          const notice = res.data[0];
          const d = new Date(notice.createTime);
          notice.createTimeText = `${d.getMonth()+1}/${d.getDate()} ${d.getHours()}:${d.getMinutes().toString().padStart(2,'0')}`;
          this.setData({ urgentNotice: notice });
        } else {
          this.setData({ urgentNotice: null });
        }
      })
      .catch(err => {
        console.error("加载通知失败，如果未配置数据库可忽略", err);
      });
  },

  loadTodaySchedule() {
    const today = new Date().getDay();
    const currentWeekday = today === 0 ? 7 : today; 
    
    let todays = this.data.allSchedules.filter(item => item.weekday === currentWeekday);
    
    todays = todays.map(item => {
      let displayText = '';
      if (item.teacher && item.assistant) {
        displayText = `${item.teacher} (助: ${item.assistant})`;
      } else if (item.teacher) {
        displayText = item.teacher;
      }
      return { ...item, displayTeacher: displayText };
    });

    todays.sort((a, b) => a.time.localeCompare(b.time));
    this.setData({ todaySchedule: todays });
  },

  startCountdown() {
    const update = () => {
      const now = Date.now();
      const diff = this.data.eventTargetTime - now;
      if (diff <= 0) {
        this.setData({ countdownText: '活动进行中！' });
        return;
      }
      const days = Math.floor(diff / (1000*60*60*24));
      const hours = Math.floor((diff % (1000*60*60*24)) / (1000*60*60));
      const minutes = Math.floor((diff % (1000*60*60)) / (1000*60));
      this.setData({ countdownText: `${days}天 ${hours}时 ${minutes}分` });
    };
    update();
    this.timer = setInterval(update, 60000); 
  },

  onUnload() {
    if (this.timer) clearInterval(this.timer);
  }
});