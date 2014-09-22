Q.Sprite.extend("KeyContainer", {
	init: function(p) {
		this._super(Q._defaults(p, {
			name: "key",
			z: 3,
			type: Q.SPRITE_NONE,
			collisionMask: Q.SPRITE_NONE,
		}));
	},

	reset: function(stocks) {
		this.children.forEach(function(child) {
			child.destroy();
		});
		x = 0;
		for (i = 0; i < Object.keys(this.p.keys).length; i++) {
			key_name = this.p.keys[i];
			var material = new Q.Sprite({asset: 'key.png', x: x});
			this.stage.insert(material, this);
			x += 15;
		}
	},


	add: function(key_name) {
		console.log("add");
		this.p.keys.push(key_name);
		this.reset();
	},


});







// To be used by the entities that want to carry materials. 
// These materials will be considered picked, and hence not collidable.
// Currently assumes that the entity is the player
Q.component("KeyCarrier", {
	added: function() {
	},

	extend: {
		addKeyContainer: function() {
			console.log("MaterialCarrier.addKeyContainer");
			this.p.keycontainer = new Q.KeyContainer({keys: Q.game.player.keys, y:-50, x: -15});
			this.stage.insert(this.p.keycontainer, this);
			this.p.keycontainer.reset();
		},

		resetKeyContainer: function() {
			console.log("resetKeyContainer");
			this.p.keycontainer.reset();
		},

		pickKey: function(key_name) {
			console.log("MaterialCarrier.pickKey");
			Q.game.player.keys.push(key_name);
			this.p.keycontainer.add(key_name);
		},

	}
});



