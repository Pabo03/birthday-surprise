function initPuzzle() {
  const puzzle = document.getElementById("puzzle");
  const status = document.getElementById("puzzle-status");
  const next = document.getElementById("puzzle-next");
  const total = 16;
  const correct = Array.from({ length: total }, (_, i) => i);
  let current = shuffle([...correct]);
  let selected = null;
  let solved = false;

  // Use the configured image instead of hard-coding memory.svg.


  function render() {
    puzzle.innerHTML = "";
    current.forEach((piece, index) => {
      const tile = document.createElement("button");
      tile.className = "tile";

      const col = piece % 4;
      const row = Math.floor(piece / 4);

      tile.style.backgroundImage = `url("${birthdayConfig.puzzleImage}")`;
      tile.style.backgroundSize = "400% 400%";
      tile.style.backgroundPosition =
        `${(col / 3) * 100}% ${(row / 3) * 100}%`;

      tile.addEventListener("click", () => {
        if (solved) return;
        if (selected === null) {
          selected = index;
          tile.classList.add("selected");
          return;
        }
        if (selected === index) {
          selected = null;
          render();
          return;
        }
        [current[selected], current[index]] = [current[index], current[selected]];
        selected = null;
        render();
        updateStatus();
      });
      puzzle.appendChild(tile);
    });
  }

  function updateStatus() {
    const correctCount = current.filter((value, i) => value === correct[i]).length;
    status.textContent = `${correctCount} / ${total} tiles in the correct position`;
    if (correctCount === total) {
      solved = true;
      status.textContent = "Happy Birthday Special One ❤️";
      next.classList.remove("hidden");
    }
  }

  render();
  updateStatus();
}

function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

function buildWordPuzzle(config, prefix) {
  const answer = config.answer.toUpperCase();
  const hint = document.getElementById(`${prefix}-hint`);
  const scrambled = document.getElementById(`${prefix}-scrambled-word`);
  const inputs = document.getElementById(`${prefix}-inputs`);
  const status = document.getElementById(`${prefix}-status`);
  const next = document.getElementById(`${prefix}-next`);

  hint.textContent = config.hint;
  scrambled.textContent = createScramble(answer);
  inputs.innerHTML = "";
  status.textContent = "";
  next.classList.add("hidden");

  [...answer].forEach((_, index) => {
    const input = document.createElement("input");
    input.className = "word-letter";
    input.maxLength = 1;
    input.autocomplete = "off";
    input.setAttribute("aria-label", `Letter ${index + 1}`);
    input.addEventListener("input", () => {
      input.value = input.value.replace(/[^a-z]/gi, "").toUpperCase();
      if (input.value && inputs.children[index + 1]) inputs.children[index + 1].focus();
      check();
    });
    inputs.appendChild(input);
  });

  function check() {
    const value = [...inputs.querySelectorAll("input")].map(i => i.value).join("");
    if (value.length < answer.length) return;
    if (value === answer) {
      status.textContent = "Your scribble skills paying off ✨";
      next.classList.remove("hidden");
    } else {
      status.textContent = "Almost... try again.";
    }
  }
}

function createScramble(answer) {
  let result = answer;
  let attempts = 0;
  while (result === answer && attempts < 20) {
    result = shuffle([...answer]).join("");
    attempts++;
  }
  return result;
}

function initWordPuzzle() {
  buildWordPuzzle(birthdayConfig.wordPuzzle, "word");
}

function initWordPuzzle2() {
  buildWordPuzzle(birthdayConfig.wordPuzzle2, "word2");
}
