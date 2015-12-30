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


(function (awtble) {

    /*
		Called at the start      
    */
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

	awtble.parentMain = awtble.main;

	awtble.main = function (params) {
		awtble.parentMain(params);   // Let it set up as normal

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

	};

	awtble.parentUpdate = awtble.update;

	awtbl.update = function () {
		awtble.makeCommentDialog('New Comment', "Enter a new comment");
		awtble.parentUpdate();
	};


}(this.awtble));




