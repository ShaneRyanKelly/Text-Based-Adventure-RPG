class DialogueTree{
    constructor(){

    }
}

var dialogueTree;
var currentDialogue;
var currentID;

export function startDialogue(characterID, characterDialogue){
    currentDialogue = characterDialogue;
    currentID = characterID;
    dialogueTree = new DialogueTree(

    );
    displayDialogue(characterDialogue[characterID]["greeting"]);
}

$("#dialogueOptions").on('click', 'button', function(e){
    if (e.target.id == 'exit'){
        $("#dialogueScreen").fadeOut();
        $("#dialogueScreen").html("");
        $("#dialogueOptions").fadeOut();
        $("#canvas").fadeIn();
        $("#actionBar").fadeIn();
        $("#inspect").fadeIn();
    }
    else{
        $("#dialogueScreen").append("<p>" + e.target.textContent + "</p>");
        console.log(currentDialogue[currentID][e.target.id]);
        displayDialogue(currentDialogue[currentID][e.target.id]);
    }
});

function displayDialogue(currentDialogue){
    $("#dialogueOptions").html("");
    for (let i = 0; i < Object.keys(currentDialogue).length; i++){
        console.log("in loop");
        if (i == 0){
            $("#dialogueScreen").append(currentDialogue[i]);
        }
        else {;
            $("#dialogueOptions").append(currentDialogue[i]);
        }
    }
    $("#dialogueOptions").append("<br><button id='exit'>Exit</button>");
    //$("#dialogueOptions").fadeIn();
}