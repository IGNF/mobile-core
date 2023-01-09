# CordovApp

Bibliothèque pour le dévelopement d'applications utilisant [Cordova](https://cordova.apache.org/docs/en/latest/guide/platforms/index.html).    
Celui-ci permet de créer des applications pour différentes plateformes (Android, iOS, Windows mobile) en HTML, CSS et JavaScript.

La librairie prend en charge l'initialisation de l'application Cordova ainsi qu'un certain nombre de fonctionnalité génériques.    
Elle intègre également des outils de avec [l'espace collaboratif de l'IGN](https://espacecollaboratif.ign.fr/) telle que 
les remontées d'informaiton (Report) ou la gestion des flux WFS (ou couches Vecteur des guichets du collaboratif).    
Elle permet également la mise en cache des couches du Géoportail sur un mobile (CacheMap) ou de données vecteur (WFS, Vecteur Collaboratif).

## Utilisation de la bibliothèque dans un projet

Installer la bibliothèque via npm :
```
npm install git+http://gitlab.dockerforge.ign.fr/express/cordovapp.git
```

## Installation

Pour installer la bibliothèque en locale afin de pouvoir générer la documentation ou lancer une analyse de code, lancer la commande :
```
npm install
```

### Générer la doc

Pour générer la documentation dans le répertoire `./doc` du projet, lancer la commande :

```
npm run doc
```

### Analyse du code

Pour lancer une analuse de code sur le projet, lancer la commande :

```
npm run lint
```
