import express from "express";
import mongoose from "mongoose";
import bodyParser from "body-parser";
import cors from "cors";

const app = express();
const PORT = 5000;

app.use(bodyParser.json());
app.use(cors());

// ===== MongoDB Connection =====
mongoose.connect("mongodb://127.0.0.1:27017/portfolio", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log("✅ MongoDB Connected"))
.catch(err => console.error("❌ MongoDB Error:", err));

// ===== Project Schema =====
const projectSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  tech: [String],
  repo: String,
  demo: String,
});
const Project = mongoose.model("Project", projectSchema);

// ===== Contact Schema =====
const contactSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  message: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});
const Contact = mongoose.model("Contact", contactSchema);

// ===== Skill Schema =====
const skillSchema = new mongoose.Schema({
  name: { type: String, required: true },
  level: { type: Number, required: true }
});
const Skill = mongoose.model("Skill", skillSchema);

// ===== CRUD APIs =====

// PROJECTS
app.post("/api/projects", async (req, res) => {
  try { const project = new Project(req.body); await project.save(); res.json({ success: true, project }); }
  catch (err) { res.status(400).json({ success: false, msg: err.message }); }
});
app.get("/api/projects", async (req, res) => { try { const projects = await Project.find(); res.json(projects); } catch (err) { res.status(500).json({ success: false, msg: err.message }); } });
app.put("/api/projects/:id", async (req, res) => { try { const project = await Project.findByIdAndUpdate(req.params.id, req.body, { new: true }); res.json({ success: true, project }); } catch (err) { res.status(400).json({ success: false, msg: err.message }); } });
app.delete("/api/projects/:id", async (req, res) => { try { await Project.findByIdAndDelete(req.params.id); res.json({ success: true, msg: "Deleted" }); } catch (err) { res.status(400).json({ success: false, msg: err.message }); } });

// CONTACT
app.post("/api/contact", async (req, res) => { try { const contact = new Contact(req.body); await contact.save(); res.json({ success: true, msg: "Message saved successfully!" }); } catch (err) { res.status(400).json({ success: false, msg: err.message }); } });

// SKILLS
app.get("/api/skills", async (req, res) => { try { const skills = await Skill.find(); res.json(skills); } catch (err) { res.status(500).json({ success: false, msg: err.message }); } });
app.post("/api/skills", async (req, res) => { try { const skill = new Skill(req.body); await skill.save(); res.json({ success: true, skill }); } catch (err) { res.status(400).json({ success: false, msg: err.message }); } });
app.delete("/api/skills/:id", async (req, res) => { try { await Skill.findByIdAndDelete(req.params.id); res.json({ success: true, msg: "Skill deleted" }); } catch (err) { res.status(400).json({ success: false, msg: err.message }); } });

// ROOT
app.get("/", (req, res) => res.send("🚀 Portfolio API is running..."));

app.listen(PORT, () => console.log(`✅ Server running at http://localhost:${PORT}`));
