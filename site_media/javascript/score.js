Q.scene("navigation",function(stage) {
	stage.insert(new Q.GuruIcon());
//	stage.insert(new Q.AudioIcon());


	var minimap_width = 160;
	var minimap_height = 120;

	var minimap = new Q.MiniMap({width: minimap_width, height: minimap_height});
	var minimapcursor = new Q.MiniMapCursor({w: minimap_width * Q.width / 80 / 32, h: minimap_height * Q.height / 60 / 32, minimap_width: minimap_width, minimap_height: minimap_height});
	var minimapinfo = new Q.MiniMapInfo({minimap_width: minimap_width, minimap_height: minimap_height});

	var container = stage.insert(new Q.UI.Container({
		//fill: "gray",
		border: 1,
		x: Q.width - (minimap_width + 2) / 2 - 10,
		y: Q.height - (minimap_height + 2) / 2 - 10,
		w: (minimap_width + 2),
		h: (minimap_height + 2),
		z: 1,
		opacity: 0.4,
	}));

	stage.insert(minimap, container);
	stage.insert(minimapcursor, container);
	stage.insert(minimapinfo, container);
});



Q.scene("scorecard",function(stage) {
	var score = new Q.Score({sheet: "coin", sprite: "coin_animation", frame:0, x: Q.width - 50});
	stage.insert(score);
	score.tag({position:"center", variable:"score", backgroundColor: null, borderColor: null, textColor: "black", radius:20});

	stage.insert(new Q.ScoreBar({x: Q.width - 125}));
//	stage.insert(new Q.Board());
});

Q.scene("scoreboard", function(stage) {
	var background_tiles = new Q.Repeater({ sheet: "tiles", frame:229, speedX: 1, speedY: 1 });
	stage.insert(background_tiles);

	// Progressboard
//	var progress_board = new Q.Progressboard({asset: "progressboard.png", x: 500, y: 300});
//	stage.insert(progress_board);

	var Mira = new Q.Player({sheet: "mira_sheet", sprite: 'person_animation', frame: 1, name: "Mira", x:50, y:75});
	stage.insert(Mira);

	var score_bar = new Q.ScoreBar({x:150, y:50});
	stage.insert(score_bar);
	
	var score = new Q.Score({sheet: "coin", sprite: "coin_animation", frame:0, x:150, y:90});
	stage.insert(score);
	score.tag({position:"center", variable:"score", backgroundColor: null, borderColor: null, textColor: "black", radius:20});

	// insert badges and certificates
	stage.insert(new Q.CloseIcon({}));

});

Q.Sprite.extend("Board", {
	init: function(p) {
		this._super(p, {
			x: 700,
			y: 35,
			z: 3,
			parameter: "performance",
			asset: "Icons/score.png",
			type: Q.SPRITE_MATERIAL,
			collisionMask: Q.SPRITE_MATERIAL,
		});

		this.p.x = Q.width - this.p.w;
		this.add("Touch");
		this.on("touch");
	},

	touch: function(e) {
		console.log("scorestar touched");
		Q.clearStage(Q.STAGE_LEVEL_SCORECARD);
		//Q.state.set("score_stage", "Start");
		Q.stageScene("scoreboard", Q.STAGE_LEVEL_SCOREBOARD);
	},
});


Q.Sprite.extend("MiniMap", {
	init: function(p) {
		this._super(p, {
			x: 0,
			y: 0,
			z: 2,
			asset: "VirtualWorld.png",
			opacity: 0.4,
		});
		this.p.scale = this.p.width / this.p.w;
	},

});


// Shows a blinking light on the minimap where the user's attention is required
Q.Sprite.extend("MiniMapInfo", {
	init: function(p) {
		this._super(p, {
			time_spent:0,
			duration: 0.5,
			radius: 0,
			max_radius: 10,
		});

		this.on("show");
	},

	show: function(location) {
		this.p.location = location;
		if(this.p.location) {
			console.log("show");
			this.p.x = location.p.x * this.p.minimap_width / 80 / 32 - this.p.minimap_width / 2;
			this.p.y = location.p.y * this.p.minimap_height / 60 / 32 - this.p.minimap_height / 2;
		}
		else {
		console.log("stop showing");
		}
	},

	draw: function(ctx) {
		if(! this.p.location)
			return;

		ctx.beginPath();
		ctx.arc(0, 0, this.p.radius, 0, 2* Math.PI);
		ctx.fillStyle = "red";
		ctx.fill();
		ctx.closePath();
	},

	step: function(dt) {
		this.p.time_spent += dt;
		if(this.p.time_spent >= this.p.duration)
			this.p.time_spent = 0;

		this.p.radius = this.p.max_radius * this.p.time_spent / this.p.duration;
	},
});

Q.Sprite.extend("MiniMapCursor", {
	init: function(p) {
		this._super(p, {
			x: 0,
			y: 0,
			z: 3,
			opacity: 0.4,
		});
	},

	draw: function(ctx) {
		// Draw a rectangle around the area which is visible to the user
		// Use alpha in rgba to have it slighly opaque
		ctx.beginPath();
		ctx.rect(-this.p.w/2, -this.p.h/2, this.p.w, this.p.h);
		ctx.fillStyle = "rgba(0,0,0,0.3)";
		ctx.fill();
		ctx.lineWidth = 1;
		ctx.strokeStyle = 'black';
		ctx.stroke();
	},

	step: function(dt) {
		try {
			this.p.x = Q("Player", Q.STAGE_LEVEL_PRIMARY).first().p.x * this.p.minimap_width / 80 / 32 - this.p.minimap_width / 2;
			this.p.y = Q("Player", Q.STAGE_LEVEL_PRIMARY).first().p.y * this.p.minimap_height / 60 / 32 - this.p.minimap_height / 2;
		} catch(err) {}
	},
});



Q.Sprite.extend("AudioIcon", {
	init: function(p) {
		this._super(p, {
			x: 700,
			y: 35,
			z: 3,
			mute: false,
			asset: "Icons/unmute.png",
			type: Q.SPRITE_MATERIAL,
			collisionMask: Q.SPRITE_MATERIAL,
		});

		this.p.x = Q.width - this.p.w;
		this.add("Touch");
		this.on("touch");
	},

	touch: function(e) {
		console.log("mute/unmute");
		Q.game.mute = !(Q.game.mute);
		if(Q.game.mute)
			this.p.asset = "Icons/mute.png";
		else
			this.p.asset = "Icons/unmute.png";
	}

});




Q.Sprite.extend("Score", {
	init: function(p) {
		this._super(p, {
			x: 700,
			y: 35,
			z: 3,
			parameter: "money",
			score: 0,
			material: this,
		});
		this.add('PriceTag, animation');

		this.p.score = Q.game.player[this.p.parameter];
		this.p.label = this.p.parameter + ": " + this.p.score;

		Q.state.on("change." + this.p.parameter, this, "score");
	},

	score: function(score) {
		console.log("score changed to: " + score);
		this.p.score = score;
		this.p.label = this.p.parameter + ": " + score;
		this.play("rotate");
		this.tag({position:"center", variable:"score", backgroundColor: null, borderColor: null, textColor: "black", radius:20});
	}

});


Q.Sprite.extend("ScoreBar", {
	init: function(p) {
		this._super(p, {
			x: 620,
			y: 35,
			w: 50,
			h: 10,
			score: 50,
			maxScore: 100,
			parameter: "health",
			fillStyle: 'red',
			label: false,
		});

		this.p.score = game.player[this.p.parameter];
		Q.state.on("change." + this.p.parameter,this,"score");
	},

	draw: function(ctx) {
		width = this.p.w * this.p.score / this.p.maxScore;
		if(this.p.label)
			width = this.p.w;

		ctx.beginPath();
		ctx.rect(-this.p.cx, -this.p.cy, this.p.w, this.p.h);
		ctx.lineWidth = "1";
		ctx.strokeStyle = 'black';
		ctx.fillStyle = 'rgba(255, 255, 255, 0.2)';
		ctx.fill();
		ctx.stroke();

		ctx.beginPath();
		ctx.lineWidth = "0";
		ctx.rect(-this.p.cx + 1, -this.p.cy + 1, width - 2, this.p.h - 2);
		ctx.fillStyle = this.p.fillStyle;
		ctx.fill();

		if(this.p.label) {
			ctx.fillStyle = 'black';
			ctx.font = "14px Arial";
			var metrics = ctx.measureText(this.p.score);
			ctx.fillText(this.p.score, -metrics.width/2, -7);
		}
	
	},

	score: function(score) {
		this.p.score = score;
	}
});


Q.Sprite.extend("GuruIcon", {
	init: function(p) {
		this._super(p, {
			name: "GuruIcon",
			asset: "Icons/Guru_icon.png",
			x: 40,
			y: 65,
			type: Q.SPRITE_MATERIAL,
			collisionMask: Q.SPRITE_MATERIAL,
			covered_material: {},
			current_material: "Start",
			force: false,
		});
		this.add('Touch, Talk, Video, Question');
		this.on("touch");
		this.on("newconcept");
		this.on("show_video");
		this.on("show_question");
	},

	newconcept: function(concept) {
		console.log("guruicon newconcept");
		console.log("force: " + this.p.force);
		return;
		this.p.current_material = concept;
		if((concept in this.p.covered_material) && (!this.p.force))
			return;
		else {
			this.p.covered_material[concept] = true;
			this.p.force = false;
		}

		if(concept == "Start") {
			Q.state.set("concept_stage", "Start");
			Q.stageScene("concept_scene", Q.STAGE_LEVEL_AAKASHVANI);
			// pause this stage
			Q.stage(Q.STAGE_LEVEL_PRIMARY).pause();
		}
		else if(concept == "House") {
			Q.state.set("concept_stage", "House");
			Q.stageScene("concept_scene", Q.STAGE_LEVEL_AAKASHVANI);
			// pause this stage
			Q.stage(Q.STAGE_LEVEL_PRIMARY).pause();
		}
		else if(concept == "Workshop") {
			Q.state.set("concept_stage", "Workshop");
			Q.stageScene("concept_scene", Q.STAGE_LEVEL_AAKASHVANI);
			// pause this stage
			Q.stage(Q.STAGE_LEVEL_PRIMARY).pause();
		}
		else if(concept == "Market") {
			Q.state.set("concept_stage", "Market");
			Q.stageScene("concept_scene", Q.STAGE_LEVEL_AAKASHVANI);
			// pause this stage
			Q.stage(Q.STAGE_LEVEL_PRIMARY).pause();
		}
//		Q.audio.play("sell_buy_item.wav");
	},

	touch: function(e) {
		console.log("Guru touched");
		this.p.force = true;
		this.trigger("newconcept", this.p.current_material);
	}

});

Q.Sprite.extend("CloseIcon", {
	init: function(p) {
		this._super(p, {
			x: 750,
			y: 35,
			z: 3,
			asset: "Icons/close.png",
			type: Q.SPRITE_MATERIAL,
			collisionMask: Q.SPRITE_MATERIAL,
		});

//		this.p.x = Q.width - this.p.w;
		this.add("Touch");
		this.on("touch");
	},

	touch: function(e) {
		console.log("CloseIcon touched");
		Q.stageScene('scorecard', Q.STAGE_LEVEL_SCORECARD);
		Q.clearStage(Q.STAGE_LEVEL_SCOREBOARD);
		console.log("unpausing primary level");
	}
});

Q.Sprite.extend("HealthBar", {
	init: function(p) {
		this._super(p, {
			x: 620,
			y: 35,
			w: 30,
			h: 75,
			score: 50,
			scoreUpto: 50,
			maxScore: 100,
			parameter: "health",
			fillStyle: 'green',
			label: false,
		});
	},

	draw: function(ctx) {
		height = this.p.h * this.p.score / this.p.maxScore;
		if(this.p.label)
			width = this.p.w;

		ctx.beginPath();
		ctx.rect(-this.p.cx, -this.p.cy, this.p.w, this.p.h);
		ctx.lineWidth = "1";
		ctx.strokeStyle = 'black';
		ctx.fillStyle = 'rgba(255, 255, 255, 0.2)';
		ctx.fill();
		ctx.stroke();

		ctx.beginPath();
		ctx.lineWidth = "0";
		ctx.rect(-this.p.cx, -this.p.cy + this.p.h, this.p.w, -height);
		ctx.fillStyle = this.p.fillStyle;
		ctx.fill();

		if(this.p.label) {
			ctx.fillStyle = 'black';
			ctx.font = "14px Arial";
			var metrics = ctx.measureText(this.p.score);
			ctx.fillText(this.p.score, -metrics.width/2, -7);
		}
	
	},

	step: function(dt){
		if(this.p.score < this.p.scoreUpto)
			this.p.score += 20 * dt;
	},
});

