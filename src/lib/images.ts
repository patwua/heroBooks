import type { StaticImageData } from "next/image";
import type { HeroKey, TestimonialKey, BannerKey } from "@/lib/copy/imageCopy";

// Placeholder image definitions. Actual binary assets are not included in the repository.
const accounting: StaticImageData = {
  src: "/landing/accounting-1024x640.webp",
  width: 1024,
  height: 640,
};
const barbershop: StaticImageData = {
  src: "/landing/barbershop-1024x640.webp",
  width: 1024,
  height: 640,
};
const carwash: StaticImageData = {
  src: "/landing/carwash-1024x640.webp",
  width: 1024,
  height: 640,
};
const construction: StaticImageData = {
  src: "/landing/construction-1024x640.webp",
  width: 1024,
  height: 640,
};
const dealership: StaticImageData = {
  src: "/landing/dealership-1024x640.webp",
  width: 1024,
  height: 640,
};
const logistics: StaticImageData = {
  src: "/landing/logistics-1024x640.webp",
  width: 1024,
  height: 640,
};
const realEstate: StaticImageData = {
  src: "/landing/real-estate-1024x640.webp",
  width: 1024,
  height: 640,
};
const schoolBoard: StaticImageData = {
  src: "/landing/school-board-1024x640.webp",
  width: 1024,
  height: 640,
};
const salon: StaticImageData = {
  src: "/landing/salon-1024x640.webp",
  width: 1024,
  height: 640,
};

const contractorKeisha: StaticImageData = {
  src: "/testimonials/contractor-keisha-96x96.webp",
  width: 96,
  height: 96,
};
const dealerRyan: StaticImageData = {
  src: "/testimonials/dealer-ryan-96x96.webp",
  width: 96,
  height: 96,
};
const salonOwner: StaticImageData = {
  src: "/testimonials/salon-owner-96x96.webp",
  width: 96,
  height: 96,
};
const shopOwner: StaticImageData = {
  src: "/testimonials/shop-owner-96x96.webp",
  width: 96,
  height: 96,
};
const transportOwner: StaticImageData = {
  src: "/testimonials/transport-owner-96x96.webp",
  width: 96,
  height: 96,
};

const bank: StaticImageData = {
  src: "/banners/bank-400x300.webp",
  width: 400,
  height: 300,
};
const invite: StaticImageData = {
  src: "/banners/invite-400x300.webp",
  width: 400,
  height: 300,
};
const invoice: StaticImageData = {
  src: "/banners/invoice-400x300.webp",
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
