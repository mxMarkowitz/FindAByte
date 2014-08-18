function Restaurant (id, name, review, style, location, visited) {
	this.id = id;
	this.name = name;
	this.review = review;
	this.style = style;
	this.location = location;
	this.visited = visited;
	this.tags = [];
	//this.hours = {};
}
//Global Variables
var app= {};
	app.webdb = {};
	app.webdb.db = null;
	app.lists = [];
	app.selectedList = null,
	db = {},
	listId = '';

//init function
app.init = function (){
	//read db from file
	initAddItemDialog();
	initAddListDialog();
	initEditItemDialog();
	initListSelectDialog();
	initMenus();
	db = new dataStore();
	db.initDataStore();
	populateSel();
}
function populateSel(){
	var lists = db.getAllLists();
	$('#listSelect option[value!=null]').remove();
	for (var prop in lists){
		$('#listSelect').append($("<option></option>")
						.attr('value', prop)
						.text(lists[prop].name));
	}
	$('#listSelect').on('change', function(e){
		listId = this.value;
		populateList(listId);
	})
}
function populateSelectPopup(){
	var lists = db.getAllLists();
	var container = $('#listSelectContainer');
	for (var prop in lists){
		container.append($('<div>')
							.attr('value', prop)
							.html('<div>' + lists[prop].name + '</div><div> ' + lists[prop].description + '</div>'));
	}
}

function populateList(list){
	$('#listCard div[class="listContainer"]').remove();
	var vals = db.getList(list).items;
	for (var prop in vals){
		if (typeof vals[prop] === 'object'){
			addItem(vals[prop], $('#listCard'), openEditItemPopop);
		}
	}
}

function testInit(){
	var testList = {
	'name' : 'testList',
	'description' : 'testListDescription',
	'items' : {}
	};
	listId = db.createList(testList);

	var i = 5;
	while (i != 0){
		db.createItem({
						'name' : 'testItemName2',
						'location' : 'testLocation2',
						'rating' : 5,
						'tags' : [ 'tag1', 'tag2', 'tag3'],
						'foursquare' : 'testF4link2',
						'maps' : 'testMapsLink2'
					},listId);
	i--;
	}
}


function populateListSelector(){
	var select = document.getElementById('listSelect');
	clearSelect(select);
	for (var i = 0; i < app.lists.length; i++){
		var option = document.createElement('option');
        option.value = app.lists[i];
        option.text = app.lists[i];
        select.add(option);
    }
}

function clearSelect(select){
	var length = select.options.length;
	for (i = 0; i < length; i++) {
	  select.options[i] = null;
	}
}
//Local Storage Structure
// DB of lists
// Last selected list
function initCheckEvent(){
	$('#listCheck').change(function() {
		var id = parseListId($(this).parent().parent().attr('id'));
		console.log(id);
		console.log($(this).prop('checked'));
		var select = $(this).prop('checked')
		app.selectedList.val[id].visited = select;
		updateCurrentList();
	})
}
function parseListId(id){

	return id.trimLeft('item_');
}
function populateListSelect(){
	$('#listSelect').change(function() {

		if ($(this).val() != app.selectedList){
			populateList(store.get($(this).val()));
		}
		app.selectedList = {id:$(this).val(), val: store.get($(this).val())};
	});
}

//popup initialization functions
function initEditItemDialog(){
	$('#editItemDialog').dialog({
		autoOpen: false,
		position: { my: 'top+20', at: 'top', of: window },
		modal: false,
		buttons: {
			'Save' : function() {
				//addNewItem($('#name').val(), $('#style').val(), $('#location').val(), $('#review').val(), false);
				var item = {
					'id': $('#editIdInput').val(),
					'name': $('#editNameInput').val(),
					'location': $('#editLocationInput').val(),
					'rating': parseInt($('#editReviewInput').val()),
					'tags': $('#editStyleInput').val().split(','),
					'foursquare': '',
					'maps': ''
				}
				var id = db.editItem(item, listId);
				updateItem(item, openEditItemPopop);
				//clear form
				$("#editItemDialog :input").each(function(){
					$(this).val('');
				});

				$( this ).dialog( "close" );
			},
			Cancel: function() {
          		$( this ).dialog( "close" );
        	}
		}
	});
}
function initListSelectDialog(){
	$('#listSelectDialog').dialog({
		autoOpen: false,
		position: { my: 'top+20', at: 'top', of: window },
		modal: false,
		buttons: {
			'close': function (){
				$( this ).dialog( "close" );
			}
		}
	})
}

function initAddItemDialog(){
	$('#addItemDialog').dialog({
		autoOpen: false,
		position: { my: 'top+20', at: 'top', of: window },
		modal: false,
		buttons: {
			'Create' : function() {
				//addNewItem($('#name').val(), $('#style').val(), $('#location').val(), $('#review').val(), false);
				var newItem = {
					'name': $('#name').val(),
					'location': $('#location').val(),
					'rating': Number($('#review').val()),
					'tags': $('#style').val().split(','),
					'foursquare': '',
					'maps': ''
				}
				var id = db.createItem(newItem, listId);
				newItem.id = id;
				addItem(newItem, $('#listCard'), openEditItemPopop);
				//clear form
				$("#addItemDialog :input").each(function(){
					$(this).val('');
				});

				$( this ).dialog( "close" );
			},
			Cancel: function() {
          		$( this ).dialog( "close" );
        	}
		}
	});
}
function initAddListDialog(){
	$('#listCreation-form').dialog({
		autoOpen: false,
		position: { my: 'top+20', at: 'top', of: window },
		modal: false,
		buttons: {
			'Create' : function() {
				//addNewItem($('#name').val(), $('#style').val(), $('#location').val(), $('#review').val(), false);

				//create list
				var tempList = {
					'name' : $('#nameListInput').val(),
					'description' : $('#descriptionListInput').val(),
					'items' : {}
				}
				var listId = db.createList(tempList);
				populateSel();
				populateList(listId);
				$('#listSelect').val(listId);
				//switch to list

				//clear form
				$("#listCreation-form :input").each(function(){
					$(this).val('');
				});

				$( this ).dialog( "close" );
			},
			Cancel: function() {
          		$( this ).dialog( "close" );
        	}
		}
	});
}

//Popup opening functions
function openListSelect(){
	closeMenu(function(){
		var tempheight = $(document).height()-50;
		var tempwidth = $(document).width()-30;
		$('#listSelectDialog').dialog({
			height: tempheight,
			width: tempwidth
		});
		populateSelectPopup();
		$('#listSelectDialog').dialog('open');
	});
}

function openAddItemPopup(){
	closeMenu(function(){
		var tempheight = $(document).height()-50;
		var tempwidth = $(document).width()-30;
		$('#addItemDialog').dialog({
			height: tempheight,
			width: tempwidth
		});
		$('#addItemDialog').on('shown.bs.modal', function () {
			$('#name').focus();
		});
		$('#addItemDialog').dialog('open');
	});
}
function openEditItemPopop(listItem){
	var tempheight = $(document).height()-50;
	var tempwidth = $(document).width()-30;
	var item = db.getItem(getListItemId( listItem.attr('id') ), listId);
	//set values
	$('#editIdInput').val(item.id);
	$('#editNameInput').val(item.name);
	$('#editStyleInput').val(item.tags);	
	$('#editLocationInput').val(item.location);
	$('#editReviewInput').val(item.rating);

	$('#editItemDialog').dialog({
		height: tempheight,
		width: tempwidth
	});
	$('#editItemDialog').dialog('open');
}
function openAddListPopup(){
	closeMenu(function(){
		var tempheight = $(document).height()-50;
		var tempwidth = $(document).width()-30;
		$('#listCreation-form').dialog({
			height: tempheight,
			width: tempwidth
		});
		$('#listCreation-form').on('shown.bs.modal', function () {
			$('#nameListInput').focus();
		});
		$('#listCreation-form').dialog('open');
	});
}
/*
//-Start- Item Controls
	//creates a new item, updates current list and updates on store
	function addNewItem(name, style, location, review, visited){
		var len = Object.keys(app.selectedList.val).length;
	
		app.selectedList.val[len+1] = {name: name,
									   style: style,
									   location: location, 
									   review: review, 
									   visited: visited };
		updateCurrentList();
		populateList(store.get(app.selectedList.id));
	}
//-End-*/

//-Start- List Controls
/*
	//Creates list, sets in db, populates select, sets selected, populates list
	function InitAllLists (){
		var results = store.getAll();
		var lists = [];
		for (var keys in results){
			lists.push(keys);
		}
		return lists;
	}
	//Populates the current listview with a list
	function populateList(list){
		console.log('start populateList');
		var tbody = $('#mainList-body');
		//console.log('List.length = ' + list.length);
		var body = '';
		for (var property in list){
			var check = list[property].visited;
			body +=  '<tr id = item_' + property +'>';
			if (check == true){
				body += '<td><input class="listCheck" type="checkbox" checked="checked"></input></td>';
			}
			else{
				body += '<td><input class="listCheck" type="checkbox"></input></td>';
			}
			body += '<td>' + list[property].name + '</td>';
			body += '<td>' + list[property].style + '</td>';
			body += '<td>' + list[property].review + '</td>';
			body += '<td>' + list[property].location + '</td>';
			body += '</tr>';
		}
		tbody.empty();
	
		tbody.html(body);
		initCheckEvent();
	
		console.log('end populateList');
	}*/
	/*
	//Updates the list on a change
	function OnListChange(){
		var sel = document.getElementById('listSelect');
		sel.onchange = function() {
			if (app.selectedList != sel){
				var i = sel.value;
				var list = store.Get(sel.value);
				populateList(list);
			} 
		}
	}*/
	//Forces an update to a current list
	/*
	function updateCurrentList(){

		store.set(app.selectedList.id, app.selectedList.val);
	}*/
	/*
	//Creates a new list
	function createList(listId){
		if (!store.get(listId)){
			store.set(listId, {});
			app.lists = InitAllLists();
			populateListSelector();
			var list = store.get(listId);
			app.selectedList = list;
			$('#listSelect').val(listId);
			populateList(list);
		} else {
			alert('list name taken');
		}
	}*/
//-End-

//prototypes
String.prototype.trimLeft = function(charlist) {
  if (charlist === undefined)
    charlist = "\s";
 
  return this.replace(new RegExp("^[" + charlist + "]+"), "");
};

/*
app.webdb.open = function() {
	var dbSize = 5 * 1024 * 1024; // 5MB
	app.webdb.db = openDatabase("Biter", "1", "Bite Travels", dbSize);
}
app.webdb.createTable = function() {
	var db = app.webdb.db;
	db.transaction(function(tx) {
    tx.executeSql("CREATE TABLE IF NOT EXISTS " +
                  "todo(ID INTEGER PRIMARY KEY ASC, name TEXT, review INTEGER, style TEXT, location TEXT, added_on DATETIME)", []);
  });
}



app.webdb.onError = function(tx, e) {
	alert("There has been an error: " + e.message);
}
app.webdb.onSuccess = function(tx, r) {
	// re-render the data.
	// loadTodoItems is defined in Step 4a
	//app.webdb.getAllTodoItems(loadTodoItems);
	console.log('Success')
}*/