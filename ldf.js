const parent_container = document.querySelector(".vert-drag .task-parent");
parent_container.direction = "hor";
const divs = document.querySelectorAll(".task-container");
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
}

function divTracker(e){
	let task = e.currentTarget;
	task.style.position = "absolute";
	task.style.background = "red";
	//const parent = task.parentElement; 
	const edges = activeParent.sides;
	console.log("parent is",activeParent);
	const elemStyles = window.getComputedStyle(task);
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
	else{
		if(isLast){
			console.log("remove marg bottom of last");
			currentHover.style["margin"+edges[3]] = "";
			//isLast = false;
		}
		else if(currentHover){
			currentHover.style["margin"+edges[2]] = "";
		}
	}

	console.log("old hover: ",oldHover,"current hover: ",currentHover);
	e.currentTarget.addEventListener("mouseup",switchAndDisableDrag);
};

function addTracker(e){
	console.dir(e.currentTarget.getBoundingClientRect());
	e.currentTarget.addEventListener("mousemove",divTracker);
	//e.currentTarget.sides = sides[e.currentTarget.parentElement.direction];
	console.log(activeParent = e.currentTarget.parentElement);
	activeParent = e.currentTarget.parentElement;
};

function switchAndDisableDrag(e){
	//console.log("mousedown now");
	let task = e.currentTarget;
	task.removeEventListener("mousemove",divTracker);
	task.style.position = "static";
	task.style.top = "initial";
	task.style.left = "initial";
	task.style.background = "";
	oldHover = false;
	currentHover = false;
};

function getHoveredElement(centerPoint,side){
	return document.elementFromPoint(centerPoint,side);
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
	let topandbot = ["top","bottom"];
    let hoveredElement;
	const parent = task.parentElement;
    //console.log("parent task is: ",parent);
	let i =0;
	while(i<2){
		task.style.visibility="hidden";
		hoveredElement = getHoveredElement(centerPoint,sides[i]);
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

