// Animaciones para listas y sus ítems
export const listVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { staggerChildren: 0.1 },
    },
    exit: { opacity: 0, y: -20 },
};

export const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 },
    isabled: {
        opacity: 0.5,
        y: 0,
        scale: 1,
        // transition: { duration: 0 },
    },
};
