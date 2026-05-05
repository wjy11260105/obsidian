---
tags:
  - project
cssclasses:
banner: 000 NewLife/Banner/mana-01.png
phase: planning
priority: medium
why:
target:
start-date:
deadline:
completed-date:
progress: 0
---
<% await tp.file.move("003 Projects/" + tp.file.title) %>

> [!tip]- 项目状态
> ```meta-bind
> INPUT[select(title(优先级), option(high, 高), option(medium, 中), option(low, 低), defaultValue(medium)):priority]
> ```
> ```meta-bind
> INPUT[select(title(阶段), option(planning, 规划), option(executing, 执行), option(reviewing, 复盘), option(completed, 完成), defaultValue(planning)):phase]
> ```
> ```meta-bind
> INPUT[progressBar(title(项目进度), minValue(0), maxValue(100)):progress]
> ```

> [!info]+ 时间设置
> 开始日期：`INPUT[date(title(开始日期)):start-date]`
> 截止日期：`INPUT[date(title(截止日期)):deadline]`
> 完成日期：`INPUT[date(title(截止日期)):completed-date]`

## 📋 项目信息

### 立项原因

1. 

### 项目目标

1. 

---

## 🏆 里程碑

- [ ] 里程碑 1：
- [ ] 里程碑 2：
- [ ] 里程碑 3：

---

## ✅ 待办事项

- [ ] 任务 1：
- [ ] 任务 2：
- [ ] 任务 3：

---

## 📝 项目日志

> [!tip] 记录关键进展
> 1. 

---

## 📎 关联资源

1. 
