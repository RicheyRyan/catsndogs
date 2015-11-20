'use strict';
var $ = require('jquery');
var _ = require('underscore');
var Backbone = require('backbone');

var tabTpl = require('../templates/tabs.handlebars');

module.exports = Backbone.View.extend({
    el: '.animal-tabs',
    template: tabTpl,
    $tabs: [],
    selectedClass: 'selected',
    tabChangedEvent: 'tabChange',
    observers: [],

    events: {
        'click .tab-button': 'tabClicked'
    },

    initialize: function tabsInit(){
        this.render();
    },

    render: function tabsRender(){
        this.$el.html(this.template());
        this.$tabs = $('.tab-button');
    },

    clearSelected: function clearSelected(){
        this.$tabs.removeClass(this.selectedClass);
    },

    addSelectedClass: function addSelectedClass($el){
        $el.addClass(this.selectedClass);
    },

    setSelectedTab: function setSelectedTab(tabItem){
        var e = {};
        e.target = $('[data-tab-item="' + tabItem + '"]');
        this.tabClicked(e);
    },

    tabClicked: function tabClicked(e){
        var $target = $(e.target);
        var tabItem = $target.data('tab-item');
        var _this = this;
        this.clearSelected();
        this.addSelectedClass($target);
        _.each(this.observers, function notifyTabChange(obj, i, list){
            obj.trigger(_this.tabChangedEvent, {value: tabItem});
        });
    },

    addObserver: function tabAddSuscriber(obj){
        this.observers.push(obj);
    }
});
