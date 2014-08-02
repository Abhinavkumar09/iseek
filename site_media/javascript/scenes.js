Q.scene("health_1",function(stage) {
	stage.name = "health_1";
	Q.stageTMX("VirtualWorld.tmx", stage);

	Q.audio.stop();
	Q.audio.play("Tavern.wav", {loop: true});

	var Mira = Q("Player").first();
	Mira.add("KeyCarrier");
	stage.add("viewport").follow(Mira);
	//Mira.addMaterialContainer("Player");

	Mira.addKeyContainer();


	var i = 0;
	while(Q("Building", Q.STAGE_LEVEL_PRIMARY).at(i) != null) {
		b = Q("Building").at(i);
		console.log(b.p.name + ": " +stage.options.element.interactability[b.p.name]);
		b.setInteractable(stage.options.element.interactability[b.p.name]);
		b.p.nextScene = stage.name + "_" + b.p.name;
		
		if(b.p.name == "HealthCenter" && !(b.p.isInteractable)){
			b.collide = function(col) {
				Sahiya.info({duration:-1, showOnMiniMap: true});
			}
			b.on("hit", b, "collide");
		}
		i += 1;
	}

	var Sahiya = new Q.Person({asset: "People/sahiya.png", x:400, y:800, isInteractable:true, name:"Sahiya"});
	stage.insert(Sahiya);
	Sahiya.p.labels = [
			"Hi Mira! The health center is closed as we have", 
			"lost all the keys. People have taken the keys", 
			"for their well-being and have not returned them.", 
			"To unlock the door, you have to get keys from", 
			"the three healthiest persons in the community:", 
			"Ram, Alam and Arvind"
		];

	Sahiya.collision = function(col) {
		if(Q.game.player.keys.length >= 3){ // assumed relationship key attained at the end
			this.p.labels = [
				"So now you know what is important",
				"for good health - a sound mind,",
				"a healthy body and amiable relationship", 
				"with those around you!",
				"Now, you can enter the healthcenter"
			];
		}
		else if(Q.game.player.keys.length >= 2) { // assumed body key is attained second
			this.p.labels = [
				"Mira, now you have the 'mind' and 'body' keys",
				"but again, that is not enough. A sound mind",
				"and a health body only flourish when you have",
				"good relations with your friends and family.", 
				"Go to Arvind and get the relationship key"
			]
		}
		else if(Q.game.player.keys.length >= 1) { // assumed mind key is attained first
			this.p.labels = [
				"Mira, now you have the 'mind' key but ",
				"that is not enough for all round good health.",
				"A sound mind is boosted by a healthy body,",
				"so now go to Alam and get the body key"
			]
		}
		Sahiya.quote(Sahiya.p.labels);
	};
	Sahiya.on("hit", Sahiya, "collision");

	var Ram = new Q.Person({asset: "People/pranav.png", x:800, y:600, isInteractable:true, name:"Ram"});
	stage.insert(Ram);
	Ram.off("hit", Ram, "collision");
	Ram.p.labels = [
			"नमस्ते Mira. In order to get the body key, you need to ",
			"complete certain activities.",
			" ",
			"Go home and complete as many of the body",
			"activities as you can"
			];

	Ram.collision = function(col) {
		if(Q.game.player.keys.length >= 1) {
			Ram.p.labels = [
				"Hi Mira. Congrats! You have the 'mind' key.",
				"Now, go to Alam to get the second key.",
			];
		}
		Ram.quote(Ram.p.labels);
		var i = 0;
		while(Q("Building", Q.STAGE_LEVEL_PRIMARY).at(i) != null) {
			b = Q("Building").at(i);
			if(b.p.name == "House") {
				console.log("setInteractable");
				b.setInteractable(true);
			}
			i += 1;
		}
	};
	Ram.on("hit", Ram, "collision");


	var Alam = new Q.Person({asset: "People/pranav.png", x:800, y:700, isInteractable:true, name:"Alam"});
	stage.insert(Alam);
	Alam.off("hit", Alam, "collision");
	Alam.p.labels = [
			"Hi Mira. In order to get the body key, you need to ",
			"complete certain activities.",
			" ",
			"Go home and complete as many of the body",
			"activities as you can"
			];

	Alam.onquestioncompletion = function () {
		console.log("added body key");
		Q.game.player.keys.push("body");
		Mira.resetKeyContainer();
	};

	Alam.collision = function(col) {
		if(Q.game.player.keys.length >= 2) {
			Alam.p.labels = [
				"Hi Mira. Congrats! You have the 'body' key.",
				"Now, go to Arvind to get the third key.",
			];
			Alam.quote(Alam.p.labels);
		} else {
			Q.stageScene("Dialog", Q.STAGE_LEVEL_DIALOG, {questions: stage.options.element.element["Alam"], nextStage: Q.STAGE_LEVEL_PRIMARY, context: Alam, func: "onquestioncompletion"});
		}
	};
	Alam.on("hit", Alam, "collision");


	var Arvind = new Q.Person({asset: "People/pranav.png", x:800, y:800, isInteractable:true, name:"Arvind"});
	stage.insert(Arvind);
	Arvind.off("hit", Arvind, "collision");
	Arvind.p.labels = [
			"I have such healthy relationships. I have close family, ",
			"friends, animals, and neighbors, that I can work with and",
			"spend time with. Even when I have conflict with these",
			"people, we work through them. What I did to start was ",
			"think about who is supportive in my life and who makes my ",
			"life harder. Sometimes one person can be supportive ",
			"and make your life harder. Once you can tell me, I will",
			"give you something who is supportive in your life?",
			];

	Arvind.onquestioncompletion = function () {
		console.log("added relationship key");
		Q.game.player.keys.push("relationship");
		Mira.resetKeyContainer();
		var i = 0;
		while(Q("Building", Q.STAGE_LEVEL_PRIMARY).at(i) != null) {
			b = Q("Building").at(i);
			if(b.p.name == "HealthCenter"){
				b.setInteractable(true);
				Sahiya.info({duration:-1});
			}
			i += 1;
		}
	};

	Arvind.collision = function(col) {
		if(Q.game.player.keys.length >= 3) {
			Arvind.p.labels = [
				"Hi Mira. Congrats! You have the 'relationship' key.",
				"Now you can enter the health center.",
			];
			Arvind.quote(Arvind.p.labels);
		} else {
			Q.stageScene("Dialog", Q.STAGE_LEVEL_DIALOG, {questions: stage.options.element.element["Arvind"], nextStage: Q.STAGE_LEVEL_PRIMARY, context: Arvind, func: "onquestioncompletion"});
		}
	};
	Arvind.on("hit", Arvind, "collision");


	stage.accept_material = function(material_name) {
		console.log("cannot accept the material");
		return false;
	};

//	var guru = Q("GuruIcon", Q.STAGE_LEVEL_SCORECARD).first();
//	guru.trigger("newconcept", "Start");
});


Q.scene("health_1_House", function(stage) {
	stage.stock_name = "House";
	stage.acceptable_materials = [];

	stage.insert(new Q.Repeater({ sheet: "tiles", frame:229, speedX: 1, speedY: 1 }));
	Q.stageTMX("house.tmx", stage);


	// Map Exit Door
	var exit_door = new Q.Door({width:96, height: 8, h: 16, w: 96, x: 400, y: 590});
	stage.insert(exit_door);



	// Mira
	var Mira = Q("Player").first();
	Mira.add("KeyCarrier");
	Mira.addKeyContainer();
	stage.player = Mira;

	Mira.onquestioncompletion = function () {
		console.log("added mind key");
		Q.game.player.keys.push("mind");
		Mira.resetKeyContainer();
	};


	var form = new Q.Form(
		{
			content: [
				new Q.MultipleChoiceQuestion({
					question: new Q.ImageText({
						label: new Q.UI.Text({label: "Did you?", type: Q.SPRITE_NONE, }),
						fill: null,
					}), 
					choices: [
						new Q.ImageText({
							label: new Q.UI.Text({label: "Yes", type: Q.SPRITE_NONE}),
							isSelectable: true,
							fill: null,
						}), 
						new Q.ImageText({
							label: new Q.UI.Text({label: "No", type: Q.SPRITE_NONE}),
							isSelectable: true,
							fill: null,
						}), 
					],
				}),
			],

			context: Mira,
			func: "onquestioncompletion",
		}
	);


	if(Q.game.player.keys.length == 0) {
		stage.insert(form);
	}
});


Q.scene("health_1_HealthCenter", function(stage) {
	console.log("HealthCenter");
	stage.stock_name = "HealthCenter";
	stage.acceptable_materials = [];

	stage.insert(new Q.Repeater({ sheet: "tiles", frame:229, speedX: 1, speedY: 1 }));
	Q.stageTMX("healthcenter.tmx", stage);


	// Map Exit Door
	var exit_door = new Q.Door({width:96, height: 8, h: 16, w: 96, x: 400, y: 590});
	stage.insert(exit_door);

	setTimeout(function(){
		Q.stageScene("LevelFinished", Q.STAGE_LEVEL_NAVIGATION, {label: "Done"});
		stage.pause();
	}, 500);
});


Q.scene("health_2",function(stage) {
	stage.name = "health_2";
	Q.stageTMX("VirtualWorld.tmx", stage);

	Q.audio.stop();
	Q.audio.play("Tavern.wav", {loop: true});

	var Mira = Q("Player").first();
	stage.add("viewport").follow(Mira);
	Mira.addMaterialContainer("Player");

	var i = 0;
	while(Q("Building", Q.STAGE_LEVEL_PRIMARY).at(i) != null) {
		b = Q("Building").at(i);
		console.log(b.p.name + ": " +stage.options.element.interactability[b.p.name]);
		b.setInteractable(stage.options.element.interactability[b.p.name]);
		b.p.nextScene = stage.name + "_" + b.p.name;
		console.log("nextScene: " + b.p.nextScene);
		i += 1;
	}

//	var guru = Q("GuruIcon", Q.STAGE_LEVEL_SCORECARD).first();
//	guru.trigger("newconcept", "Start");

	stage.accept_material = function(material_name) {
		console.log("cannot accept the material");
		return false;
	};
});


Q.scene("health_2_HealthCenter", function(stage) {
	console.log("HealthCenter");
	stage.stock_name = "HealthCenter";
	stage.acceptable_materials = [];

	stage.insert(new Q.Repeater({ sheet: "tiles", frame:229, speedX: 1, speedY: 1 }));
	Q.stageTMX("healthcenter.tmx", stage);


	// Map Exit Door
	var exit_door = new Q.Door({width:96, height: 8, h: 16, w: 96, x: 400, y: 590});
	stage.insert(exit_door);

	// Mira
	var Mira = Q("Player").first();
	Mira.add("KeyCarrier");
	Mira.addKeyContainer();
	stage.player = Mira;

	Mira.onquestioncompletion = function () {
		setTimeout(function(){
			Q.stageScene("LevelFinished", Q.STAGE_LEVEL_NAVIGATION, {label: "Done"});
			stage.pause();
		}, 500);
	};


	setTimeout(function(){
		Q.stageScene("Dialog", Q.STAGE_LEVEL_DIALOG, {questions: stage.options.element.element, nextStage: Q.STAGE_LEVEL_LEARNING_MODULE, context: Mira, func: "onquestioncompletion"});
	}, 500);
});


Q.scene("market_research_1",function(stage) {
	stage.name = "market_research_1";
	Q.stageTMX("VirtualWorld.tmx", stage);

	var Mira = Q("Player").first();
	stage.add("viewport").follow(Mira);
	Mira.addMaterialContainer("Player");

	var i = 0;
	while(Q("Building", Q.STAGE_LEVEL_PRIMARY).at(i) != null) {
		b = Q("Building").at(i);
		console.log(b.p.name + ": " +stage.options.element.interactability[b.p.name]);
		b.setInteractable(stage.options.element.interactability[b.p.name]);
		b.p.nextScene = stage.name + "_" + b.p.name;
		console.log("nextScene: " + b.p.nextScene);
		i += 1;
	}

//	var guru = Q("GuruIcon", Q.STAGE_LEVEL_SCORECARD).first();
//	guru.trigger("newconcept", "Start");

	stage.accept_material = function(material_name) {
		console.log("cannot accept the material");
		return false;
	};
});


Q.scene("market_research_1_House", function(stage) {
	stage.stock_name = "House";
	stage.acceptable_materials = [];

	stage.insert(new Q.Repeater({ sheet: "tiles", frame:229, speedX: 1, speedY: 1 }));
	Q.stageTMX("house.tmx", stage);


	// Map Exit Door
	var exit_door = new Q.Door({width:96, height: 8, h: 16, w: 96, x: 400, y: 590});
	stage.insert(exit_door);



	// Mira
	var Mira = Q("Player").first();
	Mira.addMaterialContainer("Player");
	stage.player = Mira;

});


Q.scene("market_research_1_Workshop", function(stage) {
	stage.stock_name = "Workshop";
	stage.acceptable_materials = ["basket_01", "basket_02", "Sticks"];

	stage.insert(new Q.Repeater({ sheet: "tiles", frame:229, speedX: 1, speedY: 1 }));

	// Map Background
	Q.stageTMX("workshop.tmx", stage);

	// Map Exit Door
	var exit_door = new Q.Door({width:96, height: 8, h: 16, w: 96, x: 400, y: 588});
	stage.insert(exit_door);

	// Mira
	var Mira = Q("Player").first();
	Mira.addMaterialContainer("Player");
	stage.player = Mira;

	// Material
	stage.containers = {};
	var j = 0;
	for(material_name in Q.game.material_names) {
		stocks = {};
		if(Q.game.stocks[stage.stock_name][material_name]) {
			stocks[material_name] = [];
			for(i in Q.game.stocks[stage.stock_name][material_name]) {
				m = Q.game.stocks[stage.stock_name][material_name][i];
				stocks[material_name].push(m);
				console.log(stage.stock_name + ": " + m.ifBelongsToPlayer);
			}
		}

		stage.containers[material_name] = new Q.NewMaterialContainer({
								x: 600 + 80 * j, 
								y: 70,
								sheet: 'basket_01_sheet', 
								frame: 0,
								//stock_name: stage.stock_name,
								stocks: stocks,
						});
		stage.insert(stage.containers[material_name]);

		j += 1;
	}


	stage.if_acceptable = function(material_name) {
		for(var i = 0; i < stage.acceptable_materials.length; i++) {
			if(stage.acceptable_materials[i] == material_name)
				return true;
		}
		return false;
	};


	stage.give_material = function(material_name) {
		material_details = Q.game.stocks[stage.stock_name][material_name].pop();
		if(Q.game.stocks[stage.stock_name][material_name].length == 0) {
			console.log("empty");
			delete Q.game.stocks[stage.stock_name][material_name];
		}
		return material_details;
	};

	stage.accept_material = function(material_name,material_details) {
		// Step 0: Check if the stage accepts this material
		if(! stage.if_acceptable(material_name)) {
			console.log("not acceptable");
			return false;
		}
		// Step 1: Identify which container will accept the material
		var container = stage.containers[material_name];

		if(!Q.game.stocks[stage.stock_name][material_name])
			Q.game.stocks[stage.stock_name][material_name] = [];
		Q.game.stocks[stage.stock_name][material_name].push(material_details);

		container.addMaterial(material_name, material_details);
		return true;
	};

});

Q.scene("market_research_1_Market", function(stage) {
	stage.acceptable_materials = ["basket_01", "basket_02"];
	stage.stock_name = "Market";

	var market_tables = [
		{
		}, 
		{
			'basket_01': [
				new Material('basket_01', {price: 15, isClickable: true, ifBelongsToPlayer: false, commission: 100}),
			]
		}, 
		{
			'basket_03': [
				new Material('basket_03', {price: 10, isClickable: true, ifBelongsToPlayer: false, commission: 100}),
			]
		}, 
		{
			'basket_02': [
				new Material('basket_02', {price: 5, isClickable: true, ifBelongsToPlayer: false, commission: 100}),
			]
		}, 
		{
			'basket_02': [
				new Material('basket_02', {price: 5, isClickable: true, ifBelongsToPlayer: false, commission: 100}),
			]
		}
	];
	//var market_tables = [{}, {}, {}, {}, {}];

	Q.stageTMX("market.tmx", stage);


	// Map Exit Door
	var exit_door = new Q.Door({width:160, height: 1, w: 160, h: 1, x: 400, y: 590});
	stage.insert(exit_door);

	// Mira
	var Mira = Q("Player").first();
	stage.player = Mira;
	Mira.addMaterialContainer("Player");




	stage.tables = new Array();
	for(i = 0; i < 6; i++) {
		var materialcontainer = Q("MaterialContainer").at(i);
		console.log(materialcontainer.buyer_count());
		materialcontainer.p.player = Mira;
		materialcontainer.p.stock_name = stage.stock_name;
		materialcontainer.p.isClickable = false;
		materialcontainer.p.ifBelongsToPlayer = false;

		stage.tables.push(materialcontainer);
		if(i != 5) {
			// Vendor
			var person = new Q.Person({sheet: "mira_sheet", sprite: 'person_animation', frame:1, x: 0, y: - materialcontainer.p.h, name:"Vendor"});
			stage.insert(person, materialcontainer);

			// Material being sold
			var j= 0;
			for(material_name in market_tables[i]) {
				var stocks = {};
				stocks[material_name] = market_tables[i][material_name];
				var material = new Q.NewMaterialContainer({
									sheet: 'basket_01_sheet', 
									frame: 0,
									stock_name: stage.stock_name,
									stocks: stocks,
									x: 0, 
									y: -stage.tables[i].p.h/2 + 32 + 20 * j, 
									name: material_name, 
									player: Mira,
									ifBelongsToPlayer: false,
									price: Q.game.material_names[material_name].price, 
									stock_name: stage.stock_name,
								});
				stage.insert(material, stage.tables[i]);
				//material.tag();
				j +=1;
			}
		}
	}
	var player_table = stage.tables[5];
	player_table.p.ifBelongsToPlayer = true;


	var j = 0;
	stage.containers = {};
	for(material_index in stage.acceptable_materials) {
		var material_name = stage.acceptable_materials[material_index];
		var stocks = {};
		if(Q.game.stocks[stage.stock_name][material_name])
			stocks[material_name] = Q.game.stocks[stage.stock_name][material_name];

		stage.containers[material_name] = new Q.NewMaterialContainer({
								x: -player_table.p.w/2 + 32 + 32 * (j%2), 
								y: -player_table.p.h/2 + 32 + 32 * (Math.floor(j/2)),
								sheet: 'basket_01_sheet', 
								frame: 0,
								stock_name: stage.stock_name,
								stocks: stocks,
						});
		stage.insert(stage.containers[material_name], player_table);


//			material.tag();
		j += 1;
	}


	stage.redistribute_buyers = function() {
		buyers = Q("Buyer", Q.STAGE_LEVEL_LEARNING_MODULE);
		var i =0;
		while(buyers.at(i) != null) {
			buyers.at(i).destroy();
			i++;
		}

		for(var i = 0; i < stage.tables.length; i++) {
			var materialcontainer = stage.tables[i];
			console.log(materialcontainer.p.x);
			var buyer_count = materialcontainer.buyer_count();
			x_left  = - materialcontainer.p.cx;
			x_right = + materialcontainer.p.cx;
			y_up    = - materialcontainer.p.cy;
			y_down  = + materialcontainer.p.cy;

			buyer_x = [x_left - 25, x_right + 25, x_left - 15, x_left + 30, x_left + 75];
			buyer_y = [y_up + 30, y_up + 30, y_down + 40, y_down + 40, y_down + 40];
			buyer_frame = [7, 4, 10, 10, 10];
			for(j = 0; j < buyer_count; j++) {
				var person = new Q.Buyer({sheet: "mira_sheet", sprite:'person_animation', frame: buyer_frame[j], x: buyer_x[j], y: buyer_y[j], offset: 100 * i, name:"Buyer"});
				stage.insert(person, materialcontainer);
			}
		}
	};

	stage.redistribute_buyers();

	stage.if_acceptable = function(material_name) {
		for(var i = 0; i < stage.acceptable_materials.length; i++) {
			if(stage.acceptable_materials[i] == material_name)
				return true;
		}
		return false;
	};

	stage.accept_material = function(material_name,material_details) {
		// Step 0: Check if the stage accepts this material
		if(! stage.if_acceptable(material_name)) {
			console.log("not acceptable");
			return false;
		}
		// Step 1: Identify which container will accept the material
		var container = stage.containers[material_name];

		// Step 2: Ask the container to accept the material
		if(!Q.game.stocks[stage.stock_name][material_name])
			Q.game.stocks[stage.stock_name][material_name] = [];

		Q.game.stocks[stage.stock_name][material_name].push(material_details);

		var price = prompt("Price of " + material_name, Q.game.material_names[material_name].price);
		material_details.price = price;
		container.addMaterial(material_name, material_details);

		stage.redistribute_buyers();
		return true;
	};

	stage.give_material = function(material_name) {
		stage.redistribute_buyers();
		return true;
	};

});

Q.scene("aMarket_insidescene", function(stage) {
	stage.acceptable_materials = ["basket_01", "basket_02"];
	stage.stock_name = "Market";

	var market_tables = [{bamboo: 1}, {basket_01: 1}, {cane: 1}, {basket_02: 1}, {basket_02: 1}];
	//var market_tables = [{}, {}, {}, {}, {}];

	Q.stageTMX("market.tmx", stage);


	// Map Exit Door
	var exit_door = new Q.Door({width:160, height: 1, w: 160, h: 1, x: 400, y: 590});
	stage.insert(exit_door);

	// Mira
	var Mira = Q("Player").first();
	stage.player = Mira;
	Mira.addMaterialContainer("Player");

	var tables = new Array();
	for(i = 0; i < 6; i++) {
		table_x = 130 + 235 * (i%3);
		table_y = 90 + 260 * (Math.floor(i/3));
		var material = new Q.MaterialContainer({
								sheet: "Rug", 
								frame: Math.floor(i/2), 
								left_x: table_x, 
								top_y: table_y, 
								name: "Rug", 
								player:Mira, 
								stock_name: stage.stock_name,
								isClickable:false,
								ifBelongsToPlayer: false,
							});

		stage.insert(material);
		tables.push(material);
		if(i != 5) {
			// Vendor
			var person = new Q.Person({sheet: "mira_sheet", sprite: 'person_animation', frame:1, x: 0, y: - material.p.h, name:"Vendor"});
			stage.insert(person, material);

			// Material being sold
			for(material_name in market_tables[i]) {
				for(var j = 0; j < market_tables[i][material_name]; j++) {
					var material = new Q.Material({
										sheet: Q.game.material_names[material_name].sheet, 
										frame: Q.game.material_names[material_name].frame, 
										x: 0, 
										y: -tables[i].p.h/2 + 32 + 20 * j, 
										name: material_name, 
										player: Mira,
										parent: tables[i],
										ifBelongsToPlayer: false,
										price: Q.game.material_names[material_name].price, 
										stock_name: stage.stock_name,
									});
					stage.insert(material, tables[i]);
					//material.tag();
				}
			}
			buyer_count = 5;
			buyer_x = [table_x - 30, table_x + 130, table_x - 30, table_x + 30, table_x + 90];
			buyer_y = [table_y + 30, table_y + 30, table_y + 100, table_y + 100, table_y + 100];
			buyer_frame = [7, 4, 10, 10, 10];
			for(j = 0;j < buyer_count; j++) {
				var person = new Q.Buyer({sheet: "mira_sheet", sprite:'person_animation', frame: buyer_frame[j], x: buyer_x[j], y: buyer_y[j], offset: 100 * i, name:"Buyer"});
				stage.insert(person);
			}
		}
	}
	var player_table = tables[5];
	player_table.p.ifBelongsToPlayer = true;


	var j = 0;
	stage.containers = {};
	for(material_name in Q.game.material_names) {
		stocks = {};
		if(Q.game.stocks[stage.stock_name][material_name])
			stocks[material_name] = Q.game.stocks[stage.stock_name][material_name];
		stage.containers[material_name] = new Q.NewMaterialContainer({
								x: -player_table.p.w/2 + 32 + 32 * (j%2), 
								y: -player_table.p.h/2 + 32 + 32 * (Math.floor(j/2)),
								sheet: 'basket_01_sheet', 
								frame: 0,
								stock_name: stage.stock_name,
								stocks: stocks,
						});
		stage.insert(stage.containers[material_name], player_table);


//			material.tag();
		j += 1;
	}

	// Buyer
//	for(i = 0; i < 1; i++) {
//		var person = new Q.Buyer({sheet: "mira_sheet", sprite:'person_animation', x: 50, y: 50 + 100 * i, offset: 100 * i, name:"Buyer"});
//		stage.insert(person);
//	}

	stage.if_acceptable = function(material_name) {
		for(var i = 0; i < stage.acceptable_materials.length; i++) {
			if(stage.acceptable_materials[i] == material_name)
				return true;
		}
		return false;
	};

	stage.accept_material = function(material_name,material_details) {
		// Step 0: Check if the stage accepts this material
		if(! stage.if_acceptable(material_name)) {
			console.log("not acceptable");
			return false;
		}
		// Step 1: Identify which container will accept the material
		var container = stage.containers[material_name];

		// Step 2: Ask the container to accept the material
		if(!Q.game.stocks[stage.stock_name][material_name])
			Q.game.stocks[stage.stock_name][material_name] = [];

		Q.game.stocks[stage.stock_name][material_name].push(material_details);

		var price = prompt("Price of " + material_name, Q.game.material_names[material_name].price);
		material_details.price = price;
		container.addMaterial(material_name, material_details);
		return true;
	};

});


Q.scene("market_research_1_School",function(stage) {
//	stage.insert(new Q.Repeater({ sheet: "tiles", frame:229, speedX: 1, speedY: 1 }));

	Q.stageTMX("school.tmx", stage);


	// Map Exit Door
	var exit_door = new Q.Door({width:175, height: 1, h: 1, w: 175, x: 420, y: 590});
	stage.insert(exit_door);


	// Mira
	var Mira = new Q.Player({sheet: "mira_sheet", sprite: 'person_animation', frame:1, x: 100, y: 450, name:"Mira (inside Market)"});
	stage.insert(Mira);
	stage.player = Mira;


	Mira.onquestioncompletion = function () {
		console.log("Done");
		Q.stageScene("LevelFinished", Q.STAGE_LEVEL_NAVIGATION, {label: "Done"});
		stage.pause();
	};

	Q.stageScene("Dialog", Q.STAGE_LEVEL_DIALOG, {questions: stage.options.element.element, nextStage: Q.STAGE_LEVEL_PRIMARY, context: Mira, func: "onquestioncompletion"});


	stage.accept_material = function(material_name) {
		console.log("cannot accept the material");
		return false;
	};

});




Q.scene("market_research_1_SeemaWorkshop", function(stage) {
	stage.stock_name = "SeemaWorkshop";
	stage.acceptable_materials = ["Basket", "Sticks"];

	stage.insert(new Q.Repeater({ sheet: "tiles", frame:229, speedX: 1, speedY: 1 }));

	Q.stageTMX("seemaworkshop.tmx", stage);

	// Map Exit Door
	var exit_door = new Q.Door({width:96, height: 8, h: 16, w: 96, x: 400, y: 588});
	stage.insert(exit_door);

	// Mira
	var Mira = Q("Player").first();
	stage.player = Mira;
	Mira.addMaterialContainer("Player");

	// Other players
	var Enterpreneur = Q("Enterpreneur").first();
	Enterpreneur.info({duration:-1});

	// Material
	var j = 0;
	stage.containers = {};
	for(material_name in Q.game.material_names) {
		stocks = {};
		if(Q.game.stocks[stage.stock_name][material_name]) {
			stocks[material_name] = [];
			for(i in Q.game.stocks[stage.stock_name][material_name]) {
				m = Q.game.stocks[stage.stock_name][material_name][i];
				stocks[material_name].push(m);
			}
		}

		stage.containers[material_name] = new Q.NewMaterialContainer({
								x: 600 + 80 * j, 
								y: 70,
								sheet: 'basket_01_sheet', 
								frame: 0,
								stock_name: stage.stock_name,
								stocks: stocks,
						});
		stage.insert(stage.containers[material_name]);
		j += 1;
	}


	stage.if_acceptable = function(material_name) {
		for(var i = 0; i < stage.acceptable_materials.length; i++) {
			if(stage.acceptable_materials[i] == material_name)
				return true;
		}
		return false;
	};

	stage.give_material = function(material_name) {
		material_details = Q.game.stocks[stage.stock_name][material_name].pop();
		if(Q.game.stocks[stage.stock_name][material_name].length == 0) {
			console.log("empty");
			delete Q.game.stocks[stage.stock_name][material_name];
		}
		return material_details;
	};


	stage.accept_material = function(material_name) {
		// Step 0: Check if the stage accepts this material
		if(! stage.if_acceptable(material_name)) {
			console.log("not acceptable");
			return false;
		}

		// Step 1: Identify which container will accept the material
		var containers = Q("MaterialContainer", Q.STAGE_LEVEL_LEARNING_MODULE);
		var container = null;
		for(var i = 0; i > -1; i++) {
			newcontainer = containers.at(i);
			if (newcontainer == null)
				break
			if (newcontainer.p.name == material_name + " Container") {
				container = newcontainer;
				break
			}
		}

		// Step 2: Ask the container to accept the material
		container.accept_material(material_name);

		return true;
	};

	stage.on("destroy",function() {
		exit_door.destroy();
		Mira.destroy();
    });

});

/**
  * Finance Badge
  * Loan Element Scene
  */

 Q.scene("loan_1", function(stage) {
	stage.name = "loan_1";
	Q.stageTMX("VirtualWorld.tmx", stage);

	Q.audio.stop();
	//Q.audio.play("Tavern.wav", {loop: true});

	var Mira = Q("Player").first();
	Mira.add("KeyCarrier");
	stage.add("viewport").follow(Mira);
	//Mira.addMaterialContainer("Player");

	Mira.addKeyContainer();


	var i = 0;
	while(Q("Building", Q.STAGE_LEVEL_PRIMARY).at(i) != null) {
		b = Q("Building").at(i);
		console.log(b.p.name + ": " +stage.options.element.interactability[b.p.name]);
		b.setInteractable(stage.options.element.interactability[b.p.name]);
		b.p.nextScene = stage.name + "_" + b.p.name;
		console.log("nextScene: " + b.p.nextScene);
		i += 1;
	}

	stage.accept_material = function(material_name) {
		console.log("cannot accept the material");
		return false;
	};
});

Q.scene("loan_1_Market", function(stage) {
	stage.acceptable_materials = ["basket_01", "basket_02"];
	stage.stock_name = "Market";

	Q.stageTMX("market.tmx", stage);


	// Map Exit Door
	var exit_door = new Q.Door({width:160, height: 1, w: 160, h: 1, x: 400, y: 590});
	stage.insert(exit_door);

	// Mira
	var Mira = Q("Player").first();
	stage.player = Mira;
	Mira.addMaterialContainer("Player");



	

	var Shyam = new Q.Person({sheet: "mira_sheet", sprite: 'person_animation', frame:1, x: 50, y: 100, name:"Vendor"});
	stage.insert(Shyam);
	//Shyam.off("hit", Shyam, "collision");

	
	

	Shyam.collision = function(col) {

		var Ram = new Q.Person({sheet: "mira_sheet", sprite: 'person_animation', frame:1, x: 50, y: 150, name:"Vendor"});

		var Hari = new Q.Person({sheet: "mira_sheet", sprite: 'person_animation', frame:1, x: 50, y: 180, name:"Vendor"});

		var form = new Q.Form(
		{
			content: [
				new Q.MultipleChoiceQuestion({
					question: new Q.ImageText({
						label: new Q.UI.Text({label: "How many baskets can 1 person prepare in 1 day?", size: 18, type: Q.SPRITE_NONE, }),
						fill: null,
					}), 
					choices: [
						new Q.ImageText({
							label: new Q.UI.Text({label: "5", size: 16, type: Q.SPRITE_NONE}),
							isSelectable: true,
							fill: null,
						}), 
						new Q.ImageText({
							label: new Q.UI.Text({label: "6", size: 16, type: Q.SPRITE_NONE}),
							isSelectable: true,
							fill: null,
						}), 
						new Q.ImageText({
							label: new Q.UI.Text({label: "7", size: 16, type: Q.SPRITE_NONE}),
							isSelectable: true,
							fill: null,
						}), 
						new Q.ImageText({
							label: new Q.UI.Text({label: "8", size: 16, type: Q.SPRITE_NONE}),
							isSelectable: true,
							fill: null,
						}), 
						new Q.ImageText({
							label: new Q.UI.Text({label: "9", size: 16, type: Q.SPRITE_NONE}),
							isSelectable: true,
							fill: null,
						}), 
						new Q.ImageText({
							label: new Q.UI.Text({label: "10", size: 16, type: Q.SPRITE_NONE}),
							isSelectable: true,
							fill: null,
						}), 
						new Q.ImageText({
							label: new Q.UI.Text({label: "11", size: 16, type: Q.SPRITE_NONE}),
							isSelectable: true,
							fill: null,
						}), 
					],
				}),
				new Q.MultipleChoiceQuestion({
					question: new Q.ImageText({
						label: new Q.UI.Text({label: "How many people are in your SHG?", size: 18, type: Q.SPRITE_NONE, }),
						fill: null,
					}), 
					choices: [
						new Q.ImageText({
							label: new Q.UI.Text({label: "1", size: 16, type: Q.SPRITE_NONE}),
							isSelectable: true,
							fill: null,
						}), 
						new Q.ImageText({
							label: new Q.UI.Text({label: "2", size: 16, type: Q.SPRITE_NONE}),
							isSelectable: true,
							fill: null,
						}), 
						new Q.ImageText({
							label: new Q.UI.Text({label: "3", size: 16, type: Q.SPRITE_NONE}),
							isSelectable: true,
							fill: null,
						}), 
						new Q.ImageText({
							label: new Q.UI.Text({label: "4", size: 16, type: Q.SPRITE_NONE}),
							isSelectable: true,
							fill: null,
						}), 
						new Q.ImageText({
							label: new Q.UI.Text({label: "5", size: 16, type: Q.SPRITE_NONE}),
							isSelectable: true,
							fill: null,
						}), 
					],
				}),
				new Q.MultipleChoiceQuestion({
					question: new Q.ImageText({
						label: new Q.UI.Text({label: "How much would you like to price each basket for selling?", size: 18, type: Q.SPRITE_NONE, }),
						fill: null,
					}), 
					choices: [
						new Q.ImageText({
							label: new Q.UI.Text({label: "1", size: 16, type: Q.SPRITE_NONE}),
							isSelectable: true,
							fill: null,
						}), 
						new Q.ImageText({
							label: new Q.UI.Text({label: "5", size: 16, type: Q.SPRITE_NONE}),
							isSelectable: true,
							fill: null,
						}), 
						new Q.ImageText({
							label: new Q.UI.Text({label: "10", size: 16, type: Q.SPRITE_NONE}),
							isSelectable: true,
							fill: null,
						}), 
						new Q.ImageText({
							label: new Q.UI.Text({label: "20", size: 16, type: Q.SPRITE_NONE}),
							isSelectable: true,
							fill: null,
						}), 
						new Q.ImageText({
							label: new Q.UI.Text({label: "50", size: 16, type: Q.SPRITE_NONE}),
							isSelectable: true,
							fill: null,
						}), 
					],
				}),
				new Q.MultipleChoiceQuestion({
					question: new Q.ImageText({
						label: new Q.UI.Text({label: "How much would your SHG take loan from the bank?", size: 18, type: Q.SPRITE_NONE, }),
						fill: null,
					}), 
					choices: [
						new Q.ImageText({
							label: new Q.UI.Text({label: "10000", size: 16, type: Q.SPRITE_NONE}),
							isSelectable: true,
							fill: null,
						}), 
						new Q.ImageText({
							label: new Q.UI.Text({label: "12500", size: 16, type: Q.SPRITE_NONE}),
							isSelectable: true,
							fill: null,
						}), 
						new Q.ImageText({
							label: new Q.UI.Text({label: "15000", size: 16, type: Q.SPRITE_NONE}),
							isSelectable: true,
							fill: null,
						}),
					],
				}),
				new Q.MultipleChoiceQuestion({
					question: new Q.ImageText({
						label: new Q.UI.Text({label: "How much would you like to price each basket for selling?", size: 18, type: Q.SPRITE_NONE, }),
						fill: null,
					}), 
					choices: [
						new Q.ImageText({
							label: new Q.UI.Text({label: "50", size: 16, type: Q.SPRITE_NONE}),
							isSelectable: true,
							fill: null,
						}), 
						new Q.ImageText({
							label: new Q.UI.Text({label: "75", size: 16, type: Q.SPRITE_NONE}),
							isSelectable: true,
							fill: null,
						}), 
						new Q.ImageText({
							label: new Q.UI.Text({label: "100", size: 16, type: Q.SPRITE_NONE}),
							isSelectable: true,
							fill: null,
						}), 
						new Q.ImageText({
							label: new Q.UI.Text({label: "125", size: 16, type: Q.SPRITE_NONE}),
							isSelectable: true,
							fill: null,
						}), 
						new Q.ImageText({
							label: new Q.UI.Text({label: "150", size: 16, type: Q.SPRITE_NONE}),
							isSelectable: true,
							fill: null,
						}), 
					],
				}),
			],
			context: Shyam,
			func: "onquestioncompletion",
		});
		Q.stage().insert(form);

		/*
		Mira.oncompletion = function() {
			switch(counter){
				case 1:{
					Q.stageScene("Dialog", Q.STAGE_LEVEL_DIALOG, {dialog: Shyam.p.labels[0], nextStage: Q.STAGE_LEVEL_PRIMARY, context: Shyam, func: "oncompletion"});
					break;
				}
				case 3:{
					Q.stageScene("Dialog", Q.STAGE_LEVEL_DIALOG, {dialog: Shyam.p.labels[1], nextStage: Q.STAGE_LEVEL_PRIMARY, context: Shyam, func: "oncompletion"});
					break;
				}
				case 5:{
					Q.stageScene("Dialog", Q.STAGE_LEVEL_DIALOG, {dialog: Shyam.p.labels[2], nextStage: Q.STAGE_LEVEL_PRIMARY, context: Shyam, func: "oncompletion"});
					break;
				}
				case 7:{
					Q.stageScene("Dialog", Q.STAGE_LEVEL_DIALOG, {dialog: Shyam.p.labels[3], nextStage: Q.STAGE_LEVEL_PRIMARY, context: Shyam, func: "oncompletion"});
					break;
				}
				case 9:{
					Q.stageScene("Dialog", Q.STAGE_LEVEL_DIALOG, {dialog: Shyam.p.labels[4], nextStage: Q.STAGE_LEVEL_PRIMARY, context: Shyam, func: "oncompletion"});
					break;
				}
				case 11:{
					stage.insert(Ram);
					Ram.off("hit", Ram, "collision");
					Q.stageScene("Dialog", Q.STAGE_LEVEL_DIALOG, {dialog: Shyam.p.labels[5], nextStage: Q.STAGE_LEVEL_PRIMARY, context: Shyam, func: "oncompletion"});
					break;
				}
				case 17:{
					stage.insert(Hari);
					Hari.off("hit", Hari, "collision");
					Q.stageScene("Dialog", Q.STAGE_LEVEL_DIALOG, {dialog: Shyam.p.labels[8], nextStage: Q.STAGE_LEVEL_PRIMARY, context: Shyam, func: "oncompletion"});
					break;
				}
			}
			
			counter++;
		};
		
		Shyam.oncompletion = function() {
			switch(counter){
				case 0:{
					Q.stageScene("Dialog", Q.STAGE_LEVEL_DIALOG, {dialog: Mira.p.labels[0], nextStage: Q.STAGE_LEVEL_PRIMARY, context: Mira, func: "oncompletion"});
					break;
				}
				case 2:{
					Q.stageScene("Dialog", Q.STAGE_LEVEL_DIALOG, {dialog: Mira.p.labels[1], nextStage: Q.STAGE_LEVEL_PRIMARY, context: Mira, func: "oncompletion"});
					break;
				}
				case 4:{
					Q.stageScene("Dialog", Q.STAGE_LEVEL_DIALOG, {dialog: Mira.p.labels[2], nextStage: Q.STAGE_LEVEL_PRIMARY, context: Mira, func: "oncompletion"});
					break;
				}
				case 6:{
					Q.stageScene("Dialog", Q.STAGE_LEVEL_DIALOG, {dialog: Mira.p.labels[3], nextStage: Q.STAGE_LEVEL_PRIMARY, context: Mira, func: "oncompletion"});
					break;
				}
				case 8:{
					Q.stageScene("Dialog", Q.STAGE_LEVEL_DIALOG, {dialog: Mira.p.labels[4], nextStage: Q.STAGE_LEVEL_PRIMARY, context: Mira, func: "oncompletion"});
					break;
				}
				case 10:{
					Q.stageScene("Dialog", Q.STAGE_LEVEL_DIALOG, {dialog: Mira.p.labels[5], nextStage: Q.STAGE_LEVEL_PRIMARY, context: Mira, func: "oncompletion"});
					break;
				}
				case 12:{
					Q.stageScene("Dialog", Q.STAGE_LEVEL_DIALOG, {dialog: Ram.p.labels[0], nextStage: Q.STAGE_LEVEL_PRIMARY, context: Ram, func: "oncompletion"});
					break;
				}
				case 14:{
					Q.stageScene("Dialog", Q.STAGE_LEVEL_DIALOG, {dialog: Ram.p.labels[1], nextStage: Q.STAGE_LEVEL_PRIMARY, context: Ram, func: "oncompletion"});
					break;
				}
				case 16:{
					Q.stageScene("Dialog", Q.STAGE_LEVEL_DIALOG, {dialog: Mira.p.labels[6], nextStage: Q.STAGE_LEVEL_PRIMARY, context: Mira, func: "oncompletion"});
					break;
				}
				case 18:{
					Q.stageScene("Dialog", Q.STAGE_LEVEL_DIALOG, {dialog: Hari.p.labels[0], nextStage: Q.STAGE_LEVEL_PRIMARY, context: Hari, func: "oncompletion"});
					break;
				}
				case 20:{
					Q.stageScene("Dialog", Q.STAGE_LEVEL_DIALOG, {dialog: Hari.p.labels[1], nextStage: Q.STAGE_LEVEL_PRIMARY, context: Hari, func: "oncompletion"});
					break;
				}
				case 22:{
					Q.stageScene("Dialog", Q.STAGE_LEVEL_DIALOG, {questions: loan_test[0], nextStage: Q.STAGE_LEVEL_PRIMARY, context: Shyam, func: "oncompletion"});
					console.log(counter);
					break;
				}
				case 23:{
					Q.stageScene("Dialog", Q.STAGE_LEVEL_DIALOG, {questions: loan_test[1], nextStage: Q.STAGE_LEVEL_PRIMARY, context: Shyam, func: "oncompletion"});
					console.log(counter);
					break;
				}
				case 24:{
					Q.stageScene("Dialog", Q.STAGE_LEVEL_DIALOG, {questions: loan_test[2], nextStage: Q.STAGE_LEVEL_PRIMARY, context: Shyam, func: "oncompletion"});
					console.log(counter);
					break;
				}
				case 25:{
					Q.stageScene("Dialog", Q.STAGE_LEVEL_DIALOG, {questions: loan_test[3], nextStage: Q.STAGE_LEVEL_PRIMARY, context: Shyam, func: "oncompletion"});
					console.log(counter);
					break;
				}
				case 26:{
					Q.stageScene("Dialog", Q.STAGE_LEVEL_DIALOG, {questions: loan_test[4], nextStage: Q.STAGE_LEVEL_PRIMARY, context: Shyam, func: "oncompletion"});
					console.log(counter);
					break;
				}
				case 27:{
					//now the last question is answered.
					console.log(counter);
					break;
				}
				default: break;
			}
			counter++;
		};

		Ram.oncompletion = function() {
			switch(counter){
				case 13:{
					Q.stageScene("Dialog", Q.STAGE_LEVEL_DIALOG, {dialog: Shyam.p.labels[6], nextStage: Q.STAGE_LEVEL_PRIMARY, context: Shyam, func: "oncompletion"});
					break;
				}
				case 15:{
					Q.stageScene("Dialog", Q.STAGE_LEVEL_DIALOG, {dialog: Shyam.p.labels[7], nextStage: Q.STAGE_LEVEL_PRIMARY, context: Shyam, func: "oncompletion"});
					stage.remove(Ram);
					break;
				}
				default: break;
			}
			counter++;
		};

		Hari.oncompletion = function() {
			switch(counter){
				case 19:{
					Q.stageScene("Dialog", Q.STAGE_LEVEL_DIALOG, {dialog: Shyam.p.labels[9], nextStage: Q.STAGE_LEVEL_PRIMARY, context: Shyam, func: "oncompletion"});
					break;
				}
				case 21:{
					Q.stageScene("Dialog", Q.STAGE_LEVEL_DIALOG, {dialog: Shyam.p.labels[10], nextStage: Q.STAGE_LEVEL_PRIMARY, context: Shyam, func: "oncompletion"});
					stage.remove(Hari);
					break;
				}
				default: break;
			}
			counter++;
		};
		
		var counter = 0;
		Mira.p.labels = new Array();
		Shyam.p.labels = new Array();
		Mira.p.labels[0] = "Thanks Shyam ji for introducing me to the idea of Self Help Group. I have found 4 other\n"+
			"friends who are interested in collectively make baskets and sell them to the market. We also have\n"+
			"identified the place where we will work. We have some savings, so each of us have decided to\n"+
			"put Rs 200 to start the work and have decided to split the profit equally among ourselves. But I\n"+
			"think Rs 1000 will not be enough to start a business.";
		counter++;
		Q.stageScene("Dialog", Q.STAGE_LEVEL_DIALOG, {dialog: Mira.p.labels[0], nextStage: Q.STAGE_LEVEL_PRIMARY, context: Mira, func: "oncompletion"});
		
		Shyam.p.labels[0] = "This is wonderful Mira, a great start I must say. You have quickly arranged for the\n"+
			"people and also some money to begin with. Do you know that you can get a loan from the local\n"+
			"bank? The bank lends the money for starting the business but charges an interest on it. Do you\n"+
			"know how the interest works?";

		Mira.p.labels[1] = "I know some things about the bank loan and interest,\n"+
						"but can you please explain me in detail.";

		Shyam.p.labels[1] = "The bank will loan people who want to start a business. Let us say your SHG need Rs 5000 more to start your business.\n"+
			"You can apply for loan in the bank for Rs 5000 and show some\n"+
			"property which the bank can use if your group fails to pay the loan. Then once the loan is\n"+
			"approved, the bank will give you the money and it will charge an interest of 2% per month, that\n"+
			"means for every Rs 100 that the bank lends, it will ask you to pay Rs 2 per month until you return\n"+
			"the money to the bank. So, if your SHG takes a loan of Rs 5000 and you return the money to the\n"+
			"bank after 1 year, then you will have to return the money that you loaned Rs 5000, which is also\n"+
			"called the principal amount plus the interest amount which will be 2% of 5000 = Rs 100 per\n"+
			"month for 12 months, which is 12*100 = Rs 1200. Hence, you will have to return Rs 6200 to the\n"+
			"bank by the end of the year. ";

		Mira.p.labels[2] = "Thanks Shyam ji for explaining me the details of how the bank loan and interest works. I\n"+
			"will talk to my SHG members and we will apply for loan. I have one more question.";

		Shyam.p.labels[2] = "Sure, please ask.";

		Mira.p.labels[3] = "How should we decide about the amount of loan that we need? We do not have much idea\n"+
			"about the business.";

		Shyam.p.labels[3] = "The amount of loan you need from the bank mainly depends on the cost of initial\n"+
			"expenses for buying equipments, which is NIL in your case, and how many products do you\n"+
			"want to prepare and sell. Let me give you an example; let us assume that your SHG takes a loan\n"+
			"of Rs 5000 from the bank.\n"+
			"******Cartoon Image******\n"+
			"Practically speaking, you can sell about 100 products per week at the maximum. If each person\n"+
			"can prepare 3 products per day and each one works 6 days a week, then your SHG can prepare\n"+
			"5*6*3 = 90 products (baskets) per week. For preparing each product you will need about 100\n"+
			"grams of raw material (bamboo shoots). The cost of raw material (bamboo shoots) is Rs 100 per\n"+
			"Kilogram. For 30 products, you will need 90*100 = 9000 grams or 9 kilograms of raw material,\n"+
			"which will cost you Rs 200* 9 = Rs 1800. There will some additional cost involved for\n"+
			"transportation, electricity etc.; let us assume it to be Rs 200. Then if you sell all the baskets and\n"+
			"each basket at Rs 30, then you will earn Rs 30*90 = Rs 2700. Hence, your profit will be Rs\n"+
			"2700-1800-200 = Rs 700. You can set a higher price for selling the basket, so that you can earn\n"+
			"more profit but keep in mind that if you set too high a selling price, people may not buy as many\n"+
			"baskets. Let us say you price each basket at Rs 40 and all of them get sold, then you will earn Rs\n"+
			"40*90 = Rs 3600 and hence your profit will be Rs 3600- 1800-200 = Rs 1600.\n"+
			"You can use this money to pay the bank loan, purchase raw material for the next week and use\n"+
			"the remaining amount to pay everyone salary for the week. When you start the business, you can\n"+
			"decide to take a lower salary so that you can pay the loan faster and also purchase more raw\n"+
			"materials to make more products and hence expand your business. So, if you pay the bank\n"+
			"interest of Rs 200 and plan to keep some money aside for paying the principal amount, say Rs 100,\n"+
			"then you are left with Rs 1600 – 200 - 100 = Rs 1300. If the SHG decides to invest some part of\n"+
			"it in buying the raw material, say Rs 300, then the remaining amount will be Rs 1300- 300 = Rs\n"+
			"1000. So, the SHG group members can take a weekly salary of Rs 1000/5 = Rs 200. This is a\n"+
			"balanced way of spending bank’s money and making sure that the SHG will be able to pay back\n"+
			"the interest to the bank on time and also save enough to pay back the principal amount.";

		Mira.p.labels[4] = "Thanks a lot Shyam Ji for explaining these concepts in such detail. I will explain it to my\n"+
			"SHG members and then we can decide how much loan to take from bank so that we are able to\n"+
			"return the loan and the pay the interest on time.";

		Shyam.p.labels[4] = "I am glad that you understood the benefits and risks of taking a bank loan. Let us go and\n"+
			"listen to the first hand experiences of Ram and Hari who had taken loan from bank for their\n"+
			"SHG.";

		Mira.p.labels[5] = "Sure, I would like to hear their experiences.";

		
		Shyam.p.labels[5] = "Namaskar Ram! How are you doing?";

		Ram.p.labels = new Array();
		Ram.p.labels[0] = "Namaste Shyam Ji ! I am doing great, we just finished sending a fresh batch of shirts to be\n"+
			"sold at the big cloth store in Ranchi.";
		
		Shyam.p.labels[6] = "Mira has just joined a SHG group and is planning to apply for loan in the bank to start\n"+
			"business. Can you tell her about your experience with the bank loan?";
		
		Ram.p.labels[1] = "Sure, our SHG group of 10 people took a loan of Rs 10,000 from the bank and we started\n"+
			"preparing and selling clothes. Each member of our group had put Rs 500 initially and we\n"+
			"decided to prepare around 100 shirts per week after studying the market demand and pricing\n"+
			"the shirts accordingly. We were able to pay the bank loan in 1 year and now we are able to\n"+
			"manage the cost of production on our own.";
		
		Shyam.p.labels[7] = "So, you can see Mira that with a balanced approach, Ram’s SHG group did a good job in\n"+
			"utilizing the bank loan amount. Now let us go to meet Hari and listen to his experiences.";
		
		Mira.p.labels[6] = "Sure, Ram’s story was very encouraging.";
		
		Shyam.p.labels[8] = "Hello Hari! How are you doing? You look somewhat worried.";
		
		Hari.p.labels = new Array();
		Hari.p.labels[0] = "Namaste Shyam Ji! Yes, I am a little worried about repaying the bank’s loan. As you know,\n"+
			"my SHG took more loan than we could have repaid to the bank. In our SHG group of 7 people,\n"+
			"we took a loan of Rs 15,000 and we were making much more number of Saris than the demand.\n"+
			"Hence, we were not able to sell enough and could not make any profit. Then, since we defaulted\n"+
			"the bank payments more than 5 times, they have given us a notice that our factory space will be\n"+
			"taken away from us and auctioned by bank. Now, we are trying to sell our product at real low\n"+
			"prices so that we can make some payments to the bank and avoid the auction.";
		
		Shyam.p.labels[9] = "Don’t worry Hari. Try to sell some of the Saris at different places so that your SHG can\n"+
			"pay back the interest to bank and avoid the auction. All the best for your SHG!";
		
		Hari.p.labels[1] = "Thanks Shyam Ji!";
		
		Shyam.p.labels[10] = "So you saw Mira if the SHG does not plan properly and take a loan from bank then it can\n"+
			"get into trouble. So, while there are benefits of bank loan, you must also understand the risks\n"+
			"involved. Here is a small exercise for you.";*/
	};
	Shyam.on("hit", Shyam, "collision");
	
	stage.if_acceptable = function(material_name) {
		for(var i = 0; i < stage.acceptable_materials.length; i++) {
			if(stage.acceptable_materials[i] == material_name)
				return true;
		}
		return false;
	};

	stage.accept_material = function(material_name,material_details) {
		// Step 0: Check if the stage accepts this material
		if(! stage.if_acceptable(material_name)) {
			console.log("not acceptable");
			return false;
		}
		// Step 1: Identify which container will accept the material
		var container = stage.containers[material_name];

		// Step 2: Ask the container to accept the material
		if(!Q.game.stocks[stage.stock_name][material_name])
			Q.game.stocks[stage.stock_name][material_name] = [];

		Q.game.stocks[stage.stock_name][material_name].push(material_details);

		var price = prompt("Price of " + material_name, Q.game.material_names[material_name].price);
		material_details.price = price;
		container.addMaterial(material_name, material_details);

		stage.redistribute_buyers();
		return true;
	};

	stage.give_material = function(material_name) {
		stage.redistribute_buyers();
		return true;
	};

});




Q.scene("concept_scene", function(stage) {
//	stage.insert(new Q.Repeater({ sheet: "tiles", frame:229, speedX: 1, speedY: 1 }));
	var aakashvani = new Q.Aakashvani({asset:'cloud.png', final_width: 750, final_height: 525});
	stage.insert(aakashvani);
});

