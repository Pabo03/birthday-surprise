let cakeStageState = "match";
let candleTaps = 0;
let micRunning = false;

/* Prevents repeated ignition timers */
let cakeIgnitionTimer = null;
let ignitionStarted = false;
let audioUnlocked = false;
function unlockBirthdayAudio() {
  if (audioUnlocked) return;

  const audio = document.getElementById("birthday-music");

  if (!audio) return;

  audio.muted = true;
  audio.volume = 0;

  audio.play()
    .then(() => {
      audio.pause();
      audio.currentTime = 0;

      audio.muted = false;
      audio.volume = 0.5;

      audioUnlocked = true;

      console.log("Birthday audio unlocked.");
    })
    .catch(error => {
      console.log("Audio unlock failed:", error);
    });
}
function initCandle() {
  const match = document.getElementById("match");
  const sparkler = document.getElementById("sparkler");
  const cake = document.getElementById("cake");
  const scene = document.getElementById("cake-scene");
  const ignitionStrip = document.getElementById("ignition-strip");
  const proximityHint = document.getElementById("proximity-hint");

  let dragging = false;
  let pointerOffsetX = 0;
  let pointerOffsetY = 0;
  let burning = false;

  match.addEventListener("pointerdown", event => {
    if (cakeStageState !== "match") return;

    dragging = true;
    match.setPointerCapture(event.pointerId);

    const rect = match.getBoundingClientRect();
    pointerOffsetX = event.clientX - rect.left;
    pointerOffsetY = event.clientY - rect.top;
  });

  match.addEventListener("pointermove", event => {
  unlockBirthdayAudio();
    if (!dragging || cakeStageState !== "match") return;

    const sceneRect = scene.getBoundingClientRect();
    const x = event.clientX - sceneRect.left - pointerOffsetX;
    const y = event.clientY - sceneRect.top - pointerOffsetY;

    match.style.left = `${Math.max(0, Math.min(sceneRect.width - match.offsetWidth, x))}px`;
    match.style.top = `${Math.max(0, Math.min(sceneRect.height - match.offsetHeight, y))}px`;
    match.style.bottom = "auto";
    match.style.transform = "rotate(-8deg)";

    /* Phase 1: pass the match head through the strike strip. */
    if (!burning && isMatchHeadNear(ignitionStrip, 12)) {
      igniteMatch();
    }

    /* Phase 2: once the match is burning, bring it near the cake/sparkler. */
    if (
      burning &&
      (
        isMatchHeadNear(sparkler, 55) ||
        isMatchHeadNear(cake, 35)
      )
    ) {
      startDelayedIgnition();
    }
  });

  match.addEventListener("pointerup", finishDrag);
  match.addEventListener("pointercancel", finishDrag);

  document.getElementById("tap-button").addEventListener("click", extinguishCandles);
  document.getElementById("mic-button").addEventListener("click", startMicrophone);

  scene.addEventListener("pointerdown", startCutGesture);

  function finishDrag() {
    if (!dragging) return;
    dragging = false;

    if (cakeStageState !== "match") return;

    /* If the user lets go before completing the interaction, return the match. */
    if (!burning) {
      resetMatchPosition();
    }
  }

  function resetMatchPosition() {
    match.style.left = "5%";
    match.style.top = "auto";
    match.style.bottom = "63px";
    match.style.transform = "rotate(-20deg)";
  }

  function isMatchHeadNear(target, padding = 0) {
    const head = match.querySelector(".match-head").getBoundingClientRect();
    const rect = target.getBoundingClientRect();

    return !(
      head.right + padding < rect.left ||
      head.left - padding > rect.right ||
      head.bottom + padding < rect.top ||
      head.top - padding > rect.bottom
    );
  }

  function igniteMatch() {
    if (burning || cakeStageState !== "match") return;

    burning = true;
    match.classList.add("burning");
    ignitionStrip.classList.add("lit");
    proximityHint.classList.add("visible");

    document.getElementById("sparkle-instruction").textContent =
      "The match is burning! Now bring it close to the candles or sparkle. 🔥";
    document.getElementById("match-hint").textContent =
      "🔥 Now bring the burning match close to the candles or sparkle";
    document.getElementById("match-hint").classList.add("active");
  }
  function startDelayedIgnition() {
    if (
      cakeStageState !== "match" ||
      !burning ||
      ignitionStarted ||
      cakeIgnitionTimer
    ) {
      return;
    }

    ignitionStarted = true;

    document.getElementById("sparkle-instruction").textContent =
      "Hold the burning match near the cake... ✨";

    document.getElementById("match-hint").textContent =
      "🔥 Hold it there...";

    cakeIgnitionTimer = setTimeout(() => {
      cakeIgnitionTimer = null;

      if (cakeStageState === "match" && burning) {
        igniteCake();
      }
    }, 700);
  }
  function igniteCake() {
    if (!burning || cakeStageState !== "match") return;

    cakeStageState = "lit";

    /* Sparkler starts first */
    sparkler.classList.add("active");
    playMusic();
    /* Candles follow slightly later */
    setTimeout(() => {
      cake.classList.add("lit");
    }, 450);
    ignitionStrip.classList.remove("ready");
    proximityHint.classList.remove("visible");
    document.getElementById("match-hint").classList.remove("active");
    document.getElementById("match-hint").textContent = "✨ Make a wish! (Don't forget about wishing something for me)";

    document.getElementById("sparkle-instruction").textContent =
      "With everything glowing, hope it overpowers all the dark days and gets you glowing like you are meant to do, now time to make wish. Make one... Hurry!!! tons of stuff waiting to discovered further.✨";

    document.getElementById("candle-controls").classList.remove("hidden");
    candleTaps = 0;

    /* Let the burning match linger for a moment so the ignition feels physical. */
    setTimeout(() => match.classList.add("used"), 500);
    startMusic();
  }

  function extinguishCandles() {
    if (cakeStageState !== "lit") return;

    cakeStageState = "blown";
    cake.classList.add("blown");
    sparkler.classList.remove("active");

    document.getElementById("candle-instruction").textContent =
      "Wish made. ✨ Now give the cake one clean cut!";
    document.getElementById("mic-button").classList.add("hidden");
    document.getElementById("tap-button").classList.add("hidden");
    document.getElementById("cut-controls").classList.remove("hidden");

    stopMicrophoneIfNeeded();
    setTimeout(() => { cakeStageState = "cut"; }, 500);
  }

  function startMicrophone() {
    const status = document.getElementById("mic-status");

    if (micRunning) return;

    if (!navigator.mediaDevices?.getUserMedia) {
      status.textContent = "Microphone detection isn't supported here. Use the tap button.";
      return;
    }

    navigator.mediaDevices.getUserMedia({ audio: true }).then(stream => {
      micRunning = true;
      status.textContent = "Listening... blow toward the microphone. 💨";

      const audioContext = new (window.AudioContext || window.webkitAudioContext)();
      const source = audioContext.createMediaStreamSource(stream);
      const analyser = audioContext.createAnalyser();
      analyser.fftSize = 512;
      analyser.smoothingTimeConstant = .65;
      source.connect(analyser);

      const data = new Uint8Array(analyser.fftSize);
      let blowFrames = 0;

      function detectBlow() {
        if (cakeStageState !== "lit") {
          stream.getTracks().forEach(track => track.stop());
          audioContext.close();
          micRunning = false;
          return;
        }

        analyser.getByteTimeDomainData(data);

        let sum = 0;
        for (const value of data) {
          const normalized = (value - 128) / 128;
          sum += normalized * normalized;
        }

        const rms = Math.sqrt(sum / data.length);

        if (rms > 0.11) {
          blowFrames++;
        } else {
          blowFrames = Math.max(0, blowFrames - 2);
        }

        if (blowFrames >= 7) {
          stream.getTracks().forEach(track => track.stop());
          audioContext.close();
          micRunning = false;
          status.textContent = "That worked! 💨✨";
          extinguishCandles();
          return;
        }

        requestAnimationFrame(detectBlow);
      }

      detectBlow();
    }).catch(() => {
      status.textContent = "Microphone permission was denied. Use the tap button instead.";
    });
  }

  function stopMicrophoneIfNeeded() {
    /* The active microphone loop notices cakeStageState !== 'lit' and closes itself. */
  }

  function startCutGesture(event) {
    if (cakeStageState !== "cut") return;

    /* Only start a cut with a direct pointer action on the cake scene. */
    const startX = event.clientX;
    const startY = event.clientY;
    const startTime = Date.now();
    let endX = startX;
    let endY = startY;
    let moved = false;

    const line = document.createElement("div");
    line.className = "cut-mark";
    scene.appendChild(line);

    function move(e) {
      moved = true;
      endX = e.clientX;
      endY = e.clientY;
      drawLine(line, startX, startY, endX, endY, scene.getBoundingClientRect());
    }

    function up(e) {
      endX = e.clientX;
      endY = e.clientY;

      const distance = Math.hypot(endX - startX, endY - startY);
      const duration = Date.now() - startTime;
      const sceneRect = scene.getBoundingClientRect();
      const cakeRect = cake.getBoundingClientRect();
      const crossedCake = lineIntersectsRect(startX, startY, endX, endY, cakeRect);

      document.removeEventListener("pointermove", move);
      document.removeEventListener("pointerup", up);

      if (
        moved &&
        distance > Math.min(150, sceneRect.width * .35) &&
        duration < 1800 &&
        crossedCake
      ) {
        line.remove();
        finishCakeCut();
      } else {
        setTimeout(() => line.remove(), 220);
      }
    }

    document.addEventListener("pointermove", move);
    document.addEventListener("pointerup", up, { once: true });
  }

  function finishCakeCut() {
    cakeStageState = "done";
    cake.classList.add("cut");
    document.getElementById("cut-instruction").textContent = "Perfect cut! 🎂✨";
    stopMusic();

    /* Give the split animation time to finish before entering fireworks. */
    setTimeout(() => {
      showScreen("fireworks-screen");
      startFireworks();
    }, 1050);
  }

  function drawLine(element, x1, y1, x2, y2, rect) {
    const aX = x1 - rect.left;
    const aY = y1 - rect.top;
    const bX = x2 - rect.left;
    const bY = y2 - rect.top;
    const length = Math.hypot(bX - aX, bY - aY);
    const angle = Math.atan2(bY - aY, bX - aX) * 180 / Math.PI;

    element.style.left = `${aX}px`;
    element.style.top = `${aY}px`;
    element.style.width = `${length}px`;
    element.style.transform = `rotate(${angle}deg)`;
  }

  function lineIntersectsRect(x1, y1, x2, y2, rect) {
    const samples = 30;

    for (let i = 0; i <= samples; i++) {
      const t = i / samples;
      const x = x1 + (x2 - x1) * t;
      const y = y1 + (y2 - y1) * t;

      if (
        x >= rect.left && x <= rect.right &&
        y >= rect.top && y <= rect.bottom
      ) {
        return true;
      }
    }

    return false;
  }
}

function playMusic() {
  const audio = document.getElementById("birthday-music");

  if (!audio) {
    console.log("Birthday music element not found.");
    return;
  }

  audio.muted = false;
  audio.volume = 0.5;

  audio.play()
    .then(() => {
      console.log("Birthday music started.");
    })
    .catch(error => {
      console.log("Birthday music could not start:", error);
    });
}

function stopMusic() {
  const audio = document.getElementById("birthday-music");
  audio.pause();
  audio.currentTime = 0;
}
