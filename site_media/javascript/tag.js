Q.component("PriceTag", {
	added: function() {
	},

	extend: {
		tag: function(opts) {
			if(this.mytag)
				this.mytag.destroy();

			if(!opts)
				opts = {};
			opts.material = this;
			this.mytag = new Q.Tag(opts);
			this.stage.insert(this.mytag, this);
		}      
	}
});



Q.Sprite.extend("Tag", { 
	init: function(p) {
		this._super(p, {
			name: "Tag",
			radius: 10,
			type: Q.SPRITE_NONE,
			collisionMask: Q.SPRITE_NONE,
			material: null,
			position: "top-right",
			variable: "price",
			backgroundColor: "white",
			borderColor: "black",
			textColor: "black",
		});

		this.p.w = 2 * this.p.radius;
		this.p.h = 2 * this.p.radius;

		if(this.p.position == "top-right") {
			this.p.x =  this.p.material.p.cx;
			this.p.y = -this.p.material.p.cy;
		}
		else if(this.p.position == "center") {
			this.p.x = 0;
			this.p.y = 0;
		}
		else if(this.p.position == "right") {
			this.p.x = this.p.material.p.cx + this.p.radius;
			this.p.y = 0;
		}
	},

	draw: function(ctx) {
		ctx.beginPath();
		ctx.arc(0, 0, this.p.radius, 0, 2 * Math.PI, false);
		if(this.p.backgroundColor) {
			ctx.fillStyle = this.p.backgroundColor;
			ctx.fill();
		}
		if(this.p.borderColor) {
			ctx.lineWidth = 1;
			ctx.strokeStyle = this.p.borderColor;
			ctx.stroke();
		}
		var label = "" + this.p.material.p[this.p.variable];
		ctx.font = "14px Arial";
		ctx.fillStyle = this.p.textColor;
		var metrics = ctx.measureText(label);
		ctx.fillText(label, -metrics.width/2, -7);
	},

});


