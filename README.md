# 2026 暑假外院社会实践小程序

一个基于微信云开发（WeChat Cloudbase）构建的研学与教育志愿服务实践小程序[cite: 1]，旨在帮助实践团队高效管理日常课程、学习任务打卡及勋章成就激励[cite: 1]。

---

## 🌟 核心功能

* **📢 首页（实践概览）**[cite: 1]
  * **紧急通知**：实时拉取并展示最新实践通知公告[cite: 1]。
  * **每日课表**：根据星期自动匹配并展示当天的研学课程、授课老师及助教安排[cite: 1]。
  * **实践倒计时**：实时计算并展示距实践目标时间的倒计时[cite: 1]。

* **📖 每日学习（Flashcard）**[cite: 1]
  * **3D 翻转卡片**：提供流畅的 3D 卡片翻转交互体验[cite: 1]。
  * **每日词汇与口令**：正面显示英文词汇，背面展示中文释义及当日任务打卡密码提示[cite: 1]。

* **✅ 任务打卡与徽章（Task & Badges）**[cite: 1]
  * **每日任务**：展示当天的研学实践任务与打卡要求[cite: 1]。
  * **口令打卡**：结合每日学习卡片获得的口令密码完成在线打卡[cite: 1]。
  * **勋章解锁**：打卡成功后触发成就弹窗，解锁专属研学实践勋章[cite: 1]。

* **👤 个人中心（Mine）**[cite: 1]
  * **数据统计**：展示累计打卡次数与加入实践的天数[cite: 1]。
  * **勋章图鉴**：分类展示已获得与未解锁的研学徽章[cite: 1]。
  * **权限控制**：自动识别管理员身份，开启后台管理入口[cite: 1]。

* **📋 问卷与反馈（Survey）**[cite: 1]
  * **扫码调查**：提供学员与家长专属二维码弹窗，支持长按识别与保存[cite: 1]。

---

## 🛠️ 技术栈

* **前端**：微信小程序原生开发（WXML / WXSS / JavaScript / WXS）[cite: 1]
* **后端**：微信云开发（WeChat Cloudbase）[cite: 1]
  * **云数据库（Cloud Database）**：存储课表、通知、任务及打卡记录[cite: 1]
  * **云函数（Cloud Functions）**：处理 `checkin`（打卡校验）、`getMyBadges`（获取徽章）、`adminCheck`（管理员验证）等逻辑[cite: 1, 2]

---

## 📁 目录结构

```text
├── cloudfunctions/             # 云函数目录
│   ├── adminCheck/             # 管理员身份校验
│   ├── checkin/                # 打卡与徽章解锁逻辑
│   └── getMyBadges/            # 获取已解锁徽章列表
├── pages/                      # 小程序页面
│   ├── index/                  # 首页（课表、通知、倒计时）
│   ├── learning/               # 每日学习（3D卡片翻转）
│   ├── task/                   # 任务打卡与徽章展示
│   ├── mine/                   # 个人中心与勋章图鉴
│   └── survey/                 # 问卷弹窗与二维码
├── app.js                      # 小程序逻辑与云开发初始化
├── app.json                    # 全局配置与页面路由
└── app.wxss                    # 全局样式
```

---

## 🚀 快速上手与部署

1. **环境准备**
   * 下载并安装 [微信开发者工具](https://developers.weixin.qq.com/miniprogram/dev/devtools/download.html)。
   * 开通微信云开发（Cloudbase）服务[cite: 1]。

2. **配置云环境**
   * 打开 `app.js`，将 `wx.cloud.init` 中的 `env` 替换为你的云开发环境 ID[cite: 1]：
     ```javascript
     wx.cloud.init({
       env: 'cloud1-d2g29vmhce6c05fd1', // 替换为你的环境ID
       traceUser: true
     });
     ```

3. **部署云函数**
   * 在微信开发者工具中，右键点击 `cloudfunctions/` 下的各个云函数文件夹，选择 **“上传并部署：所有文件”**[cite: 2]。

4. **初始化云数据库集合**
   * 在云开发控制台中创建以下数据库集合[cite: 1]：
     * `tasks`：每日实践任务[cite: 1]
     * `flashcards`：每日学习卡片与口令[cite: 1]
     * `notices`：紧急通知[cite: 1]
     * `checkins`：打卡记录[cite: 1]
     * `user_badges`：用户获得的勋章[cite: 1]
