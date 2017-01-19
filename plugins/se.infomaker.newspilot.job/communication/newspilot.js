import webstomp from "webstomp-client";
import Query from "./query";

export default class Newspilot {

    constructor(server, login, password, queryUpdateCallback) {
        this.server = server;
        this.login = login;
        this.password = password;

        this.clientInfo = '<clientinfo><osname>np-web</osname></clientinfo>';

        this.queryUpdateCallback = queryUpdateCallback;
        this.queries = new Map(); // queryId -> query
    }

    connect() {
        setInterval(() => this.heartBeat(), 10000);

        return this.createSession()
            .then((sessionId) => {this.sessionId = sessionId; return})
            .then(() => this.stompConnect())
            .then(() => this.stompSubscribe());
    }

    disconnect() {
        this.makeRequest('DELETE', `/newspilot/rest/sessions/${this.sessionId}`);
        this.stompClient.disconnect();
    }

    createSession() {
        return this.makeRequest('POST', '/newspilot/rest/sessions', this.clientInfo);
    }

    heartBeat() {
        return this.makeRequest('PUT', `/newspilot/rest/sessions/${this.sessionId}`);
    }

    stompConnect() {
        this.stompClient = webstomp.client(`ws://${this.server}:61614/stomp`, {
            binary: false,
            heartbeat: {outgoing: 10000, incoming: 10000},
            debug: false
        });

        const np = this;

        return new Promise(function (resolve, reject) {
            const stompConnected = () => resolve();

            const stompError = (msg) => reject(msg);

            np.stompClient.connect(np.login, np.password, stompConnected, stompError);
        });
    }

    stompSubscribe() {
        const np = this;
        const callback = function (frame) {
            const queryEventBulk = JSON.parse(frame.body);
            np.queryUpdate(queryEventBulk);
        };

        this.stompClient.subscribe("jms.topic.UpdateTopic", callback, {'selector': `JMSCorrelationID LIKE '%:${this.sessionId}:%'`});
    }

    addQuery(quid, uuid, query) {
        return this.makeRequest('POST', `/newspilot/rest/queries/?sessionId=${this.sessionId}`, query)
            .then((responseText) => {
                const queryResult = JSON.parse(responseText);

                let query = this.queries.get(queryResult.id);

                if (!query) {
                    query = new Query(queryResult.id);
                    this.queries.set(queryResult.id, query);
                }

                query.addQuid(quid, uuid);

                if (queryResult.activated) {
                    this.fetchQuery(query);
                }
            });
    }

    fetchQuery(query) {
        return this.makeRequest('GET', `/newspilot/rest/queries/${query.queryId}`)
            .then((responseText) => {
                query.setResult(JSON.parse(responseText));
                this.dispatch(query);
            })
    }

    queryUpdate(queryEventBulk) {
        const queryEvents = queryEventBulk.queryEvents;

        for (let queryEvent of queryEvents) {
            const query = this.queries.get(queryEventBulk.queryId);
            if (queryEvent.version === 0) {
                this.fetchQuery(query);
                return;
            }
            else {
                this.dispatch(query, query.updateResult(queryEvent));
            }
        }
    }


    makeRequest(method, url, body) {
        const np = this;

        return new Promise(function (resolve, reject) {
            const xhr = new XMLHttpRequest();

            xhr.open(method, `http://${np.server}:8080${url}`, true);

            xhr.setRequestHeader("Accept", "application/json");
            xhr.setRequestHeader("Content-Type", "application/json");
            xhr.setRequestHeader('Authorization', `Basic ${btoa(np.login + ":" + np.password)}`);
            xhr.withCredentials = false;

            xhr.onload = function () {
                if (this.status >= 200 && this.status < 300) {
                    resolve(xhr.response);
                }
                else {
                    reject({
                        status: this.status,
                        statusText: xhr.statusText
                    });
                }
            };

            xhr.onerror = function () {
                reject({
                    status: this.status,
                    statusText: xhr.statusText
                });
            };

            xhr.send(body);
        });
    }

    dispatch(query, events) {
        if (!events) {
            events = query.getResult();
        }
        this.queryUpdateCallback(query, events);
    }
}
