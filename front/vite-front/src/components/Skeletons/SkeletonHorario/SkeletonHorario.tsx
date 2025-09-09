import { motion } from 'framer-motion';
import './SkeletonHorario.css';

interface SkeletonHorarioProps {
    width?: string;
    height?: string;
}

const SkeletonHorario = ({ width = '98px', height = '36px' }: SkeletonHorarioProps) => {
    return (
        <motion.div className="skeleton-horario" style={{ width, height }} initial={{ opacity: 0.5 }} animate={{ opacity: [0.5, 0.8, 0.5] }} transition={{ duration: 1, repeat: Infinity }} />
    );
};

export default SkeletonHorario;
