var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
import { readFileSync, writeFileSync } from "fs";
var DataStore = /** @class */ (function () {
    function DataStore(filePath) {
        this.filePath = filePath;
        this.file = readFileSync(filePath, "utf-8");
        this.array = __spreadArray([], JSON.parse(this.file), true);
        this.map = this.array.reduce(function (acc, obj) {
            acc.set(obj.id, obj);
            return acc;
        }, new Map());
    }
    DataStore.prototype.save = function () {
        writeFileSync(this.filePath, JSON.stringify(this.array));
    };
    DataStore.prototype.create = function (key, value) {
        if (this.map.has(key)) {
            throw new Error("DataStore : From ".concat(this.filePath, " key exists"));
        }
        this.map.set(key, value),
            this.array.push(value);
    };
    DataStore.prototype.getSize = function () {
        return this.array.length;
    };
    DataStore.prototype.getAllInArray = function () {
        return this.array;
    };
    DataStore.prototype.getInMap = function () {
        return this.map;
    };
    DataStore.prototype.getById = function (key) {
        if (!this.map.has(key)) {
            throw new Error("DataStore : From ".concat(this.filePath, " item doesn't exists"));
        }
        return this.map.get(key);
    };
    DataStore.prototype.getByIdList = function () {
        var keys = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            keys[_i] = arguments[_i];
        }
        var list = [];
        for (var _a = 0, keys_1 = keys; _a < keys_1.length; _a++) {
            var key = keys_1[_a];
            var item = this.getById(key);
            list.push(item);
        }
        return list;
    };
    DataStore.prototype.update = function (key, value) {
        if (!this.map.has(key)) {
            throw new Error("DataStore : From ".concat(this.filePath, " item doesn't exists"));
        }
        this.map.set(key, value);
        var index = this.array.findIndex(function (item) { return item.id === key; });
        this.array[index] = value;
    };
    DataStore.prototype.delete = function (key) {
        if (!this.map.has(key)) {
            throw new Error("DataStore : From ".concat(this.filePath, " item doesn't exists"));
        }
        this.map.delete(key);
        var index = this.array.findIndex(function (item) { return item.id === key; });
        this.array.splice(index, 1);
    };
    return DataStore;
}());
export { DataStore };
//# sourceMappingURL=dataStore.js.map