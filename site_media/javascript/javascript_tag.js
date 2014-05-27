Q.component("PriceTag", {
	added: function() {
	},

	extend: {
		tag: function(opts) {
			this.children.forEach(function(child) {
				if(child.isA("Tag"))
					child.destroy();
			});
			if(!opts)
				opts = {};
			opts.material = this;
			tag = new Q.Tag(opts);
			this.stage.insert(tag, this);
			tag.show();
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

	show: function() {
		this.stage.insert(new Q.UI.Text({label:"" + this.p.material.p[this.p.variable], size: 14, family: "Arial"}), this);
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
	},

});


