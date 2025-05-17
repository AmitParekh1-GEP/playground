export function Input(name?: string) {
    return function (target: any, property: string) {
        (target.constructor.ɵinp = target.constructor.ɵinp || {})[name || property] = { property, isBinding: false };
        (target.constructor.ɵinp = target.constructor.ɵinp || {})[`[${name || property}]`] = { property, isBinding: true };
    };
};