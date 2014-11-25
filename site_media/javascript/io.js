
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

/*New Code */
	if(game.sync_data["products"]) {
		console.log("push game.product");
		$.post("/addProduct/", {'name': game.nameProduct, 'price': game.priceProduct}, function( data ) {
			delete game.sync_data["products"];
		});
	}
	
	if(game.sync_data["Manufacture"]) {
		console.log("push game.manufacture");
		$.post("/addMO/", {'name': 'sampleMO', 'uom': 1, 'prod' : 2, 'bom' : 3, 'qty' : 32 }, function( data ) {
			delete game.sync_data["Manufacture"];
		});
	}
/*New Code */

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
/* New Code */
	if(!game.sync_data["products"]) {
		console.log("fetch game.products")
		$.post( "/getproducts/" , { }, function( data ){
			game.productLength = data.length;
			for(var i =0 ; i < data.length ; i++){				
			   game.productInventory[i] = 
				new Product({'id': data[i]['id'], 'name': data[i]['name'], 'qtyavailable': data[i]['qty_available'], 'price': data[i]['list_price'], 'sellable' : data[i]['sale_ok'], 'buyable' : data[i]['purchase_ok'], 'bom_id' : 'false', 'qty' : 0});
		//console.log(data[i]['id'] + " " + data[i]['name']);
			}
			game.productInventory[1].bom_id = 7;
			game.productInventory[2].bom_id = 3;
			game.productInventory[5].bom_id = 5;		
		});		
	}
/* New Code */
	if(!game.sync_data["bom"]) {
		console.log("fetch game.bom")
		$.post( "/getbom/" , { }, function( data ){
			for(var i=0 ; i < data.length ; i++){
				//console.log(data[i]['product_id']);
				//console.log(data[i]['bom_id']);
			}
		});		
	}
}

