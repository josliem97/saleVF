import React from 'react';
import { Car } from '../data/mockCars';

interface CompareModalProps {
  cars: Car[];
  onClose: () => void;
  onRemove: (id: number) => void;
}

export default function CompareModal({ cars, onClose, onRemove }: CompareModalProps) {
  if (cars.length === 0) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-4xl overflow-hidden animate-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="bg-[#1464f4] p-5 flex justify-between items-center text-white">
          <h2 className="text-2xl font-bold">So sánh xe VinFast</h2>
          <button 
            onClick={onClose}
            className="w-10 h-10 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-colors font-bold text-xl"
            aria-label="Close"
          >&times;</button>
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="grid grid-cols-3 gap-4 border-b pb-6">
            {/* Cột Specs Danh mục */}
            <div className="flex flex-col justify-end">
              <div className="text-left font-bold text-gray-400 uppercase tracking-wider text-sm">Thông số kỹ thuật</div>
            </div>

            {/* Cột xe 1 và 2 */}
            {cars.map((car, index) => (
              <div key={car.id} className="relative flex flex-col items-center p-4 bg-gray-50 rounded-2xl border border-gray-100">
                <button 
                  className="absolute top-2 right-2 w-8 h-8 flex items-center justify-center rounded-full bg-red-100 text-red-600 hover:bg-red-500 hover:text-white transition-colors"
                  onClick={() => onRemove(car.id)}
                >
                  &times;
                </button>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={car.image} alt={car.name} className="h-28 object-contain drop-shadow-lg mb-4" />
                <h3 className="text-xl font-bold text-gray-900">{car.name} <span className="text-sm font-normal bg-blue-100 text-[#1464f4] px-2 py-0.5 rounded-full">{car.version}</span></h3>
                <div className="text-lg font-bold text-[#1464f4] mt-1">{car.price.toLocaleString('vi-VN')} VNĐ</div>
              </div>
            ))}
            
            {/* Box Placeholder nếu thiếu xe */}
            {cars.length < 2 && (
              <div className="flex flex-col items-center justify-center p-4 bg-gray-50 border-2 border-dashed border-gray-300 rounded-2xl">
                <div className="text-gray-400 text-center">
                  <span className="block text-4xl mb-2">+</span>
                  Chọn thêm mẫu xe để so sánh
                </div>
              </div>
            )}
          </div>

          {/* Bảng so sánh tĩnh */}
          {cars.length === 2 && (
            <div className="mt-2 divide-y divide-gray-100">
              {[
                { label: 'Quãng đường (WLTP)', key: 'range' },
                { label: 'Động cơ (Sức mạnh)', key: 'power' },
                { label: 'Tăng tốc (0-100 km/h)', key: 'acceleration' },
                { label: 'Dung lượng Pin', key: 'battery' },
              ].map((spec, i) => (
                <div key={i} className="grid grid-cols-3 gap-4 py-4 hover:bg-gray-50 transition-colors px-2 rounded-lg">
                  <div className="font-medium text-gray-500 flex items-center">{spec.label}</div>
                  <div className="text-center font-bold text-gray-900 text-lg">{(cars[0] as any)[spec.key]}</div>
                  <div className="text-center font-bold text-gray-900 text-lg">{(cars[1] as any)[spec.key]}</div>
                </div>
              ))}
            </div>
          )}
        </div>
        
        {/* Footer */}
        <div className="bg-gray-50 p-4 border-t flex justify-end gap-3">
          <button onClick={onClose} className="px-6 py-2.5 rounded-xl font-semibold text-gray-600 hover:bg-gray-200 transition-colors">
            Đóng
          </button>
          {cars.length === 2 && (
            <button className="px-6 py-2.5 rounded-xl font-semibold text-white bg-green-600 hover:bg-green-700 transition-colors shadow-lg shadow-green-600/30">
              Nhận tư vấn ngay
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
