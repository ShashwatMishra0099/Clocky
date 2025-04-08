let hours = 0, minutes = 0, seconds = 0;
let totalSeconds = 0;
let timer;
let isRunning = false;
// Global background mode variable ("default" or "modern")
// Until the user selects, it remains empty.
let backgroundMode = '';
let alarm = document.getElementById('alarmSound');

// Function to set background mode (triggered by the popup buttons)
function setBackground(mode) {
  backgroundMode = mode;
  document.getElementById('backgroundPopup').style.display = 'none';
  const fullscreenTimer = document.getElementById('fullscreen');
  const bgVideo = document.getElementById('bgVideo');
  if (mode === 'modern') {
    fullscreenTimer.classList.add('modern');
    bgVideo.currentTime = 0;
    bgVideo.play();
  } else {
    fullscreenTimer.classList.remove('modern');
    bgVideo.pause();
    bgVideo.currentTime = 0;
  }
}

function adjustTime(unit, amount) {
  if (unit === 'hours') hours = Math.max(0, hours + amount);
  if (unit === 'minutes') minutes = Math.max(0, minutes + amount);
  if (unit === 'seconds') seconds = Math.max(0, seconds + amount);
  updateDisplay();
}

function updateDisplay() {
  document.getElementById('hours').textContent = String(hours).padStart(2, '0');
  document.getElementById('minutes').textContent = String(minutes).padStart(2, '0');
  document.getElementById('seconds').textContent = String(seconds).padStart(2, '0');
}

// Modified startTimer now checks for the background mode selection.
function startTimer() {
  if (isRunning) return;
  // Ensure a background mode has been chosen before starting.
  if (backgroundMode === '') {
    // Do nothing if the user hasn't selected a mode.
    return;
  }
  isRunning = true;
  totalSeconds = hours * 3600 + minutes * 60 + seconds;
  if (totalSeconds <= 0) return;
  
  enterFullScreen();
  document.getElementById('fullscreen').classList.add('active');

  // Play video in modern mode if selected
  if (backgroundMode === 'modern') {
    const bgVideo = document.getElementById('bgVideo');
    // Ensure the video plays from the beginning.
    bgVideo.currentTime = 0;
    bgVideo.play();
  }
  
  document.getElementById('countdown').textContent = formatTime(totalSeconds);
  timer = setInterval(() => {
    if (totalSeconds <= 0) {
      clearInterval(timer);
      isRunning = false;
      showTimeUpScreen();
    } else {
      totalSeconds--;
      document.getElementById('countdown').textContent = formatTime(totalSeconds);
    }
  }, 1000);
}

function stopTimer() {
  clearInterval(timer);
  isRunning = false;
}

function resetTimer() {
  stopTimer();
  hours = 0;
  minutes = 0;
  seconds = 0;
  updateDisplay();
  document.getElementById('fullscreen').classList.remove('active');
  exitFullScreen();
}

function showTimeUpScreen() {
  document.getElementById('fullscreen').classList.remove('active');
  document.getElementById('timeUpScreen').classList.add('active');
  alarm.play();
}

function returnHome() {
  document.getElementById('timeUpScreen').classList.remove('active');
  resetTimer();
  alarm.pause();
  alarm.currentTime = 0;
  exitFullScreen();
}

function formatTime(totalSeconds) {
  let h = Math.floor(totalSeconds / 3600);
  let m = Math.floor((totalSeconds % 3600) / 60);
  let s = totalSeconds % 60;
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}

// Fullscreen Functions
function enterFullScreen() {
  let elem = document.documentElement; // Makes entire page go full-screen
  if (elem.requestFullscreen) {
    elem.requestFullscreen();
  } else if (elem.mozRequestFullScreen) { // Firefox
    elem.mozRequestFullScreen();
  } else if (elem.webkitRequestFullscreen) { // Chrome, Safari, Opera
    elem.webkitRequestFullscreen();
  } else if (elem.msRequestFullscreen) { // IE/Edge
    elem.msRequestFullscreen();
  }
}

function exitFullScreen() {
  if (document.exitFullscreen) {
    document.exitFullscreen();
  } else if (document.mozCancelFullScreen) { // Firefox
    document.mozCancelFullScreen();
  } else if (document.webkitExitFullscreen) { // Chrome, Safari, Opera
    document.webkitExitFullscreen();
  } else if (document.msExitFullscreen) { // IE/Edge
    document.msExitFullscreen();
  }
}

updateDisplay();
