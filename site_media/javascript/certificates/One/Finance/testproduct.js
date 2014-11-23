Q.scene("show_products",function(stage) {
	stage.name = "show_products";

	stage.desc_card = new Q.StageInfoCard({
		description: new Q.ImageText({
			label: new Q.UI.WrappableText({label: "Hi! TODO: Go to the workshop and fill in the answers"}),
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
	player.addMaterialContainer();

	var i = 0;
	while(Q("Building", Q.STAGE_LEVEL_PRIMARY).at(i) != null) {
		b = Q("Building").at(i);
		console.log(b.p.name + ": " +stage.options.element.interactability[b.p.name]);
		b.setInteractable(stage.options.element.interactability[b.p.name]);
		b.p.nextScene = stage.name + "_" + b.p.name;
		
		i += 1;
	}

	stage.oncompletion = function() {
		setTimeout(function(){
			Q.stageScene("LevelFinished", Q.STAGE_LEVEL_NAVIGATION, {label: "Done"});
			stage.pause();
		}, 500);		
	};
	

}); 

/*
Scene once the player enters the workshop. Mira is asked whether she wants to check the inventory or produce new or old sellable products. If a new product is created it gets synced with the OpenERP system. 
*/
Q.scene("show_products_Workshop", function(stage) {
	console.log("Workshop");
	stage.stock_name = "Workshop";
	stage.acceptable_materials = [];

	stage.insert(new Q.Repeater({ sheet: "tiles", frame:229, speedX: 1, speedY: 1 }));
	stage.add("viewport").centerOn(400, 300);
	Q.stageTMX("workshop.tmx", stage);
	
	// add Mira to the workshop
	var player = new Q.Player({sheet: "player_sheet", sprite: 'person_animation', frame:1, x: 100, y: 450, name:"Player"});
	stage.insert(player);
	stage.player = player;
	

	// Map Exit Door for player to return to the village scene.
	var exit_door = new Q.Door({width:96, height: 8, h: 16, w: 96, x: 400, y: 590});
	stage.insert(exit_door);

	var Aman = new Q.Person({sheet: "person_1_sheet", frame: 1, x:300, y:225, isInteractable:true, name:"Aman"});
	stage.insert(Aman);

	//Aman.off("hit", Aman, "collision");
	Aman.collision = function(col) {
		console.log("inside collision");
		//game.sync_data["Manufacture"] = true;	
		var cardPro = new Q.Form({
		content: [				
			new Q.MultipleChoiceQuestion({
				question: new Q.ImageText({
					label: new Q.UI.Text({
						label: "What do you want us to do?", 
						type: Q.SPRITE_NONE, 
					}),
					fill: null,
				}), 
				choices: [
					new Q.ImageText({
						label: new Q.UI.Text({label: "Produce Products", type: Q.SPRITE_NONE}),
						isSelectable: true,
						fill: null,
					}), 
					new Q.ImageText({
						label: new Q.UI.Text({label: "Show Inventory", type: Q.SPRITE_NONE}),
						isSelectable: true,
						fill: null,
					}), 
				],			 
			}),	

		],
		context: stage,
		func: "onquestioncompletion",
		});
		
		Q.stage(Q.STAGE_LEVEL_DIALOG).insert(cardPro);
		
		stage.onquestioncompletion = function () {
		//console.log(cardPro);
		//var ob = cardPro.p.content[0].p.choices[0].p.isSelected;	
		//console.log(ob);
		  	if(cardPro.p.content[0].p.choices[0].p.isSelected == false) {
                   		var cardInv = new Q.showInventory({context: stage, oncompletion: "oncompletion"});   
				Q.stage(Q.STAGE_LEVEL_DIALOG).insert(cardInv);
			}
			else {			   	
				var productTiles = Array();
			   	var pro_cards = ["CardObjects/fruitbasket.png", "Objects/bamboo.png", "Objects/bamboo.png"];

				for(i = 0; i < game.productLength; i++) {
					if(game.productInventory[i].sellable == true) {
						productTiles[i] = new Q.Tile({
							image: new Q.Sprite({asset: pro_cards[i]}),
							label: new Q.UI.Text({label: game.productInventory[i].name}),
							disabled: true,
			   			});
					}
			   	}
			   
  			   	productTiles[i] = new Q.Tile({
			   		image: new Q.Sprite({asset: "Objects/basket_02.png"}),
			   		label: new Q.UI.Text({label: "Create new Product"}),
			   		disabled: true,
			   	});
				var create_pro = i;
				var product_card = new Q.TileCard({tiles: productTiles, grid: Q.TileCard.GRID_2_2, context: stage,});	
			   	Q.stage(Q.STAGE_LEVEL_DIALOG).insert(product_card);

				product_card.ok = function() {
										
					if(this.p.tiles[create_pro].p.isSelected) {
						var cardch = new Q.productCreation({context: stage, oncompletion: "oncompletion"});   
						Q.stage(Q.STAGE_LEVEL_DIALOG).insert(cardch);
						
                                                cardch.next = function() {
							//this.destroy();
                                                        var nameP;
                                                        var priceP;

							$(cardch.npinput.el).find('input:text, input:password, input:file, select, textarea')
								.each(function() {
									console.log("inside");
									nameP = $(this).val();
									console.log(nameP);
							});
							
							$(cardch.ppinput.el).find('input:text, input:password, input:file, select, textarea')
								.each(function() {
									priceP = $(this).val();
									console.log(priceP);
							});

							game.nameProduct = nameP;
							game.priceProduct = priceP;						
							//game.sync_data["products"] = true;

							var prodqty = new Q.Form({
								content: [				
									new Q.RangeQuestion({
										question: new Q.ImageText({
											label: new Q.UI.Text({
											label: "What is the quantity of the product?", 
											type: Q.SPRITE_NONE, 
											}),
										fill: null,
										}), 
										answer: new Q.UI.Spinner({
											min_value: 0,
											max_value: 100,
											value: 50,
										}), 										}),
								],
								context: stage,
								func: "onquestioncompletion2",
							});
					
							Q.stage(Q.STAGE_LEVEL_DIALOG).insert(prodqty);
							stage.onquestioncompletion2 = function () {
								// = prodqty.p.content[2].p.answer.p.value;
								
								
							};
							prodqty.done = function() {
								console.log("finish");
								this.destroy();
							}
						}							
							
					}
					else {
						for(j = 0; j < this.p.tiles.length; j++) {
							if(this.p.tiles[j].p.isSelected) {
								//this.destory();
								var prodqty = new Q.Form({
									content: [				
									new Q.RangeQuestion({
										question: new Q.ImageText({
											label: new Q.UI.Text({
											label: "What is the quantity of the product?", 
											type: Q.SPRITE_NONE, 
											}),
										fill: null,
										}), 
										answer: new Q.UI.Spinner({
											min_value: 0,
											max_value: 100,
											value: 50,
										}), 										}),
								],
								context: stage,
								func: "onquestioncompletion2",
								});
								Q.stage(Q.STAGE_LEVEL_DIALOG).insert(prodqty);
								stage.onquestioncompletion2 = function () {
								 game.productInventory[j].qty = prodqty.p.content[2].p.answer.p.value;
								 game.sync_data["Manufacture"] = true;
								
								};
							}						
						}	
					}
					this.destroy();			
				}
			}			
		};

	};
	Aman.on("hit", Aman, "collision");
	console.log("outside collision");
	//var card = new Q.showInventory({context: stage, oncompletion: "oncompletion"});

	// Mira
	/*var player = Q("Player").first();
	player.addMaterialContainer("Player");
	stage.player = player;*/
});
