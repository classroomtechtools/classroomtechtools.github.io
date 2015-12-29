#Code for Awesometables

Hopefully this is useful to the general community.

###Instructions:

* Create a site with awesometables, with templates, the usual way
* Define the awesometable to use the proxy, provided below (copy and paste, and deploy as web app)
* Modify the Template sheet so that it has a `<script>` header and in the row beneath it, add the json provided below

###This is the json to place into the `<script>` content:

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
    "https://brainysmurf.github.io/at/tryout.css",
    "https://ajax.googleapis.com/ajax/libs/jqueryui/1.11.4/jquery-ui.min.js",
    "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.5.0/css/font-awesome.css",
    "https://brainysmurf.github.io/jquery-observe/jquery-observe.js",
    "https://cdnjs.cloudflare.com/ajax/libs/underscore.js/1.8.3/underscore-min.js",
    "https://brainysmurf.github.io/at/awtble.js",
    "https://brainysmurf.github.io/at/tryout.js"
  ]
}
```

###Reference

Provided for your convenience.

####Urls for the files are:

* http://classroomtechtools.github.io/awsometables/awtble.js
* http://classroomtechtools.github.io/awsometables/tryout.js
* http://classroomtechtools.github.io/awsometables/tryout.css
