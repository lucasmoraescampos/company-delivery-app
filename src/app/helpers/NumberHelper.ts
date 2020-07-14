export class NumberHelper {

    public static parse(number: string): number {
        number = String(number).replace('.', '');
        number = number.replace(',', '.');
        return parseFloat(number);
    }

    public static cents(number: number): string {

        if (String(number).indexOf('.') == -1) {

            return String(number) + '.00';

        }

        else {

            const n = String(number).split('.');

            if (n[1].length == 1) {

                return String(number) + '0';

            }

        }

        return String(number);
    }

    public static orderCode(id: number): string {
        if (Number(id).toString().length == 1) {
            return `000${id}`;
        }
        else if (Number(id).toString().length == 2) {
            return `00${id}`;
        }
        else if (Number(id).toString().length == 3) {
            return `0${id}`;
        }
        else {
            return Number(id).toString();
        }
    }
}