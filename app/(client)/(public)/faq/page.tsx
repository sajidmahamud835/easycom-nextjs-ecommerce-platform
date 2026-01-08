"use client";

import { useState, useEffect } from "react";
import { motion } from "motion/react";
import {
  Search,
  HelpCircle,
  ShoppingBag,
  CreditCard,
  Truck,
  RotateCcw,
  User,
  MessageCircle,
} from "lucide-react";
import Container from "@/components/Container";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import Head from "next/head";

interface FAQ {
  id: string;
  question: string;
  answer: string;
  category: string;
}

const faqs: FAQ[] = [
  // Shopping FAQs
  {
    id: "shopping-1",
    question: "How do I place an order?",
    answer:
      "To place an order, browse our products, add items to your cart, and proceed to checkout. You'll need to create an account or sign in, then provide your shipping information and payment details to complete your purchase.",
    category: "shopping",
  },
  {
    id: "shopping-2",
    question: "Can I modify or cancel my order after placing it?",
    answer:
      "You can modify or cancel your order within 30 minutes of placing it. After this time, if your order hasn&apos;t been processed yet, please contact our customer service team immediately. Once your order is being prepared or shipped, modifications may not be possible.",
    category: "shopping",
  },
  {
    id: "shopping-3",
    question: "How do I track my order?",
    answer:
      "Once your order ships, you'll receive a tracking number via email. You can also track your order by logging into your account and visiting the 'My Orders' section. Real-time tracking information will be available there.",
    category: "shopping",
  },
  {
    id: "shopping-4",
    question: "What if an item I want is out of stock?",
    answer:
      "If an item is out of stock, you can sign up for restock notifications on the product page. We'll email you as soon as the item is available again. You can also check our 'Coming Soon' section for upcoming restocks.",
    category: "shopping",
  },

  // Payment FAQs
  {
    id: "payment-1",
    question: "What payment methods do you accept?",
    answer:
      "We accept all major credit cards (Visa, MasterCard, American Express), PayPal, Apple Pay, Google Pay, and bank transfers. All payments are processed securely through our encrypted payment system.",
    category: "payment",
  },
  {
    id: "payment-2",
    question: "Is my payment information secure?",
    answer:
      "Yes, absolutely. We use industry-standard SSL encryption and are PCI DSS compliant. Your payment information is never stored on our servers and is processed securely through trusted payment gateways like Stripe.",
    category: "payment",
  },
  {
    id: "payment-3",
    question: "When will I be charged for my order?",
    answer:
      "Your payment method will be charged immediately upon placing your order. For pre-orders, you'll be charged when the item ships. If there are any issues with payment processing, we'll contact you within 24 hours.",
    category: "payment",
  },
  {
    id: "payment-4",
    question: "Can I get a refund if I'm not satisfied?",
    answer:
      "Yes, we offer a 30-day money-back guarantee. If you're not completely satisfied with your purchase, you can return it within 30 days for a full refund. The item must be in original condition with all packaging.",
    category: "payment",
  },

  // Shipping FAQs
  {
    id: "shipping-1",
    question: "How much does shipping cost?",
    answer:
      "Shipping costs vary based on your location and the shipping method you choose. Standard shipping is free for orders over $50. Express shipping options are available at checkout with their respective costs displayed.",
    category: "shipping",
  },
  {
    id: "shipping-2",
    question: "How long does delivery take?",
    answer:
      "Standard shipping typically takes 3-7 business days within the continental US. Express shipping takes 1-3 business days. International shipping may take 7-14 business days depending on the destination country.",
    category: "shipping",
  },
  {
    id: "shipping-3",
    question: "Do you ship internationally?",
    answer:
      "Yes, we ship to most countries worldwide. International shipping costs and delivery times vary by destination. Customs duties and taxes may apply and are the responsibility of the recipient.",
    category: "shipping",
  },
  {
    id: "shipping-4",
    question: "What if my package is damaged or lost?",
    answer:
      "If your package arrives damaged or goes missing, please contact us immediately with your order number. We'll work with the shipping carrier to resolve the issue and either replace your items or provide a full refund.",
    category: "shipping",
  },

  // Returns FAQs
  {
    id: "returns-1",
    question: "What is your return policy?",
    answer:
      "We offer a 30-day return policy from the date of delivery. Items must be unused, in original condition, and include all original packaging and accessories. Some items like personalized products may not be returnable.",
    category: "returns",
  },
  {
    id: "returns-2",
    question: "How do I return an item?",
    answer:
      "To return an item, log into your account and request a return from your order history. We'll provide you with a prepaid return label and instructions. Package the item securely and drop it off at any authorized shipping location.",
    category: "returns",
  },
  {
    id: "returns-3",
    question: "When will I receive my refund?",
    answer:
      "Refunds are processed within 2-3 business days after we receive your returned item. The refund will appear on your original payment method within 5-10 business days, depending on your bank or card issuer.",
    category: "returns",
  },
  {
    id: "returns-4",
    question: "Can I exchange an item instead of returning it?",
    answer:
      "Yes, you can exchange items for a different size or color if available. Select the exchange option when initiating your return, and we'll send you the new item as soon as we receive the original.",
    category: "returns",
  },

  // Account FAQs
  {
    id: "account-1",
    question: "How do I create an account?",
    answer:
      "Click 'Sign Up' at the top of any page and provide your email address and create a password. You can also sign up using your Google or Facebook account for faster registration. Account creation is free and gives you access to order tracking, wishlists, and exclusive offers.",
    category: "account",
  },
  {
    id: "account-2",
    question: "I forgot my password. How do I reset it?",
    answer:
      "Click 'Sign In' and then 'Forgot Password'. Enter your email address and we'll send you a password reset link. Follow the instructions in the email to create a new password. If you don't receive the email, check your spam folder.",
    category: "account",
  },
  {
    id: "account-3",
    question: "How do I update my account information?",
    answer:
      "Log into your account and go to 'Account Settings' or 'Profile'. Here you can update your personal information, shipping addresses, payment methods, and communication preferences. Changes are saved automatically.",
    category: "account",
  },
  {
    id: "account-4",
    question: "Can I delete my account?",
    answer:
      "Yes, you can delete your account at any time from your account settings. Please note that this action is permanent and will remove all your order history, wishlists, and saved information. Contact support if you need assistance.",
    category: "account",
  },
];

const categories = [
  { id: "all", label: "All Questions", icon: HelpCircle, count: faqs.length },
  {
    id: "shopping",
    label: "Shopping",
    icon: ShoppingBag,
    count: faqs.filter((faq) => faq.category === "shopping").length,
  },
  {
    id: "payment",
    label: "Payment",
    icon: CreditCard,
    count: faqs.filter((faq) => faq.category === "payment").length,
  },
  {
    id: "shipping",
    label: "Shipping",
    icon: Truck,
    count: faqs.filter((faq) => faq.category === "shipping").length,
  },
  {
    id: "returns",
    label: "Returns",
    icon: RotateCcw,
    count: faqs.filter((faq) => faq.category === "returns").length,
  },
  {
    id: "account",
    label: "Account",
    icon: User,
    count: faqs.filter((faq) => faq.category === "account").length,
  },
];

const FAQPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");

  const filteredFAQs = faqs.filter((faq) => {
    const matchesSearch =
      faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory =
      activeCategory === "all" || faq.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  // Generate FAQ JSON-LD for SEO
  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };

  return (
    <>
      {/* Schema.org FAQ structured data for SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <div className="bg-gradient-to-b from-shop_light_bg to-white min-h-screen">
        {/* Hero Section */}
        <section className="py-16 bg-gradient-to-r from-shop_light_bg to-white text-center">
          <Container className="max-w-6xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center"
            >
              <HelpCircle className="w-16 h-16 mx-auto mb-6 text-shop_light_green opacity-90" />
              <h1 className="text-4xl lg:text-5xl font-bold mb-4 text-shop_dark_green">
                Frequently Asked Questions
              </h1>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-6">
                Find answers to common questions about shopping, payments,
                shipping, and more. Can&apos;t find what you&apos;re looking for?
                Contact our support team.
              </p>
              <Badge className="bg-shop_dark_green/10 text-shop_dark_green border-shop_dark_green/20 hover:bg-shop_dark_green/20">
                Updated Daily
              </Badge>
            </motion.div>
          </Container>
        </section>

        {/* Main Content */}
        <Container className="py-12 max-w-6xl">
          {/* Search Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="max-w-2xl mx-auto mb-12"
          >
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input
                type="text"
                placeholder="Search for answers..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-12 py-4 text-lg border-2 border-gray-200 focus:border-shop_light_green rounded-xl shadow-sm"
              />
            </div>
            {searchTerm && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-sm text-gray-600 mt-2"
              >
                Found {filteredFAQs.length} result
                {filteredFAQs.length !== 1 ? "s" : ""} for &quot;{searchTerm}
                &quot;
              </motion.p>
            )}
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Categories Sidebar */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="lg:col-span-1"
            >
              <Card className="sticky top-8 shadow-lg border-0 bg-white/70 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-shop_dark_green flex items-center gap-2">
                    <HelpCircle className="w-5 h-5" />
                    Categories
                  </CardTitle>
                  <CardDescription>Browse by topic</CardDescription>
                </CardHeader>
                <CardContent className="space-y-2">
                  {categories.map((category) => {
                    const Icon = category.icon;
                    return (
                      <button
                        key={category.id}
                        onClick={() => setActiveCategory(category.id)}
                        className={`w-full flex items-center justify-between p-3 rounded-lg transition-all duration-200 ${activeCategory === category.id
                          ? "bg-shop_light_green text-white shadow-md"
                          : "hover:bg-shop_light_green/10 text-gray-700 hover:text-shop_dark_green"
                          }`}
                      >
                        <div className="flex items-center gap-3">
                          <Icon className="w-4 h-4" />
                          <span className="font-medium">{category.label}</span>
                        </div>
                        <span
                          className={`text-xs px-2 py-1 rounded-full ${activeCategory === category.id
                            ? "bg-white/20"
                            : "bg-gray-200"
                            }`}
                        >
                          {category.count}
                        </span>
                      </button>
                    );
                  })}
                </CardContent>
              </Card>
            </motion.div>

            {/* FAQ Content */}
            <div className="lg:col-span-3">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
              >
                {filteredFAQs.length > 0 ? (
                  <Accordion type="single" collapsible className="space-y-4">
                    {filteredFAQs.map((faq, index) => (
                      <motion.div
                        key={faq.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4, delay: index * 0.05 }}
                      >
                        <AccordionItem
                          value={faq.id}
                          className="bg-white/70 backdrop-blur-sm rounded-xl shadow-sm border border-gray-200 px-6 py-2 hover:shadow-md transition-shadow"
                        >
                          <AccordionTrigger className="text-left text-shop_dark_green font-semibold hover:text-shop_light_green transition-colors">
                            {faq.question}
                          </AccordionTrigger>
                          <AccordionContent className="text-gray-700 leading-relaxed pt-4">
                            {faq.answer}
                          </AccordionContent>
                        </AccordionItem>
                      </motion.div>
                    ))}
                  </Accordion>
                ) : (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-center py-12"
                  >
                    <HelpCircle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-gray-600 mb-2">
                      No results found
                    </h3>
                    <p className="text-gray-500 mb-6">
                      Try adjusting your search terms or browse different
                      categories.
                    </p>
                    <Button
                      onClick={() => {
                        setSearchTerm("");
                        setActiveCategory("all");
                      }}
                      variant="outline"
                      className="border-shop_light_green text-shop_light_green hover:bg-shop_light_green hover:text-white"
                    >
                      Clear Search
                    </Button>
                  </motion.div>
                )}
              </motion.div>
            </div>
          </div>

          {/* Contact Support Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="mt-16"
          >
            <Card className="bg-gradient-to-r from-shop_light_green to-shop_dark_green text-white shadow-xl">
              <CardHeader className="text-center">
                <CardTitle className="text-2xl mb-2 flex items-center justify-center gap-2">
                  <MessageCircle className="w-6 h-6" />
                  Still need help?
                </CardTitle>
                <CardDescription className="text-white/80">
                  Our support team is here to assist you with any questions not
                  covered in our FAQ.
                </CardDescription>
              </CardHeader>
              <CardContent className="text-center pb-8">
                <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                  <Link href="/contact">
                    <Button
                      size="lg"
                      variant="secondary"
                      className="bg-white text-shop_dark_green hover:bg-gray-100"
                    >
                      <MessageCircle className="w-4 h-4 mr-2" />
                      Contact Support
                    </Button>
                  </Link>
                  <Link href="/help">
                    <Button
                      size="lg"
                      variant="outline"
                      className="border-white text-white hover:bg-white/10"
                    >
                      <HelpCircle className="w-4 h-4 mr-2" />
                      Help Center
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </Container>
      </div>
    </>
  );
};

export default FAQPage;
