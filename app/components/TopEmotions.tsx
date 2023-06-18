import React, { useEffect, useRef, useState } from "react";
import { Chart, CategoryScale, LinearScale, LineController, LineElement, PointElement, Legend } from "chart.js";
import { Emotion } from "../../lib/data/emotion";

export function TopEmotions({ emotions }: { emotions: Emotion[][] }) {
  const chartRef = useRef(null);
  const chartInstance = useRef(null);
  const [legendData, setLegendData] = useState([]);

  useEffect(() => {
    const labels = emotions.map((_, index) => `Time Step ${index + 1}`);

    // Extract the top emotions and their scores for the dataset
    const datasets = emotions[0].map((emotion, emotionIndex) => {
      const color = generateDistinctColor(emotionIndex, emotions[0].length); // Generate distinct colors
      const data = emotions.map((timeStep) => {
        const copy = [...timeStep];

        // Sort the copy in descending order
        copy.sort((a, b) => b.score - a.score);

        // Retrieve the second-highest value
        const secondHighest = copy[1].score;

        const score = timeStep[emotionIndex].score;
        return score >= secondHighest ? score.toFixed(3) : null;
      });

      return {
        label: emotion.name,
        data,
        borderColor: color,
        backgroundColor: color,
        fill: false,
      };
    });

    const updatedLegendData = emotions[0]
      .map((emotion, emotionIndex) => ({
        emotion: emotion.name,
        color: generateDistinctColor(emotionIndex, emotions[0].length), // Generate distinct colors
      }))
      .filter((item, index) => {
        const dataset = datasets[index];
        return dataset.data.some((score) => score !== null);
      });

    setLegendData(updatedLegendData);

    if (chartRef.current) {
      Chart.register(CategoryScale, LinearScale, LineController, LineElement, PointElement, Legend);

      if (!chartInstance.current) {
        chartInstance.current = new Chart(chartRef.current, {
          type: "line",
          data: {
            labels,
            datasets,
          },
          options: {
            responsive: true,
            animation: {
              duration: 0,
            },
            scales: {
              y: {                
                min: 0.4, // Set minimum value of y-axis to 0.4
                beginAtZero: false,
              },
            },
            plugins: {
              legend: {
                display: false,
              },
            },
          },
        });
      } else {
        chartInstance.current.data.labels = labels;
        chartInstance.current.data.datasets = datasets;
        chartInstance.current.update();
      }

      if (chartInstance.current?.legend) {
        chartInstance.current.legend.legendItems.forEach((legendItem) => {
          legendItem.fillStyle = legendItem.strokeStyle;
          legendItem.lineWidth = 0;
        });
      }
    }
  }, [emotions]);

  return (
    <div>
      <canvas ref={chartRef}></canvas>
      <div className="flex flex-wrap mt-4">
        {legendData.map((item, index) => (
          <div key={index} className="flex items-center mr-4 mb-2">
            <span
              className="inline-block w-3 h-3 mr-2"
              style={{ backgroundColor: item.color }}
            ></span>
            <span className="text-xs">{item.emotion}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function generateDistinctColor(index, totalColors) {
  const hue = (index * (360 / totalColors)) % 360;
  const saturation = 80;
  const value = 70;

  return `hsl(${hue}, ${saturation}%, ${value}%)`;
}
