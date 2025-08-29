"use client";
import { useState, useEffect } from "react";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";

type LayoutWrapperProps = {
  children: React.ReactNode;
};

const LayoutWrapper = ({ children }: LayoutWrapperProps) => {
  const [desktopExpanded, setDesktopExpanded] = useState(true);
  const [mobileOpen, setMobileOpen] = useState(false);

  // Prevent body scroll when mobile drawer is open
  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
  }, [mobileOpen]);

  return (
    <div className="min-h-screen flex flex-col bg-base-200">
      <Navbar
        onToggleDesktop={() => setDesktopExpanded((v) => !v)}
        onToggleMobile={() => setMobileOpen((v) => !v)}
        desktopExpanded={desktopExpanded}
      />

      {/* Content area: left sidebar + main */}
      <div className="flex flex-1 pt-16"> {/* pt-16 to account for fixed navbar height */}
        <Sidebar
          desktopExpanded={desktopExpanded}
          mobileOpen={mobileOpen}
          onCloseMobile={() => setMobileOpen(false)}
        />

        {/* Main content */}
        <main className="flex-1 p-6 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
};

export default LayoutWrapper;