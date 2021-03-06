import { ProductSubCategory } from './../interfaces/product-sub-category';
export interface Product {
    Id: number;
    Barcode: string;
    ProductName: string;
    ProductType: string;
    Quantity: number;
    Description: string;
    UnitPrice: number;
    Features: string;
    Usage: string;
    BillingAddress: string;
    TC: string;
    ImageUrl: string;
    Category: string;
    ProductSubCategoryID: string;
    SellerId: number;
    SellerName: string;
    isDisabled: boolean;
    ProductSubCategory: ProductSubCategory[];
}
