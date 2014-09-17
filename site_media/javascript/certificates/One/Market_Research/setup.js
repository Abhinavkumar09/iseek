Q.scene("setup",function(stage) {
	stage.name = "setup";

//	Q.audio.stop();
//	Q.audio.play("Tavern.wav", {loop: true});

	stage.oncompletion = function() {
		setTimeout(function(){
			Q.stageScene("LevelFinished", Q.STAGE_LEVEL_NAVIGATION, {label: "Done"});
			stage.pause();
		}, 500);		
	};

	var card = new Q.BusinessCardForm({person: game.player, SHG: game.SHG, context: stage, oncompletion: "oncompletion"});
//	var card = new Q.SHGCard({SHG: game.SHG});
	stage.insert(card);


//	var guru = Q("GuruIcon", Q.STAGE_LEVEL_SCORECARD).first();
//	guru.trigger("newconcept", "Start");

});

