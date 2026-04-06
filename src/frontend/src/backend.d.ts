import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export type Time = bigint;
export interface ContactSubmission {
    projectType: string;
    name: string;
    email: string;
    message: string;
    timestamp: Time;
    phone?: string;
}
export interface PortfolioItem {
    title: string;
    description: string;
    imageUrl: string;
    category: string;
    liveUrl: string;
}
export interface Testimonial {
    clientName: string;
    quote: string;
    roleOrCompany: string;
    rating: bigint;
}
export interface backendInterface {
    getAllContactSubmissions(): Promise<Array<ContactSubmission>>;
    getAllPortfolioItems(): Promise<Array<PortfolioItem>>;
    getAllTestimonials(): Promise<Array<Testimonial>>;
    getContactSubmission(id: bigint): Promise<ContactSubmission>;
    getPortfolioByCategory(category: string): Promise<Array<PortfolioItem>>;
    getPortfolioItem(id: bigint): Promise<PortfolioItem>;
    getTestimonialsByRating(rating: bigint): Promise<Array<Testimonial>>;
    searchPortfolioByTitle(searchTerm: string): Promise<Array<PortfolioItem>>;
    submitContactForm(name: string, email: string, phone: string | null, projectType: string, message: string): Promise<bigint>;
}
