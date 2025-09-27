/**
 * ArchBuilder.AI Marketplace Component
 * Market yeri bileşeni - ürün kataloğu ve alışveriş sepeti
 */

'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ShoppingCartIcon, 
  PlusIcon, 
  MinusIcon,
  SparklesIcon,
  CloudIcon,
  HeartIcon,
  StarIcon
} from '@heroicons/react/24/solid';
import { useI18n } from '@/lib/i18n/context';
import { ONE_TIME_PRODUCTS } from '@/types/stripe';
import { createCheckoutSession } from '@/lib/stripe-api';
import toast from 'react-hot-toast';

interface CartItem {
  productId: string;
  quantity: number;
  price: number;
  name: string;
}

interface MarketplaceProps {
  className?: string;
  showHeader?: boolean;
}

const Marketplace: React.FC<MarketplaceProps> = ({
  className = '',
  showHeader = true
}) => {
  const { t } = useI18n();
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Sepet toplam hesaplama
  const cartTotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  const cartItemCount = cart.reduce((total, item) => total + item.quantity, 0);

  // Sepete ürün ekleme  
  const addToCart = (product: { id: string; name: string; price: number; description: string }) => {
    setCart(prevCart => {
      const existingItem = prevCart.find(item => item.productId === product.id);
      
      if (existingItem) {
        return prevCart.map(item => 
          item.productId === product.id 
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        return [...prevCart, {
          productId: product.id,
          quantity: 1,
          price: product.price,
          name: product.name
        }];
      }
    });
    
    toast.success(`${product.name} sepete eklendi`);
  };

  // Sepetten ürün kaldırma
  const removeFromCart = (productId: string) => {
    setCart(prevCart => prevCart.filter(item => item.productId !== productId));
    toast.success('Ürün sepetten kaldırıldı');
  };

  // Ürün miktarını güncelleme
  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }

    setCart(prevCart => 
      prevCart.map(item => 
        item.productId === productId 
          ? { ...item, quantity }
          : item
      )
    );
  };

  // Checkout işlemi
  const handleCheckout = async () => {
    if (cart.length === 0) {
      toast.error(t('cartEmpty'));
      return;
    }

    setIsLoading(true);
    try {
      const result = await createCheckoutSession(
        cart.map(item => ({
          productId: item.productId,
          quantity: item.quantity
        })),
        {
          successUrl: `${window.location.origin}/payment/success`,
          cancelUrl: `${window.location.origin}/marketplace`
        }
      );

      if (result.error) {
        toast.error(result.error);
      }
      // Başarılı olursa Stripe otomatik olarak yönlendirir
    } catch (error) {
      console.error('Checkout error:', error);
      toast.error(t('errorProcessingPayment'));
    } finally {
      setIsLoading(false);
    }
  };

  // Direkt satın alma
  const handleBuyNow = async (product: { id: string; name: string; price: number; description: string }) => {
    setIsLoading(true);
    try {
      const result = await createCheckoutSession(
        [{ productId: product.id, quantity: 1 }],
        {
          successUrl: `${window.location.origin}/payment/success`,
          cancelUrl: `${window.location.origin}/marketplace`
        }
      );

      if (result.error) {
        toast.error(result.error);
      }
    } catch (error) {
      console.error('Buy now error:', error);
      toast.error(t('errorProcessingPayment'));
    } finally {
      setIsLoading(false);
    }
  };

  // Ürün kategorileri
  const categories = [
    { id: 'credits', name: 'AI Kredileri', icon: SparklesIcon },
    { id: 'support', name: 'Destek Paketleri', icon: HeartIcon },
    { id: 'storage', name: 'Depolama', icon: CloudIcon }
  ];

  // Ürün ikonu belirleyici
  const getProductIcon = (productId: string) => {
    if (productId.includes('credits')) return SparklesIcon;
    if (productId.includes('support')) return HeartIcon;
    if (productId.includes('storage')) return CloudIcon;
    return SparklesIcon;
  };

  return (
    <div className={`relative ${className}`}>
      {/* Header */}
      {showHeader && (
        <div className="mb-8">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
                {t('marketplace')}
              </h2>
              <p className="text-gray-600 dark:text-gray-300 mt-2">
                Projelerinizi geliştirmek için ek ürünler ve hizmetler
              </p>
            </div>

            {/* Shopping Cart Button */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="relative bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
            >
              <ShoppingCartIcon className="w-5 h-5" />
              <span className="hidden sm:inline">{t('shoppingCart')}</span>
              {cartItemCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs w-6 h-6 rounded-full flex items-center justify-center">
                  {cartItemCount}
                </span>
              )}
            </button>
          </div>

          {/* Categories */}
          <div className="flex gap-4 mt-6">
            {categories.map(category => {
              const Icon = category.icon;
              return (
                <button
                  key={category.id}
                  className="flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-800 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                >
                  <Icon className="w-5 h-5 text-blue-600" />
                  <span className="text-gray-700 dark:text-gray-300">{category.name}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Products Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {ONE_TIME_PRODUCTS.map((product, index) => {
          const Icon = getProductIcon(product.id);
          const isInCart = cart.some(item => item.productId === product.id);
          
          return (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all group"
            >
              {/* Product Image/Icon */}
              <div className="h-48 bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center relative overflow-hidden">
                <Icon className="w-16 h-16 text-white/80" />
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors" />
              </div>

              {/* Product Info */}
              <div className="p-6">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    {product.name}
                  </h3>
                  <div className="flex items-center gap-1 text-yellow-500">
                    <StarIcon className="w-4 h-4" />
                    <span className="text-sm">4.8</span>
                  </div>
                </div>

                <p className="text-gray-600 dark:text-gray-300 text-sm mb-4 line-clamp-2">
                  {product.description}
                </p>

                {/* Price */}
                <div className="flex justify-between items-center mb-4">
                  <div className="text-2xl font-bold text-gray-900 dark:text-white">
                    ${product.price}
                  </div>
                  <div className="text-green-600 text-sm font-medium">
                    {t('inStock')}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2">
                  <button
                    onClick={() => addToCart(product)}
                    disabled={isLoading}
                    className={`flex-1 py-2 rounded-lg font-medium transition-colors ${
                      isInCart 
                        ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                        : 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white hover:bg-gray-200 dark:hover:bg-gray-600'
                    }`}
                  >
                    {isInCart ? 'Sepette' : t('addToCart')}
                  </button>
                  <button
                    onClick={() => handleBuyNow(product)}
                    disabled={isLoading}
                    className="flex-1 bg-blue-600 text-white py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:opacity-50"
                  >
                    {t('buyNow')}
                  </button>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Shopping Cart Sidebar */}
      <AnimatePresence>
        {isCartOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 z-40"
              onClick={() => setIsCartOpen(false)}
            />

            {/* Cart Sidebar */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              className="fixed right-0 top-0 bottom-0 w-80 bg-white dark:bg-gray-800 shadow-2xl z-50 flex flex-col"
            >
              {/* Cart Header */}
              <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    {t('shoppingCart')}
                  </h3>
                  <button
                    onClick={() => setIsCartOpen(false)}
                    className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
                  >
                    ×
                  </button>
                </div>
              </div>

              {/* Cart Items */}
              <div className="flex-1 overflow-y-auto p-6">
                {cart.length === 0 ? (
                  <div className="text-center text-gray-500 dark:text-gray-400 py-12">
                    <ShoppingCartIcon className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>{t('cartEmpty')}</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {cart.map(item => (
                      <div
                        key={item.productId}
                        className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg"
                      >
                        <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                          <SparklesIcon className="w-6 h-6 text-blue-600" />
                        </div>
                        
                        <div className="flex-1">
                          <h4 className="font-medium text-gray-900 dark:text-white text-sm">
                            {item.name}
                          </h4>
                          <p className="text-gray-600 dark:text-gray-300 text-xs">
                            ${item.price} each
                          </p>
                        </div>

                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                            className="w-6 h-6 rounded-full bg-gray-200 dark:bg-gray-600 flex items-center justify-center hover:bg-gray-300 dark:hover:bg-gray-500"
                          >
                            <MinusIcon className="w-3 h-3" />
                          </button>
                          <span className="w-8 text-center font-medium text-gray-900 dark:text-white">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                            className="w-6 h-6 rounded-full bg-gray-200 dark:bg-gray-600 flex items-center justify-center hover:bg-gray-300 dark:hover:bg-gray-500"
                          >
                            <PlusIcon className="w-3 h-3" />
                          </button>
                        </div>

                        <button
                          onClick={() => removeFromCart(item.productId)}
                          className="text-red-500 hover:text-red-700 text-xs"
                        >
                          {t('removeFromCart')}
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Cart Footer */}
              {cart.length > 0 && (
                <div className="p-6 border-t border-gray-200 dark:border-gray-700">
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-lg font-semibold text-gray-900 dark:text-white">
                      {t('cartTotal')}:
                    </span>
                    <span className="text-2xl font-bold text-gray-900 dark:text-white">
                      ${cartTotal.toFixed(2)}
                    </span>
                  </div>

                  <button
                    onClick={handleCheckout}
                    disabled={isLoading}
                    className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {isLoading ? (
                      <>
                        <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                        İşleniyor...
                      </>
                    ) : (
                      t('checkout')
                    )}
                  </button>
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Marketplace;