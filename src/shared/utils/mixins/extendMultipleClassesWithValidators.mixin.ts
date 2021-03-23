import { getMetadataStorage } from 'class-validator';

type Constructor = new (...args: any[]) => Record<string, never>;
/**
 * @summary
 * Apply TypeScript Mixin to extend multiple classes and copy their validation metadata
 *
 * @link https://www.typescriptlang.org/docs/handbook/mixins.html#alternative-pattern
 */
export default function extendMultipleClassesWithValidatorsMixin<T extends Constructor>(
  derivedCtor: T,
  baseCtors: any[]
) {
  const metadata = getMetadataStorage();

  baseCtors.forEach((baseCtor) => {
    Object.getOwnPropertyNames(baseCtor.prototype).forEach((name) => {
      Object.defineProperty(
        derivedCtor.prototype,
        name,
        Object.getOwnPropertyDescriptor(baseCtor.prototype, name) || Object.create(null)
      );
    });
  });

  baseCtors.forEach((baseCtor) => {
    const constraints = metadata.getTargetValidationMetadatas(baseCtor.prototype.constructor, '', true, true);

    for (const constraint of constraints) {
      let clone = {
        ...constraint,
        target: derivedCtor.prototype.constructor,
      };
      clone = Object.setPrototypeOf(clone, Object.getPrototypeOf(constraint));
      metadata.addValidationMetadata(clone);
    }
  });
}
