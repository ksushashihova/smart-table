import './fonts/ys-display/fonts.css';
import './style.css';

import { data as sourceData } from "./data/dataset_1.js";

import { initData } from "./data.js";
import { processFormData } from "./lib/utils.js";

import { initTable } from "./components/table.js";
import { initPagination } from './components/pagination.js';
import { initFiltering } from './components/filtering.js';
import { initSearching } from "./components/searching.js";
import { initSorting } from "./components/sorting.js";

// Исходные данные, используемые в render()
const api = initData(sourceData);

// Сбор и обработка полей из таблицы
function collectState() {
    const state = processFormData(new FormData(sampleTable.container));

    const rowsPerPage = parseInt(state.rowsPerPage); // приводим количество страниц к числу
    const page = parseInt(state.page ?? 1);          // номер страницы по умолчанию 1 и тоже число

    return {
        ...state,
        rowsPerPage,
        page
    };
}

// Перерисовка состояния таблицы при любых изменениях
async function render(action) {
    const state = collectState();
    let query = {};

    query = applySearching(query, state, action);
    query = applyFiltering(query, state, action);  
    query = applySorting(query, state, action); 
    query = applyPagination(query, state, action); 
    const { total, items } = await api.getRecords(query);
    updatePagination(total, query);
    sampleTable.render(items);
}

// Инициализация таблицы
const sampleTable = initTable({
    tableTemplate: 'table',
    rowTemplate: 'row',
    before: ['search','header','filter'], // порядок элементов
    after: ['pagination'],
}, render);

// Инициализация модулей
const applySearching = initSearching('search'); // поле поиска
const applySorting = initSorting([
    sampleTable.header.elements.sortByDate,
    sampleTable.header.elements.sortByTotal
]);
const { applyFiltering, updateIndexes } = initFiltering(sampleTable.filter.elements);
const {applyPagination, updatePagination} = initPagination(
    sampleTable.pagination.elements,
    (el, page, isCurrent) => {             // колбэк для заполнения кнопок страниц
        const input = el.querySelector('input');
        const label = el.querySelector('span');
        input.value = page;
        input.checked = isCurrent;
        label.textContent = page;
        return el;
    }
);

// Вставка таблицы в DOM
const appRoot = document.querySelector('#app');
appRoot.appendChild(sampleTable.container);

async function init() {
    const indexes = await api.getIndexes();

    updateIndexes(sampleTable.filter.elements, {
        searchBySeller: indexes.sellers
    });

    render(); // рендерим таблицу после того, как селект заполнен
}

init(); 