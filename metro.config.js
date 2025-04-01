// metro.config.js
const { getDefaultConfig } = require('expo/metro-config');
const path = require('path');

const config = getDefaultConfig(__dirname);

// Add .kitty extension to the sourceExts
config.resolver.sourceExts.push('kitty');

// Just add json explicitly
config.resolver.sourceExts.push('json');

module.exports = config;