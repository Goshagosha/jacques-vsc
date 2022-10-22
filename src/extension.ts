// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import { JacquesView } from './JacquesView';

export class Settings {
	// eslint-disable-next-line @typescript-eslint/naming-convention
	public static BACKEND_PORT = 8000;

}

export class BackendPaths {
	public static pushExample = '/push_example';
	public static overrideRule = '/override_rule';
	public static reset = '/reset';
	public static getRules = '/get_rules';
	public static processAll = '/process_all_examples';
	public static getRuleSource = '/get_rule_source/';
	public static translate = '/translate';
}


// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, your extension "jacques-vsc" is now active!');


	context.subscriptions.push(
		vscode.commands.registerCommand('jacques-vsc.start', () => {
			JacquesView.createOrShow(context.extensionUri);
		}),

		vscode.commands.registerCommand('jacques-vsc.refresh', () => {
			JacquesView.currentPanel?.dispose();
			JacquesView.createOrShow(context.extensionUri);
		})
	);
}

// this method is called when your extension is deactivated
export function deactivate() { }