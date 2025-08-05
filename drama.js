const parent_container = document.querySelector(".vert-drag .task-parent");

//parent_container.direction = "hor";
let currentTask = false;
let divs;
const body = document.querySelector("body");
let oldHover = false;
let currentHover = false;
let lastTask = false;
let isLast = false;
let activeParent = false;
//const direction = false;
const sides = {
	"hor": ["left","right","Left","Right","height"],
	"vert": ["top","bottom","Top","Bottom","width"]
};

parent_container.enableDrag = registerDrag;
parent_container.enableDrag("vert");

const horizontalParent = document.querySelector(".hor-drag .task-parent");
horizontalParent.enableDrag = registerDrag;
horizontalParent.enableDrag("hor");

//divs.forEach(function(element){
//	element.addEventListener("mousedown",addTracker);
//	element.addEventListener("selectstart",removeSelection);
//});

function registerDrag(direction){
	console.log(this.children);
	let tasks = Array.from(this.children);
	tasks.forEach(function(element){
	element.addEventListener("mousedown", addTracker);
	element.addEventListener("selectstart",removeSelection);
	});
	this.sides = sides[direction];
	this.sideToGetCenterPoint = direction == "hor" ? "top":"left";
	this.direction = direction;
}

function divTracker(e){
	let task = e.currentTarget;
	const elemStyles = window.getComputedStyle(task);
	if(activeParent.direction == "hor"){
		//task.style.width = elemStyles["width"]; 
		if(activeParent.needAdjustment){
			console.log("old left =>",task.getBoundingClientRect()["left"]);
			let oldWidth = task.getBoundingClientRect()["width"];
			let oldLeft = task.getBoundingClientRect()["left"];
			task.style.position = "absolute";
			task.style.background = "red";
			task.style.left = `${oldLeft - activeParent.getBoundingClientRect().left}px`;
			task.style.width = `${oldWidth}px`;
			activeParent.needAdjustment = false;
		}
	}
	else{
		task.style.width = "100%";
		task.style.position = "absolute";
		task.style.background = "red";
	}
	//task.style["width"] = "300px";
	console.log("width of task is: ",task.style["width"]);
	//const parent = task.parentElement; 
	const edges = activeParent.sides;
	console.log("edges are : ",edges);
	console.log("parent is",activeParent);
	let taskFirstSide = parseInt(elemStyles["top"],10);
	let taskSecondSide = parseInt(elemStyles["left"],10);
	task.style.top = `${taskFirstSide + e.movementY}px`;
	task.style.left = `${taskSecondSide + e.movementX}px`;
	lastTask = task === divs[divs.length-1] ? divs[divs.length-2] : divs[divs.length-1];
	console.log("lastTask is ", lastTask);

	const containerSizes = activeParent.getBoundingClientRect();
	const centerPoint = containerSizes[activeParent.sideToGetCenterPoint] + (containerSizes[edges[edges.length-1]] /2);
	console.log("center point value is : ",centerPoint);

	let hoveredElement = determineHoveredElement(task,centerPoint,edges);
	console.log("hoel is : ",hoveredElement);

	//else if(hoveredElement !== currentHover ){
	//	oldHover = currentHover;
	//	currentHover = hoveredElement;
	//}
	if(hoveredElement){
		if(!currentHover){
			oldHover = currentHover = hoveredElement;
			if(isLast){
				currentHover.style["margin"+edges[3]] = "2rem";
			}
			else{
				currentHover.style["margin"+edges[2]] = "2rem";
			}
		}
		else{
			oldHover = currentHover;
			currentHover = hoveredElement;
			if(isLast){
				oldHover.style["margin"+edges[2]] = "";
				currentHover.style["margin"+edges[3]] = "2rem";
			}
			else{
				oldHover.style["margin"+edges[3]] = "";
				oldHover.style["margin"+edges[2]] = "";
				currentHover.style["margin"+edges[2]] = "2rem";
			}
		}
	}
	else if(currentHover){
		if(isLast){
			console.log("remove marg bottom of last");
			currentHover.style["margin"+edges[3]] = "";
			//isLast = false;
		}
		else{
			currentHover.style["margin"+edges[2]] = "";
		}
		oldHover = currentHover = false;
	}

	console.log("old hover: ",oldHover,"current hover: ",currentHover);
};

function addTracker(e){
	let el = e.currentTarget;
	console.dir(el.getBoundingClientRect());
	el.addEventListener("mousemove",divTracker);
	el.addEventListener("mouseup",switchAndDisableDrag);
	//e.currentTarget.sides = sides[e.currentTarget.parentElement.direction];
	console.log(activeParent = el.parentElement);
	activeParent = el.parentElement;
	divs = activeParent.children;
	if(window.getComputedStyle(activeParent)["display"] == "flex"){
		activeParent.needAdjustment = true;
	}
};

function switchAndDisableDrag(e){
	console.log("mouseup now","currhov: ",currentHover);
	let task = e.currentTarget;
	currentTask = task;
	task.style.animation = "none";
	console.log("removing animation value is: ",task.style.animation);
	task.removeEventListener("mousemove",divTracker);
	task.style.position = "static";
	task.style.top = "initial";
	task.style.left = "initial";
	task.style.width = "";
	task.style.background = "";
	//task.style.background = "";
	if(currentHover){
		if(isLast){
			activeParent.insertBefore(task,null);
			currentHover.style["margin"+activeParent.sides[3]] = "";
		}
		else{
			activeParent.insertBefore(task,currentHover);
			currentHover.style["margin"+activeParent.sides[2]] = "";
		}
		task.style.animation = "valid_insert .5s ease-out";
		oldHover = currentHover = false;
	}
	else{
		setTimeout( () => {currentTask.style.animation = "invalid_insert .5s ease-out";},1);
		//task.style.animation = "invalid_insert .5s ease-out";
	}
	//currentHover.style[];
	//oldHover = false;
	//currentHover = false;
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

function determineHoveredElement(task,centerPoint,edges){
	const sides = [
		task.getBoundingClientRect()[edges[0]],
		task.getBoundingClientRect()[edges[1]]
	];
    console.log("sides are: ",sides);
	//let topandbot = ["top","bottom"];
    let hoveredElement;
	const parent = task.parentElement;
    //console.log("parent task is: ",parent);
	let i =0;
	while(i<2){
		task.style.visibility="hidden";
		hoveredElement = getHoveredElement(centerPoint,sides[i],parent.direction);
		task.style.visibility="initial";
        console.log("with i =",i, " temp element is: ",hoveredElement);
		if(!hoveredElement.classList.contains("task-container")){
			if(parent.contains(hoveredElement) ){
				if(hoveredElement!==parent){
					hoveredElement = hoveredElement.closest("task-container");
					//break;
					return hoveredElement;
				}
				else{
					if(currentHover){
						return currentHover;
					}
				}
			}
			//else if(currentHover && hoveredElement === parent){
			//	return currentHover;
			//}
			//add condition where parent border is the hovered element;
		}
		else{
			console.log("entered thats is a task");
			if(sides[i] <= hoveredElement.getBoundingClientRect()[edges[i]]){
				if(isLast){
					isLast = false;
				}
				console.log("distance is less, so higher");
				return hoveredElement;
			}
			else if(hoveredElement === lastTask){
				console.log("setting last to true");
				isLast = true;
				return hoveredElement;
			}
		}
		i++;
	}
    //console.log("hovered element is: ",hoveredElement);
	return false;
}

