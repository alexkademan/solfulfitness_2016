// app.mainNav

var Backbone = require ('backbone');
var _ = require ('underscore');
var $ = require ('jquery');

var MainNavShader = require('./main_nav_shader_view');
var MainMenuHeight = require('./main_nav_heigt_view');

module.exports = Backbone.View.extend({

  el: '#site_header',

  events: {
    'click a.toggle': 'toggleMenu'
  },

  initialize: function(){
    this.model.on('change:mobileMenu', this.openClose);

    app.windowStatus.on({
      'change:palmSize': function(){
        app.mainNav.breakpointChange();
      }
    });

    app.mainNavShader = new MainNavShader({model: this.model});
    app.mainMenuHeight = new MainMenuHeight({model: this.model});

    this.breakpointChange(); // run this once to set the stage.

  },

  toggleMenu: function(e) {
    // just toggle the menu true/false:
    if(this.model.get('mobileMenu') === false){
      this.model.set({ mobileMenu : true });
    } else {
      this.model.set({ mobileMenu : false });
    };

  },

  openClose: function(){
    // runs whenever menu is toggled:
    if( app.mainNav.model.get('mobileMenu') === true ){
      // set class for CSS hook:
      $(document.documentElement).addClass('main_nav_on');
      app.mainNavShader.openShader();
      app.mainMenuHeight.openUp();

    } else {
      // remove class
      $(document.documentElement).removeClass('main_nav_on');
      app.mainNavShader.closeShader();
      app.mainMenuHeight.closeDown();
    };
  },

  closeMenus: function() {
    if( app.mainNav.model.get('mobileMenu') === true ){
      // trigger the standard shutdown:
      app.mainNav.model.set({'mobileMenu' : false });
    }
  },

  breakpointChange: function() {

    if( this.model.get('mobileMenu') === true){
      console.log('close the damn menu NOW');
      this.closeMenus();
    };

    if( app.windowStatus.get('palmSize') === true ){
      // Make the Palm Sized Layout
      console.log('make palm size');
      app.mainMenuHeight.closeDown();

    } else {
      // make the monitor sized layout
      // console.log('make monitor size');

      app.mainMenuHeight.switchToLarger();

    };
  }

});
