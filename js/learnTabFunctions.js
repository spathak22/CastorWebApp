$( document ).ready(function() {
	loadUWCSEDataset();
});

var learnButtonElement = document.getElementById('automodeLearnButton');
learnButtonElement.onclick = learn;

var clearButtonElement = document.getElementById('automodeClearButton');
clearButtonElement.onclick = clear;

var opts = {
  lines: 13 // The number of lines to draw
, length: 35 // The length of each line
, width: 14 // The line thickness
, radius: 42 // The radius of the inner circle
, scale: 1 // Scales overall size of the spinner
, corners: 1 // Corner roundness (0..1)
, color: '#000' // #rgb or #rrggbb or array of colors
, opacity: 0.25 // Opacity of the lines
, rotate: 0 // The rotation offset
, direction: 1 // 1: clockwise, -1: counterclockwise
, speed: 1 // Rounds per second
, trail: 60 // Afterglow percentage
, fps: 20 // Frames per second when using setTimeout() as a fallback for CSS
, zIndex: 2e9 // The z-index (defaults to 2000000000)
, className: 'spinner' // The CSS class to assign to the spinner
, top: '50%' // Top position relative to parent
, left: '50%' // Left position relative to parent
, shadow: false // Whether to render a shadow
, hwaccel: false // Whether to use hardware acceleration
, position: 'absolute' // Element positioning
}
var spinnerDiv = document.getElementById('spinnerDiv');
var spinner = new Spinner(opts);


function loadUWCSEDataset() {
	// Hide results
	$("#autmomodeResultsDiv").hide();

	// Hide hypothesis language
	$("#hypothesisLanguageDiv").hide();

    // Hide Training examples
    $("#trainingExamplesDiv").hide();

	// Load modes for baseline
	//var selectMenu = document.getElementById("automodeTab-selectMenu");
	//loadModes("#automodeTabModes", "modes/"+selectMenu.value+".json");
	//loadModes("#automodeTabModes", "modes/manual.json");
    loadQueryDescription("#query_description", "modes/immortals/query1/description.json");
    loadExpectedQuery("#expected_query", "modes/immortals/query1/description.json");

}

function clear() {
	$("#autmomodeResultsDiv").hide();

	//var selectMenu = document.getElementById("automodeTab-selectMenu");
    //clearSelectOptions(selectMenu);
}

function clearSelectOptions(selectMenu) {
	for(var i = selectMenu.options.length - 1 ; i >= 0 ; i--) {
		selectMenu.remove(i);
    }
}

function generateDefinitionIdAutomodeTab() {
	return "automodeTab-definition";
}

function generateClauseIdAutomodeTab(clauseNumber) {
	return generateDefinitionIdAutomodeTab()+"-clause"+clauseNumber;
}

function formatNumber(number) {
	return Math.round(number * 100) / 100
}

function selecExamplesChangedAutomodeTab() {
    console.log("Changed examples drop down")
    //Reset the text area and disable save button
    //$("#automodeTabModes").val('')
    $("#automodeSaveButton").attr("disabled", true)

    var selectQueryObject = document.getElementById("select_query")
    var query_name = selectQueryObject.options[selectQueryObject.selectedIndex].value;

    var examplesType = document.getElementById("examplesSelect")
	var examples_name = examplesType.options[examplesType.selectedIndex].value;

    path = "./modes/immortals/"+query_name+"/examples/" +query_name+ examples_name+".csv";
    loadText("#automodeTabExamples", path);
}

function selectModesChangedAutomodeTab() {
    console.log("Changed examples drop down")
    //Reset the text area and disable save button
    //$("#automodeTabModes").val('')
    //$("#automodeSaveButton").attr("disabled", true)

    var selectQueryObject = document.getElementById("select_query")
    var query_name = selectQueryObject.options[selectQueryObject.selectedIndex].value;

    var examplesType = document.getElementById("modesSelect")
    var examples_name = examplesType.options[examplesType.selectedIndex].value;

    path = "./modes/immortals/"+query_name+"/castor-input/"+examples_name+"/datamodel.json";
    loadModes("#automodeTabModes", path);
}


function selectQuery(selectMenu) {
    path = "modes/immortals/" + selectMenu.value + "/description.json";
    loadQueryDescription("#query_description", path);
    loadExpectedQuery("#expected_query", path);
    selectModesChangedAutomodeTab()
    selecExamplesChangedAutomodeTab()
}


function loadModes(elementId, path) {
	$.getJSON(path, function(json) {
	    var allModes = json.headMode + "\n";

	    for (var i = 0; i < json.bodyModes.length; i++) {
	    	allModes += json.bodyModes[i] + "\n";
	    }

	    $(elementId).text(allModes);
	});
}

function loadText(elementId, file){
    console.log("load Text --> ", file)


    $.get(file, function(data) {
        //var lines = data.split("\n");
        // var allLines = []
        // for (var i = 0; i < lines.length; i++) {
        //     allLines += lines[i] + "\n";
        // }
        $(elementId).val(data);
    });
}



function loadQueryDescription(elementId, path) {
    $.getJSON(path, function(json) {
        var allModes = "Description: " + json.Description + "\n"
        $(elementId).text(allModes);
    });
}

function loadExpectedQuery(elementId, path) {
    $.getJSON(path, function(json) {
        var allModes = "ExpectedQuery: " + json.ExpectedQuery + "\n"
        $(elementId).text(allModes);
    });
}


/*function selectClauseChangedAutomodeTab(selectMenu) {
	var value = selectMenu.value;

	// Must match id generate in generateClauseId
	var regex = /automodeTab-definition-clause(\d+)/g;
	var match = regex.exec(value);

	var clauseNumber = match[1];
	var definitionId = generateDefinitionIdAutomodeTab();

	// Parse definition to JSON
	var definitionJson = JSON.parse(localStorage.getItem(definitionId));
	$("#automodeTabDatalog").val(clauseToText(definitionJson[clauseNumber]));
}*/

function clauseToText(json) {
	var clause = json.head + " :- \n\t" + json.body + ".";;
	return clause;
}

function trainingExamplesCheckboxClick(cb) {
	console.log(" Checkbox event -- > ")

	if (cb.checked) {
		// show
        $("#trainingExamplesDiv").show();
        var selectQueryObject = document.getElementById("select_query")
        var query_name = selectQueryObject.options[selectQueryObject.selectedIndex].value;
        path = "./modes/immortals/"+query_name+"/examples/" +query_name+ "_all_pos.csv";
        loadText("#automodeTabExamples", path);
	} else {
		// hide
		$("#trainingExamplesDiv").hide();

		// Set default modes
		$("#examplesSelect").val("_all_pos");

        var selectQueryObject = document.getElementById("select_query")
        var query_name = selectQueryObject.options[selectQueryObject.selectedIndex].value;
        path = "./modes/immortals/"+query_name+"/examples/" +query_name+ "_all_pos.csv";
        loadText("#automodeTabExamples", path);
	}
}


function hypothesisLanguageCheckboxClick(cb) {
    console.log(" Checkbox event -- > ")

    if (cb.checked) {
        // show
        $("#hypothesisLanguageDiv").show();
        var selectQueryObject = document.getElementById("select_query")
        var query_name = selectQueryObject.options[selectQueryObject.selectedIndex].value;
        path = "./modes/immortals/"+query_name+"/castor-input/manualtuned/datamodel.json";
        loadModes("#automodeTabModes", path);
    } else {
        // hide
        $("#hypothesisLanguageDiv").hide();

        // Set default modes
        $("#modesSelect").val("manualtuned");

        var selectQueryObject = document.getElementById("select_query")
        var query_name = selectQueryObject.options[selectQueryObject.selectedIndex].value;
        path = "./modes/immortals/"+query_name+"/castor-input/manualtuned/datamodel.json";
        loadModes("#automodeTabModes", path);
    }
}



function enableSaveButton(){
    console.log("Enabling save button ")
    document.getElementById("automodeSaveButton").disabled = false;
    $("#automodeSaveButton").removeAttr("disabled")
    //$("input[type=automodeSaveButton]").removeAttr("disabled");
}


function saveToFile(){
    console.log(" Saving to file -- > ")
    var txt = document.getElementById("automodeTabModes").value;
    writeToFile(path, txt)

}


$('input[type=textarea]').bind('input propertychange', function() {
    console.log(this.value);
});


function writeToFile(file, text) {
    try {
        var fso, s;
        fso = new ActiveXObject("Scripting.FileSystemObject");
        s = fso.OpenTextFile("ietm_data.txt", 8, 1, -2);
        s.writeline("name, email, location, comments, data, type");
        s.Close();
    }
    catch (err) {
        var strErr = 'Error:';
        strErr += '\nNumber:' + err.number;
        strErr += '\nDescription:' + err.description;
        document.write(strErr);
    }
}
