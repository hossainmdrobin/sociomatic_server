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
// Third party libraries
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const cors_1 = __importDefault(require("cors"));
const morgan_1 = __importDefault(require("morgan"));
// routes imports
const auth_routes_1 = __importDefault(require("./routes/auth.routes"));
const accouts_routes_1 = __importDefault(require("./routes/accounts/accouts.routes"));
const posts_routes_1 = __importDefault(require("./routes/posts/posts.routes"));
// DB connections
const connection_1 = require("./dataBase/connection");
// Custom functions
const agendaConfig_1 = __importDefault(require("./agendaConfig"));
const schedulePost_1 = __importDefault(require("./jobs/schedulePost"));
const postToFacebook_1 = __importDefault(require("./jobs/postToFacebook"));
const publishPost_1 = require("./jobs/publishPost");
dotenv_1.default.config();
const app = (0, express_1.default)();
const PORT = process.env.PORT || 5000;
app.use(express_1.default.json());
app.use((0, cors_1.default)());
app.use((0, morgan_1.default)("dev"));
app.use("/api/auth", auth_routes_1.default);
app.use("/api/accounts", accouts_routes_1.default);
app.use("/api/posts", posts_routes_1.default);
app.get("/", (req, res) => {
    res.send("Server is running...");
});
(0, connection_1.connectDB)();
// agenda.define("agenda running", () => {
//   console.log("Agenda is running");
// });
// Ensure the agenda is connected to the database before starting
agendaConfig_1.default.on('ready', () => {
    console.log("Agenda is ready");
});
// Starting agenda after the database connection
(() => __awaiter(void 0, void 0, void 0, function* () {
    yield agendaConfig_1.default.start();
    console.log("Agenda started");
    (0, schedulePost_1.default)(agendaConfig_1.default);
    (0, publishPost_1.publishPost)(agendaConfig_1.default);
    (0, postToFacebook_1.default)(agendaConfig_1.default);
    yield agendaConfig_1.default.every('30 seconds', 'schedule post');
}))();
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
