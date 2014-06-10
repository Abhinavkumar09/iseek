
//window.addEventListener('load',function(e) {
var Q = Quintus({
			development: true,
			audioPath: "site_media/assets/new_game/audio/",
			imagePath: "site_media/assets/new_game/figs/",
			dataPath: "site_media/assets/new_game/data/",
			//resources: game.resources,
			audioSupported: [ 'wav','mp3' ],
		})
		.include("Sprites, Scenes, 2D, UI, Anim, Input, Touch, Audio, TMX");
	Q.setup("game_canvas", {
			maximize: "touch",
//			maximize: true,
			width:   1000,
			height:  600,
		})
		.enableSound()
		.controls(true)
		.touch(Q.SPRITE_ALL);

console.log("AAAA");

//});

  
