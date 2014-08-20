Q.UI.Layout.extend("ControlButtons", {
	init: function(p) {
		this._super(Q._defaults(p, {
			w: 100,
			h: 100,
			x: 0,
			y: 0,
			button_type: Q.ControlButtons.DONE, 
			layout: Q.UI.Layout.HORIZONTAL,
			separation_x: 10,

			callback_done: "done",
			callback_next: "next",
			callback_prev: "prev",
		}));
		this.on("inserted");
		this.on("destroyed");
	},

	destroyed: function() {
		this.children.forEach(function(child) {
			child.destroy();
		});
	},

	inserted: function() {
		var callback_done = this.p.callback_done;
		var callback_next = this.p.callback_next;
		var callback_prev = this.p.callback_prev;
		var callback_buy = this.p.callback_buy;
		var callback_sell = this.p.callback_sell;

		var context = this.p.context;

		if(this.p.button_type & Q.ControlButtons.PREV) {
			var b = this.insert(new Q.UI.Button({label: "Prev", radius: 5, stroke: "#F5E0CC", border: 2, fill: "#8F4700"}));
			b.on("click", function(){
				context[callback_prev]();
			});
		}
		if(this.p.button_type & Q.ControlButtons.NEXT) {
			var b = this.insert(new Q.UI.Button({label: "Next", radius: 5, stroke: "#F5E0CC", border: 2, fill: "#8F4700"}));
			b.on("click", function(){
				context[callback_next]();
			});
		}
		if(this.p.button_type & Q.ControlButtons.DONE) {
			var b = this.insert(new Q.UI.Button({label: "Done", radius: 5, stroke: "#F5E0CC", border: 2, fill: "#8F4700"}));
			b.on("click", function(){
				context[callback_done]();
			});
		}
		if(this.p.button_type & Q.ControlButtons.BUY) {
			var b = this.insert(new Q.UI.Button({label: "Buy", radius: 5, stroke: "#F5E0CC", border: 2, fill: "#8F4700"}));
			b.on("click", function(){
				context[callback_buy]();
			});
		}
		if(this.p.button_type & Q.ControlButtons.SELL) {
			var b = this.insert(new Q.UI.Button({label: "Sell", radius: 5, stroke: "#F5E0CC", border: 2, fill: "#8F4700"}));
			b.on("click", function(){
				context[callback_sell]();
			});
		}
		this.fit(0);
	},
});
Q.ControlButtons.OK = 1;
Q.ControlButtons.CANCEL = 2;
Q.ControlButtons.NEXT = 4;
Q.ControlButtons.PREV = 8;
Q.ControlButtons.DONE = 16;
Q.ControlButtons.BUY = 32;
Q.ControlButtons.SELL = 64;



/*
	To display the video
*/
Q.UI.Layout.extend("Video", {
	init: function(p) {
		this._super(Q._defaults(p, {
			w: 400,
			h: 300,
			type: Q.SPRITE_NONE,
			collisionMask: Q.SPRITE_NONE,
			separation_y: 10,
			align: Q.UI.Layout.CENTER_ALIGN,
			radius: 0,

			status: Q.Form.INCOMPLETE,
			layout: Q.UI.Layout.VERTICAL,
			filename: "",
		}));
		this.on("inserted");
	},

	inserted: function() {
		this.p.video = document.getElementById('myvideo');
		this.p.video.src = this.p.filename;
		this.p.video.load();
		this.p.video.play();
		this.p.video.onended = function(e) {
		};
	},

	draw: function(ctx) {
		ctx.drawImage(this.p.video, -this.p.w/2, -this.p.h/2, this.p.w, this.p.h);
	},
});




/*
	To be used when we want to show text and optionally image as well. 
	Image can be placed at multiple places depending upon the context. 
	For example, in the case of multiple choice question in which choices have image and text both,
	we might want image to be above the text.
	However, in the question text where the image might represent the person asking the question, we want the image to be on the left.

	(text, image, layout, isSelectable) {
*/
Q.UI.Layout.extend("ImageText", {
	init: function(p) {
		var adjustedP= Q._defaults(p, {
			w: 300,
			h: 100,
			type: Q.SPRITE_PURE_UI,
			collisionMask: Q.SPRITE_NONE,
			separation_x: 10,
			separation_y: 10,
			isSelected: false,
			layoutType: Q.ImageText.LEFT_POSITION,
			align: Q.UI.Layout.CENTER_ALIGN,
			isSelectable: false,
			fill: "rgba(255, 255, 255, 1)",
			radius: 0,
		});

		var layout = Q.UI.Layout.VERTICAL;
		if(adjustedP.layoutType == Q.ImageText.LEFT_POSITION)
			layout = Q.UI.Layout.HORIZONTAL;

		this._super(Q._defaults(adjustedP, {layout: layout, }));

		this.on("inserted");
		if(this.p.isSelectable) {
			this.add("Touch");
			this.on("touch");
		}
		this.on("destroyed");
	},

	destroyed: function() {
		this.children.forEach(function(child) {
			child.destroy();
		});
	},

	inserted: function() {
		if(this.p.isSelectable) {
			this.p.bullet = new Q.Rectangle({radius: 10, type: Q.SPRITE_NONE, isSelected: this.p.isSelected});
			this.insert(this.p.bullet);
		}

		if(this.p.label)
			this.insert(this.p.label);
		if(this.p.image) {
			this.insert(this.p.image);
		}

		this.fit(10);
	},

	touch: function() {
//		console.log("touch");
		this.select(!this.p.isSelected);
		this.p.parent.onselect(this);
	},

	select: function(isSelected) {
		this.p.isSelected = isSelected;
		this.p.bullet.p.isSelected = isSelected;
	}
});
Q.ImageText.LEFT_POSITION = 1;
Q.ImageText.TOP_POSITION = 2;



//question, choices, isSelectALL
Q.UI.Layout.extend("MultipleChoiceQuestion", {
	init: function(p) {
		this._super(Q._defaults(p, {
			w: 400,
			h: 500,
			type: Q.SPRITE_NONE,
			collisionMask: Q.SPRITE_NONE,
			separation_y: 0,
			align: Q.UI.Layout.LEFT_ALIGN,

			radius: 0,

			status: Q.Form.INCOMPLETE,
			isSelectAll: false,
			answers: [],
			layout: Q.UI.Layout.VERTICAL,
		}));
		this.on("inserted");
		this.on("destroyed");
	},

	destroyed: function() {
		this.children.forEach(function(child) {
			child.destroy();
		});
	},

	inserted: function() {
		this.insert(this.p.question);
		for(var i = 0; i < this.p.choices.length; i++) {
			this.p.choices[i].p.parent = this;
			this.insert(this.p.choices[i]);
			console.log("choice x:" + this.p.choices[i].p.x + ", y:" + this.p.choices[i].p.y + ", cx:" + this.p.choices[i].p.cx + ", cy:" + this.p.choices[i].p.cy + ", w:" + this.p.choices[i].p.w + ", h:" + this.p.choices[i].p.h);
		}
		this.fit(10);
	},

	onselect: function(choice) {
		if(this.p.isSelectAll == false) {
			for(var i = 0; i < this.p.choices.length; i++) {
				if(choice != this.p.choices[i]) {
					this.p.choices[i].select(false);
				}
			}
		}		
	},
});

/** Range Question Card
  * @param this.p.range - insert slider or spinner
  * @param this.p.question - question to display
  */
Q.UI.Layout.extend("RangeQuestion", {
	init: function(p) {
		this._super(Q._defaults(p, {
			w: 400,
			h: 300,
			type: Q.SPRITE_NONE,
			collisionMask: Q.SPRITE_NONE,
			separation_y: 10,
			align: Q.UI.Layout.CENTER_ALIGN,

			radius: 0,

			status: Q.Form.INCOMPLETE,
			layout: Q.UI.Layout.VERTICAL,
		}));
		this.on("inserted");
		this.on("destroyed");
	},

	destroyed: function() {
		this.children.forEach(function(child) {
			child.destroy();
		});
	},

	inserted: function() {
		this.insert(this.p.question, this);
		this.insert(this.p.answer, this);
		this.fit(10);
	},
});


/** Info Card
  * @param this.p.video - video object
  * @param this.p.label - label object(text)
  */
Q.UI.Layout.extend("InfoQuestion", {
	init: function(p) {
		this._super(Q._defaults(p, {
			w: 400,
			h: 300,
			type: Q.SPRITE_NONE,
			collisionMask: Q.SPRITE_NONE,
			separation_y: 10,
			align: Q.UI.Layout.CENTER_ALIGN,

			radius: 0,

			status: Q.Form.INCOMPLETE,
			isSelectAll: false,
			answers: [],
			layout: Q.UI.Layout.VERTICAL,
		}));
		this.on("inserted");
	},

	inserted: function() {
		if(this.p.video){
			this.insert(this.p.video);
		}
		if(this.p.question){
			this.insert(this.p.question);
		}
		this.fit(10);
	},
});


/**
	Important variables to be passed:
		content: an array of all the questions/videos/text to be shown in this form
		exit_type: defines how the question will be considered answered. For example,
			should there is "Ok" and "Cancel" button, or just "Continue" button.
*/
Q.UI.Layout.extend("Form", {
	init: function(p) {
		this._super(Q._defaults(p, {
			x: 400,
			y: 300,
			w: 600,
			h: 400,
			type: Q.SPRITE_NONE,
			collisionMask: Q.SPRITE_NONE,
			separationType: 1,
			separation_y: 10,
			align: Q.UI.Layout.CENTER_ALIGN | Q.UI.Layout.START_TOP,
			status: Q.Form.INCOMPLETE,
			fill: "rgba(255, 255, 255, 1)",
			index: 0,
			radius: 0,
			border: 0,
			hold: false,
		}));
		//, context: Mira, func: "onquestioncompletion"
		this.on("destroyed");
		this.on("inserted");
	},

	destroyed: function() {
		this.children.forEach(function(child) {
			child.destroy();
		});
	},

	inserted: function() {
		this.p.content[this.p.index].p.parent = this;
		this.insert(this.p.content[this.p.index]);
		var type = 0;
		if(this.p.content[this.p.index+1]!=null)
			type = type | Q.ControlButtons.NEXT;
		else
			type = type | Q.ControlButtons.DONE;

		if(this.p.content[this.p.index-1]!=null)
			type = type | Q.ControlButtons.PREV;

		this.insert(new Q.ControlButtons({context: this, button_type: type}));
	},


	done: function() {
		this.destroyed();
		if(this.p.context)
			this.p.context[this.p.func]();
	},

	// Assumes that there is a next content to show
	next: function() {
		if(!this.p.hold){
			this.p.index++;
			this.destroyed();
			this.children = [];
			this.inserted();
		}
	},

	// Assumes that there is a prev content to show
	prev: function() {
		if(!this.p.hold){
			this.p.index--;
			this.destroyed();
			this.children = [];
			this.inserted();
		}
	},
});

Q.Form.INCOMPLETE = 1;
Q.Form.COMPLETE = 2;


/*
	Product card will be used to show information for a product. Using this card, a player will be able to buy a product/raw material as well.

	Requires, the product following product information:
		* Product Name
		* Product Image
		* Product Description
		* If buyable by the player
			-- Price
		* If sellable by the player
			-- Initial price

	Design:
		The card is 600x400
			The top left 100x100 is for the image
			the top right 100x500 is for the name
			the bottom 50x600 is for the buttons
			the 50x600 before bottom is for the price/quantity
			the middle part is for description
	*/
Q.UI.Layout.extend("Product", {
	init: function(p) {
		this._super(Q._defaults(p, {
			w: 600,
			h: 400,
			type: Q.SPRITE_NONE,
			collisionMask: Q.SPRITE_NONE,
			separationType: 1,
			separation_y: 10,
			layout: Q.UI.Layout.NONE,
			fill: "rgba(255, 255, 255, 1)",
		}));
		this.on("destroyed");
		this.on("inserted");
	},

	destroyed: function() {
		this.children.forEach(function(child) {
			child.destroy();
		});
	},

	inserted: function() {
		this.p.image.p.x = -this.p.cx + 50;
		this.p.image.p.y = -this.p.cy + 50;

		this.p.name.p.x = this.p.cx - 250;
		this.p.name.p.y = -this.p.cy + 50;

		this.p.description.p.x = 0;
		this.p.description.p.y = 0;

		this.insert(this.p.image);
		this.insert(this.p.name);
		this.insert(this.p.description);

		if(this.p.buyable) {
			this.p.price_text = new Q.UI.Text({label: "Price: " + this.p.price, x: -this.p.cx + 150, y: this.p.cy - 100});
			this.insert(this.p.price_text);

			this.p.quantity_text = new Q.UI.Text({label: "Quantity", x: this.p.cx - 200, y: this.p.cy - 100});
			this.p.quantity = this.p.quantity ? this.p.quantity : new Q.UI.Spinner({color: "#8F4700", x: this.p.cx - 100, y: this.p.cy - 100}, null);
			this.insert(this.p.quantity_text);
			this.insert(this.p.quantity);
			var type = Q.ControlButtons.BUY;
			this.insert(new Q.ControlButtons({context: this, button_type: type, y: this.p.cy - 25}));
		}
		else if(this.p.sellable) {
			this.p.price_text = new Q.UI.Text({label: "Price", x: -this.p.cx + 50, y: this.p.cy - 100});
			this.p.price = this.p.price ? this.p.price : new Q.UI.Spinner({color: "#8F4700", x: -this.p.cx + 150, y: this.p.cy - 100}, null);
			this.insert(this.p.price_text);
			this.insert(this.p.price);
			var type = Q.ControlButtons.SET;
			this.insert(new Q.ControlButtons({context: this, button_type: type, y: this.p.cy - 25}));
		}
	},

	done: function() {
		this.p.card.destroy();
		if(this.p.context)
			this.p.context[this.p.func]();
	},

	buy: function() {
	}
});


Q.UI.Layout.extend("Card", {
	init: function(p) {
		this._super(Q._defaults(p, {
			x: 400,
			y: 300,
			w: 600,
			h: 300,
			type: Q.SPRITE_NONE,
			collisionMask: Q.SPRITE_NONE,
			separationType: 1,
			separation_y: 10,
			align: Q.UI.Layout.CENTER_ALIGN | Q.UI.Layout.START_TOP,
			fill: "rgba(255, 255, 255, 1)",
			radius: 0,
			shadow: 0,
			border: 0,
		}));
		this.on("destroyed");
		this.on("inserted");
	},

	destroyed: function() {
		console.log(this.p.parent);
		this.p.parent.p.hold = false;
		this.children.forEach(function(child) {
			child.destroy();
		});
	},

	inserted: function() {
		for(var i = 0; i < this.p.content.length; i++) {
			this.insert(this.p.content[i]);
			this.p.content[i].p.card = this;
			this.p.content[i].p.parent = this;
		}
	},


	addShadow: function(ctx) {
		if(this.p.shadow) {
			var shadowAmount = Q._isNumber(this.p.shadow) ? this.p.shadow : 5;
			ctx.shadowOffsetX=shadowAmount;
			ctx.shadowOffsetY=shadowAmount;
			ctx.shadowColor = this.p.shadowColor || "rgba(0,0,50,0.1)";
		}
	},

	clearShadow: function(ctx) {
		ctx.shadowColor = "transparent";
	},

	onselect: function(choice) {
		console.log(this.p.parent);
		this.p.parent.p.hold = true;
		Q.stageScene("test_cards",2, { 
		  product: choice.p.product,
		  parent: this.p.parent,
		});	
	},

});


Q.scene("test_cards", function(stage) {
	var card = new Q.Card({content: [stage.options.product,],parent: stage.options.parent});
	stage.insert(card);
});
