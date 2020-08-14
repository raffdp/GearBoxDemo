import {
  Color,
  Xfo,
  Vec3,
  Group,
  NumberParameter,
  RouterOperator,
  Material,
  TreeItem,
  Lines,
  GeomItem,
  Label,
  BillboardItem,
} from '../dist/zea-engine/dist/index.esm.js'
import { ExplodePartsOperator } from '../dist/zea-kinematics/dist/index.rawimport.js'

const setupExplode = (asset) => {
  const opExplodeFront1 = new ExplodePartsOperator('opExplodeFront1')
  asset.addChild(opExplodeFront1)
  opExplodeFront1.getParameter('Dist').setValue(1.6)
  opExplodeFront1.getParameter('Stages').setValue(0)
  opExplodeFront1.getParameter('Cascade').setValue(true)

  const opExplodeBack1 = new ExplodePartsOperator('opExplodeBack1')
  asset.addChild(opExplodeBack1)
  opExplodeBack1.getParameter('Dist').setValue(0.5)
  opExplodeBack1.getParameter('Stages').setValue(8)
  opExplodeBack1.getParameter('Cascade').setValue(true)

  const explodedAmountParam = asset.addParameter(
    new NumberParameter('ExplodeAmount', 0)
  )
  const explodedAmountRouter = asset.addChild(
    new RouterOperator('ExplodeAmountRouter')
  )
  explodedAmountRouter.getInput('Input').setParam(explodedAmountParam)
  explodedAmountRouter
    .addRoute()
    .setParam(opExplodeFront1.getParameter('Explode'))
  explodedAmountRouter
    .addRoute()
    .setParam(opExplodeBack1.getParameter('Explode'))

  const labelOpacityParam = asset.addParameter(
    new NumberParameter('LabelOpacity', 0)
  )
  const labelOpacityRouter = asset.addChild(
    new RouterOperator('LabelOpacityRouter')
  )
  labelOpacityRouter.getInput('Input').setParam(labelOpacityParam)

  const labelTree = new TreeItem('labels')
  const labelOutlineColor = new Color('#3B3B3B')
  const linesMaterial = new Material('LabelLinesMaterial', 'LinesShader')
  linesMaterial.getParameter('BaseColor').setValue(labelOutlineColor)
  labelOpacityRouter.addRoute().setParam(linesMaterial.getParameter('Opacity'))
  // linesMaterial.getParameter('Opacity').setValue(0.0)
  let index = 0

  const labelBackgroundColor = new Color('#EEEEEE')
  asset.addChild(labelTree)
  const addLabel = (pos, basePose, name) => {
    const label = new Label(name)
    // label.getParameter('font').setValue("Arial");
    label.getParameter('FontSize').setValue(48)
    // label.getParameter('fontColor').setValue(labelFontColor);
    label.getParameter('BackgroundColor').setValue(labelBackgroundColor)
    label.getParameter('OutlineColor').setValue(labelOutlineColor)
    label.getParameter('BorderWidth').setValue(3)
    label.getParameter('Margin').setValue(16)

    const billboard = new BillboardItem('billboard' + index, label)
    const xfo = new Xfo(pos)
    billboard.getParameter('LocalXfo').setValue(xfo)
    billboard.getParameter('PixelsPerMeter').setValue(1500)
    billboard.getParameter('AlignedToCamera').setValue(true)
    // billboard.getParameter('Alpha').setValue(0.0);
    labelOpacityRouter.addRoute().setParam(billboard.getParameter('Alpha'))
    labelTree.addChild(billboard)

    const line = new Lines()
    line.setNumVertices(2)
    line.setNumSegments(1)
    line.setSegmentVertexIndices(0, 0, 1)
    line
      .getVertexAttribute('positions')
      .getValueRef(1)
      .setFromOther(basePose.subtract(pos))
    const lineItem = new GeomItem('Line', line, linesMaterial)

    billboard.addChild(lineItem, false)
    index++
  }

  asset.once('loaded', () => {
    addLabel(
      new Vec3(0.08, -1.6, 0.3),
      new Vec3(0.08, -1.6, 0.05),
      'Front Propeller Housing'
    )
    addLabel(
      new Vec3(-0.1, -1.05, 0.3),
      new Vec3(-0.1, -1.05, 0.05),
      'Motor Housing'
    )
    addLabel(
      new Vec3(0.07, -0.035, 0.4),
      new Vec3(0.07, -0.035, 0.25),
      'Shifter'
    )
    addLabel(new Vec3(0.08, -0.15, 0.3), new Vec3(0.08, -0.15, 0.03), 'Gear 1')
    addLabel(new Vec3(0.08, -0.4, 0.3), new Vec3(0.08, -0.4, 0.06), 'Gear 2')
    addLabel(
      new Vec3(-0.08, -0.17, 0.3),
      new Vec3(-0.08, -0.17, 0.06),
      'Gear 3'
    )
    addLabel(new Vec3(0.08, 0.16, 0.3), new Vec3(0.08, 0.16, 0.06), 'Gear 4')

    {
      const group = new Group('mainShaft4Bolts')
      group.getParameter('InitialXfoMode').setValue('average')
      asset.addChild(group)
      group.resolveItems([
        ['.', '10X30_HEX_BOLT'],
        ['.', '10X30_HEX_BOLT_010', '10X30_HEX_BOLT'],
        ['.', '10X30_HEX_BOLT_011', '10X30_HEX_BOLT'],
        ['.', '10X30_HEX_BOLT_012', '10X30_HEX_BOLT'],
      ])
      const part = opExplodeFront1.getParameter('Parts').addElement()
      part.getParameter('Axis').setValue(new Vec3(0, -1, 0))
      part.getOutput().setParam(group.getParameter('GlobalXfo'))
    }
    {
      const group = new Group('nut')
      group.getParameter('InitialXfoMode').setValue('average')
      asset.addChild(group)
      group.resolveItems([['.', 'PROPELLER_SHAFT_NUT']])
      const part = opExplodeFront1.getParameter('Parts').addElement()
      part.getParameter('Axis').setValue(new Vec3(0, -1, 0))
      part.getOutput().setParam(group.getParameter('GlobalXfo'))
    }
    {
      const group = new Group('washer')
      group.getParameter('InitialXfoMode').setValue('average')
      asset.addChild(group)
      group.resolveItems([['.', 'WASHER_FOR_PROPRLLER_HOSING_MTG']])
      const part = opExplodeFront1.getParameter('Parts').addElement()
      part.getParameter('Axis').setValue(new Vec3(0, -1, 0))
      part.getOutput().setParam(group.getParameter('GlobalXfo'))
    }
    {
      const group = new Group('FRONT_PROPELLER_HOUSING')
      group.getParameter('InitialXfoMode').setValue('average')
      asset.addChild(group)
      group.resolveItems([['.', 'FRONT_PROPELLER_HOUSING']])
      const part = opExplodeFront1.getParameter('Parts').addElement()
      part.getParameter('Axis').setValue(new Vec3(0, -1, 0))
      part.getOutput().setParam(group.getParameter('GlobalXfo'))
    }
    {
      const group = new Group('FRONT_PROPELLER_HOUSING')
      group.getParameter('InitialXfoMode').setValue('average')
      asset.addChild(group)
      group.resolveItems([
        ['.', 'PROPELLER_HOUSING_ASSM_ASM', 'PROPELLER_HOUSING'],
      ])
      const part = opExplodeFront1.getParameter('Parts').addElement()
      part.getParameter('Axis').setValue(new Vec3(0, -1, 0))
      part.getOutput().setParam(group.getParameter('GlobalXfo'))
    }
    {
      const group = new Group('FRONT_PROPELLER_HOUSING')
      group.getParameter('InitialXfoMode').setValue('average')
      asset.addChild(group)
      group.resolveItems([
        ['.', 'PROPELLER_HOUSING_ASSM_ASM', '60-80-10_OIL_SEAL'],
      ])
      const part = opExplodeFront1.getParameter('Parts').addElement()
      part.getParameter('Axis').setValue(new Vec3(0, -1, 0))
      part.getOutput().setParam(group.getParameter('GlobalXfo'))
    }

    {
      const group = new Group('FRONT_PROPELLER_HOUSING')
      group.getParameter('InitialXfoMode').setValue('average')
      asset.addChild(group)
      group.resolveItems([
        [
          '.',
          'PROPELLER_HOUSING_ASSM_ASM',
          '6308_BALL_BEARING_SKF_ASM',
          '6308_BALL_BEARING_CASE_SKF',
        ],
        [
          '.',
          'PROPELLER_HOUSING_ASSM_ASM',
          '6308_BALL_BEARING_SKF_ASM',
          '6308_BALL_BEARING_COLLAR_SKF',
        ],
        [
          '.',
          'PROPELLER_HOUSING_ASSM_ASM',
          '6308_BALL_BEARING_SKF_ASM',
          '6308_BALL_BEARING_BALL_SKF',
        ],
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
      ])
      const part = opExplodeFront1.getParameter('Parts').addElement()
      part.getParameter('Axis').setValue(new Vec3(0, -1, 0))
      part.getOutput().setParam(group.getParameter('GlobalXfo'))
    }

    {
      const group = new Group('10X30_HEX_BOLTs')
      group.getParameter('InitialXfoMode').setValue('average')
      asset.addChild(group)
      group.resolveItems([
        ['.', '10X30_HEX_BOLT_051'],
        ['.', '10X30_HEX_BOLT_052'],
        ['.', '10X30_HEX_BOLT_053'],
        ['.', '10X30_HEX_BOLT_054'],
        ['.', '10X30_HEX_BOLT_055'],
        ['.', '10X30_HEX_BOLT_056'],
        ['.', '10X30_HEX_BOLT_057'],
        ['.', '10X30_HEX_BOLT_058'],
        ['.', '10X30_HEX_BOLT_059'],
        ['.', '10X30_HEX_BOLT_060'],

        ['.', '8X30_ALLEN_BOLT'],
        ['.', '8X30_ALLEN_BOLT_004', '8X30_ALLEN_BOLT'],
        ['.', '8X30_ALLEN_BOLT_005', '8X30_ALLEN_BOLT'],
        ['.', '8X30_ALLEN_BOLT_006', '8X30_ALLEN_BOLT'],
      ])
      const part = opExplodeFront1.getParameter('Parts').addElement()
      part.getParameter('Axis').setValue(new Vec3(0, -1, 0))
      part.getOutput().setParam(group.getParameter('GlobalXfo'))
    }
    {
      const group = new Group('10X30_HEX_BOLTs')
      group.getParameter('InitialXfoMode').setValue('average')
      asset.addChild(group)
      group.resolveItems([
        ['.', '10X45_HEX_BOT'],
        ['.', '10X45_HEX_BOT_037', '10X45_HEX_BOT'],
      ])
      const part = opExplodeFront1.getParameter('Parts').addElement()
      part.getParameter('Axis').setValue(new Vec3(0, -1, 0))
      part.getOutput().setParam(group.getParameter('GlobalXfo'))
    }
    {
      const group = new Group('10X30_HEX_BOLTs')
      group.getParameter('InitialXfoMode').setValue('average')
      asset.addChild(group)
      group.resolveItems([
        ['.', '10MM_SPRING_WASHER'],
        ['.', '10MM_SPRING_WASHER_035', '10MM_SPRING_WASHER'],
      ])
      const part = opExplodeFront1.getParameter('Parts').addElement()
      part.getParameter('Axis').setValue(new Vec3(0, -1, 0))
      part.getOutput().setParam(group.getParameter('GlobalXfo'))
    }
    {
      const group = new Group('10X30_HEX_BOLTs')
      group.getParameter('InitialXfoMode').setValue('average')
      asset.addChild(group)
      group.resolveItems([
        [
          '.',
          'GEAR_HOUSING_ASSM_ASM',
          'U-SEAL_FOR_GEAR_HOUSING_003',
          'U-SEAL_FOR_GEAR_HOUSING',
        ],
      ])
      const part = opExplodeFront1.getParameter('Parts').addElement()
      part.getParameter('Axis').setValue(new Vec3(0, -1, 0))
      part.getOutput().setParam(group.getParameter('GlobalXfo'))
    }
    {
      const group = new Group('10X30_HEX_BOLTs')
      group.getParameter('InitialXfoMode').setValue('average')
      asset.addChild(group)
      group.resolveItems([
        [
          '.',
          'GEAR_HOUSING_ASSM_ASM',
          'U-SEAL_FOR_GEAR_HOUSING',
          'U-SEAL_FOR_GEAR_HOUSING',
        ],
      ])
      const part = opExplodeFront1.getParameter('Parts').addElement()
      part.getParameter('Axis').setValue(new Vec3(0, -1, 0))
      part.getOutput().setParam(group.getParameter('GlobalXfo'))
    }
    {
      const group = new Group('10X30_HEX_BOLTs')
      group.getParameter('InitialXfoMode').setValue('average')
      asset.addChild(group)
      group.resolveItems([
        [
          '.',
          'GEAR_HOUSING_ASSM_ASM',
          'GEAR_SHIFTER_HOUSING',
          'MANIFOLD_SOLID_BREP #281226',
        ],
        [
          '.',
          'GEAR_HOUSING_ASSM_ASM',
          'GEAR_SHIFTER_HOUSING',
          'OPEN_SHELL #281225',
        ],
        [
          '.',
          'GEAR_HOUSING_ASSM_ASM',
          'GEAR_SHIFTER_HOUSING',
          'OPEN_SHELL #281127',
        ],

        ['.', 'MOTOR_HOUSING'],
      ])
      const part = opExplodeFront1.getParameter('Parts').addElement()
      part.getParameter('Axis').setValue(new Vec3(0, -1, 0))
      part.getOutput().setParam(group.getParameter('GlobalXfo'))
    }
    {
      const group = new Group('10X30_HEX_BOLTs')
      group.getParameter('InitialXfoMode').setValue('average')
      asset.addChild(group)
      group.resolveItems([
        ['.', 'O-RING_FOR_SHIFTER_SHAFT_032', 'O-RING_FOR_SHIFTER_SHAFT'],
        ['.', 'GEAR_HOUSING_ASSM_ASM', 'O-RING_FOR_SHIFTER_HOUSING'],
      ])
      const part = opExplodeFront1.getParameter('Parts').addElement()
      part.getParameter('Axis').setValue(new Vec3(0, -1, 0))
      part.getOutput().setParam(group.getParameter('GlobalXfo'))
    }
    {
      const group = new Group('10X30_HEX_BOLTs')
      group.getParameter('InitialXfoMode').setValue('average')
      asset.addChild(group)
      group.resolveItems([['.', 'GEAR_SHAFT_ASSM_ASM', 'GEAR_SHAFT_1']])
      const part = opExplodeFront1.getParameter('Parts').addElement()
      part.getParameter('Axis').setValue(new Vec3(0, -1, 0))
      part.getOutput().setParam(group.getParameter('GlobalXfo'))
    }
    {
      const group = new Group('SHIFTER_HOUSING_PLATE')
      group.getParameter('InitialXfoMode').setValue('average')
      asset.addChild(group)
      group.resolveItems([['.', 'SHIFTER_HOUSING_PLATE']])
      const part = opExplodeFront1.getParameter('Parts').addElement()
      part.getParameter('Axis').setValue(new Vec3(0, -1, 0))
      part.getOutput().setParam(group.getParameter('GlobalXfo'))
    }
    {
      const group = new Group('SHIFTER_HOUSING_PLATE')
      group.getParameter('InitialXfoMode').setValue('average')
      asset.addChild(group)
      group.resolveItems([
        ['.', 'GASKET_FOR_SHIFTER'],
        ['.', '6210_BALL_BEARING_SKF_ASM'],
      ])
      const part = opExplodeFront1.getParameter('Parts').addElement()
      part.getParameter('Axis').setValue(new Vec3(0, -1, 0))
      part.getOutput().setParam(group.getParameter('GlobalXfo'))
    }
    {
      const group = new Group('SHIFTER_HOUSING_PLATE')
      group.getParameter('InitialXfoMode').setValue('average')
      asset.addChild(group)
      group.resolveItems([['.', 'GEAR_SHAFT_ASSM_ASM', 'GEAR_SHAFT_2']])
      const part = opExplodeFront1.getParameter('Parts').addElement()
      part.getParameter('Axis').setValue(new Vec3(0, -1, 0))
      part.getOutput().setParam(group.getParameter('GlobalXfo'))
    }
    {
      const group = new Group('10MM_SPRING_WASHER_041s')
      group.getParameter('InitialXfoMode').setValue('average')
      asset.addChild(group)
      group.resolveItems([
        ['.', '10MM_SPRING_WASHER_041'],
        ['.', '10MM_SPRING_WASHER_042'],
        ['.', '10MM_SPRING_WASHER_043'],
        ['.', '10MM_SPRING_WASHER_044'],
        ['.', '10MM_SPRING_WASHER_045'],
        ['.', '10MM_SPRING_WASHER_046'],
        ['.', '10MM_SPRING_WASHER_047'],
        ['.', '10MM_SPRING_WASHER_048'],
        ['.', '10MM_SPRING_WASHER_049'],
        ['.', '10MM_SPRING_WASHER_050'],

        ['.', 'U-SEAL_FOR_GEAR_HOUSING'],

        ['.', 'DOVEL_FOR_SHIFTER_HOUSING'],
        ['.', 'DOVEL_FOR_SHIFTER_HOUSING_029', 'DOVEL_FOR_SHIFTER_HOUSING'],
      ])
      const part = opExplodeFront1.getParameter('Parts').addElement()
      part.getParameter('Axis').setValue(new Vec3(0, -1, 0))
      part.getOutput().setParam(group.getParameter('GlobalXfo'))
    }

    {
      const group = new Group('BODY-2')
      group.getParameter('InitialXfoMode').setValue('average')
      asset.addChild(group)
      group.resolveItems([
        ['.', 'BUNDH_PLUG_ASSM_ASM_062', 'BUNDH_PLUG_FOR_BODY'],
        ['.', 'BUNDH_PLUG_ASSM_ASM', 'BUNDH_PLUG_FOR_BODY'],
        ['.', 'O-RING_FOR_SHIFTER_SHAFT'],
        ['.', 'BUNDH_PLUG_ASSM_ASM', '20_MM_O_RING_FOR_BUNDH_PLUG'],
        ['.', 'BUNDH_PLUG_ASSM_ASM_062', '20_MM_O_RING_FOR_BUNDH_PLUG'],
      ])
      const part = opExplodeFront1.getParameter('Parts').addElement()
      part.getParameter('Axis').setValue(new Vec3(0, -1, 0))
      part.getOutput().setParam(group.getParameter('GlobalXfo'))
    }
    {
      const group = new Group('BODY-2')
      group.getParameter('InitialXfoMode').setValue('average')
      asset.addChild(group)
      group.resolveItems([
        ['.', 'BODY-2'],
        ['.', 'PROPELLER_HOSING_PAKING'],
      ])
      const part = opExplodeFront1.getParameter('Parts').addElement()
      part.getParameter('Axis').setValue(new Vec3(0, -1, 0))
      part.getOutput().setParam(group.getParameter('GlobalXfo'))
    }
    {
      const group = new Group('GEAR_2')
      group.getParameter('InitialXfoMode').setValue('average')
      asset.addChild(group)
      group.resolveItems([['.', 'GEAR_2']])
      const part = opExplodeFront1.getParameter('Parts').addElement()
      part.getParameter('Axis').setValue(new Vec3(0, -1, 0))
      part.setStage(part.getStage() + 1)
      part.getOutput().setParam(group.getParameter('GlobalXfo'))
    }

    {
      const group = new Group('WASHER_1')
      group.getParameter('InitialXfoMode').setValue('average')
      asset.addChild(group)
      group.resolveItems([['.', 'WASHER_1']])
      const part = opExplodeFront1.getParameter('Parts').addElement()
      part.getParameter('Axis').setValue(new Vec3(0, -1, 0))
      part.getOutput().setParam(group.getParameter('GlobalXfo'))
    }
    {
      const group = new Group('GASKET_FOR_BODY')
      group.getParameter('InitialXfoMode').setValue('average')
      asset.addChild(group)
      group.resolveItems([
        ['.', 'GASKET_FOR_BODY'],
        ['.', 'NEEDLE_BEARING_ASSM_ASM'],
      ])
      const part = opExplodeFront1.getParameter('Parts').addElement()
      part.getParameter('Axis').setValue(new Vec3(0, -1, 0))
      part.getOutput().setParam(group.getParameter('GlobalXfo'))
    }
    {
      const group = new Group('GEAR_1')
      group.getParameter('InitialXfoMode').setValue('average')
      asset.addChild(group)
      group.resolveItems([
        ['.', 'GEAR_1'],
        ['.', 'GEAR_3'],
      ])
      const part = opExplodeFront1.getParameter('Parts').addElement()
      part.getParameter('Axis').setValue(new Vec3(0, -1, 0))
      part.setStage(part.getStage() + 1)
      part.getOutput().setParam(group.getParameter('GlobalXfo'))
    }
    {
      const group = new Group('SHIFTER')
      group.getParameter('InitialXfoMode').setValue('average')
      asset.addChild(group)
      group.resolveItems([
        ['.', 'GEAR_SHAFT_ASSM_ASM', 'SHIFTER'],
        ['.', 'GEAR_SHAFT_ASSM_ASM', 'DOWEL_PIN'],
        ['.', 'GEAR_SHAFT_ASSM_ASM', 'DOWEL_PIN_005', 'DOWEL_PIN'],
      ])
      const part = opExplodeFront1.getParameter('Parts').addElement()
      part.getParameter('Axis').setValue(new Vec3(0, 0, 2))
      part.getOutput().setParam(group.getParameter('GlobalXfo'))
    }

    ///////////////////////////////////
    //

    // {
    //   const group = new Group('8X30_ALLEN_BOLTs');
    //   group.getParameter('InitialXfoMode').setValue('average');
    //   asset.addChild(group);
    //   group.resolveItems([
    //       [".", "8X30_ALLEN_BOLT"],
    //       [".", "8X30_ALLEN_BOLT_004", "8X30_ALLEN_BOLT"],
    //       [".", "8X30_ALLEN_BOLT_005", "8X30_ALLEN_BOLT"],
    //       [".", "8X30_ALLEN_BOLT_006", "8X30_ALLEN_BOLT"]
    //       ]);
    //   const part = opExplodeFront2.getParameter('Parts').addElement();
    //   part.getParameter("Axis").setValue(new Vec3(0,-1,0))
    //   part.getOutput().setParam(group.getParameter('GlobalXfo'));
    // }
    // {
    //   const group = new Group('MOTOR_HOUSING');
    //   group.getParameter('InitialXfoMode').setValue('average');
    //   asset.addChild(group);
    //   group.resolveItems([
    //       [".", "MOTOR_HOUSING"]
    //       ]);
    //   const part = opExplodeFront2.getParameter('Parts').addElement();
    //   part.getParameter("Axis").setValue(new Vec3(0,-1,0))
    //   part.getOutput().setParam(group.getParameter('GlobalXfo'));
    // }
    // {
    //   const group = new Group('FRONT_PROPELLER_HOUSING');
    //   group.getParameter('InitialXfoMode').setValue('average');
    //   asset.addChild(group);
    //   group.resolveItems([
    //       [".", "6210_BALL_BEARING_SKF_ASM"],
    //       ]);
    //   const part = opExplodeFront2.getParameter('Parts').addElement();
    //   part.getParameter("Axis").setValue(new Vec3(0,-1,0))
    //   part.getOutput().setParam(group.getParameter('GlobalXfo'));
    // }

    ///////////////////////////////////
    //

    {
      const group = new Group('STUD_FOR_DIFFERENTIAL_MOUNTINGs')
      group.getParameter('InitialXfoMode').setValue('average')
      asset.addChild(group)
      group.resolveItems([
        ['.', 'BODY_1_ASSM_ASM', 'STUD_FOR_DIFFERENTIAL_MOUNTING'],
        [
          '.',
          'BODY_1_ASSM_ASM',
          'STUD_FOR_DIFFERENTIAL_MOUNTING_004',
          'STUD_FOR_DIFFERENTIAL_MOUNTING',
        ],
        [
          '.',
          'BODY_1_ASSM_ASM',
          'STUD_FOR_DIFFERENTIAL_MOUNTING_005',
          'STUD_FOR_DIFFERENTIAL_MOUNTING',
        ],
        [
          '.',
          'BODY_1_ASSM_ASM',
          'STUD_FOR_DIFFERENTIAL_MOUNTING_006',
          'STUD_FOR_DIFFERENTIAL_MOUNTING',
        ],
        [
          '.',
          'BODY_1_ASSM_ASM',
          'STUD_FOR_DIFFERENTIAL_MOUNTING_007',
          'STUD_FOR_DIFFERENTIAL_MOUNTING',
        ],
        [
          '.',
          'BODY_1_ASSM_ASM',
          'STUD_FOR_DIFFERENTIAL_MOUNTING_008',
          'STUD_FOR_DIFFERENTIAL_MOUNTING',
        ],
        [
          '.',
          'BODY_1_ASSM_ASM',
          'STUD_FOR_DIFFERENTIAL_MOUNTING_009',
          'STUD_FOR_DIFFERENTIAL_MOUNTING',
        ],
        [
          '.',
          'BODY_1_ASSM_ASM',
          'STUD_FOR_DIFFERENTIAL_MOUNTING_010',
          'STUD_FOR_DIFFERENTIAL_MOUNTING',
        ],
      ])
      const part = opExplodeBack1.getParameter('Parts').addElement()
      part.getParameter('Axis').setValue(new Vec3(0, 1, 0))
      part.getOutput().setParam(group.getParameter('GlobalXfo'))
    }
    {
      const group = new Group('BODY_FLANGE')
      group.getParameter('InitialXfoMode').setValue('average')
      asset.addChild(group)
      group.resolveItems([['.', 'BODY_FLANGE']])
      const part = opExplodeBack1.getParameter('Parts').addElement()
      part.getParameter('Axis').setValue(new Vec3(0, 1, 0))
      part.getOutput().setParam(group.getParameter('GlobalXfo'))
    }
    {
      const group = new Group('BODY_FLANGE_COUPLE')
      group.getParameter('InitialXfoMode').setValue('average')
      asset.addChild(group)
      group.resolveItems([['.', 'BODY_FLANGE_COUPLE']])
      const part = opExplodeBack1.getParameter('Parts').addElement()
      part.getParameter('Axis').setValue(new Vec3(0, 1, 0))
      part.getOutput().setParam(group.getParameter('GlobalXfo'))
    }
    {
      const group = new Group('BODY_1')
      group.getParameter('InitialXfoMode').setValue('average')
      asset.addChild(group)
      group.resolveItems([['.', 'BODY_1_ASSM_ASM', 'BODY_1']])
      const part = opExplodeBack1.getParameter('Parts').addElement()
      part.getParameter('Axis').setValue(new Vec3(0, 1, 0))
      part.getOutput().setParam(group.getParameter('GlobalXfo'))
    }
    {
      const group = new Group('BODY_1')
      group.getParameter('InitialXfoMode').setValue('average')
      asset.addChild(group)
      group.resolveItems([
        [
          '.',
          'BODY_1_ASSM_ASM',
          'SKF_6209_CE_BEARING_ASM',
          'SKF_6209-C3_COLLAR',
        ],
        [
          '.',
          'BODY_1_ASSM_ASM',
          'SKF_6209_CE_BEARING_ASM',
          'SKF_6209-C3_INNERFACE_',
        ],
        ['.', 'BODY_1_ASSM_ASM', 'SKF_6209_CE_BEARING_ASM', 'SKF_6209-C3_BALL'],
        [
          '.',
          'BODY_1_ASSM_ASM',
          'SKF_6209_CE_BEARING_ASM',
          'SKF_6209-C3_BALL_004',
          'SKF_6209-C3_BALL',
        ],
        [
          '.',
          'BODY_1_ASSM_ASM',
          'SKF_6209_CE_BEARING_ASM',
          'SKF_6209-C3_BALL_005',
          'SKF_6209-C3_BALL',
        ],
        [
          '.',
          'BODY_1_ASSM_ASM',
          'SKF_6209_CE_BEARING_ASM',
          'SKF_6209-C3_BALL_006',
          'SKF_6209-C3_BALL',
        ],
        [
          '.',
          'BODY_1_ASSM_ASM',
          'SKF_6209_CE_BEARING_ASM',
          'SKF_6209-C3_BALL_007',
          'SKF_6209-C3_BALL',
        ],
        [
          '.',
          'BODY_1_ASSM_ASM',
          'SKF_6209_CE_BEARING_ASM',
          'SKF_6209-C3_BALL_008',
          'SKF_6209-C3_BALL',
        ],
        [
          '.',
          'BODY_1_ASSM_ASM',
          'SKF_6209_CE_BEARING_ASM',
          'SKF_6209-C3_BALL_009',
          'SKF_6209-C3_BALL',
        ],
        [
          '.',
          'BODY_1_ASSM_ASM',
          'SKF_6209_CE_BEARING_ASM',
          'SKF_6209-C3_BALL_010',
          'SKF_6209-C3_BALL',
        ],
        [
          '.',
          'BODY_1_ASSM_ASM',
          'SKF_6209_CE_BEARING_ASM',
          'SKF_6209-C3_BALL_011',
          'SKF_6209-C3_BALL',
        ],
        [
          '.',
          'BODY_1_ASSM_ASM',
          'SKF_6209_CE_BEARING_ASM',
          'SKF_6209-C3_BALL_012',
          'SKF_6209-C3_BALL',
        ],
      ])
      const part = opExplodeBack1.getParameter('Parts').addElement()
      part.getParameter('Axis').setValue(new Vec3(0, 1, 0))
      part.getOutput().setParam(group.getParameter('GlobalXfo'))
    }
    {
      const group = new Group('GEAR_4')
      group.getParameter('InitialXfoMode').setValue('average')
      asset.addChild(group)
      group.resolveItems([['.', 'GEAR_4']])
      const part = opExplodeBack1.getParameter('Parts').addElement()
      part.getParameter('Axis').setValue(new Vec3(0, 1, 0))
      part.getOutput().setParam(group.getParameter('GlobalXfo'))
    }
    {
      const group = new Group('GEAR_5')
      group.getParameter('InitialXfoMode').setValue('average')
      asset.addChild(group)
      group.resolveItems([['.', 'NEEDLE_BEARING_ASSM_ASM_020']])
      const part = opExplodeBack1.getParameter('Parts').addElement()
      part.getParameter('Axis').setValue(new Vec3(0, 1, 0))
      part.getOutput().setParam(group.getParameter('GlobalXfo'))
    }
  })
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
}
export default setupExplode
