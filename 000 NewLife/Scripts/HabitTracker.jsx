// ═══════════════════════════════════════════════════════════════
// NewLife License Guard — 独立校验，不依赖插件 boolean 状态
// ═══════════════════════════════════════════════════════════════
const _NL_VH = new Set([
  "5d3064f6405391e537444397679c7d513c3329d82d7fe8a130f0a1e1341e8965",
  "f2ae298547bb04987f49917811f94839324bfa07fb71d0862d6101870b24714b",
  "bfdb25d169f9ba8db44afc4786b5b64f8488320be26c71658f822b2d3ba187dc",
  "8be89765418e67f86c0a85521605e4621f69f34c8c3faf3b040b53b6bcd3b92d",
  "a9eac6269a4d3f66319d0d23585618385fbeeda4a0cb2db70879f3218e7a7f30",
  "dbe162482592caa8ce5b6b963cd2962a834dc0043df9baf87ab3e15cadf4e06e",
  "2eb058f9503b7379d0ac9bdcd8d5de5ea6dbb91139021b604207785dba9a1728",
  "4cf6490f229dc7ca5dc73099c0cd4773ff420fa25954969079d6e886cfcd36bc",
  "cb62c97ee128b190f947b955700b6e570a9b8987806b98711e9ea7dd1af47a34",
  "f4d3da10a76d8a9c1c41e61d671a8b4987c9a2de5316c494b1d9ad06b14d2da8",
]);
async function _nlVerify() {
  try {
    const _p = app.plugins?.plugins?.['obsidian-newlife'];
    if (!_p) return false;
    const _d = await _p.loadData();
    if (!_d || !_d.licenseKey) return false;
    const _k = _d.licenseKey.trim().toUpperCase();
    const _e = new TextEncoder().encode(_k);
    const _b = await crypto.subtle.digest('SHA-256', _e);
    const _h = Array.from(new Uint8Array(_b)).map(b => b.toString(16).padStart(2, '0')).join('');
    return _NL_VH.has(_h);
  } catch { return false; }
}
const _nlActive = await _nlVerify();
if (!_nlActive) {
  const LockedView = () => (
    <div style={{
      display: 'flex', flexDirection: 'column', alignItems: 'center',
      justifyContent: 'center', padding: '60px 20px', textAlign: 'center',
      color: 'var(--text-muted)'
    }}>
      <div style={{ fontSize: '48px', marginBottom: '16px' }}>🔒</div>
      <h3 style={{ margin: '0 0 8px 0', color: 'var(--text-normal)' }}>
        习惯追踪需要激活 NewLife
      </h3>
      <p style={{ margin: '0 0 16px 0', maxWidth: '400px' }}>
        请在设置中输入 License Key 激活完整功能。
      </p>
      <p style={{ fontSize: '0.85em' }}>命令面板 → NewLife: 激活 NewLife</p>
    </div>
  );
  return { HabitTrackerDashboard: LockedView };
}
// ═══════════════════════════════════════════════════════════════

// HabitTracker.jsx - Logic for Obsidian Habit Tracker Dashboard
// This file is loaded by datacore via dc.require()

// Constants and color configuration
const HABITS = [
  { id: 'Reading', emoji: '📚', label: '阅读', defaultDuration: 25, unit: 'minutes', monthlyGoal: 1000 },
  { id: 'Writing', emoji: '✍️', label: '写作', defaultDuration: 30, unit: 'minutes', monthlyGoal: 600 },
  { id: 'Money', emoji: '💰', label: '赚钱', defaultDuration: 500, unit: 'rmb', monthlyGoal: 10000 },
  { id: 'Workout', emoji: '💪', label: '健身', defaultDuration: 30, unit: 'minutes', monthlyGoal: 600 },
  { id: 'Meditation', emoji: '🧘‍♂️', label: '冥想', defaultDuration: 15, unit: 'minutes', monthlyGoal: 450 },
  { id: 'Sleep', emoji: '🛏️', label: '睡眠', defaultDuration: 7, unit: 'hour', monthlyGoal: 210 },
];

const GOALS = {
  perfectDays: {
    monthly: 20,
    yearly: 250
  }
};

const DAYS = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];

const COLORS = {
  primary: 'var(--interactive-accent)',
  secondary: 'var(--background-secondary)',
  hoverState: 'var(--interactive-accent-hover)',
  textPrimary: 'var(--text-normal)',
  textLight: 'var(--text-on-accent)',
  progressBar: {
    low: 'var(--interactive-accent)',
    medium: 'var(--interactive-accent)',
    high: 'var(--interactive-accent)',
    gradient: {
      start: 'var(--interactive-accent)',
      end: 'var(--interactive-accent-hover)'
    }
  }
};

// Utility Functions
const formatMetricValue = (value, habit) => {
  if (value === null || value === undefined) return '0';

  switch (habit.unit) {
    case 'minutes':
      return value === 1 ? '1 分钟' : `${value} 分钟`;
    case 'rmb':
      return `￥${Number(value).toLocaleString()}`;
    case 'hour':
      return `${value} 小时`;
    default:
      return value;
  }
};

const calculateTrendPercentage = (current, previous) => {
  if (previous === 0) return current > 0 ? 100 : 0;
  return ((current - previous) / previous) * 100;
};

const getCompletionColor = (percentage) => {
  if (percentage >= 75) return COLORS.progressBar.high;
  if (percentage >= 50) return COLORS.progressBar.medium;
  return COLORS.progressBar.low;
};

// Base Components
const CircularProgress = ({ value, size, color = 'var(--interactive-accent)', progress, strokeWidth: customStrokeWidth, circleColor, gradientStart, gradientEnd }) => {
  // Adaptation for both usages found in code
  const val = progress !== undefined ? progress : value;
  const sw = customStrokeWidth || 4;
  const radius = (size - sw * 2) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = ((100 - val) / 100) * circumference;

  const actualColor = circleColor || color;

  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      style={{
        transform: 'rotate(-90deg)',
        overflow: 'visible'
      }}
    >
      <defs>
        {gradientStart && gradientEnd && (
          <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor={gradientStart} />
            <stop offset="100%" stopColor={gradientEnd} />
          </linearGradient>
        )}
      </defs>
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        stroke="var(--background-modifier-border)"
        strokeWidth={sw}
        fill="none"
      />
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        stroke={gradientStart && gradientEnd ? "url(#progressGradient)" : actualColor}
        strokeWidth={sw}
        strokeDasharray={circumference}
        strokeDashoffset={offset}
        fill="none"
        style={{
          transition: 'stroke-dashoffset 0.5s ease',
          transformOrigin: 'center'
        }}
      />
    </svg>
  );
};

const TrendIndicator = ({ current, previous }) => {
  const trend = calculateTrendPercentage(current, previous);
  let color = 'var(--text-normal)';
  let indicator = '→';

  if (trend > 0) {
    color = 'var(--color-green)';
    indicator = '↑';
  } else if (trend < 0) {
    color = 'var(--color-red)';
    indicator = '↓';
  }

  return (
    <span style={{ color }}>
      {indicator} {Math.abs(trend).toFixed(1)}%
    </span>
  );
};

const TimeInput = ({
  entry,
  habitId,
  editingTime,
  setEditingTime,
  updateHabitDuration,
  getHabitStatus,
  getHabitDuration
}) => {
  const duration = getHabitDuration(entry, habitId);
  const isEditing = editingTime?.entryPath === entry.$path && editingTime?.habitId === habitId;

  if (!getHabitStatus(entry, habitId)) return null;

  if (isEditing) {
    return (
      <input
        type="number"
        defaultValue={duration}
        min="0"
        style={{
          width: '60px',
          padding: '2px',
          fontSize: '0.9em',
          textAlign: 'center'
        }}
        onBlur={(e) => updateHabitDuration(entry, habitId, e.target.value)}
        autoFocus
      />
    );
  }

  return (
    <span
      onClick={() => setEditingTime({ entryPath: entry.$path, habitId })}
      style={{ cursor: 'pointer', fontSize: '0.8em' }}
    >
      {formatMetricValue(duration, HABITS.find(h => h.id === habitId))}
    </span>
  );
};

const ProgressBar = ({ value, max, color = 'var(--interactive-accent)' }) => {
  const percentage = Math.min((value / max) * 100, 100);
  return (
    <div style={{
      width: '100%',
      height: '4px',
      backgroundColor: 'var(--background-modifier-border)',
      borderRadius: '4px',
      overflow: 'hidden'
    }}>
      <div style={{
        width: `${percentage}%`,
        height: '100%',
        backgroundColor: color,
        transition: 'width 0.3s ease'
      }} />
    </div>
  );
};

const StyledCard = ({ children, extraStyles = {} }) => (
  <div style={{
    backgroundColor: 'var(--background-primary)',
    borderRadius: '12px',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
    padding: '24px',
    transition: 'all 0.2s ease',
    ':hover': {
      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
      transform: 'translateY(-2px)'
    },
    ...extraStyles
  }}>
    {children}
  </div>
);

const ActionButton = ({ icon, label, onClick, isActive, extraStyles = {} }) => (
  <button
    onClick={onClick}
    style={{
      padding: '12px 24px',
      borderRadius: '8px',
      border: 'none',
      backgroundColor: isActive ? COLORS.primary : COLORS.secondary,
      color: isActive ? COLORS.textLight : COLORS.textPrimary,
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      cursor: 'pointer',
      transition: 'all 0.2s ease',
      fontSize: '16px',
      fontWeight: '500',
      ':hover': {
        transform: 'translateY(-1px)',
        backgroundColor: COLORS.primary,
        color: COLORS.textLight,
        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)'
      },
      ...extraStyles
    }}
  >
    <span style={{ fontSize: '20px' }}>{icon}</span>
    {label && <span>{label}</span>}
  </button>
);

const NavigationControls = ({
  selectedDate,
  navigateDate,
  activeView,
  setActiveView
}) => (
  <div style={{
    display: 'flex',
    flexDirection: 'column',
    gap: '24px'
  }}>
    <div style={{
      display: 'flex',
      gap: '16px',
      alignItems: 'center',
      justifyContent: 'center',
      background: COLORS.secondary,
      padding: '8px 16px',
      borderRadius: '12px',
      boxShadow: 'var(--shadow-s)'
    }}>
      <ActionButton
        icon="←"
        onClick={() => navigateDate(-1)}
        extraStyles={{
          backgroundColor: COLORS.primary,
          color: COLORS.textLight
        }}
      />
      <div style={{
        fontWeight: 'bold',
        fontSize: '24px',
        minWidth: '240px',
        textAlign: 'center',
        fontFamily: 'var(--font-interface)',
        background: 'var(--background-primary)',
        padding: '8px 16px',
        borderRadius: '8px',
        boxShadow: 'var(--shadow-s)'
      }}>
        {selectedDate.toFormat('yyyy年MM月dd日')}
      </div>
      <ActionButton
        icon="→"
        onClick={() => navigateDate(1)}
        extraStyles={{
          backgroundColor: COLORS.primary,
          color: COLORS.textLight
        }}
      />
    </div>
  </div>
);

const CalendarDayCard = ({
  date,
  entry,
  getHabitStatus,
  calculateCompletedHabits,
  isSelected,
  isToday,
  updateHabit,
  getHabitDuration,
  editingTime,
  setEditingTime,
  updateHabitDuration
}) => {
  const completedCount = calculateCompletedHabits(entry);
  const completionPercentage = entry ? Math.round((completedCount / HABITS.length) * 100) : 0;

  return (
    <div style={{
      padding: '12px',
      borderRadius: '16px',
      backgroundColor: 'var(--background-primary)',
      color: COLORS.textPrimary,
      boxShadow: 'var(--shadow-s)',
      border: isSelected ? `2px solid ${COLORS.primary}` : '1px solid var(--background-modifier-border)',
      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
      display: 'flex',
      flexDirection: 'column',
      gap: '8px',
      minHeight: '168px'
    }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: COLORS.secondary,
        padding: '8px 12px',
        borderRadius: '10px'
      }}>
        <span style={{
          fontSize: '1em',
          fontWeight: '600',
          color: COLORS.textPrimary
        }}>
          {DAYS[date.weekday % 7]}
        </span>
        <span style={{
          fontWeight: '500',
          fontSize: '0.9em',
          color: COLORS.textPrimary
        }}>
          {date.toFormat('MM-dd')}
        </span>
      </div>

      {entry && (
        <>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))',
            gap: '8px',
            flex: 1,
            padding: '2px'
          }}>
            {HABITS.map(habit => {
              const isCompleted = getHabitStatus(entry, habit.id);
              const duration = getHabitDuration(entry, habit.id);

              return (
                <div
                  key={habit.id}
                  onClick={() => updateHabit(entry, habit.id)}
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '4px',
                    backgroundColor: isCompleted ? COLORS.primary : COLORS.secondary,
                    borderRadius: '10px',
                    cursor: 'pointer',
                    padding: '12px',
                    width: '100%',
                    minHeight: '80px',
                    transition: 'all 0.2s ease'
                  }}
                >
                  <span style={{
                    fontSize: '24px',
                    marginBottom: '4px'
                  }}>
                    {habit.emoji}
                  </span>
                  <span style={{
                    fontSize: '0.95em',
                    fontWeight: '600',
                    color: isCompleted ? COLORS.textLight : COLORS.textPrimary,
                    letterSpacing: '0.2px',
                    textAlign: 'center',
                    lineHeight: '1.2'
                  }}>
                    {habit.label}
                  </span>
                  {isCompleted && duration && (
                    <span style={{
                      fontSize: '0.75em',
                      fontWeight: '600',
                      color: isCompleted ? COLORS.textLight : COLORS.textPrimary,
                      textAlign: 'center'
                    }}>
                      {formatMetricValue(duration, habit)}
                    </span>
                  )}
                </div>
              );
            })}
          </div>

          <div style={{
            marginTop: 'auto',
            display: 'flex',
            flexDirection: 'column',
            gap: '4px'
          }}>
            <ProgressBar
              value={completedCount}
              max={HABITS.length}
              color={getCompletionColor(completionPercentage)}
            />
            <div style={{
              textAlign: 'right',
              fontSize: '0.8em',
              fontWeight: '600',
              color: getCompletionColor(completionPercentage)
            }}>
              {completionPercentage}%
            </div>
          </div>
        </>
      )}
    </div>
  );
};

const CalendarView = ({
  selectedDate,
  sortedNotes,
  getHabitStatus,
  calculateCompletedHabits,
  updateHabit,
  getHabitDuration,
  editingTime,
  setEditingTime,
  updateHabitDuration
}) => {
  const dates = [];
  let currentDate = selectedDate;

  for (let i = 0; i < 7; i++) {
    dates.push(currentDate.minus({ days: i }));
  }

  const notesMap = new Map(sortedNotes.map(note => [note.$name, note]));
  const today = dc.luxon.DateTime.now().startOf('day');

  return (
    <div style={{
      width: '100%',
      overflow: 'hidden',
      padding: '8px 4px'
    }}>
      <div style={{
        display: 'flex',
        gap: '12px',
        overflowX: 'auto',
        paddingBottom: '12px',
        WebkitOverflowScrolling: 'touch',
        scrollbarWidth: 'none',
        msOverflowStyle: 'none',
        '::-webkit-scrollbar': {
          display: 'none'
        }
      }}>
        {dates.map((date) => {
          const dateStr = date.toFormat('yyyy-MM-dd');
          const entry = notesMap.get(dateStr);
          const isSelected = date.hasSame(selectedDate, 'day');
          const isToday = date.hasSame(today, 'day');

          return (
            <div style={{
              flex: '0 0 320px',
              maxWidth: '320px'
            }} key={dateStr}>
              <CalendarDayCard
                date={date}
                entry={entry}
                getHabitStatus={getHabitStatus}
                calculateCompletedHabits={calculateCompletedHabits}
                isSelected={isSelected}
                isToday={isToday}
                updateHabit={updateHabit}
                getHabitDuration={getHabitDuration}
                editingTime={editingTime}
                setEditingTime={setEditingTime}
                updateHabitDuration={updateHabitDuration}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
};

const MetricCard = ({ habit, current, previous, ytdTotal }) => {
  const formattedTotal = formatMetricValue(current, habit);
  const formattedYTD = formatMetricValue(ytdTotal, habit);

  return (
    <div style={{
      backgroundColor: 'var(--background-primary)',
      borderRadius: '16px',
      padding: '24px',
      boxShadow: 'var(--shadow-s)',
      display: 'flex',
      flexDirection: 'column',
      gap: '16px'
    }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '12px'
      }}>
        <div style={{
          fontSize: '32px',
          backgroundColor: COLORS.secondary,
          borderRadius: '12px',
          padding: '12px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          {habit.emoji}
        </div>
        <div>
          <h3 style={{ margin: 0 }}>{habit.label}</h3>
          <div style={{
            color: 'var(--text-muted)',
            fontSize: '0.9em'
          }}>
            最近 30 天
          </div>
        </div>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(2, 1fr)',
        gap: '16px'
      }}>
        <div style={{
          backgroundColor: COLORS.secondary,
          padding: '16px',
          borderRadius: '12px',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '0.9em', color: 'var(--text-muted)' }}>当前</div>
          <div style={{
            fontSize: '1.4em',
            fontWeight: 'bold',
            marginTop: '4px'
          }}>
            {formattedTotal}
          </div>
        </div>

        <div style={{
          backgroundColor: COLORS.secondary,
          padding: '16px',
          borderRadius: '12px',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '0.9em', color: 'var(--text-muted)' }}>本年累计</div>
          <div style={{
            fontSize: '1.4em',
            fontWeight: 'bold',
            marginTop: '4px'
          }}>
            {formattedYTD}
          </div>
        </div>
      </div>

      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: COLORS.secondary,
        padding: '12px 16px',
        borderRadius: '12px'
      }}>
        <span>趋势</span>
        <TrendIndicator current={current} previous={previous} />
      </div>
    </div>
  );
};

const TrendsView = ({ trends }) => {
  const monthlyProgress = (trends.currentMonth.perfectDays / GOALS.perfectDays.monthly) * 100;
  const yearlyProgress = (trends.yearToDate.perfectDays / GOALS.perfectDays.yearly) * 100;

  return (
    <div style={{
      padding: '24px',
      display: 'flex',
      flexDirection: 'column',
      gap: '32px'
    }}>
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
        gap: '24px'
      }}>
        <div style={{
          backgroundColor: 'var(--background-primary)',
          borderRadius: '16px',
          padding: '24px',
          display: 'flex',
          alignItems: 'center',
          gap: '24px',
          boxShadow: 'var(--shadow-s)'
        }}>
          <CircularProgress value={monthlyProgress} size={100} color={COLORS.primary} />
          <div>
            <h3 style={{ margin: '0 0 8px 0', color: 'var(--text-normal)' }}>月度目标</h3>
            <div style={{ fontSize: '1.2em', fontWeight: 'bold', color: 'var(--text-normal)' }}>
              {trends.currentMonth.perfectDays}/{GOALS.perfectDays.monthly} 完美达成
            </div>
            <div style={{ color: 'var(--text-muted)' }}>
              完成进度 {monthlyProgress.toFixed(1)}%
            </div>
          </div>
        </div>

        <div style={{
          backgroundColor: 'var(--background-primary)',
          borderRadius: '16px',
          padding: '24px',
          display: 'flex',
          alignItems: 'center',
          gap: '24px',
          boxShadow: 'var(--shadow-s)'
        }}>
          <CircularProgress value={yearlyProgress} size={100} color={COLORS.progressBar.high} />
          <div>
            <h3 style={{ margin: '0 0 8px 0', color: 'var(--text-normal)' }}>年度目标</h3>
            <div style={{ fontSize: '1.2em', fontWeight: 'bold', color: 'var(--text-normal)' }}>
              {trends.yearToDate.perfectDays}/{GOALS.perfectDays.yearly} 完美达成
            </div>
            <div style={{ color: 'var(--text-muted)' }}>
              完成进度 {yearlyProgress.toFixed(1)}%
            </div>
          </div>
        </div>

        <div style={{
          backgroundColor: 'var(--background-primary)',
          borderRadius: '16px',
          padding: '24px',
          display: 'flex',
          alignItems: 'center',
          gap: '24px',
          boxShadow: 'var(--shadow-s)'
        }}>
          <div style={{
            width: '100px',
            height: '100px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '48px',
            backgroundColor: 'var(--background-secondary)',
            borderRadius: '50%'
          }}>
            🔥
          </div>
          <div>
            <h3 style={{ margin: '0 0 8px 0', color: 'var(--text-normal)' }}>当前连续达成</h3>
            <div style={{ fontSize: '1.2em', fontWeight: 'bold', color: 'var(--text-normal)' }}>
              {trends.last30Days.perfectDays} 天
            </div>
            <div style={{ color: 'var(--text-muted)' }}>
              最近 30 天
            </div>
          </div>
        </div>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
        gap: '24px'
      }}>
        {HABITS.map(habit => (
          <MetricCard
            key={habit.id}
            habit={habit}
            current={trends.last30Days.habitMetrics[habit.id].total}
            previous={trends.last30Days.habitMetrics[habit.id].previousPeriodTotal}
            ytdTotal={trends.yearToDate.habitMetrics[habit.id].total}
          />
        ))}
      </div>
    </div>
  );
};

const HistoricalView = ({
  sortedNotes,
  currentPage,
  setCurrentPage,
  updateHabit,
  getHabitStatus,
  getHabitDuration,
  editingTime,
  setEditingTime,
  updateHabitDuration,
  calculateCompletedHabits
}) => {
  const itemsPerPage = 20;
  const totalPages = Math.ceil(sortedNotes.length / itemsPerPage);
  const startIndex = currentPage * itemsPerPage;
  const displayNotes = sortedNotes.slice(startIndex, startIndex + itemsPerPage);

  return (
    <div style={{
      padding: '24px',
      backgroundColor: COLORS.secondary,
      borderRadius: '12px',
      marginTop: '24px'
    }}>
      <h3 style={{ margin: '0 0 20px 0' }}>历史数据</h3>

      <div style={{
        width: '100%',
        overflow: 'auto',
        borderRadius: '12px',
        boxShadow: 'var(--shadow-s)',
        backgroundColor: 'var(--background-primary)'
      }}>
        <table style={{
          width: '100%',
          borderCollapse: 'separate',
          borderSpacing: 0
        }}>
          <thead>
            <tr>
              <th style={{
                padding: '16px',
                backgroundColor: COLORS.secondary,
                color: COLORS.textPrimary,
                fontWeight: 'bold',
                textAlign: 'left',
                position: 'sticky',
                top: 0,
                zIndex: 10,
              }}>日期</th>
              {HABITS.map(habit => (
                <th key={habit.id} style={{
                  padding: '16px',
                  backgroundColor: COLORS.secondary,
                  color: COLORS.textPrimary,
                  fontWeight: 'bold',
                  textAlign: 'center',
                  position: 'sticky',
                  top: 0,
                  zIndex: 10,
                }}>
                  <div style={{ fontSize: '1.4em' }}>{habit.emoji}</div>
                  <div>{habit.label}</div>
                </th>
              ))}
              <th style={{
                padding: '16px',
                backgroundColor: COLORS.secondary,
                color: COLORS.textPrimary,
                fontWeight: 'bold',
                textAlign: 'center',
                position: 'sticky',
                top: 0,
                zIndex: 10,
              }}>完成度</th>
            </tr>
          </thead>
          <tbody>
            {displayNotes.map((entry, index) => (
              <tr key={entry.$path} style={{
                backgroundColor: index % 2 === 0 ? 'var(--background-primary)' : 'var(--background-secondary)'
              }}>
                <td style={{
                  padding: '12px 16px',
                  borderBottom: '1px solid rgba(0, 0, 0, 0.05)',
                  minWidth: '150px'
                }}>{entry.$name}</td>
                {HABITS.map(habit => {
                  const isCompleted = getHabitStatus(entry, habit.id);
                  return (
                    <td key={habit.id} style={{
                      padding: '12px 16px',
                      borderBottom: '1px solid rgba(0, 0, 0, 0.05)',
                      textAlign: 'center',
                      minWidth: '120px'
                    }}>
                      <div style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: '4px'
                      }}>
                        <div
                          onClick={() => updateHabit(entry, habit.id)}
                          style={{
                            padding: '4px 8px',
                            borderRadius: '4px',
                            backgroundColor: isCompleted ? COLORS.primary : COLORS.secondary,
                            color: isCompleted ? COLORS.textLight : 'var(--text-muted)',
                            cursor: 'pointer'
                          }}
                        >
                          {isCompleted ? '✓' : '×'}
                        </div>
                        {isCompleted && (
                          <TimeInput
                            entry={entry}
                            habitId={habit.id}
                            editingTime={editingTime}
                            setEditingTime={setEditingTime}
                            updateHabitDuration={updateHabitDuration}
                            getHabitStatus={getHabitStatus}
                            getHabitDuration={getHabitDuration}
                          />
                        )}
                      </div>
                    </td>
                  );
                })}
                <td style={{
                  padding: '12px 16px',
                  borderBottom: '1px solid rgba(0, 0, 0, 0.05)',
                  textAlign: 'center',
                  color: getCompletionColor(Math.round((calculateCompletedHabits(entry) / HABITS.length) * 100)),
                  fontWeight: '600'
                }}>
                  {Math.round((calculateCompletedHabits(entry) / HABITS.length) * 100)}%
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div style={{
        display: 'flex',
        justifyContent: 'center',
        gap: '8px',
        marginTop: '16px'
      }}>
        <ActionButton
          icon="←"
          onClick={() => setCurrentPage(prev => Math.max(0, prev - 1))}
          extraStyles={{
            opacity: currentPage === 0 ? 0.5 : 1,
            cursor: currentPage === 0 ? 'default' : 'pointer'
          }}
        />
        <span style={{
          padding: '8px 16px',
          backgroundColor: 'var(--background-primary)',
          borderRadius: '8px'
        }}>
          第 {currentPage + 1} 页，共 {totalPages} 页
        </span>
        <ActionButton
          icon="→"
          onClick={() => setCurrentPage(prev => Math.min(totalPages - 1, prev + 1))}
          extraStyles={{
            opacity: currentPage === totalPages - 1 ? 0.5 : 1,
            cursor: currentPage === totalPages - 1 ? 'default' : 'pointer'
          }}
        />
      </div>
    </div>
  );
};

const Stat = ({ label, value, color }) => (
  <div style={{ textAlign: 'center' }}>
    <div style={{
      fontSize: '0.9em',
      color: 'var(--text-muted)',
      marginBottom: '4px'
    }}>
      {label}
    </div>
    <div style={{
      fontSize: '1.1em',
      fontWeight: 'bold',
      color: color || 'var(--text-normal)'
    }}>
      {value}
    </div>
  </div>
);

const GoalsView = ({ entries, daysInMonth }) => {
  const habitsWithGoals = HABITS.filter(h => h.monthlyGoal);

  const calculateProgress = (habitId) => {
    const total = entries.reduce((sum, entry) => sum + (entry?.value(habitId) ?? 0), 0);
    const habit = HABITS.find(h => h.id === habitId);

    const daysWithData = entries.filter(entry => {
      const value = entry?.value(habitId);
      return value !== null && value !== undefined && value > 0;
    }).length;

    const progress = (total / habit.monthlyGoal) * 100;
    const daysForAverage = Math.max(daysWithData, 1);
    const dailyAverage = Number((total / daysForAverage).toFixed(2));
    const projection = Number((dailyAverage * daysInMonth).toFixed(2));
    const isOnTrack = projection >= habit.monthlyGoal;

    return {
      total,
      progress: Number(Math.min(progress, 100).toFixed(2)),
      dailyAverage,
      projection,
      isOnTrack,
      daysWithData
    };
  };

  const getProgressGradient = (isOnTrack) => {
    return {
      start: isOnTrack ? COLORS.progressBar.gradient.start : COLORS.progressBar.gradient.start,
      end: isOnTrack ? COLORS.progressBar.gradient.end : COLORS.progressBar.gradient.end
    };
  };

  return (
    <div style={{
      padding: '16px',
      width: '100%',
      maxWidth: '100%'
    }}>
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(450px, 1fr))',
        gap: '24px',
        width: '100%'
      }}>
        {habitsWithGoals.map(habit => {
          const stats = calculateProgress(habit.id);
          const progressColor = stats.isOnTrack ? COLORS.progressBar.high : COLORS.progressBar.low;
          const gradient = getProgressGradient(stats.isOnTrack);

          return (
            <div key={habit.id} style={{
              background: 'var(--background-secondary)',
              borderRadius: '12px',
              padding: '24px',
              boxShadow: 'var(--shadow-s)',
              minWidth: '450px',
              flex: '1 1 auto'
            }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '16px',
                marginBottom: '16px'
              }}>
                <div style={{
                  width: '100px',
                  height: '100px',
                  position: 'relative'
                }}>
                  <CircularProgress
                    progress={stats.progress}
                    size={100}
                    strokeWidth={10}
                    circleColor={progressColor}
                    gradientStart={gradient.start}
                    gradientEnd={gradient.end}
                  />
                  <div style={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    fontSize: '42px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '80%',
                    height: '80%'
                  }}>
                    {habit.emoji}
                  </div>
                </div>

                <div style={{ flex: 1 }}>
                  <h3 style={{
                    margin: '0 0 8px 0',
                    textAlign: 'center',
                    fontSize: '1.4em',
                    color: 'var(--text-normal)'
                  }}>{habit.label}</h3>
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr',
                    gap: '12px'
                  }}>
                    <Stat
                      label="当前"
                      value={formatMetricValue(stats.total, habit)}
                    />
                    <Stat
                      label="目标"
                      value={formatMetricValue(habit.monthlyGoal, habit)}
                    />
                    <Stat
                      label="日均"
                      value={formatMetricValue(stats.dailyAverage, habit)}
                    />
                    <Stat
                      label="预计"
                      value={formatMetricValue(stats.projection, habit)}
                      color={stats.isOnTrack ? 'var(--color-green)' : 'var(--color-red)'}
                    />
                  </div>
                </div>
              </div>

              <div style={{
                height: '40px',
                background: 'var(--background-primary)',
                borderRadius: '20px',
                overflow: 'hidden',
                position: 'relative'
              }}>
                <div style={{
                  position: 'absolute',
                  top: '0',
                  left: '0',
                  height: '100%',
                  width: `${stats.progress}%`,
                  background: `linear-gradient(90deg, ${gradient.start} 0%, ${gradient.end} 100%)`,
                  transition: 'width 0.3s ease'
                }} />
                <div style={{
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  transform: 'translate(-50%, -50%)',
                  color: 'var(--text-normal)',
                  fontWeight: 'bold'
                }}>
                  {stats.progress}%
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

const WeeklyGoalsView = ({ entries }) => {
  const habitsWithGoals = HABITS.filter(h => h.monthlyGoal);
  const daysInWeek = 7;

  const calculateWeeklyProgress = (habitId) => {
    const total = entries.reduce((sum, entry) => sum + (entry?.value(habitId) ?? 0), 0);
    const habit = HABITS.find(h => h.id === habitId);

    const daysWithData = entries.filter(entry => {
      const value = entry?.value(habitId);
      return value !== null && value !== undefined && value > 0;
    }).length;

    const weeklyGoal = Math.round(habit.monthlyGoal * (daysInWeek / 30));
    const progress = (total / weeklyGoal) * 100;

    const daysForAverage = Math.max(daysWithData, 1);
    const dailyAverage = Number((total / daysForAverage).toFixed(2));

    const projection = Number((dailyAverage * daysInWeek).toFixed(2));
    const isOnTrack = projection >= weeklyGoal;

    return {
      total,
      weeklyGoal,
      progress: Number(Math.min(progress, 100).toFixed(2)),
      dailyAverage,
      projection,
      isOnTrack,
      daysWithData
    };
  };

  const getProgressGradient = (isOnTrack) => {
    return {
      start: isOnTrack ? COLORS.progressBar.gradient.start : COLORS.progressBar.gradient.start,
      end: isOnTrack ? COLORS.progressBar.gradient.end : COLORS.progressBar.gradient.end
    };
  };

  return (
    <div style={{
      padding: '16px',
      width: '100%',
      maxWidth: '100%'
    }}>
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(450px, 1fr))',
        gap: '24px',
        width: '100%'
      }}>
        {habitsWithGoals.map(habit => {
          const stats = calculateWeeklyProgress(habit.id);
          const progressColor = stats.isOnTrack ? COLORS.progressBar.high : COLORS.progressBar.low;
          const gradient = getProgressGradient(stats.isOnTrack);

          return (
            <div key={habit.id} style={{
              background: 'var(--background-secondary)',
              borderRadius: '12px',
              padding: '24px',
              boxShadow: 'var(--shadow-s)',
              minWidth: '450px',
              flex: '1 1 auto'
            }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '16px',
                marginBottom: '16px'
              }}>
                <div style={{
                  width: '100px',
                  height: '100px',
                  position: 'relative'
                }}>
                  <CircularProgress
                    progress={stats.progress}
                    size={100}
                    strokeWidth={10}
                    circleColor={progressColor}
                    gradientStart={gradient.start}
                    gradientEnd={gradient.end}
                  />
                  <div style={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    fontSize: '42px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '80%',
                    height: '80%'
                  }}>
                    {habit.emoji}
                  </div>
                </div>

                <div style={{ flex: 1 }}>
                  <h3 style={{
                    margin: '0 0 8px 0',
                    textAlign: 'center',
                    fontSize: '1.4em',
                    color: 'var(--text-normal)'
                  }}>{habit.label}</h3>
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr',
                    gap: '12px'
                  }}>
                    <Stat
                      label="当前"
                      value={formatMetricValue(stats.total, habit)}
                    />
                    <Stat
                      label="周目标"
                      value={formatMetricValue(stats.weeklyGoal, habit)}
                    />
                    <Stat
                      label="日均"
                      value={formatMetricValue(stats.dailyAverage, habit)}
                    />
                    <Stat
                      label="预计"
                      value={formatMetricValue(stats.projection, habit)}
                      color={stats.isOnTrack ? 'var(--color-green)' : 'var(--color-red)'}
                    />
                  </div>
                </div>
              </div>

              <div style={{
                height: '40px',
                background: 'var(--background-primary)',
                borderRadius: '20px',
                overflow: 'hidden',
                position: 'relative'
              }}>
                <div style={{
                  position: 'absolute',
                  top: '0',
                  left: '0',
                  height: '100%',
                  width: `${stats.progress}%`,
                  background: `linear-gradient(90deg, ${gradient.start} 0%, ${gradient.end} 100%)`,
                  transition: 'width 0.3s ease'
                }} />
                <div style={{
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  transform: 'translate(-50%, -50%)',
                  color: 'var(--text-normal)',
                  fontWeight: 'bold'
                }}>
                  {stats.progress}%
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

function HabitTrackerDashboard() {
  // State Management
  const [activeView, setActiveView] = dc.useState('weekly');
  const [selectedDate, setSelectedDate] = dc.useState(dc.luxon.DateTime.now());
  const [editingTime, setEditingTime] = dc.useState(null);
  const [currentPage, setCurrentPage] = dc.useState(0);

  // Data Queries and Utility Functions
  const dailyNotes = dc.useQuery(`
    @page 
    AND path("002 Journal")
    AND #daily
  `);

  const sortedNotes = dc.useMemo(() => {
    return [...dailyNotes].sort((a, b) => b.$name.localeCompare(a.$name));
  }, [dailyNotes]);

  const getNotesForPeriod = (startDate) => {
    return sortedNotes.filter(note => {
      const noteDate = dc.luxon.DateTime.fromISO(note.$name);
      return noteDate >= startDate;
    });
  };

  const getNotesForDateRange = (startDate, endDate) => {
    return sortedNotes.filter(note => {
      const noteDate = dc.luxon.DateTime.fromISO(note.$name);
      return noteDate >= startDate.startOf('day') && noteDate <= endDate.endOf('day');
    });
  };

  const last30DaysNotes = dc.useMemo(() =>
    getNotesForPeriod(selectedDate.minus({ days: 30 })),
    [sortedNotes, selectedDate]
  );

  const yearToDateNotes = dc.useMemo(() =>
    getNotesForPeriod(selectedDate.startOf('year')),
    [sortedNotes, selectedDate]
  );

  const currentMonthNotes = dc.useMemo(() =>
    getNotesForPeriod(selectedDate.startOf('month')),
    [sortedNotes, selectedDate]
  );

  const previousMonthNotes = dc.useMemo(() =>
    sortedNotes.filter(note => {
      const noteDate = dc.luxon.DateTime.fromISO(note.$name);
      const monthAgo = selectedDate.minus({ months: 1 });
      return noteDate >= monthAgo && noteDate < selectedDate.startOf('month');
    }),
    [sortedNotes, selectedDate]
  );

  const getHabitStatus = (entry, habitId) => {
    const habit = HABITS.find(h => h.id === habitId);
    const value = entry?.value(habitId) ?? 0;
    return value >= habit.defaultDuration;
  };

  const getHabitDuration = (entry, habitId) => {
    return entry?.value(habitId) ?? null;
  };

  const calculateCompletedHabits = (entry) => {
    if (!entry) return 0;
    return HABITS.reduce((count, habit) =>
      count + (getHabitStatus(entry, habit.id) ? 1 : 0), 0);
  };

  const calculatePerfectDays = (notes) => {
    return notes.reduce((count, note) =>
      count + (calculateCompletedHabits(note) === HABITS.length ? 1 : 0), 0);
  };

  const calculateTrends = () => {
    const trends = {
      last30Days: {
        perfectDays: calculatePerfectDays(last30DaysNotes),
        habitMetrics: {}
      },
      yearToDate: {
        perfectDays: calculatePerfectDays(yearToDateNotes),
        habitMetrics: {}
      },
      currentMonth: {
        perfectDays: calculatePerfectDays(currentMonthNotes),
        progress: 0
      }
    };

    trends.currentMonth.progress = (trends.currentMonth.perfectDays / GOALS.perfectDays.monthly) * 100;

    HABITS.forEach(habit => {
      const last30Total = last30DaysNotes.reduce((sum, note) => {
        const value = note?.value(habit.id);
        const numValue = value ? Number(value) : 0;
        return sum + (isNaN(numValue) ? 0 : numValue);
      }, 0);

      const ytdTotal = yearToDateNotes.reduce((sum, note) => {
        const value = note?.value(habit.id);
        const numValue = value ? Number(value) : 0;
        return sum + (isNaN(numValue) ? 0 : numValue);
      }, 0);

      const previousMonthTotal = previousMonthNotes.reduce((sum, note) => {
        const value = note?.value(habit.id);
        const numValue = value ? Number(value) : 0;
        return sum + (isNaN(numValue) ? 0 : numValue);
      }, 0);

      trends.last30Days.habitMetrics[habit.id] = {
        total: last30Total,
        previousPeriodTotal: previousMonthTotal
      };

      trends.yearToDate.habitMetrics[habit.id] = {
        total: ytdTotal
      };
    });

    return trends;
  };

  const currentWeekNotes = sortedNotes.filter(note => {
    const noteDate = dc.luxon.DateTime.fromISO(note.$name);
    const startOfWeek = selectedDate.startOf('week');
    const endOfWeek = selectedDate.endOf('week');
    return noteDate >= startOfWeek && noteDate <= endOfWeek;
  });

  // Action Handlers
  async function updateHabit(entry, habitId) {
    const file = app.vault.getAbstractFileByPath(entry.$path);
    await app.fileManager.processFrontMatter(file, (frontmatter) => {
      const habit = HABITS.find(h => h.id === habitId);
      const currentValue = frontmatter[habitId];
      frontmatter[habitId] = currentValue ? 0 : habit.defaultDuration;
    });
  }

  async function updateHabitDuration(entry, habitId, duration) {
    const file = app.vault.getAbstractFileByPath(entry.$path);
    await app.fileManager.processFrontMatter(file, (frontmatter) => {
      frontmatter[habitId] = parseInt(duration) || 0;
    });
    setEditingTime(null);
  }

  const navigateDate = (direction) => {
    setSelectedDate(prev => prev.plus({ days: direction }));
  };

  // Main Layout
  return (
    <div style={{
      width: '100%',
      margin: '0 auto',
      padding: '24px',
      display: 'flex',
      flexDirection: 'column',
      gap: '24px'
    }}>
      <NavigationControls
        selectedDate={selectedDate}
        navigateDate={navigateDate}
        activeView={activeView}
        setActiveView={setActiveView}
      />

      <StyledCard>
        <CalendarView
          selectedDate={selectedDate}
          sortedNotes={getNotesForDateRange(selectedDate.minus({ days: 6 }), selectedDate)}
          getHabitStatus={getHabitStatus}
          calculateCompletedHabits={calculateCompletedHabits}
          updateHabit={updateHabit}
          getHabitDuration={getHabitDuration}
          editingTime={editingTime}
          setEditingTime={setEditingTime}
          updateHabitDuration={updateHabitDuration}
        />

        <div style={{
          display: 'flex',
          justifyContent: 'center',
          gap: '24px',
          marginTop: '16px',
          paddingTop: '16px',
          borderTop: '1px solid var(--background-modifier-border)'
        }}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
            <ActionButton
              icon="📅"
              onClick={() => setActiveView(activeView === 'weekly' ? null : 'weekly')}
              isActive={activeView === 'weekly'}
              extraStyles={{ padding: '12px' }}
            />
            <span
              onClick={() => setActiveView(activeView === 'weekly' ? null : 'weekly')}
              style={{ fontSize: '0.85em', fontWeight: activeView === 'weekly' ? '600' : 'normal', color: activeView === 'weekly' ? 'var(--text-normal)' : 'var(--text-muted)', cursor: 'pointer' }}
            >
              周目标
            </span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
            <ActionButton
              icon="🚀"
              onClick={() => setActiveView(activeView === 'goals' ? null : 'goals')}
              isActive={activeView === 'goals'}
              extraStyles={{ padding: '12px' }}
            />
            <span
              onClick={() => setActiveView(activeView === 'goals' ? null : 'goals')}
              style={{ fontSize: '0.85em', fontWeight: activeView === 'goals' ? '600' : 'normal', color: activeView === 'goals' ? 'var(--text-normal)' : 'var(--text-muted)', cursor: 'pointer' }}
            >
              月度目标
            </span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
            <ActionButton
              icon="🚧"
              onClick={() => setActiveView(activeView === 'stats' ? null : 'stats')}
              isActive={activeView === 'stats'}
              extraStyles={{ padding: '12px' }}
            />
            <span
              onClick={() => setActiveView(activeView === 'stats' ? null : 'stats')}
              style={{ fontSize: '0.85em', fontWeight: activeView === 'stats' ? '600' : 'normal', color: activeView === 'stats' ? 'var(--text-normal)' : 'var(--text-muted)', cursor: 'pointer' }}
            >
              趋势统计
            </span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
            <ActionButton
              icon="🎯"
              onClick={() => setActiveView(activeView === 'history' ? null : 'history')}
              isActive={activeView === 'history'}
              extraStyles={{ padding: '12px' }}
            />
            <span
              onClick={() => setActiveView(activeView === 'history' ? null : 'history')}
              style={{ fontSize: '0.85em', fontWeight: activeView === 'history' ? '600' : 'normal', color: activeView === 'history' ? 'var(--text-normal)' : 'var(--text-muted)', cursor: 'pointer' }}
            >
              历史数据
            </span>
          </div>
        </div>
      </StyledCard>

      {activeView === 'weekly' && (
        <WeeklyGoalsView entries={currentWeekNotes} />
      )}
      {activeView === 'goals' && (
        <GoalsView
          entries={currentMonthNotes}
          daysInMonth={new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0).getDate()}
        />
      )}
      {activeView === 'stats' && <TrendsView trends={calculateTrends()} />}
      {activeView === 'history' && (
        <HistoricalView
          sortedNotes={sortedNotes}
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
          updateHabit={updateHabit}
          getHabitStatus={getHabitStatus}
          getHabitDuration={getHabitDuration}
          editingTime={editingTime}
          setEditingTime={setEditingTime}
          updateHabitDuration={updateHabitDuration}
          calculateCompletedHabits={calculateCompletedHabits}
        />
      )}
    </div>
  );
}

// Export the dashboard component
return { HabitTrackerDashboard };
