#atjs for Awesome Table

A tool and javascript "framework" when used in conjunction with Awesome Table turns a Google Site into a full-fledged web application.

…by [Classroom Tech Tools](http://classroomtechtools.com)

If you are already familiar with [Awesome Table](https://sites.google.com/site/scriptsexamples/available-web-apps/awesome-tables), atjs just gives new meaning to the `<script>` information that is defined in the template. Instead of writing the javascript right there in the Google Sheet, we are able to write javascript in an external javascript file. We are also able to load dependencies. In other words, we can bring in front-end development tools and extend our Awesome Table to do the sorts of things that any web app can do.

The code is released into the public domain, "as is".

##Instructions:

* Create a site with Awesome Table, using the template and script feature, the usual way
* Template area _must_ have a `<script>` header
* Configure the awesometable to use the proxy, provided below (copy and paste, and deploy as web app)

###Proxy

You need to put the contents of the link below into your domain as a web app, and deploy. None of the below will work unless this is done:

* https://github.com/classroomtechtools/classroomtechtools.github.io/blob/master/awesometables/proxy.gs

The way it works is that it injects special javascript that gives the `<script>` content of the template a whole new meaning.

###Contents of `<script>` in Template sheet:

It can be left blank, in which case you get the default behaviour, which may be all that you want, but in any case the template must define the `<script>` header and have no content. It can optionally have content, but has to be a valid json object. There are two properties ("load", and "params") that can be placed into this area that has specific meaning, see below. (Or just skip to the "Template" section to view the default behaviours you gain.)

####Import other javascript libraries and dependencies
If your json object has a `load` object defined, it must be an array of strings, which represent external javascript and css files that are loaded sequentially, in that order. For example, if you wanted to use the popular fontawesome.io icons in your awesometable (and why wouldn't you?), you could just do this:

```js
{
  "load": [
    "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.5.0/css/font-awesome.css"
  ]
}
```

and follow the instructions on their website to get really great-looking icons.

For your reference, if you do not define any content in the `<script>` tag, this is the default behaviour. It loads up jquery and other common tools that are used, including underscore. The jquery-observe library is required in the 

{
  "load": [
    "https:\/\/ajax.googleapis.com\/ajax\/libs\/jquery\/2.1.4\/jquery.min.js",
    "https:\/\/ajax.googleapis.com\/ajax\/libs\/jqueryui\/1.11.4\/jquery-ui.min.js",
    "https:\/\/brainysmurf.github.io\/jquery-observe\/jquery-observe.js",
    "https:\/\/cdnjs.cloudflare.com\/ajax\/libs\/underscore.js\/1.8.3\/underscore-min.js",
    "https:\/\/classroomtechtools.github.io\/awesometables\/awtble.css",
    "https:\/\/classroomtechtools.github.io\/awesometables\/awtble.js"
  ]
}

####Application-specific logic

Further, if you want to have some very specific behaviour that you would like to add to your Awesome Table, for example, adding a click handler to a button that opens a dialog box for example, you can write an javascript file that is hosted by a service such as Github Pages, and include that. That file will have to be written with a specific template, however, so we have provided a [starter file](https://github.com/classroomtechtools/classroomtechtools.github.io/blob/master/awesometables/starter.js) to get you started. (Some programming experience is useful.)

Optionally, you can define a `params` object filled with inforamtion that is passed to the main() function.

#####Get started
Here is an example of a `<script>` header content that will use the starter file, and will exit to the brower's debugger.

```js
{
  "params": {
    "debug": true
  },
  "load": [
    "https://classroomtechtools.github.io/awesometables/starter.js"
  ]
}
```

###Template

No matter how you define your `<script>` header, you get some default behaviour, including the ability to write template code in a different way. For example, you can use a `column="x"` attribute on any tag in order to place the contents that is in column x to the content of that tag.

You can use the `onlyif="x=XXX"` to tell it to display "only if" the column x is equal to XXX.

You can use `classif="klass x=XXX"` to tell it to add the class 'klass' if column x is equal to XXX.

You can use the `paragraphs` attribute to flag the fact that the contents of this tag are a sequence of paragraphs (denoted by return characters), and to format it with a `<p>` tag.

Special use is the "stringified" attribute flag. That allows you to define a cell in your sheet that actually is just a stringified representation of a range (or query), and the contents allow you to define a template within a template.

Here is some markup that uses all of these features.

```html
<div class="boxer">
    <div class="box-row">
        <div class="box leftInfo" classif="privateLeft e=Private">
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
        </div>
        <div class="box rightInfo" classif="privateRight e=Private">
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
        </div>

</div>
<div class="comments" column="w" stringified>
    <div class="comment-item"><b><%= name %></b>: <%= comment %></div>
</div>
<div class="comments"><button class="comment-button">Add Comment</button></div>
```

##Reference

Provided for your convenience.

####Urls for the files are:

* http://classroomtechtools.github.io/awsometables/awtble.js
* http://classroomtechtools.github.io/awsometables/tryout.js
* http://classroomtechtools.github.io/awsometables/tryout.css
