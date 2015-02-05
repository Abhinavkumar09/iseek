console.log("loaded Market Research Classroom element");

Q.scene("market_research_1",function(stage) {
	stage.name = "market_research_1";

	stage.desc_card = new Q.StageInfoCard({
		description: new Q.ImageText({
			label: new Q.UI.WrappableText({label: "Hi! TODO: Go to the classroom and fill in the answers"}),
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
	player.addMaterialContainer();
	stage.add("viewport").follow(player);

	var i = 0;
	while(Q("Building", Q.STAGE_LEVEL_PRIMARY).at(i) != null) {
		b = Q("Building").at(i);
		b.setInteractable(stage.options.element.interactability[b.p.name]);
		b.p.nextScene = stage.name + "_" + b.p.name;
		i += 1;
	}
});


Q.scene("market_research_1_House", function(stage) {
	stage.stock_name = "House";
	stage.acceptable_materials = [];

	stage.insert(new Q.Repeater({ sheet: "tiles", frame:229, speedX: 1, speedY: 1 }));
	stage.add("viewport").centerOn(400, 300);
	Q.stageTMX("house.tmx", stage);


	// Map Exit Door
	var exit_door = new Q.Door({width:96, height: 8, h: 16, w: 96, x: 400, y: 590});
	stage.insert(exit_door);



	// Mira
	var player = Q("Player").first();
	player.addMaterialContainer("Player");
	stage.player = player;

});

 /*
  Class room scence
  */
Q.scene("market_research_1_School",function(stage) {

	stage.stock_name = "School";
	stage.acceptable_materials = [];

	stage.insert(new Q.Repeater({ sheet: "tiles", frame:229, speedX: 1, speedY: 1 }));
	stage.add("viewport").centerOn(400, 300);
	Q.stageTMX("school.tmx", stage);
	
	game.AUDIO.stop(); //stop the game music for the video

	// Map Exit Door
	var exit_door = new Q.Door({width:96, height: 8, h: 16, w: 96, x: 400, y: 590});
	stage.insert(exit_door);
	
	//insert Mira into the scene 
	var player = new Q.Player({sheet: "player_sheet", sprite: 'person_animation', frame:1, x: 100, y: 450, name:"Player"});
	stage.insert(player);
	stage.player = player;
	
	//insert Teacher into the scene
	var Teacher = new Q.Person({sheet: "person_1_sheet", frame: 1, x:300, y:225, isInteractable:true, label: "", name:"Teacher"});
	stage.insert(Teacher);
	Teacher.bottom_quote("We will begin the lecture with a video", 0, 5);
	
	
	//lecture card 
	var lectureCard = new Q.Form({
	content: [
		new Q.Video({
				filename: '/site_media/assets/new_game/video/output1.ogg',
			}),				
		new Q.MultipleChoiceQuestion({
			question: new Q.ImageText({
				label: new Q.UI.Text({
					label: "Why did vendor not sell?", 
					type: Q.SPRITE_NONE, 
				}),
					fill: null,
			}), 
			choices: [
				new Q.ImageText({
					label: new Q.UI.Text({label: "Seller didn't understand customer's needs.", type: Q.SPRITE_NONE}),
					isSelectable: true,
						fill: null,
					}), 
				new Q.ImageText({
					label: new Q.UI.Text({label: "Seller brought too many baskets to market.", type: Q.SPRITE_NONE}),
					isSelectable: true,
					fill: null,
				}), 
			],			 
		}),	

	],
	context: stage,
	func: "onquestioncompletion",
	});
	
	setTimeout(function(){Q.stage(Q.STAGE_LEVEL_DIALOG).insert(lectureCard);}, 4000);

	stage.onquestioncompletion = function () {
		//Mira picked the right answer
		if(lectureCard.p.content[1].p.choices[0].p.isSelected == true){
			Teacher.bottom_quote("That's the correct answer, well done!", 0, 5);
		}
		else{
			Teacher.bottom_quote("The seller didn't understand customer's needs that's why the vendor could not sell ", 0, 5);	
		}

		var lectureCard2 = new Q.Form({
		content: [
			new Q.Video({
					filename: '/site_media/assets/new_game/video/output1.ogg',
				}),				
			new Q.MultipleChoiceQuestion({
				question: new Q.ImageText({
					label: new Q.UI.Text({
						label: "Did vendor perform better this time?", 
						type: Q.SPRITE_NONE, 
					}),
						fill: null,
				}), 
				choices: [
					new Q.ImageText({
						label: new Q.UI.Text({label: "Yes, he sold two of baskets", type: Q.SPRITE_NONE}),	
						isSelectable: true,
							fill: null,
						}), 
					new Q.ImageText({
						label: new Q.UI.Text({label: "No, he was left with 3 unsold baskets", type: Q.SPRITE_NONE}),	
						isSelectable: true,
						fill: null,
					}), 
				],			 
			}),	
	
		],
		context: stage,
		func: "onquestioncompletion2",
		});
		
		setTimeout(function(){Q.stage(Q.STAGE_LEVEL_DIALOG).insert(lectureCard2);}, 4000);
		
		stage.onquestioncompletion2 = function () {
			 Teacher.bottom_quote("both answers are correct. “This time the seller learned something about the needs of the customers and next time he can make more of the two baskets that sold; however, he could have learned about his customer’s preferences by simply looking at what other sellers offer and asking what his customer’s needs are.", 0, 12);
			setTimeout(function(){
				Q.stageScene("LevelFinished", Q.STAGE_LEVEL_NAVIGATION, {label: "Done"});
				stage.pause();
				}, 500);	

		//Teacher.bottom_quote("Go to market and talk to sellers", 0, 5);
		};
		
	};

	stage.oncompletion = function() {
		setTimeout(function(){
			Q.stageScene("LevelFinished", Q.STAGE_LEVEL_NAVIGATION, {label: "Done"});
			stage.pause();
		}, 500);		
	};

});

Q.scene("market_research_1_Market", function(stage) {
	stage.stock_name = "Market";
	stage.acceptable_materials = [];

	stage.insert(new Q.Repeater({ sheet: "tiles", frame:229, speedX: 1, speedY: 1 }));
	stage.add("viewport").centerOn(400, 300);
	Q.stageTMX("market.tmx", stage);


	// Map Exit Door
	var exit_door = new Q.Door({width:96, height: 8, h: 16, w: 96, x: 400, y: 590});
	stage.insert(exit_door);



	// Mira
	var player = Q("Player").first();
	player.addMaterialContainer("Player");
	stage.player = player;

});


