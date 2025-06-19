import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import TitleCard from '../../../components/Cards/TitleCard';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

function BarChart() {
  const [chartData, setChartData] = useState({
    labels: [],
    datasets: [
      {
        label: 'Total Stok',
        data: [],
        backgroundColor: 'rgba(127, 0, 0, 1)',
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
  };

  useEffect(() => {
    const fetchStockPerCategory = async () => {
      try {
        // Use full URL with port if backend runs on different port
        const response = await axios.get('http://localhost:5000/api/produk-stock-per-kategori');
        const data = response.data;
        console.log('Fetched stock per category data:', data);

        const labels = data.map(item => item.nama_kategori);
        const stockData = data.map(item => item.total_stok);
        console.log('Labels:', labels);
        console.log('Stock data:', stockData);

        setChartData({
          labels,
          datasets: [
            {
              label: 'Stok Produk',
              data: stockData,
              backgroundColor: 'rgba(127, 0, 0, 1)',
            },
          ],
        });
        console.log('Chart data set:', {
          labels,
          datasets: [
            {
              label: 'Total Stok',
              data: stockData,
              backgroundColor: 'rgba(127, 0, 0, 1)',
            },
          ],
        });
      } catch (error) {
        console.error('Error fetching stock per category:', error);
      }
    };

    fetchStockPerCategory();
  }, []);

  return (
    <TitleCard title={"Total Stok per Kategori"}>
      <Bar options={options} data={chartData} />
    </TitleCard>
  );
}

export default BarChart;
