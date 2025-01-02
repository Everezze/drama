const divs = document.querySelectorAll(".task-container");
const body = document.querySelector("body");
let oldHover = false;
let currentHover = false;
let lastTask = false;
let isLast = false;

function divTracker(e){
	let task = e.currentTarget;
	const elemStyles = window.getComputedStyle(task);
	let top = parseInt(elemStyles.top,10);
	let left = parseInt(elemStyles.left,10);
	task.style.top = `${top + e.movementY}px`;
	task.style.left = `${left + e.movementX}px`;
	task.style.background = "red";
	task.style.position = "absolute";
	lastTask = task === divs[divs.length-1] ? divs[divs.length-2] : divs[divs.length-1];
	console.log("lastTask is ", lastTask);

	let topSide = task.getBoundingClientRect().top;
	let bottomSide = task.getBoundingClientRect().bottom;
	const containerSizes = body.getBoundingClientRect();
	const centerPoint = containerSizes.left + (containerSizes.width /2);

	let hoveredElement = determineHoveredElement(task,centerPoint,[topSide,bottomSide]);
	console.log("hoel is : ",hoveredElement);

	//else if(hoveredElement !== currentHover ){
	//	oldHover = currentHover;
	//	currentHover = hoveredElement;
	//}
	if(hoveredElement){
		if(!currentHover){
			oldHover = currentHover = hoveredElement;
			if(isLast){
				currentHover.style.marginBottom = "2rem";
			}
			else{
				currentHover.style.marginTop = "2rem";
			}
		}
		else{
			oldHover = currentHover;
			currentHover = hoveredElement;
			if(isLast){
				oldHover.style.marginTop = "";
				currentHover.style.marginBottom = "2rem";
			}
			else{
				oldHover.style.marginBottom = "";
				oldHover.style.marginTop = "";
				currentHover.style.marginTop = "2rem";
			}
		}
	}
	else{
		if(isLast){
			console.log("remove marg bottom of last");
			currentHover.style.marginBottom = "";
			//isLast = false;
		}
		else{
			currentHover.style.marginTop = "";
		}
	}

	console.log("old hover: ",oldHover,"current hover: ",currentHover);
	e.currentTarget.addEventListener("mouseup",switchAndDisableDrag);
};

function addTracker(e){
	console.dir(e.currentTarget.getBoundingClientRect());
	e.currentTarget.addEventListener("mousemove",divTracker);
};

divs.forEach(function(element){
	element.addEventListener("mousedown",addTracker);
	element.addEventListener("selectstart",removeSelection);

});

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

function determineHoveredElement(task,centerPoint,sides){
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
			if(sides[i] <= hoveredElement.getBoundingClientRect()[topandbot[i]]){
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

