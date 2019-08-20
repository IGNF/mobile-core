# CordovApp

Bibliothèque pour le dévelopement d'applications utilisant [Cordova](https://cordova.apache.org/docs/en/latest/guide/platforms/index.html).    
Celui-ci permet de créer des applications pour différentes plateformes (Android, iOS, Windows mobile) en HTML, CSS et JavaScript.

La librairie prend en charge l'initialisation de l'application Cordova ainsi qu'un certain nombre de fonctionnalité génériques.    
Elle intègre également des outils de avec [l'espace collaboratif de l'IGN](https://espacecollaboratif.ign.fr/) telle que 
les remontées d'informaiton (RIPart) ou la gestion des flux WFS (ou couches Webpart des guichets).    
Elle permet également la mise en cache des couches du Géoportail sur un mobile (CacheMap) ou de données vecteur (WFS, Layer Webpart).

## Objet CordovApp

Afin de simplifier l'utilisation de Cordova, un base applicative a été développée : CordovApp (dans le fichier js/wapp/cordovapp.js de l'application). 
Le but est de simplifier et unifier l'initialisation de l'application.

L'objet CordovApp définit une application standard et prend en charge :
* l'initialisation de l'application
* chargement de la lib Cordova et des fonts
* la mise en pause ou la fermeture de l'application
* la gestion des bouton android (menu/backbutton)
* la sauvegarde des paramètres
* le chargement des pages et des templates
* ainsi que quelques fonctionnalités utiles (aide en ligne, dialogues, input clear, gestion du focus...).

La première chose à faire est donc de créer une application et surcharger les fonctionnalités utiles 
(initialize, onMenuButton, onBackButton, pause, resume, quit).    
La fonction initialize est appelée lorsque le système est initialisé et l'application peut se lancer.

```javascript
var wapp = new CordovApp({
  /**
  * Initilize the application map 
  * @method
  */
  initialize: function() {
    /* initialiser l'application */
  }
});
```
