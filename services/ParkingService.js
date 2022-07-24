import ParkingSlot from "../models/ParkingSlot.js";
import {
  parkingFees,
  flatRate,
  exceedingAllowedTimeFee,
} from "../constants.js";
let row1 = [
  new ParkingSlot("S"),
  new ParkingSlot("S"),
  new ParkingSlot("M"),
  new ParkingSlot("M"),
  new ParkingSlot("L"),
  new ParkingSlot("L"),
];

let row2 = [
  new ParkingSlot("M"),
  new ParkingSlot("M"),
  new ParkingSlot("L"),
  new ParkingSlot("L"),
  new ParkingSlot("S"),
  new ParkingSlot("S"),
];

let row3 = [
  new ParkingSlot("L"),
  new ParkingSlot("L"),
  new ParkingSlot("S"),
  new ParkingSlot("S"),
  new ParkingSlot("M"),
  new ParkingSlot("M"),
];

let row4 = [
  new ParkingSlot("L"),
  new ParkingSlot("L"),
  new ParkingSlot("M"),
  new ParkingSlot("M"),
  new ParkingSlot("S"),
  new ParkingSlot("S"),
];

let parking = [...row1, ...row2, ...row3, ...row4];
let carsDeparted = [];

export default class ParkingService {
  constructor(numberOfEntryPoints) {
    this.initializeParking(numberOfEntryPoints);
  }

  //sets random values for distances of each parking slot to an entry point
  initializeParking = (numberOfEntryPoints) => {
    parking.forEach((slot) => {
      let distanceToEntries = [];
      for (var i = 1; i <= numberOfEntryPoints; i++) {
        distanceToEntries.push(
          Math.floor(Math.random() * numberOfEntryPoints) + 1
        );
      }
      slot.distanceToEntries = distanceToEntries;
    });
  };

  parkCar = (entryPoint, carSize, plateNumber) => {
    const availableCarSlots = this.getAvailableCarSlots(entryPoint);
    this.assignCarToParkingSlot(
      availableCarSlots,
      carSize,
      plateNumber,
      entryPoint
    );
  };

  unparkCar = (plateNumber) => {
    let slotIndex = 0;
    let slot = parking.find((slot, index) => {
      if (slot.car.plateNumber === plateNumber) {
        slotIndex = index;
      }
      return slot.car.plateNumber === plateNumber;
    });
    slot.car.timeExit = new Date();
    let fee = this.computeParkingFee(slot, slot.parkingType);
    console.log("Car fee", fee);
    carsDeparted.push(slot.car);

    //empty the parking slot
    parking[slotIndex].car = {};
    parking[slotIndex].isOccupied = false;
    console.table(carsDeparted);
  };

  computeParkingFee = (car, slotSize) => {
    let totalFee = flatRate;
    let chunkHours = 0;
    let remainderChunkHours = 0;
    let chunkHoursFee = 0;
    let hours = Math.ceil(Math.abs(car.timeEntry - car.timeExit) / 36e5);

    if (hours <= 3) {
      return totalFee;
    }

    if (hours > 24) {
      chunkHours = Math.floor(hours / 24);
      remainderChunkHours = hours % 24;
      chunkHoursFee = chunkHours * 5000;
      totalFee =
        chunkHoursFee +
        this.computeFeeByParkingSlot(remainderChunkHours, slotSize);
      return totalFee;
    }

    let fee = this.computeFeeByParkingSlot(hours - 3);
    totalFee += fee;
    return totalFee;
  };

  computeFeeByParkingSlot = (hours, slotSize) => {
    let exceedingHoursFee = 0;
    switch (slotSize) {
      case "S":
        exceedingHoursFee = Math.ceil(parkingFees.small * hours);
        break;
      case "M":
        exceedingHoursFee = Math.ceil(parkingFees.medium * hours);
        break;
      case "L":
        exceedingHoursFee = Math.ceil(parkingFees.large * hours);
        break;
      default:
        break;
    }

    return exceedingHoursFee;
  };

  doesCarFit = (carSize, slotSize) => {
    if (carSize === "S") {
      return true;
    }

    if (carSize === "M" && (slotSize === "M" || slotSize === "L")) {
      return true;
    }

    if (carSize === "L" && slotSize === "L") {
      return true;
    }

    return false;
  };

  getAvailableCarSlots = (entryPoint) => {
    return parking
      .filter((slot) => {
        return !slot.isOccupied;
      })
      .map((slot) => {
        return {
          slotId: slot.slotId,
          distanceToEntry: slot.distanceToEntries[entryPoint - 1],
          parkingType: slot.parkingType,
          isOccupied: slot.isOccupied,
        };
      })
      .sort((a, b) => {
        return a.distanceToEntry - b.distanceToEntry;
      });
  };

  assignCarToParkingSlot = (
    availableCarSlots,
    carSize,
    plateNumber,
    entryPoint
  ) => {
    let departedCar = this.getPreviouslyParkedCarDetails(plateNumber);

    if (departedCar !== undefined) {
      this.assignCarToSlot(availableCarSlots, departedCar, carSize);
    } else {
      let car = {
        plateNumber,
        carType: carSize,
        timeEntry: new Date(),
        timeExit: 0,
        entryPoint,
      };
      this.assignCarToSlot(availableCarSlots, car, carSize, entryPoint);
    }
  };

  assignCarToSlot = (availableCarSlots, car, carSize, entryPoint) => {
    for (let i = 0; i < availableCarSlots.length; i++) {
      let parkingSlotIndex = parking.findIndex(
        (x) => x.slotId === availableCarSlots[i].slotId
      );
      if (parkingSlotIndex > 0) {
        if (this.doesCarFit(carSize, availableCarSlots[i].parkingType)) {
          car.slotSize = availableCarSlots[i].parkingType;
          car.slotId = availableCarSlots[i].slotId;

          parking[parkingSlotIndex].car = car;
          parking[parkingSlotIndex].isOccupied = true;

          parking[parkingSlotIndex].parkedCarSize = carSize;
          parking[parkingSlotIndex].plateNumber = car.plateNumber;
          parking[parkingSlotIndex].entryPoint = entryPoint;
          break;
        }
      }
    }
  };

  getPreviouslyParkedCarDetails = (plateNumber) => {
    return carsDeparted.find((car) => car.plateNumber === plateNumber);
  };

  viewParking = () => {
    console.table(parking);
  };
}
