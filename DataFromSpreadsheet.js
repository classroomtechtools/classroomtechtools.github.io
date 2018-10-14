/**
 * DataFromSpreadsheet: Read in Spreadsheet info for a Calculated Datasource in AppMaker. Use a spreadsheet to define a datasource.
 * 
 * @param {object} params
 * @param {string} params.spreadsheetId The ID of the source spreadsheet
 * @param {string} params.sheetName The name of the source sheet
 * @param {string} params.datasource The name of the target datasource
 * @param {number} params.numHeaders How many rows are headers (default = 1)
 * @param {number} params.headerRow Which row contains the name of the field (default=params.numHeaders-1)
 * @param {bool} params.recalc True if the spreadsheet should be to be recalculated (randomized) on each read in (default=False)
 * @returns {any}
 * 
(C) Released as Open Source (MIT)
Copyright 2018 Adam Morris classroomtechtools.ctt@gmail.com

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */
function DataFromSpreadsheet(params) {
  var ss, sheet, data, model;
  
  // Here we are preparing the default params available to this function
  // You can just manually put the ID in order to simply calling it from the datasources
  params = params || {};
  if (!params.spreadsheetId) throw Error("No spreadsheet ID provided in params");
  if (!params.sheetName) throw Error("No spreadsheet name provided in params");
  params.datasource = params.datasource || params.sheetName;
  params.numHeaders = params.numHeaders || 1;
  params.headerRow = params.headerRow || (params.numHeaders-1);
  params.recalc = params.recalc || false;
  //

  // Read in the spreadsheet document into ss variable using Google's APIs
  // If this fails, an error will appear in the console (error automatically thrown)
  ss = SpreadsheetApp.openById(params.spreadsheetId);
  //
  
  // Let's get the sheet we are looking for
  // If this failes, we manually throw an error which will apear in the console
  sheet = ss.getSheetByName(params.sheetName);
  if (!sheet) throw Error("No sheet by name of " + params.sheetName);
  //   

  // Before we start reading in, force the spreadsheet to recalc, so if we use any random numbers 
  // they are random for each read-in
  if (params.recalc) {
    sheet.getRange(1, 1).setValue(sheet.getRange(1, 1).getValue());
    SpreadsheetApp.flush();
  }
  //
  
  // Read in the raw data from the chosen sheet
  // We will loop through this in order to derive the correct return values
  data = sheet.getDataRange().getValues();
  // 
  
  // We have to use the model as given in AppMaker's server-side API framework
  // The variable 'app' is provided to us by that framework
  model = app.models[params.datasource];
  if (!model) throw Error("No datasource with name " + params.sheetName);
  //

  // The LOOP. Not including the header, we step through each row of the data
  //           ensuring that we compile a record object that has the appropriate values
  //           The javascript function Array.reduce is used to efficiently loop through
  return data.slice(params.numHeaders).reduce(
    function (acc, row, index) {
      var record, ok;
            
      // Use the server-side API to make a new, blank record that we will fill in the inner loop
      record = model.newRecord();
      //
      
      // The inner loop. Go through each item in the row (value) to set the info
      // We use javascript's Array.every to loop as it can short circuit if an unexpected error occurs
      ok = row.every(function (value, index) {
        var header;
        header = data[params.headerRow][index];  // get the header by reading the first row
        try {
          record[header] = value;
        } catch (e) {
          console.log(e.message);   // print message
          return false;
        }
        return true;
      });
      //

      // Only add it to the array if above says it's okay (no errors occurred while trying)
      if (ok) acc.push(record);
      return acc;
      //
    }, []
  );
}
