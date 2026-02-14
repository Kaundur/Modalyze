export function mergeClassNames(...classes: (string | false | null | undefined)[]) {
    return classes.filter(Boolean).join(' ');
}
