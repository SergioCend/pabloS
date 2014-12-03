define(['controller/selectionController', 'model/cacheModel', 'model/trabajoMasterModel', 'component/_CRUDComponent', 'controller/tabController', 'component/trabajoComponent',
 'component/obraComponent', 'component/autorComponent', 'component/videoComponent', 'component/imagenComponent'],
 function(SelectionController, CacheModel, TrabajoMasterModel, CRUDComponent, TabController, TrabajoComponent,
 obraComponent, autorComponent, videoComponent, imagenComponent) {
    App.Component._TrabajoMasterComponent = App.Component.BasicComponent.extend({
        initialize: function() {
            var self = this;
            this.configuration = App.Utils.loadComponentConfiguration('trabajoMaster');
            App.Model.TrabajoMasterModel.prototype.urlRoot = this.configuration.context;
            this.componentId = App.Utils.randomInteger();
            
            this.masterComponent = new TrabajoComponent();
            this.masterComponent.initialize();
            
            this.childComponents = [];
			
			this.initializeChildComponents();
            
            Backbone.on(this.masterComponent.componentId + '-post-trabajo-create', function(params) {
                self.renderChilds(params);
            });
            Backbone.on(this.masterComponent.componentId + '-post-trabajo-edit', function(params) {
                self.renderChilds(params);
            });
            Backbone.on(this.masterComponent.componentId + '-pre-trabajo-list', function() {
                self.hideChilds();
            });
            Backbone.on('trabajo-master-model-error', function(error) {
                Backbone.trigger(uComponent.componentId + '-' + 'error', {event: 'trabajo-master-save', view: self, message: error});
            });
            Backbone.on(this.masterComponent.componentId + '-instead-trabajo-save', function(params) {
                self.model.set('trabajoEntity', params.model);
                if (params.model) {
                    self.model.set('id', params.model.id);
                } else {
                    self.model.unset('id');
                }

				App.Utils.fillCacheList(
					'obra',
					self.model,
					self.obraComponent.getDeletedRecords(),
					self.obraComponent.getUpdatedRecords(),
					self.obraComponent.getCreatedRecords()
				);

				App.Utils.fillCacheList(
					'autor',
					self.model,
					self.autorComponent.getDeletedRecords(),
					self.autorComponent.getUpdatedRecords(),
					self.autorComponent.getCreatedRecords()
				);

				App.Utils.fillCacheList(
					'video',
					self.model,
					self.videoComponent.getDeletedRecords(),
					self.videoComponent.getUpdatedRecords(),
					self.videoComponent.getCreatedRecords()
				);

				App.Utils.fillCacheList(
					'imagen',
					self.model,
					self.imagenComponent.getDeletedRecords(),
					self.imagenComponent.getUpdatedRecords(),
					self.imagenComponent.getCreatedRecords()
				);

                self.model.save({}, {
                    success: function() {
                        Backbone.trigger(self.masterComponent.componentId + '-' + 'post-trabajo-save', {view: self, model : self.model});
                    },
                    error: function(error) {
                        Backbone.trigger(self.componentId + '-' + 'error', {event: 'trabajo-master-save', view: self, error: error});
                    }
                });
			    if (this.postInit) {
					this.postInit();
				}
            });
        },
        render: function(domElementId){
			if (domElementId) {
				var rootElementId = $("#"+domElementId);
				this.masterElement = this.componentId + "-master";
				this.tabsElement = this.componentId + "-tabs";

				rootElementId.append("<div id='" + this.masterElement + "'></div>");
				rootElementId.append("<div id='" + this.tabsElement + "'></div>");
			}
			this.masterComponent.render(this.masterElement);
		},
		initializeChildComponents: function () {
			this.tabModel = new App.Model.TabModel({tabs: [
                {label: "Obra", name: "obra", enable: true},
                {label: "Autor", name: "autor", enable: true},
                {label: "Video", name: "video", enable: true},
                {label: "Imagen", name: "imagen", enable: true}
			]});
			this.tabs = new TabController({model: this.tabModel});

			this.obraComponent = new obraComponent();
            this.obraComponent.initialize({cache: {data: [], mode: "memory"},pagination: false});
			this.childComponents.push(this.obraComponent);

			this.autorComponent = new autorComponent();
            this.autorComponent.initialize({cache: {data: [], mode: "memory"},pagination: false});
			this.childComponents.push(this.autorComponent);

			this.videoComponent = new videoComponent();
            this.videoComponent.initialize({cache: {data: [], mode: "memory"},pagination: false});
			this.childComponents.push(this.videoComponent);

			this.imagenComponent = new imagenComponent();
            this.imagenComponent.initialize({cache: {data: [], mode: "memory"},pagination: false});
			this.childComponents.push(this.imagenComponent);

            var self = this;
            
            this.configToolbar(this.obraComponent,true);
            Backbone.on(self.obraComponent.componentId + '-post-obra-create', function(params) {
                params.view.currentModel.setCacheList(params.view.currentList);
            });
            
            this.configToolbar(this.autorComponent,true);
            Backbone.on(self.autorComponent.componentId + '-post-autor-create', function(params) {
                params.view.currentModel.setCacheList(params.view.currentList);
            });
            
            this.configToolbar(this.videoComponent,true);
            Backbone.on(self.videoComponent.componentId + '-post-video-create', function(params) {
                params.view.currentModel.setCacheList(params.view.currentList);
            });
            
            this.configToolbar(this.imagenComponent,true);
            Backbone.on(self.imagenComponent.componentId + '-post-imagen-create', function(params) {
                params.view.currentModel.setCacheList(params.view.currentList);
            });
            
		},
        renderChilds: function(params) {
            var self = this;
            
            var options = {
                success: function() {
                	self.tabs.render(self.tabsElement);

					self.obraComponent.clearCache();
					self.obraComponent.setRecords(self.model.get('listobra'));
					self.obraComponent.render(self.tabs.getTabHtmlId('obra'));

					self.autorComponent.clearCache();
					self.autorComponent.setRecords(self.model.get('listautor'));
					self.autorComponent.render(self.tabs.getTabHtmlId('autor'));

					self.videoComponent.clearCache();
					self.videoComponent.setRecords(self.model.get('listvideo'));
					self.videoComponent.render(self.tabs.getTabHtmlId('video'));

					self.imagenComponent.clearCache();
					self.imagenComponent.setRecords(self.model.get('listimagen'));
					self.imagenComponent.render(self.tabs.getTabHtmlId('imagen'));

                    $('#'+self.tabsElement).show();
                },
                error: function() {
                    Backbone.trigger(self.componentId + '-' + 'error', {event: 'trabajo-edit', view: self, id: id, data: data, error: error});
                }
            };
            if (params.id) {
                self.model = new App.Model.TrabajoMasterModel({id: params.id});
                self.model.fetch(options);
            } else {
                self.model = new App.Model.TrabajoMasterModel();
                options.success();
            }


        },
        showMaster: function (flag) {
			if (typeof (flag) === "boolean") {
				if (flag) {
					$("#"+this.masterElement).show();
				} else {
					$("#"+this.masterElement).hide();
				}
			}
		},
        hideChilds: function() {
            $("#"+this.tabsElement).hide();
        },
		configToolbar: function(component, composite) {
		    component.removeGlobalAction('refresh');
			component.removeGlobalAction('print');
			component.removeGlobalAction('search');
			if (!composite) {
				component.removeGlobalAction('create');
				component.removeGlobalAction('save');
				component.removeGlobalAction('cancel');
				component.addGlobalAction({
					name: 'add',
					icon: 'glyphicon-send',
					displayName: 'Add',
					show: true
				}, function () {
					Backbone.trigger(component.componentId + '-toolbar-add');
				});
			}
        },
        getChilds: function(name){
			for (var idx in this.childComponents) {
				if (this.childComponents[idx].name === name) {
					return this.childComponents[idx].getRecords();
				}
			}
		},
		setChilds: function(childName,childData){
			for (var idx in this.childComponents) {
				if (this.childComponents[idx].name === childName) {
					this.childComponents[idx].setRecords(childData);
				}
			}
		},
		renderMaster: function(domElementId){
			this.masterComponent.render(domElementId);
		},
		renderChild: function(childName, domElementId){
			for (var idx in this.childComponents) {
				if (this.childComponents[idx].name === childName) {
					this.childComponents[idx].render(domElementId);
				}
			}
		}
    });

    return App.Component._TrabajoMasterComponent;
});