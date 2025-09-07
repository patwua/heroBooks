import type { StaticImageData } from "next/image";
import type { HeroKey, TestimonialKey, BannerKey } from "@/lib/copy/imageCopy";

// Placeholder image definitions. Actual binary assets are not included in the repository.
const accounting: StaticImageData = {
  src: "/photos/landing/accounting-1024x640.webp",
  width: 1024,
  height: 640,
};
const barbershop: StaticImageData = {
  src: "/photos/landing/barbershop-1024x640.webp",
  width: 1024,
  height: 640,
};
const carwash: StaticImageData = {
  src: "/photos/landing/carwash-1024x640.webp",
  width: 1024,
  height: 640,
};
const construction: StaticImageData = {
  src: "/photos/landing/construction-1024x640.webp",
  width: 1024,
  height: 640,
};
const dealership: StaticImageData = {
  src: "/photos/landing/dealership-1024x640.webp",
  width: 1024,
  height: 640,
};
const logistics: StaticImageData = {
  src: "/photos/landing/logistics-1024x640.webp",
  width: 1024,
  height: 640,
};
const realEstate: StaticImageData = {
  src: "/photos/landing/real-estate-1024x640.webp",
  width: 1024,
  height: 640,
};
const schoolBoard: StaticImageData = {
  src: "/photos/landing/school-board-1024x640.webp",
  width: 1024,
  height: 640,
};
const salon: StaticImageData = {
  src: "/photos/landing/salon-1024x640.webp",
  width: 1024,
  height: 640,
};

const contractorKeisha: StaticImageData = {
  src: "/photos/testimonials/contractor-keisha-96x96.webp",
  width: 96,
  height: 96,
};
const dealerRyan: StaticImageData = {
  src: "/photos/testimonials/dealer-ryan-96x96.webp",
  width: 96,
  height: 96,
};
const salonOwner: StaticImageData = {
  src: "/photos/testimonials/salon-owner-96x96.webp",
  width: 96,
  height: 96,
};
const shopOwner: StaticImageData = {
  src: "/photos/testimonials/shop-owner-96x96.webp",
  width: 96,
  height: 96,
};
const transportOwner: StaticImageData = {
  src: "/photos/testimonials/transport-owner-96x96.webp",
  width: 96,
  height: 96,
};

const bank: StaticImageData = {
  src: "/photos/banners/bank-400x300.webp",
  width: 400,
  height: 300,
};
const invite: StaticImageData = {
  src: "/photos/banners/invite-400x300.webp",
  width: 400,
  height: 300,
};
const invoice: StaticImageData = {
  src: "/photos/banners/invoice-400x300.webp",
  width: 400,
  height: 300,
};

export const heroImages: Partial<Record<HeroKey, StaticImageData>> = {
  accounting,
  barbershop,
  carwash,
  construction,
  dealership,
  logistics,
  "real-estate": realEstate,
  "school-board": schoolBoard,
  salon,
};

export const testimonialImages: Record<TestimonialKey, StaticImageData> = {
  "contractor-keisha": contractorKeisha,
  "dealer-ryan": dealerRyan,
  "salon-owner": salonOwner,
  "shop-owner": shopOwner,
  "transport-owner": transportOwner,
};

export const bannerImages: Record<BannerKey, StaticImageData> = {
  bank,
  invite,
  invoice,
};
