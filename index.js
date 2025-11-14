// -----------------------------
// server.js - Fly.io FFmpeg Converter
// -----------------------------

import express from "express";
import multer from "multer";
import cors from "cors";
import fs from "fs";
import ffmpeg from "fluent-ffmpeg";

const app = express();

// ⚠️ IMPORTANTE: NÃO USE express.json() ANTES DO MULTER NAS ROTAS DE UPLOAD
app.use(cors());

// ---------------------------------------
// CONFIGURAÇÃO CORRETA DO MULTER
// mediaGateway envia o arquivo no campo "audio"
// ---------------------------------------
const upload = multer({ dest: "uploads/" }).single("audio");

// ---------------------------------------
// ROTA PRINCIPAL USADA PELO mediaGateway
// ---------------------------------------
app.post("/convert", upload, (req, res) => {
  console.log("==== NOVA REQUISIÇÃO /convert ====");
  console.log("Headers:", req.headers["content-type"]);
  console.log("req.file recebido:", req.file);

  if (!req.file) {
    console.error("❌ Nenhum arquivo recebido no campo 'audio'");
    return res.status(400).json({ error: "Nenhum arquivo enviado no campo 'audio'" });
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

// ---------------------------------------
// OPCIONAL – WHATSAPP WEBHOOK
// ---------------------------------------
app.post("/webhook/waba", upload, (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "Nenhum arquivo enviado no campo 'audio'" });
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

// ---------------------------------------
// ROTA DE TESTE
// ---------------------------------------
app.get("/", (req, res) => {
  res.json({ status: "OK", message: "FFmpeg Converter ativo" });
});

const port = process.env.PORT || 8080;
app.listen(port, () => {
  console.log("🚀 Servidor rodando na porta " + port);
});
