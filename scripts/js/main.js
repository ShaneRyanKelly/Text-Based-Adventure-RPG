// tbrpgEngine.js

var clickSource;

var sceneName = "town";
var currentScene;
var sceneIndex = 0;

var characterArray = [];
var enemyArray = [];
var itemArray = [];
var sceneArray = [];
var spellArray = [];

var inventory = [];
var spellBook = [];
var skills = [];
var journal = [];

class Player{
    constructor(name, playerClass, level, hp, maxHP, mp, maxMP, rage, sanity, strength, agility, intelligence, stamina, luck, baseAttack, attack, bluntAtt, edgedAtt, piercingAtt, baseAccuracy, accuracy, baseDefense, defense, bluntDef, edgedDef, piercingDef, baseEvasion, evasion, baseMDefense, magicDefense, weapon, armor, accessory, weaponAffinity, armorAffinity, fin, exp, next){
        this.name = name;
        this.playerClass = playerClass;
        this.level = level,
        this.hp = hp;
        this.maxHP = maxHP;
        this.mp = mp;
        this.maxMP = maxMP;
        this.rage = rage;
        this.sanity = sanity;
        this.strength = strength;
        this.agility = agility;
        this.intelligence = intelligence;
        this.stamina = stamina;
        this.luck = luck;
        this.baseAttack = baseAttack;
        this.attack = attack;
        this.bluntAtt = bluntAtt;
        this.edgedAtt = edgedAtt;
        this.piercingAtt = piercingAtt;
        this.baseAccuracy = baseAccuracy;
        this.accuracy = accuracy;
        this.baseDefense = baseDefense;
        this.defense = defense;
        this.bluntDef = bluntDef;
        this.edgedDef = edgedDef;
        this.piercingDef = piercingDef;
        this.baseEvasion = baseEvasion;
        this.evasion = evasion;
        this.baseMDefense = baseMDefense;
        this.magicDefense = magicDefense;
        this.weapon = weapon;
        this.armor = armor;
        this.accessory = accessory;
        this.weaponAffinity = weaponAffinity;
        this.armorAffinity = armorAffinity;
        this.fin = fin;
        this.exp = exp;
        this.next = next;
    }
}

function getLocalCharacter(){
    $.getJSON("./assets/characters/player.json", function(jsonArray){
        player = new Player(
            jsonArray["base"]["name"],
            jsonArray["base"]["class"],
            jsonArray["base"]["level"],
            jsonArray["stats"]["hp"],
            jsonArray["stats"]["maxHP"],
            jsonArray["stats"]["mp"],
            jsonArray["stats"]["maxMP"],
            jsonArray["stats"]["rage"],
            jsonArray["stats"]["sanity"],
            jsonArray["stats"]["strength"],
            jsonArray["stats"]["agility"],
            jsonArray["stats"]["intelligence"],
            jsonArray["stats"]["stamina"],
            jsonArray["stats"]["luck"],
            jsonArray["stats"]["baseAttack"],
            jsonArray["stats"]["attack"],
            jsonArray["stats"]["bluntAtt"],
            jsonArray["stats"]["edgedAtt"],
            jsonArray["stats"]["piercingAtt"],
            jsonArray["stats"]["baseAccuracy"],
            jsonArray["stats"]["accuracy"],
            jsonArray["stats"]["baseDefense"],
            jsonArray["stats"]["defense"],
            jsonArray["stats"]["bluntDef"],
            jsonArray["stats"]["edgedDef"],
            jsonArray["stats"]["piercingDef"],
            jsonArray["stats"]["baseEvasion"],
            jsonArray["stats"]["evasion"],
            jsonArray["stats"]["baseMDefense"],
            jsonArray["stats"]["magicDefense"],
            jsonArray["equip"]["weapon"],
            jsonArray["equip"]["armor"],
            jsonArray["equip"]["accessory"],
            jsonArray["equip"]["weaponAffinity"],
            jsonArray["equip"]["armorAffinity"],
            jsonArray["etc"]["fin"],
            jsonArray["etc"]["exp"],
            jsonArray["etc"]["next"]
        );
    }).done(function(){
        addItem(player.weapon);
        addItem(player.armor);
        addItem(player.accessory);
        instantiateEquipStats();
    });
}

class Enemy{
    constructor(name, level, enemyClass, hp, maxHP, mp, maxMP, rage, sanity, 
                strength, agility, intelligence, stamina, 
                luck, attack, bAtt, eAtt, pAtt, accuracy, defense, bDef, eDef, pDef, evasion, 
                magicDefense, weaponAffinity, armorAffinity, attacks, fin, exp){
        this.name = name;
        this.level = level;
        this.enemyClass = enemyClass;
        this.hp = hp;
        this.maxHP = maxHP;
        this.mp = mp;
        this.maxMP = maxMP;
        this.rage = rage;
        this.sanity = sanity;
        this.strength = strength;
        this.agility = agility;
        this.intelligence = intelligence;
        this.stamina = stamina;
        this.luck = luck;
        this.attack = attack;
        this.bluntAtt = bAtt;
        this.edgedAtt = eAtt;
        this.piercingAtt = pAtt;
        this.accuracy = accuracy;
        this.defense = defense;
        this.bluntDef = bDef;
        this.edgedDef = eDef;
        this.piercingDef = pDef;
        this.evasion = evasion;
        this.magicDefense = magicDefense;
        this.weaponAffinity = weaponAffinity;
        this.armorAffinity = armorAffinity;
        this.attacks = attacks;
        this.fin = fin;
        this.exp = exp;
    }
}

$(function(){
    loadScenes();
});

// loading functions

function loadScenes(){
    
    $.getJSON("./assets/scenes/scenes.json", function(data){
        sceneArray = data;
    })
    .done(function(){
        getScene(sceneName);
        loadBeastiary();
    });
}
function loadBeastiary(){
    $.getJSON("./assets/scenes/beastiary.json", function(data){
        enemyArray = data;
    })
    .done(function(){
        loadCharacters();
    });
}
function loadCharacters(){
    $.getJSON("./assets/scenes/characters.json", function(data){
        characterArray = data;
    })
    .done(function(){
        loadItems();
    });
}
function loadItems(){
    $.getJSON("./assets/scenes/items.json", function(data){
        itemArray = data;
    }).done(function(){
        loadSpells();
    });
}
function loadSpells(){
    $.getJSON("./assets/scenes/spells.json", function(data){
        spellArray = data;
    }).done(function(){
        getLocalCharacter();
        showMenu();
    });
}

// main menu buttons

$("#mainMenu").on('click', "#inventoryButton", function(e){
    fadedCanvas();
    fadinAdd();
    getInventory();
});

$("#mainMenu").on('click', '#equipButton', function(e){
    fadedCanvas();
    fadinAdd();
    getEquip();
});

$("#mainMenu").on('click', '#statusButton', function(e){
    fadedCanvas();
    fadinAdd();
    getStatus();
});

$("#mainMenu").on('click', '#journalButton', function(e){
    fadedCanvas();
    fadinAdd();
    getJournal();
});

// Display contextual action bar buttons

$( "#canvas" ).on('click', '.character', function(e){
    clickSource = e.target.id;
    console.log(currentScene["character"][clickSource]["vendor"]);
    if ( currentScene["character"][clickSource]["vendor"] == true ){
        $("#actionBar").html(
            '<button id="talkButton">Talk</button><button id="barterButton">Barter</span>'
        );
    }
    else {
        $("#actionBar").html(
            '<button id="talkButton">Talk</button>'
        );
    }
    getInspect();
});
$( "#canvas" ).on('click', '.enemy', function(e){
    clickSource = e.target.id;
    $("#actionBar").html(
        '<button id="attackButton">Attack</button>'
    );
    getInspect();
});
$("#canvas").on('click', '.event', function(e){
    console.log('event clicked');
    clickSource = e.target.id;
    $("#actionBar").html("");
    triggerEvent();
    //getInspect();
});
$( "#canvas" ).on('click', '.exit', function(e){
    clickSource = e.target.id;
    $("#actionBar").html(
        '<button id="proceedButton">Proceed</button>'
    );
    getInspect();
});
$( "#canvas" ).on('click', '.info', function(e){
    clickSource = e.target.id;
    $("#actionBar").html("");
    getInspect();
});
$( "#canvas" ).on('click', '.item', function(e){
    clickSource = e.target.id;
    getItem();
    getInspect();
});
$( "#canvas" ).on('click', '.object', function(e){
    clickSource = e.target.id;
    $("#actionBar").html(
        '<button id="interactButton">Interact</button>'
    );
});

// contextual action bar buttons

$( "#actionBar" ).on('click', '#inspectButton', function(e){
    getInspect();
});
$("#actionBar").on('click', '#interactButton', function(e){
    getInteract();
});
$("#actionBar").on('click', '#pickUpButton', function(e){
    getItem();
});
$("#actionBar").on('click', '#proceedButton', function(e){
    sceneName = clickSource;
    getScene(clickSource);
});

// additional buttons

// systems start buttons

$("#actionBar").on('click', '#attackButton', function(e){
    fadedCanvas();
    fadinAdd;
    startBattle();
});

$("#actionBar").on('click', '#talkButton', function(e){
    fadedCanvas();
    fadinAdd();
    startDialogue();
});

$("#actionBar").on('click', '#barterButton', function(e){
    fadedCanvas();
    fadinOpt();
    startBarter();
});

function getInspect(){
    $("#inspect").html(currentScene["inspect"][clickSource]);
}

function showMenu(){
    $("#mainMenu").append(
        "<button id='inventoryButton'>Inventory</button><button id='equipButton'>Equip</button><button id='statusButton'>Status</button><button id='journalButton'>Journal</button>"
    );
}

// barter.js

var newItem;

$('#addActions').on('click', '#exitButton', function(e){
    fadedOpt();
    fadinCanvas();
});
$("#addOptions").on('click', '#buy', function(e){
    $("#addScreen").html("");
    showBuy();
});
$("#addOptions").on('click', '#sell', function(e){
    $("#addScreen").html("");
    showSell(); 
});
$("#addScreen").on('click', ".buyOption", function(e){
    newItem = itemArray[e.target.id];
    $("#inspect").html(newItem["name"] + ": " + newItem["description"]);
    $("#addList").html("<button id='purchase'>Purchase</button>");
});
$("#addScreen").on('click', ".sellOption", function(e){
    newItem = itemArray[e.target.id];
    $("#inspect").html(newItem["name"] + ": " + newItem["description"]);
    $("#addList").html("<button id='sellItem'>Sell Item</button>");
});
$("#addList").on('click', '#purchase', function(e){
    $("#inspect").html("");
    $("#addList").html("");
    if (player.fin > newItem["shopPrice"]){
        player.fin -= newItem["shopPrice"];
        $("#inspect").html("You bought the " + newItem["name"] + " for $" + newItem["shopPrice"]);
        addItem(newItem["id"]);
    }
    else {
        $("#inspect").html("You do not have enough fin to buy " + newItem["name"]);
    }
});
$("#addList").on('click', '#sellItem', function(e){
    $("#inspect").html("");
    $("#addList").html("");
    $("#inspect").html("You sold the " + newItem["name"] + " for $" + newItem["sellingPrice"]);
    player.fin += newItem["sellingPrice"];
    sellItem(newItem);
    showSell();
});

function sellItem(soldItem){
    inventory[soldItem["id"]]["quantity"]--;
    if (inventory[newItem["id"]]["quantity"] == 0){
        delete inventory[newItem["id"]]
    }
}

function startBarter(){
    fadinOpt();
    fadinAdd();
    $("#addOptions").append("<button id='buy'>Buy</button><button id='sell'>Sell</button>");
    $("#addActions").append("<button id='exitButton'>Exit</button>");
}

function showBuy(){
    var itemArr = currentScene['character'][clickSource]["items"];
    for (let i = 0; i < Object.keys(itemArr).length; i++){
        $("#addScreen").append("<span id='" + itemArray[itemArr[i]]["id"] + "' class='buyOption'>" + itemArray[itemArr[i]]["name"] + " - $" + itemArray[itemArr[i]]["shopPrice"] + "</span><br>");
    }
}

function showSell(){
    $("#addScreen").html("");
    for(const key in inventory){
        if (inventory[key]["type"] == "key" || inventory[key]["type"] == "usable" || inventory[key]["equipped"]){
            continue;
        }
        else{
            $("#addScreen").append("<span id='" + inventory[key]["id"] + "' class='sellOption'>" + inventory[key]["name"] + " - $" + inventory[key]["sellingPrice"] + " - x" + inventory[key]["quantity"] + "</span><br>");
        }
    }
}

// battle.js

var enemy;
var player;
var inBattle = false;

function startBattle(){
    console.log(player);
    fadinAdd();
    inBattle = true;
    var newEnemy = enemyArray[currentScene["enemy"][clickSource]["name"]];
    enemy = new Enemy(
        newEnemy["name"],
        newEnemy["level"],
        newEnemy["class"],
        newEnemy["hp"],
        newEnemy["maxHP"],
        newEnemy["mp"],
        newEnemy["maxMP"],
        newEnemy["rage"],
        newEnemy["sanity"],
        newEnemy["strength"],
        newEnemy["agility"],
        newEnemy["intelligence"],
        newEnemy["stamina"],
        newEnemy["luck"],
        newEnemy["attack"],
        newEnemy["bluntAtt"],
        newEnemy["edgedAtt"],
        newEnemy["piercingAtt"],
        newEnemy["accuracy"],
        newEnemy["defense"],
        newEnemy["bluntDef"],
        newEnemy["edgedDef"],
        newEnemy["piercingDef"],
        newEnemy["evasion"],
        newEnemy["magicDefense"],
        newEnemy["weaponAffinity"],
        newEnemy["armorAffinity"],
        newEnemy["attacks"],
        newEnemy["fin"],
        newEnemy["exp"]

    );

    console.log(enemy);

    $("#addScreen").append("<p>A fearsome " + enemy.name + " attacks " + player.name + "!</p>");
    $("#addActions").html(
        "<b>HP:</b> " + player.hp + "/" + player.maxHP + " <b>MP:</b> " + player.mp + "/" + player.maxMP + "<br><b>RAGE:</b> " + player.rage + "/100 <b>Sanity:</b> " + player.sanity + "/100<br>" +'<button id="attackButton">Attack</button><button id="skillButton">Skill</button><button id="magicButton">Magic</button><button id="itemButton">Item</button><button id="equipButton">Equip</button><button id="defendButton">Defend</button><button id="inspectButton">Inspect</button><button id="fleeButton">Flee</button>'
    );
}

function update(){
    if (+enemy.hp <= 0){
        console.log("battle won");
        endBattle();
        return true;
    }
    else if (+player.hp <= 0){
        console.log("battle lost");
        loseBattle();
        return true;
    }
    $("#addActions").html(
        "<b>HP:</b> " + player.hp + "/" + player.maxHP + " <b>MP:</b> " + player.mp + "/" + player.maxMP + "<br><b>RAGE:</b> " + player.rage + "/100 <b>Sanity:</b> " + player.sanity + "/100<br>" +'<button id="attackButton">Attack</button><button id="skillButton">Skill</button><button id="magicButton">Magic</button><button id="itemButton">Item</button><button id="equipButton">Equip</button><button id="defendButton">Defend</button><button id="inspectButton">Inspect</button><button id="fleeButton">Flee</button>'
    );
    return false;
}

$("#addActions").on('click', '#attackButton', function(e){
    $("#addOptions").html("");

    player["attackType"] = "attack";
    player["damage"] = getDamageDQ(player, enemy);
    enemy["damage"] = getEnemyDamage();

    resolveTurn();
});

$("#addActions").on('click', "#magicButton", function(e){
    $("#addOptions").html("");
    showSpells();
});
$("#addActions").on('click', "#equipButton", function(e){
    $("#addOptions").html("");
    hideAdd();
    getEquip();
});
$("#addActions").on('click', "#fleeButton", function(e){
    $("#addOptions").html("");
    inBattle = false;
    $("#addActions").html("");
    $("#addScreen").append("<p>" + player["name"] + " flees the battle<br>");
    $("#addActions").append("!</p><button id='exitButton'>Exit</button>");
});
$("#addActions").on('click', "#inspectButton", function(e){
    $("#addOptions").html("");
    hideAdd();
    fadinInv();
    showInspect();
});
$("#addActions").on('click', "#itemButton", function(e){
    $("#addOptions").html("");
    hideAdd();
    getInventory();
});
$("#addActions").on('click', "#skillButton", function(e){
    $("#addOptions").html("");
    showSkills();
});

$("#addOptions").on('click', ".spell", function(e){
    $("#addOptions").html("");

    player["attackType"] = "magic";
    player["spellName"] = spellBook[e.target.id]["name"];
    player["damage"] = getSpellDamage(spellBook[e.target.id]);
    enemy["damage"] = getEnemyDamage();

    resolveTurn();
});
$("#addOptions").on('click', ".skill", function(e){
    $("#addOptions").html("");
    player["attackType"] = "skill";
    player["skillName"] = skills[e.target.id]["name"];
    player["damage"] = getSkillDamage(skills[e.target.id], player, enemy);
    enemy["damage"] = getEnemyDamage();

    resolveTurn();
});

function resolveTurn(){
    var battleOver = false;
    
    var turnOrder = turns();

    for(let i = 0; i < Object.keys(turnOrder).length; i++){
        if (turnOrder[i]["attackType"] == "attack"){
            $("#addScreen").append("<p>" + turnOrder[i]["name"] + " attacks dealing " + turnOrder[i]["damage"] + " damage</p>");
        }
        else if (turnOrder[i]["attackType"] == "magic"){
            $("#addScreen").append("<p>" + turnOrder[i]["name"] + " casts " + turnOrder[i]["spellName"] + " dealing " + turnOrder[i]["damage"] + " damage</p>");
        }
        else if (turnOrder[i]["attackType"] == "skill"){
            $("#addScreen").append("<p>" + turnOrder[i]["name"] + " uses " + turnOrder[i]["skillName"] + " dealing " + turnOrder[i]["damage"] + " damage</p>");
        }
        if (i == 0){
            turnOrder[1].hp -= turnOrder[0]["damage"];
        }
        else{
            turnOrder[0].hp -= turnOrder[1]["damage"];
        }
        battleOver = update();
        if (battleOver){
            break;
        }
    }
}

function getEnemyDamage(){
    var enemyAttack = enemy["attacks"][randomInt(Object.keys(enemy["attacks"]).length)];
    
    if (enemyAttack == "attack"){
        enemy["attackType"] = "attack";
        return getDamageDQ(enemy, player);
    }
    else if(spellArray[enemyAttack]["type"] == "magic"){
        enemy["attackType"] = "magic";
        enemy["spellName"] = spellArray[enemyAttack]["name"];
        return getSpellDamage(spellArray[enemyAttack]);
    }
}

function getSpellDamage(spell){
    var multiplier = getAffinityMultiplier(spell);
    console.log(multiplier);
    return Math.round(multiplier * (((spell["baseDamage"] - (enemy.magicDefense / 2)) + ((spell["baseDamage"] - (enemy.magicDefense / 2 + 1)) * randomInt(256)) / 256) / 4));
}

function getSkillDamage(skill, player1, player2){
    var modifier = 0;
    if (player1.bluntAtt > 0){
        modifier += skill["blunt"] - player2.bluntDef;
    }
    if (player.edgedAtt > 0){
        modifier += skill["edged"] - player2.edgedDef;
    }
    if (player.piercingAtt > 0){
        modifier += skill["piercing"] - player2.piercingDef;
    }
    return Math.round(((player1.attack + skill["baseDamage"]) - (player2.defense/2) + (((player1.attack + skill["baseDamage"]) - (player2.defense/2+1))*randomInt(256))/256) * ((100 + modifier) / 100));
}

function getAffinityMultiplier(spell){
    if (spell["strongAgainst"] == enemy.armorAffinity){
        return 1.5;
    }
    else if (spell["weakAgainst"] == enemy.armorAffinity){
        return .5;
    }
    else {
        return 1;
    }
}

function randomInt(max){
    return Math.floor(Math.random() * max);
}

function randomIntMin(min, max){
    return min + Math.floor(Math.random() * max);
}

function getDamageFF(player1, player2){
    var damageRating = (player1.strength) + Math.round(randomInt(player1.attack));
    var absorbRating = (player2.stamina) + Math.round(randomInt(player2.defense));
    return Math.abs(damageRating - absorbRating);
}

function getDamageDQ(player1, player2){
    var modifier = 0;
    if (player1.bluntAtt > 0){
        modifier += player1.bluntAtt - player2.bluntDef;
    }
    if (player.edgedAtt > 0){
        modifier += player1.edgedAtt - player2.edgedDef;
    }
    if (player.piercingAtt > 0){
        modifier += player1.piercingAtt - player2.piercingDef;
    }
    return Math.round((player1.attack - (player2.defense/2) + ((player1.attack - (player2.defense/2+1))*randomInt(256))/256) * ((100 + modifier) / 100));
}

function turns(){
    var turns = [];

    var playerScore = turnScore(player);
    var enemyScore = turnScore(enemy);
    if (playerScore > enemyScore){
        turns.push(player);
        turns.push(enemy);
    }
    else{
        turns.push(enemy);
        turns.push(player);
    }
    return turns;
}

function turnScore(ePlayer){
    return ePlayer.agility - ((Math.random(256) * (ePlayer.agility - (ePlayer.agility / 4))/256));
}

function showInspect(){
    $("#invScreen").append("<b>Name:</b> " + enemy.name + "<br>");
    $("#invScreen").append("<b>Level:</b> " + enemy.level + "<br>");
    $("#invScreen").append("<b>Class:</b> " + enemy.enemyClass + "<br><br>");
    $("#invScreen").append("<b>HP:</b> " + enemy.hp + " / " + enemy.maxHP + " <b>MP:</b> " + enemy.mp + " / " + enemy.maxMP + "<br>");
    $("#invScreen").append("<b>Rage:</b> " + enemy.rage + " / 100 <b>Sanity:</b> " + enemy.sanity + " / 100<br><br>");
    $("#invScreen").append("<b>Str:</b> " + enemy.strength + "<br>");
    $("#invScreen").append("<b>Agl:</b> " + enemy.agility + "<br>");
    $("#invScreen").append("<b>Int:</b> " + enemy.intelligence + "<br>");
    $("#invScreen").append("<b>Sta:</b> " + enemy.stamina + "<br>");
    $("#invScreen").append("<b>Luck:</b> " + enemy.luck + "<br><br>");
    $("#invScreen").append("<b>Att:</b> " + enemy.attack + " <b>Acc:</b> " + enemy.accuracy + "<br>");
    $("#invScreen").append("<b>B. Att:</b> " + enemy.bluntAtt + " <b>E. Att:</b> " + enemy.edgedAtt + " <b>P. Att:</b> " + enemy.piercingAtt + "<br>");
    $("#invScreen").append("<b>Affinity:</b> " + enemy.weaponAffinity + "<br><br>");
    $("#invScreen").append("<b>Def:</b> " + enemy.defense + " <b>M. Def:</b> " + enemy.magicDefense + " <b>Eva:</b> " + enemy.evasion + "<br>");
    $("#invScreen").append("<b>B. Def:</b> " + enemy.bluntDef + " <b>E. Def:</b> " + enemy.edgedDef + " <b>P. Def:</b> " + enemy.piercingDef + "<br>");
    $("#invScreen").append("<b>Affinity:</b> " + enemy.armorAffinity + "<br><br>");
    $("#invActions").append("<button id='exitButton'>Exit</button>");
}

function showSkills(){
    for(const key in skills){
        console.log(key);
        $("#addOptions").append("<button id='" + key + "' class='skill'>" + skills[key]["name"] + "</button>");
    }
}

function showSpells(){
    for(const key in spellBook){
        $("#addOptions").append("<button id='" + key + "' class='spell'>" + spellBook[key]["name"] + "</button>");
    }
}

function endBattle(){
    inBattle = false;
    $(enemy.parentID).html(enemy.deathText);
    $("#addActions").html("");
    $("#addOptions").html("");
    $("#addScreen").append("<p>" + player.name + " defeated the " + enemy.name);
    if (player.level - enemy.level < 5){
        player.fin += enemy.fin;
        player.exp += enemy.exp;
        $("#addScreen").append("<p>" + player.name + " receives " + enemy.fin + " fin");
        $("#addScreen").append("<p>" + player.name + " gains " + enemy.exp + " experience");
    }
    if (player.exp >= player.next){
        levelUp();
        $("#addScreen").append("<p>" + player.name + " attains level " + player.level);

    }
    $("#addActions").append("</p><button id='exitButton'>Exit</button>");
    var defeatedEnemy = currentScene["enemy"][clickSource];
    modifyScene(defeatedEnemy["modifiesScene"], defeatedEnemy["modifiesIndex"], defeatedEnemy["modifiesHtml"]);
    if (defeatedEnemy["modifiesCharacter"]){
        modifyDialogue(defeatedEnemy["modifiesCharacter"], defeatedEnemy["modifiesDialogue"]);
    }
    if (defeatedEnemy["journal"]){
        journal.push(defeatedEnemy["journal"]);
    }
    showScene();
    $("#inspect").html("");
}
function loseBattle(){
    inBattle = false;
    player.hp = player.maxHP / 2;
    $("#addActions").html("");
    $("#addOptions").html("");
    $("#addScreen").append("<p>" + player["name"] + " was knocked unconscious by " + enemy["name"]);
    $("#addActions").append("!</p><button id='exitButton'>Exit</button>");
}

function levelUp(){
    player.level++;
    player.next = player.next + Math.round(.33 * player.next);    
    player.maxHP += randomInt(10);
    player.hp = player.maxHP;
    player.maxMP += randomInt(10);
    player.mp = player.maxMP;
    player.strength += randomInt(5);
    player.agility += randomInt(5);
    player.intelligence += randomInt(5);
    player.stamina += randomInt(5);
    player.luck += randomInt(5);
    player.baseAttack += randomInt(3);
    player.baseAccuracy += randomInt(3);
    player.baseDefense += randomInt(3);
    player.baseEvasion += randomInt(3);
    player.baseMDefense += randomInt(3);
    if (player.exp > player.next){
        levelUp();
    }
}

// dialogue.js

var dialogueTree;
var character;
var currentID;

$("#addOptions").on('click', '.dialogue', function(e){
    var eventID = character[e.target.id]["eventID"];
    if (eventID){
        var event = currentScene['event'][eventID];
        console.log(event);
        if (!event["triggered"]){
            modifyScene(event["modifiesScene"], event["modifiesIndex"], event["modifiesHtml"]);
            //modifyScene(sceneName, event["currentIndex"], event["currentHtml"]);
            if (event["modifiesCharacter"]){
                modifyDialogue(event["modifiesCharacter"], event["modifiesDialogue"]);
            }
            if (event["journal"]){
                journal.push(event["journal"]);
            }
            event["triggered"] = true;
        }
    }
    $("#addScreen").append("<p><b>" + player.name + ":</b></p><p>" + e.target.textContent + "</p>");
    displayDialogue(character[e.target.id]);
});

class DialogueTree{
    constructor(){

    }
}

function startDialogue(newCharacter){
    character = characterArray[currentScene["character"][clickSource]["id"]];
    dialogueTree = new DialogueTree(

    );
    $("#addActions").append("<br><button id='exitButton'>Exit</button>");
    displayDialogue(character["greeting"]);
}

function displayDialogue(currentDialogue){
    $("#addOptions").html("");
    for (let i = 0; i < Object.keys(currentDialogue).length; i++){
        //console.log(currentDialogue);
        if (i == 0){
            $("#addScreen").append("<p><b>" + currentScene["character"][clickSource]["name"] + ":</b></p>" + currentDialogue[i]);
        }
        else {;
            $("#addOptions").append(currentDialogue[i]);
        }
    }
    //$("#addOptions").fadeIn();
}

function modifyDialogue(modifiesCharacter, modifiesDialogue){
    console.log(modifiesCharacter)
    for (let i = 0; i < Object.keys(modifiesCharacter).length; i++){
        var dialogueTarget = characterArray[modifiesCharacter[i]]["greeting"];
        dialogueTarget[Object.keys(dialogueTarget).length] = modifiesDialogue[i];
    }
}

// equip.js

$("#eqpScreen").on('click', "#weapon", function(e){
    $("#eqpList").html("");
    for(const key in inventory){
        if (inventory[key]["class"] == "weapon"){
            $("#eqpList").append("<div id='"+ inventory[key]["id"] + "' class='option'><b>" + inventory[key]["name"] + "</b><br><b>Att:</b> " + inventory[key]["attack"] + "   <b>Acc:</b> " + inventory[key]["accuracy"] + "<br><b>B:</b> " + inventory[key]["blunt"] + "   <b>E:</b> " + inventory[key]["edged"] + "   <b>P:</b> " + inventory[key]["piercing"] + "<br><b>Aff:</b> " + inventory[key]["affinity"] + "</div><br>");
        }
    }
});

$("#eqpScreen").on('click', "#armor", function(e){
    $("#eqpList").html("");
    for(const key in inventory){
        if (inventory[key]["class"] == "armor"){
            $("#eqpList").append("<div id='"+ inventory[key]["id"] + "' class='option'><b>" + inventory[key]["name"] + "</b><br><b>Def:</b> " + inventory[key]["defense"] + "   <b>Mdef:</b> " + inventory[key]["magicDefense"] + "<br><b>B:</b> " + inventory[key]["blunt"] + "   <b>E:</b> " + inventory[key]["edged"] + "   <b>P:</b> " + inventory[key]["piercing"] + "<br><b>Aff:</b> " + inventory[key]["affinity"] + "</div><br>");
        }
    }
});
$("#eqpScreen").on('click', "#accessory", function(e){
    $("#eqpList").html("");
    for(const key in inventory){
        if (inventory[key]["class"] == "accessory"){
            $("#eqpList").append("<div id='"+ inventory[key]["id"] + "' class='option'><b>" + inventory[key]["name"] + "</b><br><b>Att:</b> " + inventory[key]["attack"] + " <b>Acc:</b> " + inventory[key]["accuracy"] + "<br><b>B:</b> " + inventory[key]["bluntAtt"] + " <b>E:</b> " + inventory[key]["edgedAtt"] + " <b>P:</b> " + inventory[key]["piercingAtt"] + "<br><b>Def:</b> " + inventory[key]["defense"] + "   <b>Mdef:</b> " + inventory[key]["magicDefense"] + " <b>Eva: </b>" + inventory[key]["evasion"] + "<br><b>B:</b> " + inventory[key]["bluntDef"] + "   <b>E:</b> " + inventory[key]["edgedDef"] + "   <b>P:</b> " + inventory[key]["piercingDef"] + "<br><b>Aff:</b> " + inventory[key]["affinity"] + "</div><br>");
        }
    }
});

$("#eqpActions").on('click', '#exitButton', function(e){
    if (inBattle){
        fadedEquip();
        fadinAdd();
    }
    else{
        fadedEquip();
        fadinCanvas();
    }
});

$("#eqpList").on('click', '.option', function(e){
    console.log(e.target.id);
    selectedItem = inventory[e.target.id];
    equipItem();
    instantiateEquipStats();
    clearEquip();
    getEquip();
});

function getEquip(){
    //console.log(inventory);
    fadinEquip();
    $("#eqpScreen").append("<span id='weapon'>Weapon: " + inventory[player.weapon]["name"] + "</span><br>");
    $("#eqpScreen").append("<span id='armor'>Armor: " + inventory[player.armor]["name"] + "</span><br>");
    $("#eqpScreen").append("<span id='accessory'>Accessory: " + inventory[player.accessory]["name"] + "</span><br>");
    $("#eqpActions").append("<button id='exitButton'>Exit</span>");
}

function instantiateEquipStats(){
    player.attack = player.baseAttack;
    player.defense = player.baseDefense;
    player.accuracy = player.baseAccuracy;
    player.evasion = player.baseEvasion;
    player.magicDefense = player.baseMDefense;
    player.bluntDef = 0;
    player.edgedDef = 0;
    player.piercingDef = 0;
    player.bluntAtt = 0;
    player.edgedAtt = 0;
    player.piercingAtt = 0;

    var newWeapon = inventory[player.weapon];
    var newArmor = inventory[player.armor];
    var newAccessory = inventory[player.accessory];
    inventory[player.weapon]["equipped"] = true;
    inventory[player.armor]["equipped"] = true;
    inventory[player.accessory]["equipped"] = true;

    player.attack += newWeapon["attack"];
    player.accuracy += newWeapon["accuracy"];
    player.bluntAtt += newWeapon["blunt"];
    player.edgedAtt += newWeapon["edged"];
    player.piercingAtt += newWeapon["piercing"];
    player.defense += newArmor["defense"];
    player.magicDefense += newArmor["magicDefense"];
    player.evasion += newArmor["evasion"];
    player.bluntDef += newArmor["blunt"];
    player.edgedDef += newArmor["edged"];
    player.piercingDef += newArmor["piercing"];
    player.attack += newAccessory["attack"];
    player.accuracy += newAccessory["accuracy"];
    player.bluntAtt += newAccessory["bluntAtt"];
    player.edgedAtt += newAccessory["edgedAtt"];
    player.piercingAtt += newAccessory["piercingAtt"];
    player.defense += newAccessory["defense"];
    player.magicDefense += newAccessory["magicDefense"];
    player.evasion += newAccessory["evasion"];
    player.bluntDef += newAccessory["bluntDef"];
    player.edgedDef += newAccessory["edgedDef"];
    player.piercingDef += newAccessory["piercingDef"];
    player.weaponAffinity = newWeapon["affinity"];
    player.armorAffinity = newArmor["affinity"];
}

function clearEquip(){
    $("#eqpScreen").html("");
    $("#eqpActions").html("");
    $("#eqpList").html("");
    $("#eqpOptions").html("");
}

function fadedEquip(){
    $("#eqpScreen").html("");
    $("#eqpActions").html("");
    $("#eqpList").html("");
    $("#eqpOptions").html("");
    $("#eqpScreen").fadeOut();
    $("#eqpActions").fadeOut();
    $("#eqpList").fadeOut();
    $("#eqpOptions").fadeOut();
}

function fadinEquip(){
    $("#eqpScreen").fadeIn();
    $("#eqpActions").fadeIn();
    $("#eqpList").fadeIn();
    $("#eqpOptions").fadeIn();
}

function hideAdd(){
    $("#addScreen").fadeOut();
    $("#addActions").fadeOut();
}

// event.js

function triggerEvent(){
    var event = currentScene["event"][clickSource];
    if (!event["triggered"]){
        modifyScene(event["modifiesScene"], event["modifiesIndex"], event["modifiesHtml"]);
        //modifyScene(sceneName, event["currentIndex"], event["currentHtml"])
        event['triggered'] = true;
        showScene();
    }
}

// interact.js

function getInteract(){
    $("#inspect").html(currentScene["interact"][clickSource]);
    var interactable = currentScene["interact"][clickSource];
    if (currentScene["interact"][clickSource]["modifiesScene"] && !currentScene["interact"][clickSource]["interacted"]){
        modifyScene(interactable["modifiesScene"], interactable["modifiesIndex"], interactable["modifiesHtml"]);
        showScene();
        sceneArray[sceneIndex]["interact"][clickSource]["interacted"] = true;
        $("#inspect").html(currentScene["interact"][clickSource]["inspect"]);
    }
    else{
        $("#inspect").html(currentScene["interact"][clickSource]["interactedText"]);
    }
}

// inventory.js

var selectedItem;
var currentItem;

$("#invActions").on('click', '#exitButton', function(e){
    if (inBattle){
        fadedInv();
        fadinAdd();
    }
    else{
        showScene();
        fadedInv();
        fadinCanvas();
    }
});
$("#invScreen").on('click', '.consumable', function(e){
    $("#invOptions").html("");
    $("#invOptions").append("<button id='consumeButton'>Consume</span>");
    $("#inspect").html(inventory[e.target.id]["name"] + ": " + inventory[e.target.id]["description"]);
    selectedItem = inventory[e.target.id];
    clickSource = e.target.id;
});
$("#invOptions").on('click', '#consumeButton', function(e){
    consumeItem();
});
$("#invScreen").on('click', '.usable', function(e){
    $("#invOptions").html("");
    $("#invOptions").append("<button id='useButton'>Use</span>");
    $("#inspect").html(inventory[e.target.id]["name"] + ": " + inventory[e.target.id]["description"]);
    selectedItem = inventory[e.target.id];
    clickSource = e.target.id;
});
$("#invOptions").on('click', '#useButton', function(e){
    useItem();
});
$("#invScreen").on('click', '.equip', function(e){
    $("#invOptions").html("");
    $("#invOptions").append("<button id='equipButton'>Equip</span>");
    $("#inspect").html(inventory[e.target.id]["name"] + ": " + inventory[e.target.id]["description"]);
    selectedItem = inventory[e.target.id];
    clickSource = e.target.id;
});
$("#invOptions").on('click', '#equipButton', function(e){
    equipItem();
});

$("#useScreen").on('click', '#exitButton', function(e){
    showInventory();
});

$("#useScreen").on('click', '.character', function(e){
    if (selectedItem["id"] === currentScene["character"][e.target.id]["item"]){
        $("#inspect").html(currentScene["character"][e.target.id]["itemText"]);
        characterArray[e.target.id]["greeting"][Object.keys(characterArray[e.target.id]["greeting"]).length] = currentScene["character"][e.target.id]["modifiesText"];
        if (selectedItem["singleUse"]){
            decrementItem();
        }
        showInventory();
    }
    else{
        $("#inspect").html(currentScene["character"][e.target.id]["itemText"]);
    }
});
$("#useScreen").on('click', '.enemy', function(e){
    if (selectedItem["id"] === currentScene["enemy"][e.target.id]["item"]){
        $("#inspect").html(selectedItem["onUse"]);
        var currentEnemy = currentScene["enemy"][e.target.id];
        modifyScene(currentEnemy["itemScene"], currentEnemy["itemIndex"], currentEnemy["itemHtml"]);
        showScene();
        if (selectedItem["singleUse"]){
            decrementItem();
        }
        showInventory();
    }
    else{
        $("#inspect").html(e.target.title + " is not effected by " + selectedItem["name"]);
    }
});
$("#useScreen").on('click', '.info', function(e){
    $("#inspect").html(e.target.title + " is not effected by " + selectedItem["name"]);
});
$("#useScreen").on('click', '.item', function(e){
    $("#inspect").html(e.target.title + " is not effected by " + selectedItem["name"]);
});
$("#useScreen").on('click', '.object', function(e){
    if (selectedItem["id"] === currentScene["interact"][e.target.id]["item"]){
        $("#inspect").html(selectedItem["onUse"]);
        var interactable = currentScene["interact"][e.target.id];
        modifyScene(interactable["modifiesScene"], interactable["modifiesIndex"], interactable["modifiesHtml"]);
        showScene();
        if (selectedItem["singleUse"]){
            decrementItem();
        }
        showInventory();
    }
    else{
        $("#inspect").html(e.target.title + " is not effected");
    }
});

function addItem(newItem){
    var index;
    index = hasItem(newItem);
    if (index === false){
        inventory[newItem] = itemArray[newItem];
        inventory[newItem]["quantity"]++;
    }
}

function addSkill(){
    skills[selectedItem["teaches"]] = spellArray[selectedItem["teaches"]];
    console.log(skills);
}

function addSpell(){
    spellBook[selectedItem["teaches"]] = spellArray[selectedItem["teaches"]]
    console.log(spellBook);
}

function consumeItem(){
    $("#inspect").html("You consume " + selectedItem["name"]);
    if (selectedItem["statEffected"] == "hp"){
        owHeal();
    }
    else if (selectedItem["statEffected"] == "magic"){
        addSpell(selectedItem["teaches"]);
    }
    else if (selectedItem["statEffected"] == "skill"){
        addSkill(selectedItem["teaches"]);
    }
    console.log(player);
    if (selectedItem["singleUse"]){
        decrementItem();
    }
    if (inBattle){
        fadedInv();
        fadinAdd();
    }
    else{
        showInventory();
    }
}

function decrementItem(){
    inventory[selectedItem["id"]]["quantity"]--;
    if (inventory[selectedItem["id"]]["quantity"] == 0){
        delete inventory[selectedItem["id"]]
    }
}

function equipItem(){
    inventory[player.weapon]["equipped"] = false;
    inventory[selectedItem["id"]]["equipped"] = true;
    if (selectedItem["class"] === "weapon"){
        player.weapon = selectedItem["id"];
    }
    else if (selectedItem["class"] === "armor"){
        player.armor = selectedItem["id"];
    }
    else if (selectedItem["class"] === "accessory"){
        player.accessory = selectedItem["id"];
    }
    instantiateEquipStats();
}

function getInventory(){
    $("#invScreen").append("<h1>Inventory</p>");
    for(const key in inventory){
        if (inBattle && inventory[key]["type"] === "consumable"){
            console.log("in battle");
            $("#invScreen").append("<span id='" + inventory[key]["id"] + "' class=" + inventory[key]["type"] + ">" + inventory[key]["name"] + " - " + inventory[key]["quantity"] + "</span><br>");
        }
        else if (!inBattle){
            console.log("else");
            $("#invScreen").append("<span id='" + inventory[key]["id"] + "' class=" + inventory[key]["type"] + ">" + inventory[key]["name"] + " - " + inventory[key]["quantity"] + "</span><br>");
        }
    }
    $("#invScreen").append("<br>fin: " + player.fin + "<br>");
    $("#invActions").append("<button id='exitButton'>Exit</span>");
    fadinInv();
}

function getItem(){
    var index;
    currentItem = currentScene["item"][clickSource];
    console.log(currentScene["item"]);
    console.log(clickSource);
    $("#inspect").html("You pick up " + currentItem["name"]);
    modifyScene(currentItem["modifiesScene"], currentItem["modifiesIndex"], currentItem["modifiesHtml"]);
    showScene();
    index = hasItem(clickSource);
    if (index === false){
        inventory[currentItem["id"]] = itemArray[currentItem["id"]];
        index = hasItem(clickSource);
        inventory[currentItem["id"]]["quantity"]++;
    }
    else{
        inventory[currentItem["id"]]["quantity"]++;
    }
    //inventory[currentScene["item"][clickSource]["id"]] = itemArray[currentScene["item"][clickSource]["id"]];
    $("#actionBar").html("");
}

function hasItem(id){
    var index;

    if (inventory === undefined || inventory.length === 0){
        return false;
    }
    
    for (let i = 0; i < Object.keys(inventory).length; i++){
        console.log(inventory[i]);
        if (inventory[i]["id"] == id){
            return i;
        }
    }
    return false;
}

function incrementItem(item){
    inventory[item]["quantity"]++;
}

function owHeal(){
    player[selectedItem["statEffected"]] += selectedItem["effect"];
    if (player["hp"] > player["maxHP"]){
        player["hp"] = player["maxHP"];
    }
}

function showUseScene(){
    for(const key in currentScene["html"]){
        $("#useScreen").append(currentScene["html"][key]);
    }
    $("#useScreen").append("<button id='exitButton'>Exit</button>");
}

function showInventory(){
    $("#useScreen").html("");
    $("#useScreen").fadeOut();
    $("#invScreen").html("");
    $("#invOptions").html("");
    $("#invActions").html("");
    getInventory();
    fadinAdd();
}

function useItem(){
    $("#invScreen").fadeOut();
    $("#invActions").fadeOut();
    $("#invOptions").fadeOut();
    fadedInv();
    $("#inspect").html("");
    $("#useScreen").fadeIn();
    showUseScene();
}

// journal.js

function getJournal(){
    if (Object.keys(journal).length > 0){
        $("#addScreen").html("");
        for (let i=0; i<Object.keys(journal).length; i++)
        {
            $("#addScreen").html(journal[i]);
        }
    }
    $("#addActions").html("<button id='exitButton'>Exit</button>");
}

// scene.js

function modifyScene(sceneID, lineID, appendText){
    /*for(const key in sceneID){
        if (sceneArray[key]["sceneName"] == sceneID){
            sceneArray[key]["html"][lineID] = appendText;   
        }
    }*/
    for (let i = 0; i < Object.keys(sceneID).length; i++){
        //console.log(sceneArray[sceneID[i]]["html"][lineID[i]]);
        sceneArray[sceneID[i]]["html"][lineID[i]] = "";
        sceneArray[sceneID[i]]["html"][lineID[i]] = appendText[i];
    }
}

function findScene(sceneName){
    for(const key in sceneArray){
        if (sceneArray[key]["sceneName"] == sceneName){
            sceneIndex = sceneArray[key]["sceneName"];
            //console.log(sceneArray[i]);
            return sceneArray[key];
        }
    }
    return false;
}


function getScene(sceneName){
    $("#canvas").html("");
    $("#addActions").html("");
    $("#inspect").html("");
    $("#actionBar").html("");
    if (currentScene = findScene(sceneName)){
        showScene();
    }
    else {
        console.log("scene not found");
    }
}

function showScene(){
    //console.log(currentScene);
    $("#canvas").html("");
    for(const key in currentScene["html"]){
        $("#canvas").append(currentScene["html"][key]);
    }
    //for (var i = 0; i < Object.keys(currentScene["html"]).length; i++){
    //    $("#canvas").append(currentScene["html"][i]);
    //}
}

$("#addActions").on('click', '#exitButton', function(e){
    showScene();
    fadedAdd();
    fadinCanvas();
});

// status.js

function getStatus(){
    $("#addScreen").append("<b>Name:</b> " + player.name + "<br>");
    $("#addScreen").append("<b>Level:</b> " + player.level + "<br>");
    $("#addScreen").append("<b>Class:</b> " + player.playerClass + "<br><br>");
    $("#addScreen").append("<b>HP:</b> " + player.hp + " / " + player.maxHP + " <b>MP:</b> " + player.mp + " / " + player.maxMP + "<br>");
    $("#addScreen").append("<b>Rage:</b> " + player.rage + " / 100 <b>Sanity:</b> " + player.sanity + " / 100<br><br>");
    $("#addScreen").append("<b>Str:</b> " + player.strength + "<br>");
    $("#addScreen").append("<b>Agl:</b> " + player.agility + "<br>");
    $("#addScreen").append("<b>Int:</b> " + player.intelligence + "<br>");
    $("#addScreen").append("<b>Sta:</b> " + player.stamina + "<br>");
    $("#addScreen").append("<b>Luck:</b> " + player.luck + "<br><br>");
    $("#addScreen").append("<b>Att:</b> " + player.attack + " <b>Acc:</b> " + player.accuracy + "<br>");
    $("#addScreen").append("<b>B. Att:</b> " + player.bluntAtt + " <b>E. Att:</b> " + player.edgedAtt + " <b>P. Att:</b> " + player.piercingAtt + "<br>");
    $("#addScreen").append("<b>Affinity:</b> " + player.weaponAffinity + "<br><br>");
    $("#addScreen").append("<b>Def:</b> " + player.defense + " <b>M. Def:</b> " + player.magicDefense + " <b>Eva:</b> " + player.evasion + "<br>");
    $("#addScreen").append("<b>B. Def:</b> " + player.bluntDef + " <b>E. Def:</b> " + player.edgedDef + " <b>P. Def:</b> " + player.piercingDef + "<br>");
    $("#addScreen").append("<b>Affinity:</b> " + player.armorAffinity + "<br><br>");
    $("#addScreen").append("<b>EXP:</b> " + player.exp + " / " + player.next + "<br><br>");
    $("#addActions").append("<button id='exitButton'>Exit</button>");
}

// etc.

function fadinAdd(){
    $("#addScreen").fadeIn();
    $("#addActions").fadeIn();
    $("#addOptions").fadeIn();
}

function fadedAdd(){
    $("#addScreen").html("");
    $("#addActions").html("");
    $("#addOptions").html("");
    $("#addList").html("");
    $("#addScreen").fadeOut();
    $("#addActions").fadeOut();
}

function fadinCanvas() {
    $("#canvas").fadeIn();
    $("#actionBar").fadeIn();
    $("#inspect").html("")
    $("#mainMenu").fadeIn();
}

function fadedCanvas(){
    $("#canvas").fadeOut();
    $("#actionBar").html("");
    $("#inspect").html("")
    $("#mainMenu").fadeOut();
}

function fadinInv(){
    $("#invScreen").fadeIn();
    $("#invActions").fadeIn();
    $("#invOptions").fadeIn();
    $("#invList").fadeIn();
}

function fadedInv(){
    $("#invScreen").html("");
    $("#invActions").html("");
    $("#invOptions").html("");
    $("#invList").html("");
    $("#inspect").html("");
    $("#invScreen").fadeOut();
    $("#invActions").fadeOut();
}

function fadedOpt(){
    $("#optScreen").html("");
    $("#optActions").html("");
    $("#optOptions").html("");
    $("#optList").html("");
    $("#inspect").html("");
    $("#optScreen").fadeOut();
    $("#optActions").fadeOut();
}

function fadinOpt(){
    $("#optScreen").fadeIn();
    $("#optActions").fadeIn();
    $("#optOptions").fadeIn();
    $("#optList").fadeIn();
}

// garbage???

function testPHP(scriptPath){
    $.ajax({
        type: "GET",
        url:scriptPath,
        async: false,
        cache: false,
        success: function(result){
            console.log(result);
        }
    });
}

function testPHPPOST(scriptPath, postData){
    $.ajax({
        type: "POST",
        url: scriptPath,
        async: false,
        cache: false,
        data: { buoyNumber : postData },
        success: function(result){
            console.log(result);
        }
    });
}