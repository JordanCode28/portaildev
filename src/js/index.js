/*========================================================
    CREATION ET INJECTION DES CARTES A PARTIR DES DEUX BD
==========================================================*/

// On charge les fichiers JSON
import donneesDeveloppeurs from "../data/developers.json";
import donneesProjets from "../data/projects.json";

async function chargerLesDonnees() {
  // On extrait les tableaux depuis les objets racines
  const listeDeveloppeurs = donneesDeveloppeurs.developers;
  const listeProjets = donneesProjets.projects;

  return { listeDeveloppeurs, listeProjets };
}

/*-------------------------------------
    Construire une carte développeur
---------------------------------------*/

function construireCarteDeveloppeur(developpeur) {
  // On prépare la liste des technologies sous forme de badges
  const badgesTechnologies = developpeur.stack.languages.slice(0, 6)
    .map((technologie) => `<span class="badge">${technologie}</span>`)
    .join("");
  const badgesTools = developpeur.stack.tools.slice(0, 6)
    .map((devtools) => `<span class="badge">${devtools}</span>`)
    .join("");


  // On construit et retourne le HTML complet de la carte
  return `
    <article class="dev-card">
      <a class="card-link" href="${developpeur.socials.portfolio}">
        <div class="banner-card">
          <img class="avatar"
          src="${developpeur.avatar}"
          alt="Photo de ${developpeur.firstName} ${developpeur.lastName}"
          />
        </div>
        <h3 class"dev-nom">${developpeur.firstName} ${developpeur.lastName}</h3>
        <p class="role">${developpeur.role}</p>
        <p class="location">${developpeur.location}</p>
        <div class="badges">${badgesTechnologies}${badgesTools}</div>
      </a>
    </article>
  `;
}

/*-------------------------------------
    Construire une carte projet
---------------------------------------*/

function construireCarteProjet(projet) {
  // On fusionne toutes les technologies en un seul tableau
  const toutesLesTechnologies = [
    ...projet.stack.frontend,
    ...projet.stack.backend,
  ].slice(0, 6);

  // On transforme chaque technologie en badge HTML
  const badgesTechnologies = toutesLesTechnologies
    .map((technologie) => `<span class="badge">${technologie}</span>`)
    .join("");

  // Le lien vers la page détail passe l'ID du projet dans l'URL
  const lienVersLaPageDetail = `projet.html?id=${projet.id}`;

  return `
    <article class="carte-projet">
      <a class="link-projet" href="${lienVersLaPageDetail}">
        <div>
          <img src="${projet.thumbnail}" alt="${projet.name}" />
          <div>
            <h3 class="project-name">${projet.name}</h3>
            <p class="project-info">${projet.tagline}</p>
          </div>
        </div>
        <div class="badges">${badgesTechnologies}</div>
      </a>
    </article>
  `;
}

// Injecter les cartes dans la page

export async function afficherLesCartes() {
  // On récupère les données depuis les fichiers JSON
  const { listeDeveloppeurs, listeProjets } = await chargerLesDonnees();

  // On transforme chaque développeur en carte HTML, puis on assemble
  const htmlCarteDeveloppeurs = listeDeveloppeurs
    .map((developpeur) => construireCarteDeveloppeur(developpeur))
    .join("");

  // On transforme chaque projet en carte HTML, puis on assemble
  const htmlCartesProjets = listeProjets
    .map((projet) => construireCarteProjet(projet))
    .join("");

  // On sélectionne les conteneurs dans la page HTML
  const conteneurDeveloppeurs = document.querySelector("#dev-grid");
  const conteneurProjets = document.querySelector("#project-grid");

  // On injecte le HTML dans chaque conteneur
  conteneurDeveloppeurs.innerHTML = htmlCarteDeveloppeurs;
  conteneurProjets.innerHTML = htmlCartesProjets;
}