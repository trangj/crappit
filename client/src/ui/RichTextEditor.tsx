import React, { useEffect } from 'react';
import { Editor, EditorContent, useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { Placeholder } from '@tiptap/extension-placeholder';
import { Link } from '@tiptap/extension-link';
import { Button } from './Button';

type Props = {
    value: string,
    name: string;
    placeholder: string;
    setFieldValue: (field: string, value: any, shouldValidate?: boolean | undefined) => void;
    isSubmitting: boolean;
};

const ToolBar = ({ editor }: { editor: Editor | null; }) => {
    if (!editor) return null;

    return (
        <div className="flex p-1 dark:bg-gray-800 bg-gray-50">
            <Button
                variant="ghost"
                size="lg"
                border="rounded"
                icon={<i className="fas fa-bold"></i>}
                onClick={() => editor.chain().focus().toggleBold().run()}
                active={editor.isActive('bold')}
            />
            <Button
                variant="ghost"
                size="lg"
                border="rounded"
                icon={<i className="fas fa-italic"></i>}
                onClick={() => editor.chain().focus().toggleItalic().run()}
                active={editor.isActive('italic')}
            />
            <Button
                variant="ghost"
                size="lg"
                border="rounded"
                icon={<i className="fas fa-link"></i>}
                onClick={() => {
                    const url = window.prompt('URL');
                    if (!url) return;
                    editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
                }}
                active={editor.isActive('link')}
            />
            <Button
                variant="ghost"
                size="lg"
                border="rounded"
                icon={<i className="fas fa-strikethrough"></i>}
                onClick={() => editor.chain().focus().toggleStrike().run()}
                active={editor.isActive('strike')}
            />
            <Button
                variant="ghost"
                size="lg"
                border="rounded"
                icon={<i className="fas fa-code"></i>}
                onClick={() => editor.chain().focus().toggleCode().run()}
                active={editor.isActive('code')}
            />
            <div className="border-r border-gray-300 dark:border-gray-700 w-px m-2"></div>
            <Button
                variant="ghost"
                size="lg"
                border="rounded"
                icon={<i className="fas fa-heading"></i>}
                onClick={() => editor.chain().focus().toggleHeading({ level: 5 }).run()}
                active={editor.isActive('heading', { level: 5 })}
            />
            <Button
                variant="ghost"
                size="lg"
                border="rounded"
                icon={<i className="fas fa-list-ul"></i>}
                onClick={() => editor.chain().focus().toggleBulletList().run()}
                active={editor.isActive('bulletList')}
            />
            <Button
                variant="ghost"
                size="lg"
                border="rounded"
                icon={<i className="fas fa-list-ol"></i>}
                onClick={() => editor.chain().focus().toggleOrderedList().run()}
                active={editor.isActive('orderedList')}
            />
        </div>
    );
};

export const RichTextEditor = ({ value, name, placeholder, setFieldValue, isSubmitting }: Props) => {
    const editor = useEditor({
        extensions: [
            StarterKit,
            Placeholder.configure({
                placeholder
            }),
            Link
        ],
        content: value,
        onUpdate: ({ editor }) => {
            setFieldValue(name, editor.getHTML());
        }
    });

    useEffect(() => {
        if (isSubmitting) {
            editor?.commands.clearContent();
        }
    }, [isSubmitting]);

    return (
        <div className="w-full my-2 bg-transparent border rounded dark:border-gray-700 border-gray-300 flex flex-col">
            <ToolBar editor={editor} />
            <EditorContent editor={editor} />
        </div>
    );
};
