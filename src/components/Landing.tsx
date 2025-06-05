// Test auto-deployment from Git integration
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { SendEmail } from "@/integrations/Core";
import { Lead } from "@/entities/Lead";
import {
  MessageSquare,
  Send,
  Code,
  Rocket,
  Users,
  Phone,
  Mail,
  ArrowRight,
  Brain,
  Sparkles,
  Globe2,
  Bot,
  X,
  ExternalLink,
  ChevronDown,
  CheckCircle2,
  AlertTriangle,
  Loader2,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { format } from "date-fns";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";

const fadeIn = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.5 },
};

const floatingParticlesConfig = Array(30)
  .fill(null)
  .map((_, i) => ({
    size: Math.random() * 6 + 2,
    initialX: Math.random() * 100,
    initialY: Math.random() * 100,
    duration: Math.random() * 8 + 4,
    delay: Math.random() * 2,
    color:
      i % 3 === 0
        ? "bg-pink-400"
        : i % 3 === 1
        ? "bg-blue-400"
        : "bg-purple-400",
  }));

interface Project {
  id: number;
  image: string;
  title: string;
  description: string;
  tech: string[];
  details: string;
  clientQuote: string;
  results: string[];
  link?: string;
}

export default function Landing() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [sendSuccess, setSendSuccess] = useState(false);
  const [sendError, setSendError] = useState(false);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isHebrew, setIsHebrew] = useState(true); // Default to Hebrew

  const translations = {
    en: {
      hero: {
        title: "Transform Your Ideas Into Reality",
        subtitle: "Next-generation app development powered by AI",
        getStarted: "Get Started",
        viewProjects: "View Projects",
        discoverMore: "Discover more",
      },
      nav: {
        about: "About",
        features: "Features",
        projects: "Projects",
        contactUs: "Contact Us",
      },
      ai: {
        title: "AI-Powered Development",
        subtitle:
          "Leveraging cutting-edge AI technologies to deliver smarter solutions",
        design: {
          title: "AI-Assisted Design",
          desc: "Smart UI/UX recommendations and automated design optimization to create intuitive interfaces that delight your users",
        },
        automation: {
          title: "Intelligent Automation",
          desc: "Automated testing and code optimization for faster delivery, ensuring your applications are robust and performant",
        },
        analytics: {
          title: "Smart Analytics",
          desc: "AI-driven insights and performance optimization that help you understand user behavior and make data-driven decisions",
        },
      },
      why: {
        title: "Why Choose GoCode?",
        subtitle: "We deliver excellence in every project",
        custom: {
          title: "Custom Development",
          desc: "Tailored solutions that perfectly match your business needs, built with scalability and maintainability in mind",
        },
        fast: {
          title: "Fast Delivery",
          desc: "Quick turnaround without compromising on quality, thanks to our efficient development processes and automation",
        },
        expert: {
          title: "Expert Team",
          desc: "Skilled developers with years of experience in cutting-edge technologies who are passionate about delivering exceptional results",
        },
      },
      projects: {
        title: "Our Latest Projects",
        viewDetails: "View Details",
        caseStudy: "Case Study",
        challenge: "The Challenge",
        results: "Results",
        projectDetails: "Project Details",
        technologies: "Technologies",
        testimonial: "Client Testimonial",
        discussProject: "Discuss a Similar Project",
        close: "Close",
        visitDemo: "Visit Live Demo",
      },
      contact: {
        title: "Get In Touch",
        subtitle: "Let's discuss how we can help bring your ideas to life",
        phone: "Phone",
        email: "Email",
        whatsapp: "WhatsApp",
        messageUs: "Message us on WhatsApp",
        yourEmail: "Your Email",
        message: "Message",
        howCanWeHelp: "How can we help you?",
        sendMessage: "Send Message",
        sending: "Sending...",
      },
      footer: {
        services: "Services",
        aiDevelopment: "AI Development",
        webDevelopment: "Web Development",
        mobileApps: "Mobile Apps",
        customSolutions: "Custom Solutions",
        navigation: "Navigation",
        aboutUs: "About Us",
        ourProjects: "Our Projects",
        getInTouch: "Get In Touch",
        contactInfo: "Contact Info",
        rights: "All rights reserved",
        tagline: "Transforming ideas into powerful digital solutions",
      },
    },
    he: {
      hero: {
        title: "הפוך את הרעיונות שלך למציאות",
        subtitle: "פיתוח אפליקציות מתקדם מונע בינה מלאכותית",
        getStarted: "בואו נתחיל",
        viewProjects: "צפה בפרויקטים",
        discoverMore: "גלה עוד",
      },
      nav: {
        about: "אודות",
        features: "יתרונות",
        projects: "פרויקטים",
        contactUs: "צור קשר",
      },
      ai: {
        title: "פיתוח מונע בינה מלאכותית",
        subtitle: "שימוש בטכנולוגיות AI מתקדמות לאספקת פתרונות חכמים יותר",
        design: {
          title: "עיצוב בסיוע AI",
          desc: "המלצות UI/UX חכמות ואופטימיזציה אוטומטית של עיצוב ליצירת ממשקים אינטואיטיביים",
        },
        automation: {
          title: "אוטומציה חכמה",
          desc: "בדיקות אוטומטיות ואופטימיזציה של קוד לאספקה מהירה יותר",
        },
        analytics: {
          title: "אנליטיקה חכמה",
          desc: "תובנות מבוססות AI ואופטימיזציה של ביצועים שעוזרים להבין התנהגות משתמשים",
        },
      },
      why: {
        title: "למה לבחור ב-GoCode?",
        subtitle: "אנחנו מספקים מצוינות בכל פרויקט",
        custom: {
          title: "פיתוח מותאם אישית",
          desc: "פתרונות מותאמים שמתאימים בדיוק לצרכים העסקיים שלך",
        },
        fast: {
          title: "אספקה מהירה",
          desc: "זמן תגובה מהיר מבלי להתפשר על איכות",
        },
        expert: {
          title: "צוות מומחים",
          desc: "מפתחים מיומנים עם שנים של ניסיון בטכנולוגיות מתקדמות",
        },
      },
      projects: {
        title: "הפרויקטים האחרונים שלנו",
        viewDetails: "צפה בפרטים",
        caseStudy: "חקר מקרה",
        challenge: "האתגר",
        results: "תוצאות",
        projectDetails: "פרטי הפרויקט",
        technologies: "טכנולוגיות",
        testimonial: "המלצת לקוח",
        discussProject: "דבר איתנו על פרויקט דומה",
        close: "סגור",
        visitDemo: "צפה בדמו חי",
      },
      contact: {
        title: "צור קשר",
        subtitle:
          "בוא נדבר על איך אנחנו יכולים לעזור להפוך את הרעיונות שלך למציאות",
        phone: "טלפון",
        email: "אימייל",
        whatsapp: "וואטסאפ",
        messageUs: "שלח לנו הודעה בוואטסאפ",
        yourEmail: "האימייל שלך",
        message: "הודעה",
        howCanWeHelp: "איך נוכל לעזור?",
        sendMessage: "שלח הודעה",
        sending: "שולח...",
      },
      footer: {
        services: "שירותים",
        aiDevelopment: "פיתוח בינה מלאכותית",
        webDevelopment: "פיתוח אתרים",
        mobileApps: "אפליקציות מובייל",
        customSolutions: "פתרונות מותאמים",
        navigation: "ניווט",
        aboutUs: "אודותינו",
        ourProjects: "הפרויקטים שלנו",
        getInTouch: "צור קשר",
        contactInfo: "פרטי התקשרות",
        rights: "כל הזכויות שמורות",
        tagline: "הופכים רעיונות לפתרונות דיגיטליים חזקים",
      },
    },
  };

  const t = translations[isHebrew ? "he" : "en"];

  const handleContact = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSending(true);
    setSendSuccess(false);
    setSendError(false);

    try {
      const currentDate = new Date();
      const formattedDate = format(currentDate, "yyyy-MM-dd HH:mm:ss");

      // Save the lead to Base44
      const newLead = await Lead.create({
        email: email,
        message: message,
        status: "new",
        source: "website",
        contact_date: currentDate.toISOString(),
      });

      // Call the Make.com webhook with formatted date - NOTE: We're stringifying directly
      try {
        // Create the payload object
        const payload = {
          email: email,
          message: message,
          leadId: newLead.$id,
          date: formattedDate,
          source: "GoCode website",
        };

        console.log("Sending to Make.com:", payload); // Log what we're sending

        // Explicitly stringify the payload
        const jsonPayload = JSON.stringify(payload);

        await fetch(
          "https://hook.eu2.make.com/ngunsspio99z6lfr69ub6c9o28wi2qza",
          {
            method: "POST",
            mode: "no-cors",
            headers: {
              "Content-Type": "application/json",
            },
            body: jsonPayload,
          }
        );

        console.log(
          "Make.com webhook notification sent with formatted date:",
          formattedDate
        );
      } catch (webhookError) {
        console.error(
          "Error notifying Make.com webhook (form still submitted):",
          webhookError
        );
      }

      // Optionally still send email notification
      try {
        await SendEmail({
          to: "contact@gocode.co.il", // Updated email
          subject: "New Lead Submitted",
          body: `
New lead submitted:

Email: ${email}
Message: ${message}
Lead ID: ${newLead.$id}

Sent from: GoCode website contact form
        `,
        });
      } catch (emailError) {
        console.error(
          "Email notification failed (form still submitted):",
          emailError
        );
      }

      setEmail("");
      setMessage("");
      setSendSuccess(true);
      setTimeout(() => setSendSuccess(false), 5000);
    } catch (error) {
      console.error("Error saving lead:", error);
      setSendError(true);
    }

    setIsSending(false);
  };

  const projects: Project[] = [
    {
      id: 1,
      image:
        "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/e91e47_6.jpg",
      title: "Anydish App",
      description:
        "Personalized endless recipes based on pre-set, precise, macro & micronutrients and user's preferences. The app also compares food according to these same restrictions and preferences.",
      tech: ["React Native", "TypeScript", "Node.js", "MongoDB"],
      details:
        "Anydish provides detailed nutritional analysis and food comparison tools with an intuitive user interface. We implemented a medical dashboard, in-app purchases, and cross-platform support for both Android and iOS.",
      clientQuote:
        "The app has significantly improved how our users make food choices based on their dietary needs!",
      results: [
        "Available on Google Play Store",
        "Cross-platform support for Android & iOS",
        "Personalized recipe recommendations",
        "Comprehensive food comparison tools",
      ],
      link: "https://play.google.com/store/apps/details?id=com.anydish.app",
    },
    {
      id: 2,
      image:
        "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/a2cf21_13.png",
      title: "ImagenAI CRM App",
      description:
        "AI-powered photo editing solution for Adobe Lightroom Classic that learns your personal style and saves you time. We built the CRM system for ImagenAI customer success managers.",
      tech: ["Vue.js 3", "TypeScript", "Quasar", "Chart.js", "TailwindCSS"],
      details:
        "The CRM system provides comprehensive user management capabilities with advanced features like autocomplete search, customized data tables, and detailed usage statistics. The system helps customer success managers track and support photographers using ImagenAI's AI photo editing solution.",
      clientQuote:
        "The CRM system has significantly improved our ability to manage and support our growing user base efficiently.",
      results: [
        "Complete user management system",
        "Real-time usage statistics and analytics",
        "Customizable data tables with advanced filtering",
        "Responsive mobile-ready design",
        "Seamless integration with existing systems",
      ],
      link: "https://imagen-ai.com/",
    },
    {
      id: 3,
      image:
        "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/883888_7.png",
      title: "DirotNet",
      description:
        "A comprehensive real estate platform similar to Madlan.co.il, featuring property listings, lead management, and advanced administrative capabilities.",
      tech: ["Nuxt 3", "Vue.js 3", "TypeScript", "Mapbox", "TailwindCSS"],
      details:
        "The platform includes a sophisticated leads system, property publishing for sale/rent/vacation, admin dashboard, and professional user access. Features multi-language support and RTL compatibility.",
      clientQuote:
        "DirotNet has revolutionized how we manage and present real estate listings with its comprehensive feature set and user-friendly interface.",
      results: [
        "Complete property management system",
        "Multi-language support (Hebrew & English)",
        "Advanced user authentication",
        "Interactive maps with RTL support",
        "Responsive design for all devices",
      ],
      link: "https://dirotnet.vercel.app/",
    },
  ];

  // Add translated projects
  const getLocalizedProjects = () => {
    if (isHebrew) {
      return [
        {
          id: 1,
          image:
            "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/e91e47_6.jpg",
          title: "אפליקציית Anydish",
          description:
            "מתכונים מותאמים אישית על בסיס מאקרו ומיקרונוטריאנטים מוגדרים מראש, והעדפות המשתמש. האפליקציה גם משווה מזונות על פי אותן הגבלות והעדפות.",
          tech: ["React Native", "TypeScript", "Node.js", "MongoDB"],
          details:
            "Anydish מספקת ניתוח תזונתי מפורט וכלי השוואת מזון עם ממשק משתמש אינטואיטיבי. יישמנו לוח בקרה רפואי, רכישות בתוך האפליקציה, ותמיכה חוצת פלטפורמות עבור Android ו-iOS.",
          clientQuote:
            "האפליקציה שיפרה משמעותית את האופן בו המשתמשים שלנו בוחרים מזון בהתבסס על הצרכים התזונתיים שלהם!",
          results: [
            "זמינה בחנות Google Play",
            "תמיכה חוצת פלטפורמות ל-Android ו-iOS",
            "המלצות מתכונים מותאמות אישית",
            "כלי השוואת מזון מקיפים",
          ],
          link: "https://play.google.com/store/apps/details?id=com.anydish.app",
        },
        {
          id: 2,
          image:
            "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/a2cf21_13.png",
          title: "מערכת CRM של ImagenAI",
          description:
            "פתרון עריכת תמונות מבוסס בינה מלאכותית עבור Adobe Lightroom Classic שלומד את הסגנון האישי שלך וחוסך לך זמן. בנינו את מערכת ה-CRM עבור מנהלי הצלחת הלקוחות של ImagenAI.",
          tech: ["Vue.js 3", "TypeScript", "Quasar", "Chart.js", "TailwindCSS"],
          details:
            "מערכת ה-CRM מספקת יכולות ניהול משתמשים מקיפות עם תכונות מתקדמות כמו חיפוש אוטומטי, טבלאות נתונים מותאמות אישית וסטטיסטיקות שימוש מפורטות. המערכת מסייעת למנהלי הצלחת לקוחות לעקוב ולתמוך בצלמים המשתמשים בפתרון עריכת התמונות של ImagenAI.",
          clientQuote:
            "מערכת ה-CRM שיפרה משמעותית את היכולת שלנו לנהל ולתמוך בבסיס המשתמשים הגדל שלנו ביעילות.",
          results: [
            "מערכת ניהול משתמשים מלאה",
            "סטטיסטיקות שימוש ואנליטיקה בזמן אמת",
            "טבלאות נתונים מותאמות אישית עם סינון מתקדם",
            "עיצוב רספונסיבי מותאם למובייל",
            "אינטגרציה חלקה עם המערכות הקיימות",
          ],
          link: "https://imagen-ai.com/",
        },
        {
          id: 3,
          image:
            "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/883888_7.png",
          title: "דירות נט",
          description:
            "פלטפורמת נדל״ן מקיפה בסגנון מדלן, הכוללת רשימות נכסים, ניהול לידים ויכולות ניהול מתקדמות.",
          tech: ["Nuxt 3", "Vue.js 3", "TypeScript", "Mapbox", "TailwindCSS"],
          details:
            "הפלטפורמה כוללת מערכת לידים מתוחכמת, פרסום נכסים למכירה/השכרה/חופשה, לוח בקרה למנהלים וגישת משתמשים מקצועית. כוללת תמיכה במספר שפות והתאמה לכתיבה מימין לשמאל.",
          clientQuote:
            "דירות נט שינתה את האופן בו אנחנו מנהלים ומציגים רשימות נדל״ן עם מערכת התכונות המקיפה והממשק הידידותי למשתמש.",
          results: [
            "מערכת ניהול נכסים מלאה",
            "תמיכה במספר שפות (עברית ואנגלית)",
            "מערכת אימות משתמשים מתקדמת",
            "מפות אינטראקטיביות עם תמיכה בכתיבה מימין לשמאל",
            "עיצוב רספונסיבי לכל המכשירים",
          ],
          link: "https://dirotnet.vercel.app/",
        },
      ];
    } else {
      return projects;
    }
  };

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
    setIsMenuOpen(false);
  };

  // Update the projects section to use localized projects
  return (
    <div
      className={`min-h-screen bg-gray-900 text-gray-100 ${
        isHebrew ? "rtl" : "ltr"
      }`}
      style={isHebrew ? { fontFamily: "Rubik, system-ui, sans-serif" } : {}}
    >
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-gray-900/80 backdrop-blur-md border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 md:h-20">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <img
                  src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/23172f_logo-new-clean.png"
                  alt="GoCode"
                  className="h-8 md:h-10"
                />
              </div>
              <h1
                className={`ml-3 text-xl md:text-2xl font-bold text-white flex items-center ${
                  isHebrew ? "font-heebo" : ""
                }`}
                style={
                  isHebrew
                    ? { fontFamily: "Rubik, system-ui, sans-serif" }
                    : { fontFamily: "Poppins, Inter, system-ui, sans-serif" }
                }
              >
                {isHebrew ? "גו - קוד" : "GoCode"}
              </h1>
            </div>

            <div className="hidden md:flex items-center gap-6">
              <nav
                className={`flex items-center ${
                  isHebrew ? "space-x-6 space-x-reverse" : "space-x-6"
                }`}
              >
                <button
                  onClick={() => scrollToSection("about")}
                  className="text-gray-300 hover:text-pink-400 transition-colors !bg-transparent"
                >
                  {t.nav.about}
                </button>
                <button
                  onClick={() => scrollToSection("features")}
                  className="text-gray-300 hover:text-pink-400 transition-colors !bg-transparent"
                >
                  {t.nav.features}
                </button>
                <button
                  onClick={() => scrollToSection("projects")}
                  className="text-gray-300 hover:text-pink-400 transition-colors !bg-transparent"
                >
                  {t.nav.projects}
                </button>
                <button
                  onClick={() => scrollToSection("contact")}
                  className="text-gray-300 hover:text-pink-400 transition-colors !bg-transparent"
                >
                  {t.nav.contactUs}
                </button>
              </nav>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsHebrew(!isHebrew)}
                className="text-gray-300 hover:text-pink-400 font-bold"
                title={isHebrew ? "Switch to English" : "החלף לעברית"}
              >
                {isHebrew ? "EN" : "עב"}
              </Button>
            </div>

            <div className="md:hidden flex items-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsHebrew(!isHebrew)}
                className="text-gray-300 hover:text-pink-400"
                title={isHebrew ? "Switch to English" : "החלף לעברית"}
              >
                <Globe2 className="h-5 w-5" />
              </Button>
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="text-gray-400 hover:text-white"
              >
                {isMenuOpen ? <X size={24} /> : <ChevronDown size={24} />}
              </button>
            </div>
          </div>

          {/* Mobile menu */}
          <AnimatePresence>
            {isMenuOpen && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="md:hidden"
              >
                <nav className="flex flex-col space-y-4 py-4">
                  <button
                    onClick={() => scrollToSection("about")}
                    className="text-gray-300 hover:text-pink-400 transition-colors !bg-transparent"
                  >
                    {t.nav.about}
                  </button>
                  <button
                    onClick={() => scrollToSection("features")}
                    className="text-gray-300 hover:text-pink-400 transition-colors !bg-transparent"
                  >
                    {t.nav.features}
                  </button>
                  <button
                    onClick={() => scrollToSection("projects")}
                    className="text-gray-300 hover:text-pink-400 transition-colors !bg-transparent"
                  >
                    {t.nav.projects}
                  </button>
                  <button
                    onClick={() => scrollToSection("contact")}
                    className="px-4 py-2 rounded-md text-gray-300 hover:text-pink-400 transition-colors !bg-transparent"
                  >
                    {t.nav.contactUs}
                  </button>
                </nav>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-blue-900 via-indigo-900 to-purple-900 text-white overflow-hidden pt-28 md:pt-32">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1451187580459-43490279c0fa')] bg-cover bg-center opacity-10" />
        <div className="absolute inset-0 bg-black opacity-60" />

        {/* Enhanced animated elements */}
        <div className="absolute inset-0 overflow-hidden">
          {/* Enlarged code symbols */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8, x: -100 }}
            animate={{ opacity: [0.2, 0.5, 0.2], scale: [1, 1.2, 1], x: 0 }}
            transition={{
              duration: 3,
              repeat: Infinity,
              repeatType: "reverse",
              ease: "easeInOut",
            }}
            className="absolute top-20 left-[10%] text-8xl text-blue-500 font-mono transform -rotate-12"
          >
            {"</>"}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.8, x: 100 }}
            animate={{ opacity: [0.2, 0.5, 0.2], scale: [1, 1.2, 1], x: 0 }}
            transition={{
              duration: 3,
              delay: 0.5,
              repeat: Infinity,
              repeatType: "reverse",
              ease: "easeInOut",
            }}
            className="absolute bottom-40 right-[10%] text-7xl text-pink-500 font-mono transform rotate-12"
          >
            {"{}"}
          </motion.div>

          {/* Binary code background */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: [0.1, 0.2, 0.1] }}
            transition={{ duration: 4, repeat: Infinity }}
            className="absolute inset-0 text-[8px] text-blue-500/20 overflow-hidden pointer-events-none select-none"
            style={{
              fontFamily: "monospace",
              lineHeight: "1.2em",
              wordBreak: "break-all",
            }}
          >
            {"10".repeat(2000)}
          </motion.div>

          {/* Enhanced floating particles */}
          {floatingParticlesConfig.map((config, i) => (
            <motion.div
              key={i}
              className={`absolute rounded-full ${config.color}`}
              initial={{
                x: `${config.initialX}%`,
                y: -20,
                opacity: 0,
                scale: 0,
              }}
              animate={{
                y: "120vh",
                x: `calc(${config.initialX}% + ${Math.sin(i) * 100}px)`,
                opacity: [0, 0.8, 0],
                scale: [0, 1, 0],
              }}
              transition={{
                duration: config.duration,
                repeat: Infinity,
                delay: config.delay,
                ease: "linear",
              }}
              style={{
                width: `${config.size}px`,
                height: `${config.size}px`,
                filter: "blur(1px)",
              }}
            />
          ))}

          {/* Glowing orbs */}
          <motion.div
            className="absolute top-1/4 left-1/4 w-32 h-32 bg-blue-500/30 rounded-full blur-3xl"
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.3, 0.6, 0.3],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
          <motion.div
            className="absolute bottom-1/4 right-1/4 w-32 h-32 bg-pink-500/30 rounded-full blur-3xl"
            animate={{
              scale: [1.2, 1, 1.2],
              opacity: [0.3, 0.6, 0.3],
            }}
            transition={{
              duration: 4,
              delay: 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
          className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32"
        >
          <div className="text-center">
            <motion.div
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.8 }}
              className="mb-10"
            >
              <motion.div
                className="flex justify-center mb-8"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.3 }}
              >
                <div className="relative w-48 md:w-64">
                  <motion.div
                    className="absolute inset-0 bg-pink-600 rounded-lg blur-xl"
                    animate={{
                      opacity: [0.4, 0.8, 0.4],
                      scale: [1, 1.1, 1],
                    }}
                    transition={{
                      duration: 3,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                  />
                  <motion.img
                    src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/23172f_logo-new-clean.png"
                    alt="GoCode"
                    className="relative w-full"
                    whileHover={{
                      scale: 1.05,
                      rotate: [0, -2, 2, 0],
                      transition: { duration: 0.5 },
                    }}
                  />
                </div>
              </motion.div>

              <motion.h1
                className="text-5xl md:text-7xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.8 }}
              >
                <motion.span
                  animate={{
                    backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
                  }}
                  transition={{
                    duration: 5,
                    repeat: Infinity,
                    ease: "linear",
                  }}
                  className="inline-block bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-[length:200%_auto] bg-clip-text text-transparent"
                >
                  {t.hero.title}
                </motion.span>
              </motion.h1>

              <motion.p
                className="text-xl md:text-2xl mb-8 text-blue-200"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8, duration: 0.8 }}
              >
                {t.hero.subtitle}
              </motion.p>

              <motion.div
                className="flex flex-col sm:flex-row justify-center gap-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1, duration: 0.8 }}
              >
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button
                    size="lg"
                    className="bg-pink-600 text-white hover:bg-pink-700 transition-all duration-200 text-lg h-14 px-8 relative overflow-hidden group"
                    onClick={() => scrollToSection("contact")}
                  >
                    <motion.span
                      className="absolute inset-0 bg-white/20"
                      initial={{ x: "-100%" }}
                      whileHover={{ x: "100%" }}
                      transition={{ duration: 0.5 }}
                    />
                    {t.hero.getStarted}
                    <ArrowRight
                      className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform"
                      style={isHebrew ? { transform: "scaleX(-1)" } : {}}
                    />
                  </Button>
                </motion.div>

                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button
                    size="lg"
                    className="bg-transparent border-2 border-blue-400 text-blue-400 hover:bg-blue-400/10 transition-all duration-200 text-lg h-14 px-8"
                    onClick={() => scrollToSection("projects")}
                  >
                    {t.hero.viewProjects}
                  </Button>
                </motion.div>
              </motion.div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.5, duration: 1 }}
              className="mt-16"
            >
              <motion.div
                animate={{
                  y: [0, -10, 0],
                  opacity: [0.5, 1, 0.5],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              >
                <button
                  onClick={() => scrollToSection("about")}
                  className="text-white/80 hover:text-white transition-colors flex flex-col items-center group !bg-transparent"
                >
                  <span className="mb-2 group-hover:text-pink-400 transition-colors">
                    {t.hero.discoverMore}
                  </span>
                  <ChevronDown className="w-6 h-6 group-hover:text-pink-400 transition-colors" />
                </button>
              </motion.div>
            </motion.div>
          </div>
        </motion.div>
      </section>

      {/* AI Capabilities Section */}
      <section id="about" className="py-20 bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div className="text-center mb-16" {...fadeIn}>
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-pink-500">
              {t.ai.title}
            </h2>
            <p className="text-xl text-gray-300">{t.ai.subtitle}</p>
          </motion.div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: <Brain className="h-8 w-8 text-blue-400" />,
                title: t.ai.design.title,
                description: t.ai.design.desc,
              },
              {
                icon: <Bot className="h-8 w-8 text-pink-400" />,
                title: t.ai.automation.title,
                description: t.ai.automation.desc,
              },
              {
                icon: <Sparkles className="h-8 w-8 text-purple-400" />,
                title: t.ai.analytics.title,
                description: t.ai.analytics.desc,
              },
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2 }}
              >
                <Card className="bg-gray-800 border-gray-700 hover:bg-gray-700 transition-all duration-300 transform hover:-translate-y-2 h-full flex flex-col">
                  <CardContent className="p-6 text-center flex-1 flex flex-col">
                    <div className="rounded-full bg-gray-700 p-3 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                      {feature.icon}
                    </div>
                    <h3 className="text-xl font-semibold mb-2 text-white">
                      {feature.title}
                    </h3>
                    <p className="text-gray-300 flex-1">
                      {feature.description}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section with Animation */}
      <section id="features" className="py-20 bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div className="text-center mb-16" {...fadeIn}>
            <h2 className="text-3xl md:text-4xl font-bold text-pink-500 mb-4">
              {t.why.title}
            </h2>
            <p className="text-xl text-gray-300">{t.why.subtitle}</p>
          </motion.div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: <Code className="h-8 w-8 text-pink-400" />,
                title: t.why.custom.title,
                description: t.why.custom.desc,
              },
              {
                icon: <Rocket className="h-8 w-8 text-blue-400" />,
                title: t.why.fast.title,
                description: t.why.fast.desc,
              },
              {
                icon: <Users className="h-8 w-8 text-purple-400" />,
                title: t.why.expert.title,
                description: t.why.expert.desc,
              },
            ].map((feature, index) => (
              <motion.div
                key={index}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Card className="bg-gray-700 hover:bg-gray-600 transition-all duration-300 border-gray-600 h-full flex flex-col">
                  <CardContent className="p-6 text-center flex-1 flex flex-col">
                    <motion.div
                      whileHover={{ rotate: 360 }}
                      transition={{ duration: 0.5 }}
                      className="rounded-full bg-gray-800 p-3 w-16 h-16 mx-auto mb-4 flex items-center justify-center"
                    >
                      {feature.icon}
                    </motion.div>
                    <h3 className="text-xl font-semibold mb-2 text-white">
                      {feature.title}
                    </h3>
                    <p className="text-gray-300 flex-1">
                      {feature.description}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Projects Section with Hover Effects */}
      <section id="projects" className="py-20 bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.h2
            className="text-3xl md:text-4xl font-bold text-center mb-16 text-pink-500"
            {...fadeIn}
          >
            {t.projects.title}
          </motion.h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {getLocalizedProjects().map((project, index) => (
              <motion.div
                key={index}
                whileHover={{ y: -10 }}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2 }}
              >
                <Card
                  className="overflow-hidden group bg-gray-800 border-gray-700 h-full flex flex-col cursor-pointer"
                  onClick={() => setSelectedProject(project)}
                >
                  <div className="relative overflow-hidden">
                    <img
                      src={project.image}
                      alt={project.title}
                      className="w-full h-48 object-cover transform group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                      <Button
                        variant="ghost"
                        className="text-white border border-white/50 hover:bg-white/20"
                      >
                        {t.projects.viewDetails}
                      </Button>
                    </div>
                  </div>
                  <CardContent className="p-6 flex-1 flex flex-col">
                    <h3 className="text-xl font-semibold mb-2 text-white">
                      {project.title}
                    </h3>
                    <p className="text-gray-300 mb-4 flex-1">
                      {project.description}
                    </p>
                    <div className="flex flex-wrap gap-2 mt-auto">
                      {project.tech.map((tech, i) => (
                        <span
                          key={i}
                          className="text-xs bg-pink-900/40 text-pink-300 px-2 py-1 rounded-full border border-pink-800/50"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Clients Section */}
      <section className="py-20 bg-gray-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.h2
            className="text-3xl md:text-4xl font-bold text-center mb-16 text-pink-500"
            {...fadeIn}
          >
            נבחר על ידי
          </motion.h2>
          <div className="flex flex-wrap justify-center items-center gap-12">
            <motion.div
              className="flex items-center justify-center p-6"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              whileHover={{ scale: 1.05 }}
            >
              <img
                src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/5ab9e0_Yad2Logo.png"
                alt="Yad2"
                className="max-h-24 object-contain"
              />
            </motion.div>

            <motion.div
              className="flex items-center justify-center p-6 rounded-xl"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 }}
              whileHover={{ scale: 1.05 }}
            >
              <img
                src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/33c101_InsuranceSearch.png"
                alt="Direct Insurance"
                className="max-h-24 object-contain"
              />
            </motion.div>

            <motion.div
              className="flex items-center justify-center p-6"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.4 }}
              whileHover={{ scale: 1.05 }}
            >
              <img
                src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/091cb5_WEBPtoPNGConversion.png"
                alt="Jacada"
                className="max-h-24 object-contain"
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20 bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <motion.div
              {...fadeIn}
              className={`${!isHebrew ? "text-left" : ""}`}
            >
              <h2
                className={`text-3xl md:text-4xl font-bold mb-6 text-pink-500 ${
                  !isHebrew ? "text-left" : ""
                }`}
              >
                {t.contact.title}
              </h2>
              <p
                className={`text-xl text-gray-300 mb-8 ${
                  !isHebrew ? "text-left" : ""
                }`}
              >
                {t.contact.subtitle}
              </p>
              <div className="space-y-6">
                <motion.div
                  className="flex items-center gap-4 group"
                  whileHover={{ scale: 1.02 }}
                  transition={{ duration: 0.2 }}
                >
                  <motion.div
                    className="w-14 h-14 rounded-full bg-gradient-to-br from-pink-500 to-purple-600 flex items-center justify-center shadow-lg group-hover:shadow-pink-500/25 transition-all duration-300"
                    whileHover={{ rotate: 360 }}
                    transition={{ duration: 0.5 }}
                  >
                    <Phone className="h-7 w-7 text-white" />
                  </motion.div>
                  <div>
                    <p className="font-medium text-white/90 text-sm uppercase tracking-wide">
                      {t.contact.phone}
                    </p>
                    <a
                      href="tel:+972525710099"
                      className="text-xl font-semibold text-pink-400 hover:text-pink-300 transition-colors duration-200 block mt-1 hover:scale-105 transform origin-left"
                      dir="ltr"
                    >
                      +972 52 571 0099
                    </a>
                  </div>
                </motion.div>
                <motion.div
                  className="flex items-center gap-4 group"
                  whileHover={{ scale: 1.02 }}
                  transition={{ duration: 0.2 }}
                >
                  <motion.div
                    className="w-14 h-14 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg group-hover:shadow-blue-500/25 transition-all duration-300"
                    whileHover={{ rotate: 360 }}
                    transition={{ duration: 0.5 }}
                  >
                    <Mail className="h-7 w-7 text-white" />
                  </motion.div>
                  <div>
                    <p className="font-medium text-white/90 text-sm uppercase tracking-wide">
                      {t.contact.email}
                    </p>
                    <a
                      href="mailto:contact@gocode.co.il"
                      className="text-xl font-semibold text-blue-400 hover:text-blue-300 transition-colors duration-200 block mt-1 hover:scale-105 transform origin-left"
                    >
                      contact@gocode.co.il
                    </a>
                  </div>
                </motion.div>
                <motion.div
                  className="flex items-center gap-4 group"
                  whileHover={{ scale: 1.02 }}
                  transition={{ duration: 0.2 }}
                >
                  <motion.div
                    className="w-14 h-14 rounded-full bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center shadow-lg group-hover:shadow-green-500/25 transition-all duration-300"
                    whileHover={{ rotate: 360 }}
                    transition={{ duration: 0.5 }}
                  >
                    <MessageSquare className="h-7 w-7 text-white" />
                  </motion.div>
                  <div>
                    <p className="font-medium text-white/90 text-sm uppercase tracking-wide">
                      {t.contact.whatsapp}
                    </p>
                    <a
                      href="https://wa.me/972525710099"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xl font-semibold text-green-400 hover:text-green-300 transition-colors duration-200 block mt-1 hover:scale-105 transform origin-left"
                    >
                      {t.contact.messageUs}
                    </a>
                  </div>
                </motion.div>
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <Card className="bg-gray-800 border-gray-700 overflow-hidden">
                <CardContent className="p-6">
                  {sendSuccess && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="mb-4 p-3 bg-green-900/40 border border-green-700 rounded-md text-green-200"
                    >
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="h-5 w-5 text-green-400" />
                        <span>
                          Message received! We'll get back to you soon.
                        </span>
                      </div>
                    </motion.div>
                  )}

                  {sendError && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="mb-4 p-3 bg-red-900/40 border border-red-700 rounded-md text-red-200"
                    >
                      <div className="flex items-center gap-2">
                        <AlertTriangle className="h-5 w-5 text-red-400" />
                        <span>Failed to send message. Please try again.</span>
                      </div>
                    </motion.div>
                  )}

                  <form onSubmit={handleContact} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-2 text-gray-200">
                        {t.contact.yourEmail}
                      </label>
                      <Input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder={t.contact.yourEmail}
                        required
                        className="bg-gray-700 border-gray-600 text-white placeholder:text-gray-400"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2 text-gray-200">
                        {t.contact.message}
                      </label>
                      <Textarea
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        placeholder={t.contact.howCanWeHelp}
                        className="h-32 bg-gray-700 border-gray-600 text-white placeholder:text-gray-400"
                        required
                      />
                    </div>
                    <motion.div
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Button
                        type="submit"
                        className="w-full bg-pink-600 hover:bg-pink-700 text-white relative overflow-hidden group"
                        disabled={isSending}
                      >
                        <motion.span
                          className="absolute inset-0 bg-white/10"
                          initial={{ x: "-100%" }}
                          whileHover={{ x: "100%" }}
                          transition={{ duration: 0.5 }}
                        />
                        {isSending ? (
                          <div className="flex items-center justify-center">
                            <Loader2 className="w-4 h-4 animate-spin mr-2" />
                            {t.contact.sending}
                          </div>
                        ) : (
                          <div className="flex items-center justify-center">
                            {t.contact.sendMessage}
                            <Send className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                          </div>
                        )}
                      </Button>
                    </motion.div>
                  </form>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-950 text-gray-300 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="mb-4 w-32">
                <img
                  src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/23172f_logo-new-clean.png"
                  alt="GoCode"
                  className="w-full"
                />
              </div>
              <p className="text-gray-400">{t.footer.tagline}</p>
            </div>
            <div>
              <h4 className="font-semibold mb-4 text-gray-200">
                {t.footer.services}
              </h4>
              <ul className="space-y-2 text-gray-400">
                <li className="hover:text-pink-400 transition-colors cursor-pointer">
                  <button
                    onClick={() => scrollToSection("features")}
                    className="!bg-transparent"
                  >
                    {t.footer.aiDevelopment}
                  </button>
                </li>
                <li className="hover:text-pink-400 transition-colors cursor-pointer">
                  <button
                    onClick={() => scrollToSection("features")}
                    className="!bg-transparent"
                  >
                    {t.footer.webDevelopment}
                  </button>
                </li>
                <li className="hover:text-pink-400 transition-colors cursor-pointer">
                  <button
                    onClick={() => scrollToSection("features")}
                    className="!bg-transparent"
                  >
                    {t.footer.mobileApps}
                  </button>
                </li>
                <li className="hover:text-pink-400 transition-colors cursor-pointer">
                  <button
                    onClick={() => scrollToSection("features")}
                    className="!bg-transparent"
                  >
                    {t.footer.customSolutions}
                  </button>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4 text-gray-200">
                {t.footer.navigation}
              </h4>
              <ul className="space-y-2 text-gray-400">
                <li className="hover:text-pink-400 transition-colors cursor-pointer">
                  <button
                    onClick={() => scrollToSection("about")}
                    className="!bg-transparent"
                  >
                    {t.footer.aboutUs}
                  </button>
                </li>
                <li className="hover:text-pink-400 transition-colors cursor-pointer">
                  <button
                    onClick={() => scrollToSection("projects")}
                    className="!bg-transparent"
                  >
                    {t.footer.ourProjects}
                  </button>
                </li>
                <li className="hover:text-pink-400 transition-colors cursor-pointer">
                  <button
                    onClick={() => scrollToSection("contact")}
                    className="!bg-transparent"
                  >
                    {t.footer.getInTouch}
                  </button>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4 text-gray-200">
                {t.footer.contactInfo}
              </h4>
              <div className="space-y-2 text-gray-400">
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4" />
                  <a
                    href="tel:+972525710099"
                    className="hover:text-pink-400 transition-colors"
                    dir="ltr"
                  >
                    +972 52 571 0099
                  </a>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4" />
                  <a
                    href="mailto:contact@gocode.co.il"
                    className="hover:text-pink-400 transition-colors"
                  >
                    contact@gocode.co.il
                  </a>
                </div>
                <div className="flex items-center gap-2">
                  <MessageSquare className="h-4 w-4" />
                  <a
                    href="https://wa.me/972525710099"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-pink-400 transition-colors"
                  >
                    WhatsApp
                  </a>
                </div>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-400">
            <p>© 2024 GoCode. {t.footer.rights}.</p>
          </div>
        </div>
      </footer>

      {/* Project Details Modal */}
      <Dialog
        open={!!selectedProject}
        onOpenChange={() => setSelectedProject(null)}
      >
        <DialogContent className="bg-gray-800 text-white border-gray-700 max-w-4xl">
          {selectedProject && (
            <>
              <DialogHeader>
                <DialogTitle className="text-2xl font-bold text-white flex items-center gap-2">
                  {selectedProject.title}
                  <span className="bg-pink-600 text-xs rounded-full px-2 py-1 ml-2">
                    {t.projects.caseStudy}
                  </span>
                </DialogTitle>
                <DialogDescription className="text-gray-300 mt-2">
                  {selectedProject.description}
                </DialogDescription>
              </DialogHeader>

              <div className="grid md:grid-cols-3 gap-6 mt-4 mb-6">
                <div className="md:col-span-2">
                  <img
                    src={selectedProject.image}
                    alt={selectedProject.title}
                    className="w-full h-64 object-cover rounded-md"
                  />

                  <div className="mt-6">
                    <h4 className="text-lg font-semibold mb-3 text-white">
                      {t.projects.challenge}
                    </h4>
                    <p className="text-gray-300 mb-6">
                      {selectedProject.details}
                    </p>

                    <h4 className="text-lg font-semibold mb-3 text-white">
                      {t.projects.results}
                    </h4>
                    <ul className="space-y-2">
                      {selectedProject.results.map((result, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <span className="mt-1 text-green-400">✓</span>
                          <span className="text-gray-300">{result}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="bg-gray-700/50 p-4 rounded-md">
                  <h4 className="text-lg font-semibold mb-3 text-white">
                    {t.projects.projectDetails}
                  </h4>

                  <div className="space-y-4">
                    <div>
                      <p className="text-sm text-gray-400">
                        {t.projects.technologies}
                      </p>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {selectedProject.tech.map((tech, i) => (
                          <span
                            key={i}
                            className="text-xs bg-pink-900/40 text-pink-300 px-2 py-1 rounded-full border border-pink-800/50"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div>
                      <p className="text-sm text-gray-400">
                        {t.projects.testimonial}
                      </p>
                      <blockquote className="border-l-2 border-pink-500 pl-4 mt-2 text-white italic">
                        "{selectedProject.clientQuote}"
                      </blockquote>
                    </div>

                    <Button
                      className="w-full bg-pink-600 hover:bg-pink-700 mt-4"
                      onClick={() => {
                        setSelectedProject(null);
                        scrollToSection("contact");
                      }}
                    >
                      {t.projects.discussProject}
                    </Button>
                  </div>
                </div>
              </div>

              <DialogFooter
                className={`flex-col sm:flex-row gap-2 ${
                  isHebrew
                    ? "sm:justify-start sm:space-x-reverse"
                    : "sm:justify-end sm:space-x-2"
                }`}
              >
                <DialogClose asChild>
                  <Button
                    variant="outline"
                    className="border-gray-600 text-gray-300 hover:bg-gray-700 hover:text-white"
                  >
                    {t.projects.close}
                  </Button>
                </DialogClose>
                {selectedProject && selectedProject.link && (
                  <Button
                    className="bg-blue-600 hover:bg-blue-700"
                    onClick={() => window.open(selectedProject.link, "_blank")}
                  >
                    <ExternalLink className="w-4 h-4 mr-2" />
                    {t.projects.visitDemo}
                  </Button>
                )}
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
