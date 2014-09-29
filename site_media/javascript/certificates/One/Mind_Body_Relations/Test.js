Q.scene("health_2",function(stage) {
	stage.name = "health_2";

	stage.desc_card = new Q.StageInfoCard({
		description: new Q.ImageText({
			label: new Q.UI.WrappableText({label: "Hi! TODO: Fill the details of the element here"}),
		}),
		context: stage,
	});

	var guru = Q("GuruIcon", Q.STAGE_LEVEL_NAVIGATION).first();
	guru.trigger("register", stage.desc_card);

	stage.insert(new Q.Repeater({ sheet: "tiles", frame:229, speedX: 1, speedY: 1 }));
	Q.stageTMX("VirtualWorld.tmx", stage);
	game.AUDIO.stop_n_play(game.AUDIO.RESOURCES.VILLAGE);


	var player = Q("Player").first();
	stage.add("viewport").follow(player);
	player.addMaterialContainer("Player");
	stage.player = player;

	var i = 0;
	while(Q("Building", Q.STAGE_LEVEL_PRIMARY).at(i) != null) {
		b = Q("Building").at(i);
		console.log(b.p.name + ": " +stage.options.element.interactability[b.p.name]);
		b.setInteractable(stage.options.element.interactability[b.p.name]);
		b.p.nextScene = stage.name + "_" + b.p.name;
		
		i += 1;
	}

	var nurse = new Q.Person({sheet: "nurse_sheet", frame: 1, x:400, y:800, isInteractable:true, name:"nurse"});
	stage.insert(nurse);
	nurse.info({duration:4});
	
	nurse.off("hit", nurse, "collision");
	nurse.collision = function(col) {
		if(Q.game.player.keys.length >= -1){
			this.p.label = "Mira, you now know what is important for good health. Why don't you go around helping people get what they lack?";
		}
		this.bottom_quote(this.p.label);
	};
	nurse.on("hit", nurse, "collision");

	var countAnswered = 0;
	
	var Amar = new Q.Person({sheet: "person_3_sheet", frame: 1, x:1000, y:600, isInteractable:true, name:"Amar"});
	stage.insert(Amar);
	
	var testQuestions = ["Oh, hello! How are you? I’m still fit and better than everyone else! I wish I had more friends though and that I was more motivated to finish my work for my business. Can you help me?",
						 "Hello! I am still feeling motivated and pretty good. I just wish I didn’t get sick all the time and had more friends. Can you help me?",
						 "Hello! I still have lots of friends and family to spend time with. I just wish I didn’t get sick all the time and felt more motivated and energized to do work. Can you help me?"];

	var testSurvey = Array(testQuestions.length);
	var forms = Array(testQuestions.length);

	for(i = 0; i < testSurvey.length; i++){
		testSurvey[i] = new Q.MultipleChoiceQuestion({
					question: new Q.ImageText({
						label: new Q.UI.WrappableText({label: testQuestions[i], type: Q.SPRITE_NONE, }),
						fill: null,
					}), 
					choices: [
						new Q.ImageText({
							label: new Q.UI.WrappableText({label: "Mind", type: Q.SPRITE_NONE}),
							isSelectable: true,
							fill: null,
						}), 
						new Q.ImageText({
							label: new Q.UI.WrappableText({label: "Body", type: Q.SPRITE_NONE}),
							isSelectable: true,
							fill: null,
						}), 
						new Q.ImageText({
							label: new Q.UI.WrappableText({label: "Relationship", type: Q.SPRITE_NONE}),
							isSelectable: true,
							fill: null,
						}), 
					],
				})

		forms[i] = new Q.Form(
		{
			content: [testSurvey[i]],
			context: stage,
			func: "onquestioncompletion",
		});
	}

	Amar.off("hit", Amar, "collision");
	Amar.collision = function(col) {
		if(Q.game.player.keys.length >= -1){
			forms[0].p.func += "_amar";
			Q.stage(Q.STAGE_LEVEL_DIALOG).insert(forms[0]);
		}
	};
	Amar.on("hit", Amar, "collision");

	stage.onquestioncompletion_amar = function () {
		console.log("helped body person");
		countAnswered++;

		if(countAnswered > 2){
			setTimeout(function(){
				Q.stageScene("LevelFinished", Q.STAGE_LEVEL_NAVIGATION, {label: "Done"});
				stage.pause();
			}, 500);
		}
	};

	var Akbar = new Q.Person({sheet: "person_2_sheet", frame: 1, x:800, y:700, isInteractable:true, name:"Akbar"});
	stage.insert(Akbar);
	
	Akbar.off("hit", Akbar, "collision");
	Akbar.collision = function(col) {
		if(Q.game.player.keys.length >= -1){
			forms[1].p.func += "_akbar";
			Q.stage(Q.STAGE_LEVEL_DIALOG).insert(forms[1]);
		}
	};
	Akbar.on("hit", Akbar, "collision");
	
	stage.onquestioncompletion_akbar = function () {
		console.log("helped mind person");
		countAnswered++;
		
		if(countAnswered > 2){
			setTimeout(function(){
				Q.stageScene("LevelFinished", Q.STAGE_LEVEL_NAVIGATION, {label: "Done"});
				stage.pause();
			}, 500);
		}
	};

	var Anthony = new Q.Person({sheet: "person_1_sheet", frame: 1, x:900, y:900, isInteractable:true, name:"Anthony"});
	stage.insert(Anthony);

	Anthony.off("hit", Anthony, "collision");
	Anthony.collision = function(col) {
		if(Q.game.player.keys.length >= -1){
			forms[2].p.func += "_anthony";
			Q.stage(Q.STAGE_LEVEL_DIALOG).insert(forms[2]);
		}
	};
	Anthony.on("hit", Anthony, "collision");
	
	stage.onquestioncompletion_anthony = function () {
		console.log("helped relationship person");
		countAnswered++;

		if(countAnswered > 2){
			setTimeout(function(){
				Q.stageScene("LevelFinished", Q.STAGE_LEVEL_NAVIGATION, {label: "Done"});
				stage.pause();
			}, 500);
		}
	}
});


Q.scene("health_2_HealthCenter", function(stage) {
	console.log("HealthCenter");
	stage.stock_name = "HealthCenter";
	stage.acceptable_materials = [];

	stage.insert(new Q.Repeater({ sheet: "tiles", frame:229, speedX: 1, speedY: 1 }));
	Q.stageTMX("healthcenter.tmx", stage);


	// Map Exit Door
	var exit_door = new Q.Door({width:96, height: 8, h: 16, w: 96, x: 400, y: 590});
	stage.insert(exit_door);

	// Mira
	var player = Q("Player").first();
	player.add("KeyCarrier");
	player.addKeyContainer();
	stage.player = player;

	player.onquestioncompletion = function () {
		setTimeout(function(){
			Q.stageScene("LevelFinished", Q.STAGE_LEVEL_NAVIGATION, {label: "Done"});
			stage.pause();
		}, 500);
	};


	setTimeout(function(){
		Q.stageScene("Dialog", Q.STAGE_LEVEL_DIALOG, {questions: stage.options.element.element, nextStage: Q.STAGE_LEVEL_LEARNING_MODULE, context: player, func: "onquestioncompletion"});
	}, 500);
});

