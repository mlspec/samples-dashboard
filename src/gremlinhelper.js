import Gremlin from 'gremlin'
import toml from 'toml'
var config_full = toml.parse(`[graphdb_testing]
endpoint = "wss://gha-and-aml-test.gremlin.cosmos.azure.com:443/"
primaryKey = "UGgIOr2sEoli6sh0JrMKe1nw4Csuf5sY61ujoEwnuz50Q3D5FrroGnpQfsgo2s37Bs3g2lbHgcNwXtKU7mELZg=="
database = "metadata_store"
collection = "workflows_testing"
`)

const config = config_full.graphdb_testing

class GremlinHelper {
    returnVal = null;
    constructor() {
        var authenticator = new Gremlin.driver.auth.PlainTextSaslAuthenticator(`/dbs/${config.database}/colls/${config.collection}`, config.primaryKey);

        var config_options = {
            authenticator,
            traversalsource: "g",
            rejectUnauthorized: true,
            mimeType: "application/vnd.gremlin-v2.0+json"
        };

        this._client = new Gremlin.driver.Client(
            config.endpoint,
            config_options
        );

    }

    get Graph() {
        return this.Gremlin.structure.Graph;
    }
    get DriverRemoteConnection() {
        return this.Gremlin.driver.DriverRemoteConnection;
    }

    get Gremlin(){
        return require('gremlin');
    }

    get client() {
        return this._client;
    }

    execute_query(query) {
        var that = this;
        var exec_promise = new Promise((resolve, reject) => { 
            setTimeout(() => { 
                resolve([89, 45, 323]); 
            }, 1); 
        }); 
        exec_promise.then(val => { console.log(val[1])})

        // var executeAsyncQuery = function (client, q) {
        //     return new Promise(function (resolve) {
        //         console.log(`Running ${q}`);
        //         resolve(client.submit(q, {}));
        //     });
        // }

        var executeAsyncQuery = function (client, q) {
            return new Promise(function (resolve) {
                console.log(`Running ${q}`);
                resolve(client.submit(q, {}));
            });
        };

        let results = null;

        let x = (async function () {
            results = await executeAsyncQuery(that.client, query);
            console.log('Woo done!', results);
        })();
        x.then(val => {that.returnVal = val; return val;});

        return results;
    }


}

export default GremlinHelper;
