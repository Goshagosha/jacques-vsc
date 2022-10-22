import { ChildProcess } from 'child_process';
import path = require('path');
import * as vscode from 'vscode';
import { BackendPaths, Settings } from './extension';
import { Example, Rule, RuleSource } from "./models";
const { spawn } = require('child_process');
import { SvelteVscMessageTypes, VscSvelteMessageTypes } from './messageTypes';

export class JacquesView {
    public static currentPanel: JacquesView | undefined;
    public static readonly viewType = 'jacques-vsc';

    private readonly _panel: vscode.WebviewPanel;
    private readonly _extensionUri: vscode.Uri;
    private readonly _backend: ChildProcess;
    private _disposables: vscode.Disposable[] = [];


    public static postToWebview(message: any) {
        if (JacquesView.currentPanel) {
            JacquesView.currentPanel._panel.webview.postMessage(message);
        }
    }

    public static async sendExampleToBackend(example: Example) {
        const response = await fetch('http://localhost:' + Settings.BACKEND_PORT + BackendPaths.pushExample, {
            method: 'POST',
            headers: {
                // eslint-disable-next-line @typescript-eslint/naming-convention
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(example)
        });
        const json = await response.json();
        this.postToWebview({ command: VscSvelteMessageTypes.exampleStatus, object: json });
        const toString = JSON.stringify(json);
        console.log("Server response: " + toString);
    }

    public static async sendTranslationRequestToBackend(dsl: string) {
        const response = await fetch('http://localhost:' + Settings.BACKEND_PORT + BackendPaths.translate, {
            method: 'POST',
            headers: {
                // eslint-disable-next-line @typescript-eslint/naming-convention
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ dsl: dsl })
        });
        const json = await response.json();
        this.postToWebview({ command: VscSvelteMessageTypes.translation, object: json });
        const toString = JSON.stringify(json);
        console.log("Server response: " + toString);
    }

    public static async sendRuleOverrideToBackend(ruleSource: RuleSource) {
        const response = await fetch('http://localhost:' + Settings.BACKEND_PORT + BackendPaths.overrideRule, {
            method: 'POST',
            headers: {
                // eslint-disable-next-line @typescript-eslint/naming-convention
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(ruleSource)
        });
        const json = await response.json();
        this.postToWebview({ command: VscSvelteMessageTypes.overrideStatus, object: json });
        const toString = JSON.stringify(json);
        console.log("Server response: " + toString);
    }

    public static async sendRuleSourceRequestToBackend(ruleId: string) {
        const response = await fetch('http://localhost:' + Settings.BACKEND_PORT + BackendPaths.getRuleSource + ruleId, {
            method: 'GET',
            headers: {
                // eslint-disable-next-line @typescript-eslint/naming-convention
                'Content-Type': 'application/json'
            },
        });
        const json = await response.json();
        this.postToWebview({ command: VscSvelteMessageTypes.ruleSource, object: json });
        const toString = JSON.stringify(json);
        console.log("Server response: " + toString);
    }


    public static async resetBackend() {
        const response = await fetch('http://localhost:' + Settings.BACKEND_PORT + BackendPaths.reset, {
            method: 'GET',
            headers: {
                // eslint-disable-next-line @typescript-eslint/naming-convention
                'Content-Type': 'application/json'
            },
        });
        const json = await response.json();
        console.log("Server response: " + JSON.stringify(json));
    }

    public static async sendProcessExamplesRequest() {
        const response = await fetch('http://localhost:' + Settings.BACKEND_PORT + BackendPaths.processAll, {
            method: 'GET',
            headers: {
                // eslint-disable-next-line @typescript-eslint/naming-convention
                'Content-Type': 'application/json'
            },
        });
        const json = await response.json();
        console.log("Server response: " + JSON.stringify(json));
    }

    public static async getRulesFromBackend() {
        const response = await fetch('http://localhost:' + Settings.BACKEND_PORT + BackendPaths.getRules, {
            method: 'GET',
            headers: {
                // eslint-disable-next-line @typescript-eslint/naming-convention
                'Content-Type': 'application/json'
            },
        });
        const json = await response.json();
        this.postToWebview({ command: VscSvelteMessageTypes.rules, object: json });
        console.log("Server response: " + JSON.stringify(json));
    }

    public static async createOrShow(extensionUri: vscode.Uri) {
        const column = vscode.window.activeTextEditor ? vscode.window.activeTextEditor.viewColumn : undefined;

        if (JacquesView.currentPanel) {
            JacquesView.currentPanel._panel.reveal(column);
            JacquesView.currentPanel._update();
            return;
        }

        const panel = vscode.window.createWebviewPanel(
            JacquesView.viewType,
            'Jacques',
            column || vscode.ViewColumn.One,
            {
                enableScripts: true,
                localResourceRoots: [vscode.Uri.joinPath(extensionUri, 'out', 'compiled'), vscode.Uri.joinPath(extensionUri, 'src', 'media')]
            }
        );

        console.log('Starting Jacques backend...');
        const jacques = await spawn('python', [vscode.Uri.joinPath(extensionUri, 'backend', 'server.py').fsPath, '--port', Settings.BACKEND_PORT.toString()],);


        jacques.stderr.on('data', function (data: string) {
            console.log('Server LOG: ' + data);
        });
        jacques.stderr.on('data', function (data: string) {
            console.log('Server LOG: ' + data);
        });

        JacquesView.currentPanel = new JacquesView(panel, extensionUri, jacques);
    }


    private static _getNonce() {
        let text = '';
        const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        for (let i = 0; i < 32; i++) {
            text += possible.charAt(Math.floor(Math.random() * possible.length));
        }
        return text;
    }

    private _getWebviewContent(webview: vscode.Webview) {
        const scriptUri = webview.asWebviewUri(vscode.Uri.file(path.join(this._extensionUri.fsPath, 'out', 'compiled', 'JacquesPage.js')));

        const stylesResetPath = vscode.Uri.file(path.join(this._extensionUri.fsPath, 'src', 'media', 'reset.css'));

        const stylesMainPath = vscode.Uri.file(path.join(this._extensionUri.fsPath, 'src', 'media', 'vscode.css'));

        const stylesResetUri = webview.asWebviewUri(stylesResetPath);
        const stylesMainUri = webview.asWebviewUri(stylesMainPath);
        const cssUri = webview.asWebviewUri(vscode.Uri.file(path.join(this._extensionUri.fsPath, 'out', 'compiled', 'JacquesPage.css')));

        const nonce = JacquesView._getNonce();

        return `<!DOCTYPE html>
			<html lang="en">
			<head>
				<meta charset="UTF-8">
				<!--
					Use a content security policy to only allow loading images from https or from our extension directory,
					and only allow scripts that have a specific nonce.
				-->
				<meta http-equiv="Content-Security-Policy" content="style-src ${webview.cspSource}; img-src ${webview.cspSource} https:;">
				<meta name="viewport" content="width=device-width, initial-scale=1.0">
				<link href="${stylesResetUri}" rel="stylesheet">
				<link href="${stylesMainUri}" rel="stylesheet">
                <link href="${cssUri}" rel="stylesheet">
				<title>Cat Coding</title>
			</head>
            <script nonce="${nonce}">
                const tsvscode = acquireVsCodeApi();
            </script>
            <script defer nonce="${nonce}" src="${scriptUri}"></script>
            <body>
            </body>
			</html>`;
    }

    private constructor(panel: vscode.WebviewPanel, extensionUri: vscode.Uri, backend: ChildProcess) {
        this._panel = panel;
        this._extensionUri = extensionUri;
        this._backend = backend;

        this._update();

        this._panel.onDidDispose(() => this.dispose(), null, this._disposables);

        this._panel.onDidChangeViewState(
            e => {
                if (this._panel.visible) {
                    this._update();
                }
            },
            null,
            this._disposables
        );

    }

    public dispose() {
        JacquesView.currentPanel = undefined;

        this._panel.dispose();

        while (this._disposables.length) {
            const x = this._disposables.pop();
            if (x) {
                x.dispose();
            }
        }
    }

    private _update() {
        const webview = this._panel.webview;
        this._panel.webview.html = this._getWebviewContent(webview);

        this._panel.webview.onDidReceiveMessage(
            message => {
                switch (message.type) {
                    case SvelteVscMessageTypes.example:
                        let example = new Example(message.id, message.sourceValue, message.targetValue);
                        console.log("Sending example to backend: " + JSON.stringify(example));
                        JacquesView.sendExampleToBackend(example);
                        return;
                    case SvelteVscMessageTypes.ruleOverride:
                        let rule = new RuleSource(message.id, message.name, message.dsl, message.code);
                        console.log("Sending rule update to backend: " + JSON.stringify(rule));
                        JacquesView.sendRuleOverrideToBackend(rule);
                        return;
                    case SvelteVscMessageTypes.getRuleSource:
                        console.log("Sending rule source request to backend: " + message.id);
                        JacquesView.sendRuleSourceRequestToBackend(message.id);
                        return;
                    case SvelteVscMessageTypes.processExamples:
                        JacquesView.sendProcessExamplesRequest();
                        return;
                    case SvelteVscMessageTypes.getRules:
                        JacquesView.getRulesFromBackend();
                        return;
                    case SvelteVscMessageTypes.translationRequest:
                        JacquesView.sendTranslationRequestToBackend(message.dsl);
                        return;
                    case SvelteVscMessageTypes.reset:
                        JacquesView.resetBackend();
                        return;
                }
            },
            null,
            this._disposables
        );
    }
}