// Wolf of the wall street
// American Hustle

function Video(content) {
	this.filename = content;
	this.status = -1;

	this.nextElement = function() {
		return this.next;
	};
}


function Question(content) {
	this.question = content[0];
	this.choices = content[1];
	this.answer_index = -1;
	this.status = -1;

	this.show = function() {
		myhtml = this.question;
		for(i = 0; i < this.choices.length; i++) {
			myhtml += "<br />" + this.choices[i];
		}
		return myhtml
	};

	this.nextElement = function() {
		if(this.next == null)
			return null;
		// TODO: Check that answer_index is not -1
		return this.next[this.answer_index];
	};
}

function VirtualWorldMOL(content) {
	this.content = content;

	this.activate = function(myQ) {
		console.log("activating MOL");

		for(i = 0; i < this.content.length; i++) {
			j = 0;
			while(Q(this.content[i][1]).at(j)) {
				if(Q(this.content[i][1]).at(j).p.name == this.content[i][2]) {
					Q(this.content[i][1]).at(j).setInteractable(true);
					break;
				}
				j++;
			}
		}
	};
}

// element_id: Unique string representing the stage level that will be activated when the element is activated
function CertificateElement(element_id, name, isFinished, element, interactability) {
	this.element_id = element_id;
	this.name = name;
	this.isFinished = isFinished;
	this.element = element;
	this.interactability = interactability;

	this.activateElement = function(myQ) {
		console.log("activating element MOL");
		this.MOL.activate(myQ);
	};
}

function CertificateBadge(name, image, isFinished, elements) {
	this.name = name;
	this.image = image;
	this.isFinished = isFinished;
	this.elements = elements;

	this.activateElement = function(myQ) {
		console.log("activating element MOL");
		this.elements[0].activate(myQ);
	};
}

function Certificate(name, isFinished, badges) {
	this.name = name;
	this.isFinished = isFinished;
	this.badges = badges;

	this.activateElement = function(myQ) {
		console.log("activating certificate element");
		this.badges[0].activateElement(myQ);

	};
}

function Material(name, properties) {
	this.name = name;
	this.price = properties.price;
	this.isClickable = properties.isClickable;
	this.ifBelongsToPlayer = properties.ifBelongsToPlayer;
	this.commission = properties.commission;
}

function Game(name) {
	this.name = name;

	this.mute = false;
	this.play = function(file) {
		if(!this.mute) {
			this.Q.audio.play(file);
		}
	};	

	this.production_speed = 10000;


	this.activateElement = function() {
		console.log("activating game certificate");
		//this.certificates[0].activateElement(game.Q);
	};

	this.resources = [
		"mira_1.png", 'tiles.png', 'tileSet.png', 'house_inside_new.png', 'house_tileset.png', 'cloud.png', 

		"sahiya.png", "Mira.png", "desk.png", "chairback.png",
		"chairseat.png", "blackboard.png", "pranav.png",
		"mira_house.png", "market.png", "school.png", "workshop.png",

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
		'sell_buy_item.wav', 'put_pick_item.wav', 'Lazy_Day.wav', 'Tavern.wav',
	];


//	this.speed = content.speed;

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
//			basket_01: [
//				new Material('basket_01', {price: 0, isClickable: true, ifBelongsToPlayer: true, commission: 100}),
//			],
//			basket_02: [
//				new Material('basket_02', {price: 0, isClickable: true, ifBelongsToPlayer: true, commission: 10}),
//			],
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
//		keys: ["mind", "health", "blah"],
		keys: [],
		change_money: function(price) {
			this.money += price;
			game.Q.state.trigger("change.money", this.money);
		},
	};

	this.start_production = function() {
		game = this;
		var product = "Basket";
		var interval = setInterval(function(){game.produce(product);}, game.formula_list[product].production_speed * 1000);
		return interval;
	};

	this.produce = function(product) {
		console.log("producing");
		// Assumed product is Basket
		var product = "Basket";
		var hasRawMaterial = true;
		for(rawmaterial in this.formula_list[product]) {
			var count = 0;
			for(var i = 0; i < this.stocks["Workshop"].length; i++)
				if(this.stocks["Workshop"][i].name == rawmaterial)
					count++;

			if(count < this.formula_list[product][rawmaterial])
				hasRawMaterial = false;
		}

		if(hasRawMaterial) {
			console.log("produced");
			this.stocks["Workshop"].push({name: product, price:0, commission:0, ifClickable:true});

			for(rawmaterial in this.formula_list[product]) {
				var count = 0;
				var i = 0;
				while(count != this.formula_list[product][rawmaterial]) {
					if(this.stocks["Workshop"][i].name == rawmaterial) {
						count++;
						this.stocks["Workshop"].splice(i, 1);
					}
					else
						i++;

					if(count == this.formula_list[product][rawmaterial])
						break;
				}
			}
		}
	};

	this.refresh_debug = function() {
		board = document.getElementById('debug_board');
		board.innerHTML = '';

		for(stock_name in this.stocks) {
			board.innerHTML += "<strong>" + stock_name + "</strong><br />";
			for (material_name in this.stocks[stock_name]) {
				board.innerHTML += material_name + ": " + this.stocks[stock_name][material_name].length + "<br />";				
			}
		}
	};


//	this.production_interval = this.start_production();

}






//Should be stored in a persistent storage



var game = new Game("Test Game");







// Elements
	v1 = new Video("output1");
	q1 = new Question([
		"Why do you think the vendor was not able to make a sale?", 
		[
			"The seller didn't understand customer needs", 
			"The seller brought too many baskets to the market", 
		]
	]);
	v2 = new Video("output1");
	q2 = new Question([
		"Did the seller perform better this time?", 
		[
			"Yes, he sold two of baskets",
			"No, he was left with three unsold baskets", 
		]
	]);
	v1.next = q1;
	q1.next = [v2,v2];
	v2.next = q2;


//	var body_activities = ["eat nutritional food", "take supplements", "keep up hygiene", "rest", "do physical activity", "maintain proper urination sanitation"];
	var body_activities = ["eat nutritional food", "take supplements"];
	var a = new Array(body_activities.length);
	
	for(i = 0; i<body_activities.length; i++){
		a[i] = new Question([
			"Did you " + body_activities[i] + "?", 
			[
				"Yes", 
				"No", 
			]
		]);
	}

	for(i = 0; i < a.length-1; i++)
		a[i].next = [a[i+1], a[i+1]];


	var b = new Array(1);
	b[0] = new Question([
		"To get this piece, tell me, what time of the day are you most happy?",
		[
			"Morning",
			"Evening",
			"Night",
		]
	]);

	for(i = 0; i < b.length-1; i++)
		b[i].next = [b[i+1], b[i+1], b[i+1]];




	var c = new Array(2);
	c[0] = new Question([
		"Who is supportive in your life?",
		[
			"Father",
			"Mother",
			"Brother",
			"Sister"
		]
	]);
	c[1] = new Question([
		"Who makes your life harder?",
		[
			"Father",
			"Mother",
			"Brother",
			"Sister"
		]
	]);

	for(i = 0; i < c.length-1; i++)
		c[i].next = [c[i+1], c[i+1], c[i+1], c[i+1]];


	var health_test = new Array(3);
	health_test[0] = new Question([
		"Oh, hello! How are you? I’m still fit (frown face, lonely) and better than everyone else! I wish I had more friends though and that I was more motivated to finish my work for my business. Can you help me?",
		[
			"Mind",
			"Body",
			"Relationship",
		]
	]);
	health_test[1] = new Question([
		"Hello! How are you! I’m doing well, still feeling motivated and pretty good. I just wish I didn’t get sick all the time and had more friends. Can you help me?",
		[
			"Mind",
			"Body",
			"Relationship",
		]
	]);
	health_test[2] = new Question([
		"Hello! How are you! I’m doing well, still have lots of friends and family to spend time with. I just wish I didn’t get sick all the time and felt more motivated and energized to do work. Can you help me?",
		[
			"Mind",
			"Body",
			"Relationship",
		]
	]);

	for(i = 0; i < health_test.length - 1; i++)
		health_test[i].next = [health_test[i+1], health_test[i+1], health_test[i+1]];


	game.certificates = [
		new Certificate(
			"Level One", 
			false,
			[
				new CertificateBadge(
					"Market Research", 
					"Objects/Medal/badge01.png",
					false, 
					[
						new CertificateElement(
							"market_research_1",
							"Lecture",
							false,
								q2,
							{House: true, Market: false, Workshop: false, School:true, SeemaWorkshop: false, HealthCenter: false}
						),
						new CertificateElement(
							"market_research_2",
							"007",
							false,
								null,
							{House: true, Market: true, Workshop: true, School:false, SeemaWorkshop: true, HealthCenter: false}
						),
					]
				),
				new CertificateBadge(
					"Mind, Body, and ...", 
					"Objects/Medal/badge01.png",
					false, 
					[
						new CertificateElement(
							"health_1",
							"Health",
							false,
								{'Ram': a[0], 'Alam': b[0], 'Arvind': c[0]},
							{House: false, Market: false, Workshop: false, School: false, SeemaWorkshop: false, HealthCenter: false}
						),
						new CertificateElement(
							"health_2",
							"Test",
							false,
								health_test[0],
							{House: false, Market: false, Workshop: false, School: false, SeemaWorkshop: false, HealthCenter: true}
						),
					]

				),
			]
		),
	];















var Q = Quintus({
			development: true,
			audioPath: "/site_media/assets/new_game/audio/",
			imagePath: "/site_media/assets/new_game/figs/",
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


Q.Sprite.extend("Aakashvani",{ 
	init: function(p) {
		this._super(p, {
			name: "Aakashvani",
			time_spent: 0,
			orig_width: 3,
			orig_height: 2,
			x: 0,
			y: 0,
			type: Q.SPRITE_NONE,
			collisionMask: Q.SPRITE_NONE,
			animation_time:5,
		});
		console.log("w: " + this.p.w + ", h: " + this.p.h);

		this.p.orig_width = this.p.w;
		this.p.orig_height = this.p.h;
	},

	newdraw: function(context) {
		var scale_x = this.p.width / this.p.orig_width;
		var scale_y = this.p.height / this.p.orig_height;

		context.globalCompositeOperation = "source-over";
		context.shadowBlur = 20;
		context.shadowColor = "white";
		context.lineWidth = 0;
		context.beginPath();
		context.moveTo(-0.9 * scale_x, -0.2 * scale_y);
		context.bezierCurveTo(-1.4 * scale_x, 0 * scale_y, -1.4 * scale_x, 0.50 * scale_y, -0.40 * scale_x, 0.50 * scale_y);
		context.bezierCurveTo(0 * scale_x, 0.80 * scale_y, 0 * scale_x, 1.30 * scale_y, 0.70 * scale_x, 0.50 * scale_y);
		context.bezierCurveTo(1.5 * scale_x, 0.50 * scale_y, 1.5 * scale_x, 0.2 * scale_y, 1.20 * scale_x, 0 * scale_y);
		context.bezierCurveTo(1.6 * scale_x, -0.60 * scale_y, 1.0 * scale_x, -0.70 * scale_y, 0.70 * scale_x, -0.50 * scale_y);
		context.bezierCurveTo(0.5 * scale_x, -0.95 * scale_y, -0.2 * scale_x, -0.8 * scale_y, -0.2 * scale_x, -0.50 * scale_y);
		context.bezierCurveTo(-0.7 * scale_x, -0.95 * scale_y, -1.2 * scale_x, -0.8 * scale_y, -0.90 * scale_x, -0.20 * scale_y);
		context.closePath();
		context.fillStyle = '#B6C6E3';
		context.fill();
		context.stroke();

		context.fillStyle = 'white';

		context.beginPath();
		context.arc(0, 0, 20, 0, 2 *Math.PI);
		context.fill();

		context.beginPath();
		context.arc(30, 30, 20, 0, 2 *Math.PI);
		context.fill();

		context.beginPath();
		context.arc(0, 30, 20, 0, 2 *Math.PI);
		context.fill();
//		context.lineWidth = 0;
//		context.strokeStyle = 'grey';
//		context.stroke();
	},

	step: function(dt) {
		if(this.p.animation_over)
			return;
		this.p.time_spent += dt
		if(this.p.time_spent >= this.p.animation_time) {
			this.p.animation_over = true;
			this.p.time_spent = this.p.animation_time;

			var Mira = new Q.Person({sheet: "mira_sheet", sprite: 'person_animation', frame:1, x: this.p.x + 120, y: this.p.y - 15, name:"Dreaming Mira"});
//			this.stage.add("viewport").follow(Mira);
			this.stage.insert(Mira);

			var guru = new Q.Guru({asset: 'Guru_icon.png', x: this.p.x - 70, y: this.p.y - 15, name: "Guru"});
			this.stage.insert(guru);
		}

		this.p.width = this.p.final_width * this.p.time_spent / this.p.animation_time;
		this.p.height = this.p.final_height * this.p.time_spent / this.p.animation_time;

		this.p.scale = this.p.width / this.p.orig_width;

		this.p.x = (this.p.width) / 2;
		this.p.y = (this.p.height) / 2;
	}

});


/**
 * Storage Function
 * Store the Value
 * @param dataSet the name of the entry
 * @param dataValue the value of the entry
 * @return the result of operation
 */
function storeValue(dataSet, dataValue){
	if(typeof(Storage) !== "undefined") {
	    return localStorage.setItem(dataSet,dataValue);
	} else {
	    console.log("Browser doesn't support local storage.")
	    return null;
	}
}

/**
 * Storage Function
 * Fetch the Value
 * @param dataSet the name of the entry
 * @return the value of given name in local storage
 */
function fetchValue(dataSet){
	if(typeof(Storage) !== "undefined") {
	    return localStorage.getItem(dataSet);
	} else {
	    console.log("Browser doesn't support local storage.")
	    return null;
	}
}

/**
 * Storage Function
 * Remove the Value
 * @param dataSet the name of the entry
 * @return the result of operation
 */
function removeValue(dataSet){
	if(typeof(Storage) !== "undefined") {
	    return localStorage.removeItem(dataSet);
	} else {
	    console.log("Browser doesn't support local storage.")
	    return null;
	}
}




