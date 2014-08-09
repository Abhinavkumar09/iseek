console.log("loaded health element");

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


