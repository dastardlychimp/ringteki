const DrawCard = require('../../drawcard.js');

class Banzai extends DrawCard {
    setupCardAbilities(ability) {
        this.action({
            title: 'Increase a character\'s military skill',
            condition: () => this.game.currentConflict,
            max: ability.limit.perConflict(1),
            target: {
                cardType: 'character',
                cardCondition: card => this.game.currentConflict.isParticipating(card)
            },
            handler: context => {
                this.game.addMessage('{0} uses {1} to grant 2 military skill to {2}', this.controller, this, context.target);
                this.untilEndOfConflict(ability => ({
                    match: context.target,
                    effect: ability.effects.modifyMilitarySkill(2)
                }));
                this.game.promptWithHandlerMenu(this.controller, {
                    activePromptTitle: 'Select one',
                    source: this,
                    choices: ['Lose 1 honor to resolve this ability again', 'Done'],
                    handlers: [
                        () => {
                            this.game.addHonor(this.controller, -1);
                            this.game.promptForSelect(this.controller, {
                                source: this,
                                cardType: 'character',
                                cardCondition: card => this.game.currentConflict.isParticipating(card),
                                onSelect: (player, card) => {
                                    this.game.addMessage('{0} loses 1 honor to resolve {1} again, granting 2 military skill to {2}', player, this, card);
                                    context.targets.target = card;
                                    context.target = card;
                                    context.dontRaiseCardPlayed = true;
                                    this.game.raiseInitiateAbilityEvent({ card: this, context: context }, () => {
                                        this.untilEndOfConflict(ability => ({
                                            match: card,
                                            effect: ability.effects.modifyMilitarySkill(2)
                                        }));
                                        this.game.promptWithHandlerMenu(player, {
                                            source: this,
                                            choices: ['Lose 1 honor for no effect', 'Done'],
                                            handlers: [() => {
                                                this.game.addMessage('{0} loses 1 honor for no effect', player);
                                                this.game.addHonor(player, -1);
                                            }, () => true]
                                        });
                                    });
                                    return true;
                                }
                            });
                        },
                        () => true
                    ]
                });
            }
        });
    }
}

Banzai.id = 'banzai';

module.exports = Banzai;
