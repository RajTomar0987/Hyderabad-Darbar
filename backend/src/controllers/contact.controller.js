const db = require('../data/db');

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * @desc   Submit contact / inquiry message
 * @route  POST /api/contact
 */
const submitContact = async (req, res) => {
  try {
    const { name, email, phone, subject, message } = req.body;

    const errors = [];
    if (!name || typeof name !== 'string' || !name.trim()) {
      errors.push('name is required');
    }
    if (!email || typeof email !== 'string' || !EMAIL_REGEX.test(email.trim())) {
      errors.push('a valid email address is required');
    }
    if (!phone || typeof phone !== 'string' || !phone.trim()) {
      errors.push('phone is required');
    }
    if (!subject || typeof subject !== 'string' || !subject.trim()) {
      errors.push('subject is required');
    }
    if (!message || typeof message !== 'string' || !message.trim()) {
      errors.push('message is required');
    }

    if (errors.length > 0) {
      return res.status(400).json({
        success: false,
        message: errors.join(', ')
      });
    }

    const newContact = await db.createContactMessage({
      name: name.trim(),
      email: email.trim().toLowerCase(),
      phone: phone.trim(),
      subject: subject.trim(),
      message: message.trim()
    });

    res.status(201).json({
      success: true,
      message: 'Message sent successfully. Our team will contact you soon.',
      data: newContact
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to process contact inquiry: ' + error.message
    });
  }
};

/**
 * @desc   Get all contact messages (admin viewing)
 * @route  GET /api/contact
 */
const getContacts = async (req, res) => {
  try {
    const messages = await db.getContactMessages();
    res.status(200).json({
      success: true,
      count: messages.length,
      data: messages
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve messages: ' + error.message
    });
  }
};

/**
 * @desc   Delete a contact message (admin)
 * @route  DELETE /api/contact/:id
 */
const deleteContact = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await db.deleteContactMessage(id);

    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: `Message '${id}' not found`
      });
    }

    res.status(200).json({
      success: true,
      message: 'Message deleted successfully',
      data: deleted
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to delete message: ' + error.message
    });
  }
};

module.exports = {
  submitContact,
  getContacts,
  deleteContact
};
