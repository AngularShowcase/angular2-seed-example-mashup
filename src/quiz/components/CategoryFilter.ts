import {Pipe} from 'angular2/core';

interface IHaveCategory {
    category: string;
}

@Pipe({
    name: 'CategoryFilter'
})
export class CategoryFilter {

    transform(items:IHaveCategory[], [category]:[string]) : IHaveCategory[] {
        if (!items || !category) {
            return items;
        }

        console.log(`CategoryFilter: Filtering ${items.length} items by category ${category}.`);
        return items.filter(item => item.category === category);
    }
}
