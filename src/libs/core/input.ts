export function Input() {
    return function (target: any, property: string) {
        (target.constructor.ɵinp = target.constructor.ɵinp || []).push(property);
    };
};