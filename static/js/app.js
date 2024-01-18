document.addEventListener('DOMContentLoaded', function () {
    // Get the element that will display the microphone status
    var microphoneStatusElement = document.getElementById('microphoneStatus');

    // Check if the microphone is available
    navigator.mediaDevices.getUserMedia({ audio: true })
      .then(function (stream) {
        // Microphone is available
        microphoneStatusElement.innerText = 'Connected';
      })
      .catch(function (error) {
        // Microphone is not available
        microphoneStatusElement.innerText = 'Not Connected';
      });
  });

function log() {
    var logFilePath = 'static/js/log.txt';
    window.open(logFilePath, '_blank');
}

var commandsListVisible = false;
function commands() {
  var commandsListContainer = document.getElementById('commandsList');

     var commandsData = [
        { command: 'Sophie, Sonya', description: 'Activate assistant' },
        { command: 'Help', description: 'Get to know about commands' },
        { command: 'Tell a joke', description: 'Tells you a joke' },
        { command: 'Open chrome (edge)', description: 'Opens the browser' },
        { command: 'Make a note', description: 'Opens notepad to make a note' },
        { command: 'Open log', description: 'Take a look at your log' }
    ];


    commandsListContainer.innerHTML = '';


    var ul = document.createElement('ul');
    commandsData.forEach(function (commandData) {
        var li = document.createElement('li');
        li.innerHTML = `<span style="font-style: italic; font-weight: bold;">${commandData.command}:</span> ${commandData.description}`;

        ul.appendChild(li);
    });

    commandsListContainer.appendChild(ul);

    commandsListVisible = !commandsListVisible;
    commandsListContainer.style.display = commandsListVisible ? 'block' : 'none';


}