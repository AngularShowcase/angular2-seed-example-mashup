import {Pipe} from 'angular2/core';
import {ITest} from '../../../common/interfaces/QuizInterfaces';

@Pipe({
    name: 'TestCategoryFilter'
})
export class TestCategoryFilter {

    transform(tests:ITest[], [category]:[string]) : ITest[] {

        if (!tests || !category) {
            return tests;
        }

        console.log(`Filtering ${tests.length} tests by category ${category}.`);
        return tests.filter(test => _.any(test.sectionResults, section => section.sectionName === category));
    }
}
