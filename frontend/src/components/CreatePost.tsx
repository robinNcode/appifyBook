import { useRef, useState } from 'react';
import type { ChangeEvent, FormEvent } from 'react';
import { isAxiosError } from 'axios';
import { createPost } from '../api/services';
import { useAuth } from '../context/AuthContext';
import Avatar from './Avatar';
import type { Post, ValidationErrors, Visibility } from '../types';

const MAX_IMAGE_BYTES = 5 * 1024 * 1024; // 5MB — matches the backend `image|max:5120`.

export default function CreatePost({ onCreated }: { onCreated: (post: Post) => void }) {
    const { user } = useAuth();

    const [content, setContent] = useState('');
    const [visibility, setVisibility] = useState<Visibility>('public');
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

    const resetForm = () => {
        setContent('');
        setVisibility('public');
        clearImage();
        setErrors({});
        setGeneralError(null);
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setGeneralError(null);
        setErrors({});

        // A post needs text or an image (mirrors `required_without:image`).
        if (!content.trim() && !image) {
            setErrors({ content: ['A post must have text or an image.'] });
            return;
        }

        const formData = new FormData();
        if (content.trim()) formData.append('content', content.trim());
        formData.append('visibility', visibility);
        if (image) formData.append('image', image);

        setSubmitting(true);
        try {
            const { data } = await createPost(formData);
            onCreated(data.data);
            resetForm();
        } catch (err) {
            if (isAxiosError(err) && err.response?.status === 422) {
                setErrors(err.response.data.errors || {});
            } else {
                setGeneralError('Could not publish your post. Please try again.');
            }
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="bs-card bs-compose">
            <div className="bs-compose-header">
                <div className="bs-compose-avatar">
                    <Avatar user={user ?? undefined} />
                </div>
                <span className="bs-compose-hello">What's on your mind, {user?.first_name ?? user?.name}?</span>
            </div>

            {generalError && <div className="bs-alert">{generalError}</div>}

            <form onSubmit={handleSubmit}>
                <textarea
                    className="bs-compose-textarea"
                    placeholder="Share something with your friends…"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    rows={3}
                    maxLength={5000}
                />
                {errors.content?.[0] && <span className="bs-field-error">{errors.content[0]}</span>}

                {preview && (
                    <div className="bs-image-preview">
                        <img src={preview} alt="Selected" />
                        <button type="button" onClick={clearImage} aria-label="Remove image">
                            ×
                        </button>
                    </div>
                )}
                {errors.image?.[0] && <span className="bs-field-error">{errors.image[0]}</span>}

                <div className="bs-compose-actions">
                    <label className="bs-compose-photo">
                        <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/*"
                            onChange={handleImageChange}
                            hidden
                        />
                        📷 Photo
                    </label>

                    <select
                        className="bs-visibility-select"
                        value={visibility}
                        onChange={(e) => setVisibility(e.target.value as Visibility)}
                    >
                        <option value="public">Public</option>
                        <option value="private">Private</option>
                    </select>

                    <button type="submit" className="bs-btn-primary" disabled={submitting}>
                        {submitting ? <span className="bs-spinner" /> : 'Post'}
                    </button>
                </div>
            </form>
        </div>
    );
}
