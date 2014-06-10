	Q.load("background.jpg",function() {
		console.log("CCCC");
        Q.stageScene('menu');
	});

	// Touch events do most of the work for us, but the
	// touch system doesn't handle mousemouse events, so lets add
	// in an event listener and use `Stage.locate` to highlight
	// sprites on desktop.

	
