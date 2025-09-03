function Drama(container,
	{direction="vert",hint=[],color=null,transition=null,spacing="2rem"} = {}){
	container = document.querySelector(container);
	if(!container){
		return null;
	}
	const newId = ++Drama.prototype.lastId;
	container.addEventListener("mousedown",setupDrag,{capture:true});
	container.dataset.dragId = newId;
	container.style.position = "relative";
	this.dragger = container;
	this.draggins = container.children;
	this.adjustment = false;
	this.direction = "vert";
	this.sides = sides["vert"];
	this.spacing = spacing;
	let tasks = Array.from(container.children);
	tasks.forEach(function(element){
	element.addEventListener("mousedown", addTracker);
	element.addEventListener("selectstart",removeSelection);
		if(transition){
			element.style.transition = transition;
		};
	});

	if(direction == "hor"){
		this.adjustment = true;
		this.direction = "hor";
		this.sides = sides["hor"];
	};

	switch(hint.length){
		case 1:
			this.dropColor = [hint[0]];
			break;
		case 2:
			this.dropColor = [hint[0],hint[1]];
			break;
		default:
			console.log("wrong number of arguments");
			this.dropColor = [];
	};

	if(color){
		this.dragColor = color;
	}
	else{
		this.dragColor = defaultBackgroundColor;
	};

	Drama.prototype.contexts[newId] = this;
};

const sides = {
	"hor": ["left","right","Left","Right","height"],
	"vert": ["top","bottom","Top","Bottom","width"]
};

const defaultBackgroundColor = "hsl(0,0%,70%)";

Drama.prototype.currentHover = null;
Drama.prototype.oldHover = null;
Drama.prototype.lastTask = null;
Drama.prototype.isLast = null;
Drama.prototype.contexts = {};
Drama.prototype.lastId = 0;
Drama.prototype.firstDrag = true;

function divTracker(e){
	const task = e.currentTarget;
	const contextId = task.closest("[data-drag-id]").dataset.dragId;
	const context = Drama.prototype.contexts[contextId];
	const dragData = Drama.prototype;
	//if(!activeHint){
	//	activeHint = true;
	//};
	//const type = themesData[currentList.dataset.type];
	//const elemStyles = window.getComputedStyle(task);
	if(context.firstDrag){
		let tempElement = task;
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
		task.style.position = "absolute";
		task.style.backgroundColor = context.dragColor;
		//task.style.setProperty("--bg-light","80%");
		context.firstDrag = false;
	}
	//console.log("result of top with movement is: ",`${draggingContext['taskFirstSide'] + e.movementY}px`);
	console.log("last taskTop : ",context.taskTop,"\nafter movement value of tasktop is ",context["taskTop"] + e.movementY);
	task.style.top = `${context["taskTop"] + e.movementY}px`;
	task.style.left = `${context["taskLeft"] + e.movementX}px`;
	context["taskTop"] += e.movementY;
	context["taskLeft"] += e.movementX;
	if(context.direction == "vert"){
		context["firstSide"] += e.movementY;
		context["secondSide"] += e.movementY;
	}else{
		context["firstSide"] += e.movementX;
		context["secondSide"] += e.movementX;
	}

	const hoveredElement = determineHoveredElement(task,context);
	updateHint(hoveredElement,context);
};

function addTracker(e){
	const el = e.currentTarget;
	const container = el.closest("[data-drag-id]");
	const context = Drama.prototype.contexts[container.dataset.dragId];
	//console.dir(el.getBoundingClientRect());
	el.addEventListener("mousemove",divTracker);
	el.addEventListener("mouseup",switchAndDisableDrag);
	const draggins = container.children;
	Drama.prototype.lastTask = el === draggins[draggins.length-1] ?
		draggins[draggins.length-2] :
		draggins[draggins.length-1];

	const elementRectangle = el.getBoundingClientRect();
	const elementStyles = window.getComputedStyle(el);
	context["firstSide"] = parseInt(elementRectangle[context.sides[0]],10);
	context["secondSide"] = parseInt(elementRectangle[context.sides[1]],10);
	context["taskTop"] = el.offsetTop;
	context["taskLeft"] = el.offsetLeft;
};

function switchAndDisableDrag(e){
	let task = e.currentTarget;
	const dragId = task.closest("[data-drag-id]").dataset.dragId;
	const context = Drama.prototype.contexts[dragId];
	const activeParent = context.dragger;
	console.log("mouseup now","currhov: ",context.currentHover);
	task.style.backgroundColor = "";
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
		task.animate([{background:context.dropColor[1]},{background:""}],500);
		//task.style.animation = "valid_insert .5s ease-out";
		//context.oldHover = context.currentHover = false;
	}
	else{
		setTimeout( () => {
			//task.style.animation = "invalid_insert .5s ease-out";
			task.animate([{background:context.dropColor[0]},{background:""}],500);
		},1);
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
	const dragProto = Drama.prototype;
	const dragId = el.dataset.dragId;
	const context = dragProto.contexts[dragId];
	console.log("id of container is: ",el.dataset.dragId);
	const elDimensions = el.getBoundingClientRect();
	const sideToGetCenterPoint = context.direction == "vert" ?
		"left":"top";
	context.centerPoint = elDimensions[sideToGetCenterPoint] + (elDimensions[context.sides[context.sides.length-1]] /2);
}

function updateHint(hoveredElement,context){
	const edges = context.sides;
	if(hoveredElement){
		console.log("hoveredEl is: ",hoveredElement);
		if(!context.currentHover){
			context.oldHover = context.currentHover = hoveredElement;
			if(context.isLast){
				context.currentHover.style["margin"+edges[3]] = context.spacing;
			}
			else{
				context.currentHover.style["margin"+edges[2]] = context.spacing;
			}
		}
		else{
			context.oldHover = context.currentHover;
			context.currentHover = hoveredElement;
			if(context.isLast){
				context.oldHover.style["margin"+edges[2]] = "";
				context.currentHover.style["margin"+edges[3]] = context.spacing;
			}
			else{
				context.oldHover.style["margin"+edges[3]] = "";
				context.oldHover.style["margin"+edges[2]] = "";
				context.currentHover.style["margin"+edges[2]] = context.spacing;
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
