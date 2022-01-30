const Events = require('events');

class WindowCenterClass extends Events {
  constructor() {
    super();
    this.panelNames = [];
    this.panelMap = {};
  }
  getPanelNames() {
    return this.panelNames;
  }
  getPanelMap() {
    return this.panelMap;
  }
  register(name: string, panel: any) {
    this.panelNames.push(name);
    this.panelMap = {
      ...this.panelMap,
      [name]: panel,
    };
  }
  unRegister(name: string) {
    const findIndex = this.panelNames.findIndex((panelName: string) => panelName === name);
    if (findIndex) {
      this.panelNames.splice(findIndex, 1);
      delete this.panelMap[name];
    }
  }
}

const winCenter = new WindowCenterClass();
module.exports = winCenter;
