'use client';

import { CloudIcon, CpuChipIcon, ShieldCheckIcon } from '@heroicons/react/24/outline';
import { useI18n } from '@/lib/i18n';
import { AnimatedSection, StaggeredList, StaggeredItem } from '@/components/ui/animated-section';

export function Technology() {
  const { t } = useI18n();
  const techStack = [
    {
      category: t('desktopAppCategory'),
      icon: '💻',
      technologies: [
        { name: t('windowsWPF'), description: t('windowsWPFDesc') },
        { name: t('csharpNet'), description: t('csharpNetDesc') },
        { name: t('revit2026'), description: t('revit2026Desc') }
      ],
      color: 'from-blue-500 to-blue-600'
    },
    {
      category: t('cloudPlatformCategory'),
      icon: '☁️',
      technologies: [
        { name: t('pythonFastAPI'), description: t('pythonFastAPIDesc') },
        { name: t('archEngineHigh'), description: t('archEngineHighDesc') },
        { name: t('archEngineMedium'), description: t('archEngineMediumDesc') }
      ],
      color: 'from-purple-500 to-purple-600'
    },
    {
      category: t('securityInfraCategory'),
      icon: '🔒',
      technologies: [
        { name: t('dockerKubernetes'), description: t('dockerKubernetesDesc') },
        { name: t('oauth2JWT'), description: t('oauth2JWTDesc') },
        { name: t('aes256Encryption'), description: t('aes256EncryptionDesc') }
      ],
      color: 'from-red-500 to-red-600'
    }
  ];

  const aiModels = [
    {
      name: t('archEngineHigh'),
      provider: t('advancedAI'),
      use_case: t('complexProblemsUseCase'),
      features: [t('deepAnalysis'), t('creativeSolutions'), t('codeGeneration')],
      performance: t('responseTime5to15')
    },
    {
      name: t('archEngineMedium'),
      provider: t('fastAI'),
      use_case: t('fastPrototypingUseCase'),
      features: [t('multimodalInput'), t('lowLatency'), t('highEfficiency')],
      performance: t('responseTimeLess2')
    }
  ];

  return (
    <section id="technology" className="py-24 bg-white dark:bg-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <AnimatedSection className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-6">
            <span className="block">{t('technologyTitle1')}</span>
            <span className="block bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              {t('technologyTitle2')}
            </span>
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            {t('technologySubtitle')}
          </p>
        </AnimatedSection>

        {/* Technology Stack */}
        <StaggeredList className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-20">
          {techStack.map((stack, index) => (
            <StaggeredItem 
              key={index}
              className="bg-gray-50 dark:bg-gray-700 rounded-2xl p-6 hover:shadow-lg transition-all duration-300 hover:scale-105"
            >
              {/* Category Header */}
              <div className="text-center mb-6">
                <div className="text-4xl mb-3">{stack.icon}</div>
                <h3 className="font-semibold text-lg text-gray-900 dark:text-white">
                  {stack.category}
                </h3>
              </div>

              {/* Technologies */}
              <div className="space-y-4">
                {stack.technologies.map((tech, techIndex) => (
                  <div key={techIndex} className="text-center">
                    <div className={`inline-block bg-gradient-to-r ${stack.color} text-white px-3 py-1 rounded-full text-sm font-medium mb-2`}>
                      {tech.name}
                    </div>
                    <p className="text-xs text-gray-600 dark:text-gray-300">
                      {tech.description}
                    </p>
                  </div>
                ))}
              </div>
            </StaggeredItem>
          ))}
        </StaggeredList>

        {/* AI Models Showcase */}
        <AnimatedSection 
          animation="scaleIn"
          className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-3xl p-8 mb-20"
        >
          <div className="text-center mb-12">
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              {t('aiSystemTitle')}
            </h3>
            <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              {t('aiSystemDesc')}
            </p>
          </div>

          <StaggeredList className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {aiModels.map((model, index) => (
              <StaggeredItem 
                key={index}
                className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg hover:scale-105 transition-transform duration-300"
              >
                <div className="flex items-center mb-4">
                  <CpuChipIcon className="w-8 h-8 text-blue-600 mr-3" />
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white">
                      {model.name}
                    </h4>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {model.provider}
                    </p>
                  </div>
                </div>

                <div className="mb-4">
                  <p className="text-gray-700 dark:text-gray-300 mb-3">
                    <strong>{t('useCaseLabel')}:</strong> {model.use_case}
                  </p>
                  <p className="text-gray-700 dark:text-gray-300 mb-3">
                    <strong>{t('performanceLabel')}:</strong> {model.performance}
                  </p>
                </div>

                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-white mb-2">
                    {t('keyFeaturesLabel')}:
                  </p>
                  <ul className="space-y-1">
                    {model.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="text-sm text-gray-600 dark:text-gray-300 flex items-center">
                        <div className="w-1.5 h-1.5 bg-blue-600 rounded-full mr-2"></div>
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
              </StaggeredItem>
            ))}
          </StaggeredList>
        </AnimatedSection>

        {/* Architecture Overview */}
        <AnimatedSection animation="fadeInUp" className="text-center">
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-8">
            {t('hybridArchitectureTitle')}
          </h3>
          
          <div className="bg-gray-50 dark:bg-gray-700 rounded-2xl p-8">
            <StaggeredList className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <StaggeredItem className="text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4 hover:scale-110 transition-transform duration-300">
                  <span className="text-2xl">🖥️</span>
                </div>
                <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
                  {t('windowsDesktopApp')}
                </h4>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  {t('windowsDesktopAppDesc')}
                </p>
              </StaggeredItem>

              <StaggeredItem className="text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4 hover:scale-110 transition-transform duration-300">
                  <CloudIcon className="w-8 h-8 text-white" />
                </div>
                <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
                  {t('cloudAIProcessing')}
                </h4>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  {t('cloudAIProcessingDesc')}
                </p>
              </StaggeredItem>

              <StaggeredItem className="text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-green-600 rounded-2xl flex items-center justify-center mx-auto mb-4 hover:scale-110 transition-transform duration-300">
                  <ShieldCheckIcon className="w-8 h-8 text-white" />
                </div>
                <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
                  {t('secureDataProcessing')}
                </h4>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  {t('secureDataProcessingDesc')}
                </p>
              </StaggeredItem>
            </StaggeredList>
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
}