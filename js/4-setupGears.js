const { Color, EulerAngles, Xfo, Vec3, KinematicGroup, NumberParameter } = window.zeaEngine;
const { GearsOperator } = window.zeaKinematics;
const { SliderHandle } = window.zeaUx;

import { resolveItems } from './resolveItems.js';

const setupGears = (asset) => {
  const gearsOp = new GearsOperator('Gears');
  const rpmParam = gearsOp.getParameter('RPM');
  rpmParam.setValue(5);
  const axis = new Vec3(0, 1, 0);

  // asset.addChild(gearsOp);

  asset.addParameter(new NumberParameter('GearSliderValue'));
  const slider = new SliderHandle('GearSlider');
  const xfo = new Xfo();
  xfo.ori.setFromEulerAngles(new EulerAngles(Math.PI * 0.5, 0, Math.PI, 'ZXY'));
  xfo.tr.set(0.067, -0.21, 0.12);
  slider.getParameter('LocalXfo').setValue(xfo);
  slider.getParameter('Length').setValue(0.02);
  slider.getParameter('BarRadius').setValue(0.0);
  slider.getParameter('HandleRadius').setValue(0.015);
  slider.colorParam.setValue(new Color('#F9CE03'));
  slider.setTargetParam(asset.getParameter('GearSliderValue'));

  asset.geomLibrary.once('loaded', () => {
    // slider.getParameter('Visible').setValue(false);
    asset.addChild(slider);
  });

  asset.once('loaded', () => {
    {
      const group = new KinematicGroup('FRONT_PROPELLER_HOUSING');
      asset.addChild(group);
      resolveItems(asset, group, [
        ['.', 'FRONT_PROPELLER_HOUSING'],
        ['.', 'PROPELLER_SHAFT_NUT'],
        ['.', 'GEAR_1'],
      ]);

      const gear = gearsOp.addGear();
      gear.getMember('Ratio').setValue(1);
      gear.getMember('Axis').setValue(axis);
      gear.getOutput().setParam(group.getParameter('GlobalXfo'));
    }

    {
      const group = new KinematicGroup('GEAR_2');
      group.getParameter('InitialXfoMode').setValue('average');
      asset.addChild(group);
      resolveItems(asset, group, [['.', 'GEAR_2']]);
      const gear = gearsOp.addGear();
      gear.getMember('Axis').setValue(axis);
      gear.getOutput().setParam(group.getParameter('GlobalXfo'));
    }

    {
      const group = new KinematicGroup('GEAR_3');
      group.getParameter('InitialXfoMode').setValue('average');
      asset.addChild(group);
      resolveItems(asset, group, [['.', 'GEAR_3']]);
      const gear = gearsOp.addGear();
      gear.getMember('Axis').setValue(axis);
      gear.getMember('Ratio').setValue(-60 / 39);
      gear.getMember('Offset').setValue(-0.3);
      gear.getOutput().setParam(group.getParameter('GlobalXfo'));
    }

    {
      const group = new KinematicGroup('BREARINGSBACK');
      group.getParameter('InitialXfoMode').setValue('average');
      asset.addChild(group);
      resolveItems(asset, group, [
        ['.', 'BODY_1_ASSM_ASM', 'SKF_6209_CE_BEARING_ASM', 'SKF_6209-C3_COLLAR'],
        ['.', 'BODY_1_ASSM_ASM', 'SKF_6209_CE_BEARING_ASM', 'SKF_6209-C3_INNERFACE_'],
        ['.', 'BODY_1_ASSM_ASM', 'SKF_6209_CE_BEARING_ASM', 'SKF_6209-C3_BALL'],
        ['.', 'BODY_1_ASSM_ASM', 'SKF_6209_CE_BEARING_ASM', 'SKF_6209-C3_BALL1'],
        ['.', 'BODY_1_ASSM_ASM', 'SKF_6209_CE_BEARING_ASM', 'SKF_6209-C3_BALL2'],
        ['.', 'BODY_1_ASSM_ASM', 'SKF_6209_CE_BEARING_ASM', 'SKF_6209-C3_BALL3'],
        ['.', 'BODY_1_ASSM_ASM', 'SKF_6209_CE_BEARING_ASM', 'SKF_6209-C3_BALL4'],
        ['.', 'BODY_1_ASSM_ASM', 'SKF_6209_CE_BEARING_ASM', 'SKF_6209-C3_BALL5'],
        ['.', 'BODY_1_ASSM_ASM', 'SKF_6209_CE_BEARING_ASM', 'SKF_6209-C3_BALL6'],
        ['.', 'BODY_1_ASSM_ASM', 'SKF_6209_CE_BEARING_ASM', 'SKF_6209-C3_BALL7'],
        ['.', 'BODY_1_ASSM_ASM', 'SKF_6209_CE_BEARING_ASM', 'SKF_6209-C3_BALL8'],
        ['.', 'BODY_1_ASSM_ASM', 'SKF_6209_CE_BEARING_ASM', 'SKF_6209-C3_BALL9'],

        ['.', '6210_BALL_BEARING_SKF_ASM', '6210_BALL_BEARING_CASE_SKF'],
        ['.', '6210_BALL_BEARING_SKF_ASM', '6210_BALL_BEARING_COLLAR_SKF'],
        ['.', '6210_BALL_BEARING_SKF_ASM', '6210_BALL_BEARING_BALL_SKF'],
        ['.', '6210_BALL_BEARING_SKF_ASM', '6210_BALL_BEARING_BALL_SKF1'],
        ['.', '6210_BALL_BEARING_SKF_ASM', '6210_BALL_BEARING_BALL_SKF2'],
        ['.', '6210_BALL_BEARING_SKF_ASM', '6210_BALL_BEARING_BALL_SKF3'],
        ['.', '6210_BALL_BEARING_SKF_ASM', '6210_BALL_BEARING_BALL_SKF4'],
        ['.', '6210_BALL_BEARING_SKF_ASM', '6210_BALL_BEARING_BALL_SKF5'],
        ['.', '6210_BALL_BEARING_SKF_ASM', '6210_BALL_BEARING_BALL_SKF6'],
        ['.', '6210_BALL_BEARING_SKF_ASM', '6210_BALL_BEARING_BALL_SKF7'],
        ['.', '6210_BALL_BEARING_SKF_ASM', '6210_BALL_BEARING_BALL_SKF8'],
        ['.', '6210_BALL_BEARING_SKF_ASM', '6210_BALL_BEARING_BALL_SKF9'],
      ]);

      const gear = gearsOp.addGear();
      gear.getMember('Axis').setValue(axis);
      gear.getMember('Ratio').setValue((-60 / 39) * 0.5);
      gear.getOutput().setParam(group.getParameter('GlobalXfo'));
    }
    {
      const group = new KinematicGroup('GEAR_4');
      group.getParameter('InitialXfoMode').setValue('average');
      asset.addChild(group);
      resolveItems(asset, group, [['.', 'GEAR_4']]);

      const gear = gearsOp.addGear();
      gear.getMember('Axis').setValue(axis);
      gear.getMember('Ratio').setValue((-60 / 39) * -(32 / 108));
      gear.getOutput().setParam(group.getParameter('GlobalXfo'));
    }

    {
      const group = new KinematicGroup('GEAR_5');
      group.getParameter('InitialXfoMode').setValue('average');
      asset.addChild(group);
      resolveItems(asset, group, [
        // [".", "GEAR_SHAFT_ASSM_ASM", "GEAR_5"]
      ]);

      const gear = gearsOp.addGear();
      gear.getMember('Axis').setValue(axis);
      gear.getOutput().setParam(group.getParameter('GlobalXfo'));
    }

    {
      const group = new KinematicGroup('BREARINGSDRIVESHAFT');
      group.getParameter('InitialXfoMode').setValue('average');
      asset.addChild(group);
      resolveItems(asset, group, [
        ['.', 'PROPELLER_HOUSING_ASSM_ASM', '6308_BALL_BEARING_SKF_ASM', '6308_BALL_BEARING_CASE_SKF'],
        ['.', 'PROPELLER_HOUSING_ASSM_ASM', '6308_BALL_BEARING_SKF_ASM', '6308_BALL_BEARING_COLLAR_SKF'],
        ['.', 'PROPELLER_HOUSING_ASSM_ASM', '6308_BALL_BEARING_SKF_ASM', '6308_BALL_BEARING_BALL_SKF'],
        ['.', 'PROPELLER_HOUSING_ASSM_ASM', '6308_BALL_BEARING_SKF_ASM', '6308_BALL_BEARING_BALL_SKF1'],
        ['.', 'PROPELLER_HOUSING_ASSM_ASM', '6308_BALL_BEARING_SKF_ASM', '6308_BALL_BEARING_BALL_SKF2'],
        ['.', 'PROPELLER_HOUSING_ASSM_ASM', '6308_BALL_BEARING_SKF_ASM', '6308_BALL_BEARING_BALL_SKF3'],
        ['.', 'PROPELLER_HOUSING_ASSM_ASM', '6308_BALL_BEARING_SKF_ASM', '6308_BALL_BEARING_BALL_SKF4'],
        ['.', 'PROPELLER_HOUSING_ASSM_ASM', '6308_BALL_BEARING_SKF_ASM', '6308_BALL_BEARING_BALL_SKF5'],
        ['.', 'PROPELLER_HOUSING_ASSM_ASM', '6308_BALL_BEARING_SKF_ASM', '6308_BALL_BEARING_BALL_SKF6'],
        ['.', 'PROPELLER_HOUSING_ASSM_ASM', '6308_BALL_BEARING_SKF_ASM', '6308_BALL_BEARING_BALL_SKF7'],
      ]);

      const gear = gearsOp.addGear();
      gear.getMember('Axis').setValue(axis);
      gear.getMember('Ratio').setValue(-0.5);
      gear.getOutput().setParam(group.getParameter('GlobalXfo'));
    }

    ////////////////////////////////
    // Setup the gear shifter slider.

    {
      const group = new KinematicGroup('FRONT_PROPELLER_HOUSING');
      group.getParameter('InitialXfoMode').setValue('average');
      asset.addChild(group);
      resolveItems(asset, group, [
        ['.', 'GEAR_SHAFT_ASSM_ASM', 'SHIFTER'],
        ['.', 'GEAR_SHAFT_ASSM_ASM', 'GEAR_SHAFT_1'],
        ['.', 'GEAR_SHAFT_ASSM_ASM', 'GEAR_SHAFT_2'],
        ['.', 'GEAR_SHAFT_ASSM_ASM', 'GEAR_5'],
        ['.', 'GEAR_SHAFT_ASSM_ASM', 'DOWEL_PIN'],
        ['.', 'GEAR_SHAFT_ASSM_ASM', 'DOWEL_PIN1'],
      ]);
      const sliderParam = asset.getParameter('GearSliderValue');
      const initialXfo = group.getParameter('GlobalXfo').getValue().clone();
      sliderParam.on('valueChanged', () => {
        const value = sliderParam.getValue();
        const xfo = group.getParameter('GlobalXfo').getValue().clone();
        xfo.tr.y = initialXfo.tr.y + value * 0.02;
        group.getParameter('GlobalXfo').setValue(xfo);

        if (value < 0.3) {
          if (currGearSetting != 1) setGearBoxSetting(1);
        } else if (value > 0.7) {
          if (currGearSetting != 2) setGearBoxSetting(2);
        }
      });
    }
    setGearBoxSetting(1);
  });

  let currGearSetting;
  const setGearBoxSetting = (gearboxSetting) => {
    if (gearboxSetting == 1) {
      const gear2 = gearsOp.getParameter('Gears').getElement(1);
      gear2.getMember('Ratio').setValue(1);
      const gear3 = gearsOp.getParameter('Gears').getElement(2);
      gear3.getMember('Ratio').setValue(-60 / 39);
      const gear4 = gearsOp.getParameter('Gears').getElement(4);
      gear4.getMember('Ratio').setValue(32 / 104);
      const brearings = gearsOp.getParameter('Gears').getElement(6);
      brearings.getMember('Ratio').setValue(-1);
    } else if (gearboxSetting == 2) {
      const gear4 = gearsOp.getParameter('Gears').getElement(4);
      gear4.getMember('Ratio').setValue(1);
      const gear3 = gearsOp.getParameter('Gears').getElement(2);
      gear3.getMember('Ratio').setValue(-104 / 32);
      const gear2 = gearsOp.getParameter('Gears').getElement(1);
      gear2.getMember('Ratio').setValue(60 / 39);
      const brearings = gearsOp.getParameter('Gears').getElement(6);
      brearings.getMember('Ratio').setValue(-2);
    }
    currGearSetting = gearboxSetting;
  };
};
export default setupGears;
