/*
	element_id: Unique string representing the stage level that will be activated when the element is activated
*/
function CertificateElement(element_id, name, file, isFinished, element, interactability) {
	this.element_id = element_id;
	this.name = name;
	this.file = file;
	this.isFinished = isFinished;
	this.element = element;
	this.interactability = interactability;

	this.activateElement = function(myQ) {
		console.log("activating element MOL");
		this.MOL.activate(myQ);
	};
}

function CertificateBadge(name, folder, image, isFinished, elements) {
	this.name = name;
	this.folder = folder;
	this.image = image;
	this.isFinished = isFinished;
	this.elements = elements;

	this.activateElement = function(myQ) {
		console.log("activating element MOL");
		this.elements[0].activate(myQ);
	};

	this.countFinishedElements = function() {
		var count = 0;
		for(i in this.elements) {
			if(this.elements[i].isFinished)
				count++;
		}
		return count;
	};
}

function Certificate(name, folder, isFinished, badges) {
	this.name = name;
	this.folder = folder;
	this.isFinished = isFinished;
	this.badges = badges;

	this.activateElement = function(myQ) {
		console.log("activating certificate element");
		this.badges[0].activateElement(myQ);

	};
}




game.certificates = [
	new Certificate(
		"Level One", 
		"One",
		false,
		[
			new CertificateBadge(
				"Market Research", 
				"Market_Research",
				"Objects/Medal/badge01.png",
				false, 
				[
					new CertificateElement(
						"market_research_0_setup",
						"Setup",
						"setup.js",
						false,
						null,
						{House: false, Market: false, Workshop: false, School:false, SeemaWorkshop: false, HealthCenter: false}
					),
					new CertificateElement(
						"market_research_1",
						"Classroom",
						"Lecture.js",
						false,
						null,
						{House: true, Market: true, Workshop: false, School:true, SeemaWorkshop: true, HealthCenter: false}
					),
					new CertificateElement(
						"market_research_2",
						"007",
						"007.js",
						false,
						null,
						{House: true, Market: true, Workshop: false, School:false, SeemaWorkshop: true, HealthCenter: false}
					),
				]
			),


		]
	),
];


for(var i = 0; i < game.certificates.length; i++) {
	var certificate = game.certificates[i];
	for(var j = 0; j < certificate.badges.length; j++) {
		var badge = certificate.badges[j];
		for(var k = 0; k < badge.elements.length; k++) {
			var element = badge.elements[k];
			var f = "/site_media/javascript/certificates/" + certificate.folder + "/"  + badge.folder + "/" + element.file;
			loadjscssfile(f, "js");
		}
	}
}

