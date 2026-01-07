"use client";
import { Badge } from "@/components/ui/badge";
import Container from "@/components/Container";
import { contactConfig } from "@/config/contact";
import {
  Mail,
  MapPin,
  Phone,
  Clock,
  MessageCircle,
  ExternalLink,
} from "lucide-react";
import { motion } from "motion/react";
import TicketForm from "@/components/TicketForm";

const ContactPage = () => {

  const contactInfo = [
    {
      icon: MapPin,
      title: "Visit Our Store",
      details: contactConfig.company.address,
      subDetails: contactConfig.company.city,
      color: "text-shop_dark_green",
      bgColor: "bg-shop_dark_green/10",
      href: `https://maps.google.com/?q=${encodeURIComponent(`${contactConfig.company.address}, ${contactConfig.company.city}`)}`,
    },
    {
      icon: Phone,
      title: "Call Us",
      details: contactConfig.company.phone,
      subDetails: contactConfig.businessHours.weekday,
      color: "text-shop_light_green",
      bgColor: "bg-shop_light_green/10",
      href: `tel:${contactConfig.company.phone.replace(/\D/g, "")}`,
    },
    {
      icon: Mail,
      title: "Email Support",
      details: contactConfig.emails.support,
      subDetails: contactConfig.responseTime.standard,
      color: "text-shop_orange",
      bgColor: "bg-shop_orange/10",
      href: `mailto:${contactConfig.emails.support}`,
    },
    {
      icon: Clock,
      title: "Business Hours",
      details: contactConfig.businessHours.weekday,
      subDetails: contactConfig.businessHours.weekend,
      color: "text-purple-600",
      bgColor: "bg-purple-600/10",
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
              We&apos;re Here to Help
            </Badge>
            <h1 className="text-5xl lg:text-6xl font-bold mb-6 text-shop_dark_green">Contact Us</h1>
            <p className="text-xl lg:text-2xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Have questions about our products or need assistance? We&apos;d
              love to hear from you. Our team is here to help with any inquiries
              you may have.
            </p>
          </motion.div>
        </Container>
      </section>

      <Container className="px-4 sm:px-6 lg:px-8 py-6 lg:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
          {/* Contact Information */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="lg:col-span-1"
          >
            <div className="bg-white rounded-2xl shadow-lg p-6 lg:p-8 border border-gray-100">
              <h2 className="text-2xl font-bold text-shop_dark_green mb-6">
                Contact Information
              </h2>

              <div className="space-y-6">
                {contactInfo.map((info, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.1 * index }}
                    className="flex items-start gap-4"
                  >
                    <div className={`p-3 rounded-lg ${info.bgColor}`}>
                      <info.icon className={`w-5 h-5 ${info.color}`} />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-shop_dark_green mb-1">
                        {info.title}
                      </h3>
                      {info.href ? (
                        <a
                          href={info.href}
                          className="text-dark-text text-sm mb-1 hover:text-shop_dark_green transition-colors duration-200 flex items-center gap-1 group"
                          target={
                            info.href.startsWith("http") ? "_blank" : "_self"
                          }
                          rel={
                            info.href.startsWith("http")
                              ? "noopener noreferrer"
                              : undefined
                          }
                        >
                          {info.details}
                          {info.href.startsWith("http") && (
                            <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                          )}
                        </a>
                      ) : (
                        <p className="text-dark-text text-sm mb-1">
                          {info.details}
                        </p>
                      )}
                      <p className="text-light-text text-xs">
                        {info.subDetails}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Additional Info */}
              <div className="mt-8 p-4 bg-shop_light_pink rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <MessageCircle className="w-4 h-4 text-shop_dark_green" />
                  <h4 className="font-semibold text-shop_dark_green">
                    Quick Response
                  </h4>
                </div>
                <p className="text-sm text-dark-text">
                  {contactConfig.responseTime.quick}
                </p>
              </div>
            </div>
          </motion.div>

          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="lg:col-span-2"
          >
            <TicketForm />
          </motion.div>
        </div>

        {/* FAQ Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="mt-16"
        >
          <div className="text-center mb-8">
            <h2 className="text-2xl lg:text-3xl font-bold text-shop_dark_green mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-dark-text max-w-xl mx-auto">
              Find quick answers to common questions about our services and
              policies.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              {
                q: "What are your shipping policies?",
                a: "We offer free shipping on orders over $50 within the continental US. International shipping is available with additional charges.",
              },
              {
                q: "How can I track my order?",
                a: "Once your order ships, you'll receive a tracking number via email. You can also track orders in your account dashboard.",
              },
              {
                q: "What is your return policy?",
                a: "We accept returns within 30 days of purchase. Items must be unused and in original packaging for a full refund.",
              },
              {
                q: "Do you offer customer support?",
                a: "Yes! Our customer service team is available Monday-Friday 9AM-6PM EST via phone, email, or live chat.",
              },
            ].map((faq, index) => (
              <div
                key={index}
                className="bg-white p-6 rounded-lg shadow-sm border border-gray-100"
              >
                <h3 className="font-semibold text-shop_dark_green mb-2">
                  {faq.q}
                </h3>
                <p className="text-dark-text text-sm">{faq.a}</p>
              </div>
            ))}
          </div>
        </motion.div>
      </Container>


    </div>
  );
};

export default ContactPage;
