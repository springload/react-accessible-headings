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
    const { children, depth: levelOverride } = props;
    const contextLevel = react_1.useContext(exports.LevelContext);
    const newLevel = levelOverride !== undefined
        ? levelOverride
        : contextLevel !== undefined
            ? contextLevel + 1
            : 2;
    return (react_1.default.createElement(exports.LevelContext.Provider, { value: newLevel }, children));
}
exports.Level = Level;
const MAXIMUM_LEVEL = 6;
function H(props) {
    const { children, offset, ...otherProps } = props;
    const level = react_1.useContext(exports.LevelContext);
    const newLevel = (level !== undefined ? level : 1) + (offset !== undefined ? offset : 0);
    if (newLevel > MAXIMUM_LEVEL) {
        throw Error(`Heading level "${newLevel}" exceeds maximum level of ${MAXIMUM_LEVEL}.`);
    }
    return react_1.default.createElement(`h${newLevel}`, otherProps, children);
}
exports.H = H;
//# sourceMappingURL=index.js.map