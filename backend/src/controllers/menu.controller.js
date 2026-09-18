const db = require('../data/db');
const { CATEGORIES } = require('../data/menu');

/**
 * @desc   Get all menu items or filter by category / grouped
 * @route  GET /api/menu
 */
const getMenu = (req, res) => {
  try {
    const { category, vegetarian } = req.query;
    const allItems = db.getMenuItems();
    
    let filteredItems = [...allItems];

    if (category && category.toLowerCase() !== 'all') {
      filteredItems = filteredItems.filter(
        (item) => item.category.toLowerCase() === category.toLowerCase()
      );
    }

    if (vegetarian !== undefined) {
      const isVeg = vegetarian === 'true';
      filteredItems = filteredItems.filter((item) => item.vegetarian === isVeg);
    }

    // Dynamic categories from items or standard categories
    const itemCategories = Array.from(new Set(allItems.map(i => i.category)));
    const categories = Array.from(new Set([...CATEGORIES, ...itemCategories]));

    // Group items by category
    const grouped = categories.reduce((acc, cat) => {
      acc[cat] = allItems.filter((item) => item.category === cat);
      return acc;
    }, {});

    res.status(200).json({
      success: true,
      categories,
      count: filteredItems.length,
      data: {
        items: filteredItems,
        grouped: grouped
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve menu items: ' + error.message
    });
  }
};

/**
 * @desc   Get single menu item by ID
 * @route  GET /api/menu/:id
 */
const getMenuItemById = (req, res) => {
  try {
    const { id } = req.params;
    const item = db.getMenuItemById(id);

    if (!item) {
      return res.status(404).json({
        success: false,
        message: `Menu item with ID '${id}' not found`
      });
    }

    res.status(200).json({
      success: true,
      data: item
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching menu item: ' + error.message
    });
  }
};

/**
 * @desc   Create new menu item (admin)
 * @route  POST /api/menu
 */
const createMenuItem = (req, res) => {
  try {
    const { name, category, price, description, badge, spicy, vegetarian, image } = req.body;

    if (!name || !price || isNaN(Number(price))) {
      return res.status(400).json({
        success: false,
        message: 'Item name and valid price are required'
      });
    }

    const newItem = db.createMenuItem({
      name,
      category: category || 'Mains',
      price: Number(price),
      description: description || '',
      badge: badge || '',
      spicy: Boolean(spicy),
      vegetarian: Boolean(vegetarian),
      image: image || '/images/biryani-chicken.jpg'
    });

    res.status(201).json({
      success: true,
      message: 'Menu item created successfully',
      data: newItem
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to create menu item: ' + error.message
    });
  }
};

/**
 * @desc   Update menu item (admin)
 * @route  PUT /api/menu/:id
 */
const updateMenuItem = (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const updated = db.updateMenuItem(id, updates);
    if (!updated) {
      return res.status(404).json({
        success: false,
        message: `Menu item '${id}' not found`
      });
    }

    res.status(200).json({
      success: true,
      message: 'Menu item updated successfully',
      data: updated
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to update menu item: ' + error.message
    });
  }
};

/**
 * @desc   Delete menu item (admin)
 * @route  DELETE /api/menu/:id
 */
const deleteMenuItem = (req, res) => {
  try {
    const { id } = req.params;
    const deleted = db.deleteMenuItem(id);

    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: `Menu item '${id}' not found`
      });
    }

    res.status(200).json({
      success: true,
      message: `Menu item '${deleted.name}' deleted successfully`,
      data: deleted
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to delete menu item: ' + error.message
    });
  }
};

module.exports = {
  getMenu,
  getMenuItemById,
  createMenuItem,
  updateMenuItem,
  deleteMenuItem
};
