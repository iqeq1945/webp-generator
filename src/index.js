const express = require("express");
const sharp = require("sharp");
const path = require("path");
const fs = require("fs");

const app = express();
const port = 3000;

// 정적 파일 경로 설정
app.use(express.static(path.join(__dirname, "public")));

app.get("/convert", async (req, res) => {
  const filePath = path.join(__dirname, "..", "public", "image.png");

  if (!fs.existsSync(filePath)) {
    return res.status(404).send("파일을 찾을 수 없습니다.");
  }

  try {
    const webpBuffer = await sharp(filePath).webp().toBuffer();

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
