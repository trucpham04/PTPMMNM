// PlayerContext.tsx
import { createContext, useContext } from "react";
import { usePlayer as usePlayerHook } from "@/hooks/usePlayer"; // Đường dẫn tùy bạn
import type { ReactNode } from "react";

const PlayerContext = createContext<
  ReturnType<typeof usePlayerHook> | undefined
>(undefined);

interface PlayerProviderProps {
  children: ReactNode;
}

export const PlayerProvider = ({ children }: PlayerProviderProps) => {
  const player = usePlayerHook(); // dùng custom hook đã viết

  return (
    <PlayerContext.Provider value={player}>{children}</PlayerContext.Provider>
  );
};

export const usePlayer = () => {
  const context = useContext(PlayerContext);
  if (!context) {
    throw new Error("usePlayer must be used within an PlayerProvider");
  }
  return context;
};
