# 📚 Documentation des Composants - Application Memory

Cette documentation présente les différents composants utilisés dans l'application **Memory**. Chaque composant est décrit avec sa fonctionnalité et son usage.

---
# Liste des composants

## 1. [button-create.vue](#1-Bouton-de-Création)
Un bouton permettant de créer un nouvel élément.

## 2. [button-delete.vue](#2-Bouton-de-Suppression)
Un bouton permettant de supprimer un élément.

## 3. [button-view.vue](#3-Bouton-pour-Voir-la-Réponse)
Un bouton permettant de visualiser un élément.

## 4. [cardTheme.vue](#Composant-CardTheme)
Composant représentant une carte pour afficher un thème avec ses détails.

## 5. [modalMemory.vue](#modal-Memory)
Composant modal pour gérer des mémoires ou des interactions spécifiques avec l'utilisateur.

## 6. [categorie.vue](#-Composant-Catégorie)
Composant représentant une catégorie d'éléments, souvent utilisé pour organiser les contenus.

## 7. [header.vue](#-Composant-Header)
Composant pour l'en-tête de l'interface utilisateur, souvent utilisé pour afficher le titre et les éléments de navigation.

## 8. [IconCommunity.vue](#1-Icône-de-la-Communauté)
Icône représentant une communauté. Ce composant est utilisé pour illustrer des sections liées à la communauté.

## 9. [iconDocumentation.vue](#2-Icône-de-Documentation)
Icône représentant la documentation. Utilisée pour des liens ou des sections relatifs à la documentation.

## 10. [IconEcosystem.vue](#3-Icône-de-lÉcosystème)
Icône représentant l'écosystème d'un produit ou service, souvent utilisé dans des sections informatives.

## 11. [IconSupport.vue](#4-Icône-du-Support)
Icône utilisée pour accéder à la section de support ou d'aide.

## 12. [IconTooling.vue](#5-Icône-du-Support-Technique)
Icône représentant des outils ou des services liés au développement et à l'intégration de l'application.

## 13. [createTheme.vue](#CreateTheme)
Composant permettant la création d'un nouveau thème avec des options de personnalisation (nom, description, etc.).

## 🎯 Composants de Boutons

### 1. **Bouton de Création**
- **Description** : Ce bouton permet d'initier la création d'une nouvelle ressource dans l'application.
- **Fonctionnalité** : Permet de lancer une action de création, généralement utilisée pour ajouter une nouvelle carte de révision.
- **Icône** : Le bouton affiche une coche (**CheckIcon**) à côté du texte "Créer".
- **Classe CSS** :
    - `bg-indigo-600` : Fond bleu indigo
    - `text-white` : Texte en blanc
    - `hover:bg-indigo-500` : Fond changeant lors du survol
    - `focus-visible:outline-indigo-600` : Bordure visible lorsqu'on interagit avec le bouton
    - `inline-flex items-center` : Alignement du texte et de l'icône

---

### 2. **Bouton de Suppression**
- **Description** : Ce bouton est utilisé pour supprimer une ressource de l'application.
- **Fonctionnalité** : Permet de supprimer une ressource ou un élément, souvent accompagné d'une confirmation avant l'exécution de l'action.
- **Icône** : Le bouton utilise l'icône **CheckIcon**, identique à celle du bouton de création.
- **Classe CSS** :
    - `bg-red-600` : Fond rouge, indiquant une action potentiellement destructrice
    - `text-white` : Texte en blanc
    - `hover:bg-indigo-500` : Fond changeant lors du survol
    - `focus-visible:outline-indigo-600` : Bordure visible lors de l'interaction
    - `inline-flex items-center` : Alignement du texte et de l'icône

---

### 3. **Bouton pour Voir la Réponse**
- **Description** : Ce bouton permet d'afficher ou de révéler une réponse cachée dans l'application.
- **Fonctionnalité** : Utilisé pour afficher la réponse d'une carte de révision ou pour montrer des informations supplémentaires.
- **Icône** : Aucune icône, ce bouton affiche simplement le texte "Voir la réponse".
- **Classe CSS** :
    - `bg-black` : Fond noir
    - `text-white` : Texte en blanc
    - `hover:bg-indigo-500` : Fond changeant au survol
    - `focus-visible:outline-indigo-600` : Bordure visible lors de l'interaction
    - `inline-flex items-center` : Alignement du texte

---

## 🚀 Fonctionnalités principales des Boutons

1. **Bouton de Création** : Permet de lancer une action de création de ressource.
2. **Bouton de Suppression** : Permet de supprimer une ressource avec confirmation.
3. **Bouton Voir la Réponse** : Permet d'afficher une réponse cachée sur une carte.

Ces boutons utilisent des classes de **Tailwind CSS** pour garantir une interface utilisateur fluide et réactive, tout en intégrant des icônes de la bibliothèque **Heroicons** pour améliorer l'expérience visuelle.

---

## 🛠️ Technologies utilisées pour les boutons

- **Vue.js** : Pour la gestion de l'interactivité et des états des composants.
- **Tailwind CSS** : Pour le stylisme et la gestion des états au survol et à la mise au point.
- **Heroicons** : Pour les icônes utilisées dans les boutons.

---
# Composant CardTheme

## Description

Le composant **CardTheme** est une carte modale utilisée pour afficher les détails d'une carte de révision. Il présente à l'utilisateur le **recto** (question) et **verso** (réponse) d'une carte, avec la possibilité d'afficher une image associée à la carte. Le composant utilise des transitions et des animations pour une expérience utilisateur fluide.

---

## 🚀 Fonctionnalités principales

### 📄 Affichage du recto et du verso de la carte
- **Recto** : Affiche le nom de la carte et la question. Si une image est associée à la carte, elle est également affichée.
- **Verso** : Affiche la réponse associée à la question.

### 🎨 Transitions et animations
- Le composant utilise des animations de **transition** pour l'apparition et la disparition de la modale.
- Lors de la transition, une animation de **glissement** et d'**opacité** est appliquée pour donner un effet fluide et agréable.

### 🖼️ Affichage d'une image
- Si une image est liée à la carte, elle est affichée dans le recto. L'image est rendue conditionnellement si elle existe et est non vide.

### ✨ Fermeture et retour
- L'utilisateur peut fermer la modale en cliquant sur un bouton "Retour", qui ferme la fenêtre et réinitialise l'état de la carte.
- La réponse (verso) est visible en cliquant sur un bouton dédié, permettant à l'utilisateur de basculer entre le recto et le verso de la carte.

### 🔄 Gestion de l'état
- La visibilité du recto et du verso est contrôlée par un état `isView`, qui est un **boolean**. Lorsqu'il est activé, le verso est affiché.

### 🚪 Fermeture de la modale
- La modale peut être fermée en cliquant en dehors de la boîte ou en utilisant un bouton de fermeture spécifique.

---

## 🧩 Composants intégrés

- **ButtonView** : Un bouton personnalisé utilisé pour basculer entre l'affichage du recto et du verso de la carte.
- **Dialog** et **DialogPanel** (de **Headless UI**) : Utilisés pour créer une modale accessible avec des animations de transition.
- **ExclamationTriangleIcon** (de **Heroicons**) : Icone d'avertissement, si nécessaire.

---

## 🔧 Propriétés (Props)

### `open`
- **Type** : `boolean`
- **Description** : Détermine si la modale est ouverte ou fermée.

### `question`
- **Type** : `string | null`
- **Description** : Contient la question de la carte de révision.

### `nameCard`
- **Type** : `string | null`
- **Description** : Le nom de la carte.

### `responseC`
- **Type** : `string | null`
- **Description** : La réponse associée à la carte.

### `image`
- **Type** : `string | null`
- **Description** : L'URL de l'image associée à la carte. Si elle est présente, elle sera affichée.

---

## 🎯 Événements émis

### `close`
- **Description** : Événement émis pour fermer la modale. Il est déclenché lors du clic sur le bouton "Retour" ou lorsqu'on clique en dehors de la modale.

---

## 🛠️ Fonctionnement interne

1. **Vue dynamique** : Le composant gère l'affichage dynamique entre le recto et le verso de la carte à l'aide de la variable `isView`.
2. **Modalité** : La modale est contrôlée via le composant `Dialog` de **Headless UI**, avec une gestion des transitions d'entrée et de sortie.
3. **Image conditionnelle** : L'image de la carte est affichée si l'URL est fournie et valide.

---

## 📜 Exemple d'utilisation

```vue
<CardTheme 
  :open="isCardOpen" 
  :question="cardQuestion" 
  :nameCard="cardName" 
  :responseC="cardResponse" 
  :image="cardImage" 
  @close="closeCard"
/>
```
# modal Memory

## Description

Le composant **CardTheme** est une modale interactive utilisée pour afficher une carte de révision. Ce composant permet de visualiser le **recto** (question) et le **verso** (réponse) d'une carte, avec un support pour afficher des images. Il inclut des animations de transition pour une expérience fluide et permet à l'utilisateur de basculer entre le recto et le verso de la carte.

---

## 🚀 Fonctionnalités principales

### 📄 Affichage du recto et du verso de la carte
- **Recto** : Affiche le nom de la carte et la question. Si une image est associée à la carte, elle est affichée.
- **Verso** : Affiche la réponse associée à la carte.

### 🎨 Transitions et animations
- Le composant utilise des animations de **transition** pour l'apparition et la disparition de la modale. Ces transitions incluent un effet de **glissement** et d'**opacité**.

### 🖼️ Affichage conditionnel de l'image
- Si une image est fournie, elle est affichée dans le recto de la carte. L'image est conditionnellement rendue si elle existe et est valide.

### 🔄 Basculer entre recto et verso
- Un bouton permet à l'utilisateur de basculer entre l'affichage du recto et du verso de la carte. Le contenu de la carte est contrôlé par la variable `isView`, qui gère l'affichage dynamique du recto ou du verso.

### 🚪 Fermeture de la modale
- La modale peut être fermée en cliquant en dehors de la boîte ou en cliquant sur un bouton "Retour". Lors de la fermeture, un événement `close` est émis pour signaler la fermeture de la modale.

---

## 🧩 Composants intégrés

- **ButtonView** : Un bouton personnalisé utilisé pour basculer entre le recto et le verso de la carte.
- **Dialog** et **DialogPanel** (de **Headless UI**) : Utilisés pour créer une modale avec des transitions accessibles.
- **ExclamationTriangleIcon** (de **Heroicons**) : Icône d'avertissement, qui peut être utilisée si nécessaire.

---

## 🔧 Propriétés (Props)

### `open`
- **Type** : `boolean`
- **Description** : Indique si la modale doit être affichée ou non.

### `question`
- **Type** : `string | null`
- **Description** : La question à afficher sur le recto de la carte.

### `nameCard`
- **Type** : `string | null`
- **Description** : Le nom de la carte de révision.

### `responseC`
- **Type** : `string | null`
- **Description** : La réponse à afficher sur le verso de la carte.

### `image`
- **Type** : `string | null`
- **Description** : L'URL de l'image associée à la carte. Si elle est fournie, l'image sera affichée sur le recto de la carte.

---

## 🎯 Événements émis

### `close`
- **Description** : L'événement `close` est émis pour fermer la modale. Cela se produit lors du clic sur le bouton "Retour" ou en cliquant en dehors de la modale.

---

## 🛠️ Fonctionnement interne

1. **Vue dynamique** : Le composant bascule entre le recto et le verso de la carte grâce à la gestion de l'état `isView`, qui est un **boolean**.
2. **Modalité** : La modale est contrôlée par les composants `Dialog` et `DialogPanel` de **Headless UI**. Les transitions sont gérées pour offrir une expérience utilisateur fluide.
3. **Affichage conditionnel de l'image** : L'image est affichée uniquement si elle existe et si son URL est valide.

---

## 📜 Exemple d'utilisation

```vue
<CardTheme 
  :open="isCardOpen" 
  :question="cardQuestion" 
  :nameCard="cardName" 
  :responseC="cardResponse" 
  :image="cardImage" 
  @close="closeCard"
/>
```
# 📚 Composant Catégorie

## Description

Le composant **Catégorie** permet de gérer les catégories de manière interactive. Il permet de créer, éditer, supprimer et afficher des catégories. Les catégories sont stockées localement et dans le cache du navigateur via un **Service Worker**, garantissant une gestion des données même sans connexion. Ce composant intègre également des fonctionnalités d'édition en ligne avec une mise à jour en temps réel des données.

---

## 🚀 Fonctionnalités principales

### 📝 Création de catégorie
- L'utilisateur peut créer une nouvelle catégorie en remplissant un formulaire avec le nom de la catégorie.
- Le nom de la catégorie est envoyé au **Service Worker** pour être mis en cache, et la catégorie est immédiatement ajoutée à la liste des catégories affichées.

### ✏️ Édition de catégorie
- Il est possible de modifier une catégorie existante. Lorsque l'édition est activée, un formulaire permet de modifier le nom de la catégorie.
- Après modification, le nom de la catégorie est mis à jour localement et dans le cache via le **Service Worker**.

### 🗑️ Suppression de catégorie
- Une catégorie peut être supprimée en cliquant sur un bouton dédié. La suppression est effectuée localement et le cache est également mis à jour via le **Service Worker** pour supprimer la catégorie.

### 📂 Liste des catégories
- Les catégories existantes sont affichées sous forme de liste. Si aucune catégorie n'est présente, un message indique qu'il n'y a aucune catégorie disponible.
- Un lien est disponible pour chaque catégorie, permettant à l'utilisateur de naviguer vers un thème spécifique lié à la catégorie.

### 🔄 Intégration avec Service Worker
- Toutes les modifications (création, mise à jour, suppression) sont envoyées au **Service Worker**, permettant de les enregistrer dans le cache pour une utilisation hors ligne.

---

## 🧩 Composants intégrés

- **ButtonDelete** : Bouton permettant de supprimer une catégorie.
- **PencilIcon** (de **Heroicons**) : Icône utilisée pour le bouton d'édition des catégories.
- **CardTheme** : Composant pour afficher les détails d'une carte (utilisé via le lien dans la catégorie).
- **Theme** : Composant de thème, qui peut être lié à chaque catégorie.

---

## 🔧 Propriétés (Props)

Aucune propriété directe n'est définie pour ce composant.

---

## 🎯 Événements émis

### `deleteCategory`
- **Description** : L'événement `deleteCategory` est émis lors de la suppression d'une catégorie. Ce dernier peut être utilisé pour signaler la suppression dans d'autres parties de l'application.

---

## 🛠️ Fonctionnement interne

1. **Création de catégorie** : Le nom de la catégorie est récupéré depuis un champ de formulaire, envoyé au **Service Worker** pour stockage, et immédiatement affiché dans la liste des catégories.
2. **Édition de catégorie** : Le composant passe en mode édition lorsque l'utilisateur clique sur l'icône d'édition. Le nom de la catégorie est mis à jour via un formulaire, et l'édition est envoyée au **Service Worker**.
3. **Suppression de catégorie** : La catégorie est supprimée de la liste locale et du cache via le **Service Worker**.
4. **Récupération des catégories depuis le cache** : Lors du montage du composant, les catégories sont récupérées depuis le cache via le **Service Worker** pour une utilisation hors ligne.

---

## 📜 Exemple d'utilisation

```vue
<Categorie />
```
# 📚 Composant Header

## Description

Le composant **Header** représente l'en-tête du projet. Il inclut un logo, une barre de navigation, ainsi qu'un menu mobile interactif (menu burger). Ce composant gère également l'apparence dynamique du header en fonction du défilement de la page (modification de la couleur de fond et de la taille).

---

## 🚀 Fonctionnalités principales

### 🎨 Apparence dynamique du Header
- Le **background** du header change en fonction du défilement de la page :
    - **Défaut** : Fond bleu clair avec une hauteur de 4rem.
    - **Quand la page est défilée** : Fond bleu foncé et hauteur réduite à 2rem avec une ombre légère.

### 🍔 Menu Burger (Mobile)
- Un menu burger est affiché sur les appareils mobiles (version mobile uniquement).
- Le menu peut être ouvert et fermé via un bouton qui change d'icône en fonction de l'état (`open`/`close`).
- Le menu contient des liens de navigation pour différentes sections de l'application.

### 🖱️ Navigation Desktop
- Sur les écrans plus larges, un menu horizontal est visible avec les éléments suivants :
    - **Catégories**
    - **Aide / À propos**

### 📱 Navigation Mobile
- Lorsque le menu burger est ouvert, une navigation verticale est affichée avec les éléments suivants :
    - **Catégories**
    - **Mes thèmes**
    - **Réviser**
    - **Importer un thème**
    - **Paramètres**
    - **Aide / À propos**
- Les liens dans le menu mobile ferment automatiquement le menu lorsqu'ils sont cliqués.

---

## 🧩 Composants intégrés

Aucun composant externe spécifique n'est utilisé, à l'exception de :
- **router-link** : Utilisé pour la navigation entre les différentes pages de l'application.
- **SVG (Icones)** : Utilisation d'icônes SVG pour le menu burger et le bouton de fermeture.

---

## 🎯 Événements émis

Aucun événement spécifique n'est émis par ce composant.

---

## 🛠️ Fonctionnement interne

1. **Gestion du scroll** :
    - Le composant écoute l'événement `scroll` et modifie l'apparence du header (changement de couleur de fond et taille de l'élément).

2. **Menu Burger** :
    - Le menu burger est contrôlé par l'état `isMenuOpen`, qui détermine si le menu est affiché ou non.
    - Le menu peut être ouvert ou fermé en cliquant sur l'icône du menu burger. Lorsqu'un lien est cliqué dans le menu, celui-ci se ferme automatiquement.

3. **Fermeture du menu** :
    - Un clic en dehors du menu burger (lorsqu'il est ouvert) permet de fermer le menu via la superposition (`overlay`).

---

## 🔧 Propriétés (Props)

Aucune propriété directe n'est définie pour ce composant.

---

## 🎯 Méthodes

### `handleScroll`
- **Description** : Gère le changement d'apparence du header lors du défilement de la page. Change la couleur de fond et ajuste la hauteur en fonction du défilement de la page.

### `toggleMenu`
- **Description** : Bascule l'état du menu burger entre ouvert et fermé.

### `closeMenu`
- **Description** : Ferme le menu burger si celui-ci est ouvert.

---

## 📜 Exemple d'utilisation

```vue
<Header />
```
# Documentation des Icônes SVG

Cette documentation décrit l'utilisation des icônes SVG disponibles dans le projet.

## Icônes disponibles

### 1. Icône de la Communauté

Une icône représentant la notion de communauté. Utilisée pour les sections liées à la communauté ou aux interactions sociales.

### 2. Icône de Documentation

Icône qui représente une section ou un lien vers la documentation. Utilisée pour indiquer où trouver de l'aide ou des informations détaillées sur le projet.

### 3. Icône de l'Écosystème

Une icône représentant l'écosystème du projet, souvent utilisée pour afficher les ressources ou partenaires associés au projet.

### 4. Icône du Support

Icône représentant un support technique. Utilisée pour les sections d'assistance ou de contact avec le service client.

### 5. Icône du Support Technique

Icône représentant un support technique, souvent utilisée dans les interfaces utilisateurs pour indiquer les sections d'assistance ou de contact avec le service client. Ce composant utilise une icône provenant de **Material Design Icons**, distribuée sous la licence **Apache 2.0**.

---

Chaque icône peut être utilisée en intégrant son code SVG directement dans le projet. Assurez-vous d'ajuster les propriétés comme `width`, `height`, et `fill` pour personnaliser l'apparence de l'icône selon les besoins.

# Documentation du composant `CreateTheme`

Le composant `CreateTheme` permet de gérer les thèmes d'une catégorie. Il offre des fonctionnalités permettant de créer, éditer, supprimer et afficher des thèmes en interagissant avec un Service Worker et un cache.

## Fonctionnalités

- **Création de thèmes** : Permet de créer un nouveau thème en spécifiant un nom et une description.
- **Édition de thèmes** : Permet de modifier un thème existant.
- **Suppression de thèmes** : Permet de supprimer un thème de la liste et du cache.
- **Affichage des thèmes** : Affiche la liste des thèmes filtrée selon le `themeId`.

## Propriétés

### `themeId`
- **Type** : `string`
- **Description** : Identifiant de la catégorie de thèmes, passé en tant que prop au composant.

## Variables réactives

- **`themes`** : Liste des thèmes chargés depuis le cache ou ajoutés manuellement.
- **`themeName`** : Nom du thème, utilisé dans les formulaires de création et d'édition.
- **`themeDescription`** : Description du thème, utilisée dans les formulaires de création et d'édition.
- **`isEditable`** : Booléen qui détermine si un thème est en mode édition.
- **`editingTheme`** : Thème actuellement en cours d'édition.
- **`props`** : Propriétés passées au composant, incluant `themeId`.

## Méthodes

### `toggleEdit(theme)`
Active le mode édition pour un thème donné, préchargeant les informations de celui-ci dans les champs de saisie.

### `filteredThemes`
Filtre les thèmes affichés en fonction de l'ID de la catégorie (`themeId`), afin de n'afficher que les thèmes correspondant à la catégorie.

### `Createtheme()`
Crée un nouveau thème en utilisant le nom et la description spécifiés. Le thème est ajouté à la liste et envoyé au Service Worker pour gestion du cache.

### `getThemesFromCache()`
Récupère les thèmes stockés dans le cache via le Service Worker. Cette méthode est appelée lors du montage du composant pour charger les thèmes existants.

### `PutTheme()`
Met à jour un thème existant après modification. Envoie la mise à jour au Service Worker pour qu'il mette à jour le cache.

### `DeleteTheme(themeName)`
Supprime un thème en fonction de son nom. Le thème est retiré de la liste locale et du cache via le Service Worker.

## Comportement du composant

### Création d'un thème
Lorsque l'utilisateur soumet le formulaire de création, le composant vérifie si le nom et la description du thème sont renseignés. Si c'est le cas, il envoie ces informations au Service Worker pour qu'elles soient stockées dans le cache et ajoute immédiatement le thème à la liste locale.

### Édition d'un thème
Lorsque l'utilisateur souhaite éditer un thème, le bouton d'édition (icône en forme de crayon) active un formulaire d'édition pré-rempli avec les informations du thème sélectionné. Les modifications peuvent être sauvegardées via le bouton "Sauvegarder".

### Suppression d'un thème
Chaque thème a un bouton pour le supprimer. La suppression retire le thème de la liste et du cache du Service Worker. Un message est affiché dans la console pour confirmer l'action.

### Affichage des thèmes
Les thèmes sont affichés sous forme de liste. Chaque thème affiche son nom et sa description. Si un thème est en mode édition, un formulaire est affiché à la place des informations du thème.

## Exemple de code

Voici un extrait de code pour utiliser le composant `CreateTheme` :

```html
<CreateTheme :themeId="'123'" />
