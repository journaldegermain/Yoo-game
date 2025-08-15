// script.js
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

let age = 6, lecture = 0, maths = 0;

const ageEl = document.getElementById("age");
const lectureEl = document.getElementById("lecture");
const mathsEl = document.getElementById("maths");
const pauseBtn = document.getElementById("pauseBtn");
const etaEl = document.getElementById("eta");
const barEl = document.getElementById("bar");

let paused = false;
const YEAR_MS = 120000;
let yearProg = 0;
let last = performance.now();

pauseBtn.addEventListener("click", () => {
  paused = !paused;
  pauseBtn.textContent = paused ? "Reprendre" : "Pause";
  last = performance.now();
});

function addYear() {
  age++;
  ageEl.textContent = age;
}

function formatETA(ms) {
  const t = Math.max(0, Math.ceil(ms/1000));
  const m = Math.floor(t/60).toString().padStart(2,"0");
  const s = (t%60).toString().padStart(2,"0");
  return `${m}:${s}`;
}

let player = { x: 50, y: 50, size: 20, speed: 4 };
let school = { x: 200, y: 200, size: 50 };

const keys = {};
document.addEventListener("keydown", e => keys[e.key.toLowerCase()] = true);
document.addEventListener("keyup",   e => keys[e.key.toLowerCase()] = false);

function update(dt) {
  if (!paused) {
    yearProg += dt;
    if (yearProg >= YEAR_MS) {
      const n = Math.floor(yearProg / YEAR_MS);
      yearProg = yearProg % YEAR_MS;
      for (let i=0;i<n;i++) addYear();
    }
  }
  barEl.style.width = `${(yearProg / YEAR_MS) * 100}%`;
  etaEl.textContent = formatETA(YEAR_MS - yearProg);

  if (keys["arrowup"] || keys["z"]) player.y -= player.speed;
  if (keys["arrowdown"] || keys["s"]) player.y += player.speed;
  if (keys["arrowleft"] || keys["q"]) player.x -= player.speed;
  if (keys["arrowright"] || keys["d"]) player.x += player.speed;

  player.x = Math.max(0, Math.min(canvas.width - player.size, player.x));
  player.y = Math.max(0, Math.min(canvas.height - player.size, player.y));

  if (
    player.x < school.x + school.size &&
    player.x + player.size > school.x &&
    player.y < school.y + school.size &&
    player.y + player.size > school.y
  ) {
    lecture++; maths++;
    lectureEl.textContent = lecture;
    mathsEl.textContent = maths;
    player.x = 50; player.y = 50;
  }
}

function draw() {
  ctx.clearRect(0,0,canvas.width,canvas.height);

  ctx.fillStyle = "#2e7dd7";
  ctx.fillRect(school.x, school.y, school.size, school.size);

  ctx.fillStyle = "#ffd84d";
  ctx.fillRect(player.x, player.y, player.size, player.size);
}

function loop() {
  const now = performance.now();
  const dt = now - last;
  last = now;
  update(paused ? 0 : dt);
  draw();
  requestAnimationFrame(loop);
}
loop();
