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
//		this.on("hit", this, "collision");
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

	temp_give_material: function(material_name) {
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

	temp_collision: function(col) {
		console.log("collision with: " + col.obj.p.name);
		if(!this.p.isInteractable)
			return;

		if(col.obj.isA("Player")) {
			var desc = this._material_desc();
			if(desc) {
				console.log("desc: " + desc);
				this.quote(desc);
			}
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
		addMaterialContainer: function() {
			this.p.materialcontainer = new Q.NewMaterialContainer({sheet: 'basket_01_sheet', frame: 0, x: 0, y: 0, isInteractable:false, type: Q.SPRITE_PICKED_MATERIAL});
			this.stage.insert(this.p.materialcontainer, this);
			this.p.materialcontainer.p.y = - this.p.materialcontainer.p.cy -this.p.cy;
		},

		reStock: function(stocks) {
			console.log("reStock");
			// Copy the stock. 
			// It is important to copy, otherwise when materialcontainer.p.stocks is changed, the original stocks would change as well.
			var newstocks = {};
			for(material_name in Q.game.material_names) {
				if(stocks[material_name])
					newstocks[material_name] = [];
				for(i in stocks[material_name]) {
					m = stocks[material_name][i];
					newstocks[material_name].push(m);
				}
			}
			this.p.materialcontainer.p.stocks = newstocks;
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


		this.add("Talk, PriceTag, Touch");
		this.on("touch");
		if(this.p.isInteractable)
			this.on("hit", this, "collision");

		this.reset();
	},

	reset_unexpanded: function() {
		console.log("reset_unexpanded");
		if(Object.keys(this.p.stocks).length == 0) {
			this.p.sheet = null;
			this.p.frame = null;
			this.p.asset = null;
		}
		else if(Object.keys(this.p.stocks).length == 1) {
			for (material_name in this.p.stocks) {
				this.p.sheet = Q.game.material_names[material_name].sheet;
				if (this.p.stocks[material_name].length == 1)
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

	reset_expanded: function() {
		console.log("reset_expanded");
		this.p.isExpanded = true;
		this.tiles = [];
		for (material_name in this.p.stocks) {
			console.log("name: " + this.p.stocks[material_name][0].name + ", sheet: " + this.p.stocks[material_name][0].sheet + ", frame: " + this.p.stocks[material_name][0].frame);
			var context = this;
			var tile = new Q.Tile({
					image: new Q.Sprite({
						sheet: this.p.stocks[material_name][0]["sheet"], 
						frame: this.p.stocks[material_name][0]["frame"],
					}),
					disabled: false,
					context: context,
					action: "give_material",
					action_params: material_name,
			});
			var index = this.tiles.length;
			this.tiles[index] = tile;
		}
		this.tcard = new Q.TileCard({tiles: this.tiles, grid: Q.TileCard.GRID_2_1});
		this.stage.insert(this.tcard);
	},

	reset: function() {
		console.log("reset");
		if(Object.keys(this.p.stocks).length < 2) {
			this.p.isExpanded = false;
		}
		if(this.tcard)
			this.tcard.destroy();

		if(this.p.isExpanded)
			this.reset_expanded();
		else
			this.reset_unexpanded();
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
		// Ask Stage to give it and the player to accept it
		if(Object.keys(this.p.stocks).length == 1) {
			for (material_name in this.p.stocks) {
				this.give_material(material_name);
			}
		}
		else {
			console.log("more than two types");
			this.reset_expanded();
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


