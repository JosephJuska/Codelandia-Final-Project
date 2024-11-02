class Currency {
    constructor(row) {
        this.azn = row.azn;
        this.eur = row.eur;
        this.try = row.tr;
        this.updatedAt = row.updated_at;
    };

    static parseOne(row) {
        return new Currency(row);
    };
};

module.exports = Currency;