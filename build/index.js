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
    const { children, value: levelOverride } = props;
    const contextLevel = react_1.useContext(exports.LevelContext);
    const newLevel = levelOverride !== undefined
        ? levelOverride
        : contextLevel !== undefined
            ? contextLevel + 1
            : 2;
    assertLevelRange(newLevel);
    return (react_1.default.createElement(exports.LevelContext.Provider, { value: newLevel }, children));
}
exports.Level = Level;
const MAXIMUM_LEVEL = 6;
function H(props) {
    const { children, offset, ...otherProps } = props;
    const level = react_1.useContext(exports.LevelContext);
    const newLevel = (level !== undefined ? level : 1) + (offset !== undefined ? offset : 0);
    assertLevelRange(newLevel);
    return react_1.default.createElement(`h${newLevel}`, otherProps, children);
}
exports.H = H;
function assertLevelRange(level) {
    if (level <= 0 || level > MAXIMUM_LEVEL) {
        throw Error(`Heading level "${level}" not valid HTML5 which only allows levels 1-${MAXIMUM_LEVEL}.`);
    }
}
function useLevel() {
    const level = react_1.useContext(exports.LevelContext);
    const newLevel = level !== undefined ? level : 1;
    return newLevel;
}
exports.useLevel = useLevel;
//# sourceMappingURL=index.js.map