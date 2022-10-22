export class SvelteVscMessageTypes {
    static example = "example";
    static getRuleSource = "getRuleSource";
    static ruleOverride = "ruleOverride";
    static processExamples = "processExamples";
    static getRules = "getRulesRequest";
    static reset = "reset";
    static translationRequest = "translationRequest";
}

export class VscSvelteMessageTypes {
    static translation = "translation";
    static exampleStatus = 'postExampleStatusToView';
    static overrideStatus = 'postOverrideStatusToView';
    static ruleSource = 'ruleSource';
    static rules = 'postRulesToView';
}