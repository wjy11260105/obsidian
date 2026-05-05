---
cssclasses:
  - daily
banner: 000 NewLife/Banner/goal-03.png
---

# 项目

> [!tip]+ 创建新项目
> 点击下方按钮创建新项目笔记
> ```meta-bind-button
> label: "+ 新建项目"
> style: primary
> actions:
>   - type: templaterCreateNote
>     templateFile: "001 Templates/Project Template.md"
>     folderPath: "003 Projects"
>     fileName: "新项目"
>     openNote: true
> ```

---

## 🔄 进行中项目

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

function getPhaseName(phase) {
  const map = {
    "planning": "📝 规划",
    "executing": "🚀 执行",
    "reviewing": "📊 复盘",
    "completed": "✅ 完成"
  };
  return map[phase] || "📝 规划";
}

function getPriorityEmoji(priority) {
  const map = {
    "high": "🔴 高",
    "medium": "🟡 中",
    "low": "🟢 低"
  };
  return map[priority] || "🟡 中";
}

let projects = dv.pages('"003 Projects"').where(p => p.phase !== "completed" && p.tags && p.tags.includes("project"));

if (projects.length === 0) {
  dv.paragraph("🎉 暂无进行中的项目");
} else {
  dv.table(["项目", "开始日期", "截止日期", "阶段", "优先级", "进度"],
    projects.map(p => [
      `<span style="font-size: 1.1em;">${p.file.link}</span>`,
      formatDate(p["start-date"]),
      formatDate(p.deadline),
      getPhaseName(p.phase),
      getPriorityEmoji(p.priority),
      `<progress value="${p.progress || 0}" max="100"></progress><br>${Math.round(p.progress || 0)}%`
    ])
  );
}
```

---

## ✅ 已完成项目

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

let completedProjects = dv.pages('"003 Projects"').where(p => p.phase === "completed");

if (completedProjects.length === 0) {
  dv.paragraph("暂无已完成的项目");
} else {
  dv.table(["项目", "开始日期", "完成日期", "耗时"],
    completedProjects.map(p => [
      p.file.link,
      formatDate(p["start-date"]),
      formatDate(p["completed-date"]),
      calcDuration(p["start-date"], p["completed-date"])
    ])
  );
}
```