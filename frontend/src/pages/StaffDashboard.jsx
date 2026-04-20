import { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import API from '../services/api';

const StaffDashboard = () => {
  const { logout } = useContext(AuthContext);
  const [inventory, setInventory] = useState([]);
  const [lowStock, setLowStock] = useState([]);
  const [pets, setPets] = useState([]); // Needed to select a pet for medical records
  const [loading, setLoading] = useState(true);

  // Form State for Medical Records
  const [recordForm, setRecordForm] = useState({
    petId: '', diagnosis: '', treatment: '', notes: ''
  });

  useEffect(() => {
    const fetchStaffData = async () => {
      try {
        const invRes = await API.get('/inventory');
        const petRes = await API.get('/pets'); // Staff can see all pets
        setInventory(invRes.data.items);
        setLowStock(invRes.data.lowStockWarnings);
        setPets(petRes.data);
      } catch (err) {
        console.error("Error loading staff data", err);
      } finally {
        setLoading(false);
      }
    };
    fetchStaffData();
  }, []);

  const handleAddRecord = async (e) => {
    e.preventDefault();
    try {
      await API.post('/records', recordForm);
      alert("Medical record saved successfully!");
      setRecordForm({ petId: '', diagnosis: '', treatment: '', notes: '' });
    } catch (err) {
      alert("Error saving record");
    }
  };

  if (loading) return <div className="p-10 text-center">Loading Clinic Data...</div>;

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-8">
      <div className="flex justify-between items-center bg-white p-6 rounded-lg shadow-sm">
        <h2 className="text-3xl font-extrabold text-gray-800">Clinic Staff Portal</h2>
        <button onClick={logout} className="bg-red-500 text-white px-6 py-2 rounded hover:bg-red-600 transition">Logout</button>
      </div>

      {/* Low Stock Alerts */}
      {lowStock.length > 0 && (
        <div className="bg-orange-100 border-l-4 border-orange-500 p-4 rounded animate-pulse">
          <h3 className="text-orange-800 font-bold flex items-center">
            ⚠️ LOW STOCK ALERT (Items below 10 units)
          </h3>
          <ul className="list-disc ml-5 mt-2 text-orange-700">
            {lowStock.map(item => (
              <li key={item._id}>{item.name} - Only {item.quantity} left!</li>
            ))}
          </ul>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Inventory Section */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-xl font-bold mb-4 text-gray-700 border-b pb-2">Inventory Management</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50">
                  <th className="p-3 border-b">Item Name</th>
                  <th className="p-3 border-b">Stock</th>
                  <th className="p-3 border-b">Price</th>
                </tr>
              </thead>
              <tbody>
                {inventory.map(item => (
                  <tr key={item._id} className="hover:bg-gray-50">
                    <td className="p-3 border-b font-medium">{item.name}</td>
                    <td className={`p-3 border-b font-bold ${item.quantity <= 10 ? 'text-red-500' : 'text-green-600'}`}>
                      {item.quantity}
                    </td>
                    <td className="p-3 border-b">${item.price}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Medical Records Form */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-xl font-bold mb-4 text-gray-700 border-b pb-2">Add Clinical Note</h3>
          <form onSubmit={handleAddRecord} className="space-y-4">
            <select 
              required
              className="w-full p-2 border rounded"
              value={recordForm.petId}
              onChange={(e) => setRecordForm({...recordForm, petId: e.target.value})}
            >
              <option value="">Select a Patient (Pet)</option>
              {pets.map(pet => (
                <option key={pet._id} value={pet._id}>{pet.name} ({pet.species})</option>
              ))}
            </select>
            <input 
              type="text" placeholder="Diagnosis" required className="w-full p-2 border rounded"
              value={recordForm.diagnosis} onChange={(e) => setRecordForm({...recordForm, diagnosis: e.target.value})}
            />
            <input 
              type="text" placeholder="Treatment Provided" required className="w-full p-2 border rounded"
              value={recordForm.treatment} onChange={(e) => setRecordForm({...recordForm, treatment: e.target.value})}
            />
            <textarea 
              placeholder="Additional Notes" className="w-full p-2 border rounded h-24"
              value={recordForm.notes} onChange={(e) => setRecordForm({...recordForm, notes: e.target.value})}
            />
            <button type="submit" className="w-full bg-primary text-white p-3 rounded font-bold hover:bg-blue-600 transition">
              Save Medical Record
            </button>
          </form>
        </div>

      </div>
    </div>
  );
};

export default StaffDashboard;