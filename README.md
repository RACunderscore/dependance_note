# 🎵 tp_note IoC - HUMBERT Thomas

API permettant de retourner une musique choisie par un utilisateur en fonction du **jour de la semaine** et de la **météo**.

## Architecture

Le projet utilise une **architecture hexagonale** basée sur les éléments suivants :

```text
Controller
    ↓
Service
    ↓
Adapter
```

### Factory

Une **Factory** est utilisée pour gérer dynamiquement la sélection du service à utiliser :

* `MusicService` : retourne la musique correspondant aux choix de l'utilisateur.
* `DefaultMusicService` : retourne une musique par défaut lorsque les paramètres sont invalides ou lorsqu'une erreur survient.

### Facade

Une **Facade** est utilisée pour centraliser l'envoi des notifications.

Lorsqu'une musique personnalisée est trouvée, elle est envoyée simultanément :

* par **Email**
* par **SMS**

Lorsqu'une musique par défaut est utilisée, **aucune notification n'est envoyée**.

---

## Installation

Installer les dépendances du projet :

```bash
npm install
```

Puis lancer le serveur en mode développement :

```bash
npm run dev
```

L'API est ensuite accessible sur :

```text
http://<ip>:3000
```

---

## Utilisation de l'API

L'endpoint permettant de récupérer une musique est :

```http
GET /music/:id_user/:day/:weather
```

### Exemple

```text
http://<ip>:3000/music/1/LUNDI/SOLEIL
```

### Paramètres

| Paramètre | Description                  |
| --------- | ---------------------------- |
| `id_user` | Identifiant de l'utilisateur |
| `day`     | Jour de la semaine           |
| `weather` | Conditions météorologiques   |

---

## Jours disponibles

Les jours acceptés sont :

* `LUNDI`
* `MARDI`
* `MERCREDI`
* `JEUDI`
* `VENDREDI`
* `SAMEDI`
* `DIMANCHE`

Les paramètres ne sont pas sensibles à la casse.

Par exemple :

```text
LUNDI
lundi
LuNdI
```

sont tous acceptés.

---

## Météos disponibles

Les conditions météorologiques acceptées sont :

* `SOLEIL`
* `PLUIE`
* `NEIGE`
* `NUAGEUX`

Comme pour les jours, les paramètres ne sont pas sensibles à la casse.

Exemple :

```text
SOLEIL
soleil
SoLeIl
```

sont tous acceptés.

---

## Gestion des erreurs

Si l'un des paramètres envoyés est invalide, ou si aucune musique personnalisée ne peut être trouvée, l'API utilise le `DefaultMusicService`.

Une **musique par défaut correspondant au jour demandé** est alors retournée.

Dans ce cas :

* la musique par défaut est retournée à l'utilisateur ;
* aucune notification SMS ou Email n'est envoyée.

### Exemple

Une requête avec un jour invalide :

```text
GET /music/1/INVALID/SOLEIL
```

entraîne l'utilisation de la musique par défaut.

---

## Notifications

Lorsqu'une musique personnalisée est trouvée, la `NotificationFacade` déclenche les deux systèmes de notification :

```text
NotificationFacade
       ├── EmailRepo
       └── SmsRepo
```

Les deux adapters affichent actuellement la notification dans la console.

Exemple :

```text
EMAIL {
    id: 1,
    title: "...",
    artist: "...",
    album: "..."
}

SMS {
    id: 1,
    title: "...",
    artist: "...",
    album: "..."
}
```

---

## Tests

Pour lancer les tests unitaires :

```bash
npm run test
```

Les tests couvrent notamment :

* `MusicService`
* `DefaultMusicService`
* `MusicController`
* `MusicServiceFactory`
* `NotificationFacade`
* la configuration du conteneur IoC / DI

---

## Configuration du lecteur musical

Le lecteur musical utilisé par l'application peut être configuré à l'aide de la variable d'environnement `MUSIC_PLAYER` dans le fichier `.env`.

Deux lecteurs sont disponibles :

* `ITUNES` → utilise `MusicItuneRepo`
* `MUSICBRAINZ` → utilise `MusicBrainzRepo`

### Exemple de configuration

Pour utiliser iTunes :

```env
MUSIC_PLAYER=ITUNES
```

Pour utiliser MusicBrainz :

```env
MUSIC_PLAYER=MUSICBRAINZ
```

Cette configuration est utilisée par le conteneur IoC afin de sélectionner automatiquement l'adapter correspondant pour le `MusicService`.

```text
                    MUSIC_PLAYER
                         │
              ┌──────────┴──────────┐
              │                     │
           ITUNES              MUSICBRAINZ
              │                     │
              ▼                     ▼
      MusicItuneRepo         MusicBrainzRepo
              │                     │
              └──────────┬──────────┘
                         │
               MusicRepositoryPort
                         │
                         ▼
                  MusicService
```

Le `MusicDefaultRepo` est indépendant de cette configuration et reste utilisé par le `DefaultMusicService` pour fournir une musique par défaut en cas d'erreur ou de paramètre invalide. 
Les données présentes dans le projet utilise le lecteur ITUNES pour les tests.

### Valeur obligatoire

La variable `MUSIC_PLAYER` doit être définie dans le fichier `.env` avec l'une des valeurs suivantes :

```env
MUSIC_PLAYER=ITUNES
```

ou

```env
MUSIC_PLAYER=MUSICBRAINZ
```

Une valeur différente provoque une erreur lors du démarrage de l'application afin d'éviter une configuration incorrecte.

---

## ▶️ Résumé

Pour démarrer le projet :

```bash
npm install
npm run dev
```

Pour lancer les tests :

```bash
npm run test
```

Pour récupérer une musique :

```http
GET /music/:id_user/:day/:weather
```

Exemple :

```text
GET /music/1/LUNDI/SOLEIL
```
