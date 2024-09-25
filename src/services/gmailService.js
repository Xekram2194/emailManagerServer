const { google } = require('googleapis');
const oAuth2Client = require('../config/googleAuth');

const gmail = google.gmail({ version: 'v1', auth: oAuth2Client });

// Obtener correos de la bandeja de entrada
const getEmails = async () => {
  const response = await gmail.users.messages.list({
    userId: 'me',
    q: 'label:inbox',
  });

  return response.data.messages;
};

// Obtener los detalles completos de un correo
const getEmailDetails = async (emailId) => {
  const message = await gmail.users.messages.get({
    userId: 'me',
    id: emailId,
  });
  return message;
};

// Obtener un adjunto de un correo
const getAttachment = async (emailId, attachmentId) => {
  const attachment = await gmail.users.messages.attachments.get({
    userId: 'me',
    messageId: emailId,
    id: attachmentId,
  });
  return attachment;
};

module.exports = { getEmails, getEmailDetails, getAttachment };
