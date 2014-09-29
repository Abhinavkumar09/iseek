Q.scene("LevelFinished",function(stage) {
	Q.stage(Q.STAGE_LEVEL_PRIMARY).options.element.isFinished = true;
	//Store finished element into local storage
	if(storeValue(Q.stage(Q.STAGE_LEVEL_PRIMARY).options.element.element_id,true)!==true){
		console.log("Store finished element failed");
	}
	else{
		console.log("Store finished element success");
		//console.log(JSON.stringify(Q.stage(Q.STAGE_LEVEL_PRIMARY).options.element));
	}
	var box = stage.insert(new Q.UI.Container({
		x: Q.width/2, 
		y: Q.height/2, 
		fill: "rgba(0,0,0,0.5)"
	}));

	var button = box.insert(new Q.UI.Button({ x: 0, y: 0, fill: "#CCCCCC", label: "Continue" }))         
	var label = box.insert(new Q.UI.Text({x:0, y: -10 - button.p.h, label: stage.options.label }));

	button.on("click",function() {
		Q.clearStage(Q.STAGE_LEVEL_SCORECARD);
//		Q.clearStage(Q.STAGE_LEVEL_DIALOG);
		Q.clearStage(Q.STAGE_LEVEL_LEARNING_MODULE);
		Q.clearStage(Q.STAGE_LEVEL_PRIMARY);
		Q.clearStage(Q.STAGE_LEVEL_NAVIGATION);
		Q.stageScene("LevelSelector", Q.STAGE_LEVEL_LEARNING_MODULE, {certificates: Q.game.certificates});
	});
	box.fit(20);
});

Q.Sprite.extend("Transition", {
	init: function(p) {
		this._super(p, {
			w: Q.width,
			h: Q.height,
			direction: 'dark',
			spent_time: 0,
			total_time: 0.5,
		});
		this.on("inserted");
	},

	inserted: function() {
		var alpha = 0;
		if (this.p.direction == "light")
			alpha = 1;
		this.p.box = this.stage.insert(new Q.UI.Container({
			w: Q.width, 
			h: Q.height, 
			fill: "rgba(0,0,0," + alpha + "0)"
		}));
		this.stage.insert(this.p.box, this);
	},

	step: function(dt) {
		if(this.p.box) {
			var alpha = 0;
			this.p.spent_time += dt;
			alpha = this.p.spent_time / this.p.total_time;
			if(this.p.direction != 'dark') { // if going towards light
				alpha = 1 - alpha;
			}
			if(this.p.spent_time >= this.p.total_time) { // going towards dark
				if(this.p.direction == "dark") {
					for(i in this.stage.options.nextStage) {
						if(this.stage.options.nextStage[i][0] == "stageScene") {
							// start the scene related to this building
							Q.stageScene(this.stage.options.nextStage[i][1], this.stage.options.nextStage[i][2], this.stage.options.nextStage[i][3]);
						}
						else if(this.stage.options.nextStage[i][0] == "unpause") {
							// start the scene related to this building
							Q.stage(this.stage.options.nextStage[i][1]).unpause();
						}
						else if(this.stage.options.nextStage[i][0] == "clearStage") {
							// start the scene related to this building
							Q.clearStage(this.stage.options.nextStage[i][1]);
						}
					}
					this.p.direction = "light";
					this.p.spent_time = 0;
				}
				else
					Q.clearStage(Q.STAGE_LEVEL_TRANSITION);

			}
			this.p.box.p.fill = "rgba(0,0,0," + alpha + ")";
		}
	}
});


Q.scene("TransitionScene", function(stage) {
	flicker = new Q.Transition({x: Q.width/2, y: Q.height/2, direction: stage.options.direction});
	stage.insert(flicker);
});

Q.scene("Dialog", function(stage) {
});


Q.Sprite.extend("Element", {
	init: function(p) {
		this._super(Q._defaults(p, {
			w: Q.width/2 - 10, 
			h: 80,
			type: Q.SPRITE_MATERIAL,
		}));
		this.add("Touch");
		this.on("touch");
		this.on("inserted");
	},

	destroyed: function() {
		this.p.box.children.forEach(function(child) {
			child.destroy();
		});

		this.p.box.destroy();
	},

	touch: function(e) {
		var options = Q._defaults(this.stage.options, {direction: "dark"});
		options["nextStage"] = [
			["clearStage", Q.STAGE_LEVEL_LEARNING_MODULE],
			["stageScene", "navigation", Q.STAGE_LEVEL_NAVIGATION, {}],
			["stageScene", this.p.element.element_id, Q.STAGE_LEVEL_PRIMARY, {element: this.p.element}],
			["stageScene", "scorecard", Q.STAGE_LEVEL_SCORECARD, {}]
		];

		Q.stageScene("TransitionScene", Q.STAGE_LEVEL_TRANSITION, options);

	},

	inserted: function() {
		this.p.box = new Q.UI.Container({
			w: this.p.w,
			h: this.p.h,
			border: 2,
			shadow: true,
			stroke: '#6b513e',
			fill: "#eaae83"
		});

		var box = this.stage.insert(this.p.box, this);
		box.insert(new Q.UI.Text({label: this.p.element.name}));
	},
});

Q.Sprite.extend("ElementSelector", {
	init: function(p) {
		this._super(Q._defaults(p, {w: Q.width/2 - 10, h: Q.height}));
		this.on("inserted");
	},

	destroyed: function() {
		this.p.navbox.children.forEach(function(child) {
			child.destroy();
		});
		this.p.box.children.forEach(function(child) {
			child.destroy();
		});
		this.p.navbox.destroy();
		this.p.box.destroy();
	},

	inserted: function() {
		this.p.box = new Q.UI.Container({
			w: this.p.w,
			h: this.p.h,
			border: 2,
			shadow: true,
			stroke: '#6b513e',
			fill: "#eaae83"
		});

		var box = this.stage.insert(this.p.box, this);

		this.p.navbox = new Q.UI.Container({
			w: this.p.w,
			h: 100,
			y: -box.p.cy + 50,
		});

		navbox = box.insert(this.p.navbox);

		navbox.insert(new Q.UI.Text({x: 0, y: 0, label: this.p.badge.name}));
		var leftbutton = navbox.insert(new Q.UI.Button({x: -this.p.w/2 + 25, y: 0, fill: "#CCCCCC", label: "<" }));

		leftbutton.on("click",function() {
			this.stage.elementselector.destroy();
			this.stage.certificateselector = new Q.CertificateSelector({x: Q.width * 3 / 4 + 5, y: Q.height/2, h: Q.height, w: Q.width/2 - 10, index: this.p.certificate_index});
			this.stage.insert(this.stage.certificateselector);
		});

		var y = -box.p.cy + navbox.p.h + 50;
		for(var i = 0; i < this.p.badge.elements.length; i++) {
			element = new Q.Element({y: y, w: this.p.w - 20, element: this.p.badge.elements[i], index: i});
			box.insert(element);
			y += 100;
		}
	},
});



Q.UI.Container.extend("Badge", {
	init: function(p) {
		this._super(Q._defaults(p, {
			w: Q.width/2 - 10, 
			h: 80,
			type: Q.SPRITE_MATERIAL,
			collisionMask: Q.SPRITE_COLLIDABLE,
			border: 2,
			shadow: true,
			stroke: '#6b513e',
			fill: "#eaae83",
		}));
		this.add("Touch");
		this.on("touch");
		this.on("inserted");
	},

	destroyed: function() {
		this.children.forEach(function(child) {
			child.destroy();
		});
	},


	inserted: function() {
		this.insert(new Q.UI.Text({x: 0, y: 0, label: this.p.badge.name}));
		this.insert(new Q.Sprite({x: -this.p.w/2 + 50, y: 0, asset: this.p.badge.image}));
		this.insert(new Q.CircularProgressBar({x: -this.p.w/2 + 50, y: 0, finished_count: this.p.badge.countFinishedElements()}));
	},

	touch: function(col) {
		this.stage.elementselector = new Q.ElementSelector({x: this.stage.certificateselector.p.x, y: this.stage.certificateselector.p.y, h: this.stage.certificateselector.p.h, w: this.stage.certificateselector.p.w, badge: this.p.badge, certificate_index: this.p.certificate_index});
		this.stage.insert(this.stage.elementselector);
		this.stage.certificateselector.destroy();
	}
});


Q.Sprite.extend("BadgeSelector", {
	init: function(p) {
		this._super(p, {});
		this.on("inserted");
	},

	destroyed: function() {
		this.children.forEach(function(child) {
			child.destroy();
		});
	},


	inserted: function() {
		for(var j = 0; j < this.p.certificate.badges.length; j++) {
			badge = new Q.Badge({y: -this.p.h/2 + (j + 0.45) * 90, x: 0, w: this.p.w - 20, badge: this.p.certificate.badges[j], index: j, certificate_index: this.p.index});
			this.stage.insert(badge, this);
		}
	},

});



Q.UI.Container.extend("CertificateSelector", {
	init: function(p) {
		this._super(Q._defaults(p, {
			index: 0,
			border: 1,
			shadow: false,
			stroke: '#6b513e',
			fill: "#eaae83",
		}));
		this.on("inserted");
	},

	destroyed: function() {
		this.p.navbox.children.forEach(function(child) {
			child.destroy();
		});
		this.children.forEach(function(child) {
			child.destroy();
		});
	},

	inserted: function() {
		this.p.navbox = new Q.UI.Container({
			w: this.p.w,
			h: 100,
			y: -this.p.cy + 50,
		});

		var navbox = this.insert(this.p.navbox);

		var leftbutton = navbox.insert(new Q.UI.Button({ x: -this.p.w/2 + 25, y: 0, fill: "#CCCCCC", label: "<" }));
		var label = navbox.insert(new Q.UI.Text({x: 0, y: 0, label: this.stage.options.certificates[this.p.index].name }));
		var rightbutton = navbox.insert(new Q.UI.Button({ x: this.p.w/2 - 25, y: 0, fill: "#CCCCCC", label: ">" }));

		if(this.p.index > 0) {
			leftbutton.p.fill = "grey";
			leftbutton.on("click",function() {
				Q.clearStage(Q.STAGE_LEVEL_DIALOG);	
				Q("Player", Q.STAGE_LEVEL_PRIMARY).first().resetKeyContainer();
			});
		}
		if(this.p.index < this.stage.options.certificates.length - 1) {
			rightbutton.p.fill = "grey";
			rightbutton.on("click",function() {
				Q.clearStage(Q.STAGE_LEVEL_DIALOG);	
				Q("Player", Q.STAGE_LEVEL_PRIMARY).first().resetKeyContainer();
			});
		}

		var certificate = new Q.BadgeSelector({x: 0, y: 50, h: (this.p.h-100), w: this.p.w, certificate: this.stage.options.certificates[this.p.index], index: this.p.index, certificate_index: this.p.index});
		this.insert(certificate);
	},
});


Q.Sprite.extend("InventoryStats", {
	init: function(p) {
		this._super(Q._defaults(p, {h: 300, w: Q.width/2}));
		this.on("inserted");
	},


	inserted: function() {
		var title = new Q.UI.Text({x: -this.p.w/2 + 100, y: -50, label: "Inventory"});
		this.stage.insert(title, this);

		var i = 0;
		for(stock_name in Q.game.stocks['Workshop']) {
			var box = new Q.UI.Container({
				w: this.p.w - 20,
				h: 50,
				y: i * 50,
				border: 1,
				shadow: false,
				stroke: '#6b513e',
				fill: "#eaae83"
			});
			box = this.stage.insert(box, this);
			var material = new Q.Sprite({x: -box.p.cx + 25, sheet: Q.game.material_names[stock_name].sheet, frame:Q.game.material_names[stock_name].frame});
			box.insert(material);

			var label = new Q.UI.Text({x: 0, label: stock_name});
			box.insert(label);

			var qty = new Q.UI.Text({x: box.p.cx - 25, label: "" + Q.game.stocks['Workshop'][stock_name].length});
			box.insert(qty);
			i += 1;
		}
	},
});


Q.UI.Container.extend("GameStats", {
	init: function(p) {
		this._super(Q._defaults(p, {
			h: Q.height, 
			w: Q.width/2,
			border: 1,
			shadow: false,
			stroke: '#6b513e',
			fill: "#eaae83",
		}));
		this.on("inserted");
	},


	inserted: function() {
		var player = new Q.Person({x: -this.p.w/2 + 50, y: -this.p.h/2 + 75, sheet: "player_sheet", frame:1});
		this.stage.insert(player, this);

		var healthbar = new Q.ScoreBar({asset: "Icons/health.png", x: player.p.x + 150, y: player.p.y - 15, parameter: "health"});
		this.stage.insert(healthbar, this);

		var financebar = new Q.ScoreBar({sheet: "coin", frame: 8, x: player.p.x + 150, y: player.p.y + 15, parameter: "money"});
		this.stage.insert(financebar, this);
		
		var inventory = new Q.InventoryStats({x: 0, y: player.p.y + 150});
		this.stage.insert(inventory, this);
	},
});



Q.scene("LevelSelector", function(stage) {
	stage.certificateselector = new Q.CertificateSelector({x: Q.width * 3 / 4 + 1, y: Q.height/2, h: Q.height, w: Q.width/2 - 1, certificates: stage.options.certificates});
	stage.insert(stage.certificateselector);


	stage.gamestats = new Q.GameStats({x: Q.width * 1 / 4 - 1, y: Q.height/2, h: Q.height, w: Q.width/2 - 1, });
	stage.insert(stage.gamestats);

	game.AUDIO.stop_n_play(game.AUDIO.RESOURCES.BOARD);
});
