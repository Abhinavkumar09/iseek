var event_id = 1;
var grid_width = 10;

function add_to_frame(asset_id) {
	assets = game.get('assets');
	asset = assets.get(asset_id);
	if (asset.get('type') == 'image') {
		$('#gamecanvas').append(asset.copy_to_frame(event_id));
		$('#event-' + event_id).draggable({
			containment: "#gamecanvas", 
			grid: [grid_width, grid_width]
		})
		.resizable({
			containment: "#gamecanvas", 
			grid: grid_width
		})
		.hover(
			function(){
				$('#content-event-' + this.id.substring(6)).show();
			}, 
			function(){
				$('#content-event-' + this.id.substring(6)).hide();
			}
		);
		$('#event-input-' + event_id).change(function() {
			$('#event-' + this.id.substring(12)).zIndex($(this).val());
		});
		event_id++;
	}
}

function build_game(game) {
	assets = game.get('assets');
	assets.each(function(myasset) {
		str = "<div class='thumbnail-div' id='thumbnail-div-" + myasset.get('id') + "'><img src='/site_media/add.png' alt='add' class='addIcon' onclick='event.stopPropagation();add_to_frame(\"" + myasset.get('id') + "\");' />" + myasset.thumbnail() + "</div>";
		$('#assets').append(
			str
		);
	});


	$('.thumbnail-div').hover(
		function(){
			$(this).find('.addIcon').show();
		},
		function() {
			$(this).find('.addIcon').hide();
		}
	);

	$('.thumbnail-div').click(function(){
		if($(this).hasClass('selected-thumbnail-div'))
			$(this).removeClass('selected-thumbnail-div');
		else
			$(this).addClass('selected-thumbnail-div');
	});
}

function remove() {
}

function add() {
	$('#addassetform').show();
	$("#uploadbutton").click(function () {
		var filename = $("#filename").val();
		$.ajax({
			type: "POST",
			url: "build/game/demo/uploadasset/",
			enctype: 'multipart/form-data',
			data: {
				file: filename
			},
			success: function () {
				alert("Data Uploaded: ");
			}
		});
	});
}

