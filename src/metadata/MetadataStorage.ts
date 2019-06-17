/**
 * Storage all library metadata.
 */


import {ClassMetadata} from "./ClassMetadata";
import {ClassPropertyMetadata} from "./ClassPropertyMetadata";

export type ClassMetadataMap = Map<Object, ClassMetadata>;
export type PropertyMetadataMap = Map<string, ClassPropertyMetadata>;
export type ClassPropertyMetadataMap = Map<Object, PropertyMetadataMap>;

export class MetadataStorage {

  private _metadataClassRegistry = new Map<string, ClassMetadataMap>();
  private _metadataPropertyRegistry = new Map<string, Map<Object, PropertyMetadataMap>>();

  registerClassMetadata(key: string): boolean {
    if (!this._metadataClassRegistry.has(key)) {
      this._metadataClassRegistry.set(key, new Map<Object, ClassMetadata>());
      return true;
    }
    return false; // the key is already registered
  }

  registerPropertyMetadata(key: string): boolean {
    if (!this._metadataPropertyRegistry.has(key)) {
      this._metadataPropertyRegistry.set(key, new Map<Object, PropertyMetadataMap>());
      return true;
    }
    return false; // the key is already registered
  }

  addClassMetadata(key: string, metadata: ClassMetadata) {
    if (!this._metadataClassRegistry.has(key)) {
      this.registerClassMetadata(key);
    }
    if (!((this._metadataClassRegistry.get(key) as ClassMetadataMap).has(metadata.target))) {
      (this._metadataClassRegistry.get(key) as ClassMetadataMap).set(metadata.target, metadata);
    }
  }

  addPropertyMetadata(key: string, metadata: ClassPropertyMetadata) {
    if (!this._metadataPropertyRegistry.has(key)) {
      this.registerPropertyMetadata(key);
    }
    // check if class is registered
    if (!((this._metadataPropertyRegistry.get(key) as ClassPropertyMetadataMap).has(metadata.target))) {
      (this._metadataPropertyRegistry.get(key) as ClassPropertyMetadataMap).set(metadata.target, new Map<string, ClassPropertyMetadata>());
    }

    // register the property metadata
    ((this._metadataPropertyRegistry.get(key) as ClassPropertyMetadataMap)
      .get(metadata.target) as PropertyMetadataMap).set(metadata.propertyName, metadata)

  }

  getClassMetadata(key: string, target: Object): ClassMetadata {

    const store: ClassMetadataMap | undefined = this._metadataClassRegistry.get(key);
    if (!store) {
      throw new Error(`Could not find registered class store: ${key}`);
    }

    target = Object.getPrototypeOf(target);

    const metadataFromTargetMap = store.get(target);
    if (metadataFromTargetMap) {
      return metadataFromTargetMap;
    }

    throw new Error('Could not find class metadata');

  }

  hasClassMetadata(key: string, target: Object): boolean {

    const store: ClassMetadataMap | undefined = this._metadataClassRegistry.get(key);
    if (!store) {
      return false;
    }

    target = Object.getPrototypeOf(target);

    return store.has(target);

  }

  getPropertyMetadata(key: string, target: Object, propertyName: string): ClassPropertyMetadata {
    const store: ClassPropertyMetadataMap | undefined = this._metadataPropertyRegistry.get(key);
    if (!store) {
      throw new Error(`Could not find registered class property store: ${key}`);
    }
    return this.findMetadata(store, target, propertyName);
  }

  getPropertyMetadatas(key: string, target: Object): ClassPropertyMetadata[] {
    const store: ClassPropertyMetadataMap | undefined = this._metadataPropertyRegistry.get(key);
    if (!store) {
      throw new Error(`Could not find registered class property store: ${key}`);
    }
    return this.getMetadata(store, target);
  }

  hasPropertyMetadata(key: string, target: Object, propertyName: string): boolean {
    const store: ClassPropertyMetadataMap | undefined = this._metadataPropertyRegistry.get(key);
    if (!store) {
      return false;
    }
    if (!(store.has(target))) {
      return false;
    }
    if (!((store.get(target) as PropertyMetadataMap).has(propertyName))) {
      return false;
    }
    return true;
  }

  clear() {
    this._metadataClassRegistry.clear();
    this._metadataPropertyRegistry.clear();
  }

  // -------------------------------------------------------------------------
  // Private Methods
  // -------------------------------------------------------------------------

  private getMetadata<T extends ClassPropertyMetadata>(metadatas: Map<Object, Map<string, T>>, target: Object): T[] {

    if (!metadatas.has(target)) {
      target = Object.getPrototypeOf(target);
    }

    const metadataFromTargetMap = metadatas.get(target);

    let metadataFromTarget: T[] = [];

    if (metadataFromTargetMap) {
      metadataFromTarget = Array.from(metadataFromTargetMap.values()).filter(meta => meta.propertyName !== undefined);
    }

    return metadataFromTarget;

  }

  private findMetadata<T extends ClassPropertyMetadata>(metadatas: Map<Object, Map<string, T>>, target: Object, propertyName: string): T {

    target = Object.getPrototypeOf(target);

    const metadataFromTargetMap = metadatas.get(target);
    if (metadataFromTargetMap) {
      const metadataFromTarget = metadataFromTargetMap.get(propertyName);
      if (metadataFromTarget) {
        return metadataFromTarget;
      }
    }

    throw new Error('Could not find metadata');

  }


}
