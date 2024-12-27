const express = require("express");
const sharp = require("sharp");
const path = require("path");
const fs = require("fs");

const app = express();
const port = 3000;

app.use(express.static(path.join(__dirname, "public")));

app.get("/convert/:id", async (req, res) => {
  const id = req.params.id;
  const filePath = path.join(__dirname, "..", "public", "image.png");
  if (!fs.existsSync(filePath)) {
    return res.status(404).send("파일을 찾을 수 없습니다.");
  }

  const text = id || "하이하이";

  try {
    // 먼저 원본 이미지의 메타데이터를 가져옵니다
    const metadata = await sharp(filePath).metadata();

    // SVG 텍스트를 원본 이미지 크기에 맞게 생성
    const maxLength = 4;
    const lines = [];
    for (let i = 0; i < text.length; i += maxLength) {
      lines.push(text.slice(i, i + maxLength));
    }
    const svgText = `
      <svg width="${metadata.width}" height="${metadata.height}">
        <style>
          .title { fill: #000; font-size: 64px; font-family: sans-serif; text-anchor: end; dominant-baseline: middle; }
        </style>
        ${lines
          .map(
            (line, index) =>
              `<text x="${metadata.width * 0.7}" y="${
                metadata.height / 2 + index * 50
              }" class="title">${line}</text>`
          )
          .join("")}
      </svg>
    `;

    const webpBuffer = await sharp(filePath)
      .composite([
        {
          input: Buffer.from(svgText),
          top: 0,
          left: 0,
        },
      ])
      .webp()
      .toBuffer();

    res.set("Content-Type", "image/webp");
    res.send(webpBuffer);
  } catch (error) {
    console.error(error);
    res.status(500).send("이미지를 변환하는 데 실패했습니다.");
  }
});

app.listen(port, () => {
  console.log(`서버가 http://localhost:${port} 에서 실행 중입니다.`);
});
