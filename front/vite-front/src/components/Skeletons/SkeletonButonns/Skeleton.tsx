import { motion } from 'framer-motion';
import './Skeleton.css';

interface SkeletonProps {
    width?: string;
    height?: string;
    borderRadius?: string;
    variants?: any; // opcional, si quieres pasar itemVariants
}

const Skeleton = ({ width = '100%', height = '30px', borderRadius = '10px', variants }: SkeletonProps) => {
    return <motion.div className="skeleton" style={{ width, height, borderRadius }} variants={variants} initial="hidden" animate="visible" exit="exit" />;
};

export default Skeleton;
