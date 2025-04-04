document.addEventListener("DOMContentLoaded", async function () {
  const accessToken = localStorage.getItem("access_token");
  const refreshToken = localStorage.getItem("refresh_token");

  if (!accessToken) {
    console.error("Access token not found. Redirecting to login...");
    window.location.href = "/login.html"; 
    return;
  }

  try {
    // Fetch chart data using the access token
    const data = await fetchChartData(accessToken);

    renderCharts(data);
  } catch (error) {
    if (error.code === "token_not_valid") {
      console.log("Access token expired or invalid. Attempting to refresh..."); 

      try {
        // Refresh the access token using the refresh token
        const newAccessToken = await refreshAccessToken(refreshToken);

        // Retry fetching chart data with the new access token
        const data = await fetchChartData(newAccessToken);

        // Render charts with the fetched data
        renderCharts(data);
      } catch (refreshError) {
        console.error("Failed to refresh token. Redirecting to login...");
        window.location.href = "/login.html";
      }
    } else {
      console.error("Unhandled error:", error);
    }
  }
});

/**
 * Fetch chart data from the API.
 * @param {string} accessToken - The JWT access token.
 * @returns {Promise<Object>} - The chart data.
 */
async function fetchChartData(accessToken) {
  const response = await fetch("http://127.0.0.1:8000/api/app/chart-data/", {
    method: "GET",
    headers: {
      "Authorization": `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw errorData;
  }

  return response.json();
}

/**
 * Refresh the access token using the refresh token.
 * @param {string} refreshToken - The JWT refresh token.
 * @returns {Promise<string>} - The new access token.
 */
async function refreshAccessToken(refreshToken) {
  const response = await fetch("http://127.0.0.1:8000/dj-rest-auth/token/refresh/", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ refresh: refreshToken }),
  });

  if (!response.ok) {
    throw new Error("Failed to refresh token.");
  }

  const data = await response.json();
  localStorage.setItem("access_token", data.access);
  return data.access;
}

/**
 * Render charts using Chart.js with the given data.
 * @param {Object} data - The chart data from the API.
 */
function renderCharts(data) {
  console.log("API Data:", data);

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
    chart: { type: "bar", height: 350 },
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

  var radialGradientOptions = {
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
            formatter() {
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
}