// Macro function to find nth percentile element of a sorted version of an array
function arrayElemAtPercentile(sourceArrayField, percentile) {
  return {    
    "$let": {
      "vars": {
        "sortedArray": sortArray(sourceArrayField), 
        // Comment out the line above and uncomment the line below if running MDB 5.2 or greater
        // "sortedArray": {"$sortArray": {"input": sourceArrayField, "sortBy": 1}},        
      },
      "in": {         
        "$arrayElemAt": [  // FIND ELEMENT OF ARRAY AT NTH PERCENTILE POSITION
          "$$sortedArray",
          {"$subtract": [  // ARRAY IS 0-INDEX BASED SO SUBTRACT 1 TO GET POSITION
            {"$ceil":  // FIND NTH ELEMENT IN THE ARRAY, ROUNDED UP TO NEAREST integer
              {"$multiply": [
                {"$divide": [percentile, 100]},
                {"$size": "$$sortedArray"}
              ]}
            },
            1
          ]}
        ]
      }
    }
  };
}
