// get character to spawn in the middle of the users viewable screen or last trackable mouse position
// connect and use extensions api to have character be saved (to local storage?)
// give character ability to interact with user via dialogue
// give character ability to interact with and comment on certain dom elements. interact should definitely be a setting
// should be able to upload and use custom character (through json? and image and gif files?
// preferably all from one json file) via local storage and/or http/s
// after undecided time period perform gif and/or move around manually. also setting
// everything should technically be a setting. togglable or more
// anyways great ambition, can i do it. tools should be good
// asynchronous scrolling doesn't work well. snap effect after end scrolling. i don't know how to fix that without sticky positioning
// flip character vertiaclly if grabbed below a certain point. dangling by the legs/feet if you will
// need rebound with that velocity against walls too
// character continues to slide across bottom of screen after chraracter_velocity(). gravity and character_velocity intervals both switch off. probably

let character_img = browser.extension.getURL("assets/img/stick_character.png");
let namesDb = {};
let domIdClassPair = {};

class character {
  constructor(name, img = character_img) {
    if (!Object.hasOwn(namesDb, name)) {
      namesDb[name] = 0;
    } else {
      namesDb[name] += 1;
      name = name + namesDb[name];
    }
    domIdClassPair[name] = this;
    this.img = img;
    this.name = name;
    this.gravity = false;
    this.body = generate_character(this);
    this.saveScrollY = window.scrollY;
    this.saveScrollX = window.scrollX;
    this.body.addEventListener("mousedown", handle_character_drag);
    window.addEventListener("scroll", () => {
      this.body.style.top =
        parseFloat(this.body.style.top) +
        (window.scrollY - this.saveScrollY) +
        "px";
      this.body.style.left =
        parseFloat(this.body.style.left) +
        (window.scrollX - this.saveScrollX) +
        "px";
      this.saveScrollY = window.scrollY;
      this.saveScrollX = window.scrollX;
    });
  }
}

function generate_character(character) {
  let c = document.createElement("img");
  c.src = character.img;
  c.style.position = "absolute";
  c.style.left = window.innerWidth / 2 + "px";
  c.style.top = window.innerHeight / 2 + "px";
  c.style.border = "white solid";
  c.style.borderRadius = "20px";
  c.className = "web_character_extension_character";
  c.id = character.name;
  c.ondragstart = () => {
    return false;
  };
  giveGravity(c);
  document.querySelector("body").appendChild(c);
  return c;
}

function handle_character_drag(e) {
  let velocityX = e.clientX;
  let velocityY = e.clientY;
  let mouseMoveEvent = e;
  let setVelocity = setInterval(() => {
    velocityX = mouseMoveEvent.clientX;
    velocityY = mouseMoveEvent.clientY;
  }, 500);
  function mouseMove(de) {
    e.target.style.top = de.clientY - e.target.clientHeight / 2 + "px";
    e.target.style.left = de.clientX - e.target.clientWidth / 2 + "px";
    mouseMoveEvent = de;
  }
  function mouseUp() {
    window.removeEventListener("mousemove", mouseMove);
    window.removeEventListener("mouseup", mouseUp);
    clearInterval(setVelocity);
    giveGravity(e.target);
    character_velocity(
      e.target,
      [velocityX, velocityY],
      [mouseMoveEvent.clientX, mouseMoveEvent.clientY]
    );
  }
  domIdClassPair[e.target.id].gravity = false;
  window.addEventListener("mousemove", mouseMove);
  window.addEventListener("mouseup", mouseUp);
}

function character_velocity(c, preV, curV) {
  let distanceX = curV[0] - preV[0];
  let distanceY = curV[1] - preV[1];
  let movementX = setInterval(() => {
    if (
      Math.abs(distanceX) <= 0 ||
      parseFloat(c.style.left) >= window.innerWidth - c.clientWidth ||
      parseFloat(c.style.left) <= 0
    ) {
      if (parseFloat(c.style.left) > window.innerWidth - c.clientWidth) {
        c.style.left = window.innerWidth - c.clientWidth + "px"
      } else if (parseFloat(c.style.left) < 0) {
        c.style.left = 0 + "px"
      }
      clearInterval(movementX);
      return;
    }
    c.style.left = parseFloat(c.style.left) + distanceX / 10 + "px";
    distanceX >= 0 ? (distanceX -= 10) : (distanceX += 10);
  }, 16);
  let movementY = setInterval(() => {
    if (
      Math.abs(distanceY) <= 0 ||
      parseFloat(c.style.top) >= window.innerHeight - c.clientHeight ||
      parseFloat(c.style.top) <= 0
    ) {
      if (parseFloat(c.style.top) > window.innerHeight - c.clientHeight) {
        c.style.top = window.innerHeight - c.clientHeight + "px"
      } else if (parseFloat(c.style.top) < 0) {
        c.style.top = 0 + "px"
      }
      clearInterval(movementY);
      return;
    }
    c.style.top = parseFloat(c.style.top) + distanceY / 10 + "px";
    distanceY >= 0 ? (distanceY -= 10) : (distanceY += 10);
  }, 16);
}

function characterGravity(c, g) {
  if (
    parseFloat(c.style.top) < window.innerHeight - c.clientHeight &&
    domIdClassPair[c.id].gravity
  ) {
    c.style.top = parseFloat(c.style.top) + 3.6 + "px";
  } else {
    clearInterval(g);
    domIdClassPair[c.id].gravity = false;
  }
}

function giveGravity(c) {
  if (domIdClassPair[c.id].gravity) return;
  domIdClassPair[c.id].gravity = true;
  var gravity = setInterval(() => {
    characterGravity(c, gravity);
  }, 16);
}

let start = () => {
  new character("jeremy");
};
start();
