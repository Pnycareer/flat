// src/pages/FlatinfoPost.jsx
import { useState } from 'react';
import { toast } from 'react-hot-toast';
import { postFlatInfo, patchMonthlySummary } from '../../hooks/flatinfoApi';
import DailyEntryForm from '../../components/DailyEntryForm';
import MonthlySummaryForm from '../../components/MonthlySummaryForm';

const FlatinfoPost = () => {
  const [formData, setFormData] = useState({
    room: '',
    month: '',
    date: '',
    dailyRate: '',
    otherExpenses: [],
    marketingExpense: '',
    monthlyRent: '',
    maintenance: '',
    caretakerSalary: '',
    wifiBill: '',
    electricityBill: ''
  });

  const [showMonthlyFields, setShowMonthlyFields] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { room, month, date, dailyRate, otherExpenses } = formData;
      if (!room || !month || !date || !dailyRate) {
        return toast.error('Fill all daily required fields!');
      }

      const dailyPayload = {
        room,
        month,
        date: new Date(date),
        dailyRate: Number(dailyRate),
        otherExpenses
      };

      const dailyRes = await postFlatInfo(dailyPayload);
      toast.success(dailyRes.message || 'Daily info posted!');

      if (showMonthlyFields) {
        const {
          marketingExpense,
          monthlyRent,
          maintenance,
          caretakerSalary,
          wifiBill,
          electricityBill
        } = formData;

        if (!monthlyRent) return toast.error('Monthly rent is required for summary.');

        const monthlyPayload = {
          room,
          month,
          marketingExpense: Number(marketingExpense || 0),
          monthlyRent: Number(monthlyRent),
          maintenance: Number(maintenance || 0),
          caretakerSalary: Number(caretakerSalary || 0),
          wifiBill: Number(wifiBill || 0),
          electricityBill: Number(electricityBill || 0)
        };

        const patchRes = await patchMonthlySummary(monthlyPayload);
        toast.success(patchRes.message || 'Monthly summary added');
      }
    } catch (err) {
      const msg = err?.response?.data?.message || 'Something went wrong';
      toast.error(msg);
      console.error(err);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white rounded-2xl shadow-xl mt-10">
      <h2 className="text-2xl font-bold mb-6 text-center">Post Flat Info</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <DailyEntryForm formData={formData} setFormData={setFormData} />

        <div className="flex items-center gap-2 mt-4">
          <input
            id="monthEndToggle"
            type="checkbox"
            checked={showMonthlyFields}
            onChange={() => setShowMonthlyFields((prev) => !prev)}
            className="w-4 h-4"
          />
          <label htmlFor="monthEndToggle" className="text-sm font-medium">
            Add Month-End Summary
          </label>
        </div>

        {showMonthlyFields && (
          <MonthlySummaryForm formData={formData} handleChange={handleChange} />
        )}

        <button
          type="submit"
          className="w-full bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition mt-6"
        >
          Submit
        </button>
      </form>
    </div>
  );
};

export default FlatinfoPost;