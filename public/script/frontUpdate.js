let initialCards = []; // Variable globale pour stocker les cartes initiales

document.addEventListener('DOMContentLoaded', function() {
    // Sélectionner les éléments de recherche et de catégorie
    const searchInput = document.querySelector('input[name="search"]');
    const searchBySelect = document.querySelector('select[name="searchBy"]');
    const categorySelect = document.querySelector('select[name="category"]');

    // Sélectionner toutes les cartes et les stocker dans initialCards
    initialCards = Array.from(document.querySelectorAll('.list-user .card'));

    // Ajouter des écouteurs d'événements pour les champs de recherche et de catégorie
    [searchInput, searchBySelect, categorySelect].forEach(element => {
    
        element.addEventListener('change', filterCards);
    });

    const form = document.querySelector('#filterForm');

    form.addEventListener('submit', function(event) {
        event.preventDefault(); // Empêche le rechargement de la page lors de la soumission du formulaire
        filterCards(); // Appelle la fonction filterCards() pour filtrer les cartes
    });
    // Fonction de filtrage des cartes
    function filterCards() {
        const searchText = searchInput.value.trim().toLowerCase();
        const searchBy = searchBySelect.value.trim().toLowerCase();
        const category = categorySelect.value.trim().toLowerCase();
        // Parcourir toutes les cartes
        initialCards.forEach(card => {
            const name = card.dataset.name.toLowerCase();
            const localisation = card.dataset.localisation.toLowerCase();
            const cardCategory = card.dataset.category.toLowerCase();
            
            // Vérifier les critères de recherche et de catégorie
            if (
                (searchBy === 'name' && name.includes(searchText)) ||
                (searchBy === 'localisation' && localisation.includes(searchText))
            ) {
                if (category === 'all' || cardCategory === category) {
                    // Afficher la carte si elle correspond aux critères
                    card.style.display = ''; // Réinitialiser le style (au cas où il était caché)
                } else {
                    // Masquer la carte si elle ne correspond pas à la catégorie sélectionnée
                    card.style.display = 'none';
                }
            } else {
                // Masquer la carte si elle ne correspond pas au critère de recherche
                card.style.display = 'none';
            }
        });
    }
});
