// app.mainNavShader

var Backbone = require ('backbone');
var _ = require ('underscore');
var $ = require ('jquery');

module.exports = Backbone.View.extend({
  el: '#mobile_shader',

  events: {
    'click': function(e) {
      app.mainNav.closeMenus();
    }
  },

  clickScreen: function(e) {
    console.log(e.target.className);
  },

  openShader: function() {
    this.$el.attr('style', 'height: ' + app.windowStatus.get('documentHeight') + 'px');
  },

  closeShader: function() {
    setTimeout(function(){
      // if this was called twice (double-click)
      // then the var will be set to true. Otherwise:
      if( app.mainNav.model.get('mobileMenu') === false) {
        app.mainNavShader.removeStyle();
      }

    }, app.mainNav.model.get('shaderFadeOutTime')); // length of countdown set in model
  },

  removeStyle: function() {
    this.$el.removeAttr('style');
  }

});
