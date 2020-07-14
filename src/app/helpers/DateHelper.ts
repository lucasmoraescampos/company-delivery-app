export class DateHelper {

    public static formatDate(date: Date): string {

        const months = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];

        const day = date.getDate() < 10 ? `0${date.getDate()}` : date.getDate();

        const month = months[date.getMonth()];

        const year = date.getFullYear();

        const now = new Date();

        if (year == now.getFullYear()) {

            return `${day} de ${month}`;

        }

        else {

            return `${day} de ${month} de ${year}`;

        }

    }

    public static formatDatetime(date: Date): string {

        const months = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];

        const day = date.getDate() < 10 ? `0${date.getDate()}` : date.getDate();

        const month = months[date.getMonth()];

        const year = date.getFullYear();

        const hour = date.getHours() < 10 ? `0${date.getHours()}` : date.getHours();

        const minute = date.getMinutes() < 10 ? `0${date.getMinutes()}` : date.getMinutes();

        const now = new Date();

        if (year == now.getFullYear()) {

            return `${day} de ${month}, às ${hour}:${minute}`;

        }

        else {

            return `${day} de ${month} de ${year}, às ${hour}:${minute}`;

        }

    }

    public static formatISO(date: Date): string {

        const day = date.getDate() < 10 ? `0${date.getDate()}` : date.getDate();

        const month = date.getMonth() + 1 < 10 ? `0${date.getMonth() + 1}` : date.getMonth() + 1;

        const year = date.getFullYear();

        const hours = date.getHours() < 10 ? `0${date.getHours()}` : date.getHours();

        const minutes = date.getMinutes() < 10 ? `0${date.getMinutes()}` : date.getMinutes();

        const seconds = date.getSeconds() < 10 ? `0${date.getSeconds()}` : date.getSeconds();

        return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}.000`;

    }

    public static getDate(date: Date) {

        const day = date.getDate() < 10 ? `0${date.getDate()}` : date.getDate();

        const month = date.getMonth() + 1 < 10 ? `0${date.getMonth() + 1}` : date.getMonth() + 1;

        const year = date.getFullYear();

        return `${year}-${month}-${day}`;

    }

    public static getTime(date: Date) {
        
        const hours = date.getHours() < 10 ? `0${date.getHours()}` : date.getHours();

        const minutes = date.getMinutes() < 10 ? `0${date.getMinutes()}` : date.getMinutes();

        const seconds = date.getSeconds() < 10 ? `0${date.getSeconds()}` : date.getSeconds();

        return `${hours}:${minutes}:${seconds}.000`;

    }

    public static getMonthShortName(date: Date): string {

        const months = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];

        return months[date.getMonth()];

    }

    public static getDayShortName(date: Date): string {

        const days = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];

        return days[date.getDay()];

    }
}