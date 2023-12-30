from flask import Flask, render_template, request
from SophieAI import SophieAI
from comtypes import CoInitialize, CoUninitialize
CoInitialize()
app = Flask(__name__)
model = SophieAI()


@app.route('/')
def home():
    
    return render_template('index.html')


@app.route('/execute_command', methods=['POST'])
def execute_command():
    if request.method == 'POST':
        command = request.form['command']
        model.execute(command)
        return 'Command executed successfully'


if __name__ == '__main__':
    app.run(debug=True)
CoUninitialize()
