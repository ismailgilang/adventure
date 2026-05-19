"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.db = void 0;
const serverless = __importStar(require("@neondatabase/serverless"));
const neonHttp = __importStar(require("drizzle-orm/neon-http"));
const schema = __importStar(require("./schema"));
// Helper to safely extract exports from CommonJS or ESM imports in edge bundlers
const getExport = (module, key) => {
    if (!module)
        return undefined;
    if (module[key] !== undefined)
        return module[key];
    if (module.default && module.default[key] !== undefined)
        return module.default[key];
    return undefined;
};
const neon = getExport(serverless, 'neon');
const neonConfig = getExport(serverless, 'neonConfig');
const drizzle = getExport(neonHttp, 'drizzle');
if (neonConfig) {
    neonConfig.fetchConnectionCache = true;
}
let _db = null;
function getDbInstance() {
    if (!_db) {
        const connectionString = process.env.DATABASE_URL;
        if (!connectionString) {
            throw new Error("DATABASE_URL environment variable is not defined!");
        }
        _db = drizzle(neon(connectionString), { schema });
    }
    return _db;
}
// Export a Proxy that intercepts all database operations and delegates to the dynamically initialized Drizzle client
exports.db = new Proxy({}, {
    get(target, prop, receiver) {
        const instance = getDbInstance();
        const value = Reflect.get(instance, prop, receiver);
        if (typeof value === 'function') {
            return value.bind(instance);
        }
        return value;
    }
});
__exportStar(require("./schema"), exports);
__exportStar(require("drizzle-orm"), exports);
