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

awtble.updateComment = function(commentUrl, prefill) {
	awtble.commentUrl = commentUrl;
	awtble.commentPrefill = prefill;
};

awtble.makeCommentDialog = function(buttonTitle, dialogTitle) {
	awtble.$container.before($('<div/>', {id:"commentDialog", style: "display:none;", title:dialogTitle}));
	$('#commentDialog').dialog({
		autoOpen:false, 
		height:700, 
		width:"90%", 
		modal:true, 
		draggable:false,
		show:"fadeIn",
		position: { my: 'top', at: 'top+15' },
		close: function (event, ui) {
			$('#commentDialog > iframe').detach();
			window.location.reload();
		}
	});

	$('button.comment-button').on('click', function (e) { // button.comment-button
		var uniqueId = $(this).parents('.wrapper').data('z');

		// Add prefill information to the source
		var src = awtble.commentUrl + '?' + awtble.commentPrefill + '=' + uniqueId;
		var iframe = $('<iframe/>', {id:'commentIframe', src:awtble.commentUrl, src:src, height:"100%", width:"100%", frameborder: 0, marginheight:0, text:'Loading…'});
		$("#commentDialog").append(iframe);
		$('#commentDialog').dialog("open");
	});

};

/* 
	This gets called every time something changes in the awesometable.
	Also called upon load (via main)
	It basically looks at the template information and adjusts the content accordingly
*/ 
function update() {

	awtble.makeCommentDialog('New Comment', "Enter a new comment");

	$('*[column]').each(function (item) { 
		var value = $(this).parents('.wrapper').data( $(this).attr('column') );
		if ($(this).attr('attr')) {
			var attr = $(this).attr('attr');
			$(this).attr(attr, value);
		} else if ($(this).attr('paragraphs') === "") {
			// convert value to html-friendly paragraphs
			// with more and less button if there are a large amount of them
			// TODO: less button (if needed?)
			var newValue = $("<div/>");
			if (value.split('\n').length > 3) {
				value.split('\n').forEach(function (iValue, ii, aa) {
					if (newValue) newValue.append($('<p/>', {text:iValue, class:'paragraph' + (ii <=2 ? ' first' : '')}));
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
				if (value === "" || value == "#ERROR") {
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

}

/*
	This gets called after loading, you should set up your application-specific stuff here
*/
function main(params) {
	awtble.definePrefill(params.prefill);
	awtble.updateUrl(params.formUrl);
	awtble.updateComment(params.commentUrl, params.commentPrefill);
	awtble.makeNewButton('Add New', "Enter a new item");
	awtble.makeReloadButton();

	$('#controlers0').find('.charts-menu-button-caption').text("Filter by kind");
	$('#controlers1').find('input')
		.addClass('studentSearch')
		.attr('placeholder', "Type to filter by Student");
	awtble.moveStringFilterToFront($('#controlers1'));
	$('#controlers2').find	('.charts-menu-button-caption').text("Filter by grade");

	update();

	// Add an observer so that we can run update whenever the data in the table changes.
	// The selectors and if statements make it only run once
	// TODO: Figure out a better way
	$('#controlersPanel')
		.observe('childList subtree', function(record) {
			if (record.target.className == 'google-visualization-controls-categoryfilter-selected') {
				switch ($(record.target).parents('.controlers-filters').get(0).id) {
					case 'controlers0':
						$('#controlers0').find('.charts-menu-button-caption').text("Filter by kind");
						break;
					case 'controlers2':
						$('#controlers2').find	('.charts-menu-button-caption').text("Filter by grade");
						break;
				}
			}
	});

	$(awtble.$container)
		.observe('childList subtree', function(record) {
			if (record.addedNodes && record.addedNodes.length == 1 && record.target.className == 'google-visualization-table') {
				if (record.previousSibling == null) {
					update();
				}
			}
		});
}
