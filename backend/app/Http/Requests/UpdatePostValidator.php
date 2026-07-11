<?php

namespace App\Http\Requests;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Contracts\Validation\Validator;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Http\Exceptions\HttpResponseException;

class UpdatePostValidator extends FormRequest
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
            'content' => 'sometimes|nullable|string|max:5000',
            'image' => 'sometimes|nullable|image|max:5120',
            'visibility' => 'sometimes|in:public,private',
        ];
    }

    public function messages(): array
    {
        return [
            'content.max' => 'Content may not exceed 5000 characters.',
            'image.image' => 'The uploaded file must be an image.',
            'image.max' => 'The image may not be larger than 5MB.',
            'visibility.in' => 'Visibility must be either public or private.',
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
