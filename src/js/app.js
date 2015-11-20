'use strict';
var $ = require('jquery');
var Backbone = require('backbone');
Backbone.$ = $;
var Tabs = require('./views/tabs');
var AnimalList = require('./views/animal-list.js');

// Init our components
var animalTabs = new Tabs();
var list = new AnimalList();

animalTabs.addObserver(list);


