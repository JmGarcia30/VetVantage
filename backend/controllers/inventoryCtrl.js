// Stock deducts, low stock warnings
// Add a new item to the inventory
import Item from '../models/Item.js';

export const getInventory = async (req, res) => {
  try {
    const items = await Item.find();
    // Dynamically filter items that hit the low stock threshold
    const lowStockWarnings = items.filter(item => item.quantity <= item.lowStockThreshold);
    
    res.json({ items, lowStockWarnings });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching inventory', error: error.message });
  }
};

export const deductStock = async (req, res) => {
  try {
    const { itemId, amountUsed } = req.body;
    const item = await Item.findById(itemId);

    if (!item) return res.status(404).json({ message: 'Item not found' });
    if (item.quantity < amountUsed) return res.status(400).json({ message: 'Not enough stock!' });

    item.quantity -= amountUsed;
    await item.save();

    res.json(item);
  } catch (error) {
    res.status(500).json({ message: 'Error updating stock', error: error.message });
  }
};

export const addItem = async (req, res) => {
  try {
    const { name, quantity, price } = req.body;
    
    const newItem = await Item.create({
      name,
      quantity,
      price,
      category: 'Supply', // Added this to satisfy the database!
      lowStockThreshold: 5 
    });

    res.status(201).json(newItem);
  } catch (error) {
    console.error("Database Save Error:", error.message); 
    res.status(500).json({ message: 'Failed to add item', error: error.message });
  }
};