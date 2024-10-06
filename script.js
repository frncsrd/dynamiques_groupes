// Fonction pour mettre à jour l'affichage du nombre de participants en temps réel
function updateNumDisplay(value) {
    document.getElementById('numDisplay').innerText = value;
}

// Fonction pour générer le graphe basé sur le nombre de participants sélectionné
function generateGraph(numPeople) {
    // Supprime le graphique précédent pour éviter des chevauchements
    d3.select("#graph").selectAll("*").remove();

    const width = 400;  // Largeur du conteneur
    const height = 400; // Hauteur du conteneur
    const radius = 180; // Rayon du cercle pour laisser de l'espace

    // Création du SVG dans le conteneur du graphe
    const svg = d3.select("#graph")
                  .append("svg")
                  .attr("width", width)
                  .attr("height", height);

    // Calculer les positions des participants sur un cercle (centré)
    const angleStep = (2 * Math.PI) / numPeople;
    const nodes = [];
    for (let i = 0; i < numPeople; i++) {
        const angle = i * angleStep;
        const x = width / 2 + radius * Math.cos(angle);  // Centré horizontalement
        const y = height / 2 + radius * Math.sin(angle); // Centré verticalement
        nodes.push({x, y});
    }

    // Dessiner les connexions possibles entre les participants avec animation
    let connections = 0;
    for (let i = 0; i < numPeople; i++) {
        for (let j = i + 1; j < numPeople; j++) {
            svg.append("line")
               .attr("x1", nodes[i].x)
               .attr("y1", nodes[i].y)
               .attr("x2", nodes[i].x)  // Ligne commence sur la position du premier point
               .attr("y2", nodes[i].y)  // Ligne commence sur la position du premier point
               .attr("stroke", "#FFF") // Lignes en blanc
               .attr("stroke-width", 2)
               .transition()  // Transition pour dessiner la ligne
               .duration(1000)  // Durée de l'animation
               .attr("x2", nodes[j].x)  // Transition vers la position finale du second point
               .attr("y2", nodes[j].y);
            connections++;
        }
    }

    // Dessiner les points représentant les participants avec animation
    svg.selectAll("circle")
       .data(nodes)
       .enter()
       .append("circle")
       .attr("cx", width / 2) // Les points apparaissent au centre d'abord
       .attr("cy", height / 2)
       .attr("r", 0) // Démarrer avec un rayon de 0 pour l'animation
       .attr("fill", "#FFF")
       .transition()  // Transition pour déplacer les cercles vers leur position finale
       .duration(1000)
       .attr("cx", d => d.x)  // Transition vers la position finale en x
       .attr("cy", d => d.y)  // Transition vers la position finale en y
       .attr("r", 10);  // Augmenter le rayon vers la taille finale

    // Afficher le nombre de connexions en dessous du texte explicatif
    document.getElementById('connectionNumber').innerText = connections;
}

// Fonction pour mettre à jour le message dynamique et le laïus spécifique fusionnés
function updateMessage(numPeople) {
    const messageElement = document.getElementById('dynamicMessage');
    const statusElement = document.getElementById('status'); // Ajout du statut

    // Message dynamique en fonction du nombre de participants
    let mainMessage = "";
    if (numPeople <= 5) {
        mainMessage = "Jusqu'à 5 personnes, les échanges sont encore fluides. Chacun peut s'exprimer et co-construire, les interactions sont riches et équilibrées.";
        messageElement.style.backgroundColor = "#42915B"; // Vert pour 3-5 personnes
        statusElement.innerText = "Co-construction efficace"; // Statut en vert
        statusElement.style.color = "#42915B";
    } else if (numPeople <= 8) {
        mainMessage = "À partir de 6 personnes, les interactions deviennent plus difficiles. Les échanges non-verbaux dominent, la gestion du temps est primordiale.";
        messageElement.style.backgroundColor = "#E66D40"; // Orange pour 6-8 personnes
        statusElement.innerText = "Co-construction difficile"; // Statut en orange
        statusElement.style.color = "#E66D40";
    } else {
        mainMessage = "Au-delà de 9 personnes, les interactions se transforment en information descendante. La co-construction devient quasi impossible.";
        messageElement.style.backgroundColor = "#FF5A5E"; // Rouge pour 9 personnes et plus
        statusElement.innerText = "Co-construction impossible"; // Statut en rouge
        statusElement.style.color = "#FF5A5E";
    }

    // Laïus spécifique pour chaque taille de groupe
    let specificMessage = "";
    switch (parseInt(numPeople)) {
        case 3:
            specificMessage = "Analyse : l'écoute est encore facile. Le groupe peut échanger efficacement et chaque participant peut se faire entendre.";
            break;
        case 4:
            specificMessage = "Analyse : les interactions sont fluides mais commencent à nécessiter plus de structure pour éviter les interruptions.";
            break;
        case 5:
            specificMessage = "Analyse : la co-construction reste possible, mais il est nécessaire d'assurer une bonne répartition de la parole.";
            break;
        case 6:
            specificMessage = "Analyse : les échanges non-verbaux augmentent. Il devient plus difficile de garantir que chacun soit écouté.";
            break;
        case 7:
            specificMessage = "Analyse : l'organisation est clé. Les discussions deviennent plus descendantes et la participation active de chacun diminue.";
            break;
        case 8:
            specificMessage = "Analyse : les échanges sont de plus en plus complexes. La gestion du temps et de la parole devient cruciale.";
            break;
        case 9:
            specificMessage = "Analyse : les échanges se transforment en une suite d'informations descendantes. La co-construction devient difficile.";
            break;
        default:
            specificMessage = "Analyse : au-delà de 9, les interactions sont majoritairement descendantes et les contributions individuelles sont limitées.";
            break;
    }

    // Fusion des messages dans le bloc dynamique
    messageElement.innerHTML = `<p>${mainMessage}</p><p>${specificMessage}</p>`;
}

// Fonction pour gérer le changement d'état actif des boutons et mettre à jour le graphe et le message
function updateGraphAndMessage(numPeople) {
    // Supprime l'état actif des autres boutons
    const buttons = document.querySelectorAll('.button-grid button');
    buttons.forEach(button => button.classList.remove('active'));

    // Ajoute l'état actif au bouton cliqué
    const activeButton = document.querySelector(`.button-grid button:nth-child(${numPeople - 2})`);
    activeButton.classList.add('active');

    generateGraph(numPeople);
    updateMessage(numPeople);
}

// Initialisation : affichage de 3 et génération du graphe dès le chargement de la page
window.onload = function() {
    updateGraphAndMessage(3); // Met à jour l'affichage et le graphe pour 3 participants par défaut
}


window.onload = function() {
    // Sélectionne toutes les sections avec la classe fade-section
    const sections = document.querySelectorAll('.fade-section');
    
    sections.forEach((section, index) => {
        // Ajoute un délai pour chaque élément afin qu'ils apparaissent en cascade
        setTimeout(() => {
            section.classList.add('fade-in-up'); // Ajoute la classe d'animation
        }, index * 600); // Délai de 200ms entre chaque élément
    });

    // Génère le graphe et met à jour les messages pour 3 participants par défaut
    updateGraphAndMessage(3);
};
