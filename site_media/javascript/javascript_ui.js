Q.UI.Slider = Q.UI.Container.extend("UI.Slider", {
	init: function(p, callback) {
		this._super(Q._defaults(p,{
			type: Q.SPRITE_MATERIAL,
			h: 20,
			w: 100,
			min_value: 0,
			max_value: 100,
			value: 50,
			pos: {'x': 0, 'y': 0},
		}));

		this.callback = callback;

		this.p.cx = this.p.w/2;
		this.p.cy = this.p.h/2;
		this.add("Touch");
		this.on('drag');
	},

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

		this.trigger('change');

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
			h: 80, // 40 for text and 20 each for triangles
			w: 50,
			min_value: 0,
			max_value: 100,
			value: 50,
		}));

		this.callback = callback;

		this.add("Touch");
		this.on("touch");
		this.on("touchEnd");

//		this.on("inserted", this, "addButtons");
	},

	changeValue: function(dvalue) {
		this.p.value += dvalue;
		if(this.p.value < this.p.min_value) {
			this.p.value = this.p.min_value;
		}
		if(this.p.value > this.p.max_value) {
			this.p.value = this.p.max_value;
		}

		this.trigger('change');

		if(this.callback) {
			this.callback();
		}
	},

	touch: function(touch) {
		var m = this.matrix.m;
		var y = (touch.y - m[5])/m[3];
		var obj = this;
		if(y > 0) {
			obj.changeValue(-1);
			this.p.interval = setInterval(function(){obj.changeValue(-1);}, 300);
		} else {
			obj.changeValue(1);
			this.p.interval = setInterval(function(){obj.changeValue(1);}, 300);
		}
	},

	touchEnd: function(touch) {
		clearInterval(this.p.interval);
	},

	draw: function(ctx) {
		ctx.save();
		ctx.beginPath();
		ctx.lineWidth = "1";
		var X0 =   0, Y0 = -40,
		    X1 =  10, Y1 = -20,
		    X2 = -10, Y2 = -20;
		ctx.moveTo(X0,Y0);
		ctx.lineTo(X1,Y1);
		ctx.lineTo(X2,Y2);
		ctx.lineTo(X0,Y0);
		ctx.fill();

		    X0 =   0, Y0 = 40,
		    X1 =  10, Y1 = 20,
		    X2 = -10, Y2 = 20;
		ctx.moveTo(X0,Y0);
		ctx.lineTo(X1,Y1);
		ctx.lineTo(X2,Y2);
		ctx.lineTo(X0,Y0);
		ctx.fill();

		var label = this.p.value + "";
		var metrics = Q.ctx.measureText(label);
		var fontsize = 24;
		ctx.fillText(label, - (metrics.width / 2), - (fontsize * 1.2 / 2));
		ctx.restore();
	},

});


Q.Sprite.extend("CircularProgressBar", {
	init: function(p) {
		this._super(Q._defaults(p, {
			radius: 30,
			min_width: 2,
			max_width: 5,
			max_count: 3,
			finished_count: 2,
		}));
	},

	draw: function(ctx) {
		ctx.save();
		var start_angle = Math.PI/2;
		var offset = Math.PI/30;

		for(var i = 1; i <= this.p.max_count; i++) {
			ctx.beginPath();
			var end_angle = start_angle + Math.PI / this.p.max_count - offset;

			ctx.arc(0, 0, this.p.radius, start_angle, end_angle);
			ctx.arc(0, - this.p.max_width + this.p.min_width, this.p.radius + this.p.max_width, end_angle, start_angle, true);
			ctx.closePath();
			if(i <= this.p.finished_count) {
				var grd = ctx.createLinearGradient(0, -this.p.radius, 0, this.p.radius);
				grd.addColorStop(0,"red");
				grd.addColorStop(0.5,"white");
				grd.addColorStop(1,"green");

				// Fill with gradient
				ctx.fillStyle=grd;
			} else {
				ctx.fillStyle = "grey";
			}
			
			ctx.fill();

			start_angle = end_angle + offset;
		}
		ctx.restore();
	},
});

