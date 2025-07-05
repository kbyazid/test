import { Info, CheckCircle, AlertTriangle, XCircle } from "lucide-react"; // Importez les icônes nécessaires
import React, { useEffect } from "react";

// Définir les types possibles pour la notification
export type NotificationType = 'info' | 'success' | 'warning' | 'error'; // 'warning' ou 'danger' pour le rouge/orange  (par défaut : "info")
// Définir les positions possibles du toast
export type NotificationPosition = 'top-left' | 'top-center' | 'top-right' | 'bottom-left' | 'bottom-center' | 'bottom-right';

export  interface NotificationProps {
    message: string;
    onclose: () => void;
    type: NotificationType; // Nouveau prop pour le type // type facultatif (par défaut : "info")
    position: NotificationPosition; // Nouveau prop pour la position
    // Vous pourriez ajouter un prop pour la durée si vous ne voulez pas que ce soit fixe
    // duration?: number;
  }

  // Mapper les types de notification aux classes CSS d'alerte Tailwind
const typeToAlertClass: Record<NotificationType, string> = {
    info: 'alert-info',
    success: 'alert-success',
    warning: 'alert-warning', // Utilisez 'alert-warning' pour l'orange/jaune
    error: 'alert-error',   // Utilisez 'alert-error' pour le rouge
  };
  
  // Mapper les types de notification aux composants d'icônes
  const typeToIcon: Record<NotificationType, React.ElementType> = {
    info: Info,
    success: CheckCircle,
    warning: AlertTriangle,
    error: XCircle,
  };
  
  // Mapper les positions aux classes CSS de position de toast Tailwind
  const positionClasses: Record<NotificationPosition, string> = {
      'top-left': 'toast-top toast-left',
      'top-center': 'toast-top toast-center',
      'top-right': 'toast-top toast-right',
      'bottom-left': 'toast-bottom toast-left',
      'bottom-center': 'toast-bottom toast-center',
      'bottom-right': 'toast-bottom toast-right',
  };
  
const Notification: React.FC<NotificationProps> = ({ message, onclose, type, position }) => {
 
    // Utilisez useEffect pour fermer automatiquement la notification après 3 secondes
    useEffect(() => {
        const timer = setTimeout(() => {
          onclose();
        }, 3000); // Durée fixe de 3 secondes
        return () => clearTimeout(timer); // Nettoyer le timer si le composant est démonté plus tôt
      }, [onclose]); // Le hook dépend de 'onclose'

    // Sélectionnez l'icône appropriée en fonction du type
    const AlertIcon = typeToIcon[type];

    // Construisez la classe CSS pour la position
    const positionClassName = positionClasses[position];
    
    // Construisez la classe CSS pour le type d'alerte
    const alertTypeClassName = typeToAlertClass[type];

  return (
    // Div conteneur principal pour la position du toast
    <div className={`toast ${positionClassName}`}>
      {/* Div pour le style de l'alerte, l'ombre, la marge interne, etc. */}
      {/* Ajout de la classe 'opacity-90' pour la transparence (ajustez la valeur si nécessaire) */}
      <div className={`alert ${alertTypeClassName} p-2 text-xl shadow-lg opacity-70`}>
        <span className="flex items-center">
          {/* Utilisez le composant d'icône sélectionné */}
          {/* La classe 'text-accent' était spécifique à 'info' dans l'original. Souvent, la couleur de l'icône est gérée par la classe alert-* */}
          {/* Vous pouvez la laisser ou la supprimer selon votre design. Je l'ai laissée conditionnellement pour l'exemple info */}
          <AlertIcon className={`w-4 mr-2 font-bold ${type === 'info' ? 'text-accent' : ''}`} />
          {message}
        </span>
      </div>
    </div>
  );
};

export default Notification;