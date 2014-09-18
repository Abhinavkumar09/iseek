Q.scene("setup",function(stage) {
	stage.name = "setup";
	Q.stageTMX("VirtualWorld.tmx", stage);

//	Q.audio.stop();
//	Q.audio.play("Tavern.wav", {loop: true});

	var Mira = Q("Player").first();
	stage.player = Mira;
	stage.add("viewport").follow(Mira);

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

