# Spécifications du Dashboard

## Vue d'ensemble
Le Dashboard est la page principale de l'application de gestion budgétaire. Il fournit une vue d'ensemble complète des finances de l'utilisateur avec des métriques clés, des graphiques interactifs et des listes de données récentes.

## Structure de la page

### 1. En-tête
- **Titre** : "Tableau de bord"
- **Description** : "Votre aperçu et vos perspectives financières"

### 2. Section des métriques (Cards)
Trois cartes principales affichant :
- **Total des dépenses** : Montant total de toutes les transactions
- **Nombre de transactions** : Compteur total des transactions
- **Budgets atteints** : Ratio des budgets ayant atteint leur limite

### 3. Section graphiques et données (Layout 2/3 - 1/3)

#### Zone principale (2/3 de la largeur)
1. **Graphique en barres - Dépenses par Budget**
   - Compare budget alloué vs montant dépensé
   - Couleurs : Rose (#EF9FBC) pour budget, Orange (#EEAF3A) pour dépensé
   - Axe X personnalisé (4 premiers caractères)

2. **Graphique linéaire - Évolution des Moyennes Mensuelles**
   - Affiche l'évolution des moyennes de dépenses par mois
   - Couleur verte (#10B981)
   - Données pour l'année en cours

3. **Liste des Dernières Dépenses**
   - Affiche les transactions récentes
   - Composant TransactionItem réutilisable

#### Zone latérale (1/3 de la largeur)
1. **Récapitulatif des Dépenses par Journée**
   - 30 derniers jours maximum
   - Format : Date + Montant

2. **Moyenne des Dépenses**
   - Calcul basé sur les derniers jours
   - Affichage en grand format

3. **Derniers Budgets Créés**
   - Liste des budgets récents
   - Navigation vers la page de gestion

## Flow des données

### Authentification
- Utilise Clerk (`useUser()`) pour l'authentification
- Vérification de l'email utilisateur

### Chargement des données
```typescript
// Requêtes parallèles avec Promise.all()
const [amount, count, reachedBudgets, budgetsData, lastTransactions, lastBudgets, dailySummary] = 
  await Promise.all([
    getTotalTransactionAmount(email),
    getTransactionCount(email),
    getReachedBudgets(email),
    getUserBudgetData(email),
    getLastTransactions(email),
    getLastBudgets(email),
    getDailyExpensesSummary(email)
  ]);
```

### États React
- `isLoading` : État de chargement
- `error` : Gestion des erreurs
- `totalAmount` : Montant total des dépenses
- `totalCount` : Nombre de transactions
- `reachedBudgetsRatio` : Ratio budgets atteints
- `budgetData` : Données pour graphique budgets
- `transactions` : Dernières transactions
- `budgets` : Derniers budgets
- `dailyExpenses` : Dépenses journalières

## Calculs côté client

### Moyenne des dépenses
```typescript
const daysToShow = Math.min(dailyExpenses.length, 30);
const totalSum = expensesSlice.reduce((sum, expense) => sum + expense.totalAmount, 0);
const average = totalSum / daysToShow;
```

### Moyennes mensuelles
```typescript
const monthlyAverages = [];
for (let month = 0; month < 12; month++) {
  const monthExpenses = dailyExpenses.filter(expense => {
    const expenseDate = new Date(expense.date);
    return expenseDate.getFullYear() === currentYear && expenseDate.getMonth() === month;
  });
  
  const monthTotal = monthExpenses.reduce((sum, expense) => sum + expense.totalAmount, 0);
  const daysInMonth = monthExpenses.length || 1;
  
  monthlyAverages.push({
    month: months[month],
    average: monthTotal / daysInMonth
  });
}
```

## Composants utilisés

### Composants internes
- `DashboardCard` : Cartes de métriques
- `TransactionItem` : Élément de transaction
- `BudgetItem` : Élément de budget
- `Wrapper` : Layout principal

### Composants externes (Recharts)
- `BarChart` : Graphique en barres
- `LineChart` : Graphique linéaire
- `ResponsiveContainer` : Container responsive
- `CartesianGrid` : Grille
- `XAxis`, `YAxis` : Axes
- `Tooltip` : Info-bulles
- `Bar`, `Line` : Éléments graphiques

## Gestion d'erreur
- État `error` pour capturer les erreurs
- Affichage d'une alerte rouge en cas d'échec
- Message : "Impossible de charger les données"
- Reset automatique à chaque nouvelle tentative

## Responsive Design
- **Desktop** : Layout en colonnes (2/3 + 1/3)
- **Mobile** : Layout vertical empilé
- **Grilles** : `md:grid-cols-3` pour les cartes métriques

## Performance
- **Requêtes parallèles** : Promise.all() au lieu de requêtes séquentielles
- **Calculs optimisés** : useMemo pourrait être ajouté pour les calculs coûteux
- **Chargement conditionnel** : Vérification de l'utilisateur avant chargement

## Navigation
- Liens vers `/manage/${budget.id}` pour la gestion des budgets
- Utilisation de Next.js Link pour la navigation côté client

## Formatage
- `formatCurrency()` pour l'affichage des montants
- Dates formatées en français
- Nombres arrondis pour les moyennes