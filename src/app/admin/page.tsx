'use client';

import { useState, useEffect } from 'react';
import { signInWithEmailAndPassword, signOut, onAuthStateChanged, User } from 'firebase/auth';
import { collection, getDocs, query, orderBy, limit, where } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase-config';
import { 
  EnvelopeIcon, 
  UserGroupIcon, 
  EyeIcon,
  ChartBarIcon,
  KeyIcon,
  ArrowRightOnRectangleIcon,
  CheckCircleIcon,
  ClockIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline';

interface ContactSubmission {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  company?: string;
  jobTitle?: string;
  message: string;
  inquiryType: string;
  submittedAt: any;
  status: 'pending' | 'reviewed' | 'responded';
  source: string;
}

interface NewsletterSubscription {
  id: string;
  email: string;
  firstName?: string;
  preferences: string[];
  subscribedAt: any;
  status: 'active' | 'unsubscribed';
  confirmed: boolean;
}

interface Stats {
  totalContacts: number;
  totalNewsletterSubs: number;
  todayContacts: number;
  todayNewsletterSubs: number;
  pendingContacts: number;
}

export default function AdminDashboard() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [activeTab, setActiveTab] = useState<'overview' | 'contacts' | 'newsletter'>('overview');
  
  // Veri durumları
  const [contacts, setContacts] = useState<ContactSubmission[]>([]);
  const [newsletters, setNewsletters] = useState<NewsletterSubscription[]>([]);
  const [stats, setStats] = useState<Stats>({
    totalContacts: 0,
    totalNewsletterSubs: 0,
    todayContacts: 0,
    todayNewsletterSubs: 0,
    pendingContacts: 0,
  });

  // Auth durumunu izle
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
      
      if (user) {
        loadDashboardData();
      }
    });

    return () => unsubscribe();
  }, []);

  // Giriş yap
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');

    try {
      await signInWithEmailAndPassword(auth, loginEmail, loginPassword);
    } catch (error: any) {
      setLoginError(error.message || 'Giriş yapılamadı');
    }
  };

  // Çıkış yap
  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error('Çıkış hatası:', error);
    }
  };

  // Dashboard verilerini yükle
  const loadDashboardData = async () => {
    try {
      // İletişim formları
      const contactsRef = collection(db, 'contact_submissions');
      const contactsQuery = query(contactsRef, orderBy('submittedAt', 'desc'), limit(50));
      const contactsSnapshot = await getDocs(contactsQuery);
      const contactsData = contactsSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as ContactSubmission[];
      setContacts(contactsData);

      // Newsletter abonelikleri
      const newslettersRef = collection(db, 'newsletter_subscriptions');
      const newslettersQuery = query(newslettersRef, orderBy('subscribedAt', 'desc'), limit(100));
      const newslettersSnapshot = await getDocs(newslettersQuery);
      const newslettersData = newslettersSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as NewsletterSubscription[];
      setNewsletters(newslettersData);

      // İstatistikleri hesapla
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const todayContactsQuery = query(
        collection(db, 'contact_submissions'),
        where('submittedAt', '>=', today)
      );
      const todayContactsSnapshot = await getDocs(todayContactsQuery);

      const todayNewsletterQuery = query(
        collection(db, 'newsletter_subscriptions'),
        where('subscribedAt', '>=', today)
      );
      const todayNewsletterSnapshot = await getDocs(todayNewsletterQuery);

      const pendingContactsQuery = query(
        collection(db, 'contact_submissions'),
        where('status', '==', 'pending')
      );
      const pendingContactsSnapshot = await getDocs(pendingContactsQuery);

      setStats({
        totalContacts: contactsData.length,
        totalNewsletterSubs: newslettersData.length,
        todayContacts: todayContactsSnapshot.size,
        todayNewsletterSubs: todayNewsletterSnapshot.size,
        pendingContacts: pendingContactsSnapshot.size,
      });

    } catch (error) {
      console.error('Veri yükleme hatası:', error);
    }
  };

  // Tarih formatla
  const formatDate = (timestamp: any) => {
    if (!timestamp) return 'Bilinmiyor';
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return date.toLocaleDateString('tr-TR') + ' ' + date.toLocaleTimeString('tr-TR', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  // Yükleniyor ekranı
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-300">Yükleniyor...</p>
        </div>
      </div>
    );
  }

  // Giriş ekranı
  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center p-4">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 w-full max-w-md">
          <div className="text-center mb-8">
            <KeyIcon className="w-12 h-12 text-blue-600 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              Admin Paneli
            </h1>
            <p className="text-gray-600 dark:text-gray-300">
              ArchBuilder.AI Yönetici Giriş
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                E-posta
              </label>
              <input
                type="email"
                value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                placeholder="admin@archbuilder.ai"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Şifre
              </label>
              <input
                type="password"
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                placeholder="••••••••"
                required
              />
            </div>

            {loginError && (
              <div className="bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-700 rounded-lg p-3">
                <p className="text-sm text-red-600 dark:text-red-400">{loginError}</p>
              </div>
            )}

            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-semibold transition-colors duration-200"
            >
              Giriş Yap
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                ArchBuilder.AI Admin
              </h1>
              <p className="text-gray-600 dark:text-gray-300">
                Kayıt ve iletişim yönetimi
              </p>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center space-x-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
            >
              <ArrowRightOnRectangleIcon className="w-5 h-5" />
              <span>Çıkış</span>
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Navigation Tabs */}
        <div className="border-b border-gray-200 dark:border-gray-700 mb-8">
          <nav className="-mb-px flex space-x-8">
            {[
              { id: 'overview', name: 'Genel Bakış', icon: ChartBarIcon },
              { id: 'contacts', name: 'İletişim Formları', icon: EnvelopeIcon },
              { id: 'newsletter', name: 'Newsletter', icon: UserGroupIcon },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
                }`}
              >
                <tab.icon className="w-5 h-5" />
                <span>{tab.name}</span>
              </button>
            ))}
          </nav>
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                <div className="flex items-center">
                  <EnvelopeIcon className="w-8 h-8 text-blue-600" />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                      Toplam İletişim
                    </p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">
                      {stats.totalContacts}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                <div className="flex items-center">
                  <UserGroupIcon className="w-8 h-8 text-green-600" />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                      Newsletter Abonesi
                    </p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">
                      {stats.totalNewsletterSubs}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                <div className="flex items-center">
                  <ClockIcon className="w-8 h-8 text-yellow-600" />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                      Bekleyen İletişim
                    </p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">
                      {stats.pendingContacts}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                <div className="flex items-center">
                  <ChartBarIcon className="w-8 h-8 text-purple-600" />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                      Bugün Toplam
                    </p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">
                      {stats.todayContacts + stats.todayNewsletterSubs}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Son İletişimler */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
              <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                  Son İletişim Formları
                </h3>
              </div>
              <div className="divide-y divide-gray-200 dark:divide-gray-700">
                {contacts.slice(0, 5).map((contact) => (
                  <div key={contact.id} className="px-6 py-4 flex items-center justify-between">
                    <div className="flex-1">
                      <p className="font-medium text-gray-900 dark:text-white">
                        {contact.firstName} {contact.lastName}
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {contact.email} • {contact.inquiryType}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {formatDate(contact.submittedAt)}
                      </p>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        contact.status === 'pending' 
                          ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400'
                          : contact.status === 'reviewed'
                          ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400'
                          : 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                      }`}>
                        {contact.status === 'pending' ? 'Bekliyor' : contact.status === 'reviewed' ? 'İncelendi' : 'Yanıtlandı'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Contacts Tab */}
        {activeTab === 'contacts' && (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
            <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                İletişim Formları ({contacts.length})
              </h3>
            </div>
            <div className="divide-y divide-gray-200 dark:divide-gray-700">
              {contacts.map((contact) => (
                <div key={contact.id} className="px-6 py-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <h4 className="font-medium text-gray-900 dark:text-white">
                          {contact.firstName} {contact.lastName}
                        </h4>
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          contact.status === 'pending' 
                            ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400'
                            : contact.status === 'reviewed'
                            ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400'
                            : 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                        }`}>
                          {contact.status === 'pending' ? 'Bekliyor' : contact.status === 'reviewed' ? 'İncelendi' : 'Yanıtlandı'}
                        </span>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div>
                          <p className="text-sm text-gray-600 dark:text-gray-400">E-posta:</p>
                          <p className="font-medium text-gray-900 dark:text-white">{contact.email}</p>
                        </div>
                        {contact.phone && (
                          <div>
                            <p className="text-sm text-gray-600 dark:text-gray-400">Telefon:</p>
                            <p className="font-medium text-gray-900 dark:text-white">{contact.phone}</p>
                          </div>
                        )}
                        {contact.company && (
                          <div>
                            <p className="text-sm text-gray-600 dark:text-gray-400">Şirket:</p>
                            <p className="font-medium text-gray-900 dark:text-white">{contact.company}</p>
                          </div>
                        )}
                        <div>
                          <p className="text-sm text-gray-600 dark:text-gray-400">Konu:</p>
                          <p className="font-medium text-gray-900 dark:text-white">{contact.inquiryType}</p>
                        </div>
                      </div>
                      
                      <div className="mb-4">
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Mesaj:</p>
                        <p className="text-gray-900 dark:text-white bg-gray-50 dark:bg-gray-700 rounded-lg p-3">
                          {contact.message}
                        </p>
                      </div>
                    </div>
                    
                    <div className="text-right ml-4">
                      <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                        {formatDate(contact.submittedAt)}
                      </p>
                      <p className="text-xs text-gray-400 dark:text-gray-500">
                        Kaynak: {contact.source}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Newsletter Tab */}
        {activeTab === 'newsletter' && (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
            <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                Newsletter Aboneleri ({newsletters.length})
              </h3>
            </div>
            <div className="divide-y divide-gray-200 dark:divide-gray-700">
              {newsletters.map((subscriber) => (
                <div key={subscriber.id} className="px-6 py-4 flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3">
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">
                          {subscriber.firstName || 'İsimsiz'} - {subscriber.email}
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          İlgi Alanları: {subscriber.preferences?.join(', ') || 'Belirtilmemiş'}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">
                      {formatDate(subscriber.subscribedAt)}
                    </p>
                    <div className="flex items-center space-x-2">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        subscriber.status === 'active' 
                          ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                          : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
                      }`}>
                        {subscriber.status === 'active' ? 'Aktif' : 'Abonelik İptal'}
                      </span>
                      {subscriber.confirmed ? (
                        <CheckCircleIcon className="w-4 h-4 text-green-500" title="Onaylandı" />
                      ) : (
                        <ExclamationTriangleIcon className="w-4 h-4 text-yellow-500" title="Onay Bekliyor" />
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}