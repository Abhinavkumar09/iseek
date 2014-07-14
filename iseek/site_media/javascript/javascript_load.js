Q.loadTMX(Q.options.resources,function() {
	Q.sheet("nav_icons",
		"nav_icons.png",
		{
			tilew: 42,
			tileh: 42,
			sx: 0,
			sy: 0
		});

	Q.sheet("emptyclassroom",
		"emptyclassroom.png",
		{
			tilew: 16,
			tileh: 16,
			sx: 0,
			sy: 0
		});

	Q.sheet("tiles",
		"tiles.png",
		{
			tilew: 32,
			tileh: 32,
			sx: 0,
			sy: 0
		});

	Q.sheet("tileSet",
		"tileSet.png",
		{
			tilew: 16,
			tileh: 16,
			sx: 0,
			sy: 0
		});

	Q.sheet('Rug',
		'rug.png',
		{
			tilew: 96,
			tileh: 64,
			sx: 0,
			sy: 0,
		});


	Q.sheet('plastic',
		'Objects/plastic.png',
		{
			tilew: 35,
			tileh: 25,
			sx: 0,
			sy: 0,
		});

	Q.sheet('cane',
		'Objects/cane.png',
		{
			tilew: 34,
			tileh: 25,
			sx: 0,
			sy: 0,
		});
	Q.sheet('bamboo',
		'Objects/bamboo.png',
		{
			tilew: 35,
			tileh: 25,
			sx: 0,
			sy: 0,
		});


	Q.sheet('coin',
		'Icons/coin.png',
		{
			tilew: 40,
			tileh: 45,
			sx: 0,
			sy: 0,
		});

	Q.animations('coin_animation', {
		rotate: { frames: [0, 1, 2, 3, 4, 5, 6, 7], next: 'stand', rate: 1/5},
		stand: { frames: [0]},
	});


	Q.sheet("house_inside_new",
		"house_inside_new.png",
		{
			tilew: 32,
			tileh: 32,
			sx: 0,
			sy: 0
		});



	Q.sheet("house_tileset",
		"house_tileset.png",
		{
			tilew: 16,
			tileh: 16,
			sx: 0,
			sy: 0
		});


	Q.sheet("basket_01_sheet",
		"Objects/basket_01.png",
		{
			tilew: 32,  // Each tile is 40 pixels wide
			tileh: 32,  // and 40 pixels tall
			sx: 0,   // start the sprites at x=0
			sy: 0    // and y=0
		});

	Q.sheet("basket_02_sheet",
		"Objects/basket_02.png",
		{
			tilew: 32,  // Each tile is 40 pixels wide
			tileh: 32,  // and 40 pixels tall
			sx: 0,   // start the sprites at x=0
			sy: 0    // and y=0
		});

	Q.sheet("basket_03_sheet",
		"Objects/basket_03.png",
		{
			tilew: 32,  // Each tile is 40 pixels wide
			tileh: 32,  // and 40 pixels tall
			sx: 0,   // start the sprites at x=0
			sy: 0    // and y=0
		});

	Q.sheet("mira_sheet",
		"People/Mira.png",
		{
			tilew: 32,  // Each tile is 40 pixels wide
			tileh: 64,  // and 40 pixels tall
			sx: 0,   // start the sprites at x=0
			sy: 0    // and y=0
		});


	Q.animations('person_animation', {
		run_down    : { frames: [0,1,2], next: 'stand_down', rate: 1/5},
		stand_down  : { frames: [1]},

		run_left    : { frames: [3,4,5], next: 'stand_left', rate: 1/5},
		stand_left  : { frames: [4]},

		run_right   : { frames: [6,7,8], next: 'stand_right', rate: 1/5},
		stand_right : { frames: [7]},


		run_up      : { frames: [9,10,11], next: 'stand_up', rate: 1/5},
		stand_up    : { frames: [10]},
	});


	Q.state.reset({ material_names: game.material_names, Player_stock: game.Player_stock, House_stock: game.House_stock, Market_stock: game.Market_stock, Workshop_stock: game.Workshop_stock, Health:100, money:100});

//	Q.stageScene("navigation", Q.STAGE_LEVEL_NAVIGATION);
	Q.stageScene("LevelSelector", Q.STAGE_LEVEL_LEARNING_MODULE, {certificates: Q.game.certificates});
//	Q.stageScene("level1", Q.STAGE_LEVEL_PRIMARY);
//	Q.stageScene("scorecard", Q.STAGE_LEVEL_SCORECARD);
//	Q.stageScene("School_insidescene", Q.STAGE_LEVEL_PRIMARY);
	
	//check the certificates and accordingly activate an element
	game.activateElement();

}, {
	progressCallback: function(loaded,total) {
		var element = document.getElementById("loading_progress");
		element.style.width = Math.floor(loaded/total*100) + "%";
		if(loaded == total) {
			var element = document.getElementById("loading");
			element.style.display = 'none';
		}
	}
});

