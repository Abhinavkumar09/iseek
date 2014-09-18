console.log("loaded planning element");


/**
  * Finance Badge
  * Loan Element Scene
  */

Q.scene("planning_1", function(stage) {
	stage.name = "planning_1";
	Q.stageTMX("VirtualWorld.tmx", stage);

	Q.audio.stop();
	//Q.audio.play("Tavern.wav", {loop: true});

	var Mira = Q("Player").first();
	//Mira.add("KeyCarrier");
	stage.add("viewport").follow(Mira);
	//Mira.addMaterialContainer("Player");

	//Mira.addKeyContainer();


	var i = 0;
	while(Q("Building", Q.STAGE_LEVEL_PRIMARY).at(i) != null) {
		b = Q("Building").at(i);
		console.log(b.p.name + ": " +stage.options.element.interactability[b.p.name]);
		b.setInteractable(stage.options.element.interactability[b.p.name]);
		b.p.nextScene = stage.name + "_" + b.p.name;
		console.log("nextScene: " + b.p.nextScene);
		i += 1;
	}

	stage.accept_material = function(material_name) {
		console.log("cannot accept the material");
		return false;
	};
});

Q.scene("planning_1_School", function(stage) {
	//stage.acceptable_materials = ["basket_01", "basket_02"];
	//stage.stock_name = "school";

	Q.stageTMX("school.tmx", stage);


	// Map Exit Door
	var exit_door = new Q.Door({width:160, height: 1, w: 160, h: 1, x: 400, y: 590});
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

	var lecture = new Q.Form({
		content: [
			new Q.InfoQuestion({
				question: new Q.ImageText({
					label: new Q.UI.Text({
						label: "Production capacity = n * Oi.\n# of producers (SHG members) = n.\n# of units produced by each person – Oi,\ndefault, but can be adjusted", 
						type: Q.SPRITE_NONE, 
					}),
					fill: null,
				}), 
			}),
			new Q.MultipleChoiceQuestion({
				question: new Q.ImageText({
					label: new Q.UI.Text({
						label: "If your SHG has 10 people and each\nperson can weave 3 baskets per day,\nwhat’s the total production capacity\nper day?", 
						type: Q.SPRITE_NONE, 
					}),
					fill: null,
				}), 
				choices: [
					new Q.ImageText({
						label: new Q.UI.Text({label: "30", type: Q.SPRITE_NONE}),
						isSelectable: true,
						fill: null,
					}), 
					new Q.ImageText({
						label: new Q.UI.Text({label: "3", type: Q.SPRITE_NONE}),
						isSelectable: true,
						fill: null,
					}), 
					new Q.ImageText({
						label: new Q.UI.Text({label: "10", type: Q.SPRITE_NONE}),
						isSelectable: true,
						fill: null,
					}), 
				],
			}),
			new Q.MultipleChoiceQuestion({
				question: new Q.ImageText({
					label: new Q.UI.Text({
						label: "Knowing that the whole SHG group\nworks 20 days per month, how many it\ncan produce per month?", 
						type: Q.SPRITE_NONE, 
					}),
					fill: null,
				}), 
				choices: [
					new Q.ImageText({
						label: new Q.UI.Text({label: "600", type: Q.SPRITE_NONE}),
						isSelectable: true,
						fill: null,
					}), 
					new Q.ImageText({
						label: new Q.UI.Text({label: "200", type: Q.SPRITE_NONE}),
						isSelectable: true,
						fill: null,
					}), 
					new Q.ImageText({
						label: new Q.UI.Text({label: "300", type: Q.SPRITE_NONE}),
						isSelectable: true,
						fill: null,
					}), 
				],
			}),
			new Q.InfoQuestion({
				question: new Q.ImageText({
					label: new Q.UI.Text({
						label: "Great! Now you know how to assess\nhow many baskets you can do to bring them to\nthe market. Let’s think about the materials\nneeded to make these baskets",
						type: Q.SPRITE_NONE, 
					}),
					fill: null,
				}), 
			}),
			new Q.InfoQuestion({
				question: new Q.ImageText({
					label: new Q.UI.Text({
						label: "Think about the materials that are\nneeded to weave one basket",
						type: Q.SPRITE_NONE, 
					}),
					fill: null,
				}), 
			}),
			//ruler questions here to be added
			new Q.InfoQuestion({
				question: new Q.ImageText({
					label: new Q.UI.Text({
						label: "Now that you know the he market research\nshowed that you sell an average of 10 baskets\nper week in the market. You must ask yourself:\n'What do I have to do in order to have\n10 basketsdone every week to sell them\nin the market?",
						type: Q.SPRITE_NONE, 
					}),
					fill: null,
				}), 
			}),
			//table questions to be added
			new Q.InfoQuestion({
				question: new Q.ImageText({
					label: new Q.UI.Text({
						label: "That’s very good Mira, you now have\nlearned an useful tool to manage the quantity\nthe basket you need to weave weekly.",
						type: Q.SPRITE_NONE, 
					}),
					fill: null,
				}), 
			}),
			new Q.InfoQuestion({
				question: new Q.ImageText({
					label: new Q.UI.Text({
						label: "We are almost done. Let’s just\nexplore one more concept.",
						type: Q.SPRITE_NONE, 
					}),
					fill: null,
				}), 
			}),
			new Q.MultipleChoiceQuestion({
				question: new Q.ImageText({
					label: new Q.UI.Text({
						label: "It’s time to think about the\nproduction costs, that is, how much\nit cost to make the baskets",
						type: Q.SPRITE_NONE, 
						isSelectAll: true,
					}),
					fill: null,
				}), 
				choices: [
					new Q.ImageText({
						label: new Q.UI.Text({label: "Raw material purchase", type: Q.SPRITE_NONE}),
						isSelectable: true,
						fill: null,
					}), 
					new Q.ImageText({
						label: new Q.UI.Text({label: "Expenditures at home", type: Q.SPRITE_NONE}),
						isSelectable: true,
						fill: null,
					}), 
					new Q.ImageText({
						label: new Q.UI.Text({label: "Family needs", type: Q.SPRITE_NONE}),
						isSelectable: true,
						fill: null,
					}), 
					new Q.ImageText({
						label: new Q.UI.Text({label: "Wages", type: Q.SPRITE_NONE}),
						isSelectable: true,
						fill: null,
					}), 
					new Q.ImageText({
						label: new Q.UI.Text({label: "Garment expenditures", type: Q.SPRITE_NONE}),
						isSelectable: true,
						fill: null,
					}), 
					new Q.ImageText({
						label: new Q.UI.Text({label: "Other as the transport, utilities, rent…", type: Q.SPRITE_NONE}),
						isSelectable: true,
						fill: null,
					}), 
				],
			}),
			new Q.InfoQuestion({
				question: new Q.ImageText({
					label: new Q.UI.Text({
						label: "Well done, Mira. Now you have all the\nimportant concepts to plan how to weave the\nbaskets correctly and efficiently",
						type: Q.SPRITE_NONE, 
					}),
					fill: null,
				}), 
			}),
		],
		context: Mira,
		func: "onquestioncompletion",
	});
	
	stage.insert(lecture);

	stage.accept_material = function(material_name) {
		console.log("cannot accept the material");
		return false;
	};

});


