function logout() {
	window.location.href = '/logout/';
}

function show_options(game, part_id) {
	curpart = game.get('parts').get("" + part_id);
	process_part(game, curpart);
}

function show_basket_design(game, part_id) {
	curpart = game.get('parts').get("" + part_id);
	process_part(game, curpart);
}

function goback(game, part_id) {
	curpart = game.get('parts').get("" + part_id);
	process_part(game, curpart);
}

