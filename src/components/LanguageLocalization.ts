/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface TranslationDictionary {
  title: string;
  subtitle: string;
  backToCanvas: string;
  canvas: string;
  analytics: string;
  marketplace: string;
  admin: string;
  aiSettings: string;
  aiAgents: string;
  languageSelect: string;
  searchPlaceholder: string;
  activeWorkflows: string;
  enterpriseWorkspace: string;
  systemHealthy: string;
  offlineMode: string;
  runWorkflow: string;
  saveWorkflow: string;
  importExport: string;
  pwaTitle: string;
  pwaDesc: string;
  pwaInstall: string;
  teamsTitle: string;
  rolePermissions: string;
  auditLogs: string;
  billingTitle: string;
  collaborators: string;
  whiteLabel: string;
}

export const SUPPORTED_LANGUAGES = [
  { code: 'en', name: 'English', rtl: false, native: 'English' },
  { code: 'hi', name: 'Hindi', rtl: false, native: 'हिन्दी' },
  { code: 'te', name: 'Telugu', rtl: false, native: 'తెలుగు' },
  { code: 'ta', name: 'Tamil', rtl: false, native: 'தமிழ்' },
  { code: 'kn', name: 'Kannada', rtl: false, native: 'ಕನ್ನಡ' },
  { code: 'ml', name: 'Malayalam', rtl: false, native: 'മലയാളം' },
  { code: 'mr', name: 'Marathi', rtl: false, native: 'मराठी' },
  { code: 'gu', name: 'Gujarati', rtl: false, native: 'ગુજરાતી' },
  { code: 'pa', name: 'Punjabi', rtl: false, native: 'ਪੰਜਾਬੀ' },
  { code: 'bn', name: 'Bengali', rtl: false, native: 'বাংলা' },
  { code: 'or', name: 'Odia', rtl: false, native: 'ଓଡ଼ିଆ' },
  { code: 'as', name: 'Assamese', rtl: false, native: 'অসমীয়া' },
  { code: 'ur', name: 'Urdu', rtl: true, native: 'اردو' },
  { code: 'sa', name: 'Sanskrit', rtl: false, native: 'संस्कृतम्' },
  { code: 'ne', name: 'Nepali', rtl: false, native: 'नेपाली' },
  { code: 'si', name: 'Sinhala', rtl: false, native: 'සිංහල' },
  { code: 'ar', name: 'Arabic', rtl: true, native: 'العربية' },
  { code: 'zh', name: 'Chinese (Simplified)', rtl: false, native: '简体中文' },
  { code: 'zht', name: 'Chinese (Traditional)', rtl: false, native: '繁體中文' },
  { code: 'ja', name: 'Japanese', rtl: false, native: '日本語' },
  { code: 'ko', name: 'Korean', rtl: false, native: '한국어' },
  { code: 'th', name: 'Thai', rtl: false, native: 'ไทย' },
  { code: 'vi', name: 'Vietnamese', rtl: false, native: 'Tiếng Việt' },
  { code: 'id', name: 'Indonesian', rtl: false, native: 'Bahasa Indonesia' },
  { code: 'ms', name: 'Malay', rtl: false, native: 'Bahasa Melayu' },
  { code: 'fr', name: 'French', rtl: false, native: 'Français' },
  { code: 'de', name: 'German', rtl: false, native: 'Deutsch' },
  { code: 'es', name: 'Spanish', rtl: false, native: 'Español' },
  { code: 'pt', name: 'Portuguese', rtl: false, native: 'Português' },
  { code: 'it', name: 'Italian', rtl: false, native: 'Italiano' },
  { code: 'ru', name: 'Russian', rtl: false, native: 'Русский' },
  { code: 'tr', name: 'Turkish', rtl: false, native: 'Türkçe' },
  { code: 'nl', name: 'Dutch', rtl: false, native: 'Nederlands' },
  { code: 'pl', name: 'Polish', rtl: false, native: 'Polski' },
  { code: 'sv', name: 'Swedish', rtl: false, native: 'Svenska' },
  { code: 'no', name: 'Norwegian', rtl: false, native: 'Norsk' },
  { code: 'da', name: 'Danish', rtl: false, native: 'Dansk' },
  { code: 'fi', name: 'Finnish', rtl: false, native: 'Suomi' },
  { code: 'el', name: 'Greek', rtl: false, native: 'Ελληνικά' },
  { code: 'he', name: 'Hebrew', rtl: true, native: 'עברית' },
  { code: 'uk', name: 'Ukrainian', rtl: false, native: 'Українська' },
  { code: 'cs', name: 'Czech', rtl: false, native: 'Čeština' },
  { code: 'ro', name: 'Romanian', rtl: false, native: 'Română' },
  { code: 'hu', name: 'Hungarian', rtl: false, native: 'Magyar' }
];

export const TRANSLATIONS: Record<string, TranslationDictionary> = {
  en: {
    title: 'FlowForge Automation & Agent Workspace',
    subtitle: 'Build enterprise visual multi-agent workflows, register failover policies, and execute AI models.',
    backToCanvas: 'Back to Canvas',
    canvas: 'Visual Canvas',
    analytics: 'Analytics & Trace',
    marketplace: 'Community Templates',
    admin: 'System Admin',
    aiSettings: 'AI Config & Failover',
    aiAgents: 'AI Agent Ecosystem',
    languageSelect: 'System Localization',
    searchPlaceholder: 'Search workflows, agents, nodes...',
    activeWorkflows: 'Active Workflows',
    enterpriseWorkspace: 'Enterprise Workspaces',
    systemHealthy: 'System Operational',
    offlineMode: 'Local Storage Offline Safe',
    runWorkflow: 'Run Pipeline',
    saveWorkflow: 'Save State',
    importExport: 'Import / Export Schema',
    pwaTitle: 'Progressive Web App (PWA)',
    pwaDesc: 'Install FlowForge directly to your Android, iOS, or Desktop for full offline capabilities and instant push notifications.',
    pwaInstall: 'Install FlowForge App',
    teamsTitle: 'Organizations & Collaborators',
    rolePermissions: 'Role-Based Permissions (RBAC)',
    auditLogs: 'Real-time Security Audit Logs',
    billingTitle: 'Subscriptions & Metered Usage',
    collaborators: 'Active Workspace Teams',
    whiteLabel: 'White-Label & Custom Branding'
  },
  hi: {
    title: 'फ्लोफोर्ज स्वचालन और एजेंट कार्यक्षेत्र',
    subtitle: 'एंटरप्राइज विजुअल मल्टी-एजेंट वर्कफ़्लो बनाएं, विफलता नीतियां पंजीकृत करें और एआई मॉडल चलाएं।',
    backToCanvas: 'कैनवास पर वापस जाएं',
    canvas: 'विजुअल कैनवास',
    analytics: 'विश्लेषण और ट्रेस',
    marketplace: 'सामुदायिक टेम्पलेट्स',
    admin: 'सिस्टम एडमिन',
    aiSettings: 'एआई कॉन्फ़िगरेशन',
    aiAgents: 'एआई एजेंट पारिस्थितिकी तंत्र',
    languageSelect: 'सिस्टम स्थानीयकरण',
    searchPlaceholder: 'वर्कफ़्लो, एजेंट, नोड्स खोजें...',
    activeWorkflows: 'सक्रिय वर्कफ़्लो',
    enterpriseWorkspace: 'एंटरप्राइज कार्यस्थान',
    systemHealthy: 'सिस्टम चालू है',
    offlineMode: 'ऑफ़लाइन सुरक्षित मोड',
    runWorkflow: 'पाइपलाइन चलाएं',
    saveWorkflow: 'स्थिति सहेजें',
    importExport: 'स्कीमा आयात/निर्यात',
    pwaTitle: 'प्रोग्रेसिव वेब ऐप (PWA)',
    pwaDesc: 'पूर्ण ऑफ़लाइन क्षमताओं और त्वरित पुश सूचनाओं के लिए फ़्लोफ़ोर्ज को सीधे अपने एंड्रॉइड, आईओएस या डेस्कटॉप पर स्थापित करें।',
    pwaInstall: 'फ्लोफोर्ज ऐप इंस्टॉल करें',
    teamsTitle: 'संगठन और सहयोगी',
    rolePermissions: 'भूमिका-आधारित अनुमतियां (RBAC)',
    auditLogs: 'वास्तविक समय सुरक्षा ऑडिट लॉग',
    billingTitle: 'सदस्यता और मापी गई उपयोगिता',
    collaborators: 'सक्रिय कार्यस्थान टीम',
    whiteLabel: 'व्हाइट-लेबल और कस्टम ब्रांडिंग'
  },
  te: {
    title: 'ఫ్లోఫోర్జ్ ఆటోమేషన్ & ఏజెంట్ వర్క్‌స్పేస్',
    subtitle: 'ఎంటర్‌ప్రైజ్ విజువల్ మల్టీ-ఏజెంట్ వర్క్‌ఫ్లోలను రూపొందించండి, ఫెయిల్‌ఓవర్ విధానాలను నమోదు చేయండి మరియు AI మోడల్‌లను అమలు చేయండి.',
    backToCanvas: 'కాన్వాస్‌కు తిరిగి వెళ్ళు',
    canvas: 'విజువల్ కాన్వాస్',
    analytics: 'అనలిటిక్స్ & ట్రేస్',
    marketplace: 'కమ్యూనిటీ టెంప్లేట్లు',
    admin: 'సిస్టమ్ అడ్మిన్',
    aiSettings: 'AI కాన్ఫిగరేషన్',
    aiAgents: 'AI ఏజెంట్ పర్యావరణ వ్యవస్థ',
    languageSelect: 'సిస్టమ్ స్థానీకరణ',
    searchPlaceholder: 'వర్క్‌ఫ్లోలు, ఏజెంట్లు, నోడ్‌లను శోధించండి...',
    activeWorkflows: 'క్రియాశీల వర్క్‌ఫ్లోలు',
    enterpriseWorkspace: 'ఎంటర్‌ప్రైజ్ వర్క్‌స్పేస్‌లు',
    systemHealthy: 'సిస్టమ్ సక్రమంగా పనిచేస్తోంది',
    offlineMode: 'ఆఫ్‌లైన్ సేఫ్ మోడ్',
    runWorkflow: 'పైప్‌లైన్ రన్ చేయి',
    saveWorkflow: 'స్థితిని సేవ్ చేయి',
    importExport: 'స్కీమా ఇంపోర్ట్ / ఎక్స్‌పోర్ట్',
    pwaTitle: 'ప్రోగ్రెసివ్ వెబ్ యాప్ (PWA)',
    pwaDesc: 'పూర్తి ఆఫ్‌లైన్ సామర్థ్యాలు మరియు తక్షణ పుష్ నోటిఫికేషన్‌ల కోసం ఫ్లోఫోర్జ్‌ను నేరుగా మీ ఆండ్రాయిడ్, ఐఓఎస్ లేదా డెస్క్‌టాప్‌కు ఇన్‌స్టాల్ చేయండి.',
    pwaInstall: 'ఫ్లోఫోర్జ్ యాప్ ఇన్‌స్టాల్ చేయి',
    teamsTitle: 'సంస్థలు & సహకారులు',
    rolePermissions: 'పాత్ర-ఆధారిత అనుమతులు (RBAC)',
    auditLogs: 'నిజ-సమయ భద్రతా ఆడిట్ లాగ్‌లు',
    billingTitle: 'సభ్యత్వాలు & మీటర్డ్ వినియోగం',
    collaborators: 'క్రియాశీల వర్క్‌స్పేస్ బృందాలు',
    whiteLabel: 'వైట్-లేబుల్ & కస్టమ్ బ్రాండింగ్'
  },
  es: {
    title: 'Flujo de Trabajo y Espacio de Agentes FlowForge',
    subtitle: 'Cree flujos de trabajo visuales de múltiples agentes, registre políticas de conmutación por error y ejecute modelos de IA.',
    backToCanvas: 'Volver al Lienzo',
    canvas: 'Lienzo Visual',
    analytics: 'Análisis y Seguimiento',
    marketplace: 'Plantillas de la Comunidad',
    admin: 'Administrador del Sistema',
    aiSettings: 'Configuración de IA',
    aiAgents: 'Ecosistema de Agentes de IA',
    languageSelect: 'Localización del Sistema',
    searchPlaceholder: 'Buscar flujos de trabajo, agentes, nodos...',
    activeWorkflows: 'Flujos de Trabajo Activos',
    enterpriseWorkspace: 'Espacios de Trabajo Empresariales',
    systemHealthy: 'Sistema Operativo',
    offlineMode: 'Modo Seguro Fuera de Línea',
    runWorkflow: 'Ejecutar Canalización',
    saveWorkflow: 'Guardar Estado',
    importExport: 'Importar / Exportar Esquema',
    pwaTitle: 'Aplicación Web Progresiva (PWA)',
    pwaDesc: 'Instale FlowForge directamente en su Android, iOS o Escritorio para obtener capacidades completas fuera de línea y notificaciones push instantáneas.',
    pwaInstall: 'Instalar Aplicación FlowForge',
    teamsTitle: 'Organizaciones y Colaboradores',
    rolePermissions: 'Permisos Basados en Roles (RBAC)',
    auditLogs: 'Registros de Auditoría de Seguridad en Tiempo Real',
    billingTitle: 'Suscripciones y Uso Medido',
    collaborators: 'Equipos de Trabajo Activos',
    whiteLabel: 'Etiqueta Blanca y Marca Personalizada'
  },
  ar: {
    title: 'مساحة عمل الأتمتة والوكلاء من FlowForge',
    subtitle: 'قم ببناء سير عمل مرئي متعدد الوكلاء للمؤسسات، وتسجيل سياسات الفشل التلقائي، وتشغيل نماذج الذكاء الاصطناعي.',
    backToCanvas: 'العودة إلى اللوحة',
    canvas: 'اللوحة المرئية',
    analytics: 'التحليلات والتتبع',
    marketplace: 'قوالب المجتمع',
    admin: 'مسؤول النظام',
    aiSettings: 'تكوين الذكاء الاصطناعي',
    aiAgents: 'منظومة وكلاء الذكاء الاصطناعي',
    languageSelect: 'توطين النظام',
    searchPlaceholder: 'البحث في سير العمل، الوكلاء، العقد...',
    activeWorkflows: 'سير العمل النشط',
    enterpriseWorkspace: 'مساحات عمل المؤسسات',
    systemHealthy: 'النظام يعمل بكفاءة',
    offlineMode: 'وضع عدم الاتصال الآمن',
    runWorkflow: 'تشغيل المسار',
    saveWorkflow: 'حفظ الحالة',
    importExport: 'استيراد / تصدير المخطط',
    pwaTitle: 'تطبيق الويب التقدمي (PWA)',
    pwaDesc: 'قم بتثبيت FlowForge مباشرة على أجهزة Android أو iOS أو سطح المكتب للحصول على إمكانات كاملة دون اتصال بالإنترنت وإشعارات فورية.',
    pwaInstall: 'تثبيت تطبيق FlowForge',
    teamsTitle: 'المؤسسات والمتعاونون',
    rolePermissions: 'الأذونات المستندة إلى الأدوار (RBAC)',
    auditLogs: 'سجلات تدقيق الأمان في الوقت الفعلي',
    billingTitle: 'الاشتراكات والاستخدام المقاس',
    collaborators: 'فرق العمل النشطة',
    whiteLabel: 'العلامة التجارية المخصصة والبيضاء'
  },
  zh: {
    title: 'FlowForge 自动化与智能体工作空间',
    subtitle: '构建企业级可视化多智能体工作流、注册故障转移策略并执行 AI 模型。',
    backToCanvas: '返回画布',
    canvas: '可视化画布',
    analytics: '分析与追踪',
    marketplace: '社区模板',
    admin: '系统管理',
    aiSettings: 'AI 配置与高可用',
    aiAgents: 'AI 智能体生态系统',
    languageSelect: '系统本地化',
    searchPlaceholder: '搜索工作流、智能体、节点...',
    activeWorkflows: '活跃工作流',
    enterpriseWorkspace: '企业工作空间',
    systemHealthy: '系统运行正常',
    offlineMode: '本地离线安全存储',
    runWorkflow: '运行流水线',
    saveWorkflow: '保存状态',
    importExport: '导入/导出模式',
    pwaTitle: '渐进式网页应用 (PWA)',
    pwaDesc: '直接在 Android、iOS 或桌面端安装 FlowForge，享受完整的离线能力和即时推送通知。',
    pwaInstall: '安装 FlowForge 应用',
    teamsTitle: '组织与协作者',
    rolePermissions: '基于角色的权限控制 (RBAC)',
    auditLogs: '实时安全审计日志',
    billingTitle: '订阅与计量计费',
    collaborators: '活跃团队成员',
    whiteLabel: '白标与自定品牌'
  }
};

export function getTranslation(lang: string, key: keyof TranslationDictionary): string {
  const dictionary = TRANSLATIONS[lang] || TRANSLATIONS.en;
  return dictionary[key] || TRANSLATIONS.en[key] || String(key);
}
