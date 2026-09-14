import {
  STORY_EVENTS,
} from "./StoryManager.js";


// ====================================
// ENDING UI
// ====================================

export function createEndingUI(story) {

  const overlay = document.createElement("div");
  overlay.id = "ending-overlay";
  overlay.innerHTML = `
    <div class="ending-content">
      <p class="ending-kicker">SILENT WARD</p>
      <h1>ROOM 417</h1>
      <p>You leave through the emergency stairwell. Behind you, a fluorescent light hums once — from a floor that no longer exists.</p>
      <button type="button">PLAY AGAIN</button>
    </div>
  `;

  document.body.appendChild(overlay);

  overlay.querySelector("button").addEventListener("click", () => {
    window.location.reload();
  });

  story.on(STORY_EVENTS.ENDING, () => {
    document.exitPointerLock?.();
    overlay.classList.add("visible");
  });

}
