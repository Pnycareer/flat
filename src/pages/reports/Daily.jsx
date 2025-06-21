import { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { fetchDailyEntries } from '../../hooks/flatinfoApi';
import Dropdown from '../../components/Fields/Dropdown';
import { roomOptions } from '../../components/data/roomOptions';
import { useAuth } from '../../context/AuthContext';

const monthOptions = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

const getYearOptions = () => {
  const currentYear = new Date().getFullYear();
  return Array.from({ length: 5 }, (_, i) => `${currentYear - 2 + i}`);
};

const yearOptions = getYearOptions();

const DailyEntries = () => {
  const { user } = useAuth();
  const allowedRoomOptions = roomOptions.filter(room =>
    user?.allowedRooms?.includes(room)
  );

  const [room, setRoom] = useState('');
  const [month, setMonth] = useState(monthOptions[new Date().getMonth()]);
  const [year, setYear] = useState(new Date().getFullYear().toString());
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchAll = async () => {
    setLoading(true);
    try {
      const res = await fetchDailyEntries({ room, month, year }); // ✅ year added
      setEntries(res.data);
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Failed to fetch daily entries');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAll();
  }, [room, month, year]);

  return (
    <div className="max-w-6xl mx-auto p-4 sm:p-6 lg:p-8">
      <h2 className="text-3xl font-bold text-center mb-8 text-gray-800">📊 Daily Entry Report</h2>

      {/* Filters */}
      <div className="flex flex-col md:flex-row md:items-end gap-4 justify-center mb-8">
        <Dropdown
          label="Room"
          name="room"
          options={[...allowedRoomOptions]}
          value={room}
          onChange={(e) => setRoom(e.target.value)}
        />
        <Dropdown
          label="Month"
          name="month"
          options={monthOptions}
          value={month}
          onChange={(e) => setMonth(e.target.value)}
        />
        <Dropdown
          label="Year"
          name="year"
          options={yearOptions}
          value={year}
          onChange={(e) => setYear(e.target.value)}
        />
        <button
          onClick={fetchAll}
          className="bg-blue-600 text-white font-medium px-5 py-2 rounded-lg hover:bg-blue-700 transition"
        >
          Apply Filters
        </button>
      </div>

      {/* Table */}
      {loading ? (
        <p className="text-center text-gray-500">Loading entries...</p>
      ) : entries.length ? (
        <div className="overflow-x-auto rounded-lg shadow-md">
          <table className="w-full table-auto text-sm sm:text-base bg-white">
            <thead className="bg-blue-50 text-gray-700">
              <tr className="text-left">
                <th className="px-4 py-3 border">Date</th>
                <th className="px-4 py-3 border">Room</th>
                <th className="px-4 py-3 border text-green-700">Income</th>
                <th className="px-4 py-3 border text-yellow-700">Other Expenses</th>
                <th className="px-4 py-3 border text-blue-700">Profit / Loss</th>
              </tr>
            </thead>
            <tbody>
              {entries.map((e, i) => {
                const totalOther = e.otherExpenses.reduce((a, x) => a + x.amount, 0);
                const profit = e.dailyRate - totalOther;
                return (
                  <tr key={i} className="hover:bg-gray-50 transition">
                    <td className="px-4 py-2 border">{new Date(e.date).toLocaleDateString()}</td>
                    <td className="px-4 py-2 border">{e.room}</td>
                    <td className="px-4 py-2 border text-green-600 font-medium">{e.dailyRate}</td>
                    <td className="px-4 py-2 border text-yellow-700">{totalOther}</td>
                    <td
                      className={`px-4 py-2 border font-bold ${
                        profit >= 0 ? 'text-green-700' : 'text-red-600'
                      }`}
                    >
                      {profit}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="text-center text-gray-400 mt-10">No daily entries found for this filter.</p>
      )}
    </div>
  );
};

export default DailyEntries;
