if (typeof global.setImmediate === 'undefined') {
    global.setImmediate = (fn, ...args) => setTimeout(fn, 0, ...args);
}

if (typeof global.clearImmediate === 'undefined') {
    global.clearImmediate = (id) => clearTimeout(id);
}
