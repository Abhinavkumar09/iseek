Q.scene("test_cards1", function(stage) {
	var operation = new Q.Form({
		content: [
			new Q.MultipleChoiceQuestion({
				question: new Q.ImageText({
					label: new Q.UI.Text({
						label: "Buy or Sell?", 
						type: Q.SPRITE_NONE, 
					}),
					fill: null,
				}), 
				choices: [
					new Q.ImageText({
						label: new Q.UI.Text({label: "Buy", type: Q.SPRITE_NONE}),
						isSelectable: true,
						fill: null,
					}), 
					new Q.ImageText({
						label: new Q.UI.Text({label: "Sell", type: Q.SPRITE_NONE}),
						isSelectable: true,
						fill: null,
					}), 
				],
			})
			],
		context: stage,
		func: "onopcompletion",
	});
	stage.onopcompletion = function () {
	    var receipt = new Q.ReceiptCard({op: operation.p.content[0].p.result, products: [], context: stage});
		stage.insert(receipt);
		operation.destroy();
	};
	Q.stage(Q.STAGE_LEVEL_DIALOG).insert(operation);

	stage.onquestioncompletion = function() {
			setTimeout(function(){
				Q.stageScene("LevelFinished", Q.STAGE_LEVEL_NAVIGATION, {label: "Done"});
				stage.pause();
			}, 500);
		};

	stage.if_acceptable = function(material_name) {
		for(var i = 0; i < stage.acceptable_materials.length; i++) {
			if(stage.acceptable_materials[i] == material_name)
				return true;
		}
		return false;
	};

	stage.accept_material = function(material_name,material_details) {
		// Step 0: Check if the stage accepts this material
		if(! stage.if_acceptable(material_name)) {
			console.log("not acceptable");
			return false;
		}
		// Step 1: Identify which container will accept the material
		var container = stage.containers[material_name];

		// Step 2: Ask the container to accept the material
		if(!Q.game.stocks[stage.stock_name][material_name])
			Q.game.stocks[stage.stock_name][material_name] = [];

		Q.game.stocks[stage.stock_name][material_name].push(material_details);

		var price = prompt("Price of " + material_name, Q.game.material_names[material_name].price);
		material_details.price = price;
		container.addMaterial(material_name, material_details);

		stage.redistribute_buyers();
		return true;
	};

	stage.give_material = function(material_name) {
		stage.redistribute_buyers();
		return true;
	};

});