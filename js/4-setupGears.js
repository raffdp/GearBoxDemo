const { Color, EulerAngles, Xfo, Vec3, Group, NumberParameter } = globalThis.zeaEngine;
const { GearsOperator } = globalThis.zeaKinematics;
const { SliderHandle } = globalThis.zeaUx;

const setupGears = (asset) => {
  const gearsOp = new GearsOperator('Gears');
  const rpmParam = gearsOp.getParameter('RPM');
  rpmParam.setValue(5);
  const axis = new Vec3(0, 1, 0);

  asset.addChild(gearsOp);

  asset.addParameter(new NumberParameter('GearSliderValue'));

  asset.once('loaded', () => {
    const slider = new SliderHandle('GearSlider');
    const xfo = new Xfo();
    xfo.ori.setFromEulerAngles(new EulerAngles(Math.PI * 0.5, 0, Math.PI, 'ZXY'));
    xfo.tr.set(0.067, -0.21, 0.12);
    slider.getParameter('LocalXfo').setValue(xfo);
    slider.getParameter('Length').setValue(0.02);
    slider.getParameter('Bar Radius').setValue(0.0);
    slider.getParameter('Handle Radius').setValue(0.015);
    slider.colorParam.setValue(new Color('#F9CE03'));
    slider.setTargetParam(asset.getParameter('GearSliderValue'));
    slider.getParameter('Visible').setValue(false);
    asset.addChild(slider);

    {
      const group = new Group('FRONT_PROPELLER_HOUSING');
      asset.addChild(group);
      group.resolveItems([
        ['.', 'FRONT_PROPELLER_HOUSING'],
        ['.', 'PROPELLER_SHAFT_NUT'],
        ['.', 'GEAR_1'],
      ]);

      const gear = gearsOp.getParameter('Gears').addElement();
      gear.getMember('Ratio').setValue(1);
      gear.getMember('Axis').setValue(axis);
      gear.getOutput().setParam(group.getParameter('GlobalXfo'));
    }

    {
      const group = new Group('GEAR_2');
      group.getParameter('InitialXfoMode').setValue('average');
      asset.addChild(group);
      group.resolveItems([['.', 'GEAR_2']]);
      const gear = gearsOp.getParameter('Gears').addElement();
      gear.getMember('Axis').setValue(axis);
      gear.getOutput().setParam(group.getParameter('GlobalXfo'));
    }

    {
      const group = new Group('GEAR_3');
      group.getParameter('InitialXfoMode').setValue('average');
      asset.addChild(group);
      group.resolveItems([['.', 'GEAR_3']]);
      const gear = gearsOp.getParameter('Gears').addElement();
      gear.getMember('Axis').setValue(axis);
      gear.getMember('Ratio').setValue(-60 / 39);
      gear.getMember('Offset').setValue(-0.3);
      gear.getOutput().setParam(group.getParameter('GlobalXfo'));
    }

    {
      const group = new Group('BREARINGSBACK');
      group.getParameter('InitialXfoMode').setValue('average');
      asset.addChild(group);
      group.resolveItems([
        ['.', 'BODY_1_ASSM_ASM', 'SKF_6209_CE_BEARING_ASM', 'SKF_6209-C3_COLLAR'],
        ['.', 'BODY_1_ASSM_ASM', 'SKF_6209_CE_BEARING_ASM', 'SKF_6209-C3_INNERFACE_'],
        ['.', 'BODY_1_ASSM_ASM', 'SKF_6209_CE_BEARING_ASM', 'SKF_6209-C3_BALL'],
        ['.', 'BODY_1_ASSM_ASM', 'SKF_6209_CE_BEARING_ASM', 'SKF_6209-C3_BALL_004', 'SKF_6209-C3_BALL'],
        ['.', 'BODY_1_ASSM_ASM', 'SKF_6209_CE_BEARING_ASM', 'SKF_6209-C3_BALL_005', 'SKF_6209-C3_BALL'],
        ['.', 'BODY_1_ASSM_ASM', 'SKF_6209_CE_BEARING_ASM', 'SKF_6209-C3_BALL_006', 'SKF_6209-C3_BALL'],
        ['.', 'BODY_1_ASSM_ASM', 'SKF_6209_CE_BEARING_ASM', 'SKF_6209-C3_BALL_007', 'SKF_6209-C3_BALL'],
        ['.', 'BODY_1_ASSM_ASM', 'SKF_6209_CE_BEARING_ASM', 'SKF_6209-C3_BALL_008', 'SKF_6209-C3_BALL'],
        ['.', 'BODY_1_ASSM_ASM', 'SKF_6209_CE_BEARING_ASM', 'SKF_6209-C3_BALL_009', 'SKF_6209-C3_BALL'],
        ['.', 'BODY_1_ASSM_ASM', 'SKF_6209_CE_BEARING_ASM', 'SKF_6209-C3_BALL_010', 'SKF_6209-C3_BALL'],
        ['.', 'BODY_1_ASSM_ASM', 'SKF_6209_CE_BEARING_ASM', 'SKF_6209-C3_BALL_011', 'SKF_6209-C3_BALL'],
        ['.', 'BODY_1_ASSM_ASM', 'SKF_6209_CE_BEARING_ASM', 'SKF_6209-C3_BALL_012', 'SKF_6209-C3_BALL'],

        ['.', '6210_BALL_BEARING_SKF_ASM', '6210_BALL_BEARING_CASE_SKF'],
        ['.', '6210_BALL_BEARING_SKF_ASM', '6210_BALL_BEARING_COLLAR_SKF'],
        ['.', '6210_BALL_BEARING_SKF_ASM', '6210_BALL_BEARING_BALL_SKF'],
        ['.', '6210_BALL_BEARING_SKF_ASM', '6210_BALL_BEARING_BALL_SKF_004', '6210_BALL_BEARING_BALL_SKF'],
        ['.', '6210_BALL_BEARING_SKF_ASM', '6210_BALL_BEARING_BALL_SKF_005', '6210_BALL_BEARING_BALL_SKF'],
        ['.', '6210_BALL_BEARING_SKF_ASM', '6210_BALL_BEARING_BALL_SKF_006', '6210_BALL_BEARING_BALL_SKF'],
        ['.', '6210_BALL_BEARING_SKF_ASM', '6210_BALL_BEARING_BALL_SKF_007', '6210_BALL_BEARING_BALL_SKF'],
        ['.', '6210_BALL_BEARING_SKF_ASM', '6210_BALL_BEARING_BALL_SKF_008', '6210_BALL_BEARING_BALL_SKF'],
        ['.', '6210_BALL_BEARING_SKF_ASM', '6210_BALL_BEARING_BALL_SKF_009', '6210_BALL_BEARING_BALL_SKF'],
        ['.', '6210_BALL_BEARING_SKF_ASM', '6210_BALL_BEARING_BALL_SKF_010', '6210_BALL_BEARING_BALL_SKF'],
        ['.', '6210_BALL_BEARING_SKF_ASM', '6210_BALL_BEARING_BALL_SKF_011', '6210_BALL_BEARING_BALL_SKF'],
        ['.', '6210_BALL_BEARING_SKF_ASM', '6210_BALL_BEARING_BALL_SKF_012', '6210_BALL_BEARING_BALL_SKF'],
      ]);

      const gear = gearsOp.getParameter('Gears').addElement();
      gear.getMember('Axis').setValue(axis);
      gear.getMember('Ratio').setValue((-60 / 39) * 0.5);
      gear.getOutput().setParam(group.getParameter('GlobalXfo'));
    }
    {
      const group = new Group('GEAR_4');
      group.getParameter('InitialXfoMode').setValue('average');
      asset.addChild(group);
      group.resolveItems([['.', 'GEAR_4']]);

      const gear = gearsOp.getParameter('Gears').addElement();
      gear.getMember('Axis').setValue(axis);
      gear.getMember('Ratio').setValue((-60 / 39) * -(32 / 108));
      gear.getOutput().setParam(group.getParameter('GlobalXfo'));
    }

    {
      const group = new Group('GEAR_5');
      group.getParameter('InitialXfoMode').setValue('average');
      asset.addChild(group);
      group.resolveItems([
        // [".", "GEAR_SHAFT_ASSM_ASM", "GEAR_5"]
      ]);

      const gear = gearsOp.getParameter('Gears').addElement();
      gear.getMember('Axis').setValue(axis);
      gear.getOutput().setParam(group.getParameter('GlobalXfo'));
    }

    {
      const group = new Group('BREARINGSDRIVESHAFT');
      group.getParameter('InitialXfoMode').setValue('average');
      asset.addChild(group);
      group.resolveItems([
        ['.', 'PROPELLER_HOUSING_ASSM_ASM', '6308_BALL_BEARING_SKF_ASM', '6308_BALL_BEARING_CASE_SKF'],
        ['.', 'PROPELLER_HOUSING_ASSM_ASM', '6308_BALL_BEARING_SKF_ASM', '6308_BALL_BEARING_COLLAR_SKF'],
        ['.', 'PROPELLER_HOUSING_ASSM_ASM', '6308_BALL_BEARING_SKF_ASM', '6308_BALL_BEARING_BALL_SKF'],
        [
          '.',
          'PROPELLER_HOUSING_ASSM_ASM',
          '6308_BALL_BEARING_SKF_ASM',
          '6308_BALL_BEARING_BALL_SKF_004',
          '6308_BALL_BEARING_BALL_SKF',
        ],
        [
          '.',
          'PROPELLER_HOUSING_ASSM_ASM',
          '6308_BALL_BEARING_SKF_ASM',
          '6308_BALL_BEARING_BALL_SKF_005',
          '6308_BALL_BEARING_BALL_SKF',
        ],
        [
          '.',
          'PROPELLER_HOUSING_ASSM_ASM',
          '6308_BALL_BEARING_SKF_ASM',
          '6308_BALL_BEARING_BALL_SKF_006',
          '6308_BALL_BEARING_BALL_SKF',
        ],
        [
          '.',
          'PROPELLER_HOUSING_ASSM_ASM',
          '6308_BALL_BEARING_SKF_ASM',
          '6308_BALL_BEARING_BALL_SKF_007',
          '6308_BALL_BEARING_BALL_SKF',
        ],
        [
          '.',
          'PROPELLER_HOUSING_ASSM_ASM',
          '6308_BALL_BEARING_SKF_ASM',
          '6308_BALL_BEARING_BALL_SKF_008',
          '6308_BALL_BEARING_BALL_SKF',
        ],
        [
          '.',
          'PROPELLER_HOUSING_ASSM_ASM',
          '6308_BALL_BEARING_SKF_ASM',
          '6308_BALL_BEARING_BALL_SKF_009',
          '6308_BALL_BEARING_BALL_SKF',
        ],
        [
          '.',
          'PROPELLER_HOUSING_ASSM_ASM',
          '6308_BALL_BEARING_SKF_ASM',
          '6308_BALL_BEARING_BALL_SKF_010',
          '6308_BALL_BEARING_BALL_SKF',
        ],
      ]);

      const gear = gearsOp.getParameter('Gears').addElement();
      gear.getMember('Axis').setValue(axis);
      gear.getMember('Ratio').setValue(0.5);
      gear.getOutput().setParam(group.getParameter('GlobalXfo'));
    }

    ////////////////////////////////
    // Setup the gear shifter slider.

    {
      const group = new Group('FRONT_PROPELLER_HOUSING');
      group.getParameter('InitialXfoMode').setValue('average');
      asset.addChild(group);
      group.resolveItems([
        ['.', 'GEAR_SHAFT_ASSM_ASM', 'SHIFTER'],
        ['.', 'GEAR_SHAFT_ASSM_ASM', 'GEAR_SHAFT_1'],
        ['.', 'GEAR_SHAFT_ASSM_ASM', 'GEAR_SHAFT_2'],
        ['.', 'GEAR_SHAFT_ASSM_ASM', 'GEAR_5'],
        ['.', 'GEAR_SHAFT_ASSM_ASM', 'DOWEL_PIN'],
        ['.', 'GEAR_SHAFT_ASSM_ASM', 'DOWEL_PIN_005', 'DOWEL_PIN'],
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
