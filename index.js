import express from "express";

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 3000;

// test route
app.get("/", (req, res) => {
  res.send("MEVEN Hotspot API OK");
});

// route ampiasain'i MikroTik
app.get("/api/router/pull", (req, res) => {
  const token = req.query.token;

  if (token !== "meven_store_2025_secure_token") {
    return res.status(401).send("unauthorized");
  }

  // tsy misy telegram, simple
  res.type("text/plain").send(`
/ip hotspot user add name=test1 password=123 profile=1h
`);
});

app.listen(PORT, () => {
  console.log("Server running on port " + PORT);
});
const PORT = process.env.PORT || 3000;
app.listen(PORT, ()=>console.log("API running on", PORT));
