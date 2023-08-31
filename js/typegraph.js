"use strict";

var layout = {
    name: 'preset'
};
var  style = [{
        selector: 'node',
        style: {
            'content': 'data(label)',
            'font-size': 'data(font)',
        }
    },
    {
        selector: 'edge',
        style: {
            'line-color' : 'data(color)',
            'width':'4px'
        }
    }
];

$(document).ready(function() {
    loadAutomodeExact();
});

function createGraphStructure(graphElements, graphEdges){
    var cy = cytoscape({
        container: document.getElementById('typegraph'),
        elements : {
            nodes:graphElements,
            edges:graphEdges
        },
        layout: layout,
        style:style
    });


    cy.$('node').on('mouseover', 'node', function (e) {
        var ele = e.target;

        var st = ele.connectedEdges().style('line-color')

        //Highlight nodes
        var connectedNodes = ele.neighborhood()
        for(var i = 0; i< connectedNodes.length; i++){
            //connectedNodes[i].style({'background-color':'#0066cc'})
            connectedNodes[i].style({'background-color':st})
        }
        ele.style({'background-color':st})

        //Highlight edges
        ele.connectedEdges().style({ 'width': '8px' });
    });

    cy.$('node').on('mouseout', 'node', function (e) {
        var ele = e.target;
        ele.connectedEdges().style({ 'width': '4px' });

        ele.style({'background-color':'grey'})

        var connectedNodes = ele.neighborhood()
        for(var i = 0; i< connectedNodes.length; i++){
            connectedNodes[i].style({'background-color':'grey'})
        }

    });

    $('a[data-toggle="tab"]').on('shown.bs.tab', function (e) {
          var target = $(e.target).attr("href") // activated tab
          if (target == "#typegraphTab") {
            //cy.resize(); 
            /*cy.layout({
                name: 'cose'
            });*/
            loadAutomodeExact();
          }
        });
}

function Node(label,id, parent, x, y){
    this.data = {
    };
    this.position = {
    };
    this.data.id = id;
    this.data.label = label;
    this.data.parent = parent;
    this.position.x = x;
    this.position.y = y;
    this.data.font = '18px';
}

function ParentNode(id, x, y){
    this.data = {
    };
    this.position = {
    };
    this.data.id = id;
    this.data.label = id;
    this.position.x = x;
    this.position.y = y;
    this.data.font = '22px';
}

function Edge (id,source,target,color) {
    this.data = {};
    this.data.id = id;
    this.data.source = source;
    this.data.target  = target;
    this.data.color  = color;
};



function addGraphNodes(schemaData, graphElements) {
    var x = 100;
    var y = 100;
    var r = 330;
    var headMode = 'advisedby';
    var degree = 0;
    var degreeIncr = 10;
    var offset = 200;
    var last_x = 1;
    var last_y = 1;
    var head_x = 200;
    var head_y = 200 ;


    for(var i=0; i < schemaData.relations.length; i++){
        degree = degree + degreeIncr;
        x = r * Math.cos(degree) + offset;
        var relationName = schemaData.relations[i].name;
        for(var j=0; j < schemaData.relations[i].attributes.length; j++){
            if(schemaData.relations[i].name == headMode){
                x = head_x +90;
                head_x = x;
                y = head_y;
            }else{
            x = last_x+90;
            last_x = x;
            }
            var node = new Node(schemaData.relations[i].attributes[j],relationName+"."+schemaData.relations[i].attributes[j], schemaData.relations[i].name, x, y);
            graphElements.push(node);
        }
        if(schemaData.relations[i].name == headMode){
            x = head_x;
            y = head_y;
            var parNode = new ParentNode(schemaData.relations[i].name, x, y);
            x = last_x;
            y = last_y;

        } else {
            degree = degree + degreeIncr;
            x = r * Math.cos(degree) + offset;
            y = r * Math.sin(degree) + offset;
            last_x = x;
            last_y = y;
            var parNode = new ParentNode(schemaData.relations[i].name, x, y);
        }
        graphElements.push(parNode);
    }
}

function addGraphEdges(modesData, schemaData, graphEdges) {
    //Get headMode
    graphEdges.length=0;
    var str = modesData.headMode;
    //Get advisedby string
    var headModeString = str.split("(");
    //Now split on comma to get each token T5,T6
    var relation_attr = headModeString[1].split(",");

    var nodeMap = new Object();
    var nodeKeys = []
    var schemaMap = {}

    //Map of index and relation in schema
    for(var l=0; l < schemaData.relations.length; l++) {
        schemaMap[schemaData.relations[l].name] = l
    }

    //Add HeadMode to Data structure
    createEdgeDataStructure(nodeMap,headModeString[0],relation_attr,schemaMap,nodeKeys, schemaData)

    //Add BodyModes to Data structure
    for(var j=0; j < modesData.bodyModes.length; j++) {
            var modeString = modesData.bodyModes[j];
            var relation = modeString.split("(");
            var attributes = relation[1].split(",");

        createEdgeDataStructure(nodeMap, relation[0], attributes, schemaMap,nodeKeys, schemaData)
    }

    var color = ['#d22d2d','#0080ff','#ffbf00','#40ff00','#0080ff']
    var colorIndex = 0
    //Finally create edge mappings
    for(var i=0; i < nodeKeys.length; i++){
        var key = nodeKeys[i]
        var nodes = nodeMap[key]
        if(nodes.length > 1){
            var colorVal = color[colorIndex]
            colorIndex++
            for(var m=0; m < nodes.length; m++) {
                for(var n=0; n < nodes.length; n++) {
                    if(m!=n && nodes[m]!= nodes[n]) {
                        var edge1 = new Edge(nodes[m] + "-" + nodes[n], nodes[m], nodes[n], colorVal);
                        graphEdges.push(edge1);
                    }
                }
            }
        }
    }
};


function createEdgeDataStructure(nodeMap,relation,attributes,schemaMap,nodeKeys,schemaData){
    var key;
    for(var i = 0; i<attributes.length; i++){
        var value = [];
        if(i==(attributes.length - 1)){
            key = attributes[i].substr(0,attributes[i].length-1);
        }else{
            key = attributes[i];
        }

        if(key[0] == '+'){
            var index = schemaMap[relation]
            var attrName = schemaData.relations[index].attributes[i]
            var val = relation+'.'+attrName;

            if (!(key in nodeMap)){
                nodeKeys.push(key)
                value.push(val)
                nodeMap[key] = value
            }else{
                value = nodeMap[key]
                if($.inArray(val,value) == -1){
                    value.push(val)
                }
            }
        }
    }
}

function prepareGraph(modesData, schemaData){
    var graphEdges = [];
    var graphElements = [];

    addGraphNodes(schemaData, graphElements);
    addGraphEdges(modesData, schemaData, graphEdges);
    createGraphStructure(graphElements, graphEdges);
};


function loadBaseline() {
    $.getJSON('modes/baseline.json', function (modesData) {
        //console.log(data);

        $.getJSON('schemas/schema-uwcse.json', function (schemaData) {
            //console.log(data);
            
            prepareGraph(modesData, schemaData);
        })
    })
};

function loadAutomodeExact() {
    $("#autoModeOption").prop("checked", true);
    if(!document.getElementById('automodeApproxOption').checked){
        $.getJSON('modes/automode-exact.json', function (modesData) {
            //console.log(data);

            $.getJSON('schemas/schema-uwcse.json', function (schemaData) {
                //console.log(data);
                
                prepareGraph(modesData, schemaData);
            })
        })
    }else{
        loadAutomodeApprox();
    }
};

function loadAutomodeApprox() {
    $("#autoModeOption").prop("checked", true);
    if(document.getElementById('automodeApproxOption').checked){
        $.getJSON('modes/automode.json', function (modesData) {
            //console.log(data);

            $.getJSON('schemas/schema-uwcse.json', function (schemaData) {
                //console.log(data);
                
                prepareGraph(modesData, schemaData);
            })
        })
    }else{
        loadAutomodeExact()
    }
};

function loadManualTuned() {
    $.getJSON('modes/manual.json', function (modesData) {
        //console.log(data);

        $.getJSON('schemas/schema-uwcse.json', function (schemaData) {
            //console.log(data);
            
            prepareGraph(modesData, schemaData);
        })
    })
};
