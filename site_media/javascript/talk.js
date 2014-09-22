Q.component("Talk", {
	extend: {
		info: function(options) {
			this.stage.insert(new Q.Info(Q._defaults(options, {speaker: this})), this);
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

	}
});

Q.Sprite.extend("Info",{ 
	init: function(p) {
		this._super(Q._defaults(p, {
			z: 3,
			name: "Info",
			type: Q.SPRITE_NONE,
			time_spent: 0,
			duration: 10,
			speaker: null,
			asset: 'Icons/icon_info.png',
			showOnMiniMap: false,
		}));
		this.p.x = 0;
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



Q.Sprite.extend("QuestionChoices", {
	init: function(p) {
		this._super(p, {
			name: "QuestionChoices",
			type: Q.SPRITE_PURE_UI,
			collisionMask: Q.SPRITE_NONE,
			label: "Choice",
			isClickable: false,
			size: 16,
			family: 'Arial',
			h: 30,
		});

		console.log(this.p.label);
		if(this.p.isClickable) {
			this.p.size = 12;
		}

		this.add("Touch");
		this.on("touch");
		this.on("destroyme");
		this.on("inserted");
	},

	destroyme: function() {
		this.children.forEach(function(child) {
			child.destroy();
		});
		this.destroy();
	},


	draw: function(ctx) {
		var offset = 50;
		if(this.p.isClickable) {
			ctx.beginPath();
			ctx.rect(-this.p.w/2, -this.p.h/2, this.p.w, this.p.h);
			ctx.lineWidth = 1;
			ctx.strokeStyle = 'grey';
			ctx.stroke();
			ctx.beginPath();
			ctx.strokeStyle = 'black';
			ctx.arc(-this.p.w/2 + offset/2, 0, 5, 0, 2 * Math.PI, false);
			ctx.stroke();
		}
	},

	inserted: function() {
		var offset = 10;
		var height = 0;
		var l = 0;
		while(l != this.p.label.length) {
			var newlabel = this.p.label.substr(l, 100);
			var textUI = null;
			var textUI = new Q.UI.Text({label: newlabel, size: this.p.size, color: "black", y: height});
			if(this.p.textUI) {
			}
			else {
				this.p.textUI = textUI;
			}
			height += textUI.p.h;
			l += newlabel.length;
			this.stage.insert(textUI, this);
		}
		this.p.textUI.p.x = -this.p.w/2 + offset + this.p.textUI.p.w/2;
		if(this.p.isClickable)
			this.p.textUI.p.x += 50;

		this.p.h = height + 10; 
	},

	touch: function(e) {
		if(!this.p.isClickable)
			return;
		console.log("choice touched");

		this.p.question.status = 1;
		this.p.question.answer_index = this.p.index;
		this.p.listener.trigger("answered");
	},
});


Q.Sprite.extend("MyQuestion", {
	init: function(p) {
		this._super(p, {
			w: 300,
			h: 200,
			question_choices: [],
			type: Q.SPRITE_NONE,
			collisionMask: Q.SPRITE_NONE,
		});
		this.on("destroyme");
	},

	destroyme: function() {
		this.p.box.children.forEach(function(child) {
			child.trigger("destroyme");
		});
		this.p.box.destroy();
		this.destroy();
	},

	show: function(question) {
		text_height = 20;
		this.p.box = new Q.UI.Container({
			w: this.p.w,
			h: this.p.h,
			fill: "rgba(255,255,255,0.7)"
		});
		box = this.stage.insert(this.p.box, this);

		max_height = text_height + 2 * (question.choices.length + 1.5) * text_height;
		questionSprite = new Q.QuestionChoices({label: question.question.text, y: - max_height / 2 + text_height, w: this.p.w, question: question, listener: this.p.listener});
		box.insert(questionSprite);
		for(i = 0; i < question.choices.length; i++) {
			choice = question.choices[i];
			questionSprite = new Q.QuestionChoices({index: i, label: choice.text, y: questionSprite.p.y + questionSprite.p.h / 2 + 2 * text_height, w: this.p.w, isClickable:true, question: question, listener: this.p.listener});
			box.insert(questionSprite);
		}
		box.fit(20);
	},
});


Q.component("Question", {
	added: function() {
		this.entity.p.question_playing = false;
		this.entity.on("answered");
	},

	extend: {
		answered: function() {
			console.log("answered");
			this.p.myquestion.trigger("destroyme");
		},

		show_question: function(question) {
			console.log("show_question");
			
			question.status = 0; //Running
			this.p.myquestion = new Q.MyQuestion({w: Q.width - 50, h: Q.height, listener: this});
			this.stage.insert(this.p.myquestion, this);
			this.p.myquestion.show(question);
		},
	},
});



Q.Sprite.extend("Questionnaire", {
	init: function(p) {
		this._super(Q._defaults(p, {
			type: Q.SPRITE_NONE,
			collisionMask: Q.SPRITE_NONE,
		}));
		this.add("Question, Video");
	},

	show: function(wait) {
		console.log("Questionnaire.show");
		questionnaire = this;
		if(this.p.questions.status == 0){ // Running
			setTimeout(function(){questionnaire.show(true);}, 1000);
			return;
		}

		if(this.p.questions.status == 1) { // Finished
			console.log("Show next question");
			this.p.questions = this.p.questions.nextElement();
		}

		if(this.p.questions == null) {
			console.log("end of questions");
			this.oncompletion();

			Q.stageScene("Dialog", Q.STAGE_LEVEL_DIALOG, {dialog: "Congratulations! Go to Ram"});
			return;
		}

		if(this.p.questions instanceof MultipleChoiceQuestion) {
			console.log("instanceof Question");
			this.show_question(this.p.questions);
		}
		else if(this.p.questions instanceof Video) {
			console.log("instanceof Video");
			this.show_video(this.p.questions);
		}
		setTimeout(function(){questionnaire.show(true);}, 1000);
	},
});



