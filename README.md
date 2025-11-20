# 🍽️ CashDesk Pro - Système de Caisse pour Cafés et Restaurants

![App Preview](https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=1200&h=300&fit=crop&auto=format)

Une application de point de vente complète pour cafés et restaurants avec gestion des commandes, historique des ventes, statistiques détaillées et impression de tickets de caisse professionnels.

## ✨ Fonctionnalités

- **📱 Prise de Commande Intuitive** - Interface tactile optimisée pour une saisie rapide des commandes
- **🍔 Gestion du Menu** - Catalogue de produits organisé par catégories avec images et prix
- **🪑 Gestion des Tables** - Système de tables avec statuts (libre, occupée, réservée)
- **📊 Statistiques de Vente** - Tableaux de bord avec chiffre d'affaires, produits populaires et tendances
- **📜 Historique Complet** - Recherche et filtrage des commandes passées
- **🖨️ Impression de Tickets** - Génération automatique de tickets de caisse professionnels
- **💰 Calcul Automatique** - Totaux, sous-totaux et gestion de la TVA
- **🔄 Temps Réel** - Mise à jour instantanée des statuts et des données

## Clone this Project

## Clone this Project

Want to create your own version of this project with all the content and structure? Clone this Cosmic bucket and code repository to get started instantly:

[![Clone this Project](https://img.shields.io/badge/Clone%20this%20Project-29abe2?style=for-the-badge&logo=cosmic&logoColor=white)](https://app.cosmicjs.com/projects/new?clone_bucket=691ee151b183692bb397c703&clone_repository=691ee2fbb183692bb397c71a)

## Prompts

This application was built using the following prompts to generate the content structure and code:

### Content Model Prompt

> "je doit créé une application casier pour les cafés et les restaurants pour saisir les commandes des clients avec les historiques de vente et les statistiques de vente, et ticket imprimé pour chaque commande saisie du client"

### Code Generation Prompt

> "je doit créé une application casier pour les cafés et les restaurants pour saisir les commandes des clients avec les historiques de vente et les statistiques de vente, et ticket imprimé pour chaque commande saisie du client"

The app has been tailored to work with your existing Cosmic content structure and includes all the features requested above.

## 🛠️ Technologies

- **Next.js 16** - React framework avec App Router
- **TypeScript** - Typage statique pour une meilleure fiabilité
- **Tailwind CSS** - Styling moderne et responsive
- **Cosmic CMS** - Gestion de contenu headless pour produits et commandes
- **Bun** - Runtime JavaScript rapide pour l'installation et le build

## 🚀 Getting Started

### Prérequis

- Compte Cosmic (bucket déjà configuré)
- Bun installé (`curl -fsSL https://bun.sh/install | bash`)
- Node.js 18+ (pour compatibilité)

### Installation

1. **Cloner le projet depuis le dashboard Cosmic**

2. **Installer les dépendances**
```bash
bun install
```

3. **Les variables d'environnement sont automatiquement configurées**
   - `COSMIC_BUCKET_SLUG` - Slug de votre bucket
   - `COSMIC_READ_KEY` - Clé de lecture
   - `COSMIC_WRITE_KEY` - Clé d'écriture

4. **Lancer l'application en développement**
```bash
bun run dev
```

5. **Ouvrir dans le navigateur**
```
http://localhost:3000
```

## 📖 Cosmic SDK Examples

### Récupérer les Produits

```typescript
import { cosmic } from '@/lib/cosmic'

// Obtenir tous les produits avec leurs catégories
const { objects: products } = await cosmic.objects
  .find({ type: 'products' })
  .props(['id', 'title', 'slug', 'metadata'])
  .depth(1)

// Filtrer par catégorie
const { objects: drinks } = await cosmic.objects
  .find({ 
    type: 'products',
    'metadata.category': categoryId 
  })
  .props(['id', 'title', 'metadata'])
  .depth(1)
```

### Créer une Commande

```typescript
// Créer une nouvelle commande
const newOrder = await cosmic.objects.insertOne({
  title: `Commande #${orderNumber}`,
  type: 'orders',
  metadata: {
    table_number: "5",
    items: JSON.stringify(orderItems),
    total_amount: "45.50",
    status: "En préparation",
    payment_method: "Espèces",
    order_date: new Date().toISOString()
  }
})
```

### Statistiques de Vente

```typescript
// Récupérer toutes les commandes pour les statistiques
const { objects: orders } = await cosmic.objects
  .find({ type: 'orders' })
  .props(['id', 'title', 'metadata'])
  .depth(1)

// Calculer le chiffre d'affaires total
const totalRevenue = orders.reduce((sum, order) => {
  return sum + parseFloat(order.metadata.total_amount || '0')
}, 0)
```

## 🎨 Intégration Cosmic CMS

L'application utilise votre structure de contenu Cosmic existante :

### Types d'Objets

- **Products** - Produits du menu (plats, boissons, desserts)
  - `title` - Nom du produit
  - `metadata.price` - Prix unitaire
  - `metadata.category` - Catégorie (relation avec categories)
  - `metadata.description` - Description du produit
  - `metadata.image` - Image du produit
  - `metadata.available` - Disponibilité (boolean)

- **Categories** - Catégories de produits
  - `title` - Nom de la catégorie
  - `metadata.icon` - Icône de la catégorie
  - `metadata.order` - Ordre d'affichage

- **Orders** - Commandes des clients
  - `title` - Numéro de commande
  - `metadata.table_number` - Numéro de table
  - `metadata.items` - Produits commandés (JSON)
  - `metadata.total_amount` - Montant total
  - `metadata.status` - Statut (En préparation, Servie, Payée)
  - `metadata.payment_method` - Mode de paiement
  - `metadata.order_date` - Date et heure

- **Tables** - Tables du restaurant
  - `title` - Numéro de table
  - `metadata.capacity` - Nombre de places
  - `metadata.status` - Statut (Libre, Occupée, Réservée)

## 🖨️ Impression de Tickets

Le système génère automatiquement des tickets de caisse professionnels pour chaque commande :

```typescript
// Fonction d'impression de ticket
function printReceipt(order: Order) {
  const printWindow = window.open('', '', 'width=300,height=600')
  printWindow?.document.write(receiptHTML)
  printWindow?.print()
}
```

Format du ticket :
- En-tête avec nom du restaurant
- Date et heure de la commande
- Numéro de table
- Liste détaillée des produits avec quantités et prix
- Sous-total, TVA et total
- Mode de paiement
- Message de remerciement

## 📈 Statistiques Disponibles

- **Chiffre d'Affaires** - Total des ventes (jour, semaine, mois)
- **Nombre de Commandes** - Compteur de transactions
- **Ticket Moyen** - Montant moyen par commande
- **Produits Populaires** - Top des produits les plus vendus
- **Tendances** - Graphiques d'évolution des ventes
- **Répartition par Catégorie** - Ventes par type de produit

## 🚀 Deployment Options

### Vercel (Recommandé pour Next.js)

1. Push votre code sur GitHub
2. Importer dans Vercel
3. Les variables d'environnement sont automatiquement configurées depuis Cosmic
4. Deploy automatique

### Netlify

1. Connecter votre repository GitHub
2. Configuration automatique pour Next.js
3. Variables d'environnement configurées depuis Cosmic
4. Deploy continu

## 📝 Notes d'Utilisation

- **Interface Tactile** - Optimisée pour tablettes et écrans tactiles
- **Mode Portrait** - Recommandé pour une utilisation optimale
- **Imprimante Thermique** - Compatible avec les imprimantes de tickets standards
- **Sauvegarde Automatique** - Toutes les commandes sont sauvegardées dans Cosmic
- **Accès Multi-Utilisateur** - Plusieurs terminaux peuvent utiliser le système simultanément

## 🔒 Sécurité

- Variables d'environnement sécurisées
- Validation des données côté serveur
- Protection contre les injections
- Authentification possible via Cosmic (extension future)

<!-- README_END -->