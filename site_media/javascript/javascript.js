function Material(properties) {
	this.name = properties.name;
	this.price = properties.price;
	this.isClickable = properties.isClickable;
	this.ifBelongsToPlayer = properties.ifBelongsToPlayer;
	this.commission = properties.commission;
	this.sheet = properties.sheet;
	if(!properties.sheet) {
		this.sheet = name + "_sheet";
	}
	this.frame = properties.frame;
	if(!properties.frame) {
		this.frame = 0;
	}
}

function SHG(properties) {
	this.name = properties.name;
	this.people = properties.people;
	this.address = properties.address;
}

function Person(properties) {
	this.id = properties.id;
	this.name = properties.name;
	this.sheet = properties.sheet;
	this.frame = properties.frame;
	this.address = properties.address;
	this.phone = properties.phone;

	this.money = 100;
	this.health = 100;
}

function Product(properties) {
	this.id = properties.id;
	this.name = properties.name;
	this.qtyavailable = properties.qtyavailable;
	this.price = properties.price;
	this.sellable = properties.sellable;
	this.buyable = properties.buyable;
	this.bom_id = properties.bom_id;
	this.qty = properties.qty;
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


	/* All resources to be loaded
	*/
	this.resources = [
		'tiles.png', 'tileSet.png', 'house_inside_new.png', 'house_tileset.png',

		// Classroom
		'emptyclassroom.png', 'classroom/blackboard.png', 'classroom/chairback.png', 'classroom/chairseat.png', 'classroom/desk.png',
		"desk.png", "chairback.png", "chairseat.png", "blackboard.png", 


		// Objects
		'PathAndObjects.png', 
		'Objects/basket_01.png', 'Objects/basket_02.png', 'Objects/basket_03.png', 
		'Objects/plastic.png', 'Objects/cane.png', 'Objects/bamboo.png',  
		'Objects/item_bundle.png', 'rug.png', 'key.png',
		'Objects/Medal/badge01.png',


		
		//People emotions
		'People/meera_angry3.png', 'People/meera_dizzyspinning3.png', 'People/meera_sick1.png', 'People/meera_cry6.png',

		//Activities
		'CardObjects/fruitbasket.png', 'CardObjects/handwashanimation_sideleft.png', 'CardObjects/praycard.png', 
		'CardObjects/singsongcard.png', 'CardObjects/sleepposter.png', 'CardObjects/vitamincard.png',
		'CardObjects/cutnailscard.png', 'CardObjects/mosquitospraycard.png', 'CardObjects/padscard.png',
		'CardObjects/healthkit.png',


		// Icons
		"Icons/Guru_icon.png", "Icons/icon_info.png", "Icons/mute.png", "Icons/unmute.png", 
		'VirtualWorld.png', "Icons/coin.png", 'Icons/score.png', 'Icons/close.png',
		'Icons/medal.png', "Icons/money.png", "Icons/health.png",


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
				new Material({name: 'basket_01', price: 0, isClickable: true, ifBelongsToPlayer: true, commission: 100}),
				new Material({name: 'basket_01', price: 0, isClickable: true, ifBelongsToPlayer: true, commission: 100}),
			]
		},

		SeemaWorkshop: {
			basket_01: [
				new Material({name: 'basket_01', price: 20, isClickable: false, ifBelongsToPlayer: true, commission: 10}),
				new Material({name: 'basket_01', price: 20, isClickable: false, ifBelongsToPlayer: true, commission: 10}),
				new Material({name: 'basket_01', price: 20, isClickable: false, ifBelongsToPlayer: true, commission: 10}),
				new Material({name: 'basket_01', price: 20, isClickable: false, ifBelongsToPlayer: true, commission: 10}),
			],
			basket_02: [
				new Material({name: 'basket_02', price: 20, isClickable: false, ifBelongsToPlayer: true, commission: 10}),
				new Material({name: 'basket_02', price: 20, isClickable: false, ifBelongsToPlayer: true, commission: 10}),
				new Material({name: 'basket_02', price: 20, isClickable: false, ifBelongsToPlayer: true, commission: 10}),
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


	this.player = new Person({
		id: -1,
		name: "Mira",
		sheet: "player_sheet",
		frame: 1,
		address: "Address",
		phone: "Phone",
		money: 100,
		health: 100,
	});
	this.player.keys = [];
	this.player.change_money = function(price) {
		this.money += price;
		game.Q.state.trigger("change.money", this.money);
	};
	
 /* New Code */
	this.product = {
		id: -1,
		name: "test",
		qtyavailable: 0, 
		price: 100,
	};
	
	
	this.productInventory = {};
	this.productLength = 0;
	this.nameProduct;
	this.priceProduct;
	this.qtyProduct;
/* New Code */


	var properties = {};
	properties["name"] = "SHG";
	properties["members"] = [
		new Person({"id": -1, "name": "Sheela", "sheet": "person_4_sheet", "frame": 1, "address": "Address", "phone": "phone"}),
		new Person({"id": -1, "name": "Rama", "sheet": "person_5_sheet", "frame": 1, "address": "Address", "phone": "phone"}),
		new Person({"id": -1, "name": "Swati", "sheet": "person_6_sheet", "frame": 1, "address": "Address", "phone": "phone"}),
	];
	properties.address = "SHG Address";
	this.SHG = new SHG(properties);

	this.sync_data = {};


	this.PEOPLE = {};
	this.PEOPLE.RESOURCES = {
		// Males
		"person_1": "People/Shyam.png",
		"person_2": "People/Ashwin.png",
		"person_3": "People/Asif.png",

		// Females
		"person_4": "People/Rama.png",
		"person_5": "People/Seeta.png",
		"person_6": "People/Seema.png",

		// Special folks
		"nurse": "People/Sahiya.png",
		"player": "People/Mira.png",
		"enterpreneur": "People/Enterpreneur.png",
	};

	for( people in this.PEOPLE.RESOURCES) {
		this.resources.push(this.PEOPLE.RESOURCES[people]);
	}

	this.AUDIO = {};
	this.AUDIO.RESOURCES = {
		"VILLAGE": "Tavern.wav", 
		"BOARD": "Lazy_Day.wav",
		"MONEY": "sell_buy_item.wav", 
		"MOVE_ITEM": "put_pick_item.wav", 
	};

	for( audio in this.AUDIO.RESOURCES) {
		this.resources.push(this.AUDIO.RESOURCES[audio]);
	}

	var G = this;
	this.AUDIO.stop_n_play = function(type) {
		console.log("play");
		G.Q.audio.stop();
		G.Q.audio.play(type, {loop: true});
	};

	this.AUDIO.ifMute = 0;
	this.AUDIO.play = function(file) {
		G.Q.audio.play(file);
	};	

	this.AUDIO.stop = function(type) {
		G.Q.audio.stop();
	};

	this.AUDIO.mute = function() {
		this.ifMute = 1 - this.ifMute;
		G.Q.audio.mute();
		return this.ifMute;
	};

	this.TMX = {};
	this.TMX.VirtualWorld = "VirtualWorld.tmx";
	this.TMX.House = "house.tmx";
	//, 'house_inside.tmx', 
	this.TMX.Market = 'market.tmx';
	this.TMX.Workshop = 'workshop.tmx';
	this.TMX.OtherWorkshop = 'seemaworkshop.tmx';
	//, 'VirtualWorld1.tmx', 
	this.TMX.School = 'school.tmx';
	this.TMX.HealthCenter = 'healthcenter.tmx';

	for( tmx in this.TMX) {
		this.resources.push(this.TMX[tmx]);
	}

	this.BUILDING = {};
	this.BUILDING.RESOURCES = {
		'Workshop': 'Building/workshop.png', 
		'House': 'Building/mira_house.png', 
		//'Building/newHut.png',  
		'School': 'Building/school.png', 
		'Market': 'Building/market.png', 
		'HealthCenter': 'Building/healthcenter.png',
		//"mira_house.png", "market.png", "school.png", "workshop.png",
	};

	for( building in this.BUILDING.RESOURCES) {
		this.resources.push(this.BUILDING.RESOURCES[building]);
	}

	this.FONTS = {};
	this.FONTS['REGULAR'] = "helvetica";
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
		.include("Sprites, Scenes, 2D, UI, UI_extension, Anim, Input, Touch, Audio, TMX")
		.setup("game_canvas", {
			maximize: "touch",
//			maximize: true,
			width:   800,
			height:  450,
		})
		.enableSound()
		.controls(true, [[],[],[],[],[]]);



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

Q.BACKGROUND_Z = 1;
Q.PLAYER_Z = 2;
Q.CARD_Z = 5;
Q.FORGROUND_Z = 10;


Q.SPRITE_UI = Q.SPRITE_PURE_UI | Q.SPRITE_MATERIAL | Q.SPRITE_PICKED_MATERIAL;


Q.touch(Q.SPRITE_UI, [Q.STAGE_LEVEL_DIALOG, Q.STAGE_LEVEL_SCORECARD, Q.STAGE_LEVEL_NAVIGATION, Q.STAGE_LEVEL_SCOREBOARD, Q.STAGE_LEVEL_LEARNING_MODULE, Q.STAGE_LEVEL_PRIMARY]);



Q.game = game;
game.Q = Q;

