function openLeftMenu(){
	$('.leftMenu-overlay').show();
	$('.leftMenu').animate({
		left: 0
	}, 200);
}
function closeLeftMenu(){
	$('.leftMenu-overlay').hide();
	$('.leftMenu').animate({
		left: -250
	}, 200);
}