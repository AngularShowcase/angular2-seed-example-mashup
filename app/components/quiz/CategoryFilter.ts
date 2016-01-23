import {Pipe} from 'angular2/core';

interface IHaveCategory {
    category: string;
}

@Pipe({
    name: 'CategoryFilter'
})
export class CategoryFilter {

    transform(items:IHaveCategory[], [category]:[string]) : IHaveCategory[] {
        console.log('CategoryFilter called with: ', items, category);
        if (!items || !category) {
            return items;
        }

        return items.filter(item => item.category === category);
    }
}
