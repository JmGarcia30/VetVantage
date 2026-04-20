// What pet owners see
import { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import API from '../services/api';

const OwnerDashboard = () => {
  const { user, logout } = useContext(AuthContext);
  const [pets, setPets] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Form state for adding a new pet
  const [newPet, setNewPet] = useState({ name: '', species: '', breed: '', age: '', weight: '' });

  // Fetch the owner's pets when the dashboard loads
  useEffect(() => {
    const fetchPets = async () => {
      try {
        const response = await API.get('/pets');
        setPets(response.data);
      } catch (error) {
        console.error('Failed to fetch pets', error);
      } finally {
        setLoading(false);
      }
    };
    fetchPets();
  }, []);

  const handleAddPet = async (e) => {
    e.preventDefault();
    try {
      const response = await API.post('/pets', newPet);
      // Add the newly created pet to the UI without refreshing the page
      setPets([...pets, response.data]); 
      // Clear the form
      setNewPet({ name: '', species: '', breed: '', age: '', weight: '' });
    } catch (error) {
      console.error('Failed to add pet', error);
    }
  };

  if (loading) return <div className="p-8 text-center">Loading your pets...</div>;

  return (
    <div className="max-w-6xl p-8 mx-auto mt-6">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-3xl font-bold text-gray-800">Welcome, {user?.name}</h2>
        <button onClick={logout} className="px-4 py-2 text-white transition bg-red-500 rounded hover:bg-red-600">
          Logout
        </button>
      </div>

      <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
        {/* Left Column: Add Pet Form */}
        <div className="p-6 bg-white rounded shadow-md h-fit">
          <h3 className="mb-4 text-xl font-bold text-primary">Register a Pet</h3>
          <form onSubmit={handleAddPet} className="space-y-4">
            <input type="text" placeholder="Pet Name" required className="w-full p-2 border rounded" value={newPet.name} onChange={(e) => setNewPet({ ...newPet, name: e.target.value })} />
            <input type="text" placeholder="Species (e.g., Dog, Cat)" required className="w-full p-2 border rounded" value={newPet.species} onChange={(e) => setNewPet({ ...newPet, species: e.target.value })} />
            <input type="text" placeholder="Breed" className="w-full p-2 border rounded" value={newPet.breed} onChange={(e) => setNewPet({ ...newPet, breed: e.target.value })} />
            <div className="flex gap-4">
              <input type="number" placeholder="Age (Yrs)" className="w-full p-2 border rounded" value={newPet.age} onChange={(e) => setNewPet({ ...newPet, age: e.target.value })} />
              <input type="number" placeholder="Weight (Kg)" className="w-full p-2 border rounded" value={newPet.weight} onChange={(e) => setNewPet({ ...newPet, weight: e.target.value })} />
            </div>
            <button type="submit" className="w-full p-2 text-white rounded bg-secondary hover:bg-green-600">
              Add Pet
            </button>
          </form>
        </div>

        {/* Right Column: Display Pets */}
        <div className="md:col-span-2">
          <h3 className="mb-4 text-xl font-bold text-gray-800">Your Registered Pets</h3>
          {pets.length === 0 ? (
            <p className="text-gray-500">You haven't registered any pets yet.</p>
          ) : (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {pets.map((pet) => (
                <div key={pet._id} className="p-4 bg-white border-l-4 rounded shadow-sm border-primary">
                  <h4 className="text-lg font-bold text-gray-800">{pet.name}</h4>
                  <p className="text-sm text-gray-600">{pet.species} • {pet.breed || 'Unknown breed'}</p>
                  <p className="text-sm text-gray-600">Age: {pet.age ? `${pet.age} yrs` : 'N/A'} | Weight: {pet.weight ? `${pet.weight} kg` : 'N/A'}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default OwnerDashboard;