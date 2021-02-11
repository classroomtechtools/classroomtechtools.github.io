# Released Software

## Practical Libraries

Libraries aimed at "citizen developers" working in the AppsScripts platform.

### [Object Store](https://classroomtechtools.github.io/ObjectStore/)

Use the cache and properties store like a pro, without having to code it out. 

```js
// "global" stores, choose from 'script', 'document' or 'user'
const autoStore = ObjectStore.create();  // 'script by default'
const manualStore = ObjectStore.create('script', {manual: true});

function autopersist () {   
    // persisted now:
    autoStore.set('key', {value: 'value'});  
    ... // on next execution
    const value = autoStore.get('key');
}

function manuallypersist () {
    const dataArray = [ {idx: 1, d: 'd'}, ... ];
    for (const item of dataArray) {
        // keys must be strings (throws error if not):
        const key = item.idx.toString();  
        // does not persist in PropertiesStorage yet:
        manualStore.set(key, item);  
    }
    // manually tell it to persist, more performant
    manualStore.persist(); 
}
```

### [Dottie](https://classroomtechtools.github.io/dottie/)

Make jsons or javascript objects by using strings; useful in a variety of applications. 

```js
const obj = dottie.set({}, 'path.to.value', 100);
Logger.log(obj);
/* 
{
  path: {
    to: {
      value: 100
    }
  }
}
*/
const value = dottie.get(obj, 'path.to.value');
Logger.log(value);
/*
100
*/

const obj = dottie.set({}, 'path.to.array[0].name', 'Bob');
Logger.log(obj);
/*
{
  path: {
    to: {
      array: [
        {name: "Bob"}
      ]
    }
  }
}
*/
```

Also includes the handy `dottie.jsonsToRows` function, which will take an array of jsons and convert them into spreadsheet-friendly rows and columns.

### [Rhino -> V8 Migration Assistant](https://script.google.com/macros/s/AKfycby7jvgxiqj2Eok7pXb1dHoJPQJ4QbCJjBP42N-Wo9JMqlAxIHs/exec)

This is a web app that allows developers to convert their legacy rhino code to V8. Think of it as a first-pass migration assistant, helping those who want to learn some of the new language syntax features with a robot assistant.

## Practical Tools

Stuff made for GSuite administators or other Computer Science teachers.

### [Meets Audit Activity Insights](https://github.com/classroomtechtools/Meets-Audit-Activity-Insights)

A spreadsheet that GSuite administrator can use to get a bird's-eye view of some of the Google Meets activity happening on the domain.

The code itself might be of interest, as it interacts in batch with the target endpoint.

### [IB Pseudocode Python](https://github.com/classroomtechtools/ib_pseudocode_python)

I use this to teach IB Computer Science. Using gitpod, it provides a server environment for students to execute real IB pseudocode. It comes with batteries included, such as the data structures that IB students need to learn how to use during the course.

### [Import My Timetable into Google Calendar](https://github.com/classroomtechtools/import-my-timetable-into-google-calendar)

At the school where I work, probably one of my more popular things that I ever made. Since we have a seven-day rotating schedule that does not coorespond to M-F, and we also use Google Calendar extensively, we need a way to create individual events to match the rotating schedule.

It's a spreadsheet with fancy formulas, and you download the resulting CSV from the export tab.

## Utilities

Stuff for specific use cases, or to make more libraries:

### [Endpoints](https://classroomtechtools.github.io/Endpoints/)

A library SDK for Google AppsScripts that makes working with API endpoints a cinch. You can use it as an abstraction of UrlFetchApp, or use it to wrap Google APIs that don't have advanced services yet.

### [Chat Advanced Service](https://classroomtechtools.github.io/chat-adv-service/)

Interact with the Google Chat API via AppsScripts.

### [Enforce Arguments](https://github.com/classroomtechtools/EnforceArguments)

This allows the developer to declare that certain parameters passed to a certain function must be of a certain type.

```js
function myFunction(stringArg) {
    Enforce.positional(arguments, {stringArg: '!string'});
}
```

### [Context Manager](https://classroomtechtools.github.io/ContextManager/)

This allows the developer to define a block of code that has a head and tail function execute, even if an error occurs at any point.

```js
/**
 * A simple (and useless) context manager that illustrates patterns
 */
function myFunction () {
  const context = ContextManager.create();
  context.head = function (param) {
    // this will be state, by default just an object
    this.inHead = true;
  };
  context.body = function (param) {
    this.inBody = true;
    return param;
  };
  context.tail = function (param) {
    this.inTail = true;
  }
  const result = context.execute("echo");
  Logger.log(result);  
  //     echo
  Logger.log(context.state);  
  //     {inHead: true, inTail: true, inBody: true};
}
```

### [NamespacedLib](https://github.com/classroomtechtools/NamespacedLib)

I accidentally discovered that the `@name` annotation in jsdoc for some reason worked and explored how it might be useful. It turns out that it can be used to create namespaces on one's libraries.

Not sure how useful this will be with the new IDE, but thought I'd catalog it here anyway.

## Tooling Libraries

These are aimed for the more sophisticated user exploring the appscripts stack, with node, more generally.

### [Appscripts Modules featuring Svelte](https://classroomtechtools.github.io/appscripts-modules-ft-svelte/)

This is a node repo that allows me to create most of the libraries listed above, complete with unit testing, dependecy resolution, and full-stack implementation.

It also enables me to locally build a web app or sidebar app with the front-end Svelte.

### [Unit Testing](https://classroomtechtools.github.io/Utgs/)

The underpinning of a good set of libraries is that they be unit tested, that way other developers can depend on them. It enables developers to write unit tests that can be executed over and over again.

I find unit testing particularly useful and helpful when refactoring or adding features.

```js
function Tests () {
  // sorta like importing, this inits the variables
  const {describe, it, assert} = Utgs.module(); 

  describe("Test Category 1", function () {
    it("Have the value of Yes", function () {
      assert.equals({
        comment: 'If it fails, it displays in the log',
        expected: 'Yes',
        actual: 'Yes'
      });
    });
    it("Have the value of No", function () {
      assert.equals({
        comment: 'If it fails, it displays in the log',
        expected: 'No',
        actual: 'Yes'
      });
    });
  });
}
```

### [virtualgs](https://github.com/classroomtechtools/virtualgs)

When using a node environment, you may want to execute appscript code in a run-time that matches more closely the server environment. This package enables the developer to define a folder that contains appscripts code, and execute it.

Also able to define mocks. (Also deployed in some testing suites.)

```js
import virtualgs from '@classroomtechtools/virtualgs';

const invoke = virtualgs('scripts');  // scripts is the directory
const parameters = [1, 2];
invoke('myFunction', ...parameters)
  .then(result => console.log(result));
```

