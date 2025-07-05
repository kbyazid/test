/* import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
} */

 /**
 * Formate un montant en devise avec séparateurs
 * @param amount Montant à formater
 * @param currency Devise à afficher (par défaut "DA")
 * @param decimals Nombre de décimales à afficher (par défaut 2)
 * @returns Montant formaté (ex: "1 234,56 DA")
 */
export function formatCurrency(
  amount: number,
  currency: string = "DA",
  decimals: number = 2
): string {
  // Gestion des valeurs non numériques
  if (isNaN(amount)) return `0,00 ${currency}`

  // Formatage avec séparateur de milliers et décimales
  const formattedAmount = new Intl.NumberFormat('fr-FR', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals
  }).format(amount)

  return `${formattedAmount} ${currency}`
}

/**
 * Formate une date selon les options spécifiées
 * @param date Date à formater (string, Date ou timestamp)
 * @param options Options de formatage
 * @returns Date formatée selon les options
 */
export function formatDate(
  date: string | Date | number,
  options: {
    withTime?: boolean
    dateStyle?: 'full' | 'long' | 'medium' | 'short'
    timeStyle?: 'full' | 'long' | 'medium' | 'short'
  } = {}
): string {
  // Conversion en objet Date si nécessaire
  const dateObj = typeof date === 'string' || typeof date === 'number' 
    ? new Date(date) 
    : date

  // Options par défaut
  const {
    withTime = false,
    dateStyle = 'short',
    timeStyle = 'short'
  } = options

  try {
    if (withTime) {
      return new Intl.DateTimeFormat('fr-FR', {
        dateStyle,
        timeStyle
      }).format(dateObj)
    }
    return new Intl.DateTimeFormat('fr-FR', {
      dateStyle
    }).format(dateObj)
  } catch (error) {
    console.error('Error formatting date:', error)
    return 'Date invalide'
  }
}

// Optionnel: Fonctions supplémentaires utiles pour les transactions
/**
 * Formate une date pour l'affichage dans un tableau (date courte)
 * @param date Date à formater
 * @returns Date au format "JJ/MM/AAAA"
 */
export function formatTableDate(date: string | Date | number): string {
  return formatDate(date, { dateStyle: 'short' })
}

/**
 * Formate une heure pour l'affichage dans un tableau (heure courte)
 * @param date Date contenant l'heure à formater
 * @returns Heure au format "HH:MM"
 */
export function formatTableTime(date: string | Date | number): string {
  const dateObj = typeof date === 'string' || typeof date === 'number' 
    ? new Date(date) 
    : date
  return dateObj.toLocaleTimeString('fr-FR', {
    hour: '2-digit',
    minute: '2-digit'
  })
} 