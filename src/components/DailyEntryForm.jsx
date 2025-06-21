import { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { postFlatInfo } from '../hooks/flatinfoApi';
import InputField from '../components/Fields/InputField';
import Dropdown from '../components/Fields/Dropdown';
import { roomOptions } from '../components/data/roomOptions';
import { useAuth } from '../context/AuthContext';

const DailyEntry = () => {
  const { user } = useAuth();
  const allowedRoomOptions = roomOptions.filter(room =>
    user?.allowedRooms?.includes(room)
  );

  const [formData, setFormData] = useState({
    room: '',
    month: '',
    date: '',
    dailyRate: '',
    otherExpenses: []
  });

  const [otherExpense, setOtherExpense] = useState({ name: '', amount: '' });

  useEffect(() => {
    const today = new Date();
    const monthName = today.toLocaleString('default', { month: 'long' });
    const formattedDate = today.toISOString().split('T')[0];

    setFormData(prev => ({
      ...prev,
      month: monthName,
      date: formattedDate
    }));
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleAddOtherExpense = () => {
    if (otherExpense.name && otherExpense.amount && !isNaN(otherExpense.amount)) {
      setFormData(prev => ({
        ...prev,
        otherExpenses: [
          ...prev.otherExpenses,
          { name: otherExpense.name, amount: Number(otherExpense.amount) }
        ]
      }));
      setOtherExpense({ name: '', amount: '' });
    } else {
      toast.error('Expense name and valid number amount required');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // 🟢 Add any final unsaved otherExpense
    let updatedOtherExpenses = [...formData.otherExpenses];
    if (otherExpense.name && otherExpense.amount && !isNaN(otherExpense.amount)) {
      updatedOtherExpenses.push({
        name: otherExpense.name,
        amount: Number(otherExpense.amount)
      });
    }

    try {
      const year = new Date(formData.date).getFullYear().toString();

      const payload = {
        ...formData,
        otherExpenses: updatedOtherExpenses,
        dailyRate: Number(formData.dailyRate),
        date: new Date(formData.date),
        year // ✅ auto-add year
      };

      const res = await postFlatInfo(payload);
      toast.success(res.message || 'Daily flat info saved');

      // 🔄 Reset
      setFormData({
        room: '',
        month: new Date().toLocaleString('default', { month: 'long' }),
        date: new Date().toISOString().split('T')[0],
        dailyRate: '',
        otherExpenses: []
      });
      setOtherExpense({ name: '', amount: '' });

    } catch (err) {
      toast.error(err?.response?.data?.message || 'Failed to save daily info');
    }
  };

  return (
    <div className="max-w-4xl w-full mx-auto p-6 sm:p-8 bg-gray-50 rounded-2xl shadow-md mt-8 mb-10">
      <h2 className="text-3xl font-semibold text-center text-gray-800 mb-6">📝 Daily Entry</h2>

      <form onSubmit={handleSubmit} className="space-y-5">
        <Dropdown
          label="Room Number"
          name="room"
          value={formData.room}
          onChange={handleChange}
          options={allowedRoomOptions}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <InputField
            label="Month"
            name="month"
            value={formData.month}
            onChange={() => {}}
            disabled
          />
          <InputField
            label="Date"
            name="date"
            type="date"
            value={formData.date}
            onChange={handleChange}
            disabled
          />
        </div>

        <InputField
          label="Daily Rate"
          name="dailyRate"
          type="number"
          value={formData.dailyRate}
          onChange={handleChange}
        />

        {/* Other Expenses */}
        <div className="border-t border-gray-200 pt-6 mt-6">
          <p className="text-sm text-gray-500 italic mb-1">
            *Adding other expenses is optional. Leave blank if none.*
          </p>
          <h4 className="text-lg font-medium text-gray-700 mb-3">Other Expenses</h4>

          <div className="flex flex-col sm:flex-row gap-4 mb-4">
            <input
              placeholder="Expense Name"
              value={otherExpense.name}
              onChange={(e) => setOtherExpense({ ...otherExpense, name: e.target.value })}
              className="flex-1 border border-gray-300 rounded-md px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="number"
              placeholder="Amount"
              value={otherExpense.amount}
              onChange={(e) => setOtherExpense({ ...otherExpense, amount: e.target.value })}
              className="w-full sm:w-40 border border-gray-300 rounded-md px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              type="button"
              onClick={handleAddOtherExpense}
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition"
            >
              Add
            </button>
          </div>

          <ul className="space-y-2">
            {formData.otherExpenses.map((exp, idx) => (
              <li
                key={idx}
                className="flex justify-between items-center bg-gray-100 px-3 py-2 rounded-md text-sm"
              >
                <span className="text-gray-700">{exp.name}: ₹{exp.amount}</span>
                <button
                  type="button"
                  onClick={() => {
                    const updated = [...formData.otherExpenses];
                    updated.splice(idx, 1);
                    setFormData(prev => ({ ...prev, otherExpenses: updated }));
                  }}
                  className="text-red-500 text-xs hover:underline"
                >
                  Remove
                </button>
              </li>
            ))}
          </ul>
        </div>

        <button
          type="submit"
          className="w-full bg-green-600 text-white py-3 rounded-md font-semibold hover:bg-green-700 transition"
        >
          ✅ Submit Entry
        </button>
      </form>
    </div>
  );
};

export default DailyEntry;
