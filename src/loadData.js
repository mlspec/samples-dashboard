import namor from 'namor'

// For Loading From Database
import toml from 'toml';
import Gremlin from 'gremlin';
// import * as RNFS from 'react-native-fs';
// Uses a read-only key
var config_full = toml.parse(`[graphdb_testing]
endpoint = "ws://gha-and-aml-test.gremlin.cosmos.azure.com:8182/"
primaryKey = "UGgIOr2sEoli6sh0JrMKe1nw4Csuf5sY61ujoEwnuz50Q3D5FrroGnpQfsgo2s37Bs3g2lbHgcNwXtKU7mELZg=="
database = "metadata_store"
collection = "workflows_testing"
`)
// readFile(filepath: string, encoding?: string)
// RNFS.readFile('./config.toml', 'utf-8').then(res => {
//     config_full = toml.parse(res);
// })
// .catch(err => {
//     console.log(err.message, err.code);
// });

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
  var wfd = new WorkflowData();
  var allData = wfd.get_all_objects();

  return makeDataLevel()
}


export class WorkflowData {

  constructor() {
    var authenticator = new Gremlin.driver.auth.PlainTextSaslAuthenticator(`/dbs/${config.database}/colls/${config.collection}`, config.primaryKey);
    this.gremlin_config_options = {
      authenticator,
      traversalsource: "g",
      rejectUnauthorized: true,
      mimeType: "application/vnd.gremlin-v2.0+json"
    }

    // this.client = new Gremlin.driver.Client(
    //     config.endpoint,
    //     this.gremlin_config_options
    // );
    // const gremlin = require('gremlin');
    var DriverRemoteConnection = Gremlin.driver.DriverRemoteConnection;
    this.Graph = Gremlin.structure.Graph;

    this.gremlin_websocket = new WebSocket('wss://gha-and-aml-test.gremlin.cosmos.azure.com:8182/gremlin')

    // var dc = new DriverRemoteConnection(this.gremlin_websocket,this.gremlin_config_options);

    this.graph = new this.Graph();
    this.g = this.graph.traversal().withRemote(this.gremlin_websocket);
  };


  executeAsyncQuery = function (client, q) {
    return new Promise(function (resolve) {
      console.log(`Running ${q}`);
      client.open = () => resolve(client.send(q, {}));
    });
  };

  get_all_objects = function () {
    // this.executeAsyncQuery("g.V()");
    return this.executeAsyncQuery(this.gremlin_websocket, "g.V()");
  };

  foo = async function () {
    this.client.open();
    var result = await this.executeAsyncQuery(this.client, "g.V()");
    console.log('Woo done!', result);
    this.client.close();
    // But the best part is, we can just keep awaiting different stuff, without ugly .then()s
    // var somethingElse = await getSomethingElse()
    // var moreThings = await getMoreThings()
  }

  // (async function () {
  //     client.open();
  //     var result = await executeAsyncQuery(q);
  //     console.log('Woo done!', result);

  //     // But the best part is, we can just keep awaiting different stuff, without ugly .then()s
  //     // var somethingElse = await getSomethingElse()
  //     // var moreThings = await getMoreThings()
  // })()

}
