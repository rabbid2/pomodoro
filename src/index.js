let timerID = 0;
let sequencePoint = 0;
let secondsLeft = 0;
let pause = false;

createTimerInterface();

let sessionSeconds = -1;
let shortBreakSeconds = -1;
let longBreakSeconds = -1;

function startClock(e) {
  if (e) document.querySelector(`.start`).removeEventListener(`click`, startClock);
  if (pause) {
    togglePauseColor();
    let isBreak = (sequencePoint && sequencePoint % 2 !== 0);
    if (sequencePoint === 7) longBreakSeconds = secondsLeft;
    else if (isBreak) shortBreakSeconds = secondsLeft;
    else sessionSeconds = secondsLeft;
  } else getInput();
  pause = false;
  startPeriod();
}

function stopClock(e) {
  sequencePoint = 0;
  clearInterval(timerID);
  setTime(getMinuts(`.session`) * 60);
  setPointMessage(0);
  pause = true;
  togglePauseColor();
  pause = false;
  if (e) document.querySelector(`.start`).addEventListener(`click`, startClock);
}

function pauseClock(e) {
  if (sessionSeconds === -1) return;
  if (!pause) togglePauseColor();
  pause = true;
  clearInterval(timerID);
  document.querySelector(`.start`).addEventListener(`click`, startClock);
}

function startPeriod() {
  if (sequencePoint === 7) start(longBreakSeconds);
  else if (sequencePoint % 2 === 0) start(sessionSeconds);
  else start(shortBreakSeconds);
}

function start(seconds) {
  setTime(seconds);
  timerID = setInterval(function updateTime() {
    if (seconds === 0) {
      if (sequencePoint === 7) {
        sequencePoint = 0;
        stopClock();
      } else sequencePoint++;
      goToNextPeriod();
      return;
    }
    seconds--;
    setTime(seconds);
  }, 1000);
}

function goToNextPeriod() {
  clearInterval(timerID);
  pauseClock();
  playSound();
  let answer = false;
  if (sequencePoint % 2 === 0) answer = confirm(`Go session?`);
  else answer = confirm(`Go break?`);
  stopSound();
  setNextPeriod();
  if (answer) startClock();
}

function setNextPeriod(){
  getInput();
  let isBreak = (sequencePoint && sequencePoint % 2 !== 0);
  if (sequencePoint === 7) secondsLeft = longBreakSeconds;
  else if (isBreak) secondsLeft = shortBreakSeconds;
  else secondsLeft = sessionSeconds;
  setTime(secondsLeft);
  setPointMessage(sequencePoint);
}