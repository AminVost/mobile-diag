export interface TestStep {
    Modaltext?: string;
    duration: number;
    error: any;
    icon: string;
    priority: number;
    result: 'Pass' | 'Fail' | 'Skip';
    showInfoBar: boolean;
    showProgress: boolean;
    showStepTitle: boolean;
    showTimer: boolean;
    text: string;
    title: string;
}

export interface CategorizedResults {
    Failed: string[];
    Skipped: string[];
    Succeeded: string[];
}

const categorizeTestSteps = (steps: TestStep[]): CategorizedResults => {
    const result: CategorizedResults = {
        Failed: [],
        Skipped: [],
        Succeeded: []
    };
    steps.forEach(step => {
        if (step.result === 'Fail') {
            result.Failed.push(step.title);
        } else if (step.result === 'Skip') {
            result.Skipped.push(step.title);
        } else if (step.result === 'Pass') {
            result.Succeeded.push(step.title);
        }
    });

    return result;
};

export default categorizeTestSteps;
