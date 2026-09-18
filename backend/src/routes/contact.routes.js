const express = require('express');
const router = express.Router();
const { submitContact, getContacts, deleteContact } = require('../controllers/contact.controller');
const { requireAdmin } = require('../middleware/auth');

router.post('/', submitContact);
router.get('/', requireAdmin, getContacts);
router.delete('/:id', requireAdmin, deleteContact);

module.exports = router;
