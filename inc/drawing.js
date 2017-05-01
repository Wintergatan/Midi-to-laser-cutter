var fileTexts = {
	"svg": null,
	"dxf": null
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

function generateModel(midiData, holeWidth, holeLength, horizontalMargin, verticalMargin) {	
	var notesAgainstTime = processData(midiData);			
	var punchHoles = [];
	var model = { models: {}};
	var biggestY = 0;
	var biggestX = 0;
	var rectX = 0;
	var rectY = 0;
	
	for (var i=0; i<notesAgainstTime.length; i++) {
		var note = notesAgainstTime[i];
		var oval = new makerjs.models.Oval(holeLength,holeWidth);
		oval.units = makerjs.unitType.Millimeter;
		oval.origin = [(note.x-(holeLength-(holeWidth/2)))+(horizontalMargin*1 + holeLength/2), (note.y-(holeWidth/2))+(verticalMargin*1 + holeWidth/2)];
		punchHoles.push(oval);
		
		if (oval.origin[0] > biggestX) {
			biggestX = oval.origin[0];
		}
		
		if (oval.origin[1] > biggestY) {
			biggestY = oval.origin[1];
		}
	}
	rectX = (biggestX + horizontalMargin*1 + 2*holeLength/2);
	rectY = (document.getElementById("strip-height").value);
	
	console.log(biggestX + ", " + biggestY);
	console.log(holeLength + ", " + holeWidth);
	console.log(rectX + ", " + rectY);
	
	var rectangle = new makerjs.models.Rectangle(rectX, rectY*1);
	rectangle.units = makerjs.unitType.Millimeter;
	
	punchHoles.push(rectangle);
	model.models = punchHoles;
	return model;
}

function prepareFiles(midiData) {
	var model = generateModel(midiData, document.getElementById("hole-height").value, document.getElementById("hole-width").value, document.getElementById("horizontal-margins").value, document.getElementById("vertical-margins").value);
	
	fileTexts["svg"] = makerjs.exporter.toSVG(model, {units: makerjs.unitType.Millimeter, useSvgPathOnly: false});
	fileTexts["dxf"] = makerjs.exporter.toDXF(model);	
	document.getElementById("preview-box").innerHTML = fileTexts["svg"];
}
