const { withProjectBuildGradle, withAppBuildGradle, withPodfileProperties } = require('@expo/config-plugins');
const path = require('path');

// Modify the root project build.gradle file
const withCustomRootBuildGradle = (config) => {
	return withProjectBuildGradle(config, (config) => {
		const buildGradle = config.modResults.contents;
		// Add flatDir for multiple local modules
		const flatDirSnippet = `
allprojects {
	repositories {
		flatDir {
			dirs project(':ffmpeg-kit-react-native').projectDir.absolutePath + '/libs'
		}
	}
}
`;

		if (!buildGradle.includes(flatDirSnippet)) {
			config.modResults.contents = buildGradle + flatDirSnippet;
		}
		return config;
	});
};

// Modify the app-level build.gradle if necessary
const withCustomAppBuildGradle = (config) => {
	return withAppBuildGradle(config, (config) => {
		const appBuildGradle = config.modResults.contents;
		// Optionally, add app-specific configurations here
		return config;
	});
};

// Add the custom import to the CocoaPods.
export const withCustomCocoaPodsImport = (config) => {
	return withDangerousMod(config, [
		"ios",
		async (config) => {
			const file = path.join(config.modRequest.platformProjectRoot, "Podfile");

			let contents = await promises.readFile(file, "utf8");
			contents = mergeContents({
				tag: `ffmpeg-kit-react-native-import`,
				src: contents,
				newSrc: `  pod 'ffmpeg-kit-react-native', :subspecs => podfile_properties['ffmpeg-kit-react-native.subspecs'] || [], :podspec => File.join(File.dirname(\`node --print "require.resolve('ffmpeg-kit-react-native/package.json')"\`), "ffmpeg-kit-react-native.podspec")`,
				anchor: /use_native_modules/,
				// We can't go after the use_native_modules block because it might have parameters, causing it to be multi-line (see react-native template).
				offset: 0,
				comment: "#",
			}).contents;

			await promises.writeFile(file, contents, "utf-8");
			return config;
		},
	]);
};

// Set the custom variant as a podfile property
const withCustomPodfileProperties = (config, {variant}) => {
	return withPodfileProperties(config, (config) => {
		// @ts-ignore: wrong type
		config.modResults["ffmpeg-kit-react-native.subspecs"] = [
			variant,
		].filter(Boolean);
		return config;
	});
};

// Combine the changes
module.exports = (config, options) => {
	config = withCustomRootBuildGradle(config); // Modify root build.gradle
	config = withCustomAppBuildGradle(config);  // Modify app build.gradle
	if(options?.variant) {
		config = withCustomPodfileProperties(config, options); // Modify podfile
		config = withCustomCocoaPodsImport(config); // Modify podfile
	}
	return config;
};
