Q.scene('menu', function(stage) {
    // insert object onto the stage. This method will return the inserted object.
    var hasInfoShow = false;
    var ctx = document.getElementById('game_canvas').getContext('2d');
    var fin = stage.insert(new Q.Finance({x: Q.width/2-85, y: Q.height/2-50, scale: 1}));
    var hr = stage.insert(new Q.HR({x: Q.width/2+85, y: Q.height/2-50, scale: 1}));
    var op = stage.insert(new Q.Operation({x: Q.width/2-85, y: Q.height/2+50, scale: 1}));
    var sales = stage.insert(new Q.Sales({x: Q.width/2+85, y: Q.height/2+50, scale: 1}));
    console.log(Q.width);
    console.log(Q.height);
    console.log("BBBB");
    //console.log(op.className);
    //stage.add("viewport");
    
    //Q.debug = true;
  	//Q.debugFill = true;
});

Q.scene('optionsOP',function(stage) {
  var box = stage.insert(new Q.UI.Container({
    x: Q.width/2, y: Q.height/2, fill: "rgba(0,0,0,0.5)"
  }));
  
  var button = box.insert(new Q.UI.Button({ x: 0, y: 0, w:150, fill: "#CCCCCC",
                                           label: "Layout" }));
  var button1 = box.insert(new Q.UI.Button({ x: 0, y: 50, w:150, fill: "#CCCCCC",
                                           label: "AAA" }));
  var button2 = box.insert(new Q.UI.Button({ x: 0, y: 100, w:150, fill: "#CCCCCC",
                                           label: "Cancel" }));
  button.on("click",function() {
    Q.clearStages();
    Q.stageScene('AdminLayout');
  });
  button1.on("click",function() {
    Q.clearStages();
    Q.stageScene('MasterSchedule');
  });
  button2.on("click",function() {
    Q.clearStages();
    Q.stageScene('menu');
  });
  box.fit(20);
});

Q.scene('AdminLayout',function(stage) {
	var CutSt = stage.insert(new Q.CutSt({x: Q.width/2-170, y: Q.height/2-50, scale: 1}));
	var WvSt = stage.insert(new Q.WvSt({x: Q.width/2, y: Q.height/2-50, scale: 1}));
	var FiSt = stage.insert(new Q.FiSt({x: Q.width/2+170, y: Q.height/2-50, scale: 1}));
	var RcSt = stage.insert(new Q.RcSt({x: Q.width/2-170, y: Q.height/2+50, scale: 1}));
	var Admin = stage.insert(new Q.Admin({x: Q.width/2, y: Q.height/2+50, scale: 1}));
	var FGSt = stage.insert(new Q.FGSt({x: Q.width/2+170, y: Q.height/2+50, scale: 1}));
	stage.obj = new Array();
	stage.obj[0] = CutSt;
	stage.obj[1] = WvSt;
	stage.obj[2] = FiSt;
	stage.obj[3] = RcSt;
	stage.obj[4] = Admin;
	stage.obj[5] = FGSt;
	var rlButton = stage.insert(new Q.UI.Button({ x: 100, y: 50, w:100, fill: "#99FF66",
                                           label: "Reload", scale:0.5, color:"#339933" }));
	var bkButton = stage.insert(new Q.UI.Button({ x: 100, y: 100, w:100, fill: "#99FF66",
                                           label: "Back", scale:0.5, color:"#339933" }));
	rlButton.on("click",function() {
		Q.clearStages();
		Q.stageScene("AdminLayout");
	});
	bkButton.on("click",function() {
		Q.clearStages();
		Q.stageScene("menu");
	});
});

Q.scene('MasterSchedule',function(stage){
  

  var rlButton = stage.insert(new Q.UI.Button({ x: 100, y: 50, z: 1, w:100, fill: "#99FF66",
                                           label: "Reload", scale:0.5, color:"#339933" }));
  var bkButton = stage.insert(new Q.UI.Button({ x: 100, y: 100, z: 1, w:100, fill: "#99FF66",
                                           label: "Back", scale:0.5, color:"#339933" }));
  rlButton.on("click",function() {
    Q.clearStages();
    Q.stageScene("MasterSchedule");
  });
  bkButton.on("click",function() {
    Q.clearStages();
    Q.stageScene("menu");
  });
  //var javascript = require('../site_media/javascript/javascript.js');
  var response = '{"array": [{"array1": [0,1,1,1]},{"array2": [1,2,2,2]},{"array3": [0,3,3,3]},{"array4": [0,4,4,4]}]}';
  

  if(fetchValue("dataVal") == null){
    storeValue("dataVal",response);
    var obj = fetchValue("dataVal");
    console.log(obj);
  }
  else{
    response = fetchValue("dataVal");
  }
  var jsonObject = JSON.parse(response);

  var plus31 = stage.insert(new Q.UI.Button({ x: Q.width/2-60, y: Q.height/2+80, z:10, w:10, h:10, fill: "#CCCCCC",
                                           label: "+" }));
  var plus32 = stage.insert(new Q.UI.Button({ x: Q.width/2+20, y: Q.height/2+80, w:10, h:10, fill: "#CCCCCC",
                                       label: "+" }));
  var plus33 = stage.insert(new Q.UI.Button({ x: Q.width/2+100, y: Q.height/2+80, w:10, h:10, fill: "#CCCCCC",
                                       label: "+" }));
  var plus34 = stage.insert(new Q.UI.Button({ x: Q.width/2+180, y: Q.height/2+80, w:10, h:10, fill: "#CCCCCC",
                                       label: "+" }));
  var minus31 = stage.insert(new Q.UI.Button({ x: Q.width/2-100, y: Q.height/2+80, w:10, h:10, fill: "#CCCCCC",
                                       label: "-" }));
  var minus32 = stage.insert(new Q.UI.Button({ x: Q.width/2-20, y: Q.height/2+80, w:10, h:10, fill: "#CCCCCC",
                                       label: "-" }));
  var minus33 = stage.insert(new Q.UI.Button({ x: Q.width/2+60, y: Q.height/2+80, w:10, h:10, fill: "#CCCCCC",
                                       label: "-" }));
  var minus34 = stage.insert(new Q.UI.Button({ x: Q.width/2+140, y: Q.height/2+80, w:10, h:10, fill: "#CCCCCC",
                                       label: "-" }));
  var plus41 = stage.insert(new Q.UI.Button({ x: Q.width/2-60, y: Q.height/2+160, w:10, h:10, fill: "#CCCCCC",
                                       label: "+" }));
  var plus42 = stage.insert(new Q.UI.Button({ x: Q.width/2+20, y: Q.height/2+160, w:10, h:10, fill: "#CCCCCC",
                                       label: "+" }));
  var plus43 = stage.insert(new Q.UI.Button({ x: Q.width/2+100, y: Q.height/2+160, w:10, h:10, fill: "#CCCCCC",
                                       label: "+" }));
  var plus44 = stage.insert(new Q.UI.Button({ x: Q.width/2+180, y: Q.height/2+160, w:10, h:10, fill: "#CCCCCC",
                                       label: "+" }));
  var minus41 = stage.insert(new Q.UI.Button({ x: Q.width/2-100, y: Q.height/2+160, w:10, h:10, fill: "#CCCCCC",
                                       label: "-" }));
  var minus42 = stage.insert(new Q.UI.Button({ x: Q.width/2-20, y: Q.height/2+160, w:10, h:10, fill: "#CCCCCC",
                                       label: "-" }));
  var minus43 = stage.insert(new Q.UI.Button({ x: Q.width/2+60, y: Q.height/2+160, w:10, h:10, fill: "#CCCCCC",
                                       label: "-" }));
  var minus44 = stage.insert(new Q.UI.Button({ x: Q.width/2+140, y: Q.height/2+160, w:10, h:10, fill: "#CCCCCC",
                                       label: "-" }));
  plus31.on("click",function() {
    jsonObject.array[2].array3[0]+=1;
    response = JSON.stringify(jsonObject);
    localStorage.setItem("dataVal",response);
  });
  minus31.on("click",function(){
    if(jsonObject.array[2].array3[0]!=0)
      jsonObject.array[2].array3[0]-=1;
    response = JSON.stringify(jsonObject);
    localStorage.setItem("dataVal",response);
  });
  plus32.on("click",function() {
    jsonObject.array[2].array3[1]+=1;
    response = JSON.stringify(jsonObject);
    localStorage.setItem("dataVal",response);
  });
  minus32.on("click",function(){
    if(jsonObject.array[2].array3[1]!=0)
      jsonObject.array[2].array3[1]-=1;
    response = JSON.stringify(jsonObject);
    localStorage.setItem("dataVal",response);
  });
  plus33.on("click",function() {
    jsonObject.array[2].array3[2]+=1;
    response = JSON.stringify(jsonObject);
    localStorage.setItem("dataVal",response);
  });
  minus33.on("click",function(){
    if(jsonObject.array[2].array3[2]!=0)
      jsonObject.array[2].array3[2]-=1;
    response = JSON.stringify(jsonObject);
    localStorage.setItem("dataVal",response);
  });
  plus34.on("click",function() {
    jsonObject.array[2].array3[3]+=1;
    response = JSON.stringify(jsonObject);
    localStorage.setItem("dataVal",response);
  });
  minus34.on("click",function(){
    if(jsonObject.array[2].array3[3]!=0)
      jsonObject.array[2].array3[3]-=1;
    response = JSON.stringify(jsonObject);
    localStorage.setItem("dataVal",response);
  });
  plus41.on("click",function() {
    jsonObject.array[3].array4[0]+=1;
    response = JSON.stringify(jsonObject);
    localStorage.setItem("dataVal",response);
  });
  minus41.on("click",function(){
    if(jsonObject.array[3].array4[0]!=0)
      jsonObject.array[3].array4[0]-=1;
    response = JSON.stringify(jsonObject);
    localStorage.setItem("dataVal",response);
  });
  plus42.on("click",function() {
    jsonObject.array[3].array4[1]+=1;
    response = JSON.stringify(jsonObject);
    localStorage.setItem("dataVal",response);
  });
  minus42.on("click",function(){
    if(jsonObject.array[3].array4[1]!=0)
      jsonObject.array[3].array4[1]-=1;
    response = JSON.stringify(jsonObject);
    localStorage.setItem("dataVal",response);
  });
  plus43.on("click",function() {
    jsonObject.array[3].array4[2]+=1;
    response = JSON.stringify(jsonObject);
    localStorage.setItem("dataVal",response);
  });
  minus43.on("click",function(){
    if(jsonObject.array[3].array4[2]!=0)
      jsonObject.array[3].array4[2]-=1;
    response = JSON.stringify(jsonObject);
    localStorage.setItem("dataVal",response);
  });
  plus44.on("click",function() {
    jsonObject.array[3].array4[3]+=1;
    response = JSON.stringify(jsonObject);
    localStorage.setItem("dataVal",response);
  });
  minus44.on("click",function(){
    if(jsonObject.array[3].array4[3]!=0)
      jsonObject.array[3].array4[3]-=1;
    response = JSON.stringify(jsonObject);
    localStorage.setItem("dataVal",response);
  });





  var MSTb = stage.insert(new Q.MSTb({x: Q.width/2, y: Q.height/2, scale: 1}));
  MSTb.p.dataVal = jsonObject.array;
});



// Touch events do most of the work for us, but the
  // touch system doesn't handle mousemouse events, so lets add
  // in an event listener and use `Stage.locate` to highlight
  // sprites on desktop.
  Q.el.addEventListener('mousemove',function(e) {
    var x = e.offsetX || e.layerX,
        y = e.offsetY || e.layerY,
        stage = Q.stage();

    // Use the helper methods from the Input Module on Q to
    // translate from canvas to stage
    var stageX = Q.canvasToStageX(x, stage),
        stageY = Q.canvasToStageY(y, stage);

    // Find the first object at that position on the stage
    var obj = stage.locate(stageX,stageY);

  });

