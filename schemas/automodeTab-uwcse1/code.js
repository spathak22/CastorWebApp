$(function(){ // on dom ready

// photos from flickr with creative commons license
  
var cy = cytoscape({
  container: document.getElementById('automodeTabSchema'),
  
  boxSelectionEnabled: false,
  autounselectify: true,
  
  style: cytoscape.stylesheet()
    .selector('node')
      .css({
        'shape': 'roundrectangle',
        'width': 50,
        'height': 20,
        'border-color': '#000',
        'border-width': 0.1,
        'border-opacity': 0.5,
        'background-color': '#FFFFFF',
        "content":"data(descr)",
        "text-valign":"center","text-halign":"center","text-wrap":"wrap", "font-size":"8px"
      })
    .selector('edge')
      .css({
        'width': 1,
        'line-color': '#000000',
        'target-arrow-color': '#000000',
        'target-arrow-shape': 'diamond',
        'curve-style': 'bezier'
      })
    .selector('$node > node')
      .css({
        'background-color': '#D9FFFF',
        'background-opacity': 0.2
      })
    .selector('#student')
      .css({
        'height': 160,
        'width': 200,
        'background-image': 'http://localhost:8080/castor/icde18-demo/schemas/images/uwcse-schema/student.png'
      })
    .selector('#inphase')
      .css({
        'height': 160,
        'width': 200,
        'background-image': 'http://localhost:8080/castor/icde18-demo/schemas/images/uwcse-schema/inphase.png'
      })
    .selector('#yearsinprogram')
      .css({
        'height': 160,
        'width': 280,
        'background-image': 'http://localhost:8080/castor/icde18-demo/schemas/images/uwcse-schema/yearsinprogram.png'
      })
    .selector('#professor')
      .css({
        'height': 160,
        'width': 200,
        'background-image': 'http://localhost:8080/castor/icde18-demo/schemas/images/uwcse-schema/professor.png'
      })
    .selector('#hasposition')
      .css({
        'height': 160,
        'width': 200,
        'background-image': 'http://localhost:8080/castor/icde18-demo/schemas/images/uwcse-schema/hasposition.png'
      })
    .selector('#courselevel')
      .css({
        'height': 160,
        'width': 200,
        'background-image': 'http://localhost:8080/castor/icde18-demo/schemas/images/uwcse-schema/courselevel.png'
      })
    .selector('#taughtby')
      .css({
        'height': 200,
        'width': 200,
        'background-image': 'http://localhost:8080/castor/icde18-demo/schemas/images/uwcse-schema/taughtby.png'
      })
    .selector('#ta')
      .css({
        'height': 200,
        'width': 200,
        'background-image': 'http://localhost:8080/castor/icde18-demo/schemas/images/uwcse-schema/ta.png'
      })
    .selector('#publication')
      .css({
        'height': 160,
        'width': 200,
        'background-image': 'http://localhost:8080/castor/icde18-demo/schemas/images/uwcse-schema/publication.png'
      })
    .selector('#advisedby')
      .css({
        'height': 160,
        'width': 200,
        'background-image': 'http://localhost:8080/castor/icde18-demo/schemas/images/uwcse-schema/advisedby.png'
      }),
  elements: {
    nodes: [
      
      { data: { 'id': 'inphase' } },
      { data: { 'id': 'yearsinprogram' } },

      { data: { 'id': 'student' } },

      { data: { 'id': 'advisedby' } },

      { data: { 'id': 'publication' } },

      { data: { 'id': 'ta' } },
      { data: { 'id': 'courselevel' } },
      { data: { 'id': 'taughtby' } },

      { data: { 'id': 'professor' } },
      { data: { 'id': 'hasposition' } }
      
    ],
    edges: [
      { data: { source: 'taughtby', target: 'courselevel' } },
      { data: { source: 'ta', target: 'courselevel' } },
      { data: { source: 'inphase', target: 'student' } },
      { data: { source: 'yearsinprogram', target: 'student' } },
      { data: { source: 'hasposition', target: 'professor' } },
      { data: { source: 'taughtby', target: 'professor' } },
      { data: { source: 'ta', target: 'student' } },
      //{ data: { source: 'publication', target: 'student' } },
      //{ data: { source: 'publication', target: 'professor' } }
      { data: { source: 'advisedby', target: 'student' } },
      { data: { source: 'advisedby', target: 'professor' } }
      //{ data: { source: 'advisedby_negative', target: 'student' } },
      //{ data: { source: 'advisedby_negative', target: 'professor' } }
    ]
  },
  
  layout: {
    name: 'grid',
    directed: true,
    padding: 0
  }
}); // cy init
  

$('a[data-toggle="tab"]').on('shown.bs.tab', function (e) {
      var target = $(e.target).attr("href") // activated tab
      if (target == "#autoModeTab") {
        cy.resize(); 
        cy.layout({
          name: 'grid',
          directed: true,
          padding: 0
        });
      }
    });  

}); // on dom ready