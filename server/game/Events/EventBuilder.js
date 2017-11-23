const _ = require('underscore');

const Event = require('./Event');
const InitiateCardAbilityEvent = require('./InitiateCardAbilityEvent');
const LeavesPlayEvent = require('./LeavesPlayEvent');
const RemoveFateEvent = require('./RemoveFateEvent');

const NameToEvent = {
    default: (name, params, handler) => new Event(name, params, handler),
    onCardAbilityInitiated: (name, params, handler) => new InitiateCardAbilityEvent(params, handler),
    onCardLeavesPlay: (name, params) => new LeavesPlayEvent(params),
    onCardRemoveFate: (name, params) => new RemoveFateEvent(params)
};

class EventBuilder {
    static for(name, params, handler) {
        let factory = NameToEvent.default;
        if(NameToEvent[name]) {
            factory = NameToEvent[name];
        }

        if(params.thenEvents) {
            let thenEvents = _.map(params.thenEvents, event => this.for(event.name, event.params, event.handler));
            let event = factory(name, _.omit(params, 'thenEvents'), handler);
            _.each(thenEvents, thenEvent => {
                thenEvent.parentEvent = event;
            });
            event.thenEvents = thenEvents;
            return event;   
        }

        return factory(name, params, handler);
    }
}

module.exports = EventBuilder;
