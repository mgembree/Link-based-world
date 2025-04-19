class Start extends Scene {
    create() {
        this.engine.setTitle(this.engine.storyData.Title);
        this.engine.addChoice("Begin your investigation");
    }

    handleChoice() {
        this.engine.gotoScene(Location, this.engine.storyData.InitialLocation);
    }
}

class Location extends Scene {
    create(key) {
        let locationData = this.engine.storyData.Locations[key];
        this.engine.show(locationData.Body);
        
        if (locationData.Choices && locationData.Choices.length > 0) {
            for (let choice of locationData.Choices) {
                if (!choice.Requires || this.checkCondition(choice.Requires)) {
                    this.engine.addChoice(choice.Text, choice);
                }
            }
        } else {
            this.engine.addChoice("The end.");
        }
    }
        checkCondition(requirements) {
            //If player hasnt found the item 
            if (requirements.item && !this.engine.hasItem(requirements.item)) {
                return false;
            }
            //If player hasnt interacted with key object
            if (requirements.flag && !this.engine.getFlag(requirements.flag)) {
                return false;
            }
            return true;
        }
    
    handleChoice(choice) {
        if (choice && choice.Action) {
            if (choice.Action.addItem) {
                this.engine.inventory.push(choice.Action.addItem);
                this.engine.show(`> You acquired the ${choice.Action.addItem}!`);
            }
            if (choice.Action.setFlag) {
                this.engine.setFlag(choice.Action.setFlag, true);
                this.engine.show("> Something changed...");
            }
        }
        
        if (choice && choice.Target) {
            this.engine.show("> " + choice.Text);
            this.engine.gotoScene(Location, choice.Target);
        } else {
            this.engine.gotoScene(End);
        }
    }
}  

class End extends Scene {
    create() {
        this.engine.show("<hr>");
        this.engine.show(this.engine.storyData.Credits);
    }
}

Engine.load(Start, 'myStory.json');