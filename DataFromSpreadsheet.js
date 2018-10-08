/**
 * DataFromSpreadsheet: Read in Spreadsheet info for a Calculated Datasource in AppMaker. Use a spreadsheet to define a datasource.
 * 
 * @param {object} options
 * @param {string} options.spreadsheetId The ID of the target spreadsheet
 * @param {string} options.sheetName The name of the target sheet
 * @returns {any}
 */
function DataFromSpreadsheet(options) {
  var ss, sheet, data;
  
  // Here we are preparing the default options available to this function
  // You can just manually put the ID in order to simply calling it from the datasources
  options = options || {};
  if (!options.spreadsheetId) throw Error("No spreadsheet ID provided in options");
  if (!options.sheetName) throw Error("No spreadsheet name provided in options");
  options.numHeaders = options.numHeaders || 1;
  //

  // Read in the spreadsheet document into ss variable using Google's APIs
  // If this fails, an error will appear in the console (error automatically thrown)
  ss = SpreadsheetApp.openById(options.spreadsheetId);
  //
  
  // Let's get the sheet we are looking for
  // If this failes, we manually throw an error which will apear in the console
  sheet = ss.getSheetByName(options.sheetName);
  if (!sheet) throw Error("No sheet by name of " + options.sheetName);
  //   

  // Before we start reading in, force the spreadsheet to recalc, so that any random numbers are truly random
  sheet.getRange(1, 1).setValue(sheet.getRange(1, 1).getValue());
  SpreadsheetApp.flush();
  //
  
  // Read in the raw data from the chosen sheet
  // We will loop through this in order to derive the correct return values
  data = sheet.getDataRange().getValues();
  // 

  // The LOOP. Not including the header, we step through each row of the data
  //           ensuring that we compile a record object that has the appropriate values
  //           The javascript function Array.reduce is used to efficiently loop through
  return data.slice(options.numHeaders).reduce(
    function (acc, row, index) {
      var model, record, ok;
      
      // We have to use the model as given in AppMaker's server-side API framework
      // The variable 'app' is provided to us by that framework
      model = app.models[options.sheetName];
      if (!model) throw Error("No datasource with name " + options.sheetName);
      //
      
      // Use the server-side API to make a new, blank record that we will fill in the inner loop
      record = model.newRecord();
      //
      
      // The inner loop. Go through each item in the row (value) to set the info
      // We use javascript's Array.every to loop as it can short circuit if an unexpected error occurs
      ok = row.every(function (value, index) {
        var header;
        header = data[0][index];  // get the header by reading the first row

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
