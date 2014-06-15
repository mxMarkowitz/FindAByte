//var listItems = {};
//var list = '';

function initList(){

}
function addItem(item, list){
	var newItem = template;
		newItem = newItem.replace('{{id}}', 'item_' + item.id)
		newItem = newItem.replace('{{name}}', item.name);
		newItem = newItem.replace('{{location}}', item.location);
		newItem = newItem.replace('{{review}}', item.review + ' stars');
		newItem = newItem.replace('{{styles}}', item.styles);
		newItem = newItem.replace('{{maps}}', item.maps);
		newItem = newItem.replace('{{foursquare}}', item.foursquare);

	//id for event
	var tempId = '#item_' +item.id;
	list.append(newItem);
	initListCollapse($(tempId));
}

function initListCollapse(listItem){
	//console.log(listItem);
	var top = listItem.find('.listCont_topRow');
	var mid = listItem.find('.listCont_midRow');
	var bot = listItem.find('.listCont_botRow');
	top.on('click', function() {

		if (listItem.height() == 40){
			mid.show();
			bot.show();
			listItem.animate({
				height: '+=60'
			}, 200);
		} else if (listItem.height() == 100){
			mid.hide();
			bot.hide();
			listItem.animate({
				height: '-=60'
			}, 200);
		}
	});
}


var template = '<div id="{{id}}" class="listContainer">' +
    	'<div id="item_2_top" class="listCont_topRow">' +
  			'<div class="listCont_topRow_name">' +
    			'{{name}}'+
    		'</div>'+
  			'<div class="listCont_topRow_location">'+
    			'{{location}}' +
    		'</div>' +
    		'<div class="listCont_topRow_review">' +
    			'{{review}}' +
    		'</div>' +
		'</div>' +
		'<div class="listCont_midRow">' +
  			'<div class="listCont_midRow_styles">' +
  				'{{styles}}' +
  			'</div>' +
		'</div>' +
		'<div class="listCont_botRow">' +
  			'<div class="listCont_botRow_maps">' +
  				'{{maps}}'
  			'</div>' +
			'<div class="listCont_botRow_fourSquare">' +
				'{{foursquare}}' +
			'</div>' +
		'</div>' +
	'</div>';

//testMethods
function testAdd(){
	var newItem ={
		id: 8,
		name: 'testName',
		location: 'testLocation',
		review: 3,
		styles: [ 'style1', 'style2', 'style3'],
		maps: 'testMapLink',
		foursquare: 'testFSLink'
	};

	addItem(newItem, $('body'));

}

function testUpdate(){

}

function testRemove(){

}