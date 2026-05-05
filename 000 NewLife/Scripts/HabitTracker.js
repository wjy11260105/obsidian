/**
 * HabitTracker.js - 习惯追踪日历组件
 * 
 * 用法（在 Obsidian Canvas 的 dataviewjs 代码块中）：
 * 
 * ```dataviewjs
 * const render = await dv.view("000 NewLife/Scripts/HabitTracker", {
 *     habitProperty: "reading",
 *     title: "📖 阅读打卡",
 *     notesFolder: "Daily Notes",   // 可选，默认 "Daily Notes"
 *     weekdayOnly: false            // 可选，默认 false
 * });
 * ```
 */

// ============================================================
// 参数解析
// ============================================================
const habitProperty = input.habitProperty;
const title = input.title || `${habitProperty} 打卡`;
const notesFolder = input.notesFolder || "Daily Notes";
const weekdayOnly = input.weekdayOnly || false;

// 为该日历实例创建唯一 ID
const containerId = `habit-calendar-${habitProperty}`;

// ============================================================
// 工具函数
// ============================================================

/** 判断日期是否为周末 */
function isWeekend(dateKey) {
    const luxonDate = dv.date(dateKey);
    return luxonDate.weekday === 6 || luxonDate.weekday === 7;
}

// ============================================================
// 连续天数 / 中断天数统计
// ============================================================
function calculateStreaks(habitData) {
    // 过滤已完成的日期（如果是 weekdayOnly 模式，排除周末）
    const allDates = Array.from(habitData.entries())
        .filter(([date, completed]) => {
            if (!completed) return false;
            if (weekdayOnly && isWeekend(date)) return false;
            return true;
        })
        .map(([date]) => date)
        .sort();

    // 统计总天数（weekdayOnly 时只算工作日）
    const totalDays = weekdayOnly
        ? Array.from(habitData.keys()).filter(d => !isWeekend(d)).length
        : habitData.size;

    const completedDays = allDates.length;
    const completionPercentage = totalDays > 0 ? Math.round((completedDays / totalDays) * 100) : 0;

    if (allDates.length === 0) {
        return {
            currentStreak: 0,
            longestStreak: 0,
            longestBreak: 0,
            totalCompleted: 0,
            completionPercentage
        };
    }

    let currentStreak = 0;
    let longestStreak = 0;
    let longestBreak = 0;
    let tempStreak = 1;

    const today = dv.date("today").toFormat('yyyy-MM-dd');

    // ---------- 计算当前连续天数 ----------
    if (weekdayOnly) {
        const todayIsWeekend = isWeekend(today);
        if (!todayIsWeekend) {
            const yesterday = dv.date("today").minus({ days: 1 }).toFormat('yyyy-MM-dd');
            const yesterdayIsWeekend = isWeekend(yesterday);
            if (allDates.includes(today) || (!yesterdayIsWeekend && allDates.includes(yesterday))) {
                let checkDate = allDates.includes(today) ? dv.date("today") : dv.date("today").minus({ days: 1 });
                while (true) {
                    const dk = checkDate.toFormat('yyyy-MM-dd');
                    if (isWeekend(dk)) { checkDate = checkDate.minus({ days: 1 }); continue; }
                    if (habitData.get(dk) === true) { currentStreak++; checkDate = checkDate.minus({ days: 1 }); }
                    else break;
                }
            }
        } else {
            let checkDate = dv.date("today");
            while (true) {
                const dk = checkDate.toFormat('yyyy-MM-dd');
                if (!isWeekend(dk)) {
                    if (habitData.get(dk) === true) {
                        while (true) {
                            const dk2 = checkDate.toFormat('yyyy-MM-dd');
                            if (isWeekend(dk2)) { checkDate = checkDate.minus({ days: 1 }); continue; }
                            if (habitData.get(dk2) === true) { currentStreak++; checkDate = checkDate.minus({ days: 1 }); }
                            else break;
                        }
                    }
                    break;
                }
                checkDate = checkDate.minus({ days: 1 });
            }
        }
    } else {
        const yesterday = dv.date("today").minus({ days: 1 }).toFormat('yyyy-MM-dd');
        if (allDates.includes(today) || allDates.includes(yesterday)) {
            let checkDate = allDates.includes(today) ? dv.date("today") : dv.date("today").minus({ days: 1 });
            while (true) {
                const dk = checkDate.toFormat('yyyy-MM-dd');
                if (habitData.get(dk) === true) { currentStreak++; checkDate = checkDate.minus({ days: 1 }); }
                else break;
            }
        }
    }

    // ---------- 计算最长连续 / 最长中断 ----------
    for (let i = 1; i < allDates.length; i++) {
        const prevDate = dv.date(allDates[i - 1]);
        const currDate = dv.date(allDates[i]);

        if (weekdayOnly) {
            let weekdaysBetween = 0;
            let tmpDate = prevDate.plus({ days: 1 });
            while (tmpDate < currDate) {
                if (!isWeekend(tmpDate.toFormat('yyyy-MM-dd'))) weekdaysBetween++;
                tmpDate = tmpDate.plus({ days: 1 });
            }
            if (weekdaysBetween <= 0) {
                tempStreak++;
            } else {
                longestStreak = Math.max(longestStreak, tempStreak);
                tempStreak = 1;
                longestBreak = Math.max(longestBreak, weekdaysBetween);
            }
        } else {
            const daysDiff = currDate.diff(prevDate, 'days').days;
            if (daysDiff === 1) {
                tempStreak++;
            } else {
                longestStreak = Math.max(longestStreak, tempStreak);
                tempStreak = 1;
                longestBreak = Math.max(longestBreak, daysDiff - 1);
            }
        }
    }
    longestStreak = Math.max(longestStreak, tempStreak);

    return {
        currentStreak,
        longestStreak,
        longestBreak,
        totalCompleted: completedDays,
        completionPercentage
    };
}

// ============================================================
// 渲染日历
// ============================================================
function renderCalendar(monthOffset) {
    const currentDate = dv.date("today").plus({ months: monthOffset });
    const year = currentDate.year;
    const month = currentDate.month;

    // 查询日记数据
    const pages = dv.pages(`"${notesFolder}"`)
        .where(p => p.file.day && p[habitProperty] !== undefined)
        .sort(p => p.file.day, 'asc');

    const habitData = new Map();
    pages.forEach(p => {
        const dateKey = p.file.day.toFormat('yyyy-MM-dd');
        habitData.set(dateKey, p[habitProperty] > 0 || p[habitProperty] === true);
    });

    const stats = calculateStreaks(habitData);

    // 月份天数
    const firstDay = dv.date(`${year}-${String(month).padStart(2, '0')}-01`);
    const lastDay = firstDay.plus({ months: 1 }).minus({ days: 1 });
    const daysInMonth = lastDay.day;

    const luxonWeekday = firstDay.weekday;
    const startDayOfWeek = luxonWeekday === 7 ? 6 : luxonWeekday - 1;

    const monthName = `${year}年${month}月`;
    const todayKey = dv.date("today").toFormat('yyyy-MM-dd');

    // ---- 构建日历单元格 ----
    const cells = [];

    // 上月补位
    if (startDayOfWeek > 0) {
        const prevMonthLastDay = firstDay.minus({ days: 1 });
        const prevMonthDaysInMonth = prevMonthLastDay.day;
        for (let i = startDayOfWeek - 1; i >= 0; i--) {
            const day = prevMonthDaysInMonth - i;
            const prevMonthDate = firstDay.minus({ days: i + 1 });
            const dateKey = prevMonthDate.toFormat('yyyy-MM-dd');
            cells.push({
                isEmpty: false, isPrevMonth: true,
                isWeekend: isWeekend(dateKey),
                day, dateKey,
                isCompleted: habitData.get(dateKey) === true,
                hasData: habitData.has(dateKey),
                isToday: dateKey === todayKey
            });
        }
    }

    // 当月
    for (let day = 1; day <= daysInMonth; day++) {
        const dateKey = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
        cells.push({
            isEmpty: false, isPrevMonth: false,
            isWeekend: isWeekend(dateKey),
            day, dateKey,
            isCompleted: habitData.get(dateKey) === true,
            hasData: habitData.has(dateKey),
            isToday: dateKey === todayKey
        });
    }

    // ---- 拼接 HTML ----
    let html = `
    <h1 style="margin: 10px 0 20px 0; text-align: center;">${title}</h1>
    <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 15px;">
        <button class="prev-month" style="padding: 6px 12px; cursor: pointer; background: var(--interactive-normal); border: 1px solid var(--background-modifier-border); border-radius: 4px; color: var(--text-normal);">← 上月</button>
        <h3 style="margin: 0;">${monthName}</h3>
        <button class="next-month" style="padding: 6px 12px; cursor: pointer; background: var(--interactive-normal); border: 1px solid var(--background-modifier-border); border-radius: 4px; color: var(--text-normal);">下月 →</button>
    </div>
    <div style="display: grid; grid-template-columns: repeat(7, 1fr); gap: 12px; margin-bottom: 15px;">
        <div style="text-align: center; font-weight: 600; color: var(--text-muted); font-size: 0.85em; padding: 8px 0;">一</div>
        <div style="text-align: center; font-weight: 600; color: var(--text-muted); font-size: 0.85em; padding: 8px 0;">二</div>
        <div style="text-align: center; font-weight: 600; color: var(--text-muted); font-size: 0.85em; padding: 8px 0;">三</div>
        <div style="text-align: center; font-weight: 600; color: var(--text-muted); font-size: 0.85em; padding: 8px 0;">四</div>
        <div style="text-align: center; font-weight: 600; color: var(--text-muted); font-size: 0.85em; padding: 8px 0;">五</div>
        <div style="text-align: center; font-weight: 600; color: var(--text-muted); font-size: 0.85em; padding: 8px 0;">六</div>
        <div style="text-align: center; font-weight: 600; color: var(--text-muted); font-size: 0.85em; padding: 8px 0;">日</div>
    `;

    // ---- 渲染每个单元格 ----
    cells.forEach((cell, index) => {
        if (cell.isEmpty) {
            html += '<div style="height: 50px;"></div>';
            return;
        }

        const posInRow = index % 7;
        const isLastInRow = posInRow === 6;
        const isFirstInRow = posInRow === 0;

        const prevCell = index > 0 ? cells[index - 1] : null;
        const nextCell = index < cells.length - 1 ? cells[index + 1] : null;

        // 连线逻辑（weekdayOnly 模式下周末不连线）
        let hasLineFromPrev, hasLineToNext, hasWrapLineFromPrev, hasWrapLineToNext;

        if (weekdayOnly) {
            hasLineFromPrev = prevCell && !prevCell.isEmpty && !prevCell.isWeekend && !cell.isWeekend && prevCell.isCompleted && cell.isCompleted && !isFirstInRow;
            hasLineToNext = nextCell && !nextCell.isEmpty && !nextCell.isWeekend && !cell.isWeekend && nextCell.isCompleted && cell.isCompleted && !isLastInRow;
            hasWrapLineFromPrev = prevCell && !prevCell.isEmpty && !prevCell.isWeekend && !cell.isWeekend && prevCell.isCompleted && cell.isCompleted && isFirstInRow;
            hasWrapLineToNext = nextCell && !nextCell.isEmpty && !nextCell.isWeekend && !cell.isWeekend && nextCell.isCompleted && cell.isCompleted && isLastInRow;
        } else {
            hasLineFromPrev = prevCell && !prevCell.isEmpty && prevCell.isCompleted && cell.isCompleted && !isFirstInRow;
            hasLineToNext = nextCell && !nextCell.isEmpty && nextCell.isCompleted && cell.isCompleted && !isLastInRow;
            hasWrapLineFromPrev = prevCell && !prevCell.isEmpty && prevCell.isCompleted && cell.isCompleted && isFirstInRow;
            hasWrapLineToNext = nextCell && !nextCell.isEmpty && nextCell.isCompleted && cell.isCompleted && isLastInRow;
        }

        const dotColor = cell.isPrevMonth ? '#1a5c28' : '#2CC742';
        const lineColor = cell.isPrevMonth ? '#1a5c28' : '#2CC742';
        const completedTextColor = cell.isPrevMonth ? '#888' : 'white';
        const missedTextColor = cell.isPrevMonth ? '#888' : 'var(--text-normal)';

        let dotStyle = `
            width: 50px; height: 50px; border-radius: 50%;
            margin: 0 auto; position: relative; z-index: 2;
            display: flex; align-items: center; justify-content: center;
            font-weight: 500; font-size: 1em; cursor: pointer;
        `;

        const isWeekendCell = weekdayOnly && cell.isWeekend;

        if (isWeekendCell) {
            dotStyle += `background-color: transparent; color: var(--text-faint); opacity: 0.3;`;
        } else if (cell.hasData) {
            if (cell.isCompleted) {
                dotStyle += `background-color: ${dotColor}; color: ${completedTextColor};`;
            } else {
                dotStyle += `background-color: transparent; border: 3px solid ${cell.isPrevMonth ? '#7d3a37' : '#FE5F58'}; color: ${missedTextColor};`;
            }
        } else {
            dotStyle += `background-color: transparent; color: ${cell.isPrevMonth ? '#666' : 'var(--text-muted)'};`;
        }

        if (cell.isToday && cell.hasData && !isWeekendCell) {
            dotStyle += 'box-shadow: 0 0 0 3px var(--interactive-accent);';
        }

        // 连线 HTML
        let lineHTML = '';
        const leftLineColor = (hasLineFromPrev && prevCell.isPrevMonth && cell.isPrevMonth) ? '#1a5c28' : lineColor;
        const rightLineColor = (hasLineToNext && cell.isPrevMonth && nextCell.isPrevMonth) ? '#1a5c28' : lineColor;

        if (hasLineFromPrev) {
            lineHTML += `<div style="position: absolute; width: calc(50% + 12px); height: 3px; background-color: ${leftLineColor}; top: 50%; left: -12px; transform: translateY(-50%); z-index: 1;"></div>`;
        }
        if (hasLineToNext) {
            lineHTML += `<div style="position: absolute; width: calc(50% + 12px); height: 3px; background-color: ${rightLineColor}; top: 50%; right: -12px; transform: translateY(-50%); z-index: 1;"></div>`;
        }
        if (hasWrapLineFromPrev) {
            const wlc = (prevCell.isPrevMonth && cell.isPrevMonth) ? '#1a5c28' : lineColor;
            lineHTML += `<div style="position: absolute; width: calc(50% + 12px); height: 3px; background-color: ${wlc}; top: 50%; left: -12px; transform: translateY(-50%); z-index: 1;"></div>`;
        }
        if (hasWrapLineToNext) {
            const wrc = (cell.isPrevMonth && nextCell.isPrevMonth) ? '#1a5c28' : lineColor;
            lineHTML += `<div style="position: absolute; width: calc(50% + 12px); height: 3px; background-color: ${wrc}; top: 50%; right: -12px; transform: translateY(-50%); z-index: 1;"></div>`;
        }

        html += `
        <div style="text-align: center; position: relative; height: 50px;">
            ${lineHTML}
            <div class="date-link" data-date="${cell.dateKey}" style="${dotStyle}">${cell.day}</div>
        </div>
        `;
    });

    // ---- 统计面板 ----
    html += `
    </div>
    <div style="margin-top: 20px; display: grid; grid-template-columns: repeat(5, 1fr); gap: 12px; padding: 15px; background: var(--background-secondary); border-radius: 8px;">
        <div style="text-align: center;">
            <div style="font-size: 1.5em; font-weight: 700; color: #2CC742;">${stats.currentStreak}</div>
            <div style="font-size: 0.85em; color: var(--text-muted); margin-top: 4px;">当前连续</div>
        </div>
        <div style="text-align: center;">
            <div style="font-size: 1.5em; font-weight: 700; color: #DAA520;">${stats.longestStreak}</div>
            <div style="font-size: 0.85em; color: var(--text-muted); margin-top: 4px;">最长连续</div>
        </div>
        <div style="text-align: center;">
            <div style="font-size: 1.5em; font-weight: 700; color: #FE5F58;">${stats.longestBreak}</div>
            <div style="font-size: 0.85em; color: var(--text-muted); margin-top: 4px;">最长中断</div>
        </div>
        <div style="text-align: center;">
            <div style="font-size: 1.5em; font-weight: 700; color: var(--text-normal);">${stats.completionPercentage}%</div>
            <div style="font-size: 0.85em; color: var(--text-muted); margin-top: 4px;">完成率</div>
        </div>
        <div style="text-align: center;">
            <div style="font-size: 1.5em; font-weight: 700; color: var(--text-normal);">${stats.totalCompleted}</div>
            <div style="font-size: 0.85em; color: var(--text-muted); margin-top: 4px;">累计完成</div>
        </div>
    </div>
    `;

    return html;
}

// ============================================================
// 初始化渲染 & 事件绑定
// ============================================================
let currentOffset = 0;
const container = dv.container;
container.innerHTML = `
<div id="${containerId}" style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
    ${renderCalendar(currentOffset)}
</div>
`;

function setupListeners() {
    const calendarDiv = container.querySelector(`#${containerId}`);

    const prevBtn = calendarDiv.querySelector('.prev-month');
    const nextBtn = calendarDiv.querySelector('.next-month');

    prevBtn.addEventListener('click', () => {
        currentOffset--;
        calendarDiv.innerHTML = renderCalendar(currentOffset);
        setupListeners();
    });

    nextBtn.addEventListener('click', () => {
        currentOffset++;
        calendarDiv.innerHTML = renderCalendar(currentOffset);
        setupListeners();
    });

    // 点击日期跳转到对应日记
    const dateLinks = calendarDiv.querySelectorAll('.date-link');
    dateLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            const dateKey = e.target.getAttribute('data-date');
            const [year, month, day] = dateKey.split('-');
            const monthNames = ["", "一月", "二月", "三月", "四月", "五月", "六月", "七月", "八月", "九月", "十月", "十一月", "十二月"];
            const monthZh = monthNames[parseInt(month, 10)];
            const dailyNotePath = `${notesFolder}/${year}/${monthZh}/${dateKey}.md`;
            app.workspace.openLinkText(dailyNotePath, '', false);
        });
    });
}

setupListeners();
