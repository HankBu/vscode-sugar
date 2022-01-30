import * as vscode from 'vscode';
import * as path from 'path';
import { getAPIUserGender } from '../config';
import { Message, CommonMessage } from './messages/messageTypes';
const { BaseWindow, WindowCenter } = require('../vscode-sugar');

export class ViewLoaderNew {
  public static currentPanel?: vscode.WebviewPanel;

  private panel: vscode.WebviewPanel;
  private context: vscode.ExtensionContext;
  private disposables: vscode.Disposable[];

  constructor(context: vscode.ExtensionContext) {
    this.context = context;
    this.disposables = [];

    this.panel = new BaseWindow({
      name: 'demoPanel',
      titleName: 'helloworld',
      context,
    });

    // listen messages from webview
    this.panel.webview.onDidReceiveMessage(
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

    this.panel.onDidDispose(
      () => {
        this.dispose();
      },
      null,
      this.disposables
    );
  }

  static showWebview(context: vscode.ExtensionContext) {
    const cls = this;
    const column = vscode.window.activeTextEditor
      ? vscode.window.activeTextEditor.viewColumn
      : undefined;
    if (cls.currentPanel) {
      cls.currentPanel.reveal(column);
    } else {
      cls.currentPanel = new cls(context).panel;
    }
  }

  static postMessageToWebview<T extends Message = Message>(message: T) {
    // post message from extension to webview
    const cls = this;
    cls.currentPanel?.webview.postMessage(message);
  }

  public dispose() {
    ViewLoaderNew.currentPanel = undefined;

    // Clean up our resources
    this.panel.dispose();

    while (this.disposables.length) {
      const x = this.disposables.pop();
      if (x) {
        x.dispose();
      }
    }
  }
}
