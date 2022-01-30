import * as vscode from 'vscode';
const Events = require('events');
const path = require('path');
const WindowCenter = require('./WindowCenter');

// 窗体默认属性
const defaultOption = {
  titleName: 'title name',
  localResourceRoots: [],
};
class BaseWindow extends Events {
  /**
   * @param name 唯一关键字
   * @param option
   * @returns
   */
  constructor({ context, name, titleName }) {
    super();
    if (typeof name !== 'string') {
      throw new Error('process name must be string');
    }
    this.context = context;
    this.name = name;
    this.titleName = titleName;
    this.panel = this.init();
    this.configPanel(this.panel);
    return this.panel;
  }
  init() {
    const panel = this.createPanel();
    const bundleScriptPath = panel.webview.asWebviewUri(
      vscode.Uri.file(path.join(this.context.extensionPath, 'out', 'app', 'bundle.js'))
    );
    panel.webview.html = this.render({ bundleScriptPath }); // 注入 HTML

    return panel;
  }
  createPanel() {
    const panel = vscode.window.createWebviewPanel(
      this.name,
      this.titleName,
      vscode.ViewColumn.One,
      {
        enableScripts: true,
        retainContextWhenHidden: true,
        localResourceRoots: [vscode.Uri.file(path.join(this.context.extensionPath, 'out', 'app'))],
      }
    );
    return panel;
  }
  configPanel(panel) {
    // listen messages from webview
    panel.webview.onDidReceiveMessage(
      (message: Message) => {
        if (message.type === 'RELOAD') {
          vscode.commands.executeCommand('workbench.action.webview.reloadWebviewAction');
        } else if (message.type === 'COMMON') {
          const text = (message as CommonMessage).payload;
          vscode.window.showInformationMessage(`Received message from Webview: ${text}`);
        }
      },
      null,
      this.disposables
    );
    panel.onDidDispose(
      () => {
        this.dispose();
      },
      null,
      this.disposables
    );
    WindowCenter.register(this.name, panel); // 注册到窗口中心
  }

  render({ bundleScriptPath }) {
    const gender = vscode.workspace.getConfiguration('webviewReact').get('userApiGender', 'male');
    return `
      <!DOCTYPE html>
        <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>React App</title>
        </head>
    
        <body>
          <div id="root"></div>
          <script>
            const vscode = acquireVsCodeApi();
            const apiUserGender = "${gender}"
          </script>
          <script src="${bundleScriptPath}"></script>
        </body>
      </html>
    `;
  }
  getInstance() {
    return this.panel;
  }
  // 判断窗口实例是否存在
  isInstanceExist() {
    return !!this.panel;
  }
}

module.exports = BaseWindow;
