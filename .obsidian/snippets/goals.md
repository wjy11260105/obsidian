```dataviewjs
// Configuration for mesuring daily goals using Frontmatter or inline Metadata from Daily Notes
const goals = [
    {
        targetValue: 250,
        metricName: "Focusmate",
        metricLabel: "Focusmate sessions"
    },
    {
        targetValue: 1500,
        metricName: "Reading",
        metricLabel: "Minutes of Reading"
    },
    {
        targetValue: 1000,
        metricName: "Money",
        metricLabel: "words"
    }
    // Add more goals here as needed
];

const dateConfig = {
    startDate: "2024-12-01",
    endDate: "2024-12-31"
    //getting start date and end date from Montly note using moment.js and templater
};

// Helper Functions
function calculateTotal(dailyNotes, metricName) {
    let total = 0;
    for (let daily of dailyNotes) {
        // Check both frontmatter and inline fields
        const value = daily[metricName] || daily.file.frontmatter[metricName] || 0;
        total += typeof value === 'number' ? value : 0;
    }
    return total;
}

function getProgressMessage(total, target, label, progress) {
    if (progress >= 100) {
        return `You've reached your goal of ${target} ${label}! Current progress: ${total} ${label}`;
    }
    return `Current progress: ${total} out of ${target} ${label}`;
}

function createProgressBar(progress, message) {
    return `<div style="flex: 1; min-width: 200px; padding: 0 10px;">
        <p style="margin: 5px 0; font-size: 0.9em;">${message}</p>
        <progress value="${Math.min(progress, 100)}" max="100" style="width: 100%; height: 20px;"></progress>
        <div style="font-size: 0.9em; margin-top: 5px;">${Math.round(progress)}%</div>
    </div>`;
}

// Get all daily notes within date range
const dailyNotes = dv.pages("#daily")
    .filter(p => p.file.cday >= dv.date(dateConfig.startDate) && p.file.cday <= dv.date(dateConfig.endDate));

// Create HTML for all goals
let allGoalsHtml = '<div style="display: flex; flex-wrap: wrap; gap: 10px; justify-content: center; align-items: start; margin: 20px 0;">';

for (const goal of goals) {
    // Filter notes for this specific metric
    const relevantNotes = dailyNotes.filter(p => p[goal.metricName] !== undefined || p.file.frontmatter[goal.metricName] !== undefined);
    
    // Calculate progress
    const total = calculateTotal(relevantNotes, goal.metricName);
    const progress = (total / goal.targetValue) * 100;
    
    // Create message and progress bar
    const message = getProgressMessage(total, goal.targetValue, goal.metricLabel, progress);
    allGoalsHtml += createProgressBar(progress, message);
}

allGoalsHtml += '</div>';

// Render all progress bars
dv.span(allGoalsHtml);
```