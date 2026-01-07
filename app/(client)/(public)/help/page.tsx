"use client";

import { useState } from "react";
import { motion } from "motion/react";
import {
  Mail,
  Phone,
  MessageSquare,
  Clock,
  ChevronRight,
  Search,
  ShoppingBag,
  CreditCard,
  Truck,
  RotateCcw,
  Shield,
  BookOpen,
  Video,
} from "lucide-react";
import Link from "next/link";
import Container from "@/components/Container";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";

const HelpPage = () => {
  const [searchTerm, setSearchTerm] = useState("");

  const helpCategories = [
    {
      title: "Getting Started",
      icon: BookOpen,
      description: "Learn the basics of shopping with us",
      color: "from-shop_light_green to-shop_dark_green",
      links: [
        { title: "How to Create an Account", href: "/faq#account-1" },
        { title: "Placing Your First Order", href: "/faq#shopping-1" },
        { title: "Setting Up Payment Methods", href: "/faq#payment-1" },
        { title: "Managing Your Profile", href: "/faq#account-3" },
      ],
    },
    {
      title: "Orders & Shopping",
      icon: ShoppingBag,
      description: "Everything about placing and managing orders",
      color: "from-shop_orange to-shop_light_orange",
      links: [
        { title: "How to Place an Order", href: "/faq#shopping-1" },
        { title: "Modifying Your Order", href: "/faq#shopping-2" },
        { title: "Order Tracking", href: "/faq#shopping-3" },
        { title: "Out of Stock Items", href: "/faq#shopping-4" },
      ],
    },
    {
      title: "Payments & Billing",
      icon: CreditCard,
      description: "Payment methods, billing, and refunds",
      color: "from-light-blue to-dark-blue",
      links: [
        { title: "Accepted Payment Methods", href: "/faq#payment-1" },
        { title: "Payment Security", href: "/faq#payment-2" },
        { title: "When You&apos;ll Be Charged", href: "/faq#payment-3" },
        { title: "Refunds & Returns", href: "/faq#payment-4" },
      ],
    },
    {
      title: "Shipping & Delivery",
      icon: Truck,
      description: "Shipping options, costs, and delivery info",
      color: "from-shop_light_green to-light-green",
      links: [
        { title: "Shipping Costs", href: "/faq#shipping-1" },
        { title: "Delivery Times", href: "/faq#shipping-2" },
        { title: "International Shipping", href: "/faq#shipping-3" },
        { title: "Lost or Damaged Packages", href: "/faq#shipping-4" },
      ],
    },
    {
      title: "Returns & Exchanges",
      icon: RotateCcw,
      description: "Return policy, exchanges, and refunds",
      color: "from-dark-red to-light-orange",
      links: [
        { title: "Return Policy", href: "/faq#returns-1" },
        { title: "How to Return Items", href: "/faq#returns-2" },
        { title: "Refund Timeline", href: "/faq#returns-3" },
        { title: "Exchanges", href: "/faq#returns-4" },
      ],
    },
    {
      title: "Account & Security",
      icon: Shield,
      description: "Account management and security features",
      color: "from-shop_dark_green to-shop_btn_dark_green",
      links: [
        { title: "Account Security", href: "/faq#account-1" },
        { title: "Password Reset", href: "/faq#account-2" },
        { title: "Update Information", href: "/faq#account-3" },
        { title: "Delete Account", href: "/faq#account-4" },
      ],
    },
  ];

  const quickActions = [
    {
      title: "Track Your Order",
      description: "Check the status of your recent purchases",
      icon: Search,
      action: "Track Order",
      href: "/orders",
      color: "bg-shop_light_green",
    },
    {
      title: "Contact Support",
      description: "Get help from our customer service team",
      icon: MessageSquare,
      action: "Contact Us",
      href: "/contact",
      color: "bg-shop_orange",
    },
    {
      title: "Return an Item",
      description: "Start a return or exchange process",
      icon: RotateCcw,
      action: "Start Return",
      href: "/orders",
      color: "bg-dark-blue",
    },
  ];

  const supportChannels = [
    {
      title: "Live Chat",
      description: "Chat with our support team in real-time",
      icon: MessageSquare,
      availability: "24/7 Available",
      response: "Instant response",
      action: "Start Chat",
      color:
        "border-shop_light_green text-shop_light_green hover:bg-shop_light_green",
    },
    {
      title: "Email Support",
      description: "Send us a detailed message about your issue",
      icon: Mail,
      availability: "Always Open",
      response: "Within 2 hours",
      action: "Send Email",
      color: "border-shop_orange text-shop_orange hover:bg-shop_orange",
      href: "/contact",
    },
    {
      title: "Phone Support",
      description: "Speak directly with a support representative",
      icon: Phone,
      availability: "Mon-Fri 9AM-6PM EST",
      response: "Immediate",
      action: "Call Now",
      color: "border-dark-blue text-dark-blue hover:bg-dark-blue",
      phone: "+1 (555) 123-4567",
    },
  ];

  return (
    <div className="bg-gradient-to-b from-shop_light_bg to-white min-h-screen">
      {/* Hero Banner Section */}
      <section className="py-20 bg-gradient-to-r from-shop_light_bg to-white text-center">
        <Container className="max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <Badge className="mb-6 bg-shop_dark_green/10 text-shop_dark_green border-shop_dark_green/20 hover:bg-shop_dark_green/20">
              24/7 Support
            </Badge>
            <h1 className="text-5xl lg:text-6xl font-bold mb-6 text-shop_dark_green">Help Center</h1>
            <p className="text-xl lg:text-2xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Find answers, get support, and resolve issues quickly. We&apos;re
              here to help you have the best shopping experience.
            </p>
          </motion.div>
        </Container>
      </section>

      {/* Main Content */}
      <Container className="py-12 lg:py-16">
        {/* Search Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="max-w-2xl mx-auto mb-16"
        >
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-6 h-6" />
            <Input
              type="text"
              placeholder="Search for help topics, orders, or issues..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-14 py-6 text-lg border-2 border-gray-200 focus:border-shop_light_green rounded-xl shadow-sm"
            />
            <Button
              className="absolute right-2 top-2 bg-shop_light_green hover:bg-shop_dark_green"
              size="lg"
            >
              Search
            </Button>
          </div>
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mb-16"
        >
          <h2 className="text-2xl font-bold text-shop_dark_green mb-8 text-center">
            Quick Actions
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {quickActions.map((action, index) => {
              const Icon = action.icon;
              return (
                <motion.div
                  key={action.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.1 * index }}
                >
                  <Link href={action.href}>
                    <Card className="hover:shadow-lg transition-all duration-300 cursor-pointer border-0 bg-white/70 backdrop-blur-sm">
                      <CardContent className="p-6 text-center">
                        <div
                          className={`inline-flex items-center justify-center w-16 h-16 ${action.color} rounded-full mb-4`}
                        >
                          <Icon className="w-8 h-8 text-white" />
                        </div>
                        <h3 className="text-lg font-semibold text-shop_dark_green mb-2">
                          {action.title}
                        </h3>
                        <p className="text-gray-600 mb-4">
                          {action.description}
                        </p>
                        <Button
                          variant="outline"
                          className="border-shop_light_green text-shop_light_green hover:bg-shop_light_green hover:text-white"
                        >
                          {action.action}
                        </Button>
                      </CardContent>
                    </Card>
                  </Link>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        {/* Help Categories */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mb-16"
        >
          <h2 className="text-2xl font-bold text-shop_dark_green mb-8 text-center">
            Browse Help Topics
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {helpCategories.map((category, index) => {
              const Icon = category.icon;
              return (
                <motion.div
                  key={category.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.05 * index }}
                >
                  <Card className="h-full hover:shadow-lg transition-all duration-300 border-0 bg-white/70 backdrop-blur-sm">
                    <CardHeader>
                      <div
                        className={`inline-flex items-center justify-center w-12 h-12 bg-gradient-to-r ${category.color} rounded-lg mb-3`}
                      >
                        <Icon className="w-6 h-6 text-white" />
                      </div>
                      <CardTitle className="text-shop_dark_green">
                        {category.title}
                      </CardTitle>
                      <CardDescription>{category.description}</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      {category.links.map((link, linkIndex) => (
                        <Link
                          key={linkIndex}
                          href={link.href}
                          className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-100 transition-colors group"
                        >
                          <span className="text-sm text-gray-700 group-hover:text-shop_dark_green">
                            {link.title}
                          </span>
                          <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-shop_light_green" />
                        </Link>
                      ))}
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        {/* Support Channels */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="mb-16"
        >
          <h2 className="text-2xl font-bold text-shop_dark_green mb-8 text-center">
            Get Personal Support
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {supportChannels.map((channel, index) => {
              const Icon = channel.icon;
              return (
                <motion.div
                  key={channel.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.1 * index }}
                >
                  <Card className="h-full text-center hover:shadow-lg transition-all duration-300 border-0 bg-white/70 backdrop-blur-sm">
                    <CardHeader>
                      <div className="inline-flex items-center justify-center w-14 h-14 bg-gray-100 rounded-full mb-4 mx-auto">
                        <Icon className="w-7 h-7 text-gray-600" />
                      </div>
                      <CardTitle className="text-shop_dark_green">
                        {channel.title}
                      </CardTitle>
                      <CardDescription className="mb-4">
                        {channel.description}
                      </CardDescription>
                      <div className="space-y-1">
                        <div className="text-sm text-gray-600">
                          <Clock className="w-4 h-4 inline mr-1" />
                          {channel.availability}
                        </div>
                        <div className="text-sm text-gray-600">
                          Response: {channel.response}
                        </div>
                      </div>
                    </CardHeader>
                    <CardFooter>
                      <Link
                        href={channel.href || "/contact"}
                        className="w-full"
                      >
                        <Button
                          variant="outline"
                          className={`w-full ${channel.color} hover:text-white transition-all duration-200`}
                        >
                          {channel.action}
                        </Button>
                      </Link>
                    </CardFooter>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        {/* Additional Resources */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          <Card className="bg-gradient-to-r from-shop_light_green to-shop_dark_green text-white shadow-xl">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl mb-2">Need More Help?</CardTitle>
              <CardDescription className="text-white/80">
                Explore our comprehensive resources and documentation
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center pb-8">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6">
                <Link href="/faq">
                  <Button
                    variant="secondary"
                    className="w-full bg-white text-shop_dark_green hover:bg-gray-100"
                  >
                    <BookOpen className="w-4 h-4 mr-2" />
                    View FAQ
                  </Button>
                </Link>
                <Link href="/contact">
                  <Button
                    variant="outline"
                    className="w-full border-white text-white hover:bg-white/10"
                  >
                    <Mail className="w-4 h-4 mr-2" />
                    Contact Us
                  </Button>
                </Link>
                <Button
                  variant="outline"
                  className="w-full border-white text-white hover:bg-white/10"
                >
                  <Video className="w-4 h-4 mr-2" />
                  Video Guides
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </Container>
    </div>
  );
};
export default HelpPage;
