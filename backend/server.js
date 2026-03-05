const express = require("express");
const cors = require("cors");
const path = require("path");
require("./db");
const authRoutes = require("./routes/authRoutes");
const productRoutes = require("./routes/productRoutes");
const orderRoutes = require("./routes/orderRoutes");
const vendorRoutes = require("./routes/vendorRoutes");
const settingsRoutes = require("./routes/settingsRoutes");
const socialRoutes = require("./routes/socialRoutes");
const automationRoutes = require("./routes/automationRoutes");
const analyticsRoutes = require("./routes/analyticsRoutes");
const subscriptionRoutes = require("./routes/subscriptionRoutes");
const leadRoutes = require("./routes/leadRoutes");
const staffRoutes = require("./routes/staffRoutes");
const whatsappRoutes = require("./routes/whatsappRoutes");
const paymentRoutes = require("./routes/paymentRoutes");

const app = express();
const PORT = process.env.PORT || 4000;

const corsOrigin = process.env.CORS_ORIGIN
  ? process.env.CORS_ORIGIN.split(",").map((origin) => origin.trim())
  : true;

app.use(cors({ origin: corsOrigin }));
app.use(express.json());

app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", service: "chatcart-backend" });
});

app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api", vendorRoutes);
app.use("/api/settings", settingsRoutes);
app.use("/api/social", socialRoutes);
app.use("/api/automation", automationRoutes);
app.use("/api/analytics", analyticsRoutes);
app.use("/api/subscription", subscriptionRoutes);
app.use("/api/leads", leadRoutes);
app.use("/api/staff", staffRoutes);
app.use("/api/whatsapp", whatsappRoutes);
app.use("/api/payments", paymentRoutes);

const frontendPath = path.join(__dirname, "..", "frontend");
app.use(express.static(frontendPath));

app.get("/", (_req, res) => {
  res.sendFile(path.join(frontendPath, "index.html"));
});

app.get("/login", (_req, res) => {
  res.sendFile(path.join(frontendPath, "login.html"));
});

app.get("/signup", (_req, res) => {
  res.sendFile(path.join(frontendPath, "signup.html"));
});

app.listen(PORT, () => {
  console.log(`ChatCart backend running on http://localhost:${PORT}`);
});
