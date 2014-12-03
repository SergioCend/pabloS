define([], function() {
    App.Model._TrabajoMasterModel = Backbone.Model.extend({
     	initialize: function() {
            this.on('invalid', function(model,error) {
                Backbone.trigger('trabajo-master-model-error', error);
            });
        },
        validate: function(attrs, options){
        	var modelMaster = new App.Model.TrabajoModel();
        	if(modelMaster.validate){
            	return modelMaster.validate(attrs.trabajoEntity,options);
            }
        }
    });

    App.Model._TrabajoMasterList = Backbone.Collection.extend({
        model: App.Model._TrabajoMasterModel,
        initialize: function() {
        }

    });
    return App.Model._TrabajoMasterModel;
    
});