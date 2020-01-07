/* jspanel.layout.js (c) Stefan Sträßer(Flyer53) <info@jspanel.de> license: MIT */
'use strict'; //import {jsPanel} from '../../jspanel.js';

if (!jsPanel.layout) {
  jsPanel.layout = {
    version: '1.3.0',
    date: '2019-11-26 20:30',
    storage: localStorage,
    save: function save() {
      var saveConfig = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
      var selector = saveConfig.selector ? saveConfig.selector : '.jsPanel-standard';
      var storageName = saveConfig.storagename ? saveConfig.storagename : 'jspanels';
      var collection = document.querySelectorAll(selector);
      var panels = [];
      collection.forEach(function (item) {
        var panelData = item.currentData;
        panelData.status = item.status;
        panelData.zIndex = item.style.zIndex;
        panelData.id = item.id;
        panels.push(panelData);
      });
      panels.sort(function (a, b) {
        return a.zIndex - b.zIndex;
      });
      this.storage.removeItem(storageName);
      var storedData = JSON.stringify(panels);
      this.storage.setItem(storageName, storedData);
      return storedData;
    },
    getAll: function getAll() {
      var storagename = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'jspanels';

      if (this.storage[storagename]) {
        return JSON.parse(this.storage[storagename]);
      } else {
        return false;
      }
    },
    getId: function getId(id) {
      var storagename = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'jspanels';

      if (this.storage[storagename]) {
        var panels = this.getAll(storagename),
            panel;
        panels.forEach(function (item) {
          if (item.id === id) {
            panel = item;
          }
        });

        if (panel) {
          return panel;
        } else {
          return false;
        }
      } else {
        return false;
      }
    },
    restoreId: function restoreId() {
      var restoreConfig = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
      var id, config, storageName;

      if (!restoreConfig.id || !restoreConfig.config) {
        console.error('Id or predefined panel configuration is missing!');
        return false;
      } else {
        id = restoreConfig.id;
        config = restoreConfig.config;
        storageName = restoreConfig.storagename ? restoreConfig.storagename : 'jspanels';
      }

      var storedpanel = this.getId(id, storageName);

      if (storedpanel) {
        var savedConfig = {
          id: storedpanel.id,
          panelSize: {
            width: storedpanel.width,
            height: storedpanel.height
          },
          position: "left-top ".concat(storedpanel.left, " ").concat(storedpanel.top),
          zIndex: storedpanel.zIndex
        };
        var useConfig = Object.assign({}, config, savedConfig);
        jsPanel.create(useConfig, function (panel) {
          panel.style.zIndex = savedConfig.zIndex;
          panel.saveCurrentDimensions();
          panel.saveCurrentPosition();
          panel.calcSizeFactors(); // don't put code below in savedConfig.setStatus

          if (storedpanel.status !== 'normalized') {
            if (storedpanel.status === 'minimized') {
              panel.minimize();
            } else if (storedpanel.status === 'maximized') {
              panel.maximize();
            } else if (storedpanel.status === 'smallified') {
              panel.smallify();
            } else if (storedpanel.status === 'smallifiedmax') {
              panel.maximize().smallify();
            }
          }
        });
      }
    },
    restore: function restore() {
      var restoreConfig = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
      var predefinedConfigs, storageName;

      if (!restoreConfig.configs) {
        console.error('Object with predefined panel configurations is missing!');
        return false;
      } else {
        predefinedConfigs = restoreConfig.configs;
        storageName = restoreConfig.storagename ? restoreConfig.storagename : 'jspanels';
      }

      if (this.storage[storageName]) {
        var storedPanels = this.getAll(storageName); // loop over all panels in storageName

        storedPanels.forEach(function (item) {
          var pId = item.id; // loop over predefined configs to find config with pId
          // this makes it unnecessary that identifiers for a certain config is the same as id in config

          for (var conf in predefinedConfigs) {
            if (predefinedConfigs.hasOwnProperty(conf)) {
              if (predefinedConfigs[conf].id === pId) {
                jsPanel.layout.restoreId({
                  id: pId,
                  config: predefinedConfigs[conf],
                  storagename: storageName
                });
              }
            }
          }
        });
      } else {
        return false;
      }
    }
  };
} // Add CommonJS module exports, so it can be imported using require() in Node.js
// https://nodejs.org/docs/latest/api/modules.html


if (typeof module !== 'undefined') {
  module.exports = jsPanel;
}