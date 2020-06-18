import { Xfo, EulerAngles } from "https://unpkg.com/@zeainc/zea-engine/dist/index.esm.js"
import { CADAsset } from "https://unpkg.com/@zeainc/zea-cad/dist/index.rawimport.js"

const loadModel = () => {
  
  ////////////////////////////////////
  // Load the Model
  const asset = new CADAsset()
  asset.getParameter('DataFilePath').setUrl('data/gear_box_final_asm.zcad')

  const xfo = new Xfo();
  xfo.ori.setFromEulerAngles(new EulerAngles(Math.PI * 0.5, 0, 0));
  asset.setLocalXfo(xfo);

  return asset;
}
export default loadModel