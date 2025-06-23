const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

mongoose.connect("mongodb://localhost:27017/rate-limiter");

const Rule = mongoose.model("Rule", {
  service: String,
  quota: Number,
  userTier: String,
  userAgent: String,
});

const app = express();
app.use(cors());
app.use(express.json());

// API to get rules
app.get("/rules", async (req, res) => {
  const { service, userAgent } = req.query;
  const rules = await Rule.find();
  res.json(rules);
});

// API to add rule
app.post("/rules", async (req, res) => {
  const rule = new Rule(req.body);
  await rule.save();
  res.json({ message: "Rule saved!" });
});
// DELETE a rule by ID
app.delete("/rules/:id", async (req, res) => {
  await Rule.findByIdAndDelete(req.params.id);
  res.json({ message: "Rule deleted" });
});

// PUT (update) a rule by ID
app.put("/rules/:id", async (req, res) => {
  await Rule.findByIdAndUpdate(req.params.id, req.body);
  res.json({ message: "Rule updated" });
});

// Mocked context API
app.get("/context", (req, res) => {
  const { userId, orgId, service } = req.query;
  res.json({
    userId,
    orgId,
    service,
    usage: 10, // mock usage
    userTier: "premium", // mock tier
  });
});

app.listen(4000, () => console.log("Admin backend running on port 4000"));
