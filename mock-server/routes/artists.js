module.exports = function (server, router) {
  server.get("/artists", (req, res) => {
    const { q } = req.query;
    const artists = router.db.get("artists");

    if (q) {
      const results = artists
        .filter((artist) => artist.name.toLowerCase().includes(q.toLowerCase()))
        .value();
      return res.json(results);
    }

    return res.json(artists.value());
  });

  server.get("/artists/:id", (req, res) => {
    const artist = router.db
      .get("artists")
      .find({ id: parseInt(req.params.id) })
      .value();

    if (!artist) {
      return res.status(404).json({ message: "Artist not found" });
    }

    return res.json(artist);
  });
};
