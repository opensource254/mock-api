"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
/* GET home page. */
router.get('/', (req, res, next) => {
    // Assuming 'index' is a view template and 'title' is a variable for it.
    // If view engine is not set up, this will error at runtime.
    // For a pure API, might return JSON: res.json({ message: 'Welcome' });
    res.render('index', { title: 'Express' });
});
exports.default = router;
