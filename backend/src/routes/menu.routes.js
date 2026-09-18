const express = require('express');
const router = express.Router();
const {
  getMenu,
  getMenuItemById,
  createMenuItem,
  updateMenuItem,
  deleteMenuItem
} = require('../controllers/menu.controller');
const { requireAdmin } = require('../middleware/auth');

router.get('/', getMenu);
router.get('/:id', getMenuItemById);
router.post('/', requireAdmin, createMenuItem);
router.put('/:id', requireAdmin, updateMenuItem);
router.delete('/:id', requireAdmin, deleteMenuItem);

module.exports = router;
