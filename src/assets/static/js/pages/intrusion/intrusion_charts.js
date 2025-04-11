const API_URL = "http://127.0.0.1:8000/api/intrusion-net/chart/combined/";
const access_token = localStorage.getItem("access_token");

function groupByStatus(data, statusKey) {
  const statusCounts = { safe: 0, intruded: 0 };
  data.forEach(item => {
    const status = item[statusKey];
    statusCounts[status] = (statusCounts[status] || 0) + item.count;
  });
  return statusCounts;
}

function renderChart(elementId, title, type, chartData) {
  const options = {
    chart: {
      type: type,
      height: 350
    },
    title: {
      text: title
    },
    xaxis: {
      categories: chartData.categories
    },
    series: chartData.series,
    plotOptions: {
      bar: {
        horizontal: false
      }
    }
  };

  const chart = new ApexCharts(document.querySelector(elementId), options);
  chart.render();
}

function renderRadialGradientChart(elementId, safePercentage, unsafePercentage) {
  const options = {
    series: [safePercentage, unsafePercentage],
    chart: {
      height: 350,
      type: "radialBar"
    },
    labels: ["Safe Scans", "Unsafe Scans"],
    plotOptions: {
      radialBar: {
        dataLabels: {
          name: {
            fontSize: "22px"
          },
          value: {
            fontSize: "16px"
          },
          total: {
            show: true,
            label: "Overall Safety",
            formatter: function () {
              return `${safePercentage.toFixed(1)}% Safe`;
            }
          }
        }
      }
    },
    colors: ["#00e396", "#ff3737"]
  };

  const chart = new ApexCharts(document.querySelector(elementId), options);
  chart.render();
}

fetch(API_URL, {
  method: "GET",
  headers: {
    "Content-Type": "application/json",
    "Authorization": `Bearer ${access_token}`
  }
})
  .then(response => response.json())
  .then(data => {
    const processChartData = (data, groupKey, dateKey) => {
      const grouped = {};
      data.forEach(item => {
        const date = item[dateKey];
        const status = item[groupKey];
        if (!grouped[status]) grouped[status] = {};
        grouped[status][date] = item.count;
      });

      const categories = [...new Set(data.map(i => i[dateKey]))].sort();
      const series = Object.keys(grouped).map(status => ({
        name: status,
        data: categories.map(date => grouped[status][date] || 0)
      }));

      return { categories, series };
    };

    const urlScan = processChartData(data.url_scan, 'intruder_status', 'date');
    const urlInspection = processChartData(data.url_inspection, 'status', 'date');
    const fileInspection = processChartData(data.file_inspection, 'status', 'date');

    // Updated Chart Titles
    renderChart("#port-scan-bar", "Port Scan (Bar)", "bar", urlScan);
    renderChart("#url-inspection-bar", "Virus Scan (Bar)", "bar", urlInspection);
    renderChart("#file-inspection-bar", "Malware Detection (Bar)", "bar", fileInspection);

    const urlScanGrouped = groupByStatus(data.url_scan, 'intruder_status');
    const urlInspectGrouped = groupByStatus(data.url_inspection, 'status');
    const fileInspectGrouped = groupByStatus(data.file_inspection, 'status');

    const categories = ["safe", "intruded"];
    const combinedSeries = [
      {
        name: "Port Scan",
        data: categories.map(status => urlScanGrouped[status] || 0)
      },
      {
        name: "Virus Scan",
        data: categories.map(status => urlInspectGrouped[status] || 0)
      },
      {
        name: "Malware Detection",
        data: categories.map(status => fileInspectGrouped[status] || 0)
      }
    ];

    renderChart("#combined-line-chart", "Combined Scan Status", "line", {
      categories,
      series: combinedSeries
    });

    const totalSafe =
      (urlScanGrouped.safe || 0) +
      (urlInspectGrouped.safe || 0) +
      (fileInspectGrouped.safe || 0);
    const totalIntruded =
      (urlScanGrouped.intruded || 0) +
      (urlInspectGrouped.intruded || 0) +
      (fileInspectGrouped.intruded || 0);
    const totalAll = totalSafe + totalIntruded;

    const safePercentage = totalAll > 0 ? (totalSafe / totalAll) * 100 : 0;
    const unsafePercentage = 100 - safePercentage;

    renderRadialGradientChart("#radialGradient", safePercentage, unsafePercentage);
  })
  .catch(error => console.error("Error loading chart data:", error));

