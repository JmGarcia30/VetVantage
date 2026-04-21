// Booking interface
import { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import API from '../services/api';

const Calendar = () => {
  const { user } = useContext(AuthContext);
  const [appointments, setAppointments] = useState([]);
  const [pets, setPets] = useState([]); // To populate the dropdown for owners
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Booking Form State
  const [formData, setFormData] = useState({
    petId: '',
    date: '',
    timeSlot: '09:00 AM',
    reason: ''
  });

  // Available time slots for the clinic
  const timeSlots = [
    '09:00 AM', '09:30 AM', '10:00 AM', '10:30 AM', 
    '11:00 AM', '11:30 AM', '01:00 PM', '01:30 PM', 
    '02:00 PM', '02:30 PM', '03:00 PM', '03:30 PM'
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const apptRes = await API.get('/appointments');
        setAppointments(apptRes.data);

        // If the user is an owner, fetch their pets so they can book an appointment
        if (user.role === 'owner') {
          const petRes = await API.get('/pets');
          setPets(petRes.data);
        }
      } catch (err) {
        console.error('Error fetching data', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [user.role]);

  const handleBookAppointment = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const response = await API.post('/appointments', formData);
      
      // Update the UI with the new appointment immediately
      // We do a quick mock populate here so it shows up nicely before a page refresh
      const newAppt = {
        ...response.data,
        pet: pets.find(p => p._id === formData.petId)
      };
      
      setAppointments([...appointments, newAppt].sort((a, b) => new Date(a.date) - new Date(b.date)));
      
      // Reset form
      setFormData({ petId: '', date: '', timeSlot: '09:00 AM', reason: '' });
      alert('Appointment booked successfully!');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to book appointment');
    }
  };

  if (loading) return <div className="p-8 text-center">Loading Schedule...</div>;

  return (
    <div className="max-w-6xl p-8 mx-auto mt-6">
      <h2 className="mb-8 text-3xl font-bold text-gray-800">
        {user.role === 'owner' ? 'Book an Appointment' : 'Clinic Schedule'}
      </h2>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        
        {/* Booking Form (ONLY VISIBLE TO OWNERS) */}
        {user.role === 'owner' && (
          <div className="p-6 bg-white rounded shadow-md h-fit lg:col-span-1">
            <h3 className="mb-4 text-xl font-bold text-primary">New Booking</h3>
            {error && <div className="p-2 mb-4 text-sm text-red-700 bg-red-100 rounded">{error}</div>}
            
            <form onSubmit={handleBookAppointment} className="space-y-4">
              <div>
                <label className="block mb-1 text-sm font-medium text-gray-700">Select Pet</label>
                <select 
                  required className="w-full p-2 border rounded"
                  value={formData.petId} onChange={(e) => setFormData({...formData, petId: e.target.value})}
                >
                  <option value="">-- Choose a Pet --</option>
                  {pets.map(pet => (
                    <option key={pet._id} value={pet._id}>{pet.name} ({pet.species})</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block mb-1 text-sm font-medium text-gray-700">Date</label>
                <input 
                  type="date" required className="w-full p-2 border rounded"
                  // Set min date to today so they can't book in the past
                  min={new Date().toISOString().split('T')[0]} 
                  value={formData.date} onChange={(e) => setFormData({...formData, date: e.target.value})}
                />
              </div>

              <div>
                <label className="block mb-1 text-sm font-medium text-gray-700">Time Slot</label>
                <select 
                  required className="w-full p-2 border rounded"
                  value={formData.timeSlot} onChange={(e) => setFormData({...formData, timeSlot: e.target.value})}
                >
                  {timeSlots.map(slot => (
                    <option key={slot} value={slot}>{slot}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block mb-1 text-sm font-medium text-gray-700">Reason for Visit</label>
                <textarea 
                  required className="w-full p-2 border rounded h-20" placeholder="e.g., Annual checkup, limping, etc."
                  value={formData.reason} onChange={(e) => setFormData({...formData, reason: e.target.value})}
                />
              </div>

              <button type="submit" className="w-full p-2 text-white rounded bg-secondary hover:bg-green-600">
                Confirm Booking
              </button>
            </form>
          </div>
        )}

        {/* Master Schedule (VISIBLE TO EVERYONE) */}
        <div className={`bg-white p-6 rounded shadow-md ${user.role === 'owner' ? 'lg:col-span-2' : 'lg:col-span-3'}`}>
          <h3 className="mb-4 text-xl font-bold text-gray-800">Upcoming Appointments</h3>
          
          {appointments.length === 0 ? (
            <p className="text-gray-500">No upcoming appointments scheduled.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="p-3 border-b">Date</th>
                    <th className="p-3 border-b">Time</th>
                    <th className="p-3 border-b">Pet</th>
                    {user.role !== 'owner' && <th className="p-3 border-b">Owner</th>}
                    <th className="p-3 border-b">Reason</th>
                    <th className="p-3 border-b">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {appointments.map(appt => (
                    <tr key={appt._id} className="hover:bg-gray-50">
                      <td className="p-3 border-b font-medium">
                        {new Date(appt.date).toLocaleDateString()}
                      </td>
                      <td className="p-3 text-primary font-bold border-b">{appt.timeSlot}</td>
                      <td className="p-3 border-b">{appt.pet?.name || 'Unknown'}</td>
                      {user.role !== 'owner' && (
                        <td className="p-3 border-b">{appt.owner?.name || 'Unknown'}</td>
                      )}
                      <td className="p-3 border-b text-gray-600">{appt.reason}</td>
                      <td className="p-3 border-b">
                        <span className="px-2 py-1 text-xs text-yellow-800 bg-yellow-100 rounded-full">
                          {appt.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default Calendar;