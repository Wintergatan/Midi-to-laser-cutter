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

function generateModel(midiData, holeWidth, holeLength) {	
	var notesAgainstTime = processData(midiData);			
	var punchHoles = [];
	var model = { models: {}};
	for (var i=0; i<notesAgainstTime.length; i++) {
		var note = notesAgainstTime[i];
		var oval = new makerjs.models.Oval(holeLength,holeWidth);
		oval.units = makerjs.unitType.Millimeter;
		oval.origin = [note.x-(holeLength-(holeWidth/2)), note.y-(holeWidth/2)];
		punchHoles.push(oval);
	}
	model.models = punchHoles;
	return model;
}

function prepareFiles(midiData) {
	var model = generateModel(midiData, 1.5, 2);
	svgFile = null;
	dxfFile = null;

	fileTexts["svg"] = makerjs.exporter.toSVG(model, {units: makerjs.unitType.Millimeter, useSvgPathOnly: false});
	fileTexts["dxf"] = makerjs.exporter.toDXF(model);	
}
