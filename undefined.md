---
banner: 000 NewLife/Banner/goal-05.png
cssclasses:
  - daily
tags:
  - learning
  - quickref
---

# 🚀 学习系统快速参考

## 📂 文件夹结构

```
005 Learning/
├── BigData/          # 大数据核心技术笔记
├── VibeCoding/       # Vibe Coding 相关笔记
├── Snippets/         # 代码片段库
├── Cases/            # 技术案例库
└── 系统实施完成报告.md
```

---

## 📋 四大模板速查

| 模板 | 用途 | 保存位置 | 关键字段 |
|------|------|---------|---------|
| **Tech Note** | 技术概念笔记 | `005 Learning/BigData/` | `topic`, `difficulty`, `status`, `progress` |
| **Snippet** | 代码片段 | `005 Learning/Snippets/` | `language`, `topic`, `description` |
| **Learning Log** | 学习日志 | `002 Journal/` | `topic`, `duration`, `mood`, `summary` |
| **Tech Case** | 技术案例 | `005 Learning/Cases/` | `topic`, `tech-stack`, `difficulty`, `progress` |

---

## 🎯 常用操作

### 创建新笔记

1. 打开 [[Learning Dashboard]]
2. 点击对应的"新建"按钮
3. 选择相应的模板
4. 填写 Frontmatter 字段
5. 自动保存到对应文件夹

### 追踪学习进度

- **技术笔记**：更新 `progress` 字段（0-100%）
- **学习日志**：记录 `duration`（分钟）和 `mood`（1-5）
- **技术案例**：更新 `progress` 字段（0-100%）

### 查看学习统计

打开 [[Learning Dashboard]] 查看：
- 📊 学习进度总览
- 🎯 按主题分类的进度
- 📚 技术笔记库
- 💻 代码片段库
- 📖 学习日志时间线
- 🏆 技术案例库
- 📈 本周学习热力图

---

## 🏷️ Frontmatter 字段速查

### Tech Note（技术笔记）

```yaml
tags: [tech, bigdata]
topic:              # 主题名称（如 Spark、Flink）
difficulty:         # beginner / intermediate / advanced
status:             # learning / reviewing / mastered
progress: 0         # 掌握度 0-100
source:             # 学习来源
related: []         # 关联笔记 wikilink
```

### Snippet（代码片段）

```yaml
tags: [snippet]
language:           # Python / SQL / Shell / Scala / Java
topic:              # 所属主题
description:        # 片段用途简述
```

### Learning Log（学习日志）

```yaml
tags: [learning-log]
topic:              # 今日学习主题
duration: 0         # 学习时长（分钟）
difficulty:         # easy / medium / hard
mood: 3             # 学习状态 1-5
summary:            # 一句话总结
```

### Tech Case（技术案例）

```yaml
tags: [case, bigdata]
topic:              # 技术主题
tech-stack: []      # 技术栈列表
difficulty:         # beginner / intermediate / advanced
progress: 0         # 完成度 0-100
start-date:         # 开始日期
deadline:           # 截止日期
```

---

## 💡 最佳实践

### ✅ 应该做

- ✅ 定期更新 `progress` 字段
- ✅ 每日记录学习日志
- ✅ 在 `related` 字段建立笔记关联
- ✅ 使用有意义的笔记标题
- ✅ 保存有用的代码片段
- ✅ 记录技术案例和经验

### ❌ 不应该做

- ❌ 不要忘记填写 Frontmatter
- ❌ 不要使用不规范的 `topic` 名称
- ❌ 不要创建重复的笔记
- ❌ 不要忽视学习日志
- ❌ 不要保存没有说明的代码片段

---

## 🔗 快速导航

| 位置 | 链接 |
|------|------|
| 主仪表盘 | [[Dashboard]] |
| 学习看板 | [[Learning Dashboard]] |
| 大数据笔记 | [[005 Learning/BigData/README]] |
| Vibe Coding | [[005 Learning/VibeCoding/README]] |
| 代码片段 | [[005 Learning/Snippets/README]] |
| 技术案例 | [[005 Learning/Cases/README]] |
| 实施报告 | [[005 Learning/系统实施完成报告]] |

---

## 📊 Dashboard 功能一览

### 学习进度总览
- 总笔记数
- 已掌握数量
- 学习中数量
- 复习中数量
- 平均掌握度

### 按主题分类
- 主题名称
- 笔记数量
- 平均进度
- 状态分布

### 技术笔记库
- 按难度分类（初级/中级/高级）
- 笔记链接
- 主题标签
- 学习状态
- 掌握度进度条

### 代码片段库
- 按编程语言分类
- 片段链接
- 所属主题
- 片段描述

### 学习日志时间线
- 最近 7 天日志
- 学习时长
- 学习状态（心情）
- 学习总结

### 技术案例库
- 案例链接
- 技术主题
- 难度等级
- 完成度进度条

### 学习热力图
- 每日学习时长可视化
- 学习习惯分析
- 学习强度展示

---

## 🎓 学习流程示例

### 第 1 天：学习新技术

1. 打开 Learning Dashboard
2. 点击"新建技术笔记"
3. 创建 `Spark - RDD 核心原理` 笔记
4. 填写核心概念、原理、代码示例
5. 设置 `progress: 20`, `status: learning`

### 第 2-5 天：深入学习

1. 每天记录学习日志
2. 保存有用的代码片段
3. 更新技术笔记的 `progress` 字段
4. 在 `related` 字段添加关联笔记

### 第 6 天：复习总结

1. 回顾学习日志
2. 更新技术笔记为 `status: reviewing`
3. 补充遗漏的知识点
4. 整理最佳实践

### 第 7 天：掌握验证

1. 完成一个技术案例
2. 更新技术笔记为 `status: mastered`
3. 设置 `progress: 100`
4. 记录案例笔记和经验

---

## 📈 进度追踪方式

### 方式 1：掌握度进度条
- 技术笔记的 `progress` 字段
- 技术案例的 `progress` 字段
- Learning Dashboard 中可视化显示

### 方式 2：学习状态标签
- `learning` — 学习中
- `reviewing` — 复习中
- `mastered` — 已掌握

### 方式 3：学习热力图
- 基于学习日志的 `duration` 字段
- 显示每日学习时长
- 帮助分析学习习惯

### 方式 4：Dashboard 统计
- 自动统计各项指标
- 实时更新进度
- 提供整体视图

---

## 🆘 常见问题

**Q: 笔记没有自动移动到对应文件夹？**  
A: 确保在 Templater 中正确配置了 `` 命令。

**Q: Learning Dashboard 中的数据没有更新？**  
A: 刷新页面或重新打开文件，dataviewjs 会自动重新计算。

**Q: 如何修改笔记的保存位置？**  
A: 编辑模板中的 `` 路径。

**Q: 可以创建自定义的学习主题吗？**  
A: 可以，在 `topic` 字段中填写任何主题名称，Dashboard 会自动分类。

**Q: 如何导出学习数据？**  
A: 可以使用 Obsidian 的导出功能或复制 dataviewjs 生成的表格。

---

## 📞 后续优化建议

- [ ] 添加学习目标与技术笔记的关联
- [ ] 创建学习路线图（推荐学习顺序）
- [ ] 添加月度学习总结模板
- [ ] 集成 Spaced Repetition 复习提醒
- [ ] 创建技能等级评估表

---

**最后更新：** 2026-05-16  
**版本：** v1.0  
**维护者：** Claudian
