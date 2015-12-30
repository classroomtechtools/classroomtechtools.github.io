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

this.awtble = {};

(function (awtble) {
    /*
		Called at the start      
    */
	awtble.app = function () {
		awtble.$sidebar = $('#sidebar');
		awtble.$title = $('h4.sites-embed-title');
		awtble.$container = $('#middleContainer');
		awtble.$count = $('#middleContainer > .count');
		awtble.prefillPhrase = '';
		awtble.$controllers = $('#controlersPanel');
		awtble.$table = awtble.$container.find('.google-visualization-table-table');
		awtble.$tableBody = awtble.$table.find('tbody');
		awtble.$tableRows = awtble.$tableBody.find('tr');
		awtble.$tableSelector = '.google-visualization-table-table'; 
	};

	awtble.updateUrl = function(url) {
		awtble.url = url;
		if (awtble.prefillPhrase) awtble.embedUrl = url + '/viewform?' + awtble.prefillPhrase + '&embedded=true#start=embed';
		else awtble.embedUrl = url + '/viewform?embedded=true#start=embed';
	}
	
	/* 
		Adds a "Add New" button at the top of the awesometable
	*/
	awtble.makeNewButton = function(buttonTitle, dialogTitle) {
		awtble.$container.before($('<button/>', {id:'newButton', text:buttonTitle, style:'margin-bottom:10px'}));
		awtble.$container.before($('<div/>', {id:"addNewDialog", style: "display:none;", title:dialogTitle}));
		$("#addNewDialog").append($('<iframe/>', {src:awtble.embedUrl, height:"100%", width:"100%", frameborder: 0, marginheight:0, text:'Loading…'}));
		$('#newButton').button({icons:{primary:'ui-icon-circle-plus'}});
		$('#addNewDialog').dialog({
			autoOpen:false, 
			height:700, 
			width:"90%", 
			modal:true, 
			draggable:false,
			show:"fadeIn",
			position: { my: 'top', at: 'top+15' },
			close: function (event, ui) {
				$('#addNewDialog > iframe').detach();
				window.location.reload();
			}
		});
		$('#newButton').click(function() {
			$('#addNewDialog').dialog("open");
		});
	}

	awtble.makeReloadButton = function() {
		awtble.$container.before($('<button/>', {id:'refreshButton', text:"Refresh"}).button({icons:{primary:'ui-icon-refresh'}}));	
		$('#refreshButton').click(function () {
			window.location.reload();
		});
	}

	awtble.definePrefill = function(prefillUrl) {
		// Take the raw prefill Url and extract just the bits we want
		// So we have a 'prefillPhrase'
		awtble.prefillPhrase = prefillUrl.match(/entry.*$/)[0].split('&').reduce(function (obj, value, index) {
			s = value.split('=');
			if (s.length>1) obj.push(s);
			return obj;
		}, []).map(function (v, i, arr) {
			return v.join('=');
		}).join('&');
	}
	
	awtble.moveStringFilterToFront = function($stringFilter) {
		$stringFilter.detach().prependTo(awtble.$controllers);
	}

	/* 
		This gets called every time something changes in the awesometable.
		Also called upon load (via main)
		It basically looks at the template information and adjusts the content accordingly
	*/ 
	awtble.update = function() {

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
			var split = split[1].split('=');
			if (split.length == 0) return;
			var column = split[0];
			var variable = $(this).parents('.wrapper').data(column.toLowerCase());
			var value = split[1];
			if (variable === value) {
				$(this).addClass(klass);
			}
		});
	};

	awtble.change_controler_text = function(whichController, text) {
		awtble.controllerDefinitions[whichController] = text;
	};

/*
	This gets called after loading, you should set up your application-specific stuff here
*/
	awtble.main = function (params) {
		awtble.params = params;
		awtble.controllerDefinitions = {};

		if (awtble.params.hasOwnProperty('debug') && awtble.params.debug) {
			debugger;
		}

		awtble.update();

		// Add observers so that we can run update whenever the data in the table changes.
		// The selectors and if statements make it only run once

		// Add an observer to update text whene

		awtble.$container
			.observe('childList subtree', function(record) {
				if (record.addedNodes && record.addedNodes.length == 1 && record.target.className == 'google-visualization-table') {
					if (record.previousSibling == null) {
						awtble.update();
					}
				}
			});

		awtble.$controllers
			.observe('childList subtree', function(record) {
				if (record.target.className == 'google-visualization-controls-categoryfilter-selected') {
					var thisId = $(record.target).parents('.controlers-filters').get(0).id;
					if (awtble.controllerDefinitions.hasOwnProperty(thisId)) {
						$('#'+thisId).find('.charts-menu-button-caption').text(awtble.controllerDefinitions[thisId]);
					}
				}
		});

		// Clicking on the triangle causes an update that isn't triggered by above
		$(document).on('click', 'th.google-visualization-table-th', function () {awtble.update()});

	}


}(this.awtble));

this.awtble.app();
