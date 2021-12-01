const { Vec3 } = window.zeaEngine;
const { StateMachine, State, SetCameraPositionAndTarget, SetParameterValue, GeomClicked, SwitchState } =
  window.zeaStateMachine;

const setupStates = (asset, renderer) => {
  const stateMachine = new StateMachine('States');

  // asset.addChild(stateMachine);

  asset.geomLibrary.once('loaded', () => {
    // const casingGroup = new Group('casingGroup');
    // casingGroup.resolveItems([
    //   [".", "BODY-2"],
    //   [".", "BODY_1_ASSM_ASM", "BODY_1"]
    // ]);
    // asset.addChild(casingGroup);
    {
      const state = new State('Initial');
      const moveCamera = new SetCameraPositionAndTarget();
      moveCamera.setCameraPositionAndTarget(
        new Vec3({ x: 0.51679, y: -0.69076, z: 0.34219 }),
        new Vec3({ x: 0.03094, y: -0.05395, z: 0 })
      );
      moveCamera.getParameter('Camera').setValue(renderer.getViewport().getCamera());
      moveCamera.getParameter('InterpTime').setValue(1.0);

      asset.getChildByName('labels').getParameter('Visible').setValue(false);

      state.addActivationAction(moveCamera);

      const cutAwayGroup = asset.getChildByName('cutAwayGroup');
      if (cutAwayGroup) {
        const setCut = new SetParameterValue();
        // const cutDistParam = cutAwayGroup.getParameter('CutPlaneDist');
        // setCut.setParam(cutDistParam);
        // setCut.getParameter('Value').setValue(-0.17);
        const cutEnabledParam = cutAwayGroup.getParameter('CutAwayEnabled');
        setCut.setParam(cutEnabledParam);
        setCut.getParameter('Value').setValue(false);
        setCut.getParameter('InterpTime').setValue(0);
        state.addActivationAction(setCut);
      }

      {
        const switchToCutAway = new SwitchState();
        switchToCutAway.getParameter('TargetState').setValue('Cutaway');

        const geomClicked = new GeomClicked();
        geomClicked.getParameter('TreeItem').setValue(asset);
        geomClicked.addChild(switchToCutAway);
        state.addStateEvent(geomClicked);
      }

      stateMachine.addState(state);
    }
    {
      const state = new State('Cutaway');
      const moveCamera = new SetCameraPositionAndTarget();
      moveCamera.setCameraPositionAndTarget(
        new Vec3({ x: 0.35949, y: -0.48411, z: 0.23215 }),
        new Vec3({ x: 0.03099, y: -0.05347, z: 0.00083 })
      );
      moveCamera.getParameter('Camera').setValue(renderer.getViewport().getCamera());
      moveCamera.getParameter('InterpTime').setValue(2.0);
      state.addActivationAction(moveCamera);

      const cutAwayGroup = asset.getChildByName('cutAwayGroup');
      if (cutAwayGroup) {
        const setCut = new SetParameterValue();
        // const cutDistParam = cutAwayGroup.getParameter('CutPlaneDist');
        // setCut.setParam(cutDistParam);
        // setCut.getParameter('Value').setValue(0.0);
        // setCut.getParameter('InterpTime').setValue(2.0);

        const cutEnabledParam = cutAwayGroup.getParameter('CutAwayEnabled');
        setCut.setParam(cutEnabledParam);
        setCut.getParameter('Value').setValue(true);
        setCut.getParameter('InterpTime').setValue(0);
        // state.addActivationAction(setCut);
        moveCamera.addChild(setCut);

        const showHandle = new SetParameterValue();
        const slider = asset.getChildByName('GearSlider');
        showHandle.setParam(slider.getParameter('Visible'));
        showHandle.getParameter('Value').setValue(true);
        showHandle.getParameter('InterpTime').setValue(0.0);
        moveCamera.addChild(showHandle);

        // state.addActivationAction(showHandle);
      }

      {
        const switchState = new SwitchState();
        switchState.getParameter('TargetState').setValue('Exploded');

        const geomClicked = new GeomClicked();
        geomClicked.getParameter('TreeItem').setValue(asset);
        geomClicked.addChild(switchState);
        state.addStateEvent(geomClicked);
      }

      {
        const hideHandle = new SetParameterValue();
        const slider = asset.getChildByName('GearSlider');
        hideHandle.setParam(slider.getParameter('Visible'));
        hideHandle.getParameter('Value').setValue(false);
        hideHandle.getParameter('InterpTime').setValue(0.0);
        state.addDeactivationAction(hideHandle);
      }
      {
        const removeCut = new SetParameterValue();
        const cutEnabledParam = cutAwayGroup.getParameter('CutAwayEnabled');
        removeCut.setParam(cutEnabledParam);
        removeCut.getParameter('Value').setValue(false);
        removeCut.getParameter('InterpTime').setValue(0.0);
        state.addDeactivationAction(removeCut);
      }

      stateMachine.addState(state);
    }

    {
      const state = new State('Exploded');

      const cutAwayGroup = asset.getChildByName('cutAwayGroup');
      if (cutAwayGroup) {
        // const cutDistParam = cutAwayGroup.getParameter('CutPlaneDist');
        // const setCut = new SetParameterValue();
        // setCut.setParam(cutDistParam);
        // setCut.getParameter('Value').setValue(-0.17);
        // setCut.getParameter('InterpTime').setValue(2.0);
        // const cutEnabledParam = cutAwayGroup.getParameter('CutAwayEnabled');
        // setCut.setParam(cutEnabledParam);
        // setCut.getParameter('Value').setValue(false);
        // state.addActivationAction(setCut);

        // let setExplode;
        const explodedAmount = asset.getParameter('ExplodeAmount');
        if (explodedAmount) {
          const setExplode = new SetParameterValue();
          setExplode.setParam(explodedAmount);
          setExplode.getParameter('Value').setValue(1.0);
          setExplode.getParameter('InterpTime').setValue(3.0);
          // setCut.addChild(setExplode);
          state.addActivationAction(setExplode);

          {
            const labelTree = asset.getChildByName('labels');
            const labelVisibility = labelTree.getParameter('Visible');
            const makeLabelsVisible = new SetParameterValue();
            makeLabelsVisible.setParam(labelVisibility);
            makeLabelsVisible.getParameter('Value').setValue(true);
            makeLabelsVisible.getParameter('InterpTime').setValue(0);
            setExplode.addChild(makeLabelsVisible);
            {
              const labelOpacity = asset.getParameter('LabelOpacity');
              const showLabels = new SetParameterValue();
              showLabels.setParam(labelOpacity);
              showLabels.getParameter('Value').setValue(1.0);
              showLabels.getParameter('InterpTime').setValue(1.0);
              setExplode.addChild(showLabels);
            }
          }
        }

        const moveCamera = new SetCameraPositionAndTarget();
        moveCamera.setCameraPositionAndTarget(
          new Vec3({ x: 1.37228, y: -1.42257, z: 0.55485 }),
          new Vec3({ x: -0.13244, y: -0.84973, z: -0.05278 })
        );
        moveCamera.getParameter('Camera').setValue(renderer.getViewport().getCamera());
        moveCamera.getParameter('InterpTime').setValue(3.0);
        state.addActivationAction(moveCamera);
        // setCut.addChild(moveCamera);
      }

      {
        const switchState = new SwitchState();
        switchState.getParameter('TargetState').setValue('Cutaway');

        const geomClicked = new GeomClicked();
        geomClicked.getParameter('TreeItem').setValue(asset);
        geomClicked.addChild(switchState);
        state.addStateEvent(geomClicked);
      }

      const explodedAmount = asset.getParameter('ExplodeAmount');
      if (explodedAmount) {
        const setExplode = new SetParameterValue();
        setExplode.setParam(explodedAmount);
        setExplode.getParameter('Value').setValue(0.0);
        setExplode.getParameter('InterpTime').setValue(2.0);
        state.addDeactivationAction(setExplode);
      }

      {
        const labelTree = asset.getChildByName('labels');
        const labelVisibility = labelTree.getParameter('Visible');
        const showLabels = new SetParameterValue();
        showLabels.setParam(labelVisibility);
        showLabels.getParameter('Value').setValue(false);
        showLabels.getParameter('InterpTime').setValue(0);
        state.addDeactivationAction(showLabels);
        {
          const labelOpacity = asset.getParameter('LabelOpacity');
          const hideLabels = new SetParameterValue();
          hideLabels.setParam(labelOpacity);
          hideLabels.getParameter('Value').setValue(0.0);
          hideLabels.getParameter('InterpTime').setValue(0.5);
          showLabels.addChild(hideLabels);
        }
      }

      stateMachine.addState(state);
    }

    stateMachine.activateState('Initial');
  });
  return stateMachine;
};
export default setupStates;
