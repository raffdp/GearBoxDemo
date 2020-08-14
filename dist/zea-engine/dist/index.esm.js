function isIOSDevice() {
  return (
    (navigator.userAgent.match(/iPhone/i) ||
      navigator.userAgent.match(/iPad/i) ||
      navigator.userAgent.match(/iPod/i)) != null
  )
}

function isMobileDevice() {
  return (
    (navigator.userAgent.match(/Android/i) ||
      navigator.userAgent.match(/webOS/i) ||
      navigator.userAgent.match(/iPhone/i) ||
      navigator.userAgent.match(/iPad/i) ||
      navigator.userAgent.match(/iPod/i) ||
      navigator.userAgent.match(/BlackBerry/i) ||
      navigator.userAgent.match(/Pixel/i) ||
      navigator.userAgent.match(/Windows Phone/i)) != null
  )
}

function getBrowserDesc() {
  const nAgt = navigator.userAgent;
  let browserName = navigator.appName;
  let fullVersion = '' + parseFloat(navigator.appVersion);
  let majorVersion = parseInt(navigator.appVersion, 10);
  let nameOffset;
  let verOffset;
  let ix;

  if (navigator.brave) {
    browserName = 'Brave';
    verOffset = nAgt.indexOf('Chrome');
    fullVersion = nAgt.substring(verOffset + 7, nAgt.indexOf(' ', verOffset + 7));
  }

  // In Opera, the true version is after "Opera" or after "Version"
  else if ((verOffset = nAgt.indexOf('Opera')) != -1) {
    browserName = 'Opera';
    fullVersion = nAgt.substring(verOffset + 6);
    if ((verOffset = nAgt.indexOf('Version')) != -1) fullVersion = nAgt.substring(verOffset + 8);
  }
  // In MSIE, the true version is after "MSIE" in userAgent
  else if ((verOffset = nAgt.indexOf('MSIE')) != -1) {
    browserName = 'Microsoft Internet Explorer';
    fullVersion = nAgt.substring(verOffset + 5);
  } else if ((verOffset = nAgt.indexOf('Edge')) != -1) {
    browserName = 'Edge';
    fullVersion = nAgt.substring(verOffset + 4);
  }
  // In Chrome, the true version is after "Chrome"
  else if ((verOffset = nAgt.indexOf('Chrome')) != -1) {
    browserName = 'Chrome';
    fullVersion = nAgt.substring(verOffset + 7, nAgt.indexOf(' ', verOffset + 7));
  }

  // TOOD: Parse Samsung userAgent
  // https://developer.samsung.com/technical-doc/view.do?v=T000000203

  // In Safari, the true version is after "Safari" or after "Version"
  else if ((verOffset = nAgt.indexOf('Safari')) != -1) {
    browserName = 'Safari';
    fullVersion = nAgt.substring(verOffset + 7);
    if ((verOffset = nAgt.indexOf('Version')) != -1) fullVersion = nAgt.substring(verOffset + 8);
  }
  // In Firefox, the true version is after "Firefox"
  else if ((verOffset = nAgt.indexOf('Firefox')) != -1) {
    browserName = 'Firefox';
    fullVersion = nAgt.substring(verOffset + 8);
  }
  // In most other browsers, "name/version" is at the end of userAgent
  else if ((nameOffset = nAgt.lastIndexOf(' ') + 1) < (verOffset = nAgt.lastIndexOf('/'))) {
    browserName = nAgt.substring(nameOffset, verOffset);
    fullVersion = nAgt.substring(verOffset + 1);
    if (browserName.toLowerCase() == browserName.toUpperCase()) {
      browserName = navigator.appName;
    }
  }
  // trim the fullVersion string at semicolon/space if present
  if ((ix = fullVersion.indexOf(';')) != -1) fullVersion = fullVersion.substring(0, ix);
  if ((ix = fullVersion.indexOf(' ')) != -1) fullVersion = fullVersion.substring(0, ix);

  majorVersion = parseInt('' + fullVersion, 10);
  if (isNaN(majorVersion)) {
    fullVersion = '' + parseFloat(navigator.appVersion);
    majorVersion = parseInt(navigator.appVersion, 10);
  }

  return {
    browserName,
    fullVersion,
    majorVersion,
    appName: navigator.appName,
    userAgent: navigator.userAgent,
  }
}

function getGPUDesc() {
  let webgl;
  try {
    webgl = document.createElement('canvas').getContext('webgl');
  } catch (e) {}
  if (!webgl) return
  let webgl2;
  try {
    webgl2 = document.createElement('canvas').getContext('webgl2');
  } catch (e) {}

  const debugInfo = webgl.getExtension('WEBGL_debug_renderer_info');
  if (!debugInfo) {
    console.warn('Unable to determine GPU Info:');
    return {
      vendor: 'Unknown',
      renderer: 'Unknown',
      gpuVendor: 'Unknown',
      maxTextureSize: 'Unknown',
      supportsWebGL2: webgl2 != undefined,
    }
  }

  const vendor = webgl.getParameter(debugInfo.UNMASKED_VENDOR_WEBGL);
  const renderer = webgl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL);
  const maxTextureSize = webgl.getParameter(webgl.MAX_TEXTURE_SIZE);
  let gpuVendor;
  if (renderer.match(/NVIDIA/i)) {
    gpuVendor = 'NVidia';
  } else if (renderer.match(/AMD/i) || renderer.match(/Radeon/i)) {
    gpuVendor = 'AMD';
  } else if (renderer.match(/Intel/i)) {
    gpuVendor = 'Intel';
  } else if (renderer.match(/Mali/i)) {
    gpuVendor = 'ARM';
  } else if (renderer.match(/Adreno/i)) {
    gpuVendor = 'Adreno';
  } else {
    console.warn('Unable to determine GPU vendor:', renderer);
  }

  return {
    vendor,
    renderer,
    gpuVendor,
    maxTextureSize,
    supportsWebGL2: webgl2 != undefined,
  }
}

const SystemDesc = (function () {
  if (!globalThis.navigator) {
    return {
      isMobileDevice: false,
      isIOSDevice: false,
      browserName: 'Node',
      webGLSupported: false,
      gpuDesc: null,
      deviceCategory: 'High',
    }
  }
  const isMobile = isMobileDevice();
  const browserDesc = getBrowserDesc();
  const gpuDesc = getGPUDesc();

  let deviceCategory = 'Low';
  if (gpuDesc) {
    // We divide devices into 3 categories.
    // 0: low end, we dial everything down as much as possible
    // 1: mid-range, Enb maps and Textures go to mid-lods.
    //    Typically these devices are laptops, so the textures can't be too blurry
    // 2: High-end: turn up as much as needed.
    if (!isMobile) {
      // Remove braces and split into parts
      const parts = gpuDesc.renderer.replace(/[()]/g, '').split(' ');
      if (gpuDesc.gpuVendor == 'NVidia') {
        const gtxIdx = parts.indexOf('GTX');
        if (gtxIdx != -1) {
          const model = parts[gtxIdx + 1];
          if (model.endsWith('M')) {
            // laptop GPU.
            const modelNumber = parseInt(model.substring(0, model.length - 2));
            if (modelNumber >= 900) {
              deviceCategory = 'Medium';
            } else {
              deviceCategory = 'Low';
            }
          } else {
            const modelNumber = parseInt(model);
            if (modelNumber >= 1030) {
              deviceCategory = 'High';
            } else {
              deviceCategory = 'Medium';
            }
          }
        } else {
          if (parts.indexOf('TITAN') != -1 || parts.indexOf('Quadro') != -1) {
            deviceCategory = 'High';
          } else {
            deviceCategory = 'Low';
          }
        }
      } else if (gpuDesc.gpuVendor == 'AMD') {
        const radeonIdx = parts.indexOf('Radeon');
        if (radeonIdx != -1) {
          const rxIdx = parts.indexOf('RX');
          if (rxIdx != -1) {
            if (parts[rxIdx + 1] == 'Vega') {
              deviceCategory = 'High';
            } else {
              const model = parts[rxIdx + 1];
              let modelNumber;
              if (model.endsWith('X')) {
                modelNumber = parseInt(model.substring(0, model.length - 2));
                deviceCategory = 'High';
              } else {
                modelNumber = parseInt(model);
              }

              if (modelNumber >= 480) {
                deviceCategory = 'High';
              } else {
                deviceCategory = 'Medium';
              }
            }
          } else if (parts[radeonIdx + 1] == 'Pro') {
            const modelNumber = parseInt(parts[rxIdx + 1]);
            if (modelNumber >= 450) {
              deviceCategory = 'Medium';
            } else {
              deviceCategory = 'Low';
            }
          } else if (parts[radeonIdx + 1] == 'Sky') {
            const modelNumber = parseInt(parts[rxIdx + 1]);
            if (modelNumber >= 700) {
              deviceCategory = 'Medium';
            } else {
              deviceCategory = 'Low';
            }
          } else {
            deviceCategory = 'Low';
          }
        } else {
          if (parts.indexOf('FirePro') != -1 || parts.indexOf('Quadro') != -1) {
            deviceCategory = 'High';
          } else {
            deviceCategory = 'Low';
          }
        }
      } else if (gpuDesc.gpuVendor == 'Adreno') {
        deviceCategory = 'Low';
      } else if (gpuDesc.gpuVendor == 'Intel') {
        deviceCategory = 'Low';
      }
    } else {
      deviceCategory = 'Low';
    }
  }

  return {
    isMobileDevice: isMobile,
    isIOSDevice: isIOSDevice(),
    browserName: browserDesc.browserName,
    fullVersion: browserDesc.fullVersion,
    majorVersion: browserDesc.majorVersion,
    appName: browserDesc.appName,
    userAgent: browserDesc.userAgent,
    webGLSupported: gpuDesc != undefined,
    gpuDesc,
    deviceCategory,
  }
})();

if (!globalThis.ZeaSystemDesc) {
  globalThis.ZeaSystemDesc = SystemDesc;
}

const UInt8 = 0;
const SInt8 = 1;
const UInt16 = 2;
const SInt16 = 3;
const UInt32 = 4;
const SInt32 = 5;
const Float32 = 6;

/**
 * Math Functions
 */
class MathFunctions {
  /**
   * Converts Radians to Degrees
   *
   * @static
   * @param {number} rad - Radians value
   * @return {number} - Degrees equivalent
   */
  static radToDeg(rad) {
    return rad / (Math.PI / 180)
  }

  /**
   * Converts Degrees to Radiants
   *
   * @static
   * @param {number} deg - Degrees value
   * @return {number} -  Radians equivalent
   */
  static degToRad(deg) {
    return deg * (Math.PI / 180)
  }

  /**
   * Verifies if the specified parameter is numeric.
   *
   * @static
   * @param {number|any} number - Number to test
   * @return {boolean} - `true` when is a valid number
   */
  static isNumeric(number) {
    return !isNaN(parseFloat(number)) && isFinite(number)
  }

  /**
   * Generates and returns a random integer within the specified range.
   *
   * @static
   * @param {number} min - Lower value random int can be.
   * @param {number} max - Highest value random int can be.
   * @return {number} - Random number inside range.
   */
  static randomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min
  }

  /**
   * Calculates a lineal interpolation between two inputs for the specified parameter(t).
   *
   * @static
   * @param {number} v0 -
   * @param {number} v1 -
   * @param {number} t -
   * @return {number} -
   */
  static lerp(v0, v1, t) {
    return v0 + t * (v1 - v0)
  }

  /**
   * Restricts the specified value between two numbers
   *
   * @static
   * @param {number} value
   * @param {number} min
   * @param {number} max
   * @return {number}
   */
  static clamp(value, min, max) {
    return Math.min(Math.max(value, min), max)
  }

  /**
   * Returns the nearest pow of two value of the specified number.
   *
   * @static
   * @param {number} value -
   * @return {number} -
   */
  static nearestPow2(value) {
    return Math.pow(2, Math.round(Math.log(value) / Math.log(2)))
  }

  /**
   * Returns the nearest pow of ten value of the specified number.
   *
   * @static
   * @param {number} value -
   * @return {number} -
   */
  static nearestPow10(value) {
    return Math.pow(10, Math.round(Math.log10(value) / Math.log10(10)))
  }

  /**
   * Returns the next pow of two value of the specified number.
   *
   * @static
   * @param {number} value -
   * @return {number} -
   */
  static nextPow2(value) {
    let exp = 0;

    while (value > 0) {
      exp++;
      value = value >> 1;
    }

    return 1 << exp
  }

  /**
   * Returns the fractional component of a number
   *
   * @static
   * @param {number} value -
   * @return {number} -
   */
  static fract(value) {
    if (value == 0) return 0
    if (value < 0) {
      if (value > -1.0) return -value
      return -value % Math.floor(-value)
    }
    if (value < 1.0) return value
    return value % Math.floor(value)
  }

  /**
   * Moves the specified value from one numeric domain(range) to another.
   *
   * @static
   * @param {number} value -
   * @param {number} start1 -
   * @param {number} end1 -
   * @param {number} start2 -
   * @param {number} end2 -
   * @return {number} -
   */
  static remap(value, start1, end1, start2, end2) {
    return start2 + (end2 - start2) * ((value - start1) / (end1 - start1))
  }

  /**
   * Perform Hermite interpolation between two values
   *
   * @static
   * @param {number} edge0 -
   * @param {number} edge1 -
   * @param {number} x -
   * @return {number} -
   */
  static smoothStep(edge0, edge1, x) {
    const t = this.clamp((x - edge0) / (edge1 - edge0), 0.0, 1.0);
    return t * t * (3.0 - 2.0 * t)
  }

  /**
   * Performs - interpolation between two values
   *
   * @static
   * @param {number} edge0 -
   * @param {number} edge1 -
   * @param {number} x -
   * @return {number} -
   */
  static linStep(edge0, edge1, x) {
    return this.clamp((x - edge0) / (edge1 - edge0), 0.0, 1.0)
  }

  /**
   * Decodes a Float16 from two unsigned Int8
   *
   * @static
   * @param {Uint8Array} c - Array with the two UInt8
   * @return {number} - Decoded Float16
   */
  static decode16BitFloatFrom2xUInt8(c) {
    const ix = c[0]; // 1st byte: 1 bit signed num, 4 bits exponent, 3 bits mantissa (MSB)
    const iy = c[1]; // 2nd byte: 8 bit mantissa (LSB)

    const s = ix & 0x80 ? 1 : -1; // get bit 8
    const iexp = (ix & 0x78) >> 3; // mask bits 7-4
    const msb = ix & 0x7; // mask bits 3-1

    let norm = iexp == 0 ? 0 : 2048; // distinguish between normalized and sub-normalized numbers
    const mantissa = norm + (msb << 8) + iy; // implicit preceding 1 or 0 added here
    norm = iexp == 0 ? 1 : 0; // normalization toggle
    const exponent = Math.pow(2, iexp + norm - 16); // -5 for the the exponent bias from 2^-5 to 2^10 plus another -11 for the normalized 12 bit mantissa
    const v = s * mantissa * exponent;

    return v
  }

  /**
   * Encodes an array of two unsigned Int8 to a Float16
   *
   * @static
   * @param {number} v - Float16 number
   * @return {Uint8Array} - Encoded Unsigned Int8 array
   */
  static encode16BitFloatInto2xUInt8(v) {
    const c = new Uint8Array(2);
    // const c = [0, 0];
    const signum = v >= 0 ? 128 : 0;
    v = Math.abs(v);
    let exponent = 15;
    let limit = 1024; // considering the bias from 2^-5 to 2^10 (==1024)
    for (let exp = 15; exp > 0; exp--) {
      if (v < limit) {
        limit /= 2;
        exponent--;
      }
    }

    let rest;
    if (exponent == 0) {
      rest = v / limit / 2; // "sub-normalize" implicit preceding 0.
    } else {
      rest = (v - limit) / limit; // normalize accordingly to implicit preceding 1.
    }

    const mantissa = Math.round(rest * 2048); // 2048 = 2^11 for the (split) 11 bit mantissa
    const msb = mantissa / 256; // the most significant 3 bits go into the lower part of the first byte
    const lsb = mantissa - msb * 256; // there go the other 8 bit of the lower significance

    c[0] = signum + exponent * 8 + msb; // color normalization for texture2D
    c[1] = lsb;

    if (v >= 2048) {
      c[0] = 255;
    }

    return c
  }

  /**
   * Transforms a 16 bit float to an encoded integer.
   *
   * @static
   * @param {number} v - Float16 number to encode
   * @return {number} - Encoded number
   */
  static encode16BitFloat(v) {
    const float32Array = new Float32Array(1);
    float32Array[0] = v;
    const int32View = new Int32Array(float32Array.buffer);

    const toUInt16 = (x) => {
      let bits = (x >> 16) & 0x8000; /* Get the sign */
      let m = (x >> 12) & 0x07ff; /* Keep one extra bit for rounding */
      const e = (x >> 23) & 0xff; /* Using int is faster here */

      /* If zero, or de-normal, or exponent underflows too much for a de-normal
       * half, return signed zero. */
      if (e < 103) {
        return bits
      }

      /* If NaN, return NaN. If Inf or exponent overflow, return Inf. */
      if (e > 142) {
        bits |= 0x7c00;
        /* If exponent was 0xff and one mantissa bit was set, it means NaN,
         * not Inf, so make sure we set one mantissa bit too. */
        bits |= (e == 255 ? 0 : 1) && x & 0x007fffff;
        return bits
      }

      /* If exponent underflows but not too much, return a de-normal */
      if (e < 113) {
        m |= 0x0800;
        /* Extra rounding may overflow and set mantissa to 0 and exponent
         * to 1, which is OK. */
        bits |= (m >> (114 - e)) + ((m >> (113 - e)) & 1);
        return bits
      }

      bits |= ((e - 112) << 10) | (m >> 1);
      /* Extra rounding. An overflow will set mantissa to 0 and increment
       * the exponent, which is OK. */
      bits += m & 1;

      return bits
    };

    return toUInt16(int32View[0])
  }

  /**
   * As opposite of the `encode16BitFloat` method, this takes an encoded integer value,
   * and returns the 16 bit float.
   *
   * @static
   * @param {number} h - Encoded integer
   * @return {number} - Decoded 16 bit float.
   */
  static decode16BitFloat(h) {
    const s = (h & 0x8000) >> 15;
    const e = (h & 0x7c00) >> 10;
    const f = h & 0x03ff;

    if (e == 0) {
      return (s ? -1 : 1) * Math.pow(2, -14) * (f / Math.pow(2, 10))
    } else if (e == 0x1f) {
      return f ? NaN : (s ? -1 : 1) * Infinity
    }

    return (s ? -1 : 1) * Math.pow(2, e - 15) * (1 + f / Math.pow(2, 10))
  }

  /**
   * Transforms an array of Float 32 to an array of unsigned Int16.
   *
   * @static
   * @param {Float32Array} float32Array -
   * @return {Uint16Array} - Unsigned Int16 array representative of the Float32Array
   */
  static convertFloat32ArrayToUInt16Array(float32Array) {
    const unit16s = new Uint16Array(float32Array.length);
    const int32View = new Int32Array(float32Array.buffer);
    const toUInt16 = (x) => {
      let bits = (x >> 16) & 0x8000; /* Get the sign */
      let m = (x >> 12) & 0x07ff; /* Keep one extra bit for rounding */
      const e = (x >> 23) & 0xff; /* Using int is faster here */

      /* If zero, or de-normal, or exponent underflows too much for a de-normal
       * half, return signed zero. */
      if (e < 103) {
        return bits
      }

      /* If NaN, return NaN. If Inf or exponent overflow, return Inf. */
      if (e > 142) {
        bits |= 0x7c00;
        /* If exponent was 0xff and one mantissa bit was set, it means NaN,
         * not Inf, so make sure we set one mantissa bit too. */
        bits |= (e == 255 ? 0 : 1) && x & 0x007fffff;
        return bits
      }

      /* If exponent underflows but not too much, return a de-normal */
      if (e < 113) {
        m |= 0x0800;
        /* Extra rounding may overflow and set mantissa to 0 and exponent
         * to 1, which is OK. */
        bits |= (m >> (114 - e)) + ((m >> (113 - e)) & 1);
        return bits
      }

      bits |= ((e - 112) << 10) | (m >> 1);
      /* Extra rounding. An overflow will set mantissa to 0 and increment
       * the exponent, which is OK. */
      bits += m & 1;

      return bits
    };
    for (let i = 0; i < float32Array.length; i++) {
      unit16s[i] = toUInt16(int32View[i]);
    }
    return unit16s
  }
}

let _registeredBlueprints = {};
let _blueprintNames = {};
let _blueprints = [];

/**
 * Registry is a static factory that handles registration/reconstruction of
 * persisted type of data, this includes classes and types.
 *
 * Note: blueprintName is required because on minification process
 * the name of classes change and we can't simply use '....constructor.name'.
 * So, we need a way of relating minified blueprint names to the one stored for persistency.
 * <br>
 * i.e.
 * ```javascript
 * // Import registry class
 * class Foo() {}
 *
 * Registry.register('Foo', Foo)
 * // In case 'Foo' class gets its name changed to 'c' on minification,
 * // and the persisted data type is 'Foo', we would know how to relate them.
 * ```
 *
 * @static
 * @class Registry
 */
const Registry = {
  /**
   * Registers a new blueprint in the factory.
   *
   * @param {string} blueprintName - Name of the registered blueprint(Class, type, etc)
   * @param {function|number|any} blueprint - Blueprint representation(Class function, type)
   */
  register: (blueprintName, blueprint) => {
    if (_registeredBlueprints[blueprintName]) throw new Error(`There's a class registered with '${blueprintName}' name`)
    _registeredBlueprints[blueprintName] = { blueprint, callbacks: [] };

    // Note: To provide backwards compatibility, same blueprint can be stored under multiple names.
    // Thats the reason behind using indexes instead of the blueprint.
    const blueprintIndex = _blueprints.length;
    _blueprints.push(blueprint);
    _blueprintNames[blueprintIndex] = blueprintName;
  },
  /**
   * Returns blueprint function/type by specifying its name.
   *
   * @param {string} blueprintName - Name of the registered blueprint(Class, type, etc)
   * @return {function|number|any} - Blueprint representation(Class function, type)
   */
  getBlueprint: (blueprintName) => {
    if (_registeredBlueprints[blueprintName]) return _registeredBlueprints[blueprintName].blueprint

    throw new Error(`${blueprintName} blueprint is not registered`)
  },
  /**
   * Returns class name using passing an instantiated object.
   * If it is not registered, the name in constructor is returned.
   *
   * @param {function|number|any|undefined} blueprintInstance - Blueprint representation(Class function, type)
   * @return {string} - Name of the registered blueprint(Class, type, etc)
   */
  getBlueprintName: (blueprintInstance) => {
    let blueprint = blueprintInstance;
    let blueprintName = blueprintInstance;

    if (typeof blueprintInstance === 'object') {
      blueprint = blueprintInstance.constructor;
      blueprintName = blueprint.name;
    }

    const blueprintId = _blueprints.indexOf(blueprint);
    if (blueprintId >= 0 && _blueprintNames[blueprintId]) return _blueprintNames[blueprintId]

    throw new Error(`${blueprintName} blueprint is not registered`)
  },
  /**
   * Accepting the class name and `N` number of arguments, instantiates a new object of the specified class.
   * If the class is not registered, then `null` is returned.
   * <br>
   * **Note:** Although the class arguments are not literally specified in the parameters,
   * you can pass them(As many as needed).
   *
   * @param {string} blueprintName - Name of the registered blueprint(Class, type, etc)
   * @return {object|null} - Instantiated object of the specified class
   */
  constructClass: (blueprintName, ...args) => {
    const blueprintData = _registeredBlueprints[blueprintName];
    if (!blueprintData) throw new Error(`${blueprintName} blueprint is not registered`)

    // eslint-disable-next-line new-cap
    return new blueprintData.blueprint(...args)
  },
  /**
   * For testing purpose only, never call this outside of the test scope.
   *
   * @private
   */
  flush: () => {
    _registeredBlueprints = {};
    _blueprintNames = {};
    _blueprints = [];
  },
};

Registry.register('UInt8', UInt8);
Registry.register('SInt8', SInt8);
Registry.register('UInt16', UInt16);
Registry.register('SInt16', SInt16);
Registry.register('UInt32', UInt32);
Registry.register('SInt32', SInt32);
Registry.register('Float32', Float32);

/**
 * String functions
 *
 */
class StringFunctions {
  /**
   * Replaces all matches in a string.
   *
   * @static
   * @param {string} str -
   * @param {string|RegExp} pattern -
   * @param {string} replacement -
   * @return {string} -
   */
  static replaceAll(str, pattern, replacement) {
    return str.replace(new RegExp(pattern, 'g'), replacement)
  }

  /**
   * Returns JSON object as a formatted string, but the numeric values are fixed to the specified precision.
   *
   * @static
   * @param {object} val -
   * @param {number} [space=0] -
   * @param {number} [precision=5] -
   * @return {string} -
   */
  static stringifyJSONWithFixedPrecision(val, space = 0, precision = 5) {
    return JSON.stringify(
      val,
      (key, val) => {
        return val ? (val.toFixed ? Number(val.toFixed(precision)) : val) : val
      },
      space
    )
  }

  /**
   * Transforms the given string into a numeric value.
   *
   * @static
   * @param {*} str -
   * @return {number} -
   */
  static hashStr(str) {
    let hash = 0;
    let i;
    let chr;
    let len;
    if (str.length === 0) return hash
    for (i = 0, len = str.length; i < len; i++) {
      chr = str.charCodeAt(i);
      hash = (hash << 5) - hash + chr;
      hash |= 0; // Convert to 32bit integer
    }
    return Math.abs(hash)
  }
}

// eslint-disable-next-line camelcase

/**
 * Base class for Math types that can be stored in vertex attributes.
 * <br>
 * **Note:** These values use {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Float32Array|Float32Array} values to store their data.
 */
class AttrValue {
  /**
   * Verifies if the values stored in this Math type are valid numeric values.
   * Returns `false` If at least one of the values is either {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Referencia/Objetos_globales/Infinity|Infinity} or
   * {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Referencia/Objetos_globales/NaN|NaN}.
   *
   * @return {boolean} - Returns the result as a boolean.
   */
  isValid() {
    for (const v of this.__data) {
      if (v == Infinity || isNaN(v)) return false
    }

    return true
  }

  /**
   * This method is a factory function for creating new instances of math types, given an existing Float32Array buffer.
   * Each Math type implements this function to return an constructed value.
   *
   * @param {ArrayBuffer} buffer - the buffer value.
   * @param {number} offset - the offset value.
   * @return {AttrValue} - Returns the constructed value.
   * @deprecated
   * @private
   */
  static createFromFloat32Buffer(buffer, offset) {
    throw new Error('Not yet implemented for this type:' + this.constructor.name)
  }

  /**
   * This method is a factory function for creating new instances of math types, given an existing ArrayBuffer.
   * Each Math type implements this function to return an constructed value.
   *
   * @static
   * @param {ArrayBuffer} buffer
   * @param {number} byteOffset
   * @return {AttrValue} - Returns the constructed value.
   */
  static createFromBuffer(buffer, byteOffset) {
    throw new Error('Not yet implemented for this type:' + this.constructor.name)
  }

  /**
   * Returns the number of Float32 elements used by this type. Used to calculate storage requirements for large arrays of this type.
   * @return {number} - Returns the number of float values stored in this math type.
   */
  static numElements() {
    throw new Error('Not yet implemented for this type:' + this.constructor.name)
  }

  /**
   * Returns current Math type data as array. Often used to pass types to the GPU.
   *
   * @return {array} - Returns the result as an array.
   */
  asArray() {
    return this.__data
  }

  /**
   * Converts this Math type to a string in JSON format.
   *
   * @return {string} - The return value.
   */
  toString() {
    // eslint-disable-next-line new-cap
    return StringFunctions.stringifyJSONWithFixedPrecision(this.toJSON())
  }

  /**
   * Converts this Math type to a JSON object.
   * @return {object} - The json object.
   */
  toJSON() {
    throw new Error('Not yet implemented for this type:' + this.constructor.name)
  }
}

/**
 * Representing a Vec2(two-dimensional floating point vector). A Vec2 is for representing 2 dimensional values, such as screen coordinates or pixel coordinates within an image.
 *
 * Math types internally store values in {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Float32Array|Float32Array} and
 * expose getters and setters for the component values.
 *
 * @extends AttrValue
 */
class Vec2 extends AttrValue {
  /**
   * Creates a Vec2.
   *
   * The type of values of the `(x, y)` coordinates can be {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Float32Array|Float32Array},
   * {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Uint32Array|Uint32Array},
   * {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Int32Array|Int32Array} and
   * {@link https://developer.mozilla.org/es/docs/Web/JavaScript/Referencia/Objetos_globales/ArrayBuffer|ArrayBuffer}.
   * <br>
   *
   * ```javascript
   *  const myVec2 = new Vec2(1.2, 3.4)
   * ```
   *
   * Given an array of floats, create a Vec2 that wraps some part of it.
   * ```javascript
   *  const floatArray = new Float32Array(6)
   *  floatArray[0] = 1.2
   *  floatArray[1] = 3.4
   *  const myVec2 = new Vec2(floatArray)
   *  console.log(myVec2.toJSON())
   * ```
   * The resulting output
   * ```json
   *  > { x:1.2, y:3.4 }
   * ```
   *
   * Given an array of floats, create a Vec2 that wraps some part of it.
   * ```javascript
   *  const floatArray = new Float32Array(6)
   *  floatArray[0] = 1.2
   *  floatArray[1] = 3.4
   *  floatArray[2] = 5.6
   *  floatArray[3] = 7.8
   *  floatArray[4] = 9.0
   *  floatArray[5] = 1.9
   *  const myVec2 = new Vec2(floatArray.buffer, 8)
   *  console.log(myVec2.toJSON())
   * ```
   * The resulting output
   * ```json
   *  > { x:5.6, y:7.8 }
   * ```
   *
   * You can also pass one JSON object parameter.
   * ```javascript
   *  const myVec2 = new Vec2({ x:1.2, y:3.4 })
   * ```
   *
   * @param {Number|Float32Array|Uint32Array|json} x - The x value. Default is 0.
   * @param {Number} y - The y value. Default is 0.
   */
  constructor(x = 0, y = 0) {
    super();

    if (x instanceof Float32Array || x instanceof Uint32Array || x instanceof Int32Array) {
      this.__data = x;
    } else if (x instanceof ArrayBuffer) {
      console.warn(`deprecated, please use new Vec4(new Float32Array(buffer, byteOffset, 4))`);
      const buffer = x;
      const byteOffset = y;
      this.__data = new Float32Array(buffer, byteOffset, 2);
    } else if (x != null && typeof x == 'object') {
      this.__data = new Float32Array(2);
      this.fromJSON(x);
    } else {
      this.__data = new Float32Array(2);
      this.__data[0] = x;
      this.__data[1] = y;
    }
  }

  /**
   * Getter for `x` component.
   * @return {number} - Returns the x component.
   */
  get x() {
    return this.__data[0]
  }

  /**
   * Setter for `x` component.
   * @param {number} val - The val param.
   */
  set x(val) {
    this.__data[0] = val;
  }

  /**
   * Getter for `y` component.
   * @return {number} - Returns the y component.
   */
  get y() {
    return this.__data[1]
  }

  /**
   * Setter for `y` component.
   * @param {number} val - The val param.
   */
  set y(val) {
    this.__data[1] = val;
  }

  /**
   * Setter from scalar components.
   * @param {number} x - The x component.
   * @param {number} y  - The y component.
   */
  set(x, y) {
    this.__data[0] = x;
    this.__data[1] = y;
  }

  /**
   * Replaces this Vec2 data with the Vec2 data passed as parameter.
   *
   * @param {Vec2} other - The other Vec2 to set from.
   */
  setFromOther(other) {
    this.x = other.x;
    this.y = other.y;
  }

  /**
   * Checks if this Vec2 is exactly the same as another Vec2.
   *
   * @deprecated
   * @param {Vec2} other - The other Vec2 to compare with.
   * @return {boolean} - Returns `true` if are the same Vector, otherwise, `false`.
   */
  equal(other) {
    console.warn('Deprecated. Use #isEqual instead.');
    return this.isEqual(other)
  }

  /**
   * Checks if this Vec2 is exactly the same as another Vec2.
   *
   * @param {Vec2} other - The other Vec2 to compare with.
   * @return {boolean} - Returns `true` if are the same Vector, otherwise, `false`.
   */
  isEqual(other) {
    return this.x == other.x && this.y == other.y
  }

  /**
   * Checks if this Vec2 is different from another Vec2.
   *
   * @deprecated
   * @param {Vec2} other - The other Vec2 to compare with.
   * @return {boolean} - Returns `true` if the Vec2s are different, otherwise, `false`.
   */
  notEquals(other) {
    console.warn('Deprecated. Use #notEqual instead.');
    return this.notEqual(other)
  }

  /**
   * Checks if this Vec2 is different from another Vec2.
   *
   * @param {Vec2} other - The other Vec2 to compare with.
   * @return {boolean} - Returns `true` if the Vec2s are different, otherwise, `false`.
   */
  notEqual(other) {
    return this.x != other.x && this.y != other.y
  }

  /**
   * Returns true if this Vec2 is approximately the same as other.
   *
   * @param {Vec2} other - The other Vec2 to compare with.
   * @param {number} precision - The precision to which the values must match.
   * @return {boolean} - Returns true or false.
   */
  approxEqual(other, precision = Number.EPSILON) {
    return Math.abs(this.x - other.x) < precision && Math.abs(this.y - other.y) < precision
  }

  /**
   * Adds other to this Vec2 and returns the result as a new Vec2.
   *
   * @param {Vec2} other - The other Vec2 to add.
   * @return {Vec2} - Returns a new Vec2.
   */
  add(other) {
    return new Vec2(this.x + other.x, this.y + other.y)
  }

  /**
   * Adds a Vec2 to this Vec2.
   *
   * @param {Vec2} other - The other Vec2 to add.
   */
  addInPlace(other) {
    this.x += other.x;
    this.y += other.y;
  }

  /**
   * Subtracts a Vec2 from this Vec2 and returns the result as a new Vec2.
   *
   * @param {Vec2} other - The other Vec2 to subtract.
   * @return {Vec2} - Returns a new Vec2.
   */
  subtract(other) {
    return new Vec2(this.x - other.x, this.y - other.y)
  }

  /**
   * Subtracts a Vec2 from this Vec2.
   *
   * @param {Vec2} other - The other Vec2 to subtract.
   * @return {Vec2} - Returns a new Vec2.
   */
  subtractInPlace(other) {
    this.x -= other.x;
    this.y -= other.y;
    return this
  }

  /**
   * Scales this Vec2 by scalar and returns the result as a new Vec2.
   *
   * @param {number} scalar - The scalar value.
   * @return {Vec2} - Returns a new Vec2.
   */
  scale(scalar) {
    return new Vec2(this.x * scalar, this.y * scalar)
  }

  /**
   * Scales this Vec2 by scalar.
   *
   * @param {number} scalar - The scalar value.
   */
  scaleInPlace(scalar) {
    this.x *= scalar;
    this.y *= scalar;
  }

  /**
   * Inverts this Vec2 and returns the result as a new Vec2.
   *
   * @return {Vec2} - Returns a new Vec2.
   */
  invert() {
    return new Vec2(1.0 / this.x, 1.0 / this.y)
  }

  /**
   * Inverts this Vec2.
   *
   * @return {Vec2} - The return value.
   */
  invertInPlace() {
    this.x = 1.0 / this.x;
    this.y = 1.0 / this.y;
    return this
  }

  /**
   * Multiplies a Vec2 with this Vec2 and returns the result as a new Vec2.
   *
   * @param {Vec2} other - The other Vec2 to multiply with.
   * @return {Vec2} - Returns a new Vec2.
   */
  multiply(other) {
    return new Vec2(this.x * other.x, this.y * other.y)
  }

  /**
   * Multiplies a Vec2 with this Vec2.
   *
   * @param {Vec2} other - The other Vec2 to multiply with.
   */
  multiplyInPlace(other) {
    this.x *= other.x;
    this.y *= other.y;
  }

  /**
   * Calculates the squared length of this Vec2.
   *
   * @return {number} - Returns the length squared.
   */
  lengthSquared() {
    const x = this.__data[0];
    const y = this.__data[1];
    return x * x + y * y
  }

  /**
   * Calculates the length of this Vec2.
   *
   * @return {number} - Returns the length.
   */
  length() {
    return Math.sqrt(this.lengthSquared())
  }

  /**
   * Calculates the distance to another vector.
   *
   * @param {Vec2} other - The other value.
   * @return {number} - Returns the distance between vectors.
   */
  distanceTo(other) {
    const x = this.__data[0] - other.x;
    const y = this.__data[1] - other.y;
    return Math.sqrt(x * x + y * y)
  }

  /**
   * Normalizes the Vec2 and returns it as a new Vec2.
   * Multiplies coordenates value by the inverse of the vector length.
   *
   * @return {Vec2} - Returns the Vec2 normalized.
   */
  normalize() {
    const x = this.__data[0];
    const y = this.__data[1];
    let len = x * x + y * y;
    if (len < Number.EPSILON) {
      return new Vec2()
    }

    // TODO: evaluate use of glm_invsqrt here?
    len = 1 / Math.sqrt(len);
    return new Vec2(x * len, y * len)
  }

  /**
   * Normalizes this Vec2 multiplying coordenate values by the inverse of the vector length.
   */
  normalizeInPlace() {
    const x = this.__data[0];
    const y = this.__data[1];
    let len = x * x + y * y;
    if (len < Number.EPSILON) {
      return
    }
    len = 1 / Math.sqrt(len);
    this.set(x * len, y * len);
  }

  /**
   * Calculates the dot product of this Vec2 against another Vec2.
   *
   * @param {Vec2} other - The other Vec2 to compare with.
   * @return {number} - Returns the dot product.
   */
  dot(other) {
    return this.x * other.x + this.y * other.y
  }

  /**
   * Calculates the cross product of this Vec2 against another Vec2.
   *
   * @param {Vec2} other - The other Vec2 to compare with.
   * @return {number} - Returns the cross product.
   */
  cross(other) {
    // just calculate the z-component
    return this.x * other.y - this.y * other.x
  }

  /**
   * Gets the angle between this Vec2 and other assuming both are normalized vectors.
   *
   * @param {Vec2} other - The other Vec2 to compare with.
   * @return {number} - Returns the angle in radians.
   */
  angleTo(other) {
    const cosine = this.normalize().dot(other.normalize());
    if (cosine > 1.0) return 0.0
    else if (cosine < -1.0) return Math.PI
    else return Math.acos(cosine)
  }

  /**
   * Gets the angle between this Vec2 and other.
   *
   * @param {Vec2} other - The other Vec2 to compare with.
   * @return {number} - Returns the angle in radians.
   */
  signedAngleTo(other) {
    const angle = this.angleTo(other);
    if (this.cross(other) < 0.0) return -angle
    else return angle
  }

  /**
   * Rotates a Vec2 in a clockwise direction and returns a new rotated Vec2.
   *
   * @param {number} angle - The angle of rotation.
   * @return {Vec2} - Returns the rotated vect  or.
   */
  rotate(angle) {
    const cosa = Math.cos(angle);
    const sina = Math.sin(angle);
    return new Vec2(this.x * cosa - this.y * sina, this.x * sina + this.y * cosa)
  }

  /**
   * Performs a linear interpolation between this Vec2 and other Vec2.
   *
   * @param {Vec2} other - The other Vec2 to interpolate between.
   * @param {number} t - Interpolation amount between the two inputs.
   * @return {Vec2} - Returns a new Vec2.
   */
  lerp(other, t) {
    const ax = this.x;
    const ay = this.y;
    return new Vec2(ax + t * (other.x - ax), ay + t * (other.y - ay))
  }

  /**
   * Generates a random vector with the given scale.
   *
   * @param {number} scale - Length of the resulting vector. If ommitted, a unit vector will be returned.
   * @return {Vec2} - The return value.
   */
  setRandomDir(scale = 1.0) {
    const r = Math.random() * 2.0 * Math.PI;
    this.__data[0] = Math.cos(r) * zScale;
    this.__data[1] = Math.sin(r) * zScale;
    return this
  }

  /**
   * Randomizes the scale of this Vec2 coordenates.
   *
   * @param {number} scale - The scale value.
   * @return {Vec2} - The return value.
   */
  setRandom(scale = 1.0) {
    this.__data[0] = Math.random() * scale;
    this.__data[1] = Math.random() * scale;
    return this
  }

  /**
   * Clones this Vec2 and returns a new Vec2.
   *
   * @return {Vec2} - Returns a new Vec2.
   */
  clone() {
    return new Vec2(this.__data[0], this.__data[1])
  }

  /**
   * Returns current Vec2 data as array. Often used to pass types to the GPU.
   *
   * @return {array} - Returns as an array.
   */
  asArray() {
    return this.__data
  }

  // ////////////////////////////////////////
  // Static Methods

  /**
   * Creates a new Vec2.
   * @see `new Vec2`
   *
   * @param {...object} ...args - The ...args param.
   * @return {Vec2} - Returns a new Vec2.
   * @private
   */
  static create(...args) {
    return new Vec2(...args)
  }

  /**
   * Creates a new Vec2 to wrap existing memory in a buffer.
   * @param {ArrayBuffer} buffer - The buffer value.
   * @param {number} offset - The offset value.
   * @return {Vec2} - Returns a new Vec2.
   * @deprecated
   * @private
   */
  static createFromFloat32Buffer(buffer, offset = 0) {
    console.warn('Deprecated, use #createFromBuffer instead');
    return this.createFromBuffer(buffer, offset * 4)
  }

  /**
   * Creates an instance of a `Vec2` using an ArrayBuffer.
   *
   * @static
   * @param {ArrayBuffer} buffer - The buffer value.
   * @param {number} byteOffset - The offset value.
   * @return {Vec2} - Returns a new Vec2.
   */
  static createFromBuffer(buffer, byteOffset) {
    return new Vec2(new Float32Array(buffer, byteOffset, 2)) // 4 bytes per 32bit float
  }

  /**
   * The createFromFloat32Array method.
   * @param {Float32Array} array - The array value.
   * @return {Vec2} - Returns a new Vec2.
   * @private
   */
  static createFromFloat32Array(array) {
    return new Vec2(array)
  }

  /**
   * Returns the number of Float32 elements used by this type. Used to calculate storage requi
   * ents for large arrays of this type.
   * @return {number} - The return value.
   * @private
   */
  static numElements() {
    return 2
  }

  // ///////////////////////////
  // Persistence

  /**
   * Encodes Vec2 Class as a JSON object for persistence.
   *
   * @return {object} - The json object.
   */
  toJSON() {
    return {
      x: this.x,
      y: this.y,
    }
  }

  /**
   * Decodes a JSON object to set the state of this class.
   *
   * @param {object} j - The json object.
   */
  fromJSON(j) {
    this.x = j.x;
    this.y = j.y;
  }

  /**
   * Loads the state of the value from a binary reader.
   *
   * @param {BinReader} reader - The reader value.
   */
  readBinary(reader) {
    this.x = reader.loadFloat32();
    this.y = reader.loadFloat32();
  }
}

Registry.register('Vec2', Vec2);

/**
 * Represents a three dimensional coordinate, such as 3D scene values, or mesh vertex positions.
 *
 * Math types internally store values in {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Float32Array|Float32Array} and
 * expose getters and setters for the component values.
 *
 * @extends AttrValue
 */
class Vec3$1 extends AttrValue {
  /**
   * Creates a Vec3.
   *
   * The type of values of the `(x, y, z)` coordenates can be {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Float32Array|Float32Array},
   * {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Uint32Array|Uint32Array},
   * {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Int32Array|Int32Array} and
   * {@link https://developer.mozilla.org/es/docs/Web/JavaScript/Referencia/Objetos_globales/ArrayBuffer|ArrayBuffer}.
   * <br>
   * You can also pass one JSON object parameter.
   *
   * @param {Number|Float32Array|json} x - The x value. Default is 0.
   * @param {number} y - The y value. Default is 0.
   * @param {number} z - The z value. Default is 0.
   */
  constructor(x = 0, y = 0, z = 0) {
    super();
    if (x instanceof Float32Array || x instanceof Uint32Array) {
      this.__data = x;
    } else if (x instanceof ArrayBuffer) {
      console.warn(`deprecated, please use new Vec3(new Float32Array(buffer, byteOffset, 3))`);
      const buffer = x;
      const byteOffset = y;
      this.__data = new Float32Array(buffer, byteOffset, 3);
    } else if (x != null && typeof x == 'object') {
      this.__data = new Float32Array(3);
      this.fromJSON(x);
    } else {
      this.__data = new Float32Array(3);
      this.__data[0] = x;
      this.__data[1] = y;
      this.__data[2] = z;
    }
  }

  /**
   * Getter for `x` component.
   *
   * @return {number} - Returns the x component.
   */
  get x() {
    return this.__data[0]
  }

  /**
   * Setter for `x` component.
   *
   * @param {number} val - The val param.
   */
  set x(val) {
    this.__data[0] = val;
  }

  /**
   * Getter for `y` component.
   *
   * @return {number} - Returns the y component.
   */
  get y() {
    return this.__data[1]
  }

  /**
   * Setter for `y` component.
   *
   * @param {number} val - The val param.
   */
  set y(val) {
    this.__data[1] = val;
  }

  /**
   * Getter for `z` component.
   *
   * @return {number} - Returns the z component.
   */
  get z() {
    return this.__data[2]
  }

  /**
   * Setter for `z` component.
   *
   * @param {number} val - The val param.
   */
  set z(val) {
    this.__data[2] = val;
  }

  /**
   * Getter for `xy` swizzel.
   *
   * @return {Vec2} - Returns the z component.
   */
  get xy() {
    return new Vec2(this.__data[0], this.__data[1])
  }

  /**
   * Getter for `yz` swizzel.
   *
   * @return {Vec2} - Returns the z component.
   */
  get yz() {
    return new Vec2(this.__data[1], this.__data[2])
  }

  /**
   * Setter from scalar components.
   *
   * @param {number} x - The x component.
   * @param {number} y - The y component.
   * @param {number} z - The y component.
   */
  set(x, y, z) {
    this.x = x;
    this.y = y !== undefined ? y : x;
    this.z = z !== undefined ? z : x;
  }

  /**
   * Sets the state of a Vec3 Object.
   *
   * @param {Float32Array} float32Array - The float32Array value.
   */
  setDataArray(float32Array) {
    this.__data = float32Array;
  }

  /**
   * Sets the state of a Vec3 Object from another Vec3.
   *
   * @param {Vec3} other - The other Vec3 to set from.
   */
  setFromOther(other) {
    this.x = other.x;
    this.y = other.y;
    this.z = other.z;
  }

  /**
   * Checks if the coordenates of this Vec3 are 0 0 0.
   *
   * @return {boolean} - Returns `true` if the coordenates are(0, 0, 0), otherwise, `false`.
   */
  isNull() {
    return Math.abs(this.x) < Number.EPSILON && Math.abs(this.y) < Number.EPSILON && Math.abs(this.z) < Number.EPSILON
  }

  /**
   * Checks if the coordenates of this Vec3 are 1 1 1.
   *
   * @return {boolean} - Returns `true` if the coordenates are(1, 1, 1), otherwise, `false`.
   */
  is111() {
    return (
      Math.abs(1.0 - this.x) < Number.EPSILON &&
      Math.abs(1.0 - this.y) < Number.EPSILON &&
      Math.abs(1.0 - this.z) < Number.EPSILON
    )
  }

  /**
   * @deprecated
   * Checks if this Vec3 is exactly the same as another Vec3.
   *
   * @param {Vec3} other - The other Vec3 to compare with.
   * @return {boolean} - Returns `true` if are the same Vector, otherwise, `false`.
   */
  equal(other) {
    console.warn('Deprecated. Use #isEqual instead.');
    return this.equals(other)
  }

  /**
   * Checks if this Vec3 is exactly the same as another Vec3.
   *
   * @param {Vec3} other - The other Vec3 to compare with.
   * @return {boolean} - Returns `true` if are the same Vector, otherwise, `false`.
   */
  isEqual(other) {
    return this.x == other.x && this.y == other.y && this.z == other.z
  }

  /**
   * @deprecated
   * Checks if this Vec2 is different from another Vec2.
   *
   * @param {Vec3} other - The other Vec3 to compare with.
   * @return {boolean} - Returns `true` if the Vec3s are different, otherwise, `false`.
   */
  notEquals(other) {
    console.warn('Deprecated. Use #notEqual instead.');
    return this.notEqual(other)
  }

  /**
   * Checks if this Vec2 is different from another Vec2.
   *
   * @param {Vec3} other - The other Vec3 to compare with.
   * @return {boolean} - Returns `true` if the Vec3s are different, otherwise, `false`.
   */
  notEqual(other) {
    return this.x != other.x && this.y != other.y && this.z != other.z
  }

  /**
   * Returns true if this Vec2 is approximately the same as other.
   *
   * @param {Vec3} other - The other Vec3 to compare with.
   * @param {number} precision - The precision to which the values must match.
   * @return {boolean} - Returns true or false.
   */
  approxEqual(other, precision = Number.EPSILON) {
    return (
      Math.abs(this.x - other.x) < precision &&
      Math.abs(this.y - other.y) < precision &&
      Math.abs(this.z - other.z) < precision
    )
  }

  /**
   * Adds other to this Vec3 and return the result as a new Vec3.
   *
   * @param {Vec3} other - The other Vec3 to add.
   * @return {Vec3} - Returns a new Vec3.
   */
  add(other) {
    return new Vec3$1(this.x + other.x, this.y + other.y, this.z + other.z)
  }

  /**
   * Adds other to this Vec3.
   *
   * @param {Vec3} other - The other Vec3 to add.
   */
  addInPlace(other) {
    this.x += other.x;
    this.y += other.y;
    this.z += other.z;
  }

  /**
   * Subtracts other from this Vec3 and returns the result as a new Vec3.
   *
   * @param {Vec3} other - The other Vec3 to subtract.
   * @return {Vec3} - Returns a new Vec3.
   */
  subtract(other) {
    return new Vec3$1(this.x - other.x, this.y - other.y, this.z - other.z)
  }

  /**
   * Subtracts other from this Vec3.
   *
   * @param {Vec3} other - The other Vec3 to subtract.
   */
  subtractInPlace(other) {
    this.x -= other.x;
    this.y -= other.y;
    this.z -= other.z;
  }

  /**
   * Multiplies two Vec3s and returns the result as a new Vec3.
   *
   * @param {Vec3} other - The other Vec3 to multiply with.
   * @return {Vec3} - Returns a new Vec3.
   */
  multiply(other) {
    return new Vec3$1(this.x * other.x, this.y * other.y, this.z * other.z)
  }

  /**
   * Multiplies two Vec3s.
   *
   * @param {Vec3} other - The other Vec3 to multiply with.
   */
  multiplyInPlace(other) {
    this.x *= other.x;
    this.y *= other.y;
    this.z *= other.z;
  }

  /**
   * Divides two Vec3s and returns the result as a new Vec3.
   *
   * @param {Vec3} vec3 - The other Vec3 to divide by.
   * @return {Vec3} - Returns a new Vec3.
   */
  divide(vec3) {
    return new Vec3$1(this.x / vec3.x, this.y / vec3.y, this.z / vec3.z)
  }

  /**
   * Divides two Vec3s.
   *
   * @param {Vec3} vec3 - The other Vec3 to divide by.
   */
  divideInPlace(vec3) {
    this.x /= vec3.x;
    this.y /= vec3.y;
    this.z /= vec3.z;
  }

  /**
   * Scales this Vec3 by scalar and returns the result as a new Vec3.
   *
   * @param {number} scalar - The scalar value.
   * @return {Vec3} - Returns a new Vec3.
   */
  scale(scalar) {
    return new Vec3$1(this.x * scalar, this.y * scalar, this.z * scalar)
  }

  /**
   * Scales this Vec3 by scalar.
   *
   * @param {number} scalar - The scalar value.
   */
  scaleInPlace(scalar) {
    this.x *= scalar;
    this.y *= scalar;
    this.z *= scalar;
  }

  /**
   * Negates this Vec3 (x = -x, y = -y and z = -z), but returns the result as a new Vec3.
   *
   * @return {Vec3} - Returns a new Vec3.
   */
  negate() {
    return new Vec3$1(-this.x, -this.y, -this.z)
  }

  /**
   * Returns the inverse of this Vec3, but returns. the result as a new Vec3
   *
   * @return {Vec3} - Returns a new Vec3.
   */
  inverse() {
    return new Vec3$1(1.0 / this.x, 1.0 / this.y, 1.0 / this.z)
  }

  /**
   * Calculates the squared length of this Vec3.
   *
   * @return {number} - Returns the length.
   */
  lengthSquared() {
    const x = this.__data[0];
    const y = this.__data[1];
    const z = this.__data[2];
    return x * x + y * y + z * z
  }

  /**
   * Calculates the length of this Vec3.
   *
   * @return {number} - Returns the length.
   */
  length() {
    return Math.sqrt(this.lengthSquared())
  }

  /**
   * Calculates the distance to another Vec3.
   *
   * @param {Vec3} other - The other Vec3 to calculate the distance to.
   * @return {number} - Returns the distance between vectors.
   */
  distanceTo(other) {
    const x = this.__data[0] - other.x;
    const y = this.__data[1] - other.y;
    const z = this.__data[2] - other.z;
    return Math.sqrt(x * x + y * y + z * z)
  }

  /**
   * Normalizes the Vec3 and returns it as a new Vec3.
   * Multiplies coordenates value by the inverse of the vector length.
   *
   * @return {Vec3} - Returns the Vec3 normalized.
   */
  normalize() {
    let len = this.__data[0] * this.__data[0] + this.__data[1] * this.__data[1] + this.__data[2] * this.__data[2];
    if (len < Number.EPSILON) {
      return new Vec3$1()
    }

    // TODO: evaluate use of glm_invsqrt here?
    len = 1.0 / Math.sqrt(len);
    return new Vec3$1(this.__data[0] * len, this.__data[1] * len, this.__data[2] * len)
  }

  /**
   * Normalizes this Vec3 multiplying coordenate values by the inverse of the vector length.
   *
   * @return {number} - The return value.
   */
  normalizeInPlace() {
    let len = this.__data[0] * this.__data[0] + this.__data[1] * this.__data[1] + this.__data[2] * this.__data[2];
    if (len < Number.EPSILON) {
      return
    }
    len = Math.sqrt(len);
    const tmp = 1.0 / len;
    this.__data[0] *= tmp;
    this.__data[1] *= tmp;
    this.__data[2] *= tmp;

    return len
  }

  /**
   * Creates and returns a new Vec3 with the new coordenates(calculated with this Vec3 coordenates and the specified length).
   *
   * @param {number} length - The length value.
   * @return {Vec3} - The return value.
   */
  resize(length) {
    const currlen = this.__data[0] * this.__data[0] + this.__data[1] * this.__data[1] + this.__data[2] * this.__data[2];
    if (currlen < Number.EPSILON) {
      return
    }
    const scl = length / Math.sqrt(currlen);
    return new Vec3$1(this.__data[0] * scl, this.__data[1] * scl, this.__data[2] * scl)
  }

  /**
   * Modifies current coordenates using the specified length.
   *
   * @param {number} length - The length value.
   */
  resizeInPlace(length) {
    const currlen = this.__data[0] * this.__data[0] + this.__data[1] * this.__data[1] + this.__data[2] * this.__data[2];
    if (currlen < Number.EPSILON) {
      return
    }
    const scl = length / Math.sqrt(currlen);
    this.__data[0] *= scl;
    this.__data[1] *= scl;
    this.__data[2] *= scl;
  }

  /**
   * Calculates the dot product of this Vec3 against another Vec3.
   *
   * @param {Vec3} other - The other Vec3 to compare with.
   * @return {number} - Returns the dot product.
   */
  dot(other) {
    return this.x * other.x + this.y * other.y + this.z * other.z
  }

  /**
   * Calculates the cross product of two Vec3s and returns the result as a new Vec3.
   *
   * @param {Vec3} other - The other Vec3 to calculate with.
   * @return {Vec3} - Returns the cross product as a new Vec3.
   */
  cross(other) {
    const ax = this.x;
    const ay = this.y;
    const az = this.z;
    const bx = other.x;
    const by = other.y;
    const bz = other.z;

    return new Vec3$1(ay * bz - az * by, az * bx - ax * bz, ax * by - ay * bx)
  }

  /**
   * Gets the angle between this Vec3 and b.
   *
   * @param {Vec3} other - The other Vec3 to compare with.
   * @return {number} - Returns the angle in radians.
   */
  angleTo(other) {
    const cosine = this.dot(other);
    if (cosine > 1.0) {
      return 0
    } else {
      return Math.acos(cosine)
    }
  }

  /**
   * Performs a linear interpolation between this Vec3 and other.
   *
   * @param {Vec3} other - The other Vec3 to interpolate between.
   * @param {number} t - Interpolation amount between the two inputs.
   * @return {Vec3} - Returns a new Vec3.
   */
  lerp(other, t) {
    const ax = this.x;
    const ay = this.y;
    const az = this.z;
    return new Vec3$1(ax + t * (other.x - ax), ay + t * (other.y - ay), az + t * (other.z - az))
  }

  /**
   * Returns a new Vec3 whose component values are the abs of this Vec3s component values.
   *
   * @return {Vec3} - Returns a new Vec3.
   */
  abs() {
    return new Vec3$1(Math.abs(this.x), Math.abs(this.y), Math.abs(this.z))
  }

  /**
   * Sets the vector a random vector on the surface of a sphere with the radius of the givenn scale value.
   *
   * @param {number} scale - The radius of the surface sphere.
   * @return {Vec3} - The random Vec3.
   */
  setRandomDir(scale = 1.0) {
    const r = Math.random() * 2.0 * Math.PI;
    const z = Math.random() * 2.0 - 1.0;
    const zScale = Math.sqrt(1.0 - z * z) * scale;

    this.__data[0] = Math.cos(r) * zScale;
    this.__data[1] = Math.sin(r) * zScale;
    this.__data[2] = z * scale;
    return this
  }

  /**
   * Generates a randome vector anywhere in the sphere defined by the provided scale value.
   *
   * @param {number} scale - The radius of the bounding sphere.
   * @return {Vec3} - The random Vec3.
   */
  setRandom(scale = 1.0) {
    this.__data[0] = (Math.random() - 0.5) * scale;
    this.__data[1] = (Math.random() - 0.5) * scale;
    this.__data[2] = (Math.random() - 0.5) * scale;
    return this
  }

  /**
   * Clones this Vec3 and returns a new Vec3.
   *
   * @return {Vec3} - Returns a new Vec3.
   */
  clone() {
    return new Vec3$1(this.__data[0], this.__data[1], this.__data[2])
  }

  /**
   * Returns the type as an array. Often used to pass types to the GPU.
   *
   * @return {array} - Returns as an array.
   */
  asArray() {
    return this.__data
  }

  // ////////////////////////////////////////
  // Static Methods

  /**
   * Creates a new Vec3.
   *
   * @param {...object} ...args - The ...args param.
   * @return {Vec3} - Returns a new Vec3.
   * @private
   */
  static create(...args) {
    return new Vec3$1(...args)
  }

  /**
   * The createFromJSON method.
   * @param {object} json - The json param.
   * @return {Vec3} - The return value.
   * @private
   */
  static createFromJSON(json) {
    const result = new Vec3$1();
    result.fromJSON(json);
    return result
  }

  /**
   * The createFromFloat32Buffer method.
   * @param {ArrayBuffer} buffer - The buffer value.
   * @param {number} offset - The offset value.
   * @return {Vec3} - Returns a new Vec3.
   * @deprecated
   * @private
   */
  static createFromFloat32Buffer(buffer, offset = 0) {
    console.warn('Deprecated, use #createFromBuffer instead');
    return this.createFromBuffer(buffer, offset * 4)
  }

  /**
   * Creates an instance of a `Vec3` using an ArrayBuffer.
   *
   * @static
   * @param {ArrayBuffer} buffer - The buffer value.
   * @param {number} byteOffset - The offset value.
   * @return {Vec3} - Returns a new Vec3.
   */
  static createFromBuffer(buffer, byteOffset) {
    return new Vec3$1(new Float32Array(buffer, byteOffset, 3)) // 4 bytes per 32bit float
  }

  /**
   * The createFromFloat32Array method.
   * @param {Float32Array} array - A Float32Array value
   * @return {Vec3} - Returns a new Vec3.
   * @private
   */
  static createFromFloat32Array(array) {
    return new Vec3$1(array)
  }

  /**
   * Returns the number of Float32 elements used by this type. Used to calculate storage requirements for large arrays of this type.
   * @return {number} - The return value.
   * @private
   */
  static numElements() {
    return 3
  }

  // ///////////////////////////
  // Persistence

  /**
   * Encodes Vec3 Class as a JSON object for persistence.
   *
   * @return {object} - The json object.
   */
  toJSON() {
    return {
      x: this.x,
      y: this.y,
      z: this.z,
    }
  }

  /**
   * Decodes a JSON object to set the state of this class.
   *
   * @param {object} j - The json object.
   */
  fromJSON(j) {
    this.x = j.x;
    this.y = j.y;
    this.z = j.z;
  }

  /**
   * Loads the state of the value from a binary reader.
   *
   * @param {BinReader} reader - The reader value.
   */
  readBinary(reader) {
    this.x = reader.loadFloat32();
    this.y = reader.loadFloat32();
    this.z = reader.loadFloat32();
  }
}

Registry.register('Vec3', Vec3$1);

/* eslint-disable new-cap */
/**
 * Represents a four-dimensional coordinate.
 * Math types internally store values in {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Float32Array|Float32Array} and
 * expose getters and setters for the component values.
 *
 * @extends AttrValue
 */
class Vec4$1 extends AttrValue {
  /**
   /**
   * Creates a Vec4.
   *
   * The type of values of the `(x, y, z, t)` coordinates can be {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Float32Array|Float32Array},
   * {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Uint32Array|Uint32Array},
   * {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Int32Array|Int32Array} and
   * {@link https://developer.mozilla.org/es/docs/Web/JavaScript/Referencia/Objetos_globales/ArrayBuffer|ArrayBuffer}.
   * <br>
   * You can also pass one JSON object parameter.
   * 
   * @param {Number|Float32Array|json} x - The x value. Default is 0.
   * @param {number} y - The y value. Default is 0.
   * @param {number} z - The y value. Default is 0.
   * @param {number} t - The t value. Default is 0.
   */
  constructor(x = 0, y = 0, z = 0, t = 0) {
    super();

    if (x instanceof Float32Array || x instanceof Uint32Array) {
      this.__data = x;
    } else if (x instanceof ArrayBuffer) {
      console.warn(`deprecated, please use new Vec4(new Float32Array(buffer, byteOffset, 4))`);
      const buffer = x;
      const byteOffset = y;
      this.__data = new Float32Array(buffer, byteOffset, 4);
    } else if (x != null && typeof x == 'object') {
      this.__data = new Float32Array(4);
      this.fromJSON(x);
    } else {
      this.__data = new Float32Array(4);
      this.__data[0] = x;
      this.__data[1] = y;
      this.__data[2] = z;
      this.__data[3] = t;
    }
  }

  /**
   * Getter for `x` value.
   *
   * @return {number} - Returns the x value.
   */
  get x() {
    return this.__data[0]
  }

  /**
   * Setter for `x` value.
   *
   * @param {number} val - The val param.
   */
  set x(val) {
    this.__data[0] = val;
  }

  /**
   * Getter for `y` value.
   *
   * @return {number} - Returns the y value.
   */
  get y() {
    return this.__data[1]
  }

  /**
   * Setter for `y` value.
   *
   * @param {number} val - The val param.
   */
  set y(val) {
    this.__data[1] = val;
  }

  /**
   * Getter for `z` value.
   *
   * @param {number} val - The val param.
   */
  get z() {
    return this.__data[2]
  }

  /**
   * Setter for `z` value.
   *
   * @param {number} val - The val param.
   */
  set z(val) {
    this.__data[2] = val;
  }

  /**
   * Getter for `t` value.
   *
   * @param {number} val - The val param.
   */
  get t() {
    return this.__data[3]
  }

  /**
   * Setter for `t` value.
   *
   * @param {number} val - The val param.
   */
  set t(val) {
    this.__data[3] = val;
  }

  /**
   * Getter for `xy` swizzel.
   *
   * @return {number} - Returns the z value.
   */
  get xyz() {
    return new Vec3$1(this.__data[0], this.__data[1], this.__data[2])
  }

  /**
   * Setter from scalar components.
   *
   * @param {number} x - The x value.
   * @param {number} y  - The y value.
   * @param {number} z  - The y value.
   * @param {number} t  - The t value.
   */
  set(x, y, z, t) {
    this.x = x;
    this.y = y;
    this.z = z;
    this.t = t;
  }

  /**
   * Sets the state of a Vec4 Object from another Vec4.
   *
   * @param {Vec4} other - The other Vec4 to set from.
   */
  setFromOther(other) {
    this.x = other.x;
    this.y = other.y;
    this.z = other.z;
    this.t = other.t;
  }

  /**
   * Checks if this Vec4 is exactly the same as another Vec4.
   *
   * @deprecated
   * @param {Vec4} other - The other Vec4 to compare with.
   * @return {boolean} - Returns true or false.
   */
  equal(other) {
    console.warn('Deprecated. Use #isEqual instead.');
    return this.isEqual(other)
  }

  /**
   * Checks if this Vec4 is exactly the same as another Vec4.
   *
   * @param {Vec4} other - The other Vec4 to compare with.
   * @return {boolean} - Returns true or false.
   */
  isEqual(other) {
    return this.x == other.x && this.y == other.y && this.z == other.z && this.t == other.t
  }

  /**
   * Checks if this Vec4 is different from another Vec4.
   *
   * @deprecated
   * @param {Vec4} other - The other Vec4 to compare with.
   * @return {boolean} - Returns true or false.
   */
  notEquals(other) {
    console.warn('Deprecated. Use #notEqual instead.');
    return this.notEqual(other)
  }

  /**
   * Checks if this Vec4 is different from another Vec4.
   *
   * @param {Vec4} other - The other Vec4 to compare with.
   * @return {boolean} - Returns true or false.
   */
  notEqual(other) {
    return this.x != other.x && this.y != other.y && this.z != other.z && this.t != other.t
  }

  /**
   * Returns true if this Vec4 is approximately the same as other.
   *
   * @param {Vec4} other - The other Vec4 to compare with.
   * @param {number} precision - The precision to which the values must match.
   * @return {boolean} - The return value.
   */
  approxEqual(other, precision = Number.EPSILON) {
    return (
      Math.abs(this.x - other.x) < precision &&
      Math.abs(this.y - other.y) < precision &&
      Math.abs(this.z - other.z) < precision &&
      Math.abs(this.t - other.t) < precision
    )
  }

  /**
   * Adds other to this Vec4 and returns the result as a new Vec4.
   *
   * @param {Vec4} other - The other Vec4 to add.
   * @return {Vec4} - Returns a new Vec4.
   */
  add(other) {
    return new Vec4$1(this.x + other.x, this.y + other.y, this.z + other.z, this.t + other.t)
  }

  /**
   * Adds other to this Vec4 mutating the values of this instance
   *
   * @param {Vec4} other - The other Vec4 to add.
   */
  addInPlace(other) {
    this.x += other.x;
    this.y += other.y;
    this.z += other.z;
    this.t += other.t;
  }

  /**
   * Subtracts other from this Vec4 and returns then result as a new Vec4.
   *
   * @param {Vec4} other - The other Vec4 to subtract.
   * @return {Vec4} - Returns a new Vec4.
   */
  subtract(other) {
    return new Vec4$1(this.x - other.x, this.y - other.y, this.z - other.z, this.t - other.t)
  }

  /**
   * Subtracts other from this Vec4 mutating the values of this instance
   *
   * @param {Vec4} other - The other Vec4 to subtract.
   */
  subtractInPlace(other) {
    this.x -= other.x;
    this.y -= other.y;
    this.z -= other.z;
    this.t -= other.t;
  }

  /**
   * Multiplies two Vec4s and returns the result as a new Vec4.
   *
   * @param {Vec4} other - The other Vec4 to multiply with.
   * @return {Vec4} - Returns a new Vec4.
   */
  multiply(other) {
    return new Vec4$1(this.x * other.x, this.y * other.y, this.z * other.z, this.t * other.t)
  }

  /**
   * Multiplies two Vec4s mutating the values of this instance
   *
   * @param {Vec4} other - The other Vec4 to multiply with.
   */
  multiplyInPlace(other) {
    this.x *= other.x;
    this.y *= other.y;
    this.z *= other.z;
    this.t *= other.t;
  }

  /**
   * Divides two Vec4s and returns the result as a new Vec4.
   *
   * @param {Vec4} other - The other Vec4 to divide by.
   * @return {Vec4} - Returns a new Vec4.
   */
  divide(other) {
    return new Vec4$1(this.x / other.x, this.y / other.y, this.z / other.z, this.t / other.t)
  }

  /**
   * Divides two Vec4s.
   *
   * @param {Vec4} other - The other Vec4 to divide by.
   */
  divideInPlace(other) {
    this.x /= other.x;
    this.y /= other.y;
    this.z /= other.z;
    this.t /= other.t;
  }

  /**
   * Scales this Vec4 by scalar and returns the result as a new Vec4.
   *
   * @param {number} scalar - The scalar value.
   * @return {Vec4} - The return value.
   */
  scale(scalar) {
    return new Vec4$1(this.x * scalar, this.y * scalar, this.z * scalar, this.t * scalar)
  }

  /**
   * Scales this Vec4 by scalar.
   *
   * @param {number} scalar - The scalar value.
   */
  scaleInPlace(scalar) {
    this.set(this.x * scalar, this.y * scalar, this.z * scalar, this.t * scalar);
  }

  /**
   * Calculates the length of this Vec4.
   *
   * @return {number} - Returns the length.
   */
  length() {
    const x = this.__data[0];
    const y = this.__data[1];
    const z = this.__data[2];
    const t = this.__data[2];
    return Math.sqrt(x * x + y * y + z * z + t * t)
  }

  /**
   * Calculates the squared length of this Vec4.
   *
   * @return {number} - Returns the length.
   */
  lengthSquared() {
    const x = this.__data[0];
    const y = this.__data[1];
    const z = this.__data[2];
    const t = this.__data[3];
    return x * x + y * y + z * z + t * t
  }

  /**
   * Normalizes the Vec4 and returns it as a new Vec4.
   * Multiplies coordenates value by the inverse of the vector length.
   *
   * @return {Vec4} - Returns the Vec4 normalized.
   */
  normalize() {
    const x = this.__data[0];
    const y = this.__data[1];
    const z = this.__data[2];
    const t = this.__data[3];
    let len = x * x + y * y + z * z + t * t;
    if (len < Number.EPSILON) {
      return new Vec4$1()
    }

    // TODO: evaluate use of glm_invsqrt here?
    len = 1 / Math.sqrt(len);
    return new Vec4$1(x * len, y * len, z * len)
  }

  /**
   * Normalizes this Vec4 multiplying coordenate values by the inverse of the vector length.
   */
  normalizeInPlace() {
    const x = this.__data[0];
    const y = this.__data[1];
    const z = this.__data[2];
    const t = this.__data[3];
    let len = x * x + y * y + z * z + t * t;
    if (len < Number.EPSILON) {
      return
    }
    len = 1 / Math.sqrt(len);
    this.set(x * len, y * len, z * len, t * len);
  }

  /**
   * Calculates the dot product of this Vec4 against another Vec4.
   *
   * @param {Vec4} other - The other Vec4 to compare with.
   * @return {number} - Returns the dot product.
   */
  dot(other) {
    return this.x * other.x + this.y * other.y + this.z * other.z + this.t * b.t
  }

  /**
   * Calculates the cross product of two Vec4s and returns the result as a new Vec4.
   *
   * @param {Vec4} other - The other Vec4 to calculate with.
   * @return {Vec4} - Returns the cross product as a new Vec4.
   */
  cross(other) {
    const ax = this.x;
    const ay = this.y;
    const az = this.z;
    const at = this.t;
    const bx = other.x;
    const by = other.y;
    const bz = other.z;
    const bt = other.t;

    return new Vec4$1(ay * bz - az * by, az * bt - at * bz, at * bx - ax * bt, ax * by - ay * bx)
  }

  /**
   * Gets the angle between this Vec4 and b.
   *
   * @param {Vec4} other - The other Vec4 to compare with.
   * @return {number} - Returns the angle in radians.
   */
  angleTo(other) {
    const tempA = this.normalize();
    const tempB = other.normalize();
    const cosine = tempA.dot(tempB);

    if (cosine > 1.0) {
      return 0
    } else {
      return Math.acos(cosine)
    }
  }

  /**
   * Performs a linear interpolation between this Vec4 and other.
   *
   * @param {Vec4} other - The other Vec4 to interpolate between.
   * @param {number} t - Interpolation amount between the two inputs.
   * @return {Vec4} - Returns a new Vec4.
   */
  lerp(other, t) {
    const ax = this.x;
    const ay = this.y;
    const az = this.z;
    at = this.t;
    return new Vec4$1(ax + t * (other.x - ax), ay + t * (other.y - ay), az + t * (other.z - az), at + t * (other.t - at))
  }

  /**
   * Generates a random vector with the given scale.
   *
   * @param {number} scale - Length of the resulting vector. If ommitted, a unit vector will be returned.
   * @return {Vec4} - The return value.
   */
  random(scale = 1.0) {
    const r = glMatrix.RANDOM() * 2.0 * Math.PI;
    const z = glMatrix.RANDOM() * 2.0 - 1.0;
    const zScale = Math.sqrt(1.0 - z * z) * scale;

    out[0] = Math.cos(r) * zScale;
    out[1] = Math.sin(r) * zScale;
    out[2] = z * scale;
    return out
  }

  /**
   * Clones this Vec4 and returns a new Vec4.
   *
   * @return {Vec4} - Returns a new Vec4.
   */
  clone() {
    return new Vec4$1(this.__data[0], this.__data[1], this.__data[2], this.__data[3])
  }

  /**
   * Converts this Vec4 into a Vec3.
   *
   * @return {Vec3} - Returns the value as a new Vec3.
   */
  toVec3() {
    return new Vec3$1(this.__data[0], this.__data[1], this.__data[2])
  }

  /**
   * Returns the type as an array. Often used to pass types to the GPU.
   *
   * @return {aray} - Returns as an array.
   */
  asArray() {
    return this.__data
  }

  // ////////////////////////////////////////
  // Static Methods

  /**
   * Creates a new Vec3.
   * @param {...object} ...args - The ...args param.
   * @return {Vec3} - Returns a new Vec3.
   * @private
   */
  static create(...args) {
    return new Vec3$1(...args)
  }

  /**
   * Creates a new Vec4 to wrap existing memory in a buffer.
   * @param {ArrayBuffer} buffer - The buffer value.
   * @param {number} offset - The offset value.
   * @return {Vec4} - Returns a new Vec3.
   * @deprecated
   * @private
   */
  static createFromFloat32Buffer(buffer, offset = 0) {
    console.warn('Deprecated, use #createFromBuffer instead');
    return new Vec4$1(new Float32Array(buffer, offset * 4, 4)) // 4 bytes per 32bit float
  }

  /**
   * Creates an instance of a `Vec4` using an ArrayBuffer.
   *
   * @static
   * @param {ArrayBuffer} buffer - The buffer value.
   * @param {number} byteOffset - The offset value.
   * @return {Vec4} - Returns a new Vec4.
   */
  static createFromBuffer(buffer, byteOffset) {
    return new Vec4$1(new Float32Array(buffer, byteOffset, 4)) // 4 bytes per 32bit float
  }

  /**
   * Returns the number of Float32 elements used by this type. Used to calculate storage requirements for large arrays of this type.
   * @return {number} - The return value.
   * @private
   */
  static numElements() {
    return 4
  }

  // ///////////////////////////
  // Persistence

  /**
   * The toJSON method encodes this type as a json object for persistence.
   * @return {object} - The json object.
   */
  toJSON() {
    return {
      x: this.x,
      y: this.y,
      z: this.z,
      t: this.t,
    }
  }

  /**
   * Decodes a JSON object to set the state of this class.
   *
   * @param {object} j - The json object.
   */
  fromJSON(j) {
    this.x = j.x;
    this.y = j.y;
    this.z = j.z;
    this.t = j.t;
  }

  /**
   * Loads the state of the value from a binary reader.
   *
   * @param {BinReader} reader - The reader value.
   */
  readBinary(reader) {
    this.x = reader.loadFloat32();
    this.y = reader.loadFloat32();
    this.z = reader.loadFloat32();
    this.t = reader.loadFloat32();
  }
}

Registry.register('Vec4', Vec4$1);

/* eslint-disable require-jsdoc */

/**
 * Class representing the red, green, blue and alpha channel of a color.
 *
 * @extends AttrValue
 */
class RGBA extends AttrValue {
  /**
   * Create a RGBA.
   * @param {number | string | Float32Array | ArrayBuffer} r - The red channel of a color.
   * @param {number} g - The green channel of a color.
   * @param {number} b - The blue channel of a color.
   * @param {number} a - The alpha (transparency) channel of a color.
   */
  constructor(r = 0, g = 0, b = 0, a = 255) {
    super();

    if (r instanceof Uint8Array) {
      this.__data = r;
    } else if (r instanceof ArrayBuffer) {
      const buffer = r;
      const byteOffset = g;
      this.__data = new Uint8Array(buffer, byteOffset, 4);
    } else {
      this.__data = new Uint8Array(4);
      if (typeof r == 'string') {
        if (r.startsWith('#')) {
          this.setFromHex(r);
        } else {
          this.setFromCSSColorName(r);
        }
      } else {
        this.__data[0] = r;
        this.__data[1] = g;
        this.__data[2] = b;
        this.__data[3] = a;
      }
    }
  }

  /**
   * Getter for red channel.
   *
   * @return {RGBA} - Returns the red channel.
   */
  get r() {
    return this.__data[0]
  }

  /**
   * Setter for red channel.
   *
   * @param {number} val - The val param.
   */
  set r(val) {
    this.__data[0] = val;
  }

  /**
   * Getter for green channel.
   *
   * @return {RGBA} - Returns the green channel.
   */
  get g() {
    return this.__data[1]
  }

  /**
   * Setter for green channel.
   *
   * @param {number} val - The val param.
   */
  set g(val) {
    this.__data[1] = val;
  }

  /**
   * Getter for blue channel.
   *
   * @return {RGBA} - Returns the blue channel.
   */
  get b() {
    return this.__data[2]
  }

  /**
   * Setter for blue channel.
   *
   * @param {number} val - The val param.
   */
  set b(val) {
    this.__data[2] = val;
  }

  /**
   * Getter for alpha channel.
   *
   * @return {RGBA} - Returns the alpha channel.
   */
  get a() {
    return this.__data[3]
  }
  /**
   * Setter for alpha value.
   *
   * @param {number} val - The val param.
   */
  set a(val) {
    this.__data[3] = val;
  }

  /**
   * Setter from scalar components.
   *
   * @param {number} r - The red channel.
   * @param {number} g  - The green channel.
   * @param {number} b  - The blue channel.
   * @param {number} a  - The alpha channel.
   */
  set(r, g, b, a = 255) {
    this.r = r;
    this.g = g;
    this.b = b;
    this.a = a;
  }

  /**
   * Setter from another RGBA color.
   *
   * @param {RGBA} other - The other RGBA to set from.
   */
  setFromOther(other) {
    this.r = other.r;
    this.g = other.g;
    this.b = other.b;
    this.a = other.a;
  }

  /**
   * Setter from a scalar array.
   *
   * @param {array} vals - The vals param.
   */
  setFromArray(vals) {
    this.r = vals[0];
    this.g = vals[1];
    this.b = vals[2];
    this.a = vals.length == 4 ? vals[3] : 1.0;
  }

  /**
   * Setter from a hexadecimal value.
   * E.g. #ff0000
   *
   * @param {number} hex - The hex value.
   */
  setFromHex(hex) {
    function hexToRgb(hex) {
      const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
      return result
        ? {
            r: parseInt(result[1], 16),
            g: parseInt(result[2], 16),
            b: parseInt(result[3], 16),
          }
        : null
    }
    const rgb = hexToRgb(hex);
    if (!rgb) {
      console.warn('Invalid hex code:' + hex);
      return
    }
    this.set(rgb.r, rgb.g, rgb.b);
  }

  /**
   * Setter from a CSS color name.
   * E.g. "red"
   *
   * @param {string} name - The CSS color name.
   */
  setFromCSSColorName(name) {
    const colourNameToHex = (colour) => {
      const colors = {
        aliceblue: '#f0f8ff',
        antiquewhite: '#faebd7',
        aqua: '#00ffff',
        aquamarine: '#7fffd4',
        azure: '#f0ffff',
        beige: '#f5f5dc',
        bisque: '#ffe4c4',
        black: '#000000',
        blanchedalmond: '#ffebcd',
        blue: '#0000ff',
        blueviolet: '#8a2be2',
        brown: '#a52a2a',
        burlywood: '#deb887',
        cadetblue: '#5f9ea0',
        chartreuse: '#7fff00',
        chocolate: '#d2691e',
        coral: '#ff7f50',
        cornflowerblue: '#6495ed',
        cornsilk: '#fff8dc',
        crimson: '#dc143c',
        cyan: '#00ffff',
        darkblue: '#00008b',
        darkcyan: '#008b8b',
        darkgoldenrod: '#b8860b',
        darkgray: '#a9a9a9',
        darkgreen: '#006400',
        darkkhaki: '#bdb76b',
        darkmagenta: '#8b008b',
        darkolivegreen: '#556b2f',
        darkorange: '#ff8c00',
        darkorchid: '#9932cc',
        darkred: '#8b0000',
        darksalmon: '#e9967a',
        darkseagreen: '#8fbc8f',
        darkslateblue: '#483d8b',
        darkslategray: '#2f4f4f',
        darkturquoise: '#00ced1',
        darkviolet: '#9400d3',
        deeppink: '#ff1493',
        deepskyblue: '#00bfff',
        dimgray: '#696969',
        dodgerblue: '#1e90ff',
        firebrick: '#b22222',
        floralwhite: '#fffaf0',
        forestgreen: '#228b22',
        fuchsia: '#ff00ff',
        gainsboro: '#dcdcdc',
        ghostwhite: '#f8f8ff',
        gold: '#ffd700',
        goldenrod: '#daa520',
        gray: '#808080',
        green: '#008000',
        greenyellow: '#adff2f',
        honeydew: '#f0fff0',
        hotpink: '#ff69b4',
        'indianred ': '#cd5c5c',
        indigo: '#4b0082',
        ivory: '#fffff0',
        khaki: '#f0e68c',
        lavender: '#e6e6fa',
        lavenderblush: '#fff0f5',
        lawngreen: '#7cfc00',
        lemonchiffon: '#fffacd',
        lightblue: '#add8e6',
        lightcoral: '#f08080',
        lightcyan: '#e0ffff',
        lightgoldenrodyellow: '#fafad2',
        lightgrey: '#d3d3d3',
        lightgreen: '#90ee90',
        lightpink: '#ffb6c1',
        lightsalmon: '#ffa07a',
        lightseagreen: '#20b2aa',
        lightskyblue: '#87cefa',
        lightslategray: '#778899',
        lightsteelblue: '#b0c4de',
        lightyellow: '#ffffe0',
        lime: '#00ff00',
        limegreen: '#32cd32',
        linen: '#faf0e6',
        magenta: '#ff00ff',
        maroon: '#800000',
        mediumaquamarine: '#66cdaa',
        mediumblue: '#0000cd',
        mediumorchid: '#ba55d3',
        mediumpurple: '#9370d8',
        mediumseagreen: '#3cb371',
        mediumslateblue: '#7b68ee',
        mediumspringgreen: '#00fa9a',
        mediumturquoise: '#48d1cc',
        mediumvioletred: '#c71585',
        midnightblue: '#191970',
        mintcream: '#f5fffa',
        mistyrose: '#ffe4e1',
        moccasin: '#ffe4b5',
        navajowhite: '#ffdead',
        navy: '#000080',
        oldlace: '#fdf5e6',
        olive: '#808000',
        olivedrab: '#6b8e23',
        orange: '#ffa500',
        orangered: '#ff4500',
        orchid: '#da70d6',
        palegoldenrod: '#eee8aa',
        palegreen: '#98fb98',
        paleturquoise: '#afeeee',
        palevioletred: '#d87093',
        papayawhip: '#ffefd5',
        peachpuff: '#ffdab9',
        peru: '#cd853f',
        pink: '#ffc0cb',
        plum: '#dda0dd',
        powderblue: '#b0e0e6',
        purple: '#800080',
        rebeccapurple: '#663399',
        red: '#ff0000',
        rosybrown: '#bc8f8f',
        royalblue: '#4169e1',
        saddlebrown: '#8b4513',
        salmon: '#fa8072',
        sandybrown: '#f4a460',
        seagreen: '#2e8b57',
        seashell: '#fff5ee',
        sienna: '#a0522d',
        silver: '#c0c0c0',
        skyblue: '#87ceeb',
        slateblue: '#6a5acd',
        slategray: '#708090',
        snow: '#fffafa',
        springgreen: '#00ff7f',
        steelblue: '#4682b4',
        tan: '#d2b48c',
        teal: '#008080',
        thistle: '#d8bfd8',
        tomato: '#ff6347',
        turquoise: '#40e0d0',
        violet: '#ee82ee',
        wheat: '#f5deb3',
        white: '#ffffff',
        whitesmoke: '#f5f5f5',
        yellow: '#ffff00',
        yellowgreen: '#9acd32',
      };

      if (typeof colors[colour.toLowerCase()] != 'undefined') return colors[colour.toLowerCase()]

      return false
    };
    if (name.startsWith('#')) {
      this.setFromHex(name);
    } else {
      this.setFromHex(colourNameToHex(name));
    }
  }

  /**
   * Returns the hexadecimal value of this RGBA color.
   *
   * @return {string} - Returns the hex value.
   */
  toHex() {
    function componentToHex(int) {
      const hex = int.toString(16);
      return hex.length == 1 ? '0' + hex : hex
    }
    return '#' + componentToHex(this.r) + componentToHex(this.g) + componentToHex(this.b)
  }

  /**
   * Returns true if this RGBA color is exactly the same as other.
   *
   * @param {RGBA} other - The other RGBA to compare with.
   * @return {boolean} - Returns true or false.
   */
  equal(other) {
    return this.r == other.r && this.g == other.g && this.b == other.b && this.a == other.a
  }

  /**
   * Returns true if this RGBA color is NOT exactly the same as other.
   *
   * @param {RGBA} other -  The other RGBA to compare with.
   * @return {boolean} - Returns true or false.
   */
  notEquals(other) {
    return this.r != other.r && this.g != other.g && this.b != other.b && this.a != other.a
  }

  /**
   * Returns true if this RGBA color is approximately the same as other.
   *
   * @param {RGBA} other - The other RGBA to compare with.
   * @param {number} precision - The precision to which the values must match.
   * @return {boolean} - Returns true or false.
   */
  approxEqual(other, precision = Number.EPSILON) {
    return (
      Math.abs(this.r - other.r) < precision &&
      Math.abs(this.g - other.g) < precision &&
      Math.abs(this.b - other.b) < precision &&
      Math.abs(this.a - other.a) < precision
    )
  }

  /**
   * Returns a new RGBA color which is this RGBA color added to other.
   *
   * @param {RGBA} other - The other RGBA to add.
   * @return {RGBA} - Returns a new RGBA.
   */
  add(other) {
    return new RGBA(this.r + other.r, this.g + other.g, this.b + other.b, this.a + other.a)
  }

  /**
   * Returns a new RGBA color which is this RGBA color subtracted from other.
   *
   * @param {RGBA} other - The other RGBA to subtract.
   * @return {RGBA} - Returns a new RGBA.
   */
  subtract(other) {
    return new RGBA(this.r - other.r, this.g - other.g, this.b - other.b, this.a - other.a)
  }

  /**
   * Returns a new RGBA color which is this vector scaled by scalar.
   *
   * @param {number} scalar - The scalar value.
   * @return {RGBA} - Returns a new RGBA.
   */
  scale(scalar) {
    return new RGBA(this.r * scalar, this.g * scalar, this.b * scalar, this.a * scalar)
  }

  /**
   * Scales this RGBA color by scalar.
   *
   * @param {number} scalar - The scalar value.
   */
  scaleInPlace(scalar) {
    this.r *= scalar;
    this.g *= scalar;
    this.b *= scalar;
    this.a *= scalar;
  }

  /**
   * Apply gamma correction to this RGBA color.
   *
   * @param {number} gamma - The gamma value.
   */
  applyGamma(gamma) {
    this.set(Math.pow(this.r, gamma), Math.pow(this.g, gamma), Math.pow(this.b, gamma), this.a);
  }

  /**
   * Converts to linear color space and returns a new color.
   * @param {number} gamma - The gamma value.
   * @return {Color} - Returns a new RGBA.
   */
  toLinear(gamma = 2.2) {
    return new RGBA(Math.pow(this.r, gamma), Math.pow(this.g, gamma), Math.pow(this.b, gamma), this.a)
  }

  /**
   * Converts to gamma color space and returns a new RGBA color.
   *
   * @param {number} gamma - The gamma value.
   * @return {RGBA} - Returns a new RGBA.
   */
  toGamma(gamma = 2.2) {
    return new RGBA(Math.pow(this.r, 1.0 / gamma), Math.pow(this.g, 1.0 / gamma), Math.pow(this.b, 1.0 / gamma), this.a)
  }

  /**
   * Calculates and returns the relative luminance of the linear RGB component.
   *
   * @return {number} - The return value.
   */
  luminance() {
    return 0.2126 * this.r + 0.7152 * this.g + 0.0722 * this.b
  }

  /**
   * Performs a linear interpolation between this RGBA color and other.
   *
   * @param {RGBA} other - The other RGBA to interpolate between.
   * @param {number} t - Interpolation amount between the two inputs.
   * @return {RGBA} - Returns a new RGBA.
   */
  lerp(other, t) {
    const ar = this.r;
    const ag = this.g;
    const ab = this.b;
    const aa = this.a;
    return new RGBA(ar + t * (other.r - ar), ag + t * (other.g - ag), ab + t * (other.b - ab), aa + t * (other.a - aa))
  }

  /**
   * Creates a random RGBA.
   *
   * @param {number} gammaOffset - The gamma offset.
   * @param {boolean} randomAlpha - Determines whether the alpha channel is random.
   * @return {RGBA} - Returns a new random RGBA.
   */
  static random(gammaOffset = 0.0, randomAlpha = false) {
    if (gammaOffset > 0.0) {
      return new RGBA(
        gammaOffset + Math.random() * (1.0 - gammaOffset),
        gammaOffset + Math.random() * (1.0 - gammaOffset),
        gammaOffset + Math.random() * (1.0 - gammaOffset),
        randomAlpha ? gammaOffset + Math.random() * (1.0 - gammaOffset) : 1.0
      )
    } else if (gammaOffset < 0.0) {
      return new RGBA(
        Math.random() * (1.0 + gammaOffset),
        Math.random() * (1.0 + gammaOffset),
        Math.random() * (1.0 + gammaOffset),
        randomAlpha ? Math.random() * (1.0 + gammaOffset) : 1.0
      )
    } else {
      return new RGBA(Math.random(), Math.random(), Math.random(), randomAlpha ? Math.random() : 1.0)
    }
  }

  /**
   * Clones this RGBA color and returns a new RGBA color.
   *
   * @return {RGBA} - Returns a new RGBA.
   */
  clone() {
    return new RGBA(this.__data[0], this.__data[1], this.__data[2], this.__data[3])
  }

  /**
   * Returns the type as an array. Often used to pass types to the GPU.
   *
   * @return {array} - Returns as an array.
   */
  asArray() {
    return this.__data
  }

  /**
   * Returns the type as a 3 component array. Often used to pass types to the GPU.
   *
   * @return {array} - Returns as a 3 component array.
   */
  as3ComponentArray() {
    return [this.__data[0], this.__data[1], this.__data[2]]
  }

  // ////////////////////////////////////////
  // Static Methods

  /**
   * Creates a new RGBA color.
   * @param {...object} ...args - The ...args param.
   * @return {RGBA} - Returns a new RGBA.
   * @private
   */
  static create(...args) {
    return new RGBA(...args)
  }

  /**
   * The createFromFloat32Buffer method.
   *
   * @param {ArrayBuffer} buffer - The buffer value.
   * @param {number} offset - The offset value.
   * @return {RGBA} - Returns a new color.
   * @deprecated
   * @private
   */
  static createFromFloat32Buffer(buffer, offset = 0) {
    console.warn('Deprecated, use #createFromBuffer instead');
    return this.createFromBuffer(buffer, offset * 4)
  }

  /**
   * Creates an instance of a `RGBA` using an ArrayBuffer.
   *
   * @static
   * @param {ArrayBuffer} buffer - The buffer value.
   * @param {number} byteOffset - The offset value.
   * @return {RGBA} - Returns a new RGBA.
   */
  static createFromBuffer(buffer, byteOffset) {
    return new RGBA(new Uint8Array(buffer, byteOffset, 4)) // 4 bytes per 32bit float
  }

  /**
   * Returns the number of Float32 elements used by this type. Used to calculate storage requirements for large arrays of this type.
   * @return {number} - The return value.
   * @private
   */
  static numElements() {
    return 4
  }

  // ////////////////////////////////////////
  // Persistence

  /**
   * The toJSON method encodes this type as a json object for persistences.
   *
   * @return {object} - The json object.
   */
  toJSON() {
    return {
      r: this.r,
      g: this.g,
      b: this.b,
      a: this.a,
    }
  }

  /**
   * The fromJSON method decodes a json object for this type.
   *
   * @param {object} j - The json object.
   */
  fromJSON(j) {
    this.r = j.r;
    this.g = j.g;
    this.b = j.b;
    this.a = j.a;
  }

  /**
   * Returns the CSS rgba string.
   *
   * @return {string} - The return value.
   */
  toCSSString() {
    return (
      'rgba(' +
      Math.round(this.r * 255) +
      ', ' +
      Math.round(this.g * 255) +
      ', ' +
      Math.round(this.b * 255) +
      ', ' +
      this.a +
      ')'
    )
  }
}

Registry.register('RGBA', RGBA);

/* eslint-disable require-jsdoc */

/**
 * Class representing a color as 4 floating point values.
 *
 * @extends AttrValue
 */
class Color extends AttrValue {
  /**
   * Creates a `Color` object with an RGBA structure.
   *
   * @param {number | string | Float32Array | ArrayBuffer} r - The red channel of a color.
   * @param {number} g - The green channel of a color.
   * @param {number} b - The blue channel of a color.
   * @param {number} a - The alpha (transparency) channel of a color.
   */
  constructor(r = 0, g = 0, b = 0, a = 1.0) {
    super();

    if (r instanceof Float32Array) {
      this.__data = r;
    } else if (r instanceof ArrayBuffer) {
      console.warn(`deprecated, please use new Vec4(new Float32Array(buffer, byteOffset, 4))`);
      const buffer = r;
      const byteOffset = g;
      this.__data = new Float32Array(buffer, byteOffset, 4);
    } else {
      this.__data = new Float32Array(4);
      if (typeof r == 'string') {
        if (r.startsWith('#')) {
          this.setFromHex(r);
        } else {
          this.setFromCSSColorName(r);
        }
      } else {
        this.__data[0] = r;
        this.__data[1] = g;
        this.__data[2] = b;
        this.__data[3] = a;
      }
    }
  }

  /**
   * Getter for red channel.
   *
   * @return {number} - Returns the red channel.
   */
  get r() {
    return this.__data[0]
  }

  /**
   * Setter for red channel.
   *
   * @param {number} val - The val param.
   */
  set r(val) {
    this.__data[0] = val;
  }

  /**
   * Getter for green channel.
   *
   * @return {number} - Returns the green channel.
   */
  get g() {
    return this.__data[1]
  }

  /**
   * Setter for green channel.
   * @param {number} val - The val param.
   */
  set g(val) {
    this.__data[1] = val;
  }

  /**
   * Getter for blue channel.
   *
   * @return {number} - Returns the blue channel.
   */
  get b() {
    return this.__data[2]
  }

  /**
   * Setter for blue channel.
   *
   * @param {number} val - The val param.
   */
  set b(val) {
    this.__data[2] = val;
  }

  /**
   * Getter for alpha channel.
   *
   * @return {number} - Returns the alpha channel.
   */
  get a() {
    return this.__data[3]
  }
  /**
   * Setter for alpha value.
   *
   * @param {number} val - The val param.
   */
  set a(val) {
    this.__data[3] = val;
  }

  /**
   * Setter from scalar components.
   *
   * @param {number} r - The red channel.
   * @param {number} g  - The green channel.
   * @param {number} b  - The blue channel.
   * @param {number} a  - The alpha channel.
   */
  set(r, g, b, a = 1.0) {
    this.r = r;
    this.g = g;
    this.b = b;
    this.a = a;
  }

  /**
   * Sets current color state with another `Color` object.
   *
   * @param {Color} other - The other color to set from.
   */
  setFromOther(other) {
    this.r = other.r;
    this.g = other.g;
    this.b = other.b;
    this.a = other.a;
  }

  /**
   * Setter from a scalar array.
   *
   * @param {Float32Array} vals - The vals param.
   */
  setFromScalarArray(vals) {
    this.r = vals[0];
    this.g = vals[1];
    this.b = vals[2];
    this.a = vals.length == 4 ? vals[3] : 1.0;
  }

  /**
   * Getter from an RGB array.
   *
   * @return {array} - The return value.
   */
  getAsRGBArray() {
    return [this.r * 255, this.g * 255, this.b * 255]
  }

  /**
   * Getter from an RGB dict.
   *
   * @return {object} - The return value.
   */
  getAsRGBDict() {
    return {
      r: this.r * 255,
      g: this.g * 255,
      b: this.b * 255,
    }
  }

  /**
   * Setter from a RGB value.
   *
   * @param {number} r - The red channel.
   * @param {number} g  - The green channel.
   * @param {number} b  - The blue channel.
   * @param {number} a  - The alpha channel.
   */
  setFromRGB(r, g, b, a) {
    this.r = r / 255;
    this.g = g / 255;
    this.b = b / 255;
    this.a = a ? a / 255 : 1.0;
  }

  /**
   * Setter from an RGB array.
   *
   * @param {Float32Array} vals - The vals param.
   */
  setFromRGBArray(vals) {
    this.r = vals[0] / 255;
    this.g = vals[1] / 255;
    this.b = vals[2] / 255;
    this.a = vals.length == 4 ? vals[3] / 255 : 1.0;
  }

  /**
   * Setter from an RGB dict.
   *
   * @param {Float32Array} vals - The vals param.
   */
  setFromRGBDict(vals) {
    this.r = vals.r / 255;
    this.g = vals.g / 255;
    this.b = vals.b / 255;
    this.a = vals.a == 4 ? vals.a / 255 : 1.0;
  }

  /**
   * Setter from a hexadecimal value.
   * E.g. #ff0000
   * @param {number} hex - The hex value.
   */
  setFromHex(hex) {
    function hexToRgb(hex) {
      const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
      return result
        ? {
            r: parseInt(result[1], 16),
            g: parseInt(result[2], 16),
            b: parseInt(result[3], 16),
          }
        : null
    }
    const rgb = hexToRgb(hex);
    if (!rgb) {
      console.warn('Invalid hex code:' + hex);
      return
    }
    this.setFromRGB(rgb.r, rgb.g, rgb.b);
  }

  /**
   * Setter from a CSS color name.
   * E.g. "red"
   * @param {string} name - The CSS color name.
   */
  setFromCSSColorName(name) {
    const colourNameToHex = (colour) => {
      const colors = {
        aliceblue: '#f0f8ff',
        antiquewhite: '#faebd7',
        aqua: '#00ffff',
        aquamarine: '#7fffd4',
        azure: '#f0ffff',
        beige: '#f5f5dc',
        bisque: '#ffe4c4',
        black: '#000000',
        blanchedalmond: '#ffebcd',
        blue: '#0000ff',
        blueviolet: '#8a2be2',
        brown: '#a52a2a',
        burlywood: '#deb887',
        cadetblue: '#5f9ea0',
        chartreuse: '#7fff00',
        chocolate: '#d2691e',
        coral: '#ff7f50',
        cornflowerblue: '#6495ed',
        cornsilk: '#fff8dc',
        crimson: '#dc143c',
        cyan: '#00ffff',
        darkblue: '#00008b',
        darkcyan: '#008b8b',
        darkgoldenrod: '#b8860b',
        darkgray: '#a9a9a9',
        darkgreen: '#006400',
        darkkhaki: '#bdb76b',
        darkmagenta: '#8b008b',
        darkolivegreen: '#556b2f',
        darkorange: '#ff8c00',
        darkorchid: '#9932cc',
        darkred: '#8b0000',
        darksalmon: '#e9967a',
        darkseagreen: '#8fbc8f',
        darkslateblue: '#483d8b',
        darkslategray: '#2f4f4f',
        darkturquoise: '#00ced1',
        darkviolet: '#9400d3',
        deeppink: '#ff1493',
        deepskyblue: '#00bfff',
        dimgray: '#696969',
        dodgerblue: '#1e90ff',
        firebrick: '#b22222',
        floralwhite: '#fffaf0',
        forestgreen: '#228b22',
        fuchsia: '#ff00ff',
        gainsboro: '#dcdcdc',
        ghostwhite: '#f8f8ff',
        gold: '#ffd700',
        goldenrod: '#daa520',
        gray: '#808080',
        green: '#008000',
        greenyellow: '#adff2f',
        honeydew: '#f0fff0',
        hotpink: '#ff69b4',
        'indianred ': '#cd5c5c',
        indigo: '#4b0082',
        ivory: '#fffff0',
        khaki: '#f0e68c',
        lavender: '#e6e6fa',
        lavenderblush: '#fff0f5',
        lawngreen: '#7cfc00',
        lemonchiffon: '#fffacd',
        lightblue: '#add8e6',
        lightcoral: '#f08080',
        lightcyan: '#e0ffff',
        lightgoldenrodyellow: '#fafad2',
        lightgrey: '#d3d3d3',
        lightgreen: '#90ee90',
        lightpink: '#ffb6c1',
        lightsalmon: '#ffa07a',
        lightseagreen: '#20b2aa',
        lightskyblue: '#87cefa',
        lightslategray: '#778899',
        lightsteelblue: '#b0c4de',
        lightyellow: '#ffffe0',
        lime: '#00ff00',
        limegreen: '#32cd32',
        linen: '#faf0e6',
        magenta: '#ff00ff',
        maroon: '#800000',
        mediumaquamarine: '#66cdaa',
        mediumblue: '#0000cd',
        mediumorchid: '#ba55d3',
        mediumpurple: '#9370d8',
        mediumseagreen: '#3cb371',
        mediumslateblue: '#7b68ee',
        mediumspringgreen: '#00fa9a',
        mediumturquoise: '#48d1cc',
        mediumvioletred: '#c71585',
        midnightblue: '#191970',
        mintcream: '#f5fffa',
        mistyrose: '#ffe4e1',
        moccasin: '#ffe4b5',
        navajowhite: '#ffdead',
        navy: '#000080',
        oldlace: '#fdf5e6',
        olive: '#808000',
        olivedrab: '#6b8e23',
        orange: '#ffa500',
        orangered: '#ff4500',
        orchid: '#da70d6',
        palegoldenrod: '#eee8aa',
        palegreen: '#98fb98',
        paleturquoise: '#afeeee',
        palevioletred: '#d87093',
        papayawhip: '#ffefd5',
        peachpuff: '#ffdab9',
        peru: '#cd853f',
        pink: '#ffc0cb',
        plum: '#dda0dd',
        powderblue: '#b0e0e6',
        purple: '#800080',
        rebeccapurple: '#663399',
        red: '#ff0000',
        rosybrown: '#bc8f8f',
        royalblue: '#4169e1',
        saddlebrown: '#8b4513',
        salmon: '#fa8072',
        sandybrown: '#f4a460',
        seagreen: '#2e8b57',
        seashell: '#fff5ee',
        sienna: '#a0522d',
        silver: '#c0c0c0',
        skyblue: '#87ceeb',
        slateblue: '#6a5acd',
        slategray: '#708090',
        snow: '#fffafa',
        springgreen: '#00ff7f',
        steelblue: '#4682b4',
        tan: '#d2b48c',
        teal: '#008080',
        thistle: '#d8bfd8',
        tomato: '#ff6347',
        turquoise: '#40e0d0',
        violet: '#ee82ee',
        wheat: '#f5deb3',
        white: '#ffffff',
        whitesmoke: '#f5f5f5',
        yellow: '#ffff00',
        yellowgreen: '#9acd32',
      };

      if (typeof colors[colour.toLowerCase()] != 'undefined') return colors[colour.toLowerCase()]

      return false
    };
    if (name.startsWith('#')) {
      this.setFromHex(name);
    } else {
      this.setFromHex(colourNameToHex(name));
    }
  }

  /**
   * Returns the hexadecimal value of this color.
   *
   * @return {string} - Returns the hex value.
   */
  toHex() {
    function componentToHex(c) {
      const int = Math.round(c * 255);
      const hex = int.toString(16);
      return hex.length == 1 ? '0' + hex : hex
    }
    return '#' + componentToHex(this.r) + componentToHex(this.g) + componentToHex(this.b)
  }

  /**
   * Returns true if this color is exactly the same as other.
   *
   * @param {Color} other - The other color to compare with.
   * @return {boolean} - Returns true or false.
   */
  equal(other) {
    return this.r == other.r && this.g == other.g && this.b == other.b && this.a == other.a
  }

  /**
   * Returns true if this color is NOT exactly the same as other.
   *
   * @param {Color} other - The other color to compare with.
   * @return {boolean} - Returns true or false.
   */
  notEquals(other) {
    return this.r != other.r && this.g != other.g && this.b != other.b && this.a != other.a
  }

  /**
   * Returns true if this color is approximately the same as other.
   *
   * @param {Color} other - The other color to compare with.
   * @param {number} precision - The precision to which the values must match.
   * @return {boolean} - Returns true or false.
   */
  approxEqual(other, precision = Number.EPSILON) {
    return (
      Math.abs(this.r - other.r) < precision &&
      Math.abs(this.g - other.g) < precision &&
      Math.abs(this.b - other.b) < precision &&
      Math.abs(this.a - other.a) < precision
    )
  }

  /**
   * Returns a new Color which is this Color added to other.
   *
   * @param {Color} other - The other color to add.
   * @return {Color} - Returns a new color.
   */
  add(other) {
    return new Color(this.r + other.r, this.g + other.g, this.b + other.b, this.a + other.a)
  }

  /**
   * Returns a new color which is this color subtracted from other.
   *
   * @param {Color} other - The other color to subtract.
   * @return {Color} - Returns a new color.
   */
  subtract(other) {
    return new Color(this.r - other.r, this.g - other.g, this.b - other.b, this.a - other.a)
  }

  /**
   * Scales this color by scalar and return the result as a new Vec4.
   *
   * @param {number} scalar - The scalar value.
   * @return {Color} - Returns a new color.
   */
  scale(scalar) {
    return new Color(this.r * scalar, this.g * scalar, this.b * scalar, this.a * scalar)
  }

  /**
   * Scales this color by scalar.
   *
   * @param {number} scalar - The scalar value.
   */
  scaleInPlace(scalar) {
    this.r *= scalar;
    this.g *= scalar;
    this.b *= scalar;
    this.a *= scalar;
  }

  /**
   * Apply gamma correction to this color
   *
   * @param {number} gamma - The gamma value.
   */
  applyGamma(gamma) {
    this.set(Math.pow(this.r, gamma), Math.pow(this.g, gamma), Math.pow(this.b, gamma), this.a);
  }

  /**
   * Converts to linear color space and returns a new color
   *
   * @param {number} gamma - The gamma value.
   * @return {Color} - Returns a new color.
   */
  toLinear(gamma = 2.2) {
    return new Color(Math.pow(this.r, gamma), Math.pow(this.g, gamma), Math.pow(this.b, gamma), this.a)
  }

  /**
   * Converts to gamma color space and returns a new color.
   *
   * @param {number} gamma - The gamma value.
   * @return {Color} - Returns a new color.
   */
  toGamma(gamma = 2.2) {
    return new Color(
      Math.pow(this.r, 1.0 / gamma),
      Math.pow(this.g, 1.0 / gamma),
      Math.pow(this.b, 1.0 / gamma),
      this.a
    )
  }

  /**
   * Calculates and returns the relative luminance of the linear RGB component.
   *
   * @return {number} - The return value.
   */
  luminance() {
    return 0.2126 * this.r + 0.7152 * this.g + 0.0722 * this.b
  }

  /**
   * Performs a linear interpolation between this color and other.
   *
   * @param {Color} other - The other color to interpolate between.
   * @param {number} t - Interpolation amount between the two inputs.
   * @return {Color} - Returns a new color.
   */
  lerp(other, t) {
    const ar = this.r;
    const ag = this.g;
    const ab = this.b;
    const aa = this.a;
    return new Color(ar + t * (other.r - ar), ag + t * (other.g - ag), ab + t * (other.b - ab), aa + t * (other.a - aa))
  }

  /**
   * Creates a random color.
   *
   * @param {number} gammaOffset - The gamma offset.
   * @param {boolean} randomAlpha - Determines whether the alpha channel is random.
   * @return {Color} - Returns a new random color.
   */
  static random(gammaOffset = 0.0, randomAlpha = false) {
    if (gammaOffset > 0.0) {
      return new Color(
        gammaOffset + Math.random() * (1.0 - gammaOffset),
        gammaOffset + Math.random() * (1.0 - gammaOffset),
        gammaOffset + Math.random() * (1.0 - gammaOffset),
        randomAlpha ? gammaOffset + Math.random() * (1.0 - gammaOffset) : 1.0
      )
    } else if (gammaOffset < 0.0) {
      return new Color(
        Math.random() * (1.0 + gammaOffset),
        Math.random() * (1.0 + gammaOffset),
        Math.random() * (1.0 + gammaOffset),
        randomAlpha ? Math.random() * (1.0 + gammaOffset) : 1.0
      )
    } else {
      return new Color(Math.random(), Math.random(), Math.random(), randomAlpha ? Math.random() : 1.0)
    }
  }

  /**
   * Clones this color and returns a new color.
   *
   * @return {Color} - Returns a new color.
   */
  clone() {
    return new Color(this.__data[0], this.__data[1], this.__data[2], this.__data[3])
  }

  /**
   * Returns the type as an array. Often used to pass types to the GPU.
   *
   * @return {array} - Returns as an array.
   */
  asArray() {
    return this.__data
  }

  /**
   * Returns the type as a 3 component array. Often used to pass types to the GPU.
   *
   * @return {array} - Returns as a 3 component array.
   * @private
   */
  as3ComponentArray() {
    return [this.__data[0], this.__data[1], this.__data[2]]
  }

  // ////////////////////////////////////////
  // Static Methods

  /**
   * Creates a new color.
   * @param {...object} ...args - The ...args param.
   * @return {Color} - Returns a new color.
   * @private
   */
  static create(...args) {
    return new Color(...args)
  }

  /**
   * The createFromFloat32Buffer method.
   * @param {ArrayBuffer} buffer - The buffer value.
   * @param {number} offset - The offset value.
   * @return {Color} - Returns a new color.
   * @deprecated
   * @private
   */
  static createFromFloat32Buffer(buffer, offset = 0) {
    console.warn('Deprecated, use #createFromBuffer instead');
    return this.createFromBuffer(buffer, offset * 4)
  }

  /**
   * Creates an instance of a `Color` using an ArrayBuffer.
   *
   * @static
   * @param {ArrayBuffer} buffer - The buffer value.
   * @param {number} byteOffset - The offset value.
   * @return {Color} - Returns a new color.
   */
  static createFromBuffer(buffer, byteOffset) {
    return new Color(new Float32Array(buffer, byteOffset, 4)) // 4 bytes per 32bit float
  }

  /**
   * Returns the number of Float32 elements used by this type. Used to calculate storage requirements for large arrays of this type.
   * @return {number} - The return value.
   * @private
   */
  static numElements() {
    return 4
  }

  // ////////////////////////////////////////
  // Persistence

  /**
   * The toJSON method encodes this type as a json object for persistence.
   *
   * @return {object} - The json object.
   */
  toJSON() {
    return {
      r: this.r,
      g: this.g,
      b: this.b,
      a: this.a,
    }
  }

  /**
   * The fromJSON method decodes a json object for this type.
   *
   * @param {object} j - The json object.
   */
  fromJSON(j) {
    this.r = j.r;
    this.g = j.g;
    this.b = j.b;
    this.a = j.a;
  }

  /**
   * Loads the state of the value from a binary reader.
   *
   * @param {BinReader} reader - The reader value.
   */
  readBinary(reader) {
    this.r = reader.loadFloat32();
    this.g = reader.loadFloat32();
    this.b = reader.loadFloat32();
    this.a = reader.loadFloat32();
  }

  /**
   * Returns the CSS rgba string.
   *
   * @return {string} - The return value.
   */
  toCSSString() {
    return (
      'rgba(' +
      Math.round(this.r * 255) +
      ', ' +
      Math.round(this.g * 255) +
      ', ' +
      Math.round(this.b * 255) +
      ', ' +
      this.a +
      ')'
    )
  }
}

Registry.register('Color', Color);

/**
 * Class representing euler angles. Euler angles describe rotating an object
 * around its various axis in a specified axis order.
 *
 * @extends AttrValue
 */
class EulerAngles extends AttrValue {
  /**
   * Create a euler angle. Receives the xyz values in degrees and the order that the rotations are applied.
   * <br>
   * Order parameter values: `XYZ: 0`, `YZX: 1`, `ZXY: 2`, `XZY: 3`, `ZYX: 4`, `YXZ: 5`
   * <br>
   * It could be either the `string` or the `number` value.
   *
   * @param {number} x - The angle of the x axis in degrees. Default is 0.
   * @param {number} y - The angle of the y axis in degrees. Default is 0.
   * @param {number} z - The angle of the z axis in degrees. Default is 0.
   * @param {number | string} order - The order in which the rotations are applied.
   */
  constructor(x = 0, y = 0, z = 0, order = 0) {
    super();

    if (!isNaN(order)) this.order = order;
    else {
      switch (order) {
        case 'XYZ':
          this.order = 0;
          break
        case 'YZX':
          this.order = 1;
          break
        case 'ZXY':
          this.order = 2;
          break
        case 'XZY':
          this.order = 3;
          break
        case 'ZYX':
          this.order = 4;
          break
        case 'YXZ':
          this.order = 5;
          break
        default:
          throw new Error('Invalid Euler Angles Order:' + order)
      }
    }
    if (x instanceof ArrayBuffer) {
      const buffer = x;
      const byteOffset = y;
      this.__data = new Float32Array(buffer, byteOffset, 4);
    } else {
      this.__data = new Float32Array(3);
      this.__data[0] = x;
      this.__data[1] = y;
      this.__data[2] = z;
    }
  }

  /**
   * Getter for x axis rotation.
   *
   * @return {number} - Returns the x axis rotation.
   */
  get x() {
    return this.__data[0]
  }

  /**
   * Setter for x axis rotation.
   *
   * @param {number} val - The val param.
   */
  set x(val) {
    this.__data[0] = val;
  }

  /**
   * Getter for y axis rotation.
   *
   * @return {number} - Returns the y axis rotation.
   */
  get y() {
    return this.__data[1]
  }

  /**
   * Setter for y axis rotation.
   *
   * @param {number} val - The val param.
   */
  set y(val) {
    this.__data[1] = val;
  }

  /**
   * Getter for z axis rotation.
   *
   * @return {number} - Returns the z axis rotation.
   */
  get z() {
    return this.__data[2]
  }

  /**
   * Setter for z axis rotation.
   *
   * @param {number} val - The val param.
   */
  set z(val) {
    this.__data[2] = val;
  }

  /**
   * Sets the EulerAngles
   *
   * @param {number} x - The x axis rotation.
   * @param {number} y  - The y axis rotation.
   * @param {number} z  - The z axis rotation.
   */
  set(x, y, z) {
    this.__data[0] = x;
    this.__data[1] = y;
    this.__data[2] = z;
  }
}

Registry.register('EulerAngles', EulerAngles);

/* eslint-disable new-cap */

/**
 * A class representing a 3x3 matrix.
 * This matrix class is based on GLM, and is column major.
 *
 * @extends AttrValue
 */
class Mat3$1 extends AttrValue {
  /**
   * Initializes the Mat3 class with given data.
   *
   * @param {number | ArrayBuffer} m00 - Row 0, column 0.
   * @param {number} m01 - Row 0, column 1.
   * @param {number} m02 - Row 0, column 2.
   * @param {number} m10 - Row 1, column 0.
   * @param {number} m11 - Row 1, column 1.
   * @param {number} m12 - Row 1, column 2.
   * @param {number} m20 - Row 2, column 0.
   * @param {number} m21 - Row 2, column 1.
   * @param {number} m22 - Row 2, column 2.
   */
  constructor(m00 = 1, m01 = 0, m02 = 0, m10 = 0, m11 = 1, m12 = 0, m20 = 0, m21 = 0, m22 = 1) {
    super();

    if (m00 instanceof Float32Array || m00 instanceof Uint32Array) {
      this.__data = m00;
    } else if (m00 instanceof ArrayBuffer) {
      console.warn(`Deprecated, please use new Vec3(new Float32Array(buffer, byteOffset, 9))`);
      const buffer = m00;
      const byteOffset = m01;
      this.__data = new Float32Array(buffer, byteOffset, 9);
    } else {
      this.__data = new Float32Array(9);
      this.set(m00, m01, m02, m10, m11, m12, m20, m21, m22);
    }
  }

  // /////////////////////////////////////////
  // properties

  /**
   * Getter for row 0, column 0.
   * @return {number} - Returns the m00 value.
   */
  get m00() {
    return this.__data[0]
  }

  /**
   * Setter for row 0, column 0.
   *
   * @param {number} val - The val param.
   */
  set m00(val) {
    this.__data[0] = val;
  }

  /**
   * Getter for row 0, column 1.
   *
   * @return {number} - Returns the m01 value.
   */
  get m01() {
    return this.__data[1]
  }

  /**
   * Setter for row 0, column 1.
   *
   * @param {number} val - The val param.
   */
  set m01(val) {
    this.__data[1] = val;
  }

  /**
   * Getter for row 0, column 2.
   *
   * @return {number} - Returns the m02 value.
   */
  get m02() {
    return this.__data[2]
  }

  /**
   * Setter for row 0, column 2.
   *
   * @param {number} val - The val param.
   */
  set m02(val) {
    this.__data[2] = val;
  }

  /**
   * Getter for row 1, column 0.
   *
   * @return {number} - Returns the m10 value.
   */
  get m10() {
    return this.__data[3]
  }

  /**
   * Setter for row 1, column 0.
   *
   * @param {number} val - The val param.
   */
  set m10(val) {
    this.__data[3] = val;
  }

  /**
   * Getter for row 1, column 1
   *
   * @return {number} - Returns the m11 value.
   */
  get m11() {
    return this.__data[4]
  }

  /**
   * Setter for row 1, column 1.
   *
   * @param {number} val - The val param.
   */
  set m11(val) {
    this.__data[4] = val;
  }

  /**
   * Getter for row 1, column 2.
   *
   * @return {number} - Returns the m12 value.
   */
  get m12() {
    return this.__data[5]
  }

  /**
   * Setter for row 1, column 2.
   *
   * @param {number} val - The val param.
   */
  set m12(val) {
    this.__data[5] = val;
  }

  /**
   * Getter for row 2, column 0.
   *
   * @return {number} - Returns the m20 value.
   */
  get m20() {
    return this.__data[6]
  }

  /**
   * Setter for row 2, column 0.
   *
   * @param {number} val - The val param.
   */
  set m20(val) {
    this.__data[6] = val;
  }

  /**
   * Getter for row 2, column 1.
   *
   * @return {number} - Returns the m21 value.
   */
  get m21() {
    return this.__data[7]
  }

  /**
   * Setter for row 2, column 1.
   *
   * @param {number} val - The val param.
   */
  set m21(val) {
    this.__data[7] = val;
  }

  /**
   * Getter for row 2, column 2.
   *
   * @return {number} - Returns the m22 value.
   */
  get m22() {
    return this.__data[8]
  }

  /**
   * Setter for row 2, column 2.
   *
   * @param {number} val - The val param.
   */
  set m22(val) {
    this.__data[8] = val;
  }

  /**
   * Getter for the `x` axis.
   *
   * @return {Vec3} - Returns the `x` axis as a Vec3.
   */
  get xAxis() {
    return Vec3$1.createFromBuffer(this.__data.buffer, 0)
  }

  /**
   * Setter for the `x` axis.
   *
   * @param {Vec3} vec3 - The vec3 value.
   */
  set xAxis(vec3) {
    this.xAxis.set(vec3.x, vec3.y, vec3.z);
  }

  /**
   * Getter for the `y` axis.
   * * @return {Vec3} - Returns the `y` axis as a Vec3.
   */
  get yAxis() {
    return Vec3$1.createFromBuffer(this.__data.buffer, 3 * 4)
  }

  /**
   * Setter for the `y` axis.
   * @param {Vec3} vec3 - The vec3 value.
   */
  set yAxis(vec3) {
    this.yAxis.set(vec3.x, vec3.y, vec3.z);
  }

  /**
   * Getter for the `z` axis.
   * * @return {Vec3} - Returns the `z` axis as a Vec3.
   */
  get zAxis() {
    return Vec3$1.createFromBuffer(this.__data.buffer, 6 * 4)
  }

  /**
   * Setter for the `z` axis.
   * @param {Vec3} vec3 - The vec3 value.
   */
  set zAxis(vec3) {
    this.zAxis.set(vec3.x, vec3.y, vec3.z);
  }

  // /////////////////////////////////////////
  // Setters

  /**
   * Sets the state of the Mat3 class
   *
   * @param {number} m00 - Row 0, column 0.
   * @param {number} m01 - Row 0, column 1.
   * @param {number} m02 - Row 0, column 2.
   * @param {number} m10 - Row 1, column 0.
   * @param {number} m11 - Row 1, column 1.
   * @param {number} m12 - Row 1, column 2.
   * @param {number} m20 - Row 2, column 0.
   * @param {number} m21 - Row 2, column 1.
   * @param {number} m22 - Row 2, column 2.
   */
  set(m00 = 1, m01 = 0, m02 = 0, m10 = 0, m11 = 1, m12 = 0, m20 = 0, m21 = 0, m22 = 1) {
    this.__data[0] = m00;
    this.__data[1] = m01;
    this.__data[2] = m02;
    this.__data[3] = m10;
    this.__data[4] = m11;
    this.__data[5] = m12;
    this.__data[6] = m20;
    this.__data[7] = m21;
    this.__data[8] = m22;
  }

  /**
   * Sets state of the Mat3 with the identity  Matrix
   */
  setIdentity() {
    this.set();
  }

  /**
   * Sets state of the Mat3 from another Mat3
   * <br>
   * Note: works with either Mat3 or Mat4.
   *
   * @param {Mat3} mat - The mat value.
   */
  setFromMat(mat) {
    this.__data[0] = mat.m00;
    this.__data[1] = mat.m01;
    this.__data[2] = mat.m02;
    this.__data[3] = mat.m10;
    this.__data[4] = mat.m11;
    this.__data[5] = mat.m12;
    this.__data[6] = mat.m20;
    this.__data[7] = mat.m21;
    this.__data[8] = mat.m22;
  }

  /**
   * Scales and calculates the cross product of the `Vec3` and sets the result in the Mat3
   *
   * @param {Vec3} dir - The dir value.
   * @param {Vec3} up - The up value.
   */
  setFromDirectionAndUpvector(dir, up) {
    const zAxis = dir;
    const zLen = zAxis.length();
    if (zLen < Number.EPSILON) {
      this.setIdentity();
      return
    }
    zAxis.scaleInPlace(1 / zLen);

    const xAxis = up.cross(zAxis);
    const xLen = xAxis.length();
    if (xLen > Number.EPSILON) xAxis.scaleInPlace(1 / xLen);

    const yAxis = zAxis.cross(xAxis);
    const yLen = yAxis.length();
    if (yLen > Number.EPSILON) yAxis.scaleInPlace(1 / yLen);

    this.set(xAxis.x, xAxis.y, xAxis.z, yAxis.x, yAxis.y, yAxis.z, zAxis.x, zAxis.y, zAxis.z);
  }

  /**
   * Inverts a Mat3 and returns the result as a new instance.
   *
   * @return {Mat3} - Returns a new Mat3.
   */
  inverse() {
    const a00 = this.__data[0];
    const a01 = this.__data[1];
    const a02 = this.__data[2];
    const a10 = this.__data[3];
    const a11 = this.__data[4];
    const a12 = this.__data[5];
    const a20 = this.__data[6];
    const a21 = this.__data[7];
    const a22 = this.__data[8];
    const b01 = a22 * a11 - a12 * a21;
    const b11 = -a22 * a10 + a12 * a20;
    const b21 = a21 * a10 - a11 * a20;
    // Calculate the determinant
    const det = a00 * b01 + a01 * b11 + a02 * b21;

    if (!det) {
      console.warn('Unable to invert Mat3');
      return null
    }
    det = 1.0 / det;

    return new Mat3$1(
      b01 * det,
      (-a22 * a01 + a02 * a21) * det,
      (a12 * a01 - a02 * a11) * det,
      b11 * det,
      (a22 * a00 - a02 * a20) * det,
      (-a12 * a00 + a02 * a10) * det,
      b21 * det,
      (-a21 * a00 + a01 * a20) * det,
      (a11 * a00 - a01 * a10) * det
    )
  }

  /**
   * Inverts a Mat3.
   *
   * @return {boolean} - The return value.
   */
  invertInPlace() {
    const a00 = this.__data[0];
    const a01 = this.__data[1];
    const a02 = this.__data[2];
    const a10 = this.__data[3];
    const a11 = this.__data[4];
    const a12 = this.__data[5];
    const a20 = this.__data[6];
    const a21 = this.__data[7];
    const a22 = this.__data[8];
    const b01 = a22 * a11 - a12 * a21;
    const b11 = -a22 * a10 + a12 * a20;
    const b21 = a21 * a10 - a11 * a20;
    // Calculate the determinant
    const det = a00 * b01 + a01 * b11 + a02 * b21;

    if (!det) {
      console.warn('Unable to invert Mat3');
      return false
    }
    det = 1.0 / det;

    this.set(
      b01 * det,
      (-a22 * a01 + a02 * a21) * det,
      (a12 * a01 - a02 * a11) * det,
      b11 * det,
      (a22 * a00 - a02 * a20) * det,
      (-a12 * a00 + a02 * a10) * det,
      b21 * det,
      (-a21 * a00 + a01 * a20) * det,
      (a11 * a00 - a01 * a10) * det
    );
    return true
  }

  /**
   * Transposes (exchanges columns with rows) this matrix
   * and returns the result as a new instance.
   *
   * @return {Mat3} - Return a new transposed Mat3.
   */
  transpose() {
    return Mat3$1(
      this.__data[0],
      this.__data[3],
      this.__data[6],
      this.__data[1],
      this.__data[4],
      this.__data[7],
      this.__data[2],
      this.__data[5],
      this.__data[8]
    )
  }

  /**
   * Transposes (exchanges columns with rows) this matrix.
   */
  transposeInPlace() {
    // If we are transposing ourselves we can skip a few steps but have to cache some values
    const a01 = this.__data[1];
    const a02 = this.__data[2];
    const a12 = this.__data[5];

    this.__data[1] = this.__data[3];
    this.__data[2] = this.__data[6];
    this.__data[3] = a01;
    this.__data[5] = this.__data[7];
    this.__data[6] = a02;
    this.__data[7] = a12;
  }

  /**
   * Transforms the Vec3 with a Mat3.
   *
   * @param {Vec3} vec3 - The vec3 value.
   * @return {Vec3} - Return the result as a new Vec3.
   */
  transformVec3(vec3) {
    return new Vec3$1(
      this.__data[0] * vec3.x + this.__data[1] * vec3.y + this.__data[2] * vec3.z,
      this.__data[3] * vec3.x + this.__data[4] * vec3.y + this.__data[5] * vec3.z,
      this.__data[6] * vec3.x + this.__data[7] * vec3.y + this.__data[8] * vec3.z
    )
  }

  /**
   * Clones this Mat3 returning a new instance.
   *
   * @return {Mat3} - Returns a new Mat3.
   */
  clone() {
    return new Mat3$1(
      this.__data[0],
      this.__data[1],
      this.__data[2],
      this.__data[3],
      this.__data[4],
      this.__data[5],
      this.__data[6],
      this.__data[7],
      this.__data[8],
      this.__data[9]
    )
  }

  // ////////////////////////////////////////
  // Static Methods

  /**
   * Create a new Mat3.
   * @param {...object} ...args - The ...args param.
   * @return {Mat3} - Returns a new Mat3.
   * @private
   */
  static create(...args) {
    return new Mat3$1(...args)
  }

  /**
   * Creates a new Mat3 to wrap existing memory in a buffer.
   *
   * @param {ArrayBuffer} buffer - The buffer value.
   * @param {number} offset - The offset value.
   * @return {Mat3} - Returns a new Mat3.
   * @deprecated
   * @private
   */
  static createFromFloat32Buffer(buffer, offset = 0) {
    console.warn('Deprecated, use #createFromBuffer instead');
    return this.createFromBuffer(buffer, offset * 4)
  }

  /**
   * Creates an instance of a `Mat3` using an ArrayBuffer.
   *
   * @static
   * @param {ArrayBuffer} buffer - The buffer value.
   * @param {number} byteOffset - The offset value.
   * @return {Mat3} - Returns a new Mat3.
   */
  static createFromBuffer(buffer, byteOffset) {
    return new Mat3$1(new Float32Array(buffer, byteOffset, 9)) // 4 bytes per 32bit float
  }

  // ///////////////////////////
  // Persistence

  /**
   * Loads the state of the value from a binary reader.
   *
   * @param {BinReader} reader - The reader value.
   */
  readBinary(reader) {
    this.__data = reader.loadFloat32Array(9);
  }

  /**
   * The toJSON method encodes this type as a json object for persistence.
   *
   * @return {object} - The json object.
   */
  toJSON() {
    return this.__data
  }

  /**
   * The fromJSON method decodes a json object for this type.
   *
   * @param {object} json - The json param.
   */
  fromJSON(json) {
    this.__data = new Float32Array(json);
  }

  // ///////////////////////////
  // Debugging

  /**
   * Calls `toJSON` method and stringifies it.
   *
   * @return {string} - The return value.
   */
  toString() {
    return this.toJSON().toString()
  }
}

Registry.register('Mat3', Mat3$1);

/**
 * A class representing a 4x4 matrix.
 * This matrix class is based on GLM, and is column major.
 *
 * @extends AttrValue
 */
class Mat4 extends AttrValue {
  /**
   * Initializes the Mat3 class with given data.
   *
   * @param {number | Float32Array | ArrayBuffer} m00 - Row 0, column 0.
   * @param {number} m01 - Row 0, column 1.
   * @param {number} m02 - Row 0, column 2.
   * @param {number} m03 - Row 0, column 3.
   * @param {number} m10 - Row 1, column 0.
   * @param {number} m11 - Row 1, column 1.
   * @param {number} m12 - Row 1, column 2.
   * @param {number} m13 - Row 1, column 3.
   * @param {number} m20 - Row 2, column 0.
   * @param {number} m21 - Row 2, column 1.
   * @param {number} m22 - Row 2, column 2.
   * @param {number} m23 - Row 2, column 3.
   * @param {number} m30 - Row 3, column 0.
   * @param {number} m31 - Row 3, column 1.
   * @param {number} m32 - Row 3, column 2.
   * @param {number} m33 - Row 3, column 3.
   */
  constructor(
    m00 = 1,
    m01 = 0,
    m02 = 0,
    m03 = 0,
    m10 = 0,
    m11 = 1,
    m12 = 0,
    m13 = 0,
    m20 = 0,
    m21 = 0,
    m22 = 1,
    m23 = 0,
    m30 = 0,
    m31 = 0,
    m32 = 0,
    m33 = 1
  ) {
    super();

    if (m00 instanceof Float32Array) {
      this.__data = m00;
    } else if (m00 instanceof ArrayBuffer) {
      const buffer = m00;
      const byteOffset = m01;
      this.__data = new Float32Array(buffer, byteOffset, 16);
    } else {
      this.__data = new Float32Array(16);
      this.set(m00, m01, m02, m03, m10, m11, m12, m13, m20, m21, m22, m23, m30, m31, m32, m33);
    }
  }

  // /////////////////////////////////////////
  // properties

  /**
   * Getter for row 0, column 0.
   *
   * @return {number} - Returns the m00 value.
   */
  get m00() {
    return this.__data[0]
  }

  /**
   * Setter for row 0, column 0.
   *
   * @param {number} val - The val param.
   */
  set m00(val) {
    this.__data[0] = val;
  }

  /**
   * Getter for row 0, column 1.
   *
   * @return {number} - Returns the m01 value.
   */
  get m01() {
    return this.__data[1]
  }

  /**
   * Setter for row 0, column 1.
   *
   * @param {number} val - The val param.
   */
  set m01(val) {
    this.__data[1] = val;
  }

  /**
   * Getter for row 0, column 2.
   *
   * @return {number} - Returns the m02 value.
   */
  get m02() {
    return this.__data[2]
  }

  /**
   * Setter for row 0, column 2.
   *
   * @param {number} val - The val param.
   */
  set m02(val) {
    this.__data[2] = val;
  }

  /**
   * Getter for row 0, column 3.
   *
   * @return {number} - Returns the m03 value.
   */
  get m03() {
    return this.__data[3]
  }

  /**
   * Setter for row 0, column 3.
   *
   * @param {number} val - The val param.
   */
  set m03(val) {
    this.__data[3] = val;
  }

  /**
   * Getter for row 1, column 0.
   *
   * @return {number} - Returns the m10 value.
   */
  get m10() {
    return this.__data[4]
  }

  /**
   * Setter for row 1, column 0.
   *
   * @param {number} val - The val param.
   */
  set m10(val) {
    this.__data[4] = val;
  }

  /**
   * Getter for row 1, column 1.
   *
   * @return {number} - Returns the m11 value.
   */
  get m11() {
    return this.__data[5]
  }

  /**
   * Setter for row 1, column 1.
   *
   * @param {number} val - The val param.
   */
  set m11(val) {
    this.__data[5] = val;
  }

  /**
   * Getter for row 1, column 2.
   *
   * @return {number} - Returns the m12 value.
   */
  get m12() {
    return this.__data[6]
  }

  /**
   * Setter for row 1, column 2.
   *
   * @param {number} val - The val param.
   */
  set m12(val) {
    this.__data[6] = val;
  }

  /**
   * Getter for row 1, column 3.
   *
   * @return {number} - Returns the m13 value.
   */
  get m13() {
    return this.__data[7]
  }

  /**
   * Setter for row 1, column 3.
   *
   * @param {number} val - The val param.
   */
  set m13(val) {
    this.__data[7] = val;
  }

  /**
   * Getter for row 2, column 0.
   *
   * @return {number} - Returns the m20 value.
   */
  get m20() {
    return this.__data[8]
  }

  /**
   * Setter for row 2, column 0.
   *
   * @param {number} val - The val param.
   */
  set m20(val) {
    this.__data[8] = val;
  }

  /**
   * Getter for row 2, column 1.
   *
   * @return {number} - Returns the m21 value.
   */
  get m21() {
    return this.__data[9]
  }

  /**
   * Setter for row 2, column 1
   *
   * @param {number} val - The val param.
   */
  set m21(val) {
    this.__data[9] = val;
  }

  /**
   * Getter for row 2, column 2.
   *
   * @return {number} - Returns the m22 value.
   */
  get m22() {
    return this.__data[10]
  }

  /**
   * Setter for row 2, column 2.
   *
   * @param {number} val - The val param.
   */
  set m22(val) {
    this.__data[10] = val;
  }

  /**
   * Getter for row 2, column 3.
   *
   * @return {number} - Returns the m23 value.
   */
  get m23() {
    return this.__data[11]
  }

  /**
   * Setter for row 2, column 3.
   *
   * @param {number} val - The val param.
   */
  set m23(val) {
    this.__data[11] = val;
  }

  /**
   * Getter for row 3, column 0
   *
   * @return {number} - Returns the m30 value.
   */
  get m30() {
    return this.__data[12]
  }

  /**
   * Setter for row 3, column 0.
   *
   * @param {number} val - The val param.
   */
  set m30(val) {
    this.__data[12] = val;
  }

  /**
   * Getter for row 3, column 1.
   *
   * @return {number} - Returns the m31 value.
   */
  get m31() {
    return this.__data[13]
  }

  /**
   * Setter for row 3, column 1.
   *
   * @param {number} val - The val param.
   */
  set m31(val) {
    this.__data[13] = val;
  }

  /**
   * Getter for row 3, column 2.
   *
   * @return {number} - Returns the m32 value.
   */
  get m32() {
    return this.__data[14]
  }

  /**
   * Setter for row 3, column 2.
   *
   * @param {number} val - The val param.
   */
  set m32(val) {
    this.__data[14] = val;
  }

  /**
   * Getter for row 3, column 3.
   *
   * @return {number} - Returns the m33 value.
   */
  get m33() {
    return this.__data[15]
  }

  /**
   * Setter for row 3, column 3.
   *
   * @param {number} val - The val param.
   */
  set m33(val) {
    this.__data[15] = val;
  }

  /**
   * Getter for the `x` axis.
   *
   * @return {Vec3} - Returns the `x` axis as a Vec3.
   */
  get xAxis() {
    return Vec3$1.createFromBuffer(this.__data.buffer, 0)
  }

  /**
   * Setter for the `x` axis.
   *
   * @param {Vec3} vec3 - The vec3 value.
   */
  set xAxis(vec3) {
    this.xAxis.set(vec3.x, vec3.y, vec3.z);
  }

  /**
   * Getter for the `y` axis.
   *
   * @return {Vec3} - Returns the `y` axis as a Vec3.
   */
  get yAxis() {
    return Vec3$1.createFromBuffer(this.__data.buffer, 4 * 4)
  }

  /**
   * Setter for the `y` axis.
   *
   * @param {Vec3} vec3 - The vec3 value.
   */
  set yAxis(vec3) {
    this.yAxis.set(vec3.x, vec3.y, vec3.z);
  }

  /**
   * Getter for the `z` axis.
   *
   * @return {Vec3} - Returns the `z` axis as a Vec3.
   */
  get zAxis() {
    return Vec3$1.createFromBuffer(this.__data.buffer, 8 * 4)
  }

  /**
   * Setter for the `z` axis.
   *
   * @param {Vec3} vec3 - The vec3 value.
   */
  set zAxis(vec3) {
    this.zAxis.set(vec3.x, vec3.y, vec3.z);
  }

  /**
   * Getter for the translation of the matrix.
   *
   * @return {Vec3} - Returns the translation.
   */
  get translation() {
    return Vec3$1.createFromBuffer(this.__data.buffer, 12 * 4)
  }

  /**
   * Setter for the translation of the matrix.
   *
   * @param {Vec3} vec3 - The translation.
   */
  set translation(vec3) {
    this.translation.set(vec3.x, vec3.y, vec3.z);
  }

  // /////////////////////////////////////////
  // Setters

  /**
   * Sets the state of the Mat4 class
   *
   * @param {number} m00 - Row 0, column 0.
   * @param {number} m01 - Row 0, column 1.
   * @param {number} m02 - Row 0, column 2.
   * @param {number} m03 - Row 0, column 3.
   * @param {number} m10 - Row 1, column 0.
   * @param {number} m11 - Row 1, column 1.
   * @param {number} m12 - Row 1, column 2.
   * @param {number} m13 - Row 1, column 3.
   * @param {number} m20 - Row 2, column 0.
   * @param {number} m21 - Row 2, column 1.
   * @param {number} m22 - Row 2, column 2.
   * @param {number} m23 - Row 2, column 3.
   * @param {number} m30 - Row 3, column 0.
   * @param {number} m31 - Row 3, column 1.
   * @param {number} m32 - Row 3, column 2.
   * @param {number} m33 - Row 3, column 3.
   */
  set(
    m00 = 1,
    m01 = 0,
    m02 = 0,
    m03 = 0,
    m10 = 0,
    m11 = 1,
    m12 = 0,
    m13 = 0,
    m20 = 0,
    m21 = 0,
    m22 = 1,
    m23 = 0,
    m30 = 0,
    m31 = 0,
    m32 = 0,
    m33 = 1
  ) {
    this.__data[0] = m00;
    this.__data[1] = m01;
    this.__data[2] = m02;
    this.__data[3] = m03;
    this.__data[4] = m10;
    this.__data[5] = m11;
    this.__data[6] = m12;
    this.__data[7] = m13;
    this.__data[8] = m20;
    this.__data[9] = m21;
    this.__data[10] = m22;
    this.__data[11] = m23;
    this.__data[12] = m30;
    this.__data[13] = m31;
    this.__data[14] = m32;
    this.__data[15] = m33;
  }

  /**
   * Sets state of the Mat4 with the identity  Matrix
   */
  setIdentity() {
    this.set();
  }

  /**
   * Sets the state of the Mat4 Object.
   *
   * @param {Float32Array} float32Array - The float32Array value.
   */
  setDataArray(float32Array) {
    this.__data = float32Array;
  }

  /**
   * Sets state of the Mat4 from another Mat4
   * <br>
   * Note: works with either Mat3 or Mat4.
   *
   * @param {Mat4} mat4 - The mat4 value.
   */
  setFromMat4(mat4) {
    this.__data[0] = mat4.m00;
    this.__data[1] = mat4.m01;
    this.__data[2] = mat4.m02;
    this.__data[3] = mat4.m03;
    this.__data[4] = mat4.m10;
    this.__data[5] = mat4.m11;
    this.__data[6] = mat4.m12;
    this.__data[7] = mat4.m13;
    this.__data[8] = mat4.m20;
    this.__data[9] = mat4.m21;
    this.__data[10] = mat4.m22;
    this.__data[11] = mat4.m23;
    this.__data[12] = mat4.m30;
    this.__data[13] = mat4.m31;
    this.__data[14] = mat4.m32;
    this.__data[15] = mat4.m33;
  }

  /**
   * Converts a Mat4 to a Mat3.
   *
   * @param {Mat4} mat4 - The Mat4 value to convert.
   * @return {Mat3} - Returns a new Mat3.
   */
  toMat3(mat4) {
    return new Mat3$1(
      this.__data[0],
      this.__data[1],
      this.__data[2],
      this.__data[4],
      this.__data[5],
      this.__data[6],
      this.__data[8],
      this.__data[9],
      this.__data[10]
    )
  }

  /**
   * Transposes (exchanges columns with rows) this matrix.
   */
  transposeInPlace() {
    // If we are transposing ourselves we can skip a few steps but have to cache some values
    const a01 = this.__data[1];
    const a02 = this.__data[2];
    const a03 = this.__data[3];
    const a12 = this.__data[6];
    const a13 = this.__data[7];
    const a23 = this.__data[11];

    this.__data[1] = this.__data[4];
    this.__data[2] = this.__data[8];
    this.__data[3] = this.__data[12];
    this.__data[4] = a01;
    this.__data[6] = this.__data[9];
    this.__data[7] = this.__data[13];
    this.__data[8] = a02;
    this.__data[9] = a12;
    this.__data[11] = this.__data[14];
    this.__data[12] = a03;
    this.__data[13] = a13;
    this.__data[14] = a23;
  }

  /**
   * Transposes (exchanges columns with rows) this matrix
   * and returns the result as a new instance.
   *
   * @return {Mat4} - Return a new transposed Mat4.
   */
  transpose() {
    return new Mat4(
      this.__data[0],
      this.__data[4],
      this.__data[8],
      this.__data[12],
      this.__data[1],
      this.__data[5],
      this.__data[9],
      this.__data[13],
      this.__data[2],
      this.__data[6],
      this.__data[10],
      this.__data[14],
      this.__data[3],
      this.__data[7],
      this.__data[11],
      this.__data[15]
    )
  }

  /**
   * Inverts a Mat4 not using SIMD and returns the result as a new instance.
   *
   * @return {Mat4} - Returns a new Mat4.
   */
  inverse() {
    const a00 = this.__data[0];
    const a01 = this.__data[1];
    const a02 = this.__data[2];
    const a03 = this.__data[3];
    const a10 = this.__data[4];
    const a11 = this.__data[5];
    const a12 = this.__data[6];
    const a13 = this.__data[7];
    const a20 = this.__data[8];
    const a21 = this.__data[9];
    const a22 = this.__data[10];
    const a23 = this.__data[11];
    const a30 = this.__data[12];
    const a31 = this.__data[13];
    const a32 = this.__data[14];
    const a33 = this.__data[15];

    const b00 = a00 * a11 - a01 * a10;
    const b01 = a00 * a12 - a02 * a10;
    const b02 = a00 * a13 - a03 * a10;
    const b03 = a01 * a12 - a02 * a11;
    const b04 = a01 * a13 - a03 * a11;
    const b05 = a02 * a13 - a03 * a12;
    const b06 = a20 * a31 - a21 * a30;
    const b07 = a20 * a32 - a22 * a30;
    const b08 = a20 * a33 - a23 * a30;
    const b09 = a21 * a32 - a22 * a31;
    const b10 = a21 * a33 - a23 * a31;
    const b11 = a22 * a33 - a23 * a32;

    // Calculate the determinant
    let det = b00 * b11 - b01 * b10 + b02 * b09 + b03 * b08 - b04 * b07 + b05 * b06;

    if (!det) {
      console.warn('Unable to invert Mat4');
      return null
    }
    det = 1.0 / det;

    return new Mat4(
      (a11 * b11 - a12 * b10 + a13 * b09) * det,
      (a02 * b10 - a01 * b11 - a03 * b09) * det,
      (a31 * b05 - a32 * b04 + a33 * b03) * det,
      (a22 * b04 - a21 * b05 - a23 * b03) * det,
      (a12 * b08 - a10 * b11 - a13 * b07) * det,
      (a00 * b11 - a02 * b08 + a03 * b07) * det,
      (a32 * b02 - a30 * b05 - a33 * b01) * det,
      (a20 * b05 - a22 * b02 + a23 * b01) * det,
      (a10 * b10 - a11 * b08 + a13 * b06) * det,
      (a01 * b08 - a00 * b10 - a03 * b06) * det,
      (a30 * b04 - a31 * b02 + a33 * b00) * det,
      (a21 * b02 - a20 * b04 - a23 * b00) * det,
      (a11 * b07 - a10 * b09 - a12 * b06) * det,
      (a00 * b09 - a01 * b07 + a02 * b06) * det,
      (a31 * b01 - a30 * b03 - a32 * b00) * det,
      (a20 * b03 - a21 * b01 + a22 * b00) * det
    )
  }

  /**
   * Inverts a Mat4.
   *
   * @return {boolean} - The return value.
   */
  invertInPlace() {
    const a00 = this.__data[0];
    const a01 = this.__data[1];
    const a02 = this.__data[2];
    const a03 = this.__data[3];
    const a10 = this.__data[4];
    const a11 = this.__data[5];
    const a12 = this.__data[6];
    const a13 = this.__data[7];
    const a20 = this.__data[8];
    const a21 = this.__data[9];
    const a22 = this.__data[10];
    const a23 = this.__data[11];
    const a30 = this.__data[12];
    const a31 = this.__data[13];
    const a32 = this.__data[14];
    const a33 = this.__data[15];

    const b00 = a00 * a11 - a01 * a10;
    const b01 = a00 * a12 - a02 * a10;
    const b02 = a00 * a13 - a03 * a10;
    const b03 = a01 * a12 - a02 * a11;
    const b04 = a01 * a13 - a03 * a11;
    const b05 = a02 * a13 - a03 * a12;
    const b06 = a20 * a31 - a21 * a30;
    const b07 = a20 * a32 - a22 * a30;
    const b08 = a20 * a33 - a23 * a30;
    const b09 = a21 * a32 - a22 * a31;
    const b10 = a21 * a33 - a23 * a31;
    const b11 = a22 * a33 - a23 * a32;

    // Calculate the determinant
    let det = b00 * b11 - b01 * b10 + b02 * b09 + b03 * b08 - b04 * b07 + b05 * b06;

    if (!det) {
      console.warn('Unable to invert Mat4');
      return false
    }
    det = 1.0 / det;

    this.set(
      (a11 * b11 - a12 * b10 + a13 * b09) * det,
      (a02 * b10 - a01 * b11 - a03 * b09) * det,
      (a31 * b05 - a32 * b04 + a33 * b03) * det,
      (a22 * b04 - a21 * b05 - a23 * b03) * det,
      (a12 * b08 - a10 * b11 - a13 * b07) * det,
      (a00 * b11 - a02 * b08 + a03 * b07) * det,
      (a32 * b02 - a30 * b05 - a33 * b01) * det,
      (a20 * b05 - a22 * b02 + a23 * b01) * det,
      (a10 * b10 - a11 * b08 + a13 * b06) * det,
      (a01 * b08 - a00 * b10 - a03 * b06) * det,
      (a30 * b04 - a31 * b02 + a33 * b00) * det,
      (a21 * b02 - a20 * b04 - a23 * b00) * det,
      (a11 * b07 - a10 * b09 - a12 * b06) * det,
      (a00 * b09 - a01 * b07 + a02 * b06) * det,
      (a31 * b01 - a30 * b03 - a32 * b00) * det,
      (a20 * b03 - a21 * b01 + a22 * b00) * det
    );
    return true
  }

  /**
   * Sets this matrix as the inverse of the given Mat4.
   *
   * @param {Mat4} mat4 - The mat4 value.
   * @return {null} - In case the `determinant` can't be calculated, a `null` will be returned, otherwise, nothing is returned
   */
  setInverse(mat4) {
    const a00 = mat4.__data[0];
    const a01 = mat4.__data[1];
    const a02 = mat4.__data[2];
    const a03 = mat4.__data[3];
    const a10 = mat4.__data[4];
    const a11 = mat4.__data[5];
    const a12 = mat4.__data[6];
    const a13 = mat4.__data[7];
    const a20 = mat4.__data[8];
    const a21 = mat4.__data[9];
    const a22 = mat4.__data[10];
    const a23 = mat4.__data[11];
    const a30 = mat4.__data[12];
    const a31 = mat4.__data[13];
    const a32 = mat4.__data[14];
    const a33 = mat4.__data[15];

    const b00 = a00 * a11 - a01 * a10;
    const b01 = a00 * a12 - a02 * a10;
    const b02 = a00 * a13 - a03 * a10;
    const b03 = a01 * a12 - a02 * a11;
    const b04 = a01 * a13 - a03 * a11;
    const b05 = a02 * a13 - a03 * a12;
    const b06 = a20 * a31 - a21 * a30;
    const b07 = a20 * a32 - a22 * a30;
    const b08 = a20 * a33 - a23 * a30;
    const b09 = a21 * a32 - a22 * a31;
    const b10 = a21 * a33 - a23 * a31;
    const b11 = a22 * a33 - a23 * a32;

    // Calculate the determinant
    let det = b00 * b11 - b01 * b10 + b02 * b09 + b03 * b08 - b04 * b07 + b05 * b06;

    if (!det) {
      throw new Error('Unable to invert Mat4')
    }
    det = 1.0 / det;

    this.set(
      (a11 * b11 - a12 * b10 + a13 * b09) * det,
      (a02 * b10 - a01 * b11 - a03 * b09) * det,
      (a31 * b05 - a32 * b04 + a33 * b03) * det,
      (a22 * b04 - a21 * b05 - a23 * b03) * det,
      (a12 * b08 - a10 * b11 - a13 * b07) * det,
      (a00 * b11 - a02 * b08 + a03 * b07) * det,
      (a32 * b02 - a30 * b05 - a33 * b01) * det,
      (a20 * b05 - a22 * b02 + a23 * b01) * det,
      (a10 * b10 - a11 * b08 + a13 * b06) * det,
      (a01 * b08 - a00 * b10 - a03 * b06) * det,
      (a30 * b04 - a31 * b02 + a33 * b00) * det,
      (a21 * b02 - a20 * b04 - a23 * b00) * det,
      (a11 * b07 - a10 * b09 - a12 * b06) * det,
      (a00 * b09 - a01 * b07 + a02 * b06) * det,
      (a31 * b01 - a30 * b03 - a32 * b00) * det,
      (a20 * b03 - a21 * b01 + a22 * b00) * det
    );
  }

  /**
   * Multiplies two Mat4s not using SIMD and returns the result as a new instance.
   *
   * @param {Mat4} other - The other Mat4 to multiply with.
   * @return {Mat4} - Returns a new Mat4.
   */
  multiply(other) {
    const a00 = this.__data[0];
    const a01 = this.__data[1];
    const a02 = this.__data[2];
    const a03 = this.__data[3];
    const a10 = this.__data[4];
    const a11 = this.__data[5];
    const a12 = this.__data[6];
    const a13 = this.__data[7];
    const a20 = this.__data[8];
    const a21 = this.__data[9];
    const a22 = this.__data[10];
    const a23 = this.__data[11];
    const a30 = this.__data[12];
    const a31 = this.__data[13];
    const a32 = this.__data[14];
    const a33 = this.__data[15];

    // Cache only the current line of the second matrix
    const b = other.asArray();
    let b0 = b[0];
    let b1 = b[1];
    let b2 = b[2];
    let b3 = b[3];
    const result = new Mat4();
    result.m00 = b0 * a00 + b1 * a10 + b2 * a20 + b3 * a30;
    result.m01 = b0 * a01 + b1 * a11 + b2 * a21 + b3 * a31;
    result.m02 = b0 * a02 + b1 * a12 + b2 * a22 + b3 * a32;
    result.m03 = b0 * a03 + b1 * a13 + b2 * a23 + b3 * a33;

    b0 = b[4];
    b1 = b[5];
    b2 = b[6];
    b3 = b[7];
    result.m10 = b0 * a00 + b1 * a10 + b2 * a20 + b3 * a30;
    result.m11 = b0 * a01 + b1 * a11 + b2 * a21 + b3 * a31;
    result.m12 = b0 * a02 + b1 * a12 + b2 * a22 + b3 * a32;
    result.m13 = b0 * a03 + b1 * a13 + b2 * a23 + b3 * a33;

    b0 = b[8];
    b1 = b[9];
    b2 = b[10];
    b3 = b[11];
    result.m20 = b0 * a00 + b1 * a10 + b2 * a20 + b3 * a30;
    result.m21 = b0 * a01 + b1 * a11 + b2 * a21 + b3 * a31;
    result.m22 = b0 * a02 + b1 * a12 + b2 * a22 + b3 * a32;
    result.m23 = b0 * a03 + b1 * a13 + b2 * a23 + b3 * a33;

    b0 = b[12];
    b1 = b[13];
    b2 = b[14];
    b3 = b[15];
    result.m30 = b0 * a00 + b1 * a10 + b2 * a20 + b3 * a30;
    result.m31 = b0 * a01 + b1 * a11 + b2 * a21 + b3 * a31;
    result.m32 = b0 * a02 + b1 * a12 + b2 * a22 + b3 * a32;
    result.m33 = b0 * a03 + b1 * a13 + b2 * a23 + b3 * a33;
    return result
  }

  /**
   * Multiplies two Mat4s in place explicitly not using SIMD.
   *
   * @param {Mat4} other - The other Mat4 to multiply with.
   * @return {Mat4} - Returns a new Mat4.
   */
  multiplyInPlace(other) {
    const a = this.asArray();
    const a00 = a[0];
    const a01 = a[1];
    const a02 = a[2];
    const a03 = a[3];
    const a10 = a[4];
    const a11 = a[5];
    const a12 = a[6];
    const a13 = a[7];
    const a20 = a[8];
    const a21 = a[9];
    const a22 = a[10];
    const a23 = a[11];
    const a30 = a[12];
    const a31 = a[13];
    const a32 = a[14];
    const a33 = a[15];

    // Cache only the current line of the second matrix
    const b = other.asArray();
    let b0 = b[0];
    let b1 = b[1];
    let b2 = b[2];
    let b3 = b[3];
    this.m00 = b0 * a00 + b1 * a10 + b2 * a20 + b3 * a30;
    this.m01 = b0 * a01 + b1 * a11 + b2 * a21 + b3 * a31;
    this.m02 = b0 * a02 + b1 * a12 + b2 * a22 + b3 * a32;
    this.m03 = b0 * a03 + b1 * a13 + b2 * a23 + b3 * a33;

    b0 = b[4];
    b1 = b[5];
    b2 = b[6];
    b3 = b[7];
    this.m10 = b0 * a00 + b1 * a10 + b2 * a20 + b3 * a30;
    this.m11 = b0 * a01 + b1 * a11 + b2 * a21 + b3 * a31;
    this.m12 = b0 * a02 + b1 * a12 + b2 * a22 + b3 * a32;
    this.m13 = b0 * a03 + b1 * a13 + b2 * a23 + b3 * a33;

    b0 = b[8];
    b1 = b[9];
    b2 = b[10];
    b3 = b[11];
    this.m20 = b0 * a00 + b1 * a10 + b2 * a20 + b3 * a30;
    this.m21 = b0 * a01 + b1 * a11 + b2 * a21 + b3 * a31;
    this.m22 = b0 * a02 + b1 * a12 + b2 * a22 + b3 * a32;
    this.m23 = b0 * a03 + b1 * a13 + b2 * a23 + b3 * a33;

    b0 = b[12];
    b1 = b[13];
    b2 = b[14];
    b3 = b[15];
    this.m30 = b0 * a00 + b1 * a10 + b2 * a20 + b3 * a30;
    this.m31 = b0 * a01 + b1 * a11 + b2 * a21 + b3 * a31;
    this.m32 = b0 * a02 + b1 * a12 + b2 * a22 + b3 * a32;
    this.m33 = b0 * a03 + b1 * a13 + b2 * a23 + b3 * a33;
    return this
  }

  /**
   * Post multiplies two Mat4s in place explicitly not using SIMD.
   *
   * @param {Mat4} other - The other Mat4 to multiply with.
   * @return {Mat3} - Returns the result as a new Mat4.
   */
  postmultiplyInPlace(other) {
    const a = other.asArray();
    const a00 = a[0];
    const a01 = a[1];
    const a02 = a[2];
    const a03 = a[3];
    const a10 = a[4];
    const a11 = a[5];
    const a12 = a[6];
    const a13 = a[7];
    const a20 = a[8];
    const a21 = a[9];
    const a22 = a[10];
    const a23 = a[11];
    const a30 = a[12];
    const a31 = a[13];
    const a32 = a[14];
    const a33 = a[15];

    // Cache only the current line of the second matrix
    const b = this.asArray();
    let b0 = b[0];
    let b1 = b[1];
    let b2 = b[2];
    let b3 = b[3];
    this.m00 = b0 * a00 + b1 * a10 + b2 * a20 + b3 * a30;
    this.m01 = b0 * a01 + b1 * a11 + b2 * a21 + b3 * a31;
    this.m02 = b0 * a02 + b1 * a12 + b2 * a22 + b3 * a32;
    this.m03 = b0 * a03 + b1 * a13 + b2 * a23 + b3 * a33;

    b0 = b[4];
    b1 = b[5];
    b2 = b[6];
    b3 = b[7];
    this.m10 = b0 * a00 + b1 * a10 + b2 * a20 + b3 * a30;
    this.m11 = b0 * a01 + b1 * a11 + b2 * a21 + b3 * a31;
    this.m12 = b0 * a02 + b1 * a12 + b2 * a22 + b3 * a32;
    this.m13 = b0 * a03 + b1 * a13 + b2 * a23 + b3 * a33;

    b0 = b[8];
    b1 = b[9];
    b2 = b[10];
    b3 = b[11];
    this.m20 = b0 * a00 + b1 * a10 + b2 * a20 + b3 * a30;
    this.m21 = b0 * a01 + b1 * a11 + b2 * a21 + b3 * a31;
    this.m22 = b0 * a02 + b1 * a12 + b2 * a22 + b3 * a32;
    this.m23 = b0 * a03 + b1 * a13 + b2 * a23 + b3 * a33;

    b0 = b[12];
    b1 = b[13];
    b2 = b[14];
    b3 = b[15];
    this.m30 = b0 * a00 + b1 * a10 + b2 * a20 + b3 * a30;
    this.m31 = b0 * a01 + b1 * a11 + b2 * a21 + b3 * a31;
    this.m32 = b0 * a02 + b1 * a12 + b2 * a22 + b3 * a32;
    this.m33 = b0 * a03 + b1 * a13 + b2 * a23 + b3 * a33;
    return this
  }

  /**
   * Translate a Mat4 by the given vector not using SIMD.
   *
   * @param {Vec3} v3 - The given vector to translate along.
   * @return {Mat4} - The return value.
   */
  translateInPlace(v3) {
    const a = this.__data;
    const x = v3.x;
    const y = v3.y;
    const z = v3.z;
    a[12] = a[0] * x + a[4] * y + a[8] * z + a[12];
    a[13] = a[1] * x + a[5] * y + a[9] * z + a[13];
    a[14] = a[2] * x + a[6] * y + a[10] * z + a[14];
    a[15] = a[3] * x + a[7] * y + a[11] * z + a[15];
    return this
  }

  /**
   * Generates a look-at matrix with the given position, focal point, and up axis.
   *
   * @param {Vec3} pos - Position of the viewer.
   * @param {Vec3} target - Point the viewer is looking at.
   * @param {Vec3} up - Vec3 pointing up.
   */
  setLookAt(pos, target, up) {
    const zAxis = pos.subtract(target);
    const zLen = zAxis.length();
    if (zLen < Number.EPSILON) {
      this.setIdentity();
      return
    }
    zAxis.scaleInPlace(1.0 / zLen);

    const xAxis = up.cross(zAxis);
    const xLen = xAxis.length();
    if (xLen > Number.EPSILON) xAxis.scaleInPlace(1.0 / xLen);

    const yAxis = zAxis.cross(xAxis);
    const yLen = yAxis.length();
    if (yLen > Number.EPSILON) yAxis.scaleInPlace(1.0 / yLen);

    /* eslint-disable prettier/prettier*/
    this.set(
      xAxis.x,
      xAxis.y,
      xAxis.z,
      0,
      yAxis.x,
      yAxis.y,
      yAxis.z,
      0,
      zAxis.x,
      zAxis.y,
      zAxis.z,
      0,
      pos.x,
      pos.y,
      pos.z,
      1
    );
    /* eslint-enable prettier/prettier*/
  }

  /**
   * Creates a matrix from a given angle around a given axis.
   * This is equivalent to (but much faster than):
   *
   *     mat4.identity(dest);
   *     mat4.rotate(dest, dest, rad, axis);
   *
   * @param {Vec3} axis - The axis to rotate around.
   * @param {number} rad - The angle to rotate the matrix by.
   * @return {Mat4} - The return value.
   */
  setRotation(axis, rad) {
    const len = axis.length();

    if (Math.abs(len) < Number.EPSILON) {
      return null
    }

    const x = axis.x / len;
    const y = axis.y / len;
    const z = axis.z / len;

    const s = Math.sin(rad);
    const c = Math.cos(rad);
    const t = 1 - c;

    // Perform rotation-specific matrix multiplication
    const a = this.__data;
    a[0] = x * x * t + c;
    a[1] = y * x * t + z * s;
    a[2] = z * x * t - y * s;
    a[3] = 0;
    a[4] = x * y * t - z * s;
    a[5] = y * y * t + c;
    a[6] = z * y * t + x * s;
    a[7] = 0;
    a[8] = x * z * t + y * s;
    a[9] = y * z * t - x * s;
    a[10] = z * z * t + c;
    a[11] = 0;
    a[12] = 0;
    a[13] = 0;
    a[14] = 0;
    a[15] = 1;
    return this
  }

  /**
   * Creates a matrix from the given angle around the X axis.
   * This is equivalent to (but much faster than):
   *
   *     mat4.identity(dest);
   *     mat4.rotateX(dest, dest, rad);
   *
   * @param {number} rad - The angle to rotate the matrix by.
   * @return {Mat4} - The return value.
   */
  setXRotation(rad) {
    const s = Math.sin(rad);
    const c = Math.cos(rad);

    // Perform axis-specific matrix multiplication
    const a = this.__data;
    /* eslint-disable prettier/prettier*/
    a[0] = 1;
    a[1] = 0;
    a[2] = 0;
    a[3] = 0;
    a[4] = 0;
    a[5] = c;
    a[6] = s;
    a[7] = 0;
    a[8] = 0;
    a[9] = -s;
    a[10] = c;
    a[11] = 0;
    a[12] = 0;
    a[13] = 0;
    a[14] = 0;
    a[15] = 1;
    /* eslint-enable prettier/prettier*/
    return this
  }

  /**
   * Creates a matrix from the given angle around the Y axis.
   * This is equivalent to (but much faster than):
   *
   *     mat4.identity(dest);
   *     mat4.rotateY(dest, dest, rad);
   *
   * @param {number} rad - The angle to rotate the matrix by.
   * @return {Mat4} - The return value.
   */
  setYRotation(rad) {
    const s = Math.sin(rad);
    const c = Math.cos(rad);

    // Perform axis-specific matrix multiplication
    const a = this.__data;
    /* eslint-disable prettier/prettier*/
    a[0] = c;
    a[1] = 0;
    a[2] = -s;
    a[3] = 0;
    a[4] = 0;
    a[5] = 1;
    a[6] = 0;
    a[7] = 0;
    a[8] = s;
    a[9] = 0;
    a[10] = c;
    a[11] = 0;
    a[12] = 0;
    a[13] = 0;
    a[14] = 0;
    a[15] = 1;
    /* eslint-enable prettier/prettier*/
    return this
  }

  /**
   * Creates a matrix from the given angle around the Z axis.
   * This is equivalent to (but much faster than):
   *
   *     mat4.identity(dest);
   *     mat4.rotateZ(dest, dest, rad);
   *
   * @param {number} rad - The angle to rotate the matrix by.
   * @return {Mat4} - The return value.
   */
  setZRotation(rad) {
    const s = Math.sin(rad);
    const c = Math.cos(rad);

    // Perform axis-specific matrix multiplication
    const a = this.__data;
    /* eslint-disable prettier/prettier*/
    a[0] = c;
    a[1] = s;
    a[2] = 0;
    a[3] = 0;
    a[4] = -s;
    a[5] = c;
    a[6] = 0;
    a[7] = 0;
    a[8] = 0;
    a[9] = 0;
    a[10] = 1;
    a[11] = 0;
    a[12] = 0;
    a[13] = 0;
    a[14] = 0;
    a[15] = 1;
    /* eslint-enable prettier/prettier*/
    return this
  }

  /**
   * Transforms the Vec4 with a Mat4.
   *
   * @param {Vec4} vec - The vec value.
   * @return {Vec4} - Return the result as a new Vec4.
   */
  transformVec4(vec) {
    const a = this.__data;
    const x = vec.x;
    const y = vec.y;
    const z = vec.z;
    const w = vec.t;
    return new Vec4(
      a[0] * x + a[4] * y + a[8] * z + a[12] * w,
      a[1] * x + a[5] * y + a[9] * z + a[13] * w,
      a[2] * x + a[6] * y + a[10] * z + a[14] * w,
      a[3] * x + a[7] * y + a[11] * z + a[15] * w
    )
  }

  /**
   * Transforms the Vec3 with a Mat4.
   *
   * @param {Vec3} vec - The vec value.
   * @return {Vec3} - Return the result as a new Vec3.
   */
  transformVec3(vec) {
    const a = this.__data;
    const x = vec.x;
    const y = vec.y;
    const z = vec.z;
    return new Vec3$1(
      a[0] * x + a[4] * y + a[8] * z + a[12],
      a[1] * x + a[5] * y + a[9] * z + a[13],
      a[2] * x + a[6] * y + a[10] * z + a[14]
    )
  }

  /**
   * Rotates a given `Vec3` and the result is returned as a new `Vec3`
   * @param {Vec3} vec - The vec value.
   * @return {Vec3} - Return the result as a new Vec3.
   */
  rotateVec3(vec) {
    const a = this.__data;
    const x = vec.x;
    const y = vec.y;
    const z = vec.z;
    return new Vec3$1(a[0] * x + a[4] * y + a[8] * z, a[1] * x + a[5] * y + a[9] * z, a[2] * x + a[6] * y + a[10] * z)
  }

  /**
   * Set the perspective from a Mat4.
   *
   * @param {number} fovy - The fovy value.
   * @param {number} aspect - The aspect value.
   * @param {number} near - The near value.
   * @param {number} far - The far value.
   */
  setPerspectiveMatrix(fovy, aspect, near, far) {
    const f = Math.tan(Math.PI * 0.5 - 0.5 * fovy);
    const rangeInv = 1.0 / (near - far);
    /* eslint-disable prettier/prettier*/
    this.set(f / aspect, 0, 0, 0, 0, f, 0, 0, 0, 0, (near + far) * rangeInv, -1, 0, 0, near * far * rangeInv * 2, 0);
    /* eslint-enable prettier/prettier*/
  }

  /**
   * Calculates the orthographic matrix and sets the state of the Mat4 class
   *
   * @param {number} left - The left value.
   * @param {number} right - The right value.
   * @param {number} bottom - The bottom value.
   * @param {number} top - The top value.
   * @param {number} near - The near value.
   * @param {number} far - The far value.
   */
  setOrthographicMatrix(left, right, bottom, top, near, far) {
    const lr = 1 / (left - right);
    const bt = 1 / (bottom - top);
    const nf = 1 / (near - far);
    /* eslint-disable prettier/prettier*/
    this.set(
      -2 * lr,
      0,
      0,
      0,
      0,
      -2 * bt,
      0,
      0,
      0,
      0,
      2 * nf,
      0,
      (left + right) * lr,
      (top + bottom) * bt,
      (far + near) * nf,
      1
    );
    /* eslint-enable prettier/prettier*/
  }

  /**
   * Scales Mat4 Matrix
   *
   * @param {number} x - The x value.
   * @param {number} y - The y value.
   * @param {number} z - The z value.
   */
  setScale(x, y, z) {
    /* eslint-disable prettier/prettier*/
    if (x instanceof Vec3$1) {
      this.set(x.x, 0, 0, 0, 0, x.y, 0, 0, 0, 0, x.z, 0, 0, 0, 0, 1);
    } else {
      this.set(x, 0, 0, 0, 0, y, 0, 0, 0, 0, z, 0, 0, 0, 0, 1);
    }
    /* eslint-enable prettier/prettier*/
  }

  /**
   * Transforms a 3x4 matrix into a 4x4 matrix and set the result to the Math4 state.
   *
   * @param {array} m3x4 - The m3x4 value.
   */
  setFromMat3x4Array(m3x4) {
    /* eslint-disable prettier/prettier*/
    this.set(
      m3x4[0],
      m3x4[1],
      m3x4[2],
      0,
      m3x4[3],
      m3x4[4],
      m3x4[5],
      0,
      m3x4[6],
      m3x4[7],
      m3x4[8],
      0,
      m3x4[9],
      m3x4[10],
      m3x4[11],
      1
    );
    /* eslint-enable prettier/prettier*/
  }

  /**
   * Creates a new Mat4 to wrap existing memory in a buffer.
   *
   * @param {ArrayBuffer} buffer - The buffer value.
   * @param {number} offset - The offset value.
   * @return {Mat4} - Returns a new Mat4.
   * @deprecated
   * @private
   */
  static createFromFloat32Buffer(buffer, offset = 0) {
    console.warn('Deprecated, use #createFromBuffer instead');
    return this.createFromBuffer(buffer, offset * 4)
  }

  /**
   * Creates an instance of a `Mat4` using an ArrayBuffer.
   *
   * @static
   * @param {ArrayBuffer} buffer - The buffer value.
   * @param {number} byteOffset - The offset value.
   * @return {Mat4} - Returns a new Mat4.
   */
  static createFromBuffer(buffer, byteOffset) {
    return new Mat4(new Float32Array(buffer, byteOffset, 16)) // 4 bytes per 32bit float
  }

  /**
   * Clones this Mat4 returning a new instance.
   *
   * @return {Mat4} - Returns a new Mat4.
   */
  clone() {
    return new Mat4(
      this.__data[0],
      this.__data[1],
      this.__data[2],
      this.__data[3],
      this.__data[4],
      this.__data[5],
      this.__data[6],
      this.__data[7],
      this.__data[8],
      this.__data[9],
      this.__data[10],
      this.__data[11],
      this.__data[12],
      this.__data[13],
      this.__data[14],
      this.__data[15]
    )
  }

  // ////////////////////////////////////////
  // Static Methods

  /**
   * Creates a new Mat4.
   * @param {...object} ...args - The ...args param.
   * @return {Mat4} - Returns a new Mat4.
   * @private
   */
  static create(...args) {
    return new Mat4(...args)
  }

  // ///////////////////////////
  // Persistence

  /**
   * The toJSON method encodes this type as a json object for persistence.
   *
   * @return {object} - The json object.
   */
  toJSON() {
    return this.__data
  }

  /**
   * The fromJSON method decodes a json object for this type.
   *
   * @param {object} json - The json param.
   */
  fromJSON(json) {
    this.__data = new Float32Array(json);
  }

  /**
   * Loads the state of the value from a binary reader.
   *
   * @param {BinReader} reader - The reader value.
   */
  readBinary(reader) {
    this.__data = reader.loadFloat32Array(16);
  }
}

Registry.register('Mat4', Mat4);

/* eslint-disable no-unused-vars */

/**
 * Class representing a quaternion. Quaternions are used to represent rotations
 * without encountering gimble lock. Based on complex numbers that are not easy
 * to understand intuitively.
 *
 * @extends AttrValue
 */
class Quat extends AttrValue {
  /**
   * Creates a quaternion.
   *
   * @param {number | ArrayBuffer | object} x - The angle of the x axis. Default is 0.
   * @param {number} y - The angle of the y axis. Default is 0.
   * @param {number} z - The angle of the z axis. Default is 0.
   * @param {number} w - The w value. Default is 1.
   */
  constructor(x = 0, y = 0, z = 0, w = 1) {
    super();

    if (x instanceof Float32Array) {
      this.__data = x;
    } else if (x instanceof ArrayBuffer) {
      console.warn(`deprecated, please use new Vec4(new Float32Array(buffer, byteOffset, 4))`);
      const buffer = x;
      const byteOffset = y;
      this.__data = new Float32Array(buffer, byteOffset, 4);
    } else {
      this.__data = new Float32Array(4);
      if (typeof x === 'object') {
        this.__data[0] = 0;
        this.__data[1] = 0;
        this.__data[2] = 0;
        this.__data[3] = 1;
        for (const key in x) {
          if (Array.isArray(x[key])) this[key].call(this, ...x[key]);
          else this[key].call(this, x[key]);
        }
      } else {
        this.__data[0] = x;
        this.__data[1] = y;
        this.__data[2] = z;
        this.__data[3] = w;
      }
    }
  }

  /**
   * Getter for `x` axis rotation.
   *
   * @return {number} - Returns the x axis rotation.
   */
  get x() {
    return this.__data[0]
  }

  /**
   * Setter for `x` axis rotation.
   *
   * @param {number} val - The val param.
   */
  set x(val) {
    this.__data[0] = val;
  }

  /**
   * Getter for `y` axis rotation.
   *
   * @return {number} - Returns the y axis rotation.
   */
  get y() {
    return this.__data[1]
  }

  /**
   * Setter for `y` axis rotation.
   *
   * @param {number} val - The val param.
   */
  set y(val) {
    this.__data[1] = val;
  }

  /**
   * Getter for `z` axis rotation.
   *
   * @return {number} - Returns the z axis rotation.
   */
  get z() {
    return this.__data[2]
  }

  /**
   * Setter for `z` axis rotation.
   *
   * @param {number} val - The val param.
   */
  set z(val) {
    this.__data[2] = val;
  }

  /**
   * Getter for `w` value.
   *
   * @return {number} - Returns the w value.
   */
  get w() {
    return this.__data[3]
  }

  /**
   * Setter for `w`.
   * @param {number} val - The val param.
   */
  set w(val) {
    this.__data[3] = val;
  }

  /**
   * Setter from scalar components.
   *
   * @param {number} x - The x axis rotation.
   * @param {number} y  - The y axis rotation.
   * @param {number} z  - The z axis rotation.
   * @param {number} w  - The w value.
   */
  set(x, y, z, w) {
    this.__data[0] = x;
    this.__data[1] = y;
    this.__data[2] = z;
    this.__data[3] = w;
  }

  /**
   * Sets the state of the Quat class using a Float32Array.
   *
   * @param {Float32Array} float32Array - The float32Array value.
   */
  setDataArray(float32Array) {
    this.__data = float32Array;
  }

  /**
   * Setter from another vector.
   *
   * @param {Quat} other - The other vector to set from.
   */
  setFromOther(other) {
    this.__data[0] = other.x;
    this.__data[1] = other.y;
    this.__data[2] = other.z;
    this.__data[3] = other.w;
  }

  /**
   * Set this quat from a euler rotation.
   *
   * @param {EulerAngles} eulerAngles - The euler angles rotation.
   */
  setFromEulerAngles(eulerAngles) {
    const ordered = new Vec3$1();

    switch (eulerAngles.order) {
      case 0:
        /* 'XYZ' */
        ordered.set(eulerAngles.x, -eulerAngles.y, eulerAngles.z);
        break
      case 1:
        /* 'YZX' */
        ordered.set(eulerAngles.y, -eulerAngles.z, eulerAngles.x);
        break
      case 2:
        /* 'ZXY' */
        ordered.set(eulerAngles.z, -eulerAngles.x, eulerAngles.y);
        break
      case 3:
        /* 'XZY' */
        ordered.set(eulerAngles.x, eulerAngles.z, eulerAngles.y);
        break
      case 4:
        /* 'ZYX' */
        ordered.set(eulerAngles.z, eulerAngles.y, eulerAngles.x);
        break
      case 5:
        /* 'YXZ' */
        ordered.set(eulerAngles.y, eulerAngles.x, eulerAngles.z);
        break
      default:
        throw new Error('sdrty')
    }

    const ti = ordered.x * 0.5;
    const tj = ordered.y * 0.5;
    const tk = ordered.z * 0.5;
    const ci = Math.cos(ti);
    const cj = Math.cos(tj);
    const ck = Math.cos(tk);
    const si = Math.sin(ti);
    const sj = Math.sin(tj);
    const sk = Math.sin(tk);
    const cc = ci * ck;
    const cs = ci * sk;
    const sc = si * ck;
    const ss = si * sk;
    const ai = cj * sc - sj * cs;
    const aj = cj * ss + sj * cc;
    const ak = cj * cs - sj * sc;

    this.w = cj * cc + sj * ss;

    switch (eulerAngles.order) {
      case 0:
        /* ' XYZ' */
        this.x = ai;
        this.y = -aj;
        this.z = ak;
        break
      case 1:
        /* 'YZX' */
        this.x = ak;
        this.y = ai;
        this.z = -aj;
        break
      case 2:
        /* 'ZXY' */
        this.x = -aj;
        this.y = ak;
        this.z = ai;
        break
      case 3:
        /* 'XZY' */
        this.x = ai;
        this.y = ak;
        this.z = aj;
        break
      case 4:
        /* 'ZYX' */
        this.x = ak;
        this.y = aj;
        this.z = ai;
        break
      case 5:
        /* 'YXZ' */
        this.x = aj;
        this.y = ai;
        this.z = ak;
        break
      default:
        throw new Error('sdrty')
    }
  }

  /**
   * Converts Quat to an EulerAngles
   *
   * @param {number | string} rotationOrder - The order in which the rotations are applied.
   * @return {EulerAngles} - The return value.
   */
  toEulerAngles(rotationOrder) {
    const ordered = new Vec3$1();
    switch (rotationOrder) {
      case 0:
        /* ' XYZ' */
        ordered.set(this.z, this.x, this.y);
        break
      case 1:
        /* 'YZX' */
        ordered.set(this.x, this.y, this.z);
        break
      case 2:
        /* 'ZXY' */
        ordered.set(this.y, this.z, this.x);
        break
      case 3:
        /* 'XZY' */
        ordered.set(this.y, -this.x, this.z);
        break
      case 4:
        /* 'ZYX' */
        ordered.set(this.x, -this.z, this.y);
        break
      case 5:
        /* 'YXZ' */
        ordered.set(this.z, -this.y, this.x);
        break
      default:
        throw new Error('Invalid rotation order:' + rotationOrder)
    }

    const euler = new Vec3$1();
    const test = ordered.x * ordered.y + ordered.z * this.w;
    if (test > 0.49999) {
      // singularity at north pole
      euler.y = 2.0 * Math.atan2(ordered.x, this.w);
      euler.z = Math.PI * 0.5;
      euler.x = 0.0;
    } else if (test < -0.49999) {
      // singularity at south pole
      euler.y = -2.0 * Math.atan2(ordered.x, this.w);
      euler.z = Math.PI * -0.5;
      euler.x = 0.0;
    } else {
      const sqx = ordered.x * ordered.x;
      const sqy = ordered.y * ordered.y;
      const sqz = ordered.z * ordered.z;
      euler.y = Math.atan2(2.0 * ordered.y * this.w - 2.0 * ordered.x * ordered.z, 1.0 - 2.0 * sqy - 2.0 * sqz);
      euler.z = Math.asin(2.0 * test);
      euler.x = Math.atan2(2.0 * ordered.x * this.w - 2.0 * ordered.y * ordered.z, 1.0 - 2.0 * sqx - 2.0 * sqz);
    }

    switch (rotationOrder) {
      case 0:
        /* ' XYZ' */
        return new EulerAngles(euler.y, euler.z, euler.x, rotationOrder)
      case 1:
        /* 'YZX' */
        return new EulerAngles(euler.x, euler.y, euler.z, rotationOrder)
      case 2:
        /* 'ZXY' */
        return new EulerAngles(euler.z, euler.x, euler.y, rotationOrder)
      case 3:
        /* 'XZY' */
        return new EulerAngles(-euler.y, euler.x, euler.z, rotationOrder)
      case 4:
        /* 'ZYX' */
        return new EulerAngles(euler.x, euler.z, -euler.y, rotationOrder)
      case 5:
        /* 'YXZ' */
        return new EulerAngles(euler.z, -euler.y, euler.x, rotationOrder)
    }
  }

  /**
   * Set this quat to a rotation defined by an axis and an angle (in radians).
   *
   * @param {Vec3} axis - The axis value.
   * @param {number} angle - The axis angle.
   */
  setFromAxisAndAngle(axis, angle) {
    const halfAngle = angle / 2.0;
    const vec = axis.normalize().scale(Math.sin(halfAngle));
    this.set(vec.x, vec.y, vec.z, Math.cos(halfAngle));
  }

  /**
   * Scales and calculates the cross product of the `Vec3` and sets the result in the Mat3
   *
   * @param {Vec3} dir - The direction value.
   * @param {Vec3} up - The up angle.
   */
  setFromDirectionAndUpvector(dir, up) {
    const mat3 = new Mat3$1();
    mat3.setFromDirectionAndUpvector(dir, up);
    this.setFromMat3(mat3);
  }

  /**
   * Sets the state of the `Quat` from two `Vec3`.
   *
   * @param {Vec3} v0 - The v0 unit vector.
   * @param {Vec3} v1 - The v1 unit vector.
   */
  setFrom2Vectors(v0, v1) {
    const c = v0.cross(v1);
    const d = v0.dot(v1);
    const s = Math.sqrt((1 + d) * 2);
    // this.set( s/2, c.x / s, c.y / s, c.z / s );
    this.set(c.x / s, c.y / s, c.z / s, s / 2);
    this.normalizeInPlace();
  }

  /**
   * Set the quat from a Mat3.
   *
   * @param {Mat3} mat3 - The mat3 value.
   */
  setFromMat3(mat3) {
    // Algorithm in Ken Shoemake's article in 1987 SIGGRAPH course notes
    // article "Quaternion Calculus and Fast Animation".
    const fTrace = mat3.__data[0] + mat3.__data[4] + mat3.__data[8];
    let fRoot;

    if (fTrace > 0.0) {
      // |w| > 1/2, may as well choose w > 1/2
      fRoot = Math.sqrt(fTrace + 1); // 2w
      this.__data[3] = 0.5 * fRoot;
      fRoot = 0.5 / fRoot; // 1/(4w)
      this.__data[0] = (mat3.__data[5] - mat3.__data[7]) * fRoot;
      this.__data[1] = (mat3.__data[6] - mat3.__data[2]) * fRoot;
      this.__data[2] = (mat3.__data[1] - mat3.__data[3]) * fRoot;
    } else {
      // |w| <= 1/2
      let i = 0;
      if (mat3.__data[4] > mat3.__data[0]) i = 1;
      if (mat3.__data[8] > mat3.__data[i * 3 + i]) i = 2;
      const j = (i + 1) % 3;
      const k = (i + 2) % 3;

      fRoot = Math.sqrt(mat3.__data[i * 3 + i] - mat3.__data[j * 3 + j] - mat3.__data[k * 3 + k] + 1.0);
      this.__data[i] = 0.5 * fRoot;
      fRoot = 0.5 / fRoot;
      this.__data[3] = (mat3.__data[j * 3 + k] - mat3.__data[k * 3 + j]) * fRoot;
      this.__data[j] = (mat3.__data[j * 3 + i] + mat3.__data[i * 3 + j]) * fRoot;
      this.__data[k] = (mat3.__data[k * 3 + i] + mat3.__data[i * 3 + k]) * fRoot;
    }
    this.normalizeInPlace();
  }

  /**
   * Set the quat from a Mat4.
   *
   * @param {Mat4} mat4 - The mat4 value.
   */
  setFromMat4(mat4) {
    // Algorithm in Ken Shoemake's article in 1987 SIGGRAPH course notes
    // article "Quaternion Calculus and Fast Animation".
    const fTrace = mat4.__data[0] + mat4.__data[5] + mat4.__data[10];
    let fRoot;

    if (fTrace > 0.0) {
      // |w| > 1/2, may as well choose w > 1/2
      fRoot = Math.sqrt(fTrace + 1); // 2w
      this.__data[3] = 0.5 * fRoot;
      fRoot = 0.5 / fRoot; // 1/(4w)
      this.__data[0] = (mat4.__data[6] - mat4.__data[9]) * fRoot;
      this.__data[1] = (mat4.__data[8] - mat4.__data[2]) * fRoot;
      this.__data[2] = (mat4.__data[1] - mat4.__data[4]) * fRoot;
    } else {
      // |w| <= 1/2
      let i = 0;
      if (mat4.__data[5] > mat4.__data[0]) i = 1;
      if (mat4.__data[10] > mat4.__data[i * 4 + i]) i = 2;
      const j = (i + 1) % 3;
      const k = (i + 2) % 3;

      fRoot = Math.sqrt(mat4.__data[i * 4 + i] - mat4.__data[j * 4 + j] - mat4.__data[k * 4 + k] + 1.0);
      this.__data[i] = 0.5 * fRoot;
      fRoot = 0.5 / fRoot;
      this.__data[3] = (mat4.__data[j * 4 + k] - mat4.__data[k * 4 + j]) * fRoot;
      this.__data[j] = (mat4.__data[j * 4 + i] + mat4.__data[i * 4 + j]) * fRoot;
      this.__data[k] = (mat4.__data[k * 4 + i] + mat4.__data[i * 4 + k]) * fRoot;
    }
    this.normalizeInPlace();
  }

  /**
   * Checks if the angle of the Quat is less that ` Number.EPSILON`
   *
   * @return {boolean} - Returns true or false.
   */
  isIdentity() {
    return this.getAngle() < Number.EPSILON
  }

  /**
   * Return the angle of the Quat.
   *
   * @return {number} - The return value.
   */
  getAngle() {
    return Math.acos(this.w) * 2.0
  }

  /**
   * Returns true if this Quat is exactly the same as other.
   *
   * @param {Quat} other - The other Quat to compare with.
   * @return {boolean} - Returns true or false.
   */
  equal(other) {
    return this.x == other.x && this.y == other.y && this.z == other.z && this.w == other.w
  }

  /**
   * Returns true if this Quat is NOT exactly the same other.
   *
   * @param {Quat} other - The other Quat to compare with.
   * @return {boolean} - Returns true or false.
   */
  notEquals(other) {
    return this.x != other.x && this.y != other.y && this.z != other.z && this.w != other.w
  }

  /**
   * Returns true if this Quat is approximately the same as other
   *
   * @param {Quat} other - The other Quat to compare with.
   * @param {number} precision - The precision to which the values must match.
   * @return {boolean} - Returns true or false.
   */
  approxEqual(other, precision = Number.EPSILON) {
    return (
      Math.abs(this.x - other.x) < precision &&
      Math.abs(this.y - other.y) < precision &&
      Math.abs(this.z - other.z) < precision &&
      Math.abs(this.w - other.w) < precision
    )
  }

  /**
   * Adds other to this Quat and return the result as a new Quat.
   *
   * @param {Quat} other - The other Quat to add.
   * @return {Quat} - Returns a new Quat.
   */
  add(other) {
    return new Quat(this.x + other.x, this.y + other.y, this.z + other.z, this.w + other.w)
  }

  /**
   * Adds other to this Quat.
   *
   * @param {Quat} other - The other Quat to add.
   */
  addInPlace(other) {
    this.x += other.x;
    this.y += other.y;
    this.z += other.z;
    this.w += other.w;
  }

  /**
   * Subtracts other from this Quat and returns the result as a new Quat.
   *
   * @param {Quat} other - The other Quat to subtract.
   * @return {Quat} - Returns a new Quat.
   */
  subtract(other) {
    return new Quat(this.x - other.x, this.y - other.y, this.z - other.z, this.w - other.w)
  }

  /**
   * Scales this Quat by scalar and returns the result as a new Quat.
   *
   * @param {number} scalar - The scalar value.
   * @return {Quat} - Returns a new Vec3.
   */
  scale(scalar) {
    return new Quat(this.x * scalar, this.y * scalar, this.z * scalar, this.w * scalar)
  }

  /**
   * Scales this Quat by scalar.
   *
   * @param {number} scalar - The scalar value.
   */
  scaleInPlace(scalar) {
    this.x *= scalar;
    this.y *= scalar;
    this.z *= scalar;
    this.w *= scalar;
  }

  /**
   * Calculates the length of this Quat.
   *
   * @return {number} - Returns the length.
   */
  length() {
    const x = this.__data[0];
    const y = this.__data[1];
    const z = this.__data[2];
    const w = this.__data[3];
    return Math.sqrt(x * x + y * y + z * z + w * w)
  }

  /**
   * Calculates the squared length of this Quat.
   *
   * @return {number} - Returns the length.
   */
  lengthSquared() {
    const x = this.__data[0];
    const y = this.__data[1];
    const z = this.__data[2];
    const w = this.__data[3];
    return x * x + y * y + z * z + w * w
  }

  /**
   * Normalizes the Quat and returns it as a new Quat.
   *
   * @return {Quat} - Returns the Quat normalized.
   */
  normalize() {
    const x = this.__data[0];
    const y = this.__data[1];
    const z = this.__data[2];
    const w = this.__data[3];
    let len = x * x + y * y + z * z + w * w;
    if (len < Number.EPSILON) {
      return new Quat()
    }

    // TODO: evaluate use of glm_invsqrt here?
    len = 1 / Math.sqrt(len);
    return new Quat(x * len, y * len, z * len)
  }

  /**
   * Normalizes the Quat, modifying it and returning it normalized.
   */
  normalizeInPlace() {
    const x = this.__data[0];
    const y = this.__data[1];
    const z = this.__data[2];
    const w = this.__data[3];
    let len = x * x + y * y + z * z + w * w;
    if (len < Number.EPSILON) {
      return
    }
    len = 1 / Math.sqrt(len);
    this.set(x * len, y * len, z * len, w * len);
  }

  /**
   * Calculates the dot product of two Quats.
   *
   * @param {Quat} other - The other Quat to compare with.
   * @return {number} - Returns the dot product.
   */
  dot(other) {
    return this.x * other.x + this.y * other.y + this.z * other.z + this.w * other.w
  }

  /**
   * Calculates the cross product of two Quats and returns the result as a new Quat.
   *
   * @param {Quat} other - The other Quat to calculate with.
   * @return {Quat} - Returns the cross product as a new Quat.
   */
  cross(other) {
    const ax = this.x;
    const ay = this.y;
    const az = this.z;
    const at = this.w;
    const bx = other.x;
    const by = other.y;
    const bz = other.z;
    const bt = other.w;

    return new Quat(ay * bz - az * by, az * bt - at * bz, at * bx - ax * bt, ax * by - ay * bx)
  }

  /**
   * Returns the rotational conjugate of this Quat.
   * Conjugation represents the same rotation of the Quat but
   * in the opposite direction around the rotational axis.
   *
   * @return {Quat} - the return value.
   */
  conjugate() {
    return new Quat(-this.x, -this.y, -this.z, this.w)
  }

  /**
   * Return the inverse of the `Quat`
   *
   * @return {Quat} - Returns a new Quat.
   */
  inverse() {
    return this.conjugate()
  }

  /**
   * Aligns this quaternion with another one ensuring that the delta between
   * the Quat values is the shortest path over the hypersphere.
   *
   *  @param {Quat} other - The other Quat to divide by.
   */
  alignWith(other) {
    if (this.dot(other) < 0.0) {
      this.set(-this.x, -this.y, -this.z, -this.w);
    }
  }

  // multiply(quat) {
  //     return new Quat(
  //         this.x * quat.w + this.w * quat.x + this.y * quat.z - this.z * quat.y,
  //         this.y * quat.w + this.w * quat.y + this.z * quat.x - this.x * quat.z,
  //         this.z * quat.w + this.w * quat.z + this.x * quat.y - this.y * quat.x,
  //         this.w * quat.w - this.x * quat.x - this.y * quat.y - this.z * quat.z
  //     );
  // }

  /**
   * Multiplies two Quats and returns the result as a new Quat.
   *
   * @param {Quat} other - The other Quat to multiply.
   * @return {Quat} - Returns a new Quat.
   */
  multiply(other) {
    const ax = this.__data[0];
    const ay = this.__data[1];
    const az = this.__data[2];
    const aw = this.__data[3];
    const bx = other.__data[0];
    const by = other.__data[1];
    const bz = other.__data[2];
    const bw = other.__data[3];

    return new Quat(
      ax * bw + aw * bx + ay * bz - az * by,
      ay * bw + aw * by + az * bx - ax * bz,
      az * bw + aw * bz + ax * by - ay * bx,
      aw * bw - ax * bx - ay * by - az * bz
    )
  }

  /**
   * Multiplies two Quats.
   *
   * @param {Quat} other - The other Quat to multiply.
   */
  multiplyInPlace(other) {
    const ax = this.__data[0];
    const ay = this.__data[1];
    const az = this.__data[2];
    const aw = this.__data[3];
    const bx = other.__data[0];
    const by = other.__data[1];
    const bz = other.__data[2];
    const bw = other.__data[3];

    this.set(
      ax * bw + aw * bx + ay * bz - az * by,
      ay * bw + aw * by + az * bx - ax * bz,
      az * bw + aw * bz + ax * by - ay * bx,
      aw * bw - ax * bx - ay * by - az * bz
    );
  }

  /**
   * Rotates a vector by this quaterion.
   * Don't forget to normalize the quaternion unless
   * you want axial translation as well as rotation.
   *
   * @param {Vec3} vec3 - The vec3 value.
   * @return {Vec3} - Returns a new Vec3.
   */
  rotateVec3(vec3) {
    const vq = new Quat(vec3.x, vec3.y, vec3.z, 0.0);
    const pq = this.multiply(vq).multiply(this.conjugate());
    return new Vec3$1(pq.x, pq.y, pq.z)
  }

  /**
   * Rotates a quaternion by the given angle about the X axis.
   *
   * @param {number} rad - Angle (in radians) to rotate.
   */
  rotateX(rad) {
    rad *= 0.5;

    const ax = this.x;
    const ay = this.y;
    const az = this.z;
    const aw = this.w;
    const bx = Math.sin(rad);
    const bw = Math.cos(rad);

    this.x = ax * bw + aw * bx;
    this.y = ay * bw + az * bx;
    this.z = az * bw - ay * bx;
    this.w = aw * bw - ax * bx;
  }

  /**
   * Rotates a quaternion by the given angle about the Y axis.
   *
   * @param {number} rad - Angle (in radians) to rotate.
   */
  rotateY(rad) {
    rad *= 0.5;

    const ax = this.x;
    const ay = this.y;
    const az = this.z;
    const aw = this.w;
    const by = Math.sin(rad);
    const bw = Math.cos(rad);

    this.x = ax * bw - az * by;
    this.y = ay * bw + aw * by;
    this.z = az * bw + ax * by;
    this.w = aw * bw - ay * by;
  }

  /**
   * Rotates a quaternion by the given angle about the Z axis.
   *
   * @param {number} rad - Angle (in radians) to rotate.
   */
  rotateZ(rad) {
    rad *= 0.5;

    const ax = this.x;
    const ay = this.y;
    const az = this.z;
    const aw = this.w;
    const bz = Math.sin(rad);
    const bw = Math.cos(rad);

    this.x = ax * bw + ay * bz;
    this.y = ay * bw - ax * bz;
    this.z = az * bw + aw * bz;
    this.w = aw * bw - az * bz;
  }

  /**
   * Converts this Quat to a Mat3 (a 3x3 matrix).
   *
   * @return {Mat3} - TReturns a new Mat3.
   */
  toMat3() {
    const x = this.x;
    const y = this.y;
    const z = this.z;
    const w = this.w;
    const x2 = x + x;
    const y2 = y + y;
    const z2 = z + z;
    const xx = x * x2;
    const yx = y * x2;
    const yy = y * y2;
    const zx = z * x2;
    const zy = z * y2;
    const zz = z * z2;
    const wx = w * x2;
    const wy = w * y2;
    const wz = w * z2;

    const mat3 = new Mat3$1();
    mat3.__data[0] = 1 - yy - zz;
    mat3.__data[3] = yx - wz;
    mat3.__data[6] = zx + wy;

    mat3.__data[1] = yx + wz;
    mat3.__data[4] = 1 - xx - zz;
    mat3.__data[7] = zy - wx;

    mat3.__data[2] = zx - wy;
    mat3.__data[5] = zy + wx;
    mat3.__data[8] = 1 - xx - yy;

    return mat3
  }

  /**
   * Returns the X axis of this quaternion.
   *
   * @return {Vec3} - Returns the X axis as a Vec3.
   */
  getXaxis() {
    const xy = this.x * this.y;
    const xz = this.x * this.z;
    const yy = this.y * this.y;
    const yw = this.y * this.w;
    const zz = this.z * this.z;
    const zw = this.z * this.w;

    return new Vec3$1(1.0 - 2.0 * (zz + yy), 2.0 * (xy + zw), 2.0 * (xz - yw))
  }

  /**
   * Returns the Y axis of this quaternion.
   *
   * @return {Vec3} - Returns the Y axis as a Vec3.
   */
  getYaxis() {
    const xx = this.x * this.x;
    const xy = this.x * this.y;
    const xw = this.x * this.w;
    const yz = this.y * this.z;
    const zz = this.z * this.z;
    const zw = this.z * this.w;

    return new Vec3$1(2.0 * (xy - zw), 1.0 - 2.0 * (zz + xx), 2.0 * (yz + xw))
  }

  /**
   * Returns the Z axis of this quaternion.
   *
   * @return {Vec3} - Returns the Z axis as a Vec3.
   */
  getZaxis() {
    const xx = this.x * this.x;
    const xz = this.x * this.z;
    const xw = this.x * this.w;

    const yy = this.y * this.y;
    const yz = this.y * this.z;
    const yw = this.y * this.w;
    const temp = new Vec3$1();

    return new Vec3$1(2.0 * (yw + xz), 2.0 * (yz - xw), 1.0 - 2.0 * (yy + xx))
  }

  /**
   * Reflects this quaternion according to the axis provided.
   *
   * @param {number} axisIndex - An integer with value of 0 for the X axis, 1 for the Y axis, and 2 for the Z axis.
   * @return {Quat} - Returns a new Quat.
   */
  mirror(axisIndex) {
    switch (axisIndex) {
      case 0:
        return new Quat(this.z, this.w, this.x, this.y)
      case 1:
        return new Quat(-this.w, this.z, this.y, -this.x)
      case 2:
        return new Quat(this.x, this.y, this.z, -this.w)
    }
  }

  /**
   * Converts this Quat to a Mat4 (a 4x4 matrix).
   *
   * @return {Mat4} - Returns a new Mat4.
   */
  toMat4() {
    const x = this.x;
    const y = this.y;
    const z = this.z;
    const w = this.w;
    const x2 = x + x;
    const y2 = y + y;
    const z2 = z + z;
    const xx = x * x2;
    const yx = y * x2;
    const yy = y * y2;
    const zx = z * x2;
    const zy = z * y2;
    const zz = z * z2;
    const wx = w * x2;
    const wy = w * y2;
    const wz = w * z2;

    // Set the columns
    const mat4 = new Mat4();
    mat4.__data[0] = 1 - yy - zz;
    mat4.__data[4] = yx - wz;
    mat4.__data[8] = zx + wy;

    mat4.__data[1] = yx + wz;
    mat4.__data[5] = 1 - xx - zz;
    mat4.__data[9] = zy - wx;

    mat4.__data[2] = zx - wy;
    mat4.__data[6] = zy + wx;
    mat4.__data[10] = 1 - xx - yy;

    return mat4
  }

  /**
   * Performs a linear interpolation between two Quats.
   *
   * @param {Quat} other  - The other Quat to interpolate between.
   * @param {number} t - Interpolation amount between the two inputs.
   * @return {Quat} - Returns a new Quat.
   */
  lerp(other, t) {
    const result = new Quat(
      this.x + t * (other.x - this.x),
      this.y + t * (other.y - this.y),
      this.z + t * (other.z - this.z),
      this.w + t * (other.w - this.w)
    );
    result.normalizeInPlace();
    return result
  }

  // /**
  //  * Generates a random vector with the given scale.
  //  * @param {number} scale -  Length of the resulting vector. If ommitted, a unit vector will be returned.
  //  * @returns {vec4} - The return value.
  //  */
  // random(scale = 1.0) {
  //     const r = glMatrix.RANDOM() * 2.0 * Math.PI;
  //     const z = (glMatrix.RANDOM() * 2.0) - 1.0;
  //     const zScale = Math.sqrt(1.0 - z * z) * scale;

  //     out[0] = Math.cos(r) * zScale;
  //     out[1] = Math.sin(r) * zScale;
  //     out[2] = z * scale;
  //     return out;
  // }

  // ////////////////////////////////////////
  // Static Methods

  /**
   * Creates a new Quat.
   * @param {...object} ...args - The ...args param.
   * @return {Quat} - Returns a new Quat.
   * @private
   */
  static create(...args) {
    return new Quat(...args)
  }

  /**
   * Creates a new Quat to wrap existing memory in a buffer.
   * @param {ArrayBuffer} buffer - The buffer value.
   * @param {number} offset - The offset value.
   * @return {Quat} - Returns a new Quat.
   * @deprecated
   * @private
   */
  static createFromFloat32Buffer(buffer, offset = 0) {
    console.warn('Deprecated, use #createFromBuffer instead');
    return this.createFromBuffer(buffer, offset * 4)
  }

  /**
   * Creates an instance of a `Quat` using an ArrayBuffer.
   *
   * @static
   * @param {ArrayBuffer} buffer - The buffer value.
   * @param {number} byteOffset - The offset value.
   * @return {Quat} - Returns a new Quat.
   */
  static createFromBuffer(buffer, byteOffset) {
    return new Quat(new Float32Array(buffer, byteOffset, 4)) // 4 bytes per 32bit float
  }

  /**
   * Returns the number of Float32 elements used by this type. Used to calculate storage requirements for large arrays of this type.
   * @return {number} - The return value.
   * @private
   */
  static numElements() {
    return 4
  }

  /**
   * Clones this Quat and returns a new Quat.
   *
   * @return {Quat} - Returns a new Quat.
   */
  clone() {
    return new Quat(this.__data[0], this.__data[1], this.__data[2], this.__data[3])
  }

  // ///////////////////////////
  // Persistence

  /**
   * The toJSON method encodes this type as a json object for persistences.
   *
   * @return {object} - The json object.
   */
  toJSON() {
    return {
      x: this.x,
      y: this.y,
      z: this.z,
      w: this.w,
    }
  }

  /**
   * The fromJSON method decodes a json object for this type.
   *
   * @param {object} j - The json object.
   */
  fromJSON(j) {
    this.__data[0] = j.x;
    this.__data[1] = j.y;
    this.__data[2] = j.z;
    this.__data[3] = j.w;
    this.normalizeInPlace();
  }

  /**
   * Loads the state of the value from a binary reader.
   *
   * @param {BinReader} reader - The reader value.
   */
  readBinary(reader) {
    this.x = reader.loadFloat32();
    this.y = reader.loadFloat32();
    this.z = reader.loadFloat32();
    this.w = reader.loadFloat32();
  }
}

Registry.register('Quat', Quat);

/* eslint-disable new-cap */

/**
 * Class representing a ray that emits from an origin in a specified direction.
 */
class Ray {
  /**
   * Create a ray.
   *
   * @param {Vec3} start - The origin of the ray.
   * @param {Vec3} dir - The direction of the ray.
   */
  constructor(start = undefined, dir = undefined) {
    if (start instanceof Vec3$1) {
      this.start = start;
    } else {
      this.start = new Vec3$1();
    }
    if (dir instanceof Vec3$1) {
      this.dir = dir;
    } else {
      this.dir = new Vec3$1();
    }
  }

  /**
   * Get the closest point.
   *
   * @param {Vec3} point - The point in 3D space.
   * @return {Ray} - Returns a Ray.
   */
  closestPoint(point) {
    const w = point.subtract(this.start);
    const c1 = w.dot(this.dir);
    if (c1 < Number.EPSILON) return this.start
    const c2 = this.dir.dot(this.dir);
    // if (c2 < Number.EPSILON) return this.start
    const fract = c1 / c2;
    return this.start.add(this.dir.scale(fract))
  }

  /**
   * Get the closest point at a distance.
   *
   * @param {Vec3} dist - The distance value.
   * @return {Ray} - Returns a Ray.
   */
  pointAtDist(dist) {
    return this.start.add(this.dir.scale(dist))
  }

  /**
   * Returns the two ray params that represent the closest point between the two rays.
   *
   * @param {Ray} ray - The ray value.
   * @return {Ray} - Returns a Ray.
   */
  intersectRayVector(ray) {
    const u = this.dir;
    const v = ray.dir;
    const w = this.start.subtract(ray.start);
    const a = u.dot(u); // always >= 0
    const b = u.dot(v);
    const c = v.dot(v); // always >= 0
    const d = u.dot(w);
    const e = v.dot(w);
    if (a == 0.0 && c == 0.0) {
      return this.start.distanceTo(ray.start)
    }
    if (a == 0.0) {
      return ray.closestPoint(this.start)
    }
    if (c == 0.0) {
      return this.closestPoint(ray.start)
    }
    const D = a * c - b * b; // always >= 0

    // compute the ray parameters of the two closest points
    let this_t;
    let ray_t;
    if (D < 0.001) {
      // the lines are almost parallel
      this_t = 0.0;
      if (b > c) {
        // use the largest denominator
        ray_t = d / b;
      } else {
        ray_t = e / c;
      }
    } else {
      this_t = (b * e - c * d) / D;
      ray_t = (a * e - b * d) / D;
    }
    return [this_t, ray_t]
  }

  /**
   * Returns one ray param representing the intersection
   * of this ray against the plane defined by the given ray.
   *
   * @param {Vec3} plane - The plane to intersect with.
   * @return {number} - The return value.
   */
  intersectRayPlane(plane) {
    const w = this.start.subtract(plane.start);
    const D = plane.dir.dot(this.dir);
    const N = -plane.dir.dot(w);

    if (Math.abs(D) < Number.PRECISION) {
      // segment is parallel to plane
      if (N == 0.0) return -1.0
      // segment lies in plane
      else return -1.0 // no intersection
    }
    // they are not parallel
    // compute intersect param
    const sI = N / D;
    if (sI < -Number.PRECISION) {
      return -1 // no intersection
    }
    return sI
  }

  /**
   * Clones this Ray and returns a new Ray.
   *
   * @return {Ray} - Returns a new Ray.
   */
  clone() {
    return new Ray(this.start.clone(), this.dir.clone())
  }

  // ////////////////////////////////////////
  // Static Methods

  /**
   * Creates a new Ray.
   * @param {...object} ...args - The ...args param.
   * @return {Ray} - Returns a new Ray.
   * @private
   */
  static create(...args) {
    return new Ray(...args)
  }

  // ///////////////////////////
  // Persistence

  /**
   * The toJSON method encodes this type as a json object for persistences.
   *
   * @return {object} - The json object.
   */
  toJSON() {
    return {
      start: this.start,
      dir: this.dir,
    }
  }

  /**
   * The fromJSON method decodes a json object for this type.
   *
   * @param {object} j - The json object.
   */
  fromJSON(j) {
    this.start.fromJSON(j.start);
    this.dir.fromJSON(j.dir);
  }

  /**
   * Calls `toJSON` method and stringifies it.
   *
   * @return {string} - The return value.
   */
  toString() {
    return StringFunctions.stringifyJSONWithFixedPrecision(this.toJSON())
  }
}

Registry.register('Ray', Ray);

/* eslint-disable no-unused-vars */

const sc_helper = new Vec3$1(1, 1, 1);

/**
 * Class representing an Xfo transform, which is a transformation decomposed into 3 component values. Translation, Orientation, and Scaling.
 */
class Xfo {
  /**
   * Initializes the Xfo object.
   * <br>
   * **Note:** You can leave it empty and use other methods ti set the state of the class.
   *
   * @see [`setFromOther`](#setFromOther) [`fromMat4`](#fromMat4) [`setFromFloat32Array`](#setFromFloat32Array) [`fromJSON`](#fromJSON)
   *
   * @param {Float32Array | Vec3} tr - The translation value.
   * @param {Quat} ori - The orientation value.
   * @param {Vec3} sc - The scaling value.
   */
  constructor(tr = undefined, ori = undefined, sc = undefined) {
    if (tr instanceof Float32Array) {
      this.setFromFloat32Array(tr);
      return
    }
    if (tr instanceof Vec3$1) {
      this.tr = tr;
    } else if (tr instanceof Quat && ori == undefined && sc == undefined) {
      this.tr = new Vec3$1();
      this.ori = tr; // Xfo constructor with just a Quat.
      this.sc = new Vec3$1(1, 1, 1);
      return
    } else {
      this.tr = new Vec3$1();
    }
    if (ori instanceof Quat) {
      this.ori = ori;
    } else {
      this.ori = new Quat();
    }
    if (sc instanceof Vec3$1) {
      this.sc = sc;
    } else {
      this.sc = new Vec3$1(1, 1, 1);
    }
  }

  /**
   * Sets the state of the Xfo object.
   *
   * @param {Vec3} tr - The translation value.
   * @param {Quat} ori - The orientation value.
   * @param {Vec3} sc - The scaling value.
   */
  set(tr, ori, sc = undefined) {
    this.tr = tr;
    this.ori = ori;
    if (sc instanceof Vec3$1) this.sc = sc;
  }

  /**
   * Sets the state of the Xfo object using another Xfo object.
   *
   * @param {Xfo} other - The other Xfo to set from.
   */
  setFromOther(other) {
    this.tr = other.tr;
    this.ori = other.ori;
    this.sc = other.sc;
  }

  /**
   * Verifies that the Xfo object is an `identity`, checking that the translation, orientation and scaling attributes are in their initial state.
   *
   * @return {boolean} - The return value.
   */
  isIdentity() {
    return this.tr.isNull() && this.ori.isIdentity() && this.sc.is111()
  }

  /**
   * Checks if this Vec3 is exactly the same as another Vec3.
   *
   * @param {Vec3} other - The other Vec3 to compare with.
   * @return {boolean} - Returns `true` if are the same Vector, otherwise, `false`.
   */
  isEqual(other) {
    return this.tr.isEqual(other.tr) && this.ori.isEqual(other.ori) && this.sc.isEqual(other.sc)
  }

  /**
   * Returns true if this Vec2 is approximately the same as other.
   *
   * @param {Vec3} other - The other Vec3 to compare with.
   * @param {number} precision - The precision to which the values must match.
   * @return {boolean} - Returns true or false.
   */
  approxEqual(other, precision = Number.EPSILON) {
    return (
      (other.tr ? this.tr.approxEqual(other.tr, precision) : true) &&
      (other.ori ? this.ori.approxEqual(other.ori, precision) : true) &&
      (other.sc ? this.sc.approxEqual(other.sc, precision) : true)
    )
  }

  /**
   * The setLookAt method.
   * @param {Vec3} pos - The position value.
   * @param {Vec3} target - The target value.
   * @param {Vec3} up - The up value.
   */
  setLookAt(pos, target, up) {
    // Note: We look along the -z axis. Negate the direction.
    const dir = pos.subtract(target);
    const dirLen = dir.length();
    if (dirLen < Number.EPSILON) {
      throw new Error('Invalid dir')
    }
    this.ori.setFromDirectionAndUpvector(dir, up);
    this.tr = pos;
  }

  /**
   * Multiplies two Xfo transforms.
   *
   * @param {Xfo} xfo - The xfo to multiply with.
   * @return {Xfo} - Returns an Xfo.
   */
  multiply(xfo) {
    let this_sc = this.sc;
    if (this.sc.x != this.sc.y || this.sc.x != this.sc.z) {
      this_sc = xfo.ori.rotateVec3(this.sc);
      if (Math.sign(this_sc.x) != Math.sign(this.sc.x)) this_sc.x = -this_sc.x;
      if (Math.sign(this_sc.y) != Math.sign(this.sc.y)) this_sc.y = -this_sc.y;
      if (Math.sign(this_sc.z) != Math.sign(this.sc.z)) this_sc.z = -this_sc.z;
    }
    const result = new Xfo(
      this.tr.add(this.ori.rotateVec3(this_sc.multiply(xfo.tr))),
      this.ori.multiply(xfo.ori),
      this_sc.multiply(xfo.sc)
    );
    return result
  }

  /**
   * Returns the inverse of the Xfo object, but returns. the result as a new Xfo.
   *
   * @return {Xfo} - Returns a new Xfo.
   */
  inverse() {
    const result = new Xfo();
    result.ori = this.ori.inverse();

    if (this.sc.x != this.sc.y || this.sc.x != this.sc.z) {
      // Note: the following code has not been tested and
      // may not be quite correct. We need to setup
      // unit tests for this kind of sample.
      // An example would be to lay out some boxes on different rotations
      // and with non-uniform scale. Then parent them together. If they
      // remain stationary, after parenting, then this math is correct.
      result.sc = result.ori.rotateVec3(this.sc);
      if (Math.sign(result.sc.x) != Math.sign(this.sc.x)) result.sc.x = -result.sc.x;
      if (Math.sign(result.sc.y) != Math.sign(this.sc.y)) result.sc.y = -result.sc.y;
      if (Math.sign(result.sc.z) != Math.sign(this.sc.z)) result.sc.z = -result.sc.z;
    } else {
      result.sc = this.sc.inverse();
    }
    result.tr = result.ori.rotateVec3(this.tr.negate().multiply(result.sc));
    return result
  }

  /**
   * Transforms Xfo object using a `Vec3` object. First scaling it, then rotating and finally adding the result to current translation object.
   *
   * @param {Vec3} vec3 - The vec3 value.
   * @return {Vec3} - The return value.
   */
  transformVec3(vec3) {
    return this.tr.add(this.ori.rotateVec3(this.sc.multiply(vec3)))
  }

  /**
   * Converts this Xfo to a Mat4 (a 4x4 matrix).
   *
   * @return {Mat4} - Returns a new Mat4.
   */
  toMat4() {
    const scl = new Mat4(this.sc.x, 0, 0, 0, 0, this.sc.y, 0, 0, 0, 0, this.sc.z, 0, 0, 0, 0, 1.0);

    const rot = this.ori.toMat4();

    const trn = new Mat4();
    trn.translation = this.tr;

    return trn.multiply(rot).multiply(scl)
  }

  /**
   * Sets the state of the Xfo object using Mat4.
   *
   * @param {Mat4} mat4 - The mat4 value.
   */
  fromMat4(mat4) {
    this.tr = mat4.translation;
    this.ori.setFromMat4(mat4);
  }

  /**
   * Sets the state of the Xfo object using an `Float32array`.
   * <br>
   * **Note:** You can set the byteOffset in your `Float32array` object
   *
   * @param {Float32Array} float32array - The float32array value.
   */
  setFromFloat32Array(float32array) {
    if (float32array.length == 7) {
      this.tr = new Vec3$1(float32array.buffer, float32array.byteOffset);
      this.ori = new Quat(float32array.buffer, float32array.byteOffset + 12);
      this.sc = new Vec3$1(1, 1, 1);
      return
    }
    if (float32array.length == 8) {
      this.tr = new Vec3$1(float32array.buffer, float32array.byteOffset);
      this.ori = new Quat(float32array.buffer, float32array.byteOffset + 12);
      const scl = float32array[7];
      this.sc = new Vec3$1(scl, scl, scl);
      return
    }
    if (float32array.length == 10) {
      this.tr = new Vec3$1(float32array.buffer, float32array.byteOffset);
      this.ori = new Quat(float32array.buffer, float32array.byteOffset + 12);
      this.sc = new Vec3$1(float32array.buffer, float32array.byteOffset + 21);
      return
    }
  }

  /**
   * Clones this Xfo and returns a new Xfo.
   *
   * @return {Xfo} - Returns a new Xfo.
   */
  clone() {
    return new Xfo(this.tr.clone(), this.ori.clone(), this.sc.clone())
  }

  // ////////////////////////////////////////
  // Static Methods

  /**
   * Creates a new Xfo.
   * @param {...object} ...args - The ...args param.
   * @return {Xfo} - eturns a new Xfo.
   * @private
   */
  static create(...args) {
    return new Xfo(...args)
  }

  // ///////////////////////////
  // Persistence

  /**
   * The toJSON method encodes this type as a json object for persistence.
   *
   * @return {object} - The json object.
   */
  toJSON() {
    const j = {
      tr: this.tr.toJSON(),
      ori: this.ori.toJSON(),
    };
    if (!this.sc.is111()) j.sc = this.sc.toJSON();
    return j
  }

  /**
   * The fromJSON method decodes a json object for this type.
   *
   * @param {object} j - The json object.
   */
  fromJSON(j) {
    this.tr.fromJSON(j.tr);
    this.ori.fromJSON(j.ori);
    if (j.sc) {
      this.sc.fromJSON(j.sc);
    }
  }

  /**
   * Loads the state of the value from a binary reader.
   *
   * @param {BinReader} reader - The reader value.
   */
  readBinary(reader) {
    this.tr.readBinary(reader);
    this.ori.readBinary(reader);
    this.sc.readBinary(reader);
  }

  /**
   * The fromJSON method decodes a json object for this type.
   *
   * @return {string} - The return value.
   */
  toString() {
    // eslint-disable-next-line new-cap
    return StringFunctions.stringifyJSONWithFixedPrecision(this.toJSON())
  }
}

Registry.register('Xfo', Xfo);

/* eslint-disable camelcase */

/**
 * Represents a box in 2D space. Needing two Vec2 vectors describing the corners
 */
class Box2 {
  /**
   * Creates a Box2 object using Vec2s.
   * In case the parameters are not passed by, their values are pre-defined:
   * <br>
   * p0 is a Vec2 with {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number/POSITIVE_INFINITY|`Number.POSITIVE_INFINITY`}
   * <br>
   * p1 is a Vec2 with {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number/NEGATIVE_INFINITY|`Number.NEGATIVE_INFINITY`}
   *
   * @param {Vec2} p0 - A point representing the corners of a 2D box.
   * @param {Vec2} p1 - A point representing the corners of a 2D box.
   */
  constructor(p0 = undefined, p1 = undefined) {
    if (p0 instanceof Vec2) {
      this.p0 = p0;
    } else {
      this.p0 = new Vec2(Number.POSITIVE_INFINITY, Number.POSITIVE_INFINITY);
    }
    if (p1 instanceof Vec2) {
      this.p1 = p1;
    } else {
      this.p1 = new Vec2(Number.NEGATIVE_INFINITY, Number.NEGATIVE_INFINITY);
    }
  }

  /**
   * Sets both Vect2 points
   *
   * @param {Vec2} p0 - A point representing the corners of a 2D box.
   * @param {Vec2} p1 - A point representing the corners of a 2D box.
   */
  set(p0, p1) {
    this.p0 = p0;
    this.p1 = p1;
  }

  /**
   * Resets the box2 back to an uninitialized state.
   *
   * @see {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number/POSITIVE_INFINITY|`Number.POSITIVE_INFINITY`}
   * and {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number/NEGATIVE_INFINITY|`Number.NEGATIVE_INFINITY`}
   */
  reset() {
    this.p0.x = Number.POSITIVE_INFINITY;
    this.p1.x = Number.NEGATIVE_INFINITY;
    this.p0.y = Number.POSITIVE_INFINITY;
    this.p1.y = Number.NEGATIVE_INFINITY;
  }

  /**
   * Returns `true` if the box has been expanded to contain a point.
   *
   * @return {boolean} - The return value.
   */
  isValid() {
    return (
      this.p0.x != Number.POSITIVE_INFINITY &&
      this.p1.x != Number.NEGATIVE_INFINITY &&
      this.p0.y != Number.POSITIVE_INFINITY &&
      this.p1.y != Number.NEGATIVE_INFINITY
    )
  }

  /**
   * Expands the Box2 to contain the new point.
   *
   * @param {Vec2} point - A point represents the corners of a 2D box.
   */
  addPoint(point) {
    if (this.p0.x == Number.POSITIVE_INFINITY || point.x < this.p0.x) this.p0.x = point.x;
    if (this.p0.y == Number.POSITIVE_INFINITY || point.y < this.p0.y) this.p0.y = point.y;

    if (this.p1.y == Number.NEGATIVE_INFINITY || point.x > this.p1.x) this.p1.x = point.x;
    if (this.p1.y == Number.NEGATIVE_INFINITY || point.y > this.p1.y) this.p1.y = point.y;
  }

  /**
   * Returns the size of a Box2.
   *
   * @return {Box2} - Returns a Box2.
   */
  size() {
    return this.p1.subtract(this.p0)
  }

  /**
   * Returns the size of a Box2 - the same as size().
   *
   * @return {Box2} - Returns a Box2.
   */
  diagonal() {
    return this.p1.subtract(this.p0)
  }

  /**
   * Returns the center point of a Box2.
   *
   * @return {Vec2} - Returns a Vec2.
   */
  center() {
    const result = this.p1.subtract(this.p0);
    result.scaleInPlace(0.5);
    result.addInPlace(this.p0);
    return result
  }

  // ////////////////////////////////////////
  // Static Methods

  /**
   * Creates a new Box2.
   * @param {...object} ...args - The ...args param.
   * @return {Box2} - Returns a new Box2.
   * @private
   */
  static create(...args) {
    return new Box2(...args)
  }

  // ////////////////////////////////////////
  // Persistence

  /**
   * Encodes `Box2` Class as a JSON object for persistence.
   *
   * @return {object} - The json object.
   */
  toJSON() {
    return {
      p0: this.p0.toJSON(),
      p1: this.p1.toJSON(),
    }
  }

  /**
   * Calls `toJSON` method and stringifies it.
   *
   * @return {string} - The return value.
   */
  toString() {
    // eslint-disable-next-line new-cap
    return StringFunctions.stringifyJSONWithFixedPrecision(this.toJSON())
  }
}

Registry.register('Box2', Box2);

/* eslint-disable new-cap */

/**
 * Class representing a sphere.
 *
 * @extends AttrValue
 */
class SphereType extends AttrValue {
  /**
   * Create a sphere.
   * @param {Vec3} pos - The position of the sphere.
   * @param {number} radius - The radius of the sphere.
   */
  constructor(pos, radius = 0) {
    super();
    if (pos instanceof Vec3$1) {
      this.pos = pos;
    } else {
      this.pos = new Vec3$1();
    }
    this.radius = radius;
  }

  /**
   * Clones this sphere and returns a new sphere.
   *
   * @return {Sphere} - Returns a new sphere.
   */
  clone() {
    return new Sphere(this.pos.clone(), this.radius)
  }

  /**
   * Checks if this sphere intersects a box.
   *
   * @param {Box3} box - The box value.
   * @return {boolean} - The return value.
   */
  intersectsBox(box) {
    return box.intersectsSphere(this)
  }

  // ///////////////////////////
  // Persistence

  /**
   * The toJSON method encodes this type as a json object for persistence.
   *
   * @return {object} - The json object.
   */
  toJSON() {
    return {
      pos: this.pos.toJSON(),
      radius: this.radius,
    }
  }

  /**
   * Calls `toJSON` method and stringifies it.
   *
   * @return {string} - The return value.
   */
  toString() {
    return StringFunctions.stringifyJSONWithFixedPrecision(this.toJSON())
  }

  // ////////////////////////////////////////
  // Static Methods

  /**
   * Creates a new sphere.
   *
   * @param {...object} ...args - The ...args param.
   * @return {Sphere} - Returns a new sphere.
   * @private
   */
  static create(...args) {
    return new Sphere(...args)
  }
}

Registry.register('SphereType', SphereType);

/* eslint-disable camelcase */

/**
 * Class representing a box in 3D space.
 * Represents a box in 3D space defined by two Vec3 values which define opposing corners of the box.
 */
class Box3$1 {
  /**
   * Creates a Box3 object using Vec3s.
   * In case the parameters are not passed by, their values are pre-defined:
   * <br>
   * p0 is a Vec2 with {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number/POSITIVE_INFINITY|`Number.POSITIVE_INFINITY`}
   * <br>
   * p1 is a Vec2 with {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number/NEGATIVE_INFINITY|`Number.NEGATIVE_INFINITY`}
   *
   * @param {Vec3} p0 - A point representing the corners of a 3D box.
   * @param {Vec3} p1 - A point representing the corners of a 3D box.
   */
  constructor(p0 = undefined, p1 = undefined) {
    if (p0 instanceof Float32Array) {
      this.setFromFloat32Array(p0);
      return
    }
    if (p0 instanceof Vec3$1) {
      this.p0 = p0;
    } else {
      this.p0 = new Vec3$1(Number.POSITIVE_INFINITY, Number.POSITIVE_INFINITY, Number.POSITIVE_INFINITY);
    }
    if (p1 instanceof Vec3$1) {
      this.p1 = p1;
    } else {
      this.p1 = new Vec3$1(Number.NEGATIVE_INFINITY, Number.NEGATIVE_INFINITY, Number.NEGATIVE_INFINITY);
    }
  }

  /**
   * Getter for the lower (x, y, z) boundary of the box.
   *
   * @return {Vec3} - Returns the minumum Vec3.
   */
  get min() {
    return this.p0
  }

  /**
   * Getter for the upper (x, y, z) boundary of the box.
   *
   * @return {Vec3} - Returns the minumum Vec3.
   */
  get max() {
    return this.p1
  }

  /**
   * Sets both Vect3 points
   *
   * @param {Vec3} p0 - A point representing the corners of a 3D box.
   * @param {Vec3} p1 - A point representing the corners of a 3D box.
   */
  set(p0, p1) {
    this.p0 = p0;
    this.p1 = p1;
  }

  /**
   * Resets the box3 back to an uninitialized state.
   */
  reset() {
    this.p0.x = Number.POSITIVE_INFINITY;
    this.p1.x = Number.NEGATIVE_INFINITY;
    this.p0.y = Number.POSITIVE_INFINITY;
    this.p1.y = Number.NEGATIVE_INFINITY;
    this.p0.z = Number.POSITIVE_INFINITY;
    this.p1.z = Number.NEGATIVE_INFINITY;
  }

  /**
   * Returns `true` if the box has been expanded to contain a point.
   *
   * @return {boolean} - The return value.
   */
  isValid() {
    return (
      this.p0.x != Number.POSITIVE_INFINITY &&
      this.p1.x != Number.NEGATIVE_INFINITY &&
      this.p0.y != Number.POSITIVE_INFINITY &&
      this.p1.y != Number.NEGATIVE_INFINITY &&
      this.p0.z != Number.POSITIVE_INFINITY &&
      this.p1.z != Number.NEGATIVE_INFINITY
    )
  }

  /**
   * Expands the Box3 to contain the new point.
   *
   * @param {Vec3} point - A point represents the corners of a 3D box.
   */
  addPoint(point) {
    if (point.x != Number.POSITIVE_INFINITY && point.x != Number.NEGATIVE_INFINITY) {
      if (point.x < this.p0.x) this.p0.x = point.x;
      if (point.x > this.p1.x) this.p1.x = point.x;
    }
    if (point.y != Number.POSITIVE_INFINITY && point.y != Number.NEGATIVE_INFINITY) {
      if (point.y < this.p0.y) this.p0.y = point.y;
      if (point.y > this.p1.y) this.p1.y = point.y;
    }
    if (point.z != Number.POSITIVE_INFINITY && point.z != Number.NEGATIVE_INFINITY) {
      if (point.z < this.p0.z) this.p0.z = point.z;
      if (point.z > this.p1.z) this.p1.z = point.z;
    }
  }

  /**
   * Adds `Box3` to this `Box3`, of the Xfo instance is passed in the parameters
   * it proceeds to apply the transform for the Vec3.
   *
   * @param {Box3} box3 - A 3D box.
   * @param {Xfo} xfo - A 3D transform.
   */
  addBox3(box3, xfo = undefined) {
    if (xfo) {
      // Transform each corner of the Box3 into the new coordinate system.
      this.addPoint(xfo.transformVec3(box3.p0));
      this.addPoint(xfo.transformVec3(new Vec3$1(box3.p0.x, box3.p0.y, box3.p1.z)));
      this.addPoint(xfo.transformVec3(new Vec3$1(box3.p0.x, box3.p1.y, box3.p0.z)));
      this.addPoint(xfo.transformVec3(new Vec3$1(box3.p1.x, box3.p0.y, box3.p0.z)));
      this.addPoint(xfo.transformVec3(new Vec3$1(box3.p0.x, box3.p1.y, box3.p1.z)));
      this.addPoint(xfo.transformVec3(new Vec3$1(box3.p1.x, box3.p0.y, box3.p1.z)));
      this.addPoint(xfo.transformVec3(new Vec3$1(box3.p1.x, box3.p1.y, box3.p0.z)));
      this.addPoint(xfo.transformVec3(box3.p1));
    } else {
      this.addPoint(box3.p0);
      this.addPoint(box3.p1);
    }
  }

  /**
   * Returns the size of the Box3.
   *
   * @return {Box3} - Returns a Box3.
   */
  size() {
    return this.p1.subtract(this.p0)
  }

  /**
   * Returns the size of a Box3 - the same as size().
   *
   * @return {Box3} - Returns a Box3.
   */
  diagonal() {
    return this.p1.subtract(this.p0)
  }

  /**
   * Returns the center point of a Box3.
   *
   * @return {Vec3} - Returns a Vec3.
   */
  center() {
    const result = this.p1.subtract(this.p0);
    result.scaleInPlace(0.5);
    result.addInPlace(this.p0);
    return result
  }

  /**
   * Converts this Box3 to a Mat4 (a 4x4 matrix).
   *
   * @return {Mat4} - Returns a new Mat4.
   */
  toMat4() {
    const scx = this.p1.x - this.p0.x;
    const scy = this.p1.y - this.p0.y;
    const scz = this.p1.z - this.p0.z;
    return new Mat4(scx, 0, 0, 0, 0, scy, 0, 0, 0, 0, scz, 0, this.p0.x, this.p0.y, this.p0.z, 1.0)
  }

  /**
   * Calculates and returns the bounding Sphere of the Box3
   *
   * @return {SphereType} - The return value.
   */
  getBoundingSphere() {
    return new SphereType(this.center(), this.diagonal().length() * 0.5)
  }

  /**
   * Determines if this Box3 intersects a plane.
   *
   * @param {Box3} box - The box to check for intersection against.
   * @return {boolean} - The return value.
   */
  intersectsBox(box) {
    // Using 6 splitting planes to rule out intersections.
    return box.max.x < this.min.x ||
      box.min.x > this.max.x ||
      box.max.y < this.min.y ||
      box.min.y > this.max.y ||
      box.max.z < this.min.z ||
      box.min.z > this.max.z
      ? false
      : true
  }

  /**
   * Determines if this Box3 intersects a sphere.
   *
   * @param {Sphere} sphere - The sphere to check for intersection against.
   * @return {boolean} - The return value.
   */
  intersectsSphere(sphere) {
    // var closestPoint = new Vector3();

    // Find the point on the AABB closest to the sphere center.
    // this.clampPoint( sphere.center, closestPoint );

    // If that point is inside the sphere, the AABB and sphere intersect.
    return closestPoint.distanceToSquared(sphere.center) <= sphere.radius * sphere.radius
  }

  /**
   * Determines if this Box3 intersects a plane.
   *
   * @param {Plane} plane - The plane to check for intersection against.
   * @return {boolean} - The return value.
   */
  intersectsPlane(plane) {
    // We compute the minimum and maximum dot product values. If those values
    // are on the same side (back or front) of the plane, then there is no intersection.

    let min;
    let max;

    if (plane.normal.x > 0) {
      min = plane.normal.x * this.min.x;
      max = plane.normal.x * this.max.x;
    } else {
      min = plane.normal.x * this.max.x;
      max = plane.normal.x * this.min.x;
    }

    if (plane.normal.y > 0) {
      min += plane.normal.y * this.min.y;
      max += plane.normal.y * this.max.y;
    } else {
      min += plane.normal.y * this.max.y;
      max += plane.normal.y * this.min.y;
    }

    if (plane.normal.z > 0) {
      min += plane.normal.z * this.min.z;
      max += plane.normal.z * this.max.z;
    } else {
      min += plane.normal.z * this.max.z;
      max += plane.normal.z * this.min.z;
    }

    return min <= -plane.constant && max >= -plane.constant
  }

  /**
   * Clones this Box3 and returns a new Box3.
   * @return {Box3} - Returns a new Box3.
   */
  clone() {
    return new Box3$1(this.p0.clone(), this.p1.clone())
  }

  // ////////////////////////////////////////
  // Static Methods

  /**
   * Creates a new Box3.
   * @param {...object} ...args - The ...args param.
   * @return {Box3} - Returns a new Box3.
   * @private
   */
  static create(...args) {
    return new Box3$1(...args)
  }

  /**
   * The sizeInBytes method.
   * @return {any} - The return value.
   * @private
   */
  static sizeInBytes() {
    return 24
  }

  // ////////////////////////////////////////
  // Persistence

  /**
   * Encodes `Box3` Class as a JSON object for persistence.
   *
   * @return {object} - The json object.
   */
  toJSON() {
    return {
      p0: this.p0.toJSON(),
      p1: this.p1.toJSON(),
    }
  }

  /**
   * Decodes a JSON object to set the state of this class.
   *
   * @param {object} j - The json object.
   */
  fromJSON(j) {
    // We need to verify that p0 and p1 axes are numeric, so in case they are not, we restore them to their default values.
    // This, because 'Infinity' and '-Infinity' are stringified as 'null'.
    const p0 = {
      x: MathFunctions.isNumeric(j.p0.x) ? j.p0.x : Number.POSITIVE_INFINITY,
      y: MathFunctions.isNumeric(j.p0.y) ? j.p0.y : Number.POSITIVE_INFINITY,
      z: MathFunctions.isNumeric(j.p0.z) ? j.p0.z : Number.POSITIVE_INFINITY,
    };
    const p1 = {
      x: MathFunctions.isNumeric(j.p1.x) ? j.p1.x : Number.NEGATIVE_INFINITY,
      y: MathFunctions.isNumeric(j.p1.y) ? j.p1.y : Number.NEGATIVE_INFINITY,
      z: MathFunctions.isNumeric(j.p1.z) ? j.p1.z : Number.NEGATIVE_INFINITY,
    };
    this.p0.fromJSON(p0);
    this.p1.fromJSON(p1);
  }

  /**
   * The loadBin method.
   * @param {any} data - The data value.
   * @param {any} byteOffset - The byteOffset value.
   * @private
   */
  loadBin(data, byteOffset) {
    this.p0.loadBin(data, byteOffset);
    this.p0.loadBin(data, byteOffset + 12);
  }

  /**
   * The setFromFloat32Array method.
   * @param {Float32Array} float32array - The float32array value.
   * @private
   */
  setFromFloat32Array(float32array) {
    this.p0 = new Vec3$1(float32array.buffer, float32array.byteOffset);
    this.p1 = new Vec3$1(float32array.buffer, float32array.byteOffset + 12);
  }

  /**
   * Calls `toJSON` method and stringifies it.
   *
   * @return {string} - The return value.
   */
  toString() {
    // eslint-disable-next-line new-cap
    return StringFunctions.stringifyJSONWithFixedPrecision(this.toJSON())
  }
}

Registry.register('Box3', Box3$1);

/* eslint-disable new-cap */

/**
 * Class representing a plane.
 *
 * @extends AttrValue
 */
class PlaneType extends AttrValue {
  /**
   * Create a plane.
   *
   * @param {Vec3} normal - The normal of the plane.
   * @param {number} w - The w value.
   */
  constructor(normal, w = 0) {
    super();
    if (normal instanceof Vec3$1) {
      this.normal = normal;
    } else {
      this.normal = new Vec3$1();
    }
    this.w = w;
  }

  /**
   * Setter from scalar components.
   *
   * @param {number} x - The x value.
   * @param {number} y - The y value.
   * @param {number} z - The z value.
   * @param {number} w - The w value.
   */
  set(x, y, z, w) {
    this.normal.set(x, y, z);
    this.w = w;
  }

  /**
   * Thet divideScalar method
   *
   * @param {number} value - The value value.
   */
  divideScalar(value) {
    this.normal.scaleInPlace(1 / value);
    this.w /= value;
  }

  /**
   * Calculates the distance from a point to this place.
   *
   * @param {Vec3} point - The point value.
   * @return {number} - The rreturn value.
   */
  distanceToPoint(point) {
    return point.dot(this.normal) + this.w
  }

  /**
   * Normalize this plane in place modifying its values.
   */
  normalizeInPlace() {
    const inverseNormalLength = 1.0 / this.normal.length();
    this.normal.scaleInPlace(inverseNormalLength);
    this.w *= inverseNormalLength;
  }

  /**
   * Clones this plane and returns a new plane.
   *
   * @return {Plane} - Returns a new plane.
   */
  clone() {
    return new Plane(this.normal.clone(), this.w)
  }

  // ////////////////////////////////////////
  // Static Methods

  /**
   * Creates a new plane.
   * @param {...object} ...args - The ...args param.
   * @return {Plane} - Returns a new plane.
   * @private
   */
  static create(...args) {
    return new Plane(...args)
  }

  // ///////////////////////////
  // Persistence

  /**
   * The toJSON method encodes this type as a json object for persistences.
   *
   * @return {object} - The json object.
   */
  toJSON() {
    return {
      normal: this.normal.toJSON(),
      w: this.w,
    }
  }

  /**
   * Calls `toJSON` method and stringifies it.
   *
   * @return {string} - The return value.
   */
  toString() {
    return StringFunctions.stringifyJSONWithFixedPrecision(this.toJSON())
  }
}

Registry.register('PlaneType', PlaneType);

/* eslint-disable new-cap */

/**
 * Class representing a Frustum. Frustums are used to determine what
 * is inside the camera's field of view.
 * @private
 * */
class Frustum {
  /**
   * Create a Frustum
   * @param {PlaneType} p0 - the p0 value.
   * @param {PlaneType} p1 - the p1 value.
   * @param {PlaneType} p2 - the p2 value.
   * @param {PlaneType} p3 - the p3 value.
   * @param {PlaneType} p4 - the p4 value.
   * @param {PlaneType} p5 - the p5 value.
   */
  constructor(p0, p1, p2, p3, p4, p5) {
    this.planes = [
      p0 || new PlaneType(),
      p1 || new PlaneType(),
      p2 || new PlaneType(),
      p3 || new PlaneType(),
      p4 || new PlaneType(),
      p5 || new PlaneType(),
    ];
  }

  /**
   * The setFromMatrix configures a Frustum object using a matrix.
   * Typically the matrix is a model view projection matrix.
   * @param {Mat4} mat4 - The matrix to use.
   */
  setFromMatrix(mat4) {
    const m = mat4;
    const planes = this.planes;
    planes[0].set(m.m03 - m.m00, m.m13 - m.m10, m.m23 - m.m20, m.m33 - m.m30);
    planes[1].set(m.m03 + m.m00, m.m13 + m.m10, m.m23 + m.m20, m.m33 + m.m30);
    planes[2].set(m.m03 + m.m01, m.m13 + m.m11, m.m23 + m.m21, m.m33 + m.m31);
    planes[3].set(m.m03 - m.m01, m.m13 - m.m11, m.m23 - m.m21, m.m33 - m.m31);
    planes[4].set(m.m03 - m.m02, m.m13 - m.m12, m.m23 - m.m22, m.m33 - m.m32);
    planes[5].set(m.m03 + m.m02, m.m13 + m.m12, m.m23 + m.m22, m.m33 + m.m32);

    planes.forEach((plane) => plane.normalizeInPlace());
  }

  /**
   * Tests a box to see if it is entirely within the frustum.
   * @param {Box3} box3 - The box to test.
   * @return {boolean} - True if the frustum intersects the box.
   */
  intersectsBox(box3) {
    const p = new Vec3$1();
    const planes = this.planes;
    const { min, max } = box3;

    for (let i = 0; i < 6; i++) {
      const plane = planes[i];

      // corner at max distance
      p.x = plane.normal.x > 0 ? max.x : min.x;
      p.y = plane.normal.y > 0 ? max.y : min.y;
      p.z = plane.normal.z > 0 ? max.z : min.z;

      if (plane.distanceToPoint(p) < 0) return false
    }
    return true
  }

  // ////////////////////////////////////////
  // Persistence

  /**
   * The toJSON method encodes this type as a json object for persistences.
   *
   * @return {object} - The json object.
   */
  toJSON() {
    return {
      p0: this.p0.toJSON(),
      p1: this.p1.toJSON(),
      p2: this.p2.toJSON(),
      p3: this.p3.toJSON(),
      p4: this.p4.toJSON(),
      p5: this.p5.toJSON(),
    }
  }

  /**
   * The fromJSON method decodes a json object for this type.
   *
   * @param {object} j - The json object.
   */
  fromJSON(j) {
    this.p0.fromJSON(j.p0);
    this.p1.fromJSON(j.p1);
    this.p2.fromJSON(j.p2);
    this.p3.fromJSON(j.p3);
    this.p4.fromJSON(j.p4);
    this.p5.fromJSON(j.p5);
  }

  /**
   * Calls `toJSON` method and stringifies it.
   *
   * @return {string} - The return value.
   */
  toString() {
    return StringFunctions.stringifyJSONWithFixedPrecision(this.toJSON())
  }
}

Registry.register('Frustum', Frustum);

var Math$1 = /*#__PURE__*/Object.freeze({
  __proto__: null,
  AttrValue: AttrValue,
  Vec2: Vec2,
  Vec3: Vec3$1,
  Vec4: Vec4$1,
  RGBA: RGBA,
  Color: Color,
  EulerAngles: EulerAngles,
  Quat: Quat,
  Ray: Ray,
  Mat3: Mat3$1,
  Mat4: Mat4,
  Xfo: Xfo,
  Box2: Box2,
  Box3: Box3$1,
  Frustum: Frustum,
  PlaneType: PlaneType,
  SphereType: SphereType
});

/**
 * Provides an interface for emitting events under given names, and registering listeners to those events.
 * This is a base class for most classes in the Scene Tree and Renderer, enabling observers to listen to changes throughout the system.
 * The interface exposed is similar to [EventEmitter](https://nodejs.org/api/events.html#events_class_eventemitter) in Node.
 *
 * Similar to how the DOM event system in the browser works, events are registered by name.
 * Example: Registering a listener for a custom event, and then emitting that event.
 * ```javascript
 *  const ee = new EventEmitter()
 *
 *  ee.on('myEvent', (event) => {
 *    console.log('My Event was emitted:', event)
 *  })
 *
 *  ee.emit('myEvent', { data: 42 })
 * ```
 *
 *
 */
class EventEmitter {
  /**
   * Initializes an empty `listeners` map that will host all the events,
   * which implies that it doesn't allow multiple events with the same name.
   * <br>
   */
  constructor() {
    this.listeners = {};
  }

  /**
   * Adds a listener function for a given event name.
   *
   * @param {string} eventName - The name of the event.
   * @param {function} listener - The listener function(callback).
   * @return {number} - Id to reference the listener.
   */
  on(eventName, listener) {
    if (!listener) {
      throw new Error('Missing callback function (listener).')
    }

    if (!this.listeners[eventName]) {
      this.listeners[eventName] = [];
    }

    const listeners = this.listeners[eventName];

    if (listeners.indexOf(listener) != -1) {
      throw new Error(`Listener "${listener.name}" already connected to event "${eventName}".`)
    }

    // TODO: Deprecate alongside #addListener.
    const id = listeners.length;
    listeners[id] = listener;

    return id
  }

  /**
   * Similar to the `on` method with the difference that when the event is triggered,
   * it is automatically unregistered meaning that the event listener will be triggered at most one time.
   *
   * Useful for events that we expect to trigger one time, such as when assets load.
   * ```javascript
   * const asset = new Asset();
   * asset.once('loaded', () => {
   *   console.log("Yay! the asset is loaded")
   * })
   * ```
   *
   */
  once(eventName, listener) {
    const cb = (event) => {
      listener(event);
      this.off(eventName, cb);
    };

    this.on(eventName, cb);
  }

  /**
   * Removes a listener function from the specified event, using either the function or the index id. Depends on what is passed in.
   *
   * @param {string} eventName - The name of the event.
   * @param {function|number} listener - The listener function or the id number.
   */
  off(eventName, listener) {
    if (!listener) {
      throw new Error('Missing callback function (listener).')
    }

    if (typeof listener == 'number') {
      console.warn('Deprecated. Un-register using the original listener instead.');
      this.removeListenerById(eventName, listener);
      return
    }

    const listeners = this.listeners[eventName] || [];

    const ids = [];

    listeners.forEach((e, i) => {
      if (e === listener) {
        ids.push(i);
      }
    });

    if (ids.length == 0) {
      throw new Error(`Listener "${listener.name}" is not connected to "${eventName}" event`)
    } else {
      for (const id of ids) {
        listeners[id] = undefined;
      }
    }
  }

  /**
   * @deprecated Use #on instead.
   *
   * @param {string} eventName - The name of the event.
   * @param {function} listener - The listener function(callback).
   * @return {number} - Id to reference the listener.
   */
  addListener(eventName, listener) {
    console.warn('Deprecated. Use #on instead.');

    return this.on(eventName, listener)
  }

  /**
   * @deprecated Use #off instead.
   *
   * @param {string} eventName - The name of the event.
   * @param {function} listener - The listener function.
   */
  removeListener(eventName, listener) {
    console.warn('Deprecated. Use #off instead.');

    this.off(eventName, listener);
  }

  /**
   * @deprecated Use #off, passing the listener itself instead of the id.
   *
   * @param {string} eventName - The name of the event.
   * @param {number} id - The id returned by addListener
   */
  removeListenerById(eventName, id) {
    console.warn('Deprecated. Use #off, passing the listener itself instead of the id.');

    const listeners = this.listeners[eventName];

    if (!listeners) {
      console.warn('callback :' + id + ' was not connected to this signal:' + eventName);
      return
    }

    if (!listeners[id]) throw new Error('Invalid ID')

    listeners[id] = undefined;
  }

  /**
   * Triggers all listener functions in an event.
   *
   * @param {string} eventName - The name of the event.
   * @param {object|string|any} event - The data you want to pass down to all listener functions as parameter.
   */
  emit(eventName, event) {
    const listeners = this.listeners[eventName] || [];

    listeners.forEach((fn) => {
      // Skip disconnected listeners.
      if (fn) {
        fn(event);
      }
    });
  }
}

// Taken from here: https://github.com/jakesgordon/bin-packing/blob/master/js/packer.growing.js

/******************************************************************************

This is a binary tree based bin packing algorithm that is more complex than
the simple Packer (packer.js). Instead of starting off with a fixed width and
height, it starts with the width and height of the first block passed and then
grows as necessary to accomodate each subsequent block. As it grows it attempts
to maintain a roughly square ratio by making 'smart' choices about whether to
grow right or down.

When growing, the algorithm can only grow to the right OR down. Therefore, if
the new block is BOTH wider and taller than the current target then it will be
rejected. This makes it very important to initialize with a sensible starting
width and height. If you are providing sorted input (largest first) then this
will not be an issue.

A potential way to solve this limitation would be to allow growth in BOTH
directions at once, but this requires maintaining a more complex tree
with 3 children (down, right and center) and that complexity can be avoided
by simply chosing a sensible starting block.

Best results occur when the input blocks are sorted by height, or even better
when sorted by max(width,height).

Inputs:
------

  blocks: array of any objects that have .w and .h attributes

Outputs:
-------

  marks each block that fits with a .fit attribute pointing to a
  node with .x and .y coordinates

Example:
-------

  var blocks = [
    { w: 100, h: 100 },
    { w: 100, h: 100 },
    { w:  80, h:  80 },
    { w:  80, h:  80 },
    etc
    etc
  ];

  var packer = new GrowingPacker();
  packer.fit(blocks);

  for(var n = 0 ; n < blocks.length ; n++) {
    var block = blocks[n];
    if (block.fit) {
      Draw(block.fit.x, block.fit.y, block.w, block.h);
    }
  }


******************************************************************************/

class GrowingPacker extends EventEmitter {
  constructor(w = 0, h = 0) {
    super();
    this.root = {
      x: 0,
      y: 0,
      w: w,
      h: h,
    };
  }

  fit(blocks) {
    const len = blocks.length;
    if (len == 0) return
    let resized = false;
    if (this.root.w < blocks[0].w) {
      this.root.w = blocks[0].w;
      resized = true;
    }
    if (this.root.h < blocks[0].h) {
      this.root.h = blocks[0].h;
      resized = true;
    }
    if (resized) {
      this.emit('resized', { width: this.root.w, height: this.root.h });
    }
    const eachBlock = (block) => {
      block.fit = this.__addBlock(block);
    };
    blocks.forEach(eachBlock);
  }

  __addBlock(block) {
    const node = this.findNode(this.root, block.w, block.h);
    if (node) return this.splitNode(node, block.w, block.h)
    else return this.growNode(block.w, block.h)
  }

  addBlock(block) {
    let resized = false;
    if (this.root.w < block.w) {
      this.root.w = block.w;
      resized = true;
    }
    if (this.root.h < block.h) {
      this.root.h = block.h;
      resized = true;
    }
    if (resized) {
      this.emit('resized', { width: this.root.w, height: this.root.h });
    }
    const node = this.findNode(this.root, block.w, block.h);
    if (node) return this.splitNode(node, block.w, block.h)
    else return this.growNode(block.w, block.h)
  }

  findNode(root, w, h) {
    if (root.used) return this.findNode(root.right, w, h) || this.findNode(root.down, w, h)
    else if (w <= root.w && h <= root.h) return root
    else return null
  }

  splitNode(node, w, h) {
    node.used = true;
    node.down = {
      x: node.x,
      y: node.y + h,
      w: node.w,
      h: node.h - h,
    };
    node.right = {
      x: node.x + w,
      y: node.y,
      w: node.w - w,
      h: h,
    };
    return node
  }

  growNode(w, h) {
    const canGrowDown = w <= this.root.w;
    const canGrowRight = h <= this.root.h;

    const shouldGrowRight = canGrowRight && this.root.h >= this.root.w + w; // attempt to keep square-ish by growing right when height is much greater than width
    const shouldGrowDown = canGrowDown && this.root.w >= this.root.h + h; // attempt to keep square-ish by growing down  when width  is much greater than height

    if (shouldGrowRight) return this.growRight(w, h)
    else if (shouldGrowDown) return this.growDown(w, h)
    else if (canGrowRight) return this.growRight(w, h)
    else if (canGrowDown) return this.growDown(w, h)
    else return null // need to ensure sensible root starting size to avoid this happening
  }

  growRight(w, h) {
    this.root = {
      used: true,
      x: 0,
      y: 0,
      w: this.root.w + w,
      h: this.root.h,
      down: this.root,
      right: {
        x: this.root.w,
        y: 0,
        w: w,
        h: this.root.h,
      },
    };
    const node = this.findNode(this.root, w, h);
    let res;
    if (node) res = this.splitNode(node, w, h);
    this.emit('resized', { width: this.root.w, height: this.root.h });
    return res
  }

  growDown(w, h) {
    this.root = {
      used: true,
      x: 0,
      y: 0,
      w: this.root.w,
      h: this.root.h + h,
      down: {
        x: 0,
        y: this.root.h,
        w: this.root.w,
        h: h,
      },
      right: this.root,
    };
    const node = this.findNode(this.root, w, h);
    let res;
    if (node) res = this.splitNode(node, w, h);
    this.emit('resized', { width: this.root.w, height: this.root.h });
    return res
  }
}

/* eslint-disable require-jsdoc */

// Note: this class will be deprecated soon.
// Please avoid using it in your code.
class Async extends EventEmitter {
  constructor(asyncCount = 0) {
    super();
    this.__asyncCount = asyncCount;
    this.ready = false;

    this.incAsyncCount = (count = 1) => {
      this.__asyncCount += count;
      this.ready = false;
    };

    this.decAsyncCount = () => {
      if (this.__asyncCount > 0) {
        this.__asyncCount--;
        if (this.__asyncCount == 0) {
          this.__asyncsCompleted();
        }
      }
    };

    this.__asyncsCompleted = () => {
      this.emit('ready', {});
    };
  }

  get count() {
    return this.__asyncCount
  }
}

const decodeText = (chars) => {
  if (window.TextDecoder) return new TextDecoder('utf-8').decode(chars)
  else {
    let result = '';
    for (let i = 0; i < chars.length; i++) result += String.fromCharCode(chars[i]);
    return result
  }
};

var Utilities = /*#__PURE__*/Object.freeze({
  __proto__: null,
  GrowingPacker: GrowingPacker,
  Async: Async,
  EventEmitter: EventEmitter,
  decodeText: decodeText,
  StringFunctions: StringFunctions,
  UInt8: UInt8,
  SInt8: SInt8,
  SInt16: SInt16,
  UInt16: UInt16,
  SInt32: SInt32,
  UInt32: UInt32,
  Float32: Float32,
  MathFunctions: MathFunctions
});

let counter = 0;

/** Class representing a ref counted object. RefCounted
 *  objects track ownership and allow explicit cleanup
 *  of resources. This is necessary when JavaScript
 *  objects own references to GPU resources that need to
 *  be cleaned up when the JavaScript object is destroyed.
 * @private
 */
class RefCounted extends EventEmitter {
  /**
   * Create a ref counted object.
   */
  constructor() {
    super();
    if (this.constructor.name == 'RefCounted') {
      throw new Error('RefCounted should not be instantiated directly.')
    }
    this.__id = ++counter;
    this.__refs = [];
    this.__destroyed = false;
  }

  /**
   * Returns the unique id of the object. Every Object has a unique
   * identifier which is based on a counter that is incremented.
   * @return {any} - The return value.
   */
  getId() {
    return this.__id
  }

  /**
   * The numRefs method.
   * @return {number} - The return value.
   */
  numRefs() {
    return this.__refs.length
  }

  /**
   * The addRef method.
   * @param {any} referer - The referer value.
   * @return {boolean} - The return value.
   */
  addRef(referer) {
    if (!referer) throw new Error('Error in RefCounted.addRef: Must provide a referer')

    // Note: an object can be reffeed multiple times.
    // e.g. we can create a temporary ref while we re-attach a tree item to a new parent.
    this.__refs.push(referer);
    return true
  }

  /**
   * The removeRef method.
   * @param {any} referer - The referer value.
   */
  removeRef(referer) {
    if (!referer) throw new Error('Error in RefCounted.removeRef: Must provide a referer')
    const index = this.__refs.indexOf(referer);
    if (index == -1) throw new Error('Error in RefCounted.removeRef: referer not found in refs list.')

    this.__refs.splice(index, 1);
    if (this.__refs.length == 0) {
      this.destroy();
    }
  }

  /**
   * The getRefer method.
   * @param {number} index - The index value.
   * @return {any} - The return value.
   */
  getRefer(index) {
    return this.__refs[index]
  }

  /**
   * The getRefIndex method.
   * @param {any} referer - The referer value.
   * @return {any} - The return value.
   */
  getRefIndex(referer) {
    return this.__refs.indexOf(referer)
  }

  /**
   * Returns true if this object has already been destroyed.
   * @return {boolean} - Returns true or false.
   */
  isDestroyed() {
    return this.__destroyed
  }

  /**
   * The destroy method is invoked when the last owner
   * is removed from a RefCounted object. Derived objects can
   * override this method to perform explicit cleanup.
   * The destructing signal is triggered so observers can
   * respond to this objects destruction.
   */
  destroy() {
    this.__destroyed = true;
    // console.log(this.constructor.name + " destructing");
    this.emit('destructing', {});
  }
}

/* eslint-disable guard-for-in */

// Explicit import of files to avoid importing all the parameter types.
// Note: Soon these imports should be removed, once all code avoids calling
// 'addParameter' without the parameter instance.

let counter$1 = 0;

/**
 * Class that allows other classes to be parameterized by `Parameter` type of objects.
 * Not only hosting parameters, but their events.
 *
 * @extends {EventEmitter}
 */
class ParameterOwner extends EventEmitter {
  /**
   * Creates an instance of ParameterOwner by initializing parameter hosting mappings and events.
   * <br>
   * Every Object has a unique identifier which is based on a counter that is incremented.
   */
  constructor() {
    super();
    this.__id = ++counter$1;

    this.__params = [];
    this.__paramMapping = {};
    this.__paramEventHandlers = {};
  }

  /**
   * Returns the unique id of the object.
   * @private
   * @return {number} - The Id of the ParameterOwner object.
   */
  getId() {
    return this.__id
  }

  // --- Params ---

  /**
   * @deprecated
   * Returns the number of parameters current object has.
   *
   * @return {number} - Amount of parameters in current object.
   */
  numParameters() {
    console.warn('Deprecated. Use #getNumParameters instead.');
    return this.getNumParameters()
  }

  /**
   * Returns the number of parameters current object has.
   *
   * @return {number} - Amount of parameters in current object.
   */
  getNumParameters() {
    return this.__params.length
  }

  /**
   * Returns all the parameters of the object.
   *
   * @return {array} - Parameter List
   */
  getParameters() {
    return this.__params
  }

  /**
   * Returns the index of a parameter in parameter list.
   *
   * @param {string} paramName - Name of the parameter.
   * @return {number} - Position in the array
   */
  getParameterIndex(paramName) {
    return this.__paramMapping[paramName]
  }

  /**
   * Returns `Parameter` object in a given index
   *
   * @param {number} index - Position of the parameter in the array
   * @return {Parameter} - Parameter object value
   */
  getParameterByIndex(index) {
    return this.__params[index]
  }

  /**
   * Validates if the specified parameter exists in the object.
   *
   * @param {string} paramName - The parameter name.
   * @return {boolean} - The return value.
   */
  hasParameter(paramName) {
    return paramName in this.__paramMapping
  }

  /**
   * Returns `Parameter` object using the given name
   *
   * @param {string} paramName - The parameter name.
   * @return {Parameter} - Parameter object value
   */
  getParameter(paramName) {
    const index = this.__paramMapping[paramName];
    if (index == -1) return null
    return this.__params[index]
  }

  /**
   * This method can be overridden in derived classes
   * to perform general updates (see GLPass or BaseItem).
   * @param {object} event - The event object emitted by the parameter.
   * @private
   */
  __parameterValueChanged(event) {
    this.emit('parameterValueChanged', event);
  }

  /**
   * Adds `Parameter` object to the owner's parameter list.
   *
   * @emits `parameterAdded` with the name of the param.
   * @param {Parameter} param - The parameter to add.
   * @return {Parameter} - With `owner` and `valueChanged` event set.
   */
  addParameter(param) {
    return this.insertParameter(param, this.__params.length)
  }

  /**
   * Adds `Parameter` object to the owner's parameter list using the index.
   * It replaces the event in the specified index.
   *
   *
   * @emits `parameterAdded` with the name of the param.
   * @param {Parameter} param - The parameter to insert.
   * @param {number} index - The index value.
   * @return {Parameter} - With `owner` and `valueChanged` event set.
   */
  insertParameter(param, index) {
    const name = param.getName();
    if (this.__paramMapping[name] != undefined) {
      console.warn('Replacing Parameter:' + name);
      this.removeParameter(name);
    }
    param.setOwner(this);
    const paramChangedHandler = (event) => this.__parameterValueChanged({ ...event, param });
    param.on('valueChanged', paramChangedHandler);
    this.__paramEventHandlers[name] = paramChangedHandler;
    this.__params.splice(index, 0, param);

    for (let i = index; i < this.__params.length; i++) {
      this.__paramMapping[this.__params[i].getName()] = i;
    }
    this.emit('parameterAdded', { name });
    return param
  }

  /**
   * Removes `Parameter` from owner, by using parameter's name.
   * @emits `parameterRemoved` with the name of the param.
   * @param {string} name - The parameter name.
   */
  removeParameter(name) {
    if (this.__paramMapping[name] == undefined) {
      throw new Error('Unable to remove Parameter:' + name)
    }
    const index = this.__paramMapping[name];
    const param = this.__params[this.__paramMapping[name]];

    param.off('valueChanged', this.__paramEventHandlers[name]);
    this.__params.splice(index, 1);

    delete this.__paramMapping[name];
    for (let i = index; i < this.__params.length; i++) {
      this.__paramMapping[this.__params[i].getName()] = i;
    }

    this.emit('parameterRemoved', { name });
  }

  /**
   * Replaces old `Parameter` by passing a new one with the same name.
   *
   * @param {Parameter} param - The parameter to replace.
   * @return {Parameter} - `Parameter` with `valueChanged` event set.
   */
  replaceParameter(param) {
    const name = param.getName();
    if (this.__paramMapping[name] == undefined) {
      throw new Error('Unable to replace Parameter:' + paramName)
    }
    const index = this.__paramMapping[name];
    this.removeParameter(name);
    this.insertParameter(param, index);
    return param
  }

  // ////////////////////////////////////////
  // Persistence

  /**
   * The toJSON method encodes this type as a json object for persistence.
   *
   * @param {object} context - The context value.
   * @return {object} - Returns the json object.
   */
  toJSON(context) {
    const json = {};
    const paramsJSON = {};
    let savedParams = 0;
    for (const param of this.__params) {
      const paramJSON = param.toJSON(context);
      if (paramJSON) {
        paramsJSON[param.getName()] = paramJSON;
        savedParams++;
      }
    }
    if (savedParams > 0) json.params = paramsJSON;
    return json
  }

  /**
   * The fromJSON method decodes a json object for this type.
   *
   * @param {object} j - The json object this item must decode.
   * @param {object} context - The context value.
   */
  fromJSON(j, context) {
    if (j.params) {
      for (const key in j.params) {
        const pj = j.params[key];
        const param = this.getParameter(key);
        if (!param) console.warn('Param not found:' + key);
        else {
          if (pj.paramPath) {
            context.resolvePath(
              pj.paramPath,
              (param) => {
                this.replaceParameter(param);
              },
              (reason) => {
                console.warn('Unable to resolve shared parameter:' + pj.paramPath);
              }
            );
          } else {
            param.fromJSON(pj, context);
          }
        }
      }
    }
  }

  /**
   * Uses passed in BinReader object(containing an Int32 array with all the parameters) to reconstruct all parameters state.
   * <br>
   * In each iteration of the array, propType and propName are extracted and
   * used to build the right `Parameter` class. Then all of them are added to the object.
   *
   * @emits `parameterAdded` with the name of the param.
   * @param {BinReader} reader - The reader value.
   * @param {object} context - The context value.
   */
  readBinary(reader, context) {
    // TODO: make this work

    if (context.versions['zea-engine'].compare([0, 0, 3]) >= 0) {
      const numProps = reader.loadUInt32();
      for (let i = 0; i < numProps; i++) {
        const propType = reader.loadStr();
        const propName = reader.loadStr();
        let param = this.getParameter(propName);
        if (!param) {
          param = Registry.constructClass(propType, propName);
          if (!param) {
            console.error('Unable to construct prop:' + propName + ' of type:' + propType);
            continue
          }
          this.addParameter(param);
        }
        param.readBinary(reader, context);
      }
    }
  }

  /**
   * Converts object's JSON value and converts it to a string.
   *
   * @return {string} - String of object's parameter list state.
   */
  toString() {
    return JSON.stringify(this.toJSON(), null, 2)
  }

  // ////////////////////////////////////////
  // Clone and Destroy

  /**
   * Copies Parameters from another `ParameterOwner` to current object.
   *
   * @param {ParameterOwner} src - The ParameterOwner copy from.
   */
  copyFrom(src) {
    // Note: Loop over the parameters in reverse order,
    // this is because often, parameter dependencies
    // are bottom to top (bottom params dependent on higher params).
    // This means that as a parameter is set with a new value
    // it will dirty the params below it.
    let i = src.getNumParameters();
    while (i--) {
      const srcParam = src.getParameterByIndex(i);
      const param = this.getParameter(srcParam.getName());
      if (param) {
        // Note: we are not cloning the values.
        param.loadValue(srcParam.getValue());
      } else {
        this.addParameter(srcParam.clone());
      }
    }
  }
}

/* eslint-disable no-unused-vars */

/**
 * Reads binary data in a specific encoding. Used in loading binary data such as zcad files.
 */
class BinReader {
  /**
   * Create a bin reader.
   *
   * @param {Buffer} data - The data buffer.
   * @param {number} byteOffset - The byte offset value to start reading the buffer.
   * @param {boolean} isMobileDevice - The isMobileDevice value.
   */
  constructor(data, byteOffset = 0, isMobileDevice = true) {
    this.__data = data;
    this.__byteOffset = byteOffset;
    this.__dataView = new DataView(this.__data);
    this.__isMobileDevice = isMobileDevice;
    this.utf8decoder = new TextDecoder();
  }

  /**
   * Returns state of whether or not the `BinReader` object was instanciated from a mobile device.
   *
   * @return {Boolean} - Returns true is a mobile device is detected.
   */
  get isMobileDevice() {
    return this.__isMobileDevice
  }

  /**
   * Returns the data buffer we're reading from.
   *
   * @return {Buffer} - The data buffer we are reading from,
   */
  get data() {
    return this.__data
  }

  /**
   * Returns the length of the buffer.
   *
   * @return {number} - The total length of the buffer
   */
  get byteLength() {
    return this.__dataView.byteLength
  }

  /**
   * Returns remaining length of the buffer to read.
   *
   * @return {number} - The reemaining length of the buffer to read.
   */
  get remainingByteLength() {
    return this.__dataView.byteLength - this.__byteOffset
  }

  /**
   * Returns current byte offset in the buffer.
   * @return {number} - The current offset in the binary buffer
   */
  pos() {
    return this.__byteOffset
  }

  /**
   * Sets the byte offset value.
   * @param {number} byteOffset - The byteOffset param.
   */
  seek(byteOffset) {
    this.__byteOffset = byteOffset;
  }

  /**
   * Adds offset bytes to current offset value.
   *
   * @param {number} byteOffset - The byte Offset amount.
   */
  advance(byteOffset) {
    this.__byteOffset += byteOffset;
  }

  /**
   * Returns the unsigned Uint8 value at current byte offset position,
   * and adds one byte to the offset.
   *
   * @return {number} - The return value.
   */
  loadUInt8() {
    const result = this.__dataView.getUint8(this.__byteOffset);
    this.__byteOffset += 1;
    return result
  }

  /**
   * Returns the unsigned Uint16 value at current byte offset position,
   * and adds two bytes to the offset.
   *
   * @return {number} - The return value.
   */
  loadUInt16() {
    const result = this.__dataView.getUint16(this.__byteOffset, true);
    this.__byteOffset += 2;
    return result
  }

  /**
   * Returns the unsigned Uint32 value at current byte offset position,
   * and adds four bytes to the offset.
   *
   * @return {number} - The return value.
   */
  loadUInt32() {
    const result = this.__dataView.getUint32(this.__byteOffset, true);
    this.__byteOffset += 4;
    return result
  }

  /**
   * Returns the signed Int32 value at current byte offset position,
   * and adds four bytes to the offset.
   *
   * @return {number} - The return value.
   */
  loadSInt32() {
    const result = this.__dataView.getInt32(this.__byteOffset, true);
    this.__byteOffset += 4;
    return result
  }

  /**
   * Returns the Float16 value at current byte offset position,
   * and adds four bytes to the offset.
   *
   * @return {number} - The return value.
   */
  loadFloat16() {
    const uint16 = this.loadUInt16();
    return MathFunctions.decode16BitFloat(uint16)
  }

  /**
   * Returns the Float16 value at current byte offset position,
   * and adds two bytes to the offset.
   *
   * @return {number} - The return value.
   */
  loadUFloat16() {
    const result = this.loadFloat16();
    if (result < 0.0) {
      return 2048.0 - result // Note: subtract a negative number to add it.
    } else {
      return result
    }
  }

  /**
   * Returns a single signed Float16 value at current byte offset position from 2 unsigned Int8 values,
   * and adds two bytes to the offset.
   *
   * @return {number} - The return value.
   */
  loadFloat16From2xUInt8() {
    const result = this.__dataView.getFloat16(this.__byteOffset, true);
    // const uint8s = this.loadUInt8Array(2);
    // return Math.decode16BitFloat(uint8s);
    this.__byteOffset += 2;
    return result
  }

  /**
   * Loads and returns a single Signed integer value from 2 Unsigned Float16 values.
   * @return {number} - The return value.
   */
  loadUInt32From2xUFloat16() {
    const partA = this.loadUFloat16();
    const partB = this.loadUFloat16();
    return partA + partB * 4096
  }

  /**
   * Loads and returns a single Signed integer value from 2 signed Float16 values.
   * @return {number} - The return value.
   */
  loadSInt32From2xFloat16() {
    const partA = this.loadFloat16();
    const partB = this.loadFloat16();
    return partA + partB * 2048
  }

  /**
   * Returns the Float32 value at current byte offset position,
   * and adds four bytes to the offset.
   *
   * @return {number} - The return value.
   */
  loadFloat32() {
    const result = this.__dataView.getFloat32(this.__byteOffset, true);
    this.__byteOffset += 4;
    return result
  }

  /**
   * Reads buffer and return an unsinged Int8 array with the specified size,
   * starting from current byte offset.<br>
   * Byte offset is increased by the specified byte size.
   *
   * @param {number} size - The size param.
   * @param {boolean} clone - The clone param.
   * @return {Uint8Array} - The return value.
   */
  loadUInt8Array(size = undefined, clone = false) {
    if (size == undefined) size = this.loadUInt32();
    const result = new Uint8Array(this.__data, this.__byteOffset, size);
    this.__byteOffset += size;
    const padd = this.__byteOffset % 4;
    // this.readPadd();
    return result
  }

  /**
   * Reads buffer and return an unsinged Int16 array with the specified size,
   * starting from current byte offset.<br>
   * Byte offset is increased by the specified byte size x 2.
   *
   * @param {number} size - The size param.
   * @param {boolean} clone - The clone param.
   * @return {Uint16Array} - The return value.
   */
  loadUInt16Array(size = undefined, clone = false) {
    if (size == undefined) size = this.loadUInt32();
    if (size == 0) return new Uint16Array()
    this.readPadd(2);
    let result;
    if (this.__isMobileDevice) {
      result = new Uint16Array(size);
      for (let i = 0; i < size; i++) {
        result[i] = this.__dataView.getUint16(this.__byteOffset, true);
        this.__byteOffset += 2;
      }
    } else {
      result = new Uint16Array(this.__data, this.__byteOffset, size);
      this.__byteOffset += size * 2;
    }
    // this.readPadd();
    return result
  }

  /**
   * Reads buffer and return an unsinged Int32 array with the specified size,
   * starting from current byte offset.<br>
   * Byte offset is increased by the specified byte size x 4.
   *
   * @param {number} size - The size param.
   * @param {boolean} clone - The clone param.
   * @return {Uint32Array} - The return value.
   */
  loadUInt32Array(size = undefined, clone = false) {
    if (size == undefined) size = this.loadUInt32();
    if (size == 0) return new Uint32Array()
    this.readPadd(4);
    let result;
    if (this.__isMobileDevice) {
      result = new Uint32Array(size);
      for (let i = 0; i < size; i++) {
        result[i] = this.__dataView.getUint32(this.__byteOffset, true);
        this.__byteOffset += 4;
      }
    } else {
      result = new Uint32Array(this.__data, this.__byteOffset, size);
      this.__byteOffset += size * 4;
    }
    return result
  }

  /**
   * Reads buffer and return a Float32 array with the specified size,
   * starting from current byte offset.<br>
   * Byte offset is increased by the specified byte size x 4.
   *
   * @param {number} size - The size param.
   * @param {boolean} clone - The clone param.
   * @return {Float32Array} - The return value.
   */
  loadFloat32Array(size = undefined, clone = false) {
    if (size == undefined) size = this.loadUInt32();
    if (size == 0) return new Float32Array()
    this.readPadd(4);
    let result;
    if (this.__isMobileDevice) {
      result = new Float32Array(size);
      for (let i = 0; i < size; i++) {
        result[i] = this.__dataView.getFloat32(this.__byteOffset, true);
        this.__byteOffset += 4;
      }
    } else {
      result = new Float32Array(this.__data, this.__byteOffset, size);
      this.__byteOffset += size * 4;
    }
    return result
  }

  /**
   * Returns next string.
   * First looks for the string length description in the next four bytes in the buffer(Starting from byte offset).
   *
   * @return {string} - The return value.
   */
  loadStr() {
    const numChars = this.loadUInt32();
    const chars = new Uint8Array(this.__data, this.__byteOffset, numChars);
    this.__byteOffset += numChars;
    return this.utf8decoder.decode(chars)
  }

  /**
   * Returns an array of strings.
   * First reading the size of the array then reading each string.
   *
   * @return {Array} - The return value.
   */
  loadStrArray() {
    const size = this.loadUInt32();
    const result = [];
    for (let i = 0; i < size; i++) {
      result[i] = this.loadStr();
    }
    return result
  }

  /**
   * Creates and returns a `Vec2` object with the next two signed Int32 values in the buffer.
   *
   * @return {Vec2} - Returns a Vec2.
   */
  loadSInt32Vec2() {
    const x = this.loadSInt32();
    const y = this.loadSInt32();
    return new Vec2(x, y)
  }

  /**
   * Creates and returns a `Vec2` object with the next two unsigned Int32 values in the buffer.
   * @return {Vec2} - Returns a Vec2.
   */
  loadUInt32Vec2() {
    const x = this.loadUInt32();
    const y = this.loadUInt32();
    return new Vec2(x, y)
  }

  /**
   * Creates and returns a `Vec2` object with the next two Float16 values in the buffer.
   *
   * @return {Vec2} - Returns a Vec2.
   */
  loadFloat16Vec2() {
    const x = this.loadFloat16();
    const y = this.loadFloat16();
    return new Vec2(x, y)
  }

  /**
   * Creates and returns a `Vec2` object with the next two Float32 values in the buffer.
   * @return {Vec2} - Returns a Vec2.
   */
  loadFloat32Vec2() {
    const x = this.loadFloat32();
    const y = this.loadFloat32();
    return new Vec2(x, y)
  }

  /**
   * Creates and returns a `Vec3` object with the next three Float16 values in the buffer.
   *
   * @return {Vec3} - Returns a Vec3.
   */
  loadFloat16Vec3() {
    const x = this.loadFloat16();
    const y = this.loadFloat16();
    const z = this.loadFloat16();
    return new Vec3$1(x, y, z)
  }

  /**
   * Creates and returns a `Vec3` object with the next three Float32 values in the buffer.
   *
   * @return {Vec3} - Returns a Vec3.
   */
  loadFloat32Vec3() {
    const x = this.loadFloat32();
    const y = this.loadFloat32();
    const z = this.loadFloat32();
    return new Vec3$1(x, y, z)
  }

  /**
   * Creates and returns a `Quat` object with the next four Float16 values in the buffer.
   *
   * @return {Quat} - Returns a Quat.
   */
  loadFloat16Quat() {
    const x = this.loadFloat16();
    const y = this.loadFloat16();
    const z = this.loadFloat16();
    const w = this.loadFloat16();
    return new Quat(x, y, z, w)
  }

  /**
   * Creates and returns a `Quat` object with the next four Float32 values in the buffer.
   * @return {Quat} - Returns a Quat.
   */
  loadFloat32Quat() {
    const x = this.loadFloat32();
    const y = this.loadFloat32();
    const z = this.loadFloat32();
    const w = this.loadFloat32();
    return new Quat(x, y, z, w)
  }

  /**
   * Creates and returns a `Color` object with the next three Float32 values in the buffer.
   *
   * @return {Color} - Returns a Color.
   */
  loadRGBFloat32Color() {
    const r = this.loadFloat32();
    const g = this.loadFloat32();
    const b = this.loadFloat32();
    return new Color(r, g, b)
  }

  /**
   * Creates and returns a RGBA `Color` object with the next four Float32 values in the buffer.
   * @return {Color} - Returns a Color.
   */
  loadRGBAFloat32Color() {
    const r = this.loadFloat32();
    const g = this.loadFloat32();
    const b = this.loadFloat32();
    const a = this.loadFloat32();
    return new Color(r, g, b, a)
  }

  /**
   * Creates and returns a `Color` object with the next three unsigned Int8 values in the buffer.
   * @return {Color} - Returns a Color.
   */
  loadRGBUInt8Color() {
    const r = this.loadUInt8();
    const g = this.loadUInt8();
    const b = this.loadUInt8();
    return new Color(r / 255, g / 255, b / 255)
  }

  /**
   * Creates and returns a RGBA `Color` object with the next four unsigned Int8 values in the buffer.
   * @return {Color} - Returns a Color.
   */
  loadRGBAUInt8Color() {
    const r = this.loadUInt8();
    const g = this.loadUInt8();
    const b = this.loadUInt8();
    const a = this.loadUInt8();
    return new Color(r / 255, g / 255, b / 255, a / 255)
  }

  /**
   * Creates and returns a `Box2` object with the next four Float32 values in the buffer.
   * Next four because it creates two Vec2.
   *
   * @return {Box2} - Returns a Box2.
   */
  loadBox2() {
    return new Box2(this.loadFloat32Vec2(), this.loadFloat32Vec2())
  }

  /**
   * Creates and returns a `Box2` object with the next six Float32 values in the buffer.
   * Next four because it creates two Vec3.
   *
   * @return {Box3} - Returns a Box3.
   */
  loadBox3() {
    return new Box3$1(this.loadFloat32Vec3(), this.loadFloat32Vec3())
  }

  /**
   * The readPadd method.
   * @param {number} stride - The stride param.
   */
  readPadd(stride) {
    const padd = this.__byteOffset % stride;
    if (padd != 0) this.__byteOffset += stride - padd;
  }
}

/* eslint-disable no-unused-vars */

let numBaseItems = 0;

/**
 * Base class for Items in the scene. It can be parameterized and can emit events.
 *
 * **Events**
 * * **nameChanged:** Emitted every time the Item's name is change. mostly in `setName` method.
 * * **selectedChanged:** Emitted `selected` status changes, mostly in `setSelected` method.
 *
 * @extends {ParameterOwner}
 */
class BaseItem extends ParameterOwner {
  /**
   * Create a base item by defining its name.
   *
   * @param {string} name - The name of the base item.
   */
  constructor(name) {
    super();
    this.__name = name ? name : '';
    this.__path = [this.__name];
    this.__ownerItem = undefined; // TODO: will create a circular ref. Figure out and use weak refs

    // Note: one day we will remove the concept of 'selection' from the engine
    // and keep it only in UX. to Select an item, we will add it to the selection
    // in the selection manager. Then the selection group will apply a highlight.
    this.__selectable = true;
    this.__selected = false;

    this.__metaData = {};

    numBaseItems++;
  }

  // ////////////////////////////////////////
  // Static Methods

  /**
   * The getNumBaseItems method returns the total number of base items created.
   * This method is used in debugging memory consumption.
   *
   * @return {number} - Returns the total number of base items created.
   */
  static getNumBaseItems() {
    return numBaseItems
  }

  // ////////////////////////////////////////
  // Name and Path

  /**
   * Returns the name of the base item.
   *
   * @return {string} - Returns the base item name.
   */
  getName() {
    return this.__name
  }

  /**
   * Sets the name of the base item(Updates path).
   *
   * @emits `nameChanged` with `newName` and `oldName` data.
   * @param {string} name - The base item name.
   */
  setName(name) {
    if (this.__name != name) {
      const oldName = this.__name;
      this.__name = name;
      this.__updatePath();
      this.emit('nameChanged', { newName: name, oldName });
    }
  }

  /**
   * When the name or the hierarchy changes, this method
   * recomputes and caches the path of this item.
   * @private
   */
  __updatePath() {
    if (this.__ownerItem == undefined) this.__path = [this.__name];
    else {
      this.__path = [...this.__ownerItem.getPath(), this.__name];
    }
  }

  /**
   * Returns the current path of the item in the tree as an array of names.
   *
   * @return {array} - Returns an array.
   */
  getPath() {
    return this.__path
  }

  // Path Traversal

  /**
   * The resolvePath method traverses the subtree from this item down
   * matching each name in the path with a child until it reaches the
   * end of the path.
   *
   * @param {array} path - The path value.
   * @param {number} index - The index value.
   * @return {BaseItem|Parameter} - The return value.
   */
  resolvePath(path, index = 0) {
    if (index == 0) {
      if (path[0] == '.' || path[0] == this.__name) index++;
    }
    if (index == path.length) {
      return this
    }
    if (path[index] == '>' && index == path.length - 1) {
      return this.getParameter(path[index + 1])
    }

    // Maybe the name is a parameter name.
    const param = this.getParameter(path[index]);
    if (param) {
      return param
    }
    throw new Error('Invalid path:' + path + '[' + index + '] member not found')
  }

  // ////////////////////////////////////////
  // Owner Item

  /**
   * The getOwner method returns the current owner of the item.
   * The item is a child of the current owner.
   *
   * @return {object} - Returns the current owner.
   */
  getOwner() {
    // return this.__private.get('ownerItem');
    return this.__ownerItem
  }

  /**
   * The setOwner method assigns a new owner to the item.
   *
   * @param {object} ownerItem - The new owner item.
   */
  setOwner(ownerItem) {
    // this.__private.set(ownerItem, ownerItem);
    if (this.__ownerItem !== ownerItem) {
      this.__ownerItem = ownerItem;
      this.__updatePath();
    }
  }

  // ////////////////////////////////////////
  // Selectability and Selection

  /**
   * Returns a boolean indicating if this item is selectable.
   *
   * @return {boolean} - Returns a boolean indicating if the item is selectable.
   */
  getSelectable() {
    return this.__selectable
  }

  /**
   * Modifies the selectability of this item.
   *
   * @param {boolean} val - A boolean indicating the selectability of the item.
   * @return {boolean} - Returns true if value changed.
   */
  setSelectable(val) {
    if (this.__selectable != val) {
      this.__selectable = val;
      return true
    }
    return false
  }

  /**
   * The isSelected method.
   * @deprecated
   * @see `getSelected` method
   * @return {boolean} - The return value.
   */
  isSelected() {
    return this.__selected
  }

  /**
   * Returns `true` if this item has been selected.
   *
   * @return {boolean} - The current selection state.
   */
  getSelected() {
    return this.__selected
  }

  /**
   * Changes the current state of the selection of this item.
   *
   * @emits `selectedChanged` with selected state
   * @param {boolean} sel - Boolean indicating the new selection state.
   */
  setSelected(sel) {
    this.__selected = sel;
    this.emit('selectedChanged', { selected: this.__selected });
  }

  // ////////////////////////////////////////
  // Metadata

  /**
   * Gets Item's meta-data value by passing the `key` string.
   *
   * @param {string} key - The key value under which to check for metadata.
   * @return {object|string|any} - Returns the metadata associated with the given key.
   */
  getMetadata(key) {
    return this.__metaData[key]
  }

  /**
   * Checks to see if there is metadata for a given key.
   *
   * @param {string} key - The key value under which to check for metadata.
   * @return {boolean} - Returns `true` if metadata exists under the given key, otherwise returns `false`.
   */
  hasMetadata(key) {
    return key in this.__metaData
  }

  /**
   * Assigns metadata to a given key.
   *
   * @param {string} key - The key value under which the metadata is is going to be saved.
   * @param {object} metaData - The metaData value.
   */
  setMetadata(key, metaData) {
    this.__metaData[key] = metaData;
  }

  /**
   * Removes metadata for a given key.
   *
   * @param {string} key - The key value.
   */
  deleteMetadata(key) {
    delete this.__metaData[key];
  }

  // ////////////////////////////////////////
  // Persistence

  /**
   * Encodes the current object as a json object.
   *
   * @param {object} context - The context value.
   * @return {object} - Returns the json object.
   */
  toJSON(context) {
    const j = super.toJSON(context);
    j.name = this.__name;
    j.type = Registry.getBlueprintName(this);
    return j
  }

  /**
   * Decodes a json object for this type.
   *
   * @param {object} j - The json object this item must decode.
   * @param {object} context - The context value.
   */
  fromJSON(j, context) {
    if (j.name) this.__name = j.name;
    super.fromJSON(j, context);
  }

  /**
   * Sets state of current Item(Including parameters) using a binary reader object.
   *
   * @param {BinReader} reader - The reader value.
   * @param {object} context - The context value.
   */
  readBinary(reader, context) {
    const type = reader.loadStr();
    this.setName(reader.loadStr());

    // Note: parameters follow name...
    super.readBinary(reader, context);
  }

  // ////////////////////////////////////////
  // Clone and Destroy

  /**
   * Clones this base item and returns a new base item.
   * <br>
   * **Note:** Each class should implement clone to be clonable.
   */
  clone() {
    throw new Error(this.constructor.name + ' does not implement its clone method')
  }

  /**
   * When a BaseItem is cloned, initially the constructor is
   * called to generate a new instance. This instance then copies
   * its values from the source using this method.
   * This method copies any relevant data from the source object to
   * ensure that it represents a valid clone.
   * Derived classes override this method to copy any relevant
   * data from the source object.
   *
   * @param {BaseItem} src - The BaseItem to copy from.
   */
  copyFrom(src) {
    super.copyFrom(src);
    this.setName(src.getName());
  }

  /**
   * The destroy is called by the system to cause explicit resources cleanup.
   * Users should never need to call this method directly.
   */
  destroy() {
    super.destroy();
  }
}

const getFileFolder = function (filePath) {
  return filePath.substring(0, filePath.lastIndexOf('/')) + '/'
};

const loadfile = function (url, responseType, onSucceed, onFail, onProgress) {
  try {
    const xhr = new XMLHttpRequest();
    xhr.responseType = responseType;
    xhr.addEventListener('timeout', function (event) {
      throw new Error('The request for ' + url + ' timed out.')
    });
    xhr.addEventListener('error', function (event) {
      throw new Error('The request for ' + url + ': xhr.readyState:' + xhr.readyState)
      onFail(xhr.statusText);
    });
    xhr.addEventListener('abort', function (event) {
      throw new Error('The request for ' + url + ': xhr.readyState:' + xhr.readyState)
      onFail(xhr.statusText);
    });
    xhr.addEventListener('loadend', function (event) {
      if (xhr.status == 200) onSucceed(xhr);
      else onFail(xhr.statusText);
    });
    xhr.open('GET', url, true);
    xhr.send();
    // xhr.open();
  } catch (err) {
    onFail(err);
  }
};

const loadTextfile = function (url, onSucceed, onFail = undefined, onProgress = undefined) {
  loadfile(
    url,
    'text',
    (xhr) => {
      onSucceed(xhr.responseText);
    },
    (statusText) => {
      if (onFail != undefined) onFail(statusText);
      else {
        throw new Error('Unable to XHR File:' + url)
      }
    });
};

const loadJSONfile = function (url, onSucceed, onFail = undefined, onProgress = undefined) {
  loadfile(
    url,
    'json',
    (xhr) => {
      onSucceed(xhr.response, xhr);
    },
    (statusText) => {
      if (onFail != undefined) onFail(statusText);
      else {
        throw new Error('Unable to XHR File:' + url)
      }
    });
};

const loadXMLfile = function (url, onSucceed, onFail = undefined, onProgress = undefined) {
  loadfile(
    url,
    'document',
    (xhr) => {
      onSucceed(xhr.responseXML);
    },
    (statusText) => {
      if (onFail != undefined) onFail(statusText);
      else {
        throw new Error('Unable to XHR File:' + url)
      }
    });
};

const loadBinfile = function (url, onSucceed, onFail = undefined, onProgress = undefined) {
  loadfile(
    url,
    'arraybuffer',
    (xhr) => {
      onSucceed(xhr.response);
    },
    (statusText) => {
      if (onFail != undefined) onFail(statusText);
      else {
        throw new Error('Unable to XHR File:' + url)
      }
    });
};

var WorkerClass = null;

try {
    var WorkerThreads =
        typeof module !== 'undefined' && typeof module.require === 'function' && module.require('worker_threads') ||
        typeof __non_webpack_require__ === 'function' && __non_webpack_require__('worker_threads') ||
        typeof require === 'function' && require('worker_threads');
    WorkerClass = WorkerThreads.Worker;
} catch(e) {} // eslint-disable-line

function decodeBase64(base64, enableUnicode) {
    return Buffer.from(base64, 'base64').toString(enableUnicode ? 'utf16' : 'utf8');
}

function createBase64WorkerFactory(base64, sourcemapArg, enableUnicodeArg) {
    var sourcemap = sourcemapArg === undefined ? null : sourcemapArg;
    var enableUnicode = enableUnicodeArg === undefined ? false : enableUnicodeArg;
    var source = decodeBase64(base64, enableUnicode);
    var start = source.indexOf('\n', 10) + 1;
    var body = source.substring(start) + (sourcemap ? '\/\/# sourceMappingURL=' + sourcemap : '');
    return function WorkerFactory(options) {
        return new WorkerClass(body, Object.assign({}, options, { eval: true }));
    };
}

function decodeBase64$1(base64, enableUnicode) {
    var binaryString = atob(base64);
    if (enableUnicode) {
        var binaryView = new Uint8Array(binaryString.length);
        for (var i = 0, n = binaryString.length; i < n; ++i) {
            binaryView[i] = binaryString.charCodeAt(i);
        }
        return String.fromCharCode.apply(null, new Uint16Array(binaryView.buffer));
    }
    return binaryString;
}

function createURL(base64, sourcemapArg, enableUnicodeArg) {
    var sourcemap = sourcemapArg === undefined ? null : sourcemapArg;
    var enableUnicode = enableUnicodeArg === undefined ? false : enableUnicodeArg;
    var source = decodeBase64$1(base64, enableUnicode);
    var start = source.indexOf('\n', 10) + 1;
    var body = source.substring(start) + (sourcemap ? '\/\/# sourceMappingURL=' + sourcemap : '');
    var blob = new Blob([body], { type: 'application/javascript' });
    return URL.createObjectURL(blob);
}

function createBase64WorkerFactory$1(base64, sourcemapArg, enableUnicodeArg) {
    var url;
    return function WorkerFactory(options) {
        url = url || createURL(base64, sourcemapArg, enableUnicodeArg);
        return new Worker(url, options);
    };
}

var kIsNodeJS = Object.prototype.toString.call(typeof process !== 'undefined' ? process : 0) === '[object process]';

function isNodeJS() {
    return kIsNodeJS;
}

function createBase64WorkerFactory$2(base64, sourcemapArg, enableUnicodeArg) {
    if (isNodeJS()) {
        return createBase64WorkerFactory(base64, sourcemapArg, enableUnicodeArg);
    }
    return createBase64WorkerFactory$1(base64, sourcemapArg, enableUnicodeArg);
}

/* eslint-enable */

/* eslint-disable require-jsdoc */
// For synchronous loading, uncomment these lines.
// import {
//     ResourceLoaderWorker_onmessage
// } from './ResourceLoaderWorker.js';

/**
 * Class for delegating resource loading, enabling an abstraction of a cloud file system to be implemented.
 *
 * **Events**
 * * **loaded:** emitted when a file has finished loading
 * * **progressIncremented:** emitted when a loading of processing task has been incremented
 * * **allResourcesLoaded:** emitted when all outstanding resources are loaded. This event can be used to signal the completion of load.
 */
class ResourceLoader extends EventEmitter {
  /**
   * Create a resource loader.
   */
  constructor() {
    super();
    this.__adapter = undefined;
    this.__totalWork = 0;
    this.__doneWork = 0;
    this.__callbacks = {};

    this.__workers = [];
    this.__nextWorker = 0;

    let baseUrl;
    if (globalThis.navigator) {
      const scripts = document.getElementsByTagName('script');
      for (let i = 0; i < scripts.length; i++) {
        const script = scripts[i];
        if (script.src.includes('zea-engine')) {
          const parts = script.src.split('/');
          parts.pop();
          parts.pop();
          baseUrl = parts.join('/');
          break
        }
      }
      if (!baseUrl) {
        baseUrl = 'https://unpkg.com/@zeainc/zea-engine@0.1.3';
      }
      this.wasmUrl = baseUrl + '/public-resources/unpack.wasm';
    }

    if (!baseUrl) {
      baseUrl = 'https://unpkg.com/@zeainc/zea-engine@0.1.3';
    }
    this.wasmUrl = baseUrl + '/public-resources/unpack.wasm';

    // Common resources are used by systems such at the renderer and VR controllers.
    // Any asset that will probably be used my multiple different independent objects
    // should be loaded here. (For now, it is being used to load VR Controller assets.)
    this.__commonResources = {};
  }

  /**
   * The setAdapter method.
   * @param {object} adapter - The adapter object.
   */
  setAdapter(adapter) {
    this.__adapter = adapter;
  }

  /**
   * The getAdapter method.
   * @return {object} - The adapter object.
   */
  getAdapter() {
    return this.__adapter
  }

  // /////////////////////////////////////////////////
  // Workers

  /**
   * The __getWorker method.
   * @return {any} - The return value.
   * @private
   */
  __getWorker() {
    const __constructWorker = () => {
      return new Promise((resolve) => {
        const worker = new WorkerFactory();
        // const worker = new Worker(this.__resourceLoaderFile.url);

        worker.postMessage({
          type: 'init',
          wasmUrl: this.wasmUrl,
        });
        worker.onmessage = (event) => {
          if (event.data.type === 'WASM_LOADED') {
            resolve(worker);
          } else if (event.data.type === 'FINISHED') {
            const data = event.data;

            // const text = [
            //   '==================== ResourceLoaderWorker.js ====================',
            //   `Filename: ${data.resourceId}`,
            //   '------------------------------------------------------',
            // ];
            // for(const file in data.entries) {
            //   text.push(`${file}:${data.entries[file].byteLength}`);
            // }
            // console.log(text.join('\n'))

            this.addWorkDone(event.data.resourceId, 1); // loading done...
            this.__onFinishedReceiveFileData(event.data);
          } else if (event.data.type === 'ERROR') {
            const data = event.data;
            console.error('Unable to load Resource:', data.resourceId, ' With url:', data.url);
          }
        };
      })
    };

    this.__nextWorker = (this.__nextWorker + 1) % 3;
    if (this.__workers[this.__nextWorker] == undefined) this.__workers[this.__nextWorker] = __constructWorker();
    return this.__workers[this.__nextWorker]
  }

  /**
   * The __terminateWorkers value.
   * @private
   */
  __terminateWorkers() {
    for (const worker of this.__workers) worker.terminate();
    this.__workers = [];
  }

  // /////////////////////////////////////////////////
  // URLS

  /**
   * Given some value, which could be an IR or a path, return the unique identifier.
   * @param {string} value - The file value.
   * @return {string} - The resolved fileId if an adapter is installed, else the original value.
   */
  resolveFileId(value) {
    if (this.__adapter) return this.__adapter.resolveFileId(value)
    return value
  }

  /**
   * The resolveFilename method.
   * @deprecated
   * @param {string} value - The file value.
   * @return {string} - The resolved URL if an adapter is installed, else the original value.
   */
  resolveFilename(value) {
    if (this.__adapter) return this.__adapter.resolveFilename(value)
    const filename = value.split(value.lastIndexOf('/'))[1];
    return filename
  }

  /**
   * The resolveURL method.
   * @deprecated
   * @param {string} value - The file value.
   * @return {string} - The resolved URL if an adapter is installed, else the original value.
   */
  resolveURL(value) {
    if (this.__adapter) return this.__adapter.resolveURL(value)
    return value
  }

  /**
   * The loadURL method.
   * @param {string} resourceId - The resourceId value.
   * @param {string} url - The url value.
   * @param {function} callback - The callback value.
   * @param {boolean} addLoadWork - The addLoadWork value.
   * @return {any} - The return value.
   * @deprecated
   * @private
   */
  loadURL(resourceId, url, callback, addLoadWork = true) {
    console.warn('Please call loadUrl instead,');
    return this.loadUrl(resourceId, url, callback, addLoadWork)
  }

  /**
   * The loadUrl method.
   * @param {string} resourceId - The resourceId value.
   * @param {string} url - The url value.
   * @param {function} callback - The callback value.
   * @param {boolean} addLoadWork - The addLoadWork value.
   */
  loadUrl(resourceId, url, callback, addLoadWork = true) {
    if (addLoadWork) {
      this.addWork(resourceId, 3); // Add work in 2 chunks. Loading, unpacking, parsing.
    }

    if (!(resourceId in this.__callbacks)) this.__callbacks[resourceId] = [];
    this.__callbacks[resourceId].push(callback);

    function checkStatus(response) {
      if (!response.ok) {
        throw new Error(`HTTP ${response.status} - ${response.statusText}`)
      }
      return response
    }
    fetch(url)
      .then((response) => checkStatus(response) && response.arrayBuffer())
      .then((buffer) => {
        this.__getWorker().then((worker) => {
          worker.postMessage({
            type: 'unpack',
            resourceId,
            buffer,
          });
        });
      });
  }

  /**
   * The __onFinishedReceiveFileData method.
   * @param {object} fileData - The fileData value.
   * @private
   */
  __onFinishedReceiveFileData(fileData) {
    const resourceId = fileData.resourceId;
    this.addWorkDone(resourceId, 1); // unpacking done...
    const callbacks = this.__callbacks[resourceId];
    if (callbacks) {
      for (const callback of callbacks) {
        callback(fileData.entries);
      }
      delete this.__callbacks[resourceId];
    }
    this.emit('loaded', { resourceId });
    this.addWorkDone(resourceId, 1); // parsing done...
  }

  /**
   * Loads and return a file resource using the specified path.
   *
   * @param {string} resourceId - The resourceId value.
   * @return {VLAAsset} - The return value.
   */
  loadCommonAssetResource(resourceId) {
    if (resourceId in this.__commonResources) {
      return this.__commonResources[resourceId]
    }
    const asset = new VLAAsset();
    asset.getParameter('DataFilePath').setValue(resourceId);
    this.__commonResources[resourceId] = asset;
    return asset
  }

  // /////////////////////////////////////////////////
  // Work

  /**
   * Add work to the total work pile.. We never know how big the pile will get.
   *
   * @param {string} resourceId - The resourceId value.
   * @param {number} amount - The amount value.
   */
  addWork(resourceId, amount) {
    this.__totalWork += amount;
    const percent = (this.__doneWork / this.__totalWork) * 100;
    this.emit('progressIncremented', { percent });
  }

  /**
   * Add work to the 'done' pile. The done pile should eventually match the total pile.
   *
   * @param {string} resourceId - The resourceId value.
   * @param {number} amount - The amount value.
   */
  addWorkDone(resourceId, amount) {
    this.__doneWork += amount;

    const percent = (this.__doneWork / this.__totalWork) * 100;
    this.emit('progressIncremented', { percent });
    if (this.__doneWork > this.__totalWork) {
      throw new Error('Mismatch between work loaded and work done.')
    }
    if (this.__doneWork == this.__totalWork) {
      this.emit('allResourcesLoaded', {});
    }
  }
}

const resourceLoader = new ResourceLoader();

/**
 * Class designed to store version data. Widely used in the zea engine for backwards compatibility.
 */
class Version {
  /**
   * Creates a version.
   * The version string should have the following structure: <br>
   * major, minor and patch separated by a dot(`.`) and parts separated by a dash(`-`).
   *
   * @param {str} versionStr - The version string value.
   */
  constructor(versionStr) {
    if (versionStr) {
      const parts = versionStr.split('-');
      const numbers = parts[0].split('.');
      this.major = parseInt(numbers[0]);
      this.minor = parseInt(numbers[1]);
      this.patch = parseInt(numbers[2]);
      if (parts.length == 2) this.branch = parts[1];
    } else {
      this.major = 0;
      this.minor = 0;
      this.patch = 0;
    }
  }

  /**
   * Compare a version object against a version numbers array.
   *
   * @param {array} numbers - An array containing 3 version numbers. [Major, Minor, Patch]
   * @return {number} - return positive: v1 > v2, zero:v1 == v2, negative: v1 < v2
   */
  compare(numbers) {
    // https://stackoverflow.com/questions/6832596/how-to-compare-software-version-number-using-js-only-number
    // 2nd answer.
    const v1 = [this.major, this.minor, this.patch];
    for (let i = 0; i < 3; i++) {
      if (v1[i] !== numbers[i]) return v1[i] - numbers[i]
    }
    return 0
  }

  /**
   * Compare a version object against a version numbers array.
   *
   * @param {array} numbers - The numbers value.
   * @return {boolean} - The return value.
   */
  equals(numbers) {
    return !(this.patch == numbers[2] && this.minor == numbers[1] && this.major == numbers[0])
  }

  /**
   * Compare a version object against a version numbers array.
   *
   * @param {array} numbers - The numbers value.
   * @return {boolean} - The return value.
   */
  lessThan(numbers) {
    return !(this.major >= numbers[0] || this.minor >= numbers[1] || this.patch >= numbers[2])
    // if (this.major >= numbers[0]) return false
    // if (this.minor >= numbers[1]) return false
    // if (this.patch >= numbers[2]) return false
    // return true
    // return (
    //   this.major < numbers[0] ||
    //   this.minor < numbers[1] ||
    //   this.patch < numbers[2]
    // )
  }

  /**
   * Compare a version object against a version numbers array.
   *
   * @param {array} numbers - The numbers value.
   * @return {boolean} - The return value.
   */
  greaterThan(numbers) {
    return this.major > numbers[0] || this.minor > numbers[1] || this.patch > numbers[2]
  }

  /**
   * Compare a version object against a version numbers array.
   *
   * @param {array} numbers - The numbers value.
   * @return {boolean} - The return value.
   */
  greaterOrEqualThan(numbers) {
    if (this.major < numbers[0]) return false
    if (this.major > numbers[0]) return true

    if (this.minor < numbers[1]) return false
    if (this.minor > numbers[1]) return true

    if (this.patch < numbers[2]) return false
    return true
    // return (
    //   this.major >= numbers[0] &&
    //   this.minor >= numbers[1] &&
    //   this.patch >= numbers[2]
    // )
  }
}

/* eslint-disable camelcase */

/**
 * Writes `TypedArray` types in binary using a specific encoding.
 */
class BinWriter {
  /**
   * Create a bin writer.
   * @param {number} dataSize - The dataSize value.
   */
  constructor(dataSize = 0) {
    this.__data = new ArrayBuffer(dataSize);
    this.__byteOffset = 0;
    this.__reserved = dataSize;
    this.__dataView = new DataView(this.__data);
  }

  /**
   * Returns the byte offset position.
   *
   * @return {number} - The return value.
   */
  pos() {
    return this.__byteOffset
  }

  /**
   * Sets byte offset value.
   *
   * @param {number} byteOffset - The byteOffset value.
   */
  seek(byteOffset) {
    this.__byteOffset = byteOffset;
  }

  /**
   * The seekEnd method.
   */
  seekEnd() {
    this.__byteOffset = this.__reserved;
  }

  /**
   * Returns written buffer data to current point.
   *
   * @return {ArrayBuffer} - Returns an array buffer.
   */
  getBuffer() {
    if (this.__data.byteLength == this.__byteOffset) {
      return this.__data
    } else {
      const unit8Array = new Uint8Array(this.__data);
      return unit8Array.slice(0, this.__byteOffset).buffer
    }
  }

  /**
   * The __grow method.
   * @private
   */
  __grow() {
    const newSize = (this.__reserved > 0 ? this.__reserved : 1) * 2;
    const data = new ArrayBuffer(newSize);
    const unit8Array = new Uint8Array(data);
    const old_unit8Array = new Uint8Array(this.__data);
    unit8Array.set(old_unit8Array);
    this.__data = data;
    this.__dataView = new DataView(this.__data);
    this.__reserved = newSize;
  }

  /**
   * The __reserve method.
   * @param {number} offset - The offset value.
   * @private
   */
  __reserve(offset) {
    if (this.__byteOffset + offset > this.__reserved) {
      this.__grow();
    }
  }

  /**
   * The __offset method.
   * @param {number} byteCount - The byteCount value.
   * @private
   */
  __offset(byteCount) {
    this.__byteOffset += byteCount;
    if (this.__byteOffset > this.__reserved) {
      this.__grow();
    }
  }

  /**
   * Writes an unsigned Int8 value in current byte offset.
   *
   * @param {number} value - The value param.
   */
  writeUInt8(value) {
    this.__reserve(1);
    this.__dataView.setUint8(this.__byteOffset, value);
    this.__offset(1);
  }

  /**
   * Writes an unsigned Int16 value in current byte offset.
   * @param {number} value - The value param.
   */
  writeUInt16(value) {
    this.__reserve(2);
    this.__dataView.setUint16(this.__byteOffset, value, true);
    this.__offset(2);
  }

  /**
   * Writes an unsigned Int32 value in current byte offset.
   * @param {number} value - The value param.
   */
  writeUInt32(value) {
    this.__reserve(4);
    this.__dataView.setUint32(this.__byteOffset, value, true);
    this.__offset(4);
  }

  /**
   * Writes a signed Int32 value in current byte offset.
   * @param {number} value - The value param.
   */
  writeSInt32(value) {
    this.__reserve(4);
    this.__dataView.setInt32(this.__byteOffset, value, true);
    this.__offset(4);
  }

  /**
   * Writes a Float16 value in current byte offset.
   *
   * @param {number} value - The value param.
   */
  writeFloat16(value) {
    const uint16 = MathFunctions.encode16BitFloat(value);
    this.writeUInt16(uint16);
  }

  /**
   * Writes a Float32 value in current byte offset.
   *
   * @param {number} value - The value param.
   */
  writeFloat32(value) {
    this.__reserve(4);
    this.__dataView.setFloat32(this.__byteOffset, value, true);
    this.__offset(4);
  }

  /**
   * Writes an unsigned Int8 array value from current byte offset.
   *
   * @param {Uint8Array} value - The value param.
   * @param {boolean} writeSize - The writeSize value.
   */
  writeUInt8Array(value, writeSize = true) {
    const count = value.size ? value.size : value.length;
    this.__reserve(count + (writeSize ? 4 : 0));
    if (writeSize) this.writeUInt32(count);
    for (let i = 0; i < count; i++) {
      this.writeUInt8(value[i]);
    }
  }

  /**
   * Writes an unsigned Int16 array value from current byte offset.
   *
   * @param {array} value - The value param.
   * @param {boolean} writeSize - The writeSize value.
   */
  writeUInt16Array(value, writeSize = true) {
    const count = value.size ? value.size : value.length;
    this.__reserve(count * 2 + (writeSize ? 4 : 0));
    if (writeSize) this.writeUInt32(count);
    for (let i = 0; i < count; i++) {
      this.writeUInt16(value[i]);
    }
  }

  /**
   * Writes an unsigned Int32 array value from current byte offset.
   *
   * @param {Uint32Array} value - The value param.
   * @param {boolean} writeSize - The writeSize value.
   */
  writeUInt32Array(value, writeSize = true) {
    const count = value.size ? value.size : value.length;
    this.__reserve(count * 4 + (writeSize ? 4 : 0));
    if (writeSize) this.writeUInt32(count);
    for (let i = 0; i < count; i++) {
      this.writeUInt32(value[i]);
    }
  }

  /**
   * Writes a Float32 array value from current byte offset.
   *
   * @param {Float32Array} value - The value param.
   * @param {boolean} writeSize - The writeSize value.
   */
  writeFloat32Array(value, writeSize = true) {
    const count = value.size ? value.size : value.length;
    this.__reserve(count * 4 + (writeSize ? 4 : 0));
    if (writeSize) this.writeUInt32(count);
    for (let i = 0; i < count; i++) {
      this.writeFloat32(value[i]);
    }
  }

  /**
   * Writes string value in current position, first writing an unsigned Int32 describing its length, then adding the string in Float32 values.
   *
   * @param {string} str - The str value.
   * @param {boolean} writeSize - The writeSize value.
   */
  writeStr(str, writeSize = true) {
    const count = str.length;
    this.__reserve(count * 4 + (writeSize ? 4 : 0));
    if (writeSize) this.writeUInt32(count);
    for (let i = 0; i < count; i++) {
      this.writeFloat32(str.charCodeAt(i));
    }
  }

  /**
   * Writes a `Vec2` in the buffer using signed Int32 values(In `x,y` order).
   * @param {Vec2} value - The Vec2 to write.
   */
  writeSInt32Vec2(value) {
    this.writeSInt32(value.x);
    this.writeSInt32(value.y);
  }

  /**
   * Writes a `Vec2` in the buffer using unsigned Int32 values(In `x,y` order).
   *
   * @param {Vec2} value - The Vec2 to write.
   */
  writeUInt32Vec2(value) {
    this.writeUInt32(value.x);
    this.writeUInt32(value.y);
  }

  /**
   * Writes a `Vec2` in the buffer using Float16 values(In `x,y` order).
   * @param {Vec2} value - The Vec2 to write.
   */
  writeFloat16Vec2(value) {
    this.writeFloat16(value.x);
    this.writeFloat16(value.y);
  }

  /**
   * Writes a `Vec2` in the buffer using Float32 values(In `x,y` order).
   *
   * @param {Vec2} value - The Vec2 to write.
   */
  writeFloat32Vec2(value) {
    this.writeFloat32(value.x);
    this.writeFloat32(value.y);
  }

  /**
   * Writes a `Vec3` in the buffer using Float16 values(In `x,y,z` order).
   *
   * @param {Vec3} value - The Vec3 to write.
   */
  writeFloat16Vec3(value) {
    this.writeFloat16(value.x);
    this.writeFloat16(value.y);
    this.writeFloat16(value.z);
  }

  /**
   * Writes a `Vec3` in the buffer using Float32 values(In `x,y,z` order).
   * @param {Vec3} value - The Vec3 to write.
   */
  writeFloat32Vec3(value) {
    this.writeFloat32(value.x);
    this.writeFloat32(value.y);
    this.writeFloat32(value.z);
  }

  /**
   * Writes a `Quat` in the buffer using Float16 values(In `x,y,z,w` order).
   *
   * @param {Quat} value - The Quat to write.
   */
  writeFloat16Quat(value) {
    this.writeFloat16(value.x);
    this.writeFloat16(value.y);
    this.writeFloat16(value.z);
    this.writeFloat16(value.w);
  }

  /**
   * Writes a `Quat` in the buffer using Float32 values(In `x,y,z,w` order).
   *
   * @param {Quat} value - The Quat to write.
   */
  writeFloat32Quat(value) {
    this.writeFloat32(value.x);
    this.writeFloat32(value.y);
    this.writeFloat32(value.z);
    this.writeFloat32(value.w);
  }

  /**
   * Writes a RGB `Color` in the buffer using Float32 values(In `r,g,b` order).
   *
   * @param {Color} value - The Color to write.
   */
  writeRGBFloat32Color(value) {
    this.writeFloat32(value.r);
    this.writeFloat32(value.g);
    this.writeFloat32(value.b);
  }

  /**
   * Writes a RGBA `Color` in the buffer using Float32 values(In `r,g,b,a` order).
   *
   * @param {Color} value - The Color to write.
   */
  writeRGBAFloat32Color(value) {
    this.writeFloat32(value.r);
    this.writeFloat32(value.g);
    this.writeFloat32(value.b);
    this.writeFloat32(value.a);
  }

  /**
   * Writes a RGB `Color` in the buffer using unsigned Int8 values(In `r,g,b` order).
   *
   * @param {Color} value - The Color to write.
   */
  writeRGBUInt8Color(value) {
    this.writeUInt8(value.r);
    this.writeUInt8(value.g);
    this.writeUInt8(value.b);
  }

  /**
   * Writes a RGBA `Color` in the buffer using unsigned Int8 values(In `r,g,b,a` order).
   *
   * @param {Color} value - The Color to write.
   */
  writeRGBAUInt8Color(value) {
    this.writeUInt8(value.r);
    this.writeUInt8(value.g);
    this.writeUInt8(value.b);
    this.writeUInt8(value.a);
  }

  /**
   * Writes a `Box2` in the buffer using Floar32 values(In `p0,p1` order).
   *
   * @param {Box2} value - The Box2 to write.
   */
  writeBox2(value) {
    this.writeFloat32Vec2(value.p0);
    this.writeFloat32Vec2(value.p1);
  }

  /**
   * Writes a `Box3` in the buffer using Floar32 values(In `p0,p1` order).
   *
   * @param {Box3} value - The Box3 to write.
   */
  writeBox3(value) {
    this.writeFloat32Vec3(value.p0);
    this.writeFloat32Vec3(value.p1);
  }

  /**
   * The writePadd method.
   * @param {number} size - The size value.
   */
  writePadd(size) {
    const bytes = size - this.__byteOffset;
    this.__reserve(bytes);
    this.__offset(bytes);
  }

  /**
   * The writeAlignment method.
   * @param {number} numBytes - The numBytes value.
   */
  writeAlignment(numBytes) {
    const bytes = this.__byteOffset % numBytes;
    if (bytes != 0) {
      this.__reserve(numBytes - bytes);
      this.__offset(numBytes - bytes);
    }
  }
}

const OperatorOutputMode = {
  OP_WRITE: 0,
  OP_READ_WRITE: 1,
};

/**
 * Represents a reactive type of attribute that can be owned by a `ParameterOwner` class.
 *
 * **Events**
 * * **nameChanged:** Triggered when the name of the parameter changes.
 * * **valueChanged:** Triggered when the value of the parameter changes.
 */
class Parameter extends EventEmitter {
  /**
   * When initializing a new parameter, the passed in value could be anything.
   * If it is a new type of value, just ensure you register it in the `Registry`.
   *
   * How to use it:
   *
   * ```javascript
   *  // Creating a parameter object
   *  const param = new Parameter('Title', 'Awesome Parameter Value', 'String')
   *
   *   // Capturing events
   *  param.on('valueChanged', (...params) => console.log('Value changed!'))
   *
   *  // Changing parameter's value will cause `valueChanged` event to trigger.
   *  param.setValue('A New Awesome Parameter Value')
   *  // As result the console log code will execute: Value Changed!
   * ```
   *
   * @param {string} name - The name of the parameter.
   * @param {object|string|number|any} value - The value of the parameter.
   * @param {string} dataType - The data type of the parameter.
   */
  constructor(name, value, dataType) {
    super(name);

    this.__name = name;
    this.__value = value;
    this.__dataType = dataType ? dataType : undefined;
    this.__boundOps = [];
    this.__dirtyOpIndex = 0;
    this.__cleaning = false;

    this.getName = this.getName.bind(this);
    this.setName = this.setName.bind(this);
    this.getValue = this.getValue.bind(this);
    this.setValue = this.setValue.bind(this);
  }

  /**
   * Copies and returns the exact clone of current parameter
   *
   * @return {Parameter} - Clone of current parameter
   */
  clone() {
    const clonedParameter = new Parameter(this.__name, this.__value, this.__dataType);
    return clonedParameter
  }

  /**
   * Returns specified name of the parameter.
   *
   * @return {string} - Returns the name.
   */
  getName() {
    return this.__name
  }

  /**
   * Sets the name of the current parameter.
   *
   * @param {string} name - The base parameter name.
   * @return {Parameter} - The instance itself.
   */
  setName(name) {
    if (name === this.__name) {
      return this
    }

    const prevName = this.__name;
    this.__name = name;
    this.emit('nameChanged', { newName: this.__name, prevName });
  }

  /**
   * Returns the owner item of the current parameter.
   *
   * @return {ParameterOwner} - The return value.
   */
  getOwner() {
    return this.ownerItem
  }

  /**
   * Sets the owner item of the current parameter.
   *
   * @param {ParameterOwner} ownerItem - The ownerItem value.
   */
  setOwner(ownerItem) {
    this.ownerItem = ownerItem;
  }

  /**
   * Returns the parameter's path as an array of strings.
   * Includes owner's path in case it is owned by a `ParameterOwner`.
   *
   * @return {array} - The return value.
   */
  getPath() {
    if (this.ownerItem && this.ownerItem.getName) {
      return [...this.ownerItem.getPath(), this.__name]
    } else {
      return [this.__name]
    }
  }

  /**
   * Returns parameter's data type.
   *
   * @return {string} - The return value.
   */
  getDataType() {
    return this.__dataType
  }

  // ////////////////////////////////////////////////
  // Operator bindings

  /**
   * Binds an OperatorOutput to this parameter.
   *
   * @param {OperatorOutput} operatorOutput - The output that we are unbinding from the Parameter
   * @param {number} index - The index(optional) that the output is being bound at.
   * @return {number} - The index of the bound output.
   */
  bindOperatorOutput(operatorOutput, index = -1) {
    if (index == -1) index = this.__boundOps.length;
    this.__boundOps.splice(index, 0, operatorOutput);
    // Update the remaining binding indices
    for (let i = index; i < this.__boundOps.length; i++) {
      this.__boundOps[i].setParamBindIndex(i);
    }
    // If we weren't already dirty, make sure to emit a 'valueChanged' anyway.
    if (!this.setDirty(index)) this.emit('valueChanged', { mode: 0 });
    return index
  }

  /**
   * The unbindOperator method.
   *
   * @param {OperatorOutput} operatorOutput - The output that we are unbinding from the Parameter
   * @return {boolean} - The return value.
   */
  unbindOperator(operatorOutput) {
    const index = operatorOutput.getParamBindIndex();
    this.__boundOps.splice(index, 1);
    // Update the remaining binding indices
    for (let i = index; i < this.__boundOps.length; i++) {
      this.__boundOps[i].setParamBindIndex(i);
    }
    this.setDirty(Math.max(0, index - 1));
    return index
  }

  /**
   * Dirties this Parameter so subsequent calls to `getValue` will cause an evaluation of its bound operators.
   *
   * @param {number} index - Index of the operator
   * @return {boolean} - `true` if the Parameter was made dirty, else `false` if it was already dirty.
   */
  setDirty(index) {
    // Determine the first operator in the stack that must evaluate to clean the parameter.
    if (index < this.__dirtyOpIndex) {
      // Walk back down the stack and dirty each of the other bound operators.
      // If we must dirty all operators in the stack from the last OP_WRITE to the end.
      for (this.__dirtyOpIndex--; this.__dirtyOpIndex > 0; this.__dirtyOpIndex--) {
        // Dirty all the other bound ops in the stack until we hit an OP_WRITE
        if (this.__dirtyOpIndex != index) {
          // This will cause the other outputs of the operator to become dirty.
          this.__boundOps[this.__dirtyOpIndex].getOperator().setDirty();
        }
        if (this.__boundOps[this.__dirtyOpIndex].getMode() == OperatorOutputMode.OP_WRITE) break
      }

      this.emit('valueChanged', { mode: 0 });
      return true
    }

    return false
  }

  /**
   * Returns true if this parameter is currently dirty and will evaluate its bound
   * operators if its value is requested by a call to getValue.
   *
   * @return {boolean} - Returns a boolean.
   */
  isDirty() {
    return this.__dirtyOpIndex < this.__boundOps.length
  }

  /**
   * Returns the index of the first 'dirty' binding in the stack. This will be the index of the
   * first operator that will evaluate when the parameter needs to be cleaned.
   *
   * @return {number} - The index of the dirty binding in the binding stack.
   */
  getDirtyBindingIndex() {
    return this.__dirtyOpIndex
  }

  /**
   * The setCleanFromOp method.
   * @param {any} value - The computed value to be stored in the Parameter.
   * @param {number} index - The index of the bound OperatorOutput.
   */
  setCleanFromOp(value, index) {
    if (index != this.__dirtyOpIndex) {
      if (index < this.__dirtyOpIndex) {
        // This can happen when an operator in the following case.

        // ParamA [OpC, OpB, OpA]
        // ParamB [OpC, OpA]
        // When OpB dirties ParamA, and is evaluated, ParamB is considered clean because OpA was never dirtied

        // We see this message when parameters are evaluated as soon as a change is detected instead of
        // in batches. Now that all rendering code is pulling data only during the render cycle, we ara
        // not seeing it anymore. However, maybe with a UI open, it will start emitting this warning.
        // Note: this would be caused, if a Parameter is already cleaned by an Operator, and yet the Operator
        // is re-evaluating. I am not sure how this can occur.
        // const op = operatorOutput.getOperator()
        // console.log(
        //   `Operator:: ${
        //     op.constructor.name
        //   } with name: ${op.getName()} is being cleaned immediately, instead of lazily.`
        // )
        console.log(`Parameter is cleaned when it was already clean to that point in the stack:`, this.getPath());
      } else if (this.__boundOps[index].getMode() != OperatorOutputMode.OP_WRITE) {
        // A parameter can become dirty (so __dirtyOpIndex == 0), and then another operator bound on top.
        // if the next op is a WRITE op, then we can fast forward the dirty index.
        const thisClassName = Registry.getBlueprintName(this);
        const opClassName = Registry.getBlueprintName(this.__boundOps[index].getOperator());
        throw new Error(
          `Parameter: ${thisClassName} with name: ${this.getName()} is not cleaning all outputs during evaluation of op: ${opClassName} with name: ${op.getName()}`
        )
      }
    }
    this.__value = value;

    // As each operator writes its value, the dirty value is incremented
    this.__dirtyOpIndex = index + 1;
  }

  /**
   * During operator evaluation, operators can use this method to retrieve the existing
   * value of one of their outputs.
   * @param {number} index - The index of the bound OperatorOutput to evaluate up to.
   * @return {object|string|number|any} - The return value.
   */
  getValueFromOp(index) {
    // Note: during evaluation of an Operator that writes to multiple outputs,
    // it can write to an output with an IO setting, which means it retrieves
    // the previous value while calculating the next.
    if (this.__dirtyOpIndex < index) {
      this._clean(index);
    }
    return this.__value
  }

  /**
   * Cleans the parameter up tp the index of the specified index of the bound OperatorOutput
   *
   * @param {number} index - The index of the bound OperatorOutput to evaluate up to.
   */
  _clean(index) {
    if (this.__cleaning) {
      throw new Error(`Cycle detected when cleaning: ${this.getPath()}. Operators need to be rebound to fix errors`)
    }
    this.__cleaning = true;

    while (this.__dirtyOpIndex < index) {
      const tmp = this.__dirtyOpIndex;
      const operatorOutput = this.__boundOps[this.__dirtyOpIndex];
      // The op can get the current value and modify it in place
      // and set the output to clean.
      operatorOutput.getOperator().evaluate();

      if (tmp == this.__dirtyOpIndex) {
        // During initial configuration of an operator, cleaning outputs might be disabled.
        const op = this.__boundOps[this.__dirtyOpIndex].getOperator();
        const opClassName = Registry.getBlueprintName(op);
        console.warn(
          `Operator: ${opClassName} with name: ${op.getName()} is not cleaning its outputs during evaluation`
        );
        this.__dirtyOpIndex++;
      }
    }

    this.__cleaning = false;
  }

  /**
   * Returns parameter's value.
   *
   * @param {number} mode - The mode value.
   * @return {object|string|number|any} - The return value.
   */
  getValue(mode) {
    if (mode != undefined) {
      console.warn("WARNING in Parameter.setValue: 'mode' is deprecated.");
    }
    if (this.__dirtyOpIndex < this.__boundOps.length) {
      this._clean(this.__boundOps.length);
    }
    return this.__value
  }

  /**
   * Sets value of the parameter.
   *
   * @param {object|string|number|any} value - The value param.
   * @param {number} mode - This is deprecated now.
   */
  setValue(value, mode) {
    if (value == undefined) {
      // eslint-disable-next-line no-throw-literal
      throw 'undefined was passed into the set value for param:' + this.getName()
    }
    if (mode != undefined) {
      console.warn("WARNING in Parameter.setValue: 'mode' is deprecated.");
    }

    if (this.__boundOps.length > 0) {
      for (let i = this.__boundOps.length - 1; i >= 0; i--) {
        const operatorOutput = this.__boundOps[i];
        value = operatorOutput.backPropagateValue(value);
        if (operatorOutput.getMode() == 0 /* OP_WRITE */) return
      }
    }

    if (!value.fromJSON) {
      // Note: equality tests on anything but simple values is going to be super expensive.
      if (this.__value == value) return
    }
    this.__value = value;

    // Note: only users call 'setValue'. Operators call 'setCleanFromOp'
    this.emit('valueChanged', {});
  }

  // ////////////////////////////////////////
  // Persistence

  /**
   * The loadValue is used to change the value of a parameter, without triggering a
   * valueChanges, or setting the USER_EDITED state.
   *
   * @param {any} value - The context value.
   */
  loadValue(value) {
    this.__value = value;
  }

  /**
   * The toJSON method serializes this instance as a JSON.
   * It can be used for persistence, data transfer, etc.
   *
   * @param {object} context - The context value.
   * @return {object} - Returns the json object.
   */
  toJSON(context) {
    if (this.__value.toJSON) return { value: this.__value.toJSON(context) }
    else return { value: this.__value }
  }

  /**
   * The fromJSON method takes a JSON and deserializes into an instance of this type.
   *
   * @param {object} j - The json object this item must decode.
   * @param {object} context - The context value.
   */
  fromJSON(j, context) {
    if (j.value == undefined) {
      console.warn('Invalid Parameter JSON');
      return
    }

    if (j.value.type && this.__value == undefined) {
      this.__value = Registry.constructClass(j.value.type);
    }
    if (this.__value == undefined || !this.__value.fromJSON) {
      this.__value = j.value;
    } else {
      this.__value.fromJSON(j.value, context);
    }
    this.emit('valueChanged', { mode: 0 });
  }

  /**
   * The readBinary method.
   *
   * @param {object} reader - The reader value.
   * @param {object} context - The context value.
   */
  readBinary(reader, context) {
    console.warn(`TODO: Parameter: ${this.constructor.name} with name: ${this.__name} does not implement readBinary`);
  }

  // ////////////////////////////////////////
  // Clone

  /**
   * The clone method constructs a new parameter, copies its values
   * from this parameter and returns it.
   *
   * @return {Parameter} - Returns a new cloned parameter.
   */
  clone() {
    const clonedValue = this.__value;
    if (clonedValue.clone) clonedValue = clonedValue.clone();
    const clonedParam = new Parameter(this.__name, clonedValue, this.__dataType);
    return clonedParam
  }
}

/**
 * Represents a specific type of parameter, that only stores numeric values.
 *
 * ```javascript
 * const numberParam = new NumberParameter('MyNumber', 15)
 * //'myParameterOwnerItem' is an instance of a 'ParameterOwner' class.
 * // Remember that only 'ParameterOwner' and classes that extend from it can host 'Parameter' objects.
 * myParameterOwnerItem.addParameter(numberParam)
 * ```
 *
 * @extends Parameter
 */
class NumberParameter extends Parameter {
  /**
   * Create a number parameter.
   * @param {string} name - The name of the number parameter.
   * @param {number} value - The value of the parameter.
   * @param {array} range - An array with two numbers. If defined, the parameter value will be clamped.
   * @param {number} step - The step value. If defined, the parameter value will be rounded to the nearest integer.
   */
  constructor(name, value = 0, range = undefined, step = undefined) {
    super(name, value, 'Number');
    // The value might not have a range.
    if (range && !Array.isArray(range)) console.error('Range value must be an array of 2 numbers.');
    this.__range = range;
    this.__step = step;
  }

  /**
   * Returns the range to which the parameter is restrained.
   *
   * @return {array} - The return value.
   */
  getRange() {
    return this.__range
  }

  /**
   * Sets the range to which the parameter is restrained.
   *
   * @param {array} range - The range value.
   */
  setRange(range) {
    // Should be an array [0, 20]
    this.__range = range;
  }

  /**
   * Returns the step number, which is the one used for rounding.
   *
   * @return {number} - The return value.
   */
  getStep() {
    return this.__step
  }

  /**
   * Returns step value.
   *
   * @param {number} step - The step value.
   */
  setStep(step) {
    this.__step = step;
  }

  // ////////////////////////////////////////
  // Persistence

  /**
   * The toJSON method encodes this type as a json object for persistence.
   *
   * @param {object} context - The context value.
   * @return {object} - Returns the json object.
   */
  toJSON(context) {
    const j = super.toJSON(context);
    if (this.__range) j.range = this.__range;
    if (this.__step) j.step = this.__step;
    return j
  }

  /**
   * The fromJSON method decodes a json object for this type.
   *
   * @param {object} j - The json object this item must decode.
   * @param {object} context - The context value.
   */
  fromJSON(j, context) {
    super.fromJSON(j, context);
    if (j.range) this.__range = j.range;
    if (j.step) this.__step = j.step;
  }

  /**
   * Extracts a number value from a buffer, updating current parameter state.
   *
   * @param {BinReader} reader - The reader value.
   * @param {object} context - The context value.
   */
  readBinary(reader, context) {
    this.__value = reader.loadFloat32();
  }

  // ////////////////////////////////////////
  // Clone

  /**
   * The clone method constructs a new number parameter, copies its values
   * from this parameter and returns it.
   *
   * @return {NumberParameter} - Returns a new number parameter.
   */
  clone() {
    const clonedParam = new NumberParameter(this.__name, this.__value);
    clonedParam.__range = this.__range;
    clonedParam.__step = this.__step;
    return clonedParam
  }
}

Registry.register('NumberParameter', NumberParameter);
Registry.register('Property_SInt32', NumberParameter);
Registry.register('Property_UInt32', NumberParameter);
Registry.register('Property_Float32', NumberParameter);

/**
 * Represents a specific type of parameter, that stores multiple choice(array) values.
 *
 * i.e.:
 * ```javascript
 * const multiChoiceParameter =  new MultiChoiceParameter('InitialXfoMode', GROUP_INITIAL_XFO_MODES.average, [
 *                                  'manual',
 *                                  'first',
 *                                  'average',
 *                                  'global',
 *                                ])
 * //'myParameterOwnerItem' is an instance of a 'ParameterOwner' class.
 * // Remember that only 'ParameterOwner' and classes that extend from it can host 'Parameter' objects.
 * myParameterOwnerItem.addParameter(multiChoiceParameter)
 * ```
 * @extends NumberParameter
 */
class MultiChoiceParameter extends NumberParameter {
  /**
   * Create a multi choice parameter.
   * @param {string} name - The name of the multi choice parameter.
   * @param {number} index - The index value.
   * @param {array} choices - The choices value.
   */
  constructor(name, index, choices) {
    super(name, index, [0, choices.length], 1);
    this.choices = choices;
  }

  /**
   * Returns choices array.
   *
   * @return {array} - The return value.
   */
  getChoices() {
    return this.choices
  }

  /**
   * Sets parameter index value.
   *
   * @param {string|number} value - The value param.
   */
  setValue(value) {
    if (typeof value === 'string') {
      super.setValue(this.choices.indexOf(value));
    } else {
      super.setValue(value);
    }
  }
}

/**
 * Represents a specific type of parameter, that only stores `boolean` values.
 *
 * i.e.:
 * ```javascript
 * const booleanParam = new BooleanParameter('MyBoolean', true)
 * //'myParameterOwnerItem' is an instance of a 'ParameterOwner' class.
 * // Remember that only 'ParameterOwner' and classes that extend from it can host 'Parameter' objects.
 * myParameterOwnerItem.addParameter(booleanParam)
 * ```
 * @extends Parameter
 */
class BooleanParameter extends Parameter {
  /**
   * Creates a new parameter with `Boolean` data type.
   *
   * @param {string} name - The name of the boolean parameter.
   * @param {boolean} value - The value of the parameter.
   */
  constructor(name, value) {
    super(name, value, 'Boolean');
  }

  /**
   * The clone method constructs a new boolean parameter,
   * copies its values from this parameter and returns it.
   *
   * @return {BooleanParameter} - Returns a new cloned boolean parameter.
   */
  clone() {
    const clonedParam = new BooleanParameter(this.__name, this.__value);
    return clonedParam
  }
}

Registry.register('BooleanParameter', BooleanParameter);

/**
 * Represents a specific type of parameter, that only stores Vec2(two-dimensional coordinate) values.
 *
 * i.e.:
 * ```javascript
 * const vec2Param = new Vec2Parameter('MyVec2', new Vec2(1.2, 3.4))
 * //'myParameterOwnerItem' is an instance of a 'ParameterOwner' class.
 * // Remember that only 'ParameterOwner' and classes that extend from it can host 'Parameter' objects.
 * myParameterOwnerItem.addParameter(vec2Param)
 * ```
 *
 * **Events**
 * * **rangeChanged:** Triggered when rage array changes.
 *
 * @extends Parameter
 */
class Vec2Parameter extends Parameter {
  /**
   * Create a Vec2 parameter.
   *
   * @param {string} name - The name of the Vec2 parameter.
   * @param {Vec2} value - The value of the parameter.
   * @param {array} range - The range value is an array of two `Vec2` objects.
   */
  constructor(name, value, range = undefined) {
    super(name, value ? value : new Vec2(), 'Vec2');
    this.__range = range;
  }

  /**
   * Returns the range of values in which current parameter can be.
   *
   * @return {array} - The return value.
   */
  getRange() {
    // Range should be an array of 2 vec2s. [min(x,y), max(x,y)]
    return this.__range
  }

  /**
   * The __setRange method.
   * @param {array} range - The range value.
   * @private
   */
  __setRange(range) {
    // Should be an array [0, 20]
    this.__range = range;
    this.emit('rangeChanged', { range });
  }

  /**
   * Extracts a number value from a buffer, updating current parameter state.
   *
   * @param {BinReader} reader - The reader value.
   * @param {object} context - The context value.
   */
  readBinary(reader, context) {
    this.__value.readBinary(reader);
  }

  /**
   * The clone method constructs a new Vec2 parameter, copies its values
   * from this parameter and returns it.
   *
   * @return {Vec2Parameter} - Returns a new Vec2 parameter.
   */
  clone() {
    const clonedParam = new Vec2Parameter(this.__name, this.__value.clone());
    return clonedParam
  }
}

/**
 * Represents a specific type of parameter, that only stores Vec3(three-dimensional coordinate) values.
 *
 * i.e.:
 * ```javascript
 * const vec3Param = new Vec3Parameter('MyVec3', new Vec3(1.2, 3.4, 1))
 * //'myParameterOwnerItem' is an instance of a 'ParameterOwner' class.
 * // Remember that only 'ParameterOwner' and classes that extend from it can host 'Parameter' objects.
 * myParameterOwnerItem.addParameter(vec3Param)
 * ```
 * @extends Parameter
 */
class Vec3Parameter extends Parameter {
  /**
   * Create a Vec3 parameter.
   * @param {string} name - The name of the Vec3 parameter.
   * @param {Vec3} value - The value of the parameter.
   * @param {array} range - The range value is an array of two `Vec2` objects.
   */
  constructor(name, value, range = undefined) {
    super(name, value ? value : new Vec3$1(), 'Vec3');
  }

  // ////////////////////////////////////////
  // Persistence

  /**
   * Extracts a number value from a buffer, updating current parameter state.
   *
   * @param {BinReader} reader - The reader value.
   * @param {object} context - The context value.
   */
  readBinary(reader, context) {
    this.__value.readBinary(reader);
  }

  // ////////////////////////////////////////
  // Clone

  /**
   * The clone method constructs a new Vec3 parameter, copies its values
   * from this parameter and returns it.
   *
   * @return {Vec3Parameter} - Returns a new Vec3 parameter.
   */
  clone() {
    const clonedParam = new Vec3Parameter(this.__name, this.__value.clone());
    return clonedParam
  }
}

/**
 * Represents a specific type of parameter, that only stores Vec3(four-dimensional coordinate) values.
 *
 * i.e.:
 * ```javascript
 * const vec4Param = new Vec4Parameter('MyVec4', new Vec4(1.2, 3.4, 1, 4.2))
 * //'myParameterOwnerItem' is an instance of a 'ParameterOwner' class.
 * // Remember that only 'ParameterOwner' and classes that extend from it can host 'Parameter' objects.
 * myParameterOwnerItem.addParameter(vec4Param)
 * ```
 *
 * @extends Parameter
 */
class Vec4Parameter extends Parameter {
  /**
   * Create a Vec4 parameter.
   * @param {string} name - The name of the Vec4 parameter.
   * @param {Vec4} value - The value of the parameter.
   */
  constructor(name, value) {
    super(name, value ? value : new Vec4$1(), 'Vec4');
  }

  // ////////////////////////////////////////
  // Persistence

  /**
   * Extracts a number value from a buffer, updating current parameter state.
   *
   * @param {BinReader} reader - The reader value.
   * @param {object} context - The context value.
   */
  readBinary(reader, context) {
    this.__value.readBinary(reader);
  }

  // ////////////////////////////////////////
  // Clone

  /**
   * The clone method constructs a new Vec4 parameter, copies its values
   * from this parameter and returns it.
   *
   * @return {Vec4Parameter} - Returns a new Vec4 parameter.
   */
  clone() {
    const clonedParam = new Vec4Parameter(this.__name, this.__value.clone());
    return clonedParam
  }
}

/**
 * Represents a specific type of parameter, that only stores `Color` values.
 *
 * i.e.:
 * ```javascript
 * const colorParam = new ColorParameter('MyColor', new Color(0, 254, 2))
 * //'myParameterOwnerItem' is an instance of a 'ParameterOwner' class.
 * // Remember that only 'ParameterOwner' and classes that extend from it can host 'Parameter' objects.
 * myParameterOwnerItem.addParameter(colorParam)
 * ```
 *
 * @extends Parameter
 */
class ColorParameter extends Parameter {
  /**
   * Create a color parameter.
   * @param {string} name - The name of the color parameter.
   * @param {Color} value - The value of the parameter.
   */
  constructor(name, value) {
    super(name, value ? value : new Color(), 'Color');
  }

  /**
   * Extracts `Color` values from a buffer, updating current parameter state.
   *
   * @param {BinReader} reader - The reader value.
   * @param {object} context - The context value.
   */
  readBinary(reader, context) {
    const value = reader.loadRGBAFloat32Color();
    // If the value is in linear space, then we should convert it to gamma space.
    // Note: !! this should always be done in preprocessing...
    value.applyGamma(2.2);

    this.__value = value;
  }

  /**
   * The clone method constructs a new color parameter,
   * copies its values from this parameter and returns it.
   *
   * @return {ColorParameter} - Returns a new cloned color parameter.
   */
  clone() {
    const clonedParam = new ColorParameter(this.__name, this.__value.clone());
    return clonedParam
  }
}

Registry.register('ColorParameter', ColorParameter);

/**
 * Represents a specific type of parameter, that only stores Mat3(3x3 matrix) values.
 *
 * i.e.:
 * ```javascript
 * const mat3Param = new Ma3Parameter('MyMat3', new Mat3(...args))
 * //'myParameterOwnerItem' is an instance of a 'ParameterOwner' class.
 * // Remember that only 'ParameterOwner' and classes that extend from it can host 'Parameter' objects.
 * myParameterOwnerItem.addParameter(mat3Param)
 * ```
 *
 * @extends Parameter
 */
class Mat3Parameter extends Parameter {
  /**
   * Create a Mat3 parameter.
   * @param {string} name - The name of the Mat3 parameter.
   * @param {Vec3} value - The value of the parameter.
   */
  constructor(name, value) {
    super(name, value ? value : new Mat3$1(), 'Mat3');
  }

  /**
   * Extracts a number value from a buffer, updating current parameter state.
   *
   * @param {BinReader} reader - The reader value.
   * @param {object} context - The context value.
   */
  readBinary(reader, context) {
    this.__value.readBinary(reader);
  }

  /**
   * The clone method constructs a new Mat3 parameter,
   * copies its values from this parameter and returns it.
   *
   * @return {Mat3Parameter} - Returns a new cloned Mat3 parameter.
   */
  clone() {
    const clonedParam = new Mat3Parameter(this.__name, this.__value.clone());
    return clonedParam
  }
}

/**
 * Represents a specific type of parameter, that only stores Mat4(4x4 matrix) values.
 *
 * i.e.:
 * ```javascript
 * const mat4Param = new Ma3Parameter('MyMat4', new Mat4(...args))
 * //'myParameterOwnerItem' is an instance of a 'ParameterOwner' class.
 * // Remember that only 'ParameterOwner' and classes that extend from it can host 'Parameter' objects.
 * myParameterOwnerItem.addParameter(mat4Param)
 * ```
 *
 * @extends Parameter
 */
class Mat4Parameter extends Parameter {
  /**
   * Create a Mat4 parameter.
   *
   * @param {string} name - The name of the Mat4 parameter.
   * @param {Mat4} value - The value of the parameter.
   */
  constructor(name, value) {
    super(name, value ? value : new Mat4(), 'Mat4');
  }

  /**
   * Extracts a number value from a buffer, updating current parameter state.
   *
   * @param {BinReader} reader - The reader value.
   * @param {object} context - The context value.
   */
  readBinary(reader, context) {
    this.__value.readBinary(reader);
  }

  /**
   * The clone method constructs a new Mat4 parameter,
   * copies its values from this parameter and returns it.
   *
   * @return {Mat4Parameter} - Returns a new cloned Mat4 parameter.
   */
  clone() {
    const clonedParam = new Mat4Parameter(this.__name, this.__value.clone());
    return clonedParam
  }
}

/**
 * Represents a specific type of parameter, that only stores `Xfo` transform values.
 *
 * ```javascript
 * const xfoParam = new XfoParameter('MyXfo', new Xfo(new Vec3(1.2, 3.4, 1)))
 * //'myParameterOwnerItem' is an instance of a 'ParameterOwner' class.
 * // Remember that only 'ParameterOwner' and classes that extend from it can host 'Parameter' objects.
 * myParameterOwnerItem.addParameter(xfoParam)
 * ```
 *
 * @extends Parameter
 */
class XfoParameter extends Parameter {
  /**
   * Create a Xfo parameter.
   * @param {string} name - The name of the Xfo parameter.
   * @param {Xfo} value - The value of the parameter.
   */
  constructor(name, value) {
    super(name, value ? value : new Xfo(), 'Xfo');
  }

  // ////////////////////////////////////////
  // Persistence

  /**
   * Extracts a number value from a buffer, updating current parameter state.
   *
   * @param {BinReader} reader - The reader value.
   * @param {object} context - The context value.
   */
  readBinary(reader, context) {
    this.__value.readBinary(reader);
  }

  // ////////////////////////////////////////
  // Clone

  /**
   * The clone method constructs a new Xfo parameter, copies its values
   * from this parameter and returns it.
   *
   * @return {XfoParameter} - Returns a new Xfo parameter.
   */
  clone() {
    const clonedParam = new XfoParameter(this.__name, this.__value.clone());
    return clonedParam
  }
}

/**
 * Represents a specific type of parameter, that only stores `BaseImage` values.
 *
 * i.e.:
 * ```javascript
 * // Since `Label` is a `BaseImage` implementation, it helps us with the example.
 * const label = new Label('My awesome label', 'LabelPack')
 * const imageParam = new ImageParameter('MyImage', label)
 * //'myParameterOwnerItem' is an instance of a 'ParameterOwner' class.
 * // Remember that only 'ParameterOwner' and classes that extend from it can host 'Parameter' objects.
 * myParameterOwnerItem.addParameter(imageParam)
 * ```
 *
 * @extends Parameter
 */
class ImageParameter extends Parameter {
  /**
   * Create an image parameter.
   *
   * @param {string} name - The name of the image parameter.
   * @param {BaseImage} value - The value of the parameter.
   */
  constructor(name, value) {
    super(name, value, 'BaseImage');
  }

  // ////////////////////////////////////////
  // Persistence

  /**
   * The toJSON method encodes this type as a json object for persistence.
   *
   * @param {object} context - The context value.
   * @return {object} - Returns the json object.
   */
  toJSON(context) {
    const j = super.toJSON(context);
    if (this.__value) {
      j.imageType = Registry.getBlueprintName(this.__value);
    }
    return j
  }

  /**
   * The fromJSON method decodes a json object for this type.
   *
   * @param {object} j - The json object this item must decode.
   * @param {object} context - The context value.
   * @return {object} - Returns the json object.
   */
  fromJSON(j, context) {
    if (j.imageType) {
      this.__value = Registry.constructClass(j.imageType);
    }
    return super.fromJSON(j, context)
  }

  // ////////////////////////////////////////
  // Clone

  /**
   * The clone method constructs a new image parameter,
   * copies its values from this parameter and returns it.
   *
   * @return {ImageParameter} - Returns a new cloned image parameter.
   */
  clone() {
    const clonedParam = new ImageParameter(this.__name, this.__value);
    return clonedParam
  }
}

/**
 * Represents a specific type of parameter, that only stores Mat4(4x4 matrix) values.
 *
 * i.e.:
 * ```javascript
 * const stringParam = new StringParameter('MyString', 'A String value goes here')
 * //'myParameterOwnerItem' is an instance of a 'ParameterOwner' class.
 * // Remember that only 'ParameterOwner' and classes that extend from it can host 'Parameter' objects.
 * myParameterOwnerItem.addParameter(stringParam)
 * ```
 *
 * @extends Parameter
 */
class StringParameter extends Parameter {
  /**
   * Create a string parameter.
   * @param {string} name - The name of the material color parameter.
   * @param {string} value - The value of the parameter.
   */
  constructor(name, value = '') {
    super(name, value, 'String');
    this.multiLine = false;
  }

  /**
   * Sets flag that indicates if the string contains new line feeds.
   *
   * @param {boolean} multiLine - The multiLine value.
   */
  setMultiLine(multiLine) {
    this.multiLine = multiLine;
  }

  /**
   * Returns multi-line flag value.
   *
   * @return {boolean} - The return value.
   */
  getMultiLine() {
    return this.multiLine
  }

  /**
   * Extracts the string value from a buffer, updating current parameter state.
   *
   * @param {BinReader} reader - The reader value.
   * @param {object} context - The context value.
   */
  readBinary(reader, context) {
    this.__value = reader.loadStr();
  }

  /**
   * The clone method constructs a new string parameter, copies its values
   * from this parameter and returns it.
   *
   * @return {StringParameter} - Returns a new string parameter.
   */
  clone() {
    const clonedParam = new StringParameter(this.__name, this.__value);
    return clonedParam
  }
}

Registry.register('StringParameter', StringParameter);
Registry.register('Property_String', StringParameter);

/**
 * Represents a specific type of parameter, that only stores `string` values.
 *
 * i.e.:
 * ```javascript
 * const codeStr = `const sayHello = () => console.log('Hello World')`
 * const codeParam = new CodeParameter('MyCode', codeStr)
 * //'myParameterOwnerItem' is an instance of a 'ParameterOwner' class.
 * // Remember that only 'ParameterOwner' and classes that extend from it can host 'Parameter' objects.
 * myParameterOwnerItem.addParameter(codeParam)
 * ```
 *
 * @extends StringParameter
 */
class CodeParameter extends StringParameter {
  /**
   * Creates a code parameter.
   * The default language is `js`.
   *
   * @param {string} name - The name of the code parameter.
   * @param {string} value - The value of the parameter.
   */
  constructor(name, value = '') {
    super(name, value, 'String');
    this.lang = 'js';
  }

  /**
   * Sets code language for parameter.
   *
   * @param {string} lang - The language value.
   */
  setLanguage(lang) {
    this.lang = lang;
  }

  /**
   * Returns code language of parameter.
   *
   * @return {string} - Returns the language.
   */
  getLanguage() {
    return this.lang
  }

  /**
   * The clone method constructs a new code parameter,
   * copies its values from this parameter and returns it.
   *
   * @return {CodeParameter} - Returns a new cloned code parameter.
   */
  clone() {
    const clonedParam = new CodeParameter(this.__name, this.__value);
    return clonedParam
  }
}

Registry.register('CodeParameter', CodeParameter);

/**
 * Represents a specific type of parameter, that only stores any type of list values.
 *
 * i.e.:
 * ```javascript
 * const listParam = new ListParameter('MyList', GearParameter)
 * //'myParameterOwnerItem' is an instance of a 'ParameterOwner' class.
 * // Remember that only 'ParameterOwner' and classes that extend from it can host 'Parameter' objects.
 * myParameterOwnerItem.addParameter(listParam)
 * ```
 *
 * **Events**
 * * **valueChanged:** Triggered when setting a value changes in the array(insert, add, remove).
 * * **elementAdded:** Triggered when an element is added to the array(add, insert).
 * * **elementRemoved:** Triggered when an element is removed from the array
 *
 * @extends Parameter
 */
class ListParameter extends Parameter {
  /**
   * Create a list parameter.
   * @param {string} name - The name of the list parameter.
   * @param {string|Parameter} dataType - The dataType value.
   */
  constructor(name, dataType) {
    super(name, []);
    this.__dataType = dataType;
  }

  /**
   * The __filter method.
   * @param {string|Parameter} item - The item value.
   * @return {boolean} - The return value.
   *
   * @private
   */
  __filter(item) {
    return true
  }

  /**
   * Returns the count of items in the array.
   *
   * @return {number} - The return value.
   */
  getCount() {
    return this.__value.length
  }

  /**
   * Returns value from the array in the specified index.
   *
   * @param {number} index - The index value.
   * @return {Parameter|string} - The return value.
   */
  getElement(index) {
    return this.__value[index]
  }

  /**
   * Sets a value in the specified array's index.
   *
   * @param {number} index - The index value.
   * @param {string|Parameter} value - The value value.
   */
  setElement(index, value) {
    this.__value[index] = value;
    this.emit('valueChanged', {});
  }

  /**
   * Adds a new element at the end of the array pile.
   *
   * @param {string|Parameter} elem - The elem value.
   * @return {string|Parameter} - The return value.
   */
  addElement(elem) {
    if (elem == undefined) elem = new this.__dataType();
    else {
      if (!this.__filter(elem)) return
    }

    this.__value.push(elem);
    this.emit('elementAdded', { elem, index: this.__value.length - 1 });
    this.emit('valueChanged', {});
    return elem
  }

  /**
   * Removes an array element from the specified index
   *
   * @param {number} index - The index value.
   */
  removeElement(index) {
    const elem = this.__value[index];
    this.__value.splice(index, 1);
    this.emit('elementRemoved', { elem, index });
    this.emit('valueChanged', {});
  }

  /**
   * Inserts a new element in the specified index.
   *
   * @param {number} index - The index value.
   * @param {string|Parameter} elem - The elem value.
   */
  insertElement(index, elem) {
    if (!this.__filter(elem)) return
    this.__value.splice(index, 0, elem);
    // this.setValue(this.__value);
    this.emit('elementAdded', { elem, index });
    this.emit('valueChanged', {});
  }

  // ////////////////////////////////////////
  // Persistence

  /**
   * The toJSON method encodes this type as a json object for persistence.
   *
   * @param {object} context - The context value.
   * @return {object} - Returns the json object.
   */
  toJSON(context) {
    const items = [];
    for (const p of this.__value) {
      if (typeof this.__dataType === 'string') items.push(p);
      else items.push(p.toJSON(context));
    }
    return {
      items,
    }
  }

  /**
   * The fromJSON method decodes a json object for this type.
   *
   * @param {object} j - The json object this item must decode.
   * @param {object} context - The context value.
   */
  fromJSON(j, context) {
    if (j.items == undefined) {
      console.warn('Invalid Parameter JSON');
      return
    }

    this.__value = [];
    for (let i = 0; i < j.items.length; i++) {
      let elem;
      if (typeof this.__dataType === 'string') {
        elem = j.items[i];
      } else {
        console.log(this.__dataType);
        elem = new this.__dataType();
        elem.fromJSON(j.items[i], context);
      }
      this.__value.push(elem);
      this.emit('elementAdded', { elem, index: this.__value.length - 1 });
    }
    this.emit('valueChanged', { mode: 0 });
  }

  // ////////////////////////////////////////
  // Clone and Destroy

  /**
   * The clone method constructs a new list parameter, copies its values
   * from this parameter and returns it.
   *
   * @return {ListParameter} - Returns a new list parameter.
   */
  clone() {
    const clonedValue = this.__value.slice(0);
    const clonedParam = new ListParameter(this.__name, this.__dataType);
    clonedParam.setValue(clonedValue);
    return clonedParam
  }

  /**
   * The destroy is called by the system to cause explicit resources cleanup.
   * Users should never need to call this method directly.
   */
  destroy() {
    for (let i = 0; i < this.__value.length; i++) {
      if (this.__value[i] instanceof Parameter) this.__value[i].destroy();
      this.removeElement(i);
    }
  }
}

/**
 * Represents a specific type of parameter, that stores multiple parameters in object format.
 *
 * i.e.:
 * ```javascript
 * const structParam = new StructParameter('MyStructParam')
 * //'myParameterOwnerItem' is an instance of a 'ParameterOwner' class.
 * // Remember that only 'ParameterOwner' and classes that extend from it can host 'Parameter' objects.
 * myParameterOwnerItem.addParameter(structParam)
 * ```
 *
 * **Events**
 * * **valueChanged:** Triggered whenever parameter's value changes.
 *
 * @extends Parameter
 */
class StructParameter extends Parameter {
  /**
   * Create a struct parameter.
   * @param {string} name - The name of the struct parameter.
   */
  constructor(name) {
    super(name, {}, 'Struct');
    this.__members = [];
  }

  /**
   * The _addMember method.
   * @param {Parameter} parameter - The parameter value.
   * @return {Parameter} - The return value.
   * @private
   */
  _addMember(parameter) {
    this.__value[parameter.getName()] = parameter.getValue();
    parameter.on('valueChanged', () => {
      this.__value[parameter.getName()] = parameter.getValue();
    });
    this.__members.push(parameter);
    this.emit('valueChanged', {});
    return parameter
  }

  /**
   * The getParameter method.
   *
   * @private
   * @param {string} name - The parameter name.
   * @return {Parameter} - The return value.
   */
  getParameter(name) {
    for (const p of this.__members) {
      if (p.getName() == name) return p
    }
  }

  /**
   * Looks for a member parameter with the specified name and returns it.
   *
   * @param {string} name - The parameter name.
   * @return {Parameter} - The return value.
   */
  getMember(name) {
    return this.getParameter(name)
  }

  /**
   * Returns the name of all parameters in StructParameter.
   *
   * @return {array} - The return value.
   */
  getMemberNames() {
    const names = [];
    for (let i = 0; i < this.__members.length; i++) {
      const member = this.__members[i];
      if (member != null) names[i] = member.getName();
    }
    return names
  }

  // ////////////////////////////////////////
  // Persistence

  /**
   * The toJSON method encodes this type as a json object for persistence.
   *
   * @param {object} context - The context value.
   * @return {object} - Returns the json object.
   */
  toJSON(context) {
    const members = [];
    for (const p of this.__members) members.push(p.toJSON(context));
    return {
      members,
    }
  }

  /**
   * The fromJSON method decodes a json object for this type.
   *
   * @param {object} j - The json object this item must decode.
   * @param {object} context - The context value.
   */
  fromJSON(j, context) {
    if (j.members == undefined) {
      console.warn('Invalid Parameter JSON');
      return
    }

    for (let i = 0; i < j.members.length; i++) {
      if (j.members[i]) {
        this.__members[i].fromJSON(j.members[i], context);
      }
    }
  }

  // ////////////////////////////////////////
  // Destroy

  /**
   * The destroy is called by the system to cause explicit resources cleanup.
   * Users should never need to call this method directly.
   */
  destroy() {
    super.destroy();
    for (const p of this.__members) p.destroy();
  }
}

/* eslint-disable require-jsdoc */

/**
 * Represents a specific type of parameter, that only stores `TreeItem` values.
 *
 * i.e.:
 * ```javascript
 * const treeItem = new TreeItem('tree1')
 * const treeItemParam = new TreeItemParameter('MyTreeItem', treeItem)
 * //'myParameterOwnerItem' is an instance of a 'ParameterOwner' class.
 * // Remember that only 'ParameterOwner' and classes that extend from it can host 'Parameter' objects.
 * myParameterOwnerItem.addParameter(treeItemParam)
 * ```
 *
 * **Events**
 * * **treeItemGlobalXfoChanged:** Triggered when computed world Xfo of parameter's `TreeItem` changes.
 * * **valueChanged:** Triggered when parameter's value changes.
 *
 * @extends Parameter
 */
class TreeItemParameter extends Parameter {
  /**
   * Create a tree item parameter.
   * @param {string} name - The name of the tree item parameter.
   * @param {function} filterFn - The filterFn value.
   */
  constructor(name, filterFn = undefined) {
    super(name, undefined, 'TreeItem');
    this.__filterFn = filterFn;
    this.__emittreeItemGlobalXfoChanged = this.__emittreeItemGlobalXfoChanged.bind(this);
  }

  __emittreeItemGlobalXfoChanged(event) {
    this.emit('treeItemGlobalXfoChanged', event);
  }

  /**
   * Sets parameter value's owner `TreeItem`.
   *
   * @param {TreeItem} owner - The owner value.
   */
  setOwner(owner) {
    this.__owner = owner;
  }

  /**
   * Returns parameter value's owner `TreeItem`.
   *
   * @return {TreeItem} - The return value.
   */
  getOwner() {
    return this.__owner
  }

  /**
   * The setFilterFn method.
   * @param {function} flterFn - The flterFn value.
   */
  setFilterFn() {
    this.__filterFn = filterFn;
  }

  /**
   * The getFilterFn method.
   * @return {function} - The return value.
   */
  getFilterFn() {
    return this.__filterFn
  }

  /**
   * Sets parameter's `TreeItem` value.
   *
   * @param {TreeItem} treeItem - The treeItem value
   * @return {boolean} - The return value.
   */
  setValue(treeItem) {
    // 0 == normal set. 1 = changed via cleaner fn, 2=change by loading/cloning code.
    if (this.__filterFn && !this.__filterFn(treeItem)) return false
    if (this.__value !== treeItem) {
      if (this.__value) {
        this.__value.off('globalXfoChanged', this.__emittreeItemGlobalXfoChanged);
      }
      this.__value = treeItem;
      if (this.__value) {
        this.__value.on('globalXfoChanged', this.__emittreeItemGlobalXfoChanged);
      }

      this.emit('valueChanged', {});
    }
  }

  // ////////////////////////////////////////
  // Persistence

  /**
   * The toJSON method encodes this type as a json object for persistence.
   *
   * @param {object} context - The context value.
   * @return {object} - Returns the json object.
   */
  toJSON(context) {
    return {
      value: context.makeRelative(this.__value.getPath()),
    }
  }

  /**
   * The fromJSON method decodes a json object for this type.
   *
   * @param {object} j - The json object this item must decode.
   * @param {object} context - The context value.
   */
  fromJSON(j, context) {
    if (j.value == undefined) {
      console.warn('Invalid Parameter JSON');
      return
    }
    context.resolvePath(
      j.value,
      (treeItem) => {
        this.setValue(treeItem);
      },
      () => {
        console.warn('Unable to resolve tree item parameter value:' + pj.paramPath);
      }
    );
  }

  // ////////////////////////////////////////
  // Clone and Destroy

  /**
   * The clone method constructs a new tree item parameter, copies its values
   * from this parameter and returns it.
   *
   * @return {TreeItemParameter} - Returns a new tree item parameter.
   */
  clone() {
    const clonedParam = new TreeItemParameter(this.__name, this.__filterFn);
    return clonedParam
  }

  /**
   * The destroy is called by the system to cause explicit resources cleanup.
   * Users should never need to call this method directly.
   */
  destroy() {
    if (this.__value) {
      this.__value.off('globalXfoChanged', this.__emittreeItemGlobalXfoChanged);
    }
  }
}

/** Class representing an item set parameter.
 * @extends Parameter
 * @private
 */
class ItemSetParameter extends Parameter {
  /**
   * Create an item set parameter.
   * @param {string} name - The name of the item set parameter.
   * @param {any} filterFn - The filterFn value.
   */
  constructor(name, filterFn) {
    super(name, undefined, 'BaseItem');
    this.__items = new Set();
    this.__filterFn = filterFn; // Note: the filter Fn indicates that users will edit the set.
  }

  /**
   * The setFilterFn method.
   * @param {any} filterFn - The filterFn value.
   */
  setFilterFn(filterFn) {
    this.__filterFn = filterFn;
  }

  /**
   * The getFilterFn method.
   * @return {any} - The return value.
   */
  getFilterFn() {
    return this.__filterFn
  }

  /**
   * The getItem method.
   * @param {number} index - The index param.
   * @return {any} - The return value.
   */
  getItem(index) {
    return Array.from(this.__items)[index]
  }

  /**
   * The addItem method.
   * @param {any} item - The item value.
   * @param {boolean} emitValueChanged - The emit value.
   * @return {boolean} - The return value.
   */
  addItem(item, emitValueChanged = true) {
    if (this.__filterFn && !this.__filterFn(item)) {
      console.warn('ItemSet __filterFn rejecting item:', item.getPath());
      return false
    }
    this.__items.add(item);
    const index = Array.from(this.__items).indexOf(item);
    this.emit('itemAdded', { item, index });
    if (emitValueChanged) this.emit('valueChanged', {});
    return index
  }

  /**
   * Adds items to the parameter value
   *
   * @param {Set} items - list of items to add to the parameter
   * @param {boolean} [emitValueChanged=true]
   * @memberof ItemSetParameter
   */
  addItems(items, emitValueChanged = true) {
    items.forEach((item) => this.addItem(item, false));
    if (emitValueChanged) this.emit('valueChanged', {});
  }

  /**
   * The removeItem method.
   * @param {any} index - The index value.
   * @param {boolean} emitValueChanged - The emit param.
   * @return {any} - The return value.
   */
  removeItem(index, emitValueChanged = true) {
    const item = Array.from(this.__items)[index];
    this.__items.delete(item);
    this.emit('itemRemoved', { item, index });
    if (emitValueChanged) this.emit('valueChanged', {});
    return item
  }

  /**
   * The setItems method.
   * @param {any} items - The item param.
   * @param {boolean} emit - The emit param.
   */
  setItems(items, emit = true) {
    for (let i = this.__items.length - 1; i >= 0; i--) {
      const item = this.__items[i];
      if (!items.has(item)) {
        this.removeItem(item, false);
      }
    }
    for (const item of items) {
      if (!this.__items.has(item)) {
        this.addItem(item, false);
      }
    }
    if (emit) this.emit('valueChanged', {});
  }

  /**
   * The clearItems method.
   * @param {boolean} emit - The emit value.
   */
  clearItems(emitValueChanged = true) {
    this.__items.clear();
    if (emitValueChanged) this.emit('valueChanged', {});
  }

  /**
   * The getNumItems method.
   * @return {any} - The return value.
   */
  getNumItems() {
    return Array.from(this.__items).length
  }

  /**
   * The getValue method.
   * @return {any} - The return value.
   */
  getValue() {
    return this.__items
  }

  // ////////////////////////////////////////
  // Persistence

  /**
   * The toJSON method encodes this type as a json object for persistence.
   * @param {object} context - The context value.
   * @return {object} - The return value.
   */
  toJSON(context) {
    return {}
  }

  /**
   * The fromJSON method decodes a json object for this type.
   * @param {object} j - The json object this item must decode.
   * @param {object} context - The context value.
   */
  fromJSON(j, context) {}

  // ////////////////////////////////////////
  // Clone

  /**
   * The clone method constructs a item set new parameter, copies its values
   * from this parameter and returns it.
   *
   * @return {ItemSetParameter} - Returns a new item set parameter.
   */
  clone() {
    const clonedParam = new ItemSetParameter(this.__name, this.__filterFn);
    return clonedParam
  }
}

/** Class representing a proxy parameter. Proxies are used to connect
 * a parameter on one object with another. An existing parameter is
 * replaced with a proxy that binds to a parameter on another object.
 * @extends Parameter
 * @private
 */
class ProxyParameter extends Parameter {
  /**
   * Create a proxy parameter.
   * @param {string} name - The name of the proxy parameter.
   * @param {Parameter} sourceParameter - The source parameter to proxy.
   */
  constructor(name, sourceParameter) {
    super(name, undefined, sourceParameter.getDataType());
    this.setSourceParameter(sourceParameter);
  }

  /**
   * The setValue method.
   * @param {any} value - The value param.
   */
  setSourceParameter(sourceParameter) {
    this.sourceParameter = sourceParameter;
    this.sourceParameter.on('valueChanged', this.__proxyValueChanged.bind(this));
  }

  /**
   * @private
   * Handles propagating the valueChanged event from the source param
   * @param {any} value - The value param.
   */
  __proxyValueChanged(event) {
    this.emit('valueChanged', event);
  }

  /**
   * The getDataType method.
   * @return {any} - The return value.
   */
  getDataType() {
    return this.sourceParameter.getDataType()
  }

  /**
   * The setValue method.
   * @param {any} value - The value param.
   */
  setValue(value) {
    // this.sourceParameter.setValue(value)
  }

  /**
   * The getValue method.
   * @return {any} - The return value.
   */
  getValue() {
    return this.sourceParameter.getValue()
  }

  // ////////////////////////////////////////
  // Persistence

  /**
   * The toJSON method encodes this type as a json object for persistence.
   * @param {object} context - The context value.
   * @return {object} - Returns the json object.
   */
  toJSON(context) {
    const j = super.toJSON(context);
    if (this.sourceParameter) j.sourceParameter = this.sourceParameter.getPath();
    return j
  }

  /**
   * The fromJSON method decodes a json object for this type.
   * @param {object} j - The json object this item must decode.
   * @param {object} context - The context value.
   */
  fromJSON(j, context) {
    super.fromJSON(j, context);
    if (j.sourceParameter) {
      // Note: the tree should have fully loaded by the time we are loading operators
      // even new items and groups should have been created. Operators and state machines
      // are loaded last.
      context.resolvePath(
        j.sourceParameter,
        (param) => {
          this.setSourceParameter(param);
        },
        (reason) => {
          console.warn("Error loading Proxy Param: '" + this.getName() + "'. Unable to connect to:" + j.sourceParameter);
        }
      );
    }
    if (j.range) this.sourceParameter = j.range;
    if (j.step) this.__step = j.step;
  }

  // ////////////////////////////////////////
  // Clone

  /**
   * The clone method constructs a new number parameter, copies its values
   * from this parameter and returns it.
   *
   * @param {object} context - The context object.
   * @return {ProxyParameter} - Returns a new number parameter.
   */
  clone(context) {
    const clonedParam = new ProxyParameter(this.__name, this.__value);
    if (this.sourceParameter) {
      this.connectToClonedSourceParam(context);
    }
    return clonedParam
  }

  /**
   * During cloning, we need to reconnect references to other items in the tree
   * These other items may/may not be being cloned also, and so we need to request
   * the context that it resolve the item.
   * @param {CloneContext} context - The context object that can resolve references.
   */
  connectToClonedSourceParam(context) {
    context.resolveClonedItem(
      this.sourceParameter,
      (param) => {
        clonedParam.setSourceParameter(param);
      },
      (reason) => {
        console.warn("Error cloning Proxy Param: '" + this.getName() + "'. Unable to connect to:" + j.sourceParameter);
      }
    );
  }
}

Registry.register('ProxyParameter', ProxyParameter);

/** Class representing a geometry parameter.
 * @extends Parameter
 * @private
 */
class GeometryParameter extends Parameter {
  /**
   * Create a geometry parameter.
   * @param {string} name - The name of the color parameter.
   * @param {any} value - The value of the parameter.
   */
  constructor(name, value) {
    super(name, undefined, 'Geometry');
    this.setValue(value);

    this.__emitBoundingBoxDirtied = this.__emitBoundingBoxDirtied.bind(this);
  }

  // eslint-disable-next-line require-jsdoc
  __emitBoundingBoxDirtied(event) {
    this.emit('boundingBoxChanged', event);
  }

  /**
   * The setValue method.
   * @param {any} geom - The geom value.
   */
  setValue(geom) {
    // 0 == normal set. 1 = changed via cleaner fn, 2 = change by loading/cloning code.
    if (this.__value !== geom) {
      if (this.__value) {
        this.__value.off('boundingBoxChanged', this.__emitBoundingBoxDirtied);
      }
      this.__value = geom;
      if (this.__value) {
        this.__value.on('boundingBoxChanged', this.__emitBoundingBoxDirtied);
      }

      this.emit('valueChanged', {});
    }
  }

  // ////////////////////////////////////////
  // Persistence

  /**
   * The toJSON method encodes this type as a json object for persistence.
   * @param {object} context - The context value.
   * @return {object} - Returns the json object.
   */
  toJSON(context) {
    return super.toJSON(context)
  }

  /**
   * The fromJSON method decodes a json object for this type.
   * @param {object} j - The json object this item must decode.
   * @param {object} context - The context value.
   * @return {object} - Returns the json object.
   */
  fromJSON(j, context) {
    return super.fromJSON(j, context)
  }

  // ////////////////////////////////////////
  // Clone and Destroy

  /**
   * The clone method constructs a new geometry parameter, copies its values
   * from this parameter and returns it.
   * @return {GeometryParameter} - Returns a new geometry parameter.
   */
  clone() {
    const clonedParam = new GeometryParameter(this.__name, this.__value);
    return clonedParam
  }

  /**
   * The destroy is called by the system to cause explicit resources cleanup.
   * Users should never need to call this method directly.
   */
  destroy() {
    // Note: some parameters hold refs to geoms/materials,
    // which need to be explicitly cleaned up.
    // e.g. freeing GPU Memory.

    if (this.__value) {
      this.__value.off('boundingBoxChanged', this.__emitBoundingBoxDirtied);
    }
  }
}

/**
 * Represents a specific type of parameter, that only stores file data values.
 *
 * **Events**
 * * **valueChanged:** Triggered when setting file's URL.
 * * **fileUpdated:** Triggered when parameter's value is updated.
 *
 * @extends Parameter
 */
class FilePathParameter extends Parameter {
  /**
   * Create a file path parameter.
   *
   * @param {string} name - The name of the file path parameter.
   * @param {string} exts - The exts value.
   */
  constructor(name) {
    super(name, '', 'FilePath');
  }

  /**
   * Returns complete file path.
   *
   * @return {string} - The return value.
   */
  getFilepath() {
    if (this.__value) {
      return resourceLoader.getFilepath(this.__value)
    }

    return ''
  }

  /**
   * Resolves resourceId using the specified path and sets its value to the parameter.
   *
   * @param {string} filePath - The filePath value.
   */
  setFilepath(filePath) {
    this.setValue(resourceLoader.resolveFileId(filePath));
  }

  /**
   * Returns parameter's file name
   *
   * @return {string} - The return value.
   */
  getFilename() {
    return resourceLoader.resolveFilename(this.__value)
  }

  /**
   * Returns parameter's file extension
   *
   * @return {string} - The return value.
   */
  getExt() {
    const filename = this.getFilename();
    const suffixSt = filename.lastIndexOf('.');
    if (suffixSt != -1) return filename.substring(suffixSt).toLowerCase()
  }

  /**
   * Returns parameter's file name without extension
   *
   * @return {string} - The return value.
   */
  getStem() {
    const filename = this.getFilename();
    if (filename) {
      const parts = filename.split('.');
      if (parts.length == 2) return parts[0]
      else return filename
    }
  }

  /**
   * Returns file object, which contains the url, resourceId and the name.
   *
   * @return {object} - The return value.
   */
  getFileDesc() {
    return this.getFile()
  }

  /**
   * Returns file object, which contains the url, resourceId and the name.
   *
   * @return {object} - The return value.
   */
  getFile() {
    return { id: this.__value, url: this.getUrl(), name: this.getFilename() }
  }

  /**
   * Sets file data.
   *
   * @param {string} url - the url value of the
   * @param {string} name - (optional) the name of the file that the Url points to.
   */
  setUrl(url, name) {
    this.setValue(resourceLoader.resolveFileId(url));
  }

  /**
   * Returns the file url string.
   *
   * @return {string} - The return value.
   */
  getUrl() {
    return resourceLoader.resolveURL(this.__value)
  }

  /**
   * Sets file parameter value
   *
   * @param {string} value - The value param.
   */
  setValue(value) {
    if (value == undefined) {
      throw new Error('Invalid value for setValue.')
    }
    // Note: equality tests only work on simple types.
    // Important here because file changes cause reloads..
    if (value == this.__value) {
      return
    }

    this.__value = value;

    this.emit('valueChanged', {});
  }
  // ////////////////////////////////////////
  // Persistence

  /**
   * The toJSON method encodes this type as a json object for persistence.
   *
   * @param {object} context - The context value.
   * @return {object} - Returns the json object.
   */
  toJSON(context) {
    const j = {};
    if (this.__file) {
      j.value = this.__value;
    }
    return j
  }

  /**
   * The fromJSON method decodes a json object for this type.
   *
   * @param {object} j - The json object this item must decode.
   * @param {object} context - The context value.
   */
  fromJSON(j, context) {
    if (j.value) {
      this.__value = j.value;
    }
  }

  // ////////////////////////////////////////
  // Clone and Destroy

  /**
   * The clone method constructs a new file path parameter,
   * copies its values from this parameter and returns it.
   *
   * @return {FilePathParameter} - Returns a new cloned file path parameter.
   */
  clone() {
    const clonedParam = new FilePathParameter(this.__name);
    clonedParam.__file = this.__file;
    return clonedParam
  }
}

/**
 * Represents a specific type of parameter, that only stores `Material` values.
 *
 * i.e.:
 * ```javascript
 * const material = new Material('itemMaterial', 'SimpleSurfaceShader')
 * material.getParameter('BaseColor').setValue(new Color(89 / 255, 182 / 255, 92 / 255))
 *
 * const materialParam = new MaterialParameter('MyMaterial', material)
 * //'myParameterOwnerItem' is an instance of a 'ParameterOwner' class.
 * // Remember that only 'ParameterOwner' and classes that extend from it can host 'Parameter' objects.
 * myParameterOwnerItem.addParameter(materialParam)
 * ```
 * **Events**
 * * **valueParameterValueChanged:** Triggered when parameter's value changes.
 * * **valueChanged:** Triggered when parameter's value changes, except on cleaning processes.
 *
 * @extends Parameter
 */
class MaterialParameter extends Parameter {
  /**
   * Create a material parameter.
   * @param {string} name - The name of the material parameter.
   * @param {Material} value - The value of the parameter.
   */
  constructor(name, value) {
    super(name, value, 'Material');
    this.__valueParameterValueChanged = this.__valueParameterValueChanged.bind(this);
  }

  // eslint-disable-next-line require-jsdoc
  __valueParameterValueChanged(event) {
    this.emit('valueParameterValueChanged', event);
  }

  /**
   * Sets `Material` value of the parameter.
   *
   * @param {Material} material - The material param.
   */
  setValue(material) {
    // 0 == normal set. 1 = changed via cleaner fn, 2 = change by loading/cloning code.
    if (this.__value !== material) {
      if (this.__value) {
        this.__value.off('parameterValueChanged', this.__valueParameterValueChanged);
      }
      this.__value = material;
      if (this.__value) {
        this.__value.on('parameterValueChanged', this.__valueParameterValueChanged);
      }

      // During the cleaning process, we don't want notifications.
      this.emit('valueChanged', {});
    }
  }

  // ////////////////////////////////////////
  // Persistence

  /**
   * The toJSON method encodes this type as a json object for persistence.
   *
   * @param {object} context - The context value.
   * @return {object} - Returns the json object.
   */
  toJSON(context) {
    return this.__value ? { value: this.__value.getPath() } : undefined
  }

  /**
   * The fromJSON method decodes a json object for this type.
   *
   * @param {object} j - The json object this item must decode.
   * @param {object} context - The context value.
   */
  fromJSON(j, context) {
    if (j.value == undefined) {
      console.warn('Invalid Parameter JSON');
      return
    }

    if (j.value instanceof array || j.value instanceof string) {
      if (context && context.assetItem) {
        const materialLibrary = context.assetItem.getMaterialLibrary();
        const material = materialLibrary.getMaterial(j.value instanceof array ? j.value[1] : j.value);
        if (material) {
          this.loadValue(material);
        }
      }
    }
  }

  // ////////////////////////////////////////
  // Clone and Destroy

  /**
   * The clone method constructs a new material parameter, copies its values
   * from this parameter and returns it.
   *
   * @return {MaterialParameter} - Returns a new material parameter.
   */
  clone() {
    const clonedParam = new MaterialParameter(this.__name, this.__value);
    return clonedParam
  }

  /**
   * The destroy is called by the system to cause explicit resources cleanup.
   * Users should never need to call this method directly.
   */
  destroy() {
    // Note: Some parameters hold refs to geoms/materials,
    // which need to be explicitly cleaned up.
    // E.g. freeing GPU Memory.

    if (this.__value) {
      this.__value.off('parameterValueChanged', this.__valueParameterValueChanged);
    }
  }
}

/**
 * Represents a 2D image item, containing width and height.
 *
 * **Parameters**
 * * **AlphaFromLuminance(`BooleanParameter`):** Sets alpha chanel to the luminance of the image and all color channels to `0`.
 * * **Invert(`BooleanParameter`):** Horizontally flips the image(Basically inverting X pixels).
 * * **FlipY(`BooleanParameter`):** Vertically flips the image, meaning that it would be upside down if enabled.
 *
 * **Events**
 * * **updated:** Triggered when the value of any of the parameters listed above changes.
 *
 * @extends BaseItem
 */
class BaseImage extends BaseItem {
  /**
   * Creates an instance of BaseImage.
   * @param {string} name - name of the item
   */
  constructor(name) {
    super(name);
    this.width = 0;
    this.height = 0;
    this.format = 'RGB';
    this.type = 'UNSIGNED_BYTE';

    this.addParameter(new BooleanParameter('AlphaFromLuminance', false));
    this.addParameter(new BooleanParameter('Invert', false));
    this.addParameter(new BooleanParameter('FlipY', false));

    this.on('parameterValueChanged', (event) => {
      this.emit('updated');
    });

    // Note: Many parts of the code assume a 'loaded' signal.
    // We should probably deprecate and use only 'updated'.
    // Instead we should start using a loaded Promise.
    this.loaded = false;
  }

  /**
   * Returns true if loaded.
   * @private
   * @return {boolean} - Returns a boolean.
   */
  isLoaded() {
    return true
  }

  /**
   * Returns mapping object state of the item.
   * @return {object|undefined} - The return value.
   */
  getMapping() {
    return this.__mapping
  }

  /**
   * Sets mapping structure object in the state of the item.
   * @param {object} mapping - The mapping value.
   */
  setMapping(mapping) {
    this.__mapping = mapping;
  }

  /**
   * Base images are static content, so the value for this method is always going to be `false`
   *
   * @return {boolean} - Returns a boolean.
   */
  isStream() {
    return false
  }

  /**
   * The isStreamAtlas method.
   * @private
   * @return {boolean} - Returns a boolean.
   */
  isStreamAtlas() {
    return this.__streamAtlas
  }

  /**
   * Returns all parameters and class state values.
   *
   * @return {object} - The return value.
   */
  getParams() {
    return {
      type: this.type,
      format: this.format,
      width: this.width,
      height: this.height,
      flipY: this.getParameter('FlipY').getValue(),
      invert: this.getParameter('Invert').getValue(),
      alphaFromLuminance: this.getParameter('AlphaFromLuminance').getValue(),
    }
  }
}

/**
 * Represents a specific type of parameter, that stores `number` and `BaseImage` texture values.
 *
 * i.e.:
 * ```javascript
 * const image = new LDRImage();
 * image.getParameter('FilePath').setUrl("https://storage.googleapis.com/zea-playground-assets/zea-engine/texture.png")
 *
 * const numberParam = new MaterialFloatParam('MyMaterialFloat', 15.5)
 * numberParam.setImage(image)
 * //'myParameterOwnerItem' is an instance of a 'ParameterOwner' class.
 * // Remember that only 'ParameterOwner' and classes that extend from it can host 'Parameter' objects.
 * myParameterOwnerItem.addParameter(numberParam)
 * ```
 *
 * * **Events**
 * * **valueChanged:** Triggered every time the Image value changes
 * * **textureDisconnected:** Triggered when Image value is cleaned/removed.
 * * **textureConnected:** Triggered when the Image value is set.
 *
 * @extends NumberParameter
 */
class MaterialFloatParam extends NumberParameter {
  /**
   * Create a material float parameter.
   * @param {string} name - The name of the material color parameter.
   * @param {number} value - The value of the parameter.
   * @param {array} range - An array with two numbers. If defined, the parameter value will be clamped.
   */
  constructor(name, value, range) {
    super(name, value, range);
  }

  /**
   * Returns `BaseImage` texture of the Material.
   *
   * @return {BaseImage} - The return value.
   */
  getImage() {
    return this.__image
  }

  /**
   * Sets `BaseImage` texture value in parameter.
   *
   * @param {BaseImage} value - The value value.
   */
  setImage(value) {
    const disconnectImage = () => {
      // image.off('loaded', imageUpdated);
      // image.off('updated', imageUpdated);
      this.emit('textureDisconnected', {});
    };
    if (value) {
      if (this.__image != undefined && this.__image !== value) {
        disconnectImage();
      }
      this.__image = value;
      // image.on('loaded', imageUpdated);
      // image.on('updated', imageUpdated);
      this.emit('textureConnected', {});
      this.emit('valueChanged', { mode: 0 });
    } else {
      if (this.__image != undefined) {
        disconnectImage();
        this.__image = undefined;
        this.emit('textureDisconnected', {});
      }
    }
  }

  /**
   * Sets `number` or the `BaseImage` texture value in parameter.
   *
   * @param {number} value - The value param.
   */
  setValue(value) {
    if (value instanceof BaseImage) {
      this.setImage(value);
    } else {
      if (this.__image != undefined) {
        this.setImage(undefined);
      }
      super.setValue(value);
    }
  }

  /**
   * Extracts `number` and `Image` values from a buffer, updating current parameter state.
   *
   * @param {object} reader - The reader value.
   * @param {object} context - The context value.
   */
  readBinary(reader, context) {
    super.readBinary(reader, context);

    const textureName = reader.loadStr();
    if (textureName != '') {
      console.log('Load Texture');
      this.setImage(context.materialLibrary.getImage(textureName));
    }
  }

  /**
   * The clone method constructs a new material float parameter,
   * copies its values from this parameter and returns it.
   *
   * @return {MaterialFloatParam} - Returns a new cloned material float parameter.
   */
  clone() {
    const clonedParam = new MaterialFloatParam(this.__name, this.__value.clone());
    return clonedParam
  }
}

Registry.register('MaterialFloatParam', MaterialFloatParam);

/**
 * Represents a specific type of parameter, that stores `Color` and `BaseImage` texture values.
 *
 * i.e.:
 * ```javascript
 * const image = new LDRImage();
 * image.getParameter('FilePath').setUrl("https://storage.googleapis.com/zea-playground-assets/zea-engine/texture.png")
 *
 * const matColorParam = new MaterialColorParam('MyMaterialColor', new Color(0, 254, 2))
 * matColorParam.setImage(image)
 * //'myParameterOwnerItem' is an instance of a 'ParameterOwner' class.
 * // Remember that only 'ParameterOwner' and classes that extend from it can host 'Parameter' objects.
 * myParameterOwnerItem.addParameter(matColorParam)
 * ```
 *
 * **Events**
 * * **valueChanged:** Triggered every time the Image value changes
 * * **textureDisconnected:** Triggered when Image value is cleaned/removed.
 * * **textureConnected:** Triggered when the Image value is set.
 *
 * @extends ColorParameter
 */
class MaterialColorParam extends ColorParameter {
  /**
   * Create a material color parameter.
   * @param {string} name - The name of the material color parameter.
   * @param {Color} value - The value of the parameter.
   */
  constructor(name, value) {
    super(name, value);
    this.__imageUpdated = this.__imageUpdated.bind(this);
  }

  /**
   * Returns `BaseImage` texture of the Material.
   *
   * @return {BaseImage} - The return value.
   */
  getImage() {
    return this.__image
  }

  /**
   * The __imageUpdated method.
   * @private
   */
  __imageUpdated() {
    this.emit('valueChanged', {});
  }

  /**
   * Sets `BaseImage` texture value in parameter.
   *
   * @param {BaseImage} value - The value param.
   */
  setImage(value) {
    const disconnectImage = () => {
      this.__image.off('loaded', this.__imageUpdated);
      this.__image.off('updated', this.__imageUpdated);
      this.__image = null;
      this.emit('textureDisconnected', {});
    };
    if (value) {
      if (this.__image != undefined && this.__image !== value) {
        disconnectImage();
      }
      this.__image = value;
      this.__image.on('updated', this.__imageUpdated);
      this.emit('textureConnected', {});
      this.emit('valueChanged', { mode: 0 });
    } else {
      if (this.__image != undefined) {
        disconnectImage();
        this.__image = undefined;
        this.emit('textureDisconnected', {});
      }
    }
  }

  /**
   * Sets `Color` or the `BaseImage` texture value in parameter.
   *
   * @param {BaseImage|Color} value - The value param.
   */
  setValue(value) {
    // Note: instead of supporting images or colors, we should replace the ColorParameter with an ImageParameter when assigning textures
    // console.warn('@todo-review: Should we accept different type of values?')
    if (value instanceof BaseImage) {
      this.setImage(value);
    } else {
      if (this.__image != undefined) {
        this.setImage(undefined);
      }
      super.setValue(value);
    }
  }
  /**
   * Extracts `Color` and `Image` values from a buffer, updating current parameter state.
   *
   * @param {BinReader} reader - The reader value.
   * @param {object} context - The context value.
   */
  readBinary(reader, context) {
    super.readBinary(reader, context);

    const textureName = reader.loadStr();
    if (textureName != '') {
      this.setImage(context.materialLibrary.getImage(textureName));
    }
  }

  /**
   * The clone method constructs a new material color parameter,
   * copies its values from this parameter and returns it.
   *
   * @return {MaterialColorParam} - Returns a new cloned material color parameter.
   */
  clone() {
    const clonedParam = new MaterialColorParam(this.__name, this.__value.clone());
    return clonedParam
  }
}

Registry.register('MaterialColorParam', MaterialColorParam);

/* eslint-disable require-jsdoc */

function isTypedArray(obj) {
  return !!obj && obj.byteLength !== undefined
}

/**
 * Class representing an attribute.
 */
class Attribute {
  /**
   * Create an attribute.
   * @param {AttrValue|number} dataType - The dataType value.
   * @param {number|TypedArray} expectedSize - The expectedSize value.
   * @param {number} defaultValue - The defaultValue value.
   */
  constructor(dataType, expectedSize, defaultValue = undefined) {
    this.__dataType = dataType;
    this.normalized = false;
    if (dataType.numElements != undefined) {
      this.__dimension = this.__dataType.numElements();
    } else {
      switch (dataType) {
        case Float32:
        case UInt32:
        case SInt32:
          this.__dimension = 1;
          break
        default:
          throw new Error('Invalid data type for attribute:' + dataType)
      }
    }
    this.__defaultElementValue = defaultValue != undefined ? defaultValue : Number.MAX_VALUE;
    if (isTypedArray(expectedSize)) {
      this.__data = expectedSize;
    } else {
      this.__data = new Float32Array(expectedSize * this.__dimension);
      this.initRange(0);
    }
  }

  /**
   * Resizes current data array to to a new size.
   * In case the new size is bigger than current size, the new values are filled up with default ones.
   *
   * @param {number} size - The size value.
   */
  resize(size) {
    const prevLength = this.__data.length;
    const newLength = size * this.__dimension;

    if (newLength > prevLength) {
      const data = new Float32Array(newLength);
      data.set(this.__data);
      this.__data = data;
      this.initRange(prevLength);
    } else if (newLength < prevLength) {
      this.__data = this.__data.slice(0, newLength);
    }
  }

  /**
   * Fills up data values with default ones starting from the specified index.
   *
   * @param {number} start - The start value.
   */
  initRange(start) {
    // Initialize the values to invalid values.
    for (let i = start; i < this.__data.length; i++) {
      this.__data[i] = this.__defaultElementValue;
    }
  }

  /**
   * Returns the count of attribute values in the data.
   *
   * @return {number} - The return value.
   */
  getCount() {
    return this.__data.length / this.__dimension
  }

  /**
   * Returns the count of attribute values in the data.
   *
   * @return {number} - The return value.
   */
  get length() {
    return this.__data.length / this.__dimension
  }

  /**
   * Returns the type of attribute value.
   *
   * @return {AttrValue|number} - The return value.
   */
  get dataType() {
    return this.__dataType
  }

  /**
   * Returns current data array.
   *
   * @return {TypedArray} - The return value.
   */
  get data() {
    return this.__data
  }

  /**
   * Sets data value.
   *
   * @param {TypedArray} data - The data value.
   */
  set data(data) {
    this.__data = data;
  }

  /**
   * Returns the number of elements stored in each `AttrValue`.
   *
   * @return {number} - The return value.
   */
  get numElements() {
    return this.__dimension
  }

  /**
   * Returns data value of the specified index.
   *
   * @param {number} index - The index value.
   * @return {number} - The return value.
   */
  getFloat32Value(index) {
    return this.__data[index]
  }

  /**
   * Sets data value in the specified index.
   *
   * @param {number} index - The index value.
   * @param {number} value - The value param.
   */
  setFloat32Value(index, value) {
    this.__data[index] = value;
  }

  /**
   * Returns the `AttrValue` object placed in the specified index.
   *
   * @param {number} index - The index value.
   * @return {AttrValue} - The return value.
   */
  getValueRef(index) {
    const numElems = this.__dimension;
    if (index >= this.__data.length / numElems)
      throw new Error('Invalid vertex index:' + index + '. Num Vertices:' + this.__data.length / 3)
    return this.__dataType.createFromBuffer(this.__data.buffer, index * numElems * 4)
  }

  /**
   * Sets `AttrValue` object in the specified index.
   *
   * @param {number} index - The index value.
   * @param {AttrValue} value - The value param.
   */
  setValue(index, value) {
    const numElems = this.__dimension;
    if (index >= this.__data.length / numElems)
      throw new Error('Invalid vertex index:' + index + '. Num Vertices:' + this.__data.length / 3)
    this.__dataType.createFromBuffer(this.__data.buffer, index * numElems * 4).setFromOther(value);
  }

  /**
   * The toJSON method encodes this type as a json object for persistence.
   *
   * @param {object} context - The context value.
   * @return {object} - Returns the json object.
   */
  toJSON(context) {
    return {
      data: Array.from(this.__data),
      dataType: Registry.getBlueprintName(this.__dataType),
      defaultValue: this.__defaultElementValue,
      length: this.__data.length / this.__dimension,
    }
  }

  /**
   * The fromJSON method decodes a json object for this type.
   *
   * @param {object} j - The json object this item must decode.
   */
  fromJSON(j) {
    this.__data = Float32Array.from(j.data);
  }

  /**
   * Returns the string representation of the object's state.
   *
   * @return {string} - The return value.
   */
  toString() {
    return JSON.stringify(this.toJSON(), null, 2)
  }
}

/* eslint-disable require-jsdoc */

// Defines used to explicity specify types for WebGL.
function isTypedArray$1(obj) {
  return !!obj && obj.byteLength !== undefined
}

/**
 * Represents a base class for 3D geometry items.
 *
 * **Events**
 * * **boundingBoxChanged:** Triggered when the bounding box changes.
 *
 * @extends ParameterOwner
 */
class BaseGeom extends ParameterOwner {
  /**
   * Create a base geom.
   */
  constructor() {
    super();
    this.__numVertices = 0;
    this.__boundingBox = new Box3$1();
    this.__boundingBoxDirty = true;
    this.__vertexAttributes = new Map();
    this.__metaData = new Map();
    this.addVertexAttribute('positions', Vec3$1, 0.0);
  }

  /**
   * Establishes a name for the geometry.
   *
   * @param {string} name - The debug name value.
   */
  setDebugName(name) {
    this.__name = name;
  }

  /**
   * Adds a new vertex attribute to the geometry.
   *
   * @param {string} name - The name of the vertex attribute.
   * @param {AttrValue|number} dataType - The dataType value.
   * @param {number} defaultScalarValue - The default scalar value.
   * @return {Attribute} - Returns an attribute.
   */
  addVertexAttribute(name, dataType, defaultScalarValue = undefined) {
    const positions = this.getVertexAttribute('positions');
    let attr;
    if (isTypedArray$1(defaultScalarValue)) {
      attr = new Attribute(dataType, defaultScalarValue);
    } else {
      attr = new Attribute(dataType, positions != undefined ? positions.length : 0, defaultScalarValue);
    }
    this.__vertexAttributes.set(name, attr);
    return attr
  }

  /**
   * Checks if the the geometry has an attribute with the specified name.
   *
   * @param {string} name - The name of the vertex attribute.
   * @return {boolean} - The return value.
   */
  hasVertexAttribute(name) {
    return this.__vertexAttributes.has(name)
  }

  /**
   * Returns vertex attribute with the specified name.
   *
   * @param {string} name - The name of the vertex attribute.
   * @return {Attribute} - The return value.
   */
  getVertexAttribute(name) {
    return this.__vertexAttributes.get(name)
  }

  /**
   * Returns all vertex attributes in an object with their names.
   *
   * @return {object} - The return value.
   */
  getVertexAttributes() {
    const vertexAttributes = {};
    for (const [key, attr] of this.__vertexAttributes.entries()) vertexAttributes[key] = attr;
    return vertexAttributes
  }

  /**
   * Returns 'positions' vertex attribute.
   * @deprecated
   */
  get vertices() {
    console.warn("deprecated use #getVertexAttribute('positions')");
    return this.__vertexAttributes.get('positions')
  }

  /**
   * Returns the number of vertex attributes.
   *
   * @return {number} - The return value.
   */
  numVertices() {
    return this.__numVertices
  }

  /**
   * Returns the number of vertex attributes.
   *
   * @return {number} - The return value.
   */
  getNumVertices() {
    return this.__numVertices
  }

  /**
   * Sets the number of vertices the geometry has.
   *
   * @param {number} count - The count value.
   */
  setNumVertices(count) {
    this.__numVertices = count;
    // Resizes each of the vertex attributes to match the new count.
    this.__vertexAttributes.forEach((attr) => attr.resize(this.__numVertices));
  }

  /**
   * Returns the position attribute value of the given vertex
   * @deprecated
   * @param {number} index - The index value.
   * @return {Vec3} - Returns a Vec3.
   */
  getVertex(index) {
    console.warn(`deprecated use #getVertexAttribute('positions').getValueRef()`);
    return Vec3$1.createFromBuffer(this.vertices.data.buffer, index * 3 * 4)
  }

  /**
   * Sets the position attribute value of the given vertex
   * @deprecated
   * @param {index} index - The index value.
   * @param {Vec3} value - The value value.
   * @return {Vec3} - Returns a Vec3.
   */
  setVertex(index, value) {
    console.warn(`deprecated use #getVertexAttribute('positions').getValueRef().setFromOther(value)`);
    return Vec3$1.createFromBuffer(this.vertices.data.buffer, index * 3 * 4).setFromOther(value)
  }

  /**
   * Applies an offset to each of the vertices in the geometry.
   * @deprecated
   * @param {Vec3} delta - The delta value.
   */
  moveVertices(delta) {
    console.warn(`deprecated use #getVertexAttribute('positions').getValueRef()`);
    const vertices = this.vertices;
    for (let i = 0; i < vertices.length; i++) vertices.getValueRef(i).addInPlace(delta);
    this.setBoundingBoxDirty();
  }

  /**
   * The transformVertices method.
   * @deprecated
   * @param {Xfo} xfo - The xfo tranform.
   */
  transformVertices(xfo) {
    console.warn(`deprecated, please transform the vertices manually`);
    const vertices = this.vertices;
    for (let i = 0; i < vertices.length; i++) {
      const v = vertices.getValueRef(i);
      const v2 = xfo.transformVec3(v);
      v.set(v2.x, v2.y, v2.z);
    }
    this.setBoundingBoxDirty();
  }

  // ////////////////////////////////////////
  // BoundingBox

  /**
   * Returns the bounding box for geometry.
   * @deprecated
   * @return {Vec3} - The return value.
   */
  get boundingBox() {
    console.warn(`deprecated, please use #getBoundingBox()`);
    if (this.__boundingBoxDirty) this.updateBoundingBox();
    return this.__boundingBox
  }

  /**
   * Returns the bounding box for geometry.
   * @return {Vec3} - The return value.
   */
  getBoundingBox() {
    if (this.__boundingBoxDirty) this.updateBoundingBox();
    return this.__boundingBox
  }

  /**
   * The setBoundingBoxDirty method.
   */
  setBoundingBoxDirty() {
    this.__boundingBoxDirty = true;
    this.emit('boundingBoxChanged', {});
  }

  /**
   * The updateBoundingBox method.
   */
  updateBoundingBox() {
    const positions = this.getVertexAttribute('positions');
    const bbox = new Box3$1();
    const numVerts = positions.length;
    for (let i = 0; i < numVerts; i++) bbox.addPoint(positions.getValueRef(i));
    this.__boundingBox = bbox;
    this.__boundingBoxDirty = false;
  }

  // ////////////////////////////////////////
  // Metadata

  /**
   * Returns metadata value of the specified name.
   *
   * @param {string} key - The key value.
   * @return {object} - The return value.
   */
  getMetadata(key) {
    return this.__metaData.get(key)
  }

  /**
   * Verifies if geometry's metadata contains a value with the specified key.
   *
   * @param {string} key - The key value.
   * @return {boolean} - The return value.
   */
  hasMetadata(key) {
    return this.__metaData.has(key)
  }

  /**
   * Sets metadata value to the geometry.
   *
   * @param {string} key - The key value.
   * @param {object} metaData - The metaData value.
   */
  setMetadata(key, metaData) {
    this.__metaData.set(key, metaData);
  }

  /**
   * Removes metadata value from the geometry with the specified key.
   *
   * @param {string} key - The key value.
   */
  deleteMetadata(key) {
    this.__metaData.delete(key);
  }

  // ////////////////////////////////////////
  // Memory

  /**
   * Returns vertex attributes buffers and its count.
   *
   * @param {object} opts - The opts value.
   * @return {object} - The return value.
   */
  genBuffers(opts) {
    const attrBuffers = {};
    for (const [attrName, attr] of this.__vertexAttributes) {
      attrBuffers[attrName] = {
        values: attr.data,
        count: attr.length,
        dataType: attr.dataType,
        normalized: attr.normalized,
      };
    }
    return {
      numVertices: this.numVertices(),
      attrBuffers,
    }
  }

  /**
   * The freeBuffers method.
   */
  freeBuffers() {
    // Before destroying all our data,
    // make sure the bbox is up to date.
    // if (this.__boundingBoxDirty)
    //     this.updateBoundingBox();
    // // TODO: push the data to a worker thread and terminate like in MeshProxy.
    // this.__vertexAttributes = new Map();
  }

  // ////////////////////////////////////////
  // Persistence
  /**
   * Sets state of current Geometry(Including Vertices and Bounding Box) using a binary reader object.
   *
   * @param {BinReader} reader - The reader value.
   */
  loadBaseGeomBinary(reader) {
    this.name = reader.loadStr();
    const flags = reader.loadUInt8();
    this.debugColor = reader.loadRGBFloat32Color();
    const numVerts = reader.loadUInt32();
    this.__boundingBox.set(reader.loadFloat32Vec3(), reader.loadFloat32Vec3());

    this.setNumVertices(numVerts);
    const positionsAttr = this.getVertexAttribute('positions');

    let normalsAttr;
    let texCoordsAttr;
    if (flags & (1 << 1)) {
      normalsAttr = this.getVertexAttribute('normals');
      if (!normalsAttr) normalsAttr = this.addVertexAttribute('normals', Vec3$1, 0.0);
    }
    if (flags & (1 << 2)) {
      texCoordsAttr = this.getVertexAttribute('texCoords');
      if (!texCoordsAttr) texCoordsAttr = this.addVertexAttribute('texCoords', Vec2, 0.0);
    }

    const parse8BitPositionsArray = (range, offset, sclVec, positions_8bit) => {
      for (let i = range[0]; i < range[1]; i++) {
        const pos = new Vec3$1(
          positions_8bit[i * 3 + 0] / 255.0,
          positions_8bit[i * 3 + 1] / 255.0,
          positions_8bit[i * 3 + 2] / 255.0
        );
        pos.multiplyInPlace(sclVec);
        pos.addInPlace(offset);
        positionsAttr.setValue(i, pos);
      }
    };

    const parse8BitNormalsArray = (range, offset, sclVec, normals_8bit) => {
      if (sclVec.isNull()) sclVec.set(1, 1, 1);
      for (let i = range[0]; i < range[1]; i++) {
        const normal = new Vec3$1(
          normals_8bit[i * 3 + 0] / 255.0,
          normals_8bit[i * 3 + 1] / 255.0,
          normals_8bit[i * 3 + 2] / 255.0
        );
        normal.multiplyInPlace(sclVec);
        normal.addInPlace(offset);
        normal.normalizeInPlace();
        normalsAttr.setValue(i, normal);
      }
    };
    const parse8BitTextureCoordsArray = (range, offset, sclVec, texCoords_8bit) => {
      // if (sclVec.isNull())
      //     sclVec.set(1, 1, 1);
      for (let i = range[0]; i < range[1]; i++) {
        const textureCoord = new Vec2(texCoords_8bit[i * 2 + 0] / 255.0, texCoords_8bit[i * 2 + 1] / 255.0);
        textureCoord.multiplyInPlace(sclVec);
        textureCoord.addInPlace(offset);
        texCoordsAttr.setValue(i, textureCoord);
      }
    };

    const numClusters = reader.loadUInt32();
    if (numClusters == 1) {
      {
        const box3 = this.__boundingBox;
        const positions_8bit = reader.loadUInt8Array(numVerts * 3);
        parse8BitPositionsArray([0, numVerts], box3.p0, box3.diagonal(), positions_8bit);
      }

      if (normalsAttr) {
        const box3 = new Box3$1(reader.loadFloat32Vec3(), reader.loadFloat32Vec3());
        const normals_8bit = reader.loadUInt8Array(numVerts * 3);
        parse8BitNormalsArray([0, numVerts], box3.p0, box3.diagonal(), normals_8bit);

        normalsAttr.loadSplitValues(reader);
      }
      if (texCoordsAttr) {
        const box2 = new Box2(reader.loadFloat32Vec2(), reader.loadFloat32Vec2());
        const texCoords_8bit = reader.loadUInt8Array(numVerts * 2);
        parse8BitTextureCoordsArray([0, numVerts], box2.p0, box2.diagonal(), texCoords_8bit);

        texCoordsAttr.loadSplitValues(reader);
      }
    } else {
      const clusters = [];
      let offset = 0;
      for (let i = 0; i < numClusters; i++) {
        const count = reader.loadUInt32();
        const box3 = new Box3$1(reader.loadFloat32Vec3(), reader.loadFloat32Vec3());
        const clusterData = {
          range: [offset, offset + count],
          bbox: box3,
        };
        if (normalsAttr) {
          clusterData.normalsRange = new Box3$1(reader.loadFloat32Vec3(), reader.loadFloat32Vec3());
        }
        if (texCoordsAttr) {
          clusterData.texCoordsRange = new Box2(reader.loadFloat32Vec2(), reader.loadFloat32Vec2());
        }

        clusters.push(clusterData);
        offset += count;
      }
      const positions_8bit = reader.loadUInt8Array(numVerts * 3);
      let normals_8bit;
      let texCoords_8bit;
      if (normalsAttr) {
        normals_8bit = reader.loadUInt8Array(numVerts * 3);
      }
      if (texCoordsAttr) {
        texCoords_8bit = reader.loadUInt8Array(numVerts * 2);
      }

      for (let i = 0; i < numClusters; i++) {
        {
          const box3 = clusters[i].bbox;
          parse8BitPositionsArray(clusters[i].range, box3.p0, box3.diagonal(), positions_8bit);
        }

        if (normalsAttr) {
          const box3 = clusters[i].normalsRange;
          parse8BitNormalsArray(clusters[i].range, box3.p0, box3.diagonal(), normals_8bit);
        }
        if (texCoordsAttr) {
          const box2 = clusters[i].texCoordsRange;
          parse8BitTextureCoordsArray(clusters[i].range, box2.p0, box2.diagonal(), texCoords_8bit);
        }
      }
      if (normalsAttr) {
        normalsAttr.loadSplitValues(reader);
      }
      if (texCoordsAttr) {
        texCoordsAttr.loadSplitValues(reader);
      }
    }
  }

  /**
   * The toJSON method encodes this type as a json object for persistence.
   *
   * @param {object} context - The context value.
   * @return {object} - Returns the json object.
   */
  toJSON(context) {
    let json = super.toJSON(context);
    if (!json) json = {};
    json.type = Registry.getBlueprintName(this);
    json.numVertices = this.__numVertices;

    const vertexAttributes = {};
    for (const [key, attr] of this.__vertexAttributes.entries()) {
      // if (!opts || !('attrList' in opts) || opts.attrList.indexOf(key) != -1)
      vertexAttributes[key] = attr.toJSON(context);
    }
    json.vertexAttributes = vertexAttributes;

    return json
  }

  /**
   * The fromJSON method decodes a json object for this type.
   *
   * @param {object} json - The json object this item must decode.
   * @param {object} context - The context value.
   */
  fromJSON(json, context) {
    super.fromJSON(json, context);
    this.setNumVertices(json.numVertices);
    for (const name in json.vertexAttributes) {
      let attr = this.__vertexAttributes.get(name);
      const attrJSON = json.vertexAttributes[name];
      if (!attr) {
        const dataType = Registry.getBlueprint(attrJSON.dataType);
        attr = new VertexAttribute(this, dataType, 0, attrJSON.defaultScalarValue);
        this.__vertexAttributes.set(name, attr);
      }
      attr.fromJSON(attrJSON);
    }
  }

  /**
   * Returns geometry data value in json format.
   *
   * @return {string} - The return value.
   */
  toString() {
    return JSON.stringify(this.toJSON(), null, 2)
  }
}

/* eslint-disable camelcase */

/**
 * Class representing vertex attributes.
 *
 * ```
 * const vertexAttribute = new VertexAttribute(this, Float32, 0)
 * ```
 *
 * @extends Attribute
 */
class VertexAttribute$1 extends Attribute {
  /**
   * Create vertex attributes
   * @param {Mesh} geom - The geom value.
   * @param {AttrValue|number} dataType - The dataType value.
   * @param {number|TypedArray} expectedSize - The expectedSize value.
   * @param {number} defaultScalarValue - The default scalar value.
   */
  constructor(geom, dataType, expectedSize, defaultScalarValue) {
    super(dataType, expectedSize, defaultScalarValue);
    this.__geom = geom; // TODO: WeakRef??

    this.__splits = {};
    this.__splitValues = [];
  }

  /**
   * The getFaceVertexValueRef method.
   * @param {number} face - The face value.
   * @param {number} facevertex - The face vertex value.
   * @return {AttrValue} - The return value.
   */
  getFaceVertexValueRef(face, facevertex) {
    const vertex = this.__geom.getFaceVertexIndex(face, facevertex);
    if (vertex in this.__splits && face in this.__splits[vertex]) {
      return this.__splitValues[this.__splits[vertex][face]]
    }
    return this.getValueRef(vertex)
  }

  /**
   * The setFaceVertexValue method.
   * @param {number} face - The face value.
   * @param {number} facevertex - The facevertex value.
   * @param {AttrValue} value - The value value.
   */
  setFaceVertexValue(face, facevertex, value) {
    const vertex = this.__geom.getFaceVertexIndex(face, facevertex);
    this.setFaceVertexValue_ByVertexIndex(face, vertex, value);
  }

  /**
   * The setFaceVertexValue_ByVertexIndex method.
   * @param {number} face - The face value.
   * @param {number} vertex - The vertex value.
   * @param {AttrValue} value - The value value.
   */
  setFaceVertexValue_ByVertexIndex(face, vertex, value) {
    const valueRef = this.getValueRef(vertex);
    if (!valueRef.isValid()) {
      // the value is uninitialized. Initialize it.
      valueRef.setFromOther(value);
    } else if (valueRef.approxEqual(value)) ; else {
      // The new value is different from the existing value

      if (vertex in this.__splits) {
        // Now check if any existing splits for this vertex match the value being set.
        // i.e. for faces around a vertex, there will often be a seam along 2 edges
        // where the values differ. On each side of the seam, all faces can use the same
        // value. We should see then only one split value for the vertex.
        const vertexSplitIds = this.__splits[vertex];
        for (const fid in vertexSplitIds) {
          const splitId = vertexSplitIds[fid];
          if (this.__splitValues[splitId].approxEqual(value)) {
            // re-use this split value
            vertexSplitIds[face] = splitId;
            return
          }
        }

        // If a split already exists for this face, re-use it.
        if (face in this.__splits[vertex]) {
          const valueRef = this.__splitValues[this.__splits[vertex][face]];
          valueRef.setFromOther(value);
          return
        }
      } else {
        this.__splits[vertex] = {};
      }
      this.__splits[vertex][face] = this.__splitValues.length;
      this.__splitValues.push(value);
    }
  }

  /**
   * The setSplitVertexValue method.
   * @param {number} vertex - The vertex value.
   * @param {number} face - The face value.
   * @param {AttrValue} value - The value value.
   */
  setSplitVertexValue(vertex, face, value) {
    if (!(vertex in this.__splits)) this.__splits[vertex] = {};
    if (face in this.__splits[vertex]) {
      const currValue = this.__splitValues[this.__splits[vertex][face]];
      if (currValue.approxEqual(value)) return
      console.warn('Face Vertex Already Split with different value');
    }
    this.__splits[vertex][face] = this.__splitValues.length;
    this.__splitValues.push(value);
  }

  /**
   * The setSplitVertexValues method.
   * @param {number} vertex - The vertex value.
   * @param {array} faceGroup - The faceGroup value.
   * @param {AttrValue} value - The value value.
   */
  setSplitVertexValues(vertex, faceGroup, value) {
    if (!(vertex in this.__splits)) this.__splits[vertex] = {};
    const splitIndex = this.__splitValues.length;
    this.__splitValues.push(value);
    for (const face of faceGroup) {
      // if (face in this.__splits[vertex]) {
      //     let currValue = this.__splitValues[this.__splits[vertex][face]];
      //     if (currValue.approxEqual(value))
      //         return;
      //     console.warn("Face Vertex Already Split with different value");
      // }
      this.__splits[vertex][face] = splitIndex;
    }
  }

  /**
   * The getSplits method.
   * @return {array} - The return value.
   */
  getSplits() {
    return this.__splits
  }

  /**
   * The getSplitCount method.
   * @return {number} - The return value.
   */
  getSplitCount() {
    let splitCount = 0;
    for (const vertex in this.__splits) splitCount += Object.keys(this.__splits[vertex]).length;
    return splitCount
  }

  /**
   * The generateSplitValues method.
   * @param {array} splitIndices - The splitIndices value.
   * @param {number} splitCount - The splitCount value.
   * @return {Float32Array} - The return value.
   */
  generateSplitValues(splitIndices, splitCount) {
    if (splitCount == 0) return this.__data

    const numUnSplitValues = this.length;
    const count = this.length + splitCount;
    const numElems = this.__dataType.numElements ? this.__dataType.numElements() : 1;
    const data = new Float32Array(count * numElems);
    for (let i = 0; i < this.__data.length; i++) data[i] = this.__data[i];

    // Now duplicate the split values to generate an attributes array
    // usig the shared splits accross all attributes.
    // eslint-disable-next-line guard-for-in
    for (const vertex in splitIndices) {
      const faces = splitIndices[vertex];
      // eslint-disable-next-line guard-for-in
      for (const face in faces) {
        const tgt = numUnSplitValues + faces[face];
        if (vertex in this.__splits && face in this.__splits[vertex]) {
          // this attribue has a split value in its array.
          // we must use that value...
          const src = this.__splits[vertex][face];
          if (this.__dataType == Float32) data[tgt * numElems] = this.__splitValues[src];
          else this.__dataType.createFromBuffer(data.buffer, tgt * numElems * 4).setFromOther(this.__splitValues[src]);
        } else {
          // Copy each scalar value to the new place in the array.
          const src = parseInt(vertex);
          for (let e = 0; e < numElems; e++) {
            if (src * numElems + e > this.__data.length) {
              console.log('Error remapping src:' + src * numElems + e);
            }
            if (tgt * numElems + e > data.length) {
              console.log('Error remapping tgt:' + tgt * numElems + e);
            }
            data[tgt * numElems + e] = this.__data[src * numElems + e];
          }
        }
      }
    }
    return data
  }

  /**
   * The toJSON method encodes this type as a json object for persistence.
   *
   * @param {object} context - The context value.
   * @return {object} - Returns the json object.
   */
  toJSON(context) {
    const json = super.toJSON(context);
    json.splits = this.__splits;
    json.splitValues = this.__splitValues;
    return json
  }

  /**
   * The fromJSON method decodes a json object for this type.
   *
   * @param {object} json - The json object this item must decode.
   * @param {object} context - The context value.
   */
  fromJSON(json, context) {
    super.fromJSON(json, context);
    this.__splits = json.splits;
    this.__splitValues = [];
    for (const valjson of json.splitValues) this.__splitValues.push(this.__dataType.createFromJSON(valjson));
  }

  /**
   * The loadSplitValues method.
   * @param {BinReader} reader - The reader value.
   */
  loadSplitValues(reader) {
    const splitIndices = reader.loadUInt32Array();
    if (splitIndices.length == 0) return
    let offset = 0;
    let numSplitValues = 0;
    while (true) {
      const vertexId = splitIndices[offset++];
      const numSplits = splitIndices[offset++];

      const splits = {};
      for (let i = 0; i < numSplits; i++) {
        const faceId = splitIndices[offset++];
        const splitId = splitIndices[offset++];
        splits[faceId] = splitId;
        if (splitId >= numSplitValues) numSplitValues = splitId + 1;
      }
      this.__splits[vertexId] = splits;
      if (offset >= splitIndices.length) break
    }
    const dim = this.__numFloat32Elements;
    const splitValues = reader.loadFloat32Array(numSplitValues * dim);
    this.__splitValues = [];
    for (let i = 0; i < numSplitValues; i++) {
      const val = this.__dataType.createFromFloat32Array(splitValues.slice(i * dim, i * dim + dim));
      this.__splitValues.push(val);
    }
  }
}

/* eslint-disable camelcase */

/**
 * Class representing a point primitive drawing type, every vertex specified is a point.
 *
 * ```
 * const points = new Points()
 * ```
 *
 * * **Events**
 * * **boundingBoxChanged:** Triggered when the bounding box changes.
 *
 * @extends BaseGeom
 */
class Points extends BaseGeom {
  /**
   * Create points.
   */
  constructor() {
    super();
  }

  /**
   * Loads and populates `Points` object from a binary reader.
   *
   * @param {BinReader} reader - The reader value.
   */
  loadBin(reader) {
    this.name = reader.loadStr();
    const numVerts = reader.loadUInt32();
    this.__boundingBox.set(reader.loadFloat32Vec3(), reader.loadFloat32Vec3());
    this.setNumVertices(numVerts);
    const positions = this.getVertexAttribute('positions');

    if (numVerts < 256) {
      const bboxMat = this.__boundingBox.toMat4();
      const posAttr_8bit = reader.loadUInt8Array(numVerts * 3);
      for (let i = 0; i < numVerts; i++) {
        const pos = new Vec3(
          posAttr_8bit[i * 3 + 0] / 255.0,
          posAttr_8bit[i * 3 + 1] / 255.0,
          posAttr_8bit[i * 3 + 2] / 255.0
        );
        positions.setValue(i, bboxMat.transformVec3(pos));
      }
    } else {
      const numClusters = reader.loadUInt32();
      const clusters = [];
      for (let i = 0; i < numClusters; i++) {
        const range = reader.loadUInt32Vec2();
        const p0 = reader.loadFloat32Vec3();
        const p1 = reader.loadFloat32Vec3();
        clusters.push({
          range: range,
          bbox: new Box3(p0, p1),
        });
      }
      const posAttr_8bit = reader.loadUInt8Array(numVerts * 3);

      for (let i = 0; i < numClusters; i++) {
        const bboxMat = clusters[i]['bbox'].toMat4();
        for (let j = clusters[i]['range'].x; j < clusters[i]['range'].y; j++) {
          const pos = new Vec3(
            posAttr_8bit[j * 3 + 0] / 255.0,
            posAttr_8bit[j * 3 + 1] / 255.0,
            posAttr_8bit[j * 3 + 2] / 255.0
          );
          positions.setValue(j, bboxMat.transformVec3(pos));
        }
      }
    }
  }

  // ////////////////////////////////////////
  // Persistence

  /**
   * Sets state of current geometry(Including line segments) using a binary reader object.
   *
   * @param {BinReader} reader - The reader value.
   * @param {object} context - The context value.
   */
  readBinary(reader, context) {
    super.loadBaseGeomBinary(reader);

    // this.computeVertexNormals();
    this.emit('geomDataChanged', {});
  }
}

Registry.register('Points', Points);

/**
 *
 * Class representing lines primitive drawing type, connecting vertices using the specified indices.
 * i.e. We have 4 points(vertices) but we don't know how they connect to each other,
 * and that's why we need indices(Numbers indicating which vertex connects to which).
 * In this case if we say that `indices` is `[0,1,2,3]`, it would connect the first vertex to the second,
 * and the third to the fourth.
 *
 * ```
 * const lines = new Lines()
 * ```
 *
 * **Events**
 * * **geomDataChanged:** Triggered when the data value of the geometry is set(This includes reading binary)
 *
 * @extends BaseGeom
 */
class Lines extends BaseGeom {
  /**
   * Create lines.
   */
  constructor() {
    super();
    this.__indices = new Uint32Array();
    this.lineThickness = 0.0;
  }

  /**
   * Returns the specified indices(Vertex connectors)
   *
   * @return {Uint32Array} - The indices index array.
   */
  getIndices() {
    return this.__indices
  }

  /**
   * Returns the number of line segments.
   *
   * @return {number} - Returns the number of segments.
   */
  getNumSegments() {
    return this.__indices.length / 2
  }

  /**
   * Sets the number of line segments in the geometry.<br>
   * **Important:** It resets indices values.
   *
   * @param {number} numOfSegments - The count value.
   */
  setNumSegments(numOfSegments) {
    if (numOfSegments > this.getNumSegments()) {
      const indices = new Uint32Array(numOfSegments * 2);
      indices.set(this.__indices);
      this.__indices = indices;
    } else {
      this.__indices = this.__indices.slice(0, numOfSegments * 2);
    }
  }

  /**
   * Sets segment values in the specified index.
   *
   * @param {number} index - The index value.
   * @param {number} p0 - The p0 value.
   * @param {number} p1 - The p1 value.
   */
  setSegmentVertexIndices(index, p0, p1) {
    if (index >= this.__indices.length / 2)
      throw new Error('Invalid line index:' + index + '. Num Segments:' + this.__indices.length / 2)
    this.__indices[index * 2 + 0] = p0;
    this.__indices[index * 2 + 1] = p1;
  }

  /**
   * Sets segment values in the specified index.
   *
   * @param {number} index - The index value.
   * @param {number} p0 - The p0 value.
   * @param {number} p1 - The p1 value.
   */
  setSegment(index, p0, p1) {
    console.warn(`deprecated use #setSegmentVertexIndices`);
    this.setSegmentVertexIndices(index, p0, p1);
  }

  /**
   * The getSegmentVertexIndex method.
   *
   * @param {number} line - The line value.
   * @param {number} lineVertex - The lineVertex value.
   * @return {number} - The return value.
   * @private
   */
  getSegmentVertexIndex(line, lineVertex) {
    const numSegments = this.getNumSegments();
    if (line < numSegments) return this.__indices[line * 2 + lineVertex]
  }

  // ////////////////////////////////////////
  // Memory

  /**
   * Returns vertex attributes buffers and its count.
   *
   * @return {object} - The return value.
   */
  genBuffers() {
    const buffers = super.genBuffers();

    let indices;
    if (buffers.numVertices < Math.pow(2, 8)) {
      indices = new Uint8Array(this.__indices.length);
      this.__indices.forEach((value, index) => {
        indices[index] = value;
      });
    } else if (buffers.numVertices < Math.pow(2, 16)) {
      indices = new Uint16Array(this.__indices.length);
      this.__indices.forEach((value, index) => {
        indices[index] = value;
      });
    } else {
      indices = this.__indices;
    }
    buffers.indices = indices;
    return buffers
  }

  // ////////////////////////////////////////
  // Persistence

  /**
   * Sets state of current geometry(Including line segments) using a binary reader object.
   *
   * @param {object} reader - The reader value.
   * @param {object} context - The context value.
   */
  readBinary(reader, context) {
    super.loadBaseGeomBinary(reader);

    this.setNumSegments(reader.loadUInt32());

    const bytes = reader.loadUInt8();
    if (bytes == 1) this.__indices = reader.loadUInt8Array();
    else if (bytes == 2) this.__indices = reader.loadUInt16Array();
    else if (bytes == 4) this.__indices = reader.loadUInt32Array();

    this.emit('geomDataChanged', {});
  }
  /**
   * The toJSON method encodes this type as a json object for persistence.
   *
   * @param {object} context - The context value.
   * @return {object} - Returns the json object.
   */
  toJSON(context) {
    const j = super.toJSON(context);
    j.indices = Array.from(this.__indices);

    return j
  }

  /**
   * The fromJSON method decodes a json object for this type.
   *
   * @param {object} j - The json object this item must decode.
   * @param {object} context - The context value.
   */
  fromJSON(j, context) {
    super.fromJSON(j, context);
    this.__indices = Uint32Array.from(j.indices);
  }
}

Registry.register('Lines', Lines);

/* eslint-disable prefer-rest-params */

/**
 * The Mesh class provides a flexible and fast polygon mesh representation. It supports polygons of arbitrary complexity,
 * from basic triangles and quads to pentagons more.
 * It supports storing per face attributes, and per edge attributes.
 * The Mesh class handles converting its internal representation of polygons into a simpler triangles representation for rendering.
 *
 * ```
 * const mesh = new Mesh()
 * ```
 *
 * **Events**
 * * **geomDataTopologyChanged:** Triggered when the topology of the mesh has been changed.
 * * **geomDataChanged:** Triggered when the vertices of the mesh have changed, but not necessarily the topology.
 *
 * @extends BaseGeom
 */
class Mesh extends BaseGeom {
  /**
   * Creates an instance of Mesh.
   */
  constructor() {
    super();
    this.init();
  }

  /**
   * The init method.
   * @private
   */
  init() {
    this.__faceCounts = [];
    this.__faceVertexIndices = new Uint32Array();

    this.__faceAttributes = new Map();
    this.__edgeAttributes = new Map();

    this.__logTopologyWarnings = false;

    this.edgeVerts = undefined;
    this.vertexEdges = undefined;
    this.numEdges = 0;
    this.edgeAngles = new Float32Array();
  }

  /**
   * The getFaceCounts method.
   * @return {array} - The return value.
   */
  getFaceCounts() {
    return this.__faceCounts
  }

  /**
   * The getNumFaces method.
   * @return {number} - The return value.
   */
  getNumFaces() {
    return this.__faceCounts.length == 0 ? 0 : this.__faceCounts.reduce((numFaces, fc) => (numFaces += fc))
  }

  /**
   * The clear method.
   */
  clear() {
    this.__faceVertexIndices = undefined;
    this.__faceCounts = [];
  }

  /**
   * Sets the number of faces on the mesh using an array specifying the counts per polygon size.
   * The first item in the array specifies the number of triangles, the second, the number of quads, the 3rd, the number o f5 sided polygons etc..
   * e.g. to specify 2 triangles, and 7 quads, we would pass [2, 7]
   * @param {array} faceCounts - The faceCounts value.
   */
  setFaceCounts(faceCounts) {
    let numFaces = 0;
    let numFacesVertices = 0;
    let numVertsPerFace = 3;
    for (const fc of faceCounts) {
      numFaces += fc;
      numFacesVertices += fc * numVertsPerFace;
      numVertsPerFace++;
    }

    const prevNumFaces = this.getNumFaces();
    if (prevNumFaces == 0) {
      this.__faceVertexIndices = new Uint32Array(numFacesVertices);
    } else {
      const faceVertexIndices = new Uint32Array(numFacesVertices);

      // Now we preserve the existing indices if they fit within the new faceVertexIndices array.
      let startSrc = 0;
      let startTgt = 0;
      numFacesVertices = 0;
      numVertsPerFace = 3;
      faceCounts.forEach((fc, index) => {
        const endSrc = startSrc + Math.min(fc, this.__faceCounts[index]) * numVertsPerFace;
        faceVertexIndices.set(this.__faceVertexIndices.slice(startSrc, endSrc), startTgt);
        startSrc += this.__faceCounts[index] * numVertsPerFace;
        startTgt += fc * numVertsPerFace;
        numVertsPerFace++;
      });
      this.__faceVertexIndices = faceVertexIndices;
    }
    this.__faceCounts = faceCounts;

    for (const attr of this.__faceAttributes) attr.resize(numFaces);
  }

  /**
   * Returns the number of vertices indexed by this face
   * @param {number} faceIndex - The faceIndex value.
   * @return {number} - The return value.
   */
  getFaceVertexCount(faceIndex) {
    let idx = 0;
    let count = 0;
    this.__faceCounts.some((fc, index) => {
      idx += fc;
      if (idx > faceIndex) {
        count = index + 3;
        return true
      }
    });
    return count
  }

  /**
   * Returns the offset of the face indices within the entire index array.
   * @param {number} faceIndex - The faceIndex value.
   * @return {number} - The return value.
   */
  getFaceVertexOffset(faceIndex) {
    let idx = 0;
    let offset = 0;
    this.__faceCounts.some((fc, index) => {
      if (idx + fc > faceIndex) {
        offset += (faceIndex - idx) * (index + 3);
        return true
      }
      idx += fc;
      offset += fc * (index + 3);
    });
    return offset
  }

  /**
   * The setFaceVertexIndices method.
   * @param {number} faceIndex - The faceIndex value.
   * @param {array} vertexIndices - The array of vertex indices for this face value.
   */
  setFaceVertexIndices(faceIndex, vertexIndices) {
    if (arguments.length != 2) {
      console.warn(`deprecated interface. Please pass vertexIndices as an array`);
      vertexIndices = Array.prototype.slice.call(arguments, 1);
    }
    const faceVertexCount = this.getFaceVertexCount(faceIndex);
    if (vertexIndices.length != faceVertexCount) {
      throw new Error(
        `Invalid indices for face:${faceIndex} vertexIndices:${vertexIndices}. Expected ${faceVertexCount} indices`
      )
    }
    const offset = this.getFaceVertexOffset(faceIndex);
    this.__faceVertexIndices.set(vertexIndices, offset);
  }

  /**
   * Adds a new face to the mesh
   * @param {array} vertexIndices - The vertex indices of the face.
   * @return {number} - The index of the face in the mesh.
   */
  addFace(vertexIndices) {
    const faceCounts = [...this.__faceCounts];
    if (faceCounts.length <= vertexIndices.length - 3) {
      for (let i = faceCounts.length; i < vertexIndices.length - 3; i++) faceCounts[i] = 0;
      faceCounts[vertexIndices.length - 3] = 1;
    } else {
      faceCounts[vertexIndices.length - 3]++;
    }
    this.setFaceCounts(faceCounts);

    // Calculate the offset in the faceVertexIndices of this new face.
    let faceIndex = 0;
    let offset = 0;
    this.__faceCounts.some((fc, index) => {
      if (index + 3 == vertexIndices.length) {
        faceIndex += fc - 1;
        offset += (fc - 1) * (index + 3);
        return true
      }
      faceIndex += fc;
      offset += fc * (index + 3);
    });
    this.__faceVertexIndices.set(vertexIndices, offset);
    return faceIndex
  }

  /**
   * Returns the vertex indices of the specified face.
   * @param {number} faceIndex - The index of the specified face
   * @return {array} - An array of indices into the vertex attributes
   */
  getFaceVertexIndices(faceIndex) {
    const vertexIndices = [];
    const offset = this.getFaceVertexOffset(faceIndex);
    const count = this.getFaceVertexCount(faceIndex);
    for (let i = 0; i < count; i++) {
      vertexIndices.push(this.__faceVertexIndices[offset + i]);
    }
    return vertexIndices
  }

  /**
   * Returns a single vertex index for a given face and facevertex.
   * @param {number} faceIndex - The faceIndex value.
   * @param {number} facevertex - The face vertex is the index within the face. So the first vertex index is 0.
   * @return {number} - The vertex index
   */
  getFaceVertexIndex(faceIndex, facevertex) {
    const offset = this.getFaceVertexOffset(faceIndex);
    return this.__faceVertexIndices[offset + facevertex]
  }

  // ///////////////////////////
  // Vertex Attributes

  /**
   * Adds a `VertexAttribute` to the geometry.
   *
   * @param {string} name - The name of the vertex attribute to add.
   * @param {AttrValue|number} dataType - The dataType value.
   * @param {number} defaultScalarValue - The default scalar value.
   * @return {VertexAttribute} - Returns a vertex attribute.
   */
  addVertexAttribute(name, dataType, defaultScalarValue = undefined) {
    const positions = this.getVertexAttribute('positions');
    const attr = new VertexAttribute$1(this, dataType, positions != undefined ? positions.length : 0, defaultScalarValue);
    this.__vertexAttributes.set(name, attr);
    return attr
  }

  // ///////////////////////////
  // Face Attributes

  /**
   * The addFaceAttribute method.
   * @param {string} name - The name of the face attribute to add.
   * @param {AttrValue|number} dataType - The data type.
   * @param {number|TypedArray} count - The count value.
   * @return {Attribute} - Returns a face attribute.
   */
  addFaceAttribute(name, dataType, count = undefined) {
    const attr = new Attribute(dataType, count != undefined ? count : this.getNumFaces());
    this.__faceAttributes.set(name, attr);
    return attr
  }

  /**
   * The hasFaceAttribute method.
   * @param {string} name - The name of the face attribute.
   * @return {boolean} - The return value.
   */
  hasFaceAttribute(name) {
    return this.__faceAttributes.has(name)
  }

  /**
   * The getFaceAttribute method.
   * @param {string} name - The name of the face attribute.
   * @return {boolean} - The return value.
   */
  getFaceAttribute(name) {
    return this.__faceAttributes.get(name)
  }

  // /////////////////////////
  // Edge Attributes

  /**
   * The addEdgeAttribute method.
   * @param {string} name - The name of the edge attribute t oadd.
   * @param {AttrValue|number} dataType - The data type.
   * @param {number} count - The default scalar value.
   * @return {Attribute} - Returns an edge attribute.
   */
  addEdgeAttribute(name, dataType, count = undefined) {
    const attr = new Attribute(dataType, count != undefined ? count : this.getNumEdges());
    this.__edgeAttributes.set(name, attr);
    return attr
  }

  /**
   * The hasEdgeAttribute method.
   * @param {string} name - The name of the edge attribute.
   * @return {boolean} - The return value.
   */
  hasEdgeAttribute(name) {
    return this.__edgeAttributes.has(name)
  }

  /**
   * The getEdgeAttribute method.
   * @param {string} name - The name of the edge attribute.
   * @return {Attribute} - The return value.
   */
  getEdgeAttribute(name) {
    return this.__edgeAttributes.get(name)
  }

  // ///////////////////////////

  /**
   * The genTopologyInfo method.
   */
  genTopologyInfo() {
    const connectedVertices = {}; // acceleration structure.
    this.vertexEdges = []; // 2d array of vertex to edges.
    // this.vertexFaces = []; // 2d array of vertex to faces.
    this.edgeFaces = []; // flat array of 2 face indices per edge
    this.edgeVerts = []; // flat array of 2 vert indices per edge
    this.faceEdges = []; // the edges bordering each face.
    this.numEdges = 0;

    const positions = this.getVertexAttribute('positions');
    const getEdgeIndex = (v0, v1) => {
      let tmp0 = v0;
      let tmp1 = v1;
      if (tmp1 < tmp0) {
        const tmp = tmp0;
        tmp0 = tmp1;
        tmp1 = tmp;
      }
      const key = tmp0 + '>' + tmp1;
      if (key in connectedVertices) {
        // console.log(key + ':' + connectedVertices[key] + " face:" + ( v0 < v1 ? 0 : 1) );
        return connectedVertices[key]
      }

      const p0 = positions.getValueRef(tmp0);
      const p1 = positions.getValueRef(tmp1);
      const edgeVec = p1.subtract(p0);

      const edgeIndex = this.edgeFaces.length / 2;
      const edgeData = {
        edgeIndex: edgeIndex,
        edgeVec: edgeVec,
      };
      connectedVertices[key] = edgeData;

      this.edgeFaces.push(-1);
      this.edgeFaces.push(-1);
      this.edgeVerts.push(tmp0);
      this.edgeVerts.push(tmp1);
      // console.log(key + ':' + connectedVertices[key] + " face:" + ( v0 < v1 ? 0 : 1));

      this.numEdges++;
      return edgeData
    };

    const addEdge = (v0, v1, faceIndex) => {
      // console.log('addEdge:' + v0 + " :" + v1 + " faceIndex:" + faceIndex );
      const edgeData = getEdgeIndex(v0, v1);
      const edgeIndex = edgeData.edgeIndex;
      if (v1 < v0) {
        const edgeFaceIndex = edgeIndex * 2 + 0;
        if (this.__logTopologyWarnings && this.edgeFaces[edgeFaceIndex] != -1)
          console.warn('Edge poly 0 already set. Mesh is non-manifold.');
        this.edgeFaces[edgeFaceIndex] = faceIndex;
      } else {
        const edgeFaceIndex = edgeIndex * 2 + 1;
        if (this.__logTopologyWarnings && this.edgeFaces[edgeFaceIndex] != -1)
          console.warn('Edge poly 1 already set. Mesh is non-manifold.');
        this.edgeFaces[edgeFaceIndex] = faceIndex;
      }

      if (!(faceIndex in this.faceEdges)) this.faceEdges[faceIndex] = [];
      this.faceEdges[faceIndex].push(edgeIndex);

      // Push the edge index onto both vertex edge lists.
      // We use Sets to avoid adding the same edge 2x to the same vertex.
      if (this.vertexEdges[v0] == undefined) {
        this.vertexEdges[v0] = new Set();
      }
      if (this.vertexEdges[v1] == undefined) {
        this.vertexEdges[v1] = new Set();
      }
      this.vertexEdges[v0].add(edgeIndex);
      this.vertexEdges[v1].add(edgeIndex);

      // if (this.vertexFaces[v0] == undefined) {
      //     this.vertexFaces[v0] = [];
      // }
      // this.vertexFaces[v0].push(faceIndex);
    };

    const numFaces = this.getNumFaces();
    for (let faceIndex = 0; faceIndex < numFaces; faceIndex++) {
      const faceVerts = this.getFaceVertexIndices(faceIndex);
      for (let j = 0; j < faceVerts.length; j++) {
        const v0 = faceVerts[j];
        const v1 = faceVerts[(j + 1) % faceVerts.length];
        addEdge(v0, v1, faceIndex);
      }
    }
  }

  /**
   * Computes a normal value per face by averaging the triangle normals of the face.
   */
  computeFaceNormals() {
    const positions = this.getVertexAttribute('positions');
    const faceNormals = this.addFaceAttribute('normals', Vec3$1);
    const numFaces = this.getNumFaces();
    for (let faceIndex = 0; faceIndex < numFaces; faceIndex++) {
      const faceVerts = this.getFaceVertexIndices(faceIndex);
      const p0 = positions.getValueRef(faceVerts[0]);
      const p1 = positions.getValueRef(faceVerts[1]);
      let prev = p1;
      const faceNormal = new Vec3$1();
      for (let j = 2; j < faceVerts.length; j++) {
        const pn = positions.getValueRef(faceVerts[j]);
        const v0 = prev.subtract(p0);
        const v1 = pn.subtract(p0);
        faceNormal.addInPlace(v0.cross(v1).normalize());
        prev = pn;
      }
      if (faceNormal.lengthSquared() < Number.EPSILON) ; else {
        faceNormals.setValue(faceIndex, faceNormal.normalize());
      }
    }
  }

  /**
   * Calculates the angles at each edge between the adjoining faces
   */
  calculateEdgeAngles() {
    if (this.vertexEdges == undefined) this.genTopologyInfo();

    if (!this.hasFaceAttribute('normals')) this.computeFaceNormals();

    const positions = this.getVertexAttribute('positions');
    const faceNormals = this.getFaceAttribute('normals');
    this.edgeVecs = [];
    this.edgeAngles = new Float32Array(this.numEdges);
    for (let i = 0; i < this.edgeFaces.length; i += 2) {
      const v0 = this.edgeVerts[i];
      const v1 = this.edgeVerts[i + 1];
      const e_vec = positions.getValueRef(v1).subtract(positions.getValueRef(v0));
      e_vec.normalizeInPlace();
      this.edgeVecs.push(e_vec);

      const p0 = this.edgeFaces[i];
      const p1 = this.edgeFaces[i + 1];
      if (p0 == -1 || p1 == -1) {
        // Flag the edge as a border edge....
        this.edgeAngles[i / 2] = Math.PI * 2.0;
        continue
      }

      const n0 = faceNormals.getValueRef(p0);
      const n1 = faceNormals.getValueRef(p1);
      this.edgeAngles[i / 2] = n0.angleTo(n1);
    }
  }

  /**
   * Compute vertex normals.
   * @param {number} hardAngle - The hardAngle value in radians.
   * @return {VertexAttribute} - The return value.
   */
  computeVertexNormals(hardAngle = 1.0 /* radians */) {
    // console.log("computeVertexNormals");

    this.calculateEdgeAngles();

    const faceNormals = this.getFaceAttribute('normals');
    const normalsAttr = this.addVertexAttribute('normals', Vec3$1);

    // these methods are faster versions than using the methods
    // provided on the attributes. We cache values and use hard coded constants.
    const faceNormalsBuffer = faceNormals.data.buffer;
    const getFaceNormal = (index) => {
      return Vec3$1.createFromBuffer(faceNormalsBuffer, index * 3 * 4) // 3 components at 4 bytes each.
    };
    const vertexNormalsArray = normalsAttr.data;
    const setVertexNormal = (index, value) => {
      vertexNormalsArray[index * 3 + 0] = value.x;
      vertexNormalsArray[index * 3 + 1] = value.y;
      vertexNormalsArray[index * 3 + 2] = value.z;
    };
    const getConnectedEdgeVecs = (faceIndex, vertexIndex) => {
      let e0;
      let e1;
      const faceEdges = this.faceEdges[faceIndex];
      for (const e of faceEdges) {
        if (this.edgeVerts[e * 2] == vertexIndex) {
          if (!e0) e0 = this.edgeVecs[e];
          else e1 = this.edgeVecs[e];
        } else if (this.edgeVerts[e * 2 + 1] == vertexIndex) {
          if (!e0) e0 = this.edgeVecs[e];
          else e1 = this.edgeVecs[e];
        }
      }
      return [e0, e1]
    };

    for (let i = 0; i < this.vertexEdges.length; i++) {
      // If this face indexing doesn't start at 0, then the vertexEdges don't either.
      if (this.vertexEdges[i] == undefined) continue

      const edges = this.vertexEdges[i];

      // Groups of faces having a smooth normal at the current vertex.
      const faceGroups = [];
      const addFaceToGroup = (face) => {
        let inGroup = false;
        for (const faceGroup of faceGroups) {
          inGroup = faceGroup.indexOf(face) != -1;
          if (inGroup) break
        }
        if (!inGroup) faceGroups.push([face]);
      };
      for (const e of edges) {
        const f0 = this.edgeFaces[e * 2];
        const f1 = this.edgeFaces[e * 2 + 1];
        if (f0 != -1 && f1 == -1 && this.edgeAngles[e] < hardAngle) {
          let f0groupIndex = -1;
          let f1groupIndex = -1;
          for (let groupIndex = 0; groupIndex < faceGroups.length; groupIndex++) {
            if (f0groupIndex == -1 && faceGroups[groupIndex].indexOf(f0) != -1) f0groupIndex = groupIndex;
            if (f1groupIndex == -1 && faceGroups[groupIndex].indexOf(f1) != -1) f1groupIndex = groupIndex;
          }
          if (f0groupIndex == -1 && f1groupIndex == -1) {
            faceGroups.push([f0, f1]);
          } else if (f0groupIndex != -1 && f1groupIndex != -1) {
            if (f0groupIndex != f1groupIndex) {
              // Merge the 2 groups that the smooth edge joins.
              faceGroups[f0groupIndex] = faceGroups[f0groupIndex].concat(faceGroups[f1groupIndex]);
              faceGroups.splice(f1groupIndex, 1);
            }
          } else {
            if (f0groupIndex == -1) {
              faceGroups[f1groupIndex].push(f0);
            }
            if (f1groupIndex == -1) {
              faceGroups[f0groupIndex].push(f1);
            }
          }
          continue
        }
        // This is a hard edge or a border edge... Add faces separately group.
        if (f0 != -1) addFaceToGroup(f0);
        if (f1 != -1) addFaceToGroup(f1);
      }

      // Sort the groups to have the biggest group first.
      faceGroups.sort((a, b) => (a.length < b.length ? 1 : a.length > b.length ? -1 : 0));

      let firstVirtex = true;
      for (const faceGroup of faceGroups) {
        const normal = new Vec3$1();
        for (const faceIndex of faceGroup) {
          const face_edges = getConnectedEdgeVecs(faceIndex, i);
          const weight = face_edges[0].angleTo(face_edges[1]);
          // if (i == 1)
          //     console.log("FaceNormal:" + faceIndex + ":" + getFaceNormal(faceIndex).toString());
          normal.addInPlace(getFaceNormal(faceIndex).scale(weight));
        }
        normal.normalizeInPlace();
        if (firstVirtex) {
          setVertexNormal(i, normal);
          firstVirtex = false;
        } else {
          normalsAttr.setSplitVertexValues(i, faceGroup, normal);
        }
      }
    }

    return normalsAttr
  }

  /**
   * The computeHardEdgesIndices method.
   * @param {number} hardAngle - The hardAngle value in radians.
   * @return {array} - The return value.
   */
  computeHardEdgesIndices(hardAngle = 1.0) {
    if (!this.edgeVerts) this.calculateEdgeAngles();

    const hardEdges = [];
    const addEdge = (index) => {
      hardEdges.push(this.edgeVerts[index]);
      hardEdges.push(this.edgeVerts[index + 1]);
    };
    for (let i = 0; i < this.edgeAngles.length; i++) {
      if (this.edgeAngles[i] > hardAngle) {
        addEdge(i * 2);
      }
    }
    return Uint32Array.from(hardEdges)
  }

  /**
   * The getWireframeIndices method.
   * @return {any} - The return value.
   * @private
   */
  getWireframeIndices() {
    console.warn('@todo-review - This returns nothing');
    return indices
  }

  // ////////////////////////////////////////
  // Rendering

  /**
   * The genBuffers method.
   * @param {object} opts - The opts value.
   * @return {object} - The return value.
   */
  genBuffers(opts) {
    // Compute the normals on demand.
    // if (!('normals' in this.__vertexAttributes)) {
    //     // this.__geom.computeVertexNormals();
    //     this.addVertexAttribute("normals", Vec3, 0.0);
    // }

    const splitIndices = {};
    let splitCount = 0;
    for (const [, attr] of this.__vertexAttributes) {
      const attrSplits = attr.getSplits();
      for (const polygon in attrSplits) {
        if (!(polygon in splitIndices)) splitIndices[polygon] = {};
        const vertices = attrSplits[polygon];
        for (const v in vertices) {
          const vertex = parseInt(v);
          if (!(vertex in splitIndices[polygon])) {
            splitIndices[polygon][vertex] = splitCount;
            splitCount++;
          }
        }
      }
    }

    const positions = this.getVertexAttribute('positions');
    const numUnSplitVertices = positions.length;
    const totalNumVertices = numUnSplitVertices + splitCount;

    let indices;
    if (!opts || opts.includeIndices != false) {
      indices = this.generateTriangulatedIndices(totalNumVertices, numUnSplitVertices, splitIndices);
    }

    // let maxIndex;
    // if (debugAttrValues)
    //     maxIndex = Math.max(...indices);
    const attrBuffers = {};
    for (const [attrName, attr] of this.__vertexAttributes) {
      let values;
      if (splitCount == 0) values = attr.data;
      else values = attr.generateSplitValues(splitIndices, splitCount);

      const dimension = attr.numElements;
      const count = values.length / dimension;

      // if (debugAttrValues) {
      //     if (count <= maxIndex)
      //         console.warn("Invalid indexing. Attr value is insufficient for indexing:" + attrName + ". Max Index:" + maxIndex + " Attr Size:" + count);
      // }

      attrBuffers[attrName] = {
        values: values,
        count: count,
        dimension: dimension,
        normalized: attrName == 'normals',
        dataType: attr.dataType,
      };
    }

    const result = {
      numVertices: this.numVertices(),
      numRenderVerts: totalNumVertices,
      indices,
      attrBuffers,
    };

    if (opts && opts.includeVertexNeighbors) {
      if (this.vertexEdges == undefined) this.genTopologyInfo();

      let count = 0;
      for (let i = 0; i < this.vertexEdges.length; i++) {
        // If this face indexing doesn't start at 0, then the vertexEdges don't either.
        if (this.vertexEdges[i]) count += this.vertexEdges[i].size;
      }
      // The array will be structured as a start+offset for each vertex, followed
      // by a 2d array of neighbor indices.
      const vertexNeighbors = new Uint32Array(this.vertexEdges.length * 2 + count);

      const sortFanEdges = (fanEdges) => {
        for (let i = 0; i < fanEdges.length; i++) {
          const feA = fanEdges[i];
          for (let j = 0; j < i; j++) {
            const feB = fanEdges[j];
            if (feA[0] != -1 && feA[0] == feB[1]) {
              //  move feA after feB;
              if (i != j + 1) {
                fanEdges.splice(i, 1);
                fanEdges.splice(j + 1, 0, feA);
              }
              break
            }
            if (feA[1] != -1 && feA[1] == feB[0]) {
              //  move feA before feB;
              fanEdges.splice(i, 1);
              fanEdges.splice(j, 0, feA);
              break
            }
          }
        }
      };

      const checkFanEdges = (fanEdges) => {
        // now check that the faces all build a fan. Maybe starting and ending with -1
        if (fanEdges[0][0] == -1 || fanEdges[fanEdges.length - 1][1] == -1) {
          if (fanEdges[0][0] != -1 || fanEdges[fanEdges.length - 1][1] != -1) {
            throw new Error('If fan starts with -1, it must also end with -1')
          }
        }
        for (let i = 0; i < fanEdges.length; i++) {
          const fe = fanEdges[i];
          if (fe[0] == -1 || fe[1] == -1) {
            if (i != 0 && i != fanEdges.length - 1) {
              throw new Error('-1 only allowed at the beginning and end of a fan.')
            }
          }
          if (fe[0] != -1) {
            let prev = i - 1;
            if (prev < 0) prev += fanEdges.length;
            if (fe[0] != fanEdges[prev][1]) {
              throw new Error('Faces are not sequential')
            }
          }
          if (fe[1] != -1) {
            const next = (i + 1) % fanEdges.length;
            if (fe[1] != fanEdges[next][0]) {
              throw new Error('Faces are not sequential')
            }
          }
        }
      };

      // Populate the start and offset values.
      let offset = this.vertexEdges.length * 2;
      for (let i = 0; i < this.vertexEdges.length; i++) {
        if (this.vertexEdges[i] == undefined) continue
        const edges = this.vertexEdges[i];

        // Build a sorted list of faces based on a fan around
        // the vertex.
        const fanEdges = [];
        for (const e of edges) {
          const v0 = this.edgeVerts[e * 2];
          const v1 = this.edgeVerts[e * 2 + 1];
          let f0 = this.edgeFaces[e * 2];
          let f1 = this.edgeFaces[e * 2 + 1];
          let neigVert;
          if (v0 == i) {
            neigVert = v1;
          } else if (v1 == i) {
            neigVert = v0;
            // swap the faces
            const tmp = f0;
            f0 = f1;
            f1 = tmp;
          } else {
            throw new Error('Invalid topology')
          }
          fanEdges.push([f0, f1, neigVert]);
        }
        sortFanEdges(fanEdges);
        checkFanEdges(fanEdges);
        const closed = fanEdges[0][0] != -1 || fanEdges[fanEdges.length - 1][1] != -1;
        let flags = 0;
        if (closed) flags += 1;
        vertexNeighbors[i * 2] = offset;
        vertexNeighbors[i * 2 + 1] = edges.size + (flags << 8);
        for (const fe of fanEdges) {
          vertexNeighbors[offset] = fe[2];
          offset++;
        }
      }

      result.vertexNeighbors = vertexNeighbors;
    }

    return result
  }

  /**
   * Compute the number of triangles. For higher degree polygons, they are divided into multiple triangles for rendering.
   * @return {number} - Returns the number of triangles.
   */
  computeNumTriangles() {
    let numVertsPerFace = 3;
    let trisCount = 0;
    for (const fc of this.__faceCounts) {
      trisCount += fc * (numVertsPerFace - 2);
      numVertsPerFace++;
    }
    return trisCount
  }

  /**
   * To prepare data for rendering, the indices for the polygons is used to compute a new index buffer based on
   * only triangles. This is used during rendering and the resulting indices uploaded ot the GPU  by GLMesh class.
   *
   * @param {number} totalNumVertices - The total number of vertices.
   * @param {number} numUnSplitVertices - The total number of unsplit vertices.
   * @param {array} splitIndices - The splitIndices value.
   * @return {TypedArray} - Retures a typed array containing the triangulated indices.
   */
  generateTriangulatedIndices(totalNumVertices, numUnSplitVertices, splitIndices) {
    const trisCount = this.computeNumTriangles();

    let trianglulatedIndices;
    if (totalNumVertices < Math.pow(2, 8)) trianglulatedIndices = new Uint8Array(trisCount * 3);
    else if (totalNumVertices < Math.pow(2, 16)) trianglulatedIndices = new Uint16Array(trisCount * 3);
    else trianglulatedIndices = new Uint32Array(trisCount * 3);

    let triangleVertex = 0;
    const addTriangleVertexIndex = function (vertex, faceIndex) {
      if (vertex in splitIndices && faceIndex in splitIndices[vertex])
        vertex = numUnSplitVertices + splitIndices[vertex][faceIndex];
      trianglulatedIndices[triangleVertex] = vertex;
      triangleVertex++;
    };
    const numFaces = this.getNumFaces();
    for (let faceIndex = 0; faceIndex < numFaces; faceIndex++) {
      const faceVerts = this.getFaceVertexIndices(faceIndex);
      for (let j = 0; j < faceVerts.length; j++) {
        if (j >= 3) {
          // For each aditional triangle, we have to add 2 indices.
          addTriangleVertexIndex(faceVerts[0], faceIndex);
          addTriangleVertexIndex(faceVerts[j - 1], faceIndex);
        }
        addTriangleVertexIndex(faceVerts[j], faceIndex);
      }
    }
    return trianglulatedIndices
  }

  /**
   * The freeBuffers method.
   */
  freeBuffers() {
    super.freeBuffers();
    this.init();
  }

  // ////////////////////////////////////////
  // Persistence

  /**
   * Restores mesh properties from a binary reader.
   *
   * @param {BinReader} reader - The reader value.
   * @param {object} context - The context value.
   */
  readBinary(reader, context) {
    super.loadBaseGeomBinary(reader);
    this.setFaceCounts(reader.loadUInt32Array());

    // Note: we can remove this. We can infer this from the above faceCounts array.
    const faceVertexCounts = reader.loadUInt8Array(this.getNumFaces());
    const offsetRange = reader.loadSInt32Vec2();
    const bytes = reader.loadUInt8();
    let faceVertexIndexDeltas;
    if (bytes == 1) faceVertexIndexDeltas = reader.loadUInt8Array();
    else if (bytes == 2) faceVertexIndexDeltas = reader.loadUInt16Array();
    else if (bytes == 4) faceVertexIndexDeltas = reader.loadUInt32Array();

    const numFaces = this.getNumFaces();
    let offset = 0;
    let prevCount = 0;
    let faceOffsets = [];
    for (let faceIndex = 0; faceIndex < numFaces; faceIndex++) {
      const count = this.getFaceVertexCount(faceIndex);
      faceOffsets[faceIndex] = offset;
      for (let j = 0; j < count; j++) {
        const faceVertex = offset + j;
        const delta = faceVertexIndexDeltas[faceVertex] + offsetRange.x;
        if (faceIndex == 0) this.__faceVertexIndices[faceVertex] = delta;
        else {
          let prevFaceVertex = faceOffsets[faceIndex - 1];
          prevFaceVertex += j < prevCount ? j : prevCount - 1;
          this.__faceVertexIndices[faceVertex] = this.__faceVertexIndices[prevFaceVertex] + delta;
        }
      }
      offset += count;
      prevCount = count;
    }
    this.__numPopulatedFaceVertexIndices = offset;

    if (!this.hasVertexAttribute('normals')) {
      this.computeVertexNormals();
    }

    // this.computeVertexNormals();
    this.emit('geomDataChanged', {});
  }

  /**
   * The toJSON method encodes this type as a json object for persistence.
   *
   * @param {object} context - The context value.
   * @return {object} - Returns the json object.
   */
  toJSON(context) {
    const j = super.toJSON(context);
    j.faceCounts = Array.from(this.__faceCounts);
    j.faceVertexIndices = Array.from(this.__faceVertexIndices);

    return j
  }

  /**
   * The fromJSON method decodes a json object for this type.
   *
   * @param {object} j - The json object this item must decode.
   * @param {object} context - The context value.
   */
  fromJSON(j, context) {
    super.fromJSON(j, context);
    if (j.faceCounts) this.__faceCounts = j.faceCounts;
    if (j.faceVertexIndices) this.__faceVertexIndices = Uint32Array.from(j.faceVertexIndices);
  }
}

Registry.register('Mesh', Mesh);

/** Class representing a base geometry proxy.
 * @extends EventEmitter
 * @private
 */
class BaseProxy extends EventEmitter {
  /**
   * Create a base proxy.
   * @param {any} data - The data value.
   */
  constructor(data) {
    super();
    this.name = data.name;
    this.__buffers = data.geomBuffers;
    if (this.__buffers.attrBuffers) {
      // eslint-disable-next-line guard-for-in
      for (const attrName in this.__buffers.attrBuffers) {
        const attrData = this.__buffers.attrBuffers[attrName];
        const dataType = Registry.getBlueprint(attrData.dataType);
        attrData.dataType = dataType;
      }
    }

    this.boundingBox = new Box3$1();
    this.boundingBox.p0.__data = data.bbox.p0.__data;
    this.boundingBox.p1.__data = data.bbox.p1.__data;

    this.__metaData = new Map();
  }

  /**
   * The genBuffers method.
   * @return {any} - The return value.
   */
  genBuffers() {
    return this.__buffers
  }

  /**
   * The freeBuffers method.
   */
  freeBuffers() {
    // Note: Explicitly transfer data to a web worker and then
    // terminate the worker. (hacky way to free TypedArray memory explicitly)
    const freeData = { attrBuffers: {} };
    const transferables = [];
    if (this.__buffers.indices) {
      transferables.push(this.__buffers.indices.buffer);
      freeData.indices = this.__buffers.indices;
      delete this.__buffers.indices;
    }
    if (this.__buffers.attrBuffers) {
      for (const attrName in this.__buffers.attrBuffers) {
        const attrData = this.__buffers.attrBuffers[attrName];
        freeData.attrBuffers[attrName] = this.__buffers.attrBuffers[attrName];
        transferables.push(attrData.values.buffer);
        delete this.__buffers.attrBuffers[attrName];
      }
      delete this.__buffers.attrBuffers;
    }
  }

  // ////////////////////////////////////////
  // Metadata

  /**
   * The getMetadata method.
   * @param {any} key - The key value.
   * @return {any} - The return value.
   */
  getMetadata(key) {
    return this.__metaData.get(key)
  }

  /**
   * The hasMetadata method.
   * @param {any} key - The key value.
   * @return {any} - The return value.
   */
  hasMetadata(key) {
    return this.__metaData.has(key)
  }

  /**
   * The setMetadata method.
   * @param {any} key - The key value.
   * @param {object} metaData - The metaData value.
   */
  setMetadata(key, metaData) {
    this.__metaData.set(key, metaData);
  }
}

/** Class representing a points proxy.
 * @extends BaseProxy
 * @private
 */
class PointsProxy extends BaseProxy {
  /**
   * Create a points proxy.
   * @param {any} data - The data value.
   */
  constructor(data) {
    super(data);
  }
}

/** Class representing a lines proxy.
 * @extends BaseProxy
 * @private
 */
class LinesProxy extends BaseProxy {
  /**
   * Create a lines proxy.
   * @param {any} data - The data value.
   */
  constructor(data) {
    super(data);
  }
}

/** Class representing a mesh proxy.
 * @extends BaseProxy
 * @private
 */
class MeshProxy extends BaseProxy {
  /**
   * Create a mesh proxy.
   * @param {any} data - The data value.
   */
  constructor(data) {
    super(data);
  }
}

/**
 * Represents an ordered grid of points along `X` and `Y` axes.
 *
 * ```
 * const pointGrid = new PointGrid(2.2, 1.5, 12, 12)
 * ```
 *
 * @extends Points
 */
class PointGrid extends Points {
  /**
   * Creates an instance of PointGrid.
   *
   * @param {number} [x=1.0] - The length of the point grid along the X axis.
   * @param {number} [y=1.0] - The length of the point grid along the Y axis.
   * @param {number} [xDivisions=1] - The number of divisions along the X axis.
   * @param {number} [yDivisions=1] - The number of divisions along the Y axis.
   * @param {boolean} [addTextureCoords=false] - The addTextureCoords value.
   */
  constructor(x = 1.0, y = 1.0, xDivisions = 1, yDivisions = 1, addTextureCoords = false) {
    super();

    if (isNaN(x) || isNaN(y) || isNaN(xDivisions) || isNaN(yDivisions)) throw new Error('Invalid geom args')

    this.__x = x;
    this.__y = y;
    this.__xDivisions = xDivisions;
    this.__yDivisions = yDivisions;
    if (addTextureCoords) this.addVertexAttribute('texCoords', Vec2);
    this.__rebuild();
  }

  /**
   * Getter for X.
   * Is deprecated. Please use "getX".
   *
   * @deprecated
   * @return {number} - Returns the length.
   */
  get x() {
    console.warn("getter is deprecated. Please use 'getX'");
    return this.getX()
  }

  /**
   * Setter for X.
   * Is deprecated. Please use "setX".
   *
   * @deprecated
   * @param {number} val - The length along the X axis.
   */
  set x(val) {
    console.warn("getter is deprecated. Please use 'setX'");
    this.setX(val);
  }

  /**
   * Getter for Y.
   * Is deprecated. Please use "getY".
   *
   * @deprecated
   * @return {number} - Returns the length.
   */
  get y() {
    console.warn("getter is deprecated. Please use 'getY'");
    return this.getY()
  }

  /**
   * Setter for Y.
   * Is deprecated. Please use "setY".
   *
   * @deprecated
   * @param {number} val - The length along the Y axis.
   */
  set y(val) {
    console.warn("getter is deprecated. Please use 'setY'");
    this.setY(val);
  }

  /**
   * Getter for the length of the point grid along the `X` axis.
   *
   * @return {number} - Returns the length.
   */
  getX() {
    return this.__x
  }

  /**
   * Setter for the length of the point grid along the `X` axis.
   *
   * @param {number} val - The length along the `X` axis.
   */
  setX(val) {
    this.__x = val;
    this.__resize();
  }

  /**
   * Getter for the length of the point grid along the `Y` axis.
   *
   * @return {number} - Returns the length.
   */
  getY() {
    return this.__y
  }

  /**
   * Setter for the length of the point grid along the `Y` axis.
   *
   * @param {number} val - The length along the Y axis.
   */
  setY(val) {
    this.__y = val;
    this.__resize();
  }

  /**
   * Setter for the size of the point grid.
   *
   * @param {number} x - The length along the `X` axis.
   * @param {number} y - The length along the `Y` axis.
   */
  setSize(x, y) {
    this.__x = x;
    this.__y = y;
    this.__resize();
  }

  /**
   * The __rebuild method.
   * @private
   */
  __rebuild() {
    this.setNumVertices(this.__xDivisions * this.__yDivisions);

    const texCoords = this.getVertexAttribute('texCoords');
    if (texCoords) {
      for (let i = 0; i < this.__yDivisions; i++) {
        const y = i / (this.__yDivisions - 1);
        for (let j = 0; j < this.__xDivisions; j++) {
          const x = j / (this.__xDivisions - 1);
          texCoords.getValueRef(i * this.__xDivisions + j).set(x, y);
        }
      }
    }
    this.__resize(false);
    this.emit('geomDataTopologyChanged', {});
  }

  /**
   * The __resize method.
   * @param {number} emit - emit a 'geomDataChanged' event.
   * @private
   */
  __resize(emit = true) {
    const positions = this.getVertexAttribute('positions');
    for (let i = 0; i < this.__yDivisions; i++) {
      const y = (i / (this.__yDivisions - 1) - 0.5) * this.__y;
      for (let j = 0; j < this.__xDivisions; j++) {
        const x = (j / (this.__xDivisions - 1) - 0.5) * this.__x;
        positions.getValueRef(i * this.__xDivisions + j).set(x, y, 0.0);
      }
    }
    this.setBoundingBoxDirty();
    if (emit) this.emit('geomDataChanged', {});
  }

  /**
   * The toJSON method encodes this type as a json object for persistence.
   *
   * @return {object} - Returns the json object.
   */
  toJSON() {
    const json = super.toJSON();
    json['x'] = this.__x;
    json['y'] = this.__y;
    json['xDivisions'] = this.__xDivisions;
    json['yDivisions'] = this.__yDivisions;
    return json
  }
}

/**
 * A class for generating a rectangle shape.
 *
 * ```
 * const rect = new Rect(1.5, 2.0)
 * ```
 *
 * **Parameters**
 * * **x(`NumberParameter`):** Length of the rectangle along the `X` axis.
 * * **y(`NumberParameter`):** Length of the rectangle along the `Y` axis.
 *
 *
 * @extends Lines
 */
class Rect extends Lines {
  /**
   * Create a rect.
   * @param {number} x - The length of the rect along the `X` axis.
   * @param {number} y - The length of the rect along the `Y` axis.
   */
  constructor(x = 1.0, y = 1.0) {
    super();

    if (isNaN(x) || isNaN(y)) throw new Error('Invalid geom args')

    this.__x = this.addParameter(new NumberParameter('x', x));
    this.__x.on('valueChanged', this.__resize.bind(this));
    this.__y = this.addParameter(new NumberParameter('y', y));
    this.__y.on('valueChanged', this.__resize.bind(this));
    this.__rebuild();
  }

  /**
   * Getter for the length of the rect along the `X` axis.
   *
   * @return {number} - Returns the length.
   */
  get x() {
    return this.__x.getValue()
  }

  /**
   * Setter for the length of the rect along the `X` axis.
   *
   * @param {number} val - The length along the `X` axis.
   */
  set x(val) {
    this.__x.setValue(val);
  }

  /**
   * Getter for the length of the rect along the `Y` axis.
   *
   * @return {number} - Returns the length.
   */
  get y() {
    return this.__y.getValue()
  }

  /**
   * Setter for the length of the rect along the U axis.
   *
   * @param {number} val - The length along the `Y` axis.
   */
  set y(val) {
    this.__y.setValue(val);
  }

  /**
   * Setter for the size of the rect.
   *
   * @param {number} x - The length along the `X` axis.
   * @param {number} y - The length along the `Y` axis.
   */
  setSize(x, y) {
    this.__x.setValue(x, -1);
    this.__y.setValue(y, -1);
    this.__resize();
  }

  /**
   * The __rebuild method.
   * @private
   */
  __rebuild() {
    this.setNumVertices(4);
    this.setNumSegments(4);
    this.setSegmentVertexIndices(0, 0, 1);
    this.setSegmentVertexIndices(1, 1, 2);
    this.setSegmentVertexIndices(2, 2, 3);
    this.setSegmentVertexIndices(3, 3, 0);
    this.__resize(false);
    this.emit('geomDataTopologyChanged', {});
  }

  /**
   * The __resize method.
   * @param {number} emit - emit a 'geomDataChanged' event.
   * @private
   */
  __resize(emit) {
    const x = this.__x.getValue();
    const y = this.__y.getValue();

    const positions = this.getVertexAttribute('positions');
    positions.getValueRef(0).set(-0.5 * x, -0.5 * y, 0.0);
    positions.getValueRef(1).set(0.5 * x, -0.5 * y, 0.0);
    positions.getValueRef(2).set(0.5 * x, 0.5 * y, 0.0);
    positions.getValueRef(3).set(-0.5 * x, 0.5 * y, 0.0);
    this.setBoundingBoxDirty();
    if (emit) this.emit('geomDataChanged', {});
  }

  /**
   * The toJSON method encodes this type as a json object for persistence.
   *
   * @return {object} - Returns the json object.
   */
  toJSON() {
    const json = super.toJSON();
    json['x'] = this.__x;
    json['y'] = this.__y;
    return json
  }
}

Registry.register('Rect', Rect);

/**
 * A class for generating a circle shape using line segments.
 *
 * ```
 * const circle = new Circle(2.2, 12)
 * ```
 *
 * **Parameters**
 * * **Radius(`NumberParameter`):** Radius of the circle.
 * * **Angle(`NumberParameter`):** Number of segments used to build the circle.
 * * **NumSegments(`NumberParameter`):** Segments angle in radiants.
 *
 * @extends Lines
 */
class Circle extends Lines {
  /**
   * Creates an instance of Circle.
   * @param {number} radius - The radius of the circle.
   * @param {number} numSegments - The number of segments.
   * @param {number} angle - Arc segments angle(radians)
   */
  constructor(radius = 1.0, numSegments = 32, angle = Math.PI * 2) {
    super();

    if (isNaN(radius) || isNaN(numSegments)) throw new Error('Invalid geom args')

    this.__radius = this.addParameter(new NumberParameter('Radius', radius));
    this.__angle = this.addParameter(new NumberParameter('Angle', angle));
    this.__numSegments = this.addParameter(
      new NumberParameter('NumSegments', numSegments >= 3 ? numSegments : 3, [3, 200], 1)
    );

    const resize = () => {
      this.__resize();
    };
    const rebuild = () => {
      this.__rebuild();
    };
    this.__radius.on('valueChanged', resize);
    this.__angle.on('valueChanged', rebuild);
    this.__numSegments.on('valueChanged', rebuild);
    this.__rebuild();
  }

  /**
   * The __rebuild method.
   * @private
   */
  __rebuild() {
    const segs = this.__numSegments.getValue();
    this.setNumVertices(segs);
    const arc = this.__angle.getValue() < Math.PI * 2;
    if (arc) this.setNumSegments(segs - 1);
    else this.setNumSegments(segs);
    for (let i = 0; i < (arc ? segs - 1 : segs); i++) this.setSegmentVertexIndices(i, i, (i + 1) % segs);
    this.__resize(false);
    this.emit('geomDataTopologyChanged', {});
  }

  /**
   * The __resize method.
   * @param {boolean} emit - The emit value.
   * @private
   */
  __resize(mode) {
    const radius = this.__radius.getValue();
    const segs = this.__numSegments.getValue();
    const step = this.__angle.getValue() / segs;
    const positions = this.getVertexAttribute('positions');
    for (let i = 0; i < segs; i++) {
      positions.getValueRef(i).set(Math.cos(step * i) * radius, Math.sin(step * i) * radius, 0.0);
    }
    this.setBoundingBoxDirty();
    if (emit) this.emit('geomDataChanged', {});
  }
}

Registry.register('Circle', Circle);

/**
 * A class for generating a cross shape, drawing a line on the `X,Y,Z` axes.
 * The axis line length is the `size` you specify, but the middle of the line is positioned in the coordinate `(0, 0, 0)` .
 * Meaning that half of the line goes negative and half goes positive.
 *
 * ```
 * const cross = new Cross(1.5)
 * ```
 *
 * **Parameters**
 * * **size(`NumberParameter`):** Specifies the size of the cross.
 *
 * @extends Lines
 */
class Cross extends Lines {
  /**
   * Create a cross.
   * @param {number} size - The size of the cross.
   */
  constructor(size = 1.0) {
    super();

    if (isNaN(size)) throw new Error('Invalid geom args')

    this.__sizeParam = this.addParameter(new NumberParameter('size', size));
    this.__rebuild();

    const resize = () => {
      this.__resize();
    };
    this.__sizeParam.on('valueChanged', resize);
  }

  /**
   * The __rebuild method.
   * @private
   */
  __rebuild() {
    this.setNumVertices(6);
    this.setNumSegments(3);
    this.setSegmentVertexIndices(0, 0, 1);
    this.setSegmentVertexIndices(1, 2, 3);
    this.setSegmentVertexIndices(2, 4, 5);
    this.__resize();
  }

  /**
   * The __resize method.
   * @private
   */
  __resize() {
    const size = this.__sizeParam.getValue();
    const positions = this.getVertexAttribute('positions');
    positions.getValueRef(0).set(-0.5 * size, 0, 0);
    positions.getValueRef(1).set(0.5 * size, 0, 0);
    positions.getValueRef(2).set(0, 0.5 * size, 0);
    positions.getValueRef(3).set(0, -0.5 * size, 0);
    positions.getValueRef(4).set(0, 0, 0.5 * size);
    positions.getValueRef(5).set(0, 0, -0.5 * size);
    this.setBoundingBoxDirty();
    this.emit('geomDataChanged', {});
  }
}

Registry.register('Cross', Cross);

/**
 * A class for generating a lines cuboid shape(Without faces).
 *
 * **Parameters**
 * * **x(`NumberParameter`):** Length of the line cuboid along the `X` axis
 * * **y(`NumberParameter`):** Length of the line cuboid along the `Y` axis
 * * **z(`NumberParameter`):** Length of the line cuboid along the `Z` axis
 * * **BaseZAtZero(`NumberParameter`):** Property to start or not `Z` axis from position `0.
 *
 * @extends Lines
 */
class LinesCuboid extends Lines {
  /**
   * Create a lines cuboid.
   * @param {number} x - The length of the line cuboid along the X axis.
   * @param {number} y - The length of the line cuboid along the Y axis.
   * @param {number} z - The length of the line cuboid along the Z axis.
   * @param {boolean} baseZAtZero - The baseZAtZero value.
   */
  constructor(x = 1.0, y = 1.0, z = 1.0, baseZAtZero = false) {
    super();

    this.__x = this.addParameter(new NumberParameter('x', x));
    this.__y = this.addParameter(new NumberParameter('y', y));
    this.__z = this.addParameter(new NumberParameter('z', z));

    this.__baseZAtZero = this.addParameter(new NumberParameter('BaseZAtZero', baseZAtZero));
    this.__rebuild();

    const resize = () => {
      this.__resize();
    };
    const rebuild = () => {
      this.__rebuild();
    };
    this.__x.on('valueChanged', resize);
    this.__y.on('valueChanged', resize);
    this.__z.on('valueChanged', resize);
    this.__baseZAtZero.on('valueChanged', rebuild);
  }

  /**
   * The __rebuild method.
   * @private
   */
  __rebuild() {
    this.setNumVertices(8);
    this.setNumSegments(12);
    this.setSegmentVertexIndices(0, 0, 1);
    this.setSegmentVertexIndices(1, 1, 2);
    this.setSegmentVertexIndices(2, 2, 3);
    this.setSegmentVertexIndices(3, 3, 0);

    this.setSegmentVertexIndices(4, 4, 5);
    this.setSegmentVertexIndices(5, 5, 6);
    this.setSegmentVertexIndices(6, 6, 7);
    this.setSegmentVertexIndices(7, 7, 4);

    this.setSegmentVertexIndices(8, 0, 4);
    this.setSegmentVertexIndices(9, 1, 5);
    this.setSegmentVertexIndices(10, 2, 6);
    this.setSegmentVertexIndices(11, 3, 7);
    this.__resize(false);
    this.emit('geomDataTopologyChanged', {});
  }

  /**
   * The __resize method.
   * @private
   */
  __resize() {
    const x = this.__x.getValue();
    const y = this.__y.getValue();
    const z = this.__z.getValue();
    const baseZAtZero = this.__baseZAtZero.getValue();

    const positions = this.getVertexAttribute('positions');
    let zoff = 0.5;
    if (baseZAtZero) zoff = 1.0;
    positions.getValueRef(0).set(0.5 * x, -0.5 * y, zoff * z);
    positions.getValueRef(1).set(0.5 * x, 0.5 * y, zoff * z);
    positions.getValueRef(2).set(-0.5 * x, 0.5 * y, zoff * z);
    positions.getValueRef(3).set(-0.5 * x, -0.5 * y, zoff * z);

    zoff = -0.5;
    if (baseZAtZero) zoff = 0.0;
    positions.getValueRef(4).set(0.5 * x, -0.5 * y, zoff * z);
    positions.getValueRef(5).set(0.5 * x, 0.5 * y, zoff * z);
    positions.getValueRef(6).set(-0.5 * x, 0.5 * y, zoff * z);
    positions.getValueRef(7).set(-0.5 * x, -0.5 * y, zoff * z);

    this.setBoundingBoxDirty();
    if (emit) this.emit('geomDataChanged', {});
  }

  /**
   * The toJSON method encodes this type as a json object for persistence.
   *
   * @return {object} - Returns the json object.
   */
  toJSON() {
    const json = super.toJSON();
    json['size'] = this.__size;
    return json
  }
}

Registry.register('LinesCuboid', LinesCuboid);

/**
 * Represents a network of lines that cross each other to form a series of squares or rectangles.
 *
 * ```
 * const grid = new Grid(5, 5, 50, 50, true)
 * ```
 *
 * **Parameters**
 * * **x(`NumberParameter`):** Length of the grid along the `X` axis.
 * * **y(`NumberParameter`):** Length of the grid along the `Y` axis.
 * * **xDivisions(`NumberParameter`):** Number of divisions along `X` axis
 * * **yDivisions(`NumberParameter`):** Number of divisions along `Y` axis
 * * **skipCenterLines(`BooleanParameter`):** Property that indicates whether to display the center grid lines or not
 *
 * @extends Lines
 */
class Grid extends Lines {
  /**
   * Create a grid.
   * @param {number} x - The length of the grid along the `X` axis.
   * @param {number} y - The length of the grid along the `Y` axis.
   * @param {number} xDivisions - The number of divisions along `X` axis.
   * @param {number} yDivisions - The number of divisions along `Y` axis.
   * @param {boolean} skipCenterLines - A boolean indicating whether to display the center grid lines or not.
   */
  constructor(x = 1.0, y = 1.0, xDivisions = 10, yDivisions = 10, skipCenterLines = false) {
    super();

    if (isNaN(x) || isNaN(y) || isNaN(xDivisions) || isNaN(yDivisions)) throw new Error('Invalid geom args')

    this.__xParam = this.addParameter(new NumberParameter('x', x));
    this.__yParam = this.addParameter(new NumberParameter('y', y));
    this.__xDivisionsParam = this.addParameter(new NumberParameter('xDivisions', xDivisions));
    this.__yDivisionsParam = this.addParameter(new NumberParameter('yDivisions', yDivisions));
    this.__skipCenterLinesParam = this.addParameter(new BooleanParameter('skipCenterLines', skipCenterLines));

    this.__rebuild();
  }

  /**
   * The __rebuild method.
   * @private
   */
  __rebuild() {
    const xDivisions = this.__xDivisionsParam.getValue();
    const yDivisions = this.__yDivisionsParam.getValue();

    const skipCenterLines = this.__skipCenterLinesParam.getValue() && xDivisions % 2 == 0 && yDivisions % 2 == 0;
    this.setNumVertices((xDivisions + yDivisions + 2 - (skipCenterLines ? 1 : 0)) * 2);
    this.setNumSegments(xDivisions + yDivisions + 2 - (skipCenterLines ? 1 : 0));
    let idx = 0;
    for (let i = 0; i <= xDivisions; i++) {
      if (skipCenterLines && i == xDivisions / 2) continue
      const v0 = idx * 2;
      const v1 = idx * 2 + 1;
      this.setSegmentVertexIndices(idx, v0, v1);
      idx++;
    }
    for (let i = 0; i <= yDivisions; i++) {
      if (skipCenterLines && i == xDivisions / 2) continue
      const v0 = idx * 2;
      const v1 = idx * 2 + 1;
      this.setSegmentVertexIndices(idx, v0, v1);
      idx++;
    }
    this.__resize();
  }

  /**
   * The __resize method.
   * @private
   */
  __resize() {
    const positions = this.getVertexAttribute('positions');
    const xDivisions = this.__xDivisionsParam.getValue();
    const yDivisions = this.__yDivisionsParam.getValue();
    const xSize = this.__xParam.getValue();
    const ySize = this.__yParam.getValue();

    const skipCenterLines = this.__skipCenterLinesParam.getValue() && xDivisions % 2 == 0 && yDivisions % 2 == 0;
    let idx = 0;
    for (let i = 0; i <= xDivisions; i++) {
      if (skipCenterLines && i == xDivisions / 2) continue
      const v0 = idx * 2;
      const v1 = idx * 2 + 1;
      const x = (i / xDivisions - 0.5) * xSize;
      positions.getValueRef(v0).set(x, -0.5 * ySize, 0.0);
      positions.getValueRef(v1).set(x, 0.5 * ySize, 0.0);
      idx++;
    }
    for (let i = 0; i <= yDivisions; i++) {
      if (skipCenterLines && i == xDivisions / 2) continue
      const v0 = idx * 2;
      const v1 = idx * 2 + 1;
      const y = (i / yDivisions - 0.5) * ySize;
      positions.getValueRef(v0).set(-0.5 * xSize, y, 0.0);
      positions.getValueRef(v1).set(0.5 * xSize, y, 0.0);
      idx++;
    }

    this.setBoundingBoxDirty();
  }

  /**
   * The toJSON method encodes this type as a json object for persistence.
   *
   * @return {object} - Returns the json object.
   */
  toJSON() {
    const json = super.toJSON();
    json['x'] = this.__x;
    json['z'] = this.__y;
    json['xDivisions'] = this.__xDivisions;
    json['yDivisions'] = this.__yDivisions;
    return json
  }
}

Registry.register('Grid', Grid);

/* eslint-disable no-unused-vars */

/**
 * Represents a cone geometry.
 *
 * ```
 * const cone = new Cone(1.2, 4.0)
 * ```
 *
 * **Parameters**
 * * **radius(`NumberParameter`):** Specifies the radius of the base of the cone.
 * * **height(`NumberParameter`):** Specifies the height of the cone.
 * * **detail(`NumberParameter`):** Specifies the number of subdivisions around the `Z` axis.
 * * **cap(`BooleanParameter`):** Specifies whether the base of the cone is capped or open.
 *
 * @extends Mesh
 */
class Cone extends Mesh {
  /**
   * Create a cone.
   * @param {number} radius - The radius of the base of the cone.
   * @param {number} height - The height of the cone.
   * @param {number} detail - The detail of the cone.
   * @param {boolean} cap -  A boolean indicating whether the base of the cone is capped or open.
   */
  constructor(radius = 0.5, height = 1.0, detail = 32, cap = true) {
    super();

    if (isNaN(radius) || isNaN(height) || isNaN(detail)) throw new Error('Invalid geom args')

    this.__radiusParam = this.addParameter(new NumberParameter('radius', radius));
    this.__heightParam = this.addParameter(new NumberParameter('height', height));
    this.__detailParam = this.addParameter(new NumberParameter('detail', detail >= 3 ? detail : 3, [3, 200], 1));
    this.__capParam = this.addParameter(new BooleanParameter('cap', cap));

    this.addVertexAttribute('texCoords', Vec2);
    this.addVertexAttribute('normals', Vec3$1);
    this.__rebuild();

    const resize = () => {
      this.__resize();
    };
    const rebuild = () => {
      this.__rebuild();
    };
    this.__radiusParam.on('valueChanged', resize);
    this.__heightParam.on('valueChanged', resize);
    this.__detailParam.on('valueChanged', rebuild);
    this.__capParam.on('valueChanged', rebuild);
  }

  /**
   * The __rebuild method.
   * @private
   */
  __rebuild() {
    this.clear();

    const nbSides = this.__detailParam.getValue();
    const radius = this.__radiusParam.getValue();
    const height = this.__heightParam.getValue();
    const cap = this.__capParam.getValue();
    let numVertices = nbSides + 1;
    if (cap) {
      numVertices += 1;
    }
    this.setNumVertices(numVertices);
    const tipPoint = nbSides;
    const basePoint = nbSides + 1;

    // ////////////////////////////
    // Set Vertex Positions
    const positions = this.getVertexAttribute('positions');

    positions.getValueRef(tipPoint).set(0.0, 0.0, height);
    for (let i = 0; i < nbSides; i++) {
      const theta = (i / nbSides) * 2.0 * Math.PI;
      positions.getValueRef(i).set(radius * Math.cos(theta), radius * Math.sin(theta), 0.0);
    }
    if (cap) {
      positions.getValueRef(basePoint).set(0.0, 0.0, 0.0);
    }

    // ////////////////////////////
    // Build the topology
    this.setFaceCounts([nbSides + (cap ? nbSides : 0)]);
    for (let i = 0; i < nbSides; i++) {
      const j = (i + 1) % nbSides;
      this.setFaceVertexIndices(i, [j, i, tipPoint]);
    }
    if (cap) {
      for (let i = 0; i < nbSides; i++) {
        const j = (i + 1) % nbSides;
        this.setFaceVertexIndices(nbSides + i, [i, j, basePoint]);
      }
    }

    // ////////////////////////////
    // setNormals
    const normals = this.getVertexAttribute('normals');

    let normalElevation;
    const divider = height;
    if (Math.abs(height) < 1.0e-12) normalElevation = height < 0 ? -1.0e-12 : 1.0e-12;
    normalElevation = radius / divider;

    let tri = 0;
    for (let i = 0; i < nbSides; i++) {
      const theta1 = ((i + 1) / nbSides) * 2.0 * Math.PI;
      const theta2 = (i / nbSides) * 2.0 * Math.PI;
      const theta = (theta1 + theta2) * 0.5;

      normals.setFaceVertexValue(tri, 0, new Vec3$1(Math.cos(theta1), normalElevation, Math.sin(theta1)).normalize());
      normals.setFaceVertexValue(tri, 1, new Vec3$1(Math.cos(theta2), normalElevation, Math.sin(theta2)).normalize());
      normals.setFaceVertexValue(tri, 2, new Vec3$1(Math.cos(theta), normalElevation, Math.sin(theta)).normalize());
      tri++;
    }
    if (cap) {
      const normal = new Vec3$1(0.0, -1.0, 0.0);
      for (let i = 0; i < nbSides; i++) {
        normals.setFaceVertexValue(tri, 0, normal);
        normals.setFaceVertexValue(tri, 1, normal);
        normals.setFaceVertexValue(tri, 2, normal);
        tri++;
      }
    }

    // ////////////////////////////
    // setUVs
    const texCoords = this.getVertexAttribute('texCoords');

    // Now set the attrbute values
    tri = 0;
    for (let i = 0; i < nbSides; i++) {
      texCoords.setFaceVertexValue(tri, 0, new Vec2((i + 1) / nbSides, 0.0));
      texCoords.setFaceVertexValue(tri, 1, new Vec2(i / nbSides, 0.0));
      texCoords.setFaceVertexValue(tri, 2, new Vec2((i + 0.5) / nbSides, 1.0));
    }
    if (cap) {
      for (let i = 0; i < nbSides; i++) {
        texCoords.setFaceVertexValue(tri, 0, new Vec2(i / nbSides, 0.0));
        texCoords.setFaceVertexValue(tri, 1, new Vec2((i + 1) / nbSides, 0.0));
        texCoords.setFaceVertexValue(tri, 2, new Vec2((i + 0.5) / nbSides, 1.0));
        tri++;
      }
    }

    this.setBoundingBoxDirty();
    this.emit('geomDataTopologyChanged', {});
  }

  /**
   * The __resize method.
   * @private
   */
  __resize() {
    const nbSides = this.__detailParam.getValue();
    const radius = this.__radiusParam.getValue();
    const height = this.__heightParam.getValue();
    const cap = this.__capParam.getValue();

    const tipPoint = nbSides;
    const basePoint = nbSides + 1;

    const positions = this.getVertexAttribute('positions');
    positions.getValueRef(tipPoint).set(0.0, 0.0, height);
    for (let i = 0; i < nbSides; i++) {
      const theta = (i / nbSides) * 2.0 * Math.PI;
      positions.getValueRef(i).set(radius * Math.cos(theta), radius * Math.sin(theta), 0.0);
    }
    if (this.__cap) {
      positions.getValueRef(basePoint).set(0.0, 0.0, 0.0);
    }

    this.setBoundingBoxDirty();
    this.emit('geomDataChanged', {});
  }
}

Registry.register('Cone', Cone);

/**
 * A class for generating a cuboid geometry.
 *
 * **Parameters**
 * * **x(`NumberParameter`):** Length of the line cuboid along the `X` axis
 * * **y(`NumberParameter`):** Length of the line cuboid along the `Y` axis
 * * **z(`NumberParameter`):** Length of the line cuboid along the `Z` axis
 * * **BaseZAtZero(`NumberParameter`):** Property to start or not `Z` axis from position `0.
 *
 * @extends Mesh
 */
class Cuboid extends Mesh {
  /**
   * Create a cuboid.
   * @param {number} x - The length of the cuboid along the X axis.
   * @param {number} y - The length of the cuboid along the Y axis.
   * @param {number} z - The length of the cuboid along the Z axis.
   * @param {boolean} baseZAtZero - The baseZAtZero value.
   */
  constructor(x = 1.0, y = 1.0, z = 1.0, baseZAtZero = false) {
    super();

    if (isNaN(x) || isNaN(y) || isNaN(z)) throw new Error('Invalid geom args')

    this.__xParam = this.addParameter(new NumberParameter('x', x));
    this.__yParam = this.addParameter(new NumberParameter('y', y));
    this.__zParam = this.addParameter(new NumberParameter('z', z));
    this.__baseZAtZeroParam = this.addParameter(new BooleanParameter('baseZAtZero', baseZAtZero));

    this.setFaceCounts([0, 6]);
    this.setFaceVertexIndices(0, [0, 1, 2, 3]);
    this.setFaceVertexIndices(1, [7, 6, 5, 4]);

    this.setFaceVertexIndices(2, [1, 0, 4, 5]);
    this.setFaceVertexIndices(3, [3, 2, 6, 7]);

    this.setFaceVertexIndices(4, [0, 3, 7, 4]);
    this.setFaceVertexIndices(5, [2, 1, 5, 6]);
    this.setNumVertices(8);
    this.addVertexAttribute('texCoords', Vec2);
    this.addVertexAttribute('normals', Vec3$1);
    this.__rebuild();

    const resize = () => {
      this.__resize();
    };
    this.__xParam.on('valueChanged', resize);
    this.__yParam.on('valueChanged', resize);
    this.__zParam.on('valueChanged', resize);
    this.__baseZAtZeroParam.on('valueChanged', resize);
  }

  /**
   * Setter for the size of the cuboid.
   *
   * @param {number} x - The length of the edges along the X axis.
   * @param {number} y - The length of the edges along the Y axis.
   * @param {number} z - The length of the edges along the Z axis.
   */
  setSize(x, y, z) {
    this.__xParam.setValue(x);
    this.__yParam.setValue(y);
    this.__zParam.setValue(z);
  }

  /**
   * Setter for the base size of the cuboid.
   *
   * @param {number} x - The length of the edges along the X axis.
   * @param {number} y - The length of the edges along the Y axis.
   */
  setBaseSize(x, y) {
    this.__xParam.setValue(x);
    this.__yParam.setValue(y);
  }

  /**
   * The __rebuild method.
   * @private
   */
  __rebuild() {
    const normals = this.getVertexAttribute('normals');
    for (let i = 0; i < 6; i++) {
      let normal;
      switch (i) {
        case 0:
          normal = new Vec3$1(0, 0, 1);
          break
        case 1:
          normal = new Vec3$1(0, 0, -1);
          break
        case 2:
          normal = new Vec3$1(1, 0, 0);
          break
        case 3:
          normal = new Vec3$1(-1, 0, 0);
          break
        case 4:
          normal = new Vec3$1(0, 1, 0);
          break
        case 5:
          normal = new Vec3$1(0, -1, 0);
          break
      }
      normals.setFaceVertexValue(i, 0, normal);
      normals.setFaceVertexValue(i, 1, normal);
      normals.setFaceVertexValue(i, 2, normal);
      normals.setFaceVertexValue(i, 3, normal);
    }
    const texCoords = this.getVertexAttribute('texCoords');
    for (let i = 0; i < 6; i++) {
      texCoords.setFaceVertexValue(i, 0, new Vec2(0, 0));
      texCoords.setFaceVertexValue(i, 1, new Vec2(1, 0));
      texCoords.setFaceVertexValue(i, 2, new Vec2(1, 1));
      texCoords.setFaceVertexValue(i, 3, new Vec2(0, 1));
    }
    this.__resize();
  }

  /**
   * The __resize method.
   * @private
   */
  __resize() {
    const x = this.__xParam.getValue();
    const y = this.__yParam.getValue();
    const z = this.__zParam.getValue();
    const baseZAtZero = this.__baseZAtZeroParam.getValue();
    let zoff = 0.5;
    const positions = this.getVertexAttribute('positions');
    if (baseZAtZero) zoff = 1.0;
    positions.getValueRef(0).set(0.5 * x, -0.5 * y, zoff * z);
    positions.getValueRef(1).set(0.5 * x, 0.5 * y, zoff * z);
    positions.getValueRef(2).set(-0.5 * x, 0.5 * y, zoff * z);
    positions.getValueRef(3).set(-0.5 * x, -0.5 * y, zoff * z);

    zoff = -0.5;
    if (baseZAtZero) zoff = 0.0;
    positions.getValueRef(4).set(0.5 * x, -0.5 * y, zoff * z);
    positions.getValueRef(5).set(0.5 * x, 0.5 * y, zoff * z);
    positions.getValueRef(6).set(-0.5 * x, 0.5 * y, zoff * z);
    positions.getValueRef(7).set(-0.5 * x, -0.5 * y, zoff * z);

    this.setBoundingBoxDirty();
    this.emit('geomDataChanged', {});
  }

  /**
   * The toJSON method encodes this type as a json object for persistence.
   *
   * @return {object} - Returns the json object.
   */
  toJSON() {
    const json = super.toJSON();
    json['x'] = this.__x;
    json['y'] = this.__y;
    json['z'] = this.__z;
    return json
  }
}

Registry.register('Cuboid', Cuboid);

/**
 * A class for generating a cylinder geometry. It is very much like a cuboid but with `N` number of sides.
 *
 * ```
 * const cylinder = new Cylinder(1.5, 2.0, 6)
 * ```
 *
 * **Parameters**
 * * **radius(`NumberParameter`):** Specifies the radius of the cylinder.
 * * **height(`NumberParameter`):** Specifies the height of the cone.
 * * **sides(`NumberParameter`):** Specifies the number of subdivisions around the `Z` axis.
 * * **loops(`NumberParameter`):** Specifies the number of subdivisions(stacks) on the `Z` axis.
 * * **caps(`BooleanParameter`):** Specifies whether the ends of the cylinder are capped or open.
 * * **baseZAtZero(`BooleanParameter`):** Property to start or not `Z` axis from position `0.
 *
 * @extends Mesh
 */
class Cylinder extends Mesh {
  /**
   * Create a cylinder.
   * @param {number} radius - The radius of the cylinder.
   * @param {number} height - The height of the cylinder.
   * @param {number} sides - The number of sides.
   * @param {number} loops - The number of loops.
   * @param {boolean} caps - A boolean indicating whether the ends of the cylinder are capped or open.
   * @param {boolean} baseZAtZero - The baseZAtZero value.
   */
  constructor(radius = 0.5, height = 1.0, sides = 32, loops = 2, caps = true, baseZAtZero = false) {
    super();

    if (isNaN(radius) || isNaN(height) || isNaN(sides) || isNaN(loops)) throw new Error('Invalid geom args')

    this.__radiusParam = this.addParameter(new NumberParameter('radius', radius));
    this.__heightParam = this.addParameter(new NumberParameter('height', height));
    this.__sidesParam = this.addParameter(new NumberParameter('sides', sides >= 3 ? sides : 3, [3, 200], 1));
    this.__loopsParam = this.addParameter(new NumberParameter('loops', loops >= 2 ? loops : 2, [1, 200], 1));
    this.__capsParam = this.addParameter(new BooleanParameter('caps', caps));
    this.__baseZAtZeroParam = this.addParameter(new BooleanParameter('baseZAtZero', baseZAtZero));

    this.addVertexAttribute('texCoords', Vec2);
    this.addVertexAttribute('normals', Vec3$1);
    this.__rebuild();

    const resize = () => {
      this.__resize();
    };
    const rebuild = () => {
      this.__rebuild();
    };
    this.__radiusParam.on('valueChanged', resize);
    this.__heightParam.on('valueChanged', resize);
    this.__sidesParam.on('valueChanged', rebuild);
    this.__loopsParam.on('valueChanged', rebuild);
    this.__capsParam.on('valueChanged', rebuild);
    this.__baseZAtZeroParam.on('valueChanged', resize);
  }

  /**
   * The __rebuild method.
   * @private
   */
  __rebuild() {
    this.clear();

    const nbSides = this.__sidesParam.getValue();
    const nbLoops = this.__loopsParam.getValue();
    const caps = this.__capsParam.getValue();

    let numVertices = nbSides * nbLoops;
    if (caps) {
      numVertices += 2;
    }
    this.setNumVertices(numVertices);
    if (caps) this.setFaceCounts([nbSides * 2, nbSides]);
    else this.setFaceCounts([0, nbSides]);

    // ////////////////////////////
    // Build the topology
    let faceIndex = 0;

    if (caps) {
      // Bottom caps topology
      for (let j = 0; j < nbSides; j++) {
        const v0 = numVertices - 1;
        const v1 = j;
        const v2 = (j + 1) % nbSides;
        this.setFaceVertexIndices(faceIndex++, [v0, v1, v2]);
      }
      // Top caps topology
      for (let j = 0; j < nbSides; j++) {
        const v0 = nbSides * (nbLoops - 1) + j;
        const v1 = numVertices - 2;
        const v2 = nbSides * (nbLoops - 1) + ((j + 1) % nbSides);
        this.setFaceVertexIndices(faceIndex++, [v0, v1, v2]);
      }
    }

    // build the topology for the body of the cylinder
    for (let i = 0; i < nbLoops - 1; i++) {
      for (let j = 0; j < nbSides; j++) {
        const v0 = nbSides * i + ((j + 1) % nbSides);
        const v1 = nbSides * i + j;
        const v2 = nbSides * (i + 1) + j;
        const v3 = nbSides * (i + 1) + ((j + 1) % nbSides);
        this.setFaceVertexIndices(faceIndex++, [v0, v1, v2, v3]);
      }
    }

    // ////////////////////////////
    // setNormals
    const normals = this.getVertexAttribute('normals');

    // Now set the attribute values
    faceIndex = 0;
    if (caps) {
      const normal = new Vec3$1(0.0, 0.0, -1.0);
      for (let i = 0; i < nbSides; i++) {
        normals.setFaceVertexValue(faceIndex, 0, normal);
        normals.setFaceVertexValue(faceIndex, 1, normal);
        normals.setFaceVertexValue(faceIndex, 2, normal);
        faceIndex++;
      }
      normal.set(0.0, 0.0, 1.0);
      for (let i = 0; i < nbSides; i++) {
        normals.setFaceVertexValue(faceIndex, 0, normal);
        normals.setFaceVertexValue(faceIndex, 1, normal);
        normals.setFaceVertexValue(faceIndex, 2, normal);
        faceIndex++;
      }
    }
    for (let i = 0; i < nbLoops - 1; i++) {
      for (let j = 0; j < nbSides; j++) {
        let phi = (j / nbSides) * 2.0 * Math.PI;
        const normal1 = new Vec3$1(Math.sin(phi), Math.cos(phi), 0.0);
        normals.setFaceVertexValue(faceIndex, 0, normal1);
        normals.setFaceVertexValue(faceIndex, 1, normal1);

        phi = ((j + 1) / nbSides) * 2.0 * Math.PI;
        const normal2 = new Vec3$1(Math.sin(phi), Math.cos(phi), 0.0);
        normals.setFaceVertexValue(faceIndex, 2, normal2);
        normals.setFaceVertexValue(faceIndex, 3, normal2);
        faceIndex++;
      }
    }

    // ////////////////////////////
    // setUVs
    const texCoords = this.getVertexAttribute('texCoords');

    // Now set the attrbute values
    faceIndex = 0;
    if (caps) {
      for (let i = 0; i < nbSides; i++) {
        texCoords.setFaceVertexValue(faceIndex, 0, new Vec2(i / nbSides, 0.0));
        texCoords.setFaceVertexValue(faceIndex, 1, new Vec2((i + 1) / nbSides, 0.0));
        texCoords.setFaceVertexValue(faceIndex, 2, new Vec2((i + 0.5) / nbSides, 1.0));
        faceIndex++;
      }
      for (let i = 0; i < nbSides; i++) {
        texCoords.setFaceVertexValue(faceIndex, 0, new Vec2(i / nbSides, 0.0));
        texCoords.setFaceVertexValue(faceIndex, 1, new Vec2((i + 1) / nbSides, 0.0));
        texCoords.setFaceVertexValue(faceIndex, 2, new Vec2((i + 0.5) / nbSides, 1.0));
        faceIndex++;
      }
    }

    for (let i = 0; i < nbSides; i++) {
      texCoords.setFaceVertexValue(faceIndex, 0, new Vec2((i + 1) / nbSides, 0.0));
      texCoords.setFaceVertexValue(faceIndex, 2, new Vec2((i + 1) / nbSides, 1.0));
      texCoords.setFaceVertexValue(faceIndex, 1, new Vec2(i / nbSides, 0.0));
      texCoords.setFaceVertexValue(faceIndex, 3, new Vec2(i / nbSides, 1.0));
      faceIndex++;
    }

    this.emit('geomDataTopologyChanged', {});
    this.__resize();
  }

  /**
   * The __resize method.
   * @private
   */
  __resize() {
    const nbSides = this.__sidesParam.getValue();
    const nbLoops = this.__loopsParam.getValue();
    const radius = this.__radiusParam.getValue();
    const height = this.__heightParam.getValue();
    const caps = this.__capsParam.getValue();
    const baseZAtZero = this.__baseZAtZeroParam.getValue();

    let numVertices = nbSides * nbLoops;
    if (caps) {
      numVertices += 2;
    }
    let vertex = 0;
    let zoff = 0.5;
    if (baseZAtZero) zoff = 0.0;

    const positions = this.getVertexAttribute('positions');
    for (let i = 0; i < nbLoops; i++) {
      const z = (i / (nbLoops - 1)) * height - height * zoff;
      for (let j = 0; j < nbSides; j++) {
        const phi = (j / nbSides) * 2.0 * Math.PI;
        positions.getValueRef(vertex).set(Math.sin(phi) * radius, Math.cos(phi) * radius, z);
        vertex++;
      }
    }
    if (caps) {
      positions.getValueRef(numVertices - 1).set(0.0, 0.0, height * (baseZAtZero ? 0.0 : -0.5));
      positions.getValueRef(numVertices - 2).set(0.0, 0.0, height * (baseZAtZero ? 1.0 : 0.5));
    }

    this.setBoundingBoxDirty();
    this.emit('geomDataChanged', {});
  }
}

Registry.register('Cylinder', Cylinder);

/**
 * A class for generating a disc geometry.
 *
 * ```
 * const disc = new Disc(2.0, 22)
 * ```
 *
 * **Parameters**
 * * **radius(`NumberParameter`):** Specifies the radius of the disc.
 * * **sides(`NumberParameter`):** Specifies the resolution, or the disc subdivisions around `Z` axis.
 *
 * @extends Mesh
 */
class Disc extends Mesh {
  /**
   * Creates an instance of Disc.
   *
   * @param {number} [radius=0.5] - The radius of the disc.
   * @param {number} [sides=32] - The number of sides.
   */
  constructor(radius = 0.5, sides = 32) {
    super();

    if (isNaN(radius) || isNaN(sides)) throw new Error('Invalid geom args')

    this.__radiusParam = this.addParameter(new NumberParameter('radius', radius));
    this.__sidesParam = this.addParameter(new NumberParameter('sides', sides >= 3 ? sides : 3, [3, 200], 1));

    this.addVertexAttribute('texCoords', Vec2);
    this.addVertexAttribute('normals', Vec3$1);
    this.__rebuild();
  }

  /**
   * Returns the value of the `radius` parameter.
   *
   * @return {number} - Returns the radius.
   */
  get radius() {
    return this.__radius
  }

  /**
   * Sets the value of the `radius` parameter.
   *
   * @param {number} val - The radius value.
   */
  set radius(val) {
    this.__radius = val;
    this.__resize();
  }

  /**
   * Sets the value of the `sides` parameter.
   * @param {number} val - The number of sides.
   */
  set sides(val) {
    this.__sides = val >= 3 ? val : 3;
    this.__rebuild();
  }

  /**
   * The __rebuild method.
   * @private
   */
  __rebuild() {
    const nbSides = this.__sidesParam.getValue();

    this.setNumVertices(nbSides + 1);
    this.setFaceCounts([nbSides]);

    // ////////////////////////////
    // Set Vertex Positions
    const positions = this.getVertexAttribute('positions');
    positions.getValueRef(0).set(0.0, 0.0, 0.0);

    // ////////////////////////////
    // Build the topology
    for (let j = 0; j < nbSides; j++) {
      const v1 = (j % nbSides) + 1;
      const v2 = ((j + 1) % nbSides) + 1;
      this.setFaceVertexIndices(j, [0, v1, v2]);
    }

    // ////////////////////////////
    // setNormals
    const normals = this.getVertexAttribute('normals');
    // Now set the attrbute values
    const normal = new Vec3$1(0, 0, 1);
    normals.setValue(0, normal);
    for (let i = 0; i < nbSides; i++) {
      normals.setValue(i + 1, normal);
    }

    // ////////////////////////////
    // setUVs
    const texCoords = this.getVertexAttribute('texCoords');
    texCoords.getValueRef(0).set(0.5, 0.5);
    for (let i = 0; i < nbSides; i++) {
      const phi = (i / nbSides) * 2.0 * Math.PI;
      texCoords.getValueRef(i + 1).set(Math.sin(phi) * 0.5 + 0.5, Math.cos(phi) * 0.5 + 0.5);
    }

    this.setBoundingBoxDirty();
    this.__resize();
  }

  /**
   * The __resize method.
   * @private
   */
  __resize() {
    const nbSides = this.__sidesParam.getValue();
    const radius = this.__radiusParam.getValue();
    const positions = this.getVertexAttribute('positions');
    for (let i = 0; i < nbSides; i++) {
      const phi = (i / nbSides) * 2.0 * Math.PI;
      positions.getValueRef(i + 1).set(Math.sin(phi) * radius, Math.cos(phi) * radius, 0.0);
    }
    this.setBoundingBoxDirty();
    this.emit('geomDataChanged', {});
  }

  /**
   * The toJSON method encodes this type as a json object for persistence.
   *
   * @return {object} - Returns the json object.
   */
  toJSON() {
    const json = super.toJSON();
    json['radius'] = this.__radius;
    return json
  }
}

Registry.register('Disc', Disc);

/**
 * A class for generating a plane geometry.
 *
 * ```
 * const plane = new Plane(2.0, 1.5, 10, 10)
 * ```
 *
 * **Parameters**
 * * **SizeX(`NumberParameter`):** Length of the plane along `X` axis.
 * * **SizeY(`NumberParameter`):** Length of the plane along `Y` axis.
 * * **DetailX(`NumberParameter`):** Number of divisions along `X`axis.
 * * **DetailY(`NumberParameter`):** Number of divisions along `Y`axis.
 *
 * @extends Mesh
 */
class Plane$1 extends Mesh {
  /**
   * Create a plane.
   * @param {number} [SizeX=1.0] - The length of the plane along the X axis.
   * @param {number} [SizeY=1.0] - The length of the plane along the Y axis.
   * @param {number} [DetailX=1] - The number of divisions along the X axis.
   * @param {number} [DetailY=1] - The number of divisions along the Y axis.
   * @param {boolean} [addNormals=true] - The addNormals value.
   * @param {boolean} [addTextureCoords=true] - The addTextureCoords value.
   */
  constructor(SizeX = 1.0, SizeY = 1.0, DetailX = 1, DetailY = 1, addNormals = true, addTextureCoords = true) {
    super();

    if (isNaN(SizeX) || isNaN(SizeY) || isNaN(DetailX) || isNaN(DetailY)) throw new Error('Invalid geom args')

    this.__sizeXParam = this.addParameter(new NumberParameter('SizeX', SizeX));
    this.__sizeYParam = this.addParameter(new NumberParameter('SizeY', SizeY));
    this.__detailXParam = this.addParameter(new NumberParameter('DetailX', DetailX));
    this.__detailYParam = this.addParameter(new NumberParameter('DetailY', DetailY));
    if (addNormals) this.addVertexAttribute('normals', Vec3$1);
    if (addTextureCoords) this.addVertexAttribute('texCoords', Vec2);
    this.__rebuild();

    const resize = () => {
      this.__resize();
    };
    const rebuild = () => {
      this.__rebuild();
    };
    this.__sizeXParam.on('valueChanged', resize);
    this.__sizeYParam.on('valueChanged', resize);
    this.__detailXParam.on('valueChanged', rebuild);
    this.__detailYParam.on('valueChanged', rebuild);
  }

  /**
   * The __rebuild method.
   * @private
   */
  __rebuild() {
    const detailX = this.__detailXParam.getValue();
    const detailY = this.__detailYParam.getValue();
    this.setNumVertices((detailX + 1) * (detailY + 1));
    this.setFaceCounts([0, detailX * detailY]);

    let quadId = 0;
    for (let i = 0; i < detailY; i++) {
      for (let j = 0; j < detailX; j++) {
        const v0 = (detailX + 1) * (i + 1) + j;
        const v1 = (detailX + 1) * (i + 1) + (j + 1);
        const v2 = (detailX + 1) * i + (j + 1);
        const v3 = (detailX + 1) * i + j;
        this.setFaceVertexIndices(quadId, [v0, v1, v2, v3]);
        quadId = quadId + 1;
      }
    }

    let voff = 0;
    const normals = this.getVertexAttribute('normals');
    if (normals) {
      for (let i = 0; i <= detailY; i++) {
        for (let j = 0; j <= detailX; j++) {
          normals.getValueRef(voff).set(0, 0, 1);
          voff++;
        }
      }
    }

    voff = 0;
    const texCoords = this.getVertexAttribute('texCoords');
    if (texCoords) {
      for (let i = 0; i <= detailY; i++) {
        const y = i / detailY;
        for (let j = 0; j <= detailX; j++) {
          const x = j / detailX;
          texCoords.getValueRef(voff).set(x, y);
          voff++;
        }
      }
    }

    this.__resize(false);
    this.emit('geomDataTopologyChanged', {});
  }

  /**
   * The __resize method.
   *
   * @private
   * @param {boolean} [emit=true] - If `true` emits `geomDataChanged` event.
   */
  __resize(emit = true) {
    const sizeX = this.__sizeXParam.getValue();
    const sizeY = this.__sizeYParam.getValue();
    const detailX = this.__detailXParam.getValue();
    const detailY = this.__detailYParam.getValue();
    const positions = this.getVertexAttribute('positions');
    let voff = 0;
    for (let i = 0; i <= detailY; i++) {
      const y = (i / detailY - 0.5) * sizeY;
      for (let j = 0; j <= detailX; j++) {
        const x = (j / detailX - 0.5) * sizeX;
        positions.getValueRef(voff).set(x, y, 0.0);
        voff++;
      }
    }

    this.setBoundingBoxDirty();
    if (emit) this.emit('geomDataChanged', {});
  }
}

/**
 * A class for generating a sphere geometry.
 *
 * ```
 * const sphere = new Sphere(1.4, 13)
 * ```
 *
 * **Parameters**
 * * **radius(`NumberParameter`):** Radius of the sphere.
 * * **sides(`NumberParameter`):** Specifies the number of subdivisions around the `Z` axis.
 * * **loops(`NumberParameter`):** Specifies the number of subdivisions(stacks) along the `Z` axis.
 *
 * @extends Mesh
 */
class Sphere$1 extends Mesh {
  /**
   * Creates an instance of Sphere.
   * @param {number} [radius=1.0] - The radius of the sphere.
   * @param {number} [sides=12] - The number of sides.
   * @param {number} [loops=12] - The number of loops.
   */
  constructor(radius = 1.0, sides = 12, loops = 12) {
    super();

    if (isNaN(radius) || isNaN(sides) || isNaN(loops)) throw new Error('Invalid geom args')

    this.__radiusParam = this.addParameter(new NumberParameter('radius', radius));
    this.__sidesParam = this.addParameter(new NumberParameter('sides', sides >= 3 ? sides : 3, [3, 200], 1));
    this.__loopsParam = this.addParameter(new NumberParameter('loops', loops >= 3 ? loops : 3, [3, 200], 1));

    this.addVertexAttribute('texCoords', Vec2);
    this.addVertexAttribute('normals', Vec3$1);
    this.__rebuild();

    const resize = () => {
      this.__resize();
    };
    const rebuild = () => {
      this.__rebuild();
    };
    this.__radiusParam.on('valueChanged', resize);
    this.__sidesParam.on('valueChanged', rebuild);
    this.__loopsParam.on('valueChanged', rebuild);
  }

  /**
   * The __rebuild method.
   * @private
   */
  __rebuild() {
    const radius = this.__radiusParam.getValue();
    const nbSides = this.__sidesParam.getValue();
    const nbLoops = this.__loopsParam.getValue();

    const numVertices = 2 + nbSides * nbLoops;
    const numTris = nbSides * 2;
    const numQuads = nbSides * nbLoops;
    this.setNumVertices(numVertices);
    this.setFaceCounts([numTris, numQuads]);

    // ////////////////////////////
    // Set Vertex Positions

    const positions = this.getVertexAttribute('positions');
    const normals = this.getVertexAttribute('normals');
    const normal = new Vec3$1(0.0, 0.0, 1.0);
    let vertex = 0;
    positions.getValueRef(vertex).set(0.0, 0.0, radius);
    normals.getValueRef(vertex).set(0.0, 0.0, 1.0);
    vertex++;

    for (let i = 0; i < nbLoops; i++) {
      const theta = ((i + 1) / (nbLoops + 1)) * Math.PI;
      for (let j = 0; j < nbSides; j++) {
        const phi = (j / nbSides) * 2.0 * Math.PI;
        normal.set(Math.sin(theta) * Math.cos(phi), Math.sin(theta) * Math.sin(phi), Math.cos(theta));

        // Set positions and normals at the same time.
        positions.getValueRef(vertex).setFromOther(normal.scale(radius));
        normals.getValueRef(vertex).setFromOther(normal);
        vertex++;
      }
    }
    positions.getValueRef(vertex).set(0.0, 0.0, -radius);
    normals.getValueRef(vertex).set(0.0, 0.0, -1.0);
    vertex++;

    // ////////////////////////////
    // Build the topology
    const texCoords = this.getVertexAttribute('texCoords');

    // build the fan at the first pole.
    let faceIndex = 0;
    for (let j = 0; j < nbSides; j++) {
      const v0 = 0;
      const v1 = ((j + 1) % nbSides) + 1;
      const v2 = j + 1;
      this.setFaceVertexIndices(faceIndex, [v0, v1, v2]);

      const uv0 = new Vec2(0.5, 0.0);
      const uv1 = new Vec2(1.0 - (j + 1) / nbSides, 0.0);
      const uv2 = new Vec2(1.0 - j / nbSides, 1.0 / (nbLoops + 1));
      texCoords.setFaceVertexValue(faceIndex, 0, uv0);
      texCoords.setFaceVertexValue(faceIndex, 1, uv1);
      texCoords.setFaceVertexValue(faceIndex, 2, uv2);

      faceIndex++;
    }
    // Build the fan at the second pole.
    for (let j = 0; j < nbSides; j++) {
      const v0 = numVertices - 1;
      const v1 = nbSides * (nbLoops - 1) + j + 1;
      const v2 = nbSides * (nbLoops - 1) + ((j + 1) % nbSides) + 1;
      this.setFaceVertexIndices(faceIndex, [v0, v1, v2]);

      const uv0 = new Vec2(1.0 - j / nbSides, nbLoops / (nbLoops + 1));
      const uv1 = new Vec2(1.0 - (j + 1) / nbSides, nbLoops / (nbLoops + 1));
      const uv2 = new Vec2(0.5, 1.0);
      texCoords.setFaceVertexValue(faceIndex, 0, uv0);
      texCoords.setFaceVertexValue(faceIndex, 1, uv1);
      texCoords.setFaceVertexValue(faceIndex, 2, uv2);

      faceIndex++;
    }

    for (let i = 0; i < nbLoops - 1; i++) {
      for (let j = 0; j < nbSides; j++) {
        const v0 = nbSides * i + j + 1;
        const v1 = nbSides * i + ((j + 1) % nbSides) + 1;
        const v2 = nbSides * (i + 1) + ((j + 1) % nbSides) + 1;
        const v3 = nbSides * (i + 1) + j + 1;
        this.setFaceVertexIndices(faceIndex, [v0, v1, v2, v3]);

        texCoords.setFaceVertexValue(faceIndex, 0, new Vec2(i / nbLoops, j / nbLoops));
        texCoords.setFaceVertexValue(faceIndex, 1, new Vec2(i / nbLoops, (j + 1) / nbLoops));
        texCoords.setFaceVertexValue(faceIndex, 2, new Vec2((i + 1) / nbLoops, (j + 1) / nbLoops));
        texCoords.setFaceVertexValue(faceIndex, 3, new Vec2((i + 1) / nbLoops, j / nbLoops));
        faceIndex++;
      }
    }

    this.setBoundingBoxDirty();
    this.emit('geomDataTopologyChanged', {});
  }

  /**
   * The __resize method.
   * @private
   */
  __resize() {
    const radius = this.__radiusParam.getValue();
    const nbSides = this.__sidesParam.getValue();
    const nbLoops = this.__loopsParam.getValue();

    // ////////////////////////////
    // Set Vertex Positions
    const positions = this.getVertexAttribute('positions');
    let vertex = 0;
    const normal = new Vec3$1(0.0, 0.0, 1.0);
    positions.getValueRef(vertex).set(0.0, 0.0, radius);
    vertex++;

    for (let i = 0; i < nbLoops; i++) {
      const theta = ((i + 1) / (nbLoops + 1)) * Math.PI;
      for (let j = 0; j < nbSides; j++) {
        const phi = (j / nbSides) * 2.0 * Math.PI;
        normal.set(Math.sin(theta) * Math.cos(phi), Math.sin(theta) * Math.sin(phi), Math.cos(theta));

        // Set positions and normals at the same time.
        positions.getValueRef(vertex).setFromOther(normal.scale(radius));
        vertex++;
      }
    }
    positions.getValueRef(vertex).set(0.0, 0.0, -radius);
    vertex++;

    this.setBoundingBoxDirty();
    this.emit('geomDataChanged', {});
  }
}

Registry.register('Sphere', Sphere$1);

/**
 * A class for generating a torus geometry.
 *
 * ```
 * const torus = new Torus(0.4, 1.3)
 * ```
 *
 * @extends Mesh
 */
class Torus extends Mesh {
  /**
   * Creates an instance of Torus.
   *
   * @param {number} [innerRadius=0.5] - The inner radius of the torus.
   * @param {number} [outerRadius=1.0] - The outer radius of the torus.
   * @param {number} [detail=32] - The detail of the cone.
   */
  constructor(innerRadius = 0.5, outerRadius = 1.0, detail = 32) {
    super();

    if (isNaN(innerRadius) || isNaN(outerRadius) || isNaN(detail)) throw new Error('Invalid geom args')

    this.__innerRadius = innerRadius;
    this.__outerRadius = outerRadius;
    this.__detail = detail >= 3 ? detail : 3;

    this.addVertexAttribute('texCoords', Vec2);
    this.addVertexAttribute('normals', Vec3$1);
    this.__rebuild();
  }

  /**
   * Getter for the inner radius.
   *
   * @return {number} - Returns the radius.
   */
  get innerRadius() {
    return this.__innerRadius
  }

  /**
   * Setter for the inner radius.
   *
   * @param {number} val - The radius value.
   */
  set innerRadius(val) {
    this.__innerRadius = val;
    this.__resize();
  }

  /**
   * Getter for the outer radius.
   *
   * @return {number} - Returns the radius.
   */
  get outerRadius() {
    return this.__outerRadius
  }

  /**
   * Setter for the outer radius.
   *
   * @param {number} val - The radius value.
   */
  set outerRadius(val) {
    this.__outerRadius = val;
    this.__resize();
  }

  /**
   * Getter for the torus detail.
   *
   * @return {number} - Returns the detail.
   */
  get detail() {
    return this.__detail
  }

  /**
   * Setter for the torus detail.
   *
   * @param {number} val - The detail value.
   */
  set detail(val) {
    this.__detail = val >= 3 ? val : 3;
    this.__rebuild();
  }

  /**
   * The __rebuild method.
   * @private
   */
  __rebuild() {
    const nbSlices = this.__detail;
    const nbLoops = this.__detail * 2;
    const numVertices = nbSlices * nbLoops;

    this.setNumVertices(numVertices);
    this.setFaceCounts([0, nbSlices * nbLoops]);

    // ////////////////////////////
    // Set Vertex Positions

    const positions = this.getVertexAttribute('positions');
    const normals = this.getVertexAttribute('normals');
    let vertex = 0;
    for (let i = 0; i < nbLoops; i++) {
      const theta = (i / nbLoops) * 2.0 * Math.PI;
      const ctheta = Math.cos(theta);
      const stheta = Math.sin(theta);

      for (let j = 0; j < nbSlices; j++) {
        const phi = (j / nbSlices) * 2.0 * Math.PI;

        const sphi = Math.sin(phi);
        const cphi = Math.cos(phi);
        const d = this.__outerRadius + cphi * this.__innerRadius;

        // Set positions and normals at the same time.
        positions.getValueRef(vertex).set(ctheta * d, stheta * d, this.__innerRadius * sphi);
        normals.getValueRef(vertex).set(ctheta * cphi, stheta * cphi, sphi);
        vertex++;
      }
    }

    // ////////////////////////////
    // Build the topology and texCoords
    const texCoords = this.getVertexAttribute('texCoords');
    let faceIndex = 0;
    for (let i = 0; i < nbLoops; i++) {
      for (let j = 0; j < nbSlices; j++) {
        const ip = (i + 1) % nbLoops;
        const jp = (j + 1) % nbSlices;
        const v0 = nbSlices * i + j;
        const v1 = nbSlices * i + jp;
        const v2 = nbSlices * ip + jp;
        const v3 = nbSlices * ip + j;
        this.setFaceVertexIndices(faceIndex, [v0, v1, v2, v3]);

        texCoords.setFaceVertexValue(faceIndex, 0, new Vec2(i / nbLoops, j / nbLoops));
        texCoords.setFaceVertexValue(faceIndex, 1, new Vec2(i / nbLoops, (j + 1) / nbLoops));
        texCoords.setFaceVertexValue(faceIndex, 2, new Vec2((i + 1) / nbLoops, (j + 1) / nbLoops));
        texCoords.setFaceVertexValue(faceIndex, 3, new Vec2((i + 1) / nbLoops, j / nbLoops));
        faceIndex++;
      }
    }

    this.setBoundingBoxDirty();
    this.emit('geomDataTopologyChanged', {});
  }

  /**
   * The __resize method.
   * @private
   */
  __resize() {
    const nbSlices = this.__detail;
    const nbLoops = this.__detail * 2;

    const positions = this.getVertexAttribute('positions');
    const vertex = 0;
    for (let i = 0; i < nbLoops; i++) {
      const theta = (i / nbLoops) * 2.0 * Math.PI;
      const ctheta = Math.cos(theta);
      const stheta = Math.sin(theta);

      for (let j = 0; j < nbSlices; j++) {
        const phi = (j / nbSlices) * 2.0 * Math.PI;

        const sphi = Math.sin(phi);
        const cphi = Math.cos(phi);
        const d = this.__outerRadius + cphi * this.__innerRadius;

        // Set positions and normals at the same time.
        positions.getValueRef(vertex).set(ctheta * d, stheta * d, this.__innerRadius * sphi);
        index++;
      }
    }

    this.setBoundingBoxDirty();
    this.emit('geomDataChanged', {});
  }

  /**
   * The toJSON method encodes this type as a json object for persistence.
   * @return {object} - Returns the json object.
   */
  toJSON() {
    const json = super.toJSON();
    json['x'] = this.__x;
    json['y'] = this.__y;
    json['z'] = this.__z;
    return json
  }
}

// let ResourceLoaderWorker = require("worker-loader?inline!./ResourceLoaderWorker.js");

/**
 * Represents a BaseImage with the ability to load data.
 *
 * **Events**
 * * **loaded:** Triggered when the data is loaded.
 * * **updated:** Triggered when the data is updated.
 * @extends BaseImage
 */
class DataImage extends BaseImage {
  /**
   * Create a data image.
   * @param {string} name - The name value.
   */
  constructor(name) {
    super();

    if (name == undefined) name = this.constructor.name;
    this.__name = name;
    this.format = 'RGBA';
    this.type = 'UNSIGNED_BYTE';
    this.__loaded = false;

    // this.__data = new Uint8Array(4);
    this.width = 1;
    this.height = 1;
  }

  /**
   * Returns an indicator of current item's loaded state.
   * @return {boolean} - `true` if bytes data is fully loaded, `false` otherwise.
   */
  isLoaded() {
    return this.__loaded
  }

  /**
   * Returns the item's name.
   *
   * @return {string} - The return value.
   */
  getName() {
    return this.__name
  }

  /**
   * Images are static content, so the value for this method is always going to be `false`
   *
   * @return {boolean} - The return value.
   */
  isStream() {
    return false
  }

  /**
   * Sets Image's data by recieving an bytes array.
   *
   * @param {number} width - The width value.
   * @param {number} height - The height value.
   * @param {Uint8Array} data - The data value.
   */
  setData(width, height, data) {
    this.width = width;
    this.height = height;
    this.__data = data;
    if (!this.__loaded) {
      this.__loaded = true;
      this.emit('loaded', {});
    } else this.emit('updated', {});
  }

  /**
   * Returns all parameters and class state values(Including data).
   *
   * @return {object} - The return value.
   */
  getParams() {
    const params = super.getParams();
    params['data'] = this.__data;
    return params
  }
}

Registry.register('DataImage2D', DataImage);
Registry.register('DataImage', DataImage);

var count;
// Stream object for reading off bytes from a byte array

function ByteStream(data){
	this.data = data;
	this.pos = 0;
}

// read the next byte off the stream
ByteStream.prototype.readByte = function(){
	return this.data[this.pos++];
};

// look at the next byte in the stream without updating the stream position
ByteStream.prototype.peekByte = function(){
	return this.data[this.pos];
};

// read an array of bytes
ByteStream.prototype.readBytes = function(n){
	var bytes = new Array(n);
	for(var i=0; i<n; i++){
		bytes[i] = this.readByte();
	}
	return bytes;
};

// peek at an array of bytes without updating the stream position
ByteStream.prototype.peekBytes = function(n){
	var bytes = new Array(n);
	for(var i=0; i<n; i++){
		bytes[i] = this.data[this.pos + i];
	}
	return bytes;
};

// read a string from a byte set
ByteStream.prototype.readString = function(len){
	var str = '';
	for(var i=0; i<len; i++){
		str += String.fromCharCode(this.readByte());
	}
	return str;
};

// read a single byte and return an array of bit booleans
ByteStream.prototype.readBitArray = function(){
	var arr = [];
	var bite = this.readByte();
	for (var i = 7; i >= 0; i--) {
		arr.push(!!(bite & (1 << i)));
	}
	return arr;
};

// read an unsigned int with endian option
ByteStream.prototype.readUnsigned = function(littleEndian){
	var a = this.readBytes(2);
	if(littleEndian){
		return (a[1] << 8) + a[0];	
	}else {
		return (a[0] << 8) + a[1];
	}	
};


function DataParser(data){
	this.stream = new ByteStream(data);
	// the final parsed object from the data
	this.output = {};
}

DataParser.prototype.parse = function(schema){
	// the top level schema is just the top level parts array
	this.parseParts(this.output, schema);	
	return this.output;
};

// parse a set of hierarchy parts providing the parent object, and the subschema
DataParser.prototype.parseParts = function(obj, schema){
	for(var i=0; i<schema.length; i++){
		var part = schema[i];
		this.parsePart(obj, part); 
	}
};

DataParser.prototype.parsePart = function(obj, part){
	var name = part.label;
	var value;

	// make sure the part meets any parse requirements
	if(part.requires && ! part.requires(this.stream, this.output, obj)){
		return;
	}
	
	if(part.loop){
		// create a parse loop over the parts
		var items = [];
		while(part.loop(this.stream)){
			var item = {};
			this.parseParts(item, part.parts);
			items.push(item);
		}
		obj[name] = items;
	}else if(part.parts){
		// process any child parts
		value = {};
		this.parseParts(value, part.parts);
		obj[name] = value;
	}else if(part.parser){
		// parse the value using a parser
		value = part.parser(this.stream, this.output, obj);
		if(!part.skip){
			obj[name] = value;
		}
	}else if(part.bits){
		// convert the next byte to a set of bit fields
		obj[name] = this.parseBits(part.bits);
	}
};

// combine bits to calculate value
function bitsToNum(bitArray){
	return bitArray.reduce(function(s, n) { return s * 2 + n; }, 0);
}

// parse a byte as a bit set (flags and values)
DataParser.prototype.parseBits = function(details){
	var out = {};
	var bits = this.stream.readBitArray();
	for(var key in details){
		var item = details[key];
		if(item.length){
			// convert the bit set to value
			out[key] = bitsToNum(bits.slice(item.index, item.index + item.length));
		}else {
			out[key] = bits[item.index];
		}
	}
	return out;
};


// a set of common parsers used with DataParser

var Parsers = {
	// read a byte
	readByte: function(){
		return function(stream){
			return stream.readByte();
		};
	},
	// read an array of bytes
	readBytes: function(length){
		return function(stream){
			return stream.readBytes(length);
		};
	},
	// read a string from bytes
	readString: function(length){
		return function(stream){
			return stream.readString(length);
		};
	},
	// read an unsigned int (with endian)
	readUnsigned: function(littleEndian){
		return function(stream){
			return stream.readUnsigned(littleEndian);
		};
	},
	// read an array of byte sets
	readArray: function(size, countFunc){
		return function(stream, obj, parent){
			var count = countFunc(stream, obj, parent);
			var arr = new Array(count);
			for(var i=0; i<count; i++){
				arr[i] = stream.readBytes(size);
			}
			return arr;
		};
	}
};


// object used to represent array buffer data for a gif file



// a set of 0x00 terminated subblocks
var subBlocks = {
	label: 'blocks',
	parser: function(stream){
		var out = [];
		var terminator = 0x00;		
		for(var size=stream.readByte(); size!==terminator; size=stream.readByte()){
			out = out.concat(stream.readBytes(size));
		}
		return out;
	}
};

// global control extension
var gce = {
	label: 'gce',
	requires: function(stream){
		// just peek at the top two bytes, and if true do this
		var codes = stream.peekBytes(2);
		return codes[0] === 0x21 && codes[1] === 0xF9;
	},
	parts: [
		{ label: 'codes', parser: Parsers.readBytes(2), skip: true },
		{ label: 'byteSize', parser: Parsers.readByte() },
		{ label: 'extras', bits: {
			future: { index: 0, length: 3 },
			disposal: { index: 3, length: 3 },
			userInput: { index: 6 },
			transparentColorGiven: { index: 7 }
		}},
		{ label: 'delay', parser: Parsers.readUnsigned(true) },
		{ label: 'transparentColorIndex', parser: Parsers.readByte() },
		{ label: 'terminator', parser: Parsers.readByte(), skip: true }
	]
};

// image pipeline block
var image = {
	label: 'image',
	requires: function(stream){
		// peek at the next byte
		var code = stream.peekByte();
		return code === 0x2C;
	},
	parts: [
		{ label: 'code', parser: Parsers.readByte(), skip: true },
		{
			label: 'descriptor', // image descriptor
			parts: [
				{ label: 'left', parser: Parsers.readUnsigned(true) },
				{ label: 'top', parser: Parsers.readUnsigned(true) },
				{ label: 'width', parser: Parsers.readUnsigned(true) },
				{ label: 'height', parser: Parsers.readUnsigned(true) },
				{ label: 'lct', bits: {
					exists: { index: 0 },
					interlaced: { index: 1 },
					sort: { index: 2 },
					future: { index: 3, length: 2 },
					size: { index: 5, length: 3 }
				}}
			]
		},{
			label: 'lct', // optional local color table
			requires: function(stream, obj, parent){
				return parent.descriptor.lct.exists;
			},
			parser: Parsers.readArray(3, function(stream, obj, parent){
				return Math.pow(2, parent.descriptor.lct.size + 1);
			})
		},{
			label: 'data', // the image data blocks
			parts: [
				{ label: 'minCodeSize', parser: Parsers.readByte() },
				subBlocks
			]
		}
	]
};

// plain text block
var text = {
	label: 'text',
	requires: function(stream){
		// just peek at the top two bytes, and if true do this
		var codes = stream.peekBytes(2);
		return codes[0] === 0x21 && codes[1] === 0x01;
	},
	parts: [
		{ label: 'codes', parser: Parsers.readBytes(2), skip: true },
		{ label: 'blockSize', parser: Parsers.readByte() },
		{ 
			label: 'preData', 
			parser: function(stream, obj, parent){
				return stream.readBytes(parent.text.blockSize);
			}
		},
		subBlocks
	]
};

// application block
var application = {
	label: 'application',
	requires: function(stream, obj, parent){
		// make sure this frame doesn't already have a gce, text, comment, or image
		// as that means this block should be attached to the next frame
		//if(parent.gce || parent.text || parent.image || parent.comment){ return false; }

		// peek at the top two bytes
		var codes = stream.peekBytes(2);
		return codes[0] === 0x21 && codes[1] === 0xFF;
	},
	parts: [
		{ label: 'codes', parser: Parsers.readBytes(2), skip: true },
		{ label: 'blockSize', parser: Parsers.readByte() },
		{ 
			label: 'id', 
			parser: function(stream, obj, parent){
				return stream.readString(parent.blockSize);
			}
		},
		subBlocks
	]
};

// comment block
var comment = {
	label: 'comment',
	requires: function(stream, obj, parent){
		// make sure this frame doesn't already have a gce, text, comment, or image
		// as that means this block should be attached to the next frame
		//if(parent.gce || parent.text || parent.image || parent.comment){ return false; }

		// peek at the top two bytes
		var codes = stream.peekBytes(2);
		return codes[0] === 0x21 && codes[1] === 0xFE;
	},
	parts: [
		{ label: 'codes', parser: Parsers.readBytes(2), skip: true },
		subBlocks
	]
};

// frames of ext and image data
var frames = {
	label: 'frames',
	parts: [
		gce,
		application,
		comment,
		image,
		text
	],
	loop: function(stream){
		var nextCode = stream.peekByte();
		// rather than check for a terminator, we should check for the existence
		// of an ext or image block to avoid infinite loops
		//var terminator = 0x3B;
		//return nextCode !== terminator;
		return nextCode === 0x21 || nextCode === 0x2C;
	}
};

// main GIF schema
var schemaGIF = [
	{
		label: 'header', // gif header
		parts: [
			{ label: 'signature', parser: Parsers.readString(3) },
			{ label: 'version', parser: Parsers.readString(3) }
		]
	},{
		label: 'lsd', // local screen descriptor
		parts: [
			{ label: 'width', parser: Parsers.readUnsigned(true) },
			{ label: 'height', parser: Parsers.readUnsigned(true) },
			{ label: 'gct', bits: {
				exists: { index: 0 },
				resolution: { index: 1, length: 3 },
				sort: { index: 4 },
				size: { index: 5, length: 3 }
			}},
			{ label: 'backgroundColorIndex', parser: Parsers.readByte() },
			{ label: 'pixelAspectRatio', parser: Parsers.readByte() }
		]
	},{
		label: 'gct', // global color table
		requires: function(stream, obj){
			return obj.lsd.gct.exists;
		},
		parser: Parsers.readArray(3, function(stream, obj){
			return Math.pow(2, obj.lsd.gct.size + 1);
		})
	},
	frames // content frames
];


var gifSchema = schemaGIF;

function GIF(arrayBuffer){
	// convert to byte array
	var byteData = new Uint8Array(arrayBuffer);
	var parser = new DataParser(byteData);
	// parse the data
	this.raw = parser.parse(gifSchema);

	// set a flag to make sure the gif contains at least one image
	this.raw.hasImages = false;
	for(var f=0; f<this.raw.frames.length; f++){
		if(this.raw.frames[f].image){
			this.raw.hasImages = true;
			break;
		}
	}
}

// process a single gif image frames data, decompressing it using LZW 
// if buildPatch is true, the returned image will be a clamped 8 bit image patch
// for use directly with a canvas.
GIF.prototype.decompressFrame = function(index, buildPatch){

	// make sure a valid frame is requested
	if(index >= this.raw.frames.length){ return null; }

	var frame = this.raw.frames[index];
	if(frame.image){
		// get the number of pixels
		var totalPixels = frame.image.descriptor.width * frame.image.descriptor.height;

		// do lzw decompression
		var pixels = lzw(frame.image.data.minCodeSize, frame.image.data.blocks, totalPixels);

		// deal with interlacing if necessary
		if(frame.image.descriptor.lct.interlaced){
			pixels = deinterlace(pixels, frame.image.descriptor.width);
		}

		// setup usable image object
		var image = {
			pixels: pixels,
			dims: {
				top: frame.image.descriptor.top,
				left: frame.image.descriptor.left,
				width: frame.image.descriptor.width,
				height: frame.image.descriptor.height
			}
		};

		// color table
		if(frame.image.descriptor.lct && frame.image.descriptor.lct.exists){
			image.colorTable = frame.image.lct;
		}else {
			image.colorTable = this.raw.gct;
		}

		// add per frame relevant gce information
		if(frame.gce){
			image.delay = (frame.gce.delay || 10) * 10; // convert to ms
			image.disposalType = frame.gce.extras.disposal;
			// transparency
			if(frame.gce.extras.transparentColorGiven){
				image.transparentIndex = frame.gce.transparentColorIndex;
			}
		}

		// create canvas usable imagedata if desired
		if(buildPatch){
			image.patch = generatePatch(image);
		}

		return image;		
	}

	// frame does not contains image
	return null;


	/**
	 * javascript port of java LZW decompression
	 * Original java author url: https://gist.github.com/devunwired/4479231
	 */	
	function lzw(minCodeSize, data, pixelCount) {
 		
 		var MAX_STACK_SIZE = 4096;
		var nullCode = -1;

		var npix = pixelCount;
		var available, clear, code_mask, code_size, end_of_information, in_code, old_code, bits, code, i, datum, data_size, first, top, bi, pi;
 
 		var dstPixels = new Array(pixelCount);
		var prefix = new Array(MAX_STACK_SIZE);
		var suffix = new Array(MAX_STACK_SIZE);
		var pixelStack = new Array(MAX_STACK_SIZE + 1);
 
		// Initialize GIF data stream decoder.
		data_size = minCodeSize;
		clear = 1 << data_size;
		end_of_information = clear + 1;
		available = clear + 2;
		old_code = nullCode;
		code_size = data_size + 1;
		code_mask = (1 << code_size) - 1;
		for (code = 0; code < clear; code++) {
			prefix[code] = 0;
			suffix[code] = code;
		}
 
		// Decode GIF pixel stream.
		datum = bits = count = first = top = pi = bi = 0;
		for (i = 0; i < npix; ) {
			if (top === 0) {
				if (bits < code_size) {
					
					// get the next byte			
					datum += data[bi] << bits;

					bits += 8;
					bi++;
					continue;
				}
				// Get the next code.
				code = datum & code_mask;
				datum >>= code_size;
				bits -= code_size;
				// Interpret the code
				if ((code > available) || (code == end_of_information)) {
					break;
				}
				if (code == clear) {
					// Reset decoder.
					code_size = data_size + 1;
					code_mask = (1 << code_size) - 1;
					available = clear + 2;
					old_code = nullCode;
					continue;
				}
				if (old_code == nullCode) {
					pixelStack[top++] = suffix[code];
					old_code = code;
					first = code;
					continue;
				}
				in_code = code;
				if (code == available) {
					pixelStack[top++] = first;
					code = old_code;
				}
				while (code > clear) {
					pixelStack[top++] = suffix[code];
					code = prefix[code];
				}
				
				first = suffix[code] & 0xff;
				pixelStack[top++] = first;

				// add a new string to the table, but only if space is available
				// if not, just continue with current table until a clear code is found
				// (deferred clear code implementation as per GIF spec)
				if(available < MAX_STACK_SIZE){
					prefix[available] = old_code;
					suffix[available] = first;
					available++;
					if (((available & code_mask) === 0) && (available < MAX_STACK_SIZE)) {
						code_size++;
						code_mask += available;
					}
				}
				old_code = in_code;
			}
			// Pop a pixel off the pixel stack.
			top--;
			dstPixels[pi++] = pixelStack[top];
			i++;
		}

		for (i = pi; i < npix; i++) {
			dstPixels[i] = 0; // clear missing pixels
		}

		return dstPixels;
	}

	// deinterlace function from https://github.com/shachaf/jsgif
	function deinterlace(pixels, width) {
		
		var newPixels = new Array(pixels.length);
		var rows = pixels.length / width;
		var cpRow = function(toRow, fromRow) {
			var fromPixels = pixels.slice(fromRow * width, (fromRow + 1) * width);
			newPixels.splice.apply(newPixels, [toRow * width, width].concat(fromPixels));
		};

		// See appendix E.
		var offsets = [0,4,2,1];
		var steps   = [8,8,4,2];

		var fromRow = 0;
		for (var pass = 0; pass < 4; pass++) {
			for (var toRow = offsets[pass]; toRow < rows; toRow += steps[pass]) {
				cpRow(toRow, fromRow);
				fromRow++;
			}
		}

		return newPixels;
	}

	// create a clamped byte array patch for the frame image to be used directly with a canvas
	// TODO: could potentially squeeze some performance by doing a direct 32bit write per iteration
	function generatePatch(image){

		var totalPixels = image.pixels.length;
		var patchData = new Uint8ClampedArray(totalPixels * 4);
		for(var i=0; i<totalPixels; i++){
			var pos = i * 4;
			var colorIndex = image.pixels[i];
			var color = image.colorTable[colorIndex];
			patchData[pos] = color[0];
			patchData[pos + 1] = color[1];
			patchData[pos + 2] = color[2];
			patchData[pos + 3] = colorIndex !== image.transparentIndex ? 255 : 0;
		}

		return patchData;
	}
};

// returns all frames decompressed
GIF.prototype.decompressFrames = function(buildPatch){
	var frames = [];
	for(var i=0; i<this.raw.frames.length; i++){
		var frame = this.raw.frames[i];
		if(frame.image){
			frames.push(this.decompressFrame(i, buildPatch));
		}
	}
	return frames;
};

const imageDataLibrary = {};

const imageLoaders = {};

const supportWebp = globalThis.navigator && navigator.userAgent.indexOf('Chrome') !== -1;

/** Class representing a file image.
 * @extends BaseImage
 */
class FileImage$1 extends BaseImage {
  /**
   * Create a file image.
   * @param {string} name - The name value.
   * @param {string} filePath - The filePath value.
   * @param {object} params - The params value.
   */
  constructor(name, filePath = '', params = {}) {
    if (filePath.constructor == Object) {
      params = filePath;
    }
    if (name != undefined && name.lastIndexOf('.') != -1) {
      console.warn('Deprecated signature. Please provide a name and filepath to the image constructor');
      name = name.substring(name.lastIndexOf('/') + 1, name.lastIndexOf('.'));
    }

    super(name, params);

    this.__loaded = false;

    const fileParam = this.addParameter(new FilePathParameter('FilePath'));
    fileParam.on('valueChanged', () => {
      this.loaded = false;
      if (this.getName() == '') {
        // Generate a name from the file path.
        const stem = fileParam.getStem();
        const decorator = stem.substring(stem.length - 1);
        if (!isNaN(decorator)) {
          // Note: ALL image names have an LOD specifier at the end.
          // remove that off when retrieving the name.
          this.setName(stem.substring(0, stem.length - 1));
        } else {
          this.setName(stem);
        }
      }

      if (fileParam.getValue()) {
        this.__loadData();
      }
    });

    if (filePath && filePath != '') fileParam.setFilepath(filePath);
  }

  /**
   * The __imageDataLibrary method.
   * @return {any} - The return value.
   * @private
   */
  static __imageDataLibrary() {
    return imageDataLibrary
  }

  /**
   * The registerLoader method.
   * @param {any} exts - The exts param.
   * @param {any} loaderClass - The loaderClass param.
   */
  static registerLoader(exts, loaderClass) {
    imageLoaders[exts] = loaderClass;
  }

  /**
   * The constructLoader method.
   * @param {any} file - The file value.
   * @param {any} loaderName - The loaderName value.
   * @return {any} - The return value.
   */
  static constructLoader(file, loaderName) {
    for (const exts of imageLoaders) {
      if (new RegExp('\\.(' + exts + ')$', 'i').test(file.name)) {
        const loader = new imageLoaders[exts](loaderName);
        if (loader) {
          loader.getParameter('FilePath').setValue(file.id);
          return loader
        }
      }
    }
  }

  /**
   * The __loadData method.
   * @private
   */
  __loadData() {
    const ext = this.getParameter('FilePath').get();
    if (ext == '.jpg' || ext == '.png' || ext == '.webp') {
      this.__loadLDRImage(ext);
    } else if (ext == '.mp4' || ext == '.ogg') {
      this.__loadLDRVideo();
      // } else if (ext == '.ldralpha') {
      //     this.__loadLDRAlpha(file, ext);
    } else if (ext == '.vlh') {
      this.__loadVLH();
    } else if (ext == '.gif') {
      this.__loadGIF();
    } else if (ext == '.svg') {
      console.warn('SVG Image not yet supported');
    } else {
      throw new Error('Unsupported file type. Check the ext:' + file)
    }
  }

  /**
   * The __loadLDRImage method.
   * @param {string} ext - The file extension.
   * @private
   */
  __loadLDRImage(ext) {
    const file = this.getParameter('FilePath').getFile();
    if (ext == '.jpg') {
      this.format = 'RGB';
    } else if (ext == '.png') {
      this.format = 'RGBA';
    }
    this.type = 'UNSIGNED_BYTE';
    let imageElem;
    const loaded = () => {
      this.getDOMElement = () => {
        return imageElem
      };
      this.width = imageElem.width;
      this.height = imageElem.height;
      this.__data = imageElem;
      this.__loaded = true;
      this.emit('loaded', {});
    };
    if (file.id in imageDataLibrary) {
      imageElem = imageDataLibrary[file.id];
      if (imageElem.complete) {
        loaded();
      } else {
        imageElem.addEventListener('load', loaded);
      }
    } else {
      resourceLoader.addWork(file.id, 1);

      const prefSizeParam = this.addParameter(new NumberParameter('PreferredSize', -1));

      let url = file.url;
      if (file.assets && Object.keys(file.assets).length > 0) {
        function chooseImage(params, filterAssets) {
          // Note: this is a filter to remove any corrupt data
          // generate by our broken server side processing system.
          filterAssets = filterAssets.filter((asset) => asset !== null);

          if (supportWebp) {
            const resultFilter = filterAssets.filter((asset) => asset.format === 'webp');

            if (resultFilter.length > 1) {
              filterAssets = resultFilter;
            }
          } else {
            filterAssets = filterAssets.filter((asset) => asset.format !== 'webp');
          }

          if (params.maxSize) {
            filterAssets = filterAssets.filter((asset) => asset.w <= params.maxSize);
          }
          if (params.filter) {
            const resultFilter = filterAssets.filter((asset) => asset.url.indexOf(params.filter) !== -1);
            if (resultFilter.length > 1) {
              filterAssets = resultFilter;
            }
          }
          if (params.prefSize) {
            filterAssets = filterAssets.map((asset) =>
              Object.assign(
                {
                  score: Math.abs(params.prefSize - asset.w),
                },
                asset
              )
            );

            // return low score, close to desire
            // return _.sortBy(score, "score")[0].option.url;
            filterAssets.sort((a, b) => (a.score > b.score ? 1 : a.score < b.score ? -1 : 0));
          }
          if (filterAssets.length > 0) return filterAssets[0]
        }
        const params = {
          maxSize: SystemDesc.gpuDesc.maxTextureSize,
        };
        const prefSize = prefSizeParam.getValue();
        if (prefSize == -1) {
          if (file.assets.reduce) params.prefSize = file.assets.reduce.w;
        } else {
          params.prefSize = prefSize;
        }
        const asset = chooseImage(params, Object.values(file.assets));
        if (asset) {
          console.log(
            'Selected image:' +
              file.name +
              ' format:' +
              asset.format +
              ' :' +
              asset.w +
              'x' +
              asset.h +
              ' url:' +
              asset.url
          );
          url = asset.url;
        }
      } else {
        console.warn('Images not processed for this file:' + file.name);
      }

      imageElem = new Image();
      imageElem.crossOrigin = 'anonymous';
      imageElem.src = url;

      imageElem.addEventListener('load', loaded);
      imageElem.addEventListener('load', () => {
        resourceLoader.addWorkDone(file.id, 1);
      });
      imageDataLibrary[file.id] = imageElem;
    }
  }

  /**
   * The __removeVideoParams method.
   * @private
   */
  __removeVideoParams() {
    if (this.getParameterIndex('spatializeAudio')) {
      this.removeParameter(this.getParameterIndex('Loop'));
      this.removeParameter(this.getParameterIndex('spatializeAudio'));
      this.removeParameter(this.getParameterIndex('Gain'));
      this.removeParameter(this.getParameterIndex('refDistance'));
      this.removeParameter(this.getParameterIndex('maxDistance'));
      this.removeParameter(this.getParameterIndex('rolloffFactor'));
      this.removeParameter(this.getParameterIndex('coneInnerAngle'));
      this.removeParameter(this.getParameterIndex('coneOuterAngle'));
      this.removeParameter(this.getParameterIndex('coneOuterGain'));
    }
  }

  /**
   * The __loadLDRVideo method.
   * @param {string} ext - The file extension.
   * @private
   */
  __loadLDRVideo() {
    const file = this.getParameter('FilePath').getFile();
    this.format = 'RGB';
    this.type = 'UNSIGNED_BYTE';
    resourceLoader.addWork(file.id, 1);

    // Note: mute needs to be turned off by an action from the user.
    // Audio is disabled by default now in chrome.
    const muteParam = this.addParameter(new BooleanParameter('Mute', true));
    const loopParam = this.addParameter(new BooleanParameter('Loop', true));

    const videoElem = document.createElement('video');
    // TODO - confirm its necessary to add to DOM
    videoElem.style.display = 'none';
    videoElem.preload = 'auto';
    videoElem.crossOrigin = 'anonymous';
    // videoElem.crossorigin = true;

    this.getAudioSource = () => {
      return videoElem
    };

    document.body.appendChild(videoElem);
    videoElem.on(
      'loadedmetadata',
      () => {
        // videoElem.play();

        videoElem.muted = muteParam.getValue();
        muteParam.on('valueChanged', () => {
          videoElem.muted = muteParam.getValue();
        });
        videoElem.loop = loopParam.getValue();
        loopParam.on('valueChanged', () => {
          videoElem.loop = loopParam.getValue();
        });

        this.width = videoElem.videoHeight;
        this.height = videoElem.videoWidth;
        this.__data = videoElem;
        this.__loaded = true;
        resourceLoader.addWorkDone(file.id, 1);
        this.emit('loaded', {});

        videoElem.play().then(
          () => {
            let prevFrame = 0;
            const frameRate = 29.97;
            const timerCallback = () => {
              if (videoElem.paused || videoElem.ended) {
                return
              }
              // Check to see if the video has progressed to the next frame.
              // If so, then we emit and update, which will cause a redraw.
              const currentFrame = Math.floor(videoElem.currentTime * frameRate);
              if (prevFrame != currentFrame) {
                this.emit('updated', {});
                prevFrame = currentFrame;
              }
              setTimeout(timerCallback, 20); // Sample at 50fps.
            };
            timerCallback();
          },
          (e) => {
            console.log('Autoplay was prevented.', e, e.message);
          }
        );
        // const promise = videoElem.play();
        // if (promise !== undefined) {
        //     promise.then(_ => {
        //         console.log("Autoplay started!")
        //         // Autoplay started!
        //     }).catch(error => {
        //         console.log("Autoplay was prevented.")
        //         // Autoplay was prevented.
        //         // Show a "Play" button so that user can start playback.
        //     });
        // }
      },
      false
    );
    videoElem.src = file.url;
    // videoElem.load();
  }

  /**
   * The __loadVLH method.
   * @param {string} ext - The file extension.
   * @private
   */
  __loadVLH() {
    const file = this.getParameter('FilePath').getFile();
    this.type = 'FLOAT';

    let hdrtint = new Color(1, 1, 1, 1);
    // let stream = 'stream' in params ? params['stream'] : false;

    this.setHDRTint = (value) => {
      hdrtint = value;
    };
    this.getHDRTint = () => {
      return hdrtint
    };

    resourceLoader.loadUrl(file.id, file.url, (entries) => {
      let ldr;
      let cdm;
      for (const name in entries) {
        if (name.endsWith('.jpg')) ldr = entries[name];
        else if (name.endsWith('.bin')) cdm = entries[name];
      }

      // ///////////////////////////////
      // Parse the data.
      const blob = new Blob([ldr.buffer]);
      const ldrPic = new Image();
      ldrPic.onload = () => {
        this.width = ldrPic.width;
        this.height = ldrPic.height;
        // console.log(file.name + ": [" + this.width + ", " + this.height + "]");
        this.__data = {
          ldr: ldrPic,
          cdm: cdm,
        };
        if (!this.__loaded) {
          this.__loaded = true;
          this.emit('loaded', {});
        } else {
          this.emit('updated', {});
        }
      };
      ldrPic.src = URL.createObjectURL(blob);
    });
  }

  /**
   * The __loadGIF method.
   * @param {string} ext - The file extension.
   * @private
   */
  __loadGIF() {
    const file = this.getParameter('FilePath').getFile();
    this.format = 'RGBA';
    this.type = 'UNSIGNED_BYTE';
    this.__streamAtlas = true;

    // this.__streamAtlasDesc = new Vec4();
    this.addParameter(new Vec4Parameter('StreamAtlasDesc', new Vec4$1()));
    this.addParameter(new NumberParameter('StreamAtlasIndex', 0)).setRange([0, 1]);

    this.getFrameDelay = () => {
      return 20
    };
    let playing;
    let incrementFrame;
    this.play = () => {
      resourcePromise.then(() => {
        playing = true;
        if (incrementFrame) incrementFrame();
      });
    };
    this.stop = () => {
      playing = false;
    };
    let resourcePromise;
    if (file.id in imageDataLibrary) {
      resourcePromise = imageDataLibrary[file.id];
    } else {
      resourcePromise = new Promise((resolve, reject) => {
        resourceLoader.addWork(file.id, 1);

        if (file.assets && file.assets.atlas) {
          const imageElem = new Image();
          imageElem.crossOrigin = 'anonymous';
          imageElem.src = file.assets.atlas.url;
          imageElem.addEventListener('load', () => {
            resolve({
              width: file.assets.atlas.width,
              height: file.assets.atlas.height,
              atlasSize: file.assets.atlas.atlasSize,
              frameDelays: file.assets.atlas.frameDelays,
              frameRange: [0, file.assets.atlas.frameDelays.length],
              imageData: imageElem,
            });
            resourceLoader.addWorkDone(file.id, 1);
          });
          return
        }

        loadBinfile(
          file.url,
          (data) => {
            console.warn('Unpacking Gif client side:' + file.name);

            const start = performance.now();

            // Decompressing using: https://github.com/matt-way/gifuct-js
            const gif = new GIF(data);
            const frames = gif.decompressFrames(true);

            // do something with the frame data
            const sideLength = Math.sqrt(frames.length);
            const atlasSize = [sideLength, sideLength];
            if (MathFunctions.fract(sideLength) > 0.0) {
              atlasSize[0] = Math.floor(atlasSize[0] + 1);
              if (MathFunctions.fract(sideLength) > 0.5) {
                atlasSize[1] = Math.floor(atlasSize[1] + 1);
              } else {
                atlasSize[1] = Math.floor(atlasSize[1]);
              }
            }

            const width = frames[0].dims.width;
            const height = frames[0].dims.height;

            // gif patch canvas
            const tempCanvas = document.createElement('canvas');
            const tempCtx = tempCanvas.getContext('2d');
            // full gif canvas
            const gifCanvas = document.createElement('canvas');
            const gifCtx = gifCanvas.getContext('2d');

            gifCanvas.width = width;
            gifCanvas.height = height;

            // The atlas for all the frames.
            const atlasCanvas = document.createElement('canvas');
            const atlasCtx = atlasCanvas.getContext('2d');
            atlasCanvas.width = atlasSize[0] * width;
            atlasCanvas.height = atlasSize[1] * height;

            let frameImageData;
            const frameDelays = [];
            const renderFrame = (frame, index) => {
              const dims = frame.dims;

              // Note: the server side library returns centisecs for
              // frame delays, so normalize here so that client and servers
              // valueus are in the
              frameDelays.push(frame.delay / 10);

              if (!frameImageData || dims.width != frameImageData.width || dims.height != frameImageData.height) {
                tempCanvas.width = dims.width;
                tempCanvas.height = dims.height;
                frameImageData = tempCtx.createImageData(dims.width, dims.height);
              }

              // set the patch data as an override
              frameImageData.data.set(frame.patch);
              tempCtx.putImageData(frameImageData, 0, 0);

              // Note: undocumented disposal method.
              // See Ids here: https://github.com/theturtle32/Flash-Animated-GIF-Library/blob/master/AS3GifPlayer/src/com/worlize/gif/constants/DisposalType.as
              // From what I can gather, 2 means we should clear the background first.
              // this seems towork with Gifs featuring moving transparency.
              // For fully opaque gifs, we should avoid this.
              if (frame.disposalType == 2) gifCtx.clearRect(0, 0, gifCanvas.width, gifCanvas.height);

              gifCtx.drawImage(tempCanvas, dims.left, dims.top);

              atlasCtx.drawImage(gifCanvas, (index % atlasSize[0]) * width, Math.floor(index / atlasSize[0]) * height);
            };

            for (let i = 0; i < frames.length; i++) {
              // console.log(frame);
              renderFrame(frames[i], i);
            }
            resourceLoader.addWorkDone(file.id, 1);

            const imageData = atlasCtx.getImageData(0, 0, atlasCanvas.width, atlasCanvas.height);

            const ms = performance.now() - start;
            console.log(`Decode GIF '${file.name}' time:` + ms);

            resolve({
              width: atlasCanvas.width,
              height: atlasCanvas.height,
              atlasSize,
              frameRange: [0, frames.length],
              frameDelays,
              imageData,
            });
          },
          (statusText) => {
            const msg = 'Unable to Load URL:' + statusText + ':' + fileDesc.url;
            console.warn(msg);
            reject(msg);
          }
        );
      });

      imageDataLibrary[file.id] = resourcePromise;
    }

    resourcePromise.then((unpackedData) => {
      this.width = unpackedData.width;
      this.height = unpackedData.height;

      this.getParameter('StreamAtlasDesc').setValue(
        new Vec4$1(unpackedData.atlasSize[0], unpackedData.atlasSize[1], 0, 0)
      );
      this.getParameter('StreamAtlasIndex').setRange(unpackedData.frameRange);

      this.__data = unpackedData.imageData;

      this.getFrameDelay = (index) => {
        // Note: Frame delays are in centisecs (not millisecs which the timers will require.)
        return unpackedData.frameDelays[index] * 10
      };

      // ////////////////////////
      // Playback
      const frameParam = this.getParameter('StreamAtlasIndex');
      const numFrames = frameParam.getRange()[1];
      let frame = 0;
      incrementFrame = () => {
        frameParam.setValue(frame);
        if (playing) setTimeout(incrementFrame, this.getFrameDelay(frame));
        frame = (frame + 1) % numFrames;
      };
      if (playing) incrementFrame();
      this.__loaded = true;

      this.emit('loaded', {});
    });
  }

  /**
   * The isStream method.
   * @return {boolean} - The return value.
   */
  isStream() {
    return false
  }

  /**
   * The isLoaded method.
   * @return {any} - The return value.
   */
  isLoaded() {
    return this.__loaded
  }

  /**
   * The getParams method.
   * @return {any} - The return value.
   */
  getParams() {
    const params = super.getParams();
    if (this.__loaded) {
      params['data'] = this.__data;
    }
    return params
  }

  // ////////////////////////////////////////
  // Persistence

  /**
   * The toJSON method encodes this type as a json object for persistence.
   * @param {object} context - The context value.
   */
  toJSON(context) {}

  /**
   * The fromJSON method decodes a json object for this type.
   * @param {object} json - The json object this item must decode.
   * @param {object} context - The context value.
   */
  fromJSON(json, context) {}

  /**
   * The readBinary method.
   * @param {object} reader - The reader param.
   * @param {object} context - The context param.
   */
  readBinary(reader, context) {
    // super.readBinary(reader, context);
    this.setName(reader.loadStr());

    let filePath = reader.loadStr();
    if (typeof filePath === 'string' && filePath != '') {
      if (context.lod >= 0) {
        const suffixSt = filePath.lastIndexOf('.');
        if (suffixSt != -1) {
          const lodPath = filePath.substring(0, suffixSt) + context.lod + filePath.substring(suffixSt);
          if (resourceLoader.resolveFilepath(lodPath)) {
            filePath = lodPath;
          }
        }
      }
      this.getParameter('FilePath').setFilepath(filePath);
    }
  }
}

/** Class representing a 2D file image.
 * @extends FileImage
 */
class FileImage2D extends FileImage$1 {
  /**
   * Create a file image 2D.
   * @param {any} filePath - The filePath value.
   * @param {any} params - The params value.
   */
  constructor(filePath, params = {}) {
    console.warn('FileImage2D is becoming deprecated in favor of simple FileImage');
    super(filePath, params);
  }
}

Registry.register('FileImage2D', FileImage$1);
Registry.register('FileImage', FileImage$1);

/* eslint-disable require-jsdoc */

const supportWebp$1 = globalThis.navigator && navigator.userAgent.indexOf('Chrome') !== -1;

/**
 * Class representing a LDR (low dynamic range) image.
 *
 * ```
 * const image = new LDRImage()
 * image.getParameter('FilePath').setUrl("https://storage.googleapis.com/zea-playground-assets/zea-engine/texture.png")
 * ```
 *
 * **Parameters**
 * * **PreferredSize(`NumberParameter`):** _todo_
 *
 * **Events:**
 * * **loaded:** Triggered when image data is loaded.
 *
 * **File Types:** jpg, jpeg, png
 *
 * @extends FileImage
 */
class LDRImage extends FileImage$1 {
  /**
   * Create a LDR image.
   * @param {string} name - The name value.
   * @param {string} filePath - The filePath value.
   * @param {object} params - The params value.
   */
  constructor(name, filePath, params) {
    super(name, filePath, params);
    this.type = 'UNSIGNED_BYTE';
    this.addParameter(new NumberParameter('PreferredSize', -1));
    this.__crossOrigin = 'anonymous';
  }

  /**
   * Defines how to handle cross origin request.
   *
   * **Possible values:**
   * * **anonymous** - CORS requests for this element will have the credentials flag set to 'same-origin'.
   * * **use-credentials** - CORS requests for this element will have the credentials flag set to 'include'.
   * * **""** - Setting the attribute name to an empty value, like crossorigin or crossorigin="", is the same as anonymous.
   *
   * @default anonymous
   * @param {string} crossOrigin - The crossOrigin value.
   */
  setCrossOrigin(crossOrigin) {
    this.__crossOrigin = crossOrigin;
  }

  /**
   * The __loadData method.
   * @param {object} fileDesc - The fileDesc value.
   * @private
   */
  __loadData(fileDesc) {
    const ext = this.getParameter('FilePath').getExt();
    const format = 'RGB';
    if (ext == '.png') {
      this.format = 'RGBA';
    }

    let url = fileDesc.url;
    if (fileDesc.assets && Object.keys(fileDesc.assets).length > 0) {
      function chooseImage(params, filterAssets) {
        // Note: this is a filter to remove any corrupt data
        // generate by our broken server side processing system.
        filterAssets = filterAssets.filter((asset) => asset !== null);

        if (supportWebp$1) {
          const resultFilter = filterAssets.filter((asset) => asset.format === 'webp');

          if (resultFilter.length > 1) {
            filterAssets = resultFilter;
          }
        } else {
          filterAssets = filterAssets.filter((asset) => asset.format !== 'webp');
        }

        if (params.maxSize) {
          filterAssets = filterAssets.filter((asset) => asset.w <= params.maxSize);
        }
        if (params.filter) {
          const resultFilter = filterAssets.filter((asset) => asset.url.indexOf(params.filter) !== -1);
          if (resultFilter.length > 1) {
            filterAssets = resultFilter;
          }
        }
        if (params.prefSize) {
          filterAssets = filterAssets.map((asset) =>
            Object.assign(
              {
                score: Math.abs(params.prefSize - asset.w),
              },
              asset
            )
          );

          // return low score, close to desire
          // return _.sortBy(score, "score")[0].option.url;
          filterAssets.sort((a, b) => (a.score > b.score ? 1 : a.score < b.score ? -1 : 0));
        }
        if (filterAssets.length > 0) return filterAssets[0]
      }
      const params = {
        maxSize: SystemDesc.gpuDesc.maxTextureSize,
      };
      const prefSize = this.getParameter('PreferredSize').getValue();
      if (prefSize == -1) {
        if (fileDesc.assets.reduce) params.prefSize = fileDesc.assets.reduce.w;
      } else {
        params.prefSize = prefSize;
      }
      const asset = chooseImage(params, Object.values(fileDesc.assets));
      if (asset) {
        console.log(
          'Selected image:' +
            fileDesc.name +
            ' format:' +
            asset.format +
            ' :' +
            asset.w +
            'x' +
            asset.h +
            ' url:' +
            asset.url
        );
        url = asset.url;
      }
    } else {
      console.warn('Images not processed for this file:' + fileDesc.name);
    }

    this.setImageURL(url, format);
  }

  /**
   * Uses the specify url to load an Image element and adds it to the data library.
   * Sets the state of the current object.
   *
   * @param {string} url - The url value.
   * @param {string} format - The format value.
   */
  setImageURL(url, format = 'RGB') {
    if (!format) {
      const suffixSt = url.lastIndexOf('.');
      if (suffixSt != -1) {
        const ext = url.substring(suffixSt).toLowerCase();
        if (ext == '.png') {
          format = 'RGBA';
        }
      }
    }
    this.format = format;
    this.__loaded = false;

    let imageElem;
    const loaded = () => {
      this.getDOMElement = () => {
        return imageElem
      };
      this.width = imageElem.width;
      this.height = imageElem.height;
      this.__data = imageElem;
      this.__loaded = true;
      this.emit('loaded', {});
    };
    const imageDataLibrary = FileImage$1.__imageDataLibrary();
    if (url in imageDataLibrary) {
      imageElem = imageDataLibrary[url];
      if (imageElem.complete) {
        loaded();
      } else {
        imageElem.addEventListener('load', loaded);
      }
    } else {
      imageElem = new Image();
      imageElem.crossOrigin = this.__crossOrigin;
      imageElem.src = url;

      imageElem.addEventListener('load', loaded);
      imageDataLibrary[url] = imageElem;
    }
  }
}

FileImage$1.registerLoader('jpg|jpeg|png', LDRImage);
Registry.register('LDRImage', LDRImage);

/**
 * Class representing a LDR (low dynamic range) video.
 *
 * ```
 * const video = new LDRVideo()
 * video.getParameter('FilePath').setUrl("https://storage.googleapis.com/zea-playground-assets/zea-engine/video.mp4")
 * ```
 *
 * **Parameters**
 * * **Mute(`BooleanParameter`):** Mutes video volume.
 * * **Loop(`BooleanParameter`):** Repeats video over and over again.
 * * **Gain(`NumberParameter`):** Sets loudness of the video before going through any processing.
 * * **SpatializeAudio(`BooleanParameter`):** Enables/Disables spatial(Surrounding) audio.
 * * **refDistance(`NumberParameter`):** _todo_
 * * **maxDistance(`NumberParameter`):** _todo_
 * * **rolloffFactor(`NumberParameter`):** _todo_
 * * **coneInnerAngle(`NumberParameter`):** _todo_
 * * **coneOuterAngle(`NumberParameter`):** _todo_
 * * **coneOuterGain(`NumberParameter`):** _todo_
 *
 * **File Types:** mp4, ogg
 *
 * @extends FileImage
 */
class LDRVideo extends FileImage$1 {
  /**
   * Create a LDR video.
   * @param {string} name - The name value.
   * @param {string} filePath - The filePath value.
   * @param {object} params - The params value.
   */
  constructor(name, filePath, params) {
    super(name, filePath, params);
    this.format = 'RGB';
    this.type = 'UNSIGNED_BYTE';

    this.addParameter(new BooleanParameter('Mute', false));
    this.addParameter(new BooleanParameter('Loop', true));
    this.addParameter(new NumberParameter('Gain', 2.0)).setRange([0, 5]);
    this.addParameter(new BooleanParameter('SpatializeAudio', true));
    this.addParameter(new NumberParameter('refDistance', 2));
    this.addParameter(new NumberParameter('maxDistance', 10000));
    this.addParameter(new NumberParameter('rolloffFactor', 1));
    this.addParameter(new NumberParameter('coneInnerAngle', 360));
    this.addParameter(new NumberParameter('coneOuterAngle', 0));
    this.addParameter(new NumberParameter('coneOuterGain', 1));
  }

  /**
   * The __loadData method.
   * @param {object} fileDesc - The fileDesc value.
   * @private
   */
  __loadData(fileDesc) {
    resourceLoader.addWork(fileDesc.id, 1);

    const videoElem = document.createElement('video');
    // TODO - confirm its necessary to add to DOM
    videoElem.style.display = 'none';
    videoElem.preload = 'auto';
    videoElem.crossOrigin = 'anonymous';
    // videoElem.crossorigin = true;

    this.getAudioSource = () => {
      return videoElem
    };

    document.body.appendChild(videoElem);
    videoElem.addEventListener(
      'loadedmetadata',
      () => {
        // videoElem.play();

        const muteParam = this.getParameter('Mute');
        videoElem.muted = muteParam.getValue();
        muteParam.on('valueChanged', () => {
          videoElem.muted = muteParam.getValue();
        });

        const loopParam = this.getParameter('Loop');
        videoElem.loop = loopParam.getValue();
        loopParam.on('valueChanged', () => {
          videoElem.loop = loopParam.getValue();
        });

        this.width = videoElem.videoHeight;
        this.height = videoElem.videoWidth;
        this.__data = videoElem;
        this.__loaded = true;
        resourceLoader.addWorkDone(fileDesc.id, 1);
        this.emit('loaded', {});

        let prevFrame = 0;
        const frameRate = 29.97;
        const timerCallback = () => {
          if (videoElem.paused || videoElem.ended) {
            return
          }
          // Check to see if the video has progressed to the next frame.
          // If so, then we emit and update, which will cause a redraw.
          const currentFrame = Math.floor(videoElem.currentTime * frameRate);
          if (prevFrame != currentFrame) {
            this.emit('updated', {});
            prevFrame = currentFrame;
          }
          setTimeout(timerCallback, 20); // Sample at 50fps.
        };
        timerCallback();
      },
      false
    );
    videoElem.src = fileDesc.url;
    // videoElem.load();
    const promise = videoElem.play();
    if (promise !== undefined) {
      promise
        .then((_) => {
          console.log('Autoplay started!');
          // Autoplay started!
        })
        .catch(() => {
          console.log('Autoplay was prevented.');
          // Autoplay was prevented.
          // Show a "Play" button so that user can start playback.
        });
    }
  }
}

FileImage$1.registerLoader('mp4|ogg', LDRVideo);
Registry.register('LDRVideo', LDRVideo);

/* eslint-disable prefer-promise-reject-errors */

/**
 * Class representing a GIF image.
 *
 * ```
 * const image = new GIFImage()
 * image.getParameter('FilePath').setUrl("https://storage.googleapis.com/zea-playground-assets/zea-engine/texture.gif")
 * ```
 *
 * **Parameters**
 * * **StreamAtlasDesc:**
 * * **StreamAtlasIndex:**
 *
 * **Events**
 * * **loaded:** Triggered when the gif data is loaded.
 *
 * **File Types:** gif
 *
 * @extends FileImage
 */
class GIFImage extends FileImage$1 {
  /**
   * Create a GIF image.
   * @param {string} name - The name value.
   * @param {string|object} filePath - The filePath value.
   * @param {object} params - The params value.
   */
  constructor(name, filePath = '', params = {}) {
    super(name, filePath, params);

    this.format = 'RGBA';
    this.type = 'UNSIGNED_BYTE';
    this.__streamAtlas = true;
    // this.getParameter('FilePath').setSupportedExts('gif')

    this.addParameter(new Vec4Parameter('StreamAtlasDesc'));
    this.addParameter(new NumberParameter('StreamAtlasIndex', 0));

    const frameParam = this.getParameter('StreamAtlasIndex');
    frameParam.setRange([0, 1]);

    let playing;
    let frame = 0;
    const incrementFrame = (numFrames) => {
      frameParam.setValue(frame);
      if (playing) setTimeout(() => incrementFrame(numFrames), this.getFrameDelay(frame));
      frame = (frame + 1) % numFrames;
    };
    this.play = () => {
      this.__resourcePromise.then(() => {
        playing = true;
        const numFrames = frameParam.getRange()[1];
        incrementFrame(numFrames);
      });
    };
    this.stop = () => {
      playing = false;
    };
  }

  /**
   * The getFrameDelay method.
   * @param {number} index - The index value.
   * @return {number} - The return value.
   */
  getFrameDelay(index) {
    // Note: Frame delays are in centisecs (not millisecs which the timers will require.)
    return this.__unpackedData.frameDelays[index] * 10
  }

  /**
   * The __loadData method.
   * @param {object} fileDesc - The fileDesc value.
   * @private
   */
  __loadData(fileDesc) {
    // this.__streamAtlasDesc = new Vec4();

    const imageDataLibrary = FileImage$1.__imageDataLibrary();
    if (fileDesc.id in imageDataLibrary) {
      this.__resourcePromise = imageDataLibrary[fileDesc.id];
    } else {
      this.__resourcePromise = new Promise((resolve, reject) => {
        resourceLoader.addWork(fileDesc.id, 1);

        if (fileDesc.assets && fileDesc.assets.atlas) {
          const imageElem = new Image();
          imageElem.crossOrigin = 'anonymous';
          imageElem.src = fileDesc.assets.atlas.url;
          imageElem.addEventListener('load', () => {
            resolve({
              width: fileDesc.assets.atlas.width,
              height: fileDesc.assets.atlas.height,
              atlasSize: fileDesc.assets.atlas.atlasSize,
              frameDelays: fileDesc.assets.atlas.frameDelays,
              frameRange: [0, fileDesc.assets.atlas.frameDelays.length],
              imageData: imageElem,
            });
            resourceLoader.addWorkDone(fileDesc.id, 1);
          });
          return
        }

        loadBinfile(
          fileDesc.url,
          (data) => {
            console.warn('Unpacking Gif client side:' + fileDesc.name);

            const start = performance.now();

            // Decompressing using: https://github.com/matt-way/gifuct-js
            const gif = new GIF(data);
            const frames = gif.decompressFrames(true);

            // do something with the frame data
            const sideLength = Math.sqrt(frames.length);
            const atlasSize = [sideLength, sideLength];
            if (MathFunctions.fract(sideLength) > 0.0) {
              atlasSize[0] = Math.floor(atlasSize[0] + 1);
              if (MathFunctions.fract(sideLength) > 0.5) {
                atlasSize[1] = Math.floor(atlasSize[1] + 1);
              } else {
                atlasSize[1] = Math.floor(atlasSize[1]);
              }
            }

            const width = frames[0].dims.width;
            const height = frames[0].dims.height;

            // gif patch canvas
            const tempCanvas = document.createElement('canvas');
            const tempCtx = tempCanvas.getContext('2d');
            // full gif canvas
            const gifCanvas = document.createElement('canvas');
            const gifCtx = gifCanvas.getContext('2d');

            gifCanvas.width = width;
            gifCanvas.height = height;

            // The atlas for all the frames.
            const atlasCanvas = document.createElement('canvas');
            const atlasCtx = atlasCanvas.getContext('2d');
            atlasCanvas.width = atlasSize[0] * width;
            atlasCanvas.height = atlasSize[1] * height;

            let frameImageData;
            const frameDelays = [];
            const renderFrame = (frame, index) => {
              const dims = frame.dims;

              // Note: the server side library returns centisecs (1/100 second) for
              // frame delays, so normalize here so that client and servers
              // valueus are in the
              frameDelays.push(frame.delay / 10);

              if (!frameImageData || dims.width != frameImageData.width || dims.height != frameImageData.height) {
                tempCanvas.width = dims.width;
                tempCanvas.height = dims.height;
                frameImageData = tempCtx.createImageData(dims.width, dims.height);
              }

              // set the patch data as an override
              frameImageData.data.set(frame.patch);
              tempCtx.putImageData(frameImageData, 0, 0);

              // Note: undocumented disposal method.
              // See Ids here: https://github.com/theturtle32/Flash-Animated-GIF-Library/blob/master/AS3GifPlayer/src/com/worlize/gif/constants/DisposalType.as
              // From what I can gather, 2 means we should clear the background first.
              // this seems to work with Gifs featuring moving transparency.
              // For fully opaque gifs, we should avoid this.
              if (frame.disposalType == 2) gifCtx.clearRect(0, 0, gifCanvas.width, gifCanvas.height);

              gifCtx.drawImage(tempCanvas, dims.left, dims.top);

              atlasCtx.drawImage(gifCanvas, (index % atlasSize[0]) * width, Math.floor(index / atlasSize[0]) * height);
            };

            for (let i = 0; i < frames.length; i++) {
              // console.log(frame);
              renderFrame(frames[i], i);
            }
            resourceLoader.addWorkDone(fileDesc.id, 1);

            const imageData = atlasCtx.getImageData(0, 0, atlasCanvas.width, atlasCanvas.height);

            const ms = performance.now() - start;
            console.log(`Decode GIF '${fileDesc.name}' time:` + ms);

            resolve({
              width: atlasCanvas.width,
              height: atlasCanvas.height,
              atlasSize,
              frameRange: [0, frames.length],
              frameDelays,
              imageData,
            });
          },
          (statusText) => {
            const msg = 'Unable to Load URL:' + statusText + ':' + fileDesc.url;
            console.warn(msg);
            reject(msg);
          }
        );
      });

      imageDataLibrary[fileDesc.id] = this.__resourcePromise;
    }

    this.__resourcePromise.then((unpackedData) => {
      this.width = unpackedData.width;
      this.height = unpackedData.height;

      this.getParameter('StreamAtlasDesc').setValue(
        new Vec4$1(unpackedData.atlasSize[0], unpackedData.atlasSize[1], 0, 0)
      );
      this.getParameter('StreamAtlasIndex').setRange(unpackedData.frameRange);

      this.__unpackedData = unpackedData;
      this.__data = unpackedData.imageData;

      // ////////////////////////
      // Playback
      this.__loaded = true;

      this.emit('loaded', {});
    });
  }
}

FileImage$1.registerLoader('gif', GIFImage);
Registry.register('GIFImage', GIFImage);

/**
 * Class representing a VLH image.
 *
 * **Parameters**
 * * **FilePath(`FilePathParameter`):** Used to specify the path to the file.
 *
 * **Events**
 * * **loaded:** Triggered when image data is loaded.
 * * **updated:** Triggered when image data is updated.
 *
 * @extends BaseImage
 */
class VLHImage extends BaseImage {
  /**
   * Create a VLH image.
   * @param {string} name - The name value.
   * @param {object} params - The params value.
   */
  constructor(name, params = {}) {
    let filepath;
    if (name != undefined && name.lastIndexOf('.') != -1) {
      filepath = name;
      name = name.substring(name.lastIndexOf('/') + 1, name.lastIndexOf('.'));
    }
    super(name, params);

    this.__loaded = false;
    this.__exposure = 1.0;
    this.__ambientLightFactor = 0.0;
    this.__hdrtint = new Color(1, 1, 1, 1);
    this.__stream = 'stream' in params ? params['stream'] : false;
    this.type = 'FLOAT';

    const fileParam = this.addParameter(new FilePathParameter('FilePath'));
    fileParam.on('valueChanged', () => {
      this.loaded = false;

      if (this.getName() == '') {
        // Generate a name from the file path.
        const stem = fileParam.getStem();
        const decorator = stem.substring(stem.length - 1);
        if (!isNaN(decorator)) {
          // Note: ALL image names have an LOD specifier at the end.
          // remove that off when retrieving the name.
          this.setName(stem.substring(0, stem.length - 1));
        } else {
          this.setName(stem);
        }
      }

      const fileId = fileParam.getValue();
      const file = fileParam.getFile();
      this.__loadVLH(fileId, file);
    });

    if (filepath) {
      this.getParameter('FilePath').setFilepath(filepath);
    }
  }

  /**
   * Returns DOM Element.
   *
   * @return {HTMLElement} - The return value.
   */
  getDOMElement() {
    return this.__domElement
  }

  /**
   * Returns `FilePath` parameter's value.
   *
   * @return {string} - The return value.
   */
  getResourcePath() {
    return this.getParameter('FilePath').getValue()
  }

  /**
   * The __decodeData method.
   * @param {object} entries - The entries value.
   * @private
   */
  __decodeData(entries) {
    const ldr = entries.ldr;
    const cdm = entries.cdm;

    // ///////////////////////////////
    // Parse the data.
    const blob = new Blob([ldr.buffer]);
    const ldrPic = new Image();
    ldrPic.onload = () => {
      this.width = ldrPic.width;
      this.height = ldrPic.height;
      // console.log(resourcePath + ": [" + this.width + ", " + this.height + "]");
      this.__data = {
        ldr: ldrPic,
        cdm: cdm,
      };
      if (!this.__loaded) {
        this.__loaded = true;
        this.emit('loaded', {});
      } else {
        this.emit('updated', {});
      }
    };
    ldrPic.src = URL.createObjectURL(blob);
  }

  /**
   * The __loadVLH method.
   * @param {string} fileId - The fileId value.
   * @param {object} file - The file value.
   * @private
   */
  __loadVLH(fileId, file) {
    this.type = 'FLOAT';

    resourceLoader.loadUrl(fileId, file.url, (entries) => {
      if (!entries.ldr || !entries.cdm) {
        for (const name in entries) {
          if (name.endsWith('.jpg')) {
            entries.ldr = entries[name];
            delete entries[name];
          } else if (name.endsWith('.bin')) {
            entries.cdm = entries[name];
            delete entries[name];
          }
        }
      }
      this.__decodeData(entries);
    });
  }

  /**
   * Returns if the data is a stream or not.
   *
   * @return {boolean} - The return value.
   */
  isStream() {
    return false
  }

  /**
   * Returns the status of the data, whether is loaded or not.
   *
   * @return {boolean} - The return value.
   */
  isLoaded() {
    return this.__loaded
  }

  /**
   * Returns all parameters and class state values.
   *
   * @return {object} - The return value.
   */
  getParams() {
    const params = super.getParams();
    if (this.__loaded) {
      params['data'] = this.__data;
      params['exposure'] = this.__exposure;
    }
    return params
  }

  /**
   * The setHDRTint method.
   * @private
   * @param {Color} hdrtint - The hdrtint value.
   */
  setHDRTint(hdrtint) {
    this.__hdrtint = hdrtint;
  }

  /**
   * The getHDRTint method.
   * @private
   * @return {Color} - The return value.
   */
  getHDRTint() {
    return this.__hdrtint
  }

  // ////////////////////////////////////////
  // Persistence

  /**
   * The toJSON method encodes this type as a json object for persistence.
   *
   * @param {object} context - The context value.
   */
  toJSON(context) {}

  /**
   * The fromJSON method decodes a json object for this type.
   *
   * @param {object} json - The json object this item must decode.
   * @param {object} context - The context value.
   */
  fromJSON(json, context) {}

  /**
   * Sets state of current Image using a binary reader object, and adds it to the resource loader.
   *
   * @param {BinReader} reader - The reader value.
   * @param {object} context - The context value.
   */
  readBinary(reader, context) {
    // super.readBinary(reader, context);
    this.setName(reader.loadStr());
    const resourcePath = reader.loadStr();
    if (typeof resourcePath === 'string' && resourcePath != '') {
      if (context.lod >= 0) {
        const suffixSt = resourcePath.lastIndexOf('.');
        if (suffixSt != -1) {
          const lodPath = resourcePath.substring(0, suffixSt) + context.lod + resourcePath.substring(suffixSt);
          if (resourceLoader.resourceAvailable(lodPath)) {
            resourcePath = lodPath;
          }
        }
      }
      this.getParameter('FilePath').setValue(resourcePath);
    }
  }
}

Registry.register('VLHImage', VLHImage);

/* eslint-disable new-cap */

const EnvMapMapping = {
  LATLONG: 1,
  OCTAHEDRAL: 2,
};

const step = (edge, x) => (x < edge ? 0.0 : 1.0);

function sum_vec2(value) {
  return value.dot(new Vec2(1.0, 1.0))
}
function abs_vec2(value) {
  return new Vec2(Math.abs(value.x), Math.abs(value.y))
}
function max_vec2(vec, value) {
  return new Vec2(Math.max(vec.x, value), Math.max(vec.y, value))
}
function abs_vec3(value) {
  return new Vec3$1(Math.abs(value.x), Math.abs(value.y), Math.abs(value.z))
}
function sectorize_vec2(value) {
  return new Vec2(step(0.0, value.x) * 2.0 - 1.0, step(0.0, value.y) * 2.0 - 1.0)
}
function sectorize_vec3(value) {
  return new Vec3$1(step(0.0, value.x) * 2.0 - 1.0, step(0.0, value.y) * 2.0 - 1.0, step(0.0, value.z) * 2.0 - 1.0)
}

function latLongUVsFromDir(dir) {
  // Math function taken from...
  // http://gl.ict.usc.edu/Data/HighResProbes/
  // Note: Scaling from u=[0,2], v=[0,1] to u=[0,1], v=[0,1]
  const phi = Math.acos(dir.z);
  const theta = Math.atan2(dir.x, -dir.y);
  return new Vec2((1 + theta / Math.PI) / 2, phi / Math.PI)
}

// Note: when u == 0.5 z = 1
function dirFromLatLongUVs(u, v) {
  // http://gl.ict.usc.edu/Data/HighResProbes/
  const theta = Math.PI * (u * 2 - 1);
  const phi = Math.PI * v;
  return new Vec3$1(sin(phi) * sin(theta), -sin(phi) * cos(theta), cos(phi))
}

function dirToSphOctUv(normal) {
  const aNorm = abs_vec3(normal);
  const sNorm = sectorize_vec3(normal);
  const aNorm_xy = new Vec2(aNorm.x, aNorm.y);

  let dir = max_vec2(aNorm_xy, 1e-20);
  const orient = Math.atan2(dir.x, dir.y) / (Math.PI * 0.5);

  dir = max_vec2(new Vec2(aNorm.z, aNorm_xy.length()), 1e-20);
  const pitch = Math.atan2(dir.y, dir.x) / (Math.PI * 0.5);

  let uv = new Vec2(sNorm.x * orient, sNorm.y * (1.0 - orient));
  uv.scaleInPlace(pitch);

  if (normal.z < 0.0) {
    const ts = new Vec2(uv.y, uv.x);
    const sNorm_xy = new Vec2(sNorm.x, sNorm.y);
    uv = sNorm_xy.subtract(abs_vec2(ts).multiply(sNorm_xy));
  }
  return uv.scale(0.5).add(new Vec2(0.5, 0.5))
}

function sphOctUvToDir(uv) {
  uv = uv.scale(2).subtract(new Vec2(1, 1));
  const suv = sectorize_vec2(uv);
  const sabsuv = sum_vec2(abs_vec2(uv));
  const pitch = sabsuv * Math.PI * 0.5;

  if (pitch <= 0.0) {
    return new Vec3$1(0.0, 0.0, 1.0)
  }
  if (Math.abs(pitch - Math.PI) < 0.000001) {
    return new Vec3$1(0.0, 0.0, -1.0)
  }
  if (sabsuv > 1.0) {
    const ts = Vec2(uv.y, uv.x);
    uv = abs_vec2(ts).negate().add(new Vec2(1, 1)).multiply(suv);

    sabsuv = sum_vec2(abs_vec2(uv));
  }

  const orient = (Math.abs(uv.x) / sabsuv) * (Math.PI * 0.5);
  const sOrient = Math.sin(orient);
  const cOrient = Math.cos(orient);
  const sPitch = Math.sin(pitch);
  const cPitch = Math.cos(pitch);

  return new Vec3$1(sOrient * suv.x * sPitch, cOrient * suv.y * sPitch, cPitch)
}

/**
 * Class representing an environment map.
 * @extends VLHImage
 */
class EnvMap extends VLHImage {
  /**
   * Create an env map.
   * @param {string} name - The name value.
   * @param {object} params - The params value.
   */
  constructor(name, params = {}) {
    super(name, params);

    this.mapping = EnvMapMapping.OCTAHEDRAL;
  }

  /**
   * The __decodeData method.
   * @param {object} entries - The entries value.
   * @private
   */
  __decodeData(entries) {
    super.__decodeData(entries);

    const samples = entries.samples;

    if (samples) {
      if (window.TextDecoder) this.__sampleSets = JSON.parse(new TextDecoder('utf-8').decode(samples));
      else this.__sampleSets = JSON.parse(decodeText(samples));

      if (this.__sampleSets.luminanceThumbnail)
        this.__thumbSize = Math.sqrt(this.__sampleSets.luminanceThumbnail.length);
    }
  }

  /**
   * The getSampleSets method.
   * @return {object} - The return value.
   */
  getSampleSets() {
    return this.__sampleSets
  }

  /**
   * The uvToDir method.
   * @param {Vec2} uv - The uv value.
   * @return {Vec2|Vec3} - The return value.
   */
  uvToDir(uv) {
    switch (this.mapping) {
      case EnvMapMapping.LATLONG:
        return dirFromLatLongUVs(uv)
      case EnvMapMapping.OCTAHEDRAL:
        return sphOctUvToDir(uv)
    }
  }

  /**
   * Converts position into UV.
   *
   * @param {Vec2|Vec3} dir - The dir value.
   * @return {Vec2} - The return value.
   */
  dirToUv(dir) {
    switch (this.mapping) {
      case EnvMapMapping.LATLONG:
        return latLongUVsFromDir(dir)
      case EnvMapMapping.OCTAHEDRAL:
        return dirToSphOctUv(dir)
    }
  }

  /**
   * Converts a `Vec2` into luminance.
   *
   * @param {Vec2} uv - The uv value.
   * @return {number} - The return value.
   */
  uvToLuminance(uv) {
    const thmbPixel = Math.floor(uv.y * this.__thumbSize) * this.__thumbSize + Math.floor(uv.x * this.__thumbSize);
    return this.__sampleSets.luminanceThumbnail[thmbPixel]
  }

  /**
   * Converts `Vec2` coordinates into luminance.
   *
   * @param {object} dir - The dir value.
   * @return {number} - The return value.
   */
  dirToLuminance(dir) {
    return this.uvToLuminance(this.dirToUv(dir))
  }
}

Registry.register('EnvMap', EnvMap);

// eslint-disable-next-line require-jsdoc
function getLanguage() {
  if (!globalThis.navigator) return 'en'

  // Check if a language is explicitly selected.
  const searchParams = new URLSearchParams(window.location.search);
  if (searchParams.has('lang')) return searchParams.get('lang')

  const nav = window.navigator;
  const browserLanguagePropertyKeys = ['language', 'browserLanguage', 'systemLanguage', 'userLanguage'];
  let i;
  let language;

  const clean = (language) => {
    if (language.startsWith('en')) return 'En'
    else if (language.startsWith('es')) return 'Es'
    else if (language.startsWith('fr')) return 'Fr'
    else if (language.startsWith('gb') || language.startsWith('de')) return 'Gb'
    return language
  };

  // support for HTML 5.1 "navigator.languages"
  if (Array.isArray(nav.languages)) {
    for (i = 0; i < nav.languages.length; i++) {
      language = nav.languages[i];
      if (language && language.length) {
        return clean(language)
      }
    }
  }

  // support for other well known properties in browsers
  for (i = 0; i < browserLanguagePropertyKeys.length; i++) {
    language = nav[browserLanguagePropertyKeys[i]];
    if (language && language.length) {
      return clean(language)
    }
  }

  return null
}

/** Class representing a label manager.
 * @private
 */
class LabelManager extends EventEmitter {
  /**
   * Create a label manager.
   */
  constructor() {
    super();
    this.__labelLibraries = {};

    this.__language = getLanguage();
    this.__foundLabelLibraries = {};
  }

  /**
   * Load a label library into the manager.
   * @param {string} name - The name of the library.
   * @param {json} json - The json data of of the library.
   */
  loadLibrary(name, url) {
    const stem = name.split(name.lastIndexOf('.'))[0];

    if (name.endsWith('.labels')) {
      loadTextfile(url, (text) => {
        this.__labelLibraries[stem] = JSON.parse(text);
        this.emit('labelLibraryLoaded', { library: stem });
      });
    } else if (name.endsWith('.xlsx') && globalThis.navigator && window.XLSX) {
      // Note: example taken from here..
      // https://stackoverflow.com/questions/8238407/how-to-parse-excel-file-in-javascript-html5
      // and here:
      // https://github.com/SheetJS/js-xlsx/tree/master/demos/xhr
      const stem = file.name.split('.')[0]; // trim off the extension
      this.__foundLabelLibraries[stem] = file;
      loadBinfile(file.url, (data) => {
        const unit8array = new Uint8Array(data);
        const workbook = XLSX.read(unit8array, {
          type: 'array',
        });

        const json = {};
        workbook.SheetNames.forEach(function (sheetName) {
          // Here is your object
          const rows = XLSX.utils.sheet_to_row_object_array(workbook.Sheets[sheetName]);
          rows.forEach(function (row) {
            const identifier = row.Identifier;
            delete row.Identifier;
            json[identifier] = row;
          });
        });

        this.__labelLibraries[stem] = json;
        this.emit('labelLibraryLoaded', { library: stem });
      });
    }
  }

  /**
   * Checks if the library is found.
   * @param {string} name - The name of the library.
   * @return {boolean} - Returns true if the library is found.
   */
  isLibraryFound(name) {
    return name in this.__foundLabelLibraries
  }

  /**
   * Checks if the library is loaded.
   * @param {string} name - The name of the library.
   * @return {boolean} - Returns true if the library is loaded.
   */
  isLibraryLoaded(name) {
    return name in this.__labelLibraries
  }

  /**
   * The getLabelText method.
   * @param {string} libraryName - The name of the library.
   * @param {string} labelName - The name of the label.
   * @return {string} - The return value.
   */
  getLabelText(libraryName, labelName) {
    const library = this.__labelLibraries[libraryName];
    if (!library) {
      throw new Error(
        "LabelLibrary: '" +
          libraryName +
          "' not found in LabelManager. Found: [" +
          Object.keys(this.__labelLibraries) +
          ']'
      )
    }
    const label = library[labelName];
    if (!label) {
      throw new Error(
        "Label: '" +
          labelName +
          "' not found in LabelLibrary: '" +
          libraryName +
          "'. Found: [" +
          Object.keys(library) +
          ']'
      )
    }
    const labelText = label[this.__language];
    if (!labelText) {
      if (label['En']) return label['En']
      throw new Error("labelText: '" + language + "' not found in Label. Found: [" + Object.keys(label) + ']')
    }
    return labelText
  }

  /**
   * The setLabelText method.
   * @param {string} libraryName - The name of the library.
   * @param {string} labelName - The name of the label.
   * @param {string} labelText - The text of the label.
   */
  setLabelText(libraryName, labelName, labelText) {
    let library = this.__labelLibraries[libraryName];
    if (!library) {
      library = {};
      this.__labelLibraries[libraryName] = library;
    }
    let label = library[labelName];
    if (!label) {
      label = {};
      library[labelName] = label;
    }
    label[this.__language] = labelText;
    // TODO: Push to server.
  }

  setLanguage(ln) {
    this.__language = ln;
  }
}

const labelManager = new LabelManager();

/* eslint-disable guard-for-in */

// http://stackoverflow.com/questions/1255512/how-to-draw-a-rounded-rectangle-on-html-canvas
/**
 * Draws a rounded rectangle using the current state of the canvas.
 * If you omit the last three params, it will draw a rectangle
 * outline with a 5 pixel border radius
 * @param {CanvasRenderingContext2D} ctx
 * @param {Number} x - The top left x coordinate
 * @param {Number} y - The top left y coordinate
 * @param {Number} width - The width of the rectangle
 * @param {Number} height - The height of the rectangle
 * @param {Number} [radius = 5] - The corner radius; It can also be an object
 *                 to specify different radii for corners
 * @param {Number} [radius.tl = 0] - Top left
 * @param {Number} [radius.tr = 0] - Top right
 * @param {Number} [radius.br = 0] - Bottom right
 * @param {Number} [radius.bl = 0] - Bottom left
 * @param {Boolean} [fill = false] - Whether to fill the rectangle.
 * @param {Boolean} [stroke = true] - Whether to stroke the rectangle.
 * @param {Number} [strokeWidth] - The strokeWidth param.
 * @private
 */
function roundRect(ctx, x, y, width, height, radius, fill, stroke, strokeWidth) {
  if (typeof stroke == 'undefined') {
    stroke = true;
  }
  if (typeof radius === 'undefined') {
    radius = 5;
  }
  if (typeof radius === 'number') {
    radius = {
      tl: radius,
      tr: radius,
      br: radius,
      bl: radius,
    };
  } else {
    const defaultRadius = {
      tl: 0,
      tr: 0,
      br: 0,
      bl: 0,
    };
    for (const side in defaultRadius) {
      radius[side] = radius[side] || defaultRadius[side];
    }
  }
  ctx.beginPath();
  ctx.moveTo(x + radius.tl, y);
  ctx.lineTo(x + width - radius.tr, y);
  ctx.quadraticCurveTo(x + width, y, x + width, y + radius.tr);
  ctx.lineTo(x + width, y + height - radius.br);
  ctx.quadraticCurveTo(x + width, y + height, x + width - radius.br, y + height);
  ctx.lineTo(x + radius.bl, y + height);
  ctx.quadraticCurveTo(x, y + height, x, y + height - radius.bl);
  ctx.lineTo(x, y + radius.tl);
  ctx.quadraticCurveTo(x, y, x + radius.tl, y);
  ctx.closePath();
  if (fill) {
    ctx.fill();
  }
  if (stroke) {
    ctx.lineWidth = strokeWidth;
    ctx.stroke();
  }
}

/**
 * Represents a 2D label item the scene.
 * Since displaying text in the scene is not an easy task,
 * we've abstracted the complicated logic behind this class, transforming any text into a 2D image(`DataImage`).
 *
 * **Library List**
 * * LabelPack
 *
 * **Parameters**
 * * **Library(`StringParameter`):** Library you wan to use for your label, see **Library List** above.
 * * **Text(`StringParameter`):**
 * * **FontColor(`ColorParameter`):**
 * * **Margin(`NumberParameter`):**
 * * **BorderWidth(`NumberParameter`):**
 * * **BorderRadius(`NumberParameter`):**
 * * **Outline(`BooleanParameter`):**
 * * **OutlineColor(`BooleanParameter`):**
 * * **Background(`BooleanParameter`):**
 * * **ColorParameter(`BackgroundColor`):**
 * * **FillBackground(`BooleanParameter`):**
 * * **StrokeBackgroundOutline(`BooleanParameter`):**
 * * **FontSize(`NumberParameter`):** Represents FontSize of the label
 * * **Font(`StringParameter`):**
 *
 * **Events**
 * * **loaded:** Triggered when label's data is loaded.
 * * **updated:** Triggered when label's data changes.
 * * **labelRendered:** Triggered when the text image is rendered. Contains `width`, `height` and data of the image.
 *
 * @extends DataImage
 */
class Label extends DataImage {
  /**
   * Creates a label instance. Creating a canvas element that hosts the specified text.
   *
   * @param {string} name - The name value.
   * @param {string} library - The library value.
   */
  constructor(name, library) {
    super(name);

    this.__canvasElem = document.createElement('canvas');
    const fontSize = 22;

    const libraryParam = this.addParameter(new StringParameter('Library'));
    this.addParameter(new StringParameter('Text', ''));
    // or load the label when it is loaded.

    // const setLabelTextToLibrary = ()=>{
    //     const library = libraryParam.getValue();
    //     const name = this.getName();
    //     const text = textParam.getValue();
    //     labelManager.setLabelTextToLibrary(library, name, text);
    // }
    // textParam.on('valueChanged', setLabelText);

    this.addParameter(new ColorParameter('FontColor', new Color(0, 0, 0)));
    // this.addParameter(new StringParameter('TextAlign', 'left'))
    // this.addParameter(MultiChoiceParameter('TextAlign', 0, ['left', 'right']));
    // this.addParameter(new BooleanParameter('FillText', true))
    this.addParameter(new NumberParameter('Margin', fontSize * 0.5));
    this.addParameter(new NumberParameter('BorderWidth', 2));
    this.addParameter(new NumberParameter('BorderRadius', fontSize * 0.5));
    this.addParameter(new BooleanParameter('Outline', false));
    this.addParameter(new BooleanParameter('OutlineColor', new Color(0, 0, 0)));
    this.addParameter(new BooleanParameter('Background', true));
    this.addParameter(new ColorParameter('BackgroundColor', new Color('#FBC02D')));
    this.addParameter(new BooleanParameter('FillBackground', true));
    this.addParameter(new BooleanParameter('StrokeBackgroundOutline', true));
    this.addParameter(new NumberParameter('FontSize', 22));
    this.addParameter(new StringParameter('Font', 'Helvetica'));

    const reload = () => {
      this.loadLabelData();
    };
    this.on('nameChanged', reload);

    if (library) libraryParam.setValue(library);

    this.__requestedRerender = false;
    this.__needsRender = false;
    this.loadLabelData();
  }

  /**
   * This method can be overridden in derived classes
   * to perform general updates (see GLPass or BaseItem).
   *
   * @param {object} event - The event object.
   * @private
   */
  __parameterValueChanged(event) {
    super.__parameterValueChanged(event);
    if (!this.__requestedRerender) {
      this.__requestedRerender = true;
      this.loadLabelData();
    }
  }

  /**
   * Method in charge of basically do everything, set text, load/update it, get the library, load the font, etc.
   */
  loadLabelData() {
    const onLoaded = () => {
      this.__requestedRerender = false;
      this.__needsRender = true;
      if (!this.__loaded) {
        this.__loaded = true;
        this.emit('loaded', {});
      } else {
        this.emit('updated', {});
      }
    };

    const loadText = () => {
      return new Promise((resolve) => {
        const library = this.getParameter('Library').getValue();
        if (library == '') {
          resolve();
          return
        }
        if (!labelManager.isLibraryFound(library)) {
          console.warn('Label Libary not found:', library);
          resolve();
          return
        }
        const getLibraryText = () => {
          try {
            const name = this.getName();
            // console.log("Text Loaded:" + name);
            const text = labelManager.getLabelText(library, name);
            this.getParameter('Text').setValue(text);
          } catch (e) {
            // Note: if the text is not found in the labels pack
            // an exception is thrown, and we catch it here.
            console.warn(e);
          }
          resolve();
        };
        if (!labelManager.isLibraryLoaded(library)) {
          labelManager.on('labelLibraryLoaded', (event) => {
            const loadedLibrary = event.library;
            if (loadedLibrary == library) getLibraryText();
          });
        } else {
          getLibraryText();
        }
      })
    };
    const loadFont = () => {
      return new Promise((resolve) => {
        if (document.fonts != undefined) {
          const font = this.getParameter('Font').getValue();
          const fontSize = this.getParameter('FontSize').getValue();
          document.fonts.load(fontSize + 'px "' + font + '"').then(() => {
            // console.log("Font Loaded:" + font);
            resolve();
          });
        } else {
          resolve();
        }
      })
    };
    Promise.all([loadText(), loadFont()]).then(onLoaded);
  }

  /**
   * Renders the label text to a canvas element ready to display.
   * Here is where all parameters are applied to the canvas containing the text,
   * then the image data is extracted from the canvas context.
   */
  renderLabelToImage() {
    // console.log("renderLabelToImage")
    const ctx2d = this.__canvasElem.getContext('2d', {
      alpha: true,
    });

    let text = this.getParameter('Text').getValue();
    if (text == '') text = this.getName();

    const font = this.getParameter('Font').getValue();
    const fontColor = this.getParameter('FontColor').getValue();
    const textAlign = 'left'; // this.getParameter('TextAlign').getValue()
    const fontSize = this.getParameter('FontSize').getValue();
    const margin = this.getParameter('Margin').getValue();
    const borderWidth = this.getParameter('BorderWidth').getValue();
    const borderRadius = this.getParameter('BorderRadius').getValue();
    const outline = this.getParameter('Outline').getValue();
    const outlineColor = this.getParameter('OutlineColor').getValue();
    const background = this.getParameter('Background').getValue();
    const backgroundColor = this.getParameter('BackgroundColor').getValue();
    const fillBackground = this.getParameter('FillBackground').getValue();
    const strokeBackgroundOutline = this.getParameter('StrokeBackgroundOutline').getValue();

    // let ratio = devicePixelRatio / backingStoreRatio;
    const marginAndBorder = margin + borderWidth;
    const lines = text.split('\n');

    ctx2d.font = fontSize + 'px "' + font + '"';
    // console.log("renderLabelToImage:" + ctx2d.font);
    let width = 0;
    lines.forEach((line) => {
      width = Math.max(ctx2d.measureText(line).width, width);
    });
    const fontHeight = fontSize; // parseInt(fontSize)
    this.width = Math.ceil(width + marginAndBorder * 2);
    this.height = Math.ceil(fontHeight * lines.length + marginAndBorder * 2);
    ctx2d.canvas.width = this.width;
    ctx2d.canvas.height = this.height;
    this.__canvasElem.width = this.width;
    this.__canvasElem.height = this.height;

    // ctx2d.clearRect(0, 0, this.width, this.height);
    ctx2d.fillStyle = 'rgba(0, 0, 0, 0.0)';
    ctx2d.fillRect(0, 0, this.width, this.height);

    if (background) {
      ctx2d.fillStyle = backgroundColor.toHex();
      ctx2d.strokeStyle = outlineColor.toHex();
      roundRect(
        ctx2d,
        borderWidth,
        borderWidth,
        this.width - borderWidth * 2,
        this.height - borderWidth * 2,
        borderRadius,
        fillBackground,
        strokeBackgroundOutline,
        borderWidth
      );
    }

    ctx2d.font = fontSize + 'px "' + font + '"';
    ctx2d.textAlign = textAlign;
    ctx2d.fillStyle = fontColor.toHex();
    ctx2d.textBaseline = 'hanging';
    lines.forEach((line, index) => {
      ctx2d.fillText(line, marginAndBorder, marginAndBorder + index * fontHeight);
    });

    if (outline) {
      ctx2d.strokeStyle = outlineColor.toHex();
      ctx2d.lineWidth = 1.5;
      ctx2d.strokeText(text, marginAndBorder, marginAndBorder);
    }

    this.__data = ctx2d.getImageData(0, 0, this.width, this.height);
    this.__needsRender = false;
    this.emit('labelRendered', {
      width: this.width,
      height: this.height,
      data: this.__data,
    });
  }

  /**
   *  Returns all parameters and class state values(Including data).
   *
   * @return {object} - The return value.
   */
  getParams() {
    if (this.__needsRender) this.renderLabelToImage();
    return super.getParams()
  }

  // ////////////////////////////////////////
  // Persistence

  /**
   * The toJSON method encodes this type as a json object for persistence.
   *
   * @param {object} context - The context value.
   * @return {object} - Returns the json object.
   */
  toJSON(context) {
    const j = super.toJSON(context);
    return j
  }

  /**
   * The fromJSON method decodes a json object for this type.
   *
   * @param {object} j - The json object this item must decode.
   * @param {object} context - The context value.
   */
  fromJSON(j, context) {
    super.fromJSON(j, context);
    this.__getLabelText();
  }
}

Registry.register('Label', Label);

/** Class representing a 2D video stream image.
 * @private
 * @extends BaseImage
 */
class VideoStreamImage2D extends BaseImage {
  /**
   * Create a 2D video stream image.
   */
  constructor() {
    super();
    this.__loaded = false;
  }

  /**
   * The connectWebcam method.
   * @param {number} width - The width of the video.
   * @param {number} height - The height of the video.
   * @param {false} rearCamera - Boolean determining if it is a rear camera or not.
   */
  connectWebcam(width, height, rearCamera = false) {
    const video = {
      width,
      height,
      frameRate: {
        ideal: 60,
        max: 60,
      },
    };
    if (rearCamera) {
      video.facingMode = {
        exact: 'environment',
      };
    } else {
      video.facingMode = {
        facingMode: 'user',
      };
    }

    const domElement = document.createElement('video');
    // TODO - confirm its necessary to add to DOM
    domElement.style.display = 'none';
    domElement.preload = 'auto';
    domElement.crossOrigin = 'anonymous';
    // domElement.crossorigin = true;
    document.body.appendChild(domElement);

    // List cameras and microphones.
    // navigator.mediaDevices.enumerateDevices()
    //     .then((devices)=>{
    //         // devices.forEach((device)=>{
    //         //     if (device.kind == "videoinput") {
    //         //         console.log(device.kind + ": " + device.label + " id = " + device.deviceId);
    //         //         videoinputs.push(device);
    //         //     }
    //         // });

    //     })
    //     .catch(function(err) {
    //         console.log(err.name + ": " + err.message);
    //     });

    navigator.mediaDevices
      .getUserMedia({
        audio: false,
        video,
      })
      .then((mediaStream) => {
        domElement.srcObject = mediaStream;
        domElement.onloadedmetadata = (e) => {
          domElement.play();

          this.width = domElement.videoWidth;
          this.height = domElement.videoHeight;
          console.log('Webcam:[' + this.width + ', ' + this.height + ']');
          this.__data = domElement;
          this.__loaded = true;
          this.emit('loaded', {});

          let prevFrame = 0;
          const frameRate = 60;
          const timerCallback = () => {
            if (domElement.paused || domElement.ended) {
              return
            }
            // Check to see if the video has progressed to the next frame.
            // If so, then we emit and update, which will cause a redraw.
            const currentFrame = Math.floor(domElement.currentTime * frameRate);
            if (prevFrame != currentFrame) {
              this.emit('updated', {});
              prevFrame = currentFrame;
            }
            setTimeout(timerCallback, 20); // Sample at 50fps.
          };
          timerCallback();
        };
      })
      .catch(function (err) {
        /* handle the error */
      });
  }

  /**
   * The setVideoStream method.
   * @param {any} video - The video value.
   */
  setVideoStream(video) {
    this.__loaded = false;
    this.width = video.videoWidth;
    this.height = video.videoHeight;
    this.start();
    this.__data = video;
    this.__loaded = true;
    this.emit('loaded', {});
  }

  // getAudioSource() {
  //     return this.__data;
  // }

  /**
   * The stop method.
   */
  stop() {
    clearInterval(this.__intervalId);
  }

  /**
   * The start method.
   */
  start() {
    this.__intervalId = setInterval(() => {
      this.emit('updated', {});
    }, 20); // Sample at 50fps.
  }

  /**
   * The isLoaded method.
   * @return {boolean} - The return value.
   */
  isLoaded() {
    return this.__loaded
  }

  /**
   * The getParams method.
   * @return {any} - The return value.
   */
  getParams() {
    return {
      type: this.type,
      format: this.format,
      width: this.width,
      height: this.height,
      data: this.__data,
      flipY: this.getParameter('FlipY').getValue(),
    }
  }
}

Registry.register('VideoStreamImage2D', VideoStreamImage2D);

/** Class representing an operator input.
 */
class OperatorInput {
  /**
   * Create an operator input.
   * @param {string} name - The name value.
   */
  constructor(name) {
    this.__name = name;
    this._param = undefined;
    this._paramValueChanged = this._paramValueChanged.bind(this);
  }

  /**
   * The getName method.
   * @return {any} - The return value.
   */
  getName() {
    return this.__name
  }

  /**
   * Sets operator that owns this input. Called by the operator when adding inputs
   * @param {Operator} op - The operator object.
   */
  setOperator(op) {
    this._op = op;
  }

  /**
   * Returns operator that owns this input.
   * @return {Operator} - The operator object.
   */
  getOperator() {
    return this._op
  }

  /**
   * Returns true if this input is connected to a parameter.
   * @return {boolean} - The return value.
   */
  isConnected() {
    return this._param != undefined
  }

  /**
   * The getParam method.
   * @return {any} - The return value.
   */
  getParam() {
    return this._param
  }

  /**
   * @private
   * The handler function for when the input paramter changes.
   * @param {object} event - The event object.
   */
  _paramValueChanged(event) {
    if (this._op) this._op.setDirty(this.__name);
  }

  /**
   * Assigns the Paramter to be used to provide the input value.
   * @param {Parameter} param - The param value.
   */
  setParam(param) {
    if (this._param) {
      this._param.off('valueChanged', this._paramValueChanged);
    }
    this._param = param;
    if (this._param) {
      this._param.on('valueChanged', this._paramValueChanged);
    }
  }

  /**
   * The getValue method.
   * @return {any} - The return value.
   */
  getValue() {
    if (this._param) return this._param.getValue()
  }

  /**
   * The setValue method.
   * @param {any} value - The value param.
   */
  setValue(value) {
    if (this._param) {
      this._param.setValue(value);
    }
  }

  // ////////////////////////////////////////
  // Persistence

  /**
   * The toJSON method encodes this type as a json object for persistence.
   *
   * @param {object} context - The context value.
   * @return {object} - Returns the json object.
   */
  toJSON(context) {
    const paramPath = this._param ? this._param.getPath() : '';
    return {
      name: this.__name,
      paramPath: context && context.makeRelative ? context.makeRelative(paramPath) : paramPath,
    }
  }

  /**
   * The fromJSON method decodes a json object for this type.
   * @param {object} j - The json object this item must decode.
   * @param {object} context - The context value.
   */
  fromJSON(j, context) {
    if (j.paramPath) {
      // Note: the tree should have fully loaded by the time we are loading operators
      // even new items and groups should have been created. Operators and state machines
      // are loaded last.
      context.resolvePath(
        j.paramPath,
        (param) => {
          this.setParam(param);
        },
        (reason) => {
          console.warn("OperatorInput: '" + this.getName() + "'. Unable to connect to:" + j.paramPath);
        }
      );
    }
  }

  /**
   * The detach method is called when an operator is being removed from the scene tree.
   * It removes all connections to parameters in the scene.
   */
  detach() {
    // This function is called when we want to suspend an operator
    // from functioning because it is deleted and on the undo stack.
    // Once operators have persistent connections,
    // we will simply uninstall the output from the parameter.
    if (this._param) {
      this._param.off('valueChanged', this._paramValueChanged);
    }
  }

  /**
   * The reattach method can be called when re-instating an operator in the scene.
   */
  reattach() {
    this.detached = false;
    if (this._param) {
      this._param.on('valueChanged', this._paramValueChanged);
    }
  }
}

/** Class representing an operator output.
 */
class OperatorOutput {
  /**
   * Create an operator output.
   * @param {string} name - The name value.
   * @param {OperatorOutputMode} operatorOutputMode - The mode which the OperatorOutput uses to bind to its target parameter.
   */
  constructor(name, operatorOutputMode = OperatorOutputMode.OP_WRITE) {
    this.__name = name;
    this._mode = operatorOutputMode;
    this._param = undefined;
    this._paramBindIndex = -1;
    this.detached = false;
  }

  /**
   * Returns name of the output.
   * @return {string} - The name string.
   */
  getName() {
    return this.__name
  }

  /**
   * Sets operator that owns this output. Called by the operator when adding outputs
   * @param {Operator} op - The operator object.
   */
  setOperator(op) {
    this._op = op;
  }

  /**
   * Returns operator that owns this output.
   * @return {Operator} - The operator object.
   */
  getOperator() {
    return this._op
  }

  /**
   * Returns mode that the output writes to be parameter. Must be a number from OperatorOutputMode
   * @return {OperatorOutputMode} - The mode value.
   */
  getMode() {
    return this._mode
  }

  /**
   * Returns true if this output is connected to a parameter.
   * @return {boolean} - The return value.
   */
  isConnected() {
    return this._param != undefined
  }

  /**
   * The getParam method.
   * @return {any} - The return value.
   */
  getParam() {
    return this._param
  }

  /**
   * Sets the Parameter for this out put to write to.
   * @param {Parameter} param - The param value.
   */
  setParam(param, index = -1) {
    if (this._param) {
      this._param.unbindOperator(this, index);
    }
    this._param = param;
    if (this._param) {
      this._paramBindIndex = this._param.bindOperatorOutput(this, index);
    }
  }

  /**
   * Returns the index of the binding on the parameter of this OperatorOutput
   * up to date.
   * @return {number} index - The index of the binding on the parameter.
   */
  getParamBindIndex() {
    return this._paramBindIndex
  }

  /**
   * If bindings change on a Parameter, it will call this method to ensure the output index is
   * up to date.
   * @param {number} index - The index of the binding on the parameter.
   */
  setParamBindIndex(index) {
    this._paramBindIndex = index;
  }

  /**
   * Propagates dirty to the connected parameter.
   */
  setDirty() {
    if (this._param) {
      this._param.setDirty(this._paramBindIndex);
    }
  }

  /**
   * The getValue method.
   * @return {any} - The return value.
   */
  getValue() {
    if (this._param) {
      return this._param.getValueFromOp(this._paramBindIndex)
    } else {
      throw new Error('Cannot call getValue on OperatorOutput that is not connected:', this.__name)
    }
  }

  /**
   * When the value on a Parameter is modified by a user by calling 'setValue,
   * then if any operators are bound, the value of the Parameter cannot be modified
   * directly as it is the result of a computation. Instead, the Parameter calls
   * 'backPropagateValue' on the Operator to cause the Operator to handle propagating
   * the value to one or more of its inputs.
   * to its inputs.
   * @param {any} value - The value param.
   * @return {any} - The modified value.
   */
  backPropagateValue(value) {
    if (this._param) {
      value = this._op.backPropagateValue(value, this);
    }
    return value
  }

  /**
   * The setClean method.
   * @param {any} value - The value param.
   */
  setClean(value) {
    if (this._param) {
      this._param.setCleanFromOp(value, this._paramBindIndex);
    }
  }

  // ////////////////////////////////////////
  // Persistence

  /**
   * The toJSON method encodes this type as a json object for persistence.
   * @param {object} context - The context value.
   * @return {object} - Returns the json object.
   */
  toJSON(context) {
    const paramPath = this._param ? this._param.getPath() : '';
    return {
      name: this.__name,
      paramPath: context && context.makeRelative ? context.makeRelative(paramPath) : paramPath,
      paramBindIndex: this._paramBindIndex,
    }
  }

  /**
   * The fromJSON method decodes a json object for this type.
   * @param {object} j - The json object this item must decode.
   * @param {object} context - The context value.
   */
  fromJSON(j, context) {
    if (j.paramPath) {
      // Note: the tree should have fully loaded by the time we are loading operators
      // even new items and groups should have been created. Operators and state machines
      // are loaded last.
      context.resolvePath(
        j.paramPath,
        (param) => {
          this.setParam(param, j.paramBindIndex);
        },
        (reason) => {
          console.warn("OperatorOutput: '" + this.getName() + "'. Unable to connect to:" + j.paramPath);
        }
      );
    }
  }

  /**
   * The detach method is called when an operator is being removed from the scene tree.
   * It removes all connections to parameters in the scene.
   */
  detach() {
    // This function is called when we want to suspend an operator
    // from functioning because it is deleted and on the undo stack.
    // Once operators have persistent connections,
    // we will simply uninstall the output from the parameter.
    this.detached = true;
    this._paramBindIndex = this._param.unbindOperator(this);
  }

  /**
   * The reattach method can be called when re-instating an operator in the scene.
   */
  reattach() {
    this.detached = false;
    this._paramBindIndex = this._param.bindOperatorOutput(this, this._paramBindIndex);
  }

  /**
   * The rebind rebinds the outputs to be at the top of the stack for its parameter.
   */
  rebind() {
    if (this._param) {
      this._param.unbindOperator(this);
      this._paramBindIndex = this._param.bindOperatorOutput(this);
    }
  }
}

/**
 * Class representing an operator.
 *
 * @extends BaseItem
 */
class Operator extends BaseItem {
  /**
   * Create an operator.
   * @param {string} name - The name value.
   */
  constructor(name) {
    super(name);
    this.__inputs = new Map();
    this.__outputs = new Map();
  }

  /**
   * This method sets the state of the operator to dirty which propagates
   * to the outputs of this operator, and which may then propagate to other
   * operators. When the scene is cleaned, which usually is caused by rendering
   * then the chain of operators are cleaned by triggering evaluation.
   * @private
   */
  setDirty() {
    this.__outputs.forEach((output) => output.setDirty());
  }

  /**
   * This method can be overridden in derived classes
   * to perform general updates (see GLPass or BaseItem).
   *
   * @param {object} event
   * @private
   */
  __parameterValueChanged(event) {
    super.__parameterValueChanged(event);
    this.setDirty();
  }

  /**
   * The addInput method.
   * @param {string|OperatorInput} input - The name of the input, or the input object
   * @return {array} - The return value.
   */
  addInput(input) {
    if (typeof input == 'string') input = new OperatorInput(input);
    input.setOperator(this);
    this.__inputs.set(input.getName(), input);
    this.setDirty();
    return input
  }

  /**
   * The removeInput method.
   * @param {string|OperatorInput} input - The name of the input, or the input object
   */
  removeInput(input) {
    if (typeof input == 'string') input = this.getInput(input);
    if (!(input instanceof OperatorInput)) {
      throw new Error('Invalid parameter for removeInput:', input)
    }
    if (input.getParam()) input.setParam(null);
    this.__inputs.delete(input.getName());
  }

  /**
   * Getter for the number of inputs in this operator.
   * @return {number} - Returns the number of inputs.
   */
  getNumInputs() {
    return this.__inputs.size
  }

  /**
   * The getInputByIndex method.
   * @param {number} index - The index value.
   * @return {object} - The return value.
   */
  getInputByIndex(index) {
    return Array.from(this.__inputs.values())[index]
  }

  /**
   * The getInput method.
   * @param {string} name - The name value.
   * @return {OperatorInput} - The return value.
   */
  getInput(name) {
    return this.__inputs.get(name)
  }

  /**
   * The addOutput method.
   * @param {string|OperatorOutput} output - The name of the output, or the output object
   * @return {array} - The return value.
   */
  addOutput(output) {
    if (typeof output == 'string') output = new OperatorOutput(output);
    output.setOperator(this);
    if (this.getOutput(output.getName())) throw new Error(`Operator output already exists ${output.getName()}`)
    this.__outputs.set(output.getName(), output);
    this.setDirty();
    return output
  }

  /**
   * The removeOutput method.
   * @param {string|OperatorOutput} output - The name of the output, or the output object
   */
  removeOutput(output) {
    if (typeof output == 'string') output = this.getOutput(output);
    if (!(output instanceof OperatorOutput)) {
      throw new Error('Invalid parameter for removeOutput:', output)
    }
    if (output.getParam()) output.setParam(null);
    this.__outputs.delete(output.getName());
  }

  /**
   * Getter for the number of outputs in this operator.
   * @return {number} - Returns the number of outputs.
   */
  getNumOutputs() {
    return this.__outputs.size
  }

  /**
   * The getOutputByIndex method.
   * @param {number} index - The index value.
   * @return {object} - The return value.
   */
  getOutputByIndex(index) {
    return Array.from(this.__outputs.values())[index]
  }

  /**
   * The getOutput method.
   * @param {string} name - The name value.
   * @return {OperatorOutput} - The return value.
   */
  getOutput(name) {
    return this.__outputs.get(name)
  }

  /**
   * The evaluate method.
   * Computes the values of each of the outputs based on the values of the inputs
   * and the values of outputs with mode OP_READ_WRITE.
   * This method must be implemented by all Operators.
   */
  evaluate() {
    throw new Error('Not yet implemented')
  }

  /**
   * When the value on a Parameter is modified by a user by calling 'setValue,
   * then if any operators are bound, the value of the Parameter cannot be modified
   * directly as it is the result of a computation. Instead, the Parameter calls
   * 'backPropagateValue' on the Operator to cause the Operator to handle propagating
   * the value to one or more of its inputs.
   * to its inputs.
   * @param {any} value - The value param.
   * @return {any} - The modified value.
   */
  backPropagateValue(value) {
    // TODO: Implement me for custom manipulations.
    return value
  }

  // ////////////////////////////////////////
  // Persistence

  /**
   * The toJSON method encodes this type as a json object for persistence.
   *
   * @param {object} context - The context value.
   * @return {object} - Returns the json object.
   */
  toJSON(context) {
    const j = super.toJSON(context);
    j.type = Registry.getBlueprintName(this);

    const inputs = [];
    this.__inputs.forEach((input) => {
      inputs.push(input.toJSON(context));
    });
    j.inputs = inputs;

    const outputs = [];
    this.__outputs.forEach((output) => {
      outputs.push(output.toJSON(context));
    });
    j.outputs = outputs;
    return j
  }

  /**
   * The fromJSON method decodes a json object for this type.
   *
   * @param {object} j - The json object this item must decode.
   * @param {object} context - The context value.
   */
  fromJSON(j, context) {
    super.fromJSON(j, context);

    if (j.inputs) {
      j.inputs.forEach((inputJson, index) => {
        let input;
        if (inputJson.name) {
          input = this.getInput(inputJson.name);
          if (!input) {
            input = this.addInput(inputJson.name);
          }
        } else {
          input = this.getInputByIndex(index);
        }
        input.fromJSON(inputJson, context);
      });
    }
    if (j.outputs) {
      j.outputs.forEach((outputJson, index) => {
        let output;
        if (outputJson.name) {
          output = this.getOutput(outputJson.name);
          if (!output) {
            output = this.addOutput(outputJson.name);
          }
        } else {
          output = this.getOutputByIndex(index);
        }
        output.fromJSON(outputJson, context);
      });
    }
  }

  /**
   * The detach method.
   */
  detach() {
    this.__inputs.forEach((input) => input.detach());
    this.__outputs.forEach((output) => output.detach());
  }

  /**
   * The reattach method.
   */
  reattach() {
    this.__inputs.forEach((input) => input.reattach());
    this.__outputs.forEach((output) => output.reattach());
  }

  /**
   * The rebind method.
   */
  rebind() {
    this.__outputs.forEach((output) => output.rebind());
  }
}

/** The operator the calculates the global Xfo of a TreeItem based on its parents GlobalXfo and its own LocalXfo
 * @extends Operator
 * @private
 */
class CalcGlobalXfoOperator extends Operator {
  /**
   * Create a CalcGlobalXfoOperator operator.
   * @param {string} name - The name value.
   */
  constructor(globalXfoParam, localXfoParam) {
    super('CalcGlobalXfoOperator');
    this.addInput(new OperatorInput('ParentGlobal'));
    this.addInput(new OperatorInput('LocalXfo')).setParam(localXfoParam);
    this.addOutput(new OperatorOutput('GlobalXfo')).setParam(globalXfoParam);
  }

  /**
   * The backPropagateValue method inverts the mathematics of the 'evaluate'
   * method so it can propagate the value backwards to its inputs.
   * @param {Xfo} value - the new value being set on the output GlobalXfo
   */
  backPropagateValue(value) {
    const localXfoParam = this.getInput('LocalXfo').getParam();
    const parentGlobalInput = this.getInput('ParentGlobal');
    if (parentGlobalInput.isConnected()) {
      const parentGlobalXfo = parentGlobalInput.getValue();
      localXfoParam.setValue(parentGlobalXfo.inverse().multiply(value));
    } else {
      localXfoParam.setValue(value);
    }
  }

  /**
   * The evaluate method calculates a new global Xfo based on the parents Global Xfo,
   * and the local Xfo value.
   */
  evaluate() {
    const localXfo = this.getInput('LocalXfo').getValue();
    const parentGlobalInput = this.getInput('ParentGlobal');
    const globalXfoOutput = this.getOutput('GlobalXfo');
    if (parentGlobalInput.isConnected()) {
      const parentGlobalXfo = parentGlobalInput.getValue();
      globalXfoOutput.setClean(parentGlobalXfo.multiply(localXfo), this);
    } else {
      globalXfoOutput.setClean(localXfo, this);
    }
  }
}

/**
 * Represents a specific type of parameter, that only stores `Box3` values.
 *
 * i.e.:
 * ```javascript
 * const boundingBox = new BoundingBoxParameter('MyBBox', new TreeItem())
 * //'myParameterOwnerItem' is an instance of a 'ParameterOwner' class.
 * // Remember that only 'ParameterOwner' and classes that extend from it can host 'Parameter' objects.
 * myParameterOwnerItem.addParameter(boundingBox)
 * ```
 * @extends Parameter
 */
class BoundingBoxParameter extends Parameter {
  /**
   * Creates an instance of BoundingBoxParameter.
   * @param {string} name - Name of the parameter
   * @param {TreeItem} treeItem - `TreeItem` that contains `Box3` representing the Bounding Box
   */
  constructor(name, treeItem) {
    super(name, new Box3$1(), 'Box3');
    this.treeItem = treeItem;
    this.dirty = true;
  }

  /**
   * Makes parameter value be dirty, so when `getValue` is called,
   * an evaluation is then executed to re-calculate the BoundingBox
   *
   * @memberof BoundingBoxParameter
   */
  setDirty() {
    this.dirty = true;
    this.emit('valueChanged');
  }

  /**
   * Returns bounding box value
   *
   * @return {Box3} - The return value.
   */
  getValue() {
    if (this.dirty) {
      this.__value = this.treeItem._cleanBoundingBox(this.__value);
    }
    return this.__value
  }
}

let selectionOutlineColor = new Color('#03E3AC');
selectionOutlineColor.a = 0.1;
let branchSelectionOutlineColor = selectionOutlineColor.lerp(new Color('white'), 0.5);
branchSelectionOutlineColor.a = 0.1;

/**
 * Class representing an Item in the scene tree with hierarchy capabilities (has children).
 * It has the capability to add and remove children.
 * <br>
 * <br>
 * **Parameters**
 * * **Visible(`BooleanParameter`):** Shows/Hides the item.
 * * **LocalXfo(`XfoParameter`):** Specifies the offset of this tree item from its parent.
 * * **GlobalXfo(`XfoParameter`):** Provides the computed world Xfo of this tree item.
 * * **BoundingBox(`BoundingBox`):** Provides the bounding box for the tree item and all of its children in the 3d scene.
 *
 * **Events**
 * * **globalXfoChanged:** _todo_
 * * **visibilityChanged:** _todo_
 * * **highlightChanged:** _todo_
 * * **childAdded:** Emitted when a item is added as a child.
 * * **childRemoved:** Emitted when an item is removed from the child nodes.
 * * **mouseDown:** Emitted when a mouseDown event happens in an item.
 * * **mouseUp:** Emitted when a mouseUp event happens in an item.
 * * **mouseMove:** Emitted when a mouseMove event happens in an item.
 * * **mouseEnter:** Emitted when a mouseEnter event happens in an item.
 *
 * @extends {BaseItem}
 */
class TreeItem extends BaseItem {
  /**
   * Creates a tree item with the specified name.
   *
   * @param {string} name - The name of the tree item. It's the identifier of the tree item.
   * It's an identifier intended to be human readable.
   * It's included in the path that we use to access a particular item.
   * It's used to display it in the tree.
   */
  constructor(name) {
    super(name);

    this.__visibleCounter = 1; // Visible by Default.
    this.__visible = true;
    this.__highlightMapping = {};
    this.__highlights = [];

    this.__childItems = [];
    this.__childItemsEventHandlers = [];
    this.__childItemsMapping = {};

    this.onMouseDown = this.onMouseDown.bind(this);
    this.onMouseUp = this.onMouseUp.bind(this);
    this.onMouseMove = this.onMouseMove.bind(this);
    this.onMouseEnter = this.onMouseEnter.bind(this);
    this.onMouseLeave = this.onMouseLeave.bind(this);

    // /////////////////////////////////////
    // Add parameters.

    this.__visibleParam = this.addParameter(new BooleanParameter('Visible', true));
    this.__localXfoParam = this.addParameter(new XfoParameter('LocalXfo', new Xfo()));
    this.__globalXfoParam = this.addParameter(new XfoParameter('GlobalXfo', new Xfo()));
    this.__boundingBoxParam = this.addParameter(new BoundingBoxParameter('BoundingBox', this));

    // Bind handlers
    this._setBoundingBoxDirty = this._setBoundingBoxDirty.bind(this);
    this._childNameChanged = this._childNameChanged.bind(this);

    this.globalXfoOp = new CalcGlobalXfoOperator(this.__globalXfoParam, this.__localXfoParam);
    this.__globalXfoParam.on('valueChanged', (event) => {
      this._setBoundingBoxDirty();
      // Note: deprecate this event.
      this.emit('globalXfoChanged', event);
    });

    this.__visibleParam.on('valueChanged', () => {
      this.__visibleCounter += this.__visibleParam.getValue() ? 1 : -1;
      this.__updateVisibility();
    });

    // Note: one day we will remove the concept of 'selection' from the engine
    // and keep it only in UX. to Select an item, we will add it to the selection
    // in the selection manager. Then the selection group will apply a highlight.
    this.on('selectedChanged', () => {
      if (this.__selected) {
        this.addHighlight('selected', selectionOutlineColor, true);
      } else {
        this.removeHighlight('selected', true);
      }
    });
  }

  /**
   * Returns the selection outline color.
   *
   * @return {Color} - Returns a color.
   */
  static getSelectionOutlineColor() {
    return selectionOutlineColor
  }

  /**
   * Sets the selection outline color.
   *
   * @param {Color} color - The color value.
   */
  static setSelectionOutlineColor(color) {
    selectionOutlineColor = color;
  }

  /**
   * Returns the branch selection outline color.
   *
   * @return {Color} - Returns a color.
   */
  static getBranchSelectionOutlineColor() {
    return branchSelectionOutlineColor
  }

  /**
   * Sets the branch selection outline color.
   *
   * @param {Color} color - The color value.
   */
  static setBranchSelectionOutlineColor(color) {
    branchSelectionOutlineColor = color;
  }

  // Parent Item

  /**
   * Sets the owner (another TreeItem) of the current TreeItem.
   * @param {TreeItem} parentItem - The parent item.
   */
  setOwner(parentItem) {
    if (this.__ownerItem) {
      // this.__ownerItem.off('globalXfoChanged', this._setGlobalXfoDirty)

      // The effect of the invisible owner is removed.
      if (!this.__ownerItem.isVisible()) this.__visibleCounter++;
      const index = this.__ownerItem.getChildIndex(this);
      if (index >= 0) this.__ownerItem.__unbindChild(index, this);
    }

    super.setOwner(parentItem);

    // this._setGlobalXfoDirty()
    if (this.__ownerItem) {
      this.setSelectable(this.__ownerItem.getSelectable(), true);

      // The effect of the invisible owner is added.
      if (!this.__ownerItem.isVisible()) this.__visibleCounter--;

      this.globalXfoOp.getInput('ParentGlobal').setParam(this.__ownerItem.getParameter('GlobalXfo'));
      // this.__ownerItem.on('globalXfoChanged', this._setGlobalXfoDirty)
    } else {
      this.globalXfoOp.getInput('ParentGlobal').setParam(null);
    }

    this.__updateVisibility();
  }

  /**
   * The __updatePath method.
   * @private
   */
  __updatePath() {
    super.__updatePath();
    for (const childItem of this.__childItems) {
      if (childItem) childItem.__updatePath();
    }
  }

  /**
   * Returns the parent of current TreeItem.
   *
   * @return {TreeItem|undefined} - Returns the parent item.
   */
  getParentItem() {
    return this.getOwner()
  }

  /**
   * Sets the parent of current TreeItem.
   *
   * @param {TreeItem} parentItem - The parent item.
   */
  setParentItem(parentItem) {
    this.setOwner(parentItem);
  }

  // ////////////////////////////////////////
  // Global Matrix

  /**
   * @deprecated
   * Returns the value of local Xfo transform parameter.
   *
   * @return {Xfo} - Returns the local Xfo.
   */
  getLocalXfo() {
    console.warn(`Deprecated. use "getParameter('LocalXfo').getValue()"`);
    return this.__localXfoParam.getValue()
  }

  /**
   * @deprecated
   * Sets the local Xfo transform parameter.
   *
   * @param {Xfo} xfo - The local xfo transform.
   */
  setLocalXfo(xfo) {
    console.warn(`Deprecated. use "getParameter('LocalXfo').setValue(xfo)"`);
    this.__localXfoParam.setValue(xfo);
  }

  /**
   * @deprecated
   * Returns the global Xfo transform.
   *
   * @return {Xfo} - Returns the global Xfo.
   */
  getGlobalXfo() {
    console.warn(`Deprecated. use "getParameter('GlobalXfo').getValue()"`);
    return this.__globalXfoParam.getValue()
  }

  /**
   * @deprecated
   * Sets the global Xfo transform.
   * @param {Xfo} xfo - The global xfo transform.
   */
  setGlobalXfo(xfo) {
    console.warn(`Deprecated. use "getParameter('GlobalXfo').setValue(xfo)"`);
    this.__globalXfoParam.setValue(xfo);
  }

  // ////////////////////////////////////////
  // Visibility

  /**
   * @deprecated
   * Returns visible parameter value for current TreeItem.
   *
   * @return {boolean} - The visible param value.
   */
  getVisible() {
    console.warn('Deprecated. Use #isVisible');
    return this.isVisible()
  }

  /**
   * Returns visible parameter value for current TreeItem.
   *
   * @return {boolean} - The visible param value.
   */
  isVisible() {
    // Should never be more than 1, but can be less than 0.
    return this.__visibleCounter > 0
  }

  /**
   * Sets visible parameter value.
   *
   * @param {number} val - The val param.
   */
  setVisible(val) {
    this.__visibleParam.setValue(val);
  }

  /**
   * Updates current TreeItem visible state and propagates its value to children elements.
   *
   * @param {number} val - The val param.
   */
  propagateVisibility(val) {
    this.__visibleCounter += val;
    this.__updateVisibility();
  }

  /**
   * The __updateVisibility method.
   * @return {boolean} - Returns a boolean.
   * @private
   */
  __updateVisibility() {
    const visible = this.__visibleCounter > 0;
    if (visible != this.__visible) {
      this.__visible = visible;
      for (const childItem of this.__childItems) {
        if (childItem instanceof TreeItem) childItem.propagateVisibility(this.__visible ? 1 : -1);
      }
      this.emit('visibilityChanged', { visible });
      return true
    }
    return false
  }

  // ////////////////////////////////////////
  // Highlights

  /**
   * Adds a hightlight to the tree item.
   *
   * @param {string} name - The name of the tree item.
   * @param {Color} color - The color of the highlight.
   * @param {boolean} propagateToChildren - A boolean indicating whether to propagate to children.
   */
  addHighlight(name, color, propagateToChildren = false) {
    // If the hilight was already in the list,
    // remove it and put it at the top.
    if (name in this.__highlightMapping) {
      const id = this.__highlights.indexOf(name);
      this.__highlights.splice(id, 1);
    }
    this.__highlights.push(name);
    this.__highlightMapping[name] = color;
    this.emit('highlightChanged', { name, color });

    if (propagateToChildren) {
      this.__childItems.forEach((childItem) => {
        if (childItem instanceof TreeItem) childItem.addHighlight(name, color, propagateToChildren);
      });
    }
  }

  /**
   * Removes a hightlight to the tree item.
   *
   * @param {string} name - The name of the tree item.
   * @param {boolean} propagateToChildren - A boolean indicating whether to propagate to children.
   */
  removeHighlight(name, propagateToChildren = false) {
    if (name in this.__highlightMapping) {
      const id = this.__highlights.indexOf(name);
      this.__highlights.splice(id, 1);
      delete this.__highlightMapping[name];
      this.emit('highlightChanged', {});
    }
    if (propagateToChildren) {
      this.__childItems.forEach((childItem) => {
        if (childItem instanceof TreeItem) childItem.removeHighlight(name, propagateToChildren);
      });
    }
  }

  /**
   * Returns the color of the current hilghlight.
   *
   * @return {Color} - The color value.
   */
  getHighlight() {
    if (this.__highlights.length > 0) return this.__highlightMapping[this.__highlights[this.__highlights.length - 1]]
  }

  /**
   * Returns `true` if this items has a hilghlight color assigned.
   *
   * @return {boolean} - `True` if this item is hilghlighted.
   */
  isHighlighted() {
    return this.__highlights.length > 0
  }

  // ////////////////////////////////////////
  // Bounding Box

  /**
   * Getter for a bounding box.
   * @private
   */
  get boundingBox() {
    console.warn("getter is deprecated. Please use 'getBoundingBox'");
    return this.getBoundingBox()
  }

  /**
   * @deprecated
   * Returns bounding box parameter value.
   * @private
   * @return {Box3} - The return value.
   */
  getBoundingBox() {
    console.warn("getter is deprecated. Please use 'getParameter('BoundingBox').getValue()'");
    return this.__boundingBoxParam.getValue()
  }

  /**
   * The _cleanBoundingBox method.
   * @param {Box3} bbox - The bounding box value.
   * @return {Box3} - The return value.
   * @private
   */
  _cleanBoundingBox(bbox) {
    bbox.reset();
    this.__childItems.forEach((childItem) => {
      if (childItem instanceof TreeItem)
        if (childItem.isVisible()) {
          // console.log(" - ", childItem.constructor.name, childItem.getName(), childItem.getParameter('GlobalXfo').getValue().sc.x, childItem.getBoundingBox().toString())
          bbox.addBox3(childItem.getParameter('BoundingBox').getValue());
        }
    });
    // console.log(this.getName(), bbox.toString())
    return bbox
  }

  /**
   * The _childBBoxChanged method.
   * @private
   */
  _childBBoxChanged() {
    this._setBoundingBoxDirty();
  }

  /**
   * The _setBoundingBoxDirty method.
   * @private
   */
  _setBoundingBoxDirty() {
    if (this.__boundingBoxParam) {
      // Will cause boundingChanged to emit
      this.__boundingBoxParam.setDirty();
    }
  }

  // ////////////////////////////////////////
  // Children

  /**
   * Returns children list, but children are not required to have hierarchy structure(`TreeItem`).
   * Meaning that it could be another kind of item than `TreeItem`.
   * <br>
   * i.e. **BaseImage**
   *
   * @return {array} - List of `BaseItem` owned by current TreeItem.
   */
  getChildren() {
    return this.__childItems
  }

  /**
   * Returns the number of child elements current `TreeItem` has.
   *
   * @deprecated since version 0.0.80
   * @return {number} - The return value.
   */
  numChildren() {
    console.warn('Deprecated. Use #getNumChildren');
    return this.__childItems.length
  }

  /**
   * Returns the number of child elements current `TreeItem` has.
   *
   * @return {number} - The return value.
   */
  getNumChildren() {
    return this.__childItems.length
  }

  /**
   * Verifies if there's a child with the specified name.
   * If there's one, modifiers are applied to the name and returned.
   *
   * @param {string} name - The name value.
   * @return {string} - Returns a unique name.
   */
  generateUniqueName(name) {
    if (!(name in this.__childItemsMapping)) return name

    let index = 1;
    if (name.length > 4 && !Number.isNaN(parseInt(name.substring(name.length - 4))))
      index = parseInt(name.substr(name.length - 4));
    else if (name.length > 3 && !Number.isNaN(parseInt(name.substring(name.length - 3))))
      index = parseInt(name.substr(name.length - 3));
    else if (name.length > 2 && !Number.isNaN(parseInt(name.substring(name.length - 2))))
      index = parseInt(name.substr(name.length - 2));

    const names = [];
    for (const c of this.__childItems) {
      // Sometimes we have an empty child slot.
      // We resize the child vector, and then populate it.
      if (c) {
        names.push(c.getName());
      }
    }

    let uniqueName = name;
    while (true) {
      let suffix = '' + index;
      while (suffix.length < 2) {
        suffix = '0' + suffix;
      }

      uniqueName = name + suffix;
      if (names.indexOf(uniqueName) == -1) break
      index++;
    }
    return uniqueName
  }

  /**
   * The __updateMapping method.
   * @param {any} start - The start value.
   * @private
   */
  __updateMapping(start) {
    // If a child has been added or removed from the
    // tree item, we need to update the acceleration structure.
    for (let i = start; i < this.__childItems.length; i++) {
      this.__childItemsMapping[this.__childItems[i].getName()] = i;
    }
  }

  /**
   * The _childNameChanged event hander.
   * @param {any} start - The start value.
   * @private
   */
  _childNameChanged(event) {
    // Update the acceleration structure.
    const index = this.__childItemsMapping[event.oldName];
    delete this.__childItemsMapping[event.oldName];
    this.__childItemsMapping[event.newName] = index;
  }

  /**
   * Inserts a child. It accepts all kind of `BaseItem`, not only `TreeItem`.
   *
   * @param {BaseItem} childItem - The child BaseItem to insert.
   * @param {number} index - The index to add the child item.
   * @param {boolean} maintainXfo - Boolean that determines if the Xfo value is maintained.
   * @param {boolean} fixCollisions - Modify the name of the item to avoid name collisions.
   * If false, an exception wll be thrown instead if a name collision occurs.
   * @return {number} - The index of the child item in this items children array.
   */
  insertChild(childItem, index, maintainXfo = false, fixCollisions = true) {
    if (childItem.getName() in this.__childItemsMapping) {
      if (fixCollisions) {
        childItem.setName(this.generateUniqueName(childItem.getName()));
      } else {
        throw new Error("Item '" + childItem.getName() + "' is already a child of :" + this.getPath())
      }
    }
    if (!(childItem instanceof BaseItem)) {
      throw new Error('Object is is not a tree item :' + childItem.constructor.name)
    }

    childItem.on('nameChanged', this._childNameChanged);

    let newLocalXfo;
    if (childItem instanceof TreeItem) {
      if (maintainXfo) {
        const globalXfo = this.getParameter('GlobalXfo').getValue();
        const childGlobalXfo = childItem.getParameter('GlobalXfo').getValue();
        newLocalXfo = globalXfo.inverse().multiply(childGlobalXfo);
      }
      childItem.on('boundingChanged', this._setBoundingBoxDirty);
      childItem.on('visibilityChanged', this._setBoundingBoxDirty);
    }

    this.__childItems.splice(index, 0, childItem);
    this.__childItemsMapping[childItem.getName()] = index;
    this.__updateMapping(index);

    childItem.setOwner(this);

    if (childItem instanceof TreeItem) {
      if (maintainXfo) childItem.getParameter('LocalXfo').setValue(newLocalXfo);
      this._setBoundingBoxDirty();
    }

    this.emit('childAdded', { childItem, index });

    return childItem
  }

  /**
   * Adds a child. It accepts all kind of `BaseItem`, not only `TreeItem`.
   *
   * @param {BaseItem} childItem - The child BaseItem to add.
   * @param {boolean} maintainXfo - Boolean that determines if
   * the Global Xfo value is maintained. If true, when moving
   * items in the hierarchy from one parent to another, the local Xfo
   * of the item will be modified to maintaine and the Global Xfo.
   * Note: this option defaults to false because we expect that is the
   * behavior users would expect when manipulating the tree in code.
   * To be safe and unambiguous, always try to specify this value.
   * @param {boolean} fixCollisions - Modify the name of the item to avoid
   * name collisions with other chidrent of the same parent.
   * If false, an exception wll be thrown instead if a name collision occurs.
   * @return {BaseItem} childItem - The child BaseItem that was added.
   */
  addChild(childItem, maintainXfo = true, fixCollisions = true) {
    const index = this.__childItems.length;
    this.insertChild(childItem, index, maintainXfo, fixCollisions);
    return childItem
  }

  /**
   * Returns child element in the specified index.
   *
   * @param {number} index - The index to remove the child TreeItem.
   * @return {BaseItem|undefined} - Return the child TreeItem.
   */
  getChild(index) {
    return this.__childItems[index]
  }

  /**
   * Returns child element with the specified name.
   *
   * @param {string} name - The name value.
   * @return {BaseItem|null} - Return the child BaseItem.
   */
  getChildByName(name) {
    const index = this.__childItemsMapping[name];
    if (index != undefined) {
      return this.__childItems[index]
    }
    return null
  }

  /**
   * Returns children names as an array of strings.
   *
   * @return {array} - An array of names for each child.
   */
  getChildNames() {
    const names = [];
    for (let i = 0; i < this.__childItems.length; i++) {
      const childItem = this.__childItems[i];
      if (childItem != null) names[i] = childItem.getName();
    }
    return names
  }

  /**
   * UnBind an item from the group. This method is called
   * automatically when an item is removed from the group.
   * @param {number} index - The index value.
   * @param {TreeItem} childItem - item to unbind.
   * @private
   */
  __unbindChild(index, childItem) {
    childItem.off('nameChanged', this._childNameChanged);

    if (childItem instanceof TreeItem) {
      childItem.off('boundingChanged', this._setBoundingBoxDirty);
      childItem.off('visibilityChanged', this._setBoundingBoxDirty);
    }

    this.__childItems.splice(index, 1);
    this.__childItemsEventHandlers.splice(index, 1);
    delete this.__childItemsMapping[childItem.getName()];
    this.__updateMapping(index);

    if (childItem instanceof TreeItem) {
      this._setBoundingBoxDirty();
    }

    this.emit('childRemoved', { childItem, index });
  }

  /**
   * Removes a child BaseItem by specifying its index.
   *
   * @param {number} index - The index value.
   */
  removeChild(index) {
    const childItem = this.__childItems[index];

    if (!childItem) {
      return
    }

    this.__unbindChild(index, childItem);
    childItem.setOwner(undefined);
  }

  /**
   * Removes a child BaseItem by specifying its name.
   *
   * @param {string} name - The name param.
   * @return {BaseItem} - Return the child TreeItem.
   */
  removeChildByName(name) {
    const index = this.__childItemsMapping[name];
    if (index != undefined) {
      return this.removeChild(index)
    }
    return null
  }

  /**
   * @deprecated
   *
   * @param {BaseItem} childItem - The child TreeItem to remove.
   */
  removeChildByHandle(childItem) {
    console.warn('Deprecated. Use #removeChild');
    const index = this.__childItems.indexOf(childItem);
    if (index == -1) throw new Error('Error in removeChildByHandle. Child not found:' + childItem.getName())
    this.removeChild(index);
  }

  /**
   * Removes all children Items.
   */
  removeAllChildren() {
    let index = this.__childItems.length;
    while (index--) {
      this.removeChild(index);
    }
    this._setBoundingBoxDirty();
  }

  /**
   * Returns index position of the specified item.
   *
   * @param {BaseItem} childItem - The child TreeItem value.
   * @return {number} - Child index in children array.
   */
  getChildIndex(childItem) {
    return this.__childItems.indexOf(childItem)
  }

  /**
   * @deprecated
   * Returns index position of the specified item.
   *
   * @param {object} childItem - The child TreeItem value.
   * @return {number} - The return value.
   */
  indexOfChild(childItem) {
    console.warn('Deprecated Use #getChildIndex');
    return this.getChildIndex(childItem)
  }

  // ////////////////////////////////////////
  // Path Traversial
  // Note: Path resolution starts at the root of the
  // tree the path was generated from (so index=1, because we don't resolve root).
  // Note: When a path is made relative to an item in its tree, the path
  // starts with the child elements.

  /**
   * The resolvePath method traverses the subtree from this item down
   * matching each name in the path with a child until it reaches the
   * end of the path.
   *
   * @param {array} path - The path value.
   * @param {number} index - The index value.
   * @return {BaseItem|Parameter} - The return value.
   */
  resolvePath(path, index = 0) {
    if (typeof path == 'string') path = path.split('/');

    if (index == 0) {
      if (path[0] == '.' || path[0] == this.__name) index++;
      else if (path[0] == '..') {
        return this.__ownerItem.resolvePath(path, index + 1)
      }
    }

    if (index == path.length) {
      return this
    }

    // if (path[index] == '>' && index == path.length - 2) {
    //   if (this.hasComponent(path[index + 1])) {
    //     const component = this.getComponent(path[index + 1])
    //     return component.resolvePath(path, index + 2)
    //   }
    // }

    const childName = path[index];
    const childItem = this.getChildByName(childName);
    if (childItem == undefined) {
      // Maybe the name is a component name.
      // if (this.hasComponent(path[index])) {
      //   const component = this.getComponent(path[index])
      //   if (index == path.length) {
      //     return component
      //   } else {
      //     return component.resolvePath(path, index + 1)
      //   }
      // }

      // Maybe the name is a parameter name.
      const param = this.getParameter(path[index]);
      if (param) {
        return param
      }

      // Note: consuming code should generate errors if necssary.
      // In some cases, this _should_ return null and errors messages ares imply distracting.
      // report("Unable to resolve path '"+"/".join(path)+"' after:"+this.getName());
      // console.warn("Unable to resolve path :" + (path) + " after:" + this.getName() + "\nNo child, component or property called :" + path[index]);
      return null
    }
    return childItem.resolvePath(path, index + 1)
  }

  /**
   * Traverse the tree structure from this point down
   * and fire the callback for each visited item.
   * Note: Depth only used by selection sets for now.
   *
   * @param {function} callback - The callback value.
   * @param {boolean} includeThis - Fire the callback for this item.
   */
  traverse(callback, includeThis = true) {
    const __c = (treeItem, depth) => {
      const children = treeItem.getChildren();
      for (const childItem of children) {
        if (childItem) __t(childItem, depth + 1);
      }
    };

    const __t = (treeItem, depth) => {
      if (callback(treeItem, depth) == false) return false
      if (treeItem instanceof TreeItem) __c(treeItem, depth);
    };

    if (includeThis) {
      __t(this, 1);
    } else {
      __c(this, 0);
    }
  }

  // ///////////////////////
  // Events

  /**
   * Causes an event to occur when a user presses a mouse button over an element.
   *
   * @param {MouseEvent} event - The mouse event that occurs.
   */
  onMouseDown(event) {
    this.emit('mouseDown', event);
    if (event.propagating && this.__ownerItem) {
      this.__ownerItem.onMouseDown(event);
    }
  }

  /**
   * Causes an event to occur when a user releases a mouse button over a element.
   *
   * @param {MouseEvent} event - The mouse event that occurs.
   */
  onMouseUp(event) {
    this.emit('mouseUp', event);
    if (event.propagating && this.__ownerItem) {
      this.__ownerItem.onMouseUp(event);
    }
  }

  /**
   * Causes an event to occur when the mouse pointer is moving while over an element.
   *
   * @param {MouseEvent} event - The mouse event that occurs.
   */
  onMouseMove(event) {
    this.emit('mouseMove', event);
    if (event.propagating && this.__ownerItem) {
      this.__ownerItem.onMouseMove(event);
    }
  }

  /**
   * Causes an event to occur when the mouse pointer is moved onto an element.
   *
   * @param {MouseEvent} event - The mouse event that occurs.
   */
  onMouseEnter(event) {
    this.emit('mouseEnter', event);
    if (event.propagating && this.__ownerItem) {
      this.__ownerItem.onMouseEnter(event);
    }
  }

  /**
   * Causes an event to occur when the mouse pointer is moved out of an element.
   *
   * @param {MouseEvent} event - The mouse event that occurs.
   */
  onMouseLeave(event) {
    this.emit('mouseLeave', event);
    if (event.propagating && this.__ownerItem) {
      this.__ownerItem.onMouseLeave(event);
    }
  }

  /**
   * Causes an event to occur when the mouse wheel is rolled up or down over an element.
   *
   * @param {WheelEvent } event - The wheel event that occurs.
   */
  onWheel(event) {
    if (event.propagating && this.__ownerItem) {
      this.__ownerItem.onWheel(event);
    }
  }

  // ////////////////////////////////////////
  // Persistence

  /**
   * The toJSON method serializes this instance as a JSON.
   * It can be used for persistence, data transfer, etc.
   *
   * @param {object} context - The context value.
   * @return {object} - Returns the json object.
   */
  toJSON(context) {
    const j = super.toJSON(context);

    // Some Items, such as the SliderSceneWidget do not need their children
    // to be saved.
    const childItemsJSON = {};
    for (const childItem of this.__childItems) {
      if (childItem) {
        const childJSON = childItem.toJSON(context);
        if (childJSON) childItemsJSON[childItem.getName()] = childJSON;
      }
    }
    if (Object.keys(childItemsJSON).length > 0) {
      if (j) {
        j.children = childItemsJSON;
      } else {
        j = {
          name: this.__name,
          children: childItemsJSON,
        };
      }
    }

    return j
  }

  /**
   * The fromJSON method takes a JSON and deserializes into an instance of this type.
   *
   * @param {object} j - The json object this item must decode.
   * @param {object} context - The context value.
   */
  fromJSON(j, context) {
    super.fromJSON(j, context);

    if (context && !Number.isNaN(context.numTreeItems)) context.numTreeItems++;

    // if ('bbox' in j){
    //     let box = new Box3();
    //     box.fromJSON(j.bbox);
    //     this.__boundingBoxParam.setValue(box);
    // }

    if (j.children != null) {
      const childrenJson = j.children;
      if (Array.isArray(childrenJson)) {
        for (const childJson of childrenJson) {
          // Note: During loading of asset trees, we have an
          // existing tree generated by loading a bin data file.
          let childItem = this.getChildByName(childJson.name);
          if (childItem) {
            childItem.fromJSON(childJson, context);
          } else {
            if (childJson.type) {
              childItem = Registry.constructClass(childJson.type);
              if (childItem) {
                // Note: we should load the json first, as it
                // may contain the unique name of the item.
                childItem.fromJSON(childJson, context);
                this.addChild(childItem, false, false);
              }
            }
          }
        }
      } else {
        // eslint-disable-next-line guard-for-in
        for (const childName in childrenJson) {
          const childJson = childrenJson[childName];
          // Note: During loading of asset trees, we have an
          // existing tree generated by loading a bin data file.
          let childItem = this.getChildByName(childName);
          if (childItem) {
            childItem.fromJSON(childJson, context);
          } else if (childJson.type) {
            childItem = Registry.constructClass(childJson.type);
            if (childItem) {
              // Note: we add the child now before loading.
              // This is because certain items. (e.g. Groups)
              // Calculate thier global Xfo, and use it to modify
              // the transform of thier members.
              // Note: Groups bind to items in the scene which are
              // already added as children, and so have global Xfos.
              // We prefer to add a child afer its loaded, because sometimes
              // In the tree is asset items, who will only toggled as
              // unloaded once they are loaded(else they are considered inline assets.)
              childItem.fromJSON(childJson, context);
              this.addChild(childItem, false, false);
            }
          }
        }
      }
    }

    // if (j.components) {
    //   for (const cj of j.components) {
    //     const component = Registry.constructClass(cj.type ? cj.type : cj.name)
    //     if (component) {
    //       component.fromJSON(cj, context)
    //       this.addComponent(component)
    //     }
    //   }
    // }
  }

  /**
   * Sets state of current Item(Including parameters & children) using a binary reader object.
   *
   * @param {BinReader} reader - The reader value.
   * @param {object} context - The context value.
   */
  readBinary(reader, context) {
    super.readBinary(reader, context);

    context.numTreeItems++;

    const itemflags = reader.loadUInt8();

    // const visibilityFlag = 1 << 1
    // this.setVisible(itemflags&visibilityFlag);

    // Note: to save space, some values are skipped if they are identity values
    const localXfoFlag = 1 << 2;
    if (itemflags & localXfoFlag) {
      const xfo = new Xfo();
      xfo.tr = reader.loadFloat32Vec3();
      xfo.ori = reader.loadFloat32Quat();
      xfo.sc.set(reader.loadFloat32());
      // console.log(this.getPath() + " TreeItem:" + xfo.toString());
      this.__localXfoParam.loadValue(xfo);
    }

    const bboxFlag = 1 << 3;
    if (itemflags & bboxFlag) {
      this.__boundingBoxParam.loadValue(new Box3$1(reader.loadFloat32Vec3(), reader.loadFloat32Vec3()));
    }

    const numChildren = reader.loadUInt32();
    if (numChildren > 0) {
      const toc = reader.loadUInt32Array(numChildren);
      for (let i = 0; i < numChildren; i++) {
        try {
          reader.seek(toc[i]); // Reset the pointer to the start of the item data.
          let childType = reader.loadStr();

          if (childType.startsWith('N') && childType.endsWith('E')) {
            // ///////////////////////////////////////
            // hack to work around a linux issue
            // untill we have a fix.
            const ppos = childType.indexOf('podium');
            if (ppos != -1) {
              if (parseInt(childType[ppos + 7])) childType = childType.substring(ppos + 8, childType.length - 1);
              else childType = childType.substring(ppos + 7, childType.length - 1);
            }
            const lnpos = childType.indexOf('livenurbs');
            if (lnpos != -1) {
              childType = childType.substring(childType.indexOf('CAD'), childType.length - 1);
            }
          }
          // const childName = reader.loadStr();
          const childItem = Registry.constructClass(childType);
          if (!childItem) {
            const childName = reader.loadStr();
            console.warn('Unable to construct child:' + childName + ' of type:' + childType);
            continue
          }
          reader.seek(toc[i]); // Reset the pointer to the start of the item data.
          childItem.readBinary(reader, context);

          this.addChild(childItem, false, false);
        } catch (e) {
          console.warn('Error loading tree item: ', e);
        }
      }
    }
  }

  // ////////////////////////////////////////
  // Clone and Destroy

  /**
   * The clone method constructs a new tree item, copies its values
   * from this item and returns it.
   *
   * @return {TreeItem} - Returns a new cloned tree item.
   */
  clone() {
    const cloned = new TreeItem();
    cloned.copyFrom(this);
    return cloned
  }

  /**
   * Copies current TreeItem with all its children.
   *
   * @param {TreeItem} src - The tree item to copy from.
   */
  copyFrom(src) {
    super.copyFrom(src);

    // Share a local Xfo
    // Note: disabled for now.
    // When cloning instanced trees, the root item should
    // have a unique LocalXfoParam, as it must be re-set.
    // (The root of the tree is a cloned and attached to an Instance node that provides the transform)

    src.getChildren().forEach((srcChildItem) => {
      if (srcChildItem) this.addChild(srcChildItem.clone(), false, false);
    });
  }

  /**
   * The destroy is called by the system to cause explicit resources cleanup.
   * Users should never need to call this method directly.
   */
  destroy() {
    this.removeAllChildren();
    super.destroy();
  }
}

Registry.register('TreeItem', TreeItem);

/* eslint-disable no-unused-vars */

/**
 * TreeItem type of class designed for making duplications of parts of the tree.
 *
 * @extends {TreeItem}
 */
class InstanceItem extends TreeItem {
  /**
   * Create an instance item.
   * @param {string} name - The name of the instance item.
   */
  constructor(name) {
    super(name);
  }

  /**
   * Clones passed in `TreeItem` all the way down and adds it as a child of current item.
   *
   * @param {TreeItem} treeItem - The treeItem value.
   */
  setSrcTree(treeItem, context) {
    this.__srcTree = treeItem;

    const numChildren = this.__srcTree.getNumChildren();
    if (numChildren == 0) {
      const clonedTree = this.__srcTree.clone(context);
      clonedTree.getParameter('LocalXfo').loadValue(new Xfo());
      this.addChild(clonedTree, false);
    } else {
      const children = this.__srcTree.getChildren();
      children.forEach((child) => {
        const clonedChild = child.clone(context);
        this.addChild(clonedChild, false);
      });
    }
  }

  /**
   * Returns the last `TreeItem` cloned.
   *
   * @return {TreeItem} - The return value.
   */
  getSrcTree() {
    return this.__srcTree
  }

  // ////////////////////////////////////////
  // Persistence

  /**
   * Sets state of current Item(Including cloned item) using a binary reader object.
   *
   * @param {BinReader} reader - The reader value.
   * @param {object} context - The context value.
   */
  readBinary(reader, context = {}) {
    super.readBinary(reader, context);

    // console.log("numTreeItems:", context.numTreeItems, " numGeomItems:", context.numGeomItems)
    const path = reader.loadStrArray();
    // console.log("InstanceItem of:", path)
    context.resolvePath(path, (treeItem) => {
      this.setSrcTree(treeItem, context);
    });
  }

  /**
   * The toJSON method encodes this type as a json object for persistence.
   *
   * @param {object} context - The context value.
   * @return {object} - Returns the json object.
   */
  toJSON(context = {}) {
    const j = super.toJSON(context);
    return j
  }

  /**
   * The fromJSON method decodes a json object for this type.
   *
   * @todo Needs to be implemented.
   * @param {object} j - The json object this item must decode.
   * @param {object} context - The context value.
   * @param {function} onDone - The onDone value.
   */
  fromJSON(j, context = {}, onDone) {}
}

Registry.register('InstanceItem', InstanceItem);

/* eslint-disable constructor-super */

/**
 * A special type of `TreeItem` that let you handle audio files.
 * <br>
 * <br>
 * **Parameters**
 * * **FilePath(`FilePathParameter`):**
 * * **Autoplay(`BooleanParameter`):**
 * * **PlayState(`NumberParameter`):**
 * * **Mute(`BooleanParameter`):**
 * * **Gain(`NumberParameter`):**
 * * **Loop(`BooleanParameter):**
 * * **SpatializeAudio(`BooleanParameter`):**
 * * **refDistance(`NumberParameter`):**
 * * **maxDistance(`NumberParameter`):**
 * * **rolloffFactor(`NumberParameter`):**
 * * **coneInnerAngle(`NumberParameter`):**
 * * **coneOuterGain(`NumberParameter`):**
 *
 * **Events**
 * * **loaded**
 * * **audioSourceCreated**
 * @private
 * @extends TreeItem
 */
class AudioItem extends TreeItem {
  /**
   * Create an audio item.
   * @param {string} name - The name of the audio item.
   */
  constructor(name) {
    super(name);

    this.__loaded = false;

    const fileParam = this.addParameter(new FilePathParameter('FilePath'));
    let audioSource;
    let audioBuffer;
    const startAudioPlayback = () => {
      audioSource = window.ZeaAudioaudioCtx.createBufferSource();
      audioSource.buffer = audioBuffer;
      audioSource.loop = loopParam.getValue();
      audioSource.muted = muteParam.getValue();
      audioSource.start(0);
      this.emit('audioSourceCreated', { audioSource });
    };
    fileParam.on('valueChanged', () => {
      const request = new XMLHttpRequest();
      request.open('GET', fileParam.getURL(), true);
      request.responseType = 'arraybuffer';

      request.onload = () => {
        const audioData = request.response;
        // Note: this code is not pretty and should not access the global object
        // However, its difficult to handle this case.
        // TODO: clean this up.
        window.ZeaAudioaudioCtx.decodeAudioData(
          audioData,
          (buffer) => {
            audioBuffer = buffer;
            this.__loaded = true;
            this.emit('loaded', {});
            if (autoplayParam.getValue()) startAudioPlayback();
          },
          (e) => {
            console.log('Error with decoding audio data' + e.err);
          }
        );
      };

      request.send();
    });
    const autoplayParam = this.addParameter(new BooleanParameter('Autoplay', false));
    const playStateParam = this.addParameter(new NumberParameter('PlayState', 0));
    playStateParam.on('valueChanged', (event) => {
      switch (playStateParam.getValue()) {
        case 0:
          if (this.__loaded) {
            if (audioSource) {
              audioSource.stop(0);
              audioSource = undefined;
            }
          }
          break
        case 1:
          if (this.__loaded) {
            startAudioPlayback();
          }
          break
      }
    });

    this.isPlaying = () => {
      return playStateParam.getValue() != 0
    };

    this.play = () => {
      playStateParam.setValue(1);
    };
    this.stop = () => {
      playStateParam.setValue(0);
    };
    this.pause = () => {
      playStateParam.setValue(0);
    };

    this.getAudioSource = () => {
      return audioSource
    };
    const muteParam = this.addParameter(new BooleanParameter('Mute', false));

    this.addParameter(new NumberParameter('Gain', 1.0)).setRange([0, 5]);
    const loopParam = this.addParameter(new BooleanParameter('Loop', false));
    this.addParameter(new BooleanParameter('SpatializeAudio', true));
    this.addParameter(new NumberParameter('refDistance', 2));
    this.addParameter(new NumberParameter('maxDistance', 10000));
    // Defaults taken from here.: https://github.com/mdn/webaudio-examples/blob/master/panner-node/main.js
    this.addParameter(new NumberParameter('rolloffFactor', 1));
    this.addParameter(new NumberParameter('coneInnerAngle', 360));
    this.addParameter(new NumberParameter('coneOuterAngle', 0));
    this.addParameter(new NumberParameter('coneOuterGain', 1));

    muteParam.on('valueChanged', () => {
      if (audioSource) audioSource.muted = muteParam.getValue();
    });
    loopParam.on('valueChanged', () => {
      if (audioSource) audioSource.loop = loopParam.getValue();
    });

    this.mute = (value) => {
      muteParam.setValue(value);
    };

    // Note: Many parts of the code assume a 'loaded' signal.
    // We should probably deprecate and use only 'updated'.
    this.loaded = false;
  }

  /**
   * Returns loaded status of the audio item
   *
   * @return {boolean} - `The return value`.
   */
  isLoaded() {
    return this.__loaded
  }

  /**
   * The setAudioStream method.
   * @param {any} audio - The audio value.
   */
  setAudioStream() {
    this.__loaded = true;
    this.emit('loaded', {});
    this.emit('audioSourceCreated', { audioSource });
  }
}

/** Class representing a audio file item in a scene tree.
 * @ignore
 * @extends AudioItem
 */
class FileAudioItem extends AudioItem {
  /**
   * Create a audio file item.
   * @param {string} name - The name of the audio file.
   */
  constructor(name) {}
}

/* eslint-disable require-jsdoc */

const generateParameterInstance = (paramName, defaultValue, range, texturable) => {
  if (typeof defaultValue == 'boolean' || defaultValue === false || defaultValue === true) {
    return new Parameter(paramName, defaultValue, 'Boolean')
  } else if (typeof defaultValue == 'string') {
    return new Parameter(paramName, defaultValue, 'String')
  } else if (MathFunctions.isNumeric(defaultValue)) {
    if (texturable) return new MaterialFloatParam(paramName, defaultValue, range)
    else return new NumberParameter(paramName, defaultValue, range)
  } else if (defaultValue instanceof Vec2) {
    return new Vec2Parameter(paramName, defaultValue)
  } else if (defaultValue instanceof Vec3$1) {
    return new Vec3Parameter(paramName, defaultValue)
  } else if (defaultValue instanceof Color) {
    if (texturable) return new MaterialColorParam(paramName, defaultValue)
    else return new ColorParameter(paramName, defaultValue)
  } else {
    return new Parameter(paramName, defaultValue)
  }
};

/**
 * Represents a type of `BaseItem` class that holds material configuration.
 * Use this to apply materials to your assets or item parts.
 *
 * **Events**
 * * **shaderNameChanged:** Triggered when the shader's name is set through `setShaderName` method.
 *
 * @extends BaseItem
 */
class Material extends BaseItem {
  /**
   * Create a material
   * @param {string} name - The name of the material.
   * @param {string} shaderName - Shader's class name.
   */
  constructor(name, shaderName) {
    super(name);
    this.visibleInGeomDataBuffer = true;

    if (shaderName) this.setShaderName(shaderName);
  }

  /**
   * Getter for the shader name.
   * @return {string} - Returns the shader name.
   */
  getShaderName() {
    return this.__shaderName
  }

  /**
   * Sets shader by using the name of the class with the script.
   * It is important that the shader is registered in `Registry`, otherwise it will error.
   * See all classes that extend from `GLShader`.
   *
   * @param {string} shaderName - The shader name.
   */
  setShaderName(shaderName) {
    if (this.__shaderName == shaderName) return

    const shaderClass = Registry.getBlueprint(shaderName);
    if (!shaderClass) throw new Error('Error setting Shader. Shader not found:' + shaderName)

    const paramDescs = shaderClass.getParamDeclarations();
    const paramMap = {};
    for (const desc of paramDescs) {
      // Note: some shaders specify default images. Like the speckle texture
      // on the car paint shader.
      // let image;
      // let defaultValue = desc.defaultValue;
      // if (desc.defaultValue instanceof BaseImage) {
      //     image = desc.defaultValue;
      //     defaultValue = new Color();
      // }
      let param = this.getParameter(desc.name);
      // if(param && param.getType() != desc.defaultValue)
      // removeParameter
      if (!param)
        param = this.addParameter(
          generateParameterInstance(desc.name, desc.defaultValue, desc.range, desc.texturable != false)
        );
      // if(desc.texturable != false) {// By default, parameters are texturable. texturable must be set to false to disable texturing.
      //     if(!param.getImage)
      //         this.__makeParameterTexturable(param);
      //     // if(image)
      //     //     param.setImage(image)
      // }

      paramMap[desc.name] = true;
    }

    // Remove redundant Params.
    for (const param of this.__params) {
      if (!paramMap[param.getName()]) {
        this.removeParameter(param.getName());
      }
    }

    this.__shaderName = shaderName;
    this.emit('shaderNameChanged', { shaderName });
  }

  /**
   * Remove all textures from Material's parameters.
   */
  removeAllTextures() {
    for (const param of this.__params) {
      if (param.getImage && param.getImage()) {
        // emit a notification so the GLMaterial knows to
        // Remove refs to GLTexture objects.
        param.setImage(undefined);
      }
    }
  }

  // /////////////////////////////
  // Parameters

  /**
   * Returns all texture parameters in current Material.
   *
   * @return {object} - The return value.
   */
  getParamTextures() {
    const textures = {};
    for (const param of this.__params) {
      if (param.getImage && param.getImage()) textures[param.getName()] = param.getImage();
    }
    return textures
  }

  /**
   * The __makeParameterTexturable method.
   * @param {any} param - The param value.
   * @private
   */
  __makeParameterTexturable(param) {
    makeParameterTexturable(param);
  }

  /**
   * Checks if the material is transparent by checking the `Opacity` parameter.
   *
   * @return {boolean} - Returns true if the material is transparent.
   */
  isTransparent() {
    const opacity = this.getParameter('Opacity');
    if (opacity && (opacity.getValue() < 0.99 || opacity.getImage())) return true
    const baseColor = this.getParameter('BaseColor');
    if (baseColor && baseColor.getImage() && baseColor.getImage().format == 'RGBA') return true
    return false
  }

  /**
   * Returns shader's class of current material, if set. Otherwise it returns `undefined`
   *
   * @return {string|undefined} - The return value.
   */
  getShaderClass() {
    return Registry.getBlueprint(this.getShaderName())
  }

  /**
   * Let you modify or set the shader and all the parameters of current material.
   *
   * @param {object} paramValues - The paramValues.
   * @param {string} shaderName - The shader name.
   */
  modifyParams(paramValues, shaderName) {
    if (shaderName) this.setShaderName(shaderName);
    for (const paramName in paramValues) {
      const param = this.getParameter(paramName);
      if (param) {
        if (paramValues[paramName] instanceof Parameter) {
          this.replaceParameter(paramValues[paramName]);
        } else {
          param.setValue(paramValues[paramName]);
        }
      }
    }
  }

  // ////////////////////////////////////////
  // Persistence

  /**
   * The toJSON method encodes the current object as a json object.
   *
   * @param {object} context - The context value.
   * @return {object} - Returns the json object.
   */
  toJSON(context) {
    return super.toJSON(context)
  }

  /**
   * The fromJSON method decodes a json object for this type.
   *
   * @param {object} j - The json object this item must decode.
   * @param {object} context - The context value.
   */
  fromJSON(j, context = {}) {
    if (!j.shader) {
      console.warn('Invalid Material JSON');
      return
    }
    this.setShaderName(j.shader);
    super.fromJSON(j, context);
    // let props = this.__params;
    // for (let key in j) {
    //     let value;
    //     if (j[key] instanceof Object) {
    //         value = new Color();
    //         value.fromJSON(j[key]);
    //     } else {
    //         value = j[key];
    //     }
    //     this.addParameter(paramName, value);
    // }
  }

  /**
   * Sets state of current Item(Including Shaders and Materials) using a binary reader object.
   *
   * @param {BinReader} reader - The reader value.
   * @param {object} context - The context value.
   */
  readBinary(reader, context) {
    let shaderName = reader.loadStr();

    if (shaderName == 'StandardMaterial') {
      shaderName = 'StandardSurfaceShader';
    }
    if (shaderName == 'TransparentMaterial') {
      shaderName = 'TransparentSurfaceShader';
    }
    this.setShaderName(shaderName);

    // if (context.version < 3) {
    if (context.versions['zea-engine'].compare([0, 0, 3]) < 0) {
      this.setName(reader.loadStr());

      function capitalizeFirstLetter(string) {
        return string.charAt(0).toUpperCase() + string.slice(1)
      }

      const numParams = reader.loadUInt32();
      for (let i = 0; i < numParams; i++) {
        const paramName = capitalizeFirstLetter(reader.loadStr());
        const paramType = reader.loadStr();
        let value;
        if (paramType == 'MaterialColorParam') {
          value = reader.loadRGBAFloat32Color();
          // If the value is in linear space, then we should convert it to gamma space.
          // Note: !! this should always be done in preprocessing...
          value.applyGamma(2.2);
        } else {
          value = reader.loadFloat32();
        }
        const textureName = reader.loadStr();

        // console.log(paramName +":" + value);
        let param = this.getParameter(paramName);
        if (param) param.setValue(value);
        else param = this.addParameter(generateParameterInstance(paramName, value));
        if (textureName != '' && param.setImage) {
          // if(!param.setImage)
          //     this.__makeParameterTexturable(param);

          if (context.materialLibrary.hasImage(textureName)) {
            // console.log(paramName +":" + textureName + ":" + context.materialLibrary[textureName].resourcePath);
            param.setImage(context.materialLibrary.getImage(textureName));
          } else {
            console.warn('Missing Texture:' + textureName);
          }
        }
      }
    } else {
      super.readBinary(reader, context);
    }
  }

  // ////////////////////////////////////////
  // Clone and Destroy

  /**
   * The clone method constructs a new material, copies its values
   * from this material and returns it.
   *
   * @return {Material} - Returns a new cloned material.
   */
  clone() {
    const cloned = new Material();
    cloned.copyFrom(this);
    return cloned
  }

  /**
   * When a Material is copied, first runs `BaseItem` copyFrom method, then sets shader.
   *
   * @param {Material} src - The material to copy from.
   */
  copyFrom(src) {
    super.copyFrom(src);
    this.setShaderName(src.getShaderName());
    for (const srcParam of src.getParameters()) {
      const param = src.getParameter(srcParam.getName());
      if (!srcParam.getImage) this.__makeParameterTexturable(param);
    }
  }

  /**
   * The destroy is called by the system to cause explicit resources cleanup.
   * Users should never need to call this method directly.
   */
  destroy() {
    this.removeAllTextures();
    super.destroy();
  }
}

/**
 * Base class that represents geometry items with layering, overlaying and cut away features.
 *
 * **Events**
 * * **cutAwayChanged:** Triggered everytime the cutaway variables change(if enabled or not, the vector and the distance).
 * @extends TreeItem
 */
class BaseGeomItem extends TreeItem {
  /**
   * Create a base geometry item.
   * @param {string} name - The name of the base geom item.
   */
  constructor(name) {
    super(name);
    this.overlay = false;
    this.__cutAway = false;
    this.__cutAwayVector = false;
    this.__cutAwayDist = false;
    this.__layers = [];
  }

  /**
   * Sets overlay value.
   *
   * @todo Need to find the layer and add this item to it.
   * @param {boolean} val - `true` to enable it.
   */
  setOverlay(val) {
    // TODO: need to find the layer and add this item to it.
    this.overlay = val;
  }

  /**
   * Returns `true` if overlay is enabled for current item.
   *
   * @return {boolean} - The return value.
   */
  isOverlay() {
    return this.overlay
  }

  /**
   * Adds a layer to current item.
   *
   * @todo Need to find the layer and add this item to it.
   * @param {string} name - The name of the layer.
   */
  addLayer(name) {
    // TODO: need to find the layer and add this item to it.
    this.__layers.push(name);
  }

  /**
   * Returns all layers in current item.
   *
   * @return {array} - The return value.
   */
  getLayers() {
    return this.__layers
  }

  // ////////////////////////////////////////
  // Cutaways

  /**
   * Checks if cutaway is enabled.
   *
   * @return {boolean} - Returns `true` if enabled.
   */
  isCutawayEnabled() {
    return this.__cutAway
  }

  /**
   * Sets cutaway state.
   *
   * @param {boolean} state - `true` to enable it, otherwise `false`.
   */
  setCutawayEnabled(state) {
    this.__cutAway = state;
    this.emit('cutAwayChanged', {});
  }

  /**
   * Returns cutaway vector value.
   *
   * @return {Vec3|boolean} - `Vec3` when it is set, `false` on default.
   */
  getCutVector() {
    return this.__cutAwayVector
  }

  /**
   * Sets cutaway vector value.
   *
   * @param {Vec3} cutAwayVector - The cutAwayVector value.
   */
  setCutVector(cutAwayVector) {
    this.__cutAwayVector = cutAwayVector;
    this.emit('cutAwayChanged', {});
  }

  /**
   * Getter for the cutaway distance.
   *
   * @return {number} - The return value.
   */
  getCutDist() {
    return this.__cutAwayDist
  }

  /**
   * Sets cutaway distance value.
   *
   * @param {number} cutAwayDist - The cutAwayDist value.
   */
  setCutDist(cutAwayDist) {
    this.__cutAwayDist = cutAwayDist;
    this.emit('cutAwayChanged', {});
  }

  // ///////////////////////////
  // Persistence

  /**
   * Sets state of current Item(Including layers & material) using a binary reader object.
   *
   * @param {BinReader} reader - The reader value.
   * @param {object} context - The context value.
   */
  readBinary(reader, context) {
    super.readBinary(reader, context);

    if (context.versions['zea-engine'].greaterOrEqualThan([0, 0, 4])) {
      const materialName = reader.loadStr();
      // const materialName = 'Material' + this.__bodyDescId;

      const materialLibrary = context.assetItem.getMaterialLibrary();
      let material = materialLibrary.getMaterial(materialName, false);
      if (!material) {
        // console.warn("BaseGeomItem :'" + this.name + "' Material not found:" + materialName);
        // material = materialLibrary.getMaterial('DefaultMaterial');

        material = new Material(materialName, 'SimpleSurfaceShader');
        material.getParameter('BaseColor').loadValue(Color.random(0.25));
        context.assetItem.getMaterialLibrary().addMaterial(material);
      }
      this.getParameter('Material').loadValue(material);

      this.__layers = reader.loadStrArray();
      if (this.__layers.length > 0) {
        // console.log("Layers:", this.__layers)
        for (const layer of this.__layers) context.addGeomToLayer(this, layer);
      }
    }
  }
}

/** The operator the calculates the global Xfo of a TreeItem based on its parents GlobalXfo and its own LocalXfo
 * @extends Operator
 * @private
 */
class CalcGeomMatOperator extends Operator {
  /**
   *Creates an instance of CalcGeomMatOperator.
   *
   * @param {*} globalXfoParam
   * @param {*} geomOffsetXfoParam
   * @param {*} geomMatParam
   * @memberof CalcGeomMatOperator
   */
  constructor(globalXfoParam, geomOffsetXfoParam, geomMatParam) {
    super('CalcGeomMatOperator');
    this.addInput(new OperatorInput('GlobalXfo')).setParam(globalXfoParam);
    this.addInput(new OperatorInput('GeomOffsetXfo')).setParam(geomOffsetXfoParam);
    this.addOutput(new OperatorOutput('GeomMat')).setParam(geomMatParam);
  }

  /**
   * The evaluate method.
   */
  evaluate() {
    const globalXfo = this.getInput('GlobalXfo').getValue();
    const geomOffsetXfo = this.getInput('GeomOffsetXfo').getValue();
    const geomMatOutput = this.getOutput('GeomMat');

    const globalMat4 = globalXfo.toMat4();
    const geomOffsetMat4 = geomOffsetXfo.toMat4();
    geomMatOutput.setClean(globalMat4.multiply(geomOffsetMat4));
  }
}

/**
 * Class representing a geometry item in a scene tree.
 *
 * **Parameters**
 * * **Geometry(`GeometryParameter`):** The geometry to be rendered for this GeomItem
 * * **Material(`MaterialParameter`):** The Material to use when rendering this GeomItem
 * * **GeomOffsetXfo(`XfoParameter`):** Provides an offset transformation that is applied only to the geometry and not inherited by child items.
 * * **GeomMat(`Mat4Parameter`):** Calculated from the GlobalXfo and the GeomOffsetXfo, this matrix is provided to the renderer for rendering.
 *
 * @extends BaseGeomItem
 */
class GeomItem extends BaseGeomItem {
  /**
   * Creates a geometry item.
   * @param {string} name - The name of the geom item.
   * @param {BaseGeom} geometry - The geometry value.
   * @param {Material} material - The material value.
   */
  constructor(name, geometry = undefined, material = undefined) {
    super(name);

    this.__geomParam = this.addParameter(new GeometryParameter('Geometry'));
    this._setBoundingBoxDirty = this._setBoundingBoxDirty.bind(this);
    this.__geomParam.on('valueChanged', this._setBoundingBoxDirty);
    this.__geomParam.on('boundingBoxChanged', this._setBoundingBoxDirty);
    this.__materialParam = this.addParameter(new MaterialParameter('Material'));
    this.__paramMapping['material'] = this.getParameterIndex(this.__materialParam);

    this.__geomOffsetXfoParam = this.addParameter(new XfoParameter('GeomOffsetXfo'));
    this.__geomMatParam = this.addParameter(new Mat4Parameter('GeomMat'));

    this.calcGeomMatOperator = new CalcGeomMatOperator(
      this.__globalXfoParam,
      this.__geomOffsetXfoParam,
      this.__geomMatParam
    );

    if (geometry) this.getParameter('Geometry').loadValue(geometry);
    if (material) this.getParameter('Material').loadValue(material);
  }

  // ////////////////////////////////////////
  // Geometry

  /**
   * Returns `Geometry` parameter value.
   *
   * @return {BaseGeom} - The return value.
   */
  getGeometry() {
    console.warn(`deprecated. please use 'getParameter('Geometry').getValue`);
    return this.__geomParam.getValue()
  }

  /**
   * Sets geometry object to `Geometry` parameter.
   *
   * @param {BaseGeom} geom - The geom value.
   */
  setGeometry(geom) {
    console.warn(`deprecated. please use 'getParameter('Geometry').setValue`);
    this.__geomParam.setValue(geom);
  }

  /**
   * Getter for geometry (getGeom is deprecated. Please use getGeometry).
   *
   * @deprecated
   * @return {BaseGeom} - The return value.
   */
  getGeom() {
    console.warn(`deprecated. please use 'getParameter('Geometry').getValue`);
    return this.__geomParam.getValue()
  }

  /**
   * Setter for geometry. (setGeom is deprecated. Please use setGeometry).
   *
   * @deprecated
   * @param {BaseGeom} geom - The geom value.
   * @return {number} - The return value.
   */
  setGeom(geom) {
    console.warn("setGeom is deprecated. Please use 'getParameter('Geometry').setValue'");
    return this.__geomParam.setValue(geom)
  }

  /**
   * Returns the specified value of `Material`parameter.
   *
   * @return {Material} - The return value.
   */
  getMaterial() {
    console.warn(`deprecated. please use 'getParameter('Material').getValue`);
    return this.__materialParam.getValue()
  }

  /**
   * Sets material object to `Material` parameter.
   *
   * @param {Material} material - The material value.
   */
  setMaterial(material) {
    console.warn(`deprecated. please use 'getParameter('Material').setValue`);
    this.__materialParam.setValue(material);
  }

  /**
   * The _cleanBoundingBox method.
   * @param {Box3} bbox - The bounding box value.
   * @return {Box3} - The return value.
   * @private
   */
  _cleanBoundingBox(bbox) {
    bbox = super._cleanBoundingBox(bbox);
    const geom = this.__geomParam.getValue();
    if (geom) {
      bbox.addBox3(geom.getBoundingBox(), this.getGeomMat4());
    }
    return bbox
  }

  // ////////////////////////////////////////
  // Xfos

  /**
   * Returns the offset `Xfo` object specified in `GeomOffsetXfo` parameter.
   *
   * @return {Xfo} - Returns the geom offset Xfo.
   */
  getGeomOffsetXfo() {
    return this.__geomOffsetXfoParam.getValue()
  }

  /**
   * Sets `Xfo` object to `GeomOffsetXfo` parameter.
   *
   * @param {Xfo} xfo - The Xfo value.
   */
  setGeomOffsetXfo(xfo) {
    this.__geomOffsetXfoParam.setValue(xfo);
  }

  /**
   * Returns `Mat4` object value of `GeomMat` parameter.
   *
   * @return {Mat4} - Returns the geom Xfo.
   */
  getGeomMat4() {
    return this.__geomMatParam.getValue()
  }

  // ///////////////////////////
  // Debugging

  /**
   * The toJSON method encodes this type as a json object for persistence.
   *
   * @param {object} context - The context value.
   * @return {object} - Returns the json object.
   */
  toJSON(context) {
    const json = super.toJSON(context);
    return json
  }

  /**
   * The fromJSON method decodes a json object for this type.
   *
   * @param {object} json - The json object this item must decode.
   * @param {object} context - The context value.
   */
  fromJSON(json, context) {
    super.fromJSON(json, context);
    context.numGeomItems++;
  }

  /**
   * Loads state of the Item from a binary object.
   *
   * @param {object} reader - The reader value.
   * @param {object} context - The context value.
   */
  readBinary(reader, context) {
    super.readBinary(reader, context);

    context.numGeomItems++;

    const itemFlags = reader.loadUInt8();
    const geomIndex = reader.loadUInt32();
    const geomLibrary = context.assetItem.getGeometryLibrary();
    const geom = geomLibrary.getGeom(geomIndex);
    if (geom) {
      this.getParameter('Geometry').loadValue(geom);
    } else {
      this.geomIndex = geomIndex;
      const onGeomLoaded = (event) => {
        const { range } = event;
        if (geomIndex >= range[0] && geomIndex < range[1]) {
          const geom = geomLibrary.getGeom(geomIndex);
          if (geom) this.getParameter('Geometry').setValue(geom);
          else console.warn('Geom not loaded:', this.getName());
          geomLibrary.off('rangeLoaded', onGeomLoaded);
        }
      };
      geomLibrary.on('rangeLoaded', onGeomLoaded);
    }

    // this.setVisibility(j.visibility);
    // Note: to save space, some values are skipped if they are identity values
    const geomOffsetXfoFlag = 1 << 2;
    if (itemFlags & geomOffsetXfoFlag) {
      this.__geomOffsetXfoParam.setValue(
        new Xfo(reader.loadFloat32Vec3(), reader.loadFloat32Quat(), reader.loadFloat32Vec3())
      );
    }

    // BaseGeomItem now handles loading materials.
    // if (context.version < 4) {
    if (context.versions['zea-engine'].compare([0, 0, 4]) < 0) {
      const materialFlag = 1 << 3;
      if (itemFlags & materialFlag) {
        const materialLibrary = context.assetItem.getMaterialLibrary();
        const materialName = reader.loadStr();
        let material = materialLibrary.getMaterial(materialName);
        if (!material) {
          console.warn("Geom :'" + this.name + "' Material not found:" + materialName);
          material = materialLibrary.getMaterial('Default');
        }
        this.getParameter('Material').loadValue(material);
      } else {
        // Force nodes to have a material so we can see them.
        this.getParameter('Material').loadValue(context.assetItem.getMaterialLibrary().getMaterial('Default'));
      }
    }

    // Note: deprecated value. Not sure if we need to load this here.
    // I think not, but need to test first.
    const lightmapCoordOffset = reader.loadFloat32Vec2();
  }

  /**
   * Returns string representation of current object's state.
   *
   * @return {string} - The return value.
   */
  toString() {
    return JSON.stringify(this.toJSON(), null, 2)
  }

  // ////////////////////////////////////////
  // Clone and Destroy

  /**
   * The clone method constructs a new geom item, copies its values
   * from this item and returns it.
   *
   * @param {number} context - The context value.
   * @return {GeomItem} - Returns a new cloned geom item.
   */
  clone(context) {
    const cloned = new GeomItem();
    cloned.copyFrom(this, context);
    return cloned
  }

  /**
   * Copies current GeomItem with all its children.
   *
   * @param {GeomItem} src - The geom item to copy from.
   * @param {number} context - The context value.
   */
  copyFrom(src, context) {
    super.copyFrom(src, context);

    if (!src.getParameter('Geometry').getValue() && src.geomIndex != -1) {
      const geomLibrary = context.assetItem.getGeometryLibrary();
      const geomIndex = src.geomIndex;
      const onGeomLoaded = (event) => {
        const { range } = event;
        if (geomIndex >= range[0] && geomIndex < range[1]) {
          const geom = geomLibrary.getGeom(geomIndex);
          if (geom) this.getParameter('Geometry').loadValue(geom);
          else console.warn('Geom not loaded:', this.getName());
          geomLibrary.off('rangeLoaded', onGeomLoaded);
        }
      };
      geomLibrary.on('rangeLoaded', onGeomLoaded);
    }

    // Geom Xfo should be dirty after cloning.
    // Note: this might not be necessary. It should
    // always be dirty after cloning.
    this.__geomMatParam.setDirty(this.__cleanGeomMat);
  }

  /**
   * The destroy is called by the system to cause explicit resources cleanup.
   * Users should never need to call this method directly.
   */
  destroy() {
    super.destroy();
  }
}

Registry.register('GeomItem', GeomItem);

/** An operator for aiming items at targets.
 * @extends Operator
 *
 */
class GroupTransformXfoOperator extends Operator {
  /**
   * Create a GroupMemberXfoOperator operator.
   * @param {Parameter} groupGlobalXfoParam - The GlobalXfo param found on the Group.
   * @param {Parameter} groupTransformXfoParam - The parameter on the Group which defines the displacement to apply to the members.
   */
  constructor(groupGlobalXfoParam, groupTransformXfoParam) {
    super();
    this.addInput(new OperatorInput('GroupGlobalXfo')).setParam(groupGlobalXfoParam);
    this.addOutput(new OperatorOutput('GroupTransformXfo')).setParam(groupTransformXfoParam);
  }

  /**
   * Create a GroupMemberXfoOperator operator.
   * @param {Xfo} bindXfo - The Bind Xfo calculated from the initial Transforms of the Group Members.
   */
  setBindXfo(bindXfo) {
    this.bindXfo = bindXfo;
    this.invBindXfo = bindXfo.inverse();
    this.setDirty();
  }

  /**
   * The evaluate method.
   */
  evaluate() {
    const groupTransformOutput = this.getOutput('GroupTransformXfo');
    if (this.invBindXfo) {
      const groupGlobalXfo = this.getInput('GroupGlobalXfo').getValue();
      groupTransformOutput.setClean(groupGlobalXfo.multiply(this.invBindXfo));
    } else {
      groupTransformOutput.setClean(new Xfo());
    }
  }
}

/** An operator for modifying group members by the groups Xfo
 * @private
 * @extends Operator
 *
 */
class GroupMemberXfoOperator extends Operator {
  /**
   * Create a GroupMemberXfoOperator operator.
   * @param {Parameter} groupTransformXfoParam - The parameter on the Group which defines the displacement to apply to the members.
   * @param {Parameter} memberXfoGlobalParam - The GlobalXfo param found on the Member.
   */
  constructor(groupTransformXfoParam, memberXfoGlobalParam) {
    super();
    this.addInput(new OperatorInput('GroupTransformXfo')).setParam(groupTransformXfoParam);
    this.addOutput(new OperatorOutput('MemberGlobalXfo', OperatorOutputMode.OP_READ_WRITE)).setParam(
      memberXfoGlobalParam
    );

    this._enabled = true;
  }

  /**
   * used to temporarily disable/enable the operator when the Group bind Xfo is being calculated
   */
  disable() {
    this._enabled = false;
    this.setDirty();
  }

  /**
   * used to temporarily disable/enable the operator when the Group bind Xfo is being calculated
   */
  enable() {
    this._enabled = true;
    this.setDirty();
  }

  /**
   * The evaluate method.
   */
  evaluate() {
    const memberGlobalXfoOutput = this.getOutput('MemberGlobalXfo');
    const memberGlobalXfo = memberGlobalXfoOutput.getValue();
    if (this._enabled) {
      const groupTransformXfo = this.getInput('GroupTransformXfo').getParam().getValue();
      memberGlobalXfoOutput.setClean(groupTransformXfo.multiply(memberGlobalXfo));
    } else {
      memberGlobalXfoOutput.setClean(memberGlobalXfo);
    }
  }
}

/* eslint-disable no-unused-vars */

const GROUP_XFO_MODES = {
  disabled: 0,
  manual: 1,
  first: 2,
  average: 3,
  globalOri: 4,
};

/**
 * Groups are a special type of `TreeItem` that allows you to gather/classify/organize/modify
 * multiple items contained within the group. Items can be added to the group directly, or using
 * its path.
 * All parameters set to the group are also set to the children; in other words, it's a faster way
 * to apply common things to multiple items.
 *
 * **Parameters**
 * * **Items(`ItemSetParameter`):** _todo_
 * * **Highlighted(`BooleanParameter`):** _todo_
 * * **HighlightColor(`ColorParameter`):** _todo_
 * * **HighlightFill(`NumberParameter`):** _todo_
 * * **Material(`MaterialParameter`):** _todo_
 * * **CutAwayEnabled(`BooleanParameter`):** _todo_
 * * **CutPlaneNormal(`Vec3Parameter`):** _todo_
 * * **CutPlaneDist(`NumberParameter`):** _todo_
 *
 * @extends TreeItem
 */
class Group extends TreeItem {
  /**
   * Creates an instance of a group.
   *
   * @param {string} name - The name of the group.
   */
  constructor(name) {
    super(name);

    // Items which can be constructed by a user (not loaded in binary data.)
    this.groupXfoDirty = false;
    this.calculatingGroupXfo = false;
    this.dirty = false;
    this.searchRoot = null;
    this._bindXfoDirty = false;

    // this.invGroupXfo = undefined
    this.memberXfoOps = [];
    this.__itemsParam = this.addParameter(new ItemSetParameter('Items', (item) => item instanceof TreeItem));
    this.__itemsParam.on('itemAdded', (event) => {
      this.__bindItem(event.item, event.index);
    });
    this.__itemsParam.on('itemRemoved', (event) => {
      this.__unbindItem(event.item, event.index);
    });

    this.__initialXfoModeParam = this.addParameter(
      new MultiChoiceParameter('InitialXfoMode', GROUP_XFO_MODES.average, ['manual', 'first', 'average', 'global'])
    );
    this.__initialXfoModeParam.on('valueChanged', () => {
      this.calcGroupXfo();
    });

    this.__highlightedParam = this.addParameter(new BooleanParameter('Highlighted', false));
    this.__highlightedParam.on('valueChanged', () => {
      this.__updateHighlight();
    });

    this.__updateHighlight = this.__updateHighlight.bind(this);
    const highlightColorParam = this.addParameter(new ColorParameter('HighlightColor', new Color(0.5, 0.5, 1)));
    highlightColorParam.on('valueChanged', this.__updateHighlight);
    const highlightFillParam = this.addParameter(new NumberParameter('HighlightFill', 0.0, [0, 1]));
    highlightFillParam.on('valueChanged', this.__updateHighlight);

    this.__materialParam = this.addParameter(new MaterialParameter('Material'));
    this.__materialParam.on('valueChanged', () => {
      this.__updateMaterial();
    });

    this.__updateCutaway = this.__updateCutaway.bind(this);
    this.addParameter(new BooleanParameter('CutAwayEnabled', false)).on('valueChanged', this.__updateCutaway);
    this.addParameter(new Vec3Parameter('CutPlaneNormal', new Vec3$1(1, 0, 0))).on('valueChanged', this.__updateCutaway);
    this.addParameter(new NumberParameter('CutPlaneDist', 0.0)).on('valueChanged', this.__updateCutaway);

    const groupTransformParam = this.addParameter(new XfoParameter('GroupTransform', new Xfo()));
    this.groupTransformOp = new GroupTransformXfoOperator(this.getParameter('GlobalXfo'), groupTransformParam);
  }

  /**
   * Returns enum of available xfo modes.
   *
   * | Name | Default |
   * | --- | --- |
   * | manual | <code>0</code> |
   * | first | <code>1</code> |
   * | average | <code>2</code> |
   * | globalOri | <code>3</code> |
   */
  static get INITIAL_XFO_MODES() {
    return GROUP_XFO_MODES
  }

  /**
   * The __updateVisibility method.
   * @return {boolean} - The return value.
   * @private
   */
  __updateVisibility() {
    if (super.__updateVisibility()) {
      const value = this.isVisible();
      Array.from(this.__itemsParam.getValue()).forEach((item) => {
        if (item instanceof TreeItem) item.propagateVisibility(value ? 1 : -1);
      });
      return true
    }
    return false
  }

  // /////////////////////////////

  /**
   * The __updateHighlight method.
   * @private
   */
  __updateHighlight() {
    // Make this function async so that we don't pull on the
    // graph immediately when we receive a notification.
    // Note: propagating using an operator would be much better.
    new Promise((resolve) => {
      let highlighted = false;
      let color;
      if (this.getParameter('Highlighted').getValue() || this.isSelected()) {
        highlighted = true;
        color = this.getParameter('HighlightColor').getValue();
        color.a = this.getParameter('HighlightFill').getValue();
      }

      const key = 'groupItemHighlight' + this.getId();
      Array.from(this.__itemsParam.getValue()).forEach((item) => {
        if (item instanceof TreeItem) {
          if (highlighted) item.addHighlight(key, color, true);
          else item.removeHighlight(key, true);
        }
      });
      resolve();
    });
  }

  /**
   * Changes selection's state of the group with all items it owns.
   *
   * @param {boolean} sel - Boolean indicating the new selection state.
   */
  setSelected(sel) {
    super.setSelected(sel);
    this.__updateHighlight();
  }

  // ////////////////////////////////////////
  // Global Xfo

  /**
   * Calculate the group Xfo translate.
   * @private
   * @return {Xfo} - Returns a new Xfo.
   */
  calcGroupXfo() {
    const items = Array.from(this.__itemsParam.getValue());
    if (items.length == 0) return new Xfo()
    this.calculatingGroupXfo = true;

    this.memberXfoOps.forEach((op) => op.disable());

    // TODO: Disable the group operator?
    const initialXfoMode = this.__initialXfoModeParam.getValue();
    let xfo;
    if (initialXfoMode == GROUP_XFO_MODES.manual) {
      // The xfo is manually set by the current global xfo.
      // this.invGroupXfo = this.getParameter('GlobalXfo').getValue().inverse()
      this.groupTransformOp.setBindXfo(this.getParameter('GlobalXfo').getValue());
      this.calculatingGroupXfo = false;
      this.groupXfoDirty = false;
      return
    } else if (initialXfoMode == GROUP_XFO_MODES.first) {
      if (items[0] instanceof TreeItem) {
        xfo = items[0].getParameter('GlobalXfo').getValue();
      }
    } else if (initialXfoMode == GROUP_XFO_MODES.average) {
      xfo = new Xfo();
      xfo.ori.set(0, 0, 0, 0);
      let numTreeItems = 0;
      items.forEach((item, index) => {
        if (item instanceof TreeItem) {
          const itemXfo = item.getParameter('GlobalXfo').getValue();
          xfo.tr.addInPlace(itemXfo.tr);
          xfo.ori.addInPlace(itemXfo.ori);
          numTreeItems++;
        }
      });
      xfo.tr.scaleInPlace(1 / numTreeItems);
      xfo.ori.normalizeInPlace();
      // xfo.sc.scaleInPlace(1/ numTreeItems);
    } else if (initialXfoMode == GROUP_XFO_MODES.globalOri) {
      xfo = new Xfo();
      let numTreeItems = 0;
      items.forEach((item, index) => {
        if (item instanceof TreeItem) {
          const itemXfo = item.getParameter('GlobalXfo').getValue();
          xfo.tr.addInPlace(itemXfo.tr);
          numTreeItems++;
        }
      });
      xfo.tr.scaleInPlace(1 / numTreeItems);
    } else {
      throw new Error('Invalid GROUP_XFO_MODES.')
    }

    // Note: if the Group global param becomes dirty
    // then it stops propagating dirty to its members.
    // const newGlobal = this.getParameter('GlobalXfo').getValue() // force a cleaning.
    // this.invGroupXfo = newGlobal.inverse()

    this.getParameter('GlobalXfo').setValue(xfo);
    this.groupTransformOp.setBindXfo(xfo);

    this.memberXfoOps.forEach((op) => op.enable());
    this.calculatingGroupXfo = false;
    this.groupXfoDirty = false;
  }

  // ////////////////////////////////////////
  // Materials

  /**
   * The __updateMaterial method.
   * @private
   */
  __updateMaterial() {
    // Make this function async so that we don't pull on the
    // graph immediately when we receive a notification.
    // Note: propagating using an operator would be much better.
    new Promise((resolve) => {
      const material = this.getParameter('Material').getValue();

      // TODO: Bind an operator
      Array.from(this.__itemsParam.getValue()).forEach((item) => {
        item.traverse((treeItem) => {
          if (treeItem instanceof TreeItem && treeItem.hasParameter('Material')) {
            const p = treeItem.getParameter('Material');
            if (material) {
              const m = p.getValue();
              if (m != material) {
                p.__backupMaterial = m;
                p.loadValue(material);
              }
            } else if (p.__backupMaterial) {
              p.loadValue(p.__backupMaterial);
            }
          }
        }, false);
      });
      resolve();
    });
  }

  // ////////////////////////////////////////
  // Cutaways

  /**
   * The __updateCutaway method.
   * @private
   */
  __updateCutaway() {
    // Make this function async so that we don't pull on the
    // graph immediately when we receive a notification.
    // Note: propagating using an operator would be much better.
    new Promise((resolve) => {
      const cutEnabled = this.getParameter('CutAwayEnabled').getValue();
      const cutAwayVector = this.getParameter('CutPlaneNormal').getValue();
      const cutAwayDist = this.getParameter('CutPlaneDist').getValue();

      Array.from(this.__itemsParam.getValue()).forEach((item) => {
        item.traverse((treeItem) => {
          if (treeItem instanceof BaseGeomItem) {
            treeItem.setCutawayEnabled(cutEnabled);
            treeItem.setCutVector(cutAwayVector);
            treeItem.setCutDist(cutAwayDist);
          }
        }, true);
      });
      resolve();
    });
  }

  // ////////////////////////////////////////
  // Items

  /**
   *  sets the root item to be used as the search root.
   * @param {TreeItem} treeItem
   */

  setSearchRoot(treeItem) {
    this.searchRoot = treeItem;
  }

  setOwner(owner) {
    if (!this.searchRoot || this.searchRoot == this.getOwner()) this.searchRoot = owner;
    super.setOwner(owner);
  }

  /**
   * This method is mostly used in our demos,
   * and should be removed from the interface.
   *
   * @deprecated
   * @param {array} paths - The paths value.
   * @private
   */
  setPaths(paths) {
    this.clearItems(false);

    const searchRoot = this.getOwner();
    if (this.searchRoot == undefined) {
      console.warn('Group does not have an owner and so cannot resolve paths:', this.getName());
      return
    }
    const items = [];
    paths.forEach((path) => {
      const treeItem = this.searchRoot.resolvePath(path);
      if (treeItem) items.push(treeItem);
      else {
        console.warn('Path does not resolve to an Item:', path, ' group:', this.getName());
      }
    });
    this.setItems(items);
  }

  /**
   * Uses the specified list of paths to look and get each `BaseItem` object and add it to Group's `Items` parameter.
   *
   * @param {array} paths - The paths value.
   */
  resolveItems(paths) {
    this.setPaths(paths);
  }

  /**
   * The __bindItem method.
   * @param {BaseItem} item - The item value.
   * @param {number} index - The index value.
   * @private
   */
  __bindItem(item, index) {
    if (!(item instanceof TreeItem)) return

    item.on('mouseDown', this.onMouseDown);
    item.on('mouseUp', this.onMouseUp);
    item.on('mouseMove', this.onMouseMove);
    item.on('mouseEnter', this.onMouseEnter);
    item.on('mouseLeave', this.onMouseLeave);

    // ///////////////////////////////
    // Update the Material
    const material = this.getParameter('Material').getValue();
    if (material) {
      // TODO: Bind an operator instead
      item.traverse((treeItem) => {
        if (treeItem instanceof TreeItem && treeItem.hasParameter('Material')) {
          const p = treeItem.getParameter('Material');
          if (material) {
            const m = p.getValue();
            if (m != material) {
              p.__backupMaterial = m;
              p.loadValue(material);
            }
          }
        }
      }, true);
    }

    // ///////////////////////////////
    // Update the highlight
    if (item instanceof TreeItem && this.getParameter('Highlighted').getValue()) {
      const color = this.getParameter('HighlightColor').getValue();
      color.a = this.getParameter('HighlightFill').getValue();
      item.addHighlight('groupItemHighlight' + this.getId(), color, true);
    }

    // ///////////////////////////////
    // Update the item cutaway
    const cutEnabled = this.getParameter('CutAwayEnabled').getValue();
    if (cutEnabled) {
      const cutAwayVector = this.getParameter('CutPlaneNormal').getValue();
      const cutAwayDist = this.getParameter('CutPlaneDist').getValue();
      item.traverse((treeItem) => {
        if (treeItem instanceof BaseGeomItem) {
          // console.log("cutEnabled:", treeItem.getPath(), cutAwayVector.toString(), treeItem.getParameter('Material').getValue().getShaderName())
          treeItem.setCutawayEnabled(cutEnabled);
          treeItem.setCutVector(cutAwayVector);
          treeItem.setCutDist(cutAwayDist);
        }
      }, true);
    }

    if (!this.isVisible()) {
      // Decrement the visibility counter which might cause
      // this item to become invisible. (or it might already be invisible.)
      item.propagateVisibility(-1);
    }

    // const updateGlobalXfo = () => {
    //   const initialXfoMode = this.__initialXfoModeParam.getValue()
    //   if (initialXfoMode == GROUP_XFO_MODES.first && index == 0) {
    //     this.calcGroupXfo()
    //   } else if (
    //     initialXfoMode == GROUP_XFO_MODES.average ||
    //     initialXfoMode == GROUP_XFO_MODES.globalOri
    //   ) {
    //     this.calcGroupXfo()
    //   }
    // }

    if (item instanceof TreeItem) {
      const memberGlobalXfoParam = item.getParameter('GlobalXfo');
      const memberXfoOp = new GroupMemberXfoOperator(this.getParameter('GroupTransform'), memberGlobalXfoParam);
      this.memberXfoOps.splice(index, 0, memberXfoOp);

      item.getParameter('BoundingBox').on('valueChanged', this._setBoundingBoxDirty);
      this._bindXfoDirty = true;
    }

    // this.memberXfoOps[index] = item.getParameter('GlobalXfo').getValue()
    // eventHandlers.globalXfoChanged = (event) => {
    //   // If the item's xfo changees, potentially through its own hierarchy
    //   // then we need to re-bind here.
    //   if (!this.propagatingXfoToItems) {
    //     this.memberXfoOps[index] = item.getParameter('GlobalXfo').getValue()
    //     this.groupXfoDirty = true
    //     updateGlobalXfo()
    //   }
    // }
    // item.on('globalXfoChanged', eventHandlers.globalXfoChanged)

    item.on('boundingChanged', this._setBoundingBoxDirty);

    // updateGlobalXfo()
  }

  /**
   * The __unbindItem method.
   * @param {BaseItem} item - The item value.
   * @param {number} index - The index value.
   * @private
   */
  __unbindItem(item, index) {
    if (!(item instanceof TreeItem)) return

    item.removeHighlight('branchselected' + this.getId(), true);
    if (this.getParameter('Highlighted').getValue()) {
      item.removeHighlight('groupItemHighlight' + this.getId(), true);
    }

    if (!this.isVisible()) {
      // Increment the Visibility counter which might cause
      // this item to become visible.
      // It will stay invisible if its parent is invisible, or if
      // multiple groups connect to it and say it is invisible.
      item.propagateVisibility(1);
    }

    // ///////////////////////////////
    // Update the item cutaway
    item.traverse((treeItem) => {
      if (treeItem instanceof BaseGeomItem) {
        treeItem.setCutawayEnabled(false);
      }
    }, true);

    item.off('mouseDown', this.onMouseDown);
    item.off('mouseUp', this.onMouseUp);
    item.off('mouseMove', this.onMouseMove);
    item.off('mouseEnter', this.onMouseEnter);
    item.off('mouseLeave', this.onMouseLeave);

    if (item instanceof TreeItem) {
      this.memberXfoOps[index].detach();
      this.memberXfoOps.splice(index, 1);
      this._setBoundingBoxDirty();
      this._bindXfoDirty = true;
    }

    // const eventHandlers = this.__eventHandlers[index]
    // item.off('globalXfoChanged', eventHandlers.globalXfoChanged)
    item.off('boundingChanged', this._setBoundingBoxDirty);

    // this.__eventHandlers.splice(index, 1)
  }

  /**
   * Adds an item to the group(See `Items` parameter).
   *
   * @param {BaseItem} item - The item value.
   * @param {boolean} emit - The emit value.
   */
  addItem(item, emit = true) {
    if (!item) {
      console.warn('Error adding item to group. Item is null');
      return
    }
    this.__itemsParam.addItem(item, emit);

    if (emit) {
      this.calcGroupXfo();
    }
  }

  /**
   * Removes an item from the group(See `Items` parameter).
   *
   * @param {BaseItem} item - The item value.
   * @param {boolean} emit - The emit value.
   */
  removeItem(item, emit = true) {
    this.__itemsParam.removeItem(item, emit);
    if (emit) {
      this.calcGroupXfo();
    }
  }

  /**
   * Removes all items from the group and kind of returns the object to the default state.
   *
   * @param {boolean} emit - `true` triggers `valueChanged` event.
   */
  clearItems(emit = true) {
    // Note: Unbind reversed so that indices
    // do not get changed during the unbind.
    const items = Array.from(this.__itemsParam.getValue());
    for (let i = items.length - 1; i >= 0; i--) {
      this.__unbindItem(items[i], i);
    }
    // this.__eventHandlers = []
    this.memberXfoOps = [];
    this.__itemsParam.clearItems(emit);
    if (emit) {
      this.calcGroupXfo();
    }
  }

  /**
   * Returns the list of `BaseItem` objects owned by the group.
   *
   * @return {array} - The return value.
   */
  getItems() {
    return this.__itemsParam.getValue()
  }

  /**
   * Removes old items in current group and adds new ones.
   *
   * @param {array} items - List of `BaseItem` you want to add to the group
   */
  setItems(items) {
    this.clearItems(false);
    this.__itemsParam.setItems(items);
    this.calcGroupXfo();
  }

  /**
   * The _cleanBoundingBox method.
   * @param {Box3} bbox - The bounding box value.
   * @return {Box3} - The return value.
   * @private
   */
  _cleanBoundingBox(bbox) {
    const result = super._cleanBoundingBox(bbox);
    const items = Array.from(this.__itemsParam.getValue());
    items.forEach((item) => {
      if (item instanceof TreeItem) {
        if (item.isVisible()) {
          result.addBox3(item.getParameter('BoundingBox').getValue());
        }
      }
    });
    return result
  }

  // ///////////////////////
  // Events

  /**
   * Occurs when a user presses a mouse button over an element.
   * Note: these methods are useful for debugging mouse event propagation to groups
   *
   * @private
   * @param {MouseEvent} event - The mouse event that occurs.
   */
  onMouseDown(event) {
    super.onMouseDown(event);
  }

  /**
   * Occurs when a user releases a mouse button over an element.
   * Note: these methods are useful for debugging mouse event propagation to groups
   *
   * @private
   * @param {MouseEvent} event - The mouse event that occurs.
   */
  onMouseUp(event) {
    super.onMouseUp(event);
  }

  /**
   * Occur when the mouse pointer is moving  while over an element.
   * Note: these methods are useful for debugging mouse event propagation to groups
   * @private
   * @param {MouseEvent} event - The mouse event that occurs.
   */
  onMouseMove(event) {
    super.onMouseMove(event);
  }

  // ////////////////////////////////////////
  // Persistence

  /**
   * The toJSON method encodes this type as a json object for persistence.
   *
   * @param {object} context - The context value.
   * @return {object} - Returns the json object.
   */
  toJSON(context) {
    const j = super.toJSON(context);
    const items = Array.from(this.__itemsParam.getValue());
    const treeItems = [];
    items.forEach((p) => {
      const path = p.getPath();
      treeItems.push(context ? context.makeRelative(path) : path);
    });
    j.treeItems = treeItems;
    return j
  }

  /**
   * The fromJSON method decodes a json object for this type.
   *
   * @param {object} j - The json object this item must decode.
   * @param {object} context - The context value.
   */
  fromJSON(j, context) {
    super.fromJSON(j, context);

    if (!j.treeItems) {
      console.warn('Invalid Parameter JSON');
      return
    }
    if (!context) {
      throw new Error('Unable to load JSON on a Group without a load context')
    }
    let count = j.treeItems.length;

    const addItem = (path) => {
      context.resolvePath(
        path,
        (treeItem) => {
          this.addItem(treeItem);
          count--;
          if (count == 0) {
            this.calculatingGroupXfo = true;
            this.calcGroupXfo();
            this.calculatingGroupXfo = false;
          }
        },
        (reason) => {
          console.warn("Group: '" + this.getName() + "'. Unable to load item:" + path);
        }
      );
    };
    for (const path of j.treeItems) {
      addItem(path);
    }
  }

  // ////////////////////////////////////////
  // Clone and Destroy

  /**
   * The clone method constructs a new group,
   * copies its values and returns it.
   *
   * @return {Group} - Returns a new cloned group.
   */
  clone() {
    const cloned = new Group();
    cloned.copyFrom(this);
    return cloned
  }

  /**
   * Copies current Group with all owned items.
   *
   * @param {Group} src - The group to copy from.
   */
  copyFrom(src) {
    super.copyFrom(src);
  }
}

Registry.register('Group', Group);

/* eslint-enable */

// import {
//     parseGeomsBinary
// } from './Geometry/parseGeomsBinary.js';

/** Class representing a geometry library.
 * @private
 */
class GeomLibrary extends EventEmitter {
  /**
   * Create a geom library.
   */
  constructor() {
    super();
    this.__streamInfos = {};
    this.__genBuffersOpts = {};

    this.__workers = [];
    this.__nextWorker = 0;

    {
      for (let i = 0; i < 3; i++) {
        this.__workers.push(this.__constructWorker());
      }
    }

    this.clear();
  }

  /**
   * The clear method.
   */
  clear() {
    this.__loaded = 0;
    this.__numGeoms = 0;
    this.geoms = [];
  }

  /**
   * The __constructWorker method.
   * @return {GeomParserWorker} - Returns a GeomParserWorker.
   * @private
   */
  __constructWorker() {
    const worker = new WorkerFactory$1();
    worker.onmessage = (event) => {
      this.__recieveGeomDatas(event.data.key, event.data.geomDatas, event.data.geomIndexOffset, event.data.geomsRange);
    };
    return worker
  }

  /**
   * The __terminateWorkers method.
   * @private
   */
  __terminateWorkers() {
    for (const worker of this.__workers) worker.terminate();
    this.__workers = [];
  }

  /**
   * The setGenBufferOption method.
   * @param {any} key - The key value.
   * @param {any} value - The value param.
   */
  setGenBufferOption(key, value) {
    this.__genBuffersOpts[key] = value;
  }

  /**
   * The setNumGeoms method.
   * @param {any} expectedNumGeoms - The expectedNumGeoms value.
   */
  setNumGeoms(expectedNumGeoms) {
    this.__numGeoms = expectedNumGeoms;
  }

  /**
   * The getGeom method.
   * @param {number} index - The index value.
   * @return {any} - The return value.
   */
  getGeom(index) {
    if (index >= this.geoms.length) {
      // console.warn("Geom index invalid:" + index);
      return null
    }
    return this.geoms[index]
  }

  /**
   * The loadUrl method.
   * @param {any} fileUrl - The fileUrl value.
   */
  loadUrl(fileUrl) {
    loadBinfile(
      fileUrl,
      (data) => {
        this.loadBin(data);
      },
      (statusText) => {
        console.warn(statusText);
      }
    );
  }

  /**
   * The readBinaryBuffer method.
   * @param {any} key - The key value.
   * @param {ArrayBuffer} buffer - The buffer value.
   * @param {object} context - The context value.
   * @return {any} - The return value.
   */
  readBinaryBuffer(key, buffer, context) {
    const isMobile = SystemDesc.isMobileDevice;
    const reader = new BinReader(buffer, 0, isMobile);
    const numGeoms = reader.loadUInt32();
    const geomIndexOffset = reader.loadUInt32();
    this.__streamInfos[key] = {
      total: numGeoms,
      done: 0,
    };

    if (numGeoms == 0) {
      this.emit('streamFileParsed', {});
      return numGeoms
    }
    if (this.__numGeoms == 0) {
      // Note: for loading geom streams, we need to know the total number
      // ahead of time to be able to generate accurate progress reports.
      this.__numGeoms = numGeoms;
      // throw("Loading cannot start will we know how many geomms.");
    }

    const toc = reader.loadUInt32Array(numGeoms);

    let numCores = window.navigator.hardwareConcurrency;
    if (!numCores) {
      if (isMobile) numCores = 2;
      else numCores = 4;
    }
    const numGeomsPerWorkload = Math.max(1, Math.floor(numGeoms / numCores + 1));

    // TODO: Use SharedArrayBuffer once available.
    // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/SharedArrayBuffer

    let offset = 0;
    while (offset < numGeoms) {
      const bufferSlice_start = toc[offset];
      let bufferSlice_end;
      let geomsRange;
      if (offset + numGeomsPerWorkload >= numGeoms) {
        geomsRange = [offset, numGeoms];
        bufferSlice_end = buffer.byteLength;
      } else {
        geomsRange = [offset, offset + numGeomsPerWorkload];
        bufferSlice_end = toc[geomsRange[1]];
      }
      const bufferSlice = buffer.slice(bufferSlice_start, bufferSlice_end);
      offset += numGeomsPerWorkload;

      // ////////////////////////////////////////////
      // Multi Threaded Parsing
      {
        this.__workers[this.__nextWorker].postMessage(
          {
            key,
            toc,
            geomIndexOffset,
            geomsRange,
            isMobileDevice: reader.isMobileDevice,
            bufferSlice,
            genBuffersOpts: this.__genBuffersOpts,
            context: {
              versions: context.versions,
            },
          },
          [bufferSlice]
        );
        this.__nextWorker = (this.__nextWorker + 1) % this.__workers.length;
      }
    }
    return numGeoms
  }

  /**
   * The __recieveGeomDatas method.
   * @param {any} key - The key value.
   * @param {any} geomDatas - The geomDatas value.
   * @param {any} geomIndexOffset - The offset of the file geoms in the asset.
   * @param {any} geomsRange - The range of geoms in the bin file.
   * @private
   */
  __recieveGeomDatas(key, geomDatas, geomIndexOffset, geomsRange) {
    // We are storing a subset of the geoms from a binary file
    // which is a subset of the geoms in an asset.
    // geomIndexOffset: the offset of the file geoms in the asset.
    // geomsRange: the range of geoms in the bin file.
    const offset = geomIndexOffset + geomsRange[0];
    const storedRange = [offset, geomIndexOffset + geomsRange[1]];

    for (let i = 0; i < geomDatas.length; i++) {
      const geomData = geomDatas[i];
      if (!geomData.type) continue
      let proxy;
      switch (geomData.type) {
        case 'Points':
          proxy = new PointsProxy(geomData);
          break
        case 'Lines':
          proxy = new LinesProxy(geomData);
          break
        case 'Mesh':
        case 'Plane': // TODO: Support procedural shape params
        case 'Sphere':
        case 'Cone':
          proxy = new MeshProxy(geomData);
          break
        default:
          throw new Error('Unsupported Geom type:' + className)
      }
      this.geoms[offset + i] = proxy;
    }
    this.emit('rangeLoaded', { range: storedRange });

    const loaded = storedRange[1] - storedRange[0];
    // console.log("GeomLibrary Loaded:" + loaded);

    // Each file in the stream has its own counter for the number of
    // geoms, and once each stream file finishes parsing, we fire a signal.
    const streamInfo = this.__streamInfos[key];
    streamInfo.done += loaded;
    // console.log(key + " Loaded:" + streamInfo.done + " of :" + streamInfo.total);
    if (streamInfo.done == streamInfo.total) {
      this.emit('streamFileParsed', { count: 1 });
    }

    // Once all the geoms from all the files are loaded and parsed
    // fire the loaded signal.
    this.__loaded += loaded;
    // console.log("this.__loaded:" + this.__loaded +" this.__numGeoms:" + this.__numGeoms);
    if (this.__loaded == this.__numGeoms) {
      // console.log("GeomLibrary Loaded:" + this.__name + " count:" + geomDatas.length + " loaded:" + this.__loaded);
      this.__terminateWorkers();
      this.emit('loaded');
    }
  }

  // ////////////////////////////////////////
  // Persistence

  /**
   * The toJSON method encodes this type as a json object for persistences.
   * @return {object} - Returns the json object.
   */
  toJSON() {
    return {
      numGeoms: this.geoms.length(),
    }
  }

  /**
   * The toString method.
   * @return {any} - The return value.
   */
  toString() {
    return JSON.stringify(this.toJSON(), null, 2)
  }
}

/** Class representing a material library in a scene tree.
 * @private
 */
class MaterialLibrary extends EventEmitter {
  /**
   * Create a material library.
   * @param {string} name - The name of the material library.
   */
  constructor(name = 'MaterialLibrary') {
    super();
    this.__name = name;

    this.lod = 0;
    if (SystemDesc.isMobileDevice) this.lod = 1;
    this.clear();
  }

  /**
   * The clear method.
   */
  clear() {
    this.__images = {};
    this.__materials = {
      Default: new Material('Default', 'SimpleSurfaceShader'),
    };
  }

  /**
   * The getPath method.
   * @return {any} - The return value.
   */
  getPath() {
    return [this.__name]
  }

  /**
   * The getNumMaterials method.
   * @return {any} - The return value.
   */
  getNumMaterials() {
    return Object.keys(this.__materials).length
  }

  /**
   * The getMaterials method.
   * @return {any} - The return value.
   */
  getMaterials() {
    return Object.values(this.__materials)
  }

  /**
   * The getMaterialNames method.
   * @return {any} - The return value.
   */
  getMaterialNames() {
    const names = [];
    for (const name in this.__materials) {
      names.push(name);
    }
    return names
  }

  /**
   * The hasMaterial method.
   * @param {string} name - The name value.
   * @return {any} - The return value.
   */
  hasMaterial(name) {
    return name in this.__materials
  }

  /**
   * Add a material.
   * @param {Material} material - The material value.
   */
  addMaterial(material) {
    material.setOwner(this);
    this.__materials[material.getName()] = material;
  }

  /**
   * The getMaterial method.
   * @param {string} name - The material name.
   * @param {Boolean} assert - The assert value.
   * @return {any} - The return value.
   */
  getMaterial(name, assert = true) {
    const res = this.__materials[name];
    if (!res && assert) {
      throw new Error('Material:' + name + ' not found in library:' + this.getMaterialNames())
    }
    return res
  }

  /**
   * The hasImage method.
   * @param {string} name - The material name.
   * @return {any} - The return value.
   */
  hasImage(name) {
    return name in this.__images
  }

  /**
   * The addImage method.
   * @param {any} image - The image value.
   */
  addImage(image) {
    image.setOwner(this);
    this.__images[image.getName()] = image;
  }

  /**
   * The getImage method.
   * @param {string} name - The material name.
   * @param {boolean} assert - The assert value.
   * @return {any} - The return value.
   */
  getImage(name, assert = true) {
    const res = this.__images[name];
    if (!res && assert) {
      throw new Error('Image:' + name + ' not found in library:' + this.getImageNames())
    }
    return res
  }

  /**
   * The getImageNames method.
   * @return {any} - The return value.
   */
  getImageNames() {
    const names = [];
    for (const name in this.__images) {
      names.push(name);
    }
    return names
  }

  // ////////////////////////////////////////
  // Persistence

  /**
   * The load method.
   * @param {any} filePath - The file path.
   */
  load(filePath) {
    const xhr = new XMLHttpRequest();
    xhr.open('GET', filePath, true);
    xhr.ontimeout = () => {
      throw new Error('The request for ' + filePath + ' timed out.')
    };
    xhr.onload = () => {
      if (xhr.readyState === 4) {
        if (xhr.status === 200) {
          this.fromJSON(JSON.parse(xhr.responseText));
        } else {
          console.warn(xhr.statusText);
        }
      }
    };
    xhr.send(null);
  }

  /**
   * The toJSON method encodes the current object as a json object.
   * @param {object} context - The context value.
   * @return {object} - Returns the json object.
   */
  toJSON(context = {}) {
    return {
      numMaterials: this.geoms.length(),
    }
  }

  /**
   * The fromJSON method decodes a json object for this type.
   * @param {object} j - The json object this item must decode.
   * @param {object} context - The context value.
   */
  fromJSON(j, context = {}) {
    context.lod = this.lod;
    for (const name in j.textures) {
      const image = new FileImage$1(name);
      image.fromJSON(j.textures[name]);
      this.__images[name] = texture;
    }
    for (const name in j.materials) {
      const material = new Material(name);
      material.fromJSON(j.materials[name]);
      this.addMaterial(material);
    }
  }

  /**
   * The readBinary method.
   * @param {object} reader - The reader value.
   * @param {object} context - The context value.
   */
  readBinary(reader, context = {}) {
    // if (context.version == undefined) context.version = 0

    this.name = reader.loadStr();

    // Specify the Lod to load the images in this library.
    context.lod = this.lod;
    context.materialLibrary = this;

    const numTextures = reader.loadUInt32();
    for (let i = 0; i < numTextures; i++) {
      const type = reader.loadStr();
      const texture = Registry.constructClass(type, undefined);
      texture.readBinary(reader, context);
      this.__images[texture.getName()] = texture;
    }
    const numMaterials = reader.loadUInt32();
    if (numMaterials > 0) {
      const toc = reader.loadUInt32Array(numMaterials);
      for (let i = 0; i < numMaterials; i++) {
        const material = new Material('');
        reader.seek(toc[i]); // Reset the pointer to the start of the item data.
        material.readBinary(reader, context, this.__images);
        this.addMaterial(material);
      }
    }

    this.emit('loaded', {});
  }

  /**
   * The toString method.
   * @return {any} - The return value.
   */
  toString() {
    return JSON.stringify(this.toJSON(), null, 2)
  }
}

/**
 * Represents a TreeItem with rendering and material capabilities.
 *
 * @extends TreeItem
 */
class AssetItem extends TreeItem {
  /**
   * Create an asset item.
   * @param {string} name - The name of the asset item.
   */
  constructor(name) {
    super(name);

    this.__geomLibrary = new GeomLibrary();
    this.__materials = new MaterialLibrary();
    this.loaded = false;
  }

  /**
   * Returns the loaded status of current item.
   *
   * @return {boolean} - Returns true if the asset has already loaded its data.
   */
  isLoaded() {
    return this.loaded
  }

  /**
   * Returns the zea engine version as an array with major, minor, patch order.
   *
   * @return {array} - The return value.
   */
  getEngineDataVersion() {
    return this.__engineDataVersion
  }

  /**
   * Returns asset `GeomLibrary` that is in charge of rendering geometry data using workers.
   *
   * @return {GeomLibrary} - The return value.
   */
  getGeometryLibrary() {
    return this.__geomLibrary
  }

  /**
   * Returns `MaterialLibrary` that is in charge of storing all materials of current Item.
   *
   * @return {MaterialLibrary} - The return value.
   */
  getMaterialLibrary() {
    return this.__materials
  }

  /**
   * Returns the scale factor of current item.
   * @return {number} - The return value.
   */
  getUnitsConversion() {
    return this.__unitsScale
  }

  // ////////////////////////////////////////
  // Persistence

  /**
   * The readBinary method.
   * @param {object} reader - The reader value.
   * @param {object} context - The context value.
   */
  readBinary(reader, context = {}) {
    context.assetItem = this;
    context.numTreeItems = 0;
    context.numGeomItems = 0;

    if (!context.versions['zea-engine']) {
      context.versions['zea-engine'] = new Version(reader.loadStr());
    }
    this.__engineDataVersion = context.versions['zea-engine'];
    console.log('Loading Engine File version:', context.versions['zea-engine']);

    let layerRoot;
    const layers = {};
    context.addGeomToLayer = (geomItem, layer) => {
      if (!layers[layer]) {
        if (!layerRoot) {
          layerRoot = new TreeItem('Layers');
          this.addChild(layerRoot, false);
        }
        const group = new Group(layer);
        group.propagateXfoToItems = false;
        layerRoot.addChild(group, false);
        layers[layer] = group;
      }
      layers[layer].addItem(geomItem);
    };
    const loadUnits = () => {
      this.__units = reader.loadStr();
      // Calculate a scale factor to convert
      // the asset units to meters(the scene units)
      let scaleFactor = 1.0;
      switch (this.__units) {
        case 'Millimeters':
          scaleFactor = 0.001;
          break
        case 'Centimeters':
          scaleFactor = 0.01;
          break
        case 'Meters':
          scaleFactor = 1.0;
          break
        case 'Kilometers':
          scaleFactor = 1000.0;
          break
        case 'Inches':
          scaleFactor = 0.0254;
          break
        case 'Feet':
          scaleFactor = 0.3048;
          break
        case 'Miles':
          scaleFactor = 1609.34;
          break
      }
      this.__unitsScale = scaleFactor;

      // Apply units change to existing Xfo (avoid changing tr).
      const localXfoParam = this.getParameter('LocalXfo');
      const xfo = localXfoParam.getValue();
      xfo.sc.scaleInPlace(scaleFactor);
      localXfoParam.setValue(xfo);
    };

    if (context.versions['zea-engine'].greaterThan([0, 0, 6])) {
      // Loading units modifies our Xfo, which then propagates up
      // the tree forcing a re-computation. Better just do it at
      // the start.
      loadUnits();
    }

    this.__materials.readBinary(reader, context);

    super.readBinary(reader, context);

    if (
      context.versions['zea-engine'].greaterOrEqualThan([0, 0, 5]) &&
      context.versions['zea-engine'].lessThan([0, 0, 7])
    ) {
      loadUnits();
    }

    // console.log("numTreeItems:", context.numTreeItems, " numGeomItems:", context.numGeomItems)
  }

  /**
   * The toJSON method encodes this type as a json object for persistence.
   *
   * @param {object} context - The context value.
   * @return {object} - Returns the json object.
   */
  toJSON(context = {}) {
    context.makeRelative = (path) => {
      const assetPath = this.getPath();
      const start = path.slice(0, assetPath.length);
      for (let i = 0; i < start.length - 1; i++) {
        if (start[i] != assetPath[i]) {
          console.warn('Param Path is not relative to the asset. May not be able to be resolved at load time:' + path);
          return path
        }
      }
      // Relative paths start with a symbol for the root element.
      const relativePath = path.slice(assetPath.length - 1);
      relativePath[0] = '.';
      return relativePath
    };
    context.assetItem = this;
    const j = super.toJSON(context);
    return j
  }

  /**
   * The fromJSON method decodes a json object for this type.
   *
   * @param {object} j - The json object this item must decode.
   * @param {object} context - The context value.
   * @param {function} onDone - Callback function executed when everything is done.
   */
  fromJSON(j, context = {}, onDone) {
    if (!context) context = {};

    context.assetItem = this;
    context.numTreeItems = 0;
    context.numGeomItems = 0;
    if (context.version == undefined) context.version = 0;

    context.assetItem = this;

    const plcbs = []; // Post load callbacks.
    context.resolvePath = (path, cb) => {
      // Note: Why not return a Promise here?
      // Promise evaluation is always async, so
      // all promisses will be resolved after the current call stack
      // has terminated. In our case, we want all paths
      // to be resolved before the end of the function, which
      // we can handle easily with callback functions.
      if (!path) throw new Error('Path not spcecified')
      const item = this.resolvePath(path);
      if (item) {
        cb(item);
      } else {
        // Some paths resolve to items generated during load,
        // so push a callback to re-try after the load is complete.
        plcbs.push(() => {
          const param = this.resolvePath(path);
          if (param) cb(param);
          else {
            console.warn('Path unable to be resolved:' + path);
          }
        });
      }
    };
    context.addPLCB = (plcb) => plcbs.push(plcb);

    // Avoid loading the FilePath as we are already loading json data.
    // if (j.params && j.params.FilePath) {
    //   delete j.params.FilePath
    // }

    super.fromJSON(j, context);

    // Invoke all the post-load callbacks to resolve any
    // remaning references.
    for (const cb of plcbs) cb();

    if (onDone) onDone();
  }
}

Registry.register('AssetItem', AssetItem);

/**
 * A special type of TreeItem(Item with hierarchical abilities) class that represents a banner in a 2D dimension.
 * Can own any type of `BaseImage`.
 * <br>
 * <br>
 * **Parameters**
 * * **Image(`ImageParameter`):** Is the BaseImage you want to display on the board.
 * * **PixelsPerMeter(`NumberParameter`):** Quality and Size of the board. The bigger the number, the smaller the board.
 * * **Alpha(`NumberParameter`):** Transparency of the board, from 0 to 1.
 * * **AlignedToCamera(`BooleanParameter`):** Faces or not the board to the camera at all time(Moves with camera movement).
 * * **DrawOnTop(`BooleanParameter`):** _todo_
 *
 * @extends TreeItem
 */
class BillboardItem extends TreeItem {
  /**
   * Creates a billboard item.
   *
   * @param {string} name - The name of the billboard item.
   * @param {BaseImage} image - The image value.
   */
  constructor(name, image) {
    super(name);
    const imageParam = this.addParameter(new ImageParameter('Image'));
    if (image) imageParam.setValue(image); // Note: this dirties the param and will ensure it is saved to JSON
    this.addParameter(new NumberParameter('PixelsPerMeter', 1000.0));
    this.addParameter(new NumberParameter('Alpha', 1.0));
    this.addParameter(new ColorParameter('Color', new Color(1.0, 1.0, 1.0)));
    this.addParameter(new BooleanParameter('AlignedToCamera', false));
    this.addParameter(new BooleanParameter('DrawOnTop', false));
  }
}

Registry.register('BillboardItem', BillboardItem);

/* eslint-disable no-unused-vars */

/**
 * Represents a view of the scene vertex coordinates. Since it is a `TreeItem`,
 * translation modifiers are supported, so you can move the camera around.
 *
 * **Parameters**
 * * **isOrthographic(`BooleanParameter`):** Special type of view that represents 3D objects in two dimensions; `true` to enable.
 * * **fov(`NumberParameter`):** _todo_
 * * **near(`NumberParameter`):** _todo_
 * * **far(`NumberParameter`):** _todo_
 * * **focalDistance(`NumberParameter`):** _todo_
 *
 * **Events**
 * * **projectionParamChanged:** _todo_
 * * **movementFinished:** Triggered when framing all the objects.
 * @extends TreeItem
 */
class Camera extends TreeItem {
  /**
   * Instantiates a camera object, setting default configuration like zoom, target and positioning.
   *
   * @param {string} name - The name of the camera.
   */
  constructor(name = undefined) {
    if (name == undefined) name = 'Camera';
    super(name);

    this.__isOrthographicParam = this.addParameter(new BooleanParameter('isOrthographic', false));
    this.__fovParam = this.addParameter(new NumberParameter('fov', 1.0));
    this.__nearParam = this.addParameter(new NumberParameter('near', 0.1));
    this.__farParam = this.addParameter(new NumberParameter('far', 1000.0));
    this.__focalDistanceParam = this.addParameter(new NumberParameter('focalDistance', 5.0));

    // this.__viewMatParam = this.addParameter(new Parameter('viewMat', new Mat4()));
    // const _cleanViewMat = (xfo)=>{
    //     return this.__globalXfoParam.getValue().inverse().toMat4();
    // }
    // this.__globalXfoParam.on('valueChanged', (changeType)=>{
    //     this.__viewMatParam.setDirty(_cleanViewMat);
    // });

    const emitProjChanged = (event) => {
      this.emit('projectionParamChanged', event);
    };
    this.__isOrthographicParam.on('valueChanged', emitProjChanged);
    this.__fovParam.on('valueChanged', emitProjChanged);
    this.__nearParam.on('valueChanged', emitProjChanged);
    this.__farParam.on('valueChanged', emitProjChanged);

    // Initial viewing coords of a person standing 3 meters away from the
    // center of the stage looking at something 1 meter off the ground.
    this.setPositionAndTarget(new Vec3$1(3, 3, 1.75), new Vec3$1(0, 0, 1));
    this.setLensFocalLength('28mm');
  }

  // ////////////////////////////////////////////
  // Getters/setters.

  /**
   * Returns `near` parameter value.
   *
   * @return {number} - Returns the near value.
   */
  getNear() {
    return this.__nearParam.getValue()
  }

  /**
   * Sets `near` parameter value
   *
   * @param {number} value - The near value.
   */
  setNear(value) {
    this.__nearParam.setValue(value);
  }

  /**
   * Returns `far` parameter value.
   *
   * @return {number} - Returns the far value.
   */
  getFar() {
    return this.__farParam.getValue()
  }

  /**
   * Sets `far` parameter value
   *
   * @param {number} value - The far value.
   */
  setFar(value) {
    this.__farParam.setValue(value);
  }

  /**
   * Getter for the camera field of view (FOV).
   * The FOV is how much of the scene the camera can see at once.
   *
   * @return {number} - Returns the FOV value.
   */
  getFov() {
    return this.__fovParam.getValue()
  }

  /**
   * Setter for the camera field of view (FOV).
   * The FOV is how much of the scene the camera can see at once.
   *
   * @param {number} value - The FOV value.
   */
  setFov(value) {
    this.__fovParam.setValue(value);
  }

  /**
   * Setter for the camera lens focal length. Updates `fov` parameter value after a small math procedure.
   *
   * **Focal Lenth accepted values:** 10mm, 11mm, 12mm, 14mm, 15mm, 17mm, 18mm,
   * 19mm, 20mm, 24mm, 28mm, 30mm, 35mm, 45mm, 50mm, 55mm, 60mm, 70mm, 75mm, 80mm,
   * 85mm, 90mm, 100mm, 105mm, 120mm, 125mm, 135mm, 150mm, 170mm, 180mm, 210mm, 300mm,
   * 400mm, 500mm, 600mm, 800mm
   *
   * @param {string} value - The lens focal length value.
   */
  setLensFocalLength(value) {
    // https://www.nikonians.org/reviews/fov-tables
    const mapping = {
      '10mm': 100.4,
      '11mm': 95.0,
      '12mm': 90.0,
      '14mm': 81.2,
      '15mm': 77.3,
      '17mm': 70.4,
      '18mm': 67.4,
      '19mm': 64.6,
      '20mm': 61.9,
      '24mm': 53.1,
      '28mm': 46.4,
      '30mm': 43.6,
      '35mm': 37.8,
      '45mm': 29.9,
      '50mm': 27.0,
      '55mm': 24.6,
      '60mm': 22.6,
      '70mm': 19.5,
      '75mm': 18.2,
      '80mm': 17.1,
      '85mm': 16.1,
      '90mm': 15.2,
      '100mm': 13.7,
      '105mm': 13.0,
      '120mm': 11.4,
      '125mm': 11.0,
      '135mm': 10.2,
      '150mm': 9.1,
      '170mm': 8.1,
      '180mm': 7.6,
      '210mm': 6.5,
      '300mm': 4.6,
      '400mm': 3.4,
      '500mm': 2.7,
      '600mm': 2.3,
      '800mm': 1.7,
    };
    if (!value in mapping) {
      console.warn('Camera lense focal length not suported:' + value);
      return
    }
    this.__fovParam.setValue(MathFunctions.degToRad(mapping[value]));
  }

  /**
   * Returns `focalDistance` parameter value.
   *
   * @return {number} - Returns the lens focal length value..
   */
  getFocalDistance() {
    return this.__focalDistanceParam.getValue()
  }

  /**
   * Sets `focalDistance` parameter value.
   *
   * @errors on dist value lower or less than zero.
   * @param {number} dist - The focal distance value.
   */
  setFocalDistance(dist) {
    if (dist < 0.0001) console.error('Never set focal distance to zero');
    this.__focalDistanceParam.setValue(dist);
    this.__nearParam.setValue(dist * 0.01);
    this.__farParam.setValue(dist * 200.0);
  }

  /**
   * Returns `isOrthographic` parameter value.
   * @return {boolean} - The return value.
   */
  getIsOrthographic() {
    return this.__isOrthographicParam.getValue()
  }

  /**
   * Sets `focalDistance` parameter value.
   *
   * @param {boolean} value - The value param.
   */
  setIsOrthographic(value) {
    this.__isOrthographicParam.setValue(value);
  }

  /**
   * Setter for the camera postion and target.
   * As described at the start of the class, this is a `TreeItem`,
   * which means we can move it around using translation modifiers.
   * You can do it this way or using the changing `TreeItem` parameters,
   * although we recommend this one because it also changes focal distance.
   *
   * @param {Vec3} position - The position of the camera.
   * @param {Vec3} target - The target of the camera.
   */
  setPositionAndTarget(position, target) {
    this.setFocalDistance(position.distanceTo(target));
    const xfo = new Xfo();
    xfo.setLookAt(position, target, new Vec3$1(0.0, 0.0, 1.0));
    this.getParameter('GlobalXfo').setValue(xfo);
  }

  /**
   * Getter for the target position.
   * @return {Vec3} - Returns the target position.
   */
  getTargetPostion() {
    const focalDistance = this.__focalDistanceParam.getValue();
    const xfo = this.getParameter('GlobalXfo').getValue();
    const target = xfo.ori.getZaxis();
    target.scaleInPlace(-focalDistance);
    target.addInPlace(xfo.tr);
    return target
  }

  // ///////////////////////////

  /**
   * Calculates a new bounding box for all the items passed in `treeItems` array
   * and moves the camera to a point where we can see all of them, preserving parameters configurations.
   *
   * @param {GLBaseViewport} viewport - The viewport value.
   * @param {array} treeItems - The treeItems value.
   */
  frameView(viewport, treeItems) {
    const boundingBox = new Box3$1();
    for (const treeItem of treeItems) {
      boundingBox.addBox3(treeItem.getParameter('BoundingBox').getValue());
    }

    if (!boundingBox.isValid()) {
      console.warn('Bounding box not valid.');
      return
    }
    const focalDistance = this.__focalDistanceParam.getValue();
    const fovY = this.__fovParam.getValue();

    const globalXfo = this.getParameter('GlobalXfo').getValue().clone();
    const cameraViewVec = globalXfo.ori.getZaxis();
    const targetOffset = cameraViewVec.scale(-focalDistance);
    const currTarget = globalXfo.tr.add(targetOffset);
    const newTarget = boundingBox.center();

    const pan = newTarget.subtract(currTarget);
    globalXfo.tr.addInPlace(pan);

    // Transform the bounding box into camera space.
    const transformedBBox = new Box3$1();
    transformedBBox.addBox3(boundingBox, globalXfo.inverse());
    const camSpaceTarget = transformedBBox.center();

    const fovX = fovY * (viewport.getWidth() / viewport.getHeight());

    // p1 is the closest corner of the transformed bbox.
    const p = transformedBBox.p1;
    const newFocalDistanceX = (Math.abs(p.x) / Math.tan(0.5 * fovX)) * 1.2;
    const newFocalDistanceY = (Math.abs(p.y) / Math.tan(0.5 * fovY)) * 1.2;

    const camSpaceBBoxDepth = (transformedBBox.p0.z - transformedBBox.p1.z) * -0.5;
    const newFocalDistance = Math.max(newFocalDistanceX, newFocalDistanceY) + camSpaceBBoxDepth;

    const dollyDist = newFocalDistance - focalDistance;
    globalXfo.tr.addInPlace(cameraViewVec.scale(dollyDist));

    this.setFocalDistance(newFocalDistance);
    this.getParameter('GlobalXfo').setValue(globalXfo);
    this.emit('movementFinished');
  }

  /**
   * Sets camera perspective from a Mat4 object.
   *
   * @param {Mat4} mat - The mat value.
   * @param {number} aspect - The aspect value.
   */
  updateProjectionMatrix(mat, aspect) {
    const isOrthographic = this.__isOrthographicParam.getValue();
    const fov = this.__fovParam.getValue();
    const near = this.__nearParam.getValue();
    const far = this.__farParam.getValue();
    mat.setPerspectiveMatrix(fov, aspect, near, far);
  }
}

Registry.register('Camera', Camera);

/**
 * Class in charge of loading file resources, holding a reference to all of them.
 * Manages workers, callbacks, resource tree and entities.
 *
 * @private
 */
class DriveAdapter {
  /**
   * Create a resource loader.
   */
  constructor(resources) {
    this.__resources = {};
    this.__resourcesTreeEntities = {};
    this.__resourcesTree = {
      children: {},
    };
    this.__resourceRegisterCallbacks = {};

    let baseUrl;
    if (globalThis.navigator) {
      const scripts = document.getElementsByTagName('script');
      for (let i = 0; i < scripts.length; i++) {
        const script = scripts[i];
        if (script.src.includes('zea-engine')) {
          const parts = script.src.split('/');
          parts.pop();
          parts.pop();
          baseUrl = parts.join('/');
          break
        }
      }
      if (!baseUrl) {
        baseUrl = 'https://unpkg.com/@zeainc/zea-engine@0.1.3';
      }
      this.addResourceURL('ZeaEngine/Vive.vla', baseUrl + '/public-resources/Vive.vla');
      this.addResourceURL('ZeaEngine/Oculus.vla', baseUrl + '/public-resources/Oculus.vla');
    }

    if (!baseUrl) {
      baseUrl = 'https://unpkg.com/@zeainc/zea-engine@0.1.3';
    }
    this.addResourceURL('ZeaEngine/Vive.vla', baseUrl + '/public-resources/Vive.vla');
    this.addResourceURL('ZeaEngine/Oculus.vla', baseUrl + '/public-resources/Oculus.vla');

    if (resources) {
      this.setResources(resources);
    }
  }

  /**
   * Returns the resources tree object.
   *
   * @return {object} - The return value.
   */
  getRootFolder() {
    return this.__resourcesTree
  }

  /**
   * The registerResourceCallback method.
   * @param {string} filter - The filter value.
   * @param {function} fn - The fn value.
   */
  registerResourceCallback(filter, fn) {
    this.__resourceRegisterCallbacks[filter] = fn;
    // eslint-disable-next-line guard-for-in
    for (const key in this.__resources) {
      const file = this.__resources[key];
      if (file.name.includes(filter)) fn(file);
    }
  }

  /**
   * The __applyCallbacks method.
   * @param {object} resourcesDict - The resourcesDict value.
   * @private
   */
  __applyCallbacks(resourcesDict) {
    const applyCallbacks = (resource) => {
      for (const filter in this.__resourceRegisterCallbacks) {
        if (resource.name.includes(filter)) this.__resourceRegisterCallbacks[filter](resource);
      }
    };
    for (const key in resourcesDict) {
      const resource = resourcesDict[key];
      if (resource.url) applyCallbacks(resource);
    }
  }

  /**
   * The __buildTree method.
   * @param {object} resources - The resources param.
   * @private
   */
  __buildTree(resources) {
    const buildEntity = (resourceId) => {
      if (this.__resourcesTreeEntities[resourceId]) return

      const resource = resources[resourceId];
      resource.id = resourceId;
      if (resource.type === 'folder' || resource.type === 'dependency') {
        resource.children = {};
      }
      if (resource.parent) {
        if (!this.__resourcesTreeEntities[resource.parent]) {
          buildEntity(resource.parent);
        }
      }
      const parent = resource.parent ? this.__resourcesTreeEntities[resource.parent] : this.__resourcesTree;
      // console.log((parent.name ? parent.name + '/' : '') + resource.name)
      parent.children[resource.name] = resource;
      this.__resourcesTreeEntities[resourceId] = resource;
    };

    // eslint-disable-next-line guard-for-in
    for (const key in resources) {
      buildEntity(key);
    }
  }

  /**
   * The setResources method.
   * @param {object} resources - The resources value.
   */
  setResources(resources) {
    this.__resources = Object.assign(this.__resources, resources);
    this.__buildTree(resources);
    this.__applyCallbacks(resources);
  }

  /**
   * The addResourceURL method.
   * @param {string} resourcePath - The resourcePath value.
   * @param {string} url - The url value.
   */
  addResourceURL(resourcePath, url) {
    const parts = resourcePath.split('/');
    const filename = parts.pop();
    if (!url) {
      let rootURL = window.location.href.split('#')[0];
      rootURL = rootURL.split('?')[0];
      if (rootURL.endsWith('.html') || rootURL.endsWith('.html')) {
        rootURL = rootURL.substring(0, rootURL.lastIndexOf('/')) + '/';
      }
      const base = rootURL;
      if (parts[0] == '.') parts.shift();
      else if (parts[0] == '..') {
        item = item.substring(3);
        const baseparts = base.split('/');
        baseparts.pop();
        baseparts.pop();
        base = baseparts.join('/') + '/';
      }
      url = base + resourcePath;
    }
    let parentId;
    const tmp = {};
    for (const part of parts) {
      const key = StringFunctions.hashStr(part);
      if (!(key in this.__resources)) {
        this.__resources[key] = {
          name: part,
          type: 'folder',
          parent: parentId,
        };
        tmp[key] = this.__resources[key];
      }
      parentId = key;
    }

    const key = StringFunctions.hashStr(filename);
    const resource = {
      name: filename,
      url,
      parent: parentId,
      id: key,
    };
    this.__resources[key] = resource;

    tmp[key] = resource;

    this.__buildTree(tmp);
    this.__applyCallbacks(tmp);
  }

  /**
   * The updateFile method.
   * @param {object} file - The file value.
   */
  updateFile(file) {
    const newFile = !(file.id in this.__resources);
    this.__resources[file.id] = file;
    if (newFile) {
      console.log('New file added');
      const resources = {};
      resources[file.id] = file;
      this.__buildTree(resources);
    }
    this.emit('fileUpdated', { fileId: file.id });
  }

  /**
   * Returns complete file path.
   *
   * @param {string} resourceId - The resourceId value.
   * @return {string} - The return value.
   */
  getFilepath(resourceId) {
    let curr = this.__resources[resourceId];
    const path = [curr.name];
    while (curr.parent) {
      curr = this.__resources[curr.parent];
      path.splice(0, 0, curr.name);
    }
    return path.join('/')
  }

  /**
   * The resourceAvailable method.
   *
   * @param {string} resourceId - The resourceId value.
   * @return {boolean} - The return value.
   */
  resourceAvailable(resourceId) {
    if (resourceId.indexOf('.') > 0) {
      console.warn('Deprecation warning for resourceAvailable. Value should be a file id, not a path.');
      return this.resolveFilepath(resourceId) != undefined
    }
    return resourceId in this.__resources
  }

  /**
   * The getFile method.
   * @param {string} resourceId - The resourceId value.
   * @return {object} - The return value.
   */
  getFile(resourceId) {
    return this.__resources[resourceId]
  }

  /**
   * The resolveFilepath method.
   * @param {string} filePath - The filePath value.
   * @return {object} - The return value.
   */
  resolveFileId(value) {
    const parts = value.split('/');
    if (parts[0] == '.' || parts[0] == '') parts.shift();
    let curr = this.__resourcesTree;
    for (const part of parts) {
      if (part in curr.children) curr = curr.children[part];
      else {
        throw new Error('Unable to resolve key:' + part + ' of path:' + value)
      }
    }
    return curr.id
  }

  /**
   * The resolveFilename method.
   * @deprecated
   * @param {string} value - The file value.
   * @return {string} - The resolved URL if an adapter is installed, else the original value.
   */
  resolveFilename(value) {
    return this.__resources[value].name
  }

  /**
   * The resolveURL method.
   * @deprecated
   * @param {string} value - The file value.
   * @return {string} - The resolved URL if an adapter is installed, else the original value.
   */
  resolveURL(value) {
    return this.__resources[value].url
  }

  /**
   * The traverse method.
   * @param {function} callback - The callback value.
   */
  traverse(callback) {
    const __c = (fsItem) => {
      // eslint-disable-next-line guard-for-in
      for (const childItemName in fsItem.children) {
        __t(fsItem.children[childItemName]);
      }
    };
    const __t = (fsItem) => {
      if (callback(fsItem) == false) return false
      if (fsItem.children) __c(fsItem);
    };
    __c(this.__resourcesTree);
  }
}

/**
 * `BaseItem` type of class
 *
 * **Parameters**
 * * **BackgroundColor(`ColorParameter`):** Changes background color of the scene
 * * **EnvMap(`ImageParameter`):** _todo_
 * * **Display(`BooleanParameter`):** _todo_
 * * **EnvMapLOD(`NumberParameter`):** _todo_
 * @extends BaseItem
 */
class SceneSettings extends BaseItem {
  /**
   * Create scene settings.
   * @param {string} name - The name of the scene settings item.
   */
  constructor(name) {
    super(name);
    this.addParameter(new ColorParameter('BackgroundColor', new Color('#808080')));
    this.addParameter(new ImageParameter('EnvMap'));
    this.addParameter(new BooleanParameter('Display EnvMap', false));
    this.addParameter(new NumberParameter('EnvMapLOD', 0));
  }
}

/**
 * Class designed to load and handle `.vla` files.
 * Which facilitates the migration of geometries from third party applications to the Digistar planetarium dome projection.
 *
 * **Parameters**
 * * **DataFilePath(`FilePathParameter`):** Used to specify the path to the file.
 *
 * **Events**
 * * **loaded:** Triggered once everything is loaded.
 * * **geomsLoaded:** Triggered once all geometries are loaded.
 *
 * @extends AssetItem
 */
class VLAAsset$1 extends AssetItem {
  /**
   * Create a VLA asset.
   * @param {string} name - The name value.
   */
  constructor(name) {
    super(name);
    this.loaded = false;

    // A signal that is emitted once all the geoms are loaded.
    // Often the state machine will activate the first state
    // when this signal emits.
    this.geomsLoaded = false;
    this.loaded = false;
    this.__geomLibrary.on('loaded', () => {
      this.emit('geomsLoaded', {});
    });

    this.__datafileParam = this.addParameter(new FilePathParameter('DataFilePath'));
    this.__datafileParam.on('valueChanged', () => {
      this.geomsLoaded = false;
      this.loadDataFile(
        () => {
          if (!this.loaded) this.emit('loaded', {});
        },
        () => {
          // if(!this.loaded){
          //   this.emit('loaded', {});
          // }
          // this.emit('geomsLoaded', {})
        }
      );
    });
  }

  // ////////////////////////////////////////
  // Persistence

  /**
   * Sets state of current asset using a binary reader object.
   *
   * @param {BinReader} reader - The reader value.
   * @param {object} context - The context value.
   * @return {number} - The return value.
   */
  readBinary(reader, context) {
    if (context.versions['zea-engine']) ; else {
      const v = reader.loadUInt8();
      reader.seek(0);
      // Note: previous non-semver only reached 7
      if (v > 7) {
        const version = new Version();
        version.patch = reader.loadUInt32();
        context.versions['zea-engine'] = version;
      } else {
        // Now we split the mesh out from the engine version.
        context.versions['zea-engine'] = new Version(reader.loadStr());
      }
    }
    context.meshSdk = 'FBX';
    this.meshfileversion = context.versions['zea-mesh'];
    this.meshSdk = context.meshSdk;
    console.log('Loading CAD File version:', context.versions['zea-mesh'], ' exported using SDK:', context.meshSdk);

    const numGeomsFiles = reader.loadUInt32();

    super.readBinary(reader, context);

    // Strangely, reading the latest HMD files gives us 12 bytes
    // at the end and the next 4 == 0. Not sure why.
    // setNumGeoms sets 0, but this doesn't bother the loading
    // so simply leaving for now.
    // if (reader.remainingByteLength != 4) {
    //   throw new Error(
    //     'File needs to be re-exported:' +
    //       this.getParameter('FilePath').getValue()
    //   )
    // }

    // Perpare the geom library for loading
    // This helps with progress bars, so we know how many geoms are coming in total.
    // Note: the geom library encodes in its binary buffer the number of geoms.
    // No need to set it here. (and the number is now incorrect for a reason I do not understand.)

    // if (context.version < 5) {
    if (context.versions['zea-engine'].compare([0, 0, 5]) < 0) {
      // Some data is no longer being read at the end of the buffer
      // so we skip to the end here.
      reader.seek(reader.byteLength - 4);
    }
    this.__geomLibrary.setNumGeoms(reader.loadUInt32());

    return numGeomsFiles
  }

  /**
   * Loads all the geometries and metadata from the `.vla` file.
   *
   * @private
   * @param {function} onDone - The onDone value.
   * @param {function} onGeomsDone - The onGeomsDone value.
   */
  loadDataFile(onDone, onGeomsDone) {
    const fileId = this.__datafileParam.getValue();
    const url = this.__datafileParam.getUrl();
    const folder = url.lastIndexOf('/') > -1 ? url.substring(0, url.lastIndexOf('/')) + '/' : '';
    const filename = url.lastIndexOf('/') > -1 ? url.substring(url.lastIndexOf('/') + 1) : '';
    const stem = filename.substring(0, filename.lastIndexOf('.'));
    let numGeomsFiles = 0;

    const context = {
      assetItem: this,
      versions: {},
    };

    const loadBinary = (entries) => {
      // Load the tree file. This file contains
      // the scene tree of the asset, and also
      // tells us how many geom files will need to be loaded.

      let treeReader;
      if (entries.tree2) {
        treeReader = new BinReader(entries.tree2.buffer, 0, SystemDesc.isMobileDevice);
      } else {
        const entry = entries.tree ? entries.tree : entries[Object.keys(entries)[0]];
        treeReader = new BinReader(entry.buffer, 0, SystemDesc.isMobileDevice);
        context.versions['zea-engine'] = new Version();
      }

      // Necessary for the smart lok
      numGeomsFiles = this.readBinary(treeReader, context);

      onDone();

      if (numGeomsFiles == 0 && entries.geoms0) {
        resourceLoader.addWork(fileId, 1); // (load + parse + extra)
        this.__geomLibrary.readBinaryBuffer(fileId, entries.geoms0.buffer, context);
        onGeomsDone();
      } else {
        // add the work for the the geom files....
        resourceLoader.addWork(fileId, 4 * numGeomsFiles); // (load + parse + extra)

        // Note: Lets just load all the goem files in parallel.
        loadAllGeomFiles();
      }
    };

    const loadAllGeomFiles = () => {
      const promises = [];
      for (let geomFileID = 0; geomFileID < numGeomsFiles; geomFileID++) {
        // console.log('LoadingGeom File:', geomFileID)
        const geomFileUrl = folder + stem + geomFileID + '.vlageoms';
        promises.push(loadGeomsfile(geomFileID, geomFileUrl));
      }
      Promise.all(promises).then(() => {
        if (onGeomsDone) onGeomsDone();
      });
    };

    const loadGeomsfile = (index, geomFileUrl) => {
      return new Promise((resolve) => {
        resourceLoader.loadUrl(
          fileId + index,
          geomFileUrl,
          (entries) => {
            const geomsData = entries[Object.keys(entries)[0]];
            this.__geomLibrary.readBinaryBuffer(fileId, geomsData.buffer, context);
            resolve();
          },
          false
        ); // <----
        // Note: Don't add load work as we already pre-added it at the beginning
        // and after the Tree file was loaded...
      })
    };

    resourceLoader.loadUrl(fileId, url, loadBinary);

    // To ensure that the resource loader knows when
    // parsing is done, we listen to the GeomLibrary streamFileLoaded
    // signal. This is fired every time a file in the stream is finshed parsing.
    this.__geomLibrary.on('streamFileParsed', (event) => {
      // A chunk of geoms are now parsed, so update the resource loader.
      resourceLoader.addWorkDone(fileId, event.fraction);
    });
  }

  /**
   * The fromJSON method decodes a json object for this type.
   *
   * @param {object} j - The json object this item must decode.
   * @param {object} context - The context value.
   * @param {function} onDone - The onDone value.
   */
  fromJSON(j, context, onDone) {
    if (!context) context = {};
    context.assetItem = this;

    const loadAssetJSON = () => {
      super.fromJSON(j, context, onDone);
      if (onDone) onDone();
    };

    if (j.params && j.params.DataFilePath) {
      // Save the callback function for later.
      this.__datafileLoaded = loadAssetJSON;
      const filePathJSON = j.params.DataFilePath;
      delete j.params.DataFilePath;
      this.__datafileParam.fromJSON(filePathJSON, context);
    } else {
      loadAssetJSON();
    }
  }
}

Registry.register('VLAAsset', VLAAsset$1);

/**
 * The GridTreeItem displays a grid of a given size and resolution. The Grid is oriented on the XY plane
 * and highlights the X and Y axes with Red and Green lines. Grids are useful in displaying scene scale and coordinate system.
 * The Grid geometry does not return a bounding box and so does not effect the bounding of the scene.
 *
 * @extends {TreeItem}
 */
class GridTreeItem extends TreeItem {
  /**
   * Creates an instance of GridTree.
   *
   * @param {number} [gridSize=5]
   * @param {number} [resolution=50]
   * @param {string} [gridColor=new Color('#DCDCDC')]
   */
  constructor(gridSize = 5, resolution = 50, gridColor = new Color('#DCDCDC')) {
    super('GridTree');

    const gridMaterial = new Material('gridMaterial', 'LinesShader');
    gridMaterial.getParameter('BaseColor').setValue(gridColor);
    const grid = new Grid(gridSize, gridSize, resolution, resolution, true);
    this.addChild(new GeomItem('GridItem', grid, gridMaterial), false);
    const axisLine = new Lines();
    axisLine.setNumVertices(2);
    axisLine.setNumSegments(1);
    axisLine.setSegmentVertexIndices(0, 0, 1);
    const positions = axisLine.getVertexAttribute('positions');
    positions.getValueRef(0).set(gridSize * -0.5, 0.0, 0.0);
    positions.getValueRef(1).set(gridSize * 0.5, 0.0, 0.0);
    const gridXAxisMaterial = new Material('gridXAxisMaterial', 'LinesShader');
    gridXAxisMaterial.getParameter('BaseColor').setValue(new Color(gridColor.luminance(), 0, 0));
    this.addChild(new GeomItem('xAxisLine', axisLine, gridXAxisMaterial), false);
    const gridZAxisMaterial = new Material('gridZAxisMaterial', 'LinesShader');
    gridZAxisMaterial.getParameter('BaseColor').setValue(new Color(0, gridColor.luminance(), 0));
    const geomOffset = new Xfo();
    geomOffset.ori.setFromAxisAndAngle(new Vec3$1(0, 0, 1), Math.PI * 0.5);
    const zAxisLineItem = new GeomItem('yAxisLine', axisLine, gridZAxisMaterial);
    zAxisLineItem.setGeomOffsetXfo(geomOffset);
    this.addChild(zAxisLineItem, false);
    this.setSelectable(false, true);
    const bBox = this._cleanBoundingBox(this.__boundingBoxParam.getValue());
    this.__boundingBoxParam.setValue(bBox);
  }

  /**
   *
   * @private
   * @param {Box3} bBox
   * @return {Box3} - Reset Bounding Box
   */
  _cleanBoundingBox(bBox) {
    bBox.reset();
    return bBox
  }
}

Registry.register('GridTreeItem', GridTreeItem);

const defaultGridColor = new Color('#DCDCDC');

/**
 * Class representing the environment where all the displayed assets live.
 */
class Scene {
  /**
   * Create a scene.
   * @param {object} resources - The resources value.
   */
  constructor(resources) {
    if (resources) {
      resourceLoader.setAdapter(new DriveAdapter(resources));
    }
    this.settings = new SceneSettings('Scene Settings');
    this.root = new TreeItem('root');
    this.root.addChild(this.settings);
  }

  /**
   * The getRoot method.
   * @return {BaseItem} - The return value.
   */
  getSettings() {
    return this.settings
  }

  /**
   * Returns the scene's root item(`TreeItem`) that owns every item in the scene.
   *
   * @return {TreeItem} - The return value.
   */
  getRoot() {
    return this.root
  }

  /**
   * Returns resourceLoader object set on class initialization.
   *
   * @return {ResourceLoader} - The return value.
   */
  getResourceLoader() {
    return resourceLoader
  }

  /**
   * Sets Environment Map with the BaseImage you'd like to display in your scene background.
   *
   * @deprecated
   * @param {EnvMap} envMap - The envMap value.
   */
  setEnvMap(envMap) {
    console.warn('Deprecated Function. Please access the Scene Settings object.');
    this.settings.getParameter('EnvMap').setValue(envMap);
  }

  /**
   * Adds a child item to the scene root item.
   *
   * @deprecated
   * @param {AssetItem} asset - The asset value.
   */
  addAsset(asset) {
    console.warn('Deprecated Function. Please access the Scene Root object.');
    this.root.addChild(asset, false);
  }

  /**
   * Sets up and displays the scene grid of a given size and resolution. The Grid is oriented on the XY plane
   * and highlights the X and Y axes with Red and Green lines. Grids are useful in displaying scene scale and coordinate system.
   * The Grid geometry does not return a bounding box and so does not effect the bounding of the scene.
   * The GridTreeItem display a grid of a given size and resolution. The Grid is oriented on the XY plane
   * and highlights the X and Y axes with Red and Green lines.
   *
   * @param {number} gridSize - The size of the grid.
   * @param {number} resolution - The resolution of the grid.
   * @param {Color} gridColor - The color of the grid.
   * @return {GridTreeItem} - The return value.
   */
  setupGrid(gridSize = 5, resolution = 50, gridColor = defaultGridColor) {
    const gridTreeItem = new GridTreeItem(gridSize, resolution, gridColor);
    this.root.addChild(gridTreeItem, false);
    return gridTreeItem
  }

  // /////////////////////////////////////
  // Persistence

  /**
   * The toJSON method encodes this type as a json object for persistence.
   *
   * @param {object} context - The context value.
   * @return {object} - Returns the json object.
   */
  toJSON(context = {}) {
    context.makeRelative = (path) => path;
    const json = {
      root: this.root.toJSON(context),
    };
    return json
  }

  /**
   * The fromJSON method decodes a json object for this type.
   *
   * @param {object} json - The json object this item must decode.
   * @param {object} context - The context value.
   */
  fromJSON(json, context = {}) {
    const plcbs = []; // Post load callbacks.
    context.resolvePath = (path, cb) => {
      // Note: Why not return a Promise here?
      // Promise evaluation is always async, so
      // all promisses will be resolved after the current call stack
      // has terminated. In our case, we want all paths
      // to be resolved before the end of the function, which
      // we can handle easily with callback functions.
      if (!path) throw new Error('Path not spcecified')
      const item = this.root.resolvePath(path);
      if (item) {
        cb(item);
      } else {
        // Some paths resolve to items generated during load,
        // so push a callback to re-try after the load is complete.
        plcbs.push(() => {
          const param = this.resolvePath(path);
          if (param) cb(param);
          else {
            console.warn('Path unable to be resolved:' + path);
          }
        });
      }
    };
    context.addPLCB = (plcb) => plcbs.push(plcb);
    context.settings = this.settings;

    if (json.root) {
      this.root.fromJSON(json.root, context);
    }

    // Invoke all the post-load callbacks to resolve any
    // remaning references.
    for (const cb of plcbs) cb();
  }
}

/* eslint-disable guard-for-in */

// AssetItem.registerDataLoader('.obj', ObjDataLoader);

/**
 * Class designed to load and handle `.obj` files.
 * Which define the grometry and other properties for objects.
 *
 * **Parameters**
 * * **splitObjects(`BooleanParameter`):** _todo_
 * * **splitGroupsIntoObjects(`BooleanParameter`):** _todo_
 * * **loadMtlFile(`BooleanParameter`):** _todo_
 * * **unitsConversion(`NumberParameter`):** _todo_
 * * **defaultShader(`StringParameter`):** _todo_
 * * **ObjFilePath(`FilePathParameter`):** Used to specify the path to the file.
 *
 * **Events**
 * * **loaded:** Triggered once everything is loaded.
 * * **geomsLoaded:** Triggered once all geometries are loaded.
 *
 * @extends AssetItem
 */
class ObjAsset extends AssetItem {
  /**
   * Create an obj asset.
   * @param {string} name - The name of the object asset.
   */
  constructor(name) {
    super(name);

    // A signal that is emitted once all the geoms are loaded.
    // Often the state machine will activate the first state
    // when this signal emits.
    this.geomsLoaded = false;
    this.loaded = false;

    this.addParameter(new BooleanParameter('splitObjects', false));
    this.addParameter(new BooleanParameter('splitGroupsIntoObjects', false));
    this.addParameter(new BooleanParameter('loadMtlFile', true));
    this.addParameter(new NumberParameter('unitsConversion', 1.0));
    this.addParameter(new StringParameter('defaultShader', ''));

    this.objfileParam = this.addParameter(new FilePathParameter('FilePath'));
    this.objfileParam.on('valueChanged', () => {
      this.loaded = false;
      this.__loadObj(
        () => {
          this.emit('loaded', {});
        },
        () => {
          this.emit('geomsLoaded', {});
        }
      );
    });
    this.geomLibrary = new GeomLibrary();
    this.materials = new MaterialLibrary();
  }

  /**
   * Returns `GeomLibrary` object which hosts workers, buffers, streams and geometry objects.
   *
   * @return {GeomLibrary} - The return value.
   */
  getGeometryLibrary() {
    return this.geomLibrary
  }

  /**
   * Returns `MaterialLibrary` object wich hosts images and `Material` objects.
   *
   * @return {MaterialLibrary} - The return value.
   */
  getMaterialLibrary() {
    return this.materials
  }

  /**
   * The __loadObj method.
   * @param {function} onDone - The onDone value.
   * @param {function} onGeomsLoaded - The onGeomsLoaded value.
   * @private
   */
  __loadObj(onDone, onGeomsLoaded) {
    const url = this.objfileParam.getUrl();
    const fileFolder = url.substring(0, url.lastIndexOf('/')) + '/';
    const filename = url.substring(url.lastIndexOf('/') + 1);

    const parseMtlData = (mtlFileData) => {
      const lines = mtlFileData.split('\n');
      const WHITESPACE_RE = /\s+/;
      let material;

      const parseColor = function (elements) {
        if (elements.length == 3)
          return new Color(parseFloat(elements[0]), parseFloat(elements[1]), parseFloat(elements[2]))
        else throw new Error('Unable to parse a color from the following parts:' + elements.join('_'))
      };

      const parseMap = (elements) => {
        return new FileImage(elements[0], fileFolder + elements[0])
      };

      for (let i = 0; i < lines.length; i++) {
        let line = lines[i].trim();
        if (line.startsWith('#')) continue
        if (line.indexOf('#') != -1) line = line.substring(0, line.indexOf('#')).trim();
        const elements = line.split(WHITESPACE_RE);
        const key = elements.shift();
        const value = elements.join(' ');
        switch (key) {
          case 'newmtl':
            material = new Material(value);
            material.setShaderName('StandardSurfaceShader');
            this.materials.addMaterial(material);
            break
          case 'Kd':
            material.getParameter('BaseColor').setValue(parseColor(elements));
            break
          case 'map_Kd':
            material.getParameter('BaseColor').setValue(parseMap(elements));
            break
          case 'Ks':
            const specular = (parseFloat(elements[0]) + parseFloat(elements[1]) + parseFloat(elements[2])) / 3.0;
            material.roughness = 1.0 - specular;
            material.getParameter('Roughness').setValue(1.0 - specular);
            material.getParameter('Reflectance').setValue(specular);
            break
          case 'map_Ks':
            material.getParameter('Roughness').setValue(parseMap(elements /* flags=TEXTURE_INVERT */));
            material.getParameter('Reflectance').setValue(0.2);
            break
          case 'd':
            const d = parseFloat(value);
            if (d < 1.0) {
              material.setShaderName('TransparentSurfaceShader');
              material.getParameter('Opacity').setValue(d);
            }
            break
          case 'map_d':
            material.getParameter('alpha').setValue(parseFloat(elements));
            break
          case 'map_bump':
            material.getParameter('normal').setValue(parseMap(elements /* flags=BUMP_TO_NORMAL */));
            break
          // console.warn("Unhandled material parameter: '" + key +"' in:" + filePath);
        }
      }
    };

    const async = new Async();
    async.incAsyncCount();
    async.on('ready', () => {
      buildChildItems();
    });

    const loadMtlFile = (mtlFile) => {
      return new Promise((resolve) => {
        loadTextfile(mtlFile.url, (fileData) => {
          resourceLoader.addWorkDone(fileId, 1);
          parseMtlData(fileData);
          async.decAsyncCount();
          resourceLoader.addWorkDone(fileId, 1);
          resolve();
        });
      })
    };

    const vertices = new Array();
    const normals = new Array();
    const texCoords = new Array();

    const geomDatas = {};

    const parseObjData = async (fileData) => {
      // performance.mark("parseObjData");

      // array of lines separated by the newline
      const lines = fileData.split('\n');
      const WHITESPACE_RE = /\s+/;

      let currGeom = undefined;
      let currMtl = undefined;
      const newGeom = (name) => {
        let suffix = 0;
        while (name in geomDatas) {
          suffix++;
          name = name + String(suffix);
        }
        currGeom = {
          verticesRemapping: {},
          texCoordsRemapping: {},
          normalsRemapping: {},
          vertexIndices: [],
          texCoordIndices: [],
          normalIndices: [],
          numVertices: 0,
          numTexCoords: 0,
          numNormals: 0,
          faceCounts: [],
          material: currMtl,
        };
        geomDatas[name] = currGeom;
      };
      newGeom(filename);

      const splitGroupsIntoObjects = this.getParameter('splitGroupsIntoObjects').getValue();

      const stop = false;
      // let numPolys = 0;
      for (let i = 0; i < lines.length && !stop; i++) {
        let line = lines[i].trim();
        if (line.startsWith('#')) continue
        if (line.indexOf('#') != -1) line = line.substring(0, line.indexOf('#')).trim();
        const elements = line.split(WHITESPACE_RE);
        const key = elements.shift();
        const value = elements.join(' ');
        switch (key) {
          case '':
          case 's':
            // ignore shading groups
            continue
          case 'mtllib':
            if (!this.getParameter('loadMtlFile').getValue()) continue
            // Load and parse the mat lib.
            async.incAsyncCount();
            resourceLoader.addWork(stem, 2);
            const mtlFile = resourceLoader.resolveFilepath(fileFolder + value);
            if (mtlFile) {
              await loadMtlFile(mtlFile);
            }
            break
          case 'o':
            newGeom(value);
            break
          case 'usemtl':
            currMtl = value;
            newGeom(value + Object.keys(geomDatas).length);
            break
          case 'g':
            if (splitGroupsIntoObjects) newGeom(elements.join('_'));
            break
          case 'v':
            vertices.push(elements.map((i) => parseFloat(i)));
            break
          case 'vt':
            texCoords.push(elements.map((i) => parseFloat(i)));
            break
          case 'vn':
            normals.push(elements.map((i) => parseFloat(i)));
            break
          case 'f': {
            const v_poly = [];
            const vt_poly = [];
            const vn_poly = [];
            for (let j = 0, eleLen = elements.length; j < eleLen; j++) {
              // v/vt/vn
              const indices = elements[j].split('/').map((i) => parseInt(i) - 1);
              const v = indices[0];

              // v_poly.push(v);
              let v_index = currGeom.verticesRemapping[v];
              if (v_index == undefined) {
                v_index = currGeom.numVertices;
                currGeom.verticesRemapping[v] = v_index;
                currGeom.numVertices++;
              }
              v_poly.push(v_index);

              if (indices.length > 1 && !isNaN(indices[1])) {
                const vt = indices[1];
                vt_poly.push(vt);
              }
              if (indices.length > 2 && !isNaN(indices[2])) {
                const vn = indices[2];
                vn_poly.push(vn);
              }
            }
            currGeom.vertexIndices.push(v_poly);
            if (vn_poly.length > 0) currGeom.normalIndices.push(vn_poly);
            if (vt_poly.length > 0) currGeom.texCoordIndices.push(vt_poly);

            if (currGeom.faceCounts[v_poly.length - 3] == undefined) {
              currGeom.faceCounts[v_poly.length - 3] = [];
            }
            currGeom.faceCounts[v_poly.length - 3]++;
            // numPolys++;
            // if(numPolys == 16000)
            //     stop = true;
            break
          }
          default: {
            console.warn('Unhandled line:' + line);
          }
        }
      }

      async.decAsyncCount();
    };

    const buildChildItems = () => {
      // performance.mark("parseObjDataDone");
      // performance.mark("buildObjTree");
      for (const geomName in geomDatas) {
        if (geomDatas[geomName].numVertices == 0) continue
        buildChildItem(geomName, geomDatas[geomName]);
      }

      // Done.
      onDone();
      onGeomsLoaded();
    };

    const buildChildItem = (geomName, geomData) => {
      const numVertices = geomData.numVertices;
      const mesh = new Mesh(geomName);
      mesh.setFaceCounts(geomData.faceCounts);
      mesh.setNumVertices(numVertices);
      const positionsAttr = mesh.getVertexAttribute('positions');
      const unitsConversion = this.getParameter('unitsConversion').getValue();

      for (const vsrc in geomData.verticesRemapping) {
        const vtgt = geomData.verticesRemapping[vsrc];
        positionsAttr
          .getValueRef(vtgt)
          .set(
            vertices[vsrc][0] * unitsConversion,
            vertices[vsrc][1] * unitsConversion,
            vertices[vsrc][2] * unitsConversion
          );
      }

      let normalsAttr;
      let texCoordsAttr;
      if (geomData.normalIndices.length > 0) normalsAttr = mesh.addVertexAttribute('normals', Vec3$1);
      if (geomData.texCoordIndices.length > 0) texCoordsAttr = mesh.addVertexAttribute('texCoords', Vec2);

      const loadedFaces = Array(geomData.faceCounts.length).fill(0);
      for (let i = 0; i < geomData.vertexIndices.length; i++) {
        const v_poly = geomData.vertexIndices[i];
        let faceId = 0;
        for (let j = 0; j < v_poly.length - 3; ++j) {
          faceId += geomData.faceCounts[j];
        }
        faceId += loadedFaces[v_poly.length - 3];
        loadedFaces[v_poly.length - 3]++;
        mesh.setFaceVertexIndices(faceId, v_poly);

        // Set the texCoords and normals...
        if (normalsAttr) {
          const vn_poly = geomData.normalIndices[i];
          for (let j = 0; j < vn_poly.length; j++) {
            const value = new Vec3$1(normals[vn_poly[j]][0], normals[vn_poly[j]][1], normals[vn_poly[j]][2]);
            normalsAttr.setFaceVertexValue(faceId, j, value);
          }
        }
        if (texCoordsAttr && geomData.texCoordIndices.length == geomData.vertexIndices.length) {
          const vt_poly = geomData.texCoordIndices[i];
          for (let j = 0; j < vt_poly.length; j++) {
            const value = new Vec2(texCoords[vt_poly[j]][0], texCoords[vt_poly[j]][1]);
            texCoordsAttr.setFaceVertexValue(faceId, j, value);
          }
        }
      }

      const geomItem = new GeomItem(geomName, mesh);
      geomItem.selectable = true;

      // Move the transform of the geom item to the center of the geom.
      // This is so that transparent objects can render correctly, and the
      // transform gizmo becomes centered on each geom(for testing)
      const delta = mesh.getBoundingBox().center();
      {
        const offset = delta.negate();
        const positions = mesh.getVertexAttribute('positions');
        for (let i = 0; i < positions.length; i++) positions.getValueRef(i).addInPlace(offset);
        mesh.setBoundingBoxDirty();
      }
      geomItem.getParameter('LocalXfo').setValue(new Xfo(delta));

      if (geomData.material != undefined && this.materials.hasMaterial(geomData.material)) {
        geomItem.getParameter('Material').setValue(this.materials.getMaterial(geomData.material));
      } else {
        const defaultShader = this.getParameter('defaultShader').getValue();
        const material = new Material(geomName + 'mat');
        material.setShaderName(defaultShader != '' ? defaultShader : 'StandardSurfaceShader');
        this.materials.addMaterial(material);
        geomItem.getParameter('Material').setValue(material);
      }

      this.addChild(geomItem, false);
    };

    const loadObjData = () => {
      const fileId = this.objfileParam.getValue();
      resourceLoader.addWork(fileId, 2);
      loadTextfile(url, (fileData) => {
        resourceLoader.addWorkDone(fileId, 1);
        parseObjData(fileData);
        resourceLoader.addWorkDone(fileId, 1);
      });
    };

    loadObjData();
  }
}

/** Class representing a router operator.
 * @extends Operator
 * @private
 */
class RouterOperator extends Operator {
  /**
   * Create a router operator.
   * @param {string} name - The name value.
   */
  constructor(name) {
    super(name);
    this.__input = this.addInput(new OperatorInput('Input'));
  }

  /**
   * The addRoute method.
   * @return {OperatorOutput} - The added output.
   */
  addRoute() {
    return this.addOutput(new OperatorOutput('Output' + this.__outputs.size))
  }

  /**
   * The evaluate method.
   */
  evaluate() {
    if (this.__input.isConnected()) {
      const inputValue = this.__input.getValue();
      let i = this.__outputs.size;
      while (i--) {
        const output = this.getOutputByIndex(i);
        output.setClean(inputValue);
      }
    } else {
      let i = this.__outputs.size;
      while (i--) {
        const output = this.getOutputByIndex(i);
        output.setClean(0.0);
      }
    }
  }
}

Registry.register('RouterOperator', RouterOperator);

/* eslint-disable require-jsdoc */

/**
 * Class representing the viewport manipulator with camera, mouse and keyboard events.
 *
 * ```
 * const manipulator = new CameraMouseAndKeyboard()
 * ```
 *
 * **Parameters**
 * * **orbitRate(`NumberParameter`):** _todo_
 * * **dollySpeed(`NumberParameter`):** _todo_
 * * **mouseWheelDollySpeed(`NumberParameter`):** _todo_
 *
 * **Events**
 * * **movementFinished:** Triggered when the camera moves
 *
 * @extends ParameterOwner
 */
class CameraMouseAndKeyboard extends ParameterOwner {
  /**
   * Create a camera, mouse and keyboard
   * @param {string} name - The name value.
   */
  constructor(name = undefined) {
    if (name == undefined) name = 'Camera';
    super(name);

    this.__defaultManipulationState = 'orbit';
    this.__manipulationState = this.__defaultManipulationState;
    this.__mouseDown = false;
    this.__dragging = false;
    this.__mouseDragDelta = new Vec2();
    this.__keyboardMovement = false;
    this.__keysPressed = [];
    this.__maxVel = 0.002;
    this.__velocity = new Vec3$1();

    this.__ongoingTouches = {};

    this.__globalXfoChangedDuringDrag = this.__globalXfoChangedDuringDrag.bind(this);

    this.__orbitRateParam = this.addParameter(new NumberParameter('orbitRate', SystemDesc.isMobileDevice ? -0.3 : 1));
    this.__dollySpeedParam = this.addParameter(new NumberParameter('dollySpeed', 0.02));
    this.__mouseWheelDollySpeedParam = this.addParameter(new NumberParameter('mouseWheelDollySpeed', 0.0005));
  }

  /**
   * Sets default manipulation mode.
   *
   * @param {string} manipulationMode - The manipulation mode value. Can be 'orbit', or 'look'
   */
  setDefaultManipulationMode(manipulationMode) {
    this.__defaultManipulationState = manipulationMode;
  }

  /**


