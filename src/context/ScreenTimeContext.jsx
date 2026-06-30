import { createContext, useContext, useState, useEffect } from "react";

const ScreenTimeContext = createContext();

export function ScreenTimeProvider({ children }) {
  const [screenTime, setScreenTime] = useState(() => {
    const savedScreenTime = localStorage.getItem("focusflow_screentime");

    return savedScreenTime
      ? JSON.parse(savedScreenTime)
      : {
          Instagram: 165,
          YouTube: 80,
          WhatsApp: 45,
        };
  });

  useEffect(() => {
    localStorage.setItem("focusflow_screentime", JSON.stringify(screenTime));
  }, [screenTime]);

  return (
    <ScreenTimeContext.Provider
      value={{
        screenTime,
        setScreenTime,
      }}
    >
      {children}
    </ScreenTimeContext.Provider>
  );
}

export function useScreenTime() {
  return useContext(ScreenTimeContext);
}
