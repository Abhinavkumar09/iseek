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
		this.fit(0);
	},
});
Q.ControlButtons.OK = 1;
Q.ControlButtons.CANCEL = 2;
Q.ControlButtons.NEXT = 4;
Q.ControlButtons.PREV = 8;
Q.ControlButtons.DONE = 16;
Q.ControlButtons.BUY = 32;



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
		if(this.p.photo) {
			this.insert(this.p.photo);
			console.log(this.p.photo.sheet().tileW + ", " + this.p.photo.p.w);
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
		this.p.card.destroy();
		if(this.p.context)
			this.p.context[this.p.func]();
	},

	// Assumes that there is a next content to show
	next: function() {
		this.p.index++;
		this.destroyed();
		this.children = [];
		this.inserted();
	},

	// Assumes that there is a prev content to show
	prev: function() {
		this.p.index--;
		this.destroyed();
		this.children = [];
		this.inserted();
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
			-- Limit on how much can be bought
		* If sellable by the player
			-- Initial price
			-- Quantity

	*/
Q.UI.Layout.extend("Product", {
	init: function(p) {
		this._super(Q._defaults(p, {
//			x: 400,
//			y: 300,
			w: 600,
			h: 400,
			type: Q.SPRITE_NONE,
			collisionMask: Q.SPRITE_NONE,
			separationType: 1,
			separation_y: 10,
			align: Q.UI.Layout.CENTER_ALIGN | Q.UI.Layout.START_TOP,
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
		this.insert(this.p.image);
		this.insert(this.p.name);
		this.insert(this.p.description);
		if(this.p.buyable) {
			this.insert(this.p.price);
			this.p.quantity = new Q.UI.Spinner({color: "#8F4700",},null);
			this.insert(this.p.quantity);
			var type = Q.ControlButtons.BUY;
			this.insert(new Q.ControlButtons({context: this, button_type: type}));
		}
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
			h: 400,
			type: Q.SPRITE_NONE,
			collisionMask: Q.SPRITE_NONE,
			separationType: 1,
			separation_y: 10,
			align: Q.UI.Layout.CENTER_ALIGN | Q.UI.Layout.START_TOP,
			fill: "rgba(255, 255, 255, 1)",
			radius: 0,
			shadow: 5,
			border: 2,
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
		this.insert(this.p.content);
		this.p.content.p.card = this;
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


});

var rangetestform = new Q.Form(
				{
					content: [
//						new Q.Video({
//								filename: '/site_media/assets/new_game/video/output1.ogg',
//						}),

//						new Q.RangeQuestion({
//							question: new Q.ImageText({
//								label: new Q.UI.Text({label: "How much do you want to invest?", type: Q.SPRITE_NONE, }),
//								fill: null,
//							}),
//							answer: new Q.UI.Slider({color: "#8F4700",},null),
//						}),
				new Q.MultipleChoiceQuestion({
					question: new Q.ImageText({
						label: new Q.UI.Text({label: "How many baskets can 1 person prepare in 1 day?", size: 18, type: Q.SPRITE_NONE, }),
						fill: null,
					}), 
					choices: [
						new Q.ImageText({
							photo: new Q.Medal({sheet: "basket_01_sheet", frame:0}),
							label: new Q.UI.Text({label: "5", size: 16, type: Q.SPRITE_NONE}),
							isSelectable: true,
							fill: null,
						}), 
						new Q.ImageText({
							label: new Q.UI.Text({label: "6", size: 16, type: Q.SPRITE_NONE}),
							isSelectable: true,
							fill: null,
						}), 
						new Q.ImageText({
							label: new Q.UI.Text({label: "7", size: 16, type: Q.SPRITE_NONE}),
							isSelectable: true,
							fill: null,
						}), 
						new Q.ImageText({
							label: new Q.UI.Text({label: "8", size: 16, type: Q.SPRITE_NONE}),
							isSelectable: true,
							fill: null,
						}), 
						new Q.ImageText({
							label: new Q.UI.Text({label: "9", size: 16, type: Q.SPRITE_NONE}),
							isSelectable: true,
							fill: null,
						}), 
						new Q.ImageText({
							label: new Q.UI.Text({label: "10", size: 16, type: Q.SPRITE_NONE}),
							isSelectable: true,
							fill: null,
						}), 
						new Q.ImageText({
							label: new Q.UI.Text({label: "11", size: 16, type: Q.SPRITE_NONE}),
							isSelectable: true,
							fill: null,
						}), 
					],
				}),
						new Q.MultipleChoiceQuestion({
							question: new Q.ImageText({
								label: new Q.UI.Text({label: "Did fda fdas fdas fda fdas fdas\n fdas fdas fdasf  fdsafs you?", type: Q.SPRITE_NONE, }),
								fill: null,
							}), 
							choices: [
								new Q.ImageText({
									label: new Q.UI.Text({label: "Yes fdasf fdsaf fdas fdas fdas fdas\n fdasfew fdasfw ffdafwe fdafwe ", type: Q.SPRITE_NONE}),
									isSelectable: true,
									fill: null,
								}), 
								new Q.ImageText({
									label: new Q.UI.Text({label: "No", type: Q.SPRITE_NONE}),
									isSelectable: true,
									fill: null,
								}), 
							],
						}),
						new Q.RangeQuestion({
							question: new Q.ImageText({
								label: new Q.UI.Text({label: "How much do you want to invest?", type: Q.SPRITE_NONE, }),
								fill: null,
							}),
							answer: new Q.UI.Spinner({color: "#8F4700",},null),
						}),
					]
				}
			);

var product = new Q.Product({
	image: new Q.ImageText({image: new Q.Sprite({sheet: "basket_01_sheet", frame:2})}),
	name: new Q.ImageText({label: new Q.UI.Text({label: "Basket"})}),
	description: new Q.ImageText({label: new Q.UI.Text({label: "Basket type 1"})}),
});

var card = new Q.Card({content: new Q.Medal({x: 400, y:300, sheet: "basket_01_sheet", frame:2})});
//var card = new Q.Card({content: rangetestform});
//var card = new Q.Card({content: product});

var multichoiceQ = new Q.MultipleChoiceQuestion({
					question: new Q.ImageText({
						label: new Q.UI.Text({label: "How many baskets can 1 person prepare in 1 day?", size: 18, type: Q.SPRITE_NONE, }),
						fill: null,
					}), 
					choices: [
						new Q.ImageText({
							photo: new Q.Sprite({sheet: "basket_01_sheet", frame:1}),
							label: new Q.UI.Text({label: "5", size: 16, type: Q.SPRITE_NONE}),
							//photo: new Q.UI.Text({label: "5", size: 16, type: Q.SPRITE_NONE}),
							isSelectable: true,
							fill: null,
						}), 
					],
					x: 400,
					y: 300,
				});
var temp = new Q.Sprite({sheet: "basket_01_sheet", frame:1});
console.log("w: " + temp.p.w);
console.log(temp.sheet().tileW);

Q.scene("test_cards", function(stage) {
	stage.insert(
						multichoiceQ
//						rangetestform
//						new Q.ImageText({
//							photo: new Q.Medal({sheet: "basket_01_sheet", frame:0}),
//							label: new Q.UI.Text({label: "5", size: 16, type: Q.SPRITE_NONE}),
//							isSelectable: true,
//							fill: null,
//							x: 400,
//							y: 300,
//						})
	);
//	stage.insert(new Q.Medal({x: 400, y:300, sheet: "basket_01_sheet", frame:2}));
});
