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
        ? parseInt(levelOverride.toString(), 10)
        : contextLevel !== undefined
            ? contextLevel + 1
            : 2;
    levelRange(newLevel);
    return (react_1.default.createElement(exports.LevelContext.Provider, { value: newLevel }, children));
}
exports.Level = Level;
const MAXIMUM_LEVEL = 6;
function H(props) {
    const { children, offset, ...otherProps } = props;
    const level = react_1.useContext(exports.LevelContext);
    const propopsedNewLevel = (level !== undefined ? level : 1) +
        (offset !== undefined ? parseInt(offset.toString(), 10) : 0);
    const newLevel = levelRange(propopsedNewLevel);
    return react_1.default.createElement(`h${newLevel}`, otherProps, children);
}
exports.H = H;
function levelRange(level) {
    if (level <= 0 || level > MAXIMUM_LEVEL) {
        const errorMessage = `Heading level "${level}" is not valid HTML5 which only allows levels 1-${MAXIMUM_LEVEL}.`;
        if (process && process.env && process.env.NODE_ENV === "development") {
            throw Error(errorMessage);
        }
        else {
            console.error(errorMessage);
        }
        // clamp values
        if (level > MAXIMUM_LEVEL) {
            return MAXIMUM_LEVEL;
        }
        else if (level < 1) {
            return 1;
        }
    }
    return level;
}
function useLevel() {
    const level = react_1.useContext(exports.LevelContext);
    const propopsedNewLevel = level !== undefined ? level : 1;
    const newLevel = levelRange(propopsedNewLevel);
    return newLevel;
}
exports.useLevel = useLevel;
//# sourceMappingURL=index.js.map