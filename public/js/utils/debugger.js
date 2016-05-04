///debugging
export function debugging(msg) {
	var val = $('.console').val();
	$('.console').val(val +=  msg);
	var textarea = document.querySelector('.console');
	textarea.scrollTop = textarea.scrollHeight;
}
///debugging