import { createContext, useContext, useEffect, useState } from "react";

const SessionContext = createContext();

export function SessionProvider({ children }) {
  const [sessions, setSessions] = useState(() => {
    // 🔑 LOAD from localStorage on refresh
    const stored = localStorage.getItem("sessions");
    return stored ? JSON.parse(stored) : [];
  });

  // 🔁 SAVE to localStorage whenever sessions change
  useEffect(() => {
    localStorage.setItem("sessions", JSON.stringify(sessions));
  }, [sessions]);

  const addSession = (session) => {
    setSessions((prev) => [...prev, session]);
  };

  return (
    <SessionContext.Provider value={{ sessions, addSession }}>
      {children}
    </SessionContext.Provider>
  );
}

export function useSession() {
  return useContext(SessionContext);
}



