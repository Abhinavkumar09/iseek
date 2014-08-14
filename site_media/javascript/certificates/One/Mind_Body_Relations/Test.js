Q.scene("health_2",function(stage) {
	console.log("loaded test");
	stage.name = "health_2";
	Q.stageTMX("VirtualWorld.tmx", stage);

	Q.audio.stop();
	Q.audio.play("Tavern.wav", {loop: true});

	var Mira = Q("Player").first();
	stage.add("viewport").follow(Mira);
	Mira.addMaterialContainer("Player");

	var i = 0;
	while(Q("Building", Q.STAGE_LEVEL_PRIMARY).at(i) != null) {
		b = Q("Building").at(i);
		console.log(b.p.name + ": " +stage.options.element.interactability[b.p.name]);
		b.setInteractable(stage.options.element.interactability[b.p.name]);
		b.p.nextScene = stage.name + "_" + b.p.name;
		
		i += 1;
	}

	var Sahiya = new Q.Person({asset: "People/sahiya.png", x:400, y:800, isInteractable:true, name:"Sahiya"});
	stage.insert(Sahiya);

	Sahiya.info({duration:4});
	
	Sahiya.off("hit", Sahiya, "collision");
	Sahiya.collision = function(col) {
		if(Q.game.player.keys.length >= 3){
			this.p.labels = [
				"Mira, you now know what is important",
				"for good health. Why don't you go around",
				"helping people get what they lack? "
			];
		}
		Sahiya.quote(Sahiya.p.labels);
	};
	Sahiya.on("hit", Sahiya, "collision");

	var countAnswered = 0;
	
	var Amar = new Q.Person({asset: "People/pranav.png", x:1000, y:600, isInteractable:true, name:"Amar"});
	stage.insert(Amar);
	
	var testQuestions = ["Oh, hello! How are you? I’m still fit \n and better than everyone else! I wish \nI had more friends though and that I was \nmore motivated to finish my work for \nmy business. Can you help me?",
						 "Hello! I am still feeling motivated \nand pretty good. I just wish I didn’t \nget sick all the time and had more friends. \nCan you help me?",
						 "Hello! I still have lots of friends \nand family to spend time with. I just \nwish I didn’t get sick all the time and \nfelt more motivated and energized to do \nwork. Can you help me?"];

	var testSurvey = Array(testQuestions.length);
	var forms = Array(testQuestions.length);

	for(i = 0; i < testSurvey.length; i++){
		testSurvey[i] = new Q.MultipleChoiceQuestion({
					question: new Q.ImageText({
						label: new Q.UI.Text({label: testQuestions[i], type: Q.SPRITE_NONE, }),
						fill: null,
					}), 
					choices: [
						new Q.ImageText({
							label: new Q.UI.Text({label: "Mind", type: Q.SPRITE_NONE}),
							isSelectable: true,
							fill: null,
						}), 
						new Q.ImageText({
							label: new Q.UI.Text({label: "Body", type: Q.SPRITE_NONE}),
							isSelectable: true,
							fill: null,
						}), 
						new Q.ImageText({
							label: new Q.UI.Text({label: "Relationship", type: Q.SPRITE_NONE}),
							isSelectable: true,
							fill: null,
						}), 
					],
				})

		forms[i] = new Q.Form(
		{
			content: [testSurvey[i]],
			func: "onquestioncompletion",
		});
	}

	Amar.off("hit", Amar, "collision");
	Amar.collision = function(col) {
		if(Q.game.player.keys.length >= 3){
			forms[0].p.context = Amar;
			forms[0].p.x = Amar.p.x;
			forms[0].p.y = Amar.p.y;
			stage.insert(forms[0]);
		}
	};
	Amar.on("hit", Amar, "collision");

	Amar.onquestioncompletion = function () {
		console.log("helped body person");
		countAnswered++;

		if(countAnswered > 2){
			setTimeout(function(){
				Q.stageScene("LevelFinished", Q.STAGE_LEVEL_NAVIGATION, {label: "Done"});
				stage.pause();
			}, 500);
		}
	};

	var Akbar = new Q.Person({asset: "People/pranav.png", x:800, y:700, isInteractable:true, name:"Akbar"});
	stage.insert(Akbar);
	
	Akbar.off("hit", Akbar, "collision");
	Akbar.collision = function(col) {
		if(Q.game.player.keys.length >= 3){
			forms[1].p.context = Akbar;
			forms[1].p.x = Akbar.p.x;
			forms[1].p.y = Akbar.p.y;
			stage.insert(forms[1]);
		}
	};
	Akbar.on("hit", Akbar, "collision");
	
	Akbar.onquestioncompletion = function () {
		console.log("helped mind person");
		countAnswered++;
		
		if(countAnswered > 2){
			setTimeout(function(){
				Q.stageScene("LevelFinished", Q.STAGE_LEVEL_NAVIGATION, {label: "Done"});
				stage.pause();
			}, 500);
		}
	};

	var Anthony = new Q.Person({asset: "People/pranav.png", x:900, y:900, isInteractable:true, name:"Anthony"});
	stage.insert(Anthony);

	Anthony.off("hit", Anthony, "collision");
	Anthony.collision = function(col) {
		if(Q.game.player.keys.length >= 3){
			forms[2].p.context = Anthony;
			forms[2].p.x = Anthony.p.x;
			forms[2].p.y = Anthony.p.y;
			stage.insert(forms[2]);
		}
	};
	Anthony.on("hit", Anthony, "collision");
	
	Anthony.onquestioncompletion = function () {
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
	var Mira = Q("Player").first();
	Mira.add("KeyCarrier");
	Mira.addKeyContainer();
	stage.player = Mira;

	Mira.onquestioncompletion = function () {
		setTimeout(function(){
			Q.stageScene("LevelFinished", Q.STAGE_LEVEL_NAVIGATION, {label: "Done"});
			stage.pause();
		}, 500);
	};


	setTimeout(function(){
		Q.stageScene("Dialog", Q.STAGE_LEVEL_DIALOG, {questions: stage.options.element.element, nextStage: Q.STAGE_LEVEL_LEARNING_MODULE, context: Mira, func: "onquestioncompletion"});
	}, 500);
});

