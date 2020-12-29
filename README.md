# Released Software

## Practical Libraries:

Libraries aimed at "citizen developers."

### [Object Store](https://github.com/classroomtechtools/objectStore)

Use the cache and properties store like a pro, without having to code it out. 

### [Dottie](https://github.com/classroomtechtools/dottie)

Make jsons or javascript objects by using strings; useful in a variety of applications. 

Also includes the handy `dottie.jsonsToRows` function, which will take an array of jsons and convert them into spreadsheet-friendly rows and columns.

### Format Logger

(to be released)

## Utility Libraries:

Libraries aimed at specific use cases, or to make more libraries:

### [Enforce Arguments](https://github.com/classroomtechtools/EnforceArguments)

This allows the developer to declare that certain parameters passed to a certain function must be of a certain type.

### [Context Manager](https://github.com/classroomtechtools/ContextManager)

This allows the developer to define a block of code that has a head and tail function execute, even if an error occurs at any point.

## Tooling Libraries:

These are aimed for the more sophisticated user exploring the appscripts stack, with node, more generally.

### [Unit Testing](https://github.com/classroomtechtools/Utgs)

The underpinning of a good set of libraries is that they be unit tested, that way other developers can depend on them. It enables developers to write unit tests that can be executed over and over again.

I find this particularly useful and helpful when refactoring or adding features.

### [virtualgs](https://github.com/classroomtechtools/virtualgs)

When using a node environment, you may want to execute appscript code in a run-time that matches more closely the server environment. This package enables the developer to define a folder that contains appscripts code, and execute it.

Also able to define mocks. (Also deployed in some testing suites.)

### [Appscripts Modules featuring Svelte](https://github.com/classroomtechtools/appscripts-modules-ft-svelte)

This is a node repo that allows me to create all of the libraries above, complete with unit testing, dependecy resolution, etc.

It also enables me to locally build a web app or sidebar app with the front-end Svelte.
