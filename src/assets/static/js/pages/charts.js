document.addEventListener("DOMContentLoaded", function () {
    fetch("http://127.0.0.1:8000/api/app/chart-data/")
      .then((response) => response.json())
      .then((data) => {
        console.log("API Data:", data);
        // Format Data for ApexCharts
        const scanStatusLabels = data.scan_status_counts.map((item) => item.scan_status);
        const scanStatusCounts = data.scan_status_counts.map((item) => item.count);
  
        const vulnerabilityLabels = data.vulnerability_counts.map((item) => item.severity);
        const vulnerabilityCounts = data.vulnerability_counts.map((item) => item.count);
  
        const scanDates = data.scans_per_day.map((item) => item.day);
        const scanCounts = data.scans_per_day.map((item) => item.count);

        const securityCategories = Object.keys(data.security_findings);
        const securityCounts = Object.values(data.security_findings);
  
        // Bar Chart - Scan Status
        var barOptions = {
          series: [{ name: "Scans", data: scanStatusCounts }],
          chart: { 
            type: "bar",
            height: 350,
            // width: "70%"
          },
          xaxis: { categories: scanStatusLabels },
        };
  
        // Line Chart - Scans Per Day
        var lineOptions = {
          chart: { type: "line", height: 300, width: "100%" },
          series: [{ name: "Findings", data: securityCounts }],
          xaxis: { categories: securityCategories },
          stroke: { curve: "smooth" },
        };
  
        // Area Chart - Vulnerability Severity Distribution
        var areaOptions = {
          series: [{ name: "Vulnerabilities", data: vulnerabilityCounts }],
          chart: { type: "area", height: 350 },
          xaxis: { categories: securityCategories },
          stroke: { curve: "smooth" },
        };
  
        var radialGradientOptions  = {
          series: [data.safe_percentage, data.unsafe_percentage],
          chart: { height: 350, type: "radialBar" },
          labels: ["Safe Scans", "Unsafe Scans"],
          plotOptions: {
            radialBar: {
              dataLabels: {
                name: { fontSize: "22px" },
                value: { fontSize: "16px" },
                total: {
                  show: true,
                  label: "Overall Safety",
                  formatter: function () {
                    return `${data.safe_percentage.toFixed(1)}% Safe`;
                  },
                },
              },
            },
          },
        };
  
        new ApexCharts(document.querySelector("#bar"), barOptions).render();
        new ApexCharts(document.querySelector("#line"), lineOptions).render();
        new ApexCharts(document.querySelector("#area"), areaOptions).render();
        new ApexCharts(document.querySelector("#radialGradient"), radialGradientOptions).render();
      })
      .catch((error) => console.error("Error fetching chart data:", error));
  });
  