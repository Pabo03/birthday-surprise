document.addEventListener("DOMContentLoaded", () => {
  console.log("Birthday site initialized");

  // IMPORTANT: attach the opening button FIRST.
  // This means a later error in another module cannot disable the first click.
  const unlockButton = document.getElementById("unlock-button");
  if (unlockButton) {
    unlockButton.addEventListener("click", () => {
      console.log("Begin button clicked");
      showScreen("candle-screen");
      if (typeof resetCakeExperience === "function") resetCakeExperience();
    });
  }

  // Basic text/config setup
  setText("[data-name]", birthdayConfig.name, true);
  setText("birthday-title", `Happy Birthday, ${birthdayConfig.name} ❤️`);
  setText("birthday-message", birthdayConfig.message);
  setText("final-message", birthdayConfig.finalMessage);
  setText("cake-tag-text", birthdayConfig.cakeTag);

  const music = document.getElementById("birthday-music");
  const musicSource = document.getElementById("birthday-music-source");
  if (music && musicSource) {
    musicSource.src = birthdayConfig.birthdayMusic;
    music.load();
  }

  // Initialize each module independently.
  // If one module has an error, the rest of the website still works.
  safeInit("countdown", initCountdown);
  safeInit("gallery", initGallery);
  safeInit("puzzle", initPuzzle);
  safeInit("candle", initCandle);
  safeInit("word puzzle", initWordPuzzle);
  safeInit("word puzzle 2", initWordPuzzle2);

  bindClick("fireworks-next", () => showScreen("puzzle-screen"));
  bindClick("puzzle-next", () => showScreen("word-screen"));
  bindClick("word-next", () => showScreen("word2-screen"));
  bindClick("word2-next", () => {
    showScreen("message-screen");
    typeMessage();
  });
  bindClick("memory-button", () => showScreen("memories-screen"));
  bindClick("final-button", () => {
    showScreen("final-screen");
    launchFinalParticles();
  });
});

function safeInit(name, fn) {
  try {
    fn();
    console.log(`${name} initialized`);
  } catch (error) {
    console.error(`${name} failed:`, error);
  }
}

function bindClick(id, handler) {
  const element = document.getElementById(id);
  if (element) element.addEventListener("click", handler);
}

function setText(selector, value, all = false) {
  if (all) {
    document.querySelectorAll(selector).forEach(el => el.textContent = value);
    return;
  }
  const element = document.getElementById(selector);
  if (element) element.textContent = value;
}

function showScreen(id) {
  document.querySelectorAll(".screen").forEach(screen => {
    screen.classList.remove("active");
  });

  const target = document.getElementById(id);
  if (!target) {
    console.error(`Screen not found: ${id}`);
    return;
  }

  target.classList.add("active");
}

function typeMessage() {
  const element = document.getElementById("birthday-message");
  if (!element) return;

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

  if (!cake || !sparkler || !match) return;

  cakeStageState = "match";
  cake.classList.remove("lit", "blown", "cut");
  sparkler.classList.remove("active");
  match.classList.remove("used", "burning");
  match.style.left = "5%";
  match.style.top = "auto";
  match.style.bottom = "63px";
  match.style.transform = "rotate(-20deg)";

  document.getElementById("ignition-strip")?.classList.add("ready");
  document.getElementById("proximity-hint")?.classList.remove("visible");
  candleControls?.classList.add("hidden");
  cutControls?.classList.add("hidden");

  setText("sparkle-instruction", "First, drag the match through the glowing strip to light it.");
  setText("match-hint", "↔ Drag the match through the glowing strip");
  document.getElementById("match-hint")?.classList.remove("active");
  setText("candle-instruction", "The candles are burning. Make a wish quick, then blow them out. 🎂");
  document.getElementById("mic-button")?.classList.remove("hidden");
  document.getElementById("tap-button")?.classList.remove("hidden");
  setText("mic-status", "");
}
