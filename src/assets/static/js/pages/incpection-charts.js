document.addEventListener("DOMContentLoaded", async function () {   
   const API_URL = 'http://127.0.0.1:8000/api/intrusion_net/inspection_charts/';
    const accessToken = localStorage.getItem("access_token");
    if (!accessToken) {
        console.error("Access token not found.");
      }

    fetch(API_URL, {
      headers: {
        'Authorization': `Bearer ${accessToken}`
      }
    })
    .then(res => res.json())
    .then(data => {
      renderPieChart(data.pie_chart);
      renderBarChart(data.bar_chart);
    })
    .catch(err => console.error('Error fetching chart data:', err));

    function renderPieChart(pie) {
      const options = {
        chart: {
          type: 'pie'
        },
        series: pie.series,
        labels: pie.labels
      };
      const chart = new ApexCharts(document.querySelector("#pieChart"), options);
      console.log('query selected!!!');
      chart.render();
    }

    function renderBarChart(bar) {
      const options = {
        chart: {
          type: 'bar'
        },
        series: [
          {
            name: 'Safe',
            data: bar.safe
          },
          {
            name: 'Unsafe',
            data: bar.unsafe
          }
        ],
        xaxis: {
          categories: bar.categories
        }
      };
      console.log('bar chart query selected!!!');

      const chart = new ApexCharts(document.querySelector("#barChart"), options);
      chart.render();
    }
});