from SofiAI import SofiAI

model = SofiAI()
while True:
    request = input()
    response = model.execute_from_text('play some music')
    print(response)