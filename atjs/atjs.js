// This is free and unencumbered software released into the public domain, by classroomtechtools.com

// Anyone is free to copy, modify, publish, use, compile, sell, or
// distribute this software, either in source code form or as a compiled
// binary, for any purpose, commercial or non-commercial, and by any
// means.

// In jurisdictions that recognize copyright laws, the author or authors
// of this software dedicate any and all copyright interest in the
// software to the public domain. We make this dedication for the benefit
// of the public at large and to the detriment of our heirs and
// successors. We intend this dedication to be an overt act of
// relinquishment in perpetuity of all present and future rights to this
// software under copyright law.

// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
// EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
// IN NO EVENT SHALL THE AUTHORS BE LIABLE FOR ANY CLAIM, DAMAGES OR
// OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE,
// ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
// OTHER DEALINGS IN THE SOFTWARE.

/*

	This piece of javascript simply loads up and defines common idioms used with awesometables
	so that subsequent javascript can utilize it. Doesn't do anything per se, but sets things up.

*/

this.atjs = {};

(function (atjs) {
    /*
		Called at the start      
    */
	atjs.app = function () {
		$( document ).ready(function() {
			atjs.$sidebar = $('#sidebar');
			atjs.$title = $('h4.sites-embed-title');
			atjs.$topContainer = $('#topContainer');
			atjs.$container = $('#middleContainer');
			atjs.$count = $('#middleContainer > .count');
			atjs.$controllers = $('#controlersPanel');
			atjs.$table = atjs.$container.find('.google-visualization-table-table');
			atjs.$tableBody = atjs.$table.find('tbody');
			atjs.$tableRows = atjs.$tableBody.find('tr');
			atjs.$tableSelector = '.google-visualization-table-table'; 
		}
	};

	atjs.controllers = {};  // routines that have to do with the controllers

	/*
		@param {id} The string id of the changed item, i.e. "controller0"
	*/
	atjs.controllers.didChange = function(id) {
		// does nothing, override me
	};

	atjs.utils = {};

	atjs.utils.getColumnData = function($item, column) {
		return $item.parents('.wrapper').data( $item.attr('column') );
	}

	/* 
		This gets called every time something changes in the awesometable.
		Also called upon load (via main)
		It basically looks at the template information and adjusts the content accordingly
	*/ 
	atjs.update = function() {

		$('*[column]').each(function (item) { 
			var value = atjs.utils.getColumnData($(this), $(this).attr('column'));
			if ($(this).attr('attr')) {
				var attr = $(this).attr('attr');
				$(this).attr(attr, value);
			} else {
				switch ($(this).attr('at') && $(this).attr('at').toLowerCase()) {
					case 'after': 
						$(this).append(value); 
						break;
					case 'before':
						$(this).prepend(value); 
						break;
					default:
						$(this).html(value); 
				}
			}
		});

		$('*[onlyif]').each(function (item) {
			var value = $(this).attr('onlyif');
			if (value.indexOf('=') != -1) {
				var column = value.split("=")[0];
				value = value.split("=")[1];
				var variable = $(this).parents('.wrapper').data(column.toLowerCase());
				if (variable !== value) {
					$(this).css('display', 'none');
				}
			} else {
				if ($(this).text() !== value) {
					$(this).css('display', 'none');
				}
			}
		});

		$('*[classif]').each(function (item) {
			var value = $(this).attr('classif');
			var split = value.split(' ');
			if (split.length == 0) return;
			var klass = split[0];
			split = split[1].split('=');
			if (split.length == 0) return;
			var column = split[0];
			var variable = $(this).parents('.wrapper').data(column.toLowerCase());
			var value = split[1];
			if (variable === value) {
				$(this).addClass(klass);
			}
		});

		$('*[paragraphs]').each(function (item) {
			var value = $(this).html();
			$(this).html("");
			var attrValue = $(this).attr('paragraphs');
			var more = false;
			var howMany = 3;
			if (attrValue && attrValue.replace(/[^a-zA-Z]/g, '').toLowerCase() == 'more') {
				more = true;
				var stripNonDigits = attrValue.replace(/[^0-9]/g, '');
				if (!stripNonDigits || isNaN(stripNonDigits)) {
					howMany = 3;
				} else {
					howMany = parseInt(stripNonDigits);
				}
			}

			var newValue = $("<div/>");
			if (more && value.split('\n').length > howMany) {
				value.split('\n').forEach(function (iValue, ii, aa) {
					if (newValue) newValue.append($('<p/>', {text:iValue, class:'paragraph' + (ii < howMany ? ' first' : '')}));
				});
				$more = $('<div/>', {class: "more"});
				//$less = $('<div/>', {class: "less"});
				$more.append($('<button/>', {class: "toggle", text:"More"}));
				newValue.find('p.first:last').addClass('first').append($more);
				//newValue.find('p:last').addClass('last').append($less);

				$(this).append(newValue);

				// Hide all of them, except those labeled as first
				newValue.find('p').hide();
				newValue.find('p.first').show();
				newValue.find('.toggle').click(function () {
					newValue.find('.more').toggle();
					newValue.find('p:not(.first,.toggle)').slideToggle();
				});
			} else {
				value.split('\n').forEach(function (iValue, ii, aa) {
					newValue.append($('<p/>', {text:iValue, class:'paragraph'}));
				});
				$(this).append(newValue);
			}
		});

	};

	/*
		@param {params} These can be defined from the awesometable template

		This gets called after loading, you should set up your application-specific stuff here
	*/
	atjs.start = function (params) {
		atjs.app();
		atjs.params = params;

		if (atjs.params.hasOwnProperty('debug') && atjs.params.debug) {
			debugger;
		}

		atjs.update();

		// Add observers so that we can run update whenever the data in the table changes.
		// The selectors and if statements make it only run once

		// Add an observer to update text whene

		atjs.$container
			.observe('childList subtree', function(record) {
				if (record.addedNodes && record.addedNodes.length == 1 && record.target.className == 'google-visualization-table') {
					if (record.previousSibling == null) {
						atjs.update();
					}
				}
			});

		atjs.$controllers
			.observe('childList subtree', function(record) {
				if (record.target.className == 'google-visualization-controls-categoryfilter-selected') {
					var thisId = '#' + $(record.target).parents('.controlers-filters').get(0).id;
					atjs.controllers.didChange(thisId);
				}
		});

		// Clicking on the triangle (actually anywhere in the header) causes an update that isn't triggered by above
		$(document).on('click', 'th.google-visualization-table-th', function () {atjs.update()});

	}


}(this.atjs));

