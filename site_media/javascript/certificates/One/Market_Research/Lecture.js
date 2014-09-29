Q.scene("market_research_1",function(stage) {
	stage.name = "market_research_1";

	stage.desc_card = new Q.StageInfoCard({
		description: new Q.ImageText({
			label: new Q.UI.WrappableText({label: "Hi! TODO: Fill the details of the element here"}),
		}),
		context: stage,
	});

	var guru = Q("GuruIcon", Q.STAGE_LEVEL_NAVIGATION).first();
	guru.trigger("register", stage.desc_card);

	Q.stageTMX(game.TMX.VirtualWorld, stage);
	stage.insert(new Q.Repeater({ sheet: "tiles", frame:229, speedX: 1, speedY: 1 }));
	game.AUDIO.stop_n_play(game.AUDIO.RESOURCES.VILLAGE);

	var player = Q("Player").first();
	stage.add("viewport").follow(player);
	player.addMaterialContainer();

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



Q.scene("market_research_1_School",function(stage) {
	stage.insert(new Q.Repeater({ sheet: "tiles", frame:229, speedX: 1, speedY: 1 }));
	stage.add("viewport").centerOn(400, 300);
	Q.stageTMX("school.tmx", stage);


	game.AUDIO.stop();

	// Map Exit Door
	var exit_door = new Q.Door({width:175, height: 1, h: 1, w: 175, x: 420, y: 590});
	stage.insert(exit_door);


	// Mira
	var player = new Q.Player({sheet: "player_sheet", sprite: 'person_animation', frame:1, x: 100, y: 450, name:"Player"});
	stage.insert(player);
	stage.player = player;


	stage.onquestioncompletion = function () {
		Q.stageScene("LevelFinished", Q.STAGE_LEVEL_NAVIGATION, {label: "Done"});
		stage.pause();
	};

	var lecture = new Q.Form({
		content: [
			new Q.Video({
				filename: '/site_media/assets/new_game/video/output1.ogg',
			}),
			new Q.MultipleChoiceQuestion({
				question: new Q.ImageText({
					label: new Q.UI.Text({
						label: "Why do you think the vendor was not able to make a sale?", 
						type: Q.SPRITE_NONE, 
					}),
					fill: null,
				}), 
				choices: [
					new Q.ImageText({
						label: new Q.UI.Text({label: "The seller didn't understand customer needs", type: Q.SPRITE_NONE}),
						isSelectable: true,
						fill: null,
					}), 
					new Q.ImageText({
						label: new Q.UI.Text({label: "The seller brought too many baskets to the market", type: Q.SPRITE_NONE}),
						isSelectable: true,
						fill: null,
					}), 
				],
			}),
			new Q.MultipleChoiceQuestion({
				question: new Q.ImageText({
					label: new Q.UI.Text({
						label: "Did the seller perform better this time?", 
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
						label: new Q.UI.Text({label: "No, he was left with three unsold baskets", type: Q.SPRITE_NONE}),
						isSelectable: true,
						fill: null,
					}), 
				],
			}),
		],
		context: stage,
		func: "onquestioncompletion",
	});

	setTimeout(function(){
		stage.insert(lecture);
	}, 1000);		
});




