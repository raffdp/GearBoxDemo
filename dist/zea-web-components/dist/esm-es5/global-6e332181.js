var commonjsGlobal = typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};
function commonjsRequire() {
    throw new Error('Dynamic requires are not currently supported by @rollup/plugin-commonjs');
}
function createCommonjsModule(fn, module) {
    return module = { exports: {} }, fn(module, module.exports), module.exports;
}
function getCjsExportFromNamespace(n) {
    return n && n['default'] || n;
}
var global$1 = (typeof global !== "undefined" ? global :
    typeof self !== "undefined" ? self :
        typeof window !== "undefined" ? window : {});
export { createCommonjsModule as a, global$1 as b, commonjsGlobal as c, commonjsRequire as d, getCjsExportFromNamespace as g };
