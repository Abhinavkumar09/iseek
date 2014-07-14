var game_stop = false;

function process_game() {
//	game.print();

	// Fetch the javascript associated with the game
	$.getScript(game.javascript);
	fetchAll();

	//Ensure compatibility with all browsers
	window.requestAnimFrame = (function(){
		return  window.requestAnimationFrame       ||
			window.webkitRequestAnimationFrame ||
			window.mozRequestAnimationFrame    ||
			function( callback ){
				window.setTimeout(callback, 1000 / 20);
			};
		})();

	game.cur_part = game.get_part("1");

	check_and_run();
}

function check_and_run() {
	if(game.ready == false)
		setTimeout(check_and_run, 1000);
	else
		window.requestAnimFrame(run_game);
}

function fetchAll() {
	mylog("fetchAll");
	var fetchDone = true;
	for(var i = 0; i < game.assets.length; i++) {
		if(game.assets[i].check_and_fetch() == false) {
				fetchDone = false;
		}
	}
	if(fetchDone == false)
		setTimeout(fetchAll, 1000);
	else
		game.ready = true;
}

function run_game(timestamp) {
	if(game.start_time == null)
		game.start_time = timestamp;

	var prev_cur_time = game.cur_time;

	game.cur_time = timestamp - game.start_time;
	mylog("run_game with cur_time:" + game.cur_time);
		
	var something_to_render = false;

	for(var i = 0; i < game.cur_part.partactions.length; i++) {
		if(!game.cur_part.partactions[i].done) {
			something_to_render = true;
			game.cur_part.partactions[i].render(game.cur_part, game.get_asset(game.cur_part.partactions[i].asset), game.cur_time);
		}
	}
	for(var i = 0; i < game.cur_part.events.length; i++) {
		if(!game.cur_part.events[i].done) {
			something_to_render = true;
			game.cur_part.events[i].render(game.cur_part, game.get_asset(game.cur_part.events[i].asset), game.cur_time);
		}
	}
	if((something_to_render) && (!game_stop))
		window.requestAnimFrame(run_game);
	else {
		if(game.cur_part.next != '0') {
			game.start_time = null;
			game.cur_part = game.get_part(game.cur_part.next);
			mylog("starting next part");
			window.requestAnimFrame(run_game);
		}
	}
}

