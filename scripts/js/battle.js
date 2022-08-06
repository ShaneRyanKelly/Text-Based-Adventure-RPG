class Enemy{
    constructor(name, enemyClass, hp, mp, rage, sanity, 
                strength, agility, intelligence, stamina, 
                luck, attack, accuracy, defense, evasion, 
                magicDefense){
        this.name = name;
        this.enemyClass = enemyClass;
        this.hp = hp;
        this.mp = mp;
        this.rage = rage;
        this.sanity = sanity;
        this.strength = strength;
        this.agility = agility;
        this.intelligence = intelligence;
        this.stamina = stamina;
        this.luck = luck;
        this.attack = attack;
        this.accuracy = accuracy;
        this.defense = defense;
        this.evasion = evasion;
        this.magicDefense = magicDefense;
    }
}

var enemy;
var player;

export function startBattle(newEnemy, newPlayer){
    player = newPlayer;
    console.log(player);
    console.log(enemy);
    enemy = new Enemy(
        newEnemy["name"],
        newEnemy["class"],
        newEnemy["hp"],
        newEnemy["mp"],
        newEnemy["rage"],
        newEnemy["sanity"],
        newEnemy["strength"],
        newEnemy["agility"],
        newEnemy["intelligence"],
        newEnemy["stamina"],
        newEnemy["luck"],
        newEnemy["attack"],
        newEnemy["accuracy"],
        newEnemy["defense"],
        newEnemy["evasion"],
        newEnemy["magicDefense"],

    );
    $("#battleScreen").append("<p>A fearsome " + enemy.name + " attacks " + player.name + "!</p>");
    $("#battleActions").html(
        '<button id="attackButton">Attack</button><button id="magicButton">Magic</button><button id="itemButton">Item</button><button id="equipButton">Equip</button><button id="defendButton">Defend</button><button id="fleeButton">Flee</button>'
    );
}

function Update(){
    if (+enemy.hp <= 0){
        endBattle();
        return;
    }
    else if (+player.hp <= 0){
        loseBattle();
        return;
    }
}

$("#battleActions").on('click', '#attackButton', function(e){
    console.log(enemy);
    if (+player.agility > +enemy.agility){
        $("#battleScreen").append("<p>" + player["name"] + " attacks dealing " + player["attack"] + " damage</p>");
        enemy.hp = +enemy.hp - +player.attack;
        if (+enemy.hp <= 0){
            endBattle();
            return;
        }
        $("#battleScreen").append("<p>" + enemy["name"] + " attacks dealing " + enemy["attack"] + " damage</p>");
        player.hp = +player.hp - +enemy.attack;
        if (+player.hp <= 0){
            loseBattle();
            return;
        }
    }
    else {
        $("#battleScreen").append("<p>" + enemy["name"] + " attacks dealing " + enemy["attack"] + " damage</p>");
        player.hp = +player.hp - +enemy.attack;
        if (+player.hp <= 0){
            loseBattle();
            return;
        }
        $("#battleScreen").append("<p>" + player["name"] + " attacks dealing " + player["attack"] + " damage</p>");
        enemy.hp = +enemy.hp - +player.attack;
        if (+enemy.hp <= 0){
            endBattle();
            return;
        }
    }
    Update();
});

$("#battleScreen").on('click', '#exitButton', function(e){
    $("#battleScreen").fadeOut();
    $("#battleActions").fadeOut();
    $("#canvas").fadeIn();
    $("#actionBar").fadeIn();
    $("#inspect").fadeIn();
});

function endBattle(){
    $(enemy.parentID).html(enemy.deathText);
    $("#battleActions").html("");
    $("#battleScreen").append("<p>" + player["name"] + " defeated the " + enemy["name"] + "!</p><button id='exitButton'>Exit</button>");
}
function loseBattle(){
    $("#battleActions").html("");
    $("#battleScreen").append("<p>" + player["name"] + " was knocked unconscious by " + enemy["name"] + "!</p><button id='exitButton'>Exit</button>");
}