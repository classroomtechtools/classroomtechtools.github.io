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

}(this.awtble));

this.awtble.app();
