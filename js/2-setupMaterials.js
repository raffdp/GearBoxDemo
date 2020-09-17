const { Color, Group, Material, EnvMap } = window.zeaEngine;

const setupMaterials = (asset, scene) => {
  const setRenderingMode = (mode) => {
    if (mode == 0) {
      asset.getParameter('Display Edges').setValue(false);
      asset.getParameter('Edge Color').setValue(new Color(0.0, 0.0, 0.0, 1));

      {
        const material = casingMetalGroup.getParameter('Material').getValue();
        material.modifyParams(
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
        material.modifyParams(
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
        material.modifyParams(
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
        material.modifyParams(
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
        material.modifyParams(
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
        material.modifyParams(
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
      asset.getParameter('Display Edges').setValue(true);
      asset.getParameter('Edge Color').setValue(new Color(0.1, 0.1, 0.1, 1));
      // scene.getSettings().getParameter('EnvMap').setValue(null);
      const EmissiveStrength = 0.9;
      const Roughness = 1.0;
      const Reflectance = 0.0;
      {
        const material = casingMetalGroup.getParameter('Material').getValue();
        material.modifyParams(
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
        material.modifyParams(
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
        material.modifyParams(
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
        material.modifyParams(
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
        material.modifyParams(
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
        material.modifyParams(
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

  const casingMetalGroup = new Group('casingMetalGroup');
  {
    const material = new Material('casingMetal');
    casingMetalGroup.getParameter('Material').setValue(material);
    asset.addChild(casingMetalGroup);
  }

  const blackMetalGroup = new Group('blackMetalGroup');
  {
    const material = new Material('blackMetal');
    blackMetalGroup.getParameter('Material').setValue(material);
    asset.addChild(blackMetalGroup);
  }

  // const blackPlasticGroup = new Group('blackPlasticGroup');
  // {
  //   const material = new Material('blackPlastic');
  //   material.modifyParams({
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

  const blackRubberGroup = new Group('blackRubberGroup');
  {
    const material = new Material('blackRubber');
    blackRubberGroup.getParameter('Material').setValue(material);
    asset.addChild(blackRubberGroup);
  }

  const orangeRubberGroup = new Group('orangeRubberGroup');
  {
    const material = new Material('orangeRubber');
    orangeRubberGroup.getParameter('Material').setValue(material);
    asset.addChild(orangeRubberGroup);
  }

  const shinyMetalGroup = new Group('shinyMetalGroup');
  {
    const material = new Material('shinyMetal');
    shinyMetalGroup.getParameter('Material').setValue(material);
    asset.addChild(shinyMetalGroup);
  }

  const goldMetalGroup = new Group('goldMetalGroup');
  {
    const material = new Material('goldMetal');
    goldMetalGroup.getParameter('Material').setValue(material);
    asset.addChild(goldMetalGroup);
  }
  setRenderingMode(1);

  asset.once('loaded', () => {
    casingMetalGroup.resolveItems([
      ['.', 'MOTOR_HOUSING'],
      ['.', 'GEAR_HOUSING_ASSM_ASM', 'GEAR_SHIFTER_HOUSING'],
      ['.', 'BODY-2'],
      ['.', 'BODY_1_ASSM_ASM', 'BODY_1'],
      ['.', 'PROPELLER_HOUSING_ASSM_ASM', 'PROPELLER_HOUSING'],
    ]);

    blackMetalGroup.resolveItems([
      ['.', 'PROPELLER_SHAFT_NUT'],

      ['.', '10X30_HEX_BOLT'],
      ['.', '10X30_HEX_BOLT_010'],
      ['.', '10X30_HEX_BOLT_011'],
      ['.', '10X30_HEX_BOLT_012'],

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
      ['.', '8X30_ALLEN_BOLT_004'],
      ['.', '8X30_ALLEN_BOLT_005'],
      ['.', '8X30_ALLEN_BOLT_006'],

      ['.', 'BODY_1_ASSM_ASM', 'STUD_FOR_DIFFERENTIAL_MOUNTING'],
      ['.', 'BODY_1_ASSM_ASM', 'STUD_FOR_DIFFERENTIAL_MOUNTING_004'],
      ['.', 'BODY_1_ASSM_ASM', 'STUD_FOR_DIFFERENTIAL_MOUNTING_005'],
      ['.', 'BODY_1_ASSM_ASM', 'STUD_FOR_DIFFERENTIAL_MOUNTING_006'],
      ['.', 'BODY_1_ASSM_ASM', 'STUD_FOR_DIFFERENTIAL_MOUNTING_007'],
      ['.', 'BODY_1_ASSM_ASM', 'STUD_FOR_DIFFERENTIAL_MOUNTING_008'],
      ['.', 'BODY_1_ASSM_ASM', 'STUD_FOR_DIFFERENTIAL_MOUNTING_009'],
      ['.', 'BODY_1_ASSM_ASM', 'STUD_FOR_DIFFERENTIAL_MOUNTING_010'],

      ['.', 'BODY_FLANGE_COUPLE'],

      ['.', 'BUNDH_PLUG_ASSM_ASM', 'BUNDH_PLUG_FOR_BODY'],
      ['.', 'BUNDH_PLUG_ASSM_ASM_062', 'BUNDH_PLUG_FOR_BODY'],

      ['.', '10X45_HEX_BOT'],
      ['.', '10X45_HEX_BOT_037'],
      ['.', '10MM_SPRING_WASHER'],
      ['.', '10MM_SPRING_WASHER_035'],

      ['.', 'GEAR_SHAFT_ASSM_ASM', 'GEAR_SHAFT_1'],
      ['.', 'SHIFTER_HOUSING_PLATE'],

      ['.', 'BODY_1_ASSM_ASM', 'DOVEL_FOR_BODY_012'],
      ['.', 'BODY_1_ASSM_ASM', 'DOVEL_FOR_BODY'],
    ]);

    shinyMetalGroup.resolveItems([
      ['.', 'FRONT_PROPELLER_HOUSING'],
      ['.', 'GEAR_1'],
      ['.', 'GEAR_2'],
      ['.', 'GEAR_3'],
      ['.', 'GEAR_4'],
      ['.', 'GEAR_SHAFT_ASSM_ASM', 'GEAR_5'],
      ['.', 'NEEDLE_BEARING_ASSM_ASM', 'NEEDLE_BALL'],
    ]);

    goldMetalGroup.resolveItems([
      // Ball Brearing Housing
      ['.', 'PROPELLER_HOUSING_ASSM_ASM', '6308_BALL_BEARING_SKF_ASM', '6308_BALL_BEARING_CASE_SKF'],
      ['.', 'PROPELLER_HOUSING_ASSM_ASM', '6308_BALL_BEARING_SKF_ASM', '6308_BALL_BEARING_COLLAR_SKF'],
      ['.', 'PROPELLER_HOUSING_ASSM_ASM', '6308_BALL_BEARING_SKF_ASM', '6308_BALL_BEARING_BALL_SKF'],
      ['.', 'PROPELLER_HOUSING_ASSM_ASM', '6308_BALL_BEARING_SKF_ASM', '6308_BALL_BEARING_BALL_SKF_004'],
      ['.', 'PROPELLER_HOUSING_ASSM_ASM', '6308_BALL_BEARING_SKF_ASM', '6308_BALL_BEARING_BALL_SKF_005'],
      ['.', 'PROPELLER_HOUSING_ASSM_ASM', '6308_BALL_BEARING_SKF_ASM', '6308_BALL_BEARING_BALL_SKF_006'],
      ['.', 'PROPELLER_HOUSING_ASSM_ASM', '6308_BALL_BEARING_SKF_ASM', '6308_BALL_BEARING_BALL_SKF_007'],
      ['.', 'PROPELLER_HOUSING_ASSM_ASM', '6308_BALL_BEARING_SKF_ASM', '6308_BALL_BEARING_BALL_SKF_008'],
      ['.', 'PROPELLER_HOUSING_ASSM_ASM', '6308_BALL_BEARING_SKF_ASM', '6308_BALL_BEARING_BALL_SKF_009'],
      ['.', 'PROPELLER_HOUSING_ASSM_ASM', '6308_BALL_BEARING_SKF_ASM', '6308_BALL_BEARING_BALL_SKF_010'],

      ['.', '6210_BALL_BEARING_SKF_ASM', '6210_BALL_BEARING_CASE_SKF'],
      ['.', '6210_BALL_BEARING_SKF_ASM', '6210_BALL_BEARING_COLLAR_SKF'],
      ['.', '6210_BALL_BEARING_SKF_ASM', '6210_BALL_BEARING_BALL_SKF'],
      ['.', '6210_BALL_BEARING_SKF_ASM', '6210_BALL_BEARING_BALL_SKF_004'],
      ['.', '6210_BALL_BEARING_SKF_ASM', '6210_BALL_BEARING_BALL_SKF_005'],
      ['.', '6210_BALL_BEARING_SKF_ASM', '6210_BALL_BEARING_BALL_SKF_006'],
      ['.', '6210_BALL_BEARING_SKF_ASM', '6210_BALL_BEARING_BALL_SKF_007'],
      ['.', '6210_BALL_BEARING_SKF_ASM', '6210_BALL_BEARING_BALL_SKF_008'],
      ['.', '6210_BALL_BEARING_SKF_ASM', '6210_BALL_BEARING_BALL_SKF_009'],
      ['.', '6210_BALL_BEARING_SKF_ASM', '6210_BALL_BEARING_BALL_SKF_010'],
      ['.', '6210_BALL_BEARING_SKF_ASM', '6210_BALL_BEARING_BALL_SKF_011'],
      ['.', '6210_BALL_BEARING_SKF_ASM', '6210_BALL_BEARING_BALL_SKF_012'],

      ['.', 'BODY_1_ASSM_ASM', 'SKF_6209_CE_BEARING_ASM', 'SKF_6209-C3_INNERFACE_'],
      ['.', 'BODY_1_ASSM_ASM', 'SKF_6209_CE_BEARING_ASM', 'SKF_6209-C3_COLLAR'],
      ['.', 'BODY_1_ASSM_ASM', 'SKF_6209_CE_BEARING_ASM', 'SKF_6209-C3_BALL'],
      ['.', 'BODY_1_ASSM_ASM', 'SKF_6209_CE_BEARING_ASM', 'SKF_6209-C3_BALL_004'],
      ['.', 'BODY_1_ASSM_ASM', 'SKF_6209_CE_BEARING_ASM', 'SKF_6209-C3_BALL_005'],
      ['.', 'BODY_1_ASSM_ASM', 'SKF_6209_CE_BEARING_ASM', 'SKF_6209-C3_BALL_006'],
      ['.', 'BODY_1_ASSM_ASM', 'SKF_6209_CE_BEARING_ASM', 'SKF_6209-C3_BALL_007'],
      ['.', 'BODY_1_ASSM_ASM', 'SKF_6209_CE_BEARING_ASM', 'SKF_6209-C3_BALL_008'],
      ['.', 'BODY_1_ASSM_ASM', 'SKF_6209_CE_BEARING_ASM', 'SKF_6209-C3_BALL_009'],
      ['.', 'BODY_1_ASSM_ASM', 'SKF_6209_CE_BEARING_ASM', 'SKF_6209-C3_BALL_010'],
      ['.', 'BODY_1_ASSM_ASM', 'SKF_6209_CE_BEARING_ASM', 'SKF_6209-C3_BALL_011'],
      ['.', 'BODY_1_ASSM_ASM', 'SKF_6209_CE_BEARING_ASM', 'SKF_6209-C3_BALL_012'],

      ['.', 'GEAR_SHAFT_ASSM_ASM'],
      ['.', 'NEEDLE_BEARING_ASSM_ASM'],
      ['.', 'NEEDLE_BEARING_ASSM_ASM_020'],

      ['.', 'DOVEL_FOR_SHIFTER_HOUSING'],
      ['.', 'DOVEL_FOR_SHIFTER_HOUSING_029'],
    ]);

    blackRubberGroup.resolveItems([
      ['.', 'PROPELLER_HOUSING_ASSM_ASM', '60-80-10_OIL_SEAL'],

      ['.', 'WASHER_FOR_PROPRLLER_HOSING_MTG'],
      ['.', 'PROPELLER_HOSING_PAKING'],

      // 10MM_SPRING_WASHER_041
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

      ['.', 'BODY_FLANGE'],
      ['.', 'GASKET_FOR_SHIFTER'],
      ['.', 'GEAR_HOUSING_ASSM_ASM', 'U-SEAL_FOR_GEAR_HOUSING_003'],

      ['.', 'GEAR_HOUSING_ASSM_ASM', 'U-SEAL_FOR_GEAR_HOUSING'],
      ['.', 'O-RING_FOR_SHIFTER_SHAFT_032'],
      ['.', 'GEAR_HOUSING_ASSM_ASM', 'O-RING_FOR_SHIFTER_HOUSING'],

      ['.', 'O-RING_FOR_SHIFTER_SHAFT'],
      ['.', 'U-SEAL_FOR_GEAR_HOUSING'],

      ['.', 'BUNDH_PLUG_ASSM_ASM', '20_MM_O_RING_FOR_BUNDH_PLUG'],
      ['.', 'BUNDH_PLUG_ASSM_ASM_062', '20_MM_O_RING_FOR_BUNDH_PLUG'],
    ]);

    orangeRubberGroup.resolveItems([
      ['.', 'WASHER_1'],
      ['.', 'GASKET_FOR_BODY'],
    ]);
  });
  return setRenderingMode;
};
export default setupMaterials;
