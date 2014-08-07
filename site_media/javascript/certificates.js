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
		console.log("finished count: " + count);
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





//	var body_activities = ["eat nutritional food", "take supplements", "keep up hygiene", "rest", "do physical activity", "maintain proper urination sanitation"];
var body_activities = ["eat nutritional food", "take supplements"];
var a = new Array(body_activities.length);

for(i = 0; i<body_activities.length; i++){
	a[i] = null;
/*			new Q.Form(
				{
					content: [
						new MultipleChoiceQuestion(
							new Q.ImageText("Did you " + body_activities[i] + "?", null, null), 
							[
								new Q.ImageText("Yes", null, null), 
								new Q.ImageText("No", null, null), 
							],
							false,
						)
					]
				}
			);*/
}

//for(i = 0; i < a.length-1; i++)
//	a[i].next = [a[i+1], a[i+1]];


var b = new Array(1);
b[0] = new Q.MultipleChoiceQuestion(
	new Q.ImageText("To get this piece, tell me, what time of the day are you most happy?"),
	[
		new Q.ImageText("Morning"),
		new Q.ImageText("Evening"),
		new Q.ImageText("Night"),
	]
);

for(i = 0; i < b.length-1; i++)
	b[i].next = [b[i+1], b[i+1], b[i+1]];




var c = new Array(2);
c[0] = new Q.MultipleChoiceQuestion(
	new Q.ImageText("Who is supportive in your life?"),
	[
		new Q.ImageText("Father"),
		new Q.ImageText("Mother"),
		new Q.ImageText("Brother"),
		new Q.ImageText("Sister")
	]
);
c[1] = new Q.MultipleChoiceQuestion(
	new Q.ImageText("Who makes your life harder?"),
	[
		new Q.ImageText("Father"),
		new Q.ImageText("Mother"),
		new Q.ImageText("Brother"),
		new Q.ImageText("Sister")
	]
);

for(i = 0; i < c.length-1; i++)
	c[i].next = [c[i+1], c[i+1], c[i+1], c[i+1]];


var health_test = new Array(3);
health_test[0] = new Q.MultipleChoiceQuestion(
	new Q.ImageText("Oh, hello! How are you? I’m still fit (frown face, lonely) and better than everyone else! I wish I had more friends though and that I was more motivated to finish my work for my business. Can you help me?"),
	[
		new Q.ImageText("Mind"),
		new Q.ImageText("Body"),
		new Q.ImageText("Relationship"),
	]
);
health_test[1] = new Q.MultipleChoiceQuestion(
	new Q.ImageText("Hello! How are you! I’m doing well, still feeling motivated and pretty good. I just wish I didn’t get sick all the time and had more friends. Can you help me?"),
	[
		new Q.ImageText("Mind"),
		new Q.ImageText("Body"),
		new Q.ImageText("Relationship"),
	]
);
health_test[2] = new Q.MultipleChoiceQuestion(
	new Q.ImageText("Hello! How are you! I’m doing well, still have lots of friends and family to spend time with. I just wish I didn’t get sick all the time and felt more motivated and energized to do work. Can you help me?"),
	[
		new Q.ImageText("Mind"),
		new Q.ImageText("Body"),
		new Q.ImageText("Relationship"),
	]
);

for(i = 0; i < health_test.length - 1; i++)
	health_test[i].next = [health_test[i+1], health_test[i+1], health_test[i+1]];


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
						"market_research_1",
						"Lecture",
						"Lecture.js",
						false,
						null,
						{House: true, Market: false, Workshop: false, School:true, SeemaWorkshop: false, HealthCenter: false}
					),
					new CertificateElement(
						"market_research_2",
						"007",
						"007.js",
						false,
						null,
						{House: true, Market: true, Workshop: true, School:false, SeemaWorkshop: true, HealthCenter: false}
					),
				]
			),
			new CertificateBadge(
				"Mind, Body, and ...", 
				"Mind_Body_Relations",
				"Objects/Medal/badge01.png",
				false, 
				[
					new CertificateElement(
						"health_1",
						"Health",
						"Health.js",
						false,
						{'Ram': a[0], 'Alam': b[0], 'Arvind': c[0]},
						{House: false, Market: false, Workshop: false, School: false, SeemaWorkshop: false, HealthCenter: false}
					),
					new CertificateElement(
						"health_2",
						"Test",
						"Test.js",
						false,
						health_test[0],
						{House: false, Market: false, Workshop: false, School: false, SeemaWorkshop: false, HealthCenter: true}
					),
				]

			),
			new CertificateBadge(
				"Finance", 
				"Finance",
				"Objects/Medal/badge01.png",
				false, 
				[
					new CertificateElement(
						"loan_1",
						"Loan",
						"loan.js",
						false,
						{'Ram': a[0], 'Alam': b[0], 'Arvind': c[0]},
						{House: false, Market: true, Workshop: false, School: false, SeemaWorkshop: false, HealthCenter: false}
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
			console.log(f);
			loadjscssfile(f, "js");
		}
	}
}

