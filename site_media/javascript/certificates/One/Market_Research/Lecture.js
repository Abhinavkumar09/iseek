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
				
		};
		
	};

	/*stage.oncompletion = function() {
		setTimeout(function(){
			Q.stageScene("LevelFinished", Q.STAGE_LEVEL_NAVIGATION, {label: "Done"});
			stage.pause();
		}, 500);		
	};*/

});

Q.scene("market_research_1_Market", function(stage) {
	stage.stock_name = "Market";
	stage.acceptable_materials = [];

	
	stage.insert(new Q.Repeater({ sheet: "tiles", frame:229, speedX: 1, speedY: 1 }));
	stage.add("viewport").centerOn(400, 300);
	Q.stageTMX("market.tmx", stage);

	stage.desc_card = new Q.StageInfoCard({
	description: new Q.ImageText({
		label: new Q.UI.WrappableText({label: "You can go to any seller and talk to them!"}),
	}),
	context: stage,
	});

	var guru = Q("GuruIcon", Q.STAGE_LEVEL_NAVIGATION).first();
	guru.trigger("register", stage.desc_card);

	// Map Exit Door
	var exit_door = new Q.Door({width:96, height: 8, h: 16, w: 96, x: 400, y: 590});
	stage.insert(exit_door);



	// Mira
	var player = Q("Player").first();
	player.addMaterialContainer("Player");
	stage.player = player;
	
	stage.player.money = game.score;
	game.Q.state.trigger("change.money", stage.player.money);

	var seller1 = new Q.Person({sheet: "person_4_sheet", frame: 1, x:150, y:320, isInteractable:true, label: "", name:"seller1"});
	stage.insert(seller1);

	var seller2 = new Q.Person({sheet: "person_5_sheet", frame: 1, x:390, y:320, isInteractable:true, label: "", name:"seller2"});
	stage.insert(seller2);

	var seller3 = new Q.Person({sheet: "person_6_sheet", frame: 1, x:610, y:320, isInteractable:true, label: "", name:"seller3"});
	stage.insert(seller3);
		
	
	seller1.collision = function(col) {
	console.log("inside collision");
	
	seller1.bottom_quote("Hello, do you want to buy a basket?", 0, 4);
	setTimeout(function(){player.bottom_quote("No, sorry, I don't have money!", 0, 4);},4000);
	setTimeout(function(){seller1.bottom_quote("It's always the same these days, nobody wants to buy anything. I have not sold many baskets.", 0, 4);},8000);


	var sellerCard1 = new Q.Form({
		content: [				
			new Q.MultipleChoiceQuestion({
				question: new Q.ImageText({
					label: new Q.UI.Text({
						label: "What do you want to do?", 
						type: Q.SPRITE_NONE, 
						}),
					fill: null,
					}), 
				choices: [
					new Q.ImageText({
						label: new Q.UI.Text({label: "Ask how many baskets seller 1 has sold?", type: Q.SPRITE_NONE}),
						isSelectable: true,
							fill: null,
						}), 				
					new Q.ImageText({
						label: new Q.UI.Text({label: "I want to leave", type: Q.SPRITE_NONE}),
						isSelectable: true,
							fill: null,
					}), 

				],			 
			}),	

    		],

		context: stage,
		func: "onquestioncompletion1",
		});

		setTimeout(function(){Q.stage(Q.STAGE_LEVEL_DIALOG).insert(sellerCard1);}, 13000);

		stage.onquestioncompletion1 = function () {
			if(sellerCard1.p.content[0].p.choices[0].p.isSelected == true){
				seller1.bottom_quote("I sold only 1 basket yesterday, and none today. Ever since this the person with the medium size baskets came here, sales are slow. People must like her more than me.", 0, 4);
				setTimeout(function(){player.bottom_quote("Thank you for the information!", 0, 4);},4000);
				stage.player.money = stage.player.money + 2;
				game.Q.state.trigger("change.money", stage.player.money);	
											
			}
			
		};

	};
	seller1.on("hit", seller1, "collision");


	seller2.collision = function(col) {
	console.log("inside collision");
	
	seller2.bottom_quote("Hello, do you want to buy a basket?", 0, 4);
	setTimeout(function(){player.bottom_quote("No, sorry, I don't have money!", 0, 4);},4000);
	setTimeout(function(){seller2.bottom_quote("Oh that's fine, I like to chat a little and take a break from this busy day.", 0, 4);},8000);


	var sellerCard2 = new Q.Form({
		content: [				
			new Q.MultipleChoiceQuestion({
				question: new Q.ImageText({
					label: new Q.UI.Text({
						label: "What do you want to do?", 
						type: Q.SPRITE_NONE, 
						}),
					fill: null,
					}), 
				choices: [
					new Q.ImageText({
						label: new Q.UI.Text({label: "Ask how many baskets seller 2 has sold?", type: Q.SPRITE_NONE}),
						isSelectable: true,
							fill: null,
						}), 				
					new Q.ImageText({
						label: new Q.UI.Text({label: "I want to leave", type: Q.SPRITE_NONE}),
						isSelectable: true,
							fill: null,
					}), 

				],			 
			}),	

    		],

		context: stage,
		func: "onquestioncompletion2",
		});

		setTimeout(function(){Q.stage(Q.STAGE_LEVEL_DIALOG).insert(sellerCard2);}, 12000);

		stage.onquestioncompletion1 = function () {
			if(sellerCard2.p.content[0].p.choices[0].p.isSelected == true){
				seller2.bottom_quote("About 10 today. People can use medium-sized baskets for many different things like fruits, flowers or chapati. This a good place to have my stand, everybody comes by here every day.", 0, 5);
				setTimeout(function(){player.bottom_quote("Thank you for the information!", 0, 4);},5000);
				stage.player.money = stage.player.money + 2;
				game.Q.state.trigger("change.money", stage.player.money);
																
			}
			
		};

	};
	seller2.on("hit", seller2, "collision2");

	seller3.collision = function(col) {
	console.log("inside collision");
	
	seller3.bottom_quote("Hello, do you want to buy a basket?", 0, 4);
	setTimeout(function(){player.bottom_quote("No, sorry, I don't have money!", 0, 4);},4000);
	setTimeout(function(){seller3.bottom_quote("Oh that's fine, I like to chat a little and take a break from this busy day.", 0, 4);},8000);


	var sellerCard3 = new Q.Form({
		content: [				
			new Q.MultipleChoiceQuestion({
				question: new Q.ImageText({
					label: new Q.UI.Text({
						label: "What do you want to do?", 
						type: Q.SPRITE_NONE, 
						}),
					fill: null,
					}), 
				choices: [
					new Q.ImageText({
						label: new Q.UI.Text({label: "Ask how many baskets seller 2 has sold?", type: Q.SPRITE_NONE}),
						isSelectable: true,
							fill: null,
						}), 				
					new Q.ImageText({
						label: new Q.UI.Text({label: "I want to leave", type: Q.SPRITE_NONE}),
						isSelectable: true,
							fill: null,
					}), 

				],			 
			}),	

    		],

		context: stage,
		func: "onquestioncompletion3",
		});

		setTimeout(function(){Q.stage(Q.STAGE_LEVEL_DIALOG).insert(sellerCard3);}, 12000);

		stage.onquestioncompletion3 = function () {
			if(sellerCard3.p.content[0].p.choices[0].p.isSelected == true){
				seller3.bottom_quote("I sold 1 big basket, 5 medium-sized baskets and 3 small baskets today. I almost ran out of medium-sized baskets.", 0, 5);
				setTimeout(function(){player.bottom_quote("Thank you for the information!", 0, 4);},5000);
				stage.player.money = stage.player.money + 2;
				game.Q.state.trigger("change.money", stage.player.money);
												
			}
			
		};

	};
	seller3.on("hit", seller3, "collision");
	
	game.score = stage.player.money;


});


Q.scene("market_research_1_SeemaWorkshop", function(stage) {
	stage.stock_name = "SeemaWorkshop";
	stage.acceptable_materials = ["Basket", "Sticks"];

	stage.desc_card = new Q.StageInfoCard({
	description: new Q.ImageText({
		label: new Q.UI.WrappableText({label: "You can go to any person and talk to them!"}),
	}),
	context: stage,
	});

	var guru = Q("GuruIcon", Q.STAGE_LEVEL_NAVIGATION).first();
	guru.trigger("register", stage.desc_card);

	stage.insert(new Q.Repeater({ sheet: "tiles", frame:229, speedX: 1, speedY: 1 }));
	stage.add("viewport").centerOn(400, 300);
	Q.stageTMX("seemaworkshop.tmx", stage);

	// Map Exit Door
	var exit_door = new Q.Door({width:96, height: 8, h: 16, w: 96, x: 400, y: 588});
	stage.insert(exit_door);

	// Mira
	var player = Q("Player").first();
	stage.player = player;
	player.addMaterialContainer();
	player.reStock(Q.game.stocks["Player"]);
	stage.player.money = game.score;
	game.Q.state.trigger("change.money", stage.player.money);



	var seller1 = new Q.Person({sheet: "person_5_sheet", frame: 1, x:300, y:225, isInteractable:true, label: "", name:"seller1"});
	stage.insert(seller1);
	
	var seller2 = new Q.Person({sheet: "person_4_sheet", frame: 1, x:365, y:225, isInteractable:true, label: "", name:"seller2"});
	stage.insert(seller2);
	
	var seller3 = new Q.Person({sheet: "person_6_sheet", frame: 1, x:430, y:225, isInteractable:true, label: "", name:"seller3"});
	stage.insert(seller3);
	
	seller1.collision = function(col) {
	console.log("inside collision");

	var person1Card1 = new Q.Form({
		content: [				
			new Q.MultipleChoiceQuestion({
				question: new Q.ImageText({
					label: new Q.UI.Text({
						label: "Do you want to ask Person 1", 
						type: Q.SPRITE_NONE, 
						}),
					fill: null,
					}), 
				choices: [
					new Q.ImageText({
						label: new Q.UI.Text({label: "Yes, that's interesting", type: Q.SPRITE_NONE}),
						isSelectable: true,
							fill: null,
						}), 				
					new Q.ImageText({
						label: new Q.UI.Text({label: "No, I want to leave", type: Q.SPRITE_NONE}),
						isSelectable: true,
							fill: null,
					}), 

				],			 
			}),	

    		],

		context: stage,
		func: "onquestioncompletion1",
		});
	Q.stage(Q.STAGE_LEVEL_DIALOG).insert(person1Card1);

		stage.onquestioncompletion1 = function () {
			if(person1Card1.p.content[0].p.choices[0].p.isSelected == true){
				var person1Card2 = new Q.Form({
					content: [				
						new Q.MultipleChoiceQuestion({
							question: new Q.ImageText({
								label: new Q.UI.Text({
									label: "Hello, do you want to see what baskets I make?", 
									type: Q.SPRITE_NONE, 
									}),
								fill: null,
								}), 
							choices: [
								new Q.ImageText({
									label: new Q.UI.Text({label: "Yes, that's interesting", type: Q.SPRITE_NONE}),
									isSelectable: true,
										fill: null,
									}), 				
								new Q.ImageText({
									label: new Q.UI.Text({label: "No, I want to leave", type: Q.SPRITE_NONE}),
									isSelectable: true,
									fill: null,
								}), 

							],			 
						}),	

    					],

					context: stage,
					func: "onquestioncompletion2",
					});						
					Q.stage(Q.STAGE_LEVEL_DIALOG).insert(person1Card2);
					stage.onquestioncompletion2 = function () {
						if(person1Card2.p.content[0].p.choices[0].p.isSelected == true){
						seller1.bottom_quote("I know how to make big baskets. They are good for carrying a lot of clothes or chapatis.", 0, 5);
						setTimeout(function(){player.bottom_quote("Thank you for the information!", 0, 4);},5000);
						stage.player.money += 2;
						game.Q.state.trigger("change.money", stage.player.money);
						}
					};
			}

			
		};



	};
	seller1.on("hit", seller1, "collision");

	seller2.collision = function(col) {
	console.log("inside collision");

	var person2Card1 = new Q.Form({
		content: [				
			new Q.MultipleChoiceQuestion({
				question: new Q.ImageText({
					label: new Q.UI.Text({
						label: "Do you want to ask Person 2", 
						type: Q.SPRITE_NONE, 
						}),
					fill: null,
					}), 
				choices: [
					new Q.ImageText({
						label: new Q.UI.Text({label: "Yes, that's interesting", type: Q.SPRITE_NONE}),
						isSelectable: true,
							fill: null,
						}), 				
					new Q.ImageText({
						label: new Q.UI.Text({label: "No, I want to leave", type: Q.SPRITE_NONE}),
						isSelectable: true,
							fill: null,
					}), 

				],			 
			}),	

    		],

		context: stage,
		func: "onquestioncompletion3",
		});
	Q.stage(Q.STAGE_LEVEL_DIALOG).insert(person2Card1);

		stage.onquestioncompletion3 = function () {
			if(person2Card1.p.content[0].p.choices[0].p.isSelected == true){
				var person2Card2 = new Q.Form({
					content: [				
						new Q.MultipleChoiceQuestion({
							question: new Q.ImageText({
								label: new Q.UI.Text({
									label: "Hello, do you want to see what baskets I make?", 
									type: Q.SPRITE_NONE, 
									}),
								fill: null,
								}), 
							choices: [
								new Q.ImageText({
									label: new Q.UI.Text({label: "Yes, that's interesting", type: Q.SPRITE_NONE}),
									isSelectable: true,
										fill: null,
									}), 				
								new Q.ImageText({
									label: new Q.UI.Text({label: "No, I want to leave", type: Q.SPRITE_NONE}),
									isSelectable: true,
									fill: null,
								}), 

							],			 
						}),	

    					],

					context: stage,
					func: "onquestioncompletion4",
					});						
					Q.stage(Q.STAGE_LEVEL_DIALOG).insert(person2Card2);
					stage.onquestioncompletion4 = function () {
						if(person2Card2.p.content[0].p.choices[0].p.isSelected == true){
						seller2.bottom_quote("I know how to make medium-sized baskets. You can carry or store many different goods in them. I am so busy these days, I don't even have time to go to the market to sell them.", 0, 7);
						setTimeout(function(){player.bottom_quote("Thank you for the information!", 0, 4);},7000);
						stage.player.money += 2;
						game.Q.state.trigger("change.money", stage.player.money);
						}
					};
			}

			
		};



	};

	seller2.on("hit", seller2, "collision");

	seller3.collision = function(col) {
	console.log("inside collision");

	var person3Card1 = new Q.Form({
		content: [				
			new Q.MultipleChoiceQuestion({
				question: new Q.ImageText({
					label: new Q.UI.Text({
						label: "Do you want to ask Person 3", 
						type: Q.SPRITE_NONE, 
						}),
					fill: null,
					}), 
				choices: [
					new Q.ImageText({
						label: new Q.UI.Text({label: "Yes, that's interesting", type: Q.SPRITE_NONE}),
						isSelectable: true,
							fill: null,
						}), 				
					new Q.ImageText({
						label: new Q.UI.Text({label: "No, I want to leave", type: Q.SPRITE_NONE}),
						isSelectable: true,
							fill: null,
					}), 

				],			 
			}),	

    		],

		context: stage,
		func: "onquestioncompletion5",
		});
	Q.stage(Q.STAGE_LEVEL_DIALOG).insert(person3Card1);

		stage.onquestioncompletion5 = function () {
			if(person3Card1.p.content[0].p.choices[0].p.isSelected == true){
				var person3Card2 = new Q.Form({
					content: [				
						new Q.MultipleChoiceQuestion({
							question: new Q.ImageText({
								label: new Q.UI.Text({
									label: "Hello, do you want to see what baskets I make?", 
									type: Q.SPRITE_NONE, 
									}),
								fill: null,
								}), 
							choices: [
								new Q.ImageText({
									label: new Q.UI.Text({label: "Yes, that's interesting", type: Q.SPRITE_NONE}),
									isSelectable: true,
										fill: null,
									}), 				
								new Q.ImageText({
									label: new Q.UI.Text({label: "No, I want to leave", type: Q.SPRITE_NONE}),
									isSelectable: true,
									fill: null,
								}), 

							],			 
						}),	

    					],

					context: stage,
					func: "onquestioncompletion6",
					});						
					Q.stage(Q.STAGE_LEVEL_DIALOG).insert(person3Card2);
					stage.onquestioncompletion6 = function () {
						if(person3Card2.p.content[0].p.choices[0].p.isSelected == true){
						seller3.bottom_quote("I make small baskets that are quite light-weight and easy to carry.", 0, 5);
						setTimeout(function(){player.bottom_quote("Thank you for the information!", 0, 4);},5000);
						stage.player.money += 2;
						game.Q.state.trigger("change.money", stage.player.money);
						}
					};
			}

			
		};



	};

	seller3.on("hit", seller3, "collision");
	game.score = stage.player.money;
	
	/*stage.oncompletion = function() {
		setTimeout(function(){
			Q.stageScene("LevelFinished", Q.STAGE_LEVEL_NAVIGATION, {label: "Done"});
			stage.pause();
		}, 500);		
	};*/
	
});

