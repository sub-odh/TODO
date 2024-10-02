const todoForm = document.querySelector("form");
const todoInput = document.getElementById("todo-input");
const todoListUL = document.getElementById("todo-list");
const allTask = document.getElementById("all-task");
const completedTask = document.getElementById("completed-task");
const remainingTask = document.getElementById("remaining-task");

let allTodos = getTodoList();
updateTodoList();

todoForm.addEventListener("submit", function (e) {
  e.preventDefault();
  addTodo();
});

function addTodo() {
  const todoText = todoInput.value.trim();
  if (todoText.length > 0) {
    const todoObject = {
      text: todoText,
      date: new Date().toLocaleDateString(), // Add the current date
      completed: false,
    };
    allTodos.push(todoObject);
    saveTodos();
    updateTodoList();
    todoInput.value = "";
  } else {
    alert("Please enter a task");
  }
  counter();
}

function updateTodoList() {
  todoListUL.innerHTML = "";

  allTodos.forEach((todo, todoIndex) => {
    const todoItem = createTodoItem(todo, todoIndex);
    todoListUL.appendChild(todoItem);
  });
  counter();
}

function groupTodosByDate(todos) {
  return todos.reduce((groups, todo) => {
    const date = todo.date;
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(todo);
    return groups;
  }, {});
}

function createTodoItem(todo, todoIndex) {
  const todoId = "todo-" + todoIndex;
  const todoLI = document.createElement("li");
  const todoText = todo.text;
  todoLI.className = "todo";
  todoLI.innerHTML = `
    <input type="checkbox" id="${todoId}" />
    <label class="custom-checkbox" for="${todoId}">
      <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="transparent">
        <path d="M480-80q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q65 0 123 19t107 53l-58 59q-38-24-81-37.5T480-800q-133 0-226.5 93.5T160-480q0 133 93.5 226.5T480-160q133 0 226.5-93.5T800-480q0-18-2-36t-6-35l65-65q11 32 17 66t6 70q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm-56-216L254-466l56-56 114 114 400-401 56 56-456 457Z"/>
      </svg>
    </label>
    <label for="${todoId}" class="todo-text">${todoText}</label>
    <label for="${todoId}" class="todo-date">${todo.date}</label>
    <button class="delete-button" type="button">
      <svg xmlns="http://www.w3.org/2000/svg" height="30px" viewBox="0 -960 960 960" width="30px" fill="#6eacda">
        <path d="M280-120q-33 0-56.5-23.5T200-200v-520h-40v-80h200v-40h240v40h200v80h-40v520q0 33-23.5 56.5T680-120H280Zm400-600H280v520h400v-520ZM360-280h80v-360h-80v360Zm160 0h80v-360h-80v360ZM280-720v520-520Z"/>
      </svg>
    </button>
  `;

  const deleteButton = todoLI.querySelector(".delete-button");
  deleteButton.addEventListener("click", function () {
    const confirmation = confirm("Are you sure you want to delete this task?");
    if (confirmation) {
      deleteTodoItem(todoIndex);
    }
  });

  const checkbox = todoLI.querySelector("input[type='checkbox']");
  checkbox.addEventListener("change", () => {
    allTodos[todoIndex].completed = checkbox.checked;
    saveTodos();
    counter();
  });

  checkbox.checked = todo.completed;

  return todoLI;
}

function deleteTodoItem(todoIndex) {
  allTodos = allTodos.filter((_, index) => index !== todoIndex);
  saveTodos();
  updateTodoList();
  counter();
}

function saveTodos() {
  localStorage.setItem("todos", JSON.stringify(allTodos));
}

function getTodoList() {
  const todos = localStorage.getItem("todos") || "[]";
  return JSON.parse(todos);
}

function counter() {
  const completedTasks = allTodos.filter((todo) => todo.completed).length;
  const remainingTasks = allTodos.length - completedTasks;
  allTask.innerText = `Total Tasks: ${allTodos.length}`;
  completedTask.innerText = `Completed Tasks: ${completedTasks}`;
  remainingTask.innerText = `Remaining Tasks: ${remainingTasks}`;
}
