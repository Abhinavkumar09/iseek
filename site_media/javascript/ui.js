Q.UI.Slider = Q.UI.Container.extend("UI.Slider", {
	init: function(p, callback) {
		this._super(Q._defaults(p,{
			type: Q.SPRITE_MATERIAL,
			h: 20,
			w: 100,
			min_value: 0,
			max_value: 100,
			value: 50,
			current_value: 0,
			pos: {'x': 0, 'y': 0},
		}));

		this.callback = callback;

		this.p.cx = this.p.w/2;
		this.p.cy = this.p.h/2;
		this.p.current_value = this.p.cx;
		this.add("Touch");
		this.on('drag');
		this.on('touchEnd');
	},

	drag: function(touch) {
		this.move(touch);
	},

	move: function(touch) {
		if(touch.dx) {
			this.p.pos.x = touch.origX + touch.dx;
		}
		if(this.p.pos.x + this.p.current_value < -this.p.min_value)
			this.p.pos.x = -this.p.current_value;
		if(this.p.pos.x + this.p.current_value > this.p.max_value)
			this.p.pos.x = this.p.max_value-this.p.current_value;
		this.p.value = Math.floor(this.p.min_value + (this.p.max_value - this.p.min_value) * (this.p.current_value + this.p.pos.x) / this.p.w);
		this.trigger('change');
		if(this.callback) {
			this.callback();
		}
	},

	touchEnd: function(touch) {
		this.p.current_value = this.p.value;
	},


	draw: function(ctx) {
		ctx.save();
		ctx.fillStyle = this.p.color ? this.p.color : "rgba(0, 0, 0, 0.8)";
		ctx.fillRect(-this.p.cx, -this.p.cy, this.p.w, this.p.h);
		ctx.fillStyle = "#F2ECE6";
		ctx.fillRect(this.p.value - 50 - 4, -this.p.cy - 5, 8, this.p.h + 10);
		ctx.fillStyle = this.p.color ? this.p.color : "rgba(0, 0, 0, 0.8)";
		ctx.fillText(this.p.value + "", -Math.floor(ctx.measureText(this.p.value).width)/2, this.p.h);	
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
		ctx.fillStyle = this.p.color ? this.p.color : "rgba(0, 0, 0, 0.8)";
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
		ctx.fillText(label, - (metrics.width / 2), - (fontsize * 1.0 / 2));
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



Q.Sprite.extend("Circle", {
	init: function(p) {
		this._super(Q._defaults(p, {
			radius: 10,
			w: 20,
			h: 20,
			fillStyle: null,
			strokeStyle: "black",
		}));
	},

	draw: function(ctx) {
		ctx.save();
		ctx.beginPath();
		ctx.arc(0, 0, this.p.radius, 0, 2 * Math.PI);
		ctx.strokeStyle = this.p.stokeStyle;
		ctx.stroke();
		if(this.p.fillStyle) {
			ctx.fillStyle = this.p.fillStyle;
			ctx.fill();
		}

		if(this.p.isSelected) {
			ctx.beginPath();
			ctx.arc(0, 0, this.p.radius - 2, 0, 2 * Math.PI);
			ctx.fillStyle = this.p.fillStyle;
			ctx.fill();
		}
		ctx.restore();
	},
});


/* 
	w, h: defines the size of the square
*/
Q.Sprite.extend("Rectangle", {
	init: function(p) {
		this._super(Q._defaults(p, {
			w: 15,
			h: 15,
			fillStyle: null,
			strokeStyle: "black",
		}));
	},

	draw: function(ctx) {
		ctx.save();
		ctx.beginPath();
		ctx.moveTo(-this.p.cx, -this.p.cy);
		ctx.lineTo(this.p.cx, -this.p.cy);
		ctx.lineTo(this.p.cx, this.p.cy);
		ctx.lineTo(-this.p.cx, this.p.cy);
		ctx.lineTo(-this.p.cx, -this.p.cy);

		ctx.strokeStyle = this.p.stokeStyle;
		ctx.stroke();
		if(this.p.fillStyle) {
			ctx.fillStyle = this.p.fillStyle;
			ctx.fill();
		}

		if(this.p.isSelected) {
			ctx.beginPath();
			ctx.lineWidth= 2;
			ctx.moveTo(-this.p.cx, -this.p.cy + this.p.h * 0.5);
			ctx.lineTo(-this.p.cx + this.p.w * 0.4, -this.p.cy + this.p.h * 0.8);
			ctx.lineTo(this.p.cx, -this.p.cy - this.p.h * 0.2);
			ctx.stroke();
		}

		ctx.restore();
	},
});

/*
	separationType: 0 means no separation, 1 means compute the separation based on the layout size
	layout: Vertically equally distant or Horizontally equally distant
	align: For veritical layout, align could be left aligned, right aligned, or center aligned. 
			For horizontal, it could be center aligned.
*/
Q.UI.Layout = Q.UI.Container.extend("UI.Layout", {
	init: function(p) {
		this._super(Q._defaults(p, {
			type: Q.SPRITE_NONE, 
			layout: Q.UI.Layout.VERTICAL, 
			align: 0, 
			separationType: 0,
			ifFit: false,
		}));
	},

	destroyed: function() {
		this.children.forEach(function(child) {
			child.destroy();
		});
	},


	insert: function(sprite) {
		this.stage.insert(sprite, this);
		if(this.p.layout != Q.UI.Layout.NONE)
			this.relayout();
		if(this.p.ifFit)
			this.fit();
		if(this.p.align != 0)
			this.realign();
		// Bind to destroy
		return sprite;
	},

	relayout: function() {
		var totalWidth = 0;
		var totalHeight = 0;
		for(var i=0;i<this.children.length;i++) {
			totalWidth += this.children[i].p.w;
			totalHeight += this.children[i].p.h;
		}
		// separation between elements
		var separation_x = this.p.separation_x || 0;
		var separation_y = this.p.separation_y || 0;
		if((this.p.separationType == 1) & (this.children.length > 1)) {
			if(this.p.layout == Q.UI.Layout.VERTICAL && !Q._isNumber(separation_y))
				separation_y = (this.p.h - totalHeight) / (this.children.length + 1);
			else if(this.p.layout == Q.UI.Layout.HORIZONTAL && !Q._isNumber(separation_x))
				separation_x = (this.p.w - totalWidth) / (this.children.length - 1);
		}
		// Make sure all elements have the same space between them
		totalWidth += separation_x * (this.children.length - 1);
		totalHeight += separation_y * (this.children.length - 1);
		var offset_x = -totalWidth/2;
		var offset_y = -totalHeight/2;
		for(var i = 0; i < this.children.length; i++) {
			if(this.p.layout == Q.UI.Layout.VERTICAL) {
				this.children[i].p.y = offset_y + this.children[i].p.h/2;
				offset_y += separation_y + this.children[i].p.h;

			} else if(this.p.layout == Q.UI.Layout.HORIZONTAL) {
				this.children[i].p.x = offset_x + this.children[i].p.w/2;
				offset_x += separation_x + this.children[i].p.w;
			}
		}
	},

	realign: function() {
		var left_most, right_most, top_most, bottom_most;
		for(var i = 0; i < this.children.length; i++) {
			if(! left_most) {
				left_most = this.children[i].p.x - this.children[i].p.cx;
				right_most = this.children[i].p.x + this.children[i].p.w - this.children[i].p.cx;
				top_most = this.children[i].p.y - this.children[i].p.cy;
				bottom_most = this.children[i].p.y + this.children[i].p.h - this.children[i].p.cy;
			}

			if( left_most   > this.children[i].p.x - this.children[i].p.cx)
				left_most   = this.children[i].p.x - this.children[i].p.cx;
			if( right_most  < this.children[i].p.x + this.children[i].p.w - this.children[i].p.cx)
				right_most  = this.children[i].p.x + this.children[i].p.w - this.children[i].p.cx;
			if( top_most    > this.children[i].p.y - this.children[i].p.cy)
				top_most    = this.children[i].p.y - this.children[i].p.cy;
			if( bottom_most < this.children[i].p.y + this.children[i].p.h - this.children[i].p.cy)
				bottom_most = this.children[i].p.y + this.children[i].p.h - this.children[i].p.cy;
		}

		for(var i = 0; i < this.children.length; i++) {
			if(((this.p.align & Q.UI.Layout.LEFT_ALIGN) != 0) && (this.p.layout == Q.UI.Layout.VERTICAL)){
				this.children[i].p.x = left_most + this.children[i].p.cx;
			}
			if(((this.p.align & Q.UI.Layout.RIGHT_ALIGN) != 0) && (this.p.layout == Q.UI.Layout.VERTICAL)){
				this.children[i].p.x =  right_most - this.children[i].p.w + this.children[i].p.cx;
			}
			if(((this.p.align & Q.UI.Layout.CENTER_ALIGN) != 0) && (this.p.layout == Q.UI.Layout.VERTICAL)){
				this.children[i].p.x =  0;
			}
			if(((this.p.align & Q.UI.Layout.CENTER_ALIGN) != 0) && (this.p.layout == Q.UI.Layout.HORIZONTAL)){
				this.children[i].p.y =  0;
			}
			if(((this.p.align & Q.UI.Layout.TOP_ALIGN) != 0) && (this.p.layout == Q.UI.Layout.HORIZONTAL)){
				this.children[i].p.y =  top_most - this.children[i].p.cy;
			}
			if(((this.p.align & Q.UI.Layout.BOTTOM_ALIGN) != 0) && (this.p.layout == Q.UI.Layout.HORIZONTAL)){
				this.children[i].p.y =  bottom_most - this.children[i].p.h + this.children[i].p.cy;
			}
		}
	},
});
Q.UI.Layout.VERTICAL = 1;
Q.UI.Layout.HORIZONTAL = 2;
Q.UI.Layout.NONE = 4;

Q.UI.Layout.LEFT_ALIGN = 1;
Q.UI.Layout.RIGHT_ALIGN = 2;
Q.UI.Layout.CENTER_ALIGN = 4;
Q.UI.Layout.TOP_ALIGN = 8;
Q.UI.Layout.BOTTOM_ALIGN = 16;



Q.UI.TableLayout = Q.UI.Container.extend("UI.TableLayout", {
	init: function(p) {
		this._super(Q._defaults(p, {
			type: Q.SPRITE_NONE, 
		}));
		this.on("inserted");
	},

	destroyed: function() {
		this.children.forEach(function(child) {
			child.destroy();
		});
	},


	inserted: function() {
		if(! this.p.colwidths) {
			
		}

		for(var i=0; i < this.p.rows.length; i++) {
			for(var j=0; j < this.p.rows[i].length; j++) {
				this.insert(this.p.rows[i][j]);
			}
		}
		if(this.p.align)
			this.realign();
	},

	realign: function() {
		var current_top = - this.p.cy;
		for(var i=0; i < this.p.rows.length; i++) {
			var current_left = - this.p.cx;
			var max_height = 0;
			for(var j=0; j < this.p.rows[i].length; j++) {
				if( this.p.align && (this.p.align[j] & Q.UI.TableLayout.LEFT_ALIGN != 0) ){
					this.p.rows[i][j].p.x = current_left + this.p.rows[i][j].p.cx;
				}
				if( (this.p.align) && ((this.p.align[j] & Q.UI.TableLayout.RIGHT_ALIGN) != 0) ){
					this.p.rows[i][j].p.x = current_left + this.p.colwidths[j] * this.p.w - this.p.rows[i][j].p.w + this.p.rows[i][j].p.cx;
				}
				if( (this.p.align) && ((this.p.align[j] & Q.UI.TableLayout.CENTER_ALIGN) != 0) ){
					this.p.rows[i][j].p.x = current_left + this.p.colwidths[j] * this.p.w/2;
				}
				current_left += this.p.colwidths[j] * this.p.w;

				if(max_height < this.p.rows[i][j].p.h)
					max_height = this.p.rows[i][j].p.h;
			}
			for(var j=0; j < this.p.rows[i].length; j++) {
				if( (this.p.align) && ((this.p.align[j] & Q.UI.TableLayout.TOP_ALIGN) != 0) ){
					this.p.rows[i][j].p.y = current_top + this.p.rows[i][j].p.cy;
				}
				if( (this.p.align) && ((this.p.align[j] & Q.UI.TableLayout.BOTTOM_ALIGN) != 0) ){
					this.p.rows[i][j].p.y = current_top + max_height - this.p.rows[i][j].p.h + this.p.rows[i][j].p.cy;
				}
				if( (this.p.align) && ((this.p.align[j] & Q.UI.TableLayout.CENTER_VERTICAL_ALIGN) != 0) ){
					this.p.rows[i][j].p.y = current_top + max_height/2;
				}
			}
			current_top += max_height;
		}
	},

	reddraw: function(ctx) {
		ctx.save();
		ctx.beginPath();
		ctx.moveTo(-this.p.cx, -this.p.cy);
		ctx.lineTo(this.p.cx, -this.p.cy);
		ctx.lineTo(this.p.cx, this.p.cy);
		ctx.lineTo(-this.p.cx, this.p.cy);
		ctx.lineTo(-this.p.cx, -this.p.cy);

		ctx.strokeStyle = this.p.stokeStyle;
		ctx.stroke();

		ctx.restore();
	},

});
Q.UI.TableLayout.LEFT_ALIGN = 1;
Q.UI.TableLayout.RIGHT_ALIGN = 2;
Q.UI.TableLayout.CENTER_ALIGN = 4;
Q.UI.TableLayout.TOP_ALIGN = 8;
Q.UI.TableLayout.BOTTOM_ALIGN = 16;
Q.UI.TableLayout.CENTER_VERTICAL_ALIGN = 32;

