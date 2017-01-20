import {majorToName} from "./npentitytype";

export default class Query {

    constructor(queryId) {
        this.queryId = queryId;
        this.quids = [];
    }

    addQuid(quid, uuid) {
        this.quids.push({"quid": quid, "uuid": uuid});
    }

    findEntity(entityType, id) {
        const typedNodes = this.nodes.get(entityType);
        if (!typedNodes) {
            return undefined;
        }
        return typedNodes.get(id);
    }

    addEntity(entity) {
        let typedNodes = this.nodes.get(entity.entityType);
        if (!typedNodes) {
            typedNodes = new Map();
            this.nodes.set(entity.entityType, typedNodes);
        }
        typedNodes.set(entity.id, entity);
    }

    removeEntity(entityType, id) {
        const typedNodes = this.nodes.get(entityType);
        if (!typedNodes) {
            return;
        }
        typedNodes.delete(id);
    }

    updateEntity(entityType, id, deltaValues) {
        const entity = this.findEntity(entityType, id);
        const updatedKeys = [];

        if (entity) {
            for (let property in deltaValues) {
                if (deltaValues.hasOwnProperty(property)) {
                    entity[property] = deltaValues[property];
                    updatedKeys.push(property);
                }
            }
            return {entity, updatedKeys};
        }
    }

    setResult(queryResult) {
        this.entityType = majorToName(queryResult.majorType);

        this.version = queryResult.version;

        this.nodes = new Map(); // map from nodeType -> map from id -> node object

        for (let entity of queryResult.nodes) {
            this.addEntity(entity);
        }
    }

    updateResult(queryEvent) {
        // todo: handle pending events

        if (queryEvent.version !== this.version + 1) {
            console.log("Query version mismatch, expected", this.version + 1, " but got ", queryEvent.version);
        }

        const entityEvents = [];

        for (let deltaEntityEvent of queryEvent.deltaEntityEvents) {
            entityEvents.push(this.updateDelta(deltaEntityEvent));
        }

        this.version++;

        return entityEvents;
    }

    updateDelta(deltaEntityEvent) {
        const id = deltaEntityEvent.id;
        const entityType = deltaEntityEvent.entityType;
        const eventType = deltaEntityEvent.eventType;
        const deltaValues = deltaEntityEvent.deltaValues;

        let currentValues = {};
        let changedKeys = [];

        switch (eventType) {
            case "CREATE":
                this.addEntity(deltaValues);
                currentValues = deltaValues;
                break;
            case "REMOVE":
                this.removeEntity(entityType, id);
                break;
            case "CHANGE": {
                const {entity, updatedKeys} = this.updateEntity(entityType, id, deltaValues);
                currentValues = entity;
                changedKeys = updatedKeys;
                break;
            }
            default:
                console.log("Unknown eventType", eventType);
        }

        return {id, eventType, entityType, currentValues, changedKeys};
    }

    getResult() {
        const events = [];
        const eventType = "CREATE";
        const changedKeys = [];

        const typedNodes = this.nodes.get(this.entityType);
        typedNodes.forEach((currentValues, id) => {
            const entityType = currentValues.entityType;
            const event = {id, eventType, entityType, currentValues, changedKeys};
            events.push(event);
        });

        return events;
    }
}
