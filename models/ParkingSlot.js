export default class ParkingSlot {
  static slotCount = 0;

  constructor(parkingType) {
    this.slotId = ParkingSlot.slotCount += 1;
    this.parkingType = parkingType;
    this.isOccupied = false;
    this.distanceToEntries = null;
    this.car = {};

    //fields below are only added for easier visualization of list in console.table
    this.parkedCarSize = "";
    this.plateNumber = "";
    this.entryPoint = "";
  }
}
