import Routes from "@/routes/index_routes";
import { useAuth } from "./contexts/authContext";
import { useEffect } from "react";
import { useUser } from "./hooks";

function App() {
  const { setUser } = useAuth();
  const { getCurrentUser } = useUser();
  useEffect(() => {
    const currentUser = async () => {
      const user = await getCurrentUser();
      setUser(user);
    };

    currentUser();
  }, []);

  return (
    <>
      <Routes />
    </>
  );
}

export default App;
