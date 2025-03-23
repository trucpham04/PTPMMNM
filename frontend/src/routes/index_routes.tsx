import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomePage from "@/pages/home";
import ExplorePage from "@/pages/explore";
import DefaultLayout from "@/components/layouts/default-layout";
import Album from "@/pages/album";

function routes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<DefaultLayout />}>
          <Route path="" element={<HomePage />} />
          <Route path="/explore" element={<ExplorePage />} />
          <Route path="/album/:album_id" element={<Album />} />
        </Route>
        <Route path="*" element={<div>404</div>} />
      </Routes>
    </BrowserRouter>
  );
}

export default routes;
