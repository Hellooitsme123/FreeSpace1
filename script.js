function byId(id) {
    return document.getElementById(id);
}

var p1txt = byId("p1");
var p2txt = byId("p2");
var gametitle = byId("gametitle");
var battletitle = byId("battletitle");
var turnbtn = byId("turn");
var modebtn = byId("mode");
var modetext = byId("curmode");
var currentmode = "Normal";
var whichturn = byId("whichturn");
var drawbtn = byId("draw");
var discardbtn = byId("discard");
var focused;
var turns = 0;
var unselectbtn = byId("endselect");
// menu
var playbtn = byId("play");
var menuscreen = byId("menu");
var backgroundscreen = byId("background");
var modescreen = byId("modes");
var startmodsscreen = byId("startingmods");
var adventurescreen = byId("adventure");
var gamescreen = byId("game");
var sob = 1; // start or battle? 1 = start | 2 = battle
var skipped = false;
// adventure screen vars
var enemies = {
    "andreas": {
        name: "andreas",
        formal: "Andreas",
        managain: 4,
        maxdiscards: 0,
        // battle stats
        health: 100,
        mana: 6,
        discards: 0,
        inventory: {},
        simpledeck: ["spearman","turret"],
        deck: {},
        mods: [],
    },
    "taverngroup": {
        name: "taverngroup",
        formal: "Tavern Regulars",
        managain: 5,
        maxdiscards: 1,
        // battle stats
        health: 140,
        mana: 6,
        discards: 1,
        inventory: {},
        simpledeck: ["spearman","atkpotion","weakener","turret"],
        deck: {},
        mods: [],
    },
    "janjo": {
        name: "janjo",
        formal: "Janjo, Tavern Owner",
        managain: 7,
        maxdiscards: 1,
        // battle stats
        health: 200,
        mana: 8,
        discards: 1,
        inventory: {},
        simpledeck: ["flamethrower","healbubble","weakener","soulkeeper","etherealguardian"],
        deck: {},
        mods: ["FlameTouch{3,2}"],
    }
}
var locations = {
    "home": {
        name: "home",
        formal: "Home",
        desc: "Your humble house. Where everything all starts.",
        loretext: "A few days ago, UncleMan threatened to evict you, saying that you're a lazy couch potato that does nothing. Since becoming a homeless beggar is the last thing you want to do, you ask him for ways to stay in the house. Finally, he gives you a daunting task: Find the Bean Duplicator. A rare relic found only in the dangerous mountains, visible shaking begins. Starting with only 100 coda coins and 3 spearmen, you begin your journey to prevent yourself from getting evicted.",
        proceedtext: "Start your journey by taking the road to Coda.",
        nextloc: "roadtocoda",
    },
    "roadtocoda": {
        name: "roadtocoda",
        formal: "Road To Coda",
        desc: "The long path to Coda, one of the biggest cities in the world. There, you'll be able to stock up on cards to continue your journey.",
        loretext: "You start the trip to Coda, journeying along the path with your cards and some money. On the road, a man comes up to you, noticing your cards. He says name is Andreas, and he offers to give you powerful cards if you can beat him. However, if you lose, you have to give him all of your cards. It seems sketchy, but some better cards would be very useful.",
        proceedtext: "Battle it out with Andreas for a chance of getting some special cards.",
        proceedspecial: "fight|andreas",
        nextloc: "andreasvictory",
        skipallowed: true,
    },
    "andreasvictory": {
        name: "andreasvictory",
        formal: "Road To Coda",
        desc: "Andreas defeated!",
        altdesc: "Too good to be true!",
        loretext: "You win against Andreas, who enters a foul mood after losing. His want to scam you is clearly visible, but he reluctantly pulls out his card pack. You get to choose one of three cards: ",
        alttext: "'Powerful' cards? That doesn't seem right. What if he's hogging them all for himself, and if he somehow loses, he'll just give out one of his weaker cards? You decline the suspicious offer.",
        special: "gaincard",
        proceedtext: "Get back up and make your way to the center of Owarp, where the trading hubs reside.",
        nextloc: "owarpcenter",
    },
    "owarpcenter": {
        name: "owarpcenter",
        formal: "Center of Owarp",
        desc: "Further down the road, the center of Owarp contains marketplaces and buildings, with tons of opportunities to increase your deck of cards and get special upgrades to aid yourself in battle.",
        loretext: "After getting back up and continuing your journey, you reached the center of Owarp. Here, resides one of the biggest plazas in Boraps, so you decide that you must make the most of your time here. One of the stores in the plaza, known as Tallmart, contains a lot of useful cards. However, you don't have enough to buy them.",
        proceedtext: "Enter the card battling tavern to earn cards and coda coins.",
        nextloc: "tavern",
    },
    "tavern": {
        name: "tavern",
        formal: "Janjo's Tavern",
        desc: "A tavern made by the one and only Janjo, allowing people to talk about cards and drink at the same time.",
        loretext: "You enter the tavern, instantly getting greeted by a loud cacophony of chatter and glass clinking and card drawing. You find a group that is willing to battle with you, offering a prize of 50 coda coins if you win. However, if you lose, you'll have to pay 50 coda coins. Wouldn't it be nice to have some better cards?",
        proceedtext: "Fight the group for a chance to earn some money.",
        proceedspecial: "fight|taverngroup",
        nextloc: "taverngroupvictory",
        skipallowed: true,
    },
    "taverngroupvictory": {
        name: "taverngroupvictory",
        formal: "Janjo's Tavern",
        desc: "The taverngoers have been defeated!",
        altdesc: "You decided to not fight the taverngoers.",
        loretext: "You gained about 50 coins from your victory, despite having only a few cards. Word spread around the tavern about your skill, and before you could leave, you were confronted by the tavern owner, Janjo. He proposed a bet of 100 coda coins and a special upgraded card, saying that whoever lost has to pay the winner. It's risky, but the reward is much more than enough to get a few things at Tallmart. Do you accept the bet?",
        alttext: "You decided to not fight the tavern group, intimidated by their cards. However, you soon stumble upon an even stronger opponent. The tavern owner himself. You talked with him, telling him about your card adventures. Eventually, he proposed a bet of 100 coda coins and a special upgraded card, saying that whoever lost has to pay the winner. He said it'll be a helpful reward for you, but you'll only get it if you're worthy enough. However, the prize money is undoubtedly handsome sum. Do you accept the bet?",
        proceedtext: "Battle Janjo for a chance to get 100 coda coins.",
        proceedspecial: "fight|janjo",
        nextloc: "janjovictory",
        skipallowed: true,
    },
    "janjovictory": {
        name: "janjovictory",
        formal: "Janjo's Tavern",
        desc: "You won against Janjo!",
        altdesc: "You decided to not take Janjo's proposal.",
        loretext: "In a miraculous turn of events, you defeated the tavern owner himself! Chatter bursted throughout the building, but you dashed out before any other challengers could appear. Now, with the amount of coins you have, there's no doubt you'll be able to purchase a few aids for your adventure.",
        alttext: "Too scared to take the deal, you decided that it'll be better to play it safe. You're worried about whether or not you'll have enough to purchase a sufficient amount of items for your journey, but you decide to go to Tallmart anyways.",
        special: "gaincardupg",
        proceedtext: "Go to Tallmart to buy upgrades for your journey.",
        nextloc: "tallmart",
    },
    "tallmart": {
        name: "tallmart",
        formal: "Tallmart",
        desc: "A tall store that contains a wide range of items to buy, from food to nukes to cards.",
        loretext: "You step into the store, the faint, generic shopping music playing. Struggling to breathe the thick night air, tired from all of your traveling, you look at the aisles.",
        proceedtext: "Leave the store and continue your trek along the road.",
        special: "tallmart",
        nextloc: "zeend",
    },
    "zeend": {
        name: "zeend",
        formal: "THE END",
        desc: "You have beaten the demo. Good job!",
        loretext: "You see a laid down 8 in front of you, with a condescending aura surrounding it. You have started the infinity loop.",
        proceedtext: "This is your destiny..",
        proceedspecial: "fight|taverngroup",
        special: "gaincard",
        nextloc: "fight",
    },
}
// adventure screen
var curoverview = byId("currentoverview");
var curloctxt = byId("curloc");
var curlocdesctxt = byId("curlocdesc");
var curlocation = locations["home"];
var loretxt = byId("loretext");
var proceedtxt = byId("proceed");
var proceeddesc = byId("proceeddesc");
var travelbtn = byId("travel");
var specialdiv = byId("special");
var specialdiv2 = byId("special2");
var statsdiv = byId("plrstats");
var inventorydiv = byId("plrinventory");
var inventorytable;
var speciallock = false;
var speciallock2 = false;
var curspecial = null;
var alttravelbtn = byId("alttravel");
// new run vars
var startmod;
// CARD MODES
var cardmode = 1; // 1 == use, 2 == select;
var togglecardmode = byId("togglecardmode");
var customselect = byId("customoptions");
var customtype = "";
var deathmode = "";
var Game = {
    turn: 1,
    p1: {
        managain: 5,
        maxdiscards: 1,
        coins: 20,
        startingmana: 10,
        // battlestats
        health: 300,
        mana: 10,
        discards: 1,
        inventory: {},
        deck: {},
        battledeck: {},
        mods: [],
    },
    p2: {
        managain: 5,
        maxdiscards: 1,
        // battlestats
        health: 300,
        mana: 10,
        discards: 1,
        inventory: {},
        deck: {},
        battledeck: {},
        mods: [],
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
        img: "spearman.png",
        sound: "sword.mp3",
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
        img: "wizard.png",
        sound:"spell1.mp3",
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
        img: "turret.png",
        sound: "shoot.mp3",
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
        img: "sniper.png",
        sound: "shoot.mp3",
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
        sound: "bash.mp3",
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
        sound: "burn.mp3",
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
        sound: "laser.mp3",
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
        sound: "curse1.mp3",
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
        img: "supplycrate.png",
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
        img: "managenerator.png",
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
        img: "jester.png",
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
        img: "cultist.png",
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
        img: "reaper.png",
        sound: "scythe.mp3"
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
        sound: "freeze.mp3",
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
        type: "Action",
        img: "drawback.png",
    },
    bank: {
        name: "bank",
        formal: "Mana Bank",
        hp: 50,
        manause:0,
        ammo: 1,
        maxammo: 1,
        storedmana: 0,
        coolleft: 0,
        cool: 1,
        desc:"Slowly stores mana. Use to destroy this card and gain all stored mana.",
        funnyname: "BANKOBULATOR",
        type: "Support",
        img: "bank.png",
    },
    bandit: {
        name: "bandit",
        formal: "Mountain Bandit",
        atk: 50,
        hp: 40,
        ammo: 1,
        maxammo: 1,
        manause: 2,
        cool: 1,
        coolleft: 1,
        desc:"A traveler that goes from hill to hill, searching for someone to plunder.",
        funnyname: "BANDITODOBI",
        type: "Attack",
        img: "bandit.png",
    },
    armageddon: {
        name: "armageddon",
        formal: "Armageddon",
        hp: 50,
        manause:4,
        ammo: 1,
        maxammo: 1,
        coolleft: 0,
        cool: 1,
        desc:"The final day has come..",
        funnyname: "ARMAGEDDONCI",
        type: "Action",
        img: "armageddon.png",
    },
    ritual: {
        name: "ritual",
        formal: "Dark Ritual",
        hp: 30,
        manause:3,
        ammo: 1,
        maxammo: 1,
        coolleft: 0,
        cool: 1,
        desc:"The cloaked shadows gather around the altar, and they begin..",
        funnyname: "RITUALIMITY",
        type: "Action",
        img: "ritual.png",
    },
    teslacoil: {
        name: "teslacoil",
        formal: "Tesla Coil",
        atk: 50,
        hp: 40,
        ammo: 2,
        maxammo: 2,
        manause: 2.5,
        cool: 2,
        coolleft: 2,
        desc:"ZAP! ZAP!! Deal damage to every enemy card, not just the first one.",
        funnyname: "TESLA COILONOSCOPY",
        type: "Attack",
        img: "teslacoil.png",
    },
}
// GET SOUNDS

var aimode = 1;
var modetick = 0;
var p1 = Game.p1;
var p2 = Game.p2;
var opptries = 0;
var oppturndone = false;
var blockoppturn = false;
var blockturnover = false;
var template = {
    formalname: "",
    health: 300,
    mana: 10,
    discards: 1,
    inventory: {},
    deck: {},
    battledeck: {},
}
var openBtn = document.querySelector(".open-modal-btn");
var modal = document.querySelector(".modal-overlay");
var closeBtn = document.querySelector(".close-modal-btn");
var modalContent = byId("modal-content");
modal.classList.add("hide");
var keynames = ["name","formal","atk","hp","manause","ammo","maxammo","cool","coolleft","type","heal","uses","tempuses","obtainable","storedmana","sound"];
var keyformal = ["Name","Formal Name","Attack","Health","Mana Use","Ammo","Maximum Default Ammo","Cooldown","Starting Cooldown","Card Type","Heal","Uses","Obtainable By Drawing Cards","Stored Mana","Sound"];
for (let i = 0; i < Object.keys(cards).length;i++) {
    let para = document.createElement("p");
    para.innerHTML = "<h3>"+cards[Object.keys(cards)[i]].formal+":</h3><p>"+cards[Object.keys(cards)[i]].desc+"</p><h4>Attributes</h4>";
    Object.keys(cards[Object.keys(cards)[i]]).forEach(function (key) {
        let val = cards[Object.keys(cards)[i]][key];
        let keyindex = keynames.indexOf(key);
        let formalkeyname = keyformal[keyindex];
        if (key != "funnyname" && key != "desc" && key != "img") {
            para.innerHTML += formalkeyname+": "+val+"<br>";
        }
        // use val
    });
    
    modalContent.appendChild(para);
    let img = document.createElement("img");
    img.src = "img/cards/"+cards[Object.keys(cards)[i]].name+".png";
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
    //console.log(object);
    if (typeof source == "object" && source) {
        Object.keys(source).forEach(function(key) {
            //console.log(key,object[key],source[key]);
            object[key] = source[key];
        });
    } else {
        return false;
    }
    
}
function setDisplay(element,value) {
    element.style.display = value;
}
function fullSD(element,successor,t1,t2) {
    element.style.opacity = 0;
    successor.style.opacity = 1;
    setDisplay(successor,t2);
    window.setTimeout(setDisplay,200,element,t1);
}
function drawCard(player,specific = false,choice = null,otherargs = null) {
    let table = "inventory";
    if (otherargs == null) {
        
    }
    if (otherargs == "addToDeck") {
        table = "deck";
    } 
    if (Object.keys(Game[player][table]).length >= 10) {
        return "Too many cards!";
    }

    let chosenkey;
    chosenkey = randKey(Game[player].deck);
    if (otherargs == "addToDeck") {
        chosenkey = randKey(cards);
        
    }
    if (specific == true) {
        chosenkey = cards[choice];
    }
    console.log(chosenkey,choice);
    let key = {};
    assign(key,chosenkey);
    key.effects = [];
    if (key.obtainable == false && specific == false && otherargs == null) {
        drawCard(player);
        return false;
    }
    
    if (Object.hasOwn(Game[player][table],key.name)) {
        let i2 = 0;
        do {
            i2++;
        } while (i2 <1000 && Object.hasOwn(Game[player][table],key.name+i2));
        
        if (Object.hasOwn(Game[player][table],key.name+i2) == false) {
            Game[player][table][key.name+i2] = key;
        }
    } else {
        Game[player][table][key.name] = key;
    }
    let sound = new Audio('sounds/draw-card.mp3');
    sound.volume = 0.4;
    sound.play();
    if (otherargs == null) {
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
                key.hp *= 1.5;
                if (key.type == "Attack") {
                    key.atk *= 1.5;
                }
                if (key.type == "Healing") {
                    key.heal *= 1.5;
                }
            }
            if (currentmode == "Hard") {
                key.hp *= 0.8;
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
                    key.heal *= 0.8;
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
                key.hp *= 0.5;
                if (key.hp < 5) {
                    key.hp = 5;
                }
                if (key.type == "Attack") {
                    key.atk *= 0.5;
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
    
    update();
    return Object.keys(Game[player][table])[Object.keys(Game[player][table]).length-1];
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
function cleanseModifier(type,mod) {
    if (type=="Norm") {
        let newmod = mod.split("{")[1];
        let nmp2 = newmod[1].replace("}","");
        return [newmod[0],nmp2];
    }
}
function update(reset = null) {
    gametitle.innerHTML = "GAME O' CARDS "+deathmode;
    p1txt.innerHTML = "You: "+p1.health+" Health | "+p1.mana+" Mana";
    p2txt.innerHTML = p2.formal+": "+p2.health+" Health | "+p2.mana+" Mana | AI MODE "+aimode+" (for testing)";
    discardbtn.innerHTML = "Discard ("+p1.discards+" left)";
    if (turn == 1) {
        whichturn.innerHTML = "YOUR TURN";
    } else {
        whichturn.innerHTML = "OPP TURN";
    }
    if (reset == null && adventurescreen.style.display == "none") {
        if (p1.health <= 0) {
            gametitle.innerHTML = "YOU LOSE!!!!";
            endBattle(2);
        }
        if (p2.health <= 0) {
            gametitle.innerHTML = "YOU WIN!!!!";
            endBattle(1);
        }
    }
    
    /*if (p1.health <= 0 || p2.health <= 0) {
        whichturn.innerHTML = "<a href='.'>PLAY AGAIN</a>";
        throw new Error('GAME ENDED');
    }*/
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
            if (Object.hasOwn(curcard,"coolleft")) {
                if (Object.hasOwn(curcard,"uses") && curcard.uses != -1) {

                } else {
                    card.innerHTML += curcard.coolleft+" CD | ";
                }
                
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
            if (Object.hasOwn(curcard,"storedmana")) {
                card.innerHTML += curcard.storedmana+" STORED MANA | ";
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
            let tempimg;
            if (curcard.img != "") {
                tempimg = "url(img/cards/"+curcard.name+".png)";  
                card.style.backgroundSize = "140px 160px";
                if (curcard.name == "oblivion" && curcard.manause == 0.5 && curcard.cool == 1) {
                    tempimg = "url('img/cards/enragedoblivion.png')";
                }
                
            } else {
                tempimg = "url()";
                card.style.backgroundSize = "140px 160px";
            }
            if (curcard.effects.some(str => str.includes("Camouflaged")) == true) {
                tempimg += ", url(img/foils/camofoil.png)";
            }
            if (curcard.effects.some(str => str.includes("Frozen")) == true) {
                tempimg += ", url(img/foils/frostfoil.png)";
            }
            if (curcard.effects.some(str => str.includes("Confused")) == true) {
                tempimg += ", url(img/foils/confusedfoil.png)";
            }
            if (curcard.effects.some(str => str.includes("Burning")) == true) {
                tempimg += ", url(img/foils/burningfoil.png)";
            }
            if (curcard.effects.some(str => str.includes("Stunned")) == true) {
                tempimg += ", url(img/foils/stunnedfoil.png)";
            }
            if (curcard.effects.some(str => str.includes("Guarded")) == true) {
                tempimg += ", url(img/foils/guardedfoil.png)";
            }
            if (curcard.effects.some(str => str.includes("Shock")) == true) {
                tempimg += ", url(img/foils/shockfoil.png)";
            }
            if (curcard.effects.some(str => str.includes("Fear")) == true) {
                tempimg += ", url(img/foils/fearfoil.png)";
            }
            if (curcard.effects.some(str => str.includes("Death")) == true) {
                tempimg += ", url(img/foils/deathfoil.png)";
            }
            card.style.backgroundSize = "140px 160px";
            card.style.backgroundImage = tempimg;
            
            
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
function resetBattleUI(){
    p1.inventory = {};
    p2.inventory = {};
    update(true);
}
function startBattle(enemy) {
    let zeopp = enemies[enemy];
    battletitle.innerHTML = "Fight Against "+zeopp.formal;
    p1.mana = p1.startingmana;
    assign(p2,zeopp);
    for (let i = 0; i<zeopp.simpledeck.length; i++) {
        drawCard("p2",true,zeopp.simpledeck[i],"addToDeck");
    }
    for (let i = 0; i < 3; i++) {
        drawCard("p1",false,null,"Start");
    }
    for (let j = 0; j < 3; j++) {
        drawCard("p2",false,null,"Start");
    }
    gamescreen.style.display = "block";
    update();
}
function endBattle(outcome) {
    // 1 == win | 2== lose
    if (outcome == 1) {
        curlocation = locations[p2.name+"victory"];
        resetBattleUI();
        fullSD(gamescreen,menuscreen,"none","block");
        sob = 2;
        //window.setTimeout(enterAdventureScreen,200);
        gametitle.innerHTML = "Victory!";
        playbtn.innerHTML = "CONTINUE";
        openBtn.style.display = "none";
        let enemy = enemies[p2.name];
        p1.coins += Math.round((randNum(10,20)/10)*(enemy.health/15));
        if (enemy.name == "taverngroup") {
            p1.coins += 50;
        }
        if (enemy.name == "janjo") {
            p1.coins += 100;
        }
    }
    if (outcome == 2) {
        resetBattleUI();
        fullSD(gamescreen,menuscreen,"none","block");
        sob = 2;
        //window.setTimeout(enterAdventureScreen,200);
        gametitle.innerHTML = "You Lose..";
        playbtn.innerHTML = "RESTART";
        openBtn.style.display = "none";
    }
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
    console.log("YES");
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
    plr.discards = 1;
    plr.mana += plr.managain;
    for (let i = 0; i < Object.keys(plr.inventory).length; i++) {
        let zecard = plr.inventory[Object.keys(plr.inventory)[i]];
        if (zecard.coolleft != 0) {
            zecard.coolleft -= 1;
            
        }
        if ((currentmode == "Cataclysm" || (currentmode == "Custom" && customtype == "decay")) && player == "p1") {
            zecard.hp -= 20;
        }
        for (let j = 0; j < zecard.effects.length;j++) {
            let effect = zecard.effects[j];
            let args = formateffect("Attributes",effect);
            args[0] = Number(args[0]);
            args[1] = Number(args[1]);
            let flatfx = formateffect("FlatEffect",effect);
            console.log(effect);
            // [0] == scale; [1] == timeleft
            if (flatfx == "Burning") {
                zecard.hp -= Number(args[0])*8;
            }
            if (flatfx == "Shock") {
                zecard.hp *= 0.8;
                zecard.hp = Math.round(zecard.hp);
                if (Object.hasOwn(zecard,"atk")) {
                    zecard.atk *= 1.2;
                    zecard.atk = Math.round(zecard.atk);
                }
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
            
            if (args[1] == 1) {
                if (flatfx == "Death") {
                    delete plr.inventory[Object.keys(plr.inventory)[i]];
                    continue;
                }
                zecard.effects.splice(j,1);
                continue;
                
            }
            if (args[1] > 1) {
                args[1] -= 1;
            }
            zecard.effects[j] = flatfx+"{"+args.toString()+"}";
        }
        if (zecard.type == "Attack") {
            if (zecard.ammo < zecard.maxammo) {
                zecard.ammo += 1;
            }
        }
        if (zecard.name == "charger" && zecard.atk < 80) {
            zecard.atk += 25;
        }
        if (zecard.name == "bank") {
            zecard.storedmana += 1.5;
        }
    }
}
function unborder(id) {
    let zeelement = document.getElementById(id);
    if (zeelement == focused) {
        focused = null;
    }
    zeelement.style.border = "1px solid black";
    zeelement.style.backgroundColor = null;
}
function unblockOpp() {
    blockoppturn = false;
    blockturnover = false;
}
function playerTurn() {
    let prevturn = turn;
    if (prevturn == 2) {
        turn = 1;
        oppturndone = false;
        blockoppturn = true;
        blockturnover = true;
        window.setTimeout(unblockOpp,2000);
        turnover("p2");
        if (prevturn == 2) {

        }

        update();
    }
    
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
    console.log(chosencard);
    if (chosencard == null) {
        return false;
    }
    useCard(null,true,index);
    return chosencard.manause;
}
function oppDraw() {
    if (Object.keys(p2.inventory).length < 10) {
        drawCard("p2");
        p2.mana -= 3;
        if (randNum(0,1) == 1) {
            window.setTimeout(oppAttack,350);
        }   
        return true;
    } else {
        let feeling1 = randNum(1,3);
        if (feeling1 >1 && p2.mana > 7)  {
            aimode = 3;
        } else {
            aimode = 2;
        }
        console.log("YOOO");
        return false;
    }
    
}
function oppChoice(start) {
    console.log(oppturndone,opptries);
    if (blockoppturn == true) {
        return false;
    }
    if (opptries > 30) {
        oppturndone = true;
    }
    if (oppturndone == true && turn != 1) {
        window.setTimeout(playerTurn,400);
    }
    if (start == true) {
        opptries = 0;
    }
    // var aimodes = 1,2,3 | 1: default, spend random amounts, select random cards | 2: save up, when many cards are on board, save up for more | 3: siege, attack with all force | 4: stock up, draw more cards
    // FLOWMAP: start->4->2->3->repeat
    let prevmode = aimode;
    if (Object.keys(p1.inventory).length-Object.keys(p2.inventory).length < -6 && p2.mana > 8) {
        aimode = 3;
    } else {
        if (Object.keys(p2.inventory).length < 8 && randNum(1,5) != 1) {
            aimode = 4;
        } else if (Object.keys(p2.inventory).length > 6 && (p2.mana > 8 && aimode != 3)) {
            aimode = 3;
        } else if (p2.mana < 9 && Object.keys(p2.inventory).length > 6) {
            aimode = 2;
        } else {
            aimode = 1;
        }
    }
    
    if (prevmode != aimode) {
        modetick = 0;
    } else {
        
    }
    let choice = 0; // choice means how much mana is the limit. for example, if choice is 3, use cards until mana is 3.
    if (aimode == 1 || aimode == 4) {
        if (p2.mana > 8) {
            choice = randNum(0,p2.mana/3.5);
        } else {
            choice = randNum(0,3);
        }
        
    }
    if (aimode == 2) {
        choice = 8;
    }
    if (aimode == 3) {
        choice = randNum(0,3);
    }
    if (choice < 2) {
        choice = 2;
    }
    modetick++;
    console.log(choice);
    if (p2.mana > choice) {
        opptries++;
        let result;
        let time;
        if (aimode == 1) {
            if (Object.keys(p2.inventory).length < 2) {
                result = oppDraw();
                choice -= 1;
            } else {
                let feeling1 = randNum(1,3);
                if (feeling1 >= 2 && Object.keys(p2.inventory).length > 0) {
                    result = oppAttack();
                } else {
                    result = oppDraw();
                }
            }
        }
        if (aimode == 2) {
            let feeling1 = randNum(1,5);
            if (feeling1 <= 2) {
                let feeling2 = randNum(1,3);
                if (Object.keys(p2.inventory).length < 2 || feeling2 == 1) {
                    result = oppDraw();
                    choice -= 1;
                } else {
                    result = oppAttack();
                }
            }
        }
        if (aimode == 3) {
            // SIEGE
            let feeling1 = randNum(1,4);
            if (feeling1 > 1) {
                result = oppAttack();
            } else {
                result = oppDraw();
            }
        }
        if (aimode == 4) {
            // STOCK UP
            let feeling1 = randNum(1,4);
            if (feeling1 > 1) {
                result = oppDraw();
            } else {
                result = oppAttack();
            }
        }
        console.log(result);
        if (result == false) {
            time = 0;
        } else {
            time = 350;
        }
        window.setTimeout(oppChoice,350,false);
    } else {
        console.log("yeah");
        oppturndone = true;
        window.setTimeout(oppChoice,350,false);
    }
    
    
}
function oppTurn() {
    // states: spend, save, neutral
    turnover("p1");
    if (currentmode == "Custom" && customtype == "interest") {
        p1.mana -= 3;
        p1.mana *= 1.2;
        p1.health *= 1.2;
        p1.mana = Math.ceil(p1.mana);
        p1.health = Math.ceil(p1.health);
    }

    turn = 2;
    update(true);
    oppChoice(true);
    
}
    
    

/*function oppUse(index) {
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
}*/
function useCard(element = null,opp = null,index = null,select = null,selectp) {
    let id;
    let fid;
    let findex;
    let fmain;
    let fattacked;
    let selected;
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
        if (select != null) {
            selected = Game[selectp].inventory[select];
            fmain = selectp;
        }
    } else {
        opponent = p2;
        user = p1;
        stropp = "p2";
        strmain = "p1";
        if (focused != null) {
            fid = focused.getAttribute("id");
            if (fid.includes('c')) {
                findex = Number(fid.replace("c",""))-1;
                selected = user.inventory[Object.keys(user.inventory)[findex]];
                if (selected != undefined && selected != null) {
                    fmain = "p1";
                    fattacked = Object.keys(user.inventory)[findex];
                }
                
            } else {
                findex = Number(fid.replace("o",""))-1;
                selected = opponent.inventory[Object.keys(opponent.inventory)[findex]];
                if (selected != undefined && selected != null) {
                    fmain = "p2";
                    fattacked = Object.keys(opponent.inventory)[findex];
                }
                
            }
            
            
        }
        
    }
    if (Object.keys(user.inventory).length < index+1) {
        return false;
    } else {
        let card = user.inventory[Object.keys(user.inventory)[index]];
        console.log(card.effects);
        if (card.effects.some(str => str.includes("Stunned")) || card.effects.some(str => str.includes("Frozen"))) {
            return false;
        }
        if (card.coolleft == 0 && user.mana >= card.manause) {
            /// WHEN APPLYING EFFECTS: TO ALLY, DO TURN+1 | TO ENEMY, DO TURN
            if (element != null) {
                element.style.border = "3px solid maroon";
                window.setTimeout(unborder,500,id);
            }
            if (card.type == "Attack") {
                
                let attacked = firstOpp(stropp);
                if (attacked == "Opp") {
                    opponent.health -= card.atk;
                    if (card.name == "cultist") {
                        let add = 0;
                        let chosen;
                        for (let i = 0; i < Object.keys(user.inventory).length; i++) {
                            let tempchosen = user.inventory[Object.keys(user.inventory)[i]];
                            if (tempchosen.name == "cultist") {
                                add += 30;
                            }
                        }
                        opponent.health -= add;
                    }
                } else {
                    let zeattacked = opponent.inventory[attacked];
                    if (fmain == "p2") {
                        zeattacked = selected;
                        attacked = Object.keys(opponent.inventory)[findex];
                    }
                    if (card.effects.some(str => str.includes("Confused")) == true) {
                        zeattacked.hp += card.atk*2;
                    } else {
                        let sound = new Audio('sounds/sword.mp3');
                        if (card.sound != undefined) {
                            sound = new Audio('sounds/'+card.sound);
                        }
                        sound.volume = 0.4;
                        if (card.sound == "shoot.mp3") {
                            sound.volume = 0.3;
                        }
                        sound.play();
                        
                        
                    }
                    if (user.mods.some(str => str.includes("FlameTouch"))) {
                        let cm = cleanseModifier("Norm",user.mods.filter(str => str.includes("FlameTouch"))[0]);
                        console.log(cm);
                        if (zeattacked.effects.some(str => str.includes("Burning")) == false) {
                            zeattacked.effects.push(`Burning{${cm[0]},${cm[1]}}`);
                        }
                    }
                    if (card.name == "bandit") {
                        let tempchance = randNum(1,2);
                        if (tempchance == 2) {
                            let managain = Math.ceil(opponent.mana*(randNum(20,80)/100));
                            if (managain < 3) {
                                managain = 3;
                            }
                            user.mana += managain;
                            opponent.mana -= managain;
                        }
                    }
                    zeattacked.hp -= card.atk;
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
                    if (card.name == "teslacoil") {
                        for (let i = 0; i < Object.keys(opponent.inventory).length; i++) {
                            let tempchosen = opponent.inventory[Object.keys(opponent.inventory)[i]];
                            tempchosen.hp -= Math.ceil(card.atk/7);
                            if (tempchosen.effects.some(str => str.includes("Shock")) == true) {
                                let zeval = tempchosen.effects.filter(str => str.includes("Shock"))[0];
                                let index = tempchosen.effects.indexOf(zeval);
                                let args = formateffect("Attributes",zeval);
                                args[0] = Number(args[0]);
                                args[0] += 1;
                                args[1] += 1;
                                tempchosen.effects[index] = "Shock{"+args[0]+","+args[1]+"}";
                            }
                            if (tempchosen.effects.some(str => str.includes("Shock")) == false) {
                                tempchosen.effects.push("Shock{1,1}");
                            }
                        }
                        
                    }
                    if (card.name == "oblivion" && index != null && index == 0) {
                        zeattacked += card.atk;
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
                                }
                            }
                            tries++;
                        } while (tries < 50)
                        if (chosen == null) {
                           
                        } else {
                            if (chosen.effects.some(str => str.includes(substr)) == false) {
                                chosen.effects.push("Death{1,3}");
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
                            
                        } while (tries < 50)
                        if (chosen == null) {
                           
                        } else {
                            if (chosen.effects.some(str => str.includes(substr)) == false) {
                                chosen.effects.push("Frozen{1,2}");
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
                        console.log(add);
                        zeattacked.hp -= add;
                    }
                    if (zeattacked.hp <= 0) {
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
                            if (currentmode == "Custom" && customtype == "flagship" && strmain == "p2") {
                                opponent.health = -100;
                            }
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
                    if (selected != null) {
                        zechosen = selected;
                    }
                } else {
                    zechosen = "Opp";
                }
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
                    if (selected != null && selected.type == "Attack") {
                        chosen = selected;
                    }
                    let gain = Math.round((100-chosen.atk)/15);
                    if (gain < 2) {
                        gain = 2;
                    }
                    chosen.ammo += gain;
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
                    if (selected != null && selected.type == "Attack") {
                        chosen = selected;
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
                    if (selected != null && selected.type == "Attack") {
                        chosen = selected;
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
                        drawCard(strmain,true,user.inventory[Object.keys(user.inventory)[0]].name);
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
                    let temp1 = {};
                    let temp2 = {};
                    temp1 = Object.assign(temp1,card1);
                    temp2 = Object.assign(temp2,card2);
                    let newobj = {};
                    Object.defineProperty(newobj,Object.keys(user.inventory)[Object.keys(user.inventory).length-1],Object.getOwnPropertyDescriptor(user.inventory,Object.keys(user.inventory)[Object.keys(user.inventory).length-1]));
                    Object.keys(user.inventory).forEach(function(key,index) {
                        if (index != Object.keys(user.inventory).length-1 && index != 0) {
                            Object.defineProperty(newobj,key,Object.getOwnPropertyDescriptor(user.inventory,key));
                        }
                    });
                    Object.defineProperty(newobj,Object.keys(user.inventory)[0],Object.getOwnPropertyDescriptor(user.inventory,Object.keys(user.inventory)[0]));
                    user.inventory = newobj;
                    
                    card.ammo -= 1;
                    if (card.ammo <= 0) {
                        card.coolleft = card.cool;
                        card.ammo = card.maxammo;
                    }
                }
                
                if (card.name == "bank") {
                    if (card.storedmana > 0) {
                        user.mana += card.storedmana;
                        delete user.inventory[Object.keys(user.inventory)[index]];
                    }
                    
                }
                
                
            }
            if (card.type == "Action") {
                if (card.name == "ritual") {
                    drawCard(strmain,true,"cultist");
                    drawCard(strmain,true,"cultist");
                    drawCard(strmain,true,"cultist");
                    delete user.inventory[Object.keys(user.inventory)[index]];
                    let loss = 0;
                    if (user.health > 100) {
                        loss = user.health/2;
                    } else {
                        loss = 50;
                    }
                    user.health -= loss;
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
                if (card.name == "armageddon") {
                    user.mana += 12;
                    opponent.mana += 12;
                    user.health -= 50;
                    opponent.health -= 50;
                    if (user.health <= 1) {
                        user.health = 1;
                    }
                    if (opponent.health <= 1) {
                        opponent.health = 1;
                    }
                    delete user.inventory[Object.keys(user.inventory)[index]];                    
                }
            }
            user.mana -= card.manause;
        }
    }
    update();
}
function selectCard(element) {
    if (focused != null) {
        unborder(focused.getAttribute("id"));
    }
    if (focused != element) {
        focused = element;
        element.style.border = "3px solid blue";
    } else {
        focused = null;
    }
    
}
function discard(player, index = null) {
    let id;
    let opponent;
    let user;
    let stropp;
    let strmain;
    if (player == "p2") {
        opponent = p1;
        user = p2;
        stropp = "p1";
        strmain = "p2";
        element = document.getElementById("o"+(index+1));
        id = element.getAttribute("id");
    } else {
        opponent = p2;
        user = p1;
        stropp = "p2";
        strmain = "p1";
        id = focused.getAttribute("id");
        index = Number(id.replace("c",""))-1;
    }
    if (user.inventory[Object.keys(user.inventory)[index]] != undefined) {
        let card = user.inventory[Object.keys(user.inventory)[index]];
        delete user.inventory[Object.keys(user.inventory)[index]];
        user.mana += 1;
        user.discards -= 1;
        update();
    }
    
}
function setStartMod(mod) {
    if (mod == "nephew") {
        drawCard("p1",true,"spearman","addToDeck");
        drawCard("p1",true,"spearman","addToDeck");
    }
}
function enterAdventureScreen() {
    console.log("yuh");
    adventurescreen.style.display = "block";
    curloctxt.innerHTML = "Current Location: "+curlocation.formal;
    curlocdesctxt.innerHTML = curlocation.desc;
    loretxt.innerHTML = curlocation.loretext;
    if (Object.hasOwn(curlocation,"skipallowed")) {
        alttravelbtn.style.display = "block";
    } else {
        alttravelbtn.style.display = "none";
    }
    if (skipped == true) {
        curlocdesctxt.innerHTML = curlocation.altdesc;
        loretxt.innerHTML = curlocation.alttext;
    }
    if (Object.hasOwn(curlocation,"proceedspecial")) {
        let splitarr1 = curlocation.proceedspecial.split("|");
        let type = splitarr1[0];
        let typearg = splitarr1[1];
        console.log(type,typearg);
        if (type == "fight") {
            proceedtxt.innerHTML = "Begin Fight With "+enemies[typearg].formal;
            travelbtn.innerHTML = "Begin Fight";
        }
    } else {
        proceedtxt.innerHTML = "Travel To Next Location: "+locations[curlocation.nextloc].formal;
        travelbtn.innerHTML = "Travel";
    }
    proceeddesc.innerHTML = curlocation.proceedtext;
    if (Object.hasOwn(curlocation,"special") && skipped == false) {
        let special = curlocation.special;
        if (special.includes("gaincard") || special == "tallmart") {
            specialdiv.style.display = "block";
            Array.from(document.getElementsByClassName("specialcard")).forEach(function(element) {
                if (element.getAttribute("id").includes("a")) {
                    return;
                }
                let card = randKey(cards);
                if (special.includes("gaincardupg") || special =="tallmart") {
                    let chance = randNum(1,2);
                    if (chance == 1) {
                        let chance2 = randNum(1,10);
                        if (chance2 > 0) {
                            if (Object.hasOwn(card,"atk")) {
                                card.atk *= randNum(10,20)/10;
                                card.atk = Math.round(card.atk);
                            }
                            if (Object.hasOwn(card,"heal")) {
                                card.heal *= randNum(10,20)/10;
                                card.heal = Math.round(card.atk);
                            }
                        } 
                        if (chance2 > 4) {
                            let prevcool = card.cool;
                            card.cool -= randNum(1,3);
                            if (card.cool < 1 && prevcool != 0) {
                                card.cool = 1;
                            }
                            card.hp *= randNum(10,20)/10;
                            card.hp = Math.round(card.hp);
                        }
                        if (chance2 > 7) {
                            let prevcool = card.manause;
                            card.manause -= randNum(1,6)/2;
                            if (card.manause < 1 && prevcool != 0) {
                                card.manause = 1;
                            }
                        }
                    }
                };
                element.innerHTML = `<h2>${card.formal}</h2>`;
                element.setAttribute("data-card",card.name);
                let text = `<p>${card.desc}<br><span style='font-size:13px;'>${card.hp} HP`;
                if (Object.hasOwn(card, "atk")) {
                    text +=` | ${card.atk} ATK`;
                }
                if (Object.hasOwn(card, "heal")) {
                    text +=` | ${card.heal} HEAL`;
                }
                if (Object.hasOwn(card, "ammo")) {
                    text +=` | ${card.ammo} AMMO`;
                }
                text += ` | ${card.manause} MU`;
                if (Object.hasOwn(card, "cool")) {
                    text +=` | ${card.cool} COOLDOWN`;
                }
                text += "</span></p>";
                console.log(text);
                element.innerHTML += text;
                console.log(element.innerHTML);
            });
        }
        if (special == "tallmart") {
            specialdiv2.style.display = "block";
            Array.from(document.getElementsByClassName("specialcard")).forEach(function(element) {
                if (element.getAttribute("id").includes("a") == false) {
                    return false;
                }
                let card = randKey(cards);
                let chance = randNum(1,10);
                if (chance >= 4) {
                    let chance2 = randNum(1,10);
                    if (chance2 > 0) {
                        if (Object.hasOwn(card,"atk")) {
                            card.atk *= randNum(10,20)/10;
                            card.atk = Math.round(card.atk);
                        }
                        if (Object.hasOwn(card,"heal")) {
                            card.heal *= randNum(10,20)/10;
                            card.heal = Math.round(card.atk);
                        }
                    } 
                    if (chance2 > 4) {
                        let prevcool = card.cool;
                        card.cool -= randNum(1,3);
                        if (card.cool < 1 && prevcool != 0) {
                            card.cool = 1;
                        }
                        card.hp *= randNum(10,20)/10;
                        card.hp = Math.round(card.hp);
                    }
                    if (chance2 > 7) {
                        let prevcool = card.manause;
                        card.manause -= randNum(1,6)/2;
                        if (card.manause < 1 && prevcool != 0) {
                            card.manause = 1;
                        }
                    }
                }
                element.innerHTML = `<h2>${card.formal}</h2>`;
                element.setAttribute("data-card",card.name);
                let cost = Math.round(Math.log(card.hp)**1.3)*3;
                console.log(cost);
                if (Object.hasOwn(card,"atk")) {
                    if (card.cool != 0 && card.manause != 0) {
                        cost +=((card.atk/card.cool)*5)/(Math.log(card.manause*20)/1.8);
                    } else {
                        cost += card.atk*2;
                    }
                    console.log(cost);
                }
                if (Object.hasOwn(card,"heal")) {
                    cost += (card.heal*5)/card.manause;
                }
                
                if (card.type == "Support" || card.type == "Action") {
                    cost *= Math.log((card.manause+2)*2);
                }
                cost = Math.round(cost);
                element.setAttribute("data-cost",cost);
                
                let text = `<p>${card.desc}<br>${card.hp} HP`;
                if (Object.hasOwn(card, "atk")) {
                    text +=` | ${card.atk} ATK`;
                }
                if (Object.hasOwn(card, "heal")) {
                    text +=` | ${card.heal} HEAL`;
                }
                text += ` | ${card.manause} MU`;
                if (Object.hasOwn(card, "cool")) {
                    text +=` | ${card.cool} COOLDOWN`;
                }
                text += ` | ${cost} COST`;
                text += "</p>";
                console.log(text);
                element.innerHTML += text;
                console.log(element.innerHTML);
            });
        } else {
            specialdiv2.style.display = "none";
        }
    } else {
        specialdiv.style.display = "none";
        specialdiv2.style.display = "none";
    }
   
    statsdiv.innerHTML = `
    <p>
        ${p1.health} Health | ${p1.coins} Coda Coins
    </p>
    <p>
        ${p1.managain} Mana Gain | ${p1.maxdiscards} Discards
    </p>
    `;
    updateAdventureScreen();
    
    
}
function updateAdventureScreen() {
    statsdiv.innerHTML = `
    <p>
        ${p1.health} Health | ${p1.coins} Coda Coins
    </p>
    <p>
        ${p1.managain} Mana Gain | ${p1.maxdiscards} Discards
    </p>
    `;
    if (inventorytable != null) {
        inventorytable.remove();
    }
    inventorytable = document.createElement('table');
    inventorytable.id = "inventorytable";
    inventorydiv.appendChild(inventorytable);
    let remainder = Object.keys(p1.deck).length % 4;
    let finaltr;
    for (let j = 0; j < Math.ceil(Object.keys(p1.deck).length/4); j++) {
        let zerow = document.createElement('tr');
        if (j-Math.ceil(Object.keys(p1.deck).length/4) == 1) {
            finaltr = zerow;
        }
        inventorytable.appendChild(zerow);
        for (let i = 0; i < 4; i++) {
            if ((j*4)+i > Object.keys(p1.deck).length-1) {
                break;
            }
            let card = document.createElement('td');
            let curcard = p1.deck[Object.keys(p1.deck)[(j*4)+i]];
            
            card.innerHTML = "<span class='title'>"+curcard.formal+":</span><br>"+curcard.hp+" HP | ";
            if (Object.hasOwn(curcard,"atk")) {
                card.innerHTML += curcard.atk+" ATK | ";
            }
            if (Object.hasOwn(curcard,"heal")) {
                card.innerHTML += curcard.heal+" HEAL | ";
            }
            if (Object.hasOwn(curcard,"coolleft")) {
                if (Object.hasOwn(curcard,"uses") && curcard.uses != -1) {

                } else {
                    card.innerHTML += curcard.coolleft+" CD | ";
                }
                
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
            if (Object.hasOwn(curcard,"storedmana")) {
                card.innerHTML += curcard.storedmana+" STORED MANA | ";
            }
            if (Object.hasOwn(curcard,"manause")) {
                card.innerHTML += curcard.manause+" MU";
            }
            card.innerHTML += "<br><hr><span class='desc'>"+curcard.desc+"</span>";
            let tempimg;
            if (curcard.img != "") {
                tempimg = "url(img/cards/"+curcard.name+".png)";  
                card.style.backgroundSize = "140px 160px";
            } else {
                tempimg = "url()";
                card.style.backgroundSize = "140px 160px";
            }
            card.style.backgroundSize = "140px 160px";
            card.style.backgroundImage = tempimg;
            zerow.appendChild(card);
        }
    }
    
}
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
        if (turn == 1) {
            if (cardmode == 1) {
                useCard(element);
            }
            if (cardmode == 2) {
                selectCard(element);
            }
            
        }
        
    });
});
turnbtn.addEventListener('click',function(){
    if (turn == 1 && blockturnover == false) {
        oppTurn();
    }
    
    
});
togglecardmode.addEventListener('click',function() {
    if (cardmode == 1) {
        cardmode = 2;
        togglecardmode.innerHTML = "Toggle Card Mode (Current: Select)";
    } else {
        cardmode = 1;
        /*if (focused != null) {
            unborder(focused.getAttribute("id"));
        }
        
        focused = null;*/
        togglecardmode.innerHTML = "Toggle Card Mode (Current: Use)";
    }
})
drawbtn.addEventListener('click',function(){
    if (p1.mana >= 3 && turn == 1 && Object.keys(p1.inventory).length < 10) {
        p1.mana -= 3;
        if (currentmode == "Custom" && customtype == "industrial") {
            drawCard("p1",true,"factory");
        } else {
            drawCard("p1");
        }
        
        update();
    }
    
});
discardbtn.addEventListener('click',function(){
    if (turn == 1 && Object.keys(p1.inventory).length > 0 && p1.discards > 0) {
        discard("p1");
    }
});
unselectbtn.addEventListener('click',function() {
    if (focused != null) {
        unborder(focused.getAttribute("id"));
        focused = null;
    }
    
})
/*modebtn.addEventListener('click',function() {
    let prevmode = currentmode;
    let order = ["Easy","Normal","Hard","Insane","Cataclysm","Custom"];
    let index = order.indexOf(currentmode);
    let setto;
    if (index+1 > order.length-1) {
        setto = order[0];
    } else {
        setto = order[index+1];
    }
    if (setto == "Easy") {
        currentmode = "Easy";
        p1.health = 500;
        p2.health = 250;
        modetext.innerHTML = "Current Mode: Easy";
    }
    if (setto == "Normal") {
        currentmode = "Normal";
        p1.health = 300;
        p2.health = 300;
        modetext.innerHTML = "Current Mode: Normal";
    }
    if (setto == "Hard") {
        currentmode = "Hard";
        p1.health = 200;
        p2.health = 350;
        modetext.innerHTML = "Current Mode: Hard";
    }
    if (setto == "Insane") {
        currentmode = "Insane";
        p1.health = 125;
        p2.health = 500;
        modetext.innerHTML = "Current Mode: Insane";
    }
    if (setto == "Cataclysm") {
        currentmode = "Cataclysm";
        p1.health = 70;
        p2.health = 650;
        modetext.innerHTML = "Current Mode: Cataclysm";
    }
    if (setto == "Custom") {
        currentmode = "Custom";
        customselect.style.display = "block";
        modetext.innerHTML = "Current Mode: Custom";
    } else {
        customselect.style.display = "none";
    }
    update();
});
customselect.addEventListener("change",function() {
    let value = customselect.value;
    customtype = value;
});*/

playbtn.addEventListener("click",function() {
    console.log(sob, sob == 2);
    if (sob == 2) {
        console.log("UHHH");
        fullSD(menuscreen,adventurescreen,"none","block");
        window.setTimeout(enterAdventureScreen,200);
    }
    if (sob == 1) {
        sob = 2;
        fullSD(menuscreen,modescreen,"none","flex");
    }
    
    
});
// startBattle("andreas");
Array.from(document.getElementsByClassName("modes")).forEach(function(element) {
    element.addEventListener('click', function() {
        let id = element.getAttribute("id");
        let cleaned = id.replace("mode","");
        cleaned = cleaned.charAt(0).toUpperCase() + cleaned.slice(1);
        currentmode = cleaned;
        fullSD(modescreen,startmodsscreen,"none","flex");
    });
});
Array.from(document.getElementsByClassName("startmods")).forEach(function(element) {
    element.addEventListener('click', function() {
        let startmod = element.getAttribute("id");
        setStartMod(startmod);
        fullSD(startmodsscreen,adventurescreen,"none","block");
        window.setTimeout(enterAdventureScreen,200);
        document.body.style.overflowY = "scroll";
        document.body.style.height = null;
        document.body.style.width = null;
    });
});
Array.from(document.getElementsByClassName("specialcard")).forEach(function(element) {
    element.addEventListener('click', function() {
        if (speciallock == false && element.getAttribute("id").includes("a") == false) {
            let card = element.getAttribute("data-card");
            drawCard("p1",true,card,"addToDeck");
            updateAdventureScreen();
            speciallock = true;
            element.style.border = "7px solid black";
        }
        if (element.getAttribute("id").includes("a") && element.style.border != "7px solid black") {
            let card = element.getAttribute("data-card");
            if (p1.coins >= Number(element.getAttribute("data-cost"))) {
                p1.coins -= Number(element.getAttribute("data-cost"));
            } else {
                return false;
            }
            drawCard("p1",true,card,"addToDeck");
            updateAdventureScreen();
            element.style.border = "7px solid black";
        }
        
    });
});
travelbtn.addEventListener("click", function() {
    skipped = false;
    speciallock = false;
    speciallock2 = false;
    Array.from(document.getElementsByClassName("specialcard")).forEach(function(element) {
        element.style.border = "2px solid black";
    });
    if (travelbtn.innerHTML == "Begin Fight") {
        startBattle(curlocation.proceedspecial.split("|")[1]);
        fullSD(adventurescreen,gamescreen,"none","block");
    }
    if (travelbtn.innerHTML == "Travel") {
        curlocation = locations[curlocation.nextloc];
        enterAdventureScreen();
    }
});
alttravelbtn.addEventListener("click", function() {
    skipped = true;
    curlocation = locations[curlocation.nextloc];
    enterAdventureScreen();
    Array.from(document.getElementsByClassName("specialcard")).forEach(function(element) {
        element.style.border = "2px solid black";
    });
});