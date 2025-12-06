import React, { useEffect, useMemo, useState } from 'react';
import { Plus, Star } from 'lucide-react';
import { Product, ProductWeightOption, HoneyWeight } from '../types';

interface ProductCardProps {
  product: Product;
  onAdd: (product: Product, weight: ProductWeightOption) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onAdd }) => {
  const weightOptions = useMemo<ProductWeightOption[]>(() => {
    if (product.weights && product.weights.length > 0) {
      return product.weights;
    }
    const fallbackWeight = product.defaultWeight ?? HoneyWeight.G900;
    return [
      {
        weight: fallbackWeight,
        label: `${fallbackWeight} g`,
        price: product.price,
        priceId: product.priceId
      }
    ];
  }, [product]);

  const [selectedWeight, setSelectedWeight] = useState<ProductWeightOption>(weightOptions[0]);

  useEffect(() => {
    setSelectedWeight(weightOptions[0]);
  }, [weightOptions]);

  const currentPrice = selectedWeight?.price ?? product.price;

  return (
    <div
      className={`group relative bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 border border-stone-100 flex flex-col h-full overflow-hidden ${
        product.soldOut ? 'opacity-60 grayscale pointer-events-none' : ''
      }`}
    >
      <div className="aspect-w-1 aspect-h-1 w-full overflow-hidden bg-stone-200 group-hover:opacity-90 lg:aspect-none lg:h-80 relative">
        <img
          src={product.image}
          alt={`${product.name} - slovenski domači med iz Vipavske doline`}
          className="h-full w-full object-cover object-center lg:h-full lg:w-full transition-transform duration-500 group-hover:scale-110"
          loading="lazy"
        />
        {product.previousPrice && (
          <div className="absolute top-4 left-4 bg-red-600 text-white px-3 py-1 rounded-md font-bold text-sm shadow-lg">
            AKCIJA
          </div>
        )}
        <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-full flex items-center shadow-sm">
           <Star className="w-3 h-3 text-gold-500 fill-gold-500 mr-1" />
           <span className="text-xs font-bold text-stone-800">{product.rating}</span>
        </div>
      </div>
      <div className="mt-4 flex flex-col flex-1 p-4">
        <div className="flex-1">
            <div className="flex justify-between items-start">
                <h3 className="text-lg font-bold text-stone-900 font-serif">
                    {product.name}
                </h3>
                <div className="flex flex-col items-end">
                  {product.previousPrice && (
                    <p className="text-sm text-stone-400 line-through">{product.previousPrice.toFixed(2)} €</p>
                  )}
                  <p className={`text-lg font-semibold ${product.previousPrice ? 'text-red-600' : 'text-gold-700'}`}>
                    {currentPrice.toFixed(2)} €
                  </p>
                  {product.previousPrice && (
                    <p className="text-xs font-bold text-red-600">
                      -{Math.round(((product.previousPrice - product.price) / product.previousPrice) * 100)}%
                    </p>
                  )}
                </div>
            </div>
            <div className="mt-2 flex gap-2 flex-wrap">
                {product.tags.map(tag => (
                    <span key={tag} className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gold-100 text-gold-800">
                        {tag}
                    </span>
                ))}
            </div>
            <div className="mt-3">
              <p className="text-xs font-semibold text-stone-500 uppercase tracking-wide">Velikost kozarca</p>
              <div className="mt-2 flex gap-2 flex-wrap">
                {weightOptions.map(option => (
                  <button
                    key={option.weight}
                    type="button"
                    className={`px-3 py-1.5 rounded-full text-sm border transition-colors ${
                      selectedWeight?.weight === option.weight
                        ? 'bg-stone-900 text-white border-stone-900'
                        : 'bg-white text-stone-600 border-stone-200 hover:border-gold-400'
                    }`}
                    onClick={() => setSelectedWeight(option)}
                    disabled={product.soldOut}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>
            <p className="mt-3 text-sm text-stone-500 leading-relaxed">
                {product.description}
            </p>
        </div>
        <button
          onClick={() => selectedWeight && onAdd(product, selectedWeight)}
          disabled={product.soldOut}
          className={`mt-6 w-full flex items-center justify-center rounded-lg border border-transparent px-4 py-3 text-sm font-medium transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-gold-500 focus:ring-offset-2 ${
            product.soldOut
              ? 'bg-stone-400 text-stone-700 cursor-not-allowed'
              : 'bg-stone-900 text-white hover:bg-gold-600'
          }`}
        >
          {product.soldOut ? (
            <span className="font-bold">Razprodano</span>
          ) : (
            <>
              <Plus className="w-4 h-4 mr-2" />
              Dodaj v košarico
            </>
          )}
        </button>
      </div>
    </div>
  );
};