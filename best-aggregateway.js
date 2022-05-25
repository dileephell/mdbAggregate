// GOOD

var unsetStage = {
  "$unset": [
    "_id",
    "address",
  ]};    

var matchStage = {
  "$match": {
    "dateofbirth": {"$gte": ISODate("1970-01-01T00:00:00Z")},
  }};

var sortStage = {
   "$sort": {
    "dateofbirth": -1,
  }}; 


var limitStage = {"$limit": 2};
    
var pipeline = [
  unsetStage,
  matchStage,
  sortStage,
  limitStage,
];
