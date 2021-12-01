const { Vec3, CuttingPlane, Xfo } = window.zeaEngine;

import { resolveItems } from './resolveItems.js';

const setupCutaway = (asset) => {
  const cutAwayGroup = new CuttingPlane('cutAwayGroup');
  asset.addChild(cutAwayGroup);

  asset.once('loaded', () => {
    resolveItems(asset, cutAwayGroup, [
      ['.', 'BODY_1_ASSM_ASM', 'BODY_1'],
      ['.', 'BODY-2'],
      ['.', 'GASKET_FOR_BODY'],
      ['.', 'MOTOR_HOUSING'],

      ['.', '10X30_HEX_BOLT'],
      ['.', '10X30_HEX_BOLT1'],
      ['.', '10X30_HEX_BOLT2'],
      ['.', '10X30_HEX_BOLT3'],

      // [".", "PROPELLER_SHAFT_NUT"],
      // [".", "WASHER_FOR_PROPRLLER_HOSING_MTG"],
      // [".", "FRONT_PROPELLER_HOUSING"],

      ['.', 'DOVEL_FOR_SHIFTER_HOUSING'],
      ['.', 'DOVEL_FOR_SHIFTER_HOUSING1'],

      ['.', 'O-RING_FOR_SHIFTER_SHAFT'],
      ['.', 'U-SEAL_FOR_GEAR_HOUSING'],

      ['.', 'PROPELLER_HOUSING_ASSM_ASM', 'PROPELLER_HOUSING'],

      ['.', 'PROPELLER_HOUSING_ASSM_ASM', '60-80-10_OIL_SEAL'],

      // [".", "PROPELLER_HOUSING_ASSM_ASM", "6308_BALL_BEARING_SKF_ASM", "6308_BALL_BEARING_CASE_SKF"],
      // [".", "PROPELLER_HOUSING_ASSM_ASM", "6308_BALL_BEARING_SKF_ASM", "6308_BALL_BEARING_COLLAR_SKF"],
      // [".", "PROPELLER_HOUSING_ASSM_ASM", "6308_BALL_BEARING_SKF_ASM", "6308_BALL_BEARING_BALL_SKF"],
      // [".", "PROPELLER_HOUSING_ASSM_ASM", "6308_BALL_BEARING_SKF_ASM", "6308_BALL_BEARING_BALL_SKF1"],
      // [".", "PROPELLER_HOUSING_ASSM_ASM", "6308_BALL_BEARING_SKF_ASM", "6308_BALL_BEARING_BALL_SKF2"],
      // [".", "PROPELLER_HOUSING_ASSM_ASM", "6308_BALL_BEARING_SKF_ASM", "6308_BALL_BEARING_BALL_SKF3"],
      // [".", "PROPELLER_HOUSING_ASSM_ASM", "6308_BALL_BEARING_SKF_ASM", "6308_BALL_BEARING_BALL_SKF4"],
      // [".", "PROPELLER_HOUSING_ASSM_ASM", "6308_BALL_BEARING_SKF_ASM", "6308_BALL_BEARING_BALL_SKF5"],
      // [".", "PROPELLER_HOUSING_ASSM_ASM", "6308_BALL_BEARING_SKF_ASM", "6308_BALL_BEARING_BALL_SKF6"],
      // [".", "PROPELLER_HOUSING_ASSM_ASM", "6308_BALL_BEARING_SKF_ASM", "6308_BALL_BEARING_BALL_SKF7"],

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

      ['.', '10X45_HEX_BOT'],
      ['.', '10X45_HEX_BOT1'],

      ['.', '10MM_SPRING_WASHER'],
      ['.', '10MM_SPRING_WASHER1'],

      ['.', 'GEAR_HOUSING_ASSM_ASM', 'U-SEAL_FOR_GEAR_HOUSING1'],

      ['.', 'GEAR_HOUSING_ASSM_ASM', 'U-SEAL_FOR_GEAR_HOUSING'],

      ['.', 'GEAR_HOUSING_ASSM_ASM', 'GEAR_SHIFTER_HOUSING'],

      ['.', 'O-RING_FOR_SHIFTER_SHAFT1'],
      ['.', 'GEAR_HOUSING_ASSM_ASM', 'O-RING_FOR_SHIFTER_HOUSING'],

      // [".", "GEAR_SHAFT_ASSM_ASM", "GEAR_SHAFT_1"],

      ['.', 'SHIFTER_HOUSING_PLATE'],

      ['.', 'GASKET_FOR_SHIFTER'],

      // [".", "GEAR_SHAFT_ASSM_ASM", "GEAR_SHAFT_2"],

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

      ['.', 'PROPELLER_HOSING_PAKING'],

      ['.', 'WASHER_1'],

      ['.', 'GASKET_FOR_BODY'],

      ['.', '8X30_ALLEN_BOLT'],
      ['.', '8X30_ALLEN_BOLT1'],
      ['.', '8X30_ALLEN_BOLT2'],
      ['.', '8X30_ALLEN_BOLT3'],

      ['.', 'BODY_1_ASSM_ASM', 'STUD_FOR_DIFFERENTIAL_MOUNTING5'],
      ['.', 'BODY_1_ASSM_ASM', 'STUD_FOR_DIFFERENTIAL_MOUNTING6'],
      ['.', 'BODY_1_ASSM_ASM', 'STUD_FOR_DIFFERENTIAL_MOUNTING7'],
    ]);
  });

  cutAwayGroup.cutAwayEnabledParam.setValue(true);
  cutAwayGroup.visibleParam.setValue(false);
  // cutAwayGroup.getParameter('CutPlaneNormal').setValue(new Vec3(0, 0, 1));
  // cutAwayGroup.getParameter('CutPlaneDist').setValue(-0.17);

  const xfo = new Xfo();
  xfo.tr.z = -0.17;
  xfo.ori.setFromAxisAndAngle(new Vec3(1, 0, 0), Math.PI * -0.5);
  cutAwayGroup.localXfoParam.value = xfo;

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
};
export default setupCutaway;
