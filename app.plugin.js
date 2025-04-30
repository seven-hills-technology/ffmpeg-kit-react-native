const { withProjectBuildGradle, withAppBuildGradle, withPodfile } = require('@expo/config-plugins');
const fs = require('fs');
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

// Modify the podfile if necessary
const withCustomPodfile = (config, {variant}) => {
	return withPodfile(config, (config) => {
		if(variant) {
			config.modResults.contents = config.modResults.contents.replace(
				/pod ['"]ffmpeg-kit-react-native['"](\r\n|\r|\n)/,
				`pod 'ffmpeg-kit-react-native', :subspecs => [${JSON.stringify(variant)}]\$1`
			);
		}
		return config;
	});
};

// Combine the changes
module.exports = (config, options) => {
	config = withCustomRootBuildGradle(config); // Modify root build.gradle
	config = withCustomAppBuildGradle(config);  // Modify app build.gradle
	config = withCustomPodfile(config); // Modify podfile
	return config;
};
