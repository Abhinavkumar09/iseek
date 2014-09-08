console.log("loaded health element");

Q.scene("health_1",function(stage) {
	stage.name = "health_1";
	Q.stageTMX("VirtualWorld.tmx", stage);

//	Q.audio.stop();
//	Q.audio.play("Tavern.wav", {loop: true});

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
	
	Sahiya.collision = function(col) {
		if(Q.game.player.keys.length >= 3){ // assumed 'relationship' key attained at the end
			var i = 0;
			while(Q("Building", Q.STAGE_LEVEL_PRIMARY).at(i) != null) {
				b = Q("Building").at(i);
				if(b.p.name == "HealthCenter"){
					if(!b.p.isInteractable){
						b.setInteractable(true);
						this.p.labels = [
							"So now you know what is important",
							"for good health - a sound mind,",
							"a healthy body and amiable relationship", 
							"with those around you!",
							"Now, you can enter the healthcenter"
						];		
					}					
				}
				i += 1;
			}
			Sahiya.quote(Sahiya.p.labels);		
		}
		else if(Q.game.player.keys.length >= 2) { // assumed 'mind' key is attained second
			this.p.labels = [
				"Mira, now you have the 'mind' and 'body' keys",
				"but again, that is not enough. A sound mind",
				"and a health body only flourish when you have",
				"good relations with your friends and family.", 
				"Look around for the 'relationship' key."
			];
			Anthony.info({duration:5, showOnMiniMap: true});		

			Anthony.off("hit", Anthony, "collision");
			Anthony.collision = function(col) {
				if(Q.game.player.keys.length >= 3) {
					Anthony.p.labels = [
						"Congrats Mira! You now have the 'relationship' key."				
					];
					Anthony.quote(Anthony.p.labels);
				} else if(Q.game.player.keys.length >= 2){
					Anthony.p.labels = [
							"Hi Mira. Let me check how strong your",
							"relations are with your friends and family",
							" ",
							"You can then have the 'relationship' key"
					];
					// Anthony.quote({labels:Anthony.p.labels});
					
					var relationshipQuestions = ["Who is supportive in your life?", "Who makes your life harder?"];
					var relationshipSurvey = Array(relationshipQuestions.length);
					for(i = 0; i < relationshipSurvey.length; i++){
						relationshipSurvey[i] = new Q.MultipleChoiceQuestion({
									question: new Q.ImageText({
										label: new Q.UI.Text({label: relationshipQuestions[i], type: Q.SPRITE_NONE, }),
										fill: null,
									}), 
									choices: [
										new Q.ImageText({
											label: new Q.UI.Text({label: "Father", type: Q.SPRITE_NONE}),
											isSelectable: true,
											fill: null,
										}), 
										new Q.ImageText({
											label: new Q.UI.Text({label: "Mother", type: Q.SPRITE_NONE}),
											isSelectable: true,
											fill: null,
										}), 
										new Q.ImageText({
											label: new Q.UI.Text({label: "Brother", type: Q.SPRITE_NONE}),
											isSelectable: true,
											fill: null,
										}), 
										new Q.ImageText({
											label: new Q.UI.Text({label: "Sister", type: Q.SPRITE_NONE}),
											isSelectable: true,
											fill: null,
										}), 
									],
								})
					}

					form = new Q.Form(
						{
							content: relationshipSurvey,
							context: Anthony,
							func: "onquestioncompletion",
							x: 900,
							y: 900,
						}
					);
	
					stage.insert(form);
				}
				else if(Q.game.player.keys.length < 2)
					Anthony.quote(["Hi"]);
			};
			Anthony.on("hit", Anthony, "collision");
		}
		else if(Q.game.player.keys.length >= 1) { // assumed 'body' key is attained first
			this.p.labels = [
				"Mira, now you have the 'body' key but ",
				"that is not enough for all round good health.",
				"A healthy body is boosted by a sound mind.",
				"Look around for the 'mind' key."
			];		
			Akbar.info({duration:5, showOnMiniMap: true});		

			Akbar.off("hit", Akbar, "collision");
			Akbar.collision = function(col) {
				if(Q.game.player.keys.length >= 2) {
					Akbar.p.labels = [
						"Congrats Mira! You now have the 'mind' key."				
					];
					Akbar.quote(Akbar.p.labels);
				} else if(Q.game.player.keys.length >= 1) {
					Akbar.p.labels = [
						"Hi Mira. Answer these questions in",
						"order to get the 'mind' key"				
					];
					// Akbar.quote(Akbar.p.labels);

					var mindQuestion = new Q.MultipleChoiceQuestion({
											question: new Q.ImageText({
												label: new Q.UI.Text({label: "What time of the day are you \nmost happy ?", type: Q.SPRITE_NONE, }),
												fill: null,
											}), 
											choices: [
												new Q.ImageText({
													label: new Q.UI.Text({label: "Morning", type: Q.SPRITE_NONE}),
													isSelectable: true,
													fill: null,
												}), 
												new Q.ImageText({
													label: new Q.UI.Text({label: "Evening", type: Q.SPRITE_NONE}),
													isSelectable: true,
													fill: null,
												}), 
												new Q.ImageText({
													label: new Q.UI.Text({label: "Night", type: Q.SPRITE_NONE}),
													isSelectable: true,
													fill: null,
												}), 
											],
										})

					var form = new Q.Form(
						{
							content: [mindQuestion],
							context: Akbar,
							func: "onquestioncompletion",
							x: 800,
							y: 700,
						}
					);

					stage.insert(form);
				}
				else if(Q.game.player.keys.length < 1)
					Akbar.quote(["Hi"]);
			};
			Akbar.on("hit", Akbar, "collision");
			Sahiya.quote(Sahiya.p.labels);
		}
		else{
			this.p.labels = [
				"Hi Mira! The health center is closed as we have", 
				"lost all the keys. People have taken the keys", 
				"for their well being and have not returned them.", 
				"Look around for the healthiest persons in the",
				"community and get the keys from them."
			];
			Amar.info({duration:5, showOnMiniMap: true});		

			Amar.off("hit", Amar, "collision");
			Amar.collision = function(col) {
				if(Q.game.player.keys.length >= 1) {
					Amar.p.labels = [
						"Congrats Mira! You now have the 'body' key."
					];
				}
				else if(Q.game.player.keys.length < 1)
					Amar.p.labels = [
					"नमस्ते Mira. In order to get the 'body' key, you need to ",
					"complete certain activities.",
					" ",
					"Go home and complete as many of the 'body'",
					"activities as you can"
					];


				Amar.quote(Amar.p.labels);
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
			Amar.on("hit", Amar, "collision");
			Sahiya.quote(Sahiya.p.labels);
		}		
	};
	Sahiya.on("hit", Sahiya, "collision");

	var Amar = new Q.Person({asset: "People/pranav.png", x:1000, y:600, isInteractable:true, name:"Amar"});
	stage.insert(Amar);

	var Akbar = new Q.Person({asset: "People/pranav.png", x:800, y:700, isInteractable:true, name:"Akbar"});
	stage.insert(Akbar);
	
	Akbar.onquestioncompletion = function () {
		console.log("added mind key");
		Q.game.player.keys.push("mind");
		Mira.resetKeyContainer();
	};

	var Anthony = new Q.Person({asset: "People/pranav.png", x:900, y:900, isInteractable:true, name:"Anthony"});
	stage.insert(Anthony);
	
	Anthony.onquestioncompletion = function () {
		console.log("added relationship key");
		Q.game.player.keys.push("relationship");
		Mira.resetKeyContainer();
		Sahiya.info({duration:5, showOnMiniMap:true});		
	};

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
		console.log("added body key");
		Q.game.player.keys.push("body");
		Mira.resetKeyContainer();
	};

	var bodyActivities = ["eat nutritional food", "take supplements", "keep up hygiene", "rest", "do physical activity", "maintain proper urination \nsanitation"];
	var bodyQuestions = Array(bodyActivities.length);
	for(i = 0; i < bodyQuestions.length; i++){
		bodyQuestions[i] = new Q.MultipleChoiceQuestion({
					question: new Q.ImageText({
						label: new Q.UI.Text({label: "Did you " + bodyActivities[i] + " ?", type: Q.SPRITE_NONE, }),
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
				})
	}

	form = new Q.Form(
		{
			content: bodyQuestions,
			context: Mira,
			button_type: Q.ControlButtons.NEXT,
			func: "onquestioncompletion",
		}
	);
	
	Mira.gotonext = function (f) {
		stage.insert(f.p.next);
	};

	
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


