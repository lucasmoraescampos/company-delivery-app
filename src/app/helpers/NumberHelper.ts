export class NumberHelper {

    public static parse(number: string): number {
        if (number) {
            number = number.replace('.', '');
            number = number.replace(',', '.');
        }
        return parseFloat(number);
    }

    public static formatCents(number: number): string {

        if (number.toString().indexOf('.') == -1) {
            return number.toString() + '.00';
        }
        return number.toString();
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