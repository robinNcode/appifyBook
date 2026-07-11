<?php

namespace App\Http\Requests;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Contracts\Validation\Validator;
use Illuminate\Http\Exceptions\HttpResponseException;

class RegistrationValidator extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'first_name' => 'required|string|min:3|max:255',
            'last_name' => 'required|string|min:3|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:8|max:16',
            'confirm_password' => 'required|string|same:password'
        ];
    }

    public function messages(): array
    {
        return [
            'first_name.required' => 'First name is required',
            'first_name.min' => 'First name must be at least 3 characters long',
            'first_name.max' => 'First name must be at most 255 characters long',
            'last_name.required' => 'Last name is required',
            'last_name.min' => 'Last name must be at least 3 characters long',
            'last_name.max' => 'Last name must be at most 255 characters long',
            'email.required' => 'Email is required',
            'email.email' => 'Email must be a valid email address',
            'email.max' => 'Email must be at most 255 characters long',
            'email.unique' => 'Email already exists',
            'password.required' => 'Password is required',
            'password.min' => 'Password must be at least 8 characters long',
            'password.max' => 'Password must be at most 16 characters long',
            'confirm_password.required' => 'Confirm password is required',
            'confirm_password.same' => 'Confirm password must match password',
        ];
    }

    protected function failedValidation(Validator $validator)
    {
        throw new HttpResponseException(
            response()->json([
                'message' => 'Validation failed',
                'errors' => $validator->errors(),
            ], 422)
        );
    }
}
