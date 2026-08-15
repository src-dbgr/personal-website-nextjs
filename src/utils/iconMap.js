// src/utils/iconMap.js
import { Zap, Activity, Code, BookOpen } from "lucide-react";
import React from "react";

// Map von Icon-Namen zu den tatsächlichen Lucide-React-Komponenten
const iconComponentMap = {
  Zap: Zap,
  Activity: Activity,
  Code: Code,
  BookOpen: BookOpen,
  // Füge hier weitere benötigte Icons hinzu
};

/**
 * Gibt eine React-Komponente (Icon) basierend auf dem Namen zurück.
 * @param {string} iconName - Der Name des Lucide-Icons (als String).
 * @param {number} size - Die Größe des Icons.
 * @param {string} className - Optional: CSS-Klassen.
 * @returns {React.ReactElement} Die Lucide-Icon-Komponente.
 */
export const getIconComponent = (
  iconName,
  size = 24,
  className = "",
  strokeWidth = 2
) => {
  const Icon = iconComponentMap[iconName];
  if (Icon) {
    return <Icon size={size} className={className} strokeWidth={strokeWidth} />;
  }
  return null;
};
