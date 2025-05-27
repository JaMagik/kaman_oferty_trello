import mitsubishiCylinderTable from './mitsubishiCylinder';
import toshiba3FTable from './toshiba-3f';
// import kolejne jak będzie potrzeba

export function getTableForDeviceType(deviceType) {
  switch (deviceType) {
    case 'Mitsubishi-cylinder':
      return mitsubishiCylinderTable;
    case 'Toshiba 3F':
      return toshiba3FTable;
    // Dodaj kolejne case dla następnych modeli
    default:
      return [];
  }
}
