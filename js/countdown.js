function initCountdown() {
  const target = new Date(birthdayConfig.birthday).getTime();
  const button = document.getElementById("unlock-button");
  const note = document.getElementById("locked-note");

  function update() {
    const diff = target - Date.now();

    if (diff <= 0) {
      document.getElementById("days").textContent = "00";
      document.getElementById("hours").textContent = "00";
      document.getElementById("minutes").textContent = "00";
      document.getElementById("seconds").textContent = "00";
      button.classList.remove("hidden");
      note.textContent = "It's time. ✨";
      return;
    }

    const seconds = Math.floor(diff / 1000);
    const days = Math.floor(seconds / 86400);
    const hours = Math.floor((seconds % 86400) / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    document.getElementById("days").textContent = String(days).padStart(2, "0");
    document.getElementById("hours").textContent = String(hours).padStart(2, "0");
    document.getElementById("minutes").textContent = String(minutes).padStart(2, "0");
    document.getElementById("seconds").textContent = String(secs).padStart(2, "0");
  }

  update();
  const timer = setInterval(() => {
    update();
    if (Date.now() >= target) clearInterval(timer);
  }, 1000);
}
