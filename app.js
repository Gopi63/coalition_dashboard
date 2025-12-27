console.log("App.js loaded");

const API_URL = "https://fedskillstest.coalitiontechnologies.workers.dev";
const credentials = btoa("coalition:skills-test");

async function fetchPatients() {
  const response = await fetch(API_URL, {
    headers: {
      Authorization: `Basic ${credentials}`,
    },
  });

  if (!response.ok) {
    console.error("API error:", response.status);
    return null;
  }

  return await response.json();
}

function fillPatientInfo(p) {
  document.getElementById("patient-name").textContent = p.name;
  document.getElementById("patient-age-gender").textContent = `${p.gender}, ${p.age} years`;
  document.getElementById("patient-dob").textContent = p.date_of_birth;
  document.getElementById("patient-phone").textContent = p.phone_number;
  document.getElementById("patient-emergency").textContent = p.emergency_contact;
  document.getElementById("patient-insurance").textContent = p.insurance_type;

  document.getElementById("patient-photo").src = p.profile_picture;
  document.getElementById("profile-avatar").src = p.profile_picture;
}

function fillDiagnosticList(list) {
  const tbody = document.querySelector("#diagnostic-table tbody");
  tbody.innerHTML = "";

  list.forEach((item) => {
    const tr = document.createElement("tr");

    tr.innerHTML = `
      <td>${item.name}</td>
      <td>${item.status}</td>
    `;

    tbody.appendChild(tr);
  });
}

function fillLabResults(list) {
  const ul = document.getElementById("lab-results-list");
  ul.innerHTML = "";

  list.forEach((item) => {
    const li = document.createElement("li");
    li.className = "list-group-item d-flex justify-content-between align-items-center";
    li.innerHTML = `${item} <span class="text-primary small">View</span>`;
    ul.appendChild(li);
  });
}

function renderChart(history) {
  history.sort((a, b) => (a.year - b.year) || a.month.localeCompare(b.month));

  const labels = history.map((d) => `${d.month} ${d.year}`);
  const systolic = history.map((d) => d.blood_pressure.systolic.value);
  const diastolic = history.map((d) => d.blood_pressure.diastolic.value);

  document.getElementById("bp-period-label").textContent =
    labels[0] + " - " + labels[labels.length - 1];

  new Chart(document.getElementById("bloodPressureChart"), {
    type: "line",
    data: {
      labels,
      datasets: [
        {
          label: "Systolic",
          data: systolic,
          borderColor: "#e63946",
          borderWidth: 2,
          tension: 0.3,
        },
        {
          label: "Diastolic",
          data: diastolic,
          borderColor: "#457b9d",
          borderWidth: 2,
          tension: 0.3,
        },
      ],
    },
    options: {
      responsive: true,
      plugins: {
        legend: { display: true, position: "bottom" },
      },
    },
  });
}

async function init() {
  const data = await fetchPatients();
  if (!data) return;

  const jessica = data.find((p) => p.name === "Jessica Taylor");
  if (!jessica) {
    console.error("Jessica not found");
    return;
  }

  fillPatientInfo(jessica);
  fillDiagnosticList(jessica.diagnostic_list);
  fillLabResults(jessica.lab_results);
  renderChart(jessica.diagnosis_history);
}

document.addEventListener("DOMContentLoaded", init);
