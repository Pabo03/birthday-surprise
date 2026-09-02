document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll("[data-name]").forEach(el => {
    el.textContent = birthdayConfig.name;
  });

  document.getElementById("birthday-title").textContent =
    `Happy Birthday, ${birthdayConfig.name} ❤️`;
  document.getElementById("birthday-message").textContent = birthdayConfig.message;
  document.getElementById("final-message").textContent = birthdayConfig.finalMessage;
  document.getElementById("cake-tag-text").textContent = birthdayConfig.cakeTag;

  initCountdown();
  initGallery();
  initPuzzle();
  initCandle();
  initWordPuzzle();
  initEmojiPuzzle();

  document.getElementById("unlock-button").addEventListener("click", () => {
    showScreen("candle-screen");
    resetCakeExperience();
  });

  document.getElementById("fireworks-next").addEventListener("click", () => {
    showScreen("puzzle-screen");
  });

  document.getElementById("puzzle-next").addEventListener("click", () => {
    showScreen("word-screen");
  });

  document.getElementById("word-next").addEventListener("click", () => {
    showScreen("emoji-screen");
  });

  document.getElementById("emoji-next").addEventListener("click", () => {
    showScreen("message-screen");
    typeMessage();
  });

  document.getElementById("memory-button").addEventListener("click", () => {
    showScreen("memories-screen");
  });

  document.getElementById("final-button").addEventListener("click", () => {
    showScreen("final-screen");
    launchFinalParticles();
  });
});

function showScreen(id) {
  document.querySelectorAll(".screen").forEach(screen => screen.classList.remove("active"));
  document.getElementById(id).classList.add("active");
}

function typeMessage() {
  const element = document.getElementById("birthday-message");
  const text = birthdayConfig.message;
  element.textContent = "";
  let index = 0;

  function type() {
    if (index < text.length) {
      element.textContent += text[index++];
      setTimeout(type, 24);
    }
  }
  type();
}

function resetCakeExperience() {
  const cake = document.querySelector(".cake");
  const sparkler = document.getElementById("sparkler");
  const match = document.getElementById("match");
  const candleControls = document.getElementById("candle-controls");
  const cutControls = document.getElementById("cut-controls");

  cakeStageState = "match";
  cake.classList.remove("lit", "blown", "cut");
  sparkler.classList.remove("active");
  match.classList.remove("used", "burning");
  match.style.left = "5%";
  match.style.top = "auto";
  match.style.bottom = "63px";
  match.style.transform = "rotate(-20deg)";
  document.getElementById("ignition-strip").classList.add("ready");
  document.getElementById("proximity-hint").classList.remove("visible");
  candleControls.classList.add("hidden");
  cutControls.classList.add("hidden");
  document.getElementById("sparkle-instruction").textContent =
    "First, drag the match through the glowing strip to light it.";
  document.getElementById("match-hint").textContent =
    "↔ Drag the match through the glowing strip";
  document.getElementById("match-hint").classList.remove("active");
  document.getElementById("candle-instruction").textContent =
    "The candles are burning. Make a wish, then blow them out. 🎂";
  document.getElementById("mic-button").classList.remove("hidden");
  document.getElementById("tap-button").classList.remove("hidden");
  document.getElementById("mic-status").textContent = "";
}
