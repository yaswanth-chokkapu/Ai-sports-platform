/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useEffect, useState, useRef } from "react";

const SessionContext = createContext();

const STORAGE_KEY = "sessions";
const BACKUP_KEY = "sessions_corrupted_backup";

function getInitialSessions() {
  if (typeof window === "undefined") return [];

  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return [];

    const parsed = JSON.parse(stored);
    if (Array.isArray(parsed)) {
      return parsed;
    }

    // Parsed value is not an array; back up raw data and fall back safely
    console.warn("Stored sessions data is not an array. Backing up corrupted value.");
    try {
      localStorage.setItem(BACKUP_KEY, stored);
    } catch {
      // Ignore backup write failures
    }
    return [];
  } catch (err) {
    console.warn("Unable to parse session data from localStorage:", err);
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        localStorage.setItem(BACKUP_KEY, raw);
      }
    } catch {
      // Ignore backup write failures
    }
    return [];
  }
}

export function SessionProvider({ children }) {
  const [sessions, setSessions] = useState(getInitialSessions);
  const isFirstRender = useRef(true);

  // Persist to localStorage whenever sessions change
  useEffect(() => {
    // Avoid redundant or destructive overwrite on initial mount
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    if (typeof window === "undefined") return;

    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(sessions));
    } catch (err) {
      console.warn("Unable to persist sessions to localStorage:", err);
    }
  }, [sessions]);

  const addSession = (session) => {
    if (!session || typeof session !== "object") return;
    setSessions((prev) => (Array.isArray(prev) ? [...prev, session] : [session]));
  };

  return (
    <SessionContext.Provider value={{ sessions, addSession }}>
      {children}
    </SessionContext.Provider>
  );
}

export function useSession() {
  const context = useContext(SessionContext);
  if (!context) {
    throw new Error("useSession must be used within a SessionProvider");
  }
  return context;
}




