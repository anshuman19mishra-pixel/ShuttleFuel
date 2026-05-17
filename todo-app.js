// TaskFlow - Smart To-Do List Application
const STORAGE_KEY = 'taskflow_todos';
const SETTINGS_KEY = 'taskflow_settings';

let tasks = [];
let currentFilter = 'all';

// DOM Elements
const taskInput = document.getElementById('taskInput');
const prioritySelect = document.getElementById('prioritySelect');
const taskForm = document.getElementById('taskForm');
const tasksList = document.getElementById('tasksList');
const emptyState = document.getElementById('emptyState');
const filterButtons = document.querySelectorAll('.filter-btn');
const clearCompletedBtn = document.getElementById('clearCompletedBtn');
const taskCount = document.getElementById('taskCount');
const completedCount = document.getElementById('completedCount');
const progressBar = document.getElementById('progressBar');
const progressPercent = document.getElementById('progressPercent');
const exportBtn = document.getElementById('exportBtn');
const importBtn = document.getElementById('importBtn');
const resetBtn = document.getElementById('resetBtn');
const fileInput = document.getElementById('fileInput');

// Initialize
function init() {
  loadTasks();
  renderTasks();
  updateStats();
  attachEventListeners();
}

// Event Listeners
function attachEventListeners() {
  taskForm.addEventListener('submit', addTask);
  clearCompletedBtn.addEventListener('click', clearCompleted);
  exportBtn.addEventListener('click', exportTasks);
  importBtn.addEventListener('click', () => fileInput.click());
  fileInput.addEventListener('change', importTasks);
  resetBtn.addEventListener('click', resetAllTasks);

  filterButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      filterButtons.forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');
      currentFilter = btn.dataset.filter;
      renderTasks();
    });
  });
}

// Load tasks from localStorage
function loadTasks() {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (saved) {
    try {
      tasks = JSON.parse(saved);
    } catch (e) {
      console.error('Error loading tasks:', e);
      tasks = [];
    }
  }
}

// Save tasks to localStorage
function saveTasks() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
}

// Add new task
function addTask(e) {
  e.preventDefault();

  const text = taskInput.value.trim();
  if (!text) return;

  const priority = prioritySelect.value;

  const task = {
    id: Date.now(),
    text,
    priority,
    completed: false,
    createdAt: new Date().toISOString(),
    dueDate: null,
  };

  tasks.unshift(task);
  saveTasks();
  renderTasks();
  updateStats();

  taskInput.value = '';
  prioritySelect.value = 'medium';
  taskInput.focus();

  showNotification('Task added successfully!');
}

// Delete task
function deleteTask(id) {
  tasks = tasks.filter((task) => task.id !== id);
  saveTasks();
  renderTasks();
  updateStats();
  showNotification('Task deleted');
}

// Toggle task completion
function toggleTask(id) {
  const task = tasks.find((t) => t.id === id);
  if (task) {
    task.completed = !task.completed;
    saveTasks();
    renderTasks();
    updateStats();
  }
}

// Clear completed tasks
function clearCompleted() {
  const beforeCount = tasks.length;
  tasks = tasks.filter((task) => !task.completed);
  const deletedCount = beforeCount - tasks.length;

  if (deletedCount === 0) {
    showNotification('No completed tasks to clear');
    return;
  }

  saveTasks();
  renderTasks();
  updateStats();
  showNotification(`${deletedCount} completed task(s) cleared`);
}

// Filter tasks based on current filter
function getFilteredTasks() {
  switch (currentFilter) {
    case 'active':
      return tasks.filter((t) => !t.completed);
    case 'completed':
      return tasks.filter((t) => t.completed);
    case 'high':
      return tasks.filter((t) => t.priority === 'high');
    default:
      return tasks;
  }
}

// Render tasks
function renderTasks() {
  const filteredTasks = getFilteredTasks();
  tasksList.innerHTML = '';

  if (filteredTasks.length === 0) {
    emptyState.style.display = 'flex';
    return;
  }

  emptyState.style.display = 'none';

  filteredTasks.forEach((task) => {
    const taskEl = createTaskElement(task);
    tasksList.appendChild(taskEl);
  });
}

// Create task element
function createTaskElement(task) {
  const taskEl = document.createElement('div');
  taskEl.className = `task-item ${task.priority}-priority ${
    task.completed ? 'completed' : ''
  }`;

  const createdDate = new Date(task.createdAt).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  });

  const priorityLabel = task.priority.charAt(0).toUpperCase() + task.priority.slice(1);

  taskEl.innerHTML = `
    <input
      type="checkbox"
      class="task-checkbox"
      ${task.completed ? 'checked' : ''}
      onchange="toggleTask(${task.id})"
    />
    <div class="task-content">
      <div class="task-header">
        <span class="task-text">${escapeHtml(task.text)}</span>
        <span class="task-priority priority-${task.priority}">${priorityLabel}</span>
      </div>
      <div class="task-meta">
        <span>📅 ${createdDate}</span>
      </div>
    </div>
    <div class="task-actions">
      <button class="action-btn edit-btn" onclick="editTask(${task.id})" title="Edit">✎</button>
      <button class="action-btn delete-btn" onclick="deleteTask(${task.id})" title="Delete">🗑</button>
    </div>
  `;

  return taskEl;
}

// Edit task
function editTask(id) {
  const task = tasks.find((t) => t.id === id);
  if (!task) return;

  const newText = prompt('Edit task:', task.text);
  if (newText !== null && newText.trim()) {
    task.text = newText.trim();
    saveTasks();
    renderTasks();
    showNotification('Task updated');
  }
}

// Update statistics
function updateStats() {
  const total = tasks.length;
  const completed = tasks.filter((t) => t.completed).length;
  const percentage = total === 0 ? 0 : Math.round((completed / total) * 100);

  taskCount.textContent = `${total} task${total !== 1 ? 's' : ''}`;
  completedCount.textContent = `${completed} done`;
  progressBar.value = percentage;
  progressPercent.textContent = `${percentage}%`;
}

// Export tasks as JSON
function exportTasks() {
  if (tasks.length === 0) {
    showNotification('No tasks to export');
    return;
  }

  const dataStr = JSON.stringify(tasks, null, 2);
  const dataBlob = new Blob([dataStr], { type: 'application/json' });
  const url = URL.createObjectURL(dataBlob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `tasks-${new Date().toISOString().split('T')[0]}.json`;
  link.click();
  URL.revokeObjectURL(url);

  showNotification(`Exported ${tasks.length} task(s)`);
}

// Import tasks from JSON file
function importTasks(e) {
  const file = e.target.files?.[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = (event) => {
    try {
      const imported = JSON.parse(event.target.result);

      if (!Array.isArray(imported)) {
        throw new Error('Invalid format');
      }

      // Validate and merge tasks
      const validTasks = imported.filter(
        (t) =>
          t.id &&
          t.text &&
          typeof t.completed === 'boolean' &&
          ['low', 'medium', 'high'].includes(t.priority)
      );

      // Merge with existing tasks (avoid duplicates)
      const existingIds = new Set(tasks.map((t) => t.id));
      const newTasks = validTasks.filter((t) => !existingIds.has(t.id));

      tasks = [...tasks, ...newTasks];
      saveTasks();
      renderTasks();
      updateStats();

      showNotification(`Imported ${newTasks.length} task(s)`);
    } catch (error) {
      showNotification('Error importing tasks. Invalid format.');
    }
  };

  reader.readAsText(file);
  fileInput.value = '';
}

// Reset all tasks
function resetAllTasks() {
  if (tasks.length === 0) {
    showNotification('No tasks to reset');
    return;
  }

  const confirm = window.confirm(
    `Are you sure? This will delete all ${tasks.length} task(s).`
  );
  if (!confirm) return;

  tasks = [];
  currentFilter = 'all';
  filterButtons[0].classList.add('active');
  filterButtons.forEach((b, i) => {
    if (i !== 0) b.classList.remove('active');
  });

  saveTasks();
  renderTasks();
  updateStats();

  showNotification('All tasks cleared');
}

// Utility: Escape HTML
function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

// Notification system
function showNotification(message) {
  // Create a simple toast notification
  const notification = document.createElement('div');
  notification.style.cssText = `
    position: fixed;
    bottom: 2rem;
    right: 2rem;
    background: linear-gradient(135deg, #6366f1 0%, #4f46e5 100%);
    color: white;
    padding: 1rem 1.5rem;
    border-radius: 0.5rem;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
    font-weight: 600;
    animation: slideUp 0.3s ease;
    z-index: 1000;
    max-width: 300px;
  `;
  notification.textContent = message;

  document.body.appendChild(notification);

  setTimeout(() => {
    notification.style.animation = 'slideDown 0.3s ease';
    setTimeout(() => notification.remove(), 300);
  }, 2500);
}

// Add animation styles
const style = document.createElement('style');
style.textContent = `
  @keyframes slideUp {
    from {
      opacity: 0;
      transform: translateY(20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
  @keyframes slideDown {
    from {
      opacity: 1;
      transform: translateY(0);
    }
    to {
      opacity: 0;
      transform: translateY(20px);
    }
  }
`;
document.head.appendChild(style);

// Initialize app on load
window.addEventListener('DOMContentLoaded', init);
