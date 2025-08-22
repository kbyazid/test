// data.ts
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

// User data
export const user: User = {
  id: "742c9d5d-5d05-4822-bc79-1cb690a9566b",
  email: "koubciyazid@yahoo.fr",
  createdAt: new Date("2025-08-12T13:38:06.028Z"),
};

// Budgets data with transaction
export const budgets: Budget[] = [
  {
    id: "a1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c5d",
    createdAt: new Date("2025-01-05T00:00:00Z"),
    name: "Loyer",
    amount: 21684,
    emoji: "🏠",
    userId: user.id,
    transaction: [
      { id: "e8e1e2e3-f4f5-g6g7-h8h9-i0i1i2i3i4i5", amount: 5421, emoji: "🏠", description: "MOI DE DEC", createdAt: new Date("2025-01-05T00:00:00Z"), budgetId: "a1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c5d", userId: user.id, type: "expense" },
      { id: "e8e1e2e3-f4f5-g6g7-h8h9-i0i1i2i3i4i6", amount: 5421, emoji: "🏠", description: "MOI DE JAN", createdAt: new Date("2025-02-06T00:00:00Z"), budgetId: "a1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c5d", userId: user.id, type: "expense" },
      { id: "e8e1e2e3-f4f5-g6g7-h8h9-i0i1i2i3i4i7", amount: 5421, emoji: "🏠", description: "MOI DE FEV", createdAt: new Date("2025-03-05T00:00:00Z"), budgetId: "a1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c5d", userId: user.id, type: "expense" },
      { id: "e8e1e2e3-f4f5-g6g7-h8h9-i0i1i2i3i4i8", amount: 5421, emoji: "🏠", description: "MOI DE MARS", createdAt: new Date("2025-04-06T00:00:00Z"), budgetId: "a1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c5d", userId: user.id, type: "expense" },
    ],
  },
  {
    id: "e5f6g7h8-i9j0-k1l2-m3n4-o5p6q7r8s9t0",
    createdAt: new Date("2025-01-06T00:00:00Z"),
    name: "Assurance",
    amount: 19250.06,
    emoji: "🛡️",
    userId: user.id,
    transaction: [
      { id: "f1f2f3f4-g5g6-h7h8-i9i0-j1j2j3j4j5j6", amount: 19250.06, emoji: "🛡️", description: "ASSURANCE PARTNER PLUS CATNAT PAR CARTE CIB", createdAt: new Date("2025-01-06T00:00:00Z"), budgetId: "e5f6g7h8-i9j0-k1l2-m3n4-o5p6q7r8s9t0", userId: user.id, type: "expense" },
    ],
  },
  {
    id: "f8g7h6i5-j4k3-l2m1-n0o9-p8q7r6s5t4u3",
    createdAt: new Date("2025-01-06T00:00:00Z"),
    name: "Banque",
    amount: 544.5,
    emoji: "🏦",
    userId: user.id,
    transaction: [
      { id: "g1g2g3g4-h5h6-i7i8-j9j0-k1k2k3k4k5k6", amount: 11.9, emoji: "🏦", description: "COMMISSION + TVA SUR RETRAIT DAB/GAB", createdAt: new Date("2025-01-06T00:00:00Z"), budgetId: "f8g7h6i5-j4k3-l2m1-n0o9-p8q7r6s5t4u3", userId: user.id, type: "expense" },
      { id: "g1g2g3g4-h5h6-i7i8-j9j0-k1k2k3k4k5k7", amount: 23.8, emoji: "🏦", description: "COMMISSION+TVA SUR RETRAIT DAB/GAB", createdAt: new Date("2025-01-06T00:00:00Z"), budgetId: "f8g7h6i5-j4k3-l2m1-n0o9-p8q7r6s5t4u3", userId: user.id, type: "expense" },
      { id: "g1g2g3g4-h5h6-i7i8-j9j0-k1k2k3k4k5k8", amount: 35.7, emoji: "🏦", description: "Commission DOUBLE", createdAt: new Date("2025-01-16T00:00:00Z"), budgetId: "f8g7h6i5-j4k3-l2m1-n0o9-p8q7r6s5t4u3", userId: user.id, type: "expense" },
      { id: "g1g2g3g4-h5h6-i7i8-j9j0-k1k2k3k4k5k9", amount: 15, emoji: "🏦", description: "COMMISSIONS SUR PRODUITS MONETIQUES", createdAt: new Date("2025-04-16T00:00:00Z"), budgetId: "f8g7h6i5-j4k3-l2m1-n0o9-p8q7r6s5t4u3", userId: user.id, type: "expense" },
      { id: "g1g2g3g4-h5h6-i7i8-j9j0-k1k2k3k4k5l0", amount: 2.85, emoji: "🏦", description: "TAXES DUES SUR ACTIVITEES BANCAIRES", createdAt: new Date("2025-04-16T00:00:00Z"), budgetId: "f8g7h6i5-j4k3-l2m1-n0o9-p8q7r6s5t4u3", userId: user.id, type: "expense" },
      { id: "g1g2g3g4-h5h6-i7i8-j9j0-k1k2k3k4k5l1", amount: 250, emoji: "🏦", description: "FRAIS DE TENUE DE COMPTE", createdAt: new Date("2025-03-30T00:00:00Z"), budgetId: "f8g7h6i5-j4k3-l2m1-n0o9-p8q7r6s5t4u3", userId: user.id, type: "expense" },
      { id: "g1g2g3g4-h5h6-i7i8-j9j0-k1k2k3k4k5l2", amount: 47.5, emoji: "🏦", description: "TVA SUR COMMISSIONS", createdAt: new Date("2025-03-30T00:00:00Z"), budgetId: "f8g7h6i5-j4k3-l2m1-n0o9-p8q7r6s5t4u3", userId: user.id, type: "expense" },
    ],
  },
  {
    id: "g1h2i3j4-k5l6-m7n8-o9p0-q1r2s3t4u5v6",
    createdAt: new Date("2025-01-06T00:00:00Z"),
    name: "Consommation Mensuelle",
    amount: 110000,
    emoji: "🛒",
    userId: user.id,
    transaction: [
      { id: "h1h2h3h4-i5i6-j7j8-k9k0-l1l2l3l4l5l6", amount: 20000, emoji: "🛒", description: "CONS MENS", createdAt: new Date("2025-01-06T00:00:00Z"), budgetId: "g1h2i3j4-k5l6-m7n8-o9p0-q1r2s3t4u5v6", userId: user.id, type: "expense" },
      { id: "h1h2h3h4-i5i6-j7j8-k9k0-l1l2l3l4l5l7", amount: 30000, emoji: "🛒", description: "retrait dap CONSOM MENS", createdAt: new Date("2025-01-16T00:00:00Z"), budgetId: "g1h2i3j4-k5l6-m7n8-o9p0-q1r2s3t4u5v6", userId: user.id, type: "expense" },
      { id: "h1h2h3h4-i5i6-j7j8-k9k0-l1l2l3l4l5l8", amount: 20000, emoji: "🛒", description: "CONS MENS", createdAt: new Date("2025-02-05T00:00:00Z"), budgetId: "g1h2i3j4-k5l6-m7n8-o9p0-q1r2s3t4u5v6", userId: user.id, type: "expense" },
      { id: "h1h2h3h4-i5i6-j7j8-k9k0-l1l2l3l4l5l9", amount: 20000, emoji: "🛒", description: "CONS MENS", createdAt: new Date("2025-04-16T00:00:00Z"), budgetId: "g1h2i3j4-k5l6-m7n8-o9p0-q1r2s3t4u5v6", userId: user.id, type: "expense" },
      { id: "h1h2h3h4-i5i6-j7j8-k9k0-l1l2l3l4l5m0", amount: 20000, emoji: "🛒", description: "CONS MENS", createdAt: new Date("2025-05-04T00:00:00Z"), budgetId: "g1h2i3j4-k5l6-m7n8-o9p0-q1r2s3t4u5v6", userId: user.id, type: "expense" },
    ],
  },
  {
    id: "h2i3j4k5-l6m7-n8o9-p0q1-r2s3t4u5v6w7",
    createdAt: new Date("2025-03-24T00:00:00Z"),
    name: "Telecom",
    amount: 1000,
    emoji: "📱",
    userId: user.id,
    transaction: [
      { id: "i1i2i3i4-j5j6-k7k8-l9l0-m1m2m3m4m5m6", amount: 1000, emoji: "📱", description: "recharge flexy ooredoo", createdAt: new Date("2025-03-27T00:00:00Z"), budgetId: "h2i3j4k5-l6m7-n8o9-p0q1-r2s3t4u5v6w7", userId: user.id, type: "expense" },
      { id: "i1i2i3i4-j5j6-k7k8-l9l0-m1m2m3m4m5m7", amount: 1000, emoji: "📱", description: "recharge flexy ooredoo", createdAt: new Date("2025-04-28T00:00:00Z"), budgetId: "h2i3j4k5-l6m7-n8o9-p0q1-r2s3t4u5v6w7", userId: user.id, type: "expense" },
    ],
  },
  {
    id: "i3j4k5l6-m7n8-o9p0-q1r2-s3t4u5v6w7x8",
    createdAt: new Date("2025-03-05T00:00:00Z"),
    name: "Electricité et Gaz",
    amount: 10839.84,
    emoji: "💡",
    userId: user.id,
    transaction: [
      { id: "j1j2j3j4-k5k6-l7l8-m9m0-n1n2n3n4n5n6", amount: 12199.65, emoji: "💡", description: "facture sonelgaz", createdAt: new Date("2025-03-05T00:00:00Z"), budgetId: "i3j4k5l6-m7n8-o9p0-q1r2-s3t4u5v6w7x8", userId: user.id, type: "expense" },
    ],
  },
  /* {
    id: "j4k5l6m7-n8o9-p0q1-r2s3-t4u5v6w7x8y9",
    createdAt: new Date("2025-01-01T00:00:00Z"),
    name: "Revenus",
    amount: 512401.55,
    emoji: "💰",
    userId: user.id,
    transaction: [
      { id: "k1k2k3k4-l5l6-m7m8-n9n0-o1o2o3o4o5o6", amount: 846754.93, emoji: "💰", description: "A NOUVEAU", createdAt: new Date("2025-01-01T00:00:00Z"), budgetId: null, userId: user.id, type: "income" },
      { id: "k1k2k3k4-l5l6-m7m8-n9n0-o1o2o3o4o5o7", amount: 84021.69, emoji: "💰", description: "ECHEANCE MENSUELLE 01/2025", createdAt: new Date("2025-01-15T00:00:00Z"), budgetId: null, userId: user.id, type: "income" },
      { id: "k1k2k3k4-l5l6-m7m8-n9n0-o1o2o3o4o5o8", amount: 600, emoji: "💰", description: "virement PRESTATION AF", createdAt: new Date("2025-01-22T00:00:00Z"), budgetId: null, userId: user.id, type: "income" },
      { id: "k1k2k3k4-l5l6-m7m8-n9n0-o1o2o3o4o5o9", amount: 84021.69, emoji: "💰", description: "ECHEANCE MENSUELLE 02/2025", createdAt: new Date("2025-02-14T00:00:00Z"), budgetId: null, userId: user.id, type: "income" },
      { id: "k1k2k3k4-l5l6-m7m8-n9n0-o1o2o3o4o5p0", amount: 600, emoji: "💰", description: "virement PRESTATION AF", createdAt: new Date("2025-02-22T00:00:00Z"), budgetId: null, userId: user.id, type: "income" },
      { id: "k1k2k3k4-l5l6-m7m8-n9n0-o1o2o3o4o5p1", amount: 84021.69, emoji: "💰", description: "ECHEANCE MENSUELLE 03/2025", createdAt: new Date("2025-03-14T00:00:00Z"), budgetId: null, userId: user.id, type: "income" },
      { id: "k1k2k3k4-l5l6-m7m8-n9n0-o1o2o3o4o5p2", amount: 600, emoji: "💰", description: "virement PRESTATION AF", createdAt: new Date("2025-03-23T00:00:00Z"), budgetId: null, userId: user.id, type: "income" },
      { id: "k1k2k3k4-l5l6-m7m8-n9n0-o1o2o3o4o5p3", amount: 84021.69, emoji: "💰", description: "ECHEANCE MENSUELLE 04/2025", createdAt: new Date("2025-04-14T00:00:00Z"), budgetId: null, userId: user.id, type: "income" },
      { id: "k1k2k3k4-l5l6-m7m8-n9n0-o1o2o3o4o5p4", amount: 600, emoji: "💰", description: "virement PRESTATION", createdAt: new Date("2025-04-22T00:00:00Z"), budgetId: null, userId: user.id, type: "income" },
      { id: "k1k2k3k4-l5l6-m7m8-n9n0-o1o2o3o4o5p5", amount: 84021.69, emoji: "💰", description: "ECHEANCE MENSUELLE 05/2025", createdAt: new Date("2025-05-14T00:00:00Z"), budgetId: null, userId: user.id, type: "income" },
      { id: "k1k2k3k4-l5l6-m7m8-n9n0-o1o2o3o4o5p6", amount: 600, emoji: "💰", description: "virement PRESTATION", createdAt: new Date("2025-05-22T00:00:00Z"), budgetId: null, userId: user.id, type: "income" },
    ],
  }, */
];