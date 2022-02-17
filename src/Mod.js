"use strict";
const config = require("../config/config.json");
const mod = require("../package.json");
const HideoutItems = require("./HideoutItems.json");
const QuestItems = require("./QuestItems.json");


const modName = mod.name;
const version = mod.version;
const database = DatabaseServer.tables;

class Mod {
    constructor() {
        this.mod = modName;
        Logger.log(`Loading: ${modName} : ${version}`);
        ModLoader.onLoad[this.mod] = this.load.bind(this);
    }

    load() {

        //Logger.log(`[${modName} : ${version}] : ----- Enabled -----`, "white", "green")
        if (!config) {
            Logger.info(`[${modName} : ${version}] : config file not found. unable to load mod.`, "white", "red");
            return;
        }

        if (!HideoutItems) {
            Logger.info(`[${modName} : ${version}] : item file not found. unable to load mod.`, "white", "red");
            return;
        }

        if (!QuestItems) {
            Logger.info(`[${modName} : ${version}] : item file not found. unable to load mod.`, "white", "red");
            return;
        }

        const botTypes = this.GetEnabledBotTypes(config);
        const bot = database.bots.types;
        let itemAddedCount = 0;

        // loop over bot types
        for (let botTypeString of botTypes) {
            let botType = bot[botTypeString];

            // Add items
            if (config.AddHideoutItems) {
                for (let i in HideoutItems.ItemsToAdd) {
                    let id = HideoutItems.ItemsToAdd[i];
                    if (!botType.inventory.items.Backpack[id]) {
                        if (config.Debug) {
                            Logger.log(`[${modName} : ${version}] : adding hideout item ${id} to ${botTypeString}`, "blue")
                        }
                        botType.inventory.items.Backpack.push(id);
                        itemAddedCount++;
                    }
                }
            }

            if (config.AddQuestItems) {
                for (let i in QuestItems.ItemsToAdd) {
                    let id = QuestItems.ItemsToAdd[i];
                    if (!botType.inventory.items.Backpack[id]) {
                        if (config.Debug) {
                            Logger.log(`[${modName} : ${version}] : adding quest item ${id} to ${botTypeString}`, "blue")
                        }
                        botType.inventory.items.Backpack.push(id);
                        itemAddedCount++;
                    }
                }
            }
        }
        if (config.ShowResultDescriptionText) {
            Logger.info(`[${modName} : ${version}] : Added a total of ${itemAddedCount} items in ${botTypes.join()} loot pools`), "magenta", "white";
        }
    };

    GetEnabledBotTypes(config) {
        let typesToUpdate = [];
        if (config.AddItemsToUsec) {
            typesToUpdate.push('usec')
        }

        if (config.AddItemsToBear) {
            typesToUpdate.push('bear')
        }

        if (config.AddItemsToScav) {
            typesToUpdate.push('assault')
            typesToUpdate.push('marksman')
        }
        return typesToUpdate;
    };
};

module.exports.Mod = Mod;