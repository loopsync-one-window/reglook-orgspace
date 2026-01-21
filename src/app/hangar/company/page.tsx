"use client";

import { Building2, Users, Target, Award, Globe, TrendingUp, Sparkles, Heart, Shield } from "lucide-react";
import { Card } from "@/components/ui/card";

export default function CompanyPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 py-24 md:py-32 lg:py-40">
          <div className="text-center space-y-8">
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-semibold tracking-tight text-black">
              Intellaris Private Limited
            </h1>
            <p className="text-xl md:text-2xl lg:text-3xl text-gray-600 max-w-4xl mx-auto font-light">
              Building tomorrow's solutions with innovation, integrity, and excellence.
            </p>
          </div>
        </div>
        
        {/* Subtle gradient background */}
        <div className="absolute inset-0 -z-10 bg-gradient-to-b from-gray-50 to-white" />
      </section>

      {/* Mission Statement */}
      <section className="py-20 md:py-32 bg-gray-50">
        <div className="max-w-5xl mx-auto px-6">
          <div className="text-center space-y-6">
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-semibold tracking-tight text-black">
              Our Mission
            </h2>
            <p className="text-xl md:text-2xl text-gray-600 leading-relaxed font-light">
              To empower organizations through cutting-edge technology and strategic innovation, 
              creating lasting value for our clients and communities.
            </p>
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section className="py-20 md:py-32">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16 md:mb-24">
            <h2 className="text-4xl md:text-5xl font-semibold tracking-tight text-black">
              Our Values
            </h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
            {[
              {
                icon: Sparkles,
                title: "Innovation",
                description: "Pushing boundaries and embracing new ideas to deliver exceptional results."
              },
              {
                icon: Heart,
                title: "Integrity",
                description: "Building trust through transparency, honesty, and ethical practices."
              },
              {
                icon: Shield,
                title: "Excellence",
                description: "Committed to the highest standards in everything we do."
              }
            ].map((value, index) => (
              <div key={index} className="text-center space-y-6 group">
                <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gray-100 group-hover:bg-black transition-colors duration-300">
                  <value.icon className="w-10 h-10 text-black group-hover:text-white transition-colors duration-300" />
                </div>
                <h3 className="text-2xl font-semibold text-black">{value.title}</h3>
                <p className="text-lg text-gray-600 font-light leading-relaxed">
                  {value.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Company Stats */}
      <section className="py-20 md:py-32 bg-black text-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-12 md:gap-16">
            {[
              { icon: Building2, value: "2026", label: "Established" },
              { icon: Users, value: "50+", label: "Team Members" },
              { icon: Globe, value: "10+", label: "Countries" },
              { icon: TrendingUp, value: "100+", label: "Projects" }
            ].map((stat, index) => (
              <div key={index} className="text-center space-y-4">
                <stat.icon className="w-10 h-10 mx-auto text-gray-400" />
                <div className="text-4xl md:text-5xl font-semibold">{stat.value}</div>
                <div className="text-sm md:text-base text-gray-400 font-light">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* What We Do */}
      <section className="py-20 md:py-32">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16 md:mb-24">
            <h2 className="text-4xl md:text-5xl font-semibold tracking-tight text-black">
              What We Do
            </h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
            {[
              {
                title: "Digital Transformation",
                description: "Helping businesses modernize their operations with cutting-edge technology solutions.",
                gradient: "from-blue-50 to-indigo-50"
              },
              {
                title: "Strategic Consulting",
                description: "Providing expert guidance to navigate complex business challenges and opportunities.",
                gradient: "from-purple-50 to-pink-50"
              },
              {
                title: "Technology Solutions",
                description: "Developing custom software and platforms tailored to your unique needs.",
                gradient: "from-green-50 to-emerald-50"
              },
              {
                title: "Innovation Labs",
                description: "Researching and prototyping next-generation solutions for tomorrow's challenges.",
                gradient: "from-orange-50 to-red-50"
              }
            ].map((service, index) => (
              <Card 
                key={index} 
                className={`p-8 md:p-12 border-0 bg-gradient-to-br ${service.gradient} hover:shadow-xl transition-all duration-300 group cursor-pointer`}
              >
                <h3 className="text-2xl md:text-3xl font-semibold text-black mb-4 group-hover:text-gray-700 transition-colors">
                  {service.title}
                </h3>
                <p className="text-lg text-gray-600 font-light leading-relaxed">
                  {service.description}
                </p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Leadership Philosophy */}
      <section className="py-20 md:py-32 bg-gray-50">
        <div className="max-w-5xl mx-auto px-6">
          <div className="text-center space-y-8">
            <Target className="w-16 h-16 mx-auto text-black" />
            <h2 className="text-4xl md:text-5xl font-semibold tracking-tight text-black">
              Our Approach
            </h2>
            <p className="text-xl md:text-2xl text-gray-600 leading-relaxed font-light">
              We believe in the power of collaboration, continuous learning, and sustainable growth. 
              Our team-first culture ensures that every voice is heard and every idea has the potential 
              to make a difference.
            </p>
          </div>
        </div>
      </section>

      {/* Recognition */}
      <section className="py-20 md:py-32">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center space-y-12">
            <div className="space-y-6">
              <Award className="w-16 h-16 mx-auto text-black" />
              <h2 className="text-4xl md:text-5xl font-semibold tracking-tight text-black">
                Recognition & Awards
              </h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              {[
                "Industry Innovation Award 2023",
                "Best Workplace Culture 2023",
                "Sustainability Leader 2024"
              ].map((award, index) => (
                <div 
                  key={index} 
                  className="py-8 px-6 border border-gray-200 rounded-2xl hover:border-black transition-colors duration-300"
                >
                  <p className="text-lg font-medium text-black">{award}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Footer CTA */}
      <section className="py-20 md:py-32 bg-black text-white">
        <div className="max-w-4xl mx-auto px-6 text-center space-y-8">
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-semibold tracking-tight">
            Join us on our journey
          </h2>
          <p className="text-xl md:text-2xl text-gray-400 font-light">
            Together, we're building a better future.
          </p>
        </div>
      </section>
    </div>
  );
}
