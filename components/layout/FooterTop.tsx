import { Clock, Mail, MapPin, Phone } from "lucide-react";
import { contactConfig } from "@/config/contact";

interface ContactItemData {
  title: string;
  subtitle: string;
  icon: React.ReactNode;
  href?: string;
  color: string;
}

const data: ContactItemData[] = [
  {
    title: "Visit Us",
    subtitle: `${contactConfig.company.address}, ${contactConfig.company.city}`,
    icon: <MapPin className="h-5 w-5" />,
    href: `https://maps.google.com/?q=${encodeURIComponent(`${contactConfig.company.address}, ${contactConfig.company.city}`)}`,
    color: "bg-blue-500",
  },
  {
    title: "Call Us",
    subtitle: contactConfig.company.phone,
    icon: <Phone className="h-5 w-5" />,
    href: `tel:${contactConfig.company.phone.replace(/\D/g, "")}`,
    color: "bg-emerald-500",
  },
  {
    title: "Working Hours",
    subtitle: contactConfig.businessHours.weekday,
    icon: <Clock className="h-5 w-5" />,
    color: "bg-amber-500",
  },
  {
    title: "Email Us",
    subtitle: contactConfig.emails.support,
    icon: <Mail className="h-5 w-5" />,
    href: `mailto:${contactConfig.emails.support}`,
    color: "bg-purple-500",
  },
];

const FooterTop = () => {
  return (
    <div className="py-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {data.map((item, index) => (
        <ContactItem
          key={index}
          icon={item.icon}
          title={item.title}
          content={item.subtitle}
          href={item.href}
          color={item.color}
        />
      ))}
    </div>
  );
};

interface ContactItemProps {
  icon: React.ReactNode;
  title: string;
  content: string;
  href?: string;
  color: string;
}

const ContactItem = ({ icon, title, content, href, color }: ContactItemProps) => {
  const Component = href ? "a" : "div";
  const props = href
    ? {
      href,
      target: href.startsWith("http") ? "_blank" : "_self",
      rel: href.startsWith("http") ? "noopener noreferrer" : undefined,
    }
    : {};

  return (
    <Component
      {...props}
      className="flex items-center gap-4 group bg-white rounded-2xl p-4 shadow-sm hover:shadow-md transition-all cursor-pointer border border-gray-100"
    >
      <div className={`${color} p-3 rounded-xl text-white flex-shrink-0`}>
        {icon}
      </div>
      <div className="min-w-0">
        <h3 className="font-semibold text-gray-900 text-sm">
          {title}
        </h3>
        <p className="text-gray-500 text-sm mt-0.5 truncate group-hover:text-gray-700 transition-colors">
          {content}
        </p>
      </div>
    </Component>
  );
};

export default FooterTop;
