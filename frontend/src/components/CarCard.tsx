import React from 'react';
import { Car } from '../data/mockCars';

interface CarCardProps {
  car: Car;
  onCompare: (car: Car) => void;
  isComparing: boolean;
}

export default function CarCard({ car, onCompare, isComparing }: CarCardProps) {
  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl flex flex-col h-full group">
      <div className="relative h-56 bg-gradient-to-b from-gray-50 to-[#e5e7eb] flex items-center justify-center p-6 mix-blend-multiply">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img 
          src={car.image} 
          alt={car.name} 
          className="object-contain max-h-full drop-shadow-[0_20px_20px_rgba(0,0,0,0.4)] transition-transform duration-500 group-hover:scale-110" 
        />
      </div>
      <div className="p-6 flex flex-col flex-grow bg-white">
        <div className="flex justify-between items-start mb-1">
          <h3 className="text-2xl font-black text-gray-900 tracking-tight">{car.name}</h3>
          <span className="text-xs font-bold uppercase tracking-wider px-3 py-1 bg-[#1464f4]/10 text-[#1464f4] rounded-full">
            {car.version}
          </span>
        </div>
        <div className="text-xl font-bold text-[#1464f4] mb-5">
          {car.price.toLocaleString('vi-VN')} VNĐ
        </div>
        
        <div className="space-y-3 mb-6 text-sm flex-grow">
          <div className="flex justify-between items-center border-b border-gray-100 pb-2">
            <span className="text-gray-500">Quãng đường</span> 
            <span className="font-semibold text-gray-900">{car.range}</span>
          </div>
          <div className="flex justify-between items-center border-b border-gray-100 pb-2">
            <span className="text-gray-500">Động cơ</span> 
            <span className="font-semibold text-gray-900">{car.power}</span>
          </div>
        </div>
        
        <div className="flex gap-3 mt-auto">
          <button className="flex-1 bg-[#1464f4] hover:bg-blue-700 text-white font-semibold py-3 rounded-xl transition-all shadow-md shadow-blue-500/30">
            Tính giá
          </button>
          <button 
            onClick={() => onCompare(car)}
            className={`flex-1 font-semibold py-3 rounded-xl transition-all border-2 ${
              isComparing 
                ? 'bg-green-50 border-green-500 text-green-700 hover:bg-green-100 shadow-sm' 
                : 'bg-white border-gray-200 text-gray-700 hover:border-[#1464f4] hover:text-[#1464f4]'
            }`}
          >
            {isComparing ? '✓ Đã chọn' : '+ So sánh'}
          </button>
        </div>
      </div>
    </div>
  );
}
