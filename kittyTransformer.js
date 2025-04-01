// kittyTransformer.js
const metroTransformer = require('metro-react-native-babel-transformer');

module.exports.transform = async function({ src, filename, options }) {
    if (filename.endsWith('.kitty')) {
        try {
            // Parse the JSON content
            const json = JSON.parse(src);

            // Transform to a valid JS module that exports the JSON
            // Make sure all statements end with semicolons and use proper module.exports syntax
            return {
                code: `"use strict";\n\nconst data = ${JSON.stringify(json, null, 2)};\n\nmodule.exports = data;\n`,
            };
        } catch (error) {
            throw new Error(`Error parsing ${filename}: ${error.message}`);
        }
    }

    // For all other files, use the default transformer
    return metroTransformer.transform({ src, filename, options });
};