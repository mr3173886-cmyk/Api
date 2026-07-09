const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const app = express();

app.use(express.json());
app.use(cors());
app.use(express.static('public'));

const MONGO_URI = "mongodb+srv://kingls0x889_db_user:7pntvFFsOIaUJzXz@cluster0.kl6yaql.mongodb.net/MyApiDb?retryWrites=true&w=majority";

mongoose.connect(MONGO_URI)
    .then(() => console.log("🟢 Database Connected"))
    .catch(err => console.error("🔴 DB Error:", err));

// MongoDB Schemas
const ApiSchema = new mongoose.Schema({ name: String, url: String });
const ApiModel = mongoose.model('Api', ApiSchema);

const UserSchema = new mongoose.Schema({ username: String, password: String });
const UserModel = mongoose.model('User', UserSchema);

// First-time Admin account push function
async function seedAdmin() {
    const adminExists = await UserModel.findOne({ username: 'admin' });
    if (!adminExists) {
        await new UserModel({ username: 'admin', password: 'password123' }).save();
        console.log("👥 Default Admin: admin, Pass: password123");
    }
}
seedAdmin();

// --- FRONTEND ROUTING ENDPOINTS ---
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'login.html'));
});

app.get('/dashboard', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'dashboard.html'));
});

// --- API VALIDATION & ENGINE ---
app.post('/api/auth/login', async (req, res) => {
    const { username, password } = req.body;
    const user = await UserModel.findOne({ username, password });
    if (user) {
        res.json({ success: true, message: "Logged in successfully" });
    } else {
        res.status(401).json({ success: false, message: "Invalid credentials" });
    }
});

// Screenshots er moto dynamic link redirect interface
app.get('/api/duck', async (req, res) => {
    try {
        const items = await ApiModel.find({ name: { $regex: /duck/i } });
        if (items.length > 0) {
            const randomDuck = items[Math.floor(Math.random() * items.length)];
            return res.redirect(randomDuck.url); // Direct redirect to image asset link
        }
        res.redirect('https://images.unsplash.com/photo-1555854897-43c274249a58?q=80&w=640');
    } catch (err) {
        res.status(500).json({ error: "Internal Server Error" });
    }
});

// core CRUD functions
app.get('/api/all', async (req, res) => res.json(await ApiModel.find()));

app.post('/api/save', async (req, res) => {
    const { id, name, url } = req.body;
    if (id) {
        await ApiModel.findByIdAndUpdate(id, { name, url });
        res.json({ success: true, message: "Updated!" });
    } else {
        await new ApiModel({ name, url }).save();
        res.json({ success: true, message: "Saved!" });
    }
});

app.delete('/api/delete/:id', async (req, res) => {
    await ApiModel.findByIdAndDelete(req.params.id);
    res.json({ success: true });
});

// Custom 404 handler block jeta screenshot er matching design target kore
app.use((req, res) => {
    res.status(404).sendFile(path.join(__dirname, 'public', '404.html'));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));

