var Backbone = require ('backbone');

module.exports = Backbone.Model.extend({

  defaults: {
    id: '',
    loaded: false,
    prevRendered: false,
    headline: false,
    message: false,
    description: false,
    wireframe: true
  }

});
