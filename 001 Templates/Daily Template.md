---
tags:
  - daily
cssclasses:
  - daily
banner: 000 NewLife/Banner/self-02.png
Writing: 0
Workout: 0
Reading: 0
Meditation: 0
Money: 0
Sleep: 0
Proudness: 0
summary:
---
# 每日笔记
### <% moment(tp.file.title,'YYYY-MM-DD').format("dddd, MMMM DD, YYYY") %>

###### << [[<% fileDate = moment(tp.file.title, 'YYYY-MM-DD').subtract(1, 'd').format('YYYY-MM-DD') %>|昨天]] | [[<% fileDate = moment(tp.file.title, 'YYYY-MM-DD').add(1, 'd').format('YYYY-MM-DD') %>|明天]] >> 📅 [[<% moment(tp.file.title, 'YYYY-MM-DD').format('YYYY-MMMM') %>|月笔记]] | 📆 [[<% moment(tp.file.title, 'YYYY-MM-DD').format('YYYY-[W]ww') %>|周笔记]]

<%*
let weatherInfo = "> [!info] 🌤️ 今日天气：未知";
try {
    // 请求 JSON 格式的天气数据
    const response = await fetch("https://wttr.in/?format=j1&lang=zh-cn");
    if (response.ok) {
        const data = await response.json();
        const current = data.current_condition[0];
        const today = data.weather[0];
        
        const temp = current.temp_C;
        const feelsLike = current.FeelsLikeC;
        const humidity = current.humidity;
        const wind = current.windspeedKmph;
        const maxTemp = today.maxtempC;
        const minTemp = today.mintempC;
        const uv = today.uvIndex;
        
        let desc = current.weatherDesc[0].value;
        if (current["lang_zh-cn"]) {
            desc = current["lang_zh-cn"][0].value;
        }
        
        // 根据天气描述匹配图标
        let emoji = "🌤️";
        if (desc.includes("晴")) emoji = "☀️";
        else if (desc.includes("云") || desc.includes("阴")) emoji = "☁️";
        else if (desc.includes("雨")) emoji = "🌧️";
        else if (desc.includes("雪")) emoji = "❄️";
        else if (desc.includes("雷")) emoji = "⛈️";
        else if (desc.includes("雾")) emoji = "🌫️";
        
        // 拼接成完整的 Markdown Callout 信息块
        weatherInfo = `> [!info]+ ${emoji} 今日天气：${desc} ${temp}°C\n> - 🌡️ **气温范围**：${minTemp}°C ~ ${maxTemp}°C (体感 ${feelsLike}°C)\n> - 💧 **相对湿度**：${humidity}%\n> - 🍃 **当前风速**：${wind} km/h\n> - ☀️ **紫外线指数**：${uv}`;
    }
} catch (e) {
    console.error("获取天气出错", e);
}
_%>
<% weatherInfo %>

> [!success]+ 自豪感
> ```meta-bind
> INPUT[progressBar( minValue(0), maxValue(10)):Proudness]
> ```
> **即使我们只做了我们能力范围内的一点点，我们也会让自己感到震惊。**

> [!danger]- 习惯追踪
> | ✍️ 写作 (分钟) | 💪 健身 (分钟) | 📖 阅读 (分钟) | 💰 赚钱 (元) | 🧘 冥想 (分钟) | 🛏️' 睡眠（小时）
> |:---:|:---:|:---:|:---:|:---:|:---:|
> | `INPUT[number:Writing]` | `INPUT[number:Workout]` | `INPUT[number:Reading]` | `INPUT[number:Money]` | `INPUT[number:Meditation]` | `INPUT[number:Sleep]` |

> [!example]- 关键目标
> ```dataviewjs
> const goals = dv.pages('"004 Goals"').where(g => g.status !== "completed");
> dv.list(goals.map(g => g.file.link));
> ```

---
### 今日计划
1. 

### 任务列表

- [ ] 

### 达成成就
1. 

---
### 今日要事
1. 

### 反思复盘
1. 

>[!summary]+ 日总结（一句话）
>`INPUT[textArea(title(周总结)):summary]`
