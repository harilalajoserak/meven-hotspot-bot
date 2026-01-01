import express from "express";

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 3000; // ⚠️ INDRAINDRAY MONJA

app.get("/", (req, res) => {
  res.send("MEVEN Hotspot API OK");
});

app.get("/api/router/pull", (req, res) => {
  const token = req.query.token;

  if (token !== "meven_store_2025_secure_token") {
    return res.status(401).send("unauthorized");
  }

  res.type("text/plain").send(`
/ip hotspot user add name=test1 password=123 profile=1h
`);
});

app.listen(PORT, () => {
  console.log("Server running on port " + PORT);
});
