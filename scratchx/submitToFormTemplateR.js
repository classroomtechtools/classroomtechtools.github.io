(function(ext) {
    // Cleanup function when the extension is unloaded
    ext._shutdown = function() {};

    // Status reporting code
    // Use this to report missing hardware, plugin or unsupported browser
    ext._getStatus = function() {
        return {status: 2, msg: 'Ready'};
    };

    // Functions for block with type 'w' will get a callback function as the 
    // final argument. This should be called to indicate that the block can
    // stop waiting.
    ext.submit_name_to_google_form = function(name, callback) {

        $.ajax({
            'url': 'https://docs.google.com/a/igbis.edu.my/forms/d/e/1FAIpQLSdIdVqYsDNuWuSMjBYZk2owBmiXiyVk_PUhOyrlF47gCn24-g/formResponse',
            data: {'entry.1841900870': name},
            dataType: 'jsonp',
            success: function(result) {
                callback("done")
            }
        })
    };

    // Block and block menu descriptions
    var descriptor = {
        blocks: [
            ['R', 'submit to google form', 'submit_name_to_google_form', "Nope"],
        ]
    };

    // Register the extension
    ScratchExtensions.register('Charlie\'s Bday Party', descriptor, ext);
})({});