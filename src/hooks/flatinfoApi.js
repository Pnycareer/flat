// src/api/flatinfoApi.js
import axiosInstance from '../utils/axiosInstance';

export const postFlatInfo = async (data) => {
  const res = await axiosInstance.post('/flatinfo/daily', data);
  return res.data;
};

export const patchMonthlySummary = async (data) => {
  const res = await axiosInstance.patch('/flatinfo/summary', data);
  return res.data;
};


export const fetchReportsByMonth = async (month, year) => {
  const res = await axiosInstance.get(`/flatinfo/reports`, {
    params: { month, year }
  });
  return res.data;
};


// export const fetchDailyEntries = async ({ room, month }) => {
//   const params = new URLSearchParams();
//   if (room) params.append('room', room);
//   if (month) params.append('month', month);
//   const res = await axiosInstance.get(`/flatinfo/daily?${params.toString()}`);
//   return res.data;
// };


// src/hooks/flatinfoApi.js
export const fetchDailyEntries = async ({ room, month, year }) => {
  const params = new URLSearchParams();
  if (room) params.append('room', room);
  if (month) params.append('month', month);
  if (year) params.append('year', year); // ✅ added year
  const res = await axiosInstance.get(`/flatinfo/daily?${params.toString()}`);
  return res.data;
};

