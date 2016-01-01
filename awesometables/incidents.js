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


(function (atjs) {

	atjs.controllers.didChange = function(thisId) {
		if (this.controllerDefinitions.hasOwnProperty(thisId)) {
			this.controllers.changeDropdownControllerText(thisId, this.controllerDefinitions[thisId]);
		}
	};

	atjs.controllers.makeControllerLeftmost = function(controller) {
		$(controller).detach().prependTo(this.$controllers);
	};

	atjs.controllers.changeDropdownControllerText = function(controllerId, text) {
		$(controllerId).find('.charts-menu-button-caption').text(text);		
	};

	/*
		@param {controllerId} The string id (not the jquery selector) of the controller, i.e. 'controller0'
	*/
	atjs.controllers.fixDropdownControllerText = function(controllerId, text) {
		this.controllers.changeDropdownControllerText(controllerId, text);
		this.controllerDefinitions[controllerId] = text;
	};

	atjs.buttons = {}; // routines that have to do with making buttons

	/* 
		@param {formUrl} The bare url of the form, no extras
		@param {buttonTitle} The Title of the button, i.e. "Add New"
		@param {dialogTitle} The title of the dialog, i.e. "Add a New Entry"

		Adds a "Add New" button at the top of the awesometable
		Useful for linking a Google form in the frontend itself
	*/
	atjs.buttons.newButtonWithEmbeddedForm = function(formUrl, buttonTitle, dialogTitle) {
		this.$topContainer.append($('<button/>', {id:'newButton', text:buttonTitle}));
		this.$topContainer.append($('<div/>', {id:"addNewDialog", style: "display:none;", title:dialogTitle}));
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

	atjs.buttons.makeReloadButton = function() {
		this.$topContainer.append($('<button/>', {id:'refreshButton', text:"Refresh"}).button({icons:{primary:'ui-icon-refresh'}}));	
		$('#refreshButton').click(function () {
			window.location.reload();
		});
	}

	atjs.url = {};   // routines that help us with URLS

	atjs.url.urlPrefillEmbed = function(url, prefill) {
		return this.url.makeEmbedded(url +'/viewform?' + this.url.extractPrefill(prefill));
	}

	/* 
		Accept the url from prefill provided by Google and reduce it to the minimal
	*/
	atjs.url.extractPrefill = function(prefillUrl) {
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
	atjs.url.makeEmbedded = function(url) {
		return url + '&embedded=true#start=embed';
	}

	atjs.comments = {};     // app-specific stuff

	atjs.comments.setComment = function(commentUrl, prefill) {
		this.commentUrl = commentUrl;
		this.commentPrefill = prefill;
	};

	atjs.comments.makeCommentDialog = function(buttonTitle, dialogTitle) {
		this.$container.before($('<div/>', {id:"commentDialog", style: "display:none;", title:dialogTitle}));
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
			var src = atjs.commentUrl + '?' + this.commentPrefill + '=' + uniqueId;
			var iframe = $('<iframe/>', {id:'commentIframe', src:this.commentUrl, src:src, height:"100%", width:"100%", frameborder: 0, marginheight:0, text:'Loading…'});
			$("#commentDialog").append(iframe);
			$('#commentDialog').dialog("open");
		});

	};

	atjs.parentStart = atjs.start;

	atjs.main = function (params) {
		atjs.parentStart(params);   // Let it set up as normal
		this.controllerDefinitions = {};

		var form = this.url.urlPrefillEmbed(params.formUrl, params.prefill);

		this.comments.setComment(params.commentUrl, params.commentPrefill);
		this.buttons.newButtonWithEmbeddedForm(form, 'Add New', "Enter a new item");
		this.buttons.makeReloadButton();

		this.controllers.fixDropdownControllerText('#controlers0', 'Filter by kind');
		this.controllers.fixDropdownControllerText('#controlers2', 'Filter by grade');
		this.controllers.makeControllerLeftmost('#controlers1');

		// This is just a one-time operation:
		$('#controlers1').find('input')
			.addClass('studentSearch')
			.attr('placeholder', "Type to filter by Student");
	};

	atjs.parentUpdate = atjs.update;

	atjs.update = function () {
		this.comments.makeCommentDialog('New Comment', "Enter a new comment");
		this.parentUpdate();
	};


}(this.atjs));




