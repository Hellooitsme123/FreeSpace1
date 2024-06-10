function byId(id) {
    return document.getElementById(id);
}
var p1txt = byId("p1");
var p2txt = byId("p2");
var gametitle = byId("gametitle");
var turnbtn = byId("turn");
var modebtn = byId("mode");
var modetext = byId("curmode");
var currentmode = "Normal";
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
        desc:"A simple soldier with a spear, dealing high damage with quick movements.",
        funnyname: "SPEARMANITY",
        type: "Attack",
        img: "",
    },
    wizard: {
        name: "wizard",
        formal: "Wizard",
        atk: 50,
        hp: 20,
        ammo: 2,
        maxammo: 2,
        manause: 1,
        cool: 2,
        coolleft: 0,
        desc:"An apprentice in magic, shooting deadly arcane blasts while using low mana.",
        funnyname: "WIZARDY",
        type: "Attack",
        img: "",
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
        desc:"A turret that deals lethal bursts of damage, assuring that no cards get destroyed.",
        funnyname: "TURRETATION",
        type: "Attack",
        img: "",
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
        desc:"Precise shots that can take down the biggest, at a cost of time and mana.",
        funnyname: "SNIPERICIOUS",
        type: "Attack",
        img: "",
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
        desc:"A creature that harvests the dead, growing stronger with each kill.",
        funnyname: "SOUL KEEPERINITY",
        type: "Attack",
        img: "soulkeeper.png",
    },
    healorb: {
        name: "healorb",
        formal: "Healing Orb",
        hp: 20,
        heal: 35,
        uses: 1,
        coolleft: 0,
        manause: 1,
        desc:"A simple orb, giving decent health when used.",
        funnyname: "HEALORBACIOUS",
        type: "Healing",
        img: "healorb.png",
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
        desc:"A bubble that continuously heals those around it when activated.",
        funnyname: "HEAL BUBBLONIUM",
        type: "Healing",
        img: "healbubble.png",
    },
    juggernaut: {
        name: "juggernaut",
        formal: "Juggernaut",
        atk: 65,
        hp: 100,
        ammo: 1,
        maxammo: 1,
        manause: 2,
        cool: 4,
        coolleft: 2,
        desc:"A robust and tanky fellow with slow but strong attacks.",
        funnyname: "JUGGERNAUTIOUS",
        type: "Attack",
        img: "juggernaut.png",
    },
    flamethrower: {
        name: "flamethrower",
        formal: "Flamethrower",
        atk: 13,
        hp: 40,
        ammo: 8,
        maxammo: 8,
        manause: 0.5,
        cool: 3,
        coolleft: 2,
        desc:"Spews hot flames at a speedy rate, disintegrating those that aren't wary.",
        funnyname: "FLAMETHROWERY",
        type: "Attack",
        img: "flamethrower.png",
    },
    charger: {
        name: "charger",
        formal: "Charger",
        atk: 20,
        hp: 30,
        ammo: 1,
        maxammo: 1,
        manause: 2,
        cool: 2,
        coolleft: 0,
        desc:"A card that slowly charges up damage, and uses all of it in one attack.",
        funnyname: "CHARGERINEKIT",
        type: "Attack",
        img: "charger.png",
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
        desc:"A prism that harnesses the power from the sun, shooting beams at no cost.",
        funnyname: "SOLAR PRISMISM",
        type: "Attack",
        img: "solarprism.png",
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
        desc:"An evil sorcerer that learned the dark ways, weakening its enemies.",
        funnyname: "WEAKENERIUM",
        type: "Attack",
        img: "weakener.png",
    },
    supplycrate: {
        name: "supplycrate",
        formal: "Supply Crate",
        hp: 30,
        manause: 2,
        coolleft: 0,
        desc:"Provides ammo for allies, assuring that they will eliminate their opponents.",
        funnyname: "SUPPLY CRATORIANITE",
        type: "Support",
        img: "",
    },
    atkpotion: {
        name: "atkpotion",
        formal: "Attack Potion",
        hp: 15,
        manause: 2,
        coolleft: 0,
        desc:"A strong potion that boosts an ally's attack by 50%.",
        funnyname: "ATTACK POTIONORIONIO",
        type: "Support",
        img: "atkpotion.png",
    },
    factory: {
        name: "factory",
        formal: "Factory",
        hp: 80,
        manause: 4,
        ammo: 1,
        maxammo: 1,
        coolleft: 0,
        cool: 2,
        desc:"An old factory known for producing efficient and deadly robots.",
        funnyname: "FACTORIDIGEN",
        type: "Support",
        img: "factory.png",
    },
    robot: {
        name: "robot",
        formal: "Robot",
        atk: 50,
        hp: 40,
        ammo: 1,
        maxammo: 1,
        manause: 1,
        cool: 1,
        coolleft: 1,
        desc:"A machine with a programming unlike others', with high and cheap damage.",
        funnyname: "ROBOTOMY",
        type: "Attack",
        obtainable: false,
        img: "robot.png",
    },
    managenerator: {
        name: "managenerator",
        formal: "Mana Generator",
        hp: 40,
        manause: 0, 
        ammo: 1,
        maxammo: 1,
        coolleft: 0,
        cool: 1,
        desc:"A janky old generator that creates mana for free.",
        funnyname: "MANA GENERATICONIC",
        type: "Support",
        img: "",
    },
    energycapsule: {
        name: "energycapsule",
        formal: "Energy Capsule",
        hp: 30,
        manause: 2, 
        ammo: 1,
        maxammo: 1,
        coolleft: 0,
        cool: 2,
        desc:"A capsule that holds enough energy to immediately activate any card.",
        funnyname: "ENERGY CAPSULIBANULI",
        type: "Support",
        img: "energycapsule.png",
    },
    dysonsphere: {
        name: "dysonsphere",
        formal: "Dyson Sphere",
        hp: 50,
        manause: 3,
        ammo: 1,
        maxammo: 1,
        coolleft: 0,
        cool: 2,
        desc:"Swirling around the sun, it creates solar prisms that consume its life force.",
        funnyname: "DYSON SPHERINICAL",
        type: "Support",
        img: "dysonsphere.png",
    },
    etherealguardian: {
        name: "etherealguardian",
        formal: "Ethereal Guardian",
        atk: 60,
        hp: 40,
        ammo: 1,
        maxammo: 1,
        manause: 1,
        cool: 1,
        coolleft: 1,
        desc:"A guardian that protects those with all its might, even preventing death.",
        funnyname: "ETHEREAL GUARDIANOSOS",
        type: "Attack",
        img: "etherealguardian.png",
    },
    jester: {
        name: "jester",
        formal: "Jester",
        atk: 20,
        hp: 10,
        ammo: 1,
        maxammo: 1,
        manause: 1,
        cool: 1,
        coolleft: 1,
        desc:"Dancing around, enemies will get confused, not knowing what to do.",
        funnyname: "JESTERIPIDES",
        type: "Attack",
        img: "",
    },
    cultist: {
        name: "cultist",
        formal: "Cultist",
        atk: 45,
        hp: 30,
        ammo: 1,
        maxammo: 1,
        manause: 2,
        cool: 2,
        coolleft: 0,
        desc:"One of the hidden conspirers that get stronger the more allies they have.",
        funnyname: "CULTISHTIDIAN",
        type: "Attack",
        img: "",
    },
    reaper: {
        name: "reaper",
        formal: "Reaper",
        atk: 50,
        hp: 40,
        ammo: 1,
        maxammo: 1,
        manause: 3,
        cool: 1,
        coolleft: 1,
        desc:"A lethal reaper, sentencing cards to an inevitable death.",
        funnyname: "REAPERITIATE",
        type: "Attack",
        img: "",
    },
    froster: {
        name: "froster",
        formal: "Froster",
        atk: 70,
        hp: 40,
        ammo: 1,
        maxammo: 1,
        manause: 2,
        cool: 1,
        coolleft: 1,
        desc:"An ice spirit that wields a powerful frost spear, freezing enemies.",
        funnyname: "FROSTERILICAL",
        type: "Attack",
        img: "froster.png",
    },
    ninja: {
        name: "ninja",
        formal: "Ninja",
        atk: 30,
        hp: 40,
        ammo: 4,
        maxammo: 4,
        manause: 1,
        cool: 1,
        coolleft: 1,
        desc:"Swift and precise, this ninja hides itself as it silently kills those around it.",
        funnyname: "NINJAMITY",
        type: "Attack",
        img: "ninja.png",
    },
    oblivion: {
        name: "oblivion",
        formal: "The Oblivion",
        atk: 200,
        hp: 70,
        ammo: 1,
        maxammo: 1,
        manause: 3,
        cool: 3,
        coolleft: 3,
        desc:"A monster from the darkness, its only will to murder.",
        funnyname: "OBLIVIONATED",
        type: "Attack",
        obtainable: false,
        img: "oblivion.png",
    },
    bus: {
        name: "bus",
        formal: "Transportation Bus",
        hp: 50,
        manause: 3,
        ammo: 1,
        maxammo: 1,
        coolleft: 0,
        cool: 3,
        desc:'"WE RIDE THE BUS, WE RIDE THE BUS, WE RIDE THE BUS!"',
        funnyname: '"WE RIDE THE BUS, WE RIDE THE BUS, WE RIDE THE BUS!"',
        type: "Support",
        img: "bus.png",
    },
    clonebox: {
        name: "clonebox",
        formal: "Clone Box",
        hp: 40,
        manause: 2,
        ammo: 1,
        maxammo: 1,
        coolleft: 0,
        cool: 2,
        desc:"A simple box that clones the first card.",
        funnyname: "CLONE BOXIHEMENTLY",
        type: "Support",
        img: "clonebox.png",
    },
    drawback: {
        name: "drawback",
        formal: "Drawback",
        hp: 10,
        manause: 2,
        ammo: 1,
        maxammo: 1,
        coolleft: 0,
        cool: 100,
        desc:"Everyone makes mistakes.",
        funnyname: "DRAWBACKIMIJIMI",
        type: "Support",
        img: "drawback.png",
    },
}

var p1 = Game.p1;
var p2 = Game.p2;
var template = {
    health: 300,
    mana: 10,
}
var openBtn = document.querySelector(".open-modal-btn");
var modal = document.querySelector(".modal-overlay");
var closeBtn = document.querySelector(".close-modal-btn");
var modalContent = byId("modal-content");
modal.classList.add("hide");
for (let i = 0; i < Object.keys(cards).length;i++) {
    let para = document.createElement("p");
    para.innerHTML = cards[Object.keys(cards)[i]].formal+":<br><span class='desc'>"+cards[Object.keys(cards)[i]].desc+"</span><br>";
    modalContent.appendChild(para);
    let img = document.createElement("img");
    img.src = "img/cards/"+cards[Object.keys(cards)[i]].img;
    console.log(img.src);
    img.width = "140";
    img.height = "160";
    modalContent.appendChild(img);
}
function openModal() {
    modal.classList.remove("hide");
}
 
function closeModal(e, clickedOutside) {
    if (clickedOutside) {
        if (e.target.classList.contains("modal-overlay"))
            modal.classList.add("hide");
    } else modal.classList.add("hide");
}
 
openBtn.addEventListener("click", openModal);
modal.addEventListener("click", (e) => closeModal(e, true));
closeBtn.addEventListener("click", closeModal);
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
    console.log(object);
    if (typeof source == "object" && source) {
        Object.keys(source).forEach(function(key) {
            console.log(key,object[key],source[key]);
            object[key] = source[key];
        });
    } else {
        return false;
    }
    
}
function drawCard(player,specific = false,choice = null,otherargs = null) {
    if (Object.keys(Game[player].inventory).length >= 10) {
        return "Too many cards!";
    }
    let chosenkey = randKey(cards);
    if (specific == true) {
        chosenkey = cards[choice];
    }
    let key = {};
    assign(key,chosenkey);
    key.effects = [];
    if (key.obtainable == false && specific == false) {
        drawCard(player);
        return false;
    }
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
    if (otherargs == null) {
        let sound = new Audio('sounds/draw-card.mp3');
        sound.volume = 0.4;
        sound.play();
    }
    
    if (key.name == "etherealguardian") {
        let chosen;
        for (let i = 0; i < Object.keys(Game[player].inventory).length; i++) {
            let tempchosen = Game[player].inventory[Object.keys(Game[player].inventory)[i]];
            if (tempchosen.effects.some(str => str.includes("Guarded")) == false) {
                chosen = tempchosen;
                break;
            }
        }
        if (chosen == null) {
        } else {
            chosen.effects.push("Guarded{1,5}")
        }
    }
    if (player == "p1") {
        if (currentmode == "Easy") {
            key.hp += 30;
            if (key.type == "Attack") {
                key.atk += 10;
            }
            if (key.type == "Healing") {
                key.heal += 10;
            }
        }
        if (currentmode == "Hard") {
            key.hp -= 20;
            if (key.hp < 5) {
                key.hp = 5;
            }
            if (key.type == "Attack") {
                key.atk *= 0.8;
                if (key.atk < 5) {
                    key.atk = 5;
                }
            }
            if (key.type == "Healing") {
                key.heal -= 10;
                if (key.heal < 5) {
                    key.heal = 5;
                }
            }
        }
        if (currentmode == "Insane") {
            key.hp -= 35;
            if (key.hp < 5) {
                key.hp = 5;
            }
            if (key.type == "Attack") {
                key.atk *= 0.6;
                if (key.atk < 5) {
                    key.atk = 5;
                }
            }
            if (key.type == "Healing") {
                key.heal -= 20;
                if (key.heal < 5) {
                    key.heal = 5;
                }
            }
        }
        if (currentmode == "Cataclysm") {
            key.hp -= 50;
            if (key.hp < 5) {
                key.hp = 5;
            }
            if (key.type == "Attack") {
                key.atk *= 0.7;
                if (key.atk < 5) {
                    key.atk = 5;
                }
            }
            if (key.type == "Healing") {
                key.heal = 0;
            }
        }
    }
    
} 

Array.from(document.getElementsByClassName("card")).forEach(function(element) {
    element.innerHTML = "loading...";
});
function formateffect(type,effect) {
    if (type == "FlatEffect") {
        let newfx = effect.split("{")[0];
        return newfx;
    }
    if (type == "Attributes") {
        let args = effect.split("{")[1];
        args = args.replace("}","").split(",");
        return args;
    }
}
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
    }
    if (p2.health <= 0) {
        gametitle.innerHTML = "YOU WIN!!!!";
    }
    if (p1.health <= 0 || p2.health <= 0) {
        whichturn.innerHTML = "<a href='.'>PLAY AGAIN</a>";
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
            if (curcard.hp <= 0 && id.includes("c")) {
                delete p1.inventory[Object.keys(Game.p1.inventory)[index]];
                update();
                return false;
            }
            if (curcard.hp <= 0 && id.includes("o")) {
                delete p2.inventory[Object.keys(Game.p2.inventory)[index]];
                update();
                return false; 
            }
            card.innerHTML = "<span class='title'>"+curcard.formal+":</span><br>"+curcard.hp+" HP | ";
            if (Object.hasOwn(curcard,"atk")) {
                card.innerHTML += curcard.atk+" ATK | ";
            }
            if (Object.hasOwn(curcard,"heal")) {
                card.innerHTML += curcard.heal+" HEAL | ";
            }
            if (Object.hasOwn(curcard,"coolleft") && Object.hasOwn(curcard,"uses") == false) {
                card.innerHTML += curcard.coolleft+" CD | ";
            }
            if (Object.hasOwn(curcard,"ammo")) {
                card.innerHTML += curcard.ammo+" AMMO | ";
            }
            if (Object.hasOwn(curcard,"tempuses")) {
                card.innerHTML += curcard.tempuses+" AMMO | ";
            }
            if (Object.hasOwn(curcard,"uses") && Object.hasOwn(curcard,"tempuses") == false) {
                card.innerHTML += curcard.uses+" USES | ";
            }
            if (Object.hasOwn(curcard,"manause")) {
                card.innerHTML += curcard.manause+" MU";
            }
            if (curcard.effects.length > 0) {
                card.innerHTML += "<br>";
                for (let i = 0; i < curcard.effects.length; i++) {
                    let args = formateffect("Attributes",curcard.effects[i]);
                    for (let z = 0; z < args.length; z++) {
                        args[z] = Number(args[z]);
                    }
                    curcard.effects[i] = formateffect("FlatEffect",curcard.effects[i])+"{"+args+"}";
                    card.innerHTML += formateffect("FlatEffect",curcard.effects[i])+" "+args[0];
                    if (curcard.effects.length-i > 1) {
                        card.innerHTML += " | ";
                    }
                }
            }
            card.innerHTML += "<br><hr><span class='desc'>"+curcard.desc+"</span>";
            // CARD IMAGES //
            /*#c1 {
                background-image:url("img/cards/solarprism.png");
                background-size: 140px 160px;
            }*/
            if (curcard.img != "") {
                card.style.backgroundImage = "url('img/cards/"+curcard.img+"')";
                card.style.backgroundSize = "140px 160px";
                if (curcard.name == "oblivion" && curcard.manause == 0.5 && curcard.cool == 1) {
                    card.style.backgroundImage = "url('img/cards/enragedoblivion.png')";
                }
            } else {
                card.style.backgroundImage = null;
            }
            /*
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
            }*/
            
        } else {
            card.innerHTML = "NO CARD";
            card.style.backgroundImage = null;  
        }
    
    });
}
function start() {
    for (let i = 0; i < 3; i++) {
        drawCard("p1",false,null,"Start");
    }
    for (let j = 0; j < 3; j++) {
        drawCard("p2",false,null,"Start");
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
        let chosen;
        for (let i = 0; i < Object.keys(plr.inventory).length; i++) {
            if (plr.inventory[Object.keys(plr.inventory)[i]].effects.some(str => str.includes("Camouflaged")) == false) {
                chosen = Object.keys(plr.inventory)[i];
                break;
            }
        }
        if (chosen == null) {
            return "Opp";
        }
        return chosen;
    } else {
        return "Opp";
    }
}
function turnover(player) {
    // argument 'player' means the player that just ended their turn
    turns++;
    let curdeath;
    if (turns % 20 == 0) {
        if (deathmode != "") {
            curdeath = deathmode.replace("[DEATH MODE ","");
            curdeath = Number(curdeath.replace("]",""));
        } else {
            curdeath = 0;
        }
        deathmode = "[DEATH MODE "+(curdeath+1)+"]";
        if (currentmode == "Hard") {
            p1.health += 20;
            p2.health += 20;
        }
        if (currentmode == "Insane") {
            p1.health += 50;
            p2.health += 50;
        }
        if (currentmode == "Cataclysm") {
            p1.health += 70;
            p2.health += 70;
        }
        p1.health -= 30;
        p2.health -= 30;
        p1.mana += 15;
        p2.mana += 15;
        if (p1.health > p2.health) {
            p2.mana += 10;
            p1.health -= 15;
        } else {
            p1.mana += 10;
            p2.health -= 15;
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
        if (currentmode == "Cataclysm" && player == "p1") {
            zecard.hp -= 20;
        }
        for (let j = 0; j < zecard.effects.length;j++) {
            let effect = zecard.effects[j];
            let args = formateffect("Attributes",effect);
            args[0] = Number(args[0]);
            args[1] = Number(args[1]);
            let flatfx = formateffect("FlatEffect",effect);
            // [0] == scale; [1] == timeleft
            if (flatfx == "Burning") {
                zecard.hp -= Number(args[0])*8;
            }
            if (flatfx == "Frozen") {
                zecard.hp -= Number(args[0])*15;
                if (Object.hasOwn(zecard,"atk")) {
                    zecard.atk -= 10;
                    if (zecard.atk < 5) {
                        zecard.atk = 5;
                    }
                }
            }
            if (flatfx == "Fear") {
                zecard.coolleft += 1;
                if (Object.hasOwn(zecard,"atk")) {
                    zecard.atk -= 10;
                }
            }
            if (args[0] > 1) {
                args[0] -= 1;
            }
            if (args[1] > 1) {
                args[1] -= 1;
            }
            zecard.effects[j] = flatfx+"{"+args.toString()+"}";
            if (args[1] == 1) {
                if (flatfx == "Death") {
                    delete plr.inventory[Object.keys(plr.inventory)[i]];
                    continue;
                }
                zecard.effects.splice(j,1);
                
                
            }
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
function unborder(id) {
    document.getElementById(id).style.border = "1px solid black";
    document.getElementById(id).style.backgroundColor = null;
}
function playerTurn() {
    turnover("p2");
    p2.mana += 5;
    if (currentmode == "Easy") {
        p2.mana -= 1;
    }
    if (currentmode == "Hard") {
        p2.mana += 3;
    }
    if (currentmode == "Insane") {
        p2.mana += 5;
    }
    if (currentmode == "Cataclysm") {
        p2.mana += 7;
    }
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
                if (chosencard.name == "Drawback") {
                    let chance = randNum(1,4);
                    if (chance == 4) {
                        done = true;
                    }
                    if (Object.keys(p2.inventory).length < 3) {
                        done = false;
                    }
                } else {
                    done = true;
                }
                
            }
        }
       
        tries++;
    } while (p2.mana > 0 && tries < 200 && done == false);
    useCard(null,true,index);
}
function oppDraw() {
    if (Object.keys(p2.inventory).length < 10) {
        drawCard("p2");
        p2.mana -= 3;
        if (randNum(0,1) == 1) {
            oppAttack();
        }   
    }
    
}
function oppTurn() {
    // states: spend, save, neutral
    turnover("p1");
    p1.mana += 5;
    if (currentmode == "Easy") {
        p1.mana += 5;
    }
    if (currentmode == "Hard") {
        p1.mana -= 1;
    }
    if (currentmode == "Insane") {
        p1.mana -= 2;
    }

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
    } else {
        if (index != null) {
            element = document.getElementById("o"+(index+1));
            id = element.getAttribute("id");
        }
        
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
        if (card.effects.some(str => str.includes("Stunned")) || card.effects.some(str => str.includes("Frozen"))) {
            return false;
        }
        if (card.coolleft == 0 && user.mana >= card.manause) {
            if (element != null) {
                element.style.border = "3px solid maroon";
                window.setTimeout(unborder,500,id);
            }
            if (card.type == "Attack") {
                user.mana -= card.manause;
                let attacked = firstOpp(stropp);
                if (attacked == "Opp") {
                    opponent.health -= card.atk;
                } else {
                    let zeattacked = opponent.inventory[attacked];
                    if (card.effects.some(str => str.includes("Confused")) == true) {
                        zeattacked.hp += card.atk*2;
                    } else {
                        let sound = new Audio('sounds/sword.mp3');
                        sound.volume = 0.4;
                        sound.play();
                        
                        
                    }
                    
                    
                    opponent.inventory[attacked].hp -= card.atk;
                    if (card.name == "solarprism") {
                        opponent.health -= card.atk;
                    }
                    if (card.name == "charger") {
                        card.atk = 20;
                    }
                    if (card.name == "weakener") {
                        let chosen;
                        for (let i = 0; i < Object.keys(opponent.inventory).length; i++) {
                            let tempchosen = opponent.inventory[Object.keys(opponent.inventory)[i]];
                            if (tempchosen.type == "Attack") {
                                chosen = tempchosen;
                                break;
                            }
                        }
                        if (chosen == null || chosen.type != "Attack") {
                            opponent.health -= 30;
                        } else {
                            chosen.atk -= 15;
                            if (chosen.atk < 5) {
                                chosen.atk = 5;
                            }
                        }
                        
                    }
                    if (card.name == "oblivion" && index != null && index == 0) {
                        opponent.inventory[attacked].hp += card.atk;
                        user.mana += card.manause;
                        card.ammo += 1;
                    }
                    if (card.name == "oblivion" && index != 0 && zeattacked.hp - card.atk <= 0) {
                        card.cool -= 1;
                        card.manause -= 0.5
                        if (card.cool < 1) {
                            card.cool = 1;
                        }
                        if (card.manause < 0.5) {
                            card.manause = 0.5;
                        }
                    }
                    if (card.name == "flamethrower") {
                        let substr = "Burning";
                        if (zeattacked.effects.some(str => str.includes(substr)) == true) {
                            let zeval = zeattacked.effects.filter(str => str.includes(substr))[0];
                            let index = zeattacked.effects.indexOf(zeval);
                            let args = formateffect("Attributes",zeval);
                            args[0] = Number(args[0]);
                            args[0] += 1;
                            zeattacked.effects[index] = "Burning{"+args[0]+","+args[1]+"}";
                        }
                        if (zeattacked.effects.some(str => str.includes(substr)) == false) {
                            zeattacked.effects.push("Burning{1,1}");
                        }
                        
                    }
                    if (card.name == "ninja") {
                        if (card.effects.some(str => str.includes("Camouflaged")) == false) {
                            card.effects.push("Camouflaged{1,2}");
                        }
                    }
                    if (card.name == "juggernaut" || card.name == "sniper") {
                        let substr = "Stunned";
                        if (zeattacked.effects.some(str => str.includes(substr)) == false) {
                            zeattacked.effects.push("Stunned{1,1}");
                        }
                    }
                    if (card.name == "reaper") {
                        let substr = "Death";
                        let mosthp = 0;
                        let chosen;
                        let tries = 0;
                        // rare error found here, reason stil unknown
                        do {
                            mosthp = 0;
                            chosen = null;
                            for (let i = 0; i < Object.keys(opponent.inventory).length; i++) {
                                let tempchosen = opponent.inventory[Object.keys(opponent.inventory)[i]];
                                if (tempchosen.hp > mosthp && tempchosen.effects.some(str => str.includes(substr)) == false) {
                                    chosen = tempchosen;
                                    mosthp = chosen.hp;
                                    console.log("YOO");
                                }
                                console.log(chosen,tempchosen,mosthp,i);
                            }
                            tries++;
                            console.log(chosen,mosthp);
                        } while (tries < 50 && chosen.effects.some(str => str.includes(substr)) == true)
                        if (chosen == null) {
                           
                        } else {
                            if (chosen.effects.some(str => str.includes(substr)) == false) {
                                chosen.effects.push("Death{1,4}");
                            }
                        }
                    }
                    if (card.name == "froster") {
                        let substr = "Frozen";
                        let mostatk = 0;
                        let chosen;
                        let tries = 0;
                        do {
                            mostatk = 0;
                            chosen = null;
                            for (let i = 0; i < Object.keys(opponent.inventory).length; i++) {
                                let tempchosen = opponent.inventory[Object.keys(opponent.inventory)[i]];
                                if (Object.hasOwn(tempchosen,"atk")) {
                                    if (tempchosen.atk > mostatk && tempchosen.coolleft < 2 && tempchosen.effects.some(str => str.includes(substr)) == false) {
                                        chosen = tempchosen;
                                        mostatk = chosen.atk;
                                    }
                                }
                                
                            }
                            tries++;
                        } while (tries < 50 && chosen.effects.some(str => str.includes(substr)) == true)
                        if (chosen == null) {
                           
                        } else {
                            if (chosen.effects.some(str => str.includes(substr)) == false) {
                                chosen.effects.push("Frozen{1,3}");
                            }
                        }
                    }
                    if (card.name == "jester") {
                        let substr = "Confused";
                        let chosen;
                        for (let i = 0; i < Object.keys(opponent.inventory).length; i++) {
                            let tempchosen = opponent.inventory[Object.keys(opponent.inventory)[i]];
                            if (tempchosen.type == "Attack" && tempchosen.effects.some(str => str.includes(substr)) == false) {
                                chosen = tempchosen;
                                break;
                            }
                        }
                        if (chosen == null || chosen.type != "Attack") {
                           
                        } else {
                            if (chosen.effects.some(str => str.includes(substr)) == false) {
                                chosen.effects.push("Confused{1,2}");
                            }
                        }
                        
                    }
                    if (card.name == "cultist") {
                        let add = 0;
                        let chosen;
                        for (let i = 0; i < Object.keys(user.inventory).length; i++) {
                            let tempchosen = user.inventory[Object.keys(user.inventory)[i]];
                            if (tempchosen.name == "cultist") {
                                add += 30;
                            }
                        }
                        zeattacked.hp -= add;
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
                        if (zeattacked.effects.some(str => str.includes("Guarded")) == false) {
                            delete opponent.inventory[attacked];
                        } else {
                            let zeval = zeattacked.effects.filter(str => str.includes("Guarded"))[0];
                            let index = zeattacked.effects.indexOf(zeval);
                            zeattacked.effects.splice(index,1);
                            zeattacked.hp = 30;
                        }
                        
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
                let sound = new Audio('sounds/heal.mp3');
                sound.volume = 0.4;
                sound.play();
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
                let sound = new Audio('sounds/item.mp3');
                sound.volume = 0.4;
                sound.play();
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
                if (card.name == "factory") {
                    drawCard(strmain,true,"robot");
                    card.ammo -= 1;
                    if (card.ammo <= 0) {
                        card.coolleft = card.cool;
                        card.ammo = card.maxammo;
                    }
                }
                if (card.name == "managenerator") {
                    user.mana += 1.5;
                    card.ammo -= 1;
                    if (card.ammo <= 0) {
                        card.coolleft = card.cool;
                        card.ammo = card.maxammo;
                    }
                }
                if (card.name == "energycapsule") {
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
                    chosen.coolleft = 0;
                    if (chosen.cool > 1) {
                        chosen.cool -= 1;
                    }
                    card.ammo -= 1;
                    if (card.ammo <= 0) {
                        card.coolleft = card.cool;
                        card.ammo = card.maxammo;
                    }
                }
                if (card.name == "dysonsphere") {
                    drawCard(strmain,true,"solarprism");
                    card.ammo -= 1;
                    let chosen = firstOpp(stropp);
                    let substr = "Fear";
                    if (chosen != "Opp") {
                        chosen = opponent.inventory[chosen];
                        if (chosen.effects.some(str => str.includes(substr)) == false) {
                            chosen.effects.push("Fear{1,1}");
                            chosen.coolleft += 1;
                        }
                    }
                    if (card.ammo <= 0) {
                        card.coolleft = card.cool;
                        card.ammo = card.maxammo;
                    }
                }
                if (card.name == "clonebox") {
                    if (index != null && index == 0) {
                        drawCard(strmain,true,"oblivion")
                    } else {
                        drawCard(strmain,true,Object.keys(user.inventory)[0]);
                    }
                    
                    card.ammo -= 1;
                    if (card.ammo <= 0) {
                        card.coolleft = card.cool;
                        card.ammo = card.maxammo;
                    }
                }
                if (card.name == "bus") {
                    let card1 = user.inventory[Object.keys(user.inventory)[0]];
                    let card2 = user.inventory[Object.keys(user.inventory)[Object.keys(user.inventory).length-1]];
                    user.inventory[Object.keys(user.inventory)[0]] = card2;
                    user.inventory[Object.keys(user.inventory)[Object.keys(user.inventory).length-1]] = card1;
                    
                    card.ammo -= 1;
                    if (card.ammo <= 0) {
                        card.coolleft = card.cool;
                        card.ammo = card.maxammo;
                    }
                }
                if (card.name == "drawback") {
                    let tempmana = 0;
                    let temphp = 0;
                    for (let i = 0; i < Object.keys(user.inventory).length; i++) {
                        let tempcard = user.inventory[Object.keys(user.inventory)[i]];
                        tempmana += tempcard.hp/13;
                        temphp += tempcard.hp/3.5;
                    }
                    temphp = Math.round(temphp);
                    tempmana = Math.round(tempmana);
                    user.mana += tempmana;
                    user.health += temphp;
                    user.inventory = {};
                    update();
                    return;
                }
                user.mana -= card.manause;
            }
        }
    }
    update();
}
start();
/*function hideStat(element,show) {
    console.log("YES");
    let id = element.getAttribute("id");
    let index = Number(id.replace("c",""))-1;
    let card = p1.inventory[Object.keys(p1.inventory)[index]];
    console.log(card,index);
    if (show == true) {
        /*text-indent: 100%;
    white-space: nowrap;
    overflow: hidden;
        console.log("BA");
        element.style.fontSize = null;
        element.style.whiteSpace = null;
        element.style.overflow = null;
        element.style.backgroundImage = null;   
    } else {
        console.log("MA");
        element.style.fontSize = "0 !important";
        element.style.overflow = "hidden";
        if (card.name == "solarprism") {
            console.log("YAAA");
            element.style.backgroundImage = "url('img/cards/solarprism.png')";
            element.style.backgroundSize = "140px 160px";
        } else {
            console.log("NAAA");
            element.style.backgroundImage = null;   
        }
    }
}*/
Array.from(document.getElementsByClassName("card")).forEach(function(element) {
    element.addEventListener('click', function() {
        useCard(element);
    });
    /*element.addEventListener('mouseover', function() {
        hideStat(element,true);
    });
    element.addEventListener('mouseout', function() {
        hideStat(element,false);
    });*/
});
turnbtn.addEventListener('click',function(){
    if (turn == 1) {
        oppTurn();
    }
    
    
});
drawbtn.addEventListener('click',function(){
    if (p1.mana >= 3 && turn == 1 && Object.keys(p1.inventory).length < 10) {
        p1.mana -= 3;
        drawCard("p1");
        update();
    }
    
});
modebtn.addEventListener('click',function() {
    if (currentmode == "Easy") {
        currentmode = "Normal";
        p1.health = 300;
        p2.health = 300;
        modetext.innerHTML = "Current Mode: Normal"
    }
    if (currentmode == "Cataclysm") {
        currentmode = "Easy";
        p1.health = 500;
        p2.health = 250;
        modetext.innerHTML = "Current Mode: Easy";
    }
    if (currentmode == "Insane") {
        currentmode = "Cataclysm";
        p1.health = 70;
        p2.health = 650;
        modetext.innerHTML = "Current Mode: Cataclysm";
    }
    if (currentmode == "Hard") {
        currentmode = "Insane";
        p1.health = 125;
        p2.health = 500;
        modetext.innerHTML = "Current Mode: Insane";
    }
    if (currentmode == "Normal") {
        currentmode = "Hard";
        p1.health = 200;
        p2.health = 350;
        modetext.innerHTML = "Current Mode: Hard";
    }
    update();
});