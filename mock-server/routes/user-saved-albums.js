module.exports = function (server, router) {
  // Get current user's saved albums
  server.get("/me/albums", (req, res) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        error: true,
        message: "Unauthorized",
      });
    }

    // In a real app, you'd decode the token to get the user ID
    // For our mock, we'll now support both users
    // - trucpham04retry (ID: 2) from the original code
    // - trucpham041 (ID: 6) from your current login

    // Check if we have a user param to override
    const userParam = req.query.user;
    const userId = userParam === "trucpham041" ? 6 : 2; // Default to user ID 2 if not specified

    // Get the user's saved album IDs
    const savedAlbumIds = router.db
      .get("user_saved_albums")
      .filter({ userId })
      .map("albumId")
      .value();

    // Get the full album objects
    const savedAlbums = router.db
      .get("albums")
      .filter((album) => savedAlbumIds.includes(album.id))
      .value();

    // Add savedAt property to each album
    const result = savedAlbums.map((album) => {
      const saved = router.db
        .get("user_saved_albums")
        .find({ userId, albumId: album.id })
        .value();

      return {
        ...album,
        savedAt: saved ? saved.savedAt : null,
      };
    });

    return res.json(result);
  });

  // Save an album
  server.put("/me/albums/:id", (req, res) => {
    const albumId = parseInt(req.params.id);
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        error: true,
        message: "Unauthorized",
      });
    }

    // In a real app, you'd decode the token to get the user ID
    // For our mock, support both users
    const userParam = req.query.user;
    const userId = userParam === "trucpham041" ? 6 : 2; // Default to user ID 2 if not specified

    // Check if the album exists
    const album = router.db.get("albums").find({ id: albumId }).value();
    if (!album) {
      return res.status(404).json({
        error: true,
        message: "Album not found",
      });
    }

    // Check if already saved
    const existing = router.db
      .get("user_saved_albums")
      .find({ userId, albumId })
      .value();

    if (!existing) {
      // Create new entry
      const newId =
        (router.db.get("user_saved_albums").maxBy("id").value()?.id || 0) + 1;

      router.db
        .get("user_saved_albums")
        .push({
          id: newId,
          userId,
          albumId,
          savedAt: new Date().toISOString(),
        })
        .write();
    }

    return res.status(200).json({
      success: true,
      message: "Album saved successfully",
    });
  });

  // Remove a saved album
  server.delete("/me/albums/:id", (req, res) => {
    const albumId = parseInt(req.params.id);
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        error: true,
        message: "Unauthorized",
      });
    }

    // In a real app, you'd decode the token to get the user ID
    // For our mock, support both users
    const userParam = req.query.user;
    const userId = userParam === "trucpham041" ? 6 : 2; // Default to user ID 2 if not specified

    // Remove the saved album
    router.db.get("user_saved_albums").remove({ userId, albumId }).write();

    return res.status(200).json({
      success: true,
      message: "Album removed successfully",
    });
  });

  // Check if album is saved
  server.get("/me/albums/contains/:id", (req, res) => {
    const albumId = parseInt(req.params.id);
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        error: true,
        message: "Unauthorized",
      });
    }

    // In a real app, you'd decode the token to get the user ID
    // For our mock, support both users
    const userParam = req.query.user;
    const userId = userParam === "trucpham041" ? 6 : 2; // Default to user ID 2 if not specified

    // Check if album is saved
    const isSaved = router.db
      .get("user_saved_albums")
      .some({ userId, albumId })
      .value();

    return res.json({ isSaved });
  });
};
