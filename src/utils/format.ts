interface ICommaSeparator {
    decimal: boolean
}
interface Api {
    p2e(): Api;
    e2p(): Api;
    commaSeparator({ decimal }: ICommaSeparator): Api;
    removeCommas(): Api;
    decimal(toFixed: number): Api;
    build(): number | string;
    buildAsString(): string;
}
const format = (input: number | string): Api => {
    let value: string = '';

    if (input !== null && input !== undefined) {
        value = input.toString().trim();
    } else {
        console.error('format: input is not valid');
    }

    const persianDigits = '۰۱۲۳۴۵۶۷۸۹';
    const englishDigits = '0123456789';

    const api: Api = {
        p2e() {
            value = value.replace(/[۰-۹]/g, d =>
                englishDigits[persianDigits.indexOf(d)]
            );
            return api;
        },

        e2p() {
            value = value.replace(/[0-9]/g, d =>
                persianDigits[englishDigits.indexOf(d)]
            );
            return api;
        },

        commaSeparator({
            decimal = true
        }: ICommaSeparator) {
            const num = Number(value.replace(/,/g, ''));

            if (!isNaN(num)) {
                const formattedNum = decimal ? num : Math.trunc(num);
                value = formattedNum.toLocaleString('en-US');
            }
            return api;
        },

        removeCommas() {
            value = value.replace(/,/g, '');
            return api;
        },
        decimal(toFixed) {
            const numberValue = Number(value.replace(/,/g, ''));
            if (!isNaN(numberValue)) {
                value = numberValue.toFixed(toFixed).replace(/\.?0+$/, '');
            }
            return api;
        },
        build() {
            const num = Number(value);
            return isNaN(num) ? value : num;
        },
        buildAsString() {
            return value;
        }
    };

    return api;
};

export default format;
