var Backbone = require ('backbone');
var _ = require ('underscore');
var $ = require ('jquery');

module.exports = Backbone.View.extend({
  el: 'body',

  initialize: function() {
    this.timedCount();
  },

  timedCount: function(){
    // just putting a random number in as the background position in order to
    // create a static tv effect.
    var randomNum = Math.floor((Math.random() * 2000) + 1);
    this.$el.attr("style", 'background-position: ' + randomNum + '% 0');
    setTimeout( function(){ app.background.timedCount(); }, 75 );
  }

});
