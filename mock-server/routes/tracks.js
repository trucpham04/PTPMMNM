module.exports = function (server, router) {
  server.get("/tracks", (req, res) => {
    const { q, albumId, artistId } = req.query;
    let tracks = router.db.get("tracks");

    if (q) {
      tracks = tracks.filter(
        (track) =>
          track.title.toLowerCase().includes(q.toLowerCase()) ||
          track.artistName.toLowerCase().includes(q.toLowerCase()) ||
          track.albumName.toLowerCase().includes(q.toLowerCase())
      );
    }

    if (albumId) {
      tracks = tracks.filter({ albumID: parseInt(albumId) });
    }

    if (artistId) {
      tracks = tracks.filter({ artistID: parseInt(artistId) });
    }

    return res.json(tracks.value());
  });

  server.get("/tracks/:id", (req, res) => {
    const trackId = parseInt(req.params.id);
    const track = router.db.get("tracks").find({ id: trackId }).value();

    if (!track) {
      return res.status(404).json({ message: "Track not found" });
    }

    return res.json(track);
  });

  // Stream a track (mock endpoint)
  server.get("/stream/:id", (req, res) => {
    const trackId = parseInt(req.params.id);
    const track = router.db.get("tracks").find({ id: trackId }).value();

    if (!track) {
      return res.status(404).json({ message: "Track not found" });
    }

    // In a real app, you'd stream an audio file
    // For mock server, just return a success message
    return res.json({
      success: true,
      message: `Streaming track: ${track.title}`,
    });
  });

  server.get("/tracks/:id/mv", (req, res) => {
    const trackId = parseInt(req.params.id);
    const track = router.db.get("tracks").find({ id: trackId }).value();

    if (!track) {
      return res.status(404).json({ message: "Track not found" });
    }

    if (!track.has_mv) {
      return res
        .status(404)
        .json({ message: "No music video available for this track" });
    }

    return res.json({
      id: track.id,
      title: track.title,
      artist: track.artistName,
      thumbnail: track.mv_thumbnail,
      stream_url: `/stream/mv/${track.id}`,
      download_url: `/download/mv/${track.id}`,
    });
  });

  // Stream MV (mock endpoint)
  server.get("/stream/mv/:id", (req, res) => {
    const trackId = parseInt(req.params.id);
    const track = router.db.get("tracks").find({ id: trackId }).value();

    if (!track || !track.has_mv) {
      return res.status(404).json({ message: "Music video not found" });
    }

    // In a real app, you'd stream a video file with proper content-type headers
    // For mock server, just return a success message
    return res.json({
      success: true,
      message: `Streaming music video for: ${track.title}`,
      // This would be the actual video content in a real app
      streaming: true,
    });
  });

  // Download MV (mock endpoint)
  server.get("/download/mv/:id", (req, res) => {
    const trackId = parseInt(req.params.id);
    const track = router.db.get("tracks").find({ id: trackId }).value();

    if (!track || !track.has_mv) {
      return res.status(404).json({ message: "Music video not found" });
    }

    // In a real app, you'd set Content-Disposition header to "attachment"
    // and stream the file with proper content-type headers

    // For mock server, just return a success message
    return res.json({
      success: true,
      message: `Downloading music video for: ${track.title}`,
      fileName: `${track.artistName} - ${track.title}.mp4`,
      // This would be the actual video content in a real app
      downloading: true,
    });
  });
};
