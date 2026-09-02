let fireworksAnimation = null;

function startFireworks() {
  const canvas = document.getElementById("fireworks");
  const ctx = canvas.getContext("2d");
  let rockets = [];
  let particles = [];
  let running = true;

  function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener("resize", resize, { once: true });

  function launch() {
    rockets.push({ x: Math.random() * canvas.width, y: canvas.height + 10, targetY: canvas.height * (.2 + Math.random() * .4), speed: 6 + Math.random() * 3 });
  }

  function burst(x, y) {
    const count = 70;
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 1.5 + Math.random() * 5;
      particles.push({ x, y, vx: Math.cos(angle) * speed, vy: Math.sin(angle) * speed, life: 1, decay: .012 + Math.random() * .012, size: 1 + Math.random() * 2.5 });
    }
  }

  function draw() {
    if (!running) return;
    ctx.fillStyle = "rgba(7,7,12,.16)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    if (Math.random() < .035) launch();

    rockets.forEach((r, i) => {
      r.y -= r.speed;
      ctx.beginPath();
      ctx.arc(r.x, r.y, 2, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(255,255,255,.9)";
      ctx.fill();
      if (r.y <= r.targetY) {
        burst(r.x, r.y);
        rockets.splice(i, 1);
      }
    });

    particles.forEach((p, i) => {
      p.x += p.vx;
      p.y += p.vy;
      p.vy += .035;
      p.vx *= .985;
      p.vy *= .985;
      p.life -= p.decay;
      ctx.globalAlpha = Math.max(0, p.life);
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fillStyle = i % 3 === 0 ? "#ffd166" : i % 3 === 1 ? "#f9a8d4" : "#d8b4fe";
      ctx.fill();
      if (p.life <= 0) particles.splice(i, 1);
    });
    ctx.globalAlpha = 1;
    fireworksAnimation = requestAnimationFrame(draw);
  }

  ctx.fillStyle = "rgba(7,7,12,1)";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  for (let i = 0; i < 3; i++) setTimeout(launch, i * 350);
  draw();
}
