import g4f
from undetected_chromedriver import Chrome, ChromeOptions
from g4f.Provider import (
    Bard,
    Poe,
    AItianhuSpace,
    MyShell,
    PerplexityAi,
)

options = ChromeOptions()
options.add_argument("--incognito");
webdriver = Chrome(options=options, headless=True)
for idx in range(10):
    response = g4f.ChatCompletion.create(
        model=g4f.models.default,
        provider=g4f.Provider.MyShell,
        messages=[{"role": "user", "content": "Suggest me a name."}],
        webdriver=webdriver
    )
    print(f"{idx}:", response)
webdriver.quit()