#Code for Awesometables…

…by [classroomtechtools.com](http://classroomtechtools.com)

These are instructions for turning awesometables into more of a web app. That means you can write javascript / jquery code to do whatever you want.

The secret sauce is by using the provided proxy to instruct the browser, upon loading up the awesometable, to bring in any external css or javascript files, for example jquery. You can think of the proxy as injecting javascript into the browser. It loads any dependencies, reads in information from the Template, and calls the function `main` (which you'll have to define in one of your external javascript files). Whenver the awesometable changes its content, the `update` function is called. 

The code is released into the public domain, "as is".

##Instructions:

* Create a site with awesometables, with templates, the usual way
* Define the awesometable to use the proxy, provided below (copy and paste, and deploy as web app)
* Modify the Template sheet so that it has a `<script>` header and in the row beneath it, follow instructions for adding the code

###Proxy

You need to put the contents of the link below into your domain as a web app, and deploy:

* https://github.com/classroomtechtools/classroomtechtools.github.io/blob/master/awesometables/proxy.gs

###Contents of `<script>` in Template sheet:

The `params` object is passed into the main() function, and you can define whatever you want them to be. I provided some possible examples below. 

The `load` object is an array of external javascript and css files that are loaded sequentially, in that order. So, that is your list of dependencies. The last one is probably going to define your `main` function, that does whatever you want it to do. The values here are the minimal, but you can define more if you use other front-end development tools.

```js
{
  "params": {
    "formUrl": "",
    "prefill": "",
    "commentUrl": "",
    "commentPrefill": ""
  },
  "load": [
    "https://ajax.googleapis.com/ajax/libs/jquery/2.1.4/jquery.min.js",  // jquery
    "https://brainysmurf.github.io/jquery-observe/jquery-observe.js",    // dependency for awtble.js
    "https://classroomtechtools.github.io/awesometables/awtble.js",      // defines functions that trick out our templating
    "https://classroomtechtools.github.io/awesometables/tryout.js"       // application-specific logic (defines main)
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
