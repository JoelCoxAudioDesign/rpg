//Main Player Stats
let xp = 0
let health = 100
let gold = 50
let currentWeaponIndex = 0
let fighting
let inventory = ["stick"]

//Monsters array containing the monster objects used to fill in variables during actions.
let monsterHealth
const monsters = [
    {
        name: "Slime",
        level: 2,
        health: 15,
    },

    {
        name: "Fanged Beast",
        level: 8,
        health: 60,
    },

    {
        name: "Dragon",
        level: 20,
        health: 300,
    }
]

//buttons
const button1 = document.querySelector("#button1")
const button2 = document.querySelector("#button2")
const button3 = document.querySelector("#button3")

//Stat Variables for updating
const text = document.querySelector("#text")
const xpText = document.querySelector("#xpText")
const healthText = document.querySelector("#healthText")
const goldText = document.querySelector("#goldText")
const monsterStats = document.querySelector("#monsterStats")
const monsterName = document.querySelector("#monsterName")
const monsterHealthText = document.querySelector("#monsterHealth")

const weapons = [
    { name: 'stick', power: 5 },
    { name: 'dagger', power: 30 },
    { name: 'claw hammer', power: 50 },
    { name: 'sword', power: 100 }
]
//Locations array allows us to move between "states" of the game. Each object contains the name of the state, the buttons the player will interact with, what the function calls for each button, as well as text to explain to the player.
const locations = [
    {
        name: "Town Square",
        "button text": ["Go to Store", "Go to Cave", "Fight Dragon"],
        "button functions": [goStore, goCave, fightDragon],
        text: "You are standing in the town square. You see a sign that says \"Store\"."
    },

    {
        name: "Store",
        "button text": ["Buy 10 Health (10 Gold)", "Buy Weapon (30 Gold)", "Go to Town Square"],
        "button functions": [buyHealth, buyWeapon, goTown],
        text: "You have entered the store"
    },

    {
        name: "Cave",
        "button text": ["Fight Slime", "Fight Fanged Beast", "Go to Town Square"],
        "button functions": [fightSlime, fightBeast, goTown],
        text: "You enter the cave and see a slime and a fanged beast."
    },
    
    {
        name: "Fight",
        "button text": ["Attack", "Dodge", "Run"],
        "button functions": [attack, dodge, goTown],
        text: "You are fighting a monster."
    },

    {
        name: "Kill Monster",
        "button text": ["Go to Town Square", "Go to Town Square", "Go to Town Square"],
        "button functions": [goTown, goTown, easterEgg],
        text: 'The monster screams "Arg!" as it dies. You gain xp and find gold'
    },
    
    {
        name: "Lose",
        "button text": ["Replay?", "Replay?", "Replay?"],
        "button functions": [restart, restart, restart],
        text: 'You died. &#x2620;'
    },
    
    {
        name: "Win",
        "button text": ["Replay?", "Replay?", "Replay?"],
        "button functions": [restart, restart, restart],
        text: 'You defeated the dragon! You Won The Game! &#x1F389;'
    },

    {
        name: "Easter Egg",
        "button text": ["2", "8", "Go to Town Square?"],
        "button functions": [pickTwo, pickEight, goTown],
        text: "You find a secret game. Pick a number above. Ten numbers will be randomly chosen between 0 and 10. If the number you choose matches one of the random numbers, you win!"
    }
]

//The update function allows us to centralise the changing of state. For each function call, the update function will change the main text, button titles, and the button functions.
function update(locations){
    text.innerHTML = locations.text
    button1.innerText = locations["button text"][0]
    button2.innerText = locations["button text"][1]
    button3.innerText = locations["button text"][2]
    button1.onclick = locations["button functions"][0]
    button2.onclick = locations["button functions"][1]
    button3.onclick = locations["button functions"][2]
}

//Primary functions for the game - these each contain an update call for their associated locations index.
function goTown(){
    update(locations[0])
}

function goStore() {
    update(locations[1])
}

function goCave() {
    update(locations[2])
}

function goFight(){
    update(locations[3])
    monsterHealth = monsters[fighting].health
    monsterStats.style.display = 'block'
}

//Store functions which allow the player to increase health, add an item to their inventory array, or sell an item which adds gives them extra gold.
function buyHealth(){
    if(gold >= 10){
        gold -= 10
        health += 10
        healthText.innerText = health
        goldText.innerText = gold
    } else {
        text.innerText = "You do not have enough gold to buy health."
    }
}

function buyWeapon(){
    if(currentWeaponIndex < weapons.length -1) {
        if(gold >= 30) {
            gold -= 30
            currentWeaponIndex++
            goldText.innerText = gold
            let newWeapon = weapons[currentWeaponIndex].name
            text.innerText = "You now have a " + newWeapon + "."
            inventory.push(newWeapon)
            text.innerText += " In your inventory you have: " + inventory
        } else{
            text.innerText = "You do not have enough gold to buy a new weapon."
        }
    } else {
        button2.innerText = "Sell Weapon"
        button2.onclick = sellWeapon
        text.innerText = "You already have the most powerful weapon!"
    }
}

function sellWeapon(){
    if(inventory.length > 1){
        gold += 15
        goldText.innerText = gold
        let currentWeapon = inventory.shift()
        text.innerText = "You sold a " + currentWeapon + "."
        text.innerText += " In your inventory you have: " + inventory
    } else {
        text.innerText = "Don't sell your only weapon!"
    }
}

//These fight functions are available when the player enters the cave. Each sets the fighting index to their respective value the calls the goFight function.
function fightSlime(){
    fighting = 0
    goFight();
}

function fightBeast(){
    fighting = 1
    goFight()
}

function fightDragon(){
    fighting = 2
    goFight()
}

//The attack function contains all logic for interacting with the monsters. Each element is populated with the respective monsters details. There is randomisation added in whether an attack hits or misses, and whether the weapon breaks or not.
function attack(){
    text.innerText = "The " + monsters[fighting].name + "attacks."
    text.innerText = " You attack with your " + weapons[currentWeaponIndex].name + "."
    health -= getMonsterAttackValue(monsters[fighting].level);
    if(isMonsterHit){
    monsterHealth -= weapons[currentWeaponIndex].power + Math.floor(Math.random() * xp)
    } else {
        text.innerText = " You missed."
    }
    healthText.innerText = health
    monsterHealthText.innerText = monsterHealth
    if (health <= 0){
        lose()
    } else if (monsterHealth <= 0) {
        if(fighting === 2){
            winGame()
        } else {
            defeatMonster()
        }
    }
    if(Math.random() <= .1 && inventory.length !== 1) {
        text.innerText += " Your " + inventory.pop + " breaks."
        currentWeaponIndex--
    }
}

//simple dodge function to avoid damage.
function dodge(){
    text.innerText = "You dodge the attack from the " + monsters[fighting].name
}

//this function allows the damage dealt by the monster to be a little more randomised instead of being a consisten amount every attack.
function getMonsterAttackValue(level){
    const hit = (level * 5) - (Math.floor(Math.random() * xp))
    return hit > 0 ? hit : 0
}

//Monster death logic
function defeatMonster(){
    gold += Math.floor(monsters[fighting].level * 6.7)
    xp += monsters[fighting].level;
    goldText.innerText = gold
    xpText.innerText = xp
    update(locations[4])
}

//lose logic taking you back to the start
function lose(){
    update(locations[5])
}

//Win logic
function winGame(){
    update(locations[6])
}

//Restart logic is available after lose logic happens. Resets players stats and inventory.
function restart(){
    xp = 0
    health = 100
    gold = 50
    currentWeaponIndex = 0
    inventory = ["stick"]
    xp.innerText = xp
    gold.innerText = gold
    health.innerText = health
    goTown()
}

//This is a simple easter egg for the player added onto one of the buttons after defeating a monster. A random number array is generated and the player chooses a number. If correct they win gold, if incorrect they lose health.
function easterEgg(){
    update(locations[7])
}

function pickTwo() {
    pick(2)
}

function pickEight(){
    pick(8)
}

function pick(guess){
    const numbers = [];
  while (numbers.length < 10) {
    numbers.push(Math.floor(Math.random() * 11));
  }
  text.innerText = "You picked " + guess + ". Here are the random numbers:\n";
  for (let i = 0; i < 10; i++) {
    text.innerText += numbers[i] + "\n";
  }
  if (numbers.includes(guess)) {
    text.innerText += "Right! You win 20 gold!";
    gold += 20;
    goldText.innerText = gold;
  } else {
    text.innerText += "Wrong! You lose 10 health!";
    health -= 10;
    healthText.innerText = health;
    if (health <= 0) {
      lose();
    }
  }
}



//initialise buttons
button1.onclick = goStore
button2.onclick = goCave
button3.onclick = fightDragon