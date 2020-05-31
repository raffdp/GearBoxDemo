import { Color, Xfo, Vec3, Group, GearsOperator } from "../dist/zea-engine/dist/index.esm.js"

const setupGears = (asset) => {

  const gearsOp = new GearsOperator("Gears");
  const rpmParam = gearsOp.getParameter("RPM");
  rpmParam.setValue(5.0);
  rpmParam.setRange([0, 60]);
  const axis = new Vec3(0, 1, 0)
  
  asset.addChild(gearsOp);

  const setGearBoxSetting = (gearboxSetting) => {
    if (gearboxSetting == 1) {
      const gear2 = gearsOp.getParameter("Gears").getElement(2);
      gear2.getMember("Ratio").setValue(1);
      const gear3 = gearsOp.getParameter("Gears").getElement(3);
      gear3.getMember("Ratio").setValue(-30/20);
      const gear4 = gearsOp.getParameter("Gears").getElement(4);
      gear4.getMember("Ratio").setValue(10/40);
      const brearings = gearsOp.getParameter("Gears").getElement(7);
      brearings.getMember("Ratio").setValue(-1);

    } else if (gearboxSetting == 2) {
      const gear4 = gearsOp.getParameter("Gears").getElement(4);
      gear4.getMember("Ratio").setValue(1);
      const gear3 = gearsOp.getParameter("Gears").getElement(3);
      gear3.getMember("Ratio").setValue(-40/10);
      const gear2 = gearsOp.getParameter("Gears").getElement(2);
      gear2.getMember("Ratio").setValue(30/10);
      const brearings = gearsOp.getParameter("Gears").getElement(7);
      brearings.getMember("Ratio").setValue(-2);
    }
  }

  asset.loaded.connect(()=>{
    
    {
      const group = new Group('FRONT_PROPELLER_HOUSING');
      group.getParameter('InitialXfoMode').setValue('average');
      asset.addChild(group);
      group.resolveItems([
          [".", "FRONT_PROPELLER_HOUSING"],
          [".", "PROPELLER_SHAFT_NUT"]
          ]);
      
      const gear = gearsOp.getParameter("Gears").addElement();
      gear.getMember("Ratio").setValue(1);
      gear.getMember("Axis").setValue(axis);
      // const gearGeoms = gear.getMember('Items')
      // gearGeoms.addElement(binding.geomItem);
      gear.getOutput().setParam(group.getParameter("GlobalXfo"));
    }
    {
      const group = new Group('GEAR_1');
      group.getParameter('InitialXfoMode').setValue('average');
      asset.addChild(group);
      group.resolveItems([
          [".", "GEAR_1"]
          ]);
      
      const gear = gearsOp.getParameter("Gears").addElement();
      gear.getMember("Ratio").setValue(1);
      gear.getMember("Axis").setValue(axis);
      // const gearGeoms = gear.getMember('Items')
      // gearGeoms.addElement(binding.geomItem);
      gear.getOutput().setParam(group.getParameter("GlobalXfo"));
    }
    {
      const group = new Group('GEAR_2');
      group.getParameter('InitialXfoMode').setValue('average');
      asset.addChild(group);
      group.resolveItems([
          [".", "GEAR_2"]
          ]);
      const gear = gearsOp.getParameter("Gears").addElement();
      gear.getMember("Axis").setValue(axis);
      gear.getOutput().setParam(group.getParameter("GlobalXfo"));
    }
      
    {
      const group = new Group('GEAR_3');
      group.getParameter('InitialXfoMode').setValue('average');
      asset.addChild(group);
      group.resolveItems([
          [".", "GEAR_3"]
          ]);
      const gear = gearsOp.getParameter("Gears").addElement();
      gear.getMember("Axis").setValue(axis);
      gear.getOutput().setParam(group.getParameter("GlobalXfo"));
    }
    {
      const group = new Group('GEAR_4');
      group.getParameter('InitialXfoMode').setValue('average');
      asset.addChild(group);
      group.resolveItems([
          [".", "GEAR_4"]
          ]);
      
      const gear = gearsOp.getParameter("Gears").addElement();
      gear.getMember("Axis").setValue(axis);
      gear.getOutput().setParam(group.getParameter("GlobalXfo"));
    }
    {
      const group = new Group('GEAR_5');
      group.getParameter('InitialXfoMode').setValue('average');
      asset.addChild(group);
      group.resolveItems([
          [".", "GEAR_SHAFT_ASSM_ASM", "GEAR_5"]
          ]);
      
      const gear = gearsOp.getParameter("Gears").addElement();
      gear.getMember("Axis").setValue(axis);
      gear.getOutput().setParam(group.getParameter("GlobalXfo"));
    }
    
    {
      const group = new Group('BREARINGSDRIVESHAFT');
      group.getParameter('InitialXfoMode').setValue('average');
      asset.addChild(group);
      group.resolveItems([
        [".", "PROPELLER_HOUSING_ASSM_ASM", "6308_BALL_BEARING_SKF_ASM", "6308_BALL_BEARING_CASE_SKF"],
        [".", "PROPELLER_HOUSING_ASSM_ASM", "6308_BALL_BEARING_SKF_ASM", "6308_BALL_BEARING_COLLAR_SKF"],
        [".", "PROPELLER_HOUSING_ASSM_ASM", "6308_BALL_BEARING_SKF_ASM", "6308_BALL_BEARING_BALL_SKF"],
        [".", "PROPELLER_HOUSING_ASSM_ASM", "6308_BALL_BEARING_SKF_ASM", "6308_BALL_BEARING_BALL_SKF_004", "6308_BALL_BEARING_BALL_SKF"],
        [".", "PROPELLER_HOUSING_ASSM_ASM", "6308_BALL_BEARING_SKF_ASM", "6308_BALL_BEARING_BALL_SKF_005", "6308_BALL_BEARING_BALL_SKF"],
        [".", "PROPELLER_HOUSING_ASSM_ASM", "6308_BALL_BEARING_SKF_ASM", "6308_BALL_BEARING_BALL_SKF_006", "6308_BALL_BEARING_BALL_SKF"],
        [".", "PROPELLER_HOUSING_ASSM_ASM", "6308_BALL_BEARING_SKF_ASM", "6308_BALL_BEARING_BALL_SKF_007", "6308_BALL_BEARING_BALL_SKF"],
        [".", "PROPELLER_HOUSING_ASSM_ASM", "6308_BALL_BEARING_SKF_ASM", "6308_BALL_BEARING_BALL_SKF_008", "6308_BALL_BEARING_BALL_SKF"],
        [".", "PROPELLER_HOUSING_ASSM_ASM", "6308_BALL_BEARING_SKF_ASM", "6308_BALL_BEARING_BALL_SKF_009", "6308_BALL_BEARING_BALL_SKF"],
        [".", "PROPELLER_HOUSING_ASSM_ASM", "6308_BALL_BEARING_SKF_ASM", "6308_BALL_BEARING_BALL_SKF_010", "6308_BALL_BEARING_BALL_SKF"],

          ]);
      
      const gear = gearsOp.getParameter("Gears").addElement();
      gear.getMember("Axis").setValue(axis);
      gear.getMember("Ratio").setValue(0.5);
      gear.getOutput().setParam(group.getParameter("GlobalXfo"));
    }
    {
      const group = new Group('BREARINGSBACK');
      group.getParameter('InitialXfoMode').setValue('average');
      asset.addChild(group);
      group.resolveItems([
        [".", "BODY_1_ASSM_ASM", "SKF_6209_CE_BEARING_ASM", "SKF_6209-C3_COLLAR"],
        [".", "BODY_1_ASSM_ASM", "SKF_6209_CE_BEARING_ASM", "SKF_6209-C3_INNERFACE_"],
        [".", "BODY_1_ASSM_ASM", "SKF_6209_CE_BEARING_ASM", "SKF_6209-C3_BALL"],
        [".", "BODY_1_ASSM_ASM", "SKF_6209_CE_BEARING_ASM", "SKF_6209-C3_BALL_004", "SKF_6209-C3_BALL"],
        [".", "BODY_1_ASSM_ASM", "SKF_6209_CE_BEARING_ASM", "SKF_6209-C3_BALL_005", "SKF_6209-C3_BALL"],
        [".", "BODY_1_ASSM_ASM", "SKF_6209_CE_BEARING_ASM", "SKF_6209-C3_BALL_006", "SKF_6209-C3_BALL"],
        [".", "BODY_1_ASSM_ASM", "SKF_6209_CE_BEARING_ASM", "SKF_6209-C3_BALL_007", "SKF_6209-C3_BALL"],
        [".", "BODY_1_ASSM_ASM", "SKF_6209_CE_BEARING_ASM", "SKF_6209-C3_BALL_008", "SKF_6209-C3_BALL"],
        [".", "BODY_1_ASSM_ASM", "SKF_6209_CE_BEARING_ASM", "SKF_6209-C3_BALL_009", "SKF_6209-C3_BALL"],
        [".", "BODY_1_ASSM_ASM", "SKF_6209_CE_BEARING_ASM", "SKF_6209-C3_BALL_010", "SKF_6209-C3_BALL"],
        [".", "BODY_1_ASSM_ASM", "SKF_6209_CE_BEARING_ASM", "SKF_6209-C3_BALL_011", "SKF_6209-C3_BALL"],
        [".", "BODY_1_ASSM_ASM", "SKF_6209_CE_BEARING_ASM", "SKF_6209-C3_BALL_012", "SKF_6209-C3_BALL"],

        
        [".", "6210_BALL_BEARING_SKF_ASM", "6210_BALL_BEARING_CASE_SKF"],
        [".", "6210_BALL_BEARING_SKF_ASM", "6210_BALL_BEARING_COLLAR_SKF"],
        [".", "6210_BALL_BEARING_SKF_ASM", "6210_BALL_BEARING_BALL_SKF"],
        [".", "6210_BALL_BEARING_SKF_ASM", "6210_BALL_BEARING_BALL_SKF_004", "6210_BALL_BEARING_BALL_SKF"],
        [".", "6210_BALL_BEARING_SKF_ASM", "6210_BALL_BEARING_BALL_SKF_005", "6210_BALL_BEARING_BALL_SKF"],
        [".", "6210_BALL_BEARING_SKF_ASM", "6210_BALL_BEARING_BALL_SKF_006", "6210_BALL_BEARING_BALL_SKF"],
        [".", "6210_BALL_BEARING_SKF_ASM", "6210_BALL_BEARING_BALL_SKF_007", "6210_BALL_BEARING_BALL_SKF"],
        [".", "6210_BALL_BEARING_SKF_ASM", "6210_BALL_BEARING_BALL_SKF_008", "6210_BALL_BEARING_BALL_SKF"],
        [".", "6210_BALL_BEARING_SKF_ASM", "6210_BALL_BEARING_BALL_SKF_009", "6210_BALL_BEARING_BALL_SKF"],
        [".", "6210_BALL_BEARING_SKF_ASM", "6210_BALL_BEARING_BALL_SKF_010", "6210_BALL_BEARING_BALL_SKF"],
        [".", "6210_BALL_BEARING_SKF_ASM", "6210_BALL_BEARING_BALL_SKF_011", "6210_BALL_BEARING_BALL_SKF"],
        [".", "6210_BALL_BEARING_SKF_ASM", "6210_BALL_BEARING_BALL_SKF_012", "6210_BALL_BEARING_BALL_SKF"],

          ]);
      
      const gear = gearsOp.getParameter("Gears").addElement();
      gear.getMember("Axis").setValue(axis);
      gear.getOutput().setParam(group.getParameter("GlobalXfo"));
    }
    
    setGearBoxSetting(1)
  })
  
}
export default setupGears