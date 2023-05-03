import { PricingRule } from "./interfaces/pricingRule";
import { Product } from "./interfaces/product";

class Checkout {
  private productSKUs: Array<Product["sku"]> = [];
  private pricingRules: Array<PricingRule> = [];
  private products: Array<Product> = [];

  public constructor(pricingRules: Array<PricingRule>) {
    this.pricingRules = pricingRules;

    this.initialProducts();
  }

  public scan(sku: Product["sku"]) {
    this.productSKUs.push(sku)
  }

  public total(): number {
    let total = 0;

    const skuCount: {[sku: string]: number} = {};
    const skuPrice: {[sku: string]: number} = {};

    this.productSKUs.forEach((sku) => {
      (sku in skuCount) ? skuCount[sku]++ : skuCount[sku] = 1;
      if(!(sku in skuPrice)) {
        skuPrice[sku] = this.products.find((product) => product.sku === sku)?.price || 0;
      }
      total += skuPrice[sku];
    });

    const discount = this.applyDiscount(skuCount);

    return total - discount;
  }

  private initialProducts() {
    this.products.push({
      sku: 'ipd',
      name: 'Super iPad',
      price: 549.99,
    })
    this.products.push({
      sku: 'mbp',
      name: 'MacBook Pro',
      price: 1399.99,
    })
    this.products.push({
      sku: 'atv',
      name: 'Apple TV',
      price: 109.50,
    })
    this.products.push({
      sku: 'vga',
      name: 'VGA adapter',
      price: 30,
    })
  }

  private applyDiscount(skuCount: {[sku: string]: number}): number {
    let discount = 0;

    console.log('--- skuCount')
    console.log(skuCount)

    Object.keys(skuCount).forEach((sku) => {
      const rule = this.pricingRules.find((rule) => rule.dealProductSKU === sku);
      
      if(rule) {
        if(rule.dealRule === '=' && skuCount[sku] >= rule.dealApplyNum) {
          discount += rule.discountEach*(Math.floor(skuCount[sku]/rule.dealApplyNum))
        } else if(rule.dealRule === '>' && skuCount[sku] > rule.dealApplyNum) {
          discount += rule.discountEach*skuCount[sku];
        }
      }
    })

    return discount;
  }
}

const c = new Checkout([
  {dealProductSKU: 'atv', dealApplyNum: 3, dealRule: '=', discountEach: 109.50},
  {dealProductSKU: 'ipd', dealApplyNum: 4, dealRule: '>', discountEach: 50},
])
// c.scan('atv');
// c.scan('atv');
// c.scan('vga');
// c.scan('atv');
// console.log((c.total()).toLocaleString('en-US', {
//   style: 'currency',
//   currency: 'AUD',
// }));

c.scan('atv');
c.scan('ipd');
c.scan('ipd');
c.scan('atv');
c.scan('ipd');
c.scan('ipd');
c.scan('ipd');

console.log((c.total()).toLocaleString('en-US', {
  style: 'currency',
  currency: 'AUD',
}));
