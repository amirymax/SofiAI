from flask import Flask, render_template
from flask_socketio import SocketIO
from SophieAI import SophieAI
from comtypes import CoInitialize, CoUninitialize

CoInitialize()

app = Flask(__name__)
socketio = SocketIO(app, cors_allowed_origins='*')
model = SophieAI()


@app.route('/')
def home():    
    return render_template('index.html')

@app.route('/loaded', methods = ['POST'])
def loaded():
    model.say('Welcome sir')
    return "Page loaded successfully"

@app.route('/start_recording', methods=['POST'])
def start_recording():
    # Add your code to start recording here
    model.listen_commands = True
    model.listen()
    return 'Listening started', 200

@app.route('/stop_recording', methods=['POST'])
def stop_recording():
    model.say('Listening stopped')
    model.listen_commands = False
    return 'Listening stopped', 200

if __name__ == '__main__':
    app.run(debug=True)

CoUninitialize()
