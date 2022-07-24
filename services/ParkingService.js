import ParkingSlot from "../models/ParkingSlot.js";
import { parkingFees, flatRate } from "../constants.js";

let parking = [
  new ParkingSlot("S"),
  new ParkingSlot("S"),
  new ParkingSlot("M"),
  new ParkingSlot("M"),
  new ParkingSlot("L"),
  new ParkingSlot("L"),
  new ParkingSlot("M"),
  new ParkingSlot("M"),
  new ParkingSlot("L"),
  new ParkingSlot("L"),
  new ParkingSlot("S"),
  new ParkingSlot("S"),
  new ParkingSlot("L"),
  new ParkingSlot("L"),
  new ParkingSlot("S"),
  new ParkingSlot("S"),
  new ParkingSlot("M"),
  new ParkingSlot("M"),
  new ParkingSlot("L"),
  new ParkingSlot("L"),
  new ParkingSlot("M"),
  new ParkingSlot("M"),
  new ParkingSlot("S"),
  new ParkingSlot("S"),
];

let carsDeparted = [];

export default class ParkingService {
  constructor(numberOfEntryPoints) {
    this.initializeParking(numberOfEntryPoints);
  }

  //sets random values for distances of each parking slot to an entry point
  initializeParking = (numberOfEntryPoints) => {
    if (numberOfEntryPoints < 3) {
      console.log("Parking complex must have at least 3 entry points");
    } else {
      parking.forEach((slot) => {
        let distanceToEntries = [];
        for (var i = 1; i <= numberOfEntryPoints; i++) {
          distanceToEntries.push(
            Math.floor(Math.random() * numberOfEntryPoints) + 1
          );
        }
        slot.distanceToEntries = distanceToEntries;
      });
    }
  };

  //parks car to nearest to its entry point
  parkCar = (entryPoint, carSize, plateNumber) => {
    const availableCarSlots = this.getAvailableCarSlots(entryPoint);
    this.assignCarToParkingSlot(
      availableCarSlots,
      carSize,
      plateNumber,
      entryPoint
    );
  };

  //unparks car and computes fee
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
    parking[slotIndex].parkedCarSize = "";
    parking[slotIndex].plateNumber = "";
    parking[slotIndex].entryPoint = "";
    console.table(carsDeparted);
  };

  //computes parking fee
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

  //computes parking fee based on slot
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

  //checks if car fits the parking slot
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

  //gets available car slots for car currently entering
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

  //checks if car is a returning car or new car then assigns parking slot accordingly
  assignCarToParkingSlot = (
    availableCarSlots,
    carSize,
    plateNumber,
    entryPoint
  ) => {
    let departedCar = this.getPreviouslyParkedCarDetails(plateNumber);

    if (departedCar !== undefined) {
      this.assignCarToSlot(availableCarSlots, departedCar, carSize, entryPoint);
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

  //assigns car to parking slot
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

          //fields below are only added for easier visualization of list in console.table
          parking[parkingSlotIndex].parkedCarSize = carSize;
          parking[parkingSlotIndex].plateNumber = car.plateNumber;
          parking[parkingSlotIndex].entryPoint = entryPoint;
          break;
        }
      }
    }
  };

  //get details of car if previously parked
  getPreviouslyParkedCarDetails = (plateNumber) => {
    return carsDeparted.find((car) => car.plateNumber === plateNumber);
  };

  //displays list of parking slots
  viewParking = () => {
    console.table(parking);
  };
}
