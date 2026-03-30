# @ign/mobile-core

Librairie TypeScript fournissant les fonctionnalites cartographiques et de cache pour les applications mobiles IGN. Basee sur OpenLayers 10.x, elle est framework-agnostique et ne contient aucune manipulation du DOM ni d'acces direct au systeme de fichiers.

## Table des matieres

- [Installation](#installation)
- [Architecture](#architecture)
  - [Abstractions de stockage](#abstractions-de-stockage)
  - [Communication par evenements](#communication-par-evenements)
- [Modules](#modules)
  - [Authentification (AuthManager)](#authentification)
  - [Cache](#cache)
    - [RasterCacheManager](#rastercachemanager)
    - [VectorCacheManager](#vectorcachemanager)
    - [ExtentManager](#extentmanager)
  - [Sources de donnees](#sources-de-donnees)
    - [CollabVectorSource](#collabvectorsource)
    - [WFSSource](#wfssource)
    - [ReportSource](#reportsource)
  - [Couches cartographiques](#couches-cartographiques)
    - [CollabVectorLayer](#collabvectorlayer)
    - [WFSLayer](#wfslayer)
  - [Collaboratif](#collaboratif)
    - [UserManager](#usermanager)
    - [DocumentManager](#documentmanager)
  - [Signalements](#signalements)
    - [ReportManager](#reportmanager)
    - [ReportValidator](#reportvalidator)
    - [SketchManager](#sketchmanager)
  - [Styles](#styles)
    - [CollabStyler](#collabstyler)
    - [StyleManager](#stylemanager)
  - [Utilitaires](#utilitaires)
- [Interfaces de stockage](#interfaces-de-stockage)
  - [ICacheStorage](#icachestorage)
  - [IReportStorage](#ireportstorage)
  - [IUserStorage](#iuserstorage)
- [Configuration du build](#configuration-du-build)
- [Commandes](#commandes)

## Installation

```bash
npm install @ign/mobile-core
```

**Dependances principales :**

- `ol` (OpenLayers 10.x)
- `ol-ext` (4.x)
- `proj4`
- `collaboratif-client-api`

## Architecture

### Abstractions de stockage

La librairie n'accede **jamais** directement au systeme de fichiers ou aux APIs de l'appareil. Tout acces au stockage passe par des interfaces (`ICacheStorage`, `IReportStorage`, `IUserStorage`) que l'application consommatrice doit implementer.

Cela permet :
- De tester avec un stockage en memoire
- D'utiliser differents backends (Capacitor, localStorage, IndexedDB...)
- De garder la librairie independante de toute plateforme

```typescript
import { ICacheStorage } from '@ign/mobile-core';

// L'application consommatrice fournit l'implementation
class MonCacheStorage implements ICacheStorage {
  async saveTile(key: string, data: Blob): Promise<void> {
    // Implementation specifique a votre plateforme
  }
  async getTile(key: string): Promise<Blob | null> {
    // ...
  }
  // ... autres methodes
}
```

### Communication par evenements

La librairie utilise un systeme d'evenements type (`EventManager`) pour communiquer les changements d'etat. Aucun callback DOM, aucune manipulation d'interface.

```typescript
import { EventManager } from '@ign/mobile-core';

const events = new EventManager();

events.on('cache:progress', (data) => {
  console.log(`Progression : ${data.percent}%`);
});

events.once('cache:complete', (data) => {
  console.log('Telechargement termine');
});
```

**Methodes disponibles :**
- `on(event, listener)` - Ecouter un evenement
- `once(event, listener)` - Ecouter une seule fois
- `off(event, listener)` - Retirer un ecouteur
- `emit(event, payload?)` - Emettre un evenement

## Modules

### Authentification

`AuthManager` gere l'authentification OAuth et par mot de passe.

```typescript
import { AuthManager } from '@ign/mobile-core';

const auth = new AuthManager({
  apiBaseUrl: 'https://api.example.com',
  oAuthBaseUrl: 'https://auth.example.com',
  oAuthClientId: 'mon-client-id',
});

// Connexion par mot de passe
const result = await auth.loginWithPassword('email@example.com', 'motdepasse');

// Connexion OAuth (flux PKCE)
const oauthResult = await auth.loginWithOAuth('myapp://callback');

// Rafraichissement du token
const refreshed = await auth.refreshAccessToken(tokens.refreshToken);

// Verification de l'expiration
const expired = await auth.isAccessTokenExpired(60); // buffer de 60s

// Deconnexion
await auth.logout(accessToken, refreshToken);
```

**Types retournes :**
- `AuthResult` - `{ success, user?, tokens?, error? }`
- `AuthTokens` - `{ accessToken, refreshToken, idToken, expiresIn, refreshExpiresIn }`
- `RefreshResult` - `{ success, tokens?, error? }`

---

### Cache

Le systeme de cache permet de telecharger et stocker des tuiles raster et des entites vectorielles pour une utilisation hors-ligne.

#### RasterCacheManager

Gestion du cache des tuiles raster (couches Geoportail).

```typescript
import { RasterCacheManager } from '@ign/mobile-core';

const rasterCache = new RasterCacheManager(monCacheStorage, layerGroup, {
  apiKey: 'ma-cle-api',
  dirName: 'geoportail',
});

// Creer un cache raster
const cacheId = await rasterCache.createCache({
  id: 'mon-cache',
  name: 'Zone Paris',
  layer: 'GEOGRAPHICALGRIDSYSTEMS.PLANIGNV2',
  extent: [2.25, 48.81, 2.42, 48.90],
  minZoom: 10,
  maxZoom: 16,
  projection: 'EPSG:3857',
});

// Charger un cache comme couche
await rasterCache.loadCache('mon-cache');

// Gerer le telechargement
await rasterCache.startDownload('mon-cache');
await rasterCache.pauseDownload('mon-cache');
const progress = await rasterCache.getDownloadProgress('mon-cache');

// Supprimer un cache
await rasterCache.deleteCache('mon-cache');
```

**Evenements emis :**
- `cache:download:start`, `cache:download:pause`, `cache:download:cancel`
- `cache:layer:add`, `cache:layer:remove`
- `cache:error`

#### VectorCacheManager

Gestion du cache des entites vectorielles.

```typescript
import { VectorCacheManager } from '@ign/mobile-core';

const vectorCache = new VectorCacheManager(monCacheStorage, apiClient);

// Recuperer les couches en cache pour une communaute
const layers = await vectorCache.getCacheLayers(community);

// Ajouter au cache
await vectorCache.addCache('ma-carte', layers);

// Supprimer du cache
await vectorCache.deleteCache('mon-id');
```

#### ExtentManager

Gestion des emprises geographiques des zones cachees.

```typescript
import { ExtentManager } from '@ign/mobile-core';

const extents = new ExtentManager(monCacheStorage);

// Ajouter une emprise
await extents.addExtent('paris', [2.25, 48.81, 2.42, 48.90]);

// Ajouter une emprise supplementaire
await extents.appendExtent('paris', [2.42, 48.81, 2.50, 48.90]);

// Recuperer les emprises
const zones = await extents.get('paris');

// Lister les noms
const noms = await extents.getNames();

// Union de plusieurs emprises
const union = await extents.getAllInOneExtent(['paris', 'lyon']);

// Supprimer une emprise
await extents.deleteExtent('paris');
```

---

### Sources de donnees

Les sources etendent `VectorSource` d'OpenLayers et gerent le chargement des entites depuis differents backends.

#### CollabVectorSource

Source pour les couches vectorielles collaboratives avec backend WFS.

```typescript
import { CollabVectorSource } from '@ign/mobile-core';

const source = new CollabVectorSource({
  table: maTable,            // Definition de la table
  client: apiClient,         // Client API
  online: true,
  outputFormat: 'JSON',
  cache: monCacheStorage,    // Optionnel : cache hors-ligne
  useCacheWhenOnline: false,
});

// Acces aux collections de suivi local
source.insertedFeatures;    // Entites ajoutees localement
source.updatedFeatures;     // Entites modifiees localement
source.deletedFeatures;     // Entites supprimees localement
source.preservedFeatures;   // Entites persistantes entre rechargements
```

**Strategies de chargement :** `bbox` (par emprise) ou `tile` (par tuile).

#### WFSSource

Source WFS generique avec support de l'authentification.

```typescript
import { WFSSource } from '@ign/mobile-core';

const source = new WFSSource({
  geoservice: monGeoservice,
  accessToken: 'mon-token',
  tokenType: 'Bearer',
  minZoom: 12,
  srs: 'EPSG:3857',
});

// Modifier l'authentification a la volee
source.setAuthentication('user', 'pass', 'token', 'Bearer');
```

#### ReportSource

Source pour les signalements (georep/georem) avec support du filtrage et de la pagination.

```typescript
import { ReportSource } from '@ign/mobile-core';

const source = new ReportSource({
  client: apiClient,
  communityId: 42,
  projection: 'EPSG:3857',
  filter: {
    themeIds: [1, 2, 3],
    status: ['Pending', 'Valid'],
  },
  loadClosed: false,
  cache: monCacheStorage,    // Fallback hors-ligne
});

// Charger des signalements
const reports = await source.loadReports(extent);
```

---

### Couches cartographiques

Les couches etendent `VectorLayer` d'OpenLayers et encapsulent la creation de la source et du style.

#### CollabVectorLayer

Couche pour les donnees collaboratives. Configure automatiquement la source, les niveaux de zoom et les styles.

```typescript
import { CollabVectorLayer } from '@ign/mobile-core';

const layer = new CollabVectorLayer({
  database: 'ma-base',
  name: 'ma-table',
  url: 'https://wfs.example.com',
  client: apiClient,
  table: maTable,
  style: monStyle,
});

// Verifier si la source est prete
if (layer.isReady()) {
  const table = layer.getTable();
}
```

**Fonctionnalites automatiques :**
- Creation de `CollabVectorSource`
- Configuration des niveaux de zoom depuis la table
- Parsing des conditions de style JSON
- Application de `CollabStyler` comme fonction de style

#### WFSLayer

Couche WFS avec GetCapabilities et support d'authentification personnalisee.

```typescript
import { WFSLayer } from '@ign/mobile-core';

const layer = new WFSLayer({
  geoservice: monGeoservice,
  accessToken: 'mon-token',
  visibility: true,
  opacity: 0.8,
  style: monStyle,
  getCapabilities: true,
});
```

---

### Collaboratif

#### UserManager

Gestion de l'utilisateur connecte et de ses communautes.

```typescript
import { UserManager } from '@ign/mobile-core';

const userManager = new UserManager({
  apiClient: apiClient,
  storage: monUserStorage,
  baseUrl: 'https://api.example.com',
});

// Recuperer l'utilisateur
const user = await userManager.getUser();

// Recuperer les communautes
const communities = await userManager.getCommunities();

// Communaute active
const active = await userManager.getActiveCommunity();

// Informations sur les couches d'une communaute
const layers = await userManager.getLayersInfo(communityId);

// Ecouter les evenements
userManager.on('user:connect', (data) => { /* ... */ });
userManager.on('community:change', (data) => { /* ... */ });
userManager.on('user:error', (data) => { /* ... */ });
```

**Evenements :** `user:connect`, `user:disconnect`, `community:change`, `user:error`

#### DocumentManager

Gestion de l'upload de documents et photos.

```typescript
import { DocumentManager } from '@ign/mobile-core';

const docManager = new DocumentManager(apiClient);

// Upload d'un document collaboratif
const docId = await docManager.addCollaborativeDocument({
  name: 'photo.jpg',
  mimeType: 'image/jpeg',
  contentBase64: '...',
});

// Recuperer l'URL d'un document
const url = docManager.getDocumentUrl(42);

// Supprimer un document
await docManager.deleteDocument(42);
```

---

### Signalements

Le module de signalements (georep/georem) gere la creation, la validation et la soumission de signalements geolocalises.

#### ReportManager

Creation et soumission de signalements.

```typescript
import { ReportManager } from '@ign/mobile-core';

const reportManager = new ReportManager(apiClient, monReportStorage, {
  communityId: 42,
  themeId: 5,
  projection: 'EPSG:3857',
});

// Creer un signalement
const report = await reportManager.createReport({
  geometry: 'POINT(2.35 48.86)',
  comment: 'Probleme identifie ici',
  attributes: { type: 'degradation', severite: 'haute' },
  photos: [],
});

// Soumettre au serveur
await reportManager.submitReport(report.id);
```

**Evenements :** `report:created`, `report:updated`, `report:deleted`, `report:submitted`, `report:error`, `attachment:uploading`, `attachment:uploaded`

#### ReportValidator

Validation des signalements avant soumission.

```typescript
import { ReportValidator } from '@ign/mobile-core';

// Valider un signalement complet
const { valid, error } = ReportValidator.validate(report);

// Valider un attribut individuel
const attrResult = ReportValidator.validateAttribute('severite', 'haute', attributeDefinition);
```

**Regles de validation :**
- Geometrie, commentaire et attributs obligatoires requis
- Verification de type (nombre, select, date)
- Validation personnalisee par attribut

#### SketchManager

Outils de dessin geometrique sur la carte (points, lignes, polygones, cercles).

```typescript
import { SketchManager } from '@ign/mobile-core';

const sketcher = new SketchManager({
  map: olMap,
  source: vectorSource,
  enableUndo: true,
  callbacks: {
    onFeatureAdded: (feature) => { /* ... */ },
    onFeatureSelected: (feature) => { /* ... */ },
    onFeatureModified: (feature) => { /* ... */ },
    onFeatureDeleted: (feature) => { /* ... */ },
    onModeChange: (mode) => { /* ... */ },
  },
});
```

**Modes d'interaction :** `draw-point`, `draw-linestring`, `draw-polygon`, `draw-circle`, `modify`, `select`

**Actions :** `back`, `drawPoint`, `drawLine`, `drawPolygon`, `drawCircle`, `modify`, `select`, `delete`, `undo`

---

### Styles

#### CollabStyler

Moteur d'evaluation de styles pour les entites collaboratives. Supporte une syntaxe de conditions de type MongoDB.

```typescript
import { CollabStyler } from '@ign/mobile-core';

// Obtenir une fonction de style pour une table
const styleFunction = CollabStyler.getFeatureStyleFunction(table, cacheUrl, sourceOptions);

// Appliquer a une couche
layer.setStyle(styleFunction);
```

**Operateurs supportes :**
- Comparaison : `$eq`, `$ne`, `$gt`, `$gte`, `$lt`, `$lte`
- Ensemble : `$in`, `$nin`
- Existence : `$exists`
- Regex : `$regex`
- Logiques : `$and`, `$or`, `$nor`

#### StyleManager

Utilitaire de creation de styles OpenLayers a partir de regles declaratives.

```typescript
import { StyleManager } from '@ign/mobile-core';

const styleManager = new StyleManager();

// Creer un style OpenLayers depuis une regle
const style = styleManager.createStyle({
  fillColor: 'rgba(255, 0, 0, 0.3)',
  strokeColor: '#ff0000',
  strokeWidth: 2,
  pointRadius: 8,
  graphicName: 'circle',
  label: 'Mon point',
  labelColor: '#000',
  labelSize: 12,
});

// Style par defaut
const defaultStyle = styleManager.getDefaultMobileCoreStyle();
```

**Proprietes `StyleRule` disponibles :**

| Categorie | Proprietes |
|-----------|-----------|
| Remplissage | `fillColor`, `fillOpacity`, `fillPattern`, `patternColor` |
| Contour | `strokeColor`, `strokeWidth`, `strokeDashstyle`, `strokeOpacity`, `strokeLinecap` |
| Icone/Image | `icon`, `iconSize`, `externalGraphic`, `graphicWidth`, `graphicHeight`, `pointRadius`, `graphicName` |
| Texte | `label`, `labelColor`, `labelSize`, `fontWeight`, `fontSize`, `fontFamily`, `labelRotation` |

---

### Utilitaires

| Utilitaire | Description |
|-----------|-------------|
| `EventManager` | Systeme d'evenements type avec `on`/`off`/`once`/`emit` |
| `ProjectionUtils` | Configuration proj4 et transformations de coordonnees |
| `AttributesHelper` | Validation de dates et helpers d'attributs |
| `PathUtils` | Parsing d'URLs et nettoyage de noms de fichiers |

---

## Interfaces de stockage

L'application consommatrice doit implementer ces interfaces pour fournir l'acces au stockage.

### ICacheStorage

```typescript
interface ICacheStorage {
  // Tuiles
  saveTile(key: string, data: Blob): Promise<void>;
  getTile(key: string): Promise<Blob | null>;
  deleteTile(key: string): Promise<void>;
  listTiles(prefix: string): Promise<string[]>;

  // Metadonnees
  saveMetadata(key: string, data: any): Promise<void>;
  getMetadata(key: string): Promise<any>;
  deleteMetadata(key: string): Promise<void>;
  listMetadata(prefix: string): Promise<string[]>;

  // Entites vectorielles
  saveFeatures(layerId: string, features: any[]): Promise<void>;
  loadFeatures(layerId: string): Promise<any[]>;
  deleteFeatures(layerId: string): Promise<void>;

  // Operations globales
  clear(): Promise<void>;
  getUsedSpace(): Promise<number>;
  getFreeSpace(): Promise<number>;
}
```

### IReportStorage

```typescript
interface IReportStorage {
  // CRUD signalements
  saveReport(report: Report): Promise<void>;
  getReport(id: number): Promise<Report | null>;
  deleteReport(id: number): Promise<void>;
  listReports(): Promise<Report[]>;

  // Photos
  getBlob(photo: ReportPhoto): Promise<Blob>;

  // Parametres
  saveParam(key: string, value: any): Promise<void>;
  getParam(key: string): Promise<any>;
  clearParam(key: string): Promise<void>;
}
```

### IUserStorage

```typescript
interface IUserStorage {
  // Utilisateur
  saveUser(user: User): Promise<void>;
  getUser(): Promise<User | null>;
  clearUser(): Promise<void>;

  // Parametres
  saveParam(key: string, value: any): Promise<void>;
  getParam(key: string): Promise<any>;
  clearParam(key: string): Promise<void>;

  // Communautes
  saveCommunities(communities: Community[]): Promise<void>;
  getCommunities(): Promise<Community[]>;
  setActiveCommunity(id: number): Promise<void>;
  getActiveCommunity(): Promise<Community | null>;

  // Identifiants
  saveCredentials(credentials: any): Promise<void>;
  getCredentials(): Promise<any>;
  clearCredentials(): Promise<void>;
}
```

---

## Configuration du build

Le projet utilise :
- **TypeScript** en mode strict pour les definitions de types
- **Vite** en mode librairie pour la sortie ES module
- Les dependances externes ne sont pas bundlees
- Source maps et declaration maps activees

## Commandes

```bash
npm run dev        # Mode watch pour le developpement
npm run build      # Build complet (tsc + vite)
npm run clean      # Nettoyage du repertoire dist
npm run typecheck  # Verification des types sans build
```
