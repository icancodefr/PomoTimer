// Timer variables
let studyTime = { hours: 0, minutes: 25, seconds: 0 };
let breakTime = { hours: 0, minutes: 5, seconds: 0 };
let isStudy = true;
let isConfig = false;
let timerInterval = null;
let remainingTime = convertToSeconds(studyTime);

// DOM Elements
const timerDisplay = document.getElementById('timer');
const modeDisplay = document.getElementById('mode');
const configIndicator = document.getElementById('config-indicator');
const configArea = document.getElementById('config-area');

// Convert time object to seconds
function convertToSeconds(time) {
  return (time.hours * 3600) + (time.minutes * 60) + time.seconds;
}

// Convert seconds to time object
function convertToTime(seconds) {
  return {
    hours: Math.floor(seconds / 3600),
    minutes: Math.floor((seconds % 3600) / 60),
    seconds: seconds % 60
  };
}

// Update the timer display
function updateTimerDisplay() {
  const time = convertToTime(remainingTime);
  timerDisplay.textContent = `${String(time.hours).padStart(2, '0')}:${String(time.minutes).padStart(2, '0')}:${String(time.seconds).padStart(2, '0')}`;
}

// Start or stop the timer
function toggleTimer() {
  if (timerInterval) {
    clearInterval(timerInterval);
    timerInterval = null;
  } else {
    startTimer();
  }
}

// Start the timer countdown
function startTimer() {
  timerInterval = setInterval(() => {
    if (remainingTime > 0) {
      remainingTime--;
      updateTimerDisplay();
    } else {
      clearInterval(timerInterval);
      timerInterval = null;
      isStudy = !isStudy;
      switchMode();
      remainingTime = isStudy ? convertToSeconds(studyTime) : convertToSeconds(breakTime);
      updateTimerDisplay();
      startTimer(); // Restart the timer in the new mode
    }
  }, 1000);
}

// Reset the timer
function resetTimer() {
  clearInterval(timerInterval);
  timerInterval = null;
  remainingTime = isStudy ? convertToSeconds(studyTime) : convertToSeconds(breakTime);
  updateTimerDisplay();
}

// Enter/Exit Config mode
function toggleConfig() {
  isConfig = !isConfig;
  if (isConfig) {
    configArea.style.display = 'flex';
    configIndicator.textContent = "Config Mode: Use ↑/↓ to Adjust Time, 'S' to Exit";
    configIndicator.classList.add('config-active');
  } else {
    configArea.style.display = 'none';
    configIndicator.textContent = "";
    configIndicator.classList.remove('config-active');
    updateConfigTimes(); // Update config times from inputs
  }
}

// Update the config times from input fields
function updateConfigTimes() {
  studyTime = {
    hours: parseInt(document.getElementById('study-hours').value) || 0,
    minutes: parseInt(document.getElementById('study-minutes').value) || 0,
    seconds: parseInt(document.getElementById('study-seconds').value) || 0
  };
  breakTime = {
    hours: parseInt(document.getElementById('break-hours').value) || 0,
    minutes: parseInt(document.getElementById('break-minutes').value) || 0,
    seconds: parseInt(document.getElementById('break-seconds').value) || 0
  };
}

// Event listeners
document.addEventListener('keydown', (e) => {
  if (e.key === 's') toggleConfig();
  if (e.key === 'r') resetTimer();
  if (e.key === 'Enter' || e.key === ' ') toggleTimer();
  if (e.key === 'ArrowUp') adjustTime('up');
  if (e.key === 'ArrowDown') adjustTime('down');
});

// Adjust the time values
function adjustTime(direction) {
  if (!isConfig) return;
  const adjustment = direction === 'up' ? 1 : -1;

  if (isStudy) {
    studyTime = adjustField(studyTime, adjustment);
  } else {
    breakTime = adjustField(breakTime, adjustment);
  }
  updateConfigInputs();
}

// Adjust a time field (hours, minutes, seconds)
function adjustField(time, adjustment) {
  time.seconds += adjustment;
  if (time.seconds < 0) {
    time.seconds = 59;
    time.minutes--;
  } else if (time.seconds > 59) {
    time.seconds = 0;
    time.minutes++;
  }

  if (time.minutes < 0) {
    time.minutes = 59;
    time.hours--;
  } else if (time.minutes > 59) {
    time.minutes = 0;
    time.hours++;
  }

  if (time.hours < 0) {
    time.hours = 0;
  } else if (time.hours > 23) {
    time.hours = 23;
  }

  return time;
}

// Update config input fields with current values
function updateConfigInputs() {
  document.getElementById('study-hours').value = studyTime.hours;
  document.getElementById('study-minutes').value = studyTime.minutes;
  document.getElementById('study-seconds').value = studyTime.seconds;
  document.getElementById('break-hours').value = breakTime.hours;
  document.getElementById('break-minutes').value = breakTime.minutes;
  document.getElementById('break-seconds').value = breakTime.seconds;
}

// Switch between study and break mode
function switchMode() {
  modeDisplay.textContent = isStudy ? "Study" : "Break";
}

// Initialize timer display
updateTimerDisplay();