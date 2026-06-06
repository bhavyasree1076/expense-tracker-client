import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend
} from "chart.js";

import { Doughnut } from "react-chartjs-2";

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend
);


const centerText = {
  id: "centerText",
  beforeDraw(chart) {
    const { width } = chart;
    const { height } = chart;
    const ctx = chart.ctx;

    ctx.restore();
    const fontSize = (height / 160).toFixed(2);
    ctx.font = `${fontSize}em sans-serif`;
    ctx.textBaseline = "middle";

    const text = "Total";
    const textX = Math.round((width - ctx.measureText(text).width) / 2);
    const textY = height / 2;

    ctx.fillStyle = "#fff";
    ctx.fillText(text, textX, textY);
    ctx.save();
  }
};

ChartJS.register(ArcElement, Tooltip, Legend, centerText);

function ExpenseChart({ expenses }) {

  const food = expenses
    .filter(exp => exp.category === "Food")
    .reduce((sum, exp) => sum + Number(exp.amount), 0);

  const travel = expenses
    .filter(exp => exp.category === "Travel")
    .reduce((sum, exp) => sum + Number(exp.amount), 0);

  const education = expenses
    .filter(exp => exp.category === "Education")
    .reduce((sum, exp) => sum + Number(exp.amount), 0);

  const entertainment = expenses
    .filter(exp => exp.category === "Entertainment")
    .reduce((sum, exp) => sum + Number(exp.amount), 0);

  const shopping = expenses
    .filter(exp => exp.category === "Shopping")
    .reduce((sum, exp) => sum + Number(exp.amount), 0);

  const data = {
    labels: [
      "Food",
      "Travel",
      "Education",
      "Entertainment",
      "Shopping"
    ],
    datasets:[
{
  data:[
    food,
    travel,
    education,
    entertainment,
    shopping
  ],

  backgroundColor: [
  "rgba(255, 99, 132, 0.8)",   // Food (pink/red)
  "rgba(54, 162, 235, 0.8)",   // Travel (blue)
  "rgba(255, 206, 86, 0.8)",   // Education (yellow)
  "rgba(75, 192, 192, 0.8)",   // Entertainment (teal)
  "rgba(153, 102, 255, 0.8)"   // Shopping (purple)
],
borderColor: "rgba(255,255,255,0.3)",
borderWidth: 2
}
]
  };

  return (
    <div className='chart-container'>
      <Doughnut
  data={data}
  options={{
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "bottom",
        labels: {
          color: "#ffffff",   // ✅ WHITE CATEGORY TEXT
          padding: 15,
          boxwidth: 12,
          font: {
            size: 12
          }
        }
      }
    }
  }}
/>
    </div>
  );
}

export default ExpenseChart;