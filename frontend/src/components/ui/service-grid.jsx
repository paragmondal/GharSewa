import * as React from "react";
import { motion } from "framer-motion";
import { cn } from "../../lib/utils"; // Adjusted path to lib/utils

const ServiceGrid = React.forwardRef(
  ({ title, subtitle, services, className, ...props }, ref) => {
    // Animation variants for the container to orchestrate children animations
    const containerVariants = {
      hidden: { opacity: 0 },
      visible: {
        opacity: 1,
        transition: {
          staggerChildren: 0.1, // Stagger the animation of children by 0.1s
        },
      },
    };

    // Animation variants for each grid item
    const itemVariants = {
      hidden: { y: 20, opacity: 0 },
      visible: {
        y: 0,
        opacity: 1,
        transition: {
          type: "spring",
          stiffness: 100,
          damping: 10,
        },
      },
    };

    return (
      <section
        ref={ref}
        className={cn("w-full py-12 md:py-16 lg:py-20", className)}
        {...props}
      >
        <div className="container mx-auto px-4 md:px-6">
          {/* Header Section */}
          <div className="flex flex-col items-center justify-center space-y-4 text-center mb-10 md:mb-14 fade-in">
            <div className="space-y-4">
              <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl md:text-5xl text-[var(--c-text)]">
                {title}
              </h2>
              {subtitle && (
                <p className="max-w-[700px] text-[var(--c-text-muted)] md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed mx-auto">
                  {subtitle}
                </p>
              )}
            </div>
          </div>

          {/* Animated Grid Section */}
          <motion.div
            className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6 md:gap-8"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {services.map((service, index) => (
              <motion.a
                key={index}
                href={service.href}
                className="group flex flex-col items-center justify-start gap-4 text-center card glass"
                style={{ padding: '24px 16px', border: '1px solid var(--c-border)', background: 'var(--c-surface)' }}
                variants={itemVariants}
                whileHover={{ scale: 1.05, y: -5, borderColor: 'var(--c-primary)', boxShadow: '0 10px 30px rgba(99, 102, 241, 0.15)' }} // Hover animation
                transition={{ type: "spring", stiffness: 300, damping: 15 }}
              >
                <div className="flex items-center justify-center w-24 h-24 sm:w-28 sm:h-28 overflow-hidden rounded-2xl bg-[var(--c-surface-2)]">
                  <img
                    src={service.imageUrl}
                    alt={`${service.name} service icon`}
                    className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-110"
                  />
                </div>
                <div>
                    <span className="text-base font-bold text-[var(--c-text)] transition-colors duration-300 group-hover:text-[var(--c-primary)] block">
                    {service.name}
                    </span>
                    <span className="text-sm font-semibold text-[var(--c-primary)] mt-1 block">
                    {service.priceTitle}
                    </span>
                </div>
              </motion.a>
            ))}
          </motion.div>
        </div>
      </section>
    );
  }
);

ServiceGrid.displayName = "ServiceGrid";

export { ServiceGrid };
