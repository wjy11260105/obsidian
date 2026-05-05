---
banner: 000 NewLife/Banner/life-02.png
cssclasses:
  - daily
---



### Obsidian NewLife V1.2

`BUTTON[daily-note, weekly-note, monthly-note]` 🪴 `BUTTON[proj-dash]` 🪴 `BUTTON[goal-dash]` 🪴 `BUTTON[view-cardboard]` 🪴 `BUTTON[habit-tracker]` 🪴 `BUTTON[toggle-mode]`

```dataviewjs
// 计算自第一条笔记以来的天数
const files = dv.pages()
const oldestFile = files.sort(f => f.file.ctime)[0]
const daysSinceStart = Math.floor((Date.now() - oldestFile.file.ctime) / (1000 * 60 * 60 * 24))
// 计算笔记总数
const totalNotes = files.length
// 计算标签个数
const allTags = files.flatMap(p => p.file.tags).distinct()
const totalTags = allTags.length

// 渲染 Callout 样式的统计信息面板
dv.paragraph(`> [!info]+ 统计信息
> 🗓️ 您已经使用 Obsidian **${daysSinceStart}** 天，创建了 **${totalNotes}** 个笔记，使用了 **${totalTags}** 个标签。`)
```

```meta-bind-button
label: 打开日记
icon: "calendar"
hidden: true
class: ""
tooltip: ""
id: "daily-note"
style: primary
actions:
  - type: command
    command: journals::open-today's-note
```
```meta-bind-button
label: 打开周记
icon: "calendar-minus-2"
hidden: true
class: ""
tooltip: ""
id: weekly-note
style: destructive
actions:
  - type: command
    command: journals::open-weekly-note
```
```meta-bind-button
label: 打开月报
icon: "calendar-1"
hidden: true
class: ""
tooltip: Open Monthly Note
id: monthly-note
style: primary
actions:
  - type: command
    command: journals::open-monthly-note
```
```meta-bind-button
style: primary
icon: "sun-moon"
label: 浅色/深色模式
id: toggle-mode
hidden: true
actions:
  - type: command
    command: theme:toggle-light-dark
```
```meta-bind-button
label: 项目看板
icon: "folder-heart"
hidden: true
class: ""
tooltip: 打开项目看板
id: proj-dash
style: primary
actions:
  - type: open
    link: "[[Project Dashboard]]"
    newTab: true
```
```meta-bind-button
label: 目标看板
icon: "goal"
hidden: true
class: ""
tooltip: 打开目标看板
id: goal-dash
style: primary
actions:
  - type: open
    link: "[[Goal Dashboard]]"
    newTab: true
```
```meta-bind-button
label: 任务看板
icon: "list-todo"
hidden: true
class: ""
id: view-cardboard
style: primary
actions:
  - type: command
    command: card-board:open-card-board-plugin-0
```
```meta-bind-button
label: 习惯跟踪
icon: "fan"
hidden: true
class: ""
id: habit-tracker
style: primary
actions:
  - type: open
    link: "[[Habit Tracker]]"
    newTab: true
```
```dataviewjs
dv.span("**🏋️ 每日自豪感记录 🏋️**")
const calendarData = {
colors: {
greeny: ["#B3FFD9", "#99FFC2", "#66FFB2", "#33FF99", "#00CC66"]
},
entries: []
}
for(let page of dv.pages('"002 Journal"').where(p=>p.Proudness)){
calendarData.entries.push({
date: page.file.name,
intensity: page.Proudness,
content: await dv.span(``), //用于预览悬浮
})
}
renderHeatmapCalendar(this.container, calendarData)
```


> [!multi-column]
> 
> ```dataviewjs
> function formatDate(date) {
>   if (!date) return "—";
>   let m;
>   if (moment.isMoment(date)) {
>     m = date;
>   } else if (date instanceof Date) {
>     m = moment(date);
>   } else if (typeof date === 'number') {
>     m = moment.unix(date);
>   } else {
>     m = moment(date);
>     if (!m.isValid()) m = moment(date, "YYYY-MM-DD");
>   }
>   return m.isValid() ? m.format("YYYY年M月D日") : "—";
> }
> 
> let goals = dv.pages('"004 Goals"').where(g => g.status !== "completed");
> dv.table(["目标", "截止时间", "进度"],
>     goals.map(goal => [
>         `<span style="font-size: 1.2em;">${goal.file.link}</span>`,
>         formatDate(goal.deadline),
>         `<progress value="${goal.progress}" max="${goal.target}"></progress><br>${Math.round((goal.progress / goal.target) * 100)}% 完成`
>     ])
> );
> dv.container.classList.add("cards-align-top");
> ```
> 
> > ```dataviewjs
> > const pages = dv.pages('"002 Journal"')
> >   .where((p) => p.file.day)
> >   .sort((p) => p.file.day, "desc")
> >   .map((p) =>
> >     Object.create({
> >       link: p.file.link,
> >       day: p.file.day,
> >       Writing: p.Writing || 0,
> >       Workout: p.Workout || 0,
> >       Reading: p.Reading || 0,
> >       Money: p.Money || 0,
> >       Meditation: p.Meditation || 0,
> >       Sleep: p.Sleep || 0,
> >     })
> >   );
> > 
> > function getStreak(validate) {
> >   let count = 0;
> >   for (const note of pages) {
> >     if (validate(note)) count++;
> >     else break;
> >   }
> >   return count;
> > }
> > 
> > function getRecord(validate) {
> >   let record = 0;
> >   let count = 0;
> >   for (const note of pages) {
> >     if (validate(note)) {
> >       count++;
> >       record = Math.max(record, count);
> >     } else {
> >       count = 0;
> >     }
> >   }
> >   return record;
> > }
> > 
> > const done = "✅";
> > const skip = "🟥";
> > const fileRows = pages
> >   .filter((p) => p.day >= moment().startOf('day').subtract(6, "days"))
> >   .sort((p) => p.day)
> >   .map((note) => [
> >     note.link,
> >     note.Writing > 0 ? done : skip,
> >     note.Workout > 0 ? done : skip,
> >     note.Reading > 0 ? done : skip,
> >     note.Money > 0 ? done : skip,
> >     note.Meditation > 0 ? done : skip,
> >     note.Sleep > 0 ? done : skip,
> >   ]);
> > 
> > const habits = [
> >   { id: "Writing", label: "✍🏼", key: "Writing" },
> >   { id: "Workout", label: "💪🏼", key: "Workout" },
> >   { id: "Reading", label: "📖", key: "Reading" },
> >   { id: "Money", label: "💰", key: "Money" },
> >   { id: "Meditation", label: "🧘‍♂️", key: "Meditation" },
> >   { id: "Sleep", label: "🛏️", key: "Sleep" },
> > ];
> > 
> > const stats = habits.map(h => ({
> >   streak: getStreak((note) => note[h.key] > 0),
> >   record: getRecord((note) => note[h.key] > 0)
> > }));
> > 
> > dv.table(
> >   ["习惯", ...habits.map(h => h.label)],
> >   [
> >     ...fileRows,
> >     [""],
> >     ["**连续天数**", ...stats.map(s => s.streak)],
> >     ["**最高记录**", ...stats.map(s => s.record)],
> >   ]
> > );
> > ```

---

> [!multi-column]
> - #### 项目 #mcl/list-grid
>    - [[示例项目1：多模型智能体开发]]
>    - [[示例项目2：跨端数据大屏]]
> - #### 学习 & 目标
>    - [[2026 年度阅读挑战]]
>    - [[四月苏杭春季踏青计划]]
>    - [[Q1-Q2 50公里跑步挑战]]
> - #### 个人
>    - [[Habit Tracking Dashboard.canvas | 打卡记录]]
>    - [[Goal Dashboard| 目标看板]]
>    - [[Tasks Calendar| 任务日历]]
>    - [[Project Dashboard | 项目看板]]

---

> [!multi-column]
> > [!summary] 最近创建
>>  ```dataview
> list
> from ""
> Sort file.ctime DESC
> limit 7
> 
>> [!Todo] 最近更新
>>  ```dataview
>> 	list
>> 	from ""
>> 	Sort file.mtime DESC
>> 	limit 7
>>```

