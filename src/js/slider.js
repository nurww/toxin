const $ = require('jquery');

// let left = parseInt($('.image-container').css('left'));
let left;
// let currentCrumb = 0;
let currentCrumb;
let parent;

$('.slider-nav-right').on('click', (e) => {
// $(document).on('click', (e) => {
	if (!parent) {
		parent = $(e.target).parents('.slider');
		left = parseInt(parent.find('.image-container').css('left'));
		currentCrumb = parent.find('.crumb').index(parent.find('.active'));
	}

	if (parent && !parent.is($(e.target).parents('.slider'))) {
		parent = $(e.target).parents('.slider');
		currentCrumb = parent.find('.crumb').index(parent.find('.active'));
		left = parseInt(parent.find('.image-container').css('left'));
	}

	if ($(e.target).is(parent.find('.slider-nav-right')) || $(e.target).is(parent.find('.next'))) {
		if (left <= 0 && left > -810) {
			left = left - 270;
			parent.find('.image-container').css('left', `${left}px`);
			currentCrumb += 1;
			parent.find('.crumb').each((idx, el) => {
				$(el).removeClass('active');
			});

			$(parent.find('.crumb')[currentCrumb]).addClass('active');
		}
	}
});

$('.slider-nav-left').on('click', (e) => {
// $(document).on('click', (e) => {
	if (!parent) {
		parent = $(e.target).parents('.slider');
		left = parseInt(parent.find('.image-container').css('left'));
		currentCrumb = parent.find('.crumb').index(parent.find('.active'));
	}

	if (parent && !parent.is($(e.target).parents('.slider'))) {
		parent = $(e.target).parents('.slider');
		currentCrumb = parent.find('.crumb').index(parent.find('.active'));
		left = parseInt(parent.find('.image-container').css('left'));
	}

	if ($(e.target).is(parent.find('.slider-nav-left')) || $(e.target).is(parent.find('.prev'))) {
		if (left < 0 && left >= -810) {
			left = left + 270;
			parent.find('.image-container').css('left', `${left}px`);
			currentCrumb -= 1;
			parent.find('.crumb').each((idx, el) => {
				$(el).removeClass('active');
			});

			$(parent.find('.crumb')[currentCrumb]).addClass('active');
		}
	}
});
