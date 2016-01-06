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
    Alternative proxy for awesometables
*/

// You should set these to what makes sense to you
var TIMEZONE = "GMT";  // or GMT+8 or whatever 
var COMMONDOMAIN = '';
// Don't adjust the below, unless you really know what you are doing
// This is the javascript that is injected into the awesometable upon load, and loads up the external javascript files
var JS = '!function(){["%s"].forEach(function(e,s,a){var t=void 0;e.endsWith(".js")?(t=document.createElement("script"),t.src=e,t.async=!1):e.endsWith(".css")&&(t=document.createElement("link"),t.rel="stylesheet",t.href=e),s===a.length-1&&(t.onload=function(){atjs.start(%s)}),document.head.appendChild(t)})}();';
var AUTOLOADLIBS = ["https://ajax.googleapis.com/ajax/libs/jquery/2.1.4/jquery.min.js","https://ajax.googleapis.com/ajax/libs/jqueryui/1.11.4/jquery-ui.min.js","https://brainysmurf.github.io/jquery-observe/jquery-observe.js","https://classroomtechtools.github.io/awesometables/atjs.css","https://classroomtechtools.github.io/awesometables/atjs.js"];
// set SORT to null if you don't want the proxy to sort for you
// If you instruct the proxy to sort by timestamp column, you get "latest entries on top" like a blog, example:
//var SORT = {
//  "index": 0,  // index of the column, where zero = column A
//};
var SORT = null;

Date.prototype.formatted = function(tmz) {
    var d = this.getDate();  // day of the month
    var ordinal = null;
    if(d>3 && d<21) ordinal = 'th';  // from 4 to 20, including teens
    if (!ordinal) {
      switch (d % 10) {
          case 1:  ordinal = "st";
          case 2:  ordinal = "nd";
          case 3:  ordinal = "rd";
          default: ordinal = "th";
          }
    }
    // Refer to here to change for the exact formatting http://docs.oracle.com/javase/7/docs/api/java/text/SimpleDateFormat.html
    // Single quotes around the %s avoids interpretation and are required for the call to formatString
    var ret = Utilities.formatDate(this, tmz, "EE MMM d'%s' yyyy @ hh:mm a");
    return Utilities.formatString(ret, ordinal);
};

/*
    Convenient testing function
*/
function test_doGet() {
  var e = {};
  e.parameter = {};
  e.parameters = {};
  e.parameter.url = "https://docs.google.com/spreadsheets/d/1f0kyT8Rdb-45vwr3M4gK5VyC3-7PQJtk88yy1I0xXlI/edit"; // url of the spreadsheet
  e.parameter.sheet = 'Data';  // sheet with the data
  e.parameter.range = 'A:Z';  // the range in the sheet
  e.parameter.templateSheet = 'Template';  // Name of the template 
  e.parameter.templateRange = 'A1:C2';    
  e.parameters.callback = 'callback';   // This does nothing
  //doGet(e);
  Logger.log(doGet(e).getContent());
}

function doGet(e) {
  var currentUserEmail = Session.getActiveUser().getEmail().toLowerCase();
  var currentUser = null;
  if (COMMONDOMAIN) currentUser = currentUserEmail.replace('@'+COMMONDOMAIN, '');
  else currentUser = currentUserEmail;
  var ssUrl =  e.parameter.url;
  var sheetName = e.parameter.sheet;
  var a1Notation = e.parameter.range;
  var sps = SpreadsheetApp.openByUrl(ssUrl);
  var sheet = sps.getSheetByName(sheetName);
  var range = sheet.getRange(a1Notation);
  var data = range.getValues();
  // sort the data if needed
  if (SORT && SORT.hasOwnProperty('index')) {
    if (SORT.index) index = SORT.index;
    else index = 0;
    var headers = data[0];
    data = data.splice(1).sort(function (a, b) {
      return a[index] > b[index] ? -1 : a[index] < b[index] ? 1 : 0;
    });
    data.splice(0, 0, headers);  // insert back into it
  }
  var dt = {cols:[], rows:[]};
  var permissionsCol = null;
  var firstCol = range.getColumn();
  for(var i = 0; i < data[0].length; i++) {
    if(data[1][i].indexOf('Permissions') != -1) permissionsCol = i;
    dt.cols.push({id:numToA(firstCol+i), title:data[0][i], label:data[0][i] + ' ' + data[1][i].replace('Permissions', ''), type: 'string', isNumber:true, isDate:true, isEmpty:true});
  }
  for(var i = 2; i < data.length; i++) {
    if(permissionsCol == null || currentUser != '' && data[i][permissionsCol].toLowerCase().indexOf(currentUser) != -1) {
      var row = [];
      for(var j = 0; j < data[i].length; j++) {
        if(isNaN(data[i][j])) dt.cols[j].isNumber = false;
        if(data[i][j] != '') dt.cols[j].isEmpty = false;
        if(data[i][j] instanceof Date == false) dt.cols[j].isDate = false;
        else if(data[i][j].getFullYear() == 1899) {
          dt.cols[j].isDate = false;
          data[i][j] = data[i][j].getHours()+':'+(data[i][j].getMinutes()<10?'0':'')+data[i][j].getMinutes();
        }
        else {
          data[i][j] = data[i][j].formatted(TIMEZONE);
          dt.cols[j].isDate = false; // not a date anymore, but a string
        }
        row.push({v:escapeQuotes(data[i][j])});
      }
      dt.rows.push({c:row});
    }
  }
  for(var i = 0; i < data[0].length; i++) {
    if(dt.cols[i].isEmpty) dt.cols[i].type = 'string';
    else if(dt.cols[i].isDate) dt.cols[i].type = 'datetime';
    else if(dt.cols[i].isNumber) dt.cols[i].type = 'number';
  }
  if ('templateSheet' in e.parameter) {
    var templateSheet = sps.getSheetByName(e.parameter.templateSheet);
    var templateRange = templateSheet.getRange(e.parameter.templateRange);
    var templateData = templateRange.getValues();
    var tp = {cols:[], rows:[]};
    for(var i = 0; i < templateData[0].length; i++) tp.cols.push({id:i, label:templateData[0][i], type: 'string'});

    // Set up the wrapper, which is applied only at templateData[0][1]
    var dataAttributes = [];
    dt.cols.forEach(function (col, colIndex, _) {
      dataAttributes.push('data-'+colName(colIndex)+'="{{'+col.title+'}}"');
    });

    for(var i = 0; i < templateData.length; i++) {
      var row = [], tData, jsonObj;
      for(var j = 0; j < templateData[i].length; j++) {
        if (i == 1) {
          // Override behaviour on second row
          if (j == 0 && tp.cols[0].label[0] !== '<') {
            tData = '<div class="wrapper" '+dataAttributes.join(" ") + ' data-username="' + currentUserEmail + '">'+ templateData[1][0] +'</div>';
            row.push({v:tData});
          } else if (tp.cols[j].label === '<script>') {
            // On the second row, inside script definition
            try {
              // attempt to parse it as an object
              jsonObj = JSON.parse(templateData[j][i]);
            }
            catch (err) {
              // It didn't parse as an object, so just pass it along
              //row.push({v:templateData[i][j]});
              jsonObj = {params: {}};   // just a plain object
            }              
            if (jsonObj.hasOwnProperty('autoload') && jsonObj.autoload == false) load = [];
            else load = AUTOLOADLIBS;
            if (jsonObj.hasOwnProperty('load') && jsonObj.load) load.push.apply(load, jsonObj.load);
            tData = Utilities.formatString(
              JS, 
              load.join('","'),
              jsonObj.hasOwnProperty("params") ? JSON.stringify(jsonObj.params) : "{}"
            );
            row.push({v:tData});
          } else {
            // In second row, but nothing special
            // here, want to search for {{column-x}} and replace with column names
            row.push({v:templateData[i][j]});
          }
        } else {
          // Not the second row
          row.push({v:templateData[i][j]});
        }
     }
     tp.rows.push({c:row});    
  }
  var output = e.parameters.callback + '(' + JSON.stringify({dataTable: dt,template: tp}) + ')';

  } else {
    var output = e.parameters.callback + '(' + JSON.stringify({dataTable: dt}) + ')';
  }
  return ContentService.createTextOutput(output).setMimeType(ContentService.MimeType.JAVASCRIPT);
}
function numToA(num){
  var a = '',modulo = 0;
  for (var i = 0; i < 6; i++){
    modulo = num % 26;
    if(modulo == 0) {a = 'Z' + a;num = num / 26 - 1;}
    else{a = String.fromCharCode(64 + modulo) + a;num = (num - modulo) / 26;}
    if (num <= 0) break;}
  return a;
}
function escapeQuotes(raw) {
  if (typeof raw === 'string') return raw.replace(/"/g, '&quot;');
  return raw;
}
function colName(n) {
  var ordA = 'a'.charCodeAt(0);
  var ordZ = 'z'.charCodeAt(0);
  var len = ordZ - ordA + 1;
  
  var s = "";
  while(n >= 0) {
    s = String.fromCharCode(n % len + ordA) + s;
    n = Math.floor(n / len) - 1;
  }
  return s;
}
