export function createHealthUI(player) {

  const hud = document.createElement("div");
  hud.id = "player-health";
  hud.innerHTML = `
    <span>VITALS</span>
    <div class="health-bar">
      <div class="health-fill"></div>
    </div>
  `;

  document.body.appendChild(hud);

  const fill = hud.querySelector(".health-fill");

  function render(health, maxHealth) {
    const percent = Math.max(0, (health / maxHealth) * 100);
    fill.style.width = `${percent}%`;
    hud.classList.toggle("critical", percent <= 25);
    hud.classList.toggle("hurt", percent < 100 && percent > 25);
  }

  player.onHealthChange = (health, maxHealth) => {
    render(health, maxHealth);
    hud.classList.remove("hit");
    void hud.offsetWidth;
    hud.classList.add("hit");
  };

  render(player.health, player.maxHealth);

  return hud;

}


export function createDeathUI(player, interactionManager) {

  const overlay = document.createElement("div");
  overlay.id = "death-overlay";
  overlay.innerHTML = `
    <div class="ending-content">
      <p class="ending-kicker">SILENT WARD</p>
      <h1>YOU DIED</h1>
      <p>The thing that lives in Room 417 reached you. The ward keeps the rest.</p>
      <button type="button">TRY AGAIN</button>
    </div>
  `;

  document.body.appendChild(overlay);

  overlay.querySelector("button").addEventListener("click", () => {
    window.location.reload();
  });

  player.onDeath = () => {
    interactionManager?.setBlocked(true);
    document.exitPointerLock?.();
    overlay.classList.add("visible");
  };

  return overlay;

}
