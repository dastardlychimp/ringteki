const _ = require('underscore');
const DrawCard = require('../../drawcard.js');
const PlayAttachmentAction = require('../../playattachmentaction.js');

class PlayTattooedWandererAsAttachment extends PlayAttachmentAction {
    constructor(originalCard, owner, cardData) {
        super();
        this.clone = new DrawCard(owner, cardData);
        this.clone.type = 'attachment';
        this.originalCard = originalCard;
        this.title = 'Play Tattooed Wanderer as an attachment';
    }

    meetsRequirements(context) {
        return (
            context.game.currentPhase !== 'dynasty' &&
            this.originalCard.location === 'hand' &&
            context.player.canPutIntoPlay(this.originalCard) &&
            this.originalCard.canPlay() &&
            this.canResolveTargets(context)
        );
    }
    
    canResolveTargets(context) {
        let clonedContext = _.clone(context);
        clonedContext.source = this.clone;
        return super.canResolveTargets(clonedContext);
    }
    
    resolveTargets(context, results = []) {
        context.source = this.clone;
        return super.resolveTargets(context, results);
    }
    
    executeHandler(context) {
        context.source = this.originalCard;
        context.source.type = 'attachment';
        super.executeHandler(context);
    }
}

class TattooedWanderer extends DrawCard {
    setupCardAbilities(ability) {
        this.abilities.playActions.push(new PlayTattooedWandererAsAttachment(this, this.owner, this.cardData));
        this.whileAttached({
            effect: ability.effects.addKeyword('covert')
        });
    }
    
    leavesPlay() {
        this.type = 'character';
        super.leavesPlay();
    }
}

TattooedWanderer.id = 'tattooed-wanderer';

module.exports = TattooedWanderer;
