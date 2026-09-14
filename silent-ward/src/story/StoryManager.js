// ====================================
// STORY MANAGER
// ====================================

export const STORY_EVENTS = {
  WARD_C_UNLOCKED: "WARD_C_UNLOCKED",
  ACCESS_CARD_FOUND: "ACCESS_CARD_FOUND",
  CORRIDOR_ENTERED: "CORRIDOR_ENTERED",
  GHOST_FIRST_SIGHTING: "GHOST_FIRST_SIGHTING",
  FLOOR_PLAN_DISCOVERY: "FLOOR_PLAN_DISCOVERY",
  ROOM_417_ENTERED: "ROOM_417_ENTERED",
  PATIENT_TRUTH_FOUND: "PATIENT_TRUTH_FOUND",
  ENDING: "ENDING",
};


export class StoryManager {

  constructor({
    inventory,
    player,
  }) {

    this.inventory = inventory;
    this.player = player;
    this.events = new Set();
    this.listeners = new Map();

  }


  on(event, callback) {

    if (!this.listeners.has(event)) {
      this.listeners.set(event, []);
    }

    this.listeners.get(event).push(callback);

  }


  trigger(event) {

    if (this.events.has(event)) {
      return;
    }

    this.events.add(event);

    const callbacks =
      this.listeners.get(event) || [];

    callbacks.forEach((callback) => callback());

  }


  has(event) {
    return this.events.has(event);
  }


  update() {

    if (
      this.inventory.hasItem("ward_c_access_card")
    ) {
      this.trigger(STORY_EVENTS.ACCESS_CARD_FOUND);
    }


    if (this.player.position.z < -5.5) {
      this.trigger(STORY_EVENTS.WARD_C_UNLOCKED);
    }


    if (this.player.position.z < -13.5) {
      this.trigger(STORY_EVENTS.CORRIDOR_ENTERED);
    }


    if (this.player.position.z < -31.5) {
      this.trigger(STORY_EVENTS.ROOM_417_ENTERED);
    }

  }

}
