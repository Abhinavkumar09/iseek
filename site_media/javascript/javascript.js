function Material(name, properties) {
	this.name = name;
	this.price = properties.price;
	this.isClickable = properties.isClickable;
	this.ifBelongsToPlayer = properties.ifBelongsToPlayer;
	this.commission = properties.commission;
}

function loadjscssfile(filename, filetype){
	if (filetype=="js"){ //if filename is a external JavaScript file
		var fileref=document.createElement('script')
		fileref.setAttribute("type","text/javascript")
		fileref.setAttribute("src", filename)
	}
	else if (filetype=="css"){ //if filename is an external CSS file
		var fileref=document.createElement("link")
		fileref.setAttribute("rel", "stylesheet")
		fileref.setAttribute("type", "text/css")
		fileref.setAttribute("href", filename)
	}
	if (typeof fileref!="undefined")
		document.getElementsByTagName("head")[0].appendChild(fileref)
}


function Game(name) {
	this.name = name;

	this.mute = false;
	this.play = function(file) {
		if(!this.mute) {
			this.Q.audio.play(file);
		}
	};	

	/* All resources to be loaded
	*/
	this.resources = [
		"mira_1.png", 'tiles.png', 'tileSet.png', 'house_inside_new.png', 'house_tileset.png', 'cloud.png', 

		"sahiya.png", "Mira.png", "desk.png", "chairback.png",
		"chairseat.png", "blackboard.png", "pranav.png",
		"mira_house.png", "market.png", "school.png", "workshop.png", "cards.jpg",

		// Classroom
		'emptyclassroom.png', 'classroom/blackboard.png', 'classroom/chairback.png', 'classroom/chairseat.png', 'classroom/desk.png',


		// Objects
		'PathAndObjects.png', 
		'Objects/basket_01.png', 'Objects/basket_02.png', 'Objects/basket_03.png', 
		'Objects/plastic.png', 'Objects/cane.png', 'Objects/bamboo.png',  
		'Objects/item_bundle.png', 'rug.png', 'key.png',
		'Objects/Medal/badge01.png',


		//People
		'People/Mira.png', 'People/pranav.png', 'People/sahiya.png',

		//Buildings
		'Building/workshop.png', 'Building/mira_house.png', 'Building/newHut.png',  'Building/school.png', 'Building/market.png', 'Building/healthcenter.png',

		// Icons
		"Icons/Guru_icon.png", "Icons/icon_info.png", "Icons/mute.png", "Icons/unmute.png", 
		'VirtualWorld.png', 'nav_icons.png', "Icons/coin.png", 'Icons/score.png', 'Icons/close.png',
		'Icons/medal.png', "Icons/money.png", "Icons/health.png",

		// TMX
		'house.tmx', 'house_inside.tmx', 'market.tmx', 'workshop.tmx', 'seemaworkshop.tmx', 'VirtualWorld1.tmx', 'school.tmx', 'VirtualWorld.tmx', 'healthcenter.tmx',

		// Audio
//		"sell_buy_item.wav", "put_pick_item.wav", "Lazy_Day.wav", "Tavern.wav",

		// Video
//		"output1.mp4",
	];


	this.material_names = {
		basket_01: {sheet: "basket_01_sheet", frame: 0, price: 20},
		basket_02: {sheet: "basket_02_sheet", frame: 0, price: 20},
		basket_03: {sheet: "basket_03_sheet", frame: 0, price: 20},
		cane: {sheet: "cane", frame: 0, price: 10},
		bamboo: {sheet: "bamboo", frame: 0, price: 5},
		plastic: {sheet: "plastic", frame: 0, price: 5},
	};

	this.formula_list = {
		basket_01: {production_speed: 5, Sticks: 2},
	};

	this.stocks = {
		House: {
		},

		Workshop: {
			basket_01: [
				new Material('basket_01', {price: 0, isClickable: true, ifBelongsToPlayer: true, commission: 100}),
				new Material('basket_01', {price: 0, isClickable: true, ifBelongsToPlayer: true, commission: 100}),
			]
		},

		SeemaWorkshop: {
			basket_01: [
				new Material('basket_01', {price: 0, isClickable: false, ifBelongsToPlayer: true, commission: 10}),
				new Material('basket_01', {price: 0, isClickable: false, ifBelongsToPlayer: true, commission: 10}),
				new Material('basket_01', {price: 0, isClickable: false, ifBelongsToPlayer: true, commission: 10}),
				new Material('basket_01', {price: 0, isClickable: false, ifBelongsToPlayer: true, commission: 10}),
			],
			basket_02: [
				new Material('basket_02', {price: 0, isClickable: false, ifBelongsToPlayer: true, commission: 10}),
				new Material('basket_02', {price: 0, isClickable: false, ifBelongsToPlayer: true, commission: 10}),
				new Material('basket_02', {price: 0, isClickable: false, ifBelongsToPlayer: true, commission: 10}),
			]
		},

		Player: {
		},

		Market: {
		},
	};



	this.stock_count = function(stock_name, material_name) {
		var count = 0;
		for(var i = 0; i < game.stocks[stock_name].length; i++) {
			if(game.stocks[stock_name][i].name == material_name) {
				count++;
			}
		}
		return count;
	},

	this.give_material = function(stock_name, material) {
		console.log("give_material: " + stock_name + ", " + material.p.name);

		var stock = null;
		if(!material) {
			stock = this.stocks[stock_name].pop();
		}
		else {
			for(var i = 0; i < this.stocks[stock_name].length; i++) {
				if(this.stocks[stock_name][i].name == material.p.name) {
					stock = this.stocks[stock_name][i];
					console.log("picked material " + i + ", " + stock.name);
					this.stocks[stock_name].splice(i, 1);
					break;
				}
			}
		}
		console.log("sold for: " + stock.price + ", with commission:" + stock.commission);
		return stock.price * stock.commission / 100;
	};

	this.accept_material = function(stock_name, material) {
		console.log("take_material: " + stock_name + ", " + material.p.name);
		this.stocks[stock_name].push({name: material.p.name, price: material.p.price, commission: material.p.commission, ifClickable: true});
	};


	this.player = {
		money: 100,
		health: 100,
		keys: [],
		change_money: function(price) {
			this.money += price;
			game.Q.state.trigger("change.money", this.money);
		},
	};
}



var game = new Game("Test Game");





var Q = Quintus({
			development: true,
			audioPath: "/site_media/assets/new_game/audio/",
			imagePath: "/site_media/assets/new_game/figs/",
			videoPath: "/site_media/assets/new_game/video/",
			dataPath: "/site_media/assets/new_game/data/",
			resources: game.resources,
			audioSupported: [ 'wav','mp3' ],
		})
		.include("Sprites, Scenes, 2D, UI, Anim, Input, Touch, Audio, TMX")
		.setup("game_canvas", {
			maximize: "touch",
//			maximize: true,
			width:   800,
			height:  600,
		})
		.enableSound()
		.controls(true);


Q.input.touchControls({
  controls:  [ ['left','<' ],
               ['up','a'],
               ['down','b'],
               ['right','>' ]]
});



Q.SPRITE_NONE = 0;
Q.SPRITE_PLAYER = 1;
Q.SPRITE_BUILDING = 2;
Q.SPRITE_DOOR = 4;
Q.SPRITE_MATERIAL = 8;
Q.SPRITE_PICKED_MATERIAL= 16;
Q.SPRITE_MATERIAL_CONTAINER = 32;
Q.SPRITE_PURE_UI = 64;
Q.SPRITE_COLLIDABLE = Q.SPRITE_PLAYER | Q.SPRITE_BUILDING | Q.SPRITE_DOOR | Q.SPRITE_MATERIAL | Q.SPRITE_MATERIAL_CONTAINER;

Q.STAGE_LEVEL_PRIMARY = 0;
Q.STAGE_LEVEL_LEARNING_MODULE = 1;
Q.STAGE_LEVEL_SCORECARD = 2;
Q.STAGE_LEVEL_AAKASHVANI = 3;
Q.STAGE_LEVEL_NAVIGATION = 4;
Q.STAGE_LEVEL_SCOREBOARD = 5;
Q.STAGE_LEVEL_DIALOG = 6;
Q.STAGE_LEVEL_TRANSITION = 8;


Q.SPRITE_UI = Q.SPRITE_PURE_UI | Q.SPRITE_MATERIAL | Q.SPRITE_PICKED_MATERIAL;


Q.touch(Q.SPRITE_UI, [Q.STAGE_LEVEL_LEARNING_MODULE, Q.STAGE_LEVEL_SCORECARD, Q.STAGE_LEVEL_NAVIGATION, Q.STAGE_LEVEL_SCOREBOARD, Q.STAGE_LEVEL_DIALOG]);



Q.game = game;
game.Q = Q;



/**
 * Storage Function
 * Store the Value
 * @param dataSet the name of the entry
 * @param dataValue the value of the entry
 * @return the result of operation
 */
function storeValue(dataSet, dataValue){
	if(typeof(Storage) !== "undefined") {
	    localStorage.setItem(dataSet,dataValue);
	    if(String(fetchValue(dataSet))===String(dataValue)){
	    	return true;
	    }
	} else {
	    console.log("Browser doesn't support local storage.")
	}
	return false;
}

/**
 * Storage Function
 * Fetch the Value
 * @param dataSet the name of the entry
 * @return the value of given name in local storage
 */
function fetchValue(dataSet){
	if(typeof(Storage) !== "undefined") {
		console.log(localStorage.getItem(dataSet));
	    return localStorage.getItem(dataSet);
	} else {
	    console.log("Browser doesn't support local storage.");
	}
	return false;
}

/**
 * Storage Function
 * Remove the Value
 * @param dataSet the name of the entry
 * @return the result of operation
 */
function removeValue(dataSet){
	if(typeof(Storage) !== "undefined") {
	    localStorage.removeItem(dataSet);
	    if(fetchValue(dataSet)===null){
	    	return true;
	    }
	} else {
	    console.log("Browser doesn't support local storage.");
	}
	return false;
}

function timeoutLoop(fn, reps, delay) {
  if (reps > 0)
    setTimeout(function() {
                 fn;
                 timeoutLoop(fn, reps-1, delay);
               }, delay);
}

