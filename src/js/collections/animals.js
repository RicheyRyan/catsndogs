'use strict';
var Backbone = require('backbone');
var _ = require('underscore');
var Animal = require('../models/animal.js');

module.exports = Backbone.Collection.extend({
    model: Animal,
    key: 'dc6zaTOxFJmzC',
    protocol: 'http://',
    host: 'api.giphy.com',
    path: '/v1/gifs/search',
    q: '',
    fmt: 'json',
    offset: 0,
    rating: 'g', // keep it clean
    url: '',
    offsetVal: 25,
    
    setQueryTerm: function setQueryTerm(q){
        this.q = q;
        var urlParams = {
            q: this.q,
            fmt: this.fmt,
            rating: this.rating,
            offset: this.offset,
            api_key: this.key
        };
        var queryString = this.constructQueryString(urlParams);
        this.url = this.protocol + this.host + this.path + queryString;
    },

    constructQueryString: function constructQueryString(params){
        var queryString = "?";
        var multiple = false;
        var newParam;
        _.mapObject(params, function(val, key){
            if(multiple){
                queryString += '&';
            }
            multiple = true;
            newParam = key + '=' + val;
            queryString += newParam;
        });
        return queryString;
    },

    increaseOffset: function increaseOffset(){
        this.offset += this.offsetVal;
    },

    decreaseOffset: function decreaseOffset(){
        if(this.offset > 0){
            this.offset -= this.offsetVal;
        }
    },

    getOffsetCount: function getOffsetCount(){
        return this.offset;
    },

    resetOffsetCount: function resetOffsetCount(){
        this.offset = 0;
    },
    
    getOffsetValue: function getOffsetValue(){
        return this.offsetVal;
    }
});
