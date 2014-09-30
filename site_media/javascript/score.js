Q.scene("navigation",function(stage) {

	stage.insert(new Q.GuruIcon({}));
//	stage.insert(new Q.AudioIcon({}));


	var minimap_width = 160;
	var minimap_height = 120;

	var minimap = new Q.MiniMap({width: minimap_width, height: minimap_height});
	var minimapcursor = new Q.MiniMapCursor({w: minimap_width * Q.width / 80 / 32, h: minimap_height * Q.height / 60 / 32, minimap_width: minimap_width, minimap_height: minimap_height});
	var minimapinfo = new Q.MiniMapInfo({minimap_width: minimap_width, minimap_height: minimap_height});

	var container = stage.insert(new Q.UI.Container({
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


	var healthbar = new Q.ScoreBar({asset: "Icons/health.png", x: 60, y: 25, parameter: "health"});
	stage.insert(healthbar);

	var financebar = new Q.ScoreBar({sheet: "coin", frame: 8, x: 60, y: 55, parameter: "money"});
	stage.insert(financebar);
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
			this.p.x = location.p.x * this.p.minimap_width / 80 / 32 - this.p.minimap_width / 2;
			this.p.y = location.p.y * this.p.minimap_height / 60 / 32 - this.p.minimap_height / 2;
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
			x: Q.width - 40,
			y: 120,
			mute: false,
			asset: "Icons/unmute.png",
			type: Q.SPRITE_UI,
		});

		this.add("Touch");
		this.on("touch");
	},

	touch: function(e) {
		console.log("mute/unmute");
//		Q.game.AUDIO.mute();
		if(Q.game.AUDIO.mute())
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

		Q.state.on("change." + this.p.parameter, this, "change");
	},

	change: function(score) {
		console.log("score changed to: " + score);
		this.p.score = score;
		this.p.label = this.p.parameter + ": " + score;
		this.play("rotate");
		this.tag({position:"center", variable:"score", backgroundColor: null, borderColor: null, textColor: "black", radius:20});
	}

	
});


Q.UI.Container.extend("ScoreBar", {
	init: function(p) {
		this._super(p, {
			w: 80,
			h: 15,
			radius: 5,
			border: 1,
			score: 50,
			parameter: "health",
			fill: 'rgba(69, 47, 8, 0.5)',
			stroke: 'rgba(0, 0, 0, 0.7)',
			type: Q.SPRITE_NONE,
		});

		this.p.score = game.player[this.p.parameter];
		Q.state.on("change." + this.p.parameter,this,"change");
		this.on("inserted");
	},

	inserted: function() {
		this.image = new Q.Sprite({asset: this.p.asset, sheet: this.p.sheet, frame: this.p.frame, type: Q.SPRITE_NONE, x: 0, y: 0});
		this.insert(this.image);
		this.image.p.x = -this.p.cx + this.image.p.cx;
		this.text = new Q.UI.Text({label: "" + this.p.score, x: 10, size: 12, color: "white", family: Q.game.FONTS.REGULAR});
		this.insert(this.text);
		delete this.p.asset;
		delete this.p.sheet;
		delete this.p.frame;
	},

	change: function(score) {
		this.p.score = score;
		this.text.p.label = "" + this.p.score;
	}
});


Q.Sprite.extend("GuruIcon", {
	init: function(p) {
		this._super(p, {
			name: "GuruIcon",
			asset: "Icons/Guru_icon.png",
			x: Q.width - 40,
			y: 65,
			type: Q.SPRITE_UI,
		});
		this.add('Touch');
		this.on("touch");
		this.on("register");
	},

	register: function(card) {
		this.p.card = card;
		this.p.card.p.speaker = new Q.Sprite({asset: this.p.asset});
	},

	touch: function(e) {
		console.log("Guru touched");
		Q.stage(Q.STAGE_LEVEL_DIALOG).insert(this.p.card);;
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


