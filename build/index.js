"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importStar(require("react"));
exports.LevelContext = react_1.default.createContext(1);
function Level(props) {
    const { children } = props;
    const level = react_1.useContext(exports.LevelContext);
    const newLevel = level !== undefined ? level + 1 : 2;
    // assertValidLevel(newLevel); // Harmless to increase depth beyond
    return (react_1.default.createElement(exports.LevelContext.Provider, { value: newLevel }, children));
}
exports.Level = Level;
function H(props) {
    const { children, offset } = props;
    const level = react_1.useContext(exports.LevelContext);
    const newLevel = (level !== undefined ? level : 1) + offset !== undefined ? offset : 0;
    assertValidLevel(newLevel);
    return react_1.default.createElement(`h${level === undefined ? 1 : level}`, null, children);
}
exports.H = H;
const assertValidLevel = (level) => {
    if (level > MAXIMUM_LEVEL) {
        throw Error(`Heading level "${level}" exceeds maximum level of ${MAXIMUM_LEVEL}.`);
    }
};
const MAXIMUM_LEVEL = 6;
//# sourceMappingURL=index.js.map