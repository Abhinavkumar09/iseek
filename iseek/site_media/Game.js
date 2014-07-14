var Asset = function() {
	this.id = 1;
	this.type = "image";
	this.value = "";
	this.asseturl = "";
	this.is_visible = false;
	this.object = null;

	this.initialize = function(variables) {
		if(variables.id)
			this.id = variables.id;
		if(variables.type)
			this.type = variables.type;
		if(variables.value)
			this.value = variables.value;
		if(variables.asseturl)
			this.asseturl = variables.asseturl;
		if(variables.is_visible)
			this.is_visible = variables.is_visible;
	};

	// Returns a thumbnail for the asset
	// Used to show available assets in the IDE
	this.thumbnail = function() {
		str = "none";
		if(this.type == "image") {
			str = "<img class='thumbnail"
			+ "' id  = 'assetthumbnail-" + this.id
			+ "' alt ='" + this.value
			+ "' src ='" + this.asseturl
			+ "' />";
		}
		return str;
	};

	this.check_and_fetch = function() {
		if(this.type=="canvas")
			return true;
		if(this.type == "image") {
			if(this.object == null) {
				this.object = new Image();
				this.object.src = this.asseturl;
			}
			else {
				if(this.object.complete == true)
					return true;
			}
		}
		if(this.type == "audio") {
			if(this.object == null) {
				this.object = new Audio();
//				this.object.setAttribute("preload", true);
				this.object.src = this.asseturl;
				this.object.load();
			}
			else {
				return true;
			}
		}
		return false;
	};

	// Returns a copy thumbnail for the asset
	// Used to show asset on the frame in the IDE
	this.copy_to_frame = function(event_id) {
		str = "none";
		if(this.type == "image") {
			str = "<div class='buildframeasset'"
					+ "  id  = 'event-" + event_id
					+ "' style='background-image:url(\"" + this.asseturl
						+ "\");"
				+ "'>"
					+ "<div class='content-event' id='content-event-" + event_id + "'>"
						+ "z-index:"
						+ "<input type='text' id='event-input-"+event_id+"' value='1000'/>"
					+ "</div>"
				+ "</div>";
		}
		return str;
	};
}


var Animation = function () {
	this.id = 0;
	this.final_width = 0;
	this.final_height = 0;
	this.final_xpos = 0;
	this.final_ypos = 0;
	this.final_scale_x = 0;
	this.final_scale_y = 0;
	this.starttime = 0;
	this.duration = 0;

	this.initialize = function(variables) {
		if(variables.id)
			this.id = variables.id;
		if(variables.final_width)
			this.final_width = variables.final_width;
		if(variables.final_height)
			this.final_height = variables.final_height;
		if(variables.final_xpos)
			this.final_xpos = variables.final_xpos;
		if(variables.final_ypos)
			this.final_ypos = variables.final_ypos;
		if(variables.final_scale_x)
			this.final_scale_x = variables.final_scale_x;
		if(variables.final_scale_y)
			this.final_scale_y = variables.final_scale_y;
		if(variables.starttime)
			this.starttime = variables.starttime;
		if(variables.duration)
			this.duration = variables.duration;

	};
};

function event_click(e) {
	events = game.cur_part.partactions;

	for(var i = 0; i < events.length; i++) {
		event = events[i];
		var posX = e.pageX - $('#'+event.canvas).position().left;
		var posY = e.pageY - $('#'+event.canvas).position().top;
		if((event.xpos <= posX) 
			&& (event.xpos + event.width >= posX)
			&& (event.ypos <= posY)
			&& (event.ypos + event.height >= posY)) {

			eval(event.onclick);
		}
	}
}


// Model for an event
function Event (){
	this.part_id = 0;
	this.id = 0;
	this.canvas = null;
	this.context = null;
	this.starttime = 0;
	this.duration = 10;
	this.asset = "";
	this.xpos = 0;
	this.ypos = 0;
	this.width = "";
	this.height = "";

	this.cur_xpos = 0;
	this.cur_ypos = 0;
	this.cur_width = "";
	this.cur_height = "";
	this.cur_scale_x = 1;
	this.cur_scale_y = 1;

	this.copy_xpos = null;
	this.copy_ypos = null;
	this.copy_width = null;
	this.copy_height = null;

	this.scale_x = 1;
	this.scale_y = 1;
	this.z_index = 0;
	this.animation = null;
	this.onclick = null;

	this.last_render_time = -1;
	this.done = false;
	this.is_dirty = false;
	this.rendered = false;

	this.initialize = function(variables) {
		if(variables.part_id)
			this.part_id = variables.part_id;
		if(variables.id) {
			this.id = variables.id;
			this.canvas = 'canvas_' + 'part_' + this.part_id + '_' + this.id;
			$('body').append('<canvas class="maincontent" width=800 height=600 id="' + this.canvas + '"></canvas>');

			mycanvas = document.getElementById(this.canvas);
			mycanvas.style.zIndex = variables.z_index || this.z_index;

			this.context = mycanvas.getContext('2d');
		}
		if(variables.starttime)
			this.starttime = variables.starttime;
		if(variables.duration)
			this.duration = variables.duration;
		if(variables.asset)
			this.asset = variables.asset;
		if(variables.xpos)
			this.xpos = variables.xpos;
		if(variables.ypos)
			this.ypos = variables.ypos;
		if(variables.width)
			this.width = variables.width;
		if(variables.height)
			this.height = variables.height;
		if(variables.copy_xpos)
			this.copy_xpos = variables.copy_xpos;
		if(variables.copy_ypos)
			this.copy_ypos = variables.copy_ypos;
		if(variables.copy_width)
			this.copy_width = variables.copy_width;
		if(variables.copy_height)
			this.copy_height = variables.copy_height;
		if(variables.scale_x)
			this.scale_x = variables.scale_x;
		if(variables.scale_y)
			this.scale_y = variables.scale_y;
		if(variables.z_index)
			this.z_index = variables.z_index;
		if(variables.animation)
			this.animation = variables.animation;
		if(variables.onclick) {
			this.onclick = variables.onclick;
			var myevent = this; 
			$('#' + this.canvas).click(function(e){event_click(e);});
		}
	};

	this.render = function(part, myasset, mytime) {
		if(myasset.type == "canvas")
			part.scale(this, myasset, mytime);
		if(myasset.type == "image")
			this.render_image(part, myasset, mytime);
		if(myasset.type == "audio")
			this.render_audio(part, myasset, mytime);

		this.last_render_time = mytime;
	};

	this.scale = function(x, y, scale_x, scale_y) {
		if(this.context == null)
			return;

		this.context.translate(x, y);
		this.context.scale(scale_x, scale_y);
		this.is_dirty = true;
	}

	this.render_audio = function(part, myasset, mytime) {
		if(mytime > this.starttime + this.duration) {
			myasset.object.pause();
			this.done = true;
			return;
		}
		if(this.last_render_time == -1) {
			myasset.object.play();
			mylog("playing musica");
		}
	}

	this.render_image = function(part, asset, mytime) {
		mylog("event: " + this.id + ", mytime: " + mytime);
		if(mytime > this.starttime + this.duration) {
			//clear the canvas
			this.context.clearRect(0, 0, 800, 600);
			this.done = true;
			return;
		}

		if((this.starttime > game.cur_time)){
			return;
		}

		var new_cur_xpos = this.xpos;
		var new_cur_ypos = this.ypos;
		var new_cur_width = this.width;
		var new_cur_height = this.height;

		if(this.copy_xpos) {
			new_cur_xpos = part.get_event(this.copy_xpos).cur_xpos;
		}
		if(this.copy_ypos) {
			new_cur_ypos = part.get_event(this.copy_ypos).cur_ypos;
		}
		if(this.copy_width) {
			new_cur_width = part.get_event(this.copy_width).cur_width;
		}
		if(this.copy_height) {
			new_cur_height = part.get_event(this.copy_height).cur_height;
		}


		if((this.animation != null) 
			&& (this.animation.starttime <= mytime) 
			&& (this.animation.starttime + this.animation.duration > mytime)) {

			cur_duration = mytime - this.animation.starttime;
			new_cur_width = this.width + (this.animation.final_width - this.width) * cur_duration / this.animation.duration;
			new_cur_height = this.height + (this.animation.final_height - this.height) * cur_duration / this.animation.duration;
			new_cur_xpos = this.xpos 
						- 0.5 * (this.animation.final_width - this.width) * cur_duration / this.animation.duration
						+ (this.animation.final_xpos - this.xpos) * cur_duration / this.animation.duration;
			new_cur_ypos = this.ypos 
						- 0.5 * (this.animation.final_height - this.height) * cur_duration / this.animation.duration
						+ (this.animation.final_ypos - this.ypos) * cur_duration / this.animation.duration;
		}
		if((this.cur_width != new_cur_width) || (this.cur_height != new_cur_height) || (this.cur_xpos != new_cur_xpos) || (this.cur_ypos != new_cur_ypos) || (this.is_dirty)) {
			mylog("rendering {event_id: " + this.id
				+ ", timestamp: " + mytime 
				+ ", xpos: " + this.cur_xpos + ", " + new_cur_xpos
				+ ", ypos: " + this.cur_ypos + ", " + new_cur_ypos
				+ ", width: " + this.cur_width + ", " + new_cur_width
				+ ", height: " + this.cur_height + ", " + new_cur_height
				+ "}");
			//clear the canvas
			this.context.clearRect(this.cur_xpos-1, this.cur_ypos-1, this.cur_width+2, this.cur_height+2);

			this.cur_xpos = new_cur_xpos;
			this.cur_ypos = new_cur_ypos;
			this.cur_width = new_cur_width;
			this.cur_height = new_cur_height;

			this.context.drawImage(asset.object, this.cur_xpos, this.cur_ypos, this.cur_width, this.cur_height);
		}
	};
};



// Compare events based on z_index
function compare_events_starttime(e1, e2) {
	if (e1.starttime < e2.starttime)
    	return -1;
	if (e1.starttime > e2.starttime)
		return 1;
	return 0;
}

// Model for game part
var Part = function(){
	this.id = '1';
	this.next = '0';
	this.events = [];
	this.partactions = [];
	this.scale_x = 1;
	this.scale_y = 1;
	this.cur_scale_x = 1;
	this.cur_scale_y = 1;
	this.width = 800;
	this.height = 600;
	this.cur_width = 800;
	this.cur_height = 600;

	this.initialize = function(variables) {
		if(variables.id)
			this.id = variables.id;
		if(variables.next)
			this.next = variables.next;
		if(variables.events) {
			this.events = variables.events.sort(compare_events_starttime);
		}
		if(variables.partactions)
			this.partactions = variables.partactions;
	};

	this.scale = function(myevent, myasset, mytime) {
		mylog("scaling");

		if(mytime > myevent.starttime + myevent.duration) {
			myevent.done = true;
			return;
		}

		cur_scale_x = myevent.scale_x;
		cur_scale_y = myevent.scale_y;

		if((myevent.animation != null) 
				&& (myevent.animation.starttime <= mytime) 
				&& (myevent.animation.starttime + myevent.animation.duration > mytime)) {

			cur_duration = mytime - myevent.animation.starttime;
			cur_scale_x = myevent.scale_x + (myevent.animation.final_scale_x - myevent.scale_x) * cur_duration / myevent.animation.duration;
			cur_scale_y = myevent.scale_y + (myevent.animation.final_scale_y - myevent.scale_y) * cur_duration / myevent.animation.duration;
		}


		part_scale_x = cur_scale_x;
		part_scale_y = cur_scale_y;

		cur_scale_x /= this.cur_scale_x;
		cur_scale_y /= this.cur_scale_y;

		this.cur_scale_x = part_scale_x;
		this.cur_scale_y = part_scale_y;


		cur_width = this.width * this.cur_scale_x;
		cur_height = this.height * this.cur_scale_y;

		part_cur_width = cur_width;
		part_cur_height = cur_height;

		cur_width -= this.cur_width;
		cur_height -= this.cur_height;

		this.cur_width = part_cur_width;
		this.cur_height = part_cur_height;

		mylog("scaling canvas: scale_x:" + cur_scale_x + ", scale_y:" + cur_scale_y + ", newWidth:" + cur_width + ", newHeight:" + cur_height);


		for(var i = 0; i < this.events.length; i++) {
			this.events[i].scale(-(cur_width)/2, -(cur_height)/2, cur_scale_x, cur_scale_y);
		}
	};

	// Get the event with the given id
	this.get_event = function(myid) {
		for(var i = 0; i < this.events.length; i++) {
			if (this.events[i].id == myid)
				return this.events[i];
		}
		return null;
	};	
};



// Model for game
var Game = function(){
	this.id = 1;
	this.timescale = 0;
	this.gameurl = '';
	this.parts = [];
	this.assets = [];
	this.javascript = '';

	this.ready = false;
	this.cur_time = 0;
	this.cur_part = null;

	this.initialize = function(variables) {
		if(variables.id)
			this.id = variables.id;
		if(variables.timescale)
			this.timescale = variables.timescale;
		if(variables.gameurl)
			this.gameurl = variables.gameurl;
		if(variables.parts)
			this.parts = variables.parts;
		if(variables.assets)
			this.assets = variables.assets;
		if(variables.javascript)
			this.javascript = variables.javascript;
	};


	this.print = function() {
		for(var i = 0; i < this.parts.length; i++) {
			mylog("part: " + this.parts[i].id);
			for(var j = 0; j < this.parts[i].events.length; j++) {
				event = this.parts[i].events[j];
				mylog("\tevent: " + event.id + ", starttime:" + event.starttime + ", duration:" + event.duration);
			}
		}
	};

	// Get the asset with the given id
	this.get_asset = function(myid) {
		for(var i = 0; i < this.assets.length; i++) {
			if (this.assets[i].id == myid)
				return this.assets[i];
		}
		return null;
	};

	// Get the part with a given id
	this.get_part = function(myid) {
		for(var i = 0; i < this.parts.length; i++) {
			if (this.parts[i].id == myid)
				return this.parts[i];
		}
		return null;
	};

};


