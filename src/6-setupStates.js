import { 
  Vec3,
  StateMachine,
  State,
  SetCameraPositionAndTarget,
  SetParameterValue,
  GeomClicked,
  SwitchState
 } from "../dist/zea-engine/dist/index.esm.js"

const setupStates = (asset, renderer) => {

  const stateMachine = new StateMachine("States");
  
  asset.addChild(stateMachine);

  asset.once('loaded', ()=>{
    
    // const casingGroup = new Group('casingGroup');
    // casingGroup.resolveItems([
    //   [".", "BODY-2"],
    //   [".", "BODY_1_ASSM_ASM", "BODY_1"]
    // ]);
    // asset.addChild(casingGroup);
    {
      const state = new State("Initial")
      const moveCamera = new SetCameraPositionAndTarget()
      moveCamera.setCameraPositionAndTarget(
        new Vec3({"x":0.51679,"y":-0.69076,"z":0.34219}), new Vec3({"x":0.03094,"y":-0.05395,"z":0}),
      )
      moveCamera.getParameter('Camera').setValue(renderer.getViewport().getCamera())
      moveCamera.getParameter("InterpTime").setValue(1.0)
      state.addActivationAction(moveCamera)

      const cutAwayGroup = asset.getChildByName('cutAwayGroup')
      if (cutAwayGroup) {
        const cutDistParam = cutAwayGroup.getParameter('CutPlaneDist')
        const setCut = new SetParameterValue()
        setCut.getOutput("Param").setParam(cutDistParam)
        setCut.getParameter("Value").setValue(-0.17)
        state.addActivationAction(setCut)
      }

      {
        const switchToCutAway = new SwitchState();
        switchToCutAway.getParameter("TargetState").setValue("Cutaway")
      
        const geomClicked = new GeomClicked()
        geomClicked.getParameter('TreeItem').setValue(cutAwayGroup)
        geomClicked.addChild(switchToCutAway)
        state.addStateEvent(geomClicked)
      }

      stateMachine.addState(state)
    }
    {
      const state = new State("Cutaway")
      const moveCamera = new SetCameraPositionAndTarget()
      moveCamera.setCameraPositionAndTarget(
        new Vec3({"x":0.35949,"y":-0.48411,"z":0.23215}), new Vec3({"x":0.03099,"y":-0.05347,"z":0.00083}),
      )
      moveCamera.getParameter('Camera').setValue(renderer.getViewport().getCamera())
      moveCamera.getParameter("InterpTime").setValue(2.0)
      state.addActivationAction(moveCamera)

      const cutAwayGroup = asset.getChildByName('cutAwayGroup')
      if (cutAwayGroup) {
        const cutDistParam = cutAwayGroup.getParameter('CutPlaneDist')
        const setCut = new SetParameterValue()
        setCut.getOutput("Param").setParam(cutDistParam)
        setCut.getParameter("Value").setValue(0.0)
        setCut.getParameter("InterpTime").setValue(2.0)
        state.addActivationAction(setCut)
        
        const showHandle = new SetParameterValue()
        const slider = asset.getChildByName("GearSlider")
        showHandle.getOutput("Param").setParam(slider.getParameter("Visible"))
        showHandle.getParameter("Value").setValue(true)
        showHandle.getParameter("InterpTime").setValue(0.0)
        setCut.addChild(showHandle)
      }

      {
        const switchToInitial = new SwitchState();
        switchToInitial.getParameter("TargetState").setValue("Exploded")
      
        const geomClicked = new GeomClicked()
        geomClicked.getParameter('TreeItem').setValue(cutAwayGroup)
        geomClicked.addChild(switchToInitial)
        state.addStateEvent(geomClicked)
      }
      
      {
        const hideHandle = new SetParameterValue()
        const slider = asset.getChildByName("GearSlider")
        hideHandle.getOutput("Param").setParam(slider.getParameter("Visible"))
        hideHandle.getParameter("Value").setValue(false)
        hideHandle.getParameter("InterpTime").setValue(0.0)
        state.addDeactivationAction(hideHandle)
      }

      stateMachine.addState(state)
    }
    
    {
      const state = new State("Exploded")

      const cutAwayGroup = asset.getChildByName('cutAwayGroup')
      if (cutAwayGroup) {
        const cutDistParam = cutAwayGroup.getParameter('CutPlaneDist')
        const setCut = new SetParameterValue()
        setCut.getOutput("Param").setParam(cutDistParam)
        setCut.getParameter("Value").setValue(-0.17)
        setCut.getParameter("InterpTime").setValue(2.0)
        state.addActivationAction(setCut)

        const explodedAmount = asset.getChildByName('ExplodeAmount')
        if (explodedAmount) {
          const setExplode = new SetParameterValue()
          setExplode.getOutput("Param").setParam(explodedAmount.getParameter('Input'))
          setExplode.getParameter("Value").setValue(1.0)
          setExplode.getParameter("InterpTime").setValue(3.0)
          setCut.addChild(setExplode)


          const labelOpacity = asset.getChildByName('LabelOpacity')
          const showLabels = new SetParameterValue()
          showLabels.getOutput("Param").setParam(labelOpacity.getParameter('Input'))
          showLabels.getParameter("Value").setValue(1.0)
          showLabels.getParameter("InterpTime").setValue(1.0)
          setExplode.addChild(showLabels)
        }
        
        const moveCamera = new SetCameraPositionAndTarget()
        moveCamera.setCameraPositionAndTarget(
          new Vec3({"x":1.37228,"y":-1.42257,"z":0.55485}), new Vec3({"x":-0.13244,"y":-0.84973,"z":-0.05278}),
        )
        moveCamera.getParameter('Camera').setValue(renderer.getViewport().getCamera())
        moveCamera.getParameter("InterpTime").setValue(3.0)
        // state.addActivationAction(moveCamera)
        setCut.addChild(moveCamera)
      }

      {
        const switchToInitial = new SwitchState();
        switchToInitial.getParameter("TargetState").setValue("Cutaway")
      
        const geomClicked = new GeomClicked()
        geomClicked.getParameter('TreeItem').setValue(cutAwayGroup)
        geomClicked.addChild(switchToInitial)
        state.addStateEvent(geomClicked)
      }

      const explodedAmount = asset.getChildByName('ExplodeAmount')
      if (explodedAmount) {
        const setExplode = new SetParameterValue()
        setExplode.getOutput("Param").setParam(explodedAmount.getParameter('Input'))
        setExplode.getParameter("Value").setValue(0.0)
        setExplode.getParameter("InterpTime").setValue(2.0)
        state.addDeactivationAction(setExplode)
      }
      

      const labelOpacity = asset.getChildByName('LabelOpacity')
      const hideLabels = new SetParameterValue()
      hideLabels.getOutput("Param").setParam(labelOpacity.getParameter('Input'))
      hideLabels.getParameter("Value").setValue(0.0)
      hideLabels.getParameter("InterpTime").setValue(0.5)
      state.addDeactivationAction(hideLabels)

      stateMachine.addState(state)
    }
    
    stateMachine.activateState('Initial')
  })

  return stateMachine
}
export default setupStates