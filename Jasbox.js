//Global variable
var image,imageWidth,imageHeight,draggedCanvas;
var showPic = document.getElementById("dShowPic"),
	hiddenPic = document.getElementById("dHiddenPic"),
	tb = document.getElementById("leftTable"),
	crPuzzle = document.getElementById("createPuzzle");
document.ondragover = function(e) { e.preventDefault(); };
document.ondrop = function(e) { e.preventDefault(); };

function selectFile(){
	var td;
	//3*3 blocks
	for(var i=0;i < 3; i++){
		for( var j=0;j < 3; j++){
			td = tb.rows[i].cells[j];
			td.innerHTML = "";
		}
	}
	var file = document.getElementById("file").files[0];
	if(!/image\/\w+/.test(file.type)){
		alert(file.name + "不是图像哦，亲");
		showPic.innerHTML = "请选择图片";
		return;
	}else{
		showPic.innerHTML = "";
		hiddenPic.innerHTML = "";
		var canvas = document.createElement("canvas");
		canvas.style.display = "none";
		hiddenPic.appendChild(canvas);
		var ctx = canvas.getContext('2d');
		image = new Image();
		image.src = window.URL.createObjectURL(file);//更多信息：https://developer.mozilla.org/zh-CN/docs/DOM/window.URL.createObjectURL
		image.onload = function(){
			ctx.drawImage(image, 0, 0);
			imageWidth = image.width;
			imageHeight = image.height;
		};
		crPuzzle.disabled = "";
	}
}
//下面Canvas API施展平台
function drawTable(){
	var canvasArray, canvas, ctx, index, count, table,
		picW = 240,
		picH = 240;
	canvasArray = [];
	table = document.createElement("table");
	table.setAttribute("border","0");
	table.setAttribute("cellpadding","0");
	table.setAttribute("cellspacing","1");
	for(var i=0;i<3;i++){
		for(var j=0;j<3;j++){
			var canvas = document.createElement("canvas"),
				ctx = canvas.getContext('2d');
			canvas.setAttribute("width", picW/3  + "px");
			canvas.setAttribute("height", picH/3 + "px");
			canvas.setAttribute("draggable","true");
			canvas.style.display = "block";
			canvas.setAttribute("index", i*3 + j);
			canvas.addEventListener("dragstart", function(e){
					draggedCanvas = e.srcElement||e.target;
					var dt = e.dataTransfer;
					dt.effectAllowed = 'all';
					dt.setData("text/plain", draggedCanvas.getAttribute("index"));
					},false);
			ctx.fillRect(0,0,canvas.width, canvas.height);
			ctx.drawImage(image, j*imageWidth/3, i*imageHeight/3,imageWidth/3,imageHeight/3,0, 0, picW/3,picH/3);
			canvasArray.push(canvas);
		}
	}
	count = 9;
	for(var i=0;i<3;i++){
		tr = document.createElement("tr");
		for(var j=0;j<3;j++){
			var td = document.createElement("td");
			td.setAttribute("tag","td");
			td.addEventListener("draggend",function(e){
					e.preventDefault();
					},false);
			td.addEventListener("drop",function(e){
					var td = e.srcElement||e.target;
					if(td.getAttribute("tag")!=null){
					td.appendChild(draggedCanvas);
					}
					e.preventDefault();
					e.stopPropagation();
					},false);
			tr.appendChild(td);
			index = parseInt(Math.random()*count);
			td.appendChild(canvasArray[index]);
			canvasArray.splice(index,1);
			count -=1;
		}
		table.appendChild(tr);
	}
	showPic.appendChild(table);
	crPuzzle.disabled = "disabled";
}

function window_onload(){
	var td;
	for(var i=0;i<3;i++){
		for(var j=0;j<3;j++){
			td = tb.rows[i].cells[j];
			td.addEventListener("draggend", function(e){
					e.preventDefault();
					},false);
			td.addEventListener("drop",function(e){
					var td = e.srcElement||e.target;
					if(td.getAttribute("tag")!= null){
					td.appendChild(draggedCanvas);
					}
					var allHaveFlag = true;
					var indexStr = "";
					for(var i=0;i<3;i++){
					for(var j=0;j<3;j++){
					canvas = document.getElementById("leftTable").rows[i].cells[j].children[0];
					if(canvas == null){
					allHavaFlag = false;
					indexStr = "";
					break;
					}
					else{
					indexStr += canvas.getAttribute("index");
					}
					}
					}
					var allStr = "0123456789";
					if(allHaveFlag&&indexStr ==allStr){
						alert("You make it");
					}
					e.preventDefault();
					e.stopPropagation();
			},false);
		}

	}
}