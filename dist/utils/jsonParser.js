"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseJSON = parseJSON;
exports.cleanJSONString = cleanJSONString;
function parseJSON(input) {
    try {
        let cleaned = input.trim();
        cleaned = cleaned.replace(/^```json\s*/i, "").replace(/```$/i, "").trim();
        const data = JSON.parse(cleaned);
        return { success: true, data };
    }
    catch (error) {
        return {
            success: false,
            error: `JSON parse error: ${error.message}`,
        };
    }
}
function cleanJSONString(input) {
    let cleaned = input.trim();
    cleaned = cleaned.replace(/^```json\s*/gi, "").replace(/^```\s*/gi, "").replace(/```$/gi, "");
    cleaned = cleaned.trim();
    return cleaned;
}
