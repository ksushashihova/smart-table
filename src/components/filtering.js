import {createComparison, defaultRules} from "../lib/compare.js";

// @todo: #4.3 — настроить компаратор
const compare = createComparison(defaultRules);


export function initFiltering(elements, indexes) {
    // @todo: #4.1 — заполнить выпадающие списки опциями
    Object.keys(indexes).forEach(elementName => {
        const element = elements[elementName];  // получаем нужный select
        const options = Object.values(indexes[elementName]).map(name => {
            const option = document.createElement('option');
            option.value = name;
            option.textContent = name;
            return option;
        });
        element.append(...options);
        });


    return (data, state, action) => {
        // @todo: #4.2 — обработать очистку поля
        if (action?.name === 'clear') {
            const field = action.dataset.field;                 // имя поля
            const input = action.parentElement.querySelector(`[name="${field}"]`);
            if (input) input.value = '';                        // очищаем input
            state[field] = '';                                  // обновляем состояние
            }


        // @todo: #4.5 — отфильтровать данные используя компаратор
        return data.filter(row => compare(row, state));

    }
}