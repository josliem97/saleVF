import React from 'react';
import Link from 'next/link';

export interface CarCardProps {
  id: string;
  name: string;
  image: string;
  price: number;
  segment: string;
  slug: string;
}

export function CarCard({ name, image, price, segment, slug }: CarCardProps) {
  return (
    <Link href={`/car/${slug}`} className="group relative bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden flex flex-col hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
      <div className="absolute top-4 left-4 z-10">
        <span className="bg-[#1464f4]/10 text-[#1464f4] text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">{segment}</span>
      </div>
      <div className="relative h-48 flex items-center justify-center p-4">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={image} alt={name} className="object-contain max-h-full drop-shadow-lg group-hover:scale-105 transition-transform duration-500" />
      </div>
      <div className="p-5 flex-1 flex flex-col">
        <h3 className="text-xl font-bold text-gray-900 mb-1">{name}</h3>
        <div className="mt-auto pt-4 flex flex-col">
          <span className="text-sm font-semibold text-gray-400 mb-0.5">Giá Từ</span>
          <span className="text-xl font-black text-[#1464f4]">{price.toLocaleString('vi-VN')} ₫</span>
        </div>
      </div>
    </Link>
  );
}
