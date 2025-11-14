import express from "express";
import multer from "multer";
import cors from "cors";
import fs from "fs";
import ffmpeg from "fluent-ffmpeg";

const app = express();

app.use(cors());

// mediaGateway ENVIA "audio", então MULTER tem que esperar "audio"
const upload = multer({ dest: "uploads/" }).single("audio");

// -----------------------------
// ROTA /convert
// -----------------------------
app.post("/convert", upload, (req, res) => {
  console.log("=== /convert ===");
  console.log("req.file:", req.file);

  if (!req.file) {
    return res.status(400).json({
      error: 'Nenhum arquivo enviado no campo "audio"',
    });
  }

  const inputPath = req.file.path;
  const outputPath = `${inputPath}.ogg`;

  ffmpeg(inputPath)
    .output(outputPath)
    .audioCodec("libopus")
    .format("ogg")
    .on("end", () => {
      const fileData = fs.readFileSync(outputPath);

      fs.unlinkSync(inputPath);
      fs.unlinkSync(outputPath);

      res.setHeader("Content-Type", "audio/ogg");
      res.send(fileData);
    })
    .on("error", (err) => {
      console.error("Erro na conversão:", err);
      res.status(500).json({ error: "Falha na conversão" });
    })
    .run();
});

// -----------------------------
// ROTA /webhook/waba
// -----------------------------
app.post("/webhook/waba", upload, (req, res) => {
  console.log("=== /webhook/waba ===");
  console.log("req.file:", req.file);

  if (!req.file) {
    return res.status(400).json({
      error: 'Nenhum arquivo enviado no campo "audio"',
    });
  }

  const inputPath = req.file.path;
  const outputPath = `${inputPath}.ogg`;

  ffmpeg(inputPath)
    .output(outputPath)
    .audioCodec("libopus")
    .format("ogg")
    .on("end", () => {
      const fileData = fs.readFileSync(outputPath);

      fs.unlinkSync(inputPath);
      fs.unlinkSync(outputPath);

      res.setHeader("Content-Type", "audio/ogg");
      res.send(fileData);
    })
    .on("error", (err) => {
      res.status(500).json({ error: "Falha na conversão" });
    })
    .run();
});

app.get("/", (req, res) => {
  res.json({ status: "OK", message: "FFmpeg Converter ativo" });
});

const port = process.env.PORT || 8080;
app.listen(port, () => {
  console.log("🚀 Servidor rodando na porta " + port);
});
