$('.nav-item').click(function() {
  $(this).addClass('active');
  $(this).siblings().removeClass('active');
});

$('#search-bar').focus(function() {
  $(this).siblings('.search-bar-border').addClass('active');
});

$('#search-bar').blur(function() {
  $(this).siblings('.search-bar-border').removeClass('active');
});