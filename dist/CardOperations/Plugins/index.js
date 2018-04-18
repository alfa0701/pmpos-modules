"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const CreateCard_1 = require("./CreateCard");
const SetCardTag_1 = require("./SetCardTag");
const CloseCard_1 = require("./CloseCard");
const ExecuteCommand_1 = require("./ExecuteCommand");
const SetState_1 = require("./SetState");
const AskQuestion_1 = require("./AskQuestion");
const SelectCard_1 = require("./SelectCard");
const SetCardIndex_1 = require("./SetCardIndex");
const CommitCard_1 = require("./CommitCard");
const DisplayCard_1 = require("./DisplayCard");
exports.default = [
    new CreateCard_1.default(),
    new SetCardTag_1.default(),
    new CloseCard_1.default(),
    new CommitCard_1.default(),
    new DisplayCard_1.default(),
    new SetCardIndex_1.default(),
    new ExecuteCommand_1.default(),
    new SetState_1.default(),
    new AskQuestion_1.default(),
    new SelectCard_1.default()
];
//# sourceMappingURL=index.js.map