function main () {
    
console.log("http://www.classroomtechtools.com");

if (!$) {
    alert("Whaddya mean no jquery??");
    return;
}
var user = $('a[href^="https://dragonnet.ssis-suzhou.net/user/profile.php?id="]').attr('href');
if (!user) {
  alert("Alert ClassroomTechTools, problem with discovering the current user!");
  return;
}
var userId = user.match(/[0-9]+$/)[0];  // last few digits at the end
userId = parseFloat(userId);
var administrator = adminUserIdList.indexOf(userId) != -1;
administrator && console.log("Detected admin");
//var administrator = true;

var titleWC, contentWC, daysConsecutive;
if (!administrator) {
    // remove sticky, _0 it if is the first item
    $('#field_336_0').css('display', 'none');
    $('label[for="field_336_0"]').css('display', 'none');
    $('label[for="field_336_0"]').next().css('display', 'none');

    titleWC = 30;
    contentWC = 140;
    daysConsecutive = 2;
} else {
    titleWC = 50;
    contentWC = 200;
    daysConsecutive = 10;
}

var optionList = [];
$('#field_332 > option').each(function (index, item) {
    optionList.push(item.text);
});
console.log(optionList);

// code that adjusts the end date whenever the start date changes
$('#field_332').on('change', function () {
    console.log('change deleted');
    var newValue = this.value;

    var where = optionList.indexOf(newValue);
    if (where == -1) {
        alert("Cannot find where is " + newValue + "!");
    } 
    console.log("Where: " + where);

    $('#field_333').empty();
    var until = daysConsecutive + where;
    if (until > optionList.length) until = optionList.length;
    console.log("Until: " + until);
    for (var f=where; f<until; f++) {
        var v = optionList[f];
        var item;
        if (f == where) item = $('<option/>', {value:v,text:v,selected:"selected"});
        else item = $('<option/>', {value:v, text:v});
        $('#field_333').append(item);
    }

});

// First add the input elements that we will feed to the Full Content textarea
var content = $('#ctt-input');

//title elements
content.append($('<div><span class="ctt-label">Title</span> (<span id="ctt-title-counter"></span> characters remaining)</div>'));
content.append($('<input/>', {id:'ctt-title', class: 'ctt-css-input'}));

// content elements
content.append($('<div><span class="ctt-label">Content</span> (<span id="ctt-content-counter"></span> characters remaining)</div>'));
content.append($('<textarea/>', {id:'ctt-content', class: 'ctt-css-input', rows:3}));

// link elements
content.append($('<div><span class="ctt-label">Link</span> (optional, will appear at end of notice)</div>'));
content.append($('<input/>', {id:'ctt-link', class: 'ctt-css-input'}));

$('#ctt-title').simplyCountable({
    counter:'#ctt-title-counter',
    countType:'characters',
    maxCount: titleWC,
});

$('#ctt-content').simplyCountable({
    counter:'#ctt-content-counter',
    countType:'characters',
    maxCount: contentWC,
});


$('input[type="submit"]').click(function (e) {
    var moreLink = $('#ctt-link').val();
    if (moreLink) {
        moreLink = ' <a href="'+ moreLink + '">' + '[more...]' + '</a>';
    } else {
        moreLink = '';
    }

    if (($("#ctt-title").val() + $("#ctt-content").val()).length <= titleWC + contentWC) {
        var concatValue = '<b>' + $("#ctt-title").val() + '</b>: ' + $('#ctt-content').val() + moreLink;
        $('#field_334').val(concatValue);
    } else {
        alert("Notice is still over the character limit!")
        e.preventDefault();
    }
});

}