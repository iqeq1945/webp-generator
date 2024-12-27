const express = require("express");
const sharp = require("sharp");
const fs = require("fs");
const path = require("path");

const app = express();

// Static route to serve images
app.get("/convert", async (req, res) => {
  const pngPath = path.join(__dirname, "image.png"); // Input PNG file path
  const webpPath = path.join(__dirname, "image.webp"); // Output WebP file path

  try {
    // Convert PNG to WebP
    await sharp(pngPath)
      .webp({ quality: 80 }) // Adjust quality as needed
      .toFile(webpPath);

    // Serve WebP image with correct Content-Type
    res.set("Content-Type", "image/webp");
    res.sendFile(webpPath);
  } catch (error) {
    console.error("Error during conversion:", error);
    res.status(500).send("Error converting image");
  }
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
