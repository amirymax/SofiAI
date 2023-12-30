from flask import Flask, render_template, request
from SofiAI import Sofi
from comtypes import CoInitialize, CoUninitialize

app = Flask(__name__)
model = Sofi()


@app.route('/')
def home():
    CoInitialize()
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
