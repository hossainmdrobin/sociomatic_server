"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.connectDB = void 0;
// give me a code to connect mongoDB with mongoose
const mongoose_1 = __importDefault(require("mongoose"));
const MONGO_URI = process.env.MONGODB_URI || '';
console.log(MONGO_URI);
const connectDB = () => __awaiter(void 0, void 0, void 0, function* () {
    // defineFacebookJob(agenda);
    try {
        if (!MONGO_URI) {
            throw new Error('❌ MongoDB URI is not defined in environment variables');
        }
        yield mongoose_1.default.connect(MONGO_URI);
        console.log('✅MongoDB connected');
        // await agenda.start();
        // console.log('✅ Agenda started');
        // agenda.on('ready', () => console.log('Agenda is ready'));
        // agenda.on('error', (err: Error) => console.error('❌ Agenda error:', err));
    }
    catch (err) {
        console.error('❌ MongoDB connection error:', err);
        process.exit(1); // Exit the app on DB connection failure
    }
});
exports.connectDB = connectDB;
