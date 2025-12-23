"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import { useEffect, useImperativeHandle, forwardRef, useRef } from "react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import Underline from "@tiptap/extension-underline";
import Highlight from "@tiptap/extension-highlight";
import TextAlign from "@tiptap/extension-text-align";
import TaskList from "@tiptap/extension-task-list";
import TaskItem from "@tiptap/extension-task-item";
import { Color } from "@tiptap/extension-color";
import { TextStyle } from "@tiptap/extension-text-style";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
    Bold,
    Italic,
    Strikethrough,
    Code,
    List,
    ListOrdered,
    Quote,
    Undo,
    Redo,
    Minus,
    UnderlineIcon,
    Highlighter,
    AlignLeft,
    AlignCenter,
    AlignRight,
    CheckSquare,
} from "lucide-react";

interface TiptapEditorProps {
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    className?: string;
    editable?: boolean;
}

export interface TiptapEditorRef {
    insertContent: (content: string) => void;
    clearContent: () => void;
    getHTML: () => string;
}

export const TiptapEditor = forwardRef<TiptapEditorRef, TiptapEditorProps>(
    function TiptapEditor(
        {
            value,
            onChange,
            placeholder = "Start writing...",
            className,
            editable = true,
        },
        ref
    ) {
        const lastEmittedHtmlRef = useRef<string>(value);

        const editor = useEditor({
            extensions: [
                StarterKit.configure({
                    heading: false,
                }),
                Underline,
                TextStyle,
                Color,
                Highlight.configure({
                    multicolor: true,
                }),
                TextAlign.configure({
                    types: ['paragraph'],
                }),
                TaskList,
                TaskItem.configure({
                    nested: true,
                }),
                Placeholder.configure({
                    placeholder,
                }),
            ],
            content: value,
            editable,
            immediatelyRender: false,
            onUpdate: ({ editor }) => {
                const html = editor.getHTML();
                lastEmittedHtmlRef.current = html;
                onChange(html);
            },
            editorProps: {
                attributes: {
                    class: "flex-1 h-full outline-none px-4 py-3",
                },
            },
        });

        useEffect(() => {
            if (!editor) return;

            if (value === "") {
                if (editor.getHTML() !== "") {
                    editor.commands.setContent("", { emitUpdate: false });
                }
                return;
            }

            if (value !== lastEmittedHtmlRef.current && value !== editor.getHTML()) {
                editor.commands.setContent(value, { emitUpdate: false });
            }
        }, [value, editor]);

        useImperativeHandle(ref, () => ({
            insertContent: (content: string) => {
                if (editor) {
                    const htmlContent = content.replace(/\n/g, '<br/>');
                    const currentContent = editor.getHTML();
                    if (currentContent === '<p></p>' || !currentContent) {
                        editor.commands.setContent(htmlContent);
                    } else {
                        editor.commands.insertContent('<br/><br/>' + htmlContent);
                    }
                    editor.commands.focus('end');
                }
            },
            clearContent: () => {
                if (editor) {
                    editor.commands.setContent('');
                    editor.commands.focus();
                }
            },
            getHTML: () => {
                return editor?.getHTML() || '';
            },
        }));

        if (!editor) {
            return null;
        }

    return (
        <div className="w-full h-full flex flex-col overflow-hidden bg-background outline-none focus:outline-none focus-visible:outline-none">
            <div className="border-b border-border bg-muted/30 p-2 flex flex-wrap gap-1">
                <Button
                    type="button"
                    variant="ghost"
                    size="icon-sm"
                    onClick={() => editor.chain().focus().toggleBold().run()}
                    className={cn(
                        "h-8 w-8",
                        editor.isActive("bold") && "bg-accent"
                    )}
                    title="Bold (Ctrl+B)"
                >
                    <Bold className="h-4 w-4" />
                </Button>

                <Button
                    type="button"
                    variant="ghost"
                    size="icon-sm"
                    onClick={() => editor.chain().focus().toggleItalic().run()}
                    className={cn(
                        "h-8 w-8",
                        editor.isActive("italic") && "bg-accent"
                    )}
                    title="Italic (Ctrl+I)"
                >
                    <Italic className="h-4 w-4" />
                </Button>

                <Button
                    type="button"
                    variant="ghost"
                    size="icon-sm"
                    onClick={() => editor.chain().focus().toggleUnderline().run()}
                    className={cn(
                        "h-8 w-8",
                        editor.isActive("underline") && "bg-accent"
                    )}
                    title="Underline (Ctrl+U)"
                >
                    <UnderlineIcon className="h-4 w-4" />
                </Button>

                <Button
                    type="button"
                    variant="ghost"
                    size="icon-sm"
                    onClick={() => editor.chain().focus().toggleStrike().run()}
                    className={cn(
                        "h-8 w-8",
                        editor.isActive("strike") && "bg-accent"
                    )}
                    title="Strikethrough"
                >
                    <Strikethrough className="h-4 w-4" />
                </Button>

                <Button
                    type="button"
                    variant="ghost"
                    size="icon-sm"
                    onClick={() => editor.chain().focus().toggleHighlight().run()}
                    className={cn(
                        "h-8 w-8",
                        editor.isActive("highlight") && "bg-accent"
                    )}
                    title="Highlight"
                >
                    <Highlighter className="h-4 w-4" />
                </Button>

                <Button
                    type="button"
                    variant="ghost"
                    size="icon-sm"
                    onClick={() => editor.chain().focus().toggleCode().run()}
                    className={cn(
                        "h-8 w-8",
                        editor.isActive("code") && "bg-accent"
                    )}
                    title="Inline Code"
                >
                    <Code className="h-4 w-4" />
                </Button>

                <div className="w-px h-8 bg-border mx-1" />

                <Button
                    type="button"
                    variant="ghost"
                    size="icon-sm"
                    onClick={() => editor.chain().focus().setTextAlign('left').run()}
                    className={cn(
                        "h-8 w-8",
                        editor.isActive({ textAlign: 'left' }) && "bg-accent"
                    )}
                    title="Align Left"
                >
                    <AlignLeft className="h-4 w-4" />
                </Button>

                <Button
                    type="button"
                    variant="ghost"
                    size="icon-sm"
                    onClick={() => editor.chain().focus().setTextAlign('center').run()}
                    className={cn(
                        "h-8 w-8",
                        editor.isActive({ textAlign: 'center' }) && "bg-accent"
                    )}
                    title="Align Center"
                >
                    <AlignCenter className="h-4 w-4" />
                </Button>

                <Button
                    type="button"
                    variant="ghost"
                    size="icon-sm"
                    onClick={() => editor.chain().focus().setTextAlign('right').run()}
                    className={cn(
                        "h-8 w-8",
                        editor.isActive({ textAlign: 'right' }) && "bg-accent"
                    )}
                    title="Align Right"
                >
                    <AlignRight className="h-4 w-4" />
                </Button>

                <div className="w-px h-8 bg-border mx-1" />

                <Button
                    type="button"
                    variant="ghost"
                    size="icon-sm"
                    onClick={() => editor.chain().focus().toggleBulletList().run()}
                    className={cn(
                        "h-8 w-8",
                        editor.isActive("bulletList") && "bg-accent"
                    )}
                    title="Bullet List"
                >
                    <List className="h-4 w-4" />
                </Button>

                <Button
                    type="button"
                    variant="ghost"
                    size="icon-sm"
                    onClick={() => editor.chain().focus().toggleOrderedList().run()}
                    className={cn(
                        "h-8 w-8",
                        editor.isActive("orderedList") && "bg-accent"
                    )}
                    title="Numbered List"
                >
                    <ListOrdered className="h-4 w-4" />
                </Button>

                <Button
                    type="button"
                    variant="ghost"
                    size="icon-sm"
                    onClick={() => editor.chain().focus().toggleTaskList().run()}
                    className={cn(
                        "h-8 w-8",
                        editor.isActive("taskList") && "bg-accent"
                    )}
                    title="Task List"
                >
                    <CheckSquare className="h-4 w-4" />
                </Button>

                <Button
                    type="button"
                    variant="ghost"
                    size="icon-sm"
                    onClick={() => editor.chain().focus().toggleBlockquote().run()}
                    className={cn(
                        "h-8 w-8",
                        editor.isActive("blockquote") && "bg-accent"
                    )}
                    title="Blockquote"
                >
                    <Quote className="h-4 w-4" />
                </Button>

                <Button
                    type="button"
                    variant="ghost"
                    size="icon-sm"
                    onClick={() => editor.chain().focus().toggleCodeBlock().run()}
                    className={cn(
                        "h-8 w-8",
                        editor.isActive("codeBlock") && "bg-accent"
                    )}
                    title="Code Block"
                >
                    <Code className="h-4 w-4" />
                </Button>

                <Button
                    type="button"
                    variant="ghost"
                    size="icon-sm"
                    onClick={() => editor.chain().focus().setHorizontalRule().run()}
                    className="h-8 w-8"
                    title="Horizontal Rule"
                >
                    <Minus className="h-4 w-4" />
                </Button>

                <div className="w-px h-8 bg-border mx-1" />

                <Button
                    type="button"
                    variant="ghost"
                    size="icon-sm"
                    onClick={() => editor.chain().focus().undo().run()}
                    disabled={!editor.can().undo()}
                    className="h-8 w-8"
                    title="Undo (Ctrl+Z)"
                >
                    <Undo className="h-4 w-4" />
                </Button>

                <Button
                    type="button"
                    variant="ghost"
                    size="icon-sm"
                    onClick={() => editor.chain().focus().redo().run()}
                    disabled={!editor.can().redo()}
                    className="h-8 w-8"
                    title="Redo (Ctrl+Y)"
                >
                    <Redo className="h-4 w-4" />
                </Button>
            </div>

            <div 
                className="flex-1 overflow-auto cursor-text outline-none focus:outline-none focus-visible:outline-none" 
                onClick={() => editor?.chain().focus().run()}
            >
                <EditorContent editor={editor} className="h-full outline-none focus:outline-none" />
            </div>
        </div>
    );
});
