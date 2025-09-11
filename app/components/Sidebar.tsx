import React from "react";
import Link from "next/link";
import { 
  Home, 
  Users, 
  PieChart, 
  CreditCard, 
  FileText, 
  X,
  LogOut,
  Table,
  ListTodo
} from "lucide-react";

type Props = {
  desktopExpanded: boolean;
  mobileOpen: boolean;
  onCloseMobile: () => void;
};

const menu = [
  { key: "home", label: "Accueil", icon: Home, href: "/" },
  { key: "dashboard", label: "Tableau de bord", icon: PieChart, href: "/dashboard" },
  { key: "budget", label: "Mes budgets", icon: CreditCard, href: "/budget" },
  { key: "transaction", label: "Mes Transactions", icon: FileText, href: "/transaction" },
  { key: "todos", label: "Mes tâches", icon: ListTodo, href: "/todos" },
  { key: "users", label: "Mes utilisateurs", icon: Users, href: "/users" },
  { key: "test", label: "Transactions", icon: Table, href: "/test" },
];

const Sidebar: React.FC<Props> = ({ desktopExpanded, mobileOpen, onCloseMobile }) => {
  // Widths
  const wide = "w-64";
  const narrow = "w-20";

  return (
    <>
      {/* Desktop sidebar: visible on lg+ as fixed column */}
      <aside
        className={`hidden lg:flex flex-col bg-[#1E293B] text-white py-4 transition-width duration-300 h-full fixed left-0 top-16 ${desktopExpanded ? wide : narrow}`}
        style={{ height: 'calc(100vh - 4rem)' }} // Prend toute la hauteur sous la navbar
      >
        <div className="px-4">
          {/* Logo: show full text only when expanded */}
          <div className="mb-8 flex items-center gap-3 px-2 pt-2">
            <div className="bg-white text-[#1E293B] rounded-md w-10 h-10 flex items-center justify-center font-bold text-xl">e</div>
            {desktopExpanded && <div className="font-bold text-2xl text-[#38BDF8]">.budg</div>}
          </div>

          <nav className="flex-1">
            <ul className="space-y-2">
              {menu.map((m) => (
                <li key={m.key}>
                  <Link 
                    href={m.href} 
                    className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-[#334155] transition-colors"
                  >
                    <m.icon size={20} />
                    {desktopExpanded && <span className="text-sm">{m.label}</span>}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
          
          {/* Bouton de déconnexion en bas */}
          <div className="px-4 mt-auto">
            <Link 
              href="/sign-in" 
              className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-red-600 transition-colors text-red-300 hover:text-white"
            >
              <LogOut size={20} />
              {desktopExpanded && <span className="text-sm">Déconnexion</span>}
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
                <li key={m.key} onClick={onCloseMobile}>
                  <Link 
                    href={m.href} 
                    className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-[#334155] transition-colors"
                  >
                    <m.icon size={20} />
                    <span className="text-sm">{m.label}</span>
                  </Link>
                </li>
              ))}
            </ul>
            
            {/* Bouton de déconnexion en bas */}
            <div className="mt-auto">
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
    </>
  );
};

export default Sidebar;