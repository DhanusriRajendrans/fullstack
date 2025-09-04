import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './index.css'; 
import profile from './images/profile.jpg'; 

// Default projects now editable
const defaultProjects = [
  { 
    id: 1, 
    title: "Template", 
    description: "Designed and developed 2-3 responsive website templates using HTML5 and CSS3.", 
    tech: ["HTML", "CSS", "Postgres"], 
    demo: "#", 
    repo: "https://github.com/DhanusriRajendrans/projects"
  },
  { 
    id: 2, 
    title: "Expense Tracker", 
    description: "Built a console-based expense management system with features like Add, Update, Delete, Monthly Summary, Budget Tracking, and Export to CSV", 
    tech: ["Java"], 
    demo: "#", 
    repo: "https://github.com/DhanusriRajendrans/expense_tracker"
  },
];

const defaultSkills = [
  { name: "React", level: 90 },
  { name: "JavaScript", level: 92 },
  { name: "TypeScript", level: 78 },
  { name: "Node.js", level: 80 },
  { name: "CSS / Bootstrap", level: 88 },
  { name: "Java", level: 70 }
];

export default function App() {
  const [activeSection, setActiveSection] = useState('home');
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [sending, setSending] = useState(false);

  // ===== Projects =====
  const [projects, setProjects] = useState(defaultProjects);
  const [dbProjects, setDbProjects] = useState([]);
  const [newProject, setNewProject] = useState({ title: "", description: "", tech: "", repo: "" });
  const [editingId, setEditingId] = useState(null);

  // ===== Skills =====
  const [skills, setSkills] = useState(defaultSkills);
  const [dbSkills, setDbSkills] = useState([]);
  const [newSkill, setNewSkill] = useState({ name: "", level: "" });

  // ==== Fetch Projects & Skills ====
  useEffect(() => {
    fetch("http://localhost:5000/api/projects")
      .then(res => res.json())
      .then(data => setDbProjects(data))
      .catch(err => console.error("Fetch projects error:", err));

    fetch("http://localhost:5000/api/skills")
      .then(res => res.json())
      .then(data => setDbSkills(data))
      .catch(err => console.error("Fetch skills error:", err));
  }, []);

  // ===== Project Handlers =====
  const handleAddProject = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        const res = await fetch(`http://localhost:5000/api/projects/${editingId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            ...newProject,
            tech: newProject.tech.split(",").map(t => t.trim()),
          }),
        });
        const data = await res.json();
        if (data.success) {
          setDbProjects(dbProjects.map(p => p._id === editingId ? data.project : p));
          setEditingId(null);
        }
      } else {
        const res = await fetch("http://localhost:5000/api/projects", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            ...newProject,
            tech: newProject.tech.split(",").map(t => t.trim()),
          }),
        });
        const data = await res.json();
        if (data.success) {
          setDbProjects([...dbProjects, data.project]);
        }
      }
      setNewProject({ title: "", description: "", tech: "", repo: "" });
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteProject = async (id, isDefault = false) => {
    if (isDefault) {
      setProjects(projects.filter(p => p.id !== id));
    } else {
      await fetch(`http://localhost:5000/api/projects/${id}`, { method: "DELETE" });
      setDbProjects(dbProjects.filter(p => p._id !== id));
    }
  };

  const handleEditProject = (project, isDefault = false) => {
    setNewProject({
      title: project.title,
      description: project.description,
      tech: project.tech.join(", "),
      repo: project.repo,
    });
    setEditingId(isDefault ? project.id : project._id);
  };

  // ===== Skill Handlers =====
  const handleAddSkill = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("http://localhost:5000/api/skills", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newSkill.name, level: Number(newSkill.level) }),
      });
      const data = await res.json();
      if (data.success) {
        setDbSkills([...dbSkills, data.skill]);
        setNewSkill({ name: "", level: "" });
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteSkill = async (id) => {
    await fetch(`http://localhost:5000/api/skills/${id}`, { method: "DELETE" });
    setDbSkills(dbSkills.filter(s => s._id !== id));
  };

  // ===== Contact Handlers =====
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };
  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setSending(true);
    try {
      const res = await fetch("http://localhost:5000/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      alert(data.msg || "Message sent.");
      setFormData({ name: '', email: '', message: '' });
    } catch (err) {
      console.error(err);
      alert("Failed to send. Please try again.");
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="bg-dark text-light min-vh-100">
      {/* Navbar */}
      <header className="container py-4 d-flex justify-content-between align-items-center border-bottom border-secondary">
        <h3 className="fw-bold">💻 My Portfolio</h3>
        <nav className="d-flex gap-4">
          {['home','projects','skills','contact'].map(section => (
            <button 
              key={section}
              className={`btn btn-link ${activeSection === section ? 'text-primary fw-bold' : 'text-light'}`} 
              onClick={() => setActiveSection(section)}
            >
              {section.charAt(0).toUpperCase() + section.slice(1)}
            </button>
          ))}
        </nav>
      </header>

      {/* Content */}
      <main className="container py-5">
        {/* ===== Home ===== */}
        {activeSection === 'home' && (
          <section className="text-center">
            <div className="hero shadow rounded p-5 bg-blue">
              <img 
                src={profile}
                alt="profile" 
                className="rounded-circle shadow mb-3"
                style={{width: '140px', height: '140px', objectFit: 'cover', objectPosition: 'top center'}} 
              />
              <h2 className="fw-bold mb-2">Hi 👋, I'm Dhanusri</h2>
              <p className="lead text-light">
                A passionate <span className="text-primary fw-bold">Frontend Engineer</span> 
                who loves building modern, responsive, and user-friendly web apps with React ⚛️
              </p>
              <div className="mt-4 d-flex gap-3 justify-content-center">
                <button className="btn btn-primary px-4" onClick={() => setActiveSection('projects')}>🚀 View Projects</button>
                <button className="btn btn-outline-light px-4" onClick={() => setActiveSection('contact')}>📬 Contact Me</button>
              </div>
            </div>
          </section>
        )}

        {/* ===== Projects ===== */}
        {activeSection === 'projects' && (
          <section>
            <h2 className="mb-4">🚀 Projects</h2>
            <div className="row g-4">
              {[...projects, ...dbProjects].map((p) => (
                <div key={p.id || p._id} className="col-md-4">
                  <div className="card bg-dark text-light h-100 shadow-lg border-0">
                    <div className="card-body">
                      <h5 className="card-title fw-bold">{p.title}</h5>
                      <p className="card-text">{p.description}</p>
                      <div className="mb-2">
                        {p.tech?.map(t => <span key={t} className="badge bg-dark me-1">{t}</span>)}
                      </div>
                      {p.repo && <a href={p.repo} className="btn btn-sm btn-primary me-2" target="_blank" rel="noopener noreferrer">GitHub</a>}
                      <button className="btn btn-sm btn-warning me-2" onClick={() => handleEditProject(p, !!p.id)}>Edit</button>
                      <button className="btn btn-sm btn-danger" onClick={() => handleDeleteProject(p.id || p._id, !!p.id)}>Delete</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <hr className="my-4" />
            <h3 className="mb-3">📂 Add Projects </h3>
            <form className="bg-secondary p-3 rounded mb-4" onSubmit={handleAddProject}>
              <input className="form-control mb-2" placeholder="Title"
                value={newProject.title} onChange={e => setNewProject({...newProject, title: e.target.value})} required />
              <textarea className="form-control mb-2" placeholder="Description"
                value={newProject.description} onChange={e => setNewProject({...newProject, description: e.target.value})} required />
              <input className="form-control mb-2" placeholder="Tech (comma separated)"
                value={newProject.tech} onChange={e => setNewProject({...newProject, tech: e.target.value})} />
              <input className="form-control mb-2" placeholder="GitHub Repo URL"
                value={newProject.repo} onChange={e => setNewProject({...newProject, repo: e.target.value})} />
              <button className="btn btn-primary">{editingId ? "Update Project" : "Add Project"}</button>
              {editingId && (
                <button type="button" className="btn btn-warning ms-2" onClick={() => {
                  setEditingId(null);
                  setNewProject({ title: "", description: "", tech: "", repo: "" });
                }}>
                  Cancel
                </button>
              )}
            </form>
          </section>
        )}

        {/* ===== Skills ===== */}
        {activeSection === 'skills' && (
          <section>
            <h2 className="mb-4">⚡ Skills</h2>

            {/* Add Skill Form */}
            <form className="mb-3 d-flex gap-2" onSubmit={handleAddSkill}>
              <input className="form-control" placeholder="Skill Name" value={newSkill.name} onChange={e => setNewSkill({...newSkill, name: e.target.value})} required />
              <input className="form-control" type="number" placeholder="Level %" value={newSkill.level} onChange={e => setNewSkill({...newSkill, level: e.target.value})} required />
              <button className="btn btn-primary">Add</button>
            </form>

            {[...skills, ...dbSkills].map(s => (
              <div key={s._id || s.name} className="mb-3 d-flex align-items-center justify-content-between">
                <div style={{flex: 1}}>
                  <div className="d-flex justify-content-between">
                    <span>{s.name}</span>
                    <small>{s.level}%</small>
                  </div>
                  <div className="progress" style={{height: '10px'}}>
                    <div className="progress-bar bg-primary" style={{width: `${s.level}%`}}></div>
                  </div>
                </div>
                {s._id && <button className="btn btn-sm btn-danger ms-2" onClick={() => handleDeleteSkill(s._id)}>Delete</button>}
              </div>
            ))}
          </section>
        )}

        {/* ===== Contact ===== */}
        {activeSection === 'contact' && (
          <section>
            <h2 className="mb-4">📬 Contact Me</h2>
            <form className="bg-secondary p-4 rounded shadow" onSubmit={handleFormSubmit}>
              <div className="mb-3">
                <label className="form-label">Name</label>
                <input className="form-control" name="name" value={formData.name} onChange={handleInputChange} required />
              </div>
              <div className="mb-3">
                <label className="form-label">Email</label>
                <input type="email" className="form-control" name="email" value={formData.email} onChange={handleInputChange} required />
              </div>
              <div className="mb-3">
                <label className="form-label">Message</label>
                <textarea className="form-control" name="message" rows={4} value={formData.message} onChange={handleInputChange} required></textarea>
              </div>
              <button className="btn btn-primary" disabled={sending}>
                {sending ? "Sending..." : "Send"}
              </button>
            </form>
          </section>
        )}
      </main>
    </div>
  );
}
