const express = require("express");
const cors = require("cors");
const fs = require("fs/promises");
const path = require("path");

const app = express();
const PORT = Number(process.env.PORT || 3000);

const DATA_DIR = path.join(__dirname, "..", "data");
const DATA_FILE = path.join(DATA_DIR, "bottles.json");

app.use(cors());
app.use(express.json({ limit: "2mb" }));
app.use(express.static(path.join(__dirname, "..")));

function cleanText(value, max = 500) {
  return String(value || "")
    .replace(/[<>]/g, "")
    .trim()
    .slice(0, max);
}

async function ensureDataFile() {
  await fs.mkdir(DATA_DIR, { recursive: true });

  try {
    await fs.access(DATA_FILE);
  } catch {
    const demo = [
      {
        id: "demo-001",
        source: "匿名漂流者",
        zodiac: "天蝎座",
        zodiacShort: "天蝎",
        zodiacSymbol: "♏",
        persona: "反内耗护盾 · 冷静锋利暗夜蝎王",
        summary: "这段情绪不是突然爆发，而是长时间被模糊要求和反复加码消耗之后，终于碰到了边界。你表面还冷静，心里其实已经不想再替别人吞下所有责任。",
        tags: ["#暗夜蝎王", "#冷静锋利", "#职场内耗", "#星座漂流瓶"],
        openCount: 0,
        maxOpen: 10,
        createdAt: Date.now() - 1000 * 60 * 18
      },
      {
        id: "demo-002",
        source: "匿名漂流者",
        zodiac: "摩羯座",
        zodiacShort: "摩羯",
        zodiacSymbol: "♑",
        persona: "低电量修复 · 守护边界雪原黑狼",
        summary: "你一直在努力把事情扛稳，但持续透支让你接近低电量。你不是不够强，而是太久没有允许自己停下来恢复。",
        tags: ["#雪原黑狼", "#守护边界", "#情绪过载", "#星座漂流瓶"],
        openCount: 0,
        maxOpen: 10,
        createdAt: Date.now() - 1000 * 60 * 46
      }
    ];

    await fs.writeFile(DATA_FILE, JSON.stringify(demo, null, 2), "utf8");
  }
}

async function readBottles() {
  await ensureDataFile();

  const raw = await fs.readFile(DATA_FILE, "utf8");

  try {
    const data = JSON.parse(raw);
    return Array.isArray(data) ? data : [];
  } catch {
    return [];
  }
}

async function writeBottles(bottles) {
  await ensureDataFile();

  // 简单文件写入。比赛演示够用；正式上线建议换数据库。
  await fs.writeFile(DATA_FILE, JSON.stringify(bottles, null, 2), "utf8");
}

app.get("/api/bottles", async (req, res) => {
  try {
    const bottles = await readBottles();

    bottles.sort((a, b) => Number(b.createdAt || 0) - Number(a.createdAt || 0));

    res.json({
      ok: true,
      data: bottles
    });
  } catch (err) {
    console.error("[GET /api/bottles]", err);
    res.status(500).json({
      ok: false,
      error: "读取海滩广场失败"
    });
  }
});

app.post("/api/bottles", async (req, res) => {
  try {
    const body = req.body || {};

    const summary = cleanText(body.summary, 600);
    const persona = cleanText(body.persona, 80);

    if (!summary || summary.length < 10) {
      return res.status(400).json({
        ok: false,
        error: "瓶子内容太短，不能封存"
      });
    }

    const bottle = {
      id: "bottle-" + Date.now() + "-" + Math.floor(Math.random() * 100000),
      source: cleanText(body.source, 30) || "匿名漂流者",
      zodiac: cleanText(body.zodiac, 20) || "未知星座",
      zodiacShort: cleanText(body.zodiacShort, 10) || "",
      zodiacSymbol: cleanText(body.zodiacSymbol, 6) || "✦",
      persona: persona || "匿名情绪瓶",
      summary,
      tags: Array.isArray(body.tags)
        ? body.tags.slice(0, 6).map((tag) => cleanText(tag, 24))
        : [],
      openCount: 0,
      maxOpen: 10,
      createdAt: Date.now()
    };

    const bottles = await readBottles();
    bottles.unshift(bottle);

    // 防止演示数据无限膨胀，保留最新 300 条。
    const trimmed = bottles.slice(0, 300);

    await writeBottles(trimmed);

    res.json({
      ok: true,
      data: bottle
    });
  } catch (err) {
    console.error("[POST /api/bottles]", err);
    res.status(500).json({
      ok: false,
      error: "封存瓶子失败"
    });
  }
});

app.post("/api/bottles/:id/open", async (req, res) => {
  try {
    const id = String(req.params.id || "");
    const bottles = await readBottles();
    const bottle = bottles.find((item) => item.id === id);

    if (!bottle) {
      return res.status(404).json({
        ok: false,
        error: "这只瓶子已经漂走了"
      });
    }

    const maxOpen = Number(bottle.maxOpen || 10);
    const openCount = Number(bottle.openCount || 0);

    if (openCount >= maxOpen) {
      return res.status(403).json({
        ok: false,
        error: "这只瓶子已经被 10 个人打开，现已封存"
      });
    }

    bottle.openCount = openCount + 1;
    bottle.lastOpenedAt = Date.now();

    await writeBottles(bottles);

    res.json({
      ok: true,
      data: bottle
    });
  } catch (err) {
    console.error("[POST /api/bottles/:id/open]", err);
    res.status(500).json({
      ok: false,
      error: "打开瓶子失败"
    });
  }
});

app.listen(PORT, "0.0.0.0", () => {
  console.log(`星座漂流瓶共享海滩广场已启动：http://localhost:${PORT}`);
  console.log("局域网访问时，请用本机 IP，例如：http://你的IP:3000");
});
