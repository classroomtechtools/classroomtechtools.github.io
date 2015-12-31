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

	awtble.controllers.didChange(thisId) {
		awtble.controllers.changeDropdownControllerText(thisId, awtble.controllerDefinitions[thisId]);
	};

	awtble.controllers.makeControllerLeftmost = function(controller) {
		$(controller).detach().prependTo(awtble.$controllers);
	};

	awtble.controllers.changeDropdownControllerText = function(controllerId, text) {
		$(controllerId).find('.charts-menu-button-caption').text(text);		
	};

	/*
		@param {controllerId} The string id (not the jquery selector) of the controller, i.e. 'controller0'
	*/
	awtble.controllers.fixDropdownControllerText = function(controllerId, text) {
		awtble.controllers.changeDropdownControllerText(controllerId, text);
		awtble.controllerDefinitions[controllerId] = text;
	};

	awtble.buttons = {}; // routines that have to do with making buttons

	/* 
		@param {formUrl} The bare url of the form, no extras
		@param {buttonTitle} The Title of the button, i.e. "Add New"
		@param {dialogTitle} The title of the dialog, i.e. "Add a New Entry"

		Adds a "Add New" button at the top of the awesometable
		Useful for linking a Google form in the frontend itself
	*/
	awtble.buttons.newButtonWithEmbeddedForm = function(formUrl, buttonTitle, dialogTitle) {
		awtble.$topContainer.append($('<button/>', {id:'newButton', text:buttonTitle}));
		awtble.$topContainer.append($('<div/>', {id:"addNewDialog", style: "display:none;", title:dialogTitle}));
		$("#addNewDialog").append($('<iframe/>', {src:formUrl, height:"100%", width:"100%", frameborder: 0, marginheight:0, text:'Loading…'}));
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
				// Take out the iframe, and refresh the browswer
				$('#addNewDialog > iframe').detach();
				window.location.reload();
			}
		});
		$('#newButton').click(function() {
			$('#addNewDialog').dialog("open");
		});
	}

	awtble.buttons.makeReloadButton = function() {
		awtble.$topContainer.append($('<button/>', {id:'refreshButton', text:"Refresh"}).button({icons:{primary:'ui-icon-refresh'}}));	
		$('#refreshButton').click(function () {
			window.location.reload();
		});
	}

	awtble.url = {};   // routines that help us with URLS

	awtble.url.urlPrefillEmbed = function(url, prefill) {
		return awtble.url.makeEmbedded(url +'/viewform?' + awtble.url.extractPrefill(prefill));
	}

	/* 
		Accept the url from prefill provided by Google and reduce it to the minimal
	*/
	awtble.url.extractPrefill = function(prefillUrl) {
		// Take the raw prefill Url and extract just the bits we want
		// So we have a 'prefillPhrase'
		return prefillUrl.match(/entry.*$/)[0].split('&').reduce(function (obj, value, index) {
			s = value.split('=');
			if (s.length>1) obj.push(s);
			return obj;
		}, []).map(function (v, i, arr) {
			return v.join('=');
		}).join('&');
	}

	/* 
		Make an url a embedded one
	*/
	awtble.url.makeEmbedded = function(url) {
		return url + '&embedded=true#start=embed';
	}

	awtble.comments = {};     // app-specific stuff

	awtble.comments.setComment = function(commentUrl, prefill) {
		awtble.commentUrl = commentUrl;
		awtble.commentPrefill = prefill;
	};

	awtble.comments.makeCommentDialog = function(buttonTitle, dialogTitle) {
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

	//awtble.parentMain = awtble.main;

	awtble.main = function (params) {
		//awtble.parentMain(params);   // Let it set up as normal
		awtble.Prototype.main.call(params);
		awtble.controllerDefinitions = {};

		var form = awtble.url.urlPrefillEmbed(params.formUrl, params.prefill);

		awtble.comments.setComment(params.commentUrl, params.commentPrefill);
		awtble.buttons.newButtonWithEmbeddedForm(form, 'Add New', "Enter a new item");
		awtble.buttons.makeReloadButton();

		awtble.controllers.fixDropdownControllerText('#controlers0', 'Filter by kind');
		awtble.controllers.fixDropdownControllerText('#controlers2', 'Filter by grade');
		awtble.controllers.makeControllerLeftmost('#controlers1');

		// This is just a one-time operation:
		$('#controlers1').find('input')
			.addClass('studentSearch')
			.attr('placeholder', "Type to filter by Student");
	};

	awtble.parentUpdate = awtble.update;

	awtble.update = function () {
		awtble.comments.makeCommentDialog('New Comment', "Enter a new comment");
		awtble.parentUpdate();
	};


}(this.awtble));




