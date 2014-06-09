Q.Sprite.extend("Person", {
	init: function(p) {
		this._super(Q._defaults(p, {
			x: 200,
			y: 300,
			z: 1,
			gravity: 0,
			type: Q.SPRITE_PLAYER,
			collisionMask: Q.SPRITE_COLLIDABLE,
			isInteractable: false,
			labels: ["Hi!",],

			time_spent: 0,
			covered_material: 0,
			duration: 1,
		}));
		this.add("Talk, Pulsate");

		if(this.p.isInteractable)
			this.on("hit", this, "collision");		
	},


	collision: function(col) {
		console.log("first collision");
		this.quote(this.p.labels);
	},

});

Q.Person.extend("Guru", {
	init: function(p) {
		this._super(p);
		this.on("concept");
	},

	concept: function(concept) {
		var mirror = 1;
		console.log("Guru: concept");
		if(concept == "Start") {
			if(this.p.covered_material == 0) {
				this.quote(["Greetings", "blah", "blah"], mirror);
			}
			else if(this.p.covered_material == 1) {
				this.quote(["Explain the concept of Self Help Group", "blah", "blah"], mirror);
			}
			else if(this.p.covered_material == 2) {
				this.quote(["Talk about the product", "blah", "blah"], mirror);
			}
			else if(this.p.covered_material == 3) {
				this.quote(["Talk about the market", "blah", "blah"], mirror);
			}
			else if(this.p.covered_material == 4) {
				this.quote(["Talk about the bank", "blah", "blah"], mirror);
			}
			else if(this.p.covered_material == 5) {
				this.quote(["Talk about Aanganwadi", "blah", "blah"], mirror);
			}
			else{
				this.p.convered_material = 0;
				console.log("Clearing learning module stage");
				Q.clearStage(Q.STAGE_LEVEL_AAKASHVANI);
				console.log("unpausing primary level");
				Q.stage(Q.STAGE_LEVEL_PRIMARY).unpause();

			}
			this.p.covered_material++;
		} else if(concept == "House") {
			if(this.p.covered_material == 0) {
				this.quote(["Greetings", "blah", "blah"], mirror);
			}
			else if(this.p.covered_material == 1) {
				this.quote(["Talk about resistance from family?", "blah", "blah"], mirror);
			}
			else if(this.p.covered_material == 2) {
				this.quote(["Talk about health issues?", "blah", "blah"], mirror);
			}
			else{
				this.p.convered_material = 0;
				console.log("unpausing primary level");
				Q.stage(Q.STAGE_LEVEL_PRIMARY).unpause();

				console.log("Clearing learning module stage");
				Q.clearStage(Q.STAGE_LEVEL_AAKASHVANI);
			}
			this.p.covered_material++;
		} else if(concept == "Workshop") {
			if(this.p.covered_material == 0) {
				this.quote(["Greetings", "blah", "blah"], mirror);
			}
			else if(this.p.covered_material == 1) {
				this.quote(["Talk about Self Help Group", "blah", "blah"], mirror);
			}
			else if(this.p.covered_material == 2) {
				this.quote(["Talk about the product and raw material", "blah", "blah"], mirror);
			}
			else{
				this.p.convered_material = 0;
				console.log("unpausing primary level");
				Q.stage(Q.STAGE_LEVEL_PRIMARY).unpause();

				console.log("Clearing learning module stage");
				Q.clearStage(Q.STAGE_LEVEL_AAKASHVANI);
			}
			this.p.covered_material++;
		} else if(concept == "Market") {
			if(this.p.covered_material == 0) {
				this.quote(["Greetings", "blah", "blah"], mirror);
			}
			else if(this.p.covered_material == 1) {
				this.quote(["Talk about Pricing", "blah", "blah"], mirror);
			}
			else{
				this.p.convered_material = 0;
				console.log("unpausing primary level");
				Q.stage(Q.STAGE_LEVEL_PRIMARY).unpause();

				console.log("Clearing learning module stage");
				Q.clearStage(Q.STAGE_LEVEL_AAKASHVANI);
			}
			this.p.covered_material++;
		}

	},

	step: function(dt) {
		this.p.time_spent += dt;
		if(this.p.time_spent > this.p.duration) {
			this.trigger("concept", Q.state.get("concept_stage"));
			this.p.time_spent = 0;
		}
	},

});

Q.Person.extend("Buyer", {
	init: function(p) {
		this._super(Q._defaults(p, {
			isInteractable: true,
			direction: 0,
			speed: 50,
			vx: 0,
			vy: 0,
			randomDirection: true,
		}));

		this.add('2d, animation');

		this.on("hit", this, "collision");

		this.next_item = null;
	},

	path_to_next_item: function() {
		
	},

	hstep: function(dt) {
		speed = this.p.speed;
		//console.log(this.p.randomDirection);

		//console.log(this.p.randomDirection);
		if(this.p.randomDirection == true) {
			this.p.randomDirection = false;
			r = Math.random();
			if(r < 0.25)
				this.p.vx = speed;
			else if(r < 0.50)
				this.p.vx = -1 * speed;
			else if(r < 0.75)
				this.p.vy = speed;
			else 
				this.p.vy = -1 * speed;
		}
		else {
			if((this.p.x < this.next_item.p.x - this.next_item.p.cx) ||
				(this.p.x > this.next_item.p.x + this.next_item.p.cx))
			{
				this.p.vx = speed;
				if(this.p.x > this.next_item.p.x)
					this.p.vx = -1 * speed;
			}	
			else
			{
				this.p.vy = speed;
				if(this.p.y > this.next_item.p.y)
					this.p.vy = -1 * speed;
			}			
		}

		this.p.x += dt * this.p.vx;
		this.p.y += dt * this.p.vy;
		if(this.p.vx != 0) {
			if(this.p.vx > 0)
				this.play('run_right');
			else
				this.play('run_left');
		}
		if(this.p.vy != 0) {
			if(this.p.vy > 0)
				this.play('run_down');
			else
				this.play('run_up');
		}

		return;
	},

	accept_material: function(container) {
		console.log("buying");
		var material_name = null;
		for (material_name in container.p.stocks) {
			var ifSold = container.give_material(material_name);
			if(ifSold) {
				this.quote(["Bought"]);
				Q.game.play('sell_buy_item.wav');
			}
			return;
		}
	},
	
	collision: function(col) {
		return;
		if(col.obj.isA("MaterialContainer")) {
			if(col.obj.p.ifBelongsToPlayer) {
				console.log("Reached the player's table");
				this.accept_material(col.obj);
			}
			if(col.obj == this.next_item) {
				console.log("reached the target");
				this.next_item = null;
			}
		}

		if(this.next_item == null) {
			ifExists = true;
			while((this.next_item == null) &&(ifExists)) {
				ifExists = false;
				for(var i = 0; i < this.stage.items.length; i++) {
					if(this.stage.items[i].p.name == "Rug") {
						ifExists = true;
						if(Math.random() > 0.8)
							this.next_item = this.stage.items[i];
					}
				}
			}
			console.log("going towards: " + this.next_item.p.x + ", " + this.next_item.p.y);
		}
		else {
			this.p.randomDirection = true;
			this.p.vx = 0;
			this.p.vy = 0;
		}
	},

});


Q.Person.extend("Teacher", {
	init: function(p) {
		this._super(Q._defaults(p, {
			asset: "mira_1.png"
		}));
	},
});

Q.Sprite.extend("Blackboard", {
	init: function(p) {
		this._super(p, {
		});
		this.p.orig_y = null; 	// The first time teach is called, this will be set
								// It can not be assigned in constructor as loadTMX will change it after initialization
		this.add("Video, Question");
	},

	teach: function(wait) {
		console.log("teach");
		if(this.p.orig_y == null) {
			this.p.orig_w = this.p.w;
			this.p.orig_h = this.p.h;
			this.p.orig_y = this.p.y;
		}
		blackboard = this;
		if(this.p.lessons.status == 0){ // Running
			console.log("waiting");
			setTimeout(function(){blackboard.teach(true);}, 1000);
			return;
		}
		this.p.w = this.p.orig_w;
		this.p.h = this.p.orig_h;
		this.p.y = this.p.orig_y;
		this.p.scale = 1;
		//this.stage.centerOn(Q.width/2, Q.height/2);

		if(wait) {
			// Wait before showing the lesson
			setTimeout(function(){blackboard.teach(false);}, 1000);
			return;
		}
		if(this.p.lessons.status == 1) { // Finished
			this.p.lessons = this.p.lessons.nextElement();
		}
		if(this.p.lessons == null) {
			// Lecture Done
			// Show LevelFinished scene
			Q.stageScene("LevelFinished", Q.STAGE_LEVEL_NAVIGATION, {label: "Done"});
			return;
		}

		if(this.p.lessons instanceof Video) {
			this.p.scale = 2.8;
			this.p.w = this.p.orig_w * this.p.scale;
			this.p.h = this.p.orig_h * this.p.scale;
			this.p.y += this.p.orig_h * (this.p.scale - 1) / 2;
//			this.stage.centerOn(this.p.x, this.p.y);

			this.show_video(this.p.lessons);
		}
		else if(this.p.lessons instanceof Question) {
			this.p.scale = 2.8;
			this.p.w = this.p.orig_w * this.p.scale;
			this.p.h = this.p.orig_h * this.p.scale;
			this.p.y += this.p.orig_h * (this.p.scale - 1) / 2;
//			this.stage.centerOn(this.p.x, this.p.y);

			this.show_question(this.p.lessons);
		}
		setTimeout(function(){blackboard.teach(true);}, 1000);
	},
});


Q.Person.extend("Enterpreneur", {
	init: function(p) {
		this._super(p);
		this.p.labels = [
			"We make baskets to sell at the local market.", 
			"Each girl weaves the type of basker that they are best at making", 
			"Can you sell some of these baskets?",
			"If you sell, we will give you 10% commission."
		];
		this.add("Question");
	},

	collision: function(col) {
		// Check the current state
		if(Object.keys(Q.game.stocks['SeemaWorkshop']).length != 0) {
			this.quote(this.p.labels);
			Q("NewMaterialContainer").set({"isClickable": true});
		}
		else {
			this.p.question = new Question(["yay! What type of basket do you think we should make now?", ["Basket 1", "Basket 2", ]]);
			this.show_question(this.p.question);
			enterpreneur = this;
			setTimeout(function(){enterpreneur.ask(true);}, 1000);
		}
	},

	ask: function(wait) {
		console.log("ask");
		if(this.p.question.status == 1) {
			console.log("it has been answered");
			// Lecture Done
			// Show LevelFinished scene
			Q.stageScene("LevelFinished", Q.STAGE_LEVEL_NAVIGATION, {label: "Done"});
			return;
		}

		enterpreneur = this;
		setTimeout(function(){enterpreneur.ask(true);}, 1000);
	},

});


Q.Person.extend("Player", {
	init: function(p) {
		this._super(p);
		this.p.stock_name = "Player";
		this.add('2d, animation, MaterialCarrier');
		this.add("stepControls");
	},

	step: function(dt) {
		if(Q.inputs['up']) {
			this.play("run_up");      // add priority to animation
		} else if(Q.inputs['down']) {
			this.play("run_down");
		} else if(Q.inputs['left']) {
			this.play("run_left");
		} else if(Q.inputs['right']) {
			this.play("run_right");
		} else {
//			this.play("stand_" + this.p.direction); // stand_left or stand_right
		}
    },


	give_material: function(material_name, material_details) {
		console.log("give_material: " + material_name + ", " + this.p.name);

		Q.game.play("put_pick_item.wav");
		// Update the game stock
		if(Q.game.stocks[this.p.stock_name][material_name]) {
			Q.game.stocks[this.p.stock_name][material_name].pop();
			if(Q.game.stocks[this.p.stock_name][material_name].length == 0) {
				delete Q.game.stocks[this.p.stock_name][material_name];
			}
		}
		
		// Update the material container
		this.dropMaterial(material_name, material_details);
		return true;
	},



	accept_material: function(material_name, material_details) {
		console.log("Player.newaccept_material");

		// Move stock to Player
		if(!material_details.ifBelongsToPlayer) { // To be bought
			// TODO: Check if the player has enough money
			// If no, return false

			// If Yes, reduce money
			Q.game.play('sell_buy_item.wav');
			Q.game.player.change_money(-material_details.price);
		} else {
			Q.game.play("put_pick_item.wav");
		}

		// Update the game stock
		if(!Q.game.stocks[this.p.stock_name][material_name])
			Q.game.stocks[this.p.stock_name][material_name] = [];

		Q.game.stocks[this.p.stock_name][material_name].push(material_details);

		// Update the material container
		this.pickMaterial(material_name, material_details);
		return true;
	},

});


