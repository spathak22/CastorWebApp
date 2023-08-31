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
        'background-image': 'http://josepicado.com/castor/icde18-demo/schemas/images/uwcse-schema/student.png'
      })
    .selector('#inphase')
      .css({
        'height': 160,
        'width': 200,
        'background-image': 'http://josepicado.com/castor/icde18-demo/schemas/images/uwcse-schema/inphase.png'
      })
    .selector('#yearsinprogram')
      .css({
        'height': 160,
        'width': 280,
        'background-image': 'http://josepicado.com/castor/icde18-demo/schemas/images/uwcse-schema/yearsinprogram.png'
      })
    .selector('#professor')
      .css({
        'height': 160,
        'width': 200,
        'background-image': 'http://josepicado.com/castor/icde18-demo/schemas/images/uwcse-schema/professor.png'
      })
    .selector('#hasposition')
      .css({
        'height': 160,
        'width': 200,
        'background-image': 'http://josepicado.com/castor/icde18-demo/schemas/images/uwcse-schema/hasposition.png'
      })
    .selector('#courselevel')
      .css({
        'height': 160,
        'width': 200,
        'background-image': 'http://josepicado.com/castor/icde18-demo/schemas/images/uwcse-schema/courselevel.png'
      })
    .selector('#taughtby')
      .css({
        'height': 200,
        'width': 200,
        'background-image': 'http://josepicado.com/castor/icde18-demo/schemas/images/uwcse-schema/taughtby.png'
      })
    .selector('#cot_event_position')
      .css({
        'height': 310,
        'width': 190,
        'background-image': 'url(./schemas/images/immortals-schema/cot_event_position.png)'
      })
    .selector('#cot_event')
      .css({
        'height': 225,
        'width': 160,
        'background-image': 'url(./schemas/images/immortals-schema/cot_event.png)'
      })
    .selector('#source')
      .css({
        'height': 150,
        'width': 150,
        'background-image': 'url(./schemas/images/immortals-schema/source.png)'
      }),
  elements: {
    nodes: [
      
      { data: { 'id': 'source' } },
      { data: { 'id': 'cot_event' } },
      { data: { 'id': 'cot_event_position' } }
    ],
    edges: [
      { data: { source: 'source', target: 'cot_event' } },
      { data: { source: 'cot_event', target: 'cot_event_position' } }

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