const { Xfo, EulerAngles } = window.zeaEngine;
const { CADAsset } = window.zeaCad;

const loadModel = () => {
  ////////////////////////////////////
  // Load the Model
  const asset = new CADAsset();
  // asset.getParameter('DataFilePath').setUrl('data/gear_box_final_asm.zcad');
  asset.getParameter('DataFilePath').setUrl('data/gear_box_final_asm-visu.zcad');

  const xfo = new Xfo();
  xfo.ori.setFromEulerAngles(new EulerAngles(Math.PI * 0.5, 0, 0));
  asset.getParameter('LocalXfo').setValue(xfo);

  return asset;
};

export default loadModel;
