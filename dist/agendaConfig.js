"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const agenda_1 = __importDefault(require("agenda"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
console.log(process.env.MONGODB_URI, 'consoling from agendaConfig.ts');
const agenda = new agenda_1.default({
    db: {
        address: process.env.MONGODB_URI || '',
        collection: 'agendaJobs'
    }
});
agenda.defaultConcurrency(5);
agenda.maxConcurrency(20);
exports.default = agenda;
