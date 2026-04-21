// Medicine tracking & low stock alerts
import { useState, useEffect } from 'react';
import API from '../services/api';

const Inventory = () => {
  const [items, setItems] = useState([]);
  const [newItem, setNewItem] = useState({ name: '', quantity: 0, price: 0 });

  useEffect(() => {
    fetchInventory();
  }, []);

  const fetchInventory = async () => {
    try {
      const res = await API.get('/inventory');
      // Handles both array and object-wrapped responses based on your controller
      setItems(res.data.items || res.data); 
    } catch (err) {
      console.error("Error fetching inventory", err);
    }
  };

  const handleAddItem = async (e) => {
    e.preventDefault();
    try {
      await API.post('/inventory', newItem);
      setNewItem({ name: '', quantity: 0, price: 0 });
      fetchInventory(); // Refresh the database view instantly
    } catch (err) {
      console.error("Failed to add item", err);
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6 mt-6">
      <h2 className="text-3xl font-extrabold text-gray-800 border-b pb-4 mb-6">Inventory Database</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        
        {/* POST New Item */}
        <div className="bg-white p-6 rounded-lg shadow border md:col-span-1 h-fit">
          <h3 className="font-bold text-xl mb-4 text-primary">Add Database Entry</h3>
          <form onSubmit={handleAddItem} className="space-y-4">
            <input type="text" placeholder="Item Name (e.g. Rabies Vaccine)" required className="w-full p-2 border rounded" value={newItem.name} onChange={e => setNewItem({...newItem, name: e.target.value})} />
            <input type="number" placeholder="Quantity" required className="w-full p-2 border rounded" value={newItem.quantity} onChange={e => setNewItem({...newItem, quantity: e.target.value})} />
            <input type="number" placeholder="Price ($)" required className="w-full p-2 border rounded" step="0.01" value={newItem.price} onChange={e => setNewItem({...newItem, price: e.target.value})} />
            <button type="submit" className="w-full bg-secondary hover:bg-green-600 text-white p-2 rounded transition font-bold">Write to Database</button>
          </form>
        </div>

        {/* GET Current Stock */}
        <div className="md:col-span-2 bg-white p-6 rounded-lg shadow border">
          <h3 className="font-bold text-xl mb-4 text-gray-800">Current Stock Levels</h3>
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-100 border-b">
                <th className="p-3">Item Name</th>
                <th className="p-3">Stock Level</th>
                <th className="p-3">Unit Price</th>
              </tr>
            </thead>
            <tbody>
              {items?.map(item => (
                <tr key={item._id} className="border-b hover:bg-gray-50">
                  <td className="p-3">{item.name}</td>
                  <td className={`p-3 font-bold ${item.quantity <= 5 ? 'text-red-500' : 'text-green-600'}`}>
                    {item.quantity} {item.quantity <= 5 && '(Low Stock!)'}
                  </td>
                  <td className="p-3 text-secondary">${item.price}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
      </div>
    </div>
  );
};

export default Inventory;