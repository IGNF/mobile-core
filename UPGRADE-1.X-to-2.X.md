# 2.X

- La version 2.X de cordovapp est branchée sur la nouvelle api de l'espace collaboratif: https://espacecollaboratif.ign.fr/gcms/api/doc
- Elle utilise le module http://gitlab.dockerforge.ign.fr/collaboratif/collaboratif-client-api qui offre des raccourcis vers les fonctionnalités de l'api et qui gère toute la partie authentification avec demande de token, rafraîchissement etc...
- Le passage de la 1.X à la 2.X ne permet pas la récupération des données du cache.

# Conventions de nommage

ripart est renommé en report pour correspondre à la nouvelle nomenclature de l'api. De la même façon:
group => community (pas de renommage systématique dans le code)
featureType => table
featureAttributeType => column
Webpart => CollabVector ou Collaboratif (pour le style.)

De manière générale, la façon d'accéder aux données a changé. Les informations sont à retrouvées dans la documentation de l'api.

# Evolutions

## Gestion des fichiers
Le plugin filetransfer étant déprécié la fonction dowloadFile de File.js est supprimée. A remplacer par la fonction downloadFile pour la récupération du fichier ou par la fonction saveData pour la sauvegarde une fois que le fichier a été téléchargé.
A l'inverse pour l'upload de fichiers on utilise la fonction getBlob de File.js

## Gestion des utilisateurs et des groupes
La gestion de l'utilisateur et du groupe actif est séparée de la gestion des signalements. Elle est gérée par la classe collaboratif/UserManager. Elle stocke en cache les paramètres suivants:
- user => l'objet utilisateur issu de la requête /api/users/me
- communities => objets issus des requêtes /api/communities/{id} + [/api/communities/{id}/layers + /api/geoservices/{id} + /api/databases/{dbId}/tables/{id}] pour récupérer la configuration de toutes les couches
- active_community => l'identifiant du groupe actif sur l'application 

Les paramètres dans le localStorage évoluent donc ainsi:
- wapp.param.ripart.guichet => wapp.param.user.active_community
- wapp.param.ripart.user => wapp.param.user.username
- wapp.param.ripart.password => wapp.param.user.password
- wapp.param.ripart.groupes => wapp.param.user.communities

3 évènements sont déclenchés par UserManager sur $(document):
- api_connect: lors de la connexion d'un utilisateur
- api_disconnect: lors de la deconnexion d'un utilisateur
- changegroup: lors d'un changement de groupe actif

La changement de groupe actif sur l'application n'entraîne pas le changement de groupe actif sur le site web. Le groupe actif signifie que:
- les couches affichées sont celles du groupe
- la couche des signalements affiche les signalements du groupe actif
- si un guichet est associé au groupe, il apparaîtra dans le menu mon guichet tel qu'actuellement
- il s'agit du groupe par défaut pour créer un nouveau signalement
- on affiche ce nom et ce logo dans le bandeau en haut du menu

Il est possible de faire des signalements sur un autre groupe que le groupe actif pour reprendre la même philosophie que dans le site web. En effet, le changement de profil dans la classe Report n'entraîne pas le changement de groupe actif dans la classe UserManager.

## L'authentification

Un fichier .env doit être renseigné (voir exemple dans .env.dist) avec les informations liées au client pour communiquer avec l'iam. Les informations de l'utilisateur seront renseignées via la fonction setUser du UserManager. On ne sauvegarde jamais en cache le mot de passe de l'utilisateur en clair. La fonction getPassword retourne le mot de passe encrypter qui pourra être setté tel quel avec le paramètre encrypted à true de setUser. Pour l'encodage du mot de passe, c'est la variable SECRET du .env qui est utilisée.

## Les signalements

Pour les signalements en local, plus de champs lon, lat. On a un champs geometry en wkt en wgs84 pour être au plus proche des signalements existants récupérés via l'api.
Les signalements ne peuvent avoir qu'un seul et unique thème (le multi-thème a été supprimé sur le collaboratif car peu -ou pas- utilisé). Ainsi la notation des attributs est simplifiée avec suppression du thème. C'est maintenant un tableau nomattribut => valeur stringifié.
Le champs themes est également simplifié. On passe de la notation ""id_groupe::theme"=>1" à id_groupe::theme (pas de json car ça fait planter la boîte de dialogue)

# Evolutions du code
dans Report.js:

- getServiceUrl - setServiceUrl - setUser - getUserInfos - getGroupById - getGuichet déplacées dans UserManager
- getHash est supprimé (l'authentification vers l'api est gérée par un autre module)
- getUser est scindé en getUser et getPassword dans UserManager
- getGeorem et getGeorems n'existent plus. On utilise les fonctions de l'api cliente directement.
- Idem pour sendRequest - postGeorep
- Report.isService inclus dans setServiceUrl
- formatAttributString n'existe plus. On fonctionne avec du json
- deconnect -> disconnect dans UserManager

dans ReportForm.js

- connectDialog - getLogo déplacées dans UserManagerTemplating
- deconnect -> disconnect dans UserManagerTemplating
- checkUserInfo est déplacé dans UserManager

# @TODO

- Avorter les requêtes lorsque c'est nécessaire notamment sur CollabVectorSource. Voir https://axios-http.com/fr/docs/cancellation
- Continuer le remplacement des callbacks pour ne fonctionner qu'avec des promesses (pour l'instant on a un fonctionnement mixte parce que trop long de tout réécrire)
- Faire une fonction générale de remontée des erreurs Axios à l'utilisateur (on fait un peu toujours la même chose: regarder le status, traduire etc...)
- Pouvoir garder en cache la modification de l'ordre des couches