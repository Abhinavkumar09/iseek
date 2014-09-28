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
	
	player.addMember = function(member) {
		stage.insert(member);
	}

	var Nurse = new Q.Person({sheet: "nurse_sheet", frame:1, x:300, y:225, isInteractable:true, 
								name: "Nurse", sprite: "person_animation", duration: 7, speed: 100});
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

	Nurse.step = function(dt) {
		if(this.p.collided){
			// this.p.collided = false;
			this.p.label = "";
			if(this.p.y >= exit_door.p.y - 100) {
				if(this.p.x >= exit_door.p.x){
					this.p.vx = 0;
					this.p.vy = this.p.speed;
					this.play("run_down");
					setTimeout(function(){Nurse.destroy();}, 500);				// Nurse leaves
					// console.log("adding member_1");
					// setTimeout(function(){stage.insert(member_1);}, 500);
			    	// setTimeout(function(){memberAdder.p.playerAvailable = true;}, 500);
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

	// var emotion_assets = [['People/meera_angry3.png', 'People/meera_dizzyspinning3.png', 'People/meera_cry6.png'],
	// 					  ['People/meera_sick1.png', 'People/meera_cry6.png'],
	// 					  ['People/meera_cry6.png', 'People/meera_angry3.png']];
	// var emotion_labels = [["Angry", "Tired", "Sad"],
	// 					  ["Feverish", "Sick"],
	// 					  ["Sad", "Lonely"]];

	// var incorrect_answers = [[1, 6, 7, 8], [3, 7, 8], [0, 1, 2, 6, 7, 8]];

	// var png_cards = ["CardObjects/fruitbasket.png", "CardObjects/handwashanimation_sideleft.png", "CardObjects/vitamincard.png", 
	// 				"CardObjects/singsongcard.png", "pranav.png", "CardObjects/sleepposter.png",
	// 				"CardObjects/cutnailscard.png", "CardObjects/mosquitospraycard.png", "CardObjects/padscard.png"
	// 				];
	// var activity_description = ["Eat a fruit",  "Wash your hands", "Take your vitamins", 
	// 							"Sing a song or dance", "Talk to a friend", "Take a nap",
	// 							"Cut your nails", "Buy a mosquito repellant", "Buy sanitary pads"];
	// var activity_names = ["Fruits",  "Wash hands", "Vitamins", "Sing", "Friend", "Rest", "Cut nails", "Insect Spray", "Pads"];

	
	// var myTiles = Array(png_cards.length);
	// for(i = 0; i < myTiles.length; i++) {
	// 	myTiles[i] = new Q.Tile({
	// 					image: new Q.Sprite({asset: png_cards[i]}),
	// 					label: new Q.UI.Text({label: activity_names[i]}),
	// 					disabled: true,
	// 				});
	// }

	// var activities_card = Array(3);
	// for(j = 0; j < activities_card.length; j++){
	// 	activities_card[j] = new Q.TileCard({tiles: myTiles, grid: Q.TileCard.GRID_3_3,});

	// 	activities_card[j].done = function() {
	// 		var count_selected = 0;
	// 		for(i = 0; i < this.p.tiles.length; i++) {
	// 			if(this.p.tiles[i].p.isSelected)
	// 				count_selected++;
	// 		}
	// 		this.destroy();
	// 		if(count_selected != 3) {
	// 			console.log("count_selected " + count_selected);
	// 			player.bottom_quote("Remember, we need to select EXACTLY 3 activities. Let's try again");
	// 			for(i = 0; i < this.p.tiles.length; i++)
	// 				this.p.tiles[i].p.isSelected = false;
				
	// 			setTimeout(function(){Q.stage(Q.STAGE_LEVEL_DIALOG).insert(activities_card[j]);}, 1000);
	// 		}
	// 		else{
	// 			for(i = 0; i < this.p.tiles.length; i++) 
	// 				console.log(i + " : " + this.p.tiles[i].p.isSelected);
				
	// 			var allCorrect = true;
	// 			for(i = 0; i < incorrect_answers[j].length; i++) {
	// 				if(this.p.tiles[incorrect_answers[j][i]].p.isSelected)
	// 					allCorrect = false;	
	// 			}
	// 			player.bottom_quote("Let us see how your health has improved");
	// 			if(!allCorrect) {
	// 				for(i = 0; i < this.p.tiles.length; i++)
	// 					this.p.tiles[i].p.isSelected = false;
				
	// 				setTimeout(function(){Q.stage(Q.STAGE_LEVEL_DIALOG).insert(activityTryAgainCard);}, 1000);	
	// 			}
	// 			else
	// 				setTimeout(function(){Q.stage(Q.STAGE_LEVEL_DIALOG).insert(activityDoneCard);}, 1000);	
	// 		}
	// 	}
	// }

	// var symptom_cards = Array(activities_card.length);
	// for(i = 0; i < 3; i++) {
 //  		var tiles = Array(3);
	// 	for(j = 0; j < emotion_assets[i].length; j++) {
	// 		tiles[j] = new Q.Tile({
	// 						image: new Q.ImageText({image: new Q.Sprite({asset: emotion_assets[i][j]}), 
	// 												label: new Q.UI.Text({label: emotion_labels[i][j]}),}),
	// 						disabled: true,
	// 					});
	// 	}
			
	// 	symptom_cards[i] = new Q.TileCard({tiles: tiles, grid: Q.TileCard.GRID_3_1});
	
	// 	// symptom_cards[i].done = function() {
	// 	// 	this.p.shown_symptoms = true;
	// 	// 	this.destroy();

	// 	// 	setTimeout(function(){player.bottom_quote("Alright. Let us try to pick THREE activities that could help you");}, 1000);
	// 	// 	setTimeout(function(){Q.stage(Q.STAGE_LEVEL_DIALOG).insert(activities_card[i]);}, 4000);
	// 	// }
 //  	}
	
	var member_1 = new Q.Person({sheet: "person_4_sheet", frame: 1, x: exit_door.p.x, y: exit_door.p.y - 50, 
								   isInteractable: true, sprite: "person_animation", speed: 75, 
								   label: "Hi, I’m feeling angry and sad! Could you please help me feel better?", 
								   // symptoms: symptom_cards[0],
								});
	member_1.add("2d, animation");

	// var member_2 = new Q.Person({sheet: "person_5_sheet", frame: 1, x: exit_door.p.x, y: exit_door.p.y - 50, 
	// 							   isInteractable: true, sprite: "person_animation", speed: 75, 
	// 							   label: "Hi, I’m feeling ill, with a fever. Could you please help me?", 
	// 							   symptoms: symptom_cards[1],
	// 							});
	// member_2.add("2d, animation");

	// var member_3 = new Q.Person({sheet: "person_6_sheet", frame: 1, x: exit_door.p.x, y: exit_door.p.y - 50, 
	// 							   isInteractable: true, sprite: "person_animation", speed: 75, 
	// 							   label: "Hi, my best friend got married and left town. Now I’m lonely. I have nobody to talk to and I am sad. Could you help me please?",
	// 							   symptoms: symptom_cards[2],
	// 							});
	// member_3.add("2d, animation");

	member_1.step = function(dt) {
		if((member_1.p.y < table.p.y + 70)) {
			member_1.p.vx = 0;
			member_1.p.vy = 0;
			member_1.info({duration: 2});
			member_1.trigger('poststep',dt);
		}
	   else {
	   		console.log("running up");
		    member_1.p.vy = -1 * member_1.p.speed;
		    member_1.play("run_up");
	    }
	}

	// member_1.collision = function(col) {
	// 	if(!member_1.p.symptoms.p.shown_symptoms){
	// 			member_1.bottom_quote(member_1.p.label);
	// 			// setTimeout(function(){
	// 			// 	console.log("adding symptoms card");
	// 			// 	Q.stage(Q.STAGE_LEVEL_DIALOG).insert(member_1.p.symptoms);
	// 			// }, 5000);	
	// 		}
	// }
	// member_1.on("hit", member_1, "collision");


	// member_2.step = function(dt) {
	// 	memberStep(member_2);
	// }

	// member_3.step = function(dt) {
	// 	memberStep(member_3);
	// }

	// memberCollision = function(member) {
	// 	console.log("collided");
	// 	if(!member.p.symptoms.p.shown_symptoms){
	// 			member.bottom_quote(member.p.label);
	// 			setTimeout(function(){
	// 				console.log("adding symptoms card");
	// 				Q.stage(Q.STAGE_LEVEL_DIALOG).insert(member.p.symptoms);
	// 			}, 5000);	
	// 		}
	// }

	// // member_1.step = function(dt) {
	// // 	memberCollision(member_1);
	// // }
	// // member_1.on("hit", member_1, "collision");

	// member_2.step = function(dt) {
	// 	memberCollision(member_2);
	// }
	// member_2.on("hit", member_2, "collision");

	// member_3.step = function(dt) {
	// 	memberCollision(member_3);
	// }
	// member_3.on("hit", member_3, "collision");

	// var activityTryAgainCard = new Q.Activity({
	// 						image: new Q.Sprite({asset: "CardObjects/healthkit.png"}),
	// 						name: new Q.ImageText({label: new Q.UI.Text({label: "Your health improves as:"}),}),
	// 						description: new Q.ImageText({label: new Q.UI.Text({label: ""}),}),
	// 						scoreUpto: [Math.random() * 20 + 50, Math.random() * 20 + 50, Math.random() * 20 + 50],
	// 					});

	// activityTryAgainCard.done = function() {
	// 	console.log("We are done");
	// 	this.destroy();
	// 	player.bottom_quote("I think we can do better. Let's try again");	
	// 	setTimeout(function(){
	// 		Q.stage(Q.STAGE_LEVEL_DIALOG).insert(activities_card);
	// 	}, 1000);
	// }

	// var activityDoneCard = new Q.Activity({
	// 						image: new Q.Sprite({asset: "CardObjects/healthkit.png"}),
	// 						name: new Q.ImageText({label: new Q.UI.Text({label: "Your health improves as:"})}),
	// 						description: new Q.ImageText({label: new Q.UI.Text({label: ""})}),
	// 						scoreUpto: [80, 80, 70],
	// 					});

	// activityDoneCard.done = function() {
	// 	this.destroy();
	// 	setTimeout(function(){
	// 		player.bottom_quote("Great! I'm sure doing these activities would make you feel a lot better");
	// 	}, 2000);


	// 	memberAdder.p.present_member++;
	// 	memberAdder.p.playerAvailable = true;

	// 	// if(present_member == members.length){
	// 	// 	setTimeout(function(){
	// 	// 		Q.stageScene("LevelFinished", Q.STAGE_LEVEL_NAVIGATION, {label: "Done"});
	// 	// 		stage.pause();
	// 	// 	}, 5000);
	// 	// }
	// }

	// Q.stage(Q.STAGE_LEVEL_DIALOG).insert(activities_card);	
});

Q.GameObject.extend("BoxThrower",{
  init: function() {
    this.p = {
      launchDelay: 0.75,
      launchRandom: 1,
      launch: 2
    }
  },

  update: function(dt) {
    this.p.launch -= dt;

    if(this.p.launch < 0) {
      this.stage.insert(new Q.Box());
      this.p.launch = this.p.launchDelay + this.p.launchRandom * Math.random();
    }
  }

});
