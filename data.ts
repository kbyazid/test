// data.ts
// copie le contenu de dataDyna ou bien de dataStat et sauvegarder
// Interface definitions

export interface User {
  id: string;
  email: string;
  createdAt: Date;
}

  export interface Transaction {
    id: string;
    amount: number;
    emoji: string | null;
    description: string;
    createdAt: Date;
    budgetId?: string | null;
    type: "income" | "expense"; 
    userId: string;
  }

export interface Budget {
  id: string;
  name: string;
  amount: number;
  userId: string;
  emoji: string | null;
  createdAt: Date;
  transaction: Transaction[];
}
// User data  attention a l id du user verifie que c est bie lui ds la table User
export const user: User = {
  id: "d3f7712e-06ef-46b5-9f3f-7d99647f1a2d",
  email: "tlemcencrma20@gmail.com",
  createdAt: new Date("2025-05-04T13:59:39.560Z")
};

// Budgets data with transaction
export const budgets: Budget[] = [
  {
    id: "a1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c5d",
    createdAt: new Date("2025-05-10T09:00:00Z"),
    name: "Alimentation",
    amount: 500,
    emoji: "🍎",
    userId: user.id,
    transaction: [
      { id: "t1a2b3c4-d5e6-4f7a-8b9c-0d1e2f3a4b5c", amount: 45, emoji: "🍕", description: "Pizzeria", createdAt: new Date("2025-05-11T11:00:00Z"), budgetId: "a1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c5d", userId: user.id, type:"expense" },
      { id: "t2b3c4d5-e6f7-4a8b-9c0d-1e2f3a4b5c6d", amount: 20, emoji: "🍞", description: "Boulangerie", createdAt: new Date("2025-05-12T09:30:00Z"), budgetId: "a1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c5d", userId: user.id, type:"expense" },
      { id: "t3c4d5e6-f7a8-4b9c-0d1e-2f3a4b5c6d7e", amount: 60, emoji: null, description: "Epicerie", createdAt: new Date("2025-05-12T14:00:00Z"), budgetId: "a1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c5d", userId: user.id, type:"expense" }
    ]
  },
  {
    id: "b2c3d4e5-f6a7-4b8c-9d0e-1f2a3b4c5d6e",
    createdAt: new Date("2025-05-05T10:00:00Z"),
    name: "Transport",
    amount: 300,
    emoji: "🚗",
    userId: user.id,
    transaction: [
      { id: "t4d5e6f7-a8b9-4c0d-1e2f-3a4b5c6d7e8f", amount: 50, emoji: "⛽", description: "Essence", createdAt: new Date("2025-05-06T08:00:00Z"), budgetId: "b2c3d4e5-f6a7-4b8c-9d0e-1f2a3b4c5d6e", userId: user.id, type:"expense" },
      { id: "t5e6f7a8-b9c0-4d1e-2f3a-4b5c6d7e8f90", amount: 80, emoji: "🚆", description: "Billet de train", createdAt: new Date("2025-05-08T12:00:00Z"), budgetId: "b2c3d4e5-f6a7-4b8c-9d0e-1f2a3b4c5d6e", userId: user.id, type:"expense" }
    ]
  },
  {
    id: "c3d4e5f6-a7b8-4c9d-0e1f-2a3b4c5d6e7f",
    createdAt: new Date("2025-05-07T11:00:00Z"),
    name: "Loisirs",
    amount: 200,
    emoji: "🎭",
    userId: user.id,
    transaction: [
      { id: "t6f7a8b9-c0d1-4e2f-3a4b-5c6d7e8f9012", amount: 25, emoji: "🎬", description: "Cinéma", createdAt: new Date("2025-05-08T20:00:00Z"), budgetId: "c3d4e5f6-a7b8-4c9d-0e1f-2a3b4c5d6e7f", userId: user.id, type:"expense" },
      { id: "t7a8b9c0-d1e2-4f3a-4b5c-6d7e8f901234", amount: 40, emoji: "🎳", description: "Bowling", createdAt: new Date("2025-05-15T19:00:00Z"), budgetId: "c3d4e5f6-a7b8-4c9d-0e1f-2a3b4c5d6e7f", userId: user.id, type:"expense" }
    ]
  },
  {
    id: "d4e5f6a7-b8c9-4d0e-1f2a-3b4c5d6e7f8g",
    createdAt: new Date("2025-05-09T08:00:00Z"),
    name: "Santé",
    amount: 150,
    emoji: "🏥",
    userId: user.id,
    transaction: [
      { id: "t8b9c0d1-e2f3-4a4b-5c6d-7e8f90123456", amount: 30, emoji: "💊", description: "Médicaments", createdAt: new Date("2025-05-10T09:00:00Z"), budgetId: "d4e5f6a7-b8c9-4d0e-1f2a-3b4c5d6e7f8g", userId: user.id, type:"expense" }
    ]
  },
  {
    id: "e5f6a7b8-c9d0-4e1f-2a3b-4c5d6e7f8g9h",
    createdAt: new Date("2025-05-11T14:00:00Z"),
    name: "Éducation",
    amount: 250,
    emoji: "📚",
    userId: user.id,
    transaction: [
      { id: "t9c0d1e2-f3a4-4b5c-6d7e-8f9012345678", amount: 45, emoji: null, description: "Livre technique", createdAt: new Date("2025-05-12T10:00:00Z"), budgetId: "e5f6a7b8-c9d0-4e1f-2a3b-4c5d6e7f8g9h", userId: user.id, type:"expense" }
    ]
  },
  {
    id: "f6a7b8c9-d0e1-4f2a-3b4c-5d6e7f8g9h0i",
    createdAt: new Date("2025-05-13T16:00:00Z"),
    name: "Maison",
    amount: 400,
    emoji: "🏠",
    userId: user.id,
    transaction: [
      { id: "t0d1e2f3-a4b5-4c6d-7e8f-901234567890", amount: 120, emoji: "🛏️", description: "Literie", createdAt: new Date("2025-05-14T11:00:00Z"), budgetId: "f6a7b8c9-d0e1-4f2a-3b4c-5d6e7f8g9h0i", userId: user.id, type:"expense" },
      { id: "t1e2f3a4-b5c6-4d7e-8f90-123456789012", amount: 80, emoji: "🧹", description: "Produits ménagers", createdAt: new Date("2025-05-16T14:00:00Z"), budgetId: "f6a7b8c9-d0e1-4f2a-3b4c-5d6e7f8g9h0i", userId: user.id, type:"expense" }
    ]
  },
  {
    id: "g7a8b9c0-d1e2-4f3a-4b5c-6d7e8f9h0i1j",
    createdAt: new Date("2025-05-15T09:00:00Z"),
    name: "Vêtements",
    amount: 350,
    emoji: "👕",
    userId: user.id,
    transaction: [
      { id: "t2f3a4b5-c6d7-4e8f-9012-345678901234", amount: 90, emoji: "👖", description: "Jeans", createdAt: new Date("2025-05-16T15:00:00Z"), budgetId: "g7a8b9c0-d1e2-4f3a-4b5c-6d7e8f9h0i1j", userId: user.id, type:"expense" },
      { id: "t3g4a5b6-d7e8-4f90-1234-567890123456", amount: 60, emoji: "👟", description: "Chaussures", createdAt: new Date("2025-05-18T12:00:00Z"), budgetId: "g7a8b9c0-d1e2-4f3a-4b5c-6d7e8f9h0i1j", userId: user.id, type:"expense" }
    ]
  },
  {
    id: "h8b9c0d1-e2f3-4a4b-5c6d-7e8f9i0j1k2l",
    createdAt: new Date("2025-05-17T11:00:00Z"),
    name: "Voyages",
    amount: 1000,
    emoji: "✈️",
    userId: user.id,
    transaction: [
      { id: "t4h5i6j7-k8l9-4m0n-1o2p-3q4r5s6t7u8", amount: 300, emoji: "🏨", description: "Hôtel", createdAt: new Date("2025-05-18T10:00:00Z"), budgetId: "h8b9c0d1-e2f3-4a4b-5c6d-7e8f9i0j1k2l", userId: user.id, type:"expense" }
    ]
  },
  {
    id: "i9j0k1l2-m3n4-4o5p-6q7r-8s9t0u1v2w3",
    createdAt: new Date("2025-05-19T13:00:00Z"),
    name: "Technologie",
    amount: 600,
    emoji: "💻",
    userId: user.id,
    transaction: [
      { id: "t5j6k7l8-m9n0-4o1p-2q3r-4s5t6u7v8w9", amount: 150, emoji: "📱", description: "Accessoire téléphone", createdAt: new Date("2025-05-20T14:00:00Z"), budgetId: "i9j0k1l2-m3n4-4o5p-6q7r-8s9t0u1v2w3", userId: user.id, type:"expense" }
    ]
  },
  {
    id: "j0k1l2m3-n4o5-4p6q-7r8s-9t0u1v2w3x4",
    createdAt: new Date("2025-05-21T15:00:00Z"),
    name: "Divertissement",
    amount: 180,
    emoji: "🎮",
    userId: user.id,
    transaction: [
      { id: "t6k7l8m9-n0o1-4p2q-3r4s-5t6u7v8w9x0", amount: 60, emoji: null, description: "Jeu vidéo", createdAt: new Date("2025-05-22T16:00:00Z"), budgetId: "j0k1l2m3-n4o5-4p6q-7r8s-9t0u1v2w3x4", userId: user.id, type:"expense" }
    ]
  },
  {
    id: "k1l2m3n4-o5p6-4q7r-8s9t-0u1v2w3x4y5",
    createdAt: new Date("2025-05-23T10:00:00Z"),
    name: "Factures",
    amount: 450,
    emoji: "💡",
    userId: user.id,
    transaction: [
      { id: "t7l8m9n0-o1p2-4q3r-4s5t-6u7v8w9x0y1", amount: 120, emoji: "📶", description: "Internet", createdAt: new Date("2025-05-24T09:00:00Z"), budgetId: "k1l2m3n4-o5p6-4q7r-8s9t-0u1v2w3x4y5", userId: user.id, type:"expense" },
      { id: "t8m9n0o1-p2q3-4r4s-5t6u-7v8w9x0y1z2", amount: 80, emoji: "📱", description: "Téléphone", createdAt: new Date("2025-05-25T10:00:00Z"), budgetId: "k1l2m3n4-o5p6-4q7r-8s9t-0u1v2w3x4y5", userId: user.id, type:"expense" }
    ]
  },
  {
    id: "l2m3n4o5-p6q7-4r8s-9t0u-1v2w3x4y5z6",
    createdAt: new Date("2025-05-25T12:00:00Z"),
    name: "Assurances",
    amount: 350,
    emoji: "🛡️",
    userId: user.id,
    transaction: [
      { id: "t9n0o1p2-q3r4-4s5t-6u7v-8w9x0y1z2a3", amount: 120, emoji: null, description: "Assurance habitation", createdAt: new Date("2025-05-26T11:00:00Z"), budgetId: "l2m3n4o5-p6q7-4r8s-9t0u-1v2w3x4y5z6", userId: user.id, type:"expense"}
    ]
  }
];

// Vérification que le total des transaction ne dépasse pas le budget
budgets.forEach(budget => {
  const total = budget.transaction.reduce((sum, transaction) => sum + transaction.amount, 0);
  if (total > budget.amount) {
    console.warn(`Attention: Le budget ${budget.name} (${budget.amount}) est dépassé par les transaction (${total})`);
  }
});

console.log("Données lues avec succès !");
// Export the budgets array
export default budgets;
