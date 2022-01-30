/**
 * windowCenter
 * 渲染进程，通用窗口中心
 */
// const names = [];

// class WindowCenter {
//   // 注册进程服务
//   _register(name, process) {
//     names.push(name);
//     this[name] = process;
//   }
//   // 注销进程服务
//   _unegister(name) {
//     delete this[name];
//     const index = names.indexOf(name);
//     names.splice(index, 1);
//   }
// }

module.exports = {
  panels: [],
  register: (name, process) => {
    this.panels.push({ [name]: process });
  },
  _unegister: name => {
    const findIndex = this.panels.findIndex(item => {
      if (item.name === name) {
        return true;
      }
      return false;
    });
    names.splice(findIndex, 1);
  },
};
