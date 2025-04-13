import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { getPartners } from '@/api/home-show/view';
import { SERVER_URL } from '@/api/server_url';
import { useTheme } from '@/context/ThemeContext';
import { motion } from 'framer-motion';

// Type definition
export interface Partner {
    _id: string;
    image: string;
    name: string;
    createdAt: string;
}

// Main component
const PartnerShowcase: React.FC = () => {
    // State declarations
    const { isDarkMode } = useTheme();
    const [partners, setPartners] = useState<Partner[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    // Data fetching effect
    useEffect(() => {
        const fetchPartners = async () => {
            try {
                setLoading(true);
                const response = await getPartners();
                if (response.success) {
                    setPartners(response.data);
                } else {
                    setError('Unable to load partner data');
                }
            } catch (err) {
                setError('An error occurred while loading partner data');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchPartners();
    }, []);

    // Helper function for image URL handling
    const getImageUrl = (imagePath: string): string => {
        if (imagePath.startsWith('http')) {
            return imagePath;
        }
        const decodedPath = decodeURIComponent(imagePath);
        return `${SERVER_URL}/${decodedPath.replace(/^\//, '')}`;
    };

    // Loading state component
    if (loading) {
        return (
            <div className={`flex justify-center items-center h-64 ${isDarkMode ? 'bg-gray-800' : 'bg-gray-50'}`}>
                <div className={`animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 ${isDarkMode ? 'border-blue-400' : 'border-blue-600'}`}></div>
            </div>
        );
    }

    // Error state component
    if (error) {
        return <div className={`text-red-500 text-center py-10 ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>{error}</div>;
    }

    // Main render
    return (
        <div className={`py-16 px-4 transition-colors duration-300 ${isDarkMode ? 'text-gray-100' : 'text-gray-800'}`}>
            <div className="container mx-auto px-4 md:px-10">
                {/* Section title */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-12"
                >
                    <h2 className={`text-3xl md:text-4xl font-bold py-2 mb-3 ${isDarkMode ? 'text-gradient-dark' : 'text-gradient-light'}`}>
                        OUR PARTNERS
                    </h2>
                </motion.div>

                {/* Partners grid */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.8 }}
                    className="flex flex-wrap justify-center max-w-3xl mx-auto"
                >
                    {partners.map((partner) => (
                        <motion.div
                            key={partner._id}
                            whileHover={{ y: -5, transition: { duration: 0.3 } }}
                            className="p-2 w-1/3"
                        >
                            <div className="relative h-24 w-full rounded-lg flex items-center justify-center p-4 shadow-md hover:shadow-lg transition-all duration-300">
                                <Image
                                    src={getImageUrl(partner.image)}
                                    alt={partner.name}
                                    width={160}
                                    height={80}
                                    style={{ objectFit: 'fill' }}
                                    className="opacity-80 hover:opacity-100 transition-opacity duration-300"
                                    title={partner.name}
                                />
                            </div>
                        </motion.div>
                    ))}
                </motion.div>

                {/* CSS styles */}
                <style jsx global>{`
          .text-gradient-dark {
            background: linear-gradient(to right, #60a5fa, #a78bfa);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
          }
          
          .text-gradient-light {
            background: linear-gradient(to right, #2563eb, #7c3aed);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
          }

          @media (max-width: 640px) {
            .flex-wrap {
              gap: 0.5rem;
            }
          }
        `}</style>
            </div>
        </div>
    );
};

export default PartnerShowcase;