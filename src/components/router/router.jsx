import { createBrowserRouter } from "react-router-dom";
import App from '../../App';
import FlatinfoPost from "../../pages/Flat/FlatinfoPost";
import DailyEntry from "../DailyEntryForm";
import MonthlySummary from "../MonthlySummaryForm";
import Monthlyreport from "../../pages/reports/Monthly";
import DailyEntries from "../../pages/reports/Daily";
import Login from "../../pages/auth/Login";
import ProtectedRoute from "../ProtectedRoute/ProtectedRoute";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Login />
  },
  {
    path: "/dashboard",
    element: (
      <ProtectedRoute>
        <App />
      </ProtectedRoute>
    ),
    children: [
      { index: true, element: <DailyEntry /> },
      { path: 'monthly-summary', element: <MonthlySummary /> },
      { path: 'monthly-report', element: <Monthlyreport /> },
      { path: 'dailyreport', element: <DailyEntries /> }
    ]
  }
]);

export default router;
