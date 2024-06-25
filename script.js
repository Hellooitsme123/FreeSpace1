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
        coinsgive: 0,
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
        coinsgive: 50,
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
        managain: 5,
        maxdiscards: 1,
        coinsgive: 100,
        // battle stats
        health: 200,
        mana: 7,
        discards: 1,
        inventory: {},
        simpledeck: ["flamethrower","healbubble","weakener","soulkeeper","etherealguardian"],
        deck: {},
        mods: ["FlameTouch{3,2}","QuickUse{1}"],
    },
    "helloitsme": {
        name: "helloitsme",
        formal: "'Helloitsme123'",
        managain: 6,
        maxdiscards: 1,
        coinsgive: 150,
        // battle stats
        health: 250,
        mana: 0,
        discards: 1,
        inventory: {},
        simpledeck: ["teslacoil","bandit","weakener","wizard","spearman"],
        deck: {},
        mods: ["Tank{20}","QuickUse{1}"],
    },
    "djneon": {
        name: "djneon",
        formal: "DJ Neon",
        managain: 5,
        maxdiscards: 1,
        coinsgive: 50,
        // battle stats
        health: 250,
        mana: 8,
        discards: 1,
        inventory: {},
        simpledeck: ["solarprism","wizard","weakener","soulkeeper","managenerator","healorb"],
        deck: {},
        mods: ["Tank{20}","Strength{20}","Healing{20}"],
    },
    "cheesedino": {
        name: "cheesedino",
        formal: "Cheese Dino",
        managain: 5,
        maxdiscards: 1,
        coinsgive: 0,
        // battle stats
        health: 320,
        mana: 12,
        discards: 1,
        inventory: {},
        simpledeck: ["solarprism","oblivion","wizard","spearman","managenerator","healbubble"],
        deck: {},
        mods: ["FlameTouch{2,1}"],
    },
    "bandits": {
        name: "bandits",
        formal: "Bandits",
        managain: 6,
        maxdiscards: 1,
        coinsgive: 0,
        // battle stats
        health: 300,
        mana: 10,
        discards: 1,
        inventory: {},
        simpledeck: ["bandit","wizard","spearman","managenerator","healbubble","turret","flamethrower","bank"],
        deck: {},
        mods: ["Strength{50}"],
    },
    "lordk": {
        name: "lordk",
        formal: "Lord K",
        managain: 7,
        maxdiscards: 1,
        coinsgive: 50,
        // battle stats
        health: 500,
        mana: 10,
        discards: 1,
        inventory: {},
        simpledeck: ["bandit","wizard","spearman","flamethrower","ninja"],
        deck: {},
        mods: ["Strength{250}","QuickUse{-1}"],
    },
    "trafficlord": {
        name: "trafficlord",
        formal: "Traffic Lord",
        managain: 6,
        maxdiscards: 1,
        coinsgive: 200,
        // battle stats
        health: 650,
        mana: 15,
        discards: 1,
        inventory: {},
        simpledeck: ["bandit","wizard","spearman","flamethrower","ninja","managenerator","solarprism"],
        deck: {},
        mods: ["Strength{50}","QuickUse{1}","Tank{20}","Healing{20}"],
    },
}
var locations = {
    "home": {
        name: "home",
        formal: "Home",
        desc: "Your humble house. Where everything all starts.",
        loretext: "A few days ago, UncleMan threatened to evict you, saying that you're a lazy couch potato that does nothing. Since becoming a homeless beggar is the last thing you want to do, you ask him for ways to stay in the house. || You: What can I do to stay here? || UncleMan: You have to earn your keep! I'll give you one simple task: Find the Bean Duplicator. If you can get that relic, then I'll give you lifelong permission to stay here. || A rare relic found only in the dangerous mountains, visible shaking started. You knew that protesting would do nothing, so, starting with only 20 coda coins and 2 spearmen, you began your journey to prevent yourself from getting evicted.",
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
        loretext: "After getting back up and continuing your journey, you reached the center of Owarp. Here, resides one of the biggest plazas in Boraps, so you decide that you must make the most of your time here. One of the stores in the plaza, known as Tallmart, contains a lot of useful cards. However, you don't have enough to buy them. So, you decided that it would be best to enter Janjo's Tavern, a place where you can battle other people with your cards and earn coda coins. || Walking down the road, you saw a pink, cottage store named 'Lavender's Cosmetic Shop'. Next to the entrance, you saw a sign that said that free card upgrades were offered on Monday afternoons. It just happened to be a Monday afternoon, so you decided it would be best to get a free card upgrade before fighting against others with possibly better decks in the tavern.",
        proceedtext: "Go to the cosmetic shop and get a free card upgrade.",
        nextloc: "cosmeticshop",
    },
    "cosmeticshop": {
        name: "cosmeticshop",
        formal: "Cosmetic Shop",
        desc: "A relaxing store smothered with pink, aesthetic vibes that provide a variety of cosmetics, just happening to offer free card upgrades on Monday afternoons.",
        loretext: "You entered the store, and all of a sudden your stress was gone. It was just too relaxing. You came in to the person at the cash register, and you began talking with her. || You: So, is it true that there are free card upgrades on Mondays? || Lavender: Yeah. Only the first 10 people get it though. Fortunately, you are one of the first 10 people here. || You: Cool! So, how do I get it? || Lavender: Just give me 2 cards, and I can upgrade them. You can also get 1 card and 1 card upgrade instead. || Click a card to upgrade its stats by 10%, or choose a card to get for free. ",
        special: "shop|gaincard|upgcard",
        proceedtext: "Leave the store and go visit the tavern.",
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
        loretext: "You gained about 50 coins from your victory, despite having only a few cards. Word spread around the tavern about your skill, and before you could leave, you were confronted by the tavern owner, Janjo. He's well known for is powerful skills, which include setting attacked cards on fire and using a flame blast every few moves, which burns all of your cards. He also has a quick use ability, which ignores card cooldowns. || He proposed a bet of 100 coda coins and a special upgraded card, saying that whoever lost has to pay the winner. It's risky, but the reward is much more than enough to get a few things at Tallmart. Do you accept the bet?",
        alttext: "You decided to not fight the tavern group, intimidated by their cards. However, you soon stumble upon an even stronger opponent. The tavern owner himself. He's well known for is powerful skills, which include setting attacked cards on fire and using a flame blast every few moves, which burns all of your cards. He also has a quick use ability, which ignores card cooldowns. || You talked with him, telling him about your card adventures. Eventually, he proposed a bet of 100 coda coins and a special upgraded card, saying that whoever lost has to pay the winner. He said it'll be a helpful reward for you, but you'll only get it if you're worthy enough. However, the prize money is undoubtedly handsome sum. Do you accept the bet?",
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
        special: "gaincard",
        proceedtext: "Go to Tallmart to buy upgrades for your journey.",
        nextloc: "tallmart",
    },
    "tallmart": {
        name: "tallmart",
        formal: "Tallmart",
        desc: "A tall store that contains a wide range of items to buy, from food to nukes to cards.",
        loretext: "You step into the store, the faint, generic shopping music playing. Struggling to breathe the thick night air, tired from all of your traveling, you look at the aisles.",
        proceedtext: "Leave the store and continue your trek along the road.",
        special: "store|buycard|buyrelic",
        nextloc: "behindtallmart",
    },
    "behindtallmart": {
        name: "behindtallmart",
        formal: "Grimy Corner",
        desc: "A dirty, forgotten corner inhabited by the one and only Greg.",
        loretext: "Having a few scraps left over from the tavern that you forgot to throw away, you decided to go to the back of Tallmart after finishing your order. Expecting to see a normal dumpster, you jumped back in surprise after a man came out of a cardboard box. He said his name was Greg, and, after seeing your cards, he offered you a deal of 15 coda coins for every card you give him. Do you accept?<br>Click a card in your inventory to delete it.",
        proceedtext: "Leave Greg's place and continue along the road.",
        special: "destroycard",
        nextloc: "roadtocoda3",
    },
    "roadtocoda3": {
        name: "roadtocoda3",
        formal: "Road To Coda",
        desc: "A busy road taken by many, some with the intent of adventure, of success, of happiness.",
        loretext: "After leaving the corner and going further throughout the city, you came to a club called 'Deric's Dance Club', dazzled by a blast of chromatic, flashing lights. Fortunately for you, there was a Dance Card that just happened to be lying on the bench that you were just about to sit on.",
        proceedtext: "Enter the Dance Club and see what you can do there.",
        nextloc: "danceclub",
    },
    "danceclub": {
        name: "danceclub",
        formal: "Deric's Dance Club",
        desc: "A wild and frivolous club where people can vibe, shout, and dance in a vivid array of lights.",
        loretext: "Walking up to the receptionist, you were asked the question of where your Dance Card was. You quickly pulled it out, giving it to the receptionist and jumping on the floating elevator before any further questioning could begin. Once you reached the dance floor, you were met with yet another blast of intense noise and lights. You were left staggered, weakened by your long journey without any sleep. So, you decided that it would be best to make your time here quick. || The first thing that caught your attention was the DJ's set of prismatic cards, all of them being rare. However, you were unable to talk to the DJ, as just then, a challenger, who went by the name of 'Helloitsme123', approached. || Helloitsme123: I bet 150 coda coins I'll win! || You: What? || Helloitsme123: Come on, battle! || The enigmatic figure provided only one option, and with the moon at its peak, it didn't seem like you could do anything else.",
        proceedtext: "Do the only thing you can, accept the challenge.",
        proceedspecial: "fight|helloitsme",
        nextloc: "helloitsmevictory",
    },
    "helloitsmevictory": {
        name: "helloitsmevictory",
        formal: "Deric's Dance Club",
        desc: "A wild and frivolous club where people can vibe, shout, and dance in a vivid array of lights.",
        loretext: "That battle.. was strange. Who was that person? Why such a quick appearance and demanding tone? Before you could question the cloaked.. thing, they walked away, quickly disappearing in the crowd. After the battle, you decided to see if there was anything that could aid you. Eventually, you found a bean can dispenser, which can increase your health by 50 (also increases max health), but at the cost of 30 coda coins. Do you think it's worth it?",
        proceedtext: "Explore more of the club.",
        special: "beancandispenser",
        nextloc: "danceclub2",
    },
    "danceclub2": {
        name: "danceclub2",
        formal: "Deric's Dance Club",
        desc: "A wild and frivolous club where people can vibe, shout, and dance in a vivid array of lights.",
        loretext: "After healing up (or not), you decided to finally meet the DJ, who went by the name of DJ Neon (according to the massive, glowing letters displayed on the wall). For a few minutes you observed him spinning those strange discs that you never really understood, wondering what they even did. How do they even impact the music? They're just circles! Eventually, you asked him who he was. || DJ Neon: My name's DJ Neon! I'm the best DJ in the world! || You: Oh. Well, what about your cards? Why are they rainbow? || DJ Neon: Well, it's because they're special! They're upgraded cards that have better stats than usual. For example, their attack and health is higher. || After a few more minutes of talking, he said that if you can beat him, he'll give you one of his cards and 50 coda coins on top of that. An upgraded card? For free? And 50 coda coins? It's a deal that has to be taken!",
        proceedtext: "Hopefully get an upgraded card from DJ Neon.",
        proceedspecial: "fight|djneon",
        nextloc: "djneonvictory",
    },
    "djneonvictory": {
        name: "djneonvictory",
        formal: "Deric's Dance Club",
        desc: "The best DJ in the world? Is that so?",
        loretext: "You defeated DJ Neon! He did what he promised to, offering 50 coda coins, and a card of your choice (shown below). However, one question still remains: If he's the DJ, and he was just battling you, then how was the music still playing? Is he really a DJ? Whatever, it's fine. You haven't slept in a while..",
        proceedtext: "Go to the hotel across the street to rest.",
        special: "gaincard",
        nextloc: "hotel",
    },
    "hotel": {
        name: "hotel",
        formal: "Hotel",
        desc: "A hotel. Literally. It's name is just 'Hotel'. It's fine. All that matters is that the hotel is good.",
        loretext: "After making sure that there were no speeding cars, you crossed the road and entered the hotel. You can either buy a room for 50 coda coins for one night and heal 70 health, or sleep in the ULTRA-CHEAP beds for free, healing only 20 health. Do you want to save money, or choose the option that'll be the best for you?",
        special: "rest",
        proceedtext: "Wake up and continue your journey.", 
        nextloc: "beanfactory",
    },
    "beanfactory": {
        name: "beanfactory",
        formal: "Bean Factory Entrance",
        desc: "The entrance to a Beanmelon Factory. Hopefully you'll be able to enter. After all, you are the owner's nephew.",
        loretext: "It was nice to have some sleep after more than a day of none at all. Feeling better, you left the hotel to get to visit the Beanmelon Factory. At the entrance, you met a strange dinosaur-humanoid, with a block of cheese with googly eyes as their head. You thought it was a statue, until the dinosaur thing started talking to you. || Cheese Dino: Are you here to talk about Lord K? || You: No.. who's that? || Cheese Dino: You see that guy on the poster? || The picture on the poster showed a ginormous, green dude wearing a crown and a cape, at least double the height of the hotel you were just in, if you looked at the trees in the background of the photo. || You: So.. Who is this Lord K? || Cheese Dino: Well, he's this giant fellow that's been causing a lot of disruption, destroying cities and whatnot. There's a bounty on him. Anyone who can defeat him will get 1000 coda coins. Just bring his crown here, and I'll use the Artifact Confirmation Expert machine to confirm it. || You: 1000? || Cheese Dino: Yep. If you're want to get the prize, you'll have to be able to get cards strong enough to deal with Lord K. Won't be easy. || You: Where can I find him? || Cheese Dino: Oh, somewhere in the forests that follow. || 1000 coda coins seems like a lot, and it'll surely be enough to buy a variety of things. Lord K doesn't seem that bad of enemy, considering the foes you've faced so far. || Cheese Dino: You know what? I'll give you a deal. If you beat me in a card battle, I'll give you a special boost: +50 max health. If you lose, you have to give me all of your coda coins. Come on, it's practically free.",
        proceedtext: "Battle Cheese Dino for more max health.",
        proceedspecial: "fight|cheesedino", 
        nextloc: "cheesedinovictory",
    },
    "cheesedinovictory": {
        name: "cheesedinovictory",
        formal: "Bean Factory",
        desc: "One of the great Beanmelon Corp. factories that produces the food that is eaten by everyone around the world.",
        loretext: "After beating Cheese Dino, he gave you a relic. Check your inventory to see it. After that, you were let into the factory. Following a lot of walking, you met your uncle, Rictor, who was chilling on a plastic chair that looked like it was going to collapse unexpectedly. || Uncle Rictor: Yo, wassup nephew! How have you been doing? What did UncleMan say? || Nephew: Uhh.. He made me go on adventure to find the lost bean duplicator, saying that he'll kick me out if I don't find it. || Uncle Rictor: Oh, that seems bad. Hopefully you'll find it. Do you want some aid? I can upgrade your cards, it'll just cost 30 coda coins per card.|| Nephew: Sure! || Click one of your cards to increase their health by 20%, and their attack/heal by 20%.",
        proceedtext: "Leave the factory to find Lord K.",
        special: "upgcard", 
        nextloc: "roadtocoda4",
    },
    "roadtocoda4": {
        name: "roadtocoda4",
        formal: "Road To Coda",
        desc: "A road filled with old tire tracks from trucks and cars that traversed through here. Unfortunately, cars are quite expensive these days. ",
        loretext: "Surely Lord K can't be that hard to beat, right? He's just a giant green dude with a fake cape and a fake crown. It's probably made of bronze or something, with some special gold paint to make it look cool. With these cards, he'll be easily destroyed! Yeah, hopefully he's somewhere in these woods.. Wait, why does that tree feel familiar? || After some time you found an altar, with a sign saying: 'DISPOSE OF CARDS HERE'. What could it be? Click a card to destroy it.",
        special: "destroycard",
        proceedtext: "Continue searching for Lord K.", 
        nextloc: "forest1",
    },
    "forest1": {
        name: "forest1",
        formal: "Mysterious Forest",
        desc: "An unexplored forest that allegedly contains the legendary Lord K, a giant known for destroying everything.",
        loretext: "Lord K is somewhere in this forest. For sure. You've been searching here for at least an hour, but there's no-<br>Bandits! They're everywhere!",
        proceedtext: "Fight the bandits, it's the only way to live!",
        proceedspecial: "fight|bandits",
        nextloc: "banditsvictory",
    },
    "banditsvictory": {
        name: "banditsvictory",
        formal: "Mysterious Forest",
        desc: "An explored forest that allegedly contains the legendary Lord K, a giant known for destroying everything.",
        loretext: "Whew. Those bandits were pretty annoying. Maybe they had information on Lord K. Should've asked them before they fled. After searching for some time, you found an arrow made of sticks on the ground, pointing to an area heavily covered by trees. By following the line of sticks, you managed to find a clearing that led to a ginormous circle of large trees. Past the trees was a ginormous circle made of some stone, with lights dotting it. In the center was a tall, green figure, just standing there. It was too late.. || Lord K: Who goes there? I will destroy you, for you have disturbed my peace! || If you run, he'll kill you. This is the only way.",
        proceedtext: "Battle Lord K for a chance of survival.",
        proceedspecial: "fight|lordk",
        nextloc: "lordkvictory",
    },
    "lordkvictory": {
        name: "lordkvictory",
        formal: "Mysterious Forest",
        desc: "An explored forest that allegedly contains the legendary Lord K, a giant known for destroying everything.",
        loretext: "After defeating Lord K, you started to slowly drag his giant cape and crown back to the factory, which was at least an hour away. The sun went down, and before midnight you reached the factory, as tired as you were when you went to the dance club. Cheese Dino looked surprised, getting even more shocked when the ACE machine confirmed its authenticity. He gave you the 1000 CC bounty that he promised, and he bode you farewell. You left and continued along the road.", 
        proceedtext: "Make your way to Coda.",
        nextloc: "roadtocoda5",
    },
    "roadtocoda5": {
        name: "roadtocoda5",
        formal: "Road to Coda",
        desc: "A road. Too tired to finish description.",
        loretext: "Continuing along the road, you eventually made a hammock from leaves, and fell asleep. Waking up, you continued, not seeing a single person on the desolate, barren road. Why was no one here? Anyways, it's fine. There's not that much of the road to go. You came to a billboard that said, 'CODA - 53 MILES | FILO - 182 MILES | FEEBOLE - 270 MILES'. At least Coda's the closest of the three. || An hour or two later, you came upon a machine that said, 'RANDOM STUFF BUY HERE'. It seemed strange for such thing to be in the middle of the desolate woods, but you were fine with it anyways. What should you get?",
        special: "shop|buycard|buyrelic", 
        proceedtext: "Continue your journey.",
        nextloc: "roadtocoda6",
    },
    "roadtocoda6": {
        name: "roadtocoda6",
        formal: "Road to Coda",
        desc: "A road.",
        loretext: "Hours passed as you slowly walked, your legs begging for mercy. Eventually, you came to a rest stop, which offered a mystery card with DOUBLE stats for 120 coda coins and an energizer foil (makes card's cooldown 2 less) on a card for 150.", 
        proceedtext: "Continue your journey.",
        special: "store|mystery|energizer",
        nextloc: "roadtocoda7",
    },
    "roadtocoda7": {
        name: "roadtocoda6",
        formal: "Road to Coda",
        desc: "A ro.",
        loretext: "One question that you were still dying to know the answer for was: Where is everyone? Sure, there was that one rest stop, but else than that, you haven't met a single person on the road. What must be the cause of this? If so, how can this stop millions of people from traveling? || After some time, you felt a difference in the air. It was as if.. it was even more lonely. Lonelier than it was when you were already at max lonely. How is that possible? You kept walking, hoping to cover as many miles as possible. Why do cars have to be so expensive? || Eventually, you saw a big.. thing. It was entirely made of traffic cones, with big, mad eyes in the front. It was almost as large as Lord K, but there was something about it that didn't make you feel good.. || Traffic Lord: I am the Traffic Lord, and I you are not going to be allowed to continue along this road! || You: What? Why? I've walked like 60 miles already! It's been days! || Traffic Lord: Who asked? Who cares? I am here to take all of your belongings, so I can become the richest being in the world! || You: I'm sorry, but that title belongs to my uncle. || Traffic Lord: Are you sure? I can tell your uncle is struggling. Beanmelon may be the current largest company in the world, but will it last? He gets more and more unhinged everyday. Don't you know that there's something wrong? || You: What? No! What do you mean! Just start this battle already!", 
        proceedtext: "Battle Traffic Lord, the final obstacle blocking you from getting to Coda.",
        proceedspecial: "fight|trafficlord",
        nextloc: "trafficlordvictory",
    },
    "trafficlordvictory": {
        name: "trafficlordvictory",
        formal: "Road to Coda",
        desc: "A.",
        loretext: "The Traffic Lord was defeated. Now there was an answer to why the unending silence, which will soon be gone. While the final impediment to your journey to Coda may have been defeated, the lack of endurance and willpower may be your ultimate demise. There are still at least 40 miles left, and it has been more than a week now. Everything in terrible pain, tired and fatigued. 10 miles more and you might as well collapse and die. Hey.. is that.. a motorcycle? || You stumbled upon a man with spiky, black hair in a black and white coat. He was leaning on his motorcycle, which was leaning on a brown wooden fence. He appeared to be idle, just staring off into the distance, until you caught his eye. || ???: What can I do for you, sir? || You: Uh, can I use that motorcycle to ride along the road? || ???: You can't take it for yourself, but I can drive you to Coda for 600 coda coins. || You: 600 coda coins? || ???: Hey, it's not often I get someone who pays. I can't make money off of one drive a month. || It was the only way to go. 600 coda coins may be a lot, but it's much less than the cost of dying. || Interstate: My name's Interstate, by the way. It's best we leave now, it's an hour long drive.",
        proceedtext: "Hop on the motorcycle and pay Interstate the 600 coda coin fee.",
        nextloc: "coda",
    },
    "coda": {
        name: "coda",
        formal: "Coda",
        desc: "What many know as the largest city in the world, home to millions of people.",
        loretext: "Interstate: Okay, I'll leave you here. || You: Thanks for the ride! || Interstate left you just a few miles before Coda street, by far the busiest road in Coda. It was the road where all of the business happened, where all of the large penthouses and office towers and tourist attractions resided. Twilight would begin soon, so you decided it'd be best to go to another hotel for rest. You walked on the Boraps road until you found a map station, that showed you a layout of the city.  After some time, you found the hotel on the map. It was a 5 mile walk away, and between where your current location and the hotel there was a popular card store. You decided it'd be better to go there later. || During your walk, you spotted many buildings, like the tall BEAN TOWER, the corporate headquarters of Beanmelon Corp. It was just at the intersection between the Boraps Path and Coda Street, overshadowing many buildings with its large size, standing at above 1000 feet. The green light turned on, and you crossed the street, now seeing a large, 9-floor mall in front of you. It was enormous, stretching for more than 3 miles. You decided it'd be better to not enter the real life backrooms, so you crossed the street again, now only a few hundred meters from the hotel. || Almost at the hotel, you spotted the popular card store, Jamodar's Cards, which was very large. Tired, you made your way to the tall hotel, seeing a beautiful display of glossy, mottled marble tiles and fine chandeliers.",
        proceedtext: "Walk up to the register and book a room.",
        nextloc: "hotel2",
    },
    "hotel2": {
        name: "hotel2",
        formal: "Hotel",
        desc: "What many know as the largest city in the world, home to millions of people.",
        loretext: "Surprisingly, there weren't that many people at the hotel. It was a relatively calm day, so most people were probably working or doing their usual business. At the register, you were offered 2 choices, similar to those you got previously. You can book a room for 50 coda coins and gain 70 health, or get a free but low quality room, only healing 20 hp. What do you do?",
        special: "rest",
        proceedtext: "Sleep until the next day.",
        nextloc: "zeend",
    },
    "zeend": {
        name: "zeend",
        formal: "THE END",
        desc: "You have beaten the demo. Good job!",
        loretext: "You see a laid down 8 in front of you, with a condescending aura surrounding it. You have started the infinity loop.",
        proceedtext: "This is your destiny..",
        special: "shop|buycard|buyrelic",
        nextloc: "home",
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
var relicdiv = byId("plrrelics"); //
var relictable;
var speciallock = false;
var speciallock2 = false;
var curspecial1 = null;
var curspecial2 = null;
var alttravelbtn = byId("alttravel");
var textfinished = false;
var currenttext = "";
var currenttextnum = 0;
var rerolls = 0;
var shopmult = 1;
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
        maxhealth: 300,
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
        relics: {},
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
var relics = {
    // rarity 1 == common, 2 == uncommon, 3 == rare
    emberring: {
        name: "emberring",
        formal: "Ember Ring",
        desc: "A strange ring that gives all of the beholder's cards an enchanted flame touch.",
        advdesc: "This ring gives flame touch, with a base value of 3,2. Flame touch makes it so all of your attacking cards inflict burn. Flamethrowers will deal +7 damage.",
        rarity: 1,
        attr: [3,2],
        attrincrease: [0.5,1],
        attrtype: "arrup",
        img: "emberring.png",
    },
    grandfatheroak: {
        name: "grandfatheroak",
        formal: "Grandfather Oak",
        desc: "A wise and majestic oak that has seen everything.",
        advdesc: "Having lived for so long, this tree grants your cards a base +10% health.",
        rarity: 2,
        attr: 10,
        attrincrease: 2,
        attrtype: "int",
        img: "grandfatheroak.png",
    },
    lifecapsule: {
        name: "lifecapsule",
        formal: "Life Capsule",
        desc: "A neon, futuristic capsule containing life essence.",
        advdesc: "The life capsule contains life essence that increases a player's max health. The base increase is 60, and then 9 for every additional capsule bought.",
        rarity: 1,
        attr: 60,
        attrincrease: 20,
        attrtype: "int",
        img: "lifecapsule.png",
    },
    redstarmedallion: {
        name: "redstarmedallion",
        formal: "Red Star Medallion",
        desc: "Pledge your loyalty to the star, and gain ultimate power.",
        advdesc: "Deal extra damage for every 10 health you are missing. Cultists will get double this amount, use 0.5 less mana, and will heal you one eighth of their damage.",
        rarity: 3,
        attr: 1,
        attrincrease: 0.25,
        attrtype: "int",
        img: "lifecapsule.png",
    },
    partyhat: {
        name: "partyhat",
        formal: "Party Hat",
        desc: "It's time for some big celebration!!",
        advdesc: "Heal 5% of your max health every time you win a battle.",
        rarity: 2,
        attr: 5,
        attrincrease: 5,
        attrtype: "int",
        img: "partyhat.png",
    },
    trashcan: {
        name: "trashcan",
        formal: "Trash Can",
        desc: "What a wasteful person.",
        advdesc: "Gain an extra discard. If you buy this enough times you'll be able to get more discards.",
        rarity: 1,
        attr: 1,
        attrincrease: 0.5,
        attrtype: "int",
        img: "trashcan.png",
    },
    coinsack: {
        name: "coinsack",
        formal: "Coin Sack",
        desc: "A big, leather sack made to hold as many coins as possible.",
        advdesc: "After a battle, gain double the amount of coins that you usually do. This increases by 15% for every duplicate you have. The '1' in this relic's stat value means that you earn 100% more coins than usual.",
        rarity: 1,
        attr: 1,
        attrincrease: 0.15,
        attrtype: "int",
        img: "coinsack.png",
    },
    mammothtusk: {
        name: "mammothtusk",
        formal: "Mammoth Tusk",
        desc: "An ancient tusk belonging to a mammoth uncovered near the Jarj Mountain Ranges.",
        advdesc: "If your board has 3 or more spearmen, they will deal 50% more damage. Otherwise, they will deal 30% less damage.",
        rarity: 2,
        attr: [50,30],
        attrincrease: [5,-3],
        attrtype: "arrup",
        img: "mammothtusk.png",
    },
    gamblersdice: {
        name: "gamblersdice",
        formal: "Gambler's Dice",
        desc: "A pair of dice that was once used by top gamblers.",
        advdesc: "Mana gain now goes from 60-150% of the standard amount. These stats slowly increase as you buy more of this relic.",
        rarity: 2,
        attr: [60,150],
        attrincrease: [5,5],
        attrtype: "arrup",
        img: "gamblersdice.png",
    },
    soullantern: {
        name: "soullantern",
        formal: "Soul Lantern",
        desc: "An arcane lantern with a radiating faint, blue glow.",
        advdesc: "Weakeners, wizards, soul keepers, and reapers all deal 20% more damage, your starting mana is also increased by 1 (fixed value).",
        rarity: 2,
        attr: 20,
        attrincrease: 3,
        attrtype: "int",
        img: "soullantern.png",
    },
    thundercrate: {
        name: "thundercrate",
        formal: "Thunder Crate",
        desc: "A supply crate that zaps out flashes of thunder.",
        advdesc: "Supply crates also energize cards, and vice versa.",
        rarity: 1,
        attr: 0,
        attrincrease: 0,
        attrtype: "int",
        img: "thundercrate.png",
    },
    hammerhammer: {
        name: "hammerhammer",
        formal: "Hammer Hammer",
        desc: "Hammer but two.",
        advdesc: "Factories and dyson spheres create 2 cards, but cost 1 more mana.",
        rarity: 1,
        attr: 0,
        attrincrease: 0,
        attrtype: "int",
        img: "hammerhammer.png",
    },
    frostyhorn: {
        name: "frostyhorn",
        formal: "Frosty Horn",
        desc: "An old, cold horn that calls to the beasts of frost.",
        advdesc: "When a card is used, the first Froster (on cooldown) on board loses its cooldown. The card used cannot be a Froster.",
        rarity: 3,
        attr: 0,
        attrincrease: 0,
        attrtype: "int",
        img: "frostyhorn.png",
    },
    quincyspillar: {
        name: "quincyspillar",
        formal: "Quincy's Pillar",
        desc: "A tall pillar standing out in the ambient distance.",
        advdesc: "Attacks that deal less than 45 damage give you 15 coda coins.",
        rarity: 1,
        attr: 15,
        attrincrease: 5,
        attrtype: "int",
        img: "quincyspillar.png",
    },
    orbmix: {
        name: "orbmix",
        formal: "Orb Mix",
        desc: "A special mix of substances to further enhance healing orbs.",
        advdesc: "Healing orbs heal 10 more hp.",
        rarity: 1,
        attr: 10,
        attrincrease: 4,
        attrtype: "int",
        img: "orbmix.png",
    },
    morningglory: {
        name: "morningglory",
        formal: "Morning Glory",
        desc: "A bright, blooming flower giving off a rich, aromatic scent.",
        advdesc: "Deal double damage on the first turn of every battle, but lose 15 coda coins if the attacked enemy doesn't die.",
        rarity: 3,
        attr: 1,
        attrincrease: 0.25,
        attrtype: "int",
        img: "morningglory.png",
    },
}
var cards = {
    spearman: {
        name: "spearman",
        formal: "Spearman",
        atk: 35,
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
        hp: 65,
        ammo: 3,
        maxammo: 3,
        manause: 1,
        cool: 2,
        coolleft: 0,
        stat: 6,
        statincrease: 1,
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
        manause: 1.5,
        cool: 1,
        coolleft: 1,
        stat: 3,
        statincrease: 0.5,
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
        cool: 0,
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
        atk: 70,
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
        atk: 40,
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
        hp: 30,
        ammo: 1,
        maxammo: 1,
        manause: 2,
        stat: 10,
        statincrease: 3,
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
        manause: 1,
        cool: 0,
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
        manause: 0,
        cool: 0,
        coolleft: 0,
        stat: 50,
        statincrease: 10,
        desc:"A strong potion that boosts an ally's attack by 50%.",
        funnyname: "ATTACK POTIONORIONIO",
        type: "Support",
        img: "atkpotion.png",
    },
    factory: {
        name: "factory",
        formal: "Factory",
        hp: 80,
        manause: 2,
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
        atk: 60,
        hp: 60,
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
        stat: 1,
        statincrease: 0.5,
        desc:"A janky old generator that creates mana for free.",
        funnyname: "MANA GENERATICONIC",
        type: "Support",
        img: "managenerator.png",
    },
    energycapsule: {
        name: "energycapsule",
        formal: "Energy Capsule",
        hp: 30,
        manause: 1, 
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
        manause: 2,
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
        manause: 1,
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
        atk: 60,
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
function arrHas(arr,substr) {
    return arr.some(str => str.includes(substr));
}
function arrFirst(arr,substr) {
    return arr.filter(str => str.includes(substr))[0];
}
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
function drawCard(player,specific = false,choice = null,otherargs = []) {
    let table = "inventory";
    if (otherargs.includes("addToDeck")) {
        table = "deck";
    } 
    if (Object.keys(Game[player][table]).length >= 10) {
        return "Too many cards!";
    }

    let chosenkey;
    chosenkey = randKey(Game[player].deck);
    if (otherargs.includes("addToDeck")) {
        chosenkey = randKey(cards);
        
    }
    if (specific == true) {
        chosenkey = cards[choice];
        if (Object.keys(Game[player].deck).includes(choice)) {
            chosenkey = Game[player].deck[choice];
        }
    }
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
    if (otherargs == []) {
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
    if (otherargs.includes("addToDeck") == false) {
        if (player == "p1" && Object.hasOwn(p1.relics,"hammerhammer") && ["factory","dysonsphere"].includes(key.name)) {
            key.manause += 1;
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
        if (Game[player].mods.some(str => str.includes("QuickUse"))) {
            let str = Game[player].mods.filter(str => str.includes("QuickUse"))[0];
            str = str.replace("QuickUse{","");
            str = Number(str.replace("}",""));
            if (key.cool != 0) {
                key.cool -= str;
                key.coolleft -= str;
                if (key.coolleft < 0) {
                    key.coolleft = 0;
                    key.hp += 15;
                }
            }
        }
        if (Game[player].mods.some(str => str.includes("Tank"))) {
            let str = Game[player].mods.filter(str => str.includes("Tank"))[0];
            str = str.replace("Tank{","");
            str = Number(str.replace("}",""));
            key.hp += key.hp*(str/100);
            key.hp = Math.round(key.hp);
        }
        if (Game[player].mods.some(str => str.includes("Strength")) && Object.hasOwn(key,"atk")) {
            let str = Game[player].mods.filter(str => str.includes("Strength"))[0];
            str = str.replace("Strength{","");
            str = Number(str.replace("}",""));
            key.atk += key.atk*(str/100);
            key.atk = Math.round(key.atk);
        }
        if (Game[player].mods.some(str => str.includes("Healing")) && Object.hasOwn(key,"heal")) {
            let str = Game[player].mods.filter(str => str.includes("Healing"))[0];
            str = str.replace("Healing{","");
            str = Number(str.replace("}",""));
            key.heal += key.heal*(str/100);
            key.heal = Math.round(key.heal);
        }
    }
    if (otherargs.includes("doubleStats")) {
        key.hp *= 2;
        if (Object.hasOwn(key,"atk")) {
            key.atk *= 2;
        }
        if (Object.hasOwn(key,"heal")) {
            key.heal *= 2;
        }
        if (Object.hasOwn(key,"stat")) {
            key.stat += key.statincrease*2;
        }
    }
    key.hp = Math.round(key.hp);
    if (Object.hasOwn(key,"atk")) {
        key.atk = Math.round(key.atk);
    }
    if (Object.hasOwn(key,"heal")) {
        key.heal = Math.round(key.heal);
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
        if (newmod.includes(",")) {
            let nmp2 = newmod[1].replace("}","");
            return [newmod[0],nmp2];
        } else {
            return Number(newmod.replace("}",""));
        }
        
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
    Game.p2 = {};
    let zeopp = enemies[enemy];
    turns = 0;
    p1.mods = [];
    battletitle.innerHTML = "Fight Against "+zeopp.formal;
    p1.mana = p1.startingmana;
    assign(Game.p2,zeopp);
    p2 = Game.p2;
    for (let i = 0; i<zeopp.simpledeck.length; i++) {
        drawCard("p2",true,zeopp.simpledeck[i],"addToDeck");
    }
    for (let i = 0; i < 3; i++) {
        drawCard("p1",false,null,"Start");
    }
    for (let j = 0; j < 3; j++) {
        drawCard("p2",false,null,"Start");
    }
    if (currentmode == "Hard") {
        p2.health *= 1.2;
    }
    if (currentmode == "Cataclysm") {
        p2.health *= 2;
    }
    if (currentmode == "Easy") {
        p2.health *= 0.7;
    }
    gamescreen.style.display = "block";
    // RELICS
    if (Object.hasOwn(p1.relics,"emberring")) {
        let relic = p1.relics["emberring"];

        p1.mods.push("FlameTouch{"+relic.attr.toString()+"}");
    }
    if (Object.hasOwn(p1.relics,"grandfatheroak")) {
        let relic = p1.relics["grandfatheroak"];
        p1.mods.push("Tank{"+relic.attr+"}");
    }
    if (Object.hasOwn(p1.relics,"redstarmedallion")) {
        let relic = p1.relics["redstarmedallion"];
        p1.mods.push("RedStarMedallion{"+relic.attr+"}");
    }
    if (Object.hasOwn(p1.relics,"soullantern")) {
        let relic = p1.relics["soullantern"];
        p1.mods.push("SoulLantern{"+relic.attr+"}");
    }
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
        p1.coins += Math.round((randNum(10,20)/10)*(enemy.health/10));
        p1.coins += enemy.coinsgive;
        if (Object.hasOwn(p1.relics,"coinsack")) {
            p1.coins += Math.round((randNum(10,20)/10)*(enemy.health/10)*p1.relics.coinsack.attr);
        }
        enemy.managain *= 1.5;
        enemy.health *= 1.5;
        enemy.mana *= 1.5;
        if (Object.hasOwn(p1.relics,"partyhat")) {
            p1.health += (p1.relics["partyhat"].attr/100)*p1.maxhealth;
            p1.health = Math.round(p1.health);
            if (p1.health > p1.maxhealth) {
                p1.health = p1.maxhealth;
            }
        }
        if (enemy.name == "cheesedino") {
            p1.maxhealth += 50;
            p1.health += 50;
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
        p1.health -= 25;
        p2.health -= 50;
        p1.mana += 22;
        p2.mana += 15;
    }
    let plr;
    if (player == "p1") {
        plr = p1;
    } else {
        plr = p2;
    }
    if (plr.name == "janjo" && turns % 4 == 0) {
        for (let i = 0; i < 3; i++) {
            let card = randKey(p1.inventory);
            if (card != null) {
                if (arrHas(card.effects,"Burning") == false) {
                    card.effects.push("Burning{1,1}");
                }
            }
        }
    }
    if (plr.name == "djneon" && turns % 4 == 0) {
        for (let i = 0; i < 3; i++) {
            let card = randKey(p1.inventory);
            console.log("yuh",card);
            if (card != null) {
                if (arrHas(card.effects,"Stunned") == false) {
                    card.effects.push("Stunned{1,2}");
                }
            }
        }
    }
    if (plr.name == "lordk" && turns % 4 == 0) {
        for (let i = 0; i < 3; i++) {
            let card = randKey(p1.inventory);
            console.log("yuh",card);
            if (card != null) {
                if (arrHas(card.effects,"Stunned") == false) {
                    card.effects.push("Stunned{1,2}");
                }
                card.hp -= 20;
            }
        }
    }
    plr.discards = plr.maxdiscards;
    plr.mana += plr.managain;
    if (plr == p1 && arrHas(Object.keys(plr.relics),"gamblersdice")) {
        plr.mana -= plr.managain;
        plr.mana += Math.round((randNum(plr.relics.gamblersdice.attr[0], plr.relics.gamblersdice.attr[1])/100)*plr.managain);
    }
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
                zecard.hp -= 15;
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
            zecard.atk += 30;
        }
        if (zecard.name == "bank") {
            zecard.storedmana += 2;
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
        if (Object.keys(p2.inventory).length<7 && p1.mana> 8) {
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
            choice = 0;
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
                if (randNum(1,2) == 1) {
                    oppAttack();
                }
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
            if (user == p1 && Object.hasOwn(p1.relics,"frostyhorn") && card.name != "froster") {
                let chosen;
                for (let i = 0; i < Object.keys(p1.inventory).length; i++) {
                    let card = p1.inventory[Object.keys(p1.inventory)[i]];
                    if (card.name == "froster" && card.coolleft > 0) {
                        chosen = card;
                        break;
                    }
                }
                if (chosen != null) {
                    chosen.coolleft = 0;
                }
                
            }
            if (card.type == "Attack") {
                
                let attacked = firstOpp(stropp);
                let extraatk = 0;
                if (user.mods.some(str => str.includes("RedStarMedallion"))) {
                    let cm = cleanseModifier("Norm",user.mods.filter(str => str.includes("RedStarMedallion"))[0]);
                    let zextra;
                    if (user == p1) {
                        zextra = cm*((p1.maxhealth-p1.health)/10);
                    } else {
                        zextra = cm*((enemies[p2.name].health-p2.health)/10);
                    }
                    extraatk += Math.round(zextra);
                    card.atk += Math.round(zextra);
                }
                if (user == p1 && Object.hasOwn(p1.relics,"morningglory") && turns == 0) {
                    extraatk += Math.round(card.atk*p1.relics.morningglory.attr);
                    card.atk += Math.round(card.atk*p1.relics.morningglory.attr);
                }
                if (user == p1 && Object.hasOwn(p1.relics,"quincyspillar") && card.atk+extraatk < 45) {
                    p1.coins += p1.relics.quincyspillar.attr;
                }
                if (attacked == "Opp") {
                    opponent.health -= card.atk+extraatk;
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
                    if (arrHas(user.mods,"SoulLantern") == true && ["soulkeeper","weakener","wizard","reaper"].includes(card.name)) {
                        let cm = cleanseModifier("Norm",arrFirst(user.mods,"SoulLantern"));
                        zeattacked.hp -= Math.round(card.atk*(cm/100));
                    }
                    if (user == p1 && Object.hasOwn(p1.relics,"mammothtusk") && card.name == "spearman") {
                        let count = 0;
                        for (let i = 0; i < Object.keys(p1.inventory).length; i++) {
                            let card = Object.keys(p1.inventory)[i];
                            if (card.includes("spearman")) {
                                count += 1;
                            }
                        }
                        if (count < 3) {
                            zeattacked.hp += Math.round(card.atk*0.3);
                        } else {
                            zeattacked.hp -= Math.round(card.atk*0.5);
                        }
                    }
                    if (card.name == "turret") {
                        card.atk += card.stat;
                    }
                    if (card.name == "bandit") {
                        let managain = Math.ceil(opponent.mana*(randNum(20,60)/100));
                        if (managain < 1) {
                            managain = 1;
                        }
                        user.mana += managain;
                        opponent.mana -= managain;
                        if (opponent.mana < 2) {
                            opponent.mana = 2;
                        }
                    }
                    zeattacked.hp -= card.atk;
                    if (card.name == "solarprism") {
                        opponent.health -= card.atk;
                    }
                    if (card.name == "charger") {
                        card.atk = 40;
                        for (let i = 0; i < 3; i++) {
                            let card = opponent.inventory[Object.keys(opponent.inventory)[i]];
                            if (card != undefined) {
                                let substr = "Shock";
                                if (card.effects.some(str => str.includes(substr)) == false) {
                                    card.effects.push("Shock{1,1}");
                                    
                                }
                            } else {
                                opponent.health -= 20;
                            }
                        }
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
                            chosen.atk -= Math.round(card.stat*2);
                            card.atk += card.stat;
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
                        if (arrHas(user.mods,"FlameTouch")) {
                            zeattacked.hp -= 7;
                        }
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
                        for (let i = 0; i < 4; i++) {
                            let card = opponent.inventory[Object.keys(opponent.inventory)[i]];
                            if (card != undefined) {
                                let substr = "Stunned";
                                if (card.effects.some(str => str.includes(substr)) == false) {
                                    card.effects.push("Stunned{1,1}");
                                    
                                }
                                card.hp -= 20;
                                
                            } else {
                                opponent.health -= 20;
                            }
                        }
                        for (let i = 0; i < Object.keys(opponent.inventory).length; i++) {
                            let card = opponent.inventory[Object.keys(opponent.inventory)[i]];
                            if (card.hp <= 0 && card != zeattacked) {
                                delete opponent.inventory[Object.keys(opponent.inventory)[i]];
                            }
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
                                chosen.effects.push("Death{1,2}");
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
                        zeattacked.hp -= add;
                        if (arrHas(user.mods,"RedStarMedallion")) {
                            user.mana += 0.5;
                            if (extraatk > 0) {
                                card.atk += Math.round(extraatk);
                                extraatk = Math.round(extraatk)*2;
                                user.health += extraatk/4;
                                user.health = Math.round(user.health);
                            }
                        }
                    }
                    if (card.name == "robot" && turns < 5) {
                        let add = 0;
                        for (let i = 0; i < Object.keys(user.inventory).length; i++) {
                            let tempchosen = user.inventory[Object.keys(user.inventory)[i]];
                            if (tempchosen.name == "robot") {
                                add += 1;
                            }
                        }
                        user.maxhealth += add;
                        user.health += add/1;
                        user.health = Math.round(user.health);
                    }
                    if (zeattacked.hp <= 0) {
                        if (card.name == "soulkeeper") {
                            user.mana += 0.5;
                            user.mana = Number(user.mana.toFixed(1));
                            if (card.hp < 75+card.stat*5) {
                                card.hp += Math.round(card.stat*2.3); // 7
                            }
                            if (user.health < user.maxhealth-25) {
                                user.health += card.stat; // 3
                            }
                            if (card.atk < 55+card.stat*5) {
                                card.atk += Math.round(card.stat*1.3); // 4
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
                        
                    } else {
                        if (user == p1 && Object.hasOwn(p1.relics,"morningglory") && turns == 0) {
                            p1.coins -= 15;
                            if (p1.coins < 0) {
                                p1.coins = 0;
                            }
                        }
                    }
                }
                if (extraatk > 0) {
                    card.atk -= extraatk;
                }
                card.ammo -= 1;
                if (card.ammo <= 0) {
                    card.coolleft = card.cool;
                    card.ammo = card.maxammo;
                    if (card.name == "turret") {
                        card.atk -= card.stat*2;
                    }
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
                    if (user == p1) {
                        if (user.health > user.maxhealth) {
                            user.health = user.maxhealth;
                        }
                    }
                } else {
                    zechosen.hp += card.heal;
                    if (user == p1 && Object.hasOwn(p1.relics,"orbmix") && card.name == "healorb") {
                        zechosen.hp += p1.relics.orbmix.attr;
                    }
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
                if (card.name == "supplycrate" || (user == p1 && Object.hasOwn(p1.relics,"thundercrate") && card.name == "energycapsule")) {
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
                    if (gain < 3) {
                        gain = 3;
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
                    chosen.atk *= 1+(card.stat/100);
                    chosen.atk = Math.round(chosen.atk);
                    if (arrHas(chosen.effects,"Guarded") == false) {
                        chosen.effects.push("Guarded{1,3}");
                    }
                    chosen.ammo += 1;
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
                    user.mana += card.stat;
                    card.ammo -= 1;
                    if (card.ammo <= 0) {
                        card.coolleft = card.cool;
                        card.ammo = card.maxammo;
                    }
                }
                if (card.name == "energycapsule" || (user == p1 && Object.hasOwn(p1.relics,"thundercrate") && card.name == "supplycrate")) {
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
                    chosen.ammo += 1;
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
                    temp1.hp += 10;
                    temp2 = Object.assign(temp2,card2);
                    temp2.hp += 10;
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
                
                if (user == p1 && ["dysonsphere","factory"].includes(card.name) && Object.hasOwn(p1.relics,"hammerhammer")) {
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
                    }
                    if (card.name == "factory") {
                        drawCard(strmain,true,"robot");
                    }
                }
            }
            if (card.type == "Action") {
                if (card.name == "ritual") {
                    drawCard(strmain,true,"cultist");
                    drawCard(strmain,true,"cultist");
                    drawCard(strmain,true,"cultist");
                    delete user.inventory[Object.keys(user.inventory)[index]];
                    let loss = 20;
                    if (user.health - 20 < 1) {
                        loss = 20-user.health;
                    }
                    user.health -= loss;
                }
                if (card.name == "drawback") {
                    let tempmana = 0;
                    let temphp = 0;
                    for (let i = 0; i < Object.keys(user.inventory).length; i++) {
                        let tempcard = user.inventory[Object.keys(user.inventory)[i]];
                        if (tempcard.hp/9 > 5) {
                            tempmana += 5;
                        } else {
                            tempmana += tempcard.hp/9;
                        }
                        if (tempcard.hp/4.5 > 10) {
                            temphp += 10;
                        } else {
                            temphp += tempcard.hp/4.5;
                        }
                        
                    }
                    temphp = Math.round(temphp);
                    if (temphp > 75) {
                        temphp = 75;
                    }
                    tempmana = Math.round(tempmana);
                    if (tempmana > 30) {
                        tempmana = 30;
                    }
                    user.mana += tempmana;
                    user.health += temphp;
                    user.maxhealth += Math.round(temphp/3);
                    if (user.health > user.maxhealth) {
                        user.health = user.maxhealth;
                    }
                    user.inventory = {};
                    update();
                    return;
                }
                if (card.name == "armageddon") {
                    user.mana += 16;
                    opponent.mana += 6;
                    user.health -= 30;
                    opponent.health -= 30;
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
    if (mod == "uncleman") {
        drawCard("p1",true,"factory","addToDeck");
        p1.maxhealth = 500;
        p1.health = 500;
        p1.maxdiscards = 2;
        p1.discards = 2;
        p1.managain = 7;
    }
    if (currentmode == "Hard") {
        p1.health *= 0.7;
        p1.maxhealth *= 0.7;
        //p1.managain *= 0.8;
    }
    if (currentmode == "Cataclysm") {
        p1.health *= 0.2;
        p1.maxhealth *= 0.2;
    }
    if (currentmode == "Easy") {
        p1.health *= 2;
        p1.maxhealth *= 2;
        p1.managain *= 2;
    }
    p1.health = Math.round(p1.health);
    p1.maxhealth = Math.round(p1.maxhealth);
    p1.managain = Math.round(p1.managain);
}
/*function transitionScreen(arg) {
    // SET TO DISPLAY; E.G. BOOL TRUE = DISPLAY; BOOL FALSE = DON'T DISPLAY;
    let elem = byId("transition");
    if (arg == true) {
        adventurescreen.style.display = "none";
        adventurescreen.style.opacity = 0;
        elem.style.display = "block";
        elem.style.opacity = 1;
        window.setTimeout(transitionScreen, 500, false);
    }
    if (arg == false) {
        elem.style.opacity = 0;
        adventurescreen.style.display = "block";
        
        window.setTimeout(transitionScreen, 500, "falser");
    }
    if (arg == "falser") {
        elem.style.display = "none";
        adventurescreen.style.opacity = 1;
    }
}*/
function enterAdventureScreen() {
    adventurescreen.style.opacity = 1;
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
    if (curlocation.name == "lordkvictory") {
        p1.coins += 1000;
    }
    if (Object.hasOwn(curlocation,"proceedspecial")) {
        let splitarr1;
        let type;
        let typearg;
        if (curlocation.proceedspecial.includes("|")) {
            splitarr1 = curlocation.proceedspecial.split("|");
            type = splitarr1[0];
            typearg = splitarr1[1];
        } else {
            type = curlocation.proceedspecial;
        }
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
        curspecial1 = null;
        curspecial2 = null;
        byId("sc1").style.display = "block";
        byId("sc2").style.display = "block";
        byId("sc3").style.display = "block";
        let special = curlocation.special;
        if (curlocation.special.includes("|") == false) {
            curspecial1 = curlocation.special;
        } else {
            let secondhalf = curlocation.special.split("|");
            secondhalf.splice(0, 1);
            curspecial1 = secondhalf[0];
            curspecial2 = secondhalf[1];
            console.log(secondhalf,curlocation.special);
        }
        console.log(special,curspecial1,curspecial2);
        if (curspecial1 == "gaincard") {
            specialdiv.style.display = "block";
            Array.from(document.getElementsByClassName("specialcard")).forEach(function(element) {
                if (element.getAttribute("id").includes("a")) {
                    return;
                }
                let card = randKey(cards);
                if (special.includes("gaincardupg") || special =="tallmart") {
                    let chance = randNum(1,2);
                    if (chance > 0) {
                        let chance2 = randNum(1,10);
                        if (chance2 > 0) {
                            if (Object.hasOwn(card,"atk")) {
                                card.atk *= randNum(7,20)/10;
                                card.atk = Math.round(card.atk);
                            }
                            if (Object.hasOwn(card,"heal")) {
                                card.heal *= randNum(7,20)/10;
                                card.heal = Math.round(card.heal);
                            }
                        } 
                        if (chance2 > 4) {
                            let prevcool = card.cool;
                            card.cool -= randNum(1,3);
                            if (card.cool < 1 && prevcool != 0) {
                                card.cool = 1;
                            }
                            if (card.cool < 0) {
                                card.cool = 0;
                            }
                            card.hp *= randNum(7,20)/10;
                            card.hp = Math.round(card.hp);
                        }
                        if (chance2 > 7) {
                            let prevuse = card.manause;
                            card.manause -= randNum(1,6)/2;
                            if (card.manause < 0.5 && prevuse >= 0.5) {
                                card.manause = 0.5;
                            }
                            if (card.manause < 0) {
                                card.manause = 0;
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
        if (curspecial1 == "buycard") {
            specialdiv.style.display = "block";
            Array.from(document.getElementsByClassName("specialcard")).forEach(function(element) {
                if (element.getAttribute("id").includes("a")) {
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
                            card.heal = Math.round(card.heal);
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
                        let prevuse = card.manause;
                        card.manause -= randNum(1,6)/2;
                        if (card.manause < 0.5 && prevuse >= 0.5) {
                            card.manause = 0.5;
                        }
                        if (card.manause < 0) {
                            card.manause = 0;
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
        }
        if (curspecial2 == "buyrelic") {
            specialdiv2.style.display = "block";
            Array.from(document.getElementsByClassName("tooltip")).forEach(function(element2) {
                element2.remove();
            })
            Array.from(document.getElementsByClassName("specialcard")).forEach(function(element) {
                element.classList.remove("tooltipholder");
                if (element.getAttribute("id").includes("a") == false) {
                    return false;
                }
                let relic = randKey(relics);
                console.log(relic);
                let chance = randNum(1,10);
                element.innerHTML = `<h2>${relic.formal}</h2>`;
                element.setAttribute("data-relic",relic.name);
                let cost = 2;
                cost *= (relic.rarity+1)**2;
                cost *= 20;
                cost = Math.round(Math.log(cost)*10);
                element.setAttribute("data-cost",cost);
                
                let text = `<p>${relic.desc}<br>${relic.rarity} RARITY`;
                text += ` | ${cost} COST`;
                text += "</p>";
                console.log(text);
                element.innerHTML += text;
                console.log(element.innerHTML);
                let relictooltip = document.createElement("span");
                relictooltip.style.width = "38%";
                relictooltip.className = "tooltip";
                relictooltip.innerHTML = `<h3 style="font-size:22px;margin:0;">${relic.formal}</h3><p style="font-size:14px;">${relic.desc}<br><br>${relic.advdesc}<br><br>Current relic stats: ${relic.attr.toString()}</p>`;
                element.appendChild(relictooltip);
                element.classList.add("tooltipholder");
            });
        }
        if (curspecial1 == "beancandispenser") {
            specialdiv.style.display = "block";
            byId("sc2").style.display = "none";
            byId("sc3").style.display = "none";
            byId("sc1").innerHTML = "<h2>Bean Dispenser</h2><p>+50 health, but at the cost of 20 coda coins. Capped at max health.</p>";
        }
        if (curspecial1 == "rest") {
            specialdiv.style.display = "block";
            byId("sc3").style.display = "none";
            byId("sc2").innerHTML = "<h2>ULTRA-CHEAP Room</h2><p>Dirty, old mattresses for the night. It's free, but only heals 20 health.</p>";
            byId("sc2").setAttribute("data-cost",0);
            byId("sc2").setAttribute("data-heal",20);
            byId("sc1").innerHTML = "<h2>Standard Room</h2><p>+70 health, but at the cost of 50 coda coins. Capped at max health.</p>";
            byId("sc1").setAttribute("data-cost",50);
            byId("sc1").setAttribute("data-heal",70);
        }
        if (curspecial1 == "mystery") {
            specialdiv.style.display = "block";
            specialdiv2.style.display = "none";
            byId("sc2").style.display = "none";
            byId("sc3").style.display = "none";
            byId("sc1").innerHTML = "<h2>Mystery Box</h2><p>Lose 120 coda coins, but get a random card with DOUBLE stats.</p>";
        }
        if (curspecial1 == "destroycard" || curspecial1 == "upgcard" || curspecial2 == "upgcard") {
            specialdiv.style.display = "none";
            specialdiv2.style.display = "none";
            if (curlocation.name == "cosmeticshop") {
                specialdiv.style.display = "block";
            }
        }
    } else {
        specialdiv.style.display = "none";
        specialdiv2.style.display = "none";
        curspecial1 = null;
        curspecial2 = null;
    }
    statsdiv.innerHTML = `
    <p>
        ${p1.health} Health | ${p1.coins} Coda Coins
    </p>
    <p>
        ${p1.managain} Mana Gain | ${p1.maxdiscards} Discards
    </p>
    `;
    console.log(textfinished);
    if (curlocation.loretext.includes("||") && textfinished == false) {
        travelbtn.innerHTML = "Next";
        alttravelbtn.style.display = "block";
        alttravelbtn.innerHTML = "Skip Dialogue";
        loretxt.innerHTML = currenttext;
        proceedtxt.style.display = "none";
        proceeddesc.style.display = "none";
        byId("reroll").style.display = "none";
        specialdiv.style.display = "none";
        specialdiv2.style.display = "none";
    } else {
        alttravelbtn.innerHTML = "Skip";
        if (Object.hasOwn(curlocation,"skipallowed")) {
            alttravelbtn.style.display = "block";
        } else {
            alttravelbtn.style.display = "none";
        }
        console.log(curspecial1 != null && curspecial1 != "upgcard" && curspecial1 != "destroycard");
        if (curspecial1 != null && curspecial1 != "upgcard" && curspecial1 != "destroycard") {
            specialdiv.style.display = "block";
            console.log("yo");
        }
        if (curspecial2 != null && ["destroycard", "upgcard", "mystery"].includes(curspecial2) == false) {
            specialdiv2.style.display = "block";
        }
        if (textfinished == true) {
            loretxt.innerHTML = currenttext;
        }
        if (sCondition("gaincard")[0] == true || sCondition("buycard")[0] == true || sCondition("buyrelic")[0] == true) {
            byId("reroll").style.display = "block";
        } else {
            byId("reroll").style.display = "none";
        }
        proceedtxt.style.display = "block";
        proceeddesc.style.display = "block";
        
    }
    updateAdventureScreen();
    
    
}
function updateAdventureScreen() {
    statsdiv.innerHTML = `
    <p>
        ${p1.health}/${p1.maxhealth} Health | ${p1.coins} Coda Coins
    </p>
    <p>
        ${p1.managain} Mana Gain | ${p1.maxdiscards} Discards
    </p>
    `;
    // CARDS
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
            card.setAttribute("data-card",Object.keys(p1.deck)[(j*4)+i]);
            card.setAttribute("data-usetimes",0);
            card.className = "inventorytablecard";
            
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
    // RELICS
    if (relictable != null) {
        relictable.remove();
    }
    
    relictable = document.createElement('table');
    relictable.id = "inventorytable";3
    relicdiv.appendChild(relictable);
    let remainder2 = Object.keys(p1.deck).length % 4;
    let finaltr2;
    for (let j = 0; j < Math.ceil(Object.keys(p1.relics).length/4); j++) {
        let zerow = document.createElement('tr');
        if (j-Math.ceil(Object.keys(p1.relics).length/4) == 1) {
            finaltr2 = zerow;
        }
        relictable.appendChild(zerow);
        for (let i = 0; i < 4; i++) {
            if ((j*4)+i > Object.keys(p1.relics).length-1) {
                break;
            }
            let relic = document.createElement('td');
            relic.style.width = "120px";
            relic.style.height = "120px";
            
            let currelic = p1.relics[Object.keys(p1.relics)[(j*4)+i]];
            
            relic.innerHTML = "<span class='title'>"+currelic.formal+":</span><br>"+currelic.rarity+" RARITY | ";
            relic.innerHTML += "<br><hr><span class='desc'>"+currelic.desc+"</span>";
            let tempimg;
            if (currelic.img != "") {
                tempimg = "url(img/relics/"+currelic.name+".png)";  
                relic.style.backgroundSize = "120px 120px";
            } else {
                tempimg = "url()";
                relic.style.backgroundSize = "120px 120px";
            }
            relic.style.backgroundSize = "120px 120px";
            relic.style.backgroundImage = tempimg;
            relic.className = "tooltipholder";
            let relictooltip = document.createElement("span");
            relictooltip.className = "tooltip";
            relictooltip.innerHTML = `<h3>${currelic.formal}</h3><p>${currelic.desc}<hr>${currelic.advdesc}<hr>Current relic stats: ${currelic.attr.toString()}</p>`;
            zerow.appendChild(relic);
            relic.appendChild(relictooltip);
            
        }
    }
    Array.from(document.getElementsByClassName("inventorytablecard")).forEach(function(element) {
        element.addEventListener('click', function() {
            if (curspecial1 == "destroycard" && Object.keys(p1.deck).length > 1) {
                let card = p1.deck[element.getAttribute("data-card")];
                if (curlocation.name == "behindtallmart") {
                    p1.coins += 15;
                }
                if (curlocation.name == "roadtocoda4") {
                    if (speciallock == true) {
                        return false;
                    }
                    speciallock = true;
                    if (randNum(1,2) == 1) {
                        p1.health += 30;
                    } else {
                        p1.health -= 30;
                    }
                    if (p1.health > p1.maxhealth) {
                        p1.health = p1.maxhealth;
                    }
                    
                }
                console.log(card);
                delete p1.deck[element.getAttribute("data-card")];
                updateAdventureScreen();
            }
            if (sCondition("upgcard")[0]) {
                if (curlocation.name == "cheesedinovictory") {
                    if (curspecial1 == "upgcard" && speciallock < 3) {
                        if (p1.coins < 30) {
                            return false;
                        } else {
                            p1.coins -= 30;
                        }
                        if (typeof speciallock == "boolean") {
                            speciallock = 1;
                        } else {
                            speciallock++;
                        }
                        let card = p1.deck[element.getAttribute("data-card")];
                        card.hp *= 1.2;
                        card.hp = Math.round(card.hp);
                        if (Object.hasOwn(card,"atk")) {
                            card.atk *= 1.2;
                            card.atk = Math.round(card.atk);
                        }
                        if (Object.hasOwn(card,"heal")) {
                            card.heal *= 1.2;
                            card.heal = Math.round(card.heal);
                        }
                        if (Object.hasOwn(card,"stat")) {
                            card.stat += card.statincrease;
                        }
                        updateAdventureScreen();
                    }
                }
                if (curlocation.name == "cosmeticshop") {
                    if (curspecial2 == "upgcard" && speciallock2 < 2) {
                        if (speciallock == true && speciallock2 == 1) {
                            return false;
                        } 
                        if (typeof speciallock2 == "boolean") {
                            speciallock2 = 1;
                        } else {
                            speciallock2++;
                        }
                        let card = p1.deck[element.getAttribute("data-card")];
                        card.hp *= 1.1;
                        card.hp = Math.round(card.hp);
                        if (Object.hasOwn(card,"atk")) {
                            card.atk *= 1.1;
                            card.atk = Math.round(card.atk);
                        }
                        if (Object.hasOwn(card,"heal")) {
                            card.heal *= 1.1;
                            card.heal = Math.round(card.heal);
                        }
                        if (Object.hasOwn(card,"stat")) {
                            card.stat += card.statincrease;
                        }
                        updateAdventureScreen();
                    }
                }
            }
            
            if (curspecial2 == "energizer" && p1.coins >= 150 && speciallock2 < 2) {
                p1.coins -= 150;
                if (typeof speciallock2 == "boolean") {
                    speciallock2 = 1;
                } else {
                    speciallock2++;
                }
                let card = p1.deck[element.getAttribute("data-card")];
                card.cool -= 2;
                card.coolleft -= 2;
                if (card.cool < 1) {
                    card.cool = 1;
                }
                if (card.coolleft < 0) {
                    card.coolleft = 0;
                }
                updateAdventureScreen();
            }
        });
    });
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

playbtn.addEventListener("click",function() {
    if (sob == 2) {
        if (playbtn.innerHTML == "RESTART") {
            curlocation = locations.home;
            Game.p1 = {
                managain: 5,
                maxdiscards: 1,
                maxhealth: 300,
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
                relics: {},
            };
            p1 = Game.p1;
            drawCard("p1",true,"spearman","addToDeck");
            drawCard("p1",true,"spearman","addToDeck");
        }
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
function sCondition(special) {
    let arr = [];
    if ((speciallock == false || typeof speciallock == "number") && curspecial1 == special) {
        arr = [true,1];
    } else if ((speciallock2 == false || typeof speciallock2 == "number") && curspecial2 == special) {
        arr = [true,2];
    } else {
        arr = [false,0];
    }
    return arr;
}
Array.from(document.getElementsByClassName("reroll")).forEach(function(element) {
    element.addEventListener('click', function() {
        if (rerolls < 5 && (sCondition("gaincard")[0] == true || sCondition("buycard")[0] == true || sCondition("buyrelic")[0] == true) && p1.coins >= 15) {
            p1.coins -= 15;
            rerolls++;
            Array.from(document.getElementsByClassName("specialcard")).forEach(function(element) {
                element.style.border = "2px solid black";
            });
            enterAdventureScreen();
        }
    });
});
Array.from(document.getElementsByClassName("specialcard")).forEach(function(element) {
    element.addEventListener('click', function() {
        if (sCondition("gaincard")[0] == true && element.hasAttribute("data-card")) {
            if (curlocation.name == "cosmeticshop" && speciallock2 == 2) {
                return false;
            }
            let num = sCondition("gaincard")[1];
            let card = element.getAttribute("data-card");
            drawCard("p1",true,card,"addToDeck");
            updateAdventureScreen();
            if (num == 1) {
                speciallock = true;
            } else {
                speciallock2 = true;
            }
            
            element.style.border = "7px solid black";
        }
        if (sCondition("buycard")[0] == true && element.hasAttribute("data-card") && element.hasAttribute("data-cost")) {
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
        if (sCondition("buyrelic")[0] == true && element.hasAttribute("data-relic") && element.hasAttribute("data-cost") && element.style.border == "2px solid black") {
            let relic = element.getAttribute("data-relic");
            if (p1.coins >= Number(element.getAttribute("data-cost"))) {
                p1.coins -= Number(element.getAttribute("data-cost"));
            } else {
                return false;
            }
            if (Object.hasOwn(p1.relics,relic)) {
                if (p1.relics[relic].attrtype == "arrup") {
                    for (let i = 0; i < p1.relics[relic].attr.length; i++) {
                        p1.relics[relic].attr[i] += relics[relic].attrincrease[i];
                    }
                }
                if (p1.relics[relic].attrtype == "int") {
                    p1.relics[relic].attr += relics[relic].attrincrease;
                    if (relic == "lifecapsule") {
                        p1.maxhealth += 20;
                        p1.health += 20;
                    }
                    if (relic == "trashcan") {
                        p1.maxdiscards += 0.5;
                        p1.discards += 0.5;
                    }
                }
                let list = ["thundercrate","frostyhorn","hammerhammer"]
                if (list.includes(relic)) {
                    p1.coins += Number(element.getAttribute("data-cost"));
                }
            }else {
                let key = {};
                assign(key,relics[relic]);
                p1.relics[relic] = key;
                if (relic == "lifecapsule") {
                    p1.maxhealth += 60;
                    p1.health += 60;
                }
                if (relic == "trashcan") {
                    p1.maxdiscards += 1;
                    p1.discards += 1;
                }
                if (relic == "soullantern") {
                    p1.startingmana += 1;
                }
            }
            
            updateAdventureScreen();
            element.style.border = "7px solid black";
        }
        if (sCondition("mystery")[0] == true && p1.coins >= 120 && speciallock < 3) {
            p1.coins -= 120;
            if (typeof speciallock == "boolean") {
                speciallock = 1;
            } else {
                speciallock++;
            }
            drawCard("p1",false,null,["addToDeck","doubleStats"]);
            updateAdventureScreen();
        }
        if (sCondition("beancandispenser")[0] == true && p1.coins >= 30) {
            p1.coins -= 30;
            p1.health += 50;
            p1.maxhealth += 50;
            updateAdventureScreen();
        }
        if (sCondition("rest")[0] == true) {
            if (p1.coins >= element.getAttribute("data-cost")) {
                p1.coins -= element.getAttribute("data-cost");
                p1.health += Number(element.getAttribute("data-heal"));
                if (p1.health > p1.maxhealth) {
                    p1.health = p1.maxhealth;
                }
                speciallock= true;
            }
            
            updateAdventureScreen();
        }
    });
});

travelbtn.addEventListener("click", function() {
    skipped = false;
    speciallock = false;
    speciallock2 = false;
    specialdiv.style.display = "none";
    specialdiv2.style.display = "none";
    Array.from(document.getElementsByClassName("specialcard")).forEach(function(element) {
        element.style.border = "2px solid black";
    });
    
    let sound = new Audio('sounds/pop.mp3');
    sound.volume = 0.2;
    sound.play();
    if (travelbtn.innerHTML == "Travel") {
        if (curlocation.name == "trafficlordvictory") {
            if (p1.coins < 600) {
                resetBattleUI();
                fullSD(adventurescreen,menuscreen,"none","block");
                sob = 2;
                //window.setTimeout(enterAdventureScreen,200);
                gametitle.innerHTML = "You Lose..";
                playbtn.innerHTML = "RESTART";
                openBtn.style.display = "none";
                return false;
            } else {
                p1.coins -= 600;
                fullSD(adventurescreen,menuscreen,"none","block");
                sob = 2;
                //window.setTimeout(enterAdventureScreen,200);
                gametitle.innerHTML = "Coda At Last!";
                playbtn.innerHTML = "CONTINUE";
                openBtn.style.display = "none";
                curlocation = locations[curlocation.nextloc];
                currenttext = "";
                textfinished = false;
                currenttextnum = 0;
                rerolls = 0;
                return false;
            }
        }
        curlocation = locations[curlocation.nextloc];
        adventurescreen.style.opacity = 0;
        window.setTimeout(enterAdventureScreen,200);
        currenttext = "";
        textfinished = false;
        currenttextnum = 0;
        rerolls = 0;
    }
    if (travelbtn.innerHTML == "Begin Fight") {
        startBattle(curlocation.proceedspecial.split("|")[1]);
        fullSD(adventurescreen,gamescreen,"none","block");
        currenttext = "";
        textfinished = false;
        currenttextnum = 0;
        rerolls = 0;
    }
    if (travelbtn.innerHTML == "Next") {
        if (curlocation.loretext.includes("||") && textfinished == false) {
            let texts = curlocation.loretext.split("||");
            let text = texts[currenttextnum];
            if (currenttextnum > 0) {
                text = "<br>"+text;
            }
            if (currenttextnum-texts.length >= -1) {
                textfinished = true;
                currenttextnum = 0;
            } else {
                currenttextnum += 1;
            }
            currenttext += text;
            enterAdventureScreen();
        }
        
    }
    
    
    
});
alttravelbtn.addEventListener("click", function() {
    Array.from(document.getElementsByClassName("specialcard")).forEach(function(element) {
        element.style.border = "2px solid black";
    });
    let sound = new Audio('sounds/pop.mp3');
    sound.volume = 0.2;
    sound.play();
    if (alttravelbtn.innerHTML == "Skip") {
        skipped = true;
        curlocation = locations[curlocation.nextloc];
        adventurescreen.style.opacity = 0;
        currenttext = "";
        textfinished = false;
        currenttextnum = 0;
        rerolls = 0;
        window.setTimeout(enterAdventureScreen,200);
    } else {
        let text = curlocation.loretext.replaceAll("||","<br>");
        textfinished = true;
        currenttextnum = 0;
        currenttext = text;
        enterAdventureScreen();
    }
    
});
