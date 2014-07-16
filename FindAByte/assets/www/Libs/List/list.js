function initList(){
}
function addItem(item, list, editEvent){
	var newItem = template;
		newItem = newItem.replace('{{id}}', 'item_' + item.id)
		newItem = newItem.replace('{{name}}', item.name);
		newItem = newItem.replace('{{location}}', item.location);
		newItem = newItem.replace('{{rating}}', item.rating + ' stars');
		newItem = newItem.replace('{{tags}}', item.tags);
		newItem = newItem.replace('{{maps}}', item.maps);
		newItem = newItem.replace('{{foursquare}}', item.foursquare);

	//id for event
	var tempId = '#item_' +item.id;
	list.append(newItem);
	initItemEvents($(tempId), editEvent);
	//initListCollapse($(tempId));
}
function updateItem(item, editEvent){
	var newItem = template;
		newItem = newItem.replace('{{id}}', 'item_' + item.id)
		newItem = newItem.replace('{{name}}', item.name);
		newItem = newItem.replace('{{location}}', item.location);
		newItem = newItem.replace('{{rating}}', item.rating + ' stars');
		newItem = newItem.replace('{{tags}}', item.tags);
		newItem = newItem.replace('{{maps}}', item.maps);
		newItem = newItem.replace('{{foursquare}}', item.foursquare);

	var tempId = '#item_' +item.id;
	$(tempId).replaceWith(newItem);
	initItemEvents($(tempId), editEvent);
	//initItemEvents($(tempId), editEvent);
}
function getListItemId(listItem){
	return listItem.split('_')[1];
}

function removeItem(itemId, list){
	$('#item_' + itemId).remove();
};
function initItemEvents(listItem, editEvent){
	initListCollapse(listItem);
	initEditButton(listItem, editEvent);
}

function initListCollapse(listItem){
	//console.log(listItem);
	var top = listItem.find('.listCont_topRow');
	var mid = listItem.find('.listCont_midRow');
	var bot = listItem.find('.listCont_botRow');
	top.on('click', function() {
		//add function to track when the animation is active
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
function initEditButton(listItem, event){
	listItem.on('click', '.listCont_botRow_edit', function(){
		event(listItem);
	})
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
    			'{{rating}}' +
    		'</div>' +
		'</div>' +
		'<div class="listCont_midRow">' +
  			'<div class="listCont_midRow_styles">' +
  				'{{tags}}' +
  			'</div>' +
		'</div>' +
		'<div class="listCont_botRow">' +
			'<div class="listCont_botRow_edit">' +
                'Edit' +
  			'</div>' +
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
		rating: 3,
		tags: [ 'style1', 'style2', 'style3'],
		maps: 'testMapLink',
		foursquare: 'testFSLink'
	};

	addItem(newItem, $('body'));
}

function testRemove(){
	//quick test of removal
	removeItem(8, $('body'));
}

function testUpdate(){
	var newItem ={
		id: 8,
		name: 'testName2',
		location: 'testLocation2',
		rating: 4,
		tags: [ 'style12', 'style22', 'style32'],
		maps: 'testMapLink2',
		foursquare: 'testFSLink2'
	};

	updateItem(newItem, $('body'));
}