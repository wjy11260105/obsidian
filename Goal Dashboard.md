---
cssclasses:
  - daily
banner: 000 NewLife/Banner/goal-05.png
---
# 目标

> [!tip]+ 创建新目标
> 点击下方按钮创建新目标笔记
> ```meta-bind-button
> label: "+ 新建目标"
> style: primary
> actions:
>   - type: templaterCreateNote
>     templateFile: "001 Templates/Goal Template.md"
>     folderPath: "004 Goals"
>     fileName: "新目标"
>     openNote: true
> ```

---

```dataviewjs
function formatDate(date) {
  if (!date) return "—";
  // 尝试多种方式解析日期
  let m;
  if (moment.isMoment(date)) {
    m = date;
  } else if (date instanceof Date) {
    m = moment(date);
  } else if (typeof date === 'number') {
    m = moment.unix(date);
  } else {
    m = moment(date); // 尝试自动解析
    if (!m.isValid()) m = moment(date, "YYYY-MM-DD");
  }
  return m.isValid() ? m.format("YYYY年M月D日") : "—";
}

let goals = dv.pages('"004 Goals"').where(g => g.status !== "completed");

if (goals.length === 0) {
  dv.paragraph("🎉 暂无进行中的目标");
} else {
  dv.table(["目标", "截止日期", "状态", "进度"], 
    goals.map(goal => [
      `<span style="font-size: 1.1em;">${goal.file.link}</span>`,
      formatDate(goal.deadline),
      goal.status === "active" ? "🟡 进行中" : "🔴 已放弃",
      `<progress value="${goal.progress}" max="${goal.target}"></progress><br>${Math.round((goal.progress / goal.target) * 100)}%`
    ])
  );
}
```

---

## ✅ 已完成目标

```dataviewjs
function formatDate(date) {
  if (!date) return "—";
  let m;
  if (moment.isMoment(date)) {
    m = date;
  } else if (date instanceof Date) {
    m = moment(date);
  } else if (typeof date === 'number') {
    m = moment.unix(date);
  } else {
    m = moment(date);
    if (!m.isValid()) m = moment(date, "YYYY-MM-DD");
  }
  return m.isValid() ? m.format("YYYY年M月D日") : "—";
}

function calcDuration(start, end) {
  if (!start || !end) return "—";
  
  // 直接用字符串格式解析
  const s = moment(String(start), "YYYY-MM-DD");
  const e = moment(String(end), "YYYY-MM-DD");
  
  if (!s.isValid() || !e.isValid()) return "—";
  
  const days = e.diff(s, 'days');
  if (days < 0) return "—";
  if (days === 0) return "当天";
  if (days < 30) return `${days} 天`;
  if (days < 365) return `${Math.floor(days / 30)} 个月零${days % 30} 天`;
  return `${Math.floor(days / 365)} 年零${Math.floor((days % 365) / 30)} 个月`;
}

let completedGoals = dv.pages('"004 Goals"').where(g => g.status === "completed");

if (completedGoals.length === 0) {
  dv.paragraph("暂无已完成的目标");
} else {
  dv.table(["目标", "开始日期", "完成日期", "耗时"],
    completedGoals.map(goal => [
      goal.file.link,
      formatDate(goal.start),
      formatDate(goal["completed-date"]),
      calcDuration(goal.start, goal["completed-date"])
    ])
  );
}
```
