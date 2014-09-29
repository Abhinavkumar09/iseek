Q.component("Talk", {
	extend: {
		info: function(options) {
			this.stage.insert(new Q.Info(Q._defaults(options, {speaker: this})), this);
		},

		bottom_quote: function(label, mirror, duration) {
			if(! mirror)
				mirror = 1;

			if(this.p.quote) {
				this.p.quote.destroy();
				this.p.quote = null;
			}
			this.p.quote = new Q.BottomQuote({speaker:this, label:label, duration: duration});
			Q.stage(Q.STAGE_LEVEL_DIALOG).insert(this.p.quote);
		},

		quote: function(labels, mirror, duration) {
			if(! mirror)
				mirror = 1;

			if(this.p.quote) {
				this.p.quote.destroy();
				this.p.quote = null;					
			}
			this.p.quote = new Q.Quote({speaker:this, labels:labels, mirror: mirror, duration: duration});
			this.stage.insert(this.p.quote, this);
		},

		show_card: function(card) {
			Q.stage(Q.STAGE_LEVEL_DIALOG).insert(card);
		},

	}
});

Q.Sprite.extend("Info",{ 
	init: function(p) {
		this._super(Q._defaults(p, {
			x: 0,
			z: 3,
			name: "Info",
			type: Q.SPRITE_NONE,
			time_spent: 0,
			duration: 10,
			speaker: null,
			asset: 'Icons/icon_info.png',
			showOnMiniMap: false,
		}));
		this.p.y = - this.p.speaker.p.h/2 - this.p.h/2;
		this.on("inserted");
	},

	inserted: function() {
		if(this.p.showOnMiniMap) {
			var minimapinfo = Q("MiniMapInfo", Q.STAGE_LEVEL_NAVIGATION).first();
			if(minimapinfo)
				minimapinfo.trigger("show", this.p.speaker);
		}
	},

	step: function(dt) {
		this.p.time_spent += dt
		if((this.p.time_spent > this.p.duration) && (this.p.duration > 0)) {
			var minimapinfo = Q("MiniMapInfo", Q.STAGE_LEVEL_NAVIGATION).first();
			if(minimapinfo)
				minimapinfo.trigger("show", null);
			this.destroy();
		}
	}
});




Q.UI.Layout.extend("BottomQuote",{ 
	init: function(p) {
		this._super(Q._defaults(p, {
			layout: Q.UI.Layout.HORIZONTAL, 
			separation_x: 10,
			name: "Quote",
			labels: ["Hi!"],
			type: Q.SPRITE_NONE,
			collisionMask: Q.SPRITE_NONE,
			time_spent: 0,
			duration: 5,
			speaker: null,
			z: 10,
			x: Q.width/2,
			w: Q.width,
			h: 120,
			y: Q.height - 60,
			border: 1,
			fill: "white",
		}));

		this.ui_text = new Q.UI.WrappableText({label: this.p.label, type: Q.SPRITE_NONE, w: Q.width - 50, h: 50});
		this.speaker_sprite = new Q.Sprite({sheet: this.p.speaker.p.sheet, asset: this.p.speaker.p.asset, frame: this.p.speaker.p.frame, x:-250});

		this.on("inserted");
	},

	destroyed: function() {
		this.ui_text.destroy();
		this.speaker_sprite.destroy();
	},

	inserted: function() {
		this.insert(this.ui_text);
		this.insert(this.speaker_sprite);
		this.fit(10);
		this.p.y = Q.height - this.p.cy - 0;
	},

	step: function(dt) {
		this.p.time_spent += dt;
		if(this.p.time_spent > this.p.duration)
			this.destroy();
	}

});


Q.Sprite.extend("Quote",{ 
	init: function(p) {
		this._super(Q._defaults(p, {
			name: "Quote",
			labels: ["Hi!"],
			radius: 12,
			type: Q.SPRITE_NONE,
			collisionMask: Q.SPRITE_NONE,
			time_spent: 0,
			duration: 5,
			speaker: null,
			mirror: 1,
			z: 10,
		}));

		text = "";
		ifFirst = true;
		for(index in this.p.labels) {
			if(ifFirst) {
				ifFirst = false;
			} else { 
				text += "\n";
			}
			text += this.p.labels[index];
		}
		this.p.ui_text = new Q.UI.Text({label:text, size:14, family:'Arial', type: Q.SPRITE_NONE});

		this.p.width  = this.p.ui_text.p.w  + 2 * this.p.radius;
		this.p.height = this.p.ui_text.p.h + 2 * this.p.radius;

		var mirror = this.p.mirror;
		this.p.x = mirror * ( this.p.speaker.p.cx + this.p.width / 2);
		this.p.y = (-this.p.speaker.p.cy - this.p.height / 2);

		this.on("inserted");
	},

	destroyed: function() {
		this.p.ui_text.destroy();
	},

	inserted: function() {
		this.stage.insert(this.p.ui_text, this);
	},

	draw: function(ctx) {
		var mirror = this.p.mirror;

		newx = mirror * (-this.p.width/2);
		newy = this.p.height/2;
		var r = mirror * (this.p.width/2);
		var b = (-this.p.height/2);

		ctx.beginPath();
		ctx.strokeStyle = "black";
//		ctx.lineWidth = "2";
		ctx.moveTo(newx + mirror * this.p.radius, newy);
		ctx.lineTo(newx + mirror * this.p.radius/2, newy + this.p.radius/2);
		ctx.lineTo(newx + mirror * this.p.radius * 2, newy);
		ctx.lineTo(r - mirror * this.p.radius, newy);
		ctx.quadraticCurveTo(r, newy, r, newy - this.p.radius);
		ctx.lineTo(r, newy - this.p.height + this.p.radius);
		ctx.quadraticCurveTo(r, b, r - mirror * this.p.radius, b);
		ctx.lineTo(newx + mirror * this.p.radius, b);
		ctx.quadraticCurveTo(newx, b, newx, b + this.p.radius);
		ctx.lineTo(newx, newy - this.p.radius);
		ctx.quadraticCurveTo(newx, newy, newx + mirror * this.p.radius, newy);
		ctx.fillStyle = "white";
		ctx.fill();
		ctx.stroke();
	},

	step: function(dt) {
		this.p.time_spent += dt;
		if(this.p.time_spent > this.p.duration)
			this.destroy();
	}

});

