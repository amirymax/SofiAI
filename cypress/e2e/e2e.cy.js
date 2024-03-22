describe("Main Page", () => {
  beforeEach(() => {
    cy.visit("/");
  });

  it("should load the main page and check title", () => {
    cy.contains("SofiAI"); // Проверка наличия заголовка на странице
  });

  it("Opens log file in a new tab", () => {
    // Мокаем функцию window.open для проверки, что она вызывается с правильными аргументами
    cy.window().then(win => {
      cy.stub(win, "open").as("openStub");
    });
    cy.get(".log-7S1").click();
    cy.get("@openStub").should("be.calledWith", "static/js/log.txt", "_blank");
  });

  it("Opens commands list on button click", () => {
    // Проверяем, что кнопка "Commands" существует и доступна для нажатия
    cy.get(".commands-dWq").should("exist").click();

    // Проверяем, что контейнер с командами видим
    cy.get("#commandsList").should("be.visible");

    cy.window().then(win => {
      cy.spy(win, "commands").as("commandsSpy");
      cy.get(".commands-dWq").click();
      cy.get("@commandsSpy").should("have.been.calledOnce");
    });
  });

  it("Opens SofiAI on button click with animation", () => {
    // Мокаем функцию window.open для проверки, что она вызывается с правильными аргументами
    cy.window().then(win => {
      cy.stub(win, "open").as("openStub");
    });

    // Нажимаем кнопку "SofiAI"
    cy.get(".sphere-button")
      .should("exist")
      .click({force: true});
    cy.get(".ellipse-1-DT7")
      .should("exist")
      .should("have.class", "pulse-animation");
    cy.wait(5000);
    cy.get(".sphere-button")
      .should("exist")
      .click({force: true});
  });
});
