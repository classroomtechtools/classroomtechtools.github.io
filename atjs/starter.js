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
	Use this to add custom application-specific logic to your awesometable
*/

(function (atjs) {

	// Save the main function in a different variable, to be called later
	// ahem, "cheap inheritance"

	atjs.parentStart = atjs.start;

	atjs.start = function (params) {
		atjs.parentStart(params);   // Let awesometable load up as normal

		// Set up things as you need them to be set up, using the params object
		// You can edit the <script> content to pass information to that params object
	};

	atjs.parentUpdate = atjs.update;

	atjs.update = function () {
		atjs.parentUpdate();  // calls the default handler

		// Do whatever else you need to do here.
	};

	atjs.controllers.didChange = function (id) {
		// Lets you know if content of the controllers have changed
		// No need to call the default handler
	}


}(this.atjs));
