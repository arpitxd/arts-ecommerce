export interface SpecificationProps {
    product: {
        brand: string;
        title: string;
        category: string;
        sku: string;
        weight: string;
        dimensions?: {
            width: string;
            height: string;
        };
        minimumOrderQuantity?: string;
    }
}