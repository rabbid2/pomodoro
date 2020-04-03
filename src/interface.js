let sessionStartTime = 25;
let shortBreakStartTime = 5;
let longBreakStartTime = 20;

function createTimerInterface() {
  createTimeInput(document.querySelector(`.session`), sessionStartTime);
  createTimeInput(document.querySelector(`.long-break`), longBreakStartTime);
  createTimeInput(document.querySelector(`.short-break`), shortBreakStartTime);
  createElement(`div`, `.display`, ``, `time`);
  createElement(`div`, `.display`, ``, `message`);
  createElement(`div`, `.message`, `long break`, `prev-point`);
  createElement(`div`, `.message`, `session`, `current-point`);
  createElement(`div`, `.message`, `short break`, `next-point`);
  let startButton = createElement(`button`, `.buttons`, `<img src = 'img/start.png' alt = '^'></img>`, `start`);
  let pauseButton = createElement(`button`, `.buttons`, `<img src = 'img/pause.png' alt = '^'></img>`, `pause`);
  let stopButton = createElement(`button`, `.buttons`, `<img src = 'img/stop.png' alt = '^'></img>`, `stop`);
  startButton.addEventListener(`click`, startClock);
  stopButton.addEventListener(`click`, stopClock);
  pauseButton.addEventListener(`click`, pauseClock);
  setTime(sessionStartTime * 60);
}

function createTimeInput(parent, startTime) {
  let minuts = startTime;
  let step = 38;
  let wrapper = document.createElement(`div`);
  wrapper.classList.add(`wrapper`);
  parent.appendChild(wrapper);
  createName();
  createNumbers();
  createArrows();
  addWheelEvent(wrapper);
  
  function addWheelEvent(elem) {
    let event = `onmousewheel`;
    if (elem.addEventListener) {
      if (`onwheel` in document) {
        event = `wheel`;
      } else if (`onmousewheel` in document) {
        event = `mousewheel`;
      } else {
        event = `MozMousePixelScroll`;
      }
    }
    elem.addEventListener(event, onWheel);
  }

  function onWheel(e) {
    e = e || window.event;
    let delta = e.deltaY || e.detail || e.wheelDelta;
    shift(delta, this);
    e.preventDefault ? e.preventDefault() : (e.returnValue = false);
  }

  function shift(delta, wrapper){
    wrapper.childNodes[minuts + 2].classList.remove(`selected-value`);
    (delta > 0) ? minuts++ : minuts--;
    if (minuts === -2) minuts = 59;
    if (minuts === 60 && delta > 0) minuts = -1;
    wrapper.childNodes[minuts + 2].classList.add(`selected-value`);
    wrapper.style.transform = `translateY(${-(minuts + 1) * step}px)`;
  }

  function createNumbers(parent) {
    for (let i = -2; i <= 60; i++) {
      let number = document.createElement(`div`);
      number.classList.add(`number`);
      if (i < 0) number.innerHTML = i + 61;
      else number.innerHTML = i;
      wrapper.appendChild(number);
    }
    wrapper.style.transform = `translateY(${-(minuts + 1) * step}px)`;
    wrapper.childNodes[minuts + 2].classList.add(`selected-value`);
  }

  function createArrows() {
    createArrow(`<img src ='img/arrow-up.png' alt = '^'></img>`, `up-arrow`, moveUp);
    createArrow(`<img src = 'img/arrow-down.png' alt = 'v'>`, `down-arrow`, moveDown);
  }
  
  function createArrow(html, className, f) {
    let arrow = document.createElement(`button`);
    arrow.innerHTML = html;
    arrow.classList.add(className);
    arrow.addEventListener(`click`, f);
    parent.appendChild(arrow);
  }

  function moveUp(e) {
    let delta = -1;
    shift(delta, wrapper);
  }

  function moveDown(e) {
    let delta = 1;
    shift(delta, wrapper);
  }

  function createName() {
    let name = document.createElement(`div`);
    name.classList.add(`name-time-input`);
    if (parent.classList.contains(`session`)) name.textContent = `session`;
    else if (parent.classList.contains(`short-break`)) name.textContent = `short break`;
    else name.textContent = `long break`;
    parent.appendChild(name);
  }
}

function createElement(tag, parentSelector, html, className) {
  let parent = document.querySelector(parentSelector);
  let element = document.createElement(tag);
  element.innerHTML = html;
  element.classList.add(className);
  parent.appendChild(element);
  return element;
}

function setTime(seconds) {
  secondsLeft = seconds;
  let minuts = Math.floor(seconds / 60);
  seconds = seconds % 60;
  let timeString = `${paddedNumber(minuts)}:${paddedNumber(seconds)}`;
  document.querySelector(`.time`).textContent = timeString;
  document.querySelector(`title`).textContent = timeString;
}

function setPointMessage(sequencePoint) {
    let item1 = document.querySelector(`.prev-point`);
    let item2 = document.querySelector(`.current-point`);
    let item3 = document.querySelector(`.next-point`);

    if (sequencePoint === 0) {
      item1.textContent = `long break`;
      item2.textContent= `session`;
      item3.textContent = `short break`;
    } else {
      let nextPoint = ``;
      if (sequencePoint === 6) nextPoint = `long break`;
      else if (sequencePoint % 2 === 0) nextPoint = `short break`;
      else nextPoint = `session`;
      item1.textContent = item2.textContent;
      item2.textContent = item3.textContent;
      item3.textContent = nextPoint;
    }
    togglePeriodColor(item2);
    togglePeriodColor(document.querySelector(`.time`));
}

function paddedNumber(number) {
  if (number < 10) return `0${number}`;
  else return number.toString();
}

function getInput(){
  sessionSeconds = getMinuts(`.session`) * 60;
  shortBreakSeconds = getMinuts(`.short-break`) * 60;
  longBreakSeconds = getMinuts(`.long-break`) * 60;
}

function getMinuts(parent) {
  return document.querySelector(parent).querySelector(`.selected-value`).textContent;
}

function playSound() {
  let audio = document.querySelector(`audio`);
  audio.volume = 0.1;
  audio.currentTime = 0;
  audio.play();
}

function stopSound() {
  let audio = document.querySelector(`audio`);
  audio.pause();
}

function togglePeriodColor(element) {
  if (sequencePoint % 2 === 0) element.style.color = `#fe2200`;
  else element.style.color = `#193e26`;
}

function togglePauseColor(){
  let pauseEl = document.querySelector(`.pause`);
  if (pause) pauseEl.style.backgroundColor = `#ff886e`;
  else pauseEl.style.backgroundColor = `#fe2200`;
}