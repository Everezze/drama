const body = document.querySelector("body");
const sides = {
	"hor": ["left","right","Left","Right","height"],
	"vert": ["top","bottom","Top","Bottom","width"]
};
let currentTask = false;
let divs;
let oldHover = false;
let currentHover = false;
let lastTask = false;
let isLast = false;
let activeParent = false;

function Drag(container,settings){
	container = document.querySelector(container);
	if(!container){
		return null;
	}
	const newId = ++Drag.prototype.lastId;
	container.addEventListener("mousedown",setupDrag,{capture:true});
	container.dataset.dragId = newId;
	this.dragger = container;
	this.draggins = container.children;
	this.adjustment = false;
	this.direction = "vert";
	this.sides = sides["vert"];
	let tasks = Array.from(container.children);
	tasks.forEach(function(element){
	element.addEventListener("mousedown", addTracker);
	element.addEventListener("selectstart",removeSelection);
	});

	if(settings.direction == "hor"){
		this.adjustment = true;
		this.direction = "hor";
		this.sides = sides["hor"];
	}
	Drag.prototype.contexts[newId] = this;
};

Drag.prototype.currentHover = null;
Drag.prototype.oldHover = null;
Drag.prototype.lastTask = null;
Drag.prototype.isLast = null;
Drag.prototype.contexts = {};
Drag.prototype.lastId = 0;
Drag.prototype.firstDrag = true;

const customDrag = new Drag(".vert-drag .task-parent",{});
const horDrag = new Drag(".hor-drag .task-parent",{direction:"hor"});

function divTracker(e){
	const task = e.currentTarget;
	const contextId = task.closest("[data-drag-id]").dataset.dragId;
	const context = Drag.prototype.contexts[contextId];
	const dragData = Drag.prototype;
	//if(!activeHint){
	//	activeHint = true;
	//};
	//const type = themesData[currentList.dataset.type];
	//const elemStyles = window.getComputedStyle(task);
	if(context.firstDrag){
		if(context.adjustment){
			console.log("old left =>",task.getBoundingClientRect()["left"]);
			const boundingRect = task.getBoundingClientRect();
			let oldWidth = boundingRect.width;
			let oldLeft = boundingRect.left;
			task.style.left = `${oldLeft - context.dragger.getBoundingClientRect().left}px`;
			task.style.width = `${oldWidth}px`;
		}
		else{
			task.style.width = "100%";
		}
		context.firstDrag = false;
	}
	task.style.position = "absolute";
	task.style.setProperty("--bg-light","80%");
	//console.log("result of top with movement is: ",`${draggingContext['taskFirstSide'] + e.movementY}px`);
	console.log("last taskTop : ",context.taskTop,"\nafter movement value of tasktop is ",context["taskTop"] + e.movementY);
	task.style.top = `${context["taskTop"] + e.movementY}px`;
	task.style.left = `${context["taskLeft"] + e.movementX}px`;
	context["taskTop"] += e.movementY;
	context["taskLeft"] += e.movementX;
	context["firstSide"] += e.movementY;
	context["secondSide"] += e.movementY;

	//return;
	const hoveredElement = determineHoveredElement(task,context);
	updateHint(hoveredElement,context);
};

function addTracker(e){
	const el = e.currentTarget;
	const container = el.closest("[data-drag-id]");
	const context = Drag.prototype.contexts[container.dataset.dragId];
	//console.dir(el.getBoundingClientRect());
	el.addEventListener("mousemove",divTracker);
	el.addEventListener("mouseup",switchAndDisableDrag);
	//e.currentTarget.sides = sides[e.currentTarget.parentElement.direction];
	//console.log(activeParent = el.parentElement);
	//activeParent = el.parentElement;
	//divs = activeParent.children;
	//if(window.getComputedStyle(activeParent)["display"] == "flex"){
	//	activeParent.needAdjustment = true;
	//}
	const draggins = container.children;
	Drag.prototype.lastTask = el === draggins[draggins.length-1] ?
		draggins[draggins.length-2] :
		draggins[draggins.length-1];

	const elementRectangle = el.getBoundingClientRect();
	const elementStyles = window.getComputedStyle(el);
	//const edges = draggingContext["sides"];
	//context["taskTop"] = parseInt(elementRectangle["top"],10);
	//context["taskLeft"] = parseInt(elementRectangle["left"],10);
	context["firstSide"] = parseInt(elementRectangle[context.sides[0]],10);
	context["secondSide"] = parseInt(elementRectangle[context.sides[1]],10);
	context["taskTop"] = el.offsetTop;
	context["taskLeft"] = el.offsetLeft;
	//context["taskLeft"] = elementStyles[context.sides[1]] == "auto" ? 0:elementStyles[context.sides[1]];
	console.log("last task from proto is: ",context.lastTask);
	console.log("initial top is: ",context.taskTop);
	console.log("initial left is: ",context.taskLeft);
};

function switchAndDisableDrag(e){
	let task = e.currentTarget;
	const dragId = task.closest("[data-drag-id]").dataset.dragId;
	const context = Drag.prototype.contexts[dragId];
	const activeParent = context.dragger;
	console.log("mouseup now","currhov: ",context.currentHover);
	//currentTask = task;
	task.style.animation = "none";
	console.log("removing animation value is: ",task.style.animation);
	task.removeEventListener("mousemove",divTracker);
	task.style.position = "static";
	task.style.top = "initial";
	task.style.left = "initial";
	task.style.width = "";
	task.style.background = "";
	//task.style.background = "";
	if(context.currentHover){
		if(context.isLast){
			activeParent.insertBefore(task,null);
			context.currentHover.style["margin"+context.sides[3]] = "";
		}
		else{
			activeParent.insertBefore(task,context.currentHover);
			context.currentHover.style["margin"+context.sides[2]] = "";
		}
		task.style.animation = "valid_insert .5s ease-out";
		//context.oldHover = context.currentHover = false;
	}
	else{
		setTimeout( () => {task.style.animation = "invalid_insert .5s ease-out";},1);
		//task.style.animation = "invalid_insert .5s ease-out";
	}
	context.firstDrag = true;
};

function getHoveredElement(centerPoint,side,direction){
	let A,B;
	if(direction  =="hor"){
		A = side;
		B = centerPoint;
	}
	else{
		A = centerPoint;
		B = side;
	}
	return document.elementFromPoint(A,B);
}

function removeSelection(e){
	e.preventDefault();
}

function determineHoveredElement(task,context){
	//const sides = [
	//	task.getBoundingClientRect()[edges[0]],
	//	task.getBoundingClientRect()[edges[1]]
	//];
	const centerPoint = context.centerPoint;
	const sides = [
		context.sides[0],
		context.sides[1]
	];
	const edges = [
		context.firstSide,
		context.secondSide
	];

    console.log("sides are: ",sides);
	//let topandbot = ["top","bottom"];
    let hoveredElement;
	const parent = context.dragger;
    //console.log("parent task is: ",parent);
	let i =0;
	while(i<2){
		task.style.visibility="hidden";
		hoveredElement = getHoveredElement(centerPoint,edges[i],context.direction);
		task.style.visibility="initial";
        console.log("with i =",i, " temp element is: ",hoveredElement);
		console.log("parent container  is:",parent);

		if(parent.contains(hoveredElement)){
			if(hoveredElement === parent){
				if(context.currentHover){
					return context.currentHover;
				}
				else{
					return false;
				}
			}
			else if(hoveredElement.parentElement !== parent){
				while(hoveredElement.parentElement !== parent){
					console.log("in while(hoveredElement): ",hoveredElement);
					hoveredElement = hoveredElement.parentElement;
					console.log("in while(hoveredElement): ",hoveredElement);
				};
			}

			if(edges[i] <= hoveredElement.getBoundingClientRect()[sides[i]]){
				if(context.isLast){
					context.isLast = false;
				}
				console.log("distance is less, so higher");
				return hoveredElement;
			}
			else if(hoveredElement === context.lastTask){
				console.log("setting last to true");
				context.isLast = true;
				return hoveredElement;
			}
		}
		i++;
	}
	return false;
}

function setupDrag(e){
	const el = e.currentTarget;
	const dragProto = Drag.prototype;
	const dragId = el.dataset.dragId;
	const context = dragProto.contexts[dragId];
	console.log("id of container is: ",el.dataset.dragId);
	const elDimensions = el.getBoundingClientRect();
	const sideToGetCenterPoint = context.direction == "vert" ?
		"left":"top";
	Drag.prototype.centerPoint = elDimensions[sideToGetCenterPoint] + (elDimensions[context.sides[context.sides.length-1]] /2);
}

function updateHint(hoveredElement,context){
	const edges = context.sides;
	if(hoveredElement){
		console.log("hoveredEl is: ",hoveredElement);
		if(!context.currentHover){
			context.oldHover = context.currentHover = hoveredElement;
			if(context.isLast){
				context.currentHover.style["margin"+edges[3]] = "2rem";
			}
			else{
				context.currentHover.style["margin"+edges[2]] = "2rem";
			}
		}
		else{
			context.oldHover = context.currentHover;
			context.currentHover = hoveredElement;
			if(context.isLast){
				context.oldHover.style["margin"+edges[2]] = "";
				context.currentHover.style["margin"+edges[3]] = "2rem";
			}
			else{
				context.oldHover.style["margin"+edges[3]] = "";
				context.oldHover.style["margin"+edges[2]] = "";
				context.currentHover.style["margin"+edges[2]] = "2rem";
			}
		}
	}
	else if(context.currentHover){
		if(context.isLast){
			console.log("remove marg bottom of last");
			context.currentHover.style["margin"+edges[3]] = "";
			//context.isLast = false;
		}
		else{
			context.currentHover.style["margin"+edges[2]] = "";
		}
		context.oldHover = context.currentHover = false;
	}
};
