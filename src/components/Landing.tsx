import React, { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Card, CardContent } from "./ui/card";
import { LeadService } from "../services/leadService";
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
  Cpu,
  Sparkles,
  Globe2,
  Bot,
  ExternalLink,
  CheckCircle2,
  AlertTriangle,
  Loader2,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const fadeIn = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.5 },
};

export default function Landing() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [sendSuccess, setSendSuccess] = useState(false);
  const [sendError, setSendError] = useState(false);

  const handleContact = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSending(true);
    setSendSuccess(false);
    setSendError(false);

    try {
      const currentDate = new Date();

      // Save the lead to Appwrite
      await LeadService.create({
        email: email,
        message: message,
        status: "new",
        source: "website",
        contact_date: currentDate.toISOString(),
      });

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

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-violet-900 text-white overflow-hidden">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-black/20 backdrop-blur-lg border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              GoCode
            </div>
            <div className="hidden md:flex space-x-8">
              <button
                onClick={() => scrollToSection("about")}
                className="hover:text-purple-300 transition-colors"
              >
                About
              </button>
              <button
                onClick={() => scrollToSection("features")}
                className="hover:text-purple-300 transition-colors"
              >
                Features
              </button>
              <button
                onClick={() => scrollToSection("projects")}
                className="hover:text-purple-300 transition-colors"
              >
                Projects
              </button>
              <button
                onClick={() => scrollToSection("contact")}
                className="hover:text-purple-300 transition-colors"
              >
                Contact
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section
        id="hero"
        className="relative min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8"
      >
        <div className="text-center max-w-4xl mx-auto">
          <motion.h1
            {...fadeIn}
            className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-white via-purple-200 to-pink-200 bg-clip-text text-transparent"
          >
            Transform Your Ideas Into Reality
          </motion.h1>
          <motion.p
            {...fadeIn}
            transition={{ delay: 0.2 }}
            className="text-xl md:text-2xl mb-8 text-gray-300"
          >
            Next-generation app development powered by AI
          </motion.p>
          <motion.div
            {...fadeIn}
            transition={{ delay: 0.4 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Button
              onClick={() => scrollToSection("contact")}
              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-8 py-4 text-lg"
            >
              Get Started <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
            <Button
              onClick={() => scrollToSection("projects")}
              variant="outline"
              className="border-purple-400 text-purple-300 hover:bg-purple-400/10 px-8 py-4 text-lg"
            >
              View Projects
            </Button>
          </motion.div>
        </div>
      </section>

      {/* AI Features Section */}
      <section id="features" className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div {...fadeIn} className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              AI-Powered Development
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Leveraging cutting-edge AI technologies to deliver smarter
              solutions
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            <motion.div {...fadeIn} transition={{ delay: 0.1 }}>
              <Card className="bg-white/5 backdrop-blur-lg border border-white/10 h-full">
                <CardContent className="p-8 text-center">
                  <Brain className="w-12 h-12 text-purple-400 mx-auto mb-4" />
                  <h3 className="text-2xl font-bold mb-4 text-white">
                    AI-Assisted Design
                  </h3>
                  <p className="text-gray-300">
                    Smart UI/UX recommendations and automated design
                    optimization to create intuitive interfaces that delight
                    your users
                  </p>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div {...fadeIn} transition={{ delay: 0.2 }}>
              <Card className="bg-white/5 backdrop-blur-lg border border-white/10 h-full">
                <CardContent className="p-8 text-center">
                  <Cpu className="w-12 h-12 text-purple-400 mx-auto mb-4" />
                  <h3 className="text-2xl font-bold mb-4 text-white">
                    Intelligent Automation
                  </h3>
                  <p className="text-gray-300">
                    Automated testing and code optimization for faster delivery,
                    ensuring your applications are robust and performant
                  </p>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div {...fadeIn} transition={{ delay: 0.3 }}>
              <Card className="bg-white/5 backdrop-blur-lg border border-white/10 h-full">
                <CardContent className="p-8 text-center">
                  <Sparkles className="w-12 h-12 text-purple-400 mx-auto mb-4" />
                  <h3 className="text-2xl font-bold mb-4 text-white">
                    Smart Analytics
                  </h3>
                  <p className="text-gray-300">
                    AI-driven insights and performance optimization that help
                    you understand user behavior and make data-driven decisions
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Why Choose GoCode Section */}
      <section id="about" className="py-20 px-4 sm:px-6 lg:px-8 bg-black/20">
        <div className="max-w-7xl mx-auto">
          <motion.div {...fadeIn} className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-white">
              Why Choose GoCode?
            </h2>
            <p className="text-xl text-gray-300">
              We deliver excellence in every project
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            <motion.div {...fadeIn} transition={{ delay: 0.1 }}>
              <Card className="bg-white/5 backdrop-blur-lg border border-white/10 h-full">
                <CardContent className="p-8">
                  <Code className="w-12 h-12 text-pink-400 mb-4" />
                  <h3 className="text-2xl font-bold mb-4 text-white">
                    Custom Development
                  </h3>
                  <p className="text-gray-300">
                    Tailored solutions that perfectly match your business needs,
                    built with scalability and maintainability in mind
                  </p>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div {...fadeIn} transition={{ delay: 0.2 }}>
              <Card className="bg-white/5 backdrop-blur-lg border border-white/10 h-full">
                <CardContent className="p-8">
                  <Rocket className="w-12 h-12 text-pink-400 mb-4" />
                  <h3 className="text-2xl font-bold mb-4 text-white">
                    Fast Delivery
                  </h3>
                  <p className="text-gray-300">
                    Quick turnaround without compromising on quality, thanks to
                    our efficient development processes and automation
                  </p>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div {...fadeIn} transition={{ delay: 0.3 }}>
              <Card className="bg-white/5 backdrop-blur-lg border border-white/10 h-full">
                <CardContent className="p-8">
                  <Users className="w-12 h-12 text-pink-400 mb-4" />
                  <h3 className="text-2xl font-bold mb-4 text-white">
                    Expert Team
                  </h3>
                  <p className="text-gray-300">
                    Skilled developers with years of experience in cutting-edge
                    technologies who are passionate about delivering exceptional
                    results
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Projects Section */}
      <section id="projects" className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div {...fadeIn} className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              Our Latest Projects
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <motion.div {...fadeIn} transition={{ delay: 0.1 }}>
              <Card className="bg-white/5 backdrop-blur-lg border border-white/10 h-full overflow-hidden group hover:scale-105 transition-transform">
                <div className="aspect-video bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center">
                  <Globe2 className="w-16 h-16 text-white" />
                </div>
                <CardContent className="p-6">
                  <h3 className="text-xl font-bold mb-2 text-white">
                    Anydish App
                  </h3>
                  <p className="text-gray-300 mb-4 text-sm">
                    Personalized endless recipes based on precise macro &
                    micronutrients and user preferences
                  </p>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {["React Native", "TypeScript", "Node.js"].map((tech) => (
                      <span
                        key={tech}
                        className="px-2 py-1 bg-purple-600/30 rounded text-xs text-purple-200"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full border-purple-400 text-purple-300 hover:bg-purple-400/10"
                  >
                    View Details <ExternalLink className="ml-2 w-4 h-4" />
                  </Button>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div {...fadeIn} transition={{ delay: 0.2 }}>
              <Card className="bg-white/5 backdrop-blur-lg border border-white/10 h-full overflow-hidden group hover:scale-105 transition-transform">
                <div className="aspect-video bg-gradient-to-br from-pink-600 to-purple-600 flex items-center justify-center">
                  <Bot className="w-16 h-16 text-white" />
                </div>
                <CardContent className="p-6">
                  <h3 className="text-xl font-bold mb-2 text-white">
                    ImagenAI CRM
                  </h3>
                  <p className="text-gray-300 mb-4 text-sm">
                    AI-powered photo editing solution CRM system for customer
                    success managers
                  </p>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {["Vue.js 3", "TypeScript", "Quasar"].map((tech) => (
                      <span
                        key={tech}
                        className="px-2 py-1 bg-purple-600/30 rounded text-xs text-purple-200"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full border-purple-400 text-purple-300 hover:bg-purple-400/10"
                  >
                    View Details <ExternalLink className="ml-2 w-4 h-4" />
                  </Button>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div {...fadeIn} transition={{ delay: 0.3 }}>
              <Card className="bg-white/5 backdrop-blur-lg border border-white/10 h-full overflow-hidden group hover:scale-105 transition-transform">
                <div className="aspect-video bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center">
                  <Users className="w-16 h-16 text-white" />
                </div>
                <CardContent className="p-6">
                  <h3 className="text-xl font-bold mb-2 text-white">
                    DirotNet
                  </h3>
                  <p className="text-gray-300 mb-4 text-sm">
                    Comprehensive real estate platform with property listings
                    and lead management
                  </p>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {["Nuxt 3", "Vue.js 3", "TypeScript"].map((tech) => (
                      <span
                        key={tech}
                        className="px-2 py-1 bg-purple-600/30 rounded text-xs text-purple-200"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full border-purple-400 text-purple-300 hover:bg-purple-400/10"
                  >
                    View Details <ExternalLink className="ml-2 w-4 h-4" />
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20 px-4 sm:px-6 lg:px-8 bg-black/20">
        <div className="max-w-4xl mx-auto">
          <motion.div {...fadeIn} className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-white">
              Get In Touch
            </h2>
            <p className="text-xl text-gray-300">
              Let's discuss how we can help bring your ideas to life
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-12">
            <motion.div {...fadeIn} transition={{ delay: 0.1 }}>
              <h3 className="text-2xl font-bold mb-6 text-white">
                Contact Information
              </h3>
              <div className="space-y-4">
                <div className="flex items-center">
                  <Phone className="w-5 h-5 text-purple-400 mr-3" />
                  <span className="text-gray-300">+972-50-123-4567</span>
                </div>
                <div className="flex items-center">
                  <Mail className="w-5 h-5 text-purple-400 mr-3" />
                  <span className="text-gray-300">contact@gocode.co.il</span>
                </div>
                <div className="flex items-center">
                  <MessageSquare className="w-5 h-5 text-purple-400 mr-3" />
                  <span className="text-gray-300">Message us on WhatsApp</span>
                </div>
              </div>
            </motion.div>

            <motion.div {...fadeIn} transition={{ delay: 0.2 }}>
              <Card className="bg-white/5 backdrop-blur-lg border border-white/10">
                <CardContent className="p-6">
                  <form onSubmit={handleContact} className="space-y-4">
                    <div>
                      <Input
                        type="email"
                        placeholder="Your Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="bg-white/10 border-white/20 text-white placeholder:text-gray-400"
                      />
                    </div>
                    <div>
                      <Textarea
                        placeholder="How can we help you?"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        required
                        rows={4}
                        className="bg-white/10 border-white/20 text-white placeholder:text-gray-400"
                      />
                    </div>
                    <Button
                      type="submit"
                      disabled={isSending}
                      className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                    >
                      {isSending ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Sending...
                        </>
                      ) : (
                        <>
                          <Send className="w-4 h-4 mr-2" />
                          Send Message
                        </>
                      )}
                    </Button>
                  </form>

                  <AnimatePresence>
                    {sendSuccess && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="mt-4 p-3 bg-green-600/20 border border-green-500/30 rounded flex items-center text-green-300"
                      >
                        <CheckCircle2 className="w-5 h-5 mr-2" />
                        Message sent successfully!
                      </motion.div>
                    )}
                    {sendError && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="mt-4 p-3 bg-red-600/20 border border-red-500/30 rounded flex items-center text-red-300"
                      >
                        <AlertTriangle className="w-5 h-5 mr-2" />
                        Failed to send message. Please try again.
                      </motion.div>
                    )}
                  </AnimatePresence>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 sm:px-6 lg:px-8 border-t border-white/10">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="text-2xl font-bold mb-4 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                GoCode
              </div>
              <p className="text-gray-400">
                Transforming ideas into reality with cutting-edge technology.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4 text-white">Services</h4>
              <ul className="space-y-2 text-gray-400">
                <li>Web Development</li>
                <li>Mobile Apps</li>
                <li>UI/UX Design</li>
                <li>AI Solutions</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4 text-white">Navigation</h4>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <button onClick={() => scrollToSection("about")}>
                    About Us
                  </button>
                </li>
                <li>
                  <button onClick={() => scrollToSection("features")}>
                    Features
                  </button>
                </li>
                <li>
                  <button onClick={() => scrollToSection("projects")}>
                    Projects
                  </button>
                </li>
                <li>
                  <button onClick={() => scrollToSection("contact")}>
                    Contact
                  </button>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4 text-white">Contact</h4>
              <ul className="space-y-2 text-gray-400">
                <li>contact@gocode.co.il</li>
                <li>+972-50-123-4567</li>
              </ul>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-white/10 text-center text-gray-400">
            <p>&copy; 2024 GoCode. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
