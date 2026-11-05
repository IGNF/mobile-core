# Change Log

Tous les changements notables du projet sont documentés dans ce fichier.

Le format suit [Keep a Changelog](http://keepachangelog.com/)
et le projet suit [Semantic Versioning](http://semver.org/).

## [Unreleased]

### Added

### Changed

### Fixed

## [1.0.5] - 2026-11-05

### Added

### Changed

- `ol` passe en `peerDependencies` (`^10.6.1`) : l'application doit déclarer sa propre version d'OpenLayers, et une version hors de cette plage fait échouer l'installation au lieu d'ajouter une seconde copie.

### Fixed

- `ol`, `ol-ext` et `proj4` ne sont plus embarqués dans le `dist` : l'option `external` de Vite ne couvrait pas leurs sous-chemins, comme `ol/Feature`.


## [1.0.4] - 2026-11-03

### Added

### Changed

### Fixed

- Une tuile collaborative dont le chargement échoue est redemandée au plus trois fois, après 2 s, 4 s puis 8 s. Au-delà, elle reste marquée comme chargée jusqu'au prochain rafraîchissement.
- Une projection inconnue ou une URL WFS absente n'est pas rejouée.

## [1.0.3] - 2026-09-30

### Added

- Ajout de styles manquants liés au statut des signalements dans la const STATUS_STYLES

### Changed

### Fixed

## [1.0.2] - 2026-09-21

### Added

### Changed

### Fixed

- Corrige un problème de chargement des images (symbology) (l'authentification était requise)

## [1.0.1] - 2026-05-13

### Added

### Changed

- Mise à jour de la définition de l'interface 'Community'

### Fixed
