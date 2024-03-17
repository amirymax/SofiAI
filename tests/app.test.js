const {
  start_stop_recording,
  log,
  commands,
  handleMicrophone,
  handleRAM
} = require("../static/js/app");

describe("start_stop_recording function", () => {
  test("should toggle pulse-animation class", () => {
    // Создаем элемент для теста
    global.fetch = jest.fn(() => Promise.resolve({ ok: true })); // мок fetch
    const ellipse = document.createElement("div");
    ellipse.classList.add("ellipse-1-DT7");
    document.body.appendChild(ellipse);

    // Предполагаем, что класс pulse-animation не установлен
    expect(ellipse.classList.contains("pulse-animation")).toBeFalsy();

    // Вызываем функцию и проверяем, что класс установлен
    start_stop_recording();
    expect(ellipse.classList.contains("pulse-animation")).toBeTruthy();

    // Вызываем функцию снова и проверяем, что класс удален
    start_stop_recording();
    expect(ellipse.classList.contains("pulse-animation")).toBeFalsy();
  });
});

describe("log function", () => {
  test("should open log file in a new window", () => {
    window.open = jest.fn(); // Mock функции window.open

    log();

    expect(window.open).toHaveBeenCalledWith("static/js/log.txt", "_blank");
  });
});

describe("commands function", () => {
  test("should toggle commands list visibility", () => {
    const commandsListContainer = document.createElement("div");
    commandsListContainer.id = "commandsList";
    document.body.appendChild(commandsListContainer);

    const initialDisplay = commandsListContainer.style.display;

    commands();

    expect(commandsListContainer.style.display).not.toBe(initialDisplay);

    commands(); // Toggle visibility again

    expect(commandsListContainer.style.display).toBe("none");
  });
});


const mockGetUserMedia = jest.fn(() => Promise.resolve());

// Создаем глобальный объект navigator.mediaDevices с мокированной функцией getUserMedia
global.navigator.mediaDevices = {
  getUserMedia: mockGetUserMedia
};

describe("DOMContentLoaded event handlers", () => {
  // Тест для обработчика события DOMContentLoaded, проверяющий доступность микрофона
  test("handleDOMContentLoadedMicrophone should update microphone status element", () => {
    // Создаем элемент микрофона для тестирования
    const microphoneStatusElement = document.createElement("span");
    microphoneStatusElement.id = "microphoneStatus";
    document.body.appendChild(microphoneStatusElement);

    // Имитируем вызов обработчика события DOMContentLoaded
    handleMicrophone();

   
    setTimeout(() => {
        // Проверяем, что текст элемента микрофона обновлен
        expect(microphoneStatusElement.innerText).toMatch(/Connected|Not Connected/);
      }, 100);
  });

  // Тест для обработчика события DOMContentLoaded, проверяющий обновление использования памяти
  test("handleDOMContentLoadedMemory should update RAM usage element", () => {
    // Создаем элемент для отображения использования памяти
    const ramUsingElement = document.createElement("div");
    ramUsingElement.id = "ramUsing";
    document.body.appendChild(ramUsingElement);

    // Имитируем вызов обработчика события DOMContentLoaded
    handleRAM();

    // Ожидаем, что текст элемента обновлен в соответствии с использованием памяти
    // Проверяем, что текст соответствует формату "0.* gb", где * - число
    expect(ramUsingElement.innerText).toMatch(/0\.\d+ gb/);
  });
});
