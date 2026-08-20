const PASSWORD = "Rheychelle";

const lockScreen = document.getElementById("lockScreen");
const site = document.getElementById("site");
const passwordInput = document.getElementById("passwordInput");
const enterBtn = document.getElementById("enterBtn");
const error = document.getElementById("error");
const readBtn = document.getElementById("readBtn");
const musicBtn = document.getElementById("musicBtn");
const musicStatus = document.getElementById("musicStatus");

let audioCtx;
let master;
let musicTimer;
let playing = false;
let step = 0;

const melody = [
  261.63, 329.63, 392.00, 329.63,
  293.66, 349.23, 440.00, 349.23
];

function startMusic() {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    master = audioCtx.createGain();
    master.gain.value = 0.055;
    master.connect(audioCtx.destination);
  }

  audioCtx.resume();
  if (playing) return;

  playing = true;
  musicStatus.textContent = "Soundtrack playing ♫";
  musicBtn.textContent = "Ⅱ Pause";

  const playNote = () => {
    if (!playing) return;

    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();

    osc.type = "sine";
    osc.frequency.value = melody[step % melody.length];

    gain.gain.setValueAtTime(0.0001, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.35, audioCtx.currentTime + 0.025);
    gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + 0.55);

    osc.connect(gain);
    gain.connect(master);
    osc.start();
    osc.stop(audioCtx.currentTime + 0.58);

    step++;
  };

  playNote();
  musicTimer = setInterval(playNote, 700);
}

function stopMusic() {
  playing = false;
  clearInterval(musicTimer);
  musicStatus.textContent = "Soundtrack paused.";
  musicBtn.textContent = "♫ Tap to Play";
}

function unlock() {
  if (passwordInput.value === PASSWORD) {
    lockScreen.classList.add("hidden");
    site.classList.remove("hidden");
    window.scrollTo(0, 0);
  } else {
    error.textContent = "Wrong password. Try again.";
    passwordInput.select();
  }
}

enterBtn.addEventListener("click", unlock);

passwordInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") unlock();
});

readBtn.addEventListener("click", () => {
  document.getElementById("message").scrollIntoView({ behavior: "smooth" });
});

musicBtn.addEventListener("click", () => {
  if (playing) stopMusic();
  else startMusic();
});
