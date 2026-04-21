// Clinical notes view
import { useState, useEffect } from 'react';
import API from '../services/api';

const MedicalRecords = () => {
  const [pets, setPets] = useState([]);
  const [selectedPet, setSelectedPet] = useState('');
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);

  // Load all pets when the page opens
  useEffect(() => {
    const fetchPets = async () => {
      try {
        const response = await API.get('/pets');
        setPets(response.data);
      } catch (error) {
        console.error('Error fetching patients:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchPets();
  }, []);

  // When a specific pet is selected, fetch their medical history
  useEffect(() => {
    const fetchHistory = async () => {
      if (!selectedPet) {
        setRecords([]);
        return;
      }
      try {
        const response = await API.get(`/records`);
        // Filter the records down to just the selected pet
        const petHistory = response.data.filter(record => record.pet._id === selectedPet || record.pet === selectedPet);
        setRecords(petHistory);
      } catch (error) {
        console.error('Error fetching records:', error);
      }
    };
    fetchHistory();
  }, [selectedPet]);

  if (loading) return <div className="p-8 text-center text-gray-600">Accessing Database...</div>;

  return (
    <div className="max-w-6xl mx-auto p-6 mt-6">
      <h2 className="text-3xl font-extrabold text-gray-800 mb-6 border-b pb-4">Medical Records Database</h2>

      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 mb-8">
        <label className="block text-sm font-bold text-gray-700 mb-2">Search Patient Database</label>
        <select 
          className="w-full md:w-1/2 p-3 border rounded-lg bg-gray-50 focus:ring-primary focus:border-primary"
          value={selectedPet} 
          onChange={(e) => setSelectedPet(e.target.value)}
        >
          <option value="">-- Select a Patient --</option>
          {pets.map(pet => (
            <option key={pet._id} value={pet._id}>
              {pet.name} ({pet.species}) - Owner: {pet.owner?.name || 'Unknown'}
            </option>
          ))}
        </select>
      </div>

      {selectedPet && (
        <div className="space-y-4">
          <h3 className="text-xl font-bold text-gray-800">Clinical History</h3>
          
          {records.length === 0 ? (
            <div className="p-6 bg-gray-50 rounded text-gray-500 italic">No medical records found for this patient.</div>
          ) : (
            records.map((record) => (
              <div key={record._id} className="p-5 bg-white border-l-4 border-primary rounded shadow-sm">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h4 className="font-bold text-lg text-gray-800">Diagnosis: {record.diagnosis}</h4>
                    <p className="text-sm text-gray-500">Date: {new Date(record.createdAt).toLocaleDateString()}</p>
                  </div>
                </div>
                <div className="mb-2">
                  <span className="font-semibold text-gray-700">Treatment Provided: </span>
                  <span className="text-gray-600">{record.treatment}</span>
                </div>
                {record.notes && (
                  <div className="mt-3 p-3 bg-gray-50 rounded text-sm text-gray-600">
                    <span className="font-semibold block mb-1">Additional Notes:</span>
                    {record.notes}
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default MedicalRecords;