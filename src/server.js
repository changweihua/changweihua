import express from "express";
import { fileURLToPath } from "url";
import { dirname } from "path";
import fs from "fs";
import path from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = 3000;

// 静态文件服务
app.use(express.static("src"));

// 解析JSON请求体
app.use(express.json());

// 处理SVG保存请求
app.post("/save-svg", (req, res) => {
  const { svg } = req.body;
  if (!svg) {
    return res.json({ success: false, error: "没有提供SVG内容" });
  }

  const filePath = path.join(__dirname, "weather_forecast.svg");
  fs.writeFile(filePath, svg, (err) => {
    if (err) {
      console.error("保存SVG文件失败:", err);
      return res.json({ success: false, error: err.message });
    }
    res.json({ success: true });
  });
});

// 启动服务器
app.listen(PORT, () => {
  console.log(`服务器运行在 http://localhost:${PORT}`);
});
