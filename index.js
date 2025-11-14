import express from "express";
import multer from "multer";
import cors from "cors";
import fs from "fs";
import ffmpeg from "fluent-ffmpeg";

const app = express();
app.use(cors());
app.use(express.json());

// -------------------------------------------
// 🟦 MULTER — ACEITA QUALQUER NOME DE CAMPO
// -------------------------------------------
const upload = multer({ dest: "uploads/" }).any();

// ======================================================
// 🔥 ROTA PRINCIPAL — É ESTA QUE O BASE44 ESTÁ USANDO
// ======================================================
app.post("/webhook/waba", upload, (req, res) => {
  try {
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
        try {
          const fileData = fs.readFileSync(outputPath);

          fs.unlinkSync(inputPath);
          fs.unlinkSync(outputPath);

          res.setHeader("Content-Type", "audio/ogg");
          return res.send(fileData);
        } catch (err) {
          console.error("Erro lendo arquivo convertido:", err);
          return res.status(500).json({ error: "Erro ao ler arquivo convertido" });
        }
      })
      .on("error", (err) => {
        console.error("Erro na conversão FFmpeg:", err);
        return res.status(500).json({ error: "Falha na conversão" });
      })
      .run();
  } catch (err) {
    console.error("Erro inesperado:", err);
    return res.status(500).json({ error: "Erro interno no servidor" });
  }
});

// ======================================================
// 🔥 ROTA /convert — opcional, mas deixei ativa
// ======================================================
app.post("/convert", upload, (req, res) => {
  try {
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
        try {
          const fileData = fs.readFileSync(outputPath);

          fs.unlinkSync(inputPath);
          fs.unlinkSync(outputPath);

          res.setHeader("Content-Type", "audio/ogg");
          return res.send(fileData);
        } catch (err) {
          console.error("Erro lendo arquivo convertido:", err);
          return res.status(500).json({ error: "Erro ao ler arquivo convertido" });
        }
      })
      .on("error", (err) => {
        console.error("Erro na conversão FFmpeg:", err);
        return res.status(500).json({ error: "Falha na conversão" });
      })
      .run();
  } catch (err) {
    console.error("Erro inesperado:", err);
    return res.status(500).json({ error: "Erro interno no servidor" });
  }
});

// ======================================================
app.get("/", (req, res) => {
  res.json({ status: "OK", message: "FFmpeg Converter ativo" });
});

// ======================================================
const port = process.env.PORT || 8080;
app.listen(port, () => {
  console.log("Servidor rodando na porta " + port);
});
