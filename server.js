require('dotenv').config();
const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();

// Configuración middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Configuración del transporter de Nodemailer
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD
  }
});

// Ruta para enviar correos
app.post('/api/send-email', async (req, res) => {
  try {
    const { nombreCompleto, email, telefono, tipoSesion, fechaSesion, lugarSesion, mensaje, referencia } = req.body;

    // Configuración del correo
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: process.env.EMAIL_USER, // Enviar a la misma cuenta
      subject: `Nuevo mensaje de ${nombreCompleto} - Donaris Studio`,
      html: `
        <h2>Nuevo mensaje de contacto</h2>
        <p><strong>Nombre completo:</strong> ${nombreCompleto}</p>
        <p><strong>Correo electrónico:</strong> ${email}</p>
        <p><strong>Teléfono:</strong> ${telefono}</p>
        <p><strong>Tipo de sesión:</strong> ${tipoSesion}</p>
        <p><strong>Fecha preferida:</strong> ${fechaSesion}</p>
        <p><strong>Lugar de sesión:</strong> ${lugarSesion}</p>
        <p><strong>¿Cómo nos encontró?:</strong> ${referencia}</p>
        <p><strong>Mensaje:</strong><br>${mensaje.replace(/\n/g, '<br>')}</p>
        <hr>
        <p>Enviado desde el formulario de contacto de Donaris Studio</p>
      `
    };

    // Enviar el correo
    await transporter.sendMail(mailOptions);
    res.status(200).json({ success: true, message: 'Correo enviado con éxito' });
  } catch (error) {
    console.error('Error al enviar el correo:', error);
    res.status(500).json({ success: false, message: 'Error al enviar el correo' });
  }
});

// Iniciar el servidor
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});