import { EventEmitter, TreeItem, Ray, Parameter, sgFactory, StandardSurfaceGeomDataShader, shaderLibrary, GLShader, Color, Material, Cylinder, Cone, GeomItem, Xfo, Vec3 as Vec3$1, NumberParameter, Torus, Cuboid, Sphere, Operator, OperatorInput, OperatorOutput, Group, ColorParameter, BaseItem, ParameterOwner, Vec2, SystemDesc, Quat, Rect, Plane, DataImage, Lines, Cross, Circle, BooleanParameter, MathFunctions } from '@zeainc/zea-engine';

const __changeClasses = {};
const __classNames = {};
const __classes = [];

/** Class representing an undo redo manager. */
class UndoRedoManager extends EventEmitter {
  /**
   * Create an undo redo manager.
   */
  constructor() {
    super();
    this.__undoStack = [];
    this.__redoStack = [];
    this.__currChange = null;

    this.__currChangeUpdated = this.__currChangeUpdated.bind(this);
  }

  /**
   * The flush method.
   */
  flush() {
    for (const change of this.__undoStack) change.destroy();
    this.__undoStack = [];
    for (const change of this.__redoStack) change.destroy();
    this.__redoStack = [];
    if (this.__currChange) {
      this.__currChange.off('updated', this.__currChangeUpdated);
      this.__currChange = null;
    }
  }

  /**
   * The addChange method.
   * @param {any} change - The change param.
   */
  addChange(change) {
    // console.log("AddChange:", change.name)
    if (this.__currChange) {
      this.__currChange.off('updated', this.__currChangeUpdated);
    }

    this.__undoStack.push(change);
    this.__currChange = change;
    this.__currChange.on('updated', this.__currChangeUpdated);

    for (const change of this.__redoStack) change.destroy();
    this.__redoStack = [];

    this.emit('changeAdded', { change });
  }

  /**
   * The getCurrentChange method.
   * @return {any} The return value.
   */
  getCurrentChange() {
    return this.__currChange
  }

  // eslint-disable-next-line require-jsdoc
  __currChangeUpdated(updateData) {
    this.emit('changeUpdated', updateData);
  }

  /**
   * The undo method.
   * @param {boolean} pushOnRedoStack - The pushOnRedoStack param.
   */
  undo(pushOnRedoStack = true) {
    if (this.__undoStack.length > 0) {
      if (this.__currChange) {
        this.__currChange.off('updated', this.__currChangeUpdated);
        this.__currChange = null;
      }

      const change = this.__undoStack.pop();
      // console.log("undo:", change.name)
      change.undo();
      if (pushOnRedoStack) {
        this.__redoStack.push(change);
        this.emit('changeUndone');
      }
    }
  }

  /**
   * The redo method.
   */
  redo() {
    if (this.__redoStack.length > 0) {
      const change = this.__redoStack.pop();
      // console.log("redo:", change.name)
      change.redo();
      this.__undoStack.push(change);
      this.emit('changeRedone');
    }
  }

  // //////////////////////////////////
  // User Synchronization

  /**
   * The constructChange method.
   * @param {string} className - The className param.
   * @return {any} The return value.
   */
  constructChange(className) {
    return new __changeClasses[className]()
  }

  /**
   * The isChangeClassRegistered method.
   * @param {object} inst - The instance of the Change class.
   * @return {boolean} Returns 'true' if the class has been registered.
   */
  static isChangeClassRegistered(inst) {
    const id = __classes.indexOf(inst.constructor);
    return id != -1
  }

  /**
   * The getChangeClassName method.
   * @param {object} inst - The instance of the Change class.
   * @return {any} The return value.
   */
  static getChangeClassName(inst) {
    const id = __classes.indexOf(inst.constructor);
    if (__classNames[id]) return __classNames[id]
    console.warn('Change not registered:', inst.constructor.name);
    return ''
  }

  /**
   * The registerChange method.
   * @param {any} name - The name param.
   * @param {any} cls - The cls param.
   */
  static registerChange(name, cls) {
    if (__classes.indexOf(cls) != -1)
      console.warn("Class already registered:", name);

    const id = __classes.length;
    __classes.push(cls);
    __changeClasses[name] = cls;
    __classNames[id] = name;
  }
}

/** Class representing a change. */
class Change extends EventEmitter {
  /**
   * Create a change.
   * @param {any} name - The name value.
   */
  constructor(name) {
    super();
    this.name = name ? name : UndoRedoManager.getChangeClassName(this);
  }

  /**
   * The undo method.
   */
  undo() {
    throw new Error('Implement me')
  }

  /**
   * The redo method.
   */
  redo() {
    throw new Error('Implement me')
  }

  /**
   * The update method.
   * @param {any} updateData - The updateData param.
   */
  update(updateData) {
    throw new Error('Implement me')
  }

  /**
   * The toJSON method.
   * @param {any} context - The appData param.
   * @return {any} The return value.
   */
  toJSON(context) {
    return {}
  }

  /**
   * The fromJSON method.
   * @param {any} j - The j param.
   * @param {any} context - The context param.
   */
  fromJSON(j, context) {}

  /**
   * The changeFromJSON method.
   * @param {any} j - The j param.
   */
  changeFromJSON(j) {
    // Many change objects can load json directly
    // in the update method.
    this.update(j);
  }

  /**
   * The destroy method.
   */
  destroy() {}
}

// A Handle is a UI widget that lives in the scene.
// Much like a slider, it translates a series of
// mouse events into a higher level interaction.

/** Class representing a scene widget.
 * @extends TreeItem
 */
class Handle extends TreeItem {
  /**
   * Create a scene widget.
   * @param {any} name - The name value.
   */
  constructor(name) {
    super(name);

    this.captured = false;
  }

  /**
   * The highlight method.
   */
  highlight() {}

  /**
   * The unhighlight method.
   */
  unhighlight() {}

  /**
   * The getManipulationPlane method.
   * @return {any} The return value.
   */
  getManipulationPlane() {
    const xfo = this.getParameter('GlobalXfo').getValue();
    return new Ray(xfo.tr, xfo.ori.getZaxis())
  }

  // ///////////////////////////////////
  // Mouse events

  /**
   * The onMouseEnter method.
   * @param {any} event - The event param.
   * @return {any} The return value.
   */
  onMouseEnter(event) {
    this.highlight();
  }

  /**
   * The onMouseLeave method.
   * @param {any} event - The event param.
   * @return {any} The return value.
   */
  onMouseLeave(event) {
    this.unhighlight();
  }

  /**
   * The onMouseDown method.
   * @param {any} event - The event param.
   * @return {any} The return value.
   */
  onMouseDown(event) {
    event.setCapture(this);
    event.stopPropagation();
    this.captured = true;
    if (event.viewport) this.handleMouseDown(event);
    else if (event.vrviewport) this.onVRControllerButtonDown(event);
  }

  /**
   * The onMouseMove method.
   * @param {any} event - The event param.
   * @return {any} The return value.
   */
  onMouseMove(event) {
    if (this.captured) {
      event.stopPropagation();
      if (event.viewport) this.handleMouseMove(event);
      else if (event.vrviewport) this.onVRPoseChanged(event);
    }
  }

  /**
   * The onMouseUp method.
   * @param {any} event - The event param.
   * @return {any} The return value.
   */
  onMouseUp(event) {
    if (this.captured) {
      event.releaseCapture();
      event.stopPropagation();
      this.captured = false;
      if (event.viewport) this.handleMouseUp(event);
      else if (event.vrviewport) this.onVRControllerButtonUp(event);
    }
  }

  /**
   * The onWheel method.
   * @param {any} event - The event param.
   */
  onWheel(event) {}

  /**
   * The handleMouseDown method.
   * @param {any} event - The event param.
   * @return {any} The return value.
   */
  handleMouseDown(event) {
    this.gizmoRay = this.getManipulationPlane();
    const dist = event.mouseRay.intersectRayPlane(this.gizmoRay);
    event.grabPos = event.mouseRay.pointAtDist(dist);
    this.onDragStart(event);
    return true
  }

  /**
   * The handleMouseMove method.
   * @param {any} event - The event param.
   */
  handleMouseMove(event) {
    const dist = event.mouseRay.intersectRayPlane(this.gizmoRay);
    event.holdPos = event.mouseRay.pointAtDist(dist);
    this.onDrag(event);
    return true
  }

  /**
   * The handleMouseUp method.
   * @param {any} event - The event param.
   * @return {any} The return value.
   */
  handleMouseUp(event) {
    const dist = event.mouseRay.intersectRayPlane(this.gizmoRay);
    event.releasePos = event.mouseRay.pointAtDist(dist);
    this.onDragEnd(event);
    return true
  }

  // ///////////////////////////////////
  // VRController events

  /**
   * The onVRControllerButtonDown method.
   * @param {any} event - The event param.
   * @return {any} The return value.
   */
  onVRControllerButtonDown(event) {
    this.activeController = event.controller;
    const xfo = this.activeController.getTipXfo().clone();

    const gizmoRay = this.getManipulationPlane();
    const offset = xfo.tr.subtract(gizmoRay.start);
    const grabPos = xfo.tr.subtract(
      gizmoRay.dir.scale(offset.dot(gizmoRay.dir))
    );
    event.grabPos = grabPos;
    this.onDragStart(event);
    return true
  }

  /**
   * The onVRPoseChanged method.
   * @param {any} event - The event param.
   * @return {any} The return value.
   */
  onVRPoseChanged(event) {
    if (this.activeController) {
      const xfo = this.activeController.getTipXfo();
      const gizmoRay = this.getManipulationPlane();
      const offset = xfo.tr.subtract(gizmoRay.start);
      const holdPos = xfo.tr.subtract(
        gizmoRay.dir.scale(offset.dot(gizmoRay.dir))
      );
      event.holdPos = holdPos;
      this.onDrag(event);
      return true
    }
  }

  /**
   * The onVRControllerButtonUp method.
   * @param {any} event - The event param.
   * @return {any} The return value.
   */
  onVRControllerButtonUp(event) {
    if (this.activeController == event.controller) {
      const xfo = this.activeController.getTipXfo();
      this.onDragEnd(event, xfo.tr);
      this.activeController = undefined;
      return true
    }
  }

  // ///////////////////////////////////
  // Interaction events

  /**
   * The onDragStart method.
   * @param {any} event - The event param.
   */
  onDragStart(event) {
    console.log('onDragStart', event);
  }

  /**
   * The onDrag method.
   * @param {any} event - The event param.
   */
  onDrag(event) {
    console.log('onDrag', event);
  }

  /**
   * The onDragEnd method.
   * @param {any} event - The event param.
   */
  onDragEnd(event) {
    console.log('onDragEnd', event);
  }
}

/**
 * Class representing a base linear movement scene widget.
 * @extends Handle
 */
class BaseLinearMovementHandle extends Handle {
  /**
   * Create base linear movement scene widget.
   * @param {any} name - The name value.
   */
  constructor(name) {
    super(name);
  }

  // ///////////////////////////////////
  // Mouse events

  /**
   * The handleMouseDown method.
   * @param {any} event - The event param.
   * @return {any} The return value.
   */
  handleMouseDown(event) {
    this.gizmoRay = this.getManipulationPlane();
    this.grabDist = event.mouseRay.intersectRayVector(this.gizmoRay)[1];
    const grabPos = this.gizmoRay.pointAtDist(this.grabDist);
    event.grabDist = this.grabDist;
    event.grabPos = grabPos;
    this.onDragStart(event);
    return true
  }

  /**
   * The handleMouseMove method.
   * @param {any} event - The event param.
   */
  handleMouseMove(event) {
    const dist = event.mouseRay.intersectRayVector(this.gizmoRay)[1];
    const holdPos = this.gizmoRay.pointAtDist(dist);
    event.holdDist = dist;
    event.holdPos = holdPos;
    event.value = dist;
    event.delta = dist - this.grabDist;
    this.onDrag(event);
  }

  /**
   * The handleMouseUp method.
   * @param {any} event - The event param.
   * @return {any} The return value.
   */
  handleMouseUp(event) {
    const dist = event.mouseRay.intersectRayVector(this.gizmoRay)[1];
    const releasePos = this.gizmoRay.pointAtDist(dist);
    event.releasePos = releasePos;
    this.onDragEnd(event);
    return true
  }

  // ///////////////////////////////////
  // VRController events

  /**
   * The onVRControllerButtonDown method.
   * @param {any} event - The event param.
   * @return {any} The return value.
   */
  onVRControllerButtonDown(event) {
    this.gizmoRay = this.getManipulationPlane();

    this.activeController = event.controller;
    const xfo = this.activeController.getTipXfo();
    this.grabDist = xfo.tr.subtract(this.gizmoRay.start).dot(this.gizmoRay.dir);
    const grabPos = this.gizmoRay.start.add(
      this.gizmoRay.dir.scale(this.grabDist)
    );
    event.grabPos = grabPos;
    this.onDragStart(event);
    return true
  }

  /**
   * The onVRPoseChanged method.
   * @param {any} event - The event param.
   * @return {any} The return value.
   */
  onVRPoseChanged(event) {
    const xfo = this.activeController.getTipXfo();
    const dist = xfo.tr.subtract(this.gizmoRay.start).dot(this.gizmoRay.dir);
    const holdPos = this.gizmoRay.start.add(this.gizmoRay.dir.scale(dist));
    event.value = dist;
    event.holdPos = holdPos;
    event.delta = dist - this.grabDist;
    this.onDrag(event);
    return true
  }

  /**
   * The onVRControllerButtonUp method.
   * @param {any} event - The event param.
   * @return {any} The return value.
   */
  onVRControllerButtonUp(event) {
    if (this.activeController == event.controller) {
      // const xfo = this.activeController.getTipXfo()
      this.onDragEnd();
      this.activeController = undefined;
      return true
    }
  }
}

/**
 * Class representing a parameter value change.
 * @extends Change
 */
class ParameterValueChange$1 extends Change {
  /**
   * Create a parameter value change.
   * @param {object} param - The param value.
   * @param {any} newValue - The newValue value.
   * @param {number} mode - The mode value.
   */
  constructor(param, newValue) {
    if (param) {
      super(param ? param.getName() + ' Changed' : 'ParameterValueChange');
      this.__prevValue = param.getValue();
      this.__param = param;
      if (newValue != undefined) {
        this.__nextValue = newValue;
        this.__param.setValue(this.__nextValue);
      }
    } else {
      super();
    }
  }

  /**
   * The undo method.
   */
  undo() {
    if (!this.__param) return
    this.__param.setValue(this.__prevValue);
  }

  /**
   * The redo method.
   */
  redo() {
    if (!this.__param) return
    this.__param.setValue(this.__nextValue);
  }

  /**
   * The update method.
   * @param {any} updateData - The updateData param.
   */
  update(updateData) {
    if (!this.__param) return
    this.__nextValue = updateData.value;
    this.__param.setValue(this.__nextValue);
    this.emit('updated', updateData);
  }

  /**
   * The toJSON method.
   * @param {any} context - The context param.
   * @return {any} The return value.
   */
  toJSON(context) {
    const j = {
      name: this.name,
      paramPath: this.__param.getPath(),
    };
    if (this.__nextValue != undefined) {
      if (this.__nextValue.toJSON) {
        j.value = this.__nextValue.toJSON();
      } else {
        j.value = this.__nextValue;
      }
    }
    return j
  }

  /**
   * The fromJSON method.
   * @param {any} j - The j param.
   * @param {any} context - The context param.
   */
  fromJSON(j, context) {
    const param = context.appData.scene.getRoot().resolvePath(j.paramPath, 1);
    if (!param || !(param instanceof Parameter)) {
      console.warn('resolvePath is unable to resolve', j.paramPath);
      return
    }
    this.__param = param;
    this.__prevValue = this.__param.getValue();
    if (this.__prevValue.clone) this.__nextValue = this.__prevValue.clone();
    else this.__nextValue = this.__prevValue;

    this.name = j.name;
    if (j.value != undefined) this.changeFromJSON(j);
  }

  /**
   * The changeFromJSON method.
   * @param {any} j - The j param.
   */
  changeFromJSON(j) {
    if (!this.__param) return
    if (this.__nextValue.fromJSON) this.__nextValue.fromJSON(j.value);
    else this.__nextValue = j.value;
    this.__param.setValue(this.__nextValue);
  }
}

UndoRedoManager.registerChange('ParameterValueChange', ParameterValueChange$1);

class HandleGeomDataShader extends StandardSurfaceGeomDataShader {
  constructor(gl, floatGeomBuffer) {
    super(gl);
    this.__shaderStages['VERTEX_SHADER'] = shaderLibrary.parseShader(
      'HandleGeomDataShader.vertexShader',
      `
precision highp float;

attribute vec3 positions;

uniform mat4 viewMatrix;
uniform mat4 projectionMatrix;
uniform int maintainScreenSize;

<%include file="stack-gl/transpose.glsl"/>
<%include file="drawItemId.glsl"/>
<%include file="drawItemTexture.glsl"/>
<%include file="modelMatrix.glsl"/>


varying float v_drawItemId;
varying vec4 v_geomItemData;
varying vec3 v_viewPos;
varying float v_drawItemID;
varying vec3 v_worldPos;

void main(void) {
  int drawItemId = getDrawItemId();
  mat4 modelMatrix = getModelMatrix(drawItemId);
  mat4 modelViewMatrix = viewMatrix * modelMatrix;
  
  if(maintainScreenSize != 0) {
    float dist = modelViewMatrix[3][2];
    float sc = dist;
    mat4 scmat = mat4(
      sc, 0.0, 0.0, 0.0,
      0.0, sc, 0.0, 0.0,
      0.0, 0.0, sc, 0.0,
      0.0, 0.0, 0.0, 1.0
    );
    modelViewMatrix = modelViewMatrix * scmat;
  }

  vec4 viewPos = modelViewMatrix * vec4(positions, 1.0);
  gl_Position = projectionMatrix * viewPos;

  v_viewPos = -viewPos.xyz;

  v_drawItemID = float(getDrawItemId());
}
`
    );
  }
}

sgFactory.registerClass('HandleGeomDataShader', HandleGeomDataShader);

class HandleShader extends GLShader {
  constructor(gl) {
    super(gl);

    this.__shaderStages['VERTEX_SHADER'] = shaderLibrary.parseShader(
      'HandleShader.vertexShader',
      `
precision highp float;

attribute vec3 positions;
#ifdef ENABLE_TEXTURES
attribute vec2 texCoords;
#endif

uniform mat4 viewMatrix;
uniform mat4 projectionMatrix;
uniform int maintainScreenSize;

<%include file="stack-gl/transpose.glsl"/>
<%include file="drawItemId.glsl"/>
<%include file="drawItemTexture.glsl"/>
<%include file="modelMatrix.glsl"/>

/* VS Outputs */
varying vec3 v_viewPos;
#ifdef ENABLE_TEXTURES
varying vec2 v_textureCoord;
#endif

void main(void) {
  int drawItemId = getDrawItemId();
  mat4 modelMatrix = getModelMatrix(drawItemId);
  mat4 modelViewMatrix = viewMatrix * modelMatrix;

  if(maintainScreenSize != 0) {
    float dist = modelViewMatrix[3][2];
    float sc = dist;
    mat4 scmat = mat4(
      sc, 0.0, 0.0, 0.0,
      0.0, sc, 0.0, 0.0,
      0.0, 0.0, sc, 0.0,
      0.0, 0.0, 0.0, 1.0
    );
    modelViewMatrix = modelViewMatrix * scmat;
  }

  vec4 viewPos = modelViewMatrix * vec4(positions, 1.0);
  gl_Position = projectionMatrix * viewPos;

  v_viewPos = viewPos.xyz;
  v_textureCoord = texCoords;
  v_textureCoord.y = 1.0 - v_textureCoord.y;// Flip y
}
`
    );

    this.__shaderStages['FRAGMENT_SHADER'] = shaderLibrary.parseShader(
      'HandleShader.fragmentShader',
      `
precision highp float;

<%include file="stack-gl/gamma.glsl"/>
<%include file="materialparams.glsl"/>

uniform color BaseColor;

#ifdef ENABLE_TEXTURES
uniform sampler2D BaseColorTex;
uniform int BaseColorTexType;
#endif

/* VS Outputs */
varying vec3 v_viewPos;
#ifdef ENABLE_TEXTURES
varying vec2 v_textureCoord;
#endif


#ifdef ENABLE_ES3
    out vec4 fragColor;
#endif
void main(void) {

#ifndef ENABLE_TEXTURES
    vec4 baseColor = BaseColor;
#else
    vec4 baseColor      = getColorParamValue(BaseColor, BaseColorTex, BaseColorTexType, v_textureCoord);
#endif

#ifndef ENABLE_ES3
    vec4 fragColor;
#endif
    fragColor = baseColor;

#ifdef ENABLE_INLINE_GAMMACORRECTION
    fragColor.rgb = toGamma(fragColor.rgb);
#endif

#ifndef ENABLE_ES3
    gl_FragColor = fragColor;
#endif
}
`
    );

    this.finalize();
  }

  static getParamDeclarations() {
    const paramDescs = super.getParamDeclarations();
    paramDescs.push({
      name: 'BaseColor',
      defaultValue: new Color(1.0, 1.0, 0.5),
    });
    paramDescs.push({
      name: 'maintainScreenSize',
      defaultValue: 0,
    });
    return paramDescs
  }

  static isOverlay() {
    return true
  }

  static getGeomDataShaderName() {
    return 'HandleGeomDataShader'
  }

  // static getSelectedShaderName(){
  //     return 'StandardSurfaceSelectedGeomsShader';
  // }
}

sgFactory.registerClass('HandleShader', HandleShader);

const transformVertices = (positions, xfo) => {
  for (let i = 0; i < positions.length; i++) {
    const v = positions.getValueRef(i);
    const v2 = xfo.transformVec3(v);
    v.set(v2.x, v2.y, v2.z);
  }
};

/** Class representing a linear movement scene widget.
 * @extends BaseLinearMovementHandle
 */
class LinearMovementHandle extends BaseLinearMovementHandle {
  /**
   * Create a linear movement scene widget.
   * @param {any} name - The name value.
   * @param {any} length - The length value.
   * @param {any} thickness - The thickness value.
   * @param {any} color - The color value.
   */
  constructor(name, length, thickness, color) {
    super(name);

    this.__color = color;
    this.__hilightedColor = new Color(1, 1, 1);

    const handleMat = new Material('handle', 'HandleShader');
    handleMat.getParameter('maintainScreenSize').setValue(1);
    this.colorParam = handleMat.getParameter('BaseColor');
    this.colorParam.setValue(color);
    const handleGeom = new Cylinder(thickness, length, 64);
    handleGeom.getParameter('baseZAtZero').setValue(true);
    const tipGeom = new Cone(thickness * 4, thickness * 10, 64, true);
    const handle = new GeomItem('handle', handleGeom, handleMat);

    const tip = new GeomItem('tip', tipGeom, handleMat);
    const tipXfo = new Xfo();
    tipXfo.tr.set(0, 0, length);
    transformVertices(tipGeom.getVertexAttribute('positions'), tipXfo);

    this.addChild(handle);
    this.addChild(tip);
  }

  /**
   * The highlight method.
   */
  highlight() {
    this.colorParam.setValue(this.__hilightedColor);
  }

  /**
   * The unhighlight method.
   */
  unhighlight() {
    this.colorParam.setValue(this.__color);
  }

  /**
   * The setTargetParam method.
   * @param {any} param - The video param.
   * @param {boolean} track - The track param.
   */
  setTargetParam(param, track = true) {
    this.param = param;
    if (track) {
      const __updateGizmo = () => {
        this.getParameter('GlobalXfo').setValue(param.getValue());
      };
      __updateGizmo();
      param.on('valueChanged', __updateGizmo);
    }
  }

  /**
   * The getTargetParam method.
   */
  getTargetParam() {
    return this.param ? this.param : this.getParameter('GlobalXfo')
  }

  /**
   * The onDragStart method.
   * @param {any} event - The event param.
   */
  onDragStart(event) {
    this.grabPos = event.grabPos;
    const param = this.getTargetParam();
    this.baseXfo = param.getValue();
    if (event.undoRedoManager) {
      this.change = new ParameterValueChange$1(param);
      event.undoRedoManager.addChange(this.change);
    }
  }

  /**
   * The onDrag method.
   * @param {any} event - The event param.
   */
  onDrag(event) {
    const dragVec = event.holdPos.subtract(this.grabPos);

    const newXfo = this.baseXfo.clone();
    newXfo.tr.addInPlace(dragVec);

    if (this.change) {
      this.change.update({
        value: newXfo,
      });
    } else {
      this.param.setValue(newXfo);
    }
  }

  /**
   * The onDragEnd method.
   * @param {any} event - The event param.
   */
  onDragEnd(event) {
    this.change = null;
  }
}

/** Class representing a planar movement scene widget.
 * @extends Handle
 */
class PlanarMovementHandle extends Handle {
  /**
   * Create a planar movement scene widget.
   * @param {any} name - The name value.
   */
  constructor(name) {
    super(name);
    this.fullXfoManipulationInVR = true;
  }

  /**
   * The setTargetParam method.
   * @param {any} param - The param param.
   * @param {boolean} track - The track param.
   */
  setTargetParam(param, track = true) {
    this.param = param;
    if (track) {
      const __updateGizmo = () => {
        this.getParameter('GlobalXfo').setValue(param.getValue());
      };
      __updateGizmo();
      param.on('valueChanged', __updateGizmo);
    }
  }

  /**
   * The getTargetParam method.
   */
  getTargetParam() {
    return this.param ? this.param : this.getParameter('GlobalXfo')
  }

  /**
   * The onDragStart method.
   * @param {any} event - The event param.
   */
  onDragStart(event) {
    this.grabPos = event.grabPos;
    const param = this.getTargetParam();
    this.baseXfo = param.getValue();
    if (event.undoRedoManager) {
      this.change = new ParameterValueChange$1(param);
      event.undoRedoManager.addChange(this.change);
    }
  }

  /**
   * The onDrag method.
   * @param {any} event - The event param.
   */
  onDrag(event) {
    const dragVec = event.holdPos.subtract(this.grabPos);

    const newXfo = this.baseXfo.clone();
    newXfo.tr.addInPlace(dragVec);

    if (this.change) {
      this.change.update({
        value: newXfo,
      });
    } else {
      const param = this.getTargetParam();
      param.setValue(newXfo);
    }
  }

  /**
   * The onDragEnd method.
   * @param {any} event - The event param.
   */
  onDragEnd(event) {
    this.change = null;
  }

  // ///////////////////////////////////
  // VRController events

  /**
   * The onVRControllerButtonDown method.
   * @param {any} event - The event param.
   * @return {any} The return value.
   */
  onVRControllerButtonDown(event) {
    if (this.fullXfoManipulationInVR) {
      this.activeController = event.controller;
      const xfo = this.activeController.getTipXfo();
      const handleXfo = this.getParameter('GlobalXfo').getValue();
      this.grabOffset = xfo.inverse().multiply(handleXfo);
    } else {
      super.onVRControllerButtonDown(event);
    }
    return true
  }

  /**
   * The onVRPoseChanged method.
   * @param {any} event - The event param.
   * @return {any} The return value.
   */
  onVRPoseChanged(event) {
    if (this.fullXfoManipulationInVR) {
      const xfo = this.activeController.getTipXfo();
      const newXfo = xfo.multiply(this.grabOffset);
      if (this.change) {
        this.change.update({
          value: newXfo,
        });
      } else {
        const param = this.getTargetParam();
        param.setValue(newXfo);
      }
    } else {
      super.onVRPoseChanged(event);
    }
  }

  /**
   * The onVRControllerButtonUp method.
   * @param {any} event - The event param.
   * @return {any} The return value.
   */
  onVRControllerButtonUp(event) {
    if (this.fullXfoManipulationInVR) {
      this.change = null;
    } else {
      super.onVRControllerButtonUp(event);
    }
  }
}

/**
 * Class representing an axial rotation scene widget.
 * @extends Handle
 */
class BaseAxialRotationHandle extends Handle {
  /**
   * Create an axial rotation scene widget.
   * @param {any} name - The name value.
   * @param {any} radius - The radius value.
   * @param {any} thickness - The thickness value.
   * @param {any} color - The color value.
   */
  constructor(name) {
    super(name);
  }

  /**
   * The setTargetParam method.
   * @param {any} param - The param param.
   * @param {boolean} track - The track param.
   */
  setTargetParam(param, track = true) {
    this.param = param;
    if (track) {
      const __updateGizmo = () => {
        this.getParameter('GlobalXfo').setValue(param.getValue());
      };
      __updateGizmo();
      param.on('valueChanged', __updateGizmo);
    }
  }

  /**
   * The getTargetParam method.
   */
  getTargetParam() {
    return this.param ? this.param : this.getParameter('GlobalXfo')
  }

  /**
   * The onDragStart method.
   * @param {any} event - The event param.
   */
  onDragStart(event) {
    this.baseXfo = this.getParameter('GlobalXfo').getValue().clone();
    this.baseXfo.sc.set(1, 1, 1);
    this.deltaXfo = new Xfo();

    const param = this.getTargetParam();
    const paramXfo = param.getValue();
    this.offsetXfo = this.baseXfo.inverse().multiply(paramXfo);

    this.vec0 = event.grabPos.subtract(this.baseXfo.tr);
    this.grabCircleRadius = this.vec0.length();
    this.vec0.normalizeInPlace();

    if (event.undoRedoManager) {
      this.change = new ParameterValueChange$1(param);
      event.undoRedoManager.addChange(this.change);
    }
  }

  /**
   * The onDrag method.
   * @param {any} event - The event param.
   */
  onDrag(event) {
    const vec1 = event.holdPos.subtract(this.baseXfo.tr);
    const dragCircleRadius = vec1.length();
    vec1.normalizeInPlace();

    // modulate the angle by the radius the mouse moves
    // away from the center of the handle.
    // This makes it possible to rotate the object more than
    // 180 degrees in a single movement.
    const modulator = dragCircleRadius / this.grabCircleRadius;
    let angle = this.vec0.angleTo(vec1) * modulator;
    if (this.vec0.cross(vec1).dot(this.baseXfo.ori.getZaxis()) < 0)
      angle = -angle;

    if (this.range) {
      angle = Math.clamp(angle, this.range[0], this.range[1]);
    }

    if (event.shiftKey) {
      // modulat the angle to X degree increments.
      const increment = Math.degToRad(22.5);
      angle = Math.floor(angle / increment) * increment;
    }

    this.deltaXfo.ori.setFromAxisAndAngle(new Vec3$1(0, 0, 1), angle);

    const newXfo = this.baseXfo.multiply(this.deltaXfo);
    const value = newXfo.multiply(this.offsetXfo);

    if (this.change) {
      this.change.update({
        value,
      });
    } else {
      const param = this.getTargetParam();
      param.setValue(value);
    }
  }

  /**
   * The onDragEnd method.
   * @param {any} event - The event param.
   */
  onDragEnd(event) {
    this.change = null;
  }
}

/**
 * Class representing an axial rotation scene widget.
 * @extends BaseAxialRotationHandle
 */
class AxialRotationHandle extends BaseAxialRotationHandle {
  /**
   * Create an axial rotation scene widget.
   * @param {any} name - The name value.
   * @param {any} radius - The radius value.
   * @param {any} thickness - The thickness value.
   * @param {any} color - The color value.
   */
  constructor(name, radius, thickness, color) {
    super(name);

    this.__color = color;
    this.__hilightedColor = new Color(1, 1, 1);
    this.radiusParam = this.addParameter(new NumberParameter('radius', radius));

    const handleMat = new Material('handle', 'HandleShader');
    handleMat.getParameter('maintainScreenSize').setValue(1);
    this.colorParam = handleMat.getParameter('BaseColor');
    this.colorParam.setValue(color);

    // const handleGeom = new Cylinder(radius, thickness * 2, 64, 2, false);
    const handleGeom = new Torus(thickness, radius, 64);
    this.handle = new GeomItem('handle', handleGeom, handleMat);
    this.handleXfo = new Xfo();

    this.radiusParam.on('valueChanged', () => {
      radius = this.radiusParam.getValue();
      handleGeom.getParameter('radius').setValue(radius);
      handleGeom.getParameter('height').setValue(radius * 0.02);
    });

    this.addChild(this.handle);
  }

  /**
   * The highlight method.
   */
  highlight() {
    this.colorParam.setValue(this.__hilightedColor);
  }

  /**
   * The unhighlight method.
   */
  unhighlight() {
    this.colorParam.setValue(this.__color);
  }

  /**
   * The getBaseXfo method.
   */
  getBaseXfo() {
    return this.getParameter('GlobalXfo').getValue()
  }

  /**
   * The onDragStart method.
   * @param {any} event - The event param.
   */
  onDragStart(event) {
    super.onDragStart(event);

    // Hilight the material.
    this.colorParam.setValue(new Color(1, 1, 1));
  }

  /**
   * The onDrag method.
   * @param {any} event - The event param.
   */
  onDrag(event) {
    super.onDrag(event);
  }

  /**
   * The onDragEnd method.
   * @param {any} event - The event param.
   */
  onDragEnd(event) {
    super.onDragEnd(event);
    this.colorParam.setValue(this.__color);
  }
}

/** Class representing a linear scale scene widget.
 * @extends BaseLinearMovementHandle
 */
class LinearScaleHandle extends BaseLinearMovementHandle {
  /**
   * Create a linear scale scene widget.
   * @param {any} name - The name value.
   * @param {any} length - The length value.
   * @param {any} thickness - The thickness value.
   * @param {any} color - The color value.
   */
  constructor(name, length, thickness, color) {
    super(name);

    this.__color = color;
    this.__hilightedColor = new Color(1, 1, 1);

    const handleMat = new Material('handle', 'HandleShader');
    handleMat.getParameter('maintainScreenSize').setValue(1);
    this.colorParam = handleMat.getParameter('BaseColor');
    this.colorParam.setValue(color);
    const handleGeom = new Cylinder(thickness, length - thickness * 10, 64);
    handleGeom.getParameter('baseZAtZero').setValue(true);
    const tipGeom = new Cuboid(thickness * 10, thickness * 10, thickness * 10);
    const handle = new GeomItem('handle', handleGeom, handleMat);

    const tip = new GeomItem('tip', tipGeom, handleMat);
    const tipXfo = new Xfo();
    tipXfo.tr.set(0, 0, length - thickness * 10);
    // tipXfo.tr.set(0, 0, length);
    // tip.getParameter('LocalXfo').setValue(tipXfo);
    // Note: the constant screen size shader
    // only works if all the handle geometries
    // are centered on the middle of the XfoHandle.
    transformVertices(tipGeom.getVertexAttribute('positions'), tipXfo);

    this.addChild(handle);
    this.addChild(tip);
  }

  /**
   * The highlight method.
   */
  highlight() {
    this.colorParam.setValue(this.__hilightedColor);
  }

  /**
   * The unhighlight method.
   */
  unhighlight() {
    this.colorParam.setValue(this.__color);
  }

  /**
   * The setTargetParam method.
   * @param {any} param - The param param.
   * @param {boolean} track - The track param.
   */
  setTargetParam(param, track = true) {
    this.param = param;
    if (track) {
      const __updateGizmo = () => {
        this.getParameter('GlobalXfo').setValue(param.getValue());
      };
      __updateGizmo();
      param.on('valueChanged', __updateGizmo);
    }
  }

  /**
   * The getTargetParam method.
   */
  getTargetParam() {
    return this.param ? this.param : this.getParameter('GlobalXfo')
  }

  /**
   * The onDragStart method.
   * @param {any} event - The event param.
   */
  onDragStart(event) {
    this.grabDist = event.grabDist;
    this.oriXfo = this.getParameter('GlobalXfo').getValue();
    this.tmplocalXfo = this.getParameter('LocalXfo').getValue();
    const param = this.getTargetParam();
    this.baseXfo = param.getValue();
    if (event.undoRedoManager) {
      this.change = new ParameterValueChange$1(param);
      event.undoRedoManager.addChange(this.change);
    }
  }

  /**
   * The onDrag method.
   * @param {any} event - The event param.
   */
  onDrag(event) {
    // const dragVec = event.holdPos.subtract(this.grabPos);

    const newXfo = this.baseXfo.clone();
    const sc = event.holdDist / this.grabDist;
    if (sc < 0.0001) return

    // const scAxis = this.oriXfo.ori.getZaxis();
    // const scX = this.baseXfo.ori.getXaxis().dot(scAxis);
    // const scY = this.baseXfo.ori.getYaxis().dot(scAxis);
    // const scZ = this.baseXfo.ori.getZaxis().dot(scAxis);
    // console.log("sc:", sc, " scX", scX, " scY:", scY, " scZ:", scZ)
    // newXfo.sc.set(scX, scY, scZ);
    newXfo.sc.set(
      this.baseXfo.sc.x * sc,
      this.baseXfo.sc.y * sc,
      this.baseXfo.sc.z * sc
    );

    // Scale inheritance is disabled for handles.
    // (XfoHandle throws away scale in _cleanGlobalXfo).
    // This means we have to apply it here to see the scale
    // widget change size.
    this.tmplocalXfo.sc.set(1, 1, sc);
    this.getParameter('LocalXfo').setValue(this.tmplocalXfo);

    if (this.change) {
      this.change.update({
        value: newXfo,
      });
    } else {
      this.param.setValue(newXfo);
    }
  }

  /**
   * The onDragEnd method.
   * @param {any} event - The event param.
   */
  onDragEnd(event) {
    this.change = null;

    this.tmplocalXfo.sc.set(1, 1, 1);
    this.getParameter('LocalXfo').setValue(this.tmplocalXfo);

    const tip = this.getChildByName('tip');
    const tipXfo = tip.getParameter('LocalXfo').getValue();
    tipXfo.sc.set(1, 1, 1);
    tip.getParameter('LocalXfo').setValue(tipXfo);
  }
}

/**
 * Class representing an axial rotation scene widget.
 * @extends Handle
 */
class SphericalRotationHandle extends Handle {
  /**
   * Create an axial rotation scene widget.
   * @param {any} name - The name value.
   * @param {any} radius - The radius value.
   * @param {any} thickness - The thickness value.
   * @param {any} color - The color value.
   */
  constructor(name, radius, color) {
    super(name);

    this.radius = radius;
    const maskMat = new Material('mask', 'HandleShader');
    maskMat.getParameter('maintainScreenSize').setValue(1);
    maskMat.getParameter('BaseColor').setValue(color);
    const maskGeom = new Sphere(radius, 64);
    const maskGeomItem = new GeomItem('mask', maskGeom, maskMat);
    this.addChild(maskGeomItem);
  }

  /**
   * The highlight method.
   */
  highlight() {
    // this.colorParam.setValue(this.__hilightedColor);
  }

  /**
   * The unhighlight method.
   */
  unhighlight() {
    // this.colorParam.setValue(this.__color);
  }

  /**
   * The setTargetParam method.
   * @param {any} param - The param param.
   * @param {boolean} track - The track param.
   */
  setTargetParam(param, track = true) {
    this.param = param;
    if (track) {
      const __updateGizmo = () => {
        this.getParameter('GlobalXfo').setValue(param.getValue());
      };
      __updateGizmo();
      param.on('valueChanged', __updateGizmo);
    }
  }

  /**
   * The getTargetParam method.
   */
  getTargetParam() {
    return this.param ? this.param : this.getParameter('GlobalXfo')
  }

  // ///////////////////////////////////
  // Mouse events

  /**
   * The handleMouseDown method.
   * @param {any} event - The event param.
   * @return {any} The return value.
   */
  handleMouseDown(event) {
    // const xfo = this.getParameter('GlobalXfo').getValue();
    // this.sphere = {
    //   tr: xfo,
    //   radius: this.radius,
    // };
    // const dist = event.mouseRay.intersectRaySphere(this.sphere);
    // event.grabPos = event.mouseRay.pointAtDist(dist);
    // this.onDragStart(event);
    return true
  }

  /**
   * The handleMouseMove method.
   * @param {any} event - The event param.
   */
  handleMouseMove(event) {
    // const dist = event.mouseRay.intersectRaySphere(this.sphere);
    // event.holdPos = event.mouseRay.pointAtDist(dist);
    // this.onDrag(event);
    return true
  }

  /**
   * The handleMouseUp method.
   * @param {any} event - The event param.
   * @return {any} The return value.
   */
  handleMouseUp(event) {
    // const dist = event.mouseRay.intersectRaySphere(this.sphere);
    // event.releasePos = event.mouseRay.pointAtDist(dist);
    // this.onDragEnd(event);
    return true
  }

  /**
   * The onDragStart method.
   * @param {any} event - The event param.
   */
  onDragStart(event) {
    this.baseXfo = this.getParameter('GlobalXfo').getValue();
    this.baseXfo.sc.set(1, 1, 1);
    this.deltaXfo = new Xfo();
    const param = this.getTargetParam();
    this.offsetXfo = this.baseXfo.inverse().multiply(param.getValue());

    this.vec0 = event.grabPos.subtract(this.baseXfo.tr);
    this.vec0.normalizeInPlace();

    // Hilight the material.
    this.colorParam.setValue(new Color(1, 1, 1));

    if (event.undoRedoManager) {
      this.change = new ParameterValueChange(param);
      event.undoRedoManager.addChange(this.change);
    }
  }

  /**
   * The onDrag method.
   * @param {any} event - The event param.
   */
  onDrag(event) {
    const vec1 = event.holdPos.subtract(this.baseXfo.tr);
    vec1.normalizeInPlace();

    const angle = this.vec0.angleTo(vec1) * modulator;
    const axis = this.vec0.cross(vec1).normalize();

    this.deltaXfo.ori.setFromAxisAndAngle(axis, angle);

    const newXfo = this.baseXfo.multiply(this.deltaXfo);
    const value = newXfo.multiply(this.offsetXfo);

    if (this.change) {
      this.change.update({
        value,
      });
    } else {
      const param = this.getTargetParam();
      param.setValue(newXfo);
    }
  }

  /**
   * The onDragEnd method.
   * @param {any} event - The event param.
   */
  onDragEnd(event) {
    this.change = null;

    this.colorParam.setValue(this.__color);
  }
}

/** Class representing a planar movement scene widget.
 * @extends Handle
 */
class XfoPlanarMovementHandle extends PlanarMovementHandle {
  /**
   * Create a planar movement scene widget.
   * @param {any} name - The name value.
   * @param {any} size - The size value.
   * @param {any} color - The color value.
   * @param {any} offset - The offset value.
   */
  constructor(name, size, color, offset) {
    super(name);

    this.__color = color;
    this.__hilightedColor = new Color(1, 1, 1);
    this.sizeParam = this.addParameter(new NumberParameter('size', size));

    const handleMat = new Material('handle', 'HandleShader');
    handleMat.getParameter('maintainScreenSize').setValue(1);
    this.colorParam = handleMat.getParameter('BaseColor');
    this.colorParam.setValue(color);

    const handleGeom = new Cuboid(size, size, size * 0.02);

    const handleGeomXfo = new Xfo();
    handleGeomXfo.tr = offset;
    transformVertices(handleGeom.getVertexAttribute('positions'), handleGeomXfo);
    this.handle = new GeomItem('handle', handleGeom, handleMat);

    this.sizeParam.on('valueChanged', () => {
      size = this.sizeParam.getValue();
      handleGeom.getParameter('size').setValue(size);
      handleGeom.getParameter('height').setValue(size * 0.02);
    });

    this.addChild(this.handle);
  }

  /**
   * The highlight method.
   */
  highlight() {
    this.colorParam.setValue(this.__hilightedColor);
  }

  /**
   * The unhighlight method.
   */
  unhighlight() {
    this.colorParam.setValue(this.__color);
  }
}

/**
 * Class representing an xfo handle.
 * @extends TreeItem
 */
class XfoHandle extends TreeItem {
  /**
   * Create an axial rotation scene widget.
   * @param {any} size - The size value.
   * @param {any} thickness - The thickness value.
   */
  constructor(size, thickness) {
    super('XfoHandle');

    // ////////////////////////////////
    // LinearMovementHandle

    const translationHandles = new TreeItem('Translate');
    translationHandles.setVisible(false);
    this.addChild(translationHandles);

    const red = new Color(1, 0.1, 0.1);
    const green = new Color('#32CD32'); // limegreen https://www.rapidtables.com/web/color/green-color.html
    const blue = new Color('#1E90FF'); // dodgerblue https://www.rapidtables.com/web/color/blue-color.html
    red.a = 0.8;
    green.a = 0.8;
    blue.a = 0.8;

    {
      const linearXWidget = new LinearMovementHandle(
        'linearX',
        size,
        thickness,
        red
      );
      const xfo = new Xfo();
      xfo.ori.setFromAxisAndAngle(new Vec3$1(0, 1, 0), Math.PI * 0.5);
      linearXWidget.getParameter('LocalXfo').setValue(xfo);
      translationHandles.addChild(linearXWidget);
    }
    {
      const linearYWidget = new LinearMovementHandle(
        'linearY',
        size,
        thickness,
        green
      );
      const xfo = new Xfo();
      xfo.ori.setFromAxisAndAngle(new Vec3$1(1, 0, 0), Math.PI * -0.5);
      linearYWidget.getParameter('LocalXfo').setValue(xfo);
      translationHandles.addChild(linearYWidget);
    }
    {
      const linearZWidget = new LinearMovementHandle(
        'linearZ',
        size,
        thickness,
        blue
      );
      translationHandles.addChild(linearZWidget);
    }

    // ////////////////////////////////
    // planarXYWidget
    const planarSize = size * 0.35;
    {
      const planarXYWidget = new XfoPlanarMovementHandle(
        'planarXY',
        planarSize,
        green,
        new Vec3$1(planarSize * 0.5, planarSize * 0.5, 0.0)
      );
      const xfo = new Xfo();
      planarXYWidget.getParameter('LocalXfo').setValue(xfo);
      translationHandles.addChild(planarXYWidget);
    }
    {
      const planarYZWidget = new XfoPlanarMovementHandle(
        'planarYZ',
        planarSize,
        red,
        new Vec3$1(planarSize * -0.5, planarSize * 0.5, 0.0)
      );
      const xfo = new Xfo();
      xfo.ori.setFromAxisAndAngle(new Vec3$1(0, 1, 0), Math.PI * 0.5);
      planarYZWidget.getParameter('LocalXfo').setValue(xfo);
      translationHandles.addChild(planarYZWidget);
    }
    {
      const planarXZWidget = new XfoPlanarMovementHandle(
        'planarXZ',
        planarSize,
        blue,
        new Vec3$1(planarSize * 0.5, planarSize * 0.5, 0.0)
      );
      const xfo = new Xfo();
      xfo.ori.setFromAxisAndAngle(new Vec3$1(1, 0, 0), Math.PI * 0.5);
      planarXZWidget.getParameter('LocalXfo').setValue(xfo);
      translationHandles.addChild(planarXZWidget);
    }

    // ////////////////////////////////
    // Rotation
    const rotationHandles = new TreeItem('Rotate');
    rotationHandles.setVisible(false);
    this.addChild(rotationHandles);
    {
      const rotationWidget = new SphericalRotationHandle(
        'rotation',
        size - thickness,
        new Color(1, 1, 1, 0.4)
      );
      rotationHandles.addChild(rotationWidget);
      // const maskMat = new Material('mask', 'HandleShader');
      // maskMat
      //   .getParameter('BaseColor')
      //   .setValue(new Color(1, 1, 1, 0.4));
      // const maskGeom = new Sphere(size - thickness, 64);
      // const maskGeomItem = new GeomItem('mask', maskGeom, maskMat);
      // rotationHandles.addChild(maskGeomItem);
    }
    {
      const rotationXWidget = new AxialRotationHandle(
        'rotationX',
        size,
        thickness,
        red
      );
      const xfo = new Xfo();
      xfo.ori.setFromAxisAndAngle(new Vec3$1(0, 1, 0), Math.PI * 0.5);
      rotationXWidget.getParameter('LocalXfo').setValue(xfo);
      rotationHandles.addChild(rotationXWidget);
    }
    {
      const rotationYWidget = new AxialRotationHandle(
        'rotationY',
        size,
        thickness,
        green
      );
      const xfo = new Xfo();
      xfo.ori.setFromAxisAndAngle(new Vec3$1(1, 0, 0), Math.PI * 0.5);
      rotationYWidget.getParameter('LocalXfo').setValue(xfo);
      rotationHandles.addChild(rotationYWidget);
    }
    {
      const rotationZWidget = new AxialRotationHandle(
        'rotationZ',
        size,
        thickness,
        blue
      );
      rotationHandles.addChild(rotationZWidget);
    }

    // ////////////////////////////////
    // Scale - Not supported
    const scaleHandles = new TreeItem('Scale');
    scaleHandles.setVisible(false);
    this.addChild(scaleHandles);

    const scaleHandleLength = size * 0.95;
    {
      const scaleXWidget = new LinearScaleHandle(
        'scaleX',
        scaleHandleLength,
        thickness,
        red
      );
      const xfo = new Xfo();
      xfo.ori.setFromAxisAndAngle(new Vec3$1(0, 1, 0), Math.PI * 0.5);
      scaleXWidget.getParameter('LocalXfo').setValue(xfo);
      scaleHandles.addChild(scaleXWidget);
    }
    {
      const scaleYWidget = new LinearScaleHandle(
        'scaleY',
        scaleHandleLength,
        thickness,
        green
      );
      const xfo = new Xfo();
      xfo.ori.setFromAxisAndAngle(new Vec3$1(1, 0, 0), Math.PI * -0.5);
      scaleYWidget.getParameter('LocalXfo').setValue(xfo);
      scaleHandles.addChild(scaleYWidget);
    }
    {
      const scaleZWidget = new LinearScaleHandle(
        'scaleZ',
        scaleHandleLength,
        thickness,
        blue
      );
      scaleHandles.addChild(scaleZWidget);
    }
  }

  /**
   * Calculate the global Xfo for the handls.
   */
  _cleanGlobalXfo(prevValue) {
    const parentItem = this.getParentItem();
    if (parentItem !== undefined) {
      const parentXfo = parentItem.getParameter('GlobalXfo').getValue().clone();
      parentXfo.sc.set(1, 1, 1);
      return parentXfo.multiply(this.__localXfoParam.getValue())
    } else return this.__localXfoParam.getValue()
  }

  /**
   * The showHandles method.
   * @param {any} name - The name param.
   * @return {any} The return value.
   */
  showHandles(name) {
    this.traverse((item) => {
      if (item != this) {
        item.setVisible(false);
        return false
      }
    });

    const child = this.getChildByName(name);
    if (child) child.setVisible(true);
  }

  /**
   * The setTargetParam method.
   * @param {any} param - The param param.
   */
  setTargetParam(param) {
    this.param = param;
    this.traverse((item) => {
      if (item instanceof Handle) item.setTargetParam(param, false);
    });
  }
}

/** An operator for aiming items at targets.
 * @extends Operator
 *
 */
class SelectionGroupXfoOperator extends Operator {
  /**
   * Create a GroupMemberXfoOperator operator.
   * @param {Parameter} groupGlobalXfoParam - The GlobalXfo param found on the Group.
   */
  constructor(initialXfoModeParam, globalXfoParam) {
    super();
    this.addInput(new OperatorInput('InitialXfoMode')).setParam(
      initialXfoModeParam
    );
    this.addOutput(new OperatorOutput('GroupGlobalXfo')).setParam(
      globalXfoParam
    );
  }

  /**
   * adds a new item to the SelectionGroupXfoOperator.
   * @param {TreeItem} item - The tree item being added
   */
  addItem(item) {
    this.addInput(
      new OperatorInput('MemberGlobalXfo' + this.getNumInputs())
    ).setParam(item.getParameter('GlobalXfo'));
    this.setDirty();
  }

  /**
   * removes an item that was previously added to the SelectionGroupXfoOperator.
   * @param {TreeItem} item - The Bind Xfo calculated from the initial Transforms of the Group Members.
   */
  removeItem(item) {
    // The first input it the 'InitialXfoMode', so remove the input for the specified item.
    const xfoParam = item.getParameter('GlobalXfo');
    for (let i = 1; i < this.getNumInputs(); i++) {
      const input = this.getInputByIndex(i);
      if (input.getParam() == xfoParam) {
        this.removeInput(input);
        this.setDirty();
        return
      }
    }
    throw new Error('Item not found in SelectionGroupXfoOperator')
  }

  /**
   * Move the group. When the selection group is manipulated, this method is called. Here we propagate the delta to each of the selection members.
   * @param {Xfo} xfo - The new value being set to the Groups GlobalXfo param.
   */
  backPropagateValue(xfo) {
    const groupTransformOutput = this.getOutput('GroupGlobalXfo');
    const currGroupXfo = groupTransformOutput.getValue();
    const invXfo = currGroupXfo.inverse();
    const delta = xfo.multiply(invXfo);
    for (let i = 1; i < this.getNumInputs(); i++) {
      const input = this.getInputByIndex(i);
      const currXfo = input.getValue();
      const result = delta.multiply(currXfo);
      input.setValue(result);
    }
  }

  /**
   * Calculate a new Xfo for the group based on the members.
   */
  evaluate() {
    const groupTransformOutput = this.getOutput('GroupGlobalXfo');
    const xfo = new Xfo();

    if (this.getNumInputs() == 1) {
      groupTransformOutput.setClean(xfo);
      return
    }

    const initialXfoMode = this.getInput('InitialXfoMode').getValue();
    if (initialXfoMode == Group.INITIAL_XFO_MODES.manual) {
      // The xfo is manually set by the current global xfo.
      groupTransformOutput.setClean(groupTransformOutput.getValue());
      return
    } else if (initialXfoMode == Group.INITIAL_XFO_MODES.first) {
      groupTransformOutput.setClean(this.getInputByIndex(1).getValue());
    } else if (initialXfoMode == Group.INITIAL_XFO_MODES.average) {
      xfo.ori.set(0, 0, 0, 0);
      let numTreeItems = 0;
      for (let i = 1; i < this.getNumInputs(); i++) {
        const itemXfo = this.getInputByIndex(i).getValue();
        xfo.tr.addInPlace(itemXfo.tr);
        xfo.ori.addInPlace(itemXfo.ori);
        numTreeItems++;
      }
      xfo.tr.scaleInPlace(1 / numTreeItems);
      xfo.ori.normalizeInPlace();
      // xfo.sc.scaleInPlace(1/ numTreeItems);
      groupTransformOutput.setClean(xfo);
    } else if (initialXfoMode == Group.INITIAL_XFO_MODES.globalOri) {
      let numTreeItems = 0;
      for (let i = 1; i < this.getNumInputs(); i++) {
        const itemXfo = this.getInputByIndex(i).getValue();
        xfo.tr.addInPlace(itemXfo.tr);
        numTreeItems++;
      }
      xfo.tr.scaleInPlace(1 / numTreeItems);
      groupTransformOutput.setClean(xfo);
    } else {
      throw new Error('Invalid Group.INITIAL_XFO_MODES.')
    }
  }
}

/** Class representing a selection group */
class SelectionGroup extends Group {
  constructor(options) {
    super();

    let selectionColor;
    let subtreeColor;
    if (options.selectionOutlineColor)
      selectionColor = options.selectionOutlineColor;
    else {
      selectionColor = new Color('#03E3AC');
      selectionColor.a = 0.1;
    }
    if (options.branchSelectionOutlineColor)
      subtreeColor = options.branchSelectionOutlineColor;
    else {
      subtreeColor = selectionColor.lerp(new Color('white'), 0.5);
      subtreeColor.a = 0.1;
    }

    this.getParameter('HighlightColor').setValue(selectionColor);
    this.addParameter(new ColorParameter('SubtreeHighlightColor', subtreeColor));

    this.getParameter('InitialXfoMode').setValue(
      Group.INITIAL_XFO_MODES.average
    );
    this.__itemsParam.setFilterFn((item) => item instanceof BaseItem);

    this.selectionGroupXfoOp = new SelectionGroupXfoOperator(
      this.getParameter('InitialXfoMode'),
      this.getParameter('GlobalXfo')
    );
  }

  clone(flags) {
    const cloned = new SelectionGroup();
    cloned.copyFrom(this, flags);
    return cloned
  }

  // eslint-disable-next-line require-jsdoc
  __bindItem(item, index) {
    if (item instanceof TreeItem) {
      const highlightColor = this.getParameter('HighlightColor').getValue();
      highlightColor.a = this.getParameter('HighlightFill').getValue();
      const subTreeColor = this.getParameter('SubtreeHighlightColor').getValue();
      item.addHighlight('selected' + this.getId(), highlightColor, false);
      item.getChildren().forEach((childItem) => {
        if (childItem instanceof TreeItem)
          childItem.addHighlight(
            'branchselected' + this.getId(),
            subTreeColor,
            true
          );
      });

      this.selectionGroupXfoOp.addItem(item, index);
    }
  }

  // eslint-disable-next-line require-jsdoc
  __unbindItem(item, index) {
    if (item instanceof TreeItem) {
      item.removeHighlight('selected' + this.getId());
      item.getChildren().forEach((childItem) => {
        if (childItem instanceof TreeItem)
          childItem.removeHighlight('branchselected' + this.getId(), true);
      });

      this.selectionGroupXfoOp.removeItem(item, index);
    }
  }

  calcGroupXfo() {}
}

/** Class representing a selection change.
 * @extends Change
 */
class SelectionChange extends Change {
  /**
   * Create a selection change.
   * @param {any} selectionManager - The selectionManager value.
   * @param {any} prevSelection - The prevSelection value.
   * @param {any} newSelection - The newSelection value.
   */
  constructor(selectionManager, prevSelection, newSelection) {
    super('SelectionChange');
    this.__selectionManager = selectionManager;
    this.__prevSelection = prevSelection;
    this.__newSelection = newSelection;
  }

  /**
   * The undo method.
   */
  undo() {
    this.__selectionManager.setSelection(this.__prevSelection, false);
  }

  /**
   * The redo method.
   */
  redo() {
    this.__selectionManager.setSelection(this.__newSelection, false);
  }

  /**
   * The toJSON method.
   * @param {any} appData - The appData param.
   * @return {any} The return value.
   */
  toJSON(context) {
    const j = super.toJSON(context);

    const itemPaths = [];
    for (const treeItem of this.__newSelection) {
      itemPaths.push(treeItem.getPath());
    }
    j.itemPaths = itemPaths;
    return j
  }

  /**
   * The fromJSON method.
   * @param {any} j - The j param.
   * @param {any} context - The context param.
   */
  fromJSON(j, context) {
    super.fromJSON(j, context);

    this.__selectionManager = context.appData.selectionManager;
    this.__prevSelection = new Set(this.__selectionManager.getSelection());

    const sceneRoot = context.appData.scene.getRoot();
    const newSelection = new Set();
    for (const itemPath of j.itemPaths) {
      newSelection.add(sceneRoot.resolvePath(itemPath, 1));
    }
    this.__newSelection = newSelection;

    this.__selectionManager.setSelection(this.__newSelection, false);
  }
}

UndoRedoManager.registerChange('SelectionChange', SelectionChange);

/** Class representing a toggle selection visibility.
 * @extends Change
 */
class ToggleSelectionVisibility extends Change {
  /**
   * Create a toggle selection visibilit.
   * @param {any} selection - The selection value.
   * @param {any} state - The state value.
   */
  constructor(selection, state) {
    super('Selection Visibility Change');
    this.selection = selection;
    this.state = state;
    this.do(this.state);
  }

  /**
   * The undo method.
   */
  undo() {
    this.do(!this.state);
  }

  /**
   * The redo method.
   */
  redo() {
    this.do(this.state);
  }

  /**
   * The do method.
   * @param {any} state - The state param.
   */
  do(state) {
    for (const treeItem of this.selection) {
      treeItem.getParameter('Visible').setValue(state);
    }
  }
}

UndoRedoManager.registerChange(
  'ToggleSelectionVisibility',
  ToggleSelectionVisibility
);

/** Class representing a selection manager */
class SelectionManager extends EventEmitter {
  /**
   * Create a selection manager.
   * @param {object} options - The options object.
   * @param {object} appData - The appData value.
   */
  constructor(appData, options = {}) {
    super();
    this.appData = appData;
    this.leadSelection = undefined;
    this.selectionGroup = new SelectionGroup(options);

    if (options.enableXfoHandles === true) {
      const size = 0.1;
      const thickness = size * 0.02;
      this.xfoHandle = new XfoHandle(size, thickness);
      this.xfoHandle.setTargetParam(
        this.selectionGroup.getParameter('GlobalXfo'),
        false
      );
      this.xfoHandle.setVisible(false);
      // this.xfoHandle.showHandles('Translate')
      // this.xfoHandle.showHandles('Rotate')
      // this.xfoHandle.showHandles('Scale')
      this.selectionGroup.addChild(this.xfoHandle);
    }

    if (this.appData.renderer) {
      this.setRenderer(this.appData.renderer);
    }
  }

  /**
   * The setRenderer method.
   * @param {any} renderer - The renderer param.
   */
  setRenderer(renderer) {
    if (this.__renderer == renderer) {
      console.warn(`Renderer already set on SelectionManager`);
      return
    }
    this.__renderer = renderer;
    this.__renderer.addTreeItem(this.selectionGroup);
  }

  /**
   * The setRenderer method.
   * @param {any} renderer - The renderer param.
   */
  setXfoMode(mode) {
    if (this.xfoHandle) {
      this.selectionGroup.getParameter('InitialXfoMode').setValue(mode);
    }
  }

  /**
   * The setRenderer method.
   * @param {any} renderer - The renderer param.
   */
  showHandles(mode) {
    if (this.xfoHandle && this.currMode != mode) {
      this.currMode = mode;
      // eslint-disable-next-line guard-for-in
      for (const key in this.handleGroup) {
        this.handleGroup[key].emit(mode == key);
      }
      this.xfoHandle.showHandles(mode);
    }
  }

  /**
   * updateHandleVisiblity determines of the Xfo Manipulation
   * handle should be displayed or not.
   */
  updateHandleVisiblity() {
    if (!this.xfoHandle) return
    const selection = this.selectionGroup.getItems();
    const visible = Array.from(selection).length > 0;
    this.xfoHandle.setVisible(visible);
    this.__renderer.requestRedraw();
  }

  /**
   * The getSelection method.
   * @return {any} The return value.
   */
  getSelection() {
    return this.selectionGroup.getItems()
  }

  /**
   * The setSelection method.
   * @param {any} newSelection - The newSelection param.
   */
  setSelection(newSelection, createUndo = true) {
    const selection = new Set(this.selectionGroup.getItems());
    const prevSelection = new Set(selection);
    for (const treeItem of newSelection) {
      if (!selection.has(treeItem)) {
        // treeItem.setSelected(true);
        selection.add(treeItem);
      }
    }
    for (const treeItem of selection) {
      if (!newSelection.has(treeItem)) {
        // treeItem.setSelected(false);
        selection.delete(treeItem);
      }
    }

    this.selectionGroup.setItems(selection);

    // Deselecting can change the lead selected item.
    if (selection.size > 0)
      this.__setLeadSelection(selection.values().next().value);
    else this.__setLeadSelection();
    this.updateHandleVisiblity();

    if (createUndo) {
      const change = new SelectionChange(this, prevSelection, selection);
      if (this.appData.undoRedoManager)
        this.appData.undoRedoManager.addChange(change);
    }
  }

  // eslint-disable-next-line require-jsdoc
  __setLeadSelection(treeItem) {
    if (this.leadSelection != treeItem) {
      this.leadSelection = treeItem;
      this.emit('leadSelectionChanged', { treeItem });
    }
  }

  /**
   * The toggleItemSelection method.
   * @param {any} treeItem - The treeItem param.
   * @param {boolean} replaceSelection - The replaceSelection param.
   */
  toggleItemSelection(treeItem, replaceSelection = true) {
    const selection = new Set(this.selectionGroup.getItems());
    const prevSelection = new Set(selection);

    // Avoid clearing the selection when we have the
    // item already selected and are deselecting it.
    // (to clear all selection)
    if (replaceSelection && !(selection.size == 1 && selection.has(treeItem))) {
      let clear = true;
      if (selection.has(treeItem)) {
        let count = 1;
        treeItem.traverse((subTreeItem) => {
          if (selection.has(subTreeItem)) {
            count++;
          }
        });
        // Note: In some cases, the item is currently selected, and
        // its children make up all the selected items. In that case
        // the user intends to deselect the item and all its children.
        // Avoid cleaning here, so the deselection can occur.
        clear = count != selection.size;
      }

      if (clear) {
        // Array.from(selection).forEach(item => {
        //   item.setSelected(false);
        // });
        selection.clear();
      }
    }

    let sel;
    if (!selection.has(treeItem)) {
      // treeItem.setSelected(true);
      selection.add(treeItem);
      sel = true;
    } else {
      // treeItem.setSelected(false);
      selection.delete(treeItem);
      sel = false;
    }

    // const preExpandSelSize = selection.size;

    // Now expand the selection to the subtree.
    // treeItem.traverse((subTreeItem)=>{
    //   if (sel) {
    //     if(!selection.has(subTreeItem)) {
    //       // subTreeItem.setSelected(true);
    //       selection.add(subTreeItem);
    //       // this.selectionGroup.addItem(treeItem);
    //     }
    //   }
    //   else {
    //     if(selection.has(subTreeItem)) {
    //       subTreeItem.setSelected(false);
    //       selection.delete(subTreeItem);
    //       // this.selectionGroup.removeItem(treeItem);
    //     }
    //   }
    // })

    this.selectionGroup.setItems(selection);

    if (sel && selection.size === 1) {
      this.__setLeadSelection(treeItem);
    } else if (!sel) {
      // Deselecting can change the lead selected item.
      if (selection.size === 1)
        this.__setLeadSelection(selection.values().next().value);
      else if (selection.size === 0) this.__setLeadSelection();
    }

    const change = new SelectionChange(this, prevSelection, selection);
    if (this.appData.undoRedoManager)
      this.appData.undoRedoManager.addChange(change);

    this.updateHandleVisiblity();
    this.emit('selectionChanged', { prevSelection, selection });
  }

  /**
   * The clearSelection method.
   * @param {boolean} newChange - The newChange param.
   * @return {any} The return value.
   */
  clearSelection(newChange = true) {
    const selection = new Set(this.selectionGroup.getItems());
    if (selection.size == 0) return false
    let prevSelection;
    if (newChange) {
      prevSelection = new Set(selection);
    }
    // for (const treeItem of selection) {
    //   treeItem.setSelected(false);
    // }
    selection.clear();
    this.selectionGroup.setItems(selection);
    this.updateHandleVisiblity();
    if (newChange) {
      const change = new SelectionChange(this, prevSelection, selection);
      if (this.appData.undoRedoManager)
        this.appData.undoRedoManager.addChange(change);
      this.emit('selectionChanged', { selection, prevSelection });
    }
    return true
  }

  /**
   * The selectItems method.
   * @param {any} treeItems - The treeItems param.
   * @param {boolean} replaceSelection - The replaceSelection param.
   */
  selectItems(treeItems, replaceSelection = true) {
    const selection = new Set(this.selectionGroup.getItems());
    const prevSelection = new Set(selection);

    if (replaceSelection) {
      selection.clear();
    }

    for (const treeItem of treeItems) {
      if (!treeItem.getSelected()) {
        selection.add(treeItem);
      }
    }

    const change = new SelectionChange(this, prevSelection, selection);

    if (this.appData.undoRedoManager)
      this.appData.undoRedoManager.addChange(change);

    this.selectionGroup.setItems(selection);
    if (selection.size === 1) {
      this.__setLeadSelection(selection.values().next().value);
    } else if (selection.size === 0) {
      this.__setLeadSelection();
    }
    this.updateHandleVisiblity();
    this.emit('selectionChanged', { prevSelection, selection });
  }

  /**
   * The deselectItems method.
   * @param {any} treeItems - The treeItems param.
   */
  deselectItems(treeItems) {
    const selection = this.selectionGroup.getItems();
    const prevSelection = new Set(selection);

    for (const treeItem of treeItems) {
      if (treeItem.getSelected()) {
        // treeItem.setSelected(false);
        selection.delete(selectedParam);
        // treeItem.traverse((subTreeItem)=>{
        //   if(!selection.has(subTreeItem)) {
        //     subTreeItem.setSelected(false);
        //     selection.delete(treeItem);
        //   }
        // })
      }
    }

    this.selectionGroup.setItems(selection);
    const change = new SelectionChange(this, prevSelection, selection);

    if (this.appData.undoRedoManager)
      this.appData.undoRedoManager.addChange(change);

    if (selection.size === 1) {
      this.__setLeadSelection(selection.values().next().value);
    } else if (selection.size === 0) {
      this.__setLeadSelection();
    }
    this.updateHandleVisiblity();
    this.emit('selectionChanged', { prevSelection, selection });
  }

  /**
   * The toggleSelectionVisiblity method.
   */
  toggleSelectionVisiblity() {
    if (this.leadSelection) {
      const selection = this.selectionGroup.getItems();
      const state = !this.leadSelection.getVisible();
      const change = new ToggleSelectionVisibility(selection, state);
      if (this.appData.undoRedoManager)
        this.appData.undoRedoManager.addChange(change);
    }
  }

  // ////////////////////////////////////
  //

  /**
   * The startPickingMode method.
   * @param {any} label - The label param.
   * @param {any} fn - The fn param.
   * @param {any} filterFn - The filterFn param.
   * @param {any} count - The count param.
   */
  startPickingMode(label, fn, filterFn, count) {
    // Display this in a status bar.
    console.log(label);
    this.__pickCB = fn;
    this.__pickFilter = filterFn;
    this.__pickCount = count;
    this.__picked = [];
  }

  /**
   * The pickingFilter method.
   * @param {any} item - The item param.
   * @return {any} The return value.
   */
  pickingFilter(item) {
    return this.__pickFilter(item)
  }

  /**
   * The pickingModeActive method.
   * @return {any} The return value.
   */
  pickingModeActive() {
    return this.__pickCB != undefined
  }

  /**
   * The cancelPickingMode method.
   */
  cancelPickingMode() {
    this.__pickCB = undefined;
  }

  /**
   * The pick method.
   * @param {any} item - The item param.
   */
  pick(item) {
    if (this.__pickCB) {
      if (Array.isArray(item)) {
        if (this.__pickFilter)
          this.__picked = this.__picked.concat(item.filter(this.__pickFilter));
        else this.__picked = this.__picked.concat(item);
      } else {
        if (this.__pickFilter && !this.__pickFilter(item)) return
        this.__picked.push(item);
      }
      if (this.__picked.length == this.__pickCount) {
        this.__pickCB(this.__picked);
        this.__pickCB = undefined;
      }
    }
  }
}

/**
 * Class representing a treeItemeter value change.
 * @extends Change
 */
class TreeItemAddChange extends Change {
  /**
   * Create a TreeItemAddChange.
   * @treeItem {any} treeItem - The treeItem value.
   * @treeItem {any} newValue - The newValue value.
   */
  constructor(treeItem, owner, selectionManager) {
    if (treeItem) {
      super(treeItem.getName() + ' Added');
      this.treeItem = treeItem;
      this.owner = owner;
      this.selectionManager = selectionManager;
      this.prevSelection = new Set(this.selectionManager.getSelection());
      this.treeItemIndex = this.owner.addChild(this.treeItem);
      this.selectionManager.setSelection(new Set([this.treeItem]), false);

      this.treeItem.addRef(this);
    } else {
      super();
    }
  }

  /**
   * The undo method.
   */
  undo() {
    if (this.treeItem instanceof Operator) {
      const op = this.treeItem;
      op.detach();
    } else if (this.treeItem instanceof TreeItem) {
      this.treeItem.traverse((subTreeItem) => {
        if (subTreeItem instanceof Operator) {
          const op = subTreeItem;
          op.detach();
        }
      }, false);
    }
    this.owner.removeChild(this.treeItemIndex);
    if (this.selectionManager)
      this.selectionManager.setSelection(this.prevSelection, false);
  }

  /**
   * The redo method.
   */
  redo() {
    // Now re-attach all the detached operators.
    if (this.treeItem instanceof Operator) {
      const op = this.treeItem;
      op.reattach();
    } else if (subTreeItem instanceof TreeItem) {
      this.treeItem.traverse((subTreeItem) => {
        if (subTreeItem instanceof Operator) {
          const op = subTreeItem;
          op.reattach();
        }
      }, false);
    }
    this.owner.addChild(this.treeItem);
    if (this.selectionManager)
      this.selectionManager.setSelection(new Set([this.treeItem]), false);
  }

  /**
   * The toJSON method.
   * @treeItem {any} context - The context treeItem.
   * @return {any} The return value.
   */
  toJSON(context) {
    const j = {
      name: this.name,
      treeItem: this.treeItem.toJSON(context),
      treeItemPath: this.treeItem.getPath(),
      treeItemIndex: this.treeItemIndex,
    };
    return j
  }

  /**
   * The fromJSON method.
   * @treeItem {any} j - The j treeItem.
   * @treeItem {any} context - The context treeItem.
   */
  fromJSON(j, context) {
    const treeItem = sgFactory.constructClass(j.treeItem.type);
    if (!treeItem) {
      console.warn('resolvePath is unable to conostruct', j.treeItem);
      return
    }
    this.name = j.name;
    this.treeItem = treeItem;
    this.treeItem.addRef(this);

    this.treeItem.fromJSON(j.treeItem, context);
    this.treeItemIndex = this.owner.addChild(this.treeItem, false, false);
  }

  destroy() {
    this.treeItem.removeRef(this);
  }
}

UndoRedoManager.registerChange('TreeItemAddChange', TreeItemAddChange);

/**
 * Class representing a treeItemeter value change.
 * @extends Change
 */
class TreeItemsRemoveChange extends Change {
  /**
   * Create a TreeItemsRemoveChange.
   * @treeItem {any} treeItem - The treeItem value.
   * @treeItem {any} newValue - The newValue value.
   */
  constructor(items, appData) {
    super();
    this.items = [];
    this.itemOwners = [];
    this.itemPaths = [];
    this.itemIndices = [];
    if (items) {
      this.selectionManager = appData.selectionManager;
      this.prevSelection = new Set(this.selectionManager.getSelection());
      this.items = items;
      this.newSelection = new Set(this.prevSelection);

      const itemNames = [];
      this.items.forEach((item) => {
        const owner = item.getOwner();
        const itemIndex = owner.getChildIndex(item);
        itemNames.push(item.getName());
        item.addRef(this);
        this.itemOwners.push(owner);
        this.itemPaths.push(item.getPath());
        this.itemIndices.push(itemIndex);

        if (this.selectionManager && this.newSelection.has(item))
          this.newSelection.delete(item);
        if (item instanceof Operator) {
          const op = item;
          op.detach();
        } else if (item instanceof TreeItem) {
          item.traverse((subTreeItem) => {
            if (subTreeItem instanceof Operator) {
              const op = subTreeItem;
              op.detach();
            }
            if (this.selectionManager && this.newSelection.has(subTreeItem))
              this.newSelection.delete(subTreeItem);
          }, false);
        }

        owner.removeChild(itemIndex);
      });
      this.selectionManager.setSelection(this.newSelection, false);

      this.name = itemNames + ' Deleted';
    }
  }

  /**
   * The undo method.
   */
  undo() {
    this.items.forEach((item, index) => {
      this.itemOwners[index].insertChild(
        item,
        this.itemIndices[index],
        false,
        false
      );

      // Now re-attach all the detached operators.
      if (item instanceof Operator) {
        const op = item;
        op.reattach();
      } else if (subTreeItem instanceof TreeItem) {
        item.traverse((subTreeItem) => {
          if (subTreeItem instanceof Operator) {
            const op = subTreeItem;
            op.reattach();
          }
        }, false);
      }
    });
    if (this.selectionManager)
      this.selectionManager.setSelection(this.prevSelection, false);
  }

  /**
   * The redo method.
   */
  redo() {
    if (this.selectionManager)
      this.selectionManager.setSelection(this.newSelection, false);

    // Now re-detach all the operators.
    this.items.forEach((item, index) => {
      this.itemOwners[index].removeChild(this.itemIndices[index]);

      if (item instanceof Operator) {
        const op = item;
        op.detach();
      } else if (subTreeItem instanceof TreeItem) {
        item.traverse((subTreeItem) => {
          if (subTreeItem instanceof Operator) {
            const op = subTreeItem;
            op.detach();
          }
        }, false);
      }
    });
  }

  /**
   * The toJSON method.
   * @treeItem {any} appData - The appData treeItem.
   * @return {any} The return value.
   */
  toJSON(appData) {
    const j = {
      name: this.name,
      items: [],
      itemPaths: this.itemPaths,
      itemIndices: this.itemIndices,
    };
    this.items.forEach((item) => {
      j.items.push(item.toJSON());
    });
    return j
  }

  /**
   * The fromJSON method.
   * @treeItem {any} j - The j treeItem.
   * @treeItem {any} appData - The appData treeItem.
   */
  fromJSON(j, appData) {
    this.name = j.name;
    j.itemPaths.forEach((itemPath) => {
      const item = appData.scene.getRoot().resolvePath(itemPath, 1);
      if (!item) {
        console.warn('resolvePath is unable to resolve', itemPath);
        return
      }
      const owner = item.getOwner();
      this.itemOwners.push(owner);
      this.itemPaths.push(item.getPath());
      this.itemIndices.push(owner.getChildIndex(item));
    });
  }

  /**
   * The destroy method cleans up any data requiring manual cleanup.
   * Deleted items still on the undo stack are then flushed and any
   * GPU resoruces cleaned up.
   */
  destroy() {
    this.items.forEach((item) => item.removeRef(this));
  }
}

UndoRedoManager.registerChange('TreeItemsRemoveChange', TreeItemsRemoveChange);

/**
 * Class representing a treeItemeter value change.
 * @extends Change
 */
class TreeItemMoveChange extends Change {
  /**
   * Create a TreeItemMoveChange.
   * @treeItem {any} treeItem - The treeItem value.
   * @treeItem {any} newOwner - The newOwner value.
   */
  constructor(treeItem, newOwner) {
    if (treeItem) {
      console.log('TreeItemMoveChange');
      super(treeItem.getName() + ' Added');
      this.treeItem = treeItem;
      this.oldOwner = this.treeItem.getOwner();
      this.oldOwnerIndex = this.oldOwner.getChildIndex(this.treeItem);
      this.newOwner = newOwner;
      this.newOwner.addChild(this.treeItem, true);
    } else {
      super();
    }
  }

  /**
   * The undo method.
   */
  undo() {
    this.oldOwner.insertChild(this.treeItem, this.oldOwnerIndex, true);
  }

  /**
   * The redo method.
   */
  redo() {
    this.newOwner.addChild(this.treeItem, true);
  }

  /**
   * The toJSON method.
   * @treeItem {any} context - The context treeItem.
   * @return {any} The return value.
   */
  toJSON(context) {
    const j = {
      name: this.name,
      treeItemPath: this.treeItem.getPath(),
      newOwnerPath: this.newOwner.getPath(),
    };
    return j
  }

  /**
   * The fromJSON method.
   * @treeItem {any} j - The j treeItem.
   * @treeItem {any} context - The context treeItem.
   */
  fromJSON(j, context) {
    const treeItem = appData.scene.getRoot().resolvePath(j.treeItemPath, 1);
    if (!treeItem) {
      console.warn('resolvePath is unable to resolve', j.treeItemPath);
      return
    }
    const newOwner = appData.scene.getRoot().resolvePath(j.newOwnerPath, 1);
    if (!newOwner) {
      console.warn('resolvePath is unable to resolve', j.newOwnerPath);
      return
    }
    this.name = j.name;
    this.treeItem = treeItem;
    this.newOwner = newOwner;

    this.oldOwner = this.treeItem.getOwner();
    this.oldOwnerIndex = this.oldOwner.getChildIndex(this.treeItem);
    this.newOwner.addChild(this.treeItem, true);
  }
}

UndoRedoManager.registerChange('TreeItemMoveChange', TreeItemMoveChange);

/** Class representing a tool manager. */
class ToolManager extends EventEmitter {
  /**
   * Create a tool manager.
   * @param {any} appData - The appData value.
   */
  constructor(appData) {
    super();
    this.__toolStack = [];
    this.appData = appData;

    this.avatarPointerVisible = false;
    this.avatarPointerHighlighted = false;
  }

  /**
   * The insertTool method.
   * @param {any} tool - The tool param.
   * @param {any} index - The index param.
   */
  insertTool(tool, index) {
    this.__toolStack.splice(index, 0, tool);
    tool.install(index);
  }

  /**
   * The insertToolBefore method.
   * @param {any} tool - The tool param.
   * @param {any} beforeTool - The beforeTool param.
   * @return {any} The return value.
   */
  insertToolBefore(tool, beforeTool) {
    // Note: when activating new tools in VR, we
    // can insert the new tool below the VRUI tool,
    // so that once the VR UI is closed, it becomes
    // the new active tool.
    const index = this.__toolStack.indexOf(beforeTool) + 1;
    this.__toolStack.splice(index - 1, 0, tool);
    tool.install(index);
    return index
  }

  /**
   * The insertToolAfter method.
   * @param {any} tool - The tool param.
   * @param {any} afterTool - The afterTool param.
   * @return {any} The return value.
   */
  insertToolAfter(tool, afterTool) {
    const index = this.__toolStack.indexOf(afterTool) + 1;
    this.__toolStack.splice(index, 0, tool);
    tool.install(index);
    if (index == this.__toolStack.length) {
      tool.activateTool();
    }
    return index
  }

  /**
   * The getToolIndex method.
   * @param {any} tool - The tool param.
   * @return {any} The return value.
   */
  getToolIndex(tool) {
    return this.__toolStack.indexOf(tool)
  }

  /**
   * The removeTool method.
   * @param {any} index - The index param.
   */
  removeTool(index) {
    const tool = this.__toolStack[index];
    this.__toolStack.splice(index, 1);
    tool.uninstall();
    if (index == this.__toolStack.length) {
      tool.deactivateTool();

      const nextTool = this.currTool();
      if (nextTool) nextTool.activateTool();
    }
  }

  /**
   * The removeToolByHandle method.
   * @param {any} tool - The tool param.
   */
  removeToolByHandle(tool) {
    this.removeTool(this.getToolIndex(tool));
  }

  /**
   * The pushTool method.
   * @param {any} tool - The tool param.
   * @return {any} The return value.
   */
  pushTool(tool) {
    const prevTool = this.currTool();
    if (prevTool) {
      if (tool == prevTool) {
        console.warn('Tool Already Pushed on the stack:', tool.constructor.name);
        return
      } else {
        // Note: only the lead tool is 'active' and displaying an icon.
        // A tool can recieve events even if not active, if it is on
        // the stack.
        prevTool.deactivateTool();
      }
    }

    this.__toolStack.push(tool);
    tool.install(this.__toolStack.length - 1);
    tool.activateTool();

    console.log('ToolManager.pushTool:', tool.constructor.name);

    return this.__toolStack.length - 1
  }

  // eslint-disable-next-line require-jsdoc
  __removeCurrTool() {
    if (this.__toolStack.length > 0) {
      const prevTool = this.__toolStack.pop();
      prevTool.deactivateTool();
      prevTool.uninstall();
    }
  }

  /**
   * The popTool method.
   */
  popTool() {
    this.__removeCurrTool();
    const tool = this.currTool();
    if (tool) tool.activateTool();
    // console.log("ToolManager.popTool:", prevTool.constructor.name, (tool ? tool.constructor.name : ''))
  }

  /**
   * The replaceCurrentTool method.
   * @param {any} tool - The tool param.
   */
  replaceCurrentTool(tool) {
    this.__removeCurrTool();
    this.__toolStack.push(tool);
    tool.install(this.__toolStack.length - 1);
    tool.activateTool();
  }

  /**
   * The currTool method.
   * @return {any} The return value.
   */
  currTool() {
    return this.__toolStack[this.__toolStack.length - 1]
  }

  /**
   * The currToolName method.
   * @return {any} The return value.
   */
  currToolName() {
    return this.__toolStack[this.__toolStack.length - 1].getName()
  }

  /**
   * The bind method.
   * @param {any} renderer - The renderer param.
   */
  bind(renderer) {
    const viewport = renderer.getViewport();

    this.mouseDownId = viewport.on('mouseDown', this.onMouseDown.bind(this));
    this.mouseMoveId = viewport.on('mouseMove', this.onMouseMove.bind(this));
    this.mouseUpId = viewport.on('mouseUp', this.onMouseUp.bind(this));
    this.mouseLeaveId = viewport.on('mouseLeave', this.onMouseLeave.bind(this));
    this.mouseDoubleClickedId = viewport.on(
      'mouseDoubleClicked',
      this.onDoubleClick.bind(this)
    );
    this.mouseWheelId = viewport.on('mouseWheel', this.onWheel.bind(this));

    // ///////////////////////////////////
    // Keyboard events
    this.keyDownId = viewport.on('keyDown', this.onKeyDown.bind(this));
    this.keyUpId = viewport.on('keyUp', this.onKeyUp.bind(this));
    this.keyPressedId = viewport.on('keyPressed', this.onKeyPressed.bind(this));

    // ///////////////////////////////////
    // Touch events
    this.touchStartId = viewport.on('touchStart', this.onTouchStart.bind(this));
    this.touchMoveId = viewport.on('touchMove', this.onTouchMove.bind(this));
    this.touchEndId = viewport.on('touchEnd', this.onTouchEnd.bind(this));
    this.touchCancelId = viewport.on(
      'touchCancel',
      this.onTouchCancel.bind(this)
    );
    this.doubleTappedId = viewport.on(
      'doubleTapped',
      this.onDoubleTap.bind(this)
    );

    this.appData.renderer.getXRViewport().then((xrvp) => {
      // ///////////////////////////////////
      // VRController events
      this.controllerDownId = xrvp.on(
        'controllerButtonDown',
        this.onVRControllerButtonDown.bind(this)
      );
      this.controllerUpId = xrvp.on(
        'controllerButtonUp',
        this.onVRControllerButtonUp.bind(this)
      );
      this.controllerDoubleClickId = xrvp.on(
        'controllerDoubleClicked',
        this.onVRControllerDoubleClicked.bind(this)
      );
      this.onVRPoseChangedId = xrvp.on(
        'viewChanged',
        this.onVRPoseChanged.bind(this)
      );
    });
  }

  /**
   * The onMouseDown method.
   * @param {any} event - The event param.
   */
  onMouseDown(event) {
    event.undoRedoManager = this.appData.undoRedoManager;
    event.showPointerOnAvatar = true;
    let i = this.__toolStack.length;
    while (i--) {
      const tool = this.__toolStack[i];
      if (tool && tool.onMouseDown(event) == true) break
    }

    if (event.showPointerOnAvatar == true) {
      if (!this.avatarPointerVisible) {
        this.emit('movePointer', event);
        this.avatarPointerVisible = true;
      }
      if (!this.avatarPointerHighlighted) {
        this.emit('hilightPointer', event);
        this.avatarPointerHighlighted = true;
      }
    } else if (this.avatarPointerVisible) {
      this.avatarPointerVisible = false;
      this.emit('hidePointer');
    }
  }

  /**
   * The onMouseMove method.
   * @param {any} event - The event param.
   */
  onMouseMove(event) {
    event.undoRedoManager = this.appData.undoRedoManager;
    event.showPointerOnAvatar = true;
    let i = this.__toolStack.length;
    while (i--) {
      const tool = this.__toolStack[i];
      if (tool && tool.onMouseMove(event) == true) break
    }
    if (event.showPointerOnAvatar == true) {
      this.emit('movePointer', event);
      this.avatarPointerVisible = true;
    } else if (this.avatarPointerVisible) {
      this.avatarPointerVisible = false;
      this.emit('hidePointer');
    }
  }

  /**
   * The onMouseUp method.
   * @param {any} event - The event param.
   */
  onMouseUp(event) {
    event.undoRedoManager = this.appData.undoRedoManager;
    event.showPointerOnAvatar = true;
    let i = this.__toolStack.length;
    while (i--) {
      const tool = this.__toolStack[i];
      if (tool && tool.onMouseUp(event) == true) break
    }
    if (event.showPointerOnAvatar == true) {
      if (this.avatarPointerHighlighted) {
        this.emit('unhilightPointer', event);
        this.avatarPointerHighlighted = false;
      }
    } else if (this.avatarPointerVisible) {
      this.avatarPointerVisible = false;
      this.emit('hidePointer');
    }
  }

  /**
   * The onMouseLeave method.
   * @param {any} event - The event param.
   */
  onMouseLeave(event) {
    let i = this.__toolStack.length;
    while (i--) {
      const tool = this.__toolStack[i];
      if (tool && tool.onMouseLeave && tool.onMouseLeave(event) == true) break
    }
    if (this.avatarPointerVisible) {
      this.avatarPointerVisible = false;
      this.emit('hidePointer');
    }
  }

  /**
   * The onDoubleClick method.
   * @param {any} event - The event param.
   */
  onDoubleClick(event) {
    let i = this.__toolStack.length;
    while (i--) {
      const tool = this.__toolStack[i];
      if (tool && tool.onDoubleClick(event) == true) break
    }
  }

  /**
   * The onWheel method.
   * @param {any} event - The event param.
   */
  onWheel(event) {
    event.undoRedoManager = this.appData.undoRedoManager;
    let i = this.__toolStack.length;
    while (i--) {
      const tool = this.__toolStack[i];
      if (tool && tool.onWheel(event) == true) break
    }
  }

  // ///////////////////////////////////
  // Keyboard events

  /**
   * The onKeyPressed method.
   * @param {any} key - The event param.
   * @param {any} event - The event param.
   */
  onKeyPressed(event) {
    event.undoRedoManager = this.appData.undoRedoManager;
    let i = this.__toolStack.length;
    while (i--) {
      const tool = this.__toolStack[i];
      if (tool && tool.onKeyPressed(event, event, viewport) == true) break
    }
  }

  /**
   * The onKeyDown method.
   * @param {any} key - The event param.
   * @param {any} event - The event param.
   */
  onKeyDown(event) {
    event.undoRedoManager = this.appData.undoRedoManager;
    let i = this.__toolStack.length;
    while (i--) {
      const tool = this.__toolStack[i];
      if (tool && tool.onKeyDown(event) == true) break
    }
  }

  /**
   * The onKeyUp method.
   * @param {any} key - The event param.
   * @param {any} event - The event param.
   */
  onKeyUp(event) {
    event.undoRedoManager = this.appData.undoRedoManager;
    let i = this.__toolStack.length;
    while (i--) {
      const tool = this.__toolStack[i];
      if (tool && tool.onKeyUp(event) == true) break
    }
  }

  // ///////////////////////////////////
  // Touch events

  /**
   * The onTouchStart method.
   * @param {any} event - The event param.
   */
  onTouchStart(event) {
    event.undoRedoManager = this.appData.undoRedoManager;
    let i = this.__toolStack.length;
    while (i--) {
      const tool = this.__toolStack[i];
      if (tool && tool.onTouchStart(event) == true) break
    }
  }

  /**
   * The onTouchMove method.
   * @param {any} event - The event param.
   */
  onTouchMove(event) {
    event.undoRedoManager = this.appData.undoRedoManager;
    let i = this.__toolStack.length;
    while (i--) {
      const tool = this.__toolStack[i];
      if (tool && tool.onTouchMove(event) == true) break
    }
  }

  /**
   * The onTouchEnd method.
   * @param {any} event - The event param.
   */
  onTouchEnd(event) {
    event.undoRedoManager = this.appData.undoRedoManager;
    let i = this.__toolStack.length;
    while (i--) {
      const tool = this.__toolStack[i];
      if (tool && tool.onTouchEnd(event) == true) break
    }
  }

  /**
   * The onTouchCancel method.
   * @param {any} event - The event param.
   */
  onTouchCancel(event) {
    event.undoRedoManager = this.appData.undoRedoManager;
    let i = this.__toolStack.length;
    while (i--) {
      const tool = this.__toolStack[i];
      if (tool && tool.onTouchCancel(event) == true) break
    }
  }

  /**
   * The onDoubleTap method.
   * @param {any} event - The event param.
   */
  onDoubleTap(event) {
    event.undoRedoManager = this.appData.undoRedoManager;
    let i = this.__toolStack.length;
    while (i--) {
      const tool = this.__toolStack[i];
      if (tool && tool.onDoubleTap(event) == true) break
    }
  }

  // ///////////////////////////////////
  // VRController events

  /**
   * The __prepareEvent method.
   * @param {any} event - The event that occurs.
   * @private
   */
  __prepareEvent(event) {
    event.undoRedoManager = this.appData.undoRedoManager;
    event.propagating = true;
    event.stopPropagation = () => {
      event.propagating = false;
    };
  }

  /**
   * The onVRControllerButtonDown method.
   * @param {any} event - The event param.
   */
  onVRControllerButtonDown(event) {
    this.__prepareEvent(event);
    let i = this.__toolStack.length;
    while (i--) {
      const tool = this.__toolStack[i];
      if (tool && tool.onVRControllerButtonDown(event) == true) break
      if (!event.propagating) break
    }
  }

  /**
   * The onVRControllerButtonUp method.
   * @param {any} event - The event param.
   */
  onVRControllerButtonUp(event) {
    this.__prepareEvent(event);
    let i = this.__toolStack.length;
    while (i--) {
      const tool = this.__toolStack[i];
      if (tool && tool.onVRControllerButtonUp(event) == true) break
      if (!event.propagating) break
    }
  }

  /**
   * The onVRControllerDoubleClicked method.
   * @param {any} event - The event param.
   */
  onVRControllerDoubleClicked(event) {
    this.__prepareEvent(event);
    let i = this.__toolStack.length;
    while (i--) {
      const tool = this.__toolStack[i];
      if (tool && tool.onVRControllerDoubleClicked(event) == true) break
      if (!event.propagating) break
    }
  }

  /**
   * The onVRPoseChanged method.
   * @param {any} event - The event param.
   */
  onVRPoseChanged(event) {
    this.__prepareEvent(event);
    let i = this.__toolStack.length;
    while (i--) {
      const tool = this.__toolStack[i];
      if (tool && tool.onVRPoseChanged(event) == true) break
      if (!event.propagating) break
    }
  }

  /**
   * The destroy method.
   */
  destroy() {
    const viewport = this.appData.renderer.getViewport();

    viewport.removeListenerById('mouseDown', this.mouseDownId);
    viewport.removeListenerById('mouseMove', this.mouseMoveId);
    viewport.removeListenerById('mouseUp', this.mouseUpId);
    viewport.removeListenerById('mouseLeave', this.mouseUpId);
    viewport.removeListenerById('mouseWheel', this.mouseWheelId);

    // ///////////////////////////////////
    // Keyboard events
    viewport.removeListenerById('keyDown', this.keyDownId);
    viewport.removeListenerById('keyUp', this.keyUpId);
    viewport.removeListenerById('keyPressed', this.keyPressedId);

    // ///////////////////////////////////
    // Touch events
    viewport.removeListenerById('touchStart', this.touchStartId);
    viewport.removeListenerById('touchMove', this.touchMoveId);
    viewport.removeListenerById('touchEnd', this.touchEndId);
    viewport.removeListenerById('touchCancel', this.touchCancelId);

    this.appData.renderer.getXRViewport().then((xrvp) => {
      // ///////////////////////////////////
      // VRController events
      viewport.removeListenerById('controllerDown', this.controllerDownId);
      viewport.removeListenerById('controllerUp', this.controllerUpId);
      viewport.removeListenerById('viewChanged', this.onVRPoseChangedId);
    });
  }
}

/**
 * Class representing a base tool.
 * @extends ParameterOwner
 */
class BaseTool extends ParameterOwner {
  /**
   * Create a base tool.
   * @param {any} appData - The appData value.
   */
  constructor(appData) {
    super();
    if (!appData) console.error('App data not provided to tool');
    this.appData = appData;

    this.__params = [];
    this.__installed = false;
    this.__activated = false;
  }

  /**
   * The getName method.
   * @return {any} The return value.
   */
  getName() {
    return this.constructor.name
  }

  /**
   * The isPrimaryTool method.
   * @return {any} The return value.
   */
  isPrimaryTool() {
    return false
  }

  // ///////////////////////////////////
  // Tools on the tool stack.

  /**
   * The installed method.
   * @return {any} The return value.
   */
  installed() {
    return this.__installed
  }

  /**
   * The install method.
   * @param {any} index - The index param.
   */
  install(index) {
    if (this.__installed) throw new Error('Tool already installed')
    this.index = index;
    this.__installed = true;
    this.emit('installChanged', { installed: this.__installed });
  }

  /**
   * The uninstall method.
   */
  uninstall() {
    this.__installed = false;
    this.emit('installChanged', { installed: this.__installed });
  }

  /**
   * The activateTool method.
   */
  activateTool() {
    if (this.__activated) throw new Error('Tool already activate')
    this.__activated = true;
    this.emit('activatedChanged', { activated: this.__activated });
  }

  /**
   * The deactivateTool method.
   */
  deactivateTool() {
    this.__activated = false;
    this.emit('activatedChanged', { activated: this.__activated });
  }

  // ///////////////////////////////////
  // Mouse events

  /**
   * The onMouseDown method.
   * @param {any} event - The event param.
   */
  onMouseDown(event) {}

  /**
   * The onMouseMove method.
   * @param {any} event - The event param.
   */
  onMouseMove(event) {}

  /**
   * The onMouseUp method.
   * @param {any} event - The event param.
   */
  onMouseUp(event) {}

  /**
   * The onDoubleClick method.
   * @param {any} event - The event param.
   */
  onDoubleClick(event) {}

  /**
   * The onWheel method.
   * @param {any} event - The event param.
   */
  onWheel(event) {}

  // ///////////////////////////////////
  // Keyboard events

  /**
   * The onKeyPressed method.
   * @param {any} key - The key param.
   * @param {any} event - The event param.
   */
  onKeyPressed(event) {}

  /**
   * The onKeyDown method.
   * @param {any} key - The key param.
   * @param {any} event - The event param.
   */
  onKeyDown(event) {}

  /**
   * The onKeyUp method.
   * @param {any} key - The key param.
   * @param {any} event - The event param.
   */
  onKeyUp(event) {}

  // ///////////////////////////////////
  // Touch events

  /**
   * The onTouchStart method.
   * @param {any} event - The event param.
   */
  onTouchStart(event) {}

  /**
   * The onTouchMove method.
   * @param {any} event - The event param.
   */
  onTouchMove(event) {}

  /**
   * The onTouchEnd method.
   * @param {any} event - The event param.
   */
  onTouchEnd(event) {}

  /**
   * The onTouchCancel method.
   * @param {any} event - The event param.
   */
  onTouchCancel(event) {}

  /**
   * The onDoubleTap method.
   * @param {any} event - The event param.
   */
  onDoubleTap(event) {}

  // ///////////////////////////////////
  // VRController events

  /**
   * The onVRControllerButtonDown method.
   * @param {any} event - The event param.
   */
  onVRControllerButtonDown(event) {}

  /**
   * The onVRControllerButtonUp method.
   * @param {any} event - The event param.
   */
  onVRControllerButtonUp(event) {}

  /**
   * The onVRControllerDoubleClicked method.
   * @param {any} event - The event param.
   */
  onVRControllerDoubleClicked(event) {}

  /**
   * The onVRPoseChanged method.
   * @param {any} event - The event param.
   */
  onVRPoseChanged(event) {}
}

const VIEW_TOOL_MODELS = {
  VIEWER: 0,
  DCC: 1,
};

/**
 * Class representing a view tool
 * @extends BaseTool
 */
class ViewTool extends BaseTool {
  /**
   * Create an axial rotation scene widget.
   * @param {any} appData - The appData value.
   * @param {any} maipulationModel - The maipulationModel value.
   */
  constructor(appData, maipulationModel = VIEW_TOOL_MODELS.VIEWER) {
    super(appData);
    console.log('ViewTool:', maipulationModel);

    this.__maipulationModel = maipulationModel;
    this.__defaultMode = 'orbit';
    this.__mode = this.__defaultMode;

    this.__mouseDragDelta = new Vec2();
    this.__keyboardMovement = false;
    this.__keysPressed = [];
    this.__maxVel = 0.002;
    this.__velocity = new Vec3$1();

    this.__ongoingTouches = {};

    this.__orbitRateParam = this.addParameter(
      new NumberParameter('orbitRate', 1)
    );
    this.__dollySpeedParam = this.addParameter(
      new NumberParameter('dollySpeed', 0.02)
    );
    this.__mouseWheelDollySpeedParam = this.addParameter(
      new NumberParameter('mouseWheelDollySpeed', 0.002)
    );

    this.__controllerTriggersHeld = [];
  }

  // /////////////////////////////////////
  //

  /**
   * The activateTool method.
   */
  activateTool() {
    super.activateTool();
    console.log('activateTool.ViewTool');

    this.appData.renderer.getDiv().style.cursor = 'default';

    this.appData.renderer.getXRViewport().then((xrvp) => {
      if (!this.vrControllerToolTip) {
        this.vrControllerToolTip = new Sphere(0.02 * 0.75);
        this.vrControllerToolTipMat = new Material('Cross', 'FlatSurfaceShader');
        this.vrControllerToolTipMat
          .getParameter('BaseColor')
          .setValue(new Color('#03E3AC'));
        this.vrControllerToolTipMat.visibleInGeomDataBuffer = false;
      }
      const addIconToController = (controller) => {
        const geomItem = new GeomItem(
          'HandleToolTip',
          this.vrControllerToolTip,
          this.vrControllerToolTipMat
        );
        controller.getTipItem().removeAllChildren();
        controller.getTipItem().addChild(geomItem, false);
      };
      for (const controller of xrvp.getControllers()) {
        addIconToController(controller);
      }
      this.addIconToControllerId = xrvp.on(
        'controllerAdded',
        addIconToController
      );
    });
  }

  /**
   * The deactivateTool method.
   */
  deactivateTool() {
    super.deactivateTool();

    this.appData.renderer.getXRViewport().then((xrvp) => {
      // if(this.vrControllerToolTip) {
      //   // for(let controller of xrvp.getControllers()) {
      //   //   controller.getTipItem().removeAllChildren();
      //   // }
      // }
      xrvp.removeListenerById('controllerAdded', this.addIconToControllerId);
    });
  }

  // /////////////////////////////////////
  //

  /**
   * The setDefaultMode method.
   * @param {any} mode - The mode param.
   */
  setDefaultMode(mode) {
    this.__defaultMode = mode;
  }

  /**
   * The look method.
   * @param {any} dragVec - The dragVec param.
   * @param {any} viewport - The viewport param.
   */
  look(dragVec, viewport) {
    const focalDistance = viewport.getCamera().getFocalDistance();
    const orbitRate =
      this.__orbitRateParam.getValue() * SystemDesc.isMobileDevice ? -1 : 1;

    if (this.__keyboardMovement) {
      const globalXfo = viewport
        .getCamera()
        .getParameter('GlobalXfo')
        .getValue();
      this.__mouseDownCameraXfo = globalXfo.clone();
      this.__mouseDownZaxis = globalXfo.ori.getZaxis();
      const targetOffset = this.__mouseDownZaxis.scale(-focalDistance);
      this.__mouseDownCameraTarget = globalXfo.tr.add(targetOffset);
    }

    const globalXfo = this.__mouseDownCameraXfo.clone();

    // Orbit
    const orbit = new Quat();
    orbit.rotateZ((dragVec.x / viewport.getWidth()) * Math.PI * orbitRate);
    globalXfo.ori = orbit.multiply(globalXfo.ori);

    // Pitch
    const pitch = new Quat();
    pitch.rotateX((dragVec.y / viewport.getHeight()) * Math.PI * orbitRate);
    globalXfo.ori.multiplyInPlace(pitch);

    if (this.__keyboardMovement) {
      // TODO: debug this potential regression. we now use the generic method which emits a signal.
      // Avoid generating a signal because we have an animation frame occuring.
      // see: onKeyPressed
      viewport.getCamera().getParameter('GlobalXfo').setValue(globalXfo);
    } else {
      viewport.getCamera().getParameter('GlobalXfo').setValue(globalXfo);
    }
  }

  /**
   * The orbit method.
   * @param {any} dragVec - The dragVec param.
   * @param {any} viewport - The viewport param.
   */
  orbit(dragVec, viewport) {
    const focalDistance = viewport.getCamera().getFocalDistance();
    const orbitRate =
      this.__orbitRateParam.getValue() * SystemDesc.isMobileDevice ? -1 : 1;

    if (this.__keyboardMovement) {
      const globalXfo = viewport
        .getCamera()
        .getParameter('GlobalXfo')
        .getValue();
      this.__mouseDownCameraXfo = globalXfo.clone();
      this.__mouseDownZaxis = globalXfo.ori.getZaxis();
      const targetOffset = this.__mouseDownZaxis.scale(-focalDistance);
      this.__mouseDownCameraTarget = globalXfo.tr.add(targetOffset);
    }

    const globalXfo = this.__mouseDownCameraXfo.clone();

    // Orbit
    const orbit = new Quat();
    orbit.rotateZ((dragVec.x / viewport.getWidth()) * 2 * Math.PI * -orbitRate);
    globalXfo.ori = orbit.multiply(globalXfo.ori);

    // Pitch
    const pitch = new Quat();
    pitch.rotateX((dragVec.y / viewport.getHeight()) * Math.PI * -orbitRate);
    globalXfo.ori.multiplyInPlace(pitch);

    globalXfo.tr = this.__mouseDownCameraTarget.add(
      globalXfo.ori.getZaxis().scale(focalDistance)
    );

    if (this.__keyboardMovement) {
      // TODO: debug this potential regression. we now use the generic method which emits a signal.
      // Avoid generating a signal because we have an animation frame occuring.
      // see: onKeyPressed
      viewport.getCamera().getParameter('GlobalXfo').setValue(globalXfo);
    } else {
      viewport.getCamera().getParameter('GlobalXfo').setValue(globalXfo);
    }
  }

  /**
   * The pan method.
   * @param {any} dragVec - The dragVec param.
   * @param {any} viewport - The viewport param.
   */
  pan(dragVec, viewport) {
    const focalDistance = viewport.getCamera().getFocalDistance();
    const fovY = viewport.getCamera().getFov();
    const xAxis = new Vec3$1(1, 0, 0);
    const yAxis = new Vec3$1(0, 1, 0);

    const cameraPlaneHeight = 2.0 * focalDistance * Math.tan(0.5 * fovY);
    const cameraPlaneWidth =
      cameraPlaneHeight * (viewport.getWidth() / viewport.getHeight());
    const delta = new Xfo();
    delta.tr = xAxis.scale(
      -(dragVec.x / viewport.getWidth()) * cameraPlaneWidth
    );
    delta.tr.addInPlace(
      yAxis.scale((dragVec.y / viewport.getHeight()) * cameraPlaneHeight)
    );

    viewport
      .getCamera()
      .getParameter('GlobalXfo')
      .setValue(this.__mouseDownCameraXfo.multiply(delta));
  }

  /**
   * The dolly method.
   * @param {any} dragVec - The dragVec param.
   * @param {any} viewport - The viewport param.
   */
  dolly(dragVec, viewport) {
    const dollyDist = dragVec.x * this.__dollySpeedParam.getValue();
    const delta = new Xfo();
    delta.tr.set(0, 0, dollyDist);
    viewport
      .getCamera()
      .getParameter('GlobalXfo')
      .setValue(this.__mouseDownCameraXfo.multiply(delta));
  }

  /**
   * The panAndZoom method.
   * @param {any} panDelta - The panDelta param.
   * @param {any} dragDist - The dragDist param.
   * @param {any} viewport - The viewport param.
   */
  panAndZoom(panDelta, dragDist, viewport) {
    const focalDistance = viewport.getCamera().getFocalDistance();
    const fovY = viewport.getCamera().getFov();

    const xAxis = new Vec3$1(1, 0, 0);
    const yAxis = new Vec3$1(0, 1, 0);

    const cameraPlaneHeight = 2.0 * focalDistance * Math.tan(0.5 * fovY);
    const cameraPlaneWidth =
      cameraPlaneHeight * (viewport.getWidth() / viewport.getHeight());
    const delta = new Xfo();
    delta.tr = xAxis.scale(
      -(panDelta.x / viewport.getWidth()) * cameraPlaneWidth
    );
    delta.tr.addInPlace(
      yAxis.scale((panDelta.y / viewport.getHeight()) * cameraPlaneHeight)
    );

    const zoomDist = dragDist * focalDistance;
    viewport.getCamera().setFocalDistance(this.__mouseDownFocalDist + zoomDist);
    delta.tr.z += zoomDist;
    viewport
      .getCamera()
      .getParameter('GlobalXfo')
      .setValue(this.__mouseDownCameraXfo.multiply(delta));
  }

  /**
   * The initDrag method.
   * @param {any} viewport - The viewport param.
   */
  initDrag(viewport) {
    const focalDistance = viewport.getCamera().getFocalDistance();
    this.__mouseDragDelta.set(0, 0);
    this.__mouseDownCameraXfo = viewport
      .getCamera()
      .getParameter('GlobalXfo')
      .getValue()
      .clone();
    this.__mouseDownZaxis = viewport
      .getCamera()
      .getParameter('GlobalXfo')
      .getValue()
      .ori.getZaxis();
    const targetOffset = this.__mouseDownZaxis.scale(-focalDistance);
    this.__mouseDownCameraTarget = viewport
      .getCamera()
      .getParameter('GlobalXfo')
      .getValue()
      .tr.add(targetOffset);
    this.__mouseDownFocalDist = focalDistance;
  }

  /**
   * The aimFocus method.
   * @param {any} camera - The camera param.
   * @param {any} pos - The pos param.
   */
  aimFocus(camera, pos) {
    if (this.__focusIntervalId) clearInterval(this.__focusIntervalId);

    const count = 20;
    let i = 0;
    const applyMovement = () => {
      const initlalGlobalXfo = camera.getParameter('GlobalXfo').getValue();
      const initlalDist = camera.getFocalDistance();
      const dir = pos.subtract(initlalGlobalXfo.tr);
      const dist = dir.normalizeInPlace();

      const orbit = new Quat();
      const pitch = new Quat();

      // Orbit
      {
        const currDir = initlalGlobalXfo.ori.getZaxis().clone();
        currDir.z = 0;
        const newDir = dir.negate();
        newDir.z = 0;

        orbit.setFrom2Vectors(currDir, newDir);
      }

      // Pitch
      {
        const currDir = initlalGlobalXfo.ori.getZaxis().clone();
        const newDir = dir.negate();
        currDir.x = newDir.x;
        currDir.y = newDir.y;
        currDir.normalizeInPlace();

        if (currDir.cross(newDir).dot(initlalGlobalXfo.ori.getXaxis()) > 0.0)
          pitch.rotateX(currDir.angleTo(newDir));
        else pitch.rotateX(-currDir.angleTo(newDir));
      }

      const targetGlobalXfo = initlalGlobalXfo.clone();
      targetGlobalXfo.ori = orbit.multiply(targetGlobalXfo.ori);
      targetGlobalXfo.ori.multiplyInPlace(pitch);

      // With each iteraction we get closer to our goal
      // and on the final iteration we should aim perfectly at
      // the target.
      const t = Math.pow(i / count, 2);
      const globalXfo = initlalGlobalXfo.clone();
      globalXfo.ori = initlalGlobalXfo.ori.lerp(targetGlobalXfo.ori, t);

      camera.setFocalDistance(initlalDist + (dist - initlalDist) * t);
      camera.getParameter('GlobalXfo').setValue(globalXfo);

      i++;
      if (i <= count) {
        this.__focusIntervalId = setTimeout(applyMovement, 20);
      } else {
        this.__focusIntervalId = undefined;
        this.emit('movementFinished');
      }
    };
    applyMovement();

    this.__manipulationState = 'focussing';
  }

  /**
   * The onMouseMove method.
   * @param {any} event - The event param.
   */
  onMouseMove(event) {}

  /**
   * The onDragStart method.
   * @param {any} event - The event param.
   */
  onDragStart(event) {
    this.__mouseDownPos = event.mousePos;
    this.initDrag(event.viewport);

    if (event.button == 2) {
      this.__mode = 'pan';
    } else if (event.ctrlKey && event.button == 2) {
      this.__mode = 'dolly';
    } else if (event.shiftKey || event.button == 2) {
      this.__mode = 'look';
    } else {
      this.__mode = this.__defaultMode;
    }
  }

  /**
   * The onDrag method.
   * @param {any} event - The event param.
   */
  onDrag(event) {
    // During requestPointerLock, the offsetX/Y values are not updated.
    // Instead we get a relative delta that we use to compute the total
    // delta for the drag.
    // if(this.__keyboardMovement){
    //     this.__mouseDragDelta.x = event.movementX;
    //     this.__mouseDragDelta.y = event.movementY;
    // }
    // else{
    //     this.__mouseDragDelta.x += event.movementX;
    //     this.__mouseDragDelta.y += event.movementY;
    // }
    if (this.__keyboardMovement) {
      this.__mouseDragDelta = event.mousePos;
    } else {
      this.__mouseDragDelta = event.mousePos.subtract(this.__mouseDownPos);
    }
    switch (this.__mode) {
      case 'orbit':
        this.orbit(this.__mouseDragDelta, event.viewport);
        break
      case 'look':
        this.look(this.__mouseDragDelta, event.viewport);
        break
      case 'pan':
        this.pan(this.__mouseDragDelta, event.viewport);
        break
      case 'dolly':
        this.dolly(this.__mouseDragDelta, event.viewport);
        break
    }
  }

  /**
   * The onDragEnd method.
   * @param {any} event - The event param.
   * @return {any} The return value.
   */
  onDragEnd(event) {
    // event.viewport.renderGeomDataFbo();
    this.emit('movementFinished');
    return false
  }

  /**
   * The onMouseDown method.
   * @param {any} event - The event param.
   * @return {any} The return value.
   */
  onMouseDown(event) {
    if (this.__maipulationModel == VIEW_TOOL_MODELS.DCC && !event.altKey)
      return false

    this.dragging = true;
    this.__mouseDownPos = event.mousePos;
    this.onDragStart(event);
    return true
  }

  /**
   * The onMouseUp method.
   * @param {any} event - The event param.
   * @return {any} The return value.
   */
  onMouseUp(event) {
    if (this.dragging) {
      this.onDragEnd(event);
      this.dragging = false;
      return true
    }
  }

  /**
   * The onMouseMove method.
   * @param {any} event - The event param.
   * @return {any} The return value.
   */
  onMouseMove(event) {
    if (this.dragging) {
      this.onDrag(event);
      event.showPointerOnAvatar = false;
      return true
    }
  }

  /**
   * The onDoubleClick method.
   * @param {any} event - The event param.
   */
  onDoubleClick(event) {
    if (event.intersectionData) {
      const viewport = event.viewport;
      const camera = viewport.getCamera();
      const pos = camera
        .getParameter('GlobalXfo')
        .getValue()
        .tr.add(
          event.intersectionData.mouseRay.dir.scale(event.intersectionData.dist)
        );
      this.aimFocus(camera, pos);
    }
  }

  /**
   * The onWheel method.
   * @param {any} event - The event param.
   * @return {any} The return value.
   */
  onWheel(event) {
    if (this.__maipulationModel == VIEW_TOOL_MODELS.DCC && !event.altKey)
      return false

    const viewport = event.viewport;
    const xfo = viewport.getCamera().getParameter('GlobalXfo').getValue();
    const vec = xfo.ori.getZaxis();
    if (this.__mouseWheelZoomIntervalId)
      clearInterval(this.__mouseWheelZoomIntervalId);
    let count = 0;
    const applyMovement = () => {
      const focalDistance = viewport.getCamera().getFocalDistance();
      const mouseWheelDollySpeed = this.__mouseWheelDollySpeedParam.getValue();
      const zoomDist = event.deltaY * mouseWheelDollySpeed * focalDistance * 0.2;
      xfo.tr.addInPlace(vec.scale(zoomDist));
      if (this.__defaultMode == 'orbit')
        viewport.getCamera().setFocalDistance(focalDistance + zoomDist);
      viewport.getCamera().getParameter('GlobalXfo').setValue(xfo);

      count++;
      if (count < 5) {
        this.__mouseWheelZoomIntervalId = setTimeout(applyMovement, 20);
      } else {
        this.__mouseWheelZoomIntervalId = undefined;
        this.emit('movementFinished');
        event.viewport.renderGeomDataFbo();
      }
    };
    applyMovement();
  }

  // eslint-disable-next-line require-jsdoc
  __integrateVelocityChange(velChange, viewport) {
    const delta = new Xfo();
    delta.tr = this.__velocity.normalize().scale(this.__maxVel);
    viewport
      .getCamera()
      .getParameter('GlobalXfo')
      .setValue(
        viewport
          .getCamera()
          .getParameter('GlobalXfo')
          .getValue()
          .multiply(delta)
      );
  }

  /**
   * The onKeyPressed method.
   * @param {any} key - The key param.
   * @param {any} event - The event param.
   * @return {any} The return value.
   */
  onKeyPressed(event) {
    // Note: onKeyPressed is called intiallly only once, and then we
    // get a series of calls. Here we ignore subsequent events.
    // (TODO: move this logic to a special controller)
    /*
    switch (key) {
      case 'w':
        if (this.__keysPressed.indexOf(key) != -1)
          return false;
        this.__velocity.z -= 1.0;
        break;
      case 's':
        if (this.__keysPressed.indexOf(key) != -1)
          return false;
        this.__velocity.z += 1.0;
        break;
      case 'a':
        if (this.__keysPressed.indexOf(key) != -1)
          return false;
        this.__velocity.x -= 1.0;
        break;
      case 'd':
        if (this.__keysPressed.indexOf(key) != -1)
          return false;
        this.__velocity.x += 1.0;
        break;
      default:
        return false;
    }
    this.__keysPressed.push(key);
    if (!this.__keyboardMovement) {
      this.__keyboardMovement = true;
      let animationFrame = ()=>{
        this.__integrateVelocityChange()
        if (this.__keyboardMovement)
          window.requestAnimationFrame(animationFrame);
      }
      window.requestAnimationFrame(animationFrame);
    }
    */
    return false // no keys handled
  }

  /**
   * The onKeyDown method.
   * @param {any} key - The key param.
   * @param {any} event - The event param.
   */
  onKeyDown(event) {}

  /**
   * The onKeyUp method.
   * @param {any} key - The key param.
   * @param {any} event - The event param.
   * @return {any} The return value.
   */
  onKeyUp(event) {
    // (TODO: move this logic to a special controller)
    /*
    switch (key) {
      case 'w':
        this.__velocity.z += 1.0;
        break;
      case 's':
        this.__velocity.z -= 1.0;
        break;
      case 'a':
        this.__velocity.x += 1.0;
        break;
      case 'd':
        this.__velocity.x -= 1.0;
        break;
      default:
        return false;
    }
    let keyIndex = this.__keysPressed.indexOf(key);
    this.__keysPressed.splice(keyIndex, 1);
    if (this.__keysPressed.length == 0)
      this.__keyboardMovement = false;
    */
    return true
  }

  // ///////////////////////////////////
  // Touch events

  // eslint-disable-next-line require-jsdoc
  __startTouch(touch, viewport) {
    this.__ongoingTouches[touch.identifier] = {
      identifier: touch.identifier,
      pos: new Vec2(touch.pageX, touch.pageY),
    };
  }

  // eslint-disable-next-line require-jsdoc
  __endTouch(touch, viewport) {
    // const idx = this.__ongoingTouchIndexById(touch.identifier);
    // this.__ongoingTouches.splice(idx, 1); // remove it; we're done
    delete this.__ongoingTouches[touch.identifier];
  }

  /**
   * The onTouchStart method.
   * @param {any} event - The event param.
   * @return {any} The return value.
   */
  onTouchStart(event) {
    // console.log("onTouchStart");
    event.preventDefault();
    event.stopPropagation();

    if (Object.keys(this.__ongoingTouches).length == 0)
      this.__manipMode = undefined;

    const touches = event.changedTouches;
    for (let i = 0; i < touches.length; i++) {
      this.__startTouch(touches[i]);
    }
    this.initDrag(event.viewport);
    return true
  }

  /**
   * The onTouchMove method.
   * @param {any} event - The event param.
   * @return {any} The return value.
   */
  onTouchMove(event) {
    event.preventDefault();
    event.stopPropagation();
    // console.log("this.__manipMode:" + this.__manipMode);

    const touches = event.changedTouches;
    if (touches.length == 1 && this.__manipMode != 'panAndZoom') {
      const touch = touches[0];
      const touchPos = new Vec2(touch.pageX, touch.pageY);
      const touchData = this.__ongoingTouches[touch.identifier];
      const dragVec = touchData.pos.subtract(touchPos);
      if (this.__defaultMode == 'look') {
        // TODO: scale panning here.
        dragVec.scaleInPlace(6.0);
        this.look(dragVec, event.viewport);
      } else {
        this.orbit(dragVec, event.viewport);
      }
      this.__manipMode = 'orbit';
      return true
    } else if (touches.length == 2) {
      const touch0 = touches[0];
      const touchData0 = this.__ongoingTouches[touch0.identifier];
      const touch1 = touches[1];
      const touchData1 = this.__ongoingTouches[touch1.identifier];

      const touch0Pos = new Vec2(touch0.pageX, touch0.pageY);
      const touch1Pos = new Vec2(touch1.pageX, touch1.pageY);
      const startSeparation = touchData1.pos.subtract(touchData0.pos).length();
      const dragSeparation = touch1Pos.subtract(touch0Pos).length();
      const separationDist = startSeparation - dragSeparation;

      const touch0Drag = touch0Pos.subtract(touchData0.pos);
      const touch1Drag = touch1Pos.subtract(touchData1.pos);
      const dragVec = touch0Drag.add(touch1Drag);
      // TODO: scale panning here.
      dragVec.scaleInPlace(0.5);
      this.panAndZoom(dragVec, separationDist * 0.002, event.viewport);
      this.__manipMode = 'panAndZoom';
      return true
    }
  }

  /**
   * The onTouchEnd method.
   * @param {any} event - The event param.
   * @return {any} The return value.
   */
  onTouchEnd(event) {
    event.preventDefault();
    event.stopPropagation();
    const touches = event.changedTouches;
    switch (this.__manipMode) {
      case 'orbit':
      case 'panAndZoom':
        this.emit('movementFinished');
        break
    }
    for (let i = 0; i < touches.length; i++) {
      this.__endTouch(touches[i]);
    }
    if (Object.keys(this.__ongoingTouches).length == 0)
      this.__manipMode = undefined;
    return true
  }

  /**
   * The onTouchCancel method.
   * @param {any} event - The event param.
   * @return {any} The return value.
   */
  onTouchCancel(event) {
    console.log('touchcancel.');
    const touches = event.changedTouches;
    for (let i = 0; i < touches.length; i++) {
      this.__endTouch(touches[i]);
    }
    return true
  }

  /**
   * The onDoubleTap method.
   * @param {any} event - The event param.
   */
  onDoubleTap(event) {
    const touches = event.changedTouches;
    for (let i = 0; i < touches.length; i++) {
      this.__startTouch(touches[i]);
    }
    if (event.intersectionData) {
      const viewport = event.viewport;
      const camera = viewport.getCamera();
      const pos = camera
        .getParameter('GlobalXfo')
        .getValue()
        .tr.add(
          event.intersectionData.mouseRay.dir.scale(event.intersectionData.dist)
        );
      this.aimFocus(camera, pos);
    }
  }

  // ///////////////////////////////////
  // VRController events

  // eslint-disable-next-line require-jsdoc
  __initMoveStage(vrviewport) {
    if (this.__controllerTriggersHeld.length == 1) {
      this.__grabPos = this.__controllerTriggersHeld[0]
        .getControllerTipStageLocalXfo()
        .tr.clone();
      this.stageXfo__GrabStart = vrviewport.getXfo().clone();
      this.__invOri = this.stageXfo__GrabStart.ori.inverse();
    } else if (this.__controllerTriggersHeld.length == 2) {
      const p0 = this.__controllerTriggersHeld[0].getControllerTipStageLocalXfo()
        .tr;
      const p1 = this.__controllerTriggersHeld[1].getControllerTipStageLocalXfo()
        .tr;
      this.__grabDir = p1.subtract(p0);
      this.__grabPos = p0.lerp(p1, 0.5);
      this.__grabDir.y = 0.0;
      this.__grabDist = this.__grabDir.length();
      this.__grabDir.scaleInPlace(1 / this.__grabDist);
      this.stageXfo__GrabStart = vrviewport.getXfo().clone();
      this.__grab_to_stage = this.__grabPos.subtract(
        this.stageXfo__GrabStart.tr
      );
    }
  }

  /**
   * The onVRControllerButtonDown method.
   * @param {any} event - The event param.
   * @return {any} The return value.
   */
  onVRControllerButtonDown(event) {
    if (event.button != 1) return
    this.__controllerTriggersHeld.push(event.controller);
    this.__initMoveStage(event.vrviewport);
    return true
  }

  /**
   * The onVRControllerButtonUp method.
   * @param {any} event - The event param.
   * @return {any} The return value.
   */
  onVRControllerButtonUp(event) {
    if (event.button != 1) return
    const index = this.__controllerTriggersHeld.indexOf(event.controller);
    this.__controllerTriggersHeld.splice(index, 1);
    this.__initMoveStage(event.vrviewport);
    return true
  }

  /**
   * The onVRControllerDoubleClicked method.
   * @param {any} event - The event param.
   */
  onVRControllerDoubleClicked(event) {
    console.log(
      'onVRControllerDoubleClicked:',
      this.__controllerTriggersHeld.length
    );

    const stageXfo = event.vrviewport.getXfo().clone();
    stageXfo.sc.set(1, 1, 1);
    event.vrviewport.setXfo(stageXfo);
  }

  /**
   * The onVRPoseChanged method.
   * @param {any} event - The event param.
   * @return {any} The return value.
   */
  onVRPoseChanged(event) {
    if (this.__controllerTriggersHeld.length == 1) {
      const grabPos = this.__controllerTriggersHeld[0].getControllerTipStageLocalXfo()
        .tr;

      const deltaXfo = new Xfo();
      deltaXfo.tr = this.__grabPos.subtract(grabPos);

      // //////////////
      // Update the stage Xfo
      const stageXfo = this.stageXfo__GrabStart.multiply(deltaXfo);
      event.vrviewport.setXfo(stageXfo);
      return true
    } else if (this.__controllerTriggersHeld.length == 2) {
      const p0 = this.__controllerTriggersHeld[0].getControllerTipStageLocalXfo()
        .tr;
      const p1 = this.__controllerTriggersHeld[1].getControllerTipStageLocalXfo()
        .tr;

      const grabPos = p0.lerp(p1, 0.5);
      const grabDir = p1.subtract(p0);
      grabDir.y = 0.0;
      const grabDist = grabDir.length();
      grabDir.scaleInPlace(1 / grabDist);

      const deltaXfo = new Xfo();

      // //////////////
      // Compute sc
      // Limit to a 10x change in scale per grab.
      const sc = Math.max(Math.min(this.__grabDist / grabDist, 10.0), 0.1);

      // Avoid causing a scale that would make the user < 1.0 scale factor.
      // if(stageSc < 1.0){
      //     sc = 1.0 / this.stageXfo__GrabStart.sc.x;
      // }
      deltaXfo.sc.set(sc, sc, sc);

      // //////////////
      // Compute ori
      let angle = this.__grabDir.angleTo(grabDir);
      if (this.__grabDir.cross(grabDir).y > 0.0) {
        angle = -angle;
      }
      deltaXfo.ori.rotateY(angle);

      // Rotate around the point between the hands.
      const oriTrDelta = deltaXfo.ori.rotateVec3(this.__grabPos);
      deltaXfo.tr.addInPlace(this.__grabPos.subtract(oriTrDelta));

      // Scale around the point between the hands.
      const deltaSc = this.__grabPos.scale(1.0 - sc);
      deltaXfo.tr.addInPlace(deltaXfo.ori.rotateVec3(deltaSc));

      // //////////////
      // Compute tr
      // Not quite working.....
      const deltaTr = this.__grabPos.subtract(grabPos).scale(sc);
      deltaXfo.tr.addInPlace(deltaXfo.ori.rotateVec3(deltaTr));

      // //////////////
      // Update the stage Xfo
      const stageXfo = this.stageXfo__GrabStart.multiply(deltaXfo);
      event.vrviewport.setXfo(stageXfo);

      return true
    }
  }
}

/**
 * Class representing a selection tool.
 * @extends BaseTool
 */
class SelectionTool extends BaseTool {
  /**
   * Create a selection tool.
   * @param {any} appData - The appData value.
   */
  constructor(appData) {
    super(appData);

    this.dragging = false;

    this.selectionRect = new Rect(1, 1);
    this.selectionRectMat = new Material('marker', 'ScreenSpaceShader');
    this.selectionRectMat
      .getParameter('BaseColor')
      .setValue(new Color('#03E3AC'));
    this.selectionRectXfo = new Xfo();
    this.selectionRectXfo.tr.set(0.5, 0.5, 0);
    this.selectionRectXfo.sc.set(0, 0, 0);
  }

  /**
   * The activateTool method.
   */
  activateTool() {
    super.activateTool();

    if (!this.rectItem) {
      this.rectItem = new GeomItem(
        'selectionRect',
        this.selectionRect,
        this.selectionRectMat
      );
      this.rectItem.getParameter('Visible').setValue(false);
      this.appData.renderer.addTreeItem(this.rectItem);
    }
  }

  /**
   * The deactivateTool method.
   */
  deactivateTool() {
    super.deactivateTool();
    this.selectionRectXfo.sc.set(0, 0, 0);
    this.rectItem.getParameter('GlobalXfo').setValue(this.selectionRectXfo);
  }

  /**
   * The onMouseDown method.
   * @param {any} event - The event param.
   * @return {any} The return value.
   */
  onMouseDown(event) {
    if (event.button == 0 && !event.altKey) {
      console.log('onMouseDown');
      this.mouseDownPos = event.mousePos;
      this.dragging = false;
      return true
    }
    return false
  }

  // eslint-disable-next-line require-jsdoc
  __resizeRect(viewport, delta) {
    const sc = new Vec2(
      (1 / viewport.getWidth()) * 2,
      (1 / viewport.getHeight()) * 2
    );
    const size = delta.multiply(sc);
    this.selectionRectXfo.sc.set(Math.abs(size.x), Math.abs(size.y), 1);

    const center = this.mouseDownPos.subtract(delta.scale(0.5));
    const tr = center.multiply(sc).subtract(new Vec2(1, 1));

    this.selectionRectXfo.tr.x = tr.x;
    this.selectionRectXfo.tr.y = -tr.y;
    this.rectItem.getParameter('GlobalXfo').setValue(this.selectionRectXfo);
  }

  /**
   * The onMouseMove method.
   * @param {any} event - The event param.
   * @return {any} The return value.
   */
  onMouseMove(event) {
    if (this.mouseDownPos) {
      const delta = this.mouseDownPos.subtract(event.mousePos);
      if (this.dragging) {
        this.__resizeRect(event.viewport, delta);
      }
      const dist = delta.length();
      // dragging only is activated after 4 pixels.
      // This is to avoid causing as rect selection for nothing.
      if (dist > 4) {
        this.dragging = true;
        // Start drawing the selection rectangle on screen.
        this.rectItem.getParameter('Visible').setValue(true);
        this.__resizeRect(event.viewport, delta);
      }
    }
    return true
  }

  /**
   * The onMouseUp method.
   * @param {any} event - The event param.
   * @return {any} The return value.
   */
  onMouseUp(event) {
    if (this.mouseDownPos) {
      // event.viewport.renderGeomDataFbo();
      if (this.dragging) {
        this.rectItem.getParameter('Visible').setValue(false);
        const mouseUpPos = event.mousePos;
        const tl = new Vec2(
          Math.min(this.mouseDownPos.x, mouseUpPos.x),
          Math.min(this.mouseDownPos.y, mouseUpPos.y)
        );
        const br = new Vec2(
          Math.max(this.mouseDownPos.x, mouseUpPos.x),
          Math.max(this.mouseDownPos.y, mouseUpPos.y)
        );
        const geomItems = event.viewport.getGeomItemsInRect(tl, br);

        if (this.appData.selectionManager.pickingModeActive()) {
          this.appData.selectionManager.pick(geomItems);
        } else {
          // Remove all the scene widgets. (UI elements should not be selectable.)
          const regularGeomItems = new Set(
            [...geomItems].filter((x) => !(x.getOwner() instanceof Handle))
          );

          if (!event.shiftKey) {
            this.appData.selectionManager.selectItems(
              regularGeomItems,
              !event.ctrlKey
            );
          } else {
            this.appData.selectionManager.deselectItems(regularGeomItems);
          }

          this.selectionRectXfo.sc.set(0, 0, 0);
          this.rectItem
            .getParameter('GlobalXfo')
            .setValue(this.selectionRectXfo);
        }
      } else {
        const intersectionData = event.viewport.getGeomDataAtPos(event.mousePos);
        if (
          intersectionData != undefined &&
          !(intersectionData.geomItem.getOwner() instanceof Handle)
        ) {
          if (this.appData.selectionManager.pickingModeActive()) {
            this.appData.selectionManager.pick(intersectionData.geomItem);
          } else {
            if (!event.shiftKey) {
              this.appData.selectionManager.toggleItemSelection(
                intersectionData.geomItem,
                !event.ctrlKey
              );
            } else {
              const items = new Set();
              items.add(intersectionData.geomItem);
              this.appData.selectionManager.deselectItems(items);
            }
          }
        } else {
          this.appData.selectionManager.clearSelection();
        }
      }

      this.mouseDownPos = undefined;
      return true
    }
  }

  // ///////////////////////////////////
  // VRController events

  /**
   * The onVRControllerButtonDown method.
   * @param {any} event - The event param.
   * @return {any} The return value.
   */
  onVRControllerButtonDown(event) {
    if (event.button == 1) {
      const intersectionData = event.controller.getGeomItemAtTip();
      if (
        intersectionData != undefined &&
        !(intersectionData.geomItem.getOwner() instanceof Handle)
      ) {
        this.appData.selectionManager.toggleItemSelection(
          intersectionData.geomItem
        );
        return true
      }
    }
  }

  // onVRPoseChanged(event) {
  // }

  // onVRControllerButtonUp(event) {

  //   if (event.button == 1 && this.activeController == event.controller) {
  //     const controllerUpPos = event.controller.getTipXfo();
  //     if(this.controllerDownPos.distanceTo(controllerUpPos) < 0.1) {
  //       const intersectionData = event.controller.getGeomItemAtTip();
  //       if (intersectionData != undefined && !(intersectionData.geomItem instanceof Handle)) {
  //         this.appData.selectionManager.toggleItemSelection(intersectionData.geomItem);
  //         return true;
  //       }
  //     }
  //   }
  // }
}

UndoRedoManager.registerChange('SelectionTool', SelectionTool);

/**
 * Class representing an open VR UI tool.
 * @extends BaseTool
 */
class OpenVRUITool extends BaseTool {
  /**
   * Create an open VR UI tool.
   * @param {any} appData - The appData value.
   * @param {any} vrUITool - The vrUITool value.
   */
  constructor(appData, vrUITool) {
    super(appData);

    this.vrUITool = vrUITool;
    this.uiToolIndex = -1;
    this.__stayClosed = false;
  }

  /**
   * The uninstall method.
   */
  uninstall() {
    super.uninstall();

    // Also remove the UI tool
    if (this.uiToolIndex > 0)
      this.appData.toolManager.removeToolByHandle(this.vrUITool);
  }

  // ///////////////////////////////////
  // VRController events

  /**
   * The onVRControllerButtonDown method.
   * @param {any} event - The event param.
   */
  onVRControllerButtonDown(event) {}

  /**
   * The onVRControllerButtonUp method.
   * @param {any} event - The event param.
   */
  onVRControllerButtonUp(event) {}

  /**
   * The stayClosed method.
   */
  stayClosed() {
    this.__stayClosed = true;
  }

  /**
   * The onVRPoseChanged method.
   * @param {any} event - The event param.
   * @return {any} The return value.
   */
  onVRPoseChanged(event) {
    if (this.vrUITool.installed()) return

    // Controller coordinate system
    // X = Horizontal.
    // Y = Up.
    // Z = Towards handle base.
    const headXfo = event.viewXfo;
    const checkControllers = (ctrlA, ctrlB) => {
      if (!ctrlA) return false
      const xfoA = ctrlA.getTreeItem().getParameter('GlobalXfo').getValue();
      const headToCtrlA = xfoA.tr.subtract(headXfo.tr);
      headToCtrlA.normalizeInPlace();
      if (headToCtrlA.angleTo(xfoA.ori.getYaxis()) < Math.PI * 0.25) {
        // Stay closed as a subsequent tool has just caused the UI to be
        // closed while interacting with the UI. (see: VRUITool.deactivateTool)
        if (!this.__stayClosed) {
          this.vrUITool.setUIControllers(this, ctrlA, ctrlB, headXfo);
          this.uiToolIndex = this.appData.toolManager.pushTool(this.vrUITool);
        }
        return true
      }
    };

    if (event.controllers.length > 0) {
      if (checkControllers(event.controllers[0], event.controllers[1]))
        return true
      if (checkControllers(event.controllers[1], event.controllers[0]))
        return true
    }
    this.uiToolIndex = -1;
    this.__stayClosed = false;
  }
}

const util = newUtil();
const inliner = newInliner();
const fontFaces = newFontFaces();
const images = newImages();

// Default impl options
const defaultOptions = {
  // Default is to fail on error, no placeholder
  imagePlaceholder: undefined,
  // Default cache bust is false, it will use the cache
  cacheBust: false,
};

const domtoimage = {
  toSvg: toSvg,
  toPng: toPng,
  toJpeg: toJpeg,
  toBlob: toBlob,
  toPixelData: toPixelData,
  toCanvas: toCanvas,
  impl: {
    fontFaces: fontFaces,
    images: images,
    util: util,
    inliner: inliner,
    options: {},
  },
};

/**
     * @param {Node} node - The DOM Node object to render
     * @param {Object} options - Rendering options
     * @param {Function} options.filter - Should return true if passed node should be included in the output
     *          (excluding node means excluding it's children as well). Not called on the root node.
     * @param {string} options.bgcolor - color for the background, any valid CSS color value.
     * @param {number} options.width - width to be applied to node before rendering.
     * @param {number} options.height - height to be applied to node before rendering.
     * @param {Object} options.style - an object whose properties to be copied to node's style before rendering.
     * @param {number} options.quality - a Number between 0 and 1 indicating image quality (applicable to JPEG only),
                defaults to 1.0.
     * @param {string} options.imagePlaceholder - dataURL to use as a placeholder for failed images, default behaviour is to fail fast on images we can't fetch
     * @param {boolean} options.cacheBust - set to true to cache bust by appending the time to the request url
     * @return {Promise} - A promise that is fulfilled with a SVG image data URL
     * */
function toSvg(node, options) {
  options = options || {};
  copyOptions(options);
  return Promise.resolve(node)
    .then(function (node) {
      return cloneNode(node, options.filter, true)
    })
    .then(embedFonts)
    .then(inlineImages)
    .then(applyOptions)
    .then(function (clone) {
      return makeSvgDataUri(
        clone,
        options.width || util.width(node),
        options.height || util.height(node)
      )
    })

  function applyOptions(clone) {
    if (options.bgcolor) clone.style.backgroundColor = options.bgcolor;

    if (options.width) clone.style.width = options.width + 'px';
    if (options.height) clone.style.height = options.height + 'px';

    if (options.style)
      Object.keys(options.style).forEach(function (property) {
        clone.style[property] = options.style[property];
      });

    return clone
  }
}

/**
 * @param {Node} node - The DOM Node object to render
 * @param {Object} options - Rendering options, @see {@link toSvg}
 * @return {Promise} - A promise that is fulfilled with a Uint8Array containing RGBA pixel data.
 * */
function toPixelData(node, options) {
  return draw(node, options || {}).then(function (canvas) {
    return canvas
      .getContext('2d')
      .getImageData(0, 0, util.width(node), util.height(node)).data
  })
}

/**
 * @param {Node} node - The DOM Node object to render
 * @param {Object} options - Rendering options, @see {@link toSvg}
 * @return {Promise} - A promise that is fulfilled with a Uint8Array containing RGBA pixel data.
 * */
function toCanvas(node, options) {
  return draw(node, options || {}).then(function (canvas) {
    return canvas
  })
}

/**
 * @param {Node} node - The DOM Node object to render
 * @param {Object} options - Rendering options, @see {@link toSvg}
 * @return {Promise} - A promise that is fulfilled with a PNG image data URL
 * */
function toPng(node, options) {
  return draw(node, options || {}).then(function (canvas) {
    return canvas.toDataURL()
  })
}

/**
 * @param {Node} node - The DOM Node object to render
 * @param {Object} options - Rendering options, @see {@link toSvg}
 * @return {Promise} - A promise that is fulfilled with a JPEG image data URL
 * */
function toJpeg(node, options) {
  options = options || {};
  return draw(node, options).then(function (canvas) {
    return canvas.toDataURL('image/jpeg', options.quality || 1.0)
  })
}

/**
 * @param {Node} node - The DOM Node object to render
 * @param {Object} options - Rendering options, @see {@link toSvg}
 * @return {Promise} - A promise that is fulfilled with a PNG image blob
 * */
function toBlob(node, options) {
  return draw(node, options || {}).then(util.canvasToBlob)
}

function copyOptions(options) {
  // Copy options to impl options for use in impl
  if (typeof options.imagePlaceholder === 'undefined') {
    domtoimage.impl.options.imagePlaceholder = defaultOptions.imagePlaceholder;
  } else {
    domtoimage.impl.options.imagePlaceholder = options.imagePlaceholder;
  }

  if (typeof options.cacheBust === 'undefined') {
    domtoimage.impl.options.cacheBust = defaultOptions.cacheBust;
  } else {
    domtoimage.impl.options.cacheBust = options.cacheBust;
  }
}

function draw(domNode, options) {
  return toSvg(domNode, options)
    .then(util.makeImage)
    .then(util.delay(100))
    .then(function (image) {
      const canvas = newCanvas(domNode);
      canvas.getContext('2d').drawImage(image, 0, 0);
      return canvas
    })

  function newCanvas(domNode) {
    const canvas = document.createElement('canvas');
    canvas.width = options.width || util.width(domNode);
    canvas.height = options.height || util.height(domNode);

    if (options.bgcolor) {
      const ctx = canvas.getContext('2d');
      ctx.fillStyle = options.bgcolor;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    }

    return canvas
  }
}

function cloneNode(node, filter, root) {
  if (!root && filter && !filter(node)) return Promise.resolve()

  return Promise.resolve(node)
    .then(makeNodeCopy)
    .then(function (clone) {
      return cloneChildren(node, clone, filter)
    })
    .then(function (clone) {
      return processClone(node, clone)
    })

  function makeNodeCopy(node) {
    if (node instanceof HTMLCanvasElement)
      return util.makeImage(node.toDataURL())
    return node.cloneNode(false)
  }

  function cloneChildren(original, clone, filter) {
    const children = original.childNodes;
    if (children.length === 0) return Promise.resolve(clone)

    return cloneChildrenInOrder(clone, util.asArray(children), filter).then(
      function () {
        return clone
      }
    )

    function cloneChildrenInOrder(parent, children, filter) {
      let done = Promise.resolve();
      children.forEach(function (child) {
        done = done
          .then(function () {
            return cloneNode(child, filter)
          })
          .then(function (childClone) {
            if (childClone) parent.appendChild(childClone);
          });
      });
      return done
    }
  }

  function processClone(original, clone) {
    if (!(clone instanceof Element)) return clone

    return Promise.resolve()
      .then(cloneStyle)
      .then(clonePseudoElements)
      .then(copyUserInput)
      .then(fixSvg)
      .then(function () {
        return clone
      })

    function cloneStyle() {
      copyStyle(window.getComputedStyle(original), clone.style);

      function copyStyle(source, target) {
        if (source.cssText) target.cssText = source.cssText;
        else copyProperties(source, target);

        function copyProperties(source, target) {
          util.asArray(source).forEach(function (name) {
            target.setProperty(
              name,
              source.getPropertyValue(name),
              source.getPropertyPriority(name)
            );
          });
        }
      }
    }

    function clonePseudoElements() {
[':before', ':after'].forEach(function (element) {
        clonePseudoElement(element);
      });

      function clonePseudoElement(element) {
        const style = window.getComputedStyle(original, element);
        const content = style.getPropertyValue('content');

        if (content === '' || content === 'none') return

        const className = util.uid();
        clone.className = clone.className + ' ' + className;
        const styleElement = document.createElement('style');
        styleElement.appendChild(
          formatPseudoElementStyle(className, element, style)
        );
        clone.appendChild(styleElement);

        function formatPseudoElementStyle(className, element, style) {
          const selector = '.' + className + ':' + element;
          const cssText = style.cssText
            ? formatCssText(style)
            : formatCssProperties(style);
          return document.createTextNode(selector + '{' + cssText + '}')

          function formatCssText(style) {
            const content = style.getPropertyValue('content');
            return style.cssText + ' content: ' + content + ';'
          }

          function formatCssProperties(style) {
            return util.asArray(style).map(formatProperty).join('; ') + ';'

            function formatProperty(name) {
              return (
                name +
                ': ' +
                style.getPropertyValue(name) +
                (style.getPropertyPriority(name) ? ' !important' : '')
              )
            }
          }
        }
      }
    }

    function copyUserInput() {
      if (original instanceof HTMLTextAreaElement)
        clone.innerHTML = original.value;
      if (original instanceof HTMLInputElement)
        clone.setAttribute('value', original.value);
    }

    function fixSvg() {
      if (!(clone instanceof SVGElement)) return
      clone.setAttribute('xmlns', 'http://www.w3.org/2000/svg');

      if (!(clone instanceof SVGRectElement)) return
      ;['width', 'height'].forEach(function (attribute) {
        const value = clone.getAttribute(attribute);
        if (!value) return

        clone.style.setProperty(attribute, value);
      });
    }
  }
}

function embedFonts(node) {
  return fontFaces.resolveAll().then(function (cssText) {
    const styleNode = document.createElement('style');
    node.appendChild(styleNode);
    styleNode.appendChild(document.createTextNode(cssText));
    return node
  })
}

function inlineImages(node) {
  return images.inlineAll(node).then(function () {
    return node
  })
}

function makeSvgDataUri(node, width, height) {
  return Promise.resolve(node)
    .then(function (node) {
      node.setAttribute('xmlns', 'http://www.w3.org/1999/xhtml');
      return new XMLSerializer().serializeToString(node)
    })
    .then(util.escapeXhtml)
    .then(function (xhtml) {
      return (
        '<foreignObject x="0" y="0" width="100%" height="100%">' +
        xhtml +
        '</foreignObject>'
      )
    })
    .then(function (foreignObject) {
      return (
        '<svg xmlns="http://www.w3.org/2000/svg" width="' +
        width +
        '" height="' +
        height +
        '">' +
        foreignObject +
        '</svg>'
      )
    })
    .then(function (svg) {
      return 'data:image/svg+xml;charset=utf-8,' + svg
    })
}

function newUtil() {
  return {
    escape: escape,
    parseExtension: parseExtension,
    mimeType: mimeType,
    dataAsUrl: dataAsUrl,
    isDataUrl: isDataUrl,
    canvasToBlob: canvasToBlob,
    resolveUrl: resolveUrl,
    getAndEncode: getAndEncode,
    uid: uid(),
    delay: delay,
    asArray: asArray,
    escapeXhtml: escapeXhtml,
    makeImage: makeImage,
    width: width,
    height: height,
  }

  function mimes() {
    /*
     * Only WOFF and EOT mime types for fonts are 'real'
     * see http://www.iana.org/assignments/media-types/media-types.xhtml
     */
    const WOFF = 'application/font-woff';
    const JPEG = 'image/jpeg';

    return {
      woff: WOFF,
      woff2: WOFF,
      ttf: 'application/font-truetype',
      eot: 'application/vnd.ms-fontobject',
      png: 'image/png',
      jpg: JPEG,
      jpeg: JPEG,
      gif: 'image/gif',
      tiff: 'image/tiff',
      svg: 'image/svg+xml',
    }
  }

  function parseExtension(url) {
    const match = /\.([^\.\/]*?)$/g.exec(url);
    if (match) return match[1]
    else return ''
  }

  function mimeType(url) {
    const extension = parseExtension(url).toLowerCase();
    return mimes()[extension] || ''
  }

  function isDataUrl(url) {
    return url.search(/^(data:)/) !== -1
  }

  function toBlob(canvas) {
    return new Promise(function (resolve) {
      const binaryString = window.atob(canvas.toDataURL().split(',')[1]);
      const length = binaryString.length;
      const binaryArray = new Uint8Array(length);

      for (let i = 0; i < length; i++)
        binaryArray[i] = binaryString.charCodeAt(i);

      resolve(
        new Blob([binaryArray], {
          type: 'image/png',
        })
      );
    })
  }

  function canvasToBlob(canvas) {
    if (canvas.toBlob)
      return new Promise(function (resolve) {
        canvas.toBlob(resolve);
      })

    return toBlob(canvas)
  }

  function resolveUrl(url, baseUrl) {
    const doc = document.implementation.createHTMLDocument();
    const base = doc.createElement('base');
    doc.head.appendChild(base);
    const a = doc.createElement('a');
    doc.body.appendChild(a);
    base.href = baseUrl;
    a.href = url;
    return a.href
  }

  function uid() {
    let index = 0;

    return function () {
      return 'u' + fourRandomChars() + index++

      function fourRandomChars() {
        /* see http://stackoverflow.com/a/6248722/2519373 */
        return (
          '0000' + ((Math.random() * Math.pow(36, 4)) << 0).toString(36)
        ).slice(-4)
      }
    }
  }

  function makeImage(uri) {
    return new Promise(function (resolve, reject) {
      const image = new Image();
      image.onload = function () {
        resolve(image);
      };
      image.onerror = reject;
      image.src = uri;
    })
  }

  function getAndEncode(url) {
    const TIMEOUT = 30000;
    if (domtoimage.impl.options.cacheBust) {
      // Cache bypass so we dont have CORS issues with cached images
      // Source: https://developer.mozilla.org/en/docs/Web/API/XMLHttpRequest/Using_XMLHttpRequest#Bypassing_the_cache
      url += (/\?/.test(url) ? '&' : '?') + new Date().getTime();
    }

    return new Promise(function (resolve) {
      const request = new XMLHttpRequest();

      request.onreadystatechange = done;
      request.ontimeout = timeout;
      request.responseType = 'blob';
      request.timeout = TIMEOUT;
      request.open('GET', url, true);
      request.send();

      let placeholder;
      if (domtoimage.impl.options.imagePlaceholder) {
        const split = domtoimage.impl.options.imagePlaceholder.split(/,/);
        if (split && split[1]) {
          placeholder = split[1];
        }
      }

      function done() {
        if (request.readyState !== 4) return

        if (request.status !== 200) {
          if (placeholder) {
            resolve(placeholder);
          } else {
            fail(
              'cannot fetch resource: ' + url + ', status: ' + request.status
            );
          }

          return
        }

        const encoder = new FileReader();
        encoder.onloadend = function () {
          const content = encoder.result.split(/,/)[1];
          resolve(content);
        };
        encoder.readAsDataURL(request.response);
      }

      function timeout() {
        if (placeholder) {
          resolve(placeholder);
        } else {
          fail(
            'timeout of ' +
              TIMEOUT +
              'ms occured while fetching resource: ' +
              url
          );
        }
      }

      function fail(message) {
        console.error(message);
        resolve('');
      }
    })
  }

  function dataAsUrl(content, type) {
    return 'data:' + type + ';base64,' + content
  }

  function escape(string) {
    return string.replace(/([.*+?^${}()|\[\]\/\\])/g, '\\$1')
  }

  function delay(ms) {
    return function (arg) {
      return new Promise(function (resolve) {
        setTimeout(function () {
          resolve(arg);
        }, ms);
      })
    }
  }

  function asArray(arrayLike) {
    const array = [];
    const length = arrayLike.length;
    for (let i = 0; i < length; i++) array.push(arrayLike[i]);
    return array
  }

  function escapeXhtml(string) {
    return string.replace(/#/g, '%23').replace(/\n/g, '%0A')
  }

  function width(node) {
    const leftBorder = px(node, 'border-left-width');
    const rightBorder = px(node, 'border-right-width');
    return node.scrollWidth + leftBorder + rightBorder
  }

  function height(node) {
    const topBorder = px(node, 'border-top-width');
    const bottomBorder = px(node, 'border-bottom-width');
    return node.scrollHeight + topBorder + bottomBorder
  }

  function px(node, styleProperty) {
    const value = window.getComputedStyle(node).getPropertyValue(styleProperty);
    return parseFloat(value.replace('px', ''))
  }
}

function newInliner() {
  const URL_REGEX = /url\(['"]?([^'"]+?)['"]?\)/g;

  return {
    inlineAll: inlineAll,
    shouldProcess: shouldProcess,
    impl: {
      readUrls: readUrls,
      inline: inline,
    },
  }

  function shouldProcess(string) {
    return string.search(URL_REGEX) !== -1
  }

  function readUrls(string) {
    const result = [];
    let match;
    while ((match = URL_REGEX.exec(string)) !== null) {
      result.push(match[1]);
    }
    return result.filter(function (url) {
      return !util.isDataUrl(url)
    })
  }

  function inline(string, url, baseUrl, get) {
    return Promise.resolve(url)
      .then(function (url) {
        return baseUrl ? util.resolveUrl(url, baseUrl) : url
      })
      .then(get || util.getAndEncode)
      .then(function (data) {
        return util.dataAsUrl(data, util.mimeType(url))
      })
      .then(function (dataUrl) {
        return string.replace(urlAsRegex(url), '$1' + dataUrl + '$3')
      })

    function urlAsRegex(url) {
      return new RegExp(
        '(url\\([\'"]?)(' + util.escape(url) + ')([\'"]?\\))',
        'g'
      )
    }
  }

  function inlineAll(string, baseUrl, get) {
    if (nothingToInline()) return Promise.resolve(string)

    return Promise.resolve(string)
      .then(readUrls)
      .then(function (urls) {
        let done = Promise.resolve(string);
        urls.forEach(function (url) {
          done = done.then(function (string) {
            return inline(string, url, baseUrl, get)
          });
        });
        return done
      })

    function nothingToInline() {
      return !shouldProcess(string)
    }
  }
}

function newFontFaces() {
  return {
    resolveAll: resolveAll,
    impl: {
      readAll: readAll,
    },
  }

  function resolveAll() {
    return readAll()
      .then(function (webFonts) {
        return Promise.all(
          webFonts.map(function (webFont) {
            return webFont.resolve()
          })
        )
      })
      .then(function (cssStrings) {
        return cssStrings.join('\n')
      })
  }

  function readAll() {
    return Promise.resolve(util.asArray(document.styleSheets))
      .then(getCssRules)
      .then(selectWebFontRules)
      .then(function (rules) {
        return rules.map(newWebFont)
      })

    function selectWebFontRules(cssRules) {
      return cssRules
        .filter(function (rule) {
          return rule.type === CSSRule.FONT_FACE_RULE
        })
        .filter(function (rule) {
          return inliner.shouldProcess(rule.style.getPropertyValue('src'))
        })
    }

    function getCssRules(styleSheets) {
      const cssRules = [];
      styleSheets.forEach(function (sheet) {
        try {
          util
            .asArray(sheet.cssRules || [])
            .forEach(cssRules.push.bind(cssRules));
        } catch (e) {
          console.log(
            'Error while reading CSS rules from ' + sheet.href,
            e.toString()
          );
        }
      });
      return cssRules
    }

    function newWebFont(webFontRule) {
      return {
        resolve: function resolve() {
          const baseUrl = (webFontRule.parentStyleSheet || {}).href;
          return inliner.inlineAll(webFontRule.cssText, baseUrl)
        },
        src: function () {
          return webFontRule.style.getPropertyValue('src')
        },
      }
    }
  }
}

function newImages() {
  return {
    inlineAll: inlineAll,
    impl: {
      newImage: newImage,
    },
  }

  function newImage(element) {
    return {
      inline: inline,
    }

    function inline(get) {
      if (util.isDataUrl(element.src)) return Promise.resolve()

      return Promise.resolve(element.src)
        .then(get || util.getAndEncode)
        .then(function (data) {
          return util.dataAsUrl(data, util.mimeType(element.src))
        })
        .then(function (dataUrl) {
          return new Promise(function (resolve, reject) {
            element.onload = resolve;
            element.onerror = reject;
            element.src = dataUrl;
          })
        })
    }
  }

  function inlineAll(node) {
    if (!(node instanceof Element)) return Promise.resolve(node)

    return inlineBackground(node).then(function () {
      if (node instanceof HTMLImageElement) return newImage(node).inline()
      else
        return Promise.all(
          util.asArray(node.childNodes).map(function (child) {
            return inlineAll(child)
          })
        )
    })

    function inlineBackground(node) {
      const background = node.style.getPropertyValue('background');

      if (!background) return Promise.resolve(node)

      return inliner
        .inlineAll(background)
        .then(function (inlined) {
          node.style.setProperty(
            'background',
            inlined,
            node.style.getPropertyPriority('background')
          );
        })
        .then(function () {
          return node
        })
    }
  }
}

const VR_UI_ELEM_CLASS = 'VRUIElement';

/**
 * Class representing a VR controller UI.
 * @extends GeomItem
 */
class VRControllerUI extends GeomItem {
  /**
   * Create a VR controller UI.
   * @param {any} appData - The appData value.
   * @param {any} vrUIDOMHolderElement - The vrUIDOMHolderElement value.
   * @param {any} vrUIDOMElement - The vrUIDOMElement value.
   */
  constructor(appData, vrUIDOMHolderElement, vrUIDOMElement) {
    const uimat = new Material('uimat', 'FlatSurfaceShader');
    uimat.visibleInGeomDataBuffer = false;

    super('VRControllerUI', new Plane(1, 1), uimat);

    this.appData = appData;
    this.__vrUIDOMHolderElement = vrUIDOMHolderElement;
    this.__vrUIDOMElement = vrUIDOMElement;

    this.__uiimage = new DataImage();
    // uimat.getParameter('BaseColor').setValue(new Color(0.3, 0.3, 0.3));
    uimat.getParameter('BaseColor').setValue(this.__uiimage);

    this.__uiGeomOffsetXfo = new Xfo();
    this.__uiGeomOffsetXfo.sc.set(0, 0, 1);
    this.__rect = { width: 0, height: 0 };

    // Flip it over so we see the front.
    this.__uiGeomOffsetXfo.ori.setFromAxisAndAngle(new Vec3$1(0, 1, 0), Math.PI);
    this.setGeomOffsetXfo(this.__uiGeomOffsetXfo);

    let renderRequestedId;
    let mutatedElems = [];
    const processMutatedElems = () => {
      renderRequestedId = null;
      const promises = mutatedElems.map((elem) => {
        return this.updateElemInAtlas(elem)
      });
      Promise.all(promises).then(() => {
        this.updateUIImage();
        // console.log("Update Time:", performance.now() - start, mutatedElems.length);
        mutatedElems = [];
      });
    };
    this.__mutationObserver = new MutationObserver((mutations) => {
      if (!this.mainCtx) {
        this.renderUIToImage();
        return
      }
      // console.log("mutations:", mutations.length)
      mutations.some((mutation) => {
        let elem = mutation.target;
        while (elem.parentNode) {
          if (elem == this.__vrUIDOMElement) {
            this.renderUIToImage();
            mutatedElems = [];
            return false
          }
          // console.log(elem.classList)
          if (
            elem.classList.contains(VR_UI_ELEM_CLASS) ||
            elem == this.__vrUIDOMElement
          ) {
            if (mutatedElems.indexOf(elem) == -1) mutatedElems.push(elem);
            break
          }
          elem = elem.parentNode;
        }
        return true
      });

      // Batch the changes.
      if (renderRequestedId) clearTimeout(renderRequestedId);
      renderRequestedId = setTimeout(processMutatedElems, 50);
    });

    this.__active = false;
    this.__renderRequested = false;
  }

  // ///////////////////////////////////

  /**
   * The activate method.
   */
  activate() {
    this.__vrUIDOMHolderElement.style.display = 'block';
    this.__active = true;

    this.__mutationObserver.observe(this.__vrUIDOMElement, {
      attributes: true,
      characterData: true,
      childList: true,
      subtree: true,
    });
    this.renderUIToImage();
  }

  /**
   * The deactivate method.
   */
  deactivate() {
    this.__vrUIDOMHolderElement.style.display = 'none';
    this.__active = true;
    this.__mutationObserver.disconnect();
  }

  // ///////////////////////////////////
  // VRController events

  /**
   * The updateElemInAtlas method.
   * @param {any} elem - The elem param.
   * @return {any} The return value.
   */
  updateElemInAtlas(elem) {
    return new Promise((resolve, reject) => {
      domtoimage.toCanvas(elem).then((canvas) => {
        const rect = elem.getBoundingClientRect();
        // Sometimes a render request occurs as the UI is being hidden.
        if (rect.width * rect.height == 0) {
          resolve();
          return
        }
        // console.log(rect.width, rect.height, rect.x, rect.y)
        // this.mainCtx.clearRect(rect.x, rect.y, rect.width, rect.height);
        this.mainCtx.fillRect(rect.x, rect.y, rect.width, rect.height);
        this.mainCtx.drawImage(canvas, rect.x, rect.y);
        resolve();
      });
    })
  }

  /**
   * The updateUIImage method.
   */
  updateUIImage() {
    const imageData = this.mainCtx.getImageData(
      0,
      0,
      this.__rect.width,
      this.__rect.height
    );
    this.__uiimage.setData(
      this.__rect.width,
      this.__rect.height,
      new Uint8Array(imageData.data.buffer)
    );
  }

  /**
   * The renderUIToImage method.
   */
  renderUIToImage() {
    domtoimage.toCanvas(this.__vrUIDOMElement).then((canvas) => {
      this.mainCtx = canvas.getContext('2d');
      this.mainCtx.fillStyle = '#FFFFFF';

      const rect = this.__vrUIDOMElement.getBoundingClientRect();
      // Sometimes a rendeer request occurs as the UI is being hidden.
      if (rect.width * rect.height == 0) return

      // const dpm = 0.0003; //dots-per-meter (1 each 1/2mm)
      if (
        rect.width != this.__rect.width ||
        rect.height != this.__rect.height
      ) {
        this.__rect = rect;
        const dpm = 0.0007; // dots-per-meter (1 each 1/2mm)
        this.__uiGeomOffsetXfo.sc.set(
          this.__rect.width * dpm,
          this.__rect.height * dpm,
          1.0
        );
        this.setGeomOffsetXfo(this.__uiGeomOffsetXfo);

        this.appData.session.pub('pose-message', {
          interfaceType: 'VR',
          updateUIPanel: {
            size: this.__uiGeomOffsetXfo.sc.toJSON(),
          },
        });
      }
      this.updateUIImage();
    });
  }

  /**
   * The sendMouseEvent method.
   * @param {any} eventName - The eventName param.
   * @param {any} args - The args param.
   * @param {any} element - The element param.
   * @return {any} The return value.
   */
  sendMouseEvent(eventName, args, element) {
    // console.log(eventName, element)

    // if (eventName == 'mousedown')
    //   console.log("clientX:" + args.clientX + " clientY:" + args.clientY);

    const event = new MouseEvent(
      eventName,
      Object.assign(
        {
          target: element,
          view: window,
          bubbles: true,
          // composed: true,
          cancelable: true,
        },
        args
      )
    );

    // Dispatch the event to a leaf item in the DOM tree.
    element.dispatchEvent(event);

    // The event is re-cycled to generate a 'click' event on mouse down.
    return event
  }
}

/**
 * Class representing a VR UI tool.
 * @extends BaseTool
 */
class VRUITool extends BaseTool {
  /**
   * Create a VR UI tool.
   * @param {any} appData - The appData value.
   */
  constructor(appData) {
    super(appData);

    this.__vrUIDOMHolderElement = document.createElement('div');
    this.__vrUIDOMHolderElement.className = 'vrUIHolder';
    this.__vrUIDOMElement = document.createElement('div');
    this.__vrUIDOMElement.className = 'vrUI';
    document.body.appendChild(this.__vrUIDOMHolderElement);

    this.controllerUI = new VRControllerUI(
      appData,
      this.__vrUIDOMHolderElement,
      this.__vrUIDOMElement
    );
    this.controllerUI.addRef(this);

    appData.renderer.addTreeItem(this.controllerUI);

    this.__uiLocalXfo = new Xfo();
    this.__uiLocalXfo.ori.setFromAxisAndAngle(new Vec3$1(1, 0, 0), Math.PI * -0.6);

    const pointermat = new Material('pointermat', 'LinesShader');
    pointermat.visibleInGeomDataBuffer = false;
    pointermat.getParameter('Color').setValue(new Color(1.2, 0, 0));

    const line = new Lines();
    line.setNumVertices(2);
    line.setNumSegments(1);
    line.setSegment(0, 0, 1);
    line.getVertex(0).set(0.0, 0.0, 0.0);
    line.getVertex(1).set(0.0, 0.0, -1.0);
    line.setBoundingBoxDirty();
    this.__pointerLocalXfo = new Xfo();
    this.__pointerLocalXfo.sc.set(1, 1, 0.1);
    this.__pointerLocalXfo.ori.setFromAxisAndAngle(
      new Vec3$1(1, 0, 0),
      Math.PI * -0.2
    );

    this.__uiPointerItem = new GeomItem('VRControllerPointer', line, pointermat);
    this.__uiPointerItem.addRef(this);

    this.__triggerHeld = false;
  }

  /**
   * The getName method.
   * @return {any} The return value.
   */
  getName() {
    return 'VRUITool'
  }

  // ///////////////////////////////////

  /**
   * The setUIControllers method.
   * @param {any} openUITool - The openUITool param.
   * @param {any} uiController - The uiController param.
   * @param {any} pointerController - The pointerController param.
   * @param {any} headXfo - The headXfo param.
   */
  setUIControllers(openUITool, uiController, pointerController, headXfo) {
    this.openUITool = openUITool;
    this.uiController = uiController;
    this.pointerController = pointerController;

    const xfoA = this.uiController
      .getTreeItem()
      .getParameter('GlobalXfo')
      .getValue();
    if (this.pointerController) {
      const xfoB = this.pointerController
        .getTreeItem()
        .getParameter('GlobalXfo')
        .getValue();
      const headToCtrlA = xfoA.tr.subtract(headXfo.tr);
      const headToCtrlB = xfoB.tr.subtract(headXfo.tr);
      if (headToCtrlA.cross(headToCtrlB).dot(headXfo.ori.getYaxis()) > 0.0) {
        this.__uiLocalXfo.tr.set(0.05, -0.05, 0.08);
      } else {
        this.__uiLocalXfo.tr.set(-0.05, -0.05, 0.08);
      }
    } else {
      this.__uiLocalXfo.tr.set(0, -0.05, 0.08);
    }

    this.controllerUI.getParameter('LocalXfo').setValue(this.__uiLocalXfo);
  }

  /**
   * The activateTool method.
   */
  activateTool() {
    super.activateTool();

    this.controllerUI.activate();

    if (this.uiController) {
      this.uiController.getTipItem().addChild(this.controllerUI, false);
      if (this.pointerController)
        this.pointerController
          .getTipItem()
          .addChild(this.__uiPointerItem, false);

      this.appData.session.pub('pose-message', {
        interfaceType: 'VR',
        showUIPanel: {
          controllerId: this.uiController.getId(),
          localXfo: this.__uiLocalXfo.toJSON(),
          size: this.controllerUI.getGeomOffsetXfo().sc.toJSON(),
        },
      });
    }
  }

  /**
   * The deactivateTool method.
   */
  deactivateTool() {
    super.deactivateTool();

    this.controllerUI.deactivate();

    if (this.uiController) {
      this.uiController.getTipItem().removeChildByHandle(this.controllerUI);
      if (this.pointerController) {
        this.pointerController
          .getTipItem()
          .removeChildByHandle(this.__uiPointerItem);
      }

      this.appData.session.pub('pose-message', {
        interfaceType: 'VR',
        hideUIPanel: {
          controllerId: this.uiController.getId(),
        },
      });
    }
  }

  // ///////////////////////////////////
  // VRController events

  /**
   * The setPointerLength method.
   * @param {any} length - The length param.
   */
  setPointerLength(length) {
    this.__pointerLocalXfo.sc.set(1, 1, length);
    this.__uiPointerItem
      .getParameter('LocalXfo')
      .setValue(this.__pointerLocalXfo);
  }

  /**
   * The calcUIIntersection method.
   * @return {any} The return value.
   */
  calcUIIntersection() {
    const pointerXfo = this.__uiPointerItem.getParameter('GlobalXfo').getValue();
    const pointervec = pointerXfo.ori.getZaxis().negate();
    const ray = new Ray(pointerXfo.tr, pointervec);

    const planeXfo = this.controllerUI.getParameter('GlobalXfo').getValue();
    const planeSize = this.controllerUI.getGeomOffsetXfo().sc;
    const plane = new Ray(planeXfo.tr, planeXfo.ori.getZaxis().negate());
    const res = ray.intersectRayPlane(plane);
    if (res <= 0) {
      // Let the pointer shine right past the UI.
      this.setPointerLength(0.5);
      return
    }
    const hitOffset = pointerXfo.tr
      .add(pointervec.scale(res))
      .subtract(plane.start);
    const x = hitOffset.dot(planeXfo.ori.getXaxis()) / planeSize.x;
    const y = hitOffset.dot(planeXfo.ori.getYaxis()) / planeSize.y;
    if (Math.abs(x) > 0.5 || Math.abs(y) > 0.5) {
      // Let the pointer shine right past the UI.
      this.setPointerLength(0.5);
      return
    }
    this.setPointerLength(res);
    const rect = this.__vrUIDOMElement.getBoundingClientRect();
    return {
      clientX: Math.round(x * rect.width + rect.width / 2),
      clientY: Math.round(y * -rect.height + rect.height / 2),
    }
  }

  /**
   * The sendEventToUI method.
   * @param {any} eventName - The eventName param.
   * @param {any} args - The args param.
   * @return {any} The return value.
   */
  sendEventToUI(eventName, args) {
    const hit = this.calcUIIntersection();
    if (hit) {
      hit.offsetX = hit.pageX = hit.pageX = hit.screenX = hit.clientX;
      hit.offsetY = hit.pageY = hit.pageY = hit.screenY = hit.clientY;
      const element = document.elementFromPoint(hit.clientX, hit.clientY);
      if (element != this._element) {
        if (this._element)
          this.controllerUI.sendMouseEvent(
            'mouseleave',
            Object.assign(args, hit),
            this._element
          );
        this._element = element;
        this.controllerUI.sendMouseEvent(
          'mouseenter',
          Object.assign(args, hit),
          this._element
        );
      }
      this.controllerUI.sendMouseEvent(
        eventName,
        Object.assign(args, hit),
        this._element
      );
      return this._element
    } else if (this._element) {
      this.controllerUI.sendMouseEvent(
        'mouseleave',
        Object.assign(args, hit),
        this._element
      );
      this._element = null;
    }
  }

  /**
   * The onVRControllerButtonDown method.
   * @param {any} event - The event param.
   * @return {any} The return value.
   */
  onVRControllerButtonDown(event) {
    if (event.controller == this.pointerController) {
      this.__triggerHeld = true;
      const target = this.sendEventToUI('mousedown', {
        button: event.button - 1,
      });
      if (target) {
        this.__triggerDownElem = target;
      } else {
        this.__triggerDownElem = null;
      }
    }

    // While the UI is open, no other tools get events.
    return true
  }

  /**
   * The onVRControllerButtonUp method.
   * @param {any} event - The event param.
   * @return {any} The return value.
   */
  onVRControllerButtonUp(event) {
    if (event.controller == this.pointerController) {
      this.__triggerHeld = false;
      const target = this.sendEventToUI('mouseup', {
        button: event.button - 1,
      });
      if (target && this.__triggerDownElem == target) {
        this.sendEventToUI('click', {
          button: event.button - 1,
        });
      }
      this.__triggerDownElem = null;
    }

    // While the UI is open, no other tools get events.
    return true
  }

  /**
   * The onVRPoseChanged method.
   * @param {any} event - The event param.
   * @return {any} The return value.
   */
  onVRPoseChanged(event) {
    // Controller coordinate system
    // X = Horizontal.
    // Y = Up.
    // Z = Towards handle base.
    const headXfo = event.viewXfo;
    const checkControllers = () => {
      const xfoA = this.uiController
        .getTreeItem()
        .getParameter('GlobalXfo')
        .getValue();
      const headToCtrlA = xfoA.tr.subtract(headXfo.tr);
      headToCtrlA.normalizeInPlace();
      if (headToCtrlA.angleTo(xfoA.ori.getYaxis()) > Math.PI * 0.5) {
        // Remove ourself from the system.
        this.appData.toolManager.removeToolByHandle(this);
        return false
      }
      return true
    };

    // if (!this.__triggerHeld) {
    //   if(checkControllers()){
    //     this.calcUIIntersection();
    //   }
    // } else {
    if (checkControllers()) {
      this.sendEventToUI('mousemove', {});
    }

    // While the UI is open, no other tools get events.
    return true
  }
}

/**
 * Class representing a hold objects change.
 * @extends Change
 */
class HoldObjectsChange extends Change {
  /**
   * Create a hold objects change.
   * @param {any} data - The data value.
   */
  constructor(data) {
    super('HoldObjectsChange');

    this.__selection = [];
    this.__prevXfos = [];
    this.__newXfos = [];

    if (data) this.update(data);
  }

  /**
   * The undo method.
   */
  undo() {
    for (let i = 0; i < this.__selection.length; i++) {
      if (this.__selection[i]) {
        this.__selection[i]
          .getParameter('GlobalXfo')
          .setValue(this.__prevXfos[i]);
      }
    }
  }

  /**
   * The redo method.
   */
  redo() {
    for (let i = 0; i < this.__selection.length; i++) {
      if (this.__selection[i]) {
        this.__selection[i]
          .getParameter('GlobalXfo')
          .setValue(this.__newXfos[i]);
      }
    }
  }

  /**
   * The update method.
   * @param {any} updateData - The updateData param.
   */
  update(updateData) {
    if (updateData.newItem) {
      this.__selection[updateData.newItemId] = updateData.newItem;
      this.__prevXfos[updateData.newItemId] = updateData.newItem
        .getParameter('GlobalXfo')
        .getValue();
    } else if (updateData.changeXfos) {
      for (let i = 0; i < updateData.changeXfoIds.length; i++) {
        const gidx = updateData.changeXfoIds[i];
        if (!this.__selection[gidx]) continue
        this.__selection[gidx]
          .getParameter('GlobalXfo')
          .setValue(updateData.changeXfos[i]);
        this.__newXfos[gidx] = updateData.changeXfos[i];
      }
    }
    this.emit('updated', updateData);
  }

  /**
   * The toJSON method.
   * @param {any} context - The context param.
   * @return {any} The return value.
   */
  toJSON(context) {
    const j = super.toJSON(context);

    const itemPaths = [];
    for (let i = 0; i < this.__selection.length; i++) {
      if (this.__selection[i]) {
        itemPaths[i] = this.__selection[i].getPath();
      } else {
        itemPaths.push(null);
      }
    }
    j.itemPaths = itemPaths;

    return j
  }

  /**
   * The fromJSON method.
   * @param {any} j - The j param.
   * @param {any} context - The context param.
   */
  fromJSON(j, context) {
    super.fromJSON(j, context);

    const sceneRoot = context.appData.scene.getRoot();
    const newSelection = [];
    for (let i = 0; i < j.itemPaths.length; i++) {
      const itemPath = j.itemPaths[i];
      if (itemPath) {
        newSelection[i] = sceneRoot.resolvePath(itemPath, 1);
      }
    }
    this.__selection = newSelection;
  }

  // changeFromJSON(j) {

  //   if(updateData.newItem) {
  //     this.__selection[updateData.newItemId] = updateData.newItem;
  //     this.__prevXfos[updateData.newItemId] = updateData.newItem.getParameter('GlobalXfo').getValue();
  //   }
  //   else if(updateData.changeXfos) {
  //     for(let i=0; i<updateData.changeXfoIds.length; i++){
  //       const gidx = updateData.changeXfoIds[i];
  //       if(!this.__selection[gidx])
  //         continue;
  //       this.__selection[gidx].getParameter('GlobalXfo').setValue(
  //         updateData.changeXfos[i],
  //         ValueSetMode.REMOTEUSER_SETVALUE);
  //       this.__newXfos[gidx] = updateData.changeXfos[i];
  //     }
  //   }
  //   this.emit('updated', updateData);
  // }
}

UndoRedoManager.registerChange('HoldObjectsChange', HoldObjectsChange);

/**
 * Class representing a VR hold objects tool.
 * @extends BaseTool
 */
class VRHoldObjectsTool extends BaseTool {
  /**
   * Create a VR hold objects tool.
   * @param {any} appData - The appData value.
   */
  constructor(appData) {
    super(appData);

    this.__pressedButtonCount = 0;

    this.__freeIndices = [];
    this.__vrControllers = [];
    this.__heldObjectCount = 0;
    this.__heldGeomItems = [];
    this.__heldGeomItemIds = []; // controller id to held goem id.
    this.__heldGeomItemRefs = [];
    this.__heldGeomItemOffsets = [];
  }

  /**
   * The activateTool method.
   */
  activateTool() {
    super.activateTool();
    console.log('activateTool.VRHoldObjectsTool');

    this.appData.renderer.getDiv().style.cursor = 'crosshair';

    const addIconToController = (controller) => {
      // The tool might already be deactivated.
      if (!this.__activated) return
      const cross = new Cross(0.03);
      const mat = new Material('Cross', 'FlatSurfaceShader');
      mat.getParameter('BaseColor').setValue(new Color('#03E3AC'));
      mat.visibleInGeomDataBuffer = false;
      const geomItem = new GeomItem('HandleToolTip', cross, mat);
      controller.getTipItem().removeAllChildren();
      controller.getTipItem().addChild(geomItem, false);
    };

    this.appData.renderer.getXRViewport().then((xrvp) => {
      for (const controller of xrvp.getControllers())
        addIconToController(controller);
      this.addIconToControllerId = xrvp.on(
        'controllerAdded',
        addIconToController
      );
    });
  }

  /**
   * The deactivateTool method.
   */
  deactivateTool() {
    super.deactivateTool();

    this.appData.renderer.getXRViewport().then((xrvp) => {
      // for(let controller of xrvp.getControllers()) {
      //   controller.getTipItem().removeAllChildren();
      // }
      xrvp.removeListenerById('controllerAdded', this.addIconToControllerId);
    });
  }

  // ///////////////////////////////////
  // VRController events

  /**
   * The computeGrabXfo method.
   * @param {any} refs - The refs param.
   * @return {any} The return value.
   */
  computeGrabXfo(refs) {
    let grabXfo;
    if (refs.length == 1) {
      grabXfo = this.__vrControllers[refs[0]].getTipXfo();
    } else if (refs.length == 2) {
      const xfo0 = this.__vrControllers[refs[0]].getTipXfo();
      const xfo1 = this.__vrControllers[refs[1]].getTipXfo();

      xfo0.ori.alignWith(xfo1.ori);

      grabXfo = new Xfo();
      grabXfo.tr = xfo0.tr.lerp(xfo1.tr, 0.5);
      grabXfo.ori = xfo0.ori.lerp(xfo1.ori, 0.5);

      let vec0 = xfo1.tr.subtract(xfo0.tr);
      vec0.normalizeInPlace();
      const vec1 = grabXfo.ori.getXaxis();
      if (vec0.dot(vec1) < 0.0) vec0 = vec0.negate();

      const angle = vec0.angleTo(vec1);
      if (angle > 0) {
        const axis = vec1.cross(vec0);
        axis.normalizeInPlace();
        const align = new Quat();
        align.setFromAxisAndAngle(axis, angle);
        grabXfo.ori = align.multiply(grabXfo.ori);
      }
    }
    return grabXfo
  }

  /**
   * The initAction method.
   */
  initAction() {
    for (let i = 0; i < this.__heldGeomItems.length; i++) {
      const heldGeom = this.__heldGeomItems[i];
      if (!heldGeom) continue
      const grabXfo = this.computeGrabXfo(this.__heldGeomItemRefs[i]);
      this.__heldGeomItemOffsets[i] = grabXfo
        .inverse()
        .multiply(heldGeom.getParameter('GlobalXfo').getValue());
    }
  }

  /**
   * The onVRControllerButtonDown method.
   * @param {any} event - The event param.
   * @return {any} The return value.
   */
  onVRControllerButtonDown(event) {
    const id = event.controller.getId();
    this.__vrControllers[id] = event.controller;

    const intersectionData = event.controller.getGeomItemAtTip();
    if (intersectionData) {
      if (intersectionData.geomItem.getOwner() instanceof Handle) return false

      // console.log("onMouseDown on Geom"); // + " Material:" + geomItem.getMaterial().name);
      // console.log(intersectionData.geomItem.getPath()); // + " Material:" + geomItem.getMaterial().name);
      event.intersectionData = intersectionData;
      intersectionData.geomItem.onMouseDown(event, intersectionData);
      if (!event.propagating) return false

      let gidx = this.__heldGeomItems.indexOf(intersectionData.geomItem);
      if (gidx == -1) {
        gidx = this.__heldGeomItems.length;
        this.__heldObjectCount++;
        this.__heldGeomItems.push(intersectionData.geomItem);
        this.__heldGeomItemRefs[gidx] = [id];
        this.__heldGeomItemIds[id] = gidx;

        const changeData = {
          newItem: intersectionData.geomItem,
          newItemId: gidx,
        };
        if (!this.change) {
          this.change = new HoldObjectsChange(changeData);
          this.appData.undoRedoManager.addChange(this.change);
        } else {
          this.change.update(changeData);
        }
      } else {
        this.__heldGeomItemIds[id] = gidx;
        this.__heldGeomItemRefs[gidx].push(id);
      }
      this.initAction();
      return true
    }
  }

  /**
   * The onVRControllerButtonUp method.
   * @param {any} event - The event param.
   * @return {any} The return value.
   */
  onVRControllerButtonUp(event) {
    const id = event.controller.getId();

    this.__pressedButtonCount--;
    if (this.__heldGeomItemIds[id] !== undefined) {
      const gidx = this.__heldGeomItemIds[id];
      const refs = this.__heldGeomItemRefs[gidx];
      refs.splice(refs.indexOf(id), 1);
      if (refs.length == 0) {
        this.__heldObjectCount--;
        this.__heldGeomItems[gidx] = undefined;

        this.change = undefined;
      }
      this.__heldGeomItemIds[id] = undefined;
      this.initAction();
      return true
    }
  }

  /**
   * The onVRPoseChanged method.
   * @param {any} event - The event param.
   * @return {any} The return value.
   */
  onVRPoseChanged(event) {
    if (!this.change) return false

    const changeXfos = [];
    const changeXfoIds = [];
    for (let i = 0; i < this.__heldGeomItems.length; i++) {
      const heldGeom = this.__heldGeomItems[i];
      if (!heldGeom) continue
      const grabXfo = this.computeGrabXfo(this.__heldGeomItemRefs[i]);
      changeXfos.push(grabXfo.multiply(this.__heldGeomItemOffsets[i]));
      changeXfoIds.push(i);
    }

    this.change.update({ changeXfos, changeXfoIds });

    return true
  }
}

/**
 * Class representing base create tool.
 * @extends BaseTool
 */
class BaseCreateTool extends BaseTool {
  /**
   * Create a base create tool.
   * @param {any} appData - The appData value.
   */
  constructor(appData) {
    super(appData);
  }

  /**
   * The isPrimaryTool method.
   * @return {any} The return value.
   */
  isPrimaryTool() {
    return true
  }
}

/**
 * Class representing a create geom change.
 * @extends Change
 */
class CreateGeomChange extends Change {
  /**
   * Create a create circle change.
   * @param {any} name - The name value.
   */
  constructor(name) {
    super(name);
  }

  /**
   * The setParentAndXfo method.
   * @param {any} parentItem - The parentItem param.
   * @param {any} xfo - The xfo param.
   */
  setParentAndXfo(parentItem, xfo) {
    this.parentItem = parentItem;
    const name = this.parentItem.generateUniqueName(this.geomItem.getName());
    this.geomItem.setName(name);
    this.geomItem.getParameter('GlobalXfo').setValue(xfo);
    this.childIndex = this.parentItem.addChild(this.geomItem, true);

    this.geomItem.addRef(this); // keep a ref to stop it being destroyed
  }

  /**
   * The undo method.
   */
  undo() {
    this.parentItem.removeChild(this.childIndex);
  }

  /**
   * The redo method.
   */
  redo() {
    this.parentItem.addChild(this.geomItem, false, false);
  }

  /**
   * The toJSON method.
   * @param {any} appData - The appData param.
   * @return {any} The return value.
   */
  toJSON(context) {
    const j = super.toJSON(context);
    j.parentItemPath = this.parentItem.getPath();
    j.geomItemName = this.geomItem.getName();
    j.geomItemXfo = this.geomItem.getParameter('LocalXfo').getValue();
    return j
  }

  /**
   * The fromJSON method.
   * @param {any} j - The j param.
   * @param {any} appData - The appData param.
   */
  fromJSON(j, context) {
    const sceneRoot = context.appData.scene.getRoot();
    this.parentItem = sceneRoot.resolvePath(j.parentItemPath, 1);
    this.geomItem.setName(this.parentItem.generateUniqueName(j.geomItemName));
    const xfo = new Xfo();
    xfo.fromJSON(j.geomItemXfo);
    this.geomItem.getParameter('LocalXfo').setValue(xfo);
    this.childIndex = this.parentItem.addChild(this.geomItem, false);
  }

  // changeFromJSON(j) {
  //   if (this.__newValue.fromJSON)
  //     this.__newValue.fromJSON(j.value);
  //   else
  //     this.__newValue = j.value;
  // }

  /**
   * The destroy method.
   */
  destroy() {
    this.geomItem.removeRef(this); // remove the tmp ref.
  }
}

/**
 * Class representing a create geom tool.
 * @extends BaseCreateTool
 */
class CreateGeomTool extends BaseCreateTool {
  /**
   * Create a create geom tool.
   * @param {any} appData - The appData value.
   */
  constructor(appData) {
    super(appData);

    this.stage = 0;
    this.removeToolOnRightClick = true;

    this.cp = this.addParameter(
      new ColorParameter('Line Color', new Color(0.7, 0.2, 0.2))
    );
  }

  /**
   * The activateTool method.
   */
  activateTool() {
    super.activateTool();

    this.appData.renderer.getDiv().style.cursor = 'crosshair';

    this.appData.renderer.getXRViewport().then((xrvp) => {
      if (!this.vrControllerToolTip) {
        this.vrControllerToolTip = new Cross(0.05);
        this.vrControllerToolTipMat = new Material(
          'VRController Cross',
          'LinesShader'
        );
        this.vrControllerToolTipMat
          .getParameter('Color')
          .setValue(this.cp.getValue());
        this.vrControllerToolTipMat.visibleInGeomDataBuffer = false;
      }
      const addIconToController = (controller) => {
        const geomItem = new GeomItem(
          'CreateGeomToolTip',
          this.vrControllerToolTip,
          this.vrControllerToolTipMat
        );
        controller.getTipItem().removeAllChildren();
        controller.getTipItem().addChild(geomItem, false);
      };
      for (const controller of xrvp.getControllers()) {
        addIconToController(controller);
      }
      this.addIconToControllerId = xrvp.on(
        'controllerAdded',
        addIconToController
      );
    });
  }

  /**
   * The deactivateTool method.
   */
  deactivateTool() {
    super.deactivateTool();

    this.appData.renderer.getDiv().style.cursor = 'pointer';

    this.appData.renderer.getXRViewport().then((xrvp) => {
      // for(let controller of xrvp.getControllers()) {
      //   controller.getTipItem().removeAllChildren();
      // }
      xrvp.removeListenerById('controllerAdded', this.addIconToControllerId);
    });
  }

  /**
   * The screenPosToXfo method.
   * @param {any} screenPos - The screenPos param.
   * @param {any} viewport - The viewport param.
   * @return {any} The return value.
   */
  screenPosToXfo(screenPos, viewport) {
    //

    const ray = viewport.calcRayFromScreenPos(screenPos);

    // Raycast any working planes.
    const planeRay = new Ray(
      this.constructionPlane.tr,
      this.constructionPlane.ori.getZaxis()
    );
    const dist = ray.intersectRayPlane(planeRay);
    if (dist > 0.0) {
      const xfo = this.constructionPlane.clone();
      xfo.tr = ray.pointAtDist(dist);
      return xfo
    }

    // else project based on focal dist.
    const camera = viewport.getCamera();
    const xfo = camera.getParameter('GlobalXfo').getValue().clone();
    xfo.tr = ray.pointAtDist(camera.getFocalDistance());
    return xfo
  }

  /**
   * The createStart method.
   * @param {any} xfo - The xfo param.
   * @param {any} parentItem - The parentItem param.
   */
  createStart(xfo, parentItem) {
    this.stage = 1;
  }

  /**
   * The createPoint method.
   * @param {any} pt - The pt param.
   */
  createPoint(pt) {}

  /**
   * The createMove method.
   * @param {any} pt - The pt param.
   */
  createMove(pt) {}

  /**
   * The createRelease method.
   * @param {any} pt - The pt param.
   */
  createRelease(pt) {}

  // ///////////////////////////////////
  // Mouse events

  /**
   * The onMouseDown method.
   * @param {any} event - The event param.
   * @return {any} The return value.
   */
  onMouseDown(event) {
    //
    if (this.stage == 0) {
      if (event.button == 0) {
        this.constructionPlane = new Xfo();

        const xfo = this.screenPosToXfo(event.mousePos, event.viewport);
        this.createStart(xfo, this.appData.scene.getRoot());
      } else if (event.button == 2) {
        // Cancel the tool.
        if (this.removeToolOnRightClick)
          this.appData.toolManager.removeTool(this.index);
      }
      return true
    } else if (event.button == 2) {
      this.appData.undoRedoManager.undo(false);
      this.stage = 0;
      return true
    }
    return true
  }

  /**
   * The onMouseMove method.
   * @param {any} event - The event param.
   * @return {any} The return value.
   */
  onMouseMove(event) {
    if (this.stage > 0) {
      const xfo = this.screenPosToXfo(event.mousePos, event.viewport);
      this.createMove(xfo.tr);
      return true
    }
  }

  /**
   * The onMouseUp method.
   * @param {any} event - The event param.
   * @return {any} The return value.
   */
  onMouseUp(event) {
    if (this.stage > 0) {
      const xfo = this.screenPosToXfo(event.mousePos, event.viewport);
      this.createRelease(xfo.tr);
      return true
    }
  }

  /**
   * The onWheel method.
   * @param {any} event - The event param.
   */
  onWheel(event) {}

  // ///////////////////////////////////
  // Keyboard events

  /**
   * The onKeyPressed method.
   * @param {any} key - The key param.
   * @param {any} event - The event param.
   */
  onKeyPressed(event) {}

  /**
   * The onKeyDown method.
   * @param {any} key - The key param.
   * @param {any} event - The event param.
   */
  onKeyDown(event) {}

  /**
   * The onKeyUp method.
   * @param {any} key - The key param.
   * @param {any} event - The event param.
   */
  onKeyUp(event) {}

  // ///////////////////////////////////
  // Touch events

  /**
   * The onTouchStart method.
   * @param {any} event - The event param.
   */
  onTouchStart(event) {}

  /**
   * The onTouchMove method.
   * @param {any} event - The event param.
   */
  onTouchMove(event) {}

  /**
   * The onTouchEnd method.
   * @param {any} event - The event param.
   */
  onTouchEnd(event) {}

  /**
   * The onTouchCancel method.
   * @param {any} event - The event param.
   */
  onTouchCancel(event) {}

  // ///////////////////////////////////
  // VRController events

  /**
   * The onVRControllerButtonDown method.
   * @param {any} event - The event param.
   * @return {any} The return value.
   */
  onVRControllerButtonDown(event) {
    if (!this.__activeController) {
      // TODO: Snap the Xfo to any nearby construction planes.
      this.__activeController = event.controller;
      this.constructionPlane = new Xfo();
      const xfo = this.constructionPlane.clone();
      xfo.tr = this.__activeController.getTipXfo().tr;
      this.createStart(xfo, this.appData.scene.getRoot());
    }
    return true
  }

  /**
   * The onVRPoseChanged method.
   * @param {any} event - The event param.
   * @return {any} The return value.
   */
  onVRPoseChanged(event) {
    if (this.__activeController && this.stage > 0) {
      // TODO: Snap the Xfo to any nearby construction planes.
      const xfo = this.__activeController.getTipXfo();
      this.createMove(xfo.tr);
      return true
    }
  }

  /**
   * The onVRControllerButtonUp method.
   * @param {any} event - The event param.
   * @return {any} The return value.
   */
  onVRControllerButtonUp(event) {
    if (this.stage > 0) {
      if (this.__activeController == event.controller) {
        const xfo = this.__activeController.getTipXfo();
        this.createRelease(xfo.tr);
        if (this.stage == 0) this.__activeController = undefined;
        return true
      }
    }
  }
}

/**
 * Class representing a create line change.
 * @extends CreateGeomChange
 */
class CreateLineChange extends CreateGeomChange {
  /**
   * Create a create line change.
   * @param {any} parentItem - The parentItem value.
   * @param {any} xfo - The xfo value.
   * @param {any} color - The color value.
   * @param {any} thickness - The thickness value.
   */
  constructor(parentItem, xfo, color, thickness) {
    super('Create Line');

    this.line = new Lines(0.0);
    this.line.setNumVertices(2);
    this.line.setNumSegments(1);
    this.line.setSegment(0, 0, 1);
    const material = new Material('Line', 'LinesShader');
    material.getParameter('Color').setValue(new Color(0.7, 0.2, 0.2));
    this.geomItem = new GeomItem('Line');
    this.geomItem.setGeometry(this.line);
    this.geomItem.setMaterial(material);

    if (color) {
      material.getParameter('Color').setValue(color);
    }

    if (thickness) {
      this.line.lineThickness = thickness;
      // this.line.addVertexAttribute('lineThickness', Float32, 0.0);
    }

    if (parentItem && xfo) {
      this.setParentAndXfo(parentItem, xfo);
    }
  }

  /**
   * The update method.
   * @param {any} updateData - The updateData param.
   */
  update(updateData) {
    if (updateData.p1) {
      this.line.getVertex(1).setFromOther(updateData.p1);
      this.line.geomDataChanged.emit();
    }
    this.emit('updated', updateData);
  }

  /**
   * The fromJSON method.
   * @param {any} j - The j param.
   * @param {any} context - The context param.
   */
  fromJSON(j, context) {
    super.fromJSON(j, context);
    if (j.color) {
      const color = new Color();
      color.fromJSON(j.color);
      material.getParameter('Color').setValue(color);
    }

    if (j.thickness) {
      this.line.lineThickness = j.thickness;
      // this.line.addVertexAttribute('lineThickness', Float32, 0.0);
    }
  }
}
UndoRedoManager.registerChange('CreateLineChange', CreateLineChange);

/**
 * Class representing a create line tool.
 * @extends CreateGeomTool
 */
class CreateLineTool extends CreateGeomTool {
  /**
   * Create a create line tool.
   * @param {any} appData - The appData value.
   */
  constructor(appData) {
    super(appData);

    this.tp = this.addParameter(
      new NumberParameter('Line Thickness', 0.06, [0, 0.1])
    ); // 1cm.
  }

  // activateTool() {
  //   super.activateTool();

  //   this.appData.renderer.getDiv().style.cursor = "crosshair";

  //   this.appData.renderer.getXRViewport().then(xrvp => {
  //     if(!this.vrControllerToolTip) {
  //       this.vrControllerToolTip = new Sphere(this.tp.getValue(), 64);
  //       this.vrControllerToolTipMat = new Material('marker', 'FlatSurfaceShader');
  //       this.vrControllerToolTipMat.getParameter('BaseColor').setValue(this.cp.getValue());
  //     }
  //     const addIconToController = (controller) => {
  //       // The tool might already be deactivated.
  //       if(!this.__activated)
  //         return;
  //       const geomItem = new GeomItem('VRControllerTip', this.vrControllerToolTip, this.vrControllerToolTipMat);
  //       controller.getTipItem().removeAllChildren();
  //       controller.getTipItem().addChild(geomItem, false);
  //     }
  //     for(let controller of xrvp.getControllers()) {
  //       addIconToController(controller)
  //     }
  //     this.addIconToControllerId = xrvp.on('controllerAdded', addIconToController);
  //   });

  // }

  // deactivateTool() {
  //   super.deactivateTool();

  //   this.appData.renderer.getDiv().style.cursor = "pointer";

  //   this.appData.renderer.getXRViewport().then(xrvp => {
  //     // for(let controller of xrvp.getControllers()) {
  //     //   controller.getTipItem().removeAllChildren();
  //     // }
  //     xrvp.removeListenerById('controllerAdded', this.addIconToControllerId);
  //   });
  // }

  /**
   * The createStart method.
   * @param {any} xfo - The xfo param.
   * @param {any} parentItem - The parentItem param.
   */
  createStart(xfo, parentItem) {
    this.change = new CreateLineChange(parentItem, xfo);
    this.appData.undoRedoManager.addChange(this.change);

    this.xfo = xfo.inverse();
    this.stage = 1;
    this.length = 0.0;
  }

  /**
   * The createMove method.
   * @param {any} pt - The pt param.
   */
  createMove(pt) {
    const offet = this.xfo.transformVec3(pt);
    this.length = offet.length();
    this.change.update({ p1: offet });
  }

  /**
   * The createRelease method.
   * @param {any} pt - The pt param.
   */
  createRelease(pt) {
    if (this.length == 0) {
      this.appData.undoRedoManager.undo(false);
    }
    this.stage = 0;
    this.emit('actionFinished');
  }
}

/**
 * Class representing a create circle change.
 * @extends CreateGeomChange
 */
class CreateCircleChange extends CreateGeomChange {
  /**
   * Create a create circle change.
   * @param {any} parentItem - The parentItem value.
   * @param {any} xfo - The xfo value.
   */
  constructor(parentItem, xfo) {
    super('Create Circle', parentItem);

    this.circle = new Circle(0, 64);
    this.circle.lineThickness = 0.05;
    // const material = new Material('circle', 'LinesShader');
    const material = new Material('circle', 'FatLinesShader');
    material.getParameter('Color').setValue(new Color(0.7, 0.2, 0.2));
    this.geomItem = new GeomItem('Circle');
    this.geomItem.setGeometry(this.circle);
    this.geomItem.setMaterial(material);

    if (parentItem && xfo) {
      this.setParentAndXfo(parentItem, xfo);
    }
  }

  /**
   * The update method.
   * @param {any} updateData - The updateData param.
   */
  update(updateData) {
    this.circle.getParameter('Radius').setValue(updateData.radius);
    this.emit('updated', updateData);
  }

  /**
   * The toJSON method.
   * @return {any} The return value.
   */
  toJSON() {
    const j = super.toJSON();
    j.radius = this.circle.getParameter('Radius').getValue();
    return j
  }

  /**
   * The changeFromJSON method.
   * @param {any} j - The j param.
   */
  changeFromJSON(j) {
    console.log('CreateCircleChange:', j);
    if (j.radius) this.circle.getParameter('Radius').setValue(j.radius);
  }
}
UndoRedoManager.registerChange('CreateCircleChange', CreateCircleChange);

/**
 * Class representing a create circle tool.
 * @extends CreateGeomTool
 */
class CreateCircleTool extends CreateGeomTool {
  /**
   * Create a create circle tool.
   * @param {any} appData - The appData value.
   */
  constructor(appData) {
    super(appData);
  }

  /**
   * The createStart method.
   * @param {any} xfo - The xfo param.
   * @param {any} parentItem - The parentItem param.
   */
  createStart(xfo, parentItem) {
    this.change = new CreateCircleChange(parentItem, xfo);
    this.appData.undoRedoManager.addChange(this.change);

    this.xfo = xfo;
    this.stage = 1;
    this.radius = 0.0;
  }

  /**
   * The createMove method.
   * @param {any} pt - The pt param.
   */
  createMove(pt) {
    this.radius = pt.distanceTo(this.xfo.tr);
    this.change.update({ radius: this.radius });
  }

  /**
   * The createRelease method.
   * @param {any} pt - The pt param.
   */
  createRelease(pt) {
    if (this.radius == 0) {
      this.appData.undoRedoManager.undo(false);
    }
    this.change = null;
    this.stage = 0;
    this.emit('actionFinished');
  }
}

/**
 * Class representing a create rect change.
 * @extends CreateGeomChange
 */
class CreateRectChange extends CreateGeomChange {
  /**
   * Create a create rect change.
   * @param {any} parentItem - The parentItem value.
   * @param {any} xfo - The xfo value.
   */
  constructor(parentItem, xfo) {
    super('Create Rect');

    this.rect = new Rect(0, 0);
    this.rect.lineThickness = 0.05;
    // const material = new Material('rect', 'LinesShader');
    const material = new Material('circle', 'FatLinesShader');
    material.getParameter('Color').setValue(new Color(0.7, 0.2, 0.2));
    this.geomItem = new GeomItem('Rect');
    this.geomItem.setGeometry(this.rect);
    this.geomItem.setMaterial(material);

    if (parentItem && xfo) {
      this.setParentAndXfo(parentItem, xfo);
    }
  }

  /**
   * The update method.
   * @param {any} updateData - The updateData param.
   */
  update(updateData) {
    if (updateData.baseSize) {
      this.rect.setSize(updateData.baseSize[0], updateData.baseSize[1]);
    }
    if (updateData.tr) {
      const xfo = this.geomItem.getParameter('LocalXfo').getValue();
      xfo.tr.fromJSON(updateData.tr);
      this.geomItem.getParameter('LocalXfo').setValue(xfo);
    }

    this.emit('updated', updateData);
  }
}
UndoRedoManager.registerChange('CreateRectChange', CreateRectChange);

/**
 * Class representing a create rect tool.
 * @extends CreateGeomTool
 */
class CreateRectTool extends CreateGeomTool {
  /**
   * Create a create rect tool.
   * @param {any} appData - The appData value.
   */
  constructor(appData) {
    super(appData);
  }

  /**
   * The createStart method.
   * @param {any} xfo - The xfo param.
   * @param {any} parentItem - The parentItem param.
   */
  createStart(xfo, parentItem) {
    this.change = new CreateRectChange(parentItem, xfo);
    this.appData.undoRedoManager.addChange(this.change);

    this.xfo = xfo;
    this.invxfo = xfo.inverse();
    this.stage = 1;
    this._size = 0.0;
  }

  /**
   * The createMove method.
   * @param {any} pt - The pt param.
   */
  createMove(pt) {
    if (this.stage == 1) {
      const delta = this.invxfo.transformVec3(pt)

      ;(this._size = Math.abs(delta.x)), Math.abs(delta.y);

      // const delta = pt.subtract(this.xfo.tr)
      this.change.update({
        baseSize: [Math.abs(delta.x), Math.abs(delta.y)],
        tr: this.xfo.tr.add(delta.scale(0.5)),
      });
    } else {
      const vec = this.invxfo.transformVec3(pt);
      this.change.update({ height: vec.y });
    }
  }

  /**
   * The createRelease method.
   * @param {any} pt - The pt param.
   * @param {any} viewport - The viewport param.
   */
  createRelease(pt, viewport) {
    if (this._size == 0) {
      this.appData.undoRedoManager.undo(false);
    }
    this.stage = 0;
    this.emit('actionFinished');
  }
}

/**
 * Class representing a create freehand line change.
 * @extends CreateGeomChange
 */
class CreateFreehandLineChange extends CreateGeomChange {
  /**
   * Create a create freehand line change.
   * @param {any} parentItem - The parentItem value.
   * @param {any} xfo - The xfo value.
   * @param {any} color - The color value.
   * @param {any} thickness - The thickness value.
   */
  constructor(parentItem, xfo, color, thickness) {
    super('Create Freehand Line');

    this.used = 0;
    this.vertexCount = 100;

    this.line = new Lines();
    this.line.setNumVertices(this.vertexCount);
    this.line.setNumSegments(this.vertexCount - 1);
    this.line.vertices.setValue(0, new Vec3$1());

    // const material = new Material('freeHandLine', 'LinesShader');
    // this.line.lineThickness = 0.5;
    // const material = new Material('freeHandLine', 'LinesShader');
    const material = new Material('freeHandLine', 'FatLinesShader');

    this.geomItem = new GeomItem('freeHandLine');
    this.geomItem.setGeometry(this.line);
    this.geomItem.setMaterial(material);

    if (color) {
      material.getParameter('Color').setValue(color);
    }

    if (thickness) {
      this.line.lineThickness = thickness;
      // this.line.addVertexAttribute('lineThickness', Float32, 0.0);
    }

    if (parentItem && xfo) {
      this.setParentAndXfo(parentItem, xfo);
    }
  }

  /**
   * The update method.
   * @param {any} updateData - The updateData param.
   */
  update(updateData) {
    // console.log("update:", this.used)

    this.used++;

    let realloc = false;
    if (this.used >= this.line.getNumSegments()) {
      this.vertexCount = this.vertexCount + 100;
      this.line.setNumVertices(this.vertexCount);
      this.line.setNumSegments(this.vertexCount - 1);
      realloc = true;
    }

    this.line.vertices.setValue(this.used, updateData.point);
    // this.line.getVertexAttributes().lineThickness.setValue(this.used, updateData.lineThickness);
    this.line.setSegment(this.used - 1, this.used - 1, this.used);

    if (realloc) {
      this.line.geomDataTopologyChanged.emit({
        indicesChanged: true,
      });
    } else {
      this.line.geomDataChanged.emit({
        indicesChanged: true,
      });
    }
    this.emit('updated', updateData);
  }

  /**
   * The toJSON method.
   * @param {any} appData - The appData param.
   * @return {any} The return value.
   */
  toJSON(context) {
    const j = super.toJSON(context);
    j.lineThickness = this.line.lineThickness;
    j.color = this.geomItem.getMaterial().getParameter('Color').getValue();
    return j
  }

  /**
   * The fromJSON method.
   * @param {any} j - The j param.
   * @param {any} appData - The appData param.
   */
  fromJSON(j, context) {
    // Need to set line thickness before the geom is added to the tree.
    if (j.lineThickness) {
      this.line.lineThickness = j.lineThickness;
      // this.line.addVertexAttribute('lineThickness', Float32, 0.0);
    }

    const color = new Color(0.7, 0.2, 0.2);
    if (j.color) {
      color.fromJSON(j.color);
    }
    this.geomItem.getMaterial().getParameter('Color').setValue(color);

    super.fromJSON(j, context);
  }
}
UndoRedoManager.registerChange(
  'CreateFreehandLineChange',
  CreateFreehandLineChange
);

/**
 * Class representing a create freehand line tool.
 * @extends CreateLineTool
 */
class CreateFreehandLineTool extends CreateLineTool {
  /**
   * Create a create freehand line tool.
   * @param {any} appData - The appData value.
   */
  constructor(appData) {
    super(appData);

    this.mp = this.addParameter(
      new BooleanParameter('Modulate Thickness By Stroke Speed', false)
    );
  }

  /**
   * The createStart method.
   * @param {any} xfo - The xfo param.
   * @param {any} parentItem - The parentItem param.
   */
  createStart(xfo, parentItem) {
    const color = this.cp.getValue();
    const lineThickness = this.tp.getValue();
    this.change = new CreateFreehandLineChange(
      parentItem,
      xfo,
      color,
      lineThickness
    );
    this.appData.undoRedoManager.addChange(this.change);

    this.xfo = xfo;
    this.invxfo = xfo.inverse();
    this.stage = 1;
    this.prevP = xfo.tr;
    this.length = 0;
  }

  /**
   * The createMove method.
   * @param {any} pt - The pt param.
   */
  createMove(pt) {
    const p = this.invxfo.transformVec3(pt);
    const delta = p.subtract(this.prevP).length();
    if (delta > 0.001) {
      this.change.update({
        point: p,
      });
    }

    this.length += delta;
    this.prevP = p;
  }

  /**
   * The createRelease method.
   * @param {any} pt - The pt param.
   */
  createRelease(pt) {
    if (this.length == 0) {
      this.appData.undoRedoManager.undo(false);
    }
    this.stage = 0;
    this.emit('actionFinished');
  }
}

/**
 * Class representing a create sphere change.
 * @extends CreateGeomChange
 */
class CreateSphereChange extends CreateGeomChange {
  /**
   * Create a create sphere change.
   * @param {any} parentItem - The parentItem value.
   * @param {any} xfo - The xfo value.
   */
  constructor(parentItem, xfo) {
    super('Create Sphere', parentItem);

    this.sphere = new Sphere(0, 64, 32);
    const material = new Material('Sphere', 'SimpleSurfaceShader');
    this.geomItem = new GeomItem('Sphere');
    this.geomItem.setGeometry(this.sphere);
    this.geomItem.setMaterial(material);

    if (parentItem && xfo) {
      this.setParentAndXfo(parentItem, xfo);
    }
  }

  /**
   * The update method.
   * @param {any} updateData - The updateData param.
   */
  update(updateData) {
    this.sphere.radius = updateData.radius;
    this.emit('updated', updateData);
  }

  /**
   * The toJSON method.
   * @return {any} The return value.
   */
  toJSON() {
    const j = super.toJSON();
    j.radius = this.geomItem.getGeometry().radius;
    return j
  }

  /**
   * The changeFromJSON method.
   * @param {any} j - The j param.
   */
  changeFromJSON(j) {
    if (j.radius) this.geomItem.getGeometry().radius = j.radius;
  }
}
UndoRedoManager.registerChange('CreateSphereChange', CreateSphereChange);

/**
 * Class representing a create sphere tool.
 * @extends CreateGeomTool
 */
class CreateSphereTool extends CreateGeomTool {
  /**
   * Create a create sphere tool.
   * @param {any} appData - The appData value.
   */
  constructor(appData) {
    super(appData);
  }

  /**
   * The createStart method.
   * @param {any} xfo - The xfo param.
   * @param {any} parentItem - The parentItem param.
   */
  createStart(xfo, parentItem) {
    this.change = new CreateSphereChange(parentItem, xfo);
    this.appData.undoRedoManager.addChange(this.change);

    this.xfo = xfo;
    this.stage = 1;
    this.radius = 0.0;
  }

  /**
   * The createMove method.
   * @param {any} pt - The pt param.
   */
  createMove(pt) {
    this.radius = pt.distanceTo(this.xfo.tr);
    this.change.update({ radius: this.radius });
  }

  /**
   * The createRelease method.
   * @param {any} pt - The pt param.
   */
  createRelease(pt) {
    if (this.radius == 0) {
      this.appData.undoRedoManager.undo(false);
    }
    this.stage = 0;
    this.emit('actionFinished');
  }
}

/**
 * Class representing a create cuboid change.
 * @extends CreateGeomChange
 */
class CreateCuboidChange extends CreateGeomChange {
  /**
   * Create a create cuboid change.
   * @param {any} parentItem - The parentItem value.
   * @param {any} xfo - The xfo value.
   */
  constructor(parentItem, xfo) {
    super('Create Cuboid');

    this.cuboid = new Cuboid(0, 0, 0, true);
    const material = new Material('Cuboid', 'SimpleSurfaceShader');
    this.geomItem = new GeomItem('Cuboid');
    this.geomItem.setGeometry(this.cuboid);
    this.geomItem.setMaterial(material);

    if (parentItem && xfo) {
      this.setParentAndXfo(parentItem, xfo);
    }
  }

  /**
   * The update method.
   * @param {any} updateData - The updateData param.
   */
  update(updateData) {
    if (updateData.baseSize) {
      this.cuboid.setBaseSize(updateData.baseSize[0], updateData.baseSize[1]);
    }
    if (updateData.tr) {
      const xfo = this.geomItem.getParameter('LocalXfo').getValue();
      xfo.tr.fromJSON(updateData.tr);
      this.geomItem.getParameter('LocalXfo').setValue(xfo);
    }
    if (updateData.height) {
      this.cuboid.z = updateData.height;
    }
    this.emit('updated', updateData);
  }
}
UndoRedoManager.registerChange('CreateCuboidChange', CreateCuboidChange);

/**
 * Class representing a create cuboid tool.
 * @extends CreateGeomTool
 */
class CreateCuboidTool extends CreateGeomTool {
  /**
   * Create a create cuboid tool.
   * @param {any} appData - The appData value.
   */
  constructor(appData) {
    super(appData);
  }

  /**
   * The createStart method.
   * @param {any} xfo - The xfo param.
   * @param {any} parentItem - The parentItem param.
   */
  createStart(xfo, parentItem) {
    this.change = new CreateCuboidChange(parentItem, xfo);
    this.appData.undoRedoManager.addChange(this.change);

    this.xfo = xfo;
    this.invxfo = xfo.inverse();
    this.stage = 1;
    this._height = 0.0;
  }

  /**
   * The createMove method.
   * @param {any} pt - The pt param.
   */
  createMove(pt) {
    if (this.stage == 1) {
      const delta = this.invxfo.transformVec3(pt);

      // const delta = pt.subtract(this.xfo.tr)
      this.change.update({
        baseSize: [Math.abs(delta.x), Math.abs(delta.y)],
        tr: this.xfo.tr.add(delta.scale(0.5)),
      });
    } else {
      const vec = this.invxfo.transformVec3(pt);
      this.change.update({ height: vec.y });
    }
  }

  /**
   * The createRelease method.
   * @param {any} pt - The pt param.
   * @param {any} viewport - The viewport param.
   */
  createRelease(pt, viewport) {
    if (this.stage == 1) {
      this.stage = 2;
      this.pt1 = pt;

      const quat = new Quat();
      quat.setFromAxisAndAngle(new Vec3$1(1, 0, 0), Math.PI * 0.5);
      this.constructionPlane.ori = this.constructionPlane.ori.multiply(quat);
      this.constructionPlane.tr = pt;
      this.invxfo = this.constructionPlane.inverse();
    } else if (this.stage == 2) {
      this.stage = 0;
      this.emit('actionFinished');
    }
  }
}

/**
 * Class representing a scene widget tool.
 * @extends BaseTool
 */
class HandleTool extends BaseTool {
  /**
   * Create a scene widget tool
   * @param {any} appData - The appData value.
   */
  constructor(appData) {
    super(appData);

    this.activeHandle = undefined;
    this.capturedItems = [];
    this.mouseOverItems = [];
  }

  /**
   * The activateTool method.
   */
  activateTool() {
    super.activateTool();
    console.log('activateTool.HandleTool');

    // this.appData.renderer.getDiv().style.cursor = 'crosshair'

    const addIconToController = (controller) => {
      // The tool might already be deactivated.
      if (!this.__activated) return
      const geon = new Sphere(0.02 * 0.75);
      const mat = new Material('Cross', 'FlatSurfaceShader');
      mat.getParameter('BaseColor').setValue(new Color('#03E3AC'));
      mat.visibleInGeomDataBuffer = false;
      const geomItem = new GeomItem('HandleToolTip', geon, mat);
      controller.getTipItem().removeAllChildren();
      controller.getTipItem().addChild(geomItem, false);
    };
    const addIconToControllers = (xrvp) => {
      for (const controller of xrvp.getControllers()) {
        addIconToController(controller);
      }
      this.addIconToControllerId = xrvp.on(
        'controllerAdded',
        addIconToController
      );
    };

    this.appData.renderer.getXRViewport().then((xrvp) => {
      addIconToControllers(xrvp);
    });
  }

  /**
   * The deactivateTool method.
   */
  deactivateTool() {
    super.deactivateTool();

    this.appData.renderer.getXRViewport().then((xrvp) => {
      // for(let controller of xrvp.getControllers()) {
      //   controller.getTipItem().removeAllChildren();
      // }
      xrvp.removeListenerById('controllerAdded', this.addIconToControllerId);
    });
  }

  // ///////////////////////////////////
  // Mouse events

  /**
   * The onMouseDown method.
   * @param {any} event - The event param.
   * @return {any} The return value.
   */
  onMouseDown(event) {
    //
    if (!this.activeHandle) {
      // event.viewport.renderGeomDataFbo();
      const intersectionData = event.viewport.getGeomDataAtPos(event.mousePos);
      if (intersectionData == undefined) return
      if (intersectionData.geomItem.getOwner() instanceof Handle) {
        this.activeHandle = intersectionData.geomItem.getOwner();
        this.activeHandle.handleMouseDown(
          Object.assign(event, { intersectionData })
        );
        return true
      }
    }
  }

  /**
   * The onMouseMove method.
   * @param {any} event - The event param.
   * @return {any} The return value.
   */
  onMouseMove(event) {
    if (this.activeHandle) {
      this.activeHandle.handleMouseMove(event);
      return true
    } else {
      // If the buttons are pressed, we know we are not searching
      // for a handle to drag. (Probably anothet tool in the stack is doing something)
      if (event.button == 0 && event.buttons == 1) return false

      const intersectionData = event.viewport.getGeomDataAtPos(event.mousePos);
      if (
        intersectionData != undefined &&
        intersectionData.geomItem.getOwner() instanceof Handle
      ) {
        const handle = intersectionData.geomItem.getOwner();
        if (this.__highlightedHandle) this.__highlightedHandle.unhighlight();

        this.__highlightedHandle = handle;
        this.__highlightedHandle.highlight();
        return true
      } else if (this.__highlightedHandle) {
        this.__highlightedHandle.unhighlight();
        this.__highlightedHandle = undefined;
      }
    }
  }

  /**
   * The onMouseUp method.
   * @param {any} event - The event param.
   * @return {any} The return value.
   */
  onMouseUp(event) {
    if (this.activeHandle) {
      this.activeHandle.handleMouseUp(event);
      this.activeHandle = undefined;
      return true
    }
  }

  /**
   * The onWheel method.
   * @param {any} event - The event param.
   */
  onWheel(event) {
    if (this.activeHandle) {
      this.activeHandle.onWheel(event);
    }
  }

  // ///////////////////////////////////
  // Touch events

  /**
   * The onTouchStart method.
   * @param {any} event - The event param.
   */
  onTouchStart(event) {}

  /**
   * The onTouchMove method.
   * @param {any} event - The event param.
   */
  onTouchMove(event) {}

  /**
   * The onTouchEnd method.
   * @param {any} event - The event param.
   */
  onTouchEnd(event) {}

  /**
   * The onTouchCancel method.
   * @param {any} event - The event param.
   */
  onTouchCancel(event) {}

  // ///////////////////////////////////
  // VRController events

  /**
   * The __prepareVREvent method.
   * @param {any} event - The event that occurs.
   * @private
   */
  __prepareVREvent(event) {
    const id = event.controller.getId();
    event.setCapture = (item) => {
      this.capturedItems[id] = item;
    };
    event.getCapture = () => {
      return this.capturedItems[id]
    };
    event.releaseCapture = () => {
      this.capturedItems[id] = null;
    };
  }

  /**
   * The onVRControllerButtonDown method.
   * @param {any} event - The event param.
   * @return {any} The return value.
   */
  onVRControllerButtonDown(event) {
    const id = event.controller.getId();
    if (this.capturedItems[id]) {
      this.__prepareVREvent(event);
      this.capturedItems[id].onMouseDown(event);
    } else {
      const intersectionData = event.controller.getGeomItemAtTip();
      if (intersectionData != undefined) {
        event.intersectionData = intersectionData;
        event.geomItem = intersectionData.geomItem;
        this.__prepareVREvent(event);
        intersectionData.geomItem.onMouseDown(event);
      }
    }
  }

  /**
   * The onVRPoseChanged method.
   * @param {any} event - The event param.
   * @return {any} The return value.
   */
  onVRPoseChanged(event) {
    for (const controller of event.controllers) {
      const id = controller.getId();
      if (this.capturedItems[id]) {
        this.capturedItems[id].onMouseMove(event);
      } else {
        const intersectionData = controller.getGeomItemAtTip();
        if (intersectionData != undefined) {
          event.intersectionData = intersectionData;
          event.geomItem = intersectionData.geomItem;
          if (intersectionData.geomItem != this.mouseOverItems[id]) {
            if (this.mouseOverItems[id])
              this.mouseOverItems[id].onMouseLeave(event);
            this.mouseOverItems[id] = intersectionData.geomItem;
            this.mouseOverItems[id].onMouseEnter(event);
          }
          intersectionData.geomItem.onMouseMove(event);
        } else if (this.mouseOverItems[id]) {
          this.mouseOverItems[id].onMouseLeave(event);
          this.mouseOverItems[id] = null;
        }
      }
    }
  }

  /**
   * The onVRControllerButtonUp method.
   * @param {any} event - The event param.
   * @return {any} The return value.
   */
  onVRControllerButtonUp(event) {
    this.__prepareVREvent(event);
    const id = event.controller.getId();
    if (this.capturedItems[id]) {
      this.capturedItems[id].onMouseUp(event);
    } else {
      const controller = event.controller;
      const intersectionData = controller.getGeomItemAtTip();
      if (intersectionData != undefined) {
        event.intersectionData = intersectionData;
        event.geomItem = intersectionData.geomItem;
        intersectionData.geomItem.onMouseUp(event);
      }
    }
  }
}

/** Class representing a slider scene widget.
 * @extends BaseLinearMovementHandle
 */
class SliderHandle extends BaseLinearMovementHandle {
  /**
   * Create a slider scene widget.
   * @param {any} name - The name value.
   * @param {any} length - The length value.
   * @param {any} radius - The radius value.
   * @param {any} color - The color value.
   */
  constructor(name, length = 0.5, radius = 0.02, color = new Color('#F9CE03')) {
    super(name);

    this.lengthParam = this.addParameter(new NumberParameter('Length', length));
    this.handleRadiusParam = this.addParameter(
      new NumberParameter('Handle Radius', radius)
    );
    this.barRadiusParam = this.addParameter(
      new NumberParameter('Bar Radius', radius * 0.25)
    );
    this.colorParam = this.addParameter(new ColorParameter('Color', color));
    this.hilghlightColorParam = this.addParameter(
      new ColorParameter('Highlight Color', new Color(1, 1, 1))
    );

    this.handleMat = new Material('handle', 'FlatSurfaceShader');
    this.handleMat
      .getParameter('BaseColor')
      .setValue(this.colorParam.getValue());
    // const baseBarMat = new Material('baseBar', 'FlatSurfaceShader');
    // baseBarMat.replaceParameter(this.colorParam);
    const topBarMat = new Material('topBar', 'FlatSurfaceShader');
    topBarMat.getParameter('BaseColor').setValue(new Color(0.5, 0.5, 0.5));

    const barGeom = new Cylinder(radius * 0.25, 1, 64, 2, true, true);
    const handleGeom = new Sphere(radius, 64);

    this.handle = new GeomItem('handle', handleGeom, this.handleMat);
    this.baseBar = new GeomItem('baseBar', barGeom, this.handleMat);
    this.topBar = new GeomItem('topBar', barGeom, topBarMat);
    this.handleXfo = new Xfo();
    this.baseBarXfo = new Xfo();
    this.topBarXfo = new Xfo();

    this.barRadiusParam.on('valueChanged', () => {
      barGeom.getParameter('radius').setValue(this.barRadiusParam.getValue());
    });
    this.handleRadiusParam.on('valueChanged', () => {
      handleGeom
        .getParameter('radius')
        .setValue(this.handleRadiusParam.getValue());
    });
    this.lengthParam.on('valueChanged', () => {
      this.__updateSlider(this.value);
    });
    this.colorParam.on('valueChanged', () => {
      this.handleMat
        .getParameter('BaseColor')
        .setValue(this.colorParam.getValue());
    });

    this.addChild(this.handle);
    this.addChild(this.baseBar);
    this.addChild(this.topBar);

    this.__updateSlider(0);
  }

  /**
   * The highlight method.
   */
  highlight() {
    this.handleMat
      .getParameter('BaseColor')
      .setValue(this.hilghlightColorParam.getValue());
  }

  /**
   * The unhighlight method.
   */
  unhighlight() {
    this.handleMat
      .getParameter('BaseColor')
      .setValue(this.colorParam.getValue());
  }

  /**
   * The setTargetParam method.
   * @param {any} param - The param param.
   */
  setTargetParam(param) {
    this.param = param;
    const __updateSlider = () => {
      this.__updateSlider(param.getValue());
    };
    __updateSlider();
    param.on('valueChanged', __updateSlider);
  }

  // eslint-disable-next-line require-jsdoc
  __updateSlider(value) {
    this.value = value;
    const range =
      this.param && this.param.getRange() ? this.param.getRange() : [0, 1];
    const v = MathFunctions.remap(value, range[0], range[1], 0, 1);
    const length = this.lengthParam.getValue();
    this.baseBarXfo.sc.z = v * length;
    this.handleXfo.tr.z = v * length;
    this.topBarXfo.tr.z = v * length;
    this.topBarXfo.sc.z = (1 - v) * length;
    this.handle.getParameter('LocalXfo').setValue(this.handleXfo);
    this.baseBar.getParameter('LocalXfo').setValue(this.baseBarXfo);
    this.topBar.getParameter('LocalXfo').setValue(this.topBarXfo);
  }

  // ///////////////////////////////////
  // Interaction events

  /**
   * The onDragStart method.
   * @param {any} event - The event param.
   */
  onDragStart(event) {
    // Hilight the material.
    this.handleXfo.sc.x = this.handleXfo.sc.y = this.handleXfo.sc.z = 1.2;
    this.handle.getParameter('LocalXfo').setValue(this.handleXfo);
    if (!this.param) {
      return
    }
    if (event.undoRedoManager) {
      this.change = new ParameterValueChange$1(this.param);
      event.undoRedoManager.addChange(this.change);
    }
  }

  /**
   * The onDrag method.
   * @param {any} event - The event param.
   */
  onDrag(event) {
    const length = this.lengthParam.getValue();
    const range =
      this.param && this.param.getRange() ? this.param.getRange() : [0, 1];
    const value = Math.clamp(
      MathFunctions.remap(event.value, 0, length, range[0], range[1]),
      range[0],
      range[1]
    );
    if (!this.param) {
      this.__updateSlider(value);
      this.value = value;
      return
    }
    if (this.change) {
      this.change.update({
        value,
      });
    } else {
      this.param.setValue(value);
    }
  }

  /**
   * The onDragEnd method.
   * @param {any} event - The event param.
   */
  onDragEnd(event) {
    this.change = null;
    // unhilight the material.
    this.handleXfo.sc.x = this.handleXfo.sc.y = this.handleXfo.sc.z = 1.0;
    this.handle.getParameter('LocalXfo').setValue(this.handleXfo);
  }

  /**
   * The toJSON method.
   * @param {any} context - The context param.
   * @param {any} flags - The flags param.
   * @return {any} The return value.
   */
  toJSON(context, flags = 0) {
    const json = super.toJSON(context, flags | SAVE_FLAG_SKIP_CHILDREN);
    if (this.param) json.targetParam = this.param.getPath();
    return json
  }

  /**
   * The fromJSON method.
   * @param {any} json - The json param.
   * @param {any} context - The context param.
   * @param {any} flags - The flags param.
   */
  fromJSON(json, context, flags) {
    super.fromJSON(json, context, flags);

    if (json.targetParam) {
      context.resolvePath(json.targetParam).then((param) => {
        this.setTargetParam(param);
      });
    }
  }
}

sgFactory.registerClass('SliderHandle', SliderHandle);

/** Class representing a slider scene widget.
 * @extends BaseAxialRotationHandle
 */
class ArcSlider extends BaseAxialRotationHandle {
  /**
   * Create a slider scene widget.
   * @param {any} name - The name value.
   * @param {any} length - The length value.
   * @param {any} radius - The radius value.
   * @param {any} color - The color value.
   */
  constructor(
    name,
    arcRadius = 1,
    arcAngle = 1,
    handleRadius = 0.02,
    color = new Color(1, 1, 0)
  ) {
    super(name);
    this.arcRadiusParam = this.addParameter(
      new NumberParameter('Arc Radius', arcRadius)
    );
    this.arcAngleParam = this.addParameter(
      new NumberParameter('Arc Angle', arcAngle)
    );
    this.handleRadiusParam = this.addParameter(
      new NumberParameter('Handle Radius', handleRadius)
    );
    // this.barRadiusParam = this.addParameter(
    //   new NumberParameter('Bar Radius', radius * 0.25)
    // );
    this.colorParam = this.addParameter(new ColorParameter('Color', color));
    this.hilghlightColorParam = this.addParameter(
      new ColorParameter('Highlight Color', new Color(1, 1, 1))
    );

    this.handleMat = new Material('handleMat', 'HandleShader');
    const arcGeom = new Circle(arcRadius, arcAngle, 64);
    const handleGeom = new Sphere(handleRadius, 64);

    this.handle = new GeomItem('handle', handleGeom, this.handleMat);
    this.arc = new GeomItem('arc', arcGeom, this.handleMat);
    this.handleXfo = new Xfo();
    this.handleGeomOffsetXfo = new Xfo();
    this.handleGeomOffsetXfo.tr.x = arcRadius;
    this.handle.getParameter('GeomOffsetXfo').setValue(this.handleGeomOffsetXfo);

    // this.barRadiusParam.on('valueChanged', () => {
    //   arcGeom.getParameter('radius').setValue(this.barRadiusParam.getValue());
    // });

    this.range = [0, arcAngle];
    this.arcAngleParam.on('valueChanged', () => {
      const arcAngle = this.arcAngleParam.getValue();
      arcGeom.getParameter('Angle').setValue(arcAngle);
      this.range = [0, arcAngle];
    });
    this.arcRadiusParam.on('valueChanged', () => {
      const arcRadius = this.arcRadiusParam.getValue();
      arcGeom.getParameter('Radius').setValue(arcRadius);
      this.handleGeomOffsetXfo.tr.x = arcRadius;
      this.handle
        .getParameter('GeomOffsetXfo')
        .setValue(this.handleGeomOffsetXfo);
    });
    this.handleRadiusParam.on('valueChanged', () => {
      handleGeom
        .getParameter('radius')
        .setValue(this.handleRadiusParam.getValue());
    });
    this.colorParam.on('valueChanged', () => {
      this.handleMat
        .getParameter('BaseColor')
        .setValue(this.colorParam.getValue());
    });

    this.addChild(this.handle);
    this.addChild(this.arc);

    // this.__updateSlider(0);
    this.setTargetParam(this.handle.getParameter('GlobalXfo'), false);
  }

  // ///////////////////////////////////
  // Mouse events

  /**
   * The onMouseEnter method.
   * @param {any} event - The event param.
   * @return {any} The return value.
   */
  onMouseEnter(event) {
    if (
      event.intersectionData &&
      event.intersectionData.geomItem == this.handle
    )
      this.highlight();
  }

  /**
   * The onMouseLeave method.
   * @param {any} event - The event param.
   * @return {any} The return value.
   */
  onMouseLeave(event) {
    this.unhighlight();
  }

  /**
   * The onMouseDown method.
   * @param {any} event - The event param.
   * @return {any} The return value.
   */
  onMouseDown(event) {
    // We do not want to handle events
    // that have propagated from children of
    // the slider.
    if (
      event.intersectionData &&
      event.intersectionData.geomItem == this.handle
    )
      super.onMouseDown(event);
  }

  /**
   * The highlight method.
   */
  highlight() {
    this.handleMat
      .getParameter('BaseColor')
      .setValue(this.hilghlightColorParam.getValue());
  }

  /**
   * The unhighlight method.
   */
  unhighlight() {
    this.handleMat
      .getParameter('BaseColor')
      .setValue(this.colorParam.getValue());
  }

  // /**
  //  * The setTargetParam method.
  //  * @param {any} param - The param param.
  //  */
  // setTargetParam(param) {
  //   this.param = param;
  //   const __updateSlider = () => {
  //     this.__updateSlider(param.getValue());
  //   };
  //   __updateSlider();
  //   param.on('valueChanged', __updateSlider);
  // }

  // eslint-disable-next-line require-jsdoc
  // __updateSlider(value) {
  //   this.value = value
  //   const range =
  //     this.param && this.param.getRange() ? this.param.getRange() : [0, 1];
  //   const v = Math.remap(value, range[0], range[1], 0, 1);
  //   const length = this.arcAngleParam.getValue();
  //   this.handleXfo.ori.setFromAxisAndAngle(this.axis, ) = v * length;
  //   this.handle.getParameter('LocalXfo').setValue(this.handleXfo;
  // }

  // ///////////////////////////////////
  // Interaction events

  /**
   * The getBaseXfo method.
   */
  getBaseXfo() {
    return this.handle.getParameter('GlobalXfo').getValue()
  }

  /**
   * The onDragStart method.
   * @param {any} event - The event param.
   */
  onDragStart(event) {
    this.baseXfo = this.getParameter('GlobalXfo').getValue().clone();
    this.baseXfo.sc.set(1, 1, 1);
    this.deltaXfo = new Xfo();
    // this.offsetXfo = this.baseXfo.inverse().multiply(this.param.getValue());

    this.vec0 = this.getParameter('GlobalXfo').getValue().ori.getXaxis();
    // this.grabCircleRadius = this.arcRadiusParam.getValue();
    this.vec0.normalizeInPlace();

    if (event.undoRedoManager) {
      this.change = new ParameterValueChange$1(this.param);
      event.undoRedoManager.addChange(this.change);
    }

    // Hilight the material.
    this.handleGeomOffsetXfo.sc.x = this.handleGeomOffsetXfo.sc.y = this.handleGeomOffsetXfo.sc.z = 1.2;
    this.handle.getParameter('GeomOffsetXfo').setValue(this.handleGeomOffsetXfo);

    this.emit('dragStart');
  }

  /**
   * The onDrag method.
   * @param {any} event - The event param.
   */
  onDrag(event) {
    const vec1 = event.holdPos.subtract(this.baseXfo.tr);
    vec1.normalizeInPlace();

    let angle = this.vec0.angleTo(vec1);
    if (this.vec0.cross(vec1).dot(this.baseXfo.ori.getZaxis()) < 0)
      angle = -angle;

    if (this.range) {
      angle = Math.clamp(angle, this.range[0], this.range[1]);
    }

    if (event.shiftKey) {
      // modulat the angle to X degree increments.
      const increment = Math.degToRad(22.5);
      angle = Math.floor(angle / increment) * increment;
    }

    this.deltaXfo.ori.setFromAxisAndAngle(new Vec3(0, 0, 1), angle);

    const newXfo = this.baseXfo.multiply(this.deltaXfo);
    const value = newXfo; //.multiply(this.offsetXfo);

    if (this.change) {
      this.change.update({
        value,
      });
    } else {
      const param = this.param ? this.param : this.getParameter('GlobalXfo');
      param.setValue(value);
    }
  }

  /**
   * The onDragEnd method.
   * @param {any} event - The event param.
   */
  onDragEnd(event) {
    this.change = null;
    this.handleGeomOffsetXfo.sc.x = this.handleGeomOffsetXfo.sc.y = this.handleGeomOffsetXfo.sc.z = 1.0;
    this.handle.getParameter('GeomOffsetXfo').setValue(this.handleGeomOffsetXfo);

    this.emit('dragEnd');
  }

  /**
   * The toJSON method.
   * @param {any} context - The context param.
   * @param {any} flags - The flags param.
   * @return {any} The return value.
   */
  toJSON(context, flags = 0) {
    const json = super.toJSON(context, flags | SAVE_FLAG_SKIP_CHILDREN);
    if (this.param) json.targetParam = this.param.getPath();
    return json
  }

  /**
   * The fromJSON method.
   * @param {any} json - The json param.
   * @param {any} context - The context param.
   * @param {any} flags - The flags param.
   */
  fromJSON(json, context, flags) {
    super.fromJSON(json, context, flags);

    if (json.targetParam) {
      context.resolvePath(json.targetParam).then((param) => {
        this.setTargetParam(param);
      });
    }
  }
}

sgFactory.registerClass('ArcSlider', ArcSlider);

/** Class representing a planar movement scene widget.
 * @extends Handle
 */
class ScreenSpaceMovementHandle extends Handle {
  /**
   * Create a planar movement scene widget.
   */
  constructor(name) {
    super(name);
  }

  /**
   * The setTargetParam method.
   * @param {any} param - The param param.
   * @param {boolean} track - The track param.
   */
  setTargetParam(param, track = true) {
    this.param = param;
    if (track) {
      const __updateGizmo = () => {
        this.getParameter('GlobalXfo').setValue(param.getValue());
      };
      __updateGizmo();
      param.on('valueChanged', __updateGizmo);
    }
  }

  /**
   * The getTargetParam method.
   */
  getTargetParam() {
    return this.param ? this.param : this.getParameter('GlobalXfo')
  }

  // ///////////////////////////////////
  // Mouse events

  /**
   * The handleMouseDown method.
   * @param {any} event - The event param.
   * @return {any} The return value.
   */
  handleMouseDown(event) {
    this.gizmoRay = new Ray();
    // this.gizmoRay.dir = event.viewport.getCamera().getParameter('GlobalXfo').getValue().ori.getZaxis().negate()
    this.gizmoRay.dir = event.mouseRay.dir.negate();
    const param = this.getTargetParam();
    const baseXfo = param.getValue();
    this.gizmoRay.pos = baseXfo.tr;
    const dist = event.mouseRay.intersectRayPlane(this.gizmoRay);
    event.grabPos = event.mouseRay.pointAtDist(dist);
    this.onDragStart(event);
    return true
  }

  /**
   * The handleMouseMove method.
   * @param {any} event - The event param.
   */
  handleMouseMove(event) {
    const dist = event.mouseRay.intersectRayPlane(this.gizmoRay);
    event.holdPos = event.mouseRay.pointAtDist(dist);
    this.onDrag(event);
    return true
  }

  /**
   * The handleMouseUp method.
   * @param {any} event - The event param.
   * @return {any} The return value.
   */
  handleMouseUp(event) {
    const dist = event.mouseRay.intersectRayPlane(this.gizmoRay);
    event.releasePos = event.mouseRay.pointAtDist(dist);
    this.onDragEnd(event);
    return true
  }

  // ///////////////////////////////////
  // Interaction events

  /**
   * The onDragStart method.
   * @param {any} event - The event param.
   */
  onDragStart(event) {
    this.grabPos = event.grabPos;
    const param = this.getTargetParam();
    this.baseXfo = param.getValue();
    if (event.undoRedoManager) {
      this.change = new ParameterValueChange$1(param);
      event.undoRedoManager.addChange(this.change);
    }
  }

  /**
   * The onDrag method.
   * @param {any} event - The event param.
   */
  onDrag(event) {
    const dragVec = event.holdPos.subtract(this.grabPos);

    const newXfo = this.baseXfo.clone();
    newXfo.tr.addInPlace(dragVec);

    if (this.change) {
      this.change.update({
        value: newXfo,
      });
    } else {
      const param = this.getTargetParam();
      param.setValue(newXfo);
    }
  }

  /**
   * The onDragEnd method.
   * @param {any} event - The event param.
   */
  onDragEnd(event) {
    this.change = null;
  }
}

export { ArcSlider, AxialRotationHandle, Change, CreateCircleTool, CreateCuboidTool, CreateFreehandLineTool, CreateLineTool, CreateRectTool, CreateSphereTool, HandleTool, LinearMovementHandle, OpenVRUITool, ParameterValueChange$1 as ParameterValueChange, PlanarMovementHandle, ScreenSpaceMovementHandle, SelectionManager, SelectionTool, SliderHandle, ToolManager, TreeItemAddChange, TreeItemMoveChange, TreeItemsRemoveChange, UndoRedoManager, VIEW_TOOL_MODELS, VRHoldObjectsTool, VRUITool, ViewTool };
