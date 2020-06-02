import namor from 'namor'

// For Loading From Database
import toml from 'toml';
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
// var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
// var xhr = new XMLHttpRequest();
import GremlinHelper from './gremlinhelper.js';
import browserify from 'browserify';

// import * as RNFS from 'react-native-fs';
// Uses a read-only key
var config_full = toml.parse(`[graphdb_testing]
endpoint = "ws://gha-and-aml-test.gremlin.cosmos.azure.com:8182/"
primaryKey = "UGgIOr2sEoli6sh0JrMKe1nw4Csuf5sY61ujoEwnuz50Q3D5FrroGnpQfsgo2s37Bs3g2lbHgcNwXtKU7mELZg=="
database = "metadata_store"
collection = "workflows_testing"
`)

const config = config_full.graphdb_testing
const range = len => {
  const arr = []
  for (let i = 0; i < len; i++) {
    arr.push(i)
  }
  return arr
}

const newPerson = () => {
  const statusChance = Math.random()
  return {
    firstName: namor.generate({ words: 1, numbers: 0 }),
    lastName: namor.generate({ words: 1, numbers: 0 }),
    age: Math.floor(Math.random() * 30),
    visits: Math.floor(Math.random() * 100),
    progress: Math.floor(Math.random() * 100),
    status:
      statusChance > 0.66
        ? 'relationship'
        : statusChance > 0.33
          ? 'complicated'
          : 'single',
  }
}

const newWorkflow = (id_value) => {
  return {
    id: id_value
  };
}

function loadJSON(jsonfile, callback) {   

  // var xobj = new XMLHttpRequest();
  // var xobj = new xhr();
  // xobj.overrideMimeType("application/json");
  // xobj.open('GET', jsonfile, true); // Replace 'my_data' with the path to your file
  // xobj.onreadystatechange = function () {
  //       if (xobj.readyState == 4 && xobj.status == "200") {
  //         // Required use of an anonymous callback as .open will NOT return a value but simply returns undefined in asynchronous mode
  //         callback(xobj.responseText);
  //       }
  // };
  // xobj.send(null);  
}

export default function makeData(...lens) {
  const makeDataLevel = (depth = 0) => {
    const len = lens[depth]
    return range(len).map(d => {
      return {
        ...newPerson(),
        subRows: lens[depth + 1] ? makeDataLevel(depth + 1) : undefined,
      }
    })
  }

  const loadDataLevel = (depth = 0) => {
    const len = lens[depth]
    return range(len).map(d => {
      return {
        ...newPerson(),
        subRows: lens[depth + 1] ? makeDataLevel(depth + 1) : undefined,
      }
    })
  }


  loadJSON(function(response) {
    // Parse JSON string into object
      var actual_JSON = JSON.parse(response);
   });

  var db_mock = require('./db.json')

  console.log('Length: ' + db_mock)

  let obj = db_mock[0]
  return makeDataLevel();
}



export class WorkflowData {
  constructor() {
    this._gh = new GremlinHelper();
  }

  execute_query(query) {
    return this._gh.execute_query(query)
  }

}

makeData();

// var wfd = new WorkflowData();
// var results = null;
// var bauoe = wfd.execute_query("g.V('package|999999999999.9.4678|aefd467b-35a7-4a4c-9295-1ab8d52d53f4')")
// var b = wfd.returnVal;
// var q = bauoe;