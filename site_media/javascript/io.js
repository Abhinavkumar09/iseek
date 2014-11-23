
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
function syncToServer() {
	// game.person
	console.log("client to server");
	if(game.sync_data["employee"]) {
		console.log("push game.person");
		$.post("/editEmployee/", {'id': game.player.id, 'name': game.player.name, 'phone': game.player.phone}, function( data ) {
			delete game.sync_data["employee"];
		});
	}
}

function syncFromServer() {
	console.log("server to client");
	if(! game.sync_data["employee"]) {
		console.log("fetch game.person");
		$.post( "/readEmployee/", {'name': 'Administrator'}, function( data ) {
			game.player.id = data[0]['id'];
			game.player.name = data[0]['name'];
			game.player.phone = data[0]['work_phone'];
		});
	}

	if (! game.sync_data["prescription"]) {
		console.log("fetch game.prescriptions");
		$.post( "/getPrescriptions/", {'ref': 's1test1'}, function( data ) {
			game.prescriptionslength = data.length;
			for(var x = 0; x<data.length; x++) {
				game.prescriptions[x] = 
					new Prescription({'name' : data[x]['template'][1],'frequency' : data[x]['common_dosage'][1],
						'startdate' : data[x]['start_treatment'], 'enddate' : data[x]['end_treatment'], 'dosage' : data[x]['dose'],
						'dosunit' : data[x]['dose_unit']['name']});
			}
			console.log(game.prescriptions[0].name);

		});
	}
}


