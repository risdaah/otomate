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

function LineChart(){

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
    },
  };

    const labels = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  // const labels = ['Sunday', 'Monaday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

  const data = {
  labels,
  datasets: [
    {
      fill: true,
      label: 'COST',
      data: labels.map(() => { return Math.random() * 5000 + 500 }),
      borderColor: 'rgb(127, 0, 0)',
      backgroundColor: 'rgba(53, 162, 235, 0.4)',
    },
  ],
   options: {
    scales: {
      y: {
        ticks: {
          callback: function(value) {
            return value.toFixed(0) + ' Jt';
          }
        }
      }
    }
  }
};
  

    return(
      <TitleCard title={"total Revenue"}>
          <Line data={data} options={options}/>
      </TitleCard>
    )
}


export default LineChart