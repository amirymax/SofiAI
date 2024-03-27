let record = false

function start_stop_recording () {
  const ellipse = document.querySelector('.ellipse-1-DT7')
  record = !record

  if (ellipse.classList.contains('pulse-animation')) {
    ellipse.classList.remove('pulse-animation')
  } else {
    ellipse.classList.add('pulse-animation')
  }
  const request = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ text: 'some text' })
  }

  if (record) {
    fetch('/start_recording', request)
      .then(response => {
        if (!response.ok) {
          console.error(
            'Failed to start recording:',
            response.status,
            response.statusText
          )
        }

        // return response.json()
      })
      .then(data => {
        console.log('Response from server:', data)
      })
      .catch(error => {
        console.error('Error:', error)
      })
  } else {
    fetch('/stop_recording', request)
      .then(response => {
        if (!response.ok) {
          console.error(
            'Failed to stop recording:',
            response.status,
            response.statusText
          )
        }
        // return response.json()
      })
      .then(data => {
        console.log('Response from server:', data)
      })
  }
}
document.addEventListener('DOMContentLoaded', function () {
  // Send a request to the Python backend to start recording
  document.getElementById('text').disabled = false
  fetch('/loaded', { method: 'POST' })
    .then(response => {
      console.log(response)
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

// Commands button function
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

function sendTextToServer (inputText) {
  // Создаем объект запроса
  const request = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ text: inputText })
  }

  fetch('/text-request', request)
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok')
      }
      return response.json()
    })
    .then(data => {
      console.log('Response from server:', data)
      const requestText = '<i>' + data.request + '</i>' + ': <b>' + data.cmd + '</b>'
      if (data.cmd === 'alert') {
        Swal.fire({
          title: 'Привет!',
          text: 'Это сообщение открывается с помощью SweetAlert2.',
          icon: 'success',
          confirmButtonText: 'OK'
        })
      }
      addToTable(requestText)
    })
    .catch(error => {
      console.error('There was a problem with the fetch operation:', error)
    })
}

function addToTable (requestText) {
  const requestsList = document.getElementById('requests-list')
  const tableRow = document.createElement('tr')
  const textCell = document.createElement('td')
  textCell.innerHTML = requestText
  const thumbCell = document.createElement('td')

  // Create thumb up button
  const thumbUpButton = document.createElement('button')
  thumbUpButton.innerHTML = '<i class="fa fa-thumbs-up"></i>'
  thumbUpButton.classList.add('thumbUp')
  thumbUpButton.addEventListener('click', () => {
    gtag('event', 'like', { 'event_category': 'Button', 'event_label': 'Like' })
  })

  // Create thumb down button
  const thumbDownButton = document.createElement('button')
  thumbDownButton.innerHTML = '<i class="fa fa-thumbs-down"></i>'
  thumbDownButton.classList.add('thumbDown')
  thumbDownButton.addEventListener('click', () => {
    gtag('event', 'dislike', { 'event_category': 'Button', 'event_label': 'Dislike' })
  })

  thumbCell.appendChild(thumbUpButton)
  thumbCell.appendChild(thumbDownButton)
  tableRow.appendChild(textCell)
  tableRow.appendChild(thumbCell)

  // Append table row to requests list
  requestsList.appendChild(tableRow)
}

function send () {
  const inputField = document.getElementById('text')
  const requestText = inputField.value + '    '

  sendTextToServer(requestText)

  inputField.value = ''
}
function handleKeyPress (event) {
  if (event.key === 'Enter') {
    send()
  }
}

// экспорт для юнит-тестов
if (typeof module === 'object') {
  module.exports = {
    start_stop_recording,
    log,
    commands,
    handleMicrophone,
    handleRAM
  }
}
