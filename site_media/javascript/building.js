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
		if(col.obj.isA("Player")) {
			// unpause the original stage
//			console.log("unpausing primary level");
//			Q.stage(Q.STAGE_LEVEL_PRIMARY).unpause();

//			console.log("Clearing learning module stage");
//			Q.clearStage(Q.STAGE_LEVEL_LEARNING_MODULE);


			var options = Q._defaults(this.stage.options, {direction: "dark"});
			options["nextStage"] = [
				["unpause", Q.STAGE_LEVEL_PRIMARY],
				["clearStage", Q.STAGE_LEVEL_LEARNING_MODULE],
			];

			Q.stageScene("TransitionScene", Q.STAGE_LEVEL_TRANSITION, options);


			Q("Player", Q.STAGE_LEVEL_PRIMARY).each(function() {
				//this.reStock('Player');
				this.resetKeyContainer();
			});
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

		if(col.obj.isA("Player")) {
			// pause this stage
			Q.stage().pause();
			var options = Q._defaults(this.stage.options, {direction: "dark"});
			options["nextStage"] = [["stageScene", this.p.nextScene, Q.STAGE_LEVEL_LEARNING_MODULE, this.stage.options]];

			Q.stageScene("TransitionScene", Q.STAGE_LEVEL_TRANSITION, options);
		}
	}
});


