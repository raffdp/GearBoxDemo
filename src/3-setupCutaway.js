import {
  Vec3,
  Group,
} from 'https://unpkg.com/@zeainc/zea-engine/dist/index.esm.js'
const setupCutaway = (asset) => {
  const cutAwayGroup = new Group('cutAwayGroup')
  asset.addChild(cutAwayGroup)

  asset.once('loaded', () => {
    cutAwayGroup.resolveItems([
      ['.', 'BODY_1_ASSM_ASM', 'BODY_1'],
      ['.', 'BODY-2'],
      ['.', 'GASKET_FOR_BODY'],
      ['.', 'MOTOR_HOUSING'],

      ['.', '10X30_HEX_BOLT'],
      ['.', '10X30_HEX_BOLT_010', '10X30_HEX_BOLT'],
      ['.', '10X30_HEX_BOLT_011', '10X30_HEX_BOLT'],
      ['.', '10X30_HEX_BOLT_012', '10X30_HEX_BOLT'],

      // [".", "PROPELLER_SHAFT_NUT"],
      // [".", "WASHER_FOR_PROPRLLER_HOSING_MTG"],
      // [".", "FRONT_PROPELLER_HOUSING"],

      ['.', 'DOVEL_FOR_SHIFTER_HOUSING'],
      ['.', 'DOVEL_FOR_SHIFTER_HOUSING_029', 'DOVEL_FOR_SHIFTER_HOUSING'],

      ['.', 'O-RING_FOR_SHIFTER_SHAFT'],
      ['.', 'U-SEAL_FOR_GEAR_HOUSING'],

      ['.', 'PROPELLER_HOUSING_ASSM_ASM', 'PROPELLER_HOUSING'],

      ['.', 'PROPELLER_HOUSING_ASSM_ASM', '60-80-10_OIL_SEAL'],

      // [".", "PROPELLER_HOUSING_ASSM_ASM", "6308_BALL_BEARING_SKF_ASM", "6308_BALL_BEARING_CASE_SKF"],
      // [".", "PROPELLER_HOUSING_ASSM_ASM", "6308_BALL_BEARING_SKF_ASM", "6308_BALL_BEARING_COLLAR_SKF"],
      // [".", "PROPELLER_HOUSING_ASSM_ASM", "6308_BALL_BEARING_SKF_ASM", "6308_BALL_BEARING_BALL_SKF"],
      // [".", "PROPELLER_HOUSING_ASSM_ASM", "6308_BALL_BEARING_SKF_ASM", "6308_BALL_BEARING_BALL_SKF_004", "6308_BALL_BEARING_BALL_SKF"],
      // [".", "PROPELLER_HOUSING_ASSM_ASM", "6308_BALL_BEARING_SKF_ASM", "6308_BALL_BEARING_BALL_SKF_005", "6308_BALL_BEARING_BALL_SKF"],
      // [".", "PROPELLER_HOUSING_ASSM_ASM", "6308_BALL_BEARING_SKF_ASM", "6308_BALL_BEARING_BALL_SKF_006", "6308_BALL_BEARING_BALL_SKF"],
      // [".", "PROPELLER_HOUSING_ASSM_ASM", "6308_BALL_BEARING_SKF_ASM", "6308_BALL_BEARING_BALL_SKF_007", "6308_BALL_BEARING_BALL_SKF"],
      // [".", "PROPELLER_HOUSING_ASSM_ASM", "6308_BALL_BEARING_SKF_ASM", "6308_BALL_BEARING_BALL_SKF_008", "6308_BALL_BEARING_BALL_SKF"],
      // [".", "PROPELLER_HOUSING_ASSM_ASM", "6308_BALL_BEARING_SKF_ASM", "6308_BALL_BEARING_BALL_SKF_009", "6308_BALL_BEARING_BALL_SKF"],
      // [".", "PROPELLER_HOUSING_ASSM_ASM", "6308_BALL_BEARING_SKF_ASM", "6308_BALL_BEARING_BALL_SKF_010", "6308_BALL_BEARING_BALL_SKF"],

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

      ['.', '10X45_HEX_BOT'],
      ['.', '10X45_HEX_BOT_037', '10X45_HEX_BOT'],

      ['.', '10MM_SPRING_WASHER'],
      ['.', '10MM_SPRING_WASHER_035', '10MM_SPRING_WASHER'],

      [
        '.',
        'GEAR_HOUSING_ASSM_ASM',
        'U-SEAL_FOR_GEAR_HOUSING_003',
        'U-SEAL_FOR_GEAR_HOUSING',
      ],

      [
        '.',
        'GEAR_HOUSING_ASSM_ASM',
        'U-SEAL_FOR_GEAR_HOUSING',
        'U-SEAL_FOR_GEAR_HOUSING',
      ],

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

      ['.', 'O-RING_FOR_SHIFTER_SHAFT_032', 'O-RING_FOR_SHIFTER_SHAFT'],
      ['.', 'GEAR_HOUSING_ASSM_ASM', 'O-RING_FOR_SHIFTER_HOUSING'],

      // [".", "GEAR_SHAFT_ASSM_ASM", "GEAR_SHAFT_1"],

      ['.', 'SHIFTER_HOUSING_PLATE'],

      ['.', 'GASKET_FOR_SHIFTER'],

      // [".", "GEAR_SHAFT_ASSM_ASM", "GEAR_SHAFT_2"],

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

      ['.', 'PROPELLER_HOSING_PAKING'],

      ['.', 'WASHER_1'],

      ['.', 'GASKET_FOR_BODY'],

      ['.', '8X30_ALLEN_BOLT'],
      ['.', '8X30_ALLEN_BOLT_004', '8X30_ALLEN_BOLT'],
      ['.', '8X30_ALLEN_BOLT_005', '8X30_ALLEN_BOLT'],
      ['.', '8X30_ALLEN_BOLT_006', '8X30_ALLEN_BOLT'],

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
  })

  cutAwayGroup.getParameter('CutAwayEnabled').setValue(true)
  cutAwayGroup.getParameter('CutPlaneNormal').setValue(new Vec3(0, 0, 1))
  // cutAwayGroup.getParameter('CutPlaneDist').setValue(0)
  cutAwayGroup.getParameter('CutPlaneDist').setValue(-0.17)

  // asset.once('loaded', ()=>{
  //   let cutAmount = -0.17;
  //   let animatingValue = false;
  //   let timeoutId;
  //   cutAwayGroup.getParameter('CutPlaneDist').setValue(cutAmount)
  //   const timerCallback = () => {
  //     console.log(cutAmount)
  //     // Check to see if the video has progressed to the next frame.
  //     // If so, then we emit and update, which will cause a redraw.
  //     animatingValue = true;
  //     cutAmount += 0.002;
  //     cutAwayGroup.getParameter('CutPlaneDist').setValue(cutAmount)
  //     if (cutAmount < 0.0) {
  //         timeoutId = setTimeout(timerCallback, 20); // Sample at 50fps.
  //     }
  //     animatingValue = false;
  //   };
  //   timeoutId = setTimeout(timerCallback, 200); // half second delay
  // })
}
export default setupCutaway
