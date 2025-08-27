let character_img = browser.extension.getURL("assets/img/stick_character.png")
let namesDb = {}

// get character to spawn in the middle of the users viewable screen or last trackable mouse position
// add gravity to character
// on mousedonw have character follow/br dragged by mouse
// connect and use extensions api to have character be saved (to local storage?)
// give character ability to interact with user via dialogue
// give character ability to interact with and comment on certain dom elements. interact should definitely be a setting
// should be able to upload and use custom character (through json? and image and gif files? 
// preferably all from one json file) via local storage and/or http/s
// after undecided time period perform gif and/or move around manually. also setting
// everything should technically be a setting. togglable or more
// anyways great ambition, can i do it. tools should be good

class character {
    constructor(name, img = character_img) {
        if (!Object.hasOwn(namesDb, name)) {namesDb[name] = 0}
        else {
            namesDb[name] += 1
            name = name + namesDb[name]
        }
        this.img = img
        this.name = name
        this.body = generate_character(this)
        this.body.addEventListener("mousedown", handle_character_click)
    }
}

function generate_character(character) {
    let c = document.createElement("img")
    c.src = character.img
    c.style.position = "absolute"
    c.style.left = window.innerWidth / 2 + "px"
    c.style.top = window.innerHeight / 2 + "px"
    c.style.border = "white solid"
    c.style.borderRadius = "20px"
    c.className = "web_character_extension_character"
    c.id = character.name
    document.querySelector("body").appendChild(c)
    return c
}

function handle_character_click(e) {
    console.log(e)
}

let start = () => {
    new character("jeremy")
    new character("russel")
    new character("jeremy")
    new character("Russel")
    console.log(namesDb)
}
start()