# 🎨 Structure du Thème - Documentation Complète

## 📋 Vue d'ensemble

Le système de thème utilise **DaisyUI** avec **Tailwind CSS** et permet de basculer entre 32 thèmes différents avec persistance en base de données et localStorage.

---

## 🏗️ Architecture du Thème

### 1. **Configuration de Base**

#### `app/globals.css`
```css
@import "tailwindcss";
@plugin "daisyui" {
  themes: light --default, dark --prefersdark, cupcake, bumblebee, emerald, 
          corporate, synthwave, retro, cyberpunk, valentine, halloween, garden, 
          forest, aqua, lofi, pastel, fantasy, wireframe, black, luxury, dracula, 
          cmyk, autumn, business, acid, lemonade, night, coffee, winter, dim, 
          nord, sunset;
}
```

**Rôle** : Importe Tailwind CSS et configure DaisyUI avec tous les thèmes disponibles.

---

### 2. **Hiérarchie des Composants**

```
app/layout.tsx (Root)
    └── ClerkProvider
        └── <html lang="fr">
            └── <body>
                └── ThemeProvider (Initialisation du thème)
                    └── LayoutWrapper (Structure de la page)
                        ├── Navbar (Contient ThemeToggle + ThemePalette)
                        ├── Sidebar
                        └── <main> (Contenu principal)
```

---

## 🔧 Composants Clés

### **1. ThemeProvider** (`app/components/ThemeProvider.tsx`)

**Rôle** : Initialise le thème au chargement de l'application

**Fonctionnement** :
```typescript
useEffect(() => {
  const initializeTheme = async () => {
    let theme = 'light'
    
    if (isSignedIn && user?.primaryEmailAddress?.emailAddress) {
      // Récupère le thème depuis la base de données
      theme = await getUserTheme(user.primaryEmailAddress.emailAddress)
    } else {
      // Utilise localStorage pour les utilisateurs non connectés
      theme = localStorage.getItem('theme') || 'light'
    }
    
    // Applique le thème au document HTML
    document.documentElement.setAttribute('data-theme', theme)
    localStorage.setItem('theme', theme)
  }

  initializeTheme()
}, [isSignedIn, user])
```

**Div concernée** :
```html
<html data-theme="light">  <!-- ou "dark", "cupcake", etc. -->
```

---

### **2. ThemeToggle** (`app/components/ThemeToggle.tsx`)

**Rôle** : Bouton pour basculer entre mode clair/sombre

**Fonctionnement** :
```typescript
const toggleTheme = async () => {
  const newTheme = isDark ? "light" : "dark"
  
  // 1. Applique au DOM
  document.documentElement.setAttribute("data-theme", newTheme)
  
  // 2. Sauvegarde en localStorage
  localStorage.setItem("theme", newTheme)
  
  // 3. Met à jour l'état local
  setIsDark(!isDark)
  
  // 4. Sauvegarde en base de données (si connecté)
  if (user?.primaryEmailAddress?.emailAddress) {
    await updateUserTheme(user.primaryEmailAddress.emailAddress, newTheme)
  }
}
```

**Localisation** : Navbar (en haut à droite)

---

### **3. ThemePalette** (`app/components/ThemePalette.tsx`)

**Rôle** : Menu déroulant pour choisir parmi 32 thèmes

**Thèmes disponibles** :
```typescript
const themes = [
  { name: "light", label: "Clair" },
  { name: "dark", label: "Sombre" },
  { name: "cupcake", label: "Cupcake" },
  { name: "bumblebee", label: "Bumblebee" },
  // ... 28 autres thèmes
]
```

**Fonctionnement** :
```typescript
const changeTheme = async (theme: string) => {
  // 1. Met à jour l'état
  setCurrentTheme(theme)
  
  // 2. Applique au DOM
  document.documentElement.setAttribute("data-theme", theme)
  
  // 3. Sauvegarde en localStorage
  localStorage.setItem("theme", theme)
  
  // 4. Sauvegarde en base de données
  await updateUserTheme(user.primaryEmailAddress.emailAddress, theme)
}
```

**Localisation** : Navbar (icône palette à côté du toggle)

---

## 🎯 Divs Concernées par le Thème

### **1. Élément HTML Principal**
```html
<html lang="fr" data-theme="light">
```
**Attribut clé** : `data-theme="light"` (ou autre thème)

---

### **2. Body**
```html
<body class="antialiased">
```
**Classes DaisyUI appliquées automatiquement** via `data-theme`

---

### **3. LayoutWrapper**
```html
<div class="min-h-screen flex flex-col bg-base-200">
```
**Classes thématiques** :
- `bg-base-200` : Couleur de fond adaptée au thème
- `text-base-content` : Couleur de texte adaptée au thème

---

### **4. Navbar**
```html
<div class="fixed top-0 left-0 right-0 z-50 bg-[#1E293B] text-white">
```
**Note** : Utilise des couleurs fixes (non thématiques)

---

### **5. Sidebar**
```html
<aside class="bg-[#1E293B] text-white">
```
**Note** : Utilise des couleurs fixes (non thématiques)

---

### **6. Main Content**
```html
<main class="flex-1 p-2 overflow-auto">
```
**Hérite** des couleurs du thème via les composants enfants

---

### **7. Composants avec Classes DaisyUI**

Exemples de classes qui s'adaptent au thème :

```html
<!-- Cartes -->
<div class="card bg-base-100 shadow-md">

<!-- Boutons -->
<button class="btn btn-primary">

<!-- Inputs -->
<input class="input input-bordered">

<!-- Alertes -->
<div class="alert alert-info">

<!-- Badges -->
<span class="badge badge-success">

<!-- Tables -->
<table class="table table-zebra">
```

**Variables DaisyUI utilisées** :
- `bg-base-100`, `bg-base-200`, `bg-base-300` : Fonds
- `text-base-content` : Texte principal
- `btn-primary`, `btn-accent` : Boutons
- `border-base-300` : Bordures

---

## 💾 Persistance du Thème

### **1. localStorage**
```typescript
localStorage.setItem('theme', 'dark')
localStorage.getItem('theme')
```

### **2. Base de données**
```typescript
// Action serveur
await updateUserTheme(email, theme)
await getUserTheme(email)
```

**Table** : `User`
**Champ** : `theme: String?`

---

## 🔄 Flux de Changement de Thème

```
1. Utilisateur clique sur ThemeToggle ou ThemePalette
   ↓
2. Fonction changeTheme() est appelée
   ↓
3. document.documentElement.setAttribute('data-theme', newTheme)
   ↓
4. localStorage.setItem('theme', newTheme)
   ↓
5. updateUserTheme(email, newTheme) → Base de données
   ↓
6. DaisyUI applique automatiquement les nouvelles couleurs
   ↓
7. Tous les composants avec classes DaisyUI se mettent à jour
```

---

## 🎨 Variables CSS DaisyUI

Chaque thème définit ces variables CSS :

```css
:root[data-theme="light"] {
  --p: primary color;
  --s: secondary color;
  --a: accent color;
  --n: neutral color;
  --b1: base-100 (background);
  --b2: base-200;
  --b3: base-300;
  --bc: base-content (text);
  --in: info color;
  --su: success color;
  --wa: warning color;
  --er: error color;
}
```

---

## 📦 Classes Thématiques Utilisées dans le Projet

### **Backgrounds**
- `bg-base-100` : Fond principal des cartes
- `bg-base-200` : Fond de la page
- `bg-base-300` : Fond des éléments secondaires

### **Texte**
- `text-base-content` : Texte principal
- `text-accent` : Texte accentué
- `text-primary` : Texte primaire

### **Boutons**
- `btn-primary` : Bouton principal
- `btn-accent` : Bouton accentué
- `btn-ghost` : Bouton transparent

### **Bordures**
- `border-base-300` : Bordures standard

### **Composants**
- `card` : Cartes
- `alert` : Alertes
- `badge` : Badges
- `table` : Tables
- `input` : Champs de saisie

---

## 🚀 Initialisation au Démarrage

**Ordre d'exécution** :

1. **app/layout.tsx** : Charge `ThemeProvider`
2. **ThemeProvider** : 
   - Vérifie si l'utilisateur est connecté
   - Récupère le thème depuis DB ou localStorage
   - Applique `data-theme` sur `<html>`
3. **DaisyUI** : Applique automatiquement les styles
4. **Composants** : Utilisent les classes DaisyUI qui s'adaptent

---

## 🔍 Débogage

### Vérifier le thème actuel :
```javascript
// Dans la console du navigateur
document.documentElement.getAttribute('data-theme')
localStorage.getItem('theme')
```

### Changer manuellement le thème :
```javascript
document.documentElement.setAttribute('data-theme', 'dracula')
```

---

## 📝 Résumé

| Composant | Rôle | Div Concernée |
|-----------|------|---------------|
| **ThemeProvider** | Initialise le thème | `<html data-theme="...">` |
| **ThemeToggle** | Bascule clair/sombre | Navbar |
| **ThemePalette** | Sélectionne parmi 32 thèmes | Navbar |
| **DaisyUI** | Applique les styles | Tous les composants avec classes DaisyUI |
| **localStorage** | Persistance locale | - |
| **Base de données** | Persistance serveur | Table User |

---

## 🎯 Points Clés

1. **Un seul attribut** contrôle tout : `data-theme` sur `<html>`
2. **DaisyUI** gère automatiquement les couleurs via ses classes
3. **Double persistance** : localStorage + base de données
4. **32 thèmes** disponibles prêts à l'emploi
5. **Synchronisation** entre tous les composants instantanée
