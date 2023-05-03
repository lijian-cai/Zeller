import { Product } from "./product";

export interface PricingRule {
  // product applied on the deal
  dealProductSKU: Product["sku"];
  dealApplyNum: number;
  // '>': more than X number will apply, '=': every X number will apply
  dealRule: '>' | '=';
  // discount price number applied on each product
  // eg: 3 for 2 deal on Apple TVs, discountEach is 109.50,
  //     buys more than 4 Super iPad, discountEach is 100
  //     buy 1 MacBook Pro get 1 free VGA adapter, discountEach is 30
  discountEach: number;
}