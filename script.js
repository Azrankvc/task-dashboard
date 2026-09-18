// --- DOM ELEMENTS ---
const fetchUserBtn = document.getElementById("fetchUserBtn");
const userInfo = document.getElementById("userInfo");
const taskForm = document.getElementById("taskForm");
const taskInput = document.getElementById("taskInput");
const taskList = document.getElementById("taskList");
const filterAll = document.getElementById("filterAll");
const filterCompleted = document.getElementById("filterCompleted");

// --- STATE MANAGEMENT ---
let tasks = JSON.parse(localStorage.getItem("my_tasks")) || [];

// -------------------------------------------------------------
// 1. ASYNC / AWAIT, FETCH API & DESTRUCTURING
// -------------------------------------------------------------
async function getRandomUser() {
  userInfo.innerHTML = "Loading user...";
  fetchUserBtn.disabled = true;

  try {
    const response = await fetch("https://randomuser.me/api/");

    if (!response.ok) {
      throw new Error("Server response failed.");
    }

    const data = await response.json();
    const { name, email, location } = data.results[0];

    userInfo.innerHTML = `
      <p><strong>Name:</strong> ${name.first} ${name.last}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Country:</strong> ${location.country}</p>
    `;
  } catch (error) {
    userInfo.innerHTML = `Error: ${error.message}`;
  } finally {
    fetchUserBtn.disabled = false;
  }
}

// -------------------------------------------------------------
// 2. LOCALSTORAGE & ARRAY METHODS (map, filter)
// -------------------------------------------------------------
function saveTasksToStorage() {
  localStorage.setItem("my_tasks", JSON.stringify(tasks));
}

// Render Tasks to Screen
function renderTasks(filterType = "all") {
  taskList.innerHTML = "";

  const filteredTasks = tasks.filter((task) => {
    if (filterType === "completed") return task.isCompleted;
    return true;
  });

  if (filteredTasks.length === 0) {
    taskList.innerHTML = "<li>No tasks found.</li>";
    return;
  }

  filteredTasks.forEach((task) => {
    const li = document.createElement("li");
    if (task.isCompleted) li.classList.add("completed");

    li.innerHTML = `
      <span onclick="toggleTask(${task.id})">${task.text}</span>
      <button class="delete-btn" onclick="deleteTask(${task.id})">Delete</button>
    `;

    taskList.appendChild(li);
  });
}

// Add New Task
function addTask(event) {
  event.preventDefault();

  const text = taskInput.value.trim();
  if (!text) return;

  const newTask = {
    id: Date.now(),
    text: text,
    isCompleted: false,
  };

  tasks.push(newTask);
  saveTasksToStorage();
  renderTasks();

  taskInput.value = "";
}

// Toggle Task Completion Status
function toggleTask(id) {
  tasks = tasks.map((task) => {
    if (task.id === id) {
      return { ...task, isCompleted: !task.isCompleted };
    }
    return task;
  });

  saveTasksToStorage();
  renderTasks();
}

// Delete Task
function deleteTask(id) {
  tasks = tasks.filter((task) => task.id !== id);
  saveTasksToStorage();
  renderTasks();
}

// -------------------------------------------------------------
// 3. EVENT LISTENERS
// -------------------------------------------------------------
fetchUserBtn.addEventListener("click", getRandomUser);
taskForm.addEventListener("submit", addTask);

filterAll.addEventListener("click", () => renderTasks("all"));
filterCompleted.addEventListener("click", () => renderTasks("completed"));

// Initial render when page loads
renderTasks();
