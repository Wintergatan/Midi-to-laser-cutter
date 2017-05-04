const fs = require('fs');

function getContent(className, str){
    var regex = new RegExp('\.int-icon-' + className + '[\\s\\S]*?(".*")[\\s\\S]*?}');
    var m;
    if ((m = regex.exec(str)) !== null) {
        return m[1];
    }
    console.log(regex);
}

var fontFile = fs.readFileSync('../interactor-font-icons/fonts/interactor-icons.ttf').toString('base64');
var cssFile = fs.readFileSync('../interactor-font-icons/style.css').toString();
var templateFile = fs.readFileSync('./template.css').toString();

var newFile = templateFile.replace(/FILE/, fontFile);


const classReg = /(\.int-icon-[\s\S]*?})/g;
let m;
let strings = [];
while ((m = classReg.exec(cssFile)) !== null) {
    if (m.index === classReg.lastIndex) {
        classReg.lastIndex++;
    }

    if(m){
        strings.push(m[1]);
    }
}

newFile = newFile.replace(/STYLES/, strings.join('\n'));


//const radioReg = /\.int-icon-radiobox[\s\S]*?(".*")[\s\S]*?}/;

newFile = newFile.replace(/RADIO_CONTENT/, getContent('radiobox', cssFile));
newFile = newFile.replace(/RADIO_CHECKED_CONTENT/, getContent('radiobox-marked', cssFile));
newFile = newFile.replace(/CHECKBOX_CONTENT/, getContent('checkbox-o', cssFile));
newFile = newFile.replace(/CHECKBOX_CHECKED_CONTENT/, getContent('checkbox', cssFile));

fs.writeFileSync('../../interactor-icons.css', newFile);

//console.log(newFile);