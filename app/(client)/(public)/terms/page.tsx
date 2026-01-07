"use client";

import { motion } from "motion/react";
import {
  FileText,
  ShoppingCart,
  Shield,
  CreditCard,
  Truck,
  AlertCircle,
  CheckCircle2,
  Calendar,
  Mail,
  Scale,
} from "lucide-react";
import Container from "@/components/Container";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import Link from "next/link";

const TermsPage = () => {
  const quickLinks = [
    { icon: ShoppingCart, title: "Orders & Purchases", href: "#orders" },
    { icon: CreditCard, title: "Payment Terms", href: "#payment" },
    { icon: Truck, title: "Shipping & Returns", href: "#shipping" },
    { icon: Shield, title: "Privacy & Data", href: "#privacy" },
    { icon: Scale, title: "Legal & Disputes", href: "#legal" },
  ];

  const termsData = [
    {
      id: "acceptance",
      title: "Acceptance of Terms",
      icon: CheckCircle2,
      content: [
        "By accessing and using EasyCom's website and services, you acknowledge that you have read, understood, and agree to be bound by these Terms of Service.",
        "These terms constitute a legally binding agreement between you and EasyCom. If you do not agree with any part of these terms, you must not use our services.",
        "We may update these terms from time to time. Continued use of our services after changes indicates your acceptance of the modified terms.",
        "These terms apply to all users, including browsers, vendors, customers, merchants, and contributors of content.",
      ],
    },
    {
      id: "orders",
      title: "Orders & Purchases",
      icon: ShoppingCart,
      content: [
        "All orders are subject to availability and confirmation. We reserve the right to refuse or cancel any order at our discretion.",
        "Prices are subject to change without notice. The price charged will be the price displayed at the time of purchase.",
        "We strive to display accurate product information, but we do not warrant that product descriptions or pricing is error-free.",
        "By placing an order, you warrant that you are at least 18 years old and legally capable of entering into binding contracts.",
      ],
    },
    {
      id: "payment",
      title: "Payment Terms",
      icon: CreditCard,
      content: [
        "We accept major credit cards, debit cards, PayPal, and other payment methods as displayed at checkout.",
        "All payments must be received before order processing and shipment. Payment authorization may be obtained prior to shipping.",
        "You are responsible for all charges incurred on your account, including applicable taxes and shipping fees.",
        "In case of payment disputes, we will work with you and payment processors to resolve issues fairly and promptly.",
      ],
    },
    {
      id: "shipping",
      title: "Shipping & Returns",
      icon: Truck,
      content: [
        "We offer various shipping options with different delivery timeframes. Shipping costs and times vary by location and service selected.",
        "Risk of loss and title for items pass to you upon delivery to the shipping carrier. We are not responsible for lost or damaged packages once shipped.",
        "Returns are accepted within 30 days of purchase for unused items in original packaging. Customer is responsible for return shipping costs unless the item was defective.",
        "Refunds will be processed within 5-10 business days after we receive and inspect returned items.",
      ],
    },
    {
      id: "privacy",
      title: "Privacy & Data Protection",
      icon: Shield,
      content: [
        "Your privacy is important to us. Please review our Privacy Policy to understand how we collect, use, and protect your personal information.",
        "We implement industry-standard security measures to protect your data, but cannot guarantee absolute security of information transmitted over the internet.",
        "You have the right to access, update, or delete your personal information. Contact our support team for assistance with data requests.",
        "We may use cookies and similar technologies to improve your shopping experience and analyze website usage patterns.",
      ],
    },
    {
      id: "conduct",
      title: "User Conduct & Responsibilities",
      icon: AlertCircle,
      content: [
        "You agree to use our services only for lawful purposes and in accordance with these terms and applicable laws.",
        "You must not attempt to interfere with, disrupt, or gain unauthorized access to our systems or networks.",
        "Providing false information during registration or checkout is prohibited and may result in account suspension or termination.",
        "You are responsible for maintaining the confidentiality of your account credentials and for all activities under your account.",
      ],
    },
    {
      id: "intellectual",
      title: "Intellectual Property Rights",
      icon: FileText,
      content: [
        "All content, trademarks, logos, and intellectual property on our website are owned by EasyCom or our licensors and are protected by copyright and trademark laws.",
        "You may not reproduce, distribute, modify, or create derivative works from our content without explicit written permission.",
        "Product images, descriptions, and reviews are provided for informational purposes and may be subject to third-party intellectual property rights.",
        "If you believe your intellectual property rights have been infringed, please contact us with detailed information about the alleged infringement.",
      ],
    },
    {
      id: "legal",
      title: "Legal & Liability",
      icon: Scale,
      content: [
        "These terms are governed by and construed in accordance with applicable laws. Any disputes will be resolved through binding arbitration where permitted by law.",
        "Our liability is limited to the maximum extent permitted by law. We are not liable for indirect, consequential, or punitive damages.",
        "In no event shall our total liability exceed the amount you paid for the specific product or service that is the subject of the claim.",
        "We disclaim all warranties except as expressly stated in these terms or as required by law.",
      ],
    },
  ];

  return (
    <div className="bg-gradient-to-b from-shop_light_bg to-white min-h-screen">
      {/* Hero Section */}
      <section className="py-16 bg-gradient-to-r from-shop_light_bg to-white text-center">
        <Container className="max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <FileText className="w-16 h-16 mx-auto mb-6 text-shop_light_green opacity-90" />
            <h1 className="text-4xl lg:text-5xl font-bold mb-4 text-shop_dark_green">
              Terms of Service
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Please read these terms carefully before using our services. They
              outline your rights and responsibilities as an EasyCom user.
            </p>
            <Badge className="mt-6 bg-shop_dark_green/10 text-shop_dark_green border-shop_dark_green/20">
              Last updated: January 2024
            </Badge>
          </motion.div>
        </Container>
      </section>

      {/* Quick Navigation */}
      <section className="py-12 -mt-8">
        <Container className="max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="bg-white shadow-lg">
              <CardHeader>
                <CardTitle className="text-center text-shop_dark_green">
                  Quick Navigation
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
                  {quickLinks.map((link, index) => (
                    <motion.a
                      key={index}
                      href={link.href}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 * index }}
                      className="flex flex-col items-center p-4 rounded-lg hover:bg-shop_light_green/5 transition-colors group"
                    >
                      <link.icon className="w-8 h-8 text-shop_light_green mb-2 group-hover:scale-110 transition-transform" />
                      <span className="text-sm font-medium text-center text-dark-text group-hover:text-shop_dark_green">
                        {link.title}
                      </span>
                    </motion.a>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </Container>
      </section>

      {/* Main Content */}
      <section className="py-12">
        <Container className="max-w-4xl">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="space-y-8"
          >
            <Accordion type="single" collapsible className="space-y-4">
              {termsData.map((section, index) => (
                <motion.div
                  key={section.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 * index }}
                >
                  <AccordionItem value={section.id} id={section.id}>
                    <Card className="overflow-hidden">
                      <AccordionTrigger className="px-6 py-4 hover:no-underline hover:bg-shop_light_bg/50 transition-colors">
                        <div className="flex items-center gap-4 text-left">
                          <div className="p-2 bg-shop_light_green/10 rounded-lg">
                            <section.icon className="w-5 h-5 text-shop_dark_green" />
                          </div>
                          <div>
                            <h3 className="text-xl font-semibold text-shop_dark_green">
                              {index + 1}. {section.title}
                            </h3>
                          </div>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent className="px-6 pb-6">
                        <Separator className="mb-4" />
                        <div className="space-y-4">
                          {section.content.map((paragraph, pIndex) => (
                            <p
                              key={pIndex}
                              className="text-dark-text leading-relaxed"
                            >
                              {paragraph}
                            </p>
                          ))}
                        </div>
                      </AccordionContent>
                    </Card>
                  </AccordionItem>
                </motion.div>
              ))}
            </Accordion>
          </motion.div>
        </Container>
      </section>

      {/* Contact Section */}
      <section className="py-16 bg-shop_light_bg">
        <Container className="max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <Card className="text-center">
              <CardContent className="p-8">
                <Mail className="w-12 h-12 mx-auto mb-4 text-shop_light_green" />
                <h3 className="text-2xl font-bold text-shop_dark_green mb-4">
                  Questions About Our Terms?
                </h3>
                <p className="text-dark-text mb-6 max-w-2xl mx-auto">
                  If you have any questions about these Terms of Service or need
                  clarification on any section, our legal team is here to help.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button
                    asChild
                    className="bg-shop_dark_green hover:bg-shop_btn_dark_green"
                  >
                    <Link href="/contact">Contact Legal Team</Link>
                  </Button>
                  <Button
                    asChild
                    variant="outline"
                    className="border-shop_light_green text-shop_light_green hover:bg-shop_light_green/5"
                  >
                    <Link href="/faq">View FAQ</Link>
                  </Button>
                </div>
                <p className="text-sm text-light-text mt-6">
                  For immediate assistance, email us at{" "}
                  <a
                    href="mailto:legal@easycom.com"
                    className="text-shop_light_green hover:underline"
                  >
                    legal@easycom.com
                  </a>
                </p>
              </CardContent>
            </Card>
          </motion.div>
        </Container>
      </section>

      {/* Footer Note */}
      <section className="py-8 border-t border-gray-200">
        <Container className="max-w-4xl">
          <div className="text-center">
            <div className="flex items-center justify-center gap-2 mb-4">
              <Calendar className="w-4 h-4 text-shop_light_green" />
              <p className="text-sm text-light-text">
                These terms were last updated on January 15, 2024
              </p>
            </div>
            <p className="text-xs text-light-text">
              By continuing to use EasyCom, you agree to the most current
              version of these terms.
            </p>
          </div>
        </Container>
      </section>
    </div>
  );
};

export default TermsPage;
