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

	// Sahiya
	var sahiya = new Q.Sahiya({asset: "People/sahiya.png", x:400, y:800, isInteractable:true, name:"Sahiya"});
	stage.insert(sahiya);
	sahiya.info({duration:-1});
	
	var i = 0;
	while(Q("Building", Q.STAGE_LEVEL_PRIMARY).at(i) != null) {
		b = Q("Building").at(i);
		console.log(b.p.name + ": " +stage.options.element.interactability[b.p.name]);
		b.setInteractable(stage.options.element.interactability[b.p.name]);
		b.p.nextScene = stage.name + "_" + b.p.name;

		if(b.p.name == "HealthCenter"){
			if(!(b.p.isInteractable)){
				b.collide = function(col) {
				sahiya.info({duration:-1});
				sahiya.p.labels = [
						    "Mira, you need ALL three - mind,",
						    "body and relationship - keys in order",
						    "to enter the health center"
					          ];
			      	}
				b.on("hit", Ram, "collide");
			}
		}
		i += 1;
	}

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
			if(b.p.name == "HealthCenter")
				b.setInteractable(true);
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


	setTimeout(function(){
		if(Q.game.player.keys.length == 0) {
			Q.stageScene("Dialog", Q.STAGE_LEVEL_DIALOG, {questions: stage.options.element.element["Arvind"], nextStage: Q.STAGE_LEVEL_LEARNING_MODULE, context: Mira, func: "onquestioncompletion"});
		}
	}, 500);
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


	// Blackboard
	var Blackboard = Q("Blackboard").first();
	Blackboard.p.lessons = stage.options.element.element;



	Blackboard.teach(true);


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




Q.scene("concept_scene", function(stage) {
//	stage.insert(new Q.Repeater({ sheet: "tiles", frame:229, speedX: 1, speedY: 1 }));
	var aakashvani = new Q.Aakashvani({asset:'cloud.png', final_width: 750, final_height: 525});
	stage.insert(aakashvani);
});

