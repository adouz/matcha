const { getDistance, convertDistance } = require("geolib");

module.exports = function DistanceUser(
 latitude1,
 longitude1,
 latitude2,
 longitude2
) {
 let distance = Math.trunc(
   convertDistance(
     getDistance(
       {
         latitude: Number(latitude1),
         longitude: Number(longitude1)
       },
       {
         latitude: Number(latitude2),
         longitude: Number(longitude2)
       }
     ),
     "km"
   )
 );
 return distance;
};