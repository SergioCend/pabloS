define(['component/_trabajoMasterComponent'],function(_TrabajoMasterComponent) {
    App.Component.TrabajoMasterComponent = _TrabajoMasterComponent.extend({
		postInit: function(){
			//Escribir en este servicio las instrucciones que desea ejecutar al inicializar el componente
		}
    });

    return App.Component.TrabajoMasterComponent;
});