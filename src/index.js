/* globals NSWorkspace, NSURL, NSWorkspaceLaunchWithoutActivation, NSTemporaryDirectory */
import sketch from 'sketch';

const iconPreviewBundleId = 'com.sindresorhus.Icon-Preview';

function openInIconPreview(artboard, directoryPath) {
	const workspace = NSWorkspace.sharedWorkspace();
	const filePath = `${directoryPath}${artboard.id}.png`;

	workspace.openURLs_withAppBundleIdentifier_options_additionalEventParamDescriptor_launchIdentifiers(
		[
			NSURL.fileURLWithPath(filePath),
		],
		iconPreviewBundleId,
		NSWorkspaceLaunchWithoutActivation,
		null,
		null,
	);
}

export function onDocumentSaved(context) {
	const document = sketch.fromNative(context.actionContext.document);

	const selectedArtboard = document.selectedPage.layers.find(layer => layer.type === 'Artboard' && layer.name.includes('AppIcon'));
	if (!selectedArtboard) {
		return;
	}

	const directoryPath = `${NSTemporaryDirectory()}icon-preview/`;

	sketch.export(selectedArtboard, {
		output: directoryPath,
		formats: 'png',
		overwriting: true,
		'use-id-for-name': true,
	});

	openInIconPreview(selectedArtboard, directoryPath);
}
