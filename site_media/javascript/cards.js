Q.UI.Layout.extend("ControlButtons", {
	init: function(p) {
		this._super(Q._defaults(p, {
			w: 100,
			h: 100,
			x: 0,
			y: 0,
			button_type: Q.ControlButtons.DONE, 
			layout: Q.UI.Layout.HORIZONTAL
		}));
		this.on("inserted");
	},

	inserted: function() {
		var callback_done = this.p.callback_done;
		var callback_next = this.p.callback_next;
		var context = this.p.context;
		if(this.p.button_type == Q.ControlButtons.DONE) {
			var b = this.insert(new Q.UI.Button({label: "Done", radius: 5, font: "weigth: 200, size: 24, family: Courier New", fontColor: "#F2ECE6", outlineWidth: 2, outlineColor: "#EBC299", stroke: "#F5E0CC", border: 2, fill: "#8F4700"}));
			b.on("click", function(){
				context[callback_done]();
			});
		}
		else if(this.p.button_type == Q.ControlButtons.NEXT) {
			var b = this.insert(new Q.UI.Button({label: "Next", radius: 5, font: "weigth: 200, size: 24, family: Courier New", fontColor: "#F2ECE6", outlineWidth: 2, outlineColor: "#EBC299", stroke: "#F5E0CC", border: 2, fill: "#8F4700"}));
			b.on("click", function(){
				context[callback_next]();
			});
		}
		this.fit(0);
	},
});
Q.ControlButtons.OK = 0;
Q.ControlButtons.OK_CANCEL = 1;
Q.ControlButtons.NEXT = 2;
Q.ControlButtons.DONE = 3;
Q.ControlButtons.YES_NO = 4;



/*
	To display the video
*/
function Video(content) {
	this.filename = content;
	this.status = -1;

	this.nextElement = function() {
		return this.next;
	};
}


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
	},

	inserted: function() {
		if(this.p.isSelectable) {
			this.p.bullet = new Q.Rectangle({radius: 10, type: Q.SPRITE_NONE});
			this.insert(this.p.bullet);
		}

		if(this.p.label)
			this.insert(this.p.label);

		this.fit(10);
	},

	touch: function() {
		console.log("touch");
		this.p.isSelected = !this.p.isSelected;
		if(this.p.isSelectable) {
			this.p.bullet.p.isSelected = !this.p.bullet.p.isSelected;
		}
	},
});
Q.ImageText.LEFT_POSITION = 1;
Q.ImageText.TOP_POSITION = 2;


function NumericInput(type, initial_value, min_value, max_value) {
	this.type = NumericInput.SPINNER;
	this.min_value = min_value;
	this.max_value = max_value;
	this.value = initial_value;
}
NumericInput.SPINNER = 1;
NumericInput.SLIDER = 1;


//question, choices, isSelectALL
Q.UI.Layout.extend("MultipleChoiceQuestion", {
	init: function(p) {
		this._super(Q._defaults(p, {
//			x: 400, 
//			y: 300,
			w: 400,
			h: 500,
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
		this.insert(this.p.question);
		for(var i = 0; i < this.p.choices.length; i++) {
			this.insert(this.p.choices[i]);
		}
		this.fit(10);
	},
});

/** Range Question Card
  * @param this.p.range - insert slider or spinner
  * @param this.p.question - question to display
  */
Q.UI.Layout.extend("RangeQuestion", {
	init: function(p) {
		this._super(Q._defaults(p, {
//			x: 400, 
//			y: 300,
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
			feature: Q.RangeQuestion.Slider,
		}));
		this.on("inserted");
	},

	inserted: function() {
		this.insert(this.p.question, this);
		if(this.p.range==Q.RangeQuestion.Slider){
			this.insert(new Q.UI.Slider({color: "#8F4700",},null));
		}
		else if(this.p.range==Q.RangeQuestion.Spinner){
			this.insert(new Q.UI.Spinner({color: "#8F4700",},null));
		}
		this.fit(10);
	},
});
Q.RangeQuestion.Slider = 1;
Q.RangeQuestion.Spinner = 2;

/** Info Card
  * @param this.p.video - video object
  * @param this.p.label - label object(text)
  */
Q.UI.Layout.extend("InfoQuestion", {
	init: function(p) {
		this._super(Q._defaults(p, {
//			x: 400, 
//			y: 300,
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

/*
	To be used when we want to ask a question that has a numeric answer
	'exit_type' defines how the question will be considered answered. For example,
	should there is "Ok" and "Cancel" button, or just "Continue" button.
*/
function NumericQuestion(question, input) {
	this.question = question;
	this.choices = input;
}


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
			w: 500,
			h: 400,
			type: Q.SPRITE_NONE,
			collisionMask: Q.SPRITE_NONE,
			separationType: 1,
			separation_y: 100,
			align: Q.UI.Layout.CENTER_ALIGN | Q.UI.Layout.START_TOP,
			status: Q.Form.INCOMPLETE,
			fill: "rgba(255, 255, 255, 1)",
			radius: 10,
			shadow: 5,
			stroke: "#B26B00",
			border: 15,
			index: 0,
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
		this.destroyed();
		this.children = [];
		this.insert(this.p.content[this.p.index]);
		this.p.index++;
		if(this.p.content[this.p.index]!=null){
			this.insert(new Q.ControlButtons({context: this, button_type: Q.ControlButtons.NEXT, callback_next: "inserted"}));
		}
		else{
			this.insert(new Q.ControlButtons({context: this, callback_done: "done"}));
		}
	},


	done: function() {
		alert("done");
	},

	next: function() {
		if(this.p.next == null)
			return null;
		return this.p.next;
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

    drawRadius: function(ctx) {
      Q.UI.roundRect(ctx,this.p);
      this.addShadow(ctx);
      ctx.fillStyle = this.p.fill;
      ctx.fill();
      ctx.drawImage(Q.asset("cards.jpg"),-this.p.cx,-this.p.cy, 500, 400);
      if(this.p.border) {
        this.clearShadow(ctx);
        ctx.lineWidth = this.p.border;
        ctx.stroke();
        ctx.strokeStyle = "#EBC299";
        ctx.lineWidth -= 10;
        ctx.stroke();
      }
    },

    drawSquare: function(ctx) {
      this.addShadow(ctx);
      if(this.p.fill) { 
        ctx.fillRect(-this.p.cx,-this.p.cy,
                      this.p.w,this.p.h);
      }

      if(this.p.border) {
        this.clearShadow(ctx);
        ctx.lineWidth = this.p.border;
        ctx.strokeRect(-this.p.cx,-this.p.cy,
                        this.p.w,this.p.h);
      }
    },

    draw: function(ctx) {
      if(this.p.hidden) { return false; }
      if(!this.p.border && !this.p.fill) { return; }

      ctx.globalAlpha = this.p.opacity;
      if(this.p.frame === 1 && this.p.highlight) {
        ctx.fillStyle = this.p.highlight;
      } else {
        ctx.fillStyle = this.p.fill;
      }
      ctx.strokeStyle = this.p.stroke;
      if(this.p.radius > 0) { 
        this.drawRadius(ctx);
      } else {
        this.drawSquare(ctx);
      }
    }
});

Q.Form.INCOMPLETE = 1;
Q.Form.COMPLETE = 2;


var testform = new Q.Form(
				{
					content: [
						new Q.MultipleChoiceQuestion({
							question: new Q.ImageText({
								label: new Q.UI.Text({label: "Did you?", type: Q.SPRITE_NONE, color: "#8F4700", outlineColor: "#F2ECE6", outlineWidth: 4, family: "Courier New", weight: 800,}),
								fill: null,
							}), 
							choices: [
								new Q.ImageText({
									label: new Q.UI.Text({label: "Yes", type: Q.SPRITE_NONE}),
									isSelectable: true,
									fill: null,
								}), 
								new Q.ImageText({
									label: new Q.UI.Text({label: "No", type: Q.SPRITE_NONE}),
									isSelectable: true,
									fill: null,
								}), 
							],
						})
					]
				}
			);

var rangetestform = new Q.Form(
				{
					content: [
						new Q.RangeQuestion({
							question: new Q.ImageText({
								label: new Q.UI.Text({label: "How much do you want to invest?", type: Q.SPRITE_NONE, color: "#8F4700", outlineColor: "#F2ECE6", outlineWidth: 4, family: "Courier New", weight: 800,}),
								fill: null,
							}),
							feature: Q.RangeQuestion.Slider,
						}),
						new Q.MultipleChoiceQuestion({
							question: new Q.ImageText({
								label: new Q.UI.Text({label: "Did you?", type: Q.SPRITE_NONE, color: "#8F4700", outlineColor: "#F2ECE6", outlineWidth: 4, family: "Courier New", weight: 800,}),
								fill: null,
							}), 
							choices: [
								new Q.ImageText({
									label: new Q.UI.Text({label: "Yes", type: Q.SPRITE_NONE}),
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
								label: new Q.UI.Text({label: "How much do you want to invest?", type: Q.SPRITE_NONE, color: "#8F4700", outlineColor: "#F2ECE6", outlineWidth: 4, family: "Courier New", weight: 800,}),
								fill: null,
							}),
							feature: Q.RangeQuestion.Spinner,
						}),
					]
				}
			);

Q.scene("test", function(stage) {
	stage.insert(rangetestform);
});
