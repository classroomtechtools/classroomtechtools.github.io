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

function awesometable (params) {

	this.$sidebar = $('#sidebar');
	this.$title = $('h4.sites-embed-title');
	this.$topContainer = $('#topContainer');
	this.$container = $('#middleContainer');
	this.$count = $('#middleContainer > .count');
	this.$controllers = $('#controlersPanel');
	this.$table = this.$container.find('.google-visualization-table-table');
	this.$tableBody = this.$table.find('tbody');
	this.$tableRows = this.$tableBody.find('tr');
	this.$tableSelector = '.google-visualization-table-table'; 

	this.main(params);
}


awesometable.prototype.controllers = {};  // routines that have to do with the controllers

/*
	@param {id} The string id of the changed item, i.e. "controller0"
*/
awesometable.prototype.didChange = function(id) {
	// does nothing, override me
};

/* 
	This gets called every time something changes in the awesometable.
	Also called upon load (via main)
	It basically looks at the template information and adjusts the content accordingly
*/ 
awesometable.prototype.update = function() {

	$('*[column]').each(function (item) { 
		var value = $(this).parents('.wrapper').data( $(this).attr('column') );
		if ($(this).attr('attr')) {
			var attr = $(this).attr('attr');
			$(this).attr(attr, value);
		} else if ($(this).attr('paragraphs') != undefined) {
			// convert value to html-friendly paragraphs
			// with more and less button if there are a large amount of them
			// can define how many 
			// TODO: less button (if needed?)
			var attrValue = $(this).attr('paragraphs');
			var how_many = 3;
			var more = false;
			if (attrValue && attrValue.replace(/[^a-zA-Z]/g, '').toLowerCase() == 'more') {
				more = true;
				var stripNonDigits = attrValue.replace(/[^0-9]/g, '');
				if (!isNaN(stripNonDigits)) {
					how_many = parseInt(stripNonDigits);
				}
			}

			var newValue = $("<div/>");
			if (more && value.split('\n').length > how_many) {
				value.split('\n').forEach(function (iValue, ii, aa) {
					if (newValue) newValue.append($('<p/>', {text:iValue, class:'paragraph' + (ii < how_many ? ' first' : '')}));
				});
				$more = $('<div/>', {class: "more"});
				//$less = $('<div/>', {class: "less"});
				$more.append($('<button/>', {class: "toggle", text:"More"}).button());
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
		} else if ($(this).attr('stringified') === "") {
			// make a new div that will replace this one
			//var comments = JSON.parse(value);
			$me = $(this);
			if (value instanceof Array) {
				if (value.length == 0) {
					$me.html("");
				} else {
					// We have to convert these specific html entitied otherwise the template won't recognize
					// Or we could tell underscore templating to use a different pattern recognizer
					// TODO: Make this less ugly
					template = _.template($me.html().replace(/&lt;/g, "<").replace(/&gt;/g, ">"));
					$me.html("");
					value.forEach(function (item, index, arr) {
						$(template(item)).appendTo($me);
					});
				}
			} else {
				if (value === "" || value == "#ERROR!") {
					$me.html('Warning: Problem that needs to be fixed by admin. Comments can be added but will not be displayed here (until fixed).');
				} else {
					if (value == "#ERROR!") {
						$me.html("");
					}
					console.log("Array or empty string expected! What are you?:");
					console.log(value);
				}
			}

		} else {
			switch ($(this).attr('at') && $(this).attr('at').toLowerCase()) {
				case 'after': 
					$(this).append(value); 
					break;
				case 'before':
					$(this).prepend(value); 
					break;
				default:
					$(this).prepend(value); 
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
};

/*
	@param {params} These can be defined from the awesometable template

	This gets called after loading, you should set up your application-specific stuff here
*/
awesometable.prototype.main = function (params) {
	this.params = params;

	if (this.params.hasOwnProperty('debug') && this.params.debug) {
		debugger;
	}

	this.update();

	// Add observers so that we can run update whenever the data in the table changes.
	// The selectors and if statements make it only run once

	// Add an observer to update text whene

	this.$container
		.observe('childList subtree', function(record) {
			if (record.addedNodes && record.addedNodes.length == 1 && record.target.className == 'google-visualization-table') {
				if (record.previousSibling == null) {
					this.update();
				}
			}
		});

	this.$controllers
		.observe('childList subtree', function(record) {
			if (record.target.className == 'google-visualization-controls-categoryfilter-selected') {
				var thisId = '#' + $(record.target).parents('.controlers-filters').get(0).id;
				if (this.controllerDefinitions.hasOwnProperty(thisId)) {
					this.didChange(thisId);
				}
			}
	});

	// Clicking on the triangle (actually anywhere in the header) causes an update that isn't triggered by above
	$(document).on('click', 'th.google-visualization-table-th', function () {this.update()});

}
