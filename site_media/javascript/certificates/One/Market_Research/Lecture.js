Q.scene("market_research_1",function(stage) {
	stage.name = "market_research_1";
	Q.stageTMX("VirtualWorld.tmx", stage);

	var Mira = Q("Player").first();
	stage.add("viewport").follow(Mira);
	Mira.addMaterialContainer("Player");

	var i = 0;
	while(Q("Building", Q.STAGE_LEVEL_PRIMARY).at(i) != null) {
		b = Q("Building").at(i);
		console.log(b.p.name + ": " +stage.options.element.interactability[b.p.name]);
		b.setInteractable(stage.options.element.interactability[b.p.name]);
		b.p.nextScene = stage.name + "_" + b.p.name;
		console.log("nextScene: " + b.p.nextScene);
		i += 1;
	}

//	var guru = Q("GuruIcon", Q.STAGE_LEVEL_SCORECARD).first();
//	guru.trigger("newconcept", "Start");

	stage.accept_material = function(material_name) {
		console.log("cannot accept the material");
		return false;
	};
});


Q.scene("market_research_1_House", function(stage) {
	stage.stock_name = "House";
	stage.acceptable_materials = [];

	stage.insert(new Q.Repeater({ sheet: "tiles", frame:229, speedX: 1, speedY: 1 }));
	Q.stageTMX("house.tmx", stage);


	// Map Exit Door
	var exit_door = new Q.Door({width:96, height: 8, h: 16, w: 96, x: 400, y: 590});
	stage.insert(exit_door);



	// Mira
	var Mira = Q("Player").first();
	Mira.addMaterialContainer("Player");
	stage.player = Mira;

});



Q.scene("market_research_1_School",function(stage) {
//	stage.insert(new Q.Repeater({ sheet: "tiles", frame:229, speedX: 1, speedY: 1 }));

	Q.stageTMX("school.tmx", stage);


	// Map Exit Door
	var exit_door = new Q.Door({width:175, height: 1, h: 1, w: 175, x: 420, y: 590});
	stage.insert(exit_door);


	// Mira
	var Mira = new Q.Player({sheet: "mira_sheet", sprite: 'person_animation', frame:1, x: 100, y: 450, name:"Mira (inside Market)"});
	stage.insert(Mira);
	stage.player = Mira;


	Mira.onquestioncompletion = function () {
		console.log("Done");
		Q.stageScene("LevelFinished", Q.STAGE_LEVEL_NAVIGATION, {label: "Done"});
		stage.pause();
	};

	Q.stageScene("Dialog", Q.STAGE_LEVEL_DIALOG, {questions: stage.options.element.element, nextStage: Q.STAGE_LEVEL_PRIMARY, context: Mira, func: "onquestioncompletion"});


	stage.accept_material = function(material_name) {
		console.log("cannot accept the material");
		return false;
	};

});




