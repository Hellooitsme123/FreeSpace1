function byId(id) {
    return document.getElementById(id);
}
var p1txt = byId("p1");
var p2txt = byId("p2");
var gametitle = byId("gametitle");
var turnbtn = byId("turn");
var whichturn = byId("whichturn");
var drawbtn = byId("draw");
var turns = 0;
var deathmode = "";
var Game = {
    turn: 1,
    p1: {
        health: 300,
        mana: 10,
        inventory: {},
    },
    p2: {
        health: 300,
        mana: 10,
        inventory: {},
    },
};
var turn = Game.turn;
var cards = {
    spearman: {
        name: "spearman",
        formal: "Spearman",
        atk: 45,
        hp: 30,
        ammo: 1,
        maxammo: 1,
        manause: 1,
        cool: 1,
        coolleft: 0,
        desc: "SPEARMANITY",
        type: "Attack",
    },
    wizard: {
        name: "wizard",
        formal: "Wizard",
        atk: 35,
        hp: 20,
        ammo: 2,
        maxammo: 2,
        manause: 1,
        cool: 2,
        coolleft: 0,
        desc: "WIZARDY",
        type: "Attack",
    },
    turret: {
        name: "turret",
        formal: "Turret",
        atk: 20,
        hp: 50,
        ammo: 3,
        maxammo: 3,
        manause: 1,
        cool: 2,
        coolleft: 0,
        desc: "TURRETATION",
        type: "Attack",
    },
    sniper: {
        name: "sniper",
        formal: "Sniper",
        atk: 120,
        hp: 50,
        ammo: 1,
        maxammo: 1,
        manause: 2,
        cool: 3,
        coolleft: 2,
        desc: "SNIPERICIOUS",
        type: "Attack",
    },
    soulkeeper: {
        name: "soulkeeper",
        formal: "Soul Keeper",
        atk: 35,
        hp: 40,
        ammo: 1,
        maxammo: 2,
        manause: 2,
        cool: 1,
        coolleft: 1,
        desc: "SOUL KEEPERINITY",
        type: "Attack",
    },
    healorb: {
        name: "healorb",
        formal: "Healing Orb",
        hp: 30,
        heal: 25,
        uses: 1,
        coolleft: 0,
        manause: 1,
        desc: "HEALORBACIOUS",
        type: "Healing",
    },
    healbubble: {
        name: "healbubble",
        formal: "Heal Bubble",
        hp: 30,
        heal: 15,
        uses: -1,
        tempuses: 2,
        maxuses: 2,
        cool: 2,
        coolleft: 0,
        manause: 1,
        desc: "HEAL BUBBLONIUM",
        type: "Healing",
    },
    juggernaut: {
        name: "juggernaut",
        formal: "Juggernaut",
        atk: 65,
        hp: 100,
        ammo: 1,
        maxammo: 1,
        manause: 4,
        cool: 4,
        coolleft: 2,
        desc: "JUGGERNAUTIOUS",
        type: "Attack",
    },
    flamethrower: {
        name: "flamethrower",
        formal: "Flamethrower",
        atk: 13,
        hp: 40,
        ammo: 8,
        maxammo: 1,
        manause: 0.5,
        cool: 3,
        coolleft: 2,
        desc: "FLAMETHROWERY",
        type: "Attack",
    },
    charger: {
        name: "charger",
        formal: "Charger",
        atk: 20,
        hp: 30,
        ammo: 1,
        maxammo: 1,
        manause: 3,
        cool: 2,
        coolleft: 0,
        desc: "CHARGERINEKIT",
        type: "Attack",
    },
    solarprism: {
        name: "solarprism",
        formal: "Solar Prism",
        atk: 20,
        hp: 40,
        ammo: 1,
        maxammo: 1,
        manause: 0,
        cool: 2,
        coolleft: 0,
        desc: "SOLAR PRISMISM",
        type: "Attack",
    },
    weakener: {
        name: "weakener",
        formal: "Weakener",
        atk: 20,
        hp: 20,
        ammo: 1,
        maxammo: 1,
        manause: 2,
        cool: 1,
        coolleft: 1,
        desc: "WEAKENERIUM",
        type: "Attack",
    },
    supplycrate: {
        name: "supplycrate",
        formal: "Supply Crate",
        hp: 30,
        manause: 2,
        coolleft: 0,
        desc: "SUPPLY CRATORIANITE",
        type: "Support",
    },
    atkpotion: {
        name: "atkpotion",
        formal: "Attack Potion",
        hp: 15,
        manause: 2,
        coolleft: 0,
        desc: "ATTACK POTIONORIONIO",
        type: "Support",
    },
}
var p1 = Game.p1;
var p2 = Game.p2;
var template = {
    health: 300,
    mana: 10,
}
function randKey(obj) {
    var keys = Object.keys(obj);
    return obj[keys[ keys.length * Math.random() << 0]];
};
function randNum(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
function assign(object, source) {
    Object.keys(source).forEach(function(key) {
        object[key] = source[key];
    });
}
function drawCard(player) {
    let chosenkey = randKey(cards);
    let key = {};
    assign(key,chosenkey);
    if (Object.hasOwn(Game[player].inventory,key.name)) {
        let i2 = 0;
        do {
            i2++;
        } while (i2 <1000 && Object.hasOwn(Game[player].inventory,key.name+i2));
        
        if (Object.hasOwn(Game[player].inventory,key.name+i2) == false) {
            Game[player].inventory[key.name+i2] = key;
        }
    } else {
        Game[player].inventory[key.name] = key;
    }
} 

Array.from(document.getElementsByClassName("card")).forEach(function(element) {
    element.innerHTML = "loading...";
});
function update() {
    gametitle.innerHTML = "GAME O' CARDS "+deathmode;
    p1txt.innerHTML = "Player 1: "+p1.health+" Health | "+p1.mana+" Mana";
    p2txt.innerHTML = "Player 2: "+p2.health+" Health | "+p2.mana+" Mana";
    if (turn == 1) {
        whichturn.innerHTML = "YOUR TURN";
    } else {
        whichturn.innerHTML = "OPP TURN";
    }
    if (p1.health <= 0) {
        gametitle.innerHTML = "YOU LOSE!!!!";
        throw new Error('GAME ENDED');
    }
    if (p2.health <= 0) {
        gametitle.innerHTML = "YOU WIN!!!!";
        throw new Error('GAME ENDED');
    }
    Array.from(document.getElementsByClassName("card")).forEach(function(element) {
        let card = element;
        let id = element.getAttribute("id");
        let index;
        let curcard;
        if (id.includes("c")) {
            index = Number(id.replace("c",""))-1;
            curcard = p1.inventory[Object.keys(Game.p1.inventory)[index]];
        } else {
            index = Number(id.replace("o",""))-1;
            curcard = p2.inventory[Object.keys(Game.p2.inventory)[index]];
            
        }
        if (curcard != null && curcard != undefined) {
            if (curcard.type == "Attack") {
                card.innerHTML = "<span class='title'>"+curcard.formal+":</span><br>"+curcard.hp+" HP | "+curcard.atk+" ATK | "+curcard.coolleft+" CD<br>"+curcard.ammo+" AMMO | "+curcard.manause+" MU<br><hr><span class='desc'>"+curcard.desc+"</span>";
            }
            if (curcard.type == "Healing") {
                if (curcard.uses == -1) {
                    card.innerHTML = "<span class='title'>"+curcard.formal+":</span><br>"+curcard.hp+" HP | "+curcard.heal+" HEAL | "+curcard.coolleft+" CD<br>"+curcard.tempuses+" AMMO | "+curcard.manause+" MU<br><hr><span class='desc'>"+curcard.desc+"</span>";
                } else {
                    card.innerHTML = "<span class='title'>"+curcard.formal+":</span><br>"+curcard.hp+" HP | "+curcard.heal+" HEAL | "+curcard.uses+" USES | "+curcard.manause+" MU<br><hr><span class='desc'>"+curcard.desc+"</span>";
                }
            }
            if (curcard.type == "Support") {
                card.innerHTML = "<span class='title'>"+curcard.formal+":</span><br>"+curcard.hp+" HP | "+curcard.manause+" MU<br><hr><span class='desc'>"+curcard.desc+"</span>";
            }
            
        } else {
            card.innerHTML = "NO CARD";
        }
    
    });
}
function start() {
    for (let i = 0; i < 3; i++) {
        drawCard("p1");
    }
    for (let j = 0; j < 3; j++) {
        drawCard("p2");
    }
    update();
}
/*
for (let i = 0; i < 3; i++) {
        let chosenkey = randKey(cards);
        let key = {};
        assign(key,chosenkey);
        if (Object.hasOwn(Game.p1.inventory,key.name)) {
            let i2 = 0;
            do {
                i2++;
            } while (i2 <1000 && Object.hasOwn(Game.p1.inventory,key.name+i2));
           
            if (Object.hasOwn(Game.p1.inventory,key.name+i2) == false) {
                Game.p1.inventory[key.name+i2] = key;
            }
        } else {
            Game.p1.inventory[key.name] = key;
        }
    }
    for (let j = 0; j < 3; j++) {
        let chosenkey = randKey(cards);
        let key = {};
        assign(key,chosenkey);
        if (Object.hasOwn(Game.p2.inventory,key.name)) {
            let j2 = 0;
            do {
                j2++;
            } while (j2 <1000 && Object.hasOwn(Game.p2.inventory,key.name+j2));
            if (Object.hasOwn(Game.p2.inventory,key.name+j2) == false) {
                Game.p2.inventory[key.name+j2] = key;
            }
        } else {
            Game.p2.inventory[key.name] = key;
        }
    }
*/
function firstOpp(player) {
    let plr = Game[player];
    if (Object.keys(plr.inventory).length > 0) {
        return Object.keys(plr.inventory)[0];
    } else {
        return "Opp";
    }
}
function turnover(player) {
    // argument 'player' means the player that just ended their turn
    turns++;
    let curdeath;
    if (turns % 10 == 0) {
        if (deathmode != "") {
            curdeath = deathmode.replace("[DEATH MODE ","");
            curdeath = Number(curdeath.replace("]",""));
        } else {
            curdeath = 0;
        }
        deathmode = "[DEATH MODE "+(curdeath+1)+"]";
        p1.health -= 100;
        p2.health -= 100;
        p1.mana += 15;
        p2.mana += 15;
        if (p1.health > p2.health) {
            p2.mana += 10;
            p1.health -= 50;
        } else {
            p1.mana += 10;
            p2.health -= 50;
        }
    }
    let plr;
    if (player == "p1") {
        plr = p1;
    } else {
        plr = p2;
    }
    for (let i = 0; i < Object.keys(plr.inventory).length; i++) {
        let zecard = plr.inventory[Object.keys(plr.inventory)[i]];
        if (zecard.coolleft != 0) {
            zecard.coolleft -= 1;
            
        }
        if (zecard.type == "Attack") {
            if (zecard.ammo < zecard.maxammo) {
                zecard.ammo += 1;
            }
        }
        if (zecard.name == "charger" && zecard.atk < 80) {
            zecard.atk += 25;
        }
    }
}
function playerTurn() {
    turnover("p2");
    p2.mana += 5;
    turn = 1;
    update();
}
function oppAttack() {
    let tries = 0;
    let chosencard;
    let index;
    let done = false;
    do {
        chosencard = randKey(p2.inventory);
        index;
        for (let z = 0; z < Object.keys(p2.inventory).length; z++) {
            if (chosencard == p2.inventory[Object.keys(p2.inventory)[z]]) {
                index = z;
                done = true;
            }
        }
       
        tries++;
    } while (p2.mana > 0 && tries < 200 && done == false);
    useCard(null,true,index);
}
function oppDraw() {
    if (Object.keys(p2.inventory).length < 10) {
        drawCard("p2");
        p2.mana -= 2.5;
        if (randNum(0,1) == 1) {
            oppAttack();
        }   
    }
    
}
function oppTurn() {
    // states: spend, save, neutral
    turnover("p1");
    p1.mana += 5;
    turn = 2;
    let tries = 0;
    let choice = randNum(0,p2.mana/2);
    update();
    do {
        let feeling1 = randNum(0,5);
        if (Object.keys(p2.inventory).length < 2) {
            oppDraw();
            choice -= 1;
        } else {
            if (feeling1 >= 2 && Object.keys(p2.inventory).length > 0) {
                oppAttack();
            } else {
                oppDraw();
            }
        }
        tries++;
    } while (p2.mana > choice && tries < 200);
    window.setTimeout(playerTurn,2000);
}
    
    

function oppUse(index) {
    let card = p2.inventory[Object.keys(p2.inventory)[index]];
    if (card.coolleft == 0 && p2.mana >= card.manause) {
        p2.mana -= card.manause;
        let attacked = firstOpp("p1");
        if (attacked == "Opp") {
            p1.health -= card.atk;
        } else {
            let zeattacked = p2.inventory[attacked];
            console.log(zeattacked);
            p1.inventory[attacked].hp -= card.atk;
            if (p1.inventory[attacked].hp <= 0) {
                delete p1.inventory[attacked];
            }
        }
        card.ammo -= 1;
        if (card.ammo <= 0) {
            card.coolleft = card.cool;
            card.ammo = card.maxammo;
        }
    }
    
    update();
}
function useCard(element = null,opp = null,index = null) {
    let id;
    let opponent;
    let user;
    let stropp;
    let strmain;
    if (element != null) {
        id = element.getAttribute("id");
        index = Number(id.replace("c",""))-1;
    }
    if (opp == true) {
        opponent = p1;
        user = p2;
        stropp = "p1";
        strmain = "p2";
    } else {
        opponent = p2;
        user = p1;
        stropp = "p2";
        strmain = "p1";
    }
    if (Object.keys(user.inventory).length < index+1) {
        return false;
    } else {
        let card = user.inventory[Object.keys(user.inventory)[index]];
        if (card.coolleft == 0 && user.mana >= card.manause) {
            if (card.type == "Attack") {
                user.mana -= card.manause;
                let attacked = firstOpp(stropp);
                if (attacked == "Opp") {
                    opponent.health -= card.atk;
                } else {
                    let zeattacked = opponent.inventory[attacked];
                    opponent.inventory[attacked].hp -= card.atk;
                    if (card.name == "solarprism") {
                        opponent.health -= card.atk;
                    }
                    if (card.name == "charger") {
                        card.atk = 20;
                    }
                    if (card.name == "weakener") {
                        zeattacked.atk -= 10;
                        if (zeattacked.atk < 5) {
                            zeattacked.atk = 5;
                        }
                    }
                    if (opponent.inventory[attacked].hp <= 0) {
                        if (card.name == "soulkeeper") {
                            user.mana += 0.5;
                            user.mana = Number(user.mana.toFixed(1));
                            if (card.hp < 90) {
                                card.hp += 8;
                            }
                            if (user.health < 250) {
                                user.health += 3;
                            }
                            if (card.atk < 70) {
                                card.atk += 4;
                            }
                            
                        }
                        delete opponent.inventory[attacked];
                    }
                }
                card.ammo -= 1;
                if (card.ammo <= 0) {
                    card.coolleft = card.cool;
                    card.ammo = card.maxammo;
                }
            }
            if (card.type == "Healing") {
                user.mana -= card.manause;
                let chosen;
                for (let i = 0; i < Object.keys(user.inventory).length; i++) {
                    let tempchosen = user.inventory[Object.keys(user.inventory)[i]];
                    if (tempchosen.type == "Attack") {
                        chosen = tempchosen;
                        break;
                    }
                }
                if (chosen == null || chosen.type != "Attack") {
                    chosen = "Opp";
                }
                let zechosen;
                if (chosen != "Opp") {
                    zechosen = chosen;
                } else {
                    zechosen = "Opp";
                }
                console.log(chosen,zechosen);
                if (zechosen == "Opp") {
                    user.health += card.heal;
                } else {
                    zechosen.hp += card.heal;
                }
                if (card.uses == -1) {
                    card.tempuses -= 1;
                    if (card.tempuses <= 0) {
                        card.coolleft = card.cool;
                        card.tempuses = card.maxuses;
                    }
                } else {
                    card.uses -= 1;
                    if (card.uses <= 0) {
                        delete user.inventory[Object.keys(user.inventory)[index]];
                    }
                }
            }
            if (card.type == "Support") {
                if (card.name == "supplycrate") {
                    let chosen;
                    for (let i = 0; i < Object.keys(user.inventory).length; i++) {
                        let tempchosen = user.inventory[Object.keys(user.inventory)[i]];
                        if (tempchosen.type == "Attack") {
                            chosen = tempchosen;
                            break;
                        }
                    }
                    if (chosen == null || chosen.type != "Attack") {
                        return false;
                    }
                    chosen.ammo += Math.round((100-chosen.atk)/15);
                    delete user.inventory[Object.keys(user.inventory)[index]];
                }
                if (card.name == "atkpotion") {
                    let chosen;
                    for (let i = 0; i < Object.keys(user.inventory).length; i++) {
                        let tempchosen = user.inventory[Object.keys(user.inventory)[i]];
                        if (tempchosen.type == "Attack") {
                            chosen = tempchosen;
                            break;
                        }
                    }
                    if (chosen == null || chosen.type != "Attack") {
                        return false;
                    }
                    chosen.atk *= 1.5;
                    delete user.inventory[Object.keys(user.inventory)[index]];
                }
                user.mana -= card.manause;
            }
        }
    }
    update();
}
start();
Array.from(document.getElementsByClassName("card")).forEach(function(element) {
    element.addEventListener('click', function() {
        useCard(element);
    });
});
turnbtn.addEventListener('click',function(){
    if (turn == 1) {
        oppTurn();
    }
    
    
});
drawbtn.addEventListener('click',function(){
    if (p1.mana >= 2.5 && turn == 1 && Object.keys(p1.inventory).length < 10) {
        p1.mana -= 2.5;
        drawCard("p1");
        update();
    }
    
});