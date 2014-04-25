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
function InitAllLists (){
	var results = store.getAll();
	var lists = [];
	for (var keys in results){
		lists.push(keys);
	}
	return lists;
}
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

function populateListSelector(){
	var select = document.getElementById('listSelect');
	for (var i = 0; i < app.lists.length; i++){
		var option = document.createElement('option');
        option.value = app.lists[i];
        option.text = app.lists[i];
        select.add(option);
    }
}
//Local Storage Structure
// DB of lists
// Last selected list
function initCheckEvent(){
	$('.listCheck').change(function() {
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
var app= {};
	app.webdb = {};
	app.webdb.db = null;
	app.lists = [];
	app.selectedList = null;


app.init = function (){
	//read db from file

	//if no db then create a new one
	//app.webdb.db.open();
	app.lists = InitAllLists();
	populateListSelector();
	$('#listSelect').change(function() {

		if ($(this).val() != app.selectedList){
			populateList(store.get($(this).val()));
		}
		app.selectedList = {id:$(this).val(), val: store.get($(this).val())};
	});
	$('#dialog-form').dialog({
		autoOpen: false,
		position: { my: 'top+20', at: 'top', of: window },
		modal: false,
		buttons: {
			'Create' : function() {
				addNewItem($('#name').val(), $('#style').val(), $('#location').val(), $('#review').val(), false);
				$( this ).dialog( "close" );
			},
			Cancel: function() {
          		$( this ).dialog( "close" );
        	}
		}

	});

}
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

function updateCurrentList(){
	store.set(app.selectedList.id, app.selectedList.val);
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