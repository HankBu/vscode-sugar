import Events from 'events';
import windowCenter from './windowCenter';
import Utils from './utils';

// 窗体默认属性
const defaultOption = {
  titleName: 'title name',
};
class BaseWindow extends Events {
  // 设置所有窗口默认属性
  static setDefaultOption(option) {
    Object.assign(defaultOption, option);
  }
  constructor(name, option = defaultOption) {
    super();
    if (typeof name !== 'string') {
      throw new Error('process name must be string');
    }
    this.panel = this.init(name, option);
    // 注册到窗口中心
    windowCenter.register(name, panel);
  }
  init(name, option = {}) {
    const { titleName } = option;
    return vscode.window.createWebviewPanel(name, titleName, vscode.ViewColumn.One, {
      enableScripts: true,
      retainContextWhenHidden: true,
      localResourceRoots: [vscode.Uri.file(path.join(this.context.extensionPath, 'out', 'app'))],
    });
  }
  // 判断窗口实例是否存在
  isInstanceExist() {
    return !!this.panel;
  }
  getInstance() {
    return this.panel;
  }
}

module.exports = BaseWindow;
