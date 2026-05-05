---
cssclasses:
  - daily
tags:
  - week
banner: 000 NewLife/Banner/habit-03.png
Health: 0
Wealth: 0
Relationship: 0
Spirituality: 0
list: []
summary: ""
---
## {{date:[Week] ww}} [[{{date:YYYY-MM}}|🪴]] {{date:MMM gggg}}

### <% moment(tp.file.title, "YYYY-[W]ww").format("YYYY-[W]ww") %>
###### ⬅️ [[<% moment(tp.file.title, "YYYY-[W]ww").subtract(1, "weeks").format("YYYY-[W]ww") %>|上一周]] | 📅 [[<% moment(tp.file.title, 'YYYY-[W]ww').format('YYYY-MMMM') %>|月报]] | [[<% moment(tp.file.title, "YYYY-[W]ww").add(1, "weeks").format("YYYY-[W]ww") %>|下一周]] ➡️  [[<% moment(tp.file.title, "YYYY-[W]ww").startOf('week').format("YYYY-MM-DD") %>|一]] | [[<% moment(tp.file.title, "YYYY-[W]ww").startOf('week').add(1, 'days').format("YYYY-MM-DD") %>|二]] | [[<% moment(tp.file.title, "YYYY-[W]ww").startOf('week').add(2, 'days').format("YYYY-MM-DD") %>|三]] | [[<% moment(tp.file.title, "YYYY-[W]ww").startOf('week').add(3, 'days').format("YYYY-MM-DD") %>|四]] | [[<% moment(tp.file.title, "YYYY-[W]ww").startOf('week').add(4, 'days').format("YYYY-MM-DD") %>|五]] | [[<% moment(tp.file.title, "YYYY-[W]ww").startOf('week').add(5, 'days').format("YYYY-MM-DD") %>|六]] | [[<% moment(tp.file.title, "YYYY-[W]ww").startOf('week').add(6, 'days').format("YYYY-MM-DD") %>|日]]


### 💪 本周生活平衡状态

```dataviewjs
const current = dv.current();
const fields = ['Health', 'Wealth', 'Relationship', 'Spirituality'];
const labels = ['💚 健康', '💰 财富', '❤️ 关系', '✨ 精神'];

const stats = fields.map(field => {
  const value = current[field] || 0;
  const status = value >= 7 ? '🟢 良好' : value >= 4 ? '🟡 一般' : '🔴 需关注';
  return [labels[fields.indexOf(field)], value + '/10', status];
});

dv.table(["维度", "本周评分", "状态"], stats);
```

---

### 周状态（生活平衡追踪器）

```meta-bind
INPUT[progressBar(title(健康), minValue(0), maxValue(10)):Health]
```
```meta-bind
INPUT[progressBar(title(财富), minValue(0), maxValue(10)):Wealth]
```
```meta-bind
INPUT[progressBar(title(关系), minValue(0), maxValue(10)):Relationship]
```
```meta-bind
INPUT[progressBar(title(精神), minValue(0), maxValue(10)):Spirituality]
```

```meta-bind
INPUT[list(title(周成就),placeholder(待输入...)):list]
```

---

### 周小结

```dataview
TABLE WITHOUT ID
file.link as "日期", summary as "总结"
FROM #daily
WHERE file.name >= "<% moment(tp.file.title, 'YYYY-[W]ww').startOf('week').format('YYYY-MM-DD') %>" AND file.name <= "<% moment(tp.file.title, 'YYYY-[W]ww').endOf('week').format('YYYY-MM-DD') %>"
SORT file.name ASC
```

### 1. 存在问题
1. 

### 2. 改进方案
1. 

---

>[!summary] 周总结（一句话）
>`INPUT[textArea(title(周总结)):summary]`