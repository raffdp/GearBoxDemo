const { Xfo, EulerAngles } = globalThis.zeaEngine;
const { CADAsset } = globalThis.zeaCad;

const loadModel = () => {
  ////////////////////////////////////
  // Load the Model
  const asset = new CADAsset();
  asset.getParameter('DataFilePath').setUrl('data/gear_box_final_asm.zcad');

  const xfo = new Xfo();
  xfo.ori.setFromEulerAngles(new EulerAngles(Math.PI * 0.5, 0, 0));
  asset.getParameter('LocalXfo').setValue(xfo);

  return asset;
};

export default loadModel;
