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
exports.getAccountsByInstitute = exports.removeAccount = exports.addAccount = void 0;
const account_model_1 = require("../../models/account.model");
const admin_model_1 = require("./../../models/admin.model");
const addAccount = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { institute } = req.user;
    const { socialId, token } = req.body;
    try {
        const existingAccount = yield account_model_1.Account.findOne({ socialId });
        if (existingAccount) {
            return res.status(400).json({ message: "Account Already exists", success: false, data: {} });
        }
        req.body.addedBy = req.user._id;
        req.body.tokenExpires = new Date(Date.now() + 59 * 24 * 3600 * 1000);
        const newAccount = new account_model_1.Account(Object.assign(Object.assign({}, req.body), { institute }));
        yield admin_model_1.Admin.findByIdAndUpdate(req.user._id, { $push: { accounts: newAccount._id } });
        yield newAccount.save();
        return res.status(200).json({ message: "Account created successfully", success: true, data: newAccount });
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Server error", seccess: false, error });
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
const getAccountsByInstitute = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { institute } = req.user;
        const accounts = yield account_model_1.Account.find({ institute });
        if (!accounts) {
            res.status(404).json({ message: "No accounts found for this institute", success: false, data: [] });
            return;
        }
        res.status(200).json({ message: "Accounts retrieved successfully", success: true, data: accounts });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ message: "Server error", seccess: false, error });
    }
});
exports.getAccountsByInstitute = getAccountsByInstitute;
