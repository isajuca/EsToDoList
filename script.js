// --- Elementos do DOM ---
const taskInput = document.getElementById('task-input');
const addTaskButton = document.getElementById('add-task-button');
const todoList = document.getElementById('todo-list');
const searchInput = document.getElementById('search-input');
const filterSelect = document.getElementById('filter-select');
const themeToggle = document.getElementById('theme-toggle');
const sunIcon = document.getElementById('sun-icon');
const moonIcon = document.getElementById('moon-icon');

// --- Variáveis de Estado ---
let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
let nextId = tasks.length > 0 ? Math.max(...tasks.map(t => t.id)) + 1 : 1;
const localStorageTheme = localStorage.getItem('theme');
const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;


// --- Lógica de Tema Escuro (Dark Mode) ---
const applyTheme = (theme) => {
    if (theme === 'dark') {
        document.documentElement.classList.add('dark');
        sunIcon.classList.remove('hidden');
        moonIcon.classList.add('hidden');
    } else {
        document.documentElement.classList.remove('dark');
        sunIcon.classList.add('hidden');
        moonIcon.classList.remove('hidden');
    }
    localStorage.setItem('theme', theme);
};

const initializeTheme = () => {
    let initialTheme = 'light';
    if (localStorageTheme) {
        initialTheme = localStorageTheme;
    } else if (prefersDark) {
        initialTheme = 'dark';
    }
    applyTheme(initialTheme);
};

const toggleTheme = () => {
    const currentTheme = document.documentElement.classList.contains('dark') ? 'dark' : 'light';
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    applyTheme(newTheme);
};

// --- Funções de Estado (RFs) ---

// Salva as tarefas no Local Storage
const saveTasks = () => {
    localStorage.setItem('tasks', JSON.stringify(tasks));
};

// Função que renderiza a lista na tela (Inclui RF05 e RF06)
const renderTasks = () => {
    const searchText = searchInput.value.toLowerCase();
    const filterType = filterSelect.value;
    
    // Aplica Pesquisa (RF05) e Filtro (RF06)
    const filteredTasks = tasks.filter(task => {
        const matchesSearch = task.text.toLowerCase().includes(searchText);
        const matchesFilter = filterType === 'all' || 
                              (filterType === 'completed' && task.completed) ||
                              (filterType === 'pending' && !task.completed);
        return matchesSearch && matchesFilter;
    });

    todoList.innerHTML = ''; 

    if (filteredTasks.length === 0) {
         todoList.innerHTML = `<li class="text-center text-gray-500 dark:text-gray-400 py-4 italic transition-colors duration-300">Nenhuma tarefa encontrada.</li>`;
         return;
    }

    filteredTasks.forEach(task => {
        const listItem = document.createElement('li');
        listItem.dataset.id = task.id;
        
        // Adicionando dark: classes aos itens da lista
        listItem.className = 'flex items-center justify-between p-3 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg shadow hover:shadow-md transition duration-200 space-x-2';

        listItem.innerHTML = `
            <div class="flex items-center flex-1 min-w-0">
                <input type="checkbox" id="task-${task.id}" class="custom-checkbox mr-3" ${task.completed ? 'checked' : ''}>
                <p class="${task.completed ? 'line-through opacity-60 text-gray-400 dark:text-gray-300 break-words flex-1 min-w-0' : 'text-gray-800 dark:text-gray-200 break-words flex-1 min-w-0'}">${task.text}</p>
                <input type="text" value="${task.text}" class="hidden flex-1 p-1 border border-indigo-400 dark:border-indigo-600 rounded mr-2 focus:outline-none dark:bg-gray-600 dark:text-white" data-edit-input>
            </div>

            <div class="flex space-x-2 ml-2">
                
                ${!task.completed ? `
                    <div class="flex space-x-2 ml-2">
                <button class="edit-button text-orange-500 hover:text-orange-700 p-1 rounded transition duration-150" onclick="toggleEdit(${task.id})">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                        </svg>
                    </button>
                    <button class="save-button text-blue-500 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 p-1 rounded transition duration-150 hidden" onclick="saveEdit(${task.id})">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
                        </svg>
                    </button>
                ` : ''} 
                
                <button class="delete-button text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 p-1 rounded transition duration-150" onclick="deleteTask(${task.id})">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fill-rule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm4 0a1 1 0 10-2 0v6a1 1 0 102 0V8z" clip-rule="evenodd" />
                    </svg>
                </button>
            </div>
        `;

        // Adiciona o manipulador de eventos para o checkbox (RF04)
        listItem.querySelector(`#task-${task.id}`).addEventListener('change', () => window.toggleComplete(task.id));

        todoList.appendChild(listItem);
    });
};

// RF01 - Adicionar Tarefa
const addTask = () => {
    const text = taskInput.value.trim();
    if (text === "") {
        alert("Por favor, digite uma tarefa.");
        return;
    }

    const newTask = {
        id: nextId++,
        text: text,
        completed: false
    };

    tasks.push(newTask);
    saveTasks();
    taskInput.value = ''; 
    renderTasks(); 
};

// RF04 - Marcar/Desmarcar como Concluída
window.toggleComplete = (id) => {
    const taskIndex = tasks.findIndex(t => t.id === id);
    if (taskIndex !== -1) {
        tasks[taskIndex].completed = !tasks[taskIndex].completed;
        saveTasks();
        renderTasks();
    }
};

// RF03 - Excluir Tarefa
window.deleteTask = (id) => {
    tasks = tasks.filter(t => t.id !== id);
    saveTasks();
    renderTasks();
};

// RF02 - Iniciar Edição
window.toggleEdit = (id) => {
    const listItem = todoList.querySelector(`li[data-id="${id}"]`);
    const taskText = listItem.querySelector('p');
    const editInput = listItem.querySelector('[data-edit-input]');
    const editButton = listItem.querySelector('.edit-button');
    const saveButton = listItem.querySelector('.save-button');
    
    // Alterna a visibilidade
    taskText.classList.toggle('hidden');
    editInput.classList.toggle('hidden');
    editButton.classList.toggle('hidden');
    saveButton.classList.toggle('hidden');
    
    if (!editInput.classList.contains('hidden')) {
         editInput.focus();
    }
};

// RF02 - Salvar Edição
window.saveEdit = (id) => {
    const listItem = todoList.querySelector(`li[data-id="${id}"]`);
    const editInput = listItem.querySelector('[data-edit-input]');
    const newText = editInput.value.trim();

    if (newText === "") {
        alert("O nome da tarefa não pode ser vazio.");
        return;
    }

    const taskIndex = tasks.findIndex(t => t.id === id);
    if (taskIndex !== -1) {
        tasks[taskIndex].text = newText;
        saveTasks();
        renderTasks(); 
    }
};

// --- Event Listeners (Conectando HTML ao JS) ---

// RF01
addTaskButton.addEventListener('click', addTask);
taskInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        addTask();
    }
});

// RF05 (Pesquisa)
searchInput.addEventListener('input', renderTasks);

// RF06 (Filtro)
filterSelect.addEventListener('change', renderTasks);

// Dark Mode Toggle
themeToggle.addEventListener('click', toggleTheme);

// Inicializa a aplicação
document.addEventListener('DOMContentLoaded', () => {
    initializeTheme();
    renderTasks();
});