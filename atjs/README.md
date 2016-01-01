#atjs for Awesome Table

A tool and javascript "framework" when used in conjunction with Awesome Table turns a Google Site into a full-fledged web application.

…by [Classroom Tech Tools](http://classroomtechtools.com)

If you are already familiar with [Awesome Table](https://sites.google.com/site/scriptsexamples/available-web-apps/awesome-tables), **atjs** just gives new meaning to the `<script>` information that is defined in the template. Instead of writing the javascript right there in the Google Sheet, we are able to write javascript in an external javascript file. We are also able to load dependencies. In other words, we can bring in front-end development tools and extend our Awesome Table to do the sorts of things that any web app can do.

If you are not already familiar with [Awesome Table](https://sites.google.com/site/scriptsexamples/available-web-apps/awesome-tables), Awesome Table is a google gadget plugin that works with Google Sites, which makes the Google Site the visual frontend, and uses Google Sheets as the backend for its data. By using some of the more advanced features, which are known as row-level permissions proxy and templating, you can display different content depending on the user.

Like I said, it turns Google Sites into a web app.

The code is released into the public domain, "as is".

##Instructions:

* Create a site with Awesome Table, using the template and script feature, the usual way
* Template area _must_ have a `<script>` header
* Configure the awesometable to use the proxy, provided below (copy and paste, and deploy as web app)

###Proxy

You need to put the contents of the link below into your domain as a web app, and deploy. None of the below will work unless this is done:

* https://github.com/classroomtechtools/classroomtechtools.github.io/blob/master/atjs/proxy.gs

###Contents of `<script>` in Template sheet:

It can be left blank, in which case you get the default behaviour, which may be all that you want, but in any case the template must define the `<script>` header and have no content. It can optionally have content, but has to be a valid json object. From now on, we will refer to this content as "the json object". There are two properties ("load", and "params") that has specific meaning, see below. (Or just skip to the "Template" section to view the default behaviours you gain.)

####Import other javascript libraries and dependencies
If your json object has a `load` object defined, it must be an array of strings, which represent external javascript and css files that are loaded sequentially, in that order. For example, if you wanted to use the popular (Font Awesome)[http://fontawesome.io/] icons in your awesometable (and why wouldn't you?), you could just do this:

```js
{
  "load": [
    "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.5.0/css/font-awesome.css"
  ]
}
```

and follow the instructions on their website to get really great-looking icons.

For your reference, if you do not define any load property in your json object, or even if you do, there are already some javascript tools that are imported, and the list is below:

```
The following are brought in by the atjs proxy:

https://ajax.googleapis.com/ajax/libs/jquery/2.1.4/jquery.min.js
https://classroomtechtools.github.io/jquery-observe/jquery-observe.js
https://classroomtechtools.github.io/atjs/atjs.js
```

####Application-specific logic

Further, if you want to have some very specific behaviour that you would like to add to your Awesome Table, for example, adding a click handler to a button that opens a dialog box for example, you can write an javascript file that is hosted by a service such as Github Pages, and include that. That file will have to be written with a specific template, however, so we have provided a [starter file](https://github.com/classroomtechtools/classroomtechtools.github.io/blob/master/atjs/starter.js) to get you started. (Some programming experience is useful.)

Optionally, you can define a `params` object filled with inforamtion that is passed to the atjs.start() function.

#####Get started
Here is an example of a `<script>` header content that will use the starter file, and will exit to the browser's debugger.

```js
{
  "params": {
    "debug": true
  },
  "load": [
    "https://classroomtechtools.github.io/atjs/starter.js"
  ]
}
```

####Nuts 'n' Bolts
The proxy, in addition to retrieving the information from the spreadsheet, is responsible for setting up the page to make it easy to design a web app. That involves two things:

* It wraps a wrapper around each row's html, and places the content of each column into data- attribute. 
* It reads in any content in the `<script>` section of the template and injects javascript code into the rendered page so that it imports the declared javascript code
* The injected code loads up the declared javascript and css files, waits until the DOM is ready, and then launches the app's `start` function.

Basically, it gives the `<script>` content of the template a whole new meaning.

For your reference, the code that gets executed as described above is the following:

```js
(function() {
    
    [...].forEach(function(src, index, arr) {
      var tag = undefined;
      if (src.endsWith('.js')) {
        tag = document.createElement('script');
        tag.src = src;
        tag.async = false;
      } else if (src.endsWith('.css')) {
        tag = document.createElement('link');
        tag.rel = "stylesheet";
        tag.href = src;
      }
      if (index === (arr.length-1)) {
          tag.onload = function () {
              $(function () {
                atjs.start(...);
              });
          };
      }

      document.head.appendChild(tag);

    });

})();
```

The first ellipsis (...) is replaced by the external javascript and css files, specified in the `load` property. The second elipsis is reaplced by the contents of the `params` property.

###Template

No matter how you define your `<script>` header, you get some default behaviour, including the ability to write template code in a different way. For example, you can use a `column="x"` attribute on any tag in order to place the contents that is in column x to the content of that tag.

You can use the `onlyif="x=XXX"` to tell it to display "only if" the column x is equal to XXX.

You can use `classif="klass x=XXX"` to tell it to add the class 'klass' if column x is equal to XXX.

You can use the `paragraphs` attribute to flag the fact that the contents of this tag are a sequence of paragraphs (denoted by return characters), and to format it with a `<p>` tag.

Here is some markup that uses all of these features.

```html
<div column="n" class="label"></div>
<div column="o"></div>
<div column="a"></div>
<div class="spacer"></div>
<div class="kindIcon" onlyif="d=Praise"><i class="fa fa-5x fa-thumbs-up"></i></div>
<div class="kindIcon" onlyif="d=Flag"><i class="fa fa-5x fa-flag"></i></div>
<div class="kindIcon" onlyif="d=Email Teachers"><i class="fa fa-5x fa-envelope-o"></i></div>
<div class="kindIcon" onlyif="d=Email Parents"><i class="fa fa-5x fa-envelope-square"></i></div>
<div class="spacer"></div>
<div>"<span column="g"></span>"</div>
<div class="spacer"></div>
<div>
   <span column="s" attr="title"><i class="fa fa-2x fa-eye"></i></span>&nbsp;
   <!-- <span column="t" attr="title"><i class="fa fa-2x fa-pencil"></i></span> -->
</div>
<div class="siderow" onlyif="d=Praise">
    <div column="h" paragraphs></div>
    <div>(<span column ="x"></span>)</div>
</div>
<div class="siderow" onlyif="d=Flag">
    <div column="h" paragraphs></div>
    <div>(<span column ="x"></span>)</div>
</div>
<div class="siderow" onlyif="d=Email Teachers">
    <div column="h" paragraphs></div>
    <div>(<span column ="x"></span>)</div>
</div>
<div class="siderow" onlyif="d=Email Parents">
    <div><span class="label">Subject: </span><span column="j"></span></div>
    <div class="spacer"></div>
    <div column="l" paragraphs></div>
</div>
</div>
```
