// Paint App Javascript
'use strict';
(function () {
	var canvas = document.getElementById('paintArea');
	var context = canvas.getContext('2d');
	var drawnCircles = [];
	var currentDrawingcircle ;
	var isDebugMode = false;
	var refreshInterval = 20;
	var currentSelectedIndex = -1;
	var isDrag = false;
	canvas.onselectstart = function () { return false; }
	

	function Circle (x1,y1) {
		this.center = {};
		this.center.x = x1;
		this.center.y = y1;
		this.fill = "pink";
		this.radius = 10;
		this.drawable =false;
	}
	
	Circle.prototype.setRadius = function (x2,y2) {
		this.radius = Math.sqrt(Math.pow((x2 - this.center.x), 2) + Math.pow((y2-this.center.y), 2));
		if(isDebugMode){
			console.log("Radius og Circle:",this.radius);	
		}
		
	};
	Circle.prototype.draw =function (context,addToTheList) {
		context.beginPath();
		context.arc(this.center.x,this.center.y,this.radius,2*Math.PI,false);
		context.save();
		context.fillStyle = this.fill;
		context.fill();
		context.restore();
		if(addToTheList) {
			drawnCircles.push(currentDrawingcircle);	
		}
		
	}

	Circle.prototype.setColor = function (color) {
		this.fill = color;
	}

	Circle.prototype.isDrawable = function(){
		return this.radius>0;
	}

	Circle.prototype.isPointInCircle = function (e) {
		var x = parseInt(e.clientX - canvas.offsetLeft);
		var y = parseInt(e.clientY - canvas.offsetTop);
		if(isDebugMode){
			console.log("value of x:" + xCal);
			console.log("value of y:"+ yCal);
			console.log("value of r:" + rCal);
		}
		return (Math.pow((x-this.center.x) ,2) + Math.pow((y-this.center.y) ,2)) <= Math.pow(this.radius,2);
	}

	function getRandomColor () {
		var letters = '0123456789ABCDEF'.split('');
		var color = '#';
		for (var i = 0; i < 6; i++) {
			color += letters[Math.round(Math.random () * 15)];
		};
		return color;
	}

	canvas.onmousedown = function (e) {
		var x = parseInt(e.clientX - canvas.offsetLeft);
		var y = parseInt(e.clientY - canvas.offsetTop);

		for (var i = drawnCircles.length-1; i >= 0; i--) {
			if(drawnCircles[i].isPointInCircle(e)) {
				isDrag = true;
				currentSelectedIndex = i;
				canvas.onmousemove = mouseMove;
				break;
			}
		}
		if(!isDrag){
			currentDrawingcircle = new Circle(x,y);
			currentDrawingcircle.setColor(getRandomColor());	
		}
	}

	function mouseMove(e) {
		if(isDrag) {
			drawnCircles[currentSelectedIndex].center.x = parseInt(e.clientX - canvas.offsetLeft);
			drawnCircles[currentSelectedIndex].center.y = parseInt(e.clientY - canvas.offsetTop);
		}
	}

	canvas.onmouseup = function (e) {
		if(currentDrawingcircle != null && isDrag == false) {
			var x = parseInt(e.clientX - canvas.offsetLeft);
			var y = parseInt(e.clientY - canvas.offsetTop);

			currentDrawingcircle.setRadius(x,y);
			if(currentDrawingcircle.isDrawable()) {
				currentDrawingcircle.draw(context,true);
			}
		} 
		currentDrawingcircle =null;
		canvas.onmousemove = null;
		currentSelectedIndex = -1;
		//inValidate = false;
		isDrag = false;
	}

	canvas.ondblclick = function (e) {

		for (var i = drawnCircles.length - 1; i >=0; i--) {
			if(drawnCircles[i].isPointInCircle(e)) {
				//console.log(" IN delete");
				drawnCircles.splice(i,1);
				//inValidate = true;
				allCircleDraw();
				break;
			}
		}
		currentDrawingcircle =null;
	}

	var reset = document.getElementById('reset');
	reset.onclick = clearAll;

	function clearCanvas () {
		context.clearRect(0,0,canvas.width,canvas.height);
	}
	function clearAll () {
		clearCanvas();
		drawnCircles = [];
	}
	
	setInterval(allCircleDraw,refreshInterval);
	
	function allCircleDraw() {
		clearCanvas();
		for (var i = 0; i < drawnCircles.length ; i++) {
			drawnCircles[i].draw(context,false);
		};
	}
})();