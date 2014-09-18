
/**
 * Storage Function
 * Store the Value
 * @param dataSet the name of the entry
 * @param dataValue the value of the entry
 * @return the result of operation
 */
function storeValue(dataSet, dataValue){
	if(typeof(Storage) !== "undefined") {
	    localStorage.setItem(dataSet,dataValue);
	    if(String(fetchValue(dataSet))===String(dataValue)){
	    	return true;
	    }
	} else {
	    console.log("Browser doesn't support local storage.")
	}
	return false;
}

/**
 * Storage Function
 * Fetch the Value
 * @param dataSet the name of the entry
 * @return the value of given name in local storage
 */
function fetchValue(dataSet){
	if(typeof(Storage) !== "undefined") {
		console.log(localStorage.getItem(dataSet));
	    return localStorage.getItem(dataSet);
	} else {
	    console.log("Browser doesn't support local storage.");
	}
	return false;
}

/**
 * Storage Function
 * Remove the Value
 * @param dataSet the name of the entry
 * @return the result of operation
 */
function removeValue(dataSet){
	if(typeof(Storage) !== "undefined") {
	    localStorage.removeItem(dataSet);
	    if(fetchValue(dataSet)===null){
	    	return true;
	    }
	} else {
	    console.log("Browser doesn't support local storage.");
	}
	return false;
}

function timeoutLoop(fn, reps, delay) {
  if (reps > 0)
    setTimeout(function() {
                 fn;
                 timeoutLoop(fn, reps-1, delay);
               }, delay);
}


/**
	Define what data needs to be stored
	And then store/restore them
*/
function sync(ifServerToClient) {
	// game.person
	if(! ifServerToClient) {
		console.log("client to server");
		if(game.sync_data["employee"]) {
			console.log("push game.person");
			$.post( "/editEmployee/", {'id': game.player.id, 'name': game.player.name, 'phone': game.player.phone}, function( data ) {
				game.sync_data["employee"] = false;
			});
		}
	}
	else {
		console.log("server to client");
		if(! game.sync_data["employee"]) {
			console.log("fetch game.person");
			$.post( "/readEmployee/", {'name': 'Administrator'}, function( data ) {
				game.player.id = data[0]['id'];
				game.player.name = data[0]['name'];
				game.player.phone = data[0]['work_phone'];
			});
		}
	}
}


