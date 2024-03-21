let record = false

function start_stop_recording () {
  const ellipse = document.querySelector('.ellipse-1-DT7')
  record = !record

  if (ellipse.classList.contains('pulse-animation')) {
    ellipse.classList.remove('pulse-animation')
  } else {
    ellipse.classList.add('pulse-animation')
  }

  if (record) {
    fetch('/start_recording', { method: 'POST' })
      .then(response => {
        if (!response.ok) {
          console.error(
            'Failed to start recording:',
            response.status,
            response.statusText
          )
        }
      })
      .catch(error => {
        console.error('Error:', error)
      })
  } else {
    fetch('/stop_recording', { method: 'POST' })
  }
}
document.addEventListener('DOMContentLoaded', function () {
  // Send a request to the Python backend to start recording
  fetch('/loaded', { method: 'POST' })
    .then(response => {
      if (!response.ok) {
        console.error(
          'Failed to start recording:',
          response.status,
          response.statusText
        )
      }
    })
    .catch(error => {
      console.error('Error:', error)
    })
})

function handleMicrophone () {
  // Get the element that will display the microphone status
  const microphoneStatusElement = document.getElementById('microphoneStatus')

  // Check if the microphone is available
  navigator.mediaDevices
    .getUserMedia({ audio: true })
    .then(function (stream) {
      // Microphone is available
      microphoneStatusElement.innerText = 'Connected'
    })
    .catch(function (error) {
      // Microphone is not available
      microphoneStatusElement.innerText = 'Not Connected'
    })
}

function handleRAM () {
  const backend_mb = 500 // ram used by backend (python)
  let front_mb = 0
  if (window.performance && window.performance.memory) {
    const memoryUsage = window.performance.memory
    front_mb = memoryUsage.usedJSHeapSize / (1024 * 1024)
  }
  const ramUsing = document.getElementById('ramUsing')
  ramUsing.innerText = '0.' + Math.floor((backend_mb + front_mb) / 100) + ' gb'
}

// Connected or Not connected microphone
document.addEventListener('DOMContentLoaded', handleMicrophone)

// detect memory using
document.addEventListener('DOMContentLoaded', handleRAM)

// Log button function
function log () {
  const logFilePath = 'static/js/log.txt'
  window.open(logFilePath, '_blank')
}

// Commands buttons function
let commandsListVisible = false
function commands () {
  const commandsListContainer = document.getElementById('commandsList')

  const commandsData = [
    { command: 'Sophie, Sonya', description: 'Activate assistant' },
    { command: 'Help', description: 'Get to know about commands' },
    { command: 'Tell a joke', description: 'Tells you a joke' },
    { command: 'Open chrome (or edge)', description: 'Opens the browser' },
    { command: 'Make a note', description: 'Opens notepad to make a note' },
    { command: 'YouTube', description: 'Opens YouTube on browser' },
    { command: 'Time now', description: 'Tells the time' },
    { command: 'Music', description: 'Opens Yandex Music on browser' },
    { command: 'Mute Volume', description: 'Sets volume to 0%' },
    { command: 'Max Volume', description: 'Sets volume to 100%' },
    { command: 'Middle Volume', description: 'Sets volume to 50%' }
  ]

  commandsListContainer.innerHTML = ''

  const ul = document.createElement('ul')
  commandsData.forEach(function (commandData) {
    const li = document.createElement('li')
    li.innerHTML = `<span style="font-style: italic; font-weight: bold;">${commandData.command}:</span> ${commandData.description}`

    ul.appendChild(li)
  })

  commandsListContainer.appendChild(ul)

  commandsListVisible = !commandsListVisible
  commandsListContainer.style.display = commandsListVisible ? 'block' : 'none'
  commandsListContainer.style.display = commandsListVisible ? 'block' : 'none'
  commandsListContainer.style.display = commandsListVisible ? 'block' : 'none'
}

// экспорт для тестов
if (typeof module === 'object') {
  module.exports = {
    start_stop_recording,
    log,
    commands,
    handleMicrophone,
    handleRAM
  }
}
