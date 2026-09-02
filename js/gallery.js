function initGallery() {
  const gallery = document.getElementById("gallery");
  gallery.innerHTML = "";

  birthdayConfig.memories.forEach((memory, index) => {
    const card = document.createElement("article");
    card.className = "memory-card";
    card.style.setProperty("--rotation", `${index % 2 === 0 ? -1.5 : 1.5}deg`);

    const img = document.createElement("img");
    img.src = memory.image;
    img.alt = `Memory ${index + 1}`;
    img.loading = "lazy";

    const caption = document.createElement("p");
    caption.textContent = memory.caption || `Memory ${index + 1}`;

    card.append(img, caption);
    gallery.appendChild(card);
  });
}

function launchFinalParticles() {
  const container = document.getElementById("final-particles");
  container.innerHTML = "";
  for (let i = 0; i < 70; i++) {
    const particle = document.createElement("span");
    particle.className = "final-particle";
    particle.style.left = `${Math.random() * 100}%`;
    particle.style.top = `${50 + Math.random() * 55}%`;
    particle.style.animationDuration = `${4 + Math.random() * 7}s`;
    particle.style.animationDelay = `${Math.random() * 4}s`;
    particle.style.opacity = `${.25 + Math.random() * .65}`;
    container.appendChild(particle);
  }
}
