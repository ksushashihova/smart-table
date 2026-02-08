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
const { data, ...indexes } = initData(sourceData);

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
function render(action) {
    const state = collectState();
    let result = [...data];

    result = applySearching(result, state, action); // поиск
    result = applyFiltering(result, state, action); // фильтрация
    result = applySorting(result, state, action); // если есть сортировка
    result = applyPagination(result, state, action); // пагинация

    sampleTable.render(result);
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
const applyFiltering = initFiltering(sampleTable.filter.elements, {
    searchBySeller: indexes.sellers         // пример: наполняем select продавцов
});
const applyPagination = initPagination(
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

// Первая отрисовка
render();
