function initNotices() {
    "use strict";

    console.log('Notices JS version 201601010245');

    if (typeof $ === 'undefined') {
        console.log("jQuery is not loaded.");
        return;
    }

    var profileUrl = $('header .usermenu span:contains("Profile")').closest('a').attr('href');
    if (!profileUrl) {
        alert("Alert ClassroomTechTools, problem with discovering the current user!");
        return;
    }

    // Get userID from profile URL
    var userId = profileUrl.match(/[0-9]+$/)[0];
    userId = parseInt(userId);

    /* global adminUserIdList */

    var administrator = adminUserIdList.indexOf(userId) !== -1;
    if (administrator) {
        console.log("Detected admin");
    }

    console.log(userId, adminUserIdList, administrator);

    var titleMaxChars, contentMaxChars, daysConsecutive;

    if (!administrator) {

        // remove sticky, _0 it if is the first item
        $('#field_330_0').css('display', 'none');
        $('label[for="field_330_0"]').css('display', 'none').next().css('display', 'none');

        titleMaxChars = 30;
        contentMaxChars = 140;
        daysConsecutive = 2;
    } else {
        titleMaxChars = 50;
        contentMaxChars = 200;
        daysConsecutive = 10;
    }

    // Form elements
    var $startDateField = $('#field_332');
    var $endDateField = $('#field_333');
    var $noticeForm = $startDateField.closest('form');


    var startDates = [];
    $startDateField.children('option').each(function (index, item) {
        startDates.push(item.text);
    });
    console.log(startDates);

    // Set the maximum end date when the start date changes
    $startDateField.on('change', function () {
        var newValue = this.value;

        var startDateIndex = startDates.indexOf(newValue);
        if (startDateIndex === -1) {
            alert("Cannot find startDateIndex " + newValue + "!");
        }
        console.log("Where: " + startDateIndex);

        // Remove existing end dates
        $endDateField.empty();

        var until = Math.min(daysConsecutive + startDateIndex, startDates.length);

        console.log("Until: " + until);
        for (var f = startDateIndex; f < until; f++) {
            var v = startDates[f];

            var item;
            if (f === startDateIndex) {
                item = $('<option/>', {value: v, text: v, selected: "selected"});
            } else {
                item = $('<option/>', {value: v, text: v});
            }

            $endDateField.append(item);
        }
    });

    // First add the input elements that we will feed to the Full Content textarea
    var content = $('#ctt-input');

    // Title input
    content.append($('<div><label for="ctt-title" class="ctt-label">Title:</label> (<span id="ctt-title-counter"></span> characters remaining)</div>'));
    content.append($('<input/>', {id: 'ctt-title', class: 'ctt-css-input'}));

    $('#ctt-title').simplyCountable({
        counter: '#ctt-title-counter',
        countType: 'characters',
        maxCount: titleMaxChars
    });

    // Content input
    content.append($('<div><label for="ctt-content" class="ctt-label">Content:</label> (<span id="ctt-content-counter"></span> characters remaining)</div>'));
    content.append($('<textarea/>', {id: 'ctt-content', class: 'ctt-css-input', rows: 3}));

    $('#ctt-content').simplyCountable({
        counter: '#ctt-content-counter',
        countType: 'characters',
        maxCount: contentMaxChars
    });

    // Link input
    content.append($('<div><label for="ctt-link" class="ctt-label">Link:</label> (Optional. A "Read More" will appear at end of notice linking to this URL)</div>'));
    content.append($('<input/>', {id: 'ctt-link', class: 'ctt-css-input'}));

    $noticeForm.on('submit', function (e) {

        var moreLink = $('#ctt-link').val();
        if (moreLink) {
            moreLink = ' <a href="' + moreLink + '" target="_blank">[Read More...]</a>';
        } else {
            moreLink = '';
        }

        var title = $("#ctt-title").val();
        var content = $("#ctt-content").val();

        // Check notice is not over the length limit
        if ((title + content).length > titleMaxChars + contentMaxChars) {
            alert("Notice is still over the character limit!");
            e.preventDefault();
            return false;
        }

        // Combine the text and content into a hidden field
        var concatValue = '<strong>' + title + '</strong>: ' + content + moreLink;
        $('#field_328').val(concatValue);

        // Continue submitting form
    });

}
