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
	app.selectedList = null;

//init function
app.init = function (){
	//read db from file

	//if no db then create a new one
	//app.webdb.db.open();
	app.lists = InitAllLists();
	//populateListSelector();
	//populateListSelect();
	initAddItemDialog();
	initAddListDialog();
	//initMenuButton();
	OnListChange();
	initMenus();
	initListCollapse($('#item_2'));
	initListCollapse($('#item_3'));
	initListCollapse($('#item_4'));
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
/*
function openMenu(){
	$('.menu-overlay').show();
	$('.menu').animate({
		left: 0
	}, 200);
}
function closeMenu(){
	$('.menu-overlay').hide();
	$('.menu').animate({
		left: -250
	}, 200);
}*/

function initAddItemDialog(){
	$('#dialog-form').dialog({
		autoOpen: false,
		position: { my: 'top+20', at: 'top', of: window },
		modal: false,
		buttons: {
			'Create' : function() {
				addNewItem($('#name').val(), $('#style').val(), $('#location').val(), $('#review').val(), false);

				//clear form
				$("#dialog-form :input").each(function(){
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

function test(){
	createList('testList4');
}

function OpenAddItemPopup(){
	var tempheight = $(document).height()-50;
	var tempwidth = $(document).width()-30;
	$('#dialog-form').dialog({
		height: tempheight,
		width: tempwidth
	});
	$('#dialog-form').dialog('open');
}

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
//-End-

//-Start- List Controls

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
	}
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
	}
	//Forces an update to a current list

	function updateCurrentList(){

		store.set(app.selectedList.id, app.selectedList.val);
	}

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
	}
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