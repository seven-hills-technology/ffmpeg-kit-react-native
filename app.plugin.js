const { withProjectBuildGradle, withPlugins } = require('@expo/config-plugins');

module.exports = function withCustomAar(config) {
	return withPlugins(config, [
	  function(config) {
		  return withProjectBuildGradle(config, config => {
			if (!config.modResults.contents.includes('flatDir')) {
			  config.modResults.contents = config.modResults.contents.replace(
				/allprojects\s*{[^}]*repositories\s*{[^}]*}/,
				match => {
				  return match.replace(
					/repositories\s*{/, 
					`repositories {\n        flatDir {\n            dirs project(':ffmpeg-kit-react-native').file('repo')\n        }`
				  );
				}
			  );
			}
			return config;
		  });
	  },
	]);
}
