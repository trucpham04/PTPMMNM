import Routes from "@/routes/index_routes";
import { useAuth } from "./contexts/authContext";
import { useEffect } from "react";

function App() {
  const { setUser } = useAuth();
  useEffect(() => {
    const user = localStorage.getItem("user");
    if (user) {
      setUser(JSON.parse(user));
    }
  }, []);

  return (
    <>
      <Routes />
    </>
  );
}

export default App;
