"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const agenda_1 = __importDefault(require("agenda"));
const AgendaConstructor = typeof agenda_1.default === "function"
    ? agenda_1.default
    : agenda_1.default.Agenda || agenda_1.default.default;
const agenda = new AgendaConstructor({
    mongo: mongoose_1.default.connection,
    collection: "agendaJobs",
    defaultConcurrency: 5,
    maxConcurrency: 10,
    defaultLockLifetime: 10 * 60 * 1000,
});
agenda.on("error", (error) => {
    console.error("[Agenda] Error:", error);
});
exports.default = agenda;
