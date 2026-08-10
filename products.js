// Products page — category filter.
// Each filter button (.cat-btn) has a data-cat matching the data-cat
// on the product cards it should show. Clicking a button hides every
// card whose category doesn't match (or shows all when "all" is picked).

document.addEventListener('DOMContentLoaded', () => {
    const buttons = document.querySelectorAll('.cat-btn');
    const cards = document.querySelectorAll('.product-card');

    buttons.forEach((button) => {
        button.addEventListener('click', () => {
            const category = button.dataset.cat;

            // Swap the "active" style onto the clicked button only
            buttons.forEach((b) => b.classList.toggle('active', b === button));

            // Show cards that match the category, hide the rest
            cards.forEach((card) => {
                const matches = category === 'all' || card.dataset.cat === category;
                card.hidden = !matches;
            });
        });
    });
});
