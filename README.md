# drama.js

A simple DRagging MAnager to switch/rearrange HTML elements between them,
it can be used to classify things, re-order by importance, etc.. and you will be
able to do it both vertically and horizontally !

### Demo

<video controls width="500" height="300">
    <source src="/assets/drama_demo.mp4" type="video/mp4">
</video>

### Setup

```js
    new Drama(selector,{options});
    //Every drag is stored on the class prototype property so
    //no need to store it in variable except if you want to change some
    //values after.
    
    selector: any valid css selector, if element not found return empty object.

    options: {
        direction:"hor" or "vert",
        hint:[invalidDrop, validDrop], // visual indicator for insertion
        color: a valid css color format //background color when dragging element
        transition: "margin .15s ease-out"
        spacing: how big the drop hint space should be
    }

    defaults for these options:{
        direction:"vert",
        hint:[],
        color: "hsl(0,0%,70%)"//A grey shade,
        transition: null,
        spacing: "2rem"
    }

    //example
    const options = {color:hsl(211,87%,50%),hint:['#d10000','#00ab66'],
    transition: "margin .15s ease-out"};

    new Drama(.container,options);
```

#### gotchas
* The selector must be the **direct parent** of the elements you want to drag!
* The dragging manager won't look for the nearest colored ancestor to match
background so you will always want to specify the color option or else you
will have a default grey one.

### Installation

```sh
npm install @everezze/drama
```

### Optimizations

Getting and storing the dimensions of the element at the start of the
mouse down event to avoid calling window.getComputedStyles() function when
dragging and triggering reflows after changing those values.


### Todo

- [ ] A way to edit settings after creating a drama.

### License

Copyright (c) 2025 Everezze.

Licensed under the GPL-3.0 license.
