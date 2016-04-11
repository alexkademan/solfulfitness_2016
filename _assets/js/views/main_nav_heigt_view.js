// app.mainMenuHeight

var Backbone = require ('backbone');
var _ = require ('underscore');
var $ = require ('jquery');

module.exports = Backbone.View.extend({
  el: '#site-nav',

  openUp: function() {
    this.$el.attr('style', 'height: ' + this.$('ul').height() + 'px');
  },

  closeDown: function() {
    this.$el.attr('style', 'height: 0px');
  },

  switchToLarger: function() {
    this.$el.removeAttr('style');
  }

});
