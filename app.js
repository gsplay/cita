let citas = [];
let citasHoy = 0;

// Fecha actual para reset diario
const hoy = new Date().toISOString().split("T")[0];

// Reset de contador si cambió el día
if (localStorage.getItem("fecha") !== hoy) {
  localStorage.setItem("fecha", hoy);
  localStorage.setItem("citasHoy", 0);
  localStorage.setItem("premium", "no");
}

citasHoy = parseInt(localStorage.getItem("citasHoy")) || 0;

// Fetch citas
fetch("citas.json")
  .then(res => res.json())
  .then(data => {
    citas = data;
    mostrarCita();
  });

// Mostrar cita con fade-in
function mostrarCita() {
  const citaDiv = document.getElementById("cita");
  const otraBtn = document.getElementById("otra");
  const pagoDiv = document.getElementById("pago");

  // Si es premium, siempre puede ver más
  const premium = localStorage.getItem("premium") === "si";

  if (!premium && citasHoy >= 5) {
    otraBtn.style.display = "none";
    pagoDiv.style.display = "block";
    return;
  }

  const cita = citas[Math.floor(Math.random() * citas.length)];

  citaDiv.classList.remove("fade");
  void citaDiv.offsetWidth; // reiniciar animación
  citaDiv.classList.add("fade");
  
  setTimeout(() => {
    citaDiv.innerText = cita;
    citaDiv.style.opacity = 1;
  }, 50);

  if (!premium) {
    citasHoy++;
    localStorage.setItem("citasHoy", citasHoy);
  }
}

// Botón “Mostrar otra cita”
document.getElementById("otra").onclick = mostrarCita;

// --- PAYPAL ---
paypal.Buttons({
  createOrder: function(data, actions) {
    return actions.order.create({
      purchase_units: [{
        description: "Acceso ilimitado por 24 horas a las citas",
        amount: { value: "1.00" }
      }]
    });
  },
  onApprove: function(data, actions) {
    return actions.order.capture().then(function() {
      // Activar modo premium por 24h
      localStorage.setItem("premium", "si");
      location.reload();
    });
  }
}).render('#paypal-button-container');
