Q.Sprite.extend("Door", {
	init: function(p) {
		this._super(p, {
			name: "Door",
			z: 1,
			gravity: 0,
			type: Q.SPRITE_DOOR,
			collisionMask: Q.SPRITE_COLLIDABLE,
			isInteractable: true,
			nextScene: "Door_insidescene"
		});

		if(this.p.isInteractable) {
			this.on("hit", this, "collision");		
		}
	},

	draw: function(ctx) {
		ctx.beginPath();
		ctx.strokeStyle = 'white';
		ctx.rect(-this.p.cx, -this.p.cy, this.p.width, this.p.height);
		ctx.fillStyle = 'white';
		ctx.fill();
		ctx.stroke();
	},

	collision: function(col) {
//		console.log("Collision with Door, reported by the door");
		if(col.obj.isA("Player")&&(this.stage.options.startScreen!=1)) {
			var door = this;
			Q("Player", Q.STAGE_LEVEL_PRIMARY).each(function() {
				if(this.reStock && door.stage.player.p.materialcontainer) {
					console.log("restocking");
					this.reStock(door.stage.player.p.materialcontainer.p.stocks);
				}
				//this.reStock('Player');
				if(this.resetKeyContainer)
					this.resetKeyContainer();
			});


			// unpause the original stage
			var options = Q._defaults(this.stage.options, {direction: "dark"});
			options["nextStage"] = [
				["clearStage", Q.STAGE_LEVEL_PRIMARY],
				["stageScene", this.stage.options.nextScene, Q.STAGE_LEVEL_PRIMARY, {}],
				//["unpause", Q.STAGE_LEVEL_PRIMARY],
				["clearStage", Q.STAGE_LEVEL_LEARNING_MODULE],
			];

			Q.stageScene("TransitionScene", Q.STAGE_LEVEL_TRANSITION, options);
		}
	},

});


Q.Sprite.extend("Building", {
	init: function(p) {
		this._super(Q._defaults(p, {
			name: "Test",
			z: 2,
			gravity: 0,
			type: Q.SPRITE_BUILDING,
			collisionMask: Q.SPRITE_COLLIDABLE,
			isInteractable: false,
			door_location: "bottom",
		}));
//		this.p.nextScene = this.p.name + "_insidescene";

		this.add("Talk");

		if(this.p.isInteractable)
			this.on("hit", this, "collision");		
	},


	setInteractable: function(isInteractable) {
		this.p.isInteractable = isInteractable;
		if(this.p.isInteractable) {
			console.log(this.p.door_location);
			this.on("hit", this, "collision");	
		}
		
	},

	collision: function(col) {
		hit_location = "bottom";
		if(col.normalY < -0.3)
        	hit_location = "bottom";
		if(col.normalY > 0.3)
        	hit_location = "top";
		if(col.normalX < -0.3)
        	hit_location = "right";
		if(col.normalX > 0.3)
        	hit_location = "left";

		if(hit_location != this.p.door_location)
			return;
		console.log("Start: "+this.stage.options.startScreen);
		if(this.stage.options.startScreen != 1){
			if(col.obj.isA("Player")) {
				// pause this stage
				Q.stage().pause();
				var options = Q._defaults(this.stage.options, {direction: "dark"});
				options["nextStage"] = [["stageScene", this.p.nextScene, Q.STAGE_LEVEL_LEARNING_MODULE, this.stage.options]];

				Q.stageScene("TransitionScene", Q.STAGE_LEVEL_TRANSITION, options);
			}
		}
		else if(this.stage.options.startScreen == 1){
			//this.stage.options.startScreen = 0;
			if(col.obj.isA("Player")) {
				var elementID = "";
				var elementObj;
				console.log(b.p.name + ": ");
				//console.log(this.certificates[0].badges[i].elements[0].element_id);
				switch(this.p.name){
					case "School":
						elementID = this.stage.options.certificates[0].badges[0].elements[1].element_id;
						elementObj = this.stage.options.certificates[0].badges[0].elements[1];
						break;
					case "Market":
						elementID = this.stage.options.certificates[0].badges[2].elements[0].element_id;
						elementObj = this.stage.options.certificates[0].badges[2].elements[0];
						break
					case "seemaWorkshop":
						elementID = this.stage.options.certificates[0].badges[2].elements[0].element_id;
						elementObj = this.stage.options.certificates[0].badges[2].elements[0];
						break;
					case "Workshop":
						elementID = this.stage.options.certificates[0].badges[2].elements[0].element_id;
						elementObj = this.stage.options.certificates[0].badges[2].elements[0];
						break;
					case "House":
						elementID = this.stage.options.certificates[0].badges[2].elements[0].element_id;
						elementObj = this.stage.options.certificates[0].badges[2].elements[0];
						break;
					case "HealthCenter":
						elementID = this.stage.options.certificates[0].badges[1].elements[0].element_id;
						elementObj = this.stage.options.certificates[0].badges[1].elements[0];
						break;
					default:
						break;
				}
				//stage.options.nextScene = elementID;
				console.log(elementObj);
				console.log("AA");
				var options = Q._defaults(this.stage.options, {direction: "dark"});
				options["nextStage"] = [
					["clearStage", Q.STAGE_LEVEL_PRIMARY],
					["stageScene", "navigation", Q.STAGE_LEVEL_NAVIGATION, {}],
					["stageScene", elementID, Q.STAGE_LEVEL_PRIMARY, {element: elementObj}],
					["stageScene", "scorecard", Q.STAGE_LEVEL_SCORECARD, {}]
				];
				Q.stageScene("TransitionScene", Q.STAGE_LEVEL_TRANSITION, options);
			}
		}
		
	}
});



