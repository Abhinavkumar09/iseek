Q.UI.Container.extend("Finance", {
	init: function(p) {
		this._super(p, {
			name: "Finance",
			z: 1,
			gravity: 0,
			w: 150,
			h: 50,
			type: Q.SPRITE_DEFAULT,
			isInteractable: true,
			color : "#3366FF",
			dragging: false,
			dragable: false
		});

		if(this.p.isInteractable) {
			this.on("touch");
			this.on("touchEnd");
			if(this.p.dragable){
				this.on("drag");
			}
		}
	},

	drag: function(touch) {
		console.log("material dragging");
        this.p.dragging = true;
        this.p.x = touch.origX + touch.dx;
        this.p.y = touch.origY + touch.dy;
    },

    touch: function(touch){
    	console.log("material touched");
    	//this.p.dragging = true;
    },

	touchEnd: function(touch) {
		console.log("material touched");
		//alert("Doin it!");
		this.p.dragging = false;
	},

	draw: function(ctx){
		ctx.lineWidth= 2;
		ctx.lineCap= "round";
		ctx.lineJoin= "miter";
		ctx.miterLimit= 10;
		ctx.fillStyle = this.p.color;
		ctx.clearRect(-this.p.w/2,-this.p.h/2,this.p.w,this.p.h);
		ctx.fillRect(-this.p.w/2,-this.p.h/2,this.p.w,this.p.h);
		//ctx.strokeRect(-this.p.w/2,-this.p.h/2,this.p.w,this.p.h);
		ctx.setFillColor(1, 1, 1, 1.0);
		var fontSize = 30;
		ctx.font = fontSize + "px sans-serif";
		var textSize = ctx.measureText(this.p.name);
		ctx.textAlign = 'center';
		ctx.textBaseline = 'middle';
		ctx.fillText(this.p.name,0,0);
	    //var button = this.insert(new Q.UI.Button({ x: -85, y: -25, z:5, fill: this.p.color,
                                           //label: "Finance" }));
	    //button.on("click",function() {
	    	//console.log("EEEE");
	    	//console.log(this.p.x);
	    //});
	}
});



Q.UI.Container.extend("HR", {
	init: function(p) {
		this._super(p, {
			name: "HR",
			z: 1,
			gravity: 0,
			w: 150,
			h: 50,
			type: Q.SPRITE_DEFAULT,
			isInteractable: true,
			color : "#3366FF",
			dragging: false,
			dragable: false
		});

		if(this.p.isInteractable) {
			this.on("touch");
			this.on("touchEnd");
			if(this.p.dragable){
				this.on("drag");
			}
		}
	},

	drag: function(touch) {
		console.log("material dragging");
        this.p.dragging = true;
        this.p.x = touch.origX + touch.dx;
        this.p.y = touch.origY + touch.dy;
    },

    touch: function(touch){
    	console.log("material touched");
    	//this.p.dragging = true;
    },

	touchEnd: function(touch) {
		console.log("material touched");
		//alert("Doin it!");
		this.p.dragging = false;
	},

	draw: function(ctx){
		ctx.lineWidth= 2;
		ctx.lineCap= "round";
		ctx.lineJoin= "miter";
		ctx.miterLimit= 10;
		ctx.fillStyle = this.p.color;
		ctx.clearRect(-this.p.w/2,-this.p.h/2,this.p.w,this.p.h);
		ctx.fillRect(-this.p.w/2,-this.p.h/2,this.p.w,this.p.h);
		//ctx.strokeRect(-this.p.w/2,-this.p.h/2,this.p.w,this.p.h);
		ctx.setFillColor(1, 1, 1, 1.0);
		var fontSize = 30;
		ctx.font = fontSize + "px sans-serif";
		var textSize = ctx.measureText(this.p.name);
		ctx.textAlign = 'center';
		ctx.textBaseline = 'middle';
		ctx.fillText(this.p.name,0,0);
	    //var button = this.insert(new Q.UI.Button({ x: -85, y: -25, z:5, fill: this.p.color,
                                           //label: "Finance" }));
	    //button.on("click",function() {
	    	//console.log("EEEE");
	    	//console.log(this.p.x);
	    //});
	}
});

Q.UI.Container.extend("Operation", {
	init: function(p) {
		this._super(p, {
			name: "Operation",
			z: 1,
			gravity: 0,
			w: 150,
			h: 50,
			type: Q.SPRITE_DEFAULT,
			isInteractable: true,
			color : "#3366FF",
			dragging: false,
			dragable: false
		});

		if(this.p.isInteractable) {
			this.on("touch");
			this.on("touchEnd");
			if(this.p.dragable){
				this.on("drag");
			}
		}
	},

	drag: function(touch) {
		console.log("material dragging");
        this.p.dragging = true;
        this.p.x = touch.origX + touch.dx;
        this.p.y = touch.origY + touch.dy;
    },

    touch: function(touch){
    	console.log("material touched");
    	//this.p.dragging = true;
    },

	touchEnd: function(touch) {
		console.log("material touched");
		//alert("Doin it!");
		if(this.p.dragging){
			this.p.dragging = false;
		}
		else{
			Q.stageScene('optionsOP',1);
		}

	},

	draw: function(ctx){
		ctx.lineWidth= 2;
		ctx.lineCap= "round";
		ctx.lineJoin= "miter";
		ctx.miterLimit= 10;
		ctx.fillStyle = this.p.color;
		ctx.clearRect(-this.p.w/2,-this.p.h/2,this.p.w,this.p.h);
		ctx.fillRect(-this.p.w/2,-this.p.h/2,this.p.w,this.p.h);
		//ctx.strokeRect(-this.p.w/2,-this.p.h/2,this.p.w,this.p.h);
		ctx.setFillColor(1, 1, 1, 1.0);
		var fontSize = 30;
		ctx.font = fontSize + "px sans-serif";
		var textSize = ctx.measureText(this.p.name);
		ctx.textAlign = 'center';
		ctx.textBaseline = 'middle';
		ctx.fillText(this.p.name,0,0);
	    //var button = this.insert(new Q.UI.Button({ x: -85, y: -25, z:5, fill: this.p.color,
                                           //label: "Finance" }));
	    //button.on("click",function() {
	    	//console.log("EEEE");
	    	//console.log(this.p.x);
	    //});
	}
});

Q.UI.Container.extend("Sales", {
	init: function(p) {
		this._super(p, {
			name: "Sales",
			z: 1,
			gravity: 0,
			w: 150,
			h: 50,
			type: Q.SPRITE_DEFAULT,
			isInteractable: true,
			color : "#3366FF",
			dragging: false,
			dragable: false
		});

		if(this.p.isInteractable) {
			this.on("touch");
			this.on("touchEnd");
			if(this.p.dragable){
				this.on("drag");
			}
		}
	},

	drag: function(touch) {
		console.log("material dragging");
        this.p.dragging = true;
        this.p.x = touch.origX + touch.dx;
        this.p.y = touch.origY + touch.dy;
    },

    touch: function(touch){
    	console.log("material touched");
    	//this.p.dragging = true;
    },

	touchEnd: function(touch) {
		console.log("material touched");
		//alert("Doin it!");
		this.p.dragging = false;
	},

	draw: function(ctx){
		ctx.lineWidth= 2;
		ctx.lineCap= "round";
		ctx.lineJoin= "miter";
		ctx.miterLimit= 10;
		ctx.fillStyle = this.p.color;
		ctx.clearRect(-this.p.w/2,-this.p.h/2,this.p.w,this.p.h);
		ctx.fillRect(-this.p.w/2,-this.p.h/2,this.p.w,this.p.h);
		//ctx.strokeRect(-this.p.w/2,-this.p.h/2,this.p.w,this.p.h);
		ctx.setFillColor(1, 1, 1, 1.0);
		var fontSize = 30;
		ctx.font = fontSize + "px sans-serif";
		var textSize = ctx.measureText(this.p.name);
		ctx.textAlign = 'center';
		ctx.textBaseline = 'middle';
		ctx.fillText(this.p.name,0,0);
	    //var button = this.insert(new Q.UI.Button({ x: -85, y: -25, z:5, fill: this.p.color,
                                           //label: "Finance" }));
	    //button.on("click",function() {
	    	//console.log("EEEE");
	    	//console.log(this.p.x);
	    //});
	}
});


//===========================================


Q.UI.Container.extend("CutSt", {
	init: function(p) {
		this._super(p, {
			name: "Cutting Station",
			z: 1,
			gravity: 0,
			w: 150,
			h: 50,
			type: Q.SPRITE_DEFAULT,
			isInteractable: true,
			color : "#3366FF",
			dragging: false,
			dragable: true,
			align: "center",
			infoShow: false,
			info: "Where you cut\nthe materials to\nbe weaved."
		});

		if(this.p.isInteractable) {
			this.on("touch");
			this.on("touchEnd");
			if(this.p.dragable){
				this.on("drag");
			}
		}
	},

	drag: function(touch) {
		console.log("material dragging");
        this.p.dragging = true;
        this.p.x = touch.origX + touch.dx;
        this.p.y = touch.origY + touch.dy;
    },

    touch: function(touch){
    	console.log("material touched");
    	//this.p.dragging = true;
    },

	touchEnd: function(touch) {
		//console.log("material touched");
		if(this.p.dragging!=true){
			console.log(this.p.infoShow);
			if(this.p.infoShow==false && Q.stage().info!=this.p.name){
					for(var item in Q.stage().obj){
						if(Q.stage().obj[item].p.box!=null){
							Q.stage().obj[item].p.box.destroy();
							Q.stage().obj[item].p.infoShow = false;
						}
					}
					this.p.box = Q.stage().insert(new Q.UI.Container({
			    		x: this.p.x, y: this.p.y, fill: "rgba(0,0,0,0.8)"
				  	}));
					Q.stage().insert(new Q.UI.Text({
				        label: this.p.info,
				        align: "center",
				        color: "white"
				    }), this.p.box);
				    this.p.box.fit(20);
				    this.p.infoShow = this.p.name;
				    Q.stage().info = this.p.name;
			}
			else{
				if(this.p.box!=null){
					this.p.box.destroy(this.p.box);
					this.p.box=null;
				}
				Q.stage().info=false;
				this.p.infoShow=false;
			}
			console.log(this.p.infoShow);
		}
		else{
			this.p.dragging = false;
		}
	},

	draw: function(ctx){
		ctx.lineWidth= 2;
		ctx.lineCap= "round";
		ctx.lineJoin= "miter";
		ctx.miterLimit= 10;
		ctx.fillStyle = this.p.color;
		ctx.clearRect(-this.p.w/2,-this.p.h/2,this.p.w,this.p.h);
		ctx.fillRect(-this.p.w/2,-this.p.h/2,this.p.w,this.p.h);
		//ctx.strokeRect(-this.p.w/2,-this.p.h/2,this.p.w,this.p.h);
		ctx.setFillColor(1, 1, 1, 1.0);
		var fontSize = 20;
		ctx.font = fontSize + "px sans-serif";
		var textSize = ctx.measureText(this.p.name);
		ctx.textAlign = 'center';
		ctx.textBaseline = 'middle';
		ctx.fillText(this.p.name,0,0);
	    //var button = this.insert(new Q.UI.Button({ x: -85, y: -25, z:5, fill: this.p.color,
                                           //label: "Finance" }));
	    //button.on("click",function() {
	    	//console.log("EEEE");
	    	//console.log(this.p.x);
	    //});
	}
});

Q.UI.Container.extend("WvSt", {
	init: function(p) {
		this._super(p, {
			name: "Weaving Station",
			z: 1,
			gravity: 0,
			w: 150,
			h: 50,
			type: Q.SPRITE_DEFAULT,
			isInteractable: true,
			color : "#3366FF",
			dragging: false,
			dragable: true,
			align: "center",
			infoShow: false,
			info: "Where you\nweave the\nbasket."
		});

		if(this.p.isInteractable) {
			this.on("touch");
			this.on("touchEnd");
			if(this.p.dragable){
				this.on("drag");
			}
		}
	},

	drag: function(touch) {
		console.log("material dragging");
        this.p.dragging = true;
        this.p.x = touch.origX + touch.dx;
        this.p.y = touch.origY + touch.dy;
    },

    touch: function(touch){
    	console.log("material touched");
    	//this.p.dragging = true;
    },

	touchEnd: function(touch) {
		//console.log("material touched");
		if(this.p.dragging!=true){
			console.log(this.p.infoShow);
			if(this.p.infoShow==false && Q.stage().info!=this.p.name){
					for(var item in Q.stage().obj){
						if(Q.stage().obj[item].p.box!=null){
							Q.stage().obj[item].p.box.destroy();
							Q.stage().obj[item].p.infoShow = false;
						}
					}
					this.p.box = Q.stage().insert(new Q.UI.Container({
			    		x: this.p.x, y: this.p.y, fill: "rgba(0,0,0,0.8)"
				  	}));
					Q.stage().insert(new Q.UI.Text({
				        label: this.p.info,
				        align: "center",
				        color: "white"
				    }), this.p.box);
				    this.p.box.fit(20);
				    this.p.infoShow = this.p.name;
				    Q.stage().info = this.p.name;
			}
			else{
				if(this.p.box!=null){
					this.p.box.destroy(this.p.box);
					this.p.box=null;
				}
				Q.stage().info=false;
				this.p.infoShow=false;
			}
			console.log(this.p.infoShow);
		}
		else{
			this.p.dragging = false;
		}
	},

	draw: function(ctx){
		ctx.lineWidth= 2;
		ctx.lineCap= "round";
		ctx.lineJoin= "miter";
		ctx.miterLimit= 10;
		ctx.fillStyle = this.p.color;
		ctx.clearRect(-this.p.w/2,-this.p.h/2,this.p.w,this.p.h);
		ctx.fillRect(-this.p.w/2,-this.p.h/2,this.p.w,this.p.h);
		//ctx.strokeRect(-this.p.w/2,-this.p.h/2,this.p.w,this.p.h);
		ctx.setFillColor(1, 1, 1, 1.0);
		var fontSize = 20;
		ctx.font = fontSize + "px sans-serif";
		var textSize = ctx.measureText(this.p.name);
		ctx.textAlign = 'center';
		ctx.textBaseline = 'middle';
		ctx.fillText(this.p.name,0,0);
	    //var button = this.insert(new Q.UI.Button({ x: -85, y: -25, z:5, fill: this.p.color,
                                           //label: "Finance" }));
	    //button.on("click",function() {
	    	//console.log("EEEE");
	    	//console.log(this.p.x);
	    //});
	}
});

Q.UI.Container.extend("FiSt", {
	init: function(p) {
		this._super(p, {
			name: "Finishing Station",
			z: 1,
			gravity: 0,
			w: 150,
			h: 50,
			type: Q.SPRITE_DEFAULT,
			isInteractable: true,
			color : "#3366FF",
			dragging: false,
			dragable: true,
			align: "center",
			infoShow: false,
			info: "Where you\nassemble and\npackage the\nbaskets."
		});

		if(this.p.isInteractable) {
			this.on("touch");
			this.on("touchEnd");
			if(this.p.dragable){
				this.on("drag");
			}
		}
	},

	drag: function(touch) {
		console.log("material dragging");
        this.p.dragging = true;
        this.p.x = touch.origX + touch.dx;
        this.p.y = touch.origY + touch.dy;
    },

    touch: function(touch){
    	console.log("material touched");
    	//this.p.dragging = true;
    },

	touchEnd: function(touch) {
		//console.log("material touched");
		if(this.p.dragging!=true){
			console.log(this.p.infoShow);
			if(this.p.infoShow==false && Q.stage().info!=this.p.name){
					for(var item in Q.stage().obj){
						if(Q.stage().obj[item].p.box!=null){
							Q.stage().obj[item].p.box.destroy();
							Q.stage().obj[item].p.infoShow = false;
						}
					}
					this.p.box = Q.stage().insert(new Q.UI.Container({
			    		x: this.p.x, y: this.p.y, fill: "rgba(0,0,0,0.8)"
				  	}));
					Q.stage().insert(new Q.UI.Text({
				        label: this.p.info,
				        align: "center",
				        color: "white"
				    }), this.p.box);
				    this.p.box.fit(20);
				    this.p.infoShow = this.p.name;
				    Q.stage().info = this.p.name;
			}
			else{
				if(this.p.box!=null){
					this.p.box.destroy(this.p.box);
					this.p.box=null;
				}
				Q.stage().info=false;
				this.p.infoShow=false;
			}
			console.log(this.p.infoShow);
		}
		else{
			this.p.dragging = false;
		}
	},

	draw: function(ctx){
		ctx.lineWidth= 2;
		ctx.lineCap= "round";
		ctx.lineJoin= "miter";
		ctx.miterLimit= 10;
		ctx.fillStyle = this.p.color;
		ctx.clearRect(-this.p.w/2,-this.p.h/2,this.p.w,this.p.h);
		ctx.fillRect(-this.p.w/2,-this.p.h/2,this.p.w,this.p.h);
		//ctx.strokeRect(-this.p.w/2,-this.p.h/2,this.p.w,this.p.h);
		ctx.setFillColor(1, 1, 1, 1.0);
		var fontSize = 20;
		ctx.font = fontSize + "px sans-serif";
		var textSize = ctx.measureText(this.p.name);
		ctx.textAlign = 'center';
		ctx.textBaseline = 'middle';
		ctx.fillText(this.p.name,0,0);
	    //var button = this.insert(new Q.UI.Button({ x: -85, y: -25, z:5, fill: this.p.color,
                                           //label: "Finance" }));
	    //button.on("click",function() {
	    	//console.log("EEEE");
	    	//console.log(this.p.x);
	    //});
	}
});

Q.UI.Container.extend("RcSt", {
	init: function(p) {
		this._super(p, {
			name: "Receiving Station",
			z: 1,
			gravity: 0,
			w: 150,
			h: 50,
			type: Q.SPRITE_DEFAULT,
			isInteractable: true,
			color : "#3366FF",
			dragging: false,
			dragable: true,
			align: "center",
			infoShow: false,
			info: "Where all the\nraw materials\narrive and you\nseparate them\nto be used in\nother stations."
		});

		if(this.p.isInteractable) {
			this.on("touch");
			this.on("touchEnd");
			if(this.p.dragable){
				this.on("drag");
			}
		}
	},

	drag: function(touch) {
		console.log("material dragging");
        this.p.dragging = true;
        this.p.x = touch.origX + touch.dx;
        this.p.y = touch.origY + touch.dy;
    },

    touch: function(touch){
    	console.log("material touched");
    	//this.p.dragging = true;
    },

	touchEnd: function(touch) {
		//.log("material touched");
		if(this.p.dragging!=true){
			console.log(this.p.infoShow);
			if(this.p.infoShow==false && Q.stage().info!=this.p.name){
					for(var item in Q.stage().obj){
						if(Q.stage().obj[item].p.box!=null){
							Q.stage().obj[item].p.box.destroy();
							Q.stage().obj[item].p.infoShow = false;
						}
					}
					this.p.box = Q.stage().insert(new Q.UI.Container({
			    		x: this.p.x, y: this.p.y, fill: "rgba(0,0,0,0.8)"
				  	}));
					Q.stage().insert(new Q.UI.Text({
				        label: this.p.info,
				        align: "center",
				        color: "white"
				    }), this.p.box);
				    this.p.box.fit(20);
				    this.p.infoShow = this.p.name;
				    Q.stage().info = this.p.name;
			}
			else{
				if(this.p.box!=null){
					this.p.box.destroy(this.p.box);
					this.p.box=null;
				}
				Q.stage().info=false;
				this.p.infoShow=false;
			}
			console.log(this.p.infoShow);
		}
		else{
			this.p.dragging = false;
		}
	},

	draw: function(ctx){
		ctx.lineWidth= 2;
		ctx.lineCap= "round";
		ctx.lineJoin= "miter";
		ctx.miterLimit= 10;
		ctx.fillStyle = this.p.color;
		ctx.clearRect(-this.p.w/2,-this.p.h/2,this.p.w,this.p.h);
		ctx.fillRect(-this.p.w/2,-this.p.h/2,this.p.w,this.p.h);
		//ctx.strokeRect(-this.p.w/2,-this.p.h/2,this.p.w,this.p.h);
		ctx.setFillColor(1, 1, 1, 1.0);
		var fontSize = 18;
		ctx.font = fontSize + "px sans-serif";
		var textSize = ctx.measureText(this.p.name);
		ctx.textAlign = 'center';
		ctx.textBaseline = 'middle';
		ctx.fillText(this.p.name,0,0);
	    //var button = this.insert(new Q.UI.Button({ x: -85, y: -25, z:5, fill: this.p.color,
                                           //label: "Finance" }));
	    //button.on("click",function() {
	    	//console.log("EEEE");
	    	//console.log(this.p.x);
	    //});
	}
});

Q.UI.Container.extend("FGSt", {
	init: function(p) {
		this._super(p, {
			name: "Finished Good Storage",
			z: 1,
			gravity: 0,
			w: 150,
			h: 50,
			type: Q.SPRITE_DEFAULT,
			isInteractable: true,
			color : "#3366FF",
			dragging: false,
			dragable: true,
			align: "center",
			infoShow: false,
			info: "Where you store\nthe baskets until\nthey can be\nshipped."
		});

		if(this.p.isInteractable) {
			this.on("touch");
			this.on("touchEnd");
			if(this.p.dragable){
				this.on("drag");
			}
		}
	},

	drag: function(touch) {
		console.log("material dragging");
        this.p.dragging = true;
        this.p.x = touch.origX + touch.dx;
        this.p.y = touch.origY + touch.dy;
    },

    touch: function(touch){
    	console.log("material touch");
    	console.log(this.p.infoShow);
    	//this.p.dragging = true;
    },

	touchEnd: function(touch) {
		//console.log("material touched");
		if(this.p.dragging!=true){
			console.log(this.p.infoShow);
			if(this.p.infoShow==false && Q.stage().info!=this.p.name){
					for(var item in Q.stage().obj){
						if(Q.stage().obj[item].p.box!=null){
							Q.stage().obj[item].p.box.destroy();
							Q.stage().obj[item].p.infoShow = false;
						}
					}
					this.p.box = Q.stage().insert(new Q.UI.Container({
			    		x: this.p.x, y: this.p.y, fill: "rgba(0,0,0,0.8)"
				  	}));
					Q.stage().insert(new Q.UI.Text({
				        label: this.p.info,
				        align: "center",
				        color: "white"
				    }), this.p.box);
				    this.p.box.fit(20);
				    this.p.infoShow = this.p.name;
				    Q.stage().info = this.p.name;
			}
			else{
				if(this.p.box!=null){
					this.p.box.destroy(this.p.box);
					this.p.box=null;
				}
				Q.stage().info=false;
				this.p.infoShow=false;
			}
			console.log(this.p.infoShow);
		}
		else{
			this.p.dragging = false;
		}
	},

	draw: function(ctx){
		ctx.lineWidth= 2;
		ctx.lineCap= "round";
		ctx.lineJoin= "miter";
		ctx.miterLimit= 10;
		ctx.fillStyle = this.p.color;
		ctx.clearRect(-this.p.w/2,-this.p.h/2,this.p.w,this.p.h);
		ctx.fillRect(-this.p.w/2,-this.p.h/2,this.p.w,this.p.h);
		//ctx.strokeRect(-this.p.w/2,-this.p.h/2,this.p.w,this.p.h);
		ctx.setFillColor(1, 1, 1, 1.0);
		var fontSize = 14.5;
		ctx.font = fontSize + "px sans-serif";
		var textSize = ctx.measureText(this.p.name);
		ctx.textAlign = 'center';
		ctx.textBaseline = 'middle';
		ctx.fillText(this.p.name,0,0);
	    //var button = this.insert(new Q.UI.Button({ x: -85, y: -25, z:5, fill: this.p.color,
                                           //label: "Finance" }));
	    //button.on("click",function() {
	    	//console.log("EEEE");
	    	//console.log(this.p.x);
	    //});
	}
});

Q.UI.Container.extend("Admin", {
	init: function(p) {
		this._super(p, {
			name: "Administration",
			z: 1,
			gravity: 0,
			w: 150,
			h: 50,
			type: Q.SPRITE_DEFAULT,
			isInteractable: true,
			color : "#999999",
			dragging: false,
			dragable: true,
			align: "center",
			infoShow: false,
			info: "Where you\nmanage the\norders, hold your\nrecords and files.",
			box: null
		});

		if(this.p.isInteractable) {
			this.on("touch");
			this.on("touchEnd");
			if(this.p.dragable){
				this.on("drag");
			}
		}
	},

	drag: function(touch) {
		console.log("material dragging");
        this.p.dragging = true;
        this.p.x = touch.origX + touch.dx;
        this.p.y = touch.origY + touch.dy;
    },

    touch: function(touch){
    	console.log("material touch");
    	console.log(this.p.infoShow);
    	//this.p.dragging = true;
    },

	touchEnd: function(touch) {
		//console.log("material touched");
		//console.log(Q.stage().FGSt());
		if(this.p.dragging!=true){
			console.log(this.p.infoShow);
			if(this.p.infoShow==false && Q.stage().info!=this.p.name){
					for(var item in Q.stage().obj){
						if(Q.stage().obj[item].p.box!=null){
							Q.stage().obj[item].p.box.destroy();
							Q.stage().obj[item].p.infoShow = false;
						}
					}
					this.p.box = Q.stage().insert(new Q.UI.Container({
			    		x: this.p.x, y: this.p.y, fill: "rgba(0,0,0,0.8)"
				  	}));
					Q.stage().insert(new Q.UI.Text({
				        label: this.p.info,
				        align: "center",
				        color: "white"
				    }), this.p.box);
				    this.p.box.fit(20);
				    this.p.infoShow = this.p.name;
				    Q.stage().info = this.p.name;
			}
			else{
				if(this.p.box!=null){
					this.p.box.destroy(this.p.box);
					this.p.box=null;
				}
				Q.stage().info=false;
				this.p.infoShow=false;
			}
			console.log(this.p.infoShow);
		}
		else{
			this.p.dragging = false;
		}
	},

	draw: function(ctx){
		ctx.lineWidth= 2;
		ctx.lineCap= "round";
		ctx.lineJoin= "miter";
		ctx.miterLimit= 10;
		ctx.fillStyle = this.p.color;
		ctx.clearRect(-this.p.w/2,-this.p.h/2,this.p.w,this.p.h);
		ctx.fillRect(-this.p.w/2,-this.p.h/2,this.p.w,this.p.h);
		//ctx.strokeRect(-this.p.w/2,-this.p.h/2,this.p.w,this.p.h);
		ctx.setFillColor(1, 1, 1, 1.0);
		var fontSize = 20;
		ctx.font = fontSize + "px sans-serif";
		var textSize = ctx.measureText(this.p.name);
		ctx.textAlign = 'center';
		ctx.textBaseline = 'middle';
		ctx.fillText(this.p.name,0,0);
		//console.log(this.p.color);
	    //var button = this.insert(new Q.UI.Button({ x: -85, y: -25, z:5, fill: this.p.color,
                                           //label: "Finance" }));
	    //button.on("click",function() {
	    	//console.log("EEEE");
	    	//console.log(this.p.x);
	    //});
	}
});

Q.UI.Container.extend("MSTb", {
	init: function(p) {
		this._super(p, {
			name: "Administration",
			z: 1,
			gravity: 0,
			w: 400,
			h: 400,
			type: Q.SPRITE_DEFAULT,
			isInteractable: true,
			color : "#999999",
			dragging: false,
			dragable: true,
			align: "center",
			infoShow: false,
			info: "Where you\nmanage the\norders, hold your\nrecords and files.",
			box: null
		});

		if(this.p.isInteractable) {
			this.on("touch");
			this.on("touchEnd");
			if(this.p.dragable){
				this.on("drag");
			}
		}
	},

	drag: function(touch) {
		console.log("material dragging");
        this.p.dragging = true;
        this.p.x = touch.origX + touch.dx;
        this.p.y = touch.origY + touch.dy;
    },

    touch: function(touch){
    	console.log("material touch");
    	console.log(this.p.infoShow);
    	//this.p.dragging = true;
    },

	touchEnd: function(touch) {
		//console.log("material touched");
		//console.log(Q.stage().FGSt());
		
	},

	draw: function(ctx){
		ctx.beginPath();
		ctx.lineWidth= 2;
		ctx.lineCap= "round";
		ctx.lineJoin= "miter";
		ctx.miterLimit= 10;
		ctx.fillStyle = this.p.color;

		var bw = 400;
		var bh = 400;
		var p = -200;
		var cw = bw + (p*2) + 1;
		var ch = bh + (p*2) + 1;
		//var context = Q.stage().locate(0,0); 
		for (var x = 0; x <= bw; x += 80) {
		  ctx.moveTo(0.5 + x + p, p);
		  ctx.lineTo(0.5 + x + p, bh + p);
		}


		for (var x = 0; x <= bh; x += 80) {
		  ctx.moveTo(p, 0.5 + x + p);
		  ctx.lineTo(bw + p, 0.5 + x + p);
		}
		//ctx.clearRect(-this.p.w/2,-this.p.h/2,this.p.w,this.p.h);
		ctx.strokeStyle = "black";
		ctx.stroke();
		
		var fontSize = 20;
		ctx.font = fontSize + "px sans-serif";
		ctx.textAlign = 'center';
		ctx.textBaseline = 'middle';
		var linespacing = 15;
		var textSize = ctx.measureText("Week");
		ctx.fillText("Week",-160,-160);
		textSize = ctx.measureText("1");
		ctx.fillText("1",-80,-160);
		textSize = ctx.measureText("2");
		ctx.fillText("2",0,-160);
		textSize = ctx.measureText("3");
		ctx.fillText("3",80,-160);
		textSize = ctx.measureText("4");
		ctx.fillText("4",160,-160);
		ctx.font = '8pt Helvetica';
		var startX = -160, startY = -100;
		var textvalArr = toMultiLine("Quantity of<br/>baskets to be\nsold in the\nmarket");
		for(var i = 0; i < textvalArr.length; i++){
			textSize = ctx.measureText(textvalArr[i]);
	        ctx.fillText(textvalArr[i], startX, startY);
	        startY += linespacing;
	    }
	    startX = -160;
	    startY = -15;
		textvalArr = toMultiLine("Quantity of\nbaskets you\nalready have");
		for(var i = 0; i < textvalArr.length; i++){
			textSize = ctx.measureText(textvalArr[i]);
	        ctx.fillText(textvalArr[i], startX, startY);
	        startY += linespacing;
	    }
	    startX = -160;
	    startY = 65;
		textvalArr = toMultiLine("Quantity of\nbaskets have\nto be made");
		for(var i = 0; i < textvalArr.length; i++){
			textSize = ctx.measureText(textvalArr[i]);
	        ctx.fillText(textvalArr[i], startX, startY);
	        startY += linespacing;
	    }
		startX = -160;
		startY = 145;
		textvalArr = toMultiLine("Quantity of\nbaskets you\nneed to order");
		for(var i = 0; i < textvalArr.length; i++){
			textSize = ctx.measureText(textvalArr[i]);
	        ctx.fillText(textvalArr[i], startX, startY);
	        startY += linespacing;
	    }
	}
});

// Creates an array where the <br/> tag splits the values.
function toMultiLine(text){
   var textArr = new Array();
   text = text.replace(/\n\r?/g, '<br/>');
   textArr = text.split("<br/>");
   return textArr;
}