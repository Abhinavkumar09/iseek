Q.scene("health_3", function(stage) {
	console.log("loaded health 3");
	stage.name = "health_3";
	Q.stageTMX("VirtualWorld.tmx", stage);
	game.AUDIO.stop_n_play(game.AUDIO.RESOURCES.VILLAGE);

	var player = Q("Player").first();
	stage.add("viewport").follow(player);
	player.addMaterialContainer();
	stage.player = player;

	var i = 0;
	while(Q("Building", Q.STAGE_LEVEL_PRIMARY).at(i) != null) {
		b = Q("Building").at(i);
		console.log(b.p.name + ": " +stage.options.element.interactability[b.p.name]);
		b.setInteractable(stage.options.element.interactability[b.p.name]);
		b.p.nextScene = stage.name + "_" + b.p.name;

		if(b.p.name == "HealthCenter")
			b.info({duration: 10, showOnMiniMap: true});
		
		i += 1;
	}
});

Q.scene("health_3_HealthCenter", function(stage) {
	console.log("HealthCenter");
	stage.stock_name = "HealthCenter";
	stage.acceptable_materials = [];

	stage.insert(new Q.Repeater({ sheet: "tiles", frame:229, speedX: 1, speedY: 1 }));
	Q.stageTMX("healthcenter.tmx", stage);

	var exit_door = new Q.Door({width:96, height: 8, h: 16, w: 96, x: 400, y: 590});
	stage.insert(exit_door);

	var table = new Q.Material({asset: 'desk.png', x: 300, y:300, isInteractable: false});
	stage.insert(table);

	var player = Q("Player").first();
	player.add("KeyCarrier");
	stage.add("viewport").follow(player);
	player.p.label = "";
	player.p.available = true;
	player.duration = 2;
	
	var presentMember = 0;

	var Nurse = new Q.Person({sheet: "nurse_sheet", frame:1, x:300, y:225, isInteractable:true, label: "",
								name: "Nurse", sprite: "person_animation", duration: 1, speed: 125});
	stage.insert(Nurse);

	Nurse.info({duration: 4, showOnMiniMap: true});
	Nurse.add("2d, animation");

	if(Q.game.player.keys.length >= 0){  // >=3
		Nurse.p.label = "Hi, I have to be elsewhere today. Can you serve the community on my behalf? Try to help the community members the best you can!";
		Nurse.collision = function(col) {
			this.bottom_quote(this.p.label, 0, 3);
			setTimeout(function(){Nurse.p.collided = true;}, 1000);
		};
		Nurse.on("hit", Nurse, "collision");
	}
	
	Nurse.step = function(dt) {
		if(this.p.collided){
			this.p.label = "";
			if(this.p.y >= exit_door.p.y - 100) {
				if(this.p.x >= exit_door.p.x){
					this.p.vx = 0;
					this.p.vy = this.p.speed;
					this.play("run_down");
					if(this.p.y < exit_door.p.y - 75){
						this.destroy();					// Nurse leaves
						var addMember = members[0];
						setTimeout(function(){
							stage.insert(addMember);	// added first member
							player.p.available = false;
						}, 500);
					}
			    }
			    else{
			    	this.p.vy = 0;
			    	this.p.vx = 1 * this.p.speed;
			    	this.play("run_right");
			    }
		    }

			else if(this.p.x <= table.p.x - 50) {
			 	this.p.vx = 0;
		    	this.p.vy = this.p.speed;
		    	this.play("run_down");
		    }

		    else {
			    this.p.vx = -1 * this.p.speed;
			    this.play("run_left");
			}
		}
	}

	var emotion_assets = [['People/meera_angry3.png', 'People/meera_dizzyspinning3.png', 'People/meera_cry6.png'],
						  ['People/meera_sick1.png', 'People/meera_cry6.png'],
						  ['People/meera_cry6.png', 'People/meera_angry3.png']];
	var emotion_labels = [["Angry", "Tired", "Sad"],
						  ["Feverish", "Sick"],
						  ["Sad", "Lonely"]];
	var symptoms_grid = [Q.TileCard.GRID_3_1, Q.TileCard.GRID_2_1, Q.TileCard.GRID_2_1];

	var incorrect_answers = [[1, 6, 7, 8], [3, 7, 8], [0, 1, 2, 6, 7, 8]];
	var healthImprovement = [[75, 67, 70], [70, 80, 60], [70, 70, 80]];

	var png_cards = ["CardObjects/fruitbasket.png", "CardObjects/handwashanimation_sideleft.png", "CardObjects/vitamincard.png", 
					"CardObjects/singsongcard.png", "pranav.png", "CardObjects/sleepposter.png",
					"CardObjects/cutnailscard.png", "CardObjects/mosquitospraycard.png", "CardObjects/padscard.png"
					];
	var activity_description = ["Eat a fruit",  "Wash your hands", "Take your vitamins", 
								"Sing a song or dance", "Talk to a friend", "Take a nap",
								"Cut your nails", "Buy a mosquito repellant", "Buy sanitary pads"];
	var activity_names = ["Fruits",  "Wash hands", "Vitamins", "Sing", "Friend", "Rest", "Cut nails", "Insect Spray", "Pads"];

	
	var myTiles = Array(png_cards.length);
	for(i = 0; i < myTiles.length; i++) {
		myTiles[i] = new Q.Tile({
						image: new Q.Sprite({asset: png_cards[i]}),
						label: new Q.UI.Text({label: activity_names[i]}),
						disabled: true,
					});
	}

	var symptom_cards = Array(3);
	var activityDoneCards = Array(3);
	for(i = 0; i < 3; i++) {
  		var tiles = Array(emotion_assets[i].length);
		for(j = 0; j < tiles.length; j++) {
			tiles[j] = new Q.Tile({
							image: new Q.ImageText({image: new Q.Sprite({asset: emotion_assets[i][j]}), 
													label: new Q.UI.Text({label: emotion_labels[i][j]}),}),
							disabled: true,
						});
		}
		
		var improvement = healthImprovement[i];
		activityDoneCards[i] = new Q.Activity({
							image: new Q.Sprite({asset: "CardObjects/healthkit.png"}),
							name: new Q.ImageText({label: new Q.UI.Text({label: "Your health improves as:"})}),
							description: new Q.ImageText({label: new Q.UI.Text({label: ""})}),
							scoreUpto: improvement,
						});
		
		activityDoneCards[i].done = function() {
			this.destroy();
			setTimeout(function(){player.p.available = true;}, 300);

			if(presentMember == members.length -1 ){
				setTimeout(function(){
					Q.stageScene("LevelFinished", Q.STAGE_LEVEL_NAVIGATION, {label: "Done"});
					stage.pause();
				}, 5000);
			}
		}

		symptom_cards[i] = new Q.TileCard({tiles: tiles, grid: symptoms_grid[i]});
		symptom_cards[i].p.incorrectAnswers = incorrect_answers[i];
		symptom_cards[i].p.activityDoneCard = activityDoneCards[i];

		symptom_cards[i].done = function() {
			this.destroy();
			setTimeout(function(){player.bottom_quote("Alright. Let us try to pick THREE activities that could help you", 0, 3);}, 1000);

			var activity_card = new Q.TileCard({tiles: myTiles, grid: Q.TileCard.GRID_3_3, });
			activity_card.p.incorrectAnswers = this.p.incorrectAnswers;
			
			player.p.activity_card = activity_card;
			var activityDoneCard = this.p.activityDoneCard;

			activity_card.done = function() {
				var count_selected = 0;
				for(j = 0; j < this.p.tiles.length; j++) {
					if(this.p.tiles[j].p.isSelected)
						count_selected++;
				}
				this.destroy();
				if(count_selected != 3) {
					player.bottom_quote("Remember, we need to select EXACTLY 3 activities. Let's try again", 0, 2);
					for(j = 0; j < this.p.tiles.length; j++)
						this.p.tiles[j].p.isSelected = false;
					
					setTimeout(function(){Q.stage(Q.STAGE_LEVEL_DIALOG).insert(activity_card);}, 1000);
				}
				else{
					var allCorrect = true;
					for(j = 0; j < this.p.incorrectAnswers.length; j++) {
						if(this.p.tiles[this.p.incorrectAnswers[j]].p.isSelected)
							allCorrect = false;	
					}

					for(j = 0; j < this.p.tiles.length; j++)
						this.p.tiles[j].p.isSelected = false;

					player.bottom_quote("Let us see how your health has improved", 0, 2);
					if(!allCorrect) {
						for(j = 0; j < this.p.tiles.length; j++)
							this.p.tiles[j].p.isSelected = false;
					
						setTimeout(function(){Q.stage(Q.STAGE_LEVEL_DIALOG).insert(activityTryAgainCard);}, 1000);	
					}
					else{
						console.log(activityDoneCard.p.scoreUpto[0] + " : " + activityDoneCard.p.scoreUpto[1] + " : " + activityDoneCard.p.scoreUpto[2]);
						setTimeout(function(){Q.stage(Q.STAGE_LEVEL_DIALOG).insert(activityDoneCard);}, 1000);	
					}
				}
			}


			setTimeout(function(){Q.stage(Q.STAGE_LEVEL_DIALOG).insert(activity_card);}, 4000);
		}
  	}
	
	var members = Array(3);
	members[0] = new Q.Person({sheet: "person_4_sheet", frame: 1, x: exit_door.p.x, y: exit_door.p.y - 50, 
								   isInteractable: true, sprite: "person_animation", speed: 100, duration: 1,
								   label: "Hi, I’m feeling angry and sad! Could you please help me feel better?", 
								   symptoms: symptom_cards[0], 
								});
	members[0].add("2d, animation");

	members[1] = new Q.Person({sheet: "person_5_sheet", frame: 1, x: exit_door.p.x, y: exit_door.p.y - 50, 
								   isInteractable: true, sprite: "person_animation", speed: 100, duration: 1,
								   label: "Hi, I’m feeling ill, with a fever. Could you please help me?", 
								   symptoms: symptom_cards[1],
								});
	members[1].add("2d, animation");

	members[2] = new Q.Person({sheet: "person_6_sheet", frame: 1, x: exit_door.p.x, y: exit_door.p.y - 50, 
								   isInteractable: true, sprite: "person_animation", speed: 100, duration: 1,
								   label: "Hi, my best friend got married and left town. Now I’m lonely. I have nobody to talk to and I am sad. Could you help me please?",
								   symptoms: symptom_cards[2],
								});
	members[2].add("2d, animation");

	for(i = 0; i < members.length; i++) {
		if(i != members.length - 1)
			members[i].p.nextMember = members[i+1];

		members[i].step = function(dt) {
			if(!player.p.available){
				if((this.p.y < table.p.y + 70)) {
					this.p.vx = 0;
					this.p.vy = 0;
					if(!this.p.symptoms.p.shown_symptoms)
						this.info({duration: 1});
					this.trigger('poststep',dt);
				}
			   else {
			   		this.p.vy = -1 * this.p.speed;
				    this.play("run_up");
			    }
			}
			else{
				this.bottom_quote("Great! Thank you so much. I will definitely try these activities.", 0, 1);
			    this.p.vy = this.p.speed;
			    this.play("run_down");

			    if(this.p.y > exit_door.p.y - 50){
			    	this.destroy();
			    	presentMember++;
			    	if(this.p.nextMember){
			    		var enterMember = this.p.nextMember;
				    	setTimeout(function(){
				    		stage.insert(enterMember);
				    		player.p.available = false;
				    	}, 1000);
				    }
			    }
			}
		}

		members[i].collision = function(col) {
			if(!this.p.symptoms.p.shown_symptoms){
					this.bottom_quote(this.p.label, 0, 3);
					this.p.label = "";
					this.p.symptoms.p.shown_symptoms = true;
					var symptomsCard = this.p.symptoms;
					setTimeout(function(){
						Q.stage(Q.STAGE_LEVEL_DIALOG).insert(symptomsCard);
					}, 2000);	
				}
		}
		members[i].on("hit", members[i], "collision");
	}

	var activityTryAgainCard = new Q.Activity({
							image: new Q.Sprite({asset: "CardObjects/healthkit.png"}),
							name: new Q.ImageText({label: new Q.UI.Text({label: "Your health improves as:"}),}),
							description: new Q.ImageText({label: new Q.UI.Text({label: ""}),}),
							scoreUpto: [Math.random() * 20 + 50, Math.random() * 20 + 50, Math.random() * 20 + 50],
						});

	activityTryAgainCard.done = function() {
		this.destroy();
		player.bottom_quote("I think we can do better. Let's try again", 0, 3);	
		setTimeout(function(){
			Q.stage(Q.STAGE_LEVEL_DIALOG).insert(player.p.activity_card);
		}, 1000);
	}
});