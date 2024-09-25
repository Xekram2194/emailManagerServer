// /routes/authRoutes.js
const express = require('express');
const jwt = require('jsonwebtoken');
const router = express.Router();

const users = {
  admin: { password: "adminpass", role: "admin" },
  user1: { password: "user1pass", role: "worker" },
  user2: { password: "user2pass", role: "worker" }
};

router.post('/login', (req, res) => {
    console.log(req.body); // Imprime los datos recibidos para asegurarte de que son correctos
    const { username, password } = req.body;
    const user = users[username];
   
    if (!user || user.password !== password) {
        console.log('Authentication failed');
        return res.status(401).send("Credentials are incorrect");
    }
   
    const token = jwt.sign({ username: username, role: user.role }, 'your-secure-key', { expiresIn: '1h' });
    console.log('Login successful');
    res.json({ token, role: user.role });
});


module.exports = router;
