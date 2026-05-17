---
banner: 000 NewLife/Banner/life-02.png
cssclasses:
  - daily
---

### 🎓 学习看板 — 大数据工程师技术成长中心

`BUTTON[tech-note]` 🪴 `BUTTON[snippet]` 🪴 `BUTTON[tech-case]` 🪴 `BUTTON[back-to-main]`

## 🌐 学习来源 / Learning Sources
```meta-bind-button
label: "📚 新建技术笔记"
hidden: true
id: tech-note
style: primary
actions:
  - type: templaterCreateNote
    templateFile: "001 Templates/Tech Note Template.md"
    folderPath: "005 Learning/BigData"
    fileName: "新技术笔记"
    openNote: true
```

```meta-bind-button
label: "💻 新建代码片段"
hidden: true
id: snippet
style: primary
actions:
  - type: templaterCreateNote
    templateFile: "001 Templates/Snippet Template.md"
    folderPath: "005 Learning/Snippets"
    fileName: "新代码片段"
    openNote: true
```
> [!tip]+ 📡 我的学习渠道矩阵
> 按 **学习类型 × 学习渠道** 维度收录，方便随时跳转。
> 
> | 🏷️ 学习类型 | 📡 学习渠道                  | 🔗 链接                                                                     | ⭐ 推荐度 | 📝 备注      |
> | :------- | :----------------------- | :------------------------------------------------------------------------ | :---: | :--------- |
> | 🎬 视频课程  | Bilibili - 西瓜大模型        | [VibeCoding 全栈课程](https://www.bilibili.com/cheese/play/ss905865514)     | ⭐⭐⭐⭐  | VibeCoding 实战 |
> | 📚 官方文档  | Apache Spark Docs        | [spark.apache.org](https://spark.apache.org/docs/latest/)                 | ⭐⭐⭐⭐⭐ | Spark 权威参考 |
> | 📚 官方文档  | Apache Flink Docs        | [flink.apache.org](https://nightlies.apache.org/flink/flink-docs-stable/) | ⭐⭐⭐⭐⭐ | 流处理首选      |
> | 📚 官方文档  | Apache Hive Docs         | [hive.apache.org](https://cwiki.apache.org/confluence/display/Hive)       | ⭐⭐⭐⭐  | Hive Wiki  |
> | 🎬 视频课程  | Bilibili - 尚硅谷大数据        | [bilibili.com/尚硅谷](https://space.bilibili.com/302417610)                  | ⭐⭐⭐⭐  | 中文体系化课程    |
> | 🎬 视频课程  | YouTube - Databricks     | [youtube.com/@Databricks](https://www.youtube.com/@Databricks)            | ⭐⭐⭐⭐⭐ | Spark 原厂   |
> | 📰 技术博客  | 美团技术团队                   | [tech.meituan.com](https://tech.meituan.com/)                             | ⭐⭐⭐⭐⭐ | 一线大厂实战     |
> | 📰 技术博客  | InfoQ 中文站                | [infoq.cn](https://www.infoq.cn/)                                         | ⭐⭐⭐⭐  | 架构与趋势      |
> | 📰 技术博客  | 阿里云开发者社区                 | [developer.aliyun.com](https://developer.aliyun.com/)                     | ⭐⭐⭐⭐  | 大数据/云原生    |
> | 💬 问答社区  | Stack Overflow           | [stackoverflow.com](https://stackoverflow.com/)                           | ⭐⭐⭐⭐⭐ | 报错排查首选     |
> | 💬 问答社区  | 知乎 - 大数据话题               | [zhihu.com/topic/大数据](https://www.zhihu.com/topic/19551025)               |  ⭐⭐⭐  | 行业讨论       |
> | 💻 代码托管  | GitHub Trending          | [github.com/trending](https://github.com/trending)                        | ⭐⭐⭐⭐⭐ | 跟踪热门项目     |
> | 💻 代码托管  | GitHub - awesome-bigdata | [awesome-bigdata](https://github.com/onurakpolat/awesome-bigdata)         | ⭐⭐⭐⭐  | 资源合集       |
> | 📖 在线书籍  | O'Reilly Learning        | [learning.oreilly.com](https://learning.oreilly.com/)                     | ⭐⭐⭐⭐⭐ | 系统化深度学习    |
> | 🤖 AI 助手 | Claude                   | [claude.ai](https://claude.ai/)                                           | ⭐⭐⭐⭐⭐ | 代码/文档共创    |
> | 🤖 AI 助手 | ChatGPT                  | [chat.openai.com](https://chat.openai.com/)                               | ⭐⭐⭐⭐  | 通用问答       |
> | 🎓 在线课程  | Coursera                 | [coursera.org](https://www.coursera.org/)                                 | ⭐⭐⭐⭐  | 名校公开课      |
> | 🎙️ 播客   | 大数据厂长                    | [xiaoyuzhoufm.com](https://www.xiaoyuzhoufm.com/)                         |  ⭐⭐⭐  | 通勤碎片学习     |
> | 📧 周刊订阅  | Data Engineering Weekly  | [dataengineeringweekly.com](https://www.dataengineeringweekly.com/)       | ⭐⭐⭐⭐  | 每周精选       |
```meta-bind-button
label: "🏆 新建技术案例"
hidden: true
id: tech-case
style: primary
actions:
  - type: templaterCreateNote
    templateFile: "001 Templates/Tech Case Template.md"
    folderPath: "005 Learning/Cases"
    fileName: "新技术案例"
    openNote: true
```
```meta-bind-button
label: "⬅️ 返回主仪表盘"
hidden: true
id: back-to-main
style: default
actions:
  - type: open
    link: "[[Dashboard]]"
    newTab: false
```
## 📊 学习进度总览

```dataviewjs
// 统计学习笔记的进度
const techNotes = dv.pages('"005 Learning"').where(p => p.tags && p.tags.includes('tech'));
const totalNotes = techNotes.length;
const masteredNotes = techNotes.filter(p => p.status === 'mastered').length;
const learningNotes = techNotes.filter(p => p.status === 'learning').length;
const reviewingNotes = techNotes.filter(p => p.status === 'reviewing').length;

// 计算平均掌握度（用 array() 转成普通数组以使用 reduce）
const progressArr = techNotes.map(p => p.progress || 0).array();
const avgProgress = totalNotes > 0 ? Math.round(progressArr.reduce((a, b) => a + b, 0) / totalNotes) : 0;

dv.paragraph(`> [!success]+ 📈 学习统计
> 📚 总笔记数：**${totalNotes}** | 🎓 已掌握：**${masteredNotes}** | 📖 学习中：**${learningNotes}** | 🔄 复习中：**${reviewingNotes}**
> 
> 平均掌握度：**${avgProgress}%**`)
```

---

## 🎯 按主题分类的学习进度

```dataviewjs
// 按 topic 分组统计进度（先转成普通数组）
const techNotes = dv.pages('"005 Learning"').where(p => p.tags && p.tags.includes('tech')).array();
const topicGroups = {};

for (const note of techNotes) {
  const topic = note.topic || '未分类';
  if (!topicGroups[topic]) {
    topicGroups[topic] = {
      notes: [],
      progress: [],
      statuses: {}
    };
  }
  topicGroups[topic].notes.push(note);
  topicGroups[topic].progress.push(note.progress || 0);
  const st = note.status || 'learning';
  topicGroups[topic].statuses[st] = (topicGroups[topic].statuses[st] || 0) + 1;
}

// 生成表格
const rows = Object.entries(topicGroups).map(([topic, data]) => {
  const avgProgress = data.progress.length > 0 ? Math.round(data.progress.reduce((a, b) => a + b, 0) / data.progress.length) : 0;
  const statusStr = Object.entries(data.statuses).map(([s, c]) => `${s}(${c})`).join(' / ');
  return [
    topic,
    data.notes.length,
    `<progress value="${avgProgress}" max="100"></progress> ${avgProgress}%`,
    statusStr
  ];
});

if (rows.length === 0) {
  dv.paragraph('> [!info] 暂无技术笔记，开始创建你的第一篇笔记吧！');
} else {
  dv.table(['主题', '笔记数', '平均进度', '状态分布'], rows);
}
```

---

## 📚 技术笔记库（按难度分类）

```dataviewjs
// 按难度分类显示技术笔记（先转成普通数组）
const techNotes = dv.pages('"005 Learning"').where(p => p.tags && p.tags.includes('tech')).sort(p => p.file.mtime, 'desc').array();

if (techNotes.length === 0) {
  dv.paragraph('> [!info] 暂无技术笔记');
} else {
  const difficulties = ['beginner', 'intermediate', 'advanced'];
  const difficultyLabels = { beginner: '初级 🟢', intermediate: '中级 🟡', advanced: '高级 🔴' };

  let hasAny = false;
  for (const diff of difficulties) {
    const notes = techNotes.filter(p => p.difficulty === diff);
    if (notes.length === 0) continue;
    hasAny = true;
    
    dv.header(3, difficultyLabels[diff]);
    const rows = notes.map(note => [
      note.file.link,
      note.topic || '—',
      note.status || '—',
      `<progress value="${note.progress || 0}" max="100"></progress> ${note.progress || 0}%`
    ]);
    dv.table(['笔记', '主题', '状态', '进度'], rows);
  }

  // 显示未分类的笔记（没有 difficulty 字段或值不在枚举内）
  const otherNotes = techNotes.filter(p => !difficulties.includes(p.difficulty));
  if (otherNotes.length > 0) {
    dv.header(3, '未分类 ⚪');
    const rows = otherNotes.map(note => [
      note.file.link,
      note.topic || '—',
      note.status || '—',
      `<progress value="${note.progress || 0}" max="100"></progress> ${note.progress || 0}%`
    ]);
    dv.table(['笔记', '主题', '状态', '进度'], rows);
  }
}
```

---

## 💻 代码片段库（按语言分类）

```dataviewjs
// 按编程语言分类显示代码片段（先转成普通数组）
const snippets = dv.pages('"005 Learning/Snippets"').where(p => p.tags && p.tags.includes('snippet')).sort(p => p.file.mtime, 'desc').array();

if (snippets.length === 0) {
  dv.paragraph('> [!info] 暂无代码片段');
} else {
  const languages = [...new Set(snippets.map(s => s.language || 'Other'))].sort();

  for (const lang of languages) {
    const langSnippets = snippets.filter(s => (s.language || 'Other') === lang);
    if (langSnippets.length === 0) continue;
    
    dv.header(3, `${lang}`);
    const rows = langSnippets.map(snippet => [
      snippet.file.link,
      snippet.topic || '—',
      snippet.description || '—'
    ]);
    dv.table(['片段', '主题', '描述'], rows);
  }
}
```

---

## 📖 学习日志时间线（最近 7 天）

```dataviewjs
// 显示最近 7 天的学习日志（先转成普通数组）
const logs = dv.pages('"002 Journal"').where(p => p.tags && p.tags.includes('learning-log')).sort(p => p.file.mtime, 'desc').array().slice(0, 7);

if (logs.length === 0) {
  dv.paragraph('> [!info] 暂无学习日志');
} else {
  for (const log of logs) {
    const duration = log.duration || 0;
    const mood = log.mood || 3;
    const summary = log.summary || '—';
    const moodEmoji = ['😞', '😐', '😊', '😄', '🤩'][mood - 1] || '😊';
    
    dv.paragraph(`
**${log.file.link}** — ${log.topic || '—'}
- ⏱️ 学习时长：${duration} 分钟 | 💭 状态：${moodEmoji} (${mood}/5)
- 📝 总结：${summary}
    `);
  }
}
```

---

## 🏆 技术案例库

```dataviewjs
// 显示所有技术案例，按进度排序（先转成普通数组）
const cases = dv.pages('"005 Learning/Cases"').where(p => p.tags && p.tags.includes('case')).sort(p => p.progress, 'desc').array();

if (cases.length === 0) {
  dv.paragraph('> [!info] 暂无技术案例');
} else {
  const rows = cases.map(caseNote => [
    caseNote.file.link,
    caseNote.topic || '—',
    caseNote.difficulty || '—',
    `<progress value="${caseNote.progress || 0}" max="100"></progress> ${caseNote.progress || 0}%`
  ]);
  dv.table(['案例', '技术主题', '难度', '完成度'], rows);
}
```

---

## 📈 本周学习热力图

```dataviewjs
// 统计每日学习时长（先转成普通数组）
const logs = dv.pages('"002 Journal"').where(p => p.tags && p.tags.includes('learning-log')).array();

dv.span("**📚 学习时长热力图**");

if (logs.length === 0) {
  dv.paragraph('> [!info] 暂无学习日志，开始记录你的第一篇学习日志吧！');
} else if (typeof renderHeatmapCalendar === 'undefined') {
  dv.paragraph('> [!warning] 未检测到 Heatmap Calendar 插件，无法渲染热力图。');
} else {
  const calendarData = {
    colors: {
      greeny: ["#E8F5E9", "#C8E6C9", "#A5D6A7", "#81C784", "#66BB6A"]
    },
    entries: []
  };

  for (const log of logs) {
    const duration = log.duration || 0;
    // 将分钟数映射到 1-5 的强度
    let intensity = 1;
    if (duration >= 120) intensity = 5;
    else if (duration >= 90) intensity = 4;
    else if (duration >= 60) intensity = 3;
    else if (duration >= 30) intensity = 2;
    
    calendarData.entries.push({
      date: log.file.name,
      intensity: intensity,
      content: `${duration}分钟`
    });
  }

  renderHeatmapCalendar(this.container, calendarData);
}
```

---



> [!tip]+ 💡 使用说明
> - **学习类型** 推荐图标：📚 官方文档 / 🎬 视频课程 / 📰 技术博客 / 💬 问答社区 / 💻 代码托管 / 📖 在线书籍 / 🤖 AI 助手 / 🎓 在线课程 / 🎙️ 播客 / 📧 周刊订阅
> - **推荐度** 用 ⭐ 数量直观表达（1–5 星）
> - 链接点击即可跳转；新增渠道时复制一行模板修改即可

---

## 🎓 快速导航

> [!multi-column]
> - #### 大数据核心
>    - [[005 Learning/BigData|Spark / Hadoop / Hive / Flink]]
> - #### Vibe Coding
>    - [[005 Learning/VibeCoding|AI 辅助编程 / 工具 / 最佳实践]]
> - #### 代码片段
>    - [[005 Learning/Snippets|SQL / Python / Shell / Scala]]
> - #### 项目案例
>    - [[005 Learning/Cases|实战经验 / 最佳实践]]
