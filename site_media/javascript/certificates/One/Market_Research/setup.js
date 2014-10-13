Q.scene("market_research_0_setup",function(stage) {
	stage.name = "setup";

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
	stage.add("viewport").follow(player);

	stage.oncompletion = function() {
		setTimeout(function(){
			Q.stageScene("LevelFinished", Q.STAGE_LEVEL_NAVIGATION, {label: "Done"});
			stage.pause();
		}, 500);		
	};

	var card = new Q.BusinessCardForm({person: game.player, SHG: game.SHG, context: stage, oncompletion: "oncompletion"});

	setTimeout(function(){
		Q.stage(Q.STAGE_LEVEL_DIALOG).insert(card);
	}, 1000);		


//	var guru = Q("GuruIcon", Q.STAGE_LEVEL_SCORECARD).first();
//	guru.trigger("newconcept", "Start");

});

