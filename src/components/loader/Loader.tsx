'use client';

import styles from './loader.module.css';

interface LoaderConfig {
    color?: string;
    size?: number;
    thickness?: number;
}

const Loader: React.FC<LoaderConfig> = ({
    color='#1e1e20',
    size=24,
    thickness=2
}) => {
  return (
    <span 
        className={styles.loader}
        style={{
            borderColor: color,
            width: `${size}px`,
            height: `${size}px`,
            borderWidth: `${thickness}px`,
        }}
    />
  )
}

export default Loader