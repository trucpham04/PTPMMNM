// FavoriteContext.tsx
import { createContext, useState, useContext } from "react";

const FavoriteContext = createContext<any>(null);

export const FavoriteProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [favoriteSongs, setFavoriteSongs] = useState([]);
  const [favoriteAlbums, setFavoriteAlbums] = useState([]);

  return (
    <FavoriteContext.Provider
      value={{
        favoriteSongs,
        setFavoriteSongs,
        favoriteAlbums,
        setFavoriteAlbums,
      }}
    >
      {children}
    </FavoriteContext.Provider>
  );
};

export const useFavoriteContext = () => {
  const context = useContext(FavoriteContext);
  if (!context) {
    throw new Error(
      "useFavoriteContext must be used within a FavoriteProvider",
    );
  }
  return context;
};
