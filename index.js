import ParkingService from "./services/ParkingService.js";
let numberOfEntryPoints = 4;

let parkingService = new ParkingService(numberOfEntryPoints);

parkingService.parkCar(2, "S", "ABC123");
parkingService.viewParking();
parkingService.parkCar(3, "M", "ABC124");
parkingService.viewParking();
parkingService.parkCar(1, "L", "ABC125");
parkingService.viewParking();
parkingService.parkCar(4, "S", "ABC126");
parkingService.viewParking();
parkingService.parkCar(2, "M", "ABC127");
parkingService.viewParking();
parkingService.parkCar(1, "L", "ABC128");
parkingService.viewParking();
parkingService.unparkCar("ABC123");
parkingService.viewParking();
parkingService.unparkCar("ABC127");
parkingService.viewParking();
parkingService.unparkCar("ABC128");
parkingService.viewParking();
parkingService.parkCar(4, "L", "ABC128");
parkingService.viewParking();
console.log("");
