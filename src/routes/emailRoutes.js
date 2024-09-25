const express = require('express');
const router = express.Router();
const emailController = require('../controllers/emailController');

// Ruta para obtener todos los correos
router.get('/emails', emailController.getAllEmails);
// routes/emailRoutes.js

router.get('/worker', emailController.getWorkerEmails);


// Ruta para descargar un adjunto
router.get('/download/:emailId/:attachmentId', emailController.downloadAttachment);

// Ruta para asignar un correo a un trabajador
router.post('/assign', emailController.assignEmail);

module.exports = router;
