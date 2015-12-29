#Code for Awesometables

Hopefully this is useful to the general community.

##Instructions:

* Create a site with awesometables, with templates, the usual way
* Define the awesometable to use the proxy, provided below (copy and paste, and deploy as web app)
* Modify the Template sheet so that it has a `<script>` header and in the row beneath it, add the json provided below

###Proxy code

You need to put the contents of the link below into your domain as a web app, and deploy:

* https://github.com/classroomtechtools/classroomtechtools.github.io/blob/master/awesometables/proxy.gs

###Make a copy of the Google Sheet:

* https://docs.google.com/spreadsheets/d/1f0kyT8Rdb-45vwr3M4gK5VyC3-7PQJtk88yy1I0xXlI/copy

###This is the json to place into the `<script>` content:

You will have to change the values in the `params` area to ones for you.

```js
{
  "params": {
    "formUrl": "",
    "prefill": "",
    "commentUrl": "",
    "commentPrefill": ""
  },
  "load": [
    "https://ajax.googleapis.com/ajax/libs/jquery/2.1.4/jquery.min.js",
    "https://brainysmurf.github.io/css/aristo/aristo.css",
    "https://classroomtechtools.github.io/awesometables/tryout.css",
    "https://ajax.googleapis.com/ajax/libs/jqueryui/1.11.4/jquery-ui.min.js",
    "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.5.0/css/font-awesome.css",
    "https://brainysmurf.github.io/jquery-observe/jquery-observe.js",
    "https://cdnjs.cloudflare.com/ajax/libs/underscore.js/1.8.3/underscore-min.js",
    "https://classroomtechtools.github.io/awesometables/awtble.js",
    "https://classroomtechtools.github.io/awesometables/tryout.js"
  ]
}
```

###Template

Now, define the template for the search results column like so:

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
