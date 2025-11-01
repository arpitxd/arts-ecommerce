export interface ReviewsProps {
    reviews: {
        rating: number;
        reviewerName?: string;
        reviewerEmail?: string;
        comment: string;
    }[];

}