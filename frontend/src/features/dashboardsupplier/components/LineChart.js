import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Filler,
  Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import TitleCard from '../../../components/Cards/TitleCard';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Filler,
  Legend
);

function LineChart() {
  // Get id_supplier from Redux store user state
  const user = useSelector(state => state.auth.user);
  const id_supplier = user?.detail?.id_supplier;

  const [chartData, setChartData] = useState({
    labels: [],
    datasets: [
      {
        fill: true,
        label: 'REVENUE',
        data: [],
        borderColor: 'rgb(127, 0, 0)',
        backgroundColor: 'rgba(53, 162, 235, 0.4)',
      },
    ],
  });

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
    },
    scales: {
      y: {
        ticks: {
          callback: function (value) {
            return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(value * 1000);
          },
        },
      },
    },
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!id_supplier) return;
        const response = await axios.get(`http://localhost:5000/api/pesanan/daily-revenue/${id_supplier}`);
        const data = response.data;

        const labels = data.map(item => {
          const date = new Date(item.date);
          return date.toLocaleDateString('id-ID', { weekday: 'short' });
        });

        const revenueData = data.map(item => item.totalRevenue / 1000); // convert to thousands

        setChartData({
          labels,
          datasets: [
            {
              fill: true,
              label: 'REVENUE',
              data: revenueData,
              borderColor: 'rgb(127, 0, 0)',
              backgroundColor: 'rgba(53, 162, 235, 0.4)',
            },
          ],
        });
      } catch (error) {
        console.error('Error fetching daily revenue data:', error);
      }
    };

    fetchData();
  }, [id_supplier]);

  return (
    <TitleCard title={'Total Revenue'}>
      <Line data={chartData} options={options} />
    </TitleCard>
  );
}

export default LineChart
