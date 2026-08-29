import { createContext, useContext, useEffect, useState } from "react";

const ThemeContext = createContext(null);

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(() => localStorage.getItem("theme") || "light");

  // Keep the <html> class and localStorage in sync with the chosen theme
  useEffect(() => {
    const root = document.documentElement;
    if (theme === "dark") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
    localStorage.setItem("theme", theme);
  }, [theme]);

  const setLightMode = () => setTheme("light");
  const setDarkMode = () => setTheme("dark");

  return (
    <ThemeContext.Provider value={{ theme, setLightMode, setDarkMode }}>
      {children}
    </ThemeContext.Provider>
  );
};

// Custom hook for easy access to theme state anywhere in the app
export const useTheme = () => useContext(ThemeContext);

export default ThemeContext;
