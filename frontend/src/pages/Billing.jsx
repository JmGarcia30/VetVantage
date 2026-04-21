// Checkout and PDF download screen
import { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import API from '../services/api';

const Billing = () => {
  const { user } = useContext(AuthContext);
  const [pets, setPets] = useState([]);
  const [inventory, setInventory] = useState([]);
  const [loading, setLoading] = useState(true);

  // Cart and Form State
  const [selectedPet, setSelectedPet] = useState('');
  const [cart, setCart] = useState([]);
  const [serviceName, setServiceName] = useState('');
  const [servicePrice, setServicePrice] = useState('');

  useEffect(() => {
    const fetchBillingData = async () => {
      try {
        const petRes = await API.get('/pets');
        const invRes = await API.get('/inventory');
        setPets(petRes.data);
        setInventory(invRes.data.items);
      } catch (err) {
        console.error("Error loading billing data", err);
      } finally {
        setLoading(false);
      }
    };
    fetchBillingData();
  }, []);

  // Add an item from the inventory to the bill
  const handleAddItem = (item) => {
    if (item.quantity <= 0) {
      alert("This item is out of stock!");
      return;
    }
    setCart([...cart, { type: 'Item', itemId: item._id, name: item.name, price: item.price }]);
  };

  // Add a manual service (like a consultation or surgery) to the bill
  const handleAddService = (e) => {
    e.preventDefault();
    if (!serviceName || !servicePrice) return;
    setCart([...cart, { type: 'Service', name: serviceName, price: Number(servicePrice) }]);
    setServiceName('');
    setServicePrice('');
  };

  // Remove an item from the cart
  const removeFromCart = (index) => {
    const newCart = [...cart];
    newCart.splice(index, 1);
    setCart(newCart);
  };

  // Calculate the total cost dynamically
  const totalAmount = cart.reduce((sum, item) => sum + item.price, 0);

  const handleCheckout = async () => {
    if (!selectedPet) return alert("Please select a patient!");
    if (cart.length === 0) return alert("The cart is empty!");

    // 1. Separate the mixed cart into Services and Items for the backend
    const servicesRendered = cart
      .filter(i => i.type === 'Service')
      .map(s => ({ description: s.name, cost: s.price }));

    const itemsBilled = cart
      .filter(i => i.type === 'Item')
      .map(i => ({ item: i.itemId, quantity: 1, cost: i.price }));

    // 2. Extract the Owner ID from the selected pet object
    const petDetails = pets.find(p => p._id === selectedPet);
    const ownerId = petDetails?.owner?._id || petDetails?.owner;

    try {
      // 3. Send the correctly formatted payload
      await API.post('/billing', {
        ownerId,
        servicesRendered,
        itemsBilled,
        totalAmount
      });
      
      alert("Checkout complete! Invoice PDF generated.");
      setCart([]); // Clear cart
      setSelectedPet(''); // Reset patient
      
      // Refresh inventory to show deducted stock
      const invRes = await API.get('/inventory');
      setInventory(invRes.data.items);
      
    } catch (err) {
      console.error(err);
      // Give us a better error message if it fails again
      alert("Checkout failed: " + (err.response?.data?.message || err.message)); 
    }
  };

  if (loading) return <div className="p-8 text-center">Loading Terminal...</div>;

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-8 mt-6">
      <h2 className="text-3xl font-extrabold text-gray-800 border-b pb-4">Clinic Checkout System</h2>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Selection Panel */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Patient Selection */}
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
            <h3 className="text-xl font-bold mb-4 text-primary">1. Select Patient</h3>
            <select 
              className="w-full p-3 border rounded-lg bg-gray-50 focus:ring-primary focus:border-primary"
              value={selectedPet} onChange={(e) => setSelectedPet(e.target.value)}
            >
              <option value="">-- Search Patient Database --</option>
              {pets.map(pet => (
                <option key={pet._id} value={pet._id}>{pet.name} ({pet.species}) - Owner: {pet.owner?.name || 'Unknown'}</option>
              ))}
            </select>
          </div>

          {/* Add Services Form */}
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
            <h3 className="text-xl font-bold mb-4 text-primary">2. Add Services</h3>
            <form onSubmit={handleAddService} className="flex gap-4">
              <input 
                type="text" placeholder="Service Name (e.g. Checkup)" className="flex-grow p-2 border rounded"
                value={serviceName} onChange={(e) => setServiceName(e.target.value)}
              />
              <input 
                type="number" placeholder="Price ($)" className="w-32 p-2 border rounded"
                value={servicePrice} onChange={(e) => setServicePrice(e.target.value)}
              />
              <button type="submit" className="bg-gray-800 text-white px-4 py-2 rounded hover:bg-gray-700">Add</button>
            </form>
          </div>

          {/* Inventory Selection */}
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
            <h3 className="text-xl font-bold mb-4 text-primary">3. Add Inventory Items</h3>
            <div className="grid grid-cols-2 gap-4">
              {inventory.map(item => (
                <button 
                  key={item._id} 
                  onClick={() => handleAddItem(item)}
                  disabled={item.quantity <= 0}
                  className={`p-3 text-left border rounded transition ${item.quantity <= 0 ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'hover:border-primary hover:bg-blue-50'}`}
                >
                  <div className="font-bold">{item.name}</div>
                  <div className="text-sm flex justify-between mt-1">
                    <span>Stock: {item.quantity}</span>
                    <span className="text-secondary font-bold">${item.price}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: The Receipt */}
        <div className="bg-gray-800 text-white p-6 rounded-lg shadow-xl h-fit sticky top-6">
          <h3 className="text-2xl font-bold mb-6 border-b border-gray-600 pb-2">Current Bill</h3>
          
          <div className="space-y-4 min-h-[200px] mb-6">
            {cart.length === 0 ? (
              <p className="text-gray-400 italic">No items added yet.</p>
            ) : (
              cart.map((item, index) => (
                <div key={index} className="flex justify-between items-center group">
                  <div>
                    <span className="text-xs text-gray-400 uppercase tracking-wider block">{item.type}</span>
                    <span className="font-medium">{item.name}</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <span>${item.price.toFixed(2)}</span>
                    <button onClick={() => removeFromCart(index)} className="text-red-400 opacity-0 group-hover:opacity-100 transition">✕</button>
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="border-t border-gray-600 pt-4 mb-8 flex justify-between items-end">
            <span className="text-lg text-gray-300">Total Due:</span>
            <span className="text-4xl font-bold text-secondary">${totalAmount.toFixed(2)}</span>
          </div>

          <button 
            onClick={handleCheckout}
            className="w-full bg-secondary hover:bg-green-500 text-white font-bold py-4 rounded-lg text-lg transition shadow-lg"
          >
            Process Checkout
          </button>
        </div>

      </div>
    </div>
  );
};

export default Billing;