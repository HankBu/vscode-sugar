/**
 * Util 工具
 */
let windowId = '';

export const util = {
  // 获取窗口进程id
  getThreadId() {
    if (!windowId) {
      const remote = require('electron').remote;
      windowId = remote && remote.getCurrentWindow().windowId;
    }
    return windowId;
  },
};
