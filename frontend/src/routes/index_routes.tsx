import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import HomePage from "@/pages/home";
import ExplorePage from "@/pages/explore";
import DefaultLayout from "@/components/layouts/default-layout";
import AlbumPage from "@/pages/details/album";
import AuthLayout from "@/components/layouts/auth-layout";
import LoginPage from "@/pages/auth/login";
import RegisterPage from "@/pages/auth/register";
import NotFoundPage from "@/pages/not-found";
import ArtistPage from "@/pages/details/artist";
import TrackPage from "@/pages/details/track";

function routes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<DefaultLayout />}>
          <Route index element={<HomePage />} />
          <Route path="/home" element={<Navigate to={"/"} />} />
          <Route path="/explore" element={<ExplorePage />} />
          <Route path="/album/:album_id" element={<AlbumPage />} />
          <Route path="/artist/:artist_id" element={<ArtistPage />} />
          <Route path="/track/:track_id" element={<TrackPage />} />
        </Route>

        <Route path="/auth" element={<AuthLayout />}>
          <Route index element={<Navigate to={"login"} />} />
          <Route path="login" element={<LoginPage />} />
          <Route path="register" element={<RegisterPage />} />
        </Route>
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default routes;
