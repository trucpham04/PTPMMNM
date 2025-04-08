module.exports = function (server, router) {
  server.get("/albums", (req, res) => {
    const { q } = req.query;
    const albums = router.db.get("albums");

    if (q) {
      const results = albums
        .filter(
          (album) =>
            album.name.toLowerCase().includes(q.toLowerCase()) ||
            album.authorName.toLowerCase().includes(q.toLowerCase())
        )
        .value();
      return res.json(results);
    }

    return res.json(albums.value());
  });

  server.get("/albums/:id", (req, res) => {
    const albumId = parseInt(req.params.id);
    const album = router.db.get("albums").find({ id: albumId }).value();

    if (!album) {
      return res.status(404).json({ message: "Album not found" });
    }

    // Get the album's tracks
    const tracks = router.db.get("tracks").filter({ albumID: albumId }).value();

    // Return the album with its tracks
    return res.json({
      ...album,
      tracks: tracks,
    });
  });
};
