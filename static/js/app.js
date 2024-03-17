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
      .then((response) => {
        if (!response.ok) {
          console.error(
            'Failed to start recording:',
            response.status,
            response.statusText
          )
        }
      })
      .catch((error) => {
        console.error('Error:', error)
      })
  } else {
    fetch('/stop_recording', { method: 'POST' })
  }
}

document.addEventListener('DOMContentLoaded', function () {
  // Send a request to the Python backend to start recording
  fetch('/loaded', { method: 'POST' })
    .then((response) => {
      if (!response.ok) {
        console.error(
          'Failed to start recording:',
          response.status,
          response.statusText
        )
      }
    })
    .catch((error) => {
      console.error('Error:', error)
    })
})

// Connected or Not connected microphone
document.addEventListener('DOMContentLoaded', function () {
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
})

// detect memory using
document.addEventListener('DOMContentLoaded', function () {
  const backend_mb = 500 // ram used by backend (python)
  let front_mb = 0
  if (window.performance && window.performance.memory) {
    const memoryUsage = window.performance.memory
    front_mb = memoryUsage.usedJSHeapSize / (1024 * 1024)
  }
  const ramUsing = document.getElementById('ramUsing')
  ramUsing.innerText = '0.' + Math.floor((backend_mb + front_mb) / 100) + ' gb'
})

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
    { command: 'Open chrome (edge)', description: 'Opens the browser' },
    { command: 'Make a note', description: 'Opens notepad to make a note' },
    { command: 'Open log', description: 'Take a look at your log' }
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
