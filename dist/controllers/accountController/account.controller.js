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
Object.defineProperty(exports, "__esModule", { value: true });
exports.removeAccount = exports.addAccount = void 0;
const account_model_1 = require("../../models/account.model");
const admin_model_1 = require("./../../models/admin.model");
const facebook_1 = require("./../../config/facebook");
const addAccount = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { socialId, token } = req.body;
    const fullUrl = `${(0, facebook_1.getFBGraphURL)()}?grant_type=fb_exchange_token&client_id=${(0, facebook_1.getAppId)()}&client_secret=${(0, facebook_1.getAppSecret)()}&fb_exchange_token=${token}`;
    try {
        const existingAccount = yield account_model_1.Account.findOne({ socialId });
        if (existingAccount) {
            res.status(400).json({ message: "Account Already exists", success: false, data: {} });
        }
        const long_live_data = yield fetch(fullUrl);
        const long_live_data_json = yield long_live_data.json();
        req.body.addedBy = req.user._id;
        req.body.expiresIn = long_live_data_json.expires_in;
        req.body.accessToken = long_live_data_json.access_token;
        const newAccount = new account_model_1.Account(Object.assign({}, req.body));
        yield admin_model_1.Admin.findByIdAndUpdate(req.user._id, { $push: { accounts: newAccount._id } });
        yield newAccount.save();
        res.status(200).json({ message: "Account created successfully", success: true, data: newAccount });
    }
    catch (error) {
        res.status(500).json({ message: "Server error", seccess: false, error });
    }
});
exports.addAccount = addAccount;
const removeAccount = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const account = yield account_model_1.Account.findByIdAndDelete(id);
        if (!account) {
            res.status(404).json({ message: "Account not found", success: false });
            return;
        }
        yield admin_model_1.Admin.findByIdAndUpdate(req.user._id, { $pull: { accounts: id } });
        res.status(200).json({ message: "Account deleted successfully", success: true, data: {} });
    }
    catch (error) {
        res.status(500).json({ message: "Server error", seccess: false, error });
    }
});
exports.removeAccount = removeAccount;
