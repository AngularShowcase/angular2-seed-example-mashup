import {Pipe} from 'angular2/core';
import {ISortOrder, SortDirection} from '../models/SortOrder';

@Pipe({
    name: 'fieldSort'
})
export class FieldSortPipe {

    transform(items:any[], [sortField]:[ISortOrder]) : any[] {

        if (!items || !sortField) {
            return items;
        }

        console.log(
            `FieldSortPipe: Sorting ${items.length} items by field ${sortField.fieldName}.  Direction: ${sortField.sortDirection}.`);

        var ascending = _.sortBy(items, sortField.fieldName);
        return sortField.sortDirection === SortDirection.Ascending ? ascending : ascending.reverse();
    }
}
