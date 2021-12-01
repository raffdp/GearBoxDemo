const { Color, Xfo, Vec3, KinematicGroup, NumberParameter, Material, TreeItem, Lines, GeomItem, Label, BillboardItem } =
  window.zeaEngine;
const { ExplodePartsOperator } = window.zeaKinematics;

import { resolveItems } from './resolveItems.js';
import { RouterOperator } from './RouterOperator.js';

const setupExplode = (asset) => {
  const opExplodeFront1 = new ExplodePartsOperator('opExplodeFront1');
  // asset.addChild(opExplodeFront1);
  opExplodeFront1.getParameter('Dist').setValue(1.6);
  opExplodeFront1.getParameter('Stages').setValue(0);
  opExplodeFront1.getParameter('Cascade').setValue(true);

  const opExplodeBack1 = new ExplodePartsOperator('opExplodeBack1');
  // asset.addChild(opExplodeBack1);
  opExplodeBack1.getParameter('Dist').setValue(0.5);
  opExplodeBack1.getParameter('Stages').setValue(8);
  opExplodeBack1.getParameter('Cascade').setValue(true);

  const explodedAmountParam = asset.addParameter(new NumberParameter('ExplodeAmount', 0));
  const explodedAmountRouter = new RouterOperator('ExplodeAmountRouter');
  explodedAmountRouter.getInput('Input').setParam(explodedAmountParam);
  explodedAmountRouter.addRoute().setParam(opExplodeFront1.getParameter('Explode'));
  explodedAmountRouter.addRoute().setParam(opExplodeBack1.getParameter('Explode'));

  const labelOpacityParam = asset.addParameter(new NumberParameter('LabelOpacity', 0));
  const labelOpacityRouter = new RouterOperator('LabelOpacityRouter');
  labelOpacityRouter.getInput('Input').setParam(labelOpacityParam);

  const labelTree = new TreeItem('labels');
  const labelOutlineColor = new Color('#3B3B3B');
  const linesMaterial = new Material('LabelLinesMaterial', 'LinesShader');
  linesMaterial.getParameter('BaseColor').setValue(labelOutlineColor);
  labelOpacityRouter.addRoute().setParam(linesMaterial.getParameter('Opacity'));
  // linesMaterial.getParameter('Opacity').setValue(0.0)
  let index = 0;

  const labelBackgroundColor = new Color('#EEEEEE');
  asset.addChild(labelTree);
  const addLabel = (pos, basePose, name) => {
    const label = new Label(name);
    // label.getParameter('font').setValue("Arial");
    label.getParameter('FontSize').setValue(48);
    // label.getParameter('fontColor').setValue(labelFontColor);
    label.getParameter('BackgroundColor').setValue(labelBackgroundColor);
    label.getParameter('OutlineColor').setValue(labelOutlineColor);
    label.getParameter('BorderWidth').setValue(3);
    label.getParameter('Margin').setValue(16);

    const billboard = new BillboardItem('billboard' + index, label);
    const xfo = new Xfo(pos);
    billboard.getParameter('LocalXfo').setValue(xfo);
    billboard.getParameter('PixelsPerMeter').setValue(1500);
    billboard.getParameter('AlignedToCamera').setValue(true);
    // billboard.getParameter('Alpha').setValue(0.0);
    labelOpacityRouter.addRoute().setParam(billboard.getParameter('Alpha'));
    labelTree.addChild(billboard);

    const line = new Lines();
    line.setNumVertices(2);
    line.setNumSegments(1);
    line.setSegmentVertexIndices(0, 0, 1);
    line.getVertexAttribute('positions').getValueRef(0).setFromOther(new Vec3(0, 0, 0));
    line.getVertexAttribute('positions').getValueRef(1).setFromOther(basePose.subtract(pos));
    const lineItem = new GeomItem('Line', line, linesMaterial);

    billboard.addChild(lineItem, false);
    index++;
  };

  asset.once('loaded', () => {
    addLabel(new Vec3(0.08, -1.6, 0.3), new Vec3(0.08, -1.6, 0.05), 'Front Propeller Housing');
    addLabel(new Vec3(-0.1, -1.05, 0.3), new Vec3(-0.1, -1.05, 0.05), 'Motor Housing');
    addLabel(new Vec3(0.07, -0.035, 0.4), new Vec3(0.07, -0.035, 0.25), 'Shifter');
    addLabel(new Vec3(0.08, -0.15, 0.3), new Vec3(0.08, -0.15, 0.03), 'Gear 1');
    addLabel(new Vec3(0.08, -0.4, 0.3), new Vec3(0.08, -0.4, 0.06), 'Gear 2');
    addLabel(new Vec3(-0.08, -0.17, 0.3), new Vec3(-0.08, -0.17, 0.06), 'Gear 3');
    addLabel(new Vec3(0.08, 0.16, 0.3), new Vec3(0.08, 0.16, 0.06), 'Gear 4');

    {
      const group = new KinematicGroup('mainShaft4Bolts');
      group.getParameter('InitialXfoMode').setValue('average');
      asset.addChild(group);
      resolveItems(asset, group, [
        ['.', '10X30_HEX_BOLT'],
        ['.', '10X30_HEX_BOLT1'],
        ['.', '10X30_HEX_BOLT2'],
        ['.', '10X30_HEX_BOLT3'],
      ]);
      const part = opExplodeFront1.addPart();
      part.getParameter('Axis').setValue(new Vec3(0, -1, 0));
      part.getOutput().setParam(group.getParameter('GlobalXfo'));
    }
    {
      const group = new KinematicGroup('nut');
      group.getParameter('InitialXfoMode').setValue('average');
      asset.addChild(group);
      resolveItems(asset, group, [['.', 'PROPELLER_SHAFT_NUT']]);
      const part = opExplodeFront1.addPart();
      part.getParameter('Axis').setValue(new Vec3(0, -1, 0));
      part.getOutput().setParam(group.getParameter('GlobalXfo'));
    }
    {
      const group = new KinematicGroup('washer');
      group.getParameter('InitialXfoMode').setValue('average');
      asset.addChild(group);
      resolveItems(asset, group, [['.', 'WASHER_FOR_PROPRLLER_HOSING_MTG']]);
      const part = opExplodeFront1.addPart();
      part.getParameter('Axis').setValue(new Vec3(0, -1, 0));
      part.getOutput().setParam(group.getParameter('GlobalXfo'));
    }
    {
      const group = new KinematicGroup('FRONT_PROPELLER_HOUSING');
      group.getParameter('InitialXfoMode').setValue('average');
      asset.addChild(group);
      resolveItems(asset, group, [['.', 'FRONT_PROPELLER_HOUSING']]);
      const part = opExplodeFront1.addPart();
      part.getParameter('Axis').setValue(new Vec3(0, -1, 0));
      part.getOutput().setParam(group.getParameter('GlobalXfo'));
    }
    {
      const group = new KinematicGroup('FRONT_PROPELLER_HOUSING');
      group.getParameter('InitialXfoMode').setValue('average');
      asset.addChild(group);
      resolveItems(asset, group, [['.', 'PROPELLER_HOUSING_ASSM_ASM', 'PROPELLER_HOUSING']]);
      const part = opExplodeFront1.addPart();
      part.getParameter('Axis').setValue(new Vec3(0, -1, 0));
      part.getOutput().setParam(group.getParameter('GlobalXfo'));
    }
    {
      const group = new KinematicGroup('FRONT_PROPELLER_HOUSING');
      group.getParameter('InitialXfoMode').setValue('average');
      asset.addChild(group);
      resolveItems(asset, group, [['.', 'PROPELLER_HOUSING_ASSM_ASM', '60-80-10_OIL_SEAL']]);
      const part = opExplodeFront1.addPart();
      part.getParameter('Axis').setValue(new Vec3(0, -1, 0));
      part.getOutput().setParam(group.getParameter('GlobalXfo'));
    }

    {
      const group = new KinematicGroup('FRONT_PROPELLER_HOUSING');
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
      const part = opExplodeFront1.addPart();
      part.getParameter('Axis').setValue(new Vec3(0, -1, 0));
      part.getOutput().setParam(group.getParameter('GlobalXfo'));
    }

    {
      const group = new KinematicGroup('10X30_HEX_BOLTs');
      group.getParameter('InitialXfoMode').setValue('average');
      asset.addChild(group);
      resolveItems(asset, group, [
        ['.', '10X30_HEX_BOLT4'],
        ['.', '10X30_HEX_BOLT5'],
        ['.', '10X30_HEX_BOLT6'],
        ['.', '10X30_HEX_BOLT7'],
        ['.', '10X30_HEX_BOLT8'],
        ['.', '10X30_HEX_BOLT9'],
        ['.', '10X30_HEX_BOLT10'],
        ['.', '10X30_HEX_BOLT11'],
        ['.', '10X30_HEX_BOLT12'],
        ['.', '10X30_HEX_BOLT13'],

        ['.', '8X30_ALLEN_BOLT'],
        ['.', '8X30_ALLEN_BOLT1'],
        ['.', '8X30_ALLEN_BOLT2'],
        ['.', '8X30_ALLEN_BOLT3'],
      ]);
      const part = opExplodeFront1.addPart();
      part.getParameter('Axis').setValue(new Vec3(0, -1, 0));
      part.getOutput().setParam(group.getParameter('GlobalXfo'));
    }
    {
      const group = new KinematicGroup('10X30_HEX_BOLTs');
      group.getParameter('InitialXfoMode').setValue('average');
      asset.addChild(group);
      resolveItems(asset, group, [
        ['.', '10X45_HEX_BOT'],
        ['.', '10X45_HEX_BOT1'],
      ]);
      const part = opExplodeFront1.addPart();
      part.getParameter('Axis').setValue(new Vec3(0, -1, 0));
      part.getOutput().setParam(group.getParameter('GlobalXfo'));
    }
    {
      const group = new KinematicGroup('10X30_HEX_BOLTs');
      group.getParameter('InitialXfoMode').setValue('average');
      asset.addChild(group);
      resolveItems(asset, group, [
        ['.', '10MM_SPRING_WASHER'],
        ['.', '10MM_SPRING_WASHER1'],
      ]);
      const part = opExplodeFront1.addPart();
      part.getParameter('Axis').setValue(new Vec3(0, -1, 0));
      part.getOutput().setParam(group.getParameter('GlobalXfo'));
    }
    {
      const group = new KinematicGroup('10X30_HEX_BOLTs');
      group.getParameter('InitialXfoMode').setValue('average');
      asset.addChild(group);
      resolveItems(asset, group, [['.', 'GEAR_HOUSING_ASSM_ASM', 'U-SEAL_FOR_GEAR_HOUSING1']]);
      const part = opExplodeFront1.addPart();
      part.getParameter('Axis').setValue(new Vec3(0, -1, 0));
      part.getOutput().setParam(group.getParameter('GlobalXfo'));
    }
    {
      const group = new KinematicGroup('10X30_HEX_BOLTs');
      group.getParameter('InitialXfoMode').setValue('average');
      asset.addChild(group);
      resolveItems(asset, group, [['.', 'GEAR_HOUSING_ASSM_ASM', 'U-SEAL_FOR_GEAR_HOUSING']]);
      const part = opExplodeFront1.addPart();
      part.getParameter('Axis').setValue(new Vec3(0, -1, 0));
      part.getOutput().setParam(group.getParameter('GlobalXfo'));
    }
    {
      const group = new KinematicGroup('10X30_HEX_BOLTs');
      group.getParameter('InitialXfoMode').setValue('average');
      asset.addChild(group);
      resolveItems(asset, group, [
        ['.', 'GEAR_HOUSING_ASSM_ASM', 'GEAR_SHIFTER_HOUSING'],

        ['.', 'MOTOR_HOUSING'],
      ]);
      const part = opExplodeFront1.addPart();
      part.getParameter('Axis').setValue(new Vec3(0, -1, 0));
      part.getOutput().setParam(group.getParameter('GlobalXfo'));
    }
    {
      const group = new KinematicGroup('10X30_HEX_BOLTs');
      group.getParameter('InitialXfoMode').setValue('average');
      asset.addChild(group);
      resolveItems(asset, group, [
        ['.', 'O-RING_FOR_SHIFTER_SHAFT1'],
        ['.', 'GEAR_HOUSING_ASSM_ASM', 'O-RING_FOR_SHIFTER_HOUSING'],
      ]);
      const part = opExplodeFront1.addPart();
      part.getParameter('Axis').setValue(new Vec3(0, -1, 0));
      part.getOutput().setParam(group.getParameter('GlobalXfo'));
    }
    {
      const group = new KinematicGroup('10X30_HEX_BOLTs');
      group.getParameter('InitialXfoMode').setValue('average');
      asset.addChild(group);
      resolveItems(asset, group, [['.', 'GEAR_SHAFT_ASSM_ASM', 'GEAR_SHAFT_1']]);
      const part = opExplodeFront1.addPart();
      part.getParameter('Axis').setValue(new Vec3(0, -1, 0));
      part.getOutput().setParam(group.getParameter('GlobalXfo'));
    }
    {
      const group = new KinematicGroup('SHIFTER_HOUSING_PLATE');
      group.getParameter('InitialXfoMode').setValue('average');
      asset.addChild(group);
      resolveItems(asset, group, [['.', 'SHIFTER_HOUSING_PLATE']]);
      const part = opExplodeFront1.addPart();
      part.getParameter('Axis').setValue(new Vec3(0, -1, 0));
      part.getOutput().setParam(group.getParameter('GlobalXfo'));
    }
    {
      const group = new KinematicGroup('SHIFTER_HOUSING_PLATE');
      group.getParameter('InitialXfoMode').setValue('average');
      asset.addChild(group);
      resolveItems(asset, group, [
        ['.', 'GASKET_FOR_SHIFTER'],
        ['.', '6210_BALL_BEARING_SKF_ASM'],
      ]);
      const part = opExplodeFront1.addPart();
      part.getParameter('Axis').setValue(new Vec3(0, -1, 0));
      part.getOutput().setParam(group.getParameter('GlobalXfo'));
    }
    {
      const group = new KinematicGroup('SHIFTER_HOUSING_PLATE');
      group.getParameter('InitialXfoMode').setValue('average');
      asset.addChild(group);
      resolveItems(asset, group, [['.', 'GEAR_SHAFT_ASSM_ASM', 'GEAR_SHAFT_2']]);
      const part = opExplodeFront1.addPart();
      part.getParameter('Axis').setValue(new Vec3(0, -1, 0));
      part.getOutput().setParam(group.getParameter('GlobalXfo'));
    }
    {
      const group = new KinematicGroup('10MM_SPRING_WASHER1s');
      group.getParameter('InitialXfoMode').setValue('average');
      asset.addChild(group);
      resolveItems(asset, group, [
        ['.', '10MM_SPRING_WASHER1'],
        ['.', '10MM_SPRING_WASHER2'],
        ['.', '10MM_SPRING_WASHER3'],
        ['.', '10MM_SPRING_WASHER4'],
        ['.', '10MM_SPRING_WASHER5'],
        ['.', '10MM_SPRING_WASHER6'],
        ['.', '10MM_SPRING_WASHER7'],
        ['.', '10MM_SPRING_WASHER8'],
        ['.', '10MM_SPRING_WASHER9'],
        ['.', '10MM_SPRING_WASHER10'],

        ['.', 'U-SEAL_FOR_GEAR_HOUSING'],

        ['.', 'DOVEL_FOR_SHIFTER_HOUSING'],
        ['.', 'DOVEL_FOR_SHIFTER_HOUSING1'],
      ]);
      const part = opExplodeFront1.addPart();
      part.getParameter('Axis').setValue(new Vec3(0, -1, 0));
      part.getOutput().setParam(group.getParameter('GlobalXfo'));
    }

    {
      const group = new KinematicGroup('BODY-2');
      group.getParameter('InitialXfoMode').setValue('average');
      asset.addChild(group);
      resolveItems(asset, group, [
        ['.', 'BUNDH_PLUG_ASSM_ASM1', 'BUNDH_PLUG_FOR_BODY'],
        ['.', 'BUNDH_PLUG_ASSM_ASM', 'BUNDH_PLUG_FOR_BODY'],
        ['.', 'O-RING_FOR_SHIFTER_SHAFT'],
        ['.', 'BUNDH_PLUG_ASSM_ASM', '20_MM_O_RING_FOR_BUNDH_PLUG'],
        ['.', 'BUNDH_PLUG_ASSM_ASM1', '20_MM_O_RING_FOR_BUNDH_PLUG'],
      ]);
      const part = opExplodeFront1.addPart();
      part.getParameter('Axis').setValue(new Vec3(0, -1, 0));
      part.getOutput().setParam(group.getParameter('GlobalXfo'));
    }
    {
      const group = new KinematicGroup('BODY-2');
      group.getParameter('InitialXfoMode').setValue('average');
      asset.addChild(group);
      resolveItems(asset, group, [
        ['.', 'BODY-2'],
        ['.', 'PROPELLER_HOSING_PAKING'],
      ]);
      const part = opExplodeFront1.addPart();
      part.getParameter('Axis').setValue(new Vec3(0, -1, 0));
      part.getOutput().setParam(group.getParameter('GlobalXfo'));
    }
    {
      const group = new KinematicGroup('GEAR_2');
      group.getParameter('InitialXfoMode').setValue('average');
      asset.addChild(group);
      resolveItems(asset, group, [['.', 'GEAR_2']]);
      const part = opExplodeFront1.addPart();
      part.getParameter('Axis').setValue(new Vec3(0, -1, 0));
      part.setStage(part.getStage() + 1);
      part.getOutput().setParam(group.getParameter('GlobalXfo'));
    }

    {
      const group = new KinematicGroup('WASHER_1');
      group.getParameter('InitialXfoMode').setValue('average');
      asset.addChild(group);
      resolveItems(asset, group, [['.', 'WASHER_1']]);
      const part = opExplodeFront1.addPart();
      part.getParameter('Axis').setValue(new Vec3(0, -1, 0));
      part.getOutput().setParam(group.getParameter('GlobalXfo'));
    }
    {
      const group = new KinematicGroup('GASKET_FOR_BODY');
      group.getParameter('InitialXfoMode').setValue('average');
      asset.addChild(group);
      resolveItems(asset, group, [
        ['.', 'GASKET_FOR_BODY'],
        ['.', 'NEEDLE_BEARING_ASSM_ASM'],
      ]);
      const part = opExplodeFront1.addPart();
      part.getParameter('Axis').setValue(new Vec3(0, -1, 0));
      part.getOutput().setParam(group.getParameter('GlobalXfo'));
    }
    {
      const group = new KinematicGroup('GEAR_1');
      group.getParameter('InitialXfoMode').setValue('average');
      asset.addChild(group);
      resolveItems(asset, group, [
        ['.', 'GEAR_1'],
        ['.', 'GEAR_3'],
      ]);
      const part = opExplodeFront1.addPart();
      part.getParameter('Axis').setValue(new Vec3(0, -1, 0));
      part.setStage(part.getStage() + 1);
      part.getOutput().setParam(group.getParameter('GlobalXfo'));
    }
    {
      const group = new KinematicGroup('SHIFTER');
      group.getParameter('InitialXfoMode').setValue('average');
      asset.addChild(group);
      resolveItems(asset, group, [
        ['.', 'GEAR_SHAFT_ASSM_ASM', 'SHIFTER'],
        ['.', 'GEAR_SHAFT_ASSM_ASM', 'DOWEL_PIN'],
        ['.', 'GEAR_SHAFT_ASSM_ASM', 'DOWEL_PIN1'],
      ]);
      const part = opExplodeFront1.addPart();
      part.getParameter('Axis').setValue(new Vec3(0, 0, 2));
      part.getOutput().setParam(group.getParameter('GlobalXfo'));
    }

    ///////////////////////////////////
    //

    // {
    //   const group = new KinematicGroup('8X30_ALLEN_BOLTs');
    //   group.getParameter('InitialXfoMode').setValue('average');
    //   asset.addChild(group);
    //   resolveItems(asset, group, [
    //       [".", "8X30_ALLEN_BOLT"],
    //       [".", "8X30_ALLEN_BOLT1"],
    //       [".", "8X30_ALLEN_BOLT2"],
    //       [".", "8X30_ALLEN_BOLT3"]
    //       ]);
    //   const part = opExplodeFront2.addPart();
    //   part.getParameter("Axis").setValue(new Vec3(0,-1,0))
    //   part.getOutput().setParam(group.getParameter('GlobalXfo'));
    // }
    // {
    //   const group = new KinematicGroup('MOTOR_HOUSING');
    //   group.getParameter('InitialXfoMode').setValue('average');
    //   asset.addChild(group);
    //   resolveItems(asset, group, [
    //       [".", "MOTOR_HOUSING"]
    //       ]);
    //   const part = opExplodeFront2.addPart();
    //   part.getParameter("Axis").setValue(new Vec3(0,-1,0))
    //   part.getOutput().setParam(group.getParameter('GlobalXfo'));
    // }
    // {
    //   const group = new KinematicGroup('FRONT_PROPELLER_HOUSING');
    //   group.getParameter('InitialXfoMode').setValue('average');
    //   asset.addChild(group);
    //   resolveItems(asset, group, [
    //       [".", "6210_BALL_BEARING_SKF_ASM"],
    //       ]);
    //   const part = opExplodeFront2.addPart();
    //   part.getParameter("Axis").setValue(new Vec3(0,-1,0))
    //   part.getOutput().setParam(group.getParameter('GlobalXfo'));
    // }

    ///////////////////////////////////
    //

    {
      const group = new KinematicGroup('STUD_FOR_DIFFERENTIAL_MOUNTINGs');
      group.getParameter('InitialXfoMode').setValue('average');
      asset.addChild(group);
      resolveItems(asset, group, [
        ['.', 'BODY_1_ASSM_ASM', 'STUD_FOR_DIFFERENTIAL_MOUNTING'],
        ['.', 'BODY_1_ASSM_ASM', 'STUD_FOR_DIFFERENTIAL_MOUNTING1'],
        ['.', 'BODY_1_ASSM_ASM', 'STUD_FOR_DIFFERENTIAL_MOUNTING2'],
        ['.', 'BODY_1_ASSM_ASM', 'STUD_FOR_DIFFERENTIAL_MOUNTING3'],
        ['.', 'BODY_1_ASSM_ASM', 'STUD_FOR_DIFFERENTIAL_MOUNTING4'],
        ['.', 'BODY_1_ASSM_ASM', 'STUD_FOR_DIFFERENTIAL_MOUNTING5'],
        ['.', 'BODY_1_ASSM_ASM', 'STUD_FOR_DIFFERENTIAL_MOUNTING6'],
        ['.', 'BODY_1_ASSM_ASM', 'STUD_FOR_DIFFERENTIAL_MOUNTING7'],
      ]);
      const part = opExplodeBack1.addPart();
      part.getParameter('Axis').setValue(new Vec3(0, 1, 0));
      part.getOutput().setParam(group.getParameter('GlobalXfo'));
    }
    {
      const group = new KinematicGroup('BODY_FLANGE');
      group.getParameter('InitialXfoMode').setValue('average');
      asset.addChild(group);
      resolveItems(asset, group, [['.', 'BODY_FLANGE']]);
      const part = opExplodeBack1.addPart();
      part.getParameter('Axis').setValue(new Vec3(0, 1, 0));
      part.getOutput().setParam(group.getParameter('GlobalXfo'));
    }
    {
      const group = new KinematicGroup('BODY_FLANGE_COUPLE');
      group.getParameter('InitialXfoMode').setValue('average');
      asset.addChild(group);
      resolveItems(asset, group, [['.', 'BODY_FLANGE_COUPLE']]);
      const part = opExplodeBack1.addPart();
      part.getParameter('Axis').setValue(new Vec3(0, 1, 0));
      part.getOutput().setParam(group.getParameter('GlobalXfo'));
    }
    {
      const group = new KinematicGroup('BODY_1');
      group.getParameter('InitialXfoMode').setValue('average');
      asset.addChild(group);
      resolveItems(asset, group, [['.', 'BODY_1_ASSM_ASM', 'BODY_1']]);
      const part = opExplodeBack1.addPart();
      part.getParameter('Axis').setValue(new Vec3(0, 1, 0));
      part.getOutput().setParam(group.getParameter('GlobalXfo'));
    }
    {
      const group = new KinematicGroup('BODY_1');
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
      ]);
      const part = opExplodeBack1.addPart();
      part.getParameter('Axis').setValue(new Vec3(0, 1, 0));
      part.getOutput().setParam(group.getParameter('GlobalXfo'));
    }
    {
      const group = new KinematicGroup('GEAR_4');
      group.getParameter('InitialXfoMode').setValue('average');
      asset.addChild(group);
      resolveItems(asset, group, [['.', 'GEAR_4']]);
      const part = opExplodeBack1.addPart();
      part.getParameter('Axis').setValue(new Vec3(0, 1, 0));
      part.getOutput().setParam(group.getParameter('GlobalXfo'));
    }
    {
      const group = new KinematicGroup('GEAR_5');
      group.getParameter('InitialXfoMode').setValue('average');
      asset.addChild(group);
      resolveItems(asset, group, [['.', 'NEEDLE_BEARING_ASSM_ASM1']]);
      const part = opExplodeBack1.addPart();
      part.getParameter('Axis').setValue(new Vec3(0, 1, 0));
      part.getOutput().setParam(group.getParameter('GlobalXfo'));
    }
  });
  // explodedAmountParam.setValue(0.5)
  // explodedAmountParam.setValue(0)

  // labelOpacityParam.setValue(0)
  // const explodedAmountParam = opExplodeFront1.getParameter('Explode')
  // asset.on('loaded', ()=>{
  //   let explodedAmountP = 0;
  //   let animatingValue = false;
  //   let timeoutId;
  //   const timerCallback = () => {
  //       // Check to see if the video has progressed to the next frame.
  //       // If so, then we emit and update, which will cause a redraw.
  //       animatingValue = true;
  //       explodedAmountP += 0.002;
  //       const t = Math.smoothStep(0.0, 1.0, explodedAmountP);
  //       // opExplodeFront1.getParameter('Explode').setValue(explodedAmount);
  //       // opExplodeFront2.getParameter('Explode').setValue(explodedAmount);
  //       // opExplodeBack1.getParameter('Explode').setValue(explodedAmount);
  //       explodedAmountParam.setValue(t);
  //       // renderer.requestRedraw();
  //       if (explodedAmountP < 1.0) {
  //           timeoutId = setTimeout(timerCallback, 20); // Sample at 50fps.
  //       }
  //       animatingValue = false;
  //   };
  //   timeoutId = setTimeout(timerCallback, 1000); // half second delay
  // })
};
export default setupExplode;
