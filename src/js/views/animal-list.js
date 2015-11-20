'use strict';

var Backbone = require('backbone');
var $ = require('jquery');
var _ = require('underscore');
var Animals = require('../collections/animals.js');

var noContentTemplate = require('../templates/no-content.handlebars');
var errorTemplate = require('../templates/error.handlebars');
var animalsTemplate = require('../templates/animal.handlebars');
var paginationTemplate = require('../templates/pagination.handlebars');
var loadingTemplate = require('../templates/loading.handlebars');

module.exports = Backbone.View.extend({
    el: '.animal-list',
    noContentTemplate: noContentTemplate,
    errorTemplate: errorTemplate,
    animalsTemplate: animalsTemplate,
    paginationTemplate: paginationTemplate,
    loadingTemplate: loadingTemplate,
    animalType: '',
    detailsClass: 'info-active',
    animalContainer: '.animal-gif-container',
    collection: {},

    events: {
        'click button[rel="prev"]': 'paginate',
        'click button[rel="next"]': 'paginate',
        'click button.view': 'toggleDetails',
        'click button.hide': 'toggleDetails'
    },

    initialize: function animaLListInit(view) {
        this.collection = new Animals();
        this.render();
        this.listenTo(this, 'tabChange', this.animalValueChanged);
    },

    render: function animalListRender(animalType) {
        this.$el.html(this.loadingTemplate());
        if (typeof(animalType) !== 'undefined') {
            var cb = _.bind(this.fetchComplete, this);

            this.collection.setQueryTerm(animalType);
            this.collection.fetch().done(cb);

        } else {
            this.$el.html(this.noContentTemplate());
        }
    },

    animalValueChanged: function animalValueChanged(e) {
        this.animalType = e.value;
        this.collection.resetOffsetCount();
        this.render(this.animalType);
    },

    fetchComplete: function fetchComplete(res) {
        var status = res.meta.status;
        var pagination = res.pagination;
        var html;

        if (status === 200) {
            console.log(res.data);
            html = this.animalsTemplate({
                gifs: res.data
            });
            html += this.preparePaginationHTML(pagination);
        } else {
            html = this.errorTemplate();
        }
        this.$el.html(html);

        $('html, body').animate({
            scrollTop: this.$el.offset().top
        }, 700);
    },

    preparePaginationHTML: function preparePaginationHTML(pagination) {
        var html = '';
        var offsetCount = this.collection.getOffsetCount();
        var offsetValue = this.collection.getOffsetValue();
        var today;
        var uploadDate;
        var oneDay = 24 * 60 * 60 * 1000;
        var diffDays;
        if (pagination.total_count > offsetValue) {
            if (offsetCount > 0) {
                pagination.prev = true;
            }
            if (offsetCount <= pagination.total_count) {
                pagination.next = true;
            }
            //Allow for proper division
            offsetCount += offsetValue;
            pagination.pages = Math.round(pagination.total_count / offsetValue);
            pagination.pageNumber = Math.round(offsetCount / offsetValue);
            
            html = this.paginationTemplate(pagination);
        }
        return html;
    },

    paginate: function paginate(e) {
        var target = e.target;
        var $target = $(target);

        var action = $target.attr('rel');
        if (action === 'next') {
            this.collection.increaseOffset();
        } else if (action === 'prev') {
            this.collection.decreaseOffset();
        }

        this.render(this.animalType);
    },

    toggleDetails: function toggleDetails(e) {
        var target = e.target;
        var $target = $(target);
        var $parent = $target.parent(this.animalContainer);
        $parent.toggleClass(this.detailsClass);
    }
});
