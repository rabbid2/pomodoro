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
    let isBreak = (sequencePoint && sequencePoint % 2 !== 0);
    if (sequencePoint === 7) longBreakSeconds = secondsLeft;
    else if (isBreak) shortBreakSeconds = secondsLeft;
    else sessionSeconds = secondsLeft;
  } else {
    sessionSeconds = getMinuts(`.session`) * 1;
    shortBreakSeconds = getMinuts(`.short-break`) * 1;
    longBreakSeconds = getMinuts(`.long-break`) * 1;
  }
  pause = false;
  startPeriod();
}

function stopClock(e) {
  sequencePoint = 0;
  clearInterval(timerID);
  setTime(getMinuts(`.session`));
  setPointMessage(0);
  if (e) document.querySelector(`.start`).addEventListener(`click`, startClock);
}

function pauseClock(e) {
  if (sessionSeconds === -1) return;
  pause = true;
  clearInterval(timerID);
  if (e) document.querySelector(`.start`).addEventListener(`click`, startClock);
}

function startPeriod() {
  if (sequencePoint === 7) start(longBreakSeconds);
  else if (sequencePoint % 2===0) start(sessionSeconds);
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
      clearInterval(timerID);
      showNotification();
      startClock();
      setPointMessage(sequencePoint);
      return;
    }
    seconds--;
    setTime(seconds);
  }, 1000);
}