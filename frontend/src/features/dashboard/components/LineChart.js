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

import { useState, useEffect } from 'react';

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

function LineChart(){

  const [chartData, setChartData] = useState({
    labels: [],
    datasets: [
      {
        fill: true,
        label: 'COST',
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
          callback: function(value) {
            return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(value * 1000000);
          }
        }
      }
    }
  };

  useEffect(() => {
    async function fetchDailyCostData() {
      try {
        const response = await fetch('http://localhost:5000/api/daily-cost-data');
        const data = await response.json();
        const labels = data.map(item => {
          const date = new Date(item.date);
          return date.toLocaleDateString('en-US', { weekday: 'short' });
        });
        const costs = data.map(item => item.totalCost / 1000000); // convert to millions (Jt)
        setChartData({
          labels,
          datasets: [
            {
              fill: true,
              label: 'COST',
              data: costs,
              borderColor: 'rgb(127, 0, 0)',
              backgroundColor: 'rgba(53, 162, 235, 0.4)',
            },
          ],
        });
      } catch (error) {
        console.error('Failed to fetch daily cost data:', error);
      }
    }
    fetchDailyCostData();
  }, []);

  return(
    <TitleCard title={"Supply Cost"}>
        <Line data={chartData} options={options}/>
    </TitleCard>
  )
}


export default LineChart