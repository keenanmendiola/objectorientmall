import ParkingService from "./services/ParkingService.js";

// parkingService.unparkCar("ABC123");
// parkingService.viewParking();
// parkingService.unparkCar("ABC127");
// parkingService.viewParking();
// parkingService.unparkCar("ABC128");
// parkingService.viewParking();
// parkingService.parkCar(2, "L", "ABC128");
// parkingService.viewParking();
// parkingService.parkCar(1, "L", "ABC012");
// parkingService.viewParking();
// parkingService.parkCar(2, "L", "ABC013");
// parkingService.viewParking();
// parkingService.parkCar(3, "L", "ABC014");
// parkingService.viewParking();
// parkingService.parkCar(2, "L", "ABC015");
// parkingService.viewParking();
// parkingService.parkCar(1, "L", "ABC016");
// parkingService.viewParking();
// parkingService.parkCar(3, "L", "ABC017");
// parkingService.viewParking();
// parkingService.parkCar(3, "L", "ABC017");
// parkingService.viewParking();
// parkingService.parkCar(3, "L", "ABC018");
// parkingService.viewParking();
// console.log("");

//Scenario 1
//Assigning Car to Nearest parking slot
// let numberOfEntryPoints = 3;

// let parkingService = new ParkingService(numberOfEntryPoints);

// parkingService.parkCar(2, "S", "ABC123");
// parkingService.parkCar(3, "M", "ABC124");
// parkingService.parkCar(1, "L", "ABC125");
// parkingService.parkCar(3, "S", "ABC126");
// parkingService.parkCar(2, "M", "ABC127");
// parkingService.parkCar(1, "L", "ABC128");
// parkingService.viewParking();

//Scenario 2
//Unparking car
let numberOfEntryPoints = 3;

let parkingService = new ParkingService(numberOfEntryPoints);

parkingService.parkCar(2, "S", "ABC123");
parkingService.parkCar(3, "M", "ABC124");
parkingService.parkCar(1, "L", "ABC125");
parkingService.parkCar(3, "S", "ABC126");
parkingService.parkCar(2, "M", "ABC127");
parkingService.parkCar(1, "L", "ABC128");
parkingService.viewParking();
parkingService.unparkCar("ABC128");
parkingService.unparkCar("ABC123");
parkingService.viewParking();
