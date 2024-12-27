const divs = document.querySelectorAll(".task-container");
const body = document.querySelector("body");
let oldHover = false;
let currentHover = false;

function divTracker(e){
	let task = e.currentTarget;
	task.style.background = "red";
	task.style.position = "absolute";
	const elemStyles = window.getComputedStyle(task);
	let top = parseInt(elemStyles.top,10);
	let left = parseInt(elemStyles.left,10);
	task.style.top = `${top + e.movementY}px`;
	task.style.left = `${left + e.movementX}px`;

	let topSide = task.getBoundingClientRect().top;
	let bottomSide = task.getBoundingClientRect().bottom;
	const containerSizes = body.getBoundingClientRect();
	const centerPoint = containerSizes.left + (containerSizes.width /2);

	let hoveredElement = determineHoveredElement(task,centerPoint,[topSide,bottomSide]);


	if(!hoveredElement && currentHover === divs[divs.length -1]){
		currentHover.style.marginTop = "";
		currentHover.style.marginBottom = "2rem";
	}
	else{
		if(hoveredElement && currentHover){
            console.log("hoveredElement and currHover are true");
            console.log("before swap hoveredEl is : ",hoveredElement,"and currHover is:",currentHover);
            console.log("before swap oldHover is:",oldHover);
            if(hoveredElement !==currentHover){
              oldHover = currentHover;
              currentHover = hoveredElement;
            }
			
		}
		else if(hoveredElement && !currentHover){
			oldHover = currentHover = hoveredElement;
		}
        console.log("oldhover is: ",oldHover,"currhover is: ",currentHover);
		oldHover.style.marginTop = "";
		currentHover.style.marginTop = "2rem";
	}

	console.log("old hover: ",oldHover,"current hover: ",currentHover);
	e.currentTarget.addEventListener("mouseup",removeTracker);
};

function addTracker(e){
	console.dir(e.currentTarget.getBoundingClientRect());
	e.currentTarget.addEventListener("mousemove",divTracker);
};

divs.forEach(function(element){
	element.addEventListener("mousedown",addTracker);
	element.addEventListener("selectstart",removeSelection);

});

function removeTracker(e){
	//console.log("mousedown now");
	let task = e.currentTarget;
	task.removeEventListener("mousemove",divTracker);
	task.style.position = "static";
	task.style.top = "initial";
	task.style.left = "initial";
	task.style.background = "";
};

function getHoveredElement(centerPoint,side){
	return document.elementFromPoint(centerPoint,side);
}

function removeSelection(e){
	e.preventDefault();
}

function determineHoveredElement(task,centerPoint,sides){
    console.log("sides are: ",sides);
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
			if(parent.contains(hoveredElement) && hoveredElement!==parent){
				hoveredElement = hoveredElement.closest("task-container");
                break;
				//return hoveredElement;
			}
            if(currentHover){
              console.log("entered here");
              return currentHover;
            }
		}
		i++;
	}
    console.log("hovered element is: ",hoveredElement);
	return hoveredElement ? hoveredElement : false;
}

