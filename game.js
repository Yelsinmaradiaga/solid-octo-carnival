const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

const W = canvas.width;
const H = canvas.height;
const groundY = H - 90;

const game = {
  running: true,
  score: 0,
  best: 0,
  speed: 6,
  gravity: 0.55,
  spawnClock: 0,
  spawnEvery: 95,
  frame: 0,
};

const player = {
  x: 150,
  y: groundY - 56,
  w: 86,
  h: 56,
  vy: 0,
  onGround: true,
  wheelSpin: 0,
};

const obstacles = [];
const roadLines = Array.from({ length: 22 }, (_, i) => i * 60);
const skylineA = Array.from({ length: 20 }, () => ({
  x: Math.random() * W,
  w: 40 + Math.random() * 42,
  h: 90 + Math.random() * 150,
}));
const skylineB = Array.from({ length: 18 }, () => ({
  x: Math.random() * W,
  w: 56 + Math.random() * 44,
  h: 150 + Math.random() * 200,
}));

function jump() {
  if (!game.running) return;
  if (!player.onGround) return;
  player.vy = -12.3;
  player.onGround = false;
}

window.addEventListener("keydown", (e) => {
  if (e.code === "Space" || e.code === "ArrowUp") {
    e.preventDefault();
    jump();
  }
  if ((e.key === "r" || e.key === "R") && !game.running) {
    reset();
  }
});

canvas.addEventListener("pointerdown", jump);

function spawnObstacle() {
  const truck = Math.random() < 0.35;
  const w = truck ? 110 : 70;
  const h = truck ? 62 : 48;
  obstacles.push({
    x: W + 30,
    y: groundY - h,
    w,
    h,
    color: truck ? "#ff9d2f" : "#ff4f81",
    truck,
  });
}

function update() {
  if (!game.running) return;

  game.frame += 1;
  game.score += 0.1;

  if (game.frame % 450 === 0) {
    game.speed += 0.35;
    game.spawnEvery = Math.max(60, game.spawnEvery - 3);
  }

  player.vy += game.gravity;
  player.y += player.vy;
  player.wheelSpin += game.speed * 0.08;

  if (player.y >= groundY - player.h) {
    player.y = groundY - player.h;
    player.vy = 0;
    player.onGround = true;
  }

  game.spawnClock++;
  if (game.spawnClock >= game.spawnEvery) {
    spawnObstacle();
    game.spawnClock = 0;
  }

  for (let i = obstacles.length - 1; i >= 0; i--) {
    const ob = obstacles[i];
    ob.x -= game.speed;

    if (
      player.x < ob.x + ob.w - 14 &&
      player.x + player.w - 12 > ob.x &&
      player.y < ob.y + ob.h - 8 &&
      player.y + player.h > ob.y
    ) {
      game.running = false;
      game.best = Math.max(game.best, Math.floor(game.score));
    }

    if (ob.x + ob.w < -20) obstacles.splice(i, 1);
  }

  for (let i = 0; i < roadLines.length; i++) {
    roadLines[i] -= game.speed;
    if (roadLines[i] < -40) roadLines[i] = W + Math.random() * 80;
  }

  for (const b of skylineA) {
    b.x -= game.speed * 0.18;
    if (b.x + b.w < 0) b.x = W + Math.random() * 150;
  }

  for (const b of skylineB) {
    b.x -= game.speed * 0.32;
    if (b.x + b.w < 0) b.x = W + Math.random() * 120;
  }
}

function drawSky() {
  const g = ctx.createLinearGradient(0, 0, 0, H);
  g.addColorStop(0, "#2f5ea8");
  g.addColorStop(0.55, "#345097");
  g.addColorStop(1, "#1f2a58");
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, W, H);

  ctx.fillStyle = "#f6f0b7";
  ctx.beginPath();
  ctx.arc(760, 85, 42, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = "#1f2f55";
  for (const b of skylineA) {
    ctx.fillRect(b.x, groundY - b.h - 50, b.w, b.h);
  }

  ctx.fillStyle = "#2a3f73";
  for (const b of skylineB) {
    ctx.fillRect(b.x, groundY - b.h - 50, b.w, b.h);
    ctx.fillStyle = "#90a7d8";
    for (let wy = groundY - b.h - 36; wy < groundY - 62; wy += 16) {
      for (let wx = b.x + 8; wx < b.x + b.w - 8; wx += 15) {
        if ((wx + wy + game.frame) % 7 < 3) ctx.fillRect(wx, wy, 5, 6);
      }
    }
    ctx.fillStyle = "#2a3f73";
  }

  // Empire State Building
  ctx.fillStyle = "#314776";
  ctx.fillRect(480, groundY - 270, 50, 220);
  ctx.fillRect(492, groundY - 315, 26, 45);
  ctx.fillRect(501, groundY - 355, 8, 40);
}

function drawRoad() {
  ctx.fillStyle = "#262b35";
  ctx.fillRect(0, groundY, W, H - groundY);

  ctx.fillStyle = "#f3f4f6";
  for (const x of roadLines) ctx.fillRect(x, groundY + 30, 36, 5);

  ctx.fillStyle = "#4d535f";
  ctx.fillRect(0, groundY - 14, W, 14);
}

function drawWheel(cx, cy, r) {
  ctx.save();
  ctx.translate(cx, cy);
  ctx.rotate(player.wheelSpin);
  ctx.fillStyle = "#111";
  ctx.beginPath();
  ctx.arc(0, 0, r, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = "#dbe7ff";
  ctx.lineWidth = 2;
  for (let i = 0; i < 6; i++) {
    ctx.rotate(Math.PI / 3);
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(r - 2, 0);
    ctx.stroke();
  }
  ctx.restore();
}

function drawPlayer() {
  const x = player.x;
  const y = player.y;

  ctx.fillStyle = "#ff314f";
  ctx.beginPath();
  ctx.roundRect(x + 8, y + 12, 64, 28, 8);
  ctx.fill();

  ctx.fillStyle = "#ffce40";
  ctx.fillRect(x + 22, y + 4, 30, 12);

  ctx.fillStyle = "#9ad8ff";
  ctx.beginPath();
  ctx.roundRect(x + 44, y + 16, 22, 12, 4);
  ctx.fill();

  drawWheel(x + 25, y + 45, 11);
  drawWheel(x + 62, y + 45, 11);
}

function drawObstacle(ob) {
  ctx.fillStyle = ob.color;
  ctx.beginPath();
  ctx.roundRect(ob.x, ob.y + 8, ob.w, ob.h - 8, 8);
  ctx.fill();

  ctx.fillStyle = "#f8fbff";
  ctx.fillRect(ob.x + ob.w * 0.12, ob.y + 14, ob.w * 0.24, 10);

  ctx.fillStyle = "#111";
  ctx.beginPath();
  ctx.arc(ob.x + ob.w * 0.2, ob.y + ob.h, 9, Math.PI, 0);
  ctx.arc(ob.x + ob.w * 0.8, ob.y + ob.h, 9, Math.PI, 0);
  ctx.fill();

  if (ob.truck) {
    ctx.fillStyle = "#fdf7c0";
    ctx.fillRect(ob.x + ob.w * 0.55, ob.y + 24, ob.w * 0.3, 9);
  }
}

function drawHUD() {
  ctx.fillStyle = "rgba(0,0,0,0.28)";
  ctx.fillRect(14, 12, 200, 62);
  ctx.fillStyle = "#fff";
  ctx.font = "bold 20px Segoe UI";
  ctx.fillText(`Puntos: ${Math.floor(game.score)}`, 24, 38);
  ctx.font = "16px Segoe UI";
  ctx.fillText(`Récord: ${game.best}`, 24, 62);
}

function drawGameOver() {
  if (game.running) return;
  ctx.fillStyle = "rgba(10,10,20,0.63)";
  ctx.fillRect(0, 0, W, H);
  ctx.fillStyle = "#fff";
  ctx.textAlign = "center";
  ctx.font = "bold 48px Segoe UI";
  ctx.fillText("¡Choque!", W / 2, H / 2 - 35);
  ctx.font = "22px Segoe UI";
  ctx.fillText("Pulsa R para reiniciar", W / 2, H / 2 + 8);
  ctx.fillText("o toca/click para volver a intentar", W / 2, H / 2 + 42);
  ctx.textAlign = "start";
}

canvas.addEventListener("click", () => {
  if (!game.running) reset();
});

function reset() {
  game.running = true;
  game.score = 0;
  game.speed = 6;
  game.spawnClock = 0;
  game.spawnEvery = 95;
  game.frame = 0;
  obstacles.length = 0;
  player.y = groundY - player.h;
  player.vy = 0;
  player.onGround = true;
}

function loop() {
  update();
  drawSky();
  drawRoad();
  drawPlayer();
  for (const ob of obstacles) drawObstacle(ob);
  drawHUD();
  drawGameOver();
  requestAnimationFrame(loop);
}

loop();
