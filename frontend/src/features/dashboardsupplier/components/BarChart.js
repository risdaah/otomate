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

function BarChart(){

    const options = {
        responsive: true,
        plugins: {
          legend: {
            position: 'top',
          }
        },
      };
      
      const labels = ['Week 1', 'Week 2', 'MWeek 3', 'Week 4'];
      
      const data = {
        labels,
        datasets: [
          {
            label: 'Paid',
            data: labels.map(() => { return Math.random() * 1000 + 500 }),
            backgroundColor: 'rgba(127, 0, 0, 1)',
          },
          {
            label: 'Pending',
            data: labels.map(() => { return Math.random() * 1000 + 500 }),
            backgroundColor: 'rgba(53, 162, 235, 1)',
          },
         {
            label: 'Unpaid',
            data: labels.map(() => { return Math.random() * 1000 + 500 }),
            backgroundColor: 'rgb(254, 102, 103)',
          },
        ],
      };

    return(
      <TitleCard title={"Status Invoice"}>
            <Bar options={options} data={data} />
      </TitleCard>

    )
}


export default BarChart