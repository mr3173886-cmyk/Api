const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const app = express();

app.use(express.json());
app.use(cors());
app.use(express.static('public'));

const MONGO_URI = "mongodb+srv://kingls0x889_db_user:7pntvFFsOIaUJzXz@cluster0.kl6yaql.mongodb.net/MyApiDb?retryWrites=true&w=majority";

mongoose.connect(MONGO_URI)
    .then(() => console.log("🟢 Database Connected"))
    .catch(err => console.error("🔴 DB Error:", err));

const ApiSchema = new mongoose.Schema({ name: String, url: String });
const ApiModel = mongoose.model('Api', ApiSchema);

// API CRUD Routes
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

app.listen(3000, () => console.log("🚀 Server running on port 3000"));

