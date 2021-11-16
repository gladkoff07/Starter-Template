
$(document).ready(function () {

  // Mask
  $("input[name='phone']").mask("+7(999) 999-99-99");

  // Fancybox
  $('.js-link-modal').fancybox({
    animationEffect : "zoom-in-out",
    slideClass : 'modal-close'
  });

  // Slider
  $('.slider').slick({
    prevArrow: '<button type="button" data-role="none" class="slick-prev" aria-label="Previous" tabindex="0" role="button"></button>',
    nextArrow: '<button type="button" data-role="none" class="slick-next" aria-label="Next" tabindex="0" role="button"></button>',
    infinite: true,
    speed: 300,
    slidesToShow: 2,
    slidesToScroll: 1
  });
  
});