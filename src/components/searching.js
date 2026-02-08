import { rules, createComparison } from "../lib/compare.js";

export function initSearching(searchField) {
    // создаём компаратор только для поиска
    const compare = createComparison([], [
        // Передаем функцию напрямую, она уже с параметрами
        rules.searchMultipleFields(searchField, ['date', 'customer', 'seller'], false),
        rules.skipEmptyTargetValues() // эту можно оставить, если нужно
    ]);

    return (data, state, action) => {
        return data.filter(row => compare(row, state));
    }
}

