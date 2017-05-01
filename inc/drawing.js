var fileTexts = {
	"svg": null,
	"dxf": null,
	"txt": null
};

function downloadFile(fileName, fileText) {
	var dataType = "text/plain";
	console.log(fileName);
	if(fileName.includes("svg")) dataText="image/svg";

	var element = document.createElement('a');
	element.setAttribute('href', "data:" + dataType + ";charset=utf-8," + encodeURIComponent(fileText));
	element.setAttribute('download', fileName);
	
	element.style.display = 'none';
	document.body.appendChild(element);

	element.click();

	document.body.removeChild(element);
}

function generateModel(midiData, holeWidth, holeHeight, horizontalMargin, verticalMargin, stripHeight, units) {	
	var notesAgainstTime = processData(midiData);			
	var punchHoles = [];
	var origins = "";
	var model = { models: {}};
	var biggestY = 0;
	var biggestX = 0;
	var rectX = 0;
	var rectY = 0;
	
	
	if (document.getElementById("hole-shape").value == "Square"){
		for (var i=0; i<notesAgainstTime.length; i++) {
			var note = notesAgainstTime[i];
			var rectangle = new makerjs.models.Rectangle(holeWidth,holeHeight);
			rectangle.units = units;
			rectangle.origin = [(note.x-(holeWidth-(holeHeight/2)))+(horizontalMargin + holeWidth/2), (note.y-(holeHeight/2))+(verticalMargin + holeHeight/2)];
			punchHoles.push(rectangle);
			origins = origins + rectangle.origin[0] + "," + rectangle.origin[1] + "\n";
			
			if (rectangle.origin[0] > biggestX) {
				biggestX = rectangle.origin[0];
			}
			
			if (rectangle.origin[1] > biggestY) {
				biggestY = rectangle.origin[1];
			}
		}
	} else {
		for (var i=0; i<notesAgainstTime.length; i++) {
			var note = notesAgainstTime[i];
			var oval = new makerjs.models.Oval(holeWidth,holeHeight);
			oval.units = units;
			oval.origin = [(note.x-(holeWidth-(holeHeight/2)))+(horizontalMargin + holeWidth/2), (note.y-(holeHeight/2))+(verticalMargin + holeHeight/2)];
			punchHoles.push(oval);
			origins = origins + oval.origin[0] + "," + oval.origin[1] + "\n";
			
			if (oval.origin[0] > biggestX) {
				biggestX = oval.origin[0];
			}
			
			if (oval.origin[1] > biggestY) {
				biggestY = oval.origin[1];
			}
		}
	}
	rectX = (biggestX + horizontalMargin + holeWidth);
	rectY = stripHeight;
	
	var rectangle = new makerjs.models.Rectangle(rectX, rectY);
	rectangle.units = units;
	
	punchHoles.push(rectangle);
	model.models = punchHoles;
	return [model, origins];
}

function prepareFiles(midiData) {
	var units = makerjs.unitType.Millimeter;
	if (document.getElementById("units").value == "Inches"){
		units = makerjs.unitType.Inch;
	}
	var holeWidth = parseFloat(document.getElementById("hole-width").value);
	var holeHeight = parseFloat(document.getElementById("hole-height").value);
	var hMargin = parseFloat(document.getElementById("horizontal-margins").value);
	var vMargin = parseFloat(document.getElementById("vertical-margins").value);
	var stripHeight = parseFloat(document.getElementById("strip-height").value);
	
	var returnArray = generateModel(midiData, holeWidth, holeHeight, hMargin, vMargin, stripHeight, units);
	var model = returnArray[0];
	var origins = returnArray[1];
	
	fileTexts["svg"] = makerjs.exporter.toSVG(model, {units: units, useSvgPathOnly: false});
	fileTexts["dxf"] = makerjs.exporter.toDXF(model, {units : units});
	fileTexts["txt"] = origins;
	document.getElementById("preview-box").innerHTML = fileTexts["svg"];
}
