Q.scene("market_research_0_setup",function(stage) {
	stage.name = "setup";
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
		stage.insert(card);
	}, 1000);		


//	var guru = Q("GuruIcon", Q.STAGE_LEVEL_SCORECARD).first();
//	guru.trigger("newconcept", "Start");

});

