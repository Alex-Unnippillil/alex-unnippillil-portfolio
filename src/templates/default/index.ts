import dynamic from 'next/dynamic';

const CommonScripts = dynamic(() => import('../_common/scripts'), { ssr: false });

export default CommonScripts;
