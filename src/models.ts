export class Example {
    dsl: string;
    code: string;
    id: string;

    constructor(id: string, sourceValue: string, targetValue: string) {
        this.id = id;
        this.dsl = sourceValue;
        this.code = targetValue;
    }
};

export class Rule {
    id: string;
    name: string;
    dsl: string;
    code: string;

    constructor(id: string, name: string, sourceValue: string, targetValue: string) {
        this.id = id;
        this.name = name;
        this.dsl = sourceValue;
        this.code = targetValue;
    }
};