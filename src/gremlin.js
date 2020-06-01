
class GremlinHelper {
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
        return this.client;
    }

    constructor() {
        var authenticator = new Gremlin.driver.auth.PlainTextSaslAuthenticator(`/dbs/${config.database}/colls/${config.collection}`, config.primaryKey);

        var config_options = {
            authenticator,
            traversalsource: "g",
            rejectUnauthorized: true,
            mimeType: "application/vnd.gremlin-v2.0+json"
        };

        this.client = new Gremlin.driver.Client(
            config.endpoint,
            cocnfig_options
        );

    }

    execute_query(query) {
        var executeAsyncQuery = function (q) {
            return new Promise(function (resolve) {
                console.log(`Running ${q}`);
                resolve(client.submit(q, {}));
            });
        }

        var results = null

        (async function () {
            client.open();
            results = await executeAsyncQuery(q);
            console.log('Woo done!', results);

        })();

        return results;
    }


}

export default GremlinHelper;
