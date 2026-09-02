function initPuzzle() {
  const puzzle = document.getElementById("puzzle");
  const status = document.getElementById("puzzle-status");
  const next = document.getElementById("puzzle-next");
  const total = 16;
  const correct = Array.from({ length: total }, (_, i) => i);
  let current = shuffle([...correct]);
  let selected = null;
  let solved = false;

  function render() {
    puzzle.innerHTML = "";
    current.forEach((piece, index) => {
      const tile = document.createElement("button");
      tile.className = "tile";
      const col = piece % 4;
      const row = Math.floor(piece / 4);
      tile.style.backgroundPosition = `${(col / 3) * 100}% ${(row / 3) * 100}%`;

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
      status.textContent = "Memory restored! ❤️";
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

function initWordPuzzle() {
  const answer = birthdayConfig.wordPuzzle.answer.toUpperCase();
  document.getElementById("word-hint").textContent = birthdayConfig.wordPuzzle.hint;
  document.getElementById("scrambled-word").textContent = shuffle([...answer]).join("");

  const inputs = document.getElementById("word-inputs");
  const status = document.getElementById("word-status");
  const next = document.getElementById("word-next");

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
      status.textContent = "That's it! ✨";
      next.classList.remove("hidden");
    } else {
      status.textContent = "Almost... try again.";
    }
  }
}

function initEmojiPuzzle() {
  const data = birthdayConfig.emojiPuzzle;
  document.getElementById("emoji-puzzle").textContent = data.emojis;
  const options = document.getElementById("emoji-options");
  const status = document.getElementById("emoji-status");
  const next = document.getElementById("emoji-next");

  data.options.forEach(option => {
    const button = document.createElement("button");
    button.className = "emoji-option";
    button.textContent = option;
    button.addEventListener("click", () => {
      if (option === data.answer) {
        status.textContent = "Correct! You know me too well. ❤️";
        next.classList.remove("hidden");
      } else {
        status.textContent = "Nope 😄 Try another one.";
      }
    });
    options.appendChild(button);
  });
}
