const noBtn = document.getElementById("noBtn");
const yesBtn = document.getElementById("yesBtn");
const screen1 = document.getElementById("screen1");
const screen2 = document.getElementById("screen2");
const rain = document.getElementById("rain");

// No button runs away
noBtn.addEventListener("mouseover", () => {
  const x = Math.random() * 220;  // within card width-ish
  const y = Math.random() * 20;
  noBtn.style.left = `${x}px`;
  noBtn.style.top = `${y}px`;
});

noBtn.addEventListener("touchstart", (e) => {
  e.preventDefault();
  const x = Math.random() * 220;
  const y = Math.random() * 20;
  noBtn.style.left = `${x}px`;
  noBtn.style.top = `${y}px`;
});

// Yes shows bouquet + starts rose/heart rain
yesBtn.addEventListener("click", () => {
  screen1.classList.add("hidden");
  screen2.classList.remove("hidden");
  startRain();
});

function startRain(){
  const symbols = ["🌹","❤️","🌸","💗"];
  let count = 0;

  const timer = setInterval(() => {
    const el = document.createElement("div");
    el.className = "petal";
    el.textContent = symbols[Math.floor(Math.random()*symbols.length)];
    el.style.left = Math.random() * 100 + "%";
    el.style.animationDuration = (1.8 + Math.random()*1.6) + "s";
    rain.appendChild(el);

    setTimeout(() => el.remove(), 4000);
    count++;
    if(count > 70) clearInterval(timer); // stops after a nice burst
  }, 70);
}