export enum SortDirection {
    Ascending,
    Descending
}

export interface ISortOrder {
    fieldName: string;
    sortDirection: SortDirection;
}

export class SortOrder implements ISortOrder {

    fieldName: string;
    sortDirection: SortDirection;

    constructor(fieldName:string, sortDirection:SortDirection = SortDirection.Ascending) {
        this.fieldName = fieldName;
        this.sortDirection = sortDirection;
    }

    sortOnField(fieldName:string) : SortOrder {
        if (fieldName === this.fieldName) {
            return new SortOrder(fieldName, this.sortDirection === SortDirection.Descending
                    ? SortDirection.Ascending : SortDirection.Descending);
        }

        return new SortOrder(fieldName, SortDirection.Ascending);
    }

    directionName(direction:SortDirection) : string {
        return (direction === SortDirection.Descending) ? 'descending' : 'ascending';
    }

    toString() : string {
        return `Sorting ${this.directionName(this.sortDirection)} on field ${this.fieldName}.`;
    }
}
