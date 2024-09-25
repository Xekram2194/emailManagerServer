const gmailService = require('../services/gmailService');

// Almacenar asignaciones en memoria (puedes reemplazar con una base de datos)
let emailAssignments = {};

// Obtener todos los correos
const getAllEmails = async (req, res) => {
  try {
    const emails = await gmailService.getEmails();

    const emailData = await Promise.all(
      emails.map(async (message) => {
        const fullMessage = await gmailService.getEmailDetails(message.id);
        const isRead = !fullMessage.data.labelIds.includes('UNREAD');
        const attachments = fullMessage.data.payload.parts
          ? fullMessage.data.payload.parts.filter(part => part.filename && part.body.attachmentId)
          : [];

        return {
          id: fullMessage.data.id,
          from: fullMessage.data.payload.headers.find(header => header.name === 'From').value,
          subject: fullMessage.data.payload.headers.find(header => header.name === 'Subject').value,
          date: fullMessage.data.payload.headers.find(header => header.name === 'Date').value,
          isRead,
          status: emailAssignments[message.id]?.status || 'Pendiente',
          assignedTo: emailAssignments[message.id]?.worker || null,
          attachments: attachments.map(att => ({
            filename: att.filename,
            mimeType: att.mimeType,
            attachmentId: att.body.attachmentId,
          })),
        };
      })
    );

    res.status(200).json(emailData);
  } catch (error) {
    console.error('Error fetching emails:', error);
    res.status(500).send(error);
  }
};

// Descargar un adjunto
const downloadAttachment = async (req, res) => {
  const { emailId, attachmentId } = req.params;
  try {
    const message = await gmailService.getEmailDetails(emailId);
    const attachmentPart = message.data.payload.parts.find(part => part.body.attachmentId === attachmentId);

    if (!attachmentPart) {
      return res.status(404).send('Attachment not found');
    }

    const attachment = await gmailService.getAttachment(emailId, attachmentId);
    const attachmentData = Buffer.from(attachment.data.data, 'base64');
    const filename = attachmentPart.filename || `attachment-${attachmentId}`;

    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    res.setHeader('Content-Type', 'application/octet-stream');
    res.send(attachmentData);
  } catch (error) {
    console.error('Error downloading attachment:', error);
    res.status(500).send('Error downloading attachment');
  }
};

// Asignar un correo a un trabajador
const assignEmail = (req, res) => {
  const { emailId, workerName } = req.body;

  if (!emailId || !workerName) {
    return res.status(400).json({ message: 'Faltan campos obligatorios: emailId o workerName' });
  }

  emailAssignments[emailId] = { status: 'Asignado', worker: workerName };
  res.status(200).json({ message: `Correo asignado a ${workerName}` });
};

const getWorkerEmails = async (req, res) => {
  const { username } = req.user;  // Suponiendo que el username es el identificador del trabajador
  const workerEmails = Object.entries(emailAssignments)
    .filter(([emailId, assignment]) => assignment.worker === username)  // Filtra los correos asignados al trabajador
    .map(([emailId]) => updatedEmails.find(email => email.id === emailId)); // Obtiene los detalles de los correos

  res.status(200).json(workerEmails);
};

module.exports = { getAllEmails, downloadAttachment, assignEmail, getWorkerEmails };
