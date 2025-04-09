document.addEventListener("DOMContentLoaded", () => {
  const intrusionWrapper = document.getElementById("intrusion-table-wrapper");
  const prevBtn = document.getElementById("prev-page");
  const nextBtn = document.getElementById("next-page");
  const pageInfo = document.getElementById("page-info");
  const statusDiv = document.getElementById("status");

  let currentPage = 1;
  const rowsPerPage = 5;
  let fullData = [];

  function renderTablePage(data, page) {
    intrusionWrapper.innerHTML = "";

    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;
    const pageData = data.slice(start, end);

    const table = document.createElement("table");
    table.classList.add("inspection-table");

    const thead = document.createElement("thead");
    thead.innerHTML = `
      <tr>
        <th>ID</th>
        <th>URL</th>
        <th>Status</th>
        <th>A Records</th>
        <th>MX Records</th>
        <th>NS Records</th>
        <th>Malicious</th>
        <th>Created At</th>
        <th>Download</th>
      </tr>
    `;
    table.appendChild(thead);

    const tbody = document.createElement("tbody");

    pageData.forEach((item, index) => {
      const inspection = item.inspection_result || {};
      const row = document.createElement("tr");

      row.innerHTML = `
        <td>${item.id}</td>
        <td>${item.url}</td>
        <td>${item.status}</td>
        <td>${(inspection.A_records || []).join("<br>")}</td>
        <td>${(inspection.MX_records || []).join("<br>")}</td>
        <td>${(inspection.NS_records || []).join("<br>")}</td>
        <td>${inspection.virustotal_malicious ? "Yes" : "No"}</td>
        <td>${new Date(item.created_at).toLocaleString()}</td>
        <td><button class="download-btn" data-index="${start + index}">Download</button></td>
      `;

      tbody.appendChild(row);
    });

    table.appendChild(tbody);
    intrusionWrapper.appendChild(table);

    document.querySelectorAll(".download-btn").forEach((btn) => {
      btn.addEventListener("click", () => {
        const index = btn.getAttribute("data-index");
        const item = fullData[index];
        generateStyledPDF(item);
      });
    });

    const totalPages = Math.ceil(fullData.length / rowsPerPage);
    pageInfo.textContent = `Page ${currentPage} of ${totalPages}`;
    prevBtn.disabled = currentPage === 1;
    nextBtn.disabled = currentPage === totalPages;
  }

  fetch("http://127.0.0.1:8000/api/app/intrusion-net/scan/")
    .then((res) => res.json())
    .then((data) => {
      if (!Array.isArray(data) || data.length === 0) {
        statusDiv.textContent = "No inspection reports found.";
        return;
      }
      fullData = data;
      renderTablePage(fullData, currentPage);
    })
    .catch((err) => {
      statusDiv.textContent = "Error fetching reports: " + err.message;
    });

  prevBtn.addEventListener("click", () => {
    if (currentPage > 1) {
      currentPage--;
      renderTablePage(fullData, currentPage);
    }
  });

  nextBtn.addEventListener("click", () => {
    const totalPages = Math.ceil(fullData.length / rowsPerPage);
    if (currentPage < totalPages) {
      currentPage++;
      renderTablePage(fullData, currentPage);
    }
  });
});

function generateStyledPDF(item) {
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();
  const inspection = item.inspection_result || {};

  // Styled Header
  const y = 10;
  doc.setFillColor(223, 226, 252); // Light purple background
  doc.rect(0, y, 210, 15, 'F'); // Full-width header bar
  doc.setTextColor(48, 63, 159); // Darker purple text
  doc.setFontSize(18);
  doc.setFont("helvetica", "bold");
  doc.text("Inspection Report", 10, y + 10);

  // Basic Info Table
  doc.autoTable({
    startY: y + 20, // Start just below the header
    head: [["Field", "Value"]],
    body: [
      ["URL", item.url],
      ["Status", item.status],
      ["Malicious", inspection.virustotal_malicious ? "Yes" : "No"],
      ["Created At", new Date(item.created_at).toLocaleString()],
    ],
    theme: "grid",
    headStyles: {
      fillColor: [56, 68, 156],
      textColor: [255, 255, 255],
      fontStyle: 'bold'
    },
    styles: {
      fontSize: 10,
      textColor: [44, 62, 80]
    }
  });

  // Section Table Generator
  const tableSection = (title, data) => {
    const content = (data || []).map(v => [v]);
    if (content.length === 0) content.push(["None"]);

    doc.autoTable({
      head: [[title]],
      body: content,
      theme: "striped",
      styles: { fontSize: 10 },
      startY: doc.lastAutoTable.finalY + 10,
    });
  };

  tableSection("A Records", inspection.A_records);
  tableSection("MX Records", inspection.MX_records);
  tableSection("NS Records", inspection.NS_records);
  tableSection("TXT Records", inspection.TXT_records);
  tableSection("AAAA Records", inspection.AAAA_records);

  doc.save(`inspection_report_${item.id}.pdf`);
}