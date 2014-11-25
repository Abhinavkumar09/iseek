Q.UI.Layout.extend("ControlButtons", {
	init: function(p) {
		this._super(Q._defaults(p, {
			w: Q.width,
			h: 100,
			z: 10,
			button_type: Q.ControlButtons.DONE, 
			layout: Q.UI.Layout.HORIZONTAL,
			separation_x: 10,

			callback_ok: "ok",
			callback_done: "done",
			callback_next: "next",
			callback_prev: "prev",
			callback_back: "back",
			callback_sell: "sell",
			callback_buy: "buy",
			callback_edit: "edit",
			callback_cancel: "cancel",
		}));
		this.on("inserted");
	},

	destroyed: function() {
		this.children.forEach(function(child) {
			child.destroy();
		});
	},

	inserted: function() {
		var callback_ok = this.p.callback_ok;
		var callback_done = this.p.callback_done;
		var callback_next = this.p.callback_next;
		var callback_prev = this.p.callback_prev;
		var callback_buy = this.p.callback_buy;
		var callback_sell = this.p.callback_sell;
		var callback_back = this.p.callback_back;
		var callback_edit = this.p.callback_edit;
		var callback_cancel = this.p.callback_cancel;

		var context = this.p.context;

		if(this.p.button_type & Q.ControlButtons.PREV) {
			var b = this.insert(new Q.UI.Button({label: "Prev", radius: 5, stroke: "#F5E0CC", border: 2, fill: "#8F4700"}));
			b.on("click", function(){
				context[callback_prev]();
			});
		}
		if(this.p.button_type & Q.ControlButtons.BACK) {
			var b = this.insert(new Q.UI.Button({label: "Back", radius: 5, stroke: "#F5E0CC", border: 2, fill: "#8F4700"}));
			b.on("click", function(){
				context[callback_back]();
			});
		}
		if(this.p.button_type & Q.ControlButtons.CANCEL) {
			var b = this.insert(new Q.UI.Button({label: "Cancel", radius: 5, stroke: "#F5E0CC", border: 2, fill: "#8F4700"}));
			b.on("click", function(){
				context[callback_cancel]();
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
			var b = this.insert(new Q.UI.Button({z: 10, label: "Sell", radius: 5, stroke: "#F5E0CC", border: 2, fill: "#8F4700"}));
			b.on("click", function(){
				context[callback_sell]();
			});
		}
		if(this.p.button_type & Q.ControlButtons.NEXT) {
			var b = this.insert(new Q.UI.Button({label: "Next", radius: 5, stroke: "#F5E0CC", border: 2, fill: "#8F4700"}));
			b.on("click", function(){
				context[callback_next]();
			});
		}
		if(this.p.button_type & Q.ControlButtons.EDIT) {
			var b = this.insert(new Q.UI.Button({label: "Edit", radius: 5, stroke: "#F5E0CC", border: 2, fill: "#8F4700"}));
			b.on("click", function(){
				context[callback_edit]();
			});
		}
		if(this.p.button_type & Q.ControlButtons.OK) {
			var b = this.insert(new Q.UI.Button({label: "Ok", radius: 5, stroke: "#F5E0CC", border: 2, fill: "#8F4700"}));
			b.on("click", function(){
				context[callback_ok]();
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
Q.ControlButtons.BACK = 128;
Q.ControlButtons.EDIT = 256;



/*
	To display the video
*/
Q.UI.Layout.extend("Video", {
	init: function(p) {
		this._super(Q._defaults(p, {
			w: Q.width,
			h: Q.height,
			type: Q.SPRITE_NONE,
			collisionMask: Q.SPRITE_NONE,
			radius: 0,
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
		//console.log("x, y, w, h: " + (-this.p.w/2) + ", " + (-this.p.h/2) + ", " + this.p.w + ", " + this.p.h);
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

//		if(adjustedP.isSelectable) {
//			adjustedP.type =  Q.SPRITE_NONE;
//		}
		this._super(Q._defaults(adjustedP, {layout: layout, }));

		this.on("inserted");
		if(this.p.isSelectable) {
			this.add("Touch");
			this.on("touch");
		}
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
			type: Q.SPRITE_PURE_UI,
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


/*
	disabled: is It disabled right now?
	action_card: Expects as input a card that should be displayed if the tile is clicked
*/
Q.ImageText.extend("Tile", {
	init: function(p) {
		this._super(Q._defaults(p, {
			isSelected: false,
		}));

		this.add("Touch");
		this.on("touch");
	},

	touch: function() {
		console.log("tile touch");
		if(this.p.disabled == false) {
			// display the next card
			if(this.p.action_card) {
				this.p.action_card.p.back_card = this.p.card;
				var stage = this.stage;
				this.p.card.destroy();
				stage.insert(this.p.action_card);
			}
			else if (this.p.action){
				if(this.p.context) 
					this.p.context[this.p["action"]](this.p.action_params);
				else
					this[this.p["action"]](this.p.action_params);
			}
		}
		else{
			this.p.isSelected = true;
		}
	},
});


/*
	Cards are supposed to be shown outside the virtual world, on the middle of the screen. I.e., irrespective of the player's positions
	or some other Sprite's position. This of it as when you read a card, your eyes focus on the card and all other things are blurred out.

	This also means that the cards should not be inserted inside any container. It should be inserted directly on the stage.
*/
Q.UI.Layout.extend("Card", {
	init: function(p) {
		this._super(Q._defaults(p, {
			sort: true,
			z: 10,
			x: Q.width/2,
			y: Q.height/2,
			w: Q.width,
			h: Q.height,
			type: Q.SPRITE_NONE,
			collisionMask: Q.SPRITE_NONE,
			separationType: 1,
			separation_y: 10,
			align: Q.UI.Layout.CENTER_ALIGN | Q.UI.Layout.START_TOP,
			fill: "rgba(255, 255, 255, 1)",
			radius: 0,
		}));
	},

	destroyed: function() {
		if(this.p.stage)
			this.p.stage.unpause();
		else
			this.p.context.unpause();
		this.children.forEach(function(child) {
			child.destroy();
		});
	},

	movefront: function() {
		if(this.p.stage)
			this.p.stage.pause();
		else
			this.p.context.pause();
	},

	inserted: function() {
		this.movefront();
	},

	show: function(content) {
		this.p.content = content;
		this.destroyed();
		this.inserted();
	},

	done: function() {
		this.destroy();
	},

	ok: function() {
		this.destroy();
	}

});

/** Info Card
  */
Q.Card.extend("StageInfoCard", {
	init: function(p) {
		this._super(Q._defaults(p, {
			type: Q.SPRITE_NONE,
			collisionMask: Q.SPRITE_NONE,
			align: Q.UI.Layout.CENTER_ALIGN,
			separation_y: 10,
			layout: Q.UI.Layout.VERTICAL,
			border: 1,
			radius: 3,
		}));
		this.on("inserted");
	},

	inserted: function() {
		this.movefront();

		var box = new Q.UI.Layout({layout: Q.UI.Layout.HORIZONTAL, ifFit: true});
		this.insert(box);
		box.insert(this.p.speaker);

//		console.log("description.p.w = " + this.p.description.p.w);
//		this.p.description.p.label.p.w = Math.min(this.p.description.p.label.p.w, Q.width -10 - this.p.speaker.p.w);
//		console.log("description.p.w = " + this.p.description.p.label.p.w);
		box.insert(this.p.description);

		this.insert(new Q.ControlButtons({context: this, button_type: Q.ControlButtons.OK, y: this.p.cy - 25}));
		this.fit(10);
	},
});



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

		* back_card: If this card is shown as a result of a tile card, then we want a button to go back

	Design:
		The card is 600x400
			The top left 100x100 is for the image
			the top right 100x500 is for the name
			the bottom 50x600 is for the buttons
			the 50x600 before bottom is for the price/quantity
			the middle part is for description
	*/
Q.Card.extend("Product", {
	init: function(p) {
		this._super(Q._defaults(p, {
			layout: Q.UI.Layout.NONE,
		}));
		this.on("inserted");
	},

	inserted: function() {
		this.movefront();

		this.p.image.p.x = -this.p.cx + 50;
		this.p.image.p.y = -this.p.cy + 50;

		this.p.name.p.x = this.p.cx - 250;
		this.p.name.p.y = -this.p.cy + 50;

		this.p.description.p.x = 0;
		this.p.description.p.y = 0;

		this.insert(this.p.image);
		this.insert(this.p.name);
		this.insert(this.p.description);

		var type = 0;

		if(this.p.back_card)
			type += Q.ControlButtons.BACK;

		if(this.p.buyable) {
			this.p.price_text = new Q.UI.Text({label: "Price: " + this.p.price, x: -this.p.cx + 150, y: this.p.cy - 100});
			this.insert(this.p.price_text);

			this.p.quantity_text = new Q.UI.Text({label: "Quantity", x: this.p.cx - 200, y: this.p.cy - 100});
			this.p.quantity = new Q.UI.Spinner({color: "#8F4700", x: this.p.cx - 100, y: this.p.cy - 100}, null);
			this.insert(this.p.quantity_text);
			this.insert(this.p.quantity);
			type += Q.ControlButtons.BUY;
			this.insert(new Q.ControlButtons({context: this, button_type: type, y: this.p.cy - 25}));
		}
		else if(this.p.sellable) {
			this.p.price_text = new Q.UI.Text({label: "Price", x: -this.p.cx + 50, y: this.p.cy - 100});
			this.p.price = new Q.UI.Spinner({color: "#8F4700", x: -this.p.cx + 150, y: this.p.cy - 100}, null);
			this.insert(this.p.price_text);
			this.insert(this.p.price);
			type += Q.ControlButtons.SELL;
			this.insert(new Q.ControlButtons({context: this, button_type: type, y: this.p.cy - 25}));
		}

	},

	back: function() {
		console.log("go back");
		this.destroy();
		this.stage.insert(this.p.back_card);
	},

	buy: function() {
		console.log("buy");
	},

	sell: function() {
		console.log("sell");
	},
});

Q.Card.extend("BusinessCard", {
	init: function(p) {
		this._super(Q._defaults(p, {
			layout: Q.UI.Layout.NONE,
		}));
		this.on("inserted");
	},

	inserted: function() {
		this.movefront();

		var player = new Q.Person({x: -this.p.w/2 + 50, y: -this.p.h/2 + 75, sheet: this.p.person.sheet, frame: this.p.person.frame});
		this.insert(player);

		var rows = [];
		var name = new Q.UI.Text({label: "Name", x: 0, y: 0});
		var ninput = new Q.UI.Text({label: this.p.person.name, x: 0, y: 0});
		rows.push([name, ninput]);

		var address = new Q.UI.Text({label: "Address", x: 0, y: 0});
		var ainput = new Q.UI.Text({label: this.p.person.address, x: 0, y: 0});
		rows.push([address, ainput]);

		var phone = new Q.UI.Text({label: "Phone", x: 0, y: 0});
		var pinput = new Q.UI.Text({label: this.p.person.phone, x: 0, y: 0});
		rows.push([phone, pinput]);

		var skill = new Q.UI.Text({label: "Skill", x: 0, y: 0});
		var sinput = new Q.UI.Text({label: this.p.person.skill, x: 0, y: 0});
		rows.push([skill, sinput]);

		var con1 = new Q.UI.TableLayout({align: [Q.UI.TableLayout.LEFT_ALIGN | Q.UI.TableLayout.CENTER_VERTICAL_ALIGN, Q.UI.TableLayout.LEFT_ALIGN | Q.UI.TableLayout.CENTER_VERTICAL_ALIGN], colwidths: [0.5, 0.5], x: 50, y: 150 - this.p.h/2, rows: rows, w: this.p.w - 100, h: 200});
		this.insert(con1);

		var shg_card = new Q.SHGCard(this.p);

		var shg = new Q.Tile({
//			label: new Q.UI.Text({label: "SHG"}), 
			image: new Q.Sprite({asset: game.BUILDING.Workshop}),
			x: -this.p.w/2 + 50, 
			y: -this.p.h/2 + 275,
			disabled: false,
			action_card: shg_card,
			card: this,
		});
		this.insert(shg);


		rows = [];
		name = new Q.UI.Text({label: "Name", x: 0, y: 0});
		ninput = new Q.UI.Text({label: this.p.SHG.name, x: 0, y: 0});
		rows.push([name, ninput]);

		address = new Q.UI.Text({label: "Address", x: 0, y: 0});
		ainput = new Q.UI.Text({label: this.p.SHG.address, x: 0, y: 0});
		rows.push([address, ainput]);

		var con2 = new Q.UI.TableLayout({align: [Q.UI.TableLayout.LEFT_ALIGN | Q.UI.TableLayout.CENTER_VERTICAL_ALIGN, Q.UI.TableLayout.LEFT_ALIGN | Q.UI.TableLayout.CENTER_VERTICAL_ALIGN], colwidths: [0.5, 0.5], x: 50, y: 350 - this.p.h/2, rows: rows, w: this.p.w - 100, h: 200});
		this.insert(con2);

		var type = Q.ControlButtons.OK;
		type += Q.ControlButtons.EDIT;
		this.insert(new Q.ControlButtons({context: this, button_type: type, y: this.p.cy - 25}));

	},

	ok: function() {
		this.destroy();
		this.p.context[this.p.oncompletion]();
	},

	edit: function() {
		var card = new Q.BusinessCardForm(this.p);
		this.stage.insert(card);

		this.destroy();
	},

});





Q.Card.extend("BusinessCardForm", {
	init: function(p) {
		this._super(Q._defaults(p, {
			layout: Q.UI.Layout.NONE,
		}));
		this.on("inserted");
	},


	inserted: function() {
		this.movefront();

		var player = new Q.Person({x: -this.p.w/2 + 50, y: -this.p.h/2 + 75, sheet: this.p.person.sheet, frame: this.p.person.frame});
		this.insert(player);

		var rows = [];
		var name = new Q.UI.WrappableText({label: "Name", w: 100, h: 300, x: 0, y: 0});
		this.ninput = new Q.UI.HTMLElement({html: "<input type='text'value='" + this.p.person.name + "' />", x: 0, y: 0});
		rows.push([name, this.ninput]);

		var address = new Q.UI.WrappableText({label: "Address", w: 100, x: 0, y: 0});
		this.ainput = new Q.UI.HTMLElement({html: "<textarea width= 200 height = 50>" + this.p.person.address + "</textarea>", x: 0, y: 0});
		rows.push([address, this.ainput]);

		var phone = new Q.UI.WrappableText({label: "Phone", w:100, x: 0, y: 0});
		this.pinput = new Q.UI.HTMLElement({html: "<input type='text'value='" + this.p.person.phone + "' />", x: 0, y: 0});
		rows.push([phone, this.pinput]);

		var skill = new Q.UI.WrappableText({label: "Skill", w: 100, x: 0, y: 0});
		this.sinput = new Q.UI.HTMLElement({html: "<select> <option value='Knitting'>Knitting</option><option value='Weaving'>Weaving</option><option value='Sowing'>Sowing</option> </select>", x: 0, y: 0});
		rows.push([skill, this.sinput]);


		/*
		// To be used for the real business part, where the player will tell us the details of the SHG. For now, the player is assigned a SHG
		var members = new Q.UI.WrappableText({label: "How many people are in your SHG?", value: 0, w: this.p.w/2});
		this.membersinput = new Q.UI.Spinner({});
		rows.push([members, this.membersinput]);

		var money = new Q.UI.WrappableText({label: "How much amount will each person put in at the beginning?", w: this.p.w/2});
		this.moneyinput = new Q.UI.HTMLElement({html: "<input type='text'value='" + "' />", x: 0, y: 0});
		rows.push([money, this.moneyinput]);

		var hours = new Q.UI.WrappableText({label: "How many hours will each person put in?", value: 0, w: this.p.w/2});
		this.hoursinput = new Q.UI.Spinner({});
		rows.push([hours, this.hoursinput]);
		*/
		var con1 = new Q.UI.TableLayout({align: [Q.UI.TableLayout.LEFT_ALIGN | Q.UI.TableLayout.CENTER_VERTICAL_ALIGN, Q.UI.TableLayout.LEFT_ALIGN | Q.UI.TableLayout.CENTER_VERTICAL_ALIGN], colwidths: [0.60, 0.40], x: 50, y: 150 - this.p.h/2, rows: rows, w: this.p.w - 100, h: 200});
		this.insert(con1);

		var type = Q.ControlButtons.CANCEL;
		type += Q.ControlButtons.DONE;
		this.insert(new Q.ControlButtons({context: this, button_type: type, y: this.p.cy - 25}));

	},

	cancel: function() {
		var card = new Q.BusinessCard(this.p);
		this.stage.insert(card);
		this.destroy();
	},

	done: function() {
		var person = this.p.person;
		$(this.ninput.el).find('input:text, input:password, input:file, select, textarea')
			.each(function() {
				person.name = $(this).val();
		});
		$(this.ainput.el).find('input:text, input:password, input:file, select, textarea')
			.each(function() {
				person.address = $(this).val();
		});
		$(this.pinput.el).find('input:text, input:password, input:file, select, textarea')
			.each(function() {
				person.phone = $(this).val();
		});
		$(this.sinput.el).find('input:text, input:password, input:file, select, textarea')
			.each(function() {
				person.skill = $(this).val();
		});
		game.sync_data["employee"] = true;
		var card = new Q.BusinessCard(this.p);
		this.stage.insert(card);

		this.destroy();
	},
});





/**
	Important variables to be passed:
		content: an array of all the questions/videos/text to be shown in this form
		exit_type: defines how the question will be considered answered. For example,
			should there is "Ok" and "Cancel" button, or just "Continue" button.
*/
Q.Card.extend("Form", {
	init: function(p) {
		this._super(Q._defaults(p, {
			align: 0,
			layout: Q.UI.Layout.NONE,
			status: Q.Form.INCOMPLETE,
			index: 0,
		}));
		//, context: Mira, func: "onquestioncompletion"
		this.on("inserted");
	},

	inserted: function() {
		this.movefront();

		this.insert(this.p.content[this.p.index]);
		var type = 0;
		if(this.p.content[this.p.index+1]!=null)
			type = type | Q.ControlButtons.NEXT;
		else
			type = type | Q.ControlButtons.DONE;

		if(this.p.content[this.p.index-1]!=null)
			type = type | Q.ControlButtons.PREV;

		this.insert(new Q.ControlButtons({context: this, button_type: type, y: this.p.cy - 25}));
	},


	done: function() {
		this.destroy();
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



Q.Card.extend("TileCard", {
	init: function(p) {
		this._super(Q._defaults(p, {
			layout: Q.UI.Layout.NONE,
		}));
		this.on("inserted");
	},

	inserted: function() {
		this.movefront();

		if(this.p.grid == Q.TileCard.GRID_3_1) {
			count_r = 1;
			count_c = 3;
		}
		else if(this.p.grid == Q.TileCard.GRID_2_1) {
			count_r = 1;
			count_c = 2;
		}
		else if(this.p.grid == Q.TileCard.GRID_2_2) {
			count_r = 2;
			count_c = 2;
		}
		else if(this.p.grid == Q.TileCard.GRID_3_2) {
			count_r = 2;
			count_c = 3;
		}
		else if(this.p.grid == Q.TileCard.GRID_3_3) {
			count_r = 3;
			count_c = 3;
		}
		for(var i = 0; i < this.p.tiles.length; i++) {
			console.log("tile: " + i);
			var r = Math.floor(i / count_c);
			var c = i % count_c;
			this.p.tiles[i].p.x = -this.p.cx + (c + 0.5) * this.p.w / count_c;
			this.p.tiles[i].p.y = -this.p.cy + (r + 0.5) * this.p.h / count_r;

			this.p.tiles[i].p.card = this;
			this.insert(this.p.tiles[i]);
		}

		var type = Q.ControlButtons.OK;
		this.insert(new Q.ControlButtons({context: this, button_type: type, y: this.p.cy - 25}));

	},

	ok: function() {
		this.destroy();
	}
});

Q.TileCard.GRID_2_1 = 1;
Q.TileCard.GRID_2_2 = 2;
Q.TileCard.GRID_3_2 = 4;
Q.TileCard.GRID_3_3 = 8;
Q.TileCard.GRID_3_1 = 16;


Q.TileCard.extend("SHGCard", {
	init: function(p) {
		this._super(Q._defaults(p, {
			grid: Q.TileCard.GRID_3_2,
		}));

		this.p.tiles = [];
		var people = this.p.SHG.people;
		for(p in people) {
			var person = new Q.Tile({
				image: new Q.Sprite({sheet: people[p].sheet, frame: people[p].frame}), 
				disabled: true,
				card: this,
			});
			this.p.tiles.push(person);
		}
	},

	cancel: function() {
		this.stage.insert(this.p.back_card);
		this.destroy();
	},

});



Q.Card.extend("ActivityCard", {
	init: function(p) {
		this._super(Q._defaults(p, {
			layout: Q.UI.Layout.NONE,
			grid: Q.TileCard.GRID_3_2,
			// type: Q.ControlButtons.BACK,
		}));
		this.on("inserted");
	},

	inserted: function() {
		this.p.image.p.x = -this.p.cx + 50;
		this.p.image.p.y = -this.p.cy + 50;

		this.p.name.p.x = this.p.cx - 300;
		this.p.name.p.y = -this.p.cy + 150;

		this.p.description.p.x = 0;
		this.p.description.p.y = 0;

		this.insert(this.p.image);
		this.insert(this.p.name);
		this.insert(this.p.description);

		var type = 0;
		type += Q.ControlButtons.DONE;		

		this.insert((new Q.ControlButtons({context: this, button_type: type, y: this.p.cy - 25})));

		this.insert(new Q.HealthBar({x: -120, y: 50, scoreUpto: this.p.scoreUpto[0]}));
		this.insert(new Q.UI.Text({x: -120, y: 110, label: "Mind"}));
		this.insert(new Q.HealthBar({x: 0, y: 50, scoreUpto: this.p.scoreUpto[1]}));
		this.insert(new Q.UI.Text({x: 0, y: 110, label: "Body"}));
		this.insert(new Q.HealthBar({x: 120, y: 50, scoreUpto: this.p.scoreUpto[2]}));
		this.insert(new Q.UI.Text({x: 120, y: 110, label: "Relations"}));
	},

	back: function() {
		console.log("go back");
		this.destroy();
		this.stage.insert(this.p.back_card);
	},

	done: function() {
		console.log("done");
		this.destroy();
	},
});
