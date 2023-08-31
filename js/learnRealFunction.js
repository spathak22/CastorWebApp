const SERVER_ADDRESS = "http://localhost:4567/";
const absolute_path = "/Users/SherLock/Desktop/Books/REsearch/Code/Castor/web-app/CastorWebApp/"
var use_saved_pos_example=false
var use_saved_neg_example=false



function learn() {
	clear();

	// Show spinner
	spinner.spin(spinnerDiv);

	// Get selected modes
	method = $("#modesSelect").val();

	//Get selected query
	query = $("#select_query").val();

	var url = SERVER_ADDRESS+"learn/immortals/"+query+"/"+method+"/sps/"+use_saved_pos_example+"/"+use_saved_neg_example;
    //var url = SERVER_ADDRESS+"learn/immortals/"+query+"/sps";
	console.log(url);

	// Call REST service
	$.getJSON(url, { 
	}).done(function(data) {
		learnAux(data);
	}).fail(function() {
		alert("An error occurred.");
		spinner.stop();
	});

    use_saved_pos_example=false
    use_saved_neg_example=false
}

function learnAux(data) {
    spinner.stop();
	console.log("Returned data : ", data)
	// Store definition locally
    //var definitionId = generateDefinitionIdAutomodeTab();
    //localStorage.setItem(definitionId, JSON.stringify(data.definition));

	// Create an option for each clause in select menu
	//var selectMenu = "#automodeTab-selectMenu";
	if(data.success){
        // var definition = ""
        // for (var i = 0; i < data.definition.length; i++) {
        //     definition += clauseToText(data.definition[i]) + "\n\n";
        //     //var optionId = generateClauseIdAutomodeTab(i);
        //     //$('<option>').val(optionId).text(i+1).appendTo(selectMenu);
        // }
        $("#automodeTabDatalog").val(data.outputSQL.substr(data.outputSQL.indexOf('\n')+1,data.outputSQL.length));
	}

    // Set the number of clauses in definition
    //$("#automodeTab-numberOfClauses").html(data.definition.length);

    //if (data.definition.length > 0)
		//$("#automodeTabDatalog").val(clauseToText(data.definition[0]));

	// Show effectiveness
	$("#automodeEffectiveness-precision").html(formatNumber(data.precision));
	$("#automodeEffectiveness-recall").html(formatNumber(data.recall));
	//$("#automodeEffectiveness-f1").html(formatNumber(data.f1));
	$("#automodeEffectiveness-time").html(formatNumber(data.time));


	$("#autmomodeResultsDiv").show();
}


function saveExamples() {
    clear();

    // Show spinner
    spinner.spin(spinnerDiv);

    var jsonData = {};
    // Get selected modes
    examples = $("#automodeTabExamples").val();
    jsonData["examples"] = examples

    //Get selected file path
    var current_path = document.location.pathname;
    console.log("Index.html path  : ", current_path)

    //Get selected query name
    var selectQueryObject = document.getElementById("select_query")
    var query_name = selectQueryObject.options[selectQueryObject.selectedIndex].value;
    //Get selected example file names
    var examplesType = document.getElementById("examplesSelect")
    var examples_name = examplesType.options[examplesType.selectedIndex].value;
    //Generate path string
    path = absolute_path+"modes/immortals/"+query_name+"/examples/" +"/out"+examples_name+".csv";
    jsonData["filePath"] = path

    //var url = SERVER_ADDRESS+"learn/uwcse/"+method+"/sps";
    var url = SERVER_ADDRESS+"save/files";
    console.log(url);

    //console.log("Json data :: ", JSON.stringify(jsonData))
    if(examples_name=="_all_pos")
        use_saved_pos_example=true
    else if (examples_name=="_all_neg")
        use_saved_neg_example=true

    // Call REST service
    $.ajax({
        method: 'POST',
        data: JSON.stringify(jsonData),
        url: url,
        success: function(data) {
            alert("Data saved");
            spinner.stop();
        }
    });
}