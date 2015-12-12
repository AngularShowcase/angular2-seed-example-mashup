export class Parser {

    chopTime(zuluTime:string):string {
        var index = zuluTime.indexOf('T');
        if (index < 0) {
            return zuluTime;
        }
        return zuluTime.slice(0, index);
    }

	propertyNameToLabel(propName:string) {

           //console.log('Parsing ' + propName);
           if (!propName) {
               return propName;
           }
           var allUpper = propName.toUpperCase();
           if (propName === allUpper) {
               return propName;
           }

           var pieces:string[];

		   pieces = propName.split('_');
		   if (pieces.length > 1) {
			   return pieces.map(this.propertyNameToLabel).join(' ');
		   }

		   pieces = [];
           var remaining:string = propName;
           var index:number;
           var upperLetter = /.[A-Z]/;

           while ((index = remaining.search(upperLetter)) > -1) {
               var word = remaining.slice(0, index + 1);
               pieces.push(word);
               remaining = remaining.substr(index + 1);
           }
           pieces.push(remaining);
           //console.log(pieces);
           return pieces.map(word => word.slice(0,1).toUpperCase() + word.slice(1)).join(' ');
	}
}
