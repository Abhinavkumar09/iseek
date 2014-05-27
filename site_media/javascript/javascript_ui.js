Q.UI.Slider = Q.UI.Container.extend("UI.Slider", {
	init: function(p, callback) {
		this._super(Q._defaults(p,{
			type: Q.SPRITE_MATERIAL,
			h: 20,
			w: 100,
			min_value: 0,
			max_value: 100,
			value: 50,
		}));

		this.callback = callback;
		this.p.pos = [];
		this.p.pos.x = 0;
		this.p.pos.y = 0;

		this.p.cx = this.p.w/2;
		this.p.cy = this.p.h/2;
		this.add("Touch");
//		this.on('touch');
		this.on('drag');
	},

//	touch: function(touch) {
//		this.move(touch);
//	},

	drag: function(touch) {
		this.move(touch);
	},

	move: function(touch) {
		if(touch.dx) {
			this.p.pos.x = touch.origX + touch.dx;
		}
		if(this.p.pos.x < -this.p.cx)
			this.p.pos.x = -this.p.cx;
		if(this.p.pos.x > this.p.cx)
			this.p.pos.x = this.p.cx;
		this.p.value = Math.floor(this.p.min_value + (this.p.max_value - this.p.min_value) * (this.p.cx + this.p.pos.x) / this.p.w);
		if(this.callback) {
			this.callback();
		}
	},


	draw: function(ctx) {
		ctx.save();
		ctx.fillStyle = "rgba(0, 0, 0, 0.8)";
		ctx.fillRect(-this.p.cx, -this.p.cy, this.p.w, this.p.h);

		ctx.fillStyle = "rgb(255,255,255)";
		ctx.fillRect(this.p.pos.x - 4, -this.p.cy - 5, 8, this.p.h + 10);

		ctx.fillText(this.p.value + "", 0, this.p.h);	
		ctx.restore();
	},

});


Q.UI.Spinner = Q.UI.Container.extend("UI.Spinner", {
	init: function(p, callback) {
		this._super(Q._defaults(p,{
			type: Q.SPRITE_MATERIAL,
			h: 20,
			w: 100,
			min_value: 0,
			max_value: 100,
			value: 50,
		}));

		this.callback = callback;
		this.p.pos = [];
		this.p.pos.x = 0;
		this.p.pos.y = 0;

		this.p.cx = this.p.w/2;
		this.p.cy = this.p.h/2;
		this.add("Touch");
		this.on('touch');
		this.on('touchend');
	},

	touch: function(touch) {
		this.p.is_pressed = true;
	},

	touchend: function(touch) {
		this.p.is_pressed = false;
	},

	draw: function(ctx) {
		ctx.save();
		ctx.beginPath();

		ctx.fillStyle = "rgb(255,255,255)";
		ctx.fillRect(this.p.pos.x - 4, -this.p.cy - 5, 8, this.p.h + 10);

		ctx.fillText(this.p.value + "", 0, this.p.h);	
		ctx.restore();
	},

});


