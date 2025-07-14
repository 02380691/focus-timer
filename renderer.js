let currentTimer;
let timerInterval;
let tasks = [];
let alarmPlaying = false;

document.getElementById('setTimerBtn').addEventListener('click', setTimer);//these are buttons
document.getElementById('startBtn').addEventListener('click', startTimer);
document.getElementById('stopBtn').addEventListener('click', stopTimer);
document.getElementById('resetBtn').addEventListener('click', resetTimer);
document.getElementById('addTaskBtn').addEventListener('click', addTask); //but it is a input field
document.getElementById('stopRingBtn').addEventListener('click', stopRing);

function setTimer() { 
  const timerInput = document.getElementById('timerInput').value.trim();
  const validInput = /^(\d+m|\d+s)$/.test(timerInput); // Check if input is in valid format (e.g., 2m or 90s)
  //test method is used with regular expression and it returns boolean val.
  if (!validInput) {  
    alert('Please enter time in the format of "2m" (for minutes) or "90s" (for seconds).');
    return;    
  }
  
  const timeValue = parseInt(timerInput);
  if (timerInput.endsWith('m')) {
    currentTimer = timeValue * 60; // Convert minutes to seconds
  } else if (timerInput.endsWith('s')) {
    currentTimer = timeValue; // Use seconds directly
  }
  
  updateTimerDisplay();
}

function startTimer() {
  if (currentTimer <= 0) {
    alert('Please set a valid timer first.');
    return;
  }
  
  if (timerInterval) { //before starting new timer,we have to clear the previous one
    clearInterval(timerInterval);
  }
  
  timerInterval = setInterval(() => { //it stores the id returned by setInterval
    currentTimer--;
    if (currentTimer < 0) {
      clearInterval(timerInterval);
      if (!alarmPlaying) {
        alarmPlaying = true;
        document.getElementById('stopRingContainer').style.display = 'block';
        alarmSound();
      }
      return;
    }
    updateTimerDisplay();
  }, 1000);
}

function stopTimer() {
  clearInterval(timerInterval);
}
 
function resetTimer() {
  currentTimer = 0;
  clearInterval(timerInterval);
  updateTimerDisplay();
}

function updateTimerDisplay() { 
  const minutes = Math.floor(currentTimer / 60).toString().padStart(2, '0'); //it ensures the string has atleast 2 char by adding a leading 0 if needed.
  const seconds = (currentTimer % 60).toString().padStart(2, '0');
  //85%60=25 this gives the remaining seconds after full minutes
  document.getElementById('currentTimer').textContent = `${minutes}:${seconds}`;
}

function addTask() {
  const taskInput = document.getElementById('taskInput').value.trim();
  if (!taskInput) {
    alert('Please enter a task.');
    return;
  }
  
  const task = {
    name: taskInput,
    time: currentTimer,
    timerInterval: null,
    completed: false
  };
  
  tasks.push(task);
  renderTasks();
  document.getElementById('taskInput').value = '';
}

function renderTasks() {
  const tasksList = document.getElementById('tasks'); //ul tag
  tasksList.innerHTML = '';  
  
  tasks.forEach((task, index) => {
    const taskItem = document.createElement('li');
    
    const taskText = document.createElement('span');
    taskText.textContent = `${task.name} (${formatTime(task.time)})`;
    
    const removeBtn = document.createElement('button');
    removeBtn.textContent = 'Remove';
    removeBtn.addEventListener('click', () => {
      tasks.splice(index, 1);
      renderTasks();
    });
    
    const startBtn = document.createElement('button');
    startBtn.textContent = 'Start';
    startBtn.addEventListener('click', () => {
      if (task.timerInterval) {
        clearInterval(task.timerInterval);
      }
      task.timerInterval = setInterval(() => { //it stores the interval id
        task.time--;
        if (task.time < 0) {
          clearInterval(task.timerInterval);
          taskCompleted(task, taskItem);
          return;
        }
        taskText.textContent = `${task.name} (${formatTime(task.time)})`;
      }, 1000);
    });
    
    const stopBtn = document.createElement('button');
    stopBtn.textContent = 'Stop';
    stopBtn.addEventListener('click', () => {
      clearInterval(task.timerInterval); //it stops the interval started by setInterval
    });
    
    taskItem.appendChild(taskText);
    taskItem.appendChild(removeBtn);
    taskItem.appendChild(startBtn);
    taskItem.appendChild(stopBtn);
    
    tasksList.appendChild(taskItem);
  });
}

function taskCompleted(task, taskItem) {
  taskItem.textContent = `${task.name} (Completed!)`;
  taskItem.style.textDecoration = 'line-through';
  taskItem.style.color = '#999';
  alarmPlaying = true;
  document.getElementById('stopRingContainer').style.display = 'block';
  alarmSound();
}

function stopRing() {
  alarmPlaying = false;
  document.getElementById('stopRingContainer').style.display = 'none';
  const alarm = document.getElementById('alarmSound');
  alarm.pause();
  alarm.currentTime = 0;
}

function alarmSound() {
  const alarm = document.getElementById('alarmSound');
  alarm.play();
}

function formatTime(time) {
  const minutes = Math.floor(time / 60).toString().padStart(2, '0');
  const remainingSeconds = (time % 60).toString().padStart(2, '0');
  return `${minutes}:${remainingSeconds}`;
}
