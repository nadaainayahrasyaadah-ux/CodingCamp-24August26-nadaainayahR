const STORAGE_KEYS = {
  tasks: "lifeDashboard.tasks",
  links: "lifeDashboard.links",
  name: "lifeDashboard.name",
  theme: "lifeDashboard.theme",
  duration: "lifeDashboard.duration"
};

const $ = (selector) => document.querySelector(selector);

const clockEl = $("#clock");
const dateEl = $("#date");
const greetingEl = $("#greeting");
const greetingNameEl = $("#greetingName");
const themeToggle = $("#themeToggle");

const taskForm = $("#taskForm");
const taskInput = $("#taskInput");
const taskList = $("#taskList");
const taskCount = $("#taskCount");
const emptyTasks = $("#emptyTasks");
const taskMessage = $("#taskMessage");
const taskSort = $("#taskSort");

const linkForm = $("#linkForm");
const linkName = $("#linkName");
const linkUrl = $("#linkUrl");
const linkList = $("#linkList");
const emptyLinks = $("#emptyLinks");
const linkMessage = $("#linkMessage");

const nameInput = $("#nameInput");
const saveName = $("#saveName");

const timerDisplay = $("#timerDisplay");
const timerStatus = $("#timerStatus");
const startTimer = $("#startTimer");
const stopTimer = $("#stopTimer");
const resetTimer = $("#resetTimer");
const pomodoroMinutes = $("#pomodoroMinutes");
const saveDuration = $("#saveDuration");

let tasks = load(STORAGE_KEYS.tasks, []);
let links = load(STORAGE_KEYS.links, []);
let userName = localStorage.getItem(STORAGE_KEYS.name) || "";
let durationMinutes = Number(localStorage.getItem(STORAGE_KEYS.duration)) || 25;

let timerSeconds = durationMinutes * 60;
let timerInterval = null;

function load(key, fallback) {
  try {
    const value = localStorage.getItem(key);
    return value ? JSON.parse(value) : fallback;
  } catch {
    return fallback;
  }
}

function save(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

function updateClock() {
  const now = new Date();
  clockEl.textContent = now.toLocaleTimeString("id-ID", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false
  });

  dateEl.textContent = now.toLocaleDateString("id-ID", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric"
  });

  const hour = now.getHours();
  const greeting = hour < 11 ? "Good Morning" : hour < 15 ? "Good Afternoon" : hour < 18 ? "Good Evening" : "Good Night";
  greetingEl.textContent = greeting;
  greetingNameEl.textContent = userName
    ? `Halo, ${userName}! Semangat menjalani hari.`
    : "Semangat menjalani hari!";
}

function renderTasks() {
  const sorted = [...tasks].sort((a, b) => {
    if (taskSort.value === "active") return Number(a.completed) - Number(b.completed) || b.createdAt - a.createdAt;
    if (taskSort.value === "completed") return Number(b.completed) - Number(a.completed) || b.createdAt - a.createdAt;
    return b.createdAt - a.createdAt;
  });

  taskList.innerHTML = "";
  emptyTasks.style.display = sorted.length ? "none" : "grid";

  sorted.forEach((task) => {
    const li = document.createElement("li");
    li.className = `task-item${task.completed ? " completed" : ""}`;

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.className = "task-check";
    checkbox.checked = task.completed;
    checkbox.setAttribute("aria-label", `Tandai ${task.title} selesai`);
    checkbox.addEventListener("change", () => {
      task.completed = checkbox.checked;
      save(STORAGE_KEYS.tasks, tasks);
      renderTasks();
    });

    const title = document.createElement("span");
    title.className = "task-title";
    title.textContent = task.title;

    const actions = document.createElement("div");
    actions.className = "task-actions";

    const editButton = document.createElement("button");
    editButton.className = "text-button";
    editButton.type = "button";
    editButton.textContent = "Edit";
    editButton.addEventListener("click", () => editTask(task.id));

    const deleteButton = document.createElement("button");
    deleteButton.className = "text-button delete";
    deleteButton.type = "button";
    deleteButton.textContent = "Delete";
    deleteButton.addEventListener("click", () => deleteTask(task.id));

    actions.append(editButton, deleteButton);
    li.append(checkbox, title, actions);
    taskList.appendChild(li);
  });

  taskCount.textContent = tasks.filter((task) => !task.completed).length;
}

function showMessage(element, message, success = true) {
  element.textContent = message;
  element.style.color = success ? "var(--success)" : "var(--danger)";
  window.clearTimeout(element._messageTimer);
  element._messageTimer = window.setTimeout(() => {
    element.textContent = "";
  }, 2500);
}

function addTask(title) {
  const cleanTitle = title.trim();
  if (!cleanTitle) return;

  const duplicate = tasks.some((task) => task.title.toLowerCase() === cleanTitle.toLowerCase());
  if (duplicate) {
    showMessage(taskMessage, "Tugas yang sama sudah ada.", false);
    return;
  }

  tasks.push({
    id: crypto.randomUUID ? crypto.randomUUID() : String(Date.now()),
    title: cleanTitle,
    completed: false,
    createdAt: Date.now()
  });

  save(STORAGE_KEYS.tasks, tasks);
  taskForm.reset();
  renderTasks();
  showMessage(taskMessage, "Tugas berhasil ditambahkan.");
}

function editTask(id) {
  const task = tasks.find((item) => item.id === id);
  if (!task) return;

  const updated = window.prompt("Edit tugas:", task.title);
  if (updated === null) return;

  const cleanUpdated = updated.trim();
  if (!cleanUpdated) {
    showMessage(taskMessage, "Nama tugas tidak boleh kosong.", false);
    return;
  }

  const duplicate = tasks.some((item) => item.id !== id && item.title.toLowerCase() === cleanUpdated.toLowerCase());
  if (duplicate) {
    showMessage(taskMessage, "Tugas yang sama sudah ada.", false);
    return;
  }

  task.title = cleanUpdated;
  save(STORAGE_KEYS.tasks, tasks);
  renderTasks();
  showMessage(taskMessage, "Tugas berhasil diperbarui.");
}

function deleteTask(id) {
  tasks = tasks.filter((task) => task.id !== id);
  save(STORAGE_KEYS.tasks, tasks);
  renderTasks();
}

function normalizeUrl(url) {
  const value = url.trim();
  return /^https?:\/\//i.test(value) ? value : `https://${value}`;
}

function renderLinks() {
  linkList.innerHTML = "";
  emptyLinks.style.display = links.length ? "none" : "grid";

  links.forEach((link) => {
    const wrapper = document.createElement("div");
    wrapper.className = "quick-link";

    const anchor = document.createElement("a");
    anchor.href = link.url;
    anchor.target = "_blank";
    anchor.rel = "noopener noreferrer";
    anchor.className = "quick-link-name";
    anchor.textContent = link.name;
    anchor.title = link.url;
    anchor.style.color = "inherit";
    anchor.style.textDecoration = "none";

    const remove = document.createElement("button");
    remove.type = "button";
    remove.className = "remove-link";
    remove.textContent = "×";
    remove.title = `Hapus ${link.name}`;
    remove.setAttribute("aria-label", `Hapus ${link.name}`);
    remove.addEventListener("click", () => {
      links = links.filter((item) => item.id !== link.id);
      save(STORAGE_KEYS.links, links);
      renderLinks();
    });

    wrapper.append(anchor, remove);
    linkList.appendChild(wrapper);
  });
}

function formatTimer(seconds) {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${String(minutes).padStart(2, "0")}:${String(remainingSeconds).padStart(2, "0")}`;
}

function updateTimerDisplay() {
  timerDisplay.textContent = formatTimer(timerSeconds);
}

function startPomodoro() {
  if (timerInterval) return;

  timerStatus.textContent = "Fokus berjalan. Kamu bisa!";
  timerInterval = window.setInterval(() => {
    if (timerSeconds <= 0) {
      stopPomodoro();
      timerStatus.textContent = "Selesai! Saatnya istirahat sebentar.";
      window.alert("Pomodoro selesai! Saatnya istirahat.");
      return;
    }

    timerSeconds -= 1;
    updateTimerDisplay();
  }, 1000);
}

function stopPomodoro() {
  window.clearInterval(timerInterval);
  timerInterval = null;
  if (timerSeconds > 0) timerStatus.textContent = "Timer dihentikan sementara.";
}

function resetPomodoro() {
  stopPomodoro();
  timerSeconds = durationMinutes * 60;
  updateTimerDisplay();
  timerStatus.textContent = "Timer diatur ulang.";
}

function savePomodoroDuration() {
  const value = Number(pomodoroMinutes.value);
  if (!Number.isFinite(value) || value < 1 || value > 120) {
    showMessage(timerStatus, "Durasi harus 1–120 menit.", false);
    return;
  }

  durationMinutes = Math.round(value);
  localStorage.setItem(STORAGE_KEYS.duration, String(durationMinutes));
  resetPomodoro();
  timerStatus.textContent = `Durasi fokus diatur ${durationMinutes} menit.`;
}

function applyTheme(theme) {
  document.body.classList.toggle("dark", theme === "dark");
  themeToggle.textContent = theme === "dark" ? "☀" : "☾";
  localStorage.setItem(STORAGE_KEYS.theme, theme);
}

taskForm.addEventListener("submit", (event) => {
  event.preventDefault();
  addTask(taskInput.value);
});

taskSort.addEventListener("change", renderTasks);

linkForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const name = linkName.value.trim();
  const url = normalizeUrl(linkUrl.value);

  if (!name || !url) return;

  links.push({
    id: crypto.randomUUID ? crypto.randomUUID() : String(Date.now()),
    name,
    url
  });

  save(STORAGE_KEYS.links, links);
  linkForm.reset();
  renderLinks();
  showMessage(linkMessage, "Quick link berhasil ditambahkan.");
});

saveName.addEventListener("click", () => {
  userName = nameInput.value.trim();
  localStorage.setItem(STORAGE_KEYS.name, userName);
  updateClock();
});

themeToggle.addEventListener("click", () => {
  const nextTheme = document.body.classList.contains("dark") ? "light" : "dark";
  applyTheme(nextTheme);
});

startTimer.addEventListener("click", startPomodoro);
stopTimer.addEventListener("click", stopPomodoro);
resetTimer.addEventListener("click", resetPomodoro);
saveDuration.addEventListener("click", savePomodoroDuration);

nameInput.value = userName;
pomodoroMinutes.value = durationMinutes;
applyTheme(localStorage.getItem(STORAGE_KEYS.theme) || "light");
updateClock();
window.setInterval(updateClock, 1000);
updateTimerDisplay();
renderTasks();
renderLinks();
