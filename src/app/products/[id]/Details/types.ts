export interface DetailsProps {
    product: {
        brand?: string;
        sku?: string;
        weight?: string;
        dimensions?: {
            width: string;
            height: string;
            depth: string;
        };
    };

}