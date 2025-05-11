export function Injectable() {
  return function (target: any) {
    target.ɵprov = true;
  };
};