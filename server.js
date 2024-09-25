require('dotenv').config();
const express = require('express');
const cors = require('cors');
const authenticateToken = require('./src/middlewares/authenticateToken');
const emailRoutes = require('./src/routes/emailRoutes');// Asegúrate que la ruta es correcta
const authRoutes = require('./src/routes/authRoutesadmin'); 
const app = express();

app.use(cors());
app.use(express.json());
app.use('/api',  emailRoutes); // Aplicar authenticateToken a todas las rutas en '/api'
app.use('/auth', authRoutes); // Prefijo '/api' para las rutas relacionadas con los correos

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
