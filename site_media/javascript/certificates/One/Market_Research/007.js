console.log("loaded Market Research Agent element");

Q.scene("market_research_2",function(stage) {
	stage.name = "market_research_2";

	stage.desc_card = new Q.StageInfoCard({
		description: new Q.ImageText({
			label: new Q.UI.WrappableText({label: "Hi! TODO: Fill the details of the element here"}),
		}),
		context: stage,
	});

	var guru = Q("GuruIcon", Q.STAGE_LEVEL_NAVIGATION).first();
	guru.trigger("register", stage.desc_card);

	stage.insert(new Q.Repeater({ sheet: "tiles", frame:229, speedX: 1, speedY: 1 }));
	Q.stageTMX(game.TMX.VirtualWorld, stage);
	game.AUDIO.stop_n_play(game.AUDIO.RESOURCES.VILLAGE);

	var player = Q("Player").first();
	stage.player = player;
	player.addMaterialContainer();
	stage.add("viewport").follow(player);

	var i = 0;
	while(Q("Building", Q.STAGE_LEVEL_PRIMARY).at(i) != null) {
		b = Q("Building").at(i);
		b.setInteractable(stage.options.element.interactability[b.p.name]);
		b.p.nextScene = stage.name + "_" + b.p.name;
		i += 1;
	}
});


Q.scene("market_research_2_House", function(stage) {
	stage.stock_name = "House";

	stage.insert(new Q.Repeater({ sheet: "tiles", frame:229, speedX: 1, speedY: 1 }));
	stage.add("viewport").centerOn(400, 300);
	Q.stageTMX("house.tmx", stage);


	// Map Exit Door
	var exit_door = new Q.Door({width:96, height: 8, h: 16, w: 96, x: 400, y: 590});
	stage.insert(exit_door);



	// Mira
	var Mira = Q("Player").first();
	Mira.addMaterialContainer("Player");
	stage.player = Mira;

});

Q.scene("market_research_2_Market", function(stage) {
	stage.acceptable_materials = ["basket_01", "basket_02"];
	stage.stock_name = "Market";

	stage.insert(new Q.Repeater({ sheet: "tiles", frame:229, speedX: 1, speedY: 1 }));
	stage.add("viewport").centerOn(400, 300);

	var market_tables = [
		{
		}, 
		{
			'basket_01': [
				new Material('basket_01', {price: 15, isClickable: true, ifBelongsToPlayer: false, commission: 100}),
			]
		}, 
		{
			'basket_03': [
				new Material('basket_03', {price: 10, isClickable: true, ifBelongsToPlayer: false, commission: 100}),
			]
		}, 
		{
			'basket_02': [
				new Material('basket_02', {price: 5, isClickable: true, ifBelongsToPlayer: false, commission: 100}),
			]
		}, 
		{
			'basket_02': [
				new Material('basket_02', {price: 5, isClickable: true, ifBelongsToPlayer: false, commission: 100}),
			]
		}
	];
	//var market_tables = [{}, {}, {}, {}, {}];

	Q.stageTMX("market.tmx", stage);


	// Map Exit Door
	var exit_door = new Q.Door({width:160, height: 1, w: 160, h: 1, x: 400, y: 590});
	stage.insert(exit_door);

	// Mira
	var Mira = Q("Player").first();
	stage.player = Mira;
	Mira.addMaterialContainer();
	Mira.reStock(Q.game.stocks["Player"]);




	stage.tables = new Array();
	for(i = 0; i < 6; i++) {
		var materialcontainer = Q("MaterialContainer").at(i);
		console.log(materialcontainer.buyer_count());
		materialcontainer.p.player = Mira;
		materialcontainer.p.stock_name = stage.stock_name;
		materialcontainer.p.isClickable = false;
		materialcontainer.p.ifBelongsToPlayer = false;

		stage.tables.push(materialcontainer);
		if(i != 5) {
			// Vendor
			var person = new Q.Person({sheet: "mira_sheet", sprite: 'person_animation', frame:1, x: 0, y: - materialcontainer.p.h, name:"Vendor"});
			stage.insert(person, materialcontainer);

			// Material being sold
			var j= 0;
			for(material_name in market_tables[i]) {
				var stocks = {};
				stocks[material_name] = market_tables[i][material_name];
				var material = new Q.NewMaterialContainer({
									sheet: 'basket_01_sheet', 
									frame: 0,
									stock_name: stage.stock_name,
									stocks: stocks,
									x: 0, 
									y: -stage.tables[i].p.h/2 + 32 + 20 * j, 
									name: material_name, 
									player: Mira,
									ifBelongsToPlayer: false,
									price: Q.game.material_names[material_name].price, 
									stock_name: stage.stock_name,
								});
				stage.insert(material, stage.tables[i]);
				material.tag();
				j +=1;
			}
		}
	}
	var player_table = stage.tables[5];
	player_table.p.ifBelongsToPlayer = true;


	var j = 0;
	stage.containers = {};
	for(material_index in stage.acceptable_materials) {
		var material_name = stage.acceptable_materials[material_index];
		var stocks = {};
		if(Q.game.stocks[stage.stock_name][material_name]) {
			stocks[material_name] = [];
			for(i in Q.game.stocks[stage.stock_name][material_name]) {
				m = Q.game.stocks[stage.stock_name][material_name][i];
				stocks[material_name].push(m);
			}
		}

		var price = 0;
		if(stocks[material_name])
			price = stocks[material_name][0].price;

		stage.containers[material_name] = new Q.NewMaterialContainer({
								x: -player_table.p.w/2 + 32 + 32 * (j%2), 
								y: -player_table.p.h/2 + 32 + 32 * (Math.floor(j/2)),
								sheet: 'basket_01_sheet', 
								frame: 0,
								stocks: stocks,
								price: price,
						});
		stage.insert(stage.containers[material_name], player_table);

		if(price != 0)
			stage.containers[material_name].tag();
		j += 1;
	}


	stage.redistribute_buyers = function() {
		buyers = Q("Buyer", Q.STAGE_LEVEL_LEARNING_MODULE);
		var i =0;
		while(buyers.at(i) != null) {
			buyers.at(i).destroy();
			i++;
		}

		for(var i = 0; i < stage.tables.length; i++) {
			var materialcontainer = stage.tables[i];
			var buyer_count = materialcontainer.buyer_count();
			x_left  = - materialcontainer.p.cx;
			x_right = + materialcontainer.p.cx;
			y_up    = - materialcontainer.p.cy;
			y_down  = + materialcontainer.p.cy;


			buyer_x = [x_left - 25, x_right + 25, x_left - 16, x_left + 32, x_left + 75];
			buyer_y = [0, 0, y_down + 40, y_down + 40, y_down + 40];
			buyer_frame = [7, 4, 10, 10, 10];
			for(var j = 0; j < buyer_count; j++) {
				var person = new Q.Buyer({sheet: "mira_sheet", sprite:'person_animation', frame: buyer_frame[j], x: buyer_x[j], y: buyer_y[j], offset: 100 * i, name:"Buyer"});
				stage.insert(person, materialcontainer);
			}
		}
	};

	stage.redistribute_buyers();

	stage.player.p.materialcontainer.give_material = function(material_name) {
		if(this.product)
			this.product.destroy();

		this.product = new Q.Product({
			image: new Q.ImageText({image: new Q.Sprite({sheet: Q.game.material_names[material_name].sheet, frame:0})}),
			name: new Q.ImageText({label: new Q.UI.Text({label: material_name})}),
			description: new Q.ImageText({label: new Q.UI.Text({label: material_name})}),
			sellable: true,
		});

		var material_container = stage.player.p.materialcontainer;
		this.product.sell = function() {
			var material_details = material_container.p.stocks[material_name].pop();
			if(material_container.p.stocks[material_name].length == 0) {
				delete material_container.p.stocks[material_name];
			}
			if(material_details) {
				if (! Q.game.stocks["Market"][material_name])
					Q.game.stocks["Market"][material_name] = [];

				Q.game.stocks["Market"][material_name].push(Q.game.stocks["Player"][material_name].pop());
				if(Q.game.stocks["Player"][material_name].length == 0)
					delete Q.game.stocks["Player"][material_name];

				material_container.reset();
				// Step 1: Identify which container will accept the material
				var container = stage.containers[material_name];

				// Step 2: Ask the container to accept the material
				container.addMaterial(material_name, material_details);
				container.p.price = this.p.price.p.value;

				container.tag();
			}

			stage.redistribute_buyers();
			this.destroy();
		};

		this.stage.insert(this.product);
	};
});



Q.scene("market_research_2_SeemaWorkshop", function(stage) {
	stage.stock_name = "SeemaWorkshop";
	stage.acceptable_materials = ["Basket", "Sticks"];

	stage.insert(new Q.Repeater({ sheet: "tiles", frame:229, speedX: 1, speedY: 1 }));
	stage.add("viewport").centerOn(400, 300);
	Q.stageTMX("seemaworkshop.tmx", stage);

	// Map Exit Door
	var exit_door = new Q.Door({width:96, height: 8, h: 16, w: 96, x: 400, y: 588});
	stage.insert(exit_door);

	// Mira
	var player = Q("Player").first();
	stage.player = player;
	player.addMaterialContainer();
	player.reStock(Q.game.stocks["Player"]);

	// Other players
	var Enterpreneur = Q("Enterpreneur").first();
	Enterpreneur.info({duration:-1});

	// Material
	var j = 0;
	stage.containers = {};
	for(material_name in Q.game.material_names) {
		var stocks = {};
		if(Q.game.stocks[stage.stock_name][material_name]) {
			stocks[material_name] = [];
			for(i in Q.game.stocks[stage.stock_name][material_name]) {
				m = Q.game.stocks[stage.stock_name][material_name][i];
				stocks[material_name].push(m);
			}
		}

		stage.containers[material_name] = new Q.NewMaterialContainer({
								x: 600 + 80 * j, 
								y: 70,
								sheet: 'basket_01_sheet', 
								frame: 0,
								stock_name: stage.stock_name,
								stocks: stocks,
								name: material_name,
						});

		stage.containers[material_name].give_material = function(material_name) {
			// Stage returned the material, so remove it from the container
			material_details = this.p.stocks[material_name].pop();

			if(this.p.stocks[material_name].length == 0) {
				delete this.p.stocks[material_name];
			}
			if(material_details) {
				if (! Q.game.stocks["Player"][material_name])
					Q.game.stocks["Player"][material_name] = [];

				Q.game.stocks["Player"][material_name].push(Q.game.stocks["SeemaWorkshop"][material_name].pop());
				if(Q.game.stocks["SeemaWorkshop"][material_name].length == 0)
					delete Q.game.stocks["SeemaWorkshop"][material_name];

				stage.player.pickMaterial(material_name, material_details);
				this.reset();
			}
		};

		stage.insert(stage.containers[material_name]);
		j += 1;
	}

	stage.player.p.materialcontainer.give_material = function(material_name) {
		var material_details = this.p.stocks[material_name].pop();
		console.log("popped: " + material_details.ifBelongsToPlayer + ", " + this.p.stocks[material_name].length);
		if(this.p.stocks[material_name].length == 0) {
			delete this.p.stocks[material_name];
		}
		if(material_details) {
			if (! Q.game.stocks["SeemaWorkshop"][material_name])
				Q.game.stocks["SeemaWorkshop"][material_name] = [];

			Q.game.stocks["SeemaWorkshop"][material_name].push(Q.game.stocks["Player"][material_name].pop());
			if(Q.game.stocks["Player"][material_name].length == 0)
				delete Q.game.stocks["Player"][material_name];

			console.log("popped from the player material container");
			this.reset();
			// Step 1: Identify which container will accept the material
			var container = stage.containers[material_name];

			// Step 2: Ask the container to accept the material
			container.addMaterial(material_name, material_details);
		}
		return true;
	};
});

