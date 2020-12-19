"use strict";

class Todo {
  constructor(form, input, todoList, rodoCompleted, todoContainer) {
    this.form = document.querySelector(form);
    this.input = document.querySelector(input);
    this.todoList = document.querySelector(todoList);
    this.todoContainer = document.querySelector(todoContainer);
    this.todoCompleted = document.querySelector(rodoCompleted);
    this.todoData = new Map(JSON.parse(localStorage.getItem("toDoList")));
  }

  addToStorage() {
    localStorage.setItem("toDoList", JSON.stringify([...this.todoData]));
  }

  render() {
    this.todoList.textContent = "";
    this.todoCompleted.textContent = "";
    this.todoData.forEach(this.createItem, this);
    this.addToStorage();
  }
  createItem(todo) {
    const li = document.createElement("li");
    li.classList.add("todo-item");
    li.key = todo.key;
    li.insertAdjacentHTML(
      "beforeend",
      `<span class="text-todo">${todo.value} </span>
      <div class="todo-buttons">
        <button class="todo-edit"></button>
				<button class="todo-remove"></button>
				<button class="todo-complete"></button>
      </div>`
    );

    if (todo.comleted) {
      this.todoCompleted.append(li);
    } else {
      this.todoList.append(li);
    }
  }

  addTodo(e) {
    e.preventDefault();
    if (this.input.value.trim()) {
      const newTodo = {
        value: this.input.value,
        comleted: false,
        key: this.generateKey(),
      };
      this.todoData.set(newTodo.key, newTodo);
      this.input.value = "";
      this.render();
    } else {
      this.input.value = "";
      alert("Пустое дело добавить нельзя!");
      this.input.setAttribute("required", "");
    }
  }

  generateKey() {
    return (
      Math.random().toString(36).substring(2, 15) +
      Math.random().toString(36).substring(2, 15)
    );
  }
  animate(elem){
    let op = 1;
    elem.style.opacity = op;
    const timer = setInterval(() => {
      if (op <= 0.1) {
        clearInterval(timer);
        elem.style.display = "none";
      }
      elem.style.opacity = op;
      op -= op * 0.1;
    }, 20);
    setTimeout(this.render.bind(this), 400);
  }
  deleteItem(target) {
    let li = target.closest(".todo-item");
    this.todoData.forEach((todo) => {
      if (li.key === todo.key) {
        this.todoData.delete(todo.key);
      }
    });
    this.animate(li);
  }

  comletedItem(target) {
    let li = target.closest(".todo-item");
    this.todoData.forEach((todo) => {
      if (li.key === todo.key) {
        if (todo.comleted) {
          todo.comleted = false;
        } else {
          todo.comleted = true;
        }
      }
    });
    this.animate(li);
  }

  editItem(target) {
    let li = target.closest(".todo-item"),
      text = li.firstChild;
    text.contentEditable = "true";
    text.focus();

    text.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        e.preventDefault();
        if (!text.textContent.trim()) {
          text.textContent = "Без названия";
        }
        text.contentEditable = "false";
        this.todoData.forEach((todo) => {
          if (li.key === todo.key) {
            todo.value = text.textContent;
          }
        });
        this.render();
      }
    });
    text.addEventListener("blur", () => {
      if (!text.textContent.trim()) {
        text.textContent = "Без названия";
      }
      text.contentEditable = "false";
      this.todoData.forEach((todo) => {
        if (li.key === todo.key) {
          todo.value = text.textContent;
        }
      });
      this.render();
    });

    
  }

  handler(e) {
    const target = e.target;
    if (target.matches(".todo-remove")) {
      this.deleteItem(target);
    } else if (target.matches(".todo-complete")) {
      this.comletedItem(target);
    } else if (target.matches(".todo-edit")) {
      this.editItem(target);
    }
  }

  init() {
    this.form.addEventListener("submit", this.addTodo.bind(this));
    this.todoContainer.addEventListener("click", this.handler.bind(this));
    this.render();
  }
}

const todo = new Todo(
  ".todo-control",
  ".header-input",
  ".todo-list",
  ".todo-completed",
  ".todo-container"
);

todo.init();
