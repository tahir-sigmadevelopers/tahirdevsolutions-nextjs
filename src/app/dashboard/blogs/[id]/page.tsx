import { RootState } from '@/lib/redux/store';
import { motion } from 'framer-motion';
import { useSelector } from 'react-redux';

const EditBlogPage = ({ params }: { params: { id: string } }) => {

      const { darkMode } = useSelector((state: RootState) => state.theme);

  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <div className={`min-h-screen ${darkMode ? 'bg-gray-900' : 'bg-gray-50'} pt-20`}>
      </div>
    </motion.div>
  );
};

export default EditBlogPage;