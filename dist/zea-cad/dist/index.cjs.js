'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var zeaEngine = require('@zeainc/zea-engine');

const CADCurveTypes = {
  CURVE_TYPE_LINE: 20,
  CURVE_TYPE_CIRCLE: 21,
  CURVE_TYPE_ELIPSE: 22,
  //  CURVE_TYPE_HYPERBOLA: 23,
  //  CURVE_TYPE_PARABOLA: 24,
  //  CURVE_TYPE_BEZIERCURVE: 25,
  CURVE_TYPE_NURBS_CURVE: 26,
  //  CURVE_TYPE_OFFSET_CURVE: 27,
  //  CURVE_TYPE_TRIMMED_CURVE: 28
};

const CADSurfaceTypes = {
  SURFACE_TYPE_PLANE: 0,
  SURFACE_TYPE_CONE: 1,
  SURFACE_TYPE_CYLINDER: 2,
  SURFACE_TYPE_SPHERE: 3,
  SURFACE_TYPE_TORUS: 4,
  SURFACE_TYPE_LINEAR_EXTRUSION: 5,
  SURFACE_TYPE_REVOLUTION: 6,
  //  SURFACE_TYPE_BEZIER_SURFACE: 7,
  SURFACE_TYPE_NURBS_SURFACE: 8,
  SURFACE_TYPE_OFFSET_SURFACE: 9,
  SURFACE_TYPE_TRIMMED_RECT_SURFACE: 10,
  SURFACE_TYPE_POLY_PLANE: 14,
  SURFACE_TYPE_FAN: 15,
  SURFACE_TYPE_REVOLUTION_FLIPPED_DOMAIN: 16,
};

const getCurveTypeName = id => {
  switch (id) {
    case CADCurveTypes.CURVE_TYPE_LINE:
      return 'CURVE_TYPE_LINE'
    case CADCurveTypes.CURVE_TYPE_CIRCLE:
      return 'CURVE_TYPE_CIRCLE'
    case CADCurveTypes.CURVE_TYPE_ELIPSE:
      return 'CURVE_TYPE_ELIPSE'
    // case CADCurveTypes.CURVE_TYPE_HYPERBOLA: return 'CURVE_TYPE_HYPERBOLA';
    // case CADCurveTypes.CURVE_TYPE_PARABOLA: return 'CURVE_TYPE_PARABOLA';
    // case CADCurveTypes.CURVE_TYPE_BEZIERCURVE: return 'CURVE_TYPE_BEZIERCURVE';
    case CADCurveTypes.CURVE_TYPE_NURBS_CURVE:
      return 'CURVE_TYPE_NURBS_CURVE'
    // case CADCurveTypes.CURVE_TYPE_OFFSET_CURVE: return 'CURVE_TYPE_OFFSET_CURVE';
    // case CADCurveTypes.CURVE_TYPE_TRIMMED_CURVE: return 'CURVE_TYPE_TRIMMED_CURVE';
  }
};

const getSurfaceTypeName = id => {
  switch (id) {
    case CADSurfaceTypes.SURFACE_TYPE_PLANE:
      return 'SURFACE_TYPE_PLANE'
    case CADSurfaceTypes.SURFACE_TYPE_CONE:
      return 'SURFACE_TYPE_CONE'
    case CADSurfaceTypes.SURFACE_TYPE_CYLINDER:
      return 'SURFACE_TYPE_CYLINDER'
    case CADSurfaceTypes.SURFACE_TYPE_SPHERE:
      return 'SURFACE_TYPE_SPHERE'
    case CADSurfaceTypes.SURFACE_TYPE_TORUS:
      return 'SURFACE_TYPE_TORUS'
    case CADSurfaceTypes.SURFACE_TYPE_LINEAR_EXTRUSION:
      return 'SURFACE_TYPE_LINEAR_EXTRUSION'
    case CADSurfaceTypes.SURFACE_TYPE_REVOLUTION:
      return 'SURFACE_TYPE_REVOLUTION'
    //    case CADSurfaceTypes.SURFACE_TYPE_BEZIER_SURFACE: return 'SURFACE_TYPE_BEZIER_SURFACE';
    case CADSurfaceTypes.SURFACE_TYPE_NURBS_SURFACE:
      return 'SURFACE_TYPE_NURBS_SURFACE'
    case CADSurfaceTypes.SURFACE_TYPE_OFFSET_SURFACE:
      return 'SURFACE_TYPE_OFFSET_SURFACE'
    case CADSurfaceTypes.SURFACE_TYPE_TRIMMED_RECT_SURFACE:
      return 'SURFACE_TYPE_TRIMMED_RECT_SURFACE'
    case CADSurfaceTypes.SURFACE_TYPE_POLY_PLANE:
      return 'SURFACE_TYPE_POLY_PLANE'
    case CADSurfaceTypes.SURFACE_TYPE_FAN:
      return 'SURFACE_TYPE_FAN'
    case CADSurfaceTypes.SURFACE_TYPE_REVOLUTION_FLIPPED_DOMAIN:
      return 'SURFACE_TYPE_REVOLUTION_FLIPPED_DOMAIN'
  }
};

const geomLibraryHeaderSize = 8; // 2 FP16 pixels at the start of the GeomLibrary and CurveLibrary
const pixelsPerDrawItem = 10; // The number of RGBA pixels per draw item.
const valuesPerCurveTocItem = 8;
const valuesPerSurfaceTocItem = 9;
const valuesPerCurveLibraryLayoutItem = 8;
const valuesPerSurfaceLibraryLayoutItem = 8;
//const valuesPerSurfaceRef = 11 // A surfaceRef within a BodyDesc// This is now different based on the version.
const bodyItemCoordsStride = 30;
const floatsPerSceneBody = 23;
const CURVE_FLAG_COST_IS_DETAIL = 1 << 3;

const SURFACE_FLAG_PERIODIC_U = 1 << 0;
const SURFACE_FLAG_PERIODIC_V = 1 << 1;
const SURFACE_FLAG_FLIPPED_NORMAL = 1 << 4;
const SURFACE_FLAG_FLIPPED_UV = 1 << 5;
const SURFACE_FLAG_COST_IS_DETAIL_U = 1 << 6;
const SURFACE_FLAG_COST_IS_DETAIL_V = 1 << 7;

const BODY_FLAG_CUTAWAY = 1 << 8;
const BODY_FLAG_INVISIBLE = 1 << 9;

/** Class representing a hull.
 * @extends Lines
 * @ignore
 */
class Hull extends zeaEngine.Lines {
  /**
   * Create a hull.
   * @param {number} numCPsU - The numCPsU value.
   * @param {number} numCPsV - The numCPsV value.
   */
  constructor(numCPsU = 1, numCPsV = 1) {
    super();
    this.__numSpansU = numCPsU - 1;
    this.__numSpansV = numCPsV - 1;
    this.__rebuild();
  }

  /**
   * The __rebuild method.
   * @private
   */
  __rebuild() {
    this.setNumVertices((this.__numSpansU + 1) * (this.__numSpansV + 1));
    this.setNumSegments(
      this.__numSpansU * (this.__numSpansV + 1) +
        (this.__numSpansU + 1) * this.__numSpansV
    );

    let idx = 0;
    for (let j = 0; j <= this.__numSpansV; j++) {
      for (let i = 0; i < this.__numSpansU; i++) {
        const v0 = (this.__numSpansU + 1) * j + i;
        const v1 = (this.__numSpansU + 1) * j + (i + 1);
        this.setSegment(idx, v0, v1);
        idx++;
      }
    }
    for (let j = 0; j < this.__numSpansV; j++) {
      for (let i = 0; i <= this.__numSpansU; i++) {
        const v0 = (this.__numSpansU + 1) * j + i;
        const v1 = (this.__numSpansU + 1) * (j + 1) + i;
        this.setSegment(idx, v0, v1);
        idx++;
      }
    }
  }
}
// export default Hull;

/** Class representing a CAD surface library.
 * @ignore
 */
class CADSurfaceLibrary {
  /**
   * Create a CAD surface library.
   * @param {any} cadAsset - The cadAsset value.
   * @param {any} trimSetLibrary - The trimSetLibrary value.
   */
  constructor(cadAsset, trimSetLibrary) {
    this.__cadAsset = cadAsset;
    this.__trimSetLibrary = trimSetLibrary;
    this.__curveLibraryBuffer = undefined;
    this.__meshes = [];
    this.__hulls = [];
    this.__formFactors = {};

    this.__maxNumKnots = 0;
  }

  /**
   * The setBinaryBuffers method.
   * @param {any} curveLibraryBuffer - The curveLibraryBuffer param.
   * @param {any} surfaceLibraryBuffer - The surfaceLibraryBuffer param.
   * @param {number} version - The version param.
   */
  setBinaryBuffers(curveLibraryBuffer, surfaceLibraryBuffer, cadDataVersion) {
    this.__surfaceLibraryBuffer = surfaceLibraryBuffer;
    this.cadDataVersion = cadDataVersion;
    this.__surfaceLibraryReader = new zeaEngine.BinReader(
      this.__surfaceLibraryBuffer
    );

    this.__surfaceLibrarySize = Math.sqrt(surfaceLibraryBuffer.byteLength / 8); // RGBA16 pixels
    this.__numSurfaces = this.__surfaceLibraryReader.loadUInt32();
    this.__totalSurfaceArea = this.__surfaceLibraryReader.loadFloat32();

    // this.__totalSurfaceCost = this.__surfaceLibraryReader.loadFloat32();

    // for (let i = 0; i < this.__numCurves; i++) {
    //   const dims = this.getCurveDims(i);
    //   console.log(this.getCurveTypeLabel(i), " length:", dims.length, " curvature:", dims.curvature);
    // }
    // for (let i = 0; i < this.__numSurfaces; i++) {
    //   const dims = this.getSurfaceDims(i);
    //   const area = dims.sizeU * dims.sizeV;

    //   console.log(this.getSurfaceTypeLabel(i), " sizeU:", dims.sizeU, " sizeV:", dims.sizeV, " curvatureU:", dims.curvatureU, " curvatureV:", dims.curvatureV);
    // }

    // if (this.__totalSurfaceArea == 0.0) {
    //   this.__totalSurfaceArea == 0.0;
    //   this.__totalSurfaceCost = 0.0;
    // for (let i = 0; i < this.__numSurfaces; i++) {
    //   const dims = this.getSurfaceDims(i);
    //   const area = dims.sizeU * dims.sizeV;

    //   console.log(this.getSurfaceTypeLabel(i), " sizeU:", dims.sizeU, " sizeV:", dims.sizeV, " curvatureU:", dims.curvatureU, " curvatureV:", dims.curvatureV);
    //   // this.__totalSurfaceArea += area;
    //   // this.__totalSurfaceCost += (1.0 + (dims.sizeU * dims.curvatureU)) * (1.0 + (dims.sizeV * dims.curvatureV));
    // }
    // }
    // console.log(this.__totalSurfaceCost);

    // this.__triCounts = [
    //   10,
    //   20,
    //   40,
    //   80,
    // ]

    if (this.__totalSurfaceArea == 0.0) {
      for (let i = 0; i < this.__numSurfaces; i++) {
        const dims = this.getSurfaceDims(i);
        const area = dims.sizeU * dims.sizeV;
        this.__totalSurfaceArea += area;
      }
    }

    this.__curveLibraryBuffer = curveLibraryBuffer;
    this.__curveLibraryReader = new zeaEngine.BinReader(
      this.__curveLibraryBuffer
    );
    this.__curveLibrarySize = Math.sqrt(curveLibraryBuffer.byteLength / 8); // RGBA16 pixels
    this.__numCurves = this.__curveLibraryReader.loadUInt32();

    // for (let i = 0; i < this.__numSurfaces; i++) {
    //   console.log(this.getSurfaceData(i, false));
    // }
    // for (let i = 0; i < this.__numCurves; i++) {
    //   console.log(this.getCurveData(i));
    // }
  }

  /**
   * The getCurveBuffer method.
   * @return {any} - The return value.
   */
  getCurveBuffer() {
    return this.__curveLibraryBuffer
  }

  /**
   * The getSurfaceBuffer method.
   * @return {any} - The return value.
   */
  getSurfaceBuffer() {
    return this.__surfaceLibraryBuffer
  }

  /**
   * The getNumSurfaces method.
   * @return {any} - The return value.
   */
  getNumSurfaces() {
    return this.__numSurfaces
  }

  /**
   * The getDetailFactor method.
   * @param {any} lod - The lod param.
   * @return {any} - The return value.
   */
  getDetailFactor(lod) {
    // Given a target poly count, calculate the detail factor given the total surface cost.
    // const targetQuadCount = this.__triCounts[Math.clamp(0, lod, this.__triCounts.length-1)] * 1000;
    // return targetQuadCount / this.__totalSurfaceCost;
    const mult = Math.pow(2, lod);
    return mult * this.__cadAsset.getParameter('CurvatureToDetail').getValue()
  }

  /**
   * The getCurveDataTexelCoords method.
   * @param {any} curveId - The curveId param.
   * @return {any} - The return value.
   */
  getCurveDataTexelCoords(curveId) {
    this.__curveLibraryReader.seek(
      geomLibraryHeaderSize + curveId * (valuesPerCurveTocItem * 2) /* bpc*/
    );
    const x = this.__curveLibraryReader.loadFloat16();
    const y = this.__curveLibraryReader.loadFloat16();
    return {
      x,
      y,
    }
  }

  /**
   * The __seekCurveData method.
   * @param {any} curveId - The curveId param.
   * @param {number} offsetInBytes - The offsetInBytes param.
   * @private
   */
  __seekCurveData(curveId, offsetInBytes = 0) {
    const addr = this.getCurveDataTexelCoords(curveId);
    // X, Y in pixels.

    const bytesPerPixel = 8; // RGBA16 pixel
    const byteOffset =
      addr.x * bytesPerPixel + addr.y * bytesPerPixel * this.__curveLibrarySize;
    // console.log("__seekSurfaceData:" + curveId + " byteOffset:" + (byteOffset +offset) + " pixel:" + ((byteOffset +offset)/8) + " x:" + addr.x + " y:" + addr.y);
    this.__curveLibraryReader.seek(byteOffset + offsetInBytes);
  }

  /**
   * The getCurveType method.
   * @param {any} curveId - The curveId param.
   * @return {any} - The return value.
   */
  getCurveType(curveId) {
    this.__seekCurveData(curveId);
    const curveType = this.__curveLibraryReader.loadFloat16();
    return curveType
  }

  /**
   * The getCurveTypeLabel method.
   * @param {any} curveId - The curveId param.
   * @return {any} - The return value.
   */
  getCurveTypeLabel(curveId) {
    const curveType = this.getCurveType(curveId);
    return getCurveTypeName(curveType)
  }

  /**
   * The getCurveTypeLabel method.
   * @param {any} curveId - The curveId param.
   * @return {any} - The return value.
   */
  getCurveDims(curveId) {
    this.__curveLibraryReader.seek(
      geomLibraryHeaderSize + curveId * (valuesPerCurveTocItem * 2) /* bpc*/
    );

    return {
      addrX: this.__curveLibraryReader.loadFloat16(),
      addrY: this.__curveLibraryReader.loadFloat16(),
      curvature: this.__curveLibraryReader.loadFloat16(),
      length: this.__curveLibraryReader.loadFloat16(),
      flags: this.__curveLibraryReader.loadFloat16(),
    }
  }

  /**
   * The getCurveTypeLabel method.
   * @param {any} curveId - The curveId param.
   * @return {any} - The return value.
   */
  getCurveData(curveId) {
    const dims = this.getCurveDims(curveId);
    const curveType = this.getCurveType(curveId);
    const domain = new zeaEngine.Vec2(
      this.__curveLibraryReader.loadFloat16(),
      this.__curveLibraryReader.loadFloat16()
    );

    switch (curveType) {
      case CADCurveTypes.CURVE_TYPE_LINE: {
        return {
          curveId,
          dims,
          curveType: 'CURVE_TYPE_LINE',
          domain,
        }
      }
      case CADCurveTypes.CURVE_TYPE_CIRCLE: {
        const radius = this.__curveLibraryReader.loadFloat16();
        return {
          curveId,
          dims,
          curveType: 'CURVE_TYPE_CIRCLE',
          domain,
          radius,
        }
      }
      case CADCurveTypes.CURVE_TYPE_ELIPSE: {
        const majorRadius = this.__curveLibraryReader.loadFloat16();
        const minorRadius = this.__curveLibraryReader.loadFloat16();
        return {
          curveId,
          dims,
          curveType: 'SURFACE_TYPE_CYLINDER',
          domain,
          majorRadius,
          minorRadius,
        }
      }
      case CADCurveTypes.CURVE_TYPE_NURBS_CURVE: {
        const degree = this.__curveLibraryReader.loadFloat16();
        const numCPs = this.__curveLibraryReader.loadFloat16();
        const numKnots = this.__curveLibraryReader.loadFloat16();
        this.__curveLibraryReader.advance(4);

        const controlPoints = [];
        for (let j = 0; j < numCPs; j++) {
          const p = new zeaEngine.Vec4(
            this.__curveLibraryReader.loadFloat16(),
            this.__curveLibraryReader.loadFloat16(),
            this.__curveLibraryReader.loadFloat16(),
            this.__curveLibraryReader.loadFloat16()
          );
          controlPoints.push(p);
        }
        const knots = [];
        for (let j = 0; j < numKnots; j++) {
          knots.push(this.__curveLibraryReader.loadFloat16());
        }
        return {
          curveId,
          dims,
          curveType: 'CURVE_TYPE_NURBS_CURVE',
          domain,
          degree,
          numCPs,
          controlPoints,
          knots,
        }
      }
      default:
        console.warn('Invalid Curve Type:', curveType);
    }
  }

  /**
   * The getSurfaceDataTexelCoords method.
   * @param {any} surfaceId - The surfaceId param.
   * @return {any} - The return value.
   */
  getSurfaceDataTexelCoords(surfaceId) {
    this.__surfaceLibraryReader.seek(
      geomLibraryHeaderSize + surfaceId * (valuesPerSurfaceTocItem * 2) /* bpc*/
    );
    const x = this.__surfaceLibraryReader.loadUFloat16();
    const y = this.__surfaceLibraryReader.loadUFloat16();
    return {
      x,
      y,
    }
  }

  /**
   * The __seekSurfaceData method.
   * @param {any} surfaceId - The surfaceId param.
   * @param {number} offsetInBytes - The offsetInBytes param.
   * @private
   */
  __seekSurfaceData(surfaceId, offsetInBytes = 0) {
    const addr = this.getSurfaceDataTexelCoords(surfaceId);
    // X, Y in pixels.

    const bytesPerPixel = 8; // RGBA16 pixel
    const byteOffset =
      addr.x * bytesPerPixel +
      addr.y * bytesPerPixel * this.__surfaceLibrarySize;
    // console.log("__seekSurfaceData:" + surfaceId + " byteOffset:" + (byteOffset +offset) + " pixel:" + ((byteOffset +offset)/8) + " x:" + addr.x + " y:" + addr.y);
    this.__surfaceLibraryReader.seek(byteOffset + offsetInBytes);
  }

  /**
   * The getSurfaceType method.
   * @param {any} surfaceId - The surfaceId param.
   * @return {any} - The return value.
   */
  getSurfaceType(surfaceId) {
    this.__seekSurfaceData(surfaceId);
    const surfaceType = this.__surfaceLibraryReader.loadFloat16();
    return surfaceType
  }

  /**
   * The getSurfaceTypeLabel method.
   * @param {any} surfaceId - The surfaceId param.
   * @return {any} - The return value.
   */
  getSurfaceTypeLabel(surfaceId) {
    const surfaceType = this.getSurfaceType(surfaceId);
    return getSurfaceTypeName(surfaceType)
  }

  /**
   * The getSurfaceDims method.
   * @param {any} surfaceId - The surfaceId param.
   * @return {any} - The return value.
   */
  getSurfaceDims(surfaceId) {
    this.__surfaceLibraryReader.seek(
      geomLibraryHeaderSize + surfaceId * (valuesPerSurfaceTocItem * 2) /* bpc*/
    );

    const loadTrimSetId = () => {
      if (this.cadDataVersion.lessThan([0, 0, 27])) {
        // Note: -1 is a valid value for trimset id, so can't use an unsigned float value.
        const partA = this.__surfaceLibraryReader.loadFloat16();
        const partB = this.__surfaceLibraryReader.loadFloat16();
        return partA + (partB << 8)
      } else {
        return this.__surfaceLibraryReader.loadSInt32From2xFloat16()
      }
    };
    return {
      addrX: this.__surfaceLibraryReader.loadUFloat16(),
      addrY: this.__surfaceLibraryReader.loadUFloat16(),
      curvatureU: this.__surfaceLibraryReader.loadFloat16(),
      curvatureV: this.__surfaceLibraryReader.loadFloat16(),
      sizeU: this.__surfaceLibraryReader.loadFloat16(), // size U
      sizeV: this.__surfaceLibraryReader.loadFloat16(), // size V
      flags: this.__surfaceLibraryReader.loadFloat16(),
      trimSetId: loadTrimSetId(), // trimSetId
    }
  }

  /**
   * The getSurfaceData method.
   * @param {any} surfaceId - The surfaceId param.
   * @return {any} - The return value.
   */
  getSurfaceData(surfaceId, includeTrimSet = true) {
    const dims = this.getSurfaceDims(surfaceId);

    const surfaceType = this.getSurfaceType(surfaceId);
    const readDomain = () => {
      const domain = new zeaEngine.Box2();
      domain.p0.x = this.__surfaceLibraryReader.loadFloat16();
      domain.p0.y = this.__surfaceLibraryReader.loadFloat16();
      domain.p1.x = this.__surfaceLibraryReader.loadFloat16();
      domain.p1.y = this.__surfaceLibraryReader.loadFloat16();
      return domain
    };
    if (dims.trimSetId >= 0 && includeTrimSet)
      dims.trimSet = this.__trimSetLibrary.getTrimSetCurves(dims.trimSetId);

    switch (surfaceType) {
      case CADSurfaceTypes.SURFACE_TYPE_PLANE: {
        const domain = readDomain();
        return {
          surfaceId,
          dims,
          surfaceType: 'SURFACE_TYPE_PLANE',
          domain,
        }
      }
      case CADSurfaceTypes.SURFACE_TYPE_FAN: {
        const domain = readDomain();
        const points = [];
        const numPoints = dims.curvatureU + 1;
        for (let j = 0; j < numPoints; j++) {
          const p = new zeaEngine.Vec2(
            this.__surfaceLibraryReader.loadFloat16(),
            this.__surfaceLibraryReader.loadFloat16()
          );
          points.push(p);
        }
        return {
          surfaceId,
          dims,
          surfaceType: 'SURFACE_TYPE_FAN',
          domain,
          points,
        }
      }
      case CADSurfaceTypes.SURFACE_TYPE_CONE: {
        const domain = readDomain();
        const radius = this.__surfaceLibraryReader.loadFloat16();
        const semiAngle = this.__surfaceLibraryReader.loadFloat16();
        return {
          surfaceId,
          dims,
          surfaceType: 'SURFACE_TYPE_CONE',
          domain,
          radius,
          semiAngle,
        }
      }
      case CADSurfaceTypes.SURFACE_TYPE_CYLINDER: {
        const domain = readDomain();
        const radius = this.__surfaceLibraryReader.loadFloat16();
        return {
          surfaceId,
          dims,
          surfaceType: 'SURFACE_TYPE_CYLINDER',
          domain,
          radius,
        }
      }
      case CADSurfaceTypes.SURFACE_TYPE_SPHERE: {
        const domain = readDomain();
        const radius = this.__surfaceLibraryReader.loadFloat16();
        return {
          surfaceId,
          dims,
          surfaceType: 'SURFACE_TYPE_SPHERE',
          domain,
          radius,
        }
      }
      case CADSurfaceTypes.SURFACE_TYPE_TORUS: {
        const domain = readDomain();
        const majorRadius = this.__surfaceLibraryReader.loadFloat16();
        const minorRadius = this.__surfaceLibraryReader.loadFloat16();
        return {
          surfaceId,
          dims,
          surfaceType: 'SURFACE_TYPE_TORUS',
          domain,
          majorRadius,
          minorRadius,
        }
      }
      case CADSurfaceTypes.SURFACE_TYPE_LINEAR_EXTRUSION: {
        const domain = readDomain();

        let curveIndex;
        // if (this.cadDataVersion.lessThan([0, 0, 27])) {
        //   // Note: -1 is a valid value for trimset id, so can't use an unsigned float value.
        //   const partA = this.__surfaceLibraryReader.loadFloat16()
        //   const partB = this.__surfaceLibraryReader.loadFloat16()
        //   curveIndex = partA + (partB << 8)
        // } else {
          // curveIndex = this.__surfaceLibraryReader.loadUInt32From2xUFloat16()
          
          const partA = this.__surfaceLibraryReader.loadUFloat16();
          const partB = this.__surfaceLibraryReader.loadUFloat16();
          curveIndex = partA + partB * 2048;
        // }

        const curveData = this.getCurveData(curveIndex);

        const curve_tr = new zeaEngine.Vec3(
          this.__surfaceLibraryReader.loadFloat16(),
          this.__surfaceLibraryReader.loadFloat16(),
          this.__surfaceLibraryReader.loadFloat16()
        );
        const curve_ori = new zeaEngine.Quat(
          this.__surfaceLibraryReader.loadFloat16(),
          this.__surfaceLibraryReader.loadFloat16(),
          this.__surfaceLibraryReader.loadFloat16(),
          this.__surfaceLibraryReader.loadFloat16()
        );

        return {
          surfaceId,
          dims,
          surfaceType: 'SURFACE_TYPE_LINEAR_EXTRUSION',
          domain,
          curve_tr,
          curve_ori,
          curveData,
          partA,
          partB
        }
      }
      case CADSurfaceTypes.SURFACE_TYPE_REVOLUTION_FLIPPED_DOMAIN: 
      case CADSurfaceTypes.SURFACE_TYPE_REVOLUTION: {
        const domain = readDomain();

        let curveIndex;
        if (this.cadDataVersion.lessThan([0, 0, 27])) {
          // Note: -1 is a valid value for trimset id, so can't use an unsigned float value.
          const partA = this.__surfaceLibraryReader.loadFloat16();
          const partB = this.__surfaceLibraryReader.loadFloat16();
          curveIndex = partA + (partB << 8);
        } else {
          curveIndex = this.__surfaceLibraryReader.loadUInt32From2xUFloat16();
        }

        const curve_tr = new zeaEngine.Vec3(
          this.__surfaceLibraryReader.loadFloat16(),
          this.__surfaceLibraryReader.loadFloat16(),
          this.__surfaceLibraryReader.loadFloat16()
        );
        const curve_ori = new zeaEngine.Quat(
          this.__surfaceLibraryReader.loadFloat16(),
          this.__surfaceLibraryReader.loadFloat16(),
          this.__surfaceLibraryReader.loadFloat16(),
          this.__surfaceLibraryReader.loadFloat16()
        );

        const curveData = this.getCurveData(curveIndex);

        return {
          surfaceId,
          dims,
          surfaceType: 'SURFACE_TYPE_REVOLUTION',
          domain,
          curve_tr,
          curve_ori,
          curveData,
        }
      }
      case CADSurfaceTypes.SURFACE_TYPE_NURBS_SURFACE: {
        const domain = readDomain();
        const degreeU = this.__surfaceLibraryReader.loadFloat16();
        const degreeV = this.__surfaceLibraryReader.loadFloat16();
        const numCPsU = this.__surfaceLibraryReader.loadFloat16();

        const numCPsV = this.__surfaceLibraryReader.loadFloat16();
        const numKnotsU = this.__surfaceLibraryReader.loadFloat16();
        const numKnotsV = this.__surfaceLibraryReader.loadFloat16();
        const flags = this.__surfaceLibraryReader.loadFloat16();
        const periodicU = (flags & SURFACE_FLAG_PERIODIC_U) != 0;
        const periodicV = (flags & SURFACE_FLAG_PERIODIC_V) != 0;
        // this.__surfaceLibraryReader.advance(2);

        const controlPoints = [];
        for (let j = 0; j < numCPsU * numCPsV; j++) {
          const p = new zeaEngine.Vec4(
            this.__surfaceLibraryReader.loadFloat16(),
            this.__surfaceLibraryReader.loadFloat16(),
            this.__surfaceLibraryReader.loadFloat16(),
            this.__surfaceLibraryReader.loadFloat16()
          );
          controlPoints.push(p);
        }
        const knotsU = [];
        for (let j = 0; j < numKnotsU; j++) {
          knotsU.push(this.__surfaceLibraryReader.loadFloat16());
        }
        const knotsV = [];
        for (let j = 0; j < numKnotsV; j++) {
          knotsV.push(this.__surfaceLibraryReader.loadFloat16());
        }
        return {
          surfaceId,
          dims,
          surfaceType: 'SURFACE_TYPE_NURBS_SURFACE',
          domain,
          periodicU,
          periodicV,
          degreeU,
          degreeV,
          numCPsU,
          numCPsV,
          controlPoints,
          knotsU,
          knotsV,
        }
      }
      case CADSurfaceTypes.SURFACE_TYPE_POLY_PLANE: {
        const p0 = this.__surfaceLibraryReader.loadFloat16Vec2();
        const p1 = this.__surfaceLibraryReader.loadFloat16Vec2();
        const p2 = this.__surfaceLibraryReader.loadFloat16Vec2();
        const p3 = this.__surfaceLibraryReader.loadFloat16Vec2();
        return {
          surfaceId,
          dims,
          surfaceType: 'SURFACE_TYPE_POLY_PLANE',
          points: [p0, p1, p2, p3],
        }
      }
      default: {
        const surfaceType = this.getSurfaceType(surfaceId);
        console.warn('Invalid Surface Type:', surfaceType, " surfaceId:", surfaceId);
      
      }
    }
  }

  /** ************************************************************
   *  NURBS Utils
   **************************************************************/

  /**
   * Finds knot vector span.
   * @param {number} u - Parametric value.
   * @param {number} degree - Degree.
   * @param {array} knots - Knot vector.
   * @param {array} knotValues - The knotValues param.
   * @return {number} - Returns the span.
   */
  findSpan(u, degree, knots, knotValues) {
    if (this.cadDataVersion.greaterOrEqualThan([0,0,6])) {
      this.cadDataVersion;
      // EXPORT_KNOTS_AS_DELTAS

      let nextKnot = knots[0];
      let knot = nextKnot;

      let span = 1;
      const n = knots.length - degree - 1;
      // Linear Search...
      for (; span < n; span++) {
        nextKnot += knots[span];
        if (span > degree && u < nextKnot) {
          span--;
          break
        }
        knot = nextKnot;
      }
      if (span == n) {
        span--;
      }

      // Calculate knot values
      knotValues[degree] = knot;
      let left = knot;
      let right = knot;
      for (let i = 1; i <= degree; i++) {
        left -= knots[span - i + 1];
        right += knots[span + i];
        knotValues[degree - i] = left;
        knotValues[degree + i] = right;
      }
      return span
    }
  }

  /**
   * Calculate basis functions.
   * See The NURBS Book, page 70, algorithm A2.2
   * span : span in which u lies
   * @param {any} u - Parametric point.
   * @param {any} degree - Degree.
   * @param {any} knots - Knot vector.
   * @param {any} bvD - The bvD param.
   * @return {any} - Returns array[degree+1] with basis functions values.
   */
  calcBasisValues(u, degree, knots, bvD) {
    const left = [];
    const right = [];
    // Basis[0] is always 1.0
    const basisValues = [1.0];
    bvD[0] = 0.0;

    for (let j = 1; j <= degree; ++j) {
      left[j] = u - knots[degree + 1 - j];
      right[j] = knots[degree + j] - u;

      let saved = 0.0;
      for (let r = 0; r < j; ++r) {
        const rv = right[r + 1];
        const lv = left[j - r];
        const temp = basisValues[r] / (rv + lv);
        basisValues[r] = saved + rv * temp;
        saved = lv * temp;
      }

      basisValues[j] = saved;

      // Calculate N' if on second to last iteration
      if (j == degree - 1 || degree == 1) {
        saved = 0.0;
        // Loop through all basis values
        for (let r = 0; r < degree; r++) {
          // Calculate a temp variable
          const jr_z = r + 1;
          // Calculate right side
          const kp_0 = knots[jr_z + degree];
          const kp_1 = knots[jr_z];
          const tmp = (degree * basisValues[r]) / (kp_0 - kp_1);
          // Calculate derivative value
          bvD[r] = saved - tmp;
          // Swap right side to left
          saved = tmp;
        }
        // Save the last der-basis
        bvD[degree] = saved;
      }
    }

    return basisValues
  }

  

  /**
   * Calculate basis function derivativess.
   * See The NURBS Book, page 70, algorithm A2.2
   * span : span in which u lies
   * https://github.com/pradeep-pyro/tinynurbs/blob/master/include/tinynurbs/core/basis.h#L163
   * @param {any} u - Parametric point.
   * @param {any} degree - Degree.
   * @param {any} knots - Knot vector.
   * @return {any} - Returns array[degree+1] with basis function derivative values.
   */
  calcBasisDerivatives(u, degree, knots) {

    const left = [];
    const right = [];
    let saved = 0.0;
    let temp = 0.0;

    const ndu = [];
    for (let j = 0; j <= degree; j++) {
      ndu.push([]);
    }
    ndu[0][0] = 1.0;
    
    for (let j = 1; j <= degree; j++) {
      left[j] = u - knots[degree + 1 - j];
      right[j] = knots[degree + j] - u;
      saved = 0.0;

      for (let r = 0; r < j; r++) {
        const rv = right[r+1];
        const lv = left[j-r];
        const rvlv = rv + lv;

        // Lower triangle
        ndu[j][r] = rvlv;
        temp = ndu[r][j - 1] / rvlv;
        // Upper triangle
        ndu[r][j] = saved + rv * temp;
        saved = lv * temp;
      }

      ndu[j][j] = saved;
    }

    const ders = [[],[]];
    for (let j = 0; j <= degree; j++) {
      ders[0][j] = ndu[j][degree];
    }

    const a = [[],[]];
    for (let j = 0; j <= degree; j++) {
      a[0].push(0);
      a[1].push(0);
    }

    for (let r = 0; r <= degree; r++) {
      let s1 = 0;
      let s2 = 1;
      a[0][0] = 1.0;

      // for (int k = 1; k <= 1; k++) 
      {
        const k = 1;
        let d = 0.0;
        const rk = r - k;
        const pk = degree - k;
        let j1 = 0;
        let j2 = 0;

        if (r >= k) {
          a[s2][0] = a[s1][0] / ndu[pk + 1][rk];
          d = a[s2][0] * ndu[rk][pk];
        }

        if (rk >= -1) {
          j1 = 1;
        }
        else {
          j1 = -rk;
        }

        if (r - 1 <= pk) {
          j2 = k - 1;
        }
        else {
          j2 = degree - r;
        }

        for (let j = j1; j <= j2; j++) {
          a[s2][j] = (a[s1][j] - a[s1][j - 1]) / ndu[pk + 1][rk + j];
          d += a[s2][j] * ndu[rk + j][pk];
        }

        if (r <= pk) {
          a[s2][k] = -a[s1][k - 1] / ndu[pk + 1][r];
          d += a[s2][k] * ndu[r][pk];
        }

        ders[k][r] = d;

        const temp = s1;
        s1 = s2;
        s2 = temp;
      }
    }

    let fac = (degree);
    // for (int k = 1; k <= 1; k++) 
    {
      const k = 1;
      for (let j = 0; j <= degree; j++) {
        ders[k][j] = ders[k][j] * fac;
      }
      fac *= (degree - k);
    }

    return ders;
  }

  // http://www.nar-associates.com/nurbs/programs/dbasisu.c
  /* Subroutine to generate B-spline basis functions and their derivatives for uniform open knot vectors. */

  /**
   * Calculate rational B-Spline surface point.
   * See The NURBS Book, page 134, algorithm A4.3
   *
   * p1, p2 : degrees of B-Spline surface
   * U1, U2 : knot vectors
   * P      : control points (x, y, z, w)
   * u, v   : parametric values
   *
   * returns point for given (u, v)
   *
   * @param {any} surfaceData - The surfaceData param.
   * @param {any} params - The params param.
   * @return {any} - The return value.
   */
  calcSurfacePoint(surfaceData, params) {
    const d = surfaceData;

    const u = Math.remap(params[0], 0, 1, d.domain.p0.x, d.domain.p1.x);
    const v = Math.remap(params[1], 0, 1, d.domain.p0.y, d.domain.p1.y);


    const knotValuesU = [];
    const spanU = this.findSpan(u, d.degreeU, d.knotsU, knotValuesU);
    const knotValuesV = [];
    const spanV = this.findSpan(v, d.degreeV, d.knotsV, knotValuesV);

    const bvdsU = [];
    const basisValuesU = this.calcBasisValues(u, d.degreeU, knotValuesU, bvdsU);
    const bvdsV = [];
    const basisValuesV = this.calcBasisValues(v, d.degreeV, knotValuesV, bvdsV);

    // const dersU = this.calcBasisDerivatives(u, d.degreeU, knotValuesU)
    // const dersV = this.calcBasisDerivatives(v, d.degreeV, knotValuesV)
    // const basisValuesU = dersU[0]
    // const basisValuesV = dersV[0]
    
    // console.log("knotValuesU:", knotValuesU)
    // console.log("basisValuesU:", basisValuesU)
    // console.log("knotValuesV:", knotValuesV)
    // console.log("basisValuesV:", basisValuesV)
    // }
    // else {

    // }

    const pos = new zeaEngine.Vec3(0, 0, 0);
    const tangentU = new zeaEngine.Vec3(0, 0, 0);
    const tangentV = new zeaEngine.Vec3(0, 0, 0);
    let w = 0.0;
    const cvU0 = spanU - d.degreeU;
    const cvV0 = spanV - d.degreeV;
    for (let y = 0; y <= d.degreeV; ++y) {
      // let vindex = (spanV - d.degreeV + y) % d.numCPsV;
      const vindex = cvV0 + y;
      for (let x = 0; x <= d.degreeU; ++x) {
        // const uindex = (spanU - d.degreeU + x) % d.numCPsU;
        const uindex = cvU0 + x;

        const pt = d.controlPoints[uindex + vindex * d.numCPsU];
        const weight = pt.t;

        const bvU = basisValuesU[x];
        const bvV = basisValuesV[y];
        // const bvU = dersU[0][x]
        // const bvV = dersV[0][y]

        const bvw = weight * bvU * bvV;
        pos.addInPlace(pt.scale(bvw));
        w += bvw;
        
        const bvdU = bvdsU[x];
        const bvdV = bvdsV[y];
        // const bvdU = dersU[1][x]
        // const bvdV = dersV[1][y]
        tangentU.addInPlace(pt.scale(bvdU * bvV));
        tangentV.addInPlace(pt.scale(bvU * bvdV));
      }
    }
    if (w == 0 || isNaN(w) || !isFinite(w))
      console.warn('Unable to evaluate surface');

    // console.log('spanV:', spanV, ' v:', v, ' w:', w)
    pos.scaleInPlace(1 / w);

    ///////////////////////////////////////////////////////
    // Calculate normal.
    const spanRangeU = knotValuesU[d.degreeU + 1] - knotValuesU[d.degreeU];
    const spanRangeV = knotValuesV[d.degreeV + 1] - knotValuesV[d.degreeV];
    const eqKnotRangeU = ( d.domain.p1.x - d.domain.p0.x ) / d.knotsU.length;
    const eqKnotRangeV = ( d.domain.p1.y - d.domain.p0.y ) / d.knotsV.length;

    // console.log(v, 'spanRangeV:', spanRangeV, ' eqKnotRangeV:', eqKnotRangeV, spanRangeV / eqKnotRangeV)
  
    // Note: for COOLANT_INLET_PORT_01.ipt_faceWithBlackEdge.
    // this tollerance needed to be quite high. (bigger than 0.005)
    
    if (spanRangeU / eqKnotRangeU < 0.01) { 
      // In some cases (COOLANT_INLET_PORT_01.ipt_faceWithBlackEdge.)
      // we have span segment which has close to zero delta, and 
      // so the normals are broken. We want to advace along the 
      // e.g. [0, 0, 0, 0.00001, 1, 3, 3, 3]
      // length of the span rather than when we have a pinched corner, 
      // where we move along the toher direction.
      // console.log(v, 'spanRangeU:', spanRangeU, ' eqKnotRangeU:', eqKnotRangeU, spanRangeU / eqKnotRangeU)
  
      let cvU = cvU0;
      if (v > d.domain.p1.y - 0.0001) {
        // If at the end then we grab the end of the pevious row.
        cvU = cvU0 + d.degreeU - 2;
      } else {
        // if the broken normal is at the start of the U range, then 
        // we will grab the next in the row. 
        cvU = cvU0 + 1;
      }

      const spanLerpV = (u - knotValuesV[d.degreeV]) / spanRangeV;
      const cvV = cvV0 + Math.floor(spanLerpV * d.degreeV);
  
      const pt0 = d.controlPoints[cvU + cvV * d.numCPsU].toVec3();
      const pt1 = d.controlPoints[(cvU+1) + cvV * d.numCPsU].toVec3();
  
      tangentU.setFromOther(pt1.subtract(pt0));
    } else if (tangentU.length() < 0.05) {
      // The derivative in the V direction is zero, 
      // so we calculate the linear derivative for the next control points along.
      
      let cvV;
      if (spanV > d.degreeV) {
        // If at the end then we grab the end of the pevious row.
        cvV = cvV0 + d.degreeV - 2;
      } else {
        // if the broken normal is at the start of the V range, then 
        // we will grab the next in the row. 
        cvV = cvV0 + 1;
      }
      
      const spanLerpU = (u - knotValuesU[d.degreeU]) / spanRangeU;
      const cvU = cvU0 + Math.floor(spanLerpU * d.degreeU);
      
      const pt0 = d.controlPoints[cvU + cvV * d.numCPsU].toVec3();
      const pt1 = d.controlPoints[(cvU + 1) + cvV * d.numCPsU].toVec3();
  
      tangentU.setFromOther(pt1.subtract(pt0));
      // tangentU.setFromOther(pt0.subtract(pt1));
    }

    if (spanRangeV / eqKnotRangeV < 0.01) {
      // In some cases (COOLANT_INLET_PORT_01.ipt_faceWithBlackEdge.)
      // we have span segment which has close to zero delta, and 
      // so the normals are broken. We want to advace along the 
      // e.g. [0, 0, 0, 0.00001, 1, 3, 3, 3]
      // length of the span rather than when we have a pinched corner, 
      // where we move along the toher direction.
      // console.log(v, 'spanRangeV:', spanRangeV, ' eqKnotRangeV:', eqKnotRangeV, spanRangeV / eqKnotRangeV)
  
      let cvV = cvV0;
      if (v > d.domain.p1.y - 0.0001) {
        // If at the end then we grab the end of the pevious row.
        cvV = cvV0 + d.degreeV - 2;
      } else {
        // if the broken normal is at the start of the V range, then 
        // we will grab the next in the row. 
        cvV = cvV0 + 1;
      }

      const spanLerpU = (u - knotValuesU[d.degreeU]) / spanRangeU;
      const cvU = cvU0 + Math.floor(spanLerpU * d.degreeU);

      const pt0 = d.controlPoints[cvU + cvV * d.numCPsU].toVec3();
      const pt1 = d.controlPoints[cvU + (cvV + 1) * d.numCPsU].toVec3();
  
      tangentV.setFromOther(pt1.subtract(pt0));
    } else if (tangentV.length() < 0.05) {
      // The derivative in the V direction is zero, 
      // so we calculate the linear derivative for the next control points along.

      let cvU = cvU0;
      if (v > d.domain.p1.y - 0.0001) {
        // If at the end then we grab the end of the pevious row.
        cvU = cvU0 + d.degreeU - 2;
      } else {
        // if the broken normal is at the start of the U range, then
        // we will grab the next in the row.
        cvU = cvU0 + 1;
      }

      const spanLerpV = (u - knotValuesV[d.degreeV]) / spanRangeV;
      const cvV = cvV0 + Math.floor(spanLerpV * d.degreeV);
  
      const pt0 = d.controlPoints[cvU + cvV * d.numCPsU].toVec3();
      const pt1 = d.controlPoints[cvU + (cvV+1) * d.numCPsU].toVec3();
  
      tangentV.setFromOther(pt1.subtract(pt0));
    }

    const normal = tangentU.cross(tangentV).normalize();

    return {
      pos,
      normal,
    }
  }

  // https://github.com/arennuit/libnurbs/blob/3f7daae483a615a13d21e5c674f412ccb8587b6e/nurbs%2B%2B-3.0.11/nurbs/nurbs.cpp

  /**
   * The generatePolygonSurface method.
   * @param {any} surfaceId - The surfaceId param.
   * @param {number} lod - The lod param.
   * @return {any} - The return value.
   */
  generatePolygonSurface(surfaceId, lod = 0) {
    if (this.__meshes[surfaceId]) {
      // const color = this.__meshes[surfaceId].mat.getParameter('BaseColor').getValue();
      // color.r = color.r + 0.2;
      // console.log("surface Instanced:" + surfaceId + ":" + color.r);
      return this.__meshes[surfaceId]
    }

    if (
      this.getSurfaceType(surfaceId) !=
      CADSurfaceTypes.SURFACE_TYPE_NURBS_SURFACE
    ) {
      return
    }
    const surfaceData = this.getSurfaceData(surfaceId);
    if (!surfaceData) {
      return
    }
    const M = surfaceData.numCPsU * Math.pow(2, lod);
    const N = surfaceData.numCPsV * Math.pow(2, lod);

    console.log('generatePolygonSurface:' + surfaceId + ' M:' + M + ' N:' + N);

    const quad = new zeaEngine.Plane(1.0, 1.0, M, N);
    const normalsGeom = new Lines();
    normalsGeom.setNumVertices((M+1) * (N+1) * 2);
    normalsGeom.setNumSegments((M+1) * (N+1));
    const normalsGeom_PosAttr = normalsGeom.getVertexAttribute('positions');
    const normalsLength = 0.2;

    let voff = 0;
    const normals = quad.getVertexAttribute('normals');
    for (let j = 0; j <= N; j++) {
      const v = j / N;
      for (let i = 0; i <= M; i++) {
        const u = i / M;
        const pt = this.calcSurfacePoint(surfaceData, [u, v]);

        quad.getVertex(voff).set(pt.pos.x, pt.pos.y, pt.pos.z);
        normals.getValueRef(voff).set(pt.normal.x, pt.normal.y, pt.normal.z);

        normalsGeom.setSegment(voff, (voff*2),  (voff*2)+1);
        // if (v == 0.0) 
        {
        normalsGeom_PosAttr.getValueRef(voff*2).set(pt.pos.x, pt.pos.y, pt.pos.z);
        normalsGeom_PosAttr.getValueRef((voff*2)+1).set(
            pt.pos.x + pt.normal.x * normalsLength,
            pt.pos.y + pt.normal.y * normalsLength,
            pt.pos.z + pt.normal.z * normalsLength
          );
        }

        voff++;
      }
    }

    // quad.computeVertexNormals();

    const material = new zeaEngine.Material('myMat', 'SimpleSurfaceShader');
    material.getParameter('BaseColor').setValue(zeaEngine.Color.random(0.15));
    quad.material = material;


    const normalsGeomMaterial = new zeaEngine.Material('myMat', 'FlatSurfaceShader');
    normalsGeomMaterial.getParameter('BaseColor').setValue(new zeaEngine.Color(1, 0, 0));
    normalsGeom.material = normalsGeomMaterial;

    this.__meshes[surfaceId] = quad;
    return { mesh:quad, normals: normalsGeom }
  }

  /**
   * The generateHullGeometry method.
   * @param {any} surfaceId - The surfaceId param.
   * @return {any} - The return value.
   */
  generateHullGeometry(surfaceId) {
    if (this.__hulls[surfaceId]) {
      // const color = this.__hulls[surfaceId].mat.getParameter('BaseColor').getValue();
      // color.r = color.r + 0.2;
      // console.log("surface Instanced:" + surfaceId + ":" + color.r);
      return this.__hulls[surfaceId]
    }

    if (
      this.getSurfaceType(surfaceId) !=
      CADSurfaceTypes.SURFACE_TYPE_NURBS_SURFACE
    ) {
      return
    }
    const surfaceData = this.getSurfaceData(surfaceId);
    if (!surfaceData) {
      return
    }
    console.log(
      'generateHullGeometry:' +
        surfaceId +
        ' numCPsU:' +
        surfaceData.numCPsU +
        ' numCPsV:' +
        surfaceData.numCPsV
    );
    const hull = new Hull(surfaceData.numCPsU, surfaceData.numCPsV);

    let voff = 0;
    for (let j = 0; j < surfaceData.numCPsV; j++) {
      for (let i = 0; i < surfaceData.numCPsU; i++) {
        const index = i + j * surfaceData.numCPsU;
        const pt = surfaceData.controlPoints[index];
        hull.getVertex(voff).set(pt.x, pt.y, pt.z);
        voff++;
      }
    }

    const material = new zeaEngine.Material('hullMaterial', 'FlatSurfaceShader');
    material.getParameter('BaseColor').setValue(zeaEngine.Color.random(-0.25));
    hull.material = material;

    this.__hulls[surfaceId] = hull;
    return hull
  }

  /**
   * The dumpDebugSurfaces method.
   */
  dumpDebugSurfaces() {
    const surfacesData = [];
    for (let i = 0; i < this.__numSurfaces; i++) {
      try {
        surfacesData.push(this.getSurfaceData(i, false));
      } catch (e) {
        console.warn("Error accessing Surface: ", i, e);
        surfacesData.push({});
      }
    }
    return surfacesData;
  }


  /**
   * The dumpDebugCurves method.
   */
  dumpDebugCurves() {
    const curvesData = [];
    for (let i = 0; i < this.__numSurfaces; i++) {
      try {
        curvesData.push(this.getCurveData(i));
      } catch (e) {
        console.warn("Error accessing Curve: ", i, e);
        curvesData.push({});
      }
    }
    return curvesData
  }

  /**
   * The logFormfactors method.
   */
  logFormfactors() {
    for (const ff in this.__formFactors)
      console.log(ff + ':' + this.__formFactors[ff]);
  }
}

/** Class representing a CAD trim set library.
 * @ignore
 */
class CADTrimSetLibrary {
  /**
   * Create a CAD trim set library.
   */
  constructor() {
    this.__reader = undefined;
  }

  /**
   * The setBinaryBuffer method.
   * @param {any} trimSetReader - The trimSetReader param.
   * @param {number} version - The version param.
   */
  setBinaryBuffer(trimSetReader, version) {
    this.__reader = trimSetReader;

    this.__numTrimSets = this.__reader.loadUInt32();
    if (version.greaterThan([0, 0, 0])) {
      this.__totalTrimSurfaceArea = this.__reader.loadFloat32();
    }
    else {
      this.__totalTrimSurfaceArea = 0.0;
      for (let i = 0; i < this.__numTrimSets; i++) {
        const dims = this.getTrimSetDim(i);
        const area = dims[0] * dims[1];
        this.__totalTrimSurfaceArea += area;
      }
    }

    const sideLength = Math.sqrt(this.__totalTrimSurfaceArea);

    const maxTexSize = zeaEngine.SystemDesc.gpuDesc.maxTextureSize;
    // I'm not sure whats going on here.
    // The xlarge size should be at most maxTexSize >> 1 (e.g. 50% wasted space.)
    const xlargeTexSize = maxTexSize >> 1;
    const largeTexSize = maxTexSize >> 2;
    const medTexSize = maxTexSize >> 3;
    const smallTexSize = maxTexSize >> 4;

    // Note: on big scenes like the Spyder, the texels often fail
    // to pack when tex size is too small, causing artifacts in trimming.
    // Therefore the biggest texture size is half the maximum.
    this.__texelSizes = [
      sideLength / smallTexSize,
      sideLength / medTexSize,
      sideLength / largeTexSize,
      sideLength / xlargeTexSize,
    ];
    // console.log("sideLength:", sideLength, this.__texelSizes);

    ////////////////////////////
    // Debugging.
    // for (let i = 0; i < this.__numTrimSets; i++) {
    //   console.log({
    //     dims: this.getTrimSetDim(i),
    //     curves: this.getTrimSetCurves(i)
    //   })
    // }
  }

  /**
   * The getBinaryBuffer method.
   * @return {any} - The return value.
   */
  getBinaryBuffer() {
    if (!this.__reader) return null
    return this.__reader.data
  }

  /**
   * The getNumTrimSets method.
   * @return {any} - The return value.
   */
  getNumTrimSets() {
    return this.__numTrimSets
  }

  /**
   * The getTrimArea method.
   * @return {any} - The return value.
   */
  getTrimArea() {
    return this.__totalTrimSurfaceArea
  }

  /**
   * The getTexelSize method.
   * @param {any} lod - The lod param.
   * @param {any} numAssets - The numAssets param.
   * @return {any} - The return value.
   */
  getTexelSize(lod, numAssets) {
    // For scenes with many assets we drop down the texel detail
    // so they load without destroying the GPU.
    let lodId;
    if (numAssets < 2) lodId = 3;
    else if (numAssets < 6) lodId = 2;
    else {
      lodId = 1; // LOD 0 is just a mess.
    }

    // return 4
    return this.__texelSizes[lodId]
    // return this.__texelSizes[Math.clamp(lod, 0, this.__texelSizes.length-1)];
  }

  /**
   * The getTrimSetDim method.
   * @param {any} trimSetId - The trimSetId param.
   * @return {any} - The return value.
   */
  getTrimSetDim(trimSetId) {
    this.__reader.seek(8 + trimSetId * 4);
    this.__reader.seek(this.__reader.loadUInt32());

    const size_x = this.__reader.loadFloat32(); // size in scene units
    const size_y = this.__reader.loadFloat32(); // size in scene units
    return [size_x, size_y]
  }

  /**
   * The getTrimSetCurves method.
   * @param {any} trimSetId - The trimSetId param.
   * @return {any} - The return value.
   */
  getTrimSetCurves(trimSetId) {
    this.__reader.seek(8 + trimSetId * 4);
    this.__reader.seek(this.__reader.loadUInt32());

    const size_x = this.__reader.loadFloat32(); // size in scene units
    const size_y = this.__reader.loadFloat32(); // size in scene units
    const numHoles = this.__reader.loadUInt32();
    const numPermiterCurves = this.__reader.loadUInt32();
    const loadCurveRef = () => {
      return {
        id: this.__reader.loadFloat32(),
        xfo_tr: [this.__reader.loadFloat32(), this.__reader.loadFloat32()],
        xfo_rot: [
          this.__reader.loadFloat32(),
          this.__reader.loadFloat32(),
          this.__reader.loadFloat32(),
          this.__reader.loadFloat32(),
        ],
        flags: this.__reader.loadFloat32(),
      }
    };
    const perimeter = [];
    for (let i = 0; i < numPermiterCurves; i++) {
      perimeter.push(loadCurveRef());
    }
    const holes = [];
    for (let i = 0; i < numHoles; i++) {
      const hole = [];
      const numHoleCurves = this.__reader.loadUInt32();
      for (let i = 0; i < numHoleCurves; i++) {
        hole.push(loadCurveRef());
      }
      holes.push(hole);
    }
    return {
      size: [size_x, size_y],
      perimeter,
      holes,
    }
  }

  
  /**
   * The dumpDebugTrimSets method.
   */
  dumpDebugTrimSets() {
    const trimSetsData = [];
    for (let i = 0; i < this.__numTrimSets; i++) {
      try {
        trimSetsData.push({
          dims: this.getTrimSetDim(i),
          curves: this.getTrimSetCurves(i),
        });
      } catch (e) {
        console.warn("Error accessing TrimSet: ", i, e);
        trimSetsData.push({});
      }
    }
    return trimSetsData
  }
}

const bytesPerValue = 4; // 32 bit floats

/** Class representing a CAD body library.
 * @ignore
 */
class CADBodyLibrary {
  /**
   * Create a CAD body library.
   * @param {any} buffer - The buffer value.
   */
  constructor(buffer) {
    if (buffer != undefined) {
      this.setBinaryBuffer(buffer);
    }
  }

  /**
   * The setBinaryBuffers method.
   * @param {any} tocBuffer - The tocBuffer param.
   * @param {any} buffer - The buffer param.
   */
  setBinaryBuffers(tocBuffer, buffer) {
    this.__buffer = buffer;
    this.__reader = new zeaEngine.BinReader(this.__buffer);
    this.__size = Math.sqrt(buffer.byteLength / (4 * bytesPerValue)); // RGBA32 pixels

    this.__toc = tocBuffer; // new Uint32Array(tocBuffer);
    this.__tocReader = new zeaEngine.BinReader(tocBuffer);
    this.__numBodies = this.__tocReader.loadUInt32();

    // for (let i = 0; i < this.__numBodies; i++) {
    //     // console.log(JSON.stringify(this.getBodyDescData(i)));
    //     console.log(this.getBodyDescData(i));
    // }
  }

  /**
   * The getToc method.
   * @return {any} - The return value.
   */
  getToc() {
    return this.__toc
  }

  /**
   * The getBinaryBuffer method.
   * @return {any} - The return value.
   */
  getBinaryBuffer() {
    return this.__buffer
  }

  /**
   * The getNumBodies method.
   * @return {any} - The return value.
   */
  getNumBodies() {
    return this.__numBodies
  }

  /**
   * The getBodyDataTexelCoords method.
   * @param {any} bodyDescId - The bodyDescId param.
   * @return {any} - The return value.
   */
  getBodyDataTexelCoords(bodyDescId) {
    this.__tocReader.seek(4 + bodyDescId * (3 * 4));
    const x = this.__tocReader.loadUInt32();
    const y = this.__tocReader.loadUInt32();
    return {
      x,
      y,
    }
  }

  // eslint-disable-next-line require-jsdoc
  __seekBodyData(bodyDescId, offsetInBytes = 0) {
    const addr = this.getBodyDataTexelCoords(bodyDescId);
    // X, Y in pixels.

    const bytesPerPixel = 16; // RGBA32 pixels == 16 bytes perpixel
    const byteOffset =
      addr.x * bytesPerPixel + addr.y * bytesPerPixel * this.__size;
    // console.log("__seekSurfaceData:" + bodyDescId + " byteOffset:" + (byteOffset +offset) + " pixel:" + ((byteOffset +offset)/8) + " x:" + addr.x + " y:" + addr.y);
    this.__reader.seek(byteOffset + offsetInBytes);
  }

  /**
   * The getNumSurfacesForBody method.
   * @param {any} bodyDescId - The bodyDescId param.
   * @return {any} - The return value.
   */
  getNumSurfacesForBody(bodyDescId) {
    this.__seekBodyData(bodyDescId, 6 /* bbox*/ * bytesPerValue);
    const numBodySurfaces = this.__reader.loadFloat32();
    return numBodySurfaces
  }

  /**
   * The getBodyBBox method.
   * @param {any} bodyDescId - The bodyDescId param.
   * @return {any} - The return value.
   */
  getBodyBBox(bodyDescId) {
    this.__seekBodyData(bodyDescId);
    const bbox = new zeaEngine.Box3();
    bbox.p0 = this.__reader.loadFloat32Vec3();
    bbox.p1 = this.__reader.loadFloat32Vec3();
    return bbox
  }

  /**
   * The getBodyDescData method.
   * @param {any} bodyDescId - The bodyDescId param.
   * @return {any} - The return value.
   */
  getBodyDescData(bodyDescId) {
    this.__seekBodyData(bodyDescId);
    // console.log(this.__reader.pos() / 8);

    const bbox = new zeaEngine.Box3();
    bbox.p0 = this.__reader.loadFloat32Vec3();
    bbox.p1 = this.__reader.loadFloat32Vec3();
    // console.log(this.__reader.pos() / 8);
    const numBodySurfaces = this.__reader.loadFloat32();
    const surfaceRefs = [];
    for (let j = 0; j < numBodySurfaces; j++) {
      const surfaceId = this.__reader.loadFloat32();
      const xfo = new zeaEngine.Xfo(
        this.__reader.loadFloat32Vec3(),
        this.__reader.loadFloat32Quat(),
        this.__reader.loadFloat32Vec3()
      );
      const surfaceRef = {
        surfaceId,
        xfo,
      };
      surfaceRef.color = this.__reader.loadRGBAFloat32Color();
      surfaceRefs.push(surfaceRef);
    }

    const bodyDescData = {
      bbox,
      surfaceRefs,
    };

    return bodyDescData
  }
}

/** Class representing a CAD body.
 * @extends BaseGeomItem
 */
class CADBody extends zeaEngine.BaseGeomItem {
  /**
   * Create a CAD body.
   * @param {any} name - The name value.
   * @param {any} cadAsset - The cadAsset value.
   */
  constructor(name, cadAsset) {
    super(name);
    this.__bodyDescId = -1;
    this.__id = -1;
    this.__bodyBBox = new zeaEngine.Box3();
    this.__cadAsset = cadAsset; // Note: used in testing scenes.
    if (this.__cadAsset) this.__cadAsset.incCADBodyCount();

    this.__materialParam = this.addParameter(
      new zeaEngine.MaterialParameter('Material')
    );
    this.__colorParam = this.addParameter(
      new zeaEngine.ColorParameter('Color', new zeaEngine.Color(1, 0, 0, 0))
    );
  }

  /**
   * The getCADAsset method.
   * @return {any} - The return value.
   */
  getCADAsset() {
    return this.__cadAsset
  }

  /**
   * The destroy method.
   */
  destroy() {
    super.destroy();
  }

  /**
   * The clone method.
   * @param {any} flags - The flags param.
   * @return {any} - The return value.
   */
  clone(flags) {
    const cloned = new CADBody();
    cloned.copyFrom(this, flags);
    return cloned
  }

  /**
   * The copyFrom method.
   * @param {any} src - The src param.
   * @param {any} flags - The flags param.
   * @private
   */
  copyFrom(src, flags) {
    super.copyFrom(src, flags);
    this.__cadAsset = src.getCADAsset();
    this.__cadAsset.incCADBodyCount();

    this.setBodyDescId(src.getBodyDescId());
    this.setMaterial(src.getMaterial()); // clone?
  }

  // ////////////////////////////////////////
  // Geometry

  /**
   * The getBodyDescData method.
   * @return {any} - The return value.
   */
  getBodyDescData() {
    const bodyDescData = this.__cadAsset
      .getBodyLibrary()
      .getBodyDescData(this.__bodyDescId);
    for (const surfaceRef of bodyDescData.surfaceRefs) {
      surfaceRef.surfaceType = this.__cadAsset
        .getSurfaceLibrary()
        .getSurfaceTypeLabel(surfaceRef.surfaceId);
      surfaceRef.dims = this.__cadAsset
        .getSurfaceLibrary()
        .getSurfaceDims(surfaceRef.surfaceId);
    }
    return bodyDescData
  }

  /**
   * The getSurfaceRefs method.
   * @return {any} - The return value.
   */
  getSurfaceRefs() {
    const bodyData = this.getBodyDescData();
    return bodyData.surfaceRefs
  }

  /**
   * The getBodyDescId method.
   * @return {any} - The return value.
   */
  getBodyDescId() {
    return this.__bodyDescId
  }

  /**
   * The setBodyDescId method.
   * @param {any} bodyId - The bodyId param.
   */
  setBodyDescId(bodyId) {
    this.__bodyDescId = bodyId;
    this.__bodyBBox = this.__cadAsset
      .getBodyLibrary()
      .getBodyBBox(this.__bodyDescId);
    this._setBoundingBoxDirty();
  }

  /**
   * The getMaterial method.
   * @return {any} - The return value.
   */
  getMaterial() {
    return this.__materialParam.getValue()
  }

  /**
   * The setMaterial method.
   * @param {any} material - The material param.
   * @param {any} mode - The mode param.
   */
  setMaterial(material, mode) {
    this.__materialParam.setValue(material, mode);
  }

  /**
   * The _cleanBoundingBox method.
   * @param {any} bbox - The bbox param.
   * @return {any} - The return value.
   * @private
   */
  _cleanBoundingBox(bbox) {
    bbox = super._cleanBoundingBox(bbox);
    if (this.__bodyDescId != -1) {
      bbox.addBox3(this.__bodyBBox, this.getGlobalXfo());
    }
    return bbox
  }

  // ///////////////////////////
  // Lightmaps

  /**
   * The getLightmapName method.
   * @return {any} - The return value.
  getLightmapName() {
    return this.__lightmapName
  }
   */

  /**
   * The getLightmapCoordsOffset method.
   * @return {any} - The return value.
  getLightmapCoordsOffset() {
    return this.__lightmapCoordsParam.getValue()
  }
   */

  /**
   * The applyAssetLightmapSettings method.
   * The root asset item pushes its offset to the geom items in the
   * tree. This offsets the light cooords for each geom.
   * @param {any} lightmapName - The lightmapName param.
   * @param {any} offset - The offset param.
  applyAssetLightmapSettings(lightmapName, offset) {
    this.__lightmap = lightmapName
    const coords = this.__lightmapCoordsParam.getValue()
    coords.addInPlace(offset)
    this.__lightmapCoordsParam.setValue(coords)
  }
   */

  // ///////////////////////////
  // Persistence

  /**
   * The readBinary method.
   * @param {any} reader - The reader param.
   * @param {any} context - The context param.
   */
  readBinary(reader, context) {
    super.readBinary(reader, context);

    // Cache only in debug mode.
    this.__cadAsset = context.assetItem;
    this.__cadAsset.incCADBodyCount();

    this.setBodyDescId(reader.loadUInt32());

    if (context.versions['zea-cad'].lessThan([0, 0, 4])) {
      const materialName = reader.loadStr();
      // const materialName = 'Mat' + this.__bodyDescId;

      const materialLibrary = context.assetItem.getMaterialLibrary();
      let material = materialLibrary.getMaterial(materialName, false);
      if (!material) {
        // console.warn("Body :'" + this.name + "' Material not found:" + materialName);
        // material = materialLibrary.getMaterial('DefaultMaterial');

        material = new zeaEngine.Material(materialName, 'SimpleSurfaceShader');
        material
          .getParameter('BaseColor')
          .setValue(zeaEngine.Color.random(0.25), zeaEngine.ValueSetMode.DATA_LOAD);
        context.assetItem.getMaterialLibrary().addMaterial(material);
      }
      this.setMaterial(material, zeaEngine.ValueSetMode.DATA_LOAD);
    }

    if (
      context.versions['zea-cad'].greaterOrEqualThan([0, 0, 2]) &&
      context.versions['zea-cad'].lessThan([0, 0, 4])
    ) {
      this.__layers = reader.loadStrArray();
      // console.log("Layers:", this.__layers)
      for (const layer of this.__layers) context.addGeomToLayer(this, layer);
    }
  }

  /**
   * The generatePolygonMeshSurfaces method.
   * @param {number} lod - The lod param.
   * @return {any} - The return value.
   * @private
   */
  generatePolygonMeshSurfaces(lod = 0) {
    const treeItem = new zeaEngine.TreeItem(this.getName());

    // const standardMaterial = new Material('surfaces', 'SimpleSurfaceShader');
    // standardMaterial.getParameter('BaseColor').setValue(Color.random(0.4));

    const bodyData = this.getBodyDescData();
    bodyData.surfaceRefs.forEach((surfaceRef, surfaceIndex) => {
      const mesh = this.__cadAsset
        .getSurfaceLibrary()
        .generatePolygonSurface(surfaceRef.surfaceId, lod);
      if (mesh) {
        const geomItem = new zeaEngine.GeomItem(
          'Surface' + surfaceIndex + ':' + surfaceRef.surfaceId,
          mesh,
          mesh.material
        ); // this.__material);// mesh.mat);
        geomItem.setLocalXfo(surfaceRef.xfo);
        treeItem.addChild(geomItem);
      }
    });
    return treeItem
  }

  /**
   * The generateHullGeometry method.
   * @return {any} - The return value.
   * @private
   */
  generateHullGeometry() {
    const treeItem = new zeaEngine.TreeItem(this.getName());
    const bodyData = this.getBodyDescData();
    bodyData.surfaceRefs.forEach((surfaceRef, surfaceIndex) => {
      const hull = this.__cadAsset
        .getSurfaceLibrary()
        .generateHullGeometry(surfaceRef.surfaceId);
      if (hull) {
        const geomItem = new zeaEngine.GeomItem(
          'Hull' + surfaceIndex + ':' + surfaceRef.surfaceId,
          hull,
          hull.material
        );
        geomItem.setLocalXfo(surfaceRef.xfo);
        treeItem.addChild(geomItem);
        return false
      }
    });
    return treeItem
  }

  // ////////////////////////////////////////
  // Persistence

  /**
   * The toJSON method.
   * @param {any} flags - The flags param.
   * @return {any} - The return value.
   */
  toJSON(flags = 0) {
    const j = super.toJSON(flags);
    return j
  }

  /**
   * The toJSON method.
   * @param {any} j - The j param.
   * @param {any} flags - The flags param.
   */
  fromJSON(j, flags = 0) {
    super.fromJSON(j, flags);
  }
}

zeaEngine.sgFactory.registerClass('NURBSBody', CADBody);
zeaEngine.sgFactory.registerClass('CADBody', CADBody);

const cadFileExts = new RegExp('\\.(stp|step|jt|3dm|ifc|vlcad|zcad)$', 'i');

// eslint-disable-next-line require-jsdoc
function getLOD() {
  const urlParams = new URLSearchParams(window.location.search);
  if (urlParams.has('lod')) {
    return Number.parseInt(urlParams.get('lod'))
  }
  let fileId = urlParams.get('file-id');
  if (!fileId) {
    fileId = window.location.toString();
  }
  let lod = window.localStorage.getItem(fileId + '_LOD');
  if (window.localStorage.getItem(fileId + '_LOD')) {
    lod = Number.parseInt(window.localStorage.getItem(fileId + '_LOD'));
  } else {
    switch (zeaEngine.SystemDesc.deviceCategory) {
      case 'Low':
        lod = 1;
        break
      case 'Medium':
        lod = 2;
        break
      case 'High':
        lod = 3;
        break
    }
  }

  return lod
}

/** Class representing a CAD asset.
 * @extends AssetItem
 */
class CADAsset extends zeaEngine.AssetItem {
  /**
   * Create a CAD asset.
   * @param {any} name - The name value.
   */
  constructor(name) {
    super(name);

    this.__trimSetLibrary = new CADTrimSetLibrary();
    this.__surfaceLibrary = new CADSurfaceLibrary(this, this.__trimSetLibrary);
    this.__bodyLibrary = new CADBodyLibrary();
    this.__atlasSize = new zeaEngine.Vec2();
    this.__numCADBodyItems = 0;

    this.__datafileParam = this.addParameter(
      new zeaEngine.FilePathParameter('DataFilePath')
    );
    this.__datafileParam.valueChanged.connect(() => {
      this.loaded.setToggled(false);
      if (!this.getParameter('Lazy Load').getValue()) this.loadDataFile();
    });

    // this.__lightmapTexelSize = 2

    const lod = getLOD();
    this.addParameter(new zeaEngine.BooleanParameter('Lazy Load', false));
    this.addParameter(new zeaEngine.NumberParameter('LOD', lod));
    this.addParameter(new zeaEngine.NumberParameter('CurvatureToDetail', 0.5));
    this.addParameter(new zeaEngine.ColorParameter('CutPlaneColor', new zeaEngine.Color(1, 0, 0)));
    this.addParameter(new zeaEngine.Vec3Parameter('CutPlaneNormal', new zeaEngine.Vec3(1, 0, 0)));
    this.addParameter(new zeaEngine.NumberParameter('CutPlaneDist', 0.0));
  }

  /**
   * The isLoaded method.
   * @return {any} - The return value.
   */
  isLoaded() {
    return this.loaded.isToggled()
  }

  /**
   * The getLOD method.
   * @return {any} - The return value.
   */
  getLOD() {
    return Math.max(0, this.getParameter('LOD').getValue())
  }

  /**
   * The incCADBodyCount method.
   * @private
   */
  incCADBodyCount() {
    this.__numCADBodyItems++;
  }

  /**
   * The getNumBodyItems method.
   * @return {any} - The return value.
   */
  getNumBodyItems() {
    return this.__numCADBodyItems
  }

  /**
   * The getSurfaceLibrary method.
   * @return {any} - The return value.
   */
  getSurfaceLibrary() {
    return this.__surfaceLibrary
  }

  /**
   * The getTrimSetLibrary method.
   * @return {any} - The return value.
   */
  getTrimSetLibrary() {
    return this.__trimSetLibrary
  }

  /**
   * The getBodyLibrary method.
   * @return {any} - The return value.
   */
  getBodyLibrary() {
    return this.__bodyLibrary
  }

  /**
   * The getMaterialLibrary method.
   * @return {any} - The return value.
   */
  getMaterialLibrary() {
    return this.__materials
  }

  // ////////////////////////////////////////
  // Persistence

  /**
   * Returns the versioon of the data loaded by thie CADAsset.
   * @return {any} - The return value.
   */
  getVersion() {
    return this.cadfileversion
  }

  /**
   * The readBinary method.
   * @param {any} reader - The reader param.
   * @param {any} context - The context param.
   */
  readBinary(reader, context = {}) {
    context.assetItem = this;
    this.__numCADBodyItems = 0;

    context.versions = {};
    const v = reader.loadUInt8();
    reader.seek(0);
    
    // Note: the first char is str-len, so a change to the version string broke this code.
    // TODO: Fix this without this huge assumption below.
    // Note: previous non-semver only reached 7
    // 
    // if (v != 10) { 
    //   const version = new Version()
    //   version.patch = reader.loadUInt32()
    //   context.versions['zea-cad'] = version
    //   context.versions['zea-engine'] = version
    //   context.cadSDK = "SpatialIOP";
    // } else {
      context.versions['zea-cad'] = new zeaEngine.Version(reader.loadStr());
      context.cadSDK = reader.loadStr();
    // }
    this.cadfileversion = context.versions['zea-cad'];
    console.log("Loading CAD File version:", this.cadfileversion, " exported using SDK:", context.cadSDK);

    const plcbs = []; // Post load callbacks.
    context.resolvePath = (path, onSucceed, onFail) => {
      if (!path) throw new Error('Path not specified')

      // Note: Why not return a Promise here?
      // Promise evaluation is always async, so
      // all promisses will be resolved after the curent call stack
      // has terminated. In our case, we want all paths
      // to be resolved before the end of the function, which
      // we can handle easily with callback functions.
      const item = this.resolvePath(path);
      if (item) {
        onSucceed(item);
      } else {
        // Some paths resolve to items generated during load,
        // so push a callback to re-try after the load is complete.
        plcbs.push(() => {
          const param = this.resolvePath(path);
          if (param) onSucceed(param);
          else if (onFail) {
            onFail();
          } else {
            console.warn('Path unable to be resolved:' + path);
          }
        });
      }
    };
    context.addPLCB = plcb => plcbs.push(plcb);

    super.readBinary(reader, context);

    // Invoke all the post-load callbacks to resolve any
    // remaning references.
    for (const cb of plcbs) cb();  
  }

  /**
   * The loadDataFile method.
   * @return {Promise} - The primise value.
   * @private
   */
  loadDataFile() {
    if (this.__loadPromise) return this.__loadPromise

    this.__loadPromise = new Promise((resolve, reject) => {
      const file = this.__datafileParam.getFileDesc();
      if (!file) {
        console.warn('CADAsset data file not found.');
        return
      }

      const fileId = this.__datafileParam.getValue();

      const loadBinary = entries => {
        // let version = 0
        const treeReader = new zeaEngine.BinReader(
          (entries.tree2 || entries.tree).buffer,
          0,
          zeaEngine.SystemDesc.isMobileDevice
        );

        if (entries.bodies) {
          this.__bodyLibrary.setBinaryBuffers(
            entries.bodiestoc.buffer,
            entries.bodies.buffer
          );
        }
        this.readBinary(treeReader, {});

        const context = {
          versions: {},
        };
        context.versions['zea-cad'] = this.getVersion();
        context.versions['zea-engine'] = this.getEngineDataVersion();

        if (entries.geoms) {
          this.__geomLibrary.readBinaryBuffer(
            fileId,
            entries.geoms.buffer,
            context
          );
        }

        if (entries.trimSets) {
          const trimSets =
            entries.trimSets || entries.trimsets || entries.trimSets2;
          const trimSetReader = new zeaEngine.BinReader(
            trimSets.buffer,
            0,
            zeaEngine.SystemDesc.isMobileDevice
          );

          this.__trimSetLibrary.setBinaryBuffer(trimSetReader, this.getVersion());
        }

        if (entries.curves) {
          this.__surfaceLibrary.setBinaryBuffers(
            entries.curves.buffer,
            entries.surfaces.buffer,
            this.getVersion()
          );
        }

        // console.log(this.__name, " NumBaseItems:", this.getNumBaseItems(), " NumCADBodyItems:", this.__numCADBodyItems)

        if (this.__datafileLoaded) {
          // GOTO: loadAssetJSON...
          this.__datafileLoaded();
        } else {
          this.loaded.emit();
        }
        resolve();
      };

      if (file.metadata && file.metadata.ConvertFile) {
        let zcadFile;
        const zcadfileext = new RegExp('\\.(vlcad|zcad)$', 'i');
        file.metadata.ConvertFile.map(metadataFile => {
          if (zcadfileext.test(metadataFile.filename)) zcadFile = metadataFile;
        });
        if (zcadFile) {
          zeaEngine.resourceLoader.loadURL(fileId, zcadFile.url, loadBinary);
        } else {
          console.warn('ConvertFile metadata contains no vla file.');
        }
      } else if (file.url) {
        // Note: if setUrl was called on the FilePathParameter, then
        // the file may to have an fiename.extension, and we must assume it is
        // a zcad/vlcad file.
        zeaEngine.resourceLoader.loadUrl(fileId, file.url, loadBinary);
      } else {
        console.warn('CADAsset unable to load file:', file);
      }
    });

    return this.__loadPromise
  }

  // ////////////////////////////////////////
  // Persistence

  /**
   * The toJSON method.
   * @param {any} context - The context param.
   * @param {any} flags - The flags param.
   * @return {any} - The return value.
   */
  toJSON(context, flags) {
    const j = super.toJSON(context, flags);
    return j
  }

  /**
   * The toJSON method.
   * @param {any} j - The j param.
   * @param {any} context - The context param.
   * @param {any} onDone - The onDone param.
   */
  fromJSON(j, context, onDone) {
    const loadAssetJSON = () => {
      const flags =
        zeaEngine.TreeItem.LoadFlags.LOAD_FLAG_LOADING_BIN_TREE_VALUES;
      super.fromJSON(j, context, flags, onDone);
      context.decAsyncCount();

      // If the asset is nested within a bigger asset, then
      // this subtree can noow be flagged as loded(and added to the renderer);
      if (!this.loaded.isToggled()) this.loaded.emit();
    };

    if (j.params && j.params.DataFilePath) {
      this.__datafileLoaded = loadAssetJSON;
      context.incAsyncCount();
      const filePathJSON = j.params.DataFilePath;
      delete j.params.DataFilePath;
      this.__datafileParam.fromJSON(filePathJSON, context);
    } else {
      loadAssetJSON();
    }
  }

  // ////////////////////////////////////////////////////
  // Debugging

  /**
   * The generatePolygonMeshSurfaces method.
   * @param {number} lod - The lod param.
   * @return {any} - The return value.
   * @private
   */
  generatePolygonMeshSurfaces(lod = 0) {
    // Traverse the tree adding items till we hit the leaves(which are usually GeomItems.)
    // let count = 0
    const surfacesTreeItem = new zeaEngine.TreeItem('surfaces');
    const traverse = treeItem => {
      treeItem.getChildren().forEach(childItem => {
        if (childItem instanceof CADBody) {
          const cadBodySurfaces = childItem.generatePolygonMeshSurfaces(lod);
          cadBodySurfaces.setGlobalXfo(childItem.getGlobalXfo());
          surfacesTreeItem.addChild(cadBodySurfaces);
        } else traverse(childItem);
      });
    };
    traverse(this);

    surfaceLibrary.logFormfactors();
    return surfacesTreeItem
  }

  /**
   * The generateHullGeometry method.
   * @return {any} - The return value.
   * @private
   */
  generateHullGeometry() {
    // Traverse the tree adding items till we hit the leaves(which are usually GeomItems.)
    // let count = 0
    const hullTreeItem = new zeaEngine.TreeItem('hull');
    const traverse = treeItem => {
      treeItem.getChildren().forEach(childItem => {
        if (childItem instanceof CADBody) {
          const cadBodyHulls = childItem.generateHullGeometry();
          cadBodyHulls.setGlobalXfo(childItem.getGlobalXfo());
          hullTreeItem.addChild(cadBodyHulls);
        } else traverse(childItem);
      });
    };
    traverse(this);

    surfaceLibrary.logFormfactors();
    return hullTreeItem
  }

  // ////////////////////////////////////////
  // Static Methods

  /**
   * Getter for LOADSTATE.
   * @return {any} - The return value.
   * @private
   */
  static get LOADSTATE() {
    return LOADSTATE
  }

  /**
   * The supportsExt method.
   * @param {any} filename - The filename param.
   * @return {any} - The return value.
   * @private
   */
  static supportsExt(filename) {
    return cadFileExts.test(filename)
  }
}

zeaEngine.sgFactory.registerClass('CADAsset', CADAsset);

/** Class representing a CAD assembly.
 * @extends TreeItem
 */
class CADAssembly extends zeaEngine.TreeItem {
  /**
   * Create a CAD assembly.
   * @param {any} name - The name value.
   */
  constructor(name) {
    super(name);
  }

  /**
   * The clone method.
   * @param {any} flags - The flags param.
   * @return {any} - The return value.
   */
  clone(flags) {
    const cloned = new CADAssembly();
    cloned.copyFrom(this, flags);
    return cloned
  }

  // ////////////////////////////////////////
  // Persistence

  /**
   * The toJSON method.
   * @param {any} context - The context param.
   * @param {any} flags - The flags param.
   * @return {any} - The return value.
   */
  toJSON(context, flags = 0) {
    const j = super.toJSON(context, flags);
    return j
  }

  /**
   * The toJSON method.
   * @param {any} j - The j param.
   * @param {any} context - The context param.
   * @param {any} flags - The flags param.
   */
  fromJSON(j, context, flags = 0) {
    super.fromJSON(j, context, flags);
  }
}

zeaEngine.sgFactory.registerClass('CADAssembly', CADAssembly);

/** This class abstracts the rendering of a collection of geometries to screen.
 * @extends Lines
 * @ignore
 */
class SurfaceNormals extends zeaEngine.Lines {
  /**
   * Create surface normals.
   * @param {number} u - The u value.
   * @param {number} v - The v value.
   */
  constructor(u, v) {
    super();
    this.setNumSegments(u * v);
    this.setNumVertices(u * v * 2);
    for (let i = 0; i < v; i++) {
      const y = i / (v - 1) - 0.5;
      for (let j = 0; j < u; j++) {
        const x = j / (u - 1) - 0.5;
        const id = i * u + j;
        this.getVertex(id * 2).set(x, y, 0.0);
        this.getVertex(id * 2 + 1).set(x, y, 1.0);
        this.setSegment(id, id * 2, id * 2 + 1);
      }
    }
  }
}

/** Class representing a fan.
 * @extends Mesh
 * @ignore
 */
class Fan extends zeaEngine.Mesh {
  /**
   * Create a fan.
   * @param {any} vertexCount - The vertexCount value.
   */
  constructor(vertexCount) {
    super();
    this.setNumVertices(vertexCount);
    const faceCount = vertexCount - 2;
    this.setFaceCounts([faceCount]);

    // ////////////////////////////
    // build the topology
    for (let j = 0; j < faceCount; j++) {
      this.setFaceVertexIndices(j, 0, j + 1, j + 2);
    }
    for (let i = 0; i < vertexCount; i++) {
      // Note: the 'x,y' values are used as uv coords
      // to look up the actual vertex values in the texture.
      // (with a 0.5, 0.5 offset)
      this.getVertex(i).set(i / vertexCount - 0.5, -0.5, 0.0);
    }
  }
}

/** Class representing a sub set.
 * @ignore
 */
class SubSet {
  /**
   * Create a sub set.
   * @param {any} gl - The gl value.
   */
  constructor(gl) {
    this.__gl = gl;
    this.__drawCoordsArray = null;
    this.__drawCoordsBuffer = null;
    this.__drawCount = 0; // The number of visible drawn geoms.
  }

  /**
   * The setDrawItems method.
   * @param {any} itemsArray - The itemsArray param.
   */
  setDrawItems(itemsArray) {
    if (this.__drawCoordsBuffer) {
      this.__gl.deleteBuffer(this.__drawCoordsBuffer);
      this.__drawCoordsBuffer = null;
    }
    const gl = this.__gl;
    this.__drawCoordsBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, this.__drawCoordsBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, itemsArray, gl.STATIC_DRAW);
    this.__drawCount = itemsArray.length / 2;
  }

  /**
   * The addDrawItems method.
   * @param {any} itemsArray - The itemsArray param.
   */
  addDrawItems(itemsArray) {
    // console.log("addDrawItems:" + itemsArray);
    if (!this.__drawCoordsArray) {
      this.__drawCoordsArray = itemsArray;
    } else {
      const new_Array = new Float32Array(
        this.__drawCoordsArray.length + itemsArray.length
      );
      new_Array.set(this.__drawCoordsArray);
      new_Array.set(itemsArray, this.__drawCoordsArray.length);
      this.__drawCoordsArray = new_Array;
    }

    if (this.__drawCoordsBuffer) {
      this.__gl.deleteBuffer(this.__drawCoordsBuffer);
      this.__drawCoordsBuffer = null;
    }

    const gl = this.__gl;
    this.__drawCoordsBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, this.__drawCoordsBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, this.__drawCoordsArray, gl.STATIC_DRAW);

    this.__drawCount += itemsArray.length / 2;
  }

  /**
   * The getDrawCount method.
   * @return {any} - The return value.
   */
  getDrawCount() {
    return this.__drawCount
  }

  // ////////////////////////////////////
  // Drawing

  /**
   * The bind method.
   * @param {any} renderstate - The renderstate param.
   * @return {any} - The return value.
   */
  bind(renderstate) {
    if (this.__drawCount == 0) {
      return 0
    }

    const gl = this.__gl;

    // The instanced transform ids are bound as an instanced attribute.
    const location = renderstate.attrs.drawCoords.location;
    gl.enableVertexAttribArray(location);
    gl.bindBuffer(gl.ARRAY_BUFFER, this.__drawCoordsBuffer);
    gl.vertexAttribPointer(location, 2, gl.FLOAT, false, 2 * 4, 0);
    gl.vertexAttribDivisor(location, 1); // This makes it instanced

    return this.__drawCount
  }

  destroy() {
    const gl = this.__gl;
    gl.deleteBuffer(this.__drawCoordsBuffer);
    this.__drawCoordsBuffer = null;
  }
}

const __cache = {};

/** Class representing a GL surface draw set. 
 * @ignore
*/
class GLSurfaceDrawSet {
  /**
   * Create a GL surface draw set.
   * @param {any} gl - The gl value.
   * @param {number} x - The x value.
   * @param {number} y - The y value.
   */
  constructor(gl, x, y) {
    // console.log("GLSurfaceDrawSet:" + x + "," + y)
    this.__gl = gl;

    if (x == 0 || y == 0)
      console.error('invalid GLSurfaceDrawSet:' + x + ',' + y);

    if (y == 1) {
      const key = x;
      if (!__cache[key]) {
        __cache[key] = new zeaEngine.GLMesh(gl, new Fan(x));
      }
      this.__glgeom = __cache[key];
      this.__numTris = x - 2;
      this.__glnormalsgeom = new zeaEngine.GLLines(gl, new SurfaceNormals(x, y));
    } else {
      const key = x + 'x' + y;
      if (!__cache[key]) {
        __cache[key] = new zeaEngine.GLMesh(
          gl,
          new zeaEngine.Plane(1.0, 1.0, x - 1, y - 1)
        );
      }
      this.__glgeom = __cache[key];
      this.__numTris = (x - 1) * (y - 1) * 2;
      this.__glnormalsgeom = new zeaEngine.GLLines(gl, new SurfaceNormals(x, y));
    }
    this.__quadDetail = [x - 1, y - 1];
    this.__freeIndices = [];
    this.__subSets = {};
  }

  /**
   * The setDrawItems method.
   * @param {any} itemsArray - The itemsArray param.
   * @param {any} key - The key param.
   * @return {any} - The return value.
   */
  setDrawItems(itemsArray, key) {
    if (!this.__subSets[key]) {
      this.__subSets[key] = new SubSet(this.__gl);
    }
    this.__subSets[key].setDrawItems(itemsArray);

    return this.__numTris * (itemsArray.length / 2)
  }

  /**
   * The addDrawItems method.
   * @param {any} itemsArray - The itemsArray param.
   * @param {any} key - The key param.
   * @return {any} - The return value.
   */
  addDrawItems(itemsArray, key) {
    if (!this.__subSets[key]) {
      this.__subSets[key] = new SubSet(this.__gl);
    }
    this.__subSets[key].addDrawItems(itemsArray);

    return this.__numTris * (itemsArray.length / 2)
  }

  /**
   * The getDrawCount method.
   * @param {any} key - The key param.
   * @return {number} - The return value.
   */
  getDrawCount(key) {
    if (this.__subSets[key]) return this.__subSets[key].getDrawCount()
    return 0
  }

  // ////////////////////////////////////
  // Drawing

  /**
   * The draw method.
   * @param {any} renderstate - The renderstate param.
   * @param {any} key - The key param.
   */
  draw(renderstate, key) {
    const subSet = this.__subSets[key];
    if (!subSet) return

    const gl = this.__gl;
    const unifs = renderstate.unifs;

    if (unifs.quadDetail) {
      gl.uniform2fv(unifs.quadDetail.location, this.__quadDetail);
    }

    this.__glgeom.bind(renderstate);

    const drawCount = subSet.bind(renderstate);

    renderstate.bindViewports(renderstate.unifs, () => {
      this.__glgeom.drawInstanced(drawCount);

      // To debug the mesh topology we can render as lines instead.
      // gl.drawElementsInstanced(
      //   this.__glgeom.__gl.LINES,
      //   this.__glgeom.__numTriIndices,
      //   this.__glgeom.__indexDataType,
      //   0,
      //   drawCount
      // )
    });
  }

  /**
   * The drawNormals method.
   * @param {any} renderstate - The renderstate param.
   * @param {any} key - The key param.
   */
  drawNormals(renderstate, key) {
    if(!this.__glnormalsgeom)
      return;
    const subSet = this.__subSets[key];
    if (!subSet) return
    const gl = this.__gl;
    const unifs = renderstate.unifs;

    if (unifs.quadDetail)
      gl.uniform2fv(unifs.quadDetail.location, this.__quadDetail);

    this.__glnormalsgeom.bind(renderstate);

    const drawCount = subSet.bind(renderstate);

    this.__glnormalsgeom.drawInstanced(drawCount);
  }

  destroy() {
    // Note:  this.__glgeom is shared between all GLCADAssets using a global cache. See above
    // this.__glgeom.destroy()
    
    if(this.__glnormalsgeom)
      this.__glnormalsgeom.destroy();
    
    for (const key in this.__subSets) {
      let subSet = this.__subSets[key];
      subSet.destroy();
    }
  }
}

/** Class representing a GL curve library. 
 * @ignore
*/
class GLCurveLibrary {
  /**
   * Create a GL curve library.
   * @param {any} gl - The gl value.
   * @param {any} cadpassdata - The cadpassdata value.
   * @param {any} surfacesLibrary - The surfacesLibrary value.
   */
  constructor(gl, cadpassdata, surfacesLibrary, version) {
    this.__gl = gl;
    this.__cadpassdata = cadpassdata;
    this.__surfacesLibrary = surfacesLibrary;
    this.cadDataVersion = version;

    const curvesDataBuffer = this.__surfacesLibrary.getCurveBuffer();
    const curveTexSize = Math.sqrt(curvesDataBuffer.byteLength / 8);

    if (this.__cadpassdata.convertTo8BitTextures) {
      this.__curveDataTexture = new zeaEngine.GLTexture2D(gl, {
        format: 'RGBA',
        type: 'UNSIGNED_BYTE',
        width: curveTexSize * 2,
        height: curveTexSize,
        filter: 'NEAREST',
        wrap: 'CLAMP_TO_EDGE',
        mipMapped: false,
        data: new Uint8Array(curvesDataBuffer),
      });
    } else {
      this.__curveDataTexture = new zeaEngine.GLTexture2D(gl, {
        format: 'RGBA',
        type: 'HALF_FLOAT',
        width: curveTexSize,
        height: curveTexSize,
        filter: 'NEAREST',
        wrap: 'CLAMP_TO_EDGE',
        mipMapped: false,
        data: new Uint16Array(curvesDataBuffer),
      });
    }

    this.__bindAttr = (
      location,
      channels,
      type,
      stride,
      offset,
      instanced = true
    ) => {
      gl.enableVertexAttribArray(location);
      gl.vertexAttribPointer(
        location,
        channels,
        gl.FLOAT,
        false,
        stride,
        offset
      );
      if (instanced) gl.vertexAttribDivisor(location, 1); // This makes it instanced
    };
  }

  // /////////////////////////////////////////////////////////////
  // Curves

  /**
   * The evaluateCurves method.
   * @param {any} curvesAtlasLayout - The curvesAtlasLayout param.
   * @param {any} numCurves - The numCurves param.
   * @param {any} curveAtlasLayoutTextureSize - The curveAtlasLayoutTextureSize param.
   * @param {any} curvesAtlasTextureDim - The curvesAtlasTextureDim param.
   */
  evaluateCurves(
    curvesAtlasLayout,
    numCurves,
    curveAtlasLayoutTextureSize,
    curvesAtlasTextureDim
  ) {
    // console.log("evaluateCurves:" + assetId + ":" + curvesAtlasTextureDim);

    const count = numCurves;
    if (count == 0) return

    const gl = this.__gl;
    {
      this.__curveAtlasLayoutTexture = new zeaEngine.GLTexture2D(this.__gl, {
        format: 'RGBA',
        type: 'FLOAT',
        width: curveAtlasLayoutTextureSize[0],
        height: curveAtlasLayoutTextureSize[1],
        filter: 'NEAREST',
        wrap: 'CLAMP_TO_EDGE',
        mipMapped: false,
        data: curvesAtlasLayout,
      });
    }

    if (!this.__curvesAtlasRenderTarget) {
      this.__curvesAtlasRenderTarget = new zeaEngine.GLRenderTarget(gl, {
        format: 'RGBA',
        type: 'FLOAT',
        width: curvesAtlasTextureDim[0],
        height: curvesAtlasTextureDim[1],
        filter: 'NEAREST',
        wrap: 'CLAMP_TO_EDGE',
        mipMapped: false,
      });
      this.__curvesTangentAtlasRenderTarget = new zeaEngine.GLRenderTarget(gl, {
        format: 'RGBA',
        type: 'FLOAT',
        width: curvesAtlasTextureDim[0],
        height: curvesAtlasTextureDim[1],
        filter: 'NEAREST',
        wrap: 'CLAMP_TO_EDGE',
        mipMapped: false,
      });
    } else if (
      this.__curvesAtlasRenderTarget.width != curvesAtlasTextureDim[0] ||
      this.__curvesAtlasRenderTarget.height != curvesAtlasTextureDim[1]
    ) {
      // Copy the previous image into a new one, and then destroy the prvious.
      this.__curvesAtlasRenderTarget.resize(
        curvesAtlasTextureDim[0],
        curvesAtlasTextureDim[1],
        true
      );
    }

    const renderstate = {};
    this.__curvesAtlasRenderTarget.bindForWriting(renderstate, true);

    if (this.cadDataVersion.greaterThan([0, 0, 0])) {
      renderstate.shaderopts = Object.assign({}, gl.shaderopts);
      renderstate.shaderopts.defines =
        renderstate.shaderopts.defines + '#define EXPORT_KNOTS_AS_DELTAS 1';
    }
    if (this.cadDataVersion.greaterThan([0, 0, 26])) {
      renderstate.shaderopts.defines =
        renderstate.shaderopts.defines + '#define INTS_PACKED_AS_2FLOAT16 1';
    }
    if (this.__cadpassdata.convertTo8BitTextures) {
      renderstate.shaderopts = Object.assign({}, gl.shaderopts);
      renderstate.shaderopts.frag = Object.assign({}, gl.shaderopts.frag);
      renderstate.shaderopts.frag.defines =
        '#define DECODE_16BIT_FLOAT_FROM_8BIT_INT 1\n';
    }

    this.__cadpassdata.evaluateCurveShader.bind(renderstate);
    this.__cadpassdata.glplanegeom.bind(renderstate);

    const unifs = renderstate.unifs;
    const attrs = renderstate.attrs;

    gl.uniform2i(
      unifs.curvesAtlasTextureSize.location,
      this.__curvesAtlasRenderTarget.width,
      this.__curvesAtlasRenderTarget.height
    );

    this.__curveDataTexture.bindToUniform(renderstate, unifs.curveDataTexture);
    gl.uniform2i(
      unifs.curveDataTextureSize.location,
      this.__curveDataTexture.width,
      this.__curveDataTexture.height
    );

    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, curvesAtlasLayout, gl.STATIC_DRAW);

    this.__bindAttr(
      attrs.patchCoords.location,
      4,
      gl.FLOAT,
      valuesPerCurveLibraryLayoutItem * 4,
      0
    );
    this.__bindAttr(
      attrs.curveDataCoords.location,
      2,
      gl.FLOAT,
      valuesPerCurveLibraryLayoutItem * 4,
      4 * 4
    );

    // //////////////////////////////////////////////
    // Bind each Fbo and render separately.
    // Bizzarly, this has turned out to be much faster
    // than using mutiple render targets...
    gl.uniform1i(unifs.writeTangents.location, 0);

    this.__cadpassdata.glplanegeom.drawInstanced(count);

    this.__curvesTangentAtlasRenderTarget.bindForWriting(renderstate, true);

    gl.uniform1i(unifs.writeTangents.location, 1);
    this.__cadpassdata.glplanegeom.drawInstanced(count);
    // //////////////////////////////////////////////

    gl.deleteBuffer(buffer);
    // console.log("----------------------------------");
    // logCurveData(35799)
    // logCurveData(0);
    // console.log("----------------------------------");

    this.__curvesTangentAtlasRenderTarget.unbind();
    gl.finish();
  }

  /**
   * The bindCurvesAtlas method.
   * @param {any} renderstate - The renderstate param.
   */
  bindCurvesAtlas(renderstate) {
    const gl = this.__gl;
    const unifs = renderstate.unifs;
    if (this.__curvesAtlasRenderTarget) {
      this.__curvesAtlasRenderTarget.bindColorTexture(
        renderstate,
        unifs.curvesAtlasTexture
      );
      
      if (unifs.curveTangentsTexture) {
        this.__curvesTangentAtlasRenderTarget.bindColorTexture(
          renderstate,
          unifs.curveTangentsTexture
        );
      }
      if (unifs.curvesAtlasTextureSize) {
        gl.uniform2i(
          unifs.curvesAtlasTextureSize.location,
          this.__curvesAtlasRenderTarget.width,
          this.__curvesAtlasRenderTarget.height
        );
      }

      if (unifs.curveAtlasLayoutTexture) {
        this.__curveAtlasLayoutTexture.bindToUniform(
          renderstate,
          unifs.curveAtlasLayoutTexture
        );
        gl.uniform2i(
          unifs.curveAtlasLayoutTextureSize.location,
          this.__curveAtlasLayoutTexture.width,
          this.__curveAtlasLayoutTexture.height
        );
      }
    }
  }

  /**
   * The destroy method.
   */
  destroy() {
    this.__curveDataTexture.destroy();
    this.__curveAtlasLayoutTexture.destroy();
    this.__curvesAtlasRenderTarget.destroy();
    this.__curvesTangentAtlasRenderTarget.destroy();
  }
}

// import {
//     Vec2,
//     Vec3,
//     Quat,
//     Color,
//     Box2,
//     Box3
// } from '../Math';

const decode16BitFloat = h => {
  const s = (h & 0x8000) >> 15;
  const e = (h & 0x7c00) >> 10;
  const f = h & 0x03ff;

  if (e == 0) {
    return (s ? -1 : 1) * Math.pow(2, -14) * (f / Math.pow(2, 10))
  } else if (e == 0x1f) {
    return f ? NaN : (s ? -1 : 1) * Infinity
  }

  return (s ? -1 : 1) * Math.pow(2, e - 15) * (1 + f / Math.pow(2, 10))
};

/** Class representing a bin reader. 
 * @ignore
*/
class BinReader {
  /**
   * Create a bin reader.
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
   * Getter for isMobileDevice.
   * @return {Boolean} - Returns true is a mobile device is detected.
   */
  get isMobileDevice() {
    return this.__isMobileDevice
  }

  /**
   * Getter for data.
   * @return {Buffer} - The data buffer we are reading from,
   */
  get data() {
    return this.__data
  }

  /**
   * Getter for byteLength.
   * @return {number} - The total length of the buffer
   */
  get byteLength() {
    return this.__dataView.byteLength
  }

  /**
   * Getter for remainingByteLength.
   * @return {number} - The reemaining length of the buffer to read.
   */
  get remainingByteLength() {
    return this.__dataView.byteLength - this.__byteOffset
  }

  /**
   * The pos method.
   * @return {number} - The current offset in the binary buffer
   */
  pos() {
    return this.__byteOffset
  }

  /**
   * The seek method.
   * @param {number} byteOffset - The byteOffset param.
   */
  seek(byteOffset) {
    this.__byteOffset = byteOffset;
  }

  /**
   * The advance method.
   * @param {number} byteOffset - The byte Offset amount.
   */
  advance(byteOffset) {
    this.__byteOffset += byteOffset;
  }

  /**
   * The loadUInt8 method.
   * @return {number} - The return value.
   */
  loadUInt8() {
    const result = this.__dataView.getUint8(this.__byteOffset);
    this.__byteOffset += 1;
    return result
  }

  /**
   * The loadUInt16 method.
   * @return {number} - The return value.
   */
  loadUInt16() {
    const result = this.__dataView.getUint16(this.__byteOffset, true);
    this.__byteOffset += 2;
    return result
  }


  /**
   * The loadUInt32 method.
   * @return {number} - The return value.
   */
  loadUInt32() {
    const result = this.__dataView.getUint32(this.__byteOffset, true);
    this.__byteOffset += 4;
    return result
  }

  /**
   * The loadSInt32 method.
   * @return {number} - The return value.
   */
  loadSInt32() {
    const result = this.__dataView.getInt32(this.__byteOffset, true);
    this.__byteOffset += 4;
    return result
  }

  /**
   * The loadFloat16 method.
   * @return {number} - The return value.
   */
  loadFloat16() {
    const uint16 = this.loadUInt16();
    return decode16BitFloat(uint16)
  }

  /**
   * The loadUFloat16 returns a float where the sign big indicates it is > 201.
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
   * The loadFloat16From2xUInt8 method.
   * @return {number} - The return value.
   */
  loadFloat16From2xUInt8() {
    const result = this.__dataView.getFloat16(this.__byteOffset, true);
    // const uint8s = this.loadUInt8Array(2);
    // return decode16BitFloat(uint8s);
    this.__byteOffset += 2;
    return result
  }

  /**
   * The loadUInt32From2xUFloat16 loads a single Signed integer value from 2 Unsigned Float16 values.
   * @return {number} - The return value.
   */
  loadUInt32From2xUFloat16() {
    const partA = this.loadUFloat16();
    const partB = this.loadUFloat16();
    return partA + partB * 4096
  }

  /**
   * The loadSInt32From2xFloat16 loads a single Signed integer value from 2 signed Float16 values.
   * @return {number} - The return value.
   */
  loadSInt32From2xFloat16() {
    const partA = this.loadFloat16();
    const partB = this.loadFloat16();
    return partA + partB * 2048
  }


  /**
   * The loadFloat32 method.
   * @return {any} - The return value.
   */
  loadFloat32() {
    const result = this.__dataView.getFloat32(this.__byteOffset, true);
    this.__byteOffset += 4;
    return result
  }

  /**
   * The loadFloat32 method.
   * @param {any} size - The size param.
   * @param {boolean} clone - The clone param.
   * @return {any} - The return value.
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
   * The loadUInt16Array method.
   * @param {any} size - The size param.
   * @param {boolean} clone - The clone param.
   * @return {any} - The return value.
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
   * The loadUInt32Array method.
   * @param {any} size - The size param.
   * @param {boolean} clone - The clone param.
   * @return {any} - The return value.
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
   * The loadFloat32Array method.
   * @param {any} size - The size param.
   * @param {boolean} clone - The clone param.
   * @return {any} - The return value.
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
   * The loadStr method.
   * @return {string} - The return value.
   */
  loadStr() {
    const numChars = this.loadUInt32();
    const chars = new Uint8Array(this.__data, this.__byteOffset, numChars);
    this.__byteOffset += numChars;
    let result = '';
    for (let i = 0; i < numChars; i++)
      result = result + String.fromCharCode(chars[i]);
    return result
  }

  /**
    * The loadStrArray method.
    * @return {array} - The return value.
    */
   loadStrArray() {
    const size = this.loadUInt32();
    const result = [];
    for (let i = 0; i < size; i++) {
      result[i] = this.loadStr();
    }
    return result
  }

  // loadSInt32Vec2() {
  //     const x = this.loadSInt32();
  //     const y = this.loadSInt32();
  //     return new Vec2(x, y);
  // }

  // loadUInt32Vec2() {
  //     const x = this.loadUInt32();
  //     const y = this.loadUInt32();
  //     return new Vec2(x, y);
  // }

  // loadFloat16Vec2() {
  //     const x = this.loadFloat16();
  //     const y = this.loadFloat16();
  //     return new Vec2(x, y);
  // }

  // loadFloat32Vec2() {
  //     const x = this.loadFloat32();
  //     const y = this.loadFloat32();
  //     return new Vec2(x, y);
  // }

  // loadFloat16Vec3() {
  //     const x = this.loadFloat16();
  //     const y = this.loadFloat16();
  //     const z = this.loadFloat16();
  //     return new Vec3(x, y, z);
  // }

  // loadFloat32Vec3() {
  //     const x = this.loadFloat32();
  //     const y = this.loadFloat32();
  //     const z = this.loadFloat32();
  //     return new Vec3(x, y, z);
  // }

  // loadFloat16Quat() {
  //     const x = this.loadFloat16();
  //     const y = this.loadFloat16();
  //     const z = this.loadFloat16();
  //     const w = this.loadFloat16();
  //     return new Quat(x, y, z, w);
  // }

  // loadFloat32Quat() {
  //     const x = this.loadFloat32();
  //     const y = this.loadFloat32();
  //     const z = this.loadFloat32();
  //     const w = this.loadFloat32();
  //     return new Quat(x, y, z, w);
  // }

  // loadRGBFloat32Color() {
  //     const r = this.loadFloat32();
  //     const g = this.loadFloat32();
  //     const b = this.loadFloat32();
  //     return new Color(r, g, b);
  // }

  // loadRGBAFloat32Color() {
  //     const r = this.loadFloat32();
  //     const g = this.loadFloat32();
  //     const b = this.loadFloat32();
  //     const a = this.loadFloat32();
  //     return new Color(r, g, b, a);
  // }

  // loadRGBUInt8Color() {
  //     const r = this.loadUInt8();
  //     const g = this.loadUInt8();
  //     const b = this.loadUInt8();
  //     return new Color(r / 255, g / 255, b / 255);
  // }

  // loadRGBAUInt8Color() {
  //     const r = this.loadUInt8();
  //     const g = this.loadUInt8();
  //     const b = this.loadUInt8();
  //     const a = this.loadUInt8();
  //     return new Color(r / 255, g / 255, b / 255, a / 255);
  // }

  // loadBox2() {
  //     return new Box2(this.loadFloat32Vec2(), this.loadFloat32Vec2());
  // }

  // loadBox3() {
  //     return new Box3(this.loadFloat32Vec3(), this.loadFloat32Vec3());
  // }

  /**
   * The loadStr method.
   * @param {any} stride - The stride param.
   */
  readPadd(stride) {
    const padd = this.__byteOffset % stride;
    if (padd != 0) this.__byteOffset += stride - padd;
  }
}

/** Class representing a GL surface library.
 * @ignore
 */
class GLSurfaceLibrary {
  /**
   * Create a GL surface library.
   * @param {any} gl - The gl value.
   * @param {any} cadpassdata - The cadpassdata value.
   * @param {any} surfacesLibrary - The surfacesLibrary value.
   * @param {any} glCurveLibrary - The glCurveLibrary value.
   */
  constructor(gl, cadpassdata, surfacesLibrary, glCurveLibrary, version) {
    this.__gl = gl;
    this.__cadpassdata = cadpassdata;
    this.__surfacesLibrary = surfacesLibrary;
    this.__glCurveLibrary = glCurveLibrary;
    this.cadDataVersion = version;

    const surfacesDataBuffer = this.__surfacesLibrary.getSurfaceBuffer();
    const surfaceTexSize = Math.sqrt(surfacesDataBuffer.byteLength / 8);

    if (this.__cadpassdata.convertTo8BitTextures) {
      this.__surfaceDataTexture = new zeaEngine.GLTexture2D(gl, {
        format: 'RGBA',
        type: 'UNSIGNED_BYTE',
        width: surfaceTexSize * 2,
        height: surfaceTexSize,
        filter: 'NEAREST',
        wrap: 'CLAMP_TO_EDGE',
        mipMapped: false,
        data: new Uint8Array(surfacesDataBuffer),
      });
    } else {
      this.__surfaceDataTexture = new zeaEngine.GLTexture2D(gl, {
        format: 'RGBA',
        type: 'HALF_FLOAT',
        width: surfaceTexSize,
        height: surfaceTexSize,
        filter: 'NEAREST',
        wrap: 'CLAMP_TO_EDGE',
        mipMapped: false,
        data: new Uint16Array(surfacesDataBuffer),
      });
    }

    this.__bindAttr = (
      location,
      channels,
      type,
      stride,
      offset,
      instanced = true
    ) => {
      gl.enableVertexAttribArray(location);
      gl.vertexAttribPointer(
        location,
        channels,
        gl.FLOAT,
        false,
        stride,
        offset
      );
      if (instanced) gl.vertexAttribDivisor(location, 1); // This makes it instanced
    };

    this.__surfaceDrawSets = {};

    // /////////////////////////////////////////////
    // Precompile shaders.
    const shaderopts = Object.assign({}, this.__gl.shaderopts);

    if (this.cadDataVersion.greaterOrEqualThan([0,0,6])) {
      shaderopts.defines =
        shaderopts.defines + '#define EXPORT_KNOTS_AS_DELTAS 1\n';
    }
    if (this.cadDataVersion.greaterThan([0, 0, 26])) {
      shaderopts.defines =
        shaderopts.defines + '#define INTS_PACKED_AS_2FLOAT16 1';
    }
    if (this.__cadpassdata.convertTo8BitTextures) {
      shaderopts.frag = {
        defines: '#define DECODE_16BIT_FLOAT_FROM_8BIT_INT 1\n',
      };
    }

    this.__cadpassdata.evaluateSurfaceShaders.forEach(shader => {
      shader.compileForTarget(undefined, shaderopts);
    });
  }

  // /////////////////////////////////////////////////////////////
  // Surfaces

  /**
   * The drawSurfaceData method.
   * @return {boolean} - The return value.
   */
  drawSurfaceData() {
    const renderstate = {};
    if (
      !this.__surfaceDataTexture ||
      !this.__cadpassdata.debugTrimSetsShader.bind(renderstate)
    )
      return false
    // this.bindTrimSetAtlas(renderstate);

    this.__surfaceDataTexture.bindToUniform(
      renderstate,
      renderstate.unifs.trimSetAtlasTexture
    );
    this.__cadpassdata.glplanegeom.bind(renderstate);
    this.__cadpassdata.glplanegeom.draw();
  }

  /**
   * The evaluateSurfaces method.
   * @param {any} surfacesEvalAttrs - The surfacesEvalAttrs param.
   * @param {any} surfacesAtlasLayout - The surfacesAtlasLayout param.
   * @param {any} surfaceAtlasLayoutTextureSize - The surfaceAtlasLayoutTextureSize param.
   * @param {any} surfacesAtlasTextureDim - The surfacesAtlasTextureDim param.
   * @return {any} - The return value.
   */
  evaluateSurfaces(
    surfacesEvalAttrs,
    surfacesAtlasLayout,
    surfaceAtlasLayoutTextureSize,
    surfacesAtlasTextureDim
  ) {
    // console.log("evaluateSurfaces");
    const t0 = performance.now();

    const totalSurfaceCount =
      surfacesAtlasLayout.length / valuesPerSurfaceLibraryLayoutItem;
    if (totalSurfaceCount == 0) return
    const gl = this.__gl;

    {
      this.__surfaceAtlasLayoutTexture = new zeaEngine.GLTexture2D(gl, {
        format: 'RGBA',
        type: 'FLOAT',
        width: surfaceAtlasLayoutTextureSize[0],
        height: surfaceAtlasLayoutTextureSize[1],
        filter: 'NEAREST',
        wrap: 'CLAMP_TO_EDGE',
        mipMapped: false,
        data: surfacesAtlasLayout,
      });
    }

    if (!this.__surfacesAtlasTexture) {
      this.__surfacesAtlasTexture = new zeaEngine.GLTexture2D(gl, {
        format: 'RGBA',
        type: 'FLOAT',
        width: surfacesAtlasTextureDim[0],
        height: surfacesAtlasTextureDim[1],
        filter: 'NEAREST',
        wrap: 'CLAMP_TO_EDGE',
        mipMapped: false,
      });
      this.__surfacesFbo = new zeaEngine.GLFbo(gl, this.__surfacesAtlasTexture);
      this.__surfacesFbo.setClearColor([0, 0, 0, 0]);
      this.__surfacesFbo.bindAndClear();

      this.__normalsTexture = new zeaEngine.GLTexture2D(gl, {
        format: 'RGBA',
        type: 'FLOAT',
        width: surfacesAtlasTextureDim[0],
        height: surfacesAtlasTextureDim[1],
        filter: 'NEAREST',
        wrap: 'CLAMP_TO_EDGE',
        mipMapped: false,
      });
      this.__normalsFbo = new zeaEngine.GLFbo(gl, this.__normalsTexture);
      this.__normalsFbo.setClearColor([0, 0, 0, 0]);
      this.__normalsFbo.bindAndClear();
    } else if (
      this.__surfacesAtlasTexture.width != surfacesAtlasTextureDim[0] ||
      this.__surfacesAtlasTexture.height != surfacesAtlasTextureDim[1]
    ) {
      // Copy the previous image into a new one, and then destroy the prvious.
      this.__surfacesAtlasTexture.resize(
        surfacesAtlasTextureDim[0],
        surfacesAtlasTextureDim[1],
        true
      );
      this.__surfacesFbo.resize(); // hack to rebind the texture. Refactor the way textures are resized.
    }

    const renderstate = {};

    surfacesEvalAttrs.forEach((attr, category) => {
      this.__cadpassdata.evaluateSurfaceShaders[category].bind(renderstate);
      this.__cadpassdata.glplanegeom.bind(renderstate);

      const unifs = renderstate.unifs;
      const attrs = renderstate.attrs;

      this.__surfaceAtlasLayoutTexture.bindToUniform(
        renderstate,
        unifs.surfaceAtlasLayoutTexture
      );
      gl.uniform2i(
        unifs.surfaceAtlasLayoutTextureSize.location,
        this.__surfaceAtlasLayoutTexture.width,
        this.__surfaceAtlasLayoutTexture.height
      );

      gl.uniform2i(
        unifs.surfacesAtlasTextureSize.location,
        this.__surfacesAtlasTexture.width,
        this.__surfacesAtlasTexture.height
      );

      this.__surfaceDataTexture.bindToUniform(
        renderstate,
        unifs.surfaceDataTexture
      );
      gl.uniform2i(
        unifs.surfaceDataTextureSize.location,
        this.__surfaceDataTexture.width,
        this.__surfaceDataTexture.height
      );

      // For the linear and radial loft.
      if (unifs.curveTangentsTexture)
        this.__glCurveLibrary.bindCurvesAtlas(renderstate);

      const buffer = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
      gl.bufferData(gl.ARRAY_BUFFER, attr, gl.STATIC_DRAW);

      this.__bindAttr(attrs.surfaceId.location, 1, gl.FLOAT, 4, 0);

      // //////////////////////////////////////////////
      // Bind each Fbo and render separately.
      // Bizzarly, this has turned out to be much faster
      // than using mutiple render targets...
      this.__surfacesFbo.bind();
      gl.uniform1i(unifs.writeNormals.location, 0);
      this.__cadpassdata.glplanegeom.drawInstanced(attr.length);

      this.__normalsFbo.bind();
      gl.uniform1i(unifs.writeNormals.location, 1);
      this.__cadpassdata.glplanegeom.drawInstanced(attr.length);
      // //////////////////////////////////////////////

      gl.deleteBuffer(buffer);
    });
    this.__surfacesFbo.unbind();

    this.__surfacesAtlasLayout = surfacesAtlasLayout;
    // logSurfaceData(9628)
    // console.log("----------------------------------");

    const t = performance.now() - t0;
    // console.log("evaluateSurfaces - Done:", t);

    return t
  }

  /**
   * The logSurfaceData method.
   * @param {any} surfaceId - The surfaceId param.
   */
  logSurfaceData(surfaceId) {
    // const layout = [
    //   this.__surfacesAtlasLayout[(surfaceId * valuesPerSurfaceLibraryLayoutItem) + 0],
    //   this.__surfacesAtlasLayout[(surfaceId * valuesPerSurfaceLibraryLayoutItem) + 1],
    //   this.__surfacesAtlasLayout[(surfaceId * valuesPerSurfaceLibraryLayoutItem) + 2],
    //   this.__surfacesAtlasLayout[(surfaceId * valuesPerSurfaceLibraryLayoutItem) + 3]];

    // console.log("logGeomData " + surfaceId + ":[" + layout[0] +","+ layout[1] + "] detail :" + layout[2] +"x"+ layout[3]);

    const surfacesDataBuffer = this.__surfacesLibrary.getSurfaceBuffer();
    const surfacesDataReader = new BinReader(surfacesDataBuffer);
    surfacesDataReader.seek(
      8 +
      surfaceId * (8 /* num values per item*/ * 2) /* bpc*/ +
        2 /* addr*/ * 2 /* bpc*/
    );

    const detailU = surfacesDataReader.loadFloat16();
    const detailV = surfacesDataReader.loadFloat16();
    const sizeU = surfacesDataReader.loadFloat16();
    const sizeV = surfacesDataReader.loadFloat16();
    const trimSetIndex = surfacesDataReader.loadFloat16();
    console.log(
      'logGeomData ' +
        surfaceId +
        ' detailU:[' +
        detailU +
        ',' +
        detailV +
        '] sizeU [' +
        sizeU +
        ',' +
        sizeV +
        '] trimSetIndex:' +
        trimSetIndex
    );
  }

  /**
   * The drawSurfaceAtlas method.
   * @param {any} renderstate - The renderstate param.
   * @return {boolean} - The return value.
   */
  drawSurfaceAtlas(renderstate) {
    if (
      !this.__normalsTexture ||
      !this.__cadpassdata.debugTrimSetsShader.bind(renderstate)
    )
      return false
    // this.bindTrimSetAtlas(renderstate);

    this.__normalsTexture.bindToUniform(
      renderstate,
      renderstate.unifs.trimSetAtlasTexture
    );
    this.__cadpassdata.glplanegeom.bind(renderstate);
    this.__cadpassdata.glplanegeom.draw();
  }

  /**
   * The bindSurfacesData method.
   * @param {any} renderstate - The renderstate param.
   */
  bindSurfacesData(renderstate) {
    const gl = this.__gl;
    const unifs = renderstate.unifs;
    this.__surfaceDataTexture.bindToUniform(
      renderstate,
      unifs.surfaceDataTexture
    );
    gl.uniform2i(
      unifs.surfaceDataTextureSize.location,
      this.__surfaceDataTexture.width,
      this.__surfaceDataTexture.height
    );

    this.__surfaceAtlasLayoutTexture.bindToUniform(
      renderstate,
      unifs.surfaceAtlasLayoutTexture
    );
    gl.uniform2i(
      unifs.surfaceAtlasLayoutTextureSize.location,
      this.__surfaceAtlasLayoutTexture.width,
      this.__surfaceAtlasLayoutTexture.height
    );
  }

  /**
   * The bindSurfacesAtlas method.
   * @param {any} renderstate - The renderstate param.
   */
  bindSurfacesAtlas(renderstate) {
    const unifs = renderstate.unifs;
    this.__surfacesAtlasTexture.bindToUniform(
      renderstate,
      unifs.surfacesAtlasTexture
    );
    if (unifs.normalsTexture)
      this.__normalsTexture.bindToUniform(renderstate, unifs.normalsTexture);
    if (unifs.surfacesAtlasTextureSize)
      this.__gl.uniform2i(
        unifs.surfacesAtlasTextureSize.location,
        this.__surfacesAtlasTexture.width,
        this.__surfacesAtlasTexture.height
      );

    if (unifs.numSurfacesInLibrary)
      this.__gl.uniform1i(
        unifs.numSurfacesInLibrary.location,
        this.__surfacesLibrary.getNumSurfaces()
      );
  }

  /**
   * The getSurfaceData method.
   * @param {any} surfaceId - The surfaceId param.
   * @return {any} - The return value.
   */
  getSurfaceData(surfaceId) {
    return this.__surfacesLibrary.getSurfaceData(surfaceId)
  }

  /**
   * The destroy method.
   */
  destroy() {
    this.__surfaceDataTexture.destroy();
    this.__surfacesAtlasTexture.destroy();
    this.__normalsTexture.destroy();
    this.__surfacesFbo.destroy();
    this.__normalsFbo.destroy();
  }
}

/** This class abstracts the rendering of a collection of geometries to screen.
 * @extends Mesh
 * @ignore
 */
class Fan$1 extends zeaEngine.Mesh {
  /**
   * Create a fan.
   * @param {number} detail - The detail value.
   */
  constructor(detail = 1) {
    super();
    this.__detail = detail;
    this.addVertexAttribute('vertexIds', zeaEngine.Float32);
    this.__rebuild();
  }

  /**
   * The __rebuild method.
   * @private
   */
  __rebuild() {
    this.setNumVertices(this.__detail + 2);
    this.setFaceCounts([this.__detail]);

    for (let i = 0; i < this.__detail; i++) {
      this.setFaceVertexIndices(i, 0, i + 1, i + 2);
    }
    const vertexIds = this.getVertexAttribute('vertexIds');
    for (let i = 0; i <= vertexIds.length; i++) {
      vertexIds.setFloat32Value(i, i);
    }
  }
}

/** Class representing a strip.
 * @extends Plane
 * @ignore
 */
class Strip extends zeaEngine.Plane {
  /**
   * Create a strip.
   * @param {number} detail - The detail value.
   */
  constructor(detail = 1) {
    super(1, 2, detail, 1, false, false);
  }

  /**
   * The __resize method.
   * @private
   */
  __resize() {
    const sizeX = this.__sizeXParam.getValue();
    const sizeY = this.__sizeYParam.getValue();
    const detailX = this.__detailXParam.getValue();
    const detailY = this.__detailYParam.getValue();
    let voff = 0;
    for (let i = 0; i <= detailY; i++) {
      const y = (i / detailY - 0.5) * sizeY;
      for (let j = 0; j <= detailX; j++) {
        const x = j;
        this.getVertex(voff).set(x, y, 0.0);
        voff++;
      }
    }
    this.setBoundingBoxDirty();
  }
}

const numValuesPerCurveRef = 14;
const __cache$1 = {};

/** Class representing a GL trim curve draw set.
 * @ignore
 */
class GLTrimCurveDrawSet {
  /**
   * Create a GL trim curve draw set.
   * @param {any} gl - The gl value.
   * @param {any} detail - The detail value.
   * @param {any} trimCurvesDataArray - The trimCurvesDataArray value.
   */
  constructor(gl, detail, trimCurvesDataArray) {
    this.__gl = gl;
    this.__detail = detail;

    if (!__cache$1[detail]) {
      __cache$1[detail] = {
        glfangeom: new zeaEngine.GLMesh(gl, new Fan$1(detail)),
        glstripgeom: new zeaEngine.GLMesh(gl, new Strip(detail)),
      };
    }
    this.__glfangeom = __cache$1[detail].glfangeom;
    this.__glstripgeom = __cache$1[detail].glstripgeom;

    this.__buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, this.__buffer);
    gl.bufferData(gl.ARRAY_BUFFER, trimCurvesDataArray, gl.STATIC_DRAW);

    this.__drawCount = trimCurvesDataArray.length / numValuesPerCurveRef;
  }

  /**
   * The bindAttr method.
   * @param {any} location - The location param.
   * @param {any} channels - The channels param.
   * @param {any} type - The type param.
   * @param {any} stride - The stride param.
   * @param {any} offset - The offset param.
   */
  bindAttr(location, channels, type, stride, offset) {
    if (location < 0) return
    const gl = this.__gl;
    gl.enableVertexAttribArray(location);
    gl.vertexAttribPointer(location, channels, gl.FLOAT, false, stride, offset);
    gl.vertexAttribDivisor(location, 1); // This makes it instanced
  }

  // ////////////////////////////////////
  // Drawing

  /**
   * The setBuffer method.
   */
  setBuffer() {}

  /**
   * The drawFans method.
   * @param {any} renderstate - The renderstate param.
   */
  drawFans(renderstate) {
    const gl = this.__gl;

    this.__glfangeom.bind(renderstate);

    const unifs = renderstate.unifs;
    const attrs = renderstate.attrs;

    gl.bindBuffer(gl.ARRAY_BUFFER, this.__buffer);
    this.bindAttr(
      attrs.patchCoords.location,
      4,
      gl.FLOAT,
      numValuesPerCurveRef * 4,
      0
    );
    this.bindAttr(
      attrs.data0.location,
      4,
      gl.FLOAT,
      numValuesPerCurveRef * 4,
      4 * 4
    );
    this.bindAttr(
      attrs.data1.location,
      4,
      gl.FLOAT,
      numValuesPerCurveRef * 4,
      4 * 8
    );
    this.bindAttr(
      attrs.data2.location,
      2,
      gl.FLOAT,
      numValuesPerCurveRef * 4,
      4 * 12
    );

    gl.uniform1i(unifs.numCurveVertices.location, this.__detail + 1);

    this.__glfangeom.drawInstanced(this.__drawCount);
  }

  /**
   * The drawStrips method.
   * @param {any} renderstate - The renderstate param.
   */
  drawStrips(renderstate) {
    const gl = this.__gl;

    this.__glstripgeom.bind(renderstate);

    const unifs = renderstate.unifs;
    const attrs = renderstate.attrs;

    gl.bindBuffer(gl.ARRAY_BUFFER, this.__buffer);
    this.bindAttr(
      attrs.patchCoords.location,
      4,
      gl.FLOAT,
      numValuesPerCurveRef * 4,
      0
    );
    this.bindAttr(
      attrs.data0.location,
      4,
      gl.FLOAT,
      numValuesPerCurveRef * 4,
      4 * 4
    );
    this.bindAttr(
      attrs.data1.location,
      4,
      gl.FLOAT,
      numValuesPerCurveRef * 4,
      4 * 8
    );
    this.bindAttr(
      attrs.data2.location,
      2,
      gl.FLOAT,
      numValuesPerCurveRef * 4,
      4 * 12
    );

    gl.uniform1i(unifs.numCurveVertices.location, this.__detail + 1);

    this.__glstripgeom.drawInstanced(this.__drawCount);
  }

  /**
   * The cleanup method.
   */
  cleanup() {
    // this.__gl.deleteBuffer(this.__buffer);
  }
}

/** Class representing a GL trim set library.
 * @ignore
 */
class GLTrimSetLibrary {
  /**
   * Create a GL trim set library.
   * @param {any} gl - The gl value.
   * @param {any} cadpassdata - The cadpassdata value.
   * @param {any} trimSetLibrary - The trimSetLibrary value.
   * @param {any} glCurvesLibrary - The glCurvesLibrary value.
   */
  constructor(gl, cadpassdata, trimSetLibrary, glCurvesLibrary) {
    this.__gl = gl;
    this.__cadpassdata = cadpassdata;
    this.__trimSetLibrary = trimSetLibrary;
    this.__glCurvesLibrary = glCurvesLibrary;

    const trimSetsBuffer = this.__trimSetLibrary.getBinaryBuffer();
    const trimSetsTexSize = Math.sqrt(trimSetsBuffer.byteLength / 8);
    this.__trimSetsTexture = new zeaEngine.GLTexture2D(gl, {
      format: 'RGBA',
      type: 'HALF_FLOAT',
      width: trimSetsTexSize,
      height: trimSetsTexSize,
      filter: 'NEAREST',
      wrap: 'CLAMP_TO_EDGE',
      mipMapped: false,
      data: new Uint16Array(trimSetsBuffer),
    });

    this.__bindAttr = (
      location,
      channels,
      type,
      stride,
      offset,
      instanced = true
    ) => {
      gl.enableVertexAttribArray(location);
      gl.vertexAttribPointer(
        location,
        channels,
        gl.FLOAT,
        false,
        stride,
        offset
      );
      if (instanced) gl.vertexAttribDivisor(location, 1); // This makes it instanced
    };

    this.__trimCurveDrawSets = {};
  }

  // /////////////////////////////////////////////////////////////
  // Trim Sets

  /**
   * The evaluateTrimSets method.
   * @param {any} trimCurveDrawSets - The trimCurveDrawSets param.
   * @param {any} trimSetAtlasTextureSize - The trimSetAtlasTextureSize param.
   * @param {any} trimSetsAtlasLayoutData - The trimSetsAtlasLayoutData param.
   * @param {any} trimSetsAtlasLayoutTextureSize - The trimSetsAtlasLayoutTextureSize param.
   */
  evaluateTrimSets(
    trimCurveDrawSets,
    trimSetAtlasTextureSize,
    trimSetsAtlasLayoutData,
    trimSetsAtlasLayoutTextureSize
  ) {
    // console.log("evaluateTrimSets:" + trimSetAtlasTextureSize);
    const gl = this.__gl;

    {
      this.__trimSetsAtlasLayoutTexture = new zeaEngine.GLTexture2D(this.__gl, {
        format: 'RGBA',
        type: 'FLOAT',
        width: trimSetsAtlasLayoutTextureSize[0],
        height: trimSetsAtlasLayoutTextureSize[1],
        filter: 'NEAREST',
        wrap: 'CLAMP_TO_EDGE',
        mipMapped: false,
        data: trimSetsAtlasLayoutData,
      });
    }

    if (!this.__trimSetAtlasTexture) {
      this.__trimSetAtlasTextureSize = trimSetAtlasTextureSize;

      if (
        this.__trimSetAtlasTextureSize[0] > this.__cadpassdata.maxTexSize ||
        this.__trimSetAtlasTextureSize[1] > this.__cadpassdata.maxTexSize
      ) {
        console.warn(
          'trimSetAtlas  is too big to fit in a texture. The image will be downsized:' +
            this.__trimSetAtlasTextureSize +
            ' maxTexSize:' +
            this.__cadpassdata.maxTexSize
        );
      }

      this.__trimSetAtlasMaskTexture = new zeaEngine.GLTexture2D(gl, {
        format: gl.name == 'webgl2' ? 'RED' : 'RGBA',
        type: 'UNSIGNED_BYTE',
        width: Math.min(
          this.__trimSetAtlasTextureSize[0],
          this.__cadpassdata.maxTexSize
        ),
        height: Math.min(
          this.__trimSetAtlasTextureSize[1],
          this.__cadpassdata.maxTexSize
        ),
        filter: 'NEAREST',
      });
      this.__trimSetAtlasMaskFbo = new zeaEngine.GLFbo(
        gl,
        this.__trimSetAtlasMaskTexture
      );
      this.__trimSetAtlasMaskFbo.setClearColor([0, 0, 0, 0]);

      // Signed Distance Fields (SDF)
      // Simple signed distance fields using one channel
      const format = gl.name == 'webgl2' ? 'RED' : 'RGBA';
      const filter = 'LINEAR';

      // Signed Distance + Gradient Fields (SDGF)
      // Encode the actual gradient value into the texture in the
      // GB channels. 
      // Note: This didn't actually work. It was supposed to
      // eliminate cobwebs we sometimes see around the border
      // of trimmed geometry, but even when the sampler was
      // set to NEAREST, we still see the cobwebs whenm zoomed out
      // Please look at the Dead Eye Bearing and zoom out.
      // const format = 'RGBA';
      // const filter = 'NEAREST'

      // Dual Channel Signed Distance Field (DCSDF)
      // Encode outer boundaries and holes into different
      // channels. This means we should get perfect rendering of thin
      // endges. (e.g. pipe ends. )
      // It won't handle thin ends like I beams. For that we need MCSDF

      // Multi-channel signed distance field
      // https://github.com/Chlumsky/msdfgen
      // TODO: To fix corners, we should look at this paper. 

      this.__trimSetAtlasTexture = new zeaEngine.GLTexture2D(gl, {
        format,
        type: 'UNSIGNED_BYTE',
        width: Math.min(
          this.__cadpassdata.maxTexSize,
          this.__trimSetAtlasTextureSize[0]
        ),
        height: Math.min(
          this.__cadpassdata.maxTexSize,
          this.__trimSetAtlasTextureSize[1]
        ),
        magFilter: filter,
        minFilter: filter,
      });

      this.ext_filter_anisotropic = (
        gl.getExtension('EXT_texture_filter_anisotropic') ||
        gl.getExtension('MOZ_EXT_texture_filter_anisotropic') ||
        gl.getExtension('WEBKIT_EXT_texture_filter_anisotropic')
      );

      this.__trimSetAtlasFbo = new zeaEngine.GLFbo(
        gl,
        this.__trimSetAtlasTexture
      );
      this.__trimSetAtlasFbo.setClearColor([0, 0, 0, 0]);
    } else if (
      this.__trimSetAtlasTexture.width != trimSetAtlasTextureSize[0] ||
      this.__trimSetAtlasTexture.height != trimSetAtlasTextureSize[1]
    ) {
      this.__trimSetAtlasTextureSize = trimSetAtlasTextureSize;

      // Copy the previous image into a new one, and then destroy the prvious.
      this.__trimSetAtlasTexture.resize(
        trimSetAtlasTextureSize[0],
        trimSetAtlasTextureSize[1],
        true
      );
      this.__trimSetAtlasFbo.resize(); // hack to rebind the texture. Refactor the way textures are resized.

      // this.__trimSetAtlasFbo.bind();
    }

    const renderstate = {};
    // ////////////////////////////////////////////////
    // Render the mask aread using fans

    this.__trimSetAtlasMaskFbo.bindAndClear();

    {
      // / Setup additive blending so that all rendering passes accumulate into the same Fbo.
      gl.enable(gl.BLEND);
      gl.blendEquation(gl.FUNC_ADD);
      gl.blendFunc(gl.ONE, gl.ONE);

      this.__cadpassdata.trimCurveFansShader.bind(renderstate);
      const unifs = renderstate.unifs;

      this.__glCurvesLibrary.bindCurvesAtlas(renderstate);

      gl.uniform2i(
        unifs.trimSetAtlasTextureSize.location,
        this.__trimSetAtlasTextureSize[0],
        this.__trimSetAtlasTextureSize[1]
      );

      // For vertex welding (Not yet implemented)
      if (unifs.trimSetTexture) {
        this.__trimSetsTexture.bindToUniform(renderstate, unifs.trimSetTexture);
        if (unifs.trimSetTextureSize)
          gl.uniform2i(
            unifs.trimSetTextureSize.location,
            this.__trimSetsTexture.width,
            this.__trimSetsTexture.height
          );

        this.__trimSetsAtlasLayoutTexture.bindToUniform(
          renderstate,
          unifs.curvesAtlasLayoutTexture
        );
        if (unifs.curvesAtlasLayoutTextureSize)
          gl.uniform2i(
            unifs.curvesAtlasLayoutTextureSize.location,
            this.__trimSetsAtlasLayoutTexture.width,
            this.__trimSetsAtlasLayoutTexture.height
          );
      }

      for (const key in trimCurveDrawSets) {
        const detail = parseInt(key);
        if (detail < 0) continue
        let trimCurveDrawSet = this.__trimCurveDrawSets[key];
        if (!trimCurveDrawSet) {
          trimCurveDrawSet = new GLTrimCurveDrawSet(
            this.__gl,
            detail,
            trimCurveDrawSets[key]
          );
          this.__trimCurveDrawSets[key] = trimCurveDrawSet;
        }
        trimCurveDrawSet.drawFans(renderstate);
      }

      gl.disable(gl.BLEND);
    }

    // ////////////////////////////////////////////////////
    // Render the float texture as a signed distance field

    this.__trimSetAtlasFbo.bindAndClear();

    // if(false)
    {
      // /////////////////////////
      // Flatten the fans texture
      this.__cadpassdata.flattenTrimSetsShader.bind(renderstate);
      const unifs = renderstate.unifs;
      this.__trimSetAtlasMaskTexture.bindToUniform(
        renderstate,
        unifs.trimSetAtlasTexture
      );
      if (unifs.trimSetAtlasTextureSize)
        this.__gl.uniform2i(
          unifs.trimSetAtlasTextureSize.location,
          this.__trimSetAtlasTextureSize[0],
          this.__trimSetAtlasTextureSize[1]
        );
      this.__cadpassdata.glplanegeom.bind(renderstate);
      this.__cadpassdata.glplanegeom.draw();
    }

    // //////////////////////////////////////
    // Draw the Strips to clean up the edges
    // if(false)
    {
      this.__cadpassdata.trimCurveStripsShader.bind(renderstate);
      const unifs = renderstate.unifs;

      this.__glCurvesLibrary.bindCurvesAtlas(renderstate);

      gl.uniform2i(
        unifs.trimSetAtlasTextureSize.location,
        this.__trimSetAtlasTextureSize[0],
        this.__trimSetAtlasTextureSize[1]
      );
      gl.uniform1f(unifs.stripWidth.location, 0.75);

      for (const key in trimCurveDrawSets) {
        const detail = parseInt(key);
        if (detail < 0) continue
        let trimCurveDrawSet = this.__trimCurveDrawSets[key];
        if (!trimCurveDrawSet) {
          trimCurveDrawSet = new GLTrimCurveDrawSet(
            this.__gl,
            detail,
            trimCurveDrawSets[key]
          );
          this.__trimCurveDrawSets[key] = trimCurveDrawSet;
        }
        trimCurveDrawSet.drawStrips(renderstate);
      }
    }

    for (const key in trimCurveDrawSets) {
      const trimCurveDrawSet = this.__trimCurveDrawSets[key];
      if (trimCurveDrawSet) trimCurveDrawSet.cleanup();
    }

    this.__trimSetsAtlasLayoutData = trimSetsAtlasLayoutData;
    // console.log("----------------------------------");
    // const st_x = Math.round(trimSetAtlasTextureSize[0] / 2)
    // const st_y = trimSetAtlasTextureSize[0] - 4;; //Math.round(trimSetAtlasTextureSize[1] / 2)
    // gl.finish();
    // this.logTrimSet(0);

    gl.finish();
  }

  /**
   * The logTrimSetMask method.
   * @param {any} trimSetId - The trimSetId param.
   */
  logTrimSetMask(trimSetId) {
    const gl = this.__gl;
    this.__trimSetAtlasMaskFbo.bind();
    const layout = [
      this.__trimSetsAtlasLayoutData[trimSetId * 4 + 0],
      this.__trimSetsAtlasLayoutData[trimSetId * 4 + 1],
      this.__trimSetsAtlasLayoutData[trimSetId * 4 + 2],
      this.__trimSetsAtlasLayoutData[trimSetId * 4 + 3],
    ];
    console.log(
      'logTrimSetMask ' +
        trimSetId +
        ':[' +
        layout[0] +
        ',' +
        layout[1] +
        ']:' +
        layout[2] +
        'x' +
        layout[3]
    );
    const pixels = new Uint8Array(layout[2] * 4);
    for (let i = 0; i < layout[3]; i++) {
      gl.readPixels(
        layout[0],
        layout[1] + i,
        layout[2],
        1,
        gl.name == 'webgl2' ? gl.RED : gl.RGBA,
        gl.UNSIGNED_BYTE,
        pixels
      );
      let line = i + ' ';
      for (let j = 0; j < layout[2]; j++) {
        // line += (pixels[j * 4] % 2 == 0 ? '-' : '*');
        line += pixels[j * 4];
      }
      console.log(line);
    }
  }

  /**
   * The logTrimSet method.
   * @param {any} trimSetId - The trimSetId param.
   */
  logTrimSet(trimSetId) {
    const gl = this.__gl;
    this.__trimSetAtlasFbo.bind();
    const layout = [
      this.__trimSetsAtlasLayoutData[trimSetId * 4 + 0],
      this.__trimSetsAtlasLayoutData[trimSetId * 4 + 1],
      this.__trimSetsAtlasLayoutData[trimSetId * 4 + 2],
      this.__trimSetsAtlasLayoutData[trimSetId * 4 + 3],
    ];
    console.log(
      'logTrimSet ' +
        trimSetId +
        ':[' +
        layout[0] +
        ',' +
        layout[1] +
        ']:' +
        layout[2] +
        'x' +
        layout[3]
    );
    const pixels = new Uint16Array(layout[2] * 4);
    for (let i = 0; i < layout[3]; i++) {
      gl.readPixels(
        layout[0],
        layout[1] + i,
        layout[2],
        1,
        gl.RGBA,
        gl.HALF_FLOAT,
        pixels
      );
      let line = i + ' ';
      for (let j = 0; j < layout[2]; j++) {
        // line += (pixels[j * 4] % 2 == 0 ? '-' : '*');
        line += pixels[j * 4];
      }
      console.log(line);
    }
  }

  /**
   * The bindTrimSetAtlas method.
   * @param {any} renderstate - The renderstate param.
   */
  bindTrimSetAtlas(renderstate) {
    const gl = this.__gl;
    const unifs = renderstate.unifs;
    const { trimSetAtlasTexture, trimSetAtlasTextureSize } = unifs;
    if (this.__trimSetAtlasTexture && trimSetAtlasTexture) {
      this.__trimSetAtlasTexture.bindToUniform(
        renderstate,
        trimSetAtlasTexture
      );
      if (trimSetAtlasTextureSize) {
        gl.uniform2i(
          trimSetAtlasTextureSize.location,
          this.__trimSetAtlasTextureSize[0],
          this.__trimSetAtlasTextureSize[1]
        );
      }
      
      if (this.ext_filter_anisotropic){
        // Disable anisotropic filtering on this texture.
        gl.texParameterf(gl.TEXTURE_2D, this.ext_filter_anisotropic.TEXTURE_MAX_ANISOTROPY_EXT, 1.0);
      }
    }
  }

  /**
   * The bindTrimSetAtlasLayout method.
   * @param {any} renderstate - The renderstate param.
   */
  bindTrimSetAtlasLayout(renderstate) {
    // During debugging, we disable trim sets.
    if (!this.__trimSetsAtlasLayoutTexture) return;
    const gl = this.__gl;
    const unifs = renderstate.unifs;
    this.__trimSetsAtlasLayoutTexture.bindToUniform(
      renderstate,
      unifs.trimSetsAtlasLayoutTexture
    );
    gl.uniform2i(
      unifs.trimSetsAtlasLayoutTextureSize.location,
      this.__trimSetsAtlasLayoutTexture.width,
      this.__trimSetsAtlasLayoutTexture.height
    );
  }

  /**
   * The drawTrimSets method.
   * @param {any} renderstate - The renderstate param.
   * @return {boolean} - The return value.
   */
  drawTrimSets(renderstate) {
    if (
      !this.__trimSetAtlasTexture ||
      !this.__cadpassdata.debugTrimSetsShader.bind(renderstate)
    )
      return false
    // this.bindTrimSetAtlas(renderstate);

    this.__trimSetAtlasTexture.bindToUniform(
      renderstate,
      renderstate.unifs.trimSetAtlasTexture
    );
    this.__cadpassdata.glplanegeom.bind(renderstate);
    this.__cadpassdata.glplanegeom.draw();
  }

  /**
   * The destroy method.
   */
  destroy() {
    this.__trimSetsTexture.destroy();
    this.__trimSetsAtlasLayoutTexture.destroy();
    this.__trimSetAtlasMaskTexture.destroy();
    this.__trimSetAtlasMaskFbo.destroy();
    this.__trimSetAtlasTexture.destroy();
    this.__trimSetAtlasFbo.destroy();
  }
}

// import {
//   GLCADAssetWorker_onmessage
// } from './GLCADAssetWorker.js';

/** Class representing a GLCADBody. 
 * @ignore
*/
class GLCADBody {
  constructor(
    cadBody,
    bodyId,
    cadpassdata,
    sceneBodyItemsData,
    bodyItemDataChanged,
    highlightedBodies,
    highlightChangeBatch,
    pushhighlightChangeBatchToWorker
  ) {

    this.cadBody = cadBody;

    const offset = bodyId * floatsPerSceneBody;
    let flags = 0;
    if (!cadBody.getVisible()) flags |= BODY_FLAG_INVISIBLE;
    if (
      (cadBody.isCutawayEnabled && cadBody.isCutawayEnabled()) ||
      (cadBody.hasParameter('CutawayEnabled') &&
        cadBody.getParameter('CutawayEnabled').getValue())
    ) {
      flags |= BODY_FLAG_CUTAWAY;
    }

    const material = cadBody.getMaterial();

    const shaderId = cadpassdata.genShaderID(material.getShaderName());
    // console.log("Shader:" + material.getShaderName() + ":" + shaderId);
    let glmaterialcoords = material.getMetadata('glmaterialcoords');
    if (!glmaterialcoords)
      glmaterialcoords = cadpassdata.materialLibrary.addMaterial(
        material
      );
    sceneBodyItemsData[offset + 0] = cadBody.getBodyDescId();
    sceneBodyItemsData[offset + 1] = flags;
    sceneBodyItemsData[offset + 2] = shaderId;
    sceneBodyItemsData[offset + 3] = glmaterialcoords.x;
    sceneBodyItemsData[offset + 4] = glmaterialcoords.y;

    // Note: visibility can be inherited, so the parameter is
    // not the final value...
    // Note: because the visibilityChanged signal is actually
    // the visbleParam flag, we get signals here when the computed
    // visiblity didn't actually change. We should use a separate
    // signal for the computed visiblity changing.
    this.visibilityChangedId = cadBody.visibilityChanged.connect(() => {
      const visibile = cadBody.getVisible();
      if (!visibile) {
        if ((flags & BODY_FLAG_INVISIBLE) == 0) {
          flags |= BODY_FLAG_INVISIBLE;
          bodyItemDataChanged(bodyId, 'flags', flags);
        }
      } else {
        if ((flags & BODY_FLAG_INVISIBLE) != 0) {
          flags &= ~BODY_FLAG_INVISIBLE;
          bodyItemDataChanged(bodyId, 'flags', flags);
        }
      }
    });

    if (cadBody.cutAwayChanged) {
      this.cutAwayChangedId = cadBody.cutAwayChanged.connect(() => {
        if (cadBody.isCutawayEnabled()) flags |= BODY_FLAG_CUTAWAY;
        else flags &= ~BODY_FLAG_CUTAWAY;

        bodyItemDataChanged(bodyId, 'flags', flags);
      });
    } else {
      const cutParam = cadBody.getParameter('CutawayEnabled');
      if (cutParam) {
        this.cutAwayEnabledId = cutParam.valueChanged.connect(() => {
          if (cutParam.getValue()) flags |= BODY_FLAG_CUTAWAY;
          else flags &= ~BODY_FLAG_CUTAWAY;

          bodyItemDataChanged(bodyId, 'flags', flags);
        });
      }
    }

    this.materialChangedId = cadBody.getParameter('Material').valueChanged.connect(() => {
      const material = cadBody.getMaterial();
      let glmaterialcoords = material.getMetadata('glmaterialcoords');
      if (!glmaterialcoords)
        glmaterialcoords = cadpassdata.materialLibrary.addMaterial(
          material
        );

      bodyItemDataChanged(bodyId, 'material', glmaterialcoords);
    });

    // /////////////////////////////////
    // Body Xfo
    const bodyXfo = cadBody.getGlobalXfo();

    // Note: on mobile GPUs, we get only FP16 math in the
    // fragment shader, causing inaccuracies in modelMatrix
    // calculation. By offsetting the data to the origin
    // we calculate a modelMatrix in the asset space, and
    //  then add it back on during final drawing.
    // bodyXfo.tr.subtractInPlace(this.__assetCentroid)

    const tr = zeaEngine.Vec3.createFromFloat32Buffer(
      sceneBodyItemsData.buffer,
      offset + 5
    );
    const ori = zeaEngine.Vec4.createFromFloat32Buffer(
      sceneBodyItemsData.buffer,
      offset + 8
    );
    const sc = zeaEngine.Vec3.createFromFloat32Buffer(
      sceneBodyItemsData.buffer,
      offset + 12
    );
    tr.set(bodyXfo.tr.x, bodyXfo.tr.y, bodyXfo.tr.z);
    ori.set(bodyXfo.ori.x, bodyXfo.ori.y, bodyXfo.ori.z, bodyXfo.ori.w);
    sc.set(bodyXfo.sc.x, bodyXfo.sc.y, bodyXfo.sc.z);

    const xfoArray = new Float32Array(10);
    const globalXfoParam = cadBody.getParameter("GlobalXfo");
    this.globalXfoChangedId = globalXfoParam.valueChanged.connect(() => {
      const bodyXfo = globalXfoParam.getValue();
      // const bodyXfo = cadBody.getGlobalXfo().clone()
      // bodyXfo.tr.subtractInPlace(this.__assetCentroid)

      xfoArray.set(bodyXfo.tr.asArray(), 0);
      xfoArray.set(bodyXfo.ori.asArray(), 3);
      xfoArray.set(bodyXfo.sc.asArray(), 7);
      bodyItemDataChanged(bodyId, 'xfo', xfoArray);
    });

    // /////////////////////////////////
    // Highlight

    this.highlightChangedId = cadBody.highlightChanged.connect(() => {
      if (!highlightChangeBatch.dirty) {
        setTimeout(pushhighlightChangeBatchToWorker, 1);
        highlightChangeBatch.dirty = true;
      }
      const highlighted = cadBody.isHighlighted();
      if (highlighted) {
        if (highlightedBodies.indexOf(bodyId) == -1) {
          highlightedBodies.push(bodyId);

          // Note: filter out highlight/unhighlight in a single update.
          const indexInSelChangeSet = highlightChangeBatch.unhighlightedBodyIds.indexOf(
            bodyId
          );
          if (indexInSelChangeSet != -1) {
            highlightChangeBatch.unhighlightedBodyIds.splice(
              indexInSelChangeSet,
              1
            );
          } else {
            highlightChangeBatch.highlightedBodyIds.push(bodyId);
          }
        }
        bodyItemDataChanged(
          bodyId,
          'highlight',
          cadBody.getHighlight().asArray()
        );
      } else {
        const index = highlightedBodies.indexOf(bodyId);
        if (index != -1) {
          highlightedBodies.splice(index, 1);

          // Note: filter out highlight/unhighlight in a single update.
          const indexInSelChangeSet = highlightChangeBatch.highlightedBodyIds.indexOf(
            bodyId
          );
          if (indexInSelChangeSet != -1) {
            highlightChangeBatch.highlightedBodyIds.splice(
              indexInSelChangeSet,
              1
            );
          } else {
            highlightChangeBatch.unhighlightedBodyIds.push(bodyId);
          }
        }
      }
    });

    if (cadBody.isHighlighted()) {
      const highlight = cadBody.getHighlight();
      sceneBodyItemsData[offset + 15] = highlight.r;
      sceneBodyItemsData[offset + 16] = highlight.g;
      sceneBodyItemsData[offset + 17] = highlight.b;
      sceneBodyItemsData[offset + 18] = highlight.a;
      // ///////////////////////////////////
      // TODO: Bug here!!!
      // If a body is initially hilighted, then
      // we must generate a drawItemSet for the
      // hilighted items. See: bodyHighlightChanged
      // highlightedBodies.push(bodyId);
    }

    // /////////////////////////////////
    // Body Cut Plane
    const cutPlane = new zeaEngine.Vec3(1, 0, 0);
    const cutPlaneDist = 0;
    sceneBodyItemsData[offset + 19] = cutPlane.x;
    sceneBodyItemsData[offset + 20] = cutPlane.y;
    sceneBodyItemsData[offset + 21] = cutPlane.z;
    sceneBodyItemsData[offset + 22] = cutPlaneDist;

    // const cutParam = cadBody.getParameter('Cut');
    // cutParam.valueChanged.connect(() => {
    //   cutChanged(bodyId, cutParam.getValue());
    // })

  }

  destroy(){
    this.cadBody.visibilityChanged.disconnectId(this.visibilityChangedId);
    if (this.cadBody.cutAwayChanged) {
      this.cadBody.cutAwayChanged.disconnectId(this.cutAwayChangedId);
    } else {
      const cutParam = cadBody.getParameter('CutawayEnabled');
      if (cutParam) {
        cutParam.valueChanged.disconnectId(this.cutAwayEnabledId);
      }
    }
    this.cadBody.getParameter('Material').valueChanged.disconnectId(this.materialChangedId);
    this.cadBody.getParameter("GlobalXfo").valueChanged.disconnectId(this.globalXfoChangedId);
    this.cadBody.highlightChanged.disconnectId(this.highlightChangedId);
  }
}

const kIsNodeJS = Object.prototype.toString.call(typeof process !== 'undefined' ? process : 0) === '[object process]';
const kRequire = kIsNodeJS && typeof module.require === 'function' ? module.require : null; // eslint-disable-line

function browserDecodeBase64(base64, enableUnicode) {
    const binaryString = atob(base64);
    if (enableUnicode) {
        const binaryView = new Uint8Array(binaryString.length);
        Array.prototype.forEach.call(binaryView, (el, idx, arr) => {
            arr[idx] = binaryString.charCodeAt(idx);
        });
        return String.fromCharCode.apply(null, new Uint16Array(binaryView.buffer));
    }
    return binaryString;
}

function nodeDecodeBase64(base64, enableUnicode) {
    return Buffer.from(base64, 'base64').toString(enableUnicode ? 'utf16' : 'utf8');
}

function createBase64WorkerFactory(base64, sourcemap = null, enableUnicode = false) {
    const source = kIsNodeJS ? nodeDecodeBase64(base64, enableUnicode) : browserDecodeBase64(base64, enableUnicode);
    const start = source.indexOf('\n', 10) + 1;
    const body = source.substring(start) + (sourcemap ? `\/\/# sourceMappingURL=${sourcemap}` : '');

    if (kRequire) {
        /* node.js */
        const Worker = kRequire('worker_threads').Worker; // eslint-disable-line
        return function WorkerFactory(options) {
            return new Worker(body, Object.assign({}, options, { eval: true }));
        };
    }

    /* browser */
    const blob = new Blob([body], { type: 'application/javascript' });
    const url = URL.createObjectURL(blob);
    return function WorkerFactory(options) {
        return new Worker(url, options);
    };
}

/* eslint-disable */
const WorkerFactory = createBase64WorkerFactory('Lyogcm9sbHVwLXBsdWdpbi13ZWItd29ya2VyLWxvYWRlciAqLwovLyBUYWtlbiBmcm9tIGhlcmU6IGh0dHBzOi8vZ2l0aHViLmNvbS9qYWtlc2dvcmRvbi9iaW4tcGFja2luZy9ibG9iL21hc3Rlci9qcy9wYWNrZXIuZ3Jvd2luZy5qcw0KDQovLyBpbXBvcnQgew0KLy8gICBTaWduYWwNCi8vIH0gZnJvbSAnLi9TaWduYWwnDQoNCi8qKiAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqDQoNClRoaXMgaXMgYSBiaW5hcnkgdHJlZSBiYXNlZCBiaW4gcGFja2luZyBhbGdvcml0aG0gdGhhdCBpcyBtb3JlIGNvbXBsZXggdGhhbg0KdGhlIHNpbXBsZSBQYWNrZXIgKHBhY2tlci5qcykuIEluc3RlYWQgb2Ygc3RhcnRpbmcgb2ZmIHdpdGggYSBmaXhlZCB3aWR0aCBhbmQNCmhlaWdodCwgaXQgc3RhcnRzIHdpdGggdGhlIHdpZHRoIGFuZCBoZWlnaHQgb2YgdGhlIGZpcnN0IGJsb2NrIHBhc3NlZCBhbmQgdGhlbg0KZ3Jvd3MgYXMgbmVjZXNzYXJ5IHRvIGFjY29tb2RhdGUgZWFjaCBzdWJzZXF1ZW50IGJsb2NrLiBBcyBpdCBncm93cyBpdCBhdHRlbXB0cw0KdG8gbWFpbnRhaW4gYSByb3VnaGx5IHNxdWFyZSByYXRpbyBieSBtYWtpbmcgJ3NtYXJ0JyBjaG9pY2VzIGFib3V0IHdoZXRoZXIgdG8NCmdyb3cgcmlnaHQgb3IgZG93bi4NCg0KV2hlbiBncm93aW5nLCB0aGUgYWxnb3JpdGhtIGNhbiBvbmx5IGdyb3cgdG8gdGhlIHJpZ2h0IE9SIGRvd24uIFRoZXJlZm9yZSwgaWYNCnRoZSBuZXcgYmxvY2sgaXMgQk9USCB3aWRlciBhbmQgdGFsbGVyIHRoYW4gdGhlIGN1cnJlbnQgdGFyZ2V0IHRoZW4gaXQgd2lsbCBiZQ0KcmVqZWN0ZWQuIFRoaXMgbWFrZXMgaXQgdmVyeSBpbXBvcnRhbnQgdG8gaW5pdGlhbGl6ZSB3aXRoIGEgc2Vuc2libGUgc3RhcnRpbmcNCndpZHRoIGFuZCBoZWlnaHQuIElmIHlvdSBhcmUgcHJvdmlkaW5nIHNvcnRlZCBpbnB1dCAobGFyZ2VzdCBmaXJzdCkgdGhlbiB0aGlzDQp3aWxsIG5vdCBiZSBhbiBpc3N1ZS4NCg0KQSBwb3RlbnRpYWwgd2F5IHRvIHNvbHZlIHRoaXMgbGltaXRhdGlvbiB3b3VsZCBiZSB0byBhbGxvdyBncm93dGggaW4gQk9USA0KZGlyZWN0aW9ucyBhdCBvbmNlLCBidXQgdGhpcyByZXF1aXJlcyBtYWludGFpbmluZyBhIG1vcmUgY29tcGxleCB0cmVlDQp3aXRoIDMgY2hpbGRyZW4gKGRvd24sIHJpZ2h0IGFuZCBjZW50ZXIpIGFuZCB0aGF0IGNvbXBsZXhpdHkgY2FuIGJlIGF2b2lkZWQNCmJ5IHNpbXBseSBjaG9zaW5nIGEgc2Vuc2libGUgc3RhcnRpbmcgYmxvY2suDQoNCkJlc3QgcmVzdWx0cyBvY2N1ciB3aGVuIHRoZSBpbnB1dCBibG9ja3MgYXJlIHNvcnRlZCBieSBoZWlnaHQsIG9yIGV2ZW4gYmV0dGVyDQp3aGVuIHNvcnRlZCBieSBtYXgod2lkdGgsaGVpZ2h0KS4NCg0KSW5wdXRzOg0KLS0tLS0tDQoNCiAgYmxvY2tzOiBhcnJheSBvZiBhbnkgb2JqZWN0cyB0aGF0IGhhdmUgLncgYW5kIC5oIGF0dHJpYnV0ZXMNCg0KT3V0cHV0czoNCi0tLS0tLS0NCg0KICBtYXJrcyBlYWNoIGJsb2NrIHRoYXQgZml0cyB3aXRoIGEgLmZpdCBhdHRyaWJ1dGUgcG9pbnRpbmcgdG8gYQ0KICBub2RlIHdpdGggLnggYW5kIC55IGNvb3JkaW5hdGVzDQoNCkV4YW1wbGU6DQotLS0tLS0tDQoNCiAgdmFyIGJsb2NrcyA9IFsNCiAgICB7IHc6IDEwMCwgaDogMTAwIH0sDQogICAgeyB3OiAxMDAsIGg6IDEwMCB9LA0KICAgIHsgdzogIDgwLCBoOiAgODAgfSwNCiAgICB7IHc6ICA4MCwgaDogIDgwIH0sDQogICAgZXRjDQogICAgZXRjDQogIF07DQoNCiAgdmFyIHBhY2tlciA9IG5ldyBHcm93aW5nUGFja2VyKCk7DQogIHBhY2tlci5maXQoYmxvY2tzKTsNCg0KICBmb3IodmFyIG4gPSAwIDsgbiA8IGJsb2Nrcy5sZW5ndGggOyBuKyspIHsNCiAgICB2YXIgYmxvY2sgPSBibG9ja3Nbbl07DQogICAgaWYgKGJsb2NrLmZpdCkgew0KICAgICAgRHJhdyhibG9jay5maXQueCwgYmxvY2suZml0LnksIGJsb2NrLncsIGJsb2NrLmgpOw0KICAgIH0NCiAgfQ0KDQoNCioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKi8NCg0KLyoqIENsYXNzIHJlcHJlc2VudGluZyBhIGdyb3dpbmcgcGFja2VyLiANCiAqIEBpZ25vcmUNCiovDQpjbGFzcyBHcm93aW5nUGFja2VyIHsNCiAgLyoqDQogICAqIENyZWF0ZSBhIGdyb3dpbmcgcGFja2VyLg0KICAgKiBAcGFyYW0ge251bWJlcn0gdyAtIFRoZSB3IHZhbHVlLg0KICAgKiBAcGFyYW0ge251bWJlcn0gaCAtIFRoZSBoIHZhbHVlLg0KICAgKi8NCiAgY29uc3RydWN0b3IodyA9IDAsIGggPSAwKSB7DQogICAgdGhpcy5yb290ID0gew0KICAgICAgeDogMCwNCiAgICAgIHk6IDAsDQogICAgICB3OiB3LA0KICAgICAgaDogaCwNCiAgICB9Ow0KDQogICAgLy8gdGhpcy5yZXNpemVkID0gbmV3IFNpZ25hbCgpOw0KICB9DQoNCiAgLyoqDQogICAqIFRoZSBmaXQgbWV0aG9kLg0KICAgKiBAcGFyYW0ge2FueX0gYmxvY2tzIC0gVGhlIGJsb2NrcyBwYXJhbS4NCiAgICovDQogIGZpdChibG9ja3MpIHsNCiAgICBjb25zdCBsZW4gPSBibG9ja3MubGVuZ3RoOw0KICAgIGlmIChsZW4gPT0gMCkgcmV0dXJuDQogICAgaWYgKHRoaXMucm9vdC53IDwgYmxvY2tzWzBdLncpIHsNCiAgICAgIHRoaXMucm9vdC53ID0gYmxvY2tzWzBdLnc7DQogICAgfQ0KICAgIGlmICh0aGlzLnJvb3QuaCA8IGJsb2Nrc1swXS5oKSB7DQogICAgICB0aGlzLnJvb3QuaCA9IGJsb2Nrc1swXS5oOw0KICAgIH0NCiAgICBjb25zdCBlYWNoQmxvY2sgPSBibG9jayA9PiB7DQogICAgICBibG9jay5maXQgPSB0aGlzLl9fYWRkQmxvY2soYmxvY2spOw0KICAgIH07DQogICAgYmxvY2tzLmZvckVhY2goZWFjaEJsb2NrKTsNCiAgfQ0KDQogIC8qKg0KICAgKiBUaGUgX19hZGRCbG9jayBtZXRob2QuDQogICAqIEBwYXJhbSB7YW55fSBibG9jayAtIFRoZSBibG9ja3MgcGFyYW0uDQogICAqIEByZXR1cm4ge2FueX0gLSBUaGUgcmV0dXJuIHZhbHVlLg0KICAgKiBAcHJpdmF0ZQ0KICAgKi8NCiAgX19hZGRCbG9jayhibG9jaykgew0KICAgIGNvbnN0IG5vZGUgPSB0aGlzLmZpbmROb2RlKHRoaXMucm9vdCwgYmxvY2sudywgYmxvY2suaCk7DQogICAgaWYgKG5vZGUpIHJldHVybiB0aGlzLnNwbGl0Tm9kZShub2RlLCBibG9jay53LCBibG9jay5oKQ0KICAgIGVsc2UgcmV0dXJuIHRoaXMuZ3Jvd05vZGUoYmxvY2sudywgYmxvY2suaCkNCiAgfQ0KDQogIC8qKg0KICAgKiBUaGUgYWRkQmxvY2sgbWV0aG9kLg0KICAgKiBAcGFyYW0ge2FueX0gYmxvY2sgLSBUaGUgYmxvY2tzIHBhcmFtLg0KICAgKiBAcmV0dXJuIHthbnl9IC0gVGhlIHJldHVybiB2YWx1ZS4NCiAgICovDQogIGFkZEJsb2NrKGJsb2NrKSB7DQogICAgLy8gSW5pdGlhbGlzZSB0aGUgdHJlZSBpZiBhZGRpbmcgZmlyc3QgYmxvY2suDQogICAgaWYgKCF0aGlzLnJvb3QudXNlZCkgew0KICAgICAgaWYgKHRoaXMucm9vdC53IDwgYmxvY2sudykgdGhpcy5yb290LncgPSBibG9jay53Ow0KICAgICAgaWYgKHRoaXMucm9vdC5oIDwgYmxvY2suaCkgdGhpcy5yb290LmggPSBibG9jay5oOw0KICAgIH0NCiAgICBjb25zdCBub2RlID0gdGhpcy5maW5kTm9kZSh0aGlzLnJvb3QsIGJsb2NrLncsIGJsb2NrLmgpOw0KICAgIGlmIChub2RlKSByZXR1cm4gdGhpcy5zcGxpdE5vZGUobm9kZSwgYmxvY2sudywgYmxvY2suaCkNCiAgICBlbHNlIHJldHVybiB0aGlzLmdyb3dOb2RlKGJsb2NrLncsIGJsb2NrLmgpDQogIH0NCg0KICAvKioNCiAgICogVGhlIGZpbmROb2RlIG1ldGhvZC4NCiAgICogQHBhcmFtIHthbnl9IHJvb3QgLSBUaGUgcm9vdCBwYXJhbS4NCiAgICogQHBhcmFtIHtudW1iZXJ9IHcgLSBUaGUgdyBwYXJhbS4NCiAgICogQHBhcmFtIHtudW1iZXJ9IGggLSBUaGUgaCBwYXJhbS4NCiAgICogQHJldHVybiB7YW55fSAtIFRoZSByZXR1cm4gdmFsdWUuDQogICAqLw0KICBmaW5kTm9kZShyb290LCB3LCBoKSB7DQogICAgaWYgKHJvb3QudXNlZCkNCiAgICAgIHJldHVybiB0aGlzLmZpbmROb2RlKHJvb3QucmlnaHQsIHcsIGgpIHx8IHRoaXMuZmluZE5vZGUocm9vdC5kb3duLCB3LCBoKQ0KICAgIGVsc2UgaWYgKHcgPD0gcm9vdC53ICYmIGggPD0gcm9vdC5oKSByZXR1cm4gcm9vdA0KICAgIGVsc2UgcmV0dXJuIG51bGwNCiAgfQ0KDQogIC8qKg0KICAgKiBUaGUgc3BsaXROb2RlIG1ldGhvZC4NCiAgICogQHBhcmFtIHthbnl9IG5vZGUgLSBUaGUgbm9kZSBwYXJhbS4NCiAgICogQHBhcmFtIHtudW1iZXJ9IHcgLSBUaGUgdyBwYXJhbS4NCiAgICogQHBhcmFtIHtudW1iZXJ9IGggLSBUaGUgaCBwYXJhbS4NCiAgICogQHJldHVybiB7YW55fSAtIFRoZSByZXR1cm4gdmFsdWUuDQogICAqLw0KICBzcGxpdE5vZGUobm9kZSwgdywgaCkgew0KICAgIG5vZGUudXNlZCA9IHRydWU7DQogICAgbm9kZS5kb3duID0gew0KICAgICAgeDogbm9kZS54LA0KICAgICAgeTogbm9kZS55ICsgaCwNCiAgICAgIHc6IG5vZGUudywNCiAgICAgIGg6IG5vZGUuaCAtIGgsDQogICAgfTsNCiAgICBub2RlLnJpZ2h0ID0gew0KICAgICAgeDogbm9kZS54ICsgdywNCiAgICAgIHk6IG5vZGUueSwNCiAgICAgIHc6IG5vZGUudyAtIHcsDQogICAgICBoOiBoLA0KICAgIH07DQogICAgcmV0dXJuIG5vZGUNCiAgfQ0KDQogIC8qKg0KICAgKiBUaGUgZ3Jvd05vZGUgbWV0aG9kLg0KICAgKiBAcGFyYW0ge251bWJlcn0gdyAtIFRoZSB3IHBhcmFtLg0KICAgKiBAcGFyYW0ge251bWJlcn0gaCAtIFRoZSBoIHBhcmFtLg0KICAgKiBAcmV0dXJuIHthbnl9IC0gVGhlIHJldHVybiB2YWx1ZS4NCiAgICovDQogIGdyb3dOb2RlKHcsIGgpIHsNCiAgICBjb25zdCBjYW5Hcm93RG93biA9IHcgPD0gdGhpcy5yb290Lnc7DQogICAgY29uc3QgY2FuR3Jvd1JpZ2h0ID0gaCA8PSB0aGlzLnJvb3QuaDsNCg0KICAgIGNvbnN0IHNob3VsZEdyb3dSaWdodCA9IGNhbkdyb3dSaWdodCAmJiB0aGlzLnJvb3QuaCA+PSB0aGlzLnJvb3QudyArIHc7IC8vIGF0dGVtcHQgdG8ga2VlcCBzcXVhcmUtaXNoIGJ5IGdyb3dpbmcgcmlnaHQgd2hlbiBoZWlnaHQgaXMgbXVjaCBncmVhdGVyIHRoYW4gd2lkdGgNCiAgICBjb25zdCBzaG91bGRHcm93RG93biA9IGNhbkdyb3dEb3duICYmIHRoaXMucm9vdC53ID49IHRoaXMucm9vdC5oICsgaDsgLy8gYXR0ZW1wdCB0byBrZWVwIHNxdWFyZS1pc2ggYnkgZ3Jvd2luZyBkb3duICB3aGVuIHdpZHRoICBpcyBtdWNoIGdyZWF0ZXIgdGhhbiBoZWlnaHQNCg0KICAgIGlmIChzaG91bGRHcm93UmlnaHQpIHJldHVybiB0aGlzLmdyb3dSaWdodCh3LCBoKQ0KICAgIGVsc2UgaWYgKHNob3VsZEdyb3dEb3duKSByZXR1cm4gdGhpcy5ncm93RG93bih3LCBoKQ0KICAgIGVsc2UgaWYgKGNhbkdyb3dSaWdodCkgcmV0dXJuIHRoaXMuZ3Jvd1JpZ2h0KHcsIGgpDQogICAgZWxzZSBpZiAoY2FuR3Jvd0Rvd24pIHJldHVybiB0aGlzLmdyb3dEb3duKHcsIGgpDQogICAgZWxzZSByZXR1cm4gbnVsbCAvLyBuZWVkIHRvIGVuc3VyZSBzZW5zaWJsZSByb290IHN0YXJ0aW5nIHNpemUgdG8gYXZvaWQgdGhpcyBoYXBwZW5pbmcNCiAgfQ0KDQogIC8qKg0KICAgKiBUaGUgZ3Jvd1JpZ2h0IG1ldGhvZC4NCiAgICogQHBhcmFtIHtudW1iZXJ9IHcgLSBUaGUgdyBwYXJhbS4NCiAgICogQHBhcmFtIHtudW1iZXJ9IGggLSBUaGUgaCBwYXJhbS4NCiAgICogQHJldHVybiB7YW55fSAtIFRoZSByZXR1cm4gdmFsdWUuDQogICAqLw0KICBncm93UmlnaHQodywgaCkgew0KICAgIHRoaXMucm9vdCA9IHsNCiAgICAgIHVzZWQ6IHRydWUsDQogICAgICB4OiAwLA0KICAgICAgeTogMCwNCiAgICAgIHc6IHRoaXMucm9vdC53ICsgdywNCiAgICAgIGg6IHRoaXMucm9vdC5oLA0KICAgICAgZG93bjogdGhpcy5yb290LA0KICAgICAgcmlnaHQ6IHsNCiAgICAgICAgeDogdGhpcy5yb290LncsDQogICAgICAgIHk6IDAsDQogICAgICAgIHc6IHcsDQogICAgICAgIGg6IHRoaXMucm9vdC5oLA0KICAgICAgfSwNCiAgICB9Ow0KICAgIGNvbnN0IG5vZGUgPSB0aGlzLmZpbmROb2RlKHRoaXMucm9vdCwgdywgaCk7DQogICAgbGV0IHJlczsNCiAgICBpZiAobm9kZSkgcmVzID0gdGhpcy5zcGxpdE5vZGUobm9kZSwgdywgaCk7DQogICAgLy8gdGhpcy5yZXNpemVkLmVtaXQodGhpcy5yb290LncsIHRoaXMucm9vdC5oKTsNCiAgICByZXR1cm4gcmVzDQogIH0NCg0KICAvKioNCiAgICogVGhlIGdyb3dEb3duIG1ldGhvZC4NCiAgICogQHBhcmFtIHtudW1iZXJ9IHcgLSBUaGUgdyBwYXJhbS4NCiAgICogQHBhcmFtIHtudW1iZXJ9IGggLSBUaGUgaCBwYXJhbS4NCiAgICogQHJldHVybiB7YW55fSAtIFRoZSByZXR1cm4gdmFsdWUuDQogICAqLw0KICBncm93RG93bih3LCBoKSB7DQogICAgdGhpcy5yb290ID0gew0KICAgICAgdXNlZDogdHJ1ZSwNCiAgICAgIHg6IDAsDQogICAgICB5OiAwLA0KICAgICAgdzogdGhpcy5yb290LncsDQogICAgICBoOiB0aGlzLnJvb3QuaCArIGgsDQogICAgICBkb3duOiB7DQogICAgICAgIHg6IDAsDQogICAgICAgIHk6IHRoaXMucm9vdC5oLA0KICAgICAgICB3OiB0aGlzLnJvb3QudywNCiAgICAgICAgaDogaCwNCiAgICAgIH0sDQogICAgICByaWdodDogdGhpcy5yb290LA0KICAgIH07DQogICAgY29uc3Qgbm9kZSA9IHRoaXMuZmluZE5vZGUodGhpcy5yb290LCB3LCBoKTsNCiAgICBsZXQgcmVzOw0KICAgIGlmIChub2RlKSByZXMgPSB0aGlzLnNwbGl0Tm9kZShub2RlLCB3LCBoKTsNCiAgICAvLyB0aGlzLnJlc2l6ZWQuZW1pdCh0aGlzLnJvb3QudywgdGhpcy5yb290LmgpOw0KICAgIHJldHVybiByZXMNCiAgfQ0KfQoKLy8gaW1wb3J0IHsNCi8vICAgICBWZWMyLA0KLy8gICAgIFZlYzMsDQovLyAgICAgUXVhdCwNCi8vICAgICBDb2xvciwNCi8vICAgICBCb3gyLA0KLy8gICAgIEJveDMNCi8vIH0gZnJvbSAnLi4vTWF0aCc7DQoNCmNvbnN0IGRlY29kZTE2Qml0RmxvYXQgPSBoID0+IHsNCiAgY29uc3QgcyA9IChoICYgMHg4MDAwKSA+PiAxNTsNCiAgY29uc3QgZSA9IChoICYgMHg3YzAwKSA+PiAxMDsNCiAgY29uc3QgZiA9IGggJiAweDAzZmY7DQoNCiAgaWYgKGUgPT0gMCkgew0KICAgIHJldHVybiAocyA/IC0xIDogMSkgKiBNYXRoLnBvdygyLCAtMTQpICogKGYgLyBNYXRoLnBvdygyLCAxMCkpDQogIH0gZWxzZSBpZiAoZSA9PSAweDFmKSB7DQogICAgcmV0dXJuIGYgPyBOYU4gOiAocyA/IC0xIDogMSkgKiBJbmZpbml0eQ0KICB9DQoNCiAgcmV0dXJuIChzID8gLTEgOiAxKSAqIE1hdGgucG93KDIsIGUgLSAxNSkgKiAoMSArIGYgLyBNYXRoLnBvdygyLCAxMCkpDQp9Ow0KDQovKiogQ2xhc3MgcmVwcmVzZW50aW5nIGEgYmluIHJlYWRlci4gDQogKiBAaWdub3JlDQoqLw0KY2xhc3MgQmluUmVhZGVyIHsNCiAgLyoqDQogICAqIENyZWF0ZSBhIGJpbiByZWFkZXIuDQogICAqIEBwYXJhbSB7QnVmZmVyfSBkYXRhIC0gVGhlIGRhdGEgYnVmZmVyLg0KICAgKiBAcGFyYW0ge251bWJlcn0gYnl0ZU9mZnNldCAtIFRoZSBieXRlIG9mZnNldCB2YWx1ZSB0byBzdGFydCByZWFkaW5nIHRoZSBidWZmZXIuDQogICAqIEBwYXJhbSB7Ym9vbGVhbn0gaXNNb2JpbGVEZXZpY2UgLSBUaGUgaXNNb2JpbGVEZXZpY2UgdmFsdWUuDQogICAqLw0KICBjb25zdHJ1Y3RvcihkYXRhLCBieXRlT2Zmc2V0ID0gMCwgaXNNb2JpbGVEZXZpY2UgPSB0cnVlKSB7DQogICAgdGhpcy5fX2RhdGEgPSBkYXRhOw0KICAgIHRoaXMuX19ieXRlT2Zmc2V0ID0gYnl0ZU9mZnNldDsNCiAgICB0aGlzLl9fZGF0YVZpZXcgPSBuZXcgRGF0YVZpZXcodGhpcy5fX2RhdGEpOw0KICAgIHRoaXMuX19pc01vYmlsZURldmljZSA9IGlzTW9iaWxlRGV2aWNlOw0KICAgIHRoaXMudXRmOGRlY29kZXIgPSBuZXcgVGV4dERlY29kZXIoKTsNCiAgfQ0KDQogIC8qKg0KICAgKiBHZXR0ZXIgZm9yIGlzTW9iaWxlRGV2aWNlLg0KICAgKiBAcmV0dXJuIHtCb29sZWFufSAtIFJldHVybnMgdHJ1ZSBpcyBhIG1vYmlsZSBkZXZpY2UgaXMgZGV0ZWN0ZWQuDQogICAqLw0KICBnZXQgaXNNb2JpbGVEZXZpY2UoKSB7DQogICAgcmV0dXJuIHRoaXMuX19pc01vYmlsZURldmljZQ0KICB9DQoNCiAgLyoqDQogICAqIEdldHRlciBmb3IgZGF0YS4NCiAgICogQHJldHVybiB7QnVmZmVyfSAtIFRoZSBkYXRhIGJ1ZmZlciB3ZSBhcmUgcmVhZGluZyBmcm9tLA0KICAgKi8NCiAgZ2V0IGRhdGEoKSB7DQogICAgcmV0dXJuIHRoaXMuX19kYXRhDQogIH0NCg0KICAvKioNCiAgICogR2V0dGVyIGZvciBieXRlTGVuZ3RoLg0KICAgKiBAcmV0dXJuIHtudW1iZXJ9IC0gVGhlIHRvdGFsIGxlbmd0aCBvZiB0aGUgYnVmZmVyDQogICAqLw0KICBnZXQgYnl0ZUxlbmd0aCgpIHsNCiAgICByZXR1cm4gdGhpcy5fX2RhdGFWaWV3LmJ5dGVMZW5ndGgNCiAgfQ0KDQogIC8qKg0KICAgKiBHZXR0ZXIgZm9yIHJlbWFpbmluZ0J5dGVMZW5ndGguDQogICAqIEByZXR1cm4ge251bWJlcn0gLSBUaGUgcmVlbWFpbmluZyBsZW5ndGggb2YgdGhlIGJ1ZmZlciB0byByZWFkLg0KICAgKi8NCiAgZ2V0IHJlbWFpbmluZ0J5dGVMZW5ndGgoKSB7DQogICAgcmV0dXJuIHRoaXMuX19kYXRhVmlldy5ieXRlTGVuZ3RoIC0gdGhpcy5fX2J5dGVPZmZzZXQNCiAgfQ0KDQogIC8qKg0KICAgKiBUaGUgcG9zIG1ldGhvZC4NCiAgICogQHJldHVybiB7bnVtYmVyfSAtIFRoZSBjdXJyZW50IG9mZnNldCBpbiB0aGUgYmluYXJ5IGJ1ZmZlcg0KICAgKi8NCiAgcG9zKCkgew0KICAgIHJldHVybiB0aGlzLl9fYnl0ZU9mZnNldA0KICB9DQoNCiAgLyoqDQogICAqIFRoZSBzZWVrIG1ldGhvZC4NCiAgICogQHBhcmFtIHtudW1iZXJ9IGJ5dGVPZmZzZXQgLSBUaGUgYnl0ZU9mZnNldCBwYXJhbS4NCiAgICovDQogIHNlZWsoYnl0ZU9mZnNldCkgew0KICAgIHRoaXMuX19ieXRlT2Zmc2V0ID0gYnl0ZU9mZnNldDsNCiAgfQ0KDQogIC8qKg0KICAgKiBUaGUgYWR2YW5jZSBtZXRob2QuDQogICAqIEBwYXJhbSB7bnVtYmVyfSBieXRlT2Zmc2V0IC0gVGhlIGJ5dGUgT2Zmc2V0IGFtb3VudC4NCiAgICovDQogIGFkdmFuY2UoYnl0ZU9mZnNldCkgew0KICAgIHRoaXMuX19ieXRlT2Zmc2V0ICs9IGJ5dGVPZmZzZXQ7DQogIH0NCg0KICAvKioNCiAgICogVGhlIGxvYWRVSW50OCBtZXRob2QuDQogICAqIEByZXR1cm4ge251bWJlcn0gLSBUaGUgcmV0dXJuIHZhbHVlLg0KICAgKi8NCiAgbG9hZFVJbnQ4KCkgew0KICAgIGNvbnN0IHJlc3VsdCA9IHRoaXMuX19kYXRhVmlldy5nZXRVaW50OCh0aGlzLl9fYnl0ZU9mZnNldCk7DQogICAgdGhpcy5fX2J5dGVPZmZzZXQgKz0gMTsNCiAgICByZXR1cm4gcmVzdWx0DQogIH0NCg0KICAvKioNCiAgICogVGhlIGxvYWRVSW50MTYgbWV0aG9kLg0KICAgKiBAcmV0dXJuIHtudW1iZXJ9IC0gVGhlIHJldHVybiB2YWx1ZS4NCiAgICovDQogIGxvYWRVSW50MTYoKSB7DQogICAgY29uc3QgcmVzdWx0ID0gdGhpcy5fX2RhdGFWaWV3LmdldFVpbnQxNih0aGlzLl9fYnl0ZU9mZnNldCwgdHJ1ZSk7DQogICAgdGhpcy5fX2J5dGVPZmZzZXQgKz0gMjsNCiAgICByZXR1cm4gcmVzdWx0DQogIH0NCg0KDQogIC8qKg0KICAgKiBUaGUgbG9hZFVJbnQzMiBtZXRob2QuDQogICAqIEByZXR1cm4ge251bWJlcn0gLSBUaGUgcmV0dXJuIHZhbHVlLg0KICAgKi8NCiAgbG9hZFVJbnQzMigpIHsNCiAgICBjb25zdCByZXN1bHQgPSB0aGlzLl9fZGF0YVZpZXcuZ2V0VWludDMyKHRoaXMuX19ieXRlT2Zmc2V0LCB0cnVlKTsNCiAgICB0aGlzLl9fYnl0ZU9mZnNldCArPSA0Ow0KICAgIHJldHVybiByZXN1bHQNCiAgfQ0KDQogIC8qKg0KICAgKiBUaGUgbG9hZFNJbnQzMiBtZXRob2QuDQogICAqIEByZXR1cm4ge251bWJlcn0gLSBUaGUgcmV0dXJuIHZhbHVlLg0KICAgKi8NCiAgbG9hZFNJbnQzMigpIHsNCiAgICBjb25zdCByZXN1bHQgPSB0aGlzLl9fZGF0YVZpZXcuZ2V0SW50MzIodGhpcy5fX2J5dGVPZmZzZXQsIHRydWUpOw0KICAgIHRoaXMuX19ieXRlT2Zmc2V0ICs9IDQ7DQogICAgcmV0dXJuIHJlc3VsdA0KICB9DQoNCiAgLyoqDQogICAqIFRoZSBsb2FkRmxvYXQxNiBtZXRob2QuDQogICAqIEByZXR1cm4ge251bWJlcn0gLSBUaGUgcmV0dXJuIHZhbHVlLg0KICAgKi8NCiAgbG9hZEZsb2F0MTYoKSB7DQogICAgY29uc3QgdWludDE2ID0gdGhpcy5sb2FkVUludDE2KCk7DQogICAgcmV0dXJuIGRlY29kZTE2Qml0RmxvYXQodWludDE2KQ0KICB9DQoNCiAgLyoqDQogICAqIFRoZSBsb2FkVUZsb2F0MTYgcmV0dXJucyBhIGZsb2F0IHdoZXJlIHRoZSBzaWduIGJpZyBpbmRpY2F0ZXMgaXQgaXMgPiAyMDEuDQogICAqIEByZXR1cm4ge251bWJlcn0gLSBUaGUgcmV0dXJuIHZhbHVlLg0KICAgKi8NCiAgbG9hZFVGbG9hdDE2KCkgew0KICAgIGNvbnN0IHJlc3VsdCA9IHRoaXMubG9hZEZsb2F0MTYoKTsNCiAgICBpZiAocmVzdWx0IDwgMC4wKSB7DQogICAgICByZXR1cm4gMjA0OC4wIC0gcmVzdWx0IC8vIE5vdGU6IHN1YnRyYWN0IGEgbmVnYXRpdmUgbnVtYmVyIHRvIGFkZCBpdC4NCiAgICB9IGVsc2Ugew0KICAgICAgcmV0dXJuIHJlc3VsdA0KICAgIH0NCiAgfQ0KDQogIC8qKg0KICAgKiBUaGUgbG9hZEZsb2F0MTZGcm9tMnhVSW50OCBtZXRob2QuDQogICAqIEByZXR1cm4ge251bWJlcn0gLSBUaGUgcmV0dXJuIHZhbHVlLg0KICAgKi8NCiAgbG9hZEZsb2F0MTZGcm9tMnhVSW50OCgpIHsNCiAgICBjb25zdCByZXN1bHQgPSB0aGlzLl9fZGF0YVZpZXcuZ2V0RmxvYXQxNih0aGlzLl9fYnl0ZU9mZnNldCwgdHJ1ZSk7DQogICAgLy8gY29uc3QgdWludDhzID0gdGhpcy5sb2FkVUludDhBcnJheSgyKTsNCiAgICAvLyByZXR1cm4gZGVjb2RlMTZCaXRGbG9hdCh1aW50OHMpOw0KICAgIHRoaXMuX19ieXRlT2Zmc2V0ICs9IDI7DQogICAgcmV0dXJuIHJlc3VsdA0KICB9DQoNCiAgLyoqDQogICAqIFRoZSBsb2FkVUludDMyRnJvbTJ4VUZsb2F0MTYgbG9hZHMgYSBzaW5nbGUgU2lnbmVkIGludGVnZXIgdmFsdWUgZnJvbSAyIFVuc2lnbmVkIEZsb2F0MTYgdmFsdWVzLg0KICAgKiBAcmV0dXJuIHtudW1iZXJ9IC0gVGhlIHJldHVybiB2YWx1ZS4NCiAgICovDQogIGxvYWRVSW50MzJGcm9tMnhVRmxvYXQxNigpIHsNCiAgICBjb25zdCBwYXJ0QSA9IHRoaXMubG9hZFVGbG9hdDE2KCk7DQogICAgY29uc3QgcGFydEIgPSB0aGlzLmxvYWRVRmxvYXQxNigpOw0KICAgIHJldHVybiBwYXJ0QSArIHBhcnRCICogNDA5Ng0KICB9DQoNCiAgLyoqDQogICAqIFRoZSBsb2FkU0ludDMyRnJvbTJ4RmxvYXQxNiBsb2FkcyBhIHNpbmdsZSBTaWduZWQgaW50ZWdlciB2YWx1ZSBmcm9tIDIgc2lnbmVkIEZsb2F0MTYgdmFsdWVzLg0KICAgKiBAcmV0dXJuIHtudW1iZXJ9IC0gVGhlIHJldHVybiB2YWx1ZS4NCiAgICovDQogIGxvYWRTSW50MzJGcm9tMnhGbG9hdDE2KCkgew0KICAgIGNvbnN0IHBhcnRBID0gdGhpcy5sb2FkRmxvYXQxNigpOw0KICAgIGNvbnN0IHBhcnRCID0gdGhpcy5sb2FkRmxvYXQxNigpOw0KICAgIHJldHVybiBwYXJ0QSArIHBhcnRCICogMjA0OA0KICB9DQoNCg0KICAvKioNCiAgICogVGhlIGxvYWRGbG9hdDMyIG1ldGhvZC4NCiAgICogQHJldHVybiB7YW55fSAtIFRoZSByZXR1cm4gdmFsdWUuDQogICAqLw0KICBsb2FkRmxvYXQzMigpIHsNCiAgICBjb25zdCByZXN1bHQgPSB0aGlzLl9fZGF0YVZpZXcuZ2V0RmxvYXQzMih0aGlzLl9fYnl0ZU9mZnNldCwgdHJ1ZSk7DQogICAgdGhpcy5fX2J5dGVPZmZzZXQgKz0gNDsNCiAgICByZXR1cm4gcmVzdWx0DQogIH0NCg0KICAvKioNCiAgICogVGhlIGxvYWRGbG9hdDMyIG1ldGhvZC4NCiAgICogQHBhcmFtIHthbnl9IHNpemUgLSBUaGUgc2l6ZSBwYXJhbS4NCiAgICogQHBhcmFtIHtib29sZWFufSBjbG9uZSAtIFRoZSBjbG9uZSBwYXJhbS4NCiAgICogQHJldHVybiB7YW55fSAtIFRoZSByZXR1cm4gdmFsdWUuDQogICAqLw0KICBsb2FkVUludDhBcnJheShzaXplID0gdW5kZWZpbmVkLCBjbG9uZSA9IGZhbHNlKSB7DQogICAgaWYgKHNpemUgPT0gdW5kZWZpbmVkKSBzaXplID0gdGhpcy5sb2FkVUludDMyKCk7DQogICAgY29uc3QgcmVzdWx0ID0gbmV3IFVpbnQ4QXJyYXkodGhpcy5fX2RhdGEsIHRoaXMuX19ieXRlT2Zmc2V0LCBzaXplKTsNCiAgICB0aGlzLl9fYnl0ZU9mZnNldCArPSBzaXplOw0KICAgIGNvbnN0IHBhZGQgPSB0aGlzLl9fYnl0ZU9mZnNldCAlIDQ7DQogICAgLy8gdGhpcy5yZWFkUGFkZCgpOw0KICAgIHJldHVybiByZXN1bHQNCiAgfQ0KDQogIC8qKg0KICAgKiBUaGUgbG9hZFVJbnQxNkFycmF5IG1ldGhvZC4NCiAgICogQHBhcmFtIHthbnl9IHNpemUgLSBUaGUgc2l6ZSBwYXJhbS4NCiAgICogQHBhcmFtIHtib29sZWFufSBjbG9uZSAtIFRoZSBjbG9uZSBwYXJhbS4NCiAgICogQHJldHVybiB7YW55fSAtIFRoZSByZXR1cm4gdmFsdWUuDQogICAqLw0KICBsb2FkVUludDE2QXJyYXkoc2l6ZSA9IHVuZGVmaW5lZCwgY2xvbmUgPSBmYWxzZSkgew0KICAgIGlmIChzaXplID09IHVuZGVmaW5lZCkgc2l6ZSA9IHRoaXMubG9hZFVJbnQzMigpOw0KICAgIGlmIChzaXplID09IDApIHJldHVybiBuZXcgVWludDE2QXJyYXkoKQ0KICAgIHRoaXMucmVhZFBhZGQoMik7DQogICAgbGV0IHJlc3VsdDsNCiAgICBpZiAodGhpcy5fX2lzTW9iaWxlRGV2aWNlKSB7DQogICAgICByZXN1bHQgPSBuZXcgVWludDE2QXJyYXkoc2l6ZSk7DQogICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHNpemU7IGkrKykgew0KICAgICAgICByZXN1bHRbaV0gPSB0aGlzLl9fZGF0YVZpZXcuZ2V0VWludDE2KHRoaXMuX19ieXRlT2Zmc2V0LCB0cnVlKTsNCiAgICAgICAgdGhpcy5fX2J5dGVPZmZzZXQgKz0gMjsNCiAgICAgIH0NCiAgICB9IGVsc2Ugew0KICAgICAgcmVzdWx0ID0gbmV3IFVpbnQxNkFycmF5KHRoaXMuX19kYXRhLCB0aGlzLl9fYnl0ZU9mZnNldCwgc2l6ZSk7DQogICAgICB0aGlzLl9fYnl0ZU9mZnNldCArPSBzaXplICogMjsNCiAgICB9DQogICAgLy8gdGhpcy5yZWFkUGFkZCgpOw0KICAgIHJldHVybiByZXN1bHQNCiAgfQ0KDQogIC8qKg0KICAgKiBUaGUgbG9hZFVJbnQzMkFycmF5IG1ldGhvZC4NCiAgICogQHBhcmFtIHthbnl9IHNpemUgLSBUaGUgc2l6ZSBwYXJhbS4NCiAgICogQHBhcmFtIHtib29sZWFufSBjbG9uZSAtIFRoZSBjbG9uZSBwYXJhbS4NCiAgICogQHJldHVybiB7YW55fSAtIFRoZSByZXR1cm4gdmFsdWUuDQogICAqLw0KICBsb2FkVUludDMyQXJyYXkoc2l6ZSA9IHVuZGVmaW5lZCwgY2xvbmUgPSBmYWxzZSkgew0KICAgIGlmIChzaXplID09IHVuZGVmaW5lZCkgc2l6ZSA9IHRoaXMubG9hZFVJbnQzMigpOw0KICAgIGlmIChzaXplID09IDApIHJldHVybiBuZXcgVWludDMyQXJyYXkoKQ0KICAgIHRoaXMucmVhZFBhZGQoNCk7DQogICAgbGV0IHJlc3VsdDsNCiAgICBpZiAodGhpcy5fX2lzTW9iaWxlRGV2aWNlKSB7DQogICAgICByZXN1bHQgPSBuZXcgVWludDMyQXJyYXkoc2l6ZSk7DQogICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHNpemU7IGkrKykgew0KICAgICAgICByZXN1bHRbaV0gPSB0aGlzLl9fZGF0YVZpZXcuZ2V0VWludDMyKHRoaXMuX19ieXRlT2Zmc2V0LCB0cnVlKTsNCiAgICAgICAgdGhpcy5fX2J5dGVPZmZzZXQgKz0gNDsNCiAgICAgIH0NCiAgICB9IGVsc2Ugew0KICAgICAgcmVzdWx0ID0gbmV3IFVpbnQzMkFycmF5KHRoaXMuX19kYXRhLCB0aGlzLl9fYnl0ZU9mZnNldCwgc2l6ZSk7DQogICAgICB0aGlzLl9fYnl0ZU9mZnNldCArPSBzaXplICogNDsNCiAgICB9DQogICAgcmV0dXJuIHJlc3VsdA0KICB9DQoNCiAgLyoqDQogICAqIFRoZSBsb2FkRmxvYXQzMkFycmF5IG1ldGhvZC4NCiAgICogQHBhcmFtIHthbnl9IHNpemUgLSBUaGUgc2l6ZSBwYXJhbS4NCiAgICogQHBhcmFtIHtib29sZWFufSBjbG9uZSAtIFRoZSBjbG9uZSBwYXJhbS4NCiAgICogQHJldHVybiB7YW55fSAtIFRoZSByZXR1cm4gdmFsdWUuDQogICAqLw0KICBsb2FkRmxvYXQzMkFycmF5KHNpemUgPSB1bmRlZmluZWQsIGNsb25lID0gZmFsc2UpIHsNCiAgICBpZiAoc2l6ZSA9PSB1bmRlZmluZWQpIHNpemUgPSB0aGlzLmxvYWRVSW50MzIoKTsNCiAgICBpZiAoc2l6ZSA9PSAwKSByZXR1cm4gbmV3IEZsb2F0MzJBcnJheSgpDQogICAgdGhpcy5yZWFkUGFkZCg0KTsNCiAgICBsZXQgcmVzdWx0Ow0KICAgIGlmICh0aGlzLl9faXNNb2JpbGVEZXZpY2UpIHsNCiAgICAgIHJlc3VsdCA9IG5ldyBGbG9hdDMyQXJyYXkoc2l6ZSk7DQogICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHNpemU7IGkrKykgew0KICAgICAgICByZXN1bHRbaV0gPSB0aGlzLl9fZGF0YVZpZXcuZ2V0RmxvYXQzMih0aGlzLl9fYnl0ZU9mZnNldCwgdHJ1ZSk7DQogICAgICAgIHRoaXMuX19ieXRlT2Zmc2V0ICs9IDQ7DQogICAgICB9DQogICAgfSBlbHNlIHsNCiAgICAgIHJlc3VsdCA9IG5ldyBGbG9hdDMyQXJyYXkodGhpcy5fX2RhdGEsIHRoaXMuX19ieXRlT2Zmc2V0LCBzaXplKTsNCiAgICAgIHRoaXMuX19ieXRlT2Zmc2V0ICs9IHNpemUgKiA0Ow0KICAgIH0NCiAgICByZXR1cm4gcmVzdWx0DQogIH0NCg0KICAvKioNCiAgICogVGhlIGxvYWRTdHIgbWV0aG9kLg0KICAgKiBAcmV0dXJuIHtzdHJpbmd9IC0gVGhlIHJldHVybiB2YWx1ZS4NCiAgICovDQogIGxvYWRTdHIoKSB7DQogICAgY29uc3QgbnVtQ2hhcnMgPSB0aGlzLmxvYWRVSW50MzIoKTsNCiAgICBjb25zdCBjaGFycyA9IG5ldyBVaW50OEFycmF5KHRoaXMuX19kYXRhLCB0aGlzLl9fYnl0ZU9mZnNldCwgbnVtQ2hhcnMpOw0KICAgIHRoaXMuX19ieXRlT2Zmc2V0ICs9IG51bUNoYXJzOw0KICAgIGxldCByZXN1bHQgPSAnJzsNCiAgICBmb3IgKGxldCBpID0gMDsgaSA8IG51bUNoYXJzOyBpKyspDQogICAgICByZXN1bHQgPSByZXN1bHQgKyBTdHJpbmcuZnJvbUNoYXJDb2RlKGNoYXJzW2ldKTsNCiAgICByZXR1cm4gcmVzdWx0DQogIH0NCg0KICAvKioNCiAgICAqIFRoZSBsb2FkU3RyQXJyYXkgbWV0aG9kLg0KICAgICogQHJldHVybiB7YXJyYXl9IC0gVGhlIHJldHVybiB2YWx1ZS4NCiAgICAqLw0KICAgbG9hZFN0ckFycmF5KCkgew0KICAgIGNvbnN0IHNpemUgPSB0aGlzLmxvYWRVSW50MzIoKTsNCiAgICBjb25zdCByZXN1bHQgPSBbXTsNCiAgICBmb3IgKGxldCBpID0gMDsgaSA8IHNpemU7IGkrKykgew0KICAgICAgcmVzdWx0W2ldID0gdGhpcy5sb2FkU3RyKCk7DQogICAgfQ0KICAgIHJldHVybiByZXN1bHQNCiAgfQ0KDQogIC8vIGxvYWRTSW50MzJWZWMyKCkgew0KICAvLyAgICAgY29uc3QgeCA9IHRoaXMubG9hZFNJbnQzMigpOw0KICAvLyAgICAgY29uc3QgeSA9IHRoaXMubG9hZFNJbnQzMigpOw0KICAvLyAgICAgcmV0dXJuIG5ldyBWZWMyKHgsIHkpOw0KICAvLyB9DQoNCiAgLy8gbG9hZFVJbnQzMlZlYzIoKSB7DQogIC8vICAgICBjb25zdCB4ID0gdGhpcy5sb2FkVUludDMyKCk7DQogIC8vICAgICBjb25zdCB5ID0gdGhpcy5sb2FkVUludDMyKCk7DQogIC8vICAgICByZXR1cm4gbmV3IFZlYzIoeCwgeSk7DQogIC8vIH0NCg0KICAvLyBsb2FkRmxvYXQxNlZlYzIoKSB7DQogIC8vICAgICBjb25zdCB4ID0gdGhpcy5sb2FkRmxvYXQxNigpOw0KICAvLyAgICAgY29uc3QgeSA9IHRoaXMubG9hZEZsb2F0MTYoKTsNCiAgLy8gICAgIHJldHVybiBuZXcgVmVjMih4LCB5KTsNCiAgLy8gfQ0KDQogIC8vIGxvYWRGbG9hdDMyVmVjMigpIHsNCiAgLy8gICAgIGNvbnN0IHggPSB0aGlzLmxvYWRGbG9hdDMyKCk7DQogIC8vICAgICBjb25zdCB5ID0gdGhpcy5sb2FkRmxvYXQzMigpOw0KICAvLyAgICAgcmV0dXJuIG5ldyBWZWMyKHgsIHkpOw0KICAvLyB9DQoNCiAgLy8gbG9hZEZsb2F0MTZWZWMzKCkgew0KICAvLyAgICAgY29uc3QgeCA9IHRoaXMubG9hZEZsb2F0MTYoKTsNCiAgLy8gICAgIGNvbnN0IHkgPSB0aGlzLmxvYWRGbG9hdDE2KCk7DQogIC8vICAgICBjb25zdCB6ID0gdGhpcy5sb2FkRmxvYXQxNigpOw0KICAvLyAgICAgcmV0dXJuIG5ldyBWZWMzKHgsIHksIHopOw0KICAvLyB9DQoNCiAgLy8gbG9hZEZsb2F0MzJWZWMzKCkgew0KICAvLyAgICAgY29uc3QgeCA9IHRoaXMubG9hZEZsb2F0MzIoKTsNCiAgLy8gICAgIGNvbnN0IHkgPSB0aGlzLmxvYWRGbG9hdDMyKCk7DQogIC8vICAgICBjb25zdCB6ID0gdGhpcy5sb2FkRmxvYXQzMigpOw0KICAvLyAgICAgcmV0dXJuIG5ldyBWZWMzKHgsIHksIHopOw0KICAvLyB9DQoNCiAgLy8gbG9hZEZsb2F0MTZRdWF0KCkgew0KICAvLyAgICAgY29uc3QgeCA9IHRoaXMubG9hZEZsb2F0MTYoKTsNCiAgLy8gICAgIGNvbnN0IHkgPSB0aGlzLmxvYWRGbG9hdDE2KCk7DQogIC8vICAgICBjb25zdCB6ID0gdGhpcy5sb2FkRmxvYXQxNigpOw0KICAvLyAgICAgY29uc3QgdyA9IHRoaXMubG9hZEZsb2F0MTYoKTsNCiAgLy8gICAgIHJldHVybiBuZXcgUXVhdCh4LCB5LCB6LCB3KTsNCiAgLy8gfQ0KDQogIC8vIGxvYWRGbG9hdDMyUXVhdCgpIHsNCiAgLy8gICAgIGNvbnN0IHggPSB0aGlzLmxvYWRGbG9hdDMyKCk7DQogIC8vICAgICBjb25zdCB5ID0gdGhpcy5sb2FkRmxvYXQzMigpOw0KICAvLyAgICAgY29uc3QgeiA9IHRoaXMubG9hZEZsb2F0MzIoKTsNCiAgLy8gICAgIGNvbnN0IHcgPSB0aGlzLmxvYWRGbG9hdDMyKCk7DQogIC8vICAgICByZXR1cm4gbmV3IFF1YXQoeCwgeSwgeiwgdyk7DQogIC8vIH0NCg0KICAvLyBsb2FkUkdCRmxvYXQzMkNvbG9yKCkgew0KICAvLyAgICAgY29uc3QgciA9IHRoaXMubG9hZEZsb2F0MzIoKTsNCiAgLy8gICAgIGNvbnN0IGcgPSB0aGlzLmxvYWRGbG9hdDMyKCk7DQogIC8vICAgICBjb25zdCBiID0gdGhpcy5sb2FkRmxvYXQzMigpOw0KICAvLyAgICAgcmV0dXJuIG5ldyBDb2xvcihyLCBnLCBiKTsNCiAgLy8gfQ0KDQogIC8vIGxvYWRSR0JBRmxvYXQzMkNvbG9yKCkgew0KICAvLyAgICAgY29uc3QgciA9IHRoaXMubG9hZEZsb2F0MzIoKTsNCiAgLy8gICAgIGNvbnN0IGcgPSB0aGlzLmxvYWRGbG9hdDMyKCk7DQogIC8vICAgICBjb25zdCBiID0gdGhpcy5sb2FkRmxvYXQzMigpOw0KICAvLyAgICAgY29uc3QgYSA9IHRoaXMubG9hZEZsb2F0MzIoKTsNCiAgLy8gICAgIHJldHVybiBuZXcgQ29sb3IociwgZywgYiwgYSk7DQogIC8vIH0NCg0KICAvLyBsb2FkUkdCVUludDhDb2xvcigpIHsNCiAgLy8gICAgIGNvbnN0IHIgPSB0aGlzLmxvYWRVSW50OCgpOw0KICAvLyAgICAgY29uc3QgZyA9IHRoaXMubG9hZFVJbnQ4KCk7DQogIC8vICAgICBjb25zdCBiID0gdGhpcy5sb2FkVUludDgoKTsNCiAgLy8gICAgIHJldHVybiBuZXcgQ29sb3IociAvIDI1NSwgZyAvIDI1NSwgYiAvIDI1NSk7DQogIC8vIH0NCg0KICAvLyBsb2FkUkdCQVVJbnQ4Q29sb3IoKSB7DQogIC8vICAgICBjb25zdCByID0gdGhpcy5sb2FkVUludDgoKTsNCiAgLy8gICAgIGNvbnN0IGcgPSB0aGlzLmxvYWRVSW50OCgpOw0KICAvLyAgICAgY29uc3QgYiA9IHRoaXMubG9hZFVJbnQ4KCk7DQogIC8vICAgICBjb25zdCBhID0gdGhpcy5sb2FkVUludDgoKTsNCiAgLy8gICAgIHJldHVybiBuZXcgQ29sb3IociAvIDI1NSwgZyAvIDI1NSwgYiAvIDI1NSwgYSAvIDI1NSk7DQogIC8vIH0NCg0KICAvLyBsb2FkQm94MigpIHsNCiAgLy8gICAgIHJldHVybiBuZXcgQm94Mih0aGlzLmxvYWRGbG9hdDMyVmVjMigpLCB0aGlzLmxvYWRGbG9hdDMyVmVjMigpKTsNCiAgLy8gfQ0KDQogIC8vIGxvYWRCb3gzKCkgew0KICAvLyAgICAgcmV0dXJuIG5ldyBCb3gzKHRoaXMubG9hZEZsb2F0MzJWZWMzKCksIHRoaXMubG9hZEZsb2F0MzJWZWMzKCkpOw0KICAvLyB9DQoNCiAgLyoqDQogICAqIFRoZSBsb2FkU3RyIG1ldGhvZC4NCiAgICogQHBhcmFtIHthbnl9IHN0cmlkZSAtIFRoZSBzdHJpZGUgcGFyYW0uDQogICAqLw0KICByZWFkUGFkZChzdHJpZGUpIHsNCiAgICBjb25zdCBwYWRkID0gdGhpcy5fX2J5dGVPZmZzZXQgJSBzdHJpZGU7DQogICAgaWYgKHBhZGQgIT0gMCkgdGhpcy5fX2J5dGVPZmZzZXQgKz0gc3RyaWRlIC0gcGFkZDsNCiAgfQ0KfQoKY29uc3QgQ0FEU3VyZmFjZVR5cGVzID0gew0KICBTVVJGQUNFX1RZUEVfUExBTkU6IDAsDQogIFNVUkZBQ0VfVFlQRV9DT05FOiAxLA0KICBTVVJGQUNFX1RZUEVfQ1lMSU5ERVI6IDIsDQogIFNVUkZBQ0VfVFlQRV9TUEhFUkU6IDMsDQogIFNVUkZBQ0VfVFlQRV9UT1JVUzogNCwNCiAgU1VSRkFDRV9UWVBFX0xJTkVBUl9FWFRSVVNJT046IDUsDQogIFNVUkZBQ0VfVFlQRV9SRVZPTFVUSU9OOiA2LA0KICAvLyAgU1VSRkFDRV9UWVBFX0JFWklFUl9TVVJGQUNFOiA3LA0KICBTVVJGQUNFX1RZUEVfTlVSQlNfU1VSRkFDRTogOCwNCiAgU1VSRkFDRV9UWVBFX09GRlNFVF9TVVJGQUNFOiA5LA0KICBTVVJGQUNFX1RZUEVfVFJJTU1FRF9SRUNUX1NVUkZBQ0U6IDEwLA0KICBTVVJGQUNFX1RZUEVfUE9MWV9QTEFORTogMTQsDQogIFNVUkZBQ0VfVFlQRV9GQU46IDE1LA0KICBTVVJGQUNFX1RZUEVfUkVWT0xVVElPTl9GTElQUEVEX0RPTUFJTjogMTYsDQp9Ow0KDQpjb25zdCBnZXRTdXJmYWNlVHlwZU5hbWUgPSBpZCA9PiB7DQogIHN3aXRjaCAoaWQpIHsNCiAgICBjYXNlIENBRFN1cmZhY2VUeXBlcy5TVVJGQUNFX1RZUEVfUExBTkU6DQogICAgICByZXR1cm4gJ1NVUkZBQ0VfVFlQRV9QTEFORScNCiAgICBjYXNlIENBRFN1cmZhY2VUeXBlcy5TVVJGQUNFX1RZUEVfQ09ORToNCiAgICAgIHJldHVybiAnU1VSRkFDRV9UWVBFX0NPTkUnDQogICAgY2FzZSBDQURTdXJmYWNlVHlwZXMuU1VSRkFDRV9UWVBFX0NZTElOREVSOg0KICAgICAgcmV0dXJuICdTVVJGQUNFX1RZUEVfQ1lMSU5ERVInDQogICAgY2FzZSBDQURTdXJmYWNlVHlwZXMuU1VSRkFDRV9UWVBFX1NQSEVSRToNCiAgICAgIHJldHVybiAnU1VSRkFDRV9UWVBFX1NQSEVSRScNCiAgICBjYXNlIENBRFN1cmZhY2VUeXBlcy5TVVJGQUNFX1RZUEVfVE9SVVM6DQogICAgICByZXR1cm4gJ1NVUkZBQ0VfVFlQRV9UT1JVUycNCiAgICBjYXNlIENBRFN1cmZhY2VUeXBlcy5TVVJGQUNFX1RZUEVfTElORUFSX0VYVFJVU0lPTjoNCiAgICAgIHJldHVybiAnU1VSRkFDRV9UWVBFX0xJTkVBUl9FWFRSVVNJT04nDQogICAgY2FzZSBDQURTdXJmYWNlVHlwZXMuU1VSRkFDRV9UWVBFX1JFVk9MVVRJT046DQogICAgICByZXR1cm4gJ1NVUkZBQ0VfVFlQRV9SRVZPTFVUSU9OJw0KICAgIC8vICAgIGNhc2UgQ0FEU3VyZmFjZVR5cGVzLlNVUkZBQ0VfVFlQRV9CRVpJRVJfU1VSRkFDRTogcmV0dXJuICdTVVJGQUNFX1RZUEVfQkVaSUVSX1NVUkZBQ0UnOw0KICAgIGNhc2UgQ0FEU3VyZmFjZVR5cGVzLlNVUkZBQ0VfVFlQRV9OVVJCU19TVVJGQUNFOg0KICAgICAgcmV0dXJuICdTVVJGQUNFX1RZUEVfTlVSQlNfU1VSRkFDRScNCiAgICBjYXNlIENBRFN1cmZhY2VUeXBlcy5TVVJGQUNFX1RZUEVfT0ZGU0VUX1NVUkZBQ0U6DQogICAgICByZXR1cm4gJ1NVUkZBQ0VfVFlQRV9PRkZTRVRfU1VSRkFDRScNCiAgICBjYXNlIENBRFN1cmZhY2VUeXBlcy5TVVJGQUNFX1RZUEVfVFJJTU1FRF9SRUNUX1NVUkZBQ0U6DQogICAgICByZXR1cm4gJ1NVUkZBQ0VfVFlQRV9UUklNTUVEX1JFQ1RfU1VSRkFDRScNCiAgICBjYXNlIENBRFN1cmZhY2VUeXBlcy5TVVJGQUNFX1RZUEVfUE9MWV9QTEFORToNCiAgICAgIHJldHVybiAnU1VSRkFDRV9UWVBFX1BPTFlfUExBTkUnDQogICAgY2FzZSBDQURTdXJmYWNlVHlwZXMuU1VSRkFDRV9UWVBFX0ZBTjoNCiAgICAgIHJldHVybiAnU1VSRkFDRV9UWVBFX0ZBTicNCiAgICBjYXNlIENBRFN1cmZhY2VUeXBlcy5TVVJGQUNFX1RZUEVfUkVWT0xVVElPTl9GTElQUEVEX0RPTUFJTjoNCiAgICAgIHJldHVybiAnU1VSRkFDRV9UWVBFX1JFVk9MVVRJT05fRkxJUFBFRF9ET01BSU4nDQogIH0NCn07DQoNCmNvbnN0IGdlb21MaWJyYXJ5SGVhZGVyU2l6ZSA9IDg7IC8vIDIgRlAxNiBwaXhlbHMgYXQgdGhlIHN0YXJ0IG9mIHRoZSBHZW9tTGlicmFyeSBhbmQgQ3VydmVMaWJyYXJ5DQpjb25zdCBwaXhlbHNQZXJEcmF3SXRlbSA9IDEwOyAvLyBUaGUgbnVtYmVyIG9mIFJHQkEgcGl4ZWxzIHBlciBkcmF3IGl0ZW0uDQpjb25zdCB2YWx1ZXNQZXJDdXJ2ZVRvY0l0ZW0gPSA4Ow0KY29uc3QgdmFsdWVzUGVyU3VyZmFjZVRvY0l0ZW0gPSA5Ow0KY29uc3QgdmFsdWVzUGVyQ3VydmVMaWJyYXJ5TGF5b3V0SXRlbSA9IDg7DQpjb25zdCB2YWx1ZXNQZXJTdXJmYWNlTGlicmFyeUxheW91dEl0ZW0gPSA4Ow0KLy9jb25zdCB2YWx1ZXNQZXJTdXJmYWNlUmVmID0gMTEgLy8gQSBzdXJmYWNlUmVmIHdpdGhpbiBhIEJvZHlEZXNjLy8gVGhpcyBpcyBub3cgZGlmZmVyZW50IGJhc2VkIG9uIHRoZSB2ZXJzaW9uLg0KY29uc3QgYm9keUl0ZW1Db29yZHNTdHJpZGUgPSAzMDsNCmNvbnN0IGZsb2F0c1BlclNjZW5lQm9keSA9IDIzOw0KY29uc3QgQ1VSVkVfRkxBR19DT1NUX0lTX0RFVEFJTCA9IDEgPDwgMzsNCmNvbnN0IFNVUkZBQ0VfRkxBR19GTElQUEVEX1VWID0gMSA8PCA1Ow0KY29uc3QgU1VSRkFDRV9GTEFHX0NPU1RfSVNfREVUQUlMX1UgPSAxIDw8IDY7DQpjb25zdCBTVVJGQUNFX0ZMQUdfQ09TVF9JU19ERVRBSUxfViA9IDEgPDwgNzsKCmNvbnN0IF9fY3VydmVzUGFja2VyID0gbmV3IEdyb3dpbmdQYWNrZXIoKTsNCmNvbnN0IF9fc3VyZmFjZVBhY2tlciA9IG5ldyBHcm93aW5nUGFja2VyKCk7DQpjb25zdCBfX3RyaW1TZXRQYWNrZXIgPSBuZXcgR3Jvd2luZ1BhY2tlcigpOw0KY29uc3QgX19ib2R5QXRsYXNQYWNrZXIgPSBuZXcgR3Jvd2luZ1BhY2tlcigpOw0KY29uc3QgX19saWdodG1hcFBhY2tlciA9IG5ldyBHcm93aW5nUGFja2VyKCk7DQoNCmNvbnN0IHdvcmtlclN0YXRlID0ge307DQoNCmNvbnN0IG5lYXJlc3RQb3cyID0gdmFsdWUgPT4gew0KICByZXR1cm4gTWF0aC5wb3coMiwgTWF0aC5yb3VuZChNYXRoLmxvZyh2YWx1ZSkgLyBNYXRoLmxvZygyKSkpDQp9Ow0KDQpmdW5jdGlvbiBjYWxjQ29udGFpbmVyU2l6ZShudW1JdGVtcywgaXRlbVdpZHRoID0gMSwgaXRlbUhlaWdodCA9IDEpIHsNCiAgY29uc3Qgc2lkZUxlbmd0aCA9IE1hdGguc3FydChudW1JdGVtcyAqIGl0ZW1XaWR0aCAqIGl0ZW1IZWlnaHQpOw0KICBsZXQgdzsNCiAgbGV0IGg7DQogIGlmIChpdGVtV2lkdGggPj0gaXRlbUhlaWdodCkgew0KICAgIHcgPSBzaWRlTGVuZ3RoIC8gaXRlbVdpZHRoOw0KICAgIGNvbnN0IGZyYWN0VyA9IHcgLSBNYXRoLmZsb29yKHcpOw0KICAgIGlmIChmcmFjdFcgPiAwLjUgJiYgZnJhY3RXIDwgMS4wKSB3ICs9IDEuMCAtIGZyYWN0VzsNCiAgICBlbHNlIHcgPSBNYXRoLm1heCgxLCBNYXRoLmZsb29yKHcpKTsNCiAgICBoID0gbnVtSXRlbXMgLyB3Ow0KICAgIGNvbnN0IGZyYWN0SCA9IGggLSBNYXRoLmZsb29yKGgpOw0KICAgIGlmIChmcmFjdEggPiAwLjAgJiYgZnJhY3RIIDwgMS4wKSB7DQogICAgICBoICs9IDEuMCAtIGZyYWN0SDsNCiAgICB9DQogIH0gZWxzZSB7DQogICAgaCA9IHNpZGVMZW5ndGggLyBpdGVtSGVpZ2h0Ow0KICAgIGNvbnN0IGZyYWN0SCA9IGggLSBNYXRoLmZsb29yKGgpOw0KICAgIGlmIChmcmFjdEggPiAwLjUgJiYgZnJhY3RIIDwgMS4wKSBoICs9IDEuMCAtIGZyYWN0SDsNCiAgICBlbHNlIGggPSBNYXRoLm1heCgxLCBNYXRoLmZsb29yKGgpKTsNCiAgICB3ID0gbnVtSXRlbXMgLyBoOw0KICAgIGNvbnN0IGZyYWN0VyA9IHcgLSBNYXRoLmZsb29yKHcpOw0KICAgIGlmIChmcmFjdFcgPiAwLjAgJiYgZnJhY3RXIDwgMS4wKSB7DQogICAgICB3ICs9IDEuMCAtIGZyYWN0VzsNCiAgICB9DQogIH0NCiAgaWYgKHcgKiBoIDwgbnVtSXRlbXMpIHRocm93IG5ldyBFcnJvcignSW52YWxpZCBjb250YWluZXIgc2l6ZScpDQogIHJldHVybiBbdywgaF0NCn0NCg0KZnVuY3Rpb24gYWRkVG9CaW4odmFsdWUsIGl0ZW1XaWR0aCwgaXRlbUhlaWdodCwgYmlucywgYmluc0RpY3QpIHsNCiAgY29uc3Qga2V5ID0gaXRlbVdpZHRoICsgJ3gnICsgaXRlbUhlaWdodDsNCiAgY29uc3QgYmluSWQgPSBiaW5zRGljdFtrZXldOw0KICBpZiAoYmluSWQgIT0gdW5kZWZpbmVkKSB7DQogICAgYmluc1tiaW5JZF0uaWRzLnB1c2godmFsdWUpOw0KICB9IGVsc2Ugew0KICAgIGJpbnNEaWN0W2tleV0gPSBiaW5zLmxlbmd0aDsNCiAgICBiaW5zLnB1c2goew0KICAgICAgaXRlbVdpZHRoLA0KICAgICAgaXRlbUhlaWdodCwNCiAgICAgIGlkczogW3ZhbHVlXSwNCiAgICB9KTsNCiAgfQ0KfQ0KDQpmdW5jdGlvbiBzb3J0QmlucyhiaW5zKSB7DQogIGNvbnN0IGluZGV4QXJyYXkgPSBuZXcgVWludDE2QXJyYXkoYmlucy5sZW5ndGgpOw0KICBmb3IgKGxldCBpID0gMDsgaSA8IGJpbnMubGVuZ3RoOyBpKyspIHsNCiAgICBpbmRleEFycmF5W2ldID0gaTsNCiAgICBjb25zdCBiaW4gPSBiaW5zW2ldOw0KICAgIGNvbnN0IGl0ZW1Db3VudFVWID0gY2FsY0NvbnRhaW5lclNpemUoDQogICAgICBiaW4uaWRzLmxlbmd0aCwNCiAgICAgIGJpbi5pdGVtV2lkdGgsDQogICAgICBiaW4uaXRlbUhlaWdodA0KICAgICk7DQogICAgYmluLml0ZW1Db3VudFVWID0gaXRlbUNvdW50VVY7DQogICAgYmluLncgPSBpdGVtQ291bnRVVlswXSAqIGJpbi5pdGVtV2lkdGg7DQogICAgYmluLmggPSBpdGVtQ291bnRVVlsxXSAqIGJpbi5pdGVtSGVpZ2h0Ow0KICAgIGJpbi5sID0gTWF0aC5tYXgoYmluLncsIGJpbi5oKTsNCiAgfQ0KDQogIGluZGV4QXJyYXkuc29ydCgoYSwgYikgPT4NCiAgICBiaW5zW2FdLmwgPiBiaW5zW2JdLmwgPyAtMSA6IGJpbnNbYV0ubCA8IGJpbnNbYl0ubCA/IDEgOiAwDQogICk7DQogIHJldHVybiBpbmRleEFycmF5DQp9DQoNCmZ1bmN0aW9uIGxheW91dEJpbnMoYmlucywgcGFja2VyLCBpdGVtQ2IsIGJpbkNiKSB7DQogIC8vIC8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8NCiAgLy8gU29ydCB0aGUgYmlucyBpbnRvIGJpZ2dlc3QgdG8gc21hbGxlc3Qgc28gd2UgcGFjayB0aGUgYmlnZ2VyIG9uZXMgZmlyc3QuDQogIGNvbnN0IGluZGV4QXJyYXkgPSBzb3J0QmlucyhiaW5zKTsNCg0KICBmb3IgKGNvbnN0IGJpbklkIG9mIGluZGV4QXJyYXkpIHsNCiAgICBjb25zdCBiaW4gPSBiaW5zW2JpbklkXTsNCiAgICAvLyBjb25zb2xlLmxvZygiYmluOiIgKyAgYmluLml0ZW1XaWR0aCsgIiB4ICIgK2Jpbi5pdGVtSGVpZ2h0KQ0KICAgIGNvbnN0IGJsb2NrID0gcGFja2VyLmFkZEJsb2NrKHsNCiAgICAgIHc6IGJpbi53LA0KICAgICAgaDogYmluLmgsDQogICAgfSk7DQogICAgaWYgKCFibG9jaykgdGhyb3cgbmV3IEVycm9yKCdVbmFibGUgdG8gbGF5b3V0IGJpbjonICsgYmluLncgKyAnIHggJyArIGJpbi5oKQ0KDQogICAgaWYgKGJpbkNiKSBiaW5DYihiaW4sIGJsb2NrKTsNCg0KICAgIGZvciAobGV0IGkgPSAwOyBpIDwgYmluLmlkcy5sZW5ndGg7IGkrKykgew0KICAgICAgY29uc3QgdSA9IGJsb2NrLnggKyAoaSAlIGJpbi5pdGVtQ291bnRVVlswXSkgKiBiaW4uaXRlbVdpZHRoOw0KICAgICAgY29uc3QgdiA9IGJsb2NrLnkgKyBNYXRoLmZsb29yKGkgLyBiaW4uaXRlbUNvdW50VVZbMF0pICogYmluLml0ZW1IZWlnaHQ7DQogICAgICBpdGVtQ2IoYmluLCBpLCB1LCB2KTsNCiAgICB9DQogIH0NCn0NCg0KY29uc3QgbGF5b3V0Q3VydmVzID0gKGN1cnZlc0RhdGFSZWFkZXIsIGVycm9yVG9sZXJhbmNlLCBtYXhUZXhTaXplKSA9PiB7DQogIC8vIGNvbnN0IG51bUN1cnZlcyA9IGN1cnZlc0RhdGFSZWFkZXIubGVuZ3RoIC8gODsNCiAgY29uc3QgbnVtQ3VydmVzID0gY3VydmVzRGF0YVJlYWRlci5sb2FkVUludDMyKCk7DQogIGlmIChudW1DdXJ2ZXMgPT0gMCkgcmV0dXJuDQoNCiAgY29uc3QgY3VydmVMaWJyYXJ5U2l6ZSA9IE1hdGguc3FydChjdXJ2ZXNEYXRhUmVhZGVyLmRhdGEuYnl0ZUxlbmd0aCAvIDgpOyAvLyBSR0JBMTYgcGl4ZWxzDQoNCiAgY29uc3QgYmluc0xpc3QgPSBbXTsNCiAgY29uc3QgYmluc0RpY3QgPSB7fTsNCiAgZm9yIChsZXQgY3VydmVJZCA9IDA7IGN1cnZlSWQgPCBudW1DdXJ2ZXM7IGN1cnZlSWQrKykgew0KICAgIHRyeSB7DQogICAgICBjdXJ2ZXNEYXRhUmVhZGVyLnNlZWsoDQogICAgICAgIGdlb21MaWJyYXJ5SGVhZGVyU2l6ZSArDQogICAgICAgIGN1cnZlSWQgKiAodmFsdWVzUGVyQ3VydmVUb2NJdGVtICogMikgLyogYnBjKi8gKw0KICAgICAgICAgIDIgKiAyIC8qIGJwYyovDQogICAgICApOw0KDQogICAgICBsZXQgcGFyYW0gPSBjdXJ2ZXNEYXRhUmVhZGVyLmxvYWRGbG9hdDE2KCk7DQogICAgICBsZXQgbGVuZ3RoID0gY3VydmVzRGF0YVJlYWRlci5sb2FkRmxvYXQxNigpOw0KICAgICAgY29uc3QgZmxhZ3MgPSBjdXJ2ZXNEYXRhUmVhZGVyLmxvYWRGbG9hdDE2KCk7DQogICAgICANCiAgICAgIC8vIGlmIChjdXJ2ZUlkID09NzM1NCkgew0KICAgICAgLy8gICBjb25zdCBjdXJ2ZVR5cGUgPSBnZXRDdXJ2ZVR5cGUoY3VydmVJZCk7DQogICAgICAvLyAgIGNvbnNvbGUubG9nKCJDdXJ2ZSA6IiwgY3VydmVJZCwgZ2V0Q3VydmVUeXBlTmFtZShjdXJ2ZVR5cGUpLCAiIGZsYWdzOiIsIGZsYWdzLCAiIHBhcmFtOiIsIHBhcmFtKTsNCiAgICAgIC8vIH0NCg0KICAgICAgaWYgKCFOdW1iZXIuaXNGaW5pdGUocGFyYW0pKQ0KICAgICAgICBwYXJhbSA9IDY1NTM2Ow0KICAgICAgaWYgKCFOdW1iZXIuaXNGaW5pdGUobGVuZ3RoKSkNCiAgICAgICAgbGVuZ3RoID0gNjU1MzY7DQogICAgICAgIA0KICAgICAgbGV0IGRldGFpbDsNCiAgICAgIGlmIChmbGFncyAmIENVUlZFX0ZMQUdfQ09TVF9JU19ERVRBSUwpIHsNCiAgICAgICAgZGV0YWlsID0gcGFyYW07DQogICAgICB9IGVsc2Ugew0KICAgICAgICBpZiAocGFyYW0gPT0gMC4wKSB7DQogICAgICAgICAgZGV0YWlsID0gMTsNCiAgICAgICAgfSBlbHNlIHsNCiAgICAgICAgICBjb25zdCBjdXJ2YXR1cmUgPSBwYXJhbSAvIGxlbmd0aDsNCiAgICAgICAgICBjb25zdCByYWRpdXMgPSAxIC8gY3VydmF0dXJlOw0KICAgICAgICAgIGlmIChyYWRpdXMgPCBlcnJvclRvbGVyYW5jZSkgew0KICAgICAgICAgICAgZGV0YWlsID0gNjsNCiAgICAgICAgICB9IGVsc2Ugew0KICAgICAgICAgICAgY29uc3QgYSA9IHJhZGl1cyAtIGVycm9yVG9sZXJhbmNlOw0KICAgICAgICAgICAgY29uc3QgYXJjQW5nbGUgPSBNYXRoLmFjb3MoYSAvIHJhZGl1cykgKiAyOw0KICAgICAgICAgICAgZGV0YWlsID0gcGFyYW0gLyBhcmNBbmdsZTsNCiAgICAgICAgICAgIGRldGFpbCA9IE1hdGgubWF4KDEsIE1hdGgucm91bmQobmVhcmVzdFBvdzIoZGV0YWlsKSkpOw0KICAgICAgICAgICAgaWYgKGRldGFpbCA+IDEwMjUpew0KICAgICAgICAgICAgICBjb25zb2xlLndhcm4oJ0N1cnZlIGRldGFpbDonICsgZGV0YWlsKTsNCiAgICAgICAgICAgICAgZGV0YWlsID0gTWF0aC5taW4oZGV0YWlsLCAxMDI1KTsNCiAgICAgICAgICAgIH0NCiAgICAgICAgICAgIGlmIChpc05hTihkZXRhaWwpKSB7DQogICAgICAgICAgICAgIGNvbnNvbGUud2FybignVW5hYmxlIHRvIGxheW91dCBDdXJ2ZTonICsgZGV0YWlsKTsNCiAgICAgICAgICAgICAgY29udGludWUNCiAgICAgICAgICAgIH0NCiAgICAgICAgICB9DQogICAgICAgIH0NCiAgICAgIH0NCg0KICAgICAgLy8gY29uc29sZS5sb2coIkN1cnZlIDoiLCBjdXJ2ZUlkLCBnZXRDdXJ2ZVR5cGVOYW1lKGN1cnZlVHlwZSksICIgZmxhZ3M6IiwgZmxhZ3MsICIgcGFyYW06IiwgcGFyYW0sICIgZGV0YWlsOiIsIGRldGFpbCk7DQoNCiAgICAgIC8vIE5vdGU6IHRoZSBkZXRhaWwgdmFsdWUgaXMgYWx3YXlzIGEgcG93ZXIgb2YgMiwgYW5kIHRoZSBudW0gdmVydGljZXMgYXJlIGFsd2F5cyBvZGQuDQogICAgICAvLyBlLmcuIGRldGFpbCA9IDQsIG51bVZlcnRzID0gNS4NCiAgICAgIGFkZFRvQmluKGN1cnZlSWQsIGRldGFpbCArIDEsIDEsIGJpbnNMaXN0LCBiaW5zRGljdCk7DQogICAgfSBjYXRjaCAoZSkgew0KICAgICAgY29uc29sZS53YXJuKCJFcnJvciB3aGlsZSByZWFkaW5nIENBREN1cnZlIGRhdGEgaW4gd2ViIHdvcmtlcjogIiwgY3VydmVJZCwgZSk7DQogICAgfQ0KICB9DQoNCiAgLy8gLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLw0KICAvLyBOb3cgbGF5b3V0IHRoZSBjdXJ2ZXMgaW4gYmF0Y2hlcy4gQmlnZ2VzdCB0byBzbWFsbGVzdA0KICAvLyBjb25zdCBjdXJ2ZXNBdGxhc0xheW91dCA9IG5ldyBGbG9hdDMyQXJyYXkobnVtQ3VydmVzICogdmFsdWVzUGVyQ3VydmVMaWJyYXJ5TGF5b3V0SXRlbSk7DQoNCiAgLy8gVGhlIGNvb3JkaW5hdGVzIGZvciB0aGUgcGF0Y2hlcyBpbiB0aGUgZ2VvbSB0ZXh0dXJlIG5lZWQgdG8gYmUNCiAgLy8gaW4gYSB0ZXh0dXJlIHRoYXQgd2UgYmluZCB0byB0aGUgR0xFdmFsdWF0ZURyYXdJdGVtc1NoYWRlciwgd2hlcmUNCiAgLy8gaXQgY2FuIHNjYXR0ZXIgdGhlIHZhbHVlcyBpbnRvIHRoZSBkcmF3IGluc3RhbmNlcy4NCiAgY29uc3QgY3VydmVzQXRsYXNMYXlvdXRUZXh0dXJlU2l6ZSA9IGNhbGNDb250YWluZXJTaXplKG51bUN1cnZlcyAqIDIpOyAvLyAsIDIvKiBwaXhlbHMgcGVyIGl0ZW0gKi8sIDEpOw0KICBjb25zdCBjdXJ2ZXNBdGxhc0xheW91dCA9IG5ldyBGbG9hdDMyQXJyYXkoDQogICAgY3VydmVzQXRsYXNMYXlvdXRUZXh0dXJlU2l6ZVswXSAqIGN1cnZlc0F0bGFzTGF5b3V0VGV4dHVyZVNpemVbMV0gKiA0DQogICk7DQoNCiAgbGF5b3V0QmlucyhiaW5zTGlzdCwgX19jdXJ2ZXNQYWNrZXIsIChiaW4sIGksIHUsIHYpID0+IHsNCiAgICBjb25zdCBjdXJ2ZUlkID0gYmluLmlkc1tpXTsNCg0KICAgIGN1cnZlc0F0bGFzTGF5b3V0W2N1cnZlSWQgKiB2YWx1ZXNQZXJDdXJ2ZUxpYnJhcnlMYXlvdXRJdGVtICsgMF0gPSB1Ow0KICAgIGN1cnZlc0F0bGFzTGF5b3V0W2N1cnZlSWQgKiB2YWx1ZXNQZXJDdXJ2ZUxpYnJhcnlMYXlvdXRJdGVtICsgMV0gPSB2Ow0KICAgIGN1cnZlc0F0bGFzTGF5b3V0W2N1cnZlSWQgKiB2YWx1ZXNQZXJDdXJ2ZUxpYnJhcnlMYXlvdXRJdGVtICsgMl0gPQ0KICAgICAgYmluLml0ZW1XaWR0aDsNCiAgICBjdXJ2ZXNBdGxhc0xheW91dFtjdXJ2ZUlkICogdmFsdWVzUGVyQ3VydmVMaWJyYXJ5TGF5b3V0SXRlbSArIDNdID0NCiAgICAgIGJpbi5pdGVtSGVpZ2h0Ow0KDQogICAgLy8gY29uc3QgbGF5b3V0ID0gWw0KICAgIC8vICAgY3VydmVzQXRsYXNMYXlvdXRbKGN1cnZlSWQgKiB2YWx1ZXNQZXJDdXJ2ZUxpYnJhcnlMYXlvdXRJdGVtKSArIDBdLA0KICAgIC8vICAgY3VydmVzQXRsYXNMYXlvdXRbKGN1cnZlSWQgKiB2YWx1ZXNQZXJDdXJ2ZUxpYnJhcnlMYXlvdXRJdGVtKSArIDFdLA0KICAgIC8vICAgY3VydmVzQXRsYXNMYXlvdXRbKGN1cnZlSWQgKiB2YWx1ZXNQZXJDdXJ2ZUxpYnJhcnlMYXlvdXRJdGVtKSArIDJdLA0KICAgIC8vICAgY3VydmVzQXRsYXNMYXlvdXRbKGN1cnZlSWQgKiB2YWx1ZXNQZXJDdXJ2ZUxpYnJhcnlMYXlvdXRJdGVtKSArIDNdXTsNCiAgICAvLyBjb25zb2xlLmxvZygiUmVuZGVyIEN1cnZlIElkICIgKyBjdXJ2ZUlkICsgIjpbIiArIGxheW91dCArICJdIikNCg0KICAgIC8vIFRPRE86IGp1c3Qgd3JpdGUgdGhlIGN1cnZlSUQgaGVyZSBpbnN0ZWFkIGFuZCB3ZSBjYW4gbG9va3VwIHRoZSBjb29yZHMgaW4gdGhlIHNoYWRlcg0KICAgIGN1cnZlc0RhdGFSZWFkZXIuc2VlaygNCiAgICAgIGdlb21MaWJyYXJ5SGVhZGVyU2l6ZSArIGN1cnZlSWQgKiAodmFsdWVzUGVyQ3VydmVUb2NJdGVtICogMikgLyogYnBjKi8NCiAgICApOw0KICAgIGNvbnN0IGNvb3Jkc1ggPSBjdXJ2ZXNEYXRhUmVhZGVyLmxvYWRVRmxvYXQxNigpOw0KICAgIGNvbnN0IGNvb3Jkc1kgPSBjdXJ2ZXNEYXRhUmVhZGVyLmxvYWRVRmxvYXQxNigpOw0KICAgIC8vIGNvbnNvbGUubG9nKCJDdXJ2ZSBJZCAiLCBjdXJ2ZUlkLCAiOlsiLCBjb29yZHNYLCAiLCAiLCBjb29yZHNZLCAiXSIpDQogICAgY3VydmVzQXRsYXNMYXlvdXRbY3VydmVJZCAqIHZhbHVlc1BlckN1cnZlTGlicmFyeUxheW91dEl0ZW0gKyA0XSA9IGNvb3Jkc1g7DQogICAgY3VydmVzQXRsYXNMYXlvdXRbY3VydmVJZCAqIHZhbHVlc1BlckN1cnZlTGlicmFyeUxheW91dEl0ZW0gKyA1XSA9IGNvb3Jkc1k7DQogIH0pOw0KDQogIHJldHVybiB7DQogICAgbnVtQ3VydmVzLA0KICAgIGN1cnZlc0F0bGFzTGF5b3V0LA0KICAgIGN1cnZlc0F0bGFzTGF5b3V0VGV4dHVyZVNpemUsDQogIH0NCn07DQoNCmNvbnN0IGxheW91dFN1cmZhY2VzID0gKHN1cmZhY2VzRGF0YVJlYWRlciwgZXJyb3JUb2xlcmFuY2UsIG1heFRleFNpemUsIHN1cmZhY2VBcmVhVGhyZXNob2xkLCBjYWREYXRhVmVyc2lvbikgPT4gew0KICBjb25zdCBzdXJmYWNlTGlicmFyeVNpemUgPSBNYXRoLnNxcnQoc3VyZmFjZXNEYXRhUmVhZGVyLmRhdGEuYnl0ZUxlbmd0aCAvIDgpOyAvLyBSR0JBMTYgcGl4ZWxzDQogIGNvbnN0IG51bVN1cmZhY2VzID0gc3VyZmFjZXNEYXRhUmVhZGVyLmxvYWRVSW50MzIoKTsNCg0KICBjb25zdCB0b3RhbFN1cmZhY2VBcmVhID0gc3VyZmFjZXNEYXRhUmVhZGVyLmxvYWRGbG9hdDMyKCk7DQogIGNvbnN0IHRvdGFsU3VyZmFjZUNvc3QgPSBzdXJmYWNlc0RhdGFSZWFkZXIubG9hZEZsb2F0MzIoKTsNCiAgY29uc3Qgc3VyZmFjZURldGFpbHMgPSBuZXcgVWludDMyQXJyYXkobnVtU3VyZmFjZXMgKiA2KTsgLy8gZmxhZ3MsIGFkZHJYLCBhZGRyWSwgc3VyZmFjZVR5cGUsIGRldGFpbFgsIGRldGFpbFk7DQogIGNvbnN0IHNlZWtTdXJmYWNlRGF0YSA9IGFkZHIgPT4gew0KICAgIC8vIFgsIFkgaW4gcGl4ZWxzLg0KICAgIGNvbnN0IGJ5dGVzUGVyUGl4ZWwgPSA4OyAvLyBSR0JBMTYgcGl4ZWwNCiAgICBjb25zdCBieXRlT2Zmc2V0ID0NCiAgICAgIGFkZHIueCAqIGJ5dGVzUGVyUGl4ZWwgKyBhZGRyLnkgKiBieXRlc1BlclBpeGVsICogc3VyZmFjZUxpYnJhcnlTaXplOw0KICAgIC8vIGNvbnNvbGUubG9nKCJfX3NlZWtTdXJmYWNlRGF0YToiICsgc3VyZmFjZUlkICsgIiBieXRlT2Zmc2V0OiIgKyAoYnl0ZU9mZnNldCArb2Zmc2V0KSArICIgcGl4ZWw6IiArICgoYnl0ZU9mZnNldCArb2Zmc2V0KS84KSArICIgeDoiICsgYWRkci54ICsgIiB5OiIgKyBhZGRyLnkpOw0KICAgIHN1cmZhY2VzRGF0YVJlYWRlci5zZWVrKGJ5dGVPZmZzZXQpOw0KICB9Ow0KDQogIGNvbnN0IGJpbnNMaXN0ID0gW107DQogIGNvbnN0IGJpbnNEaWN0ID0ge307DQogIGNvbnN0IGNvdW50cyA9IHt9Ow0KICBsZXQgdG90YWxEZXRhaWwgPSAwOw0KICBmb3IgKGxldCBzdXJmYWNlSWQgPSAwOyBzdXJmYWNlSWQgPCBudW1TdXJmYWNlczsgc3VyZmFjZUlkKyspIHsNCiAgICB0cnkgew0KICAgICAgLy8gaWYoc3VyZmFjZUlkICE9IDk2MjgpIHsNCiAgICAgIC8vICAgY29udGludWU7DQogICAgICAvLyB9DQoNCiAgICAgIHN1cmZhY2VzRGF0YVJlYWRlci5zZWVrKA0KICAgICAgICBnZW9tTGlicmFyeUhlYWRlclNpemUgKyBzdXJmYWNlSWQgKiAodmFsdWVzUGVyU3VyZmFjZVRvY0l0ZW0gKiAyKSAvKiBicGMqLw0KICAgICAgKTsNCg0KICAgICAgY29uc3QgYWRkclggPSBzdXJmYWNlc0RhdGFSZWFkZXIubG9hZFVGbG9hdDE2KCk7DQogICAgICBjb25zdCBhZGRyWSA9IHN1cmZhY2VzRGF0YVJlYWRlci5sb2FkVUZsb2F0MTYoKTsNCiAgICAgIGxldCBwYXJhbVUgPSBzdXJmYWNlc0RhdGFSZWFkZXIubG9hZEZsb2F0MTYoKTsNCiAgICAgIGxldCBwYXJhbVYgPSBzdXJmYWNlc0RhdGFSZWFkZXIubG9hZEZsb2F0MTYoKTsNCiAgICAgIGxldCBzaXplVSA9IHN1cmZhY2VzRGF0YVJlYWRlci5sb2FkRmxvYXQxNigpOw0KICAgICAgbGV0IHNpemVWID0gc3VyZmFjZXNEYXRhUmVhZGVyLmxvYWRGbG9hdDE2KCk7DQogICAgICBjb25zdCBmbGFncyA9IHN1cmZhY2VzRGF0YVJlYWRlci5sb2FkRmxvYXQxNigpOw0KDQoNCiAgICAgIGlmICghTnVtYmVyLmlzRmluaXRlKHNpemVVKSkNCiAgICAgICAgc2l6ZVUgPSA2NTUzNjsNCiAgICAgIGlmICghTnVtYmVyLmlzRmluaXRlKHNpemVWKSkNCiAgICAgICAgc2l6ZVYgPSA2NTUzNjsNCg0KDQogICAgICAvLyBkZWJ1ZyB0cmltIHNldCBJZA0KICAgICAgbGV0IHRyaW1TZXRJZDsNCiAgICAgIHsNCiAgICAgICAgaWYgKGNhZERhdGFWZXJzaW9uLnBhdGNoIDwgMjcgJiYgY2FkRGF0YVZlcnNpb24ubWlub3IgPT0gMCAmJiBjYWREYXRhVmVyc2lvbi5tYWpvciA9PSAwKSB7DQogICAgICAgICAgY29uc3QgcGFydEEgPSBzdXJmYWNlc0RhdGFSZWFkZXIubG9hZEZsb2F0MTYoKTsNCiAgICAgICAgICBjb25zdCBwYXJ0QiA9IHN1cmZhY2VzRGF0YVJlYWRlci5sb2FkRmxvYXQxNigpOw0KICAgICAgICAgIHRyaW1TZXRJZCA9IHBhcnRBICsgKHBhcnRCIDw8IDgpOw0KICAgICAgICB9IGVsc2Ugew0KICAgICAgICAgIHN1cmZhY2VzRGF0YVJlYWRlci5sb2FkU0ludDMyRnJvbTJ4RmxvYXQxNigpOw0KICAgICAgICB9DQogICAgICAgIC8vIGlmKHRyaW1TZXRJZCA+PSAwKSB7DQogICAgICAgIC8vICAgY29uc29sZS5sb2coc3VyZmFjZUlkICsiIHRyaW1TZXRJZDoiICsgdHJpbVNldElkKTsNCiAgICAgICAgLy8gfQ0KICAgICAgICAvLyBlbHNlIHsNCiAgICAgICAgLy8gICBjb250aW51ZTsgDQogICAgICAgIC8vIH0NCiAgICAgIH0NCg0KICAgICAgc2Vla1N1cmZhY2VEYXRhKHsgeDogYWRkclgsIHk6IGFkZHJZIH0pOw0KICAgICAgbGV0IHN1cmZhY2VUeXBlOw0KICAgICAgdHJ5IHsNCiAgICAgICAgc3VyZmFjZVR5cGUgPSBzdXJmYWNlc0RhdGFSZWFkZXIubG9hZEZsb2F0MTYoKTsNCiAgICAgIH0gY2F0Y2ggKGUpIHsNCiAgICAgICAgY29uc29sZS53YXJuKCJFcnJvciB3aGlsZSByZWFkaW5nIFN1cmZhY2UgZGF0YSBpbiB3ZWIgd29ya2VyOiAiLCBzdXJmYWNlSWQsIGUpOw0KICAgICAgICBjb250aW51ZTsNCiAgICAgIH0NCg0KICAgICAgLy8gaWYodHJpbVNldElkID09IDkyKSB7DQogICAgICAvLyAgIGNvbnNvbGUubG9nKCdzdXJmYWNlVHlwZTonLCBnZXRTdXJmYWNlVHlwZU5hbWUoc3VyZmFjZVR5cGUpLCAiIHN1cmZhY2VJZDoiLCBzdXJmYWNlSWQsICIgdHJpbVNldElkOiIsIHRyaW1TZXRJZCwgIiBzaXplOiIsc2l6ZVUsICJ4Iiwgc2l6ZVYpOw0KICAgICAgLy8gfQ0KICAgICAgICAvLyBjb25zb2xlLmxvZygnc3VyZmFjZVR5cGU6JywgZ2V0U3VyZmFjZVR5cGVOYW1lKHN1cmZhY2VUeXBlKSwgIiBzdXJmYWNlSWQ6Iiwgc3VyZmFjZUlkLCAiIHRyaW1TZXRJZDoiLCB0cmltU2V0SWQsICIgc2l6ZToiLHNpemVVLCAieCIsIHNpemVWKTsNCiAgICAgIC8vIGNvbnNvbGUubG9nKCdzdXJmYWNlVHlwZTonLCBnZXRTdXJmYWNlVHlwZU5hbWUoc3VyZmFjZVR5cGUpLCAiIHN1cmZhY2VJZDoiLCBzdXJmYWNlSWQsICIgYWRkclg6IiwgYWRkclgsICIsIiwgYWRkclkpOw0KDQogICAgICAvLyBpZiAoc3VyZmFjZVR5cGUgIT0gQ0FEU3VyZmFjZVR5cGVzLlNVUkZBQ0VfVFlQRV9MSU5FQVJfRVhUUlVTSU9OKSB7DQogICAgICAvLyAgIC8vIGNvbnNvbGUubG9nKCdzdXJmYWNlVHlwZTonLCBnZXRTdXJmYWNlVHlwZU5hbWUoc3VyZmFjZVR5cGUpLCAiIHN1cmZhY2VJZDoiLCBzdXJmYWNlSWQsICIgYWRkclg6IiwgYWRkclgsICIsIiwgYWRkclkpDQogICAgICAvLyAgIGNvbnRpbnVlOw0KICAgICAgLy8gfQ0KICAgICAgLy8gaWYgKHN1cmZhY2VUeXBlICE9IENBRFN1cmZhY2VUeXBlcy5TVVJGQUNFX1RZUEVfTlVSQlNfU1VSRkFDRSkgew0KICAgICAgLy8gICAvLyBjb25zb2xlLmxvZygnc3VyZmFjZVR5cGU6JywgZ2V0U3VyZmFjZVR5cGVOYW1lKHN1cmZhY2VUeXBlKSwgIiBzdXJmYWNlSWQ6Iiwgc3VyZmFjZUlkLCAiIGFkZHJYOiIsIGFkZHJYLCAiLCIsIGFkZHJZKQ0KICAgICAgLy8gICBjb250aW51ZTsNCiAgICAgIC8vIH0NCiAgICAgIC8vIGlmKHN1cmZhY2VUeXBlICE9IENBRFN1cmZhY2VUeXBlcy5TVVJGQUNFX1RZUEVfUkVWT0xVVElPTiAmJiBzdXJmYWNlVHlwZSAhPSBDQURTdXJmYWNlVHlwZXMuU1VSRkFDRV9UWVBFX1JFVk9MVVRJT05fRkxJUFBFRF9ET01BSU4gKSB7DQogICAgICAvLyAgIGNvbnRpbnVlOw0KICAgICAgLy8gfQ0KICAgICAgICAvLyBpZihzaXplViA8IDAuNykgew0KICAgICAgICAvLyAvLyAgIC8vIGxldCBicmVha2hlcmUgPSAzOzsNCiAgICAgICAgLy8gICBjb250aW51ZTsNCiAgICAgICAgLy8gfQ0KDQogICAgICBsZXQgZGV0YWlsVTsNCiAgICAgIGxldCBkZXRhaWxWOw0KICAgICAgbGV0IGV2YWxmbGFncyA9IDA7DQogICAgICBpZiAoc3VyZmFjZVR5cGUgPT0gQ0FEU3VyZmFjZVR5cGVzLlNVUkZBQ0VfVFlQRV9GQU4pIHsNCiAgICAgICAgZGV0YWlsVSA9IHBhcmFtVTsNCiAgICAgICAgZGV0YWlsViA9IHBhcmFtVjsNCiAgICAgIH0gZWxzZSB7DQogICAgICAgIC8vIElmIHRoZSBhcmVhIGZhbGxzIGJlbG93ICBhdGhyZWFzaG9sZCwgd2Ugc2tpcCB0aGUgc3VyZmFjZS4NCiAgICAgICAgY29uc3QgYXJlYSA9IHNpemVVICogc2l6ZVY7DQogICAgICAgIGlmIChhcmVhIDwgc3VyZmFjZUFyZWFUaHJlc2hvbGQpIHsNCiAgICAgICAgICBjb25zb2xlLmxvZygnU2tpcHBpbmcgOicsIGdldFN1cmZhY2VUeXBlTmFtZShzdXJmYWNlVHlwZSksICIgc2l6ZToiLHNpemVVLCAieCIsIHNpemVWLCAiIGFyZWE6IiwgYXJlYSk7DQogICAgICAgICAgY29udGludWU7DQogICAgICAgIH0NCg0KICAgICAgICBpZiAoIU51bWJlci5pc0Zpbml0ZShwYXJhbVUpKQ0KICAgICAgICAgIHBhcmFtVSA9IDY1NTM2Ow0KICAgICAgICBpZiAoIU51bWJlci5pc0Zpbml0ZShwYXJhbVYpKQ0KICAgICAgICAgIHBhcmFtViA9IDY1NTM2Ow0KICAgICAgICAvLyBwYXJhbSB2YWx1ZXMgZW5jb2RlIGN1cnZhdHVyZSBpbnRlZ3JhdGVkIG92ZXIgdGhlIGxlbmd0aA0KICAgICAgICAvLyBnaXZpbmcgdGhlIHRvdGFsIGN1cnZlLiBXZSBub3cgbmVlZCB0byBpbnRlZ3JhdGUgYWdhaW4NCiAgICAgICAgLy8gdG8gZ2V0IGNvc3QuDQogICAgICAgIGlmIChmbGFncyAmIFNVUkZBQ0VfRkxBR19DT1NUX0lTX0RFVEFJTF9VKSB7DQogICAgICAgICAgZGV0YWlsVSA9IHBhcmFtVTsNCiAgICAgICAgfSBlbHNlIHsNCiAgICAgICAgICBpZiAocGFyYW1VID09IDApIHsNCiAgICAgICAgICAgIGRldGFpbFUgPSAxOw0KICAgICAgICAgIH0gZWxzZSB7DQogICAgICAgICAgICBjb25zdCBjdXJ2YXR1cmUgPSBwYXJhbVUgLyBzaXplVTsNCiAgICAgICAgICAgIGNvbnN0IHJhZGl1cyA9IDEgLyBjdXJ2YXR1cmU7DQogICAgICAgICAgICBpZiAocmFkaXVzIDwgZXJyb3JUb2xlcmFuY2UpIHsNCiAgICAgICAgICAgICAgZGV0YWlsVSA9IDY7DQogICAgICAgICAgICB9IGVsc2Ugew0KICAgICAgICAgICAgICBjb25zdCBhID0gcmFkaXVzIC0gZXJyb3JUb2xlcmFuY2U7DQogICAgICAgICAgICAgIGNvbnN0IGFyY0FuZ2xlID0gTWF0aC5hY29zKGEgLyByYWRpdXMpICogMjsNCiAgICAgICAgICAgICAgZGV0YWlsVSA9IHBhcmFtVSAvIGFyY0FuZ2xlOw0KICAgICAgICAgICAgICBkZXRhaWxVID0gTWF0aC5tYXgoMSwgTWF0aC5yb3VuZChuZWFyZXN0UG93MihkZXRhaWxVKSkpOw0KICAgICAgICAgICAgICBpZiAoZGV0YWlsVSA+IDEwMjUpew0KICAgICAgICAgICAgICAgIGNvbnNvbGUud2FybignR2VvbSBkZXRhaWxVOicgKyBkZXRhaWxVKTsNCiAgICAgICAgICAgICAgICBkZXRhaWxVID0gMTAyNTsNCiAgICAgICAgICAgICAgfQ0KICAgICAgICAgICAgfQ0KICAgICAgICAgIH0NCiAgICAgICAgfQ0KICAgICAgICBpZiAoZmxhZ3MgJiBTVVJGQUNFX0ZMQUdfQ09TVF9JU19ERVRBSUxfVikgew0KICAgICAgICAgIGRldGFpbFYgPSBwYXJhbVY7DQogICAgICAgIH0gZWxzZSB7DQogICAgICAgICAgaWYgKHBhcmFtViA9PSAwKSB7DQogICAgICAgICAgICBkZXRhaWxWID0gMTsNCiAgICAgICAgICB9IGVsc2Ugew0KICAgICAgICAgICAgY29uc3QgY3VydmF0dXJlID0gcGFyYW1WIC8gc2l6ZVY7DQogICAgICAgICAgICBjb25zdCByYWRpdXMgPSAxIC8gY3VydmF0dXJlOw0KICAgICAgICAgICAgaWYgKHJhZGl1cyA8IGVycm9yVG9sZXJhbmNlKSB7DQogICAgICAgICAgICAgIGRldGFpbFYgPSA2Ow0KICAgICAgICAgICAgfSBlbHNlIHsNCiAgICAgICAgICAgICAgY29uc3QgYSA9IHJhZGl1cyAtIGVycm9yVG9sZXJhbmNlOw0KICAgICAgICAgICAgICBjb25zdCBhcmNBbmdsZSA9IE1hdGguYWNvcyhhIC8gcmFkaXVzKSAqIDI7DQogICAgICAgICAgICAgIGRldGFpbFYgPSBwYXJhbVYgLyBhcmNBbmdsZTsNCiAgICAgICAgICAgICAgZGV0YWlsViA9IE1hdGgubWF4KDEsIE1hdGgucm91bmQobmVhcmVzdFBvdzIoZGV0YWlsVikpKTsNCiAgICAgICAgICAgICAgaWYgKGRldGFpbFYgPiAxMDI1KXsNCiAgICAgICAgICAgICAgICBjb25zb2xlLndhcm4oJ0dlb20gZGV0YWlsVjonICsgZGV0YWlsVik7DQogICAgICAgICAgICAgICAgZGV0YWlsViA9IDEwMjU7DQogICAgICAgICAgICAgIH0NCiAgICAgICAgICAgIH0NCiAgICAgICAgICB9DQogICAgICAgIH0NCg0KICAgICAgICAvLyBSb3RhdGUgc3VyZmFjZXMgdG8gZml0IGV4aXN0aW5nIGRyYXcgc2V0cy4NCiAgICAgICAgLy8gTm90ZTogVGhpcyBtaW5pbWlzZXMgdGhlIG51bWJlciBvZiBkcmF3IHNldHMgYW5kIHJlZHVjZXMgdGhlIHRpbWUgcGFja2luZw0KICAgICAgICAvLyBieSBmbGlwcGluZyBzb21lIHN1cmZhY2VzIGRpYWdvbmFsbHkuDQogICAgICAgIGlmIChkZXRhaWxVIDwgZGV0YWlsVikgew0KICAgICAgICAgIGNvbnN0IHRtcCA9IGRldGFpbFU7DQogICAgICAgICAgZGV0YWlsVSA9IGRldGFpbFY7DQogICAgICAgICAgZGV0YWlsViA9IHRtcDsNCiAgICAgICAgICBldmFsZmxhZ3MgPSBTVVJGQUNFX0ZMQUdfRkxJUFBFRF9VVjsNCiAgICAgICAgfQ0KICAgICAgICAvLyBjb25zb2xlLmxvZygnc3VyZmFjZVR5cGU6JywgZ2V0U3VyZmFjZVR5cGVOYW1lKHN1cmZhY2VUeXBlKSwgIiBzdXJmYWNlSWQ6Iiwgc3VyZmFjZUlkLCAiIGRldGFpbDoiLGRldGFpbFUsICJ4IiwgZGV0YWlsViwgIiBjb3N0OiIscGFyYW1VLCAieCIsIHBhcmFtViwgIiBzaXplOiIsc2l6ZVUsICJ4Iiwgc2l6ZVYpOw0KICAgICAgfQ0KDQogICAgICBpZiAoaXNOYU4oZGV0YWlsVSkgfHwgaXNOYU4oZGV0YWlsVikgfHwgIU51bWJlci5pc0Zpbml0ZShkZXRhaWxVKSB8fCAhTnVtYmVyLmlzRmluaXRlKGRldGFpbFYpKSB7DQogICAgICAgIGNvbnNvbGUud2FybigNCiAgICAgICAgICAnVW5hYmxlIHRvIGxheW91dCBpdGVtICcsDQogICAgICAgICAgZ2V0U3VyZmFjZVR5cGVOYW1lKHN1cmZhY2VUeXBlKSwNCiAgICAgICAgICAnIDonICsgZGV0YWlsVSArICcgeCAnICsgZGV0YWlsVg0KICAgICAgICApOw0KICAgICAgICBjb250aW51ZQ0KICAgICAgfQ0KDQogICAgICAvLyBpZiAoIShkZXRhaWxVID49IDIwNDggfHwgZGV0YWlsViA+PSAyMDQ4KSkgew0KICAgICAgLy8gICBjb250aW51ZTsNCiAgICAgIC8vIH0NCg0KICAgICAgLy8gVGhlIHF1YWQgc2l6ZSBkZWZpbmVkIHRoZSBudW1iZXIgb2YgdmVydGljZXMuIFNvIGEgc2ltcGxlIHBsYW5lIHF1YWQgd2lsbCBjb3ZlciA0IHZlcnRzLg0KICAgICAgLy8gTm90ZTogdGhlIGRldGFpbCB2YWx1ZSBpcyBhbHdheXMgYSBwb3dlciBvZiAyLCBhbmQgdGhlIG51bSB2ZXJ0aWNlcyBhcmUgYWx3YXlzIG9kZC4NCiAgICAgIC8vIGUuZy4gZGV0YWlsID0gNCwgbnVtVmVydHMgPSA1Lg0KICAgICAgZGV0YWlsVSsrOw0KICAgICAgZGV0YWlsVisrOw0KDQogICAgICBsZXQgY2F0ZWdvcnkgPSAwOw0KICAgICAgaWYgKA0KICAgICAgICBzdXJmYWNlVHlwZSA9PSBDQURTdXJmYWNlVHlwZXMuU1VSRkFDRV9UWVBFX0xJTkVBUl9FWFRSVVNJT04gfHwNCiAgICAgICAgc3VyZmFjZVR5cGUgPT0gQ0FEU3VyZmFjZVR5cGVzLlNVUkZBQ0VfVFlQRV9SRVZPTFVUSU9OIHx8DQogICAgICAgIHN1cmZhY2VUeXBlID09IENBRFN1cmZhY2VUeXBlcy5TVVJGQUNFX1RZUEVfT0ZGU0VUX1NVUkZBQ0UgfHwNCiAgICAgICAgc3VyZmFjZVR5cGUgPT0gQ0FEU3VyZmFjZVR5cGVzLlNVUkZBQ0VfVFlQRV9SRVZPTFVUSU9OX0ZMSVBQRURfRE9NQUlODQogICAgICApIHsNCiAgICAgICAgY2F0ZWdvcnkgPSAxOw0KICAgICAgfSBlbHNlIGlmIChzdXJmYWNlVHlwZSA9PSBDQURTdXJmYWNlVHlwZXMuU1VSRkFDRV9UWVBFX05VUkJTX1NVUkZBQ0UpIHsNCiAgICAgICAgY2F0ZWdvcnkgPSAyOw0KICAgICAgfQ0KDQogICAgICBpZiAoIWNvdW50c1tjYXRlZ29yeV0pIHsNCiAgICAgICAgY291bnRzW2NhdGVnb3J5XSA9IDE7DQogICAgICB9IGVsc2Ugew0KICAgICAgICBjb3VudHNbY2F0ZWdvcnldKys7DQogICAgICB9DQogICAgICBhZGRUb0JpbihzdXJmYWNlSWQsIGRldGFpbFUsIGRldGFpbFYsIGJpbnNMaXN0LCBiaW5zRGljdCk7DQoNCiAgICAgIC8vIGNvbnNvbGUubG9nKCdzdXJmYWNlVHlwZTonLCBnZXRTdXJmYWNlVHlwZU5hbWUoc3VyZmFjZVR5cGUpLCAiIHN1cmZhY2VJZDoiLCBzdXJmYWNlSWQsICIgZGV0YWlsOiIsZGV0YWlsVSwgIngiLCBkZXRhaWxWKTsNCg0KICAgICAgc3VyZmFjZURldGFpbHNbc3VyZmFjZUlkICogNiArIDBdID0gZXZhbGZsYWdzOw0KICAgICAgc3VyZmFjZURldGFpbHNbc3VyZmFjZUlkICogNiArIDFdID0gYWRkclg7DQogICAgICBzdXJmYWNlRGV0YWlsc1tzdXJmYWNlSWQgKiA2ICsgMl0gPSBhZGRyWTsNCiAgICAgIHN1cmZhY2VEZXRhaWxzW3N1cmZhY2VJZCAqIDYgKyAzXSA9IGNhdGVnb3J5Ow0KICAgICAgc3VyZmFjZURldGFpbHNbc3VyZmFjZUlkICogNiArIDRdID0gZGV0YWlsVTsNCiAgICAgIHN1cmZhY2VEZXRhaWxzW3N1cmZhY2VJZCAqIDYgKyA1XSA9IGRldGFpbFY7DQoNCiAgICAgIHRvdGFsRGV0YWlsICs9IGRldGFpbFUgKiBkZXRhaWxWOw0KICAgICAgLy8gY29uc29sZS5sb2coJ3N1cmZhY2VUeXBlOicsIGdldFN1cmZhY2VUeXBlTmFtZShzdXJmYWNlVHlwZSksICIgc3VyZmFjZUlkOiIsIHN1cmZhY2VJZCwgIiBkZXRhaWw6IixkZXRhaWxVLCAieCIsIGRldGFpbFYpOw0KDQogICAgfSBjYXRjaCAoZSkgew0KICAgICAgY29uc29sZS53YXJuKCJFcnJvciB3aGlsZSByZWFkaW5nIFN1cmZhY2UgZGF0YSBpbiB3ZWIgd29ya2VyOiAiLCBzdXJmYWNlSWQsIGUpOw0KICAgIH0NCiAgfQ0KDQogIC8vIGNvbnNvbGUubG9nKCdudW1TdXJmYWNlczonLCBudW1TdXJmYWNlcywgJyB0b3RhbERldGFpbDonLCB0b3RhbERldGFpbCkNCg0KICAvLyAvLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vDQogIC8vIE5vdyBsYXlvdXQgdGhlIHN1cmZhY2VzIGluIGJhdGNoZXMuIEJpZ2dlc3QgdG8gc21hbGxlc3QNCiAgLy8gVGhlIGNvb3JkaW5hdGVzIGZvciB0aGUgcGF0Y2hlcyBpbiB0aGUgZ2VvbSB0ZXh0dXJlIG5lZWQgdG8gYmUNCiAgLy8gaW4gYSB0ZXh0dXJlIHRoYXQgd2UgYmluZCB0byB0aGUgR0xFdmFsdWF0ZURyYXdJdGVtc1NoYWRlciwgd2hlcmUNCiAgLy8gaXQgY2FuIHNjYXR0ZXIgdGhlIHZhbHVlcyBpbnRvIHRoZSBkcmF3IGluc3RhbmNlcy4NCiAgY29uc3QgaXRlbUNvdW50VVYgPSBjYWxjQ29udGFpbmVyU2l6ZShudW1TdXJmYWNlcywgMiAvKiBwaXhlbHMgcGVyIGl0ZW0gKi8sIDEpOw0KICBjb25zdCBzdXJmYWNlc0F0bGFzTGF5b3V0VGV4dHVyZVNpemUgPSBbaXRlbUNvdW50VVZbMF0gKiAyLCBpdGVtQ291bnRVVlsxXV07DQogIGNvbnN0IHN1cmZhY2VzQXRsYXNMYXlvdXQgPSBuZXcgRmxvYXQzMkFycmF5KA0KICAgIGl0ZW1Db3VudFVWWzBdICoNCiAgICAyIC8qIHBpeGVscyBwZXIgaXRlbSAqLyAqDQogICAgICBpdGVtQ291bnRVVlsxXSAqDQogICAgICA0IC8qIGNoYW5uZWxzIHBlciBwaXhlbCovDQogICk7DQoNCiAgY29uc3Qgc3VyZmFjZXNFdmFsQXR0cnMgPSBbXTsNCiAgZm9yIChjb25zdCBjYXRlZ29yeSBpbiBjb3VudHMpIHsNCiAgICBjb25zdCBjb3VudCA9IGNvdW50c1tjYXRlZ29yeV07DQogICAgc3VyZmFjZXNFdmFsQXR0cnNbcGFyc2VJbnQoY2F0ZWdvcnkpXSA9IG5ldyBGbG9hdDMyQXJyYXkoDQogICAgICBjb3VudCAvKiBmbG9hdHMgcGVyIGl0ZW0gKi8NCiAgICApOw0KICAgIC8vIHJlc2V0IHNvIHdlIGNhbiByZS1jb3VudA0KICAgIGNvdW50c1tjYXRlZ29yeV0gPSBudWxsOw0KICB9DQogIGxheW91dEJpbnMoDQogICAgYmluc0xpc3QsDQogICAgX19zdXJmYWNlUGFja2VyLA0KICAgIChiaW4sIGksIHUsIHYpID0+IHsNCiAgICAgIGNvbnN0IHN1cmZhY2VJZCA9IGJpbi5pZHNbaV07DQogICAgICAvLyBjb25zb2xlLmxvZygic3VyZmFjZUlkOiIgKyBzdXJmYWNlSWQgKyAiIHU6IiArdSArICIgdjoiICsgdiArICIgdzoiICsgYmluLml0ZW1XaWR0aCArICIgaDoiICsgYmluLml0ZW1IZWlnaHQpOw0KICAgICAgY29uc3QgZmxhZ3MgPSBzdXJmYWNlRGV0YWlsc1tzdXJmYWNlSWQgKiA2ICsgMF07DQogICAgICBjb25zdCBhZGRyWCA9IHN1cmZhY2VEZXRhaWxzW3N1cmZhY2VJZCAqIDYgKyAxXTsNCiAgICAgIGNvbnN0IGFkZHJZID0gc3VyZmFjZURldGFpbHNbc3VyZmFjZUlkICogNiArIDJdOw0KICAgICAgY29uc3QgY2F0ZWdvcnkgPSBzdXJmYWNlRGV0YWlsc1tzdXJmYWNlSWQgKiA2ICsgM107DQogICAgICAvLyBjb25zb2xlLmxvZygic3VyZmFjZUlkOiIgKyBzdXJmYWNlSWQgKyAiIGFkZHJYOiIgK2FkZHJYICsgIiBhZGRyWToiICsgYWRkclkgKyAiIGNhdGVnb3J5OiIgKyBjYXRlZ29yeSk7DQoNCiAgICAgIHN1cmZhY2VzQXRsYXNMYXlvdXRbc3VyZmFjZUlkICogdmFsdWVzUGVyU3VyZmFjZUxpYnJhcnlMYXlvdXRJdGVtICsgMF0gPSB1Ow0KICAgICAgc3VyZmFjZXNBdGxhc0xheW91dFtzdXJmYWNlSWQgKiB2YWx1ZXNQZXJTdXJmYWNlTGlicmFyeUxheW91dEl0ZW0gKyAxXSA9IHY7DQogICAgICBzdXJmYWNlc0F0bGFzTGF5b3V0W3N1cmZhY2VJZCAqIHZhbHVlc1BlclN1cmZhY2VMaWJyYXJ5TGF5b3V0SXRlbSArIDJdID0NCiAgICAgICAgYmluLml0ZW1XaWR0aDsNCiAgICAgIHN1cmZhY2VzQXRsYXNMYXlvdXRbc3VyZmFjZUlkICogdmFsdWVzUGVyU3VyZmFjZUxpYnJhcnlMYXlvdXRJdGVtICsgM10gPQ0KICAgICAgICBiaW4uaXRlbUhlaWdodDsNCg0KICAgICAgc3VyZmFjZXNBdGxhc0xheW91dFsNCiAgICAgICAgc3VyZmFjZUlkICogdmFsdWVzUGVyU3VyZmFjZUxpYnJhcnlMYXlvdXRJdGVtICsgNA0KICAgICAgXSA9IGFkZHJYOw0KICAgICAgc3VyZmFjZXNBdGxhc0xheW91dFsNCiAgICAgICAgc3VyZmFjZUlkICogdmFsdWVzUGVyU3VyZmFjZUxpYnJhcnlMYXlvdXRJdGVtICsgNQ0KICAgICAgXSA9IGFkZHJZOw0KICAgICAgc3VyZmFjZXNBdGxhc0xheW91dFsNCiAgICAgICAgc3VyZmFjZUlkICogdmFsdWVzUGVyU3VyZmFjZUxpYnJhcnlMYXlvdXRJdGVtICsgNg0KICAgICAgXSA9IGZsYWdzOw0KICAgICAgaWYgKGNvdW50c1tjYXRlZ29yeV0gPT09IG51bGwpIHsNCiAgICAgICAgY291bnRzW2NhdGVnb3J5XSA9IDA7DQogICAgICB9IGVsc2Ugew0KICAgICAgICBjb3VudHNbY2F0ZWdvcnldKys7DQogICAgICB9DQogICAgICBzdXJmYWNlc0V2YWxBdHRyc1tjYXRlZ29yeV1bY291bnRzW2NhdGVnb3J5XV0gPSBzdXJmYWNlSWQ7DQogICAgfQ0KICAgIC8qICwgKGJpbiwgYmxvY2spPT57DQogICAgICAgIGNvbnNvbGUubG9nKFtfX3N1cmZhY2VQYWNrZXIucm9vdC53LCBfX3N1cmZhY2VQYWNrZXIucm9vdC5oXSArICI6IiArIFtiaW4uaXRlbVdpZHRoLCBiaW4uaXRlbUhlaWdodF0gKyAiOiIgKyBiaW4uaXRlbUNvdW50VVYgKyAiOiIgKyBbYmluLncsIGJpbi5oXSkNCiAgICAgIH0qLw0KICApOw0KDQogIHdvcmtlclN0YXRlLnN1cmZhY2VEZXRhaWxzID0gc3VyZmFjZURldGFpbHM7DQoNCiAgcmV0dXJuIHsNCiAgICBudW1TdXJmYWNlcywNCiAgICBzdXJmYWNlc0F0bGFzTGF5b3V0LA0KICAgIHN1cmZhY2VzRXZhbEF0dHJzLA0KICAgIHN1cmZhY2VzQXRsYXNMYXlvdXRUZXh0dXJlU2l6ZSwNCiAgfQ0KfTsNCg0KY29uc3QgbGF5b3V0VHJpbVNldHMgPSAoDQogIHRyaW1TZXRzUmVhZGVyLA0KICBjYWREYXRhVmVyc2lvbiwNCiAgY3VydmVzQXRsYXNMYXlvdXQsDQogIGxvZCwNCiAgdHJpbVRleGVsU2l6ZQ0KKSA9PiB7DQogIGNvbnN0IG51bVRyaW1TZXRzID0gdHJpbVNldHNSZWFkZXIubG9hZFVJbnQzMigpOw0KICBsZXQgdHJpbVNldHNCdWZmZXJIZWFkZXIgPSA0Ow0KICBpZiAoY2FkRGF0YVZlcnNpb24ucGF0Y2ggPiAwIHx8IGNhZERhdGFWZXJzaW9uLm1pbm9yID4gMCB8fCBjYWREYXRhVmVyc2lvbi5tYWpvciA+IDApIHsNCiAgICB0cmltU2V0c0J1ZmZlckhlYWRlciA9IDg7DQogIH0NCg0KICAvLyBUaGUgY29vcmRpbmF0ZXMgZm9yIHRoZSBwYXRjaGVzIGluIHRoZSB0cmltIHRleHR1cmUgbmVlZCB0byBiZQ0KICAvLyBpbiBhIHRleHR1cmUgdGhhdCB3ZSBiaW5kIHRvIHRoZSBHTEV2YWx1YXRlRHJhd0l0ZW1zU2hhZGVyLCB3aGVyZQ0KICAvLyBpdCBjYW4gc2NhdHRlciB0aGUgdmFsdWVzIGludG8gdGhlIGRyYXcgaW5zdGFuY2VzLg0KICBjb25zdCB0cmltU2V0c0F0bGFzTGF5b3V0VGV4dHVyZVNpemUgPSBjYWxjQ29udGFpbmVyU2l6ZShudW1UcmltU2V0cywgMSwgMSk7DQogIGNvbnN0IHRyaW1TZXRzQXRsYXNMYXlvdXREYXRhID0gbmV3IEZsb2F0MzJBcnJheSgNCiAgICB0cmltU2V0c0F0bGFzTGF5b3V0VGV4dHVyZVNpemVbMF0gKiB0cmltU2V0c0F0bGFzTGF5b3V0VGV4dHVyZVNpemVbMV0gKiA0DQogICk7DQoNCiAgY29uc3QgbG9hZEN1cnZlUmVmID0gKGxvb3BTdGFydFBvcywgY3VydmVJbmRleFdpdGhpbkxvb3ApID0+IHsNCiAgICBjb25zdCBjdXJ2ZUlkID0gdHJpbVNldHNSZWFkZXIubG9hZEZsb2F0MzIoKTsNCiAgICBjb25zdCB0cl94ID0gdHJpbVNldHNSZWFkZXIubG9hZEZsb2F0MzIoKTsNCiAgICBjb25zdCB0cl95ID0gdHJpbVNldHNSZWFkZXIubG9hZEZsb2F0MzIoKTsNCiAgICBjb25zdCByb3cwX3ggPSB0cmltU2V0c1JlYWRlci5sb2FkRmxvYXQzMigpOw0KICAgIGNvbnN0IHJvdzBfeSA9IHRyaW1TZXRzUmVhZGVyLmxvYWRGbG9hdDMyKCk7DQogICAgY29uc3Qgcm93MV94ID0gdHJpbVNldHNSZWFkZXIubG9hZEZsb2F0MzIoKTsNCiAgICBjb25zdCByb3cxX3kgPSB0cmltU2V0c1JlYWRlci5sb2FkRmxvYXQzMigpOw0KICAgIGNvbnN0IGZsYWdzID0gdHJpbVNldHNSZWFkZXIubG9hZEZsb2F0MzIoKTsNCg0KICAgIC8vIGNvbnNvbGUubG9nKCJDdXJ2ZVJlZiA6IiwgY3VydmVJZCwgIiBmbGFnczoiLCBmbGFncyk7DQogICAgLy8gTm90ZTogdGhlIGN1cnZlIGxheW91dCBzdG9yZXMgdGhlIG51bWJlciBvZiB2ZXJ0aWNlcywgbm90IHRoZSAnZGV0YWlsJyB2YWx1ZSwgd2hpY2gNCiAgICAvLyBpcyB3aGF0IHdlIGV4cGVjdCBoZXJlLg0KICAgIGNvbnN0IGRldGFpbCA9DQogICAgICBjdXJ2ZXNBdGxhc0xheW91dFtjdXJ2ZUlkICogdmFsdWVzUGVyQ3VydmVMaWJyYXJ5TGF5b3V0SXRlbSArIDJdIC0gMTsNCiAgICBjb25zdCByZXN1bHQgPSB7DQogICAgICAvKiBsb29wU3RhcnRQb3MsDQogICAgICBjdXJ2ZUluZGV4V2l0aGluTG9vcCwqLw0KICAgICAgY3VydmVJZCwNCiAgICAgIGFkZHI6IFsNCiAgICAgICAgY3VydmVzQXRsYXNMYXlvdXRbY3VydmVJZCAqIHZhbHVlc1BlckN1cnZlTGlicmFyeUxheW91dEl0ZW0gKyAwXSwNCiAgICAgICAgY3VydmVzQXRsYXNMYXlvdXRbY3VydmVJZCAqIHZhbHVlc1BlckN1cnZlTGlicmFyeUxheW91dEl0ZW0gKyAxXSwNCiAgICAgIF0sDQogICAgICBkZXRhaWwsDQogICAgICB0cjogW3RyX3gsIHRyX3ldLA0KICAgICAgcm93MDogW3JvdzBfeCwgcm93MF95XSwNCiAgICAgIHJvdzE6IFtyb3cxX3gsIHJvdzFfeV0sDQogICAgICBmbGFncywNCiAgICB9Ow0KICAgIHJldHVybiByZXN1bHQNCiAgfTsNCg0KICBjb25zdCBnZXRUcmltU2V0Q3VydmVSZWZzID0gdHJpbVNldElkID0+IHsNCiAgICB0cmltU2V0c1JlYWRlci5zZWVrKHRyaW1TZXRzQnVmZmVySGVhZGVyICsgdHJpbVNldElkICogNCk7DQogICAgdHJpbVNldHNSZWFkZXIuc2Vlayh0cmltU2V0c1JlYWRlci5sb2FkVUludDMyKCkgKyA4KTsNCg0KICAgIGNvbnN0IG51bUhvbGVzID0gdHJpbVNldHNSZWFkZXIubG9hZFVJbnQzMigpOw0KICAgIGNvbnN0IHBlcmltZXRlclN0YXJ0ID0gdHJpbVNldHNSZWFkZXIucG9zKCk7DQogICAgY29uc3QgbnVtUGVybWl0ZXJDdXJ2ZXMgPSB0cmltU2V0c1JlYWRlci5sb2FkVUludDMyKCk7DQogICAgY29uc3QgdHJpbVNldEN1cnZlUmVmcyA9IFtdOw0KICAgIGZvciAobGV0IGkgPSAwOyBpIDwgbnVtUGVybWl0ZXJDdXJ2ZXM7IGkrKykgew0KICAgICAgdHJpbVNldEN1cnZlUmVmcy5wdXNoKGxvYWRDdXJ2ZVJlZigpKTsNCiAgICB9DQogICAgZm9yIChsZXQgaSA9IDA7IGkgPCBudW1Ib2xlczsgaSsrKSB7DQogICAgICBjb25zdCBob2xlU3RhcnQgPSB0cmltU2V0c1JlYWRlci5wb3MoKTsNCiAgICAgIGNvbnN0IG51bUhvbGVDdXJ2ZXMgPSB0cmltU2V0c1JlYWRlci5sb2FkVUludDMyKCk7DQogICAgICBmb3IgKGxldCBqID0gMDsgaiA8IG51bUhvbGVDdXJ2ZXM7IGorKykgew0KICAgICAgICBjb25zdCBjdXJ2ZVJlZiA9IGxvYWRDdXJ2ZVJlZigpOw0KICAgICAgICB0cmltU2V0Q3VydmVSZWZzLnB1c2goY3VydmVSZWYpOw0KICAgICAgfQ0KICAgIH0NCiAgICAvLyBpZih0cmltU2V0SWQ9PTApew0KICAgIC8vICAgLy8gY29uc3QgdHJpbVNldEN1cnZlUmVmcyA9IGdldFRyaW1TZXRDdXJ2ZVJlZnModHJpbVNldElkKTsNCiAgICAvLyAgIGNvbnNvbGUubG9nKHRyaW1TZXRDdXJ2ZVJlZnMpDQogICAgLy8gICB0cmltU2V0Q3VydmVSZWZzLnNwbGljZSgwLCAxKQ0KICAgIC8vIH0NCiAgICByZXR1cm4gdHJpbVNldEN1cnZlUmVmcw0KICB9Ow0KDQogIGNvbnN0IGJpbnNMaXN0ID0gW107DQogIGNvbnN0IGJpbnNEaWN0ID0ge307DQogIGNvbnN0IHRyaW1TZXRCb3JkZXIgPSAxOw0KDQogIGZvciAobGV0IHRyaW1TZXRJZCA9IDA7IHRyaW1TZXRJZCA8IG51bVRyaW1TZXRzOyB0cmltU2V0SWQrKykgew0KICAgIHRyeSB7DQogICAgICAvLyBpZih0cmltU2V0SWQgIT0gMjApIHsNCiAgICAgIC8vICAgY29udGludWU7DQogICAgICAvLyB9DQogICAgICB0cmltU2V0c1JlYWRlci5zZWVrKHRyaW1TZXRzQnVmZmVySGVhZGVyICsgdHJpbVNldElkICogNCk7DQogICAgICB0cmltU2V0c1JlYWRlci5zZWVrKHRyaW1TZXRzUmVhZGVyLmxvYWRVSW50MzIoKSk7DQogICAgICBjb25zdCBzaXplVSA9IHRyaW1TZXRzUmVhZGVyLmxvYWRGbG9hdDMyKCk7DQogICAgICBjb25zdCBzaXplViA9IHRyaW1TZXRzUmVhZGVyLmxvYWRGbG9hdDMyKCk7DQoNCiAgICAgIC8vIGlmIChzaXplVSA+IDIwMCB8fCBzaXplViA+IDIwMCkNCiAgICAgICAgLy8gY29uc29sZS5sb2coIiB0cmltU2V0SWQ6IiwgdHJpbVNldElkLCAiIHNpemU6IixzaXplVSwgIngiLCBzaXplVik7DQoNCiAgICAgIGlmIChpc05hTihzaXplVSkgfHwgaXNOYU4oc2l6ZVYpKSB7DQogICAgICAgIGNvbnNvbGUud2FybignVW5hYmxlIHRvIGxheW91dCBpdGVtOicgKyBzaXplVSArICcgeCAnICsgc2l6ZVYpOw0KICAgICAgICBjb250aW51ZQ0KICAgICAgfQ0KICAgICAgLy8gTm90ZTogU3VidHJhY3Qgb2ZmIHRoZSBib3JkZXIgd2lkdGguDQogICAgICBjb25zdCBudW1QaXhlbHNVID0gTWF0aC5tYXgoDQogICAgICAgIDEsDQogICAgICAgIG5lYXJlc3RQb3cyKE1hdGguY2VpbChzaXplVSAvIHRyaW1UZXhlbFNpemUpKS10cmltU2V0Qm9yZGVyDQogICAgICApOw0KICAgICAgY29uc3QgbnVtUGl4ZWxzViA9IE1hdGgubWF4KA0KICAgICAgICAxLA0KICAgICAgICBuZWFyZXN0UG93MihNYXRoLmNlaWwoc2l6ZVYgLyB0cmltVGV4ZWxTaXplKSktdHJpbVNldEJvcmRlcg0KICAgICAgKTsNCiAgICAgIC8vIGlmKG51bVBpeGVsc1UgPiAxIHx8IG51bVBpeGVsc1YgPiAxKQ0KICAgICAgLy8gICBjb25zb2xlLmxvZygiVHJpbVNldDoiICsgaSArICIgc2l6ZToiICsgc2l6ZVUgKyAiOiIgKyBzaXplViArICIgIiArIG51bVBpeGVsc1UgKyAiLCIgKyBudW1QaXhlbHNWKQ0KICAgICAgaWYgKGlzTmFOKG51bVBpeGVsc1UpIHx8IGlzTmFOKG51bVBpeGVsc1YpKSB7DQogICAgICAgIGNvbnNvbGUud2FybignVW5hYmxlIHRvIGxheW91dCBpdGVtOicgKyBudW1QaXhlbHNVICsgJyB4ICcgKyBudW1QaXhlbHNWKTsNCiAgICAgICAgY29udGludWUNCiAgICAgIH0NCiAgICAgIGFkZFRvQmluKA0KICAgICAgICB0cmltU2V0SWQsDQogICAgICAgIG51bVBpeGVsc1UgKyB0cmltU2V0Qm9yZGVyICogMiwNCiAgICAgICAgbnVtUGl4ZWxzViArIHRyaW1TZXRCb3JkZXIgKiAyLA0KICAgICAgICBiaW5zTGlzdCwNCiAgICAgICAgYmluc0RpY3QNCiAgICAgICk7DQogICAgfSBjYXRjaCAoZSkgew0KICAgICAgY29uc29sZS53YXJuKCJFcnJvciB3aGlsZSByZWFkaW5nIFRyaW1TZXQgZGF0YSBpbiB3ZWIgd29ya2VyOiAiLCB0cmltU2V0SWQsIGUpOw0KICAgIH0NCiAgfQ0KDQogIC8vIC8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8NCiAgLy8gU29ydCB0aGUgYmlucyBpbnRvIGJpZ2dlc3QgdG8gc21hbGxlc3Qgc28gd2UgcGFjayB0aGUgYmlnZ2VyIG9uZXMgZmlyc3QuDQoNCiAgY29uc3QgdHJpbUN1cnZlRHJhd1NldHNfdG1wID0ge307DQoNCiAgbGF5b3V0QmlucygNCiAgICBiaW5zTGlzdCwNCiAgICBfX3RyaW1TZXRQYWNrZXIsDQogICAgKGJpbiwgaSwgdSwgdikgPT4gew0KICAgICAgY29uc3QgdHJpbVNldElkID0gYmluLmlkc1tpXTsNCg0KICAgICAgY29uc3QgdHJpbVNldEN1cnZlUmVmcyA9IGdldFRyaW1TZXRDdXJ2ZVJlZnModHJpbVNldElkKTsNCiAgICAgIC8vIGlmKHRyaW1TZXRJZD09MCkgew0KICAgICAgLy8gICBjb25zb2xlLmxvZygiVHJpbVNldDoiLCBbdSt0cmltU2V0Qm9yZGVyLCB2K3RyaW1TZXRCb3JkZXIsIGJpbi5pdGVtV2lkdGgtKHRyaW1TZXRCb3JkZXIqMiksIGJpbi5pdGVtSGVpZ2h0LSh0cmltU2V0Qm9yZGVyKjIpXSkNCiAgICAgIC8vIH0NCg0KICAgICAgLy8gY29uc29sZS5sb2coIlRyaW1TZXQ6IiwgW3UrdHJpbVNldEJvcmRlciwgdit0cmltU2V0Qm9yZGVyLCBiaW4uaXRlbVdpZHRoLSh0cmltU2V0Qm9yZGVyKjIpLCBiaW4uaXRlbUhlaWdodC0odHJpbVNldEJvcmRlcioyKV0pDQoNCiAgICAgIC8vIEdlbmVyYXRpbmcgdGhlIHRleHR1cmUgdG8gYmUgcmVhZCBmcm9tIGR1cmluZyBpbnN0YW5jZSByYXN0ZXJpemF0aW9uLihHTEV2YWx1YXRlRHJhd0l0ZW1zU2hhZGVyKQ0KICAgICAgdHJpbVNldHNBdGxhc0xheW91dERhdGFbdHJpbVNldElkICogNCArIDBdID0gdSArIHRyaW1TZXRCb3JkZXI7DQogICAgICB0cmltU2V0c0F0bGFzTGF5b3V0RGF0YVt0cmltU2V0SWQgKiA0ICsgMV0gPSB2ICsgdHJpbVNldEJvcmRlcjsNCiAgICAgIHRyaW1TZXRzQXRsYXNMYXlvdXREYXRhW3RyaW1TZXRJZCAqIDQgKyAyXSA9DQogICAgICAgIGJpbi5pdGVtV2lkdGggLSB0cmltU2V0Qm9yZGVyICogMjsNCiAgICAgIHRyaW1TZXRzQXRsYXNMYXlvdXREYXRhW3RyaW1TZXRJZCAqIDQgKyAzXSA9DQogICAgICAgIGJpbi5pdGVtSGVpZ2h0IC0gdHJpbVNldEJvcmRlciAqIDI7DQoNCiAgICAgIGZvciAoY29uc3QgdHJpbUN1cnZlIG9mIHRyaW1TZXRDdXJ2ZVJlZnMpIHsNCiAgICAgICAgbGV0IGRyYXdTZXQgPSB0cmltQ3VydmVEcmF3U2V0c190bXBbdHJpbUN1cnZlLmRldGFpbF07DQogICAgICAgIGlmICghZHJhd1NldCkgew0KICAgICAgICAgIGRyYXdTZXQgPSBbXTsNCiAgICAgICAgICB0cmltQ3VydmVEcmF3U2V0c190bXBbdHJpbUN1cnZlLmRldGFpbF0gPSBkcmF3U2V0Ow0KICAgICAgICB9DQoNCiAgICAgICAgLy8gcGF0Y2hDb29yZHMNCiAgICAgICAgZHJhd1NldC5wdXNoKHUgKyB0cmltU2V0Qm9yZGVyKTsNCiAgICAgICAgZHJhd1NldC5wdXNoKHYgKyB0cmltU2V0Qm9yZGVyKTsNCiAgICAgICAgZHJhd1NldC5wdXNoKGJpbi5pdGVtV2lkdGggLSB0cmltU2V0Qm9yZGVyICogMik7DQogICAgICAgIGRyYXdTZXQucHVzaChiaW4uaXRlbUhlaWdodCAtIHRyaW1TZXRCb3JkZXIgKiAyKTsNCg0KICAgICAgICAvLyBkYXRhMCAodmVjNCkNCiAgICAgICAgZHJhd1NldC5wdXNoKHRyaW1DdXJ2ZS50clswXSk7DQogICAgICAgIGRyYXdTZXQucHVzaCh0cmltQ3VydmUudHJbMV0pOw0KICAgICAgICBkcmF3U2V0LnB1c2godHJpbUN1cnZlLnJvdzBbMF0pOw0KICAgICAgICBkcmF3U2V0LnB1c2godHJpbUN1cnZlLnJvdzBbMV0pOw0KDQogICAgICAgIC8vIGRhdGExICh2ZWM0KQ0KICAgICAgICBkcmF3U2V0LnB1c2godHJpbUN1cnZlLnJvdzFbMF0pOw0KICAgICAgICBkcmF3U2V0LnB1c2godHJpbUN1cnZlLnJvdzFbMV0pOw0KICAgICAgICBkcmF3U2V0LnB1c2godHJpbUN1cnZlLmFkZHJbMF0pOw0KICAgICAgICBkcmF3U2V0LnB1c2godHJpbUN1cnZlLmFkZHJbMV0pOw0KDQogICAgICAgIGRyYXdTZXQucHVzaCh0cmltQ3VydmUuZmxhZ3MpOw0KICAgICAgICBkcmF3U2V0LnB1c2godHJpbUN1cnZlLmN1cnZlSWQpOw0KDQogICAgICAgIC8vIGRyYXdTZXQucHVzaChsb29wU3RhcnRQb3MpOw0KICAgICAgICAvLyBkcmF3U2V0LnB1c2goY3VydmVJbmRleFdpdGhpbkxvb3ApOw0KICAgICAgfQ0KICAgIH0NCiAgICAvKiAsIChiaW4sIGJsb2NrKT0+ew0KICAgICAgICAgIGNvbnNvbGUubG9nKCJMYXlvdXQgVHJpbVNldCBiaW46IiArIGJpbi5pdGVtQ291bnRVViArICIgPiAiICsgYmxvY2sueCArICIsIiArIGJsb2NrLnkgKyAiICIgKyBiaW4udyArICIsIiArIGJpbi5oKTsNCiAgICAgIH0qLw0KICApOw0KDQogIC8vIE5vdyBjb252ZXJ0IGFsbCB0aGUgZHJhdyBzZXRzIHRvIHR5cGVkIGFycmF5cw0KICBjb25zdCB0cmltQ3VydmVEcmF3U2V0cyA9IHt9Ow0KICBmb3IgKGNvbnN0IGtleSBpbiB0cmltQ3VydmVEcmF3U2V0c190bXApIHsNCiAgICB0cmltQ3VydmVEcmF3U2V0c1trZXldID0gRmxvYXQzMkFycmF5LmZyb20odHJpbUN1cnZlRHJhd1NldHNfdG1wW2tleV0pOw0KICB9DQoNCiAgcmV0dXJuIHsNCiAgICB0cmltQ3VydmVEcmF3U2V0cywNCiAgICB0cmltU2V0c0F0bGFzTGF5b3V0RGF0YSwNCiAgICB0cmltU2V0c0F0bGFzTGF5b3V0VGV4dHVyZVNpemUsDQogIH0NCn07DQoNCmxldCBnZXRCb2R5RGVzY0RhdGE7DQoNCmNvbnN0IGxheW91dEJvZHlJdGVtcyA9ICgNCiAgc2NlbmVCb2R5SXRlbXNEYXRhLA0KICBib2R5RGVzY1RvY1JlYWRlciwNCiAgYm9keURlc2NSZWFkZXIsDQogIGNhZERhdGFWZXJzaW9uDQopID0+IHsNCiAgY29uc3QgbnVtQm9kaWVzID0gc2NlbmVCb2R5SXRlbXNEYXRhLmxlbmd0aCAvIGZsb2F0c1BlclNjZW5lQm9keTsNCg0KICAvLyBjb25zdCBib2R5SXRlbXNMYXlvdXQgPSBuZXcgRmxvYXQzMkFycmF5KG51bUJvZGllcyAqIDQpOw0KICBjb25zdCBib2R5SXRlbXNDb29yZHMgPSBuZXcgRmxvYXQzMkFycmF5KG51bUJvZGllcyAqIGJvZHlJdGVtQ29vcmRzU3RyaWRlKTsNCiAgY29uc3QgYm9keUl0ZW1MYXlvdXRDb29yZHMgPSBuZXcgRmxvYXQzMkFycmF5KG51bUJvZGllcyAqIDUpOw0KDQogIGNvbnN0IGJ5dGVzUGVyVmFsdWUgPSA0OyAvLyAzMiBiaXQgZmxvYXRzDQogIGNvbnN0IGJ5dGVzUGVyUGl4ZWwgPSBieXRlc1BlclZhbHVlICogNDsgLy8gUkdCQSBwaXhlbHMNCiAgY29uc3QgYm9keUxpYnJhcnlCdWZmZXJUZXh0dXJlU2l6ZSA9IE1hdGguc3FydCgNCiAgICBib2R5RGVzY1JlYWRlci5ieXRlTGVuZ3RoIC8gYnl0ZXNQZXJQaXhlbA0KICApOyAvLyBSR0JBMTYgcGl4ZWxzDQoNCiAgLy8gY29uc29sZS5sb2coImJvZHlMaWJyYXJ5QnVmZmVyVGV4dHVyZVNpemU6IiArIGJvZHlMaWJyYXJ5QnVmZmVyVGV4dHVyZVNpemUpOw0KDQogIGNvbnN0IGdldEJvZHlOdW1TdXJmYWNlcyA9IGJvZHlJZCA9PiB7DQogICAgYm9keURlc2NUb2NSZWFkZXIuc2VlayhieXRlc1BlclZhbHVlICsgYm9keUlkICogKDMgKiBieXRlc1BlclZhbHVlKSk7DQogICAgY29uc3QgeCA9IGJvZHlEZXNjVG9jUmVhZGVyLmxvYWRVSW50MzIoKTsNCiAgICBjb25zdCB5ID0gYm9keURlc2NUb2NSZWFkZXIubG9hZFVJbnQzMigpOw0KICAgIC8vIGNvbnNvbGUubG9nKCJCb2R5IERlc2MgQ29vcmRzOiIgKyB4ICsgIiAsIiArIHkpOw0KDQogICAgY29uc3Qgb2Zmc2V0SW5CeXRlcyA9IDYgLyogYmJveCovICogYnl0ZXNQZXJWYWx1ZTsgLy8gc2tpcCB0aGUgYmJveA0KDQogICAgLy8gWCwgWSBpbiBwaXhlbHMuDQogICAgY29uc3QgYnl0ZU9mZnNldCA9DQogICAgICB4ICogYnl0ZXNQZXJQaXhlbCArIHkgKiBieXRlc1BlclBpeGVsICogYm9keUxpYnJhcnlCdWZmZXJUZXh0dXJlU2l6ZTsNCiAgICAvLyBjb25zb2xlLmxvZygiX19zZWVrU3VyZmFjZURhdGE6IiArIGJvZHlJZCArICIgYnl0ZU9mZnNldDoiICsgKGJ5dGVPZmZzZXQgK29mZnNldCkgKyAiIHBpeGVsOiIgKyAoKGJ5dGVPZmZzZXQgK29mZnNldCkvOCkgKyAiIHg6IiArIHggKyAiIHk6IiArIHkpOw0KICAgIGJvZHlEZXNjUmVhZGVyLnNlZWsoYnl0ZU9mZnNldCArIG9mZnNldEluQnl0ZXMpOw0KICAgIHJldHVybiBib2R5RGVzY1JlYWRlci5sb2FkRmxvYXQzMigpDQogIH07DQoNCiAgDQogIGxldCB2YWx1ZXNQZXJTdXJmYWNlUmVmOw0KICBpZiAoY2FkRGF0YVZlcnNpb24ucGF0Y2ggPCAyOSAmJiBjYWREYXRhVmVyc2lvbi5taW5vciA9PSAwICYmIGNhZERhdGFWZXJzaW9uLm1ham9yID09IDApIHsNCiAgICB2YWx1ZXNQZXJTdXJmYWNlUmVmID0gMTE7DQogIH0gZWxzZSB7DQogICAgdmFsdWVzUGVyU3VyZmFjZVJlZiA9IDE1OyAvLyBOb3cgd2UgaW5jbHVkZSBhIDQgZmxvYXQgY29sb3IgdmFsdWUgcGVyIHN1cmZhY2UgcmVmLg0KICB9DQoNCiAgZ2V0Qm9keURlc2NEYXRhID0gYm9keURlc2NJZCA9PiB7DQogICAgYm9keURlc2NUb2NSZWFkZXIuc2VlayhieXRlc1BlclZhbHVlICsgYm9keURlc2NJZCAqICgzICogYnl0ZXNQZXJWYWx1ZSkpOw0KICAgIGNvbnN0IHggPSBib2R5RGVzY1RvY1JlYWRlci5sb2FkVUludDMyKCk7DQogICAgY29uc3QgeSA9IGJvZHlEZXNjVG9jUmVhZGVyLmxvYWRVSW50MzIoKTsNCiAgICAvLyBjb25zb2xlLmxvZygiQm9keSBEZXNjIENvb3JkczoiICsgeCArICIgLCIgKyB5KTsNCg0KICAgIGNvbnN0IG9mZnNldEluQnl0ZXMgPSA2IC8qIGJib3gqLyAqIGJ5dGVzUGVyVmFsdWU7IC8vIHNraXAgdGhlIGJib3gNCg0KICAgIC8vIFgsIFkgaW4gcGl4ZWxzLg0KICAgIGNvbnN0IGJ5dGVPZmZzZXQgPQ0KICAgICAgeCAqIGJ5dGVzUGVyUGl4ZWwgKyB5ICogYnl0ZXNQZXJQaXhlbCAqIGJvZHlMaWJyYXJ5QnVmZmVyVGV4dHVyZVNpemU7DQogICAgLy8gY29uc29sZS5sb2coIl9fc2Vla1N1cmZhY2VEYXRhOiIgKyBib2R5SWQgKyAiIGJ5dGVPZmZzZXQ6IiArIChieXRlT2Zmc2V0ICtvZmZzZXQpICsgIiBwaXhlbDoiICsgKChieXRlT2Zmc2V0ICtvZmZzZXQpLzgpICsgIiB4OiIgKyB4ICsgIiB5OiIgKyB5KTsNCiAgICBib2R5RGVzY1JlYWRlci5zZWVrKGJ5dGVPZmZzZXQgKyBvZmZzZXRJbkJ5dGVzKTsNCg0KICAgIGNvbnN0IG51bUJvZHlTdXJmYWNlcyA9IGJvZHlEZXNjUmVhZGVyLmxvYWRGbG9hdDMyKCk7DQogICAgY29uc3Qgc3VyZmFjZUlkcyA9IFtdOw0KICAgIGZvciAobGV0IGkgPSAwOyBpIDwgbnVtQm9keVN1cmZhY2VzOyBpKyspIHsNCiAgICAgIGNvbnN0IGlkID0gYm9keURlc2NSZWFkZXIubG9hZEZsb2F0MzIoKTsNCiAgICAgIC8vIGNvbnNvbGUubG9nKGksICJpZDoiLCBpZCkNCiAgICAgIHN1cmZhY2VJZHMucHVzaChpZCk7DQogICAgICBib2R5RGVzY1JlYWRlci5hZHZhbmNlKCh2YWx1ZXNQZXJTdXJmYWNlUmVmIC0gMSkgKiBieXRlc1BlclZhbHVlKTsNCiAgICB9DQoNCiAgICByZXR1cm4gew0KICAgICAgeCwNCiAgICAgIHksDQogICAgICBzdXJmYWNlSWRzLA0KICAgIH0NCiAgfTsNCg0KICBjb25zdCBzdXJmYWNlRHJhd1NldHNfdG1wID0ge307DQogIGxldCBudW1TdXJmYWNlSW5zdGFuY2VzID0gMDsNCg0KICBjb25zdCBib2RpZXNfYmluc0xpc3QgPSBbXTsNCiAgY29uc3QgYm9kaWVzX2JpbnNEaWN0ID0ge307DQogIC8vIGNvbnN0IGxpZ2h0bWFwX2JpbnNMaXN0ID0gW10NCiAgLy8gY29uc3QgbGlnaHRtYXBfYmluc0RpY3QgPSB7fQ0KICBjb25zdCBudW1Cb2R5SW5zdGFuY2VTdXJmYWNlcyA9IG5ldyBVaW50MTZBcnJheShudW1Cb2RpZXMpOw0KDQogIGZvciAobGV0IGJvZHlJZCA9IDA7IGJvZHlJZCA8IG51bUJvZGllczsgYm9keUlkKyspIHsNCiAgICB0cnkgew0KICAgICAgY29uc3Qgc3Jjb2Zmc2V0ID0gYm9keUlkICogZmxvYXRzUGVyU2NlbmVCb2R5Ow0KICAgICAgY29uc3QgYm9keURlc2NJZCA9IHNjZW5lQm9keUl0ZW1zRGF0YVtzcmNvZmZzZXQgKyAwXTsNCiAgICAgIC8vIGNvbnNvbGUubG9nKCJib2R5SWQ6IiwgYm9keUlkLCAiIGJvZHlEZXNjSWQ6IiwgYm9keURlc2NJZCkNCiAgICAgIC8vIGlmKGJvZHlJZCAhPSAyKQ0KICAgICAgLy8gICBjb250aW51ZTsNCiAgICAgIGlmIChib2R5RGVzY0lkID09IC0xKSBjb250aW51ZQ0KICAgICAgY29uc3QgbnVtU3VyZmFjZXMgPSBnZXRCb2R5TnVtU3VyZmFjZXMoYm9keURlc2NJZCk7DQogICAgICBudW1Cb2R5SW5zdGFuY2VTdXJmYWNlc1tib2R5SWRdID0gbnVtU3VyZmFjZXM7DQogICAgICBudW1TdXJmYWNlSW5zdGFuY2VzICs9IG51bVN1cmZhY2VzOw0KDQogICAgICAvLyBmb3IgZWFjaCBib2R5IHdlIHdhbnQgdG8gYWxsb2NhdGUgYSByb3VnaGx5IHNxdWFyZSBxdWFkIHRoYXQgcGFja3MgYWxsIHRoZSBkcmF3IGRhdGEgZm9yIGVhY2ggc3VyZmFjZS4NCiAgICAgIGNvbnN0IGJpblNpemUgPSBjYWxjQ29udGFpbmVyU2l6ZShudW1TdXJmYWNlcywgcGl4ZWxzUGVyRHJhd0l0ZW0sIDEpOw0KICAgICAgYWRkVG9CaW4oDQogICAgICAgIGJvZHlJZCwNCiAgICAgICAgYmluU2l6ZVswXSAqIHBpeGVsc1BlckRyYXdJdGVtLA0KICAgICAgICBiaW5TaXplWzFdLA0KICAgICAgICBib2RpZXNfYmluc0xpc3QsDQogICAgICAgIGJvZGllc19iaW5zRGljdA0KICAgICAgKTsNCiAgICB9IGNhdGNoIChlKSB7DQogICAgICBjb25zb2xlLndhcm4oIkVycm9yIHdoaWxlIHJlYWRpbmcgQ0FEQm9keURlc2MgZGF0YSBpbiB3ZWIgd29ya2VyOiAiLCBib2R5SWQsIGUpOw0KICAgIH0NCiAgfQ0KDQogIGxheW91dEJpbnMoYm9kaWVzX2JpbnNMaXN0LCBfX2JvZHlBdGxhc1BhY2tlciwgKGJpbiwgaSwgdSwgdikgPT4gew0KICAgIGNvbnN0IGJvZHlJZCA9IGJpbi5pZHNbaV07DQogICAgY29uc3Qgc3Jjb2Zmc2V0ID0gYm9keUlkICogZmxvYXRzUGVyU2NlbmVCb2R5Ow0KDQogICAgY29uc3QgYm9keURlc2NJZCA9IHNjZW5lQm9keUl0ZW1zRGF0YVtzcmNvZmZzZXQgKyAwXTsNCiAgICBjb25zdCBzaGFkZXJJZCA9IHNjZW5lQm9keUl0ZW1zRGF0YVtzcmNvZmZzZXQgKyAyXTsNCiAgICBjb25zdCBib2R5RGVzYyA9IGdldEJvZHlEZXNjRGF0YShib2R5RGVzY0lkKTsNCiAgICBjb25zdCBib2R5Q291bnRVViA9IFtiaW4uaXRlbVdpZHRoIC8gcGl4ZWxzUGVyRHJhd0l0ZW0sIGJpbi5pdGVtSGVpZ2h0XTsNCg0KICAgIC8vIGNvbnNvbGUubG9nKCJCb2R5OiIsIGJvZHlJZCwgIiBib2R5RGVzYzoiLCBib2R5RGVzYyk7DQogICAgLy8gY29uc29sZS5sb2coIkJvZHk6IiwgYm9keUlkLCAiIGZsYWdzOiIsIHNjZW5lQm9keUl0ZW1zRGF0YVtzcmNvZmZzZXQgKyAxXSk7DQogICAgLy8gY29uc29sZS5sb2coIkJvZHk6IiArIGJvZHlJZCArICIgbnVtU3VyZmFjZXM6IiArIG51bVN1cmZhY2VzICsgIiBiaW5TaXplOiIgKyBiaW5TaXplKTsNCiAgICANCg0KICAgIGJvZHlJdGVtTGF5b3V0Q29vcmRzW2JvZHlJZCAqIDUgKyAwXSA9IGJvZHlEZXNjSWQ7DQogICAgYm9keUl0ZW1MYXlvdXRDb29yZHNbYm9keUlkICogNSArIDFdID0gdTsNCiAgICBib2R5SXRlbUxheW91dENvb3Jkc1tib2R5SWQgKiA1ICsgMl0gPSB2Ow0KICAgIGJvZHlJdGVtTGF5b3V0Q29vcmRzW2JvZHlJZCAqIDUgKyAzXSA9IGJvZHlDb3VudFVWWzBdOw0KICAgIGJvZHlJdGVtTGF5b3V0Q29vcmRzW2JvZHlJZCAqIDUgKyA0XSA9IGJvZHlDb3VudFVWWzFdOw0KDQogICAgbGV0IHRndG9mZnNldCA9IGJvZHlJZCAqIGJvZHlJdGVtQ29vcmRzU3RyaWRlOw0KICAgIC8vIE5vdGU6IHdlIGFyZSBub3QgeWV0IHNlbmRpbmcgdGhlIGJvZHkgSWQgb3Igb3RoZXIgbWV0YSBkYXRhIHlldC4NCiAgICBib2R5SXRlbXNDb29yZHNbdGd0b2Zmc2V0ICsgMF0gPSAwOyAvLyBhc3NldElkOyAvLyBhc3NldElkDQogICAgYm9keUl0ZW1zQ29vcmRzW3RndG9mZnNldCArIDFdID0gYm9keUlkOyAvLyBib2R5SWQNCiAgICBib2R5SXRlbXNDb29yZHNbdGd0b2Zmc2V0ICsgMl0gPSBzY2VuZUJvZHlJdGVtc0RhdGFbc3Jjb2Zmc2V0ICsgMV07IC8vIGZsYWdzLg0KICAgIGJvZHlJdGVtc0Nvb3Jkc1t0Z3RvZmZzZXQgKyAzXSA9IDA7IC8vIGF2YWlsYWJsZS4NCg0KICAgIGJvZHlJdGVtc0Nvb3Jkc1t0Z3RvZmZzZXQgKyA0XSA9IGJvZHlEZXNjLng7IC8vIHNyYyBib2R5RGF0YSBjb29yZC54DQogICAgYm9keUl0ZW1zQ29vcmRzW3RndG9mZnNldCArIDVdID0gYm9keURlc2MueTsgLy8gc3JjIGJvZHlEYXRhIGNvb3JkLnkNCiAgICBib2R5SXRlbXNDb29yZHNbdGd0b2Zmc2V0ICsgNl0gPSBzY2VuZUJvZHlJdGVtc0RhdGFbc3Jjb2Zmc2V0ICsgM107IC8vIHNyYyBnbG1hdGVyaWFsY29vcmRzLngNCiAgICBib2R5SXRlbXNDb29yZHNbdGd0b2Zmc2V0ICsgN10gPSBzY2VuZUJvZHlJdGVtc0RhdGFbc3Jjb2Zmc2V0ICsgNF07IC8vIHNyYyBnbG1hdGVyaWFsY29vcmRzLnkNCg0KICAgIGJvZHlJdGVtc0Nvb3Jkc1t0Z3RvZmZzZXQgKyA4XSA9IHNjZW5lQm9keUl0ZW1zRGF0YVtzcmNvZmZzZXQgKyA1XTsgLy8gdHIueA0KICAgIGJvZHlJdGVtc0Nvb3Jkc1t0Z3RvZmZzZXQgKyA5XSA9IHNjZW5lQm9keUl0ZW1zRGF0YVtzcmNvZmZzZXQgKyA2XTsgLy8gdHIueQ0KICAgIGJvZHlJdGVtc0Nvb3Jkc1t0Z3RvZmZzZXQgKyAxMF0gPSBzY2VuZUJvZHlJdGVtc0RhdGFbc3Jjb2Zmc2V0ICsgN107IC8vIHRyLnoNCg0KICAgIGJvZHlJdGVtc0Nvb3Jkc1t0Z3RvZmZzZXQgKyAxMV0gPSBzY2VuZUJvZHlJdGVtc0RhdGFbc3Jjb2Zmc2V0ICsgOF07IC8vIG9yaS54DQogICAgYm9keUl0ZW1zQ29vcmRzW3RndG9mZnNldCArIDEyXSA9IHNjZW5lQm9keUl0ZW1zRGF0YVtzcmNvZmZzZXQgKyA5XTsgLy8gb3JpLnkNCiAgICBib2R5SXRlbXNDb29yZHNbdGd0b2Zmc2V0ICsgMTNdID0gc2NlbmVCb2R5SXRlbXNEYXRhW3NyY29mZnNldCArIDEwXTsgLy8gb3JpLnoNCiAgICBib2R5SXRlbXNDb29yZHNbdGd0b2Zmc2V0ICsgMTRdID0gc2NlbmVCb2R5SXRlbXNEYXRhW3NyY29mZnNldCArIDExXTsgLy8gb3JpLncNCg0KICAgIGJvZHlJdGVtc0Nvb3Jkc1t0Z3RvZmZzZXQgKyAxNV0gPSBzY2VuZUJvZHlJdGVtc0RhdGFbc3Jjb2Zmc2V0ICsgMTJdOyAvLyBzYy54DQogICAgYm9keUl0ZW1zQ29vcmRzW3RndG9mZnNldCArIDE2XSA9IHNjZW5lQm9keUl0ZW1zRGF0YVtzcmNvZmZzZXQgKyAxM107IC8vIHNjLnkNCiAgICBib2R5SXRlbXNDb29yZHNbdGd0b2Zmc2V0ICsgMTddID0gc2NlbmVCb2R5SXRlbXNEYXRhW3NyY29mZnNldCArIDE0XTsgLy8gc2Mueg0KICAgIC8vIGNvbnNvbGUubG9nKGJvZHlJdGVtc0Nvb3Jkc1tzcmNvZmZzZXQgKyAxNV0sIGJvZHlJdGVtc0Nvb3Jkc1tzcmNvZmZzZXQgKyAxNl0sIGJvZHlJdGVtc0Nvb3Jkc1tzcmNvZmZzZXQgKyAxN10pDQoNCiAgICBib2R5SXRlbXNDb29yZHNbdGd0b2Zmc2V0ICsgMThdID0gdTsgLy8gdGd0IGNvb3Jkcy54DQogICAgYm9keUl0ZW1zQ29vcmRzW3RndG9mZnNldCArIDE5XSA9IHY7IC8vIHRndCBjb29yZHMueQ0KICAgIGJvZHlJdGVtc0Nvb3Jkc1t0Z3RvZmZzZXQgKyAyMF0gPSBiaW4uaXRlbVdpZHRoOyAvLyB0Z3Qgc2l6ZS54DQogICAgYm9keUl0ZW1zQ29vcmRzW3RndG9mZnNldCArIDIxXSA9IGJpbi5pdGVtSGVpZ2h0OyAvLyB0Z3Qgc2l6ZS55DQoNCiAgICBib2R5SXRlbXNDb29yZHNbdGd0b2Zmc2V0ICsgMjJdID0gc2NlbmVCb2R5SXRlbXNEYXRhW3NyY29mZnNldCArIDE1XTsgLy8gaGlnaGxpZ2h0LnINCiAgICBib2R5SXRlbXNDb29yZHNbdGd0b2Zmc2V0ICsgMjNdID0gc2NlbmVCb2R5SXRlbXNEYXRhW3NyY29mZnNldCArIDE2XTsgLy8gaGlnaGxpZ2h0LmcNCiAgICBib2R5SXRlbXNDb29yZHNbdGd0b2Zmc2V0ICsgMjRdID0gc2NlbmVCb2R5SXRlbXNEYXRhW3NyY29mZnNldCArIDE3XTsgLy8gaGlnaGxpZ2h0LmINCiAgICBib2R5SXRlbXNDb29yZHNbdGd0b2Zmc2V0ICsgMjVdID0gc2NlbmVCb2R5SXRlbXNEYXRhW3NyY29mZnNldCArIDE4XTsgLy8gZmlsbA0KDQogICAgYm9keUl0ZW1zQ29vcmRzW3RndG9mZnNldCArIDI2XSA9IHNjZW5lQm9keUl0ZW1zRGF0YVtzcmNvZmZzZXQgKyAxOV07IC8vIGN1dFBsYW5lLngNCiAgICBib2R5SXRlbXNDb29yZHNbdGd0b2Zmc2V0ICsgMjddID0gc2NlbmVCb2R5SXRlbXNEYXRhW3NyY29mZnNldCArIDIwXTsgLy8gY3V0UGxhbmUueQ0KICAgIGJvZHlJdGVtc0Nvb3Jkc1t0Z3RvZmZzZXQgKyAyOF0gPSBzY2VuZUJvZHlJdGVtc0RhdGFbc3Jjb2Zmc2V0ICsgMjFdOyAvLyBjdXRQbGFuZS56DQogICAgYm9keUl0ZW1zQ29vcmRzW3RndG9mZnNldCArIDI5XSA9IHNjZW5lQm9keUl0ZW1zRGF0YVtzcmNvZmZzZXQgKyAyMl07IC8vIGN1dERpc3QNCg0KICAgIGNvbnN0IHN1cmZhY2VJZHMgPSBib2R5RGVzYy5zdXJmYWNlSWRzOw0KICAgIGZvciAobGV0IGogPSAwOyBqIDwgc3VyZmFjZUlkcy5sZW5ndGg7IGorKykgew0KICAgICAgY29uc3Qgc3VyZmFjZUlkID0gc3VyZmFjZUlkc1tqXTsNCg0KICAgICAgY29uc3Qgc3VyZmFjZURldGFpbFggPSB3b3JrZXJTdGF0ZS5zdXJmYWNlRGV0YWlsc1tzdXJmYWNlSWQgKiA2ICsgNF07DQogICAgICBjb25zdCBzdXJmYWNlRGV0YWlsWSA9IHdvcmtlclN0YXRlLnN1cmZhY2VEZXRhaWxzW3N1cmZhY2VJZCAqIDYgKyA1XTsNCg0KICAgICAgLy8gSWYgSXRlbXMgd2VyZSBza2lwcGVkIGluIGxheWluZyBvdXQgdGhlIHN1cmZhY2VzLCB3ZSB3aWxsIHNlZSB6ZXJvIGRldGFpbCB2YWx1ZXMgaGVyZS4NCiAgICAgIGlmIChzdXJmYWNlRGV0YWlsWCA9PSAwIHx8IHN1cmZhY2VEZXRhaWxZID09IDApIGNvbnRpbnVlDQoNCiAgICAgIGNvbnN0IHN1cmZhY2VLZXkgPSBzdXJmYWNlRGV0YWlsWCArICd4JyArIHN1cmZhY2VEZXRhaWxZOw0KICAgICAgY29uc3Qgc3ViU2V0S2V5ID0gc2hhZGVySWQ7DQogICAgICAvLyBjb25zb2xlLmxvZyhqKyI6IiArIHN1cmZhY2VJZCArICIgZGV0YWlsOiIgKyBzdXJmYWNlS2V5KTsNCiAgICAgIC8vIGNvbnNvbGUubG9nKCJTdXJmYWNlIERyYXc6IiArIHN1cmZhY2VLZXkpOw0KICAgICAgbGV0IGRyYXdTZXQgPSBzdXJmYWNlRHJhd1NldHNfdG1wW3N1cmZhY2VLZXldOw0KICAgICAgaWYgKCFkcmF3U2V0KSB7DQogICAgICAgIGRyYXdTZXQgPSB7fTsNCiAgICAgICAgc3VyZmFjZURyYXdTZXRzX3RtcFtzdXJmYWNlS2V5XSA9IGRyYXdTZXQ7DQogICAgICB9DQogICAgICAvLyBGb3IgZWFjaCBkcmF3IHNldCwgd2UgY2FuIGRyYXcgd2l0aCB2YXJpb3VzIHNoYWRlcnMuDQogICAgICAvLyBIZXJlIHdlIGFsbG9jYXRlIHRoZSBpdGVtIGludG8gdGhlIHN1YnNldCBiYXNlZCBvbiBpdHMgc2hhZGVyaWQuDQogICAgICBsZXQgc3ViU2V0ID0gZHJhd1NldFtzdWJTZXRLZXldOw0KICAgICAgaWYgKCFzdWJTZXQpIHsNCiAgICAgICAgc3ViU2V0ID0gW107DQogICAgICAgIGRyYXdTZXRbc3ViU2V0S2V5XSA9IHN1YlNldDsNCiAgICAgIH0NCiAgICAgIHN1YlNldC5wdXNoKHUgKyAoaiAlIGJvZHlDb3VudFVWWzBdKSAqIHBpeGVsc1BlckRyYXdJdGVtKTsNCiAgICAgIHN1YlNldC5wdXNoKHYgKyBNYXRoLmZsb29yKGogLyBib2R5Q291bnRVVlswXSkpOw0KDQogICAgICAvLyAvLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vDQogICAgICAvLyBMaWdodG1hcCBMYXlvdXQNCiAgICAgIC8qDQogICAgICBpZiAoZW5hYmxlTGlnaHRtYXBzKSB7DQogICAgICAgIGNvbnN0IGJwYyA9IDIgLy8gYnl0ZXMgcGVyIGNoYW5uZWwuICgxNmJpdCkNCiAgICAgICAgc3VyZmFjZXNEYXRhUmVhZGVyLnNlZWsoDQogICAgICAgICAgZ2VvbUxpYnJhcnlIZWFkZXJTaXplICsNCiAgICAgICAgICAgIHN1cmZhY2VJZCAqICh2YWx1ZXNQZXJTdXJmYWNlVG9jSXRlbSAqIGJwYykgKw0KICAgICAgICAgICAgNCAqIGJwYw0KICAgICAgICApDQogICAgICAgIGNvbnN0IHNpemVVID0gc3VyZmFjZXNEYXRhUmVhZGVyLmxvYWRGbG9hdDE2KCkNCiAgICAgICAgY29uc3Qgc2l6ZVYgPSBzdXJmYWNlc0RhdGFSZWFkZXIubG9hZEZsb2F0MTYoKQ0KDQogICAgICAgIC8vIGlmKCFOdW1iZXIuaXNGaW5pdGUoc2l6ZVUpKSB7DQogICAgICAgIC8vICAgc2l6ZVUgPSAxIDw8IDEwOw0KICAgICAgICAvLyAgIGNvbnNvbGUubG9nKCJXYXJuaW5nOiBTdXJmYWNlIHNpemVVIGlzIGJpZ2dlciB0aGFuIGNhbiBiZSByZXByZXNlbnRlZCBieSBhIDE2IGJpdCBmbG9hdC4gTGlnaHRtYXAgd2lsbCBiZSBjbGFtcGVkIHRvOiIgKyBzaXplVSk7DQogICAgICAgIC8vIH0NCiAgICAgICAgLy8gaWYoIU51bWJlci5pc0Zpbml0ZShzaXplVikpIHsNCiAgICAgICAgLy8gICBzaXplViA9IDEgPDwgMTA7DQogICAgICAgIC8vICAgY29uc29sZS5sb2coIldhcm5pbmc6IFN1cmZhY2Ugc2l6ZVYgaXMgYmlnZ2VyIHRoYW4gY2FuIGJlIHJlcHJlc2VudGVkIGJ5IGEgMTYgYml0IGZsb2F0LiBMaWdodG1hcCB3aWxsIGJlIGNsYW1wZWQgdG86IiArIHNpemVWKTsNCiAgICAgICAgLy8gfQ0KICAgICAgICBpZiAoaXNOYU4oc2l6ZVUpIHx8IGlzTmFOKHNpemVWKSkgew0KICAgICAgICAgIGNvbnNvbGUud2FybigNCiAgICAgICAgICAgICdVbmFibGUgdG8gbGF5b3V0IEJvZHkgU3VyZmFjZSBJdGVtIExpZ2h0bWFwLiBTdXJmYWNlIHNpemUgaXMgaW52YWxpZCA6JyArDQogICAgICAgICAgICAgIHNpemVVICsNCiAgICAgICAgICAgICAgJyB4ICcgKw0KICAgICAgICAgICAgICBzaXplVg0KICAgICAgICAgICkNCiAgICAgICAgICBjb250aW51ZQ0KICAgICAgICB9DQoNCiAgICAgICAgY29uc3Qgc2l6ZUluVGV4ZWxzVSA9DQogICAgICAgICAgTWF0aC5tYXgoMSwgbmVhcmVzdFBvdzIoTWF0aC5jZWlsKHNpemVVIC8gbGlnaHRtYXBUZXhlbFNpemUpKSkgKyAyIC8vIExpZ2h0bWFwcyBoYXZlIGEgMSBwaXhlbCBib3JkZXIgYXJvdW5kIGVhY2ggaXRlbS4NCiAgICAgICAgY29uc3Qgc2l6ZUluVGV4ZWxzViA9DQogICAgICAgICAgTWF0aC5tYXgoMSwgbmVhcmVzdFBvdzIoTWF0aC5jZWlsKHNpemVWIC8gbGlnaHRtYXBUZXhlbFNpemUpKSkgKyAyIC8vIExpZ2h0bWFwcyBoYXZlIGEgMSBwaXhlbCBib3JkZXIgYXJvdW5kIGVhY2ggaXRlbS4NCg0KICAgICAgICBpZiAoDQogICAgICAgICAgaXNOYU4oc2l6ZUluVGV4ZWxzVSkgfHwNCiAgICAgICAgICAhTnVtYmVyLmlzRmluaXRlKHNpemVJblRleGVsc1UpIHx8DQogICAgICAgICAgaXNOYU4oc2l6ZUluVGV4ZWxzVikgfHwNCiAgICAgICAgICAhTnVtYmVyLmlzRmluaXRlKHNpemVJblRleGVsc1YpDQogICAgICAgICkgew0KICAgICAgICAgIGNvbnNvbGUud2FybigNCiAgICAgICAgICAgICdVbmFibGUgdG8gbGF5b3V0IGl0ZW06JyArIHNpemVJblRleGVsc1UgKyAnIHggJyArIHNpemVJblRleGVsc1YNCiAgICAgICAgICApDQogICAgICAgICAgY29udGludWUNCiAgICAgICAgfQ0KDQogICAgICAgIGNvbnN0IHN1cmZhY2VJbnN0YW5jZUlkID0gKGJvZHlJZCA8PCAxNikgfCBqDQogICAgICAgIC8vIGNvbnNvbGUubG9nKGJvZHlJZCArICI6IiArIGogKyAiIFNpemU6IiArIHNpemVJblRleGVsc1UgKyAiIHggIiArIHNpemVJblRleGVsc1YpOw0KICAgICAgICBhZGRUb0JpbigNCiAgICAgICAgICBzdXJmYWNlSW5zdGFuY2VJZCwNCiAgICAgICAgICBzaXplSW5UZXhlbHNVLA0KICAgICAgICAgIHNpemVJblRleGVsc1YsDQogICAgICAgICAgbGlnaHRtYXBfYmluc0xpc3QsDQogICAgICAgICAgbGlnaHRtYXBfYmluc0RpY3QNCiAgICAgICAgKQ0KICAgICAgfQ0KICAgICAgKi8NCiAgICB9DQogIH0pOw0KDQogIC8vIHdvcmtlclN0YXRlLmJvZHlJdGVtc0xheW91dCA9IGJvZHlJdGVtc0xheW91dDsNCiAgd29ya2VyU3RhdGUubnVtU3VyZmFjZUluc3RhbmNlcyA9IG51bVN1cmZhY2VJbnN0YW5jZXM7DQoNCiAgLy8gLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vDQogIC8vIExheW91dCB0aGUgbGlnaHRtYXANCg0KICAvLyBTb3J0IHRoZSBiaW5zIGludG8gYmlnZ2VzdCB0byBzbWFsbGVzdCBzbyB3ZSBwYWNrIHRoZSBiaWdnZXIgb25lcyBmaXJzdC4NCg0KICAvLyAvLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vDQogIC8vIE5vdyBsYXlvdXQgdGhlIHN1cmZhY2VzIGluIGJhdGNoZXMuIEJpZ2dlc3QgdG8gc21hbGxlc3QNCiAgLy8gaWYgKGVuYWJsZUxpZ2h0bWFwcykgew0KICAvLyAgIGNvbnN0IGxpZ2h0bWFwTGF5b3V0VGV4dHVyZVNpemUgPSBjYWxjQ29udGFpbmVyU2l6ZSgNCiAgLy8gICAgIG51bUJvZGllcyArIG51bVN1cmZhY2VJbnN0YW5jZXMsDQogIC8vICAgICAxLA0KICAvLyAgICAgMQ0KICAvLyAgICkNCiAgLy8gICAvLyBBbGxvY2F0ZSBzcGFjZSBmb3IgUkdCQTE2IGZsb2F0IHRleHR1cmUgdG8gc3RvcmUgdGhlIGxheW91dA0KICAvLyAgIGNvbnN0IGxpZ2h0bWFwTGF5b3V0QnVmZmVyU2l6ZSA9DQogIC8vICAgICBsaWdodG1hcExheW91dFRleHR1cmVTaXplWzBdICogbGlnaHRtYXBMYXlvdXRUZXh0dXJlU2l6ZVsxXSAqIDgNCiAgLy8gICBjb25zdCBsaWdodG1hcExheW91dFdyaXRlciA9IG5ldyBCaW5Xcml0ZXIobGlnaHRtYXBMYXlvdXRCdWZmZXJTaXplKQ0KDQogIC8vICAgbGV0IGJ1ZmZlck9mZnNldEluUGl4ZWxzID0gbnVtQm9kaWVzDQogIC8vICAgY29uc3QgYm9keUxpZ2h0bWFwTGF5b3V0T2Zmc2V0c0luUGl4ZWxzID0gW10NCiAgLy8gICBmb3IgKGxldCBpID0gMDsgaSA8IG51bUJvZGllczsgaSsrKSB7DQogIC8vICAgICBjb25zdCBhZGRyID0gWw0KICAvLyAgICAgICBidWZmZXJPZmZzZXRJblBpeGVscyAlIGxpZ2h0bWFwTGF5b3V0VGV4dHVyZVNpemVbMF0sDQogIC8vICAgICAgIE1hdGguZmxvb3IoYnVmZmVyT2Zmc2V0SW5QaXhlbHMgLyBsaWdodG1hcExheW91dFRleHR1cmVTaXplWzBdKSwNCiAgLy8gICAgIF0NCiAgLy8gICAgIGxpZ2h0bWFwTGF5b3V0V3JpdGVyLndyaXRlRmxvYXQxNihhZGRyWzBdKQ0KICAvLyAgICAgbGlnaHRtYXBMYXlvdXRXcml0ZXIud3JpdGVGbG9hdDE2KGFkZHJbMV0pDQogIC8vICAgICBsaWdodG1hcExheW91dFdyaXRlci53cml0ZUZsb2F0MTYoMCkNCiAgLy8gICAgIGxpZ2h0bWFwTGF5b3V0V3JpdGVyLndyaXRlRmxvYXQxNigwKQ0KICAvLyAgICAgYm9keUxpZ2h0bWFwTGF5b3V0T2Zmc2V0c0luUGl4ZWxzLnB1c2goYnVmZmVyT2Zmc2V0SW5QaXhlbHMpDQogIC8vICAgICBidWZmZXJPZmZzZXRJblBpeGVscyArPSBudW1Cb2R5SW5zdGFuY2VTdXJmYWNlc1tpXQ0KICAvLyAgIH0NCiAgLy8gICAvLyBjb25zb2xlLmxvZygibGlnaHRtYXBMYXlvdXRUZXh0dXJlU2l6ZToiICsgbGlnaHRtYXBMYXlvdXRUZXh0dXJlU2l6ZSk7DQoNCiAgLy8gICBsYXlvdXRCaW5zKGxpZ2h0bWFwX2JpbnNMaXN0LCBfX2xpZ2h0bWFwUGFja2VyLCAoYmluLCBpLCB1LCB2KSA9PiB7DQogIC8vICAgICBjb25zdCBzdXJmYWNlSW5zdGFuY2VJZCA9IGJpbi5pZHNbaV0NCiAgLy8gICAgIGNvbnN0IGJvZHlJZCA9IHN1cmZhY2VJbnN0YW5jZUlkID4+IDE2DQogIC8vICAgICBjb25zdCBzdXJmYWNlSWQgPSBzdXJmYWNlSW5zdGFuY2VJZCAtIChib2R5SWQgPDwgMTYpDQogIC8vICAgICAvLyBjb25zb2xlLmxvZygiYm9keUlkOiIgKyBib2R5SWQgKyAiIHN1cmZhY2VJZDoiICsgc3VyZmFjZUlkICsgIiBbIiArIChyZXMueCArICgoaSAlIGJpblNpemVbMF0pICogYmluLml0ZW1XaWR0aCkpICsgIiwiICsgKHJlcy55ICsgKE1hdGguZmxvb3IoaSAvIGJpblNpemVbMF0pICogYmluLml0ZW1IZWlnaHQpKSArICIsIiArIGJpbi5pdGVtV2lkdGggKyAiLCIrYmluLml0ZW1XaWR0aCsiXSIpOw0KICAvLyAgICAgbGlnaHRtYXBMYXlvdXRXcml0ZXIuc2VlaygNCiAgLy8gICAgICAgYm9keUxpZ2h0bWFwTGF5b3V0T2Zmc2V0c0luUGl4ZWxzW2JvZHlJZF0gKiA4ICsgc3VyZmFjZUlkICogOA0KICAvLyAgICAgKQ0KICAvLyAgICAgLy8gY29uc29sZS5sb2coIkxpZ2h0bWFwIG9mZnNldDoiICsgKGxpZ2h0bWFwTGF5b3V0V3JpdGVyLl9fYnl0ZU9mZnNldCAvIDgpKTsNCiAgLy8gICAgIGxpZ2h0bWFwTGF5b3V0V3JpdGVyLndyaXRlRmxvYXQxNih1KQ0KICAvLyAgICAgbGlnaHRtYXBMYXlvdXRXcml0ZXIud3JpdGVGbG9hdDE2KHYpDQogIC8vICAgICBsaWdodG1hcExheW91dFdyaXRlci53cml0ZUZsb2F0MTYoYmluLml0ZW1XaWR0aCkNCiAgLy8gICAgIGxpZ2h0bWFwTGF5b3V0V3JpdGVyLndyaXRlRmxvYXQxNihiaW4uaXRlbUhlaWdodCkNCiAgLy8gICB9KQ0KDQogIC8vICAgbGlnaHRtYXBMYXlvdXRXcml0ZXIuc2VlayhsaWdodG1hcExheW91dEJ1ZmZlclNpemUpDQogIC8vICAgd29ya2VyU3RhdGUubGlnaHRtYXBMYXlvdXQgPSBsaWdodG1hcExheW91dFdyaXRlci5nZXRCdWZmZXIoKQ0KICAvLyAgIHdvcmtlclN0YXRlLmxpZ2h0bWFwTGF5b3V0VGV4dHVyZVNpemUgPSBsaWdodG1hcExheW91dFRleHR1cmVTaXplDQogIC8vIH0NCg0KICAvLyBjb25zb2xlLmxvZygibGlnaHRtYXAgU2l6ZTogWyIgKyBfX2xpZ2h0bWFwUGFja2VyLnJvb3QudyArICIgeCAiICsgX19saWdodG1hcFBhY2tlci5yb290LmggKyAiXSIpDQogIC8vIC8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLw0KDQogIC8vIE5vdyBjb252ZXJ0IGFsbCB0aGUgZHJhdyBzZXRzIHRvIHR5cGVkIGFycmF5cw0KICBjb25zdCBzdXJmYWNlRHJhd1NldHMgPSB7fTsNCiAgY29uc3QgbGlnaHRtYXBEcmF3U2V0ID0gbmV3IEZsb2F0MzJBcnJheShudW1TdXJmYWNlSW5zdGFuY2VzICogMik7DQogIGxldCBsaWdodG1hcERyYXdTZXRPZmZzZXQgPSAwOw0KICBmb3IgKGNvbnN0IHN1cmZhY2VLZXkgaW4gc3VyZmFjZURyYXdTZXRzX3RtcCkgew0KICAgIGlmICghc3VyZmFjZURyYXdTZXRzW3N1cmZhY2VLZXldKSB7DQogICAgICBzdXJmYWNlRHJhd1NldHNbc3VyZmFjZUtleV0gPSB7fTsNCiAgICB9DQoNCiAgICBjb25zdCBkcmF3U2V0ID0gc3VyZmFjZURyYXdTZXRzX3RtcFtzdXJmYWNlS2V5XTsNCiAgICBmb3IgKGNvbnN0IHN1YlNldEtleSBpbiBkcmF3U2V0KSB7DQogICAgICBjb25zdCBzdWJTZXQgPSBkcmF3U2V0W3N1YlNldEtleV07DQogICAgICBzdXJmYWNlRHJhd1NldHNbc3VyZmFjZUtleV1bc3ViU2V0S2V5XSA9IEZsb2F0MzJBcnJheS5mcm9tKHN1YlNldCk7DQogICAgICBsaWdodG1hcERyYXdTZXQuc2V0KHN1YlNldCwgbGlnaHRtYXBEcmF3U2V0T2Zmc2V0KTsNCiAgICAgIGxpZ2h0bWFwRHJhd1NldE9mZnNldCArPSBzdWJTZXQubGVuZ3RoOw0KICAgIH0NCiAgfQ0KDQogIHdvcmtlclN0YXRlLnN1cmZhY2VEcmF3U2V0c190bXAgPSBzdXJmYWNlRHJhd1NldHNfdG1wOw0KICB3b3JrZXJTdGF0ZS5zdXJmYWNlRHJhd1NldHMgPSBzdXJmYWNlRHJhd1NldHM7DQogIHdvcmtlclN0YXRlLmxpZ2h0bWFwU2l6ZSA9IFtfX2xpZ2h0bWFwUGFja2VyLnJvb3QudywgX19saWdodG1hcFBhY2tlci5yb290LmhdOw0KICB3b3JrZXJTdGF0ZS5saWdodG1hcERyYXdTZXQgPSBsaWdodG1hcERyYXdTZXQ7DQogIHdvcmtlclN0YXRlLmJvZHlJdGVtc0Nvb3JkcyA9IGJvZHlJdGVtc0Nvb3JkczsNCiAgd29ya2VyU3RhdGUuYm9keUl0ZW1MYXlvdXRDb29yZHMgPSBib2R5SXRlbUxheW91dENvb3JkczsNCg0KICByZXR1cm4gYm9keUl0ZW1zQ29vcmRzDQp9Ow0KDQpjb25zdCBsb2FkQXNzZW1ibHkgPSAoZGF0YSwgb25Eb25lKSA9PiB7DQogIGNvbnN0IHByb2ZpbGluZyA9IHt9Ow0KICBjb25zdCByZXN1bHQgPSB7DQogICAgZXZlbnRUeXBlOiAnbG9hZEFzc2V0RG9uZScsDQogICAgcHJvZmlsaW5nLA0KICB9Ow0KICBjb25zdCB0cmFuc2ZlcmFibGVzID0gW107DQoNCiAgbGV0IHQwID0gcGVyZm9ybWFuY2Uubm93KCk7DQogIGxldCB0MTsNCg0KICAvLyBMZXRzIHRoaXMgZGF0YSBiZSBnYXJiYWdlIGNvbGxlY3RlZC4NCiAgLy8gd29ya2VyU3RhdGUuc2NlbmVCb2R5SXRlbXNEYXRhID0gZGF0YS5zY2VuZUJvZHlJdGVtc0RhdGE7DQoNCiAgLy8gLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8NCiAgLy8gQ3VydmVzDQogIGNvbnN0IGN1cnZlc0RhdGFSZWFkZXIgPSBuZXcgQmluUmVhZGVyKGRhdGEuY3VydmVzRGF0YUJ1ZmZlcik7DQogIHsNCiAgICBjb25zdCBjdXJ2ZUxheW91dERhdGEgPSBsYXlvdXRDdXJ2ZXMoDQogICAgICBjdXJ2ZXNEYXRhUmVhZGVyLA0KICAgICAgZGF0YS5lcnJvclRvbGVyYW5jZSwNCiAgICAgIGRhdGEubWF4VGV4U2l6ZQ0KICAgICk7DQogICAgaWYgKGN1cnZlTGF5b3V0RGF0YSkgew0KICAgICAgcmVzdWx0Lm51bUN1cnZlcyA9IGN1cnZlTGF5b3V0RGF0YS5udW1DdXJ2ZXM7DQogICAgICByZXN1bHQuY3VydmVzQXRsYXNMYXlvdXQgPSBjdXJ2ZUxheW91dERhdGEuY3VydmVzQXRsYXNMYXlvdXQ7DQogICAgICByZXN1bHQuY3VydmVzQXRsYXNMYXlvdXRUZXh0dXJlU2l6ZSA9DQogICAgICAgIGN1cnZlTGF5b3V0RGF0YS5jdXJ2ZXNBdGxhc0xheW91dFRleHR1cmVTaXplOw0KICAgICAgcmVzdWx0LmN1cnZlc0F0bGFzVGV4dHVyZURpbSA9IFsNCiAgICAgICAgX19jdXJ2ZXNQYWNrZXIucm9vdC53LA0KICAgICAgICBfX2N1cnZlc1BhY2tlci5yb290LmgsDQogICAgICBdOw0KDQogICAgICB0cmFuc2ZlcmFibGVzLnB1c2gocmVzdWx0LmN1cnZlc0F0bGFzTGF5b3V0LmJ1ZmZlcik7DQogICAgICBmb3IgKGNvbnN0IGtleSBpbiByZXN1bHQuY3VydmVEcmF3U2V0cykgew0KICAgICAgICB0cmFuc2ZlcmFibGVzLnB1c2gocmVzdWx0LmN1cnZlRHJhd1NldHNba2V5XS5idWZmZXIpOw0KICAgICAgfQ0KDQogICAgICB0MSA9IHBlcmZvcm1hbmNlLm5vdygpOw0KICAgICAgcHJvZmlsaW5nLm51bUN1cnZlcyA9IGN1cnZlTGF5b3V0RGF0YS5udW1DdXJ2ZXM7DQogICAgICBwcm9maWxpbmcubGF5b3V0Q3VydmVzID0gdDEgLSB0MDsNCiAgICAgIHByb2ZpbGluZy5jdXJ2ZXNBdGxhc1RleHR1cmVEaW0gPSByZXN1bHQuY3VydmVzQXRsYXNUZXh0dXJlRGltOw0KICAgIH0NCiAgfQ0KDQogIC8vIC8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vDQogIC8vIFN1cmZhY2VzDQogIGNvbnN0IHN1cmZhY2VzRGF0YVJlYWRlciA9IG5ldyBCaW5SZWFkZXIoZGF0YS5zdXJmYWNlc0RhdGFCdWZmZXIpOw0KICB7DQogICAgLy8gcHJvZmlsaW5nLm51bVN1cmZhY2VzID0gc3VyZmFjZXNEYXRhQnVmZmVyLmxvYWRVSW50MzIoKTsNCiAgICBjb25zdCBzdXJmYWNlTGF5b3V0RGF0YSA9IGxheW91dFN1cmZhY2VzKA0KICAgICAgc3VyZmFjZXNEYXRhUmVhZGVyLA0KICAgICAgZGF0YS5lcnJvclRvbGVyYW5jZSwNCiAgICAgIGRhdGEubWF4VGV4U2l6ZSwNCiAgICAgIGRhdGEuc3VyZmFjZUFyZWFUaHJlc2hvbGQsDQogICAgICBkYXRhLmNhZERhdGFWZXJzaW9uDQogICAgKTsNCg0KICAgIHJlc3VsdC5zdXJmYWNlc0V2YWxBdHRycyA9IHN1cmZhY2VMYXlvdXREYXRhLnN1cmZhY2VzRXZhbEF0dHJzOw0KICAgIHJlc3VsdC5zdXJmYWNlc0F0bGFzTGF5b3V0ID0gc3VyZmFjZUxheW91dERhdGEuc3VyZmFjZXNBdGxhc0xheW91dDsNCiAgICByZXN1bHQuc3VyZmFjZXNBdGxhc0xheW91dFRleHR1cmVTaXplID0NCiAgICAgIHN1cmZhY2VMYXlvdXREYXRhLnN1cmZhY2VzQXRsYXNMYXlvdXRUZXh0dXJlU2l6ZTsNCiAgICByZXN1bHQuc3VyZmFjZXNBdGxhc1RleHR1cmVEaW0gPSBbDQogICAgICBfX3N1cmZhY2VQYWNrZXIucm9vdC53LA0KICAgICAgX19zdXJmYWNlUGFja2VyLnJvb3QuaCwNCiAgICBdOw0KDQogICAgdHJhbnNmZXJhYmxlcy5wdXNoKHJlc3VsdC5zdXJmYWNlc0F0bGFzTGF5b3V0LmJ1ZmZlcik7DQogICAgZm9yIChjb25zdCBrZXkgaW4gcmVzdWx0LnN1cmZhY2VzRXZhbEF0dHJzKQ0KICAgICAgdHJhbnNmZXJhYmxlcy5wdXNoKHJlc3VsdC5zdXJmYWNlc0V2YWxBdHRyc1trZXldLmJ1ZmZlcik7DQoNCiAgICB0MSA9IHBlcmZvcm1hbmNlLm5vdygpOw0KICAgIHByb2ZpbGluZy5sYXlvdXRTdXJmYWNlcyA9IHQxIC0gdDA7DQogICAgcHJvZmlsaW5nLm51bVN1cmZhY2VzID0gc3VyZmFjZUxheW91dERhdGEubnVtU3VyZmFjZXM7DQogICAgcHJvZmlsaW5nLnN1cmZhY2VzQXRsYXNUZXh0dXJlRGltID0gcmVzdWx0LnN1cmZhY2VzQXRsYXNUZXh0dXJlRGltOw0KICB9DQoNCiAgLy8gLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8NCiAgLy8gVHJpbSBTZXRzDQogIGlmIChkYXRhLnRyaW1TZXRzQnVmZmVyKSB7DQogICAgY29uc3QgdHJpbVNldHNSZWFkZXIgPSBuZXcgQmluUmVhZGVyKGRhdGEudHJpbVNldHNCdWZmZXIpOw0KICAgIGNvbnN0IHRyaW1TZXRMYXlvdXREYXRhID0gbGF5b3V0VHJpbVNldHMoDQogICAgICB0cmltU2V0c1JlYWRlciwNCiAgICAgIGRhdGEuY2FkRGF0YVZlcnNpb24sDQogICAgICByZXN1bHQuY3VydmVzQXRsYXNMYXlvdXQsDQogICAgICBkYXRhLmxvZCwNCiAgICAgIGRhdGEudHJpbVRleGVsU2l6ZQ0KICAgICk7DQogICAgcmVzdWx0LnRyaW1DdXJ2ZURyYXdTZXRzID0gdHJpbVNldExheW91dERhdGEudHJpbUN1cnZlRHJhd1NldHM7DQogICAgcmVzdWx0LnRyaW1TZXRzQXRsYXNMYXlvdXREYXRhID0gdHJpbVNldExheW91dERhdGEudHJpbVNldHNBdGxhc0xheW91dERhdGE7DQogICAgcmVzdWx0LnRyaW1TZXRzQXRsYXNMYXlvdXRUZXh0dXJlU2l6ZSA9DQogICAgICB0cmltU2V0TGF5b3V0RGF0YS50cmltU2V0c0F0bGFzTGF5b3V0VGV4dHVyZVNpemU7DQogICAgcmVzdWx0LnRyaW1TZXRBdGxhc1RleHR1cmVTaXplID0gWw0KICAgICAgX190cmltU2V0UGFja2VyLnJvb3QudywNCiAgICAgIF9fdHJpbVNldFBhY2tlci5yb290LmgsDQogICAgXTsNCg0KICAgIHRyYW5zZmVyYWJsZXMucHVzaChyZXN1bHQudHJpbVNldHNBdGxhc0xheW91dERhdGEuYnVmZmVyKTsNCiAgICBmb3IgKGNvbnN0IGtleSBpbiByZXN1bHQudHJpbUN1cnZlRHJhd1NldHMpIHsNCiAgICAgIHRyYW5zZmVyYWJsZXMucHVzaChyZXN1bHQudHJpbUN1cnZlRHJhd1NldHNba2V5XS5idWZmZXIpOw0KICAgIH0NCg0KICAgIHQwID0gcGVyZm9ybWFuY2Uubm93KCk7DQogICAgcHJvZmlsaW5nLmxheW91dFRyaW1TZXRzID0gdDAgLSB0MTsNCiAgICBwcm9maWxpbmcudHJpbVNldEF0bGFzVGV4dHVyZVNpemUgPSByZXN1bHQudHJpbVNldEF0bGFzVGV4dHVyZVNpemU7DQogIH0NCg0KICAvLyAvLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLw0KICAvLyBCb2R5IEl0ZW1zDQogIHsNCiAgICBjb25zdCBib2R5RGVzY1JlYWRlciA9IG5ldyBCaW5SZWFkZXIoZGF0YS5ib2R5TGlicmFyeUJ1ZmZlcik7DQogICAgY29uc3QgYm9keURlc2NUb2NSZWFkZXIgPSBuZXcgQmluUmVhZGVyKGRhdGEuYm9keUxpYnJhcnlCdWZmZXJUb2MpOw0KDQogICAgcHJvZmlsaW5nLm51bUJvZGllcyA9IGRhdGEuc2NlbmVCb2R5SXRlbXNEYXRhLmxlbmd0aCAvIGZsb2F0c1BlclNjZW5lQm9keTsNCg0KICAgIHJlc3VsdC5ib2R5SXRlbXNDb29yZHMgPSBsYXlvdXRCb2R5SXRlbXMoDQogICAgICBkYXRhLnNjZW5lQm9keUl0ZW1zRGF0YSwNCiAgICAgIGJvZHlEZXNjVG9jUmVhZGVyLA0KICAgICAgYm9keURlc2NSZWFkZXIsDQogICAgICBkYXRhLmNhZERhdGFWZXJzaW9uDQogICAgKTsNCiAgICByZXN1bHQuYm9keUF0bGFzRGltID0gW19fYm9keUF0bGFzUGFja2VyLnJvb3QudywgX19ib2R5QXRsYXNQYWNrZXIucm9vdC5oXTsNCiAgICByZXN1bHQuc3VyZmFjZURyYXdTZXRzID0gd29ya2VyU3RhdGUuc3VyZmFjZURyYXdTZXRzOw0KICAgIC8vIHRyYW5zZmVyYWJsZXMucHVzaChyZXN1bHQuYm9keUl0ZW1zQ29vcmRzLmJ1ZmZlcik7DQoNCiAgICBmb3IgKGNvbnN0IHN1cmZhY2VLZXkgaW4gcmVzdWx0LnN1cmZhY2VEcmF3U2V0cykgew0KICAgICAgY29uc3QgZHJhd1NldCA9IHJlc3VsdC5zdXJmYWNlRHJhd1NldHNbc3VyZmFjZUtleV07DQogICAgICBmb3IgKGNvbnN0IHN1YlNldEtleSBpbiBkcmF3U2V0KSB7DQogICAgICAgIHRyYW5zZmVyYWJsZXMucHVzaChkcmF3U2V0W3N1YlNldEtleV0uYnVmZmVyKTsNCiAgICAgIH0NCiAgICB9DQogICAgcHJvZmlsaW5nLm51bVN1cmZhY2VJbnN0YW5jZXMgPSB3b3JrZXJTdGF0ZS5udW1TdXJmYWNlSW5zdGFuY2VzOw0KICAgIHByb2ZpbGluZy5udW1EcmF3U2V0cyA9IE9iamVjdC5rZXlzKHJlc3VsdC5zdXJmYWNlRHJhd1NldHMpLmxlbmd0aDsNCg0KICAgIC8vIGlmIChkYXRhLmVuYWJsZUxpZ2h0bWFwcykgew0KICAgIC8vICAgcmVzdWx0LmxpZ2h0bWFwTGF5b3V0VGV4dHVyZVNpemUgPSB3b3JrZXJTdGF0ZS5saWdodG1hcExheW91dFRleHR1cmVTaXplDQogICAgLy8gICByZXN1bHQubGlnaHRtYXBTaXplID0gd29ya2VyU3RhdGUubGlnaHRtYXBTaXplDQogICAgLy8gICByZXN1bHQubGlnaHRtYXBEcmF3U2V0ID0gd29ya2VyU3RhdGUubGlnaHRtYXBEcmF3U2V0DQogICAgLy8gICByZXN1bHQubGlnaHRtYXBMYXlvdXQgPSB3b3JrZXJTdGF0ZS5saWdodG1hcExheW91dA0KICAgIC8vICAgdHJhbnNmZXJhYmxlcy5wdXNoKHJlc3VsdC5saWdodG1hcExheW91dCkNCiAgICAvLyAgIHRyYW5zZmVyYWJsZXMucHVzaChyZXN1bHQubGlnaHRtYXBEcmF3U2V0LmJ1ZmZlcikNCg0KICAgIC8vICAgcHJvZmlsaW5nLmxpZ2h0bWFwU2l6ZSA9IHJlc3VsdC5saWdodG1hcFNpemUNCiAgICAvLyB9DQoNCiAgICB0MSA9IHBlcmZvcm1hbmNlLm5vdygpOw0KICAgIHByb2ZpbGluZy5sYXlvdXRCb2R5SXRlbXMgPSB0MSAtIHQwOw0KICAgIHByb2ZpbGluZy5ib2R5QXRsYXNEaW0gPSByZXN1bHQuYm9keUF0bGFzRGltOw0KICB9DQoNCiAgb25Eb25lKHJlc3VsdCwgdHJhbnNmZXJhYmxlcyk7DQp9Ow0KDQpjb25zdCBoaWdobGlnaHRlZERyYXdTZXRzID0ge307DQoNCmNvbnN0IGJvZHlIaWdobGlnaHRDaGFuZ2VkID0gKGRhdGEsIG9uRG9uZSkgPT4gew0KICBjb25zdCBoaWdobGlnaHRlZEJvZHlJZHMgPSBkYXRhLmhpZ2hsaWdodGVkQm9keUlkczsNCiAgY29uc3QgdW5oaWdobGlnaHRlZEJvZHlJZHMgPSBkYXRhLnVuaGlnaGxpZ2h0ZWRCb2R5SWRzOw0KDQogIGNvbnN0IGVhY2hCb2R5U3VyZmFjZSA9IChib2R5SWRzLCBjYikgPT4gew0KICAgIGZvciAobGV0IGkgPSAwOyBpIDwgYm9keUlkcy5sZW5ndGg7IGkrKykgew0KICAgICAgY29uc3QgYm9keUlkID0gYm9keUlkc1tpXTsNCg0KICAgICAgY29uc3QgYm9keURlc2NJZCA9IHdvcmtlclN0YXRlLmJvZHlJdGVtTGF5b3V0Q29vcmRzW2JvZHlJZCAqIDUgKyAwXTsNCiAgICAgIGNvbnN0IHUgPSB3b3JrZXJTdGF0ZS5ib2R5SXRlbUxheW91dENvb3Jkc1tib2R5SWQgKiA1ICsgMV07DQogICAgICBjb25zdCB2ID0gd29ya2VyU3RhdGUuYm9keUl0ZW1MYXlvdXRDb29yZHNbYm9keUlkICogNSArIDJdOw0KICAgICAgY29uc3QgY291bnR1ID0gd29ya2VyU3RhdGUuYm9keUl0ZW1MYXlvdXRDb29yZHNbYm9keUlkICogNSArIDNdOw0KICAgICAgY29uc3QgY291bnR2ID0gd29ya2VyU3RhdGUuYm9keUl0ZW1MYXlvdXRDb29yZHNbYm9keUlkICogNSArIDRdOw0KDQogICAgICBjb25zdCBib2R5RGVzYyA9IGdldEJvZHlEZXNjRGF0YShib2R5RGVzY0lkKTsNCiAgICAgIGNvbnN0IHN1cmZhY2VJZHMgPSBib2R5RGVzYy5zdXJmYWNlSWRzOw0KICAgICAgZm9yIChsZXQgaiA9IDA7IGogPCBzdXJmYWNlSWRzLmxlbmd0aDsgaisrKSB7DQogICAgICAgIGNvbnN0IHN1cmZhY2VJZCA9IHN1cmZhY2VJZHNbal07DQoNCiAgICAgICAgY29uc3Qgc3VyZmFjZURldGFpbFggPSB3b3JrZXJTdGF0ZS5zdXJmYWNlRGV0YWlsc1tzdXJmYWNlSWQgKiA2ICsgNF07DQogICAgICAgIGNvbnN0IHN1cmZhY2VEZXRhaWxZID0gd29ya2VyU3RhdGUuc3VyZmFjZURldGFpbHNbc3VyZmFjZUlkICogNiArIDVdOw0KDQogICAgICAgIGNvbnN0IHN1cmZhY2VLZXkgPSBzdXJmYWNlRGV0YWlsWCArICd4JyArIHN1cmZhY2VEZXRhaWxZOw0KICAgICAgICBjb25zdCBzdXJmYWNlSW5zdGFuY2VJZCA9IChib2R5SWQgPDwgMTYpIHwgajsNCiAgICAgICAgY2Ioc3VyZmFjZUluc3RhbmNlSWQsIHN1cmZhY2VLZXksIHUsIHYsIGNvdW50dSwgY291bnR2LCBqKTsNCiAgICAgIH0NCiAgICB9DQogIH07DQogIGVhY2hCb2R5U3VyZmFjZSgNCiAgICB1bmhpZ2hsaWdodGVkQm9keUlkcywNCiAgICAoc3VyZmFjZUluc3RhbmNlSWQsIHN1cmZhY2VLZXksIHUsIHYsIGNvdW50dSwgY291bnR2LCBqKSA9PiB7DQogICAgICBsZXQgZHJhd1NldCA9IGhpZ2hsaWdodGVkRHJhd1NldHNbc3VyZmFjZUtleV07DQogICAgICBpZiAoIWRyYXdTZXQpIHsNCiAgICAgICAgZHJhd1NldCA9IHsNCiAgICAgICAgICBzdXJmYWNlRHJhd0Nvb3Jkczoge30sDQogICAgICAgICAgY291bnQ6IDAsDQogICAgICAgIH07DQogICAgICAgIGhpZ2hsaWdodGVkRHJhd1NldHNbc3VyZmFjZUtleV0gPSBkcmF3U2V0Ow0KICAgICAgfQ0KICAgICAgZGVsZXRlIGRyYXdTZXQuc3VyZmFjZURyYXdDb29yZHNbc3VyZmFjZUluc3RhbmNlSWRdOw0KICAgICAgZHJhd1NldC5jb3VudC0tOw0KICAgIH0NCiAgKTsNCiAgZWFjaEJvZHlTdXJmYWNlKA0KICAgIGhpZ2hsaWdodGVkQm9keUlkcywNCiAgICAoc3VyZmFjZUluc3RhbmNlSWQsIHN1cmZhY2VLZXksIHUsIHYsIGNvdW50dSwgY291bnR2LCBqKSA9PiB7DQogICAgICBsZXQgZHJhd1NldCA9IGhpZ2hsaWdodGVkRHJhd1NldHNbc3VyZmFjZUtleV07DQogICAgICBpZiAoIWRyYXdTZXQpIHsNCiAgICAgICAgZHJhd1NldCA9IHsNCiAgICAgICAgICBzdXJmYWNlRHJhd0Nvb3Jkczoge30sDQogICAgICAgICAgY291bnQ6IDAsDQogICAgICAgIH07DQogICAgICAgIGhpZ2hsaWdodGVkRHJhd1NldHNbc3VyZmFjZUtleV0gPSBkcmF3U2V0Ow0KICAgICAgfQ0KICAgICAgZHJhd1NldC5zdXJmYWNlRHJhd0Nvb3Jkc1tzdXJmYWNlSW5zdGFuY2VJZF0gPSBbDQogICAgICAgIHUgKyAoaiAlIGNvdW50dSkgKiBwaXhlbHNQZXJEcmF3SXRlbSwNCiAgICAgICAgdiArIE1hdGguZmxvb3IoaiAvIGNvdW50dSksDQogICAgICBdOw0KICAgICAgZHJhd1NldC5jb3VudCsrOw0KICAgIH0NCiAgKTsNCg0KICAvLyBOb3cgY29udmVydCBhbGwgdGhlIGRyYXcgc2V0cyB0byB0eXBlZCBhcnJheXMNCiAgY29uc3Qgb3V0X3N1cmZhY2VEcmF3U2V0cyA9IHt9Ow0KICBjb25zdCB0cmFuc2ZlcmFibGVzID0gW107DQogIGZvciAoY29uc3Qgc3VyZmFjZUtleSBpbiBoaWdobGlnaHRlZERyYXdTZXRzKSB7DQogICAgY29uc3QgaGlnaGxpZ2h0ZWREcmF3U2V0ID0gaGlnaGxpZ2h0ZWREcmF3U2V0c1tzdXJmYWNlS2V5XTsNCiAgICBjb25zdCBkcmF3U2V0ID0gbmV3IEZsb2F0MzJBcnJheShoaWdobGlnaHRlZERyYXdTZXQuY291bnQgKiAyKTsNCiAgICBsZXQgb2Zmc2V0ID0gMDsNCiAgICBmb3IgKGNvbnN0IHN1cmZhY2VJbnN0YW5jZUlkIGluIGhpZ2hsaWdodGVkRHJhd1NldHNbc3VyZmFjZUtleV0NCiAgICAgIC5zdXJmYWNlRHJhd0Nvb3Jkcykgew0KICAgICAgY29uc3Qgc3VyZmFjZURyYXdDb29yZCA9DQogICAgICAgIGhpZ2hsaWdodGVkRHJhd1NldHNbc3VyZmFjZUtleV0uc3VyZmFjZURyYXdDb29yZHNbc3VyZmFjZUluc3RhbmNlSWRdOw0KICAgICAgZHJhd1NldC5zZXQoc3VyZmFjZURyYXdDb29yZCwgb2Zmc2V0KTsNCiAgICAgIG9mZnNldCArPSAyOw0KICAgIH0NCiAgICBvdXRfc3VyZmFjZURyYXdTZXRzW3N1cmZhY2VLZXldID0gZHJhd1NldDsNCiAgICB0cmFuc2ZlcmFibGVzLnB1c2goZHJhd1NldC5idWZmZXIpOw0KICB9DQoNCiAgY29uc3QgcmVzdWx0ID0gew0KICAgIGV2ZW50VHlwZTogJ2hpZ2hsaWdodGVkU3VyZmFjZURyYXdTZXRzQ2hhbmdlZCcsDQogICAgaGlnaGxpZ2h0ZWRTdXJmYWNlRHJhd1NldHM6IG91dF9zdXJmYWNlRHJhd1NldHMsDQogICAgbnVtSGlnaGxpZ2h0ZWQ6IGhpZ2hsaWdodGVkQm9keUlkcy5sZW5ndGgsDQogICAgbnVtVW5oaWdobGlnaHRlZDogdW5oaWdobGlnaHRlZEJvZHlJZHMubGVuZ3RoLA0KICB9Ow0KICBvbkRvbmUocmVzdWx0LCB0cmFuc2ZlcmFibGVzKTsNCn07DQoNCmNvbnN0IGJvZHlJdGVtQ2hhbmdlZCA9IChkYXRhLCBvbkRvbmUpID0+IHsNCiAgY29uc3QgY2hhbmdlcyA9IGRhdGEuY2hhbmdlczsNCiAgY29uc3QgbnVtRGlydHlCb2R5SXRlbXMgPSBPYmplY3Qua2V5cyhjaGFuZ2VzKS5sZW5ndGg7DQogIC8vIE5vdGU6IFdlIG1vZGlmeSB0aGUgYm9keUl0ZW1zQ29vcmRzIGFycmF5IGluIHBsYWNlIGFuZCBjb3B5DQogIC8vIHRoZSBtb2RpZmllZCBzZWN0aW9ucyBvdXQgdG8gdXBsb2FkIHRvIHRoZSBHUFUuDQogIGNvbnN0IGJvZHlJdGVtc0Nvb3JkcyA9IHdvcmtlclN0YXRlLmJvZHlJdGVtc0Nvb3JkczsNCiAgY29uc3QgbW9kaWZpZWRCb2R5SXRlbXNDb29yZHMgPSBuZXcgRmxvYXQzMkFycmF5KA0KICAgIG51bURpcnR5Qm9keUl0ZW1zICogYm9keUl0ZW1Db29yZHNTdHJpZGUNCiAgKTsNCiAgbGV0IGkgPSAwOw0KICBmb3IgKGNvbnN0IGtleSBpbiBjaGFuZ2VzKSB7DQogICAgY29uc3QgYm9keUlkID0gTnVtYmVyLnBhcnNlSW50KGtleSk7DQogICAgY29uc3QgYm9keURhdGEgPSBjaGFuZ2VzW2tleV07DQogICAgY29uc3Qgb2Zmc2V0ID0gYm9keUlkICogYm9keUl0ZW1Db29yZHNTdHJpZGU7DQoNCiAgICAvLyBjb25zb2xlLmxvZyhib2R5SWQsICJib2R5SXRlbUNoYW5nZWQ6IiwgYm9keUl0ZW1zQ29vcmRzW29mZnNldCArIDFdKQ0KICAgIGlmIChib2R5RGF0YS5mbGFncyAhPSB1bmRlZmluZWQpDQogICAgICBib2R5SXRlbXNDb29yZHNbb2Zmc2V0ICsgMl0gPSBib2R5RGF0YS5mbGFnczsNCiAgICBpZiAoYm9keURhdGEubWF0ZXJpYWwpIHsNCiAgICAgIGJvZHlJdGVtc0Nvb3Jkc1tvZmZzZXQgKyA2XSA9IGJvZHlEYXRhLm1hdGVyaWFsWzBdOyAvLyBzcmMgZ2xtYXRlcmlhbGNvb3Jkcy54DQogICAgICBib2R5SXRlbXNDb29yZHNbb2Zmc2V0ICsgN10gPSBib2R5RGF0YS5tYXRlcmlhbFsxXTsgLy8gc3JjIGdsbWF0ZXJpYWxjb29yZHMueQ0KICAgIH0NCiAgICBpZiAoYm9keURhdGEueGZvKSB7DQogICAgICAvLyBjb25zb2xlLmxvZyhib2R5SWQsICJib2R5SXRlbUNoYW5nZWQgeGZvOiIsIGJvZHlEYXRhLnhmbykNCiAgICAgIGJvZHlJdGVtc0Nvb3Jkc1tvZmZzZXQgKyA4XSA9IGJvZHlEYXRhLnhmb1swXTsgLy8gdHIueA0KICAgICAgYm9keUl0ZW1zQ29vcmRzW29mZnNldCArIDldID0gYm9keURhdGEueGZvWzFdOyAvLyB0ci55DQogICAgICBib2R5SXRlbXNDb29yZHNbb2Zmc2V0ICsgMTBdID0gYm9keURhdGEueGZvWzJdOyAvLyB0ci56DQoNCiAgICAgIGJvZHlJdGVtc0Nvb3Jkc1tvZmZzZXQgKyAxMV0gPSBib2R5RGF0YS54Zm9bM107IC8vIG9yaS54DQogICAgICBib2R5SXRlbXNDb29yZHNbb2Zmc2V0ICsgMTJdID0gYm9keURhdGEueGZvWzRdOyAvLyBvcmkueQ0KICAgICAgYm9keUl0ZW1zQ29vcmRzW29mZnNldCArIDEzXSA9IGJvZHlEYXRhLnhmb1s1XTsgLy8gb3JpLnoNCiAgICAgIGJvZHlJdGVtc0Nvb3Jkc1tvZmZzZXQgKyAxNF0gPSBib2R5RGF0YS54Zm9bNl07IC8vIG9yaS53DQoNCiAgICAgIGJvZHlJdGVtc0Nvb3Jkc1tvZmZzZXQgKyAxNV0gPSBib2R5RGF0YS54Zm9bN107IC8vIHNjLncNCiAgICAgIGJvZHlJdGVtc0Nvb3Jkc1tvZmZzZXQgKyAxNl0gPSBib2R5RGF0YS54Zm9bOF07IC8vIHNjLncNCiAgICAgIGJvZHlJdGVtc0Nvb3Jkc1tvZmZzZXQgKyAxN10gPSBib2R5RGF0YS54Zm9bOV07IC8vIHNjLncNCiAgICB9DQogICAgaWYgKGJvZHlEYXRhLmhpZ2hsaWdodCkgew0KICAgICAgYm9keUl0ZW1zQ29vcmRzW29mZnNldCArIDIyXSA9IGJvZHlEYXRhLmhpZ2hsaWdodFswXTsNCiAgICAgIGJvZHlJdGVtc0Nvb3Jkc1tvZmZzZXQgKyAyM10gPSBib2R5RGF0YS5oaWdobGlnaHRbMV07DQogICAgICBib2R5SXRlbXNDb29yZHNbb2Zmc2V0ICsgMjRdID0gYm9keURhdGEuaGlnaGxpZ2h0WzJdOw0KICAgICAgYm9keUl0ZW1zQ29vcmRzW29mZnNldCArIDI1XSA9IGJvZHlEYXRhLmhpZ2hsaWdodFszXTsNCiAgICB9DQogICAgaWYgKGJvZHlEYXRhLmN1dFBsYW5lKSB7DQogICAgICBib2R5SXRlbXNDb29yZHNbb2Zmc2V0ICsgMjZdID0gYm9keURhdGEuY3V0UGxhbmVbMF07DQogICAgICBib2R5SXRlbXNDb29yZHNbb2Zmc2V0ICsgMjddID0gYm9keURhdGEuY3V0UGxhbmVbMV07DQogICAgICBib2R5SXRlbXNDb29yZHNbb2Zmc2V0ICsgMjhdID0gYm9keURhdGEuY3V0UGxhbmVbMl07DQogICAgICBib2R5SXRlbXNDb29yZHNbb2Zmc2V0ICsgMjldID0gYm9keURhdGEuY3V0UGxhbmVbM107DQogICAgfQ0KDQogICAgLy8gUHVsbCBvdXQgYSBjb3B5IG9mIHRoZSBkYXRhIGFuZCBwdXQgaW50byBvdXIgc21hbGxlciBhcnJheS4NCiAgICBjb25zdCBwcmV2Qm9keUl0ZW1zRGF0YSA9IHdvcmtlclN0YXRlLmJvZHlJdGVtc0Nvb3Jkcy5zdWJhcnJheSgNCiAgICAgIGJvZHlJZCAqIGJvZHlJdGVtQ29vcmRzU3RyaWRlLA0KICAgICAgKGJvZHlJZCArIDEpICogYm9keUl0ZW1Db29yZHNTdHJpZGUNCiAgICApOw0KICAgIG1vZGlmaWVkQm9keUl0ZW1zQ29vcmRzLnNldChwcmV2Qm9keUl0ZW1zRGF0YSwgaSAqIGJvZHlJdGVtQ29vcmRzU3RyaWRlKTsNCg0KICAgIGkrKzsNCiAgfQ0KICBjb25zdCByZXN1bHQgPSB7DQogICAgZXZlbnRUeXBlOiAnYm9keUl0ZW1DaGFuZ2VkJywNCiAgICBib2R5SXRlbXNDb29yZHM6IG1vZGlmaWVkQm9keUl0ZW1zQ29vcmRzLA0KICB9Ow0KICBvbkRvbmUocmVzdWx0KTsNCn07DQoNCi8vIC8vIGxldCBhc3NlbWJseUJCb3g7DQovLyAvLyBsZXQgc3VyZmFjZVJlbmRlclBhcmFtcyA9IFtdOw0KLy8gLy8gY29uc3QgYm9keURyYXdEYXRhcyA9IFtdOw0KDQovLyAvLyBjb25zdCByZW5kZXJEYXRhcyA9IFtdOw0KLy8gLy8gY29uc3QgSEFMRl9QSSA9IE1hdGguUEkgKiAwLjU7DQoNCi8vIC8vIGNvbnN0IG9uVmlld0NoYW5nZWQgPSAodmlld1hmbywgdmlld0Rpciwgb25Eb25lKSA9PiB7DQovLyAvLyAgICAgY29uc3QgYmVjb21pbmdWaXNpYmxlID0gW107DQovLyAvLyAgICAgY29uc3QgYmVjb21pbmdJbnZpc2libGUgPSBbXTsNCi8vIC8vICAgICBjb25zdCBsb2RDaGFuZ2VzID0gW107DQoNCi8vIC8vICAgICBjb25zdCB0ZXN0RnJ1c3R1bSA9IChwb3MsIHNpemUpID0+IHsNCg0KLy8gLy8gICAgICAgICBjb25zdCBkaXIgPSBwb3Muc3VidHJhY3Qodmlld1hmby50cik7DQovLyAvLyAgICAgICAgIGNvbnN0IGRpc3QgPSBkaXIubGVuZ3RoKCk7DQovLyAvLyAgICAgICAgIGRpci5zY2FsZUluUGxhY2UoMS4wIC8gZGlzdCk7DQovLyAvLyAgICAgICAgIGNvbnN0IHZpZXdEb3REaXIgPSBkaXIuZG90KHZpZXdEaXIpOw0KLy8gLy8gICAgICAgICBjb25zdCBhbmdsZSA9IE1hdGguYWNvcyh2aWV3RG90RGlyKTsNCg0KLy8gLy8gICAgICAgICBjb25zdCB2aWV3Q29uZUFuZ2xlID0gMS4yOyAvLyBUaGUgZm92IGRpdmlkZWQgYnkgMjsgKGF0IHRoZSBjb3JuZXIpDQovLyAvLyAgICAgICAgIC8vIGNvbnNvbGUubG9nKGFuZ2xlICsgIjoiICsgTWF0aC5hdGFuKHNpemUgLyBkaXN0KSkNCg0KLy8gLy8gICAgICAgICBsZXQgdmlzID0gMDsNCi8vIC8vICAgICAgICAgaWYgKGRpc3QgPiBzaXplKSB7DQovLyAvLyAgICAgICAgICAgICBpZiAodmlld0RvdERpciA8IDAuMCB8fCBhbmdsZSAtIE1hdGguYXRhbihzaXplIC8gZGlzdCkgPiB2aWV3Q29uZUFuZ2xlKSB7DQovLyAvLyAgICAgICAgICAgICAgICAgLy8gY29uc29sZS5sb2coIkl0ZW0gaXMgY29tcGxldGVseSBvdXRzaWRlIG9mIHRoZSBmcnVzdHVtIikNCi8vIC8vICAgICAgICAgICAgICAgICB2aXMgPSAxOw0KLy8gLy8gICAgICAgICAgICAgfSBlbHNlIHsNCi8vIC8vICAgICAgICAgICAgICAgICBpZiAoYW5nbGUgKyBNYXRoLmF0YW4oc2l6ZSAvIGRpc3QpIDwgdmlld0NvbmVBbmdsZSkgew0KLy8gLy8gICAgICAgICAgICAgICAgICAgICAvLyBjb25zb2xlLmxvZygiSXRlbSBpcyBjb21wbGV0ZWx5IGluc2lkZSAgdGhlIGZydXN0dW0iKQ0KLy8gLy8gICAgICAgICAgICAgICAgICAgICB2aXMgPSAyOw0KLy8gLy8gICAgICAgICAgICAgICAgIH0gZWxzZSB7DQovLyAvLyAgICAgICAgICAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKCJJdGVtIGlzIGluc2lkZSBvZiB0aGUgZnJ1c3R1bSIpDQovLyAvLyAgICAgICAgICAgICAgICAgICAgIHZpcyA9IDM7DQovLyAvLyAgICAgICAgICAgICAgICAgfQ0KLy8gLy8gICAgICAgICAgICAgfQ0KLy8gLy8gICAgICAgICB9DQovLyAvLyAgICAgICAgIHJldHVybiB7DQovLyAvLyAgICAgICAgICAgICBkaXIsDQovLyAvLyAgICAgICAgICAgICBkaXN0LA0KLy8gLy8gICAgICAgICAgICAgYW5nbGUsDQovLyAvLyAgICAgICAgICAgICB2aXMNCi8vIC8vICAgICAgICAgfTsNCi8vIC8vICAgICB9DQoNCi8vIC8vICAgICBjb25zdCBlYWNoQm9keURhdGEgPSAoYm9keURyYXdEYXRhLCBib2R5SW5kZXgpID0+IHsNCg0KLy8gLy8gICAgICAgICBjb25zdCBib2R5VmlzID0gdGVzdEZydXN0dW0oYm9keURyYXdEYXRhLmJvZHlYZm8udHIsIGJvZHlEcmF3RGF0YS5ib2R5U2l6ZSk7DQoNCi8vIC8vICAgICAgICAgY29uc3QgZHJhd0l0ZW1EYXRhID0gYm9keURyYXdEYXRhLmRyYXdJdGVtRGF0YTsNCi8vIC8vICAgICAgICAgZm9yIChsZXQgc3VyZmFjZUluZGV4ID0gMDsgc3VyZmFjZUluZGV4IDwgYm9keURyYXdEYXRhLm51bVN1cmZhY2VzOyBzdXJmYWNlSW5kZXgrKykgew0KLy8gLy8gICAgICAgICAgICAgY29uc3QgcGl4ZWxzUGVyRHJhd0l0ZW0gPSA0OyAvLyBUaGUgbnVtYmVyIG9mIFJHQkEgcGl4ZWxzIHBlciBkcmF3IGl0ZW0uDQovLyAvLyAgICAgICAgICAgICBjb25zdCBvZmZzZXQgPSAoc3VyZmFjZUluZGV4ICogcGl4ZWxzUGVyRHJhd0l0ZW0gKiA0KTsNCi8vIC8vICAgICAgICAgICAgIGNvbnN0IHBvcyA9IG5ldyBWZWMzKA0KLy8gLy8gICAgICAgICAgICAgICAgIGRyYXdJdGVtRGF0YVtvZmZzZXQgKyAzXSwgZHJhd0l0ZW1EYXRhW29mZnNldCArIDddLCBkcmF3SXRlbURhdGFbb2Zmc2V0ICsgMTFdDQovLyAvLyAgICAgICAgICAgICApDQovLyAvLyAgICAgICAgICAgICBjb25zdCBzdXJmYWNlSWQgPSBkcmF3SXRlbURhdGFbb2Zmc2V0ICsgMTJdOw0KLy8gLy8gICAgICAgICAgICAgY29uc3Qgc2l6ZSA9IHN1cmZhY2VSZW5kZXJQYXJhbXNbc3VyZmFjZUlkICogM107DQoNCi8vIC8vICAgICAgICAgICAgIGxldCB2aXNpYmlsaXR5U3RhdGUgPSAwOyAvLyB2aXNpYmxlDQovLyAvLyAgICAgICAgICAgICBpZiAoYm9keVZpcy52aXMgPT0gMSkgew0KLy8gLy8gICAgICAgICAgICAgICAgIHZpc2liaWxpdHlTdGF0ZSA9IDE7DQovLyAvLyAgICAgICAgICAgICB9IGVsc2UgaWYgKGJvZHlWaXMudmlzID09IDMpIHsNCi8vIC8vICAgICAgICAgICAgICAgICBjb25zdCBzdXJmYWNlVmlzID0gdGVzdEZydXN0dW0ocG9zLCBzaXplKTsNCi8vIC8vICAgICAgICAgICAgICAgICBpZiAoc3VyZmFjZVZpcy52aXMgPT0gMSkNCi8vIC8vICAgICAgICAgICAgICAgICAgICAgdmlzaWJpbGl0eVN0YXRlID0gMTsNCi8vIC8vICAgICAgICAgICAgIH0NCg0KLy8gLy8gICAgICAgICAgICAgLy8gUmVkdWNpbmcgdGhlIG51bWJlciBvZiB2aXNpYmlsaXR5IGNoYW5nZXMuDQovLyAvLyAgICAgICAgICAgICAvLyBpZiAodmlzaWJpbGl0eVN0YXRlID09IDApIHsNCi8vIC8vICAgICAgICAgICAgIC8vICAgICBjb25zdCBjdXJ2YXR1cmUgPSBzdXJmYWNlUmVuZGVyUGFyYW1zWyhzdXJmYWNlSWQgKiAzKSArIDFdOw0KLy8gLy8gICAgICAgICAgICAgLy8gICAgIGNvbnN0IG51cmZhY2VOb3JtYWwgPSBuZXcgVmVjMygNCi8vIC8vICAgICAgICAgICAgIC8vICAgICAgICAgZHJhd0l0ZW1EYXRhW29mZnNldCArIDJdLCBkcmF3SXRlbURhdGFbb2Zmc2V0ICsgNl0sIGRyYXdJdGVtRGF0YVtvZmZzZXQgKyAxMF0NCi8vIC8vICAgICAgICAgICAgIC8vICAgICApOw0KLy8gLy8gICAgICAgICAgICAgLy8gICAgIGNvbnN0IGFuZ2xlID0gbnVyZmFjZU5vcm1hbC5uZWdhdGUoKS5hbmdsZVRvKGJvZHlWaXMuZGlyKQ0KLy8gLy8gICAgICAgICAgICAgLy8gICAgIGlmIChhbmdsZSA8IEhBTEZfUEkgKiAoMS4wIC0gY3VydmF0dXJlKSkgew0KLy8gLy8gICAgICAgICAgICAgLy8gICAgICAgICB2aXNpYmlsaXR5U3RhdGUgPSAxOw0KLy8gLy8gICAgICAgICAgICAgLy8gICAgIH0NCi8vIC8vICAgICAgICAgICAgIC8vIH0NCg0KLy8gLy8gICAgICAgICAgICAgLy8gSWYgaXMgdmlzaWJsZSwgY2hlY2sgZm9yIExPRCBjaGFuZ2VzLg0KLy8gLy8gICAgICAgICAgICAgaWYgKHZpc2liaWxpdHlTdGF0ZSA9PSAwKSB7DQovLyAvLyAgICAgICAgICAgICAgICAgY29uc3QgZGV0YWlsID0gc3VyZmFjZVJlbmRlclBhcmFtc1soc3VyZmFjZUlkICogMykgKyAyXTsNCi8vIC8vICAgICAgICAgICAgICAgICBjb25zdCBsb2QgPSAxICsgTWF0aC5taW4oTWF0aC5yb3VuZChkZXRhaWwgKiBNYXRoLmF0YW4oMS4wIC8gYm9keVZpcy5kaXN0KSksIDUpOw0KLy8gLy8gICAgICAgICAgICAgICAgIGlmIChsb2QgIT0gcmVuZGVyRGF0YXNbYm9keUluZGV4XS5jdXJyTG9kW3N1cmZhY2VJbmRleF0pIHsNCi8vIC8vICAgICAgICAgICAgICAgICAgICAgLy8gV2hlbiBhbiBpdGVtIGNoYW5nZXMgTE9ELCBpdCBpcyBwbGFjZWQgaW4gdGhlIG5ldyBMT0Qgc2V0IHdpdGggdmlzaWJsaXR5ID09IHRydWUNCi8vIC8vICAgICAgICAgICAgICAgICAgICAgbG9kQ2hhbmdlcy5wdXNoKHsNCi8vIC8vICAgICAgICAgICAgICAgICAgICAgICAgIGJvZHlJbmRleCwNCi8vIC8vICAgICAgICAgICAgICAgICAgICAgICAgIHN1cmZhY2VJbmRleCwNCi8vIC8vICAgICAgICAgICAgICAgICAgICAgICAgIGxvZA0KLy8gLy8gICAgICAgICAgICAgICAgICAgICB9KQ0KLy8gLy8gICAgICAgICAgICAgICAgICAgICByZW5kZXJEYXRhc1tib2R5SW5kZXhdLmN1cnJMb2Rbc3VyZmFjZUluZGV4XSA9IGxvZDsNCi8vIC8vICAgICAgICAgICAgICAgICB9DQovLyAvLyAgICAgICAgICAgICAgICAgZWxzZSBpZiAodmlzaWJpbGl0eVN0YXRlICE9IHJlbmRlckRhdGFzW2JvZHlJbmRleF0uY3VyclZpc2liaWxpdHlbc3VyZmFjZUluZGV4XSkgew0KLy8gLy8gICAgICAgICAgICAgICAgICAgICAvLyBJZiBsb2QgZGlkbid0IGNoYW5nZSwgd2UgY2FuIGNoYW5nZSB2aXNpYmlsaXR5Lg0KLy8gLy8gICAgICAgICAgICAgICAgICAgICBiZWNvbWluZ1Zpc2libGUucHVzaCh7DQovLyAvLyAgICAgICAgICAgICAgICAgICAgICAgICBib2R5SW5kZXgsDQovLyAvLyAgICAgICAgICAgICAgICAgICAgICAgICBzdXJmYWNlSW5kZXgNCi8vIC8vICAgICAgICAgICAgICAgICAgICAgfSkNCi8vIC8vICAgICAgICAgICAgICAgICB9DQovLyAvLyAgICAgICAgICAgICB9DQovLyAvLyAgICAgICAgICAgICBlbHNlIGlmICh2aXNpYmlsaXR5U3RhdGUgIT0gcmVuZGVyRGF0YXNbYm9keUluZGV4XS5jdXJyVmlzaWJpbGl0eVtzdXJmYWNlSW5kZXhdKSB7DQovLyAvLyAgICAgICAgICAgICAgICAgYmVjb21pbmdJbnZpc2libGUucHVzaCh7DQovLyAvLyAgICAgICAgICAgICAgICAgICAgIGJvZHlJbmRleCwNCi8vIC8vICAgICAgICAgICAgICAgICAgICAgc3VyZmFjZUluZGV4DQovLyAvLyAgICAgICAgICAgICAgICAgfSk7DQovLyAvLyAgICAgICAgICAgICB9DQovLyAvLyAgICAgICAgICAgICByZW5kZXJEYXRhc1tib2R5SW5kZXhdLmN1cnJWaXNpYmlsaXR5W3N1cmZhY2VJbmRleF0gPSB2aXNpYmlsaXR5U3RhdGU7DQovLyAvLyAgICAgICAgIH0NCi8vIC8vICAgICB9DQovLyAvLyAgICAgYm9keURyYXdEYXRhcy5mb3JFYWNoKGVhY2hCb2R5RGF0YSk7DQoNCi8vIC8vICAgICBpZiAoYmVjb21pbmdJbnZpc2libGUubGVuZ3RoID4gMCB8fCBiZWNvbWluZ1Zpc2libGUubGVuZ3RoID4gMCB8fCBsb2RDaGFuZ2VzLmxlbmd0aCA+IDApIHsNCi8vIC8vICAgICAgICAgY29uc3QgcmVzdWx0ID0gew0KLy8gLy8gICAgICAgICAgICAgYmVjb21pbmdJbnZpc2libGUsDQovLyAvLyAgICAgICAgICAgICBiZWNvbWluZ1Zpc2libGUsDQovLyAvLyAgICAgICAgICAgICBsb2RDaGFuZ2VzDQovLyAvLyAgICAgICAgIH07DQovLyAvLyAgICAgICAgIC8vIGNvbnNvbGUubG9nKCJvblZpZXdDaGFuZ2VkOiIgK0pTT04uc3RyaW5naWZ5KHJlc3VsdCkpOw0KLy8gLy8gICAgICAgICBvbkRvbmUocmVzdWx0KTsNCi8vIC8vICAgICB9DQovLyAvLyAgICAgZWxzZSB7DQovLyAvLyAgICAgICAgb25Eb25lKCk7DQovLyAvLyAgICAgfQ0KLy8gLy8gfQ0KDQpjb25zdCBHTENBREFzc2V0V29ya2VyX29ubWVzc2FnZSA9IGZ1bmN0aW9uKGRhdGEsIG9uRG9uZSkgew0KICBzd2l0Y2ggKGRhdGEuZXZlbnRUeXBlKSB7DQogICAgY2FzZSAnbG9hZEFzc2VtYmx5JzoNCiAgICAgIGxvYWRBc3NlbWJseShkYXRhLCBvbkRvbmUpOw0KICAgICAgYnJlYWsNCiAgICBjYXNlICdib2R5SGlnaGxpZ2h0Q2hhbmdlZCc6DQogICAgICBib2R5SGlnaGxpZ2h0Q2hhbmdlZChkYXRhLCBvbkRvbmUpOw0KICAgICAgYnJlYWsNCiAgICBjYXNlICdib2R5SXRlbUNoYW5nZWQnOg0KICAgICAgYm9keUl0ZW1DaGFuZ2VkKGRhdGEsIG9uRG9uZSk7DQogICAgICBicmVhaw0KICAgIC8vIGNhc2UgJ2JvZHlNYXRlcmlhbENoYW5nZWQnOg0KICAgIC8vICAgYm9keU1hdGVyaWFsQ2hhbmdlZChkYXRhLCBvbkRvbmUpOw0KICAgIC8vICAgYnJlYWs7DQogICAgLy8gY2FzZSAnYm9keUNvbG9yQ2hhbmdlZCc6DQogICAgLy8gICBib2R5Q29sb3JDaGFuZ2VkKGRhdGEsIG9uRG9uZSk7DQogICAgLy8gICBicmVhazsNCiAgICAvLyBjYXNlICdib2R5WGZvc0NoYW5nZWQnOg0KICAgIC8vICAgYm9keVhmb3NDaGFuZ2VkKGRhdGEsIG9uRG9uZSk7DQogICAgLy8gICBicmVhazsNCiAgfQ0KfTsNCg0Kc2VsZi5vbm1lc3NhZ2UgPSBmdW5jdGlvbihldmVudCkgew0KICBHTENBREFzc2V0V29ya2VyX29ubWVzc2FnZShldmVudC5kYXRhLCAocmVzdWx0LCB0cmFuc2ZlcmFibGVzKSA9PiB7DQogICAgc2VsZi5wb3N0TWVzc2FnZShyZXN1bHQsIHRyYW5zZmVyYWJsZXMpOw0KICB9KTsNCn07DQoNCi8vIEVuYWJsZSBtZSBmb3Igc2luZ2xlIHRocmVhZGVkIGRldi4NCi8vIGV4cG9ydCB7IEdMQ0FEQXNzZXRXb3JrZXJfb25tZXNzYWdlIH0KCg==', null, false);
/* eslint-enable */

// import {
//   GLCADAssetWorker_onmessage
// } from './GLCADAssetWorker.js';

/**  Class representing a GL CAD asset.
 * @ignore
 */
class GLCADAsset {
  /**
   * Create a GL CAD asset.
   * @param {any} gl - The gl value.
   * @param {any} assetId - The assetId value.
   * @param {any} cadAsset - The cadAsset value.
   * @param {any} cadpassdata - The cadpassdata value.
   */
  constructor(gl, assetId, cadAsset, cadpassdata) {
    this.__gl = gl;
    this.__assetId = assetId;
    this.__cadAsset = cadAsset;
    this.__numSurfaces = cadAsset.getSurfaceLibrary().getNumSurfaces();
    this.__numBodies = cadAsset.getBodyLibrary().getNumBodies();
    this.__numMaterials = cadAsset.getMaterialLibrary().getNumMaterials();
    this.__numHighlightedGeoms = 0;

    this.__visible = this.__cadAsset.getVisible();
    this.visibilityChangedId = this.__cadAsset.visibilityChanged.connect(() => {
      this.__visible = this.__cadAsset.getVisible();
      this.assetVisibilityChanged.emit();
    });

    const cutPlaneColorParam = this.__cadAsset.getParameter('CutPlaneColor');
    this.__cutColor = cutPlaneColorParam.getValue();
    this.cutPlaneColorChangedId = cutPlaneColorParam.valueChanged.connect(() => {
      this.__cutColor = cutPlaneColorParam.getValue();
      this.updated.emit();
    });
    const cutPlaneNormalParam = this.__cadAsset.getParameter('CutPlaneNormal');
    this.__cutNormal = cutPlaneNormalParam.getValue();
    this.cutPlaneNormalChangedId = cutPlaneNormalParam.valueChanged.connect(() => {
      this.__cutNormal = cutPlaneNormalParam.getValue();
      this.updated.emit();
    });
    const cutDistParam = this.__cadAsset.getParameter('CutPlaneDist');
    this.__cutDist = cutDistParam.getValue();
    this.cutDistParamChangedId = cutDistParam.valueChanged.connect(() => {
      this.__cutDist = cutDistParam.getValue();
      this.updated.emit();
    });

    this.loaded = new zeaEngine.Signal();
    this.updated = new zeaEngine.Signal();
    this.assetVisibilityChanged = new zeaEngine.Signal();
    this.bodyXfoChanged = new zeaEngine.Signal();
    this.bodyVisibilityChanged = new zeaEngine.Signal();

    this.__cadpassdata = cadpassdata;

    this.__curveLibrary = new GLCurveLibrary(
      gl,
      cadpassdata,
      this.__cadAsset.getSurfaceLibrary(),
      cadAsset.getVersion()
    );
    this.__surfaceLibrary = new GLSurfaceLibrary(
      gl,
      cadpassdata,
      this.__cadAsset.getSurfaceLibrary(),
      this.__curveLibrary,
      cadAsset.getVersion()
    );
    const trimSetsBuffer = this.__cadAsset.getTrimSetLibrary().getBinaryBuffer();
    if (trimSetsBuffer && trimSetsBuffer.byteLength > 8) {
      this.__trimSetLibrary = new GLTrimSetLibrary(
        gl,
        cadpassdata,
        this.__cadAsset.getTrimSetLibrary(),
        this.__curveLibrary
      );
    }

    {
      const bodyLibraryBuffer = this.__cadAsset
        .getBodyLibrary()
        .getBinaryBuffer();
      if (bodyLibraryBuffer) {
        const bodyTexSize = Math.sqrt(bodyLibraryBuffer.byteLength / 16); // RGBA32 pixels
        this.__bodyItemTexture = new zeaEngine.GLTexture2D(gl, {
          format: 'RGBA',
          type: 'FLOAT',
          width: bodyTexSize,
          height: bodyTexSize,
          filter: 'NEAREST',
          wrap: 'CLAMP_TO_EDGE',
          mipMapped: false,
          data: new Float32Array(bodyLibraryBuffer),
        });
      }
    }

    this.__bindAttr = (
      location,
      channels,
      type,
      stride,
      offset,
      instanced = true
    ) => {
      gl.enableVertexAttribArray(location);
      gl.vertexAttribPointer(
        location,
        channels,
        gl.FLOAT,
        false,
        stride,
        offset
      );
      if (instanced) gl.vertexAttribDivisor(location, 1); // This makes it instanced
    };

    this.__trimCurveDrawSets = {};
    this.__surfaceDrawSets = {};
    this.__lightmapDrawSet = new GLSurfaceDrawSet(gl, 2, 2);
    this.__lightmapChannel = -1;
    this.__lightmapFbos = [];

    // ////////////////////////////////////////////////

    this.loadWorker();
  }

  /**
   * The getCADAsset method.
   * @return {any} - The return value.
   */
  getCADAsset() {
    return this.__cadAsset
  }

  /**
   * The getNumSurfaces method.
   * @return {any} - The return value.
   */
  getNumSurfaces() {
    return this.__numSurfaces
  }

  /**
   * The getNumBodies method.
   * @return {any} - The return value.
   */
  getNumBodies() {
    return this.__numBodies
  }

  /**
   * The getNumMaterials method.
   * @return {any} - The return value.
   */
  getNumMaterials() {
    return this.__numMaterials
  }

  /**
   * The incHighlightedCount method.
   * @param {any} count - The count param.
   */
  incHighlightedCount(count) {
    this.__numHighlightedGeoms += count;
    this.__cadpassdata.incHighlightedCount(count);
  }

  /**
   * The decHighlightedCount method.
   * @param {any} count - The count param.
   */
  decHighlightedCount(count) {
    this.__numHighlightedGeoms -= count;
    this.__cadpassdata.decHighlightedCount(count);
  }

  /**
   * The loadWorker method.
   */
  loadWorker() {
    const numBodyItems = this.__cadAsset.getNumBodyItems();
    if (numBodyItems == 0) return

    // let tmp = 0;
    // this.__cadAsset.traverse((treeItem) => {
    //     if (treeItem instanceof CADBody) {
    //       console.log(treeItem.getPath())
    //       tmp++;
    //       return false;
    //     } else
    //       return true;
    // });
    // if(numBodyItems != tmp){
    //   console.log("numBodyItems", numBodyItems, tmp)
    //   numBodyItems = tmp;
    // }

    // Calculate the entroid to offset all the Xfo values. 
    // This is to work around an issue on Mobile GPUs where
    // the fragment shader stage only supports Flaot16 operations.
    // The Matrix calculated in the DrawItems shader contains artifacts
    // because of the low precision.
    // If the asset is invisible when loaded, then the bbox is
    // not valid and the centroid becomes NaN
    const assetBBox = this.__cadAsset.getBoundingBox();
    // this.__assetCentroid = assetBBox.center()
    // if (
    //   Number.isNaN(this.__assetCentroid.x) ||
    //   Number.isNaN(this.__assetCentroid.y) ||
    //   Number.isNaN(this.__assetCentroid.z)
    // ) {
      this.__assetCentroid = new zeaEngine.Vec3();
    // }

    const sceneBodyItemsData = new Float32Array(
      numBodyItems * floatsPerSceneBody
    );

    let index = 0;
    this.__cadBodies = [];
    const highlightedBodies = [];

    const highlightChangeBatch = {
      highlightedBodyIds: [],
      unhighlightedBodyIds: [],
      dirty: false,
    };
    const pushhighlightChangeBatchToWorker = () => {
      this.__postMessageToWorker({
        eventType: 'bodyHighlightChanged',
        highlightedBodyIds: highlightChangeBatch.highlightedBodyIds,
        unhighlightedBodyIds: highlightChangeBatch.unhighlightedBodyIds,
      });
      highlightChangeBatch.highlightedBodyIds = [];
      highlightChangeBatch.unhighlightedBodyIds = [];
      highlightChangeBatch.dirty = false;
    };

    const bodyItemChangeBatch = { changes: {}, dirty: false };
    let bodyItemChangeBatch_transferables = [];
    const pushBodyItemChangeBatchToWorker = () => {
      this.__postMessageToWorker({
        eventType: 'bodyItemChanged',
        changes: bodyItemChangeBatch.changes,
      });
      bodyItemChangeBatch.changes = {};
      bodyItemChangeBatch.dirty = false;
      bodyItemChangeBatch_transferables = [];
    };
    const bodyItemDataChanged = (bodyId, key, value) => {
      if (!bodyItemChangeBatch.changes[bodyId])
        bodyItemChangeBatch.changes[bodyId] = {};
      bodyItemChangeBatch.changes[bodyId][key] = value;
      if (!bodyItemChangeBatch.dirty) {
        setTimeout(pushBodyItemChangeBatchToWorker, 1);
        bodyItemChangeBatch.dirty = true;
      }
      if (value instanceof Float32Array)
        bodyItemChangeBatch_transferables.push(value.buffer);
    };

    const bindCADBody = cadBody => {
      const bodyId = index;
      if (bodyId >= numBodyItems) return

      const glCADBody = new GLCADBody(
        cadBody,
        bodyId,
        this.__cadpassdata,
        sceneBodyItemsData,
        bodyItemDataChanged,
        highlightedBodies,
        highlightChangeBatch,
        pushhighlightChangeBatchToWorker
      );
      this.__cadBodies.push(glCADBody);
      index++;
    };

    this.__cadAsset.traverse(treeItem => {
      if (treeItem instanceof CADBody) {
        bindCADBody(treeItem);
        return false
      } else return true
    });


    ////////////////////////////////////////
    // Detail Factor
    // The detail factor is used to convert surface 'cost'
    // to a given tesselation level.
    // Here we start with a given tesselation desired for a 
    // circle the size of the asset bounding box.
    // We calculate the cost of the circle (curvature * length^2)
    const unitsScale = this.__cadAsset.getUnitsConversion();
    const assetBBoxRadius = assetBBox.size().length() * 0.5 / unitsScale;

    //////////////////////
    // Calculate a detail value for a circle enclosing our bbox.
    const lod = this.__cadAsset.getParameter('LOD').getValue();
    const detail = 128 * Math.pow(2, lod);
    // Calculate the arc angle for a cricle subdivided to the detail level
    const arcAngle = (Math.PI * 2.0) / detail;
    // Calculate the deviation to the circle at the middle of the arc.
    const errorTolerance = assetBBoxRadius - assetBBoxRadius * Math.cos(arcAngle / 2);

    // The smallest area of a drawn item.
    // The renderer will skip any surfaces smaller than this item.
    const surfaceAreaThreshold = 0;//Math.PI * (assetBBoxRadius * assetBBoxRadius * 0.000000005 * Math.pow(2, lod))
    // Note: on the hospital sprinker system we get the following values on the GTX laptop.
    // assetBBoxRadius: 67447  surfaceAreaThreshold: 285
    // Skipping about 30 surfaces.

    console.log("assetBBoxRadius:", assetBBoxRadius, " errorTolerance:", errorTolerance, " surfaceAreaThreshold:", surfaceAreaThreshold);


    ////////////////////////////////////////
    const curvesDataBuffer = this.__cadAsset
      .getSurfaceLibrary()
      .getCurveBuffer();
    const surfacesDataBuffer = this.__cadAsset
      .getSurfaceLibrary()
      .getSurfaceBuffer();
    const cadDataVersion = this.__cadAsset.getVersion();

    const trimSetsBuffer = this.__cadAsset.getTrimSetLibrary().getBinaryBuffer();
    let trimTexelSize = -1;
    if (trimSetsBuffer) {

      const numAssets = this.__cadpassdata.assetCount;
      trimTexelSize = this.__cadAsset
        .getTrimSetLibrary()
        .getTexelSize(lod, numAssets);
      // const mult = Math.pow(2, this.__cadAsset.getLOD());
      // trimTexelSize = this.__cadAsset.getTrimTexelSize() * mult;
    }

    const bodyLibraryBufferToc = this.__cadAsset.getBodyLibrary().getToc();
    const bodyLibraryBuffer = this.__cadAsset.getBodyLibrary().getBinaryBuffer();

    const transferables = [
      surfacesDataBuffer,
      bodyLibraryBufferToc,
      bodyLibraryBuffer,
    ];
    if (trimSetsBuffer) transferables.push(trimSetsBuffer);

    const assemblyData = {
      eventType: 'loadAssembly',
      assetId: this.__assetId,
      curvesDataBuffer,
      surfacesDataBuffer,
      cadDataVersion,
      trimSetsBuffer,
      lod: this.__cadAsset.getLOD(),
      maxTexSize: this.__cadpassdata.maxTexSize / 2,
      errorTolerance,
      surfaceAreaThreshold,
      trimTexelSize,
      //enableLightmaps: this.__cadpassdata.enableLightmaps,
      //lightmapTexelSize: this.__cadAsset.getLightmapTexelSize(),
      sceneBodyItemsData,
      bodyLibraryBufferToc,
      bodyLibraryBuffer,
    };
    this.__postMessageToWorker(assemblyData, transferables);
  }

  /**
   * The __postMessageToWorker method.
   * @param {any} data - The data param.
   * @param {any} transferables - The transferables param.
   * @private
   */
  __postMessageToWorker(data, transferables) {
    // if(this.__cadpassdata.debugMode) {
    //   setTimeout(()=>{
    //     GLCADAssetWorker_onmessage(data, this.__onWorkerMessage.bind(this));
    //   },100);
    // }
    // else
    {
      if (!this.__worker) this.__worker = new WorkerFactory();
      this.__worker.onmessage = event => {
        this.__onWorkerMessage(event.data); // loading done...
      };
      this.__worker.postMessage(
        data,
        this.__cadpassdata.debugMode ? [] : transferables
      );
    }
  }

  /**
   * The __onWorkerMessage method.
   * @param {any} data - The data param.
   * @private
   */
  __onWorkerMessage(data) {
    switch (data.eventType) {
      case 'loadAssetDone':
        console.log(
          'Layout Asset:',
          this.getCADAsset().getName(),
          data.profiling
        );

        // ///////////////////////////////
        // Curves, Surfaces and Trim Sets

        // this.__gl.finish();

        if (data.curvesAtlasLayout) {
          this.__curveLibrary.evaluateCurves(
            data.curvesAtlasLayout,
            data.numCurves,
            data.curvesAtlasLayoutTextureSize,
            data.curvesAtlasTextureDim
          );
        }

        // Note: rollup is generating radom problems in production builds
        // values are getting assigned classes. The profiling values here
        // become assigned class definitions, which then cause crashes or
        // garbage logging
        // Here, if we bundle the values into an object, then its ok.
        // This is probably due to the use to WebWorkers this this file. 
        // We should try updating rollup and see if these hacks can be
        // removed.
        const values = {};

        values.surfaceEvalTime = this.__surfaceLibrary.evaluateSurfaces(
          data.surfacesEvalAttrs,
          data.surfacesAtlasLayout,
          data.surfacesAtlasLayoutTextureSize,
          data.surfacesAtlasTextureDim
        );

        if (
          data.trimCurveDrawSets &&
          data.trimSetAtlasTextureSize[0] > 0 &&
          data.trimSetAtlasTextureSize[1] > 0
        ) {
          this.__trimSetLibrary.evaluateTrimSets(
            data.trimCurveDrawSets,
            data.trimSetAtlasTextureSize,
            data.trimSetsAtlasLayoutData,
            data.trimSetsAtlasLayoutTextureSize
          );
        }

        // ///////////////////////////////
        // Draw Items

        this.__bodyAtlasDim = data.bodyAtlasDim;
        this.updateDrawItems(data.bodyItemsCoords);

        {
          values.numTriangles = 10;
          values.numDrawSets = 10;
          // eslint-disable-next-line guard-for-in
          for (const drawSetKey in data.surfaceDrawSets) {
            let drawSet = this.__surfaceDrawSets[drawSetKey];
            // Note: on initialization, there are no draw sets, so
            // we always construct the draw set here.
            if (!drawSet) {
              const parts = drawSetKey.split('x');
              const detailX = parseInt(parts[0]);
              const detailY = parseInt(parts[1]);
              drawSet = new GLSurfaceDrawSet(this.__gl, detailX, detailY);
              this.__surfaceDrawSets[drawSetKey] = drawSet;
            }

            const drawSetData = data.surfaceDrawSets[drawSetKey];
            // eslint-disable-next-line guard-for-in
            for (const subSetKey in drawSetData) {
              const drawItemsData = drawSetData[subSetKey];
              values.numTriangles += drawSet.addDrawItems(drawItemsData, subSetKey);
            }

            values.numDrawSets++;
          }
        }

        
        this.loaded.emit({
          numSurfaces: data.profiling.numSurfaces,
          numSurfaceInstances: data.profiling.numSurfaceInstances,
          surfaceEvalTime: values.surfaceEvalTime,
          numBodies: data.profiling.numBodies,
          numMaterials: this.__numMaterials,
          numTriangles: values.numTriangles,
          numDrawSets: values.numDrawSets,
        });
        this.updated.emit();
        break
      case 'bodyItemChanged':
        this.updateDrawItems(data.bodyItemsCoords);
        this.updated.emit();
        break
      case 'highlightedSurfaceDrawSetsChanged':
        for (const drawSetKey in data.highlightedSurfaceDrawSets) {
          const drawSet = this.__surfaceDrawSets[drawSetKey];
          if (!drawSet) {
            console.warn('Selecting invalid items:', drawSetKey);
            continue
          }
          drawSet.setDrawItems(data.highlightedSurfaceDrawSets[drawSetKey], 1);
        }
        this.incHighlightedCount(data.numHighlighted);
        this.decHighlightedCount(data.numUnhighlighted);
        this.updated.emit();
        break
    }

    // if (data.lodChanges.length != 0){
    //     const eachLODChange = (change)=>{
    //         const glsurfacedrawItem = this.__glbodyItems[change.bodyIndex].glsurfacedrawItems[change.surfaceIndex];
    //         glsurfacedrawItem.setLod(change.lod - 1);
    //     }
    //     // console.log("lodChanges:" + data.lodChanges.length)
    //     data.lodChanges.forEach(eachLODChange);
    // }
    // if (data.becomingInvisible.length != 0 || data.becomingVisible.length != 0){
    //     const eachBecomingInvisibleChange = (change)=>{
    //         // console.log("BecomingInvisible:" + change.bodyIndex + ":" + change.surfaceIndex);
    //         const glsurfacedrawItem = this.__glbodyItems[change.bodyIndex].glsurfacedrawItems[change.surfaceIndex];
    //         glsurfacedrawItem.setInvisible();
    //     }
    //     // console.log("becomingInvisible:" + data.becomingInvisible.length)
    //     data.becomingInvisible.forEach(eachBecomingInvisibleChange);

    //     const eachBecomingVisibleChange = (change)=>{
    //         // console.log("BecomingVisible:" + change.bodyIndex + ":" + change.surfaceIndex);
    //         const glsurfacedrawItem = this.__glbodyItems[change.bodyIndex].glsurfacedrawItems[change.surfaceIndex];
    //         glsurfacedrawItem.setVisible();
    //     }
    //     // console.log("becomingVisible:" + data.becomingVisible.length)
    //     data.becomingVisible.forEach(eachBecomingVisibleChange);
    // }
  }

  // /////////////////////////////////////////////////////////////
  // Draw Items

  /**
   * The updateDrawItems method.
   * @param {any} bodyItemsCoords - The bodyItemsCoords param.
   */
  updateDrawItems(bodyItemsCoords) {
    // if (assemblyData.dirtyBodyDrawItemIndies.length == 0)
    //     continue;
    const count = bodyItemsCoords.length / bodyItemCoordsStride;
    // console.log("updateDrawItems:" + this.__assetId + ":" + count);
    if (count == 0) return

    const gl = this.__gl;

    if (!this.__drawItemsTarget) {
      this.__drawItemsTarget = new zeaEngine.GLRenderTarget(gl, {
        format: 'RGBA',
        type: 'FLOAT',
        width: this.__bodyAtlasDim[0],
        height: this.__bodyAtlasDim[1],
        minFilter: 'NEAREST',
        magFilter: 'NEAREST',
        wrap: 'CLAMP_TO_EDGE',
        numColorChannels: 1,
      });
      this.__drawItemsTarget.clear();

      // this.__drawItemsTexture = new GLTexture2D(gl, {
      //   format: 'RGBA',
      //   type: 'FLOAT',
      //   width: this.__bodyAtlasDim[0],
      //   height: this.__bodyAtlasDim[1],
      //   filter: 'NEAREST',
      //   wrap: 'CLAMP_TO_EDGE',
      //   mipMapped: false
      // });

      // this.__drawItemFbo = new GLFbo(gl, this.__drawItemsTexture);
      // this.__drawItemFbo.setClearColor([0, 0, 0, 0]);
      // this.__drawItemFbo.bindAndClear();
    } else if (
      this.__drawItemsTarget.width != this.__bodyAtlasDim[0] ||
      this.__drawItemsTarget.height != this.__bodyAtlasDim[1]
    ) {
      // this.__drawItemsTexture.resize(this.__bodyAtlasDim[0], this.__bodyAtlasDim[1], true);
      // this.__drawItemFbo.resize(); // hack to rebind the texture. Refactor the way textures are resized.
      // this.__drawItemFbo.bind();
      this.__drawItemsTarget.resize(
        this.__bodyAtlasDim[0],
        this.__bodyAtlasDim[1],
        true
      );
    }

    const renderstate = {};
    this.__drawItemsTarget.bindForWriting(renderstate, false);
    this.__cadpassdata.updateDrawItemsShader.bind(renderstate);
    this.__cadpassdata.glplanegeom.bind(renderstate);

    const unifs = renderstate.unifs;
    const attrs = renderstate.attrs;

    gl.uniform2i(
      unifs.vert_drawItemsTextureSize.location,
      this.__bodyAtlasDim[0],
      this.__bodyAtlasDim[1]
    );

    this.__surfaceLibrary.bindSurfacesData(renderstate);

    if (this.__trimSetLibrary)
      this.__trimSetLibrary.bindTrimSetAtlasLayout(renderstate);

    if (this.__lightmapLayoutTexture) {
      this.__lightmapLayoutTexture.bindToUniform(
        renderstate,
        unifs.lightmapLayoutTexture
      );
      gl.uniform2i(
        unifs.lightmapLayoutTextureSize.location,
        this.__lightmapLayoutTexture.width,
        this.__lightmapLayoutTexture.height
      );
    }

    this.__bodyItemTexture.bindToUniform(renderstate, unifs.bodyDatasTexture);
    gl.uniform2i(
      unifs.bodyDatasTextureSize.location,
      this.__bodyItemTexture.width,
      this.__bodyItemTexture.height
    );

    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, bodyItemsCoords, gl.STATIC_DRAW);

    this.__bindAttr(
      attrs.bodyDataCoords.location,
      4,
      gl.FLOAT,
      bodyItemCoordsStride * 4,
      0
    );
    this.__bindAttr(
      attrs.bodyItem_metadata.location,
      4,
      gl.FLOAT,
      bodyItemCoordsStride * 4,
      4 * 4
    );
    this.__bindAttr(
      attrs.bodyItem_tr.location,
      3,
      gl.FLOAT,
      bodyItemCoordsStride * 4,
      8 * 4
    );
    this.__bindAttr(
      attrs.bodyItem_ori.location,
      4,
      gl.FLOAT,
      bodyItemCoordsStride * 4,
      11 * 4
    );
    this.__bindAttr(
      attrs.bodyItem_sc.location,
      3,
      gl.FLOAT,
      bodyItemCoordsStride * 4,
      15 * 4
    );
    this.__bindAttr(
      attrs.patchCoords.location,
      4,
      gl.FLOAT,
      bodyItemCoordsStride * 4,
      18 * 4
    );
    this.__bindAttr(
      attrs.bodyColor.location,
      4,
      gl.FLOAT,
      bodyItemCoordsStride * 4,
      22 * 4
    );
    this.__bindAttr(
      attrs.cutPlane.location,
      4,
      gl.FLOAT,
      bodyItemCoordsStride * 4,
      26 * 4
    );

    this.__cadpassdata.glplanegeom.drawInstanced(count);
    this.__drawItemsTarget.unbind();

    gl.deleteBuffer(buffer);
    // for(let i=0; i<count; i++) {
    //   const id = bodyItemsCoords[(i * bodyItemCoordsStride) + 1]
    //   logDrawItem(id);
    // }
    // gl.finish();
    // this.__drawItemFbo.bind();
    // logDrawItem(46, 0);
    // logDrawItem(0);
  }

  /**
   * The bindDrawItemsAtlas method.
   * @param {any} renderstate - The renderstate param.
   */
  bindDrawItemsAtlas(renderstate) {
    this.__drawItemsTarget.bindColorTexture(
      renderstate,
      renderstate.unifs.drawItemsTexture
    );
    // this.__drawItemsTexture.bindToUniform(renderstate, renderstate.unifs.drawItemsTexture);
    if (renderstate.unifs.vert_drawItemsTextureSize)
      this.__gl.uniform2i(
        renderstate.unifs.vert_drawItemsTextureSize.location,
        this.__bodyAtlasDim[0],
        this.__bodyAtlasDim[1]
      );
    if (renderstate.unifs.frag_drawItemsTextureSize)
      this.__gl.uniform2i(
        renderstate.unifs.frag_drawItemsTextureSize.location,
        this.__bodyAtlasDim[0],
        this.__bodyAtlasDim[1]
      );
  }

  /**
   * The bindLightmap method.
   * @param {any} camera - The camera param.
   */
  setActiveCamera(camera) {
    // listen to changes in the camera and send updates to the worker.
  }

  /**
   * The onViewChanged method.
   * @param {any} viewXfo - The viewXfo param.
   * @param {any} viewDir - The viewDir param.
   */
  onViewChanged(viewXfo, viewDir) {
    if (this.__workerWorking) return
    // this.__workerWorking = true;
    // this.__worker.postMessage({
    //     eventType: 'viewChanged',
    //     viewXfo,
    //     viewDir
    // });
    // GLCADAssetWorker_onmessage({
    //     eventType: 'viewChanged',
    //     viewXfo,
    //     viewDir
    // }, (result) => {
    //     this.__onWorkerMessage(result);
    // });
  }

  /**
   * The draw method.
   * @param {any} renderstate - The renderstate param.
   * @return {any} - The return value.
   */
  draw(renderstate) {
    if (!this.__visible || !this.__drawItemsTarget) return false

    const boundTextures = renderstate['boundTextures'];

    this.__surfaceLibrary.bindSurfacesAtlas(renderstate);
    if (this.__trimSetLibrary)
      this.__trimSetLibrary.bindTrimSetAtlas(renderstate);
    this.bindDrawItemsAtlas(renderstate);
    // this.bindLightmap(renderstate)

    const gl = this.__gl;
    const unifs = renderstate.unifs;
    if (unifs.cutNormal) {
      gl.uniform3fv(unifs.cutNormal.location, this.__cutNormal.asArray());
      gl.uniform1f(unifs.planeDist.location, this.__cutDist);
      if (unifs.cutColor) {
        gl.uniform4fv(unifs.cutColor.location, this.__cutColor.asArray());
      }
    }
    gl.uniform3fv(unifs.assetCentroid.location, this.__assetCentroid.asArray());

    for (const key in this.__surfaceDrawSets) {
      // console.log("draw:" + key)
      const drawSet = this.__surfaceDrawSets[key];
      drawSet.draw(renderstate, renderstate.shaderId);
    }

    renderstate['boundTextures'] = boundTextures;
  }

  /**
   * The drawHighlightedGeoms method.
   * @param {any} renderstate - The renderstate param.
   * @return {any} - The return value.
   */
  drawHighlightedGeoms(renderstate) {
    if (!this.__visible || this.__numHighlightedGeoms == 0) return false

    const boundTextures = renderstate['boundTextures'];

    this.__surfaceLibrary.bindSurfacesAtlas(renderstate);
    if (this.__trimSetLibrary)
      this.__trimSetLibrary.bindTrimSetAtlas(renderstate);
    this.bindDrawItemsAtlas(renderstate);

    const gl = this.__gl;
    const unifs = renderstate.unifs;
    if (unifs.cutNormal) {
      gl.uniform3fv(unifs.cutNormal.location, this.__cutNormal.asArray());
      gl.uniform1f(unifs.planeDist.location, this.__cutDist);
    }
    gl.uniform3fv(unifs.assetCentroid.location, this.__assetCentroid.asArray());

    // Now draw the highlight outline.
    const highlightOutlineID = 1;
    for (const key in this.__surfaceDrawSets) {
      // console.log("draw:" + key)
      const drawSet = this.__surfaceDrawSets[key];
      drawSet.draw(renderstate, highlightOutlineID);
    }

    renderstate['boundTextures'] = boundTextures;
  }

  /**
   * The drawNormals method.
   * @param {any} renderstate - The renderstate param.
   * @param {any} shaderKey - The shaderKey param.
   * @return {any} - The return value.
   */
  drawNormals(renderstate, shaderKey) {
    if (!this.__visible || !this.__drawItemsTarget) return false

    this.__surfaceLibrary.bindSurfacesAtlas(renderstate);
    if (this.__trimSetLibrary)
      this.__trimSetLibrary.bindTrimSetAtlas(renderstate);
    this.bindDrawItemsAtlas(renderstate);

    const gl = this.__gl;
    const unifs = renderstate.unifs;
    if (unifs.cutNormal) {
      gl.uniform3fv(unifs.cutNormal.location, this.__cutNormal.asArray());
      gl.uniform1f(unifs.planeDist.location, this.__cutDist);
    }
    gl.uniform3fv(unifs.assetCentroid.location, this.__assetCentroid.asArray());

    for (const key in this.__surfaceDrawSets) {
      const drawSet = this.__surfaceDrawSets[key];
      drawSet.drawNormals(renderstate, shaderKey);
    }

    renderstate['boundTextures'] -= 3;
  }

  /**
   * The drawGeomData method.
   * @param {any} renderstate - The renderstate param.
   * @return {any} - The return value.
   */
  drawGeomData(renderstate) {
    if (!this.__visible || !this.__drawItemsTarget) return false

    const boundTextures = renderstate['boundTextures'];

    this.__surfaceLibrary.bindSurfacesAtlas(renderstate);
    if (this.__trimSetLibrary)
      this.__trimSetLibrary.bindTrimSetAtlas(renderstate);
    this.bindDrawItemsAtlas(renderstate);

    const gl = this.__gl;
    const unifs = renderstate.unifs;

    const assetIndexUnif = unifs.assetIndex;
    if (assetIndexUnif) {
      gl.uniform1i(assetIndexUnif.location, this.__assetId);
    }

    if (unifs.cutNormal) {
      gl.uniform3fv(unifs.cutNormal.location, this.__cutNormal.asArray());
      gl.uniform1f(unifs.planeDist.location, this.__cutDist);
    }
    gl.uniform3fv(unifs.assetCentroid.location, this.__assetCentroid.asArray());

    for (const key in this.__surfaceDrawSets) {
      // console.log("draw:" + key)
      const drawSet = this.__surfaceDrawSets[key];
      drawSet.draw(renderstate, renderstate.shaderId);
    }

    renderstate['boundTextures'] = boundTextures;
  }

  /**
   * The getGeomItem method.
   * @param {any} bodyId - The bodyId param.
   * @return {any} - The return value.
   */
  getGeomItem(bodyId) {
    return this.__cadBodies[bodyId].cadBody
  }

  /**
   * The getSurfaceData method.
   * @param {any} surfaceId - The surfaceId param.
   * @return {any} - The return value.
   */
  getSurfaceData(surfaceId) {
    return this.__cadAsset.getSurfaceLibrary().getSurfaceData(surfaceId)
  }

  /**
   * The getSurfaceData method.
   * @param {any} renderstate - The renderstate param.
   */
  drawSurfaceAtlas(renderstate) {
    if (this.__surfaceLibrary)
      this.__surfaceLibrary.drawSurfaceAtlas(renderstate);
  }

  /**
   * The drawTrimSets method.
   * @param {any} renderstate - The renderstate param.
   */
  drawTrimSets(renderstate) {
    if (this.__trimSetLibrary) this.__trimSetLibrary.drawTrimSets(renderstate);
  }

  /**
   * The drawLightmap method.
   * @param {any} renderstate - The renderstate param.
  drawLightmap(renderstate) {
    if (this.__trimSetLibrary) this.__trimSetLibrary.drawTrimSets(renderstate)
  }
   */

  /**
   * The drawLightmap method.
   * @param {any} renderstate - The renderstate param.
   * @return {any} - The return value.
  drawLightmap(renderstate) {
    if (
      this.__lightmapChannel == -1 ||
      !this.__cadpassdata.debugTrimSetsShader.bind(renderstate)
    )
      return false
    // this.bindTrimSetAtlas(renderstate);
    const unifs = renderstate.unifs
    if (unifs.cutNormal) {
      gl.uniform3fv(unifs.cutNormal.location, this.__cutNormal.asArray())
      gl.uniform1f(unifs.planeDist.location, this.__cutDist)
    }

    this.__lightmapFbos[this.__lightmapChannel]
      .getColorTexture()
      .bindToUniform(renderstate, unifs.trimSetAtlasTexture)
    this.__cadpassdata.glplanegeom.bind(renderstate)
    this.__cadpassdata.glplanegeom.draw()
  }
   */

  /**
   * The destroy method.
   */
  destroy() {
    this.__cadAsset.visibilityChanged.disconnectId(this.visibilityChangedId);
    this.__cadAsset.getParameter('CutPlaneColor').valueChanged.disconnectId(this.cutPlaneColorChangedId);
    this.__cadAsset.getParameter('CutPlaneNormal').valueChanged.disconnectId(this.cutPlaneNormalChangedId);
    this.__cadAsset.getParameter('CutPlaneDist').valueChanged.disconnectId(this.cutDistParamChangedId);

    this.__bodyItemTexture.destroy();

    this.__cadBodies.forEach(glCADBody => glCADBody.destroy());
    this.__cadBodies = [];
    this.__curveLibrary.destroy();
    this.__surfaceLibrary.destroy();

    if (this.__trimSetLibrary) {
      this.__trimSetLibrary.destroy();
    }
    
    for (const drawSetKey in this.__surfaceDrawSets) {
      let drawSet = this.__surfaceDrawSets[drawSetKey];
      drawSet.destroy();
    }
  }
}

/** Class representing a GL CAD material library.
 * @ignore
 */
class GLCADMaterialLibrary {
  /**
   * Create a GL CAD material library.
   * @param {any} gl - The gl value.
   */
  constructor(gl) {
    this.__gl = gl;
    this.__materialDatas = [];
    this.__dirtyIndices = [];
    this.__numItems = 0;
    this.__materialPacker = new zeaEngine.GrowingPacker(256, 256);

    this.__needsUpload = false;
    this.updated = new zeaEngine.Signal();
  }

  /**
   * The addMaterial method.
   * @param {any} material - The material param.
   * @return {any} - The return value.
   */
  addMaterial(material) {
    if (material.getMetadata('glmaterialcoords')) {
      return
    }

    this.__numItems++;

    const coords = this.__materialPacker.addBlock({ w: 2, h: 1 });
    const materialId = this.__materialDatas.length;
    this.__materialDatas.push({
      material,
      coords,
    });

    material.parameterValueChanged.connect(() => {
      // this.__renderer.requestRedraw();
      this.__dirtyIndices.push(materialId);
      this.updated.emit();
    });

    material.setMetadata('glmaterialcoords', coords);

    this.__dirtyIndices.push(materialId);

    return coords
  }

  /**
   * The needsUpload method.
   * @return {any} - The return value.
   */
  needsUpload() {
    return this.__dirtyIndices.length > 0
  }

  /**
   * The uploadMaterials method.
   */
  uploadMaterials() {
    const gl = this.__gl;
    const width = this.__materialPacker.root.w;
    const height = this.__materialPacker.root.h;
    console.log('Num Used Materials:' + this.__numItems, width, height);
    if (!this.__materialsTexture) {
      this.__materialsTexture = new zeaEngine.GLTexture2D(gl, {
        format: 'RGBA',
        type: 'FLOAT',
        width,
        height,
        filter: 'NEAREST',
        wrap: 'CLAMP_TO_EDGE',
        mipMapped: false,
      });
      this.__materialsTexture.clear();
    } else if (
      this.__materialsTexture.width != width ||
      this.__materialsTexture.height != height
    ) {
      throw new Error(
        'Cannot resize here. Need a resize the preserves the data.'
      )
    }

    gl.bindTexture(gl.TEXTURE_2D, this.__materialsTexture.glTex);
    const typeId = this.__materialsTexture.getTypeID();
    const formatId = this.__materialsTexture.getFormatID();

    const eachMaterial = value => {
      const materialData = this.__materialDatas[value];
      const material = materialData.material;

      let shaderClass = zeaEngine.sgFactory.getClass(material.getShaderName());
      if (!shaderClass || !shaderClass.getPackedMaterialData) {
        shaderClass = zeaEngine.sgFactory.getClass('GLDrawCADSurfaceShader');
      }

      const matData = shaderClass.getPackedMaterialData(material);

      const width = matData.length / 4; // 4==RGBA pixels.
      const height = 1;

      const coords = materialData.coords;
      if (typeId == gl.FLOAT) {
        gl.texSubImage2D(
          gl.TEXTURE_2D,
          0,
          coords.x,
          coords.y,
          width,
          height,
          formatId,
          typeId,
          matData
        );
      } else {
        const unit16s = Math.convertFloat32ArrayToUInt16Array(matData);
        gl.texSubImage2D(
          gl.TEXTURE_2D,
          0,
          coords.x,
          coords.y,
          width,
          height,
          formatId,
          typeId,
          unit16s
        );
      }
    };
    this.__dirtyIndices.forEach(eachMaterial);
    this.__dirtyIndices = [];
  }

  /**
   * The bind method.
   * @param {any} renderstate - The renderstate param.
   * @return {any} - The return value.
   */
  bind(renderstate) {
    if (!this.__materialsTexture) return false

    const gl = this.__gl;
    const unifs = renderstate.unifs;
    if (unifs.materialsTexture)
      this.__materialsTexture.bindToUniform(renderstate, unifs.materialsTexture);
    if (unifs.materialsTextureSize)
      gl.uniform2i(
        unifs.materialsTextureSize.location,
        this.__materialsTexture.width,
        this.__materialsTexture.height
      );
    return true
  }
}

zeaEngine.shaderLibrary.setShaderModule(
  'GLSLBinReader.glsl',
  `

#ifdef DECODE_16BIT_FLOAT_FROM_8BIT_INT

/////////////////////////////////////////////////////////////////
// http://concord-consortium.github.io/lab/experiments/webgl-gpgpu/script.js
// Note: modulo on some GPUS. (e.g. iPhone)
// often incur errors in modulo, leaving a result
// that appears to boe the y param. in this use case
// we are only interested in integer moduos anyway
// so we just trim off erronious values. .Seems to work. 
float fixed_mod(float x, float y) {
  float res = mod(x, y);
  return (abs(y - res) < 0.5) ? 0.0 : res;
}

float shift_right(float v, float amt) {
  v = floor(v) + 0.5;
  return floor(v / exp2(amt));
}

float shift_left(float v, float amt) {
  return floor(v * exp2(amt) + 0.5);
}

float mask_last(float v, float bits) {
  return fixed_mod(v, shift_left(1.0, bits));
}

float extract_bits(float num, float from, float to) {
  from = floor(from + 0.5);
  to = floor(to + 0.5);
  return mask_last(shift_right(num, from), to - from);
}


/////////////////////////////////////////////////////////////////

float decode16BitFloatFrom2xUInt8_IEEE(vec2 c){
  float v = 0.;

  // int h = c.x + c.y * 256;
  // const s = (h & 0x8000) >> 15;
  // const e = (h & 0x7C00) >> 10;
  // const f = h & 0x03FF;


  // float h = c.x + c.y * 256.0;
  // float s = extract_bits(h, 15.0, 16.0);
  // float e = extract_bits(h, 10.0, 15.0);
  // float f = extract_bits(h, 0.0, 10.0);

  // float s = extract_bits(c.y, 7.0, 8.0);
  // float e = extract_bits(c.y, 2.0, 7.0);

  int s = (c.y >= 127.5) ? 1 : 0;
  float e = shift_right(c.y - ((s == 1) ? 128.0 : 0.0), 2.0);
  float f = c.x + mask_last(c.y, 2.0) * 256.0;
  // return float(s);

  if(e < 0.5) {
    return ((s!=0)?-1.0:1.0) * exp2(-14.0) * (f/exp2(10.0));
  } else if (int(e) == 0x1F) {
    float NaN = 0.0;
    float Inf = 0.0;
    return (f==0.0)?(NaN):(((s!=0)?-1.0:1.0)*Inf);
  }

  return ((s!=0)?-1.0:1.0) * exp2(e-15.0) * (1.0+(f/exp2(10.0)));
}

#endif

// RGBA16 textures
vec4 GLSLBinReader_texelFetch2D(sampler2D texture, ivec2 textureSize, ivec2 address) {
  return fetchTexel(texture, textureSize, address);
}

struct GLSLBinReader {
  ivec2 textureSize; 
  ivec4 region;
  ivec2 start; /* the base address from which we base the offsets */
  int offset; /* how far we have read into the buffer . Note: value is in channels. so 4 == 1 pixel.*/
  vec4 buffer; 
  ivec2 bufferaddress;
  int bpc; // bits per channel. (e.g. 8, 16, 32)
};

void GLSLBinReader_init(inout GLSLBinReader reader, ivec2 textureSize, ivec4 region, ivec2 start, int bpc) {
  reader.textureSize = textureSize;
  reader.region = region;
  reader.start = start;
#ifdef DECODE_16BIT_FLOAT_FROM_8BIT_INT
  reader.start = ivec2(start.x * 2, start.y);
#else
  reader.start = start;
#endif
  reader.bpc = bpc;
  reader.bufferaddress = ivec2(-1, -1);
}

void GLSLBinReader_init(inout GLSLBinReader reader, ivec2 textureSize, int bpc) {
  reader.textureSize = textureSize;
  reader.region = ivec4(0, 0, textureSize.x, textureSize.y);
  reader.start = ivec2(0,0);
  reader.bpc = bpc;
  reader.bufferaddress = ivec2(-1, -1);
}


ivec2 GLSLBinReader_getAddress(in GLSLBinReader reader, int offset) {
#ifdef DECODE_16BIT_FLOAT_FROM_8BIT_INT
  ivec2 address = ivec2(reader.start.x + (offset/2), reader.start.y);
#else
  ivec2 address = ivec2(reader.start.x + (offset/4), reader.start.y);
#endif
  address.y += address.x / reader.region.z;
  address.x = imod(address.x, reader.region.z);
  return address;
}


float GLSLBinReader_readFloat(inout GLSLBinReader reader, sampler2D texture, int offset) {

  ivec2 address = GLSLBinReader_getAddress(reader, offset);

  if(address != reader.bufferaddress){
    reader.buffer = GLSLBinReader_texelFetch2D(texture, reader.textureSize, reader.region.xy + address);
    reader.bufferaddress = address;
  }

#ifdef DECODE_16BIT_FLOAT_FROM_8BIT_INT

  int swizelIndex = imod(offset, 2);
  if(swizelIndex == 0)
    return decode16BitFloatFrom2xUInt8_IEEE(reader.buffer.xy * 255.0);
  return decode16BitFloatFrom2xUInt8_IEEE(reader.buffer.zw * 255.0);

#else

  int swizelIndex = imod(offset, 4);
  if(swizelIndex == 0)
    return reader.buffer.x;
  if(swizelIndex == 1)
    return reader.buffer.y;
  if(swizelIndex == 2)
    return reader.buffer.z;
  return reader.buffer.w;
  
#endif
}


int GLSLBinReader_readInt(inout GLSLBinReader reader, sampler2D texture, int offset) {
  if(reader.bpc == 8)
    return int(GLSLBinReader_readFloat(reader, texture, offset) * 255.0);
  else {
    float flt = GLSLBinReader_readFloat(reader, texture, offset);
    return int(flt);
  }
}

int GLSLBinReader_readUInt(inout GLSLBinReader reader, sampler2D texture, int offset) {
  if(reader.bpc == 8)
    return int(GLSLBinReader_readFloat(reader, texture, offset) * 255.0);
  else {
    float flt = GLSLBinReader_readFloat(reader, texture, offset);
    if (flt < 0.0) {
      return int(2048.0 - flt);
    }
    else {
      return int(flt);
    }
  }
}

vec4 GLSLBinReader_readVec4(inout GLSLBinReader reader, sampler2D texture, int offset) {
  ivec2 address = GLSLBinReader_getAddress(reader, offset);
  return GLSLBinReader_texelFetch2D(texture, reader.textureSize, reader.region.xy + address);
}


vec3 GLSLBinReader_readVec3(inout GLSLBinReader reader, sampler2D texture, int offset) {
  return GLSLBinReader_readVec4(reader, texture, offset).rgb;
}

vec2 GLSLBinReader_readVec2(inout GLSLBinReader reader, sampler2D texture, int offset) {
  return vec2(
    GLSLBinReader_readFloat(reader, texture, offset),
    GLSLBinReader_readFloat(reader, texture, offset+1)
  );
}



float GLSLBinReader_readFloat(inout GLSLBinReader reader, sampler2D texture) {
  float result = GLSLBinReader_readFloat( reader,  texture, reader.offset);
  reader.offset++;
  return result;
}

int GLSLBinReader_readInt(inout GLSLBinReader reader, sampler2D texture) {
  if(reader.bpc == 8)
    return int(GLSLBinReader_readFloat(reader, texture) * 255.0);
  else
    return int(GLSLBinReader_readFloat(reader, texture));
}

int GLSLBinReader_readUInt(inout GLSLBinReader reader, sampler2D texture) {
  if(reader.bpc == 8)
    return int(GLSLBinReader_readFloat(reader, texture) * 255.0);
  else {
    float flt = GLSLBinReader_readFloat(reader, texture);
    if (flt < 0.0) {
      return int(2048.0 - flt);
    }
    else {
      return int(flt);
    }
  }
}

int GLSLBinReader_readUIntFrom2xUFloat16(inout GLSLBinReader reader, sampler2D texture) {
  int partA = GLSLBinReader_readUInt(reader, texture);
  int partB = GLSLBinReader_readUInt(reader, texture);
  
#ifdef INTS_PACKED_AS_2FLOAT16
  // Changed on version 0.0.28
  return partA + (partB * 4096);
#else
  return partA + (partB * 256);
#endif
}

vec4 GLSLBinReader_readVec4(inout GLSLBinReader reader, sampler2D texture) {
  vec4 result = GLSLBinReader_readVec4( reader, texture, reader.offset);
  reader.offset += 4;
  return result;
}


vec3 GLSLBinReader_readVec3(inout GLSLBinReader reader, sampler2D texture) {
  return GLSLBinReader_readVec4(reader, texture).rgb;
}

vec2 GLSLBinReader_readVec2(inout GLSLBinReader reader, sampler2D texture) {
  return vec2(
    GLSLBinReader_readFloat(reader, texture),
    GLSLBinReader_readFloat(reader, texture)
  );
}



`
);

zeaEngine.shaderLibrary.setShaderModule(
  'GLSLMath.glsl',
  `

<%include file="stack-gl/transpose.glsl"/>

  ////////////////////////////////////////
  
  struct Xfo2d {
    vec2 tr;
    float rot;
    vec2 sc;
  };

  vec2 rotateVec2(float rot, vec2 vec){
    float cosa = cos(rot);
    float sina = sin(rot);
    return vec2(vec.x * cosa - vec.y * sina, vec.x * sina + vec.y * cosa);
  }

  vec2 Xfo2D_transformVec2(Xfo2d xfo2d, vec2 pos){
    return xfo2d.tr + rotateVec2(xfo2d.rot, pos * xfo2d.sc);
  }

  ////////////////////////////////////////


  vec4 quat_fromAxisAndAngle(vec3 axis, float angle) {
    float halfAngle = angle / 2.0;
    vec3 vec = axis* sin(halfAngle);
    return vec4(vec.x, vec.y, vec.z, cos(halfAngle));
  }

  vec4 quat_conjugate(vec4 quat) {
    return vec4(-quat.x, -quat.y, -quat.z, quat.w);
  }

  vec4 quat_multiply(vec4 lhs, vec4 rhs) {
    float ax = lhs.x;
    float ay = lhs.y;
    float az = lhs.z;
    float aw = lhs.w;
    float bx = rhs.x;
    float by = rhs.y;
    float bz = rhs.z;
    float bw = rhs.w;
    return vec4(
      ax * bw + aw * bx + ay * bz - az * by,
      ay * bw + aw * by + az * bx - ax * bz,
      az * bw + aw * bz + ax * by - ay * bx,
      aw * bw - ax * bx - ay * by - az * bz
    );
  }

  vec3 quat_rotateVec3(vec4 quat, vec3 rhs) {
    vec4 vq = vec4(rhs.x, rhs.y, rhs.z, 0.0);
    vec4 pq = quat_multiply(quat_multiply(quat, vq), quat_conjugate(quat));
    return vec3(pq.x, pq.y, pq.z);
  }


  mat4 tr_toMat4(vec3 tr) {
    // Note: GLSL matrices are transposed compared to the matrices in ZeaEngine
    vec4 col0 = vec4(1.0, 0.0, 0.0, 0.0);
    vec4 col1 = vec4(0.0, 1.0, 0.0, 0.0);
    vec4 col2 = vec4(0.0, 0.0, 1.0, 0.0);
    vec4 col3 = vec4(tr, 1.0);
    return mat4(col0, col1, col2, col3);
  }

  mat4 quat_toMat4(vec4 quat) {

    float x2 = quat.x + quat.x;
    float y2 = quat.y + quat.y;
    float z2 = quat.z + quat.z;

    float xx = quat.x * x2;
    float yx = quat.y * x2;
    float yy = quat.y * y2;
    float zx = quat.z * x2;
    float zy = quat.z * y2;
    float zz = quat.z * z2;
    float wx = quat.w * x2;
    float wy = quat.w * y2;
    float wz = quat.w * z2;


    // Note: GLSL matrices are transposed compared to the matrices in ZeaEngine
    vec4 col0 = vec4(
      1.0 - yy - zz,
      yx - wz,
      zx + wy,
      0.0);

    vec4 col1 = vec4(
      yx + wz,
      1.0 - xx - zz,
      zy - wx,
      0.0);

    vec4 col2 = vec4(
      zx - wy,
      zy + wx,
      1.0 - xx - yy,
      0.0);

    vec4 col3 = vec4(
      0.0,
      0.0,
      0.0,
      1.0);

    // return mat4(col0, col1, col2, col3);
    return transpose(mat4(col0, col1, col2, col3));
  }

  mat4 sc_toMat4(vec3 sc) {
    // Note: GLSL matrices are transposed compared to the matrices in ZeaEngine
    return mat4(
      sc.x, 0.0,  0.0,  0.0,
      0.0,  sc.y, 0.0,  0.0,
      0.0,  0.0,  sc.z, 0.0,
      0.0,  0.0,  0.0,  1.0);
  }

  struct Xfo {
    vec3 tr;
    vec4 ori;
    vec3 sc;
  };

  Xfo xfo_multiply(Xfo xfo, Xfo other){
    return Xfo(
      xfo.tr + quat_rotateVec3(xfo.ori, xfo.sc * other.tr),
      quat_multiply(xfo.ori, other.ori),
      xfo.sc * other.sc
    );
  }

  mat4 xfo_toMat4(Xfo xfo){
    mat4 sc_mat4 = sc_toMat4(xfo.sc);
    mat4 ori_mat4  = quat_toMat4(xfo.ori);
    mat4 tr_mat4  = tr_toMat4(xfo.tr);
    mat4 result = tr_mat4 * ori_mat4 * sc_mat4;
    return result;
  }

`
);

zeaEngine.shaderLibrary.setShaderModule(
  'GLSLCADCurves.glsl',
  `

  // http://cadexchanger.com/download/sdk/doc/dev/html/sdk_data_model_geometry_topology.html#sdk_data_model_geometry_curves



// http://cadexchanger.com/download/sdk/doc/dev/html/sdk_data_model_geometry_topology.html#sdk_data_model_geometry_surfaces


vec2 loadVec2(inout GLSLBinReader reader, sampler2D texture) {
  return vec2(GLSLBinReader_readFloat(reader, texture),  GLSLBinReader_readFloat(reader, texture));
}

float mapDomain1d(vec2 domain, float param) {
  float u = domain.x + param * ( domain.y - domain.x );
  return u;
}

/////////////////////////////////////////
// Line

PosNorm calcLinePoint(float param, inout GLSLBinReader reader, sampler2D texture) {
  vec2 domain = loadVec2(reader, texture);
  float u = mapDomain1d( domain, param );
  vec3 pos = vec3(u, 0.0, 0.0);
  vec3 norm = vec3(1.0, 0.0, 0.0);
  return PosNorm(pos, norm, CURVE_TYPE_LINE);
}


/////////////////////////////////////////
// Circle

PosNorm calcCirclePoint(float param, inout GLSLBinReader reader, sampler2D texture) {
  vec2 domain = loadVec2(reader, texture);
  float radius = GLSLBinReader_readFloat(reader, texture);

  float u = mapDomain1d( domain, param );
  vec3 pos = vec3(cos(u) * radius, sin(u) * radius, 0.0);
  vec3 norm = vec3(-sin(u), cos(u), 0.0);
  return PosNorm(pos, norm, CURVE_TYPE_CIRCLE);
}



/////////////////////////////////////////
// Elipse3d
// An ellipse is a periodic curve parametrized as follows: C(t) = P + X * R_major * cos(t) + Y * R_minor * sin(t), where

// P is an origin point,
// X and Y are directions,
// R_major and R_minor are major and minor radii,
// t belongs to [0, 2 * PI].
// Note that major radius is always along the X-axis and minor radius - along the Y-axis, and that with t=0 the point corresponds to a major radius.


PosNorm calcElipsePoint(float param, inout GLSLBinReader reader, sampler2D texture) {
  vec2 domain = loadVec2(reader, texture);
  float u = mapDomain1d( domain, param );
  float minorRadius = GLSLBinReader_readFloat(reader, texture);
  float majorRadius = GLSLBinReader_readFloat(reader, texture);
  vec3 pos = vec3(cos(u) * majorRadius, sin(u) * minorRadius, 0.0);
  vec3 norm = normalize(vec3(-sin(u) * majorRadius, cos(u) * minorRadius, 0.0)); // TODO: fix this broken line.

  // pos = vec3(float(minorRadius));

  return PosNorm(pos, norm, CURVE_TYPE_ELIPSE);
}

`
);

zeaEngine.shaderLibrary.setShaderModule(
  'GLSLCADSimpleSurfaces.glsl',
  `

  // http://cadexchanger.com/download/sdk/doc/dev/html/sdk_data_model_geometry_topology.html#sdk_data_model_geometry_surfaces


/////////////////////////////////////////
// Plane
// A plane is parametrized as follows: S(u,v) = P + u * dX + v * dY, where

// P is an origin point,
// dX and dY are directions (unit vectors) of X and Y axes respectively,
// u, v belongs to (-Infinity, +Infinity).

PosNorm calcPlaneSurfacePoint(vec2 params, inout GLSLBinReader reader, sampler2D texture) {
  box2 domain = loadBox2(reader, texture);
  vec2 uv = mapDomain(domain, params);

  vec3 pos = vec3(uv.x, uv.y, 0.0);
  vec3 normal = vec3(0.0, 0.0, 1.0);

  return PosNorm(pos, normal, SURFACE_TYPE_PLANE);
}

/////////////////////////////////////////
// Poly Plane
// A plane is parametrized as follows: S(u,v) = P + u * dX + v * dY, where

// P is an origin point,
// dX and dY are directions (unit vectors) of X and Y axes respectively,
// u, v belongs to (-Infinity, +Infinity).

PosNorm calcPolyPlaneSurfacePoint(vec2 params, inout GLSLBinReader reader, sampler2D texture) {
  // Domain does not need to be mapped in this case.
  vec2 uv = params;
  vec2 p0 = GLSLBinReader_readVec2(reader, texture);
  vec2 p1 = GLSLBinReader_readVec2(reader, texture);
  vec2 p2 = GLSLBinReader_readVec2(reader, texture);
  vec2 p3 = GLSLBinReader_readVec2(reader, texture);

  vec2 pos = mix(mix(p0, p1, uv.x), mix(p3, p2, uv.x), uv.y);
  vec3 normal = vec3(0.0, 0.0, 1.0);

  return PosNorm(vec3(pos, 0.0), normal, SURFACE_TYPE_POLY_PLANE);
}


/////////////////////////////////////////
// Fan
// A plane is parametrized as follows: S(u,v) = P + u * dX + v * dY, where

// P is an origin point,
// dX and dY are directions (unit vectors) of X and Y axes respectively,
// u, v belongs to (-Infinity, +Infinity).

PosNorm calcFanSurfacePoint(vec2 params, inout GLSLBinReader reader, sampler2D texture) {
  // Domain does not need to be mapped in this case.
  vec2 uv = params;
  // Skip forward 2 values for each vertex.
  reader.offset += int(2.0 * floor(v_vertexCoord.x));
  vec2 pos = GLSLBinReader_readVec2(reader, texture);
  vec3 normal = vec3(0.0, 0.0, 1.0);

  return PosNorm(vec3(pos, 0.0), normal, SURFACE_TYPE_FAN);
}



/////////////////////////////////////////
// Cone
// A conical surface is parametrized as follows: S(u,v) = P + r * cos(u) * Dx + r * sin(u) * Dy + v * cos(φ) * Dz, where

// P is an origin point,
// Dx, Dy and Dz are directions (unit vectors) of X, Y and Z axes respectively,
// φ - semi-angle, i.e. an angle between Dz and any generatrix,
// r = R + v * sin(φ), i.e. a radius of a circle at respective parameter v,
// u belongs to [0, 2 * PI],
// v belongs to (-infinity, +infinity).
// U-parameter is an angle along the circle at a given parameter V and V-parameter is a length along the cone. Thus, U-isolines are lines and V-isoline are circles.

// V-isoline at V=0 is a circle of radius R in the plane defined by an axis placement.

// Conical surface contains both halfs of mathematical cone.

// Conical surface is U-periodical with period 2 * PI. At a cone apex, r equals 0, hence V-parameter of an apex equals -R / sin(φ)


PosNorm calcConeSurfacePoint(vec2 params, inout GLSLBinReader reader, sampler2D texture) {
  box2 domain = loadBox2(reader, texture);
  float r = GLSLBinReader_readFloat(reader, texture);
  float semiAngle = GLSLBinReader_readFloat(reader, texture);
  vec2 uv = mapDomain(domain, params);

  float u = uv.x;
  float v = uv.y;
  float r_at_v = r + v * sin(semiAngle);
  vec3 pos = vec3(r_at_v * cos(u), r_at_v * sin(u), v * cos(semiAngle));
  vec3 normal = normalize(vec3(cos(u)*cos(semiAngle), sin(u)*cos(semiAngle), -sin(semiAngle)));
  return PosNorm(pos, normal, SURFACE_TYPE_CONE);
}


/////////////////////////////////////////
// Cylinder
// A cylindrical surface is parametrized as follows: S(u,v) = P + R * cos(u) * dX + R * sin(u) * dY + v * dZ, where

// P is an origin point,
// dX, dY and dZ are directions (unit vectors) of X, Y and Z axes respectively,
// R is a radius,
// u belongs to [0, 2 * PI],
// v belongs to (-infinity, +infinity).


PosNorm calcCylinderSurfacePoint(vec2 params, inout GLSLBinReader reader, sampler2D texture) {
  box2 domain = loadBox2(reader, texture);
  float r = GLSLBinReader_readFloat(reader, texture);
  vec2 uv = mapDomain(domain, params);

  vec3 normal = vec3(cos(uv.x), sin(uv.x), 0.0);
  vec3 pos = r * normal + vec3(0.0, 0.0, uv.y);

  return PosNorm(pos, normal, SURFACE_TYPE_CYLINDER);
}


/////////////////////////////////////////
// Sphere
// A spherical surface is parametrized as follows: S(u,v) = P + R * cos(v) * (cos(u) * Dx + sin(u) * Dy) + R * sin(v) * Dz, where

// P is an origin point,
// Dx, Dy and Dz are directions (unit vectors) of X, Y and Z axes respectively,
// R is a radius,
// u belongs to [0, 2 * PI],
// v belongs to [-PI/2, +PI/2].
// U-parameter is an angle of rotation around the Dz axis counterclockwise (i.e. similar to longitude on the Earth), and V-parameter is an angle between plane defined by an axis placement and line from P to a point on a sphere (i.e. latitude). Thus, U-isolines are semi-circles and V-isoline are circles.

// V-isoline at V=0 is a circle of radius R in the plane defined by an axis placement. U-isoline at U=0 corresponds to a semi-circle from south to north pole.

// Spherical surface is U-periodical with period 2 * PI.

// If a face lies on a full spherical surface its boundary wire will contain two a degenerated edges corresponding to the south and north poles (V equals -PI/2 and PI/2 respectively), and a seam-edge.


PosNorm calcSphereSurfacePoint(vec2 params, inout GLSLBinReader reader, sampler2D texture) {
  box2 domain = loadBox2(reader, texture);
  vec2 uv = mapDomain(domain, params);

  float r = GLSLBinReader_readFloat(reader, texture);

  float u = uv.x;
  float v = uv.y;
  vec3 normal = vec3(cos(v) * cos(u), cos(v) * sin(u), sin(v));
  vec3 pos = r * normal;

  return PosNorm(pos, normal, SURFACE_TYPE_SPHERE);
}

/////////////////////////////////////////
// Torus

// A toroidal surface is parametrized as follows: S(u,v) = (R1 + R2 * cos(v)) * (cos(u) * Dx + sin(u) * Dy) + R2 * sin(v) * Dz, where

// R1 is a major radius,
// R2 is a minor radius,
// u belongs to [0, 2 * PI],
// v belongs to [0, 2 * PI],
// U-parameter is an angle when rotating around the Dz axis counterclockwise, and V-parameter is an angle in circular section at a given parameter U. Thus, U-isolines circles lying in the plane containing Z axis and V-isolines are circles in the planes perpendicular to Z axis.

// V-isoline at V=0 is a circle of radius (R1 + R2) in the plane defined by an axis placement. U-isoline at U=0 is a circle of radius R2 in the plane containing Z and X axes.

// Radii R1 and R2 must be positive. If R2 > R1 then toroidal surface will be self-intersecting.

// Toroidal surface is both U- and V-periodical with periods 2 * PI.

// If a face lies on a full toroidal surface its boundary wire will contain two seam-edges, corresponding to U=0 and U=2*PI, and V=0 and V=2*PI respectively.


PosNorm calcTorusSurfacePoint(vec2 params, inout GLSLBinReader reader, sampler2D texture) {
  box2 domain = loadBox2(reader, texture);
  vec2 uv = mapDomain(domain, params);

  float majorRadius = GLSLBinReader_readFloat(reader, texture);
  float minorRadius = GLSLBinReader_readFloat(reader, texture);
  float u = uv.x;
  float v = uv.y;
  vec3 pos = (majorRadius + minorRadius * cos(v)) * vec3(cos(u), sin(u), 0.0) + vec3(0.0, 0.0, minorRadius * sin(v));

  vec3 normal = vec3(cos(v) * cos(u), cos(v) * sin(u), sin(v));
  // vec3 pos = majorRadius * normal;

  return PosNorm(pos, normal, SURFACE_TYPE_TORUS);
}

`
);

zeaEngine.shaderLibrary.setShaderModule(
  'GLSLCADCompoundSurfaces.glsl',
  `

/////////////////////////////////////////
// LinearExtrusion

PosNorm calcLinearExtrusionSurfacePoint(vec2 params, inout GLSLBinReader reader, sampler2D texture) {
  box2 domain = loadBox2(reader, texture);
  
  int curve_index = GLSLBinReader_readUIntFrom2xUFloat16(reader, texture);

  vec3 curve_tr = vec3(
    GLSLBinReader_readFloat(reader, texture),
    GLSLBinReader_readFloat(reader, texture),
    GLSLBinReader_readFloat(reader, texture)
  );
  vec4 curve_ori = vec4(
    GLSLBinReader_readFloat(reader, texture),
    GLSLBinReader_readFloat(reader, texture),
    GLSLBinReader_readFloat(reader, texture),
    GLSLBinReader_readFloat(reader, texture)
    );
  vec3 curve_sc = vec3(
    GLSLBinReader_readFloat(reader, texture),
    GLSLBinReader_readFloat(reader, texture),
    GLSLBinReader_readFloat(reader, texture)
  );
  vec2 uv = mapDomain(domain, params);

  PosNorm curveResult = evalCADCurve3d(curve_index, uv.x);
  
  vec3 pos = quat_rotateVec3(curve_ori, curveResult.pos * curve_sc) + curve_tr;
  pos.z += uv.y;

  vec3 normal = normalize(cross(vec3(0.0, 0.0, 1.0), quat_rotateVec3(curve_ori, curveResult.normal)));

  return PosNorm(pos, normal, SURFACE_TYPE_LINEAR_EXTRUSION);
}


/////////////////////////////////////////
// Revolution
PosNorm calcRevolutionSurfacePoint(vec2 params, inout GLSLBinReader reader, sampler2D texture, bool flipDomain) {
  box2 domain = loadBox2(reader, texture);

  int curve_index = GLSLBinReader_readUIntFrom2xUFloat16(reader, texture);

  vec3 curve_tr = vec3(
    GLSLBinReader_readFloat(reader, texture),
    GLSLBinReader_readFloat(reader, texture),
    GLSLBinReader_readFloat(reader, texture)
  );
  vec4 curve_ori = vec4(
    GLSLBinReader_readFloat(reader, texture),
    GLSLBinReader_readFloat(reader, texture),
    GLSLBinReader_readFloat(reader, texture),
    GLSLBinReader_readFloat(reader, texture)
    );
  vec3 curve_sc = vec3(
    GLSLBinReader_readFloat(reader, texture),
    GLSLBinReader_readFloat(reader, texture),
    GLSLBinReader_readFloat(reader, texture)
  );
  vec2 uv = mapDomain(domain, params);

  vec3 axis = vec3(0.0, 0.0, 1.0);
  PosNorm curveResult;
  vec4 rev;
  if (flipDomain) {
    curveResult = evalCADCurve3d(curve_index, uv.x);
    rev = quat_fromAxisAndAngle(axis, uv.y);
  } else {
    curveResult = evalCADCurve3d(curve_index, uv.y);
    rev = quat_fromAxisAndAngle(axis, uv.x);
  }

  vec3 p_t = quat_rotateVec3(curve_ori, curveResult.pos * curve_sc) + curve_tr;
  vec3 pos = quat_rotateVec3(rev, p_t);

  vec3 p_n = quat_rotateVec3(rev, quat_rotateVec3(curve_ori, curveResult.normal));
  
  vec3 tangent;
  if (abs(1.0 - dot(p_n, axis)) > 0.001) {
    tangent = cross(p_n, axis);
  } else {
    tangent = cross(pos, axis);
  }

  // TODO: Find a conclusive test file that demonstrates this as correct.
  // I think it is the master cylinder sample.
  // vec3 normal = normalize(cross(p_n, tangent));
  vec3 normal = normalize(cross(tangent, p_n));

  // vec3 pos;
  // vec3 normal;
  // pos.x = float(partA);
  // pos.y = float(partB);
  // pos.z = float(curve_index);
  return PosNorm(pos, normal, SURFACE_TYPE_REVOLUTION);
}


/////////////////////////////////////////
// OffsetSurface

PosNorm calcOffsetSurfaceSurfacePoint(vec2 params, inout GLSLBinReader reader, sampler2D texture) {
  box2 domain = loadBox2(reader, texture);
  int surfaceId = GLSLBinReader_readUInt(reader, texture);
  float offset = GLSLBinReader_readFloat(reader, texture);
  vec2 uv = mapDomain(domain, params);

/*
  GLSLBinReader subSurfaceReader = reader;
  subSurfaceReader.start = 
  GLSLBinReader_init(reader, surfaceDataTextureSize, region, start, 32);

  vec3 p = calcCurvePoint(uv.x);
  vec3 pos = p + dir * (dist * uv.y);
  
*/
  vec3 pos;
  vec3 normal;
  return PosNorm(pos, normal, SURFACE_TYPE_OFFSET_SURFACE);
}



`
);

zeaEngine.shaderLibrary.setShaderModule(
  'GLSLNURBS.glsl',
  `

#define MAX_KNOTS 256
// Note: The BRP motorcycle features many surfaces of degree 15.
#define MAX_DEGREE 16

float kp(int index, inout GLSLBinReader r, sampler2D t, int offset) {
  return GLSLBinReader_readFloat(r, t, offset+index);
}

#ifdef EXPORT_KNOTS_AS_DELTAS

int findSpan(float u, in int degree, in int numKnots, int kpOff, inout GLSLBinReader r, sampler2D t, out highp float knots[MAX_DEGREE*2+1]) {
  
  float nextKnot = kp(0, r, t, kpOff);
  float knot = nextKnot;

  int span = 1;
  int n = numKnots - degree - 1;
  // Linear Search...
  for (; span<n; span++){
    nextKnot += kp(span, r, t, kpOff);
    if (span > degree && u < nextKnot){
      span--;
      break;
    }
    knot = nextKnot;
  }
  if (span == n) {
    span--;
  }


  //Calculate knot values
  knots[degree] = knot;
  float left = knot;
  float right = knot; 
  for (int i=1; i<=degree; i++) {
    left -= kp(span-i+1, r, t, kpOff);
    right += kp(span+i, r, t, kpOff);
    knots[degree-i] = left;
    knots[degree+i] = right;
  }

  return span;
}

void calcBasisValues(in float u, in int degree, in highp float knots[MAX_DEGREE*2+1], out highp float basisValues[MAX_DEGREE+1], out highp float bvD[MAX_DEGREE+1]) {
  
  highp vec2 savedTemp;
  highp float left[MAX_DEGREE+1];
  highp float right[MAX_DEGREE+1];

  //Basis[0] is always 1.0
  basisValues[0] = 1.0;
  // Calculate basis values
  for (int i=1; i<=degree; i++) {
    left[i] = u - knots[degree+1-i];
    right[i] = knots[degree+i] - u;

    savedTemp.x = 0.0;
    for (int j=0; j<i; j++) {
      float rv = right[j+1];
      float lv = left[i-j];
      savedTemp.y = basisValues[j] / (rv + lv);
      basisValues[j] = savedTemp.x + rv * savedTemp.y;
      savedTemp.x = lv * savedTemp.y;
    }
    basisValues[i] = savedTemp.x;

    // Calculate N' if on second to last iteration
    if (i == degree-1 || degree == 1) {
      savedTemp.x = 0.0;
      //Loop through all basis values
      for (int j=0; j<degree; j++) {
        // Calculate a temp variable
        int jr_z = j + 1;
        //Calculate right side
        float kp_0 = knots[jr_z + degree];
        float kp_1 = knots[jr_z];
        savedTemp.y = (float(degree) * basisValues[j]) / (kp_0 - kp_1);
        // Calculate derivative value
        bvD[j] = savedTemp.x - savedTemp.y;
        // Swap right side to left
        savedTemp.x = savedTemp.y;
      }
      //Save the last der-basis
      bvD[degree] = savedTemp.x;
    }
  }
}

#else

// http://read.pudn.com/downloads134/sourcecode/math/569665/nurbsR2006b/findspan.c__.htm
// Note: I have found the 'early outs' in the Three code to be more correct
// https://github.com/mrdoob/three.js/blob/b8d8a8625465bd634aa68e5846354d69f34d2ff5/examples/js/curves/NURBSUtils.js
int findSpan(float u, in int degree, in int numKnots, int kpOff, inout GLSLBinReader r, sampler2D t, bool periodic) {
  
  // early outs
  int n = numKnots - degree - 1;
  if(u >= kp(n, r, t, kpOff))
    return n-1;
  if(u <= kp(degree, r, t, kpOff)) {
    return degree;
  }

  // Linear Search...
#ifdef ENABLE_ES3
  int i = degree; 
  for (; i<n; i++){
#else
  // Note: loop values must be constant.
  // Loops start at 1 because that is the minimum degree for a curve.
  for (int i = 1; i<MAX_KNOTS; i++){
    if(i >= degree && i < numKnots-1){
#endif
    if (u < kp(i+1, r, t, kpOff)){
      return i;
    }
#ifndef ENABLE_ES3
  }
#endif
  }

  return i;
}


void calcBasisValues(in float u, in int span, int degree, int kpOff, int numKnots, inout GLSLBinReader r, sampler2D t, out highp float basisValues[MAX_DEGREE+1], out highp float bvD[MAX_DEGREE+1]) {
  
  highp vec2 savedTemp;
  highp float left[MAX_DEGREE+1];
  highp float right[MAX_DEGREE+1];

  // Basis[0] is always 1.0
  basisValues[0] = 1.0;
  // Calculate basis values
#ifdef ENABLE_ES3
  for (int i=1; i<=degree; i++) {
#else
  for (int i=1; i<MAX_DEGREE; i++) {
    if(i > degree) // i<=degree
      break;
#endif
    left[i] = u - kp(span+1-i, r, t, kpOff);
    right[i] = kp(span+i, r, t, kpOff) - u;

    savedTemp.x = 0.0;
#ifdef ENABLE_ES3
    for (int j=0; j<i; j++) {
#else
    for (int j=0; j<MAX_DEGREE; j++) {
      if(j >= i) // j < i
        break;
#endif
      float rv = right[j+1];
      float lv = left[i-j];
      savedTemp.y = basisValues[j] / (rv + lv);
      basisValues[j] = savedTemp.x + rv * savedTemp.y;
      savedTemp.x = lv * savedTemp.y;
    }
    basisValues[i] = savedTemp.x;
    
    // Calculate N' if on second to last iteration
    if (i == degree-1 || degree == 1) {
      savedTemp.x = 0.0;
      // Loop through all basis values
#ifdef ENABLE_ES3
      for (int j=0; j<degree; j++) {
#else
      for (int j=0; j<MAX_DEGREE; j++) {
        if(j >= degree) // j < degree
          break;
#endif
        // Calculate a temp variable
        int jr_z = span - degree + j + 1;
        // Calculate right side
        float kp_0 = kp(jr_z + degree, r, t, kpOff);
        float kp_1 = kp(jr_z, r, t, kpOff);
        savedTemp.y = (float(degree) * basisValues[j]) / (kp_0 - kp_1);
        // Calculate derivative value
        bvD[j] = savedTemp.x - savedTemp.y;
        // Swap right side to left
        savedTemp.x = savedTemp.y;
      }
      // Save the last der-basis
#ifdef ENABLE_ES3
      bvD[degree] = savedTemp.x;
#else
      if(degree == 1)
        bvD[1] = savedTemp.x;
      else if(degree == 2)
        bvD[2] = savedTemp.x;
      else if(degree == 3)
        bvD[3] = savedTemp.x;
      else if(degree == 4)
        bvD[4] = savedTemp.x;
      else if(degree == 5)
        bvD[5] = savedTemp.x;
      else if(degree == 6)
        bvD[6] = savedTemp.x;
      else if(degree == 7)
        bvD[7] = savedTemp.x;
      else if(degree == 8)
        bvD[8] = savedTemp.x;
      else if(degree == 9)
        bvD[9] = savedTemp.x;
      else if(degree == 10)
        bvD[10] = savedTemp.x;
      else if(degree == 11)
        bvD[11] = savedTemp.x;
      else if(degree == 12)
        bvD[12] = savedTemp.x;
      else if(degree == 13)
        bvD[13] = savedTemp.x;
      else if(degree == 14)
        bvD[14] = savedTemp.x;
      else if(degree == 15)
        bvD[15] = savedTemp.x;
#endif
    }
  }
}


#endif

`
);

zeaEngine.shaderLibrary.setShaderModule(
  'GLSLNURBSCurves.glsl',
  `

struct NURBSCurveData {
  vec2 domain;
  bool periodic;
  int degree;
  int numCPs;
  int numKnots;

  int cpStart;
  int kpStart;
};

void loadNURBSCurve3dData(inout GLSLBinReader reader, sampler2D texture, out NURBSCurveData result) {

  result.domain.x = GLSLBinReader_readFloat(reader, texture);
  result.domain.y = GLSLBinReader_readFloat(reader, texture);
  result.degree = GLSLBinReader_readUInt(reader, texture);

  result.numCPs = GLSLBinReader_readUInt(reader, texture);
  result.numKnots = GLSLBinReader_readUInt(reader, texture);
  int flags = GLSLBinReader_readUInt(reader, texture);
  result.periodic = testFlag(flags, CURVE_FLAG_PERIODIC);

  result.cpStart = 2*4; // 2 RGBA pixels of data before the knot values start.
  result.kpStart = result.cpStart + (result.numCPs*4);
}

vec4 curve_cp3d(int u, inout GLSLBinReader r, NURBSCurveData d, sampler2D t) {
  int index = u * 4;
  return GLSLBinReader_readVec4(r, t, d.cpStart + index);
}

// https://github.com/akshatamohanty/wildcat-cad/blob/650e18d665ccde3dbc4c78029e35c38951581c92/Source/Geometry/Shaders/ns23_default_plM.fsh
// https://github.com/mrdoob/three.js/blob/6c7f000734f8579da37fb39e5c2e9e5e2dfb14f8/examples/js/curves/NURBSUtils.js

/*
  Calculate rational B-Spline curve point. See The NURBS Book, page 134, algorithm A4.3.
*/
PosNorm calcNURBSCurve3dPoint(float param, inout GLSLBinReader r, sampler2D t) {

  NURBSCurveData d;
  loadNURBSCurve3dData(r, t, d);

  float u = d.domain.x + param * ( d.domain.y - d.domain.x ); // linear mapping param->u
  //if(d.periodic)
  //    u = wrap(u, kp(0, r, t, d.kpStart), kp(d.numKnots-1, r, t, d.kpStart));
 
  float bv[MAX_DEGREE+1];
  float bvds[MAX_DEGREE+1];

#ifdef EXPORT_KNOTS_AS_DELTAS
  highp float knots[MAX_DEGREE*2+1];
  int span = findSpan(u, d.degree, d.numKnots, d.kpStart, r, t, knots);
  //return PosNorm(vec3(span, knots[d.degree], knots[d.degree+1]), vec3(1.0), CURVE_TYPE_NURBS_CURVE);
  //return PosNorm(vec3(knots[d.degree-1], knots[d.degree], knots[d.degree+1]), vec3(1.0), CURVE_TYPE_NURBS_CURVE);
  //return PosNorm(vec3(knots[d.degree+1], knots[d.degree+2], knots[d.degree+3]), vec3(1.0), CURVE_TYPE_NURBS_CURVE);

  calcBasisValues(u, d.degree, knots, bv, bvds);
  // return PosNorm(vec3(bv[0], bv[1], bv[2]), vec3(bv[3], bv[4], bv[5]), CURVE_TYPE_NURBS_CURVE);
#else
  int span = findSpan(u, d.degree, d.numKnots, d.kpStart, r, t, d.periodic);
  // return PosNorm(vec3(float(span)), vec3(1.0), CURVE_TYPE_NURBS_CURVE);
  // return PosNorm(vec3(kp(span-1, r, t, d.kpStart), kp(span-0, r, t, d.kpStart), kp(span+1, r, t, d.kpStart)), vec3(0.0), CURVE_TYPE_NURBS_CURVE);

  // Invalid knot vectors exist where all the values are identical.
  if (kp(span, r, t, d.kpStart) == kp(span+1, r, t, d.kpStart)) {
    for(int x=0; x <= d.degree; x++)
      bv[x] = 0.0;
    bv[d.degree] = 1.0;
  }
  else {
    calcBasisValues(u, span, d.degree, d.kpStart, d.numKnots, r, t, bv, bvds);
  }
  // return PosNorm(vec3(bv[0], bv[1], bv[2]), vec3(bv[3], bv[4], bv[5]), CURVE_TYPE_NURBS_CURVE);
#endif


  float w = 0.0;
  vec3 pos = vec3(0.0);
  vec3 tangent = vec3(0.0);

  int cv0 = (span - d.degree);
#ifdef ENABLE_ES3
  for(int x=0; x <= d.degree; x++) {
#else
  for(int x=0; x < MAX_DEGREE; x++) {
    if(x > d.degree) // x<=degree
      break;
#endif
    int index = cv0 + x;
    vec4 pt = curve_cp3d(index, r, d, t);

    if(d.degree < 3) {
      // Rhino style evaluation....
      highp float bvw = bv[x];
      pos += pt.xyz * bvw;
      w += pt.w * bvw;
    }
    else {
      // Tiny NURBS/CADEx style evaluation....
      highp float bvw = pt.w * bv[x];
      pos += pt.xyz * bvw;
      w += bvw;
    }

    tangent += pt.xyz * bvds[x];
  }

  pos /= w;


  // Calc tangent
  if(d.degree == 1){
    vec3 pt0 = curve_cp3d(cv0, r, d, t).xyz;
    vec3 pt1 = curve_cp3d(cv0+1, r, d, t).xyz;
    tangent = pt1 - pt0;
  }
  else {
    if (length(tangent) < 0.05) {

      float spanLerp = u - knots[span];
      float spanRange = knots[span+1] - knots[span];
      int cv = int(floor((spanLerp / spanRange) * float(d.degree-1)));

      vec3 pt0 = curve_cp3d(cv, r, d, t).xyz;
      vec3 pt1 = curve_cp3d(cv+1, r, d, t).xyz;
      tangent = pt1 - pt0;
    }
  }

  return PosNorm(pos, normalize(tangent), CURVE_TYPE_NURBS_CURVE);
}



`
);

zeaEngine.shaderLibrary.setShaderModule(
  'GLSLNURBSSurfaces.glsl',
  `

struct NURBSSurfaceData {
  box2 domain;
  bool periodicU;
  bool periodicV;
  int degreeU;
  int degreeV;
  int numCPsU;
  int numCPsV;
  int numKnotsU;
  int numKnotsV;

  int cpStart;
  int kpUStart;
  int kpVStart;
};

void loadNURBSSurfaceData(inout GLSLBinReader reader, sampler2D texture, out NURBSSurfaceData result) {

  result.domain.p0.x = GLSLBinReader_readFloat(reader, texture);
  result.domain.p0.y = GLSLBinReader_readFloat(reader, texture);
  result.domain.p1.x = GLSLBinReader_readFloat(reader, texture);

  result.domain.p1.y = GLSLBinReader_readFloat(reader, texture);
  result.degreeU = GLSLBinReader_readInt(reader, texture);
  if(result.degreeU > MAX_DEGREE)
    result.degreeU = MAX_DEGREE;
  result.degreeV = GLSLBinReader_readInt(reader, texture);
  if(result.degreeV > MAX_DEGREE)
    result.degreeV = MAX_DEGREE;
  result.numCPsU = GLSLBinReader_readInt(reader, texture);

  result.numCPsV = GLSLBinReader_readInt(reader, texture);
  result.numKnotsU = GLSLBinReader_readInt(reader, texture);
  result.numKnotsV = GLSLBinReader_readInt(reader, texture);
  int flags = GLSLBinReader_readInt(reader, texture);
  result.periodicU = testFlag(flags, SURFACE_FLAG_PERIODIC_U);
  result.periodicV = testFlag(flags, SURFACE_FLAG_PERIODIC_V);

  result.cpStart  = 3*4; // 3 RGBA pixels of data before the knot values start.
  result.kpUStart = result.cpStart + (result.numCPsU*result.numCPsV*4);
  result.kpVStart = result.kpUStart + result.numKnotsU;
}

vec4 surface_cp(int u, int v, inout GLSLBinReader r, NURBSSurfaceData d, sampler2D t) {
  int index = (u + (v * d.numCPsU)) * 4;
  return GLSLBinReader_readVec4(r, t, d.cpStart + index);
}

/*
  Calculate rational B-Spline surface point. See The NURBS Book, page 134, algorithm A4.3.
*/
PosNorm calcNURBSSurfacePoint(vec2 params, inout GLSLBinReader r, sampler2D t) {

  vec3 tmp;
  NURBSSurfaceData d;
  loadNURBSSurfaceData(r, t, d);

  // ///////////////////////////////////////
  // // vec3 cp_pos = vec3(params.x + float(d.degreeU), params.y + float(d.degreeV), 0.0 );
  // vec3 cp_pos = vec3(params.x + float(d.numCPsU), params.y + float(d.numCPsV), 0.0 );
  // return PosNorm(cp_pos, tmp);
  // ///////////////////////////////////////

  // ///////////////////////////////////////
  // int knot_x = int(params.x * float(d.numCPsU-1));
  // int knot_y = int(params.y * float(d.numCPsV-1));
  // vec4 cp_pos = surface_cp(knot_x, knot_y, r, d, t);
  // return PosNorm(cp_pos.xyz, tmp);
  // ///////////////////////////////////////

  vec2 uv = mapDomain(d.domain, params); // linear mapping params -> uv
  float u = uv.x;
  float v = uv.y;

  highp float basisValuesU[MAX_DEGREE+1];
  highp float basisValuesV[MAX_DEGREE+1];
  highp float bvdsU[MAX_DEGREE+1];
  highp float bvdsV[MAX_DEGREE+1];
  
#ifdef EXPORT_KNOTS_AS_DELTAS
  highp float knotsU[MAX_DEGREE*2+1];
  highp float knotsV[MAX_DEGREE*2+1];
  int spanU = findSpan(u, d.degreeU, d.numKnotsU, d.kpUStart, r, t, knotsU);
  int spanV = findSpan(v, d.degreeV, d.numKnotsV, d.kpVStart, r, t, knotsV);
  calcBasisValues(u, d.degreeU, knotsU, basisValuesU, bvdsU);
  calcBasisValues(v, d.degreeV, knotsV, basisValuesV, bvdsV);

#else
  int spanU = findSpan(u, d.degreeU, d.numKnotsU, d.kpUStart, r, t, d.periodicU);
  int spanV = findSpan(v, d.degreeV, d.numKnotsV, d.kpVStart, r, t, d.periodicV);

  calcBasisValues(u, spanU, d.degreeU, d.kpUStart, d.numKnotsU, r, t, basisValuesU, bvdsU);
  calcBasisValues(v, spanV, d.degreeV, d.kpVStart, d.numKnotsV, r, t, basisValuesV, bvdsV);
#endif

  // ///////////////////////////////////////
  // return PosNorm(vec3(knotsV[11], knotsV[12], knotsV[13]), tmp, SURFACE_TYPE_NURBS_SURFACE);
  // return PosNorm(vec3(knotsV[14], knotsV[15], knotsV[16]), tmp, SURFACE_TYPE_NURBS_SURFACE);
  // return PosNorm(vec3(knotsV[17], knotsV[18], knotsV[19]), tmp, SURFACE_TYPE_NURBS_SURFACE);
  // return PosNorm(vec3(basisValuesU[0], basisValuesU[1], basisValuesU[2]), tmp, SURFACE_TYPE_NURBS_SURFACE);
  // ///////////////////////////////////////

  ivec2 indices;
  highp float w = 0.0;
  highp vec3 pos = vec3(0.0);
  highp vec3 tangentU = vec3(0.0);
  highp vec3 tangentV = vec3(0.0);
  int cvU0 = (spanU - d.degreeU);
  int cvV0 = (spanV - d.degreeV);
#ifdef ENABLE_ES3
  for(int y=0; y <= d.degreeV; y++) {
#else
  for(int y=0; y < MAX_DEGREE; y++) {
     if(y > d.degreeV) // y<=degree
         break;
#endif
    indices.y = cvV0 + y;

#ifdef ENABLE_ES3
    for(int x=0; x <= d.degreeU; x++) {
#else
    for(int x=0; x < MAX_DEGREE; x++) {
      if(x > d.degreeU) // x<=degree
        break;
#endif
      indices.x = cvU0 + x;
      
      vec4 cv = surface_cp(indices.x, indices.y, r, d, t);
      vec3 pt = cv.xyz;
      float weight = cv.w;

      float bvU = basisValuesU[x];
      float bvV = basisValuesV[y];

// #define USE_RHNIO_EVALUATION_MATH 1
#ifdef USE_RHNIO_EVALUATION_MATH
      // Rhino style evaluation....
      float bvw = bvU * bvV;
      pos += pt * bvw;
      w += weight * bvw;
#else
      // Tiny NURBS/CADEx style evaluation....
      highp float bvw = weight * bvU * bvV;
      pos += pt * bvw;
      w += bvw;
#endif
        
      float bvdU = bvdsU[x];
      float bvdV = bvdsV[y];

      tangentU += pt * bvdU * bvV;
      tangentV += pt * bvU * bvdV;
    }
  }

  pos /= w;

  ///////////////////////////////////////////////////////
  // Calculate normal.
  float spanRangeU = knotsU[d.degreeU + 1] - knotsU[d.degreeU];
  float spanRangeV = knotsV[d.degreeV + 1] - knotsV[d.degreeV];
  float eqKnotRangeU = ( d.domain.p1.x - d.domain.p0.x ) / float(d.numKnotsU);
  float eqKnotRangeV = ( d.domain.p1.y - d.domain.p0.y ) / float(d.numKnotsV);
  
  
  if (spanRangeU / eqKnotRangeU < 0.01) { 
    // In some cases (COOLANT_INLET_PORT_01.ipt_faceWithBlackEdge.)
    // we have span segment which has close to zero delta, and 
    // so the normals are broken. We want to advace along the 
    // e.g. [0, 0, 0, 0.00001, 1, 3, 3, 3]
    // length of the span rather than when we have a pinched corner, 
    // where we move along the toher direction.
    // console.log(v, 'spanRangeU:', spanRangeU, ' eqKnotRangeU:', eqKnotRangeU, spanRangeU / eqKnotRangeU)

    int cvU = cvU0;
    if (v > d.domain.p1.y - 0.0001) {
      // If at the end then we grab the end of the pevious row.
      cvU = cvU0 + d.degreeU - 2;
    } else {
      // if the broken normal is at the start of the U range, then 
      // we will grab the next in the row. 
      cvU = cvU0 + 1;
    }

    float spanLerpV = (u - knotsV[d.degreeV]) / spanRangeV;
    int cvV = cvV0 + int(floor(spanLerpV * float(d.degreeV)));

    vec3 pt0 = surface_cp(cvU, cvV, r, d, t).xyz;
    vec3 pt1 = surface_cp(cvU+1, cvV, r, d, t).xyz;

    tangentU = pt1 - pt0;
  } else if (length(tangentU) < 0.001) {
    // Note: on values to big, we get false positives.
    // See: 2_SR00404681_1_RI510090.CATPart.zcad
    // long narrow nurbs surface above the tail light.
    // Reduced from 0.05 to 0.001 fixed it.

    // The derivative in the V direction is zero, 
    // so we calculate the linear derivative for the next control points along.
    
    int cvV;
    if (spanV > d.degreeV) {
      // If at the end then we grab the end of the pevious row.
      cvV = cvV0 + d.degreeV - 2;
    } else {
      // if the broken normal is at the start of the V range, then 
      // we will grab the next in the row. 
      cvV = cvV0 + 1;
    }
    
    float spanLerpU = (u - knotsU[d.degreeU]) / spanRangeU;
    int cvU = cvU0 + int(floor(spanLerpU * float(d.degreeU)));
    
    vec3 pt0 = surface_cp(cvU, cvV, r, d, t).xyz;
    vec3 pt1 = surface_cp(cvU+1, cvV, r, d, t).xyz;

    tangentU = pt1 - pt0;
  }

  if (spanRangeV / eqKnotRangeV < 0.01) {
    // In some cases (COOLANT_INLET_PORT_01.ipt_faceWithBlackEdge.)
    // we have span segment which has close to zero delta, and 
    // so the normals are broken. We want to advace along the 
    // e.g. [0, 0, 0, 0.00001, 1, 3, 3, 3]
    // length of the span rather than when we have a pinched corner, 
    // where we move along the toher direction.
    // console.log(v, 'spanRangeV:', spanRangeV, ' eqKnotRangeV:', eqKnotRangeV, spanRangeV / eqKnotRangeV)

    int cvV = cvV0;
    if (v > d.domain.p1.y - 0.0001) {
      // If at the end then we grab the end of the pevious row.
      cvV = cvV0 + d.degreeV - 2;
    } else {
      // if the broken normal is at the start of the V range, then 
      // we will grab the next in the row. 
      cvV = cvV0 + 1;
    }

    float spanLerpU = (u - knotsU[d.degreeU]) / spanRangeU;
    int cvU = cvU0 + int(floor(spanLerpU * float(d.degreeU)));

    vec3 pt0 = surface_cp(cvU, cvV, r, d, t).xyz;
    vec3 pt1 = surface_cp(cvU, cvV+1, r, d, t).xyz;

    tangentV = pt1 - pt0;
    
  } else if (length(tangentV) < 0.001) { 
    // Note: on values to big, we get false positives.
    // See: 2_SR00404681_1_RI510090.CATPart.zcad
    // long narrow nurbs surface above the tail light.
    // Reduced from 0.05 to 0.001 fixed it.

    // The derivative in the V direction is close to zero, 
    // so we calculate the linear derivative for the next control points along.

    int cvU = cvU0;
    if (v > d.domain.p1.y - 0.0001) {
      // If at the end then we grab the end of the pevious row.
      cvU = cvU0 + d.degreeU - 2;
    } else {
      // if the broken normal is at the start of the U range, then
      // we will grab the next in the row.
      cvU = cvU0 + 1;
    }

    float spanLerpV = (u - knotsV[d.degreeV]) / spanRangeV;
    int cvV = cvV0 + int(floor(spanLerpV * float(d.degreeV)));

    vec3 pt0 = surface_cp(cvU, cvV, r, d, t).xyz;
    vec3 pt1 = surface_cp(cvU, cvV+1, r, d, t).xyz;

    tangentV = pt1 - pt0;
  }

  // vec3 normal = tangentV;
  // Note: in the gear_box_final_asm.zcad. the nurbs surfaces were all flipped
  // This is only apparent in cut-away scenes, which the gearbox demo is.
  // vec3 normal = normalize(cross(tangentV, tangentU));
  vec3 normal = normalize(cross(tangentU, tangentV));

  return PosNorm(pos, normal, SURFACE_TYPE_NURBS_SURFACE);
}

`
);

const GLEvaluateCADSurfaceShader_VERTEX_SHADER = zeaEngine.shaderLibrary.parseShader(
  'GLEvaluateCADSurfaceShader.vertexShader',
  `
precision highp float;

attribute vec3 positions;
instancedattribute float surfaceId;

uniform sampler2D surfaceAtlasLayoutTexture;
uniform ivec2 surfaceAtlasLayoutTextureSize;

uniform ivec2 surfacesAtlasTextureSize;

<%include file="GLSLUtils.glsl"/>
<%include file="GLSLBinReader.glsl"/>

/* VS Outputs */
varying float v_surfaceId;      // flat
varying vec3 v_geomDataCoords;  // flat
varying vec2 v_patchSize;       // flat
varying vec2 v_vertexCoord;



void main(void) {

  GLSLBinReader reader;
  GLSLBinReader_init(reader, surfaceAtlasLayoutTextureSize, 32);
  vec4 patchCoords = GLSLBinReader_readVec4(reader, surfaceAtlasLayoutTexture, int(surfaceId)*8);
  vec4 surfaceDataCoords = GLSLBinReader_readVec4(reader, surfaceAtlasLayoutTexture, (int(surfaceId)*8)+4);

  vec2 patchPos = patchCoords.xy;
  v_patchSize = patchCoords.zw;

  v_surfaceId = surfaceId;
  v_geomDataCoords = surfaceDataCoords.xyz;
  v_vertexCoord = (positions.xy + 0.5) * v_patchSize;

  vec2 pos = (patchPos + v_vertexCoord) / vec2(surfacesAtlasTextureSize);
  gl_Position = vec4((pos - 0.5) * 2.0, 0.0, 1.0);
}
`
);

zeaEngine.shaderLibrary.setShaderModule(
  'GLSLCADSurfaceFragmentShader.glsl',
  `

struct PosNorm {
  vec3 pos;
  vec3 normal;
  int geomType;
};

/* VS Outputs */
varying float v_surfaceId;      // flat
varying vec3 v_geomDataCoords;  // flat
varying vec2 v_patchSize;       // flat
varying vec2 v_vertexCoord;

uniform sampler2D surfaceDataTexture;
uniform ivec2 surfaceDataTextureSize;
uniform int writeNormals;

vec2 initReader(inout GLSLBinReader reader) {

  // compute exact xy coords per pixel by rounding the vertex coord to the nearest integer and then dividing my patch size.
  // The interpollated xy coords from the quad are not exact because the quad must cover the pixels with some margin.

  vec2 params = vec2(floor(v_vertexCoord.x), floor(v_vertexCoord.y));
  if(v_patchSize.x > 1.0)
    params.x /= v_patchSize.x - 1.0;
  if(v_patchSize.y > 1.0)
    params.y /= v_patchSize.y - 1.0;

  ivec4 region = ivec4(0, 0, surfaceDataTextureSize.x, surfaceDataTextureSize.y);
  ivec2 start = ivec2(v_geomDataCoords.xy);
  int flags = int(v_geomDataCoords.z);
  if(testFlag(flags, SURFACE_FLAG_FLIPPED_UV))  {
    float tmp = params.x;
    params.x = params.y;
    params.y = tmp;
  }

  GLSLBinReader_init(reader, surfaceDataTextureSize, region, start, 32);

  return params;
}


struct box2 {
  vec2 p0;
  vec2 p1;
};

box2 loadBox2(inout GLSLBinReader reader, sampler2D texture) {
  box2 domain;
  domain.p0.x = GLSLBinReader_readFloat(reader, texture);
  domain.p0.y = GLSLBinReader_readFloat(reader, texture);
  domain.p1.x = GLSLBinReader_readFloat(reader, texture);
  domain.p1.y = GLSLBinReader_readFloat(reader, texture);
  return domain;
}

vec2 mapDomain(box2 domain, vec2 params) {
  return domain.p0 + params * ( domain.p1 - domain.p0 );
}


`
);

/** Class representing a GL evaluate simple CAD surface shader.
 * @extends GLShader
 * @ignore
 */
class GLEvaluateSimpleCADSurfaceShader extends zeaEngine.GLShader {
  /**
   * Create a GL evaluate simple CAD surface shader.
   * @param {any} gl - The gl value.
   */
  constructor(gl) {
    super(gl);

    this.__shaderStages[
      'VERTEX_SHADER'
    ] = GLEvaluateCADSurfaceShader_VERTEX_SHADER;

    this.__shaderStages[
      'FRAGMENT_SHADER'
    ] = zeaEngine.shaderLibrary.parseShader(
      'GLEvaluateSimpleCADSurfaceShader.fragmentShader',
      `
// #extension GL_EXT_draw_buffers : require
precision highp float;

<%include file="GLSLUtils.glsl"/>
<%include file="GLSLBinReader.glsl"/>
<%include file="GLSLCADConstants.glsl"/>
<%include file="GLSLCADSurfaceFragmentShader.glsl"/>

<%include file="GLSLCADSimpleSurfaces.glsl"/>

PosNorm evalCADSurfaces(vec2 params, inout GLSLBinReader reader, sampler2D texture) {
  // Evaluate the surface per vertex
  int geomType = GLSLBinReader_readInt(reader, texture);

  PosNorm posNorm;
  if(geomType == SURFACE_TYPE_PLANE) {
    posNorm = calcPlaneSurfacePoint(params, reader, texture);
  } else if(geomType == SURFACE_TYPE_POLY_PLANE) {
    posNorm = calcPolyPlaneSurfacePoint(params, reader, texture);
  } else if(geomType == SURFACE_TYPE_FAN) {
    posNorm = calcFanSurfacePoint(params, reader, texture);
  } else if(geomType == SURFACE_TYPE_CONE) {
    posNorm = calcConeSurfacePoint(params, reader, texture);
  } else if(geomType == SURFACE_TYPE_CYLINDER) {
    posNorm = calcCylinderSurfacePoint(params, reader, texture);
  } else if(geomType == SURFACE_TYPE_SPHERE) {
    posNorm = calcSphereSurfacePoint(params, reader, texture);
  } else if(geomType == SURFACE_TYPE_TORUS) {
    posNorm = calcTorusSurfacePoint(params, reader, texture);
  }
  return posNorm;
}

#ifdef ENABLE_ES3
out vec4 fragColor;
#endif

void main(void) {

#ifndef ENABLE_ES3
  vec4 fragColor;
#endif
  
  GLSLBinReader reader;
  vec2 xy = initReader(reader);
  PosNorm posNorm = evalCADSurfaces(xy, reader, surfaceDataTexture);

  if(writeNormals == 1) {
    fragColor = vec4(posNorm.normal, float(posNorm.geomType));
  }
  else {
    fragColor = vec4(posNorm.pos, float(posNorm.geomType));
  }
  // gl_FragData[0] = vec4(posNorm.pos, 1.0);
  // gl_FragData[1] = vec4(posNorm.normal, 1.0);

  // fragColor.r = v_geomDataCoords.x;
  // fragColor.g = v_geomDataCoords.y;
  // fragColor.r = floor(v_vertexCoord.x);
  // fragColor.g = floor(v_vertexCoord.y);
  // fragColor.b = v_patchSize.x;
  // fragColor.a = v_patchSize.y;

#ifndef ENABLE_ES3
  gl_FragColor = fragColor;
#endif
}
`
    );

    this.finalize();
  }
}

/** Class representing a GL evaluate compound CAD surface shader.
 * @extends GLShader
 * @ignore
 */
class GLEvaluateCompoundCADSurfaceShader extends zeaEngine.GLShader {
  /**
   * Create a GL evaluate compound CAD surface shader.
   * @param {any} gl - The gl value.
   */
  constructor(gl) {
    super(gl);

    this.__shaderStages[
      'VERTEX_SHADER'
    ] = GLEvaluateCADSurfaceShader_VERTEX_SHADER;

    this.__shaderStages[
      'FRAGMENT_SHADER'
    ] = zeaEngine.shaderLibrary.parseShader(
      'GLEvaluateCompoundCADSurfaceShader.fragmentShader',
      `
// #extension GL_EXT_draw_buffers : require
precision highp float;

<%include file="GLSLCADConstants.glsl"/>
<%include file="GLSLUtils.glsl"/>
<%include file="GLSLBinReader.glsl"/>
<%include file="GLSLCADSurfaceFragmentShader.glsl"/>

<%include file="GLSLMath.glsl"/>

uniform sampler2D curvesAtlasTexture;
uniform ivec2 curvesAtlasTextureSize;
uniform sampler2D curveTangentsTexture;
uniform sampler2D curveAtlasLayoutTexture;
uniform ivec2 curveAtlasLayoutTextureSize;

vec3 getCurveVertex(ivec2 curvePatchCoords, int vertexCoord) {
  return fetchTexel(curvesAtlasTexture, curvesAtlasTextureSize, ivec2(curvePatchCoords.x + vertexCoord, curvePatchCoords.y)).rgb;
}

vec3 getCurveTangent(ivec2 curvePatchCoords, int vertexCoord) {
  return fetchTexel(curveTangentsTexture, curvesAtlasTextureSize, ivec2(curvePatchCoords.x + vertexCoord, curvePatchCoords.y)).rgb;
}

PosNorm evalCADCurve3d(int curveId, float u) {

  GLSLBinReader curveLayoutDataReader;
  GLSLBinReader_init(curveLayoutDataReader, curveAtlasLayoutTextureSize, 32);
  ivec4 curvePatch = ivec4(GLSLBinReader_readVec4(curveLayoutDataReader, curveAtlasLayoutTexture, curveId * 8));

  float t = float(curvePatch.z - 1) * u;
  int vertexId0 = min(int(floor(t + 0.5)), curvePatch.z - 1);
  // int vertexId1 = floor(t) + 1.0;
  // float lerp = t - floor(t);

  vec3 p0 = getCurveVertex(curvePatch.xy, vertexId0);
  // vec3 p1 = getCurveVertex(curvePatch.xy, vertexId1);
  vec3 t0 = getCurveTangent(curvePatch.xy, vertexId0);
  // vec3 t1 = getCurveTangent(curvePatch.xy, vertexId1);

  PosNorm res;
  res.pos = p0;//mix(p0, p1, lerp);
  res.normal = normalize(t0);//mix(t0, t1, lerp));
  res.geomType = 0;

  // res.pos.x = u;
  // res.pos.y = float(curveId);
  // res.pos.x = float(curvePatch.x);
  // res.pos.y = float(curvePatch.y);
  // res.pos.z = float(curvePatch.z);
  return res;
}


<%include file="GLSLCADCompoundSurfaces.glsl"/>

PosNorm evalCADSurfaces(vec2 params, inout GLSLBinReader reader, sampler2D texture) {
  // Evaluate the surface per vertex
  int geomType = GLSLBinReader_readInt(reader, texture);

  PosNorm posNorm;
  if(geomType == SURFACE_TYPE_LINEAR_EXTRUSION) {
    posNorm = calcLinearExtrusionSurfacePoint(params, reader, texture);
  } else if(geomType == SURFACE_TYPE_REVOLUTION) {
    posNorm = calcRevolutionSurfacePoint(params, reader, texture, false);
  } else if(geomType == SURFACE_TYPE_REVOLUTION_FLIPPED_DOMAIN) {
    posNorm = calcRevolutionSurfacePoint(params, reader, texture, true);
  } 
  
  return posNorm;
}

#ifdef ENABLE_ES3
out vec4 fragColor;
#endif

void main(void) {

#ifndef ENABLE_ES3
  vec4 fragColor;
#endif
  
  GLSLBinReader reader;
  vec2 xy = initReader(reader);
  PosNorm posNorm = evalCADSurfaces(xy, reader, surfaceDataTexture);

  if(writeNormals == 1) {
    fragColor = vec4(posNorm.normal, float(posNorm.geomType));
  }
  else {
    fragColor = vec4(posNorm.pos, float(posNorm.geomType));
  }

#ifndef ENABLE_ES3
  gl_FragColor = fragColor;
#endif
}
`
    );

    this.finalize();
  }
}

/** Class representing a GL evaluate NURBS CAD surface shader.
 * @extends GLShader
 * @ignore
 */
class GLEvaluateNURBSCADSurfaceShader extends zeaEngine.GLShader {
  /**
   * Create a GL evaluate NURBS CAD surface shader.
   * @param {any} gl - The gl value.
   */
  constructor(gl) {
    super(gl);

    this.__shaderStages[
      'VERTEX_SHADER'
    ] = GLEvaluateCADSurfaceShader_VERTEX_SHADER;

    this.__shaderStages[
      'FRAGMENT_SHADER'
    ] = zeaEngine.shaderLibrary.parseShader(
      'GLEvaluateNURBSCADSurfaceShader.fragmentShader',
      `
// #extension GL_EXT_draw_buffers : require
precision highp float;

<%include file="GLSLCADConstants.glsl"/>
<%include file="GLSLUtils.glsl"/>
<%include file="GLSLBinReader.glsl"/>
<%include file="GLSLCADSurfaceFragmentShader.glsl"/>

<%include file="GLSLNURBS.glsl"/>
<%include file="GLSLNURBSSurfaces.glsl"/>

PosNorm evalCADSurfaces(vec2 params, inout GLSLBinReader reader, sampler2D texture) {
  // Evaluate the surface per vertex
  int geomType = GLSLBinReader_readInt(reader, texture);

  PosNorm posNorm;
  if(geomType == SURFACE_TYPE_NURBS_SURFACE) {
    posNorm = calcNURBSSurfacePoint(params, reader, texture);
  }
  
  return posNorm;
}

#ifdef ENABLE_ES3
out vec4 fragColor;
#endif

void main(void) {

#ifndef ENABLE_ES3
  vec4 fragColor;
#endif
  
  GLSLBinReader reader;
  vec2 xy = initReader(reader);
  PosNorm posNorm = evalCADSurfaces(xy, reader, surfaceDataTexture);

  if(writeNormals == 1) {
    fragColor = vec4(posNorm.normal, float(posNorm.geomType));
  }
  else {
    fragColor = vec4(posNorm.pos, float(posNorm.geomType));
  }

#ifndef ENABLE_ES3
  gl_FragColor = fragColor;
#endif
}
`
    );

    this.finalize();
  }
}

zeaEngine.shaderLibrary.setShaderModule(
  'GLSLCADConstants.glsl',
  `
  const int SURFACE_FLAG_PERIODIC_U = 1; // 1<<0;
  const int SURFACE_FLAG_PERIODIC_V = 2; // 1<<1;
  const int SURFACE_FLAG_UNUSED2 = 4; // 1<<2;
  const int SURFACE_FLAG_UNUSED3 = 8; // 1<<3;
  const int SURFACE_FLAG_FLIPPED_NORMAL = 16; // 1<<4
  const int SURFACE_FLAG_FLIPPED_UV = 32; // 1<<5
  const int SURFACE_FLAG_COST_IS_DETAIL_U = 64; // 1<<6;
  const int SURFACE_FLAG_COST_IS_DETAIL_V = 128; // 1<<7;

  const int BODY_FLAG_CUTAWAY = 256; // 1<<8
  const int BODY_FLAG_INVISIBLE = 512; // 1<<9

  const int CURVE_FLAG_PERIODIC = 1; // 1<<0;
  const int CURVE_FLAG_UNUSED2 = 4; // 1<<2;
  const int CURVE_FLAG_COST_IS_DETAIL = 8;//1<<3;


  const int SURFACE_TYPE_PLANE = 0;
  const int SURFACE_TYPE_CONE = 1;
  const int SURFACE_TYPE_CYLINDER = 2;
  const int SURFACE_TYPE_SPHERE = 3;
  const int SURFACE_TYPE_TORUS = 4;
  const int SURFACE_TYPE_LINEAR_EXTRUSION = 5;
  const int SURFACE_TYPE_REVOLUTION = 6;
  const int SURFACE_TYPE_BEZIER_SURFACE = 7;
  const int SURFACE_TYPE_NURBS_SURFACE = 8;
  const int SURFACE_TYPE_OFFSET_SURFACE = 9;
  const int SURFACE_TYPE_TRIMMED_RECT_SURFACE = 10;

  const int SURFACE_TYPE_POLY_PLANE = 14;
  const int SURFACE_TYPE_FAN = 15;
  const int SURFACE_TYPE_REVOLUTION_FLIPPED_DOMAIN = 16;


  const int CURVE_TYPE_LINE = 20;
  const int CURVE_TYPE_CIRCLE = 21;
  const int CURVE_TYPE_ELIPSE = 22;
  // const int CURVE_TYPE_HYPERBOLA = 23;
  // const int CURVE_TYPE_PARABOLA = 24;
  // const int CURVE_TYPE_BEZIERCURVE = 25;
  const int CURVE_TYPE_NURBS_CURVE = 26;
  // const int CURVE_TYPE_OFFSET_CURVE = 27;
  // const int CURVE_TYPE_TRIMMED_CURVE = 28;


  const int geomLibraryHeaderSize = 4; // 2 pixels at the start of the GeomLibrary and CurveLibrary


`
);

zeaEngine.shaderLibrary.setShaderModule(
  'GLSLCADSurfaceDrawing.vertexShader.glsl',
  `
uniform sampler2D surfacesAtlasTexture;
uniform ivec2 surfacesAtlasTextureSize;
uniform sampler2D normalsTexture;
uniform sampler2D drawItemsTexture;
uniform ivec2 vert_drawItemsTextureSize;

// The Draw Items texture is laid out with 8 pixels per draw item.
vec4 getDrawItemData(int offset) {
  return fetchTexel(drawItemsTexture, vert_drawItemsTextureSize, ivec2(ftoi(drawCoords.x) + offset, ftoi(drawCoords.y)));
}

mat4 getModelMatrix() {
  // Unpack 3 x 4 matix columns into a 4 x 4 matrix.
  vec4 col0 = getDrawItemData(5);
  vec4 col1 = getDrawItemData(6);
  vec4 col2 = getDrawItemData(7);
  mat4 result = mat4(col0, col1, col2, vec4(0.0, 0.0, 0.0, 1.0));
  return transpose(result);
}

int getSurfaceType(vec2 surfacePatchCoords, vec2 vertexCoord) {
  return int(fetchTexel(surfacesAtlasTexture, surfacesAtlasTextureSize, ivec2(ftoi(surfacePatchCoords.x + vertexCoord.x), ftoi(surfacePatchCoords.y + vertexCoord.y))).a);
}
vec3 getSurfaceVertex(vec2 surfacePatchCoords, vec2 vertexCoord) {
  return fetchTexel(surfacesAtlasTexture, surfacesAtlasTextureSize, ivec2(ftoi(surfacePatchCoords.x + vertexCoord.x), ftoi(surfacePatchCoords.y + vertexCoord.y))).rgb;
}

vec3 getSurfaceNormal(vec2 surfacePatchCoords, vec2 vertexCoord) {
  return fetchTexel(normalsTexture, surfacesAtlasTextureSize, ivec2(ftoi(surfacePatchCoords.x + vertexCoord.x), ftoi(surfacePatchCoords.y + vertexCoord.y))).rgb;
}

`
);

zeaEngine.shaderLibrary.setShaderModule(
  'GLSLCADSurfaceDrawing.fragmentShader.glsl',
  `

uniform sampler2D materialsTexture;
uniform ivec2 materialsTextureSize;
uniform sampler2D drawItemsTexture;
uniform ivec2 frag_drawItemsTextureSize;

// The Draw Items texture is laid out with 8 pixels per draw item.
vec4 getDrawItemData(int offset) {
  return fetchTexel(drawItemsTexture, frag_drawItemsTextureSize, ivec2(ftoi(v_drawCoords.x) + offset, ftoi(v_drawCoords.y)));
}
vec4 getMaterialValue(vec2 materialCoords, int valueIndex) {
  return fetchTexel(materialsTexture, materialsTextureSize, ivec2(ftoi(materialCoords.x) + valueIndex, ftoi(materialCoords.y)));
}

#ifdef ENABLE_CUTAWAYS

<%include file="cutaways.glsl"/>

uniform vec3 cutNormal;
uniform vec4 cutColor;
uniform float planeDist;

bool applyCutaway(int flags) {
  bool cut = testFlag(flags, BODY_FLAG_CUTAWAY);
  if(cut){
    if(cutaway(v_worldPos, cutNormal, planeDist)) {
      return true;
    }
  }
  return false;
}

int applyCutaway(int flags, bool backFacing, vec3 cutColor, inout vec4 fragColor) {
  bool cut = testFlag(flags, BODY_FLAG_CUTAWAY);
  if(cut){
    if(cutaway(v_worldPos, cutNormal, planeDist)) {
      return 1;
    }
    if(backFacing){
      fragColor = vec4(cutColor, 1.0);
      return 2;
    }
  }
  return 0;
}
#endif


#ifdef ENABLE_TRIMMING

uniform sampler2D trimSetAtlasTexture;
uniform ivec2 trimSetAtlasTextureSize;

bool applyTrim(inout vec3 trimPatchCoords, int flags) {

  vec4 trimPatchQuad = getDrawItemData(3);
  if(trimPatchQuad.z > 0.0 && trimPatchQuad.w > 0.0){
    // Remove cobwebs along borders.
    // Tis appears to eliminate cobwebs along borders of trim sets. 
    // It does indicate that a math eror exists somewhere else
    // that we would get cobwebs here.
    // To repro, load Dead Eye Bearing and zoom out.
    if (v_textureCoord.x < 0.0 || v_textureCoord.x >= 1.0 || v_textureCoord.y < 0.0 || v_textureCoord.y >= 1.0)
      return true;

    trimPatchCoords.xy = trimPatchQuad.xy + (trimPatchQuad.zw * v_textureCoord);

    vec2 trimUv = (trimPatchCoords.xy) / vec2(trimSetAtlasTextureSize);
    vec4 trimTexel = texture2D(trimSetAtlasTexture, trimUv);

    // Encode the actual gradient value into the texture. 
    // vec2 gradient = vec2(
    //   (trimTexel.g - 0.5) * 2.0, 
    //   (trimTexel.b - 0.5) * -2.0
    // );
    // vec2 texelOffset = trimPatchCoords.xy - (floor(trimPatchCoords.xy) + 0.5);
    // trimPatchCoords.z = trimTexel.r + ((gradient.x * texelOffset.x) + (gradient.y * texelOffset.y));

    trimPatchCoords.z = trimTexel.r;
    if(trimPatchCoords.z < 0.5){
      return true;
    }
    return false;
  }
  else {
    // This is a non-trimmed surface, so return false.
    trimPatchCoords = vec3(-1.0);
    return false;
  }
}
#endif



// #ifdef ENABLE_CAD_LIGHTMAPS
// uniform sampler2D lightmapAtlasTexturePrev;
// uniform sampler2D lightmapAtlasTexture;
// uniform ivec2 lightmapAtlasTextureSize;
// uniform float lightmapLerp;
// uniform float lightmapWeight;


// vec4 sampleLightmap(sampler2D lightmapAtlasTexture, vec2 uv){
//   // Note: we have a 1 pixel boundary around each quad in the lightmap. This is so that blinear filtering 
//   // does not cause bleeding of lightmap data across quads. Here we offset the uvs into that quad by one pixel. 
//   return texture2D(lightmapAtlasTexture, uv / vec2(lightmapAtlasTextureSize));
// }

// vec4 sampleLightmaps(vec4 lightmapPatchCoords){
//   vec2 uv = lightmapPatchCoords.xy + vec2(1.0) + ((lightmapPatchCoords.zw - vec2(2.0)) * v_textureCoord);
//   vec4 curr = sampleLightmap(lightmapAtlasTexture, uv);
//   vec4 prev = sampleLightmap(lightmapAtlasTexturePrev, uv);
//   return mix(prev, curr, lightmapLerp);
// }


// vec3 sampleLightmaps(){
//   vec4 lightmapPatchCoords = getDrawItemData(4);
//   vec3 lightmapValue = vec3(1.0);
//   vec4 lightmapSample = sampleLightmaps(lightmapPatchCoords);
//   // vec4 lightmapSample = sampleLightmap(lightmapAtlasTexture, lightmapPatchCoords);
//   if(lightmapSample.a > 0.0)
//     lightmapValue = lightmapSample.rgb / lightmapSample.a;
//   else
//     lightmapValue = vec3(0.0, 0.0, 0.0);
//   return lightmapValue;

//   // return sampleLightmap(lightmapAtlasTexture, lightmapPatchCoords).rgb;
// }

// #endif

`
);

const GLDrawCADSurfaceNormalsShader_VERTEX_SHADER = zeaEngine.shaderLibrary.parseShader(
  'GLDrawCADSurfaceNormalsShader.vertexShader',
  `
precision highp float;

attribute vec3 positions;
instancedattribute vec2 drawCoords;  // (DrawItemData Coords (x, y) 

uniform mat4 viewMatrix;
uniform mat4 projectionMatrix;
uniform vec2 quadDetail;
// uniform int lod;

<%include file="GLSLUtils.glsl"/>
<%include file="GLSLCADConstants.glsl"/>
<%include file="stack-gl/transpose.glsl"/>
<%include file="stack-gl/inverse.glsl"/>


uniform float normalLength;
uniform vec3 assetCentroid;

<%include file="GLSLCADSurfaceDrawing.vertexShader.glsl"/>

varying vec2 v_drawCoords;
varying vec2 v_textureCoord;

void main(void) {
    v_drawCoords = drawCoords;
    vec2 texCoords = positions.xy + 0.5;
    mat4 modelMatrix = getModelMatrix();
    vec4 surfaceCoords = getDrawItemData(2);

    vec4 metadata = getDrawItemData(0);
    int flags = int(floor(metadata.a + 0.5));

    //////////////////////////////////////////////
    // Visiblity
    if(testFlag(flags, BODY_FLAG_INVISIBLE)) {
        gl_Position = vec4(-3.0, -3.0, -3.0, 1.0);;
        return;
    }

    //////////////////////////////////////////////
    // Transforms
    mat4 modelViewMatrix = viewMatrix * modelMatrix;
    mat4 viewProjectionMatrix = projectionMatrix * viewMatrix;
    
    // Note: on mobile GPUs, we get only FP16 math in the
    // fragment shader, causing inaccuracies in modelMatrix
    // calculation. By offsetting the data to the origin
    // we calculate a modelMatrix in the asset space, and
    //  then add it back on during final drawing.
    modelMatrix[3][0] += assetCentroid.x;
    modelMatrix[3][1] += assetCentroid.y;
    modelMatrix[3][2] += assetCentroid.z;

    // if(matValue0.a < 0.001)
    //     gl_Position = vec4(-3.0, -3.0, -3.0, 1.0);

    //////////////////////////////////////////////
    // Vertex Attributes

    v_textureCoord = texCoords;
    if(testFlag(flags, SURFACE_FLAG_FLIPPED_UV))
        v_textureCoord = vec2(v_textureCoord.y, v_textureCoord.x);

    // v_textureCoord.y = 1.0 - v_textureCoord.y; // Flip y
    
    vec2 vertexCoords = texCoords * quadDetail;

    vec3 normal = getSurfaceNormal(surfaceCoords.xy, vertexCoords);
    vec4 pos = vec4(getSurfaceVertex(surfaceCoords.xy, vertexCoords), 1.0);

    bool flippedNormal = testFlag(flags, SURFACE_FLAG_FLIPPED_NORMAL);
    if(flippedNormal){
        normal = -normal;
    }
    bool isFan = int(quadDetail.y) == 0;

    vec4 worldPos = modelMatrix * pos;
    vec3 worldNormal = normalize(mat3(modelMatrix) * normal);

    worldPos += vec4(worldNormal * positions.z * normalLength, 0.0);
    
    gl_Position = viewProjectionMatrix * worldPos;

    mat3 normalMatrix = mat3(transpose(inverse(modelViewMatrix)));
}`
);

const FRAGMENT_SHADER = zeaEngine.shaderLibrary.parseShader(
  'GLDrawCADSurfaceNormalsShader.fragmentShader',
  `
precision highp float;

<%include file="GLSLCADConstants.glsl"/>
<%include file="GLSLUtils.glsl"/>
<%include file="stack-gl/gamma.glsl"/>
<%include file="materialparams.glsl"/>

uniform color BaseColor;

uniform mat4 cameraMatrix;

varying vec2 v_drawCoords;
varying vec2 v_textureCoord;

<%include file="GLSLCADSurfaceDrawing.fragmentShader.glsl"/>

vec4 getDebugMaterialColor(int id){
    int sel = int(round(mod(float(id), 12.0)));
    if(sel==0)
        return vec4(1.0, 1.0, 1.0, 1.0);
    else if (sel==1)
        return vec4(0.0, 1.0, 0.0, 1.0);
    else if (sel==2)
        return vec4(0.0, 0.0, 1.0, 1.0);
    else if (sel==3)
        return vec4(0.75, 0.75, 0.0, 1.0);
    else if (sel==4)
        return vec4(0.0, 0.75, 0.75, 1.0);
    else if (sel==5)
        return vec4(0.75, 0.0, 0.75, 1.0);
    else if (sel==6)
        return vec4(0.45, 0.95, 0.0, 1.0);
    else if (sel==7)
        return vec4(0.0, 0.45, 0.95, 1.0);
    else if (sel==8)
        return vec4(0.95, 0.0, 0.45, 1.0);
    else if (sel==9)
        return vec4(0.95, 0.45, 0.0, 1.0);
    else if (sel==10)
        return vec4(0.0, 0.95, 0.45, 1.0);
    else if (sel==11)
        return vec4(0.45, 0.0, 0.95, 1.0);
}


#ifdef ENABLE_ES3
out vec4 fragColor;
#endif

void main(void) {

#ifndef ENABLE_ES3
    vec4 fragColor;
#endif

    vec4 metadata = getDrawItemData(0);
    int flags = int(floor(metadata.a + 0.5));

    //////////////////////////////////////////////
    // Cutaways
#ifdef ENABLE_CUTAWAYS
#ifndef ENABLE_ES3
    if(applyCutaway(flags, cutColor, gl_FragColor)) {
#else
    if(applyCutaway(flags, cutColor, fragColor)) {
#endif
        discard;
        return;
    }
#endif

    //////////////////////////////////////////////
    // Trimming

#ifdef ENABLE_TRIMMING
    vec3 trimPatchCoords;
    if(applyTrim(trimPatchCoords, flags))
        return;
#endif

    vec4 baseColor      = vec4(1.0,0.0,0.0,1.0);

//#ifdef ENABLE_INLINE_GAMMACORRECTION
    fragColor.rgb = toGamma(baseColor.rgb);
//#endif

}
`
);

/** Class representing a GL draw CAD surface normals shader.
 * @extends GLShader
 * @ignore
 */
class GLDrawCADSurfaceNormalsShader extends zeaEngine.GLShader {
  /**
   * Create a GL draw CAD surface normals shader.
   * @param {any} gl - The gl value.
   */
  constructor(gl) {
    super(gl);

    this.__shaderStages[
      'VERTEX_SHADER'
    ] = GLDrawCADSurfaceNormalsShader_VERTEX_SHADER;
    this.__shaderStages['FRAGMENT_SHADER'] = FRAGMENT_SHADER;

    this.nonSelectable = true;
    this.finalize();
  }

  /**
   * The getParamDeclarations method.
   * @return {any} - The return value.
   */
  static getParamDeclarations() {
    const paramDescs = super.getParamDeclarations();
    paramDescs.push({
      name: 'BaseColor',
      defaultValue: new Color(1.0, 1.0, 0.5),
    });
    return paramDescs
  }
}

zeaEngine.sgFactory.registerClass(
  'GLDrawCADSurfaceNormalsShader',
  GLDrawCADSurfaceNormalsShader
);

/** Class representing a GL draw trim curve fans shader.
 * @extends GLShader
 * @ignore
 */
class GLDrawTrimCurveFansShader extends zeaEngine.GLShader {
  /**
   * Create a GL draw trim curve fans shader.
   * @param {any} gl - The gl value.
   */
  constructor(gl) {
    super(gl);

    this.__shaderStages['VERTEX_SHADER'] = zeaEngine.shaderLibrary.parseShader(
      'GLDrawTrimCurveFansShader.vertexShader',
      `
precision highp float;

attribute float vertexIds;
instancedattribute vec4 patchCoords;         // instanced attribute..
instancedattribute vec4 data0;     // instanced attribute..
instancedattribute vec4 data1;     // instanced attribute..
instancedattribute vec2 data2;     // instanced attribute..

<%include file="GLSLUtils.glsl"/>
<%include file="GLSLMath.glsl"/>

uniform sampler2D curvesAtlasTexture;
uniform ivec2 curvesAtlasTextureSize;

uniform ivec2 trimSetAtlasTextureSize;

uniform int numCurveVertices;

struct CurveRef {
  int curveId;
  vec2 tr;
  mat2 mat;
  int flags;

  ivec2 addr;
  int numCurveVertices;

};

vec2 getCurveVertex(in CurveRef curveRef, int vertexId) {
    if(curveRef.flags != 0)
      vertexId = curveRef.numCurveVertices - vertexId - 1;
    return curveRef.tr + curveRef.mat * fetchTexel(curvesAtlasTexture, curvesAtlasTextureSize, ivec2(curveRef.addr.x + vertexId, curveRef.addr.y)).rg;
}


uniform sampler2D curvesAtlasLayoutTexture;
uniform ivec2 curvesAtlasLayoutTextureSize;

uniform sampler2D trimSetTexture;
uniform ivec2 trimSetTextureSize;


<%include file="GLSLBinReader.glsl"/>

CurveRef getCurveRef(inout GLSLBinReader trimsetDataReader, in int curveRefStart, inout GLSLBinReader curvesAtlasLayoutDataReader) {

  CurveRef curveRef;

  // Get the Curve Id from the trimSet Atlas
  curveRef.curveId = GLSLBinReader_readInt(trimsetDataReader, trimSetTexture, curveRefStart + 0);

  // Get the Xfo for the curve
  curveRef.tr = vec2(
    GLSLBinReader_readFloat(trimsetDataReader, trimSetTexture, curveRefStart + 1), 
    GLSLBinReader_readFloat(trimsetDataReader, trimSetTexture, curveRefStart + 2)
    );
  curveRef.mat = mat2(
    vec2(
      GLSLBinReader_readFloat(trimsetDataReader, trimSetTexture, curveRefStart + 3), 
      GLSLBinReader_readFloat(trimsetDataReader, trimSetTexture, curveRefStart + 4)
    ),
    vec2(
      GLSLBinReader_readFloat(trimsetDataReader, trimSetTexture, curveRefStart + 5), 
      GLSLBinReader_readFloat(trimsetDataReader, trimSetTexture, curveRefStart + 6)
    ));

  // Get the flags for the curve
  curveRef.flags = GLSLBinReader_readInt(trimsetDataReader, trimSetTexture, curveRefStart + 7);


  curveRef.addr = ivec2(
    GLSLBinReader_readInt(curvesAtlasLayoutDataReader, curvesAtlasLayoutTexture, (curveRef.curveId * 8) + 0), 
    GLSLBinReader_readInt(curvesAtlasLayoutDataReader, curvesAtlasLayoutTexture, (curveRef.curveId * 8) + 1)
    );
  curveRef.numCurveVertices = GLSLBinReader_readInt(curvesAtlasLayoutDataReader, curvesAtlasLayoutTexture, (curveRef.curveId * 8) + 2);

  return curveRef;
}



void main(void) {

  vec2 pos;
  int vertexId = ftoi(vertexIds);
  if(vertexId == 0) {
    pos = (patchCoords.xy + patchCoords.zw * 0.5) / vec2(trimSetAtlasTextureSize);
  }
  else {
    vertexId--;

    CurveRef curveRef;
    curveRef.tr = data0.xy;
    curveRef.mat = mat2(data0.zw, data1.xy);
    curveRef.flags = ftoi(data2.x);

    curveRef.addr = ivec2(ftoi(data1.z), ftoi(data1.w));
    curveRef.numCurveVertices = numCurveVertices;

    //////////////////////////////////////////////
    pos = getCurveVertex(curveRef, vertexId);

    /*
    //////////////////////////////////////////////
    
    int loopStartPos = ftoi(data0.x);
    int curveIndexWithLoop = ftoi(data0.y);

    GLSLBinReader trimsetDataReader;
    GLSLBinReader_init(trimsetDataReader, trimSetTextureSize, 16);
    int numCurves = GLSLBinReader_readInt(trimsetDataReader, trimSetTexture, loopStartPos);

    GLSLBinReader curvesAtlasLayoutDataReader;
    GLSLBinReader_init(curvesAtlasLayoutDataReader, curvesAtlasLayoutTextureSize, 32);

    CurveRef curveRef = getCurveRef(trimsetDataReader, loopStartPos + 1 + (curveIndexWithLoop * 8), curvesAtlasLayoutDataReader);
    pos = getCurveVertex( curveRef, vertexId );


    // Tranform the curve points by the xfo2d to put it into the coords of the trim set.
    Xfo2d xfo2d = Xfo2d(data0.xy, data1.x, data0.zw);
    pos = Xfo2D_transformVec2(xfo2d, pos);


    //////////////////////////////////
    // Due to the reduced precision we use to store our data
    // we get cracks in the trim textures. To fix this we weld
    // the end points of the trim curves here.
    // For each end point of a curve, we find the joining end point 
    // and average their positions.

    if(vertexId == 0) {
      // Lookup the vertex of the previous curve.
      int prevCurveIndexWithinLoop = curveIndexWithLoop - 1;
      if(prevCurveIndexWithinLoop < 0)
        prevCurveIndexWithinLoop += numCurves;
      CurveRef prevCurveRef = getCurveRef(trimsetDataReader, loopStartPos + 1 + (prevCurveIndexWithinLoop * 8), curvesAtlasLayoutDataReader);

      // Get the end of the previous curve.
      vec2 prevCurveEndPos = getCurveVertex( prevCurveRef, prevCurveRef.numCurveVertices-1 );

      pos = (pos + prevCurveEndPos) * 0.5;
    }
    else if(vertexId == numCurveVertices-1) {
      // Lookup the vertex of the next curve.
      int nextCurveIndexWithinLoop = curveIndexWithLoop + 1;
      if(nextCurveIndexWithinLoop >= numCurves)
        nextCurveIndexWithinLoop = 0;
      CurveRef nextCurveRef = getCurveRef(trimsetDataReader, loopStartPos + 1 + (nextCurveIndexWithinLoop * 8), curvesAtlasLayoutDataReader);

      // Get the start of the next curve.
      vec2 nextCurveEndPos = getCurveVertex( nextCurveRef, 0 );
      pos = (pos + nextCurveEndPos) * 0.5;
    }

    */
    //////////////////////////////////////////////


    // Now transform the trim set into the coords of the full texture.
    pos = (patchCoords.xy + (pos * patchCoords.zw));
    pos /= vec2(trimSetAtlasTextureSize);
  }

  // transform the position into clip space.
  gl_Position = vec4(vec2(-1.0, -1.0) + (pos * 2.0), 0.0, 1.0);
}
`
    );

    this.__shaderStages[
      'FRAGMENT_SHADER'
    ] = zeaEngine.shaderLibrary.parseShader(
      'GLDrawTrimCurveFansShader.fragmentShader',
      `
precision highp float;

#ifdef ENABLE_ES3
out vec4 fragColor;
#endif

void main(void) {

#ifndef ENABLE_ES3
    vec4 fragColor;
#endif

    fragColor = vec4(1.0/255.0,0.0,0.0,1.0);
    
#ifndef ENABLE_ES3
    gl_FragColor = fragColor;
#endif
}
`
    );

    this.finalize();
  }
}

zeaEngine.sgFactory.registerClass(
  'GLDrawTrimCurveFansShader',
  GLDrawTrimCurveFansShader
);

/** Class representing a GL flatten trim sets shader.
 * @extends GLShader
 * @ignore
 */
class GLFlattenTrimSetsShader extends zeaEngine.GLShader {
  /**
   * Create a GL flatten trim sets shader.
   * @param {any} gl - The gl value.
   */
  constructor(gl) {
    super(gl);

    this.__shaderStages['VERTEX_SHADER'] = zeaEngine.shaderLibrary.parseShader(
      'GLFlattenTrimSetsShader.vertexShader',
      `
precision highp float;

attribute vec4 positions;

/* VS Outputs */
varying vec2 v_texCoord;
 
void main()
{
    v_texCoord = (positions.xy + 0.5);
    gl_Position =  vec4(positions.xy * 2.0, 0.0, 1.0);
}
`
    );

    this.__shaderStages[
      'FRAGMENT_SHADER'
    ] = zeaEngine.shaderLibrary.parseShader(
      'GLFlattenTrimSetsShader.fragmentShader',
      `
precision highp float;

uniform sampler2D trimSetAtlasTexture;
uniform ivec2 trimSetAtlasTextureSize;


/* VS Outputs */
varying vec2 v_texCoord;

// returns true if the texel will be kept
// When the fans are rendered, the pixels are acumulated. 
// An even number means that the pixel should be discarded
// and an odd number mean the pixel should be kept.
bool sampleAtlas(vec2 offset){
    return mod(texture2D(trimSetAtlasTexture, v_texCoord + (offset / vec2(trimSetAtlasTextureSize))).r * 255.0, 2.0) > 0.5;
}

int scoreAtlas(vec2 offset){
  if(sampleAtlas(offset))
    return 1;
  else
    return 0;
}

#ifdef ENABLE_ES3
out vec4 fragColor;
#endif

void main(void) {

#ifndef ENABLE_ES3
    vec4 fragColor;
#endif

  // if(sampleAtlas(vec2(0.0, 0.0))){
  //   fragColor = vec4(1.0, 0.5, 0.5, 1.0);
  // }
  // else{
  //   fragColor = vec4(0.0, 0.5, 0.5, 1.0);
  // }
  
  // Smoothing. Look at neighboring pixels to see
  // if we should fill in the gaps. Due to floating
  // point issues, we see random pixels floating
  // in the air that shold have been trimmed by the
  // fan. If a point 
  int score = scoreAtlas(vec2(-1.0, 0.0)) + 
              scoreAtlas(vec2(-1.0,-1.0)) + 
              scoreAtlas(vec2( 0.0,-1.0)) + 
              scoreAtlas(vec2( 1.0,-1.0)) + 
              scoreAtlas(vec2( 1.0, 0.0)) + 
              scoreAtlas(vec2( 1.0, 1.0)) + 
              scoreAtlas(vec2( 0.0, 1.0)) + 
              scoreAtlas(vec2(-1.0, 1.0));

  float r = 0.0;
  if(sampleAtlas(vec2(0.0, 0.0))){
    if(score >= 4) // corner verts have a score of 3
      r = 1.0;
    else
      r = 0.0;
  }
  else{
    if(score < 4) 
      r = 0.0;
    else
      r = 1.0;
  }
  fragColor = vec4(r, 0.5, 0.5, 1.0);
  
#ifndef ENABLE_ES3
    gl_FragColor = fragColor;
#endif
}
`
    );

    this.finalize();
  }
}

zeaEngine.sgFactory.registerClass(
  'GLFlattenTrimSetsShader',
  GLFlattenTrimSetsShader
);

/** Class representing a GL draw trim curve strips shader.
 * @extends GLShader
 * @ignore
 */
class GLDrawTrimCurveStripsShader extends zeaEngine.GLShader {
  /**
   * Create a GL draw trim curve strips shader.
   * @param {any} gl - The gl value.
   */
  constructor(gl) {
    super(gl);

    this.__shaderStages['VERTEX_SHADER'] = zeaEngine.shaderLibrary.parseShader(
      'GLDrawTrimCurveStripsShader.vertexShader',
      `
precision highp float;

attribute vec4 positions;
instancedattribute vec4 patchCoords;         // instanced attribute..
instancedattribute vec4 data0;     // instanced attribute..
instancedattribute vec4 data1;     // instanced attribute..
instancedattribute vec2 data2;     // instanced attribute..

<%include file="GLSLUtils.glsl"/>
<%include file="GLSLMath.glsl"/>

uniform sampler2D curvesAtlasTexture;
uniform ivec2 trimSetAtlasTextureSize;

uniform int numCurveVertices;
uniform float stripWidth;

vec2 getCurveVertex(int vertexId, int flags) {
  if(flags != 0)
    vertexId = numCurveVertices - vertexId - 1;
  return fetchTexel(curvesAtlasTexture, trimSetAtlasTextureSize, ivec2(int(data1.z) + vertexId, int(data1.w))).rg;
}

#define M_PI 3.1415926535897932384626433832795

/* VS Outputs */
varying vec3 v_gradient;

void main(void) {

  int vertexId = int(positions.x);
  float side = positions.y < 0.0 ? -1.0 : 1.0;
  mat2 rot = mat2(data0.zw, data1.xy);
  int curveRefFlags = int(data2.x + 0.5);

  // Tranform the curve points by the mat2 to put it into the coords of the trim set.
  vec2 pos = data0.xy + (rot * getCurveVertex(vertexId, curveRefFlags));

  //////////////////////////////////////////////
  vec2 curveTangent;
  if(vertexId > 0) {
    vec2 posPrev = data0.xy + (rot * getCurveVertex(vertexId-1, curveRefFlags));
    curveTangent += pos - posPrev;
  }
  if(vertexId < numCurveVertices-1) {
    vec2 posNext = data0.xy + (rot * getCurveVertex(vertexId+1, curveRefFlags));
    curveTangent += posNext - pos;
  }
  curveTangent = normalize(curveTangent);
  vec2 curveNormal = vec2(-curveTangent.y, curveTangent.x);

  // Fatten the strip
  pos += (curveNormal * side * stripWidth) / patchCoords.zw;

  //////////////////////////////////////////////

  // Now transform the trim set into the coords of the full texture.
  pos = (patchCoords.xy + (pos * patchCoords.zw));
  pos /= vec2(trimSetAtlasTextureSize);

  // transform the position into clip space.
  gl_Position = vec4((pos * 2.0) - 1.0, 0.0, 1.0);
  

  // The gradient should run 0.0 ... 1.0 from one side of the strip to the other.
  // The side value ranges from -1.0 to +1.0

  v_gradient.z = (side + 1.0) / 2.0;
  // v_gradient = 1.0;

  // Note: this causes the trim edge to move slightly to grow.
  // This fills in slight gaps betwen trimmed surfaces.
  // This causes lots of atrifacts on some thin surfaces
  // On Mordacious, this causese many artifacts at the border of surfaces.
  // v_gradient = (v_gradient * 1.1) + 0.05;
  // v_gradient = (v_gradient * 1.2) + 0.1;
  // v_gradient = (v_gradient * 1.5) + 0.25;
  // v_gradient = (v_gradient * 2.0) + 0.5;
  // v_gradient = (v_gradient * 2.0) + 1.0;

  //////////////////////////////////////////////////
  // Encode the actual gradient value into the texture. 
  // float phi = acos(dot(curveNormal, vec2(1.0, 0.0))); 
  // v_gradient.x = 1.0 * cos(phi);
  // v_gradient.y = 1.0 * sin(phi);

}
`
    );

    this.__shaderStages[
      'FRAGMENT_SHADER'
    ] = zeaEngine.shaderLibrary.parseShader(
      'GLDrawTrimCurveStripsShader.fragmentShader',
      `
precision highp float;

/* VS Outputs */
varying vec3 v_gradient;

#ifdef ENABLE_ES3
out vec4 fragColor;
#endif

void main(void) {

#ifndef ENABLE_ES3
  vec4 fragColor;
#endif
  fragColor.r = v_gradient.z;
  fragColor.g = (v_gradient.x * 0.5) + 0.5;
  fragColor.b = (v_gradient.y * 0.5) + 0.5;
  fragColor.a = 1.0;
    
#ifndef ENABLE_ES3
  gl_FragColor = fragColor;
#endif
}
`
    );

    this.finalize();
  }
}

zeaEngine.sgFactory.registerClass(
  'GLDrawTrimCurveStripsShader',
  GLDrawTrimCurveStripsShader
);

/** Class representing a GL debug trim sets shader.
 * @extends GLShader
 * @ignore
 */
class GLDebugTrimSetsShader extends zeaEngine.GLShader {
  /**
   * Create a GL debug trim sets shader.
   * @param {any} gl - The gl value.
   */
  constructor(gl) {
    super(gl);

    this.__shaderStages['VERTEX_SHADER'] = zeaEngine.shaderLibrary.parseShader(
      'GLDebugTrimSetsShader.vertexShader',
      `
precision highp float;

attribute vec4 positions;

/* VS Outputs */
varying vec2 v_texCoord;
 
void main()
{
    v_texCoord = (positions.xy + 0.5);
    gl_Position =  vec4(positions.xy * 2.0, 0.0, 1.0);
    // gl_Position =  vec4(positions.xy + vec2(-0.5, 0.5), 0.0, 1.0);
}
`
    );

    this.__shaderStages[
      'FRAGMENT_SHADER'
    ] = zeaEngine.shaderLibrary.parseShader(
      'GLDebugTrimSetsShader.fragmentShader',
      `
precision highp float;

uniform sampler2D trimSetAtlasTexture;

/* VS Outputs */
varying vec2 v_texCoord;
 
#ifdef ENABLE_ES3
out vec4 fragColor;
#endif

void main(void) {

#ifndef ENABLE_ES3
  vec4 fragColor;
#endif

  vec4 col = texture2D(trimSetAtlasTexture, v_texCoord);
  vec3 rgb = col.rgb / col.a;
  fragColor = vec4(rgb,1.0);
  
#ifndef ENABLE_ES3
  gl_FragColor = fragColor;
#endif
}
`
    );

    this.finalize();
  }
}

zeaEngine.sgFactory.registerClass(
  'GLDebugTrimSetsShader',
  GLDebugTrimSetsShader
);

/** Class representing a GL CAD shader.
 * @extends GLShader
 * @ignore
 */
class GLCADShader extends zeaEngine.GLShader {
  /**
   * Create a GL CAD shader.
   * @param {any} gl - The gl value.
   */
  constructor(gl) {
    super(gl);
    this.stack = [{}];
  }

  /**
   * The setPreprocessorValue method.
   * @param {any} name - The name param.
   */
  setPreprocessorValue(name) {
    this.getState()[name] = name;
  }

  /**
   * The clearPreprocessorValue method.
   * @param {any} name - The name param.
   */
  clearPreprocessorValue(name) {
    delete this.getState()[name];
  }

  /**
   * The getState method.
   * @return {any} - The return value.
   */
  getState() {
    return this.stack[this.stack.length - 1]
  }

  /**
   * The pushState method.
   */
  pushState() {
    this.stack.push(Object.assign({}, this.getState()));
  }

  /**
   * The popState method.
   */
  popState() {
    this.stack.pop();
    this.applyOptions();
  }

  /**
   * The applyOptions method.
   */
  applyOptions() {
    const directives = [];
    const state = this.getState();
    for (const key in state) {
      directives.push(state[key]);
    }
    const defines = this.__gl.shaderopts.defines + directives.join('\n') + '\n';
    this.__key = defines;
    this.compileForTarget(this.__key, {
      defines,
    });
  }

  /**
   * The bind method.
   * @param {any} renderstate - The renderstate param.
   * @return {any} - The return value.
   */
  bind(renderstate) {
    return super.bind(renderstate, this.__key)
  }
}

const vertexShaderGLSL = `
precision highp float;

attribute vec3 positions;

attribute vec4 bodyDataCoords;      // where the data will come from in the source texture + material coords
attribute vec4 bodyItem_metadata;   // where the values will be written to in the target texture.
attribute vec3 bodyItem_tr;      // the tr + single sc value of the Body global xfo
attribute vec4 bodyItem_ori;        // the ori value of the Body global xfo
attribute vec3 bodyItem_sc;        // the ori value of the Body global xfo

attribute vec4 patchCoords;         // where the values will be written to in the target texture.
attribute vec4 bodyColor;         // where the values will be written to in the target texture.
attribute vec4 cutPlane;         // where the values will be written to in the target texture.

uniform ivec2 vert_drawItemsTextureSize;

/* VS Outputs */
varying vec2 v_patchSize;
varying vec2 v_vertexCoord;

varying vec4 v_bodyDataCoords;
varying vec4 v_bodyItem_metadata;
varying vec3 v_bodyItem_tr;
varying vec4 v_bodyItem_ori;
varying vec3 v_bodyItem_sc;
varying vec4 v_bodyItem_color;
varying vec4 v_bodyItem_cutPlane;


void main(void) {
  v_patchSize = patchCoords.zw;
  v_vertexCoord = (positions.xy + 0.5) * v_patchSize;

  vec2 pos = (patchCoords.xy + v_vertexCoord + 0.25) / vec2(vert_drawItemsTextureSize);
  gl_Position =  vec4((pos - 0.5) * 2.0, 0.0, 1.0);

  v_bodyDataCoords = bodyDataCoords;
  v_bodyItem_metadata = bodyItem_metadata;
  v_bodyItem_tr = bodyItem_tr;
  v_bodyItem_ori = bodyItem_ori;
  v_bodyItem_sc = bodyItem_sc;

  v_bodyItem_color = bodyColor;
  v_bodyItem_cutPlane = cutPlane;
}
`;

const fragmentShaderGLSL = `
precision highp float;

/* VS Outputs */
varying vec2 v_patchSize;
varying vec2 v_vertexCoord;

varying vec4 v_bodyDataCoords;
varying vec4 v_bodyItem_metadata;
varying vec3 v_bodyItem_tr;
varying vec4 v_bodyItem_ori;
varying vec3 v_bodyItem_sc;
varying vec4 v_bodyItem_color;
varying vec4 v_bodyItem_cutPlane;

uniform sampler2D surfaceDataTexture;
uniform ivec2 surfaceDataTextureSize;

// GEOM
uniform sampler2D surfaceAtlasLayoutTexture;
uniform ivec2 surfaceAtlasLayoutTextureSize;

// TRIMTEX
uniform sampler2D trimSetsAtlasLayoutTexture;
uniform ivec2 trimSetsAtlasLayoutTextureSize;

// LIGHTMAP
uniform sampler2D lightmapLayoutTexture;
uniform ivec2 lightmapLayoutTextureSize;

uniform sampler2D bodyDatasTexture;
uniform ivec2 bodyDatasTextureSize;

<%include file="GLSLUtils.glsl"/>
<%include file="GLSLCADConstants.glsl"/>
<%include file="GLSLMath.glsl"/>
<%include file="GLSLBinReader.glsl"/>


const int pixelsPerDrawItem = 10; // The number of RGBA pixels per draw item.
const int valuesPerSurfaceTocItem = 9;

GLSLBinReader setupBodyDataReader() {
  ivec4 region = ivec4(0, 0, bodyDatasTextureSize.x, bodyDatasTextureSize.y);
  // Skip the bbox and numBodySurfaces
  ivec2 start = ivec2(floor(v_bodyItem_metadata.xy+0.5));
  GLSLBinReader bodyDataReader;
  GLSLBinReader_init(bodyDataReader, bodyDatasTextureSize, region, start, 16);
  return bodyDataReader;
}


#ifdef ENABLE_ES3
out vec4 fragColor;
#endif

void main(void) {

#ifndef ENABLE_ES3
  vec4 fragColor;
#endif

  int x = int(v_vertexCoord.x);
  int y = int(v_vertexCoord.y);
  int id = x + y * int(v_patchSize.x);
  int slot = imod(id, pixelsPerDrawItem);

  int surfaceIndexInBody = id / pixelsPerDrawItem;

  GLSLBinReader bodyDataReader = setupBodyDataReader();

  int numSurfaces = GLSLBinReader_readInt(bodyDataReader, bodyDatasTexture, (6/*bbox*/));

  // Skip over the bbox, numSurfaces and then to the current surface data.
  int offsetOfSurfaceRef = (6/*bbox*/) + (1/*numSurfaces*/) + (surfaceIndexInBody * (1/*id*/ + 10/*xfo*/));
  #ifdef ENABLE_PER_FACE_COLORS
  offsetOfSurfaceRef += surfaceIndexInBody * 4/*color*/; // Skip over the color.
  #endif

  int surfaceId = GLSLBinReader_readInt(bodyDataReader, bodyDatasTexture, offsetOfSurfaceRef+0); // look up the surface id

  if(slot == 0) {
    int assetId = int(v_bodyDataCoords.x); // Note: not needed now.
    int bodyId = int(v_bodyDataCoords.y);
    int bodyFlags = int(v_bodyDataCoords.z);

    fragColor.r = float(assetId); // Asset Id; // Note: not needed now.
    fragColor.g = float(bodyId);

    bool debugSurfaceId = false;
    if (debugSurfaceId) {
      // Note: soon we will have the body structure in the
      // the Draw shader, and we can then extract the surfaceId
      // from the body. (instead of providing it here in line 136.)
      fragColor.b = float(surfaceId);
    }
    else {
      // By default we want to see the surfaceIndexInBody
      // because with this we can retrieve the surface data.
      fragColor.b = float(surfaceIndexInBody);
    }

    //  with the surfaceId lookup the surface flags
    GLSLBinReader surfaceDataReader;
    GLSLBinReader_init(surfaceDataReader, surfaceDataTextureSize, ivec4(0, 0, surfaceDataTextureSize.x, surfaceDataTextureSize.y), ivec2(0,0), 16);
    int surfaceFlags = GLSLBinReader_readInt(surfaceDataReader, surfaceDataTexture, geomLibraryHeaderSize + (surfaceId*valuesPerSurfaceTocItem) + 6);
    // int surfaceFlags GLSLBinReader_readInt(bodyDataReader, bodyDatasTexture, offsetOfSurfaceRef+1); // look up the surface id

    float costU = GLSLBinReader_readFloat(surfaceDataReader, surfaceDataTexture, geomLibraryHeaderSize + (surfaceId*valuesPerSurfaceTocItem) + 2);
    float costV = GLSLBinReader_readFloat(surfaceDataReader, surfaceDataTexture, geomLibraryHeaderSize + (surfaceId*valuesPerSurfaceTocItem) + 3);
    if(costU < costV) {
      setFlag(surfaceFlags, SURFACE_FLAG_FLIPPED_UV);
    }

    // Note: this flipping seems to have a negative impact on the 
    // surface normal. When a surface is scaled negatively, so is
    // the normal. So we should not do anything here.
    // vec3 surface_sc = vec3(
    //   GLSLBinReader_readFloat(bodyDataReader, bodyDatasTexture, offsetOfSurfaceRef+8),
    //   GLSLBinReader_readFloat(bodyDataReader, bodyDatasTexture, offsetOfSurfaceRef+9),
    //   GLSLBinReader_readFloat(bodyDataReader, bodyDatasTexture, offsetOfSurfaceRef+10)
    // );
    //int flipCount = (surface_sc.x < 0.0 ? 1 : 0) + (surface_sc.y < 0.0 ? 1 : 0) + (surface_sc.z < 0.0 ? 1 : 0);
    // if(imod(flipCount, 2)==1) {
    //   if(testFlag(surfaceFlags, SURFACE_FLAG_FLIPPED_NORMAL))
    //     clearFlag(surfaceFlags, SURFACE_FLAG_FLIPPED_NORMAL);
    //   else
    //     setFlag(surfaceFlags, SURFACE_FLAG_FLIPPED_NORMAL);
    // }
    
#ifndef ENABLE_ES3
    fragColor.a = float(bodyFlags | surfaceFlags);
#else
    fragColor.a = float(bodyFlags + surfaceFlags);
#endif
  }
  else if(slot == 1) {
    fragColor.r = v_bodyItem_metadata.z; // material coords x
    fragColor.g = v_bodyItem_metadata.w; // material coords y
    fragColor.b = -1.0;
    fragColor.a = -1.0;
  }
  else if(slot == 2) {
    // geom patch
    GLSLBinReader surfaceLayoutDataReader;
    GLSLBinReader_init(surfaceLayoutDataReader, surfaceAtlasLayoutTextureSize, 16);
    fragColor = GLSLBinReader_readVec4(surfaceLayoutDataReader, surfaceAtlasLayoutTexture, surfaceId * 8);
  }
  else if(slot == 3) {

    //  with the surfaceId lookup the trimSet id.
    GLSLBinReader surfaceDataReader;
    GLSLBinReader_init(surfaceDataReader, surfaceDataTextureSize, ivec4(0, 0, surfaceDataTextureSize.x, surfaceDataTextureSize.y), ivec2(0,0), 16);
    // Note: the begining of the surface data texture is the TOC, which includes the trimSetId, 
    // We should prboably move the trim set Id to the actual surface data.
    // Note: the trim set value can easily be outside the range of a single 16 bit float, so here
    // we use 2 floats and compbine them to get the correct value.
    int partA = GLSLBinReader_readInt(surfaceDataReader, surfaceDataTexture, geomLibraryHeaderSize + (surfaceId*valuesPerSurfaceTocItem) + 7);
    int partB = GLSLBinReader_readInt(surfaceDataReader, surfaceDataTexture, geomLibraryHeaderSize + (surfaceId*valuesPerSurfaceTocItem) + 8);
  
#ifdef INTS_PACKED_AS_2FLOAT16
    int trimSetId = partA + (partB * 2048);
#else
    int trimSetId = partA + (partB * 256);
#endif
    if(trimSetId >= 0) {
      GLSLBinReader trimsetLayoutDataReader;
      GLSLBinReader_init(trimsetLayoutDataReader, trimSetsAtlasLayoutTextureSize, 16);
      fragColor = GLSLBinReader_readVec4(trimsetLayoutDataReader, trimSetsAtlasLayoutTexture, trimSetId*4);
    }
    else {
      fragColor = vec4(-1.0);
    }
  }
  else if(slot == 4) {
  #ifdef ENABLE_PER_FACE_COLORS
    // Store the per-face color here.
    fragColor = vec4(
      GLSLBinReader_readFloat(bodyDataReader, bodyDatasTexture, offsetOfSurfaceRef+11),
      GLSLBinReader_readFloat(bodyDataReader, bodyDatasTexture, offsetOfSurfaceRef+12),
      GLSLBinReader_readFloat(bodyDataReader, bodyDatasTexture, offsetOfSurfaceRef+13),
      GLSLBinReader_readFloat(bodyDataReader, bodyDatasTexture, offsetOfSurfaceRef+14)
      );
  #else 
    fragColor = vec4(0.0, 0.0, 0.0, 0.0);
  #endif
  }
  else if(slot >= 5 && slot <= 7) {

    vec3 surface_tr = vec3(
      GLSLBinReader_readFloat(bodyDataReader, bodyDatasTexture, offsetOfSurfaceRef+1),
      GLSLBinReader_readFloat(bodyDataReader, bodyDatasTexture, offsetOfSurfaceRef+2),
      GLSLBinReader_readFloat(bodyDataReader, bodyDatasTexture, offsetOfSurfaceRef+3)
      );

    vec4 surface_ori = normalize(vec4(
      GLSLBinReader_readFloat(bodyDataReader, bodyDatasTexture, offsetOfSurfaceRef+4),
      GLSLBinReader_readFloat(bodyDataReader, bodyDatasTexture, offsetOfSurfaceRef+5),
      GLSLBinReader_readFloat(bodyDataReader, bodyDatasTexture, offsetOfSurfaceRef+6),
      GLSLBinReader_readFloat(bodyDataReader, bodyDatasTexture, offsetOfSurfaceRef+7)
      ));

    vec3 surface_sc = vec3(
      GLSLBinReader_readFloat(bodyDataReader, bodyDatasTexture, offsetOfSurfaceRef+8),
      GLSLBinReader_readFloat(bodyDataReader, bodyDatasTexture, offsetOfSurfaceRef+9),
      GLSLBinReader_readFloat(bodyDataReader, bodyDatasTexture, offsetOfSurfaceRef+10)
    );

    Xfo bodyXfo = Xfo(v_bodyItem_tr, normalize(v_bodyItem_ori), v_bodyItem_sc);
    Xfo surfaceXfo = Xfo(surface_tr, surface_ori, surface_sc);
    
    // Convert each mat 
    mat4 geomMat = transpose(xfo_toMat4(bodyXfo) * xfo_toMat4(surfaceXfo));
    // mat4 geomMat = transpose(xfo_toMat4(xfo));
    // mat4 geomMat = mat4(1.0);

    if(slot == 5) {
      vec4 col0 = geomMat[0];
      fragColor.r = col0.x;
      fragColor.g = col0.y;
      fragColor.b = col0.z;
      fragColor.a = col0.w;
    }
    else if(slot == 6) {
      vec4 col1 = geomMat[1];
      fragColor.r = col1.x;
      fragColor.g = col1.y;
      fragColor.b = col1.z;
      fragColor.a = col1.w;
    }
    else if(slot == 7) {
      vec4 col2 = geomMat[2];
      fragColor.r = col2.x;
      fragColor.g = col2.y;
      fragColor.b = col2.z;
      fragColor.a = col2.w;
    }
  }
  else if(slot == 8) {
    fragColor = v_bodyItem_color;
  }
  else if(slot == 9) {
    fragColor = v_bodyItem_cutPlane;
  }

#ifndef ENABLE_ES3
  gl_FragColor = fragColor;
#endif
}
`;

/** Class representing a GL evaluate draw items shader.
 * @extends GLShader
 * @ignore
 */
class GLEvaluateDrawItemsShader extends GLCADShader {
  /**
   * Create a GL evaluate draw items shader.
   * @param {any} gl - The gl value.
   */
  constructor(gl) {
    super(gl);

    this.__shaderStages['VERTEX_SHADER'] = zeaEngine.shaderLibrary.parseShader(
      'GLEvaluateDrawItemsShader.vertexShader',
      vertexShaderGLSL
    );

    this.__shaderStages[
      'FRAGMENT_SHADER'
    ] = zeaEngine.shaderLibrary.parseShader(
      'GLEvaluateDrawItemsShader.fragmentShader',
      fragmentShaderGLSL
    );

    this.finalize();
  }
}

/** Class representing a GL evaluate CAD curve shader.
 * @extends GLShader
 * @ignore
 */
class GLEvaluateCADCurveShader extends zeaEngine.GLShader {
  /**
   * Create a GL evaluate CAD curve shader.
   * @param {any} gl - The gl value.
   * @ignore
   */
  constructor(gl) {
    super(gl);

    this.__shaderStages['VERTEX_SHADER'] = zeaEngine.shaderLibrary.parseShader(
      'GLEvaluateCADCurveShader.vertexShader',
      `
precision highp float;

attribute vec3 positions;
instancedattribute vec4 patchCoords;         // where the values will be written to in the target texture.
instancedattribute vec2 curveDataCoords;     // where the data will come from in the source texture

uniform ivec2 curvesAtlasTextureSize;

/* VS Outputs */
varying vec2 v_geomDataCoords;
varying vec2 v_patchSize;
varying vec2 v_vertexCoord;



void main(void) {

  vec2 patchPos = patchCoords.xy;
  v_patchSize = patchCoords.zw;

  v_geomDataCoords = curveDataCoords;
  v_vertexCoord = (positions.xy + 0.5) * v_patchSize;

  vec2 pos = (patchPos + v_vertexCoord) / vec2(curvesAtlasTextureSize);
  gl_Position =  vec4((pos - 0.5) * 2.0, 0.0, 1.0);
}
`
    );

    this.__shaderStages[
      'FRAGMENT_SHADER'
    ] = zeaEngine.shaderLibrary.parseShader(
      'GLEvaluateCADCurveShader.fragmentShader',
      `
// #extension GL_EXT_draw_buffers : require
precision highp float;

/* VS Outputs */
varying vec2 v_geomDataCoords;
varying vec2 v_patchSize;
varying vec2 v_vertexCoord;


struct PosNorm {
  vec3 pos;
  vec3 normal;
  int geomType;
};


<%include file="GLSLUtils.glsl"/>
<%include file="GLSLMath.glsl"/>
<%include file="GLSLBinReader.glsl"/>

<%include file="GLSLCADConstants.glsl"/>
<%include file="GLSLCADCurves.glsl"/>
<%include file="GLSLNURBS.glsl"/>
<%include file="GLSLNURBSCurves.glsl"/>

uniform sampler2D curveDataTexture;
uniform ivec2 curveDataTextureSize;
uniform int writeTangents;

PosNorm evalCADCurves(vec2 params, inout GLSLBinReader reader, sampler2D texture) {
  int geomType = GLSLBinReader_readInt(reader, texture);

  // PosNorm result;
  // result.pos = vec3(float(geomType));
  // // fragColor = reader.buffer;
  // // fragColor = vec4(float(reader.textureSize.x), float(reader.textureSize.y), float(geomType), 1.0);
  // return result;


  if(geomType == CURVE_TYPE_LINE) {
      return calcLinePoint(params.x, reader, texture);
  } 
  if(geomType == CURVE_TYPE_CIRCLE) {
      return calcCirclePoint(params.x, reader, texture);
  } 
  if(geomType == CURVE_TYPE_ELIPSE) {
      return calcElipsePoint(params.x, reader, texture);
  }
  if(geomType == CURVE_TYPE_NURBS_CURVE) {
      return calcNURBSCurve3dPoint(params.x, reader, texture);
  } 
  
  PosNorm detault;
  return detault;
}

#ifdef ENABLE_ES3
out vec4 fragColor;
#endif

void main(void) {

#ifndef ENABLE_ES3
  vec4 fragColor;
#endif


  // Evaluate the curve per vertex

  // compute exact xy coords per pixel by rounding the vertex coord to the nearest integer and then dividing my patch size.
  // The interpollated xy coords from the quad are not exact because the quad must cover the pixels with some margin.

  // The quad overlaps the pixels by half a pixel, so 
  vec2 params = vec2(floor(v_vertexCoord.x), floor(v_vertexCoord.y));
  if(v_patchSize.x > 1.0)
      params.x /= v_patchSize.x - 1.0;
  // if(v_patchSize.y > 1.0)
  //     params.y /= v_patchSize.y - 1.0;

  ivec4 region = ivec4(0, 0, curveDataTextureSize.x, curveDataTextureSize.y);
  ivec2 start = ivec2(int(v_geomDataCoords.x), int(v_geomDataCoords.y));

  GLSLBinReader reader;
  GLSLBinReader_init(reader, curveDataTextureSize, region, start, 32);
  PosNorm posNorm = evalCADCurves(params, reader, curveDataTexture);

  if(writeTangents == 1) {
      fragColor = vec4(posNorm.normal, 1.0);
  }
  else {
      fragColor = vec4(posNorm.pos, 1.0);
  }
  // fragColor = vec4(params.x, params.y, 0.0, 1.0);
  // gl_FragData[0] = vec4(posNorm.pos, 1.0);
  // gl_FragData[1] = vec4(posNorm.normal, 1.0);

  // fragColor.r = v_geomDataCoords.x;
  // fragColor.g = v_geomDataCoords.y;
  // fragColor.b = float(curveDataTextureSize.x);
  // fragColor.a = float(curveDataTextureSize.y);

#ifndef ENABLE_ES3
  gl_FragColor = fragColor;
#endif
}
`
    );

    this.finalize();
  }
}

zeaEngine.sgFactory.registerClass(
  'GLEvaluateCADCurveShader',
  GLEvaluateCADCurveShader
);

const GLDrawCADSurfaceShader_VERTEX_SHADER = zeaEngine.shaderLibrary.parseShader(
  'GLDrawCADSurfaceShader.vertexShader',
  `
precision highp float;

<%include file="GLSLUtils.glsl"/>
<%include file="GLSLCADConstants.glsl"/>
<%include file="stack-gl/transpose.glsl"/>
<%include file="stack-gl/inverse.glsl"/>

attribute vec3 positions;
instancedattribute vec2 drawCoords;  // (DrawItemData Coords (x, y) 

uniform mat4 viewMatrix;
uniform mat4 cameraMatrix;
uniform mat4 projectionMatrix;
uniform vec2 quadDetail;
uniform vec3 assetCentroid;


// #define DEBUG_SURFACES
uniform int numSurfacesInLibrary;


<%include file="GLSLCADSurfaceDrawing.vertexShader.glsl"/>

varying vec2 v_drawCoords;
varying vec3 v_viewPos;
varying vec3 v_worldPos;
varying vec3 v_viewNormal;
varying vec2 v_textureCoord;
varying float v_surfaceType;
varying vec2 v_quadDetail;

void main(void) {
    v_drawCoords = drawCoords;
    vec2 texCoords = positions.xy + 0.5;
    vec4 metadata = getDrawItemData(0);
    vec4 surfaceCoords = getDrawItemData(2);
    int flags = int(floor(metadata.a + 0.5));

    //////////////////////////////////////////////
    // Visiblity
    if(testFlag(flags, BODY_FLAG_INVISIBLE)) {
        gl_Position = vec4(-3.0, -3.0, -3.0, 1.0);;
        return;
    }

    //////////////////////////////////////////////
    // Transforms
#ifdef DEBUG_SURFACES
    mat4 modelMatrix;
    int surfaceType = int(v_surfaceType+0.5);
    if(surfaceType == SURFACE_TYPE_NURBS_SURFACE) {
        int surfaceIndexInBody = int(metadata.b+0.5);
        int sideLen = int(ceil(sqrt(float(numSurfacesInLibrary))));
        int x = surfaceIndexInBody % sideLen;
        int y = surfaceIndexInBody / sideLen;
        modelMatrix = mat4(1.0, 0.0, 0.0, 0.0, 
                        0.0, 1.0, 0.0, 0.0, 
                        0.0, 0.0, 1.0, 0.0,  
                        float(x), float(y), 0.0, 1.0);
    }
#else
    mat4 modelMatrix = getModelMatrix();
    
    // mat4 modelMatrix = mat4(1.0);
    
    // Note: on mobile GPUs, we get only FP16 math in the
    // fragment shader, causing inaccuracies in modelMatrix
    // calculation. By offsetting the data to the origin
    // we calculate a modelMatrix in the asset space, and
    //  then add it back on during final drawing.
    modelMatrix[3][0] += assetCentroid.x;
    modelMatrix[3][1] += assetCentroid.y;
    modelMatrix[3][2] += assetCentroid.z;
#endif
    mat4 modelViewMatrix = viewMatrix * modelMatrix;
    mat3 normalMatrix = mat3(transpose(inverse(modelViewMatrix)));

    //////////////////////////////////////////////
    // Vertex Attributes

    bool isFan = int(quadDetail.y) == 0;
    vec2 vertexCoords = texCoords * (isFan ? quadDetail + vec2(1.0, 1.0) : quadDetail);
    v_surfaceType = float(getSurfaceType(surfaceCoords.xy, vertexCoords));
    vec3 normal  = getSurfaceNormal(surfaceCoords.xy, vertexCoords);
    vec4 pos     = vec4(getSurfaceVertex(surfaceCoords.xy, vertexCoords), 1.0);
    
    bool flippedNormal = testFlag(flags, SURFACE_FLAG_FLIPPED_NORMAL);
    if(flippedNormal)
        normal = -normal;

    vec4 viewPos = modelViewMatrix * pos;
    v_viewPos    = viewPos.xyz;
    v_worldPos   = (modelMatrix * pos).xyz;
    gl_Position  = projectionMatrix * viewPos;
    v_viewNormal = normalMatrix * normal;

    v_quadDetail = quadDetail;

    {
        // Pull back facing vertices towards us ever so slightly...
        // This is to avoid z-fighting that occurs wehn we see the inside
        // of a surface that is resting on another surface.
        vec3 worldNormal = normalize(mat3(cameraMatrix) * v_viewNormal);

        vec3 viewVector = normalize(mat3(cameraMatrix) * normalize(-v_viewPos));
        float ndotv = dot(worldNormal, viewVector);
        bool backFacing = ndotv <= 0.0;
        if (backFacing) {
            gl_Position.z -= 0.000001;
        }
    }

    if(isFan) {
        // We are drawing a Fan surface, so the uv coords
        // simply come from the vertex positions.
        v_textureCoord = positions.xy;
    }
    else {
        v_textureCoord = texCoords;
        if(testFlag(flags, SURFACE_FLAG_FLIPPED_UV)) {
            v_textureCoord = vec2(v_textureCoord.y, v_textureCoord.x);
            v_quadDetail = vec2(v_quadDetail.y, v_quadDetail.x);
        }

        // v_textureCoord.y = 1.0 - v_textureCoord.y; // Flip y
    }
}`
);

const GLDrawCADSurfaceShader_FRAGMENT_SHADER = zeaEngine.shaderLibrary.parseShader(
  'GLDrawCADSurfaceShader.fragmentShader',
  `
precision highp float;

<%include file="math/constants.glsl"/>
<%include file="GLSLUtils.glsl"/>
<%include file="stack-gl/gamma.glsl"/>
<%include file="materialparams.glsl"/>
<%include file="GGX_Specular.glsl"/>
<%include file="PBRSurfaceRadiance.glsl"/>

<%include file="GLSLCADConstants.glsl"/>

uniform mat4 cameraMatrix;

uniform bool headLighting;
uniform bool displayWireframes;
uniform bool displayEdges;


#ifdef ENABLE_INLINE_GAMMACORRECTION
uniform float exposure;
uniform float gamma;
#endif

varying vec2 v_drawCoords;
varying vec3 v_viewPos;
varying vec3 v_worldPos;
varying vec3 v_viewNormal;
varying vec2 v_textureCoord;
varying float v_surfaceType;
varying vec2 v_quadDetail;

vec3 getDebugColor(int id){
    
    int sel = int(round(mod(float(id), 14.0)));
    
    if(sel==0)
        return vec3(0.0, 1.0, 1.0);
    else if (sel==1)
        return vec3(0.0, 1.0, 0.0);
    else if (sel==2)
        return vec3(1.0, 0.0, 1.0);
    else if (sel==3)
        return vec3(0.75, 0.75, 0.0);
    else if (sel==4)
        return vec3(0.0, 0.75, 0.75);
    else if (sel==5)
        return vec3(0.75, 0.0, 0.75);
    else if (sel==6)
        return vec3(0.45, 0.95, 0.0);
    else if (sel==7)
        return vec3(0.0, 0.45, 0.95);
    else if (sel==8)
        return vec3(0.95, 0.0, 0.45);
    else if (sel==9)
        return vec3(0.95, 0.45, 0.0);
    else if (sel==10)
        return vec3(0.0, 0.95, 0.45);
    else if (sel==11)
        return vec3(0.45, 0.0, 0.95);
    else if (sel==12)
        return vec3(0.45, 0.45, 0.95);
    else if (sel==13)
        return vec3(0.0, 0.0, 0.45);
    else if (sel==14)
        return vec3(0.0, 0.45, 0.45);
    else if (sel==15)
        return vec3(0.45, 0.0, 0.45);
    else return vec3(0.2, 0.2, 0.2);
}

<%include file="GLSLCADSurfaceDrawing.fragmentShader.glsl"/>

// const float gridSize = 0.02;
const float gridSize = 0.2;

#ifdef ENABLE_ES3
out vec4 fragColor;
#endif

void main(void) {

#ifndef ENABLE_ES3
    vec4 fragColor;
#endif

    vec4 metadata = getDrawItemData(0);
    int flags = int(floor(metadata.a + 0.5));


    //////////////////////////////////////////////
    // Trimming

#ifdef ENABLE_TRIMMING
    vec3 trimPatchCoords;
    if(applyTrim(trimPatchCoords, flags)){
        discard;
        return;
    }
#endif

    ///////////////////////////////////////////
    // Normal

    vec3 normal = normalize(mat3(cameraMatrix) * v_viewNormal);
    vec3 viewNormal = normalize(v_viewNormal);

    vec3 viewVector = normalize(mat3(cameraMatrix) * normalize(-v_viewPos));
    bool backFacing = dot(normal, viewVector) <= 0.0;
    if(backFacing){
        normal = -normal;
        viewNormal = -viewNormal;
    }

    //////////////////////////////////////////////
    // Material
    vec4 materialCoords = getDrawItemData(1);
    vec4 matValue0 = getMaterialValue(materialCoords.xy, 0);

    MaterialParams material;

    /////////////////
    bool clayRendering = false;
    if(clayRendering)
        material.baseColor          = vec3(0.45, 0.26, 0.13);
    else
        material.baseColor          = matValue0.rgb;
    
    /////////////////
    // Face color
    vec4 faceColor = getDrawItemData(4);
    material.baseColor = mix(material.baseColor, faceColor.rgb, faceColor.a);

    float opacity               = matValue0.a;
        
    //////////////////////////////////////////////
    // Cutaways
#ifdef ENABLE_CUTAWAYS
    if (testFlag(flags, BODY_FLAG_CUTAWAY)) {
        if (cutaway(v_worldPos, cutNormal, planeDist)) {
            discard;
        }
        // If we are not cutaway, but we can see a back facing face
        // then set the normal to the cut plane do the lighting is flat.
        if (backFacing){
            normal = cutNormal;
        }
    }
#endif

    vec3 irradiance ;
#ifdef ENABLE_PBR
    if (envMapPyramid_desc.x > 0.0) {
        if (headLighting) {
            irradiance = sampleEnvMap(viewNormal, 1.0);
        } else {
            irradiance = sampleEnvMap(normal, 1.0);
        }
    } else {
#endif
        float ndotv = dot(normal, viewVector);
        irradiance = vec3(ndotv);
#ifdef ENABLE_PBR
    }
#endif

    /////////////////
    // Debug materialId
#ifdef DEBUG_MATERIALID
    {
        material.baseColor = vec3(float(int(materialCoords.x) % 5)/5.0, float(int(materialCoords.y) % 5)/5.0, 0.0);
    }
#endif

    /////////////////
    // Debug bodyId
#ifdef DEBUG_BODYID
    {
        int bodyId = int(metadata.g+0.5);
        material.baseColor       = getDebugColor(bodyId);
    }
#endif

    /////////////////
    // Debug surfaceIndexInBody
#ifdef DEBUG_SURFACEID
    {
        int surfaceIndexInBody = int(metadata.b+0.5);
        material.baseColor       = getDebugColor(surfaceIndexInBody);
    }
#endif

    /////////////////
    // Debug surface Type
#ifdef DEBUG_SURFACETYPE
    {
        int surfaceType = int(v_surfaceType+0.5);
        material.baseColor       = getDebugColor(surfaceType);
    }
#endif

    /////////////////
    // bool flippedNormal = testFlag(flags, SURFACE_FLAG_FLIPPED_NORMAL);
    // if(flippedNormal) {
    //    material.baseColor = mix(material.baseColor, vec3(1,0,0), 0.75);
    // }

    // if (backFacing) {
    //     material.baseColor = mix(material.baseColor, vec3(1,0,0), 0.75);
    // }

    /////////////////
    // Debug UV layout.
    // {
    //     material.baseColor = vec3(v_textureCoord.x);
    //     // material.baseColor.r = mix(0.0, 1.0, v_textureCoord.x);
    //     // material.baseColor.g = mix(0.0, 1.0, v_textureCoord.y);
    // }

    /////////////////
    // if(testFlag(flags, SURFACE_FLAG_FLIPPED_UV)){
    //     material.baseColor = mix(material.baseColor, vec3(1,1,1), 0.5);
    // }

    /////////////////
    // if(v_quadDetail.x > 512.0 || v_quadDetail.y > 512.0){
    //     material.baseColor = mix(material.baseColor, vec3(1,0,0), 0.75);
    // } else {
    //     // discard;
    // }
    
    /////////////////
    // Debug trim texture.
#ifdef ENABLE_TRIMMING
#ifdef DEBUG_TRIMTEXELS
    if(trimPatchCoords.x >= 0.0) {
        vec4 trimPatchQuad = getDrawItemData(3);
        // trimPatchCoords = (trimPatchQuad.xy + 0.5) + ((trimPatchQuad.zw - 0.5) * v_textureCoord);
        trimPatchCoords.xy = trimPatchQuad.xy + (trimPatchQuad.zw * v_textureCoord);
        vec2 trimUv = (trimPatchCoords.xy) / vec2(trimSetAtlasTextureSize);
        vec4 trimTexel = texture2D(trimSetAtlasTexture, trimUv);

        vec2 texelOffset = trimPatchCoords.xy - (floor(trimPatchCoords.xy) + 0.5);
        float texelDist = length(texelOffset);
        
        material.baseColor = trimTexel.rgb * texelDist;
        // material.baseColor = mix(material.baseColor, vec3(0,0,0), texelDist);
        // material.baseColor = mix(material.baseColor, vec3(0,0,0), trimPatchCoords.z);
        // material.baseColor = mix(material.baseColor, vec3(0,0,0), (trimPatchCoords.z < 0.5) ? 1.0 : 0.0);

        // if(trimPatchCoords.z < 0.5) {
        //     material.baseColor = mix(material.baseColor, vec3(0,0,0), 0.1);
        // }
        // else{
        //     float total = floor(trimPatchCoords.x) +
        //                   floor(trimPatchCoords.y);
        //     if(mod(total,2.0)==0.0)
        //         material.baseColor = mix(material.baseColor, vec3(0,0,0), 0.25);
        //     else
        //         material.baseColor = mix(material.baseColor, vec3(1,1,1), 0.25);
        // }
    }
#endif
#endif


    
    //////////////////////////////////////////////
    // Transparency
    // Simple screen door transparency.
    // float threshold = gridSize * opacity * (1.0 - (v_viewPos.z / 300.0));
    // // if(mod(v_viewPos.x / v_viewPos.z, gridSize) > threshold || mod(v_viewPos.y/v_viewPos.z, gridSize) > threshold)// || mod(v_viewPos.z, gridSize) > threshold)
    // if(mod(abs(v_worldPos.x), gridSize) > threshold || mod(abs(v_worldPos.y), gridSize) > threshold || mod(abs(v_worldPos.z), gridSize) > threshold)
    //     discard;


    ///////////////////////////////////////////
    // Lighting
    vec3 radiance;

    vec4 matValue1;
    if(clayRendering)
        matValue1          = vec4(0.0, 1.0, 0.0, 0.0);
    else
        matValue1          = getMaterialValue(materialCoords.xy, 1);

    material.metallic       = matValue1.r;
    material.roughness      = matValue1.g;
    material.reflectance    = matValue1.b;
    float emissive          = matValue1.a;

#ifdef ENABLE_PBR
    if (envMapPyramid_desc.x > 0.0) {
        if (headLighting) {
            // Calculate PBR Reflection based on a screen space vecotr for both the noramal and the view vector.
            radiance = pbrSurfaceRadiance(material, irradiance, viewNormal, normalize(-v_viewPos));
        } else {
            radiance = pbrSurfaceRadiance(material, irradiance, normal, viewVector);
        }

        // vec3 reflectionVector = reflect(-viewVector, normal);
        // vec3 envColor = sampleEnvMap(reflectionVector, material.roughness);
        // radiance = irradiance;
    } else {
#endif
        // Simple diffuse lighting.
        radiance = irradiance * material.baseColor;
#ifdef ENABLE_PBR
    }
#endif

    fragColor = vec4(mix(radiance, material.baseColor, emissive), 1.0);

    /////////////////////////////
    // fragColor = vec4(irradiance * material.baseColor, 1.0);
    // fragColor = vec4(lightmapValue, 1.0);
    // fragColor = vec4(lightmapValue * material.baseColor, 1.0);
    // fragColor = vec4(material.baseColor, 1.0);
    // fragColor = vec4( normalize(viewNormal), 1.0);
    // fragColor = vec4( normalize(normal), 1.0);

    // fragColor = vec4(sampleEnvMap(viewNormal, material.roughness), 1.0);;
    
    //////////////////////
    {
        // vec4 wireColor = vec4(0.1, 0.1, 0.1, 1.0);
        //vec4 wireColor = vec4(0.6, 0.6, 0.6, 1.0);
        vec4 wireColor = vec4(0.0, 0.0, 0.0, 1.0);
        
        vec2 vertexCoords = v_textureCoord * v_quadDetail;
        vec2 vcD = fwidth(vertexCoords);
        vec2 vcW = fract(vertexCoords);

        bool isFan = v_quadDetail.y < 0.5;
        if(displayWireframes) {
            if (isFan) {

            } else {
        
                float lerpVal = smoothstep(0.0, vcD.x, vcW.x) * smoothstep(1.0, 1.0 - vcD.x, vcW.x) * smoothstep(0.0, vcD.y, vcW.y) * smoothstep(1.0, 1.0 - vcD.y, vcW.y);
                
                // Display a thin line at 50% opacity.
                fragColor = mix(fragColor, wireColor, (1.0-smoothstep(0.0, 0.5, lerpVal)) * 0.5 );
        
                //fragColor = mix(fragColor, wireColor, (mod(vertexCoords.x, 2.0) < 1.0) ? 0.5 : 0.0 );
            }
        }

    #ifdef ENABLE_TRIMMING
        vec2 tcD = fwidth(v_textureCoord);
        vec2 tcW = fract(v_textureCoord);
        vec2 tpD = fwidth(trimPatchCoords.xy);
        if(displayEdges) {   
            if (isFan) {

            } else {
                if(trimPatchCoords.x >= 0.0) {
                    if (trimPatchCoords.z < 1.0) {
                        float stripBoundaryH = 0.5;
                        float stripWidth = 2.0;

                        float pixelWidth = ((tpD.x + tpD.y) * 0.5) / stripWidth;
                        float minLimit = stripBoundaryH + pixelWidth * 0.5;
                        float maxLimit = stripBoundaryH + pixelWidth * 0.75;
                        
                        float lerpVal;
                        if (maxLimit < 1.0) {
                            lerpVal = smoothstep(maxLimit, minLimit, trimPatchCoords.z);
                        } else {
                            // If the strip width is less then one screen pixel, then 
                            // we just interpollate over the width of the strip. 
                            lerpVal = 1.0 - smoothstep(0.75, 1.0, trimPatchCoords.z);
                        }
                        fragColor = mix(fragColor, wireColor, lerpVal);
                    }
                } 
                else {
                    float lerpVal = smoothstep(0.0, tcD.x, tcW.x) * smoothstep(1.0, 1.0 - tcD.x, tcW.x) * smoothstep(0.0, tcD.y, tcW.y) * smoothstep(1.0, 1.0 - tcD.y, tcW.y);
                    fragColor = mix(fragColor, wireColor, 1.0 - lerpVal);
                }
            }
        }
    #endif
    }

#ifdef ENABLE_INLINE_GAMMACORRECTION
    fragColor.rgb = toGamma(fragColor.rgb * exposure, gamma);
#endif

#ifndef ENABLE_ES3
    gl_FragColor = fragColor;
#endif
}
`
);

/** Class representing a GL draw CAD surface shader.
 * @extends GLCADShader
 * @ignore
 */
class GLDrawCADSurfaceShader extends GLCADShader {
  /*
   * Create a GL draw CAD surface shader.
   * @param {any} gl - The gl value.
   */
  constructor(gl) {
    super(gl);

    this.__shaderStages['VERTEX_SHADER'] = GLDrawCADSurfaceShader_VERTEX_SHADER;
    this.__shaderStages[
      'FRAGMENT_SHADER'
    ] = GLDrawCADSurfaceShader_FRAGMENT_SHADER;

    this.finalize();
  }

  /**
   * The getParamDeclarations method.
   * @return {any} - The return value.
   */
  static getParamDeclarations() {
    const paramDescs = super.getParamDeclarations();
    paramDescs.push({
      name: 'BaseColor',
      defaultValue: new zeaEngine.Color(1.0, 1.0, 0.5),
    });
    paramDescs.push({
      name: 'EmissiveStrength',
      defaultValue: 0.0,
    });
    paramDescs.push({
      name: 'Metallic',
      defaultValue: 0.0,
    });
    paramDescs.push({
      name: 'Roughness',
      defaultValue: 0.25,
    });
    paramDescs.push({
      name: 'Normal',
      defaultValue: new zeaEngine.Color(0.0, 0.0, 0.0),
    });
    paramDescs.push({
      name: 'TexCoordScale',
      defaultValue: 1.0,
      texturable: false,
    });
    // F0 = reflectance and is a physical property of materials
    // It also has direct relation to IOR so we need to dial one or the other
    // For simplicity sake, we don't need to touch this value as metalic can dictate it
    // such that non metallic is mostly around (0.01-0.025) and metallic around (0.7-0.85)
    paramDescs.push({
      name: 'Reflectance',
      defaultValue: 0.025,
    });
    return paramDescs
  }

  /**
   * The getPackedMaterialData method.
   * @param {any} material - The material param.
   * @return {any} - The return value.
   */
  static getPackedMaterialData(material) {
    const matData = new Float32Array(8);
    const baseColor = material.getParameter('BaseColor').getValue();
    matData[0] = baseColor.r;
    matData[1] = baseColor.g;
    matData[2] = baseColor.b;
    matData[3] = baseColor.a;
    if (material.getParameter('EmissiveStrength')) {
      matData[4] = material.getParameter('Metallic').getValue();
      matData[5] = material.getParameter('Roughness').getValue();
      matData[6] = material.getParameter('Reflectance').getValue();
      matData[7] = material.getParameter('EmissiveStrength').getValue();
    } else {
      matData[5] = 1.0;
    }
    return matData
  }
}

zeaEngine.sgFactory.registerClass(
  'GLDrawCADSurfaceShader',
  GLDrawCADSurfaceShader
);

const FRAGMENT_SHADER$1 = zeaEngine.shaderLibrary.parseShader(
  'GLDrawCADSurfaceGeomDataShader.fragmentShader',
  `
precision highp float;

<%include file="stack-gl/gamma.glsl"/>
<%include file="GLSLCADConstants.glsl"/>
<%include file="GLSLUtils.glsl"/>

uniform int passIndex;
uniform int assetIndex;

varying vec2 v_drawCoords;
varying vec3 v_viewPos;
varying vec3 v_worldPos;
varying vec3 v_viewNormal;
varying vec2 v_textureCoord;
varying vec2 v_vertexCoords;
varying float v_surfaceType;

<%include file="GLSLCADSurfaceDrawing.fragmentShader.glsl"/>

#ifdef ENABLE_ES3
out vec4 fragColor;
#endif

void main(void) {

#ifndef ENABLE_ES3
    vec4 fragColor;
#endif

    vec4 metadata = getDrawItemData(0);
    int flags = int(floor(metadata.a + 0.5));
    int surfaceIndexInBody = int(metadata.b + 0.5);

    //////////////////////////////////////////////
    // Cutaways
#ifdef ENABLE_CUTAWAYS
    if(applyCutaway(flags)){
        discard;
        return;
    }
#endif

    //////////////////////////////////////////////
    // Trimming
#ifdef ENABLE_TRIMMING
    vec3 trimPatchCoords;
    if(applyTrim(trimPatchCoords, flags)){
        discard;
        return;
    }
#endif

    float dist = length(v_viewPos);

    int passAndAssetIndex = passIndex + (assetIndex * 64);

    fragColor.r = float(passAndAssetIndex);
    fragColor.g = metadata.g; // Body Id;
    fragColor.b = float(surfaceIndexInBody); // Surface Id; // Note: we subtract 1 in the GLCADPAss.getGeomItemAndDist
    fragColor.a = dist;
    
    // fragColor.b = v_surfaceType;

#ifndef ENABLE_ES3
    gl_FragColor = fragColor;
#endif
}
`
);

/** Class representing a GL draw CAD surface geom data shader.
 * @extends GLCADShader
 * @ignore
 */
class GLDrawCADSurfaceGeomDataShader extends GLCADShader {
  /**
   * Create a GL draw CAD surface geom data shader.
   * @param {any} gl - The gl value.
   */
  constructor(gl) {
    super(gl);

    this.__shaderStages['VERTEX_SHADER'] = GLDrawCADSurfaceShader_VERTEX_SHADER;

    this.__shaderStages['FRAGMENT_SHADER'] = FRAGMENT_SHADER$1;

    this.nonSelectable = true;
    this.finalize();
  }
}

zeaEngine.sgFactory.registerClass(
  'GLDrawCADSurfaceGeomDataShader',
  GLDrawCADSurfaceGeomDataShader
);

const FRAGMENT_SHADER$2 = zeaEngine.shaderLibrary.parseShader(
  'GLDrawSelectedCADSurfaceShader.fragmentShader',
  `
precision highp float;

<%include file="stack-gl/gamma.glsl"/>
<%include file="GLSLCADConstants.glsl"/>
<%include file="GLSLUtils.glsl"/>

varying vec2 v_drawCoords;
varying vec3 v_viewPos;
varying vec3 v_worldPos;
varying vec3 v_viewNormal;
varying vec2 v_textureCoord;
varying vec2 v_vertexCoords;

<%include file="GLSLCADSurfaceDrawing.fragmentShader.glsl"/>

#ifdef ENABLE_ES3
out vec4 fragColor;
#endif

void main(void) {

#ifndef ENABLE_ES3
    vec4 fragColor;
#endif

    vec4 metadata = getDrawItemData(0);
    int flags = int(floor(metadata.a + 0.5));

    //////////////////////////////////////////////
    // Cutaways
#ifdef ENABLE_CUTAWAYS
    if(applyCutaway(flags)){
        discard;
        return;
    }
#endif

    //////////////////////////////////////////////
    // Trimming
#ifdef ENABLE_TRIMMING
    vec3 trimPatchCoords;
    if(applyTrim(trimPatchCoords, flags)){
        discard;
        return;
    }
#endif
    
    vec4 highlightColor = getDrawItemData(8);
    fragColor = highlightColor;

#ifndef ENABLE_ES3
    gl_FragColor = fragColor;
#endif
}
`
);

/** Class representing a GL draw selected CAD surface shader.
 * @extends GLCADShader
 * @ignore
 */
class GLDrawSelectedCADSurfaceShader extends GLCADShader {
  /**
   * Create a GL draw selected CAD surface shader.
   * @param {any} gl - The gl value.
   */
  constructor(gl) {
    super(gl);

    this.__shaderStages['VERTEX_SHADER'] = GLDrawCADSurfaceShader_VERTEX_SHADER;

    this.__shaderStages['FRAGMENT_SHADER'] = FRAGMENT_SHADER$2;

    this.nonSelectable = true;
    this.finalize();
  }
}

zeaEngine.sgFactory.registerClass(
  'GLDrawSelectedCADSurfaceShader',
  GLDrawSelectedCADSurfaceShader
);

// import { GLLightmapper } from './GLLightmapper.js'


/** Class representing a GL CAD pass.
 * @extends GLPass
 * @ignore
 */
class GLCADPass extends zeaEngine.GLPass {
  /**
   * Create a GL CAD pass.
   */
  constructor(debugMode = false) {
    super();
    this.debugMode = debugMode;
    this.headLighting = false;
    this.displayWireframes = false;
    this.displayEdges = false;
    this.displayNormals = false;
    this.normalLength = 0.002; // 2cm
    this.debugTrimTex = false;
    this.debugSurfaceAtlas = false;
    this.debugAssetId =  0;

    // Lightmaps should not be considered a default feature. 
    // They still fail on some assets(due to the new fans)
    // anmd in many cases are not desirable. (e.g. construciton data)
    // Note: ENABLE_PBR is also disabled now by default.
    this.__enableLightmaps = false;
    this.__numHighlightedGeoms = 0;

    this.__geomDatas = [];
    this.__bodyDrawItems = [];
    this.__dirtyBodyDrawItemsIndices = [];
    // Note: fist id reserved for selectionOutlineID = 1
    // See 'draw()' below.
    this.__shaderCount = 2;
    this.__shaderKeys = {};
    this.__shaderOptsStack = [{}];

    this.__profiling = {
      numSurfaces: 0,
      numSurfaceInstances: 0,
      surfaceEvalTime: 0,
      numBodies: 0,
      numMaterials: 0,
      numTriangles: 0,
      numDrawSets: 0,
    };

  }

  /**
   * The init method.
   * @param {any} renderer - The renderer param.
   * @param {any} passIndex - The passIndex param.
   */
  init(renderer, passIndex) {
    super.init(renderer, passIndex);

    this.__dataLoadStartTime = performance.now();

    const gl = renderer.gl;

    const materialLibrary = new GLCADMaterialLibrary(gl);
    materialLibrary.updated.connect(this.updated.emit);

    const applyOptsToShader = shader => {
      if (shader.setPreprocessorValue) {
        // Initialise the shaders.
        const opts = this.getShaderState();
        for (const key in opts) shader.setPreprocessorValue(key);
        shader.applyOptions();
      }
      return shader
    };

    const evaluateSurfaceShaders = [
      new GLEvaluateSimpleCADSurfaceShader(gl),
      new GLEvaluateCompoundCADSurfaceShader(gl),
      new GLEvaluateNURBSCADSurfaceShader(gl),
    ];

    if (zeaEngine.SystemDesc.isIOSDevice) {
      throw new Error(
        'The ZeaCAD cannnot be supported on iOS due to no ability to render to a FLOAT framebuffer.'
      )
    }
    // We can support Safar now because of the ability to upload 8bit ints and convert them to 16bit floats in GLSL.
    const convertTo8BitTextures = zeaEngine.SystemDesc.browserName == 'Safari';


    // Note: The crappy browsers don't support GLSL binary caching, so
    // load times get quite long as we wait for the big shaders to compile.

    if (gl.name != 'webgl2') {
      this.setShaderPreprocessorValue(
        '#extension GL_OES_standard_derivatives : enable'
      );
    }

    if (this.debugMode) {
      this.setShaderPreprocessorValue('#define DEBUG_MODE');
    }

    this.setShaderPreprocessorValue('#define ENABLE_TRIMMING');
    this.setShaderPreprocessorValue('#define ENABLE_INLINE_GAMMACORRECTION');
    if (zeaEngine.SystemDesc.deviceCategory == 'High') ;

    this.__drawSelectedCADSurfaceShader = applyOptsToShader(
      new GLDrawSelectedCADSurfaceShader(gl)
    );
    this.__drawCADSurfaceNormalsShader = applyOptsToShader(
      new GLDrawCADSurfaceNormalsShader(gl)
    );
    this.__drawCADSurfaceGeomDataShader = applyOptsToShader(
      new GLDrawCADSurfaceGeomDataShader(gl)
    );
    this.__updateDrawItemsShader = applyOptsToShader(
      new GLEvaluateDrawItemsShader(gl)
    );

    this.__cadpassdata = {
      debugMode: this.debugMode,
      convertTo8BitTextures,
      assetCount: 0,
      materialLibrary,
      // enableLightmaps: this.__enableLightmaps,
      evaluateCurveShader: new GLEvaluateCADCurveShader(gl),
      evaluateSurfaceShaders: evaluateSurfaceShaders,
      trimCurveFansShader: new GLDrawTrimCurveFansShader(gl),
      flattenTrimSetsShader: new GLFlattenTrimSetsShader(gl),
      trimCurveStripsShader: new GLDrawTrimCurveStripsShader(gl),
      debugTrimSetsShader: new GLDebugTrimSetsShader(gl),
      updateDrawItemsShader: this.__updateDrawItemsShader,
      glplanegeom: new zeaEngine.GLMesh(
        gl,
        new zeaEngine.Plane(1.0, 1.0, 1, 1)
      ),
      maxTexSize: zeaEngine.SystemDesc.gpuDesc.maxTextureSize,

      incHighlightedCount: this.incHighlightedCount.bind(this),
      decHighlightedCount: this.decHighlightedCount.bind(this),

      genShaderID: shaderName => {
        if (!(shaderName in this.__shaderKeys)) {
          const shaderClass = zeaEngine.sgFactory.getClass(shaderName);
          if (!shaderClass || !shaderClass.getPackedMaterialData) {
            return this.__cadpassdata.genShaderID('GLDrawCADSurfaceShader')
          }
          const shader = applyOptsToShader(
            zeaEngine.sgFactory.constructClass(shaderName, gl)
          );

          const id = this.__shaderCount;
          this.__shaderKeys[shaderName] = {
            id,
            shader,
          };
          this.__shaderCount++;
          return id
        }
        return this.__shaderKeys[shaderName].id
      },
    };

    // Force the default shader to be setup first.
    this.__cadpassdata.genShaderID('GLDrawCADSurfaceShader');

    this.__assets = [];
    this.__assetDatas = [];
    this.__loadQueue = 0;

    this.__decrementLoadQueue = () => {
      this.__loadQueue--;
      if (this.__loadQueue == 0) {
        console.log('===All Assets Loaded===');
        console.log(
          'Total Load Time:' +
            (performance.now() - this.__gpuLoadStartTime) / 1000
        );
        this.__profiling.numTriangles = this.__profiling.numTriangles / 1000000;
        console.log(this.__profiling);

        if (this.__lightmapper && this.__enableLightmaps) {
          const scene = this.__renderer.getScene();
          this.__lightmapper.computeLightmaps(scene.getRoot().getBoundingBox());
        } else {
          this.updated.emit();
        }
      }
    };

    // this.__lightmapper = new GLLightmapper(
    //   gl,
    //   this.drawScene.bind(this),
    //   this.clearLightmaps.bind(this),
    //   this.renderToLightmaps.bind(this),
    //   this.updated.emit,
    //   this.__cadpassdata
    // )

    // this.__renderer.envMapAssigned.connect(glEnvMap => {
    //   this.__loadQueue++
    //   glEnvMap.loaded.connect(() => {
    //     this.__lightmapper.setGLEnvMap(glEnvMap)
    //     this.__decrementLoadQueue()
    //   })
    // })

    // this.__worker = new GLCADPassWorker();
    // this.__worker.onmessage = event => {
    //   this.__onWorkerMessage(event.data); // loading done...
    // };

    this.__renderer.registerPass(
      (treeItem, rargs) => {
        if (treeItem instanceof CADAsset) {
          const cadAsset = treeItem;
          this.__loadQueue++;
          this.__cadpassdata.assetCount++;

          if (cadAsset.loaded.isToggled()) {
            if (cadAsset.getNumBodyItems() > 0) {
              this.addCADAsset(cadAsset);
            } else {
              this.__decrementLoadQueue();
            }
          } else {
            cadAsset.loaded.connect(() => {
              if (cadAsset.getNumBodyItems() > 0) this.addCADAsset(cadAsset);
              else {
                this.__decrementLoadQueue();
              }
            });
          }
          rargs.continueInSubTree = true;
          return true
        }
        return false
      },
      treeItem => {
        if (treeItem instanceof CADAsset) {
          this.removeCADAsset(treeItem);
          return true
        }
        return false
      }
    );

    // collector.registerSceneItemFilter((treeItem, rargs) => {
    //   if (treeItem instanceof CADAsset) {
    //     this.__loadQueue++;
    //     const cadAsset = treeItem;
    //     cadAsset.loaded.connect(() => {
    //       this.addCADAsset(treeItem);
    //     });
    //     rargs.continueInSubTree = true;
    //     return true;
    //   }
    // });
  }

  /**
   * The enableLightmaps method.
   * @param {any} state - The state param.
  enableLightmaps(state) {
    if (this.__enableLightmaps == state) return

    this.__enableLightmaps = state
    if (this.__cadpassdata)
      this.__cadpassdata.enableLightmaps = this.__enableLightmaps
    if (this.__enableLightmaps) {
      this.setShaderPreprocessorValue('#define ENABLE_CAD_LIGHTMAPS')
    } else {
      this.clearShaderPreprocessorValue('#define ENABLE_CAD_LIGHTMAPS')
    }
    if (this.__loadQueue == 0) {
      if (this.__lightmapper && this.__enableLightmaps) {
        const scene = this.__renderer.getScene()
        this.__lightmapper.computeLightmaps(scene.getRoot().getBoundingBox())
      } else {
        this.updated.emit()
      }
    }
  }
   */

  /**
   * The enableShadows method.
  enableShadows() {
    this.enableLightmaps(true)
  }
   */

  /**
   * The disableShadows method.
  disableShadows() {
    this.enableLightmaps(false)
  }
   */

  /**
   * The getShaderPreprocessorValue method.
   * @param {any} name - The name param.
   * @return {any} - The return value.
   */
  getShaderPreprocessorValue(name) {
    return this.getShaderState()[name]
  }

  /**
   * The setShaderPreprocessorValue method.
   * @param {any} name - The name param.
   * @param {boolean} apply - The apply param.
   */
  setShaderPreprocessorValue(name, apply = true) {
    if (!name.startsWith('#')) name = '#define ' + name;

    this.getShaderState()[name] = name;

    // Now update any shaders already consturcted.
    for (const shaderKey in this.__shaderKeys) {
      const shaderReg = this.__shaderKeys[shaderKey];
      if (shaderReg.shader.setPreprocessorValue) {
        shaderReg.shader.setPreprocessorValue(name);
        if (apply) shaderReg.shader.applyOptions();
      }
    }

    if (this.__drawSelectedCADSurfaceShader) {
      this.__drawSelectedCADSurfaceShader.setPreprocessorValue(name);
      if (apply) this.__drawSelectedCADSurfaceShader.applyOptions();
    }
    if (this.__drawCADSurfaceGeomDataShader) {
      this.__drawCADSurfaceGeomDataShader.setPreprocessorValue(name);
      if (apply) this.__drawCADSurfaceGeomDataShader.applyOptions();
    }
    if (this.__updateDrawItemsShader) {
      this.__updateDrawItemsShader.setPreprocessorValue(name);
      if (apply) this.__updateDrawItemsShader.applyOptions();
    }
    if (this.__renderer)
      this.__renderer.requestRedraw();
  }

  /**
   * The clearShaderPreprocessorValue method.
   * @param {any} name - The name param.
   * @param {boolean} apply - The apply param.
   */
  clearShaderPreprocessorValue(name, apply = true) {
    delete this.getShaderState()[name];

    // Now update any shaders already consturcted.
    for (const shaderKey in this.__shaderKeys) {
      const shaderReg = this.__shaderKeys[shaderKey];
      if (shaderReg.shader.clearPreprocessorValue) {
        shaderReg.shader.clearPreprocessorValue(name);
        if (apply) shaderReg.shader.applyOptions();
      }
    }
    if (this.__renderer)
      this.__renderer.requestRedraw();
  }

  /**
   * The getShaderState method.
   * @return {any} - The return value.
   */
  getShaderState() {
    return this.__shaderOptsStack[this.__shaderOptsStack.length - 1]
  }

  /**
   * The pushShaderState method.
   */
  pushShaderState() {
    this.__shaderOptsStack.push(Object.assign({}, this.getShaderState()));
    for (const shaderKey in this.__shaderKeys) {
      const shaderReg = this.__shaderKeys[shaderKey];
      if (shaderReg.shader.pushState) {
        shaderReg.shader.pushState();
      }
    }
  }

  /**
   * The popShaderState method.
   */
  popShaderState() {
    this.__shaderOptsStack.pop();
    for (const shaderKey in this.__shaderKeys) {
      const shaderReg = this.__shaderKeys[shaderKey];
      if (shaderReg.shader.popState) shaderReg.shader.popState();
    }
  }

  /**
   * The startPresenting method.
   */
  startPresenting() {
    if (zeaEngine.SystemDesc.deviceCategory != 'High') {
      this.pushShaderState();
      // this.clearShaderPreprocessorValue('#define ENABLE_PBR');
    }
  }

  /**
   * The stopPresenting method.
   */
  stopPresenting() {
    if (zeaEngine.SystemDesc.deviceCategory != 'High') {
      this.popShaderState();
    }
  }

  /**
   * The getCutPlaneNormalParam method.
   * @return {any} - The return value.
   */
  getCutPlaneNormalParam() {
    return this.__cutPlaneNormalParam
  }

  /**
   * The getCutPlaneDistParam method.
   * @return {any} - The return value.
   */
  getCutPlaneDistParam() {
    return this.__cutDistParam
  }

  /**
   * The getCutPlaneColorParam method.
   * @return {any} - The return value.
   */
  getCutPlaneColorParam() {
    return this.__cutPlaneColorParam
  }

  /**
   * The incHighlightedCount method.
   * @param {any} count - The count param.
   */
  incHighlightedCount(count) {
    this.__numHighlightedGeoms += count;
  }

  /**
   * The decHighlightedCount method.
   * @param {any} count - The count param.
   */
  decHighlightedCount(count) {
    this.__numHighlightedGeoms -= count;
  }

  /**
   * The addCADAsset method is an internal method called when new CADAsset
   * items are discovered in the tree.
   * @param {CADAsset} cadAsset - The cadAsset tree item.
   */
  addCADAsset(cadAsset) {
    this.__gl.finish();
    const assetId = this.__assets.length;

    if (assetId == 0) {
      this.__gpuLoadStartTime = performance.now();
    }

    if (cadAsset.getVersion().greaterThan([0, 0, 26])) {
      this.setShaderPreprocessorValue('#define INTS_PACKED_AS_2FLOAT16');
    }
    if (cadAsset.getVersion().greaterOrEqualThan([0, 0, 29])) {
      this.setShaderPreprocessorValue('#define ENABLE_PER_FACE_COLORS');
    }

    const glcadAsset = new GLCADAsset(
      this.__gl,
      assetId,
      cadAsset,
      this.__cadpassdata
    );

    glcadAsset.loaded.connect(assetStats => {
      this.__profiling.numSurfaces += assetStats.numSurfaces;
      this.__profiling.numSurfaceInstances += assetStats.numSurfaceInstances;
      this.__profiling.surfaceEvalTime += assetStats.surfaceEvalTime;
      this.__profiling.numBodies += assetStats.numBodies;
      this.__profiling.numMaterials += assetStats.numMaterials;
      this.__profiling.numTriangles += assetStats.numTriangles;
      this.__profiling.numDrawSets += assetStats.numDrawSets;

      this.__decrementLoadQueue();
    });
    // glcadAsset.assetVisibilityChanged.connect(() => {
    //   if (
    //     this.__loadQueue == 0 &&
    //     this.__lightmapper &&
    //     this.__enableLightmaps
    //   ) {
    //     // Note: visibility changes also cause rendering.
    //     // We get a context loss sometimes if the lightmapper kicks in
    //     // immedietly.
    //     setTimeout(() => {
    //       const scene = this.__renderer.getScene()
    //       this.__lightmapper.computeLightmaps(scene.getRoot().getBoundingBox())
    //     }, 100)
    //     this.updated.emit()
    //   }
    // })

    glcadAsset.updated.connect(this.updated.emit);

    this.__assets.push(glcadAsset);
  }

  /**
   * The removeCADAsset method.
   * @param {number} index - The index of the cadAsset to retrieve.
   */
  removeCADAsset(asset) {
    this.__assets = this.__assets.filter(glcadAsset => {
      if (glcadAsset.getCADAsset() == asset) {
        glcadAsset.destroy();
        return false
      }
      return true
    });
    this.updated.emit();
  }

  /**
   * The getGLCADAsset method.
   * @param {number} index - The index of the cadAsset to retrieve.
   */
  getGLCADAsset(index) {
    return this.__assets[index]
  }

  /**
   * The __updateViewXfo method.
   * @param {any} viewXfo - The viewXfo param.
   * @private
   */
  __updateViewXfo(viewXfo) {
    const viewDir = viewXfo.ori.getZaxis().negate();
    const moved = viewXfo.tr.subtract(this.__prevViewXfo.tr);
    this.__moveThreshold = 0.2; // 20cm
    const movedDist = moved.length();
    if (movedDist > this.__moveThreshold) {
      const viewDirJSON = viewDir.toJSON();
      const movedJSON = moved.toJSON();

      const eachAssembly = glcadAsset => {
        glcadAsset.onViewChanged(
          cameraXfoJSON,
          viewDirJSON,
          movedJSON,
          movedDist
        );
      };
      this.__assets.forEach(eachAssembly);
      this.__prevViewXfo = cameraXfo;
    }
  }

  /**
   * The drawScene method.
   * Note: this function is called by the lightmapper.
   * Only the basic scene data is bound here.
   * @param {any} renderstate - The renderstate param.
   */
  drawScene(renderstate) {
    for (const shaderKey in this.__shaderKeys) {
      renderstate.shaderId = this.__shaderKeys[shaderKey].id;
      for (const asset of this.__assets) {
        asset.draw(renderstate);
      }
    }
  }

  /**
   * The clearLightmaps method.
   * @param {any} channel - The channel param.
   */
  clearLightmaps(channel) {
    for (const asset of this.__assets) {
      asset.clearLightmap(channel);
    }
  }

  /**
   * The renderToLightmaps method.
   * @param {any} renderstate - The renderstate param.
   */
  renderToLightmaps(renderstate) {
    for (const asset of this.__assets) {
      asset.renderToLightmap(renderstate);
    }
  }

  /**
   * The draw method.
   * @param {any} renderstate - The renderstate param.
   * @return {any} - The return value.
   */
  draw(renderstate) {
    const gl = this.__gl;

    // Note: we will bind to the camera so we can support dynamic LOD.
    // this.__updateViewXfo(renderstate.viewXfo)

    if (this.debugTrimTex) {
      if (this.__assets.length > this.debugAssetId)
        this.__assets[this.debugAssetId].drawTrimSets(renderstate);
    }
    if (this.debugSurfaceAtlas) {
      if (this.__assets.length > this.debugAssetId)
        this.__assets[this.debugAssetId].drawSurfaceAtlas(renderstate);
      return
    }

    if (this.__cadpassdata.materialLibrary.needsUpload())
      this.__cadpassdata.materialLibrary.uploadMaterials();

    for (const shaderKey in this.__shaderKeys) {
      const shaderReg = this.__shaderKeys[shaderKey];
      shaderReg.shader.bind(renderstate);
      renderstate.shaderId = shaderReg.id;

      if (!this.__cadpassdata.materialLibrary.bind(renderstate)) {
        return false
      }

      if (this.__lightmapper) {
        this.__lightmapper.bind(renderstate);
      }

      if (renderstate.unifs.headLighting) {
        gl.uniform1i(
          renderstate.unifs.headLighting.location,
          this.headLighting
        );
      }
      if (renderstate.unifs.displayWireframes) {
        gl.uniform1i(
          renderstate.unifs.displayWireframes.location,
          this.displayWireframes
        );
      }
      if (renderstate.unifs.displayEdges)
        gl.uniform1i(renderstate.unifs.displayEdges.location, this.displayEdges);

      for (const asset of this.__assets) {
        asset.draw(renderstate);
      }

      shaderReg.shader.unbind(renderstate);
    }

    if (this.displayNormals) {
      if (!this.__drawCADSurfaceNormalsShader.bind(renderstate)) return false

      gl.uniform1f(renderstate.unifs.normalLength.location, this.normalLength);
      for (const asset of this.__assets) {
        asset.drawNormals(
          renderstate,
          this.__shaderKeys.GLDrawCADSurfaceShader.id
        );
      }
    }

    // this.drawHighlightedGeoms(renderstate);
  }

  /**
   * The drawHighlightedGeoms method.
   * @param {any} renderstate - The renderstate param.
   * @return {any} - The return value.
   */
  drawHighlightedGeoms(renderstate) {
    if (this.__numHighlightedGeoms == 0) return false
    if (
      !this.__drawSelectedCADSurfaceShader ||
      !this.__drawSelectedCADSurfaceShader.bind(renderstate)
    )
      return false

    const gl = this.__gl;
    gl.disable(gl.DEPTH_TEST);

    for (const asset of this.__assets) {
      asset.drawHighlightedGeoms(renderstate);
    }

    gl.enable(gl.DEPTH_TEST);
  }

  /**
   * The drawGeomData method.
   * @param {any} renderstate - The renderstate param.
   * @return {any} - The return value.
   */
  drawGeomData(renderstate) {
    const gl = this.__gl;
    gl.disable(gl.BLEND);
    gl.disable(gl.CULL_FACE);
    gl.enable(gl.DEPTH_TEST);
    gl.depthFunc(gl.LESS);
    gl.depthMask(true);

    if (
      !this.__drawCADSurfaceGeomDataShader ||
      !this.__drawCADSurfaceGeomDataShader.bind(renderstate)
    )
      return false

    const passIndexUnif = renderstate.unifs.passIndex;
    if (passIndexUnif) {
      gl.uniform1i(passIndexUnif.location, this.__passIndex);
    }

    for (const shaderKey in this.__shaderKeys) {
      const shaderReg = this.__shaderKeys[shaderKey];
      if (shaderReg.shader.nonSelectable) continue

      renderstate.shaderId = this.__shaderKeys[shaderKey].id;
      for (const asset of this.__assets) {
        asset.drawGeomData(renderstate);
      }
    }
  }

  /**
   * The getGeomItemAndDist method.
   * @param {any} geomData - The geomData param.
   * @return {any} - The return value.
   */
  getGeomItemAndDist(geomData) {
    const assetId = Math.round(geomData[0] / 64);
    const geomId = Math.round(geomData[1]);
    const dist = geomData[3];
    const geomItem = this.__assets[assetId].getGeomItem(geomId);

    // console.log(this.__assets[assetId].getSurfaceData(geomId))

    return {
      geomItem,
      dist,
    }
  }
}

const FRAGMENT_SHADER$3 = zeaEngine.shaderLibrary.parseShader(
  'GLDrawCADSurfaceDropShadowShader.fragmentShader',
  `
precision highp float;

<%include file="math/constants.glsl"/>
<%include file="GLSLUtils.glsl"/>
<%include file="stack-gl/gamma.glsl"/>
<%include file="GLSLCADConstants.glsl"/>

#ifdef ENABLE_INLINE_GAMMACORRECTION
uniform float exposure;
#endif


#ifndef ENABLE_ES3
varying vec2 v_drawCoords;
varying vec3 v_viewPos;
varying vec3 v_worldPos;
varying vec3 v_viewNormal;
varying vec2 v_textureCoord;
varying vec2 v_vertexCoords;
#else
in vec2 v_drawCoords;
in vec3 v_viewPos;
in vec3 v_worldPos;
in vec3 v_viewNormal;
in vec2 v_textureCoord;
in vec2 v_vertexCoords;
#endif

<%include file="GLSLCADSurfaceDrawing.fragmentShader.glsl"/>


float luminanceFromRGB(vec3 color) {
    return 0.2126 * color.r + 0.7152 * color.g + 0.0722 * color.b;
}

float remap(float value, float start1, float end1, float start2, float end2) {
  return start2 + (value - start1) * (end2 - start2) / (end1 - start1);
}

#ifdef ENABLE_ES3
out vec4 fragColor;
#endif

void main(void) {

#ifndef ENABLE_ES3
    vec4 fragColor;
#endif

    ///////////////////////////////////////////
    // Lightmaps
#ifdef ENABLE_CAD_LIGHTMAPS

    vec4 lightmapPatchCoords = getDrawItemData(4);
    vec3 lightmapValue = vec3(1.0);
    vec4 lightmapSample = sampleLightmaps(lightmapPatchCoords);
    // vec4 lightmapSample = sampleLightmap(lightmapAtlasTexture, lightmapPatchCoords);
    if(lightmapSample.a > 0.0) {
        lightmapValue = lightmapSample.rgb / lightmapSample.a;
        vec4 materialCoords = getDrawItemData(1);
        vec4 matValue0 = getMaterialValue(materialCoords.xy, 0);
        float remapMin = matValue0.r;
        float remapMax = matValue0.g;
        float borderSize = matValue0.b;

        // Mix from fully illumnated(no shadow) to shadowed...
        vec3 irradiance = mix(vec3(1.0), lightmapValue, lightmapWeight);

        float shadow = remap(luminanceFromRGB(irradiance), remapMin, remapMax, 0.0, 1.0);

        // Create a circular mask.
        // The value ranges from 0.0 at the edge of the circular region
        // and goes to 1.0 at the center of the quad.
        float distToCenter = length(abs(v_textureCoord - 0.5) * 2.0);

        float centerSize = 1.0 - borderSize;
        if(distToCenter > centerSize) {
          shadow = mix(shadow, 1.0, smoothstep(0.0, 1.0, (distToCenter - centerSize) / borderSize));
        }

        fragColor.rgb = vec3(shadow);
        fragColor.a = 1.0;
    }
    else {
      discard;
      return;
    }

#else
  discard;
  return;
#endif


#ifdef ENABLE_INLINE_GAMMACORRECTION
    fragColor.rgb = toGamma(fragColor.rgb * exposure);
#endif

#ifndef ENABLE_ES3
    gl_FragColor = fragColor;
#endif
}
`
);

/** Class representing a GL draw CAD surface drop shadow shader.
 * @extends GLCADShader
 * @ignore
 */
class GLDrawCADSurfaceDropShadowShader extends GLCADShader {
  /**
   * Create a GL draw CAD surface drop shadow shader.
   * @param {any} gl - The gl value.
   */
  constructor(gl) {
    super(gl);

    this.__shaderStages['VERTEX_SHADER'] = GLDrawCADSurfaceShader_VERTEX_SHADER;

    this.__shaderStages['FRAGMENT_SHADER'] = FRAGMENT_SHADER$3;

    this.nonSelectable = true;
    this.finalize();
  }

  /**
   * The bind method.
   * @param {any} renderstate - The renderstate param.
   * @param {any} key - The key param.
   */
  bind(renderstate, key) {
    super.bind(renderstate, key);
    const gl = this.__gl;

    gl.enable(gl.BLEND);
    gl.blendEquation(gl.FUNC_ADD);
    gl.blendFunc(gl.DST_COLOR, gl.ZERO); // For multiply, select this.
  }

  /**
   * The unbind method.
   * @param {any} renderstate - The renderstate param.
   * @return {boolean} - The return value.
   */
  unbind(renderstate) {
    const gl = this.__gl;
    gl.disable(gl.BLEND);
    return true
  }

  /**
   * The getParamDeclarations method.
   * @return {any} - The return value.
   */
  static getParamDeclarations() {
    const paramDescs = super.getParamDeclarations();
    paramDescs.push({ name: 'Remap', defaultValue: new zeaEngine.Vec2(0, 1) });
    paramDescs.push({ name: 'BorderSize', defaultValue: 0.35 });
    return paramDescs
  }

  /**
   * The getPackedMaterialData method.
   * @param {any} material - The material param.
   * @return {any} - The return value.
   */
  static getPackedMaterialData(material) {
    const matData = new Float32Array(8);
    const remap = material.getParameter('Remap').getValue();
    matData[0] = remap.x;
    matData[1] = remap.y;
    matData[2] = material.getParameter('BorderSize').getValue();
    return matData
  }
}

zeaEngine.sgFactory.registerClass(
  'GLDrawCADSurfaceDropShadowShader',
  GLDrawCADSurfaceDropShadowShader
);

exports.BODY_FLAG_CUTAWAY = BODY_FLAG_CUTAWAY;
exports.BODY_FLAG_INVISIBLE = BODY_FLAG_INVISIBLE;
exports.CADAssembly = CADAssembly;
exports.CADAsset = CADAsset;
exports.CADBody = CADBody;
exports.CADCurveTypes = CADCurveTypes;
exports.CADSurfaceLibrary = CADSurfaceLibrary;
exports.CADSurfaceTypes = CADSurfaceTypes;
exports.CURVE_FLAG_COST_IS_DETAIL = CURVE_FLAG_COST_IS_DETAIL;
exports.GLCADPass = GLCADPass;
exports.GLDrawCADSurfaceDropShadowShader = GLDrawCADSurfaceDropShadowShader;
exports.GLDrawCADSurfaceShader = GLDrawCADSurfaceShader;
exports.GLDrawCADSurfaceShader_FRAGMENT_SHADER = GLDrawCADSurfaceShader_FRAGMENT_SHADER;
exports.GLDrawCADSurfaceShader_VERTEX_SHADER = GLDrawCADSurfaceShader_VERTEX_SHADER;
exports.SURFACE_FLAG_COST_IS_DETAIL_U = SURFACE_FLAG_COST_IS_DETAIL_U;
exports.SURFACE_FLAG_COST_IS_DETAIL_V = SURFACE_FLAG_COST_IS_DETAIL_V;
exports.SURFACE_FLAG_FLIPPED_NORMAL = SURFACE_FLAG_FLIPPED_NORMAL;
exports.SURFACE_FLAG_FLIPPED_UV = SURFACE_FLAG_FLIPPED_UV;
exports.SURFACE_FLAG_PERIODIC_U = SURFACE_FLAG_PERIODIC_U;
exports.SURFACE_FLAG_PERIODIC_V = SURFACE_FLAG_PERIODIC_V;
exports.bodyItemCoordsStride = bodyItemCoordsStride;
exports.floatsPerSceneBody = floatsPerSceneBody;
exports.geomLibraryHeaderSize = geomLibraryHeaderSize;
exports.getCurveTypeName = getCurveTypeName;
exports.getSurfaceTypeName = getSurfaceTypeName;
exports.pixelsPerDrawItem = pixelsPerDrawItem;
exports.valuesPerCurveLibraryLayoutItem = valuesPerCurveLibraryLayoutItem;
exports.valuesPerCurveTocItem = valuesPerCurveTocItem;
exports.valuesPerSurfaceLibraryLayoutItem = valuesPerSurfaceLibraryLayoutItem;
exports.valuesPerSurfaceTocItem = valuesPerSurfaceTocItem;
