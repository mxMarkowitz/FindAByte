//constants 
var rightMenu = $('.rightMenu'),
	leftMenu = $('.leftMenu'),
	overlay = $('.menu-overlay');

function initMenus(){
	rightMenu.hide();
	leftMenu.hide();
}

function openLeftMenu(){
	overlay.show();
	leftMenu.show(1, function (){
		leftMenu.animate({
			left: 0
		}, 200);
	});
}

function openRightMenu(){
	overlay.show();	
	rightMenu.show(1, function (){
		rightMenu.animate({
			right: 0
		}, 200);
	});
}
function closeMenu(callback){
	overlay.hide();

	if (rightMenu.is(':visible')){
		rightMenu.animate({
			right: -250
		}, 200, function(){
			rightMenu.hide();
			if (callback){
				callback();
			}
		});
	} else if (leftMenu.is(':visible')){
		leftMenu.animate({
			left: -250
		}, 200, function(){
			leftMenu.hide();
			if (callback){
				callback();
			}
		});
	}

}