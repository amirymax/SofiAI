import vosk
import sys
import sounddevice as sd
import queue
import json
import config
from fuzzywuzzy import fuzz
import torch
import time
import os
from random import choice
import num2word
from ctypes import cast, POINTER
from comtypes import CLSCTX_ALL
from pycaw.pycaw import AudioUtilities, IAudioEndpointVolume


class Sofi:
    def __init__(self) -> None:

        self.torch_model, _ = torch.hub.load(repo_or_dir='snakers4/silero-models',
                                             model='silero_tts',
                                             language='en',
                                             speaker='v3_en')
        self.torch_model.to(torch.device('cpu'))

        self.vosk_model = vosk.Model(
            "C:\\Users\\Sofia\\Desktop\\ITMO\\Web-Apps Developing 3-1\\SofiAI\\backend\\model-small")
        self.log = open('log.txt', 'a')

    def listen(self) -> None:
        self.say('I am listening to you sir. What did you want?')
        q = queue.Queue()
        samplerate = 16000
        device = 1

        def q_callback(indata, frames, time, status):
            if status:
                print(status, file=sys.stderr)
            q.put(bytes(indata))

        def recognize_cmd(cmd: str):
            rc = {'cmd': '', 'percent': 0}
            for c, v in config.VA_CMD_LIST.items():

                for x in v:
                    vrt = fuzz.ratio(cmd, x)
                    if vrt > rc['percent']:
                        rc['cmd'] = c
                        rc['percent'] = vrt

            return rc

        def filter_cmd(raw_voice: str):
            cmd = raw_voice

            for x in config.VA_ALIAS:
                cmd = cmd.replace(x, "").strip()

            for x in config.VA_TBR:
                cmd = cmd.replace(x, "").strip()
            print(f'CMD: {cmd}')
            self.log.write(cmd + ' : ')
            return cmd
        with sd.RawInputStream(samplerate=samplerate, blocksize=8000, device=device, dtype='int16',
                               channels=1, callback=q_callback):

            rec = vosk.KaldiRecognizer(self.vosk_model, samplerate)
            while True:
                data = q.get()
                if rec.AcceptWaveform(data):
                    voice = json.loads(rec.Result())["text"]
                    print(f'Voice: {voice}')
                    if voice.startswith(config.VA_ALIAS):
                        # обращаются к ассистенту
                        cmd = recognize_cmd(filter_cmd(voice))
                        print(cmd)
                        self.log.write(cmd['cmd'] + '\n')
                        if cmd['cmd'] not in config.VA_CMD_LIST.keys():
                            self.say("What?")
                        else:
                            self.execute(cmd['cmd'])

    def say(self, what: str):
        sample_rate = 48000
        audio = self.torch_model.apply_tts(text=what+"..",
                                           speaker="en_5",
                                           sample_rate=sample_rate,
                                           put_accent=True,
                                           put_yo=True)

        sd.play(audio, sample_rate * 1.05)
        time.sleep((len(audio) / sample_rate) + 0.5)
        sd.stop()

    def execute(self, cmd: str) -> None:
        if cmd == 'help':
            # help
            text = 'I can: ...'
            text += 'tell the time...'
            text += 'tell a joke...'
            text += 'open notepad...'
            text += 'and open browser'
            self.say(text)

        elif cmd == 'thanks':
            # thanks
            text = 'You are welcome, Sir.'
            text += 'I am always glad to help you'
            self.say(text)

        elif cmd == 'ctime':
            # time
            from datetime import datetime
            import num2word
            now = datetime.now()
            text = f"It's {num2word.word(now.hour)} {num2word.word(now.minute)} now."
            self.say(text)

        elif cmd == 'joke':
            from random import choice
            jokes = ['There are ten kinds of people in the world. Those who understand binary and those who don’t.',
                     'How do progammers laugh? ... exe exeexe',
                     'Knock, knock. Who’s There? Very long pause… “Java.”',
                     'Programming is 10% writing code and nineteen percent understanding why it’s not working']

            self.say(choice(jokes))

        elif cmd == 'chrome':

            self.say('Processing sir...')
            terminal_output = os.system('start chrome')

            if not terminal_output:
                self.say('Chrome opened successfully')
            else:
                self.say(
                    'Chrome browser is not found on your computer. Try another brower.')

        elif cmd == 'edge':
            self.say('Processing sir...')
            terminal_output = os.system('start msedge')

            if not terminal_output:
                self.say('Edge opened successfully')
            else:
                self.say(
                    'Edge browser is not found on your computer. Try another brower.')

        elif cmd == 'note':
            self.say('Pocessing sir...')
            terminal_output = os.system('start notepad')
            if not terminal_output:
                self.say('Here is Notepad!')
            else:
                self.say('There was an error while processing. Please try again!')

        elif cmd == 'log':
            self.say('Processing sir...')
            self.log.close()
            terminal_output = os.system('start log.txt')
            if not terminal_output:
                self.say("Command's log opened successfully")
                self.log = open('log.txt', 'a')
            else:
                self.say('There was an error while processing. Please try again!')

        elif cmd == 'word':
            self.say('Processing sir...')
            terminal_output = os.system('start winword')
            if not terminal_output:
                self.say('Microsoft Word opened successfully.')
            else:
                self.say(
                    'The program wasn\'t found in your computer. Try to use online version.')

        elif cmd == 'excel':
            self.say('Processing sir...')
            terminal_output = os.system('start excel')
            if not terminal_output:
                self.say('Microsoft Excel opened successfully.')
            else:
                self.say(
                    'The program wasn\'t found in your computer. Try to use online version.')

        elif cmd == 'increase volume':
            self.increase_volume()

        elif cmd == 'decrease volume':
            self.decrease_volume()

        elif cmd == 'middle volume':
            self.middle_volume()
        
        elif cmd == 'max volume':
            self.max_volume()
        
        elif cmd == 'mute volume':
            self.mute_volume()

    def open(self, program_name) -> None:
        pass

    def increase_volume(self) -> None:
        self.set_volume('+')

    def decrease_volume(self) -> None:
        self.set_volume('-')

    def middle_volume(self) -> None:
        self.set_volume('=')

    def max_volume(self) -> None:
        self.set_volume('max')

    def mute_volume(self) -> None:
        self.set_volume('mute')

    def set_volume(self, degree: str) -> None:
        current_volume = self.get_volume()
        if degree == '+':
            if current_volume == 1:
                self.say('Volume is already at it\'s highest sir.')
                return
            else:
                current_volume += 0.1
                current_volume = min(current_volume, 1)
        elif degree == '-':
            if current_volume == 0:               
                return
            else:
                current_volume -= 0.1
                current_volume = max(current_volume, 0)
        elif degree == '=':
            current_volume = 0.5
        elif degree == 'max':
            current_volume = 1.0
        elif degree == 'mute':
            current_volume = 0
        volume_control = self.get_volume_control()
        volume_control.SetMasterVolumeLevelScalar(current_volume, None)
        text = f'Volume set to {num2word.word(int(current_volume * 100))} percent.'
        self.say(text)

    def get_volume(self):
        volume_control = self.get_volume_control()
        return volume_control.GetMasterVolumeLevelScalar()

    def get_volume_control(self):
        devices = AudioUtilities.GetSpeakers()
        interface = devices.Activate(
            IAudioEndpointVolume._iid_, CLSCTX_ALL, None)
        volume_control = cast(interface, POINTER(IAudioEndpointVolume))
        return volume_control

    def google(self, request) -> None:
        pass

    def restart_pc(self) -> None:
        pass

    def turn_off_pc(self) -> None:
        pass

    def talk(self) -> None:
        pass
