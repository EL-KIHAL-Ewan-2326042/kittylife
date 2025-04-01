// metro.config.js
const { getDefaultConfig } = require('expo/metro-config');
const path = require('path');

const config = getDefaultConfig(__dirname);

// Add .kitty extension to the sourceExts
config.resolver.sourceExts.push('kitty');

// Configure the transformer for .kitty files
config.transformer.babelTransformerPath = require.resolve('./kittyTransformer.js');

module.exports = config;