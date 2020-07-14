export class ArrayHelper {

    public static orderbyAsc(array: Array<any>, key: string) {
        return array.sort((catA: any, catB: any) => {
            catA = String(catA[key]).toUpperCase();
            catB = String(catB[key]).toUpperCase();
            if (catA > catB) {
                return 1;
            } else if (catA < catB) {
                return -1;
            } else {
                return 0;
            }
        });
    }

    public static orderbyDesc(array: Array<any>, key: string) {
        return array.sort((catA: any, catB: any) => {
            catA = String(catA[key]).toUpperCase();
            catB = String(catB[key]).toUpperCase();
            if (catA < catB) {
                return 1;
            } else if (catA > catB) {
                return -1;
            } else {
                return 0;
            }
        });
    }

    public static removeItem(array: Array<any>, index: number) {
        array.splice(index, 1);
        return array;
    }

    public static getIndexByKey(array: Array<any>, key: string, value: any) {
        return array.findIndex(x => x[key] == value);
    }
}