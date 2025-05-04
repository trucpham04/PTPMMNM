import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import HomePage from "@/pages/home";
import AIChat from "@/pages/ai-chat";
import DefaultLayout from "@/components/layouts/default-layout";
import AlbumPage from "@/pages/details/album";
import FavoritePage from "@/pages/favorite";
import AuthLayout from "@/components/layouts/auth-layout";
import LoginPage from "@/pages/auth/login";
import RegisterPage from "@/pages/auth/register";
import NotFoundPage from "@/pages/not-found";
import ArtistPage from "@/pages/details/artist";
import TrackPage from "@/pages/details/song";
import { AccountForm } from "@/pages/auth/account";
/* ADMIN */
import AdminPage from "@/pages/admin/adminPage";
import AdminLayout from "@/components/layouts/admin-layout/admin-layout";
import ArtistManagement from "@/pages/admin/content/ArtistManagement/ArtistManagement ";
import GenresManagement from "@/pages/admin/content/GenresManagement/GenresManagement";
import AlbumManagement from "@/pages/admin/content/AlbumManagement/AlbumManagement";
import SongManagement from "@/pages/admin/content/SongManagement/SongManagement";
import UserManagement from "@/pages/admin/content/UserManagement/UserManagement";
import AdminStatisticsPage from "@/pages/admin/content/Statistics/AdminStatisticsPage";
/* import PlaylistManagement from "@/pages/admin/content/PlaylistManagement/PlaylistManagement"; */

import SearchPage from "@/pages/search";
import QueuePage from "@/pages/queue";
import PlaylistPage from "@/pages/details/playlist";
function routes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<DefaultLayout />}>
          <Route index element={<HomePage />} />
          <Route path="account" element={<AccountForm />} />
          <Route path="home" element={<Navigate to={"/"} />} />
          <Route path="ai-chat" element={<AIChat />} />
          <Route path="album/:album_id" element={<AlbumPage />} />
          <Route path="playlist/:playlist_id" element={<PlaylistPage />} />
          <Route path="artist/:artist_id" element={<ArtistPage />} />
          <Route path="song/:song_id" element={<TrackPage />} />
          <Route path="favorites" element={<FavoritePage />} />
          <Route path="search" element={<SearchPage />} />
          <Route path="queue" element={<QueuePage />} />
        </Route>

        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AdminPage />} />
          <Route path="artist" element={<ArtistManagement />} />
          <Route path="genres" element={<GenresManagement />} />
          <Route path="album" element={<AlbumManagement />} />
          <Route path="song" element={<SongManagement />} />
          <Route path="user" element={<UserManagement />} />
          <Route path="statistics" element={<AdminStatisticsPage />} />
        </Route>

        <Route path="/" element={<AuthLayout />}>
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
