
# SofiAI

**SofiAI** is a sophisticated personal voice assistant designed to provide interactive and intelligent voice-based assistance. It integrates advanced machine learning technologies to deliver responsive and context-aware interactions.

## Features

- **Voice Interaction:** Understands and processes voice commands to perform various actions.
- **Contextual Understanding:** Maintains conversation context to offer relevant responses.
- **Command Recognition:** Recognizes and executes a variety of user commands.

## Technologies Used

- **Programming Language:** Python (3.7+)
- **Libraries:**
  
  - `vosk==0.3.45`
  - `sounddevice==0.4.6`
  - `fuzzywuzzy==0.18.0`
  - `pycaw`
  - `torch==2.1.2`
  - `num2word==1.0.1`
  - `comtypes==1.2.0`
  - `flask==3.0.0`
  - `flask_socketio==5.3.6`
  
## Installation

1. Clone the repository:

    ```bash
    git clone https://github.com/amirymax/SofiAI.git
    cd SofiAI
    ```

2. Install the required dependencies:

    ```bash
    pip install -r requirements.txt
    ```

3. Run the application:

    ```bash
    python app.py
    ```

4. Access the application on your local server at `http://127.0.0.1:5000`.

## Usage

- After launching the application, wait a few seconds for the page to fully load and for the assistant to become responsive.
- Click the `SofiAI` button to activate the voice assistant.
- Use the `Commands` button to view a list of available commands.
- Check the command log by clicking the `Log` button.
- To issue a command, say: `Sofi, [your command] i.e. Open YouTube`.

For support, please contact [Technical Support](https://t.me/aj_corp).

## Contributing

Contributions are welcome! Please submit issues or pull requests to help improve the project.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.
