import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "@/pages/home";
import About from "@/pages/about";
import DefaultLayout from "@/components/layouts/default-layout";

function routes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<DefaultLayout />}>
          <Route path="" element={<Home />} />
          <Route path="/about" element={<About />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default routes;
