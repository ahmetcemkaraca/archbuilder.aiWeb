'use client';

import { useState, useEffect } from 'react';
import { PlayIcon } from '@heroicons/react/24/solid';
import { Modal } from '../ui/modal';
import { useI18n } from '@/lib/i18n';

interface VideoModalProps {
  isOpen: boolean;
  onClose: () => void;
  videoUrl?: string;
  title?: string;
  description?: string;
}

export function VideoModal({ 
  isOpen, 
  onClose, 
  videoUrl = 'https://www.youtube.com/embed/dQw4w9WgXcQ',
  title,
  description
}: VideoModalProps) {
  const { t } = useI18n();
  const [isLoading, setIsLoading] = useState(true);
  const [isMounted, setIsMounted] = useState(false);
  
  useEffect(() => {
    setIsMounted(true);
  }, []);

  const modalTitle = isMounted ? (title || t('videoArchBuilderDemo')) : 'ArchBuilder.AI Demo';
  const modalDescription = isMounted ? (description || t('videoDemoDescription')) : 'AI destekli mimarlık tasarımının gücünü keşfedin';

  const handleVideoLoad = () => {
    setIsLoading(false);
  };

  return (
    <Modal 
      isOpen={isOpen} 
      onClose={onClose} 
      size="xl"
      title={modalTitle}
      className="bg-black"
    >
      <div className="p-6">
        {/* Description */}
        <p className="text-gray-300 mb-6 text-center">
          {modalDescription}
        </p>

        {/* Video Container */}
        <div className="relative w-full aspect-video bg-gray-900 rounded-xl overflow-hidden">
          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-900">
              <div className="text-center">
                <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                <p className="text-gray-300">{isMounted ? t('videoLoading') : 'Video yükleniyor...'}</p>
              </div>
            </div>
          )}
          
          <iframe
            src={videoUrl}
            title={modalTitle}
            className="w-full h-full"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            onLoad={handleVideoLoad}
          />
        </div>

        {/* Action Buttons */}
        <div className="mt-6 flex flex-col sm:flex-row gap-4 justify-center">
          <button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-6 py-3 rounded-lg font-semibold transition-all duration-300">
            {isMounted ? t('startFreeTrial') : 'Ücretsiz Deneme Başlat'}
          </button>
          <button className="border border-gray-600 text-gray-300 hover:bg-gray-800 px-6 py-3 rounded-lg font-semibold transition-all duration-300">
            {isMounted ? t('videoMoreInfo') : 'Daha Fazla Bilgi'}
          </button>
        </div>
      </div>
    </Modal>
  );
}

// Video Demo Trigger Button Component
interface DemoButtonProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export function DemoButton({ className = '', size = 'md' }: DemoButtonProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { t } = useI18n();
  const [isMounted, setIsMounted] = useState(false);
  
  useEffect(() => {
    setIsMounted(true);
  }, []);

  const sizeClasses = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg'
  };

  return (
    <>
      <button
        onClick={() => setIsModalOpen(true)}
        className={`
          flex items-center space-x-2 text-gray-700 dark:text-gray-300 
          hover:text-blue-600 dark:hover:text-blue-400 transition-colors 
          font-semibold ${sizeClasses[size]} ${className}
        `}
      >
        <div className="w-12 h-12 bg-white dark:bg-gray-800 rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-300">
          <PlayIcon className="w-5 h-5 ml-1 text-blue-600" />
        </div>
        <span>{isMounted ? t('watchDemo') : 'Demo İzle'}</span>
      </button>

      <VideoModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  );
}