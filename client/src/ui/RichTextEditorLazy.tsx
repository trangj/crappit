import dynamic from 'next/dynamic';
import RichTextEditorSkeleton from 'src/components/util/RichTextEditorSkeleton';

const RichTextEditor = dynamic(() => import('src/ui/RichTextEditor'), { loading: () => <RichTextEditorSkeleton />, ssr: false });

export default RichTextEditor;
