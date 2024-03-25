from flask import Flask, render_template, request, jsonify
from flask_socketio import SocketIO
from SofiAI import SofiAI
from comtypes import CoInitialize, CoUninitialize
import webbrowser
CoInitialize()

app = Flask(__name__)
socketio = SocketIO(app, cors_allowed_origins='*')
model = SofiAI()


@app.route('/')
def home():
    return render_template('index.html')


@app.route('/loaded', methods=['POST'])
def loaded():
    model.say('Welcome sir')
    return "Page loaded successfully"


@app.route('/start_recording', methods=['POST'])
def start_recording():
    # Add your code to start recording here
    model.listen_commands = True
    request = [1]
    model.listen(request)
    return jsonify({'Listening': 'True'})


@app.route('/stop_recording', methods=['POST'])
def stop_recording():
    model.say('Listening stopped')
    model.listen_commands = False
    return jsonify({'Listening': 'False'})

@app.route('/text-request', methods=['POST'])
def text_request():
    req = request.json['text']    
    response = model.execute_from_text(req)

    return jsonify({'request': response[0],
                    'cmd': response[1]})


started = False
if __name__ == '__main__':
    if not started:
        webbrowser.open('http://127.0.0.1:5000')
        started = True
    app.run()


CoUninitialize()
