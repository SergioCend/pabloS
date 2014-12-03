define(['model/_trabajoMasterModel'], function() { 
    App.Model.TrabajoMasterModel = App.Model._TrabajoMasterModel.extend({

    });

    App.Model.TrabajoMasterList = App.Model._TrabajoMasterList.extend({
        model: App.Model.TrabajoMasterModel
    });

    return  App.Model.TrabajoMasterModel;

});