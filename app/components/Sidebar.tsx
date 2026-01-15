import React, { useState } from "react";
import Link from "next/link";
import { 
  Home, 
  Users, 
  PieChart, 
  CreditCard, 
  FileText, 
  X,
  LogOut,
  ListTodo,
  ChevronDown,
  ChevronRight,
  Calculator as CalculatorIcon
} from "lucide-react";
import Calculator from "./Calculator";

type Props = {
  desktopExpanded: boolean;
  mobileOpen: boolean;
  onCloseMobile: () => void;
  onExpandSidebar?: () => void;
};

const menu = [
  { key: "home", label: "Accueil", icon: Home, href: "/home" },
  { key: "dashboard", label: "Tableau de bord", icon: PieChart, href: "/dashboard" },
  { 
    key: "budget", 
    label: "Mes budgets", 
    icon: CreditCard, 
    submenu: [
      { key: "saisie", label: "Saisie", href: "/budget" },
      { key: "etat", label: "Visualisation", href: "/" }
    ]
  },
  { 
    key: "transaction", 
    label: "Mes Transactions", 
    icon: FileText, 
    submenu: [
      { key: "etat1", label: "Periodique", href: "/transaction" },
      { key: "etat2", label: "Recherche", href: "/test" }
    ]
  },
  { key: "todos", label: "Mes tâches", icon: ListTodo, href: "/todos" },
  { key: "users", label: "Mes utilisateurs", icon: Users, href: "/users" },
];

const Sidebar: React.FC<Props> = ({ desktopExpanded, mobileOpen, onCloseMobile, onExpandSidebar }) => {
  const [expandedSubmenu, setExpandedSubmenu] = useState<string | null>(null);
  const [calculatorOpen, setCalculatorOpen] = useState(false);
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);
  
  // Widths
  const wide = "w-64";
  const narrow = "w-20";
  
  const toggleSubmenu = (key: string, hasSubmenu: boolean, onExpandSidebar?: () => void) => {
    // Si la sidebar est rétrécie et l'item a un sous-menu, l'élargir d'abord
    if (!desktopExpanded && hasSubmenu && onExpandSidebar) {
      onExpandSidebar();
      // Délai pour permettre l'animation d'élargissement avant d'ouvrir le sous-menu
      setTimeout(() => {
        setExpandedSubmenu(key);
      }, 300);
    } else {
      // Comportement normal : toggle du sous-menu
      setExpandedSubmenu(expandedSubmenu === key ? null : key);
    }
  };

  return (
    <>
      {/* Desktop sidebar: visible on lg+ as fixed column */}
      <aside
        className={`hidden lg:flex flex-col bg-[#1E293B] text-white py-4 transition-all duration-300 ease-in-out h-full fixed left-0 top-16 ${desktopExpanded ? wide : narrow}`}
        style={{ height: 'calc(100vh - 4rem)' }}
      >
        <div className="px-4">
          {/* Logo: show full text only when expanded */}
          <div className="mb-8 flex items-center gap-3 px-2 pt-2 overflow-hidden">
            <div className="bg-white text-[#1E293B] rounded-md w-10 h-10 flex items-center justify-center font-bold text-xl flex-shrink-0">e</div>
            <div className={`font-bold text-2xl text-[#38BDF8] whitespace-nowrap transition-all duration-300 ${desktopExpanded ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4'}`}>
              .budg
            </div>
          </div>

          <nav className="flex-1">
            <ul className="space-y-2">
              {menu.map((m) => (
                <li key={m.key} className="relative">
                  {m.submenu ? (
                    <>
                      <button 
                        onClick={() => toggleSubmenu(m.key, true, onExpandSidebar)}
                        onMouseEnter={() => setHoveredItem(m.key)}
                        onMouseLeave={() => setHoveredItem(null)}
                        className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-[#334155] transition-all duration-200 w-full text-left relative"
                      >
                        <m.icon size={20} className="flex-shrink-0" />
                        <span className={`text-sm flex-1 whitespace-nowrap transition-all duration-300 ${desktopExpanded ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4'}`}>
                          {m.label}
                        </span>
                        {desktopExpanded && (
                          <span className="transition-transform duration-200">
                            {expandedSubmenu === m.key ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                          </span>
                        )}
                        {!desktopExpanded && hoveredItem === m.key && (
                          <div className="absolute left-full ml-2 px-3 py-2 bg-[#334155] text-white text-sm rounded-lg shadow-lg whitespace-nowrap z-50">
                            {m.label}
                            <div className="absolute left-0 top-1/2 -translate-x-1 -translate-y-1/2 w-2 h-2 bg-[#334155] rotate-45"></div>
                          </div>
                        )}
                      </button>
                      {desktopExpanded && expandedSubmenu === m.key && (
                        <ul className="ml-8 mt-2 space-y-1">
                          {m.submenu.map((sub) => (
                            <li key={sub.key}>
                              <Link 
                                href={sub.href}
                                className="flex items-center px-4 py-2 rounded-lg hover:bg-[#334155] transition-all duration-200 text-sm"
                              >
                                {sub.label}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      )}
                    </>
                  ) : (
                    <Link 
                      href={m.href}
                      onMouseEnter={() => setHoveredItem(m.key)}
                      onMouseLeave={() => setHoveredItem(null)}
                      className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-[#334155] transition-all duration-200 relative"
                    >
                      <m.icon size={20} className="flex-shrink-0" />
                      <span className={`text-sm whitespace-nowrap transition-all duration-300 ${desktopExpanded ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4'}`}>
                        {m.label}
                      </span>
                      {!desktopExpanded && hoveredItem === m.key && (
                        <div className="absolute left-full ml-2 px-3 py-2 bg-[#334155] text-white text-sm rounded-lg shadow-lg whitespace-nowrap z-50">
                          {m.label}
                          <div className="absolute left-0 top-1/2 -translate-x-1 -translate-y-1/2 w-2 h-2 bg-[#334155] rotate-45"></div>
                        </div>
                      )}
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </nav>
          
          {/* Calculatrice et déconnexion en bas */}
          <div className="px-4 mt-auto space-y-2">
            <button 
              onClick={() => setCalculatorOpen(true)}
              onMouseEnter={() => setHoveredItem('calculator')}
              onMouseLeave={() => setHoveredItem(null)}
              className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-[#334155] transition-all duration-200 w-full text-left relative"
            >
              <CalculatorIcon size={20} className="flex-shrink-0" />
              <span className={`text-sm whitespace-nowrap transition-all duration-300 ${desktopExpanded ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4'}`}>
                Calculatrice
              </span>
              {!desktopExpanded && hoveredItem === 'calculator' && (
                <div className="absolute left-full ml-2 px-3 py-2 bg-[#334155] text-white text-sm rounded-lg shadow-lg whitespace-nowrap z-50">
                  Calculatrice
                  <div className="absolute left-0 top-1/2 -translate-x-1 -translate-y-1/2 w-2 h-2 bg-[#334155] rotate-45"></div>
                </div>
              )}
            </button>
            
            <Link 
              href="/sign-in"
              onMouseEnter={() => setHoveredItem('logout')}
              onMouseLeave={() => setHoveredItem(null)}
              className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-red-600 transition-all duration-200 text-red-300 hover:text-white relative"
            >
              <LogOut size={20} className="flex-shrink-0" />
              <span className={`text-sm whitespace-nowrap transition-all duration-300 ${desktopExpanded ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4'}`}>
                Déconnexion
              </span>
              {!desktopExpanded && hoveredItem === 'logout' && (
                <div className="absolute left-full ml-2 px-3 py-2 bg-red-600 text-white text-sm rounded-lg shadow-lg whitespace-nowrap z-50">
                  Déconnexion
                  <div className="absolute left-0 top-1/2 -translate-x-1 -translate-y-1/2 w-2 h-2 bg-red-600 rotate-45"></div>
                </div>
              )}
            </Link>
          </div>
        </div>
      </aside>

      {/* Mobile sidebar overlay */}
      <div
        className={`lg:hidden fixed inset-0 z-40 transition-opacity ${
          mobileOpen ? "pointer-events-auto" : "pointer-events-none"
        }`}
        aria-hidden={!mobileOpen}
      >
        {/* Backdrop */}
        <div
          className={`absolute inset-0 bg-black/40 transition-opacity ${mobileOpen ? "opacity-100" : "opacity-0"}`}
          onClick={onCloseMobile}
        />

        {/* Drawer */}
        <aside
          className={`absolute left-0 top-0 bottom-0 w-64 bg-[#1E293B] text-white shadow-lg transform transition-transform ${mobileOpen ? "translate-x-0" : "-translate-x-full"}`}
        >
          <div className="p-4 flex items-center justify-between border-b border-[#334155]">
            <div className="flex items-center gap-3">
              <div className="bg-white text-[#1E293B] rounded-md w-10 h-10 flex items-center justify-center font-bold text-xl">e</div>
              <div className="font-semibold text-xl">.budg</div>
            </div>
            <button className="btn btn-ghost text-white" onClick={onCloseMobile} aria-label="Fermer le menu">
              <X size={24} />
            </button>
          </div>

          <nav className="p-4 flex flex-col h-full">
            <ul className="space-y-2 flex-1">
              {menu.map((m) => (
                <li key={m.key}>
                  {m.submenu ? (
                    <>
                      <button 
                        onClick={() => toggleSubmenu(m.key, false)}
                        className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-[#334155] transition-colors w-full text-left"
                      >
                        <m.icon size={20} />
                        <span className="text-sm flex-1">{m.label}</span>
                        {expandedSubmenu === m.key ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                      </button>
                      {expandedSubmenu === m.key && (
                        <ul className="ml-8 mt-2 space-y-1">
                          {m.submenu.map((sub) => (
                            <li key={sub.key}>
                              <Link 
                                href={sub.href}
                                onClick={onCloseMobile}
                                className="flex items-center px-4 py-2 rounded-lg hover:bg-[#334155] transition-colors text-sm"
                              >
                                {sub.label}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      )}
                    </>
                  ) : (
                    <Link 
                      href={m.href} 
                      onClick={onCloseMobile}
                      className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-[#334155] transition-colors"
                    >
                      <m.icon size={20} />
                      <span className="text-sm">{m.label}</span>
                    </Link>
                  )}
                </li>
              ))}
            </ul>
            
            {/* Calculatrice et déconnexion en bas */}
            <div className="mt-auto space-y-2">
              <button 
                onClick={() => {
                  setCalculatorOpen(true);
                  onCloseMobile();
                }}
                className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-[#334155] transition-colors w-full text-left"
              >
                <CalculatorIcon size={20} />
                <span className="text-sm">Calculatrice</span>
              </button>
              
              <Link 
                href="/sign-in" 
                className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-red-600 transition-colors text-red-300 hover:text-white"
                onClick={onCloseMobile}
              >
                <LogOut size={20} />
                <span className="text-sm">Déconnexion</span>
              </Link>
            </div>
          </nav>
        </aside>
      </div>

      {/* Add padding to main content when sidebar is expanded on desktop */}
      {desktopExpanded && (
        <div className="hidden lg:block" style={{ width: '16rem' }}></div>
      )}
      {!desktopExpanded && (
        <div className="hidden lg:block" style={{ width: '5rem' }}></div>
      )}
      
      {/* Calculator Modal */}
      <Calculator 
        isOpen={calculatorOpen} 
        onClose={() => setCalculatorOpen(false)} 
      />
    </>
  );
};

export default Sidebar;