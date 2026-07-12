import { useRef, useState } from 'react';
import type { ChangeEvent, FormEvent } from 'react';
import { isAxiosError } from 'axios';
import { createComment } from '../api/services';
import { useAuth } from '../context/AuthContext';
import Avatar from './Avatar';
import type { Comment, ValidationErrors } from '../types';

const MAX_IMAGE_BYTES = 5 * 1024 * 1024; // 5MB — matches the backend `image|max:5120`.

interface CommentFormProps {
    postId: number;
    /** Set when replying to a comment; omit for a top-level comment. */
    parentId?: number;
    onCreated: (comment: Comment) => void;
    placeholder?: string;
    autoFocus?: boolean;
}

export default function CommentForm({
    postId,
    parentId,
    onCreated,
    placeholder = 'Write a comment…',
    autoFocus = false,
}: CommentFormProps) {
    const { user } = useAuth();

    const [content, setContent] = useState('');
    const [image, setImage] = useState<File | null>(null);
    const [preview, setPreview] = useState<string | null>(null);

    const [errors, setErrors] = useState<ValidationErrors>({});
    const [generalError, setGeneralError] = useState<string | null>(null);
    const [submitting, setSubmitting] = useState(false);

    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0] ?? null;
        setErrors((prev) => ({ ...prev, image: [] }));

        if (!file) {
            clearImage();
            return;
        }
        if (!file.type.startsWith('image/')) {
            setErrors((prev) => ({ ...prev, image: ['The uploaded file must be an image.'] }));
            return;
        }
        if (file.size > MAX_IMAGE_BYTES) {
            setErrors((prev) => ({ ...prev, image: ['The image may not be larger than 5MB.'] }));
            return;
        }

        setImage(file);
        setPreview(URL.createObjectURL(file));
    };

    const clearImage = () => {
        if (preview) URL.revokeObjectURL(preview);
        setImage(null);
        setPreview(null);
        if (fileInputRef.current) fileInputRef.current.value = '';
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setGeneralError(null);
        setErrors({});

        // A comment needs text or an image (mirrors `required_without:image`).
        if (!content.trim() && !image) {
            setErrors({ content: ['A comment must have text or an image.'] });
            return;
        }

        const formData = new FormData();
        if (content.trim()) formData.append('content', content.trim());
        if (image) formData.append('image', image);
        if (parentId) formData.append('parent_id', String(parentId));

        setSubmitting(true);
        try {
            const { data } = await createComment(postId, formData);
            onCreated(data.data);
            setContent('');
            clearImage();
        } catch (err) {
            if (isAxiosError(err) && err.response?.status === 422) {
                setErrors(err.response.data.errors || {});
            } else {
                setGeneralError('Could not post your comment. Please try again.');
            }
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <form className="bs-comment-form" onSubmit={handleSubmit}>
            <div className="bs-comment-form-avatar">
                <Avatar user={user ?? undefined} />
            </div>

            <div className="bs-comment-form-body">
                <div className="bs-comment-input-row">
                    <input
                        className="bs-comment-input"
                        type="text"
                        placeholder={placeholder}
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        maxLength={2000}
                        autoFocus={autoFocus}
                    />
                    <label className="bs-comment-photo" title="Add a photo">
                        <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/*"
                            onChange={handleImageChange}
                            hidden
                        />
                        📷
                    </label>
                    <button type="submit" className="bs-btn-primary bs-comment-send" disabled={submitting}>
                        {submitting ? <span className="bs-spinner" /> : 'Send'}
                    </button>
                </div>

                {errors.content?.[0] && <span className="bs-field-error">{errors.content[0]}</span>}
                {errors.image?.[0] && <span className="bs-field-error">{errors.image[0]}</span>}
                {generalError && <span className="bs-field-error">{generalError}</span>}

                {preview && (
                    <div className="bs-image-preview">
                        <img src={preview} alt="Selected" />
                        <button type="button" onClick={clearImage} aria-label="Remove image">
                            ×
                        </button>
                    </div>
                )}
            </div>
        </form>
    );
}
