import { useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import { fetchReportsByMonth , deleteMonthlySummary  } from "../../hooks/flatinfoApi";

const monthOptions = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const getYearOptions = () => {
  const currentYear = new Date().getFullYear();
  return Array.from({ length: 7 }, (_, i) => `${currentYear - 3 + i}`);
};

const yearOptions = getYearOptions();

const MonthlyReport = () => {
  const [month, setMonth] = useState("");
  const [year, setYear] = useState("");
  const [reports, setReports] = useState([]);

  useEffect(() => {
    const now = new Date();
    setMonth(monthOptions[now.getMonth()]);
    setYear(now.getFullYear().toString());
  }, []);

  const fetchReports = async () => {
    try {
      const response = await fetchReportsByMonth(month, year);
      setReports(response.data || []);
      toast.success("Monthly reports loaded");
    } catch (err) {
      toast.error(
        err?.response?.data?.message || "Failed to fetch monthly reports"
      );
    }
  };

  const handleDelete = async (id) => {
  if (!window.confirm("Are you sure you want to delete this report?")) return;

  try {
    await deleteMonthlySummary(id);
    toast.success("Monthly summary deleted");

    // Filter it out from local state
    setReports((prev) => prev.filter((r) => r._id !== id));
  } catch (err) {
    console.error(err);
    toast.error(err?.response?.data?.message || "Failed to delete summary");
  }
};

  const handleMonthChange = (e) => setMonth(e.target.value);
  const handleYearChange = (e) => setYear(e.target.value);

  return (
    <div className="max-w-7xl mx-auto p-6 bg-white rounded-2xl shadow-xl mt-10">
      <h2 className="text-2xl font-bold mb-6 text-center">Monthly Reports</h2>

      <div className="flex flex-col md:flex-row gap-4 mb-6 justify-center">
        <div className="flex flex-col gap-1">
          <label htmlFor="month" className="font-medium">
            Month
          </label>
          <select
            id="month"
            name="month"
            value={month}
            onChange={handleMonthChange}
            className="border rounded-md p-2"
          >
            {monthOptions.map((m) => (
              <option key={m} value={m}>
                {m}
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-col gap-1">
          <label htmlFor="year" className="font-medium">
            Year
          </label>
          <select
            id="year"
            name="year"
            value={year}
            onChange={handleYearChange}
            className="border rounded-md p-2"
          >
            {yearOptions.map((y) => (
              <option key={y} value={y}>
                {y}
              </option>
            ))}
          </select>
        </div>

        <button
          onClick={fetchReports}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg self-end hover:bg-blue-700 transition"
        >
          Load Report
        </button>
      </div>

      {reports.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="w-full table-auto border-collapse border border-gray-300 text-sm">
            <thead className="bg-gray-100">
              <tr>
                <th className="border px-4 py-2 text-left">Room</th>
                <th className="border px-4 py-2 text-left">Marketing</th>
                <th className="border px-4 py-2 text-left">Rent</th>
                <th className="border px-4 py-2 text-left">Maintenance</th>
                <th className="border px-4 py-2 text-left">Caretaker</th>
                <th className="border px-4 py-2 text-left">WiFi</th>
                <th className="border px-4 py-2 text-left">Electricity</th>
                <th className="border px-4 py-2 text-left">Other Expenses</th>
                <th className="border px-4 py-2 text-left">Total Income</th>
                <th className="border px-4 py-2 text-left">Total Expense</th>
                <th className="border px-4 py-2 text-left">Profit</th>
                <th className="border px-4 py-2 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {reports.map((report, index) => (
                <tr key={report._id || index} className="hover:bg-gray-50">
                  <td className="border px-4 py-2">{report.room}</td>
                  <td className="border px-4 py-2">
                    {report.marketingExpense}
                  </td>
                  <td className="border px-4 py-2">{report.monthlyRent}</td>
                  <td className="border px-4 py-2">{report.maintenance}</td>
                  <td className="border px-4 py-2">{report.caretakerSalary}</td>
                  <td className="border px-4 py-2">{report.wifiBill}</td>
                  <td className="border px-4 py-2">{report.electricityBill}</td>
                  <td className="border px-4 py-2 text-blue-700">
                    {report.totalOtherExpenses}
                  </td>
                  <td className="border px-4 py-2 text-yellow-700">
                    {report.totalIncome}
                  </td>
                  <td className="border px-4 py-2 text-red-600">
                    {report.totalExpense}
                  </td>
                  <td
                    className={`border px-4 py-2 font-semibold ${
                      report.profit >= 0 ? "text-green-600" : "text-red-500"
                    }`}
                  >
                    {report.profit}
                  </td>
                  <td className="border px-4 py-2">
                    <button
                      onClick={() => handleDelete(report._id)}
                      className="text-red-600 hover:underline"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="text-center text-gray-500 mt-4">
          No reports available for {month} {year}.
        </p>
      )}
    </div>
  );
};

export default MonthlyReport;
