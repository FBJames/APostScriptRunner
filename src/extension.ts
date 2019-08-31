// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';


// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) 
{
	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, your extension "apostscriptrunner" is now active!');

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with registerCommand
	// The commandId parameter must match the command field in package.json
	//vscode.window.showInformationMessage('Initialized APost Script Runner!');

	// let disposable = vscode.commands.registerCommand('extension.RunAPostScript', () => {
	// 	// The code you place here will be executed every time your command is executed

	// 	// Display a message box to the user
	// 	vscode.window.showInformationMessage('Success to run RunAPostScript command');
	// });
    
    //let disposable1 = vscode.commands.registerCommand('extension.RunAPostScript1', RunScriptAsText);
	let disposable2 = vscode.commands.registerCommand('extension.RunScriptFile', RunScriptAsFile);
	let disposable3 = vscode.commands.registerCommand('extension.InputInitializeCode', SetInitializeToCSXFile);
    //context.subscriptions.push(disposable1);
	context.subscriptions.push(disposable2);
	context.subscriptions.push(disposable3);    
}
exports.activate = activate;

function GetAPostDirectory()
{
	const fs = require("fs"); // Or `import fs from "fs";` with ESM
	
	var path = require("path");
	var config = vscode.workspace.getConfiguration('APostScriptRunner');
	var apostPath = config.get('APostPath') as string;

	var apostDir ='';
	if (fs.existsSync(apostPath)) 
	{
		apostDir = apostPath;
	}
	else
	{
		apostDir = 'D:/SVNSOURCE/VeniceGUI/Post/Binary/Debug';		
	}
	//scriptRunner = scriptRunner + "CsiApost.exe"
	var apostscriptRunner = path.join(apostDir, "CsiApost.exe");
	if (!fs.existsSync(apostscriptRunner)) 
	{
		vscode.window.showErrorMessage('Could not find CsiApost.exe, please check the config. [APostScriptRunner.APostPath]');
	}
	return apostscriptRunner;
}

function RunScriptAsText()
{
	var vscode = require("vscode");
	const { spawn  } = require('child_process');
	if (vscode.window.activeTextEditor.document.isUntitled) {
		vscode.window.showErrorMessage('Please save the document before running scriptcs!');
		return;
	}
	var alltext = vscode.window.activeTextEditor.document.getText();	
	var scriptRunner = GetAPostDirectory();
	
	spawn(scriptRunner, ['/s', alltext]);	
}

function RunScriptAsFile()
{
	var vscode = require("vscode");
	const { spawn  } = require('child_process');
	
	var currentlyOpenTabfilePath = vscode.window.activeTextEditor.document.fileName;    
	var scriptRunner = GetAPostDirectory();
	
	var command1 = `Output.WriteInfo(@"${currentlyOpenTabfilePath} will be executed from VSCODE","VSCODE")`;
	var command2 = currentlyOpenTabfilePath;
	spawn(scriptRunner, ['/s', command1]);
	spawn(scriptRunner, [command2]);	
}

function SetInitializeToCSXFile()
{
	var path = require("path");
	var fs = require("fs");
	var vscode = require("vscode");	

	const textEditor = vscode.window.activeTextEditor;
	var selection = vscode.window.activeTextEditor.selection;
	
	// make path for interface
	var config = vscode.workspace.getConfiguration('APostScriptRunner');
	var apostPath = config.get('APostPath') as string;
	if (!fs.existsSync(apostPath))
	{
		apostPath = 'C:/Program Files/FunctionBay, Inc/Standalone Post V0R2'; // Default installation folder
	}
	if (!fs.existsSync(apostPath))
	{
		vscode.window.showWarningMessage('The Standealone Post installation folder could not be found: ' + apostPath);
	}	

	var szInitializeCSX = path.join(apostPath, "ScriptEditor/VSCODE/Initialize.csx");
	if (!fs.existsSync(szInitializeCSX))
	{
		vscode.window.showErrorMessage('The Initialize.csx could not be found');
		return;
	}

	var newText = "#load \"" + szInitializeCSX + "\"\n";
	
	textEditor.edit(function(edit:vscode.TextEditorEdit): void{edit.replace(selection, newText);});	
	//vscode.commands.executeCommand('editor.action.addCommentLine'); // 주석처리
}

// this method is called when your extension is deactivated
export function deactivate() {}
