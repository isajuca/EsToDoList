
// -------------------------------
// 1. Selecionar os elementos da página (Adaptação de IDs)
//
// NOTA: Os seletores são definidos como 'let' para serem atribuídos após o DOM ser carregado.
// -------------------------------
let campoNovaTarefa;
let botaoAdicionar;
let listaTarefas;
let campoPesquisa;
let seletorFiltro;

let botaoTema;
let iconeSol;
let iconeLua;

// Array principal que armazenará todas as tarefas
let tarefas = [];

// -------------------------------
// 2. Lógica de Persistência (localStorage)
// -------------------------------

/**
 * Carrega as tarefas salvas no navegador (localStorage).
 * Se existirem, popula o array 'tarefas' e exibe na tela.
 */
function carregarTarefasSalvas() {
    const tarefasSalvas = localStorage.getItem('tarefas');
    if (tarefasSalvas) {
        tarefas = JSON.parse(tarefasSalvas); // Converte o texto salvo em array de objetos
        exibirTarefas(tarefas);
    }
}

/**
 * Salva o array 'tarefas' atualizado no localStorage.
 */
function salvarTarefas() {
    localStorage.setItem('tarefas', JSON.stringify(tarefas));
}

// -------------------------------
// 3. Adicionar, Editar e Excluir Tarefas (CRUD)
// -------------------------------

/**
 * Adiciona uma nova tarefa ao array.
 */
function adicionarTarefa() {
    // Verifica se o campo foi carregado corretamente
    if (!campoNovaTarefa) return; 
    
    const texto = campoNovaTarefa.value.trim(); // remove espaços extras

    if (texto === '') {
        alert('Por favor, digite uma tarefa!');
        return;
    }

    // Cria um objeto representando a tarefa
    const novaTarefa = {
        id: Date.now(), // ID único
        texto: texto,
        concluida: false
    };

    // Adiciona, salva e atualiza a exibição
    tarefas.push(novaTarefa);
    salvarTarefas();
    
    // Filtra e re-exibe a lista para garantir que a pesquisa/filtro ativo seja respeitado
    filtrarTarefas(); 

    // Limpa o campo de texto
    campoNovaTarefa.value = '';
}

/**
 * Edita o texto de uma tarefa específica pelo ID.
 * @param {number} id - O ID da tarefa a ser editada.
 */
function editarTarefa(id) {
    const tarefa = tarefas.find(t => t.id === id);

    if (tarefa) {
        const novaDescricao = prompt('Edite a tarefa:', tarefa.texto);

        if (novaDescricao !== null && novaDescricao.trim() !== '') {
            tarefa.texto = novaDescricao.trim();
            salvarTarefas();
            filtrarTarefas(); // Re-exibe a lista
        }
    }
}

/**
 * Exclui uma tarefa específica pelo ID.
 * @param {number} id - O ID da tarefa a ser excluída.
 */
function excluirTarefa(id) {
    const confirmar = window.confirm('Tem certeza que deseja excluir esta tarefa?');

    if (confirmar) {
        // Filtra e mantém todas as tarefas, exceto a que tem o ID correspondente
        tarefas = tarefas.filter(tarefa => tarefa.id !== id);
        salvarTarefas();
        filtrarTarefas(); // Re-exibe a lista
    }
}

// -------------------------------
// 4. Lógica de Conclusão e Exibição
// -------------------------------

/**
 * Alterna o status 'concluida' de uma tarefa.
 * @param {number} id - O ID da tarefa a ter o status alterado.
 */
function alternarConclusao(id) {
    const tarefa = tarefas.find(t => t.id === id);
    if (tarefa) {
        tarefa.concluida = !tarefa.concluida;
        salvarTarefas();
        // Usamos a função de filtro para garantir que a lista exibida seja atualizada corretamente
        // se houver algum filtro ativo (ex: 'Pendentes').
        filtrarTarefas(); 
    }
}

/**
 * Constrói e exibe a lista de tarefas na UI.
 * @param {Array<Object>} listaParaMostrar - O array de tarefas (filtradas ou todas) para renderizar.
 */
function exibirTarefas(listaParaMostrar) {
    if (!listaTarefas) return; // Verificação de segurança

    // Limpamos a lista antes de reconstruir
    listaTarefas.innerHTML = '';

    for (let tarefa of listaParaMostrar) {
        // Criar elemento <li> (o item da lista)
        const item = document.createElement('li');
        item.className = 'flex justify-between items-center p-4 rounded-xl bg-gray-50 dark:bg-gray-700 shadow-md hover:shadow-lg transition-all duration-200 border border-gray-200 dark:border-gray-600';

        // Estilo de concluída: Adicione a classe 'opacity-60' no item pai
        if (tarefa.concluida) {
            item.classList.add('opacity-60'); 
        }

        // Criar um span para o texto da tarefa
        const textoContainer = document.createElement('span');
        textoContainer.textContent = tarefa.texto;
        textoContainer.className = 'flex-1 cursor-pointer text-gray-800 dark:text-gray-200 break-words pr-4';

        // Estilo de 'line-through'
        if (tarefa.concluida) {
            textoContainer.classList.add('line-through', 'text-gray-500', 'dark:text-gray-400');
        } else {
            textoContainer.classList.remove('line-through', 'text-gray-500', 'dark:text-gray-400');
        }

        // Evento de clique para alternar conclusão
        textoContainer.onclick = function () {
            alternarConclusao(tarefa.id);
        };

        // Criar a div para os botões de ação
        const botoes = document.createElement('div');
        botoes.className = 'flex space-x-2 flex-shrink-0';

        // Botão Editar
        const botaoEditar = document.createElement('button');
        botaoEditar.innerHTML = '✏️';
        botaoEditar.className = 'p-2 bg-yellow-400 hover:bg-yellow-500 text-white rounded-lg transition duration-150';
        botaoEditar.onclick = function () {
            editarTarefa(tarefa.id);
        };

        // Botão Excluir
        const botaoExcluir = document.createElement('button');
        botaoExcluir.innerHTML = '🗑️';
        botaoExcluir.className = 'p-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition duration-150';
        botaoExcluir.onclick = function () {
            excluirTarefa(tarefa.id);
        };

        // Montamos o elemento completo
        botoes.appendChild(botaoEditar);
        botoes.appendChild(botaoExcluir);
        item.appendChild(textoContainer);
        item.appendChild(botoes);
        listaTarefas.appendChild(item);
    }
}

// -------------------------------
// 5. Funções de Pesquisa e Filtro
// -------------------------------

/**
 * Filtra as tarefas exibidas com base no texto digitado no campo de pesquisa.
 */
function pesquisarTarefas() {
    if (!campoPesquisa) return; // Verificação de segurança
    const termo = campoPesquisa.value.toLowerCase();
    
    // Obtemos a lista atual que está sendo filtrada pelo status
    const listaFiltradaPorStatus = aplicarFiltroDeStatus(tarefas);

    // Aplicamos o filtro de pesquisa nessa lista
    const filtradasPorPesquisa = listaFiltradaPorStatus.filter(tarefa => {
        return tarefa.texto.toLowerCase().includes(termo);
    });

    exibirTarefas(filtradasPorPesquisa);
}

/**
 * Aplica o filtro de status (all/pending/completed) e retorna a lista.
 * @param {Array<Object>} tarefasBase - O array base para filtrar.
 * @returns {Array<Object>} O array filtrado.
 */
function aplicarFiltroDeStatus(tarefasBase) {
    if (!seletorFiltro) return tarefasBase; // Verificação de segurança

    const tipo = seletorFiltro.value; // 'all', 'pending', 'completed' (adaptados)
    let filtradas = [];

    if (tipo === 'all') {
        filtradas = tarefasBase;
    } else if (tipo === 'pending') {
        filtradas = tarefasBase.filter(tarefa => !tarefa.concluida);
    } else if (tipo === 'completed') {
        filtradas = tarefasBase.filter(tarefa => tarefa.concluida);
    }
    return filtradas;
}

/**
 * Aplica o filtro de status e exibe o resultado na tela.
 */
function filtrarTarefas() {
    // Aplicar o filtro de status
    const filtradas = aplicarFiltroDeStatus(tarefas);
    
    // Além do filtro de status, precisamos aplicar o filtro de pesquisa atual
    if (campoPesquisa && campoPesquisa.value) {
        const termoPesquisa = campoPesquisa.value.toLowerCase();
        const filtradasComPesquisa = filtradas.filter(tarefa => {
            return tarefa.texto.toLowerCase().includes(termoPesquisa);
        });
        exibirTarefas(filtradasComPesquisa);
    } else {
        exibirTarefas(filtradas);
    }
}

// -------------------------------
// 6. Lógica de Dark Mode (Novo Recurso)
// -------------------------------

/**
 * Carrega a preferência de tema do usuário (localStorage) e aplica.
 */
function carregarTemaSalvo() {
    if (!iconeSol || !iconeLua) return;

    const temaSalvo = localStorage.getItem('theme');
    
    let tema = 'light';
    if (temaSalvo === 'dark') {
        tema = 'dark';
    } else if (temaSalvo === null && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        tema = 'dark';
    }

    if (tema === 'dark') {
        document.documentElement.classList.add('dark');
        iconeSol.classList.remove('hidden');
        iconeLua.classList.add('hidden');
    } else {
        document.documentElement.classList.remove('dark');
        iconeSol.classList.add('hidden');
        iconeLua.classList.remove('hidden');
    }
}

/**
 * Alterna entre o modo 'light' e 'dark' e salva a preferência.
 */
function alternarTema() {
    if (!botaoTema) return; // Verificação de segurança

    const html = document.documentElement;
    const isDarkMode = html.classList.toggle('dark');

    if (isDarkMode) {
        localStorage.setItem('theme', 'dark');
        iconeSol.classList.remove('hidden');
        iconeLua.classList.add('hidden');
    } else {
        localStorage.setItem('theme', 'light');
        iconeSol.classList.add('hidden');
        iconeLua.classList.remove('hidden');
    }
    // Re-exibimos a lista para garantir que a cor da conclusão seja atualizada
    filtrarTarefas();
}

// -------------------------------
// 7. Eventos e Inicialização (Interações do usuário)
// -------------------------------

/**
 * Realiza o mapeamento dos elementos do DOM e anexa todos os event listeners.
 */
function inicializarElementosEEventos() {
    // 1. Mapeamento de Elementos (Seguro após o DOM carregar)
    campoNovaTarefa = document.getElementById('task-input');
    botaoAdicionar = document.getElementById('add-task-button');
    listaTarefas = document.getElementById('todo-list');
    campoPesquisa = document.getElementById('search-input');
    seletorFiltro = document.getElementById('filter-select');
    botaoTema = document.getElementById('theme-toggle');
    iconeSol = document.getElementById('sun-icon');
    iconeLua = document.getElementById('moon-icon');

    // 2. Anexar Eventos (Verificando se os elementos existem)
    if (botaoAdicionar) {
        botaoAdicionar.addEventListener('click', adicionarTarefa);
    }
    if (campoNovaTarefa) {
        campoNovaTarefa.addEventListener('keydown', function (evento) {
            if (evento.key === 'Enter') {
                adicionarTarefa();
            }
        });
    }
    if (campoPesquisa) {
        campoPesquisa.addEventListener('input', pesquisarTarefas);
    }
    if (seletorFiltro) {
        seletorFiltro.addEventListener('change', filtrarTarefas);
    }
    if (botaoTema) {
        botaoTema.addEventListener('click', alternarTema);
    }
    
    // 3. Inicializar a Aplicação
    carregarTarefasSalvas();
    carregarTemaSalvo();
    // Garante que o filtro e a pesquisa sejam aplicados na inicialização
    filtrarTarefas(); 
}


// O evento DOMContentLoaded garante que o script só execute após a estrutura HTML estar pronta.
document.addEventListener('DOMContentLoaded', inicializarElementosEEventos);