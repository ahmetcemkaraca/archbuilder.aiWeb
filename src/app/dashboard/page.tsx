'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useI18n } from '@/lib/i18n';
import { LanguageSelector } from '@/components/ui/language-selector';
import { 
  HomeIcon,
  DocumentIcon,
  CubeIcon,
  ChartBarIcon,
  CogIcon,
  UserIcon,
  BellIcon,
  MagnifyingGlassIcon,
  PlusIcon,
  FolderIcon,
  CalendarIcon,
  ClockIcon
} from '@heroicons/react/24/outline';

export default function DashboardPage() {
  const { t } = useI18n();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const stats = [
    {
      name: isMounted ? t('dashboardActiveProjects') : 'Aktif Projeler',
      value: '12',
      change: '+2.5%',
      changeType: 'positive' as const,
      icon: FolderIcon,
    },
    {
      name: isMounted ? t('dashboardCompletedDesigns') : 'Tamamlanan Tasarımlar',
      value: '847',
      change: '+12.3%',
      changeType: 'positive' as const,
      icon: DocumentIcon,
    },
    {
      name: isMounted ? t('dashboardAiGenerations') : 'AI Üretimleri',
      value: '2,341',
      change: '+18.7%',
      changeType: 'positive' as const,
      icon: CubeIcon,
    },
    {
      name: isMounted ? t('dashboardTimesSaved') : 'Kazanılan Zaman',
      value: '156h',
      change: '+8.2%',
      changeType: 'positive' as const,
      icon: ClockIcon,
    },
  ];

  const recentProjects = [
    {
      id: 1,
      name: 'Villa Projesi - Bodrum',
      status: 'in-progress',
      progress: 75,
      lastUpdated: '2 saat önce',
      aiGenerations: 23,
    },
    {
      id: 2,
      name: 'Ofis Kompleksi - İstanbul',
      status: 'review',
      progress: 90,
      lastUpdated: '5 saat önce',
      aiGenerations: 41,
    },
    {
      id: 3,
      name: 'Konut Projesi - Ankara',
      status: 'completed',
      progress: 100,
      lastUpdated: '1 gün önce',
      aiGenerations: 38,
    },
    {
      id: 4,
      name: 'Alışveriş Merkezi - İzmir',
      status: 'draft',
      progress: 25,
      lastUpdated: '3 gün önce',
      aiGenerations: 12,
    },
  ];

  const quickActions = [
    {
      name: isMounted ? t('dashboardNewProject') : 'Yeni Proje',
      description: isMounted ? t('dashboardNewProjectDesc') : 'AI destekli yeni bir proje başlat',
      icon: PlusIcon,
      color: 'bg-blue-500 hover:bg-blue-600',
    },
    {
      name: isMounted ? t('dashboardImportDrawing') : 'Çizim İçe Aktar',
      description: isMounted ? t('dashboardImportDrawingDesc') : 'Mevcut çizimlerinizi sisteme yükleyin',
      icon: DocumentIcon,
      color: 'bg-green-500 hover:bg-green-600',
    },
    {
      name: isMounted ? t('dashboardAiAnalysis') : 'AI Analizi',
      description: isMounted ? t('dashboardAiAnalysisDesc') : 'Mevcut projenizi AI ile analiz edin',
      icon: CubeIcon,
      color: 'bg-purple-500 hover:bg-purple-600',
    },
    {
      name: isMounted ? t('dashboardReports') : 'Raporlar',
      description: isMounted ? t('dashboardReportsDesc') : 'Detaylı proje raporlarını görüntüleyin',
      icon: ChartBarIcon,
      color: 'bg-orange-500 hover:bg-orange-600',
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo and Navigation */}
            <div className="flex items-center space-x-8">
              <Link href="/" className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">A</span>
                </div>
                <span className="font-bold text-xl text-gray-900 dark:text-white">ArchBuilder.AI</span>
              </Link>

              <nav className="hidden md:flex space-x-6">
                <Link href="/dashboard" className="flex items-center space-x-1 text-blue-600 dark:text-blue-400 font-medium">
                  <HomeIcon className="w-4 h-4" />
                  <span>{isMounted ? t('dashboard') : 'Dashboard'}</span>
                </Link>
                <Link href="/dashboard/projects" className="flex items-center space-x-1 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white">
                  <FolderIcon className="w-4 h-4" />
                  <span>{isMounted ? t('projects') : 'Projeler'}</span>
                </Link>
                <Link href="/dashboard/analytics" className="flex items-center space-x-1 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white">
                  <ChartBarIcon className="w-4 h-4" />
                  <span>{isMounted ? t('analytics') : 'Analitik'}</span>
                </Link>
              </nav>
            </div>

            {/* Right side actions */}
            <div className="flex items-center space-x-4">
              {/* Search */}
              <div className="relative hidden sm:block">
                <MagnifyingGlassIcon className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder={isMounted ? t('searchProjects') : 'Proje ara...'}
                  className="pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white w-64"
                />
              </div>

              {/* Notifications */}
              <button className="relative p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                <BellIcon className="w-6 h-6" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>

              {/* Language Selector */}
              <LanguageSelector />

              {/* Profile */}
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-gray-300 dark:bg-gray-600 rounded-full flex items-center justify-center">
                  <UserIcon className="w-5 h-5 text-gray-600 dark:text-gray-300" />
                </div>
                <div className="hidden sm:block">
                  <p className="text-sm font-medium text-gray-900 dark:text-white">Ahmet Cem</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Premium</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            {isMounted ? t('dashboardWelcome') : 'Hoş geldiniz, Ahmet'}
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            {isMounted ? t('dashboardWelcomeDesc') : 'Projelerinizi yönetin ve AI destekli tasarım araçlarını kullanın'}
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <div
              key={stat.name}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">{stat.name}</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{stat.value}</p>
                  <p className={`text-sm ${
                    stat.changeType === 'positive' ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {stat.change}
                  </p>
                </div>
                <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                  <stat.icon className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Recent Projects */}
          <div className="lg:col-span-2">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
              <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                  {isMounted ? t('dashboardRecentProjects') : 'Son Projeler'}
                </h2>
              </div>
              <div className="divide-y divide-gray-200 dark:divide-gray-700">
                {recentProjects.map((project) => (
                  <div key={project.id} className="p-6 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="font-medium text-gray-900 dark:text-white">{project.name}</h3>
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                        project.status === 'completed' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' :
                        project.status === 'in-progress' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400' :
                        project.status === 'review' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400' :
                        'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
                      }`}>
                        {project.status === 'completed' ? (isMounted ? t('completed') : 'Tamamlandı') :
                         project.status === 'in-progress' ? (isMounted ? t('inProgress') : 'Devam Ediyor') :
                         project.status === 'review' ? (isMounted ? t('review') : 'İnceleme') :
                         (isMounted ? t('draft') : 'Taslak')}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400 mb-2">
                      <span>{project.lastUpdated}</span>
                      <span>{project.aiGenerations} AI üretimi</span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${project.progress}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div>
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
              <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                  {isMounted ? t('dashboardQuickActions') : 'Hızlı İşlemler'}
                </h2>
              </div>
              <div className="p-6 space-y-4">
                {quickActions.map((action, index) => (
                  <button
                    key={action.name}
                    className="w-full flex items-start space-x-3 p-4 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all duration-200"
                  >
                    <div className={`w-10 h-10 ${action.color} rounded-lg flex items-center justify-center text-white`}>
                      <action.icon className="w-5 h-5" />
                    </div>
                    <div className="flex-1 text-left">
                      <p className="font-medium text-gray-900 dark:text-white">{action.name}</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">{action.description}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Calendar Widget */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 mt-6">
              <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center space-x-2">
                  <CalendarIcon className="w-5 h-5" />
                  <span>{isMounted ? t('dashboardUpcomingTasks') : 'Yaklaşan Görevler'}</span>
                </h2>
              </div>
              <div className="p-6">
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">Proje sunumu</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Yarın, 14:00</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">Revizyon teslimi</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">2 gün sonra</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">Müşteri toplantısı</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">1 hafta sonra</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}