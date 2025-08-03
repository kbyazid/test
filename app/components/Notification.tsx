import { Info, CheckCircle, AlertTriangle, XCircle } from "lucide-react"; // Importez les icônes nécessaires
import React, { useEffect } from "react";

// Définir les types possibles pour la notification
export type NotificationType = 'info' | 'success' | 'warning' | 'error'; // 'warning' ou 'danger' pour le rouge/orange  (par défaut : "info")
// Définir les positions possibles du toast
export type NotificationPosition = 'top-left' | 'top-center' | 'top-right' | 'center-center' |'bottom-left' | 'bottom-center' | 'bottom-right';

export interface NotificationDetails {
    message: string;
    type: NotificationType;
    position: NotificationPosition;
    persist?: boolean; // La notification reste jusqu'à une action manuelle
    opaque?: boolean;  // Affiche un fond sombre derrière la notification
    
}
export  interface NotificationProps {
    message: string;
    onclose: () => void;
    type: NotificationType; // Nouveau prop pour le type // type facultatif (par défaut : "info")
    position: NotificationPosition; // Nouveau prop pour la position
    // Vous pourriez ajouter un prop pour la durée si vous ne voulez pas que ce soit fixe
    // duration?: number;
    persist?: boolean; // La notification reste jusqu'à une action manuelle
    opaque?: boolean;  // Affiche un fond sombre derrière la notification
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
      'center-center': 'toast-center toast-center',
      'bottom-left': 'toast-bottom toast-left',
      'bottom-center': 'toast-bottom toast-center',
      'bottom-right': 'toast-bottom toast-right',
  };
  
const Notification: React.FC<NotificationProps> = ({
   message,
   onclose, 
   type, 
   position, 
   persist = false,
   opaque = false,
  }) => {
 
    // Utilisez useEffect pour fermer automatiquement la notification après 3 secondes
    /* useEffect(() => {
        const timer = setTimeout(() => {
          onclose();
        }, 3000); // Durée fixe de 3 secondes
        return () => clearTimeout(timer); // Nettoyer le timer si le composant est démonté plus tôt
      }, [onclose]); */ // Le hook dépend de 'onclose'
    // Fermeture automatique seulement si 'persist' est false

    useEffect(() => {
      if (!persist) {
          const timer = setTimeout(() => {
              onclose();
          }, 3000); // Durée de 3 secondes
          // Nettoyer le timer si le composant est démonté
          return () => clearTimeout(timer);
      }
  }, [onclose, persist]); // Le hook dépend maintenant de 'persist'

    // Sélectionnez l'icône appropriée en fonction du type
    const AlertIcon = typeToIcon[type];

    // Construisez la classe CSS pour la position
    const positionClassName = positionClasses[position];
    
    // Construisez la classe CSS pour le type d'alerte
    const alertTypeClassName = typeToAlertClass[type];

    // Contenu de l'alerte, réutilisable
    const AlertContent = (
      <div className={`alert ${alertTypeClassName} shadow-lg pointer-events-auto mt-6 p-2 text-xl`}>
          <span className="flex items-center text-base sm:text-lg">
          <AlertIcon className={`w-5 h-5 mr-2 font-bold ${type === 'info' ? 'text-accent' : ''}`} />
              {/* <AlertIcon className="w-5 h-5 mr-3 flex-shrink-0" /> */}
              {message}
          </span>
      </div>
  );

// Si 'opaque' est true, on utilise un conteneur qui couvre tout l'écran
  if (opaque) {
    return (
        <div 
            className="fixed inset-0 bg-gray-500 opacity-80 z-50 flex items-center justify-center p-4 backdrop-blur-sm"
            // Permet de fermer en cliquant sur le fond, sauf si la notif est persistante
            onClick={persist ? onclose : undefined}
        >
            {AlertContent}
        </div>
    );
} 

// Comportement par défaut (toast classique)
return (
    <div className={`toast ${positionClassName} z-50`}>
        {AlertContent}
    </div>
);
};
 /*  return ( */

   /*  <div className={`toast ${positionClassName} opacity-90 z-50 pointer-events-none`}>
      <div className={`alert ${alertTypeClassName} mt-6 p-2 text-xl shadow-lg opacity-70`}>
        <span className="flex items-center">
          <AlertIcon className={`w-4 mr-2 font-bold ${type === 'info' ? 'text-accent' : ''}`} />
          {message}
        </span>
      </div>
    </div> */

/*     <div className={`toast ${positionClassName} opacity-90 z-50   pointer-events-none ${opaque ? 'fixed bg-gray-500 bg-opacity-50 z-50 flex items-center justify-center p-4 backdrop-blur-sm w-full h-full' : ''}`} >
            <div className={`alert ${alertTypeClassName} mt-6 p-2 text-xl shadow-lg opacity-70`}>
                <span className="flex items-center">
                    <AlertIcon className={`w-4 mr-2 font-bold ${type === 'info' ? 'text-accent' : ''}`} />
                    {message}
                </span>
                {persist && (
                  <button onClick={onclose} className="ml-2 text-lg">
                    ×
                  </button>
                )}
            </div>
        </div> */


  /* ); 
};*/

export default Notification;