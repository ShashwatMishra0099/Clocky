// Background Selection Functionality
document.addEventListener('DOMContentLoaded', () => {
  // Check if a background was previously selected and apply it
  const savedBg = localStorage.getItem('selectedBackground');
  if (savedBg) {
    document.body.classList.remove('bg-gradient-purple', 'bg-gradient-blue', 'bg-gradient-red', 'bg-gradient-green', 'bg-gradient-grey');
    document.body.classList.add(savedBg);
  } else {
    // No selection found; show the modal popup
    document.getElementById('bgModal').style.display = 'flex';
  }

  // Add click listeners for background option buttons
  const bgOptions = document.querySelectorAll('.bg-option');
  bgOptions.forEach(option => {
    option.addEventListener('click', () => {
      const bgClass = option.getAttribute('data-bg');
      // Remove any previous background classes and apply the selected one
      document.body.classList.remove('bg-gradient-purple', 'bg-gradient-blue', 'bg-gradient-red', 'bg-gradient-green', 'bg-gradient-grey');
      document.body.classList.add(bgClass);
      // Save the selection so the modal doesn't show again
      localStorage.setItem('selectedBackground', bgClass);
      // Hide the modal
      document.getElementById('bgModal').style.display = 'none';
    });
  });
});

// Timer and Fullscreen Code
let hours = 0, minutes = 0, seconds = 0;
let totalSeconds = 0;
let timer;
let isRunning = false;
let alarm = document.getElementById('alarmSound');

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

function startTimer() {
  if (isRunning) return;
  isRunning = true;

  totalSeconds = hours * 3600 + minutes * 60 + seconds;
  if (totalSeconds <= 0) return;

  enterFullScreen();
  document.getElementById('fullscreen').classList.add('active');
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
  let elem = document.documentElement;
  if (elem.requestFullscreen) {
    elem.requestFullscreen();
  } else if (elem.mozRequestFullScreen) {
    elem.mozRequestFullScreen();
  } else if (elem.webkitRequestFullscreen) {
    elem.webkitRequestFullscreen();
  } else if (elem.msRequestFullscreen) {
    elem.msRequestFullscreen();
  }
}

function exitFullScreen() {
  if (document.exitFullscreen) {
    document.exitFullscreen();
  } else if (document.mozCancelFullScreen) {
    document.mozCancelFullScreen();
  } else if (document.webkitExitFullscreen) {
    document.webkitExitFullscreen();
  } else if (document.msExitFullscreen) {
    document.msExitFullscreen();
  }
}

updateDisplay();
