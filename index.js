import express from "express";
import multer from "multer";
import cors from "cors";
import fs from "fs";
import ffmpeg from "fluent-ffmpeg";

const app = express();
app.use(cors());
app.use(express.json());

// ACEITA QUALQUER NOME DE CAMPO
const upload = multer({ dest: "uploads/" }).any();

// -----------------------------
// 🔥 ROTA QUE O BASE44 ESPERA
// -----------------------------
app.post("/webhook/waba", upload, (req, res) => {
  if (!req.files || req.files.length === 0) {
    return res.status(400).json({ error: "Nenhum arquivo enviado" });
  }

  const file = req.files[0];
  const inputPath = file.path;
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
// 🔥 ROTA /convert (continua funcionando também)
// -----------------------------
app.post("/convert", upload, (req, res) => {
  if (!req.files || req.files.length === 0) {
    return res.status(400).json({ error: "Nenhum arquivo enviado" });
  }

  const file = req.files[0];
  const inputPath = file.path;
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
app.get("/", (req, res) => {
  res.json({ status: "OK", message: "FFmpeg Converter ativo" });
});

const port = process.env.PORT || 8080;
app.listen(port, () => {
  console.log("Servidor rodando na porta " + port);
});
