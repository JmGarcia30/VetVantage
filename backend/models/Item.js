// Inventory (medications, supplies)
import mongoose from 'mongoose';

const itemSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    category: {
      type: String, // e.g., 'Medicine', 'Supply', 'Food'
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
      default: 0,
    },
    lowStockThreshold: {
      type: Number,
      default: 10, // Triggers warning if quantity drops below this
    },
    expiryDate: {
      type: Date,
    },
    price: {
      type: Number,
      required: true,
    }
  },
  {
    timestamps: true,
  }
);

const Item = mongoose.model('Item', itemSchema);
export default Item;