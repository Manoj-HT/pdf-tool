import { readFileSync, writeFileSync } from "fs";

export class DataStore {
  filePath!: string;
  file!: string;
  array!: any[];
  map!: Map<string, any>;
  constructor(filePath: string) {
    this.filePath = filePath;
    this.file = readFileSync(filePath, "utf-8");
    this.array = [...JSON.parse(this.file)];
    this.map = this.array.reduce((acc, obj) => {
      acc.set(obj.id, obj);
      return acc;
    }, new Map());
  }

  save(){
    writeFileSync(this.filePath, JSON.stringify(this.array))
  }

  create(key: string, value: any){
    if(this.map.has(key)){
        throw new Error(`DataStore : From ${this.filePath} key exists`);
    }
    this.map.set(key, value),
    this.array.push(value)
  }

  getSize() {
    return this.array.length;
  }

  getAllInArray() {
    return this.array;
  }

  getInMap() {
    return this.map;
  }

  getById(key : string) {
    if (!this.map.has(key)) {
      throw new Error(`DataStore : From ${this.filePath} item doesn't exists`);
    }
    return this.map.get(key);
  }

  getByIdList(...keys : string[]) {
    let list = [];
    for (let key of keys) {
      let item = this.getById(key);
      list.push(item);
    }
    return list;
  }

  update(key: string, value : any) {
    if (!this.map.has(key)) {
      throw new Error(`DataStore : From ${this.filePath} item doesn't exists`);
    }
    this.map.set(key, value);
    let index = this.array.findIndex((item) => item.id === key);
    this.array[index] = value;
  }

  delete(key : string) {
    if (!this.map.has(key)) {
      throw new Error(`DataStore : From ${this.filePath} item doesn't exists`);
    }
    this.map.delete(key);
    let index = this.array.findIndex((item) => item.id === key);
    this.array.splice(index, 1);
  }

}
