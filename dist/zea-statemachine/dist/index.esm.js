import { sgFactory, ParameterOwner, BaseItem, Registry, StringParameter, TreeItemParameter, Camera, Vec3Parameter, NumberParameter, MathFunctions } from '@zeainc/zea-engine';

/** Class representing a state in a state machine. A model can only be
 * in one state at a time.
 * @private
 */
class State {
  /**
   * Create a state.
   * @param {string} name - The name of the state.
   */
  constructor(name) {
    this.__name = name ? name : sgFactory.getClassName(this);

    this.__stateEvents = [];
    this.__activationActions = [];
    this.__deactivationActions = [];
  }

  /**
   * Getter for the name of the state.
   * @return {string} - Returns the name.
   */
  getName() {
    return this.__name
  }

  /**
   * Setter for the name of the state.
   * @param {string} name - The name of the state.
   */
  setName(name) {
    this.__name = name;
  }

  /**
   * The setStateMachine method.
   * @param {any} stateMachine - The stateMachine value.
   */
  setStateMachine(stateMachine) {
    this.__stateMachine = stateMachine;
  }

  /**
   * The getStateMachine method.
   * @return {any} - The return value.
   */
  getStateMachine() {
    return this.__stateMachine
  }

  /**
   * Activates the state.
   */
  activate() {
    this.__stateEvents.forEach((stateEvent) => {
      stateEvent.activate();
    });
    this.__activationActions.forEach((action) => {
      action.activate();
    });
  }

  /**
   * Deactivates the state.
   */
  deactivate() {
    this.__stateEvents.forEach((stateEvent) => {
      stateEvent.deactivate();
    });
    // Any activation actions that are still running should be stopped.
    // e.g. SetParameterValue.
    this.__activationActions.forEach((action) => {
      action.deactivate();
    });
    this.__deactivationActions.forEach((action) => {
      action.activate();
    });
  }

  /**
   * Add an event to the state.
   * @param {any} stateEvent - The event to add.
   */
  addStateEvent(stateEvent) {
    stateEvent.setState(this);
    this.__stateEvents.push(stateEvent);
  }

  /**
   * Getter for the state event.
   * @param {number} index - The index value.
   * @return {any} - The return value.
   */
  getStateEvent(index) {
    return this.__stateEvents[index]
  }

  /**
   * The addActivationAction method.
   * @param {any} action - The action value.
   */
  addActivationAction(action) {
    action.setState(this);
    this.__activationActions.push(action);
  }

  /**
   * The getActivationAction method.
   * @param {number} index - The index value.
   * @return {any} - The return value.
   */
  getActivationAction(index) {
    return this.__activationActions[index]
  }

  /**
   * The getActivationAction method.
   * @param {any} action - The action value.
   */
  addDeactivationAction(action) {
    action.setState(this);
    this.__deactivationActions.push(action);
  }

  // ////////////////////////////////////////
  // Persistence

  /**
   * The toJSON method encodes this type as a json object for persistences.
   * @param {object} context - The context value.
   * @param {number} flags - The flags value.
   * @return {object} - Returns the json object.
   */
  toJSON(context, flags) {
    const j = {
      name: this.__name,
      type: sgFactory.getClassName(this),
    };

    const stateEventsJson = [];
    for (const stateEvent of this.__stateEvents) {
      stateEventsJson.push(stateEvent.toJSON(context, flags));
    }
    j.stateEvents = stateEventsJson;

    const activationActionsJson = [];
    for (const stateEvent of this.__activationActions) {
      activationActionsJson.push(stateEvent.toJSON(context, flags));
    }
    j.activationActions = activationActionsJson;

    const deactivationActionsJson = [];
    for (const stateEvent of this.__deactivationActions) {
      deactivationActionsJson.push(stateEvent.toJSON(context, flags));
    }
    j.deactivationActions = deactivationActionsJson;

    return j
  }

  /**
   * The fromJSON method decodes a json object for this type.
   * @param {object} j - The json object this item must decode.
   * @param {object} context - The context value.
   * @param {number} flags - The flags value.
   */
  fromJSON(j, context, flags) {
    this.__name = j.name;

    for (const stateEventJson of j.stateEvents) {
      const stateEvent = sgFactory.constructClass(stateEventJson.type);
      stateEvent.fromJSON(stateEventJson, context);
      this.addStateEvent(stateEvent);
    }
    for (const activationActionJson of j.activationActions) {
      const activationAction = sgFactory.constructClass(activationActionJson.type);
      activationAction.fromJSON(activationActionJson, context);
      this.addActivationAction(activationAction);
    }
    for (const deactivationActionJson of j.deactivationActions) {
      const deactivationAction = sgFactory.constructClass(deactivationActionJson.type);
      deactivationAction.fromJSON(deactivationActionJson, context);
      this.addDeactivationAction(deactivationAction);
    }
  }
}

sgFactory.registerClass('State', State);

/** Class representing a state action.
 * @extends ParameterOwner
 * @private
 */
class StateAction extends ParameterOwner {
  /**
   * Create a state action.
   * @param {string} name - The name of the state action.
   */
  constructor(name) {
    super();
    this.__name = name;
    this.__childActions = [];

    this.__outputs = {};
  }

  /**
   * The addOutput method.
   * @param {any} output - The output value.
   * @return {any} - The return value.
   */
  addOutput(output) {
    this.__outputs[output.getName()] = output;
    return output
  }

  /**
   * The getOutput method.
   * @param {string} name - The name value.
   * @return {any} - The return value.
   */
  getOutput(name) {
    return this.__outputs[name]
  }

  /**
   * The setState method.
   * @param {any} state - The state value.
   */
  setState(state) {
    this.__state = state;
    this.__childActions.forEach((childAction) => {
      childAction.setState(state);
    });
  }

  /**
   * The addChild method.
   * @param {any} childAction - The childAction value.
   */
  addChild(childAction) {
    this.__childActions.push(childAction);
    childAction.setState(this.__state);
  }

  /**
   * The getChild method.
   * @param {annumbery} index - The index value.
   * @return {any} - The return value.
   */
  getChild(index) {
    return this.__childActions[index]
  }

  /**
   * The activate method.
   */
  activate() {
    console.warn('activate must be implmented by each action. this:' + sgFactory.getClassName(this));
  }

  /**
   * The addChild method.
   * @param {any} childAction - The childAction value.
   */
  addChild(childAction) {
    this.__childActions.push(childAction);
    childAction.setState(this.__state);
  }

  /**
   * The deactivate method.
   */
  deactivate() {
    this.__childActions.forEach((action) => {
      action.deactivate();
    });
  }

  /**
   * The __onDone method.
   * @private
   */
  __onDone() {
    this.__childActions.forEach((action) => {
      action.activate();
    });
  }

  // ////////////////////////////////////////
  // Persistence

  /**
   * The toJSON method encodes this type as a json object for persistences.
   * @param {object} context - The context value.
   * @param {number} flags - The flags value.
   * @return {object} - Returns the json object.
   */
  toJSON(context, flags) {
    let j = super.toJSON(context, flags);
    if (!j)
      // If a state action has had no defaults changed, then it may not return json.
      j = {};
    j.type = sgFactory.getClassName(this);

    const childActionsj = [];
    for (const childAction of this.__childActions) {
      childActionsj.push(childAction.toJSON(context, flags));
    }
    j.childActions = childActionsj;

    const outputsj = {};
    for (const key in this.__outputs) {
      outputsj[key] = this.__outputs[key].toJSON(context, flags);
    }
    j.outputs = outputsj;

    return j
  }

  /**
   * The fromJSON method decodes a json object for this type.
   * @param {object} j - The json object this item must decode.
   * @param {object} context - The context value.
   * @param {number} flags - The flags value.
   */
  fromJSON(j, context, flags) {
    super.fromJSON(j, context, flags);

    for (const childActionjson of j.childActions) {
      const childAction = sgFactory.constructClass(childActionjson.type);
      if (childAction) {
        childAction.fromJSON(childActionjson, context);
        this.addChild(childAction);
      } else {
        throw new Error('Invalid type:' + childActionjson.type)
      }
    }

    for (const key in j.outputs) {
      this.__outputs[key].fromJSON(j.outputs[key], context);
      // const outputjson = j.outputs[key];
      // const output = sgFactory.constructClass(outputjson.type);
      // if (output) {
      //     output.fromJSON(outputjson, context);
      //     this.addOutput(key, output);
      // }
      // else {
      //     throw("Invalid type:" + outputjson.type)
      // }
    }
  }

  /**
   * The destroy is called by the system to cause explicit resources cleanup.
   * Users should never need to call this method directly.
   */
  destroy() {
    super.destroy();
    this.__outputs = [];
  }
}

/** Class representing a state event. An event tiggers an action
 * that changes the state of the model.
 * @extends StateAction
 * @private
 */
class StateEvent extends StateAction {
  /**
   * Create a state event.
   * @param {string} name - The name of the event.
   */
  constructor(name) {
    super();
    this.__name = name;
    // this.__childActions = [];
    this.__onEvent = this.__onEvent.bind(this);
  }

  /**
   * The __onEvent method.
   * @private
   */
  __onEvent() {
    this.__childActions.forEach(action => {
      action.activate();
    });
  }

  
  /**
   * The deactivate method.
   */
  deactivate() {
    // When a state is deactivating, all actions should deactivate also.
    this.__childActions.forEach(action => {
      action.deactivate();
    });
  }
}

/** A state machine is a mathematical model that describes the behavior of
 * a system that can be in only one state at a time. For example, a door with
 * two states can be "open" and "closed", but it cannot be both open and closed
 * at the same time.
 * @extends BaseItem
 * @private
 */
class StateMachine extends BaseItem {
  /**
   * Create a state machine.
   * @param {string} name - The name of the state machine.
   */
  constructor(name) {
    super(name);
    this.__states = {};
    this.__currentState;
    this.__initialStateName;

    // Manually invoke the callbacks for cases where the StateMAchine
    // is not being constructed by the Registry.
    // TODO: Maybe in BaseItem.construct we should invoke the callbacks
    // for all classes.
    // if (!Registry.isConstructing()) {
    //   Registry.invokeCallbacks(this)
    // }
  }

  /**
   * The addState method.
   * @param {any} state - The state value.
   */
  addState(state) {
    state.setStateMachine(this);
    this.__states[state.getName()] = state;

    if (Object.keys(this.__states).length == 1 && this.__initialStateName == undefined) {
      this.__initialStateName = state.getName();
    }
  }

  /**
   * The getState method.
   * @param {string} name - The name value.
   * @return {any} - The return value.
   */
  getState(name) {
    return this.__states[name]
  }

  /**
   * The activateState method.
   * @param {string} name - The name value.
   */
  activateState(name) {
    // console.log("StateMachine.activateState:" + name)
    if (!this.__states[name]) throw new Error('Invalid state transtion:' + name)
    if (this.__currentState == this.__states[name]) return
    if (this.__currentState) this.__currentState.deactivate();
    this.__currentState = this.__states[name];
    this.__currentState.activate();

    this.emit('stateChanged', { name });
  }

  /**
   * The getActiveState method.
   * @return {any} - The return value.
   */
  getActiveState() {
    return this.__currentState
  }

  /**
   * Getter for the currently active state's name.
   * @return {any} - The return value.
   */
  getActiveStateName() {
    return Registry.getBlueprintName(this.__currentState)
  }

  /**
   * Getter for the initial state of the state machine.
   * @return {any} - The return value.
   */
  getInitialState() {
    return this.__initialStateName
  }

  /**
   * Setter for the initial state of the state machine.
   * @param {string} name - The name value.
   */
  setInitialState(name) {
    this.__initialStateName = name;
  }

  // ////////////////////////////////////////
  // Persistence

  /**
   * The toJSON method encodes this type as a json object for persistences.
   * @param {object} context - The context value.
   * @param {number} flags - The flags value.
   * @return {object} - Returns the json object.
   */
  toJSON(context, flags) {
    const j = super.toJSON(context, flags);
    j.initialStateName = this.__initialStateName;

    const statesj = {};
    for (const key in this.__states) {
      statesj[key] = this.__states[key].toJSON(context, flags);
    }
    j.states = statesj;
    return j
  }

  /**
   * The fromJSON method decodes a json object for this type.
   * @param {object} j - The json object this item must decode.
   * @param {object} context - The context value.
   * @param {number} flags - The flags value.
   */
  fromJSON(j, context, flags) {
    super.fromJSON(j, context, flags);
    this.__initialStateName = j.initialStateName;

    context.stateMachine = this;

    for (const key in j.states) {
      const statejson = j.states[key];
      const state = Registry.constructClass(statejson.type);
      if (state) {
        state.fromJSON(statejson, context);
        this.addState(state);
      } else {
        throw new Error('Invalid type:' + statejson.type)
      }
    }
    context.addPLCB(() => {
      // Disabling for now.
      // We can have state machines that are not active at all.
      // E.g. in the 850 E-Tec project.
      // this.activateState(this.__initialStateName);
    });
  }
}

Registry.register('StateMachine', StateMachine);

/** A state machine action that switches between states.
 * @extends StateAction
 * @private
 */
class SwitchState extends StateAction {
  /**
   * Create a switch state.
   */
  constructor() {
    super();
    this.__targetStateParam = this.addParameter(new StringParameter('TargetState', ''));
  }

  /**
   * Activate the action.
   */
  activate() {
    this.__state.getStateMachine().activateState(this.__targetStateParam.getValue());
  }
}

sgFactory.registerClass('SwitchState', SwitchState);

/** A state machine action that sets the camera position and target.
 * @extends StateAction
 * @private
 */
class SetCameraPositionAndTarget extends StateAction {
  /**
   * Create a set camera position and target.
   */
  constructor() {
    super();

    this.addParameter(new TreeItemParameter('Camera', (treeItem) => treeItem instanceof Camera));
    this.addParameter(new Vec3Parameter('CameraPos'));
    this.addParameter(new Vec3Parameter('CameraTarget'));
    this.addParameter(new NumberParameter('InterpTime', 1.0));

    // Note: if the update frequency here can be faster than the renderer, it means each
    // rendered frame there is an updated values. This keeps movement smooth.
    // This is very apparent when moving the camera, while changing other values. If the 2 changes
    // are slower than rendering, then we see juddering.
    this.addParameter(new NumberParameter('UpdateFrequency', 100));
  }

  /**
   * Sets the camera's position and target.
   * @param {any} pos - The position of the camera.
   * @param {any} target - The target of the camera.
   */
  setCameraPositionAndTarget(pos, target) {
    this.getParameter('CameraPos').setValue(pos);
    this.getParameter('CameraTarget').setValue(target);
  }

  /**
   * Activates the action.
   */
  activate() {
    const camera = this.getParameter('Camera').getValue();
    if (!camera) {
      console.warn('Camera not assigned to SetCameraPositionAndTarget state action');
      return
    }
    const posEnd = this.getParameter('CameraPos').getValue();
    const targetEnd = this.getParameter('CameraTarget').getValue();
    const interpTime = this.getParameter('InterpTime').getValue();
    if (interpTime > 0.0) {
      const posStart = camera.getParameter('GlobalXfo').getValue().tr;
      const targetStart = camera.getTargetPostion();
      const distStart = posStart.subtract(targetStart).length();

      const updateFrequency = this.getParameter('UpdateFrequency').getValue();

      const distEnd = posEnd.subtract(targetEnd).length();
      let settingCameraDirection = true;
      let smooth_t_prev = 0;
      let step = 0;
      const steps = Math.round(interpTime * updateFrequency);
      let modifyingCameraXfo = false;
      const onCameraChanged = () => {
        if (!modifyingCameraXfo) {
          settingCameraDirection = false;
        }
      };
      camera.on('globalXfoChanged', onCameraChanged);
      const timerCallback = () => {
        if (!settingCameraDirection) {
          return
        }
        step++;
        if (step < steps) {
          const t = step / steps;
          const smooth_t = MathFunctions.smoothStep(0.0, 1.0, t);
          const delta = (smooth_t - smooth_t_prev) / (1.0 - t);
          smooth_t_prev = smooth_t;

          const posNow = camera.getParameter('GlobalXfo').getValue().tr;
          const targetNow = camera.getTargetPostion();
          const distNow = posNow.subtract(targetNow).length();
          let newPos = posNow;
          const newTarget = targetNow.lerp(targetEnd, delta);
          if (settingCameraDirection) {
            newPos = posNow.lerp(posEnd, delta);
          }

          const newVec = newPos.subtract(newTarget);
          const newDist = newVec.length();
          const idealDist = MathFunctions.lerp(distNow, distEnd, delta);
          // console.log("t:" + t + " delta: " + delta + " distNow:" + distNow + " idealDist:" + idealDist);
          newVec.scaleInPlace(idealDist / newVec.length());

          modifyingCameraXfo = true;
          camera.setPositionAndTarget(newTarget.add(newVec), newTarget);
          modifyingCameraXfo = false;

          this.__timeoutId = window.setTimeout(timerCallback, 1000 / updateFrequency);
        } else {
          // camera.setPositionAndTarget(posEnd, targetEnd);
          camera.off('globalXfoChanged', onCameraChanged);
          camera.emit('movementFinished', {});
          this.__timeoutId = undefined;
          this.__onDone();
        }
      };
      timerCallback();
    } else {
      camera.setPositionAndTarget(posEnd, targetEnd);
    }
  }

  /**
   * The deactivate method.
   */
  deactivate() {
    if (this.__timeoutId) {
      clearTimeout(this.__timeoutId);
      this.__timeoutId = undefined;
    }
    super.deactivate();
  }

  /**
   * Cancels the action.
   */
  cancel() {
    if (this.__timeoutId) {
      clearTimeout(this.__timeoutId);
      this.__timeoutId = undefined;
    }
  }
}

sgFactory.registerClass('SetCameraPositionAndTarget', SetCameraPositionAndTarget);

/** A state machine action that sets parameter values.
 * @extends StateAction
 * @private
 */
class SetParameterValue extends StateAction {
  /**
   * Create a set parameter value.
   */
  constructor() {
    super();
    this.__interpTimeParam = this.addParameter(new NumberParameter('InterpTime', 1.0));

    // Note: if the update frequency here can be faster than the renderer, it means each
    // rendered frame there is an updated values. This keeps movement smooth.
    // This is very apparent when moving the camera, while changing other values. If the 2 changes
    // are slower than rendering, then we see juddering.
    this.__updateFrequencyParam = this.addParameter(new NumberParameter('UpdateFrequency', 100));
  }

  /**
   * Sets the Parameter object to be controlled by this StateAction.
   * @param {Paramter} param - The Parameter object.
   * @return {object} - Returns the json object.
   */
  setParam(param) {
    this.__outParam = param;
    if ((param && !this.__valueParam) || param.getDataType() != this.__valueParam.getDataType()) {
      const valueParam = param.clone();
      valueParam.setName('Value');
      valueParam.setValue(param.getValue());
      this.__valueParam = this.addParameter(valueParam);
    }
    return param
  }

  /**
   * Activate the action.
   */
  activate() {
    if (this.__outParam) {
      const interpTime = this.__interpTimeParam.getValue();
      if (interpTime > 0.0) {
        const updateFrequency = this.__updateFrequencyParam.getValue();
        const paramValueStart = this.__outParam.getValue();
        const paramValueEnd = this.__valueParam.getValue();
        let step = 0;
        const steps = Math.round(interpTime / (1.0 / updateFrequency));
        const timerCallback = () => {
          step++;
          if (step < steps) {
            const t = step / steps;
            const smoothT = MathFunctions.smoothStep(0.0, 1.0, t);
            const newVal = MathFunctions.lerp(paramValueStart, paramValueEnd, smoothT);
            // Note: In this case, we want the parameter to emit a notification
            // and cause the update of the scene. But we also don't want the parameter value to then
            // be considered modified so it is saved to the JSON file. I'm not sure how to address this.
            // We need to check what happens if a parameter emits a 'valueChanged' during cleaning. (maybe it gets ignored)
            this.__outParam.setValue(newVal);
            this.__timeoutId = window.setTimeout(timerCallback, 1000 / updateFrequency);
          } else {
            this.__outParam.setValue(this.__valueParam.getValue());
            this.__timeoutId = undefined;
            this.__onDone();
          }
        };
        timerCallback();
      } else {
        this.__outParam.setValue(this.__valueParam.getValue());
        this.__onDone();
      }
    }
  }

  /**
   * The deactivate method.
   */
  deactivate() {
    if (this.__timeoutId) {
      clearTimeout(this.__timeoutId);
      this.__timeoutId = undefined;
    }
    super.deactivate();
  }

  /**
   * The cancel the action.
   */
  cancel() {
    if (this.__timeoutId) {
      clearTimeout(this.__timeoutId);
      this.__timeoutId = undefined;
    }
  }

  // ////////////////////////////////////////
  // Persistence

  /**
   * The toJSON method encodes this type as a json object for persistences.
   * @param {object} context - The context value.
   * @param {number} flags - The flags value.
   * @return {object} - Returns the json object.
   */
  toJSON(context, flags) {
    const j = super.toJSON(context, flags);
    if (this.__valueParam) {
      j.valueParamType = sgFactory.getClassName(this.__valueParam);
    }
    return j
  }

  /**
   * The fromJSON method decodes a json object for this type.
   * @param {object} j - The json object this item must decode.
   * @param {object} context - The context value.
   * @param {number} flags - The flags value.
   */
  fromJSON(j, context, flags) {
    if (j.valueParamType) {
      const param = sgFactory.constructClass(j.valueParamType, 'Value');
      if (param) this.__valueParam = this.addParameter(param);
    }
    super.fromJSON(j, context, flags);
  }
}

sgFactory.registerClass('SetParameterValue', SetParameterValue);

/** Triggers an state machine event to occur when geometry is clicked.
 * @extends StateEvent
 * @private
 */
class GeomClicked extends StateEvent {
  /**
   * Create a geom clicked.
   * @param {string} name - The name value.
   */
  constructor(name) {
    super(name);
    this.__geomParam = this.addParameter(new TreeItemParameter('TreeItem'));
    this.__geomParam.on('valueChanged', () => {
      if (this.__geom && this.__activated) {
        this.__geom.off('mouseDown', this.__geomClicked);
      }
      this.__geom = this.__geomParam.getValue();
      if (this.__geom && this.__activated) {
        this.__geom.on('mouseDown', this.__geomClicked);
      }
    });
    this.__geomClicked = this.__geomClicked.bind(this);
    this.__activated = false;
    this.__geomClickedBindId = -1;
  }

  /**
   * The __geomClicked method.
   * @param {any} event - The event that occurs.
   * @private
   */
  __geomClicked(event) {
    event.stopPropagation();
    this.__onEvent();
  }

  /**
   * The activate method.
   */
  activate() {
    if (this.__geom) {
      this.__geom.on('mouseDown', this.__geomClicked);
    }
    this.__activated = true;
  }

  /**
   * The deactivate method.
   */
  deactivate() {
    if (this.__geom) {
      this.__geom.off('mouseDown', this.__geomClicked);
    }
    this.__activated = false;
    super.deactivate();
  }
}

sgFactory.registerClass('GeomClicked', GeomClicked);

/** Triggers an state machine event to occur when a key is pressed.
 * @extends StateEvent
 * @private
 */
class KeyPressedEvent extends StateEvent {
  /**
   * Create a key pressed event.
   * @param {string} name - The name value.
   */
  constructor(name) {
    super(name);
    this.onKeyPressed = this.onKeyPressed.bind(this);
    this.__keyParam = this.addParameter(new StringParameter('Key', ''));
  }

  /**
   * Causes an event to occur when a key is pressed.
   * @param {any} event - The event that occurs.
   */
  onKeyPressed(event) {
    console.log(event.key);
    if (event.key == this.__keyParam.getValue()) {
      this.__onEvent();
    }
  }

  /**
   * The activate method.
   */
  activate() {
    document.addEventListener('keydown', this.onKeyPressed);
  }

  /**
   * The deactivate method.
   */
  deactivate() {
    document.removeEventListener('keydown', this.onKeyPressed);
  }
}

sgFactory.registerClass('KeyPressedEvent', KeyPressedEvent);

/** Triggers an state machine event to occur after a certain time has passed.
 * @extends StateEvent
 * @private
 */
class TimedWait extends StateEvent {
  /**
   * Create a timed wait.
   * @param {string} name - The name value.
   */
  constructor(name) {
    super(name);
    this.__waitTimeParam = this.addParameter(new NumberParameter('WaitTime', 1));
  }

  /**
   * The activate method.
   */
  activate() {
    const timerCallback = () => {
      delete this.__timeoutId;
      this.__onEvent();
    };
    this.__timeoutId = window.setTimeout(timerCallback, this.__waitTimeParam.getValue() * 1000); // Sample at 50fps.
  }

  /**
   * The deactivate method.
   */
  deactivate() {
    if (this.__timeoutId) {
      window.clearTimeout(this.__timeoutId);
    }
  }
}

sgFactory.registerClass('TimedWait', TimedWait);

export { GeomClicked, KeyPressedEvent, SetCameraPositionAndTarget, SetParameterValue, State, StateAction, StateEvent, StateMachine, SwitchState, TimedWait };
