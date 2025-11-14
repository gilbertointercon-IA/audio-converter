// -----------------------------
// server.js - Fly.io (MODO DIAGNÓSTICO)
// -----------------------------

import express from "express";
import multer from "multer";
import cors from "cors";

const app = express();

app.use(cors());

// ⚠️ IMPORTANTE: NÃO usar express.json() aqui globalmente.
// Para rota multipart, o Multer precisa pegar o body cru.
const upload = multer({ dest: "uploads/" }).any();

// -----------------------------
// ROTA DE TESTE
// -----------------------------
app.get("/", (req, res) => {
  res.json({ status: "OK", message: "Diagnóstico de upload ativo" });
});

// -----------------------------
// ROTA /convert — SÓ PARA LOGAR O QUE CHEGA
// -----------------------------
app.post("/convert", upload, (req, res) => {
  console.log("==== NOVA REQUISIÇÃO /convert ====");
  console.log("Content-Type:", req.headers["content-type"]);

  console.log("Body (req.body):", req.body);
  console.log("Files (req.files):", req.files);

  if (!req.files || req.files.length === 0) {
    console.error("❌ Nenhum arquivo chegou em req.files");
    return res.status(400).json({
      success: false,
      message: "Nenhum arquivo encontrado em req.files",
      body: req.body,
    });
  }

  const mapped = req.files.map((f) => ({
    fieldname: f.fieldname,
    originalname: f.originalname,
    mimetype: f.mimetype,
    size: f.size,
    path: f.path,
  }));

  console.log("Arquivos mapeados:", mapped);

  return res.json({
    success: true,
    message: "Arquivos recebidos com sucesso em /convert (modo diagnóstico).",
    files: mapped,
    body: req.body,
  });
});

// -----------------------------
// OPCIONAL – WHATSAPP WEBHOOK (MESMO ESQUEMA)
// -----------------------------
app.post("/webhook/waba", upload, (req, res) => {
  console.log("==== NOVA REQUISIÇÃO /webhook/waba ====");
  console.log("Content-Type:", req.headers["content-type"]);
  console.log("Body (req.body):", req.body);
  console.log("Files (req.files):", req.files);

  const mapped = (req.files || []).map((f) => ({
    fieldname: f.fieldname,
    originalname: f.originalname,
    mimetype: f.mimetype,
    size: f.size,
    path: f.path,
  }));

  return res.json({
    success: true,
    message: "Webhook WABA recebido (modo diagnóstico).",
    files: mapped,
    body: req.body,
  });
});

const port = process.env.PORT || 8080;
app.listen(port, () => {
  console.log("🚀 Servidor de diagnóstico rodando na porta " + port);
});
