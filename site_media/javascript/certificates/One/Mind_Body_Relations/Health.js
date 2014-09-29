console.log("loaded health element");

Q.scene("health_1",function(stage) {
	stage.name = "health_1";

	stage.desc_card = new Q.StageInfoCard({
		description: new Q.ImageText({
			label: new Q.UI.WrappableText({label: "Hi! TODO: Fill the details of the element here"}),
		}),
		context: stage,
	});

	var guru = Q("GuruIcon", Q.STAGE_LEVEL_NAVIGATION).first();
	guru.trigger("register", stage.desc_card);

	stage.insert(new Q.Repeater({ sheet: "tiles", frame:229, speedX: 1, speedY: 1 }));
	Q.stageTMX(game.TMX.VirtualWorld, stage);
	game.AUDIO.stop_n_play(game.AUDIO.RESOURCES.VILLAGE);

	var player = Q("Player").first();
	stage.player = player;
	player.add("KeyCarrier");
	stage.add("viewport").follow(player);

	player.addKeyContainer();

	var i = 0;
	while(Q("Building", Q.STAGE_LEVEL_PRIMARY).at(i) != null) {
		b = Q("Building").at(i);
		b.setInteractable(stage.options.element.interactability[b.p.name]);
		b.p.nextScene = stage.name + "_" + b.p.name;
		
		if(b.p.name == "HealthCenter" && !(b.p.isInteractable)){
			b.collide = function(col) {
				Nurse.info({duration:-1, showOnMiniMap: true});
			}
			b.on("hit", b, "collide");
		}
		i += 1;
	}

	var Nurse = new Q.Person({sheet: "nurse_sheet", frame: 0, x:1050, y:600, isInteractable:true, name:"Nurse"});
	stage.insert(Nurse);

	Nurse.collision = function(col) {
		if(Q.game.player.keys.length >= 3){ // assumed 'relationship' key attained at the end
			var i = 0;
			while(Q("Building", Q.STAGE_LEVEL_PRIMARY).at(i) != null) {
				var b = Q("Building").at(i);
				if(b.p.name == "HealthCenter"){
					if(!b.p.isInteractable){
						b.setInteractable(true);
					}					
				}
				i += 1;
			}
			this.p.label = "So now you know what is important for good health - a sound mind, a healthy body and amiable relationship with those around you! Now, you can enter the healthcenter";		
			this.bottom_quote(this.p.label);
		}
		else if(Q.game.player.keys.length >= 2) { // assumed 'mind' key is attained second
			this.p.label = "Mira, now you have the 'mind' and 'body' keys but again, that is not enough. A sound mind and a health body only flourish when you have good relations with your friends and family. Look around for the 'relationship' key.";
			Anthony.info({duration:5, showOnMiniMap: true});		
		}
		else if(Q.game.player.keys.length >= 1) { // assumed 'body' key is attained first
			this.p.label = "Mira, now you have the 'body' key but that is not enough for all round good health. A healthy body is boosted by a sound mind. Look around for the 'mind' key.";
			Akbar.info({duration:5, showOnMiniMap: true});		

			this.bottom_quote(this.p.label);
		}
		else{
			this.p.label = "Hi Mira! The health center is closed as we have lost all the keys. People have taken the keys for their well being and have not returned them. Look around for the healthiest persons in the community and get the keys from them.";
			Amar.info({duration:5, showOnMiniMap: true});		

			this.bottom_quote(this.p.label);
		}		
	};
	Nurse.on("hit", Nurse, "collision");

	var Amar = new Q.Person({sheet: "person_1_sheet", frame: 1, x:1000, y:700, isInteractable:true, name:"Amar"});
	stage.insert(Amar);

	Amar.off("hit", Amar, "collision");
	Amar.collision = function(col) {
		if(Q.game.player.keys.length >= 1) {
			Amar.p.label = "Congrats Mira! You now have the 'body' key.";
		}
		else if(Q.game.player.keys.length < 1)
			Amar.p.label = "नमस्ते Mira. In order to get the 'body' key, you need to complete certain activities. Go home and complete as many of the 'body' activities as you can";


		Amar.bottom_quote(Amar.p.label);
		var i = 0;
		while(Q("Building", Q.STAGE_LEVEL_PRIMARY).at(i) != null) {
			b = Q("Building").at(i);
			if(b.p.name == "House") {
				b.setInteractable(true);
			}
			i += 1;
		}
	};
	Amar.on("hit", Amar, "collision");



	var Akbar = new Q.Person({sheet: "person_2_sheet", frame: 1, x:1300, y:800, name:"Akbar"});
	stage.insert(Akbar);
	
	stage.onquestioncompletion_akbar = function () {
		console.log("added mind key");
		Q.game.player.keys.push("mind");
		player.resetKeyContainer();
	};


//	Akbar.off("hit", Akbar, "collision");
	Akbar.collision = function(col) {
		if(Q.game.player.keys.length >= 2) {
			this.p.label = "Congrats Mira! You now have the 'mind' key.";
			this.bottom_quote(this.p.label);
		} else if(Q.game.player.keys.length >= 1) {
			var mindQuestion = new Q.MultipleChoiceQuestion({
									question: new Q.ImageText({
										label: new Q.UI.WrappableText({label: "What time of the day are you most happy ?"}),
										fill: null,
									}), 
									choices: [
										new Q.ImageText({
											label: new Q.UI.WrappableText({label: "Morning"}),
											isSelectable: true,
											fill: null,
										}), 
										new Q.ImageText({
											label: new Q.UI.WrappableText({label: "Evening"}),
											isSelectable: true,
											fill: null,
										}), 
										new Q.ImageText({
											label: new Q.UI.WrappableText({label: "Night"}),
											isSelectable: true,
											fill: null,
										}), 
									],
								})

			var form = new Q.Form({
				content: [mindQuestion],
				context: stage,
				func: "onquestioncompletion_akbar",
			});

			Q.stage(Q.STAGE_LEVEL_DIALOG).insert(form);
		}
		else if(Q.game.player.keys.length < 1)
			this.bottom_quote("Hi");
	};
	Akbar.on("hit", Akbar, "collision");


	var Anthony = new Q.Person({sheet: "person_3_sheet", frame: 1, x:1600, y:600, name:"Anthony"});
	stage.insert(Anthony);
	
	stage.onquestioncompletion_anthony = function () {
		Q.game.player.keys.push("relationship");
		player.resetKeyContainer();
		Nurse.info({duration:5, showOnMiniMap:true});		
	};

//	Anthony.off("hit", Anthony, "collision");
	Anthony.collision = function(col) {
		if(Q.game.player.keys.length >= 3) {
			this.p.label = "Congrats Mira! You now have the 'relationship' key.";
			this.bottom_quote(this.p.label);
		} else if(Q.game.player.keys.length >= 2){
			var relationshipQuestions = ["Who is supportive in your life?", "Who makes your life harder?"];
			var relationshipSurvey = Array(relationshipQuestions.length);
			for(i = 0; i < relationshipSurvey.length; i++){
				relationshipSurvey[i] = new Q.MultipleChoiceQuestion({
							question: new Q.ImageText({
								label: new Q.UI.WrappableText({label: relationshipQuestions[i]}),
								fill: null,
							}), 
							choices: [
								new Q.ImageText({
									label: new Q.UI.WrappableText({label: "Father"}),
									isSelectable: true,
									fill: null,
								}), 
								new Q.ImageText({
									label: new Q.UI.WrappableText({label: "Mother"}),
									isSelectable: true,
									fill: null,
								}), 
								new Q.ImageText({
									label: new Q.UI.WrappableText({label: "Brother"}),
									isSelectable: true,
									fill: null,
								}), 
								new Q.ImageText({
									label: new Q.UI.WrappableText({label: "Sister"}),
									isSelectable: true,
									fill: null,
								}), 
							],
						})
			}

			var form = new Q.Form(
				{
					content: relationshipSurvey,
					context: stage,
					func: "onquestioncompletion_anthony",
				}
			);

			Q.stage(Q.STAGE_LEVEL_DIALOG).insert(form);
		}
		else if(Q.game.player.keys.length < 2)
			this.bottom_quote("Hi");
	};
	Anthony.on("hit", Anthony, "collision");
});


Q.scene("health_1_House", function(stage) {
	stage.stock_name = "House";

	stage.insert(new Q.Repeater({ sheet: "tiles", frame:229, speedX: 1, speedY: 1 }));
	stage.add("viewport").centerOn(400, 300);
	Q.stageTMX("house.tmx", stage);


	// Map Exit Door
	var exit_door = new Q.Door({width:96, height: 8, h: 16, w: 96, x: 400, y: 590});
	stage.insert(exit_door);



	// Mira
	var player = Q("Player").first();
	player.add("KeyCarrier");
	player.addKeyContainer();
	stage.player = player;

	stage.onquestioncompletion_amar = function () {
		console.log("added body key");
		Q.game.player.keys.push("body");
		player.resetKeyContainer();
	};

	var bodyActivities = ["eat nutritional food", "take supplements", "keep up hygiene", "rest", "do physical activity", "maintain proper urination \nsanitation"];
	var bodyQuestions = Array(bodyActivities.length);
	for(i = 0; i < bodyQuestions.length; i++){
		bodyQuestions[i] = new Q.MultipleChoiceQuestion({
					question: new Q.ImageText({
						label: new Q.UI.WrappableText({label: "Did you " + bodyActivities[i] + "?"}),
						fill: null,
					}), 
					choices: [
						new Q.ImageText({
							label: new Q.UI.WrappableText({label: "Yes"}),
							isSelectable: true,
							fill: null,
						}), 
						new Q.ImageText({
							label: new Q.UI.WrappableText({label: "No"}),
							isSelectable: true,
							fill: null,
						}), 
					],
				});
	}

	var form = new Q.Form(
		{
			content: bodyQuestions,
			context: stage,
			func: "onquestioncompletion_amar",
		}
	);
	
	if(Q.game.player.keys.length == 0) {
		setTimeout(function(){
			Q.stage(Q.STAGE_LEVEL_DIALOG).insert(form);
		}, 1000);		
	}
});


Q.scene("health_1_HealthCenter", function(stage) {
	console.log("HealthCenter");
	stage.stock_name = "HealthCenter";

	stage.insert(new Q.Repeater({ sheet: "tiles", frame:229, speedX: 1, speedY: 1 }));
	stage.add("viewport").centerOn(400, 300);
	Q.stageTMX("healthcenter.tmx", stage);


	// Map Exit Door
	var exit_door = new Q.Door({width:96, height: 8, h: 16, w: 96, x: 400, y: 590});
	stage.insert(exit_door);

	setTimeout(function(){
		Q.stageScene("LevelFinished", Q.STAGE_LEVEL_NAVIGATION, {label: "Done"});
		stage.pause();
	}, 500);
});


