import express from "express";

const app = express();
app.use(express.json());

// ===== CONFIG =====
const ROUTER_TOKEN = "meven_store_2025_secure_token";

// NOTE: test in-memory (raha production: DB)
const requests = new Map();

function genUsername(mac){
  const clean = mac.replace(/:/g,"").slice(-6).toUpperCase();
  return `MEV-${clean}`;
}
function genPassword(){
  return String(Math.floor(1000 + Math.random()*9000));
}

// 1) Client -> demande
app.post("/api/request-access", (req,res)=>{
  const {hours, mac, ip, identity, userAgent} = req.body || {};
  if(!mac || !hours) return res.status(400).json({message:"Missing mac/hours"});

  const h = Number(hours);
  if(![1,3].includes(h)) return res.status(400).json({message:"Invalid hours"});

  const existing = requests.get(mac);
  if(existing && existing.status === "PENDING"){
    existing.hours = h;
    return res.json({ok:true, status:"PENDING"});
  }

  requests.set(mac,{
    hours: h, mac, ip, identity, userAgent,
    status: "PENDING",
    username: null,
    password: null,
    createdAt: Date.now(),
    doneRsc: false
  });

  res.json({ok:true, status:"PENDING"});
});

// 2) Client -> status
app.get("/api/status",(req,res)=>{
  const mac = req.query.mac;
  const r = requests.get(mac);
  if(!r) return res.json({status:"NONE"});
  if(r.status !== "APPROVED") return res.json({status:r.status});
  return res.json({status:"APPROVED", username:r.username, password:r.password});
});

// 3) Admin -> pending list
app.get("/api/admin/pending",(req,res)=>{
  const out = [];
  for(const r of requests.values()){
    if(r.status === "PENDING") out.push(r);
  }
  res.json(out);
});

// 4) Admin -> approve
app.post("/api/admin/approve",(req,res)=>{
  const {mac} = req.body || {};
  const r = requests.get(mac);
  if(!r) return res.status(404).json({message:"Not found"});
  if(r.status !== "PENDING") return res.json({ok:true, status:r.status});

  r.username = genUsername(mac);
  r.password = genPassword();
  r.status = "APPROVED";
  r.doneRsc = false;

  res.json({ok:true, status:"APPROVED", username:r.username, password:r.password});
});

// 5) Admin -> refuse
app.post("/api/admin/refuse",(req,res)=>{
  const {mac} = req.body || {};
  const r = requests.get(mac);
  if(!r) return res.status(404).json({message:"Not found"});
  r.status = "REFUSED";
  res.json({ok:true});
});

// 6) Router -> pull rsc
app.get("/api/router/pull",(req,res)=>{
  const token = req.query.token;
  if(token !== ROUTER_TOKEN){
    return res.status(403).send("FORBIDDEN");
  }

  let rsc = "";
  for(const r of requests.values()){
    if(r.status === "APPROVED" && !r.doneRsc){
      const profile = r.hours === 1 ? "1h" : "3h";

      rsc += `/ip hotspot user add name="${r.username}" password="${r.password}" profile="${profile}" comment="MAC=${r.mac} IP=${r.ip || ""}"\n`;

      r.doneRsc = true;
    }
  }

  res.setHeader("Content-Type","text/plain; charset=utf-8");
  res.send(rsc);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, ()=>console.log("API running on", PORT));
