import * as vscode from 'vscode';

export function activate(context: vscode.ExtensionContext) {

	let disposable = vscode.commands.registerCommand('tabspacerselect.replaceTabsWithSpacesSelected', () => {
        const editor = vscode.window.activeTextEditor;
        const selectedText  = editor?.selections;
		const tabSize : number = editor?.options.tabSize as number ?? 4;

		if (!selectedText || selectedText[0].isEmpty) {
			vscode.window.showInformationMessage("No text selected.");
			return;
		}

        editor?.edit(builder => {
            for (const selection of selectedText) {
				let selectedText = editor.document.getText(selection);
				const linesInSelection = selectedText.split("\n");
				let newSelection = "";

				for (let [index, line] of linesInSelection.entries()) {
					if (line) {
						let replacement = "";

                        while (line.indexOf("\t") !== -1) {
                            let tabIndex = line.indexOf("\t");
                            let segment = line.substring(0, tabIndex);
                            let tabSpaces = tabSize - (segment.length % tabSize);
                            replacement =
                                segment + " ".repeat(tabSpaces) + line.substring(tabIndex + 1);
                            line = replacement;
                        }
					}

					newSelection += line;
					newSelection += index === linesInSelection.length - 1 ? "" : "\n";
				}

                builder.replace(selection, newSelection);
            }
        });
	});

	context.subscriptions.push(disposable);
}

export function deactivate() {}
