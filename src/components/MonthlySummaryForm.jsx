import { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { patchMonthlySummary } from '../hooks/flatinfoApi';
import InputField from '../components/Fields/InputField';
import Dropdown from '../components/Fields/Dropdown';
import { roomOptions } from './data/roomOptions';
import { useAuth } from '../context/AuthContext';


const monthOptions = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

// Generate a range of years (current year ± 3)
const getYearOptions = () => {
  const currentYear = new Date().getFullYear();
  return Array.from({ length: 7 }, (_, i) => `${currentYear - 3 + i}`);
};

const yearOptions = getYearOptions();

const MonthlySummary = () => {
   const { user } = useAuth(); // ✅ get user
  const allowedRoomOptions = roomOptions.filter(room =>
    user?.allowedRooms?.includes(room)
  );
  const [formData, setFormData] = useState({
    room: '',
    month: '',
    year: '',
    marketingExpense: '',
    monthlyRent: '',
    maintenance: '',
    caretakerSalary: '',
    wifiBill: '',
    electricityBill: ''
  });

  useEffect(() => {
    const now = new Date();
    const currentMonth = monthOptions[now.getMonth()];
    const currentYear = now.getFullYear();
    setFormData(prev => ({ ...prev, month: currentMonth, year: currentYear.toString() }));
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (e.target.type === 'number' && value !== '' && isNaN(value)) return;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...formData,
        year: Number(formData.year),
        marketingExpense: Number(formData.marketingExpense || 0),
        monthlyRent: Number(formData.monthlyRent),
        maintenance: Number(formData.maintenance || 0),
        caretakerSalary: Number(formData.caretakerSalary || 0),
        wifiBill: Number(formData.wifiBill || 0),
        electricityBill: Number(formData.electricityBill || 0)
      };

      const res = await patchMonthlySummary(payload);
      toast.success(res.message || 'Monthly summary added');
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Failed to save monthly summary');
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white rounded-2xl shadow-xl mt-10">
      <h2 className="text-2xl font-bold mb-6 text-center">Monthly Summary</h2>
      <form onSubmit={handleSubmit} className="space-y-4">

        <Dropdown
          label="Room Number"
          name="room"
          value={formData.room}
          onChange={handleChange}
          options={allowedRoomOptions} // ✅ use filtered list
          // options={roomOptions}
        />

        <Dropdown
          label="Month"
          name="month"
          value={formData.month}
          onChange={handleChange}
          options={monthOptions}
        />

        <Dropdown
          label="Year"
          name="year"
          value={formData.year}
          onChange={handleChange}
          options={yearOptions}
        />

        <InputField label="Marketing Expense" name="marketingExpense" type="number" min="0" step="any" value={formData.marketingExpense} onChange={handleChange} />
        <InputField label="Monthly Rent" name="monthlyRent" type="number" min="0" step="any" value={formData.monthlyRent} onChange={handleChange} />
        <InputField label="Maintenance" name="maintenance" type="number" min="0" step="any" value={formData.maintenance} onChange={handleChange} />
        <InputField label="Caretaker Salary" name="caretakerSalary" type="number" min="0" step="any" value={formData.caretakerSalary} onChange={handleChange} />
        <InputField label="WiFi Bill" name="wifiBill" type="number" min="0" step="any" value={formData.wifiBill} onChange={handleChange} />
        <InputField label="Electricity Bill" name="electricityBill" type="number" min="0" step="any" value={formData.electricityBill} onChange={handleChange} />

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition mt-6"
        >
          Submit Summary
        </button>
      </form>
    </div>
  );
};

export default MonthlySummary;
