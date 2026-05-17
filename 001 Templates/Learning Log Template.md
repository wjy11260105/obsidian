---
tags:
  - learning-log
cssclasses:
  - daily
banner: 000 NewLife/Banner/self-02.png
topic:
duration: 0
difficulty: medium
mood: 3
summary:
---
<% await tp.file.move("002 Journal/" + tp.file.title) %>

## 📊 学习状态

> [!tip]+ 今日学习
> 学习时长（分钟）：`INPUT[number(title(学习时长), minValue(0)):duration]`
> 
> 难度：`INPUT[select(title(难度), option(easy, 简单), option(medium, 中等), option(hard, 困难), defaultValue(medium)):difficulty]`
> 
> 学习状态（1-5）：`INPUT[progressBar(title(学习状态), minValue(1), maxValue(5)):mood]`

> [!quote]+ 今日总结
> ```meta-bind
> INPUT[textArea(title(一句话总结)):summary]
> ```

---

## 📚 今日学了什么

- 
- 
- 

---

## 💻 代码/命令记录

```python
# 今日记录的代码或命令
```

---

## 🐛 遇到的问题 & 解决方案

### 问题：

**解决方案：**

---

## 📋 明日计划

- [ ] 
- [ ] 
- [ ] 

---

## 🔗 关联笔记

- [[]]
