// Macro function to generate a complex aggregation expression for sorting an array
// This function isn't required for MongoDB version 5.2+ due to the new $sortArray operator
function sortArray(sourceArrayField) {
  return {
    // GENERATE BRAND NEW ARRAY TO CONTAIN THE ELEMENTS FROM SOURCE ARRAY BUT NOW SORTED
    "$reduce": {
      "input": sourceArrayField, 
      "initialValue": [],  // THE FIRST VERSION OF TEMP SORTED ARRAY WILL BE EMPTY
      "in": {
        "$let": {
          "vars": {  // CAPTURE $$this & $$value FROM OUTER $reduce BEFORE OVERRIDDEN
            "resultArray": "$$value",
            "currentSourceArrayElement": "$$this"
          },   
          "in": {
            "$let": {
              "vars": { 
                // FIND EACH SOURCE ARRAY'S CURRENT ELEMENT POSITION IN NEW SORTED ARRAY
                "targetArrayPosition": {
                  "$reduce": { 
                    "input": {"$range": [0, {"$size": "$$resultArray"}]},  // "0,1,2.."
                    "initialValue": {  // INITIALISE SORTED POSITION TO BE LAST ARRAY ELEMENT
                      "$size": "$$resultArray"
                    },
                    "in": {  // LOOP THRU "0,1,2..."
                      "$cond": [ 
                        {"$lt": [
                          "$$currentSourceArrayElement",
                          {"$arrayElemAt": ["$$resultArray", "$$this"]}
                        ]}, 
                        {"$min": ["$$value", "$$this"]},  // ONLY USE IF LOW VAL NOT YET FOUND
                        "$$value"  // RETAIN INITIAL VAL AGAIN AS NOT YET FOUND CORRECT POSTN
                      ]
                    }
                  }
                }
              },
              "in": {
                // BUILD NEW SORTED ARRAY BY SLICING OLDER ONE & INSERTING NEW ELEMENT BETWEEN
                "$concatArrays": [
                  {"$cond": [  // RETAIN THE EXISTING FIRST PART OF THE NEW ARRAY
                    {"$eq": [0, "$$targetArrayPosition"]}, 
                    [],
                    {"$slice": ["$$resultArray", 0, "$$targetArrayPosition"]},
                  ]},
                  ["$$currentSourceArrayElement"],  // PULL IN THE NEW POSITIONED ELEMENT
                  {"$cond": [  // RETAIN THE EXISTING LAST PART OF THE NEW ARRAY
                    {"$gt": [{"$size": "$$resultArray"}, 0]}, 
                    {"$slice": [
                      "$$resultArray",
                      "$$targetArrayPosition",
                      {"$size": "$$resultArray"}
                    ]},
                    [],
                  ]},
                ]
              } 
            }
          }
        }
      }
    }      
  };
}
