Q.Sprite.extend("MaterialContainer", {
	init: function(p) {
		this._super(p, {
			name: "MaterialContainer",
			z: 1,
			type: Q.SPRITE_MATERIAL_CONTAINER,
			collisionMask: Q.SPRITE_COLLIDABLE,
			isClickable: true,
			isInteractable: true,
			player: null,
			stock_name: "",
		});
		this.add("Talk");
		this.on("hit", this, "collision");
	},

	buyer_count: function() {
		if(this._material_count() == 0)
			return 0;
		return 2;
	},

	_material_count: function() {
		var count = 0;
		this.children.forEach(function(child) {
			if(child.isA("NewMaterialContainer")) {
				for(key in child.p.stocks) {
					count++;
					break;
				}
			}
		});
		return count;
	},

	rearrange_children: function() {
		var i = 0;
		var container = this;
		this.children.forEach(function(child) {
			child.p.y = -container.p.h/2 + 32 + 20 * i;
			i++;
		});

		// ensure that the material container has the same top-left coordinates
		// otherwise as x, y changes, all the materials will shift as new materials are added
		// TODO

	},

	give_material: function(material_name) {
		for(var i = 0; i < this.children.length; i++){
			var child = this.children[i];

			if(child.isA("NewMaterialContainer")) {
				//Q.game.stocks[this.p.stock_name][material_name].push(material_details)


				if (child.p.stocks[material_name]) {
					//Try to take the material from the stage
					//var material_details = child.stage.give_material(material_name);
					material_details = child.p.stocks[material_name].pop();
					Q.game.stocks['Market'][material_name].pop();

					if(child.p.stocks[material_name].length == 0) {
						console.log("empy for sure");
						delete child.p.stocks[material_name];
						delete Q.game.stocks['Market'][material_name];
					}
					price = material_details.price * material_details.commission / 100;

					console.log("price: " + price);
					Q.game.player.change_money(price);
					child.reset();
					return true;
				}

			}
		}
		return false;
	},

	tempaccept_material: function(material_obj, price) {
		var count = this._material_count();
		this.p.w = 64;
		this.p.h = 64 + count * 20;

		var material = new Q.Material({
									sheet: Q.game.material_names[material_obj.p.name].sheet,
									frame: Q.game.material_names[material_obj.p.name].frame,
									x: 0,
									y: 0, 
									name: material_obj.p.name, 
									player: this.p.player,
									parent: this,
									ifBelongsToPlayer: this.p.ifBelongsToPlayer,
									price: price,
									commission: material_obj.p.commission,
									stock_name: this.p.stock_name,
								});
		this.stage.insert(material, this);

		this.p.x = this.p.left_x + this.p.w/2;
		this.p.y = this.p.top_y + this.p.h/2;
		console.log("x: " + this.p.x + ", y: " + this.p.y);


		if(price)
			material.tag();
		//rearrange
		this.rearrange_children();

		Q.game.stocks[this.p.stock_name].push({name: material_obj.p.name, price: price, isClickable: true, commission: material_obj.p.commission});
	},

	_material_desc: function() {
		var count = 0;
		var price = 0;
		desc = {}
		this.children.forEach(function(child) {
			if(child.p.type == Q.SPRITE_MATERIAL) {
				if(desc[child.p.name]) {
					desc[child.p.name].count += 1;
				} else {
					desc[child.p.name] = {count: 1};
				}
			}
		});
		var labels = [];
		var found = false;
		for(material_name in desc) {
			found = true;
			labels.push(material_name + ": " + desc[material_name].count);
		}
		labels.push("Click to pick");
		if(found)
			return labels;
		
		return null;
	},

	collision: function(col) {
		console.log("collision with: " + col.obj.p.name);
		if(!this.p.isInteractable)
			return;

		var desc = this._material_desc();
		if(desc) {
			console.log("desc: " + desc);
			this.quote(desc);
		}
	}
});




Q.Sprite.extend("Material", {
	init: function(p) {
		this._super(p, {
			name: "Material",
			z: 3,
			gravity: 0,
			type: Q.SPRITE_MATERIAL,
			collisionMask: Q.SPRITE_COLLIDABLE,
			isClickable: true,
			isInteractable: true,
			player: null,
			parent: null,
			ifBelongsToPlayer:true,
			stock_name: null,
			commission: 100,
		});
		this.add("Talk, PriceTag, Touch");
		this.on("touch");
		this.on("hit", this, "collision");

	},

	touch: function(e) {
		if(!this.p.isClickable)
			return;
		console.log("material touched");

		var ifPicked = false;
		if(this.p.type == Q.SPRITE_MATERIAL)
			ifPicked = this.p.player.accept_material(this);
		else if(this.p.type == Q.SPRITE_PICKED_MATERIAL)
			ifPicked = this.p.player.give_material(this);
		if(ifPicked)
			this.destroy();
	},

	collision: function(col) {
		if(!this.p.isInteractable)
			return;

		if(this.p.parent) {
			this.p.parent.trigger('hit', this);
			return ;
		}
		var label = "Click to pick";
		this.quote([label]);
	},

});




// To be used by the entities that want to carry materials. 
// These materials will be considered picked, and hence not collidable.
// Currently assumes that the entity is the player
Q.component("MaterialCarrier", {
	added: function() {
	},

	extend: {
		addMaterialContainer: function(stock_name) {
			stocks = {};
			for(material_name in Q.game.material_names) {
				if(Q.game.stocks[stock_name][material_name]) {
					stocks[material_name] = [];
					for(i in Q.game.stocks[stock_name][material_name]) {
						m = Q.game.stocks[stock_name][material_name][i];
						stocks[material_name].push(m);
					}
				}
			}
			this.p.materialcontainer = new Q.NewMaterialContainer({sheet: 'basket_01_sheet', frame: 0, x: 0, y: 0, stocks: stocks, isInteractable:false, type: Q.SPRITE_PICKED_MATERIAL, stock_name:stock_name,});
			this.stage.insert(this.p.materialcontainer, this);
			this.p.materialcontainer.p.y = - this.p.materialcontainer.p.cy -this.p.cy;
		},

		reStock: function(stock_name) {
			console.log("reStock");
			stocks = {};
			for(material_name in Q.game.material_names) {
				if(Q.game.stocks[stock_name][material_name]) {
					stocks[material_name] = [];
					for(i in Q.game.stocks[stock_name][material_name]) {
						m = Q.game.stocks[stock_name][material_name][i];
						stocks[material_name].push(m);
					}
				}
			}
			this.p.materialcontainer.p.stocks = stocks;
			this.p.materialcontainer.reset();
		},

		pickMaterial: function(material_name, material_details) {
			console.log("MaterialCarrier.pickMaterial");
			
			this.p.materialcontainer.addMaterial(material_name, material_details);
		},

		dropMaterial: function(material_name, material_details) {
			console.log("MaterialCarrier.dropMaterial");
			
		},
	}
});





Q.Sprite.extend("NewMaterialContainer", {
	init: function(p) {
		this._super(p, {
			name: "basket_01",
			type: Q.SPRITE_MATERIAL,
			collisionMask: Q.SPRITE_COLLIDABLE,
			isClickable: true,
			isInteractable: true,
			ifBelongsToPlayer:true,
			stock_name: "",
			stocks: {},
			isExpanded: false,
			parent: null,
			z: 9,
		});


		this.add("Talk, Touch");
		this.on("touch");
		if(this.p.isInteractable)
			this.on("hit", this, "collision");

		this.reset();
	},

	reset_unexpanded: function(stocks) {
		console.log("reset_unexpanded");
		if(Object.keys(this.p.stocks).length == 0) {
			this.p.sheet = null;
			this.p.frame = null;
			this.p.asset = null;
		}
		else if(Object.keys(this.p.stocks).length == 1) {
			for (material_name in this.p.stocks) {
				this.p.sheet = Q.game.material_names[material_name].sheet;
				if(!this.p.stocks[material_name]) {
				}
				else if (this.p.stocks[material_name].length == 1)
					this.p.frame = 0;
				else if (this.p.stocks[material_name].length == 2)
					this.p.frame = 1;
				else
					this.p.frame = 2;
			}
		}
		else {
			this.p.sheet = null;
			this.p.frame = null;
			this.p.asset = 'Objects/item_bundle.png';
		}
	},

	reset_expanded: function(stocks) {
		console.log("reset_expanded");
		var x = 0;
		var y = -100;
		container = new Q.UI.Container({x: 0, y: -100, w: 100, h: 100, radius: 10, border: 1, fill: 'white'});
		this.stage.insert(container, this);
		for (material_name in this.p.stocks) {
			var stocks = {};
			stocks[material_name] = this.p.stocks[material_name];
			var container = new Q.NewMaterialContainer({sheet: 'basket_01_sheet', frame: 0, x: x, y: y, stocks: stocks, stock_name: this.p.stock_name, type: this.p.type, isInteractable:false, parent:this});
			this.stage.insert(container, this);
			x += 50;
		}
	},

	reset: function(stocks) {
		console.log("reset");
		this.children.forEach(function(child) {
			child.destroy();
		});
		if(Object.keys(this.p.stocks).length == 1) {
			this.p.ifExpanded = false;
		}
		if(this.p.ifExpanded) {
			this.reset_expanded(stocks);
		}
		this.reset_unexpanded(stocks);
	},

	addMaterial: function(material_name, material_details) {
		console.log("addMaterial");
		if(!this.p.stocks[material_name])
			this.p.stocks[material_name] = []

		this.p.stocks[material_name].push(material_details);
		this.reset();
	},

	touch: function(e) {
		console.log("material touched");
		if(!this.p.isClickable)
			return;

		var ifPicked = false;
		if(this.p.type == Q.SPRITE_MATERIAL) { // The material is NOT held by the player right now
			// Ask Stage to give it and the player to accept it
			if(Object.keys(this.p.stocks).length == 1) {
				for (material_name in this.p.stocks) {
					//Try to take the material from the stage
					var material_details = this.stage.give_material(material_name);
					if(!material_details) { // Stage did not give the material
						return;
					}

					// Stage returned the material, so remove it from the container
					material_details = this.p.stocks[material_name].pop();
					console.log(material_details.ifBelongsToPlayer);

					if(this.p.stocks[material_name].length == 0) {
						delete this.p.stocks[material_name];
					}


					// Ask the player to pick it
					ifPicked = this.stage.player.accept_material(material_name, material_details);
					this.reset();
				}
			}
		}
		else if(this.p.type == Q.SPRITE_PICKED_MATERIAL) { // Material is held by the player right now
			// Ask the stage to accept the material and ask the player to give the material
			if(Object.keys(this.p.stocks).length == 1) {
				for (material_name in this.p.stocks) {
					stocks = this.p.stocks;
					if(this.p.parent)
						stocks = this.p.parent.p.stocks;
					material_details = stocks[material_name].pop();

					// Try to give the material to the stage
					var returned = this.stage.accept_material(material_name, material_details);
					if(!returned) {
						// If not accepted by the stage, put it back in the container and return
						stocks[material_name].push(material_details)
						return;
					}


					if(stocks[material_name].length == 0)
						delete stocks[material_name];

					this.stage.player.give_material(material_name, material_details);
					this.reset();
					if(this.p.parent) {
						console.log("resetting parent");
						this.p.parent.reset();
					}

				}
			}
			else {
				console.log("more than two types");
				this.p.ifExpanded = !this.p.ifExpanded;
				this.reset();
			}


//			ifPicked = this.p.player.give_material(this);
		}
	},

	collision: function(col) {
		if(!this.p.isInteractable)
			return;

		if(this.p.parent) {
			this.p.parent.trigger('hit', this);
			return ;
		}
		var label = "Click to pick";
		this.quote([label]);
	},

});


