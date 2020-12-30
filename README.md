# Released Software

## Practical Libraries

Libraries aimed at "citizen developers."

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

### Format Logger

(to be released)

## Utilities

Stuff for specific use cases, or to make more libraries:

### [Rhino -> V8 Migration Assistant](https://script.google.com/macros/s/AKfycby7jvgxiqj2Eok7pXb1dHoJPQJ4QbCJjBP42N-Wo9JMqlAxIHs/exec)

Help convert legacy code to the equivalent V8 code.

### [Enforce Arguments](https://github.com/classroomtechtools/EnforceArguments)

This allows the developer to declare that certain parameters passed to a certain function must be of a certain type.

```js
function myFunction(stringArg) {
    Enforce.positional(arguments, {stringArg: '!string'});
}
```

### [Context Manager](https://classroomtechtools.github.io/ContextManager/)

This allows the developer to define a block of code that has a head and tail function execute, even if an error occurs at any point.

## Tooling Libraries

These are aimed for the more sophisticated user exploring the appscripts stack, with node, more generally.

### [Unit Testing](https://classroomtechtools.github.io/Utgs/)

The underpinning of a good set of libraries is that they be unit tested, that way other developers can depend on them. It enables developers to write unit tests that can be executed over and over again.

I find this particularly useful and helpful when refactoring or adding features.

### [virtualgs](https://github.com/classroomtechtools/virtualgs)

When using a node environment, you may want to execute appscript code in a run-time that matches more closely the server environment. This package enables the developer to define a folder that contains appscripts code, and execute it.

Also able to define mocks. (Also deployed in some testing suites.)

### [Appscripts Modules featuring Svelte](https://github.com/classroomtechtools/appscripts-modules-ft-svelte)

This is a node repo that allows me to create all of the libraries above, complete with unit testing, dependecy resolution, etc.

It also enables me to locally build a web app or sidebar app with the front-end Svelte.
