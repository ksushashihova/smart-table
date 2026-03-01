

export function initFiltering(elements) {

    // Функция для заполнения select после получения индексов
    const updateIndexes = (elements, indexes) => {
        Object.keys(indexes).forEach((elementName) => {
            elements[elementName].append(...Object.values(indexes[elementName]).map(name => {
                const el = document.createElement('option');
                el.textContent = name;
                el.value = name;
                return el;
            }));
        });
    };

    // Формируем параметры запроса для сервера
    const applyFiltering = (query, state, action) => {

        // очистка поля
        if (action?.name === 'clear') {
            const field = action.dataset.field;
            const input = action.parentElement.querySelector(`[name="${field}"]`);
            if (input) input.value = '';
            state[field] = '';
        }

        // собираем фильтры в объект query
        const filter = {};
        Object.keys(elements).forEach(key => {
            const el = elements[key];
            if (el && ['INPUT','SELECT'].includes(el.tagName) && el.value) {
                filter[`filter[${el.name}]`] = el.value;
            }
        });

        // возвращаем новый объект query с фильтром
        return Object.keys(filter).length ? Object.assign({}, query, filter) : query;
    };

    return {
        updateIndexes,
        applyFiltering
    };
}