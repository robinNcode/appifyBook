<?php

namespace App\Http\Requests;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Contracts\Validation\Validator;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Http\Exceptions\HttpResponseException;

class StoreCommentValidator extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    /**
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            // A comment needs text or an image (or both).
            'content' => 'required_without:image|nullable|string|max:2000',
            'image' => 'nullable|image|max:5120',
            // A reply points at an existing comment; top-level comments omit it.
            'parent_id' => 'nullable|integer|exists:comments,id',
        ];
    }

    public function messages(): array
    {
        return [
            'content.required_without' => 'A comment must have text or an image.',
            'content.max' => 'A comment may not exceed 2000 characters.',
            'image.image' => 'The uploaded file must be an image.',
            'image.max' => 'The image may not be larger than 5MB.',
            'parent_id.exists' => 'The comment you are replying to does not exist.',
        ];
    }

    protected function failedValidation(Validator $validator)
    {
        throw new HttpResponseException(response()->json([
            'message' => 'Validation failed',
            'errors' => $validator->errors(),
        ], 422));
    }
}
