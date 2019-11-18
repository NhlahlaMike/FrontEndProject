import { Product } from './../interfaces/product';

export interface ProductSubCategory {
  ProductSubCategoryID: number;
  SubCategoryName: string;
  Products: Product[];
}
