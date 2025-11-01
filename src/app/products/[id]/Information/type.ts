export interface InformationProps {
    product: {
        title: string;
        rating: number;
        reviews: [];
        price: string;
        meta?: {
            priceBeforeDiscount: string;
        };
        discountPercentage?: number;
        description: string;
    };
};