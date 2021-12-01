const { Color, Group, Material, MaterialGroup, EnvMap } = window.zeaEngine;

import { resolveItems } from './resolveItems.js';

const modifyParams = (material, params, shaderName) => {
  material.setShaderName(shaderName);
  for (let key in params) {
    const param = material.getParameter(key);
    param.value = params[key];
  }
};

const setupMaterials = (asset, scene) => {
  const setRenderingMode = (mode) => {
    if (mode == 0) {
      {
        const material = casingMetalGroup.getParameter('Material').getValue();
        modifyParams(
          material,
          {
            BaseColor: new Color(0.55, 0.05, 0.05),
            Metallic: 0.75,
            Roughness: 0.35,
            Reflectance: 0.8,
            EmissiveStrength: 0.0,
          },
          'StandardSurfaceShader'
        );
      }
      {
        const material = blackMetalGroup.getParameter('Material').getValue();
        modifyParams(
          material,
          {
            BaseColor: new Color(0.1, 0.1, 0.1),
            Metallic: 0.85,
            Roughness: 0.35,
            Reflectance: 0.7,
            EmissiveStrength: 0.0,
          },
          'StandardSurfaceShader'
        );
      }
      {
        const material = blackRubberGroup.getParameter('Material').getValue();
        modifyParams(
          material,
          {
            BaseColor: new Color(0.01, 0.01, 0.01),
            Metallic: 0.0,
            Roughness: 0.85,
            Reflectance: 0.01,
            EmissiveStrength: 0.0,
          },
          'StandardSurfaceShader'
        );
      }
      {
        const material = orangeRubberGroup.getParameter('Material').getValue();
        modifyParams(
          material,
          {
            BaseColor: new Color(0.01, 0.01, 0.01),
            Metallic: 0.0,
            Roughness: 0.85,
            Reflectance: 0.01,
            EmissiveStrength: 0.0,
          },
          'StandardSurfaceShader'
        );
      }
      {
        const material = shinyMetalGroup.getParameter('Material').getValue();
        modifyParams(
          material,
          {
            BaseColor: new Color(0.65, 0.65, 0.65),
            Metallic: 0.95,
            Roughness: 0.25,
            Reflectance: 0.95,
            EmissiveStrength: 0.0,
          },
          'StandardSurfaceShader'
        );
      }
      {
        const material = goldMetalGroup.getParameter('Material').getValue();
        modifyParams(
          material,
          {
            BaseColor: new Color('#d4af37'),
            Metallic: 0.99,
            Roughness: 0.15,
            Reflectance: 0.95,
            EmissiveStrength: 0.0,
          },
          'StandardSurfaceShader'
        );
      }
    } else if (mode == 1) {
      // scene.getSettings().getParameter('EnvMap').setValue(null);
      const EmissiveStrength = 0.9;
      const Roughness = 1.0;
      const Reflectance = 0.0;
      {
        const material = casingMetalGroup.getParameter('Material').getValue();
        modifyParams(
          material,
          {
            BaseColor: new Color(0.85, 0.55, 0.55),
            Metallic: 0.75,
            Roughness,
            Reflectance,
            EmissiveStrength,
          },
          'StandardSurfaceShader'
        );
      }
      {
        const material = blackMetalGroup.getParameter('Material').getValue();
        modifyParams(
          material,
          {
            BaseColor: new Color(0.4, 0.4, 0.4),
            Metallic: 0.85,
            Roughness,
            Reflectance,
            EmissiveStrength,
          },
          'StandardSurfaceShader'
        );
      }
      {
        const material = blackRubberGroup.getParameter('Material').getValue();
        modifyParams(
          material,
          {
            BaseColor: new Color(0.2, 0.2, 0.2),
            Metallic: 0.0,
            Roughness,
            Reflectance,
            EmissiveStrength,
          },
          'StandardSurfaceShader'
        );
      }
      {
        const material = orangeRubberGroup.getParameter('Material').getValue();
        modifyParams(
          material,
          {
            BaseColor: new Color(0.2, 0.2, 0.2),
            Metallic: 0.0,
            Roughness,
            Reflectance,
            EmissiveStrength,
          },
          'StandardSurfaceShader'
        );
      }
      {
        const material = shinyMetalGroup.getParameter('Material').getValue();
        modifyParams(
          material,
          {
            BaseColor: new Color(0.65, 0.65, 0.65),
            Metallic: 0.95,
            Roughness,
            Reflectance,
            EmissiveStrength: 0.9,
          },
          'StandardSurfaceShader'
        );
      }
      {
        const material = goldMetalGroup.getParameter('Material').getValue();
        modifyParams(
          material,
          {
            BaseColor: new Color('#d4af37'),
            Metallic: 0.99,
            Roughness,
            Reflectance,
            EmissiveStrength: 0.9,
          },
          'StandardSurfaceShader'
        );
      }
    }
  };

  const casingMetalGroup = new MaterialGroup('casingMetalGroup');
  {
    const material = new Material('casingMetal');
    casingMetalGroup.getParameter('Material').setValue(material);
    asset.addChild(casingMetalGroup);
  }

  const blackMetalGroup = new MaterialGroup('blackMetalGroup');
  {
    const material = new Material('blackMetal');
    blackMetalGroup.getParameter('Material').setValue(material);
    asset.addChild(blackMetalGroup);
  }

  // const blackPlasticGroup = new Group('blackPlasticGroup');
  // {
  //   const material = new Material('blackPlastic');
  //   modifyParams(material,{
  //     // BaseColor: new Color(0.01, 0.01, .01),
  //     BaseColor: new Color(0.2, 0.2, 0.2),
  //     Metallic: 0.0,
  //     Roughness: 0.45,
  //     Reflectance: 0.03,
  //     EmissiveStrength: 0.9
  //   }, "StandardSurfaceShader")
  //   blackPlasticGroup.getParameter('Material').setValue(material);
  //   asset.addChild(blackPlasticGroup);
  // }

  const blackRubberGroup = new MaterialGroup('blackRubberGroup');
  {
    const material = new Material('blackRubber');
    blackRubberGroup.getParameter('Material').setValue(material);
    asset.addChild(blackRubberGroup);
  }

  const orangeRubberGroup = new MaterialGroup('orangeRubberGroup');
  {
    const material = new Material('orangeRubber');
    orangeRubberGroup.getParameter('Material').setValue(material);
    asset.addChild(orangeRubberGroup);
  }

  const shinyMetalGroup = new MaterialGroup('shinyMetalGroup');
  {
    const material = new Material('shinyMetal');
    shinyMetalGroup.getParameter('Material').setValue(material);
    asset.addChild(shinyMetalGroup);
  }

  const goldMetalGroup = new MaterialGroup('goldMetalGroup');
  {
    const material = new Material('goldMetal');
    goldMetalGroup.getParameter('Material').setValue(material);
    asset.addChild(goldMetalGroup);
  }
  setRenderingMode(1);

  asset.once('loaded', () => {
    resolveItems(asset, casingMetalGroup, [
      ['.', 'MOTOR_HOUSING'],
      ['.', 'GEAR_HOUSING_ASSM_ASM', 'GEAR_SHIFTER_HOUSING'],
      ['.', 'BODY-2'],
      ['.', 'BODY_1_ASSM_ASM', 'BODY_1'],
      ['.', 'PROPELLER_HOUSING_ASSM_ASM', 'PROPELLER_HOUSING'],
    ]);

    resolveItems(asset, blackMetalGroup, [
      ['.', 'PROPELLER_SHAFT_NUT'],

      ['.', '10X30_HEX_BOLT'],
      ['.', '10X30_HEX_BOLT1'],
      ['.', '10X30_HEX_BOLT2'],
      ['.', '10X30_HEX_BOLT3'],

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

      ['.', 'BODY_1_ASSM_ASM', 'STUD_FOR_DIFFERENTIAL_MOUNTING'],
      ['.', 'BODY_1_ASSM_ASM', 'STUD_FOR_DIFFERENTIAL_MOUNTING1'],
      ['.', 'BODY_1_ASSM_ASM', 'STUD_FOR_DIFFERENTIAL_MOUNTING2'],
      ['.', 'BODY_1_ASSM_ASM', 'STUD_FOR_DIFFERENTIAL_MOUNTING3'],
      ['.', 'BODY_1_ASSM_ASM', 'STUD_FOR_DIFFERENTIAL_MOUNTING4'],
      ['.', 'BODY_1_ASSM_ASM', 'STUD_FOR_DIFFERENTIAL_MOUNTING5'],
      ['.', 'BODY_1_ASSM_ASM', 'STUD_FOR_DIFFERENTIAL_MOUNTING6'],
      ['.', 'BODY_1_ASSM_ASM', 'STUD_FOR_DIFFERENTIAL_MOUNTING7'],

      ['.', 'BODY_FLANGE_COUPLE'],

      ['.', 'BUNDH_PLUG_ASSM_ASM', 'BUNDH_PLUG_FOR_BODY'],
      ['.', 'BUNDH_PLUG_ASSM_ASM1', 'BUNDH_PLUG_FOR_BODY'],

      ['.', '10X45_HEX_BOT'],
      ['.', '10X45_HEX_BOT1'],
      ['.', '10MM_SPRING_WASHER'],
      ['.', '10MM_SPRING_WASHER1'],

      ['.', 'GEAR_SHAFT_ASSM_ASM', 'GEAR_SHAFT_1'],
      ['.', 'SHIFTER_HOUSING_PLATE'],

      ['.', 'BODY_1_ASSM_ASM', 'DOVEL_FOR_BODY1'],
      ['.', 'BODY_1_ASSM_ASM', 'DOVEL_FOR_BODY'],
    ]);

    resolveItems(asset, shinyMetalGroup, [
      ['.', 'FRONT_PROPELLER_HOUSING'],
      ['.', 'GEAR_1'],
      ['.', 'GEAR_2'],
      ['.', 'GEAR_3'],
      ['.', 'GEAR_4'],
      ['.', 'GEAR_SHAFT_ASSM_ASM', 'GEAR_5'],
      ['.', 'NEEDLE_BEARING_ASSM_ASM', 'NEEDLE_BALL'],
    ]);

    resolveItems(asset, goldMetalGroup, [
      // Ball Brearing Housing
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

      ['.', 'BODY_1_ASSM_ASM', 'SKF_6209_CE_BEARING_ASM', 'SKF_6209-C3_INNERFACE_'],
      ['.', 'BODY_1_ASSM_ASM', 'SKF_6209_CE_BEARING_ASM', 'SKF_6209-C3_COLLAR'],
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

      ['.', 'GEAR_SHAFT_ASSM_ASM'],
      ['.', 'NEEDLE_BEARING_ASSM_ASM'],
      ['.', 'NEEDLE_BEARING_ASSM_ASM1'],

      ['.', 'DOVEL_FOR_SHIFTER_HOUSING'],
      ['.', 'DOVEL_FOR_SHIFTER_HOUSING1'],
    ]);

    resolveItems(asset, blackRubberGroup, [
      ['.', 'PROPELLER_HOUSING_ASSM_ASM', '60-80-10_OIL_SEAL'],

      ['.', 'WASHER_FOR_PROPRLLER_HOSING_MTG'],
      ['.', 'PROPELLER_HOSING_PAKING'],

      // 10MM_SPRING_WASHER1
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

      ['.', 'BODY_FLANGE'],
      ['.', 'GASKET_FOR_SHIFTER'],
      ['.', 'GEAR_HOUSING_ASSM_ASM', 'U-SEAL_FOR_GEAR_HOUSING1'],

      ['.', 'GEAR_HOUSING_ASSM_ASM', 'U-SEAL_FOR_GEAR_HOUSING'],
      ['.', 'O-RING_FOR_SHIFTER_SHAFT1'],
      ['.', 'GEAR_HOUSING_ASSM_ASM', 'O-RING_FOR_SHIFTER_HOUSING'],

      ['.', 'O-RING_FOR_SHIFTER_SHAFT'],
      ['.', 'U-SEAL_FOR_GEAR_HOUSING'],

      ['.', 'BUNDH_PLUG_ASSM_ASM', '20_MM_O_RING_FOR_BUNDH_PLUG'],
      ['.', 'BUNDH_PLUG_ASSM_ASM1', '20_MM_O_RING_FOR_BUNDH_PLUG'],
    ]);

    resolveItems(asset, orangeRubberGroup, [
      ['.', 'WASHER_1'],
      ['.', 'GASKET_FOR_BODY'],
    ]);
  });
  return setRenderingMode;
};
export default setupMaterials;
