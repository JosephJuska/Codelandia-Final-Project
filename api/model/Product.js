const getDateInString = require("../utils/get-date-in-string");

class ProductItem {
    constructor(row, safe) {
        this.id = row.item_id;
        this.colour1 = row.colour_1;
        this.colour2 = row.colour_2;
        this.colour3 = row.colour_3;
        this.stock = row.stock;
        this.imagePaths = row.image_paths;
        this.variations = row?.variations ? ProductVariation.parseMany(row.variations, safe) : null;
        this.createdAt = getDateInString(row.created_at);
        this.updatedAt = row.updated_at ? getDateInString(row.updated_at) : null;
    }

    static parseOne(row, safe = true) {
        let product = new ProductItem(row, safe);
        if(safe){
            delete product.createdAt;
            delete product.updatedAt;
        }
        
        return product;
    }

    static parseMany(rows, safe = true) {
        return rows ? rows.map(row => ProductItem.parseOne(row, safe)) : null;
    }
}

class ProductField {
    constructor(row) {
        this.id = row.field_id;
        this.name = row.field_name;
        this.fieldTypeID = row.field_type_id;
        this.fieldValue = row.field_value;
        this.productTypeFieldID = row.product_type_field_id;
        this.createdAt = getDateInString(row.field_created_at);
        this.updatedAt = row.field_updated_at ? getDateInString(row.field_updated_at) : null;
    }

    static parseOne(row, safe = true) {
        let product = new ProductField(row);
        if(safe){
            delete product.createdAt;
            delete product.updatedAt;
        }
        
        return product;
    }

    static parseMany(rows, safe = true) {
        return rows ? rows.map(row => ProductField.parseOne(row, safe)) : null;
    }
}

class ProductVariation {
    constructor(row, safe) {
        this.id = row.variation_id;
        this.name = row.variation_name;
        this.price = row.variation_price;
        this.stock = row.variation_stock;
        this.fields = row?.variation_fields ? ProductVariationField.parseMany(row.variation_fields, safe) : null;
        this.createdAt = getDateInString(row.variation_created_at);
        this.updatedAt = row.variation_updated_at ? getDateInString(row.variation_updated_at) : null;
    }

    static parseOne(row, safe = true) {
        let product = new ProductVariation(row, safe);
        if(safe){
            delete product.createdAt;
            delete product.updatedAt;
        }
        
        return product;
    }

    static parseMany(rows, safe = true) {
        return rows ? rows.map(row => ProductVariation.parseOne(row, safe)) : null;
    }
}

class ProductVariationField {
    constructor(row) {
        this.id = row.field_id;
        this.name = row.field_name;
        this.fieldTypeID = row.field_type_id;
        this.fieldValue = row.field_value;
        this.productTypeFieldID = row.product_type_field_id;
        this.createdAt = getDateInString(row.field_created_at);
        this.updatedAt = row.field_updated_at ? getDateInString(row.field_updated_at) : null;
    }

    static parseOne(row, safe = true) {
        let product = new ProductVariationField(row);
        if(safe){
            delete product.createdAt;
            delete product.updatedAt;
        }
        
        return product;
    }

    static parseMany(rows, safe = true) {
        return rows ? rows.map(row => ProductVariationField.parseOne(row, safe)) : null;
    }
}

class Product {
    constructor(row, safe) {
        this.id = row.product_id;
        this.name = row.product_name;
        this.description = row.product_description;
        this.sku = row.product_sku;
        this.basePrice = row.product_base_price;
        this.rating = row.product_rating;
        this.isActive = row.product_is_active;
        this.brandID = row.brand_id;
        this.brandName = row.brand_name;
        this.categoryID = row.category_id;
        this.categoryName = row.category_name;
        this.categorySlug = row.category_slug;
        this.categoryProductTypeID = row.category_product_type_id;
        this.productItems = row?.product_items ? ProductItem.parseMany(row.product_items, safe) : null;
        this.productFields = row?.product_fields ? ProductField.parseMany(row.product_fields, safe) : null;
        this.discountID = row.discount_id;
        this.discountPercentage = row.discount_percentage;
        this.discountStartDate = row.discount_start_date ? getDateInString(row.discount_start_date) : null;
        this.discountEndDate = row.discount_end_date ? getDateInString(row.discount_end_date) : null;
        this.createdAt = getDateInString(row.product_created_at);
        this.updatedAt = row.product_updated_at ? getDateInString(row.product_updated_at) : null;
    }

    static parseOne(row, safe = true) {
        let product = new Product(row, safe);
        if(safe){
            delete product.createdAt;
            delete product.updatedAt;
        }
        
        return product;
    }

    static parseMany(rows, safe = true) {
        return rows.map(row => Product.parseOne(row, safe));
    }
};

module.exports = Product;
