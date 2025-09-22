"use client";

import { useState, useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import { updateUserTheme, getUserTheme } from "@/action";
import { Palette } from "lucide-react";

const themes = [
  { name: "light", label: "Clair" },
  { name: "dark", label: "Sombre" },
  { name: "cupcake", label: "Cupcake" },
  { name: "bumblebee", label: "Bumblebee" },
  { name: "emerald", label: "Emerald" },
  { name: "corporate", label: "Corporate" },
  { name: "synthwave", label: "Synthwave" },
  { name: "retro", label: "Retro" },
  { name: "cyberpunk", label: "Cyberpunk" },
  { name: "valentine", label: "Valentine" },
  { name: "halloween", label: "Halloween" },
  { name: "garden", label: "Garden" },
  { name: "forest", label: "Forest" },
  { name: "aqua", label: "Aqua" },
  { name: "lofi", label: "Lofi" },
  { name: "pastel", label: "Pastel" },
  { name: "fantasy", label: "Fantasy" },
  { name: "wireframe", label: "Wireframe" },
  { name: "black", label: "Black" },
  { name: "luxury", label: "Luxury" },
  { name: "dracula", label: "Dracula" },
  { name: "cmyk", label: "CMYK" },
  { name: "autumn", label: "Autumn" },
  { name: "business", label: "Business" },
  { name: "acid", label: "Acid" },
  { name: "lemonade", label: "Lemonade" },
  { name: "night", label: "Night" },
  { name: "coffee", label: "Coffee" },
  { name: "winter", label: "Winter" },
  { name: "dim", label: "Dim" },
  { name: "nord", label: "Nord" },
  { name: "sunset", label: "Sunset" },
];

export default function ThemePalette() {
  const { user, isSignedIn } = useUser();
  const [currentTheme, setCurrentTheme] = useState("light");

  useEffect(() => {
    if (!isSignedIn) return;
    
    const initializeTheme = async () => {
      let theme = "light";
      
      if (isSignedIn && user?.primaryEmailAddress?.emailAddress) {
        try {
          theme = await getUserTheme(user.primaryEmailAddress.emailAddress);
        } catch (error) {
          console.error("Failed to load user theme:", error);
          theme = localStorage.getItem("theme") || "light";
        }
      } else {
        theme = localStorage.getItem("theme") || "light";
      }
      
      setCurrentTheme(theme);
    };

    initializeTheme();
  }, [isSignedIn, user]);

  // Don't render if user is not signed in
  if (!isSignedIn) {
    return null;
  }

  const changeTheme = async (theme: string) => {
    setCurrentTheme(theme);
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);

    if (user?.primaryEmailAddress?.emailAddress) {
      try {
        await updateUserTheme(user.primaryEmailAddress.emailAddress, theme);
      } catch (error) {
        console.error("Failed to save theme:", error);
      }
    }
  };

  return (
    <div className="dropdown dropdown-end">
      <div tabIndex={0} role="button" className="btn btn-ghost btn-circle text-white">
        <Palette size={20} />
      </div>
      <ul tabIndex={0} className="dropdown-content menu bg-base-300 text-base-content rounded-box z-[1] w-52 p-2 shadow max-h-60 overflow-y-auto">
        {themes.map((theme) => (
          <li key={theme.name}>
            <button
              onClick={() => changeTheme(theme.name)}
              className={`flex items-center justify-between ${
                currentTheme === theme.name ? "active" : ""
              }`}
            >
              <span>{theme.label}</span>
              {currentTheme === theme.name && (
                <div className="w-2 h-2 bg-primary rounded-full" />
              )}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}