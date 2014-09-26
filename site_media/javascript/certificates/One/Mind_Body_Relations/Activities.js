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
	
	var Nurse = new Q.Person({sheet: "nurse_sheet", frame:1, x:300, y:225, isInteractable:true, name: "Nurse", sprite: "person_animation", duration: 7, speed: 75});
	stage.insert(Nurse);

	Nurse.info({duration: Nurse.p.duration, showOnMiniMap: true});
	Nurse.add("2d, animation");

	if(Q.game.player.keys.length >= 0){ // >=3 
		Nurse.p.label = "Hi, I have to be elsewhere today. Can you serve the community on my behalf? Try to help the community members the best you can!";
		Nurse.collision = function(col) {
			this.bottom_quote(this.p.label);
			this.p.collided = true;
		};
		Nurse.on("hit", Nurse, "collision");
	}
	else
		Nurse.p.label = "You need to learn about the basics of health before you can play this level";
	
	player.p.available = true;
	player.p.label = "";

	Nurse.step = function(dt) {
		if(this.p.collided){
			Nurse.p.time_spent += dt;
			if(Nurse.p.time_spent > 5){
				Nurse.p.label = "";
				Nurse.leave();
			}
		}
	}

	Nurse.leave = function(){
		if(this.p.y >= exit_door.p.y - 100) {
			if(this.p.x >= exit_door.p.x){
				this.p.vx = 0;
				this.p.vy = this.p.speed;
				this.play("run_down");
				setTimeout(function(){Nurse.destroy();}, 500);				// Nurse leaves
		    	player.p.available = true;
		    	setTimeout(function(){player.add_member();}, 1000);	 // member added
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
	Nurse.on("hit", Nurse, "collision");
	
	var member = new Q.Person({sheet: "person_4_sheet", frame: 1, x: exit_door.p.x, y: exit_door.p.y - 50, 
				isInteractable: true, sprite: "person_animation", speed: 75, label:""});
	      	

  	member.add("2d, animation");
  			
	member.step = function(dt) {
		if((this.p.y < table.p.y + 70)) {
			this.p.vx = 0;
			this.p.vy = 0;
			
			this.trigger('poststep',dt);
		}
	   else {
		    this.p.vy = -1 * this.p.speed;
		    this.play("run_up");
	    }
	}

	member.collision = function(col) {
		if(!player.p.available){
			if(!this.p.shown_symptoms){
				this.p.label = "Hi, I am not feeling well. Here are the symptoms I have. Could you please suggest me ways to get better?";
				setTimeout(function(){member.add_symptoms_card();}, 5000);	

			}
		}
		this.bottom_quote(this.p.label);
	}
	member.on("hit", member, "collision");
	
	player.add_member = function() {
		console.log("Adding member ");
		if(player.p.available) { 
			setTimeout(function(){stage.insert(member);}, 3000);
			player.p.available = false;
		}
	}

	member.add_symptoms_card = function() {
		console.log("adding symptoms card");
		this.p.label = "";
		player.p.label = "";
		if(!player.p.available){
			var tiles = Array(4);
			var emotion_assets = ['People/meera_angry3.png', 'People/meera_dizzyspinning3.png', 'People/meera_sick1.png', 'People/meera_cry6.png'];
			var emotion_labels = ["Angry", "Dizzy", "Sick", "Crying"];
			for(i = 0; i < 4; i++) {
				tiles[i] = new Q.Tile({
									image: new Q.ImageText({image: new Q.Sprite({asset: emotion_assets[i]}), label: new Q.UI.Text({label: emotion_labels[i]})}),
									disabled: true,
								});
			}
			
			var symptom_card = new Q.TileCard({tiles: tiles, grid: Q.TileCard.GRID_2_2, context: member});
			
			symptom_card.done = function() {
				member.p.shown_symptoms = true;
				this.destroy();

				setTimeout(function(){player.bottom_quote("Let me show you some activities that could help you");}, 1000);
				setTimeout(function(){Q.stage(Q.STAGE_LEVEL_DIALOG).insert(tcard);}, 4000);
			},

			console.log("able to insert card");
			Q.stage(Q.STAGE_LEVEL_DIALOG).insert(symptom_card);
		}
	}

	var png_cards = ["CardObjects/fruitbasket.png", "CardObjects/handwashanimation_sideleft.png", "CardObjects/vitamincard.png", 
					"CardObjects/singsongcard.png", "CardObjects/praycard.png", "CardObjects/sleepposter.png"];
	var activity_names = ["Eat a fruit",  "Wash your hands", "Take your vitamins", "Sing a song or dance", "Take a moment to pray", "Take a nap"];

	// <mind, body, relations> improvement due to activity
	var health_improvement = [[50, 60, 35], [35, 60, 40], [50, 70, 50], [80, 60, 70], [70, 40, 50], [80, 80, 60]]; 
	
	var myTiles = Array(9);
	for(i = 0; i < 9; i++) {
		myTiles[i] = new Q.Tile({
						image: new Q.Sprite({asset: png_cards[i]}),
						disabled: false,
						action_card: new Q.Activity({
											image: new Q.ImageText({image: new Q.Sprite({asset: png_cards[i]})}),
											name: new Q.ImageText({label: new Q.UI.Text({label: activity_names[i]})}),
											description: new Q.ImageText({label: new Q.UI.Text({label: ""})}),
											scoreUpto: health_improvement[i],
										}),
					});
	}

	var tcard = new Q.TileCard({tiles: myTiles, grid: Q.TileCard.GRID_3_2,});
	
	// Q.stage(Q.STAGE_LEVEL_DIALOG).insert(tcard);
});
